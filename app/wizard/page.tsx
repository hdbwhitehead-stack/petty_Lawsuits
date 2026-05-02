'use client'
import { Suspense, useState, useCallback, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getOrCreateAnonKey } from '@/lib/anonymous'
import ProgressSidebar from '@/components/wizard/ProgressSidebar'
import DefendantStep from '@/components/wizard/DefendantStep'
import ClaimantStep from '@/components/wizard/ClaimantStep'
import IncidentStep from '@/components/wizard/IncidentStep'
import EvidenceStep from '@/components/wizard/EvidenceStep'

type StartOverConfirm = 'idle' | 'confirming'

export default function WizardPage() {
  return (
    <Suspense>
      <WizardContent />
    </Suspense>
  )
}

function WizardContent() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showEvidenceAuthGate, setShowEvidenceAuthGate] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  const [draftToast, setDraftToast] = useState<'saved' | 'error' | null>(null)
  const [startOverState, setStartOverState] = useState<StartOverConfirm>('idle')
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check auth state on mount
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user)
    })
  }, [])

  // Load draft from query param on mount
  useEffect(() => {
    const draftId = searchParams.get('draft')
    if (!draftId) return

    const supabase = createClient()
    supabase
      .from('documents')
      .select('current_content')
      .eq('id', draftId)
      .eq('status', 'draft')
      .maybeSingle()
      .then(({ data }) => {
        if (!data?.current_content) return
        const content = data.current_content as Record<string, unknown>
        const savedStep = typeof content._currentStep === 'number' ? content._currentStep : 0
        // Strip internal draft keys before restoring
        const { _draft, _templateId, _currentStep, ...wizardAnswers } = content as Record<string, string>
        void _draft
        void _templateId
        void _currentStep
        setAnswers(wizardAnswers)
        setStep(savedStep)
      })
  }, [searchParams])

  const showToast = useCallback((type: 'saved' | 'error') => {
    setDraftToast(type)
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => setDraftToast(null), 3000)
  }, [])

  const updateAnswers = useCallback((updates: Record<string, string>) => {
    setAnswers(prev => ({ ...prev, ...updates }))
  }, [])

  const saveDraft = useCallback(async () => {
    if (!answers.claim_type) return
    setSavingDraft(true)
    try {
      const res = await fetch('/api/documents/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: answers.claim_type,
          wizardAnswers: answers,
          currentStep: step,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      showToast('saved')
    } catch {
      showToast('error')
    } finally {
      setSavingDraft(false)
    }
  }, [answers, step, showToast])

  const handleStartOver = useCallback(() => {
    if (isLoggedIn && Object.keys(answers).length > 0) {
      setStartOverState('confirming')
    } else {
      setAnswers({})
      setStep(0)
    }
  }, [isLoggedIn, answers])

  const confirmStartOver = useCallback(async (saveFirst: boolean) => {
    if (saveFirst) {
      await saveDraft()
    }
    setStartOverState('idle')
    setAnswers({})
    setStep(0)
  }, [saveDraft])

  const handleGenerate = useCallback(async (files: File[]) => {
    setLoading(true)
    setError(null)

    // Evidence files metadata — populated after successful uploads
    type EvidenceFileMeta = { path: string; filename: string; size: number; mime: string }
    const evidenceFiles: EvidenceFileMeta[] = []

    // Upload evidence files to Supabase Storage (authenticated users only)
    // Path pattern: <user_id>/<document_id_placeholder>/<original_filename>
    // A stable document_id isn't available until after generation, so we use a
    // session-scoped upload folder keyed by timestamp and claim_type.
    if (files.length > 0 && isLoggedIn) {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const uploadFolder = `${user.id}/${Date.now()}_${answers.claim_type ?? 'doc'}`
        const uploads = files.map(async (file) => {
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
          const path = `${uploadFolder}/${safeName}`
          const { error: uploadError } = await supabase.storage
            .from('evidence')
            .upload(path, file, { upsert: true })
          if (uploadError) {
            console.error('Evidence upload failed for', file.name, uploadError.message)
            return null
          }
          return { path, filename: file.name, size: file.size, mime: file.type } satisfies EvidenceFileMeta
        })
        const results = await Promise.all(uploads)
        for (const r of results) {
          if (r) evidenceFiles.push(r)
        }
      }
    }

    // NOTE: evidenceFiles metadata is passed to /api/generate but the documents
    // table does NOT yet have an evidence_files column to persist it.
    // See report for migration recommendation. The data is included in the
    // request body today and will be silently ignored server-side until the
    // column is added.
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: answers.claim_type,
          wizardAnswers: answers,
          evidenceFiles,
          anonymousKey: getOrCreateAnonKey(),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Generation failed')
      }

      const { documentId } = await res.json()
      router.push(`/preview/${documentId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [answers, router, isLoggedIn])

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <ProgressSidebar currentStep={step} answers={answers} onStepClick={setStep} />

      <main className="flex-1 max-w-3xl mx-auto px-6 py-10 md:py-16">
        {/* Save Draft / Start Over toolbar — only shown when user is logged in */}
        {isLoggedIn && (
          <div className="flex justify-end gap-3 mb-6">
            <button
              type="button"
              onClick={handleStartOver}
              className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Start Over
            </button>
            <button
              type="button"
              onClick={saveDraft}
              disabled={savingDraft || !answers.claim_type}
              className="text-sm px-4 py-1.5 rounded-full border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {savingDraft ? 'Saving…' : 'Save Draft'}
            </button>
          </div>
        )}

        {step === 0 && (
          <DefendantStep answers={answers} onUpdate={updateAnswers} onNext={() => setStep(1)} />
        )}
        {step === 1 && (
          <ClaimantStep answers={answers} onUpdate={updateAnswers} onNext={() => setStep(2)} onBack={() => setStep(0)} />
        )}
        {step === 2 && (
          <IncidentStep answers={answers} onUpdate={updateAnswers} onNext={() => setStep(3)} onBack={() => setStep(1)} />
        )}
        {step === 3 && (
          <EvidenceStep
            answers={answers}
            onGenerate={handleGenerate}
            loading={loading}
            error={error}
            onBack={() => setStep(2)}
            isAuthenticated={isLoggedIn}
            onAuthRequired={() => setShowEvidenceAuthGate(true)}
          />
        )}
      </main>

      {/* Save draft toast */}
      {draftToast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-full text-sm font-medium shadow-lg transition-all ${
            draftToast === 'saved'
              ? 'bg-[var(--foreground)] text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {draftToast === 'saved' ? 'Draft saved' : 'Could not save draft — please try again'}
        </div>
      )}

      {/* Evidence sign-up gate — shown when anonymous user tries to attach a file */}
      {showEvidenceAuthGate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl p-8 max-w-sm w-full shadow-xl text-center">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">Create a free account to attach files</h2>
            <p className="text-sm text-[var(--muted)] mb-6">
              Evidence uploads are available to signed-in users. Create a free account — it only takes a moment.
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="/signup"
                className="w-full bg-[var(--foreground)] text-white text-sm font-medium rounded-full px-5 py-2.5 hover:opacity-90 transition-opacity text-center"
              >
                Create free account
              </a>
              <a
                href="/login"
                className="w-full border border-[var(--border)] text-[var(--foreground)] text-sm font-medium rounded-full px-5 py-2.5 hover:border-[var(--accent)] transition-colors text-center"
              >
                Log in
              </a>
              <button
                type="button"
                onClick={() => setShowEvidenceAuthGate(false)}
                className="w-full text-[var(--muted)] text-sm py-2 hover:text-[var(--foreground)] transition-colors"
              >
                Continue without files
              </button>
            </div>
            <p className="text-xs text-[var(--muted)] mt-4">You can still generate your document without uploading evidence.</p>
          </div>
        </div>
      )}

      {/* Start Over confirmation dialog */}
      {startOverState === 'confirming' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl p-8 max-w-sm w-full shadow-xl">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">Save before starting over?</h2>
            <p className="text-sm text-[var(--muted)] mb-6">
              You can save your progress as a draft and come back to it later from your dashboard.
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => confirmStartOver(true)}
                disabled={savingDraft || !answers.claim_type}
                className="w-full bg-[var(--foreground)] text-white text-sm font-medium rounded-full px-5 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                Save &amp; Start Over
              </button>
              <button
                type="button"
                onClick={() => confirmStartOver(false)}
                className="w-full border border-[var(--border)] text-[var(--foreground)] text-sm font-medium rounded-full px-5 py-2.5 hover:border-red-400 hover:text-red-600 transition-colors"
              >
                Discard &amp; Start Over
              </button>
              <button
                type="button"
                onClick={() => setStartOverState('idle')}
                className="w-full text-[var(--muted)] text-sm py-2 hover:text-[var(--foreground)] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

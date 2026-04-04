'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getOrCreateAnonKey } from '@/lib/anonymous'
import ProgressSidebar from '@/components/wizard/ProgressSidebar'
import DefendantStep from '@/components/wizard/DefendantStep'
import ClaimantStep from '@/components/wizard/ClaimantStep'
import IncidentStep from '@/components/wizard/IncidentStep'
import EvidenceStep from '@/components/wizard/EvidenceStep'

export default function WizardPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const updateAnswers = useCallback((updates: Record<string, string>) => {
    setAnswers(prev => ({ ...prev, ...updates }))
  }, [])

  const handleGenerate = useCallback(async (files: File[]) => {
    setLoading(true)
    setError(null)

    // Upload evidence files to Supabase Storage
    const evidenceFilenames: string[] = []
    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)
      // For MVP, we just track filenames — full upload integration comes later
      evidenceFilenames.push(file.name)
    }

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: answers.claim_type,
          wizardAnswers: answers,
          evidenceFilenames,
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
  }, [answers, router])

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <ProgressSidebar currentStep={step} answers={answers} onStepClick={setStep} />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-10 md:py-16">
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
          <EvidenceStep answers={answers} onGenerate={handleGenerate} loading={loading} error={error} onBack={() => setStep(2)} />
        )}
      </main>
    </div>
  )
}

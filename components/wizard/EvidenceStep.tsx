'use client'
import { useState, useCallback } from 'react'
import { EVIDENCE_REQUIREMENTS } from '@/lib/documents/evidence-requirements'
import { StickerButton } from '@/components/ui/StickerButton'
import { Highlight } from '@/components/ui/Highlight'

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024
const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/heic', 'image/gif', 'image/webp', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

type Props = {
  answers: Record<string, string>
  onGenerate: (files: File[]) => void
  loading: boolean
  error: string | null
  onBack?: () => void
  onAuthRequired?: () => void
  isAuthenticated: boolean
}

export default function EvidenceStep({ answers, onGenerate, loading, error, onBack, onAuthRequired, isAuthenticated }: Props) {
  const [files, setFiles] = useState<File[]>([])
  const [skipEvidence, setSkipEvidence] = useState(false)
  const [fileErrors, setFileErrors] = useState<string[]>([])

  const claimType = answers.claim_type ?? ''
  const requirements = EVIDENCE_REQUIREMENTS[claimType] ?? []
  const requiredItems = requirements.filter(r => r.required)
  const hasAllRequired = requiredItems.length === 0 || skipEvidence || files.length > 0

  function validateAndAddFiles(incoming: File[]) {
    const errors: string[] = []
    const valid: File[] = []
    for (const f of incoming) {
      if (f.size > MAX_FILE_SIZE_BYTES) {
        errors.push(`"${f.name}" is larger than 10 MB and was skipped.`)
        continue
      }
      if (!ACCEPTED_MIME_TYPES.includes(f.type) && f.type !== '') {
        errors.push(`"${f.name}" is not an accepted file type and was skipped.`)
        continue
      }
      valid.push(f)
    }
    setFileErrors(errors)
    setFiles(prev => [...prev, ...valid].slice(0, 10))
  }

  function handleInteraction() {
    if (!isAuthenticated) { onAuthRequired?.(); return false }
    return true
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!handleInteraction()) return
    validateAndAddFiles(Array.from(e.dataTransfer.files).slice(0, 10))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    validateAndAddFiles(Array.from(e.target.files).slice(0, 10))
    e.target.value = ''
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  function handleDropZoneClick() {
    if (!handleInteraction()) return
    document.getElementById('file-input')?.click()
  }

  function removeFile(index: number) {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div
            className="inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider mb-3"
            style={{
              background: 'var(--accent)',
              color: '#fff',
              border: '2px solid var(--foreground)',
              borderRadius: '999px',
              boxShadow: '2px 2px 0 #1A1814',
            }}
          >
            STEP 04 OF 04
          </div>
          <h2 className="text-2xl font-display font-extrabold">
            Show us the <Highlight>receipts</Highlight>
          </h2>
        </div>
        <p
          className="text-base hidden sm:block flex-shrink-0 mt-8"
          style={{ fontFamily: 'var(--font-marker)', color: 'var(--muted)' }}
        >
          you&apos;re nearly there! ✦
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={handleDropZoneClick}
        className="rounded-lg p-8 text-center cursor-pointer"
        style={{
          border: '2px dashed var(--foreground)',
          boxShadow: '3px 3px 0 #1A1814',
          background: 'var(--lemon-tint)',
        }}
      >
        {!isAuthenticated ? (
          <>
            <p className="text-base font-bold">Sign in to attach evidence files</p>
            <p className="text-sm text-[var(--muted)] mt-1">Create a free account to upload photos, receipts, and PDFs</p>
          </>
        ) : (
          <>
            <p className="text-base font-bold">Drag &amp; drop files here, or click to browse</p>
            <p className="text-sm text-[var(--muted)] mt-1">PDF, PNG, JPG, HEIC, DOCX — max 10 MB per file, 10 files total</p>
          </>
        )}
        <input
          id="file-input"
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg,.heic,.docx,image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={!isAuthenticated}
        />
      </div>

      {fileErrors.length > 0 && (
        <ul className="space-y-1">
          {fileErrors.map((msg, i) => <li key={i} className="text-sm text-red-600">{msg}</li>)}
        </ul>
      )}

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((f, i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-lg px-4 py-2.5"
              style={{ border: '2px solid var(--foreground)', background: 'var(--card)', boxShadow: '2px 2px 0 #1A1814' }}
            >
              <span className="text-sm truncate">{f.name} ({(f.size / 1024 / 1024).toFixed(1)} MB)</span>
              <button onClick={() => removeFile(i)} className="text-red-500 text-sm ml-2 hover:underline flex-shrink-0">Remove</button>
            </li>
          ))}
        </ul>
      )}

      {requirements.length > 0 && (
        <div
          className="rounded-lg p-5"
          style={{ border: '2px solid var(--foreground)', background: 'var(--card)', boxShadow: '3px 3px 0 #1A1814' }}
        >
          <h3 className="font-bold mb-3 text-base">Evidence checklist for {claimType.replace(/-/g, ' ')}:</h3>
          <ul className="space-y-1.5">
            {requirements.map(req => (
              <li key={req.key} className="text-sm flex items-center gap-2">
                <span style={{ color: req.required ? 'var(--accent)' : 'var(--muted)' }}>
                  {req.required ? '●' : '○'}
                </span>
                <span>{req.label}</span>
                {req.required && <span className="text-xs text-[var(--muted)]">(required)</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={skipEvidence}
          onChange={e => setSkipEvidence(e.target.checked)}
          className="accent-[var(--accent)]"
        />
        I&apos;ve attached what I have
      </label>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-3">
        {onBack && (
          <StickerButton onClick={onBack} disabled={loading} variant="ghost">← Back</StickerButton>
        )}
        <StickerButton
          onClick={() => onGenerate(files)}
          disabled={!hasAllRequired || loading}
          variant="primary"
          size="lg"
        >
          {loading ? 'Generating…' : 'Cite Their Nonsense · +200 XP'}
        </StickerButton>
      </div>
    </div>
  )
}

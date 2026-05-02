'use client'
import { useState, useCallback } from 'react'
import { EVIDENCE_REQUIREMENTS } from '@/lib/documents/evidence-requirements'

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB
const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/heic', 'image/gif', 'image/webp', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

type Props = {
  answers: Record<string, string>
  onGenerate: (files: File[]) => void
  loading: boolean
  error: string | null
  onBack?: () => void
  /** Called when an anonymous user tries to attach a file — parent shows sign-up gate */
  onAuthRequired?: () => void
  /** Whether the current user is authenticated */
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
    if (!isAuthenticated) {
      onAuthRequired?.()
      return false
    }
    return true
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!handleInteraction()) return
    const dropped = Array.from(e.dataTransfer.files).slice(0, 10)
    validateAndAddFiles(dropped)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const selected = Array.from(e.target.files).slice(0, 10)
    validateAndAddFiles(selected)
    // reset input so same file can be re-added after removal
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
      <div>
        <p className="text-sm font-medium text-[var(--accent)] mb-2">Step 4 of 4</p>
        <h2 className="text-2xl">Upload your evidence</h2>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className="border-2 border-dashed border-[var(--border)] rounded-lg p-8 text-center cursor-pointer hover:border-[var(--accent)] transition-colors bg-[var(--card)]"
        onClick={handleDropZoneClick}
      >
        {!isAuthenticated ? (
          <>
            <p className="text-base text-[var(--foreground)]">Sign in to attach evidence files</p>
            <p className="text-sm text-[var(--muted)] mt-1">Create a free account to upload photos, receipts, and PDFs</p>
          </>
        ) : (
          <>
            <p className="text-base text-[var(--foreground)]">Drag &amp; drop files here, or click to browse</p>
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
          {fileErrors.map((msg, i) => (
            <li key={i} className="text-sm text-red-600">{msg}</li>
          ))}
        </ul>
      )}

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between border border-[var(--border)] rounded-lg px-4 py-2.5 bg-[var(--card)]">
              <span className="text-sm text-[var(--foreground)] truncate">{f.name} ({(f.size / 1024 / 1024).toFixed(1)} MB)</span>
              <button onClick={() => removeFile(i)} className="text-red-500 text-sm ml-2 hover:underline">Remove</button>
            </li>
          ))}
        </ul>
      )}

      {requirements.length > 0 && (
        <div className="border border-[var(--border)] rounded-lg p-6 bg-[var(--card)]">
          <h3 className="font-medium mb-3 text-base text-[var(--foreground)]">Evidence checklist for {claimType.replace(/-/g, ' ')}:</h3>
          <ul className="space-y-1.5">
            {requirements.map(req => (
              <li key={req.key} className="text-sm flex items-center gap-2">
                <span className={req.required ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}>
                  {req.required ? '\u25CF' : '\u25CB'}
                </span>
                <span className="text-[var(--foreground)]">{req.label}</span>
                {req.required && <span className="text-xs text-[var(--muted)]">(required)</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
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
          <button onClick={onBack} disabled={loading} className="border border-[var(--foreground)] text-[var(--foreground)] rounded-full px-8 py-3 text-base font-medium disabled:opacity-50 hover:opacity-90 transition-opacity">
            &larr; Back
          </button>
        )}
        <button
          onClick={() => onGenerate(files)}
          disabled={!hasAllRequired || loading}
          className="bg-[var(--foreground)] text-white rounded-full px-8 py-3 text-base font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          {loading ? 'Generating your document...' : 'Generate Demand Letter'}
        </button>
      </div>
    </div>
  )
}

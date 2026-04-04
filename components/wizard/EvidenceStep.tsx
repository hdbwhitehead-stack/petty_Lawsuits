'use client'
import { useState, useCallback } from 'react'
import { EVIDENCE_REQUIREMENTS } from '@/lib/documents/evidence-requirements'

type Props = {
  answers: Record<string, string>
  onGenerate: (files: File[]) => void
  loading: boolean
  error: string | null
  onBack?: () => void
}

export default function EvidenceStep({ answers, onGenerate, loading, error, onBack }: Props) {
  const [files, setFiles] = useState<File[]>([])
  const [skipEvidence, setSkipEvidence] = useState(false)

  const claimType = answers.claim_type ?? ''
  const requirements = EVIDENCE_REQUIREMENTS[claimType] ?? []
  const requiredItems = requirements.filter(r => r.required)
  const hasAllRequired = requiredItems.length === 0 || skipEvidence || files.length > 0

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const dropped = Array.from(e.dataTransfer.files).slice(0, 10)
    setFiles(prev => [...prev, ...dropped].slice(0, 10))
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).slice(0, 10)
      setFiles(prev => [...prev, ...selected].slice(0, 10))
    }
  }, [])

  function removeFile(index: number) {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-[var(--accent)] mb-2 font-['DM_Sans']">Step 4 of 4</p>
        <h2 className="text-2xl">Upload your evidence</h2>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className="border-2 border-dashed border-[var(--border)] rounded-lg p-8 text-center cursor-pointer hover:border-[var(--accent)] transition-colors bg-[var(--card)]"
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <p className="text-base text-[var(--foreground)]">Drag & drop files here, or click to browse</p>
        <p className="text-sm text-[var(--muted)] mt-1 font-['DM_Sans']">PDF, PNG, JPG, HEIC, DOCX — max 10MB per file, 10 files total</p>
        <input
          id="file-input"
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg,.heic,.docx"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between border border-[var(--border)] rounded-lg px-4 py-2.5 bg-[var(--card)]">
              <span className="text-sm text-[var(--foreground)] truncate font-['DM_Sans']">{f.name} ({(f.size / 1024 / 1024).toFixed(1)} MB)</span>
              <button onClick={() => removeFile(i)} className="text-red-500 text-sm ml-2 font-['DM_Sans'] hover:underline">Remove</button>
            </li>
          ))}
        </ul>
      )}

      {requirements.length > 0 && (
        <div className="border border-[var(--border)] rounded-lg p-6 bg-[var(--card)]">
          <h3 className="font-medium mb-3 text-base text-[var(--foreground)]">Evidence checklist for {claimType.replace(/-/g, ' ')}:</h3>
          <ul className="space-y-1.5">
            {requirements.map(req => (
              <li key={req.key} className="text-sm flex items-center gap-2 font-['DM_Sans']">
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

      <label className="flex items-center gap-2 text-sm text-[var(--foreground)] font-['DM_Sans']">
        <input
          type="checkbox"
          checked={skipEvidence}
          onChange={e => setSkipEvidence(e.target.checked)}
          className="accent-[var(--accent)]"
        />
        I&apos;ve attached what I have
      </label>

      {error && <p className="text-red-600 text-sm font-['DM_Sans']">{error}</p>}

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

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
      <h2 className="text-2xl font-bold">Upload your evidence</h2>

      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-gray-400"
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <p className="text-gray-500">Drag & drop files here, or click to browse</p>
        <p className="text-sm text-gray-400 mt-1">PDF, PNG, JPG, HEIC, DOCX — max 10MB per file, 10 files total</p>
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
            <li key={i} className="flex items-center justify-between border rounded px-3 py-2">
              <span className="text-sm truncate">{f.name} ({(f.size / 1024 / 1024).toFixed(1)} MB)</span>
              <button onClick={() => removeFile(i)} className="text-red-500 text-sm ml-2">Remove</button>
            </li>
          ))}
        </ul>
      )}

      {requirements.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">Evidence checklist for {claimType.replace(/-/g, ' ')}:</h3>
          <ul className="space-y-1">
            {requirements.map(req => (
              <li key={req.key} className="text-sm flex items-center gap-2">
                <span className={req.required ? 'text-red-500' : 'text-gray-400'}>
                  {req.required ? '●' : '○'}
                </span>
                {req.label} {req.required && <span className="text-xs text-gray-400">(required)</span>}
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
        />
        I&apos;ve attached what I have
      </label>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-3">
        {onBack && (
          <button onClick={onBack} disabled={loading} className="border rounded px-6 py-3 disabled:opacity-50">
            &larr; Back
          </button>
        )}
        <button
          onClick={() => onGenerate(files)}
          disabled={!hasAllRequired || loading}
          className="bg-black text-white rounded px-6 py-3 disabled:opacity-50"
        >
          {loading ? 'Generating your document…' : 'Generate Demand Letter'}
        </button>
      </div>
    </div>
  )
}

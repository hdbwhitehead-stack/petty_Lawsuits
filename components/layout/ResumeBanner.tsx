'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ResumeBanner() {
  const [documentId, setDocumentId] = useState<string | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const key = localStorage.getItem('petty_anon_doc_key')
    if (!key) return

    fetch(`/api/documents/anon-status?key=${encodeURIComponent(key)}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.id && data?.status === 'ready') {
          setDocumentId(data.id)
        }
      })
      .catch(() => {})
  }, [])

  if (!documentId || dismissed) return null

  return (
    <div className="bg-[var(--accent-light)] border-b border-[var(--accent)]/30">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <p className="text-sm text-[var(--foreground)]">
          You have an unfinished document.{' '}
          <Link
            href={`/preview/${documentId}`}
            className="font-medium text-[var(--accent)] underline underline-offset-2 hover:opacity-80"
          >
            Continue to document →
          </Link>
        </p>
        <button
          onClick={() => setDismissed(true)}
          className="text-[var(--muted)] hover:text-[var(--foreground)] text-xl leading-none flex-shrink-0"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  )
}

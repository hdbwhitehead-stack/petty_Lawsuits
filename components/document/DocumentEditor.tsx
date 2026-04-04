'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { DocumentTemplate } from '@/lib/documents/templates'
import { DocumentView } from './DocumentView'

type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error'

type Props = {
  documentId: string
  template: DocumentTemplate
  currentContent: Record<string, string>
  originalContent: Record<string, string>
}

export function DocumentEditor({ documentId, template, currentContent, originalContent }: Props) {
  const [values, setValues] = useState<Record<string, string>>(currentContent)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved')
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const save = useCallback(async (content: Record<string, string>) => {
    setSaveStatus('saving')
    try {
      const res = await fetch(`/api/documents/${documentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_content: content }),
      })
      if (!res.ok) throw new Error('Save failed')
      setSaveStatus('saved')
    } catch {
      setSaveStatus('error')
    }
  }, [documentId])

  // Auto-save every 30 seconds when there are unsaved changes
  useEffect(() => {
    if (saveStatus !== 'unsaved') return
    autoSaveTimer.current = setTimeout(() => save(values), 30_000)
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    }
  }, [saveStatus, values, save])

  function handleChange(key: string, value: string) {
    setValues(prev => ({ ...prev, [key]: value }))
    setSaveStatus('unsaved')
  }

  function handleBlur() {
    if (saveStatus === 'unsaved') save(values)
  }

  async function handleRestoreOriginal() {
    if (!confirm('Restore the original AI-generated content? Your edits will be lost.')) return
    setValues(originalContent)
    await save(originalContent)
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <SaveStatusBadge status={saveStatus} />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRestoreOriginal}
            className="text-sm text-[var(--muted)] border border-[var(--border)] rounded px-3 py-1.5 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
          >
            Restore original
          </button>
          <button
            onClick={() => save(values)}
            disabled={saveStatus === 'saving' || saveStatus === 'saved'}
            className="text-sm bg-[var(--foreground)] text-white rounded px-4 py-1.5 hover:opacity-80 transition-opacity disabled:opacity-40"
          >
            Save
          </button>
        </div>
      </div>

      {/* Document */}
      <DocumentView
        template={template}
        values={values}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      {/* Download buttons */}
      <div className="flex items-center gap-3 mt-6">
        <a
          href={`/api/documents/${documentId}/download?format=pdf`}
          className="flex items-center gap-2 bg-[var(--accent)] text-white rounded px-4 py-2 text-sm font-medium hover:bg-[var(--accent-dark)] transition-colors"
        >
          Download PDF
        </a>
        <a
          href={`/api/documents/${documentId}/download?format=word`}
          className="flex items-center gap-2 border border-[var(--border)] text-[var(--foreground)] rounded px-4 py-2 text-sm font-medium hover:border-[var(--accent)] transition-colors"
        >
          Download Word
        </a>
      </div>
    </div>
  )
}

function SaveStatusBadge({ status }: { status: SaveStatus }) {
  if (status === 'saving') return <span className="text-sm text-[var(--muted)]">Saving…</span>
  if (status === 'saved') return <span className="text-sm text-[var(--muted)]">Saved</span>
  if (status === 'error') return <span className="text-sm text-red-500">Save failed — try again</span>
  return <span className="text-sm text-[var(--accent)]">Unsaved changes</span>
}

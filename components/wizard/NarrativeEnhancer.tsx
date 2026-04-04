'use client'
import { useState, useCallback } from 'react'

type Props = {
  description: string
  onAccept: (text: string) => void
}

const ENHANCE_LIMIT = 10

export default function NarrativeEnhancer({ description, onAccept }: Props) {
  const [enhanced, setEnhanced] = useState('')
  const [editing, setEditing] = useState(false)
  const [editDraft, setEditDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [usesRemaining, setUsesRemaining] = useState(ENHANCE_LIMIT)

  const canEnhance = description.trim().length >= 20 && usesRemaining > 0

  const handleEnhance = useCallback(async () => {
    if (!canEnhance || loading) return
    setLoading(true)
    setUsesRemaining(prev => prev - 1)
    setError(false)
    setEnhanced('')
    setEditing(false)

    try {
      const res = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      })
      if (res.ok) {
        const data = await res.json()
        setEnhanced(data.enhanced)
      } else {
        setError(true)
        setUsesRemaining(prev => prev + 1)
      }
    } catch {
      setError(true)
      setUsesRemaining(prev => prev + 1)
    } finally {
      setLoading(false)
    }
  }, [description, canEnhance, loading])

  function handleUseEnhanced() {
    onAccept(enhanced)
    setEnhanced('')
    setEditing(false)
  }

  function handleEditEnhanced() {
    setEditing(true)
    setEditDraft(enhanced)
  }

  function handleUseEdited() {
    onAccept(editDraft)
    setEnhanced('')
    setEditing(false)
  }

  function handleDismiss() {
    setEnhanced('')
    setEditing(false)
    setEditDraft('')
  }

  // Not enough text yet — show nothing
  if (!canEnhance && !enhanced && !loading) return null

  return (
    <div className="mt-3 space-y-3">
      {/* Enhance button — shown when no result is displayed */}
      {!enhanced && !loading && usesRemaining > 0 && (
        <button
          type="button"
          onClick={handleEnhance}
          className="text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-dark)] transition-colors flex items-center gap-1.5"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          Enhance with AI
          {usesRemaining < ENHANCE_LIMIT && (
            <span className="text-xs text-[var(--muted)]">({usesRemaining} left)</span>
          )}
        </button>
      )}

      {/* Limit reached */}
      {!enhanced && !loading && usesRemaining <= 0 && description.trim().length >= 20 && (
        <p className="text-sm text-[var(--muted)]">
          Enhancement limit reached. You can still edit your description manually.
        </p>
      )}

      {/* Loading state */}
      {loading && (
        <div className="border border-[var(--border)] rounded-lg p-4 bg-[var(--accent-light)]">
          <p className="text-sm text-[var(--accent)] flex items-center gap-2">
            <span className="inline-block w-3 h-3 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
            Enhancing your description...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && !enhanced && (
        <p className="text-sm text-red-500">
          Enhancement failed.{' '}
          <button type="button" onClick={handleEnhance} className="underline hover:no-underline">
            Try again
          </button>
        </p>
      )}

      {/* Enhanced result panel */}
      {enhanced && !editing && (
        <div className="border border-[var(--accent)] rounded-lg overflow-hidden">
          <div className="bg-[var(--accent-light)] px-4 py-2.5 border-b border-[var(--accent)]/20">
            <p className="text-sm font-medium text-[var(--accent)]">Enhanced version</p>
          </div>
          <div className="p-4 bg-[var(--card)]">
            <p className="text-sm text-[var(--foreground)] leading-relaxed whitespace-pre-wrap">{enhanced}</p>
          </div>
          <div className="px-4 py-3 bg-[var(--background)] border-t border-[var(--border)] flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleUseEnhanced}
              className="text-sm font-medium bg-[var(--accent)] text-white px-4 py-1.5 rounded-full hover:bg-[var(--accent-dark)] transition-colors"
            >
              Use this version
            </button>
            <button
              type="button"
              onClick={handleEditEnhanced}
              className="text-sm font-medium border border-[var(--accent)] text-[var(--accent)] px-4 py-1.5 rounded-full hover:bg-[var(--accent-light)] transition-colors"
            >
              Edit first
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="text-sm text-[var(--muted)] px-4 py-1.5 hover:text-[var(--foreground)] transition-colors"
            >
              Keep my original
            </button>
          </div>
        </div>
      )}

      {/* Editing the enhanced version */}
      {editing && (
        <div className="border border-[var(--accent)] rounded-lg overflow-hidden">
          <div className="bg-[var(--accent-light)] px-4 py-2.5 border-b border-[var(--accent)]/20">
            <p className="text-sm font-medium text-[var(--accent)]">Edit enhanced version</p>
          </div>
          <div className="p-3">
            <textarea
              value={editDraft}
              onChange={e => setEditDraft(e.target.value)}
              rows={5}
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
            />
          </div>
          <div className="px-4 py-3 bg-[var(--background)] border-t border-[var(--border)] flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleUseEdited}
              className="text-sm font-medium bg-[var(--accent)] text-white px-4 py-1.5 rounded-full hover:bg-[var(--accent-dark)] transition-colors"
            >
              Use this version
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="text-sm text-[var(--muted)] px-4 py-1.5 hover:text-[var(--foreground)] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

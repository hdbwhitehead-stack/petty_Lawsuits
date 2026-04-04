'use client'
import { useState, useEffect, useRef } from 'react'

type Props = {
  description: string
  onEnhanced: (enhanced: string) => void
}

export default function NarrativeEnhancer({ description, onEnhanced }: Props) {
  const [enhanced, setEnhanced] = useState('')
  const [loading, setLoading] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (description.trim().length < 20) {
      setEnhanced('')
      return
    }

    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/enhance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ description }),
        })
        if (res.ok) {
          const data = await res.json()
          setEnhanced(data.enhanced)
          onEnhanced(data.enhanced)
        }
      } catch {
        // silently fail — enhancement is optional
      } finally {
        setLoading(false)
      }
    }, 1000)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [description, onEnhanced])

  if (!enhanced && !loading) return null

  return (
    <div className="border border-[var(--border)] rounded-lg p-4 bg-[var(--accent-light)] mt-3">
      <p className="text-sm font-medium text-[var(--accent)] mb-2 font-['DM_Sans']">
        {loading ? 'Enhancing your description...' : 'Enhanced version:'}
      </p>
      {enhanced && <p className="text-sm text-[var(--foreground)] font-['DM_Sans']">{enhanced}</p>}
    </div>
  )
}

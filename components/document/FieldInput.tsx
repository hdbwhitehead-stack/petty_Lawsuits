'use client'

import { useState } from 'react'
import type { DocumentField } from '@/lib/documents/templates'

type Props = {
  field: DocumentField
  value: string
  onChange: (key: string, value: string) => void
  onBlur?: () => void
}

export function FieldInput({ field, value, onChange, onBlur }: Props) {
  const [focused, setFocused] = useState(false)

  const style: React.CSSProperties = {
    border: `2px solid ${focused ? 'var(--accent)' : 'var(--foreground)'}`,
    borderRadius: 10,
    background: 'var(--card)',
    boxShadow: '3px 3px 0 var(--foreground)',
    padding: '8px 12px',
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    color: 'var(--foreground)',
    outline: 'none',
    width: '100%',
    transition: 'border-color 80ms ease',
  }

  if (field.type === 'textarea') {
    return (
      <textarea
        value={value}
        onChange={e => onChange(field.key, e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => { setFocused(false); onBlur?.() }}
        rows={4}
        style={{ ...style, resize: 'vertical', display: 'block' }}
        aria-label={field.label}
      />
    )
  }

  return (
    <input
      type={field.type === 'date' ? 'date' : 'text'}
      value={value}
      onChange={e => onChange(field.key, e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => { setFocused(false); onBlur?.() }}
      style={style}
      aria-label={field.label}
    />
  )
}

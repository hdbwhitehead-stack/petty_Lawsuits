'use client'

import type { DocumentField } from '@/lib/documents/templates'

type Props = {
  field: DocumentField
  value: string
  onChange: (key: string, value: string) => void
  onBlur?: () => void
}

export function FieldInput({ field, value, onChange, onBlur }: Props) {
  const baseClass =
    'border-b-2 border-[var(--accent)] bg-[var(--accent-tint)] px-1 py-0.5 min-w-[140px] focus:outline-none focus:bg-[var(--accent-light)] rounded-sm text-[var(--foreground)]'

  if (field.type === 'textarea') {
    return (
      <textarea
        value={value}
        onChange={e => onChange(field.key, e.target.value)}
        onBlur={onBlur}
        rows={4}
        className={`${baseClass} w-full block resize-y`}
        aria-label={field.label}
      />
    )
  }

  return (
    <input
      type={field.type === 'date' ? 'date' : 'text'}
      value={value}
      onChange={e => onChange(field.key, e.target.value)}
      onBlur={onBlur}
      className={baseClass}
      aria-label={field.label}
    />
  )
}

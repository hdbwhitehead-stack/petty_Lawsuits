'use client'

import type { DocumentTemplate } from '@/lib/documents/templates'
import { FieldInput } from './FieldInput'

type Props = {
  template: DocumentTemplate
  values: Record<string, string>
  onChange: (key: string, value: string) => void
  onBlur?: () => void
  readOnly?: boolean
}

export function DocumentView({ template, values, onChange, onBlur, readOnly = false }: Props) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-lg p-8 md:p-12 shadow-sm font-serif">
      {/* Document header */}
      <div className="text-center mb-10 pb-6 border-b border-[var(--border)]">
        <p className="text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Legal Document</p>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">{template.label}</h1>
      </div>

      {/* Fields */}
      <div className="space-y-6">
        {template.fields.map(field => (
          <div key={field.key} className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              {field.label}
            </label>
            {readOnly ? (
              <p className="text-base text-[var(--foreground)] py-1">
                {values[field.key] ?? <span className="text-[var(--muted)] italic">Not provided</span>}
              </p>
            ) : (
              <FieldInput
                field={field}
                value={values[field.key] ?? ''}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-10 pt-6 border-t border-[var(--border)]">
        <p className="text-xs text-[var(--muted)] leading-relaxed">
          This document was generated using a template tool. It is not legal advice. You should seek
          independent legal advice if you are unsure about your rights or obligations.
        </p>
      </div>
    </div>
  )
}

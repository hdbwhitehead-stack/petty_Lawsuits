'use client'

import type { DocumentTemplate } from '@/lib/documents/templates'
import { FieldInput } from './FieldInput'
import { Tape } from '@/components/ui/Tape'

type Props = {
  template: DocumentTemplate
  values: Record<string, string>
  onChange: (key: string, value: string) => void
  onBlur?: () => void
  readOnly?: boolean
}

export function DocumentView({ template, values, onChange, onBlur, readOnly = false }: Props) {
  return (
    <div
      className="p-8 md:p-12"
      style={{
        position: 'relative',
        background: 'var(--card)',
        border: '2px solid var(--foreground)',
        borderRadius: 20,
        boxShadow: '5px 5px 0 var(--foreground)',
      }}
    >
      <Tape color="pink" position="top" />

      {/* FORMAL DEMAND stamp */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          width: 84,
          height: 84,
          borderRadius: '50%',
          border: '3px solid var(--stamp)',
          color: 'var(--stamp)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          lineHeight: 1.15,
          transform: 'rotate(8deg)',
          opacity: 0.75,
          filter: 'contrast(0.9) blur(0.4px)',
          padding: 8,
          textAlign: 'center',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        <span>FORMAL</span>
        <span>DEMAND</span>
      </div>

      {/* Document header */}
      <div className="text-center mb-10 pb-6 border-b-2 border-foreground">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-2">Legal Document</p>
        <h1 className="font-display font-bold text-2xl">{template.label}</h1>
      </div>

      {/* Fields */}
      <div className="space-y-6">
        {template.fields.map(field => (
          <div key={field.key} className="flex flex-col gap-1.5">
            <label className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
              {field.label}
            </label>
            {readOnly ? (
              <p className="text-base py-1">
                {values[field.key] ?? (
                  <span className="text-muted italic">Not provided</span>
                )}
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
      <div
        className="mt-10 pt-6"
        style={{ borderTop: '1px solid rgba(26,24,20,0.18)' }}
      >
        <p className="text-xs text-muted leading-relaxed">
          This document was generated using a template tool. It is not legal advice. You should seek
          independent legal advice if you are unsure about your rights or obligations.
        </p>
      </div>
    </div>
  )
}

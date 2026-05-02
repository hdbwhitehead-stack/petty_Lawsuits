'use client'
import { useState } from 'react'

type Props = {
  answers: Record<string, string>
  onUpdate: (updates: Record<string, string>) => void
  onNext: () => void
}

const inputClasses = "w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-base bg-[var(--card)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"

type LookupState = 'idle' | 'loading' | 'success' | 'error'

function isValidAbnOrAcn(value: string) {
  const digits = value.replace(/\s/g, '')
  return /^\d{11}$/.test(digits) || /^\d{9}$/.test(digits)
}

export default function DefendantStep({ answers, onUpdate, onNext }: Props) {
  const [type, setType] = useState(answers.defendant_type ?? 'individual')
  const [abnInput, setAbnInput] = useState(answers.defendant_abn ?? '')
  const [lookupState, setLookupState] = useState<LookupState>('idle')
  const [lookupMessage, setLookupMessage] = useState<string | null>(null)

  function handleChange(key: string, value: string) {
    onUpdate({ [key]: value })
  }

  async function handleAbnLookup() {
    const id = abnInput.replace(/\s/g, '')
    setLookupState('loading')
    setLookupMessage(null)
    try {
      const res = await fetch(`/api/lookup/abn?id=${encodeURIComponent(id)}`)
      const data: { businessName: string | null; status: string; error?: string } = await res.json()
      if (data.error) {
        setLookupState('error')
        setLookupMessage(data.error)
      } else if (data.businessName) {
        setLookupState('success')
        setLookupMessage(`Found: ${data.businessName}`)
        // Prefill the business name field (remains editable)
        onUpdate({ defendant_business_name: data.businessName, defendant_abn: id })
      } else {
        setLookupState('error')
        setLookupMessage('ABN/ACN not found — enter name manually')
      }
    } catch {
      setLookupState('error')
      setLookupMessage('Could not look up — enter manually')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-[var(--accent)] mb-2">Step 1 of 4</p>
        <h2 className="text-2xl">
          {answers.claim_type === 'cease-and-desist'
            ? 'Who do you want to ask to stop?'
            : 'Who are you making a claim against?'}
        </h2>
      </div>

      <div className="flex gap-2">
        {(['individual', 'business'] as const).map(t => (
          <button
            key={t}
            onClick={() => { setType(t); handleChange('defendant_type', t) }}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-opacity ${
              type === t
                ? 'bg-[var(--foreground)] text-white'
                : 'border border-[var(--foreground)] text-[var(--foreground)]'
            } hover:opacity-90`}
          >
            {t === 'individual' ? 'Individual' : 'Business'}
          </button>
        ))}
      </div>

      {type === 'business' && (
        <>
          {/* ABN / ACN lookup — optional, prefills business name */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              ABN / ACN <span className="text-[var(--muted)] font-normal">(optional — auto-fills business name)</span>
            </label>
            <div className="flex gap-2">
              <input
                placeholder="e.g. 51 824 753 556 or 123 456 789"
                value={abnInput}
                onChange={e => {
                  setAbnInput(e.target.value)
                  setLookupState('idle')
                  setLookupMessage(null)
                  onUpdate({ defendant_abn: e.target.value })
                }}
                className={inputClasses}
                inputMode="numeric"
                maxLength={14}
              />
              <button
                type="button"
                onClick={handleAbnLookup}
                disabled={!isValidAbnOrAcn(abnInput) || lookupState === 'loading'}
                className="shrink-0 px-4 py-2.5 rounded-lg border border-[var(--foreground)] text-sm font-medium disabled:opacity-40 hover:opacity-80 transition-opacity whitespace-nowrap"
              >
                {lookupState === 'loading' ? 'Looking up…' : 'Look up'}
              </button>
            </div>
            {lookupMessage && (
              <p className={`mt-1.5 text-sm ${lookupState === 'success' ? 'text-green-600' : 'text-[var(--muted)]'}`}>
                {lookupMessage}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Business name</label>
            <input
              placeholder="Business name"
              value={answers.defendant_business_name ?? ''}
              onChange={e => handleChange('defendant_business_name', e.target.value)}
              className={inputClasses}
            />
          </div>
        </>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">First name</label>
          <input placeholder="First name" value={answers.defendant_first_name ?? ''}
            onChange={e => handleChange('defendant_first_name', e.target.value)}
            className={inputClasses} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Last name</label>
          <input placeholder="Last name" value={answers.defendant_last_name ?? ''}
            onChange={e => handleChange('defendant_last_name', e.target.value)}
            className={inputClasses} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Email (optional)</label>
          <input placeholder="Email (optional)" value={answers.defendant_email ?? ''}
            onChange={e => handleChange('defendant_email', e.target.value)}
            className={inputClasses} type="email" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Phone (optional)</label>
          <input placeholder="Phone (optional)" value={answers.defendant_phone ?? ''}
            onChange={e => handleChange('defendant_phone', e.target.value)}
            className={inputClasses} type="tel" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Street address</label>
        <input placeholder="Street address" value={answers.defendant_address ?? ''}
          onChange={e => handleChange('defendant_address', e.target.value)}
          className={inputClasses} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">City</label>
          <input placeholder="City" value={answers.defendant_city ?? ''}
            onChange={e => handleChange('defendant_city', e.target.value)}
            className={inputClasses} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">State</label>
          <input placeholder="State" value={answers.defendant_state ?? ''}
            onChange={e => handleChange('defendant_state', e.target.value)}
            className={inputClasses} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Postcode</label>
          <input placeholder="Postcode" value={answers.defendant_postcode ?? ''}
            onChange={e => handleChange('defendant_postcode', e.target.value)}
            className={inputClasses} />
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={
          type === 'business'
            ? !answers.defendant_business_name
            : !answers.defendant_first_name || !answers.defendant_last_name
        }
        className="bg-[var(--foreground)] text-white rounded-full px-8 py-3 text-base font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
      >
        Lock In The Defendant &rarr;
      </button>
    </div>
  )
}

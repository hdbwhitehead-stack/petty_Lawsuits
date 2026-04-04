'use client'
import { useState } from 'react'

type Props = {
  answers: Record<string, string>
  onUpdate: (updates: Record<string, string>) => void
  onNext: () => void
}

const inputClasses = "w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-base bg-[var(--card)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"

export default function DefendantStep({ answers, onUpdate, onNext }: Props) {
  const [type, setType] = useState(answers.defendant_type ?? 'individual')

  function handleChange(key: string, value: string) {
    onUpdate({ [key]: value })
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-[var(--accent)] mb-2">Step 1 of 4</p>
        <h2 className="text-2xl">Who are you making a claim against?</h2>
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
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Business name</label>
          <input
            placeholder="Business name"
            value={answers.defendant_business_name ?? ''}
            onChange={e => handleChange('defendant_business_name', e.target.value)}
            className={inputClasses}
          />
        </div>
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
        disabled={!answers.defendant_first_name || !answers.defendant_last_name}
        className="bg-[var(--foreground)] text-white rounded-full px-8 py-3 text-base font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
      >
        Lock In The Defendant &rarr;
      </button>
    </div>
  )
}

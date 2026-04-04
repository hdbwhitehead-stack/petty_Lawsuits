'use client'
import { useState } from 'react'

type Props = {
  answers: Record<string, string>
  onUpdate: (updates: Record<string, string>) => void
  onNext: () => void
  onBack?: () => void
}

const inputClasses = "w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-base bg-[var(--card)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"

export default function ClaimantStep({ answers, onUpdate, onNext, onBack }: Props) {
  const [type, setType] = useState(answers.claimant_type ?? 'individual')

  function handleChange(key: string, value: string) {
    onUpdate({ [key]: value })
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-[var(--accent)] mb-2">Step 2 of 4</p>
        <h2 className="text-2xl">Your details</h2>
      </div>

      <div className="flex gap-2">
        {(['individual', 'business'] as const).map(t => (
          <button
            key={t}
            onClick={() => { setType(t); handleChange('claimant_type', t) }}
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
            value={answers.claimant_business_name ?? ''}
            onChange={e => handleChange('claimant_business_name', e.target.value)}
            className={inputClasses}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">First name</label>
          <input placeholder="First name" value={answers.claimant_first_name ?? ''}
            onChange={e => handleChange('claimant_first_name', e.target.value)}
            className={inputClasses} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Last name</label>
          <input placeholder="Last name" value={answers.claimant_last_name ?? ''}
            onChange={e => handleChange('claimant_last_name', e.target.value)}
            className={inputClasses} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Email</label>
          <input placeholder="Email" value={answers.claimant_email ?? ''}
            onChange={e => handleChange('claimant_email', e.target.value)}
            className={inputClasses} type="email" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Phone</label>
          <input placeholder="Phone" value={answers.claimant_phone ?? ''}
            onChange={e => handleChange('claimant_phone', e.target.value)}
            className={inputClasses} type="tel" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Street address</label>
        <input placeholder="Street address" value={answers.claimant_address ?? ''}
          onChange={e => handleChange('claimant_address', e.target.value)}
          className={inputClasses} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">City</label>
          <input placeholder="City" value={answers.claimant_city ?? ''}
            onChange={e => handleChange('claimant_city', e.target.value)}
            className={inputClasses} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">State</label>
          <input placeholder="State" value={answers.claimant_state ?? ''}
            onChange={e => handleChange('claimant_state', e.target.value)}
            className={inputClasses} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Postcode</label>
          <input placeholder="Postcode" value={answers.claimant_postcode ?? ''}
            onChange={e => handleChange('claimant_postcode', e.target.value)}
            className={inputClasses} />
        </div>
      </div>

      <p className="text-sm text-[var(--muted)] italic">
        The petty is spreading in Sydney — demand sent
      </p>

      <div className="flex gap-3">
        {onBack && (
          <button onClick={onBack} className="border border-[var(--foreground)] text-[var(--foreground)] rounded-full px-8 py-3 text-base font-medium hover:opacity-90 transition-opacity">
            &larr; Back
          </button>
        )}
        <button
          onClick={onNext}
          disabled={!answers.claimant_first_name || !answers.claimant_last_name || !answers.claimant_email}
          className="bg-[var(--foreground)] text-white rounded-full px-8 py-3 text-base font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          Continue &rarr;
        </button>
      </div>
    </div>
  )
}

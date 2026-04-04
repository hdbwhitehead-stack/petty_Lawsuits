'use client'
import { useState } from 'react'

type Props = {
  answers: Record<string, string>
  onUpdate: (updates: Record<string, string>) => void
  onNext: () => void
  onBack?: () => void
}

export default function ClaimantStep({ answers, onUpdate, onNext, onBack }: Props) {
  const [type, setType] = useState(answers.claimant_type ?? 'individual')

  function handleChange(key: string, value: string) {
    onUpdate({ [key]: value })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your details</h2>

      <div className="flex gap-2">
        {(['individual', 'business'] as const).map(t => (
          <button
            key={t}
            onClick={() => { setType(t); handleChange('claimant_type', t) }}
            className={`px-4 py-2 rounded border ${type === t ? 'bg-black text-white' : ''}`}
          >
            {t === 'individual' ? 'Individual' : 'Business'}
          </button>
        ))}
      </div>

      {type === 'business' && (
        <input
          placeholder="Business name"
          value={answers.claimant_business_name ?? ''}
          onChange={e => handleChange('claimant_business_name', e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      )}

      <div className="grid grid-cols-2 gap-4">
        <input placeholder="First name" value={answers.claimant_first_name ?? ''}
          onChange={e => handleChange('claimant_first_name', e.target.value)}
          className="w-full border rounded px-3 py-2" />
        <input placeholder="Last name" value={answers.claimant_last_name ?? ''}
          onChange={e => handleChange('claimant_last_name', e.target.value)}
          className="w-full border rounded px-3 py-2" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input placeholder="Email" value={answers.claimant_email ?? ''}
          onChange={e => handleChange('claimant_email', e.target.value)}
          className="w-full border rounded px-3 py-2" type="email" />
        <input placeholder="Phone" value={answers.claimant_phone ?? ''}
          onChange={e => handleChange('claimant_phone', e.target.value)}
          className="w-full border rounded px-3 py-2" type="tel" />
      </div>

      <input placeholder="Street address" value={answers.claimant_address ?? ''}
        onChange={e => handleChange('claimant_address', e.target.value)}
        className="w-full border rounded px-3 py-2" />

      <div className="grid grid-cols-3 gap-4">
        <input placeholder="City" value={answers.claimant_city ?? ''}
          onChange={e => handleChange('claimant_city', e.target.value)}
          className="w-full border rounded px-3 py-2" />
        <input placeholder="State" value={answers.claimant_state ?? ''}
          onChange={e => handleChange('claimant_state', e.target.value)}
          className="w-full border rounded px-3 py-2" />
        <input placeholder="Postcode" value={answers.claimant_postcode ?? ''}
          onChange={e => handleChange('claimant_postcode', e.target.value)}
          className="w-full border rounded px-3 py-2" />
      </div>

      <p className="text-sm text-gray-400 italic">
        The petty is spreading in Sydney — demand sent
      </p>

      <div className="flex gap-3">
        {onBack && (
          <button onClick={onBack} className="border rounded px-6 py-3">
            &larr; Back
          </button>
        )}
        <button
          onClick={onNext}
          disabled={!answers.claimant_first_name || !answers.claimant_last_name || !answers.claimant_email}
          className="bg-black text-white rounded px-6 py-3 disabled:opacity-50"
        >
          Continue &rarr;
        </button>
      </div>
    </div>
  )
}

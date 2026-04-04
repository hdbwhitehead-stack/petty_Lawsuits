'use client'
import { useState } from 'react'

type Props = {
  answers: Record<string, string>
  onUpdate: (updates: Record<string, string>) => void
  onNext: () => void
}

export default function DefendantStep({ answers, onUpdate, onNext }: Props) {
  const [type, setType] = useState(answers.defendant_type ?? 'individual')

  function handleChange(key: string, value: string) {
    onUpdate({ [key]: value })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Who are you making a claim against?</h2>

      <div className="flex gap-2">
        {(['individual', 'business'] as const).map(t => (
          <button
            key={t}
            onClick={() => { setType(t); handleChange('defendant_type', t) }}
            className={`px-4 py-2 rounded border ${type === t ? 'bg-black text-white' : ''}`}
          >
            {t === 'individual' ? 'Individual' : 'Business'}
          </button>
        ))}
      </div>

      {type === 'business' && (
        <input
          placeholder="Business name"
          value={answers.defendant_business_name ?? ''}
          onChange={e => handleChange('defendant_business_name', e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      )}

      <div className="grid grid-cols-2 gap-4">
        <input placeholder="First name" value={answers.defendant_first_name ?? ''}
          onChange={e => handleChange('defendant_first_name', e.target.value)}
          className="w-full border rounded px-3 py-2" />
        <input placeholder="Last name" value={answers.defendant_last_name ?? ''}
          onChange={e => handleChange('defendant_last_name', e.target.value)}
          className="w-full border rounded px-3 py-2" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input placeholder="Email (optional)" value={answers.defendant_email ?? ''}
          onChange={e => handleChange('defendant_email', e.target.value)}
          className="w-full border rounded px-3 py-2" type="email" />
        <input placeholder="Phone (optional)" value={answers.defendant_phone ?? ''}
          onChange={e => handleChange('defendant_phone', e.target.value)}
          className="w-full border rounded px-3 py-2" type="tel" />
      </div>

      <input placeholder="Street address" value={answers.defendant_address ?? ''}
        onChange={e => handleChange('defendant_address', e.target.value)}
        className="w-full border rounded px-3 py-2" />

      <div className="grid grid-cols-3 gap-4">
        <input placeholder="City" value={answers.defendant_city ?? ''}
          onChange={e => handleChange('defendant_city', e.target.value)}
          className="w-full border rounded px-3 py-2" />
        <input placeholder="State" value={answers.defendant_state ?? ''}
          onChange={e => handleChange('defendant_state', e.target.value)}
          className="w-full border rounded px-3 py-2" />
        <input placeholder="Postcode" value={answers.defendant_postcode ?? ''}
          onChange={e => handleChange('defendant_postcode', e.target.value)}
          className="w-full border rounded px-3 py-2" />
      </div>

      <button
        onClick={onNext}
        disabled={!answers.defendant_first_name || !answers.defendant_last_name}
        className="bg-black text-white rounded px-6 py-3 disabled:opacity-50"
      >
        Lock In The Defendant &rarr;
      </button>
    </div>
  )
}

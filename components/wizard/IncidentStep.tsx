'use client'
import { TEMPLATES } from '@/lib/documents/templates'
import CourtWidget from './CourtWidget'
import NarrativeEnhancer from './NarrativeEnhancer'

type Props = {
  answers: Record<string, string>
  onUpdate: (updates: Record<string, string>) => void
  onNext: () => void
  onBack?: () => void
}

export default function IncidentStep({ answers, onUpdate, onNext, onBack }: Props) {
  function handleChange(key: string, value: string) {
    onUpdate({ [key]: value })
  }

  const hasRequired = answers.description && answers.claim_type && answers.incident_date && answers.location && answers.amount

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">What happened?</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Describe the incident</label>
        <textarea
          placeholder="Describe the incident…"
          value={answers.description ?? ''}
          onChange={e => handleChange('description', e.target.value)}
          rows={5}
          className="w-full border rounded px-3 py-2"
        />
        <NarrativeEnhancer
          description={answers.description ?? ''}
          onEnhanced={(enhanced) => handleChange('enhanced_description', enhanced)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">What type of claim is this?</label>
        <select
          value={answers.claim_type ?? ''}
          onChange={e => handleChange('claim_type', e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select a claim type</option>
          {TEMPLATES.map(t => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">When did this happen?</label>
          <input type="date" value={answers.incident_date ?? ''}
            onChange={e => handleChange('incident_date', e.target.value)}
            className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Where did this happen? (City, State)</label>
          <input placeholder="e.g. Sydney, NSW" value={answers.location ?? ''}
            onChange={e => handleChange('location', e.target.value)}
            className="w-full border rounded px-3 py-2" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">How much are you claiming? (AUD)</label>
        <input placeholder="e.g. 5000" value={answers.amount ?? ''}
          onChange={e => handleChange('amount', e.target.value)}
          className="w-full border rounded px-3 py-2" type="text" inputMode="decimal" />
      </div>

      <CourtWidget location={answers.location ?? ''} amount={answers.amount ?? ''} />

      {!hasRequired && (
        <p className="text-sm text-red-500">Please complete all fields above to continue.</p>
      )}

      <div className="flex gap-3">
        {onBack && (
          <button onClick={onBack} className="border rounded px-6 py-3">
            &larr; Back
          </button>
        )}
        <button
          onClick={onNext}
          disabled={!hasRequired}
          className="bg-black text-white rounded px-6 py-3 disabled:opacity-50"
        >
          Add Your Evidence &rarr;
        </button>
      </div>
    </div>
  )
}

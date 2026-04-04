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

const inputClasses = "w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-base bg-[var(--card)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"

export default function IncidentStep({ answers, onUpdate, onNext, onBack }: Props) {
  function handleChange(key: string, value: string) {
    onUpdate({ [key]: value })
  }

  const hasRequired = answers.description && answers.claim_type && answers.incident_date && answers.location && answers.amount

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-[var(--accent)] mb-2 font-['DM_Sans']">Step 3 of 4</p>
        <h2 className="text-2xl">What happened?</h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1 font-['DM_Sans']">Describe the incident</label>
        <textarea
          placeholder="Describe the incident..."
          value={answers.description ?? ''}
          onChange={e => handleChange('description', e.target.value)}
          rows={5}
          className={inputClasses}
        />
        <NarrativeEnhancer
          description={answers.description ?? ''}
          onEnhanced={(enhanced) => handleChange('enhanced_description', enhanced)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1 font-['DM_Sans']">What type of claim is this?</label>
        <select
          value={answers.claim_type ?? ''}
          onChange={e => handleChange('claim_type', e.target.value)}
          className={inputClasses}
        >
          <option value="">Select a claim type</option>
          {TEMPLATES.map(t => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1 font-['DM_Sans']">When did this happen?</label>
          <input type="date" value={answers.incident_date ?? ''}
            onChange={e => handleChange('incident_date', e.target.value)}
            className={inputClasses} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1 font-['DM_Sans']">Where did this happen? (City, State)</label>
          <input placeholder="e.g. Sydney, NSW" value={answers.location ?? ''}
            onChange={e => handleChange('location', e.target.value)}
            className={inputClasses} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1 font-['DM_Sans']">How much are you claiming? (AUD)</label>
        <input placeholder="e.g. 5000" value={answers.amount ?? ''}
          onChange={e => handleChange('amount', e.target.value)}
          className={inputClasses} type="text" inputMode="decimal" />
      </div>

      <CourtWidget location={answers.location ?? ''} amount={answers.amount ?? ''} disputeType={answers.claim_type} />

      {!hasRequired && (
        <p className="text-sm text-red-500 font-['DM_Sans']">Please complete all fields above to continue.</p>
      )}

      <div className="flex gap-3">
        {onBack && (
          <button onClick={onBack} className="border border-[var(--foreground)] text-[var(--foreground)] rounded-full px-8 py-3 text-base font-medium hover:opacity-90 transition-opacity">
            &larr; Back
          </button>
        )}
        <button
          onClick={onNext}
          disabled={!hasRequired}
          className="bg-[var(--foreground)] text-white rounded-full px-8 py-3 text-base font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          Add Your Evidence &rarr;
        </button>
      </div>
    </div>
  )
}

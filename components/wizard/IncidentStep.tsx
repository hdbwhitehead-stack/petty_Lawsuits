'use client'
import { useCallback } from 'react'
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

  const handleAcceptEnhanced = useCallback((text: string) => {
    const updates: Record<string, string> = { description: text }
    if (!answers.original_description) {
      updates.original_description = answers.description ?? ''
    }
    onUpdate(updates)
  }, [answers.original_description, answers.description, onUpdate])

  const isCeaseAndDesist = answers.claim_type === 'cease-and-desist'

  const hasRequired = isCeaseAndDesist
    ? !!(answers.description && answers.claim_type && answers.incident_date && answers.location)
    : !!(answers.description && answers.claim_type && answers.incident_date && answers.location && answers.amount)

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-[var(--accent)] mb-2">Step 3 of 4</p>
        <h2 className="text-2xl">
          {isCeaseAndDesist ? 'What conduct do you want stopped?' : 'What happened?'}
        </h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
          {isCeaseAndDesist ? 'Describe the conduct you want stopped' : 'Describe the incident'}
        </label>
        <textarea
          placeholder={isCeaseAndDesist ? 'Describe the conduct...' : 'Describe the incident...'}
          value={answers.description ?? ''}
          onChange={e => handleChange('description', e.target.value)}
          rows={5}
          className={inputClasses}
        />
        <NarrativeEnhancer
          description={answers.description ?? ''}
          onAccept={handleAcceptEnhanced}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1">What type of claim is this?</label>
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

      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1">When did this happen?</label>
        <input type="date" value={answers.incident_date ?? ''}
          onChange={e => handleChange('incident_date', e.target.value)}
          className={inputClasses} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">State / Territory</label>
          <select
            value={answers.location ?? ''}
            onChange={e => handleChange('location', e.target.value)}
            className={inputClasses}
          >
            <option value="">Select your state</option>
            <option value="NSW">New South Wales (NSW)</option>
            <option value="VIC">Victoria (VIC)</option>
            <option value="QLD">Queensland (QLD)</option>
            <option value="WA">Western Australia (WA)</option>
            <option value="SA">South Australia (SA)</option>
            <option value="TAS">Tasmania (TAS)</option>
            <option value="ACT">Australian Capital Territory (ACT)</option>
            <option value="NT">Northern Territory (NT)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">City / Suburb</label>
          <input placeholder="e.g. Sydney" value={answers.city ?? ''}
            onChange={e => handleChange('city', e.target.value)}
            className={inputClasses} />
        </div>
      </div>

      {!isCeaseAndDesist && (
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">How much are you claiming? (AUD)</label>
          <input placeholder="e.g. 5000" value={answers.amount ?? ''}
            onChange={e => handleChange('amount', e.target.value)}
            className={inputClasses} type="text" inputMode="decimal" />
        </div>
      )}

      {isCeaseAndDesist && (
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
            How many days should the recipient have to stop? <span className="text-[var(--muted)] font-normal">(optional — defaults to 14)</span>
          </label>
          <input
            placeholder="e.g. 14"
            value={answers.cease_deadline_days ?? ''}
            onChange={e => handleChange('cease_deadline_days', e.target.value)}
            className={inputClasses}
            type="number"
            inputMode="numeric"
            min="1"
            max="90"
          />
        </div>
      )}

      {!isCeaseAndDesist && (
        <CourtWidget location={answers.location ?? ''} amount={answers.amount ?? ''} disputeType={answers.claim_type} />
      )}

      {!hasRequired && (
        <p className="text-sm text-red-500">Please complete all fields above to continue.</p>
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

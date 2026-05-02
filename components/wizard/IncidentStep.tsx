'use client'
import { useCallback } from 'react'
import { TEMPLATES } from '@/lib/documents/templates'
import CourtWidget from './CourtWidget'
import NarrativeEnhancer from './NarrativeEnhancer'
import { StickerButton } from '@/components/ui/StickerButton'
import { Highlight } from '@/components/ui/Highlight'

type Props = {
  answers: Record<string, string>
  onUpdate: (updates: Record<string, string>) => void
  onNext: () => void
  onBack?: () => void
}

const inputClasses = "w-full border-2 border-[var(--foreground)] shadow-sticker rounded-lg px-3 py-2.5 text-base bg-[var(--card)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-1"

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
      <div className="flex items-start justify-between gap-4">
        <div>
          <div
            className="inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider mb-3"
            style={{
              background: 'var(--accent)',
              color: '#fff',
              border: '2px solid var(--foreground)',
              borderRadius: '999px',
              boxShadow: '2px 2px 0 #1A1814',
            }}
          >
            STEP 03 OF 04
          </div>
          <h2 className="text-2xl font-display font-extrabold">
            {isCeaseAndDesist
              ? <>What to <Highlight>stop</Highlight></>
              : <>Spill the <Highlight>tea</Highlight></>}
          </h2>
        </div>
        <p
          className="text-base hidden sm:block flex-shrink-0 mt-8"
          style={{ fontFamily: 'var(--font-marker)', color: 'var(--muted)' }}
        >
          going strong ✦
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          {isCeaseAndDesist ? 'Describe the conduct you want stopped' : 'Describe what happened'}
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
        <label className="block text-sm font-medium mb-1">What type of claim is this?</label>
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
        <label className="block text-sm font-medium mb-1">When did this happen?</label>
        <input type="date" value={answers.incident_date ?? ''}
          onChange={e => handleChange('incident_date', e.target.value)}
          className={inputClasses} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">State / Territory</label>
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
          <label className="block text-sm font-medium mb-1">City / Suburb</label>
          <input placeholder="e.g. Sydney" value={answers.city ?? ''}
            onChange={e => handleChange('city', e.target.value)}
            className={inputClasses} />
        </div>
      </div>

      {!isCeaseAndDesist && (
        <div>
          <label className="block text-sm font-medium mb-1">How much are you claiming? (AUD)</label>
          <input placeholder="e.g. 5000" value={answers.amount ?? ''}
            onChange={e => handleChange('amount', e.target.value)}
            className={inputClasses} type="text" inputMode="decimal" />
        </div>
      )}

      {isCeaseAndDesist && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Days to stop? <span className="text-[var(--muted)] font-normal">(optional — defaults to 14)</span>
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
        {onBack && <StickerButton onClick={onBack} variant="ghost">← Back</StickerButton>}
        <StickerButton onClick={onNext} disabled={!hasRequired} variant="primary">
          Add The Receipts · +100 XP
        </StickerButton>
      </div>
    </div>
  )
}

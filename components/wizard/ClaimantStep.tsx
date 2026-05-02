'use client'
import { useState } from 'react'
import { StickerButton } from '@/components/ui/StickerButton'
import { Highlight } from '@/components/ui/Highlight'

type Props = {
  answers: Record<string, string>
  onUpdate: (updates: Record<string, string>) => void
  onNext: () => void
  onBack?: () => void
}

const inputClasses = "w-full border-2 border-[var(--foreground)] shadow-sticker rounded-lg px-3 py-2.5 text-base bg-[var(--card)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-1"

export default function ClaimantStep({ answers, onUpdate, onNext, onBack }: Props) {
  const [type, setType] = useState(answers.claimant_type ?? 'individual')

  function handleChange(key: string, value: string) {
    onUpdate({ [key]: value })
  }

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
            STEP 02 OF 04
          </div>
          <h2 className="text-2xl font-display font-extrabold">
            Who&apos;s bringing the <Highlight>petty</Highlight>?
          </h2>
        </div>
        <p
          className="text-base hidden sm:block flex-shrink-0 mt-8"
          style={{ fontFamily: 'var(--font-marker)', color: 'var(--muted)' }}
        >
          almost halfway ✦
        </p>
      </div>

      <div className="flex gap-2">
        {(['individual', 'business'] as const).map(t => (
          <button
            key={t}
            onClick={() => { setType(t); handleChange('claimant_type', t) }}
            className="px-5 py-2.5 rounded-full text-sm font-bold"
            style={{
              border: '2px solid var(--foreground)',
              boxShadow: type === t ? 'none' : '2px 2px 0 #1A1814',
              background: type === t ? 'var(--foreground)' : '#fff',
              color: type === t ? '#fff' : 'var(--foreground)',
              transform: type === t ? 'translate(2px, 2px)' : undefined,
              transition: 'all 80ms ease',
            }}
          >
            {t === 'individual' ? 'Individual' : 'Business'}
          </button>
        ))}
      </div>

      {type === 'business' && (
        <div>
          <label className="block text-sm font-medium mb-1">Business name</label>
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
          <label className="block text-sm font-medium mb-1">First name</label>
          <input placeholder="First name" value={answers.claimant_first_name ?? ''}
            onChange={e => handleChange('claimant_first_name', e.target.value)}
            className={inputClasses} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last name</label>
          <input placeholder="Last name" value={answers.claimant_last_name ?? ''}
            onChange={e => handleChange('claimant_last_name', e.target.value)}
            className={inputClasses} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input placeholder="Email" value={answers.claimant_email ?? ''}
            onChange={e => handleChange('claimant_email', e.target.value)}
            className={inputClasses} type="email" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input placeholder="Phone" value={answers.claimant_phone ?? ''}
            onChange={e => handleChange('claimant_phone', e.target.value)}
            className={inputClasses} type="tel" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Street address</label>
        <input placeholder="Street address" value={answers.claimant_address ?? ''}
          onChange={e => handleChange('claimant_address', e.target.value)}
          className={inputClasses} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input placeholder="City" value={answers.claimant_city ?? ''}
            onChange={e => handleChange('claimant_city', e.target.value)}
            className={inputClasses} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">State</label>
          <input placeholder="State" value={answers.claimant_state ?? ''}
            onChange={e => handleChange('claimant_state', e.target.value)}
            className={inputClasses} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Postcode</label>
          <input placeholder="Postcode" value={answers.claimant_postcode ?? ''}
            onChange={e => handleChange('claimant_postcode', e.target.value)}
            className={inputClasses} />
        </div>
      </div>

      <p className="text-sm" style={{ fontFamily: 'var(--font-marker)', color: 'var(--muted)' }}>
        The petty is spreading in Sydney — demand sent ✦
      </p>

      <div className="flex gap-3">
        {onBack && <StickerButton onClick={onBack} variant="ghost">← Back</StickerButton>}
        <StickerButton
          onClick={onNext}
          disabled={!answers.claimant_first_name || !answers.claimant_last_name || !answers.claimant_email}
          variant="primary"
        >
          Continue · +50 XP
        </StickerButton>
      </div>
    </div>
  )
}

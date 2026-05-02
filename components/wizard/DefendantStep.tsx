'use client'
import { useState } from 'react'
import { StickerButton } from '@/components/ui/StickerButton'
import { Highlight } from '@/components/ui/Highlight'

type Props = {
  answers: Record<string, string>
  onUpdate: (updates: Record<string, string>) => void
  onNext: () => void
}

const inputClasses = "w-full border-2 border-[var(--foreground)] shadow-sticker rounded-lg px-3 py-2.5 text-base bg-[var(--card)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-1"

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

  const isCeaseAndDesist = answers.claim_type === 'cease-and-desist'

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
            STEP 01 OF 04
          </div>
          <h2 className="text-2xl font-display font-extrabold">
            {isCeaseAndDesist ? <>Who to <Highlight>stop</Highlight></> : <>The <Highlight>offender</Highlight></>}
          </h2>
        </div>
        <p
          className="text-base hidden sm:block flex-shrink-0 mt-8"
          style={{ fontFamily: 'var(--font-marker)', color: 'var(--muted)' }}
        >
          let&apos;s get this ✦
        </p>
      </div>

      <div className="flex gap-2">
        {(['individual', 'business'] as const).map(t => (
          <button
            key={t}
            onClick={() => { setType(t); handleChange('defendant_type', t) }}
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
        <>
          <div>
            <label className="block text-sm font-medium mb-1">
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
              <StickerButton
                variant="ghost"
                size="sm"
                onClick={handleAbnLookup}
                disabled={!isValidAbnOrAcn(abnInput) || lookupState === 'loading'}
                style={{ flexShrink: 0, borderRadius: 8, whiteSpace: 'nowrap' }}
              >
                {lookupState === 'loading' ? 'Looking…' : 'Look up'}
              </StickerButton>
            </div>
            {lookupMessage && (
              <p className={`mt-1.5 text-sm ${lookupState === 'success' ? 'text-green-600' : 'text-[var(--muted)]'}`}>
                {lookupMessage}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Business name</label>
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
          <label className="block text-sm font-medium mb-1">First name</label>
          <input placeholder="First name" value={answers.defendant_first_name ?? ''}
            onChange={e => handleChange('defendant_first_name', e.target.value)}
            className={inputClasses} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last name</label>
          <input placeholder="Last name" value={answers.defendant_last_name ?? ''}
            onChange={e => handleChange('defendant_last_name', e.target.value)}
            className={inputClasses} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email (optional)</label>
          <input placeholder="Email (optional)" value={answers.defendant_email ?? ''}
            onChange={e => handleChange('defendant_email', e.target.value)}
            className={inputClasses} type="email" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone (optional)</label>
          <input placeholder="Phone (optional)" value={answers.defendant_phone ?? ''}
            onChange={e => handleChange('defendant_phone', e.target.value)}
            className={inputClasses} type="tel" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Street address</label>
        <input placeholder="Street address" value={answers.defendant_address ?? ''}
          onChange={e => handleChange('defendant_address', e.target.value)}
          className={inputClasses} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input placeholder="City" value={answers.defendant_city ?? ''}
            onChange={e => handleChange('defendant_city', e.target.value)}
            className={inputClasses} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">State</label>
          <input placeholder="State" value={answers.defendant_state ?? ''}
            onChange={e => handleChange('defendant_state', e.target.value)}
            className={inputClasses} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Postcode</label>
          <input placeholder="Postcode" value={answers.defendant_postcode ?? ''}
            onChange={e => handleChange('defendant_postcode', e.target.value)}
            className={inputClasses} />
        </div>
      </div>

      <StickerButton
        onClick={onNext}
        disabled={
          type === 'business'
            ? !answers.defendant_business_name
            : !answers.defendant_first_name || !answers.defendant_last_name
        }
        variant="primary"
      >
        Lock In The Offender · +50 XP
      </StickerButton>
    </div>
  )
}

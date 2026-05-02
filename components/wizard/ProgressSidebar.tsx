'use client'
import Link from 'next/link'
import { PettyMeter } from '@/components/ui/PettyMeter'
import { Highlight } from '@/components/ui/Highlight'

const DEFAULT_STEPS = ['The offender', 'About you', 'Spill the tea', 'The receipts']
const STEP_LABELS_BY_CATEGORY: Record<string, string[]> = {
  'Cease & Desist': ['Who to stop', 'About you', 'What to stop', 'The receipts'],
}
const STEP_XP = ['+50 XP', '+50 XP', '+100 XP', '+200 XP']

type Props = {
  currentStep: number
  answers: Record<string, string>
  onStepClick: (step: number) => void
}

export default function ProgressSidebar({ currentStep, answers, onStepClick }: Props) {
  const category = answers.claim_type === 'cease-and-desist' ? 'Cease & Desist' : undefined
  const STEPS = (category && STEP_LABELS_BY_CATEGORY[category]) ?? DEFAULT_STEPS
  const pettyValue = currentStep / 4

  return (
    <aside
      className="w-64 hidden md:flex flex-col"
      style={{ minHeight: '100vh', borderRight: '2px solid var(--foreground)', background: 'var(--card)' }}
    >
      {/* Logo */}
      <div
        className="px-6 py-5"
        style={{ borderBottom: '2px solid var(--foreground)', borderTop: '3px solid var(--accent)' }}
      >
        <Link href="/" className="font-display font-extrabold text-xl tracking-tight hover:opacity-80 transition-opacity">
          Petty <Highlight>Lawsuits</Highlight>
        </Link>
      </div>

      <div className="px-6 py-6 flex-1 flex flex-col">
        {/* Petty Meter */}
        <div className="mb-6">
          <PettyMeter value={pettyValue} label="Quest Progress" />
        </div>

        {/* Steps */}
        <ol className="space-y-5 flex-1">
          {STEPS.map((step, i) => {
            const isDone = i < currentStep
            const isCurrent = i === currentStep

            return (
              <li
                key={step}
                onClick={() => isDone && onStepClick(i)}
                className={`flex items-start gap-3 ${isDone ? 'cursor-pointer' : ''}`}
              >
                <span
                  className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{
                    border: '2px solid var(--foreground)',
                    boxShadow: isCurrent ? '2px 2px 0 #1A1814' : 'none',
                    background: isDone ? 'var(--grass)' : isCurrent ? 'var(--accent)' : '#fff',
                    color: isDone || isCurrent ? '#fff' : 'var(--muted)',
                    transition: 'background 200ms ease',
                  }}
                >
                  {isDone ? '✓' : i + 1}
                </span>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: i > currentStep ? 'var(--muted)' : 'var(--foreground)' }}
                  >
                    {step}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{
                      fontFamily: 'var(--font-marker)',
                      color: isDone ? 'var(--grass)' : isCurrent ? 'var(--accent)' : 'var(--muted)',
                    }}
                  >
                    {isDone ? 'done ✓' : STEP_XP[i]}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>

        {/* Auto-save post-it */}
        <div
          className="mt-6 px-4 py-3"
          style={{
            background: 'var(--lemon)',
            border: '2px solid var(--foreground)',
            borderRadius: 8,
            boxShadow: '2px 2px 0 #1A1814',
            transform: 'rotate(-0.5deg)',
          }}
        >
          <p className="text-xs font-bold uppercase tracking-wide">Auto-save</p>
          <p style={{ fontFamily: 'var(--font-marker)', fontSize: 13 }}>your progress is saved ✦</p>
        </div>

        {/* Case summary */}
        {(answers.defendant_first_name || answers.amount) && (
          <div
            className="mt-4 pt-4 space-y-1 text-xs text-[var(--muted)]"
            style={{ borderTop: '1px dashed var(--border)' }}
          >
            {answers.defendant_first_name && (
              <p>vs: {answers.defendant_first_name} {answers.defendant_last_name}</p>
            )}
            {answers.amount && <p>claim: ${answers.amount}</p>}
          </div>
        )}
      </div>
    </aside>
  )
}

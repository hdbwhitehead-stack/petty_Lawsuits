'use client'
import Link from 'next/link'

const DEFAULT_STEPS = ['Defendant', 'Claimant', 'Incident', 'Evidence']

const STEP_LABELS_BY_CATEGORY: Record<string, string[]> = {
  'Cease & Desist': ['Who to ask', 'About you', 'What to stop', 'Evidence'],
}

type Props = {
  currentStep: number
  answers: Record<string, string>
  onStepClick: (step: number) => void
}

export default function ProgressSidebar({ currentStep, answers, onStepClick }: Props) {
  const category = answers.claim_type === 'cease-and-desist' ? 'Cease & Desist' : undefined
  const STEPS = (category && STEP_LABELS_BY_CATEGORY[category]) ?? DEFAULT_STEPS
  const percent = Math.round((currentStep / 4) * 100)

  return (
    <aside className="w-64 border-r border-[var(--border)] bg-[var(--card)] hidden md:flex flex-col" style={{ minHeight: '100vh' }}>
      {/* Logo strip */}
      <div className="px-6 py-5 border-b border-[var(--border)]" style={{ borderTop: '3px solid var(--accent)' }}>
        <Link href="/" className="font-['Instrument_Serif'] text-xl tracking-tight hover:opacity-80 transition-opacity">
          Petty Lawsuits
        </Link>
      </div>

      {/* Progress content */}
      <div className="px-6 py-6 flex-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-4">Progress</p>

        {/* Progress bar */}
        <div className="w-full bg-[var(--accent-light)] rounded-full mb-1" style={{ height: '6px' }}>
          <div
            className="rounded-full transition-all duration-500"
            style={{
              width: `${percent}%`,
              height: '6px',
              background: 'var(--accent)',
              boxShadow: percent > 0 ? '0 0 6px rgba(200, 149, 108, 0.5)' : 'none',
            }}
          />
        </div>
        <p className="text-xs text-[var(--muted)] text-right mb-6">{percent}%</p>

        <ol className="space-y-3">
          {STEPS.map((step, i) => (
            <li
              key={step}
              onClick={() => i <= currentStep && onStepClick(i)}
              className={`text-sm flex items-center gap-3 ${
                i < currentStep
                  ? 'text-[var(--accent)] cursor-pointer'
                  : i === currentStep
                  ? 'text-[var(--foreground)] font-semibold'
                  : 'text-[var(--muted)]'
              }`}
            >
              <span
                className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold flex-shrink-0 transition-all ${
                  i < currentStep
                    ? 'bg-[var(--accent)] text-white'
                    : i === currentStep
                    ? 'text-white'
                    : 'bg-[var(--accent-light)] text-[var(--muted)]'
                }`}
                style={
                  i === currentStep
                    ? {
                        background: 'var(--foreground)',
                        boxShadow: '0 0 0 3px var(--accent-light)',
                      }
                    : {}
                }
              >
                {i < currentStep ? '\u2713' : i + 1}
              </span>
              <span className={i < currentStep ? 'hover:underline underline-offset-2' : ''}>{step}</span>
            </li>
          ))}
        </ol>

        {/* Summary */}
        {(answers.defendant_first_name || answers.claimant_first_name || answers.amount) && (
          <div className="mt-8 pt-6 border-t border-[var(--border)] space-y-2 text-sm text-[var(--muted)]">
            {answers.defendant_first_name && (
              <p>Defendant: {answers.defendant_first_name} {answers.defendant_last_name}</p>
            )}
            {answers.claimant_first_name && (
              <p>Claimant: {answers.claimant_first_name} {answers.claimant_last_name}</p>
            )}
            {answers.amount && (
              <p>Amount: ${answers.amount}</p>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}

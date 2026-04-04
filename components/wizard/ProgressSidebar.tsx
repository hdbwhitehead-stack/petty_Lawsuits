'use client'

const STEPS = ['Defendant', 'Claimant', 'Incident', 'Evidence']

type Props = {
  currentStep: number
  answers: Record<string, string>
  onStepClick: (step: number) => void
}

export default function ProgressSidebar({ currentStep, answers, onStepClick }: Props) {
  const percent = Math.round((currentStep / 4) * 100)

  return (
    <aside className="w-64 border-r border-[var(--border)] bg-[var(--card)] p-6 hidden md:block">
      <h2 className="text-lg mb-4">Progress</h2>
      <div className="w-full bg-[var(--accent-light)] rounded-full h-2 mb-6">
        <div
          className="bg-[var(--accent)] h-2 rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ol className="space-y-3">
        {STEPS.map((step, i) => (
          <li
            key={step}
            onClick={() => i <= currentStep && onStepClick(i)}
            className={`text-sm font-['DM_Sans'] flex items-center gap-2 ${
              i < currentStep
                ? 'text-[var(--accent)] cursor-pointer hover:underline'
                : i === currentStep
                ? 'text-[var(--foreground)] font-semibold'
                : 'text-[var(--muted)]'
            }`}
          >
            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
              i < currentStep
                ? 'bg-[var(--accent)] text-white'
                : i === currentStep
                ? 'bg-[var(--foreground)] text-white'
                : 'bg-[var(--accent-light)] text-[var(--muted)]'
            }`}>
              {i < currentStep ? '\u2713' : i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>

      <div className="mt-8 space-y-2 text-sm text-[var(--muted)] font-['DM_Sans']">
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
    </aside>
  )
}

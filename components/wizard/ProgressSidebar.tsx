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
    <aside className="w-64 border-r p-6 hidden md:block">
      <h2 className="font-bold text-lg mb-4">Progress</h2>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-black h-2 rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ol className="space-y-3">
        {STEPS.map((step, i) => (
          <li
            key={step}
            onClick={() => i <= currentStep && onStepClick(i)}
            className={`text-sm ${
              i < currentStep
                ? 'text-blue-600 cursor-pointer hover:underline'
                : i === currentStep
                ? 'font-bold'
                : 'text-gray-400'
            }`}
          >
            {i + 1}. {step}
          </li>
        ))}
      </ol>

      <div className="mt-8 space-y-2 text-sm text-gray-600">
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

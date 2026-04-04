import Link from 'next/link'

const CATEGORIES = [
  {
    name: 'Debt & Money',
    id: 'debt-recovery',
    description: 'Formally demand repayment of money owed to you.',
    examples: ['Someone owes you money and won\'t pay', 'An invoice has gone unpaid past the due date', 'A personal loan hasn\'t been returned'],
    available: true,
  },
  {
    name: 'Consumer',
    id: 'consumer-complaint',
    description: 'Demand a refund or remedy for faulty goods or poor service.',
    examples: ['A product you bought is defective', 'A service was not delivered as promised', 'A business refuses to honour a warranty'],
    available: true,
  },
  {
    name: 'Tenancy',
    id: 'bond-dispute',
    description: 'Dispute an unfair bond deduction or breach of lease.',
    examples: ['Your landlord is withholding your bond unfairly', 'Repairs haven\'t been made despite repeated requests', 'You\'re being charged for normal wear and tear'],
    available: true,
  },
  {
    name: 'Neighbour Disputes',
    id: 'neighbour',
    description: 'Address nuisance, noise, boundary, or property damage issues.',
    examples: ['Ongoing noise complaints', 'Damage to your property from a neighbour\'s tree', 'Boundary or fence disputes'],
    available: false,
  },
  {
    name: 'Employment',
    id: 'employment',
    description: 'Address underpayment, unfair dismissal, or workplace issues.',
    examples: ['You haven\'t been paid correct wages or entitlements', 'You were unfairly dismissed', 'Your employer breached your employment contract'],
    available: false,
  },
  {
    name: 'Contracts',
    id: 'contracts',
    description: 'Simple service agreements and freelance contracts.',
    examples: ['A contractor didn\'t complete agreed work', 'A freelance client hasn\'t paid for delivered work', 'A service agreement was breached'],
    available: false,
  },
  {
    name: 'Court Filings',
    id: 'court',
    description: 'Small claims tribunal forms for your state.',
    examples: ['Filing an application with NCAT, VCAT, or QCAT', 'Responding to a small claims action', 'Preparing tribunal documentation'],
    available: false,
  },
]

export default function DocumentsPage() {
  const available = CATEGORIES.filter(c => c.available)
  const upcoming = CATEGORIES.filter(c => !c.available)

  return (
    <main className="max-w-4xl mx-auto px-6 py-20 md:py-24">
      <h1 className="text-4xl md:text-5xl text-center mb-4">Document Types</h1>
      <p className="text-center text-[var(--muted)] text-lg mb-14 max-w-xl mx-auto">
        Choose the type of document that fits your situation. Each is tailored to Australian law and your specific jurisdiction.
      </p>

      {/* Available now */}
      <h2 className="text-xl font-medium mb-4 flex items-center gap-3">
        <span className="inline-block w-2 h-2 rounded-full bg-[var(--accent)]" />
        Available now
      </h2>
      <div className="space-y-4 mb-14">
        {available.map(cat => (
          <div
            key={cat.id}
            className="border border-[var(--border)] rounded-lg p-6 md:p-8 bg-[var(--card)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-2xl mb-2">{cat.name}</h3>
                <p className="text-[var(--muted)] text-base mb-4">{cat.description}</p>
                <div className="space-y-1.5">
                  {cat.examples.map(ex => (
                    <p key={ex} className="text-sm text-[var(--muted)] flex items-start gap-2">
                      <span className="text-[var(--accent)] mt-0.5">&mdash;</span>
                      {ex}
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 pt-1">
                <Link
                  href="/wizard"
                  className="text-base bg-[var(--foreground)] text-white px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                  Create document
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coming soon */}
      <h2 className="text-xl font-medium mb-4 flex items-center gap-3 text-[var(--muted)]">
        <span className="inline-block w-2 h-2 rounded-full bg-[var(--border)]" />
        Coming soon
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {upcoming.map(cat => (
          <div
            key={cat.id}
            className="border border-[var(--border)] rounded-lg p-6 bg-[var(--card)] opacity-60"
          >
            <h3 className="text-xl mb-2">{cat.name}</h3>
            <p className="text-[var(--muted)] text-base mb-3">{cat.description}</p>
            <div className="space-y-1">
              {cat.examples.slice(0, 2).map(ex => (
                <p key={ex} className="text-sm text-[var(--muted)] flex items-start gap-2">
                  <span className="mt-0.5">&mdash;</span>
                  {ex}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

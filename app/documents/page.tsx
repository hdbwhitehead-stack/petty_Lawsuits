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
  return (
    <main className="max-w-4xl mx-auto px-6 py-24 md:py-32">
      <h1 className="text-4xl md:text-5xl text-center mb-6">Document Types</h1>
      <p className="text-center text-[var(--muted)] text-lg mb-20 max-w-xl mx-auto">
        Choose the type of document that fits your situation. Each is tailored to Australian law and your specific jurisdiction.
      </p>

      <div className="space-y-6">
        {CATEGORIES.map(cat => (
          <div
            key={cat.id}
            className={`border border-[var(--border)] rounded-lg p-8 bg-[var(--card)] ${!cat.available ? 'opacity-50' : ''}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-2xl mb-2">{cat.name}</h2>
                <p className="text-[var(--muted)] text-sm mb-4">{cat.description}</p>
                <div className="space-y-1">
                  {cat.examples.map(ex => (
                    <p key={ex} className="text-xs text-[var(--muted)] flex items-start gap-2">
                      <span className="text-[var(--accent)] mt-0.5">&mdash;</span>
                      {ex}
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 pt-1">
                {cat.available ? (
                  <Link
                    href="/wizard"
                    className="text-sm bg-[var(--foreground)] text-white px-5 py-2 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
                  >
                    Create document
                  </Link>
                ) : (
                  <span className="text-xs text-[var(--muted)] border border-[var(--border)] px-3 py-1.5 rounded-full">
                    Coming soon
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

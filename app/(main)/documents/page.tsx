import Link from 'next/link'
import { StickerButton } from '@/components/ui/StickerButton'
import { StickerCard } from '@/components/ui/StickerCard'
import { Highlight } from '@/components/ui/Highlight'
import { Tape } from '@/components/ui/Tape'

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

const AVAILABLE_TINTS = ['var(--card)', 'var(--lemon-tint)', 'var(--pink-tint)']
const AVAILABLE_ROTATES = [-0.5, 0, 0.5] as const

export default function DocumentsPage() {
  const available = CATEGORIES.filter(c => c.available)
  const upcoming = CATEGORIES.filter(c => !c.available)

  return (
    <main className="max-w-4xl mx-auto px-6 py-20 md:py-24">
      <h1 className="font-display font-extrabold text-4xl md:text-5xl text-center mb-4">
        Pick your <Highlight>fight</Highlight>
      </h1>
      <p className="text-center text-muted text-lg mb-6 max-w-xl mx-auto">
        Every document is tailored to Australian law and your specific jurisdiction.
      </p>
      <p className="font-mono text-sm text-muted text-center mb-14">
        NSW · VIC · QLD · WA · SA · TAS · ACT · NT
      </p>

      {/* Available now */}
      <div className="relative mt-2 mb-14 pt-2">
        <Tape color="lemon" position="top-left" />
        <h2 className="font-display font-extrabold text-3xl mb-6 mt-4">Ready to file</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {available.map((cat, i) => (
            <StickerCard
              key={cat.id}
              color={AVAILABLE_TINTS[i % 3]}
              rotate={AVAILABLE_ROTATES[i % 3]}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-display font-extrabold text-2xl">{cat.name}</h3>
                  <span className="font-mono text-[11px] uppercase tracking-wider px-2 py-1 border-2 border-foreground rounded flex-shrink-0">
                    {cat.id.replace('-', ' · ')}
                  </span>
                </div>
                <p className="text-base mb-4">{cat.description}</p>
                <ul className="space-y-1.5 mb-6 flex-1">
                  {cat.examples.map(ex => (
                    <li key={ex} className="text-sm flex items-start gap-2">
                      <span className="text-accent flex-shrink-0 mt-0.5">✦</span>
                      {ex}
                    </li>
                  ))}
                </ul>
                <div>
                  <StickerButton as={Link} href="/wizard" variant="primary" size="sm">
                    Get petty about this
                  </StickerButton>
                </div>
              </div>
            </StickerCard>
          ))}
        </div>
      </div>

      {/* Coming soon */}
      <div className="mb-14">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-2 mb-1">On the way ✦</p>
        <h2 className="font-display font-extrabold text-3xl mb-6">Future fights</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {upcoming.map(cat => (
            <StickerCard key={cat.id} color="var(--card)" rotate={0} className="opacity-60">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-display font-extrabold text-xl">{cat.name}</h3>
                <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-foreground rounded flex-shrink-0">
                  Coming soon
                </span>
              </div>
              <p className="text-base mb-3">{cat.description}</p>
              <ul className="space-y-1">
                {cat.examples.slice(0, 2).map(ex => (
                  <li key={ex} className="text-sm flex items-start gap-2">
                    <span className="text-muted flex-shrink-0 mt-0.5">✦</span>
                    {ex}
                  </li>
                ))}
              </ul>
            </StickerCard>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <StickerCard color="var(--sky-tint)" rotate={0} padding="32px">
        <h3 className="font-display font-extrabold text-2xl mb-2">Don&apos;t see your situation?</h3>
        <p
          className="font-marker text-xl mb-4"
          style={{ display: 'inline-block', transform: 'rotate(-1deg)' }}
        >
          tell us — we add new types based on what people ask for ✦
        </p>
        <div>
          <StickerButton as="a" href="mailto:hello@pettylawsuits.com.au" variant="ghost" size="sm">
            Email us
          </StickerButton>
        </div>
      </StickerCard>
    </main>
  )
}

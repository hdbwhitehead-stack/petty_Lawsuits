import Link from 'next/link'
import { Stamp } from '@/components/ui/Stamp'
import { Highlight } from '@/components/ui/Highlight'
import { StickerButton } from '@/components/ui/StickerButton'

const WINS = [
  { id: 1, name: 'Maya', state: 'VIC', amount: 1200, days: 8, category: 'Bond dispute' },
  { id: 2, name: 'Jai', state: 'NSW', amount: 3400, days: 14, category: 'Faulty goods' },
  { id: 3, name: 'Priya', state: 'QLD', amount: 750, days: 5, category: 'Unpaid invoice' },
  { id: 4, name: 'Tom', state: 'WA', amount: 2100, days: 11, category: 'Landlord dispute' },
  { id: 5, name: 'Amara', state: 'NSW', amount: 890, days: 9, category: 'Noise complaint' },
  { id: 6, name: 'Zoe', state: 'VIC', amount: 4500, days: 21, category: 'Contractor dispute' },
  { id: 7, name: 'Ben', state: 'SA', amount: 680, days: 7, category: 'Security deposit' },
  { id: 8, name: 'Lily', state: 'ACT', amount: 1850, days: 12, category: 'Faulty goods' },
]

export const metadata = {
  title: 'Wall of Wins — Petty Lawsuits',
  description: 'Real Australians who got their money back. Bond disputes, faulty goods, unpaid invoices — all sorted.',
}

export default function WinsPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20 md:py-24">

      {/* Hero */}
      <div className="text-center mb-14">
        <div
          className="inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-widest mb-4"
          style={{
            background: 'var(--grass)',
            color: '#fff',
            border: '2px solid var(--foreground)',
            borderRadius: '999px',
            boxShadow: '2px 2px 0 #1A1814',
          }}
        >
          HALL OF FAME
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
          Wall of <Highlight color="var(--grass)">Wins</Highlight>
        </h1>
        <div
          className="font-display font-extrabold text-5xl md:text-6xl mb-3"
          style={{ color: 'var(--accent)' }}
        >
          $148K
        </div>
        <p className="text-base text-[var(--muted)] max-w-sm mx-auto">
          recovered from landlords, dodgy tradies, employers & more this month
        </p>
      </div>

      {/* Win cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-14">
        {WINS.map((win) => (
          <div
            key={win.id}
            className="relative"
            style={{
              background: 'var(--card)',
              border: '2px solid var(--foreground)',
              borderRadius: 16,
              boxShadow: '3px 3px 0 #1A1814',
              padding: '24px',
              overflow: 'hidden',
            }}
          >
            {/* WON stamp */}
            <div className="absolute top-4 right-4">
              <Stamp size={56} rotate={-8} color="var(--grass)">WON</Stamp>
            </div>

            {/* Amount */}
            <p className="font-display font-extrabold text-3xl mb-1">
              +${win.amount.toLocaleString()}
            </p>

            {/* Name + state */}
            <p className="text-base font-bold mb-1">
              {win.name}
              {' '}
              <span
                className="text-xs font-bold uppercase tracking-wider px-2 py-0.5"
                style={{
                  background: 'var(--sky-tint)',
                  border: '2px solid var(--foreground)',
                  borderRadius: 999,
                  boxShadow: '1px 1px 0 #1A1814',
                }}
              >
                {win.state}
              </span>
            </p>

            {/* Category + days */}
            <p className="text-sm text-[var(--muted)]">
              {win.category} · resolved in {win.days} days
            </p>
          </div>
        ))}
      </div>

      {/* Submit CTA */}
      <div
        className="text-center rounded-2xl px-8 py-10"
        style={{
          background: 'var(--lemon-tint)',
          border: '2px solid var(--foreground)',
          boxShadow: '5px 5px 0 #1A1814',
        }}
      >
        <p
          className="text-2xl mb-2"
          style={{ fontFamily: 'var(--font-marker)' }}
        >
          got your money back? ✦
        </p>
        <p className="text-sm text-[var(--muted)] mb-6 max-w-sm mx-auto">
          Share your win anonymously. It helps other Aussies know they can fight back too.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <StickerButton
            as={Link}
            href="mailto:wins@pettylawsuits.com.au?subject=My Petty Win"
            variant="primary"
            size="md"
          >
            Submit your win
          </StickerButton>
          <StickerButton as={Link} href="/wizard" variant="ghost" size="md">
            Start a new case
          </StickerButton>
        </div>
      </div>

    </main>
  )
}

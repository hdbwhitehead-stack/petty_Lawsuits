import Link from 'next/link'
import { JurisdictionMap } from '@/components/home/JurisdictionMap'
import { StickerButton } from '@/components/ui/StickerButton'
import { Highlight } from '@/components/ui/Highlight'
import { StickerCard } from '@/components/ui/StickerCard'
import { Stamp } from '@/components/ui/Stamp'

const QUEST_STEPS = [
  {
    num: '01',
    color: 'var(--lemon)',
    title: 'Describe the situation',
    desc: 'Answer a few questions — who wronged you, what happened, how much. Takes about 3 minutes.',
    xp: '+100 XP',
    rotate: -1,
  },
  {
    num: '02',
    color: 'var(--pink)',
    title: 'We write the document',
    desc: 'AI drafts a formal legal letter referencing the right tribunal and legislation for your state.',
    xp: '+100 XP',
    rotate: 1,
  },
  {
    num: '03',
    color: 'var(--sky)',
    title: 'Send it and wait',
    desc: 'Download as PDF or Word. Edit any field in-browser, then send. Most disputes resolve in 14 days.',
    xp: '+200 XP',
    rotate: 0,
  },
]

const USE_CASES = [
  {
    situation: 'They owe you cash',
    detail: 'Client, contractor, or mate refuses to pay up.',
    tint: 'var(--lemon-tint)',
    document: 'Debt recovery demand letter',
  },
  {
    situation: 'Dodgy product, no refund',
    detail: "Retailer won't budge on a clearly broken item.",
    tint: 'var(--pink-tint)',
    document: 'Consumer complaint letter',
  },
  {
    situation: 'Landlord stole your bond',
    detail: 'Normal wear and tear ≠ yours to pay for.',
    tint: 'var(--sky-tint)',
    document: 'Bond dispute letter',
  },
  {
    situation: 'Tradie botched the job',
    detail: "Substandard work and they won't fix it.",
    tint: 'var(--grass-tint)',
    document: 'Consumer complaint letter',
  },
  {
    situation: 'Warranty? What warranty?',
    detail: "They sold you a guarantee they're now ignoring.",
    tint: 'var(--lemon-tint)',
    document: 'Consumer complaint letter',
  },
  {
    situation: 'Mate ghosted your loan',
    detail: 'Personal loan, no repayment, plenty of excuses.',
    tint: 'var(--pink-tint)',
    document: 'Debt recovery demand letter',
  },
]

const WINS = [
  { name: 'Maya', state: 'VIC', amount: '$1,200', days: 8 },
  { name: 'Daniel', state: 'NSW', amount: '$890', days: 12 },
  { name: 'Priya', state: 'QLD', amount: '$3,500', days: 21 },
  { name: 'Tom', state: 'WA', amount: '$420', days: 5 },
  { name: 'Sarah', state: 'SA', amount: '$2,100', days: 18 },
  { name: 'James', state: 'VIC', amount: '$750', days: 9 },
]

export default function HomePage() {
  return (
    <main>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="paper-lines max-w-6xl mx-auto px-6 pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Copy */}
          <div>
            <div
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 text-sm font-bold"
              style={{
                background: 'var(--lemon)',
                border: '2px solid var(--foreground)',
                borderRadius: '999px',
                boxShadow: '3px 3px 0 #1A1814',
              }}
            >
              <span>🔥</span>
              <span>4,218 Aussies got petty this week</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold leading-[1.05] tracking-tight text-balance">
              Legal docs for <Highlight>anything</Highlight>.
            </h1>

            <p className="mt-3 text-xl" style={{ fontFamily: 'var(--font-marker)', color: 'var(--muted)' }}>
              in like 5 mins ✦
            </p>

            <p className="mt-5 text-lg text-[var(--muted)] max-w-lg leading-relaxed">
              Demand letters, tribunal filings, and more — tailored to your Australian state, written in proper legal language. No lawyer needed.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <StickerButton as={Link} href="/wizard" variant="primary" size="lg">
                Sue someone
              </StickerButton>
              <StickerButton as={Link} href="/how-it-works" variant="ghost" size="lg">
                How it works
              </StickerButton>
            </div>

            {/* Colored stats */}
            <div className="flex gap-8 mt-10">
              {[
                { value: '8', label: 'states covered', color: 'var(--lemon)' },
                { value: '$29', label: 'to get started', color: 'var(--pink)' },
                { value: '~5 min', label: 'average time', color: 'var(--sky)' },
              ].map(stat => (
                <div key={stat.label}>
                  <p className="text-2xl font-extrabold font-display" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                  <p className="text-sm text-[var(--muted)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stacked document visual */}
          <div className="hidden md:flex items-center justify-center relative h-72">
            <StickerCard
              rotate={-5}
              color="var(--sky-tint)"
              shadow="sticker-lg"
              style={{ position: 'absolute', width: 260, top: 10, left: 30 }}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-3">Tribunal Filing</p>
              <div className="space-y-2">
                {[90, 70, 85, 55, 80].map((w, i) => (
                  <div key={i} className="h-2 rounded-full" style={{ width: `${w}%`, background: 'var(--border)' }} />
                ))}
              </div>
            </StickerCard>

            <StickerCard
              rotate={3}
              color="var(--lemon-tint)"
              shadow="sticker-lg"
              style={{ position: 'absolute', width: 260, top: 0, left: 70 }}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-3">Demand Letter</p>
              <div className="space-y-2">
                {[80, 100, 60, 90, 75].map((w, i) => (
                  <div key={i} className="h-2 rounded-full" style={{ width: `${w}%`, background: 'var(--border)' }} />
                ))}
              </div>
            </StickerCard>

            <StickerCard
              rotate={-1}
              color="#fff"
              shadow="sticker-lg"
              style={{ position: 'absolute', width: 260, top: 30, left: 50 }}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-3">Consumer Complaint</p>
              <div className="space-y-2">
                {[75, 95, 65, 85, 70].map((w, i) => (
                  <div key={i} className="h-2 rounded-full" style={{ width: `${w}%`, background: 'var(--border)' }} />
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <Stamp size={56} rotate={-12}>SENT</Stamp>
              </div>
            </StickerCard>
          </div>

        </div>
      </section>

      {/* ── Quest / How It Works ───────────────────────────────────────── */}
      <section
        className="paper-lines"
        style={{ borderTop: '2px solid var(--foreground)', borderBottom: '2px solid var(--foreground)' }}
      >
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-display font-extrabold">
              Three steps. <Highlight color="var(--lemon)">400 XP.</Highlight>
            </h2>
            <p className="text-[var(--muted)] mt-3 text-lg">Complete all three and you&apos;re officially petty.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {QUEST_STEPS.map(step => (
              <StickerCard key={step.num} color={step.color} rotate={step.rotate} padding={28}>
                <p
                  className="font-display font-extrabold leading-none mb-4"
                  style={{ fontSize: 64, opacity: 0.18 }}
                >
                  {step.num}
                </p>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-[var(--muted)] text-base leading-relaxed mb-4">{step.desc}</p>
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold"
                  style={{
                    background: '#fff',
                    border: '2px solid var(--foreground)',
                    borderRadius: '999px',
                    boxShadow: '2px 2px 0 #1A1814',
                  }}
                >
                  ⚡ {step.xp}
                </div>
              </StickerCard>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/how-it-works"
              className="text-base text-[var(--muted)] hover:text-[var(--foreground)] underline underline-offset-4 transition-colors"
            >
              See the full walkthrough
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pick Your Fight / Use Cases ────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-display font-extrabold">
            Pick your <Highlight color="var(--pink)">fight</Highlight>
          </h2>
          <p className="text-[var(--muted)] mt-3 text-lg">
            These are the situations people use Petty Lawsuits to win.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {USE_CASES.map(uc => (
            <StickerCard key={uc.situation} color={uc.tint} padding="20px 24px">
              <h3 className="text-lg font-bold mb-1">{uc.situation}</h3>
              <p className="text-base text-[var(--muted)] leading-relaxed mb-3">{uc.detail}</p>
              <p className="text-sm font-medium" style={{ color: 'var(--accent)' }}>{uc.document}</p>
            </StickerCard>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/documents"
            className="text-base text-[var(--muted)] hover:text-[var(--foreground)] underline underline-offset-4 transition-colors"
          >
            See all document types
          </Link>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────────────────────── */}
      <section
        style={{
          borderTop: '2px solid var(--foreground)',
          borderBottom: '2px solid var(--foreground)',
          background: 'var(--paper-alt)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-display font-extrabold">
              Simple <Highlight color="var(--sky)">pricing</Highlight>
            </h2>
            <p className="text-[var(--muted)] mt-3 text-lg">Pay per document. No subscriptions. No hidden fees.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">

            {/* Send the Letter */}
            <StickerCard padding={32}>
              <h3 className="text-xl font-bold mb-1">Send the Letter</h3>
              <p className="font-display font-extrabold text-4xl mt-2">$29</p>
              <p className="text-sm text-[var(--muted)] mb-6">one-time payment</p>
              <ul className="space-y-3 text-base mb-6">
                {[
                  'Full document access',
                  'Download as PDF',
                  'Email delivery to recipient',
                  'Saved to your account',
                ].map(f => (
                  <li key={f} className="flex gap-2 items-center">
                    <span style={{ color: 'var(--accent)' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <StickerButton
                as={Link}
                href="/wizard"
                variant="ink"
                size="md"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Get started
              </StickerButton>
            </StickerCard>

            {/* Go Full Petty */}
            <div className="relative pt-3">
              <div
                className="absolute top-0 left-1/2 z-10 px-4 py-1 text-xs font-bold uppercase tracking-widest"
                style={{
                  background: 'var(--lemon)',
                  border: '2px solid var(--foreground)',
                  borderRadius: 4,
                  boxShadow: '2px 2px 0 #1A1814',
                  transform: 'translateX(-50%) rotate(-1.5deg)',
                }}
              >
                RECOMMENDED
              </div>
              <StickerCard color="var(--accent-tint)" padding={32} shadow="sticker-lg">
                <h3 className="text-xl font-bold mb-1">Go Full Petty</h3>
                <p className="font-display font-extrabold text-4xl mt-2">$49</p>
                <p className="text-sm text-[var(--muted)] mb-6">one-time payment</p>
                <ul className="space-y-3 text-base mb-6">
                  {[
                    'Everything in Send the Letter',
                    'Download as Word doc',
                    'Edit all fields in-browser',
                    'Certified mail tracking',
                    'Follow-up letter template',
                  ].map(f => (
                    <li key={f} className="flex gap-2 items-center">
                      <span style={{ color: 'var(--accent)' }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <StickerButton
                  as={Link}
                  href="/wizard"
                  variant="primary"
                  size="md"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Get started
                </StickerButton>
              </StickerCard>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/pricing"
              className="text-base text-[var(--muted)] hover:text-[var(--foreground)] underline underline-offset-4 transition-colors"
            >
              View full pricing details
            </Link>
          </div>
        </div>
      </section>

      {/* ── Jurisdiction ───────────────────────────────────────────────── */}
      <section>
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20 text-center">
          <h2 className="text-3xl md:text-5xl font-display font-extrabold mb-4">
            Every state &amp; <Highlight color="var(--grass-tint)">territory</Highlight>
          </h2>
          <p className="text-[var(--muted)] text-lg mb-10 max-w-xl mx-auto">
            Each document references the correct tribunal, filing thresholds, and legislation for your jurisdiction.
          </p>
          <JurisdictionMap />
        </div>
      </section>

      {/* ── Wall of Wins ───────────────────────────────────────────────── */}
      <section
        style={{
          borderTop: '2px solid var(--foreground)',
          borderBottom: '2px solid var(--foreground)',
          background: 'var(--paper-alt)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 mb-4 px-4 py-2 text-sm font-bold text-white"
              style={{
                background: 'var(--grass)',
                border: '2px solid var(--foreground)',
                borderRadius: '999px',
                boxShadow: '3px 3px 0 #1A1814',
              }}
            >
              <span>🏆</span> $148K recovered this month
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold">
              Wall of <Highlight color="var(--grass-tint)">Wins</Highlight>
            </h2>
            <p className="text-[var(--muted)] mt-3 text-lg">Real results from real petty people.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WINS.map((win, i) => (
              <StickerCard key={i} color="#fff" padding="20px 24px" rotate={i % 3 === 1 ? -1 : 0}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-base">{win.name} · {win.state}</p>
                    <p className="text-[var(--muted)] text-sm mt-0.5">resolved in {win.days} days</p>
                    <p className="font-display font-extrabold text-3xl mt-2" style={{ color: 'var(--accent)' }}>
                      +{win.amount}
                    </p>
                  </div>
                  <Stamp size={60} rotate={i % 2 === 0 ? -10 : 8} color="var(--grass)">WON</Stamp>
                </div>
              </StickerCard>
            ))}
          </div>

          <div className="text-center mt-10">
            <StickerButton as={Link} href="/wins" variant="lemon" size="md">
              Submit your win ✦
            </StickerButton>
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────────── */}
      <section className="paper-lines max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
        <h2 className="text-3xl md:text-5xl font-display font-extrabold mb-4">
          Ready to get <Highlight>petty</Highlight>?
        </h2>
        <p className="text-xl mb-8" style={{ fontFamily: 'var(--font-marker)', color: 'var(--muted)' }}>
          No account needed to start. Takes about 5 minutes. ✦
        </p>
        <StickerButton as={Link} href="/wizard" variant="primary" size="lg">
          Sue someone
        </StickerButton>
      </section>

    </main>
  )
}

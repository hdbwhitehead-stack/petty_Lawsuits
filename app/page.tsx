import Link from 'next/link'
import { TEMPLATES } from '@/lib/documents/templates'

const STATS = [
  { value: '8', label: 'States & territories covered' },
  { value: '$29', label: 'Starting price per document' },
  { value: '~5 min', label: 'Average completion time' },
]

const USE_CASES = [
  {
    situation: 'Unpaid invoice',
    detail: 'A client or individual owes you money and has ignored reminders.',
    document: 'Debt recovery demand letter',
  },
  {
    situation: 'Faulty product',
    detail: 'A retailer refuses to refund or replace a defective item.',
    document: 'Consumer complaint letter',
  },
  {
    situation: 'Bond dispute',
    detail: 'Your landlord is keeping your bond for normal wear and tear.',
    document: 'Bond dispute letter',
  },
  {
    situation: 'Poor service',
    detail: 'A tradesperson did substandard work and won\'t fix it.',
    document: 'Consumer complaint letter',
  },
  {
    situation: 'Broken warranty',
    detail: 'A business refuses to honour a warranty claim.',
    document: 'Consumer complaint letter',
  },
  {
    situation: 'Personal loan',
    detail: 'Someone you lent money to won\'t pay it back.',
    document: 'Debt recovery demand letter',
  },
]

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 md:pt-32 md:pb-20 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-balance">
          Legal documents for Australian disputes — without a lawyer.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-[var(--muted)] max-w-2xl mx-auto leading-relaxed">
          Generate demand letters, complaint notices, and tribunal filings in minutes. Tailored to your state, written in formal legal language.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link
            href="/wizard"
            className="inline-block bg-[var(--foreground)] text-white px-8 py-3.5 rounded-full text-base hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
          <Link
            href="/how-it-works"
            className="inline-block text-[var(--foreground)] border border-[var(--border)] px-8 py-3.5 rounded-full text-base hover:border-[var(--foreground)] transition-colors"
          >
            How it works
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <div className="max-w-4xl mx-auto px-6 pb-16 md:pb-20">
        <div className="grid grid-cols-3 border border-[var(--border)] rounded-lg bg-[var(--card)] divide-x divide-[var(--border)]">
          {STATS.map(stat => (
            <div key={stat.label} className="py-5 md:py-6 text-center">
              <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-[var(--muted)] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <section className="bg-[var(--card)] border-y border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <h2 className="text-3xl md:text-4xl text-center mb-12">Three steps to your document</h2>
          <div className="grid md:grid-cols-3 gap-10 md:gap-12">
            {[
              {
                num: '01',
                title: 'Describe your situation',
                desc: 'Answer a few questions about who you\'re claiming against, what happened, and the amount in dispute. Upload any evidence you have.',
              },
              {
                num: '02',
                title: 'We generate your document',
                desc: 'AI drafts a formal legal document tailored to your jurisdiction — referencing the correct tribunal, thresholds, and legislation.',
              },
              {
                num: '03',
                title: 'Download and send',
                desc: 'Review the preview, pay to unlock, then download as PDF or Word. Edit any details in-browser before sending.',
              },
            ].map(step => (
              <div key={step.num} className="border-l-2 border-[var(--accent)] pl-6">
                <p className="text-sm font-medium text-[var(--accent)] mb-2">{step.num}</p>
                <h3 className="text-xl mb-2">{step.title}</h3>
                <p className="text-[var(--muted)] text-base leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/how-it-works" className="text-base text-[var(--muted)] hover:text-[var(--foreground)] underline underline-offset-4 transition-colors">
              See the full walkthrough
            </Link>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <h2 className="text-3xl md:text-4xl text-center mb-4">Sound familiar?</h2>
        <p className="text-center text-[var(--muted)] text-lg mb-12 max-w-xl mx-auto">
          These are the kinds of disputes people use Petty Lawsuits to resolve.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {USE_CASES.map(uc => (
            <div key={uc.situation} className="border border-[var(--border)] rounded-lg p-6 bg-[var(--card)]">
              <h3 className="text-lg mb-1 font-medium">{uc.situation}</h3>
              <p className="text-base text-[var(--muted)] leading-relaxed mb-3">{uc.detail}</p>
              <p className="text-sm text-[var(--accent)] font-medium">{uc.document}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/documents" className="text-base text-[var(--muted)] hover:text-[var(--foreground)] underline underline-offset-4 transition-colors">
            See all document types
          </Link>
        </div>
      </section>

      {/* Document Types */}
      <section className="bg-[var(--card)] border-y border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <h2 className="text-3xl md:text-4xl text-center mb-4">Available documents</h2>
          <p className="text-center text-[var(--muted)] text-lg mb-12">
            Three categories live now, with more on the way.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEMPLATES.map(t => (
              <div key={t.id} className="border border-[var(--border)] rounded-lg p-6 bg-[var(--background)] hover:border-[var(--accent)] transition-colors">
                <h3 className="text-lg mb-2">{t.category}</h3>
                <p className="text-base text-[var(--muted)] leading-relaxed">{t.description}</p>
              </div>
            ))}
            {['Neighbour Disputes', 'Employment', 'Contracts', 'Court Filings'].map(cat => (
              <div key={cat} className="border border-[var(--border)] rounded-lg p-6 bg-[var(--background)] opacity-50">
                <h3 className="text-lg mb-2">{cat}</h3>
                <p className="text-base text-[var(--muted)]">Coming soon</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <h2 className="text-3xl md:text-4xl text-center mb-4">Simple pricing</h2>
        <p className="text-center text-[var(--muted)] text-lg mb-12">Pay per document. No hidden fees.</p>
        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div className="border border-[var(--border)] rounded-lg p-8 bg-[var(--card)]">
            <h3 className="text-xl mb-1">Send the Letter</h3>
            <p className="text-3xl font-bold mt-2">$29</p>
            <p className="text-sm text-[var(--muted)] mb-6">one-time payment</p>
            <ul className="space-y-3 text-base">
              <li className="flex gap-2"><span className="text-[var(--accent)]">&#10003;</span> Full document access</li>
              <li className="flex gap-2"><span className="text-[var(--accent)]">&#10003;</span> Download as PDF</li>
              <li className="flex gap-2"><span className="text-[var(--accent)]">&#10003;</span> Email delivery to recipient</li>
              <li className="flex gap-2"><span className="text-[var(--accent)]">&#10003;</span> Saved to your account</li>
            </ul>
          </div>
          <div className="border-2 border-[var(--foreground)] rounded-lg p-8 bg-[var(--card)] relative">
            <span className="absolute -top-3 left-6 bg-[var(--foreground)] text-white text-xs px-3 py-1 rounded-full">Recommended</span>
            <h3 className="text-xl mb-1">Go Full Petty</h3>
            <p className="text-3xl font-bold mt-2">$49</p>
            <p className="text-sm text-[var(--muted)] mb-6">one-time payment</p>
            <ul className="space-y-3 text-base">
              <li className="flex gap-2"><span className="text-[var(--accent)]">&#10003;</span> Everything in Send the Letter</li>
              <li className="flex gap-2"><span className="text-[var(--accent)]">&#10003;</span> Download as Word doc</li>
              <li className="flex gap-2"><span className="text-[var(--accent)]">&#10003;</span> Edit all fields in-browser</li>
              <li className="flex gap-2"><span className="text-[var(--accent)]">&#10003;</span> Certified mail tracking</li>
              <li className="flex gap-2"><span className="text-[var(--accent)]">&#10003;</span> Follow-up letter template</li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-10">
          <Link href="/pricing" className="text-base text-[var(--muted)] hover:text-[var(--foreground)] underline underline-offset-4 transition-colors">
            View full pricing details
          </Link>
        </div>
      </section>

      {/* Jurisdiction coverage */}
      <section className="bg-[var(--card)] border-y border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20 text-center">
          <h2 className="text-3xl md:text-4xl mb-4">Every state and territory</h2>
          <p className="text-[var(--muted)] text-lg mb-10 max-w-xl mx-auto">
            Each document references the correct tribunal, filing thresholds, and legislation for your jurisdiction.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { code: 'NSW', tribunal: 'NCAT' },
              { code: 'VIC', tribunal: 'VCAT' },
              { code: 'QLD', tribunal: 'QCAT' },
              { code: 'WA', tribunal: 'SAT' },
              { code: 'SA', tribunal: 'SACAT' },
              { code: 'TAS', tribunal: 'MRT' },
              { code: 'ACT', tribunal: 'ACAT' },
              { code: 'NT', tribunal: 'NTCAT' },
            ].map(j => (
              <div key={j.code} className="border border-[var(--border)] rounded-lg px-5 py-3 bg-[var(--background)]">
                <p className="font-bold text-base">{j.code}</p>
                <p className="text-sm text-[var(--muted)]">{j.tribunal}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
        <h2 className="text-3xl md:text-5xl mb-4">Ready to get started?</h2>
        <p className="text-[var(--muted)] text-lg mb-8">Your first document takes about 5 minutes. No account required to start.</p>
        <Link
          href="/wizard"
          className="inline-block bg-[var(--foreground)] text-white px-8 py-3.5 rounded-full text-base hover:opacity-90 transition-opacity"
        >
          Create your document
        </Link>
      </section>
    </main>
  )
}

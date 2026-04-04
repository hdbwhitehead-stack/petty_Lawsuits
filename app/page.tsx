import Link from 'next/link'
import { TEMPLATES } from '@/lib/documents/templates'

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 md:pt-36 md:pb-32 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-balance">
          Legal documents for Australian disputes — without a lawyer.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-[var(--muted)] max-w-2xl mx-auto leading-relaxed">
          Generate demand letters, complaint notices, and tribunal filings in minutes. From $29.
        </p>
        <Link
          href="/wizard"
          className="inline-block mt-10 bg-[var(--foreground)] text-white px-8 py-3.5 rounded-full text-base hover:opacity-90 transition-opacity"
        >
          Get Started
        </Link>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="border-t border-[var(--border)]" />
      </div>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <h2 className="text-3xl md:text-4xl text-center mb-16">Three steps to your document</h2>
        <div className="grid md:grid-cols-3 gap-12 md:gap-16">
          {[
            {
              num: '01',
              title: 'Describe your situation',
              desc: 'Answer a few questions about who you\'re claiming against and what happened.',
            },
            {
              num: '02',
              title: 'We generate your document',
              desc: 'AI drafts a formal legal document tailored to your jurisdiction and circumstances.',
            },
            {
              num: '03',
              title: 'Download and send',
              desc: 'Review, edit, and download as PDF or Word. Ready to send.',
            },
          ].map(step => (
            <div key={step.num}>
              <p className="text-sm font-medium text-[var(--accent)] mb-3">{step.num}</p>
              <h3 className="text-xl mb-3">{step.title}</h3>
              <p className="text-[var(--muted)] text-base leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/how-it-works" className="text-base text-[var(--muted)] hover:text-[var(--foreground)] underline underline-offset-4 transition-colors">
            Learn more about how it works
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="border-t border-[var(--border)]" />
      </div>

      {/* Document Types */}
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <h2 className="text-3xl md:text-4xl text-center mb-16">What can you create?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATES.map(t => (
            <div key={t.id} className="border border-[var(--border)] rounded-lg p-6 bg-[var(--card)] hover:border-[var(--accent)] transition-colors">
              <h3 className="text-lg mb-2">{t.category}</h3>
              <p className="text-base text-[var(--muted)] leading-relaxed">{t.description}</p>
            </div>
          ))}
          {['Neighbour Disputes', 'Employment', 'Contracts'].map(cat => (
            <div key={cat} className="border border-[var(--border)] rounded-lg p-6 bg-[var(--card)] opacity-60">
              <h3 className="text-lg mb-2">{cat}</h3>
              <p className="text-base text-[var(--muted)]">Coming soon</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/documents" className="text-base text-[var(--muted)] hover:text-[var(--foreground)] underline underline-offset-4 transition-colors">
            See all document types
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="border-t border-[var(--border)]" />
      </div>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <h2 className="text-3xl md:text-4xl text-center mb-4">Simple pricing</h2>
        <p className="text-center text-[var(--muted)] mb-16">Pay per document. No hidden fees.</p>
        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div className="border border-[var(--border)] rounded-lg p-8 bg-[var(--card)]">
            <h3 className="text-xl mb-1">Send the Letter</h3>
            <p className="text-3xl font-['DM_Sans'] font-bold mt-2">$29</p>
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
            <p className="text-3xl font-['DM_Sans'] font-bold mt-2">$49</p>
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
        <div className="text-center mt-12">
          <Link href="/pricing" className="text-base text-[var(--muted)] hover:text-[var(--foreground)] underline underline-offset-4 transition-colors">
            View full pricing
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
        <h2 className="text-3xl md:text-5xl mb-4">Ready to get started?</h2>
        <p className="text-[var(--muted)] text-lg mb-10">Your first document takes about 5 minutes.</p>
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

import Link from 'next/link'

const TIERS = [
  {
    name: 'Send the Letter',
    price: '$29',
    highlight: false,
    features: [
      'Full document access',
      'Download as PDF',
      'Email delivery to recipient',
      'Saved to your account permanently',
    ],
  },
  {
    name: 'Go Full Petty',
    price: '$49',
    highlight: true,
    features: [
      'Everything in Send the Letter',
      'Download as Word doc',
      'Edit all fields in-browser',
      'Certified mail tracking',
      'Follow-up letter template',
    ],
  },
]

const COMPARE_FEATURES = [
  { feature: 'Full document access', send: true, full: true },
  { feature: 'PDF download', send: true, full: true },
  { feature: 'Email delivery', send: true, full: true },
  { feature: 'Saved to account', send: true, full: true },
  { feature: 'Word (.docx) download', send: false, full: true },
  { feature: 'Edit fields in-browser', send: false, full: true },
  { feature: 'Certified mail tracking', send: false, full: true },
  { feature: 'Follow-up letter template', send: false, full: true },
]

const PRICING_FAQ = [
  {
    q: 'What happens after I pay?',
    a: 'Your full document is unlocked immediately. You can view, edit, and download it right away.',
  },
  {
    q: 'Can I edit my document after purchasing?',
    a: 'Yes. With Go Full Petty, you can edit all variable fields (names, dates, amounts) directly in the browser. The legal structure of the document stays intact.',
  },
  {
    q: 'What if the document generation fails?',
    a: 'You won\'t be charged for a failed generation. If it fails three times, we\'ll help you directly via email.',
  },
  {
    q: 'Is this legal advice?',
    a: 'No. Petty Lawsuits is a document generation tool. We produce templates based on your inputs. We are not a law firm and do not provide legal advice. We recommend seeking independent legal advice if you are unsure about your rights or obligations.',
  },
  {
    q: 'Can I get a refund?',
    a: 'If your document fails to generate after payment, we\'ll issue a full refund. For other issues, contact us and we\'ll work it out.',
  },
]

export default function PricingPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20 md:py-24">
      <h1 className="text-4xl md:text-5xl text-center mb-4">Pricing</h1>
      <p className="text-center text-[var(--muted)] text-lg mb-12">
        Pay per document. No subscription required.
      </p>

      {/* Tiers */}
      <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {TIERS.map(tier => (
          <div
            key={tier.name}
            className={`rounded-lg p-8 bg-[var(--card)] ${
              tier.highlight
                ? 'border-2 border-[var(--foreground)] relative'
                : 'border border-[var(--border)]'
            }`}
          >
            {tier.highlight && (
              <span className="absolute -top-3 left-6 bg-[var(--foreground)] text-white text-xs px-3 py-1 rounded-full">
                Recommended
              </span>
            )}
            <h2 className="text-2xl mb-1">{tier.name}</h2>
            <p className="text-4xl font-bold mt-3">{tier.price}</p>
            <p className="text-sm text-[var(--muted)] mb-6">one-time payment</p>
            <ul className="space-y-3 mb-8">
              {tier.features.map(f => (
                <li key={f} className="text-base flex gap-2">
                  <span className="text-[var(--accent)]">&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/wizard"
              className={`block text-center rounded-full px-6 py-3 text-base font-medium transition-opacity hover:opacity-90 ${
                tier.highlight
                  ? 'bg-[var(--foreground)] text-white'
                  : 'border border-[var(--foreground)]'
              }`}
            >
              Get Started
            </Link>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="max-w-2xl mx-auto mt-12 border border-[var(--border)] rounded-lg bg-[var(--card)] overflow-hidden">
        <div className="grid grid-cols-3 border-b border-[var(--border)] bg-[var(--background)]">
          <div className="p-4 text-base font-medium">Feature</div>
          <div className="p-4 text-base font-medium text-center">Send the Letter</div>
          <div className="p-4 text-base font-medium text-center">Go Full Petty</div>
        </div>
        {COMPARE_FEATURES.map((row, i) => (
          <div key={row.feature} className={`grid grid-cols-3 ${i < COMPARE_FEATURES.length - 1 ? 'border-b border-[var(--border)]' : ''}`}>
            <div className="p-4 text-base text-[var(--muted)]">{row.feature}</div>
            <div className="p-4 text-center text-base">
              {row.send ? <span className="text-[var(--accent)]">&#10003;</span> : <span className="text-[var(--border)]">&mdash;</span>}
            </div>
            <div className="p-4 text-center text-base">
              {row.full ? <span className="text-[var(--accent)]">&#10003;</span> : <span className="text-[var(--border)]">&mdash;</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Subscription */}
      <div className="max-w-2xl mx-auto mt-8 border border-[var(--border)] rounded-lg p-8 bg-[var(--card)] text-center">
        <h3 className="text-xl mb-2">Monthly Subscription</h3>
        <p className="text-base text-[var(--muted)] mb-4">
          For businesses and frequent filers. Unlimited document generation with all features included.
        </p>
        <span className="text-sm text-[var(--muted)] border border-[var(--border)] px-3 py-1.5 rounded-full">
          Coming soon
        </span>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto mt-16">
        <h2 className="text-2xl md:text-3xl text-center mb-8">Common questions</h2>
        <div className="space-y-6">
          {PRICING_FAQ.map(item => (
            <div key={item.q} className="border-b border-[var(--border)] pb-6">
              <h3 className="text-base font-medium mb-2">{item.q}</h3>
              <p className="text-base text-[var(--muted)] leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

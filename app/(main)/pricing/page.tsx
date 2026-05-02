'use client'
import { useState } from 'react'
import Link from 'next/link'
import { StickerButton } from '@/components/ui/StickerButton'
import { StickerCard } from '@/components/ui/StickerCard'
import { Highlight } from '@/components/ui/Highlight'
import { Tape } from '@/components/ui/Tape'

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

const VS_ROWS = [
  {
    label: 'Typical cost',
    petty: '$29 – $49 per document',
    solicitor: '$300 – $800+ per letter',
    diy: 'Free, but time-intensive',
  },
  {
    label: 'Turnaround',
    petty: 'Minutes',
    solicitor: 'Days to weeks',
    diy: 'Hours to days',
  },
  {
    label: 'Australian-law specific',
    petty: 'Yes — tailored to your state tribunal and legislation',
    solicitor: 'Yes',
    diy: 'Only if you research it yourself',
  },
  {
    label: 'Ongoing support',
    petty: 'Follow-up letter template included (Go Full Petty)',
    solicitor: 'Yes, at hourly rates',
    diy: 'None',
  },
  {
    label: 'Document quality',
    petty: 'Formal, structured, jurisdiction-aware',
    solicitor: 'Professional',
    diy: 'Varies — depends on your research',
  },
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
    a: "You won't be charged for a failed generation. If it fails three times, we'll help you directly via email.",
  },
  {
    q: 'Is this legal advice?',
    a: 'No. Petty Lawsuits is a document generation tool. We produce templates based on your inputs. We are not a law firm and do not provide legal advice. We recommend seeking independent legal advice if you are unsure about your rights or obligations.',
  },
  {
    q: 'Can I get a refund?',
    a: "If your document fails to generate after payment, we'll issue a full refund. For other issues, contact us and we'll work it out.",
  },
]

function PricingFAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="border-b py-4 cursor-pointer rounded transition-colors hover:bg-[rgba(26,24,20,0.03)]"
      style={{ borderColor: 'rgba(26,24,20,0.2)' }}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display font-bold text-lg">{q}</h3>
        <span className="text-muted text-xl flex-shrink-0 leading-none mt-0.5">
          {open ? '−' : '+'}
        </span>
      </div>
      {open && (
        <p className="text-base text-muted leading-relaxed mt-3 pr-8">{a}</p>
      )}
    </div>
  )
}

export default function PricingPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20 md:py-24">
      {/* Header */}
      <h1 className="font-display font-extrabold text-4xl md:text-5xl text-center mb-4">
        Pay per <Highlight>fight</Highlight>
      </h1>
      <p className="text-center text-muted text-lg mb-12">
        Pay per document. No subscription required.
      </p>

      {/* Tier cards */}
      <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto pt-5 mb-12">
        {TIERS.map(tier => (
          <StickerCard
            key={tier.name}
            color="var(--card)"
            rotate={tier.highlight ? 0 : -0.5}
            shadow={tier.highlight ? 'sticker-lg' : 'sticker'}
          >
            {tier.highlight && <Tape color="lemon" position="top">RECOMMENDED</Tape>}
            <h2 className="font-display font-extrabold text-2xl mb-1">{tier.name}</h2>
            <p className="font-display font-extrabold text-5xl mt-3">{tier.price}</p>
            <p className="text-sm text-muted mb-6">one-time payment</p>
            <ul className="space-y-3 mb-8">
              {tier.features.map(f => (
                <li key={f} className="text-base flex gap-2">
                  <span className="text-grass font-bold flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <StickerButton
              as={Link}
              href="/wizard"
              variant={tier.highlight ? 'primary' : 'ghost'}
              size="md"
              className="w-full"
            >
              {tier.highlight ? 'Go full petty' : 'Send the letter'}
            </StickerButton>
          </StickerCard>
        ))}
      </div>

      {/* Comparison table */}
      <StickerCard
        color="var(--card)"
        rotate={0}
        padding={0}
        className="max-w-2xl mx-auto mb-8 overflow-hidden"
      >
        <div
          className="grid grid-cols-3 border-b-2 border-foreground"
          style={{ background: 'var(--paper-alt)' }}
        >
          <div className="p-4 text-base font-medium">Feature</div>
          <div className="p-4 text-base font-medium text-center">Send the Letter</div>
          <div className="p-4 text-base font-medium text-center">Go Full Petty</div>
        </div>
        {COMPARE_FEATURES.map((row, i) => (
          <div
            key={row.feature}
            className="grid grid-cols-3"
            style={i < COMPARE_FEATURES.length - 1 ? { borderBottom: '1px solid rgba(26,24,20,0.12)' } : undefined}
          >
            <div className="p-4 text-base text-muted">{row.feature}</div>
            <div className="p-4 text-center text-base">
              {row.send
                ? <span className="text-grass font-bold">✓</span>
                : <span className="text-stamp font-bold">✗</span>
              }
            </div>
            <div className="p-4 text-center text-base">
              {row.full
                ? <span className="text-grass font-bold">✓</span>
                : <span className="text-stamp font-bold">✗</span>
              }
            </div>
          </div>
        ))}
      </StickerCard>

      {/* Subscription */}
      <div className="max-w-2xl mx-auto mb-16">
        <StickerCard color="var(--pink-tint)" rotate={-0.5}>
          <h3 className="font-display font-extrabold text-xl mb-2">Monthly Subscription</h3>
          <p
            className="font-marker text-xl"
            style={{ display: 'inline-block', transform: 'rotate(-0.5deg)' }}
          >
            frequent filer? we&apos;re working on it ✦
          </p>
        </StickerCard>
      </div>

      {/* vs. lawyer · vs. DIY */}
      <div className="max-w-3xl mx-auto mb-16">
        <StickerCard color="var(--card)" rotate={0} padding={0} className="overflow-hidden">
          <div
            className="px-6 pt-6 pb-4 border-b-2 border-foreground"
          >
            <h2 className="font-display font-extrabold text-3xl mb-1">vs. lawyer · vs. DIY</h2>
            <p className="text-muted text-base">
              Petty Lawsuits sits between expensive solicitors and the DIY approach — purpose-built for disputes that don&apos;t justify a lawyer&apos;s hourly rate.
            </p>
          </div>
          <div
            className="grid grid-cols-4 border-b"
            style={{ background: 'var(--paper-alt)', borderColor: 'rgba(26,24,20,0.12)' }}
          >
            <div className="p-4 text-sm font-medium text-muted" />
            <div className="p-4 text-sm font-medium text-center">
              <Highlight>Petty Lawsuits</Highlight>
            </div>
            <div className="p-4 text-sm font-medium text-center">Solicitor</div>
            <div className="p-4 text-sm font-medium text-center">DIY</div>
          </div>
          {VS_ROWS.map((row, i) => (
            <div
              key={row.label}
              className="grid grid-cols-4"
              style={i < VS_ROWS.length - 1 ? { borderBottom: '1px solid rgba(26,24,20,0.12)' } : undefined}
            >
              <div className="p-4 text-sm font-medium">{row.label}</div>
              <div className="p-4 text-sm text-center text-muted">{row.petty}</div>
              <div className="p-4 text-sm text-center text-muted">{row.solicitor}</div>
              <div className="p-4 text-sm text-center text-muted">{row.diy}</div>
            </div>
          ))}
        </StickerCard>
        <p className="text-xs text-center text-muted mt-3">
          Solicitor cost estimates are indicative only and vary widely by firm, matter complexity, and state. Petty Lawsuits is a document generation tool and does not provide legal advice.
        </p>
      </div>

      {/* Pricing FAQ */}
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display font-extrabold text-3xl md:text-4xl mb-8">
          questions before you commit?
        </h2>
        <div>
          {PRICING_FAQ.map(item => (
            <PricingFAQItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </main>
  )
}

'use client'
import { useState } from 'react'
import { StickerCard } from '@/components/ui/StickerCard'

const FAQ_SECTIONS = [
  {
    title: 'About the service',
    items: [
      {
        q: 'What is Petty Lawsuits?',
        a: 'Petty Lawsuits is an AI-powered document generation tool for Australians. We help you create formal legal documents — demand letters, complaint notices, and tribunal filings — quickly and affordably.',
      },
      {
        q: 'Is this legal advice?',
        a: 'No. Petty Lawsuits is a document generation tool, not a legal service. We produce templates based on the information you provide. We do not provide legal advice, represent you, or guarantee any legal outcome. If you are unsure about your rights or obligations, seek independent legal advice from a qualified professional.',
      },
      {
        q: 'What jurisdictions do you cover?',
        a: 'All Australian states and territories: NSW, VIC, QLD, WA, SA, TAS, ACT, and NT. Each document is tailored to reference the correct tribunal and filing thresholds for your jurisdiction.',
      },
      {
        q: 'What types of documents can I create?',
        a: "Currently: debt recovery demand letters, consumer complaint letters (faulty goods/services), and bond dispute letters. We're adding neighbour disputes, employment, contracts, and court filings soon.",
      },
    ],
  },
  {
    title: 'Using the product',
    items: [
      {
        q: 'Do I need an account to start?',
        a: "No. You can complete the entire wizard without creating an account. You'll only need to sign up when you're ready to pay and unlock your document.",
      },
      {
        q: 'How long does it take?',
        a: 'About 5 minutes for the wizard questions. Document generation takes under 30 seconds.',
      },
      {
        q: 'Can I edit my document after generation?',
        a: 'Yes, with the Go Full Petty tier. You can edit all variable fields — names, dates, amounts, addresses — directly in the browser. The legal structure of the document stays intact.',
      },
      {
        q: 'What formats can I download?',
        a: 'PDF is available with both tiers. Word (.docx) is available with Go Full Petty.',
      },
    ],
  },
  {
    title: 'Pricing & payments',
    items: [
      {
        q: "What's the difference between Send the Letter and Go Full Petty?",
        a: 'Send the Letter ($29) gives you the full document and PDF download. Go Full Petty ($49) adds Word download, in-browser editing, certified mail tracking, and a follow-up letter template.',
      },
      {
        q: 'Is there a subscription option?',
        a: 'A monthly subscription for unlimited document generation is coming soon. Currently, you pay per document.',
      },
      {
        q: 'What if the document generation fails?',
        a: "You won't be charged for a failed generation. If generation fails three times, your document is flagged and our team will help you directly via email.",
      },
      {
        q: 'Can I get a refund?',
        a: "If your document fails to generate after payment, we'll issue a full refund. For other issues, email us and we'll work it out.",
      },
    ],
  },
  {
    title: 'Privacy & data',
    items: [
      {
        q: 'What happens to my data?',
        a: 'Your data is stored securely and used only to generate your documents. We do not sell or share your personal information with third parties.',
      },
      {
        q: 'How long do you keep my documents?',
        a: 'Documents are retained for 24 months after your last account activity. You can request deletion at any time.',
      },
      {
        q: 'Can I delete my account and data?',
        a: 'Yes. You can request full deletion of your account and all associated data at any time via your account settings.',
      },
    ],
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left border-b py-4 transition-colors rounded hover:bg-[rgba(26,24,20,0.03)]"
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-medium">{q}</h3>
        <span className="text-muted text-lg flex-shrink-0 leading-none mt-0.5">
          {open ? '−' : '+'}
        </span>
      </div>
      {open && (
        <p className="text-base text-muted leading-relaxed mt-3 pr-8">{a}</p>
      )}
    </button>
  )
}

export default function FAQPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20 md:py-24">
      <h1 className="font-display font-bold text-4xl md:text-5xl text-center mb-4">
        Frequently asked questions
      </h1>
      <p className="text-center text-muted text-lg mb-12">
        Everything you need to know about Petty Lawsuits.
      </p>

      <div className="space-y-10">
        {FAQ_SECTIONS.map(section => (
          <section
            key={section.title}
            className="rounded-xl p-6 md:p-8"
            style={{
              border: '1.5px solid rgba(26,24,20,0.4)',
              background: 'var(--paper-alt)',
            }}
          >
            <h2 className="font-display font-bold text-xl mb-4">{section.title}</h2>
            <div>
              {section.items.map(item => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <StickerCard color="var(--card)" rotate={0} padding="32px" className="mt-12 text-center">
        <h3 className="font-display font-bold text-xl mb-2">Didn&apos;t find your answer?</h3>
        <p className="text-base">
          Email{' '}
          <a
            href="mailto:hello@pettylawsuits.com.au"
            className="underline decoration-2 underline-offset-2"
          >
            hello@pettylawsuits.com.au
          </a>{' '}
          and we&apos;ll come back within a day.
        </p>
      </StickerCard>
    </main>
  )
}

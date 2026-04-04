import Link from 'next/link'

const STEPS = [
  {
    num: '01',
    title: 'Tell us about the dispute',
    sections: [
      {
        heading: 'Who are you claiming against?',
        text: 'Start by entering the details of the person or business you\'re making a claim against — their name, address, and contact information. You can file against an individual or a business.',
      },
      {
        heading: 'Your details',
        text: 'Enter your own contact details so the document can be properly addressed. This information stays private and is only used within your document.',
      },
      {
        heading: 'What happened?',
        text: 'Describe the incident in your own words. Our AI will help you refine it into formal, professional language suitable for a legal document. Select the type of claim, when and where it happened, and the amount you\'re claiming.',
      },
      {
        heading: 'Upload your evidence',
        text: 'Attach any supporting documents — receipts, invoices, correspondence, photos. These strengthen your claim and help generate a more specific document.',
      },
    ],
  },
  {
    num: '02',
    title: 'AI generates your document',
    sections: [
      {
        heading: 'Tailored to your jurisdiction',
        text: 'Based on your location, we automatically determine the correct state tribunal (NCAT, VCAT, QCAT, etc.) and include the right filing thresholds and procedural references.',
      },
      {
        heading: 'Formal and professional',
        text: 'The document is drafted in formal Australian English using a legal template structure. All the details you provided are woven into a coherent, professional demand letter.',
      },
      {
        heading: 'Not legal advice',
        text: 'We generate document templates based on your inputs. This is a document preparation tool — not a law firm. We recommend seeking independent legal advice if you\'re unsure about your rights.',
      },
    ],
  },
  {
    num: '03',
    title: 'Review, edit, and download',
    sections: [
      {
        heading: 'Preview before you pay',
        text: 'See a partial preview of your document before committing to a purchase. The first section is shown in full — the rest is unlocked after payment.',
      },
      {
        heading: 'Edit the details',
        text: 'After unlocking, you can adjust any editable field — names, dates, amounts, addresses — directly in the browser. The legal structure stays intact.',
      },
      {
        heading: 'Download and send',
        text: 'Export your finished document as a PDF or Word file. It\'s ready to print, email, or send via registered post.',
      },
    ],
  },
]

export default function HowItWorksPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-24 md:py-32">
      <h1 className="text-4xl md:text-5xl text-center mb-6">How It Works</h1>
      <p className="text-center text-[var(--muted)] text-lg mb-20 max-w-xl mx-auto">
        From describing your situation to sending your document — here&apos;s what to expect.
      </p>

      <div className="space-y-24">
        {STEPS.map(step => (
          <section key={step.num}>
            <div className="flex items-baseline gap-4 mb-10">
              <span className="text-sm font-medium text-[var(--accent)]">{step.num}</span>
              <h2 className="text-2xl md:text-3xl">{step.title}</h2>
            </div>
            <div className="space-y-8 pl-10">
              {step.sections.map(s => (
                <div key={s.heading}>
                  <h3 className="text-base font-medium mb-2 font-['DM_Sans']">{s.heading}</h3>
                  <p className="text-base text-[var(--muted)] leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="text-center mt-24 pt-12 border-t border-[var(--border)]">
        <h2 className="text-2xl md:text-3xl mb-4">Ready to try it?</h2>
        <p className="text-[var(--muted)] mb-8">The whole process takes about 5 minutes.</p>
        <Link
          href="/wizard"
          className="inline-block bg-[var(--foreground)] text-white px-8 py-3.5 rounded-full text-base hover:opacity-90 transition-opacity"
        >
          Get Started
        </Link>
      </div>
    </main>
  )
}

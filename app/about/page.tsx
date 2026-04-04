export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-24 md:py-32">
      <h1 className="text-4xl md:text-5xl text-center mb-16">
        Built for Australians who can&apos;t justify a lawyer
      </h1>

      <div className="space-y-6 text-[var(--muted)] leading-relaxed">
        <p>
          Most legal disputes in Australia aren&apos;t worth the cost of a lawyer. A $2,000 bond
          dispute, a $500 unpaid invoice, a faulty product that the retailer refuses to replace —
          these are real problems that deserve real solutions. But when the legal fees cost more
          than the claim itself, most people just give up.
        </p>
        <p>
          Petty Lawsuits exists to change that. We use AI to generate formal, jurisdiction-aware
          legal documents — demand letters, complaint notices, tribunal filings — in minutes
          instead of days, and for a fraction of what a lawyer would charge.
        </p>
        <p>
          Every document is tailored to Australian law, references the correct state tribunal,
          and is written in the formal language that gets taken seriously. You fill in the details,
          we handle the paperwork.
        </p>
      </div>

      <div className="mt-16 pt-16 border-t border-[var(--border)]">
        <h2 className="text-2xl mb-6">What we are</h2>
        <p className="text-[var(--muted)] leading-relaxed">
          A document generation tool. We produce legal document templates based on the information
          you provide. We make the process faster, cheaper, and less intimidating.
        </p>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl mb-6">What we are not</h2>
        <p className="text-[var(--muted)] leading-relaxed">
          A law firm. We do not provide legal advice, represent you in court, or guarantee any
          legal outcome. If you are unsure about your rights or obligations, we recommend seeking
          independent legal advice from a qualified professional.
        </p>
      </div>
    </main>
  )
}

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20 md:py-24">
      <h1 className="text-4xl md:text-5xl text-center mb-12">
        Built for Australians who can&apos;t justify a lawyer
      </h1>

      <div className="space-y-5 text-[var(--muted)] text-lg leading-relaxed">
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

      <div className="grid sm:grid-cols-2 gap-4 mt-14">
        <div className="border border-[var(--border)] rounded-lg p-8 bg-[var(--card)]">
          <h2 className="text-2xl mb-4">What we are</h2>
          <p className="text-[var(--muted)] text-base leading-relaxed">
            A document generation tool. We produce legal document templates based on the information
            you provide. We make the process faster, cheaper, and less intimidating.
          </p>
        </div>
        <div className="border border-[var(--border)] rounded-lg p-8 bg-[var(--card)]">
          <h2 className="text-2xl mb-4">What we are not</h2>
          <p className="text-[var(--muted)] text-base leading-relaxed">
            A law firm. We do not provide legal advice, represent you in court, or guarantee any
            legal outcome. If you are unsure about your rights or obligations, we recommend seeking
            independent legal advice from a qualified professional.
          </p>
        </div>
      </div>

      <div className="mt-14 border border-[var(--border)] rounded-lg p-8 bg-[var(--card)]">
        <h2 className="text-2xl mb-4">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-medium text-[var(--accent)] mb-1">01</p>
            <p className="text-base text-[var(--muted)] leading-relaxed">
              You describe your dispute — who it&apos;s against, what happened, the amount you&apos;re claiming.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--accent)] mb-1">02</p>
            <p className="text-base text-[var(--muted)] leading-relaxed">
              AI generates a formal document tailored to your state&apos;s tribunal and legislation.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--accent)] mb-1">03</p>
            <p className="text-base text-[var(--muted)] leading-relaxed">
              You review, edit, and download as PDF or Word. Ready to send.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

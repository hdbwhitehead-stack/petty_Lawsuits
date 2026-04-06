export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20 md:py-24">
      <h1 className="text-4xl md:text-5xl text-center mb-4">Privacy Policy</h1>
      <p className="text-center text-[var(--muted)] text-lg mb-4">
        How we collect, use, and protect your information.
      </p>

      <div className="mb-12 border border-[var(--accent)] rounded-lg p-5 bg-[var(--card)]">
        <p className="text-sm font-medium text-[var(--accent)] mb-1">DRAFT — Not yet reviewed by a lawyer</p>
        <p className="text-sm text-[var(--muted)] leading-relaxed">
          This Privacy Policy is a placeholder. It has not been reviewed or approved by a qualified
          legal professional and should not be relied upon as legally compliant. We will replace this
          with a lawyer-reviewed policy before launch.
        </p>
      </div>

      <div className="space-y-8">

        <section className="border border-[var(--border)] rounded-lg bg-[var(--card)] p-6 md:p-8">
          <h2 className="text-2xl mb-4">1. What data we collect</h2>
          <div className="space-y-3 text-[var(--muted)] text-base leading-relaxed">
            <p>We collect information you provide directly to us, including:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-[var(--foreground)]">Account information</strong> — your email address when you create an account or sign in via Google OAuth.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Document content</strong> — the details you enter into the wizard (dispute description, party names, addresses, amounts claimed, evidence notes). This content is used to generate your document.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Payment information</strong> — payment is processed by Stripe. We do not store your card details. We receive a confirmation of payment and your Stripe customer ID.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Usage data</strong> — basic analytics such as pages visited and document types created. We do not use third-party advertising trackers.
              </li>
            </ul>
          </div>
        </section>

        <section className="border border-[var(--border)] rounded-lg bg-[var(--card)] p-6 md:p-8">
          <h2 className="text-2xl mb-4">2. How we use your information</h2>
          <div className="space-y-3 text-[var(--muted)] text-base leading-relaxed">
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Generate and store your legal documents</li>
              <li>Manage your account and authenticate your identity</li>
              <li>Process payments and issue receipts</li>
              <li>Send transactional emails (e.g. email verification, payment confirmation, document ready notifications) via Resend</li>
              <li>Improve the service and fix bugs</li>
            </ul>
            <p className="mt-3">
              We do not sell your personal information. We do not use your document content for advertising purposes.
            </p>
          </div>
        </section>

        <section className="border border-[var(--border)] rounded-lg bg-[var(--card)] p-6 md:p-8">
          <h2 className="text-2xl mb-4">3. Data retention</h2>
          <div className="space-y-3 text-[var(--muted)] text-base leading-relaxed">
            <p>
              Documents and account data are retained for <strong className="text-[var(--foreground)]">24 months</strong> following your last account activity. After this period, your data may be automatically deleted.
            </p>
            <p>
              You may request deletion of your account and all associated data at any time by contacting us at the address below. We will process deletion requests within 30 days.
            </p>
          </div>
        </section>

        <section className="border border-[var(--border)] rounded-lg bg-[var(--card)] p-6 md:p-8">
          <h2 className="text-2xl mb-4">4. Third-party services</h2>
          <div className="space-y-3 text-[var(--muted)] text-base leading-relaxed">
            <p>We use the following third-party services to operate the platform. Each has its own privacy policy:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-[var(--foreground)]">Supabase</strong> — database and authentication. Your account data and documents are stored in Supabase-hosted infrastructure.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Stripe</strong> — payment processing. Card details are handled entirely by Stripe and never touch our servers.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Resend</strong> — transactional email delivery (verification emails, receipts, notifications).
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Anthropic (Claude API)</strong> — AI document generation. The dispute details you enter are sent to Anthropic&apos;s API to generate your document. Anthropic&apos;s data use policies apply.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Vercel</strong> — hosting and infrastructure.
              </li>
            </ul>
          </div>
        </section>

        <section className="border border-[var(--border)] rounded-lg bg-[var(--card)] p-6 md:p-8">
          <h2 className="text-2xl mb-4">5. Cookies</h2>
          <div className="space-y-3 text-[var(--muted)] text-base leading-relaxed">
            <p>
              We use session cookies to keep you logged in. We do not use cookies for advertising or cross-site tracking. Anonymous document sessions are tracked via a short-lived identifier stored in your browser.
            </p>
          </div>
        </section>

        <section className="border border-[var(--border)] rounded-lg bg-[var(--card)] p-6 md:p-8">
          <h2 className="text-2xl mb-4">6. Your rights</h2>
          <div className="space-y-3 text-[var(--muted)] text-base leading-relaxed">
            <p>
              Under Australian privacy law (the Privacy Act 1988 and the Australian Privacy Principles), you have the right to access the personal information we hold about you, and to request correction or deletion of that information.
            </p>
            <p>
              To exercise these rights, contact us using the details below. We will respond within 30 days.
            </p>
          </div>
        </section>

        <section className="border border-[var(--border)] rounded-lg bg-[var(--card)] p-6 md:p-8">
          <h2 className="text-2xl mb-4">7. Contact</h2>
          <div className="space-y-3 text-[var(--muted)] text-base leading-relaxed">
            <p>
              For privacy-related enquiries or data deletion requests, contact us at:
            </p>
            <p>
              <strong className="text-[var(--foreground)]">Email:</strong>{' '}
              <span className="text-[var(--accent)]">privacy@pettylawsuits.com.au</span>{' '}
              <span className="text-sm">(placeholder — to be updated before launch)</span>
            </p>
            <p className="text-sm mt-2">
              Last updated: April 2026
            </p>
          </div>
        </section>

      </div>
    </main>
  )
}

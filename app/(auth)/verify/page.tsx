export default function VerifyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20 md:py-24">
      <div className="max-w-md mx-auto bg-[var(--card)] border border-[var(--border)] rounded-lg p-8 text-center">
        <h1 className="text-3xl mb-4">Check your inbox</h1>
        <p className="text-[var(--muted)] text-base leading-relaxed">
          We sent a verification link to your email. Click it to continue.
        </p>
        <p className="mt-4 text-sm text-[var(--muted)]">
          You can close this tab and return after verifying.
        </p>
        <div className="mt-8 pt-6 border-t border-[var(--border)]">
          <a
            href="/login"
            className="text-[var(--accent)] underline text-sm"
          >
            Back to log in
          </a>
        </div>
        <p className="mt-6 text-xs text-[var(--muted)]">
          This service does not provide legal advice.
        </p>
      </div>
    </main>
  )
}

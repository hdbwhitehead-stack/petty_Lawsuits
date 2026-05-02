import Link from 'next/link'
import type { Metadata } from 'next'
import { JURISDICTION_LANDING_DATA } from '@/lib/jurisdictions/landing-data'

export const metadata: Metadata = {
  title: 'Demand Letters by State & Territory | Petty Lawsuits',
  description:
    'Australian civil tribunals, claim limits, and small claims procedures for every state and territory — NSW, VIC, QLD, WA, SA, TAS, ACT, and NT.',
}

const fmt = (n: number) =>
  n.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 })

export default function JurisdictionsPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-20 md:py-24">
      <h1 className="text-4xl md:text-5xl text-center mb-4">
        Demand Letters by State &amp; Territory
      </h1>
      <p className="text-center text-[var(--muted)] text-lg mb-12 max-w-2xl mx-auto">
        Every state and territory has its own tribunal, claim limits, and filing rules.
        Select your jurisdiction below to see the details and generate a document
        tailored to your state.
      </p>

      {/* Reference table — desktop */}
      <div className="border border-[var(--border)] rounded-lg bg-[var(--card)] overflow-hidden mb-12 hidden md:block">
        {/* Header */}
        <div className="grid grid-cols-6 border-b border-[var(--border)] bg-[var(--background)]">
          <div className="p-4 text-sm font-medium col-span-1">State / Territory</div>
          <div className="p-4 text-sm font-medium col-span-1">Tribunal</div>
          <div className="p-4 text-sm font-medium text-right">Small Claims Limit</div>
          <div className="p-4 text-sm font-medium text-right">General Limit</div>
          <div className="p-4 text-sm font-medium">Typical Timeline</div>
          <div className="p-4 text-sm font-medium text-center">Get Started</div>
        </div>

        {/* Rows */}
        {JURISDICTION_LANDING_DATA.map((j, i) => (
          <div
            key={j.slug}
            className={`grid grid-cols-6 ${i < JURISDICTION_LANDING_DATA.length - 1 ? 'border-b border-[var(--border)]' : ''}`}
          >
            <div className="p-4 col-span-1">
              <Link
                href={`/jurisdictions/${j.slug}`}
                className="font-medium text-base hover:opacity-80 transition-opacity underline underline-offset-2"
                style={{ color: 'var(--accent)' }}
              >
                {j.stateName}
              </Link>
              <p className="text-xs text-[var(--muted)] mt-0.5">{j.code}</p>
            </div>
            <div className="p-4 col-span-1">
              <a
                href={j.tribunalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-[var(--foreground)] underline underline-offset-2 hover:opacity-80 transition-opacity"
              >
                {j.tribunalShort}
              </a>
            </div>
            <div className="p-4 text-base text-right text-[var(--muted)]">
              {fmt(j.smallClaimsLimit)}
            </div>
            <div className="p-4 text-base text-right text-[var(--muted)]">
              {fmt(j.generalLimit)}
            </div>
            <div className="p-4 text-sm text-[var(--muted)]">{j.typicalTimeline}</div>
            <div className="p-4 text-center">
              <Link
                href={`/wizard?jurisdiction=${j.code}`}
                className="text-sm font-medium px-4 py-2 rounded-full transition-colors hover:opacity-90"
                style={{ background: 'var(--accent)', color: 'white' }}
              >
                Start &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Card grid — mobile */}
      <div className="grid gap-4 sm:grid-cols-2 md:hidden mb-12">
        {JURISDICTION_LANDING_DATA.map(j => (
          <div
            key={j.slug}
            className="border border-[var(--border)] rounded-lg p-6 bg-[var(--card)] flex flex-col gap-3"
          >
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold">{j.code}</span>
              <span className="text-sm text-[var(--muted)]">{j.tribunalShort}</span>
            </div>
            <p className="text-sm text-[var(--muted)] leading-relaxed">{j.oneSentenceSummary}</p>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <dt className="text-[var(--muted)]">Small claims</dt>
              <dd className="font-medium text-right">{fmt(j.smallClaimsLimit)}</dd>
              <dt className="text-[var(--muted)]">General limit</dt>
              <dd className="font-medium text-right">{fmt(j.generalLimit)}</dd>
            </dl>
            <div className="flex gap-3 mt-auto pt-1">
              <Link
                href={`/jurisdictions/${j.slug}`}
                className="flex-1 text-center text-sm py-2 rounded-full border border-[var(--border)] hover:opacity-80 transition-opacity"
              >
                Learn more
              </Link>
              <Link
                href={`/wizard?jurisdiction=${j.code}`}
                className="flex-1 text-center text-sm py-2 rounded-full font-medium hover:opacity-90 transition-opacity"
                style={{ background: 'var(--accent)', color: 'white' }}
              >
                Start &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom callout */}
      <div className="text-center mt-8 pt-10 border-t border-[var(--border)]">
        <h2 className="text-2xl md:text-3xl mb-3">Not sure which applies to you?</h2>
        <p className="text-[var(--muted)] mb-6 max-w-lg mx-auto">
          Our wizard will automatically identify the correct tribunal for your state and
          dispute type when you describe your situation.
        </p>
        <Link
          href="/wizard"
          className="inline-block bg-[var(--foreground)] text-white px-8 py-3.5 rounded-full text-base hover:opacity-90 transition-opacity"
        >
          Start my demand letter
        </Link>
      </div>

      {/* Legal disclaimer */}
      <p className="text-xs text-[var(--muted)] text-center mt-10 leading-relaxed max-w-2xl mx-auto">
        Claim limits shown are indicative and may change. Always verify current thresholds on the
        relevant tribunal&apos;s website. Petty Lawsuits is a document generation tool, not a law firm.
        Nothing on this page constitutes legal advice.
      </p>
    </main>
  )
}

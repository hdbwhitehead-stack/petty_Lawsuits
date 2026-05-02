import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  ALL_SLUGS,
  getJurisdictionBySlug,
} from '@/lib/jurisdictions/landing-data'

// ---------------------------------------------------------------------------
// Static generation — one page per jurisdiction slug
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return ALL_SLUGS.map(slug => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const jurisdiction = getJurisdictionBySlug(slug)
  if (!jurisdiction) return {}

  return {
    title: `Demand Letters in ${jurisdiction.stateName} | Petty Lawsuits`,
    description: jurisdiction.oneSentenceSummary,
  }
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default async function JurisdictionLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const jurisdiction = getJurisdictionBySlug(slug)
  if (!jurisdiction) notFound()

  const {
    code,
    stateName,
    tribunalName,
    tribunalShort,
    tribunalUrl,
    smallClaimsLimit,
    generalLimit,
    typicalTimeline,
    smallClaimsUrl,
    oneSentenceSummary,
    keyFacts,
  } = jurisdiction

  const fmt = (n: number) =>
    n.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 })

  return (
    <main className="max-w-3xl mx-auto px-6 py-20 md:py-24">
      {/* Breadcrumb */}
      <nav className="text-sm text-[var(--muted)] mb-6" aria-label="Breadcrumb">
        <Link href="/" className="underline underline-offset-2 hover:opacity-80 transition-opacity">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link
          href="/jurisdictions"
          className="underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          All jurisdictions
        </Link>
        <span className="mx-2">/</span>
        <span>{stateName}</span>
      </nav>

      {/* Hero */}
      <h1 className="text-4xl md:text-5xl mb-4">
        Demand Letters in {stateName}
      </h1>
      <p className="text-lg text-[var(--muted)] leading-relaxed mb-10">
        {oneSentenceSummary}
      </p>

      {/* CTA */}
      <Link
        href={`/wizard?jurisdiction=${code}`}
        className="inline-block bg-[var(--foreground)] text-white px-8 py-3.5 rounded-full text-base hover:opacity-90 transition-opacity mb-14"
      >
        Start my demand letter &rarr;
      </Link>

      {/* Tribunal explainer */}
      <section className="border border-[var(--border)] rounded-lg p-8 bg-[var(--card)] mb-8">
        <h2 className="text-2xl md:text-3xl mb-4">
          Where do disputes go in {stateName}?
        </h2>
        <p className="text-base text-[var(--muted)] leading-relaxed mb-4">
          Most civil disputes in {stateName} are handled by the{' '}
          <a
            href={tribunalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            {tribunalName}
          </a>{' '}
          ({tribunalShort}). A formal demand letter sent before filing shows the tribunal
          you made a genuine attempt to resolve the dispute first — and often prompts the
          other party to settle without any hearing at all.
        </p>
        <p className="text-base text-[var(--muted)] leading-relaxed">
          For more detail on filing fees in {stateName}, see our{' '}
          <Link
            href="/tools/tribunal-fees"
            className="text-[var(--accent)] underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            tribunal fees calculator
          </Link>
          .
        </p>
      </section>

      {/* Claim limits */}
      <section className="border border-[var(--border)] rounded-lg p-8 bg-[var(--card)] mb-8">
        <h2 className="text-2xl md:text-3xl mb-6">Claim limits at a glance</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="border border-[var(--border)] rounded-lg p-5 text-center bg-[var(--background)]">
            <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-2">
              Small claims limit
            </p>
            <p className="text-2xl font-bold">{fmt(smallClaimsLimit)}</p>
            <p className="text-xs text-[var(--muted)] mt-1">simplified procedure</p>
          </div>
          <div
            className="border rounded-lg p-5 text-center"
            style={{ borderColor: 'var(--accent)', background: 'var(--accent-tint)' }}
          >
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--accent)' }}>
              General limit
            </p>
            <p className="text-2xl font-bold">{fmt(generalLimit)}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--accent)' }}>
              {tribunalShort} jurisdiction
            </p>
          </div>
          <div className="border border-[var(--border)] rounded-lg p-5 text-center bg-[var(--background)]">
            <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-2">
              Typical timeline
            </p>
            <p className="text-base font-semibold leading-snug">{typicalTimeline}</p>
            <p className="text-xs text-[var(--muted)] mt-1">from filing</p>
          </div>
        </div>
        <p className="text-xs text-[var(--muted)] mt-4">
          Limits are indicative and subject to change. Check the{' '}
          <a
            href={smallClaimsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            {tribunalShort} website
          </a>{' '}
          for current figures. This is not legal advice.
        </p>
      </section>

      {/* Key facts */}
      <section className="border border-[var(--border)] rounded-lg p-8 bg-[var(--card)] mb-8">
        <h2 className="text-2xl md:text-3xl mb-6">
          What to know before you file in {stateName}
        </h2>
        <ul className="space-y-4">
          {keyFacts.map((fact, i) => (
            <li key={i} className="flex gap-3 text-base text-[var(--muted)] leading-relaxed">
              <span
                className="mt-0.5 shrink-0 text-sm font-medium"
                style={{ color: 'var(--accent)' }}
              >
                &#10003;
              </span>
              {fact}
            </li>
          ))}
        </ul>
      </section>

      {/* CTA bottom */}
      <div className="text-center py-10 border-t border-[var(--border)]">
        <h2 className="text-2xl md:text-3xl mb-3">
          Ready to send your demand letter?
        </h2>
        <p className="text-[var(--muted)] mb-6">
          Takes about 5 minutes. Your document will cite {tribunalShort} and{' '}
          {stateName} law automatically.
        </p>
        <Link
          href={`/wizard?jurisdiction=${code}`}
          className="inline-block bg-[var(--foreground)] text-white px-8 py-3.5 rounded-full text-base hover:opacity-90 transition-opacity"
        >
          Start my demand letter
        </Link>
      </div>

      {/* Internal links */}
      <div className="mt-10 flex flex-wrap gap-4 text-sm justify-center">
        <Link
          href="/jurisdictions"
          className="text-[var(--accent)] underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          All jurisdictions
        </Link>
        <Link
          href="/tools/tribunal-fees"
          className="text-[var(--accent)] underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          Tribunal fees calculator
        </Link>
        <Link
          href="/"
          className="text-[var(--accent)] underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          Back to home
        </Link>
      </div>

      {/* Legal disclaimer */}
      <p className="text-xs text-[var(--muted)] text-center mt-8 leading-relaxed">
        Petty Lawsuits is a document generation tool, not a law firm. Nothing on this page
        is legal advice. For advice specific to your situation, consult an independent
        Australian lawyer.
      </p>
    </main>
  )
}

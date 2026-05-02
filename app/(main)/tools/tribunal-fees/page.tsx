'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  tribunalFees,
  getApplicableFee,
  type JurisdictionCode,
} from '@/lib/jurisdictions/tribunal-fees'

const JURISDICTIONS: { code: JurisdictionCode; label: string }[] = [
  { code: 'NSW', label: 'New South Wales' },
  { code: 'VIC', label: 'Victoria' },
  { code: 'QLD', label: 'Queensland' },
  { code: 'WA',  label: 'Western Australia' },
  { code: 'SA',  label: 'South Australia' },
  { code: 'TAS', label: 'Tasmania' },
  { code: 'ACT', label: 'Australian Capital Territory' },
  { code: 'NT',  label: 'Northern Territory' },
]

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function TribunalFeesCalculatorPage() {
  const [jurisdiction, setJurisdiction] = useState<JurisdictionCode | ''>('')
  const [claimAmountRaw, setClaimAmountRaw] = useState('')

  const claimAmount = parseFloat(claimAmountRaw.replace(/[^0-9.]/g, ''))
  const hasValidInputs = jurisdiction !== '' && !isNaN(claimAmount) && claimAmount > 0

  const feeInfo = jurisdiction ? tribunalFees[jurisdiction] : null
  const applicableTier = hasValidInputs ? getApplicableFee(jurisdiction as JurisdictionCode, claimAmount) : null
  const exceedsAllTiers = hasValidInputs && feeInfo && applicableTier === null

  return (
    <main className="max-w-2xl mx-auto px-6 py-20 md:py-24">
      {/* Page header */}
      <h1 className="text-4xl md:text-5xl text-center mb-4">
        Tribunal Fees Calculator
      </h1>
      <p className="text-center text-[var(--muted)] text-lg mb-12 max-w-xl mx-auto">
        Find out what it costs to file a claim at your state tribunal or court — before you start.
      </p>

      {/* Calculator card */}
      <div className="border border-[var(--border)] rounded-lg p-8 bg-[var(--card)]">
        {/* Jurisdiction select */}
        <div className="mb-6">
          <label
            htmlFor="jurisdiction-select"
            className="block text-sm font-medium mb-2"
          >
            State or territory
          </label>
          <select
            id="jurisdiction-select"
            value={jurisdiction}
            onChange={e => setJurisdiction(e.target.value as JurisdictionCode | '')}
            className="w-full border border-[var(--border)] rounded-md px-4 py-2.5 bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            <option value="">— Select a state or territory —</option>
            {JURISDICTIONS.map(j => (
              <option key={j.code} value={j.code}>
                {j.label} ({j.code})
              </option>
            ))}
          </select>
        </div>

        {/* Claim amount input */}
        <div className="mb-8">
          <label
            htmlFor="claim-amount"
            className="block text-sm font-medium mb-2"
          >
            Claim amount (AUD)
          </label>
          <div className="relative">
            <span
              aria-hidden="true"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] font-medium select-none"
            >
              $
            </span>
            <input
              id="claim-amount"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 2500"
              value={claimAmountRaw}
              onChange={e => setClaimAmountRaw(e.target.value)}
              className="w-full border border-[var(--border)] rounded-md pl-8 pr-4 py-2.5 bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>
        </div>

        {/* Result */}
        {hasValidInputs && feeInfo && (
          <div
            className="rounded-lg p-6 border"
            style={{
              borderColor: exceedsAllTiers ? 'var(--border)' : 'var(--accent)',
              background: exceedsAllTiers ? 'var(--background)' : 'var(--accent-tint)',
            }}
          >
            <p className="text-sm font-medium text-[var(--muted)] mb-1">Filing body</p>
            <p className="text-base font-semibold mb-4">{feeInfo.tribunalName}</p>

            {exceedsAllTiers ? (
              <>
                <p className="text-sm font-medium text-[var(--muted)] mb-1">Filing fee</p>
                <p className="text-base mb-3">
                  Your claim amount of{' '}
                  <strong>{formatCurrency(claimAmount)}</strong> exceeds the maximum
                  limit for {feeInfo.tribunalName}. You will need to file in a higher
                  court — fees vary.
                </p>
              </>
            ) : applicableTier ? (
              <>
                <p className="text-sm font-medium text-[var(--muted)] mb-1">Estimated filing fee</p>
                <p className="text-3xl font-bold mb-1">{formatCurrency(applicableTier.fee)}</p>
                <p className="text-sm text-[var(--muted)] mb-4">
                  For claims in the{' '}
                  <strong>{applicableTier.tier}</strong> range
                </p>
              </>
            ) : null}

            {feeInfo.note && (
              <p className="text-sm text-[var(--muted)] leading-relaxed mb-4 border-t border-[var(--border)] pt-4">
                {feeInfo.note}
              </p>
            )}

            <a
              href={feeInfo.feesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--accent)] underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              Verify current fees at {jurisdiction} tribunal website ↗
            </a>
          </div>
        )}

        {/* All tiers table — shown once jurisdiction is selected */}
        {feeInfo && (
          <div className="mt-8">
            <h2 className="text-base font-semibold mb-3">All filing fee tiers</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-2 pr-4 font-medium text-[var(--muted)]">
                      Claim amount
                    </th>
                    <th className="text-right py-2 font-medium text-[var(--muted)]">
                      Filing fee
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {feeInfo.tiers.map(t => {
                    const isActive =
                      applicableTier !== null && applicableTier?.tier === t.tier
                    return (
                      <tr
                        key={t.tier}
                        className="border-b border-[var(--border)] last:border-0"
                        style={
                          isActive
                            ? { background: 'var(--accent-tint)', fontWeight: 600 }
                            : {}
                        }
                      >
                        <td className="py-2 pr-4">{t.tier}</td>
                        <td className="py-2 text-right">{formatCurrency(t.fee)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-[var(--muted)] text-center mt-6 leading-relaxed">
        Fee data is indicative only and sourced from public tribunal websites. Fees are
        reviewed annually. Always verify the current fee on your tribunal&apos;s website
        before filing. This tool does not constitute legal advice.
      </p>

      {/* CTA */}
      <div className="text-center mt-12 pt-10 border-t border-[var(--border)]">
        <h2 className="text-2xl md:text-3xl mb-3">Ready to send a demand letter first?</h2>
        <p className="text-[var(--muted)] mb-6">
          A formal demand letter costs less than a filing fee — and often resolves the dispute
          without tribunal involvement.
        </p>
        <Link
          href="/wizard"
          className="inline-block bg-[var(--foreground)] text-white px-8 py-3.5 rounded-full text-base hover:opacity-90 transition-opacity"
        >
          Generate your letter
        </Link>
      </div>
    </main>
  )
}

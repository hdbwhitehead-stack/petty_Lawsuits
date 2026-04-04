'use client'
import { parseStateFromLocation, getJurisdiction } from '@/lib/documents/jurisdiction'
import type { DisputeType } from '@/lib/documents/jurisdiction'

type Props = {
  location: string
  amount: string
  disputeType?: string
}

export default function CourtWidget({ location, amount, disputeType }: Props) {
  const state = parseStateFromLocation(location)
  if (!state || !amount) return null

  const jurisdiction = getJurisdiction(state, disputeType as DisputeType | undefined)
  if (!jurisdiction) return null

  const amountNum = parseFloat(amount.replace(/[^0-9.]/g, ''))
  const withinSmall = !isNaN(amountNum) && amountNum <= jurisdiction.smallClaimsLimit
  const withinGeneral = !isNaN(amountNum) && amountNum <= jurisdiction.generalLimit

  return (
    <div className="border rounded-lg p-4 bg-[var(--card)] border-[var(--border)]">
      <p className="font-medium text-base">
        Filing with: {jurisdiction.body}
      </p>
      <p className="text-sm text-[var(--muted)] mt-1">
        Small claims limit: ${jurisdiction.smallClaimsLimit.toLocaleString()} AUD
        {' · '}
        General limit: ${jurisdiction.generalLimit.toLocaleString()} AUD
      </p>
      <p className="text-sm mt-2">
        {withinSmall
          ? '✓ Your claim is within the small claims threshold (simplified procedure)'
          : withinGeneral
          ? '→ Your claim exceeds the small claims threshold but is within the general limit'
          : '⚠ Your claim may exceed this body\'s jurisdictional limit — consider seeking legal advice'}
      </p>
      {jurisdiction.notes && (
        <p className="text-sm text-[var(--muted)] mt-2 border-t border-[var(--border)] pt-2">
          {jurisdiction.notes}
        </p>
      )}
    </div>
  )
}

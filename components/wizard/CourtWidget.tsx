'use client'
import { parseStateFromLocation, STATE_TRIBUNAL } from '@/lib/documents/jurisdiction'

type Props = {
  location: string
  amount: string
}

const SMALL_CLAIMS_LIMITS: Record<string, number> = {
  NSW: 100000,
  VIC: 100000,
  QLD: 75000,
  WA: 75000,
  SA: 100000,
  TAS: 50000,
  ACT: 25000,
  NT: 25000,
}

export default function CourtWidget({ location, amount }: Props) {
  const state = parseStateFromLocation(location)
  if (!state || !amount) return null

  const tribunal = STATE_TRIBUNAL[state]
  const limit = SMALL_CLAIMS_LIMITS[state]
  const amountNum = parseFloat(amount.replace(/[^0-9.]/g, ''))
  const withinLimit = !isNaN(amountNum) && amountNum <= (limit ?? 0)

  return (
    <div className="border rounded p-4 bg-gray-50">
      <p className="font-medium">Filing in: {tribunal}</p>
      <p className="text-sm text-gray-600 mt-1">
        Small claims limit: ${limit?.toLocaleString()} AUD
        {withinLimit
          ? ' — your claim is within the small claims threshold'
          : ' — your claim may exceed the small claims threshold'}
      </p>
    </div>
  )
}

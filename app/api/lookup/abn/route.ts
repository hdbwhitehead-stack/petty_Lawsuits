/**
 * ABN / ACN lookup proxy — Australian Business Register (ABR) JSON API
 *
 * Endpoints:
 *   ABN: https://abr.business.gov.au/json/AbnDetails.aspx?abn=<11-digit>&callback=<fn>&guid=<GUID>
 *   ACN: https://abr.business.gov.au/json/AcnDetails.aspx?acn=<9-digit>&callback=<fn>&guid=<GUID>
 *
 * Auth: Requires a free GUID registered at https://abr.business.gov.au/Tools/WebServices
 *   Set env var: ABR_GUID=<your-guid>
 *   Without it this route returns a graceful error — no crash.
 *
 * Rate limits: ABR does not publish hard limits for the JSON endpoint, but free
 *   GUIDs are intended for low-volume use. The API is unauthenticated beyond the
 *   GUID so there is no per-IP throttling on our side.
 *
 * Response shape (from ABR):
 *   { Abn, AbnStatus, EntityName, BusinessName: string[], Message, ... }
 *   EntityName  — the legal registered name (primary field we surface)
 *   BusinessName — array of registered trading names (fallback if EntityName empty)
 *   Message     — non-empty string signals an error from ABR (e.g. "ABN not found")
 *
 * Our contract:
 *   GET /api/lookup/abn?id=<11-or-9-digit>
 *   → 200 { businessName: string | null, status: string }
 *   → 200 { businessName: null, error: string }   (non-blocking, soft error)
 */

import { NextRequest, NextResponse } from 'next/server'

const ABR_BASE = 'https://abr.business.gov.au/json'
// Unique string used as the JSONP callback name — we strip it ourselves
const CB = '__abrCallback__'

function stripJsonp(raw: string): unknown {
  // ABR response is single-line JSONP: __abrCallback__({...});
  const open = raw.indexOf('(')
  const close = raw.lastIndexOf(')')
  if (open === -1 || close === -1 || close <= open) {
    throw new Error('Unexpected ABR response format')
  }
  return JSON.parse(raw.slice(open + 1, close))
}

function isAbn(id: string) { return /^\d{11}$/.test(id) }
function isAcn(id: string) { return /^\d{9}$/.test(id) }

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')?.replace(/\s/g, '') ?? ''

  if (!isAbn(id) && !isAcn(id)) {
    return NextResponse.json(
      { businessName: null, status: 'invalid', error: 'Enter an 11-digit ABN or 9-digit ACN' },
      { status: 400 }
    )
  }

  const guid = process.env.ABR_GUID
  if (!guid) {
    return NextResponse.json(
      { businessName: null, status: 'unavailable', error: 'ABN lookup not configured — enter manually' },
      { status: 200 }
    )
  }

  try {
    const isAbnLookup = isAbn(id)
    const endpoint = isAbnLookup
      ? `${ABR_BASE}/AbnDetails.aspx?abn=${id}&callback=${CB}&guid=${guid}`
      : `${ABR_BASE}/AcnDetails.aspx?acn=${id}&callback=${CB}&guid=${guid}`

    const response = await fetch(endpoint, {
      // ABR is fast — 5 s is generous
      signal: AbortSignal.timeout(5000),
      headers: { 'Accept': 'text/javascript, application/javascript' },
    })

    if (!response.ok) {
      return NextResponse.json(
        { businessName: null, status: 'error', error: 'Could not look up — enter manually' },
        { status: 200 }
      )
    }

    const raw = await response.text()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = stripJsonp(raw) as any

    // ABR returns a Message field when the GUID is bad or the entity isn't found
    if (data.Message && data.Message.trim()) {
      return NextResponse.json(
        { businessName: null, status: 'not_found', error: 'ABN/ACN not found — enter manually' },
        { status: 200 }
      )
    }

    // EntityName is the legal name; fall back to first BusinessName trading name
    const businessName: string | null =
      data.EntityName?.trim() ||
      (Array.isArray(data.BusinessName) && data.BusinessName[0]?.trim()) ||
      null

    const status = data.AbnStatus?.trim() || 'Active'

    return NextResponse.json({ businessName, status })
  } catch (err) {
    // Network timeout, JSON parse error, etc. — non-blocking
    console.error('[abn-lookup]', err)
    return NextResponse.json(
      { businessName: null, status: 'error', error: 'Could not look up — enter manually' },
      { status: 200 }
    )
  }
}

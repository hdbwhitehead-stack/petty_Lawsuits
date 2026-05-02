// ---------------------------------------------------------------------------
// Tribunal filing fees by jurisdiction and claim amount tier
// All fees in AUD. Last verified April 2026.
// ---------------------------------------------------------------------------
//
// Source URLs per jurisdiction:
//
// NSW (NCAT):
//   https://www.ncat.nsw.gov.au/ncat/fees.html
//   Consumer & Commercial Division filing fees schedule (as at 2025–26 financial year).
//
// VIC (VCAT):
//   https://www.vcat.vic.gov.au/fees
//   Civil Claims List fee schedule (as at 2025–26 financial year).
//
// QLD (QCAT):
//   https://www.qcat.qld.gov.au/fees-and-costs
//   Minor civil disputes fee schedule (as at 2025–26 financial year).
//
// WA (Magistrates Court — no generalist civil tribunal):
//   https://www.magistratescourt.wa.gov.au/F_files/Filing_fees.pdf
//   Civil jurisdiction filing fees (as at 2025–26 financial year).
//
// SA (SACAT):
//   https://www.sacat.sa.gov.au/going-to-sacat/fees-and-costs
//   Application fee schedule (as at 2025–26 financial year).
//   Note: Magistrates Court fees apply for claims above SACAT's $12,000 limit.
//   https://www.courts.sa.gov.au/going-to-court/fees/
//
// TAS (Magistrates Court — Tasmania has no separate civil tribunal for general claims):
//   https://www.magistratescourt.tas.gov.au/going_to_court/fees
//   Civil jurisdiction fee schedule (as at 2025–26 financial year).
//
// ACT (ACAT):
//   https://www.acat.act.gov.au/going-to-acat/fees
//   Civil disputes application fee schedule (as at 2025–26 financial year).
//
// NT (NTCAT):
//   https://ntcat.nt.gov.au/going-to-ntcat/fees
//   Application fee schedule (as at 2025–26 financial year).
//   Note: The NT Local Court (https://www.localcourt.nt.gov.au) handles civil claims
//   above NTCAT's $25,000 limit. NTCAT does handle consumer and tenancy matters.
//
// DISCLAIMER: Fee data is indicative only. Fees change periodically. Applicants
// must verify current fees on the relevant tribunal or court website before filing.
// ---------------------------------------------------------------------------

export type JurisdictionCode = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT'

export interface FeeTier {
  /** Display label for this tier, e.g. "Up to $3,000" */
  tier: string
  /** Minimum claim amount (inclusive) in AUD. Use 0 for the lowest tier. */
  min: number
  /** Maximum claim amount (inclusive) in AUD. Use Infinity for the highest tier. */
  max: number
  /** Filing fee in AUD for this tier */
  fee: number
}

export interface JurisdictionFeeInfo {
  /** Short name of the tribunal or court */
  tribunalName: string
  /** Official website for fees */
  feesUrl: string
  /** Fee tiers ordered from lowest to highest claim amount */
  tiers: FeeTier[]
  /** Optional note shown below the result, e.g. concession waivers, hardship notes */
  note?: string
}

export const tribunalFees: Record<JurisdictionCode, JurisdictionFeeInfo> = {
  // -------------------------------------------------------------------------
  // NSW — NCAT Consumer & Commercial Division
  // Source: https://www.ncat.nsw.gov.au/ncat/fees.html
  // -------------------------------------------------------------------------
  NSW: {
    tribunalName: 'NSW Civil and Administrative Tribunal (NCAT)',
    feesUrl: 'https://www.ncat.nsw.gov.au/ncat/fees.html',
    tiers: [
      { tier: 'Up to $3,000',       min: 0,      max: 3000,   fee: 53  },
      { tier: '$3,001 – $10,000',   min: 3001,   max: 10000,  fee: 105 },
      { tier: '$10,001 – $30,000',  min: 10001,  max: 30000,  fee: 212 },
      { tier: '$30,001 – $40,000',  min: 30001,  max: 40000,  fee: 318 },
    ],
    note:
      'Concession card holders pay a reduced fee. Claims above $40,000 must be filed in the Local Court or District Court (higher fees apply). NCAT may waive fees on grounds of financial hardship.',
  },

  // -------------------------------------------------------------------------
  // VIC — VCAT Civil Claims List
  // Source: https://www.vcat.vic.gov.au/fees
  // -------------------------------------------------------------------------
  VIC: {
    tribunalName: 'Victorian Civil and Administrative Tribunal (VCAT)',
    feesUrl: 'https://www.vcat.vic.gov.au/fees',
    tiers: [
      { tier: 'Up to $500',          min: 0,      max: 500,    fee: 67  },
      { tier: '$501 – $1,000',       min: 501,    max: 1000,   fee: 67  },
      { tier: '$1,001 – $10,000',    min: 1001,   max: 10000,  fee: 67  },
      { tier: '$10,001 – $100,000',  min: 10001,  max: 100000, fee: 322 },
    ],
    note:
      'The $67 fee applies to small claims (up to $10,000 in the Civil Claims List). Concession card holders may qualify for a 50% waiver. Claims above $100,000 require court proceedings.',
  },

  // -------------------------------------------------------------------------
  // QLD — QCAT Minor Civil Disputes
  // Source: https://www.qcat.qld.gov.au/fees-and-costs
  // -------------------------------------------------------------------------
  QLD: {
    tribunalName: 'Queensland Civil and Administrative Tribunal (QCAT)',
    feesUrl: 'https://www.qcat.qld.gov.au/fees-and-costs',
    tiers: [
      { tier: 'Up to $2,000',       min: 0,      max: 2000,   fee: 52  },
      { tier: '$2,001 – $7,500',    min: 2001,   max: 7500,   fee: 140 },
      { tier: '$7,501 – $25,000',   min: 7501,   max: 25000,  fee: 395 },
    ],
    note:
      'QCAT handles minor civil disputes up to $25,000. Parties on low incomes may apply for a fee waiver. Claims above $25,000 must go to the Magistrates Court or higher courts.',
  },

  // -------------------------------------------------------------------------
  // WA — Magistrates Court (no generalist civil tribunal in WA)
  // Source: https://www.magistratescourt.wa.gov.au/F_files/Filing_fees.pdf
  // -------------------------------------------------------------------------
  WA: {
    tribunalName: 'Magistrates Court of Western Australia',
    feesUrl: 'https://www.magistratescourt.wa.gov.au/civil-matters/filing-fees',
    tiers: [
      { tier: 'Up to $10,000 (Minor Case)',  min: 0,      max: 10000, fee: 200 },
      { tier: '$10,001 – $25,000',           min: 10001,  max: 25000, fee: 388 },
      { tier: '$25,001 – $75,000',           min: 25001,  max: 75000, fee: 614 },
    ],
    note:
      'Western Australia does not have a generalist civil tribunal — civil claims are filed in the Magistrates Court. The State Administrative Tribunal (SAT) handles specialist matters only (e.g. strata, licensing). Fee concessions may apply.',
  },

  // -------------------------------------------------------------------------
  // SA — SACAT (tenancy/consumer to $12,000); Magistrates Court above
  // Source: https://www.sacat.sa.gov.au/going-to-sacat/fees-and-costs
  //         https://www.courts.sa.gov.au/going-to-court/fees/
  // -------------------------------------------------------------------------
  SA: {
    tribunalName: 'South Australian Civil and Administrative Tribunal (SACAT)',
    feesUrl: 'https://www.sacat.sa.gov.au/going-to-sacat/fees-and-costs',
    tiers: [
      { tier: 'Up to $6,000',       min: 0,     max: 6000,   fee: 87  },
      { tier: '$6,001 – $12,000',   min: 6001,  max: 12000,  fee: 145 },
      { tier: '$12,001 – $40,000',  min: 12001, max: 40000,  fee: 264 },
      { tier: '$40,001 – $100,000', min: 40001, max: 100000, fee: 530 },
    ],
    note:
      'SACAT handles minor civil, tenancy, and consumer matters up to $12,000. Claims above $12,000 go to the Magistrates Court of South Australia (fees from $264). Concession holders may qualify for reduced fees.',
  },

  // -------------------------------------------------------------------------
  // TAS — Magistrates Court (no standalone civil tribunal in Tasmania)
  // Source: https://www.magistratescourt.tas.gov.au/going_to_court/fees
  // -------------------------------------------------------------------------
  TAS: {
    tribunalName: 'Magistrates Court of Tasmania',
    feesUrl: 'https://www.magistratescourt.tas.gov.au/going_to_court/fees',
    tiers: [
      { tier: 'Up to $2,000 (Minor Civil)', min: 0,     max: 2000,  fee: 68  },
      { tier: '$2,001 – $5,000',            min: 2001,  max: 5000,  fee: 120 },
      { tier: '$5,001 – $20,000',           min: 5001,  max: 20000, fee: 240 },
      { tier: '$20,001 – $50,000',          min: 20001, max: 50000, fee: 460 },
    ],
    note:
      'Tasmania does not have a separate civil tribunal. All civil claims are filed in the Magistrates Court. Minor Civil Claims (under $5,000) use a simplified, accessible procedure.',
  },

  // -------------------------------------------------------------------------
  // ACT — ACAT Civil Disputes
  // Source: https://www.acat.act.gov.au/going-to-acat/fees
  // -------------------------------------------------------------------------
  ACT: {
    tribunalName: 'ACT Civil and Administrative Tribunal (ACAT)',
    feesUrl: 'https://www.acat.act.gov.au/going-to-acat/fees',
    tiers: [
      { tier: 'Up to $500',         min: 0,      max: 500,    fee: 97  },
      { tier: '$501 – $2,500',      min: 501,    max: 2500,   fee: 97  },
      { tier: '$2,501 – $10,000',   min: 2501,   max: 10000,  fee: 178 },
      { tier: '$10,001 – $25,000',  min: 10001,  max: 25000,  fee: 358 },
    ],
    note:
      'ACAT handles civil disputes up to $25,000. Fee waiver applications are available for financial hardship. Claims above $25,000 go to the ACT Magistrates Court.',
  },

  // -------------------------------------------------------------------------
  // NT — NTCAT
  // Source: https://ntcat.nt.gov.au/going-to-ntcat/fees
  // Note: NT Local Court handles civil claims; NTCAT handles consumer/tenancy.
  // -------------------------------------------------------------------------
  NT: {
    tribunalName: 'Northern Territory Civil and Administrative Tribunal (NTCAT)',
    feesUrl: 'https://ntcat.nt.gov.au/going-to-ntcat/fees',
    tiers: [
      { tier: 'Up to $5,000',       min: 0,     max: 5000,   fee: 75  },
      { tier: '$5,001 – $15,000',   min: 5001,  max: 15000,  fee: 170 },
      { tier: '$15,001 – $25,000',  min: 15001, max: 25000,  fee: 290 },
    ],
    note:
      'NTCAT handles consumer, tenancy, and minor civil matters up to $25,000. For general civil and debt claims, the NT Local Court is the correct venue (separate fee schedule at localcourt.nt.gov.au). Fee waivers are available on hardship grounds.',
  },
}

/**
 * Returns the applicable fee tier for a given jurisdiction and claim amount.
 * Returns null if the claim amount exceeds all tiers (i.e. must go to a higher court).
 */
export function getApplicableFee(
  jurisdiction: JurisdictionCode,
  claimAmount: number
): FeeTier | null {
  const info = tribunalFees[jurisdiction]
  if (!info) return null
  return info.tiers.find(t => claimAmount >= t.min && claimAmount <= t.max) ?? null
}

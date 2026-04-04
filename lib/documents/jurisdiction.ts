// ---------------------------------------------------------------------------
// Jurisdiction mapping: state + dispute type → correct court/tribunal
// ---------------------------------------------------------------------------

export type DisputeType =
  | 'debt-recovery'
  | 'consumer-complaint'
  | 'bond-dispute'
  | 'neighbour'
  | 'employment'
  | 'contracts'
  | 'court'

export type JurisdictionInfo = {
  body: string
  bodyShort: string
  url: string
  smallClaimsLimit: number
  generalLimit: number
  notes: string
}

// Each state maps dispute types to the correct body.
// Where a dispute type isn't listed, it falls back to 'default'.

type StateJurisdictions = {
  [disputeType: string]: JurisdictionInfo
}

const JURISDICTIONS: Record<string, StateJurisdictions> = {
  NSW: {
    default: {
      body: 'NSW Civil and Administrative Tribunal (NCAT)',
      bodyShort: 'NCAT',
      url: 'https://www.ncat.nsw.gov.au',
      smallClaimsLimit: 10000,
      generalLimit: 40000,
      notes: 'Claims above $40,000 (or $500,000 for building) go to the Local or District Court.',
    },
    'debt-recovery': {
      body: 'Local Court of NSW',
      bodyShort: 'Local Court',
      url: 'https://www.localcourt.nsw.gov.au',
      smallClaimsLimit: 20000,
      generalLimit: 100000,
      notes: 'Small Claims Division (up to $20,000) uses simplified procedure. General Division handles $20,001–$100,000.',
    },
    'consumer-complaint': {
      body: 'NSW Civil and Administrative Tribunal (NCAT)',
      bodyShort: 'NCAT',
      url: 'https://www.ncat.nsw.gov.au',
      smallClaimsLimit: 10000,
      generalLimit: 40000,
      notes: 'Consumer and Commercial Division. Claims up to $10,000 use simplified small claims process.',
    },
    'bond-dispute': {
      body: 'NSW Fair Trading (Rental Bonds Online) → NCAT if disputed',
      bodyShort: 'Fair Trading / NCAT',
      url: 'https://www.fairtrading.nsw.gov.au',
      smallClaimsLimit: 10000,
      generalLimit: 40000,
      notes: 'Bond claims start with NSW Fair Trading Rental Bonds Online. Only escalates to NCAT if the other party disputes.',
    },
    employment: {
      body: 'Fair Work Commission (Federal)',
      bodyShort: 'Fair Work',
      url: 'https://www.fwc.gov.au',
      smallClaimsLimit: 20000,
      generalLimit: 20000,
      notes: 'Unfair dismissal, general protections, and underpayment claims. Small claims (wages) up to $20,000 via Federal Circuit Court.',
    },
  },

  VIC: {
    default: {
      body: 'Victorian Civil and Administrative Tribunal (VCAT)',
      bodyShort: 'VCAT',
      url: 'https://www.vcat.vic.gov.au',
      smallClaimsLimit: 10000,
      generalLimit: 100000,
      notes: 'Civil Claims List handles general disputes. Above $100,000 requires consent or goes to court.',
    },
    'debt-recovery': {
      body: "Magistrates' Court of Victoria",
      bodyShort: "Magistrates' Court",
      url: 'https://www.mcv.vic.gov.au',
      smallClaimsLimit: 10000,
      generalLimit: 100000,
      notes: 'Small claims up to $10,000 use arbitration-style hearing. General jurisdiction to $100,000.',
    },
    'consumer-complaint': {
      body: 'Victorian Civil and Administrative Tribunal (VCAT)',
      bodyShort: 'VCAT',
      url: 'https://www.vcat.vic.gov.au',
      smallClaimsLimit: 10000,
      generalLimit: 100000,
      notes: 'Civil Claims List. Small claims track for disputes under $10,000.',
    },
    'bond-dispute': {
      body: 'Residential Tenancies Bond Authority (RTBA) → VCAT if disputed',
      bodyShort: 'RTBA / VCAT',
      url: 'https://www.vcat.vic.gov.au',
      smallClaimsLimit: 10000,
      generalLimit: 100000,
      notes: 'Bond claims initiated through RTBA. Unresolved disputes escalate to VCAT Residential Tenancies List.',
    },
    employment: {
      body: 'Fair Work Commission (Federal)',
      bodyShort: 'Fair Work',
      url: 'https://www.fwc.gov.au',
      smallClaimsLimit: 20000,
      generalLimit: 20000,
      notes: 'Federal body for unfair dismissal, general protections, and wage recovery.',
    },
  },

  QLD: {
    default: {
      body: 'Queensland Civil and Administrative Tribunal (QCAT)',
      bodyShort: 'QCAT',
      url: 'https://www.qcat.qld.gov.au',
      smallClaimsLimit: 7500,
      generalLimit: 25000,
      notes: 'Minor civil disputes up to $25,000. Simplified process for claims under $7,500.',
    },
    'debt-recovery': {
      body: 'Magistrates Court of Queensland',
      bodyShort: 'Magistrates Court',
      url: 'https://www.courts.qld.gov.au',
      smallClaimsLimit: 25000,
      generalLimit: 150000,
      notes: 'Minor debts claims. QCAT also handles minor civil disputes up to $25,000.',
    },
    'consumer-complaint': {
      body: 'Queensland Civil and Administrative Tribunal (QCAT)',
      bodyShort: 'QCAT',
      url: 'https://www.qcat.qld.gov.au',
      smallClaimsLimit: 7500,
      generalLimit: 25000,
      notes: 'Consumer/trader disputes within the $25,000 limit.',
    },
    'bond-dispute': {
      body: 'Residential Tenancies Authority (RTA) → QCAT if unresolved',
      bodyShort: 'RTA / QCAT',
      url: 'https://www.rta.qld.gov.au',
      smallClaimsLimit: 7500,
      generalLimit: 25000,
      notes: 'Bond disputes start with RTA conciliation. Escalates to QCAT if unresolved.',
    },
    employment: {
      body: 'Fair Work Commission (Federal)',
      bodyShort: 'Fair Work',
      url: 'https://www.fwc.gov.au',
      smallClaimsLimit: 20000,
      generalLimit: 20000,
      notes: 'Federal body for unfair dismissal, general protections, and wage recovery.',
    },
  },

  WA: {
    default: {
      body: 'Magistrates Court of Western Australia',
      bodyShort: 'Magistrates Court',
      url: 'https://www.magistratescourt.wa.gov.au',
      smallClaimsLimit: 10000,
      generalLimit: 75000,
      notes: 'WA does not have a generalist civil tribunal. Consumer and civil disputes go to the Magistrates Court.',
    },
    'debt-recovery': {
      body: 'Magistrates Court of Western Australia',
      bodyShort: 'Magistrates Court',
      url: 'https://www.magistratescourt.wa.gov.au',
      smallClaimsLimit: 10000,
      generalLimit: 75000,
      notes: 'Minor Case Claim (up to $10,000) uses simplified procedure. General Procedure for $10,001–$75,000.',
    },
    'consumer-complaint': {
      body: 'Magistrates Court of Western Australia',
      bodyShort: 'Magistrates Court',
      url: 'https://www.magistratescourt.wa.gov.au',
      smallClaimsLimit: 10000,
      generalLimit: 75000,
      notes: 'Consumer disputes go to the Magistrates Court. Consumer Protection WA offers mediation first.',
    },
    'bond-dispute': {
      body: 'Magistrates Court of Western Australia',
      bodyShort: 'Magistrates Court',
      url: 'https://www.magistratescourt.wa.gov.au',
      smallClaimsLimit: 10000,
      generalLimit: 75000,
      notes: 'Tenancy and bond disputes go to the Magistrates Court under the Residential Tenancies Act 1987.',
    },
    employment: {
      body: 'Fair Work Commission (Federal)',
      bodyShort: 'Fair Work',
      url: 'https://www.fwc.gov.au',
      smallClaimsLimit: 20000,
      generalLimit: 20000,
      notes: 'Federal body for unfair dismissal, general protections, and wage recovery.',
    },
  },

  SA: {
    default: {
      body: 'South Australian Civil and Administrative Tribunal (SACAT)',
      bodyShort: 'SACAT',
      url: 'https://www.sacat.sa.gov.au',
      smallClaimsLimit: 12000,
      generalLimit: 12000,
      notes: 'SACAT handles minor civil matters up to $12,000 and residential tenancy. Larger claims go to the Magistrates Court.',
    },
    'debt-recovery': {
      body: 'Magistrates Court of South Australia',
      bodyShort: 'Magistrates Court',
      url: 'https://www.courts.sa.gov.au',
      smallClaimsLimit: 12000,
      generalLimit: 100000,
      notes: 'Minor civil claims up to $12,000 use simplified process. General jurisdiction to $100,000.',
    },
    'consumer-complaint': {
      body: 'Magistrates Court of South Australia',
      bodyShort: 'Magistrates Court',
      url: 'https://www.courts.sa.gov.au',
      smallClaimsLimit: 12000,
      generalLimit: 100000,
      notes: "Consumer disputes outside SACAT's specific jurisdiction go to the Magistrates Court. CBS offers conciliation first.",
    },
    'bond-dispute': {
      body: 'South Australian Civil and Administrative Tribunal (SACAT)',
      bodyShort: 'SACAT',
      url: 'https://www.sacat.sa.gov.au',
      smallClaimsLimit: 12000,
      generalLimit: 12000,
      notes: 'SACAT handles all residential tenancy disputes including bond claims.',
    },
    employment: {
      body: 'Fair Work Commission (Federal)',
      bodyShort: 'Fair Work',
      url: 'https://www.fwc.gov.au',
      smallClaimsLimit: 20000,
      generalLimit: 20000,
      notes: 'Federal body for unfair dismissal, general protections, and wage recovery.',
    },
  },

  TAS: {
    default: {
      body: 'Magistrates Court of Tasmania',
      bodyShort: 'Magistrates Court',
      url: 'https://www.magistratescourt.tas.gov.au',
      smallClaimsLimit: 5000,
      generalLimit: 50000,
      notes: 'Tasmania does not have a generalist civil tribunal. Small claims up to $5,000, general to $50,000.',
    },
    'debt-recovery': {
      body: 'Magistrates Court of Tasmania',
      bodyShort: 'Magistrates Court',
      url: 'https://www.magistratescourt.tas.gov.au',
      smallClaimsLimit: 5000,
      generalLimit: 50000,
      notes: 'Small claims up to $5,000 use simplified procedure. General civil to $50,000.',
    },
    'consumer-complaint': {
      body: 'Magistrates Court of Tasmania',
      bodyShort: 'Magistrates Court',
      url: 'https://www.magistratescourt.tas.gov.au',
      smallClaimsLimit: 5000,
      generalLimit: 50000,
      notes: 'Consumer disputes go to the Magistrates Court. CBOS offers conciliation first.',
    },
    'bond-dispute': {
      body: 'Residential Tenancy Commissioner → Magistrates Court if unresolved',
      bodyShort: 'Tenancy Commissioner / Magistrates Court',
      url: 'https://www.magistratescourt.tas.gov.au',
      smallClaimsLimit: 5000,
      generalLimit: 50000,
      notes: 'Bond disputes start with the Residential Tenancy Commissioner. Complex disputes escalate to the Magistrates Court.',
    },
    employment: {
      body: 'Fair Work Commission (Federal)',
      bodyShort: 'Fair Work',
      url: 'https://www.fwc.gov.au',
      smallClaimsLimit: 20000,
      generalLimit: 20000,
      notes: 'Federal body for unfair dismissal, general protections, and wage recovery.',
    },
  },

  ACT: {
    default: {
      body: 'ACT Civil and Administrative Tribunal (ACAT)',
      bodyShort: 'ACAT',
      url: 'https://www.acat.act.gov.au',
      smallClaimsLimit: 10000,
      generalLimit: 25000,
      notes: 'Small claims up to $10,000 use simplified procedure. General civil disputes to $25,000.',
    },
    'debt-recovery': {
      body: 'ACT Magistrates Court',
      bodyShort: 'ACT Magistrates Court',
      url: 'https://www.courts.act.gov.au',
      smallClaimsLimit: 10000,
      generalLimit: 250000,
      notes: 'Debt recovery through the Magistrates Court. ACAT handles most consumer and tenancy small claims.',
    },
    'consumer-complaint': {
      body: 'ACT Civil and Administrative Tribunal (ACAT)',
      bodyShort: 'ACAT',
      url: 'https://www.acat.act.gov.au',
      smallClaimsLimit: 10000,
      generalLimit: 25000,
      notes: 'Consumer disputes under the Australian Consumer Law (ACT).',
    },
    'bond-dispute': {
      body: 'ACT Civil and Administrative Tribunal (ACAT)',
      bodyShort: 'ACAT',
      url: 'https://www.acat.act.gov.au',
      smallClaimsLimit: 10000,
      generalLimit: 25000,
      notes: 'All residential tenancy and bond disputes go through ACAT.',
    },
    employment: {
      body: 'Fair Work Commission (Federal)',
      bodyShort: 'Fair Work',
      url: 'https://www.fwc.gov.au',
      smallClaimsLimit: 20000,
      generalLimit: 20000,
      notes: 'Federal body for unfair dismissal, general protections, and wage recovery.',
    },
  },

  NT: {
    default: {
      body: 'Northern Territory Civil and Administrative Tribunal (NTCAT)',
      bodyShort: 'NTCAT',
      url: 'https://www.ntcat.nt.gov.au',
      smallClaimsLimit: 25000,
      generalLimit: 25000,
      notes: 'NTCAT handles consumer, tenancy, and small civil matters up to $25,000.',
    },
    'debt-recovery': {
      body: 'Local Court of the Northern Territory',
      bodyShort: 'Local Court',
      url: 'https://www.localcourt.nt.gov.au',
      smallClaimsLimit: 25000,
      generalLimit: 100000,
      notes: 'Debt recovery through the Local Court. Small claims up to $25,000.',
    },
    'consumer-complaint': {
      body: 'Northern Territory Civil and Administrative Tribunal (NTCAT)',
      bodyShort: 'NTCAT',
      url: 'https://www.ntcat.nt.gov.au',
      smallClaimsLimit: 25000,
      generalLimit: 25000,
      notes: 'Consumer matters go through NTCAT.',
    },
    'bond-dispute': {
      body: 'Northern Territory Civil and Administrative Tribunal (NTCAT)',
      bodyShort: 'NTCAT',
      url: 'https://www.ntcat.nt.gov.au',
      smallClaimsLimit: 25000,
      generalLimit: 25000,
      notes: 'NTCAT handles all residential tenancy and bond disputes.',
    },
    employment: {
      body: 'Fair Work Commission (Federal)',
      bodyShort: 'Fair Work',
      url: 'https://www.fwc.gov.au',
      smallClaimsLimit: 20000,
      generalLimit: 20000,
      notes: 'Federal body for unfair dismissal, general protections, and wage recovery.',
    },
  },
}

// ---------------------------------------------------------------------------
// Public API — backwards compatible + new dispute-aware lookup
// ---------------------------------------------------------------------------

export function parseStateFromLocation(location: string): string | null {
  const matches = location.toUpperCase().match(/\b(NSW|VIC|QLD|WA|SA|TAS|ACT|NT)\b/)
  return matches ? matches[1] : null
}

/** Get jurisdiction info for a specific state + dispute type combination. */
export function getJurisdiction(
  state: string,
  disputeType?: DisputeType
): JurisdictionInfo | null {
  const stateData = JURISDICTIONS[state]
  if (!stateData) return null

  if (disputeType && stateData[disputeType]) {
    return stateData[disputeType]
  }
  return stateData.default ?? null
}

/**
 * Legacy lookup: returns the tribunal name string for a state.
 * Now returns the default body for backwards compatibility.
 */
export const STATE_TRIBUNAL: Record<string, string> = Object.fromEntries(
  Object.entries(JURISDICTIONS).map(([state, data]) => [state, data.default.body])
)

/** Get all jurisdiction data (used by court forms page, etc.) */
export function getAllJurisdictions() {
  return JURISDICTIONS
}

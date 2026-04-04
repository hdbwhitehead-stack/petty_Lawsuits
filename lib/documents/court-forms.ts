// ---------------------------------------------------------------------------
// Court & tribunal forms database
// Last verified: April 2026 — fees and form numbers change; verify before display.
// ---------------------------------------------------------------------------

export type CourtForm = {
  state: string
  body: string
  formName: string
  formNumber?: string
  purpose: string
  disputeTypes: string[]
  format: 'online' | 'pdf' | 'pdf-fillable' | 'word'
  url: string
  filingFee?: string
  notes?: string
}

export const COURT_FORMS: CourtForm[] = [
  // ─── NSW ────────────────────────────────────────────────────────────
  {
    state: 'NSW',
    body: 'NCAT',
    formName: 'Application (Consumer and Commercial Division)',
    purpose: 'Filing a consumer or commercial claim up to $40,000',
    disputeTypes: ['consumer-complaint', 'bond-dispute'],
    format: 'online',
    url: 'https://www.ncat.nsw.gov.au',
    filingFee: '~$53 (up to $10k), ~$108 ($10k–$30k), ~$207 ($30k–$40k)',
    notes: 'Online filing via NCAT Online portal. PDF also available.',
  },
  {
    state: 'NSW',
    body: 'NCAT',
    formName: 'Reply to Application',
    purpose: 'Responding to an NCAT claim',
    disputeTypes: ['consumer-complaint', 'bond-dispute'],
    format: 'online',
    url: 'https://www.ncat.nsw.gov.au',
  },
  {
    state: 'NSW',
    body: 'Local Court of NSW',
    formName: 'Statement of Claim',
    formNumber: 'UCPR Form 4',
    purpose: 'Filing a debt recovery or general civil claim',
    disputeTypes: ['debt-recovery'],
    format: 'pdf-fillable',
    url: 'https://onlinecourt.justice.nsw.gov.au',
    filingFee: '~$103–$590 depending on amount claimed',
    notes: 'Also available via NSW Online Court portal. Small Claims Division for claims up to $20,000.',
  },
  {
    state: 'NSW',
    body: 'Local Court of NSW',
    formName: 'Defence',
    formNumber: 'UCPR Form 8',
    purpose: 'Responding to a statement of claim',
    disputeTypes: ['debt-recovery'],
    format: 'pdf',
    url: 'https://onlinecourt.justice.nsw.gov.au',
  },
  {
    state: 'NSW',
    body: 'NSW Fair Trading',
    formName: 'Rental Bonds Online — Bond Claim',
    purpose: 'Initiating a bond refund claim',
    disputeTypes: ['bond-dispute'],
    format: 'online',
    url: 'https://www.fairtrading.nsw.gov.au',
    notes: 'Bond disputes start here. Only escalates to NCAT if the other party disputes.',
  },

  // ─── VIC ────────────────────────────────────────────────────────────
  {
    state: 'VIC',
    body: 'VCAT',
    formName: 'Application for Civil Claim',
    purpose: 'General civil claim including consumer disputes',
    disputeTypes: ['consumer-complaint'],
    format: 'online',
    url: 'https://www.vcat.vic.gov.au',
    filingFee: '~$75–$310 depending on amount claimed',
    notes: 'Online lodgement available for most application types.',
  },
  {
    state: 'VIC',
    body: 'VCAT',
    formName: 'Application for Residential Tenancy Dispute',
    purpose: 'Bond disputes, repairs, eviction, rent arrears',
    disputeTypes: ['bond-dispute'],
    format: 'online',
    url: 'https://www.vcat.vic.gov.au',
    filingFee: '~$65',
  },
  {
    state: 'VIC',
    body: "Magistrates' Court of Victoria",
    formName: 'Complaint (General Civil Claim)',
    purpose: 'Debt recovery and general civil claims up to $100,000',
    disputeTypes: ['debt-recovery'],
    format: 'online',
    url: 'https://www.mcv.vic.gov.au',
    notes: 'Online filing system available.',
  },

  // ─── QLD ────────────────────────────────────────────────────────────
  {
    state: 'QLD',
    body: 'QCAT',
    formName: 'Application (Minor Civil Dispute)',
    formNumber: 'Form 1',
    purpose: 'Consumer claims and minor civil disputes up to $25,000',
    disputeTypes: ['consumer-complaint'],
    format: 'pdf-fillable',
    url: 'https://www.qcat.qld.gov.au',
    filingFee: '~$78.30',
    notes: 'QCAT transitioning to online filing. Check website for current status.',
  },
  {
    state: 'QLD',
    body: 'QCAT',
    formName: 'Response to Application',
    formNumber: 'Form 2',
    purpose: 'Responding to a QCAT application',
    disputeTypes: ['consumer-complaint', 'bond-dispute'],
    format: 'pdf-fillable',
    url: 'https://www.qcat.qld.gov.au',
  },
  {
    state: 'QLD',
    body: 'QCAT',
    formName: 'Application (Minor Civil Dispute — Motor Vehicle)',
    formNumber: 'Form 3',
    purpose: 'Consumer disputes about motor vehicles',
    disputeTypes: ['consumer-complaint'],
    format: 'pdf-fillable',
    url: 'https://www.qcat.qld.gov.au',
  },
  {
    state: 'QLD',
    body: 'QCAT',
    formName: 'Application (Residential Tenancy Dispute)',
    purpose: 'Bond, repairs, termination, rent arrears',
    disputeTypes: ['bond-dispute'],
    format: 'pdf-fillable',
    url: 'https://www.qcat.qld.gov.au',
    notes: 'Bond disputes start with RTA conciliation before QCAT.',
  },
  {
    state: 'QLD',
    body: 'Magistrates Court of Queensland',
    formName: 'Claim',
    formNumber: 'UCPR Form 2',
    purpose: 'Debt recovery — minor debt claims',
    disputeTypes: ['debt-recovery'],
    format: 'pdf',
    url: 'https://www.courts.qld.gov.au',
  },

  // ─── WA ─────────────────────────────────────────────────────────────
  {
    state: 'WA',
    body: 'Magistrates Court of WA',
    formName: 'Minor Case Claim',
    formNumber: 'Form 5',
    purpose: 'Civil claims up to $10,000 (simplified procedure)',
    disputeTypes: ['debt-recovery', 'consumer-complaint', 'bond-dispute'],
    format: 'pdf-fillable',
    url: 'https://www.magistratescourt.wa.gov.au',
    filingFee: '~$105',
    notes: 'eLodgment portal available.',
  },
  {
    state: 'WA',
    body: 'Magistrates Court of WA',
    formName: 'General Procedure Claim',
    formNumber: 'Form 6',
    purpose: 'Civil claims $10,001–$75,000',
    disputeTypes: ['debt-recovery', 'consumer-complaint'],
    format: 'pdf-fillable',
    url: 'https://www.magistratescourt.wa.gov.au',
    filingFee: '~$350+',
  },
  {
    state: 'WA',
    body: 'Magistrates Court of WA',
    formName: 'Response/Defence',
    formNumber: 'Form 15',
    purpose: 'Responding to a civil claim',
    disputeTypes: ['debt-recovery', 'consumer-complaint', 'bond-dispute'],
    format: 'pdf-fillable',
    url: 'https://www.magistratescourt.wa.gov.au',
  },

  // ─── SA ─────────────────────────────────────────────────────────────
  {
    state: 'SA',
    body: 'SACAT',
    formName: 'Application (Residential Tenancy Dispute)',
    purpose: 'Bond, rent, repairs, termination',
    disputeTypes: ['bond-dispute'],
    format: 'online',
    url: 'https://www.sacat.sa.gov.au',
  },
  {
    state: 'SA',
    body: 'SACAT',
    formName: 'General Application',
    purpose: 'Minor civil and consumer disputes up to $12,000',
    disputeTypes: ['consumer-complaint'],
    format: 'online',
    url: 'https://www.sacat.sa.gov.au',
  },
  {
    state: 'SA',
    body: 'Magistrates Court of SA',
    formName: 'Minor Civil Claim',
    formNumber: 'Form 32',
    purpose: 'Debt recovery and consumer disputes up to $12,000 (minor) or $100,000 (general)',
    disputeTypes: ['debt-recovery', 'consumer-complaint'],
    format: 'pdf',
    url: 'https://www.courts.sa.gov.au',
    filingFee: '~$80–$150',
  },

  // ─── TAS ────────────────────────────────────────────────────────────
  {
    state: 'TAS',
    body: 'Magistrates Court of Tasmania',
    formName: 'Application — Minor Civil Claim',
    purpose: 'Civil claims up to $5,000 (simplified procedure)',
    disputeTypes: ['debt-recovery', 'consumer-complaint'],
    format: 'pdf',
    url: 'https://www.magistratescourt.tas.gov.au',
    filingFee: '~$80–$200',
  },
  {
    state: 'TAS',
    body: 'Magistrates Court of Tasmania',
    formName: 'Application — General Civil Claim',
    purpose: 'Civil claims $5,001–$50,000',
    disputeTypes: ['debt-recovery', 'consumer-complaint'],
    format: 'pdf',
    url: 'https://www.magistratescourt.tas.gov.au',
  },
  {
    state: 'TAS',
    body: 'Residential Tenancy Commissioner',
    formName: 'Application to Residential Tenancy Commissioner',
    purpose: 'Bond disputes and tenancy disputes',
    disputeTypes: ['bond-dispute'],
    format: 'pdf',
    url: 'https://www.magistratescourt.tas.gov.au',
    notes: 'Starts with the Commissioner. Complex disputes escalate to the Magistrates Court.',
  },

  // ─── ACT ────────────────────────────────────────────────────────────
  {
    state: 'ACT',
    body: 'ACAT',
    formName: 'Application for Civil Dispute',
    purpose: 'Debt recovery and consumer disputes up to $25,000',
    disputeTypes: ['debt-recovery', 'consumer-complaint'],
    format: 'online',
    url: 'https://www.acat.act.gov.au',
    filingFee: '~$80–$150',
  },
  {
    state: 'ACT',
    body: 'ACAT',
    formName: 'Application for Residential Tenancy Dispute',
    purpose: 'Bond, rent arrears, repairs, lease termination',
    disputeTypes: ['bond-dispute'],
    format: 'online',
    url: 'https://www.acat.act.gov.au',
  },
  {
    state: 'ACT',
    body: 'ACAT',
    formName: 'Response Form',
    purpose: 'Responding to any ACAT application',
    disputeTypes: ['debt-recovery', 'consumer-complaint', 'bond-dispute'],
    format: 'online',
    url: 'https://www.acat.act.gov.au',
  },

  // ─── NT ─────────────────────────────────────────────────────────────
  {
    state: 'NT',
    body: 'NTCAT',
    formName: 'Application Form',
    purpose: 'Consumer, tenancy, and civil matters up to $25,000',
    disputeTypes: ['consumer-complaint', 'bond-dispute'],
    format: 'pdf',
    url: 'https://www.ntcat.nt.gov.au',
  },
  {
    state: 'NT',
    body: 'NTCAT',
    formName: 'Response Form',
    purpose: 'Responding to an NTCAT application',
    disputeTypes: ['consumer-complaint', 'bond-dispute'],
    format: 'pdf',
    url: 'https://www.ntcat.nt.gov.au',
  },
  {
    state: 'NT',
    body: 'Local Court of the NT',
    formName: 'Claim Form',
    purpose: 'Debt recovery and small claims up to $100,000',
    disputeTypes: ['debt-recovery'],
    format: 'pdf',
    url: 'https://www.localcourt.nt.gov.au',
    filingFee: '~$100–$250',
  },

  // ─── Federal (all states) ───────────────────────────────────────────
  {
    state: 'Federal',
    body: 'Fair Work Commission',
    formName: 'Application for Unfair Dismissal Remedy',
    formNumber: 'Form F2',
    purpose: 'Challenging an unfair dismissal',
    disputeTypes: ['employment'],
    format: 'online',
    url: 'https://www.fwc.gov.au',
    filingFee: 'No fee',
    notes: 'Fully online. Must be lodged within 21 days of dismissal.',
  },
  {
    state: 'Federal',
    body: 'Fair Work Commission',
    formName: 'Response to Unfair Dismissal Application',
    formNumber: 'Form F3',
    purpose: 'Employer response to unfair dismissal claim',
    disputeTypes: ['employment'],
    format: 'online',
    url: 'https://www.fwc.gov.au',
    filingFee: 'No fee',
  },
  {
    state: 'Federal',
    body: 'Fair Work Commission',
    formName: 'Application for General Protections (Dismissal)',
    formNumber: 'Form F8',
    purpose: 'Adverse action involving dismissal',
    disputeTypes: ['employment'],
    format: 'online',
    url: 'https://www.fwc.gov.au',
    filingFee: 'No fee',
    notes: 'Must be lodged within 21 days of dismissal.',
  },
  {
    state: 'Federal',
    body: 'Fair Work Commission',
    formName: 'Small Claims Application (Wages)',
    formNumber: 'Form F13',
    purpose: 'Recovery of unpaid wages/entitlements up to $20,000',
    disputeTypes: ['employment'],
    format: 'online',
    url: 'https://www.fwc.gov.au',
    filingFee: 'No fee',
    notes: 'Simplified procedure for underpayment claims up to $20,000.',
  },
  {
    state: 'Federal',
    body: 'Fair Work Commission',
    formName: 'Application to Deal with a Dispute',
    formNumber: 'Form F10',
    purpose: 'Disputes under an enterprise agreement or contract',
    disputeTypes: ['employment'],
    format: 'online',
    url: 'https://www.fwc.gov.au',
  },
  {
    state: 'Federal',
    body: 'Fair Work Commission',
    formName: 'Application to Stop Bullying',
    formNumber: 'Form F1',
    purpose: 'Anti-bullying order for workplace bullying',
    disputeTypes: ['employment'],
    format: 'online',
    url: 'https://www.fwc.gov.au',
    filingFee: 'No fee',
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Get forms relevant to a specific state and dispute type. Includes federal forms. */
export function getFormsForDispute(state: string, disputeType: string): CourtForm[] {
  return COURT_FORMS.filter(
    f =>
      (f.state === state || f.state === 'Federal') &&
      f.disputeTypes.includes(disputeType)
  )
}

/** Get all forms for a state (including federal). */
export function getFormsForState(state: string): CourtForm[] {
  return COURT_FORMS.filter(f => f.state === state || f.state === 'Federal')
}

/** Get all unique states that have forms. */
export function getStatesWithForms(): string[] {
  return Array.from(new Set(COURT_FORMS.map(f => f.state).filter(s => s !== 'Federal')))
}

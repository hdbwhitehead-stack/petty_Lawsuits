// ---------------------------------------------------------------------------
// Court & tribunal forms database
// Fees and form numbers change — each entry has a lastVerified date.
// Forms older than 6 months should be re-verified before display.
// ---------------------------------------------------------------------------

export type FormFormat = 'online' | 'pdf' | 'pdf-fillable' | 'word' | 'online+pdf'

export type CourtForm = {
  state: string
  body: string
  formName: string
  formNumber?: string
  purpose: string
  disputeTypes: string[]
  format: FormFormat
  url: string
  downloadUrl?: string
  filingFee?: string
  notes?: string
  lastVerified: string // ISO date
}

/** How many months before a form entry is considered stale. */
export const STALE_MONTHS = 6

export function isStale(form: CourtForm): boolean {
  const verified = new Date(form.lastVerified)
  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - STALE_MONTHS)
  return verified < cutoff
}

export const COURT_FORMS: CourtForm[] = [
  // ═══════════════════════════════════════════════════════════════════════
  // NSW
  // ═══════════════════════════════════════════════════════════════════════
  {
    state: 'NSW',
    body: 'NCAT',
    formName: 'Consumer Claim Application',
    purpose: 'Filing a consumer complaint (faulty goods/services) up to $40,000',
    disputeTypes: ['consumer-complaint'],
    format: 'online+pdf',
    url: 'https://ncat.nsw.gov.au/forms-and-fees/forms/consumer-and-commercial-division-forms.html',
    downloadUrl: 'https://ncat.nsw.gov.au/documents/forms/ccd_form_consumer_claim_application.pdf',
    filingFee: '~$53 (up to $10k), ~$108 ($10k–$30k), ~$207 ($30k–$40k)',
    notes: 'Online filing also available via NCAT Online Services.',
    lastVerified: '2026-04-04',
  },
  {
    state: 'NSW',
    body: 'NCAT',
    formName: 'Tenancy & Social Housing Application',
    purpose: 'Filing a residential tenancy or bond dispute',
    disputeTypes: ['bond-dispute'],
    format: 'online+pdf',
    url: 'https://ncat.nsw.gov.au/forms-and-fees/forms/consumer-and-commercial-division-forms.html',
    downloadUrl: 'https://ncat.nsw.gov.au/documents/forms/ccd-form-tenancy-social-housing-application.pdf',
    notes: 'For bond disputes, you typically start with NSW Fair Trading Rental Bonds Online first. NCAT if the other party disputes.',
    lastVerified: '2026-04-04',
  },
  {
    state: 'NSW',
    body: 'NCAT',
    formName: 'Motor Vehicles Consumer Claim Application',
    purpose: 'Consumer disputes about motor vehicles',
    disputeTypes: ['consumer-complaint'],
    format: 'online+pdf',
    url: 'https://ncat.nsw.gov.au/forms-and-fees/forms/consumer-and-commercial-division-forms.html',
    downloadUrl: 'https://ncat.nsw.gov.au/documents/forms/ccd_form_motor_vehicles_consumer_claim_application.pdf',
    lastVerified: '2026-04-04',
  },
  {
    state: 'NSW',
    body: 'Local Court of NSW',
    formName: 'Statement of Claim (Self-represented)',
    formNumber: 'UCPR Form 3B',
    purpose: 'Filing a debt recovery or general civil claim (self-represented litigants)',
    disputeTypes: ['debt-recovery'],
    format: 'pdf',
    url: 'https://ucprforms.nsw.gov.au/download.html',
    downloadUrl: 'https://ucprforms.nsw.gov.au/documents/pdf/Form%203B_v6.pdf',
    filingFee: '~$103–$590 depending on amount claimed',
    notes: 'Use Form 3B for self-represented. Form 3A is for legal practitioners. Online filing via NSW Online Registry also available.',
    lastVerified: '2026-04-04',
  },
  {
    state: 'NSW',
    body: 'Local Court of NSW',
    formName: 'Statement of Claim (Practitioner)',
    formNumber: 'UCPR Form 3A',
    purpose: 'Filing a debt recovery or general civil claim (via solicitor)',
    disputeTypes: ['debt-recovery'],
    format: 'online+pdf',
    url: 'https://ucprforms.nsw.gov.au/download.html',
    downloadUrl: 'https://ucprforms.nsw.gov.au/documents/pdf/ucpr_form_3a_v71.pdf',
    notes: 'Also available as Word doc. Online filing via NSW Online Registry.',
    lastVerified: '2026-04-04',
  },
  {
    state: 'NSW',
    body: 'Local Court of NSW',
    formName: 'Defence',
    formNumber: 'UCPR Form 7A',
    purpose: 'Responding to a statement of claim',
    disputeTypes: ['debt-recovery'],
    format: 'online+pdf',
    url: 'https://ucprforms.nsw.gov.au/download.html',
    downloadUrl: 'https://ucprforms.nsw.gov.au/documents/pdf/ucpr_form_7a_v51.pdf',
    notes: 'Online filing via NSW Online Registry also available.',
    lastVerified: '2026-04-04',
  },
  {
    state: 'NSW',
    body: 'NSW Fair Trading',
    formName: 'Rental Bonds Online — Bond Claim',
    purpose: 'Initiating a bond refund claim',
    disputeTypes: ['bond-dispute'],
    format: 'online',
    url: 'https://www.nsw.gov.au/housing-and-construction/renting-a-place-to-live/residential-rental-bonds/rental-bonds-online-for-tenants',
    downloadUrl: 'https://rbo.fairtrading.nsw.gov.au/',
    notes: 'Requires Rental Bonds Online account. Bond disputes start here before escalating to NCAT.',
    lastVerified: '2026-04-04',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // VIC
  // ═══════════════════════════════════════════════════════════════════════
  {
    state: 'VIC',
    body: 'VCAT',
    formName: 'Goods and Services Application',
    purpose: 'Consumer disputes about goods or services',
    disputeTypes: ['consumer-complaint'],
    format: 'online+pdf',
    url: 'https://www.vcat.vic.gov.au/documents/forms/goods-and-services-application',
    downloadUrl: 'https://www.vcat.vic.gov.au/media/456/download',
    filingFee: '~$75–$310 depending on amount claimed',
    notes: 'Online portal (preferred): https://my.vcat.vic.gov.au/cclapplication — requires free myVCAT account.',
    lastVerified: '2026-04-04',
  },
  {
    state: 'VIC',
    body: 'VCAT',
    formName: 'General Application — Residential Tenancies List',
    purpose: 'Bond disputes, repairs, eviction, rent arrears',
    disputeTypes: ['bond-dispute'],
    format: 'online+pdf',
    url: 'https://www.vcat.vic.gov.au/documents/forms/application-general-application-residential-tenancies-list',
    downloadUrl: 'https://www.vcat.vic.gov.au/media/315/download',
    filingFee: '~$65',
    notes: 'Bond, compensation, repairs, and excessive rent applications may now need to go through Rental Dispute Resolution Victoria (RDRV) first.',
    lastVerified: '2026-04-04',
  },
  {
    state: 'VIC',
    body: "Magistrates' Court of Victoria",
    formName: 'Complaint',
    formNumber: 'Form 5A',
    purpose: 'Debt recovery and general civil claims up to $100,000',
    disputeTypes: ['debt-recovery'],
    format: 'online+pdf',
    url: 'https://www.mcv.vic.gov.au/form-finder/complaint-form-5a',
    downloadUrl: 'https://www.mcv.vic.gov.au/sites/default/files/2023-04/Form%205A%20-%20Complaint.pdf',
    notes: 'Also available as Word doc. Online filing system available.',
    lastVerified: '2026-04-04',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // QLD
  // ═══════════════════════════════════════════════════════════════════════
  {
    state: 'QLD',
    body: 'QCAT',
    formName: 'Application — Minor Civil Dispute (Consumer/Trader)',
    formNumber: 'Form 1',
    purpose: 'Consumer/trader disputes and motor vehicle property damage up to $25,000',
    disputeTypes: ['consumer-complaint'],
    format: 'pdf-fillable',
    url: 'https://www.qcat.qld.gov.au/resources/forms',
    downloadUrl: 'https://www.qcat.qld.gov.au/__data/assets/pdf_file/0015/100851/form-01-app-mcd-consumer-dispute.pdf',
    filingFee: '~$78.30',
    notes: 'Online filing also available via QCAT QCase portal.',
    lastVerified: '2026-04-04',
  },
  {
    state: 'QLD',
    body: 'QCAT',
    formName: 'Application — Minor Civil Dispute (Residential Tenancy)',
    formNumber: 'Form 2',
    purpose: 'Residential tenancy disputes — bond, repairs, termination, rent arrears',
    disputeTypes: ['bond-dispute'],
    format: 'pdf-fillable',
    url: 'https://www.qcat.qld.gov.au/resources/forms',
    downloadUrl: 'https://www.qcat.qld.gov.au/__data/assets/pdf_file/0018/100854/form-02-app-mcd-res-tenancy-dispute.pdf',
    notes: 'Non-urgent tenancy disputes must first go through RTA dispute resolution. You need a Notice of Unresolved Dispute (NURD) before filing with QCAT.',
    lastVerified: '2026-04-04',
  },
  {
    state: 'QLD',
    body: 'QCAT',
    formName: 'Application — Minor Civil Dispute (Minor Debt)',
    formNumber: 'Form 3',
    purpose: 'Minor debt disputes up to $25,000',
    disputeTypes: ['debt-recovery'],
    format: 'pdf-fillable',
    url: 'https://www.qcat.qld.gov.au/resources/forms',
    downloadUrl: 'https://www.qcat.qld.gov.au/__data/assets/pdf_file/0019/100855/form-03-app-mcd-minor-debt-dispute.pdf',
    lastVerified: '2026-04-04',
  },
  {
    state: 'QLD',
    body: 'QCAT',
    formName: 'Response — Minor Debt Dispute',
    formNumber: 'Form 7',
    purpose: 'Responding to a minor debt dispute application',
    disputeTypes: ['debt-recovery'],
    format: 'pdf-fillable',
    url: 'https://www.qcat.qld.gov.au/resources/forms',
    downloadUrl: 'https://www.qcat.qld.gov.au/__data/assets/pdf_file/0015/100860/form-07-response-to-mcd-minor-debt.pdf',
    lastVerified: '2026-04-04',
  },
  {
    state: 'QLD',
    body: 'QCAT',
    formName: 'Response and/or Counter-application (Generic)',
    formNumber: 'Form 36',
    purpose: 'Generic response to any QCAT application',
    disputeTypes: ['consumer-complaint', 'bond-dispute'],
    format: 'pdf-fillable',
    url: 'https://www.qcat.qld.gov.au/resources/forms',
    downloadUrl: 'https://www.qcat.qld.gov.au/__data/assets/pdf_file/0013/101083/Generic-Response-and-or-Counter-application.pdf',
    lastVerified: '2026-04-04',
  },
  {
    state: 'QLD',
    body: 'Magistrates Court of Queensland',
    formName: 'Claim',
    formNumber: 'UCPR Form 2',
    purpose: 'Debt recovery — claims in Magistrates Court',
    disputeTypes: ['debt-recovery'],
    format: 'word',
    url: 'https://www.courts.qld.gov.au/going-to-court/money-disputes/claim-and-statement-of-claim',
    downloadUrl: 'https://www.courts.qld.gov.au/__data/assets/word_doc/0008/92897/Form-2-Claim-UCPR.doc',
    notes: 'Word .doc format. For Magistrates Court claims you may also need UCPR Form 16 (Statement of Claim).',
    lastVerified: '2026-04-04',
  },
  {
    state: 'QLD',
    body: 'QLD Residential Tenancies Authority',
    formName: 'Dispute Resolution Request',
    formNumber: 'Form 16',
    purpose: 'Initiating RTA dispute resolution (required before QCAT for non-urgent tenancy disputes)',
    disputeTypes: ['bond-dispute'],
    format: 'online+pdf',
    url: 'https://www.rta.qld.gov.au/disputes/rta-dispute-resolution-service',
    downloadUrl: 'https://www.rta.qld.gov.au/forms-resources/forms/forms-for-general-tenancies/dispute-resolution-request-form-16',
    notes: 'Online portal requires QLD Digital Identity. Paper Form 16 available as alternative. RTA provides free conciliation — not binding. Issues a NURD for QCAT if unresolved.',
    lastVerified: '2026-04-04',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // WA
  // ═══════════════════════════════════════════════════════════════════════
  {
    state: 'WA',
    body: 'Magistrates Court of WA',
    formName: 'Minor Case Claim',
    formNumber: 'Form 4',
    purpose: 'Civil claims up to $10,000 (simplified procedure)',
    disputeTypes: ['debt-recovery', 'consumer-complaint', 'bond-dispute'],
    format: 'online+pdf',
    url: 'https://www.magistratescourt.wa.gov.au/F/forms.aspx',
    downloadUrl: 'https://www.magistratescourt.wa.gov.au/_files/CIV_Form_4_Minor_Case.pdf',
    filingFee: '~$105',
    notes: 'eLodgment via eCourts Portal: https://ecourts.justice.wa.gov.au/eCourtsPortal/. Also available as Word doc.',
    lastVerified: '2026-04-04',
  },
  {
    state: 'WA',
    body: 'Magistrates Court of WA',
    formName: 'General Procedure Claim',
    formNumber: 'Form 3',
    purpose: 'Civil claims $10,001–$75,000',
    disputeTypes: ['debt-recovery', 'consumer-complaint'],
    format: 'online+pdf',
    url: 'https://www.magistratescourt.wa.gov.au/F/forms.aspx',
    downloadUrl: 'https://www.magistratescourt.wa.gov.au/_files/CIV_Form_3.pdf',
    filingFee: '~$350+',
    notes: 'Also available as Word doc.',
    lastVerified: '2026-04-04',
  },
  {
    state: 'WA',
    body: 'Magistrates Court of WA',
    formName: 'Response to General Procedure Claim',
    formNumber: 'Form 15',
    purpose: 'Responding to a general procedure civil claim',
    disputeTypes: ['debt-recovery', 'consumer-complaint'],
    format: 'online+pdf',
    url: 'https://www.magistratescourt.wa.gov.au/F/forms.aspx',
    downloadUrl: 'https://www.magistratescourt.wa.gov.au/_files/CIV_Form_15.pdf',
    lastVerified: '2026-04-04',
  },
  {
    state: 'WA',
    body: 'Magistrates Court of WA',
    formName: 'Response to Minor Case Claim',
    formNumber: 'Form 15A',
    purpose: 'Responding to a minor case civil claim',
    disputeTypes: ['debt-recovery', 'consumer-complaint', 'bond-dispute'],
    format: 'pdf',
    url: 'https://www.magistratescourt.wa.gov.au/F/forms.aspx',
    downloadUrl: 'https://www.magistratescourt.wa.gov.au/_files/CIV_Form_15A_post_1_June_2020.pdf',
    lastVerified: '2026-04-04',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // SA
  // ═══════════════════════════════════════════════════════════════════════
  {
    state: 'SA',
    body: 'SACAT',
    formName: 'Online Application (Residential Tenancy)',
    purpose: 'Bond, rent, repairs, termination',
    disputeTypes: ['bond-dispute'],
    format: 'online',
    url: 'https://www.sacat.sa.gov.au/cs/housing-and-rentals',
    downloadUrl: 'https://www.sacat.sa.gov.au/apply-online-now2',
    notes: 'SACAT is online-only — no downloadable forms. Phone assistance: 1800 723 767.',
    lastVerified: '2026-04-04',
  },
  {
    state: 'SA',
    body: 'SACAT',
    formName: 'Online Application (General)',
    purpose: 'Minor civil and consumer disputes up to $12,000',
    disputeTypes: ['consumer-complaint'],
    format: 'online',
    url: 'https://sacat.sa.gov.au/applications-and-hearings/how-to-apply-to-sacat',
    downloadUrl: 'https://www.sacat.sa.gov.au/apply-online-now2',
    notes: 'Same online portal for all application types. System prompts for relevant info based on case type.',
    lastVerified: '2026-04-04',
  },
  {
    state: 'SA',
    body: 'Magistrates Court of SA',
    formName: 'Minor Civil Action — Claim',
    formNumber: 'Form 3',
    purpose: 'Debt recovery and consumer disputes up to $12,000 (minor) or $100,000 (general)',
    disputeTypes: ['debt-recovery', 'consumer-complaint'],
    format: 'online+pdf',
    url: 'https://www.courts.sa.gov.au/download/court-forms-mc-civil-earlier-3/',
    filingFee: '~$80–$150',
    notes: 'Page has download links for both PDF and Word.',
    lastVerified: '2026-04-04',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // TAS
  // ═══════════════════════════════════════════════════════════════════════
  {
    state: 'TAS',
    body: 'Magistrates Court of Tasmania',
    formName: 'Claim',
    formNumber: 'Form 1',
    purpose: 'All civil claims — minor (up to $15,000) and general (up to $50,000)',
    disputeTypes: ['debt-recovery', 'consumer-complaint'],
    format: 'word',
    url: 'https://www.magistratescourt.tas.gov.au/forms',
    downloadUrl: 'https://www.magistratescourt.tas.gov.au/__data/assets/word_doc/0003/339096/Claim.docx',
    filingFee: '~$80–$200',
    notes: 'Single form covers both minor and general civil claims. Word .docx format.',
    lastVerified: '2026-04-04',
  },
  {
    state: 'TAS',
    body: 'Residential Tenancy Commissioner',
    formName: 'Application for Order for Repairs',
    purpose: 'Requesting repairs to rental property',
    disputeTypes: ['bond-dispute'],
    format: 'pdf',
    url: 'https://www.cbos.tas.gov.au/topics/resources-tools/general-forms/asset-listings/renting',
    downloadUrl: 'https://cbos.tas.gov.au/__data/assets/pdf_file/0016/404512/Application-for-order-for-repairs.pdf',
    notes: 'TAS has purpose-specific forms (repairs, rent increases, etc.) rather than one general tenancy application. Contact: RTC@justice.tas.gov.au or 1300 654 499.',
    lastVerified: '2026-04-04',
  },
  {
    state: 'TAS',
    body: 'Residential Tenancy Commissioner',
    formName: 'Summary of Evidence',
    purpose: 'Supporting evidence form for tenancy disputes',
    disputeTypes: ['bond-dispute'],
    format: 'pdf',
    url: 'https://www.cbos.tas.gov.au/topics/resources-tools/general-forms/asset-listings/renting',
    downloadUrl: 'https://www.cbos.tas.gov.au/__data/assets/pdf_file/0015/404511/Summary_of_Evidence_Form.pdf',
    lastVerified: '2026-04-04',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // ACT
  // ═══════════════════════════════════════════════════════════════════════
  {
    state: 'ACT',
    body: 'ACAT',
    formName: 'Civil Dispute Application',
    purpose: 'Debt recovery and consumer disputes up to $25,000',
    disputeTypes: ['debt-recovery', 'consumer-complaint'],
    format: 'online+pdf',
    url: 'https://www.acat.act.gov.au/fees-and-forms/online-forms/civil-dispute-application-form',
    downloadUrl: 'https://www.acat.act.gov.au/__data/assets/pdf_file/0006/1853907/Civil-Dispute-Application-AF-2021-28-correct-font-size.pdf',
    filingFee: '~$80–$150',
    notes: 'Online form and downloadable PDF both available.',
    lastVerified: '2026-04-04',
  },
  {
    state: 'ACT',
    body: 'ACAT',
    formName: 'Application for Resolution of Tenancy Dispute',
    purpose: 'Bond, rent arrears, repairs, lease termination',
    disputeTypes: ['bond-dispute'],
    format: 'pdf',
    url: 'https://www.acat.act.gov.au/fees-and-forms/forms',
    downloadUrl: 'https://www.acat.act.gov.au/__data/assets/pdf_file/0004/1439050/Application-for-Resolution-of-Tenancy-Dispute.pdf',
    notes: 'PDF only — no online form equivalent found.',
    lastVerified: '2026-04-04',
  },
  {
    state: 'ACT',
    body: 'ACAT',
    formName: 'Response — Civil Dispute',
    formNumber: 'AF2021-29',
    purpose: 'Responding to a civil dispute application',
    disputeTypes: ['debt-recovery', 'consumer-complaint'],
    format: 'pdf',
    url: 'https://www.acat.act.gov.au/fees-and-forms/forms',
    downloadUrl: 'https://www.acat.act.gov.au/__data/assets/pdf_file/0009/1818684/Civil-Dispute-Response-AF2021-29-.pdf',
    lastVerified: '2026-04-04',
  },
  {
    state: 'ACT',
    body: 'ACAT',
    formName: 'Response — Residential Tenancy',
    purpose: 'Responding to a residential tenancy application',
    disputeTypes: ['bond-dispute'],
    format: 'pdf',
    url: 'https://www.acat.act.gov.au/fees-and-forms/forms',
    downloadUrl: 'https://www.acat.act.gov.au/__data/assets/pdf_file/0010/1364518/af_2015-20_residential_tenancies_response.pdf',
    lastVerified: '2026-04-04',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // NT
  // ═══════════════════════════════════════════════════════════════════════
  {
    state: 'NT',
    body: 'NTCAT',
    formName: 'Initiating Application',
    formNumber: 'Form 1',
    purpose: 'All NTCAT matters — consumer, tenancy, civil up to $25,000',
    disputeTypes: ['consumer-complaint', 'bond-dispute'],
    format: 'online+pdf',
    url: 'https://ntcat.nt.gov.au/publications/form-1-initiating-application',
    downloadUrl: 'https://ntcat.nt.gov.au/sites/default/files/form_1_initiating_application_9.pdf',
    notes: 'Also available as DOCX. Completion guide available on the publications page.',
    lastVerified: '2026-04-04',
  },
  {
    state: 'NT',
    body: 'NTCAT',
    formName: 'Response',
    formNumber: 'Form 2',
    purpose: 'Responding to an NTCAT application',
    disputeTypes: ['consumer-complaint', 'bond-dispute'],
    format: 'online+pdf',
    url: 'https://ntcat.nt.gov.au/publications/form-2-response',
    downloadUrl: 'https://ntcat.nt.gov.au/sites/default/files/form_2_response_5.pdf',
    notes: 'Also available as DOCX.',
    lastVerified: '2026-04-04',
  },
  {
    state: 'NT',
    body: 'Local Court of the NT',
    formName: 'Statement of Claim',
    formNumber: 'Form 7A',
    purpose: 'Debt recovery and civil claims up to $100,000',
    disputeTypes: ['debt-recovery'],
    format: 'pdf',
    url: 'https://localcourt.nt.gov.au/forms-fees/forms',
    downloadUrl: 'https://localcourt.nt.gov.au/sites/default/files/form7a.pdf',
    notes: 'Form 7B is for motor vehicle collision claims specifically.',
    lastVerified: '2026-04-04',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Federal — Fair Work Commission
  // ═══════════════════════════════════════════════════════════════════════
  {
    state: 'Federal',
    body: 'Fair Work Commission',
    formName: 'Application for Unfair Dismissal Remedy',
    formNumber: 'Form F2',
    purpose: 'Challenging an unfair dismissal',
    disputeTypes: ['employment'],
    format: 'online+pdf',
    url: 'https://www.fwc.gov.au/form/apply-unfair-dismissal-form-f2',
    downloadUrl: 'https://www.fwc.gov.au/documents/forms/form_f2.pdf',
    filingFee: 'Fee required (waiver available via Form F80)',
    notes: 'Must be lodged within 21 days of dismissal. Online lodgement preferred.',
    lastVerified: '2026-04-04',
  },
  {
    state: 'Federal',
    body: 'Fair Work Commission',
    formName: 'Response to Unfair Dismissal Application',
    formNumber: 'Form F3',
    purpose: 'Employer response to unfair dismissal claim',
    disputeTypes: ['employment'],
    format: 'online+pdf',
    url: 'https://www.fwc.gov.au/form/respond-claim-unfair-dismissal-form-f3',
    downloadUrl: 'https://www.fwc.gov.au/sites/default/files/2021-09/form-f3-respond-to-unfair-dismissal-claim.pdf',
    filingFee: 'No fee',
    notes: 'Must respond within 7 days.',
    lastVerified: '2026-04-04',
  },
  {
    state: 'Federal',
    body: 'Fair Work Commission',
    formName: 'Application for General Protections (Dismissal)',
    formNumber: 'Form F8',
    purpose: 'Adverse action involving dismissal',
    disputeTypes: ['employment'],
    format: 'online+pdf',
    url: 'https://www.fwc.gov.au/job-loss-or-dismissal/dismissal-under-general-protections/apply-general-protections-dismissal-form',
    downloadUrl: 'https://www.fwc.gov.au/documents/forms/form_f8.pdf',
    filingFee: 'Fee required',
    notes: 'Must be lodged within 21 days of dismissal.',
    lastVerified: '2026-04-04',
  },
  {
    state: 'Federal',
    body: 'Fair Work Commission',
    formName: 'Application to Deal with a Dispute',
    formNumber: 'Form F10',
    purpose: 'Disputes under an enterprise agreement or award',
    disputeTypes: ['employment'],
    format: 'online+pdf',
    url: 'https://www.fwc.gov.au/form/apply-resolve-dispute-about-award-or-agreement-form-f10',
    downloadUrl: 'https://www.fwc.gov.au/documents/forms/form_f10.pdf',
    lastVerified: '2026-04-04',
  },
  {
    state: 'Federal',
    body: 'Fair Work Commission',
    formName: 'Application to Stop Workplace Bullying',
    formNumber: 'Form F72',
    purpose: 'Anti-bullying order for workplace bullying',
    disputeTypes: ['employment'],
    format: 'online+pdf',
    url: 'https://www.fwc.gov.au/apply-or-lodge/form/apply-stop-workplace-bullying-form-f72',
    downloadUrl: 'https://www.fwc.gov.au/documents/forms/form_f72.pdf',
    filingFee: 'No fee',
    lastVerified: '2026-04-04',
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

/** Get forms that are overdue for verification. */
export function getStaleForms(): CourtForm[] {
  return COURT_FORMS.filter(isStale)
}

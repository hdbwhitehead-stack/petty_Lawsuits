// ---------------------------------------------------------------------------
// Per-jurisdiction data for SEO landing pages.
// Do NOT import or modify lib/documents/jurisdiction.ts -- that file is owned
// by a separate surface (document generation). These are marketing/SEO fields.
// ---------------------------------------------------------------------------

export type JurisdictionLandingData = {
  /** URL slug -- lowercase, matches the state code */
  slug: string
  /** State code, uppercase -- used for ?jurisdiction= query param */
  code: string
  /** Full state or territory name */
  stateName: string
  /** Name of the primary small claims / civil tribunal */
  tribunalName: string
  /** Short abbreviation for the tribunal */
  tribunalShort: string
  /** Official URL for the tribunal */
  tribunalUrl: string
  /** Small claims / simplified procedure upper limit in AUD */
  smallClaimsLimit: number
  /** General civil jurisdiction upper limit in AUD */
  generalLimit: number
  /** Rough time from filing to hearing for a simple uncontested claim */
  typicalTimeline: string
  /** Official small claims / self-represented litigant info URL */
  smallClaimsUrl: string
  /** One-sentence summary for meta description and intro copy */
  oneSentenceSummary: string
  /** Key facts to show in the "What to know" section */
  keyFacts: string[]
}

export const JURISDICTION_LANDING_DATA: JurisdictionLandingData[] = [
  {
    slug: 'nsw',
    code: 'NSW',
    stateName: 'New South Wales',
    tribunalName: 'NSW Civil and Administrative Tribunal',
    tribunalShort: 'NCAT',
    tribunalUrl: 'https://www.ncat.nsw.gov.au',
    smallClaimsLimit: 10000,
    generalLimit: 40000,
    typicalTimeline: '6-12 weeks from filing to first hearing',
    smallClaimsUrl:
      'https://www.ncat.nsw.gov.au/ncat/about-ncat/divisions/consumer-commercial-division.html',
    oneSentenceSummary:
      'Send a professionally drafted demand letter tailored to NSW law, referencing NCAT, the correct filing thresholds, and the right legislative provisions.',
    keyFacts: [
      "NCAT's Consumer and Commercial Division handles most civil disputes in NSW.",
      'Claims up to $10,000 use a simplified small claims process with reduced fees.',
      'Claims between $10,001 and $40,000 go through the standard NCAT procedure.',
      'Debt recovery claims above $20,000 typically go to the Local Court instead.',
      'You do not need a lawyer to file at NCAT for consumer or tenancy disputes.',
      'A formal demand letter is recommended before lodging your application.',
    ],
  },
  {
    slug: 'vic',
    code: 'VIC',
    stateName: 'Victoria',
    tribunalName: 'Victorian Civil and Administrative Tribunal',
    tribunalShort: 'VCAT',
    tribunalUrl: 'https://www.vcat.vic.gov.au',
    smallClaimsLimit: 10000,
    generalLimit: 100000,
    typicalTimeline: '8-14 weeks from filing to first hearing',
    smallClaimsUrl: 'https://www.vcat.vic.gov.au/disputes/consumer-disputes',
    oneSentenceSummary:
      "Generate a demand letter citing Victorian consumer law and VCAT's jurisdiction, ready to send before you file.",
    keyFacts: [
      "VCAT's Civil Claims List handles consumer, trader, and general civil disputes.",
      'The small claims track applies to disputes under $10,000, with simplified hearings.',
      'VCAT can hear civil claims up to $100,000 -- above that requires consent.',
      "Debt recovery claims often go to the Magistrates' Court instead of VCAT.",
      'Legal representation at VCAT is restricted for claims under $10,000.',
      'Most claimants send a formal demand letter before lodging to show good faith.',
    ],
  },
  {
    slug: 'qld',
    code: 'QLD',
    stateName: 'Queensland',
    tribunalName: 'Queensland Civil and Administrative Tribunal',
    tribunalShort: 'QCAT',
    tribunalUrl: 'https://www.qcat.qld.gov.au',
    smallClaimsLimit: 7500,
    generalLimit: 25000,
    typicalTimeline: '6-10 weeks from filing to first hearing',
    smallClaimsUrl: 'https://www.qcat.qld.gov.au/dispute-types/minor-civil-disputes',
    oneSentenceSummary:
      "Create a demand letter referencing QCAT's minor civil dispute process and Queensland consumer protection law.",
    keyFacts: [
      'QCAT handles minor civil disputes up to $25,000, including consumer and trader claims.',
      'Claims under $7,500 use a simplified "minor civil dispute" process at QCAT.',
      'Larger debt recovery claims go to the Magistrates Court of Queensland.',
      'QCAT can also hear tree and fencing disputes between neighbours.',
      'Lawyers generally cannot represent parties in QCAT minor civil disputes.',
      'A written demand letter is good evidence that you attempted to resolve the matter.',
    ],
  },
  {
    slug: 'wa',
    code: 'WA',
    stateName: 'Western Australia',
    tribunalName: 'Magistrates Court of Western Australia',
    tribunalShort: 'Magistrates Court',
    tribunalUrl: 'https://www.magistratescourt.wa.gov.au',
    smallClaimsLimit: 10000,
    generalLimit: 75000,
    typicalTimeline: '8-16 weeks from filing to first hearing',
    smallClaimsUrl:
      'https://www.magistratescourt.wa.gov.au/L_magistrates-court/civil-jurisdiction/minor-case-claim-procedure.aspx',
    oneSentenceSummary:
      "Draft a demand letter citing WA's Magistrates Court jurisdiction -- the main venue for civil disputes in Western Australia.",
    keyFacts: [
      'WA does not have a general civil tribunal -- most civil claims go to the Magistrates Court.',
      'The Minor Case Claim procedure handles disputes up to $10,000 with simplified rules.',
      'General civil matters up to $75,000 are heard in the Magistrates Court.',
      'Consumer Protection WA offers free mediation before you go to court.',
      'The State Administrative Tribunal (SAT) handles some commercial and regulatory matters.',
      'Sending a formal demand letter is a recommended first step in most WA civil disputes.',
    ],
  },
  {
    slug: 'sa',
    code: 'SA',
    stateName: 'South Australia',
    tribunalName: 'South Australian Civil and Administrative Tribunal',
    tribunalShort: 'SACAT',
    tribunalUrl: 'https://www.sacat.sa.gov.au',
    smallClaimsLimit: 12000,
    generalLimit: 12000,
    typicalTimeline: '6-10 weeks from filing to first hearing',
    smallClaimsUrl: 'https://www.sacat.sa.gov.au/come-to-sacat/types-of-cases/civil',
    oneSentenceSummary:
      'Generate a demand letter for South Australian disputes, referencing SACAT or the Magistrates Court depending on your claim type.',
    keyFacts: [
      'SACAT handles minor civil matters up to $12,000 and all residential tenancy disputes.',
      'Civil claims above $12,000 go to the Magistrates Court of South Australia.',
      'The Magistrates Court has jurisdiction up to $100,000 for general civil matters.',
      'Consumer and Business Services SA offers conciliation before tribunal proceedings.',
      'SACAT hearings are designed to be accessible without a lawyer.',
      'A formal demand letter demonstrates you tried to resolve the dispute before filing.',
    ],
  },
  {
    slug: 'tas',
    code: 'TAS',
    stateName: 'Tasmania',
    tribunalName: 'Magistrates Court of Tasmania',
    tribunalShort: 'Magistrates Court',
    tribunalUrl: 'https://www.magistratescourt.tas.gov.au',
    smallClaimsLimit: 5000,
    generalLimit: 50000,
    typicalTimeline: '8-12 weeks from filing to first hearing',
    smallClaimsUrl: 'https://www.magistratescourt.tas.gov.au/going-to-court/small_claims',
    oneSentenceSummary:
      "Draft a demand letter tailored to Tasmanian law, referencing the Magistrates Court's minor civil claims process.",
    keyFacts: [
      'Tasmania does not have a civil tribunal -- most small claims go to the Magistrates Court.',
      'Minor civil claims up to $5,000 use a simplified procedure in the Magistrates Court.',
      'General civil jurisdiction covers disputes up to $50,000.',
      'The Consumer, Building and Occupational Services (CBOS) offers free conciliation first.',
      'Small claims hearings are designed for self-represented parties.',
      'A written demand letter before filing shows the court you acted in good faith.',
    ],
  },
  {
    slug: 'act',
    code: 'ACT',
    stateName: 'Australian Capital Territory',
    tribunalName: 'ACT Civil and Administrative Tribunal',
    tribunalShort: 'ACAT',
    tribunalUrl: 'https://www.acat.act.gov.au',
    smallClaimsLimit: 10000,
    generalLimit: 25000,
    typicalTimeline: '6-10 weeks from filing to first hearing',
    smallClaimsUrl: 'https://www.acat.act.gov.au/case-types/civil-disputes',
    oneSentenceSummary:
      "Create a demand letter citing ACT consumer law and ACAT's civil disputes jurisdiction, suitable for disputes in Canberra and the ACT.",
    keyFacts: [
      'ACAT handles civil disputes, consumer claims, and tenancy matters in the ACT.',
      'Small claims up to $10,000 use a simplified process with reduced filing fees.',
      'General civil disputes up to $25,000 are heard by ACAT.',
      'Debt recovery above $25,000 goes to the ACT Magistrates Court (jurisdiction to $250,000).',
      'ACAT encourages self-represented parties and limits legal representation at hearings.',
      'ACT Access Canberra provides free dispute resolution assistance before ACAT filing.',
    ],
  },
  {
    slug: 'nt',
    code: 'NT',
    stateName: 'Northern Territory',
    tribunalName: 'Northern Territory Civil and Administrative Tribunal',
    tribunalShort: 'NTCAT',
    tribunalUrl: 'https://www.ntcat.nt.gov.au',
    smallClaimsLimit: 25000,
    generalLimit: 25000,
    typicalTimeline: '6-12 weeks from filing to first hearing',
    smallClaimsUrl: 'https://www.ntcat.nt.gov.au/types-of-cases/civil',
    oneSentenceSummary:
      "Generate a demand letter referencing NTCAT's jurisdiction and NT consumer protection law, the right first step before filing in the Territory.",
    keyFacts: [
      'NTCAT handles consumer, tenancy, and minor civil matters up to $25,000.',
      'Debt recovery claims go to the Local Court of the Northern Territory.',
      'The Local Court has jurisdiction for civil claims up to $100,000.',
      'NT Consumer Affairs offers free conciliation before tribunal proceedings.',
      'NTCAT is designed to be accessible for self-represented parties.',
      'A written demand letter is considered best practice before any tribunal filing in the NT.',
    ],
  },
]

/** Lookup a jurisdiction by slug (case-insensitive). */
export function getJurisdictionBySlug(slug: string): JurisdictionLandingData | undefined {
  return JURISDICTION_LANDING_DATA.find(j => j.slug === slug.toLowerCase())
}

/** All slugs -- used by generateStaticParams. */
export const ALL_SLUGS = JURISDICTION_LANDING_DATA.map(j => j.slug)

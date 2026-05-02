// One blurb per state — placeholder text until reviewed by a lawyer.
// NOTE: These blurbs must be reviewed and approved by a lawyer before public launch.
export const NEXT_STEPS: Record<string, string> = {
  NSW: 'If you wish to pursue this matter further, people in this situation sometimes make an application to NCAT (NSW Civil and Administrative Tribunal). You should seek independent legal advice if you are unsure about your rights. Free legal help is available through LawAccess NSW: lawaccess.nsw.gov.au',
  VIC: 'If you wish to pursue this matter further, people in this situation sometimes make an application to VCAT (Victorian Civil and Administrative Tribunal). You should seek independent legal advice if you are unsure about your rights. Free legal help is available through Victoria Legal Aid: legalaid.vic.gov.au',
  QLD: 'If you wish to pursue this matter further, people in this situation sometimes make an application to QCAT (Queensland Civil and Administrative Tribunal). You should seek independent legal advice if you are unsure about your rights. Free legal help is available through Legal Aid Queensland: legalaid.qld.gov.au',
  WA: 'If you wish to pursue this matter further, people in this situation sometimes make an application to SAT (State Administrative Tribunal). You should seek independent legal advice if you are unsure about your rights. Free legal help is available through Legal Aid WA: legalaid.wa.gov.au',
  SA: 'If you wish to pursue this matter further, people in this situation sometimes make an application to SACAT (South Australian Civil and Administrative Tribunal). You should seek independent legal advice if you are unsure about your rights. Free legal help is available through Legal Services Commission SA: lsc.sa.gov.au',
  TAS: 'If you wish to pursue this matter further, people in this situation sometimes make an application to TASCAT. You should seek independent legal advice if you are unsure about your rights. Free legal help is available through Legal Aid Commission of Tasmania: legalaid.tas.gov.au',
  ACT: 'If you wish to pursue this matter further, people in this situation sometimes make an application to ACAT (ACT Civil and Administrative Tribunal). You should seek independent legal advice if you are unsure about your rights. Free legal help is available through Legal Aid ACT: legalaidact.org.au',
  NT: 'If you wish to pursue this matter further, people in this situation sometimes make an application to the Local Court of the Northern Territory. You should seek independent legal advice if you are unsure about your rights. Free legal help is available through NAAJA (North Australian Aboriginal Justice Agency).',
}

// PLACEHOLDER — awaiting lawyer review before launch.
// Must be reviewed and approved by a qualified Australian lawyer before this doc type is exposed to public traffic.
const CEASE_AND_DESIST_NEXT_STEPS = `
If the recipient stops the specified conduct by the deadline, no further action is needed. If the conduct continues, people in this situation sometimes seek independent legal advice about further options, which may include applying for an injunction or commencing a civil claim. Free legal help is available through your state legal aid commission.

This is not legal advice. The next steps that apply to your specific situation depend on the type of conduct and your jurisdiction.
`

const NEXT_STEPS_FALLBACK = 'If you wish to pursue this matter further, you should seek independent legal advice or contact your state legal aid office for guidance.'

export function getNextSteps(state: string, category?: string): string {
  if (category === 'Cease & Desist') return CEASE_AND_DESIST_NEXT_STEPS
  return NEXT_STEPS[state] ?? NEXT_STEPS_FALLBACK
}

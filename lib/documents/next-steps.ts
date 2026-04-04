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

export function getNextSteps(state: string): string {
  return NEXT_STEPS[state] ?? 'If you wish to pursue this matter further, you should seek independent legal advice or contact your state legal aid office for guidance.'
}

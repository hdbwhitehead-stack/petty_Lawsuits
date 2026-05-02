import type { DocumentTemplate } from '@/lib/documents/templates'
import { parseStateFromLocation, getJurisdiction } from '@/lib/documents/jurisdiction'
import type { DisputeType } from '@/lib/documents/jurisdiction'

export function buildGenerationPrompt(
  template: DocumentTemplate,
  wizardAnswers: Record<string, string>,
  evidenceFilenames: string[]
): string {
  const answersText = Object.entries(wizardAnswers)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')

  const evidenceContext = evidenceFilenames.length > 0
    ? `\nThe user has attached the following evidence files: ${evidenceFilenames.join(', ')}`
    : ''

  const fields = template.fields.map(f => `"${f.key}": "${f.label}"`).join('\n')

  // Cease & desist letters are not filed with a tribunal — use a different prompt body
  if (template.category === 'Cease & Desist') {
    return `You are generating a formal Australian cease & desist letter sent under personal authority (not under a tribunal application). The recipient is being asked to stop a specified course of conduct. Do not reference any tribunal or court as the filing body. The letter is sent privately.

User's situation details:
${answersText}${evidenceContext}

Generate values for each of the following document fields. Return ONLY a valid JSON object with these exact keys. Do not include any explanation, preamble, or markdown formatting — just the JSON object.

Required fields:
${fields}

Rules:
- Use formal, professional Australian English. The tone is firm but not threatening.
- Frame demands in terms of stopping the conduct, not seeking damages or filing claims.
- Where the user has provided a deadline (cease_deadline_days), use it; otherwise default to 14 days from today.
- Where the user has not provided enough detail, use a placeholder like [INSERT X] rather than inventing facts.
- The 'consequences' field should mention that the sender reserves the right to take further action (without naming a specific tribunal or claim type) and that they may seek independent legal advice.
- Do not provide legal advice. Do not promise a specific legal outcome.
- All fields must be present in your response`
  }

  const location = wizardAnswers.location ?? ''
  const state = parseStateFromLocation(location) ?? 'Unknown'
  const jurisdiction = getJurisdiction(state, template.id as DisputeType)

  const bodyName = jurisdiction?.body ?? 'the relevant state tribunal'
  const limit = jurisdiction
    ? `$${jurisdiction.smallClaimsLimit.toLocaleString()} (small claims) / $${jurisdiction.generalLimit.toLocaleString()} (general limit)`
    : 'unknown'
  const jurisdictionNotes = jurisdiction?.notes ?? ''

  return `You are generating a formal Australian legal document of type: ${template.label}.

The user is located in: ${state} (${location}). For this type of dispute in ${state}, the relevant body is: ${bodyName}.
Jurisdictional thresholds: ${limit}.
${jurisdictionNotes ? `Additional context: ${jurisdictionNotes}` : ''}

User's situation details:
${answersText}${evidenceContext}

Generate values for each of the following document fields. Return ONLY a valid JSON object with these exact keys. Do not include any explanation, preamble, or markdown formatting — just the JSON object.

Required fields:
${fields}

Rules:
- Use formal, professional Australian English
- Reference ${bodyName} as the relevant filing body (not a generic tribunal name)
- Include the correct jurisdictional thresholds for ${state} when relevant
- Do not invent facts not provided by the user
- Where information is missing, use a placeholder like [INSERT X]
- All fields must be present in your response`
}

export const SYSTEM_PROMPT = `You are a document drafting assistant for an Australian legal document generation service. You produce structured field values for legal document templates. You do not provide legal advice. You produce formal, accurate document content based only on the information provided. You are aware that different dispute types are handled by different courts and tribunals in each Australian state and territory — always reference the correct body for the dispute type and jurisdiction.`

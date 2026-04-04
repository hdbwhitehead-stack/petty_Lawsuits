import type { DocumentTemplate } from '@/lib/documents/templates'
import { STATE_TRIBUNAL, parseStateFromLocation } from '@/lib/documents/jurisdiction'

export function buildGenerationPrompt(
  template: DocumentTemplate,
  wizardAnswers: Record<string, string>,
  evidenceFilenames: string[]
): string {
  const location = wizardAnswers.location ?? ''
  const state = parseStateFromLocation(location) ?? 'Unknown'
  const tribunal = STATE_TRIBUNAL[state] ?? 'the relevant state tribunal'

  const answersText = Object.entries(wizardAnswers)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')

  const evidenceContext = evidenceFilenames.length > 0
    ? `\nThe user has attached the following evidence files: ${evidenceFilenames.join(', ')}`
    : ''

  return `You are generating a formal Australian legal document of type: ${template.label}.

The user is located at: ${location}. The relevant tribunal in this jurisdiction is ${tribunal}.

User's situation details:
${answersText}${evidenceContext}

Generate values for each of the following document fields. Return ONLY a valid JSON object with these exact keys. Do not include any explanation, preamble, or markdown formatting — just the JSON object.

Required fields:
${template.fields.map(f => `"${f.key}": "${f.label}"`).join('\n')}

Rules:
- Use formal, professional Australian English
- Do not invent facts not provided by the user
- Where information is missing, use a placeholder like [INSERT X]
- All fields must be present in your response`
}

export const SYSTEM_PROMPT = `You are a document drafting assistant for an Australian legal document generation service. You produce structured field values for legal document templates. You do not provide legal advice. You produce formal, accurate document content based only on the information provided.`

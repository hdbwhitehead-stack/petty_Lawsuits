import Anthropic from '@anthropic-ai/sdk'
import { buildGenerationPrompt, SYSTEM_PROMPT } from './prompts'
import type { DocumentTemplate } from '@/lib/documents/templates'

const client = new Anthropic()

export async function generateDocument(
  template: DocumentTemplate,
  wizardAnswers: Record<string, string>,
  evidenceFilenames: string[]
): Promise<Record<string, string>> {
  const prompt = buildGenerationPrompt(template, wizardAnswers, evidenceFilenames)

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }],
  })

  let raw = (message.content[0] as { type: string; text: string }).text.trim()

  // Strip markdown code fences if Claude wrapped the JSON
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenceMatch) {
    raw = fenceMatch[1].trim()
  }

  let parsed: Record<string, string>

  try {
    parsed = JSON.parse(raw)
  } catch {
    console.error('Claude raw response:', raw)
    throw new Error('Claude returned malformed JSON')
  }

  // Validate all required fields are present
  const missing = template.fields
    .map(f => f.key)
    .filter(key => !parsed[key] || parsed[key].trim() === '')

  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`)
  }

  return parsed
}

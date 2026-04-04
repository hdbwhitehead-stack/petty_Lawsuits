import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function enhanceNarrative(rawDescription: string): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    system: `You are helping a person write a formal incident description for an Australian legal demand letter.
Rewrite their description in clear, formal, professional language suitable for a legal document.
Preserve all facts exactly — do not add, remove, or invent any details.
Return only the rewritten description, no preamble.`,
    messages: [{ role: 'user', content: rawDescription }],
  })
  return (message.content[0] as { type: string; text: string }).text.trim()
}

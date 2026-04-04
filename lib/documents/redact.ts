// Returns a redacted version of document content suitable for preview.
// Shows the first 150 words (or the entire first field if longer), replaces the rest.
export function redactContent(
  content: Record<string, string>,
  fields: { key: string; label: string }[]
): Record<string, string> {
  const result: Record<string, string> = {}
  let wordsShown = 0
  const TARGET_WORDS = 150

  for (const field of fields) {
    const value = content[field.key] ?? ''
    if (wordsShown >= TARGET_WORDS) {
      result[field.key] = '████████████████████████████'
      continue
    }
    const words = value.split(/\s+/).length
    if (wordsShown + words <= TARGET_WORDS) {
      result[field.key] = value
      wordsShown += words
    } else {
      // Show partial field up to word limit
      const allowed = TARGET_WORDS - wordsShown
      const partial = value.split(/\s+/).slice(0, allowed).join(' ')
      result[field.key] = partial + ' ████████████████'
      wordsShown = TARGET_WORDS
    }
  }

  return result
}

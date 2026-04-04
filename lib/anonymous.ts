const KEY = 'petty_anon_doc_key'

export function getOrCreateAnonKey(): string {
  if (typeof window === 'undefined') return ''
  let key = localStorage.getItem(KEY)
  if (!key) {
    key = crypto.randomUUID()
    localStorage.setItem(KEY, key)
  }
  return key
}

export function clearAnonKey() {
  localStorage.removeItem(KEY)
}

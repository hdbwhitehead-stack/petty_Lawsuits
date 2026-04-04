import type { SupabaseClient } from '@supabase/supabase-js'

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

export function getAnonKey(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(KEY)
}

export function clearAnonKey() {
  localStorage.removeItem(KEY)
}

/** Claim an anonymous document by assigning it to the given user. Returns the document id or null. */
export async function claimAnonDocument(
  supabase: SupabaseClient,
  userId: string
): Promise<string | null> {
  if (typeof window === 'undefined') return null
  const key = localStorage.getItem(KEY)
  if (!key) return null

  const { data } = await supabase
    .from('documents')
    .update({ user_id: userId, anonymous_key: null })
    .eq('anonymous_key', key)
    .is('user_id', null)
    .select('id')
    .single()

  if (data?.id) {
    clearAnonKey()
    return data.id
  }
  return null
}

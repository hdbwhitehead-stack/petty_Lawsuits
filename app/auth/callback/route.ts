import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const anonKey = searchParams.get('anon_key')

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Claim any anonymous document associated with this signup
      if (anonKey) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await supabase
            .from('documents')
            .update({ user_id: user.id, anonymous_key: null })
            .eq('anonymous_key', anonKey)
            .is('user_id', null)
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=verification_failed`)
}

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function DELETE() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = user.id

  // Delete user data in dependency order
  await supabase.from('documents').delete().eq('user_id', userId)
  await supabase.from('generation_attempts').delete().eq('user_id', userId)
  await supabase.from('subscriptions').delete().eq('user_id', userId)

  // Delete the auth user (requires service role)
  const adminClient = createAdminClient()
  const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId)

  if (deleteError) {
    console.error('Failed to delete auth user:', deleteError)
    return NextResponse.json({ error: 'Could not delete account. Please try again.' }, { status: 500 })
  }

  // Sign out
  await supabase.auth.signOut()

  return NextResponse.json({ success: true })
}

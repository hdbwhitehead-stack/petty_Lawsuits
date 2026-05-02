import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { sendDeadlineReminder } from '@/lib/email/resend'

function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function GET(request: NextRequest) {
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = createAdminClient()

  // Target documents whose deadline is exactly 1 or 2 days from now (UTC date)
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)

  const dayAfterTomorrow = new Date(today)
  dayAfterTomorrow.setUTCDate(dayAfterTomorrow.getUTCDate() + 2)

  const tomorrowStr = tomorrow.toISOString().slice(0, 10)
  const dayAfterTomorrowStr = dayAfterTomorrow.toISOString().slice(0, 10)

  // Fetch documents with deadline in (today+1, today+2) where reminder not yet sent
  // Join to auth.users via user_id to get email
  const { data: docs, error } = await supabase
    .from('documents')
    .select('id, user_id, response_deadline')
    .in('response_deadline', [tomorrowStr, dayAfterTomorrowStr])
    .is('deadline_reminder_sent_at', null)
    .not('user_id', 'is', null)
    .eq('status', 'ready')

  if (error) {
    console.error('deadline-reminders: query error', error)
    return NextResponse.json({ error: 'Query failed' }, { status: 500 })
  }

  if (!docs || docs.length === 0) {
    return NextResponse.json({ sent: 0 })
  }

  let sent = 0
  let failed = 0

  for (const doc of docs) {
    try {
      // Fetch user email via admin auth API
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(doc.user_id)
      if (userError || !userData?.user?.email) {
        console.error(`deadline-reminders: could not fetch user ${doc.user_id}`, userError)
        failed++
        continue
      }

      const email = userData.user.email
      const deadlineDate = new Date(doc.response_deadline)
      deadlineDate.setUTCHours(0, 0, 0, 0)
      const diffMs = deadlineDate.getTime() - today.getTime()
      const daysRemaining = Math.round(diffMs / (1000 * 60 * 60 * 24))

      await sendDeadlineReminder(email, doc.id, daysRemaining)

      // Mark reminder sent
      const { error: updateError } = await supabase
        .from('documents')
        .update({ deadline_reminder_sent_at: new Date().toISOString() })
        .eq('id', doc.id)

      if (updateError) {
        console.error(`deadline-reminders: failed to mark sent for doc ${doc.id}`, updateError)
      } else {
        sent++
      }
    } catch (err) {
      console.error(`deadline-reminders: error processing doc ${doc.id}`, err)
      failed++
    }
  }

  return NextResponse.json({ sent, failed })
}

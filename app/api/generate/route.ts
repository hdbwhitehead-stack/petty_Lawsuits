import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateDocument } from '@/lib/claude/generate'
import { getTemplate } from '@/lib/documents/templates'
import { parseStateFromLocation } from '@/lib/documents/jurisdiction'
import { sendDocumentReady } from '@/lib/email/resend'

export async function POST(req: NextRequest) {
  const { templateId, wizardAnswers, evidenceFilenames, anonymousKey } = await req.json()

  const template = getTemplate(templateId)
  if (!template) {
    return NextResponse.json({ error: 'Unknown template' }, { status: 400 })
  }

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Rate limit: 10 generation attempts per user per 24h
  if (user) {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { count } = await supabase
      .from('generation_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', since)

    if ((count ?? 0) >= 10) {
      return NextResponse.json(
        { error: 'Generation limit reached. Try again tomorrow.' },
        { status: 429 }
      )
    }
  }

  // Derive state from location
  const location = wizardAnswers?.location ?? ''
  const state = parseStateFromLocation(location) ?? 'Unknown'

  // Create document row in pending state
  const { data: doc, error: insertError } = await supabase
    .from('documents')
    .insert({
      user_id: user?.id ?? null,
      anonymous_key: user ? null : anonymousKey,
      state,
      category: template.category,
      status: 'generating',
    })
    .select()
    .single()

  if (insertError || !doc) {
    console.error('Document insert error:', insertError)
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 })
  }

  // Generate with Claude
  let content: Record<string, string> | undefined
  let attempts = 0

  while (attempts < 3) {
    try {
      content = await generateDocument(template, wizardAnswers, evidenceFilenames ?? [])
      break
    } catch (err) {
      console.error(`Generation attempt ${attempts + 1} failed:`, err)
      attempts++
      if (attempts >= 3) {
        await supabase
          .from('documents')
          .update({ status: 'permanently_failed' })
          .eq('id', doc.id)

        return NextResponse.json(
          { error: 'Document generation failed. Please contact support.' },
          { status: 500 }
        )
      }
    }
  }

  // Calculate response deadline: 14 days from now
  const responseDeadline = new Date()
  responseDeadline.setDate(responseDeadline.getDate() + 14)
  const responseDeadlineDate = responseDeadline.toISOString().slice(0, 10)

  // Save generated content
  await supabase
    .from('documents')
    .update({
      status: 'ready',
      original_content: content!,
      current_content: content!,
      response_deadline: responseDeadlineDate,
    })
    .eq('id', doc.id)

  // Send document-ready email (fire-and-forget)
  if (user?.email) {
    sendDocumentReady(user.email, doc.id).catch((err) =>
      console.error('sendDocumentReady failed:', err)
    )
  }

  // Record attempt for rate limiting
  if (user) {
    await supabase
      .from('generation_attempts')
      .insert({ user_id: user.id })
  }

  return NextResponse.json({ documentId: doc.id })
}

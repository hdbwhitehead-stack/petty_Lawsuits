import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getTemplate } from '@/lib/documents/templates'
import { parseStateFromLocation } from '@/lib/documents/jurisdiction'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const body = await req.json()
  const { templateId, wizardAnswers, currentStep, state: stateParam } = body

  if (!templateId || typeof templateId !== 'string') {
    return NextResponse.json({ error: 'templateId is required' }, { status: 400 })
  }

  const template = getTemplate(templateId)
  if (!template) {
    return NextResponse.json({ error: 'Unknown template' }, { status: 400 })
  }

  // Derive Australian state from location answer if not passed explicitly
  const location = wizardAnswers?.location ?? ''
  const state = stateParam ?? parseStateFromLocation(location) ?? null

  const draftContent = {
    _draft: true,
    _templateId: templateId,
    _currentStep: currentStep ?? 0,
    ...wizardAnswers,
  }

  // Check if user already has a draft for this category
  const { data: existing } = await supabase
    .from('documents')
    .select('id')
    .eq('user_id', user.id)
    .eq('category', template.category)
    .eq('status', 'draft')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (existing) {
    // Update existing draft
    const { error } = await supabase
      .from('documents')
      .update({
        current_content: draftContent,
        state: state ?? undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Draft update error:', error)
      return NextResponse.json({ error: 'Failed to save draft' }, { status: 500 })
    }

    return NextResponse.json({ documentId: existing.id, created: false })
  }

  // Create new draft
  const { data: doc, error } = await supabase
    .from('documents')
    .insert({
      user_id: user.id,
      anonymous_key: null,
      state,
      category: template.category,
      status: 'draft',
      unlocked: false,
      current_content: draftContent,
    })
    .select('id')
    .single()

  if (error || !doc) {
    console.error('Draft insert error:', error)
    return NextResponse.json({ error: 'Failed to save draft' }, { status: 500 })
  }

  return NextResponse.json({ documentId: doc.id, created: true })
}

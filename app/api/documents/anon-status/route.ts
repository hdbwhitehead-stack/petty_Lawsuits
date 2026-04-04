import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 })

  const supabase = createClient()

  const { data: doc } = await supabase
    .from('documents')
    .select('id, status')
    .eq('anonymous_key', key)
    .is('user_id', null)
    .single()

  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Only return id and status — never document content
  return NextResponse.json({ id: doc.id, status: doc.status })
}

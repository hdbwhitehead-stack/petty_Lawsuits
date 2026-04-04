import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { TEMPLATES } from '@/lib/documents/templates'
import { generatePDF, generateWord } from '@/lib/documents/export'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const format = req.nextUrl.searchParams.get('format') === 'word' ? 'word' : 'pdf'

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { data: doc } = await supabase
    .from('documents')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .eq('unlocked', true)
    .single()

  if (!doc) {
    return NextResponse.json({ error: 'Document not found or not unlocked' }, { status: 404 })
  }

  const template = TEMPLATES.find(t => t.category === doc.category) ?? TEMPLATES[0]
  const content = (doc.current_content ?? {}) as Record<string, string>

  const buffer = format === 'word'
    ? await generateWord(template, content)
    : await generatePDF(template, content)

  const filename = `${template.label.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.${format === 'word' ? 'docx' : 'pdf'}`
  const contentType = format === 'word'
    ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    : 'application/pdf'

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}

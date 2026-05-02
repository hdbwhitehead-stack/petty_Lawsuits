import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TEMPLATES } from '@/lib/documents/templates'
import { DocumentEditor } from '@/components/document/DocumentEditor'
import NextStepsPanel from '@/components/document/NextStepsPanel'
import { StickerButton } from '@/components/ui/StickerButton'
import type { DisputeType } from '@/lib/documents/jurisdiction'

type Props = {
  params: { documentId: string }
}

export default async function DocumentPage({ params }: Props) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: doc } = await supabase
    .from('documents')
    .select('*')
    .eq('id', params.documentId)
    .eq('user_id', user.id)
    .single()

  if (!doc) {
    return (
      <main className="max-w-2xl mx-auto py-20 px-6 text-center">
        <h1 className="font-display font-extrabold text-3xl mb-6">Document not found</h1>
        <StickerButton as={Link} href="/dashboard" variant="ghost" size="sm">
          ← Back to my cases
        </StickerButton>
      </main>
    )
  }

  if (!doc.unlocked) {
    redirect(`/preview/${params.documentId}`)
  }

  const template = TEMPLATES.find(t => t.category === doc.category) ?? TEMPLATES[0]
  const currentContent = (doc.current_content ?? {}) as Record<string, string>
  const originalContent = (doc.original_content ?? {}) as Record<string, string>

  return (
    <main className="max-w-3xl mx-auto py-12 px-6">
      <div className="mb-8">
        <StickerButton as={Link} href="/dashboard" variant="ghost" size="sm">
          ← Back to my cases
        </StickerButton>
        <h1 className="font-display font-extrabold text-3xl mt-5 mb-1">{template.label}</h1>
        <p className="text-muted text-sm">Edit the fields below, then fire it off.</p>
      </div>

      <DocumentEditor
        documentId={params.documentId}
        template={template}
        currentContent={currentContent}
        originalContent={originalContent}
      />

      {doc.state && (
        <div className="mt-12">
          <NextStepsPanel
            state={doc.state}
            disputeType={template.id as DisputeType}
            category={doc.category}
          />
        </div>
      )}
    </main>
  )
}

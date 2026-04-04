import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TEMPLATES } from '@/lib/documents/templates'
import { DocumentEditor } from '@/components/document/DocumentEditor'
import NextStepsPanel from '@/components/document/NextStepsPanel'
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
        <h1 className="text-2xl font-bold mb-4">Document not found</h1>
        <a href="/dashboard" className="underline text-[var(--accent)]">Back to dashboard</a>
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
    <main className="max-w-3xl mx-auto py-10 px-6">
      <div className="mb-8">
        <a href="/dashboard" className="text-sm text-[var(--muted)] hover:text-[var(--accent)]">
          ← Back to dashboard
        </a>
        <h1 className="text-2xl font-bold mt-3 text-[var(--foreground)]">{template.label}</h1>
        <p className="text-[var(--muted)] text-sm mt-1">
          Edit the fields below, then download your document.
        </p>
      </div>

      <DocumentEditor
        documentId={params.documentId}
        template={template}
        currentContent={currentContent}
        originalContent={originalContent}
      />

      {doc.state && (
        <div className="mt-10">
          <NextStepsPanel state={doc.state} disputeType={template.id as DisputeType} />
        </div>
      )}
    </main>
  )
}

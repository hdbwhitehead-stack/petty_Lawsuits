import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { redactContent } from '@/lib/documents/redact'
import { TEMPLATES } from '@/lib/documents/templates'
import PreviewShell from '@/components/payment/PreviewShell'
import UnlockModal from '@/components/payment/UnlockModal'
import UnlockWatcher from './UnlockWatcher'

type Props = {
  params: { documentId: string }
  searchParams: { payment?: string }
}

export default async function PreviewPage({ params, searchParams }: Props) {
  const supabase = createClient()

  const { data: doc } = await supabase
    .from('documents')
    .select('*')
    .eq('id', params.documentId)
    .single()

  if (!doc) {
    return (
      <main className="max-w-2xl mx-auto mt-20 p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Document not found</h1>
        <a href="/wizard" className="underline">Create a new document</a>
      </main>
    )
  }

  if (doc.unlocked) {
    redirect(`/document/${doc.id}`)
  }

  // Find the template to get field definitions
  const template = TEMPLATES.find(t => t.category === doc.category) ?? TEMPLATES[0]
  const content = doc.current_content as Record<string, string> ?? {}
  const redacted = redactContent(content, template.fields)

  // Try to extract a recipient name from the content
  const recipientName =
    content.debtor_name ?? content.business_name ?? content.landlord_name ?? 'the recipient'

  const paymentSuccess = searchParams.payment === 'success'

  return (
    <div className="relative min-h-screen bg-gray-50 py-10">
      <PreviewShell content={redacted} fields={template.fields} category={doc.category} />

      {paymentSuccess ? (
        <UnlockWatcher documentId={doc.id} />
      ) : (
        <UnlockModal documentId={doc.id} recipientName={recipientName} />
      )}
    </div>
  )
}

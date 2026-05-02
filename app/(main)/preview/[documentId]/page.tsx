import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { redactContent } from '@/lib/documents/redact'
import { TEMPLATES } from '@/lib/documents/templates'
import PreviewShell from '@/components/payment/PreviewShell'
import UnlockModal from '@/components/payment/UnlockModal'
import UnlockWatcher from './UnlockWatcher'
import NextStepsPanel from '@/components/document/NextStepsPanel'

type Props = {
  params: { documentId: string }
  searchParams: { payment?: string; from?: string }
}

export default async function PreviewPage({ params, searchParams }: Props) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch document — anonymous docs are accessible by UUID, owned docs only by their owner
  const query = supabase
    .from('documents')
    .select('*')
    .eq('id', params.documentId)

  if (user) {
    // Logged-in: allow their own docs or unclaimed anonymous docs
    query.or(`user_id.eq.${user.id},user_id.is.null`)
  } else {
    // Not logged in: only allow unclaimed anonymous docs
    query.is('user_id', null)
  }

  const { data: doc } = await query.single()

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

  const template = TEMPLATES.find(t => t.category === doc.category) ?? TEMPLATES[0]
  const disputeType = template.id
  const content = doc.current_content as Record<string, string> ?? {}
  const redacted = redactContent(content, template.fields)

  const recipientName =
    content.debtor_name ?? content.business_name ?? content.landlord_name ?? 'the recipient'

  const paymentSuccess = searchParams.payment === 'success'

  return (
    <div className="relative min-h-screen bg-[var(--background)] py-10">
      <PreviewShell content={redacted} fields={template.fields} category={doc.category} />

      <div className="max-w-2xl mx-auto mt-8 px-6">
        <NextStepsPanel state={doc.state} disputeType={disputeType} />
      </div>

      {paymentSuccess ? (
        <UnlockWatcher documentId={doc.id} />
      ) : (
        <UnlockModal
          documentId={doc.id}
          recipientName={recipientName}
          isAuthenticated={!!user}
        />
      )}
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-[var(--accent-light)] text-[var(--accent)] border-[var(--accent)]',
  ready: 'bg-green-50 text-green-700 border-green-200',
  generating: 'bg-[var(--accent-light)] text-[var(--accent)] border-[var(--accent)]',
  failed: 'bg-red-50 text-red-600 border-red-200',
  permanently_failed: 'bg-red-50 text-red-600 border-red-200',
}

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  ready: 'Ready',
  generating: 'Generating',
  failed: 'Failed',
  permanently_failed: 'Failed',
}

function getDisplayStatus(doc: { status: string; unlocked: boolean }) {
  if (doc.status === 'ready' && !doc.unlocked) return 'draft'
  return doc.status
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getDaysRemaining(deadlineDateString: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const deadline = new Date(deadlineDateString)
  deadline.setHours(0, 0, 0, 0)
  return Math.round((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function DeadlineBadge({ deadline }: { deadline: string }) {
  const days = getDaysRemaining(deadline)
  if (days < 0) {
    return (
      <span className="text-xs px-2.5 py-1 rounded-full border font-medium bg-gray-50 text-gray-500 border-gray-200">
        Deadline passed
      </span>
    )
  }
  const urgent = days <= 2
  return (
    <span
      className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
        urgent
          ? 'bg-red-50 text-red-600 border-red-200'
          : 'bg-amber-50 text-amber-700 border-amber-200'
      }`}
    >
      {days === 0 ? 'Due today' : days === 1 ? '1 day left' : `${days} days left`}
    </span>
  )
}

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: documents } = await supabase
    .from('documents')
    .select('id, state, category, status, unlocked, created_at, current_content, response_deadline')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const docs = documents ?? []

  return (
    <main className="max-w-4xl mx-auto px-6 py-20 md:py-24">
      <h1 className="text-3xl md:text-4xl mb-2">Your documents</h1>
      <p className="text-base text-[var(--muted)] mb-10">
        Manage and access all your generated legal documents.
      </p>

      {docs.length === 0 ? (
        <div className="border border-[var(--border)] rounded-lg p-10 md:p-14 bg-[var(--card)] text-center">
          <p className="text-lg mb-2">No documents yet</p>
          <p className="text-base text-[var(--muted)] mb-8">
            Create your first demand letter or complaint in a few minutes.
          </p>
          <Link
            href="/wizard"
            className="inline-block bg-[var(--foreground)] text-white text-base font-medium rounded-full px-8 py-3 hover:opacity-90 transition-opacity"
          >
            Create a document
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {docs.map((doc) => {
            const href = doc.status === 'draft'
              ? `/wizard?draft=${doc.id}`
              : doc.unlocked
              ? `/document/${doc.id}?from=dashboard`
              : `/preview/${doc.id}?from=dashboard`

            const content = (doc.current_content ?? {}) as Record<string, string>
            const recipient =
              content.debtor_name ?? content.business_name ?? content.landlord_name ?? content.employer_name ?? null

            const displayStatus = getDisplayStatus(doc)

            return (
              <Link
                key={doc.id}
                href={href}
                className="block border border-[var(--border)] rounded-lg p-6 bg-[var(--card)] hover:border-[var(--accent)] transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-medium text-[var(--foreground)]">
                      {recipient ? `Demand Letter — ${recipient}` : doc.category}
                    </p>
                    <p className="text-sm text-[var(--muted)] mt-1">
                      {doc.category}{doc.state ? ` · ${doc.state}` : ''} &middot; {formatDate(doc.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.unlocked && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent)]/20 font-medium">
                        Unlocked
                      </span>
                    )}
                    {doc.response_deadline && doc.status === 'ready' && (
                      <DeadlineBadge deadline={doc.response_deadline} />
                    )}
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
                        STATUS_STYLES[displayStatus] ?? 'bg-gray-50 text-gray-500 border-gray-200'
                      }`}
                    >
                      {STATUS_LABELS[displayStatus] ?? displayStatus}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}

          <div className="pt-6 text-center">
            <Link
              href="/wizard"
              className="inline-block bg-[var(--foreground)] text-white text-base font-medium rounded-full px-8 py-3 hover:opacity-90 transition-opacity"
            >
              Create another document
            </Link>
          </div>
        </div>
      )}
    </main>
  )
}

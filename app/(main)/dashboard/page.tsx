import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PettyMeter } from '@/components/ui/PettyMeter'
import { Stamp } from '@/components/ui/Stamp'
import { Highlight } from '@/components/ui/Highlight'
import { StickerButton } from '@/components/ui/StickerButton'

type Doc = {
  id: string
  state: string | null
  category: string
  status: string
  unlocked: boolean
  created_at: string
  current_content: unknown
  response_deadline: string | null
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getDaysRemaining(dateString: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const deadline = new Date(dateString)
  deadline.setHours(0, 0, 0, 0)
  return Math.round((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function getPettyMeterValue(status: string, unlocked: boolean): number {
  if (status === 'draft' || status === 'generating') return 0.05
  if (status === 'ready' && !unlocked) return 0.25
  if (status === 'ready' && unlocked) return 0.65
  if (status === 'resolved') return 1.0
  return 0.05
}

function getCaseStatus(status: string, unlocked: boolean): { label: string; bg: string; color: string } {
  if (status === 'draft') return { label: 'Draft', bg: 'var(--lemon)', color: 'var(--foreground)' }
  if (status === 'generating') return { label: 'Generating…', bg: 'var(--lemon)', color: 'var(--foreground)' }
  if (status === 'ready' && !unlocked) return { label: 'Ready to send', bg: 'var(--sky-tint)', color: 'var(--foreground)' }
  if (status === 'ready' && unlocked) return { label: 'Sent · awaiting reply', bg: 'var(--grass-tint)', color: 'var(--foreground)' }
  if (status === 'resolved') return { label: 'Resolved ✓', bg: 'var(--grass)', color: '#fff' }
  if (status === 'failed' || status === 'permanently_failed') return { label: 'Failed', bg: '#fef2f2', color: '#dc2626' }
  return { label: status, bg: 'var(--border)', color: 'var(--muted)' }
}

function DeadlineTag({ deadline }: { deadline: string }) {
  const days = getDaysRemaining(deadline)
  if (days < 0) {
    return (
      <span
        className="text-xs font-bold px-2.5 py-1"
        style={{
          background: 'var(--background)',
          color: 'var(--muted)',
          border: '2px solid var(--foreground)',
          borderRadius: 999,
          boxShadow: '2px 2px 0 #1A1814',
        }}
      >
        Deadline passed
      </span>
    )
  }
  const urgent = days <= 2
  return (
    <span
      className="text-xs font-bold px-2.5 py-1"
      style={{
        background: urgent ? '#fef2f2' : 'var(--lemon-tint)',
        color: urgent ? '#dc2626' : 'var(--foreground)',
        border: '2px solid var(--foreground)',
        borderRadius: 999,
        boxShadow: '2px 2px 0 #1A1814',
      }}
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

  const docs = (documents ?? []) as Doc[]

  return (
    <main className="max-w-4xl mx-auto px-6 py-20 md:py-24">

      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold">
            My <Highlight>Cases</Highlight>
          </h1>
          <p className="text-base text-[var(--muted)] mt-2">
            {docs.length === 0
              ? 'No cases yet — time to get petty.'
              : `${docs.length} case${docs.length === 1 ? '' : 's'} on file.`}
          </p>
        </div>
        <StickerButton as={Link} href="/wizard" variant="primary" size="sm">
          + Sue someone
        </StickerButton>
      </div>

      {/* Empty state */}
      {docs.length === 0 ? (
        <div
          style={{
            background: 'var(--card)',
            border: '2px solid var(--foreground)',
            borderRadius: 20,
            boxShadow: '5px 5px 0 #1A1814',
            padding: '48px 40px',
            textAlign: 'center',
          }}
        >
          <p
            className="text-2xl mb-2"
            style={{ fontFamily: 'var(--font-marker)', color: 'var(--muted)' }}
          >
            nothing to see here ✦
          </p>
          <p className="text-base text-[var(--muted)] mb-8">
            Create your first demand letter. Takes about 5 minutes.
          </p>
          <StickerButton as={Link} href="/wizard" variant="primary" size="md">
            Sue someone
          </StickerButton>
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
            const recipient = content.debtor_name ?? content.business_name ?? content.landlord_name ?? content.employer_name ?? null
            const amount = content.amount ?? content.claim_amount ?? content.damages_sought ?? null
            const meterValue = getPettyMeterValue(doc.status, doc.unlocked)
            const caseStatus = getCaseStatus(doc.status, doc.unlocked)
            const isResolved = doc.status === 'resolved'

            return (
              <Link
                key={doc.id}
                href={href}
                className="block relative"
                style={{
                  background: 'var(--card)',
                  border: '2px solid var(--foreground)',
                  borderRadius: 16,
                  boxShadow: '3px 3px 0 #1A1814',
                  padding: '20px 24px',
                }}
              >
                {/* WON stamp for resolved cases */}
                {isResolved && (
                  <div className="absolute top-4 right-4">
                    <Stamp size={60} rotate={-8} color="var(--grass)">WON</Stamp>
                  </div>
                )}

                {/* Card header */}
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div className="min-w-0 pr-16">
                    <p className="text-base font-bold text-[var(--foreground)] truncate">
                      {recipient ? `v ${recipient}` : doc.category}
                    </p>
                    <p className="text-xs text-[var(--muted)] mt-0.5">
                      {doc.category} · {formatDate(doc.created_at)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                    {doc.state && (
                      <span
                        className="text-xs font-bold uppercase tracking-wider px-2.5 py-1"
                        style={{
                          background: 'var(--sky-tint)',
                          border: '2px solid var(--foreground)',
                          borderRadius: 999,
                          boxShadow: '2px 2px 0 #1A1814',
                        }}
                      >
                        {doc.state}
                      </span>
                    )}
                    <span
                      className="text-xs font-bold px-2.5 py-1"
                      style={{
                        background: caseStatus.bg,
                        color: caseStatus.color,
                        border: '2px solid var(--foreground)',
                        borderRadius: 999,
                        boxShadow: '2px 2px 0 #1A1814',
                      }}
                    >
                      {caseStatus.label}
                    </span>
                    {doc.response_deadline && doc.status === 'ready' && (
                      <DeadlineTag deadline={doc.response_deadline} />
                    )}
                  </div>
                </div>

                {/* Amount */}
                {amount && (
                  <p className="font-display font-extrabold text-2xl mb-4">
                    <Highlight color="var(--lemon)">{amount}</Highlight>
                  </p>
                )}

                {/* Petty Meter */}
                <PettyMeter value={meterValue} label="Case progress" />
              </Link>
            )
          })}

          <div className="pt-4 flex justify-center">
            <StickerButton as={Link} href="/wizard" variant="ink" size="md">
              + Sue someone else
            </StickerButton>
          </div>
        </div>
      )}
    </main>
  )
}

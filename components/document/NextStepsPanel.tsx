import { getFormsForDispute, isStale, type CourtForm, type FormFormat } from '@/lib/documents/court-forms'
import { getJurisdiction } from '@/lib/documents/jurisdiction'
import { getNextSteps } from '@/lib/documents/next-steps'

type Props = {
  state: string
  disputeType: string
  category?: string
}

function formatBadge(format: FormFormat) {
  if (format === 'online' || format === 'online+pdf') {
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent-light)] text-[var(--foreground)]">
        {format === 'online' ? 'Online' : 'Online + PDF'}
      </span>
    )
  }
  return (
    <span className="text-xs px-2 py-0.5 rounded-full border border-[var(--border)] text-[var(--muted)]">
      {format === 'pdf' ? 'PDF' : format === 'pdf-fillable' ? 'PDF (fillable)' : 'Word'}
    </span>
  )
}

export default function NextStepsPanel({ state, disputeType, category }: Props) {
  // Cease & desist letters don't escalate to a tribunal — show the C&D-specific blurb and hide court forms
  if (category === 'Cease & Desist') {
    const blurb = getNextSteps(state, category)
    return (
      <section className="border border-[var(--border)] rounded-lg p-6 md:p-8 bg-[var(--card)]">
        <h2 className="text-xl md:text-2xl mb-1">If they don&rsquo;t stop</h2>
        <p className="text-sm text-[var(--muted)] whitespace-pre-line">{blurb.trim()}</p>
      </section>
    )
  }

  const forms = getFormsForDispute(state, disputeType)
  const jurisdiction = getJurisdiction(state, disputeType as Parameters<typeof getJurisdiction>[1])

  if (forms.length === 0 && !jurisdiction) return null

  const hasStale = forms.some(isStale)

  return (
    <section className="border border-[var(--border)] rounded-lg p-6 md:p-8 bg-[var(--card)]">
      <h2 className="text-xl md:text-2xl mb-1">If they don&rsquo;t respond</h2>
      <p className="text-base text-[var(--muted)] mb-6">
        Here are the official forms and next steps for escalating your matter.
      </p>

      {jurisdiction && (
        <div className="mb-6">
          <p className="text-base">
            <span className="text-[var(--muted)]">File with:</span>{' '}
            <a
              href={jurisdiction.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] underline underline-offset-2 hover:opacity-80"
            >
              {jurisdiction.body}
            </a>
          </p>
          {jurisdiction.notes && (
            <p className="text-sm text-[var(--muted)] mt-1">{jurisdiction.notes}</p>
          )}
        </div>
      )}

      {forms.length > 0 && (
        <ul className="space-y-4">
          {forms.map((form, i) => (
            <FormRow key={i} form={form} />
          ))}
        </ul>
      )}

      {hasStale && (
        <p className="text-xs text-amber-600 mt-6 flex items-start gap-1.5">
          <span className="shrink-0 mt-0.5">&#9888;</span>
          Some form information may be outdated. Please verify with the relevant registry before filing.
        </p>
      )}

      <p className="text-xs text-[var(--muted)] mt-4 pt-4 border-t border-[var(--border)]">
        Always check the registry website for the latest version of these forms.
      </p>
    </section>
  )
}

function FormRow({ form }: { form: CourtForm }) {
  const stale = isStale(form)
  const linkUrl = form.downloadUrl ?? form.url

  return (
    <li className="border border-[var(--border)] rounded-lg p-4">
      <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-base text-[var(--foreground)] underline underline-offset-2 hover:text-[var(--accent)]"
          >
            {form.formName}
          </a>
          {form.formNumber && (
            <span className="text-xs text-[var(--muted)]">({form.formNumber})</span>
          )}
          {stale && (
            <span className="text-xs text-amber-600" title="Last verified over 6 months ago">
              &#9888; May be outdated
            </span>
          )}
        </div>
        {formatBadge(form.format)}
      </div>

      <p className="text-sm text-[var(--muted)]">{form.purpose}</p>

      {form.filingFee && (
        <p className="text-sm mt-1">
          <span className="text-[var(--muted)]">Filing fee:</span>{' '}
          <span className="font-medium">{form.filingFee}</span>
        </p>
      )}

      {form.notes && (
        <p className="text-xs text-[var(--muted)] mt-2">{form.notes}</p>
      )}
    </li>
  )
}

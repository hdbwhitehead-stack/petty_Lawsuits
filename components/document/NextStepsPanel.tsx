import { getFormsForDispute, isStale, type CourtForm, type FormFormat } from '@/lib/documents/court-forms'
import { getJurisdiction } from '@/lib/documents/jurisdiction'
import { getNextSteps } from '@/lib/documents/next-steps'
import { StickerCard } from '@/components/ui/StickerCard'

type Props = {
  state: string
  disputeType: string
  category?: string
}

function formatBadge(format: FormFormat) {
  const isOnline = format === 'online' || format === 'online+pdf'
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        padding: '2px 8px',
        borderRadius: 999,
        border: '1.5px solid var(--foreground)',
        background: isOnline ? 'var(--grass-tint)' : 'var(--card)',
        color: 'var(--foreground)',
        whiteSpace: 'nowrap',
      }}
    >
      {format === 'online'
        ? 'Online'
        : format === 'online+pdf'
        ? 'Online + PDF'
        : format === 'pdf'
        ? 'PDF'
        : format === 'pdf-fillable'
        ? 'PDF (fillable)'
        : 'Word'}
    </span>
  )
}

export default function NextStepsPanel({ state, disputeType, category }: Props) {
  if (category === 'Cease & Desist') {
    const blurb = getNextSteps(state, category)
    return (
      <StickerCard color="var(--sky-tint)" rotate={0}>
        <h2 className="font-display font-bold text-xl mb-3">If they don&rsquo;t stop</h2>
        <p className="text-sm text-muted whitespace-pre-line leading-relaxed">{blurb.trim()}</p>
      </StickerCard>
    )
  }

  const forms = getFormsForDispute(state, disputeType)
  const jurisdiction = getJurisdiction(state, disputeType as Parameters<typeof getJurisdiction>[1])

  if (forms.length === 0 && !jurisdiction) return null

  const hasStale = forms.some(isStale)

  return (
    <StickerCard color="var(--sky-tint)" rotate={0}>
      <h2 className="font-display font-bold text-xl mb-1">If they don&rsquo;t respond</h2>
      <p className="text-base text-muted mb-6">
        Here are the official forms and next steps for escalating your matter.
      </p>

      {jurisdiction && (
        <div className="mb-6">
          <p className="text-base">
            <span className="text-muted">File with:</span>{' '}
            <a
              href={jurisdiction.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-2 hover:opacity-80"
            >
              {jurisdiction.body}
            </a>
          </p>
          {jurisdiction.notes && (
            <p className="text-sm text-muted mt-1">{jurisdiction.notes}</p>
          )}
        </div>
      )}

      {forms.length > 0 && (
        <ul className="space-y-3">
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

      <p
        className="text-xs text-muted mt-4 pt-4"
        style={{ borderTop: '1px solid rgba(26,24,20,0.2)' }}
      >
        Always check the registry website for the latest version of these forms.
      </p>
    </StickerCard>
  )
}

function FormRow({ form }: { form: CourtForm }) {
  const stale = isStale(form)
  const linkUrl = form.downloadUrl ?? form.url

  return (
    <li
      style={{
        border: '2px solid var(--foreground)',
        borderRadius: 14,
        padding: '12px 16px',
        background: 'var(--card)',
        boxShadow: '2px 2px 0 var(--foreground)',
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-base underline underline-offset-2 hover:text-accent"
          >
            {form.formName}
          </a>
          {form.formNumber && (
            <span className="text-xs text-muted">({form.formNumber})</span>
          )}
          {stale && (
            <span className="text-xs text-amber-600" title="Last verified over 6 months ago">
              &#9888; May be outdated
            </span>
          )}
        </div>
        {formatBadge(form.format)}
      </div>

      <p className="text-sm text-muted">{form.purpose}</p>

      {form.filingFee && (
        <p className="text-sm mt-1">
          <span className="text-muted">Filing fee:</span>{' '}
          <span className="font-medium">{form.filingFee}</span>
        </p>
      )}

      {form.notes && (
        <p className="text-xs text-muted mt-2">{form.notes}</p>
      )}
    </li>
  )
}

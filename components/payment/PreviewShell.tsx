import { Stamp } from '@/components/ui/Stamp'
import { Highlight } from '@/components/ui/Highlight'

type Props = {
  content: Record<string, string>
  fields: { key: string; label: string }[]
  category: string
}

export default function PreviewShell({ content, fields, category }: Props) {
  const visibleFields = fields.filter(f => content[f.key])
  const cutoff = Math.ceil(visibleFields.length * 0.55)

  return (
    <div className="max-w-2xl mx-auto px-4" style={{ paddingTop: 16 }}>
      {/* Outer wrapper: room for tape strip overhang */}
      <div className="relative pt-4">

        {/* Pink tape strip */}
        <div
          className="absolute top-0 left-1/2 z-10 px-6 py-1.5"
          style={{
            background: 'var(--pink)',
            border: '2px solid var(--foreground)',
            borderRadius: 3,
            opacity: 0.9,
            transform: 'translateX(-50%) rotate(-1deg)',
            boxShadow: '2px 2px 0 #1A1814',
            whiteSpace: 'nowrap',
          }}
        />

        {/* Document card */}
        <div
          style={{
            background: '#fff',
            border: '2px solid var(--foreground)',
            borderRadius: 20,
            boxShadow: '5px 5px 0 #1A1814',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            className="px-8 pt-8 pb-5 flex items-start justify-between gap-4"
            style={{ borderBottom: '2px solid var(--foreground)' }}
          >
            <div>
              <p
                className="text-xs font-bold uppercase tracking-widest mb-1"
                style={{ color: 'var(--accent)' }}
              >
                {category}
              </p>
              <h2 className="text-xl font-bold">Document Preview</h2>
            </div>
            <div className="flex-shrink-0 -mt-2">
              <Stamp size={88} rotate={-10} color="var(--stamp)">
                FORMAL{'\n'}DEMAND
              </Stamp>
            </div>
          </div>

          {/* Fields — show ~55%, then fade */}
          <div className="relative px-8 pt-6" style={{ paddingBottom: 0 }}>
            <div className="space-y-4">
              {visibleFields.map((field, idx) => {
                const value = content[field.key]
                const isRedacted = value.includes('████')
                const isAmount = field.key === 'amount' || field.key === 'claim_amount'

                return (
                  <div key={field.key} style={{ opacity: idx >= cutoff ? Math.max(0, 1 - (idx - cutoff) * 0.5) : 1 }}>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>
                      {field.label}
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: isRedacted ? 'var(--border)' : 'var(--foreground)' }}
                    >
                      {isAmount && !isRedacted
                        ? <Highlight color="var(--lemon)">{value}</Highlight>
                        : value}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Gradient fade */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 140,
                background: 'linear-gradient(to bottom, transparent 0%, white 80%)',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Paywall pill */}
          <div className="px-8 pb-8 pt-4 flex justify-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold"
              style={{
                background: 'var(--foreground)',
                color: 'var(--lemon)',
                border: '2px solid var(--foreground)',
                borderRadius: '999px',
                boxShadow: '3px 3px 0 #1A1814',
                letterSpacing: '0.03em',
              }}
            >
              🔒 2 OF 3 PAGES · UNLOCK TO READ ALL
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface PettyMeterProps {
  value?: number
  label?: string
  tier?: string
}

const TIERS = ['Mildly miffed', 'Properly cross', 'Fully petty', 'Maximum petty']

export function PettyMeter({ value = 0.7, label = 'Petty Level', tier }: PettyMeterProps) {
  const idx = Math.floor(value * (TIERS.length - 0.01))
  const tierLabel = tier ?? TIERS[idx]

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--foreground)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-marker)',
            fontSize: 22,
            color: 'var(--accent-dark)',
            lineHeight: 1,
          }}
        >
          {tierLabel}
        </span>
      </div>
      <div
        style={{
          height: 18,
          background: '#fff',
          border: '2px solid var(--foreground)',
          borderRadius: '999px',
          boxShadow: 'inset 0 2px 0 rgba(0,0,0,0.05)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: `${value * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--lemon) 0%, var(--accent) 70%, #D14B68 100%)',
            transition: 'width 600ms cubic-bezier(.2,.8,.2,1)',
          }}
        />
        {[0.25, 0.5, 0.75].map((n) => (
          <div
            key={n}
            style={{
              position: 'absolute',
              left: `${n * 100}%`,
              top: 0,
              bottom: 0,
              width: 2,
              background: 'var(--foreground)',
              opacity: 0.25,
            }}
          />
        ))}
      </div>
    </div>
  )
}

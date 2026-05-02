import { ReactNode } from 'react'

interface AchievementChipProps {
  children: ReactNode
}

export function AchievementChip({ children }: AchievementChipProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        background: 'var(--lemon)',
        color: 'var(--foreground)',
        border: '1.5px solid var(--foreground)',
        borderRadius: 999,
        padding: '3px 10px',
        boxShadow: '2px 2px 0 var(--foreground)',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}

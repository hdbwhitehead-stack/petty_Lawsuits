import { ReactNode } from 'react'

interface StampProps {
  children: ReactNode
  color?: string
  rotate?: number
  size?: number
}

export function Stamp({ children, color = 'var(--stamp)', rotate = -8, size = 110 }: StampProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `3px solid ${color}`,
        color,
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        lineHeight: 1.1,
        fontSize: size * 0.18,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        transform: `rotate(${rotate}deg)`,
        opacity: 0.85,
        filter: 'contrast(0.9) blur(0.3px)',
        padding: 8,
      }}
    >
      {children}
    </div>
  )
}

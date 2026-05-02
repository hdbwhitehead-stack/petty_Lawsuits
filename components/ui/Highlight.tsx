import { ReactNode } from 'react'

interface HighlightProps {
  children: ReactNode
  color?: string
  rotate?: number
}

export function Highlight({ children, color = 'var(--lemon)', rotate = -1 }: HighlightProps) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', padding: '0 4px' }}>
      <span
        style={{
          position: 'absolute',
          left: -2,
          right: -2,
          top: '15%',
          bottom: '5%',
          background: color,
          transform: `rotate(${rotate}deg) skewX(-8deg)`,
          zIndex: 0,
          borderRadius: 3,
        }}
      />
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </span>
  )
}

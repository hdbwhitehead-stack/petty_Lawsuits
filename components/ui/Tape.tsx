import { ReactNode, CSSProperties } from 'react'

type TapeColor = 'lemon' | 'pink' | 'sky'
type TapePosition = 'top' | 'top-left' | 'top-right'

interface TapeProps {
  color?: TapeColor
  position?: TapePosition
  children?: ReactNode
}

const colorMap: Record<TapeColor, string> = {
  lemon: 'var(--lemon)',
  pink: 'var(--pink)',
  sky: 'var(--sky)',
}

export function Tape({ color = 'lemon', position = 'top', children }: TapeProps) {
  const base: CSSProperties = {
    position: 'absolute',
    background: colorMap[color],
    border: '1.5px solid var(--foreground)',
    padding: children ? '3px 14px' : '4px 24px',
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    whiteSpace: 'nowrap',
    zIndex: 2,
    borderRadius: 3,
    pointerEvents: 'none',
  }

  const positionStyle: CSSProperties =
    position === 'top'
      ? { top: -16, left: '50%', transform: 'translateX(-50%)' }
      : position === 'top-left'
      ? { top: -14, left: 16, transform: 'rotate(-1.5deg)' }
      : { top: -14, right: 16, transform: 'rotate(1.5deg)' }

  return <div style={{ ...base, ...positionStyle }}>{children}</div>
}

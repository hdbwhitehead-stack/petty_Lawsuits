import { ReactNode, CSSProperties } from 'react'

type Shadow = 'sticker' | 'sticker-lg' | 'none'

interface StickerCardProps {
  children: ReactNode
  padding?: number | string
  color?: string
  rotate?: number
  shadow?: Shadow
  style?: CSSProperties
  className?: string
}

const shadowMap: Record<Shadow, string> = {
  'sticker':    '3px 3px 0 #1A1814',
  'sticker-lg': '5px 5px 0 #1A1814',
  'none':       'none',
}

export function StickerCard({
  children,
  padding = 24,
  color = '#fff',
  rotate = 0,
  shadow = 'sticker',
  style,
  className,
}: StickerCardProps) {
  return (
    <div
      className={className}
      style={{
        background: color,
        border: '2px solid var(--foreground)',
        borderRadius: 20,
        padding,
        boxShadow: shadowMap[shadow],
        transform: `rotate(${rotate}deg)`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

'use client'

import { useState, ElementType, ComponentPropsWithoutRef } from 'react'

type Variant = 'primary' | 'lemon' | 'pink' | 'sky' | 'ink' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

type StickerButtonProps<T extends ElementType = 'button'> = {
  variant?: Variant
  size?: Size
  icon?: React.ReactNode
  iconPos?: 'left' | 'right'
  as?: T
} & Omit<ComponentPropsWithoutRef<T>, 'as'>

const sizeMap = {
  sm: { px: 16, py: 8,  fs: 13, gap: 6 },
  md: { px: 22, py: 12, fs: 15, gap: 8 },
  lg: { px: 30, py: 16, fs: 17, gap: 10 },
}

const variantMap: Record<Variant, { bg: string; fg: string }> = {
  primary: { bg: 'var(--accent)',     fg: '#fff' },
  lemon:   { bg: 'var(--lemon)',      fg: 'var(--foreground)' },
  pink:    { bg: 'var(--pink)',       fg: 'var(--foreground)' },
  sky:     { bg: 'var(--sky)',        fg: 'var(--foreground)' },
  ink:     { bg: 'var(--foreground)', fg: '#fff' },
  ghost:   { bg: '#fff',             fg: 'var(--foreground)' },
}

export function StickerButton<T extends ElementType = 'button'>({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPos = 'right',
  as,
  ...rest
}: StickerButtonProps<T>) {
  const [pressed, setPressed] = useState(false)
  const Tag = (as ?? 'button') as ElementType
  const s = sizeMap[size]
  const v = variantMap[variant]
  const isDisabled = !!(rest as { disabled?: boolean }).disabled
  const shadow = pressed || isDisabled
    ? '0 0 0 #1A1814'
    : size === 'lg'
    ? '5px 5px 0 #1A1814'
    : '3px 3px 0 #1A1814'

  return (
    <Tag
      {...rest}
      onMouseDown={() => { if (!isDisabled) setPressed(true) }}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: s.gap,
        padding: `${s.py}px ${s.px}px`,
        fontFamily: 'var(--font-body)',
        fontSize: s.fs,
        fontWeight: 700,
        lineHeight: 1,
        letterSpacing: '-0.01em',
        background: v.bg,
        color: v.fg,
        border: '2px solid var(--foreground)',
        borderRadius: '999px',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.5 : 1,
        boxShadow: shadow,
        transform: pressed && !isDisabled ? 'translate(3px, 3px)' : 'translate(0, 0)',
        transition: 'transform 80ms ease, box-shadow 80ms ease',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        ...(rest as { style?: React.CSSProperties }).style,
      }}
    >
      {icon && iconPos === 'left' && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      {children}
      {icon && iconPos === 'right' && <span style={{ display: 'inline-flex' }}>{icon}</span>}
    </Tag>
  )
}

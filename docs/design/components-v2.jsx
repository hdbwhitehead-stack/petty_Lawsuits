/* v2 — sticker-y components with chunky borders, hard shadows, marker accents */

const T2 = window.PL2_TOKENS;
const c2 = T2.color;

/* ---- Sticker Button: chunky border + hard offset shadow that "presses" on hover ---- */
function PL2Button({ children, variant = 'primary', size = 'md', icon, iconPos = 'right', as = 'button', ...rest }) {
  const [pressed, setPressed] = React.useState(false);
  const sizeMap = {
    sm: { px: 16, py: 8,  fs: 13, gap: 6 },
    md: { px: 22, py: 12, fs: 15, gap: 8 },
    lg: { px: 30, py: 16, fs: 17, gap: 10 },
  };
  const s = sizeMap[size];
  const variants = {
    primary: { bg: c2.clay,   fg: '#fff' },
    lemon:   { bg: c2.lemon,  fg: c2.ink },
    pink:    { bg: c2.pink,   fg: c2.ink },
    sky:     { bg: c2.sky,    fg: c2.ink },
    ink:     { bg: c2.ink,    fg: '#fff' },
    ghost:   { bg: '#fff',    fg: c2.ink },
  };
  const v = variants[variant];
  const Tag = as;
  return (
    <Tag {...rest}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: s.gap,
        padding: `${s.py}px ${s.px}px`,
        fontFamily: T2.font.body, fontSize: s.fs, fontWeight: 700,
        lineHeight: 1, letterSpacing: '-0.01em',
        background: v.bg, color: v.fg,
        border: `2px solid ${c2.ink}`,
        borderRadius: T2.radius.pill,
        cursor: 'pointer',
        boxShadow: pressed ? '0 0 0 #1A1814' : (size === 'lg' ? T2.shadow.stickerLg : T2.shadow.sticker),
        transform: pressed ? 'translate(3px, 3px)' : 'translate(0, 0)',
        transition: 'transform 80ms ease, box-shadow 80ms ease',
        textDecoration: 'none', whiteSpace: 'nowrap',
        ...rest.style,
      }}>
      {icon && iconPos === 'left' && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      {children}
      {icon && iconPos === 'right' && <span style={{ display: 'inline-flex' }}>{icon}</span>}
    </Tag>
  );
}

/* ---- Highlighter: a span with a fat marker swipe behind text ---- */
function PL2Highlight({ children, color = c2.lemon, rotate = -1 }) {
  return (
    <span style={{
      position: 'relative', display: 'inline-block',
      padding: '0 4px',
    }}>
      <span style={{
        position: 'absolute', left: -2, right: -2, top: '15%', bottom: '5%',
        background: color, transform: `rotate(${rotate}deg) skewX(-8deg)`,
        zIndex: 0, borderRadius: 3,
      }} />
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </span>
  );
}

/* ---- Sticker Card: paper card w/ chunky shadow & optional rotation ---- */
function PL2Card({ children, padding = 24, color = '#fff', rotate = 0, shadow = 'sticker', style }) {
  return (
    <div style={{
      background: color,
      border: `2px solid ${c2.ink}`,
      borderRadius: T2.radius.lg,
      padding,
      boxShadow: T2.shadow[shadow] ?? shadow,
      transform: `rotate(${rotate}deg)`,
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ---- Tape strip: decorative washi tape ---- */
function PL2Tape({ color = c2.lemon, width = 80, rotate = -4, style }) {
  return (
    <div style={{
      width, height: 22,
      background: color, opacity: 0.85,
      borderLeft: `2px dashed rgba(0,0,0,0.15)`,
      borderRight: `2px dashed rgba(0,0,0,0.15)`,
      transform: `rotate(${rotate}deg)`,
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      ...style,
    }} />
  );
}

/* ---- Rubber Stamp: rotated circle with text, looks ink-pressed ---- */
function PL2Stamp({ children, color = c2.stamp, rotate = -8, size = 110 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      border: `3px solid ${color}`,
      color, fontFamily: T2.font.display, fontWeight: 700,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', lineHeight: 1.1,
      fontSize: size * 0.18, letterSpacing: '0.05em', textTransform: 'uppercase',
      transform: `rotate(${rotate}deg)`,
      opacity: 0.85,
      filter: 'contrast(0.9) blur(0.3px)',
      padding: 8,
    }}>
      {children}
    </div>
  );
}

/* ---- Petty Meter: gamified progress bar with emoji-free icons ---- */
function PL2Meter({ value = 0.7, label = 'Petty Level', tier }) {
  const tiers = ['Mildly miffed', 'Properly cross', 'Fully petty', 'Maximum petty'];
  const idx = Math.floor(value * (tiers.length - 0.01));
  const t = tier || tiers[idx];
  return (
    <div style={{ fontFamily: T2.font.body }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: c2.ink, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
        <span style={{ fontFamily: T2.font.marker, fontSize: 22, color: c2.clayDeep, lineHeight: 1 }}>{t}</span>
      </div>
      <div style={{
        height: 18, background: '#fff',
        border: `2px solid ${c2.ink}`, borderRadius: T2.radius.pill,
        boxShadow: 'inset 0 2px 0 rgba(0,0,0,0.05)',
        overflow: 'hidden', position: 'relative',
      }}>
        <div style={{
          width: `${value * 100}%`, height: '100%',
          background: `linear-gradient(90deg, ${c2.lemon} 0%, ${c2.clay} 70%, ${c2.pinkDeep} 100%)`,
          transition: 'width 600ms cubic-bezier(.2,.8,.2,1)',
        }} />
        {[0.25, 0.5, 0.75].map(n => (
          <div key={n} style={{ position: 'absolute', left: `${n * 100}%`, top: 0, bottom: 0, width: 2, background: c2.ink, opacity: 0.25 }} />
        ))}
      </div>
    </div>
  );
}

/* ---- Achievement chip ---- */
function PL2Achievement({ icon, title, locked }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 14px',
      background: locked ? '#F3EFE5' : c2.lemon,
      border: `2px solid ${c2.ink}`,
      borderRadius: T2.radius.pill,
      boxShadow: locked ? 'none' : T2.shadow.sticker,
      opacity: locked ? 0.55 : 1,
      fontFamily: T2.font.body, fontSize: 13, fontWeight: 700, color: c2.ink,
    }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      {title}
    </div>
  );
}

/* ---- Marker icons (deliberately simple SVG only — circles, lines, polygons) ---- */
const Icon2 = {
  arrow: (size = 16) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  check: (size = 14) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  bolt: (size = 16) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
      <path d="M9 1L3 9h4l-1 6 6-8H8l1-6z" />
    </svg>
  ),
  star: (size = 16) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1l2.2 4.5L15 6.2l-3.5 3.4.8 4.8L8 12.1 3.7 14.4l.8-4.8L1 6.2l4.8-.7L8 1z"/>
    </svg>
  ),
  flame: (size = 16) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1c0 3-3 4-3 7a3 3 0 006 0c0-1.5-1-2-1-3.5 0 .5 1 1 1 2.5C11 4 8 3.5 8 1z"/>
    </svg>
  ),
  trophy: (size = 16) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
      <path d="M4 2h8v3a4 4 0 11-8 0V2zm-2 1h2v3H3a1 1 0 01-1-1V3zm10 0h2v2a1 1 0 01-1 1h-1V3zM7 9h2v3H7V9zm-2 4h6v1H5v-1z"/>
    </svg>
  ),
};

/* ---- Marker underline (SVG squiggle) ---- */
function PL2MarkerUnderline({ children, color = c2.clay }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      {children}
      <svg style={{ position: 'absolute', left: 0, right: 0, bottom: -8, width: '100%', height: 8 }} viewBox="0 0 100 8" preserveAspectRatio="none">
        <path d="M2 5 Q 25 1, 50 4 T 98 3" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </span>
  );
}

Object.assign(window, {
  PL2Button, PL2Highlight, PL2Card, PL2Tape, PL2Stamp, PL2Meter, PL2Achievement, PL2MarkerUnderline, Icon2,
  T2, c2,
});

/* Petty Lawsuits — v2 PLAYFUL Design Tokens
 * Brighter, chunkier, sticker-y. Same warm grounding, but more energy.
 */

const PL2_TOKENS = {
  color: {
    paper:       '#FFF8E7',                    // legal-pad cream, way warmer than v1
    paperAlt:    '#FCEFC7',                    // raised cream
    paperLine:   'oklch(94% 0.020 90)',        // ruled-line tint
    card:        '#FFFFFF',
    ink:         '#1A1814',                    // near-black, warm
    inkSoft:     '#5A5550',
    inkMuted:    '#85807A',
    line:        'oklch(86% 0.020 80)',

    clay:        '#E85D2C',                    // PUNCHY clay-orange (was muted)
    clayDeep:    '#B8421C',
    clayTint:    '#FDE2D3',

    lemon:       '#FFD93D',                    // highlighter yellow
    lemonDeep:   '#E5B800',
    lemonTint:   '#FFF1A8',

    pink:        '#FF8FA3',                    // sticker pink
    pinkDeep:    '#D14B68',
    pinkTint:    '#FFE0E6',

    sky:         '#7DC4E8',                    // playful sky blue
    skyDeep:     '#3E8FBE',
    skyTint:     '#D6EEFB',

    grass:       '#7FB069',                    // friendly green
    grassTint:   '#E1F0D5',

    stamp:       '#C9302C',                    // rubber-stamp red (use sparingly)
  },

  font: {
    display: `'Fraunces', 'Instrument Serif', serif`,   // chunkier wedge serif for fun
    body:    `'DM Sans', system-ui, -apple-system, sans-serif`,
    marker:  `'Caveat', 'Comic Sans MS', cursive`,      // hand-marker accents
    mono:    `'JetBrains Mono', monospace`,
  },

  radius: { sm: '8px', md: '14px', lg: '20px', xl: '28px', pill: '999px' },

  shadow: {
    // Sticker-style shadows — chunky, slightly offset
    sticker: '3px 3px 0 #1A1814',
    stickerLg: '5px 5px 0 #1A1814',
    soft: '0 4px 16px rgba(26,24,20,0.08)',
    pop:  '0 8px 24px rgba(232,93,44,0.25), 0 2px 4px rgba(26,24,20,0.06)',
  },
};

window.PL2_TOKENS = PL2_TOKENS;

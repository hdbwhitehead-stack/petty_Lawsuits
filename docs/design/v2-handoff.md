# Petty Lawsuits — v2 Design System Handoff

> A practical map from the v2 design system to the `petty_Lawsuits` Next.js codebase. Follow the steps in order — each is independently shippable, so you can deploy after every step and preview the change.

**Companion files in this folder:**
- `design-system-v2.html` — interactive visual reference (open in a browser)
- `tokens-v2.jsx` — JS source for tokens (port to CSS variables / Tailwind)
- `components-v2.jsx` — JSX source for the five primitives (port to TSX)

---

## The big idea

v2 is **playful, gamified, made for the common person**. Visual signature:

- **Legal-pad cream paper** with faint ruled lines as the canvas
- **Sticker shadow** — `3px 3px 0 #1A1814` — the v2 tactile signature, on every interactive surface
- **2px ink borders** everywhere instead of 1px greys
- **5 accent colors** (clay, lemon, pink, sky, grass) used intentionally — not randomly
- **Marker font** (Caveat) for human asides; **Fraunces 800** for chunky display; **DM Sans** for body; **JetBrains Mono** for case codes
- **Gamification**: XP, streaks, achievements, the Petty Meter, Wall of Wins
- **Cheeky copy** wrapping a still-formal legal product

---

## 01. Update the global tokens

Everything starts here. Edit `app/globals.css` — the rest of the site already consumes these CSS variables, so this single change cascades everywhere.

```css
/* app/globals.css */
@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@500;700;800&family=DM+Sans:wght@400;500;700&family=Caveat:wght@500;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

:root {
  /* Paper & ink */
  --background: #FFF8E7;        /* legal-pad cream */
  --foreground: #1A1814;
  --card: #FFFFFF;
  --paper-alt: #FCEFC7;
  --paper-line: oklch(94% 0.02 90);
  --muted: #5A5550;
  --muted-2: #85807A;
  --border: oklch(86% 0.02 80);

  /* Accents — was 1, now 5 + stamp */
  --accent: #E85D2C;            /* clay (was #C8956C) */
  --accent-dark: #B8421C;
  --accent-tint: #FDE2D3;
  --lemon: #FFD93D;
  --lemon-tint: #FFF1A8;
  --pink: #FF8FA3;
  --pink-tint: #FFE0E6;
  --sky: #7DC4E8;
  --sky-tint: #D6EEFB;
  --grass: #7FB069;
  --grass-tint: #E1F0D5;
  --stamp: #C9302C;

  /* Type */
  --font-display: 'Fraunces', serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --font-marker: 'Caveat', cursive;
  --font-mono: 'JetBrains Mono', monospace;

  /* Sticker shadow — the v2 signature */
  --shadow-sticker: 3px 3px 0 var(--foreground);
  --shadow-sticker-lg: 5px 5px 0 var(--foreground);
}

body { font-family: var(--font-body); }
```

Then add the **legal-pad ruled lines** as a global utility — they appear behind hero, wizard, and quest sections:

```css
.paper-lines {
  background-image: repeating-linear-gradient(
    to bottom, transparent 0, transparent 31px, var(--paper-line) 32px
  );
}
```

---

## 02. Build the v2 component primitives

Create `components/ui/` and add five tiny reusable primitives. Every page composes from these — don't sprinkle the styles inline.

| Primitive | File | Purpose |
|---|---|---|
| `StickerButton` | `components/ui/StickerButton.tsx` | The CTA across the entire site. Replace every existing button. Variants: `primary`, `lemon`, `pink`, `sky`, `ink`, `ghost`. Has a `translate(3px,3px)` press animation that collapses the shadow. |
| `Highlight` | `components/ui/Highlight.tsx` | Inline span with a marker swipe behind text. Use for amounts, jurisdictions, or 1–2 emphasis words per heading. |
| `StickerCard` | `components/ui/StickerCard.tsx` | 2px ink border + hard offset shadow + optional rotation. Replaces every `border rounded-lg` usage. |
| `Stamp` | `components/ui/Stamp.tsx` | Rubber-stamp circle. Use sparingly — document preview, "FILED" confirmation, "WON" on Wall of Wins. |
| `PettyMeter` | `components/ui/PettyMeter.tsx` | Gamification core. Used in wizard sidebar (quest progress) and on dashboard (case status). |

Source for all five lives in `components-v2.jsx` in the design system project — port directly to TSX.

---

## 03. Replace the global header

File: `components/layout/Header.tsx`

- Wordmark: change `className="font-['Instrument_Serif']"` → use `font-display`, weight 800. Wrap "Lawsuits" in `<Highlight>`.
- Header bottom border: change `border-b border-[var(--border)]` → `border-b-2 border-[var(--foreground)]`.
- Replace the "Get Started" link with `<StickerButton variant="primary" size="sm">Sue someone</StickerButton>`.
- Add a "Wins ✦" nav link pointing to `/wins` (new page — see step 7).

---

## 04. Rebuild the home page

File: `app/(main)/page.tsx` — six sections, each maps to a v2 artboard. Copy the JSX directly from `artboards-v2-domain.jsx` (it's React already; swap inline `style` objects for Tailwind once you've extended the config in step 9).

| Section | v2 artboard | Key v2 moves |
|---|---|---|
| Hero | `v2-hero` | Streak pill ("4,218 Aussies got petty this week"), highlight on "For anything", marker tagline "in like 5 mins", stacked taped documents on the right, three colored stat numbers |
| How it works | `v2-quest` | Three colored sticker cards (lemon/pink/sky), each with a chunky 01/02/03 numeral and a "+150 XP" achievement pill |
| Use cases | `v2-fights` | "Pick your fight" — six tinted cards with cheeky names. Replace the existing `USE_CASES` array with the new copy. |
| Pricing | (reuse v1, restyled) | Add 2px borders, sticker shadows, "RECOMMENDED" tape strip on the highlighted tier |
| Jurisdiction | v1 layout, v2 chrome | State buttons get 2px borders + sticker shadow; selected state gets clay fill |
| Wall of Wins | `v2-wins` | NEW section near the footer — leaderboard of dollar amounts with WON stamps |

---

## 05. Convert the wizard into a quest

This is the highest-leverage screen — it's where users spend the most time, and where gamification pays off most.

### 5a. Update `ProgressSidebar.tsx`

Replace the linear progress with `<PettyMeter>`. For each step item, show a circular badge (clay = current, grass = done, white = upcoming) and a "+XX XP" hint underneath the step label. Cap with the auto-save lemon post-it card.

### 5b. Restyle every wizard step

Files: `ClaimantStep.tsx`, `DefendantStep.tsx`, `IncidentStep.tsx`, `EvidenceStep.tsx`. Every step gets:

- "STEP 0X OF 04" pill at the top in clay (replacing the existing accent-text)
- A marker-font encouragement line on the right ("almost halfway ✦", "going strong ✦", "you're nearly there!")
- Heading uses Fraunces 800 with one Highlight ("Who's *bringing the petty*?", "Spill the *tea*", "Show us the *receipts*")
- Inputs: `border-2 border-foreground` + `shadow-sticker`
- Continue button: `<StickerButton variant="primary">Continue · +50 XP</StickerButton>`

### 5c. Rewrite step copy

The existing copy ("Your details", "The other party") is too clinical. Use the v2 voice:

- "Your details" → "Who's bringing the petty?"
- "Defendant" / "The other party" → "The offender"
- "Incident details" → "Spill the tea"
- "Evidence" → "Show us the receipts"
- The italic flavor line at bottom of `ClaimantStep.tsx` ("The petty is spreading in Sydney") is already perfect — keep it, just style it with `font-marker` instead of italic body.

---

## 06. Document preview & paywall

Files: `app/(main)/preview/[documentId]/page.tsx`, `components/payment/PreviewShell.tsx`, `components/payment/UnlockTierCard.tsx`

### The "stamped & taped" treatment

- Wrap the document in a white card with `shadow-sticker-lg` and a pink tape strip across the top center.
- Top-right corner of every doc: rotated `FORMAL · DEMAND` stamp (red, 80–100px).
- Use `<Highlight>` on the dollar amount and the tribunal name — both auto-extracted from the doc data.
- Paywall fade: gradient to white, ending with an ink/lemon pill: "2 OF 3 PAGES · UNLOCK TO READ ALL".
- Right rail: lemon "Unlock & send it" sticker card with `StickerButton variant="ink"` primary CTA, plus a sky-tint testimonial card with marker text.

### The post-payment moment is the gamification payoff

After a successful Stripe checkout, redirect to a confirmation screen that *celebrates*: a giant rotated "FILED" stamp, "+200 XP earned" achievement chip, and the line in marker font: *"officially petty ✦"*. This is the moment to lock in the brand voice — don't waste it on a generic receipt page.

---

## 07. New surfaces to build

### `/wins` — Wall of Wins

New page. Server-renders anonymized resolved cases ("Maya · VIC · +$1,200 · resolved in 8 days"). Add a header dollar counter ("$148K recovered this month") and a "submit your win" CTA at the bottom — you collect testimonials and social proof in one move. Layout per `v2-wins` artboard.

### `/dashboard` — Case tracker

Existing `app/(main)/dashboard/page.tsx`. Each user document becomes a sticker card showing: jurisdiction pill, amount in lemon-highlighted Fraunces, current status (Drafted → Sent → Awaiting reply → Resolved), and a `<PettyMeter>` mapping to that progression. Resolved cases get a green WON stamp.

### Achievements (optional v2.1)

Quietly award badges as users progress: "First demand sent", "3-day streak", "Bond returned", "Maximum petty". Show them as a row of achievement chips on the dashboard. Locked ones are greyed out — they invite users back.

---

## 08. Microcopy & voice rewrite

The biggest single brand-shift lever. Find & replace these across the codebase:

| Old | v2 |
|---|---|
| "Get Started" | "Sue someone" / "Get petty" |
| "Generate document" | "Cite their nonsense" |
| "Download" | "Fire it off" |
| "Defendant" / "Respondent" | "The offender" |
| "Incident description" | "Spill the tea" |
| "Upload evidence" | "Show us the receipts" |
| "Pay to unlock" | "Unlock & send it" |
| "Confirmation" | "Officially petty ✦" |
| "My documents" | "My cases" |

---

## 09. Tailwind config

Extend `tailwind.config.ts` so you can use these tokens as utilities (`bg-lemon`, `shadow-sticker`, etc.) instead of inline styles:

```ts
// tailwind.config.ts
extend: {
  colors: {
    background: 'var(--background)',
    foreground: 'var(--foreground)',
    card: 'var(--card)',
    muted: 'var(--muted)',
    border: 'var(--border)',
    accent: 'var(--accent)',
    'accent-dark': 'var(--accent-dark)',
    'accent-tint': 'var(--accent-tint)',
    lemon: 'var(--lemon)',
    'lemon-tint': 'var(--lemon-tint)',
    pink: 'var(--pink)',
    'pink-tint': 'var(--pink-tint)',
    sky: 'var(--sky)',
    'sky-tint': 'var(--sky-tint)',
    grass: 'var(--grass)',
    'grass-tint': 'var(--grass-tint)',
    stamp: 'var(--stamp)',
  },
  fontFamily: {
    display: ['Fraunces', 'serif'],
    body: ['DM Sans', 'sans-serif'],
    marker: ['Caveat', 'cursive'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  boxShadow: {
    sticker: '3px 3px 0 #1A1814',
    'sticker-lg': '5px 5px 0 #1A1814',
  },
  borderWidth: { '2.5': '2.5px' },
}
```

---

## 10. Roll-out order

Each step ships independently. Don't try to do it all in one PR — you'll lose nerve halfway through.

1. **Tokens + Tailwind config + fonts.** Site looks broken-but-warmer immediately. Ship.
2. **Five UI primitives.** StickerButton replaces ~15 button instances site-wide. Ship.
3. **Header + Footer.** Brand chrome is now v2 everywhere. Ship.
4. **Home page.** First-time visitors get the full experience. Ship.
5. **Wizard.** Conversion-critical — A/B test if you can. Ship.
6. **Document preview & paywall + post-payment confirmation.** Locks in the petty payoff moment. Ship.
7. **Microcopy sweep.** Search-and-replace. 1-hour PR. Ship.
8. **`/wins` & dashboard.** New surfaces — these create return visits. Ship.

---

## ★ Don't break

✓ The actual generated document body stays formal and lawyer-toned. Petty is the wrapper, not the legal language.
✓ The legal disclaimer in the footer stays in plain DM Sans, no marker, no stickers. Trust signals don't joke.
✓ The jurisdiction picker stays factual — these are real tribunal names & thresholds. Style them, don't rename them.

✗ Don't put marker font on legal copy or on the actual demand letter content.
✗ Don't use more than one Highlight per heading. They lose impact.
✗ Don't rotate every card. Aim for ~30% rotated, 70% upright. Random ≠ playful, intentional rotation = playful.

---

*go forth and get petty ✦*

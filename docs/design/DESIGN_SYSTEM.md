# Petty Lawsuits — Design System

> The canonical reference. Every page, every component, every new feature reads this first.
> Tokens, components, patterns, page recipes, voice. If it's not in here, it doesn't exist yet — propose it before building it.

**Source-of-truth files** (this doc describes them; they implement it):
- `app/globals.css` — tokens
- `tailwind.config.ts` — token utilities
- `components/ui/*` — primitives
- `docs/design/design-system-v2.html` — interactive visual reference

---

## §0. Voice & principles

**Playful wrapper, formal core.** Petty Lawsuits exists for the common Australian who's been wronged in small, infuriating ways. The brand voice is cheeky, gamified, encouraging — but the *legal product* it generates is real and must read as such.

Three rules that resolve every design decision:

1. **Petty is the wrapper, not the legal language.** Marketing copy, UI, dashboard, post-payment celebration → playful. The actual demand letter, jurisdiction names, tribunal thresholds, legal disclaimer → formal.
2. **Earn every element.** No filler sections, no ornamental icons, no decorative numbers. If a card or section doesn't move the user closer to filing, it shouldn't exist.
3. **Intentional rotation, intentional color.** Random ≠ playful. ~30% of cards rotated, 70% upright. Five accents, each with a job (see §2).

---

## §1. The visual signature

What makes a screen recognisably Petty Lawsuits at a glance:

- **Legal-pad cream** background (`#FFF8E7`) with faint horizontal ruled lines on hero and form sections
- **2px ink borders** (`#1A1814`) — never 1px greys
- **Sticker shadow** — `3px 3px 0 #1A1814` — on every interactive surface (buttons, cards, inputs). Pressed state collapses the shadow with a `translate(3px,3px)` transform.
- **Fraunces 800** display + **DM Sans** body + **Caveat marker** asides + **JetBrains Mono** case codes
- **Highlighter swipes** behind 1–2 emphasis words per heading
- **Rubber stamps** and **washi tape** as functional ornaments — not decorative

If a screen has none of these signals, it's off-system.

---

## §2. Tokens

Source of truth: `app/globals.css`. Never use raw hex codes in component files.

### Paper & ink

| Token | Value | Use |
|---|---|---|
| `--background` | `#FFF8E7` | Page background. The "legal pad." |
| `--foreground` | `#1A1814` | All text + borders + shadows. |
| `--card` | `#FFFFFF` | Card surfaces above the cream. |
| `--paper-alt` | `#FCEFC7` | Secondary section backgrounds. |
| `--paper-line` | `oklch(94% 0.02 90)` | Faint horizontal rules. |
| `--muted` | `#5A5550` | Body copy on cream. |
| `--muted-2` | `#85807A` | Captions, mono codes. |
| `--border` | `oklch(86% 0.02 80)` | Hairline dividers only — not for primary borders (use `--foreground`). |

### Accents — five colors, each with a job

| Token | Value | Job | Don't use it for |
|---|---|---|---|
| `--accent` (clay) | `#E85D2C` | Primary CTA, current step, key amounts | Backgrounds — too aggressive at scale |
| `--accent-tint` | `#FDE2D3` | Soft clay backgrounds, hover states | Borders |
| `--lemon` | `#FFD93D` | Highlighter swipes, positive XP, tape strips, primary `lemon` button | Text color (illegible) |
| `--pink` | `#FF8FA3` | Tape strips, secondary stickers, soft accents | Anything serious |
| `--sky` | `#7DC4E8` | Trust/info moments, testimonial cards | Primary CTAs |
| `--grass` | `#7FB069` | Success, completed states, WON stamp | Buttons (reserve for state) |
| `--stamp` | `#C9302C` | Rubber stamps only | Buttons, text, anything else |

Each color has a `-tint` variant for soft fills.

### Type

| Token | Family | Use |
|---|---|---|
| `--font-display` | Fraunces 500/700/800 | Headings, marketing display, big numerals |
| `--font-body` | DM Sans 400/500/700 | All body, UI labels, buttons |
| `--font-marker` | Caveat 500/700 | Hand-marker asides ("almost halfway ✦"). Sparingly. |
| `--font-mono` | JetBrains Mono 400/500/700 | Case codes, jurisdiction codes, status pills, dates |

**Type scale (recommended):**

| Token | Size | Family | Use |
|---|---|---|---|
| display-xl | 64–80px | Fraunces 800 | Hero headline only |
| display-lg | 48px | Fraunces 800 | Page H1 |
| display-md | 36px | Fraunces 800 | Section H2 |
| display-sm | 22px | Fraunces 700 | Card titles, H3 |
| body-lg | 18px | DM Sans 500 | Lede |
| body | 15.5px | DM Sans 500 | Default body |
| body-sm | 14px | DM Sans 500 | Secondary copy |
| label | 11–12px | JetBrains Mono 500 uppercase | Pills, eyebrows |

### Shadows

| Token | Value | Use |
|---|---|---|
| `--shadow-sticker` | `3px 3px 0 var(--foreground)` | Default for buttons, cards, inputs |
| `--shadow-sticker-lg` | `5px 5px 0 var(--foreground)` | Document preview, hero feature card |

No soft drop shadows. The system has *one* shadow shape: hard offset, ink-colored, no blur.

### Radii

8px (small), 14px (cards), 18px (large cards), 999px (pills). Not bigger; not smaller.

### Spacing

4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96. Stick to this scale.

---

## §3. Components

Live in `components/ui/`. Never style raw `<button>` or `<div>` for these jobs — always use the primitive.

### `<StickerButton>`

The CTA across the entire site.

**Props:** `variant` = `primary | lemon | pink | sky | ink | ghost`; `size` = `sm | md | lg`; standard button props.
**Behavior:** hover lifts shadow to 4×4; active translates +3,+3 and collapses shadow.

```tsx
<StickerButton variant="primary" size="lg">Sue someone</StickerButton>
<StickerButton variant="ink">Unlock & send it</StickerButton>
<StickerButton variant="ghost" size="sm">Cancel</StickerButton>
```

**When to use which variant:**
- `primary` (clay) — main CTA on every screen
- `ink` — paywall unlock + final commit moments (the most weighty button)
- `lemon` — secondary positive ("Save draft", "Continue · +50 XP")
- `sky` — info / "Learn more" / FAQ links
- `pink` — soft secondary, never primary
- `ghost` — tertiary; cancel, dismiss

**Don't:** style raw `<button>`s; combine variants; use `bg-lemon` directly.

### `<Highlight>`

Inline span with a marker swipe behind text.

```tsx
<h1>Sue anyone. <Highlight>For anything.</Highlight></h1>
```

**Rule:** maximum **one `<Highlight>` per heading**. They lose impact otherwise.

### `<StickerCard>`

The recurring container. 2px ink border + sticker shadow + optional rotation.

**Props:** `tint` = `white | lemon | pink | sky | grass | clay`; `rotate` = `-2 | -1 | 0 | 1 | 2` (degrees).

```tsx
<StickerCard tint="lemon" rotate={-1}>
  <h3>Step 1</h3>
  <p>Spill the tea.</p>
</StickerCard>
```

**Don't:** rotate every card in a grid. ~30% rotated, 70% upright.

### `<Stamp>`

Rubber-stamp circle for legal/celebration moments.

**Props:** `label` (string), `color` (defaults to `--stamp`), `size`.

```tsx
<Stamp label="FORMAL · DEMAND" />
<Stamp label="FILED · NSW" color="grass" />
<Stamp label="WON" color="grass" size="lg" />
```

**Don't:** use as a UI control. Decorative only. One per surface, max two.

### `<PettyMeter>`

Gamification core — tiered progress meter.

**Props:** `value` (0–100), `tier` = `'Starter' | 'Spicy' | 'Maximum Petty'`, `label`.

Used in: wizard sidebar (quest progress), dashboard (case status: Drafted → Sent → Awaiting → Resolved → 100%).

### `<Tape>`

Washi tape strip across the top of a card.

**Props:** `color` = `lemon | pink | sky`; `position` = `top | top-left | top-right`.

```tsx
<StickerCard><Tape color="pink" position="top-right" />…</StickerCard>
```

### `<AchievementChip>`

Pill that says "+50 XP" or "🏆 First demand sent". Use in wizard headers, dashboard cards.

### Inputs

`<TextInput>`, `<Textarea>`, `<Select>` — all share: 2px ink border, sticker shadow, white background, focus ring in clay. No floating labels — labels sit above in mono uppercase.

---

## §4. Patterns (multi-component compositions)

Recurring layouts. If your new page needs one of these, copy the pattern — don't reinvent.

### Hero pattern

Eyebrow streak pill → Fraunces 800 headline with one `<Highlight>` → marker tagline → `<StickerButton variant="primary" size="lg">` → three colored stat numerals OR a stack of taped document mockups.

### Sticker card grid

Section heading + optional marker subhead → 3-column responsive grid of `<StickerCard>`s with mixed tints (lemon/pink/sky rotation) and ~30% rotation.

Used by: How it works (3 cards), Use cases (6 cards), Pricing (3 cards).

### Wizard step

Sidebar (`<PettyMeter>` + step list with circular badges) → Main panel: "STEP 0X OF 04" mono pill + Fraunces 800 heading with `<Highlight>` + marker encouragement on the right + form with sticker-shadow inputs + `<StickerButton variant="primary">Continue · +50 XP</StickerButton>`.

### Document with stamps

White card + `shadow-sticker-lg` + `<Tape color="pink" position="top">` + rotated `<Stamp label="FORMAL · DEMAND" />` top-right corner + `<Highlight>` on dollar amount + tribunal name + paywall fade ending in ink/lemon pill: "2 OF 3 PAGES · UNLOCK TO READ ALL".

### Confirmation/celebration

Used after Stripe success, after milestone hits, anywhere you want to lock in voice.

Centered: giant rotated `<Stamp size="lg" />` ("FILED" / "WON" / "OFFICIALLY PETTY") + `<AchievementChip>+200 XP earned</AchievementChip>` + marker line: *"officially petty ✦"* + `<StickerButton variant="ink">` next-action CTA.

### Wall of Wins / leaderboard

Header dollar counter ("$148K recovered this month") + scrollable list of resolved cases as compact sticker rows: jurisdiction pill (mono) | name initial | clay-highlighted amount | grass `<Stamp label="WON">` | days-to-resolve in marker font.

### FAQ row

Question in Fraunces 700 (display-sm) + answer in body 15.5px on a thin sticker card. No accordion chevron icons — use a `+ / —` typographic toggle. Two columns on desktop.

### Legal / disclaimer block

DM Sans 14px on `--paper-alt`. **No marker, no stickers, no Highlights.** Trust signals don't joke.

---

## §5. Page recipes

When building a new page, pick the recipe that matches its job.

### Recipe A: Marketing/info page

**Pages:** `/`, `/how-it-works`, `/about`

**Rhythm:**
1. Hero pattern (full bleed, paper-lines background)
2. Section on cream — sticker card grid (3 cards)
3. Section on `--paper-alt` — long-form prose with one inline `<StickerCard tint="sky">` testimonial
4. Section on cream — second sticker card grid OR Wall of Wins teaser
5. Pre-footer CTA — full-width cream band, single `<StickerButton variant="primary" size="lg">`

**Density:** generous whitespace. Use the 96px spacing token between sections.

**Voice:** full v2 — cheeky, marker accents, XP pills welcome.

### Recipe B: Documents/listing page

**Pages:** `/documents`, `/dashboard`

**Rhythm:**
1. Page header: Fraunces 800 H1 + marker subhead + filter row (mono pills)
2. Grid of `<StickerCard>` rows — each card is a document or case with: jurisdiction pill | title | amount in lemon-highlighted Fraunces | status `<PettyMeter>` | resume CTA
3. Empty state on first visit: large `<StickerCard tint="lemon" rotate={-1}>` with marker copy ("no fights yet ✦") and a "Pick your fight" `<StickerButton>`

**Density:** compact. 24px card gap. Cards are functional, not decorative.

### Recipe C: Pricing page

**Pages:** `/pricing`

**Rhythm:**
1. Hero (smaller — display-lg, no taped documents)
2. Three `<StickerCard>` tier columns. Middle/recommended tier: `<Tape color="lemon" position="top">` + `rotate={0}` + `shadow-sticker-lg` + `<StickerButton variant="primary" size="lg">`. Side tiers: `<StickerButton variant="ghost">`.
3. Comparison table — sticker card holding a clean 2px-bordered table; ✓ in grass, ✗ in stamp red
4. FAQ row pattern (4–6 Q&A) below

**Voice:** mostly cheeky, but tier names and prices stay clear and direct. No marker on the prices.

### Recipe D: Wizard

**Pages:** `/start`, every step under it

See §4 wizard step pattern. Already specified end-to-end.

### Recipe E: Document preview / paywall

**Pages:** `/preview/[documentId]`, post-payment confirmation

See §4 document and confirmation patterns.

### Recipe F: Legal / FAQ / policy

**Pages:** `/faq`, `/terms`, `/privacy`, footer disclaimer pages

**Rhythm:**
1. Page header: Fraunces 700 H1 (display-md, not 800), no Highlight, no marker
2. Body: long-form on `--paper-alt`, max-width 680px, body-lg lede + body
3. FAQ row pattern (§4) for `/faq` — questions Fraunces 700, answers DM Sans
4. No `<StickerButton>`s in the body. End with a single ghost link "Back to home."

**Voice:** **plain, factual, formal.** This is the trust register. *No marker. No stickers. No Highlights. No XP.*

The contrast is the point — when the rest of the site is loud and the legal pages are quiet, the legal pages read as more credible.

---

## §6. Voice & microcopy

### The voice in 3 sentences

1. Cheeky on the edges, factual at the core.
2. Speaks to the wronged Aussie like a friend who'd help them write a strongly-worded letter.
3. Australian English. Small wins. Real money. No hustle-bro energy.

### Vocabulary table — use these, not the legacy clinical terms

| Old | v2 |
|---|---|
| Get Started | Sue someone / Get petty |
| Generate document | Cite their nonsense |
| Download | Fire it off |
| Defendant / Respondent | The offender |
| Incident description | Spill the tea |
| Upload evidence | Show us the receipts |
| Pay to unlock | Unlock & send it |
| Confirmation | Officially petty ✦ |
| My documents | My cases |
| Submit | Send it |
| Continue | Continue · +XX XP (in wizard) |

### Where the voice DOES NOT go

- The actual generated demand letter
- Jurisdiction names ("NSW Civil and Administrative Tribunal" — not "NCAT vibes")
- Tribunal thresholds and dollar limits
- Footer legal disclaimer
- Terms / Privacy / FAQ legal answers
- Error messages about payment, identity, or filing

In those places: plain, accurate, calm. No emoji, no marker, no XP.

### Marker font usage

`<span className="font-marker">` is for *one of these three things only*:

1. Encouraging asides next to a heading ("almost halfway ✦")
2. Celebration moments ("officially petty ✦")
3. Streak/community pills ("4,218 Aussies got petty this week")

If you're tempted to put it elsewhere, you don't need it.

### Highlight font usage

`<Highlight>` is for **one of these only:**

1. One emphasis word per page H1
2. Dollar amounts on document preview
3. Tribunal/jurisdiction names being stated for the first time

Max one Highlight per heading. Max three Highlights per page.

---

## §7. Building a new page — checklist

Print this. Tape it to your monitor.

1. **Pick a recipe** from §5. If your page doesn't fit one, stop and propose a new recipe before building.
2. **Tokens only from §2.** No raw hex codes in `.tsx`. Use `bg-lemon`, not `bg-[#FFD93D]`.
3. **Components only from §3.** No raw `<button>` styled to look like a sticker button. Use `<StickerButton>`.
4. **Voice from §6.** Marketing register or legal register — pick one *per page*, don't mix within a page.
5. **One `<Highlight>` per heading. ~30% of cards rotated.** Intentional, not random.
6. **Before opening a PR:** does this page introduce a NEW pattern? If yes, add it to §4 first, then build.
7. **Run the smell test:** does this page look like Petty Lawsuits at a glance (§1)? If you'd mistake it for a generic SaaS page, it's off-system.

---

## §8. Anti-patterns (don't do these)

| Don't | Do |
|---|---|
| Soft drop shadows (`shadow-md`, `shadow-lg`) | `shadow-sticker` only |
| 1px greys for primary borders | 2px ink |
| Rounded chevron accordion icons | `+ / —` typographic toggles |
| New colors invented for one screen | Use existing accents or propose adding to §2 |
| Marker font on legal copy | Plain DM Sans |
| Multiple Highlights per heading | One per heading |
| Rotating every card in a grid | ~30% rotated, 70% upright |
| Emoji as primary visual language | Use rarely — ✦ is fine, faces aren't |
| Skeumorphic gradients | Solid fills only |
| Stamp on a non-legal moment | Reserve for FILED / WON / DEMAND / FORMAL |
| `<button>` styled inline | `<StickerButton>` |
| Centered narrow column for marketing pages | Marketing uses asymmetric layouts; centered narrow is for legal/FAQ |

---

## §9. Adding to the system

You'll need to add things over time. The process:

1. **You think you need a new color / component / pattern.** Stop.
2. **Check §2/§3/§4 first.** 80% of the time, what you need already exists with a different name.
3. **If it's genuinely new:** open a PR that *adds it to this doc first*, with: name, when to use, when not to use, code example, anti-patterns. Get it reviewed.
4. **Then build it** in `components/ui/` or `app/globals.css`.
5. **Then use it** on your page.

This order matters. If components ship before they're documented, the system fragments within a quarter.

---

## §10. Source files & how they map

| Doc reference | Code source |
|---|---|
| §2 tokens | `app/globals.css` (CSS variables) + `tailwind.config.ts` (utility names) |
| §3 components | `components/ui/*.tsx` |
| §4 patterns | Composed in `app/(main)/*/page.tsx` and feature folders. No standalone "patterns" folder — they're combinations of §3 primitives. |
| §5 recipes | Conceptual — applied per page |
| §6 voice | Constants in `lib/copy.ts` (recommended) — single source for shared microcopy |
| Visual reference | `docs/design/design-system-v2.html` — open in browser |

---

*This is a living document. The voice is fixed; the system grows.*
*go forth and get petty ✦*

# Petty Lawsuits — v2 Handoff (Phase 2: Info & Marketing Pages)

> Migration playbook for `/how-it-works`, `/documents`, `/pricing`, `/about`, `/faq`.
> Phase 1 (`v2-handoff.md`) covered tokens, primitives, header, home, wizard, document preview. This phase finishes the public site.

**Read first:** `docs/design/DESIGN_SYSTEM.md` — every move below references its sections (§2 tokens, §3 components, §5 recipes).

**Prerequisites:**
- ✅ Step 1 of Phase 1 complete (tokens in `globals.css` + Tailwind config)
- ✅ Step 2 of Phase 1 complete (5 primitives in `components/ui/`: `StickerButton`, `Highlight`, `StickerCard`, `Stamp`, `PettyMeter` — plus `Tape` and `AchievementChip` if you've added them)

If those aren't done, do them first — every page below assumes those primitives exist.

---

## Each page in one sentence

| Page | File | Recipe (§5) | Voice register (§6) |
|---|---|---|---|
| How it works | `app/(main)/how-it-works/page.tsx` | A — Marketing/info | Full v2 (cheeky, marker, XP) |
| Documents | `app/(main)/documents/page.tsx` | A — Marketing/info | Full v2 |
| Pricing | `app/(main)/pricing/page.tsx` | C — Pricing | Mostly v2; prices stay direct |
| About | `app/(main)/about/page.tsx` | A — Marketing/info | Full v2 in headers; the "what we are / are not" stays plain |
| FAQ | `app/(main)/faq/page.tsx` | F — Legal/FAQ | **Plain register.** No marker, no stickers, no Highlights. |

The FAQ register is the most important call. Loud everywhere, calm on FAQ — that contrast *is* the trust signal.

---

## 11. How it works → "How to get petty"

File: `app/(main)/how-it-works/page.tsx`

The current page is a 3-section ladder of bordered boxes — solid bones, totally generic chrome. Lift the bones, swap the chrome.

### Page header
- H1 "How It Works" → Fraunces 800 display-lg, **"How to get** `<Highlight>` **petty** `</Highlight>`**"**
- Subhead → marker font, rotated -1°: *"From angry texts to formal demands ✦ in like 5 mins"*
- Add a streak pill above the H1: `<AchievementChip>4,218 Aussies got petty this week</AchievementChip>`

### Section rhythm — 3 quest stages, not 3 boxes
Replace each `<section className="border …">` with a `<StickerCard>`:

```tsx
{STEPS.map((step, i) => (
  <StickerCard
    key={step.num}
    tint={['lemon', 'pink', 'sky'][i]}
    rotate={[-1, 0.5, -0.5][i]}
  >
    <div className="flex items-baseline gap-4 mb-6">
      <span className="font-display font-extrabold text-6xl text-foreground">
        {step.num}
      </span>
      <h2 className="font-display font-extrabold text-3xl">{step.title}</h2>
      <AchievementChip>+{[100, 150, 200][i]} XP</AchievementChip>
    </div>
    <div className="space-y-5 pl-0 md:pl-20">
      {step.sections.map(s => (
        <div key={s.heading} className="border-l-2 border-foreground pl-5">
          <h3 className="font-display font-bold text-lg mb-1">{s.heading}</h3>
          <p className="text-base leading-relaxed">{s.text}</p>
        </div>
      ))}
    </div>
  </StickerCard>
))}
```

Three colored sticker cards (lemon/pink/sky), with chunky 01/02/03 numerals in Fraunces 800 sitting flush with the heading. Drop the inner left-border-divider treatment for child sections — keep the 2px ink border (it now reads as intentional, paired with the sticker shadow).

### Step copy rewrites (keep substance, sharpen voice)
- "Tell us about the dispute" → **"Spill the tea"**
- "AI generates your document" → **"We cite their nonsense"**
- "Review, edit, and download" → **"Fire it off"**

Sub-headings inside step 1:
- "Who are you claiming against?" → **"Who's the offender?"**
- "Your details" → **"Who's bringing the petty?"**
- "What happened?" → **"Spill the tea"**
- "Upload your evidence" → **"Show us the receipts"**

Step 2 sub-headings stay closer to factual (this is where "we" speaks):
- "Tailored to your jurisdiction" — keep
- "Formal and professional" → **"Sounds like a real lawyer wrote it"**
- "Not legal advice" — **keep verbatim**, plain register. This is a trust signal, not a joke.

Step 3 sub-headings:
- "Preview before you pay" → **"Preview before you commit"**
- "Edit the details" → **"Tweak any detail"**
- "Download and send" → **"Print it. Email it. Send it registered post."**

### Footer CTA section
Replace the centered `border-t` block with a full-width `<StickerCard tint="lemon">` band:
- Heading Fraunces 800: **"Ready to get** `<Highlight>` **petty** `</Highlight>`**?"**
- Subhead in marker: *"the whole thing takes about 5 mins ✦"*
- `<StickerButton variant="primary" size="lg">Sue someone</StickerButton>` + ghost secondary `<StickerButton variant="ghost">See the document types</StickerButton>` linking to `/documents`

---

## 12. Documents → "Pick your fight"

File: `app/(main)/documents/page.tsx`

The current grid of `border rounded-lg` cards loses to the use-cases section on the home page. Promote this page to the same energy.

### Page header
- H1 → Fraunces 800: **"Pick your** `<Highlight>` **fight** `</Highlight>`"
- Subhead → "Every document is tailored to Australian law and your specific jurisdiction." (keep — it's already factual + clear)
- Add a mono pill row showing jurisdictions covered: `NSW · VIC · QLD · WA · SA · TAS · ACT · NT`

### "Available now" section
- Section heading → drop the colored dot. Use a `<Tape color="lemon" position="top-left">` strip on the section wrapper instead. Heading reads in display-md: **"Ready to file"**.
- Each available category becomes a `<StickerCard>` with mixed tints. Layout-wise, **switch to a grid** (sm:grid-cols-2) — the current full-width row layout is dated and burns vertical space.

```tsx
<div className="grid sm:grid-cols-2 gap-6">
  {available.map((cat, i) => (
    <StickerCard
      key={cat.id}
      tint={['white', 'lemon-tint', 'pink-tint'][i % 3]}
      rotate={[-0.5, 0, 0.5][i % 3]}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-display font-extrabold text-2xl">{cat.name}</h3>
          <span className="font-mono text-[11px] uppercase tracking-wider px-2 py-1 border-2 border-foreground rounded">
            {cat.id.replace('-', ' · ')}
          </span>
        </div>
        <p className="text-base mb-4">{cat.description}</p>
        <ul className="space-y-1.5 mb-6 flex-1">
          {cat.examples.map(ex => (
            <li key={ex} className="text-sm flex items-start gap-2">
              <span className="text-accent flex-shrink-0">✦</span>{ex}
            </li>
          ))}
        </ul>
        <StickerButton as={Link} href="/wizard" variant="primary" size="sm" className="self-start">
          Get petty about this
        </StickerButton>
      </div>
    </StickerCard>
  ))}
</div>
```

Replace the legacy inline-styled `<Link>` "Create document" button with `<StickerButton>`. Drop the em-dash bullets in favor of `✦`. Card-level hover state: lift shadow (`hover:shadow-sticker-lg hover:-translate-y-0.5`) — already part of `<StickerCard>` if implemented per §3.

### "Coming soon" section
Rename: **"On the way ✦"** (mono eyebrow), heading **"Future fights"**.
Each card: `<StickerCard tint="white" rotate={0}>` with `opacity-60` and a small mono pill **"COMING SOON"** in the top-right corner. Keep the 2-column compact layout — these aren't the hero of this page.

### CTA at the bottom
Add a closing `<StickerCard tint="sky-tint">` row: **"Don't see your situation?"** → marker line *"tell us — we add new types based on what people ask for ✦"* + ghost button "Email us".

---

## 13. Pricing → "Pay per fight"

File: `app/(main)/pricing/page.tsx`

This page is dense — tiers + comparison + subscription + vs-table + FAQ. Don't lose the substance; tighten the rhythm.

### Page header
- H1 → Fraunces 800: **"Pay per** `<Highlight>` **fight** `</Highlight>`"
- Subhead → keep: "Pay per document. No subscription required." (it's already perfect — short, factual)

### Tier cards
The two tiers (`Send the Letter` / `Go Full Petty`) become `<StickerCard>`s. The recommended one gets the lemon tape strip + larger shadow:

```tsx
{TIERS.map(tier => (
  <StickerCard
    key={tier.name}
    tint={tier.highlight ? 'white' : 'white'}
    rotate={tier.highlight ? 0 : -0.5}
    className={tier.highlight ? 'shadow-sticker-lg' : ''}
  >
    {tier.highlight && <Tape color="lemon" position="top">RECOMMENDED</Tape>}
    <h2 className="font-display font-extrabold text-2xl mb-1">{tier.name}</h2>
    <p className="font-display font-extrabold text-5xl mt-3">{tier.price}</p>
    <p className="text-sm mb-6">one-time payment</p>
    <ul className="space-y-3 mb-8">
      {tier.features.map(f => (
        <li key={f} className="text-base flex gap-2">
          <span className="text-grass font-bold">✓</span>{f}
        </li>
      ))}
    </ul>
    <StickerButton
      as={Link}
      href="/wizard"
      variant={tier.highlight ? 'primary' : 'ghost'}
      size="md"
      className="w-full"
    >
      {tier.highlight ? 'Go full petty' : 'Send the letter'}
    </StickerButton>
  </StickerCard>
))}
```

**Don't** put marker font on the prices. Numbers stay clean (Fraunces 800).

### Comparison table
Wrap in a `<StickerCard tint="white">`. Inside, keep the existing 3-column grid but:
- Header row background → `bg-paper-alt` instead of `bg-background`
- Cell borders → `border-foreground/15` (faint, not the heavy ink)
- ✓ → grass color, ✗ → use `<span className="text-stamp">✗</span>` instead of em-dash for clearer "no"

### Subscription card
Currently a centered card with "Coming soon" pill. Restyle as a thin `<StickerCard tint="pink-tint" rotate={-0.5}>` strip — half-width, asymmetric. Marker note inside: *"frequent filer? we're working on it ✦"*. Replaces the formal centered "Monthly Subscription" framing — your audience is one-off filers, not enterprise.

### "How we compare" vs-table
Keep the table — the content is excellent. Wrap in `<StickerCard>`, restyle:
- Header above table → Fraunces 800: **"vs. lawyer · vs. DIY"**
- Subhead — keep, factual
- Petty Lawsuits column header gets `<Highlight>` treatment around "Petty Lawsuits"
- The footnote ("Solicitor cost estimates are indicative…") **stays plain DM Sans, no styling**. It's a disclaimer.

### Pricing FAQ section
Use the FAQ row pattern (§4) — but with one twist: this is *pricing* FAQ, embedded in a marketing page, so it gets the v2 sticker chrome (unlike the main `/faq` page which stays plain).

Header: **"questions before you commit?"** in display-md. Each Q on a thin sticker card border, `+ / —` typographic toggle. Q text Fraunces 700; A text DM Sans 15.5.

The "Is this legal advice?" answer — keep verbatim, plain register inside the card. This rule is universal: legal-content always plain.

---

## 14. About → "Why we built this"

File: `app/(main)/about/page.tsx`

This page is short and nearly there. Sharpen the H1 and the dual cards; leave the prose mostly intact.

### Hero
- H1 → Fraunces 800: **"Built for** `<Highlight>` **the wronged Aussie** `</Highlight>` **who can't justify a lawyer"** (replaces "Built for Australians who can't justify a lawyer" — same idea, sharper hook)
- Add an optional eyebrow: marker font, rotated, *"the founder's story ✦"* (only if you write actual founder copy)

### Body prose
Keep the three opening paragraphs almost as-is — they're well-written, factual, and sympathetic. Two small tweaks:
- Wrap "real problems that deserve real solutions" with `<Highlight>`
- Bump the prose to body-lg (18px) — currently at text-lg already, perfect
- Add `text-foreground` (not `text-muted`) on the prose. Body copy this important shouldn't read as muted.

### "What we are / are not" cards
Currently two side-by-side bordered boxes — exactly the right structure, wrong chrome.

```tsx
<div className="grid sm:grid-cols-2 gap-4 mt-14">
  <StickerCard tint="lemon-tint" rotate={-1}>
    <h2 className="font-display font-extrabold text-2xl mb-4">What we are</h2>
    <p className="text-base leading-relaxed">…</p>
  </StickerCard>
  <StickerCard tint="white" rotate={0.5}>
    <h2 className="font-display font-extrabold text-2xl mb-4">What we are not</h2>
    <p className="text-base leading-relaxed">…</p>
  </StickerCard>
</div>
```

The "What we are not" card content — **keep verbatim, plain register**. This is the most important trust block on the entire site.

### "How it works" mini-section
Currently a single bordered card with 3 numbered columns. Replace with three small `<StickerCard>`s in a row, mixed tints (sky/pink/grass), each with a chunky 01/02/03 in Fraunces 800. Same content, sticker treatment.

### Add: pre-footer CTA
The current page just ends. Add the recipe-A pre-footer band:
```tsx
<StickerCard tint="lemon" className="mt-20 text-center py-12">
  <h2 className="font-display font-extrabold text-3xl mb-2">Got something to be petty about?</h2>
  <p className="font-marker text-2xl text-clay-deep -rotate-1 mb-6">we'll write it for you ✦</p>
  <StickerButton as={Link} href="/wizard" variant="primary" size="lg">Sue someone</StickerButton>
</StickerCard>
```

---

## 15. FAQ → stays calm (this is the contrast play)

File: `app/(main)/faq/page.tsx`

**This page does NOT get the full sticker treatment.** Recipe F (§5). The FAQ is where users go when they're hesitating, anxious, or doing due diligence. Loud doesn't help here. Calm sells.

### Page header (lightly v2)
- H1 → Fraunces 700 (note: 700, not 800): "Frequently asked questions" — no Highlight, no marker
- Subhead → stays as-is

You can give the H1 *one* small concession to v2 — wrap "asked" in a very subtle `<Highlight>` if you want any tie-back to the system. But honestly, leave it plain.

### Section cards
Keep the `<section className="border …">` wrapper — but swap to:
- 1.5px ink border (slightly heavier than current, not the full 2px sticker treatment)
- No sticker shadow
- `bg-paper-alt` instead of `bg-card` for visual calm
- Section title in Fraunces 700 (not 800)

```tsx
<section className="border-[1.5px] border-foreground/40 rounded-xl bg-paper-alt p-6 md:p-8">
  <h2 className="font-display font-bold text-xl mb-4">{section.title}</h2>
  …
</section>
```

### FAQItem component
The current `+ / —` toggle is already the right move (§8 anti-patterns explicitly approves it).
- Question font: keep DM Sans 500, base size — *don't* upgrade to Fraunces here. Consistency matters more than emphasis on a list of 15 questions.
- Answer: stays as-is, leading-relaxed, muted.
- Hover state on the row: faint background tint on hover (`hover:bg-foreground/[0.03]`), no shadow.

### Voice — the one rule
**Every FAQ answer keeps its current factual phrasing.** Do not rewrite "Is this legal advice?" with marker accents. Do not say "Yes anon, you can absolutely fire it off via .docx". The voice here is identical to a Big-4 SaaS product page — short sentences, clear answers, plain English.

The only acceptable v2 microcopy substitution on this page is in question titles, where the *user* might say things in v2 voice:
- "What's the difference between Send the Letter and Go Full Petty?" — keep verbatim, those are tier names

### Add: pre-footer escape hatch (lightly v2)
At the bottom of the page, after all sections, add a thin sticker card to redirect users who didn't find their answer:
```tsx
<StickerCard tint="white" rotate={0} className="mt-12 text-center py-8">
  <h3 className="font-display font-bold text-xl mb-2">Didn't find your answer?</h3>
  <p className="text-base mb-4">Email <a href="mailto:hello@petty-lawsuits.com" className="underline decoration-2 underline-offset-2">hello@petty-lawsuits.com</a> and we'll come back within a day.</p>
</StickerCard>
```

This is the *one* sticker on the FAQ page. It's an action prompt, not a content section — that's why it's allowed.

---

## 16. Cross-page consistency checks

Once all five pages are migrated, do a single sweep across them:

### Visual
- [ ] All pages share the same H1 hierarchy (Fraunces 800 for marketing/A, Fraunces 700 for FAQ/F)
- [ ] Pre-footer CTA exists on home + how-it-works + documents + about (NOT pricing — its FAQ is the natural close; NOT FAQ — calm register)
- [ ] No raw hex codes anywhere — `grep -r '#[0-9A-Fa-f]\{6\}' app/` should only return matches inside `globals.css` and these handoff docs
- [ ] No raw `<button>`-styled-as-button outside `components/ui/`

### Voice
- [ ] Marker font appears only in the three approved places (§6)
- [ ] One Highlight per heading, max
- [ ] Every "Is this legal advice?" / disclaimer / "What we are not" / footnote / FAQ legal answer is **plain register**

### Routing
- [ ] All CTAs across pages route to `/wizard` (or `/documents` if it's a "browse first" CTA)
- [ ] FAQ page is reachable from the footer of every page (it's the trust anchor)

---

## 17. Recommended ship order

These pages are independent — ship in any order — but if you want guidance:

1. **About** (smallest blast radius, easiest win, high SEO value) — ship in 30 min
2. **How it works** (reinforces the wizard message; people read this *before* starting) — 1–2 hours
3. **Documents** (the conversion fork — picks up traffic from "/documents" search) — 2 hours
4. **Pricing** (the densest page; do it when you have a clean head) — 3–4 hours
5. **FAQ** (last, because it's the *least* visual lift but matters most to keep restrained) — 1 hour

Total: ~1 focused day of work. Each page is independently deployable.

---

## 18. After this migration

When phase 2 is complete, the public site is fully on v2. What's left after that:

- `/wins`, `/dashboard`, `/account`, `/preview/*` — covered by Phase 1 (`v2-handoff.md` steps 5–8)
- `/jurisdictions/*`, `/tools/*` — these are factual reference pages. Apply Recipe F (FAQ register), not Recipe A. They're closer to FAQ in voice.
- `/login`, `/signup`, `/verify` — small surfaces. Recipe A in lite form: Fraunces 700 H1, sticker inputs, primary `<StickerButton>`. No stamps, no XP, no marker. Auth flows should feel quick and trustworthy, not gamified.
- `/terms`, `/privacy` — Recipe F, **strict**. These are the most legal-formal pages on the site. No v2 microcopy substitutions anywhere.

---

## 19. Don't break (page-specific reminders)

| Page | Don't |
|---|---|
| How it works | Don't drop "Not legal advice" subsection. Keep its plain wording verbatim. |
| Documents | Don't reorder/rename the available categories — they map to actual document templates in the API. |
| Pricing | Don't change the dollar amounts or tier names without coordinating with Stripe products + the wizard's tier-selection screen. |
| About | Don't rewrite the "What we are not" card. That paragraph is a legal liability statement. |
| FAQ | Don't apply v2 chrome to the FAQ content cards. The whole point is the calm register. |

---

*phase 2 complete — go forth and finish the petty ✦*

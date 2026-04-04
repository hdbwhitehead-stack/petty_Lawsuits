# Homepage & Marketing Pages — Design Spec

**Date:** 2026-04-04
**Status:** Draft

---

## Overview

A set of public-facing pages that communicate what Petty Lawsuits is, how it works, what it costs, and why someone should use it. These pages sit outside the auth wall and serve as the front door to the product.

**Tone:** Professional and credible, with personality where the brand allows it. Not corporate, not jokey — confident and direct. The name "Petty Lawsuits" carries the personality; the copy supports it without overdoing it.

**Design direction:** Minimal and modern. Generous whitespace, restrained colour palette, clean typography. No stock photos, no gradients, no visual clutter. Let the content breathe. Think Linear, Vercel, or Stripe — not a template.

---

## Shared Layout

### Header

Fixed top nav, clean and minimal:

- **Left:** "Petty Lawsuits" wordmark (text, not a logo image for now)
- **Centre/Right:** How It Works, Documents, Pricing, About, FAQ
- **Far right:** "Get Started" button (links to `/wizard`)

On mobile: hamburger menu with the same links.

### Footer

Simple, understated:

- **Row 1:** Same nav links as header
- **Row 2:** "This is a document generation tool, not a legal service. It does not constitute legal advice." in small text
- **Row 3:** © 2026 Petty Lawsuits

---

## Pages

### Homepage (`/`)

**Hero section:**
- Large headline: "Legal documents for Australian disputes — without a lawyer."
- Subheadline: "Generate demand letters, complaint notices, and tribunal filings in minutes. From $29."
- Single CTA: "Get Started" → `/wizard`
- Nothing else in the hero. No image, no illustration. Just text and the button.

**How It Works section:**
- Heading: "Three steps to your document"
- Three columns, each with a number (1, 2, 3), a short title, and one sentence:
  1. "Describe your situation" — "Answer a few questions about who you're claiming against and what happened."
  2. "We generate your document" — "AI drafts a formal legal document tailored to your jurisdiction and circumstances."
  3. "Download and send" — "Review, edit, and download as PDF or Word. Ready to send."
- Link: "Learn more about how it works →" → `/how-it-works`

**Document Types section:**
- Heading: "What can you create?"
- Grid of cards (2 or 3 columns on desktop, stacked on mobile). Each card:
  - Category name (e.g. "Debt & Money")
  - One-line description (e.g. "Demand repayment of money owed to you")
- Link: "See all document types →" → `/documents`

**Pricing section:**
- Heading: "Simple pricing"
- Two cards side by side (same layout as the unlock modal but without checkout buttons):
  - Send the Letter — $29 — bullet list of what's included
  - Go Full Petty — $49 — bullet list of what's included
- Small text below: "Need unlimited documents? See our subscription plan."
- Link: "View full pricing →" → `/pricing`

**Final CTA section:**
- Heading: "Ready to get started?"
- Subheading: "Your first document takes about 5 minutes."
- Button: "Create your document" → `/wizard`

---

### How It Works (`/how-it-works`)

Expanded version of the homepage section. One section per step with more detail:

**Step 1: Tell us about the dispute**
- Explain the four wizard steps (Defendant → Claimant → Incident → Evidence) in plain language
- Mention: no account needed to start, jurisdiction auto-detected from location

**Step 2: AI generates your document**
- Explain that the document is generated from a legal template, tailored to their situation
- Mention: formal Australian English, jurisdiction-aware (correct tribunal names, filing limits)
- Note: this is not legal advice — it's a document tool

**Step 3: Review, edit, and download**
- Explain the preview → unlock → edit → download flow
- Mention: editable fields (names, dates, amounts), PDF and Word export
- Mention: documents are saved to your account permanently

---

### Document Types (`/documents`)

Full listing of all document categories with detail:

For each category (Debt & Money, Consumer, Tenancy, Neighbour Disputes, Employment, Contracts, Court Filings):
- Category heading
- 2-3 sentence description of when you'd use this
- Example scenarios (e.g. "Your landlord is withholding your bond unfairly")
- CTA: "Create a [category] document →" → `/wizard`

Categories with templates not yet built show "Coming soon" instead of a CTA.

---

### Pricing (`/pricing`)

**Two-tier layout:**
Side-by-side cards (same structure as homepage but with full detail):

**Send the Letter — $29**
- Full document access
- Download as PDF
- Email delivery to recipient
- Saved to your account

**Go Full Petty — $49** (highlighted as recommended)
- Everything in Send the Letter
- Download as Word doc
- Edit all fields in-browser
- Certified mail tracking
- Follow-up letter template

**Subscription section below:**
- "For businesses and frequent filers"
- Monthly subscription — pricing TBD (~$49-79/month)
- Unlimited document generation
- All documents permanently accessible
- "Coming soon" for now — no checkout button

**FAQ section at bottom of pricing page:**
- "What happens after I pay?"
- "Can I edit my document after purchasing?"
- "What if the generation fails?"
- "Is this legal advice?" (No.)

---

### About Us (`/about`)

**Placeholder content (to be personalised later):**

- Heading: "Built for Australians who can't justify a lawyer"
- Body: 2-3 paragraphs covering:
  - The problem: small disputes where hiring a lawyer costs more than the claim is worth
  - The solution: affordable, AI-generated legal documents that are jurisdiction-aware
  - The position: this is a tool, not a law firm — we make the paperwork easy so you can focus on getting what you're owed
- No team photos or bios for now — just the brand story

---

### FAQ (`/faq`)

Collapsible accordion layout. Questions grouped by topic:

**About the service:**
- "What is Petty Lawsuits?"
- "Is this legal advice?" — No. Clear disclaimer.
- "What jurisdictions do you cover?" — All Australian states and territories.
- "What types of documents can I create?"

**Using the product:**
- "Do I need an account to start?" — No, you can complete the wizard without signing up.
- "How long does it take?" — About 5 minutes for the wizard, generation takes under 30 seconds.
- "Can I edit my document after generation?"
- "What formats can I download?"

**Pricing & payments:**
- "What's the difference between Send the Letter and Go Full Petty?"
- "Is there a subscription option?"
- "What if the document generation fails?" — You won't be charged.
- "Can I get a refund?"

**Privacy & data:**
- "What happens to my data?"
- "How long do you keep my documents?"
- "Can I delete my account and data?"

---

## Design Notes

- **Colour palette:** Black, white, and one accent colour (to be decided in design pass). No other colours.
- **Typography:** System font stack or a single clean sans-serif (Inter, Geist, or similar). Two weights max: regular and bold.
- **Spacing:** Generous. Sections separated by large vertical padding. Nothing should feel cramped.
- **Cards:** Subtle border, no shadow or very light shadow. No background colour fills except for the highlighted pricing tier.
- **Buttons:** Primary (black background, white text, small border-radius). Secondary (border only). No other button styles.
- **Mobile:** All pages must work on mobile. Grid layouts collapse to single column. Nav becomes hamburger.
- **Animations:** None for now. No scroll animations, no transitions beyond basic hover states.

---

## Out of Scope

- Contact page (later)
- Blog / content marketing pages
- SEO metadata (later)
- Dark mode
- Illustrations or custom graphics
- Legal pages (Terms of Service, Privacy Policy — requires lawyer review)

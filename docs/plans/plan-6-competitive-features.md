# Plan 6 — Competitive Features & Growth

**Source:** Feature audit of pettylawsuit.com (US competitor), April 2026
**Goal:** Close the most impactful feature gaps to improve conversion, SEO, and user retention

This plan is organised by strategic category, then prioritised within each category. Features are adapted for the Australian market.

---

## Category A: Interactive Tools & Calculators

Free tools that capture high-intent users at the top of the funnel and feed them into the paid wizard.

### A1. Court/Tribunal Fees Calculator
- Select state/territory + claim amount → get filing fee
- Cover NCAT (NSW), VCAT (VIC), QCAT (QLD), SAT (WA), SACAT (SA), TASCAT (TAS), ACAT (ACT), NTCAT (NT), plus Magistrates Courts
- Include fee waiver / hardship exemption guidance per jurisdiction
- CTA: "Know your fees — now start your letter" → wizard

### A2. Claim Amount Calculator
- User adds itemised damage line items (label + amount)
- Toggle to include estimated filing and service fees
- Optional interest calculation (simple/compound, start/end date)
- Show running total with breakdown
- Reference table of statutory interest rates by state (Penalty Interest Rates Act VIC, Civil Procedure Act NSW, etc.)
- CTA: "Your claim is worth $X — let's get it back" → wizard

### A3. Statute of Limitations Checker
- Select state/territory + claim type (written contract, oral contract, property damage, debt, etc.)
- Display limitation period and urgency messaging ("You have X months remaining — don't wait")
- Reference each state's Limitation Act
- CTA: "Time is running out — start your demand letter now" → wizard

---

## Category B: New Document Types

Expand beyond demand letters to capture adjacent use cases.

### B1. Cease & Desist Letters
- New document type in the wizard (alongside demand letters)
- Cover: harassment, defamation, IP infringement, noise complaints, debt collector harassment, stalking/intimidation
- Different legal framing from demand letters ("stop doing X" vs "pay me Y")
- Same generation pipeline (Claude API, templates, jurisdiction helpers)
- Minimal new UI — add a document-type selector at wizard start

### B2. Final Notice / Follow-Up Letters
- After a demand letter's response deadline passes, offer to generate a "Final Notice" escalation letter
- Surface this via the dashboard or email notification: "Your deadline has passed — send a Final Notice?"
- References the original demand letter and warns of tribunal filing
- Could be automated (cron job checks deadlines) or manual (user-triggered from dashboard)

### B3. Case Brief for Hearing
- Generate a structured case brief document from existing case data
- For users who proceed to tribunal after demand letter is ignored
- Includes: timeline of events, evidence summary, claim amount breakdown, relevant law, what to say at hearing
- Upsell opportunity (premium tier or add-on)

---

## Category C: Wizard & Generation Enhancements

Improvements to the core document generation flow.

### C1. ABN/ACN Business Lookup
- In the Defendant step, let users search by business name
- Query ASIC/ABN Lookup API to auto-fill: registered name, ABN/ACN, registered address, officeholders
- Reduces friction and improves document accuracy (correct legal entity name matters)
- ASIC has a public API; ABN Lookup is free for registered users

### C2. Claim Amount Suggestions
- After user describes their dispute, suggest an appropriate claim amount based on similar case types
- Show jurisdiction claim limit (e.g. "NCAT handles claims up to $100,000")
- Warn if claim exceeds tribunal limit and suggest alternatives

### C3. Evidence Photo/File Upload
- Accept image uploads (photos of damage, screenshots of messages, receipts) in the Evidence step
- Store in Supabase Storage
- Optionally include as attachments in exported PDF/Word documents
- Hash and timestamp uploads for evidentiary integrity

### C4. "Type Who You Want to Sue" Hero Input
- Replace or augment the current homepage CTA with a typeahead input
- User types defendant type (e.g. "landlord", "builder", "Telstra") and clicks Start
- Routes to wizard with context pre-filled
- Lowers the click-to-engage barrier significantly

---

## Category D: Post-Generation Workflow

Features that help users after their document is generated.

### D1. Response Deadline Tracking & Alerts
- Extract the response deadline from the generated demand letter
- Show countdown on dashboard: "Response due in 12 days"
- Send email reminders at 7 days, 3 days, and deadline day via Resend
- If deadline passes with no response, prompt Final Notice (B2) or tribunal filing next steps

### D2. Document Delivery to Defendant (Email)
- Collect defendant's email address in the wizard
- Offer to send the demand letter directly to the defendant on the user's behalf
- Track read receipts (Resend supports this)
- Free tier: email delivery; paid add-on: tracked post (see D3)

### D3. Physical Mail Delivery (Australia Post)
- Send demand letter via Australia Post Registered Post with signature tracking
- Provides court-admissible proof of service
- Requires print/mail fulfilment partner integration (e.g. PostGrid, Lob, or direct Australia Post API)
- Paid add-on ($15–$20)
- **Note:** Significant operational complexity — evaluate ROI before building

### D4. Pre-Filled Tribunal Forms
- If demand letter is ignored, generate pre-filled tribunal application forms
- Pull data from existing case record (parties, claim amount, dispute details)
- Cover NCAT, VCAT, QCAT at minimum (highest population states)
- Currently NextStepsPanel links to forms — this would fill them in

---

## Category E: SEO & Content Infrastructure

Programmatic and editorial content to drive organic acquisition.

### E1. Per-Jurisdiction Landing Pages (8 pages)
- One page per state/territory: `/tribunals/nsw`, `/tribunals/vic`, `/tribunals/qld`, etc.
- Content: tribunal name, claim limits, filing fees (tiered table), process steps, statute of limitations by claim type, evidence checklist, jurisdiction-specific FAQ
- Cross-link to city pages (E2) and claim type pages (E3)
- Show "Last updated" date on each page

### E2. Per-City Landing Pages (programmatic)
- Pages for major cities: `/demand-letter/[type]/sydney-nsw`, `/demand-letter/[type]/melbourne-vic`, etc.
- Include local tribunal registry address and phone, local filing fees
- Cross-link to jurisdiction page and other cities
- Start with top 8–10 cities, expand programmatically
- URL pattern: `/demand-letter/[claim-type]/[city-state]`

### E3. Per-Claim-Type Hub Pages
- Deep landing page per dispute category: `/demand-letter/bond-deposit`, `/demand-letter/unpaid-wages`, `/demand-letter/property-damage`, `/demand-letter/breach-of-contract`, `/demand-letter/consumer-guarantees`, `/demand-letter/contractor-dispute`
- Content: explainer, average recovery stats (when available), step-by-step how-to, DIY vs service vs lawyer comparison table, claim-type-specific FAQ accordion, pro tips, city selector grid, related claim types
- "People Also Ask" section targeting long-tail queries

### E4. All-Jurisdictions Reference Table
- Single page: `/guides/tribunal-limits`
- Table covering all 8 states/territories: tribunal name, claim limit, filing fees, time limits, contact
- Highly linkable anchor page for SEO
- Include "last updated" date and source attribution

### E5. Blog Infrastructure
- Blog at `/blog` with:
  - Named authors with bios and photos
  - Table of contents sidebar for long-form posts
  - "TL;DR" collapsible summary at top
  - Read time indicator
  - Topic tags / categories
  - Related articles section (3 cards)
  - In-article product CTAs (mid and end)
  - Social share buttons (X, Facebook, LinkedIn)
- Initial article categories:
  - Jurisdiction how-to guides ("How to File at NCAT in NSW")
  - Evergreen demand letter guides ("How to Write a Letter of Demand in Australia")
  - Cost/fee transparency ("What Does It Cost to Go to VCAT?")
  - Dispute-type explainers ("Getting Your Bond Back in Queensland")

### E6. Demand Letter Template Library
- Public-facing page at `/templates`
- Free preview/basic templates for each claim type
- Captures traffic from "demand letter template Australia" searches
- CTA: "Want a custom, legally-formatted version? Start for free" → wizard

### E7. Industry/Defendant-Type Pages
- Pages per common defendant category: `/disputes/landlords`, `/disputes/builders`, `/disputes/telcos`, `/disputes/airlines`, `/disputes/retailers`
- Cover disputes specific to that industry, relevant Australian law (RTA, ACL, Fair Work Act)
- Name common defendants for SEO ("How to dispute with Ray White", "Taking Telstra to the TIO")
- **Note:** Legal review needed for naming specific companies

---

## Category F: Conversion & Trust

UX and copy improvements to increase conversion rate.

### F1. DIY vs Service vs Lawyer Comparison Table
- Side-by-side table on pricing page and claim-type pages
- Compare: cost, time, quality, legal citations, tribunal-ready, tracking
- DIY letter ($0, hours, no guarantees) vs Our service ($X, minutes, formatted) vs Solicitor ($300–$500+, days)

### F2. Social Proof & Success Metrics
- Live case counter on homepage (Supabase count query)
- Scrolling win ticker / marquee with anonymised success stories
- Hero stats bar: Average claim value, Time to generate, Documents created, States covered
- Case testimonials with: dollar amount, case type, resolution time, quote, city
- **Note:** Use real data once available; placeholder "built for Australians" messaging pre-launch

### F3. Money-Back Guarantee
- "30-day money-back guarantee" on pricing page and unlock modal
- Reduces purchase anxiety for first-time users
- Simple policy: if document is unsuitable, full refund

### F4. "No Credit Card Required" Messaging
- Add explicit "No credit card required to start" below CTAs
- We already support anonymous wizard flow — just need to say it

### F5. ROI Framing on Pricing
- "Average Australians recover $X. That's a Y× return on [our price]."
- Reframe cost as investment with quantified return

### F6. Pricing Tier Use-Case Labels
- "PERFECT FOR:" section on each pricing tier
- Examples: "Unpaid invoices under $5,000", "Bond disputes with landlords"
- Helps users self-select the right option

### F7. Named AI Persona / Brand Character
- Give the AI assistant a branded name and personality
- Appears in wizard interactions and marketing copy
- Creates memorability and personality (low implementation cost — copy + one image asset)

---

## Category G: Site Infrastructure & Trust Signals

### G1. Public Accessibility Statement Page
- `/accessibility` page with WCAG 2.1 AA commitment
- List supported assistive technologies
- Accommodation request contact email
- We already have the compliance work done (e2e tests, contrast fixes) — just need the public page

### G2. Editorial Methodology / Research Page
- `/about/research` page explaining how content is sourced
- Primary sources: official tribunal websites, legislation.gov.au, state Limitation Acts
- Update cadence commitment
- Correction submission email (`corrections@[domain]`)

### G3. "Last Updated" Dates on Content Pages
- Show date on every guide, blog post, and reference page
- Signals freshness to Google (critical for YMYL legal content)

### G4. Per-Page Legal Disclaimer
- Inline disclaimer on every content page (not just footer)
- "This is general information, not legal advice. For specific legal advice, consult a solicitor."
- We already have this position — just need consistent placement

### G5. Site-Wide Announcement Banner
- Dismissible top banner for status messages, promotions, or maintenance notices
- Simple component, useful ongoing

### G6. Structured Navigation with Guides/Resources
- Add "Guides" and "Resources" as primary nav items with dropdowns
- As content library grows, discoverability becomes critical
- Footer: add "Popular Topics" column linking to high-traffic claim type pages

---

## Suggested Build Priority

**Phase 6a — High impact, low effort (1–2 weeks)**
- F1 (comparison table), F3 (money-back guarantee), F4 (no credit card messaging), F5 (ROI framing), F6 (tier labels)
- G1 (accessibility page), G3 (last updated dates), G4 (per-page disclaimers), G5 (announcement banner)
- C4 (hero input)

**Phase 6b — High impact, medium effort (2–4 weeks)**
- A1 (fees calculator), A2 (claim amount calculator), A3 (statute of limitations checker)
- B1 (cease & desist letters)
- C1 (ABN lookup), C2 (claim amount suggestions)
- D1 (deadline tracking & alerts)
- E4 (all-jurisdictions reference table), E1 (8 jurisdiction pages)
- F2 (social proof — start with placeholder stats)

**Phase 6c — High impact, high effort (4–8 weeks)**
- E5 (blog infrastructure + initial 10 articles)
- E3 (claim-type hub pages), E2 (city pages — programmatic)
- E6 (template library)
- C3 (evidence file upload)
- B2 (final notice letters), D2 (email delivery to defendant)
- D4 (pre-filled tribunal forms)

**Phase 6d — Evaluate ROI first**
- D3 (physical mail delivery — operational complexity)
- B3 (case brief for hearing)
- E7 (industry/defendant pages — legal review needed)
- F7 (AI persona)
- G2 (research methodology page)
- G6 (structured nav — depends on content volume)

---

## Not Recommended to Copy

- **AI phone calls to defendants** — legally complex in Australia, high operational cost
- **Token / web3 features** — not relevant to our product direction
- **Ambassador/referral program** — premature pre-launch
- **Social media accounts** — not a build task; create separately when ready

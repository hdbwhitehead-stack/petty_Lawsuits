# Petty Lawsuits — Design Spec
**Date:** 2026-04-03
**Status:** Approved
**Jurisdiction:** Australia

---

## Overview

A web app that enables people to easily generate legal documents for smaller disputes and lawsuits where the cost of engaging a lawyer is uneconomic. The app guides users through a wizard to generate jurisdiction-aware Australian legal documents, offers a preview under a freemium model, and allows users to edit and download the full document after payment.

The app explicitly does **not** offer legal advice. All guidance provided is generic and informational only.

---

## Architecture

The app has four layers:

1. **Frontend (Next.js)** — all user-facing UI: wizard flow, document preview, account pages, payment screens.
2. **Backend API (Next.js API routes)** — server-side logic between the frontend and external services. Handles Claude API calls for document generation, Stripe payment webhooks, and secrets management.
3. **Database & Auth (Supabase)** — PostgreSQL database for users, documents, and purchase history. Handles authentication (email/password + Google OAuth).
4. **Payments (Stripe)** — manages pay-per-document unlocks and monthly subscriptions. Webhooks update Supabase when payments complete.

**Core document generation flow:**
> User answers wizard → backend sends to Claude API → Claude fills document template → stored in Supabase → user sees blurred preview → pays via Stripe → full document unlocked → user edits in-browser → downloads PDF or Word

---

## User Flow

### New visitor
1. Lands on homepage with examples of document types
2. Clicks "Get Started"
3. Completes wizard questions (no account required at this stage)
4. Chooses entry point:
   - *Describe my situation* — free text, Claude interprets and routes to correct document type
   - *I know what I need* — browse by category
5. Sees partial preview of generated document — at least one full section or 150 words (whichever is greater) shown clearly, remainder replaced server-side with placeholder text before being sent to the browser. This is not a CSS blur (which is extractable from the DOM) — the redacted content is never transmitted to the client until unlocked.
6. **Sign-up gate fires here** — prompted to create a free account before payment. This maximises wizard completion rate while still requiring an account before money changes hands.
7. Pays to unlock (pay-per-doc or subscription)

### Returning user
1. Logs in → dashboard of saved documents
2. Create new documents or continue drafts
3. Manage billing from account settings

### After unlocking
- Full document displayed in a simple in-browser editor (see Editor section below)
- User can adjust placeholder fields (names, amounts, dates, addresses)
- Download as PDF or Word
- Generic (non-advice) next-steps blurb shown alongside document (e.g. referencing NCAT/VCAT/QCAT based on state)

---

## Legal Disclaimers & Compliance

The app is a document generation tool, not a legal services provider. To minimise liability:

- **Onboarding disclaimer** — users must accept terms of service before running their first wizard. Terms explicitly state the app provides document templates only and does not constitute legal advice.
- **Per-document disclaimer** — every generated document displays a notice: *"This document was generated using a template tool. It is not legal advice. You should seek independent legal advice if you are unsure about your rights or obligations."*
- **Download screen disclaimer** — same notice repeated at point of download.
- **Generic next-steps blurb** — a set of lawyer-reviewed paragraphs, one per state/territory (8 total). Each is written in neutral language, references the correct tribunal name for that state, and links to that state's legal aid service. Never instructs the user to take a specific legal action. The blurb is the same across all document categories within a state (it is not document-type-specific). Authored and reviewed by the lawyer before launch as part of the lawyer review scope.
- **Terms of service** — to be drafted by a lawyer before public launch. This is a hard dependency for go-live. Lawyer review scope includes: ToS, privacy policy, disclaimer language, and the generic next-steps blurb.
- **Data retention & privacy** — the app collects personal information (name, contact details, dispute details) and is subject to the Australian Privacy Act 1988. Placeholder policy (to be reviewed by lawyer before launch): user data and documents are deleted 24 months after last account activity; users can request full deletion at any time via account settings. This must be documented in the privacy policy before launch.

---

## Document System

### Generation approach
Each document type has a structured legal template with placeholders. Claude's role is to interpret user answers and fill placeholders intelligently, adapting tone and language to the specific situation. This ensures legal consistency while personalising the output.

**Generation timeout and validation:**
- Maximum generation wait time shown to the user: 30 seconds, with a loading indicator
- A generation is considered successful only if all required placeholders are populated in the response. The backend validates the returned document against a checklist of required fields before saving.
- If generation fails (API timeout, rate limit, malformed/incomplete output that fails validation), the document is marked `status: failed` in Supabase and the user is shown an error screen with a "Try again" button
- No charge is applied for a failed generation
- A failed generation can be retried up to 3 times before the user is directed to contact support via email
- After 3 failures, the document is marked `status: permanently_failed`. The user sees an error screen with a support email link. Support can manually trigger a fresh generation attempt from the Supabase admin panel. No payment is taken for a permanently failed document — if the user has already paid (unlikely, since generation occurs before payment), a manual Stripe refund is issued.

**Rate limiting:** Document generation requires a valid user session (anonymous generation is not permitted). Each user account is limited to 10 generation attempts per 24 hours to prevent abuse and control Claude API costs. This limit applies to free and paid users alike.

### Document categories
- **Debt & Money** — debt recovery demand letters, payment overdue notices
- **Neighbour Disputes** — nuisance, noise, boundary, damage demand letters
- **Consumer** — faulty goods/services complaints, refund demands
- **Tenancy** — bond disputes, breach of lease notices
- **Employment** — underpayment letters, Fair Work unfair dismissal
- **Contracts** — simple service agreements, freelance contracts
- **Court filings** — small claims tribunal forms (NCAT, VCAT, QCAT, etc.)

### Jurisdictional awareness
The first wizard question is always "which state or territory are you in?" — this is stored on the document and drives:
- Correct tribunal name (NCAT/NSW, VCAT/VIC, QCAT/QLD, SAT/WA, etc.)
- Filing thresholds and limits per state inserted into the Claude prompt
- Procedural notes in the generic guidance blurb
- Template variant selection where state law differs materially

States/territories covered: NSW, VIC, QLD, WA, SA, TAS, ACT, NT.

### Document versioning
Two stored versions per document (not a full audit log — simpler and sufficient for MVP):
- **`original`** — the Claude-generated content, stored once at generation time. Never overwritten.
- **`current`** — the user's latest edits. Overwritten on every save.

"Restore original" copies `original` back into `current`. There is no version history beyond these two states. This avoids unbounded storage growth from auto-saves and keeps the data model simple.

---

## In-Browser Editor

The editor is a **form-field based editor**, not a free-text rich-text editor. This is deliberate: Claude generates a structured document where variable fields (names, dates, amounts, addresses) are identified and exposed as editable inputs. The surrounding legal text is read-only.

This approach:
- Keeps the legal template intact and consistent
- Is significantly simpler to build than a full rich-text editor
- Prevents users from accidentally corrupting document structure

**Editor behaviour:**
- Editable fields are highlighted inline within the document view
- Changes auto-save every 30 seconds and on blur
- A manual "Save" button is also available
- "Restore original" reverts all fields to the Claude-generated values
- PDF and Word exports are generated server-side (not in the browser) to ensure consistent formatting

**PDF/Word generation:**
Server-side generation using `@react-pdf/renderer` for PDF and the `docx` npm library for Word. Generation is triggered on demand (not in real time as the user types). Generated files are written to Supabase Storage. The frontend receives a time-limited signed URL to trigger the download. Re-downloading retrieves the stored file via a fresh signed URL — no regeneration required.

**Known risk:** `@react-pdf/renderer` has limitations with complex layouts and precise pagination. Before launch, PDF output for each document category must be manually reviewed for formatting quality (signature blocks, paragraph numbering, page breaks). If layout fidelity is insufficient, the fallback is server-side Puppeteer-based PDF generation (HTML → headless Chrome → PDF), which offers more precise control at higher server cost.

---

## Monetisation

### Free tier
- Create account
- Run wizard
- View partial/blurred document preview
- Read generic next-steps guidance (all users)

### Pay-per-document
- One-off payment to unlock a single document (~AUD $15–25)
- Unlocks full document, in-browser editor, PDF/Word download
- Document stored permanently in account regardless of future subscription status

### Subscription
- Monthly plan (~AUD $30–50/month) for unlimited document generation
- Targeted at small business owners with recurring needs
- All documents generated under an active subscription remain accessible if subscription lapses, but new generation requires resubscribing
- **Lapse rule:** A document generated during an active subscription is treated as permanently unlocked at the moment of generation. `unlocked` is set to `true` when the document is created under an active subscription. Previously unlocked documents are not re-checked dynamically. However, **new generation attempts always check current subscription status** — a lapsed subscriber cannot generate new documents even if they have existing unlocked ones.

### Data model
Each document row in Supabase has:
- `unlocked: boolean` — true if unlocked via pay-per-doc payment
- `user_id` — links to the user

A separate `subscriptions` table tracks active Stripe subscriptions per user. The backend checks `unlocked = true` OR `subscription_active = true` before serving full document content.

### Payment unlock flow & failure handling
1. User initiates Stripe Checkout
2. On successful payment, Stripe sends a webhook to the Next.js API route
3. The webhook handler sets `unlocked = true` in Supabase (idempotent — duplicate webhooks are safe)
4. The frontend polls for document status via Supabase Realtime, updating the UI when the unlock is confirmed
5. If the webhook is delayed >30 seconds, the user sees a "Payment received — your document is being unlocked" holding screen
6. If a payment succeeds but the document fails to unlock after 5 minutes: Supabase triggers a Resend email to the user ("We're looking into this — reply to this email for help") and a copy to the support inbox. Stripe refunds are issued manually for these edge cases in the early stage.

**Subscription webhook events handled:**
- `checkout.session.completed` — initial subscription created, set subscription active
- `invoice.payment_succeeded` — subscription renewed, keep active
- `invoice.payment_failed` — payment failed, mark subscription at-risk (user notified by Stripe)
- `customer.subscription.deleted` — subscription cancelled or lapsed, mark inactive. Existing unlocked documents remain accessible; new generation blocked.

---

## Authentication

- Email/password signup and Google OAuth, both via Supabase Auth
- Sign-up gate fires **after the wizard is complete but before payment** — this maximises funnel completion
- Unregistered users can complete the full wizard and see the blurred preview; account creation is required only to pay
- Email verification is required before payment is accepted

**Post-registration holding screen:**
After signup (email/password), the user is shown a "Check your inbox" screen. The document they generated is saved as an anonymous/unowned Supabase row, keyed to a UUID stored in `localStorage`. Once they click the verification link, they are redirected back to the payment screen and the document is claimed to their account. If they close the browser before verifying, the UUID persists in `localStorage` — on next visit the app detects it, prompts login/verification, and resumes the payment flow. The wizard does not need to be repeated.

**Google OAuth:** If a user signs up via Google OAuth, email is already verified by Google. The "Check your inbox" screen is skipped and the user proceeds directly to payment.

**Anonymous document claim:** After email verification, the app claims the anonymous document row keyed to the UUID present in the verifying browser session. If the user opened the wizard in multiple browsers and completed it in both, only the UUID from the verifying session is claimed. Anonymous rows from other sessions are abandoned (not imported). This is the defined policy — no silent data loss, intentional simplification.

**Concurrent sessions:** Multi-tab simultaneous editing is not supported. Last save wins. No warning is shown — this is a documented decision, not an oversight.

---

## Email Notifications (MVP scope)

Transactional email is **in scope for MVP** using Supabase's built-in auth emails plus a lightweight provider (Resend or SendGrid) for:
- Email verification on signup
- "Your document is ready" confirmation after generation
- Payment receipt (also handled by Stripe)

Marketing/promotional email is out of scope for MVP.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Frontend & Backend | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS |
| Database & Auth | Supabase (PostgreSQL + Auth + Storage) |
| AI | Claude API — `claude-sonnet-4-6` |
| Payments | Stripe (one-off + subscriptions + webhooks) |
| PDF export | `@react-pdf/renderer` (server-side) |
| Word export | `docx` npm library (server-side) |
| Email | Resend (transactional) |
| Hosting | Vercel (auto-deploys from GitHub `main`) |

---

## Development Workflow

- Two developers working on feature branches
- Pull requests merged to `main` on GitHub
- Vercel automatically deploys on merge to `main`
- Environment variables (Supabase keys, Stripe keys, Claude API key, Resend key) stored in Vercel and `.env.local` locally

---

## Accessibility & Browser Support

- Target: WCAG 2.1 AA compliance
- Browser support: last two major versions of Chrome, Safari, Firefox, and Edge
- Responsive design: mobile-friendly layout required (primary use may be desktop but mobile must not be broken)
- Accessibility testing: run Lighthouse and axe-core against each major page (homepage, wizard, preview, editor) before launch. Automated checks integrated into the development workflow via a pre-merge check on PRs.

---

## Out of Scope

- Legal advice of any kind
- Court filing on behalf of users
- Multi-jurisdiction support outside Australia (architecture should accommodate future expansion)
- Mobile native app (responsive web only for now)
- Marketing email campaigns
- Rich-text free-form document editing

# Petty Lawsuits — Claude Briefing

## What this is
A web app for generating Australian legal documents (demand letters, tribunal filings, etc.) for people who can't justify hiring a lawyer. Freemium model. Does not offer legal advice.

## Key docs to read first
- `docs/specs/2026-04-03-design.md` — full product spec (read this to understand what we're building)
- `docs/plans/` — six implementation plans, one per build phase

## Build order
1. `plan-1-foundation.md` — Next.js scaffold, Supabase, auth, Vercel deploy
2. `plan-2-wizard-and-generation.md` — AI wizard, Claude API integration
3. `plan-3-preview-and-payments.md` — Stripe, document unlock flow
4. `plan-4-editor-and-export.md` — form-field editor, PDF/Word export
5. `plan-5-email-and-polish.md` — email, dashboard, pre-launch checklist
6. `plan-6-competitive-features.md` — competitive feature parity & growth (from pettylawsuit.com audit)

## Current status
Last updated: 2026-05-02

### Plan 1 — Foundation: COMPLETE
All scaffold files exist: Next.js app, Supabase client/server, auth pages (login/signup/verify), route middleware, DB migration, Playwright e2e test, Vercel config deployed.

### Plan 2 — Wizard & Generation: COMPLETE
Full four-step wizard built (Defendant → Claimant → Incident → Evidence). All wizard components present. Claude API integration done (`/api/generate`, `/api/enhance`, narrative enhancer, prompts, templates, jurisdiction helpers, anonymous key). Document rows saved to Supabase.

### Plan 3 — Preview & Payments: COMPLETE
Preview page with server-side redaction, unlock modal, Stripe Checkout flow, webhook handler, and Supabase Realtime unlock watcher all built. Note: preview lives at `app/(main)/preview/[documentId]/` (inside main layout group).

### Plan 4 — Editor & Export: COMPLETE
Editor page at `app/(main)/document/[documentId]/page.tsx`. Components: `DocumentEditor`, `DocumentView`, `FieldInput`. Auto-save on blur + every 30s via `PATCH /api/documents/[id]`. Restore original button. PDF and Word export via `lib/documents/export.ts` + `GET /api/documents/[id]/download?format=pdf|word`. `NextStepsPanel` shown below editor for the document's state. `lib/documents/next-steps.ts` has state blurbs (needs lawyer review before launch). Note: `NextStepsPanel.tsx` was pre-built and is more advanced than Plan 4 specified — it shows official court forms and filing fees.

### Plan 4.5 — Auth Flow & Document Management Fixes: COMPLETE
Fixed 8 revenue-blocking issues: (1) `app/auth/callback/route.ts` — email verification no longer 404s; (2) `lib/anonymous.ts` — `claimAnonDocument()` added; (3) `UnlockModal` shows sign-up gate for unauthenticated users, tier cards for logged-in users; (4) Signup/login pages pass `documentId` and `anonKey` through the verification email so users land back at their preview after verifying; (5) `middleware.ts` appends `?returnTo=` when redirecting to login; (6) Header shows Login/My Documents/Logout based on auth state; (7) Preview page has ownership check (anonymous docs visible by UUID, owned docs only by owner); (8) Dashboard shows recipient name in document cards; (9) `ResumeBanner` component shows on all main pages for returning anonymous users. **Reminder:** add `http://localhost:3000/auth/callback` and production URL to Supabase Auth → Redirect URLs.

### Plan 5 — Email & Polish: IN PROGRESS
**Tasks 1–5 complete. Task 6 partially complete (code done, lawyer review pending).**

Resend email integration (`lib/email/resend.ts`) with document-ready notification wired into `/api/generate`. Account management page at `app/(main)/account/page.tsx` with subscription status, billing portal link, and account deletion. API routes: `app/api/billing/portal/route.ts` (Stripe Customer Portal) and `app/api/account/delete/route.ts`. Dashboard updated with correct status labels. Header updated with Account link.

PDF export improved (`lib/documents/export.ts`): letter-style layout with title block, date, two-column field rows, paragraph rendering for long content, signature block, and footer disclaimer. Word export matches.

Accessibility audit done: `@axe-core/playwright` installed, `e2e/accessibility.spec.ts` tests 8 pages against WCAG 2 AA. Fixed: accent color contrast (`#C8956C` → `#906540`), removed `opacity-50` on disabled cards, added permanent underlines on inline links.

Privacy Policy page (`app/(main)/privacy/page.tsx`) and Terms of Service page (`app/(main)/terms/page.tsx`) created with placeholder content marked DRAFT. Footer updated with legal links. ToS acceptance checkbox added to signup page (stores `tos_accepted_at` in Supabase user metadata).

Save Draft feature built: Save Draft button in wizard (signed-in users only), "Save before starting over?" confirmation dialog, draft API route (`app/api/documents/draft/route.ts`), draft resume from dashboard via `/wizard?draft={id}`.

**Remaining tasks:**
- Task 6 (partial): Lawyer must review and approve Privacy Policy, Terms of Service, and next-steps blurbs in `lib/documents/next-steps.ts`
- Task 7: Production environment setup (Stripe live keys, production Supabase URL, webhook config, smoke test)

**Open bugs:** BUG-003 (preview X button navigates to wizard instead of dashboard), BUG-004 (Google OAuth consent screen set to Internal — needs switching to External in Google Cloud Console)

**Vercel environment variables still needed:**
The following env vars must be added to Vercel project settings before production launch. Some use placeholders or `!` non-null assertions that will fail at runtime if missing:
- `RESEND_API_KEY` — Resend email (build uses placeholder to avoid crash; emails won't send without real key)
- `STRIPE_SECRET_KEY` — Stripe payments (checkout and billing portal will fail without this)
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signature verification
- `STRIPE_SEND_PRICE_ID` — Price ID for "Send the Letter" tier
- `STRIPE_FULL_PETTY_PRICE_ID` — Price ID for "Go Full Petty" tier
- `STRIPE_SUBSCRIPTION_PRICE_ID` — Price ID for subscription tier (not yet launched)
- `SUPABASE_SERVICE_ROLE_KEY` — used by account deletion and seed script (server-side only)
- `NEXT_PUBLIC_APP_URL` — base URL for email links (defaults to `https://pettylawsuits.com.au`)

### Plan 6 — Competitive Features & Growth: HIGH-PRIORITY ITEMS COMPLETE
Shipped via the multi-agent orchestration plan at `docs/superpowers/plans/2026-05-02-plan-6-orchestration.md` on branch `feat/plan-6-orchestration`. Plus BUG-003 fix (preview X button now routes to /dashboard).

**High priority — all complete:**
1. ✅ ABN/ACN business lookup in wizard — `app/api/lookup/abn/route.ts` proxies the ABR JSON API; DefendantStep prefills business name. Requires `ABR_GUID` env var (free registration).
2. ✅ Cease & desist letters — new template, category-aware prompt, custom next-steps blurb, court-forms hidden, wizard step relabels. **Pending lawyer review** — see `docs/superpowers/specs/2026-05-02-cease-and-desist-letter-design.md` (system prompt body and CEASE_AND_DESIST_NEXT_STEPS placeholder both need lawyer sign-off).
3. ✅ "Us vs solicitor vs DIY" comparison table — added to `app/(main)/pricing/page.tsx`.
4. ✅ Tribunal fees calculator — `app/(main)/tools/tribunal-fees/page.tsx` + `lib/jurisdictions/tribunal-fees.ts` (per-jurisdiction fee tiers, source URLs cited).
5. ✅ Response deadline tracking + email alerts — `/api/generate` sets `response_deadline = today + 14 days`; dashboard shows badge; daily cron at `/api/cron/deadline-reminders` emails users 1–2 days out. Requires `CRON_SECRET` env var.
6. ✅ Evidence file upload — wired into EvidenceStep + wizard parent; uploads to Supabase Storage `evidence` bucket (private, per-user RLS). Anonymous gate matches UnlockModal pattern. **Known gap:** evidence file refs are not yet persisted to the documents table — needs follow-up migration `ALTER TABLE documents ADD COLUMN evidence_files JSONB DEFAULT '[]'` and a `/api/generate` write of the metadata. Files DO land in Storage; only the DB pointer is missing.
7. ✅ Per-jurisdiction landing pages × 8 + reference table — `app/(main)/jurisdictions/[slug]/page.tsx` (static via generateStaticParams) + `app/(main)/jurisdictions/page.tsx`.

**Database migration:** `supabase/migrations/002_plan6_features.sql` (applied) — adds `response_deadline`, `deadline_reminder_sent_at` columns + partial index, plus the `evidence` storage bucket with per-user RLS policies.

**New env vars required for production:**
- `ABR_GUID` — register free at https://abr.business.gov.au/Tools/WebServices (without it, ABN lookup degrades gracefully)
- `CRON_SECRET` — long random string; Vercel injects into the cron Authorization header

**Pre-launch follow-ups:**
- Lawyer review of the cease & desist system prompt + next-steps blurb (both placeholders).
- Follow-up migration to persist evidence file refs on `documents`.

**Medium priority (build if high-priority items move the needle):**
- Claim amount calculator, statute of limitations checker
- Final notice / follow-up letters, pre-filled tribunal forms
- Money-back guarantee messaging, "no credit card to start" CTA copy

**Skip / premature:**
- Programmatic city-level SEO pages (Australia only has 8 jurisdictions, not 50 states)
- Blog infrastructure (requires ongoing content commitment the team can't sustain yet)
- Free template library (cannibalises the paid product)
- Physical mail delivery (operational complexity of a different business)
- Named AI persona, social proof tickers (no user data yet), ambassador program

### Extra work done outside plans
Marketing/content pages built beyond the original five plans:
- `app/(main)/about/page.tsx`
- `app/(main)/faq/page.tsx`
- `app/(main)/how-it-works/page.tsx`
- `app/(main)/pricing/page.tsx`
- `app/(main)/documents/page.tsx`
- `components/home/JurisdictionMap.tsx` (interactive jurisdiction explorer on homepage)
- `components/layout/Header.tsx` and `Footer.tsx`
- Spec: `docs/superpowers/specs/2026-04-04-homepage-and-marketing-pages-design.md`

## Tech stack
Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase, Claude API (claude-sonnet-4-6), Stripe, Resend, Vercel

## Preferences
- No Co-Authored-By lines in git commits
- Two developers (non-technical), building with Claude Code assistance
- Target jurisdiction: Australia only
- Do not offer legal advice anywhere in the codebase or UI copy

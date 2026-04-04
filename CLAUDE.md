# Petty Lawsuits — Claude Briefing

## What this is
A web app for generating Australian legal documents (demand letters, tribunal filings, etc.) for people who can't justify hiring a lawyer. Freemium model. Does not offer legal advice.

## Key docs to read first
- `docs/specs/2026-04-03-design.md` — full product spec (read this to understand what we're building)
- `docs/plans/` — five implementation plans, one per build phase

## Build order
1. `plan-1-foundation.md` — Next.js scaffold, Supabase, auth, Vercel deploy
2. `plan-2-wizard-and-generation.md` — AI wizard, Claude API integration
3. `plan-3-preview-and-payments.md` — Stripe, document unlock flow
4. `plan-4-editor-and-export.md` — form-field editor, PDF/Word export
5. `plan-5-email-and-polish.md` — email, dashboard, pre-launch checklist

## Current status
Last updated: 2026-04-05

### Plan 1 — Foundation: COMPLETE
All scaffold files exist: Next.js app, Supabase client/server, auth pages (login/signup/verify), route middleware, DB migration, Playwright e2e test, Vercel config deployed.

### Plan 2 — Wizard & Generation: COMPLETE
Full four-step wizard built (Defendant → Claimant → Incident → Evidence). All wizard components present. Claude API integration done (`/api/generate`, `/api/enhance`, narrative enhancer, prompts, templates, jurisdiction helpers, anonymous key). Document rows saved to Supabase.

### Plan 3 — Preview & Payments: COMPLETE
Preview page with server-side redaction, unlock modal, Stripe Checkout flow, webhook handler, and Supabase Realtime unlock watcher all built. Note: preview lives at `app/(main)/preview/[documentId]/` (inside main layout group).

### Plan 4 — Editor & Export: COMPLETE
Editor page at `app/(main)/document/[documentId]/page.tsx`. Components: `DocumentEditor`, `DocumentView`, `FieldInput`. Auto-save on blur + every 30s via `PATCH /api/documents/[id]`. Restore original button. PDF and Word export via `lib/documents/export.ts` + `GET /api/documents/[id]/download?format=pdf|word`. `NextStepsPanel` shown below editor for the document's state. `lib/documents/next-steps.ts` has state blurbs (needs lawyer review before launch). Note: `NextStepsPanel.tsx` was pre-built and is more advanced than Plan 4 specified — it shows official court forms and filing fees.

### Plan 5 — Email & Polish: NOT STARTED — **Start here next**
No Resend email integration, no account management page, no billing portal route. Dashboard shell exists at `app/(main)/dashboard/page.tsx` but is not wired to real data.

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

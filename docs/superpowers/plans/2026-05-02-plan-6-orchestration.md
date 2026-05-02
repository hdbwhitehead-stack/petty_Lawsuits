# Plan 6 Orchestration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship BUG-003 + seven Plan 6 P2 features through coordinated multi-agent execution, with Opus 4.7 as orchestrator delegating implementation to Sonnet sub-agents and using Haiku for trivial work.

**Architecture:** Four sequential waves. Wave 0 bundles all schema migrations to unblock parallelism. Wave 1 fires four mechanical sub-agents in parallel. Wave 2 fires three wizard-touching sub-agents in parallel with per-item Opus review gates. Wave 3 ships cease & desist letters alone because they cross-cut the document pipeline.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind, Supabase (Postgres + Storage), Stripe, Resend, Vercel cron, Playwright e2e, Anthropic SDK (claude-sonnet-4-6 for generation, plus Opus orchestrator and Haiku/Sonnet sub-agents for development).

**Spec:** `docs/superpowers/specs/2026-05-02-plan-6-orchestration-design.md`

---

## Reference: Standard sub-agent prompt envelope

Every `Agent` tool call below uses this envelope. Fill each section with concrete content; never leave a section blank.

```
GOAL: <one sentence>
WHY: <one sentence — Plan 6 priority + business context>
FILES TO READ FIRST: <explicit paths>
PATTERN TO FOLLOW: <reference an existing file that does the same shape>
CONTRACT: <function signatures, schema columns, route paths, types>
OUT OF SCOPE: <what NOT to touch — usually migrations, doc generation pipeline, other agents' wizard steps>
VERIFICATION: <commands to run before reporting done>
REPORT: <what to return — file list, diff summary, judgment calls flagged>
```

---

## Reference: Verification commands

These are referenced repeatedly. Each sub-agent must run the relevant subset.

- Typecheck: `npx tsc --noEmit`
- Lint: `npm run lint`
- Build (full check): `npm run build`
- Accessibility e2e: `npx playwright test e2e/accessibility.spec.ts`
- Auth e2e: `npx playwright test e2e/auth.spec.ts`

If a verification command is unavailable in the agent's environment, the agent reports that explicitly rather than skipping silently.

---

## Task 1: Wave 0 — Orchestrator exploration and migration bundle

**Purpose:** Read the relevant code and ship one migration that unblocks Waves 2 and 3.

**Files:**
- Read: `components/wizard/DefendantStep.tsx`, `components/wizard/EvidenceStep.tsx`, `lib/documents/templates.ts`, `lib/documents/redact.ts`, `lib/documents/next-steps.ts`, `app/api/generate/route.ts`, `app/api/documents/`, `supabase/migrations/001_initial_schema.sql`
- Create: `supabase/migrations/002_plan6_features.sql`

- [ ] **Step 1: Read Wave-0 input files**

Open each file in the "Read" list above. Take notes on: the existing `documents` table columns, the `doc_type` enum values, RLS policy shape, wizard step component contracts (props, types, where each step writes to shared state), redaction rules, and the email send call site in `app/api/generate/route.ts`.

- [ ] **Step 2: Write the migration**

Create `supabase/migrations/002_plan6_features.sql` covering all three downstream needs in one file:

```sql
-- Cease & desist letter type
ALTER TYPE doc_type ADD VALUE IF NOT EXISTS 'cease_and_desist';

-- Response deadline tracking (P2.5)
ALTER TABLE documents
  ADD COLUMN IF NOT EXISTS response_deadline DATE,
  ADD COLUMN IF NOT EXISTS deadline_reminder_sent_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_documents_response_deadline
  ON documents (response_deadline)
  WHERE response_deadline IS NOT NULL
    AND deadline_reminder_sent_at IS NULL;

-- Evidence file uploads (P2.6)
INSERT INTO storage.buckets (id, name, public)
VALUES ('evidence', 'evidence', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload their own evidence"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'evidence'
    AND (auth.uid()::text = (storage.foldername(name))[1])
  );

CREATE POLICY "Users can read their own evidence"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'evidence'
    AND (auth.uid()::text = (storage.foldername(name))[1])
  );

CREATE POLICY "Users can delete their own evidence"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'evidence'
    AND (auth.uid()::text = (storage.foldername(name))[1])
  );
```

If reading the existing schema reveals different naming (e.g. `doc_type` is not an enum but a CHECK constraint, or `documents` does not exist by that name), adapt the migration to match before continuing.

- [ ] **Step 3: Apply the migration locally**

Run: `npx supabase db push` (or the team's standard apply command — check `package.json` and `supabase/` README first).
Expected: migration applies clean, no errors.

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors. The migration alone does not change TS types yet — that happens in later waves.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/002_plan6_features.sql
git commit -m "feat(db): add migration for Plan 6 features (cease & desist, deadlines, evidence storage)"
```

---

## Task 2: Wave 1 dispatch — four parallel sub-agents (mechanical work)

**Purpose:** Fire four independent sub-agents in a single message. None of them touch the wizard, document pipeline, or migrations.

- [ ] **Step 1: Dispatch all four agents in one message**

Send a single message with four parallel `Agent` tool calls. Use these prompts verbatim:

**Agent 2a — BUG-003 (Haiku, subagent_type=general-purpose, model=haiku):**

```
GOAL: Fix BUG-003 — preview page X (close) button currently routes to /wizard, should route to /dashboard.
WHY: P1 polish bug; user expects to return to their document list, not start a new wizard.
FILES TO READ FIRST: app/(main)/preview/[documentId]/page.tsx and any header/close-button component it imports.
PATTERN TO FOLLOW: existing dashboard navigation links — use Next.js <Link href="/dashboard"> or router.push("/dashboard").
CONTRACT: change the X button's destination from /wizard to /dashboard. No other behaviour changes.
OUT OF SCOPE: do not touch the wizard, do not change styling, do not refactor.
VERIFICATION: npx tsc --noEmit must pass.
REPORT: file path and the one-line change.
```

**Agent 2b — Pricing comparison table (Sonnet):**

```
GOAL: Add a "Petty Lawsuits vs solicitor vs DIY" comparison table to app/(main)/pricing/page.tsx.
WHY: P2 quick-win conversion lift; competitor (pettylawsuit.com) ships this and it's a known pricing-page pattern.
FILES TO READ FIRST: app/(main)/pricing/page.tsx, components/home/ for any existing comparison or feature-grid component, app/(main)/about/page.tsx for tone.
PATTERN TO FOLLOW: existing static section components on the pricing page. Match Tailwind class style (no new design system).
CONTRACT: a single React server component, three columns (Petty Lawsuits / Solicitor / DIY), rows for: Cost, Turnaround, Australian-law-specific, Ongoing support, Document quality. Australian copy. No legal advice claims.
OUT OF SCOPE: do not edit pricing tiers, do not edit Stripe integration, do not change the page header.
VERIFICATION: npx tsc --noEmit; npm run lint; npx playwright test e2e/accessibility.spec.ts (must stay green).
REPORT: file diff + screenshot description.
```

**Agent 2c — Tribunal fees calculator (Sonnet):**

```
GOAL: Build a free public tribunal fees calculator at app/(main)/tools/tribunal-fees/page.tsx with a JSON data file at lib/jurisdictions/tribunal-fees.ts.
WHY: P2 SEO funnel — free tool ranks for "tribunal filing fees [state]" and funnels into the wizard.
FILES TO READ FIRST: lib/documents/jurisdiction.ts (existing jurisdiction list — reuse it), components/home/JurisdictionMap.tsx (existing 8-jurisdiction UI pattern), app/(main)/how-it-works/page.tsx (page chrome pattern).
PATTERN TO FOLLOW: client component with useState for jurisdiction + claim amount, server-rendered shell. Reuse the 8-jurisdiction list — do not redefine it.
CONTRACT:
  - lib/jurisdictions/tribunal-fees.ts exports `tribunalFees: Record<JurisdictionCode, { tier: string; min: number; max: number; fee: number }[]>`
  - calculator UI: jurisdiction dropdown + claim amount input → displays the fee + filing tribunal name + a "Generate your letter" CTA linking to /wizard.
  - Fee data is from public tribunal websites; cite source URLs in a code comment per jurisdiction.
OUT OF SCOPE: do not edit the wizard, do not edit existing jurisdiction logic, do not add a new design system.
VERIFICATION: npx tsc --noEmit; npm run lint; npx playwright test e2e/accessibility.spec.ts.
REPORT: file list + the source URLs cited per jurisdiction.
```

**Agent 2d — Per-jurisdiction landing pages × 8 (Sonnet):**

```
GOAL: Generate 8 jurisdiction-specific landing pages at app/(main)/jurisdictions/[slug]/page.tsx using a single template + a data file at lib/jurisdictions/landing-data.ts.
WHY: P2 SEO — rank for "demand letter [state]" queries; competitor wins these in US.
FILES TO READ FIRST: lib/documents/jurisdiction.ts (canonical jurisdiction list), components/home/JurisdictionMap.tsx, app/(main)/how-it-works/page.tsx (page chrome).
PATTERN TO FOLLOW: dynamic route with generateStaticParams returning all 8 slugs. One template component renders from data — DRY, do not write 8 separate page files.
CONTRACT:
  - lib/jurisdictions/landing-data.ts exports per-jurisdiction fields: tribunalName, claimLimits, typicalTimeline, smallClaimsUrl, oneSentenceSummary
  - app/(main)/jurisdictions/[slug]/page.tsx renders: H1 "Demand Letters in [Jurisdiction]", tribunal explainer, claim limits, link to wizard with ?jurisdiction=[code] prefilled, internal links to the tribunal fees calculator (Agent 2c) and homepage.
  - generateStaticParams returns all 8 slugs.
  - Also add an all-jurisdictions reference table at app/(main)/jurisdictions/page.tsx.
OUT OF SCOPE: do not edit the wizard, do not change jurisdiction.ts, do not add new design tokens.
VERIFICATION: npx tsc --noEmit; npm run lint; npx playwright test e2e/accessibility.spec.ts; manual: visit /jurisdictions/nsw and confirm it renders.
REPORT: file list + the 8 slugs used.
```

- [ ] **Step 2: Wait for all four agents to return**

They run independently and may finish out of order. Do not start Wave 2 until all four reports are back.

- [ ] **Step 3: Read each diff inline**

For each agent's report, read the changed files. Confirm they stayed in scope. The orchestrator (Opus) does this directly — no review sub-agent.

- [ ] **Step 4: Run verification at the orchestrator level**

Run: `npx tsc --noEmit && npm run lint && npx playwright test e2e/accessibility.spec.ts`
Expected: all green. If anything fails, identify which agent's output caused it and dispatch a corrective sub-agent with the failure output included in its prompt.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: Wave 1 — BUG-003, pricing comparison, fees calculator, jurisdiction landing pages"
```

---

## Task 3: Wave 2 dispatch — three parallel sub-agents (wizard surface)

**Purpose:** Three Sonnet agents touching the wizard at different steps. Schema is already in place from Task 1.

- [ ] **Step 1: Dispatch all three agents in one message**

**Agent 3a — ABN/ACN business lookup (Sonnet):**

```
GOAL: Add ABN/ACN business lookup to the Defendant wizard step. When the user types an 11-digit ABN or 9-digit ACN, fetch and prefill the registered business name.
WHY: P2 high-priority — reduces defendant detail errors that invalidate letters.
FILES TO READ FIRST: components/wizard/DefendantStep.tsx, lib/wizard/ (any existing types/state shape), app/api/ for an example route to copy.
PATTERN TO FOLLOW: existing wizard step state lives in the WizardShell context (read DefendantStep to confirm). Add a new API route at app/api/lookup/abn/route.ts that proxies the public ABR lookup API (https://abr.business.gov.au — research the exact JSON endpoint as part of this task; document what you find in a comment at the top of the route).
CONTRACT:
  - New route: GET /api/lookup/abn?id=<11-digit-or-9-digit> → { businessName: string | null, status: string, error?: string }
  - DefendantStep adds an "ABN/ACN (optional)" field; on valid input it shows a "Look up" button; on success, prefills the business name field but leaves it editable.
  - Rate-limit gracefully: catch any 4xx/5xx from ABR and surface a non-blocking message ("Could not look up — enter manually").
OUT OF SCOPE: do not touch ClaimantStep / IncidentStep / EvidenceStep. Do not modify the migration. Do not edit shared WizardShell or wizard types beyond the one new optional field; if a shared-type change is needed, stop and report.
VERIFICATION: npx tsc --noEmit; npm run lint; manually verify the API route with a known ABN (e.g. ATO ABN 51 824 753 556) before reporting done.
REPORT: file diff + the exact ABR endpoint and any auth/rate-limit notes you found.
```

**Agent 3b — Evidence file upload (Sonnet):**

```
GOAL: Add file upload (photos, receipts, PDFs) to components/wizard/EvidenceStep.tsx, storing files in the Supabase Storage 'evidence' bucket created in migration 002.
WHY: P2 high-priority — evidence attachments materially strengthen demand letters.
FILES TO READ FIRST: components/wizard/EvidenceStep.tsx, lib/documents/evidence-requirements.ts, supabase/migrations/002_plan6_features.sql (the bucket and policies are already there), lib/supabase/ (existing client setup).
PATTERN TO FOLLOW: existing Supabase client usage in the codebase (browser client for upload, server client for read). Files stored under path `<user_id>/<document_id>/<original_filename>`.
CONTRACT:
  - EvidenceStep gets a drag-and-drop / click-to-upload component with a 10MB-per-file limit and accepted types: image/*, application/pdf.
  - Uploaded files are listed with their name, size, and a remove button.
  - File metadata (path, original filename, size, mime) is persisted on the document record — extend the wizard state shape to include it. If the documents table needs a new column to store an array of evidence file refs, STOP and report — do not write a new migration.
  - Anonymous users: upload should be gated behind sign-up (mirror the existing UnlockModal sign-up gate pattern).
OUT OF SCOPE: do not touch DefendantStep / ClaimantStep / IncidentStep. Do not write any migration. Do not edit redact.ts or templates.ts.
VERIFICATION: npx tsc --noEmit; npm run lint; manually upload a 1KB PNG and confirm it appears in Supabase Storage under the expected path.
REPORT: file diff + a note on how evidence file refs are persisted (and whether a follow-up migration is needed).
```

**Agent 3c — Response deadline tracking + email alerts (Sonnet):**

```
GOAL: After a document is generated, capture a response deadline (default: 14 days from send for demand letters) and email the user a reminder 2 days before the deadline if no response logged.
WHY: P2 high-priority — post-generation engagement increases tier-2 conversion.
FILES TO READ FIRST: app/api/generate/route.ts (where document generation completes), lib/email/resend.ts (existing email pattern), app/(main)/dashboard/page.tsx (where deadline should display), supabase/migrations/002_plan6_features.sql (response_deadline and deadline_reminder_sent_at columns already exist).
PATTERN TO FOLLOW: lib/email/resend.ts for sending; existing API routes in app/api/ for the cron handler.
CONTRACT:
  - On document generate (or first export), set `response_deadline = today + 14 days` for demand_letter docs.
  - Dashboard shows deadline + "X days remaining" badge.
  - New cron route GET /api/cron/deadline-reminders: queries documents where response_deadline IS in (today+1, today+2) AND deadline_reminder_sent_at IS NULL, sends a Resend email per row, sets deadline_reminder_sent_at = now().
  - vercel.json gets a daily cron entry pointing at the new route.
  - The cron route is protected by the standard CRON_SECRET header check (mirror any existing cron route, or add the standard pattern: `if (request.headers.get('authorization') !== \`Bearer ${process.env.CRON_SECRET}\`) return 401`).
OUT OF SCOPE: do not touch the wizard. Do not write any migration. Do not modify Stripe / billing.
VERIFICATION: npx tsc --noEmit; npm run lint; manual: trigger the cron route locally with the right header and confirm it runs (no rows expected to update on a fresh DB, that's fine).
REPORT: file diff + the cron schedule used + a note if CRON_SECRET needs adding to Vercel env (it likely does — flag it).
```

- [ ] **Step 2: Wait for all three agents to return**

- [ ] **Step 3: Per-agent review gate (Opus orchestrator reads each diff)**

For each agent in turn:
- Read every file the agent changed.
- Confirm `OUT OF SCOPE` lines were honoured (no migration writes, no other-step edits).
- Confirm verification commands actually ran and passed.
- If issues: dispatch a corrective sub-agent with the specific issue listed; do not merge until clean.

- [ ] **Step 4: Run verification at the orchestrator level**

Run: `npx tsc --noEmit && npm run lint && npm run build && npx playwright test e2e/accessibility.spec.ts && npx playwright test e2e/auth.spec.ts`
Expected: all green.

- [ ] **Step 5: Commit each cleanly-reviewed agent's work**

Three commits, one per agent, so failures can be reverted independently:

```bash
git add <Agent 3a files> && git commit -m "feat: ABN/ACN business lookup in defendant wizard step"
git add <Agent 3b files> && git commit -m "feat: evidence file upload to Supabase Storage in wizard"
git add <Agent 3c files> && git commit -m "feat: response deadline tracking + reminder email cron"
```

If Agent 3b reported a follow-up migration is needed, do NOT bundle that into this commit — flag for a separate Wave 2.5 migration commit.

---

## Task 4: Wave 3 — Cease & desist letter design (Opus orchestrator)

**Purpose:** Cease & desist crosses too many seams (doc_type enum, prompts, templates, redaction, editor schema, dashboard) for a Sonnet agent to one-shot. Opus designs first.

**Files:**
- Read: `lib/documents/templates.ts`, `lib/documents/redact.ts`, `lib/documents/next-steps.ts`, `app/api/generate/route.ts`, prompts directory (find via grep for "system prompt" or "claude" call sites)
- Create: `docs/superpowers/specs/2026-05-02-cease-and-desist-letter-design.md`

- [ ] **Step 1: Read the document pipeline**

Read every file above. Document in notes:
- The exact shape of the prompts (system prompt + user prompt template).
- How `templates.ts` renders a doc_type into final text.
- How `redact.ts` strips sensitive fields for the preview.
- The doc_type discriminator pattern in the editor and dashboard.

- [ ] **Step 2: Write the cease & desist design sub-spec**

Create `docs/superpowers/specs/2026-05-02-cease-and-desist-letter-design.md` covering:
- When a cease & desist is appropriate (defamation, harassment, IP misuse, breach of contract continuing) — with a "this is not legal advice" framing consistent with the rest of the app.
- New wizard fields needed (or confirmation that existing fields cover it).
- The system prompt for cease & desist generation (full text, ready to paste into the prompts file).
- The template structure (header, recital of the conduct, demand to cease, deadline, consequences, signature).
- Redaction rules: which fields hide in the preview, which show.
- Editor field schema additions.
- Dashboard card treatment (badge label, status flow).
- `next-steps.ts` blurb for `cease_and_desist` doc state.
- A line at the top: "Awaiting lawyer review before launch."

- [ ] **Step 3: Commit the sub-spec**

```bash
git add docs/superpowers/specs/2026-05-02-cease-and-desist-letter-design.md
git commit -m "docs: cease & desist letter design sub-spec"
```

---

## Task 5: Wave 3 — Cease & desist implementation (Sonnet)

**Purpose:** One Sonnet agent executes against the sub-spec from Task 4.

- [ ] **Step 1: Dispatch the implementation agent**

```
GOAL: Implement the cease & desist letter type per docs/superpowers/specs/2026-05-02-cease-and-desist-letter-design.md.
WHY: P2 high-priority — doubles addressable market beyond demand letters.
FILES TO READ FIRST: docs/superpowers/specs/2026-05-02-cease-and-desist-letter-design.md (full spec), lib/documents/templates.ts, lib/documents/redact.ts, lib/documents/next-steps.ts, app/api/generate/route.ts, the prompts file referenced in the spec.
PATTERN TO FOLLOW: how demand_letter is wired through templates → redact → next-steps → generate route. The new doc type must follow the same shape end to end.
CONTRACT: every item in the sub-spec's Implementation Checklist must be implemented. The doc_type enum value 'cease_and_desist' already exists from migration 002 — do not write a new migration.
OUT OF SCOPE: do not change demand_letter behaviour. Do not edit Stripe pricing tiers. Do not change wizard step structure beyond what the spec requires.
VERIFICATION: npx tsc --noEmit; npm run lint; npm run build; manual: walk the wizard end-to-end selecting cease_and_desist and confirm a generated document renders in preview.
REPORT: file list + a confirmation that every spec checklist item is implemented + any judgment calls flagged for the orchestrator.
```

- [ ] **Step 2: Review the diff (Opus orchestrator)**

Read every file changed. Cross-reference against the sub-spec checklist line by line. Send back for correction if any checklist item is missing or any out-of-scope file was touched.

- [ ] **Step 3: Run full verification**

Run: `npx tsc --noEmit && npm run lint && npm run build && npx playwright test`
Expected: all green.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: cease & desist letter type — wizard, generation, preview, editor, dashboard

Awaiting lawyer review before launch."
```

---

## Task 6: Update CLAUDE.md status

- [ ] **Step 1: Edit CLAUDE.md**

Update the Plan 6 section to mark items 1–7 complete. Add a "Pending lawyer review" line under cease & desist. Update the "Last updated" date to today.

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: mark Plan 6 high-priority features complete"
```

---

## Self-review checklist (orchestrator runs this before declaring done)

- [ ] All eight items in the spec have a corresponding task above (BUG-003, ABN, cease & desist, comparison table, fees calc, deadlines, evidence, jurisdiction pages).
- [ ] No `OUT OF SCOPE` lines were violated by any sub-agent.
- [ ] Migration 002 is the only schema change shipped; no Wave 2/3 agent wrote a migration.
- [ ] `npx tsc --noEmit && npm run lint && npm run build` green at HEAD.
- [ ] Both Playwright specs (accessibility + auth) green at HEAD.
- [ ] Cease & desist sub-spec is flagged "Awaiting lawyer review" and CLAUDE.md reflects this.
- [ ] CRON_SECRET added to Vercel env vars (or flagged in CLAUDE.md launch checklist if not).

---

## Why this plan

- **Wave 0 first** is the unblock. Without it, three later items would serialise on migration writes.
- **Parallel dispatch** in Waves 1 and 2 only works because each agent's `OUT OF SCOPE` line forbids the shared surfaces (migrations, WizardShell, doc pipeline) — that's how concurrent edits avoid merge conflicts on a single dev machine.
- **Cease & desist alone in Wave 3** is the YAGNI call: trying to parallelise it would mean writing 5+ files at once across the doc pipeline, which is exactly the kind of work where Sonnet drift compounds.
- **Per-commit granularity in Wave 2** means a bad ABN agent doesn't block the evidence upload merge.

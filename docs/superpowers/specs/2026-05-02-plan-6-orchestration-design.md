# Plan 6 — Multi-Agent Orchestration Design

**Date:** 2026-05-02
**Scope:** BUG-003 (P1) + seven Plan 6 P2 features
**Orchestrator:** Opus 4.7 (1M context)
**Goal:** Balanced model usage — Haiku for lookups, Sonnet for implementation, Opus for design and review

## Items in scope

1. BUG-003 — preview X button routes to `/wizard` instead of `/dashboard`
2. ABN/ACN business lookup in wizard (ASIC API)
3. Cease & desist letter type
4. "Us vs solicitor vs DIY" pricing comparison table
5. Tribunal fees calculator (free SEO tool)
6. Response deadline tracking + email alerts
7. Evidence file upload in wizard (Supabase Storage)
8. Per-jurisdiction landing pages × 8

Out of scope for this session: P0 launch blockers (env vars, OAuth toggle, Supabase redirect URLs, lawyer review, smoke test). These are config or external lead-time tasks, not code work.

## Wave structure

Four waves. Waves exist to prevent collisions on three shared surfaces: schema migrations, the wizard component tree, and the document generation pipeline.

### Wave 0 — Orchestrator setup (Opus, sequential)

- Read existing wizard architecture (`components/wizard/`, `lib/wizard/`), document generation pipeline (`lib/documents/`, `app/api/generate/`), and current migration history.
- Ship a single migration covering: deadline-tracking columns on `documents`, Supabase Storage bucket + RLS policies for evidence uploads, and any `doc_type` enum addition needed for cease & desist.
- Decide cease & desist content structure inline (prompt template, redaction rules, dashboard treatment).
- Draft sub-agent prompts for Waves 1–3 using the standard envelope (see "Context handoff" below).

### Wave 1 — Mechanical, fire-and-forget (parallel)

| Item | Model |
|---|---|
| BUG-003 preview X button | Haiku |
| Pricing comparison table | Sonnet |
| Tribunal fees calculator | Sonnet |
| Per-jurisdiction landing pages × 8 (one agent generates template + 8-row data file) | Sonnet |

All four dispatched in a single message (parallel `Agent` tool calls). None touch `lib/wizard/`, `lib/documents/`, or migrations.

### Wave 2 — Wizard / post-generation surface (parallel, review-gated)

| Item | Model |
|---|---|
| ABN/ACN business lookup | Sonnet |
| Evidence file upload | Sonnet |
| Response deadline tracking + email | Sonnet |

Three Sonnet agents dispatched in parallel. Each returns a diff summary; Opus orchestrator reviews diffs as they land, merges or sends back with corrections. Each agent owns one wizard step file; shared files (`WizardShell`, shared types) are orchestrator-only.

### Wave 3 — Cross-cutting (sequential, review-gated)

| Item | Model |
|---|---|
| Cease & desist letter type | Opus design + Sonnet implement |

Alone in its wave because it touches the `doc_type` enum, prompts, templates, preview redaction, editor field schema, and dashboard cards. Opus writes the implementation brief; Sonnet executes; Opus reviews.

## Model assignment

| Item | Model | Reasoning |
|---|---|---|
| BUG-003 | Haiku | One-line route href change |
| Pricing comparison table | Sonnet | Static React component, follows existing `app/(main)/pricing/` patterns |
| Tribunal fees calculator | Sonnet | Self-contained route + jurisdiction fee data file |
| Jurisdiction landing pages × 8 | Sonnet | Single agent: template + 8-row data file |
| ABN/ACN lookup | Sonnet | Research ASIC API contract and implement in one pass |
| Evidence file upload | Sonnet | Standard Supabase Storage pattern; schema already shipped in Wave 0 |
| Deadline tracking + email | Sonnet | Dashboard column + Resend template + Vercel cron route |
| Cease & desist letter | Opus → Sonnet | Design needs judgment; implementation is pattern-following |

Wave 2 reviews are performed by the Opus orchestrator directly, not delegated to a separate reviewer sub-agent.

## Context handoff — standard sub-agent prompt envelope

Drafted by Opus in Wave 0. Every sub-agent receives:

```
GOAL: <one sentence>
WHY THIS MATTERS: <one sentence — links to Plan 6 priority>
FILES TO READ: <explicit paths, no exploration budget>
PATTERN TO FOLLOW: <reference an existing file that does the same shape>
CONTRACT: <exact function signatures, schema columns, route paths>
OUT OF SCOPE: <what NOT to touch — usually migrations, doc generation pipeline>
DONE WHEN: <verification command(s) + manual check>
REPORT: <what to return — diff summary, any judgment calls flagged>
```

The principle: Opus reads, Sonnet writes. Sub-agents receive paths and contracts, not exploration tasks.

## Failure modes & guards

- **Schema drift** — only Wave 0 writes migrations. Any later agent that thinks it needs a migration must report back and stop, not invent one.
- **Wizard step collision** — each Wave 2 agent owns one wizard step file. Changes to shared files (`WizardShell`, shared types) are flagged for the orchestrator to apply.
- **Test verification** — every sub-agent runs `npm run typecheck` and the relevant Playwright spec before reporting done. The Plan 5 accessibility spec must stay green throughout.

## Token-budget shape (rough order of magnitude)

- Wave 0 (Opus): ~100K tokens — reading existing code, drafting migration + sub-agent prompts.
- Wave 1: ~30K Haiku + ~150K Sonnet across four agents. Jurisdiction-pages agent is the largest single cost (~80K).
- Wave 2: ~250K Sonnet across three agents + ~80K Opus reviewing diffs.
- Wave 3: ~120K Opus design + ~150K Sonnet implementation.

These are planning estimates, not commitments.

## Why this design

- **Schema migrations bundled in Wave 0** is the highest-leverage decision: it converts P2.2/P2.5/P2.6 from sequential into parallel by removing the only file all three would otherwise contend for.
- **Mechanical vs judgment split** matches the project's existing memory rule (Haiku for lookups, Sonnet for implementation, Opus for judgment).
- **Explicit `OUT OF SCOPE` lines** prevent merge conflicts between parallel Wave 2 agents — the most common failure mode in concurrent sub-agent work.
- **Verification commands inside each brief** let Sonnet catch its own typecheck failures before the Opus review round-trip, keeping retries cheap.

## Next step

Hand off to `superpowers:writing-plans` to convert this design into a step-by-step implementation plan with sub-agent prompts pre-drafted per the standard envelope.

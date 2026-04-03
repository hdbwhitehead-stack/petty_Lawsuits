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
Plans written. No code yet. Start with Plan 1.

## Tech stack
Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase, Claude API (claude-sonnet-4-6), Stripe, Resend, Vercel

## Preferences
- No Co-Authored-By lines in git commits
- Two developers (non-technical), building with Claude Code assistance
- Target jurisdiction: Australia only
- Do not offer legal advice anywhere in the codebase or UI copy

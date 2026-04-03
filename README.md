# Petty Lawsuits

A web app that helps Australians generate legal documents for smaller disputes and lawsuits — where the cost of going to a lawyer doesn't make sense.

Users describe their situation, answer a short guided wizard, and get a jurisdiction-aware legal document they can edit and download. The app covers demand letters, tribunal filings, tenancy disputes, employment issues, and more — scoped to Australian law across all states and territories.

**Not legal advice.** The app generates document templates only.

---

## What it does

- AI-guided wizard that routes users to the right document type
- State-aware templates (NCAT, VCAT, QCAT, etc.)
- Freemium model: preview free, pay to unlock the full document
- In-browser editing of key fields, then download as PDF or Word
- Generic next-steps guidance for each state (not legal advice)

## Tech stack

- **Frontend & API:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Database & Auth:** Supabase
- **AI:** Claude API
- **Payments:** Stripe
- **Email:** Resend
- **Hosting:** Vercel

## Docs

- [`docs/specs/2026-04-03-design.md`](docs/specs/2026-04-03-design.md) — full product design spec
- [`docs/plans/`](docs/plans/) — implementation plans

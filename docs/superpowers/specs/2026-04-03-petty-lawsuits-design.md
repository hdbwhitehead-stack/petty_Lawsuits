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
3. Chooses entry point:
   - *Describe my situation* — free text, Claude interprets and routes to correct document type
   - *I know what I need* — browse by category
4. Completes structured wizard questions
5. Sees partial/blurred preview of generated document
6. Prompted to sign up and pay to unlock

### Returning user
1. Logs in → dashboard of saved documents
2. Create new documents or continue drafts
3. Manage billing from account settings

### After unlocking
- Full document displayed in a simple in-browser editor
- User can adjust names, amounts, dates, and other fields
- Download as PDF or Word
- Generic (non-advice) next-steps blurb shown alongside document (e.g. referencing NCAT/VCAT/QCAT based on state)

---

## Document System

### Generation approach
Each document type has a structured legal template with placeholders. Claude's role is to interpret user answers and fill placeholders intelligently, adapting tone and language to the specific situation. This ensures legal consistency while personalising the output.

### Document categories
- **Disputes** — demand letters, debt recovery, neighbour disputes
- **Consumer** — faulty goods/services complaints, refund demands
- **Tenancy** — bond disputes, breach of lease notices
- **Employment** — underpayment letters, Fair Work unfair dismissal
- **Contracts** — simple service agreements, freelance contracts
- **Court filings** — small claims tribunal forms (NCAT, VCAT, QCAT, etc.)

### Jurisdictional awareness
The wizard always asks "which state are you in?" — this drives:
- Correct tribunal name (NCAT/NSW, VCAT/VIC, QCAT/QLD, SAT/WA, etc.)
- Filing thresholds and limits per state
- Procedural notes in the generic guidance blurb

States/territories covered: NSW, VIC, QLD, WA, SA, TAS, ACT, NT.

### Document versioning
Each save creates a new version in Supabase. Users can roll back to the original AI-generated document at any time.

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
- Document stored permanently in account

### Subscription
- Monthly plan (~AUD $30–50/month) for unlimited document generation
- Targeted at small business owners with recurring needs

### Implementation
Each document in Supabase has an `unlocked` boolean, set to `true` by either a one-off Stripe payment or an active subscription. The backend validates this before serving full document content.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Frontend & Backend | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS |
| Database & Auth | Supabase (PostgreSQL + Auth + Storage) |
| AI | Claude API — `claude-sonnet-4-6` |
| Payments | Stripe (one-off + subscriptions + webhooks) |
| Document export | `react-pdf` / `docx` npm libraries |
| Hosting | Vercel (auto-deploys from GitHub `main`) |

---

## Development Workflow

- Two developers working on feature branches
- Pull requests merged to `main` on GitHub
- Vercel automatically deploys on merge to `main`
- Environment variables (Supabase keys, Stripe keys, Claude API key) stored in Vercel and `.env.local` locally

---

## Out of Scope

- Legal advice of any kind
- Court filing on behalf of users
- Multi-jurisdiction support outside Australia (architecture should accommodate future expansion)
- Mobile native app (responsive web only for now)

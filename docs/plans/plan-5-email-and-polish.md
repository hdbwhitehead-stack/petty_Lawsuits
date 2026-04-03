# Plan 5: Email, Polish & Pre-Launch

**Goal:** Add transactional email, complete the user dashboard, wire up account management, and run pre-launch checks — accessibility, PDF formatting review, and environment configuration for production.

**Architecture:** Resend handles all transactional email. The dashboard lists real documents. Account settings allow subscription management and account deletion. Pre-launch checklist covers legal dependencies, accessibility, and PDF quality.

**Tech Stack:** Resend, Supabase, Stripe Customer Portal

**Depends on:** Plans 1–4

**Deliverable:** A production-ready app with email notifications, a working dashboard, account management, and all pre-launch legal/technical requirements satisfied.

---

## File structure

```
app/
├── dashboard/
│   └── page.tsx                         # Updated: real document list
├── account/
│   └── page.tsx                         # Subscription management + delete account
└── api/
    ├── account/
    │   └── delete/route.ts              # DELETE: remove user data and account
    └── billing/
        └── portal/route.ts             # POST: create Stripe Customer Portal session
lib/
└── email/
    └── resend.ts                        # Resend email helpers
```

---

## Tasks

### Task 1: Resend setup

- [ ] Install Resend: `npm install resend`
- [ ] Go to [resend.com](https://resend.com), create an account, and get your API key
- [ ] Add to `.env.local`: `RESEND_API_KEY=re_...`
- [ ] Add your sending domain in Resend (or use the default sandbox domain for testing)
- [ ] Create `lib/email/resend.ts`:
  ```ts
  import { Resend } from 'resend'

  const resend = new Resend(process.env.RESEND_API_KEY)

  export async function sendDocumentReady(to: string, documentId: string) {
    await resend.emails.send({
      from: 'Petty Lawsuits <noreply@pettylawsuits.com.au>',
      to,
      subject: 'Your document is ready',
      html: `
        <p>Your legal document has been generated and is ready to view.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/preview/${documentId}">View your document</a></p>
        <p style="font-size:12px;color:#888;">This document was generated using a template tool. It is not legal advice.</p>
      `,
    })
  }

  export async function sendUnlockFailure(to: string) {
    await resend.emails.send({
      from: 'Petty Lawsuits <noreply@pettylawsuits.com.au>',
      to,
      subject: 'Action needed — your document unlock is delayed',
      html: `
        <p>We received your payment but your document hasn't unlocked yet. We're looking into it.</p>
        <p>Reply to this email and we'll resolve it promptly.</p>
      `,
    })
  }
  ```
- [ ] Call `sendDocumentReady` in `app/api/generate/route.ts` after a successful generation (if the user is logged in)
- [ ] Call `sendUnlockFailure` in the Realtime timeout handler from Plan 3 (5-minute failure path)
- [ ] Commit: `git add -A && git commit -m "feat: add Resend transactional email"`

---

### Task 2: Dashboard — real document list

- [ ] Update `app/dashboard/page.tsx` to fetch and display the user's documents from Supabase:
  - Show document category, state, status, and created date
  - Unlocked documents link to `/document/[id]`
  - Locked documents link to `/preview/[id]`
  - Failed documents show an error state with a support link
- [ ] Commit: `git add -A && git commit -m "feat: show real documents in dashboard"`

---

### Task 3: Account management

- [ ] Create `app/account/page.tsx` with:
  - Current subscription status (active / inactive, renewal date)
  - "Manage billing" button that calls `/api/billing/portal` to open the Stripe Customer Portal
  - "Delete my account" button with a confirmation step
- [ ] Create `app/api/billing/portal/route.ts`:
  ```ts
  import { NextRequest, NextResponse } from 'next/server'
  import { createClient } from '@/lib/supabase/server'
  import { stripe } from '@/lib/stripe/client'

  export async function POST(req: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const { data: sub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    if (!sub?.stripe_customer_id) {
      return NextResponse.json({ error: 'No billing account found' }, { status: 404 })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
    })

    return NextResponse.json({ url: session.url })
  }
  ```
- [ ] Create `app/api/account/delete/route.ts` — deletes all user documents from Supabase Storage, deletes all DB rows, then deletes the auth user
- [ ] Commit: `git add -A && git commit -m "feat: add account management and billing portal"`

---

### Task 4: PDF formatting review

- [ ] Generate a sample document for each category using the wizard
- [ ] Download PDFs and review: check signature blocks, paragraph spacing, page breaks, and overall legibility
- [ ] If layout issues are found with `@react-pdf/renderer`, consider switching to a Puppeteer-based approach:
  - Install: `npm install puppeteer`
  - Create an HTML template per document type
  - Use `puppeteer.launch()` → `page.setContent()` → `page.pdf()` server-side
  - Note: Puppeteer adds ~200MB to your deployment size — use Vercel's fluid functions or a separate serverless function if needed
- [ ] Commit any export improvements: `git add -A && git commit -m "fix: improve PDF formatting for [category]"`

---

### Task 5: Accessibility check

- [ ] Install axe-core: `npm install --save-dev @axe-core/playwright`
- [ ] Add an accessibility test to `e2e/accessibility.spec.ts` that runs axe against the homepage, wizard, preview, and editor pages
- [ ] Run: `npx playwright test e2e/accessibility.spec.ts`
- [ ] Fix any critical or serious violations
- [ ] Commit: `git add -A && git commit -m "fix: accessibility improvements from axe-core audit"`

---

### Task 6: Pre-launch legal checklist

Before going live, the following must be completed manually (not code tasks):

- [ ] Lawyer has drafted and approved Terms of Service
- [ ] Lawyer has drafted and approved Privacy Policy (including 24-month inactivity deletion policy)
- [ ] Lawyer has approved all 8 state next-steps blurbs in `lib/documents/next-steps.ts`
- [ ] Per-document and download disclaimers have been reviewed
- [ ] Privacy Policy and ToS pages exist at `/privacy` and `/terms` and are linked from the footer
- [ ] ToS acceptance checkbox is implemented on the signup page and stored in the DB

---

### Task 7: Production environment setup

- [ ] In Stripe dashboard, switch from test mode to live mode and get live API keys
- [ ] Update Vercel environment variables with production values (Stripe live keys, production Supabase URL, etc.)
- [ ] In Supabase, update Authentication → URL Configuration with the production Vercel URL
- [ ] Set up a Stripe webhook in the Stripe dashboard pointing to `https://your-domain.com/api/webhooks/stripe` (not the CLI tunnel)
- [ ] Smoke test the full flow on the production URL with a real card
- [ ] Commit any environment config: `git add -A && git commit -m "chore: production environment configuration"`
- [ ] Push: `git push origin main`

---

**Plan 5 complete when:** The app is live on a production URL with real Stripe payments, transactional emails, a working dashboard, account management, and all legal documents approved by a lawyer.

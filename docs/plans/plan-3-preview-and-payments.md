# Plan 3: Preview & Payments

**Goal:** Build the document preview (server-side redacted), Stripe payment flow, and document unlock logic — so users can see what they're buying and pay to unlock the full document.

**Architecture:** The preview API serves only the first section (≥150 words) of a document; the rest is replaced server-side before reaching the browser. Stripe Checkout handles payment. A webhook updates the document's `unlocked` flag in Supabase. Supabase Realtime notifies the frontend when the unlock is confirmed.

**Tech Stack:** Stripe, Supabase Realtime, Next.js API routes, Resend

**Depends on:** Plans 1 & 2

**Deliverable:** A user can view a partial document preview, pay to unlock it, and see the full document appear after payment.

---

## File structure

```
app/
├── preview/
│   └── [documentId]/
│       └── page.tsx                     # Preview page (server component, redacted)
└── api/
    ├── checkout/
    │   └── route.ts                     # POST: create Stripe Checkout session
    └── webhooks/
        └── stripe/
            └── route.ts                 # POST: handle Stripe webhook events
components/
└── payment/
    ├── PreviewGate.tsx                  # Blurred/redacted preview + unlock CTA
    ├── UnlockButton.tsx                 # Pay-per-doc button
    └── SubscribeButton.tsx              # Subscription button
lib/
├── stripe/
│   ├── client.ts                        # Stripe SDK instance
│   └── webhooks.ts                      # Webhook event handlers
└── documents/
    └── redact.ts                        # Server-side content redaction logic
```

---

## Tasks

### Task 1: Stripe setup

- [ ] Install Stripe: `npm install stripe @stripe/stripe-js`
- [ ] Go to [stripe.com](https://stripe.com), create an account, and get your API keys from the Stripe dashboard
- [ ] Add to `.env.local`:
  ```
  STRIPE_SECRET_KEY=sk_test_...
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
  STRIPE_WEBHOOK_SECRET=whsec_...   (get this in Task 4)
  ```
- [ ] In Stripe dashboard → Products, create two products:
  - **Document Unlock** — one-time price of AUD $19 (adjust as desired)
  - **Monthly Subscription** — recurring price of AUD $39/month
- [ ] Note the Price IDs for both (format: `price_...`)
- [ ] Add to `.env.local`:
  ```
  STRIPE_UNLOCK_PRICE_ID=price_...
  STRIPE_SUBSCRIPTION_PRICE_ID=price_...
  ```
- [ ] Create `lib/stripe/client.ts`:
  ```ts
  import Stripe from 'stripe'
  export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  ```
- [ ] Commit: `git add -A && git commit -m "feat: add Stripe client setup"`

---

### Task 2: Server-side document redaction

- [ ] Create `lib/documents/redact.ts`:
  ```ts
  // Returns a redacted version of document content suitable for preview.
  // Shows the first 150 words (or the entire first field if longer), replaces the rest.
  export function redactContent(
    content: Record<string, string>,
    fields: { key: string; label: string }[]
  ): Record<string, string> {
    const result: Record<string, string> = {}
    let wordsShown = 0
    const TARGET_WORDS = 150

    for (const field of fields) {
      const value = content[field.key] ?? ''
      if (wordsShown >= TARGET_WORDS) {
        result[field.key] = '████████████████████████████'
        continue
      }
      const words = value.split(/\s+/).length
      if (wordsShown + words <= TARGET_WORDS) {
        result[field.key] = value
        wordsShown += words
      } else {
        // Show partial field up to word limit
        const allowed = TARGET_WORDS - wordsShown
        const partial = value.split(/\s+/).slice(0, allowed).join(' ')
        result[field.key] = partial + ' ████████████████'
        wordsShown = TARGET_WORDS
      }
    }

    return result
  }
  ```
- [ ] Commit: `git add -A && git commit -m "feat: add server-side document redaction"`

---

### Task 3: Preview page

- [ ] Create `app/preview/[documentId]/page.tsx` as a server component:
  - Fetch the document from Supabase
  - If `unlocked`, redirect to `/document/[documentId]`
  - If not, redact `current_content` using `redactContent()`
  - Render the redacted fields with the unlock CTA below
  - The full content is never sent to the browser
- [ ] Create `components/payment/PreviewGate.tsx` — renders the redacted document fields and the unlock buttons
- [ ] Run the dev server and verify: after completing the wizard, you land on the preview page and only partial content is visible
- [ ] Commit: `git add -A && git commit -m "feat: add document preview page with server-side redaction"`

---

### Task 4: Stripe Checkout

- [ ] Create `app/api/checkout/route.ts`:
  ```ts
  import { NextRequest, NextResponse } from 'next/server'
  import { createClient } from '@/lib/supabase/server'
  import { stripe } from '@/lib/stripe/client'

  export async function POST(req: NextRequest) {
    const { documentId, type } = await req.json() // type: 'unlock' | 'subscription'

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const priceId = type === 'subscription'
      ? process.env.STRIPE_SUBSCRIPTION_PRICE_ID!
      : process.env.STRIPE_UNLOCK_PRICE_ID!

    const session = await stripe.checkout.sessions.create({
      mode: type === 'subscription' ? 'subscription' : 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/preview/${documentId}?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/preview/${documentId}`,
      metadata: { documentId, userId: user.id, type },
      customer_email: user.email,
    })

    return NextResponse.json({ url: session.url })
  }
  ```
- [ ] Add `NEXT_PUBLIC_APP_URL=http://localhost:3000` to `.env.local`
- [ ] Create `components/payment/UnlockButton.tsx` — a button that calls `/api/checkout` and redirects to Stripe Checkout
- [ ] Test the payment flow in Stripe test mode using card number `4242 4242 4242 4242`
- [ ] Commit: `git add -A && git commit -m "feat: add Stripe Checkout flow"`

---

### Task 5: Stripe webhook handler

- [ ] Install Stripe CLI: `brew install stripe/stripe-cli/stripe-cli`
- [ ] In a terminal: `stripe login` then `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- [ ] Copy the webhook signing secret printed in the terminal into `.env.local` as `STRIPE_WEBHOOK_SECRET`
- [ ] Create `lib/stripe/webhooks.ts`:
  ```ts
  import { stripe } from './client'
  import { createClient } from '@/lib/supabase/server'
  import type Stripe from 'stripe'

  export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const supabase = createClient()
    const { documentId, userId, type } = session.metadata!

    if (type === 'unlock') {
      await supabase
        .from('documents')
        .update({ unlocked: true })
        .eq('id', documentId)
        .eq('user_id', userId)
    }

    if (type === 'subscription') {
      // Also unlock the document that triggered the subscription
      await supabase
        .from('documents')
        .update({ unlocked: true })
        .eq('id', documentId)
        .eq('user_id', userId)

      await supabase
        .from('subscriptions')
        .upsert({
          user_id: userId,
          stripe_subscription_id: session.subscription as string,
          stripe_customer_id: session.customer as string,
          status: 'active',
        })
    }
  }

  export async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const supabase = createClient()
    await supabase
      .from('subscriptions')
      .update({ status: 'inactive' })
      .eq('stripe_subscription_id', subscription.id)
  }

  export async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    const supabase = createClient()
    if (!invoice.subscription) return
    await supabase
      .from('subscriptions')
      .update({ status: 'active' })
      .eq('stripe_subscription_id', invoice.subscription as string)
  }

  export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    const supabase = createClient()
    if (!invoice.subscription) return
    await supabase
      .from('subscriptions')
      .update({ status: 'past_due' })
      .eq('stripe_subscription_id', invoice.subscription as string)
  }
  ```
- [ ] Create `app/api/webhooks/stripe/route.ts`:
  ```ts
  import { NextRequest, NextResponse } from 'next/server'
  import { stripe } from '@/lib/stripe/client'
  import {
    handleCheckoutCompleted,
    handleSubscriptionDeleted,
    handleInvoicePaymentSucceeded,
    handleInvoicePaymentFailed,
  } from '@/lib/stripe/webhooks'

  export async function POST(req: NextRequest) {
    const body = await req.text()
    const sig = req.headers.get('stripe-signature')!

    let event
    try {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object)
        break
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object)
        break
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object)
        break
    }

    return NextResponse.json({ received: true })
  }
  ```
- [ ] Commit: `git add -A && git commit -m "feat: add Stripe webhook handler"`

---

### Task 6: Realtime unlock + unlock failure notification

- [ ] In `app/preview/[documentId]/page.tsx`, if the URL contains `?payment=success`, render a client component that subscribes to Supabase Realtime on the document row and redirects to `/document/[documentId]` when `unlocked` becomes `true`
- [ ] Show "Payment received — your document is being unlocked..." during the wait
- [ ] If `unlocked` is not `true` after 5 minutes (300,000ms), show a support message: "Something went wrong. Email us at support@pettylawsuits.com.au and we'll sort it out."
- [ ] Commit: `git add -A && git commit -m "feat: add realtime unlock detection and failure fallback"`

---

### Task 7: End-to-end payment test

- [ ] Run: `npm run dev` + `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- [ ] Complete full flow: wizard → preview → pay with test card `4242 4242 4242 4242` → verify document is unlocked in Supabase → verify redirect to `/document/[id]`
- [ ] Test subscription flow with test card
- [ ] Push: `git push origin main`

---

**Plan 3 complete when:** A user can pay for a document (one-off or subscription) and the document becomes unlocked, confirmed via Supabase Realtime.

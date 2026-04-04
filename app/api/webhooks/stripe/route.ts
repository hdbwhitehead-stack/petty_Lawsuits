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

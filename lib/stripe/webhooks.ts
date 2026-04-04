import { createClient } from '@/lib/supabase/server'
import type Stripe from 'stripe'

export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = createClient()
  const { documentId, userId, type } = session.metadata!

  // Both one-off tiers unlock the document
  if (type === 'send' || type === 'full_petty') {
    await supabase
      .from('documents')
      .update({ unlocked: true })
      .eq('id', documentId)
      .eq('user_id', userId)
  }

  if (type === 'subscription') {
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
  const subId = ((invoice as unknown) as Record<string, unknown>).subscription as string | null
  if (!subId) return
  await supabase
    .from('subscriptions')
    .update({ status: 'active' })
    .eq('stripe_subscription_id', subId)
}

export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const supabase = createClient()
  const subId = ((invoice as unknown) as Record<string, unknown>).subscription as string | null
  if (!subId) return
  await supabase
    .from('subscriptions')
    .update({ status: 'past_due' })
    .eq('stripe_subscription_id', subId)
}

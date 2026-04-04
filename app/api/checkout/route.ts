import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe/client'

export async function POST(req: NextRequest) {
  const { documentId, type } = await req.json()

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const priceId =
    type === 'subscription'  ? process.env.STRIPE_SUBSCRIPTION_PRICE_ID! :
    type === 'full_petty'    ? process.env.STRIPE_FULL_PETTY_PRICE_ID! :
                               process.env.STRIPE_SEND_PRICE_ID!

  const session = await getStripe().checkout.sessions.create({
    mode: type === 'subscription' ? 'subscription' : 'payment',
    currency: 'aud',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/preview/${documentId}?payment=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/preview/${documentId}`,
    metadata: { documentId, userId: user.id, type },
    customer_email: user.email,
  })

  return NextResponse.json({ url: session.url })
}

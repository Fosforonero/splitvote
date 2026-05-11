import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isCosmeticItemId, COSMETIC_MAP } from '@/lib/cosmetics-store'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
  })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { itemId } = await req.json()

  if (!itemId || !isCosmeticItemId(itemId)) {
    return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 })
  }

  const item = COSMETIC_MAP[itemId]

  let admin: ReturnType<typeof createAdminClient>
  try {
    admin = createAdminClient()
  } catch {
    return NextResponse.json({ error: 'Server config error' }, { status: 500 })
  }

  // Check if already purchased
  const { data: existing } = await admin
    .from('user_purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', itemId)
    .eq('status', 'purchased')
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'Already purchased' }, { status: 409 })
  }

  // Resolve Stripe price ID from env
  const priceId = process.env[item.envKey]
  if (!priceId) {
    console.error(`[store-checkout] Missing env var: ${item.envKey}`)
    return NextResponse.json({ error: 'Product not configured' }, { status: 500 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://splitvote.io'

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'payment',
    success_url: `${baseUrl}/store?purchased=${itemId}`,
    cancel_url:  `${baseUrl}/store?payment=cancelled`,
    metadata: {
      userId:    user.id,
      productId: itemId,
      category:  item.category,
      type:      'cosmetic_purchase',
    },
    customer_email: user.email ?? undefined,
  })

  return NextResponse.json({ url: session.url })
}

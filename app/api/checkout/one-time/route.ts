/**
 * POST /api/checkout/one-time
 *
 * Creates a Stripe Checkout Session in `payment` mode for a one-time
 * purchase (Pixie Market species, cosmetics, etc.).
 *
 * Flow:
 *   1. Authenticate user
 *   2. Validate productId against PRODUCT_CATALOG
 *   3. Resolve Stripe Price ID via env var
 *   4. Refuse if user already owns the product (idempotent UX — they should
 *      not be able to pay twice for the same one-time unlock)
 *   5. Create Stripe Checkout Session with metadata.userId & productId
 *   6. Return { url } for client-side redirect
 *
 * Security:
 * - productId is validated against catalog (never trusted as-is from client)
 * - The webhook handler will additionally verify the Stripe Price ID on the
 *   completed session matches the catalog before granting ownership.
 */
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import {
  PRODUCT_BY_ID,
  getStripePriceId,
  type ProductId,
} from '@/lib/purchases'

export const dynamic = 'force-dynamic'

function isProductId(value: unknown): value is ProductId {
  return typeof value === 'string' && value in PRODUCT_BY_ID
}

export async function POST(req: NextRequest) {
  // ── Env gate ──────────────────────────────────────────────────────────
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  // ── Auth ──────────────────────────────────────────────────────────────
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── Input validation ──────────────────────────────────────────────────
  let body: { productId?: string; locale?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!isProductId(body.productId)) {
    return NextResponse.json({ error: 'Unknown productId' }, { status: 400 })
  }
  const productId = body.productId
  const product = PRODUCT_BY_ID[productId]

  if (product.comingSoon) {
    return NextResponse.json(
      { comingSoon: true, error: 'Product not yet available' },
      { status: 503 },
    )
  }

  const priceId = getStripePriceId(productId)
  if (!priceId) {
    // Env var missing — return graceful "coming soon" rather than 500 so the
    // store UI can show its standard "checkout coming online" hint.
    return NextResponse.json(
      { comingSoon: true, error: `Stripe Price ID not configured (${product.stripePriceEnvVar})` },
      { status: 501 },
    )
  }

  // ── Idempotent UX: refuse if already owned ────────────────────────────
  // Graceful if table missing (pre-v16 migration): treat as not-owned.
  try {
    const { data: existing } = await supabase
      .from('user_purchases')
      .select('product_id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .eq('status', 'completed')
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'You already own this item', alreadyOwned: true },
        { status: 409 },
      )
    }
  } catch {
    // Table may not exist yet — continue with checkout
  }

  // ── Create Checkout Session ───────────────────────────────────────────
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-02-24.acacia',
  })

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://splitvote.io'
  const locale = body.locale === 'it' ? '/it' : ''
  const successUrl = `${baseUrl}${locale}/store?purchased=${encodeURIComponent(productId)}&session_id={CHECKOUT_SESSION_ID}`
  const cancelUrl  = `${baseUrl}${locale}/store?cancelled=1`

  // EU consumer protection disclaimer for digital goods (required under
  // Directive 2011/83/EU when the user waives their 14-day right of withdrawal
  // because the product is consumed immediately on delivery).
  const refundDisclaimerEN =
    'Digital goods are delivered immediately. By completing this purchase you ' +
    'consent to immediate performance and waive your 14-day right of withdrawal.'
  const refundDisclaimerIT =
    'I beni digitali sono consegnati immediatamente. Procedendo con l\'acquisto ' +
    'acconsenti all\'esecuzione immediata e rinunci al diritto di recesso di 14 giorni.'
  const refundDisclaimer = body.locale === 'it' ? refundDisclaimerIT : refundDisclaimerEN

  let session: Stripe.Checkout.Session
  try {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: user.id,
        productId,
        type: 'one_time_purchase',
      },
      customer_email: user.email ?? undefined,
      // Tie the PaymentIntent to the user so refunds are easy to correlate
      payment_intent_data: {
        metadata: {
          userId: user.id,
          productId,
        },
        // Receipt/disclaimer copy attached to the Stripe payment
        description: `${product.name} — ${refundDisclaimer}`,
      },
      // Show the disclaimer in Stripe Checkout under "Terms" link
      custom_text: {
        submit: {
          message: refundDisclaimer,
        },
      },
    })
  } catch (err) {
    console.error('[checkout/one-time] sessions.create failed:', err instanceof Error ? err.message : String(err))
    return NextResponse.json({ error: 'Payment initiation failed' }, { status: 500 })
  }

  return NextResponse.json({ url: session.url })
}

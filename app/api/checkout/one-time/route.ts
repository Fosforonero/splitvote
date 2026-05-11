/**
 * POST /api/checkout/one-time
 *
 * Creates a Stripe Checkout Session in `payment` mode for a one-time purchase
 * (Pixie Market species, cosmetics, etc.).
 *
 * STATUS: STUB — Sprint 2 ships the store UI without a working checkout so
 * the page can be QA'd and indexed safely. Sprint 3 replaces this with the
 * real Stripe flow + ownership creation on webhook.
 *
 * Returning 501 keeps the client-side coming-soon modal in <ProductCard/>
 * happy: it sees `comingSoon: true` and shows a "Checkout coming online" hint.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  // Auth gate — the real route in Sprint 3 needs an authenticated user, so we
  // enforce the same contract now to surface auth errors during UI testing.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Lightweight body validation so the client gets the same error shape it
  // will get from the real endpoint.
  let body: { productId?: string; locale?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  if (!body.productId || typeof body.productId !== 'string') {
    return NextResponse.json({ error: 'productId required' }, { status: 400 })
  }

  // STUB — Sprint 3 implements:
  //  1. Look up product in PRODUCT_CATALOG, resolve Stripe Price ID
  //  2. Create Checkout Session in mode 'payment' with metadata.userId & productId
  //  3. Return { url: session.url }
  return NextResponse.json(
    {
      comingSoon: true,
      message: 'One-time checkout activates in the next deploy.',
    },
    { status: 501 },
  )
}

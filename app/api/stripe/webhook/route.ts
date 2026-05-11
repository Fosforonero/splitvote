import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { isCosmeticItemId, COSMETIC_MAP } from '@/lib/cosmetics-store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
  })

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Stripe webhook signature error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  let admin: ReturnType<typeof createAdminClient>
  try {
    admin = createAdminClient()
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[stripe/webhook] createAdminClient failed:', msg)
    return NextResponse.json({ error: 'Server config error' }, { status: 500 })
  }

  // ── checkout.session.completed ──────────────────────────────────────────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ received: true })
    }

    const type   = session.metadata?.type
    const userId = session.metadata?.userId

    // ── Name change ───────────────────────────────────────────────────────────
    if (type === 'name_change') {
      const newName = session.metadata?.newName
      if (!userId || !newName) return NextResponse.json({ received: true })

      const { data: profile } = await admin
        .from('profiles')
        .select('name_changes')
        .eq('id', userId)
        .single()

      const currentChanges = (profile?.name_changes ?? 0) as number

      const { error } = await admin
        .from('profiles')
        .update({ display_name: newName, name_changes: currentChanges + 1 })
        .eq('id', userId)

      if (error) {
        console.error('Webhook: failed to update profile (name_change):', error)
        return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
      }

      console.log(`✅ Name change: user=${userId.slice(0, 8)} → "${newName}" (change #${currentChanges + 1})`)
    }

    // ── Cosmetic purchase (pixie_purchase legacy + cosmetic_purchase) ──────────
    if (type === 'pixie_purchase' || type === 'cosmetic_purchase') {
      const productId = session.metadata?.productId
      const category  = session.metadata?.category ?? 'pixie'

      if (!userId || !productId || !isCosmeticItemId(productId)) {
        console.warn('[webhook] cosmetic_purchase: missing or invalid metadata', session.metadata)
        return NextResponse.json({ received: true })
      }

      const item = COSMETIC_MAP[productId]

      // Record the purchase
      const { error: purchaseError } = await admin
        .from('user_purchases')
        .upsert(
          {
            user_id:           userId,
            product_id:        productId,
            stripe_session_id: session.id,
            stripe_charge_id:  session.payment_intent as string | null,
            amount_cents:      session.amount_total ?? item.priceCents,
            currency:          session.currency ?? 'eur',
            status:            'purchased',
          },
          { onConflict: 'stripe_session_id' }
        )

      if (purchaseError) {
        console.error('[webhook] Failed to insert user_purchase:', purchaseError)
        return NextResponse.json({ error: 'DB insert failed' }, { status: 500 })
      }

      // Grant XP + update cosmetic state
      const { data: profile } = await admin
        .from('profiles')
        .select('pixie_xp, xp')
        .eq('id', userId)
        .single()

      const currentXp    = (profile?.xp ?? 0) as number
      const profileUpdate: Record<string, unknown> = { xp: currentXp + item.xpBonus }

      if (category === 'pixie') {
        const currentPixieXp = (profile?.pixie_xp ?? {}) as Record<string, unknown>
        const ownedItems     = Array.isArray(currentPixieXp.owned) ? currentPixieXp.owned as string[] : []
        profileUpdate.pixie_xp = {
          ...currentPixieXp,
          owned: Array.from(new Set([...ownedItems, productId])),
        }
      } else if (category === 'frame') {
        profileUpdate.equipped_frame = productId
      } else if (category === 'glow') {
        profileUpdate.equipped_glow = productId
      } else if (category === 'name_color') {
        profileUpdate.name_color = 'gradient' // default to first color
      }

      const { error: profileError } = await admin
        .from('profiles')
        .update(profileUpdate)
        .eq('id', userId)

      if (profileError) {
        console.error('[webhook] Failed to update profile (cosmetic_purchase):', profileError)
        return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
      }

      console.log(`✅ Cosmetic [${category}]: user=${userId.slice(0, 8)} → "${productId}" (+${item.xpBonus} XP)`)
    }
  }

  // ── charge.refunded ─────────────────────────────────────────────────────────
  if (event.type === 'charge.refunded') {
    const charge    = event.data.object as Stripe.Charge
    const paymentIntent = typeof charge.payment_intent === 'string' ? charge.payment_intent : null

    if (!paymentIntent) return NextResponse.json({ received: true })

    const { data: purchase } = await admin
      .from('user_purchases')
      .select('id, user_id, product_id, status')
      .eq('stripe_charge_id', paymentIntent)
      .maybeSingle()

    if (!purchase || purchase.status === 'refunded') {
      return NextResponse.json({ received: true })
    }

    await admin
      .from('user_purchases')
      .update({ status: 'refunded', updated_at: new Date().toISOString() })
      .eq('id', purchase.id)

    // Remove item from pixie_xp.owned and deduct XP
    if (isPixieItemId(purchase.product_id)) {
      const { data: profile } = await admin
        .from('profiles')
        .select('pixie_xp, xp')
        .eq('id', purchase.user_id)
        .single()

      const currentPixieXp = (profile?.pixie_xp ?? {}) as Record<string, unknown>
      const ownedItems      = Array.isArray(currentPixieXp.owned) ? currentPixieXp.owned as string[] : []
      const item            = PIXIE_ITEM_MAP[purchase.product_id]
      const currentXp       = (profile?.xp ?? 0) as number

      await admin
        .from('profiles')
        .update({
          pixie_xp: { ...currentPixieXp, owned: ownedItems.filter(i => i !== purchase.product_id) },
          xp:       Math.max(0, currentXp - item.xpBonus),
        })
        .eq('id', purchase.user_id)

      console.log(`↩️ Refund: user=${purchase.user_id.slice(0, 8)} ← "${purchase.product_id}"`)
    }
  }

  return NextResponse.json({ received: true })
}

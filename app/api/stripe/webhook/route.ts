import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  claimWebhookEvent,
  markWebhookEventProcessed,
  markWebhookEventFailed,
} from '@/lib/stripe-webhook-events'
import { findProductByStripePriceId } from '@/lib/purchases'
import { sendEmail } from '@/lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (!Boolean(process.env.STRIPE_SECRET_KEY) || !Boolean(process.env.STRIPE_WEBHOOK_SECRET)) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-02-24.acacia' })

  const body = await req.text()
  const sig  = req.headers.get('stripe-signature')

  if (!sig) return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('[stripe/webhook] Signature error:', err instanceof Error ? err.message : String(err))
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

  // ── Idempotency claim ─────────────────────────────────────────────────────
  // Prevents double-processing when Stripe retries after a 5xx or timeout.
  // Backward-compatible: if migration_v11 is not yet applied, claim returns
  // { claimed: true, fallback: true } and processing continues as before.
  const claim = await claimWebhookEvent(admin, event.id, event.type)
  if (!claim.claimed) {
    // Already processed or currently in flight — acknowledge safely
    return NextResponse.json({ received: true, duplicate: true })
  }

  // ── Process event ─────────────────────────────────────────────────────────
  try {
    await processStripeEvent(event, admin)
  } catch (err) {
    // Mark failed so Stripe can retry; returning 500 triggers Stripe's retry schedule
    await markWebhookEventFailed(admin, event.id, err)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }

  await markWebhookEventProcessed(admin, event.id)
  return NextResponse.json({ received: true })
}

// ── Event handler ─────────────────────────────────────────────────────────────
// Throws on errors that should cause Stripe to retry (payment-critical paths).
// Logs-and-continues on errors that are non-critical (subscription sync).
// Does NOT log email addresses, display names, full metadata, or Stripe payloads.

async function processStripeEvent(
  event: Stripe.Event,
  admin: ReturnType<typeof createAdminClient>,
): Promise<void> {

  // ── checkout.session.completed ──────────────────────────────────────────
  if (event.type === 'checkout.session.completed') {
    const session  = event.data.object as Stripe.Checkout.Session
    const userId   = session.metadata?.userId
    const type     = session.metadata?.type
    const customer = typeof session.customer === 'string' ? session.customer : session.customer?.id

    // Always persist stripe_customer_id when we have a userId
    if (userId && customer) {
      await admin.from('profiles').update({ stripe_customer_id: customer }).eq('id', userId)
    }

    // ── one-time name change ──
    if (type === 'name_change') {
      const newName = session.metadata?.newName
      if (!userId || !newName || session.payment_status !== 'paid') return

      const { data: profile } = await admin
        .from('profiles').select('name_changes').eq('id', userId).single()

      const currentChanges = (profile?.name_changes ?? 0) as number

      const { error } = await admin
        .from('profiles')
        .update({ display_name: newName, name_changes: currentChanges + 1 })
        .eq('id', userId)

      if (error) {
        console.error('[stripe/webhook] name_change update failed:', error.code)
        throw new Error('name_change DB update failed')
      }
      console.log(`✅ Name change: user=${userId.slice(0, 8)} (#${currentChanges + 1})`)
    }

    // ── one-time purchase (Pixie Market, future cosmetics) ──
    // Uses the Stripe Price ID from the session as the source of truth (not
    // metadata.productId) so a metadata bug can't grant the wrong item.
    if (type === 'one_time_purchase' && session.mode === 'payment') {
      if (!userId || session.payment_status !== 'paid') return

      // Lazy-init Stripe client at runtime to fetch line items
      const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2025-02-24.acacia',
      })

      let lineItems: Stripe.ApiList<Stripe.LineItem>
      try {
        lineItems = await stripeClient.checkout.sessions.listLineItems(session.id, { limit: 1 })
      } catch (err) {
        console.error('[stripe/webhook] one_time_purchase listLineItems failed:', err instanceof Error ? err.message : String(err))
        throw new Error('listLineItems failed')
      }

      const firstLine = lineItems.data[0]
      const priceId   = firstLine?.price?.id
      if (!priceId) {
        console.error('[stripe/webhook] one_time_purchase: missing priceId on session', session.id)
        return // No retry — this session is malformed beyond our control
      }

      const product = findProductByStripePriceId(priceId)
      if (!product) {
        console.error(`[stripe/webhook] one_time_purchase: unknown Stripe Price ${priceId} (not in catalog)`)
        return // Don't grant ownership for an unknown product
      }

      // Cross-check: metadata.productId should match the price-derived product.
      // Mismatch = log warning but still trust the price (Stripe's truth).
      const metadataProductId = session.metadata?.productId
      if (metadataProductId && metadataProductId !== product.id) {
        console.warn(`[stripe/webhook] one_time_purchase: metadata.productId=${metadataProductId} != price-derived=${product.id} — trusting price`)
      }

      const paymentIntentId = typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id
      if (!paymentIntentId) {
        console.error('[stripe/webhook] one_time_purchase: missing payment_intent_id')
        throw new Error('payment_intent_id missing')
      }

      const amountCents = session.amount_total ?? product.priceCents
      const currency    = (session.currency ?? 'eur').toLowerCase()

      // UPSERT pattern: handles re-purchase after refund (same user+product,
      // new payment_intent_id, status reset to 'completed').
      const { error } = await admin
        .from('user_purchases')
        .upsert(
          {
            user_id:                   userId,
            product_id:                product.id,
            product_type:              product.type,
            stripe_payment_intent_id:  paymentIntentId,
            stripe_session_id:         session.id,
            amount_cents:              amountCents,
            currency,
            status:                    'completed',
            purchased_at:              new Date().toISOString(),
            refunded_at:               null,
          },
          { onConflict: 'user_id,product_id' },
        )

      if (error) {
        console.error('[stripe/webhook] user_purchases upsert failed:', error.code, error.message)
        throw new Error('user_purchases upsert failed')
      }
      console.log(`✅ One-time purchase: user=${userId.slice(0, 8)} product=${product.id} amount=${amountCents}`)

      // Fire-and-forget confirmation email. Never blocks ownership grant —
      // if email fails the user still owns the product. Stripe also sends
      // its own receipt; this is the SplitVote-branded follow-up.
      const buyerEmail = session.customer_details?.email ?? session.customer_email
      if (buyerEmail) {
        try {
          await sendPurchaseConfirmationEmail({
            to: buyerEmail,
            productName: product.name,
            amountCents,
            currency,
            sessionId: session.id,
          })
        } catch (err) {
          console.error('[stripe/webhook] confirmation email failed:', err instanceof Error ? err.message : String(err))
        }
      }
    }

    // ── subscription checkout completed ──
    if (type === 'subscription' && session.mode === 'subscription') {
      if (!userId) return

      const subId = typeof session.subscription === 'string'
        ? session.subscription
        : (session.subscription as Stripe.Subscription | null)?.id ?? null

      const { error } = await admin
        .from('profiles')
        .update({
          is_premium:             true,
          stripe_subscription_id: subId,
          subscription_status:    'active',
        })
        .eq('id', userId)

      if (error) {
        console.error('[stripe/webhook] premium activation failed:', error.code)
        throw new Error('premium activation DB update failed')
      }
      console.log(`✅ Premium activated: user=${userId.slice(0, 8)}`)
    }
  }

  // ── customer.subscription.updated ──────────────────────────────────────
  if (event.type === 'customer.subscription.updated') {
    const sub        = event.data.object as Stripe.Subscription
    const customerId = typeof sub.customer === 'string' ? sub.customer : (sub.customer as Stripe.Customer).id
    const status     = sub.status
    const isPremium  = status === 'active' || status === 'trialing'

    const { error } = await admin
      .from('profiles')
      .update({
        is_premium:             isPremium,
        stripe_subscription_id: sub.id,
        subscription_status:    status,
      })
      .eq('stripe_customer_id', customerId)

    if (error) console.error('[stripe/webhook] subscription.updated sync failed:', error.code)
    console.log(`✅ Subscription updated: customer=${customerId.slice(0, 12)} status=${status}`)
  }

  // ── charge.refunded ─────────────────────────────────────────────────────
  // Stripe fires this when a refund is issued (full or partial) on a charge.
  // We mark the matching user_purchases row as 'refunded' so the entitlement
  // check (status = 'completed') removes the unlock.
  // Partial refunds: we treat amount_refunded == amount_paid as full refund.
  // For partial refunds we currently leave the row as 'completed' (user keeps
  // the item) — this is the safer default; partial refunds for cosmetics are
  // rare and easy to handle manually.
  if (event.type === 'charge.refunded') {
    const charge = event.data.object as Stripe.Charge
    const paymentIntentId = typeof charge.payment_intent === 'string'
      ? charge.payment_intent
      : charge.payment_intent?.id
    if (!paymentIntentId) {
      console.warn('[stripe/webhook] charge.refunded: no payment_intent_id, skipping')
    } else if (charge.amount_refunded < charge.amount) {
      console.log(`ℹ️  charge.refunded partial (${charge.amount_refunded}/${charge.amount}) — keeping unlock for pi=${paymentIntentId.slice(0, 12)}`)
    } else {
      const { error } = await admin
        .from('user_purchases')
        .update({ status: 'refunded', refunded_at: new Date().toISOString() })
        .eq('stripe_payment_intent_id', paymentIntentId)
        .eq('status', 'completed')

      if (error) {
        console.error('[stripe/webhook] charge.refunded update failed:', error.code, error.message)
        // Non-throwing — refund correctness is operationally important but
        // not as critical as granting unlocks. Log and continue.
      } else {
        console.log(`✅ Refund processed: pi=${paymentIntentId.slice(0, 12)}`)
      }
    }
  }

  // ── customer.subscription.deleted ──────────────────────────────────────
  if (event.type === 'customer.subscription.deleted') {
    const sub        = event.data.object as Stripe.Subscription
    const customerId = typeof sub.customer === 'string' ? sub.customer : (sub.customer as Stripe.Customer).id

    const { error } = await admin
      .from('profiles')
      .update({
        is_premium:             false,
        stripe_subscription_id: null,
        subscription_status:    'cancelled',
      })
      .eq('stripe_customer_id', customerId)

    if (error) console.error('[stripe/webhook] subscription.deleted sync failed:', error.code)
    console.log(`✅ Subscription cancelled: customer=${customerId.slice(0, 12)}`)
  }
}

// ── Purchase confirmation email ─────────────────────────────────────────
// Lightweight branded receipt. Stripe also sends an automatic receipt with
// the line item and refund link — this is the SplitVote-side "thanks +
// here's where to use it" follow-up.

async function sendPurchaseConfirmationEmail(opts: {
  to: string
  productName: string
  amountCents: number
  currency: string
  sessionId: string
}): Promise<void> {
  const { to, productName, amountCents, currency, sessionId } = opts
  const eur = (amountCents / 100).toFixed(2)
  const symbol = currency.toUpperCase() === 'EUR' ? '€' : currency.toUpperCase() + ' '
  const priceFormatted = `${symbol}${eur}`

  const subject = `🎉 Your ${productName} is yours — SplitVote`

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background:#0a0a0f; color:#f1f5f9;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#0a0a0f;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px; background:#0d0d1a; border:1px solid #1e293b; border-radius:16px; overflow:hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #10b981, #059669); padding: 32px 24px; text-align: center;">
              <h1 style="margin:0; color:white; font-size:28px; font-weight:900;">🎉 Sblocco completato</h1>
              <p style="margin:8px 0 0; color:rgba(255,255,255,0.85); font-size:14px;">Grazie per il supporto a SplitVote</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 24px;">
              <h2 style="margin:0 0 16px; color:#f1f5f9; font-size:20px;">${productName}</h2>
              <p style="margin:0 0 24px; color:#94a3b8; font-size:14px; line-height:1.6;">
                Il tuo nuovo sblocco è già attivo. Vai alla dashboard e trovalo nel selettore Pixie o nel widget Cosmetici.
              </p>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#0a0a1a; border:1px solid #1e293b; border-radius:12px; margin-bottom: 24px;">
                <tr><td style="padding: 14px 18px; color:#64748b; font-size:12px;">Importo</td>
                    <td style="padding: 14px 18px; color:#f1f5f9; font-size:14px; font-weight:700; text-align:right;">${priceFormatted}</td></tr>
                <tr><td style="padding: 14px 18px; border-top:1px solid #1e293b; color:#64748b; font-size:12px;">ID transazione</td>
                    <td style="padding: 14px 18px; border-top:1px solid #1e293b; color:#94a3b8; font-size:11px; font-family:monospace; text-align:right;">${sessionId.slice(0, 28)}…</td></tr>
              </table>

              <div style="text-align:center; margin-bottom: 24px;">
                <a href="https://splitvote.io/dashboard"
                   style="display:inline-block; background:#3b82f6; color:white; text-decoration:none; font-weight:900; font-size:14px; padding:14px 32px; border-radius:12px;">
                  Vai alla Dashboard →
                </a>
              </div>

              <p style="margin:0; color:#475569; font-size:11px; line-height:1.6; text-align:center;">
                Hai bisogno di aiuto? Rispondi a questa email o scrivi a
                <a href="mailto:hello@splitvote.io" style="color:#60a5fa; text-decoration:none;">hello@splitvote.io</a>.<br>
                Storico acquisti completo su <a href="https://splitvote.io/orders" style="color:#60a5fa; text-decoration:none;">splitvote.io/orders</a>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#0a0a0f; padding: 20px 24px; text-align:center; color:#334155; font-size:11px; border-top:1px solid #1e293b;">
              SplitVote · splitvote.io<br>
              Beni digitali — consegna immediata, rinuncia al recesso 14gg ai sensi della Direttiva 2011/83/UE.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  await sendEmail({ to, subject, html })
}

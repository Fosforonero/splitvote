-- v16: User one-time purchases (Pixie Market + future cosmetics)
--
-- Apply via: Supabase dashboard → SQL Editor → New query → paste → Run
--
-- Purpose: records every one-time purchase made by a user via Stripe Checkout
-- in `payment` mode (NOT subscription). Used to determine which `market`-tier
-- Pixie species the user has unlocked, and (in future sprints) which cosmetics
-- they own (frames, glows, name colors, etc.).
--
-- The webhook handler (app/api/stripe/webhook/route.ts) inserts a row here on
-- checkout.session.completed when metadata.type = 'one_time_purchase'. The
-- product_id matches the Stripe Product metadata.product_id field, which we
-- own in code (e.g. 'pixie_crown', 'frame_gold', 'name_color_red').
--
-- Idempotency: stripe_payment_intent_id is unique, so retries of the same
-- webhook event never create duplicate purchase rows.
--
-- RLS: users can READ their own purchases. INSERT/UPDATE/DELETE is service-role
-- only — the webhook handler is the sole writer.

-- ── Table ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_purchases (
  id                          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                     UUID         NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id                  TEXT         NOT NULL,                                -- 'pixie_crown', 'frame_gold', etc.
  product_type                TEXT         NOT NULL CHECK (product_type IN (
                                              'pixie',
                                              'frame',
                                              'glow',
                                              'name_color',
                                              'bundle'
                                           )),
  stripe_payment_intent_id    TEXT         NOT NULL,
  stripe_session_id           TEXT,                                                  -- optional, useful for refund correlation
  amount_cents                INTEGER      NOT NULL CHECK (amount_cents >= 0),
  currency                    TEXT         NOT NULL DEFAULT 'eur' CHECK (length(currency) = 3),
  status                      TEXT         NOT NULL DEFAULT 'completed' CHECK (status IN (
                                              'completed',
                                              'refunded'
                                           )),
  purchased_at                TIMESTAMPTZ  NOT NULL DEFAULT now(),
  refunded_at                 TIMESTAMPTZ,

  -- One Stripe PaymentIntent → one purchase row. Idempotent webhook safety.
  CONSTRAINT user_purchases_payment_intent_unique UNIQUE (stripe_payment_intent_id),

  -- A user can only own each product once (Pixie species, cornice, etc.).
  -- Refunded rows keep this constraint; if the user re-buys after refund,
  -- we UPDATE the existing row back to 'completed' rather than INSERT a new one.
  CONSTRAINT user_purchases_user_product_unique UNIQUE (user_id, product_id)
);

-- ── Indexes ────────────────────────────────────────────────────────────────
-- Fastest lookup: "what does this user own?" (called on every profile/dashboard load)
CREATE INDEX IF NOT EXISTS user_purchases_user_id_idx
  ON public.user_purchases (user_id)
  WHERE status = 'completed';

-- Useful for ops: "find this purchase by Stripe IDs"
CREATE INDEX IF NOT EXISTS user_purchases_session_idx
  ON public.user_purchases (stripe_session_id)
  WHERE stripe_session_id IS NOT NULL;

-- Analytics: most-purchased products
CREATE INDEX IF NOT EXISTS user_purchases_product_idx
  ON public.user_purchases (product_id, purchased_at DESC)
  WHERE status = 'completed';

-- ── RLS ────────────────────────────────────────────────────────────────────
ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;

-- Users can SELECT their own purchases (for the store "Owned" badge + entitlement checks)
DROP POLICY IF EXISTS user_purchases_select_own ON public.user_purchases;
CREATE POLICY user_purchases_select_own
  ON public.user_purchases
  FOR SELECT
  USING (auth.uid() = user_id);

-- No INSERT / UPDATE / DELETE policies: writes are server-only via service role
-- (Stripe webhook handler). This is intentional — clients must never write
-- to this table directly, since ownership controls entitlements.

-- ── Optional: small helper view for "user owns product?" queries ───────────
-- Not used by code yet, but handy in the SQL Editor for support/QA.
CREATE OR REPLACE VIEW public.user_owned_products AS
SELECT user_id, product_id, product_type, purchased_at
FROM public.user_purchases
WHERE status = 'completed';

-- ── Sanity check ───────────────────────────────────────────────────────────
-- After applying, verify with:
--   SELECT count(*) FROM public.user_purchases;             -- should return 0
--   SELECT relrowsecurity FROM pg_class WHERE relname = 'user_purchases';  -- should be true

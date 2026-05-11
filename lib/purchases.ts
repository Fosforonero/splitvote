/**
 * lib/purchases.ts — one-time purchase product catalog + entitlement helpers
 *
 * This is the single source of truth for:
 *  - The list of products available in the SplitVote Store
 *  - The mapping from internal product_id → Stripe Price ID (via env var)
 *  - Derivation of `ownedMarketItems` from a user's purchase rows
 *
 * The webhook handler reads PRODUCT_CATALOG to validate incoming purchases:
 * we never trust the client-supplied product_id; instead we look up the
 * Stripe Price ID in the catalog and verify it matches the session's price.
 */

import type { CompanionSpecies } from './companion'

// ── Product type taxonomy ─────────────────────────────────────────────────
export type ProductType = 'pixie' | 'frame' | 'glow' | 'name_color' | 'bundle'

/** Internal product identifiers. Keep stable — these are persisted in `user_purchases.product_id`. */
export type ProductId =
  // Market-tier Pixies (sprint 1)
  | 'pixie_crown'
  | 'pixie_diamond'
  | 'pixie_galaxy'
  | 'pixie_angel'
  | 'pixie_devil'
  | 'pixie_nova'
  // Cosmetics (future sprints — types are reserved now so DB never has unknown values)
  | 'frame_gold'
  | 'frame_rainbow'
  | 'frame_pulse'
  | 'frame_holo'
  | 'glow_fire'
  | 'glow_frost'
  | 'glow_aurora'
  | 'name_color_bundle'

export interface ProductDef {
  id: ProductId
  type: ProductType
  /** Display name shown in the store. EN; locale-aware in UI via i18n maps. */
  name: string
  /** Short marketing line. Keep under 80 chars. */
  tagline: string
  /** Price in cents (EUR). Source of truth for client display & webhook validation. */
  priceCents: number
  /** Env var holding the Stripe Price ID for this product (e.g. STRIPE_PRICE_PIXIE_CROWN). */
  stripePriceEnvVar: string
  /** For pixie products: which CompanionSpecies they unlock. */
  unlocksSpecies?: CompanionSpecies
  /** Hide from store until launched. Useful for staging upcoming cosmetics. */
  comingSoon?: boolean
}

// ── Catalog ───────────────────────────────────────────────────────────────
export const PRODUCT_CATALOG: ProductDef[] = [
  // Market Pixies — €3.99 base, Nova is €4.99 (rarest)
  {
    id: 'pixie_crown',
    type: 'pixie',
    name: 'Pixie Crown',
    tagline: 'A regal spirit who weighs every dilemma with authority.',
    priceCents: 399,
    stripePriceEnvVar: 'STRIPE_PRICE_PIXIE_CROWN',
    unlocksSpecies: 'crown',
  },
  {
    id: 'pixie_diamond',
    type: 'pixie',
    name: 'Pixie Diamond',
    tagline: 'A crystalline entity who sees moral truth with precision.',
    priceCents: 399,
    stripePriceEnvVar: 'STRIPE_PRICE_PIXIE_DIAMOND',
    unlocksSpecies: 'diamond',
  },
  {
    id: 'pixie_galaxy',
    type: 'pixie',
    name: 'Pixie Galaxy',
    tagline: 'A cosmic entity carrying entire star systems in its wake.',
    priceCents: 399,
    stripePriceEnvVar: 'STRIPE_PRICE_PIXIE_GALAXY',
    unlocksSpecies: 'galaxy',
  },
  {
    id: 'pixie_angel',
    type: 'pixie',
    name: 'Pixie Angel',
    tagline: 'A celestial being of pure moral light.',
    priceCents: 399,
    stripePriceEnvVar: 'STRIPE_PRICE_PIXIE_ANGEL',
    unlocksSpecies: 'angel',
  },
  {
    id: 'pixie_devil',
    type: 'pixie',
    name: 'Pixie Devil',
    tagline: 'A chaotic spirit who tests every moral boundary.',
    priceCents: 399,
    stripePriceEnvVar: 'STRIPE_PRICE_PIXIE_DEVIL',
    unlocksSpecies: 'devil',
  },
  {
    id: 'pixie_nova',
    type: 'pixie',
    name: 'Pixie Nova',
    tagline: 'An explosive starburst spirit — every choice feels like a supernova.',
    priceCents: 499,
    stripePriceEnvVar: 'STRIPE_PRICE_PIXIE_NOVA',
    unlocksSpecies: 'scintille',
  },

  // ── Cosmetics (reserved; comingSoon hides them in the store UI) ─────────
  { id: 'frame_gold',    type: 'frame', name: 'Gold Frame',    tagline: 'A regal gold border for your profile.',                priceCents: 199, stripePriceEnvVar: 'STRIPE_PRICE_FRAME_GOLD',    comingSoon: true },
  { id: 'frame_rainbow', type: 'frame', name: 'Rainbow Frame', tagline: 'A vibrant rainbow border that shifts with hover.',     priceCents: 299, stripePriceEnvVar: 'STRIPE_PRICE_FRAME_RAINBOW', comingSoon: true },
  { id: 'frame_pulse',   type: 'frame', name: 'Pulse Frame',   tagline: 'An animated pulsing border that draws attention.',     priceCents: 399, stripePriceEnvVar: 'STRIPE_PRICE_FRAME_PULSE',   comingSoon: true },
  { id: 'frame_holo',    type: 'frame', name: 'Holo Frame',    tagline: 'A holographic border with prismatic shifts.',          priceCents: 399, stripePriceEnvVar: 'STRIPE_PRICE_FRAME_HOLO',    comingSoon: true },
  { id: 'glow_fire',     type: 'glow',  name: 'Fire Glow',     tagline: 'A fiery glow on your display name.',                   priceCents: 199, stripePriceEnvVar: 'STRIPE_PRICE_GLOW_FIRE',     comingSoon: true },
  { id: 'glow_frost',    type: 'glow',  name: 'Frost Glow',    tagline: 'A cool icy glow on your display name.',                priceCents: 199, stripePriceEnvVar: 'STRIPE_PRICE_GLOW_FROST',    comingSoon: true },
  { id: 'glow_aurora',   type: 'glow',  name: 'Aurora Glow',   tagline: 'A shifting aurora glow on your display name.',         priceCents: 199, stripePriceEnvVar: 'STRIPE_PRICE_GLOW_AURORA',   comingSoon: true },
  { id: 'name_color_bundle', type: 'bundle', name: 'All Name Colors', tagline: '8 premium name colors. Save vs buying singles.', priceCents: 499, stripePriceEnvVar: 'STRIPE_PRICE_NAME_COLOR_BUNDLE', comingSoon: true },
]

export const PRODUCT_BY_ID: Record<ProductId, ProductDef> = Object.fromEntries(
  PRODUCT_CATALOG.map(p => [p.id, p]),
) as Record<ProductId, ProductDef>

// ── Stripe ↔ catalog helpers ──────────────────────────────────────────────

/**
 * Resolves a Stripe Price ID from a product ID using the env var declared in the catalog.
 * Returns null if the env var is unset (so the webhook can skip gracefully and we don't
 * leak a misconfigured product to checkout).
 */
export function getStripePriceId(productId: ProductId): string | null {
  const def = PRODUCT_BY_ID[productId]
  if (!def) return null
  const envValue = process.env[def.stripePriceEnvVar]
  return envValue && envValue.length > 0 ? envValue : null
}

/**
 * Reverse lookup: given a Stripe Price ID seen on a webhook event, find the matching
 * internal product. Returns null if no product in the catalog points to that price.
 * Webhook-critical: defends against malicious metadata claiming an arbitrary product_id.
 */
export function findProductByStripePriceId(stripePriceId: string): ProductDef | null {
  for (const def of PRODUCT_CATALOG) {
    const env = process.env[def.stripePriceEnvVar]
    if (env && env === stripePriceId) return def
  }
  return null
}

// ── Purchase row shape (matches user_purchases columns) ───────────────────
export interface PurchaseRow {
  product_id: ProductId
  product_type: ProductType
  status: 'completed' | 'refunded'
  purchased_at: string
}

/**
 * Derives the list of unlocked `market`-tier Pixie species from a user's purchase rows.
 * Refunded purchases are excluded. Unknown product IDs are silently skipped (forward-compat).
 */
export function ownedMarketSpeciesFromPurchases(rows: PurchaseRow[]): CompanionSpecies[] {
  const species: CompanionSpecies[] = []
  for (const row of rows) {
    if (row.status !== 'completed') continue
    if (row.product_type !== 'pixie') continue
    const def = PRODUCT_BY_ID[row.product_id]
    if (def?.unlocksSpecies) species.push(def.unlocksSpecies)
  }
  return species
}

/** True if the user has a completed purchase for the given product. */
export function userOwnsProduct(rows: PurchaseRow[], productId: ProductId): boolean {
  return rows.some(r => r.status === 'completed' && r.product_id === productId)
}

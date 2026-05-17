// ── Cosmetics Store — all purchasable cosmetic items ─────────────────────────

export type CosmeticCategory = 'pixie' | 'frame' | 'glow' | 'name_color'

export type CosmeticItemId =
  // Pixie skins
  | 'pixie_crown' | 'pixie_diamond' | 'pixie_galaxy'
  | 'pixie_angel' | 'pixie_devil'   | 'pixie_nova'
  // Frames
  | 'frame_gold' | 'frame_rainbow' | 'frame_pulse' | 'frame_holo'
  // Glows
  | 'glow_fire' | 'glow_frost' | 'glow_aurora'
  // Bundles
  | 'name_color_bundle'

export interface CosmeticItem {
  id: CosmeticItemId
  category: CosmeticCategory
  name: string
  description: string
  emoji: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  priceCents: number
  priceDisplay: string
  envKey: string            // process.env[envKey] → Stripe price ID
  xpBonus: number
  /** For frames/glows: the CSS class(es) applied to the card border/shadow */
  cssClass?: string
  /** For name colors: the Tailwind text color class */
  colorClass?: string
}

export const COSMETIC_ITEMS: CosmeticItem[] = [
  // ── Pixie skins ──────────────────────────────────────────────────────────
  {
    id: 'pixie_crown', category: 'pixie',
    name: 'Pixie Crown', description: 'A regal golden crown. Your Pixie radiates royal authority.',
    emoji: '👑', rarity: 'rare', priceCents: 399, priceDisplay: '€3.99',
    envKey: 'STRIPE_PRICE_PIXIE_CROWN', xpBonus: 200,
  },
  {
    id: 'pixie_diamond', category: 'pixie',
    name: 'Pixie Diamond', description: 'Crystalline diamond form — ultra-rare sparkle on every vote.',
    emoji: '💎', rarity: 'rare', priceCents: 399, priceDisplay: '€3.99',
    envKey: 'STRIPE_PRICE_PIXIE_DIAMOND', xpBonus: 200,
  },
  {
    id: 'pixie_galaxy', category: 'pixie',
    name: 'Pixie Galaxy', description: 'A cosmic skin with swirling stardust. Epic power unlocked.',
    emoji: '🌌', rarity: 'epic', priceCents: 399, priceDisplay: '€3.99',
    envKey: 'STRIPE_PRICE_PIXIE_GALAXY', xpBonus: 350,
  },
  {
    id: 'pixie_angel', category: 'pixie',
    name: 'Pixie Angel', description: 'Pure radiant wings. Your Pixie becomes a guardian of truth.',
    emoji: '😇', rarity: 'rare', priceCents: 399, priceDisplay: '€3.99',
    envKey: 'STRIPE_PRICE_PIXIE_ANGEL', xpBonus: 200,
  },
  {
    id: 'pixie_devil', category: 'pixie',
    name: 'Pixie Devil', description: "Mischievous horns and tail. Choose chaos — or at least look cool doing it.",
    emoji: '😈', rarity: 'rare', priceCents: 399, priceDisplay: '€3.99',
    envKey: 'STRIPE_PRICE_PIXIE_DEVIL', xpBonus: 200,
  },
  {
    id: 'pixie_nova', category: 'pixie',
    name: 'Pixie Nova', description: 'Legendary supernova explosion form. The rarest Pixie skin in existence.',
    emoji: '💥', rarity: 'legendary', priceCents: 499, priceDisplay: '€4.99',
    envKey: 'STRIPE_PRICE_PIXIE_NOVA', xpBonus: 500,
  },

  // ── Frames ───────────────────────────────────────────────────────────────
  {
    id: 'frame_gold', category: 'frame',
    name: 'Gold Frame', description: 'A shimmering golden border on your profile card.',
    emoji: '🏅', rarity: 'rare', priceCents: 199, priceDisplay: '€1.99',
    envKey: 'STRIPE_PRICE_FRAME_GOLD', xpBonus: 100,
    cssClass: 'ring-2 ring-yellow-500/60 shadow-yellow-500/20',
  },
  {
    id: 'frame_rainbow', category: 'frame',
    name: 'Rainbow Frame', description: 'Prismatic rainbow border that cycles through all colors.',
    emoji: '🌈', rarity: 'epic', priceCents: 299, priceDisplay: '€2.99',
    envKey: 'STRIPE_PRICE_FRAME_RAINBOW', xpBonus: 200,
    cssClass: 'ring-2 ring-fuchsia-500/60 shadow-fuchsia-500/20',
  },
  {
    id: 'frame_pulse', category: 'frame',
    name: 'Pulse Frame', description: 'Animated pulsing neon glow frame.',
    emoji: '📡', rarity: 'epic', priceCents: 399, priceDisplay: '€3.99',
    envKey: 'STRIPE_PRICE_FRAME_PULSE', xpBonus: 250,
    cssClass: 'ring-2 ring-cyan-400/70 shadow-cyan-400/30 animate-pulse',
  },
  {
    id: 'frame_holo', category: 'frame',
    name: 'Holo Frame', description: 'Holographic iridescent frame — shifts color with the light.',
    emoji: '🔮', rarity: 'legendary', priceCents: 399, priceDisplay: '€3.99',
    envKey: 'STRIPE_PRICE_FRAME_HOLO', xpBonus: 350,
    cssClass: 'ring-2 ring-violet-500/70 shadow-violet-500/40',
  },

  // ── Glows ────────────────────────────────────────────────────────────────
  {
    id: 'glow_fire', category: 'glow',
    name: 'Fire Glow', description: 'Fiery orange-red aura that blazes behind your profile.',
    emoji: '🔥', rarity: 'rare', priceCents: 199, priceDisplay: '€1.99',
    envKey: 'STRIPE_PRICE_GLOW_FIRE', xpBonus: 100,
    cssClass: 'shadow-lg shadow-orange-500/40',
  },
  {
    id: 'glow_frost', category: 'glow',
    name: 'Frost Glow', description: 'Icy blue frost aura — cool and crystalline.',
    emoji: '❄️', rarity: 'rare', priceCents: 199, priceDisplay: '€1.99',
    envKey: 'STRIPE_PRICE_GLOW_FROST', xpBonus: 100,
    cssClass: 'shadow-lg shadow-sky-400/40',
  },
  {
    id: 'glow_aurora', category: 'glow',
    name: 'Aurora Glow', description: 'Northern lights aurora effect — green and violet shimmer.',
    emoji: '🌌', rarity: 'epic', priceCents: 199, priceDisplay: '€1.99',
    envKey: 'STRIPE_PRICE_GLOW_AURORA', xpBonus: 150,
    cssClass: 'shadow-lg shadow-emerald-400/40',
  },

  // ── Bundles ──────────────────────────────────────────────────────────────
  {
    id: 'name_color_bundle', category: 'name_color',
    name: 'Name Color Bundle', description: 'Unlock all name color options — make your display name stand out.',
    emoji: '🎨', rarity: 'legendary', priceCents: 499, priceDisplay: '€4.99',
    envKey: 'STRIPE_PRICE_NAME_COLOR_BUNDLE', xpBonus: 300,
    colorClass: 'text-gradient',
  },
]

export const COSMETIC_MAP: Record<CosmeticItemId, CosmeticItem> = Object.fromEntries(
  COSMETIC_ITEMS.map(i => [i.id, i])
) as Record<CosmeticItemId, CosmeticItem>

export const COSMETICS_BY_CATEGORY = COSMETIC_ITEMS.reduce<Record<CosmeticCategory, CosmeticItem[]>>(
  (acc, item) => {
    acc[item.category] = acc[item.category] ?? []
    acc[item.category].push(item)
    return acc
  },
  {} as Record<CosmeticCategory, CosmeticItem[]>
)

// Rarity styles are now defined once in lib/rarity.ts
export { RARITY_STYLES, RARITY_GLOW } from '@/lib/rarity'

export type NameColorGroup = 'basic' | 'premium'

export const NAME_COLORS: { label: string; class: string; value: string; group: NameColorGroup }[] = [
  // ── Basic group ────────────────────────────────────────────────────────
  { label: 'White',    class: 'text-white',       value: 'white',    group: 'basic'   },
  { label: 'Blue',     class: 'text-blue-400',    value: 'blue',     group: 'basic'   },
  { label: 'Purple',   class: 'text-purple-400',  value: 'purple',   group: 'basic'   },
  { label: 'Green',    class: 'text-emerald-400', value: 'green',    group: 'basic'   },
  { label: 'Pink',     class: 'text-pink-400',    value: 'pink',     group: 'basic'   },
  { label: 'Red',      class: 'text-red-400',     value: 'red',      group: 'basic'   },
  { label: 'Gradient', class: 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent', value: 'gradient', group: 'basic' },

  // ── Premium group ──────────────────────────────────────────────────────
  // Match the className verbatim with lib/cosmetics.ts NAME_COLORS so the
  // picker preview swatch and the rendered display name look identical.
  { label: 'Gold',      class: 'bg-gradient-to-r from-yellow-200 via-amber-400 to-orange-500 bg-clip-text text-transparent', value: 'gold',      group: 'premium' },
  { label: 'Steel',     class: 'bg-gradient-to-r from-slate-300 via-zinc-200 to-slate-400 bg-clip-text text-transparent',    value: 'steel',     group: 'premium' },
  { label: 'Silver',    class: 'bg-gradient-to-r from-gray-300 via-white to-gray-400 bg-clip-text text-transparent',          value: 'silver',    group: 'premium' },
  { label: 'Platinum',  class: 'bg-gradient-to-r from-slate-200 via-blue-50 to-slate-300 bg-clip-text text-transparent',       value: 'platinum',  group: 'premium' },
  { label: 'Diamond',   class: 'bg-gradient-to-r from-cyan-200 via-pink-200 to-purple-300 bg-clip-text text-transparent',     value: 'diamond',   group: 'premium' },
  { label: 'Rose Gold', class: 'bg-gradient-to-r from-pink-300 via-amber-200 to-pink-400 bg-clip-text text-transparent',      value: 'rose_gold', group: 'premium' },
]

export function isCosmeticItemId(s: string): s is CosmeticItemId {
  return s in COSMETIC_MAP
}

/** Keep backward-compat: pixie-store exports redirected here */
export type { CosmeticItemId as PixieItemId }
export const PIXIE_ITEMS = COSMETICS_BY_CATEGORY.pixie ?? []
export const PIXIE_ITEM_MAP: Record<string, CosmeticItem> = Object.fromEntries(
  PIXIE_ITEMS.map(i => [i.id, i])
)
export const isPixieItemId = (s: string) => PIXIE_ITEMS.some(i => i.id === s)

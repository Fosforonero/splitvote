// ── Rarity presentation tokens ───────────────────────────────────────────────
// Single source of truth for rarity colors/styles across the app:
// badges, cosmetics, pixie skins, companion species — they all share these.

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary'

export const RARITY_STYLES: Record<string, string> = {
  common:    'border-slate-500/40 bg-slate-500/10 text-slate-300',
  rare:      'border-blue-500/40  bg-blue-500/10  text-blue-300',
  epic:      'border-purple-500/40 bg-purple-500/10 text-purple-300',
  legendary: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-300',
}

export const RARITY_GLOW: Record<string, string> = {
  common:    'hover:shadow-slate-500/10',
  rare:      'hover:shadow-blue-500/20',
  epic:      'hover:shadow-purple-500/30',
  legendary: 'hover:shadow-yellow-500/40',
}

/** Sort order — legendary first, common last. Useful for trophy cases. */
export const RARITY_ORDER: Record<string, number> = {
  legendary: 0,
  epic:      1,
  rare:      2,
  common:    3,
}

/**
 * Background gradient applied to rarity-tiered chips (badges, frame previews).
 * common is a flat tint; rare/epic/legendary get richer, multi-stop gradients
 * so that paying for an epic badge is visually distinguishable from a common.
 */
export const RARITY_GRADIENT_BG: Record<Rarity, string> = {
  common:    'bg-slate-500/10',
  rare:      'bg-gradient-to-br from-blue-500/15 to-blue-700/10',
  epic:      'bg-gradient-to-br from-purple-500/20 to-fuchsia-700/15',
  legendary: 'bg-gradient-to-br from-yellow-400/20 via-amber-500/15 to-orange-500/20',
}

/**
 * Always-on shadow (not hover-only). RARITY_GLOW above is hover-only; this
 * one renders the glow at rest so that rare+ badges always look special.
 * common is intentionally empty so common badges stay quiet.
 */
export const RARITY_GLOW_SHADOW: Record<Rarity, string> = {
  common:    '',
  rare:      'shadow-blue-500/30 shadow-md',
  epic:      'shadow-purple-500/40 shadow-lg',
  legendary: 'shadow-amber-500/50 shadow-xl',
}

/**
 * Animation / interaction class layered on top of the chip. Epic gets a
 * hover scale; legendary gets a slow pulse so they stand out on long lists.
 */
export const RARITY_ANIMATION: Record<Rarity, string> = {
  common:    '',
  rare:      '',
  epic:      'hover:scale-110 transition-transform',
  legendary: 'animate-pulse',
}

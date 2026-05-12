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

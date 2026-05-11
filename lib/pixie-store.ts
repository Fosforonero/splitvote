// ── Pixie Store — backward-compat re-exports from cosmetics-store ────────────
// All new code should import from @/lib/cosmetics-store directly.

export {
  PIXIE_ITEMS,
  PIXIE_ITEM_MAP,
  RARITY_STYLES,
  RARITY_GLOW,
  isPixieItemId,
  isCosmeticItemId,
} from '@/lib/cosmetics-store'

export type { CosmeticItemId as PixieItemId } from '@/lib/cosmetics-store'

import { describe, it, expect } from 'vitest'
import {
  RARITY_STYLES,
  RARITY_GLOW,
  RARITY_GRADIENT_BG,
  RARITY_GLOW_SHADOW,
  RARITY_ANIMATION,
  type Rarity,
} from '@/lib/rarity'

const ALL_RARITIES: Rarity[] = ['common', 'rare', 'epic', 'legendary']

describe('rarity lookup tables', () => {
  it('every rarity has an entry in every lookup table', () => {
    for (const r of ALL_RARITIES) {
      expect(RARITY_STYLES[r], `RARITY_STYLES missing ${r}`).toBeTruthy()
      expect(RARITY_GLOW[r], `RARITY_GLOW missing ${r}`).toBeTruthy()
      expect(RARITY_GRADIENT_BG[r], `RARITY_GRADIENT_BG missing ${r}`).toBeDefined()
      expect(RARITY_GLOW_SHADOW[r], `RARITY_GLOW_SHADOW missing ${r}`).toBeDefined()
      expect(RARITY_ANIMATION[r], `RARITY_ANIMATION missing ${r}`).toBeDefined()
    }
  })

  it('common rarity has empty string for shadow + animation (no visual treatment)', () => {
    expect(RARITY_GLOW_SHADOW.common).toBe('')
    expect(RARITY_ANIMATION.common).toBe('')
  })

  it('legendary rarity has an animation class', () => {
    expect(RARITY_ANIMATION.legendary.length).toBeGreaterThan(0)
  })

  it('animations are gated by motion-safe: so reduced-motion users opt out', () => {
    // Any animation/hover-scale we ship MUST be motion-safe-prefixed,
    // otherwise users with prefers-reduced-motion still see it.
    for (const r of ALL_RARITIES) {
      const anim = RARITY_ANIMATION[r]
      if (anim === '') continue
      expect(anim, `RARITY_ANIMATION.${r} must use motion-safe: prefix`).toMatch(/motion-safe:/)
    }
  })
})

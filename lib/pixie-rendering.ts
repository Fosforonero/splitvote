/**
 * lib/pixie-rendering.ts — per-species visual metrics for <PixieSprite>.
 *
 * The PNGs under `public/pixie/` are inconsistent: most ship a baked-in
 * dark background (~#090914) and the character footprint varies wildly
 * (galaxy ≈ 10% of canvas, hologram ≈ 42%). A single global CSS scale
 * therefore can't make every species feel the same visual size.
 *
 * The `SPECIES_SCALE` map below is data-driven from
 * `scripts/audit-pixie-assets.mjs` — it targets ~55% character footprint
 * after scale. Update by re-running the audit, copying the "Suggested
 * scale" column from the report, and tuning by eye if needed.
 *
 * `BAKED_BG` is the canonical background colour the PNGs ship with. Use
 * it on parent containers so the baked square blends into the frame.
 */

import type { CompanionSpecies } from './companion'

/** Frame background that matches the baked-in PNG square. Apply via
 *  Tailwind arbitrary value (`bg-[var(--pixie-bg)]`) or inline style. */
export const PIXIE_BAKED_BG = '#0a0a14'

/** Fallback for species not explicitly listed below. */
export const DEFAULT_PIXIE_SCALE = 1.5

/**
 * Per-species scale multiplier applied as `transform: scale(N)` on the
 * sprite image. Numbers come from the bbox audit (luma-based, treats the
 * baked dark background as bg). Higher number = character was smaller on
 * canvas, needs more boost.
 *
 * Last updated: 2026-05-18 from reports/pixie-assets-audit-2026-05-18.md
 */
export const SPECIES_SCALE: Partial<Record<CompanionSpecies, number>> = {
  // Tiny subjects (median bbox < 16%)
  galaxy:    2.30,
  diamond:   2.20,
  crown:     2.16,
  heart:     1.90,
  void:      1.90,
  shade:     1.85,
  overseer:  1.80,

  // Medium-small (16-25%)
  robot:     1.70,
  spark:     1.65,
  momo:      1.65,
  blip:      1.60,

  // Medium (25-32%)
  voidcore:  1.45,
  caffe:     1.40,
  scintille: 1.40,  // displayed as "Pixie Nova"
  devil:     1.35,
  fuoco:     1.35,
  triste:    1.35,
  banana:    1.30,
  angel:     1.30,

  // Large subjects (>35% — need a slight nudge, not a boost)
  leaf:      1.20,
  ice:       1.20,
  moonlight: 1.15,
  hologram:  1.15,
  orbit:     1.10,
}

/** Lookup the scale for a species, falling back to DEFAULT_PIXIE_SCALE. */
export function getSpeciesScale(species: CompanionSpecies | string): number {
  return SPECIES_SCALE[species as CompanionSpecies] ?? DEFAULT_PIXIE_SCALE
}

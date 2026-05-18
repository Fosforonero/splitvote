'use client'

/**
 * components/PixieSprite.tsx
 *
 * Single source of truth for rendering a Pixie species sprite.
 *
 * The PNGs under `public/pixie/` are inconsistent — every species
 * has its own character footprint (galaxy ≈ 10% of canvas, hologram
 * ≈ 42%) and most ship a baked-in dark background. Rendering them
 * with a single global scale produces wildly uneven results.
 *
 * This component applies a per-species scale from `lib/pixie-rendering`
 * (data-driven from `scripts/audit-pixie-assets.mjs`) so every species
 * lands at roughly the same visual footprint without re-encoding the
 * PNGs. The wrapper uses `overflow-hidden` + `bg-[var(--pixie-baked)]`
 * so the baked square blends into the frame even when scaled past the
 * edges.
 *
 * On image-load failure it gracefully falls back to the per-stage emoji
 * — isolates one broken sprite from blanking an entire grid.
 *
 * Use this everywhere a Pixie sprite is rendered. Direct <Image src=
 * "/pixie/..."> calls should migrate to this component.
 */

import { useState } from 'react'
import Image from 'next/image'
import { getPixieImagePath, normaliseSpecies } from '@/lib/pixie'
import { getSpeciesScale, PIXIE_BAKED_BG } from '@/lib/pixie-rendering'
import type { CompanionSpecies } from '@/lib/companion'

interface PixieSpriteProps {
  /** Species id or product-derived species (nova→scintille auto). */
  species: CompanionSpecies | string
  /** Stage 1-6. */
  stage: number
  /** Decorative by default. Pass a real alt for SR-visible context. */
  alt?: string
  /** Per-stage emoji shown if the image fails to load. */
  fallbackEmoji?: string
  /** Extra classes on the wrapper (e.g. size: 'w-24 h-24'). */
  className?: string
  /** Override the per-species scale (rare — usually let the lib decide). */
  scale?: number
  /** Pixel hint for next/image — bigger = sharper for retina, but heavier. */
  pixelSize?: number
  /** LCP hint. */
  priority?: boolean
  /** Apply grayscale + reduced opacity (locked tiles). */
  dimmed?: boolean
  /** Show the baked-bg square. Set false when the parent already supplies
   *  a coloured frame (e.g. rarity-coloured tile background). Default true. */
  showFrame?: boolean
}

export default function PixieSprite({
  species,
  stage,
  alt = '',
  fallbackEmoji = '✨',
  className = '',
  scale,
  pixelSize = 256,
  priority = false,
  dimmed = false,
  showFrame = true,
}: PixieSpriteProps) {
  const [imgFailed, setImgFailed] = useState(false)
  const canonical = normaliseSpecies(species)
  const scaleValue = scale ?? getSpeciesScale(canonical)

  const frameStyle = showFrame ? { backgroundColor: PIXIE_BAKED_BG } : undefined

  return (
    <div
      className={`relative overflow-hidden flex items-center justify-center ${dimmed ? 'grayscale opacity-40' : ''} ${className}`.trim()}
      style={frameStyle}
    >
      {!imgFailed ? (
        <Image
          src={getPixieImagePath(canonical, stage)}
          alt={alt}
          width={pixelSize}
          height={pixelSize}
          className="w-full h-full object-contain"
          style={{ transform: `scale(${scaleValue})`, transformOrigin: 'center' }}
          draggable={false}
          priority={priority}
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span className="text-3xl" aria-hidden="true">{fallbackEmoji}</span>
      )}
    </div>
  )
}

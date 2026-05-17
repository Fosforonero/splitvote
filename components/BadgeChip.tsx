/**
 * BadgeChip — rarity-aware chip used for badges (and any cosmetic that
 * carries a rarity tier). Pure presentational, no client hooks.
 *
 * The visual class composition is driven entirely by lookup tables in
 * lib/rarity.ts so that badges across the app stay consistent. To change
 * how an epic badge looks, edit lib/rarity.ts — not this component.
 */

import {
  RARITY_STYLES,
  RARITY_GRADIENT_BG,
  RARITY_GLOW_SHADOW,
  RARITY_ANIMATION,
  type Rarity,
} from '@/lib/rarity'

type Size = 'sm' | 'md' | 'lg'

interface Props {
  emoji: string
  rarity: Rarity
  /** Accessible label and tooltip. Required for screen readers. */
  title: string
  size?: Size
  className?: string
}

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'text-base px-2 py-0.5',
  md: 'text-xl px-2.5 py-1',
  lg: 'text-3xl px-3 py-2',
}

export default function BadgeChip({
  emoji,
  rarity,
  title,
  size = 'md',
  className = '',
}: Props) {
  return (
    <span
      title={title}
      aria-label={title}
      role="img"
      className={`
        inline-flex items-center justify-center rounded-xl border
        ${SIZE_CLASSES[size]}
        ${RARITY_STYLES[rarity]}
        ${RARITY_GRADIENT_BG[rarity]}
        ${RARITY_GLOW_SHADOW[rarity]}
        ${RARITY_ANIMATION[rarity]}
        ${className}
      `.replace(/\s+/g, ' ').trim()}
    >
      {emoji}
    </span>
  )
}

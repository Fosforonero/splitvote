import Image from 'next/image'

/**
 * CosmeticAvatar — renders an avatar (emoji or Pixie illustration) wrapped in
 * an optional cosmetic frame.
 *
 * Pure presentational component. Reads no DB — receives the frame def from
 * the parent (use lib/cosmetics.ts → getEquippedCosmetics() to resolve it).
 *
 * When `pixieSrc` is provided the Pixie illustration is shown instead of the
 * emoji. The frame (if any) is applied on top of either mode.
 *
 * Sizing: pass one of the named sizes (sm/md/lg/xl) for consistency, or
 * provide custom Tailwind classes via `className` (e.g. for the hero).
 */

import type { FrameDef } from '@/lib/cosmetics'

type Size = 'sm' | 'md' | 'lg' | 'xl'

interface Props {
  /** Avatar emoji to render in the center when no pixieSrc. Defaults to 🌍. */
  emoji?: string | null
  /**
   * URL of the Pixie illustration to use as the profile picture.
   * When set the emoji is hidden and the image fills the avatar circle.
   */
  pixieSrc?: string | null
  /** Equipped frame def, or null if no frame. */
  frame: FrameDef | null
  size?: Size
  /** Background color for the inner disc. Defaults to var(--bg). */
  innerBg?: string
  /** Extra classes on the outer wrapper. */
  className?: string
  ariaLabel?: string
  /**
   * Prioritise the underlying next/image (LCP hint). Pass true for the
   * above-the-fold hero avatar; leave false on list/feed surfaces so the
   * image stays lazy-loaded.
   */
  priority?: boolean
}

const SIZE_MAP: Record<Size, { outer: string; inner: string; emoji: string }> = {
  sm: { outer: 'w-8 h-8',   inner: 'w-7 h-7',   emoji: 'text-base' },
  md: { outer: 'w-12 h-12', inner: 'w-10 h-10', emoji: 'text-xl'   },
  lg: { outer: 'w-16 h-16', inner: 'w-14 h-14', emoji: 'text-3xl'  },
  xl: { outer: 'w-24 h-24', inner: 'w-[5.25rem] h-[5.25rem]', emoji: 'text-5xl' },
}

/** Inner content: Pixie image or emoji. */
function AvatarContent({
  pixieSrc,
  emoji,
  emojiClass,
  ariaLabel,
  priority,
}: {
  pixieSrc?: string | null
  emoji?: string | null
  emojiClass: string
  ariaLabel?: string
  priority?: boolean
}) {
  if (pixieSrc) {
    // Inset the image slightly (~92%) so the Pixie head/body doesn't get
    // clipped by the rounded-2xl mask of the parent disc. Many Pixie sprites
    // have asymmetric extents (wings, hats, tails) — object-contain centers
    // them, and the small inset prevents corners from being cut off.
    return (
      <Image
        src={pixieSrc}
        alt={ariaLabel ?? 'Pixie avatar'}
        width={256}
        height={256}
        className="object-contain"
        style={{ width: '92%', height: '92%' }}
        draggable={false}
        priority={priority}
      />
    )
  }
  return (
    <span className={emojiClass} aria-hidden={ariaLabel ? 'true' : undefined}>
      {emoji ?? '🌍'}
    </span>
  )
}

export default function CosmeticAvatar({
  emoji = '🌍',
  pixieSrc,
  frame,
  size = 'md',
  innerBg = 'bg-[#0d0d1a]',
  className = '',
  ariaLabel,
  priority,
}: Props) {
  const sizing = SIZE_MAP[size]

  // No frame → simple round avatar
  if (!frame) {
    return (
      <div
        className={`${sizing.outer} rounded-2xl ${innerBg} border border-white/10 flex items-center justify-center overflow-hidden ${className}`}
        role={ariaLabel ? 'img' : undefined}
        aria-label={ariaLabel}
      >
        <AvatarContent
          pixieSrc={pixieSrc}
          emoji={emoji}
          emojiClass={sizing.emoji}
          ariaLabel={ariaLabel}
          priority={priority}
        />
      </div>
    )
  }

  // Framed: outer gradient ring + inner disc
  return (
    <div
      className={`${sizing.outer} ${frame.ringClass} flex items-center justify-center ${className}`}
      style={frame.style}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
    >
      <div className={`${sizing.inner} rounded-2xl ${innerBg} flex items-center justify-center overflow-hidden`}>
        <AvatarContent
          pixieSrc={pixieSrc}
          emoji={emoji}
          emojiClass={sizing.emoji}
          ariaLabel={ariaLabel}
          priority={priority}
        />
      </div>
    </div>
  )
}

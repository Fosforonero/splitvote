/**
 * lib/cosmetics.ts — visual rendering catalog for cosmetic items.
 *
 * The product *catalog* (price, Stripe IDs, display name) lives in
 * lib/purchases.ts. This file is the *visual* catalog: which CSS classes
 * render each frame/glow, which name colors are unlockable via the bundle,
 * and helpers to read a profile's equipped state safely.
 *
 * Keep the two files in sync: every cosmetic productId in PRODUCT_CATALOG
 * should have an entry here.
 */

import type { ProductId } from './purchases'

// ── Frames ────────────────────────────────────────────────────────────
// Each frame is rendered as a thin ring around the avatar. The classes
// are applied to the outer wrapper; the inner avatar sits on a #0d0d1a
// background to create the ring effect.
//
// All frames are 3px thick to stay consistent. Animated ones use the
// "frame-*" keyframes defined in app/globals.css.

export type FrameId = Extract<ProductId, 'frame_gold' | 'frame_rainbow' | 'frame_pulse' | 'frame_holo'>

export interface FrameDef {
  id: FrameId
  /** Tailwind class applied to the outer ring wrapper (rounded-full + padding included). */
  ringClass: string
  /** Optional inline style for animations Tailwind can't express. */
  style?: React.CSSProperties
}

// All frames use `rounded-2xl` (square with soft corners) to match the
// existing CompanionDisplay avatar style. Round frames (`rounded-full`)
// were misaligned with the rest of the app — the Pixie sprite art is
// authored on a square canvas and clips awkwardly when forced circular.
export const FRAMES: Record<FrameId, FrameDef> = {
  frame_gold: {
    id: 'frame_gold',
    ringClass: 'p-[3px] rounded-2xl bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500',
  },
  frame_rainbow: {
    id: 'frame_rainbow',
    ringClass: 'p-[3px] rounded-2xl bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 animate-[frame-rainbow_4s_linear_infinite] bg-[length:200%_200%]',
  },
  frame_pulse: {
    id: 'frame_pulse',
    ringClass: 'p-[3px] rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 animate-pulse shadow-[0_0_18px_rgba(168,85,247,0.5)]',
  },
  frame_holo: {
    id: 'frame_holo',
    ringClass: 'p-[3px] rounded-2xl bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-violet-400 animate-[frame-holo_3s_ease-in-out_infinite] bg-[length:200%_100%]',
  },
}

export function isFrameId(value: string | null | undefined): value is FrameId {
  return !!value && value in FRAMES
}

// ── Glows ─────────────────────────────────────────────────────────────
// Applied as `style.textShadow` on the display name span.
// Three layered shadows give depth without being garish on dark UI.

export type GlowId = Extract<ProductId, 'glow_fire' | 'glow_frost' | 'glow_aurora'>

export interface GlowDef {
  id: GlowId
  /** Inline style applied to the text element. */
  style: React.CSSProperties
}

export const GLOWS: Record<GlowId, GlowDef> = {
  glow_fire: {
    id: 'glow_fire',
    style: { textShadow: '0 0 4px rgba(251,113,71,0.9), 0 0 12px rgba(251,113,71,0.55), 0 0 22px rgba(239,68,68,0.35)' },
  },
  glow_frost: {
    id: 'glow_frost',
    style: { textShadow: '0 0 4px rgba(34,211,238,0.9), 0 0 12px rgba(34,211,238,0.55), 0 0 22px rgba(59,130,246,0.35)' },
  },
  glow_aurora: {
    id: 'glow_aurora',
    style: { textShadow: '0 0 4px rgba(168,85,247,0.9), 0 0 12px rgba(190,255,213,0.55), 0 0 22px rgba(56,189,248,0.35)' },
  },
}

export function isGlowId(value: string | null | undefined): value is GlowId {
  return !!value && value in GLOWS
}

// ── Name colors ───────────────────────────────────────────────────────
// Unlocked as a single bundle (`name_color_bundle`). The user then picks
// one of 8 slugs from PixieSelector. Stored as profiles.name_color (TEXT).
//
// The slug set MUST stay aligned with NAME_COLORS in lib/cosmetics-store.ts
// (the picker UI source). The picker writes `value` from that array straight
// into profiles.name_color, and getEquippedCosmetics() below validates the
// stored slug against the keys here. A mismatch silently drops the cosmetic
// — see tests/unit/cosmetics-catalog.test.ts.

export type NameColorSlug =
  | 'white'    | 'blue'    | 'purple' | 'green'
  | 'pink'     | 'red'     | 'gradient'
  | 'gold'     | 'steel'   | 'silver' | 'platinum'
  | 'diamond'  | 'rose_gold'

export interface NameColorDef {
  slug: NameColorSlug
  /** Tailwind class. Gradient slugs use bg-clip-text. */
  className: string
  /** Human-readable label (EN). IT is derived in UI. */
  label: string
}

export const NAME_COLORS: Record<NameColorSlug, NameColorDef> = {
  // ── Basic colors (flat Tailwind) ───────────────────────────────────────
  white:    { slug: 'white',    className: 'text-white',       label: 'White' },
  blue:     { slug: 'blue',     className: 'text-blue-400',    label: 'Blue' },
  purple:   { slug: 'purple',   className: 'text-purple-400',  label: 'Purple' },
  green:    { slug: 'green',    className: 'text-emerald-400', label: 'Green' },
  pink:     { slug: 'pink',     className: 'text-pink-400',    label: 'Pink' },
  red:      { slug: 'red',      className: 'text-red-400',     label: 'Red' },
  gradient: { slug: 'gradient', className: 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent', label: 'Gradient' },

  // ── Premium colors (metallic / gemstone gradients) ─────────────────────
  // gold upgraded from text-yellow-400 (solid) to a 3-stop metallic gradient.
  // Existing users with name_color='gold' see the upgrade automatically.
  gold:      { slug: 'gold',      className: 'bg-gradient-to-r from-yellow-200 via-amber-400 to-orange-500 bg-clip-text text-transparent', label: 'Gold' },
  steel:     { slug: 'steel',     className: 'bg-gradient-to-r from-slate-300 via-zinc-200 to-slate-400 bg-clip-text text-transparent',    label: 'Steel' },
  silver:    { slug: 'silver',    className: 'bg-gradient-to-r from-gray-300 via-white to-gray-400 bg-clip-text text-transparent',          label: 'Silver' },
  platinum:  { slug: 'platinum',  className: 'bg-gradient-to-r from-slate-200 via-blue-50 to-slate-300 bg-clip-text text-transparent',       label: 'Platinum' },
  diamond:   { slug: 'diamond',   className: 'bg-gradient-to-r from-cyan-200 via-pink-200 to-purple-300 bg-clip-text text-transparent',     label: 'Diamond' },
  rose_gold: { slug: 'rose_gold', className: 'bg-gradient-to-r from-pink-300 via-amber-200 to-pink-400 bg-clip-text text-transparent',      label: 'Rose Gold' },
}

export function isNameColorSlug(value: string | null | undefined): value is NameColorSlug {
  return !!value && value in NAME_COLORS
}

export const NAME_COLOR_SLUGS = Object.keys(NAME_COLORS) as NameColorSlug[]

// ── Equipped helpers ──────────────────────────────────────────────────
// These read the validated columns off a profile row and return the
// renderer-friendly object (or null if nothing equipped / value invalid).

export interface EquippedCosmetics {
  frame: FrameDef | null
  glow:  GlowDef  | null
  nameColor: NameColorDef | null
}

export function getEquippedCosmetics(profile: {
  equipped_frame?: string | null
  equipped_glow?:  string | null
  name_color?:     string | null
} | null | undefined): EquippedCosmetics {
  return {
    frame:     isFrameId(profile?.equipped_frame)  ? FRAMES[profile!.equipped_frame as FrameId]   : null,
    glow:      isGlowId(profile?.equipped_glow)    ? GLOWS[profile!.equipped_glow as GlowId]      : null,
    nameColor: isNameColorSlug(profile?.name_color) ? NAME_COLORS[profile!.name_color as NameColorSlug] : null,
  }
}

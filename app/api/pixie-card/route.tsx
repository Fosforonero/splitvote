/**
 * GET /api/pixie-card
 *
 * OG share card for a user's Pixie companion. Renders an SVG (1200×630)
 * showing the Pixie illustration + name + stage + cosmetics (frame,
 * name color gradient) + Premium VIP badge.
 *
 * Query params:
 *   species  — CompanionSpecies slug (default 'spark')
 *   stage    — 1..6 (default 1)
 *   name     — display name (truncated to 22 chars)
 *   frame    — frame_gold | frame_rainbow | frame_pulse | frame_holo (optional)
 *   color    — name color slug (aurora/fire/frost/gold/rose/mint/violet/sky)
 *   premium  — '1' to show the VIP star badge
 *   locale   — 'en' (default) or 'it'
 *
 * The image is also used as the OG preview when sharing /u/[id] on social.
 * Stable: returns 200 for unknown values (falls back to safe defaults) so
 * social crawlers never see a 4xx and skip the preview.
 */
import { NextRequest } from 'next/server'

export const runtime = 'edge'

// ── 24-species catalog ──────────────────────────────────────────────────
// Kept inline so the edge runtime doesn't pull in @/lib/companion (which
// imports React-specific cosmetics types). Must stay in sync with COMPANIONS.

type Species =
  | 'spark' | 'blip' | 'momo' | 'shade' | 'banana' | 'leaf' | 'orbit' | 'ice'
  | 'heart' | 'robot' | 'fuoco' | 'caffe' | 'hologram' | 'moonlight' | 'triste'
  | 'crown' | 'diamond' | 'galaxy' | 'angel' | 'devil' | 'scintille'
  | 'overseer' | 'void' | 'voidcore'

const VALID_SPECIES: Species[] = [
  'spark', 'blip', 'momo', 'shade', 'banana', 'leaf', 'orbit', 'ice',
  'heart', 'robot', 'fuoco', 'caffe', 'hologram', 'moonlight', 'triste',
  'crown', 'diamond', 'galaxy', 'angel', 'devil', 'scintille',
  'overseer', 'void', 'voidcore',
]

const SPECIES_ACCENT: Record<Species, string> = {
  spark: '#fbbf24', blip: '#a78bfa', momo: '#34d399', shade: '#60a5fa',
  banana: '#fde047', leaf: '#34d399', orbit: '#fb923c', ice: '#7dd3fc',
  heart: '#f472b6', robot: '#94a3b8', fuoco: '#fb7185', caffe: '#a16207',
  hologram: '#c084fc', moonlight: '#818cf8', triste: '#64748b',
  crown: '#fbbf24', diamond: '#67e8f9', galaxy: '#c084fc',
  angel: '#fef3c7', devil: '#dc2626', scintille: '#fde047',
  overseer: '#dc2626', void: '#1e293b', voidcore: '#7c3aed',
}

const SPECIES_NAMES: Record<Species, string> = {
  spark: 'Pixie Spark', blip: 'Pixie Glitch', momo: 'Pixie Momo',
  shade: 'Pixie Shade', banana: 'Pixie Banana', leaf: 'Pixie Leaf',
  orbit: 'Pixie Orbit', ice: 'Pixie Ice',
  heart: 'Pixie Heart', robot: 'Pixie Bot', fuoco: 'Pixie Ember',
  caffe: 'Pixie Brew', hologram: 'Pixie Aura', moonlight: 'Pixie Luna',
  triste: 'Pixie Gloom',
  crown: 'Pixie Crown', diamond: 'Pixie Diamond', galaxy: 'Pixie Galaxy',
  angel: 'Pixie Angel', devil: 'Pixie Devil', scintille: 'Pixie Nova',
  overseer: 'Pixie Overseer', void: 'Pixie Void', voidcore: 'Pixie Voidcore',
}

const RARITY: Record<Species, 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'> = {
  spark: 'COMMON', blip: 'COMMON', momo: 'RARE', shade: 'EPIC',
  banana: 'RARE', leaf: 'EPIC', orbit: 'LEGENDARY', ice: 'EPIC',
  heart: 'EPIC', robot: 'EPIC', fuoco: 'EPIC', caffe: 'RARE',
  hologram: 'RARE', moonlight: 'RARE', triste: 'EPIC',
  crown: 'LEGENDARY', diamond: 'LEGENDARY', galaxy: 'LEGENDARY',
  angel: 'LEGENDARY', devil: 'LEGENDARY', scintille: 'LEGENDARY',
  overseer: 'LEGENDARY', void: 'LEGENDARY', voidcore: 'LEGENDARY',
}

const RARITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  COMMON:    { bg: '#1e2a3a', text: '#94a3b8', border: '#334155' },
  RARE:      { bg: '#1e3a5f', text: '#93c5fd', border: '#1d4ed8' },
  EPIC:      { bg: '#2e1065', text: '#c4b5fd', border: '#7c3aed' },
  LEGENDARY: { bg: '#451a03', text: '#fbbf24', border: '#d97706' },
}

const STAGE_LABELS_EN: Record<number, string> = {
  1: 'Hatchling', 2: 'Fledgling', 3: 'Explorer',
  4: 'Champion',  5: 'Legendary', 6: 'Ultra Legendary',
}
const STAGE_LABELS_IT: Record<number, string> = {
  1: 'Cucciolo', 2: 'Apprendista', 3: 'Esploratore',
  4: 'Campione', 5: 'Leggendario', 6: 'Ultra Leggendario',
}

// ── Frames — gradient stroke definitions ────────────────────────────────
type FrameId = 'frame_gold' | 'frame_rainbow' | 'frame_pulse' | 'frame_holo'
const VALID_FRAMES: FrameId[] = ['frame_gold', 'frame_rainbow', 'frame_pulse', 'frame_holo']

interface FrameStops { stops: { offset: string; color: string }[]; strokeWidth: number }

const FRAME_DEFS: Record<FrameId, FrameStops> = {
  frame_gold: {
    stops: [
      { offset: '0%',  color: '#fde047' },
      { offset: '50%', color: '#f59e0b' },
      { offset: '100%', color: '#ea580c' },
    ],
    strokeWidth: 10,
  },
  frame_rainbow: {
    stops: [
      { offset: '0%',   color: '#ef4444' },
      { offset: '33%',  color: '#a855f7' },
      { offset: '66%',  color: '#3b82f6' },
      { offset: '100%', color: '#10b981' },
    ],
    strokeWidth: 10,
  },
  frame_pulse: {
    stops: [
      { offset: '0%',   color: '#60a5fa' },
      { offset: '100%', color: '#a855f7' },
    ],
    strokeWidth: 12,
  },
  frame_holo: {
    stops: [
      { offset: '0%',   color: '#67e8f9' },
      { offset: '50%',  color: '#f0abfc' },
      { offset: '100%', color: '#a78bfa' },
    ],
    strokeWidth: 10,
  },
}

// ── Name colors — gradient or solid ─────────────────────────────────────
type NameColor =
  | 'aurora' | 'fire' | 'frost' | 'gold'
  | 'rose' | 'mint' | 'violet' | 'sky'
const VALID_COLORS: NameColor[] = ['aurora', 'fire', 'frost', 'gold', 'rose', 'mint', 'violet', 'sky']

interface NameColorDef {
  /** If solid: a single hex. If gradient: stops array. */
  solid?: string
  gradient?: { offset: string; color: string }[]
}

const NAME_COLOR_DEFS: Record<NameColor, NameColorDef> = {
  aurora: { gradient: [
    { offset: '0%',   color: '#c084fc' },
    { offset: '50%',  color: '#f9a8d4' },
    { offset: '100%', color: '#67e8f9' },
  ] },
  fire: { gradient: [
    { offset: '0%',   color: '#fb923c' },
    { offset: '50%',  color: '#f87171' },
    { offset: '100%', color: '#f43f5e' },
  ] },
  frost: { gradient: [
    { offset: '0%',   color: '#67e8f9' },
    { offset: '50%',  color: '#7dd3fc' },
    { offset: '100%', color: '#60a5fa' },
  ] },
  gold: { gradient: [
    { offset: '0%',   color: '#fde047' },
    { offset: '50%',  color: '#fcd34d' },
    { offset: '100%', color: '#fb923c' },
  ] },
  rose:   { solid: '#fda4af' },
  mint:   { solid: '#6ee7b7' },
  violet: { solid: '#c4b5fd' },
  sky:    { solid: '#7dd3fc' },
}

// ── Helpers ─────────────────────────────────────────────────────────────
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function getPixieImageUrl(baseUrl: string, species: Species, stage: number): string {
  // Mirrors lib/pixie.ts → getPixieImagePath but with absolute URL for the
  // <image> tag inside the SVG (social crawlers won't resolve relative URLs).
  return `${baseUrl}/pixie/${species}/pixie-${species}-stage-${stage}.png`
}

// ── Main handler ────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)

  // Use the origin from the request so this also works on preview deploys.
  // BASE_URL env override exists for cases where the public URL differs
  // (e.g. behind a CDN — but in our setup origin matches splitvote.io).
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? origin

  const rawSpecies = searchParams.get('species') ?? 'spark'
  const species: Species = VALID_SPECIES.includes(rawSpecies as Species)
    ? (rawSpecies as Species)
    : 'spark'

  const rawStage = parseInt(searchParams.get('stage') ?? '1', 10)
  const stage = (rawStage >= 1 && rawStage <= 6 ? rawStage : 1)

  const rawName = searchParams.get('name') ?? 'Anonymous'
  const name = escapeXml(rawName.slice(0, 22))

  const locale = searchParams.get('locale') ?? 'en'
  const IT = locale === 'it'

  const rawFrame = searchParams.get('frame')
  const frame: FrameId | null = rawFrame && VALID_FRAMES.includes(rawFrame as FrameId)
    ? (rawFrame as FrameId)
    : null

  const rawColor = searchParams.get('color')
  const nameColor: NameColor | null = rawColor && VALID_COLORS.includes(rawColor as NameColor)
    ? (rawColor as NameColor)
    : null

  const isPremium = searchParams.get('premium') === '1'

  // ── Resolved values ───────────────────────────────────────────────────
  const accent = SPECIES_ACCENT[species]
  const speciesName = escapeXml(SPECIES_NAMES[species])
  const stageLabel = IT ? STAGE_LABELS_IT[stage] : STAGE_LABELS_EN[stage]
  const rarity = RARITY[species]
  const rarityStyle = RARITY_COLORS[rarity]
  const pixieUrl = getPixieImageUrl(baseUrl, species, stage)

  const headline = IT
    ? `Stadio ${stage} · ${stageLabel}`
    : `Stage ${stage} · ${stageLabel}`

  const subline = IT ? `Il Pixie di ${name}` : `${name}'s Pixie`
  const cta = IT
    ? 'Scopri il tuo su splitvote.io →'
    : 'Grow yours at splitvote.io →'

  // ── Build SVG defs for frame + name color ─────────────────────────────
  const frameDef = frame ? FRAME_DEFS[frame] : null
  const colorDef = nameColor ? NAME_COLOR_DEFS[nameColor] : null

  const frameGradient = frameDef
    ? `<linearGradient id="frameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
         ${frameDef.stops.map(s => `<stop offset="${s.offset}" stop-color="${s.color}"/>`).join('')}
       </linearGradient>`
    : ''

  const colorGradient = colorDef?.gradient
    ? `<linearGradient id="nameGrad" x1="0%" y1="0%" x2="100%" y2="0%">
         ${colorDef.gradient.map(s => `<stop offset="${s.offset}" stop-color="${s.color}"/>`).join('')}
       </linearGradient>`
    : ''

  const nameFill = colorDef?.solid
    ? colorDef.solid
    : colorDef?.gradient
      ? 'url(#nameGrad)'
      : '#f1f5f9'

  // ── Pixie avatar (left panel): circle bg + image + optional frame ring ─
  // The frame ring sits as a stroked circle around the Pixie image.
  const AVATAR_CX = 278
  const AVATAR_CY = 292
  const AVATAR_R  = 152
  const IMG_SIZE  = 240

  const frameRing = frameDef
    ? `<circle cx="${AVATAR_CX}" cy="${AVATAR_CY}" r="${AVATAR_R + 8}"
              fill="none" stroke="url(#frameGrad)" stroke-width="${frameDef.strokeWidth}"/>`
    : `<circle cx="${AVATAR_CX}" cy="${AVATAR_CY}" r="${AVATAR_R}"
              fill="none" stroke="${accent}" stroke-width="1.5" opacity="0.22"/>`

  // ── Premium badge (top-right of avatar) ───────────────────────────────
  const premiumBadge = isPremium
    ? `<g transform="translate(${AVATAR_CX + AVATAR_R - 30}, ${AVATAR_CY - AVATAR_R + 10})">
         <circle r="34" fill="#facc15" stroke="#fff" stroke-width="3"/>
         <text font-family="system-ui, sans-serif" font-size="34" font-weight="900"
               fill="#1f2937" text-anchor="middle" dominant-baseline="central"
               dy="2">⭐</text>
       </g>`
    : ''

  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0f"/>
      <stop offset="100%" style="stop-color:#0d0d1a"/>
    </linearGradient>
    <linearGradient id="topBar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${accent}"/>
      <stop offset="100%" style="stop-color:${accent}44"/>
    </linearGradient>
    <radialGradient id="orb" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:${accent};stop-opacity:0.18"/>
      <stop offset="100%" style="stop-color:${accent};stop-opacity:0.02"/>
    </radialGradient>
    <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="#ffffff" opacity="0.035"/>
    </pattern>
    <clipPath id="avatarClip">
      <circle cx="${AVATAR_CX}" cy="${AVATAR_CY}" r="${AVATAR_R}"/>
    </clipPath>
    ${frameGradient}
    ${colorGradient}
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#dots)"/>

  <!-- Top accent bar -->
  <rect x="0" y="0" width="1200" height="6" fill="url(#topBar)"/>

  <!-- ── LEFT PANEL: companion visual ── -->

  <!-- Glow orb behind avatar -->
  <circle cx="${AVATAR_CX}" cy="${AVATAR_CY}" r="178" fill="url(#orb)"/>

  <!-- Avatar background disc -->
  <circle cx="${AVATAR_CX}" cy="${AVATAR_CY}" r="${AVATAR_R}" fill="#0a0a1a"/>

  <!-- Pixie illustration (clipped to avatar circle) -->
  <image href="${pixieUrl}" xlink:href="${pixieUrl}"
         x="${AVATAR_CX - IMG_SIZE / 2}" y="${AVATAR_CY - IMG_SIZE / 2}"
         width="${IMG_SIZE}" height="${IMG_SIZE}"
         clip-path="url(#avatarClip)"
         preserveAspectRatio="xMidYMid meet"/>

  <!-- Frame ring (cosmetic) or default accent ring -->
  ${frameRing}

  <!-- Premium VIP badge -->
  ${premiumBadge}

  <!-- Rarity badge -->
  <rect x="${AVATAR_CX - 100}" y="${AVATAR_CY + AVATAR_R + 22}" width="200" height="40" rx="20"
        fill="${rarityStyle.bg}" stroke="${rarityStyle.border}" stroke-width="1.5"/>
  <text x="${AVATAR_CX}" y="${AVATAR_CY + AVATAR_R + 48}"
        font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
        font-size="16" font-weight="700" fill="${rarityStyle.text}"
        text-anchor="middle" letter-spacing="2.5">${rarity}</text>

  <!-- Vertical separator -->
  <rect x="524" y="55" width="1" height="520" fill="#ffffff" opacity="0.06"/>

  <!-- ── RIGHT PANEL: text content ── -->

  <!-- "COMPANION" label -->
  <text x="580" y="132"
        font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
        font-size="14" font-weight="700" fill="#475569" letter-spacing="3.5">COMPANION</text>

  <!-- Species name -->
  <text x="580" y="218"
        font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
        font-size="52" font-weight="900" fill="#f1f5f9">${speciesName}</text>

  <!-- Stage · Label (accent) -->
  <text x="580" y="280"
        font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
        font-size="30" font-weight="700" fill="${accent}">${headline}</text>

  <!-- Owner name (with name color cosmetic applied) -->
  <text x="580" y="346"
        font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
        font-size="32" font-weight="800" fill="${nameFill}">${subline}</text>

  ${isPremium ? `
  <!-- VIP / Premium pill -->
  <g transform="translate(580, 376)">
    <rect width="135" height="34" rx="17" fill="#facc15" opacity="0.15" stroke="#facc15" stroke-width="1.5"/>
    <text x="67.5" y="22"
          font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
          font-size="14" font-weight="900" fill="#facc15"
          text-anchor="middle" letter-spacing="1.5">⭐ PREMIUM</text>
  </g>` : ''}

  <!-- Divider -->
  <rect x="580" y="${isPremium ? 432 : 385}" width="540" height="1" fill="#1e293b"/>

  <!-- CTA -->
  <text x="580" y="${isPremium ? 478 : 432}"
        font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
        font-size="20" font-weight="600" fill="#475569">${cta}</text>

  <!-- Bottom branding -->
  <text x="600" y="592"
        font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
        font-size="15" font-weight="900" fill="#334155"
        text-anchor="middle" letter-spacing="1.5">splitvote.io</text>
</svg>`

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}

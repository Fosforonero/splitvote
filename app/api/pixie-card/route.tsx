import { NextRequest } from 'next/server'

export const runtime = 'edge'

type Species = 'spark' | 'blip' | 'momo' | 'shade' | 'orbit'
type Stage = 1 | 2 | 3 | 4 | 5 | 6

const VALID_SPECIES: Species[] = ['spark', 'blip', 'momo', 'shade', 'orbit']

const SPECIES_ACCENT: Record<Species, string> = {
  spark: '#fbbf24',
  blip:  '#a78bfa',
  momo:  '#34d399',
  shade: '#60a5fa',
  orbit: '#fb923c',
}

const SPECIES_NAMES: Record<Species, string> = {
  spark: 'Pixie Spark',
  blip:  'Pixie Glitch',
  momo:  'Pixie Leaf',
  shade: 'Pixie Moonlight',
  orbit: 'Pixie Hologram',
}

const RARITY: Record<Species, string> = {
  spark: 'COMMON',
  blip:  'COMMON',
  momo:  'RARE',
  shade: 'EPIC',
  orbit: 'LEGENDARY',
}

const RARITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  COMMON:    { bg: '#1e2a3a', text: '#94a3b8', border: '#334155' },
  RARE:      { bg: '#1e3a5f', text: '#93c5fd', border: '#1d4ed8' },
  EPIC:      { bg: '#2e1065', text: '#c4b5fd', border: '#7c3aed' },
  LEGENDARY: { bg: '#451a03', text: '#fbbf24', border: '#d97706' },
}

const STAGE_EMOJIS: Record<Species, [string, string, string, string, string, string]> = {
  spark: ['⚡', '⚡', '🌟', '💫', '✨', '🌟'],
  blip:  ['🔮', '🔮', '💎', '🌀', '🌐', '💠'],
  momo:  ['🍄', '🍄', '🌿', '🌲', '🌳', '🍃'],
  shade: ['🌑', '🌒', '🌓', '🌔', '🌕', '🌙'],
  orbit: ['🪐', '🪐', '🌌', '☄️', '🌠', '💿'],
}

const STAGE_LABELS_EN: Record<number, string> = {
  1: 'Hatchling', 2: 'Fledgling', 3: 'Explorer',
  4: 'Champion',  5: 'Legendary', 6: 'Ultra Legendary',
}

const STAGE_LABELS_IT: Record<number, string> = {
  1: 'Cucciolo', 2: 'Apprendista', 3: 'Esploratore',
  4: 'Campione', 5: 'Leggendario', 6: 'Ultra Leggendario',
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const rawSpecies = searchParams.get('species') ?? 'spark'
  const species: Species = VALID_SPECIES.includes(rawSpecies as Species)
    ? (rawSpecies as Species)
    : 'spark'

  const rawStage = parseInt(searchParams.get('stage') ?? '1', 10)
  const stage: Stage = (rawStage >= 1 && rawStage <= 6 ? rawStage : 1) as Stage

  const rawName = searchParams.get('name') ?? 'Anonymous'
  // Truncate long display names to avoid layout overflow
  const name = escapeXml(rawName.slice(0, 22))

  const locale = searchParams.get('locale') ?? 'en'
  const IT = locale === 'it'

  const accent = SPECIES_ACCENT[species]
  const speciesName = escapeXml(SPECIES_NAMES[species])
  const emoji = STAGE_EMOJIS[species][stage - 1]
  const stageLabel = IT ? STAGE_LABELS_IT[stage] : STAGE_LABELS_EN[stage]
  const rarity = RARITY[species]
  const rarityStyle = RARITY_COLORS[rarity]

  const headline = IT
    ? `Stadio ${stage} · ${stageLabel}`
    : `Stage ${stage} · ${stageLabel}`

  const subline = IT
    ? `Il Pixie di ${name}`
    : `${name}'s Pixie`

  const cta = IT
    ? 'Scopri il tuo su splitvote.io →'
    : 'Grow yours at splitvote.io →'

  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
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
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="10" result="coloredBlur"/>
      <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="#ffffff" opacity="0.035"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#dots)"/>

  <!-- Top accent bar -->
  <rect x="0" y="0" width="1200" height="6" fill="url(#topBar)"/>

  <!-- ── LEFT PANEL: companion visual ── -->

  <!-- Glow orb -->
  <circle cx="278" cy="292" r="178" fill="url(#orb)"/>
  <!-- Accent ring -->
  <circle cx="278" cy="292" r="152" fill="none" stroke="${accent}" stroke-width="1.5" opacity="0.22"/>

  <!-- Stage emoji -->
  <text x="278" y="348" font-family="system-ui, sans-serif" font-size="130" text-anchor="middle">${emoji}</text>

  <!-- Rarity badge -->
  <rect x="178" y="438" width="200" height="40" rx="20"
        fill="${rarityStyle.bg}" stroke="${rarityStyle.border}" stroke-width="1.5"/>
  <text x="278" y="464"
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

  <!-- Stage · Label (accent glow) -->
  <text x="580" y="280"
        font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
        font-size="30" font-weight="700" fill="${accent}"
        filter="url(#glow)">${headline}</text>

  <!-- Owner subline -->
  <text x="580" y="338"
        font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
        font-size="22" font-weight="500" fill="#64748b">${subline}</text>

  <!-- Divider -->
  <rect x="580" y="385" width="540" height="1" fill="#1e293b"/>

  <!-- CTA -->
  <text x="580" y="432"
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

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PixieSprite from './PixieSprite'
import {
  pixieItemToSpecies,
  getEffectiveSpecies,
} from '@/lib/pixie'
import {
  COMPANIONS,
  COMPANION_MAP,
  getCompanionStage,
  getSpeciesVotes,
  isSpeciesUnlocked,
  STAGE_LABELS,
  type CompanionSpecies,
  type CompanionAccess,
  type PixieXpMap,
} from '@/lib/companion'
import {
  COSMETICS_BY_CATEGORY,
  COSMETIC_MAP,
  RARITY_STYLES,
  NAME_COLORS,
  type CosmeticItemId,
} from '@/lib/cosmetics-store'

// ── Static asset coverage ────────────────────────────────────────────────────
// Species that have a corresponding sprite folder in /public/pixie/. Tiles
// for species NOT in this set fall back to the emoji — guards against 404
// when a species was authored before its sprite assets shipped.
const SPECIES_WITH_SPRITES: ReadonlySet<string> = new Set([
  'angel', 'banana', 'caffe', 'crown', 'devil', 'diamond', 'fuoco',
  'galaxy', 'heart', 'hologram', 'ice', 'leaf', 'momo', 'moonlight',
  'orbit', 'overseer', 'robot', 'scintille', 'shade', 'spark', 'triste',
  'void', 'voidcore', 'blip',
])

// Reverse map: market species → product id (sent to /api/profile/equip-pixie).
// Note pixie_nova maps to species 'scintille' — not derivable from a simple
// slice. Centralised here so the click handler stays simple.
const SPECIES_TO_PRODUCT: Partial<Record<CompanionSpecies, string>> = {
  crown:     'pixie_crown',
  diamond:   'pixie_diamond',
  galaxy:    'pixie_galaxy',
  angel:     'pixie_angel',
  devil:     'pixie_devil',
  scintille: 'pixie_nova',
}

// ── i18n copy ────────────────────────────────────────────────────────────────

const COPY = {
  en: {
    title:                'Customize Pixie',
    unlockLink:           '+ Unlock cosmetics →',
    currentlyEquipped:    'Currently equipped',
    speciesSection:       'Pixie / Species',
    speciesSectionHint:   'All your Pixie species and market skins. Equip any unlocked one.',
    frameSection:         'Profile Frame',
    glowSection:          'Glow',
    nameColorSection:     'Name Color',
    profilePicSection:    'Profile Picture',
    useAsAvatar:          'Use Pixie as public avatar',
    buySkinFirst:         'Buy a skin to enable',
    tabs:                 { all: 'All', owned: 'Owned', locked: 'Locked' },
    equip:                'Equip',
    equipped:             '✓ Equipped',
    getInStore:           'Shop →',
    locked:               'Locked',
    equipFirst:           'Equip a skin first',
    nameColorLocked:      'Buy the Name Color Bundle to unlock all colors',
    networkError:         'Network error — try again.',
    stage:                'Stage',
    tier:                 { free: 'Free', premium: 'Premium', market: 'Market', admin: 'Admin' },
    noFrame:              'No frame',
    noGlow:               'No glow',
    noFrameEquipped:      'No frame equipped',
    noGlowEquipped:       'No glow equipped',
    unequipFrameAria:     'Remove equipped frame',
    unequipGlowAria:      'Remove equipped glow',
  },
  it: {
    title:                'Personalizza Pixie',
    unlockLink:           '+ Sblocca cosmetici →',
    currentlyEquipped:    'Attualmente equipaggiato',
    speciesSection:       'Pixie / Specie',
    speciesSectionHint:   'Tutti i tuoi Pixie e le skin del market. Equipaggia quello che vuoi.',
    frameSection:         'Cornice profilo',
    glowSection:          'Glow',
    nameColorSection:     'Colore nome',
    profilePicSection:    'Foto profilo',
    useAsAvatar:          'Usa il Pixie come avatar pubblico',
    buySkinFirst:         'Acquista una skin per abilitare',
    tabs:                 { all: 'Tutti', owned: 'In possesso', locked: 'Bloccati' },
    equip:                'Equipaggia',
    equipped:             '✓ Equipaggiato',
    getInStore:           'Acquista →',
    locked:               'Bloccato',
    equipFirst:           'Equipaggia prima una skin',
    nameColorLocked:      'Acquista il Name Color Bundle per sbloccare tutti i colori',
    networkError:         'Errore di rete — riprova.',
    stage:                'Stadio',
    tier:                 { free: 'Free', premium: 'Premium', market: 'Market', admin: 'Admin' },
    noFrame:              'Nessuna cornice',
    noGlow:               'Nessun glow',
    noFrameEquipped:      'Nessuna cornice equipaggiata',
    noGlowEquipped:       'Nessun glow equipaggiato',
    unequipFrameAria:     'Rimuovi cornice equipaggiata',
    unequipGlowAria:      'Rimuovi glow equipaggiato',
  },
} as const

type Locale    = keyof typeof COPY
type FilterTab = 'all' | 'owned' | 'locked'

// ── Tier presentation ────────────────────────────────────────────────────────

const TIER_EMOJI: Record<CompanionAccess, string> = {
  free:    '🆓',
  premium: '💎',
  market:  '🛒',
  admin:   '👁️',
}

// ── Props ────────────────────────────────────────────────────────────────────

interface Props {
  // Profile state (server-loaded)
  companionSpecies: CompanionSpecies
  pixieXp:          PixieXpMap & { owned?: string[]; active?: string | null }
  votesCount:       number
  streakDays:       number
  isPremium:        boolean
  isAdmin:          boolean

  // Cosmetic equipped state
  equippedFrame:    string | null
  equippedGlow:     string | null
  nameColor:        string | null
  usePixieAvatar:   boolean

  locale?: 'en' | 'it' | string
}

// ── Per-tile preview (isolated onError state) ────────────────────────────────

/** Renders one species sprite tile preview with emoji fallback. Wraps
 *  PixieSprite for the per-species scale + bake-bg frame. Isolated so
 *  one broken sprite doesn't blank the whole picker. */
function SpeciesTilePreview({
  species,
  fallbackEmoji,
  speciesVotes,
  dimmed,
}: {
  species: CompanionSpecies
  fallbackEmoji: string
  speciesVotes: number
  dimmed: boolean
}) {
  const stage = getCompanionStage(speciesVotes)
  const hasSprite = SPECIES_WITH_SPRITES.has(species)
  if (!hasSprite) {
    return (
      <div className={`relative w-20 h-20 flex items-center justify-center overflow-hidden rounded-lg ${dimmed ? 'grayscale opacity-40' : ''}`}>
        <span className="text-4xl" aria-hidden="true">{fallbackEmoji}</span>
      </div>
    )
  }
  return (
    <PixieSprite
      species={species}
      stage={stage}
      fallbackEmoji={fallbackEmoji}
      className="w-20 h-20 rounded-lg"
      pixelSize={160}
      dimmed={dimmed}
    />
  )
}

// ── Component ────────────────────────────────────────────────────────────────

export default function PixieSelector({
  companionSpecies,
  pixieXp,
  votesCount,
  streakDays,
  isPremium,
  isAdmin,
  equippedFrame:  initialFrame,
  equippedGlow:   initialGlow,
  nameColor:      initialNameColor,
  usePixieAvatar: initialUsePixie,
  locale = 'en',
}: Props) {
  const t = COPY[(locale === 'it' ? 'it' : 'en') as Locale]
  const router = useRouter()

  // ── Local optimistic state ────────────────────────────────────────────────
  const [activeSpecies, setActiveSpecies] = useState<CompanionSpecies>(
    getEffectiveSpecies({ companion_species: companionSpecies, pixie_xp: pixieXp }),
  )
  const [equippedFrame, setEquippedFrame] = useState<string | null>(initialFrame)
  const [equippedGlow,  setEquippedGlow]  = useState<string | null>(initialGlow)
  const [nameColor,     setNameColor]     = useState<string | null>(initialNameColor)
  const [usePixieAvatar, setUsePixie]     = useState(initialUsePixie)
  const [equipping, setEquipping] = useState<string | null>(null)
  const [togglingAvatar, setToggling] = useState(false)
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null)
  const [speciesTab, setSpeciesTab] = useState<FilterTab>('all')

  // ── Derived data ──────────────────────────────────────────────────────────
  const ownedMarketIds = Array.isArray(pixieXp?.owned) ? pixieXp!.owned! : []
  // Reverse: derive owned market species from owned product ids
  const ownedMarketSpecies = ownedMarketIds
    .map((id) => pixieItemToSpecies(id))
    .filter(Boolean) as CompanionSpecies[]

  /** Whether the user has access to a given species RIGHT NOW. */
  function speciesAccessible(species: CompanionSpecies): boolean {
    return isSpeciesUnlocked(
      species,
      votesCount,
      streakDays,
      isPremium,
      isAdmin,
      ownedMarketSpecies,
    )
  }

  // Ordered list: free → premium → market → admin
  const orderedSpecies = [
    ...COMPANIONS.filter((c) => c.access === 'free'),
    ...COMPANIONS.filter((c) => c.access === 'premium'),
    ...COMPANIONS.filter((c) => c.access === 'market'),
    ...COMPANIONS.filter((c) => c.access === 'admin'),
  ]

  // Visible species (admins see everything; non-admins never see admin-tier).
  const visibleSpecies = orderedSpecies.filter((c) => c.access !== 'admin' || isAdmin)

  // Counts for filter pills
  const ownedAccessibleCount = visibleSpecies.filter((c) => speciesAccessible(c.id)).length
  const lockedCount          = visibleSpecies.length - ownedAccessibleCount

  // Active filter
  const filteredSpecies = visibleSpecies.filter((c) => {
    if (speciesTab === 'owned')  return speciesAccessible(c.id)
    if (speciesTab === 'locked') return !speciesAccessible(c.id)
    return true
  })

  // Effective active species (used for the "Currently equipped" banner +
  // the ✓ Equipped pill on tiles).
  const activeSpeciesDef = COMPANION_MAP[activeSpecies]
  const activeStage = getCompanionStage(getSpeciesVotes(pixieXp, activeSpecies))

  // ── Flash helper ──────────────────────────────────────────────────────────
  function flash(text: string, ok: boolean) {
    setMessage({ text, ok })
    setTimeout(() => setMessage(null), 3000)
  }

  // ── Handlers ──────────────────────────────────────────────────────────────

  /** Equip a Pixie species. Routes to /api/profile/equip-pixie for market
   *  species and /api/profile/update for free/premium/admin species. The
   *  server-side update endpoint also clears pixie_xp.active so the new
   *  species takes over the avatar. */
  async function handleEquipSpecies(species: CompanionSpecies) {
    setEquipping(species)
    try {
      const def = COMPANION_MAP[species]
      if (def.access === 'market') {
        const productId = SPECIES_TO_PRODUCT[species]
        if (!productId) {
          flash(t.networkError, false)
          return
        }
        const res = await fetch('/api/profile/equip-pixie', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ itemId: productId }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) { flash(data.error ?? 'Error', false); return }
      } else {
        const res = await fetch('/api/profile/update', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ companionSpecies: species }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) { flash(data.error ?? 'Error', false); return }
      }
      setActiveSpecies(species)
      flash(`${def.name} — ${t.equipped}`, true)
      router.refresh()
    } catch {
      flash(t.networkError, false)
    } finally {
      setEquipping(null)
    }
  }

  /** Equip a frame or glow cosmetic. */
  async function handleEquipCosmetic(itemId: CosmeticItemId) {
    setEquipping(itemId)
    try {
      const res = await fetch('/api/profile/equip-cosmetic', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ itemId }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { flash(data.error ?? 'Error', false); return }
      const item = COSMETIC_MAP[itemId]
      if (item?.category === 'frame') setEquippedFrame(itemId)
      if (item?.category === 'glow')  setEquippedGlow(itemId)
      flash(`${item?.name ?? itemId} — ${t.equipped}`, true)
      router.refresh()
    } catch {
      flash(t.networkError, false)
    } finally {
      setEquipping(null)
    }
  }

  /** Unequip a frame or glow (clears the slot — no purchase gate). */
  async function handleUnequip(category: 'frame' | 'glow') {
    const key = `unequip_${category}`
    setEquipping(key)
    try {
      const res = await fetch('/api/profile/equip-cosmetic', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ unequip: category }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { flash(data.error ?? 'Error', false); return }
      if (category === 'frame') setEquippedFrame(null)
      if (category === 'glow')  setEquippedGlow(null)
      flash(category === 'frame' ? t.noFrameEquipped : t.noGlowEquipped, true)
      router.refresh()
    } catch {
      flash(t.networkError, false)
    } finally {
      setEquipping(null)
    }
  }

  /** Equip a name color (from the bundle). */
  async function handleEquipNameColor(colorValue: string) {
    const key = 'name_color_' + colorValue
    setEquipping(key)
    try {
      const res = await fetch('/api/profile/equip-cosmetic', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ nameColor: colorValue }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { flash(data.error ?? 'Error', false); return }
      setNameColor(colorValue)
      flash(`${t.nameColorSection} — ${t.equipped}`, true)
      router.refresh()
    } catch {
      flash(t.networkError, false)
    } finally {
      setEquipping(null)
    }
  }

  /** Toggle whether the Pixie is used as the public avatar. */
  async function handleToggleAvatar(enabled: boolean) {
    setToggling(true)
    try {
      const res = await fetch('/api/profile/toggle-pixie-avatar', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ enabled }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { flash(data.error ?? 'Error', false); return }
      setUsePixie(enabled)
      router.refresh()
    } catch {
      flash(t.networkError, false)
    } finally {
      setToggling(false)
    }
  }

  // Name color bundle ownership (admin bypasses; otherwise check pixie_xp.owned).
  const hasNameBundle = isAdmin || ownedMarketIds.includes('name_color_bundle')

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[#0d0d1a]/60 p-5 mb-8">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-black uppercase tracking-widest text-[var(--muted)]">
          {t.title}
        </h2>
        <Link
          href="/store"
          className="text-xs text-purple-400 hover:text-purple-300 font-semibold transition-colors"
        >
          {t.unlockLink}
        </Link>
      </div>

      {/* ── Currently Equipped banner ── */}
      <div className={`
        flex items-center gap-3 sm:gap-4 rounded-xl border px-3 sm:px-4 py-3 mb-5 transition-all
        ${RARITY_STYLES[activeSpeciesDef.rarity]} border-opacity-60
      `}>
        {SPECIES_WITH_SPRITES.has(activeSpecies) ? (
          <PixieSprite
            species={activeSpecies}
            stage={activeStage}
            fallbackEmoji={activeSpeciesDef.stageEmoji[activeStage - 1] ?? '✨'}
            className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-lg"
            pixelSize={160}
          />
        ) : (
          <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center">
            <span className="text-4xl" aria-hidden="true">
              {activeSpeciesDef.stageEmoji[activeStage - 1] ?? '✨'}
            </span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] leading-none mb-0.5">
            {t.currentlyEquipped}
          </p>
          <p className="text-sm font-bold text-white truncate">
            {activeSpeciesDef.name}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {t.stage} {activeStage} · {STAGE_LABELS[activeStage]}
          </p>
        </div>
        <span className={`
          ml-auto flex-shrink-0 text-[10px] font-bold uppercase tracking-wider
          px-2 py-0.5 rounded-full border capitalize
          ${RARITY_STYLES[activeSpeciesDef.rarity]}
        `}>
          {activeSpeciesDef.rarity}
        </span>
      </div>

      {/* ── Flash message ── */}
      {message && (
        <p
          role="status"
          aria-live="polite"
          className={`text-xs mb-3 font-semibold ${message.ok ? 'text-green-400' : 'text-red-400'}`}
        >
          {message.text}
        </p>
      )}

      {/* ── Pixie / Species section ── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
            {t.speciesSection}
          </p>
          {/* Filter tabs */}
          <div className="flex gap-1 bg-white/5 rounded-lg p-0.5" role="tablist">
            {(['all', 'owned', 'locked'] as FilterTab[]).map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={speciesTab === tab}
                onClick={() => setSpeciesTab(tab)}
                className={`
                  text-[10px] font-bold px-2.5 py-1 rounded-md transition-all
                  ${speciesTab === tab
                    ? 'bg-white/10 text-white'
                    : 'text-slate-500 hover:text-slate-300'
                  }
                `}
              >
                {t.tabs[tab]}
                {tab === 'owned' && ownedAccessibleCount > 0 && (
                  <span className="ml-1 text-blue-400">{ownedAccessibleCount}</span>
                )}
                {tab === 'locked' && lockedCount > 0 && (
                  <span className="ml-1 text-slate-400">{lockedCount}</span>
                )}
              </button>
            ))}
          </div>
        </div>
        <p className="text-[10px] text-slate-500 mb-2.5">{t.speciesSectionHint}</p>

        {filteredSpecies.length === 0 ? (
          <div className="rounded-xl border border-white/5 bg-white/2 px-4 py-6 text-center">
            <p className="text-sm text-slate-500">
              {locale === 'it' ? 'Nessun Pixie qui.' : 'No Pixies here.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {filteredSpecies.map((def) => {
              const accessible = speciesAccessible(def.id)
              const isActive   = activeSpecies === def.id
              const isEquip    = equipping === def.id
              const speciesVotes = getSpeciesVotes(pixieXp, def.id)

              return (
                <div
                  key={def.id}
                  className={`
                    relative rounded-xl border p-3 flex flex-col items-center gap-1.5 text-center
                    transition-all duration-200
                    ${accessible
                      ? isActive
                        ? 'border-blue-500/70 bg-blue-500/10 ring-2 ring-offset-1 ring-offset-[#0d0d1a] ring-blue-500'
                        : RARITY_STYLES[def.rarity]
                      : 'border-white/6 bg-white/2'
                    }
                  `}
                >
                  {/* Tier badge */}
                  <span
                    className="absolute top-1.5 right-1.5 text-[9px] leading-none"
                    title={t.tier[def.access]}
                    aria-label={t.tier[def.access]}
                  >
                    {TIER_EMOJI[def.access]}
                  </span>

                  <SpeciesTilePreview
                    species={def.id}
                    fallbackEmoji={def.stageEmoji[0]}
                    speciesVotes={speciesVotes}
                    dimmed={!accessible}
                  />

                  <p className={`text-[11px] font-bold leading-tight ${accessible ? 'text-white' : 'text-slate-600'}`}>
                    {def.name}
                  </p>

                  <span className={`
                    text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded
                    border capitalize ${RARITY_STYLES[def.rarity]}
                  `}>
                    {def.rarity}
                  </span>

                  {accessible ? (
                    isActive ? (
                      <span className="text-[10px] text-blue-400 font-bold">{t.equipped}</span>
                    ) : (
                      <button
                        onClick={() => handleEquipSpecies(def.id)}
                        disabled={isEquip}
                        aria-pressed={isActive}
                        className="text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-500 px-2.5 py-0.5 rounded-md disabled:opacity-50 transition-colors"
                      >
                        {isEquip ? '…' : t.equip}
                      </button>
                    )
                  ) : (
                    <>
                      {def.access === 'market' ? (
                        <Link
                          href="/store"
                          className="text-[10px] font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          {t.getInStore}
                        </Link>
                      ) : (
                        <span className="text-[9px] text-slate-500 leading-tight">
                          {def.unlockCondition}
                        </span>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Frames section ── */}
      {(COSMETICS_BY_CATEGORY.frame ?? []).length > 0 && (
        <div className="mb-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">
            {t.frameSection}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {/* No frame / unequip tile — always first */}
            {(() => {
              const noFrameActive = equippedFrame === null
              const isUnequipping = equipping === 'unequip_frame'
              return (
                <button
                  type="button"
                  onClick={() => !noFrameActive && handleUnequip('frame')}
                  disabled={noFrameActive || isUnequipping}
                  aria-pressed={noFrameActive}
                  aria-label={t.unequipFrameAria}
                  className={`
                    rounded-xl border p-3 flex items-center gap-3 transition-all duration-200 text-left
                    ${noFrameActive
                      ? 'border-blue-500/70 bg-blue-500/10 ring-2 ring-offset-1 ring-offset-[#0d0d1a] ring-blue-500 cursor-default'
                      : 'border-white/10 bg-white/3 hover:border-white/20 cursor-pointer'
                    }
                    disabled:cursor-not-allowed
                  `}
                >
                  <span className="text-2xl flex-shrink-0 opacity-60">🚫</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-white truncate">
                      {t.noFrame}
                    </p>
                    {noFrameActive ? (
                      <span className="text-[10px] text-blue-400 font-bold">{t.equipped}</span>
                    ) : (
                      <span className="text-[10px] text-slate-400">
                        {isUnequipping ? '…' : t.equip}
                      </span>
                    )}
                  </div>
                </button>
              )
            })()}

            {(COSMETICS_BY_CATEGORY.frame ?? []).map((item) => {
              const owned    = isAdmin || ownedMarketIds.includes(item.id)
              const isActive = equippedFrame === item.id
              const isEquip  = equipping === item.id

              return (
                <div
                  key={item.id}
                  className={`
                    rounded-xl border p-3 flex items-center gap-3 transition-all duration-200
                    ${owned
                      ? isActive
                        ? 'border-blue-500/70 bg-blue-500/10 ring-2 ring-offset-1 ring-offset-[#0d0d1a] ring-blue-500'
                        : RARITY_STYLES[item.rarity]
                      : 'border-white/6 bg-white/2'
                    }
                  `}
                >
                  <span className={`text-2xl flex-shrink-0 ${!owned ? 'grayscale opacity-40' : ''}`}>
                    {item.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[11px] font-bold truncate ${owned ? 'text-white' : 'text-slate-600'}`}>
                      {item.name}
                    </p>
                    {owned ? (
                      isActive ? (
                        <span className="text-[10px] text-blue-400 font-bold">{t.equipped}</span>
                      ) : (
                        <button
                          onClick={() => handleEquipCosmetic(item.id as CosmeticItemId)}
                          disabled={isEquip}
                          aria-pressed={isActive}
                          className="text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-500 px-2 py-0.5 rounded disabled:opacity-50 transition-colors"
                        >
                          {isEquip ? '…' : t.equip}
                        </button>
                      )
                    ) : (
                      <Link
                        href="/store"
                        className="text-[10px] font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        {t.getInStore}
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Glows section ── */}
      {(COSMETICS_BY_CATEGORY.glow ?? []).length > 0 && (
        <div className="mb-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">
            {t.glowSection}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {/* No glow / unequip tile — always first */}
            {(() => {
              const noGlowActive = equippedGlow === null
              const isUnequipping = equipping === 'unequip_glow'
              return (
                <button
                  type="button"
                  onClick={() => !noGlowActive && handleUnequip('glow')}
                  disabled={noGlowActive || isUnequipping}
                  aria-pressed={noGlowActive}
                  aria-label={t.unequipGlowAria}
                  className={`
                    rounded-xl border p-3 flex flex-col items-center gap-1.5 text-center transition-all duration-200
                    ${noGlowActive
                      ? 'border-blue-500/70 bg-blue-500/10 ring-2 ring-offset-1 ring-offset-[#0d0d1a] ring-blue-500 cursor-default'
                      : 'border-white/10 bg-white/3 hover:border-white/20 cursor-pointer'
                    }
                    disabled:cursor-not-allowed
                  `}
                >
                  <span className="text-2xl opacity-60">🚫</span>
                  <p className="text-[11px] font-bold leading-tight text-white">{t.noGlow}</p>
                  {noGlowActive ? (
                    <span className="text-[10px] text-blue-400 font-bold">{t.equipped}</span>
                  ) : (
                    <span className="text-[10px] text-slate-400">
                      {isUnequipping ? '…' : t.equip}
                    </span>
                  )}
                </button>
              )
            })()}

            {(COSMETICS_BY_CATEGORY.glow ?? []).map((item) => {
              const owned    = isAdmin || ownedMarketIds.includes(item.id)
              const isActive = equippedGlow === item.id
              const isEquip  = equipping === item.id

              return (
                <div
                  key={item.id}
                  className={`
                    rounded-xl border p-3 flex flex-col items-center gap-1.5 text-center
                    transition-all duration-200
                    ${owned
                      ? isActive
                        ? 'border-blue-500/70 bg-blue-500/10 ring-2 ring-offset-1 ring-offset-[#0d0d1a] ring-blue-500'
                        : RARITY_STYLES[item.rarity]
                      : 'border-white/6 bg-white/2'
                    }
                  `}
                >
                  <span className={`text-2xl ${!owned ? 'grayscale opacity-40' : ''}`}>
                    {item.emoji}
                  </span>
                  <p className={`text-[11px] font-bold leading-tight ${owned ? 'text-white' : 'text-slate-600'}`}>
                    {item.name}
                  </p>
                  {owned ? (
                    isActive ? (
                      <span className="text-[10px] text-blue-400 font-bold">{t.equipped}</span>
                    ) : (
                      <button
                        onClick={() => handleEquipCosmetic(item.id as CosmeticItemId)}
                        disabled={isEquip}
                        aria-pressed={isActive}
                        className="text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-500 px-2.5 py-0.5 rounded-md disabled:opacity-50 transition-colors"
                      >
                        {isEquip ? '…' : t.equip}
                      </button>
                    )
                  ) : (
                    <Link
                      href="/store"
                      className="text-[10px] font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      {t.getInStore}
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Name Color section ── */}
      <div className="mb-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">
          {t.nameColorSection}
        </p>
        {hasNameBundle ? (
          <div className="space-y-3">
            {(['basic', 'premium'] as const).map((group) => {
              const groupColors = NAME_COLORS.filter((c) => c.group === group)
              if (groupColors.length === 0) return null
              const groupLabel = locale === 'it'
                ? (group === 'basic' ? 'Base' : 'Premium')
                : (group === 'basic' ? 'Basic' : 'Premium')
              return (
                <div key={group}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">
                    {groupLabel}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {groupColors.map((color) => {
                      const isActive = nameColor === color.value
                      const isEq     = equipping === ('name_color_' + color.value)
                      return (
                        <button
                          key={color.value}
                          onClick={() => handleEquipNameColor(color.value)}
                          disabled={isEq || isActive}
                          aria-pressed={isActive}
                          className={`
                            px-3 py-1.5 rounded-lg border text-xs font-bold transition-all duration-150
                            ${isActive
                              ? 'border-blue-500/60 bg-blue-500/10 ring-1 ring-blue-500'
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                            }
                            disabled:cursor-not-allowed
                          `}
                        >
                          <span className={color.class}>{color.label}</span>
                          {isActive && <span className="ml-1 text-blue-400">✓</span>}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <span className="text-xl grayscale opacity-40">🎨</span>
            <p className="text-[11px] text-slate-500">
              <Link href="/store" className="underline hover:text-slate-300 text-purple-400">
                {t.nameColorLocked}
              </Link>
            </p>
          </div>
        )}
      </div>

      {/* ── Profile picture toggle ── */}
      <div className="border-t border-white/5 pt-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">
          {t.profilePicSection}
        </p>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {SPECIES_WITH_SPRITES.has(activeSpecies) ? (
              <PixieSprite
                species={activeSpecies}
                stage={activeStage}
                fallbackEmoji={activeSpeciesDef.stageEmoji[activeStage - 1] ?? '✨'}
                className="w-10 h-10 rounded-xl border border-blue-500/30 bg-blue-500/10"
                pixelSize={96}
                showFrame={false}
              />
            ) : (
              <div className="w-10 h-10 rounded-xl border border-blue-500/30 bg-blue-500/10 flex items-center justify-center">
                <span className="text-2xl">
                  {activeSpeciesDef.stageEmoji[activeStage - 1] ?? '✨'}
                </span>
              </div>
            )}
            <div>
              <p className="text-xs text-white font-semibold leading-none">
                {activeSpeciesDef.name}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">{t.useAsAvatar}</p>
            </div>
          </div>

          <button
            onClick={() => handleToggleAvatar(!usePixieAvatar)}
            disabled={togglingAvatar}
            aria-pressed={usePixieAvatar}
            aria-label={t.useAsAvatar}
            className={`
              relative flex-shrink-0 w-11 h-6 rounded-full transition-all duration-200
              ${usePixieAvatar ? 'bg-blue-600' : 'bg-slate-700'}
              disabled:opacity-40 disabled:cursor-not-allowed
            `}
          >
            <span
              className={`
                absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200
                ${usePixieAvatar ? 'left-[22px]' : 'left-0.5'}
              `}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

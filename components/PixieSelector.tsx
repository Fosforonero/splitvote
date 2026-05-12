'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  PIXIE_ITEMS, COSMETICS_BY_CATEGORY, COSMETIC_MAP,
  RARITY_STYLES, NAME_COLORS,
  type CosmeticItemId,
} from '@/lib/cosmetics-store'
import { type PixieItemId } from '@/lib/pixie-store'

// ── i18n copy ────────────────────────────────────────────────────────────────

const COPY = {
  en: {
    title:             'Cosmetics',
    unlockLink:        '+ Unlock cosmetics →',
    currentlyEquipped: 'Currently equipped',
    noSkin:            'No skin equipped',
    skinSection:       'Pixie Skin',
    frameSection:      'Profile Frame',
    glowSection:       'Glow',
    nameColorSection:  'Name Color',
    profilePicSection: 'Profile Picture',
    useAsAvatar:       'Use skin as public avatar',
    buySkinFirst:      'Buy a skin to enable',
    tabs:              { all: 'All', owned: 'Owned', store: 'Store' },
    equip:             'Equip',
    equipped:          '✓ Equipped',
    getInStore:        'Shop →',
    equipFirst:        'Equip a skin first',
    nameColorLocked:   'Buy the Name Color Bundle to unlock all colors',
    networkError:      'Network error — try again.',
  },
  it: {
    title:             'Cosmetici',
    unlockLink:        '+ Sblocca cosmetici →',
    currentlyEquipped: 'Attualmente equipaggiata',
    noSkin:            'Nessuna skin equipaggiata',
    skinSection:       'Pixie Skin',
    frameSection:      'Cornice profilo',
    glowSection:       'Glow',
    nameColorSection:  'Colore nome',
    profilePicSection: 'Foto profilo',
    useAsAvatar:       'Usa la skin come avatar pubblico',
    buySkinFirst:      'Acquista una skin per abilitare',
    tabs:              { all: 'Tutti', owned: 'In possesso', store: 'Store' },
    equip:             'Equipaggia',
    equipped:          '✓ Equipaggiata',
    getInStore:        'Acquista →',
    equipFirst:        'Equipaggia prima una skin',
    nameColorLocked:   'Acquista il Name Color Bundle per sbloccare tutti i colori',
    networkError:      'Errore di rete — riprova.',
  },
} as const

type Locale = keyof typeof COPY
type FilterTab = 'all' | 'owned' | 'store'

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  ownedIds:        string[]
  activePixieId:   string | null
  equippedFrame?:  string | null
  equippedGlow?:   string | null
  nameColor?:      string | null
  usePixieAvatar?: boolean
  locale?:         string
  onEquip?:        (itemId: PixieItemId) => void
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PixieSelector({
  ownedIds,
  activePixieId:   initialActive,
  equippedFrame:   initialFrame    = null,
  equippedGlow:    initialGlow     = null,
  nameColor:       initialNameColor = null,
  usePixieAvatar:  initialUsePixie  = false,
  locale           = 'en',
  onEquip,
}: Props) {
  const t = COPY[(locale === 'it' ? 'it' : 'en') as Locale]

  const [activeId,      setActiveId]      = useState<string | null>(initialActive)
  const [equippedFrame, setEquippedFrame] = useState<string | null>(initialFrame)
  const [equippedGlow,  setEquippedGlow]  = useState<string | null>(initialGlow)
  const [nameColor,     setNameColor]     = useState<string | null>(initialNameColor)
  const [equipping,     setEquipping]     = useState<string | null>(null)
  const [message,       setMessage]       = useState<{ text: string; ok: boolean } | null>(null)
  const [usePixieAvatar, setUsePixie]     = useState(initialUsePixie)
  const [togglingAvatar, setToggling]     = useState(false)
  const [skinTab,        setSkinTab]      = useState<FilterTab>('all')

  // Derived
  const activePixieItem  = activeId ? COSMETIC_MAP[activeId as CosmeticItemId] : null
  const ownedPixieIds    = PIXIE_ITEMS.filter(i => ownedIds.includes(i.id)).map(i => i.id)
  const hasAnyPixie      = ownedPixieIds.length > 0
  const hasNameBundle    = ownedIds.includes('name_color_bundle')

  const filteredSkins = PIXIE_ITEMS.filter(item => {
    if (skinTab === 'owned') return ownedIds.includes(item.id)
    if (skinTab === 'store') return !ownedIds.includes(item.id)
    return true
  })

  // ── Handlers ──────────────────────────────────────────────────────────────

  function flash(text: string, ok: boolean) {
    setMessage({ text, ok })
    setTimeout(() => setMessage(null), 3000)
  }

  async function handleEquipPixie(itemId: PixieItemId) {
    setEquipping(itemId)
    try {
      const res  = await fetch('/api/profile/equip-pixie', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ itemId }),
      })
      const data = await res.json()
      if (!res.ok) { flash(`${data.error ?? 'Error'}`, false); return }
      setActiveId(itemId)
      flash(`${COSMETIC_MAP[itemId]?.name ?? itemId} — ${t.equipped}`, true)
      onEquip?.(itemId)
    } catch { flash(t.networkError, false) }
    finally  { setEquipping(null) }
  }

  async function handleEquipCosmetic(itemId: CosmeticItemId) {
    setEquipping(itemId)
    try {
      const res  = await fetch('/api/profile/equip-cosmetic', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ itemId }),
      })
      const data = await res.json()
      if (!res.ok) { flash(`${data.error ?? 'Error'}`, false); return }
      const item = COSMETIC_MAP[itemId]
      if (item.category === 'frame') setEquippedFrame(itemId)
      if (item.category === 'glow')  setEquippedGlow(itemId)
      flash(`${item.name} — ${t.equipped}`, true)
    } catch { flash(t.networkError, false) }
    finally  { setEquipping(null) }
  }

  async function handleEquipNameColor(colorValue: string) {
    const key = 'name_color_' + colorValue
    setEquipping(key)
    try {
      const res  = await fetch('/api/profile/equip-cosmetic', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ nameColor: colorValue }),
      })
      const data = await res.json()
      if (!res.ok) { flash(`${data.error ?? 'Error'}`, false); return }
      setNameColor(colorValue)
      flash(`${t.nameColorSection} — ${t.equipped}`, true)
    } catch { flash(t.networkError, false) }
    finally  { setEquipping(null) }
  }

  async function handleToggleAvatar(enabled: boolean) {
    setToggling(true)
    try {
      const res  = await fetch('/api/profile/toggle-pixie-avatar', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ enabled }),
      })
      const data = await res.json()
      if (!res.ok) { flash(`${data.error ?? 'Error'}`, false); return }
      setUsePixie(enabled)
    } catch { flash(t.networkError, false) }
    finally  { setToggling(false) }
  }

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
        flex items-center gap-3 rounded-xl border px-4 py-3 mb-5 transition-all
        ${activePixieItem
          ? `${RARITY_STYLES[activePixieItem.rarity]} border-opacity-60`
          : 'border-white/8 bg-white/3'
        }
      `}>
        <div className="text-3xl flex-shrink-0">
          {activePixieItem ? activePixieItem.emoji : '✨'}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] leading-none mb-0.5">
            {t.currentlyEquipped}
          </p>
          <p className="text-sm font-bold text-white truncate">
            {activePixieItem ? activePixieItem.name : t.noSkin}
          </p>
        </div>
        {activePixieItem && (
          <span className={`
            ml-auto flex-shrink-0 text-[10px] font-bold uppercase tracking-wider
            px-2 py-0.5 rounded-full border capitalize
            ${RARITY_STYLES[activePixieItem.rarity]}
          `}>
            {activePixieItem.rarity}
          </span>
        )}
      </div>

      {/* ── Flash message ── */}
      {message && (
        <p className={`text-xs mb-3 font-semibold ${message.ok ? 'text-green-400' : 'text-red-400'}`}>
          {message.text}
        </p>
      )}

      {/* ── Pixie Skin section ── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
            {t.skinSection}
          </p>
          {/* Filter tabs */}
          <div className="flex gap-1 bg-white/5 rounded-lg p-0.5">
            {(['all', 'owned', 'store'] as FilterTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setSkinTab(tab)}
                className={`
                  text-[10px] font-bold px-2.5 py-1 rounded-md transition-all
                  ${skinTab === tab
                    ? 'bg-white/10 text-white'
                    : 'text-slate-500 hover:text-slate-300'
                  }
                `}
              >
                {t.tabs[tab]}
                {tab === 'owned' && ownedPixieIds.length > 0 && (
                  <span className="ml-1 text-blue-400">{ownedPixieIds.length}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {filteredSkins.length === 0 ? (
          <div className="rounded-xl border border-white/5 bg-white/2 px-4 py-6 text-center">
            <p className="text-sm text-slate-500">
              {skinTab === 'owned'
                ? locale === 'it'
                  ? 'Nessuna skin acquistata ancora.'
                  : 'No skins owned yet.'
                : locale === 'it'
                  ? 'Tutte le skin sono già in tuo possesso!'
                  : 'You own all available skins!'}
            </p>
            {skinTab === 'owned' && (
              <Link href="/store" className="mt-2 inline-block text-xs text-purple-400 hover:text-purple-300 font-semibold">
                {t.unlockLink}
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {filteredSkins.map(item => {
              const owned       = ownedIds.includes(item.id)
              const isActive    = activeId === item.id
              const isEquipping = equipping === item.id

              return (
                <div
                  key={item.id}
                  className={`
                    relative rounded-xl border p-3 flex flex-col items-center gap-1.5 text-center
                    transition-all duration-200
                    ${owned
                      ? isActive
                        ? 'border-blue-500/70 bg-blue-500/10 ring-2 ring-offset-1 ring-offset-[#0d0d1a] ring-blue-500'
                        : RARITY_STYLES[item.rarity]
                      : 'border-white/6 bg-white/2'
                    }
                  `}
                >
                  <span className={`text-3xl ${!owned ? 'grayscale opacity-40' : ''}`}>
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
                        onClick={() => handleEquipPixie(item.id as PixieItemId)}
                        disabled={isEquipping}
                        className="text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-500 px-2.5 py-0.5 rounded-md disabled:opacity-50 transition-colors"
                      >
                        {isEquipping ? '…' : t.equip}
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
        )}
      </div>

      {/* ── Frames section ── */}
      {(COSMETICS_BY_CATEGORY.frame ?? []).length > 0 && (
        <div className="mb-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">
            {t.frameSection}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {(COSMETICS_BY_CATEGORY.frame ?? []).map(item => {
              const owned    = ownedIds.includes(item.id)
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
            {(COSMETICS_BY_CATEGORY.glow ?? []).map(item => {
              const owned    = ownedIds.includes(item.id)
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
          <div className="flex flex-wrap gap-2">
            {NAME_COLORS.map(color => {
              const isActive    = nameColor === color.value
              const isEquipping_ = equipping === ('name_color_' + color.value)
              return (
                <button
                  key={color.value}
                  onClick={() => handleEquipNameColor(color.value)}
                  disabled={isEquipping_ || isActive}
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

        {hasAnyPixie ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl border border-blue-500/30 bg-blue-500/10 flex items-center justify-center text-2xl">
                {activeId ? COSMETIC_MAP[activeId as CosmeticItemId]?.emoji ?? '✨' : '✨'}
              </div>
              <div>
                <p className="text-xs text-white font-semibold leading-none">Pixie</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{t.useAsAvatar}</p>
              </div>
            </div>

            <button
              onClick={() => handleToggleAvatar(!usePixieAvatar)}
              disabled={togglingAvatar || !activeId}
              title={!activeId ? t.equipFirst : undefined}
              className={`
                relative flex-shrink-0 w-11 h-6 rounded-full transition-all duration-200
                ${usePixieAvatar ? 'bg-blue-600' : 'bg-slate-700'}
                disabled:opacity-40 disabled:cursor-not-allowed
              `}
            >
              <span className={`
                absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200
                ${usePixieAvatar ? 'left-[22px]' : 'left-0.5'}
              `} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 opacity-50">
            <div className="w-10 h-10 rounded-xl border border-slate-700 bg-slate-800 flex items-center justify-center text-xl">
              🔒
            </div>
            <p className="text-[11px] text-slate-500">
              <Link href="/store" className="underline hover:text-slate-400 text-purple-400">
                {t.buySkinFirst}
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

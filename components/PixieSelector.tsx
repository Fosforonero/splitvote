'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  PIXIE_ITEMS, COSMETICS_BY_CATEGORY, COSMETIC_MAP,
  RARITY_STYLES, NAME_COLORS,
  type CosmeticItemId,
} from '@/lib/cosmetics-store'
import { type PixieItemId } from '@/lib/pixie-store'

interface Props {
  ownedIds: string[]              // all purchased cosmetic IDs
  activePixieId: string | null
  equippedFrame?: string | null
  equippedGlow?: string | null
  nameColor?: string | null       // current name_color value in profile
  usePixieAvatar?: boolean
  onEquip?: (itemId: PixieItemId) => void
}

export default function PixieSelector({
  ownedIds,
  activePixieId: initialActive,
  equippedFrame: initialFrame = null,
  equippedGlow: initialGlow   = null,
  nameColor: initialNameColor = null,
  usePixieAvatar: initialUsePixie = false,
  onEquip,
}: Props) {
  const [activeId, setActiveId]           = useState<string | null>(initialActive)
  const [equippedFrame, setEquippedFrame] = useState<string | null>(initialFrame)
  const [equippedGlow, setEquippedGlow]   = useState<string | null>(initialGlow)
  const [nameColor, setNameColor]         = useState<string | null>(initialNameColor)
  const [equipping, setEquipping]         = useState<string | null>(null)
  const [message, setMessage]             = useState<string | null>(null)
  const [usePixieAvatar, setUsePixie]     = useState(initialUsePixie)
  const [togglingAvatar, setToggling]     = useState(false)

  const hasAnyPixie      = ownedIds.some(id => PIXIE_ITEMS.some(i => i.id === id))
  const ownedFrames      = (COSMETICS_BY_CATEGORY.frame ?? []).filter(i => ownedIds.includes(i.id))
  const ownedGlows       = (COSMETICS_BY_CATEGORY.glow  ?? []).filter(i => ownedIds.includes(i.id))
  const hasNameBundle    = ownedIds.includes('name_color_bundle')

  async function handleEquipPixie(itemId: PixieItemId) {
    setEquipping(itemId)
    setMessage(null)
    try {
      const res = await fetch('/api/profile/equip-pixie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      })
      const data = await res.json()
      if (!res.ok) { setMessage(`Error: ${data.error}`); return }
      setActiveId(itemId)
      setMessage(`✅ ${COSMETIC_MAP[itemId]?.name ?? itemId} equipped!`)
      onEquip?.(itemId)
    } catch {
      setMessage('Network error — try again.')
    } finally {
      setEquipping(null)
    }
  }

  async function handleEquipCosmetic(itemId: CosmeticItemId) {
    setEquipping(itemId)
    setMessage(null)
    try {
      const res = await fetch('/api/profile/equip-cosmetic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      })
      const data = await res.json()
      if (!res.ok) { setMessage(`Error: ${data.error}`); return }
      const item = COSMETIC_MAP[itemId]
      if (item.category === 'frame') setEquippedFrame(itemId)
      if (item.category === 'glow')  setEquippedGlow(itemId)
      setMessage(`✅ ${item.name} equipped!`)
    } catch {
      setMessage('Network error — try again.')
    } finally {
      setEquipping(null)
    }
  }

  async function handleEquipNameColor(colorValue: string) {
    setEquipping('name_color_' + colorValue)
    setMessage(null)
    try {
      const res = await fetch('/api/profile/equip-cosmetic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameColor: colorValue }),
      })
      const data = await res.json()
      if (!res.ok) { setMessage(`Error: ${data.error}`); return }
      setNameColor(colorValue)
      setMessage(`✅ Name color updated!`)
    } catch {
      setMessage('Network error — try again.')
    } finally {
      setEquipping(null)
    }
  }

  async function handleToggleAvatar(enabled: boolean) {
    setToggling(true)
    try {
      const res = await fetch('/api/profile/toggle-pixie-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      })
      const data = await res.json()
      if (!res.ok) { setMessage(`Error: ${data.error}`); return }
      setUsePixie(enabled)
    } catch {
      setMessage('Network error — try again.')
    } finally {
      setToggling(false)
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[#0d0d1a]/60 p-5 mb-8">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-black uppercase tracking-widest text-[var(--muted)]">
          Cosmetici
        </h2>
        <Link
          href="/store"
          className="text-xs text-purple-400 hover:text-purple-300 font-semibold transition-colors"
        >
          + Sblocca cosmetic →
        </Link>
      </div>

      {/* Flash message */}
      {message && (
        <p className="text-xs text-green-400 mb-3">{message}</p>
      )}

      {/* ── Pixie skin grid ── */}
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Pixie skin</p>
      <div className="grid grid-cols-3 gap-2 mb-5">
        {PIXIE_ITEMS.map(item => {
          const owned       = ownedIds.includes(item.id)
          const isActive    = activeId === item.id
          const isEquipping = equipping === item.id
          const rarityStyle = RARITY_STYLES[item.rarity]

          return (
            <div
              key={item.id}
              className={`
                relative rounded-xl border p-3 flex flex-col items-center gap-1.5 text-center
                transition-all duration-200
                ${owned
                  ? isActive
                    ? 'border-blue-500/60 bg-blue-500/10 text-blue-300 ring-2 ring-offset-1 ring-offset-[#0d0d1a] ring-blue-500'
                    : rarityStyle
                  : 'border-slate-800 bg-slate-900/40 opacity-40 grayscale'
                }
              `}
            >
              <span className="text-3xl">{item.emoji}</span>
              <p className="text-[11px] font-bold text-white leading-tight">{item.name}</p>

              {owned ? (
                isActive ? (
                  <span className="text-[10px] text-blue-400 font-semibold">✓ Equipped</span>
                ) : (
                  <button
                    onClick={() => handleEquipPixie(item.id as PixieItemId)}
                    disabled={isEquipping}
                    className="text-[10px] font-semibold text-white bg-blue-600 hover:bg-blue-500 px-2.5 py-0.5 rounded-md disabled:opacity-50 transition-colors"
                  >
                    {isEquipping ? '…' : 'Equip'}
                  </button>
                )
              ) : (
                <span className="text-[10px] text-slate-600">🔒 Locked</span>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Frames section ── */}
      {(COSMETICS_BY_CATEGORY.frame ?? []).length > 0 && (
        <div className="mb-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Frame profilo</p>
          <div className="grid grid-cols-2 gap-2">
            {(COSMETICS_BY_CATEGORY.frame ?? []).map(item => {
              const owned      = ownedIds.includes(item.id)
              const isActive   = equippedFrame === item.id
              const isEquip    = equipping === item.id
              const rarityStyle = RARITY_STYLES[item.rarity]

              return (
                <div
                  key={item.id}
                  className={`
                    rounded-xl border p-3 flex items-center gap-3 transition-all duration-200
                    ${owned
                      ? isActive
                        ? 'border-blue-500/60 bg-blue-500/10 ring-2 ring-offset-1 ring-offset-[#0d0d1a] ring-blue-500'
                        : rarityStyle
                      : 'border-slate-800 bg-slate-900/40 opacity-40 grayscale'
                    }
                  `}
                >
                  <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-white truncate">{item.name}</p>
                    {owned ? (
                      isActive ? (
                        <span className="text-[10px] text-blue-400 font-semibold">✓ Equipped</span>
                      ) : (
                        <button
                          onClick={() => handleEquipCosmetic(item.id as CosmeticItemId)}
                          disabled={isEquip}
                          className="text-[10px] font-semibold text-white bg-blue-600 hover:bg-blue-500 px-2 py-0.5 rounded disabled:opacity-50 transition-colors"
                        >
                          {isEquip ? '…' : 'Equip'}
                        </button>
                      )
                    ) : (
                      <span className="text-[10px] text-slate-600">🔒 Locked</span>
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
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Glow</p>
          <div className="grid grid-cols-3 gap-2">
            {(COSMETICS_BY_CATEGORY.glow ?? []).map(item => {
              const owned      = ownedIds.includes(item.id)
              const isActive   = equippedGlow === item.id
              const isEquip    = equipping === item.id
              const rarityStyle = RARITY_STYLES[item.rarity]

              return (
                <div
                  key={item.id}
                  className={`
                    rounded-xl border p-3 flex flex-col items-center gap-1.5 text-center
                    transition-all duration-200
                    ${owned
                      ? isActive
                        ? 'border-blue-500/60 bg-blue-500/10 ring-2 ring-offset-1 ring-offset-[#0d0d1a] ring-blue-500'
                        : rarityStyle
                      : 'border-slate-800 bg-slate-900/40 opacity-40 grayscale'
                    }
                  `}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <p className="text-[11px] font-bold text-white leading-tight">{item.name}</p>

                  {owned ? (
                    isActive ? (
                      <span className="text-[10px] text-blue-400 font-semibold">✓ Equipped</span>
                    ) : (
                      <button
                        onClick={() => handleEquipCosmetic(item.id as CosmeticItemId)}
                        disabled={isEquip}
                        className="text-[10px] font-semibold text-white bg-blue-600 hover:bg-blue-500 px-2.5 py-0.5 rounded-md disabled:opacity-50 transition-colors"
                      >
                        {isEquip ? '…' : 'Equip'}
                      </button>
                    )
                  ) : (
                    <span className="text-[10px] text-slate-600">🔒 Locked</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Name color section ── */}
      <div className="mb-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Colore nome</p>
        {hasNameBundle ? (
          <div className="flex flex-wrap gap-2">
            {NAME_COLORS.map(color => {
              const isActive   = nameColor === color.value
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
          <div className="flex items-center gap-2.5 opacity-50">
            <span className="text-xl">🎨</span>
            <p className="text-[11px] text-slate-500">
              <Link href="/store" className="underline hover:text-slate-300">Acquista il Name Color Bundle</Link> per sbloccare tutti i colori
            </p>
          </div>
        )}
      </div>

      {/* ── Foto profilo section ── */}
      <div className="border-t border-white/5 pt-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">Foto profilo</p>

        {hasAnyPixie ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl border border-blue-500/30 bg-blue-500/10 flex items-center justify-center text-2xl">
                {activeId ? COSMETIC_MAP[activeId as CosmeticItemId]?.emoji ?? '✨' : '✨'}
              </div>
              <div>
                <p className="text-xs text-white font-semibold leading-none">Il mio Pixie</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Usa la skin come avatar pubblico</p>
              </div>
            </div>

            <button
              onClick={() => handleToggleAvatar(!usePixieAvatar)}
              disabled={togglingAvatar || !activeId}
              className={`
                relative flex-shrink-0 w-11 h-6 rounded-full transition-all duration-200
                ${usePixieAvatar ? 'bg-blue-600' : 'bg-slate-700'}
                disabled:opacity-40 disabled:cursor-not-allowed
              `}
              title={!activeId ? 'Equip a skin first' : undefined}
            >
              <span
                className={`
                  absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200
                  ${usePixieAvatar ? 'left-[22px]' : 'left-0.5'}
                `}
              />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 opacity-50">
            <div className="w-10 h-10 rounded-xl border border-slate-700 bg-slate-800 flex items-center justify-center text-xl">
              🔒
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold leading-none">Il mio Pixie</p>
              <p className="text-[10px] text-slate-600 mt-0.5">
                <Link href="/store" className="underline hover:text-slate-400">Acquista una skin</Link> per abilitare
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  COSMETIC_ITEMS, COSMETIC_MAP, COSMETICS_BY_CATEGORY,
  RARITY_STYLES, RARITY_GLOW,
  type CosmeticItem, type CosmeticCategory, type CosmeticItemId,
} from '@/lib/cosmetics-store'

interface Props {
  items: CosmeticItem[]
  ownedIds: string[]
}

const CATEGORY_TABS: { key: CosmeticCategory; label: string; emoji: string }[] = [
  { key: 'pixie',      label: 'Pixie Skins',   emoji: '✨' },
  { key: 'frame',      label: 'Frames',         emoji: '🖼️' },
  { key: 'glow',       label: 'Glows',          emoji: '💫' },
  { key: 'name_color', label: 'Name Colors',    emoji: '🎨' },
]

export default function StoreClient({ items: _items, ownedIds: initialOwned }: Props) {
  const router  = useRouter()
  const params  = useSearchParams()

  const [ownedIds, setOwnedIds]   = useState<string[]>(initialOwned)
  const [loading, setLoading]     = useState<string | null>(null)
  const [message, setMessage]     = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [activeTab, setActiveTab] = useState<CosmeticCategory>('pixie')

  // Handle redirect from Stripe — show message then clean URL
  useEffect(() => {
    const purchased = params.get('purchased')
    const cancelled = params.get('payment')

    if (purchased && purchased in COSMETIC_MAP) {
      const item = COSMETIC_MAP[purchased as CosmeticItemId]
      setMessage({ type: 'success', text: `✅ ${item.name} unlocked! Head to Dashboard to equip it.` })
      if (!ownedIds.includes(purchased)) {
        setOwnedIds(prev => [...prev, purchased])
      }
      // Switch to the tab of the purchased item
      setActiveTab(item.category)
      // Clear URL params
      setTimeout(() => router.replace('/store'), 250)
    } else if (cancelled === 'cancelled') {
      setMessage({ type: 'error', text: 'Payment cancelled.' })
      setTimeout(() => router.replace('/store'), 250)
    }
  }, [params]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleBuy(item: CosmeticItem) {
    setLoading(item.id)
    setMessage(null)
    try {
      const res = await fetch('/api/stripe/store-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error ?? 'Could not start payment' })
        return
      }
      window.location.href = data.url
    } catch {
      setMessage({ type: 'error', text: 'Network error — try again.' })
    } finally {
      setLoading(null)
    }
  }

  const tabItems = COSMETICS_BY_CATEGORY[activeTab] ?? []

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white px-4 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
            🛒 Cosmetics Store
          </h1>
          <p className="text-slate-400 text-sm">
            Unlock exclusive cosmetics. Each purchase grants bonus XP.
          </p>
        </div>

        {/* Flash message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl border text-sm text-center ${
            message.type === 'success'
              ? 'border-green-500/40 bg-green-500/10 text-green-300'
              : 'border-red-500/40 bg-red-500/10 text-red-300'
          }`}>
            {message.text}
          </div>
        )}

        {/* Category tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {CATEGORY_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold
                border transition-all duration-150
                ${activeTab === tab.key
                  ? 'border-purple-500/60 bg-purple-500/15 text-purple-300'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                }
              `}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
              {/* Owned count badge */}
              {(() => {
                const count = (COSMETICS_BY_CATEGORY[tab.key] ?? [])
                  .filter(i => ownedIds.includes(i.id)).length
                return count > 0 ? (
                  <span className="ml-1 bg-green-500/20 text-green-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-green-500/30">
                    {count}
                  </span>
                ) : null
              })()}
            </button>
          ))}
        </div>

        {/* Item grid */}
        <div className={`grid gap-5 ${
          activeTab === 'name_color'
            ? 'grid-cols-1 sm:grid-cols-2'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}>
          {tabItems.map(item => {
            const owned      = ownedIds.includes(item.id)
            const isLoading  = loading === item.id
            const rarityStyle = RARITY_STYLES[item.rarity]
            const glowStyle   = RARITY_GLOW[item.rarity]

            return (
              <div
                key={item.id}
                className={`
                  relative rounded-2xl border p-5 flex flex-col gap-3
                  transition-all duration-200 hover:shadow-lg
                  ${rarityStyle} ${glowStyle}
                  ${owned ? 'opacity-80' : ''}
                `}
              >
                {/* Rarity badge */}
                <div className="absolute top-3 right-3">
                  <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border ${rarityStyle}`}>
                    {item.rarity}
                  </span>
                </div>

                {/* Emoji + name */}
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{item.emoji}</span>
                  <div>
                    <h2 className="font-bold text-white text-base leading-tight">{item.name}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">+{item.xpBonus} XP</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-300 text-sm leading-relaxed flex-1">{item.description}</p>

                {/* Frame/Glow CSS preview */}
                {item.cssClass && (
                  <div className={`h-6 rounded-lg border ${item.cssClass} opacity-60`} />
                )}

                {/* Name color preview */}
                {item.category === 'name_color' && (
                  <div className="flex flex-wrap gap-1.5">
                    {['white','blue','purple','green','gold','pink','red','gradient'].map(c => (
                      <span
                        key={c}
                        className={`text-xs font-bold px-2 py-0.5 rounded-md bg-white/5 ${
                          c === 'white'    ? 'text-white'      :
                          c === 'blue'     ? 'text-blue-400'   :
                          c === 'purple'   ? 'text-purple-400' :
                          c === 'green'    ? 'text-emerald-400':
                          c === 'gold'     ? 'text-yellow-400' :
                          c === 'pink'     ? 'text-pink-400'   :
                          c === 'red'      ? 'text-red-400'    :
                          'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
                        }`}
                      >
                        Aa
                      </span>
                    ))}
                  </div>
                )}

                {/* Price + CTA */}
                <div className="flex items-center justify-between mt-1">
                  <span className="text-lg font-bold text-white">{item.priceDisplay}</span>

                  {owned ? (
                    <span className="text-xs font-semibold text-green-400 border border-green-500/40 bg-green-500/10 px-3 py-1.5 rounded-lg">
                      ✓ Owned
                    </span>
                  ) : (
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={isLoading}
                      className={`
                        px-4 py-1.5 rounded-lg text-sm font-semibold transition-all
                        ${item.rarity === 'legendary'
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black'
                          : item.rarity === 'epic'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white'
                            : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white'
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                    >
                      {isLoading ? 'Redirecting…' : 'Buy Now'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-600 mt-10">
          Purchases are one-time. Secure checkout via Stripe. All prices include VAT.
        </p>
      </div>
    </main>
  )
}

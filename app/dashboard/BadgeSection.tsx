'use client'

import { useState } from 'react'
import { RARITY_STYLES } from '@/lib/rarity'

interface Badge {
  badge_id: string
  earned_at: string
  is_equipped: boolean
  badges: {
    name: string
    emoji: string
    rarity: string
    description: string
  }
}


const EQUIP_RING: Record<string, string> = {
  common:    'ring-slate-400',
  rare:      'ring-blue-400',
  epic:      'ring-purple-400',
  legendary: 'ring-yellow-400',
}

export default function BadgeSection({ initialBadges }: { initialBadges: Badge[] }) {
  const [badges, setBadges] = useState<Badge[]>(initialBadges)
  const [loading, setLoading] = useState<string | null>(null)

  async function toggleEquip(badgeId: string, currentlyEquipped: boolean) {
    setLoading(badgeId)
    try {
      const res = await fetch('/api/badges/equip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ badgeId, equip: !currentlyEquipped }),
      })
      if (!res.ok) throw new Error('Failed')

      // Update local state optimistically
      setBadges(prev => prev.map(b => ({
        ...b,
        is_equipped: !currentlyEquipped
          ? b.badge_id === badgeId  // equipping: only this one is equipped
          : false,                   // unequipping: none equipped
      })))
    } catch {
      // revert on failure — just reload badges state (no-op, user sees retry)
    } finally {
      setLoading(null)
    }
  }

  const equippedBadge = badges.find(b => b.is_equipped)

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-black text-white">🏆 Your Badges</h2>
        {equippedBadge && (
          <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
            <span>Equipped:</span>
            <span className="text-white font-semibold">
              {equippedBadge.badges.emoji} {equippedBadge.badges.name}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {badges.map(b => {
          const isEquipped = b.is_equipped
          const rarityStyle = RARITY_STYLES[b.badges.rarity] ?? RARITY_STYLES.common
          const ringStyle = EQUIP_RING[b.badges.rarity] ?? EQUIP_RING.common
          return (
            <div
              key={b.badge_id}
              className={`rounded-2xl border p-4 flex items-center gap-3 transition-all
                ${rarityStyle}
                ${isEquipped ? `ring-2 ${ringStyle}` : ''}
              `}
            >
              <span className="text-3xl flex-shrink-0">{b.badges.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-white">{b.badges.name}</p>
                <p className="text-xs opacity-70 truncate">{b.badges.description}</p>
                <p className="text-xs opacity-50 mt-0.5 capitalize">{b.badges.rarity}</p>
              </div>
              <button
                onClick={() => toggleEquip(b.badge_id, isEquipped)}
                disabled={loading === b.badge_id}
                className={`flex-shrink-0 text-xs font-bold px-2.5 py-1.5 rounded-lg border transition-colors
                  ${isEquipped
                    ? 'bg-white/15 border-white/30 text-white hover:bg-white/10'
                    : 'bg-white/5 border-white/10 text-[var(--muted)] hover:bg-white/10 hover:text-white'
                  }
                  ${loading === b.badge_id ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
                `}
              >
                {loading === b.badge_id ? '…' : isEquipped ? '✓ Equipped' : 'Equip'}
              </button>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-[var(--muted)] mt-3 text-center">
        Collect more badges by voting on dilemmas — some are rare 👀
      </p>
    </div>
  )
}

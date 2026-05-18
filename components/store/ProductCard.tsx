'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { COMPANION_MAP } from '@/lib/companion'
import PixieSprite from '../PixieSprite'
import type { ProductDef } from '@/lib/purchases'

interface Props {
  product: ProductDef
  owned: boolean
  /** True if this is the currently equipped Pixie (shows "✓ Equipped" state). */
  isEquipped?: boolean
  /** Called when the user clicks Equip on an owned Pixie card. */
  onEquip?: () => void
  /** True while any equip request is in flight (disables all equip buttons). */
  equipLoading?: boolean
  /** True if user is logged in. Drives login redirect vs checkout call. */
  isLoggedIn: boolean
  /** Optional — for Pixie cards, show "💎 Included with Premium" hint if user has active sub. */
  isPremium?: boolean
  locale: 'en' | 'it'
}

const COPY = {
  en: {
    owned: '✓ Owned',
    equip: 'Equip',
    equipped: '✓ Equipped',
    buy: 'Buy now',
    loading: 'Loading…',
    loginRequired: 'Log in to buy',
    comingSoon: 'Coming soon',
    error: 'Something went wrong. Try again?',
    notConfigured: 'Checkout coming online soon — sit tight.',
    pixieIncludedPremium: 'Even with Premium, this Pixie is a one-time unlock.',
    rarity: { common: 'common', rare: 'rare', epic: 'epic', legendary: 'legendary' },
  },
  it: {
    owned: '✓ Acquistato',
    equip: 'Equipaggia',
    equipped: '✓ Equipaggiato',
    buy: 'Acquista',
    loading: 'Caricamento…',
    loginRequired: 'Accedi per acquistare',
    comingSoon: 'In arrivo',
    error: 'Qualcosa è andato storto. Riprovi?',
    notConfigured: 'Checkout in arrivo a breve — un attimo di pazienza.',
    pixieIncludedPremium: 'Anche con Premium, questo Pixie è uno sblocco singolo.',
    rarity: { common: 'comune', rare: 'raro', epic: 'epico', legendary: 'leggendario' },
  },
} as const

function formatPrice(cents: number, locale: 'en' | 'it'): string {
  const eur = (cents / 100).toFixed(2)
  return locale === 'it' ? `€${eur.replace('.', ',')}` : `€${eur}`
}

export default function ProductCard({
  product, owned, isEquipped = false, onEquip, equipLoading = false,
  isLoggedIn, isPremium = false, locale,
}: Props) {
  const copy = COPY[locale]
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showStub, setShowStub] = useState(false)

  const speciesDef = product.unlocksSpecies ? COMPANION_MAP[product.unlocksSpecies] : null
  const isPixie = product.type === 'pixie'
  const isComingSoon = !!product.comingSoon

  async function handleBuy() {
    if (!isLoggedIn) {
      router.push(locale === 'it' ? '/it/login?next=/it/store' : '/login?next=/store')
      return
    }
    if (isComingSoon) return
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/checkout/one-time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, locale }),
      })
      const data: { url?: string; comingSoon?: boolean; error?: string } = await res.json()
      if (data.url) {
        window.location.assign(data.url)
        return
      }
      if (data.comingSoon || res.status === 501) {
        setShowStub(true)
        return
      }
      setError(data.error ?? copy.error)
    } catch {
      setError(copy.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`group relative flex flex-col rounded-2xl border bg-[#0d0d1a]/70 p-4 transition-all hover:bg-[#0a0a1a]/80 ${
      isEquipped
        ? 'border-blue-500/50 shadow-[0_0_20px_rgba(77,159,255,0.15)]'
        : 'border-[var(--border)] hover:border-blue-500/30'
    }`}>

      {/* Owned ribbon */}
      {owned && !isEquipped && (
        <div className="absolute -top-2 -right-2 z-10 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-500/30">
          {copy.owned}
        </div>
      )}
      {isEquipped && (
        <div className="absolute -top-2 -right-2 z-10 rounded-full bg-blue-500 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/30">
          {copy.equipped}
        </div>
      )}

      {/* Preview area */}
      <div className="relative mx-auto mb-4 flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br from-[#0a0a1a] to-[#15151f]">
        {product.unlocksSpecies ? (
          <PixieSprite
            species={product.unlocksSpecies}
            stage={3}
            alt={product.name}
            className="h-full w-full"
            pixelSize={256}
            showFrame={false}
          />
        ) : (
          <span className="text-5xl opacity-60">
            {product.type === 'frame' ? '🖼️' : product.type === 'glow' ? '✨' : product.type === 'name_color' ? '🎨' : '🎁'}
          </span>
        )}

        {/* Coming soon overlay */}
        {isComingSoon && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/90">
              {copy.comingSoon}
            </span>
          </div>
        )}
      </div>

      {/* Title row */}
      <div className="mb-1 flex items-center gap-2 flex-wrap">
        <h3 className="text-sm font-black text-white">{product.name}</h3>
        {speciesDef && (
          <span className="text-[9px] font-bold uppercase tracking-widest text-yellow-300 border border-yellow-500/40 bg-yellow-500/10 rounded-md px-1.5 py-0.5">
            {copy.rarity[speciesDef.rarity]}
          </span>
        )}
      </div>

      {/* Tagline */}
      <p className="mb-4 text-xs leading-snug text-[var(--muted)]">{product.tagline}</p>

      {/* Footer: price + CTA */}
      <div className="mt-auto flex items-center justify-between gap-2">
        <span className="text-lg font-black text-white">{formatPrice(product.priceCents, locale)}</span>

        {owned && isPixie ? (
          // Owned Pixie: show Equip / Equipped button
          isEquipped ? (
            <span className="text-xs font-bold text-blue-400">{copy.equipped}</span>
          ) : (
            <button
              type="button"
              onClick={onEquip}
              disabled={equipLoading}
              className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-xs font-black uppercase tracking-wide text-white shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/40 hover:scale-105 disabled:opacity-50 disabled:cursor-wait"
            >
              {equipLoading ? copy.loading : copy.equip}
            </button>
          )
        ) : owned ? (
          // Owned non-Pixie cosmetic
          <span className="text-xs font-bold text-emerald-400">{copy.owned}</span>
        ) : isComingSoon ? (
          <span className="text-xs font-bold text-white/40">{copy.comingSoon}</span>
        ) : !isLoggedIn ? (
          <button
            type="button"
            onClick={handleBuy}
            className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-white/20"
          >
            {copy.loginRequired}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleBuy}
            disabled={loading}
            className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-xs font-black uppercase tracking-wide text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/40 hover:scale-105 disabled:opacity-50 disabled:cursor-wait"
          >
            {loading ? copy.loading : copy.buy}
          </button>
        )}
      </div>

      {/* Premium hint for Pixie market */}
      {speciesDef && isPremium && !owned && (
        <p className="mt-2 text-[10px] leading-tight text-amber-300/80">
          {copy.pixieIncludedPremium}
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="mt-2 text-[11px] text-red-400">{error}</p>
      )}

      {/* Stub modal */}
      {showStub && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-black/70 backdrop-blur-sm p-4">
          <div className="text-center">
            <div className="text-3xl mb-2">🔧</div>
            <p className="text-xs font-bold text-white/90 leading-tight mb-3">{copy.notConfigured}</p>
            <button
              type="button"
              onClick={() => setShowStub(false)}
              className="rounded-full bg-white/10 hover:bg-white/20 px-3 py-1.5 text-[10px] font-bold text-white transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

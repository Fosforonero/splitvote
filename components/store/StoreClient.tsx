'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PRODUCT_CATALOG, type ProductId } from '@/lib/purchases'
import ProductCard from './ProductCard'

type Tab = 'premium' | 'pixies' | 'cosmetics'

interface Props {
  isLoggedIn: boolean
  isPremium: boolean
  ownedProductIds: ProductId[]
  locale: 'en' | 'it'
  /** Optional deep-link to a specific tab (?tab=pixies). */
  initialTab?: Tab
}

const COPY = {
  en: {
    heroEyebrow: '🛒 SplitVote Store',
    heroTitle: 'Unlock your',
    heroTitleAccent: 'collection',
    heroSubtitle: 'Premium subscription, exclusive Pixies, and cosmetics to make your profile yours.',
    tabs: { premium: '💎 Premium', pixies: '🐣 Pixies', cosmetics: '🎨 Cosmetics' },
    premium: {
      eyebrow: 'Monthly subscription',
      title: 'SplitVote Premium',
      tagline: 'Unlock 7 exclusive Pixies, hide ads, support the project.',
      perks: [
        '7 Premium Pixies (Heart, Bot, Ember, Brew, Aura, Luna, Gloom)',
        'No ads, ever',
        'Unlimited name changes',
        'Premium badge on your profile',
      ],
      price: '€4.99',
      perMonth: '/month',
      cta: 'Go Premium',
      ctaActive: '✓ You\'re Premium',
      ctaLogin: 'Log in to subscribe',
    },
    pixies: {
      title: 'Pixie Market',
      sub: 'Six legendary Pixies, each unlocked with a one-time purchase. Yours forever, no subscription needed.',
      premiumHint: 'Already a Premium subscriber? These are extra — sold separately.',
    },
    cosmetics: {
      title: 'Cosmetics',
      sub: 'Frames, glows, name colors. Make your profile pop.',
      empty: 'Cosmetics drop in the next update — stay tuned.',
    },
    backToDashboard: '← Back to dashboard',
  },
  it: {
    heroEyebrow: '🛒 Store SplitVote',
    heroTitle: 'Sblocca la tua',
    heroTitleAccent: 'collezione',
    heroSubtitle: 'Abbonamento Premium, Pixie esclusivi e cosmetici per personalizzare il tuo profilo.',
    tabs: { premium: '💎 Premium', pixies: '🐣 Pixie', cosmetics: '🎨 Cosmetici' },
    premium: {
      eyebrow: 'Abbonamento mensile',
      title: 'SplitVote Premium',
      tagline: 'Sblocca 7 Pixie esclusivi, niente pubblicità, supporta il progetto.',
      perks: [
        '7 Pixie Premium (Heart, Bot, Ember, Brew, Aura, Luna, Gloom)',
        'Niente pubblicità, mai',
        'Cambio nome illimitato',
        'Badge Premium sul profilo',
      ],
      price: '€4,99',
      perMonth: '/mese',
      cta: 'Diventa Premium',
      ctaActive: '✓ Sei Premium',
      ctaLogin: 'Accedi per abbonarti',
    },
    pixies: {
      title: 'Pixie Market',
      sub: 'Sei Pixie leggendari, ciascuno con un acquisto singolo. Tuoi per sempre, senza abbonamento.',
      premiumHint: 'Sei già abbonato Premium? Questi sono extra — venduti separatamente.',
    },
    cosmetics: {
      title: 'Cosmetici',
      sub: 'Cornici, glow, colori del nome. Rendi il tuo profilo unico.',
      empty: 'I cosmetici arrivano nel prossimo update — resta connesso.',
    },
    backToDashboard: '← Torna alla dashboard',
  },
} as const

export default function StoreClient({ isLoggedIn, isPremium, ownedProductIds, locale, initialTab = 'pixies' }: Props) {
  const copy = COPY[locale]
  const [tab, setTab] = useState<Tab>(initialTab)
  const [premiumLoading, setPremiumLoading] = useState(false)
  const [premiumError, setPremiumError] = useState<string | null>(null)
  const ownedSet = new Set(ownedProductIds)

  const pixieProducts = PRODUCT_CATALOG.filter(p => p.type === 'pixie')
  const cosmeticProducts = PRODUCT_CATALOG.filter(p => p.type !== 'pixie')

  async function handlePremiumCheckout() {
    if (!isLoggedIn) {
      window.location.assign(locale === 'it' ? '/it/login?next=/it/store' : '/login?next=/store')
      return
    }
    setPremiumError(null)
    setPremiumLoading(true)
    try {
      const res = await fetch('/api/stripe/subscription', { method: 'POST' })
      const data: { url?: string; error?: string } = await res.json()
      if (data.url) {
        window.location.assign(data.url)
        return
      }
      setPremiumError(data.error ?? (locale === 'it' ? 'Errore. Riprovi?' : 'Something went wrong.'))
    } catch {
      setPremiumError(locale === 'it' ? 'Errore di rete.' : 'Network error.')
    } finally {
      setPremiumLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">

      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-block rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-purple-300 mb-6">
          {copy.heroEyebrow}
        </div>
        <h1 className="mb-4 text-4xl md:text-6xl font-black tracking-tight">
          {copy.heroTitle}{' '}
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            {copy.heroTitleAccent}
          </span>
        </h1>
        <p className="mx-auto max-w-xl text-base text-[var(--muted)]">{copy.heroSubtitle}</p>
      </div>

      {/* Sticky tabs */}
      <div className="sticky top-2 z-20 mb-8 -mx-2 px-2">
        <div className="mx-auto flex max-w-md gap-1 rounded-full border border-[var(--border)] bg-[#0a0a1a]/90 p-1 backdrop-blur-md">
          {(['premium', 'pixies', 'cosmetics'] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              aria-pressed={tab === t}
              className={`flex-1 rounded-full px-3 py-2 text-xs font-black uppercase tracking-widest transition-all ${
                tab === t
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md shadow-blue-500/30'
                  : 'text-[var(--muted)] hover:text-white hover:bg-white/5'
              }`}
            >
              {copy.tabs[t]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Premium tab ────────────────────────────────────────────── */}
      {tab === 'premium' && (
        <section className="rounded-3xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 via-amber-500/5 to-orange-500/5 p-6 sm:p-10">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-yellow-300 mb-3">{copy.premium.eyebrow}</p>
            <h2 className="text-3xl sm:text-4xl font-black mb-3">{copy.premium.title}</h2>
            <p className="text-[var(--muted)] max-w-md mx-auto mb-8">{copy.premium.tagline}</p>

            {/* Perks */}
            <ul className="mx-auto max-w-md text-left space-y-2 mb-8">
              {copy.premium.perks.map(perk => (
                <li key={perk} className="flex items-start gap-3 text-sm text-white/90">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black">✓</span>
                  <span>{perk}</span>
                </li>
              ))}
            </ul>

            {/* Price + CTA */}
            <div className="flex items-baseline justify-center gap-1 mb-6">
              <span className="text-5xl font-black bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                {copy.premium.price}
              </span>
              <span className="text-sm text-[var(--muted)]">{copy.premium.perMonth}</span>
            </div>

            {isPremium ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-5 py-2.5 text-sm font-black text-emerald-300">
                {copy.premium.ctaActive}
              </div>
            ) : (
              <button
                type="button"
                onClick={handlePremiumCheckout}
                disabled={premiumLoading}
                className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 px-8 py-3 text-sm font-black uppercase tracking-widest text-black shadow-lg shadow-yellow-500/30 transition-all hover:scale-105 hover:shadow-yellow-500/50 disabled:opacity-60 disabled:cursor-wait"
              >
                {premiumLoading
                  ? (locale === 'it' ? 'Caricamento…' : 'Loading…')
                  : (isLoggedIn ? copy.premium.cta : copy.premium.ctaLogin)}
              </button>
            )}
            {premiumError && (
              <p className="mt-4 text-sm text-red-400">{premiumError}</p>
            )}
          </div>
        </section>
      )}

      {/* ── Pixies tab ─────────────────────────────────────────────── */}
      {tab === 'pixies' && (
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-black mb-2">{copy.pixies.title}</h2>
            <p className="text-sm text-[var(--muted)]">{copy.pixies.sub}</p>
            {isPremium && (
              <p className="mt-3 inline-block rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-[11px] font-bold text-amber-300">
                {copy.pixies.premiumHint}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pixieProducts.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                owned={ownedSet.has(p.id)}
                isLoggedIn={isLoggedIn}
                isPremium={isPremium}
                locale={locale}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Cosmetics tab ──────────────────────────────────────────── */}
      {tab === 'cosmetics' && (
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-black mb-2">{copy.cosmetics.title}</h2>
            <p className="text-sm text-[var(--muted)]">{copy.cosmetics.sub}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cosmeticProducts.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                owned={ownedSet.has(p.id)}
                isLoggedIn={isLoggedIn}
                isPremium={isPremium}
                locale={locale}
              />
            ))}
          </div>
        </section>
      )}

      {/* Back to dashboard */}
      <div className="mt-12 text-center">
        <Link
          href={isLoggedIn ? (locale === 'it' ? '/it/dashboard' : '/dashboard') : (locale === 'it' ? '/it' : '/')}
          className="text-sm text-[var(--muted)] hover:text-white transition-colors"
        >
          {copy.backToDashboard}
        </Link>
      </div>
    </div>
  )
}

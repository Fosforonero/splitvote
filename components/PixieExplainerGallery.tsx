'use client'

import { useState } from 'react'
import { COMPANIONS, RARITY_STYLES, type CompanionDef } from '@/lib/companion'
import { getPixieImagePath } from '@/lib/pixie'
import dynamic from 'next/dynamic'

// Code-split: ~28KB modal only loads when the user taps a card
const PixieDetailModal = dynamic(() => import('./PixieDetailModal'), { ssr: false })

interface Props {
  locale?: 'en' | 'it'
}

const IT_UNLOCK: Record<string, string> = {
  // Free — voti / streak
  spark:     'Sempre disponibile',
  blip:      'Sempre disponibile',
  momo:      'Sblocca con 50 voti',
  shade:     'Sblocca con 7 giorni di streak',
  banana:    'Sblocca con 100 voti',
  leaf:      'Sblocca con 200 voti',
  orbit:     'Sblocca con 300 voti',
  ice:       'Sblocca con 500 voti',
  // Premium — abbonamento
  heart:     '💎 Incluso con Premium',
  robot:     '💎 Incluso con Premium',
  fuoco:     '💎 Incluso con Premium',
  caffe:     '💎 Incluso con Premium',
  hologram:  '💎 Incluso con Premium',
  moonlight: '💎 Incluso con Premium',
  triste:    '💎 Incluso con Premium',
  // Market — acquisto singolo
  crown:     '🛒 Pixie Market — €3,99',
  diamond:   '🛒 Pixie Market — €3,99',
  galaxy:    '🛒 Pixie Market — €3,99',
  angel:     '🛒 Pixie Market — €3,99',
  devil:     '🛒 Pixie Market — €3,99',
  scintille: '🛒 Pixie Market — €4,99',
}

const EN_UNLOCK: Record<string, string> = {
  // Free — votes / streak
  spark:     'Always available',
  blip:      'Always available',
  momo:      'Unlocks at 50 votes',
  shade:     'Unlocks at 7-day streak',
  banana:    'Unlocks at 100 votes',
  leaf:      'Unlocks at 200 votes',
  orbit:     'Unlocks at 300 votes',
  ice:       'Unlocks at 500 votes',
  // Premium — subscription
  heart:     '💎 Included with Premium',
  robot:     '💎 Included with Premium',
  fuoco:     '💎 Included with Premium',
  caffe:     '💎 Included with Premium',
  hologram:  '💎 Included with Premium',
  moonlight: '💎 Included with Premium',
  triste:    '💎 Included with Premium',
  // Market — one-time purchase
  crown:     '🛒 Pixie Market — €3.99',
  diamond:   '🛒 Pixie Market — €3.99',
  galaxy:    '🛒 Pixie Market — €3.99',
  angel:     '🛒 Pixie Market — €3.99',
  devil:     '🛒 Pixie Market — €3.99',
  scintille: '🛒 Pixie Market — €4.99',
}

/** Italian translations for each species description (source of truth: lib/companion.ts). */
const IT_DESCRIPTIONS: Record<string, string> = {
  spark:     'Un curioso essere di energia che ama le scelte audaci.',
  blip:      'Una creatura digitale glitchata che si nutre di dati e dilemmi.',
  momo:      'Uno spirito allegro della foresta che soppesa ogni decisione con cura.',
  shade:     "Un'entità lunare misteriosa che prospera nell'ambiguità morale.",
  orbit:     "Un viaggiatore cosmico che ha visto ogni dilemma dell'universo.",
  heart:     'Una creatura calda ed empatica che sente ogni dilemma nel profondo.',
  robot:     'Una macchina logica che calcola il risultato morale ottimale.',
  crown:     "Uno spirito regale che affronta ogni dilemma con saggezza e autorità.",
  diamond:   "Un'entità cristallina di rara chiarezza che vede la verità morale con precisione.",
  galaxy:    "Un'entità cosmica che porta interi sistemi stellari al suo passaggio.",
  angel:     'Un essere celeste di pura luce morale che cerca sempre la via più alta.',
  devil:     "Uno spirito caotico che prospera nell'ambiguità morale e mette alla prova ogni limite.",
  fuoco:     'Uno spirito di fuoco che brucia più forte davanti alle scelte impossibili.',
  banana:    'Un compagno allegro e solare che trova gioia anche nei dilemmi più difficili.',
  caffe:     'Uno spirito brillante e caffeinnato che pensa più veloce di chiunque — anche prima del primo caffè.',
  hologram:  'Un\'entità digitale scintillante la cui forma cambia con ogni posizione morale.',
  ice:       'Una creatura fredda e calcolatrice che non perde mai la calma sotto pressione morale.',
  leaf:      'Un gentile spirito della natura che sboccia con ogni voto coraggioso.',
  moonlight: 'Uno spirito lunare sereno che illumina i dilemmi morali più oscuri.',
  scintille: 'Uno spirito esplosivo di scintille che fa sembrare ogni scelta una supernova.',
  triste:    "Un'anima malinconica che trova significato profondo nelle domande più difficili della vita.",
}

/** Italian rarity labels. */
const IT_RARITY: Record<string, string> = {
  common:    'comune',
  rare:      'raro',
  epic:      'epico',
  legendary: 'leggendario',
}

/**
 * Public explainer gallery. Stages 1-3 visible, 4-6 hidden as mystery cards.
 * Excludes admin-only species. Tapping a card opens a preview-only PixieDetailModal.
 */
export default function PixieExplainerGallery({ locale = 'en' }: Props) {
  const IT = locale === 'it'
  const species = COMPANIONS.filter(c => c.access !== 'admin')
  const [modalSpecies, setModalSpecies] = useState<CompanionDef | null>(null)

  return (
    <>
    <div className="space-y-4">
      {species.map(c => {
        const rarityBadge = RARITY_STYLES[c.rarity] ?? RARITY_STYLES.common
        const unlockHint = IT ? IT_UNLOCK[c.id] : EN_UNLOCK[c.id]
        const description = IT ? (IT_DESCRIPTIONS[c.id] ?? c.description) : c.description
        const rarityLabel = IT ? (IT_RARITY[c.rarity] ?? c.rarity) : c.rarity
        const isPremium = c.access === 'premium'
        const isMarket = c.access === 'market'

        return (
          <button
            key={c.id}
            type="button"
            onClick={() => setModalSpecies(c)}
            aria-label={IT ? `Anteprima ${c.name}` : `Preview ${c.name}`}
            className="w-full text-left rounded-2xl border border-[var(--border)] bg-[#0d0d1a]/60 p-4 sm:p-5 cursor-pointer hover:border-blue-500/30 hover:bg-[#0a0a1a]/70 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-black text-white">
                    {c.name.replace('Pixie ', '')}
                  </h3>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${rarityBadge}`}>
                    {rarityLabel}
                  </span>
                  {isPremium && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-yellow-500/40 bg-yellow-500/10 text-yellow-300">
                      💎 premium
                    </span>
                  )}
                  {isMarket && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-300">
                      🛒 market
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">
                  {description}
                </p>
                <p className="text-[11px] text-white/40 mt-1.5">{unlockHint}</p>
              </div>
              <span className="text-[10px] text-blue-400/70 font-bold whitespace-nowrap mt-0.5 flex-shrink-0">
                {IT ? 'Anteprima →' : 'Preview →'}
              </span>
            </div>

            {/* Evolution strip: stages 1-3 visible, 4-6 mystery */}
            <div className="grid grid-cols-6 gap-1.5 sm:gap-2 mt-3">
              {[1, 2, 3, 4, 5, 6].map(stage => {
                const visible = stage <= 3
                return (
                  <div key={stage} className="flex flex-col items-center gap-1">
                    <div
                      className={`relative w-full aspect-square rounded-xl border flex items-center justify-center overflow-hidden ${
                        visible
                          ? 'border-[var(--border)] bg-[#0a0a1a]/60'
                          : 'border-white/5 bg-gradient-to-br from-purple-900/20 to-blue-900/20'
                      }`}
                    >
                      {visible ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={getPixieImagePath(c.id, stage)}
                          alt={`${c.name} stage ${stage}`}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-2xl sm:text-3xl text-white/30 font-black">?</span>
                      )}
                      {/* Stage badge */}
                      <div className="absolute bottom-0.5 right-0.5 px-1 min-w-[14px] h-[14px] rounded-full bg-[#0d0d1a] border border-[var(--border)] flex items-center justify-center">
                        <span className="text-[8px] font-black text-white leading-none">{stage}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="text-[10px] text-white/30 text-center mt-2 italic">
              {IT
                ? 'Le ultime 3 evoluzioni si rivelano votando.'
                : 'The last 3 evolutions reveal as you vote.'}
            </p>
          </button>
        )
      })}
    </div>

    {/* Preview modal */}
    {modalSpecies && (
      <PixieDetailModal
        companion={modalSpecies}
        stage={1}
        isCurrentSpecies={false}
        isUnlocked={false}
        unlockHint={IT ? (IT_UNLOCK[modalSpecies.id] ?? '') : (EN_UNLOCK[modalSpecies.id] ?? '')}
        pixieXp={{}}
        votesCount={0}
        locale={locale}
        saving={false}
        error={null}
        previewOnly
        descriptionOverride={IT ? (IT_DESCRIPTIONS[modalSpecies.id] ?? undefined) : undefined}
        onEquip={() => {}}
        onClose={() => setModalSpecies(null)}
      />
    )}
    </>
  )
}

import { COMPANIONS, RARITY_STYLES } from '@/lib/companion'
import { getPixieImagePath } from '@/lib/pixie'

interface Props {
  locale?: 'en' | 'it'
}

const IT_UNLOCK: Record<string, string> = {
  spark:   'Sempre disponibile',
  blip:    'Sempre disponibile',
  momo:    'Sblocca con 10 voti',
  shade:   'Sblocca con 7 giorni di streak',
  orbit:   'Sblocca con 100 voti',
  heart:   '💎 In arrivo nel Pixie Market',
  robot:   '💎 In arrivo nel Pixie Market',
  crown:   '💎 In arrivo nel Pixie Market',
  diamond: '💎 In arrivo nel Pixie Market',
  galaxy:  '💎 In arrivo nel Pixie Market',
  angel:   '💎 In arrivo nel Pixie Market',
  devil:   '💎 In arrivo nel Pixie Market',
}

const EN_UNLOCK: Record<string, string> = {
  spark:   'Always available',
  blip:    'Always available',
  momo:    'Unlocks at 10 votes',
  shade:   'Unlocks at 7-day streak',
  orbit:   'Unlocks at 100 votes',
  heart:   '💎 Coming to Pixie Market',
  robot:   '💎 Coming to Pixie Market',
  crown:   '💎 Coming to Pixie Market',
  diamond: '💎 Coming to Pixie Market',
  galaxy:  '💎 Coming to Pixie Market',
  angel:   '💎 Coming to Pixie Market',
  devil:   '💎 Coming to Pixie Market',
}

/**
 * Public explainer gallery. Stages 1-3 visible, 4-6 hidden as mystery cards.
 * Excludes admin-only species.
 */
export default function PixieExplainerGallery({ locale = 'en' }: Props) {
  const IT = locale === 'it'
  const species = COMPANIONS.filter(c => c.access !== 'admin')

  return (
    <div className="space-y-4">
      {species.map(c => {
        const rarityBadge = RARITY_STYLES[c.rarity] ?? RARITY_STYLES.common
        const unlockHint = IT ? IT_UNLOCK[c.id] : EN_UNLOCK[c.id]
        const isPremium = c.access === 'premium'

        return (
          <div
            key={c.id}
            className="rounded-2xl border border-[var(--border)] bg-[#0d0d1a]/60 p-4 sm:p-5"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-black text-white">
                    {c.name.replace('Pixie ', '')}
                  </h3>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${rarityBadge}`}>
                    {c.rarity}
                  </span>
                  {isPremium && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-yellow-500/40 bg-yellow-500/10 text-yellow-300">
                      💎 premium
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">
                  {c.description}
                </p>
                <p className="text-[11px] text-white/40 mt-1.5">{unlockHint}</p>
              </div>
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
          </div>
        )
      })}
    </div>
  )
}

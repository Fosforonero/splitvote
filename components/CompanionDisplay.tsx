'use client'

import { useState, useEffect, useRef } from 'react'
import {
  COMPANION_MAP,
  STAGE_LABELS,
  STAGE_THRESHOLDS,
  getCompanionStage,
  getSpeciesVotes,
  votesToNextStage,
  RARITY_STYLES,
  type CompanionSpecies,
  type PixieXpMap,
} from '@/lib/companion'
import { getPixieImagePath } from '@/lib/pixie'
import PixieLevelUpModal from './PixieLevelUpModal'

interface Props {
  species: CompanionSpecies
  /** Global votes — kept for fallback when pixieXp is absent */
  votesCount: number
  /** Per-species XP map. When provided, stage/progress are derived per species. */
  pixieXp?: PixieXpMap
  xp?: number
  compact?: boolean
  locale?: string
  userId?: string
  enableLevelUpModal?: boolean
}

const IT_STAGE_LABELS: Record<number, string> = {
  1: 'Cucciolo',
  2: 'Apprendista',
  3: 'Esploratore',
  4: 'Campione',
  5: 'Leggendario',
  6: 'Ultra Leggendario',
}

export default function CompanionDisplay({
  species, votesCount, pixieXp, xp = 0, compact = false,
  locale = 'en', userId, enableLevelUpModal = false,
}: Props) {
  const IT = locale === 'it'
  const companion = COMPANION_MAP[species] ?? COMPANION_MAP['spark']
  // Use per-species vote count when available; fall back to global votesCount.
  // Guard: an empty pixieXp map {} is truthy but has no species keys yet —
  // in that case treat as 0 and fall back to votesCount so the stage stays correct.
  const speciesVotes = pixieXp ? getSpeciesVotes(pixieXp, species) : 0
  const effectiveVotes = speciesVotes > 0 ? speciesVotes : votesCount
  const stage = getCompanionStage(effectiveVotes)

  const [imgError, setImgError] = useState(false)
  const [xpPulse, setXpPulse] = useState(false)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const prefersReducedMotion = useRef(false)

  useEffect(() => { setImgError(false) }, [species, stage])

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  // Glow pulse triggered by sv:pixie-xp event dispatched from DailyMissions
  useEffect(() => {
    const handler = () => {
      if (prefersReducedMotion.current || compact) return
      setXpPulse(true)
      setTimeout(() => setXpPulse(false), 1000)
    }
    window.addEventListener('sv:pixie-xp', handler)
    return () => window.removeEventListener('sv:pixie-xp', handler)
  }, [compact])

  // Level-up detection: compare current stage against sessionStorage last-seen stage
  useEffect(() => {
    if (!enableLevelUpModal || !userId) return
    const key = `pixie-stage-${userId}`
    const stored = parseInt(sessionStorage.getItem(key) ?? '0', 10) || 0
    if (stored > 0 && stage > stored) {
      setShowLevelUp(true)
    }
    sessionStorage.setItem(key, String(stage))
  }, [stage, userId, enableLevelUpModal])
  const stageLabel = IT ? (IT_STAGE_LABELS[stage] ?? STAGE_LABELS[stage]) : STAGE_LABELS[stage]
  const emoji = companion.stageEmoji[stage - 1]
  const toNext = votesToNextStage(effectiveVotes)
  const isMaxStage = stage === 6

  // Progress bar within current stage (uses per-species votes)
  const currentThreshold = STAGE_THRESHOLDS[stage - 1]
  const nextThreshold = isMaxStage ? effectiveVotes : STAGE_THRESHOLDS[stage]
  const range = nextThreshold - currentThreshold
  const progress = isMaxStage ? 100 : Math.min(100, Math.round(((effectiveVotes - currentThreshold) / range) * 100))

  const rarityStyle = RARITY_STYLES[companion.rarity] ?? RARITY_STYLES.common

  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${rarityStyle}`}>
        {!imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={getPixieImagePath(species, stage)}
            alt=""
            className="w-8 h-8 object-contain flex-shrink-0"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-2xl">{emoji}</span>
        )}
        <div>
          <p className="text-xs font-bold leading-none">{companion.name}</p>
          <p className="text-xs opacity-70 mt-0.5">
            {IT ? 'Stadio' : 'Stage'} {stage} · {stageLabel}
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
    <style>{`
      @keyframes pixie-xp-pulse {
        0%   { box-shadow: 0 0 0 0 rgba(250,204,21,0.55); }
        50%  { box-shadow: 0 0 20px 8px rgba(250,204,21,0.28); }
        100% { box-shadow: 0 0 0 0 rgba(250,204,21,0); }
      }
    `}</style>
    <div className="rounded-2xl border border-[var(--border)] bg-[#0d0d1a]/60 p-5 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-black uppercase tracking-widest text-[var(--muted)]">
          {IT ? 'Il tuo Pixie' : 'Your Pixie'}
        </h2>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${rarityStyle}`}>
          {companion.rarity}
        </span>
      </div>

      <div className="flex items-center gap-5">
        {/* Companion visual */}
        <div className="relative flex-shrink-0">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              animation: xpPulse ? 'pixie-xp-pulse 1s ease-out forwards' : undefined,
              boxShadow: xpPulse ? undefined : stage >= 4 ? '0 0 24px rgba(99,102,241,0.25)' : undefined,
              transition: xpPulse ? undefined : 'box-shadow 0.3s ease',
            }}
          >
            {!imgError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getPixieImagePath(species, stage)}
                alt=""
                className="w-full h-full object-contain"
                onError={() => setImgError(true)}
              />
            ) : (
              emoji
            )}
          </div>
          {/* Stage badge */}
          <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-black text-white border-2 border-[#0d0d1a]">
            {stage}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-lg font-black text-white leading-none mb-0.5">{companion.name}</p>
          <p className={`text-xs font-bold mb-1 ${companion.color}`}>
            {IT ? 'Stadio' : 'Stage'} {stage} · {stageLabel}
          </p>
          <p className="text-xs text-[var(--muted)] mb-3 opacity-70">
            {IT ? 'Pixie, il tuo avatar digitale che cresce con te.' : 'Pixie, your digital avatar that grows with you.'}
          </p>

          {/* Progress to next stage */}
          {!isMaxStage ? (
            <>
              <div className="flex justify-between text-xs text-[var(--muted)] mb-1">
                <span>{effectiveVotes} {IT ? 'voti' : 'votes'}</span>
                <span>{toNext} {IT ? `per Stadio ${stage + 1}` : `to Stage ${stage + 1}`}</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : (
            <div className="text-xs font-bold text-yellow-400">
              {IT ? '✨ Forma ultra leggendaria sbloccata!' : '✨ Ultra Legendary form unlocked!'}
            </div>
          )}
        </div>
      </div>

      {xp > 0 && (
        <p className="mt-4 text-xs text-[var(--muted)] text-right">
          {IT ? 'XP Totale:' : 'Total XP:'}{' '}
          <span className="text-white font-bold">{xp.toLocaleString()}</span>
        </p>
      )}

      {!isMaxStage && (
        <p className="mt-3 text-xs text-[var(--muted)] italic">
          {IT
            ? 'Completa le missioni di oggi per far crescere il tuo Pixie più velocemente.'
            : "Complete today's missions to grow your Pixie faster."}
        </p>
      )}
    </div>

    {showLevelUp && enableLevelUpModal && userId && (
      <PixieLevelUpModal
        species={species}
        stage={stage}
        xp={xp}
        locale={locale}
        userId={userId}
        onClose={() => setShowLevelUp(false)}
      />
    )}
    </>
  )
}

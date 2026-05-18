'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
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
import PixieSprite from './PixieSprite'
import dynamic from 'next/dynamic'

// Code-split: ~17KB modal only loads when level-up actually fires
const PixieLevelUpModal = dynamic(() => import('./PixieLevelUpModal'), { ssr: false })

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
  // Per-species XP is authoritative once any species has data.
  // Guard: an empty map {} means the per-species system hasn't kicked in yet for
  // this user (migration not yet applied) — fall back to global votesCount so the
  // stage doesn't suddenly reset to 1 for existing users.
  // Once the map has any key at all, use per-species votes for every species,
  // even if a newly-equipped species sits at 0.
  const hasPerSpeciesTracking = Boolean(pixieXp && Object.keys(pixieXp).length > 0)
  const speciesVotes = hasPerSpeciesTracking ? getSpeciesVotes(pixieXp!, species) : 0
  const effectiveVotes = hasPerSpeciesTracking ? speciesVotes : votesCount
  const stage = getCompanionStage(effectiveVotes)

  const [xpPulse, setXpPulse] = useState(false)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [showLightbox, setShowLightbox] = useState(false)
  const prefersReducedMotion = useRef(false)

  const closeLightbox = useCallback(() => setShowLightbox(false), [])

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

  // Lightbox: Escape key + scroll lock
  useEffect(() => {
    if (!showLightbox) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeLightbox() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [showLightbox, closeLightbox])

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
        <PixieSprite
          species={species}
          stage={stage}
          fallbackEmoji={emoji}
          className="w-8 h-8 flex-shrink-0 rounded-md"
          pixelSize={128}
          showFrame={false}
        />
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
    <div className="rounded-2xl border border-[var(--border)] bg-[#0d0d1a]/60 p-5 mb-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-black uppercase tracking-widest text-[var(--muted)]">
          {IT ? 'Il tuo Pixie' : 'Your Pixie'}
        </h2>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${rarityStyle}`}>
          {companion.rarity}
        </span>
      </div>

      <div className="flex items-center gap-5">
        {/* Companion visual — click to open lightbox */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            aria-label={IT ? 'Vedi il tuo Pixie ingrandito' : 'View your Pixie enlarged'}
            onClick={() => setShowLightbox(true)}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center text-5xl overflow-hidden cursor-pointer p-1 hover:ring-2 hover:ring-white/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              animation: xpPulse ? 'pixie-xp-pulse 1s ease-out forwards' : undefined,
              boxShadow: xpPulse ? undefined : stage >= 4 ? '0 0 24px rgba(99,102,241,0.25)' : undefined,
              transition: xpPulse ? undefined : 'box-shadow 0.3s ease, outline 0.15s',
            }}
          >
            <PixieSprite
              species={species}
              stage={stage}
              fallbackEmoji={emoji}
              className="w-full h-full"
              pixelSize={384}
              priority
              showFrame={false}
            />
          </button>
          {/* Stage badge */}
          <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-black text-white border-2 border-[#0d0d1a] pointer-events-none">
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

    {/* Lightbox — enlarged view of the equipped Pixie (close only) */}
    {showLightbox && createPortal(
      <>
        {/* Backdrop */}
        <button
          type="button"
          aria-label={IT ? 'Chiudi' : 'Close'}
          onClick={closeLightbox}
          style={{
            position: 'fixed', inset: 0, zIndex: 1200,
            background: 'rgba(0,0,0,0.82)',
            backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            border: 'none', cursor: 'default',
          }}
        />
        {/* Image + close */}
        <div
          aria-label={companion.name}
          style={{
            position: 'fixed',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1201,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '16px',
          }}
        >
          <div style={{
            width: 'min(280px, calc(100vw - 64px))',
            height: 'min(280px, calc(100vw - 64px))',
            borderRadius: '28px',
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${stage >= 4 ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.1)'}`,
            boxShadow: stage >= 4 ? '0 0 60px rgba(99,102,241,0.3)' : '0 0 40px rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            <PixieSprite
              species={species}
              stage={stage}
              alt={companion.name}
              fallbackEmoji={emoji}
              className="w-full h-full"
              pixelSize={512}
              showFrame={false}
            />
          </div>
          {/* Species name + stage */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '16px', fontWeight: 900, color: 'white', marginBottom: '4px' }}>
              {companion.name}
            </p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
              {IT ? 'Stadio' : 'Stage'} {stage} · {stageLabel}
            </p>
          </div>
          {/* Close button */}
          <button
            type="button"
            onClick={closeLightbox}
            style={{
              padding: '10px 28px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '13px', fontWeight: 700, cursor: 'pointer',
            }}
          >
            {IT ? 'Chiudi' : 'Close'}
          </button>
        </div>
      </>,
      document.body,
    )}

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

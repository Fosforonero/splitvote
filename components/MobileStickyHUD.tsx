'use client'

import { useEffect, useState, useRef } from 'react'
import { getPixieImagePath } from '@/lib/pixie'
import {
  getCompanionStage,
  getSpeciesVotes,
  type CompanionSpecies,
  type PixieXpMap,
} from '@/lib/companion'

interface Props {
  species: CompanionSpecies
  pixieXp: PixieXpMap
  votesCount: number
  level: number
  levelTitle: string
  /** Tailwind text color class for the level (e.g. "text-purple-400") */
  levelColor: string
  xpIntoLevel: number
  xpForLevel: number
  progressPct: number
  streakDays: number
  locale?: string
  /** Show offset below this Y scroll position (px). Default 220. */
  showAfterY?: number
}

/**
 * Mobile-only sticky HUD that appears once the user scrolls past the dashboard hero.
 * Shows Pixie thumbnail, level/title, streak, and XP progress bar.
 * Design: glassmorphism + subtle gradient accent based on level color.
 * Hidden on md+ screens.
 */
export default function MobileStickyHUD({
  species,
  pixieXp,
  votesCount,
  level,
  levelTitle,
  levelColor,
  xpIntoLevel,
  xpForLevel,
  progressPct,
  streakDays,
  locale = 'en',
  showAfterY = 220,
}: Props) {
  const IT = locale === 'it'
  const [visible, setVisible] = useState(false)
  const [imgError, setImgError] = useState(false)
  const ticking = useRef(false)

  // Per-species stage (Pixie tracks its own XP)
  const speciesVotes = getSpeciesVotes(pixieXp, species)
  const stage = getCompanionStage(speciesVotes > 0 ? speciesVotes : votesCount)

  useEffect(() => {
    function onScroll() {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        setVisible(window.scrollY > showAfterY)
        ticking.current = false
      })
    }
    onScroll() // initial
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [showAfterY])

  // Map text color to a matching gradient stop for the XP bar
  const accentGradient = (() => {
    if (levelColor.includes('yellow')) return 'from-yellow-400 to-orange-400'
    if (levelColor.includes('red')) return 'from-red-500 to-orange-500'
    if (levelColor.includes('orange')) return 'from-orange-400 to-yellow-400'
    if (levelColor.includes('purple')) return 'from-purple-500 to-pink-500'
    if (levelColor.includes('blue')) return 'from-blue-500 to-purple-500'
    return 'from-slate-400 to-slate-300'
  })()

  return (
    <>
      <style>{`
        @keyframes hud-slide-down {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        @keyframes hud-flame-pulse {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.18); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hud-anim { animation: none !important; }
        }
      `}</style>

      <div
        aria-hidden={!visible}
        className={`
          md:hidden fixed top-0 left-0 right-0 z-40
          transition-transform duration-300 ease-out
          ${visible ? 'translate-y-0' : '-translate-y-full pointer-events-none'}
        `}
        style={{
          background: 'rgba(8, 8, 16, 0.88)',
          backdropFilter: 'blur(18px) saturate(180%)',
          WebkitBackdropFilter: 'blur(18px) saturate(180%)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          boxShadow: visible ? '0 8px 24px -8px rgba(0,0,0,0.5)' : undefined,
        }}
      >
        {/* Top accent line — matches level color */}
        <div className={`h-[2px] w-full bg-gradient-to-r ${accentGradient} opacity-60`} />

        <div className="px-3 pt-2 pb-2.5 max-w-3xl mx-auto">
          <div className="flex items-center gap-2.5">
            {/* Pixie thumbnail */}
            <div
              className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
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
                <span className="text-lg">⚡</span>
              )}
            </div>

            {/* Center: level + title (truncates), XP bar below */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 leading-none">
                <span className={`text-[11px] font-black ${levelColor} tabular-nums`}>
                  {IT ? 'Lv.' : 'Lv.'}{level}
                </span>
                <span className="text-[11px] text-white/30">·</span>
                <span className={`text-[11px] font-bold ${levelColor} truncate`}>
                  {levelTitle}
                </span>

                {/* Streak badge — pushed right */}
                {streakDays > 0 && (
                  <span
                    className="ml-auto flex items-center gap-1 text-[11px] font-black text-orange-400 tabular-nums hud-anim"
                    style={{ animation: 'hud-flame-pulse 2.4s ease-in-out infinite' }}
                  >
                    <span className="text-sm leading-none">🔥</span>
                    {streakDays}
                  </span>
                )}
              </div>

              {/* XP progress bar */}
              <div className="mt-1.5 flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${accentGradient} transition-all duration-500 ease-out`}
                    style={{ width: `${Math.max(2, progressPct)}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-[var(--muted)] tabular-nums whitespace-nowrap">
                  {xpForLevel > 0
                    ? `${xpIntoLevel}/${xpForLevel}`
                    : 'MAX'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getLevelInfo, type MissionId, type MissionState } from '@/lib/missions'
import { track } from '@/lib/gtag'

interface Props {
  userId: string
  xp: number
  streakDays: number
  locale?: string
}

type LocaleTargets = { en: string; it: string }

const MISSION_TARGETS: Partial<Record<MissionId, LocaleTargets>> = {
  vote_3:            { en: '/moral-dilemmas',  it: '/it/dilemmi-morali' },
  vote_2_categories: { en: '/moral-dilemmas',  it: '/it/dilemmi-morali' },
  challenge_friend:  { en: '/trending',         it: '/it/trending' },
  share_result:      { en: '/trending',         it: '/it/trending' },
  daily_dilemma:     { en: '/',                it: '/it' },
}

function getMissionTarget(id: MissionId, locale: string): string | undefined {
  const entry = MISSION_TARGETS[id]
  if (!entry) return undefined
  return locale === 'it' ? entry.it : entry.en
}

const IT_MISSION_TITLES: Record<string, string> = {
  vote_3:            'Vota 3 dilemmi',
  vote_2_categories: 'Esplora 2 categorie',
  challenge_friend:  'Sfida un amico',
  share_result:      'Condividi un risultato',
  daily_dilemma:     'Dilemma del Giorno',
}

export default function DailyMissions({ userId, xp, streakDays, locale = 'en' }: Props) {
  const IT = locale === 'it'
  const router = useRouter()
  const [missions, setMissions] = useState<MissionState[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState<MissionId | null>(null)
  const [claimError, setClaimError] = useState<string | null>(null)
  const [currentXp, setCurrentXp] = useState(xp)
  const [xpToast, setXpToast] = useState<{ amount: number; key: number } | null>(null)
  const prefersReducedMotion = useRef(false)

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const levelInfo = getLevelInfo(currentXp)

  useEffect(() => {
    fetch('/api/missions')
      .then(r => r.json())
      .then(data => { if (data.missions) setMissions(data.missions) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [userId])

  async function claimMission(id: MissionId) {
    if (claiming) return
    setClaiming(id)
    setClaimError(null)
    try {
      const res = await fetch('/api/missions/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missionId: id }),
      })
      if (res.ok) {
        const json = await res.json().catch(() => ({}))
        const awarded: number = json.xpAwarded ?? 0
        if (awarded > 0) {
          setCurrentXp(prev => prev + awarded)
          // Fire Pixie XP event (CompanionDisplay listens for glow pulse)
          window.dispatchEvent(new CustomEvent('sv:pixie-xp', { detail: { amount: awarded } }))
          // XP toast — skip motion if user prefers reduced motion
          if (!prefersReducedMotion.current) {
            const key = Date.now()
            setXpToast({ amount: awarded, key })
            setTimeout(() => setXpToast(t => t?.key === key ? null : t), 1400)
          }
        }
        setMissions(prev =>
          prev?.map(m =>
            m.id === id
              ? { ...m, completed: true, claimable: false, progress: m.required }
              : m,
          ) ?? null,
        )
        window.dispatchEvent(new Event('sv:missions-claimed'))
        router.refresh()
      } else {
        const data = await res.json().catch(() => ({}))
        setClaimError(data.reason ?? data.error ?? (IT ? 'Errore nel riscattare la missione' : 'Claim failed'))
      }
    } catch {
      setClaimError(IT ? 'Errore di rete' : 'Network error')
    } finally {
      setClaiming(null)
    }
  }

  const completedCount   = (missions ?? []).filter(m => m.completed).length
  const missionCount     = (missions ?? []).length
  const claimableCount   = (missions ?? []).filter(m => m.claimable).length
  const totalXpAvailable = (missions ?? []).reduce((s, m) => s + (!m.completed ? m.xp : 0), 0)
  // Claimable missions float to the top; relative order within each group is preserved
  const sorted = [...(missions ?? [])].sort((a, b) => {
    if (a.claimable && !b.claimable) return -1
    if (!a.claimable && b.claimable) return 1
    return 0
  })

  return (
    <div className={`rounded-2xl border bg-[#0d0d1a]/60 p-5 mb-8 transition-colors relative overflow-visible ${
      claimableCount > 0 ? 'border-orange-500/30' : 'border-[var(--border)]'
    }`}>
      <style>{`
        @keyframes xp-float {
          0%   { opacity: 1; transform: translateY(0) scale(1); }
          60%  { opacity: 1; transform: translateY(-20px) scale(1.08); }
          100% { opacity: 0; transform: translateY(-32px) scale(0.95); }
        }
      `}</style>
      {/* XP Toast — floats up on successful mission claim */}
      {xpToast && (
        <div
          key={xpToast.key}
          aria-live="polite"
          aria-atomic="true"
          style={{
            position: 'absolute', top: '12px', right: '16px',
            animation: 'xp-float 1.4s ease-out forwards',
            pointerEvents: 'none', zIndex: 10,
          }}
          className="text-sm font-black text-yellow-400 whitespace-nowrap"
        >
          +{xpToast.amount} XP ⚡{' '}
          <span className="text-xs font-semibold text-yellow-300/80">
            {IT ? 'Pixie ha guadagnato XP' : 'Pixie gained XP'}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-black uppercase tracking-widest text-[var(--muted)]">
            {IT ? 'Missioni di Oggi' : "Today's Missions"}
          </h2>
          {claimableCount > 0 && (
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-black leading-none">
              {claimableCount}
            </span>
          )}
        </div>
        <span className="text-xs text-[var(--muted)]">
          {completedCount}/{missionCount} {IT ? 'completate' : 'done'}
        </span>
      </div>

      {/* XP bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className={`font-bold ${levelInfo.color}`}>
            Lv.{levelInfo.level} {levelInfo.title}
          </span>
          <span className="text-[var(--muted)]">
            {levelInfo.xpIntoLevel} / {levelInfo.xpNeeded} XP
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700"
            style={{ width: `${levelInfo.progressPct}%` }}
          />
        </div>
      </div>

      {/* Streak */}
      {streakDays > 0 && (
        <div className="flex items-center gap-2 mb-4 text-sm">
          <span className="text-orange-400">🔥</span>
          <span className="font-bold text-orange-400">
            {streakDays}{IT ? ' giorni di streak' : '-day streak'}
          </span>
          <span className="text-[var(--muted)] text-xs">
            {IT ? '— vota ogni giorno!' : '— keep voting daily!'}
          </span>
        </div>
      )}

      {/* Claim error */}
      {claimError && (
        <div
          role="alert"
          aria-live="assertive"
          className="text-red-400 text-xs bg-red-900/20 rounded p-2 border border-red-500/20 mb-3"
        >
          {claimError}
        </div>
      )}

      {/* Missions list */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 rounded-xl bg-white/3 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map(m => {
            const isClaiming = claiming === m.id
            const displayTitle = IT ? (IT_MISSION_TITLES[m.id] ?? m.title) : m.title
            // Only in-progress missions (not claimable, not completed, not comingSoon) get a deep link
            const target = (!m.completed && !m.claimable && !m.comingSoon)
              ? getMissionTarget(m.id, locale)
              : undefined

            const cardClassName = `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${
              m.completed
                ? 'border-green-500/30 bg-green-500/10 opacity-75'
                : m.comingSoon
                  ? 'border-white/5 bg-white/3 opacity-50'
                  : m.claimable
                    ? 'border-blue-500/40 bg-blue-500/5'
                    : target
                      ? 'border-[var(--border)] bg-[#0a0a1a]/40 hover:border-blue-500/30 hover:bg-blue-500/5 min-h-[44px]'
                      : 'border-[var(--border)] bg-[#0a0a1a]/40'
            }`

            const cardContent = (
              <>
                <span className="text-xl flex-shrink-0">
                  {m.completed ? '✅' : m.comingSoon ? '🔒' : m.icon}
                </span>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-bold ${
                      m.completed
                        ? 'text-green-400 line-through'
                        : m.comingSoon
                          ? 'text-white/40'
                          : 'text-white'
                    }`}
                  >
                    {displayTitle}
                  </p>
                  {m.comingSoon ? (
                    <p className="text-[10px] text-white/25">
                      {IT ? 'Prossimamente' : 'Coming soon'}
                    </p>
                  ) : !m.completed ? (
                    <p className="text-[10px] text-[var(--muted)]">
                      {m.progress}/{m.required}
                    </p>
                  ) : null}
                </div>

                {/* Right side: XP indicator or Claim button */}
                {m.completed ? (
                  <span className="text-xs font-bold flex-shrink-0 text-green-400">
                    +{m.xp} XP ✓
                  </span>
                ) : m.comingSoon ? (
                  <span className="text-xs flex-shrink-0 text-white/20">+{m.xp} XP</span>
                ) : m.claimable ? (
                  <button
                    onClick={e => { e.stopPropagation(); claimMission(m.id) }}
                    disabled={isClaiming || claiming !== null}
                    aria-busy={isClaiming}
                    className="flex-shrink-0 text-xs font-bold px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white transition-colors"
                  >
                    {isClaiming ? '…' : `+${m.xp} XP`}
                  </button>
                ) : (
                  <span className="text-xs font-bold flex-shrink-0 text-yellow-400/50">
                    {m.progress}/{m.required}
                  </span>
                )}
              </>
            )

            return target ? (
              <Link
                key={m.id}
                href={target}
                className={cardClassName}
                onClick={() => track('mission_target_clicked', { mission_id: m.id, target, locale })}
              >
                {cardContent}
              </Link>
            ) : (
              <div key={m.id} className={cardClassName}>
                {cardContent}
              </div>
            )
          })}
        </div>
      )}

      {!loading && missions !== null && (
        totalXpAvailable > 0
          ? (
            <p className="text-xs text-[var(--muted)] text-center mt-3">
              {IT ? 'Completa le missioni per guadagnare' : 'Complete missions to earn'}{' '}
              <span className="text-yellow-400 font-bold">+{totalXpAvailable} XP</span>
            </p>
          )
          : (
            <p className="text-xs text-green-400 text-center mt-3 font-bold">
              {IT ? '🎉 Tutte le missioni completate per oggi!' : '🎉 All missions complete for today!'}
            </p>
          )
      )}
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Zap, Globe, ChevronRight, Share2 } from 'lucide-react'
import type { Scenario } from '@/lib/scenarios'
import { track } from '@/lib/gtag'
import { getServerVotedIds } from '@/lib/client-voted-ids'
import { shareQuestion } from '@/lib/share-question'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://splitvote.io'

interface Props {
  scenario: Scenario
  totalVotes: number
  locale?: 'en' | 'it'
}

function getMidnightCountdown(): string {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  const diff = midnight.getTime() - now.getTime()
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  const s = Math.floor((diff % 60_000) / 1_000)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const IT_COPY = {
  label:         'Dilemma del Giorno',
  resetsIn:      'Cambia tra',
  votesToday:    'voti oggi',
  voteNow:       'Scopri il risultato',
  results:       'Vedi risultati',
  shareQuestion: 'Condividi domanda',
  shareCopied:   'Link copiato',
  alreadyVoted:  'Votato',
}

const EN_COPY = {
  label:         'Dilemma of the Day',
  resetsIn:      'Resets in',
  votesToday:    'votes today',
  voteNow:       'Reveal the split',
  results:       'See results',
  shareQuestion: 'Share question',
  shareCopied:   'Link copied',
  alreadyVoted:  'Voted',
}

export default function DailyDilemma({ scenario, totalVotes, locale = 'en' }: Props) {
  const [countdown, setCountdown] = useState('')
  const [mounted, setMounted] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [isVoted, setIsVoted] = useState(false)
  const copy = locale === 'it' ? IT_COPY : EN_COPY
  const prefix = locale === 'it' ? '/it' : ''
  const ctaHref = `${prefix}/${isVoted ? 'results' : 'play'}/${scenario.id}`

  useEffect(() => {
    setMounted(true)
    setCountdown(getMidnightCountdown())
    const interval = setInterval(() => setCountdown(getMidnightCountdown()), 1000)

    // Fast path: cookie set on this device after voting
    if (document.cookie.includes(`sv_voted_${scenario.id}=`)) {
      setIsVoted(true)
    } else {
      // Fallback: server-side voted IDs for logged-in users (cross-device consistency).
      // Shares the same deduped Promise as VotedDilemmaCard — no extra HTTP request.
      getServerVotedIds().then((ids) => {
        if (ids.has(scenario.id)) setIsVoted(true)
      })
    }

    return () => clearInterval(interval)
  }, [scenario.id])

  async function handleShare() {
    const url = `${BASE_URL}${prefix}/play/${scenario.id}`
    const text = locale === 'it'
      ? `"${scenario.question}" — Tu cosa sceglieresti?`
      : `"${scenario.question}" — What would you choose?`
    track('share_clicked', {
      target: 'question_pre_vote',
      scenario_id: scenario.id,
      locale,
      source: 'daily_dilemma',
    })
    const result = await shareQuestion({ title: scenario.question, text, url })
    if (result === 'copied') {
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    }
  }

  return (
    <div className="mb-10 rounded-3xl overflow-hidden neon-glow-yellow card-neon-yellow relative"
      style={{
        border: '1px solid rgba(255,215,0,0.25)',
        background: 'linear-gradient(135deg, rgba(255,215,0,0.06) 0%, rgba(255,140,0,0.04) 50%, rgba(255,51,102,0.04) 100%)'
      }}>

      {/* Full-card overlay link — covers non-interactive areas, sits behind CTAs and share button */}
      <Link
        href={ctaHref}
        className="absolute inset-0 z-0"
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Header bar */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b"
        style={{ borderColor: 'rgba(255,215,0,0.12)', background: 'rgba(255,215,0,0.04)' }}>
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-yellow-400 pulse-glow" fill="currentColor" aria-hidden="true" />
          <span className="text-yellow-400 text-xs sm:text-sm font-black uppercase tracking-widest neon-text-yellow">
            {copy.label}
          </span>
          {/* XP reward pill — visible before voting to motivate daily engagement */}
          {mounted && !isVoted && (
            <span className="text-[10px] font-black text-yellow-300 bg-yellow-500/15 border border-yellow-500/30 rounded-full px-2 py-0.5 leading-none">
              +50 XP
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
          {mounted && isVoted ? (
            <span
              aria-live="polite"
              className="text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 rounded-full px-2 py-0.5 font-bold"
            >
              <span aria-hidden="true">✓ </span>{copy.alreadyVoted}
            </span>
          ) : (
            <span className="hidden sm:inline">{copy.resetsIn}</span>
          )}
          <span className="font-mono font-bold text-yellow-400 tabular-nums text-xs">
            {mounted ? countdown : '--:--:--'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <span className="text-3xl sm:text-4xl flex-shrink-0 mt-0.5">{scenario.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-base sm:text-xl font-bold text-white leading-snug mb-3">
              {scenario.question}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-widest text-yellow-400/70 border border-yellow-500/20 rounded-full px-3 py-1">
                {scenario.category}
              </span>
              {totalVotes > 0 && (
                <span className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                  <Globe size={11} />
                  {totalVotes.toLocaleString()} {copy.votesToday}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* CTA — relative z-10 so these links are above the full-card overlay */}
        <div className="relative z-10 mt-5 flex items-center gap-3">
          <Link
            href={ctaHref}
            className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 active:scale-[0.97] active:bg-yellow-300 text-black font-black text-sm px-6 py-3 rounded-xl transition-all neon-glow-yellow hover:scale-[1.01]"
          >
            {isVoted ? copy.results : copy.voteNow}
            <ChevronRight size={16} />
          </Link>
          {!isVoted && (
            <Link
              href={`${prefix}/results/${scenario.id}`}
              className="text-sm text-[var(--muted)] hover:text-white transition-colors px-4 py-3 rounded-xl hover:bg-white/5"
            >
              {copy.results}
            </Link>
          )}
        </div>

        {/* Share — relative z-10 so button is above the full-card overlay */}
        <div className="relative z-10 mt-3 text-center">
          <button
            onClick={handleShare}
            aria-label={copy.shareQuestion}
            className="text-xs text-[var(--muted)] hover:text-white transition-colors inline-flex items-center gap-1.5 py-2.5"
          >
            <Share2 size={12} aria-hidden />
            {linkCopied ? copy.shareCopied : copy.shareQuestion}
          </button>
        </div>
      </div>
    </div>
  )
}

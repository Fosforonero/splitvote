'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Share2 } from 'lucide-react'
import type { Scenario } from '@/lib/scenarios'
import Script from 'next/script'
import { track } from '@/lib/gtag'
import { shareQuestion as execShare } from '@/lib/share-question'

interface ExistingVote {
  choice: 'A' | 'B'
  canChangeUntil: string
}

interface Props {
  scenario: Scenario
  existingVote?: ExistingVote | null
  totalVotes?: number
  isChallenge?: boolean
  localePrefix?: '' | '/it'
  nextId?: string | null
  referralCode?: string
  pathCategory?: string
  pathStep?: number
  pathTarget?: number
  pathCategoryLabel?: string
  pathCategoryEmoji?: string
  nextPathId?: string | null
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

function formatTimeRemaining(canChangeUntil: string): string {
  const diff = new Date(canChangeUntil).getTime() - Date.now()
  if (diff <= 0) return 'expired'
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://splitvote.io'

const EN_COPY = {
  back:                '← All dilemmas',
  challengeTitle:      '🔥 Someone challenged you!',
  challengeText:       "A friend wants to know which side you're on. Choose wisely.",
  joinVoted:           (n: number) => `🌍 Join ${n.toLocaleString('en-US')} people who already voted`,
  alreadyVoted:        '✅ You already voted on this dilemma',
  registeredChoice:    'Your recorded choice',
  canChange:           (t: string) => `🕐 You can still switch for ${t}`,
  voteLocked:          '🔒 Your vote is locked',
  yourChoice:          'YOUR CHOICE',
  or:                  'OR',
  yourVote:            '← your vote',
  seeResults:          'See results →',
  nextDilemma:         'Next dilemma →',
  browsedAll:          "You've answered all available dilemmas. Browse all →",
  counting:            'Counting your vote…',
  voteError:           'Something went wrong. Please try again.',
  disclaimer:          'Anonymous voting. No account required. Results update in real time.',
  optionA:             'Option A',
  optionB:             'Option B',
  graceCountdown:      (s: number) => `Recording in ${s}…`,
  graceHint:           'Changed your mind? You have a short window to switch before it\'s recorded.',
  graceUndo:           'Undo',
  graceConfirm:        'Confirm now',
  shareQuestion:       'Share question',
  shareQuestionCopied: 'Link copied',
  revealHint:          'Vote to reveal how the world splits.',
  changeVote:          'Switch to this',
}

const IT_COPY = {
  back:                '← Tutti i dilemmi',
  challengeTitle:      '🔥 Ti hanno sfidato!',
  challengeText:       'Un amico vuole sapere da che parte stai. Scegli con cura.',
  joinVoted:           (n: number) => `🌍 Unisciti a ${n.toLocaleString('it-IT')} persone che hanno già votato`,
  alreadyVoted:        '✅ Hai già votato per questo dilemma',
  registeredChoice:    'La tua scelta registrata',
  canChange:           (t: string) => `🕐 Puoi ancora cambiare per altri ${t}`,
  voteLocked:          '🔒 Il voto è bloccato',
  yourChoice:          'LA TUA SCELTA',
  or:                  'OPPURE',
  yourVote:            '← il tuo voto',
  seeResults:          'Vedi risultati →',
  nextDilemma:         'Prossimo dilemma →',
  browsedAll:          'Hai risposto a tutti i dilemmi disponibili. Sfoglia tutti →',
  counting:            'Conteggio del tuo voto…',
  voteError:           'Qualcosa è andato storto. Riprova.',
  disclaimer:          'Voto anonimo. Nessun account richiesto. I risultati si aggiornano in tempo reale.',
  optionA:             'Opzione A',
  optionB:             'Opzione B',
  graceCountdown:      (s: number) => `Registrazione tra ${s}…`,
  graceHint:           'Hai cambiato idea? Hai qualche secondo per correggere prima che venga registrato.',
  graceUndo:           'Annulla',
  graceConfirm:        'Conferma subito',
  shareQuestion:       'Condividi domanda',
  shareQuestionCopied: 'Link copiato',
  revealHint:          'Vota per scoprire come si divide il mondo.',
  changeVote:          'Cambia con questa',
}

export default function VoteClientPage({
  scenario,
  existingVote,
  totalVotes = 0,
  isChallenge = false,
  localePrefix = '',
  nextId,
  referralCode,
  pathCategory,
  pathStep,
  pathTarget,
  pathCategoryLabel,
  pathCategoryEmoji,
  nextPathId,
}: Props) {
  const [pendingOption, setPendingOption] = useState<'a' | 'b' | null>(null)
  const [graceSecsLeft, setGraceSecsLeft] = useState(0)
  const [submittedOption, setSubmittedOption] = useState<'a' | 'b' | null>(null)
  const [loading, setLoading] = useState(false)
  const [voteError, setVoteError] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<string>('')
  const [questionLinkCopied, setQuestionLinkCopied] = useState(false)
  const router = useRouter()

  // Grace UX — refs prevent stale closures in timers
  const pendingOptionRef = useRef<'a' | 'b' | null>(null)
  const graceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const graceTickRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const copy = localePrefix === '/it' ? IT_COPY : EN_COPY
  const locale = localePrefix === '/it' ? 'it' : 'en'
  const nextHref = nextId ? `${localePrefix}/play/${nextId}` : localePrefix || '/'

  // Cookie-based redirect for non-logged users — preserves path params
  useEffect(() => {
    if (existingVote) return
    const previousVote = getCookie(`sv_voted_${scenario.id}`)
    if (previousVote === 'a' || previousVote === 'b') {
      let redirectUrl = `${localePrefix}/results/${scenario.id}?voted=${previousVote}`
      if (pathCategory && pathStep && pathTarget) {
        redirectUrl += `&path=${pathCategory}&step=${pathStep}&target=${pathTarget}`
      }
      router.replace(redirectUrl)
    }
  }, [scenario.id, router, existingVote, localePrefix, pathCategory, pathStep, pathTarget])

  // Update time remaining every minute
  useEffect(() => {
    if (!existingVote) return
    setTimeRemaining(formatTimeRemaining(existingVote.canChangeUntil))
    const interval = setInterval(() => {
      setTimeRemaining(formatTimeRemaining(existingVote.canChangeUntil))
    }, 60_000)
    return () => clearInterval(interval)
  }, [existingVote])

  // Record referral visit for the challenge_friend mission (once per session per link)
  useEffect(() => {
    if (!referralCode) return
    const key = `sv_ref_${referralCode}_${scenario.id}`
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')
    fetch('/api/referral/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ref: referralCode, scenarioId: scenario.id }),
    }).catch(() => { /* non-blocking */ })
  }, [referralCode, scenario.id])

  function clearGraceTimers() {
    if (graceTimerRef.current) { clearTimeout(graceTimerRef.current); graceTimerRef.current = null }
    if (graceTickRef.current) { clearInterval(graceTickRef.current); graceTickRef.current = null }
  }

  function cancelGrace() {
    clearGraceTimers()
    pendingOptionRef.current = null
    setPendingOption(null)
    setGraceSecsLeft(0)
  }

  function confirmNow() {
    const opt = pendingOptionRef.current
    clearGraceTimers()
    pendingOptionRef.current = null
    setPendingOption(null)
    setGraceSecsLeft(0)
    if (opt) void submitVote(opt)
  }

  function startGrace(option: 'a' | 'b') {
    clearGraceTimers()
    pendingOptionRef.current = option
    setPendingOption(option)
    setGraceSecsLeft(3)
    graceTickRef.current = setInterval(() => {
      setGraceSecsLeft(s => Math.max(0, s - 1))
    }, 1000)
    graceTimerRef.current = setTimeout(() => {
      const opt = pendingOptionRef.current
      clearGraceTimers()
      pendingOptionRef.current = null
      setPendingOption(null)
      setGraceSecsLeft(0)
      if (opt) void submitVote(opt)
    }, 3000)
  }

  function handleOptionClick(option: 'a' | 'b') {
    if (loading || !!submittedOption) return
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cancelGrace()
      void submitVote(option)
      return
    }
    if (pendingOption === option) {
      confirmNow()
      return
    }
    startGrace(option)
  }

  async function submitVote(option: 'a' | 'b') {
    setSubmittedOption(option)
    setLoading(true)
    setVoteError(false)
    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: scenario.id, option }),
      })
      if (!res.ok) {
        setLoading(false)
        setSubmittedOption(null)
        setVoteError(true)
        return
      }
      const data = await res.json()
      // Change window expired between page-load and click — redirect with the original choice
      if (data.locked && existingVote) {
        const originalChoice = existingVote.choice.toLowerCase()
        let resultsUrl = `${localePrefix}/results/${scenario.id}?voted=${originalChoice}`
        if (pathCategory && pathStep && pathTarget) {
          resultsUrl += `&path=${pathCategory}&step=${pathStep}&target=${pathTarget}`
        }
        router.push(resultsUrl)
        return
      }
      track('vote_submitted', {
        scenario_id: scenario.id,
        category: scenario.category,
        choice: option,
        locale,
      })
      // Fire-and-forget: increment per-species Pixie XP for authenticated users.
      // Does NOT touch vote logic, Redis, or dilemma_votes — pure profile update.
      fetch('/api/pixie/xp', { method: 'POST' }).catch(() => {})
      let resultsUrl = `${localePrefix}/results/${scenario.id}?voted=${option}`
      if (pathCategory && pathStep && pathTarget) {
        resultsUrl += `&path=${pathCategory}&step=${pathStep}&target=${pathTarget}`
      }
      router.push(resultsUrl)
    } catch {
      setLoading(false)
      setSubmittedOption(null)
      setVoteError(true)
    }
  }

  async function handleShareQuestion() {
    const url = `${BASE_URL}${localePrefix}/play/${scenario.id}`
    const text = locale === 'it'
      ? `"${scenario.question}" — Tu cosa sceglieresti?`
      : `"${scenario.question}" — What would you choose?`
    track('share_clicked', {
      target: 'question_pre_vote',
      scenario_id: scenario.id,
      locale,
      source: 'play',
    })
    const result = await execShare({ title: scenario.question, text, url })
    if (result === 'copied') {
      setQuestionLinkCopied(true)
      setTimeout(() => setQuestionLinkCopied(false), 2000)
    }
  }

  // Cleanup grace timers on unmount
  useEffect(() => {
    return clearGraceTimers
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // JSON-LD structured data for rich snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Question',
    name: scenario.question,
    text: scenario.question,
    url: `${BASE_URL}${localePrefix}/play/${scenario.id}`,
    suggestedAnswer: [
      {
        '@type': 'Answer',
        text: scenario.optionA,
        url: `${BASE_URL}${localePrefix}/results/${scenario.id}`,
      },
      {
        '@type': 'Answer',
        text: scenario.optionB,
        url: `${BASE_URL}${localePrefix}/results/${scenario.id}`,
      },
    ],
    dateCreated: '2026-01-01',
    inLanguage: localePrefix === '/it' ? 'it' : 'en',
    author: { '@type': 'Organization', name: 'SplitVote', url: BASE_URL },
  }

  const votedOptionText = existingVote?.choice === 'A' ? scenario.optionA : scenario.optionB
  const canStillChange = existingVote ? new Date(existingVote.canChangeUntil) > new Date() : false

  return (
    <>
      <Script
        id={`jsonld-${scenario.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026') }}
      />

      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Back */}
        <Link href={localePrefix || '/'} className="text-sm text-[var(--muted)] hover:text-white transition-colors mb-8 inline-block">
          {copy.back}
        </Link>

        {/* Path progress indicator */}
        {pathCategory && pathStep && pathTarget && (
          <div className="mb-5 flex items-center gap-2 text-xs text-[var(--muted)]">
            {pathCategoryEmoji && <span aria-hidden>{pathCategoryEmoji}</span>}
            <span className="font-bold uppercase tracking-widest text-white/70">
              {pathCategoryLabel ?? pathCategory}
            </span>
            <span className="text-white/25">·</span>
            <span>{pathStep}/{pathTarget}</span>
          </div>
        )}

        {/* ── Challenge banner ── */}
        {isChallenge && !existingVote && (
          <div className="mb-6 rounded-2xl border border-orange-500/30 bg-orange-500/10 px-5 py-4 text-center">
            <p className="text-orange-400 font-black text-lg mb-0.5">{copy.challengeTitle}</p>
            <p className="text-[var(--muted)] text-sm">{copy.challengeText}</p>
          </div>
        )}

        {/* Question */}
        <div className="text-center mb-12">
          <span className="text-5xl mb-6 block">{scenario.emoji}</span>
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-4 block">
            {scenario.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text)] leading-snug">
            {scenario.question}
          </h1>

          {/* Live vote counter */}
          {totalVotes > 0 && (
            <p className="text-sm text-[var(--muted)] mt-4">
              {copy.joinVoted(totalVotes)}
            </p>
          )}

          {/* Reveal motivation — only shown before voting */}
          {!existingVote && (
            <p className="text-xs text-[var(--muted)] mt-3 opacity-60">
              {copy.revealHint}
            </p>
          )}
        </div>

        {/* Already voted — locked state */}
        {existingVote ? (
          <div className="space-y-4">
            {/* Voted banner */}
            <div className="rounded-2xl border border-green-500/40 bg-green-500/10 px-5 py-5 text-center">
              <p className="text-green-400 font-black text-base sm:text-lg leading-snug mb-2">
                {copy.alreadyVoted}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-2">
                {copy.registeredChoice}
              </p>
              <p className="text-white font-bold text-lg leading-snug">&ldquo;{votedOptionText}&rdquo;</p>
              {canStillChange && timeRemaining ? (
                <p className="text-[var(--muted)] text-xs mt-2">
                  {copy.canChange(timeRemaining)}
                </p>
              ) : (
                <p className="text-[var(--muted)] text-xs mt-2">
                  {copy.voteLocked}
                </p>
              )}
            </div>

            {/* Options — chosen highlighted; opposite is a button when change window is open */}
            <div className="vs divider flex items-center gap-4 mt-2">
              <div className="flex-1 h-px bg-[var(--border)]" />
              <span className="text-xs font-black text-[var(--muted)] tracking-widest">{copy.yourChoice}</span>
              <div className="flex-1 h-px bg-[var(--border)]" />
            </div>

            {(() => {
              const activeOption = submittedOption ?? pendingOption
              return (
                <div className="grid grid-cols-1 gap-4 mt-2">
                  {existingVote.choice === 'A' ? (
                    <div className="w-full rounded-2xl border-2 p-6 text-left font-semibold text-lg border-red-500 bg-red-500/20 text-red-300">
                      <span className="block text-xs font-black uppercase tracking-widest text-red-400 mb-2">{copy.optionA}</span>
                      {scenario.optionA}
                      <span className="ml-2 text-red-400">{copy.yourVote}</span>
                    </div>
                  ) : canStillChange ? (
                    <button
                      type="button"
                      onClick={() => handleOptionClick('a')}
                      disabled={loading || !!submittedOption}
                      className={`w-full min-h-[88px] rounded-2xl border-2 p-6 text-left font-semibold text-lg
                        ${activeOption === 'a'
                          ? 'border-red-500 bg-red-500/20 text-red-300 scale-[0.99] animate-vote-tap'
                          : 'border-red-500/30 bg-red-500/5 text-[var(--text)] hover:border-red-500/70 hover:bg-red-500/15 hover:-translate-y-0.5 active:scale-[0.97] active:bg-red-500/15 cursor-pointer'
                        }
                        ${activeOption && activeOption !== 'a' ? 'opacity-30' : ''}
                        transition-all duration-200`}
                    >
                      <span className="block text-xs font-black uppercase tracking-widest text-red-400 mb-2">{copy.optionA}</span>
                      {scenario.optionA}
                      {!activeOption && <span className="ml-2 text-xs text-red-400">{copy.changeVote}</span>}
                    </button>
                  ) : (
                    <div className="w-full rounded-2xl border-2 p-6 text-left font-semibold text-lg border-red-500/20 bg-red-500/5 text-[var(--muted)] opacity-40">
                      <span className="block text-xs font-black uppercase tracking-widest text-red-400 mb-2">{copy.optionA}</span>
                      {scenario.optionA}
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-[var(--border)]" />
                    <span className="text-2xl font-black text-[var(--muted)]">{copy.or}</span>
                    <div className="flex-1 h-px bg-[var(--border)]" />
                  </div>

                  {existingVote.choice === 'B' ? (
                    <div className="w-full rounded-2xl border-2 p-6 text-left font-semibold text-lg border-blue-500 bg-blue-500/20 text-blue-300">
                      <span className="block text-xs font-black uppercase tracking-widest text-blue-400 mb-2">{copy.optionB}</span>
                      {scenario.optionB}
                      <span className="ml-2 text-blue-400">{copy.yourVote}</span>
                    </div>
                  ) : canStillChange ? (
                    <button
                      type="button"
                      onClick={() => handleOptionClick('b')}
                      disabled={loading || !!submittedOption}
                      className={`w-full min-h-[88px] rounded-2xl border-2 p-6 text-left font-semibold text-lg
                        ${activeOption === 'b'
                          ? 'border-blue-500 bg-blue-500/20 text-blue-300 scale-[0.99] animate-vote-tap'
                          : 'border-blue-500/30 bg-blue-500/5 text-[var(--text)] hover:border-blue-500/70 hover:bg-blue-500/15 hover:-translate-y-0.5 active:scale-[0.97] active:bg-blue-500/15 cursor-pointer'
                        }
                        ${activeOption && activeOption !== 'b' ? 'opacity-30' : ''}
                        transition-all duration-200`}
                    >
                      <span className="block text-xs font-black uppercase tracking-widest text-blue-400 mb-2">{copy.optionB}</span>
                      {scenario.optionB}
                      {!activeOption && <span className="ml-2 text-xs text-blue-400">{copy.changeVote}</span>}
                    </button>
                  ) : (
                    <div className="w-full rounded-2xl border-2 p-6 text-left font-semibold text-lg border-blue-500/20 bg-blue-500/5 text-[var(--muted)] opacity-40">
                      <span className="block text-xs font-black uppercase tracking-widest text-blue-400 mb-2">{copy.optionB}</span>
                      {scenario.optionB}
                    </div>
                  )}
                </div>
              )
            })()}

            {/* Grace countdown — shown when changing vote within window */}
            {pendingOption && graceSecsLeft > 0 && !submittedOption && (
              <div className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center" aria-live="polite">
                <p className="text-white font-bold text-sm mb-1">
                  {copy.graceCountdown(graceSecsLeft)}
                </p>
                <p className="text-xs text-[var(--muted)] mb-3">{copy.graceHint}</p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={cancelGrace}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold text-[var(--muted)] border border-[var(--border)] hover:bg-white/5 transition-colors"
                  >
                    {copy.graceUndo}
                  </button>
                  <button
                    onClick={confirmNow}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-white/10 border border-white/20 hover:bg-white/15 transition-colors"
                  >
                    {copy.graceConfirm}
                  </button>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center gap-2 text-[var(--muted)] text-sm mt-4">
                <Spinner />
                <span>{copy.counting}</span>
              </div>
            )}

            {voteError && (
              <p className="text-center text-red-400 text-sm mt-4">
                {copy.voteError}
              </p>
            )}

            {/* CTA to results / next */}
            {(() => {
              const seeResultsHref = pathCategory && pathStep && pathTarget
                ? `${localePrefix}/results/${scenario.id}?voted=${existingVote.choice.toLowerCase()}&path=${pathCategory}&step=${pathStep}&target=${pathTarget}`
                : `${localePrefix}/results/${scenario.id}?voted=${existingVote.choice.toLowerCase()}`
              const pathNextHref = (nextPathId && pathCategory && pathStep !== undefined && pathTarget)
                ? `${localePrefix}/play/${nextPathId}?path=${pathCategory}&step=${pathStep + 1}&target=${pathTarget}`
                : localePrefix || '/'
              return (
                <div className="flex gap-3 mt-6">
                  <Link
                    href={seeResultsHref}
                    className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm text-center transition-colors"
                  >
                    {copy.seeResults}
                  </Link>
                  {pathCategory && pathStep && pathTarget ? (
                    <Link
                      href={pathNextHref}
                      onClick={() => nextPathId && track('path_next_clicked', { scenario_id: scenario.id, locale, source: 'play_already_voted' })}
                      className="flex-1 py-3 rounded-xl border border-[var(--border)] hover:bg-white/5 text-[var(--muted)] font-bold text-sm text-center transition-colors"
                    >
                      {nextPathId ? copy.nextDilemma : copy.browsedAll}
                    </Link>
                  ) : (
                    <Link
                      href={nextHref}
                      onClick={() => nextId && track('next_dilemma_clicked', { scenario_id: scenario.id, locale, source: 'play_already_voted' })}
                      className="flex-1 py-3 rounded-xl border border-[var(--border)] hover:bg-white/5 text-[var(--muted)] font-bold text-sm text-center transition-colors"
                    >
                      {nextId ? copy.nextDilemma : copy.browsedAll}
                    </Link>
                  )}
                </div>
              )
            })()}
          </div>
        ) : (
          <>
            {/* vs divider */}
            <div className="flex items-center gap-4 mb-2">
              <div className="flex-1 h-px bg-[var(--border)]" />
              <span className="text-xs font-black text-[var(--muted)] tracking-widest">{copy.yourChoice}</span>
              <div className="flex-1 h-px bg-[var(--border)]" />
            </div>

            {/* Vote buttons */}
            {(() => {
              const activeOption = submittedOption ?? pendingOption
              return (
                <div className="grid grid-cols-1 gap-4 mt-8">
                  <button
                    onClick={() => handleOptionClick('a')}
                    disabled={loading || !!submittedOption}
                    className={`w-full min-h-[88px] rounded-2xl border-2 p-6 text-left font-semibold text-lg
                      ${activeOption === 'a'
                        ? 'border-red-500 bg-red-500/20 text-red-300 scale-[0.99] animate-vote-tap'
                        : 'border-red-500/30 bg-red-500/5 text-[var(--text)] hover:border-red-500/70 hover:bg-red-500/15 hover:-translate-y-0.5 active:scale-[0.97] active:bg-red-500/15 cursor-pointer'
                      }
                      ${activeOption && activeOption !== 'a' ? 'opacity-30' : ''}
                      transition-all duration-200
                    `}
                  >
                    <span className="block text-xs font-black uppercase tracking-widest text-red-400 mb-2">{copy.optionA}</span>
                    {scenario.optionA}
                  </button>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-[var(--border)]" />
                    <span className="text-2xl font-black text-[var(--muted)]">{copy.or}</span>
                    <div className="flex-1 h-px bg-[var(--border)]" />
                  </div>

                  <button
                    onClick={() => handleOptionClick('b')}
                    disabled={loading || !!submittedOption}
                    className={`w-full min-h-[88px] rounded-2xl border-2 p-6 text-left font-semibold text-lg
                      ${activeOption === 'b'
                        ? 'border-blue-500 bg-blue-500/20 text-blue-300 scale-[0.99] animate-vote-tap'
                        : 'border-blue-500/30 bg-blue-500/5 text-[var(--text)] hover:border-blue-500/70 hover:bg-blue-500/15 hover:-translate-y-0.5 active:scale-[0.97] active:bg-blue-500/15 cursor-pointer'
                      }
                      ${activeOption && activeOption !== 'b' ? 'opacity-30' : ''}
                      transition-all duration-200
                    `}
                  >
                    <span className="block text-xs font-black uppercase tracking-widest text-blue-400 mb-2">{copy.optionB}</span>
                    {scenario.optionB}
                  </button>
                </div>
              )
            })()}

            {/* Grace countdown UI */}
            {pendingOption && graceSecsLeft > 0 && !submittedOption && (
              <div className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center" aria-live="polite">
                <p className="text-white font-bold text-sm mb-1">
                  {copy.graceCountdown(graceSecsLeft)}
                </p>
                <p className="text-xs text-[var(--muted)] mb-3">{copy.graceHint}</p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={cancelGrace}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold text-[var(--muted)] border border-[var(--border)] hover:bg-white/5 transition-colors"
                  >
                    {copy.graceUndo}
                  </button>
                  <button
                    onClick={confirmNow}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-white/10 border border-white/20 hover:bg-white/15 transition-colors"
                  >
                    {copy.graceConfirm}
                  </button>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center gap-2 text-[var(--muted)] text-sm mt-8">
                <Spinner />
                <span>{copy.counting}</span>
              </div>
            )}

            {voteError && (
              <p className="text-center text-red-400 text-sm mt-8">
                {copy.voteError}
              </p>
            )}

            <p className="text-center text-xs text-[var(--muted)] mt-10 opacity-60">
              {copy.disclaimer}
            </p>

            {!submittedOption && !loading && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleShareQuestion}
                  aria-label={copy.shareQuestion}
                  className="text-xs text-[var(--muted)] hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <Share2 size={12} aria-hidden />
                  {questionLinkCopied ? copy.shareQuestionCopied : copy.shareQuestion}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

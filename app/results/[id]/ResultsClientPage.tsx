'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import type { Scenario } from '@/lib/scenarios'
import Link from 'next/link'
import AdSlot from '@/components/AdSlot'
import { createClient } from '@/lib/supabase/client'
import { getExpertInsight } from '@/lib/expert-insights'
import type { DynamicExpertInsight } from '@/lib/expert-insights'
import type { DynamicScenario } from '@/lib/dynamic-scenarios'
import { track } from '@/lib/gtag'
import { SOCIAL_LINKS } from '@/lib/social-links'

interface Props {
  scenario: Scenario
  votes: { a: number; b: number }
  pctA: number
  pctB: number
  total: number
  voted: 'a' | 'b' | null
  nextId: string | null
  /** Optional locale prefix for share URLs, e.g. "/it" for Italian results */
  sharePrefix?: string
  pathCategory?: string
  pathStep?: number
  pathTarget?: number
  nextPathId?: string | null
  pathCategoryLabel?: string
  pathCategoryEmoji?: string
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://splitvote.io'
const SLOT_RESULTS = process.env.NEXT_PUBLIC_ADSENSE_SLOT_RESULTS ?? 'TODO'

// ── Copy objects ────────────────────────────────────────────────────────────

const EN_COPY = {
  back:              '← All dilemmas',
  votesWorldwide:    (n: number) => `${n.toLocaleString()} votes worldwide`,
  tieTitle:          '🤝 The world is perfectly split!',
  tieDesc:           '50/50 — this dilemma divides humanity equally.',
  minorityTitle:     (pct: number) => `🔥 You're in the ${pct}% minority.`,
  minorityDesc:      'Most people see this differently. Are you an outsider — or ahead of the curve?',
  majorityTitle:     (pct: number) => `🌍 ${pct}% of the world agrees with you.`,
  majorityDesc:      "You're with the majority — but plenty of people see it differently.",
  closeSplitTitle:   (pct: number) => `You're on the ${pct}% side — almost a coin flip.`,
  closeSplitDesc:    'The world barely leans one way. A handful of votes could change it.',
  landslideTitle:    (pct: number) => `🌊 ${pct}% of the world agrees with you.`,
  landslideDesc:     'Almost everyone leans this way. But does the majority always make right?',
  youVoted:          'You voted:',
  majority:          (pct: number, label: string) => `🌍 ${pct}% of the world chose: `,
  majorityLabel:     (label: string) => label,
  tie:               '🤝 The world is perfectly split.',
  feedbackQuestion:  'Was this dilemma interesting?',
  feedbackFire:      '🔥 Interesting',
  feedbackFireVoted: '🔥 Voted!',
  feedbackDown:      '👎 Not for me',
  feedbackDownVoted: '👎 Noted',
  feedbackThanks:    'Thanks for the feedback!',
  challengeTitle:    '⚡ Challenge a friend!',
  challengeDesc:     "Send them the link — they'll see your result only after they vote.",
  challengeCTA:      '🔗 Copy challenge link',
  challengeCopied:   '✅ Challenge link copied!',
  shareTitle:        '🔥 Share your result',
  saveInstagram:     'Save for Instagram',
  copyTiktok:        'Copy TikTok caption',
  copyTiktokDone:    '✅ Copied!',
  shareX:            '𝕏 Share on X',
  whatsapp:          '💬 WhatsApp',
  copyLink:          '🔗',
  copyLinkDone:      '✅',
  copyDiscord:       'Copy for Discord',
  copyDiscordDone:   '✅ Copied!',
  telegram:          '✈️ Telegram',
  storyTitle:        '📱 Share as Story',
  storyDesc:         'Download a 9:16 card for Instagram Stories or TikTok.',
  storyShare:        'Share Story',
  storySharing:      'Loading…',
  storyShared:       'Shared!',
  storyDownload:     'Download Card',
  storyTiktok:       'TikTok Caption',
  storyIg:           'IG Caption',
  storyNote:         'Auto-posting is not available from the web. Upload the PNG manually.',
  nextDilemma:       'Next dilemma →',
  browsedAll:        "You've answered all available dilemmas. Browse all →",
  allDilemmas:       'All dilemmas',
  aggregateNote:     'Results based on anonymous votes from users worldwide.',
  anonCTAHeadline:   'Want to track your choices over time?',
  anonCTABody:       'Create a free account to track your answers, earn badges, and grow your Pixie.',
  anonCTAButton:     'Join free — it takes 10 seconds',
  webShareCTA:       '📤 Share result',
  webShareSub:       'Send via messages, stories, or copy link',
  webShareCopied:    '✅ Link copied!',
  moreShareTitle:    'More share options',
  moreShareSub:      'Instagram, TikTok, X, WhatsApp, Discord, Telegram, story card',
  expertInsightCTA:  'Read the expert analysis',
  insightWhySplit:   'Why people split',
  insightYourChoice: 'What your choice may suggest',
  pathProgress:      (step: number, target: number) => `${step}/${target} complete`,
  pathContinue:      'Continue path →',
  pathDone:          '🎉 Path complete!',
  pathDoneDesc:      (label: string) => `You finished the ${label} path. Try another category.`,
  pathExhausted:     'No fresh dilemmas left in this path',
  pathOtherCats:     'Browse categories',
  comparing:         'Comparing your answer with the world…',
  noVotesYet:        'Not enough votes yet to show a result.',
}

const IT_COPY = {
  back:              '← Tutti i dilemmi',
  votesWorldwide:    (n: number) => `${n.toLocaleString('it-IT')} voti nel mondo`,
  tieTitle:          '🤝 Il mondo è perfettamente diviso!',
  tieDesc:           '50/50 — questo dilemma divide l\'umanità equamente.',
  minorityTitle:     (pct: number) => `🔥 Sei nel ${pct}% della minoranza.`,
  minorityDesc:      "La maggior parte delle persone la vede diversamente. Sei un outsider — o semplicemente in anticipo?",
  majorityTitle:     (pct: number) => `🌍 Il ${pct}% del mondo è d'accordo con te.`,
  majorityDesc:      'Sei con la maggioranza — ma molti la vedono diversamente.',
  closeSplitTitle:   (pct: number) => `Sei nel ${pct}% — quasi un tiro di moneta.`,
  closeSplitDesc:    'Il mondo si inclina appena da una parte. Pochi voti potrebbero cambiare tutto.',
  landslideTitle:    (pct: number) => `🌊 Il ${pct}% del mondo è d'accordo con te.`,
  landslideDesc:     'Quasi tutti si inclinano in questa direzione. Ma la maggioranza ha sempre ragione?',
  youVoted:          'Hai votato:',
  majority:          (pct: number, label: string) => `🌍 Il ${pct}% del mondo ha scelto: `,
  majorityLabel:     (label: string) => label,
  tie:               '🤝 Il mondo è perfettamente diviso.',
  feedbackQuestion:  'Questo dilemma ti è piaciuto?',
  feedbackFire:      '🔥 Interessante',
  feedbackFireVoted: '🔥 Votato!',
  feedbackDown:      '👎 Non fa per me',
  feedbackDownVoted: '👎 Registrato',
  feedbackThanks:    'Grazie per il feedback!',
  challengeTitle:    '⚡ Sfida un amico!',
  challengeDesc:     'Mandagli il link — vedrà il tuo risultato solo dopo aver votato.',
  challengeCTA:      '🔗 Copia link sfida',
  challengeCopied:   '✅ Link sfida copiato!',
  shareTitle:        '🔥 Condividi il tuo risultato',
  saveInstagram:     'Salva per Instagram',
  copyTiktok:        'Copia caption TikTok',
  copyTiktokDone:    '✅ Copiato!',
  shareX:            '𝕏 Condividi su X',
  whatsapp:          '💬 WhatsApp',
  copyLink:          '🔗',
  copyLinkDone:      '✅',
  copyDiscord:       'Copia per Discord',
  copyDiscordDone:   '✅ Copiato!',
  telegram:          '✈️ Telegram',
  storyTitle:        '📱 Condividi come Storia',
  storyDesc:         'Scarica una card 9:16 per Instagram Stories o TikTok.',
  storyShare:        'Condividi Storia',
  storySharing:      'Caricamento…',
  storyShared:       'Condiviso!',
  storyDownload:     'Scarica Card',
  storyTiktok:       'Caption TikTok',
  storyIg:           'Caption IG',
  storyNote:         'La pubblicazione automatica non è disponibile dal web. Carica il PNG manualmente.',
  nextDilemma:       'Prossimo dilemma →',
  browsedAll:        'Hai risposto a tutti i dilemmi disponibili. Sfoglia tutti →',
  allDilemmas:       'Tutti i dilemmi',
  aggregateNote:     'Risultati basati su voti anonimi di utenti da tutto il mondo.',
  anonCTAHeadline:   'Vuoi tracciare le tue scelte nel tempo?',
  anonCTABody:       'Crea un account gratis per tenere traccia delle risposte, guadagnare badge e far crescere il tuo Pixie.',
  anonCTAButton:     'Crea profilo gratis — ci vogliono 10 secondi',
  webShareCTA:       '📤 Condividi risultato',
  webShareSub:       'Invia via messaggi, storie o copia il link',
  webShareCopied:    '✅ Link copiato!',
  moreShareTitle:    'Altre opzioni di condivisione',
  moreShareSub:      'Instagram, TikTok, X, WhatsApp, Discord, Telegram, story card',
  expertInsightCTA:  'Leggi l\'analisi esperta',
  insightWhySplit:   'Perché le persone si dividono',
  insightYourChoice: 'Cosa potrebbe suggerire la tua scelta',
  pathProgress:      (step: number, target: number) => `${step}/${target} completato`,
  pathContinue:      'Continua il percorso →',
  pathDone:          '🎉 Percorso completato!',
  pathDoneDesc:      (label: string) => `Hai completato il percorso di ${label}. Prova un'altra categoria.`,
  pathExhausted:     'Non ci sono altri dilemmi nuovi in questo percorso',
  pathOtherCats:     'Sfoglia categorie',
  comparing:         'Confrontiamo la tua risposta con il mondo…',
  noVotesYet:        'Non ci sono ancora abbastanza voti per mostrare un risultato.',
}

export default function ResultsClientPage({ scenario, pctA, pctB, total, voted, nextId, sharePrefix = '', pathCategory, pathStep, pathTarget, nextPathId, pathCategoryLabel, pathCategoryEmoji }: Props) {
  const [mounted, setMounted] = useState(false)
  const [revealed, setRevealed] = useState(!voted || total < 10)
  const [copied, setCopied] = useState(false)
  const [webShareCopied, setWebShareCopied] = useState(false)
  const [feedbackGiven, setFeedbackGiven] = useState<'fire' | 'down' | null>(null)
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [captionCopied, setCaptionCopied] = useState(false)
  const [discordCopied, setDiscordCopied] = useState(false)
  const [challengeCopied, setChallengeCopied] = useState(false)
  const [storySharing, setStorySharing] = useState(false)
  const [storyShared, setStoryShared] = useState(false)
  const [igCaptionCopied, setIgCaptionCopied] = useState(false)
  const [isAnon, setIsAnon] = useState(false)
  const [referralCode, setReferralCode] = useState<string | null>(null)

  const isIT = sharePrefix === '/it'
  const copy = isIT ? IT_COPY : EN_COPY
  const locale = isIT ? 'it' : 'en'
  const baseInsight = getExpertInsight(scenario.category, locale)
  const dynamicOverride: DynamicExpertInsight | undefined = locale === 'it'
    ? (scenario as Partial<DynamicScenario>).expertInsightIt
    : (scenario as Partial<DynamicScenario>).expertInsightEn
  const expertInsight = dynamicOverride
    ? {
        ...baseInsight,
        ...(dynamicOverride.body && { body: dynamicOverride.body }),
        ...(dynamicOverride.whyPeopleSplit && { whyPeopleSplit: dynamicOverride.whyPeopleSplit }),
        ...(dynamicOverride.whatYourAnswerMaySuggest && { whatYourAnswerMaySuggest: dynamicOverride.whatYourAnswerMaySuggest }),
      }
    : baseInsight

  useEffect(() => {
    setMounted(true)
    // Restore feedback from cookie
    const cookie = document.cookie.split('; ').find(c => c.startsWith(`sv_fb_${scenario.id}=`))
    if (cookie) {
      const val = cookie.split('=')[1] as 'fire' | 'down'
      if (val === 'fire' || val === 'down') setFeedbackGiven(val)
    }
    // Detect anonymous user + fetch referral code for challenge links
    const supabase = createClient()
    supabase.auth.getUser()
      .then(async ({ data: { user } }) => {
        setIsAnon(!user)
        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('referral_code')
            .eq('user_id', user.id)
            .single()
          if (data?.referral_code) setReferralCode(data.referral_code)
        }
      })
      .catch(() => {/* non-blocking */})
    // Track result view
    track('result_viewed', {
      scenario_id: scenario.id,
      category: scenario.category,
      locale,
      voted: voted ?? 'none',
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario.id])

  useLayoutEffect(() => {
    if (!voted || total < 10) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(true)
    }
  }, [voted, total])

  useEffect(() => {
    if (!voted || total < 10) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setTimeout(() => setRevealed(true), 500)
    return () => clearTimeout(t)
  }, [voted, total])

  const shareUrl = `${BASE_URL}${sharePrefix}/play/${scenario.id}`
  const challengeUrl = referralCode
    ? `${BASE_URL}${sharePrefix}/play/${scenario.id}?challenge=1&ref=${referralCode}`
    : `${BASE_URL}${sharePrefix}/play/${scenario.id}?challenge=1`
  const ogImageUrl = `${BASE_URL}/api/og?id=${scenario.id}`
  const storyCardUrl = `${BASE_URL}/api/story-card?id=${scenario.id}&locale=${locale}`

  const winnerOption = pctA > pctB ? 'a' : pctA < pctB ? 'b' : null
  const majorityPct = pctA > pctB ? pctA : pctB
  const majorityLabel = pctA > pctB ? scenario.optionA : scenario.optionB

  // Minority / majority reveal
  const pctVoted = voted === 'a' ? pctA : voted === 'b' ? pctB : null
  const isMinority = pctVoted !== null && pctVoted < 50
  const isTie = total > 0 && pctA === pctB
  const isClose              = total > 0 && !isTie && Math.abs(pctA - pctB) <= 10
  const isAggregateLandslide = total > 0 && !isTie && majorityPct >= 70
  const isUserOnLandslideSide = isAggregateLandslide && pctVoted === majorityPct

  // Aggregate share text — always uses majority stats, never reveals user's own vote
  const webShareText = total === 0
    ? (isIT
        ? `Cosa faresti?\n"${scenario.question}"`
        : `What would you choose?\n"${scenario.question}"`)
    : isTie
    ? (isIT
        ? `Questo divide il mondo esattamente 50/50. Tu cosa sceglieresti?\n"${scenario.question}"`
        : `This one splits the world exactly 50/50. What would you choose?\n"${scenario.question}"`)
    : isClose
    ? (isIT
        ? `${pctA}% vs ${pctB}% — il mondo non riesce a decidere. Da che parte stai?\n"${scenario.question}"`
        : `${pctA}% vs ${pctB}% — the world can barely decide. Which side are you on?\n"${scenario.question}"`)
    : isAggregateLandslide
    ? (isIT
        ? `Il ${majorityPct}% del mondo ha scelto la stessa cosa. Sei d'accordo?\n"${scenario.question}"`
        : `${majorityPct}% of the world agrees on this one. Do you?\n"${scenario.question}"`)
    : (isIT
        ? `Il ${majorityPct}% ha scelto "${majorityLabel}". Tu cosa faresti?\n"${scenario.question}"`
        : `${majorityPct}% chose "${majorityLabel}". What would you do?\n"${scenario.question}"`)

  // Platform share texts
  const twitterText = total === 0
    ? (isIT
        ? `Cosa faresti? 🌍`
        : `What would YOU choose? 🌍`)
    : isTie
    ? (isIT
        ? `Questo divide il mondo 50/50 🤝 Tu da che parte stai?`
        : `This one splits the world 50/50 🤝 Which side are you on?`)
    : isClose
    ? (isIT
        ? `Il mondo è quasi diviso a metà. ${pctA}% vs ${pctB}% 🌍 Tu cosa faresti?`
        : `The world is almost split on this. ${pctA}% vs ${pctB}% 🌍 What would YOU choose?`)
    : isAggregateLandslide
    ? (isIT
        ? `Il ${majorityPct}% del mondo è d'accordo su questa. Sei tra loro? 🌊`
        : `${majorityPct}% of the world agrees on this one. Are you? 🌊`)
    : (isIT
        ? `Il ${majorityPct}% ha scelto: "${majorityLabel}". Tu cosa sceglieresti? 🌍`
        : `${majorityPct}% chose: "${majorityLabel}". What would YOU choose? 🌍`)
  const tiktokCaption = isIT
    ? (total === 0
        ? `E tu cosa faresti? 😱\n\n"${scenario.question}"\n\n🔗 Vota su splitvote.io\n${SOCIAL_LINKS.tiktokHandle}\n\n#wouldyourather #dilemmamorale #viral #splitvote #psicologia #dibattito`
        : `Il ${pctA}% lo farebbe davvero… e tu? 😱\n\n"${scenario.question}"\n\n🔗 Vota su splitvote.io\n${SOCIAL_LINKS.tiktokHandle}\n\n#wouldyourather #dilemmamorale #viral #splitvote #psicologia #dibattito`)
    : (total === 0
        ? `What would you do? 😱\n\n"${scenario.question}"\n\n🔗 Vote at splitvote.io\n${SOCIAL_LINKS.tiktokHandle}\n\n#wouldyourather #moraldilemma #viral #splitvote #psychology #debate`
        : `${pctA}% of the world would do this… would you? 😱\n\n"${scenario.question}"\n\n🔗 Vote at splitvote.io\n${SOCIAL_LINKS.tiktokHandle}\n\n#wouldyourather #moraldilemma #viral #splitvote #psychology #debate`)
  const instagramCaption = isIT
    ? (total === 0
        ? `"${scenario.question}"\n\nTu cosa sceglieresti? 👇\n🔗 splitvote.io — ${SOCIAL_LINKS.instagramHandle}\n\n#dilemmamorale #wouldyourather #psicologia #viral #splitvote`
        : `"${scenario.question}"\n\n${pctA}% ha scelto ${scenario.optionA}. ${pctB}% ha scelto ${scenario.optionB}.\n\nTu cosa sceglieresti? 👇\n🔗 splitvote.io — ${SOCIAL_LINKS.instagramHandle}\n\n#dilemmamorale #wouldyourather #psicologia #viral #splitvote`)
    : (total === 0
        ? `"${scenario.question}"\n\nWhat would YOU choose? 👇\n🔗 splitvote.io — ${SOCIAL_LINKS.instagramHandle}\n\n#moraldilemma #wouldyourather #psychology #viral #splitvote`
        : `"${scenario.question}"\n\n${pctA}% chose ${scenario.optionA}. ${pctB}% chose ${scenario.optionB}.\n\nWhat would YOU choose? 👇\n🔗 splitvote.io — ${SOCIAL_LINKS.instagramHandle}\n\n#moraldilemma #wouldyourather #psychology #viral #splitvote`)
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(shareUrl)}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${webShareText}\n${shareUrl}`)}`
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(webShareText)}`
  const discordText = isIT
    ? (total === 0
        ? `${scenario.emoji} **"${scenario.question}"**\nNessun voto ancora — tu cosa sceglieresti?\n🔗 ${shareUrl}`
        : `${scenario.emoji} **"${scenario.question}"**\nIl mondo è diviso **${pctA}%** vs **${pctB}%** — tu cosa sceglieresti?\n🔗 ${shareUrl}`)
    : (total === 0
        ? `${scenario.emoji} **"${scenario.question}"**\nNo votes yet — what would YOU choose?\n🔗 ${shareUrl}`
        : `${scenario.emoji} **"${scenario.question}"**\nThe world is split **${pctA}%** vs **${pctB}%** — what would YOU choose?\n🔗 ${shareUrl}`)

  // Fire-and-forget server-side event tracking for mission verification.
  // Silently ignored if user is not authenticated (server returns 401).
  const trackServerEvent = (eventType: string) => {
    fetch('/api/events/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType, scenarioId: scenario.id }),
    }).catch(() => { /* non-blocking */ })
  }

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    track('copy_link_clicked', { scenario_id: scenario.id, locale })
    trackServerEvent('copy_result_link')
    setTimeout(() => setCopied(false), 2000)
  }

  const copyCaption = () => {
    navigator.clipboard.writeText(tiktokCaption)
    setCaptionCopied(true)
    track('share_clicked', { target: 'tiktok_caption', scenario_id: scenario.id, locale })
    setTimeout(() => setCaptionCopied(false), 2000)
  }

  const copyDiscord = () => {
    navigator.clipboard.writeText(discordText)
    setDiscordCopied(true)
    track('share_clicked', { target: 'discord', scenario_id: scenario.id, locale })
    setTimeout(() => setDiscordCopied(false), 2000)
  }

  const copyChallenge = () => {
    navigator.clipboard.writeText(challengeUrl)
    setChallengeCopied(true)
    track('share_clicked', { target: 'challenge', scenario_id: scenario.id, locale })
    setTimeout(() => setChallengeCopied(false), 2000)
  }

  const sendFeedback = async (type: 'fire' | 'down') => {
    if (feedbackGiven || feedbackLoading) return
    setFeedbackLoading(true)
    try {
      await fetch(`/api/dilemmas/${scenario.id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      })
      setFeedbackGiven(type)
    } finally {
      setFeedbackLoading(false)
    }
  }

  const copyIgCaption = () => {
    navigator.clipboard.writeText(instagramCaption)
    setIgCaptionCopied(true)
    track('share_clicked', { target: 'instagram_caption', scenario_id: scenario.id, locale })
    setTimeout(() => setIgCaptionCopied(false), 2000)
  }

  const handleWebShare = async () => {
    track('share_clicked', { target: 'web_share', scenario_id: scenario.id, locale })
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: scenario.question, text: webShareText, url: shareUrl })
        trackServerEvent('share_result')
      } catch { /* user cancelled — do not track */ }
    } else {
      await navigator.clipboard.writeText(`${webShareText}\n${shareUrl}`)
      setWebShareCopied(true)
      trackServerEvent('copy_result_link')
      setTimeout(() => setWebShareCopied(false), 2000)
    }
  }

  // Share vertical story card via Web Share API (PNG only — SVG is rejected by Instagram/TikTok)
  const shareStory = async () => {
    if (!mounted) return
    track('story_card_clicked', { scenario_id: scenario.id, locale })
    setStorySharing(true)
    const filename = `splitvote-story-${scenario.id}.png`
    try {
      const res = await fetch(storyCardUrl)
      const blob = await res.blob()
      const file = new File([blob], filename, { type: 'image/png' })

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `SplitVote — ${scenario.question.slice(0, 60)}`,
          text: `${pctA}% vs ${pctB}% — ${locale === 'it' ? 'Cosa faresti?' : 'What would you choose?'} 👇`,
        })
        setStoryShared(true)
        trackServerEvent('story_card_share')
      } else if (navigator.share) {
        // File sharing not supported — share URL instead
        await navigator.share({ title: 'SplitVote', url: shareUrl, text: `${pctA}% vs ${pctB}%` })
        setStoryShared(true)
        trackServerEvent('story_card_share')
      } else {
        // No Web Share API — trigger download
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = filename
        link.click()
        trackServerEvent('story_card_download')
      }
    } catch {
      // Share cancelled or failed — fallback to direct download
      const link = document.createElement('a')
      link.href = storyCardUrl
      link.download = filename
      link.click()
      trackServerEvent('story_card_download')
    } finally {
      setStorySharing(false)
    }
  }

  // S5c — show sticky bar only on standard CTA (no path flow, nextId available)
  const showStickyNext = !pathCategory && !!nextId

  return (
    <>
    <div className={`max-w-2xl mx-auto px-4 pt-16 ${showStickyNext ? 'pb-28 sm:pb-16' : 'pb-16'}`}>
      <Link href={sharePrefix || '/'} className="text-sm text-[var(--muted)] hover:text-white transition-colors mb-8 inline-block">
        {copy.back}
      </Link>

      {/* Question recap */}
      <div className="text-center mb-10">
        <span className="text-5xl mb-4 block">{scenario.emoji}</span>
        <h1 className="text-xl md:text-2xl font-bold text-[var(--text)] leading-snug mb-2">
          {scenario.question}
        </h1>
        <p className="text-sm text-[var(--muted)]">
          {copy.votesWorldwide(total)}
        </p>
      </div>

      {/* ── Minority / Majority reveal ── */}
      {voted && pctVoted !== null && total >= 10 && (
        !revealed ? (
          <div className="text-center mb-6 rounded-2xl py-5 px-6 border border-white/10 bg-white/5">
            <p className="text-sm text-[var(--muted)] animate-pulse">{copy.comparing}</p>
          </div>
        ) : (
        <div className={`text-center mb-6 rounded-2xl py-5 px-6 border ${
          isTie || isClose
            ? 'border-purple-500/30 bg-purple-500/10'
            : isMinority
            ? 'border-orange-500/30 bg-orange-500/10'
            : 'border-green-500/30 bg-green-500/10'
        }`}>
          {isTie ? (
            <>
              <p className="text-2xl font-black text-purple-400 mb-1">{copy.tieTitle}</p>
              <p className="text-sm text-[var(--muted)]">{copy.tieDesc}</p>
            </>
          ) : isClose ? (
            <>
              <p className="text-2xl font-black text-purple-400 mb-1">
                {copy.closeSplitTitle(pctVoted)}
              </p>
              <p className="text-sm text-[var(--muted)]">
                {copy.closeSplitDesc}
              </p>
            </>
          ) : isMinority ? (
            <>
              <p className="text-2xl font-black text-orange-400 mb-1">
                {copy.minorityTitle(pctVoted)}
              </p>
              <p className="text-sm text-[var(--muted)]">
                {copy.minorityDesc}
              </p>
            </>
          ) : isUserOnLandslideSide ? (
            <>
              <p className="text-2xl font-black text-green-400 mb-1">
                {copy.landslideTitle(pctVoted)}
              </p>
              <p className="text-sm text-[var(--muted)]">
                {copy.landslideDesc}
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl font-black text-green-400 mb-1">
                {copy.majorityTitle(pctVoted)}
              </p>
              <p className="text-sm text-[var(--muted)]">
                {copy.majorityDesc}
              </p>
            </>
          )}
        </div>
        )
      )}

      {/* Your vote badge */}
      {voted && (
        <div className={`text-center mb-6 text-sm font-semibold rounded-xl py-3 border
          ${voted === 'a'
            ? 'text-red-300 border-red-500/30 bg-red-500/10'
            : 'text-blue-300 border-blue-500/30 bg-blue-500/10'
          }`}>
          {copy.youVoted} {voted === 'a' ? scenario.optionA : scenario.optionB}
        </div>
      )}

      {/* Result bars */}
      <div className="space-y-4 mb-10">
        {/* Option A */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-semibold text-[var(--text)]">{scenario.optionA}</span>
            <span className={`text-lg font-black ${winnerOption === 'a' ? 'text-red-400' : 'text-[var(--muted)]'}${!revealed ? ' invisible' : ''}`}>
              {pctA}%
            </span>
          </div>
          <div className="h-6 bg-[var(--border)] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${winnerOption === 'a' ? 'bg-red-500' : 'bg-red-500/50'}`}
              style={{ width: mounted && revealed ? `${pctA}%` : '0%' }}
            />
          </div>
        </div>

        {/* Option B */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-semibold text-[var(--text)]">{scenario.optionB}</span>
            <span className={`text-lg font-black ${winnerOption === 'b' ? 'text-blue-400' : 'text-[var(--muted)]'}${!revealed ? ' invisible' : ''}`}>
              {pctB}%
            </span>
          </div>
          <div className="h-6 bg-[var(--border)] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${winnerOption === 'b' ? 'bg-blue-500' : 'bg-blue-500/50'}`}
              style={{ width: mounted && revealed ? `${pctB}%` : '0%' }}
            />
          </div>
        </div>
      </div>

      {/* Winner label */}
      {total > 0 && (
        <div className={`text-center mb-3 text-[var(--muted)] text-sm${!revealed ? ' invisible' : ''}`}>
          {pctA === pctB ? (
            <span>{copy.tie}</span>
          ) : (
            <span>
              {copy.majority(majorityPct, majorityLabel)}
              <em className="not-italic text-white">{majorityLabel}</em>
            </span>
          )}
        </div>
      )}

      {/* Aggregate attribution */}
      {total > 0 && (
        <p className={`text-center text-xs text-[var(--muted)] mb-8 opacity-60${!revealed ? ' invisible' : ''}`}>
          {copy.aggregateNote}
        </p>
      )}

      {/* No votes yet placeholder */}
      {total === 0 && (
        <p className="text-center text-sm text-[var(--muted)] mb-8">
          {copy.noVotesYet}
        </p>
      )}

      {/* ── Next dilemma / Path CTA ── */}
      <div className="mb-8">
        {pathCategory && pathStep !== undefined && pathTarget !== undefined ? (
          <div className="flex flex-col gap-3">
            {/* Path progress indicator */}
            <div className="flex items-center gap-2 text-xs text-[var(--muted)] justify-center mb-1">
              {pathCategoryEmoji && <span aria-hidden>{pathCategoryEmoji}</span>}
              <span className="font-bold uppercase tracking-widest">{pathCategoryLabel ?? pathCategory}</span>
              <span className="text-white/25">·</span>
              <span>{copy.pathProgress(pathStep, pathTarget)}</span>
            </div>

            {pathStep >= pathTarget ? (
              /* Path complete */
              <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-5 text-center">
                <p className="text-green-400 font-black text-lg mb-1">{copy.pathDone}</p>
                <p className="text-sm text-[var(--muted)] mb-4">{copy.pathDoneDesc(pathCategoryLabel ?? pathCategory)}</p>
                <Link
                  href={`${sharePrefix}/category/${pathCategory}`}
                  className="inline-flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 text-green-300 font-bold text-sm px-5 py-2.5 rounded-xl transition-colors"
                >
                  {copy.pathOtherCats}
                </Link>
              </div>
            ) : nextPathId ? (
              /* Continue path */
              <Link
                href={`${sharePrefix}/play/${nextPathId}?path=${pathCategory}&step=${pathStep + 1}&target=${pathTarget}`}
                onClick={() => track('path_continue_clicked', { scenario_id: scenario.id, locale, path: pathCategory, step: pathStep + 1 })}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-6 py-3.5 transition-colors text-center"
              >
                {copy.pathContinue}
              </Link>
            ) : (
              /* No fresh dilemmas in path */
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center">
                <p className="text-sm text-[var(--muted)]">{copy.pathExhausted}</p>
              </div>
            )}

            <Link
              href={sharePrefix || '/'}
              className="flex items-center justify-center border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--border)] text-[var(--text)] font-semibold text-sm px-6 py-3.5 rounded-xl transition-colors text-center"
            >
              {copy.allDilemmas}
            </Link>
          </div>
        ) : (
          /* Standard CTA */
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={nextId ? `${sharePrefix}/play/${nextId}` : sharePrefix || '/'}
              onClick={() => nextId && track('next_dilemma_clicked', { scenario_id: scenario.id, locale, source: 'results_bottom' })}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-6 py-3.5 transition-colors text-center"
            >
              {nextId ? copy.nextDilemma : copy.browsedAll}
            </Link>
            {nextId && (
              <Link
                href={sharePrefix || '/'}
                className="flex-1 flex items-center justify-center border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--border)] text-[var(--text)] font-semibold text-sm px-6 py-3.5 rounded-xl transition-colors text-center"
              >
                {copy.allDilemmas}
              </Link>
            )}
          </div>
        )}
      </div>

      {/* ── COLLAPSIBLE: Expert Insight (S5b — collapsed by default) ── */}
      <details className="group mb-6">
        <summary
          className="cursor-pointer list-none rounded-2xl border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-all p-4 flex items-center justify-between gap-3 min-h-[56px]"
          onClick={() => track('expert_insight_toggled', { scenario_id: scenario.id, locale })}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span aria-hidden className="text-base leading-none flex-shrink-0">💡</span>
            <span className="text-sm font-bold text-cyan-300 truncate">
              {copy.expertInsightCTA}
            </span>
            <span className="flex-shrink-0 text-[10px] font-semibold text-cyan-500/70 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20 whitespace-nowrap">
              {expertInsight.expertType}
            </span>
          </div>
          <svg
            className="flex-shrink-0 text-cyan-400/60 group-open:rotate-180 transition-transform"
            width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </summary>

        <div className="mt-3 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              {expertInsight.title}
            </span>
          </div>

        <p className="text-sm text-[var(--text)] leading-relaxed mb-4">
          {expertInsight.body}
        </p>

        <div className="mb-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-cyan-400/70 mb-1.5">
            {copy.insightWhySplit}
          </p>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            {expertInsight.whyPeopleSplit}
          </p>
        </div>

        {voted && (
          <div className="mb-4 rounded-xl border border-cyan-500/15 bg-cyan-500/[0.06] px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-cyan-400/70 mb-1.5">
              {copy.insightYourChoice}
            </p>
            <p className="text-sm text-[var(--text)] leading-relaxed">
              {voted === 'a'
                ? expertInsight.whatYourAnswerMaySuggest.a
                : expertInsight.whatYourAnswerMaySuggest.b}
            </p>
          </div>
        )}

        <p className="text-[11px] text-[var(--muted)] italic">
          {expertInsight.disclaimer}
        </p>
        </div>
      </details>

      {/* ── Primary Web Share CTA ── */}
      <div className="mb-8">
        <button
          onClick={handleWebShare}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold text-base px-6 py-4 transition-all"
        >
          {webShareCopied ? copy.webShareCopied : copy.webShareCTA}
        </button>
        <p className="text-[11px] text-[var(--muted)] text-center mt-2">{copy.webShareSub}</p>
      </div>

      {/* ── Dilemma quality feedback ── */}
      <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center">
        <p className="text-sm font-semibold text-[var(--text)] mb-3">
          {copy.feedbackQuestion}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => sendFeedback('fire')}
            disabled={!!feedbackGiven || feedbackLoading}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all border
              ${feedbackGiven === 'fire'
                ? 'bg-orange-500/20 border-orange-500/50 text-orange-300'
                : feedbackGiven
                ? 'opacity-30 border-[var(--border)] text-[var(--muted)] cursor-not-allowed'
                : 'border-orange-500/30 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 hover:border-orange-500/50'
              }`}
          >
            {feedbackGiven === 'fire' ? copy.feedbackFireVoted : copy.feedbackFire}
          </button>
          <button
            onClick={() => sendFeedback('down')}
            disabled={!!feedbackGiven || feedbackLoading}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all border
              ${feedbackGiven === 'down'
                ? 'bg-[var(--border)] border-white/20 text-[var(--muted)]'
                : feedbackGiven
                ? 'opacity-30 border-[var(--border)] text-[var(--muted)] cursor-not-allowed'
                : 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:bg-[var(--border)] hover:text-white'
              }`}
          >
            {feedbackGiven === 'down' ? copy.feedbackDownVoted : copy.feedbackDown}
          </button>
        </div>
        {feedbackGiven && (
          <p className="mt-3 text-xs text-[var(--muted)]">{copy.feedbackThanks}</p>
        )}
      </div>

      {/* ── Challenge a friend CTA ── */}
      <div className="mb-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5 text-center">
        <p className="text-yellow-400 font-black text-base mb-1">{copy.challengeTitle}</p>
        <p className="text-[var(--muted)] text-sm mb-4">
          {copy.challengeDesc}
        </p>
        <button
          onClick={copyChallenge}
          className="w-full flex items-center justify-center gap-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 text-yellow-300 font-bold text-sm px-5 py-3 rounded-xl transition-colors"
        >
          {challengeCopied ? copy.challengeCopied : copy.challengeCTA}
        </button>
      </div>

      {/* ── COLLAPSIBLE: VIRAL SHARE + STORY CARD (S5a — collapsed by default) ── */}
      <details className="group mb-8">
        <summary
          className="cursor-pointer list-none rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface2)] hover:border-[var(--border-hi)] transition-all p-4 flex items-center justify-between gap-3 min-h-[56px]"
          onClick={() => track('share_more_options_toggled', { scenario_id: scenario.id, locale })}
        >
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-[var(--text)] truncate">
              {copy.moreShareTitle}
            </div>
            <div className="text-[11px] text-[var(--muted)] truncate">
              {copy.moreShareSub}
            </div>
          </div>
          <svg
            className="flex-shrink-0 text-[var(--muted)] group-open:rotate-180 transition-transform"
            width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </summary>

        <div className="mt-3 space-y-8">
      {/* ── VIRAL SHARE SECTION ── */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
        {/* Share card preview */}
        <div className="relative bg-[#0a0a0f] group cursor-pointer" onClick={() => window.open(ogImageUrl, '_blank')}>
          <img
            src={ogImageUrl}
            alt="Share card"
            className="w-full h-auto"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-sm text-white font-bold text-sm px-4 py-2 rounded-xl border border-white/20">
              Open full size ↗
            </span>
          </div>
        </div>

        {/* Share action buttons */}
        <div className="p-5">
          <p className="text-xs text-[var(--muted)] font-semibold uppercase tracking-widest mb-4">
            {copy.shareTitle}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Instagram / Save image — points to PNG story card (OG image is SVG, not accepted by Instagram) */}
            <a
              href={storyCardUrl}
              download={`splitvote-${scenario.id}.png`}
              onClick={() => track('share_clicked', { target: 'instagram_save', scenario_id: scenario.id, locale })}
              className="flex flex-col items-center gap-1.5 bg-gradient-to-br from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 border border-purple-500/30 text-purple-300 font-bold text-sm px-4 py-3.5 rounded-xl transition-all text-center"
            >
              <span className="text-xl">📸</span>
              <span>{copy.saveInstagram}</span>
            </a>

            {/* TikTok caption */}
            <button
              onClick={copyCaption}
              className="flex flex-col items-center gap-1.5 bg-[#010101]/30 hover:bg-[#010101]/50 border border-white/10 text-white font-bold text-sm px-4 py-3.5 rounded-xl transition-all text-center"
            >
              <span className="text-xl">🎵</span>
              <span>{captionCopied ? copy.copyTiktokDone : copy.copyTiktok}</span>
            </button>
          </div>

          <div className="flex gap-2 mb-2">
            {/* X / Twitter */}
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('share_clicked', { target: 'twitter', scenario_id: scenario.id, locale })}
              className="flex-1 flex items-center justify-center gap-2 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border border-[#1DA1F2]/30 text-[#1DA1F2] font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              {copy.shareX}
            </a>

            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('share_clicked', { target: 'whatsapp', scenario_id: scenario.id, locale })}
              className="flex-1 flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              {copy.whatsapp}
            </a>

            {/* Copy link */}
            <button
              onClick={copyLink}
              aria-label={copied ? 'Link copied' : 'Copy link'}
              className="flex items-center justify-center bg-[var(--surface)] hover:bg-[var(--border)] border border-[var(--border)] text-[var(--muted)] hover:text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              {copied ? copy.copyLinkDone : copy.copyLink}
            </button>
          </div>

          <div className="flex gap-2">
            {/* Discord */}
            <button
              onClick={copyDiscord}
              className="flex-1 flex items-center justify-center gap-2 bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border border-[#5865F2]/30 text-[#7289da] font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              <svg width="16" height="12" viewBox="0 0 71 55" fill="currentColor" aria-hidden="true">
                <path d="M60.1 4.9A58.5 58.5 0 0 0 45.5.4a.22.22 0 0 0-.23.11 40.8 40.8 0 0 0-1.8 3.7 54 54 0 0 0-16.2 0 37.4 37.4 0 0 0-1.83-3.7.23.23 0 0 0-.23-.11A58.3 58.3 0 0 0 10.9 4.9a.21.21 0 0 0-.1.08C1.58 18.73-.96 32.16.3 45.4a.24.24 0 0 0 .09.17 58.8 58.8 0 0 0 17.7 8.95.23.23 0 0 0 .25-.08 42 42 0 0 0 3.61-5.88.22.22 0 0 0-.12-.31 38.7 38.7 0 0 1-5.53-2.64.23.23 0 0 1-.02-.37c.37-.28.74-.57 1.1-.86a.22.22 0 0 1 .23-.03c11.6 5.3 24.16 5.3 35.63 0a.22.22 0 0 1 .23.03c.36.29.73.58 1.1.86a.23.23 0 0 1-.02.38 36.4 36.4 0 0 1-5.54 2.63.23.23 0 0 0-.12.32 47.1 47.1 0 0 0 3.6 5.87.22.22 0 0 0 .25.09 58.6 58.6 0 0 0 17.72-8.95.23.23 0 0 0 .09-.16c1.49-15.43-2.5-28.75-10.56-40.6a.18.18 0 0 0-.09-.1zM23.73 37.3c-3.49 0-6.37-3.21-6.37-7.15 0-3.93 2.82-7.15 6.37-7.15 3.57 0 6.42 3.25 6.37 7.15 0 3.94-2.82 7.15-6.37 7.15zm23.54 0c-3.49 0-6.37-3.21-6.37-7.15 0-3.93 2.82-7.15 6.37-7.15 3.57 0 6.42 3.25 6.37 7.15 0 3.94-2.8 7.15-6.37 7.15z"/>
              </svg>
              {discordCopied ? copy.copyDiscordDone : copy.copyDiscord}
            </button>

            {/* Telegram */}
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('share_clicked', { target: 'telegram', scenario_id: scenario.id, locale })}
              className="flex-1 flex items-center justify-center gap-2 bg-[#0088cc]/10 hover:bg-[#0088cc]/20 border border-[#0088cc]/30 text-[#0088cc] font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              {copy.telegram}
            </a>
          </div>
        </div>
      </div>

      {/* ── Share as Story (IG/TikTok vertical card) ── */}
      <div className="rounded-2xl border border-[var(--border)] bg-[#0a0a1a]/60 overflow-hidden">
        <div className="p-5 pb-3">
          <p className="text-xs text-[var(--muted)] font-semibold uppercase tracking-widest mb-3">
            {copy.storyTitle}
          </p>
          <p className="text-xs text-[var(--muted)] mb-4">
            {copy.storyDesc}
          </p>
        </div>

        {/* Story card preview */}
        <div className="relative mx-5 mb-4" style={{ maxWidth: 200 }}>
          <img
            src={storyCardUrl}
            alt="Story card preview"
            className="w-full rounded-xl border border-white/10"
            style={{ aspectRatio: '9/16', objectFit: 'cover' }}
            loading="lazy"
          />
        </div>

        <div className="p-5 pt-0 grid grid-cols-2 gap-2">
          {/* Web Share / Download */}
          <button
            onClick={shareStory}
            disabled={storySharing}
            className="flex flex-col items-center gap-1.5 bg-gradient-to-br from-pink-600/20 to-purple-600/20 hover:from-pink-600/30 hover:to-purple-600/30 border border-pink-500/30 text-pink-300 font-bold text-xs px-3 py-3 rounded-xl transition-all"
          >
            <span className="text-lg">{storyShared ? '✅' : storySharing ? '⏳' : '📤'}</span>
            <span>{storyShared ? copy.storyShared : storySharing ? copy.storySharing : copy.storyShare}</span>
          </button>

          {/* Direct download */}
          <a
            href={storyCardUrl}
            download={`splitvote-story-${scenario.id}.png`}
            onClick={() => {
              track('story_card_clicked', { scenario_id: scenario.id, locale, action: 'download' })
              trackServerEvent('story_card_download')
            }}
            className="flex flex-col items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[var(--muted)] hover:text-white font-bold text-xs px-3 py-3 rounded-xl transition-all"
          >
            <span className="text-lg">⬇️</span>
            <span>{copy.storyDownload}</span>
          </a>

          {/* TikTok caption */}
          <button
            onClick={copyCaption}
            className="flex flex-col items-center gap-1.5 bg-[#010101]/30 hover:bg-[#010101]/50 border border-white/10 text-white font-bold text-xs px-3 py-3 rounded-xl transition-all"
          >
            <span className="text-lg">🎵</span>
            <span>{captionCopied ? copy.copyTiktokDone : copy.storyTiktok}</span>
          </button>

          {/* Instagram caption */}
          <button
            onClick={copyIgCaption}
            className="flex flex-col items-center gap-1.5 bg-gradient-to-br from-purple-600/10 to-pink-600/10 hover:from-purple-600/20 hover:to-pink-600/20 border border-purple-500/20 text-purple-300 font-bold text-xs px-3 py-3 rounded-xl transition-all"
          >
            <span className="text-lg">📸</span>
            <span>{igCaptionCopied ? copy.copyTiktokDone : copy.storyIg}</span>
          </button>
        </div>

        <p className="text-[10px] text-[var(--muted)] text-center pb-4 px-5">
          {copy.storyNote}
        </p>
      </div>
        </div>
      </details>

      {/* ── AdSense — shown after results, before CTA ── */}
      <AdSlot slot={SLOT_RESULTS} className="rounded-2xl mb-8" />

      {/* ── Soft sign-up CTA for anonymous users ── */}
      {isAnon && (
        <div className="rounded-2xl border border-blue-500/25 bg-blue-500/5 p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-sm mb-1">{copy.anonCTAHeadline}</p>
            <p className="text-xs text-[var(--muted)] leading-relaxed">{copy.anonCTABody}</p>
          </div>
          <a
            href={isIT ? '/login?locale=it' : '/login'}
            className="flex-shrink-0 w-full sm:w-auto text-center text-sm font-bold px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors neon-glow-blue min-h-[48px] flex items-center justify-center"
          >
            {copy.anonCTAButton}
          </a>
        </div>
      )}
    </div>

    {/* S5c — Sticky "Next dilemma" CTA: mobile-only fixed bottom bar */}
    {showStickyNext && (
      <div
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 px-4 py-3 border-t border-white/10 bg-[var(--bg)]/90 backdrop-blur-md"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
      >
        <Link
          href={`${sharePrefix ?? ''}/play/${nextId}`}
          onClick={() => track('next_dilemma_clicked', { scenario_id: scenario.id, locale, source: 'results_sticky' })}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm px-6 py-3.5 transition-colors"
        >
          {copy.nextDilemma}
        </Link>
      </div>
    )}
    </>
  )
}

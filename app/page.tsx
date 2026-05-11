import { scenarios } from '@/lib/scenarios'
import type { DynamicScenario } from '@/lib/dynamic-scenarios'
import { getFreshDynamicScenarios, getCachedVotesBatch, getCachedTrendingIds } from '@/lib/cached-data'
import DilemmaGrid from '@/components/DilemmaGrid'
import DilemmaCard from '@/components/DilemmaCard'
import VotedDilemmaCard from '@/components/VotedDilemmaCard'
import AdSlot from '@/components/AdSlot'
import DailyDilemma from '@/components/DailyDilemma'
import PersonalityTeaser from '@/components/PersonalityTeaser'
import JsonLd from '@/components/JsonLd'
import Link from 'next/link'
import type { Scenario } from '@/lib/scenarios'

const SLOT_HOME = process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME ?? 'TODO'
const BASE_URL = 'https://splitvote.io'

function getDailyScenario(all: Scenario[]): Scenario {
  if (all.length === 0) return scenarios[0]
  const daysSinceEpoch = Math.floor(Date.now() / 86_400_000)
  return all[daysSinceEpoch % all.length]
}

export default async function HomePage() {
  let dynamicScenarios: DynamicScenario[] = []
  try {
    dynamicScenarios = (await getFreshDynamicScenarios()).filter(s => s.locale === 'en')
  } catch {
    // Redis unavailable
  }

  const staticIds = new Set(scenarios.map((s) => s.id))
  const uniqueDynamic = dynamicScenarios.filter((d) => !staticIds.has(d.id))
  const allScenarios: Scenario[] = [...uniqueDynamic, ...scenarios]

  const dailyScenario = getDailyScenario(allScenarios)

  // Include daily scenario in the vote batch to avoid a separate fetch.
  // Run vote batch and trending lookup in parallel — both independent once allScenarios is known.
  const batchIds = [...new Set([dailyScenario.id, ...allScenarios.slice(0, 30).map((s) => s.id)])]
  let voteMap = new Map<string, number>()
  let trendingIds: string[] = []
  const [voteMapResult, trendingResult] = await Promise.allSettled([
    getCachedVotesBatch(batchIds).then(obj => new Map(Object.entries(obj))),
    getCachedTrendingIds(allScenarios.map(s => s.id), 6),
  ])
  if (voteMapResult.status === 'fulfilled') voteMap = voteMapResult.value
  if (trendingResult.status === 'fulfilled') trendingIds = trendingResult.value
  const dailyVotes = voteMap.get(dailyScenario.id) ?? 0
  const scenarioById = new Map(allScenarios.map(s => [s.id, s]))

  // Accumulate seen IDs in section priority order so the same scenario ID
  // cannot appear in more than one visible section. Browse All is intentionally
  // exempt — it remains the complete list for SEO and category filtering.
  const seen = new Set<string>([dailyScenario.id])

  const trendingNow = trendingIds
    .map(id => scenarioById.get(id))
    .filter((s): s is Scenario => s !== undefined && !seen.has(s.id))
  trendingNow.forEach(s => seen.add(s.id))

  const mostVoted = [...allScenarios.slice(0, 30)]
    .filter((s) => (voteMap.get(s.id) ?? 0) > 0 && !seen.has(s.id))
    .sort((a, b) => (voteMap.get(b.id) ?? 0) - (voteMap.get(a.id) ?? 0))
    .slice(0, 6)
  mostVoted.forEach(s => seen.add(s.id))

  const newlyGenerated = [...uniqueDynamic]
    .filter(s => !seen.has(s.id))
    .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())
    .slice(0, 6)

  // JSON-LD schemas
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SplitVote',
    url: BASE_URL,
    description: 'Real-time global votes on impossible moral dilemmas.',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Moral Dilemmas — Real-time Global Votes',
    description: 'Impossible ethical questions voted on by people worldwide.',
    url: BASE_URL,
    numberOfItems: allScenarios.length,
    itemListElement: allScenarios.slice(0, 20).map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: s.question,
      url: `${BASE_URL}/play/${s.id}`,
    })),
  }

  return (
    <>
      <JsonLd data={websiteSchema} />
      <JsonLd data={itemListSchema} />

      <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">

        {/* ── Hero ── */}
        <div className="text-center mb-4 sm:mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-6 border border-blue-500/20 neon-glow-blue">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 pulse-glow" />
            Real-time global votes
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight mb-5 sm:mb-6 leading-none">
            What would the
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-purple-400 to-blue-400">
              world choose?
            </span>
          </h1>
          <p className="text-base sm:text-xl text-[var(--muted)] max-w-lg mx-auto leading-relaxed">
            Pick a side. No sign-up. See how the world splits.
          </p>
          <div className="mt-6 flex items-center justify-center">
            <Link
              href="/trending"
              className="text-sm text-[var(--muted)] hover:text-white transition-colors"
            >
              See what&apos;s trending →
            </Link>
          </div>
        </div>

        {/* ── Game loop ── */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mb-4 text-xs text-[var(--muted)]">
          <span className="flex items-center gap-1.5">
            <span className="text-blue-400 font-black neon-text-blue">1.</span> Vote on a dilemma
          </span>
          <span className="text-white/15 hidden sm:inline">→</span>
          <span className="flex items-center gap-1.5">
            <span className="text-purple-400 font-black neon-text-purple">2.</span> See how the world splits
          </span>
          <span className="text-white/15 hidden sm:inline">→</span>
          <span className="flex items-center gap-1.5">
            <span className="text-yellow-400 font-black neon-text-yellow">3.</span> Grow your Pixie
          </span>
        </div>

        {/* ── Trust strip ── */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-8 text-xs text-[var(--muted)]">
          <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> No account required</span>
          <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> Anonymous voting</span>
          <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> See what the world chooses</span>
        </div>

        {/* ── Dilemma of the Day ── */}
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] text-center mb-3">
          Today&apos;s dilemma — vote anonymously
        </p>
        <DailyDilemma scenario={dailyScenario} totalVotes={dailyVotes} />

        {/* ── Personality teaser (logged-in users, 7-day dismiss) ── */}
        <PersonalityTeaser locale="en" />

        {/* ── Trending Now (ranked by recent votes: today + yesterday) ── */}
        {trendingNow.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                <span className="text-orange-400">🔥</span> Trending Now
              </h2>
              <Link href="/trending" className="text-sm text-[var(--muted)] hover:text-white transition-colors">
                See all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {trendingNow.map((s) => (
                <VotedDilemmaCard
                  key={s.id}
                  scenario={s}
                  playHref={`/play/${s.id}`}
                  resultsHref={`/results/${s.id}`}
                  totalVotes={voteMap.get(s.id)}
                  badge="trending"
                  locale="en"
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Most Voted ── */}
        {mostVoted.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                <span className="text-yellow-400">⭐</span> Most Voted
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {mostVoted.map((s) => (
                <VotedDilemmaCard
                  key={s.id}
                  scenario={s}
                  playHref={`/play/${s.id}`}
                  resultsHref={`/results/${s.id}`}
                  totalVotes={voteMap.get(s.id)}
                  locale="en"
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Latest Questions (most recent AI dilemmas) ── */}
        {newlyGenerated.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                <span className="text-green-400">✨</span> Latest Questions
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {newlyGenerated.map((s) => (
                <VotedDilemmaCard
                  key={s.id}
                  scenario={s}
                  playHref={`/play/${s.id}`}
                  resultsHref={`/results/${s.id}`}
                  badge="new"
                  locale="en"
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Browse All ── */}
        <section>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-5">
            📂 Browse All
          </h2>
          <DilemmaGrid scenarios={allScenarios} />
        </section>

        {/* AdSense */}
        <div className="mt-12">
          <AdSlot slot={SLOT_HOME} className="rounded-2xl" />
        </div>
      </div>
    </>
  )
}

import type { DynamicScenario } from '@/lib/dynamic-scenarios'
import { getCachedDynamicScenarios, getCachedVotesBatchDetail } from '@/lib/cached-data'
import { scenarios, CATEGORIES } from '@/lib/scenarios'
import type { Scenario, Category } from '@/lib/scenarios'
import Link from 'next/link'
import type { Metadata } from 'next'
import VotedDilemmaCard from '@/components/VotedDilemmaCard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Top Dilemmas & Trending | SplitVote',
  description: 'All-time most voted moral dilemmas, top categories by total votes, and today\'s fresh AI-generated questions.',
  alternates: { canonical: 'https://splitvote.io/trending' },
  openGraph: {
    title: 'Top Dilemmas & Trending — SplitVote',
    description: 'All-time most voted moral dilemmas and today\'s fresh AI questions. See how the world votes.',
    url: 'https://splitvote.io/trending',
  },
}

function rankIcon(i: number): string {
  if (i === 0) return '🥇'
  if (i === 1) return '🥈'
  if (i === 2) return '🥉'
  return `#${i + 1}`
}

export default async function TrendingPage() {
  // ── All scenarios (static + dynamic approved) ─────────────────
  let dynamicScenarios: DynamicScenario[] = []
  try {
    const all = await getCachedDynamicScenarios()
    const staticIds = new Set(scenarios.map((s) => s.id))
    dynamicScenarios = all
      .filter((d) => !staticIds.has(d.id) && d.locale === 'en')
      .sort((a, b) => {
        const ta = a.approvedAt ? new Date(a.approvedAt).getTime() : a.generatedAt ? new Date(a.generatedAt).getTime() : 0
        const tb = b.approvedAt ? new Date(b.approvedAt).getTime() : b.generatedAt ? new Date(b.generatedAt).getTime() : 0
        return tb - ta
      })
  } catch { /* Redis unavailable */ }

  const allScenarios: Scenario[] = [...dynamicScenarios, ...scenarios]

  // ── Vote detail for leaderboard (one pipeline round-trip) ─────
  let voteDetail = new Map<string, { a: number; b: number }>()
  try {
    const obj = await getCachedVotesBatchDetail(allScenarios.slice(0, 100).map(s => s.id))
    voteDetail = new Map(Object.entries(obj))
  } catch { /* Redis unavailable */ }

  // ── Top dilemmas (all-time most voted) ────────────────────────
  const topDilemmas = allScenarios
    .map(s => {
      const v = voteDetail.get(s.id) ?? { a: 0, b: 0 }
      return { ...s, a: v.a, b: v.b, total: v.a + v.b }
    })
    .filter(s => s.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)

  // ── Most Divisive (closest to 50/50 split, min 20 votes) ──────
  const mostDivisive = allScenarios
    .map(s => {
      const v = voteDetail.get(s.id) ?? { a: 0, b: 0 }
      return { ...s, a: v.a, b: v.b, total: v.a + v.b }
    })
    .filter(s => s.total >= 20)
    .sort((a, b) => {
      const dA = Math.abs((a.a / a.total) * 100 - 50)
      const dB = Math.abs((b.a / b.total) * 100 - 50)
      return dA - dB
    })
    .slice(0, 8)

  // ── Top categories (aggregate vote count per category) ────────
  const catMeta = new Map(
    CATEGORIES.filter(c => c.value !== 'all').map(c => [c.value, { emoji: c.emoji, label: c.label }])
  )
  const categoryMap = new Map<string, { count: number; total: number; emoji: string; label: string }>()
  for (const s of allScenarios) {
    const v = voteDetail.get(s.id) ?? { a: 0, b: 0 }
    const meta = catMeta.get(s.category) ?? { emoji: '', label: s.category }
    const existing = categoryMap.get(s.category) ?? { count: 0, total: 0, ...meta }
    categoryMap.set(s.category, { ...existing, count: existing.count + 1, total: existing.total + v.a + v.b })
  }
  const topCategories = [...categoryMap.entries()]
    .map(([category, data]) => ({ category, ...data }))
    .filter(c => c.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 8)

  // ── AI trending display items (existing section) ──────────────
  const hasDynamic = dynamicScenarios.length > 0
  type DisplayItem = {
    id: string; emoji: string; category: Category
    question: string; optionA: string; optionB: string
    trend?: string; isDynamic: boolean
  }
  const displayItems: DisplayItem[] = hasDynamic
    ? dynamicScenarios.map(s => ({ ...s, isDynamic: true }))
    : scenarios.slice(0, 12).map(s => ({ ...s, isDynamic: false }))

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-block bg-yellow-500/10 text-yellow-400 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-6 border border-yellow-500/20">
          🏆 Live rankings
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
          Top Dilemmas &amp;{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
            Trending
          </span>
        </h1>
        <p className="text-lg text-[var(--muted)] max-w-md mx-auto">
          All-time most voted questions, top categories, and today&apos;s fresh AI dilemmas.
        </p>
      </div>

      {/* ── Most Voted All Time ── */}
      {topDilemmas.length > 0 && (
        <section className="mb-14">
          <h2 className="text-xl font-black tracking-tight mb-5 flex items-center gap-2">
            <span>🏆</span> Most Voted All Time
          </h2>
          <div className="space-y-3">
            {topDilemmas.map((s, i) => {
              const splitA = s.total > 0 ? Math.round((s.a / s.total) * 100) : 0
              const splitB = 100 - splitA
              return (
                <div key={s.id} className="flex items-start gap-3 rounded-2xl bg-[var(--surface)] border border-white/5 p-4 hover:border-white/10 transition-colors">
                  <span className={`text-sm font-black w-8 flex-shrink-0 text-center pt-1 ${i < 3 ? '' : 'text-white/30'}`}>
                    {rankIcon(i)}
                  </span>
                  <span className="text-2xl flex-shrink-0">{s.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs text-[var(--muted)] uppercase tracking-widest font-bold">{s.category}</span>
                      <span className="text-xs text-white/30">·</span>
                      <span className="text-xs text-white/60 font-bold">{s.total.toLocaleString()} votes</span>
                      {s.total >= 10 && (
                        <span className="text-xs text-white/30">{splitA}% / {splitB}%</span>
                      )}
                      {s.total >= 20 && Math.abs(splitA - 50) <= 5 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-purple-500/15 text-purple-400 border border-purple-500/30">⚡ 50/50</span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-[var(--text)] leading-snug mb-2">{s.question}</p>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/play/${s.id}`}
                        className="text-xs bg-white/10 hover:bg-white/20 text-white font-bold px-3 py-1.5 rounded-full transition-colors"
                      >
                        Vote
                      </Link>
                      <Link
                        href={`/results/${s.id}`}
                        className="text-xs text-[var(--muted)] hover:text-white transition-colors"
                      >
                        See results →
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Most Divisive ── */}
      {mostDivisive.length > 0 && (
        <section className="mb-14">
          <h2 className="text-xl font-black tracking-tight mb-2 flex items-center gap-2">
            <span>⚡</span> Most Divisive
          </h2>
          <p className="text-sm text-[var(--muted)] mb-5">
            The world can&apos;t decide. These dilemmas split humanity almost perfectly in half.
          </p>
          <div className="space-y-3">
            {mostDivisive.map((s) => {
              const splitA = Math.round((s.a / s.total) * 100)
              const splitB = 100 - splitA
              return (
                <div key={s.id} className="flex items-start gap-3 rounded-2xl bg-[var(--surface)] border border-purple-500/20 p-4 hover:border-purple-500/40 transition-colors">
                  <span className="text-2xl flex-shrink-0">{s.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-purple-500/15 text-purple-400 border border-purple-500/30">
                        ⚡ {splitA}% / {splitB}%
                      </span>
                      <span className="text-xs text-white/40">{s.total.toLocaleString()} votes</span>
                    </div>
                    <p className="text-sm font-semibold text-[var(--text)] leading-snug mb-2">{s.question}</p>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/play/${s.id}`}
                        className="text-xs bg-white/10 hover:bg-white/20 text-white font-bold px-3 py-1.5 rounded-full transition-colors"
                      >
                        Vote
                      </Link>
                      <Link
                        href={`/results/${s.id}`}
                        className="text-xs text-[var(--muted)] hover:text-white transition-colors"
                      >
                        See results →
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Top Categories ── */}
      {topCategories.length > 0 && (
        <section className="mb-14">
          <h2 className="text-xl font-black tracking-tight mb-5 flex items-center gap-2">
            <span>📊</span> Top Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {topCategories.map(({ category, count, total, emoji, label }, i) => (
              <Link
                key={category}
                href={`/category/${category}`}
                className="rounded-2xl bg-[var(--surface)] border border-white/5 p-4 hover:border-white/15 transition-all text-left"
              >
                <div className="text-xs text-[var(--muted)] font-bold mb-2">#{i + 1}</div>
                <div className="text-2xl mb-1">{emoji}</div>
                <div className="font-black text-white text-sm mb-1">{label}</div>
                <div className="text-xs text-[var(--muted)]">{count} dilemmas</div>
                <div className="text-xs text-white/60 font-bold">{total.toLocaleString()} votes</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Trending Today (AI dilemmas) ── */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
            {hasDynamic ? <><span>✨</span> Trending Today</> : <><span>🔥</span> Popular Dilemmas</>}
          </h2>
          {hasDynamic && (
            <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
              Updated daily
            </span>
          )}
        </div>
        <p className="text-sm text-[var(--muted)] mb-5">
          {hasDynamic
            ? "Moral dilemmas inspired by today's biggest news and trending topics. New ones every day."
            : "The most debated moral dilemmas on SplitVote. AI-generated ones from today's news appear daily."}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {displayItems.map((scenario) => (
            <VotedDilemmaCard
              key={scenario.id}
              scenario={scenario}
              playHref={`/play/${scenario.id}`}
              resultsHref={`/results/${scenario.id}`}
              badge={scenario.isDynamic ? 'ai' : 'trending'}
              locale="en"
            />
          ))}
        </div>
      </section>

      {/* Back link */}
      <div className="mt-12 text-center">
        <Link href="/" className="text-sm text-[var(--muted)] hover:text-white transition-colors">
          ← All dilemmas
        </Link>
      </div>
    </div>
  )
}

import { notFound } from 'next/navigation'
import { getScenario, getFreshNextScenarioId, getFreshNextScenarioIdByCategory, CATEGORIES, scenarios } from '@/lib/scenarios'
import type { Category } from '@/lib/scenarios'
import { getDynamicScenario, getDynamicScenarios } from '@/lib/dynamic-scenarios'
import type { DynamicScenario } from '@/lib/dynamic-scenarios'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { getVotes } from '@/lib/redis'
import VoteClientPage from './VoteClientPage'
import JsonLd from '@/components/JsonLd'
import RelatedDilemmas from '@/components/RelatedDilemmas'
import DilemmaInsightSection from '@/components/DilemmaInsightSection'
import AdSlot from '@/components/AdSlot'
import type { Metadata } from 'next'
import type { Scenario } from '@/lib/scenarios'

const SLOT_PLAY = process.env.NEXT_PUBLIC_ADSENSE_SLOT_PLAY ?? 'TODO'
const BASE_URL = 'https://splitvote.io'

interface Props {
  params: { id: string }
  searchParams: { challenge?: string; ref?: string; path?: string; step?: string; target?: string }
}

export async function generateStaticParams() {
  return scenarios.map((s) => ({ id: s.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const staticScenario = getScenario(params.id)
  const scenario = staticScenario ?? await getDynamicScenario(params.id)
  if (!scenario) return {}

  // Use AI-generated SEO fields when available (dynamic scenarios only)
  const ds = staticScenario ? null : scenario as DynamicScenario
  const title = ds?.seoTitle ?? `${scenario.question.slice(0, 55)}…`
  const description = ds?.seoDescription
    ?? `Vote: "${scenario.optionA}" vs "${scenario.optionB}" — See how SplitVote voters split on this moral dilemma.`
  const keywords = ds?.keywords?.length ? ds.keywords.join(', ') : undefined

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: {
      canonical: `${BASE_URL}/play/${params.id}`,
      languages: {
        'en': `${BASE_URL}/play/${params.id}`,
        'it-IT': `${BASE_URL}/it/play/${params.id}`,
        'x-default': `${BASE_URL}/play/${params.id}`,
      },
    },
    openGraph: {
      title: ds?.seoTitle ?? scenario.question,
      description,
      images: [`${BASE_URL}/api/dilemma-result-card?id=${params.id}`],
      url: `${BASE_URL}/play/${params.id}`,
      siteName: 'SplitVote',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: ds?.seoTitle ?? scenario.question,
      description,
      images: [`${BASE_URL}/api/dilemma-result-card?id=${params.id}`],
    },
  }
}

export const dynamic = 'force-dynamic'

export default async function PlayPage({ params, searchParams }: Props) {
  const scenario = getScenario(params.id) ?? await getDynamicScenario(params.id)
  if (!scenario) notFound()

  // Fetch live vote count for "Join X,XXX voters" social proof
  let totalVotes = 0
  let votesA = 0
  let votesB = 0
  try {
    const votes = await getVotes(params.id)
    votesA = votes.a
    votesB = votes.b
    totalVotes = votes.a + votes.b
  } catch {
    // Non-blocking
  }

  // Collect voted IDs + check existing vote + streak status (parallel Supabase queries)
  let existingVote: { choice: 'A' | 'B'; canChangeUntil: string } | null = null
  let votedIds = new Set<string>()
  let userDetected = false
  let streakDays = 0
  let streakAtRisk = false
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      userDetected = true
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      const [votesResult, profileResult] = await Promise.all([
        supabase.from('dilemma_votes').select('dilemma_id, choice, can_change_until').eq('user_id', user.id),
        supabase.from('profiles').select('streak_days, streak_last_date').eq('id', user.id).single(),
      ])
      if (votesResult.data) {
        votedIds = new Set(votesResult.data.map(r => r.dilemma_id))
        const row = votesResult.data.find(r => r.dilemma_id === params.id)
        if (row) {
          existingVote = { choice: row.choice as 'A' | 'B', canChangeUntil: row.can_change_until }
        }
      }
      const prof = profileResult.data
      if (prof && (prof.streak_days ?? 0) >= 2 && prof.streak_last_date === yesterday) {
        streakDays = prof.streak_days as number
        streakAtRisk = true
      }
    }
  } catch {
    // Non-blocking
  }
  if (!userDetected) {
    const cookieStore = await cookies()
    for (const c of cookieStore.getAll()) {
      if (c.name.startsWith('sv_voted_')) votedIds.add(c.name.slice('sv_voted_'.length))
    }
  }

  const isChallenge = searchParams.challenge === '1'
  const referralCode = typeof searchParams.ref === 'string' ? searchParams.ref : undefined

  // Parse guided path params
  const rawPath = searchParams.path
  const pathCat = CATEGORIES.find(c => c.value === rawPath && c.value !== 'all')
  const pathCategory = pathCat?.value as Category | undefined
  const pathCategoryLabel = pathCat?.label
  const pathCategoryEmoji = pathCat?.emoji
  const pathStep = pathCategory ? Math.max(1, parseInt(searchParams.step ?? '1', 10) || 1) : undefined
  const pathTarget = pathCategory ? Math.max(1, parseInt(searchParams.target ?? '3', 10) || 3) : undefined

  // Collect all scenarios for internal linking (related dilemmas) + next dilemma
  let dynamicScenarios: Awaited<ReturnType<typeof getDynamicScenarios>> = []
  let allScenarios: Scenario[] = [...scenarios]
  try {
    dynamicScenarios = (await getDynamicScenarios()).filter((s) => s.locale === 'en')
    const staticIds = new Set(scenarios.map((s) => s.id))
    allScenarios = [...scenarios, ...dynamicScenarios.filter((d) => !staticIds.has(d.id))]
  } catch {
    // Non-blocking
  }
  const nextId = getFreshNextScenarioId(params.id, votedIds, dynamicScenarios)
  const nextPathId = pathCategory !== undefined
    ? getFreshNextScenarioIdByCategory(pathCategory, params.id, votedIds, dynamicScenarios)
    : undefined

  // JSON-LD: BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'SplitVote', item: BASE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: scenario.category.charAt(0).toUpperCase() + scenario.category.slice(1),
        item: `${BASE_URL}/category/${scenario.category}`,
      },
      { '@type': 'ListItem', position: 3, name: scenario.question.slice(0, 60), item: `${BASE_URL}/play/${params.id}` },
    ],
  }

  // JSON-LD: Poll/Quiz schema for the dilemma
  const pollSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: scenario.question,
    description: `A moral dilemma on SplitVote: "${scenario.optionA}" vs "${scenario.optionB}". ${totalVotes.toLocaleString()} people have voted.`,
    url: `${BASE_URL}/play/${params.id}`,
    provider: {
      '@type': 'Organization',
      name: 'SplitVote',
      url: BASE_URL,
    },
    hasPart: [
      {
        '@type': 'Question',
        name: scenario.question,
        suggestedAnswer: [
          {
            '@type': 'Answer',
            text: scenario.optionA,
            ...(totalVotes > 0 ? { upvoteCount: votesA } : {}),
          },
          {
            '@type': 'Answer',
            text: scenario.optionB,
            ...(totalVotes > 0 ? { upvoteCount: votesB } : {}),
          },
        ],
      },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={pollSchema} />
      <VoteClientPage
        scenario={scenario}
        existingVote={existingVote}
        totalVotes={totalVotes}
        isChallenge={isChallenge}
        referralCode={referralCode}
        nextId={nextId}
        pathCategory={pathCategory}
        pathStep={pathStep}
        pathTarget={pathTarget}
        pathCategoryLabel={pathCategoryLabel}
        pathCategoryEmoji={pathCategoryEmoji}
        nextPathId={nextPathId}
        streakDays={streakDays}
        streakAtRisk={streakAtRisk}
      />
      <DilemmaInsightSection scenario={scenario} locale="en" mode="play" />
      <RelatedDilemmas current={scenario} all={allScenarios} />
      <AdSlot slot={SLOT_PLAY} className="max-w-2xl mx-auto px-4 pb-8" />
    </>
  )
}

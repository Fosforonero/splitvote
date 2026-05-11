/**
 * /it/play/[id] — Italian play page for AI-generated and static dilemmas.
 * Voting is global (same Redis key regardless of locale).
 */
import { notFound } from 'next/navigation'
import { getDynamicScenario, getDynamicScenarios } from '@/lib/dynamic-scenarios'
import type { DynamicScenario } from '@/lib/dynamic-scenarios'
import { getFreshNextScenarioId, getFreshNextScenarioIdByCategory, CATEGORIES } from '@/lib/scenarios'
import type { Category } from '@/lib/scenarios'
import { getItalianScenario, CATEGORY_LABELS_IT } from '@/lib/scenarios-it'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { getVotes } from '@/lib/redis'
import VoteClientPage from '@/app/play/[id]/VoteClientPage'
import JsonLd from '@/components/JsonLd'
import type { Metadata } from 'next'

const BASE_URL = 'https://splitvote.io'

interface Props {
  params: { id: string }
  searchParams: { challenge?: string; ref?: string; path?: string; step?: string; target?: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const dynamicScenario = await getDynamicScenario(params.id) as DynamicScenario | undefined
  const scenario = dynamicScenario?.locale === 'it'
    ? dynamicScenario
    : getItalianScenario(params.id)
  if (!scenario) return {}

  const title = dynamicScenario?.seoTitle ?? `${scenario.question.slice(0, 55)}…`
  const description = dynamicScenario?.seoDescription
    ?? `Vota: "${scenario.optionA}" contro "${scenario.optionB}" — Scopri come si divide il mondo.`
  const keywords = dynamicScenario?.keywords?.length ? dynamicScenario.keywords.join(', ') : undefined

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: {
      canonical: `${BASE_URL}/it/play/${params.id}`,
      languages: {
        'it-IT': `${BASE_URL}/it/play/${params.id}`,
        'en': `${BASE_URL}/play/${params.id}`,
        'x-default': `${BASE_URL}/play/${params.id}`,
      },
    },
    openGraph: {
      title: dynamicScenario?.seoTitle ?? scenario.question,
      description,
      images: [`${BASE_URL}/api/dilemma-result-card?id=${params.id}&locale=it`],
      url: `${BASE_URL}/it/play/${params.id}`,
      siteName: 'SplitVote',
      type: 'website',
      locale: 'it_IT',
    },
    twitter: {
      card: 'summary_large_image',
      title: dynamicScenario?.seoTitle ?? scenario.question,
      description,
      images: [`${BASE_URL}/api/dilemma-result-card?id=${params.id}&locale=it`],
    },
  }
}

export const dynamic = 'force-dynamic'

export default async function ItPlayPage({ params, searchParams }: Props) {
  const dynamicScenario = await getDynamicScenario(params.id) as DynamicScenario | undefined
  const scenario = dynamicScenario?.locale === 'it'
    ? dynamicScenario
    : getItalianScenario(params.id)

  if (!scenario) notFound()

  // Fetch live votes
  let totalVotes = 0
  try {
    const votes = await getVotes(params.id)
    totalVotes = votes.a + votes.b
  } catch { /* non-blocking */ }

  // Compute next dilemma preferring IT-locale dynamics
  let dynamicScenarios: DynamicScenario[] = []
  try { dynamicScenarios = await getDynamicScenarios() } catch { /* non-blocking */ }
  const itPool = dynamicScenarios.filter((s) => s.locale === 'it')

  // Collect voted IDs + check existing vote for current dilemma
  let existingVote: { choice: 'A' | 'B'; canChangeUntil: string } | null = null
  let votedIds = new Set<string>()
  let userDetected = false
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      userDetected = true
      const { data: allVotedRows } = await supabase
        .from('dilemma_votes')
        .select('dilemma_id, choice, can_change_until')
        .eq('user_id', user.id)
      if (allVotedRows) {
        votedIds = new Set(allVotedRows.map(r => r.dilemma_id))
        const row = allVotedRows.find(r => r.dilemma_id === params.id)
        if (row) {
          existingVote = { choice: row.choice as 'A' | 'B', canChangeUntil: row.can_change_until }
        }
      }
    }
  } catch { /* non-blocking */ }
  if (!userDetected) {
    const cookieStore = await cookies()
    for (const c of cookieStore.getAll()) {
      if (c.name.startsWith('sv_voted_')) votedIds.add(c.name.slice('sv_voted_'.length))
    }
  }

  const nextId = getFreshNextScenarioId(params.id, votedIds, itPool)

  // Parse guided path params (use IT labels)
  const rawPath = searchParams.path
  const pathCat = CATEGORIES.find(c => c.value === rawPath && c.value !== 'all')
  const pathCategory = pathCat?.value as Category | undefined
  const pathCategoryLabel = pathCategory ? (CATEGORY_LABELS_IT[pathCategory] ?? pathCat?.label) : undefined
  const pathCategoryEmoji = pathCat?.emoji
  const pathStep = pathCategory ? Math.max(1, parseInt(searchParams.step ?? '1', 10) || 1) : undefined
  const pathTarget = pathCategory ? Math.max(1, parseInt(searchParams.target ?? '3', 10) || 3) : undefined
  const nextPathId = pathCategory !== undefined
    ? getFreshNextScenarioIdByCategory(pathCategory, params.id, votedIds, itPool)
    : undefined

  const isChallenge = searchParams.challenge === '1'
  const referralCode = typeof searchParams.ref === 'string' ? searchParams.ref : undefined

  // JSON-LD breadcrumb in Italian
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'SplitVote', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Dilemmi Morali', item: `${BASE_URL}/it` },
      {
        '@type': 'ListItem',
        position: 3,
        name: scenario.question.slice(0, 60),
        item: `${BASE_URL}/it/play/${params.id}`,
      },
    ],
  }

  // JSON-LD Poll schema (Italian content)
  const pollSchema = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: scenario.question,
    description: dynamicScenario?.seoDescription ?? `Un dilemma morale su SplitVote: "${scenario.optionA}" contro "${scenario.optionB}".`,
    url: `${BASE_URL}/it/play/${params.id}`,
    inLanguage: 'it-IT',
    provider: { '@type': 'Organization', name: 'SplitVote', url: BASE_URL },
    hasPart: [
      {
        '@type': 'Question',
        name: scenario.question,
        suggestedAnswer: [
          { '@type': 'Answer', text: scenario.optionA },
          { '@type': 'Answer', text: scenario.optionB },
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
        localePrefix="/it"
        nextId={nextId}
        pathCategory={pathCategory}
        pathStep={pathStep}
        pathTarget={pathTarget}
        pathCategoryLabel={pathCategoryLabel}
        pathCategoryEmoji={pathCategoryEmoji}
        nextPathId={nextPathId}
      />
    </>
  )
}

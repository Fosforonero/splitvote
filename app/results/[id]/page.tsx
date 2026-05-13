import { notFound } from 'next/navigation'
import { getScenario, getFreshNextScenarioId, getFreshNextScenarioIdByCategory, CATEGORIES, scenarios } from '@/lib/scenarios'
import type { Category } from '@/lib/scenarios'
import { getDynamicScenario } from '@/lib/dynamic-scenarios'
import { getCachedDynamicScenarios } from '@/lib/cached-data'
import type { DynamicScenario } from '@/lib/dynamic-scenarios'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { getVotes } from '@/lib/redis'
import ResultsClientPage from './ResultsClientPage'
import JsonLd from '@/components/JsonLd'
import type { Metadata } from 'next'

const BASE_URL = 'https://splitvote.io'

interface Props {
  params: { id: string }
  searchParams: { voted?: string; path?: string; step?: string; target?: string }
}

export async function generateStaticParams() {
  return scenarios.map((s) => ({ id: s.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const staticScenario = getScenario(params.id)
  const scenario = staticScenario ?? await getDynamicScenario(params.id)
  if (!scenario) return {}

  const ds = staticScenario ? null : scenario as DynamicScenario
  const title = ds?.seoTitle
    ? `Results: ${ds.seoTitle}`
    : `Results: ${scenario.question.slice(0, 50)}…`
  const description = ds?.seoDescription
    ?? `See how the world voted on this moral dilemma. "${scenario.optionA}" vs "${scenario.optionB}".`
  const keywords = ds?.keywords?.length ? ds.keywords.join(', ') : undefined

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: {
      canonical: `${BASE_URL}/results/${params.id}`,
      languages: {
        'en': `${BASE_URL}/results/${params.id}`,
        'it-IT': `${BASE_URL}/it/results/${params.id}`,
        'x-default': `${BASE_URL}/results/${params.id}`,
      },
    },
    openGraph: {
      title,
      description,
      images: [`${BASE_URL}/api/dilemma-result-card?id=${params.id}`],
      url: `${BASE_URL}/results/${params.id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE_URL}/api/dilemma-result-card?id=${params.id}`],
    },
  }
}

export const revalidate = 60

export default async function ResultsPage({ params, searchParams }: Props) {
  // Supporta sia gli scenari statici che quelli AI generati dal cron
  const scenario = getScenario(params.id) ?? await getDynamicScenario(params.id)
  if (!scenario) notFound()

  const votes = await getVotes(params.id)
  const total = votes.a + votes.b
  const pctA = total > 0 ? Math.round((votes.a / total) * 100) : 0
  const pctB = total > 0 ? Math.round((votes.b / total) * 100) : 0
  const voted = (searchParams.voted === 'a' || searchParams.voted === 'b')
    ? searchParams.voted
    : null

  let dynamicScenarios: DynamicScenario[] = []
  try { dynamicScenarios = (await getCachedDynamicScenarios()).filter(s => s.locale === 'en') } catch { /* non-blocking */ }

  let votedIds = new Set<string>()
  let userDetected = false
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      userDetected = true
      const { data } = await supabase.from('dilemma_votes').select('dilemma_id').eq('user_id', user.id)
      if (data) votedIds = new Set(data.map(r => r.dilemma_id))
    }
  } catch { /* non-blocking */ }
  if (!userDetected) {
    const cookieStore = await cookies()
    for (const c of cookieStore.getAll()) {
      if (c.name.startsWith('sv_voted_')) votedIds.add(c.name.slice('sv_voted_'.length))
    }
  }

  const nextId = getFreshNextScenarioId(params.id, votedIds, dynamicScenarios)

  // Guided path — parse params and compute next path question
  const rawPath = searchParams.path
  const pathCat = CATEGORIES.find(c => c.value === rawPath && c.value !== 'all')
  const pathCategory = pathCat?.value as Category | undefined
  const pathCategoryLabel = pathCat?.label
  const pathCategoryEmoji = pathCat?.emoji
  const pathStep = pathCategory ? Math.max(1, parseInt(searchParams.step ?? '1', 10) || 1) : undefined
  const pathTarget = pathCategory ? Math.max(1, parseInt(searchParams.target ?? '3', 10) || 3) : undefined
  const nextPathId = pathCategory !== undefined && pathStep !== undefined && pathTarget !== undefined && pathStep < pathTarget
    ? getFreshNextScenarioIdByCategory(pathCategory, params.id, votedIds, dynamicScenarios)
    : undefined

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
      {
        '@type': 'ListItem',
        position: 3,
        name: `Results: ${scenario.question.slice(0, 60)}`,
        item: `${BASE_URL}/results/${params.id}`,
      },
    ],
  }

  const datasetSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `Results: ${scenario.question}`,
    description: `Global vote distribution on the moral dilemma: "${scenario.optionA}" vs "${scenario.optionB}".`,
    url: `${BASE_URL}/results/${params.id}`,
    dateModified: new Date().toISOString().split('T')[0],
    license: 'https://creativecommons.org/licenses/by/4.0/',
    creator: { '@type': 'Organization', name: 'SplitVote', url: BASE_URL },
    variableMeasured: [
      { '@type': 'PropertyValue', name: scenario.optionA, value: `${votes.a} votes (${pctA}%)` },
      { '@type': 'PropertyValue', name: scenario.optionB, value: `${votes.b} votes (${pctB}%)` },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={datasetSchema} />
      <ResultsClientPage
        scenario={scenario}
        votes={votes}
        pctA={pctA}
        pctB={pctB}
        total={total}
        voted={voted}
        nextId={nextId}
        pathCategory={pathCategory}
        pathStep={pathStep}
        pathTarget={pathTarget}
        nextPathId={nextPathId}
        pathCategoryLabel={pathCategoryLabel}
        pathCategoryEmoji={pathCategoryEmoji}
      />
    </>
  )
}

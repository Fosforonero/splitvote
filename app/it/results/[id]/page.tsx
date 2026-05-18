/**
 * /it/results/[id] — Italian results page for AI-generated and static dilemmas.
 * Share URLs automatically use /it/play prefix.
 */
import { notFound } from 'next/navigation'
import { getDynamicScenario } from '@/lib/dynamic-scenarios'
import { getCachedDynamicScenarios } from '@/lib/cached-data'
import type { DynamicScenario } from '@/lib/dynamic-scenarios'
import { getFreshNextScenarioId, getFreshNextScenarioIdByCategory, CATEGORIES } from '@/lib/scenarios'
import type { Category } from '@/lib/scenarios'
import { getItalianScenario, CATEGORY_LABELS_IT } from '@/lib/scenarios-it'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { getVotes } from '@/lib/redis'
import ResultsClientPage from '@/app/results/[id]/ResultsClientPage'
import DilemmaInsightSection from '@/components/DilemmaInsightSection'
import JsonLd from '@/components/JsonLd'
import type { Metadata } from 'next'

const BASE_URL = 'https://splitvote.io'

interface Props {
  params: { id: string }
  searchParams: { voted?: string; path?: string; step?: string; target?: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const dynamicScenario = await getDynamicScenario(params.id) as DynamicScenario | undefined
  const scenario = dynamicScenario?.locale === 'it'
    ? dynamicScenario
    : getItalianScenario(params.id)
  if (!scenario) return {}

  const title = dynamicScenario?.seoTitle
    ? `Risultati: ${dynamicScenario.seoTitle}`
    : `Risultati: ${scenario.question.slice(0, 50)}…`
  const description = dynamicScenario?.seoDescription
    ?? `Scopri come si dividono i votanti su SplitVote su questo dilemma morale. "${scenario.optionA}" contro "${scenario.optionB}".`
  const keywords = dynamicScenario?.keywords?.length ? dynamicScenario.keywords.join(', ') : undefined

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: {
      canonical: `${BASE_URL}/it/results/${params.id}`,
      languages: {
        'it-IT': `${BASE_URL}/it/results/${params.id}`,
        'en': `${BASE_URL}/results/${params.id}`,
        'x-default': `${BASE_URL}/results/${params.id}`,
      },
    },
    openGraph: {
      title,
      description,
      images: [`${BASE_URL}/api/dilemma-result-card?id=${params.id}&locale=it`],
      url: `${BASE_URL}/it/results/${params.id}`,
      locale: 'it_IT',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE_URL}/api/dilemma-result-card?id=${params.id}&locale=it`],
    },
  }
}

export const revalidate = 60

export default async function ItResultsPage({ params, searchParams }: Props) {
  const dynamicScenario = await getDynamicScenario(params.id) as DynamicScenario | undefined
  const scenario = dynamicScenario?.locale === 'it'
    ? dynamicScenario
    : getItalianScenario(params.id)

  if (!scenario) notFound()

  const votes = await getVotes(params.id)
  const total = votes.a + votes.b
  const pctA = total > 0 ? Math.round((votes.a / total) * 100) : 0
  const pctB = total > 0 ? Math.round((votes.b / total) * 100) : 0
  const voted = (searchParams.voted === 'a' || searchParams.voted === 'b')
    ? searchParams.voted
    : null

  let dynamicScenarios: DynamicScenario[] = []
  try { dynamicScenarios = await getCachedDynamicScenarios() } catch { /* non-blocking */ }
  const itPool = dynamicScenarios.filter((s) => s.locale === 'it')

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

  // Use only IT-locale dynamic scenarios; static scenarios are the fallback inside the function
  const nextId = getFreshNextScenarioId(params.id, votedIds, itPool)

  // Guided path — parse params and compute next path question (IT locale)
  const rawPath = searchParams.path
  const pathCat = CATEGORIES.find(c => c.value === rawPath && c.value !== 'all')
  const pathCategory = pathCat?.value as Category | undefined
  const pathCategoryLabel = pathCategory ? (CATEGORY_LABELS_IT[pathCategory] ?? pathCat?.label) : undefined
  const pathCategoryEmoji = pathCat?.emoji
  const pathStep = pathCategory ? Math.max(1, parseInt(searchParams.step ?? '1', 10) || 1) : undefined
  const pathTarget = pathCategory ? Math.max(1, parseInt(searchParams.target ?? '3', 10) || 3) : undefined
  const nextPathId = pathCategory !== undefined && pathStep !== undefined && pathTarget !== undefined && pathStep < pathTarget
    ? getFreshNextScenarioIdByCategory(pathCategory, params.id, votedIds, itPool)
    : undefined

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'SplitVote', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Dilemmi Morali', item: `${BASE_URL}/it` },
      {
        '@type': 'ListItem',
        position: 3,
        name: `Risultati: ${scenario.question.slice(0, 60)}`,
        item: `${BASE_URL}/it/results/${params.id}`,
      },
    ],
  }

  const datasetSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `Risultati: ${scenario.question}`,
    description: `Distribuzione dei voti globali sul dilemma morale: "${scenario.optionA}" contro "${scenario.optionB}".`,
    url: `${BASE_URL}/it/results/${params.id}`,
    dateModified: new Date().toISOString().split('T')[0],
    license: 'https://creativecommons.org/licenses/by/4.0/',
    creator: { '@type': 'Organization', name: 'SplitVote', url: BASE_URL },
    variableMeasured: [
      { '@type': 'PropertyValue', name: scenario.optionA, value: `${votes.a} voti (${pctA}%)` },
      { '@type': 'PropertyValue', name: scenario.optionB, value: `${votes.b} voti (${pctB}%)` },
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
        sharePrefix="/it"
        pathCategory={pathCategory}
        pathStep={pathStep}
        pathTarget={pathTarget}
        nextPathId={nextPathId}
        pathCategoryLabel={pathCategoryLabel}
        pathCategoryEmoji={pathCategoryEmoji}
      />
      <DilemmaInsightSection
        scenario={scenario}
        locale="it"
        mode="results"
        voteStats={{ pctA, pctB, total }}
      />
    </>
  )
}

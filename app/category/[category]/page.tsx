import { notFound } from 'next/navigation'
import { scenarios, CATEGORIES } from '@/lib/scenarios'
import type { Category } from '@/lib/scenarios'
import { getCachedDynamicScenarios, getCachedVotesBatch } from '@/lib/cached-data'
import type { DynamicScenario } from '@/lib/dynamic-scenarios'
import { getCategoryContent } from '@/lib/categoryContent'
import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import VotedDilemmaCard from '@/components/VotedDilemmaCard'

const BASE_URL = 'https://splitvote.io'

interface Props {
  params: { category: string }
}

const VALID_CATEGORIES = CATEGORIES.filter((c) => c.value !== 'all').map((c) => c.value as Category)

export async function generateStaticParams() {
  return VALID_CATEGORIES.map((c) => ({ category: c }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = CATEGORIES.find((c) => c.value === params.category)
  if (!cat || cat.value === 'all') return {}

  const descriptions: Record<string, string> = {
    morality: 'Impossible moral dilemmas — right vs right. Vote and see how the world decides.',
    survival: 'Life-or-death survival dilemmas. What would you do when every choice has a cost?',
    loyalty: 'Loyalty dilemmas — when honesty and love collide. Vote and see the world split.',
    justice: 'Justice dilemmas — law, fairness, and moral grey zones. Where does the world stand?',
    freedom: 'Freedom vs safety dilemmas. Where do you draw the line?',
    technology: 'Tech and AI ethical dilemmas — the future is already complicated. Vote now.',
    society: 'Big society questions — inequality, borders, policy. Where does the world stand?',
    relationships: 'Love, loyalty, and impossible choices. Relationship dilemmas voted by the world.',
  }

  const title = `${cat.emoji} ${cat.label} Dilemmas — Real-time Global Votes | SplitVote`
  const description = descriptions[cat.value as string] ?? `${cat.label} moral dilemmas — vote and see how the world decides.`

  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/category/${cat.value}` },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/category/${cat.value}`,
      siteName: 'SplitVote',
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export const revalidate = 3600
export const dynamicParams = false

export default async function CategoryPage({ params }: Props) {
  const cat = CATEGORIES.find((c) => c.value === params.category && c.value !== 'all')
  if (!cat) notFound()

  const category = cat.value as Category

  // Static + dynamic dilemmas for this category
  const staticFiltered = scenarios.filter((s) => s.category === category)
  let dynamicFiltered: DynamicScenario[] = []
  try {
    const dynamic = await getCachedDynamicScenarios()
    const staticIds = new Set(scenarios.map((s) => s.id))
    dynamicFiltered = dynamic.filter((d) => d.category === category && d.locale === 'en' && !staticIds.has(d.id))
  } catch { /* Redis unavailable */ }

  const allForCategory = [...dynamicFiltered, ...staticFiltered]

  // Sort by total votes DESC, then by freshness (approvedAt > generatedAt > static)
  const rawVotes = allForCategory.length > 0
    ? await getCachedVotesBatch(allForCategory.map(s => s.id))
    : {} as Record<string, number>
  const voteMap = new Map(Object.entries(rawVotes))
  const allSorted = [...allForCategory].sort((a, b) => {
    const va = voteMap.get(a.id) ?? 0
    const vb = voteMap.get(b.id) ?? 0
    if (vb !== va) return vb - va
    const da = a as DynamicScenario
    const db = b as DynamicScenario
    const ta = da.approvedAt ? new Date(da.approvedAt).getTime() : da.generatedAt ? new Date(da.generatedAt).getTime() : 0
    const tb = db.approvedAt ? new Date(db.approvedAt).getTime() : db.generatedAt ? new Date(db.generatedAt).getTime() : 0
    return tb - ta
  })

  const content = getCategoryContent(cat.value, 'en')

  const descriptions: Record<string, string> = {
    morality: 'No right answers. Just honest ones.',
    survival: 'Every choice has a cost.',
    loyalty: 'When honesty and love collide.',
    justice: 'Law, fairness, and moral grey zones.',
    freedom: 'Where do you draw the line?',
    technology: 'The future is already complicated.',
    society: 'Big questions. No easy answers.',
    relationships: 'Love, loyalty, and impossible choices.',
  }

  // JSON-LD: BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'SplitVote', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: `${cat.label} Dilemmas`, item: `${BASE_URL}/category/${cat.value}` },
    ],
  }

  // JSON-LD: ItemList of dilemmas in this category
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${cat.label} Moral Dilemmas — SplitVote`,
    description: descriptions[cat.value as string],
    url: `${BASE_URL}/category/${cat.value}`,
    numberOfItems: allSorted.length,
    itemListElement: allSorted.slice(0, 20).map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: s.question,
      url: `${BASE_URL}/play/${s.id}`,
    })),
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={itemListSchema} />

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <nav className="text-xs text-[var(--muted)] mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-white transition-colors">All dilemmas</Link>
          <span className="mx-2">›</span>
          <span className="text-white">{cat.label}</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{cat.emoji}</div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            {cat.label}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-purple-400 to-blue-400">
              Dilemmas
            </span>
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-md mx-auto">
            {descriptions[cat.value as string]}
          </p>
          <p className="text-sm text-[var(--muted)] mt-3 opacity-60">
            {allSorted.length} dilemma{allSorted.length !== 1 ? 's' : ''} · Real-time global votes
          </p>
        </div>

        {/* Start path CTA */}
        {allSorted.length >= 3 && (
          <div className="mb-8 rounded-2xl border border-blue-500/25 bg-blue-500/5 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-white text-sm mb-0.5">
                🏁 3-question {cat.label} path
              </p>
              <p className="text-xs text-[var(--muted)]">
                Answer 3 {cat.label.toLowerCase()} dilemmas in a row — fresh questions only.
              </p>
            </div>
            <Link
              href={`/play/${allSorted[0].id}?path=${cat.value}&step=1&target=3`}
              className="flex-shrink-0 text-sm font-bold px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors whitespace-nowrap"
            >
              Start path →
            </Link>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allSorted.map((scenario) => (
            <VotedDilemmaCard
              key={scenario.id}
              scenario={scenario}
              playHref={`/play/${scenario.id}`}
              resultsHref={`/results/${scenario.id}`}
              totalVotes={voteMap.get(scenario.id)}
              badge={'generatedAt' in scenario ? 'ai' : undefined}
              locale="en"
            />
          ))}
        </div>

        {/* Editorial + FAQ */}
        {content && (
          <div className="mt-16 border-t border-[var(--border)] pt-12">
            <h2 className="text-lg font-black text-[var(--text)] mb-3">{content.faqHeading}</h2>
            <p className="text-sm text-[var(--muted)] leading-relaxed mb-8 max-w-2xl">
              {content.editorial}
            </p>
            <div className="space-y-3">
              {content.faq.map(({ q, a }) => (
                <details key={q} className="card-neon rounded-xl p-4 cursor-pointer">
                  <summary className="font-semibold text-[var(--text)] list-none flex items-center justify-between">
                    {q}
                    <span className="text-[var(--muted)] ml-2 flex-shrink-0">▾</span>
                  </summary>
                  <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Other categories */}
        <div className="mt-16">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-4 text-center">
            Explore other categories
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.filter((c) => c.value !== 'all' && c.value !== cat.value).map((c) => (
              <Link
                key={c.value}
                href={`/category/${c.value}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-[var(--border)] text-[var(--muted)] hover:border-blue-500/30 hover:text-white transition-all"
              >
                <span>{c.emoji}</span>
                <span>{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

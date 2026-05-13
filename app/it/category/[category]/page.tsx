import { notFound } from 'next/navigation'
import { scenarios, CATEGORIES } from '@/lib/scenarios'
import type { Category } from '@/lib/scenarios'
import { getCachedDynamicScenarios, getCachedVotesBatch } from '@/lib/cached-data'
import type { DynamicScenario } from '@/lib/dynamic-scenarios'
import { translateScenarioToItalian } from '@/lib/scenarios-it'
import { getCategoryContent } from '@/lib/categoryContent'
import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import VotedDilemmaCard from '@/components/VotedDilemmaCard'

const BASE_URL = 'https://splitvote.io'

interface Props {
  params: { category: string }
}

const VALID_CATEGORIES = CATEGORIES.filter(c => c.value !== 'all').map(c => c.value as Category)

export async function generateStaticParams() {
  return VALID_CATEGORIES.map(c => ({ category: c }))
}

const CAT_IT: Record<string, { label: string; description: string }> = {
  morality:      { label: 'Moralità',       description: 'Nessuna risposta giusta. Solo una onesta.' },
  survival:      { label: 'Sopravvivenza',  description: 'Ogni scelta ha un costo.' },
  loyalty:       { label: 'Lealtà',         description: 'Quando onestà e amore si scontrano.' },
  justice:       { label: 'Giustizia',      description: 'Legge, equità e zone morali grigie.' },
  freedom:       { label: 'Libertà',        description: 'Dove tracci il confine?' },
  technology:    { label: 'Tecnologia',     description: 'Il futuro è già complicato.' },
  society:       { label: 'Società',        description: 'Grandi domande. Nessuna risposta facile.' },
  relationships: { label: 'Relazioni',      description: 'Amore, lealtà e scelte impossibili.' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = CATEGORIES.find(c => c.value === params.category && c.value !== 'all')
  if (!cat) return {}

  const itMeta = CAT_IT[cat.value as string]
  const title = `${cat.emoji} Dilemmi di ${itMeta?.label ?? cat.label} — Vota in Tempo Reale | SplitVote`
  const description = itMeta?.description ?? `Dilemmi di ${itMeta?.label ?? cat.label} — vota e scopri come si divide il mondo.`

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/it/category/${cat.value}`,
      languages: {
        'it-IT': `${BASE_URL}/it/category/${cat.value}`,
        'en': `${BASE_URL}/category/${cat.value}`,
        'x-default': `${BASE_URL}/category/${cat.value}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/it/category/${cat.value}`,
      siteName: 'SplitVote',
      locale: 'it_IT',
    },
  }
}

export const revalidate = 3600
export const dynamicParams = false

export default async function ItCategoryPage({ params }: Props) {
  const cat = CATEGORIES.find(c => c.value === params.category && c.value !== 'all')
  if (!cat) notFound()

  const category = cat.value as Category
  const itMeta = CAT_IT[category] ?? { label: cat.label, description: '' }
  const content = getCategoryContent(cat.value, 'it')

  const staticFiltered = scenarios
    .filter(s => s.category === category)
    .map(translateScenarioToItalian)

  // Dynamic IT scenarios for this category
  let dynamicIT: DynamicScenario[] = []
  try {
    const all = await getCachedDynamicScenarios()
    const staticIds = new Set(scenarios.map(s => s.id))
    dynamicIT = all.filter(d => d.category === category && d.locale === 'it' && !staticIds.has(d.id))
  } catch { /* Redis unavailable */ }

  // Sort by total votes DESC, then by freshness (approvedAt > generatedAt > static)
  const allForCategory = [...dynamicIT, ...staticFiltered]
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

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'SplitVote', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Dilemmi', item: `${BASE_URL}/it` },
      { '@type': 'ListItem', position: 3, name: itMeta.label, item: `${BASE_URL}/it/category/${category}` },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <nav className="text-xs text-[var(--muted)] mb-8" aria-label="Breadcrumb">
          <Link href="/it" className="hover:text-white transition-colors">Tutti i dilemmi</Link>
          <span className="mx-2">›</span>
          <span className="text-white">{itMeta.label}</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{cat.emoji}</div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            {itMeta.label}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-purple-400 to-blue-400">
              Dilemmi
            </span>
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-md mx-auto">{itMeta.description}</p>
          <p className="text-sm text-[var(--muted)] mt-3 opacity-60">
            {allSorted.length} dilemm{allSorted.length === 1 ? 'a' : 'i'} · Voti globali in tempo reale
          </p>
        </div>

        {/* Start path CTA */}
        {allSorted.length >= 3 && (
          <div className="mb-8 rounded-2xl border border-blue-500/25 bg-blue-500/5 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-white text-sm mb-0.5">
                🏁 Percorso {itMeta.label} — 3 domande
              </p>
              <p className="text-xs text-[var(--muted)]">
                Rispondi a 3 dilemmi di {itMeta.label.toLowerCase()} di seguito — solo domande nuove.
              </p>
            </div>
            <Link
              href={`/it/play/${allSorted[0].id}?path=${category}&step=1&target=3`}
              className="flex-shrink-0 text-sm font-bold px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors whitespace-nowrap"
            >
              Inizia percorso →
            </Link>
          </div>
        )}

        {/* Merged grid — sorted by votes DESC then freshness */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allSorted.map(scenario => (
            <VotedDilemmaCard
              key={scenario.id}
              scenario={scenario}
              playHref={`/it/play/${scenario.id}`}
              resultsHref={`/it/results/${scenario.id}`}
              totalVotes={voteMap.get(scenario.id)}
              badge={'generatedAt' in scenario ? 'ai' : undefined}
              locale="it"
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
            Esplora altre categorie
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.filter(c => c.value !== 'all' && c.value !== cat.value).map(c => (
              <Link
                key={c.value}
                href={`/it/category/${c.value}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-[var(--border)] text-[var(--muted)] hover:border-blue-500/30 hover:text-white transition-all"
              >
                <span>{c.emoji}</span>
                <span>{CAT_IT[c.value as string]?.label ?? c.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link href="/it" className="text-sm text-[var(--muted)] hover:text-white transition-colors">
            ← Tutti i dilemmi IT
          </Link>
        </div>
      </div>
    </>
  )
}

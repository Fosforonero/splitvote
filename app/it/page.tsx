import Link from 'next/link'
import PersonalityTeaser from '@/components/PersonalityTeaser'
import { scenarios } from '@/lib/scenarios'
import type { DynamicScenario } from '@/lib/dynamic-scenarios'
import { getFreshDynamicScenarios, getCachedVotesBatch, getCachedTrendingIds } from '@/lib/cached-data'
import DilemmaCard from '@/components/DilemmaCard'
import VotedDilemmaCard from '@/components/VotedDilemmaCard'
import DilemmaGrid from '@/components/DilemmaGrid'
import DailyDilemma from '@/components/DailyDilemma'
import JsonLd from '@/components/JsonLd'
import LangSwitcher from '@/components/LangSwitcher'
import { translateScenarioToItalian } from '@/lib/scenarios-it'
import type { Metadata } from 'next'
import type { Scenario } from '@/lib/scenarios'

function getDailyScenario(all: Scenario[]): Scenario {
  if (all.length === 0) return all[0] ?? scenarios[0]
  const daysSinceEpoch = Math.floor(Date.now() / 86_400_000)
  return all[daysSinceEpoch % all.length]
}

const BASE_URL = 'https://splitvote.io'

export const metadata: Metadata = {
  title: 'Dilemmi Morali — Vota e Confrontati con il Mondo',
  description:
    'Rispondi a dilemmi etici impossibili e scopri come vota il resto del mondo in tempo reale. Cosa faresti tu? Trolley problem, dilemmi di sopravvivenza, giustizia e molto altro.',
  alternates: {
    canonical: `${BASE_URL}/it`,
    languages: {
      'it-IT': `${BASE_URL}/it`,
      'en': BASE_URL,
      'x-default': BASE_URL,
    },
  },
  openGraph: {
    title: 'Dilemmi Morali — Vota e Confrontati con il Mondo',
    description:
      'Rispondi a dilemmi etici e vedi come si divide il mondo. Voti in tempo reale, statistiche globali.',
    url: `${BASE_URL}/it`,
    siteName: 'SplitVote',
    locale: 'it_IT',
    type: 'website',
  },
  keywords: [
    'dilemmi morali',
    'dilemma etico',
    'cosa faresti',
    'trolley problem italiano',
    'dilemmi impossibili',
    'voto online',
    'dilemmi filosofici',
    'sondaggi morali',
    'scelta difficile',
    'dilemma morale online',
  ],
}

const FEATURED_CATEGORIES = [
  { slug: 'morality', label: 'Moralità', emoji: '⚖️', desc: 'Le scelte più difficili della vita' },
  { slug: 'survival', label: 'Sopravvivenza', emoji: '🆘', desc: 'Cosa faresti per sopravvivere?' },
  { slug: 'loyalty', label: 'Lealtà', emoji: '🤝', desc: 'Amici, famiglia, principi' },
  { slug: 'justice', label: 'Giustizia', emoji: '🏛️', desc: 'Legge vs coscienza' },
  { slug: 'freedom', label: 'Libertà', emoji: '🕊️', desc: 'Sicurezza contro privacy' },
  { slug: 'technology', label: 'Tecnologia', emoji: '🤖', desc: 'IA, futuro, etica digitale' },
]

const FEATURED_DILEMMA_IDS = [
  'trolley',
  'organ-harvest',
  'lifeboat',
  'truth-friend',
  'self-driving-crash',
  'privacy-terror',
]


const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Dilemmi Morali Online — SplitVote',
  description: 'Rispondi a dilemmi etici e confronta la tua scelta con milioni di persone nel mondo.',
  url: `${BASE_URL}/it`,
  inLanguage: 'it-IT',
  isPartOf: { '@type': 'WebSite', name: 'SplitVote', url: BASE_URL },
}

export default async function ItPage() {
  // Featured static dilemmas (with Italian text overrides)
  const featuredBase = FEATURED_DILEMMA_IDS
    .map((id) => scenarios.find((s) => s.id === id))
    .filter((s): s is Scenario => Boolean(s))

  const featured = featuredBase.map(translateScenarioToItalian)

  // Same source as category pages — prevents cache divergence with getCachedDynamicScenariosByLocale
  const staticIds = new Set(scenarios.map((s) => s.id))
  let dynamicIT: DynamicScenario[] = []
  try {
    const allDynamic = await getFreshDynamicScenarios()
    dynamicIT = allDynamic
      .filter((d) => !staticIds.has(d.id) && d.locale === 'it')
      .sort((a, b) => {
        const ta = a.approvedAt ? new Date(a.approvedAt).getTime() : a.generatedAt ? new Date(a.generatedAt).getTime() : 0
        const tb = b.approvedAt ? new Date(b.approvedAt).getTime() : b.generatedAt ? new Date(b.generatedAt).getTime() : 0
        return tb - ta
      })
  } catch { /* Redis unavailable */ }

  // Full IT catalog: dynamic IT (already deduped against static) + all static translated
  const uniqueDynamicIT = dynamicIT
  const allScenariosIT: Scenario[] = [...uniqueDynamicIT, ...scenarios.map(translateScenarioToItalian)]

  // Daily dilemma for IT — prefers dynamic IT, falls back to translated static pool
  const allITPool: Scenario[] = allScenariosIT
  const dailyIT = getDailyScenario(allITPool)

  // Batch vote counts for featured + dynamic + daily
  let voteMap = new Map<string, number>()
  try {
    const ids = new Set([
      dailyIT.id,
      ...featured.map((s) => s.id),
      ...dynamicIT.slice(0, 12).map((s) => s.id),
    ])
    const obj = await getCachedVotesBatch([...ids])
    voteMap = new Map(Object.entries(obj))
  } catch { /* Non-blocking */ }

  const trendingITIds = await getCachedTrendingIds(allITPool.map(s => s.id), 6)
  const itScenarioById = new Map(allITPool.map(s => [s.id, s]))

  // Accumulate seen IDs in section priority order so the same scenario ID
  // cannot appear in more than one visible section.
  const seen = new Set<string>([dailyIT.id])

  const featuredDeduped = featured.filter(s => !seen.has(s.id))
  featuredDeduped.forEach(s => seen.add(s.id))

  const trendingIT = trendingITIds
    .map(id => itScenarioById.get(id))
    .filter((s): s is Scenario => s !== undefined && !seen.has(s.id))
  trendingIT.forEach(s => seen.add(s.id))

  const newlyGeneratedIT = [...dynamicIT]
    .filter(s => !seen.has(s.id))
    .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())
    .slice(0, 6)

  return (
    <>
      <JsonLd data={websiteSchema} />

      <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">

        {/* Hero */}
        <div className="text-center mb-4 sm:mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-6 border border-blue-500/20 neon-glow-blue">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 pulse-glow" />
            Voti in tempo reale
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight mb-5 sm:mb-6 leading-none">
            Cosa sceglierebbe
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-purple-400 to-blue-400">
              il mondo?
            </span>
          </h1>
          <p className="text-base sm:text-xl text-[var(--muted)] max-w-lg mx-auto leading-relaxed">
            Scegli da che parte stare. Nessuna registrazione. Risultati subito visibili.
          </p>
          <div className="mt-6 flex items-center justify-center">
            <Link
              href="/it/trending"
              className="text-sm text-[var(--muted)] hover:text-white transition-colors"
            >
              Vedi le tendenze →
            </Link>
          </div>
          <div className="mt-6">
            <LangSwitcher />
          </div>
        </div>

        {/* ── Game loop ── */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mb-4 text-xs text-[var(--muted)]">
          <span className="flex items-center gap-1.5">
            <span className="text-blue-400 font-black neon-text-blue">1.</span> Vota un dilemma
          </span>
          <span className="text-white/15 hidden sm:inline">→</span>
          <span className="flex items-center gap-1.5">
            <span className="text-purple-400 font-black neon-text-purple">2.</span> Scopri come si divide il mondo
          </span>
          <span className="text-white/15 hidden sm:inline">→</span>
          <span className="flex items-center gap-1.5">
            <span className="text-yellow-400 font-black neon-text-yellow">3.</span> Fai crescere il tuo Pixie
          </span>
        </div>

        {/* ── Trust strip ── */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-8 text-xs text-[var(--muted)]">
          <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> Nessun account richiesto</span>
          <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> Voto anonimo</span>
          <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> Scopri cosa sceglierebbe il mondo</span>
        </div>

        {/* ── Dilemma del Giorno ── */}
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] text-center mb-3">
          Il dilemma di oggi — vota in anonimo
        </p>
        <DailyDilemma
          scenario={dailyIT}
          totalVotes={voteMap.get(dailyIT.id) ?? 0}
          locale="it"
        />

        {/* ── Personality teaser (utenti loggati, dismiss 7 giorni) ── */}
        <PersonalityTeaser locale="it" />

        {/* ── Dilemmi in Evidenza ── */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              <span className="text-red-400">🔥</span> Dilemmi in Evidenza
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {featuredDeduped.map((s) => (
              <VotedDilemmaCard
                key={s.id}
                scenario={s}
                playHref={`/it/play/${s.id}`}
                resultsHref={`/it/results/${s.id}`}
                totalVotes={voteMap.get(s.id)}
                locale="it"
              />
            ))}
          </div>
        </section>

        {/* ── Trending IT (ranked by recent votes: today + yesterday) ── */}
        {trendingIT.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                <span className="text-orange-400">🔥</span> Di Tendenza
              </h2>
              <Link href="/it/trending" className="text-sm text-[var(--muted)] hover:text-white transition-colors">
                Vedi tutti →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {trendingIT.map((s) => (
                <VotedDilemmaCard
                  key={s.id}
                  scenario={s}
                  playHref={`/it/play/${s.id}`}
                  resultsHref={`/it/results/${s.id}`}
                  totalVotes={voteMap.get(s.id)}
                  badge="trending"
                  locale="it"
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Nuove Domande ── */}
        {newlyGeneratedIT.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                <span className="text-green-400">✨</span> Nuove Domande
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {newlyGeneratedIT.map((s) => (
                <VotedDilemmaCard
                  key={s.id}
                  scenario={s}
                  playHref={`/it/play/${s.id}`}
                  resultsHref={`/it/results/${s.id}`}
                  badge="new"
                  locale="it"
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Tutti i dilemmi ── */}
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-5">
            📂 Tutti i dilemmi
          </h2>
          <DilemmaGrid scenarios={allScenariosIT} locale="it" />
        </section>

        {/* ── Categorie ── */}
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-5 flex items-center gap-2">
            <span>📂</span> Esplora per Categoria
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {FEATURED_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/it/category/${cat.slug}`}
                className="card-neon group rounded-xl p-4 transition-all text-center"
              >
                <span className="text-3xl block mb-2">{cat.emoji}</span>
                <span className="font-semibold text-[var(--text)] block">{cat.label}</span>
                <span className="text-xs text-[var(--muted)] group-hover:text-white transition-colors">{cat.desc}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-6 text-center">❓ Domande Frequenti</h2>
          <div className="space-y-3">
            {[
              {
                q: "Cos'è un dilemma morale?",
                a: "Un dilemma morale è una situazione ipotetica dove non esiste una risposta chiaramente giusta. Entrambe le scelte hanno conseguenze significative, mettendo alla prova i tuoi valori etici.",
              },
              {
                q: "Cos'è il Trolley Problem?",
                a: "Il Trolley Problem (problema del tram) è il dilemma etico più famoso al mondo: un tram fuori controllo sta per investire 5 persone. Puoi deviarlo su un binario dove c'è 1 sola persona. Tiri la leva? Questo esperimento mentale esplora la differenza tra morale utilitaristica (5 > 1) e deontologica (non si usa una persona come mezzo).",
              },
              {
                q: "I dilemmi hanno una risposta giusta?",
                a: "No. Sono strumenti filosofici per esplorare sistemi etici diversi: l'utilitarismo (massimizza il bene comune), la deontologia (regole assolute), l'etica della virtù (cosa farebbe una persona virtuosa?). Non c'è risposta universale — ma è interessante vedere come si divide il mondo.",
              },
              {
                q: "Come funziona SplitVote?",
                a: "Voti la tua risposta al dilemma, poi vedi subito la distribuzione globale in tempo reale. Puoi creare un account per salvare le tue risposte, guadagnare badge e sfidare gli amici.",
              },
            ].map(({ q, a }) => (
              <details
                key={q}
                className="card-neon rounded-xl p-4 cursor-pointer"
              >
                <summary className="font-semibold text-[var(--text)] list-none flex items-center justify-between">
                  {q}
                  <span className="text-[var(--muted)] group-open:rotate-180 transition-transform ml-2 flex-shrink-0">▾</span>
                </summary>
                <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </section>

      </div>
    </>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { getIndexableITTopics, type SeoTopic } from '@/lib/seo-topics'

const BASE = 'https://splitvote.io'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Temi — Hub Interattivi di Dilemmi Morali',
  description:
    'Tutti i temi su SplitVote — landing interattivi di dilemmi morali raggruppati per area. Vota, scopri come si divide il mondo, e segui la filosofia e la ricerca dietro ogni tensione.',
  alternates: {
    canonical: `${BASE}/it/temi`,
    languages: {
      'it-IT':     `${BASE}/it/temi`,
      en:          `${BASE}/topics`,
      'x-default': `${BASE}/topics`,
    },
  },
  openGraph: {
    title: 'SplitVote Temi — Hub Interattivi di Dilemmi Morali',
    description:
      'Esplora tutti i temi di dilemmi morali su SplitVote: problema del carrello, etica dell\'IA, lealtà vs onestà, privacy, bioetica e altro.',
    url: `${BASE}/it/temi`,
    type: 'website',
    locale: 'it_IT',
  },
}

interface ClusterDef {
  label: string
  emoji: string
  blurb: string
  topicSlugs: string[]
}

const CLUSTERS: ClusterDef[] = [
  {
    label: 'Dilemmi classici',
    emoji: '⚖️',
    blurb: 'Gli esperimenti mentali canonici — il problema del carrello e le sue varianti, lealtà contro onestà, i dilemmi a cui i filosofi continuano a tornare.',
    topicSlugs: ['problema-del-carrello', 'lealta-vs-onesta'],
  },
  {
    label: 'Etica dell\'IA',
    emoji: '🤖',
    blurb: 'Vecchi problemi morali in vesti nuove — auto a guida autonoma, IA generativa, algoritmi di condanna, proprietà dell\'arte nell\'era dei modelli.',
    topicSlugs: ['dilemmi-etici-intelligenza-artificiale', 'etica-arte-ai'],
  },
  {
    label: 'Teoria etica',
    emoji: '📚',
    blurb: 'Le tre grandi tradizioni a cui gli eticisti tornano davvero: massimizzare il bene, seguire la regola, diventare la persona che non avrebbe bisogno di chiedere.',
    topicSlugs: ['consequenzialismo', 'deontologia', 'etica-della-virtu'],
  },
  {
    label: 'Psicologia morale',
    emoji: '🧠',
    blurb: 'Come il cervello e le tribù umane arrivano davvero ai giudizi morali — fondamenti morali, gli esperimenti dietro alla teoria, perché persone ragionevoli sono in disaccordo.',
    topicSlugs: ['fondamenti-morali', 'psicologia-morale-sperimentale'],
  },
  {
    label: 'Privacy e bioetica',
    emoji: '🔒',
    blurb: 'Quando la vita privata incontra la piazza pubblica, e quando la medicina impone scelte che nessuno vorrebbe fare.',
    topicSlugs: ['etica-della-privacy', 'bioetica'],
  },
]

function pickTopics(all: SeoTopic[], slugs: string[]): SeoTopic[] {
  const map = new Map(all.map((t) => [t.slug, t]))
  return slugs.map((s) => map.get(s)).filter((t): t is SeoTopic => t !== undefined)
}

export default function TopicsHubPageIT() {
  const topics = getIndexableITTopics()
  const groupedSlugs = new Set(CLUSTERS.flatMap((c) => c.topicSlugs))
  const moreTopics = topics.filter((t) => !groupedSlugs.has(t.slug))

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">

      <Link href="/it" className="text-sm text-[var(--muted)] hover:text-white transition-colors mb-6 inline-block">
        ← Home
      </Link>

      <h1 className="text-3xl md:text-4xl font-black text-[var(--text)] mb-4">
        <span aria-hidden="true">🗂</span> Temi
      </h1>

      <p className="text-[var(--muted)] text-base leading-relaxed max-w-2xl mb-10">
        Questi sono <strong className="text-white">temi interattivi di dilemmi</strong>, non
        articoli da enciclopedia. Ogni tema inquadra una tensione morale, collega alla filosofia
        e alla ricerca sottostante, e ti lascia votare sul dilemma reale che lo ancora — il tuo
        voto viene contato insieme al resto del mondo.
      </p>

      <div className="neon-divider mb-10 max-w-xs" />

      {CLUSTERS.map((cluster) => {
        const items = pickTopics(topics, cluster.topicSlugs)
        if (items.length === 0) return null
        return (
          <section key={cluster.label} className="mb-12">
            <h2 className="text-xl font-black tracking-tight mb-2 flex items-center gap-2">
              <span aria-hidden="true">{cluster.emoji}</span> {cluster.label}
            </h2>
            <p className="text-sm text-[var(--muted)] leading-relaxed mb-5 max-w-2xl">
              {cluster.blurb}
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {items.map((t) => (
                <Link
                  key={t.slug}
                  href={`/it/${t.slug}`}
                  className="group block rounded-2xl border border-[var(--border)] hover:border-violet-500/40 hover:bg-white/5 transition-all p-5"
                >
                  <h3 className="text-base font-black text-white mb-1.5 leading-snug group-hover:text-violet-300 transition-colors">
                    {t.topic}
                  </h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-2">
                    {t.tension}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )
      })}

      {moreTopics.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-black tracking-tight mb-5 flex items-center gap-2">
            <span aria-hidden="true">✨</span> Altri temi
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {moreTopics.map((t) => (
              <Link
                key={t.slug}
                href={`/it/${t.slug}`}
                className="group block rounded-2xl border border-[var(--border)] hover:border-violet-500/40 hover:bg-white/5 transition-all p-5"
              >
                <h3 className="text-base font-black text-white mb-1.5 leading-snug group-hover:text-violet-300 transition-colors">
                  {t.topic}
                </h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-2">
                  {t.tension}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-12 pt-8 border-t border-[var(--border)] text-center">
        <p className="text-xs text-[var(--muted)] mb-3">Preferisci leggere prima?</p>
        <Link
          href="/it/blog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold text-sm transition-all"
        >
          Vai al blog →
        </Link>
      </div>
    </div>
  )
}

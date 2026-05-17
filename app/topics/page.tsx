import type { Metadata } from 'next'
import Link from 'next/link'
import { getIndexableTopics, type SeoTopic } from '@/lib/seo-topics'

const BASE = 'https://splitvote.io'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Topics — Interactive Moral Dilemma Hubs',
  description:
    'Every topic on SplitVote — interactive moral dilemma landings grouped by theme. Vote, see how the world splits, and follow the philosophy and research behind each tension.',
  alternates: {
    canonical: `${BASE}/topics`,
    languages: {
      en:          `${BASE}/topics`,
      'it-IT':     `${BASE}/it/temi`,
      'x-default': `${BASE}/topics`,
    },
  },
  openGraph: {
    title: 'SplitVote Topics — Interactive Moral Dilemma Hubs',
    description:
      'Browse every moral dilemma topic on SplitVote: trolley problem, AI ethics, loyalty vs honesty, privacy, bioethics and more.',
    url: `${BASE}/topics`,
    type: 'website',
  },
}

// ── Cluster grouping ──────────────────────────────────────────────────────────
// Each cluster maps to a curated set of SEO topic slugs. Topics that don't
// match any cluster fall into the "More topics" bucket below. Adding a new
// SEO topic without touching this grouping silently lists it in "More" —
// safe default, no broken hub. Adding a new cluster: append below and the
// page picks it up automatically.

interface ClusterDef {
  label: string
  emoji: string
  blurb: string
  topicSlugs: string[]
}

const CLUSTERS: ClusterDef[] = [
  {
    label: 'Classic dilemmas',
    emoji: '⚖️',
    blurb: 'The canonical thought experiments — the trolley problem and its variants, loyalty vs. honesty, the dilemmas philosophers keep coming back to.',
    topicSlugs: ['trolley-problem', 'loyalty-vs-honesty'],
  },
  {
    label: 'AI ethics',
    emoji: '🤖',
    blurb: 'Old moral problems wearing new clothes — self-driving cars, generative AI, sentencing algorithms, art ownership in the model era.',
    topicSlugs: ['ai-ethics-dilemmas', 'ai-art-ethics'],
  },
  {
    label: 'Ethical theory',
    emoji: '📚',
    blurb: 'The three big traditions ethicists actually reach for: maximize the good, follow the rule, become the person who would not need to ask.',
    topicSlugs: ['consequentialism', 'deontology', 'virtue-ethics'],
  },
  {
    label: 'Moral psychology',
    emoji: '🧠',
    blurb: 'How human brains and tribes actually arrive at moral judgements — moral foundations, the experiments behind the theory, why reasonable people disagree.',
    topicSlugs: ['moral-foundations', 'experimental-moral-psychology'],
  },
  {
    label: 'Privacy & bioethics',
    emoji: '🔒',
    blurb: 'When private life meets the public square, and when medicine forces choices no one wants to make.',
    topicSlugs: ['privacy-ethics', 'bioethics'],
  },
]

function pickTopics(all: SeoTopic[], slugs: string[]): SeoTopic[] {
  // Preserve cluster slug order, not catalog order.
  const map = new Map(all.map((t) => [t.slug, t]))
  return slugs.map((s) => map.get(s)).filter((t): t is SeoTopic => t !== undefined)
}

export default function TopicsHubPageEN() {
  const topics = getIndexableTopics()
  const groupedSlugs = new Set(CLUSTERS.flatMap((c) => c.topicSlugs))
  const moreTopics = topics.filter((t) => !groupedSlugs.has(t.slug))

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">

      <Link href="/" className="text-sm text-[var(--muted)] hover:text-white transition-colors mb-6 inline-block">
        ← Home
      </Link>

      <h1 className="text-3xl md:text-4xl font-black text-[var(--text)] mb-4">
        <span aria-hidden="true">🗂</span> Topics
      </h1>

      <p className="text-[var(--muted)] text-base leading-relaxed max-w-2xl mb-10">
        These are <strong className="text-white">interactive dilemma topics</strong>, not encyclopedia
        articles. Each topic frames a moral tension, links to the underlying philosophy and research,
        and lets you vote on the real dilemma that anchors it — your vote gets counted alongside the
        rest of the world&apos;s.
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
                  href={`/${t.slug}`}
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
            <span aria-hidden="true">✨</span> More topics
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {moreTopics.map((t) => (
              <Link
                key={t.slug}
                href={`/${t.slug}`}
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
        <p className="text-xs text-[var(--muted)] mb-3">Prefer to read first?</p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold text-sm transition-all"
        >
          Visit the blog →
        </Link>
      </div>
    </div>
  )
}

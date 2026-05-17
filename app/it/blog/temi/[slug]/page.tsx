import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CLUSTERS, getClusterBySlug } from '@/lib/blog-clusters'
import { getPost } from '@/lib/blog'
import { CATEGORIES } from '@/lib/scenarios'
import { CATEGORY_LABELS_IT } from '@/lib/scenarios-it'
import JsonLd from '@/components/JsonLd'

const BASE = 'https://splitvote.io'

export const revalidate = 3600

export async function generateStaticParams() {
  return CLUSTERS.map((c) => ({ slug: c.slug.it }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const cluster = getClusterBySlug(params.slug, 'it')
  if (!cluster) return {}
  return {
    title: cluster.title.it,
    description: cluster.description.it,
    alternates: {
      canonical: `${BASE}/it/blog/temi/${cluster.slug.it}`,
      languages: {
        'it-IT':     `${BASE}/it/blog/temi/${cluster.slug.it}`,
        en:          `${BASE}/blog/topics/${cluster.slug.en}`,
        'x-default': `${BASE}/blog/topics/${cluster.slug.en}`,
      },
    },
    openGraph: {
      title: cluster.title.it,
      description: cluster.description.it,
      url: `${BASE}/it/blog/temi/${cluster.slug.it}`,
      type: 'website',
      locale: 'it_IT',
    },
  }
}

export default async function ClusterHubPageIT({ params }: { params: { slug: string } }) {
  const cluster = getClusterBySlug(params.slug, 'it')
  if (!cluster) notFound()

  const articles = cluster.articleSlugs.it
    .map((slug) => getPost(slug, 'it'))
    .filter((p): p is NonNullable<ReturnType<typeof getPost>> => p !== undefined)

  const catMeta = (value: string) => CATEGORIES.find((c) => c.value === value)
  const catLabelIt = (value: string) => CATEGORY_LABELS_IT[value as keyof typeof CATEGORY_LABELS_IT] ?? value

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: cluster.title.it,
    description: cluster.description.it,
    url: `${BASE}/it/blog/temi/${cluster.slug.it}`,
    inLanguage: 'it',
    hasPart: articles.map((a) => ({
      '@type': 'BlogPosting',
      headline: a.title,
      url: `${BASE}/it/blog/${a.slug}`,
      datePublished: a.date,
      ...(a.dateModified ? { dateModified: a.dateModified } : {}),
    })),
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <JsonLd data={collectionSchema} />

      <Link href="/it/blog" className="text-sm text-[var(--muted)] hover:text-white transition-colors mb-6 inline-block">
        ← Blog
      </Link>

      <h1 className="text-3xl md:text-4xl font-black text-[var(--text)] mb-4">
        {cluster.title.it}
      </h1>

      <p className="text-[var(--muted)] text-base leading-relaxed max-w-2xl mb-10">
        {cluster.intro.it}
      </p>

      <div className="neon-divider mb-10 max-w-xs" />

      {/* Articoli */}
      <section className="mb-12">
        <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-5">
          <span aria-hidden="true">📖</span> Articoli in questo hub
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {articles.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col rounded-2xl border border-[var(--border)] hover:border-[var(--border-hi)] hover:bg-white/5 transition-all p-5"
            >
              <Link href={`/it/blog/${post.slug}`} className="block flex-1">
                <h3 className="text-base font-black text-[var(--text)] group-hover:text-white transition-colors mb-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-[var(--muted)] text-sm leading-relaxed mb-3">
                  {post.description}
                </p>
                <span className="text-violet-400 font-semibold text-sm group-hover:translate-x-0.5 transition-transform inline-block">
                  Leggi →
                </span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Dilemmi live */}
      <section className="mb-12">
        <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-5">
          <span aria-hidden="true">🗳</span> Vota sui dilemmi live
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {cluster.scenarioCategories.map((cat) => {
            const meta = catMeta(cat)
            return (
              <Link
                key={cat}
                href={`/it/category/${cat}`}
                className="flex items-center gap-2 rounded-xl border border-[var(--border)] hover:border-blue-500/40 bg-[#0d0d1a]/60 px-4 py-3 transition-colors"
              >
                <span className="text-xl">{meta?.emoji ?? '🌐'}</span>
                <span className="font-bold text-sm text-white">{catLabelIt(cat)}</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <div className="mt-12 pt-8 border-t border-[var(--border)] text-center">
        <p className="text-xs text-[var(--muted)] mb-3">Vuoi tutto in un posto?</p>
        <Link
          href="/it/blog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold text-sm transition-all"
        >
          Vedi tutti gli articoli →
        </Link>
      </div>
    </div>
  )
}

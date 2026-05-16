import type { Metadata } from 'next'
import Link from 'next/link'
import { getPostsByLocale } from '@/lib/blog'
import type { BlogPost } from '@/lib/blog'
import { getPublishedBlogDrafts, getPublishedPostsForLocale } from '@/lib/blog-published'
import BlogGrid from '@/components/BlogGrid'

export const revalidate = 3600

const BASE = 'https://splitvote.io'

export const metadata: Metadata = {
  title: 'Blog — Etica, Filosofia e Dilemmi Morali',
  description:
    'Articoli brevi su filosofia morale, etica e la psicologia dietro le scelte impossibili. Ogni articolo è collegato a dilemmi reali su cui puoi votare.',
  alternates: {
    canonical: `${BASE}/it/blog`,
    languages: {
      'it-IT':     `${BASE}/it/blog`,
      en:          `${BASE}/blog`,
      'x-default': `${BASE}/blog`,
    },
  },
  openGraph: {
    title: 'SplitVote Blog — Etica e Filosofia Morale',
    description:
      'Articoli brevi su filosofia morale, etica e la psicologia dietro le scelte impossibili.',
    url: `${BASE}/it/blog`,
    type: 'website',
    locale: 'it_IT',
  },
}

export default async function ITBlogIndexPage() {
  const staticPosts = getPostsByLocale('it')

  let publishedPosts: BlogPost[] = []
  try {
    const published = await getPublishedBlogDrafts()
    publishedPosts = getPublishedPostsForLocale(published, 'it')
  } catch { /* Redis unavailable — static only */ }

  const staticSlugs = new Set(staticPosts.map(p => p.slug))
  const posts = [
    ...staticPosts,
    ...publishedPosts.filter(p => !staticSlugs.has(p.slug)),
  ].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12">
        <Link href="/it" className="text-sm text-[var(--muted)] hover:text-white transition-colors mb-6 inline-block">
          ← Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-black text-[var(--text)] mb-3">Blog</h1>
        <p className="text-[var(--muted)] text-base leading-relaxed max-w-2xl">
          Letture brevi su filosofia morale, etica e la psicologia dietro le scelte impossibili.
          Ogni articolo è collegato a dilemmi reali su cui puoi votare.
        </p>
      </div>

      <div className="neon-divider mb-10 max-w-xs" />

      <BlogGrid posts={posts} locale="it" />

      <div className="mt-12 pt-8 border-t border-[var(--border)] text-center">
        <p className="text-xs text-[var(--muted)] mb-3">Preferisci votare?</p>
        <Link
          href="/it/trending"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold text-sm transition-all"
        >
          Vedi i dilemmi di tendenza →
        </Link>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { getPostsByLocale } from '@/lib/blog'
import type { BlogPost } from '@/lib/blog'
import { getPublishedBlogDrafts, getPublishedPostsForLocale } from '@/lib/blog-published'
import BlogGrid from '@/components/BlogGrid'

export const revalidate = 3600

const BASE = 'https://splitvote.io'

export const metadata: Metadata = {
  title: 'Blog — Ethics, Philosophy & Moral Dilemmas',
  description:
    'Short articles on moral philosophy, ethics, and the psychology behind impossible choices. Paired with real dilemmas you can vote on.',
  alternates: {
    canonical: `${BASE}/blog`,
    languages: {
      en:          `${BASE}/blog`,
      'it-IT':     `${BASE}/it/blog`,
      'x-default': `${BASE}/blog`,
    },
  },
  openGraph: {
    title: 'SplitVote Blog — Ethics & Moral Philosophy',
    description:
      'Short articles on moral philosophy, ethics, and the psychology behind impossible choices.',
    url: `${BASE}/blog`,
    type: 'website',
  },
}

export default async function BlogIndexPage() {
  const staticPosts = getPostsByLocale('en')

  let publishedPosts: BlogPost[] = []
  try {
    const published = await getPublishedBlogDrafts()
    publishedPosts = getPublishedPostsForLocale(published, 'en')
  } catch { /* Redis unavailable — static only */ }

  const staticSlugs = new Set(staticPosts.map(p => p.slug))
  const posts = [
    ...staticPosts,
    ...publishedPosts.filter(p => !staticSlugs.has(p.slug)),
  ].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12">
        <Link href="/" className="text-sm text-[var(--muted)] hover:text-white transition-colors mb-6 inline-block">
          ← Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-black text-[var(--text)] mb-3">Blog</h1>
        <p className="text-[var(--muted)] text-base leading-relaxed max-w-2xl">
          Short reads on moral philosophy, ethics, and the psychology behind impossible choices.
          Every article links to real dilemmas you can vote on.
        </p>
      </div>

      <div className="neon-divider mb-10 max-w-xs" />

      <BlogGrid posts={posts} locale="en" />

      <div className="mt-12 pt-8 border-t border-[var(--border)] text-center">
        <p className="text-xs text-[var(--muted)] mb-3">Prefer to vote instead?</p>
        <Link
          href="/trending"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold text-sm transition-all"
        >
          See trending dilemmas →
        </Link>
      </div>
    </div>
  )
}

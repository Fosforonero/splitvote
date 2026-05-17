import Link from 'next/link'
import type { BlogPost } from '@/lib/blog'
import BlogShareButton from './BlogShareButton'

/**
 * BlogGrid — server-rendered grid of all blog cards.
 *
 * No client pagination. The previous client-side slice() pagination
 * (commit history pre-2026-05-17) hid every article beyond the first 9
 * desktop / 4 mobile from the rendered HTML, blocking crawl equity to
 * the rest of the catalogue (sitemap discovered them but the index
 * didn't link to them). With ~35 posts per locale the full grid is
 * cheap to render and trivial to scroll.
 *
 * BlogShareButton stays client-side (it owns a popover) — Next.js
 * promotes only that subtree to a client island, the grid itself
 * remains server.
 */

const BASE = 'https://splitvote.io'

interface Props {
  posts: BlogPost[]
  locale: 'en' | 'it'
}

export default function BlogGrid({ posts, locale }: Props) {
  const basePath = locale === 'it' ? '/it/blog' : '/blog'
  const dateLocale = locale === 'it' ? 'it-IT' : 'en-US'
  const readingLabel = locale === 'it' ? 'min di lettura' : 'min read'
  const readLabel = locale === 'it' ? 'Leggi →' : 'Read →'

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <article
          key={post.slug}
          className="group flex flex-col rounded-2xl border border-[var(--border)] hover:border-[var(--border-hi)] hover:bg-white/5 transition-all"
        >
          <Link href={`${basePath}/${post.slug}`} className="block p-6 pb-3 flex-1">
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-lg font-black text-[var(--text)] group-hover:text-white transition-colors mb-2 leading-snug">
              {post.title}
            </h2>
            <p className="text-[var(--muted)] text-sm leading-relaxed">
              {post.description}
            </p>
          </Link>

          <div className="px-6 pb-5 flex items-center gap-2 text-xs text-[var(--muted)] flex-wrap">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString(dateLocale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span>·</span>
            <span>{post.readingTime} {readingLabel}</span>
            <div className="ml-auto flex items-center gap-2">
              <BlogShareButton
                title={post.title}
                text={post.description}
                url={`${BASE}${basePath}/${post.slug}`}
                locale={locale}
                slug={post.slug}
                target="blog_card"
              />
              <Link
                href={`${basePath}/${post.slug}`}
                aria-label={`${locale === 'it' ? 'Leggi' : 'Read'} ${post.title}`}
                className="text-violet-400 font-semibold hover:translate-x-0.5 transition-transform inline-block"
              >
                {readLabel}
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

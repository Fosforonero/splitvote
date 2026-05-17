import { MetadataRoute } from 'next'
import { scenarios, CATEGORIES } from '@/lib/scenarios'
import { getPostsByLocale } from '@/lib/blog'
import { getPublishedBlogDrafts, getPublishedPostsForLocale } from '@/lib/blog-published'
import { getIndexableITTopics, getIndexableTopics } from '@/lib/seo-topics'
import { CLUSTERS } from '@/lib/blog-clusters'

const BASE = 'https://splitvote.io'

// Stable date for evergreen / static surfaces. Bump only when sitemap
// structure changes meaningfully (added/removed URL classes, hreflang
// reshape, etc.). Avoid `new Date()` for evergreen URLs — Google
// deprioritizes crawl when every URL claims "modified just now" on every
// fetch. Real timestamps (post.date, scenario.generatedAt) are still used
// where available.
const STATIC_LAST_MOD = new Date('2026-05-16')

// AI-generated dynamic scenarios are intentionally NOT listed in the sitemap.
// They can be pruned from Redis when retention rolls over, which produced
// 404 churn in Google Search Console (8 URLs as of 16 May 2026). Crawl
// budget is better spent on durable surfaces (static scenarios, blog).
// Googlebot still discovers AI scenarios via internal links (RelatedDilemmas
// on /play and /results, plus /trending) — they remain indexable, just not
// volunteered for crawl.

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static scenario pages — EN + IT
  const scenarioRoutes = scenarios.flatMap((s) => [
    {
      url: `${BASE}/play/${s.id}`,
      lastModified: STATIC_LAST_MOD,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE}/results/${s.id}`,
      lastModified: STATIC_LAST_MOD,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${BASE}/it/play/${s.id}`,
      lastModified: STATIC_LAST_MOD,
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    },
    {
      url: `${BASE}/it/results/${s.id}`,
      lastModified: STATIC_LAST_MOD,
      changeFrequency: 'daily' as const,
      priority: 0.85,
    },
  ])

  // Category pages
  const categoryRoutes = CATEGORIES.filter((c) => c.value !== 'all').map((c) => ({
    url: `${BASE}/category/${c.value}`,
    lastModified: STATIC_LAST_MOD,
    changeFrequency: 'daily' as const,
    priority: 0.85,
  }))

  // SEO landing pages
  const topicRoutes = [
    ...getIndexableTopics().map((t) => ({
      url: `${BASE}/${t.slug}`,
      lastModified: STATIC_LAST_MOD,
      changeFrequency: 'weekly' as const,
      priority: 0.82,
    })),
    ...getIndexableITTopics().map((t) => ({
      url: `${BASE}/it/${t.slug}`,
      lastModified: STATIC_LAST_MOD,
      changeFrequency: 'weekly' as const,
      priority: 0.78,
    })),
  ]

  // Static + Redis-published blog posts
  const staticBlogPosts = [
    ...getPostsByLocale('en'),
    ...getPostsByLocale('it'),
  ]
  let publishedBlogPosts = [] as ReturnType<typeof getPostsByLocale>
  try {
    const published = await getPublishedBlogDrafts()
    publishedBlogPosts = [
      ...getPublishedPostsForLocale(published, 'en'),
      ...getPublishedPostsForLocale(published, 'it'),
    ]
  } catch {
    // Redis unavailable — sitemap falls back to static blog only
  }

  const seenBlogUrls = new Set<string>()
  const blogPostRoutes = [...staticBlogPosts, ...publishedBlogPosts]
    .map((p) => ({
      url: `${BASE}${p.locale === 'it' ? '/it' : ''}/blog/${p.slug}`,
      lastModified: p.dateModified ? new Date(p.dateModified) : new Date(p.date),
      changeFrequency: 'monthly' as const,
      priority: p.tags.includes('current events') || p.tags.includes('attualità') ? 0.75 : 0.68,
    }))
    .filter((route) => {
      if (seenBlogUrls.has(route.url)) return false
      seenBlogUrls.add(route.url)
      return true
    })

  // Freshness signal for the blog index — Googlebot re-crawls /blog when the
  // index lastModified moves. Pick the most recent dateModified/date across
  // the visible posts in the locale (static + Redis-published).
  const latestBlogModified = (locale: 'en' | 'it'): Date | null => {
    const localePosts = [...staticBlogPosts, ...publishedBlogPosts].filter(
      (p) => p.locale === locale,
    )
    if (localePosts.length === 0) return null
    const latestMs = localePosts.reduce((max, p) => {
      const ms = new Date(p.dateModified ?? p.date).getTime()
      return ms > max ? ms : max
    }, 0)
    return latestMs > 0 ? new Date(latestMs) : null
  }

  return [
    // Core pages
    {
      url: BASE,
      lastModified: STATIC_LAST_MOD,
      changeFrequency: 'hourly' as const,
      priority: 1,
    },
    {
      url: `${BASE}/trending`,
      lastModified: STATIC_LAST_MOD,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${BASE}/personality`,
      lastModified: STATIC_LAST_MOD,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    // Italian locale hub pages
    {
      url: `${BASE}/it`,
      lastModified: STATIC_LAST_MOD,
      changeFrequency: 'daily' as const,
      priority: 0.85,
    },
    {
      url: `${BASE}/it/trending`,
      lastModified: STATIC_LAST_MOD,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${BASE}/faq`,
      lastModified: STATIC_LAST_MOD,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${BASE}/store`,
      lastModified: STATIC_LAST_MOD,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${BASE}/login`,
      lastModified: STATIC_LAST_MOD,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    // Legal
    {
      url: `${BASE}/privacy`,
      lastModified: STATIC_LAST_MOD,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${BASE}/terms`,
      lastModified: STATIC_LAST_MOD,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    // Category hubs
    ...categoryRoutes,
    // SEO topic landings
    ...topicRoutes,
    // Blog index — use the freshest post date so Googlebot re-crawls the
    // index when a Redis-published article goes live. Falls back to
    // STATIC_LAST_MOD when no posts exist.
    {
      url: `${BASE}/blog`,
      lastModified: latestBlogModified('en') ?? STATIC_LAST_MOD,
      changeFrequency: 'daily' as const,
      priority: 0.72,
    },
    {
      url: `${BASE}/it/blog`,
      lastModified: latestBlogModified('it') ?? STATIC_LAST_MOD,
      changeFrequency: 'daily' as const,
      priority: 0.68,
    },
    ...blogPostRoutes,
    // Blog cluster hub pages — curated SEO entry points that link to the
    // articles + live dilemmas inside each topic. Static (4 hubs × 2 locales
    // = 8 URLs) so they can ship with the rest of the sitemap.
    ...CLUSTERS.flatMap((c) => [
      {
        url: `${BASE}/blog/topics/${c.slug.en}`,
        lastModified: STATIC_LAST_MOD,
        changeFrequency: 'weekly' as const,
        priority: 0.75,
      },
      {
        url: `${BASE}/it/blog/temi/${c.slug.it}`,
        lastModified: STATIC_LAST_MOD,
        changeFrequency: 'weekly' as const,
        priority: 0.72,
      },
    ]),
    // Topics hub — index of every indexable SEO topic landing page,
    // grouped by cluster. Static EN + IT pair.
    {
      url: `${BASE}/topics`,
      lastModified: STATIC_LAST_MOD,
      changeFrequency: 'weekly' as const,
      priority: 0.78,
    },
    {
      url: `${BASE}/it/temi`,
      lastModified: STATIC_LAST_MOD,
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    },
    // Static dilemmas (durable surface — AI dilemmas intentionally excluded;
    // discovered via internal links instead)
    ...scenarioRoutes,
  ]
}

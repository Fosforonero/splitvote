import type { BlogDraft } from './blog-drafts'
import type { BlogPost, SectionType } from './blog'

const BLOG_PUBLISHED_KEY = 'blog:published'
const BLOG_REVALIDATE_SECONDS = 3600

// Public read path for published blog posts.
//
// Do not use the shared Upstash Redis client here: its default fetch mode is
// `no-store`, which makes on-demand Redis blog slugs trip Next's
// static-to-dynamic guard when /blog/[slug] is configured for SSG + ISR.
// A plain REST GET with `next.revalidate` keeps the fetch cacheable and lets
// Redis-published slugs render through the ISR fallback without forcing the
// whole route dynamic.
export async function getPublishedBlogDrafts(): Promise<BlogDraft[]> {
  try {
    const url = process.env.KV_REST_API_URL
    const token = process.env.KV_REST_API_TOKEN
    if (!url || !token) return []

    const response = await fetch(
      `${url.replace(/\/$/, '')}/get/${encodeURIComponent(BLOG_PUBLISHED_KEY)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: BLOG_REVALIDATE_SECONDS },
      },
    )
    if (!response.ok) return []

    const payload = await response.json() as { result?: unknown }
    const raw = typeof payload.result === 'string'
      ? JSON.parse(payload.result) as unknown
      : payload.result
    return Array.isArray(raw) ? raw as BlogDraft[] : []
  } catch {
    return []
  }
}

function stripInlineBold(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '$1')
}

function bodyToSections(body: string | undefined | null): SectionType[] {
  if (!body || typeof body !== 'string') return []
  const lines = body.split('\n')
  const result: SectionType[] = []
  let listItems: string[] = []

  function flushList() {
    if (listItems.length > 0) {
      result.push({ type: 'list', items: [...listItems] })
      listItems = []
    }
  }

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) { flushList(); continue }

    if (trimmed.startsWith('## ')) {
      flushList()
      result.push({ type: 'h2', text: stripInlineBold(trimmed.slice(3).trim()) })
      continue
    }
    if (trimmed.startsWith('### ')) {
      flushList()
      result.push({ type: 'h3', text: stripInlineBold(trimmed.slice(4).trim()) })
      continue
    }
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      listItems.push(trimmed.slice(2).trim())
      continue
    }
    flushList()
    result.push({ type: 'p', text: trimmed })
  }
  flushList()

  return result.filter(s =>
    (s.type === 'p' && s.text.length > 0) ||
    (s.type === 'list' && s.items.length > 0) ||
    s.type === 'h2' || s.type === 'h3'
  )
}

export function publishedDraftToPost(draft: BlogDraft, locale: 'en' | 'it'): BlogPost {
  const article = draft.source.locale === locale ? draft.source : draft.translation!

  let alternateSlug: string | undefined
  if (draft.translation) {
    alternateSlug = draft.source.locale === locale
      ? draft.translation.slug
      : draft.source.slug
  }

  // Tolerate Redis drafts with missing/malformed body — return [] sections
  // rather than crash on body.split() / undefined.
  const safeBody = typeof article.body === 'string' ? article.body : ''
  const sections = bodyToSections(safeBody)

  if (Array.isArray(article.faq) && article.faq.length > 0) {
    sections.push({ type: 'h2', text: locale === 'it' ? 'Domande frequenti' : 'Frequently Asked Questions' })
    for (const { q, a } of article.faq) {
      sections.push({ type: 'h3', text: q })
      sections.push({ type: 'p', text: a })
    }
  }

  const words = safeBody.split(/\s+/).filter(Boolean).length

  return {
    slug: article.slug,
    locale,
    title: article.title,
    seoTitle: article.seoTitle,
    description: article.seoDescription,
    seoDescription: article.seoDescription,
    date: draft.publishedAt ?? draft.approvedAt ?? draft.generatedAt,
    readingTime: Math.max(1, Math.ceil(words / 200)),
    // Defensive defaults — Redis drafts may legitimately omit these
    // (e.g. an auto-generated article without keyword extraction). Returning
    // empty arrays prevents `.includes` / `.map` / `.join` crashes downstream
    // in BlogArticle + page-level JSON-LD generation.
    tags: Array.isArray(article.keywords) ? article.keywords : [],
    relatedDilemmaIds: Array.isArray(article.relatedDilemmaIds) ? article.relatedDilemmaIds : [],
    alternateSlug,
    faq: Array.isArray(article.faq) && article.faq.length > 0 ? article.faq : undefined,
    content: sections,
  }
}

export function getPublishedPostsForLocale(drafts: BlogDraft[], locale: 'en' | 'it'): BlogPost[] {
  const posts: BlogPost[] = []
  for (const draft of drafts) {
    if (draft.source.locale === locale) {
      posts.push(publishedDraftToPost(draft, locale))
    } else if (draft.translation?.locale === locale) {
      posts.push(publishedDraftToPost(draft, locale))
    }
  }
  return posts
}

export function findPublishedPost(drafts: BlogDraft[], slug: string, locale: 'en' | 'it'): BlogPost | null {
  for (const draft of drafts) {
    if (draft.source.locale === locale && draft.source.slug === slug) {
      return publishedDraftToPost(draft, locale)
    }
    if (draft.translation?.locale === locale && draft.translation.slug === slug) {
      return publishedDraftToPost(draft, locale)
    }
  }
  return null
}

export async function getPublishedPost(slug: string, locale: 'en' | 'it'): Promise<BlogPost | null> {
  const published = await getPublishedBlogDrafts()
  return findPublishedPost(published, slug, locale)
}

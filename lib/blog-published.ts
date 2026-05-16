import { redis } from './redis'
import type { BlogDraft } from './blog-drafts'
import type { BlogPost, SectionType } from './blog'

const BLOG_PUBLISHED_KEY = 'blog:published'

export async function getPublishedBlogDrafts(): Promise<BlogDraft[]> {
  try {
    const raw = await redis.get<BlogDraft[]>(BLOG_PUBLISHED_KEY)
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}

function stripInlineBold(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '$1')
}

function bodyToSections(body: string): SectionType[] {
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

  const sections = bodyToSections(article.body)

  if (article.faq && article.faq.length > 0) {
    sections.push({ type: 'h2', text: locale === 'it' ? 'Domande frequenti' : 'Frequently Asked Questions' })
    for (const { q, a } of article.faq) {
      sections.push({ type: 'h3', text: q })
      sections.push({ type: 'p', text: a })
    }
  }

  const words = article.body.split(/\s+/).filter(Boolean).length

  return {
    slug: article.slug,
    locale,
    title: article.title,
    seoTitle: article.seoTitle,
    description: article.seoDescription,
    seoDescription: article.seoDescription,
    date: draft.publishedAt ?? draft.approvedAt ?? draft.generatedAt,
    readingTime: Math.max(1, Math.ceil(words / 200)),
    tags: article.keywords,
    relatedDilemmaIds: article.relatedDilemmaIds,
    alternateSlug,
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

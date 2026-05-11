import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPost, getPostsByLocale, getAlternateUrl } from '@/lib/blog'
import { getPublishedBlogDrafts, findPublishedPost } from '@/lib/blog-published'
import BlogArticle from '@/components/BlogArticle'
import JsonLd from '@/components/JsonLd'

const BASE = 'https://splitvote.io'

interface Props {
  params: { slug: string }
}

export const dynamic = 'force-dynamic'

export function generateStaticParams() {
  return getPostsByLocale('en').map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let post = getPost(params.slug, 'en')
  if (!post) {
    try {
      const published = await getPublishedBlogDrafts()
      post = findPublishedPost(published, params.slug, 'en') ?? undefined
    } catch { /* Redis unavailable */ }
  }
  if (!post) return {}

  const canonical = `${BASE}/blog/${post.slug}`
  const alternateIt = getAlternateUrl(post)

  return {
    title: post.seoTitle,
    description: post.seoDescription,
    alternates: {
      canonical,
      languages: {
        en: canonical,
        ...(alternateIt ? { it: alternateIt } : {}),
        'x-default': canonical,
      },
    },
    openGraph: {
      title: post.seoTitle,
      description: post.seoDescription,
      url: canonical,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: 'summary',
      title: post.seoTitle,
      description: post.seoDescription,
      site: '@splitvote',
      creator: '@splitvote',
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  let post = getPost(params.slug, 'en')
  if (!post) {
    try {
      const published = await getPublishedBlogDrafts()
      post = findPublishedPost(published, params.slug, 'en') ?? undefined
    } catch { /* Redis unavailable */ }
  }
  if (!post) notFound()

  const canonical = `${BASE}/blog/${post.slug}`
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.seoTitle,
    description: post.seoDescription,
    datePublished: post.date,
    dateModified: post.date,
    url: canonical,
    inLanguage: 'en',
    author: {
      '@type': 'Organization',
      name: 'SplitVote',
      url: BASE,
    },
    image: [`${BASE}/og-default.png`],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical,
    },
    publisher: {
      '@type': 'Organization',
      name: 'SplitVote',
      url: BASE,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE}/icon.png`,
      },
    },
  }

  return (
    <>
      <JsonLd data={articleSchema} />
      <BlogArticle post={post} localePrefix="" />
    </>
  )
}

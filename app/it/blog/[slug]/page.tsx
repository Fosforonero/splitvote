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
  return getPostsByLocale('it').map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let post = getPost(params.slug, 'it')
  if (!post) {
    try {
      const published = await getPublishedBlogDrafts()
      post = findPublishedPost(published, params.slug, 'it') ?? undefined
    } catch { /* Redis unavailable */ }
  }
  if (!post) return {}

  const canonical = `${BASE}/it/blog/${post.slug}`
  const alternateEn = getAlternateUrl(post)

  return {
    title: post.seoTitle,
    description: post.seoDescription,
    alternates: {
      canonical,
      languages: {
        it: canonical,
        ...(alternateEn ? { en: alternateEn } : {}),
        'x-default': alternateEn ?? canonical,
      },
    },
    openGraph: {
      title: post.seoTitle,
      description: post.seoDescription,
      url: canonical,
      type: 'article',
      publishedTime: post.date,
      locale: 'it_IT',
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

export default async function ITBlogPostPage({ params }: Props) {
  let post = getPost(params.slug, 'it')
  if (!post) {
    try {
      const published = await getPublishedBlogDrafts()
      post = findPublishedPost(published, params.slug, 'it') ?? undefined
    } catch { /* Redis unavailable */ }
  }
  if (!post) notFound()

  const canonical = `${BASE}/it/blog/${post.slug}`
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.seoTitle,
    description: post.seoDescription,
    datePublished: post.date,
    dateModified: post.date,
    url: canonical,
    inLanguage: 'it',
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
      <BlogArticle post={post} localePrefix="/it" />
    </>
  )
}

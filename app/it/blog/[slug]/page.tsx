import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPost, getPostsByLocale, getAlternateUrl, getBlogImage, absoluteBlogImageUrl } from '@/lib/blog'
import { getPublishedBlogDrafts, findPublishedPost } from '@/lib/blog-published'
import BlogArticle from '@/components/BlogArticle'
import JsonLd from '@/components/JsonLd'

const BASE = 'https://splitvote.io'

interface Props {
  params: { slug: string }
}

// Blog articles don't contain per-user content — ISR 1 hour is safe
export const revalidate = 3600

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
  const heroImage = getBlogImage(post)
  const absoluteImage = absoluteBlogImageUrl(heroImage.src)

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
      ...(post.dateModified ? { modifiedTime: post.dateModified } : {}),
      locale: 'it_IT',
      tags: post.tags,
      images: [
        {
          url:    absoluteImage,
          width:  heroImage.width,
          height: heroImage.height,
          alt:    heroImage.alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle,
      description: post.seoDescription,
      site: '@splitvote',
      creator: '@splitvote',
      images: [absoluteImage],
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
  const heroImage = getBlogImage(post)
  const absoluteImage = absoluteBlogImageUrl(heroImage.src)
  const attribution = heroImage.attribution

  const imageNode = attribution
    ? {
        '@type':     'ImageObject',
        url:         absoluteImage,
        contentUrl:  absoluteImage,
        width:       heroImage.width,
        height:      heroImage.height,
        creator:     { '@type': 'Person', name: attribution.creator, ...(attribution.creatorUrl ? { url: attribution.creatorUrl } : {}) },
        creditText:  attribution.creditText,
        license:     attribution.licenseUrl,
        acquireLicensePage: attribution.sourceUrl,
      }
    : absoluteImage

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type':    'BlogPosting',
    headline:        post.seoTitle,
    description:     post.seoDescription,
    url:             canonical,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    datePublished:   post.date,
    dateModified:    post.dateModified ?? post.date,
    inLanguage:      'it',
    author:          { '@type': 'Organization', name: 'SplitVote', url: BASE },
    publisher: {
      '@type': 'Organization',
      name: 'SplitVote',
      url: BASE,
      logo: {
        '@type': 'ImageObject',
        url:    `${BASE}/brand/splitvote_icon.png`,
        width:  387,
        height: 376,
      },
    },
    image:    imageNode,
    keywords: post.tags.join(', '),
  }

  return (
    <>
      <JsonLd data={blogPostingSchema} />
      <BlogArticle post={post} localePrefix="/it" />
    </>
  )
}

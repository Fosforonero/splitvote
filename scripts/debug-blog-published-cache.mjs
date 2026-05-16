#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { createRequire } from 'node:module'
import { Redis } from '@upstash/redis'

const require = createRequire(import.meta.url)
const BLOG_PUBLISHED_KEY = 'blog:published'

function parseArgs(argv) {
  const args = {
    envFile: '.env.vercel-production.local',
    key: BLOG_PUBLISHED_KEY,
    slug: null,
  }
  for (const arg of argv) {
    if (arg.startsWith('--env-file=')) args.envFile = arg.slice('--env-file='.length)
    else if (arg.startsWith('--key=')) args.key = arg.slice('--key='.length)
    else if (arg.startsWith('--slug=')) args.slug = arg.slice('--slug='.length)
  }
  return args
}

function loadEnvFile(filePath) {
  const abs = resolve(filePath)
  if (!existsSync(abs)) return false
  const content = readFileSync(abs, 'utf8')
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/)
    if (!match) continue
    const [, key, rawValue] = match
    if (process.env[key]) continue
    let value = rawValue.trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    process.env[key] = value
  }
  return true
}

function text(value) {
  return typeof value === 'string' ? value : ''
}

function stringArray(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === 'string') : []
}

function bodyToSections(body) {
  const lines = text(body).split('\n')
  const sections = []
  let listItems = []

  function flushList() {
    if (listItems.length > 0) {
      sections.push({ type: 'list', items: [...listItems] })
      listItems = []
    }
  }

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      flushList()
      continue
    }
    if (trimmed.startsWith('## ')) {
      flushList()
      sections.push({ type: 'h2', text: trimmed.slice(3).trim() })
      continue
    }
    if (trimmed.startsWith('### ')) {
      flushList()
      sections.push({ type: 'h3', text: trimmed.slice(4).trim() })
      continue
    }
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      listItems.push(trimmed.slice(2).trim())
      continue
    }
    flushList()
    sections.push({ type: 'p', text: trimmed })
  }
  flushList()
  return sections
}

function inspectArticle(article, locale, draftId) {
  const issues = []
  if (!article || typeof article !== 'object') {
    issues.push(`${locale}: missing article object`)
    return { issues, post: null }
  }

  for (const field of ['slug', 'title', 'seoTitle', 'seoDescription']) {
    if (typeof article[field] !== 'string' || article[field].trim().length === 0) {
      issues.push(`${locale}: ${field} missing/non-string`)
    }
  }
  if (typeof article.body !== 'string') issues.push(`${locale}: body missing/non-string`)
  if (article.keywords != null && !Array.isArray(article.keywords)) issues.push(`${locale}: keywords non-array`)
  if (article.relatedDilemmaIds != null && !Array.isArray(article.relatedDilemmaIds)) {
    issues.push(`${locale}: relatedDilemmaIds non-array`)
  }
  if (article.faq != null && !Array.isArray(article.faq)) issues.push(`${locale}: faq non-array`)

  const faq = Array.isArray(article.faq) ? article.faq : []
  faq.forEach((item, index) => {
    if (!item || typeof item.q !== 'string' || typeof item.a !== 'string') {
      issues.push(`${locale}: faq[${index}] malformed`)
    }
  })

  const body = text(article.body)
  const sections = bodyToSections(body)
  for (const item of faq) {
    if (typeof item?.q === 'string' && typeof item?.a === 'string') {
      sections.push({ type: 'h3', text: item.q }, { type: 'p', text: item.a })
    }
  }

  return {
    issues,
    post: {
      draftId,
      locale,
      slug: text(article.slug),
      title: text(article.title),
      words: body.split(/\s+/).filter(Boolean).length,
      sections: sections.length,
      tags: stringArray(article.keywords).length,
      relatedDilemmaIds: stringArray(article.relatedDilemmaIds).length,
    },
  }
}

function inspectDraft(draft) {
  const issues = []
  const posts = []
  if (!draft || typeof draft !== 'object') {
    return { draftId: '(unknown)', issues: ['draft is not an object'], posts }
  }

  const draftId = text(draft.id) || '(missing id)'
  if (draft.status !== 'published') issues.push('draft status is not published')
  for (const field of ['generatedAt', 'topic']) {
    if (typeof draft[field] !== 'string' || draft[field].trim().length === 0) {
      issues.push(`${field} missing/non-string`)
    }
  }

  if (!draft.source || typeof draft.source !== 'object') {
    issues.push('source missing/non-object')
  } else {
    const sourceLocale = draft.source.locale === 'it' ? 'it' : 'en'
    const inspected = inspectArticle(draft.source, sourceLocale, draftId)
    issues.push(...inspected.issues)
    if (inspected.post) posts.push(inspected.post)
  }

  if (draft.translation != null) {
    const translationLocale = draft.translation?.locale === 'it' ? 'it' : 'en'
    const inspected = inspectArticle(draft.translation, translationLocale, draftId)
    issues.push(...inspected.issues)
    if (inspected.post) posts.push(inspected.post)
  }

  return { draftId, issues, posts }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const loadedEnv = loadEnvFile(args.envFile)
  const react = require('react')

  console.log('Blog published Redis debug (read-only)')
  console.log(`env_file_loaded=${loadedEnv}`)
  console.log(`react_version=${react.version ?? 'unknown'}`)
  console.log(`react_cache_export=${typeof react.cache}`)
  console.log(`redis_key=${args.key}`)

  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN
  if (!url || !token) {
    throw new Error('Missing KV_REST_API_URL or KV_REST_API_TOKEN')
  }

  const redis = new Redis({ url, token })
  const raw = await redis.get(args.key)
  const drafts = Array.isArray(raw) ? raw : []
  console.log(`drafts=${drafts.length}`)

  const inspected = drafts.map(inspectDraft)
  const posts = inspected.flatMap((item) => item.posts)
  const issues = inspected.flatMap((item) => item.issues.map((issue) => `${item.draftId}: ${issue}`))

  const byLocale = posts.reduce((acc, post) => {
    acc[post.locale] = (acc[post.locale] ?? 0) + 1
    return acc
  }, {})

  console.log(`posts=${posts.length}`)
  console.log(`posts_en=${byLocale.en ?? 0}`)
  console.log(`posts_it=${byLocale.it ?? 0}`)
  console.log(`issues=${issues.length}`)

  if (args.slug) {
    const matches = posts.filter((post) => post.slug === args.slug)
    console.log(`slug_matches=${matches.length}`)
    for (const post of matches) {
      console.log(
        `slug=${post.slug} locale=${post.locale} words=${post.words} sections=${post.sections} tags=${post.tags} related=${post.relatedDilemmaIds}`,
      )
    }
  }

  if (issues.length > 0) {
    console.log('issue_list:')
    for (const issue of issues) console.log(`- ${issue}`)
  }
}

main().catch((error) => {
  console.error(`ERROR: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
})

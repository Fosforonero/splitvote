import { MetadataRoute } from 'next'
import { scenarios, CATEGORIES } from '@/lib/scenarios'
import { getDynamicScenarios } from '@/lib/dynamic-scenarios'

const BASE = 'https://splitvote.io'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Fetch AI-generated dilemmas from Redis (cron job generates these daily)
  let dynamicScenarios: Array<{ id: string; generatedAt: string; locale: string }> = []
  try {
    const dynamic = await getDynamicScenarios()
    dynamicScenarios = dynamic.map((s) => ({
      id:          s.id,
      generatedAt: s.generatedAt,
      locale:      s.locale,
    }))
  } catch {
    // Redis unavailable — sitemap falls back to static only
  }

  // Static scenario pages — EN + IT
  const scenarioRoutes = scenarios.flatMap((s) => [
    {
      url: `${BASE}/play/${s.id}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE}/results/${s.id}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${BASE}/it/play/${s.id}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    },
    {
      url: `${BASE}/it/results/${s.id}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.85,
    },
  ])

  // AI-generated scenario pages — locale-aware URLs, real generatedAt timestamp
  const dynamicRoutes = dynamicScenarios.flatMap(({ id, generatedAt, locale }) => {
    const lastMod = generatedAt ? new Date(generatedAt) : now
    const isIT = locale === 'it'
    const playUrl    = isIT ? `${BASE}/it/play/${id}`    : `${BASE}/play/${id}`
    const resultsUrl = isIT ? `${BASE}/it/results/${id}` : `${BASE}/results/${id}`
    return [
      {
        url: playUrl,
        lastModified: lastMod,
        changeFrequency: 'weekly' as const,
        priority: isIT ? 0.72 : 0.75,
      },
      {
        url: resultsUrl,
        lastModified: lastMod,
        changeFrequency: 'daily' as const,
        priority: isIT ? 0.82 : 0.85,
      },
    ]
  })

  // Category pages
  const categoryRoutes = CATEGORIES.filter((c) => c.value !== 'all').map((c) => ({
    url: `${BASE}/category/${c.value}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.85,
  }))

  return [
    // Core pages
    {
      url: BASE,
      lastModified: now,
      changeFrequency: 'hourly' as const,
      priority: 1,
    },
    {
      url: `${BASE}/trending`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${BASE}/personality`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    // Italian locale hub pages
    {
      url: `${BASE}/it`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.85,
    },
    {
      url: `${BASE}/it/trending`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${BASE}/faq`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${BASE}/store`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${BASE}/login`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    // Legal
    {
      url: `${BASE}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${BASE}/terms`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    // Category hubs
    ...categoryRoutes,
    // Static dilemmas
    ...scenarioRoutes,
    // AI-generated dilemmas (updates daily, real timestamps)
    ...dynamicRoutes,
  ]
}

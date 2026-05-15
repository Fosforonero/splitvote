/**
 * Dynamic scenarios — stored in Upstash Redis, generated daily by the cron job.
 *
 * Two Redis keys:
 *   dynamic:scenarios  — approved/published (public-facing)
 *   dynamic:drafts     — generated but not yet reviewed by admin
 */

import { redis } from './redis'
import type { Scenario } from './scenarios'

const DYNAMIC_KEY      = 'dynamic:scenarios'
const DRAFTS_KEY       = 'dynamic:drafts'
const MAX_DRAFTS       = 120
const APPROVE_LOCK_KEY = 'dynamic:approve-lock'
const LOCK_TTL_MS      = 5000

function parseScenarioList(raw: unknown): DynamicScenario[] {
  if (Array.isArray(raw)) return raw as DynamicScenario[]

  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed as DynamicScenario[] : []
    } catch {
      return []
    }
  }

  return []
}

export class ApproveLockError extends Error {
  constructor() {
    super('Another approval is in progress')
    this.name = 'ApproveLockError'
  }
}

async function acquireApproveLock(): Promise<string | null> {
  const token = globalThis.crypto.randomUUID()
  const result = await redis.set(APPROVE_LOCK_KEY, token, { nx: true, px: LOCK_TTL_MS })
  return result === 'OK' ? token : null
}

async function releaseApproveLock(token: string): Promise<void> {
  const lua = `
    if redis.call("GET", KEYS[1]) == ARGV[1] then
      return redis.call("DEL", KEYS[1])
    else
      return 0
    end
  `
  await redis.eval(lua, [APPROVE_LOCK_KEY], [token])
}

// Strict read: does not swallow errors. Callers inside the approve lock
// need real failures to propagate rather than silently returning [].
async function getApprovedScenariosStrict(): Promise<DynamicScenario[]> {
  const raw = await redis.get<DynamicScenario[] | string>(DYNAMIC_KEY)
  return parseScenarioList(raw).map(s => ({ ...s, status: s.status ?? 'approved' }))
}

export type DilemmaStatus = 'draft' | 'approved' | 'rejected'
export type TrendSource   = 'google_trends' | 'reddit' | 'rss' | 'internal_feedback' | 'mixed' | 'openrouter'

export interface DilemmaScores {
  viralScore:    number  // 0-100
  seoScore:      number  // 0-100
  noveltyScore:  number  // 0-100
  feedbackScore: number  // 0-100 (starts at 50, updated as users rate)
  finalScore:    number  // weighted average
}

export interface DynamicScenario extends Scenario {
  generatedAt:        string          // ISO timestamp
  approvedAt?:        string          // ISO timestamp, set on approval
  trend:              string
  locale:             string
  status?:            DilemmaStatus
  trendSource?:       TrendSource
  trendUrl?:          string          // optional source URL
  seoTitle?:          string
  seoDescription?:    string
  keywords?:          string[]
  scores?:            DilemmaScores
  // Autopublish audit metadata — set when AUTO_PUBLISH_DILEMMAS=true
  autoPublished?:     boolean
  qualityGateScore?:  number
  qualityGateReasons?: string[]
  generatedBy?:       'cron' | 'admin' | 'seed_batch'
  // AI-generated expert insight fields — draft only, shown after admin approval.
  // Override the static category-level fallback in lib/expert-insights.ts.
  expertInsightEn?:   import('./expert-insights').DynamicExpertInsight
  expertInsightIt?:   import('./expert-insights').DynamicExpertInsight
  semanticReview?: {
    verdict:            'novel' | 'related_but_distinct' | 'too_similar' | 'duplicate'
    reason:             string
    closestMatchId?:    string
    closestMatchTitle?: string
  }
  // 'moral' = ethical dilemma (default); 'lifestyle' = fun preference question
  dilemmaStyle?: 'moral' | 'lifestyle'
}

// ── Approved (public) scenarios ───────────────────────────────

export async function getDynamicScenarios(): Promise<DynamicScenario[]> {
  try {
    const raw = await redis.get<DynamicScenario[] | string>(DYNAMIC_KEY)
    return parseScenarioList(raw).map(s => ({ ...s, status: s.status ?? 'approved' }))
  } catch {
    return []
  }
}

export async function getDynamicScenariosByLocale(locale: string): Promise<DynamicScenario[]> {
  const all = await getDynamicScenarios()
  return all.filter(s => s.locale === locale)
}

export async function getDynamicScenario(id: string): Promise<DynamicScenario | undefined> {
  // Public consumers must only resolve approved scenarios.
  // Drafts are visible only through admin-specific APIs.
  const approved = await getDynamicScenarios()
  return approved.find(s => s.id === id)
}

export async function saveDynamicScenarios(newOnes: DynamicScenario[]): Promise<void> {
  const existing = await getDynamicScenarios()
  const existingIds = new Set(existing.map(s => s.id))
  const toAdd = newOnes
    .filter(s => !existingIds.has(s.id))
    .map(s => ({ ...s, status: 'approved' as DilemmaStatus }))
  const merged = [...toAdd, ...existing]
  await redis.set(DYNAMIC_KEY, merged)
}

// ── Draft queue ───────────────────────────────────────────────

export async function getDraftScenarios(): Promise<DynamicScenario[]> {
  try {
    const raw = await redis.get<DynamicScenario[] | string>(DRAFTS_KEY)
    return parseScenarioList(raw)
  } catch {
    return []
  }
}

export async function saveDraftScenarios(newOnes: DynamicScenario[]): Promise<void> {
  const existing = await getDraftScenarios()
  const existingIds = new Set(existing.map(s => s.id))
  const toAdd = newOnes
    .filter(s => !existingIds.has(s.id))
    .map(s => ({ ...s, status: 'draft' as DilemmaStatus }))
  // Sort by finalScore desc before saving
  const merged = [...toAdd, ...existing]
    .slice(0, MAX_DRAFTS)
    .sort((a, b) => (b.scores?.finalScore ?? 0) - (a.scores?.finalScore ?? 0))
  await redis.set(DRAFTS_KEY, merged)
}

export async function approveDraftScenario(id: string): Promise<DynamicScenario | null> {
  const token = await acquireApproveLock()
  if (!token) throw new ApproveLockError()

  try {
    const drafts = await getDraftScenarios()
    const idx = drafts.findIndex(s => s.id === id)
    if (idx === -1) return null

    const scenario: DynamicScenario = {
      ...drafts[idx],
      status: 'approved',
      approvedAt: new Date().toISOString(),
    }

    const approved = await getApprovedScenariosStrict()
    const newDrafts = drafts.filter(s => s.id !== id)

    if (!approved.some(s => s.id === scenario.id)) {
      // Write approved list first — if this fails, draft stays in queue (recoverable).
      await redis.set(DYNAMIC_KEY, [scenario, ...approved])
    }
    // Remove from draft queue only after approved write succeeds.
    await redis.set(DRAFTS_KEY, newDrafts)

    return scenario
  } finally {
    await releaseApproveLock(token)
  }
}

export async function rejectDraftScenario(id: string): Promise<boolean> {
  const drafts = await getDraftScenarios()
  if (!drafts.find(s => s.id === id)) return false
  await redis.set(DRAFTS_KEY, drafts.filter(s => s.id !== id))
  return true
}

type PatchableFields = Pick<DynamicScenario, 'question' | 'optionA' | 'optionB' | 'seoTitle' | 'seoDescription'>

export async function patchApprovedScenario(
  id: string,
  patch: Partial<PatchableFields>,
): Promise<string | null> {
  const scenarios = await getDynamicScenarios()
  const idx = scenarios.findIndex(s => s.id === id)
  if (idx === -1) return null
  scenarios[idx] = { ...scenarios[idx], ...patch }
  await redis.set(DYNAMIC_KEY, scenarios)
  return scenarios[idx].category
}

// ── Feedback score update ────────────────────────────────────

/**
 * Update the feedbackScore of an approved scenario based on up/down ratings.
 * Uses Bayesian smoothing (10 pseudo-votes at 50% prior) to prevent extreme
 * scores from small samples. Converges to the true rate as volume grows.
 */
export async function updateFeedbackScore(
  id: string,
  upvotes: number,
  downvotes: number,
): Promise<void> {
  const scenarios = await getDynamicScenarios()
  const idx = scenarios.findIndex(s => s.id === id)
  if (idx === -1) return

  const total = upvotes + downvotes
  // Bayesian smoothing: 10 pseudo-votes at 50% prior.
  // Prevents extreme scores from small samples; converges to true rate at volume.
  const feedbackScore = Math.round(((upvotes + 5) / (total + 10)) * 100)

  const s = scenarios[idx]
  const oldScores = s.scores
  if (oldScores) {
    const newFinalScore = computeFinalScore({ ...oldScores, feedbackScore })
    scenarios[idx] = {
      ...s,
      scores: { ...oldScores, feedbackScore, finalScore: newFinalScore },
    }
    await redis.set(DYNAMIC_KEY, scenarios)
  }
}

function computeFinalScore(scores: Omit<DilemmaScores, 'finalScore'>): number {
  return Math.round(
    scores.viralScore   * 0.35 +
    scores.seoScore     * 0.25 +
    scores.noveltyScore * 0.25 +
    scores.feedbackScore * 0.15
  )
}

// ── Semantic dedup ────────────────────────────────────────────

function tokenize(text: string): Set<string> {
  return new Set(text.toLowerCase().split(/\W+/).filter(w => w.length > 3))
}

function jaccardSimilarity(a: string, b: string): number {
  const sa = tokenize(a)
  const sb = tokenize(b)
  const intersection = [...sa].filter(x => sb.has(x)).length
  const union = new Set([...sa, ...sb]).size
  return union === 0 ? 0 : intersection / union
}

export function isSimilarToExisting(
  candidate: Pick<DynamicScenario, 'id' | 'question' | 'trend'>,
  existing: Pick<DynamicScenario, 'id' | 'question' | 'trend'>[],
  threshold = 0.4,
): boolean {
  if (existing.some(e => e.id === candidate.id)) return true
  return existing.some(e =>
    jaccardSimilarity(candidate.question, e.question) > threshold ||
    (candidate.trend && e.trend && jaccardSimilarity(candidate.trend, e.trend) > 0.6)
  )
}

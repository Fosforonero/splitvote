// ── Companion species definitions ────────────────────────────────
export type CompanionSpecies = 'spark' | 'blip' | 'momo' | 'shade' | 'orbit'

export interface CompanionDef {
  id: CompanionSpecies
  name: string
  description: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockCondition: string
  // Emoji per stage 1-6
  stageEmoji: [string, string, string, string, string, string]
  color: string
}

export const COMPANIONS: CompanionDef[] = [
  {
    id: 'spark',
    name: 'Pixie Spark',
    description: 'A curious little energy being who loves bold choices.',
    rarity: 'common',
    unlockCondition: 'Available to all users',
    stageEmoji: ['⚡', '⚡', '🌟', '💫', '✨', '🌟'],
    color: 'text-yellow-400',
  },
  {
    id: 'blip',
    name: 'Pixie Glitch',
    description: 'A glitchy digital creature that feeds on data and dilemmas.',
    rarity: 'common',
    unlockCondition: 'Available to all users',
    stageEmoji: ['🔮', '🔮', '💎', '🌀', '🌐', '💠'],
    color: 'text-purple-400',
  },
  {
    id: 'momo',
    name: 'Pixie Leaf',
    description: 'A cheerful forest spirit who weighs every decision carefully.',
    rarity: 'rare',
    unlockCondition: 'Earn the 10 Votes badge',
    stageEmoji: ['🍄', '🍄', '🌿', '🌲', '🌳', '🍃'],
    color: 'text-green-400',
  },
  {
    id: 'shade',
    name: 'Pixie Moonlight',
    description: 'A mysterious lunar entity who thrives in moral ambiguity.',
    rarity: 'epic',
    unlockCondition: 'Maintain a 7-day streak',
    stageEmoji: ['🌑', '🌒', '🌓', '🌔', '🌕', '🌙'],
    color: 'text-blue-400',
  },
  {
    id: 'orbit',
    name: 'Pixie Hologram',
    description: 'A cosmic wanderer who has seen every dilemma in the universe.',
    rarity: 'legendary',
    unlockCondition: 'Reach 100 votes',
    stageEmoji: ['🪐', '🪐', '🌌', '☄️', '🌠', '💿'],
    color: 'text-orange-400',
  },
]

export const COMPANION_MAP: Record<CompanionSpecies, CompanionDef> = Object.fromEntries(
  COMPANIONS.map(c => [c.id, c])
) as Record<CompanionSpecies, CompanionDef>

// Stage thresholds (based on votes_count)
export function getCompanionStage(votesCount: number): 1 | 2 | 3 | 4 | 5 | 6 {
  if (votesCount >= 1000) return 6
  if (votesCount >= 500) return 5
  if (votesCount >= 100) return 4
  if (votesCount >= 50)  return 3
  if (votesCount >= 10)  return 2
  return 1
}

export const STAGE_LABELS: Record<number, string> = {
  1: 'Hatchling',
  2: 'Fledgling',
  3: 'Explorer',
  4: 'Champion',
  5: 'Legendary',
  6: 'Ultra Legendary',
}

export const STAGE_THRESHOLDS = [0, 10, 50, 100, 500, 1000]

/** Returns votes needed to reach the next stage, or 0 if at max. */
export function votesToNextStage(votesCount: number): number {
  const stage = getCompanionStage(votesCount)
  if (stage === 6) return 0
  return STAGE_THRESHOLDS[stage] - votesCount
}

export const RARITY_STYLES: Record<string, string> = {
  common:    'border-slate-500/40 bg-slate-500/10 text-slate-300',
  rare:      'border-blue-500/40  bg-blue-500/10  text-blue-300',
  epic:      'border-purple-500/40 bg-purple-500/10 text-purple-300',
  legendary: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-300',
}

// ── Per-species XP ────────────────────────────────────────────────────────────

/**
 * Maps each species to the number of votes cast while it was equipped.
 * Stored as JSONB `pixie_xp` on profiles. Keys may be absent (treat as 0).
 */
export type PixieXpMap = Partial<Record<CompanionSpecies, number>>

/** Votes accumulated for a specific species. Falls back to 0. */
export function getSpeciesVotes(xpMap: PixieXpMap, species: CompanionSpecies): number {
  return xpMap[species] ?? 0
}

/** Stage for a specific species based on its own accumulated votes. */
export function getSpeciesStage(xpMap: PixieXpMap, species: CompanionSpecies): 1 | 2 | 3 | 4 | 5 | 6 {
  return getCompanionStage(getSpeciesVotes(xpMap, species))
}

/** Votes the current species needs to reach the next stage. */
export function votesToNextStageForSpecies(xpMap: PixieXpMap, species: CompanionSpecies): number {
  return votesToNextStage(getSpeciesVotes(xpMap, species))
}

/** Unlock conditions (in sync with CompanionDef.unlockCondition strings). */
const UNLOCK_REQUIREMENTS: Record<CompanionSpecies, (votes: number, streak: number) => boolean> = {
  spark: () => true,
  blip:  () => true,
  momo:  (votes) => votes >= 10,
  shade: (_, streak) => streak >= 7,
  orbit: (votes) => votes >= 100,
}

/**
 * Returns the species that the user has unlocked.
 * `heart` and `robot` are premium/future — not included here.
 */
export function getUnlockedSpecies(votesCount: number, streakDays: number): CompanionSpecies[] {
  return COMPANIONS
    .map(c => c.id)
    .filter(id => UNLOCK_REQUIREMENTS[id]?.(votesCount, streakDays) ?? false)
}

/** Returns true if the given species is unlocked for the user. */
export function isSpeciesUnlocked(
  species: CompanionSpecies,
  votesCount: number,
  streakDays: number,
): boolean {
  return UNLOCK_REQUIREMENTS[species]?.(votesCount, streakDays) ?? false
}

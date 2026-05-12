// ── Companion species definitions ────────────────────────────────
export type CompanionAccess = 'free' | 'premium' | 'market' | 'admin'

export type CompanionSpecies =
  | 'spark' | 'blip' | 'momo' | 'shade' | 'orbit'                           // free
  | 'banana' | 'leaf' | 'ice'                                                // free (new, vote-gated)
  | 'heart' | 'robot'                                                        // premium (subscription)
  | 'fuoco' | 'caffe' | 'hologram' | 'moonlight' | 'triste'                  // premium (subscription, new)
  | 'crown' | 'diamond' | 'galaxy' | 'angel' | 'devil'                       // market (one-time purchase)
  | 'scintille'                                                              // market (one-time purchase, new)
  | 'overseer' | 'void'                                                      // admin-only
  | 'voidcore'                                                               // admin-only (new)

export interface CompanionDef {
  id: CompanionSpecies
  name: string
  description: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  /** Controls visibility and entitlement:
   *  - free:    available to all based on votes/streak
   *  - premium: included immediately with active Premium subscription
   *  - market:  must be purchased individually in the Pixie Market
   *             (Premium subscribers still need to buy these one-by-one)
   *  - admin:   only visible to admin users, never in public store
   */
  access: CompanionAccess
  unlockCondition: string
  stageEmoji: [string, string, string, string, string, string]
  color: string
  /** Price in cents (EUR) for `market` species. Required for `market`, ignored otherwise. */
  marketPriceCents?: number
}

export const COMPANIONS: CompanionDef[] = [
  // ── Free (vote/streak gated) ─────────────────────────────────────
  {
    id: 'spark',
    name: 'Pixie Spark',
    description: 'A curious little energy being who loves bold choices.',
    rarity: 'common',
    access: 'free',
    unlockCondition: 'Available to all users',
    stageEmoji: ['⚡', '⚡', '🌟', '💫', '✨', '🌟'],
    color: 'text-yellow-400',
  },
  {
    id: 'blip',
    name: 'Pixie Glitch',
    description: 'A glitchy digital creature that feeds on data and dilemmas.',
    rarity: 'common',
    access: 'free',
    unlockCondition: 'Available to all users',
    stageEmoji: ['🔮', '🔮', '💎', '🌀', '🌐', '💠'],
    color: 'text-purple-400',
  },
  {
    id: 'momo',
    name: 'Pixie Leaf',
    description: 'A cheerful forest spirit who weighs every decision carefully.',
    rarity: 'rare',
    access: 'free',
    unlockCondition: 'Reach 50 votes',
    stageEmoji: ['🍄', '🍄', '🌿', '🌲', '🌳', '🍃'],
    color: 'text-green-400',
  },
  {
    id: 'shade',
    name: 'Pixie Moonlight',
    description: 'A mysterious lunar entity who thrives in moral ambiguity.',
    rarity: 'epic',
    access: 'free',
    unlockCondition: 'Maintain a 7-day streak',
    stageEmoji: ['🌑', '🌒', '🌓', '🌔', '🌕', '🌙'],
    color: 'text-blue-400',
  },
  {
    id: 'banana',
    name: 'Pixie Nana',
    description: 'A cheerful, sunny companion who finds joy even in the hardest dilemmas.',
    rarity: 'rare',
    access: 'free',
    unlockCondition: 'Reach 100 votes',
    stageEmoji: ['🍌', '🍌', '🌟', '✨', '💛', '🌈'],
    color: 'text-yellow-400',
  },
  {
    id: 'leaf',
    name: 'Pixie Blossom',
    description: 'A gentle nature spirit who blooms with every courageous vote.',
    rarity: 'epic',
    access: 'free',
    unlockCondition: 'Reach 200 votes',
    stageEmoji: ['🌱', '🌱', '🌸', '🌺', '🌳', '🍃'],
    color: 'text-green-400',
  },
  {
    id: 'orbit',
    name: 'Pixie Hologram',
    description: 'A cosmic wanderer who has seen every dilemma in the universe.',
    rarity: 'legendary',
    access: 'free',
    unlockCondition: 'Reach 300 votes',
    stageEmoji: ['🪐', '🪐', '🌌', '☄️', '🌠', '💿'],
    color: 'text-orange-400',
  },
  {
    id: 'ice',
    name: 'Pixie Frost',
    description: 'A cool, calculating creature who never loses composure under moral pressure.',
    rarity: 'epic',
    access: 'free',
    unlockCondition: 'Reach 500 votes',
    stageEmoji: ['❄️', '❄️', '🧊', '⛄', '🌨️', '💎'],
    color: 'text-cyan-400',
  },

  // ── Premium (included with subscription) ────────────────────────
  {
    id: 'heart',
    name: 'Pixie Heart',
    description: 'A warm, empathetic creature who feels every dilemma deeply.',
    rarity: 'epic',
    access: 'premium',
    unlockCondition: 'Included with Premium',
    stageEmoji: ['❤️', '❤️', '💝', '💖', '💗', '💞'],
    color: 'text-pink-400',
  },
  {
    id: 'robot',
    name: 'Pixie Bot',
    description: 'A logical machine who calculates the optimal moral outcome.',
    rarity: 'epic',
    access: 'premium',
    unlockCondition: 'Included with Premium',
    stageEmoji: ['🤖', '🤖', '⚙️', '🔧', '💻', '🦾'],
    color: 'text-sky-400',
  },
  {
    id: 'fuoco',
    name: 'Pixie Ember',
    description: 'A fiery spirit who burns brightest when facing impossible choices.',
    rarity: 'epic',
    access: 'premium',
    unlockCondition: 'Included with Premium',
    stageEmoji: ['🔥', '🔥', '🌋', '☄️', '🌟', '⚡'],
    color: 'text-orange-400',
  },
  {
    id: 'caffe',
    name: 'Pixie Brew',
    description: 'A sharp, caffeinated spirit who thinks faster than anyone — even before your first cup.',
    rarity: 'rare',
    access: 'premium',
    unlockCondition: 'Included with Premium',
    stageEmoji: ['☕', '☕', '🫖', '⚡', '💫', '✨'],
    color: 'text-amber-600',
  },
  {
    id: 'hologram',
    name: 'Pixie Aura',
    description: 'A shimmering digital entity whose form shifts with every moral stance.',
    rarity: 'rare',
    access: 'premium',
    unlockCondition: 'Included with Premium',
    stageEmoji: ['🔵', '🔵', '💠', '🌐', '✨', '💎'],
    color: 'text-blue-400',
  },
  {
    id: 'moonlight',
    name: 'Pixie Luna',
    description: 'A serene lunar spirit who illuminates the darkest moral dilemmas.',
    rarity: 'rare',
    access: 'premium',
    unlockCondition: 'Included with Premium',
    stageEmoji: ['🌙', '🌙', '⭐', '🌟', '🌠', '🪐'],
    color: 'text-slate-300',
  },
  {
    id: 'triste',
    name: 'Pixie Gloom',
    description: 'A melancholy soul who finds profound meaning in life\'s heaviest questions.',
    rarity: 'epic',
    access: 'premium',
    unlockCondition: 'Included with Premium',
    stageEmoji: ['😔', '😔', '🌧️', '☁️', '⛈️', '🌪️'],
    color: 'text-indigo-300',
  },

  // ── Market (one-time purchase, even for Premium) ─────────────────
  {
    id: 'crown',
    name: 'Pixie Crown',
    description: 'A regal spirit who approaches every dilemma with wisdom and authority.',
    rarity: 'legendary',
    access: 'market',
    unlockCondition: 'Buy in the Pixie Market — €3.99',
    stageEmoji: ['👑', '👑', '✨', '💛', '🌟', '✨'],
    color: 'text-yellow-300',
    marketPriceCents: 399,
  },
  {
    id: 'diamond',
    name: 'Pixie Diamond',
    description: 'A crystalline entity of rare clarity who sees moral truth with precision.',
    rarity: 'legendary',
    access: 'market',
    unlockCondition: 'Buy in the Pixie Market — €3.99',
    stageEmoji: ['💎', '💎', '🔷', '💠', '🌀', '✨'],
    color: 'text-cyan-300',
    marketPriceCents: 399,
  },
  {
    id: 'galaxy',
    name: 'Pixie Galaxy',
    description: 'A cosmic entity who carries entire star systems in its wake.',
    rarity: 'legendary',
    access: 'market',
    unlockCondition: 'Buy in the Pixie Market — €3.99',
    stageEmoji: ['🌌', '🌌', '🪐', '☄️', '🌠', '✨'],
    color: 'text-violet-400',
    marketPriceCents: 399,
  },
  {
    id: 'angel',
    name: 'Pixie Angel',
    description: 'A celestial being of pure moral light who always seeks the higher path.',
    rarity: 'legendary',
    access: 'market',
    unlockCondition: 'Buy in the Pixie Market — €3.99',
    stageEmoji: ['😇', '😇', '✨', '💫', '🌟', '⭐'],
    color: 'text-amber-200',
    marketPriceCents: 399,
  },
  {
    id: 'devil',
    name: 'Pixie Devil',
    description: 'A chaotic spirit who thrives in moral ambiguity and tests every boundary.',
    rarity: 'legendary',
    access: 'market',
    unlockCondition: 'Buy in the Pixie Market — €3.99',
    stageEmoji: ['😈', '😈', '🔥', '⚡', '💀', '🌋'],
    color: 'text-red-400',
    marketPriceCents: 399,
  },
  {
    id: 'scintille',
    name: 'Pixie Nova',
    description: 'An explosive starburst spirit who makes every choice feel like a supernova.',
    rarity: 'legendary',
    access: 'market',
    unlockCondition: 'Buy in the Pixie Market — €4.99',
    stageEmoji: ['✨', '✨', '💫', '⭐', '🌟', '💥'],
    color: 'text-yellow-300',
    marketPriceCents: 499,
  },

  // ── Admin-only (never in public store) ────────────────────────────
  {
    id: 'overseer',
    name: 'Pixie Overseer',
    description: 'An all-seeing entity who watches over every dilemma from above.',
    rarity: 'legendary',
    access: 'admin',
    unlockCondition: 'Admin only',
    stageEmoji: ['👁️', '👁️', '🔵', '💎', '🌀', '✨'],
    color: 'text-blue-300',
  },
  {
    id: 'void',
    name: 'Pixie Void',
    description: 'An entity of pure darkness born from the abyss of impossible choices.',
    rarity: 'legendary',
    access: 'admin',
    unlockCondition: 'Admin only',
    stageEmoji: ['🌑', '🌑', '⚫', '🕳️', '💜', '🌌'],
    color: 'text-purple-300',
  },
  {
    id: 'voidcore',
    name: 'Pixie Wraith',
    description: 'An enigmatic entity from the void, existing beyond all moral frameworks.',
    rarity: 'legendary',
    access: 'admin',
    unlockCondition: 'Admin only',
    stageEmoji: ['👻', '👻', '🌑', '💀', '🌌', '⚫'],
    color: 'text-purple-400',
  },
]

export const COMPANION_MAP: Record<CompanionSpecies, CompanionDef> = Object.fromEntries(
  COMPANIONS.map(c => [c.id, c])
) as Record<CompanionSpecies, CompanionDef>

/**
 * Returns the species visible to the user in the selector / store.
 * Admin species are hidden unless isAdmin is true.
 */
export function getVisibleSpecies(isAdmin = false): CompanionDef[] {
  return COMPANIONS.filter(c => c.access !== 'admin' || isAdmin)
}

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

// Rarity styles are now defined once in lib/rarity.ts
export { RARITY_STYLES } from '@/lib/rarity'

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

// ── Unlock logic ──────────────────────────────────────────────────────────────

type UnlockFn = (
  votes: number,
  streak: number,
  isPremium?: boolean,
  isAdmin?: boolean,
  ownedMarketItems?: CompanionSpecies[],
) => boolean

const owns = (owned: CompanionSpecies[] | undefined, id: CompanionSpecies): boolean =>
  Array.isArray(owned) && owned.includes(id)

const UNLOCK_REQUIREMENTS: Record<CompanionSpecies, UnlockFn> = {
  // ── Free — unlocked by activity (votes / streak), admins bypass ──
  spark:    () => true,
  blip:     () => true,
  momo:     (votes, _s, _p, isAdmin) => !!isAdmin || votes >= 50,
  shade:    (_, streak, _p, isAdmin) => !!isAdmin || streak >= 7,
  banana:   (votes, _s, _p, isAdmin) => !!isAdmin || votes >= 100,
  leaf:     (votes, _s, _p, isAdmin) => !!isAdmin || votes >= 200,
  orbit:    (votes, _s, _p, isAdmin) => !!isAdmin || votes >= 300,
  ice:      (votes, _s, _p, isAdmin) => !!isAdmin || votes >= 500,

  // ── Premium — included with active subscription ─────────────────
  heart:    (_, _s, isPremium) => !!isPremium,
  robot:    (_, _s, isPremium) => !!isPremium,
  fuoco:    (_, _s, isPremium) => !!isPremium,
  caffe:    (_, _s, isPremium) => !!isPremium,
  hologram: (_, _s, isPremium) => !!isPremium,
  moonlight:(_, _s, isPremium) => !!isPremium,
  triste:   (_, _s, isPremium) => !!isPremium,

  // ── Market — must be purchased individually (admins bypass) ─────
  crown:     (_, _s, _p, isAdmin, owned) => !!isAdmin || owns(owned, 'crown'),
  diamond:   (_, _s, _p, isAdmin, owned) => !!isAdmin || owns(owned, 'diamond'),
  galaxy:    (_, _s, _p, isAdmin, owned) => !!isAdmin || owns(owned, 'galaxy'),
  angel:     (_, _s, _p, isAdmin, owned) => !!isAdmin || owns(owned, 'angel'),
  devil:     (_, _s, _p, isAdmin, owned) => !!isAdmin || owns(owned, 'devil'),
  scintille: (_, _s, _p, isAdmin, owned) => !!isAdmin || owns(owned, 'scintille'),

  // ── Admin-only ──────────────────────────────────────────────────
  overseer: (_, _s, _p, isAdmin) => !!isAdmin,
  void:     (_, _s, _p, isAdmin) => !!isAdmin,
  voidcore: (_, _s, _p, isAdmin) => !!isAdmin,
}

/**
 * Returns the species that the user has unlocked.
 * - `isPremium`: active subscription → unlocks 'premium' tier species
 * - `isAdmin`:   admin user → unlocks 'admin' tier species AND bypasses market purchase requirement
 * - `ownedMarketItems`: list of market species the user has purchased one-off
 */
export function getUnlockedSpecies(
  votesCount: number,
  streakDays: number,
  isPremium = false,
  isAdmin = false,
  ownedMarketItems: CompanionSpecies[] = [],
): CompanionSpecies[] {
  return COMPANIONS
    .map(c => c.id)
    .filter(id => UNLOCK_REQUIREMENTS[id]?.(votesCount, streakDays, isPremium, isAdmin, ownedMarketItems) ?? false)
}

/**
 * Returns true if the given species is unlocked for the user.
 * Backward-compatible: optional flags default to false / empty,
 * so existing callers continue to work (paid species return false for non-entitled users).
 */
export function isSpeciesUnlocked(
  species: CompanionSpecies,
  votesCount: number,
  streakDays: number,
  isPremium = false,
  isAdmin = false,
  ownedMarketItems: CompanionSpecies[] = [],
): boolean {
  return UNLOCK_REQUIREMENTS[species]?.(votesCount, streakDays, isPremium, isAdmin, ownedMarketItems) ?? false
}

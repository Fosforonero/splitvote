import { getCompanionStage, getSpeciesVotes, type CompanionSpecies, type PixieXpMap } from './companion'

/** Returns the public URL for a Pixie stage image.
 *  Expected files: public/pixie/{species}/pixie-{species}-stage-{1-6}.png
 *  Falls back to emoji in CompanionDisplay if the file is missing (onError handler). */
export function getPixieImagePath(species: string, stage: number): string {
  return `/pixie/${species}/pixie-${species}-stage-${stage}.png`
}

/**
 * Resolves the Pixie sprite URL for a profile row, or null when the user
 * hasn't opted into Pixie avatar (use_pixie_avatar is false/null).
 *
 * Encapsulates the species + stage computation duplicated across dashboard,
 * /u/[id], and leaderboard surfaces. Stage is derived from species-specific
 * vote count when pixie_xp is populated, falling back to the global
 * votes_count for legacy profiles with no pixie_xp.
 *
 * Pass `ignoreToggle: true` to bypass the `use_pixie_avatar` gate. The
 * dashboard uses this — it's the user's own private view, so the Pixie
 * sprite always shows regardless of whether they want it as their PUBLIC
 * avatar on /u/[id] and leaderboards.
 */
export function getProfilePixieSrc(
  profile: {
    companion_species?: string | null
    use_pixie_avatar?: boolean | null
    pixie_xp?: Record<string, unknown> | null
    votes_count?: number | null
  } | null | undefined,
  options: { ignoreToggle?: boolean } = {},
): string | null {
  if (!profile) return null
  if (!options.ignoreToggle && !profile.use_pixie_avatar) return null

  const species = getEffectiveSpecies(profile)
  const pixieXp = profile.pixie_xp ?? {}
  const hasPixieXp = Object.keys(pixieXp).length > 0
  const speciesVotes = hasPixieXp
    ? getSpeciesVotes(pixieXp as PixieXpMap, species)
    : 0
  const effectiveVotes = hasPixieXp ? speciesVotes : (profile.votes_count ?? 0)
  const stage = getCompanionStage(effectiveVotes)
  return getPixieImagePath(species, stage)
}

/**
 * Resolve the species the user is "actively" inhabiting. When the user
 * has equipped a purchasable Pixie skin (pixie_xp.active = 'pixie_devil'),
 * the species is derived from the skin id (devil). Otherwise we fall back
 * to the permanent companion_species set during onboarding, or finally to
 * 'spark' (the default starter).
 *
 * Exported so dashboard surfaces (CompanionDisplay, picker preview) can
 * agree on the same species without re-implementing the precedence rule.
 */
export function getEffectiveSpecies(profile: {
  companion_species?: string | null
  pixie_xp?: Record<string, unknown> | null
} | null | undefined): CompanionSpecies {
  if (!profile) return 'spark'
  const active = typeof profile.pixie_xp?.active === 'string' ? profile.pixie_xp.active : null
  if (active?.startsWith('pixie_')) {
    return active.slice('pixie_'.length) as CompanionSpecies
  }
  return (profile.companion_species as CompanionSpecies | null) ?? 'spark'
}

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
 */
export function getProfilePixieSrc(profile: {
  companion_species?: string | null
  use_pixie_avatar?: boolean | null
  pixie_xp?: Record<string, unknown> | null
  votes_count?: number | null
} | null | undefined): string | null {
  if (!profile?.use_pixie_avatar) return null

  const species = (profile.companion_species as CompanionSpecies | null) ?? 'spark'
  const pixieXp = profile.pixie_xp ?? {}
  const hasPixieXp = Object.keys(pixieXp).length > 0
  const speciesVotes = hasPixieXp
    ? getSpeciesVotes(pixieXp as PixieXpMap, species)
    : 0
  const effectiveVotes = hasPixieXp ? speciesVotes : (profile.votes_count ?? 0)
  const stage = getCompanionStage(effectiveVotes)
  return getPixieImagePath(species, stage)
}

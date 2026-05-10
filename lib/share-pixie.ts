export type ShareResult = 'shared' | 'copied' | 'error'

interface SharePixieOptions {
  species: string
  speciesName: string
  stage: number
  stageLabel: string
  profileUrl: string
  locale: string
}

export async function sharePixieLevelUp(opts: SharePixieOptions): Promise<ShareResult> {
  const { species, speciesName, stage, stageLabel, locale, profileUrl } = opts

  const text =
    locale === 'it'
      ? `Il mio ${speciesName} ha raggiunto lo Stadio ${stage} — ${stageLabel} su SplitVote! 🎉`
      : `My ${speciesName} just reached Stage ${stage} — ${stageLabel} on SplitVote! 🎉`

  const title =
    locale === 'it'
      ? `${speciesName} è salito al livello ${stage}!`
      : `${speciesName} leveled up to Stage ${stage}!`

  // Build the pixie-card image URL for platforms that accept it via navigator.share files
  // (Most mobile browsers only support text + url — image sharing skipped for compatibility)
  void species // available for future file-based sharing

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, text, url: profileUrl })
      return 'shared'
    } catch {
      // User cancelled or browser denied — fall through to clipboard
    }
  }

  try {
    await navigator.clipboard.writeText(`${text}\n${profileUrl}`)
    return 'copied'
  } catch {
    return 'error'
  }
}

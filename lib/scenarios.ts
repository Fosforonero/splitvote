export type Category =
  | 'morality'
  | 'survival'
  | 'loyalty'
  | 'justice'
  | 'freedom'
  | 'technology'
  | 'society'
  | 'relationships'
  | 'lifestyle'

export interface Scenario {
  id: string
  question: string
  optionA: string
  optionB: string
  emoji: string
  category: Category
}

export const scenarios: Scenario[] = [
  // ── MORALITY ──────────────────────────────────────────────────
  {
    id: 'trolley',
    question: 'A runaway trolley is heading toward 5 people. You can pull a lever to divert it — but it will kill 1 person instead.',
    optionA: 'Pull the lever. Save 5, sacrifice 1.',
    optionB: 'Do nothing. Let fate decide.',
    emoji: '🚋',
    category: 'morality',
  },
  {
    id: 'cure-secret',
    question: "You discover a cure for cancer, but it only works if you keep the formula secret — sharing it would destroy the compound's effectiveness forever.",
    optionA: 'Keep it secret. Save millions quietly.',
    optionB: 'Share it. Science belongs to everyone.',
    emoji: '💊',
    category: 'morality',
  },
  {
    id: 'memory-erase',
    question: "A pill erases all your painful memories — but also the lessons you learned from them. You become happier but more naive.",
    optionA: 'Take the pill. Happiness matters.',
    optionB: 'Refuse. Pain made you who you are.',
    emoji: '🧠',
    category: 'morality',
  },
  {
    id: 'steal-medicine',
    question: "Your child is dying and needs medicine you cannot afford. You could steal it. The store owner is not evil — just running a business.",
    optionA: 'Steal it. Your child comes first.',
    optionB: "Don't steal. Find another way.",
    emoji: '💉',
    category: 'morality',
  },
  {
    id: 'organ-harvest',
    question: "You are a doctor. One healthy patient's organs could save the lives of 5 people dying in the next room. No one would ever know.",
    optionA: 'Harvest the organs. 5 lives > 1.',
    optionB: 'Never. You cannot kill an innocent patient.',
    emoji: '🫀',
    category: 'morality',
  },
  {
    id: 'mercy-kill',
    question: "Your terminally ill parent is in unbearable pain and begs you to end their suffering. The doctors say weeks remain. No one will find out.",
    optionA: 'Honor their wish. End the suffering.',
    optionB: 'Refuse. It is not your decision to make.',
    emoji: '🕊️',
    category: 'morality',
  },
  {
    id: 'whistleblower',
    question: "You discover your company is illegally polluting a river. Reporting it will shut down the plant — destroying 1,000 jobs in a poor community.",
    optionA: 'Report it. The environment comes first.',
    optionB: "Stay silent. 1,000 families can't lose their income.",
    emoji: '🏭',
    category: 'morality',
  },
  {
    id: 'confess-crime',
    question: "You committed a minor crime 20 years ago. No one was hurt and no one knows. Coming forward would destroy your career and family.",
    optionA: 'Confess. You must live with integrity.',
    optionB: 'Stay silent. The past is the past.',
    emoji: '⚖️',
    category: 'morality',
  },

  // ── SURVIVAL ──────────────────────────────────────────────────
  {
    id: 'lifeboat',
    question: 'A lifeboat holds 8 people maximum. There are 9 survivors. Someone must go overboard or everyone drowns.',
    optionA: 'Vote to push someone off.',
    optionB: 'Refuse. Sink or swim together.',
    emoji: '🚤',
    category: 'survival',
  },
  {
    id: 'time-machine',
    question: "You can go back in time and kill one person as a baby — preventing a genocide that kills 10 million people. The baby is innocent.",
    optionA: 'Do it. 10 million lives matter more.',
    optionB: 'Refuse. You cannot kill an innocent child.',
    emoji: '⏳',
    category: 'survival',
  },
  {
    id: 'plane-parachute',
    question: "A plane is going down. There are 6 survivors but only 4 parachutes. You have one. Do you give yours up or keep it?",
    optionA: 'Keep the parachute. Survival instinct.',
    optionB: 'Give it to someone else. Their life first.',
    emoji: '✈️',
    category: 'survival',
  },
  {
    id: 'zombie-apocalypse',
    question: "In a zombie apocalypse, your group finds a fortified shelter with supplies for 10. There are 15 of you. You hold the only key.",
    optionA: 'Let everyone in. Find a way together.',
    optionB: 'Only let 10 in. Ensure the group survives.',
    emoji: '🧟',
    category: 'survival',
  },
  {
    id: 'pandemic-dose',
    question: "A new pandemic: there is only one vaccine dose left in the city. You and an elderly stranger both need it to survive. A doctor hands it to you.",
    optionA: 'Take it. You deserve to survive.',
    optionB: 'Give it to the elderly stranger.',
    emoji: '🦠',
    category: 'survival',
  },

  // ── LOYALTY ───────────────────────────────────────────────────
  {
    id: 'truth-friend',
    question: "Your best friend asks if you like their new partner. You think the partner is terrible for them.",
    optionA: 'Be brutally honest.',
    optionB: 'Keep the peace. Stay silent.',
    emoji: '🤫',
    category: 'loyalty',
  },
  {
    id: 'report-friend',
    question: "You discover your closest friend committed a serious financial crime — embezzling from a charity. Do you turn them in?",
    optionA: 'Report them. No one is above the law.',
    optionB: 'Stay loyal. Talk to them first, privately.',
    emoji: '👮',
    category: 'loyalty',
  },
  {
    id: 'cover-accident',
    question: "Your partner accidentally ran a red light and killed a pedestrian. They panic and beg you to drive away. No cameras saw you.",
    optionA: 'Drive away. Protect the person you love.',
    optionB: 'Stop and call the police. The victim matters.',
    emoji: '🚗',
    category: 'loyalty',
  },
  {
    id: 'sibling-secret',
    question: "Your sibling confides they've been cheating on their spouse for 2 years. The spouse is also your close friend.",
    optionA: 'Tell the spouse. They deserve the truth.',
    optionB: 'Stay out of it. Not your relationship.',
    emoji: '💬',
    category: 'loyalty',
  },

  // ── JUSTICE ───────────────────────────────────────────────────
  {
    id: 'rich-or-fair',
    question: "You can press a button: everyone on Earth becomes equally poor, or the world stays as-is with extreme inequality.",
    optionA: 'Press it. Equal poverty is fairer.',
    optionB: "Don't press. Keep the current world.",
    emoji: '💰',
    category: 'justice',
  },
  {
    id: 'robot-judge',
    question: "AI is proven to be 30% more accurate than human judges. Would you replace human judges with AI in criminal trials?",
    optionA: 'Yes. Better accuracy saves lives.',
    optionB: 'No. Justice needs a human touch.',
    emoji: '🤖',
    category: 'justice',
  },
  {
    id: 'innocent-juror',
    question: "You are a juror. Every piece of evidence says guilty — but your gut tells you the defendant is innocent. The jury must be unanimous.",
    optionA: 'Vote guilty. Follow the evidence.',
    optionB: 'Vote not guilty. Trust your instinct.',
    emoji: '👨‍⚖️',
    category: 'justice',
  },
  {
    id: 'death-row-exonerated',
    question: "DNA evidence exonerates an innocent person after 25 years on death row. The real killer is 85, frail, and dying. Do they go to prison?",
    optionA: 'Yes. Justice must be served regardless.',
    optionB: 'No. Imprisoning a dying person solves nothing.',
    emoji: '🔓',
    category: 'justice',
  },
  {
    id: 'revenge-vs-forgiveness',
    question: "Someone who destroyed your life 10 years ago is now a changed, successful person helping their community. They never apologized.",
    optionA: 'Expose them. The world should know who they were.',
    optionB: 'Let it go. People can change.',
    emoji: '🕊️',
    category: 'justice',
  },

  // ── FREEDOM ───────────────────────────────────────────────────
  {
    id: 'privacy-terror',
    question: "Governments can prevent terrorist attacks by reading everyone's private messages — but there will be zero privacy. No exceptions.",
    optionA: 'Allow it. Safety first.',
    optionB: 'Refuse. Privacy is non-negotiable.',
    emoji: '🔒',
    category: 'freedom',
  },
  {
    id: 'censor-speech',
    question: "A politician's lies directly caused 500 deaths by inciting violence. Do you support permanently banning them from all social platforms?",
    optionA: 'Yes. Dangerous speech has consequences.',
    optionB: 'No. Free speech is absolute.',
    emoji: '📢',
    category: 'freedom',
  },
  {
    id: 'mandatory-vaccine',
    question: "Vaccines are 99% effective and safe. Should they be legally mandatory for school attendance, even for parents with religious objections?",
    optionA: 'Yes. Public health protects everyone.',
    optionB: 'No. Bodily autonomy cannot be forced.',
    emoji: '💉',
    category: 'freedom',
  },
  {
    id: 'surveillance-city',
    question: "A city offers to eliminate all violent crime by installing 24/7 AI surveillance on every street corner and public space.",
    optionA: 'Yes. Safety is worth it.',
    optionB: 'No. I will not live in a surveillance state.',
    emoji: '📹',
    category: 'freedom',
  },

  // ── TECHNOLOGY ────────────────────────────────────────────────
  {
    id: 'ai-art-copyright',
    question: "An AI generates a masterpiece painting with no human creative input. Who owns the copyright?",
    optionA: "The AI's creator company.",
    optionB: 'No one — it should be public domain.',
    emoji: '🎨',
    category: 'technology',
  },
  {
    id: 'self-driving-crash',
    question: "A self-driving car's brakes fail. It must choose: swerve into a barrier (killing the passenger) or hit a pedestrian who jaywalked.",
    optionA: 'Hit the barrier. Protect the pedestrian.',
    optionB: 'Protect the passenger. They paid for safety.',
    emoji: '🚘',
    category: 'technology',
  },
  {
    id: 'brain-upload',
    question: "Scientists can upload your consciousness to a computer perfectly. Your biological body must die in the process. Is the digital version still you?",
    optionA: 'Yes — do it. Immortality is worth it.',
    optionB: 'No. Death is part of being human.',
    emoji: '🧬',
    category: 'technology',
  },
  {
    id: 'delete-social-media',
    question: "You can permanently delete all social media from existence. The world becomes slower and less connected, but global mental health improves 40%.",
    optionA: 'Delete it. Mental health comes first.',
    optionB: "Don't. Connection and freedom of expression matter.",
    emoji: '📱',
    category: 'technology',
  },
  {
    id: 'ai-replaces-jobs',
    question: "AI will eliminate 30% of all jobs in 10 years. Governments can slow it down at massive economic cost, or let it happen and retrain workers.",
    optionA: 'Slow it down. People need time to adapt.',
    optionB: 'Let progress happen. Retraining is the answer.',
    emoji: '⚙️',
    category: 'technology',
  },
  {
    id: 'deepfake-expose',
    question: "You have a deepfake video that looks 100% real, showing a corrupt politician committing a crime. The politician is genuinely corrupt but this event never happened.",
    optionA: 'Release it. He deserves to fall.',
    optionB: 'Destroy it. A lie is still a lie.',
    emoji: '🎬',
    category: 'technology',
  },

  // ── SOCIETY ───────────────────────────────────────────────────
  {
    id: 'tax-billionaires',
    question: "A 90% one-time wealth tax on billionaires could end world hunger for 10 years. Billionaires would still be comfortably rich.",
    optionA: 'Yes. No one needs a billion dollars.',
    optionB: 'No. Forced redistribution is wrong.',
    emoji: '💸',
    category: 'society',
  },
  {
    id: 'open-borders',
    question: "Completely open borders between all countries — anyone can live and work anywhere without restrictions.",
    optionA: 'Yes. Freedom of movement is a human right.',
    optionB: 'No. Nations need borders to function.',
    emoji: '🌍',
    category: 'society',
  },
  {
    id: 'universal-basic-income',
    question: "Every adult receives €1,500/month from the government. Taxes for the top 20% double. Do you support it?",
    optionA: 'Yes. No one should live in poverty.',
    optionB: 'No. It kills the incentive to work.',
    emoji: '🏦',
    category: 'society',
  },
  {
    id: 'drug-legalization',
    question: "All drugs are legalized, taxed, and regulated — removing the black market entirely. Portugal's model shows crime drops 50%. Do you support it?",
    optionA: 'Yes. Prohibition has failed. Regulate instead.',
    optionB: 'No. Some substances should never be legal.',
    emoji: '💊',
    category: 'society',
  },
  {
    id: 'prison-abolition',
    question: "All prisons are replaced with rehabilitation centers — therapy, education, no punishment. Studies show recidivism drops 60%.",
    optionA: 'Yes. Rehabilitation is more effective.',
    optionB: 'No. Some crimes deserve punishment.',
    emoji: '🏛️',
    category: 'society',
  },

  // ── RELATIONSHIPS ─────────────────────────────────────────────
  {
    id: 'love-or-career',
    question: "Your dream job offer arrives — but it requires moving to another continent. Your partner of 5 years refuses to relocate.",
    optionA: 'Take the job. Your career is your future.',
    optionB: 'Decline. Love is worth more than ambition.',
    emoji: '💼',
    category: 'relationships',
  },
  {
    id: 'old-secret-affair',
    question: "Your partner asks if you've ever been unfaithful. You had a one-night stand 12 years ago, before you were serious. They will never find out otherwise.",
    optionA: 'Tell the truth. Honesty above all.',
    optionB: "Stay silent. It's ancient history.",
    emoji: '💔',
    category: 'relationships',
  },
  {
    id: 'forgive-cheater',
    question: "Your partner of 15 years admits to a one-time affair 3 years ago. They have been completely faithful since. They are genuinely remorseful.",
    optionA: 'Stay. People make mistakes.',
    optionB: 'Leave. Trust is gone forever.',
    emoji: '💑',
    category: 'relationships',
  },
  {
    id: 'save-partner-vs-stranger',
    question: "A burning building: you can only save one person — your partner, or a 5-year-old child you've never met.",
    optionA: 'Save your partner.',
    optionB: 'Save the child.',
    emoji: '🔥',
    category: 'relationships',
  },
]

export const CATEGORIES: { value: Category | 'all'; label: string; emoji: string }[] = [
  { value: 'all', label: 'All', emoji: '🌐' },
  { value: 'morality', label: 'Morality', emoji: '🧭' },
  { value: 'survival', label: 'Survival', emoji: '⚡' },
  { value: 'loyalty', label: 'Loyalty', emoji: '🤝' },
  { value: 'justice', label: 'Justice', emoji: '⚖️' },
  { value: 'freedom', label: 'Freedom', emoji: '🗽' },
  { value: 'technology', label: 'Technology', emoji: '🤖' },
  { value: 'society', label: 'Society', emoji: '🌍' },
  { value: 'relationships', label: 'Love', emoji: '❤️' },
  { value: 'lifestyle', label: 'Lifestyle', emoji: '🎭' },
]

export function getScenario(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id)
}

export function getRandomScenario(excludeId?: string): Scenario {
  const pool = excludeId ? scenarios.filter((s) => s.id !== excludeId) : scenarios
  return pool[Math.floor(Math.random() * pool.length)]
}

export function getScenariosByCategory(category: Category | 'all'): Scenario[] {
  if (category === 'all') return scenarios
  return scenarios.filter((s) => s.category === category)
}

interface ScoredItem { id: string; scores?: { finalScore?: number }; category?: string }

/**
 * Pick the next scenario ID, preferring dynamic approved scenarios over static ones.
 * From the dynamic pool, picks randomly from the top-half by finalScore for quality.
 * Falls back to static random if no dynamic pool provided or all excluded.
 */
export function getNextScenarioId(excludeId: string, dynamicPool?: ScoredItem[]): string {
  if (dynamicPool?.length) {
    const filtered = dynamicPool.filter((s) => s.id !== excludeId)
    if (filtered.length) {
      const sorted = [...filtered].sort((a, b) => (b.scores?.finalScore ?? 0) - (a.scores?.finalScore ?? 0))
      const topHalf = sorted.slice(0, Math.max(1, Math.ceil(sorted.length / 2)))
      return topHalf[Math.floor(Math.random() * topHalf.length)].id
    }
  }
  return getRandomScenario(excludeId).id
}

/**
 * Pick the next unvoted scenario ID.
 * Excludes currentId AND all ids in votedIds, preferring dynamic top-half by score.
 * Returns null only if every available scenario has been voted on (triggers "Browse all" fallback).
 */
export function getFreshNextScenarioId(
  currentId: string,
  votedIds: Set<string>,
  dynamicPool?: ScoredItem[],
): string | null {
  const excluded = new Set([currentId, ...votedIds])

  if (dynamicPool?.length) {
    const fresh = dynamicPool.filter(s => !excluded.has(s.id))
    if (fresh.length) {
      const sorted = [...fresh].sort((a, b) => (b.scores?.finalScore ?? 0) - (a.scores?.finalScore ?? 0))
      const topHalf = sorted.slice(0, Math.max(1, Math.ceil(sorted.length / 2)))
      return topHalf[Math.floor(Math.random() * topHalf.length)].id
    }
  }

  const freshStatic = scenarios.filter(s => !excluded.has(s.id))
  if (freshStatic.length) {
    return freshStatic[Math.floor(Math.random() * freshStatic.length)].id
  }

  return null
}

/**
 * Pick the next unvoted scenario ID within a specific category.
 * Excludes currentId AND all ids in votedIds.
 * Prefers dynamic approved scenarios of that category by top-half finalScore.
 * Falls back to static scenarios of that category.
 * Returns null if no fresh dilemmas are available in the category.
 */
export function getFreshNextScenarioIdByCategory(
  category: Category,
  currentId: string | undefined,
  votedIds: Set<string>,
  dynamicPool?: ScoredItem[],
): string | null {
  const excluded = new Set<string>([...(currentId ? [currentId] : []), ...votedIds])

  if (dynamicPool?.length) {
    const fresh = dynamicPool.filter(s => s.category === category && !excluded.has(s.id))
    if (fresh.length) {
      const sorted = [...fresh].sort((a, b) => (b.scores?.finalScore ?? 0) - (a.scores?.finalScore ?? 0))
      const topHalf = sorted.slice(0, Math.max(1, Math.ceil(sorted.length / 2)))
      return topHalf[Math.floor(Math.random() * topHalf.length)].id
    }
  }

  const freshStatic = scenarios.filter(s => s.category === category && !excluded.has(s.id))
  if (freshStatic.length) {
    return freshStatic[Math.floor(Math.random() * freshStatic.length)].id
  }

  return null
}

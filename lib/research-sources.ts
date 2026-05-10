import 'server-only'

// ─── Cluster taxonomy ─────────────────────────────────────────────────────────
// String literals used to group sources by moral/philosophical domain.
// Extend when a new topic cluster is added to lib/seo-topics.ts or lib/blog.ts.
export type MoralCluster =
  | 'trolley-problem'
  | 'harm-prevention'
  | 'ai-ethics'
  | 'privacy'
  | 'loyalty-honesty'
  | 'moral-foundations'
  | 'consequentialism'
  | 'deontology'
  | 'virtue-ethics'
  | 'experimental-moral-psychology'
  | 'bioethics'

export type SourceType = 'encyclopedia' | 'empirical-study' | 'website' | 'book'

// Local union — intentionally NOT imported from lib/personality.ts to avoid coupling.
// Must stay in sync with MORAL_AXES ids in lib/personality.ts.
export type MoralAxisId = 'utility' | 'freedom' | 'loyalty' | 'risk' | 'individual'

// ─── Core type ────────────────────────────────────────────────────────────────

export interface ResearchSource {
  id: string
  title: string
  authors?: string[]
  institution: string
  url: string
  type: SourceType
  /** true = freely accessible without paywall */
  openAccess: boolean
  clusters: MoralCluster[]
  moralAxes: MoralAxisId[]
  /**
   * Safe, third-person attribution phrasing for use in public content.
   * Always write as "Researchers find…" or "Philosophers argue…" — never "Science shows…".
   */
  safeClaim: string
  /** Specific phrasings that would misrepresent this source or imply SplitVote endorsement. */
  claimsToAvoid: string[]
  /**
   * 'paraphrase-only' = attribution required; do not lift text verbatim.
   * 'direct-quote-permitted' = short quotation with attribution is acceptable.
   */
  citationStyle: 'paraphrase-only' | 'direct-quote-permitted'
  /**
   * If true, any public-facing use must pair with the standard SplitVote disclaimer:
   * "SplitVote is for entertainment and aggregate insight, not a scientific test."
   */
  requiresDisclaimer: boolean
  /**
   * Indicative list of existing surfaces where this source is relevant.
   * Format: route paths ('/trolley-problem'), blog slugs ('blog:what-is-splitvote'),
   * or scenario IDs ('scenario:trolley'). Not enforced — treat as editorial guidance.
   */
  contentOpportunities: string[]
  /** ISO date YYYY-MM-DD */
  addedAt: string
  addedBy?: string
  reviewedAt?: string
  notes?: string
}

// ─── Registry ─────────────────────────────────────────────────────────────────
// Parallel to the inline researchSources on SeoTopic in lib/seo-topics.ts.
// seo-topics.ts carries a minimal { title, institution, url } subset for rendering.
// This registry is the canonical, richer source — do not refactor seo-topics.ts
// to reference IDs here until a Content Intelligence sprint actually needs it.

export const RESEARCH_SOURCES: ResearchSource[] = [
  {
    id: 'sep-moral-dilemmas',
    title: 'Moral Dilemmas',
    institution: 'Stanford Encyclopedia of Philosophy',
    url: 'https://plato.stanford.edu/entries/moral-dilemmas/',
    type: 'encyclopedia',
    openAccess: true,
    clusters: ['trolley-problem', 'harm-prevention', 'deontology', 'loyalty-honesty'],
    moralAxes: ['utility', 'loyalty'],
    safeClaim:
      'Philosophers use the concept of moral dilemmas to explore situations where every available choice involves some moral cost.',
    claimsToAvoid: [
      "SplitVote's dilemmas are validated by the Stanford Encyclopedia of Philosophy",
      'Moral dilemmas prove that X is right or wrong',
    ],
    citationStyle: 'paraphrase-only',
    requiresDisclaimer: false,
    contentOpportunities: [
      '/trolley-problem',
      '/loyalty-vs-honesty',
      'blog:what-is-splitvote',
      'scenario:trolley',
      'scenario:organ-harvest',
    ],
    addedAt: '2026-05-04',
    addedBy: 'research-planning',
  },
  {
    id: 'sep-doing-allowing',
    title: 'Doing vs. Allowing Harm',
    institution: 'Stanford Encyclopedia of Philosophy',
    url: 'https://plato.stanford.edu/entries/doing-allowing/',
    type: 'encyclopedia',
    openAccess: true,
    clusters: ['trolley-problem', 'harm-prevention'],
    moralAxes: ['utility'],
    safeClaim:
      'Philosophers debate whether causing harm directly is morally worse than allowing equivalent harm to happen — a distinction that shapes how we think about action and inaction.',
    claimsToAvoid: [
      'It is always worse to cause harm than to allow it',
      "SplitVote proves the doing/allowing distinction",
    ],
    citationStyle: 'paraphrase-only',
    requiresDisclaimer: false,
    contentOpportunities: [
      '/trolley-problem',
      'blog:what-is-splitvote',
      'scenario:trolley',
    ],
    addedAt: '2026-05-04',
    addedBy: 'research-planning',
  },
  {
    id: 'moral-foundations-theory',
    title: 'Moral Foundations Theory',
    institution: 'moralfoundations.org',
    url: 'https://moralfoundations.org/',
    type: 'website',
    openAccess: true,
    clusters: ['moral-foundations', 'loyalty-honesty'],
    moralAxes: ['loyalty', 'individual'],
    safeClaim:
      'Moral Foundations Theory proposes that human moral reasoning draws on multiple distinct intuitive concerns — including care, fairness, loyalty, authority, and purity — that may vary across cultures and individuals.',
    claimsToAvoid: [
      "SplitVote's personality system is based on Moral Foundations Theory",
      'MFT is established consensus science',
      "SplitVote's axes are the same as MFT foundations",
      'SplitVote implements or replicates Moral Foundations Theory',
    ],
    citationStyle: 'paraphrase-only',
    requiresDisclaimer: true,
    contentOpportunities: [
      '/loyalty-vs-honesty',
      '/personality',
      'blog:what-your-moral-personality-means',
    ],
    addedAt: '2026-05-04',
    addedBy: 'research-planning',
    notes:
      'moralfoundations.org has had intermittent availability — verify the URL resolves before using in a published page. SplitVote axes are inspired by, not a replica of, MFT. requiresDisclaimer must be observed in all public use.',
  },
  {
    id: 'moral-machine-nature-2018',
    title: 'The Moral Machine experiment',
    authors: [
      'Edmond Awad',
      'Sohan Dsouza',
      'Richard Kim',
      'Jonathan Schulz',
      'Joseph Henrich',
      'Azim Shariff',
      'Jean-François Bonnefon',
      'Iyad Rahwan',
    ],
    institution: 'MIT Media Lab / Nature',
    url: 'https://www.nature.com/articles/s41586-018-0637-6',
    type: 'empirical-study',
    openAccess: false,
    clusters: ['ai-ethics'],
    moralAxes: ['utility', 'individual'],
    safeClaim:
      'A 2018 study published in Nature collected over 40 million moral decisions from people in 233 countries on autonomous vehicle crash scenarios, revealing significant cross-cultural variation in moral preferences.',
    claimsToAvoid: [
      'The Moral Machine proves that people universally prefer X',
      'SplitVote replicates the Moral Machine experiment',
      'MIT endorses SplitVote',
    ],
    citationStyle: 'paraphrase-only',
    requiresDisclaimer: false,
    contentOpportunities: [
      '/ai-ethics-dilemmas',
      'blog:how-to-read-splitvote-results',
      'scenario:self-driving-crash',
    ],
    addedAt: '2026-05-04',
    addedBy: 'research-planning',
  },
  {
    id: 'sep-privacy',
    title: 'Privacy',
    institution: 'Stanford Encyclopedia of Philosophy',
    url: 'https://plato.stanford.edu/entries/privacy/',
    type: 'encyclopedia',
    openAccess: true,
    clusters: ['privacy', 'ai-ethics'],
    moralAxes: ['freedom', 'individual'],
    safeClaim:
      'Philosophers identify privacy as a fundamental value that can come into tension with transparency, security, and collective welfare — making it a live ethical concern in technology and public policy.',
    claimsToAvoid: [
      'Privacy always trumps security',
      "SplitVote's anonymous voting is validated by the SEP privacy entry",
    ],
    citationStyle: 'paraphrase-only',
    requiresDisclaimer: false,
    contentOpportunities: [
      '/ai-ethics-dilemmas',
      'blog:how-anonymous-voting-works',
    ],
    addedAt: '2026-05-04',
    addedBy: 'research-planning',
  },
  {
    id: 'greene-moral-cognition',
    title: 'Moral Cognition Research',
    authors: ['Joshua Greene'],
    institution: 'Harvard University',
    url: 'https://www.joshua-greene.net/research/moral-cognition',
    type: 'website',
    openAccess: true,
    clusters: ['experimental-moral-psychology', 'trolley-problem'],
    moralAxes: ['utility', 'freedom'],
    safeClaim:
      "Moral cognition researchers have found that people's responses to moral dilemmas are shaped by both fast emotional reactions and slower deliberative reasoning — and that these can conflict.",
    claimsToAvoid: [
      'Harvard endorses SplitVote',
      'SplitVote measures dual-process moral cognition',
      "Greene's research validates the SplitVote personality system",
    ],
    citationStyle: 'paraphrase-only',
    requiresDisclaimer: true,
    contentOpportunities: [
      '/personality',
      'blog:what-your-moral-personality-means',
    ],
    addedAt: '2026-05-04',
    addedBy: 'research-planning',
    notes:
      'Personal faculty page at joshua-greene.net — may move if institutional affiliation changes. Prefer citing specific published papers (e.g. Greene et al. 2001, Science 293:2105) in any public-facing content. requiresDisclaimer: dual-process theory is frequently misrepresented in pop-psychology contexts.',
  },
  {
    id: 'sep-consequentialism',
    title: 'Consequentialism',
    institution: 'Stanford Encyclopedia of Philosophy',
    url: 'https://plato.stanford.edu/entries/consequentialism/',
    type: 'encyclopedia',
    openAccess: true,
    clusters: ['consequentialism', 'trolley-problem'],
    moralAxes: ['utility'],
    safeClaim:
      'Consequentialist ethical theories hold that the moral worth of an action is determined solely by its outcomes — the action that produces the best results is the right one.',
    claimsToAvoid: [
      'Consequentialism is the correct moral theory',
      'SplitVote users who pull the lever are consequentialists',
    ],
    citationStyle: 'paraphrase-only',
    requiresDisclaimer: false,
    contentOpportunities: [
      '/trolley-problem',
      'blog:what-is-splitvote',
      'scenario:trolley',
    ],
    addedAt: '2026-05-04',
    addedBy: 'research-planning',
  },
  {
    id: 'sep-deontological-ethics',
    title: 'Deontological Ethics',
    institution: 'Stanford Encyclopedia of Philosophy',
    url: 'https://plato.stanford.edu/entries/ethics-deontological/',
    type: 'encyclopedia',
    openAccess: true,
    clusters: ['deontology', 'trolley-problem', 'harm-prevention'],
    moralAxes: ['utility', 'loyalty'],
    safeClaim:
      'Deontological ethics holds that certain actions are inherently right or wrong regardless of their consequences — moral rules and duties constrain what we may do even to achieve good outcomes.',
    claimsToAvoid: [
      'Deontology is the correct moral theory',
      'SplitVote users who do nothing are deontologists',
    ],
    citationStyle: 'paraphrase-only',
    requiresDisclaimer: false,
    contentOpportunities: [
      '/trolley-problem',
      'blog:what-is-splitvote',
      'scenario:trolley',
      'scenario:organ-harvest',
    ],
    addedAt: '2026-05-04',
    addedBy: 'research-planning',
  },
  {
    id: 'sep-experimental-moral-philosophy',
    title: 'Experimental Moral Philosophy',
    institution: 'Stanford Encyclopedia of Philosophy',
    url: 'https://plato.stanford.edu/entries/experimental-moral/',
    type: 'encyclopedia',
    openAccess: true,
    clusters: ['experimental-moral-psychology'],
    moralAxes: ['utility', 'freedom', 'loyalty', 'risk', 'individual'],
    safeClaim:
      'Experimental moral philosophy studies how ordinary people actually reason about ethical questions, using empirical methods from psychology and cognitive science alongside traditional philosophical analysis.',
    claimsToAvoid: [
      'SplitVote is an experimental moral philosophy study',
      'SplitVote results are scientifically valid data',
    ],
    citationStyle: 'paraphrase-only',
    requiresDisclaimer: false,
    contentOpportunities: [
      '/personality',
      'blog:what-your-moral-personality-means',
    ],
    addedAt: '2026-05-04',
    addedBy: 'research-planning',
  },
  {
    id: 'sep-virtue-ethics',
    title: 'Virtue Ethics',
    institution: 'Stanford Encyclopedia of Philosophy',
    url: 'https://plato.stanford.edu/entries/ethics-virtue/',
    type: 'encyclopedia',
    openAccess: true,
    clusters: ['virtue-ethics'],
    moralAxes: ['loyalty', 'individual'],
    safeClaim:
      'Virtue ethics focuses on character and what kind of person one should be, asking which traits and dispositions constitute a good human life, rather than focusing primarily on rules or consequences.',
    claimsToAvoid: [
      'SplitVote measures virtue',
      "A person's SplitVote archetype reflects their virtuous character",
    ],
    citationStyle: 'paraphrase-only',
    requiresDisclaimer: false,
    contentOpportunities: [
      '/personality',
      'blog:what-your-moral-personality-means',
    ],
    addedAt: '2026-05-04',
    addedBy: 'research-planning',
  },
  {
    id: 'sep-bioethics',
    title: 'Bioethics',
    institution: 'Stanford Encyclopedia of Philosophy',
    url: 'https://plato.stanford.edu/entries/bioethics/',
    type: 'encyclopedia',
    openAccess: true,
    clusters: ['bioethics'],
    moralAxes: ['utility', 'individual', 'freedom'],
    safeClaim:
      'Bioethics addresses the moral dimensions of decisions in medicine and life sciences, including end-of-life care, organ allocation, resource scarcity, and the limits of bodily autonomy. Philosophers argue these cases expose fundamental tensions between welfare maximisation and respect for persons.',
    claimsToAvoid: [
      'SplitVote gives medical or clinical advice',
      'bioethics has settled answers',
      'your vote indicates what you would do in a real medical situation',
    ],
    citationStyle: 'paraphrase-only',
    requiresDisclaimer: true,
    contentOpportunities: [
      '/bioethics',
      'blog:bioethics-when-medicine-forces-impossible-choices',
      'scenario:organ-harvest',
      'scenario:mercy-kill',
      'scenario:pandemic-dose',
    ],
    addedAt: '2026-05-10',
    addedBy: 'research-planning',
  },
  {
    id: 'sep-euthanasia',
    title: 'Voluntary Euthanasia',
    institution: 'Stanford Encyclopedia of Philosophy',
    url: 'https://plato.stanford.edu/entries/euthanasia-voluntary/',
    type: 'encyclopedia',
    openAccess: true,
    clusters: ['bioethics', 'harm-prevention'],
    moralAxes: ['freedom', 'individual', 'utility'],
    safeClaim:
      'Philosophers debate voluntary euthanasia through competing frameworks: autonomy-based arguments hold that competent individuals have the right to control their own death; welfare-based arguments focus on the relief of irremediable suffering; slippery-slope arguments warn of risks to vulnerable populations if assisted dying is legalised.',
    claimsToAvoid: [
      'euthanasia is morally permitted',
      'euthanasia is morally wrong',
      'SplitVote has a position on end-of-life law',
    ],
    citationStyle: 'paraphrase-only',
    requiresDisclaimer: true,
    contentOpportunities: [
      '/bioethics',
      'blog:bioethics-when-medicine-forces-impossible-choices',
      'scenario:mercy-kill',
    ],
    addedAt: '2026-05-10',
    addedBy: 'research-planning',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getResearchSourceById(id: string): ResearchSource | undefined {
  return RESEARCH_SOURCES.find((s) => s.id === id)
}

export function getResearchSourcesByCluster(cluster: MoralCluster): ResearchSource[] {
  return RESEARCH_SOURCES.filter((s) => s.clusters.includes(cluster))
}

/**
 * Returns sources whose contentOpportunities includes the given topic slug,
 * blog slug prefix ('blog:...'), or route path.
 * Useful for populating a "Further reading" panel on a landing page.
 */
export function getResearchSourcesForLanding(topicSlug: string): ResearchSource[] {
  return RESEARCH_SOURCES.filter(
    (s) =>
      s.contentOpportunities.includes(`/${topicSlug}`) ||
      s.contentOpportunities.includes(topicSlug),
  )
}

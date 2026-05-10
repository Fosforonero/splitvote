export type SeoTopicStatus = 'published' | 'draft'

export interface SeoTopic {
  /** URL slug — must not appear in RESERVED_SLUGS / RESERVED_IT_SLUGS, no proper nouns */
  slug: string
  /**
   * Route affinity: 'en' → served by app/[topicSlug] (root route).
   * 'it' → served by app/it/[topicSlug].
   * getPublishedTopics() and getIndexableTopics() guard the root route to EN-only.
   */
  locale: 'en' | 'it'
  /**
   * Slug of the counterpart page in the other locale.
   * EN topic: points to the IT slug. IT topic: points to the EN slug.
   * Used to build hreflang cross-links between EN and IT versions.
   */
  alternateSlug?: string
  /** Short label used in nav pills and cross-links */
  topic: string
  /** Comma-separated long-tail search queries this page targets */
  searchIntent: string
  /** Core moral tension — must be unique across published topics */
  tension: string
  /** SEO H1 headline — no brand names */
  headline: string
  /** Unique intro paragraph, max ~120 words, no proper nouns or brand names */
  intro: string
  /** Primary scenario ID (must exist in lib/scenarios.ts) — shown above the fold */
  primaryScenarioId: string
  /** 3–5 related scenario IDs (all must exist in lib/scenarios.ts) */
  relatedScenarioIds: string[]
  /** Slugs of related landing pages for cross-linking (missing slugs are silently skipped) */
  relatedTopicSlugs: string[]
  /** Short contextual note about research that studies this tension (1-2 sentences, no validation claims) */
  researchNote?: string
  /** Max 3 authoritative external sources related to this topic */
  researchSources?: { title: string; institution: string; url: string }[]
  /** 'published' → SSG page built; 'draft' → skipped at build time */
  status: SeoTopicStatus
  /**
   * true → page is built but carries <meta name="robots" noindex> and is excluded from sitemap.
   * Use for topics awaiting editorial review or enough vote data.
   */
  noindexUntilReady: boolean
}

// ─── Collision guard — EN root route ────────────────────────────────────────
// All slugs reserved by existing Next.js routes at app/ root level.
// generateStaticParams() in app/[topicSlug]/page.tsx throws if any EN topic slug matches.
export const RESERVED_SLUGS = new Set([
  'it', 'play', 'results', 'category', 'blog', 'admin', 'api', 'login',
  'privacy', 'terms', 'faq', 'trending', 'profile', 'dashboard',
  'personality', 'moral-dilemmas', 'would-you-rather-questions',
  'submit-poll', 'reset-password', 'auth', 'business', 'offline', 'u',
  'sitemap', 'robots', 'favicon', 'icon', 'not-found',
])

// ─── Collision guard — IT sub-route ─────────────────────────────────────────
// All slugs reserved by existing Next.js routes at app/it/ level.
// generateStaticParams() in app/it/[topicSlug]/page.tsx throws if any IT topic slug matches.
export const RESERVED_IT_SLUGS = new Set([
  'about', 'blog', 'category', 'dilemmi-morali', 'domande-would-you-rather',
  'faq', 'personality', 'play', 'privacy', 'results', 'terms', 'trending',
])

// ─── Landing page QA checklist (verify before setting status='published') ───
// [ ] Unique intro — not copy-pasted from another topic
// [ ] primaryScenarioId is a valid id in lib/scenarios.ts
// [ ] relatedScenarioIds has ≥ 3 entries, all valid ids in lib/scenarios.ts
// [ ] slug is not in RESERVED_SLUGS / RESERVED_IT_SLUGS (enforced at build — throws if violated)
// [ ] No proper nouns or brand names in headline, intro, topic, or tension
// [ ] canonical URL matches the slug exactly
// [ ] status='published' && noindexUntilReady=false → appears in sitemap
// [ ] noindexUntilReady=true OR relatedScenarioIds.length < 3 → noindex meta
// [ ] alternateSlug (if set) points to a valid slug of the counterpart locale

export const SEO_TOPICS: SeoTopic[] = [
  // ── English topics ──────────────────────────────────────────────────────
  {
    slug: 'trolley-problem',
    locale: 'en',
    alternateSlug: 'problema-del-carrello',
    topic: 'Trolley Problem',
    searchIntent: 'trolley problem moral dilemma, trolley problem ethics, would you pull the lever',
    tension: 'utilitarian calculus vs the prohibition on causing direct harm',
    headline: 'The Trolley Problem — Would You Pull the Lever?',
    intro:
      'A runaway trolley is heading toward five people tied to the tracks. You stand beside a lever that diverts it — but the alternate track holds one person. Pull the lever and you actively cause one death to prevent five. Do nothing and five die without your hand on the switch. This thought experiment has shaped moral philosophy for decades: it forces a choice between maximising the number of lives saved and the absolute constraint against causing harm directly.',
    primaryScenarioId: 'trolley',
    relatedScenarioIds: ['organ-harvest', 'time-machine', 'lifeboat', 'plane-parachute'],
    relatedTopicSlugs: ['ai-ethics-dilemmas', 'loyalty-vs-honesty', 'consequentialism', 'deontology'],
    researchNote:
      'Philosophers have used the trolley problem for decades to explore whether it is morally different to cause harm directly rather than allow harm to happen. SplitVote turns that classic tension into a live voting question.',
    researchSources: [
      {
        title: 'Moral Dilemmas',
        institution: 'Stanford Encyclopedia of Philosophy',
        url: 'https://plato.stanford.edu/entries/moral-dilemmas/',
      },
      {
        title: 'Doing vs. Allowing Harm',
        institution: 'Stanford Encyclopedia of Philosophy',
        url: 'https://plato.stanford.edu/entries/doing-allowing/',
      },
    ],
    status: 'published',
    noindexUntilReady: false,
  },
  {
    slug: 'ai-ethics-dilemmas',
    locale: 'en',
    alternateSlug: 'dilemmi-etici-intelligenza-artificiale',
    topic: 'AI Ethics',
    searchIntent: 'AI ethics dilemma, self-driving car moral dilemma, artificial intelligence ethical questions',
    tension: 'algorithmic optimisation vs human moral judgment and accountability',
    headline: 'AI Ethics Dilemmas — When Machines Must Choose',
    intro:
      'Autonomous systems now make decisions that were once reserved for human judgment. A vehicle\'s brakes fail and the algorithm must decide who bears the risk. A sentencing tool assigns a score that shapes years of someone\'s life. An AI produces work no human authored — and ownership law has no clear answer. These are not speculative futures: they are decisions being encoded today. When a machine chooses wrong, who is accountable?',
    primaryScenarioId: 'self-driving-crash',
    relatedScenarioIds: ['robot-judge', 'ai-replaces-jobs', 'brain-upload', 'ai-art-copyright'],
    relatedTopicSlugs: ['trolley-problem', 'loyalty-vs-honesty', 'consequentialism'],
    researchNote:
      'In 2018, researchers at MIT ran a large-scale study called the Moral Machine, collecting over 40 million moral decisions from people in 233 countries — asking how an autonomous vehicle should choose in unavoidable crash scenarios. SplitVote lets you explore similar questions one vote at a time.',
    researchSources: [
      {
        title: 'The Moral Machine experiment (Awad et al., Nature 2018)',
        institution: 'MIT Media Lab / Nature',
        url: 'https://www.nature.com/articles/s41586-018-0637-6',
      },
      {
        title: 'Privacy',
        institution: 'Stanford Encyclopedia of Philosophy',
        url: 'https://plato.stanford.edu/entries/privacy/',
      },
    ],
    status: 'published',
    noindexUntilReady: false,
  },
  {
    slug: 'loyalty-vs-honesty',
    locale: 'en',
    alternateSlug: 'lealta-vs-onesta',
    topic: 'Loyalty vs Honesty',
    searchIntent: 'loyalty vs honesty dilemma, ethical dilemma betraying a friend, should I tell the truth when it hurts',
    tension: 'personal loyalty and protecting loved ones vs moral duty to honesty and justice',
    headline: 'Loyalty vs Honesty — When Telling the Truth Has a Price',
    intro:
      'The people closest to us make mistakes — sometimes serious ones. When a partner, friend, or family member does something wrong, the pull between protecting them and telling the truth is one of the sharpest tensions in everyday ethics. Staying loyal can mean shielding wrongdoing from the people it harmed. Speaking honestly can destroy a relationship built over years. These dilemmas test whether loyalty is a moral virtue or a cover for harm that should come to light.',
    primaryScenarioId: 'cover-accident',
    relatedScenarioIds: ['sibling-secret', 'report-friend', 'truth-friend', 'whistleblower'],
    relatedTopicSlugs: ['trolley-problem', 'ai-ethics-dilemmas', 'virtue-ethics', 'deontology'],
    researchNote:
      'Moral Foundations Theory treats loyalty and fairness as distinct moral concerns that can pull in different directions. These dilemmas ask where you draw the line when protecting someone close conflicts with telling the truth.',
    researchSources: [
      {
        title: 'Moral Foundations Theory',
        institution: 'moralfoundations.org',
        url: 'https://moralfoundations.org/',
      },
      {
        title: 'Moral Dilemmas',
        institution: 'Stanford Encyclopedia of Philosophy',
        url: 'https://plato.stanford.edu/entries/moral-dilemmas/',
      },
    ],
    status: 'published',
    noindexUntilReady: false,
  },

  // ── Italian topics ───────────────────────────────────────────────────────
  {
    slug: 'problema-del-carrello',
    locale: 'it',
    alternateSlug: 'trolley-problem',
    topic: 'Problema del carrello',
    searchIntent: 'problema del carrello dilemma morale, dilemma etico della leva, etica utilitaristica sacrificio una persona',
    tension: 'calcolo utilitaristico contro il divieto di causare danno diretto',
    headline: 'Il problema del carrello — Abbasseresti la leva?',
    intro:
      'Un carrello fuori controllo sta per investire cinque persone legate ai binari. Sei accanto a una leva che lo devierebbe su un binario alternativo — dove però si trova una sola persona. Abbassare la leva significa salvare cinque causando direttamente una morte. Non farlo significa lasciar morire cinque senza che la tua mano intervenga. Questo esperimento mentale divide da decenni i filosofi morali: conta solo il numero di vite salvate, o esiste un vincolo assoluto contro il causare danno diretto, anche per un fine buono?',
    primaryScenarioId: 'trolley',
    relatedScenarioIds: ['organ-harvest', 'time-machine', 'lifeboat', 'plane-parachute'],
    relatedTopicSlugs: ['dilemmi-etici-intelligenza-artificiale', 'lealta-vs-onesta', 'consequenzialismo', 'deontologia'],
    researchNote:
      'I filosofi usano il problema del carrello da decenni per esplorare se sia moralmente diverso causare danno direttamente rispetto al permettere che accada. SplitVote trasforma questa tensione classica in una domanda aperta al voto globale.',
    researchSources: [
      {
        title: 'Moral Dilemmas',
        institution: 'Stanford Encyclopedia of Philosophy',
        url: 'https://plato.stanford.edu/entries/moral-dilemmas/',
      },
      {
        title: 'Doing vs. Allowing Harm',
        institution: 'Stanford Encyclopedia of Philosophy',
        url: 'https://plato.stanford.edu/entries/doing-allowing/',
      },
    ],
    status: 'published',
    noindexUntilReady: false,
  },
  {
    slug: 'dilemmi-etici-intelligenza-artificiale',
    locale: 'it',
    alternateSlug: 'ai-ethics-dilemmas',
    topic: "Etica dell'IA",
    searchIntent: 'dilemmi etici intelligenza artificiale, auto a guida autonoma dilemma morale, responsabilità algoritmo chi decide',
    tension: "ottimizzazione algoritmica contro il giudizio morale umano e la responsabilità",
    headline: "Dilemmi etici dell'intelligenza artificiale — Quando le macchine devono scegliere",
    intro:
      "I sistemi autonomi prendono oggi decisioni che un tempo spettavano solo agli esseri umani. I freni di un'auto cedono e l'algoritmo deve scegliere chi rischia la vita. Un software di valutazione assegna un punteggio che condiziona anni di esistenza. Una macchina produce opere creative senza autore umano — e il diritto d'autore non ha ancora una risposta. Non sono scenari futuri: sono scelte già codificate nel software di oggi. Quando una macchina decide e sbaglia, chi ne risponde?",
    primaryScenarioId: 'self-driving-crash',
    relatedScenarioIds: ['robot-judge', 'ai-replaces-jobs', 'brain-upload', 'ai-art-copyright'],
    relatedTopicSlugs: ['problema-del-carrello', 'lealta-vs-onesta', 'consequenzialismo'],
    researchNote:
      'Nel 2018, ricercatori del MIT hanno condotto il progetto Moral Machine, raccogliendo oltre 40 milioni di decisioni morali da persone in 233 paesi — chiedendo come un veicolo autonomo dovrebbe scegliere in scenari di collisione inevitabile. SplitVote ti permette di esplorare tensioni simili, un voto alla volta.',
    researchSources: [
      {
        title: 'The Moral Machine experiment (Awad et al., Nature 2018)',
        institution: 'MIT Media Lab / Nature',
        url: 'https://www.nature.com/articles/s41586-018-0637-6',
      },
      {
        title: 'Privacy',
        institution: 'Stanford Encyclopedia of Philosophy',
        url: 'https://plato.stanford.edu/entries/privacy/',
      },
    ],
    status: 'published',
    noindexUntilReady: false,
  },
  {
    slug: 'lealta-vs-onesta',
    locale: 'it',
    alternateSlug: 'loyalty-vs-honesty',
    topic: 'Lealtà vs onestà',
    searchIntent: 'dilemma lealtà onestà, dilemma etico tradire un amico, dire la verità quando fa male',
    tension: 'lealtà personale e protezione dei propri cari contro il dovere morale di onestà e giustizia',
    headline: 'Lealtà vs onestà — Quando dire la verità ha un prezzo',
    intro:
      'Le persone più vicine a noi commettono errori — a volte gravi. Quando un partner, un amico o un familiare fa qualcosa di sbagliato, la tensione tra proteggerlo e dire la verità è uno dei conflitti morali più concreti della vita quotidiana. Restare leali può significare coprire un torto a danno di chi ne ha subito le conseguenze. Essere onesti può distruggere un legame costruito in anni. Questi dilemmi mettono alla prova una domanda fondamentale: la lealtà è una virtù morale o diventa complicità?',
    primaryScenarioId: 'cover-accident',
    relatedScenarioIds: ['sibling-secret', 'report-friend', 'truth-friend', 'whistleblower'],
    relatedTopicSlugs: ['problema-del-carrello', 'dilemmi-etici-intelligenza-artificiale', 'etica-della-virtu', 'deontologia'],
    researchNote:
      "La Moral Foundations Theory tratta la lealtà e l'equità come preoccupazioni morali distinte che possono entrare in conflitto. Questi dilemmi chiedono dove tracci il confine quando proteggere qualcuno di caro si scontra con il dovere di dire la verità.",
    researchSources: [
      {
        title: 'Moral Foundations Theory',
        institution: 'moralfoundations.org',
        url: 'https://moralfoundations.org/',
      },
      {
        title: 'Moral Dilemmas',
        institution: 'Stanford Encyclopedia of Philosophy',
        url: 'https://plato.stanford.edu/entries/moral-dilemmas/',
      },
    ],
    status: 'published',
    noindexUntilReady: false,
  },

  // ── Ethics theory landings (G7 — added 10 May 2026) ─────────────────────
  {
    slug: 'consequentialism',
    locale: 'en',
    alternateSlug: 'consequenzialismo',
    topic: 'Consequentialism',
    searchIntent: 'consequentialism examples, utilitarianism dilemmas, ethics of outcomes, greatest good for the greatest number',
    tension: 'maximising aggregate welfare vs respecting individual rights and dignity',
    headline: 'Consequentialism — Does the End Justify the Means?',
    intro:
      'Five lives saved at the cost of one — most people accept that calculation. But change the case slightly and the math becomes unbearable: would you sacrifice one healthy patient to save five who need transplants? The arithmetic is identical. The verdict almost always isn\'t. Consequentialism judges actions by their outcomes — produce the most good, minimise the most harm — and it captures something real about how people reason in emergencies. It also runs into a sharp limit when the best aggregate outcome requires using a person as a means.',
    primaryScenarioId: 'organ-harvest',
    relatedScenarioIds: ['trolley', 'pandemic-dose', 'rich-or-fair', 'universal-basic-income'],
    relatedTopicSlugs: ['deontology', 'virtue-ethics', 'trolley-problem'],
    researchNote:
      'Bentham and Mill formulated the modern utilitarian version of consequentialism in the 18th and 19th centuries. Contemporary philosophers continue to debate where the boundary lies between aggregate welfare and individual rights.',
    researchSources: [
      {
        title: 'Consequentialism',
        institution: 'Stanford Encyclopedia of Philosophy',
        url: 'https://plato.stanford.edu/entries/consequentialism/',
      },
      {
        title: 'Moral Dilemmas',
        institution: 'Stanford Encyclopedia of Philosophy',
        url: 'https://plato.stanford.edu/entries/moral-dilemmas/',
      },
    ],
    status: 'published',
    noindexUntilReady: false,
  },
  {
    slug: 'deontology',
    locale: 'en',
    alternateSlug: 'deontologia',
    topic: 'Deontology',
    searchIntent: 'deontology examples, deontological ethics, ethics of duty, when rules matter more than results, categorical imperative',
    tension: 'absolute moral duties and rights vs the pursuit of better overall outcomes',
    headline: 'Deontology — When Some Things Are Always Wrong',
    intro:
      'Some actions are wrong regardless of the good they might produce. You cannot torture an innocent person even if it would save a hundred lives. You cannot frame someone for a crime they did not commit even if it would prevent a riot. Deontological ethics holds that morality is fundamentally about rules and duties, not outcomes. The strict version refuses any exception. The contemporary version allows context but preserves the core: certain constraints are near-absolute, even when breaking them would produce a better aggregate result.',
    primaryScenarioId: 'innocent-juror',
    relatedScenarioIds: ['whistleblower', 'cover-accident', 'mandatory-vaccine', 'organ-harvest'],
    relatedTopicSlugs: ['consequentialism', 'virtue-ethics', 'loyalty-vs-honesty'],
    researchNote:
      'Immanuel Kant developed the most influential deontological framework in the 18th century, with his categorical imperative as its central test. Modern deontology divides between strict rule-followers and contextualists who weight duties without abandoning them.',
    researchSources: [
      {
        title: 'Deontological Ethics',
        institution: 'Stanford Encyclopedia of Philosophy',
        url: 'https://plato.stanford.edu/entries/ethics-deontological/',
      },
      {
        title: 'Moral Dilemmas',
        institution: 'Stanford Encyclopedia of Philosophy',
        url: 'https://plato.stanford.edu/entries/moral-dilemmas/',
      },
    ],
    status: 'published',
    noindexUntilReady: false,
  },
  {
    slug: 'virtue-ethics',
    locale: 'en',
    alternateSlug: 'etica-della-virtu',
    topic: 'Virtue Ethics',
    searchIntent: 'virtue ethics examples, character ethics, what would a good person do, eudaimonia, moral character',
    tension: 'cultivating good character vs following rules or calculating outcomes',
    headline: 'Virtue Ethics — What Kind of Person Do You Want to Be?',
    intro:
      'Instead of asking "what rule applies?" or "what outcome is best?", virtue ethics asks a different question: what would a person of good character do here? It is the oldest of the major Western ethical frameworks and it shifts the focus from the action to the actor. A virtuous person brings practical wisdom — the ability to perceive what matters, weigh competing considerations, and act appropriately — without consulting a rulebook. This makes virtue ethics flexible where the others are rigid, but also less precise. The question becomes about who you are, not just what you do.',
    primaryScenarioId: 'truth-friend',
    relatedScenarioIds: ['forgive-cheater', 'sibling-secret', 'love-or-career', 'cover-accident'],
    relatedTopicSlugs: ['consequentialism', 'deontology', 'loyalty-vs-honesty'],
    researchNote:
      'Aristotle developed the foundational account of virtue ethics in ancient Greece, centred on eudaimonia (human flourishing) and the cultivation of stable character traits. The framework was largely set aside in modern philosophy and has seen a major revival since the late 20th century.',
    researchSources: [
      {
        title: 'Virtue Ethics',
        institution: 'Stanford Encyclopedia of Philosophy',
        url: 'https://plato.stanford.edu/entries/ethics-virtue/',
      },
      {
        title: 'Moral Dilemmas',
        institution: 'Stanford Encyclopedia of Philosophy',
        url: 'https://plato.stanford.edu/entries/moral-dilemmas/',
      },
    ],
    status: 'published',
    noindexUntilReady: false,
  },
  {
    slug: 'consequenzialismo',
    locale: 'it',
    alternateSlug: 'consequentialism',
    topic: 'Consequenzialismo',
    searchIntent: 'consequenzialismo esempi, utilitarismo dilemmi, etica dei risultati, il bene maggiore per il maggior numero',
    tension: "massimizzare il benessere aggregato contro il rispetto dei diritti e della dignità individuali",
    headline: 'Consequenzialismo — Il fine giustifica i mezzi?',
    intro:
      "Cinque vite salvate al costo di una — la maggior parte delle persone accetta questo calcolo. Ma cambia leggermente il caso e la matematica diventa insostenibile: sacrificheresti un paziente sano per salvarne cinque che hanno bisogno di trapianti? L'aritmetica è identica. Il verdetto quasi mai. Il consequenzialismo giudica le azioni dai risultati — produrre il maggior bene, minimizzare il maggior danno — e cattura qualcosa di reale su come ragioniamo nelle emergenze. Si scontra anche con un limite netto quando il miglior risultato aggregato richiede di usare una persona come strumento.",
    primaryScenarioId: 'organ-harvest',
    relatedScenarioIds: ['trolley', 'pandemic-dose', 'rich-or-fair', 'universal-basic-income'],
    relatedTopicSlugs: ['deontologia', 'etica-della-virtu', 'problema-del-carrello'],
    researchNote:
      "Bentham e Mill hanno formulato la versione utilitarista moderna del consequenzialismo nei secoli XVIII e XIX. I filosofi contemporanei continuano a dibattere dove si trovi il confine tra benessere aggregato e diritti individuali.",
    researchSources: [
      {
        title: 'Consequentialism',
        institution: 'Stanford Encyclopedia of Philosophy',
        url: 'https://plato.stanford.edu/entries/consequentialism/',
      },
      {
        title: 'Moral Dilemmas',
        institution: 'Stanford Encyclopedia of Philosophy',
        url: 'https://plato.stanford.edu/entries/moral-dilemmas/',
      },
    ],
    status: 'published',
    noindexUntilReady: false,
  },
  {
    slug: 'deontologia',
    locale: 'it',
    alternateSlug: 'deontology',
    topic: 'Deontologia',
    searchIntent: "deontologia esempi, etica del dovere, quando le regole contano più dei risultati, imperativo categorico",
    tension: "doveri e diritti morali assoluti contro la ricerca di risultati complessivi migliori",
    headline: 'Deontologia — Quando alcune cose sono sempre sbagliate',
    intro:
      "Alcune azioni sono sbagliate indipendentemente dal bene che potrebbero produrre. Non puoi torturare un innocente anche se salverebbe cento vite. Non puoi incastrare qualcuno per un crimine che non ha commesso anche se impedirebbe una rivolta. L'etica deontologica sostiene che la moralità riguarda fondamentalmente regole e doveri, non risultati. La versione stretta non ammette eccezioni. La versione contemporanea ammette il contesto ma preserva il nucleo: alcuni vincoli sono quasi assoluti, anche quando romperli produrrebbe un risultato aggregato migliore.",
    primaryScenarioId: 'innocent-juror',
    relatedScenarioIds: ['whistleblower', 'cover-accident', 'mandatory-vaccine', 'organ-harvest'],
    relatedTopicSlugs: ['consequenzialismo', 'etica-della-virtu', 'lealta-vs-onesta'],
    researchNote:
      "Immanuel Kant ha sviluppato il framework deontologico più influente nel XVIII secolo, con l'imperativo categorico come test centrale. La deontologia moderna si divide tra rigoristi e contestualisti che soppesano i doveri senza abbandonarli.",
    researchSources: [
      {
        title: 'Deontological Ethics',
        institution: 'Stanford Encyclopedia of Philosophy',
        url: 'https://plato.stanford.edu/entries/ethics-deontological/',
      },
      {
        title: 'Moral Dilemmas',
        institution: 'Stanford Encyclopedia of Philosophy',
        url: 'https://plato.stanford.edu/entries/moral-dilemmas/',
      },
    ],
    status: 'published',
    noindexUntilReady: false,
  },
  {
    slug: 'etica-della-virtu',
    locale: 'it',
    alternateSlug: 'virtue-ethics',
    topic: 'Etica della virtù',
    searchIntent: "etica della virtù esempi, etica del carattere, cosa farebbe una persona buona, eudaimonia, carattere morale",
    tension: "coltivare il buon carattere contro il seguire regole o calcolare risultati",
    headline: 'Etica della virtù — Che tipo di persona vuoi essere?',
    intro:
      "Invece di chiedere \"quale regola si applica?\" o \"quale risultato è migliore?\", l'etica della virtù pone una domanda diversa: cosa farebbe una persona di buon carattere qui? È il più antico dei grandi framework etici occidentali e sposta il focus dall'azione all'attore. Una persona virtuosa porta saggezza pratica — la capacità di percepire ciò che conta, soppesare considerazioni in competizione e agire in modo appropriato — senza consultare un manuale. Questo rende l'etica della virtù flessibile dove gli altri framework sono rigidi, ma anche meno precisa. La domanda diventa su chi sei, non solo su cosa fai.",
    primaryScenarioId: 'truth-friend',
    relatedScenarioIds: ['forgive-cheater', 'sibling-secret', 'love-or-career', 'cover-accident'],
    relatedTopicSlugs: ['consequenzialismo', 'deontologia', 'lealta-vs-onesta'],
    researchNote:
      "Aristotele ha sviluppato la versione fondazionale dell'etica della virtù nell'antica Grecia, centrata sull'eudaimonia (il fiorire umano) e sulla coltivazione di tratti stabili del carattere. Il framework è stato largamente messo da parte nella filosofia moderna e ha visto un grande risveglio dalla fine del XX secolo.",
    researchSources: [
      {
        title: 'Virtue Ethics',
        institution: 'Stanford Encyclopedia of Philosophy',
        url: 'https://plato.stanford.edu/entries/ethics-virtue/',
      },
      {
        title: 'Moral Dilemmas',
        institution: 'Stanford Encyclopedia of Philosophy',
        url: 'https://plato.stanford.edu/entries/moral-dilemmas/',
      },
    ],
    status: 'published',
    noindexUntilReady: false,
  },
]

export function getTopicBySlugAndLocale(slug: string, locale: 'en' | 'it'): SeoTopic | undefined {
  return SEO_TOPICS.find((t) => t.slug === slug && t.locale === locale)
}

/** EN-only: app/[topicSlug] only serves EN topics. */
export function getPublishedTopics(): SeoTopic[] {
  return SEO_TOPICS.filter((t) => t.status === 'published' && t.locale === 'en')
}

/** Topics that are published, EN-only, not noindex-gated, and have sufficient content for indexing. */
export function getIndexableTopics(): SeoTopic[] {
  return SEO_TOPICS.filter(
    (t) => t.status === 'published' && t.locale === 'en' && !t.noindexUntilReady && t.relatedScenarioIds.length >= 3,
  )
}

/** IT-only: app/it/[topicSlug] only serves IT topics. */
export function getPublishedITTopics(): SeoTopic[] {
  return SEO_TOPICS.filter((t) => t.status === 'published' && t.locale === 'it')
}

/** Topics that are published, IT-only, not noindex-gated, and have sufficient content for indexing. */
export function getIndexableITTopics(): SeoTopic[] {
  return SEO_TOPICS.filter(
    (t) => t.status === 'published' && t.locale === 'it' && !t.noindexUntilReady && t.relatedScenarioIds.length >= 3,
  )
}

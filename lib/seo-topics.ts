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
  'topics', 'leaderboard', 'store',
])

// ─── Collision guard — IT sub-route ─────────────────────────────────────────
// All slugs reserved by existing Next.js routes at app/it/ level.
// generateStaticParams() in app/it/[topicSlug]/page.tsx throws if any IT topic slug matches.
export const RESERVED_IT_SLUGS = new Set([
  'about', 'blog', 'category', 'dilemmi-morali', 'domande-would-you-rather',
  'faq', 'personality', 'play', 'privacy', 'results', 'terms', 'trending',
  'temi', 'leaderboard',
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
  {
    slug: 'ai-art-ethics',
    locale: 'en',
    alternateSlug: 'etica-arte-ai',
    topic: 'AI Art Ethics',
    searchIntent: 'ai art ethics, generative ai authorship, ai art copyright dilemma, ethical questions ai generated art',
    tension: 'training data sourced without consent vs the artistic legitimacy of work no human authored',
    headline: 'AI Art Ethics — Who Owns Work the Machine Made?',
    intro:
      'Generative models can produce paintings, music and prose at near-zero cost. The training data, in many cases, was scraped from artists who never consented and were never paid. The legal answer is unsettled across jurisdictions, but the ethical question is sharper: if the model learned a living artist\'s style and a stranger now sells outputs in that style, what does authorship even mean? And when the output is technically new but recognisably derivative, who bears the moral cost — the user, the model maker, or the platform that hosts it?',
    primaryScenarioId: 'ai-art-copyright',
    relatedScenarioIds: ['deepfake-expose', 'ai-replaces-jobs', 'self-driving-crash'],
    relatedTopicSlugs: ['ai-ethics-dilemmas', 'privacy-ethics', 'consequentialism'],
    researchNote:
      'Ongoing court cases in the US and EU are testing whether training a model on copyrighted work counts as fair use or as infringement. The Stanford CRFM and the EU AI Act both treat training-data provenance as a first-class concern; the moral question of stylistic imitation runs ahead of the legal one.',
    researchSources: [
      {
        title: 'Generative AI and the Future of Copyright',
        institution: 'Stanford Center for Research on Foundation Models',
        url: 'https://crfm.stanford.edu/',
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
    relatedTopicSlugs: ['deontology', 'virtue-ethics', 'trolley-problem', 'moral-foundations', 'experimental-moral-psychology'],
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
    relatedTopicSlugs: ['deontologia', 'etica-della-virtu', 'problema-del-carrello', 'fondamenti-morali', 'psicologia-morale-sperimentale'],
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
  {
    slug: 'privacy-ethics',
    locale: 'en',
    alternateSlug: 'etica-della-privacy',
    topic: 'Privacy Ethics',
    searchIntent: 'privacy ethics dilemmas, right to privacy philosophy, anonymity vs surveillance, digital privacy morality',
    tension: 'the right to be left alone vs collective security and accountability',
    headline: 'Privacy Ethics — When the Right to Be Left Alone Runs Out',
    intro:
      'Anonymous voting protects who you are. Surveillance cameras protect where you go. Data brokers record what you buy. AI infers what you believe. At every layer, a trade-off: give up some privacy to gain some safety, or hold the line and accept the risk. Privacy ethics asks where that line should fall — and who gets to draw it. The dilemmas below have no clean answers. They test what you actually value when the stakes are real.',
    primaryScenarioId: 'surveillance-city',
    relatedScenarioIds: ['privacy-terror', 'deepfake-expose', 'censor-speech', 'delete-social-media'],
    relatedTopicSlugs: ['ai-ethics-dilemmas', 'moral-foundations', 'consequentialism'],
    researchNote:
      'Philosophers distinguish identity privacy (who you are) from information privacy (what you think or do). AI-driven inference increasingly collapses this distinction: anonymous datasets can be re-identified; behavioural patterns can reveal beliefs never explicitly disclosed.',
    researchSources: [
      {
        title: 'Privacy',
        institution: 'Stanford Encyclopedia of Philosophy',
        url: 'https://plato.stanford.edu/entries/privacy/',
      },
      {
        title: 'Privacy and Information Technology',
        institution: 'Stanford Encyclopedia of Philosophy',
        url: 'https://plato.stanford.edu/entries/it-privacy/',
      },
    ],
    status: 'published',
    noindexUntilReady: false,
  },
  {
    slug: 'moral-foundations',
    locale: 'en',
    alternateSlug: 'fondamenti-morali',
    topic: 'Moral Foundations',
    searchIntent: 'moral foundations theory, why people disagree on ethics, Jonathan Haidt morality, moral psychology, care fairness loyalty authority sanctity liberty',
    tension: 'different moral foundations producing irreconcilable but internally coherent worldviews',
    headline: 'Moral Foundations — Why Good People Reach Opposite Conclusions',
    intro:
      "Two people read the same dilemma and reach completely opposite conclusions — each convinced the other is missing something obvious. Moral Foundations Theory proposes that this happens because they're reasoning from different psychological systems: Care, Fairness, Loyalty, Authority, Sanctity, Liberty. The dilemmas below activate these foundations in ways that reveal which ones are running your deepest moral reasoning. Neither response is wrong. They're different moral languages.",
    primaryScenarioId: 'trolley',
    relatedScenarioIds: ['innocent-juror', 'truth-friend', 'mandatory-vaccine', 'surveillance-city'],
    relatedTopicSlugs: ['consequentialism', 'deontology', 'virtue-ethics'],
    researchNote:
      "Jonathan Haidt and colleagues developed Moral Foundations Theory to explain cross-cultural variation in moral intuitions. The framework identifies six foundational systems — Care, Fairness, Loyalty, Authority, Sanctity, Liberty — each with evolutionary origins and contemporary moral weight. Liberal and conservative moral systems differ primarily in how heavily the non-Care/Fairness foundations are weighted.",
    researchSources: [
      {
        title: 'Moral Psychology Research Lab',
        institution: 'University of Virginia / NYU',
        url: 'https://moralfoundations.org',
      },
      {
        title: 'The Righteous Mind',
        institution: 'Jonathan Haidt (Pantheon Books, 2012)',
        url: 'https://righteousmind.com',
      },
    ],
    status: 'published',
    noindexUntilReady: false,
  },
  {
    slug: 'etica-della-privacy',
    locale: 'it',
    alternateSlug: 'privacy-ethics',
    topic: 'Etica della privacy',
    searchIntent: 'etica della privacy, diritto alla privacy filosofia, anonimato vs sorveglianza, moralità privacy digitale',
    tension: 'il diritto a essere lasciati in pace contro la sicurezza collettiva e la responsabilità',
    headline: 'Etica della Privacy — Quando il Diritto a Essere Lasciati in Pace Finisce',
    intro:
      "Il voto anonimo protegge chi sei. Le telecamere di sorveglianza proteggono dove vai. I data broker registrano cosa compri. L'IA inferisce cosa credi. A ogni livello, un compromesso: cedere un po' di privacy per guadagnare un po' di sicurezza, o tenere la linea e accettare il rischio. L'etica della privacy chiede dove dovrebbe cadere quella linea — e chi ha il diritto di tracciarla. I dilemmi qui sotto non hanno risposte pulite. Testano cosa valorizzi davvero quando le posta è alta.",
    primaryScenarioId: 'surveillance-city',
    relatedScenarioIds: ['privacy-terror', 'deepfake-expose', 'censor-speech', 'delete-social-media'],
    relatedTopicSlugs: ['dilemmi-etici-intelligenza-artificiale', 'fondamenti-morali', 'consequenzialismo'],
    researchNote:
      "I filosofi distinguono la privacy dell'identità (chi sei) dalla privacy dell'informazione (cosa pensi o fai). L'inferenza guidata dall'IA sta sempre più collassando questa distinzione: i dataset anonimi possono essere re-identificati; i pattern comportamentali possono rivelare convinzioni mai esplicitamente dichiarate.",
    researchSources: [
      {
        title: 'Privacy',
        institution: 'Stanford Encyclopedia of Philosophy',
        url: 'https://plato.stanford.edu/entries/privacy/',
      },
      {
        title: 'Privacy and Information Technology',
        institution: 'Stanford Encyclopedia of Philosophy',
        url: 'https://plato.stanford.edu/entries/it-privacy/',
      },
    ],
    status: 'published',
    noindexUntilReady: false,
  },
  {
    slug: 'fondamenti-morali',
    locale: 'it',
    alternateSlug: 'moral-foundations',
    topic: 'Fondamenti morali',
    searchIntent: 'teoria dei fondamenti morali, perché le persone non sono d\'accordo sull\'etica, Jonathan Haidt moralità, psicologia morale, cura equità lealtà autorità sacralità libertà',
    tension: 'fondamenti morali diversi che producono visioni del mondo irriconciliabili ma internamente coerenti',
    headline: 'Fondamenti Morali — Perché le Persone Oneste Arrivano a Conclusioni Opposte',
    intro:
      "Due persone leggono lo stesso dilemma e arrivano a conclusioni completamente opposte — ognuna convinta che l'altra stia mancando qualcosa di ovvio. La Teoria dei Fondamenti Morali propone che questo accada perché ragionano da sistemi psicologici diversi: Cura, Equità, Lealtà, Autorità, Sacralità, Libertà. I dilemmi qui sotto attivano questi fondamenti in modi che rivelano quali stanno guidando il tuo ragionamento morale più profondo. Nessuna risposta è sbagliata. Sono linguaggi morali diversi.",
    primaryScenarioId: 'trolley',
    relatedScenarioIds: ['innocent-juror', 'truth-friend', 'mandatory-vaccine', 'surveillance-city'],
    relatedTopicSlugs: ['consequenzialismo', 'deontologia', 'etica-della-virtu'],
    researchNote:
      "Jonathan Haidt e colleghi hanno sviluppato la Teoria dei Fondamenti Morali per spiegare la variazione cross-culturale nelle intuizioni morali. Il framework identifica sei sistemi fondazionali — Cura, Equità, Lealtà, Autorità, Sacralità, Libertà — ognuno con origini evolutive e peso morale contemporaneo. I sistemi morali liberal e conservatori differiscono principalmente nel peso dato ai fondamenti non-Cura/Equità.",
    researchSources: [
      {
        title: 'Moral Psychology Research Lab',
        institution: 'University of Virginia / NYU',
        url: 'https://moralfoundations.org',
      },
      {
        title: 'The Righteous Mind',
        institution: 'Jonathan Haidt (Pantheon Books, 2012)',
        url: 'https://righteousmind.com',
      },
    ],
    status: 'published',
    noindexUntilReady: false,
  },
  {
    slug: 'bioethics',
    locale: 'en',
    alternateSlug: 'bioetica',
    topic: 'Bioethics',
    searchIntent: 'bioethics dilemmas, medical ethics examples, organ donation ethics, euthanasia debate, bodily autonomy philosophy',
    tension: 'extending life and relieving suffering vs respecting autonomy and fair allocation of scarce resources',
    headline: 'Bioethics — The Moral Questions Medicine Cannot Fully Answer',
    intro:
      'Medicine saves lives — and forces choices that no protocol fully resolves. Who gets the last transplant organ when five patients need it? Is it ethical to end a life to stop irremediable suffering? Should vaccines be mandatory when public health conflicts with individual freedom? Bioethics is where the abstract principles of moral philosophy collide with flesh-and-blood decisions made under pressure, with incomplete information, against a countdown. These dilemmas have no comfortable answers — only trade-offs between values that all matter.',
    primaryScenarioId: 'mercy-kill',
    relatedScenarioIds: ['organ-harvest', 'mandatory-vaccine', 'pandemic-dose', 'brain-upload'],
    relatedTopicSlugs: ['consequentialism', 'deontology', 'privacy-ethics'],
    researchNote:
      'The dominant framework in practical bioethics — Beauchamp and Childress\'s four principles (autonomy, non-maleficence, beneficence, justice) — provides structure for reasoning without resolving all conflicts. Philosophers and clinicians continue to debate where autonomy ends and collective obligation begins.',
    researchSources: [
      {
        title: 'Bioethics',
        institution: 'Stanford Encyclopedia of Philosophy',
        url: 'https://plato.stanford.edu/entries/bioethics/',
      },
      {
        title: 'Voluntary Euthanasia',
        institution: 'Stanford Encyclopedia of Philosophy',
        url: 'https://plato.stanford.edu/entries/euthanasia-voluntary/',
      },
    ],
    status: 'published',
    noindexUntilReady: false,
  },
  {
    slug: 'bioetica',
    locale: 'it',
    alternateSlug: 'bioethics',
    topic: 'Bioetica',
    searchIntent: 'bioetica dilemmi, etica medica esempi, donazione organi etica, dibattito eutanasia, autonomia corporea filosofia',
    tension: 'prolungare la vita e alleviare la sofferenza contro rispettare l\'autonomia e distribuire equamente risorse scarse',
    headline: 'Bioetica — Le Domande Morali a Cui la Medicina Non Può Rispondere del Tutto',
    intro:
      "La medicina salva vite — e impone scelte che nessun protocollo risolve completamente. Chi ottiene l'ultimo organo disponibile per il trapianto quando cinque pazienti ne hanno bisogno? È etico porre fine a una vita per fermare una sofferenza irrimediabile? I vaccini dovrebbero essere obbligatori quando la salute pubblica entra in conflitto con la libertà individuale? La bioetica è il luogo in cui i principi astratti della filosofia morale si scontrano con decisioni concrete prese sotto pressione, con informazioni incomplete, contro un conto alla rovescia. Questi dilemmi non hanno risposte comode — solo compromessi tra valori che contano tutti.",
    primaryScenarioId: 'mercy-kill',
    relatedScenarioIds: ['organ-harvest', 'mandatory-vaccine', 'pandemic-dose', 'brain-upload'],
    relatedTopicSlugs: ['consequenzialismo', 'deontologia', 'etica-della-privacy'],
    researchNote:
      "Il framework dominante nella bioetica pratica — i quattro principi di Beauchamp e Childress (autonomia, non maleficenza, beneficenza, giustizia) — fornisce struttura per il ragionamento senza risolvere tutti i conflitti. Filosofi e clinici continuano a dibattere dove finisce l'autonomia e dove inizia l'obbligo collettivo.",
    researchSources: [
      {
        title: 'Bioethics',
        institution: 'Stanford Encyclopedia of Philosophy',
        url: 'https://plato.stanford.edu/entries/bioethics/',
      },
      {
        title: 'Voluntary Euthanasia',
        institution: 'Stanford Encyclopedia of Philosophy',
        url: 'https://plato.stanford.edu/entries/euthanasia-voluntary/',
      },
    ],
    status: 'published',
    noindexUntilReady: false,
  },
  // ── Experimental moral psychology (G11 — added 10 May 2026) ────────────────
  {
    slug: 'experimental-moral-psychology',
    locale: 'en',
    alternateSlug: 'psicologia-morale-sperimentale',
    topic: 'Moral Psychology',
    searchIntent: 'experimental moral psychology, moral intuition research, trolley problem study, why people disagree on ethics, dual process moral cognition',
    tension: 'fast emotional moral intuitions vs slow deliberative reasoning — and which one should we trust',
    headline: 'Moral Psychology — What Science Reveals About How We Make Ethical Decisions',
    intro:
      'Why do most people pull the lever but refuse to push someone off a bridge, even when the arithmetic is identical? Why does framing a choice as an action versus an omission change the verdict? And why do our snap moral judgments so often override our careful reasoning — or vice versa? Experimental moral psychology uses the methods of cognitive science to study how people actually make ethical decisions, not how they say they do. The dilemmas below are the same ones researchers use in labs to probe the hidden machinery of moral thought.',
    primaryScenarioId: 'trolley',
    relatedScenarioIds: ['self-driving-crash', 'robot-judge', 'organ-harvest', 'innocent-juror'],
    relatedTopicSlugs: ['trolley-problem', 'consequentialism', 'deontology', 'moral-foundations'],
    researchNote:
      'Researchers have found that people\'s responses to moral dilemmas are shaped by both fast emotional reactions and slower deliberative reasoning — and that these can conflict. The trolley problem family of cases has been central to this empirical research since the 1980s.',
    researchSources: [
      {
        title: 'Experimental Moral Philosophy',
        institution: 'Stanford Encyclopedia of Philosophy',
        url: 'https://plato.stanford.edu/entries/experimental-moral/',
      },
      {
        title: 'Moral Cognition Research',
        institution: 'Harvard University (Joshua Greene)',
        url: 'https://www.joshua-greene.net/research/moral-cognition',
      },
    ],
    status: 'published',
    noindexUntilReady: false,
  },
  {
    slug: 'psicologia-morale-sperimentale',
    locale: 'it',
    alternateSlug: 'experimental-moral-psychology',
    topic: 'Psicologia morale',
    searchIntent: 'psicologia morale sperimentale, ricerca intuizione morale, studio problema del carrello, perché le persone non sono d\'accordo sull\'etica, cognizione morale duale',
    tension: 'intuizioni morali emotive veloci contro ragionamento deliberativo lento — e quale dei due dobbiamo seguire',
    headline: 'Psicologia Morale — Cosa Rivela la Scienza su Come Prendiamo Decisioni Etiche',
    intro:
      "Perché la maggior parte delle persone abbassa la leva ma si rifiuta di spingere qualcuno giù da un ponte, anche quando la matematica è identica? Perché inquadrare una scelta come azione o come omissione cambia il verdetto? E perché i nostri giudizi morali immediati spesso sopraffanno il ragionamento attento — o viceversa? La psicologia morale sperimentale usa i metodi delle scienze cognitive per studiare come le persone prendono davvero le decisioni etiche, non come dicono di farlo. I dilemmi qui sotto sono gli stessi usati dai ricercatori nei laboratori per sondare la macchina nascosta del pensiero morale.",
    primaryScenarioId: 'trolley',
    relatedScenarioIds: ['self-driving-crash', 'robot-judge', 'organ-harvest', 'innocent-juror'],
    relatedTopicSlugs: ['problema-del-carrello', 'consequenzialismo', 'deontologia', 'fondamenti-morali'],
    researchNote:
      "I ricercatori hanno scoperto che le risposte delle persone ai dilemmi morali sono modellate sia da reazioni emotive rapide che da un ragionamento deliberativo più lento — e che questi possono entrare in conflitto. La famiglia di casi del problema del carrello è stata centrale in questa ricerca empirica dagli anni '80.",
    researchSources: [
      {
        title: 'Experimental Moral Philosophy',
        institution: 'Stanford Encyclopedia of Philosophy',
        url: 'https://plato.stanford.edu/entries/experimental-moral/',
      },
      {
        title: 'Moral Cognition Research',
        institution: 'Harvard University (Joshua Greene)',
        url: 'https://www.joshua-greene.net/research/moral-cognition',
      },
    ],
    status: 'published',
    noindexUntilReady: false,
  },
  {
    slug: 'etica-arte-ai',
    locale: 'it',
    alternateSlug: 'ai-art-ethics',
    topic: 'Etica dell\'Arte AI',
    searchIntent: 'etica arte ai, ai generativa autore, copyright arte ai, dilemmi morali arte generata da ai',
    tension: 'dati di addestramento raccolti senza consenso vs la legittimità artistica di un\'opera che nessuno ha scritto',
    headline: 'Etica dell\'Arte AI — A chi appartiene l\'opera fatta dalla macchina?',
    intro:
      'I modelli generativi producono dipinti, musica e prosa a costo quasi zero. I dati di addestramento, in molti casi, sono stati raccolti da artisti che non hanno mai dato il consenso e non sono mai stati pagati. La risposta legale è incerta tra giurisdizioni, ma la domanda etica è più tagliente: se il modello ha imparato lo stile di un artista vivente e ora qualcuno vende output in quello stile, cosa significa "autore"? E quando il risultato è tecnicamente nuovo ma riconoscibilmente derivativo, chi paga il costo morale — l\'utente, chi ha costruito il modello, o la piattaforma che lo ospita?',
    primaryScenarioId: 'ai-art-copyright',
    relatedScenarioIds: ['deepfake-expose', 'ai-replaces-jobs', 'self-driving-crash'],
    relatedTopicSlugs: ['dilemmi-etici-intelligenza-artificiale', 'etica-della-privacy', 'consequenzialismo'],
    researchNote:
      'Cause legali in corso negli Stati Uniti e nell\'UE stanno verificando se addestrare un modello su opere protette da copyright sia "fair use" o violazione. Stanford CRFM e l\'EU AI Act trattano entrambi la provenienza dei dati di addestramento come questione di primo piano; la domanda morale sull\'imitazione stilistica corre avanti a quella legale.',
    researchSources: [
      {
        title: 'Generative AI and the Future of Copyright',
        institution: 'Stanford Center for Research on Foundation Models',
        url: 'https://crfm.stanford.edu/',
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

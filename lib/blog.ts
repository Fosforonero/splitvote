const BASE = 'https://splitvote.io'

export type SectionType =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'cta'; label: string; href: string }
  | { type: 'disclaimer'; text: string }

export interface BlogPost {
  slug: string
  locale: 'en' | 'it'
  title: string
  seoTitle: string
  description: string
  seoDescription: string
  date: string
  readingTime: number
  tags: string[]
  relatedDilemmaIds: string[]
  alternateSlug?: string
  content: SectionType[]
}

const EN_POSTS: BlogPost[] = [
  {
    slug: 'what-is-a-moral-dilemma',
    locale: 'en',
    title: 'What Is a Moral Dilemma?',
    seoTitle: 'What Is a Moral Dilemma? Definition, Examples & Why They Matter',
    description:
      'A moral dilemma is a situation where every choice has a cost. No option is clean. Understanding them reveals what you actually value.',
    seoDescription:
      'Learn what a moral dilemma is, why they have no right answer, and why facing them reveals your true values. With real examples and interactive dilemmas to try.',
    date: '2026-04-27',
    readingTime: 3,
    tags: ['ethics', 'philosophy', 'moral psychology'],
    relatedDilemmaIds: ['trolley', 'cure-secret', 'memory-erase'],
    alternateSlug: 'cos-e-un-dilemma-morale',
    content: [
      {
        type: 'p',
        text: 'A moral dilemma is a situation where you must choose between two options — and both carry real costs. There is no clean answer, no option that leaves you without some form of loss or compromise.',
      },
      {
        type: 'p',
        text: "That's what makes them so uncomfortable. And so revealing.",
      },
      {
        type: 'h2',
        text: 'What makes it a dilemma, not just a hard choice?',
      },
      {
        type: 'p',
        text: 'A hard choice might have a clearly better option that is simply difficult to take. A true moral dilemma has competing values in direct conflict: loyalty vs. honesty, saving lives vs. respecting autonomy, the individual vs. the collective.',
      },
      {
        type: 'p',
        text: 'Classic examples include the trolley problem (save five by sacrificing one?), whistleblowing scenarios (loyalty to employer vs. public interest), or end-of-life care decisions where multiple ethical principles pull in opposite directions.',
      },
      {
        type: 'h2',
        text: 'Why moral dilemmas matter',
      },
      {
        type: 'list',
        items: [
          'They expose your actual values — not the ones you think you have',
          'They show where two reasonable people can disagree without either being wrong',
          'They are the foundation of serious ethical reasoning in law, medicine, and politics',
        ],
      },
      {
        type: 'h2',
        text: 'Try one now',
      },
      {
        type: 'p',
        text: 'The best way to understand a moral dilemma is to face one. See how your gut reacts before your reasoning catches up — then compare your answer with people from around the world.',
      },
      {
        type: 'cta',
        label: 'Browse moral dilemmas →',
        href: '/category/morality',
      },
      {
        type: 'disclaimer',
        text: 'Educational content, not professional advice.',
      },
    ],
  },
  {
    slug: 'trolley-problem-explained',
    locale: 'en',
    title: 'The Trolley Problem, Explained',
    seoTitle: 'The Trolley Problem Explained — History, Variants & What People Choose',
    description:
      'The trolley problem is the most famous thought experiment in moral philosophy. Here is where it came from, what the variants reveal, and what people actually choose.',
    seoDescription:
      'Understand the trolley problem: its origin with Philippa Foot, the footbridge variant, and what global surveys reveal about how people reason about life and death.',
    date: '2026-04-27',
    readingTime: 4,
    tags: ['trolley problem', 'ethics', 'philosophy', 'classic dilemmas'],
    relatedDilemmaIds: ['trolley', 'organ-harvest'],
    alternateSlug: 'problema-del-carrello-spiegato',
    content: [
      {
        type: 'p',
        text: 'A runaway trolley is heading toward five people tied to the tracks. You can pull a lever to divert it — but there is one person on the side track. Do you pull the lever?',
      },
      {
        type: 'p',
        text: "This thought experiment was introduced by philosopher Philippa Foot in 1967. It became one of the most studied cases in moral philosophy — and one of the most argued about at dinner tables.",
      },
      {
        type: 'h2',
        text: 'The original question',
      },
      {
        type: 'p',
        text: "Foot's version asked whether it is ever permissible to do harm in order to prevent greater harm. Pulling the lever kills one person to save five — is that acceptable? Most people say yes. Saving five at the cost of one feels like straightforward arithmetic.",
      },
      {
        type: 'h2',
        text: 'The footbridge variant',
      },
      {
        type: 'p',
        text: 'Philosopher Judith Jarvis Thomson later introduced a twist: instead of a lever, imagine you are on a bridge above the tracks. You could push a large man off the bridge — his body would stop the trolley, saving the five. The math is identical: one dies, five survive. But almost everyone refuses.',
      },
      {
        type: 'p',
        text: 'This asymmetry is the interesting part. Same outcome, dramatically different moral intuitions. Why?',
      },
      {
        type: 'h2',
        text: 'What the research shows',
      },
      {
        type: 'list',
        items: [
          'In large surveys, roughly 85% of people pull the lever — but only ~30% push the man',
          'The difference maps onto deontological thinking (do not use a person as a means) vs. consequentialist thinking (minimize harm)',
          'Culture, age, and framing all shift the numbers',
        ],
      },
      {
        type: 'h2',
        text: 'What would you choose?',
      },
      {
        type: 'p',
        text: 'SplitVote collects real votes on the trolley problem from people around the world. See where you land — and where the global split sits today.',
      },
      {
        type: 'cta',
        label: 'Vote on the trolley problem →',
        href: '/play/trolley',
      },
      {
        type: 'h2',
        text: 'The two ways of thinking that the trolley problem reveals',
      },
      {
        type: 'p',
        text: 'The split between pulling the lever and pushing the man tracks a real divide in moral philosophy. People who pull but refuse to push tend to reason consequentially in some situations and deontologically in others — and the trolley problem is precisely the test case that reveals where their line sits.',
      },
      {
        type: 'cta',
        label: 'Consequentialism: the math behind pulling the lever →',
        href: '/blog/consequentialism-the-greatest-good',
      },
      {
        type: 'cta',
        label: 'Deontology: why pushing the man feels different →',
        href: '/blog/deontology-some-things-are-always-wrong',
      },
      {
        type: 'cta',
        label: 'Doing vs allowing harm: why the distinction matters →',
        href: '/blog/doing-vs-allowing-harm',
      },
      {
        type: 'disclaimer',
        text: 'Educational content, not professional advice.',
      },
    ],
  },
  {
    slug: 'why-people-love-impossible-choices',
    locale: 'en',
    title: 'Why People Love Impossible Choices',
    seoTitle: 'Why People Love Impossible Choices — The Psychology of Moral Dilemmas',
    description:
      'Moral dilemmas are uncomfortable — yet people cannot stop sharing them. Here is what psychology says about why impossible choices are so compelling.',
    seoDescription:
      'Why do moral dilemmas go viral? Explore the psychology behind cognitive conflict, social comparison, and identity expression that makes impossible choices irresistible to share.',
    date: '2026-04-27',
    readingTime: 3,
    tags: ['psychology', 'moral psychology', 'social sharing'],
    relatedDilemmaIds: ['trolley', 'memory-erase', 'cure-secret'],
    alternateSlug: 'perche-ci-piacciono-le-scelte-impossibili',
    content: [
      {
        type: 'p',
        text: 'You have seen them everywhere: "Would you rather…" posts, trolley problem debates, lifeboat scenarios. People do not just read them — they argue about them for hours.',
      },
      {
        type: 'p',
        text: 'What makes a question with no right answer so captivating?',
      },
      {
        type: 'h2',
        text: 'They create cognitive conflict',
      },
      {
        type: 'p',
        text: 'When a question has no clear answer, your brain works harder. That cognitive effort creates engagement — you feel the stakes, you feel pulled in multiple directions at once. The discomfort is difficult to walk away from.',
      },
      {
        type: 'h2',
        text: 'They work as social mirrors',
      },
      {
        type: 'p',
        text: 'Seeing that 62% of people chose differently from you is surprising, sometimes unsettling. It forces a question: why do we reason differently about the same situation? That kind of social comparison is hard to resist.',
      },
      {
        type: 'h2',
        text: 'They reveal what you actually value',
      },
      {
        type: 'p',
        text: 'In everyday life, stated values and actual behavior frequently diverge. Moral dilemmas cut through: they force you to prioritize one value over another in a concrete way that abstract principles cannot. Your choice tells you something real about yourself.',
      },
      {
        type: 'h2',
        text: 'They are inherently shareable',
      },
      {
        type: 'p',
        text: 'Ambiguity drives conversation. There is no way to "win" by sharing your answer to a moral dilemma — which means everyone can engage without feeling judged. Low barrier, high conversation value.',
      },
      {
        type: 'h2',
        text: 'See what the world chooses',
      },
      {
        type: 'p',
        text: 'SplitVote collects real-time votes on hundreds of moral dilemmas. No commentary, no opinions — just data on what people actually choose when forced to pick a side.',
      },
      {
        type: 'cta',
        label: 'See what is trending →',
        href: '/trending',
      },
      {
        type: 'disclaimer',
        text: 'Educational content, not professional advice.',
      },
    ],
  },
  {
    slug: 'hard-would-you-rather-questions',
    locale: 'en',
    title: '40+ Hard Would You Rather Questions With No Easy Answer',
    seoTitle: '40+ Hard Would You Rather Questions With No Easy Answer',
    description:
      'Hard would you rather questions grouped by theme — relationships, money, morality, survival. Vote on each one and see how people worldwide chose.',
    seoDescription:
      'Hard would you rather questions grouped by theme — relationships, money, morality, survival. Vote on each one and see how people worldwide chose.',
    date: '2026-04-27',
    readingTime: 8,
    tags: ['would you rather', 'hard questions', 'moral dilemmas'],
    relatedDilemmaIds: ['trolley', 'lifeboat', 'truth-friend', 'organ-harvest', 'memory-erase', 'cure-secret'],
    alternateSlug: 'domande-would-you-rather-difficili',
    content: [
      {
        type: 'p',
        text: "These aren't trick questions. They're designed so that both answers make sense — and you have to choose anyway.",
      },
      {
        type: 'p',
        text: '40+ hard would you rather questions, grouped by theme. Vote on any of them and see exactly where other users land.',
      },
      {
        type: 'cta',
        label: 'Browse moral dilemmas →',
        href: '/moral-dilemmas',
      },
      {
        type: 'cta',
        label: 'Browse would you rather questions →',
        href: '/would-you-rather-questions',
      },
      {
        type: 'h2',
        text: 'Relationships',
      },
      {
        type: 'list',
        items: [
          'Would you rather know every time someone lies to you — or trust everyone completely and never feel paranoid?',
          'Would you rather have a perfect partner who bores you, or a difficult partner who makes every day feel alive?',
          'Would you rather lose your best friend permanently, or the most important romantic relationship of your life?',
          'Would you rather stay in a comfortable relationship you know ends in 10 years, or leave now and search for something better with no guarantee?',
          'Would you rather have a partner who loves you more than you love them — or one you love more than they love you?',
          'Would you rather always be completely honest, even when it costs you the relationship — or protect people with carefully chosen words?',
          'Would you rather find out your partner lied to protect you, or that they told you a hard truth that hurt you?',
          'Would you rather know what every person in your life truly thinks of you — or never know?',
          'Would you rather know every person who has ever had feelings for you — or everyone who currently resents you?',
        ],
      },
      {
        type: 'cta',
        label: 'Truth vs. loyalty — vote the dilemma →',
        href: '/play/truth-friend',
      },
      {
        type: 'h2',
        text: 'Money & Status',
      },
      {
        type: 'list',
        items: [
          'Would you rather earn double your salary doing work you hate, or your current salary doing work you love?',
          "Would you rather be the richest person in a town where no one knows your name, or a comfortable, respected figure somewhere that matters?",
          'Would you rather lose all your savings today, or lose half your income forever?',
          'Would you rather give up all social media for 5 years and receive €50,000 — or keep your accounts?',
          'Would you rather inherit a fortune from someone you despised, or build modest wealth entirely through your own effort?',
          "Would you rather always know everyone's salary around you — or never know?",
          'Would you rather be famous for something controversial, or completely forgotten after you die?',
          'Would you rather be the most successful person in a small town, or an average person in a city you care about?',
        ],
      },
      {
        type: 'cta',
        label: 'Impossible trade-offs — vote more scenarios →',
        href: '/would-you-rather-questions',
      },
      {
        type: 'h2',
        text: 'Morality & Ethics',
      },
      {
        type: 'list',
        items: [
          'Would you rather save five strangers or the one person you love most — if you could only choose?',
          'Would you rather report a close friend for a serious crime you witnessed, or stay silent to protect them?',
          'Would you rather always tell the complete truth — even when it destroys relationships — or be able to choose what to say when it matters?',
          'Would you rather know the exact date of your death, or the exact cause?',
          'Would you rather live in a perfectly just society with heavily restricted freedom, or a free society with deep inequality?',
          'Would you rather be forced to make one life-or-death decision for a stranger, or have a stranger make one for you?',
          'Would you rather end suffering for 1,000 people today, or prevent it for 1,000,000 people fifty years from now?',
          'Would you rather have your actions judged only by your intentions — or only by their outcomes?',
          'Would you rather take one life to save ten — or refuse, and let all ten die?',
        ],
      },
      {
        type: 'cta',
        label: 'The hardest version of this: the Trolley Problem →',
        href: '/play/trolley',
      },
      {
        type: 'cta',
        label: 'Same logic, medical stakes: organ harvest dilemma →',
        href: '/play/organ-harvest',
      },
      {
        type: 'h2',
        text: 'Survival & Sacrifice',
      },
      {
        type: 'list',
        items: [
          "Would you rather survive alone on a deserted island for one year, or spend that same year in a small apartment with two strangers you can't stand?",
          'Would you rather lose your dominant hand or your dominant eye?',
          'Would you rather know a catastrophe is coming in 10 years with no way to stop it — or be completely surprised?',
          'Would you rather be immune to disease but feel chronic low-level pain, or be perfectly healthy but age twice as fast after 40?',
          "Would you rather always be the one who survives disasters, knowing others around you won't — or always be the one in most danger?",
          "Would you rather save your pet or a stranger's young child in a fire, if you could only save one?",
          'Would you rather face your biggest fear once and have it disappear forever — or avoid it for the rest of your life?',
        ],
      },
      {
        type: 'cta',
        label: 'Who survives the lifeboat — vote the scenario →',
        href: '/play/lifeboat',
      },
      {
        type: 'h2',
        text: 'Identity & Future',
      },
      {
        type: 'list',
        items: [
          'Would you rather live 40 more years with your memories intact, or 80 more years starting completely fresh — no memory of who you were?',
          'Would you rather see 10 years into your future once — or change one decision from your past?',
          'Would you rather erase your most painful memory, knowing it would change who you are — or keep it?',
          "Would you rather know the exact moment you'll fall in love again, or be completely surprised?",
          'Would you rather have your most embarrassing moment widely known — or your biggest regret?',
          'Would you rather swap lives with someone for one week (no going back) — or swap bodies for exactly 24 hours?',
          "Would you rather always know when you're being judged — or never know?",
        ],
      },
      {
        type: 'cta',
        label: 'Would you erase yourself to feel better? →',
        href: '/play/memory-erase',
      },
      {
        type: 'h2',
        text: 'Why These Questions Work',
      },
      {
        type: 'p',
        text: 'Hard would you rather questions are built on real moral tension. Neither option is wrong. Both have a cost.',
      },
      {
        type: 'p',
        text: "The interesting part isn't your answer. It's seeing that someone else chose the opposite — and can explain exactly why.",
      },
      {
        type: 'p',
        text: 'On SplitVote, every one of these is a live vote. Some splits are 90/10. Others sit at 48/52 for months.',
      },
      {
        type: 'p',
        text: 'Want to see how people really choose? Try SplitVote and compare your answers with users worldwide.',
      },
      {
        type: 'cta',
        label: 'Start voting — no account needed →',
        href: '/play/trolley',
      },
      {
        type: 'disclaimer',
        text: 'Educational content, not professional advice.',
      },
    ],
  },
  {
    slug: 'trolley-problem-statistics',
    locale: 'en',
    title: 'The Trolley Problem: Poll Results and How People Vote',
    seoTitle: 'The Trolley Problem: Poll Results and How People Vote',
    description:
      "How do people actually vote on the trolley problem? SplitVote poll results across the classic version and its variants. No science — just real votes.",
    seoDescription:
      "How do people actually vote on the trolley problem? SplitVote poll results across the classic version and its variants. No science — just real votes.",
    date: '2026-04-27',
    readingTime: 5,
    tags: ['trolley problem', 'poll results', 'ethics', 'moral dilemmas'],
    alternateSlug: 'statistiche-problema-del-carrello',
    relatedDilemmaIds: ['trolley', 'organ-harvest', 'lifeboat', 'cure-secret', 'memory-erase', 'truth-friend'],
    content: [
      {
        type: 'p',
        text: "Most people are confident they know what they'd do. Then they vote — and the split surprises them.",
      },
      {
        type: 'p',
        text: 'The trolley problem is one of the most-voted moral dilemmas on SplitVote. The results shift significantly across variants, and the reasons people give for each choice are more revealing than the numbers.',
      },
      {
        type: 'cta',
        label: 'What is a moral dilemma? →',
        href: '/moral-dilemmas',
      },
      {
        type: 'cta',
        label: 'Browse would you rather questions →',
        href: '/would-you-rather-questions',
      },
      {
        type: 'h2',
        text: 'What the Trolley Problem Actually Asks',
      },
      {
        type: 'p',
        text: "A runaway trolley is heading toward five people tied to the track. You're next to a lever. Pull it, and the trolley diverts to a side track — where one person is tied.",
      },
      {
        type: 'p',
        text: 'Five lives saved. One lost. By your direct action.',
      },
      {
        type: 'p',
        text: "Or: don't pull. Five people die. You didn't cause it.",
      },
      {
        type: 'p',
        text: 'No hidden details. No escape clause. You have to choose.',
      },
      {
        type: 'cta',
        label: 'Vote on the Trolley Problem — see the live split →',
        href: '/play/trolley',
      },
      {
        type: 'h2',
        text: 'Poll Results: The Classic Version',
      },
      {
        type: 'p',
        text: 'All figures below are SplitVote poll results — not scientific research. Results update in real time as more people vote.',
      },
      {
        type: 'p',
        text: "The split is tighter than most people predict before voting. Before trying it, most assume something like 85–90% pull the lever. The live results tell a different story.",
      },
      {
        type: 'p',
        text: "The most consistent reason given by users who don't pull: \"I won't actively cause someone's death, even to save more people. That line matters to me.\"",
      },
      {
        type: 'cta',
        label: 'See the current live split →',
        href: '/play/trolley',
      },
      {
        type: 'h2',
        text: 'Variants That Shift the Vote',
      },
      {
        type: 'p',
        text: "The trolley problem changes completely when one detail changes. Each version below is a live vote — try them and compare.",
      },
      {
        type: 'h3',
        text: 'The footbridge variant',
      },
      {
        type: 'p',
        text: "Instead of a lever, you're on a bridge. The only way to stop the trolley is to push a large person into its path. Same math — 1 life for 5 — different action.",
      },
      {
        type: 'p',
        text: "The drop from the lever version is significant. The closest SplitVote scenario to this logic involves the same ethical trade-off in a medical context.",
      },
      {
        type: 'cta',
        label: 'Vote the organ harvest dilemma →',
        href: '/play/organ-harvest',
      },
      {
        type: 'h3',
        text: 'The organ harvest variant',
      },
      {
        type: 'p',
        text: "A surgeon can save five patients by taking organs from one healthy person without consent. Identical arithmetic to the trolley. Very different vote.",
      },
      {
        type: 'cta',
        label: 'See the current live split →',
        href: '/play/organ-harvest',
      },
      {
        type: 'h3',
        text: 'The personal variant',
      },
      {
        type: 'p',
        text: "Same trolley. But the person on the side track is someone you know. Does that change your answer? Personal connection consistently shifts the numbers.",
      },
      {
        type: 'cta',
        label: 'Vote the trolley problem →',
        href: '/play/trolley',
      },
      {
        type: 'h3',
        text: 'The inaction variant',
      },
      {
        type: 'p',
        text: "You're not at the lever. Someone else could pull it but won't. Do you intervene? Overriding another person's inaction gets its own distinct result.",
      },
      {
        type: 'cta',
        label: 'Vote the trolley problem →',
        href: '/play/trolley',
      },
      {
        type: 'h2',
        text: '10 Related Dilemmas and Their Live Splits',
      },
      {
        type: 'p',
        text: 'These are all real scenarios on SplitVote, each built on the same core tension as the trolley problem. Results are poll data — not research.',
      },
      {
        type: 'list',
        items: [
          "Organ Harvest — harvest one healthy person's organs to save five patients.",
          'Lifeboat — 8 spots, 12 survivors. Who decides who boards?',
          'Cure Secret — a cure exists for a fatal disease, but using it requires an action most people consider unacceptable.',
          'Memory Erase — delete your most painful memory, but it changes who you are permanently.',
          'Truth Friend — your best friend wants complete honesty about something that will hurt them.',
          'Mandatory Vaccine — should vaccination be legally required to protect people who cannot receive it themselves?',
          'Whistleblower — you discover serious wrongdoing at your company. Reporting it will cost you your career.',
          'Death Row Exonerated — a prisoner proven innocent two days before execution. Releasing them triggers riots that kill ten people.',
          'Surveillance City — city-wide surveillance cuts violent crime significantly, but records everyone, everywhere.',
          'AI Replaces Jobs — an AI system eliminates your industry within 5 years, but reduces costs for everyone else.',
        ],
      },
      {
        type: 'cta',
        label: 'Vote the organ harvest dilemma →',
        href: '/play/organ-harvest',
      },
      {
        type: 'cta',
        label: 'Vote the lifeboat dilemma →',
        href: '/play/lifeboat',
      },
      {
        type: 'cta',
        label: 'Vote the cure secret dilemma →',
        href: '/play/cure-secret',
      },
      {
        type: 'cta',
        label: 'Vote the memory erase dilemma →',
        href: '/play/memory-erase',
      },
      {
        type: 'cta',
        label: 'Vote the truth friend dilemma →',
        href: '/play/truth-friend',
      },
      {
        type: 'h2',
        text: "Why the Split Doesn't Close",
      },
      {
        type: 'p',
        text: "The trolley problem has been debated for decades. The core tension doesn't resolve because it exposes a genuine conflict between two ethical positions most people hold at the same time.",
      },
      {
        type: 'p',
        text: 'Consequentialism: outcomes are what matter. 5 > 1. Pull the lever.',
      },
      {
        type: 'p',
        text: "Deontology: some actions are wrong regardless of outcome. Using a person as a means violates something fundamental. Don't pull.",
      },
      {
        type: 'p',
        text: "Most people aren't one or the other. They're both. The trolley problem shows where the balance breaks.",
      },
      {
        type: 'p',
        text: 'What the SplitVote poll results show is that this split is remarkably consistent. The tension is not cultural. It is human.',
      },
      {
        type: 'p',
        text: 'Want to see how people really choose? Try SplitVote and compare your answers with users worldwide.',
      },
      {
        type: 'cta',
        label: 'Vote on the Trolley Problem — live results →',
        href: '/play/trolley',
      },
      {
        type: 'disclaimer',
        text: 'SplitVote poll results represent user votes only — not scientific research. All scenarios are hypothetical. Not professional ethical or psychological advice.',
      },
    ],
  },
  {
    slug: 'ethical-dilemmas-everyday-life',
    locale: 'en',
    title: 'Ethical Dilemmas in Everyday Life: 12 Real Situations',
    seoTitle: 'Ethical Dilemmas in Everyday Life — 12 Real Situations',
    description:
      'Most ethical dilemmas don\'t happen in philosophy papers. They happen at work, in friendships, in families — where two values you actually hold are in direct conflict.',
    seoDescription:
      'Ethical dilemmas don\'t only happen in philosophy. Here are 12 everyday situations where two values conflict — and how people around the world vote on them.',
    date: '2026-04-28',
    readingTime: 4,
    tags: ['ethics', 'ethical dilemmas', 'everyday life', 'moral choices'],
    relatedDilemmaIds: ['truth-friend', 'whistleblower', 'report-friend', 'sibling-secret', 'confess-crime', 'love-or-career'],
    alternateSlug: 'dilemma-etico-vita-quotidiana',
    content: [
      {
        type: 'p',
        text: 'Most ethical dilemmas don\'t appear in philosophy papers. They appear in ordinary situations: a colleague asks you to cover for them, a friend shares something in confidence that someone else needs to know, your boss asks you to present results in a way that obscures the truth.',
      },
      {
        type: 'p',
        text: 'These are real ethical dilemmas. Not trolley problems — no one is tied to railroad tracks — but situations where two values you genuinely hold are pulling in opposite directions.',
      },
      {
        type: 'h2',
        text: 'What makes something an ethical dilemma',
      },
      {
        type: 'p',
        text: 'A choice becomes an ethical dilemma when both options are defensible, and picking one means compromising something you also care about. It is not about good versus evil. It is about honesty versus loyalty, fairness versus compassion, or protecting someone versus telling the truth.',
      },
      {
        type: 'h2',
        text: 'At Work',
      },
      {
        type: 'list',
        items: [
          'Your manager asks you to present data in a way that technically isn\'t false — but is clearly designed to mislead the audience. Do you push back?',
          'A colleague is underperforming and affecting the team, but they are going through something serious personally. Do you raise it with management?',
          'You discover an error on a project that others made before you joined. Fixing it will cause delays and embarrass people you respect. Do you flag it?',
          'A trusted colleague has been claiming credit for work that isn\'t theirs. They are also a friend. Do you say something?',
        ],
      },
      {
        type: 'cta',
        label: 'Would you report your colleague? Vote →',
        href: '/play/whistleblower',
      },
      {
        type: 'h2',
        text: 'In Friendships and Relationships',
      },
      {
        type: 'list',
        items: [
          'Your closest friend asks your honest opinion about a major decision — leaving a relationship, changing careers, moving cities. You think they\'re making a mistake. What do you say?',
          'You find out that your friend\'s partner is being unfaithful. Your friend has no idea. They never asked for your opinion. Do you tell them?',
          'A close friend confides they have done something illegal — not serious, but not trivial. You are the only person who knows. Do you stay quiet?',
          'Someone in your friend group is saying very different things about a mutual friend behind their back. Do you say something, or is it not your place?',
        ],
      },
      {
        type: 'cta',
        label: 'Complete honesty or protecting the friendship? Vote →',
        href: '/play/truth-friend',
      },
      {
        type: 'h2',
        text: 'With Family',
      },
      {
        type: 'list',
        items: [
          'Your sibling asks you to keep something serious from your parents. You believe your parents should know. Who does your loyalty belong to?',
          'A family member asks you to vouch for them in a situation where you have real doubts. Saying yes protects them short-term. Saying no is honest — but carries real consequences.',
          'You find out a family member has been hiding a serious problem — financial, health-related, or personal. They clearly don\'t want to discuss it. Do you bring it up or respect the silence?',
        ],
      },
      {
        type: 'cta',
        label: 'A sibling\'s secret — vote the scenario →',
        href: '/play/sibling-secret',
      },
      {
        type: 'h2',
        text: 'In Society',
      },
      {
        type: 'list',
        items: [
          'You witness someone do something harmful — not illegal, but something that genuinely damaged another person. Do you say something publicly, or let it go?',
          'You have information that could help someone who wronged you. It costs you nothing to share it, but withholding it would cost them something significant. What do you do?',
          'A policy you believe in is applied in a way that harms people you care about. You support the goal but not the method. Do you speak up, or stay aligned with the cause?',
        ],
      },
      {
        type: 'cta',
        label: 'Browse all dilemmas →',
        href: '/moral-dilemmas',
      },
      {
        type: 'h2',
        text: 'Why everyday dilemmas are harder than thought experiments',
      },
      {
        type: 'p',
        text: 'The trolley problem is unsettling because it is extreme. But real dilemmas are harder because they involve people you know, stakes you care about, and consequences that follow you.',
      },
      {
        type: 'p',
        text: 'On SplitVote, the dilemmas that split people most closely are almost never the abstract philosophical ones. They are the ones that feel familiar — a friend, a workplace situation, a family moment. The vote is close because the conflict is real.',
      },
      {
        type: 'p',
        text: 'The most honest test of what you value is not a thought experiment. It is an ordinary Tuesday.',
      },
      {
        type: 'cta',
        label: 'Start voting — no account needed →',
        href: '/play/truth-friend',
      },
      {
        type: 'h2',
        text: 'Three frameworks that help you think about these dilemmas',
      },
      {
        type: 'p',
        text: 'When two values you actually hold are pulling in opposite directions, three classic ethical frameworks each offer a different lens — focused on outcomes, on rules, or on character.',
      },
      {
        type: 'cta',
        label: 'Consequentialism: what produces the most good? →',
        href: '/blog/consequentialism-the-greatest-good',
      },
      {
        type: 'cta',
        label: 'Deontology: what duties always hold? →',
        href: '/blog/deontology-some-things-are-always-wrong',
      },
      {
        type: 'cta',
        label: 'Virtue ethics: what would a good person do? →',
        href: '/blog/virtue-ethics-what-would-a-good-person-do',
      },
      {
        type: 'disclaimer',
        text: 'Educational content, not professional advice.',
      },
    ],
  },
  {
    slug: 'what-is-splitvote',
    locale: 'en',
    title: 'What Is SplitVote?',
    seoTitle: 'What Is SplitVote? How Moral Dilemma Voting Works',
    description:
      'SplitVote is a platform where you vote on moral dilemmas and see how the rest of the world answered. No lectures, no right answers — just real splits.',
    seoDescription:
      'SplitVote is a voting platform for moral dilemmas. Vote anonymously, see live results, and discover your moral personality profile. No account required.',
    date: '2026-05-04',
    readingTime: 3,
    tags: ['splitvote', 'how it works', 'moral dilemmas'],
    relatedDilemmaIds: ['trolley', 'self-driving-crash', 'cover-accident'],
    alternateSlug: 'cos-e-splitvote',
    content: [
      {
        type: 'p',
        text: 'SplitVote is a platform built around one idea: moral dilemmas reveal things about you that abstract questions do not. Not personality quizzes. Not surveys. A vote between two real options — each with a genuine cost.',
      },
      {
        type: 'p',
        text: "Every question on SplitVote is a genuine dilemma. There is no objectively right answer. The point is to choose — and then see how the rest of the world landed.",
      },
      {
        type: 'h2',
        text: 'How it works',
      },
      {
        type: 'list',
        items: [
          'Pick a dilemma — classic philosophy thought experiments, AI ethics puzzles, everyday loyalty conflicts.',
          'Choose one of two options. No explanation required.',
          'See the live result: how the split breaks down among everyone who voted.',
          'Vote on more dilemmas to build up your moral personality profile.',
        ],
      },
      {
        type: 'cta',
        label: 'Try your first dilemma →',
        href: '/play/trolley',
      },
      {
        type: 'h2',
        text: 'What you get from voting',
      },
      {
        type: 'p',
        text: 'Each vote updates live result percentages. Some dilemmas split almost exactly 50/50. Others go 80/20. Both are interesting — for different reasons.',
      },
      {
        type: 'p',
        text: 'After three or more votes, you can sign in to unlock your moral personality profile: which of 18 archetypes fits your pattern of choices best.',
      },
      {
        type: 'cta',
        label: 'See trending dilemmas →',
        href: '/trending',
      },
      {
        type: 'h2',
        text: 'Who is it for?',
      },
      {
        type: 'p',
        text: 'Anyone who finds it interesting to sit with a hard choice. There are no prizes, no rankings, no social pressure. Just dilemmas and live data from real people who voted.',
      },
      {
        type: 'p',
        text: 'You can vote without an account. Results are public. SplitVote is an independent project based in Italy.',
      },
      {
        type: 'cta',
        label: 'About SplitVote →',
        href: '/about',
      },
      {
        type: 'disclaimer',
        text: 'SplitVote is for entertainment and aggregate curiosity — not a scientific study or psychological assessment.',
      },
    ],
  },
  {
    slug: 'how-anonymous-voting-works',
    locale: 'en',
    title: 'How Anonymous Voting Works on SplitVote',
    seoTitle: 'How Anonymous Voting Works on SplitVote — Privacy Explained',
    description:
      'You can vote on SplitVote without an account. How the platform handles votes, what a cookie does, and what happens when you sign in.',
    seoDescription:
      'How does SplitVote handle your vote? Vote without an account. Anonymous votes use a local cookie. Sign in to keep your history and personality profile.',
    date: '2026-05-04',
    readingTime: 3,
    tags: ['privacy', 'anonymous voting', 'how it works'],
    relatedDilemmaIds: ['trolley', 'cover-accident', 'whistleblower'],
    alternateSlug: 'come-funziona-il-voto-anonimo',
    content: [
      {
        type: 'p',
        text: 'You can vote on SplitVote without creating an account. No email address, no registration — just pick a side and see the result.',
      },
      {
        type: 'h2',
        text: 'What happens when you vote without an account',
      },
      {
        type: 'p',
        text: "Anonymous votes use a local cookie stored in your browser. This is how SplitVote recognises that the same browser has already voted on a dilemma — so your vote isn't counted twice if you reload the page.",
      },
      {
        type: 'p',
        text: 'The cookie stays on your device. It is not tied to your name, email, or any external identity. Clearing your browser cookies removes it.',
      },
      {
        type: 'h2',
        text: 'What the results show',
      },
      {
        type: 'p',
        text: 'Result percentages show the aggregate split — how all votes cast on a dilemma broke down between option A and option B. They do not reveal who chose which side.',
      },
      {
        type: 'cta',
        label: 'See live results on the trolley problem →',
        href: '/results/trolley',
      },
      {
        type: 'h2',
        text: 'What changes when you sign in',
      },
      {
        type: 'p',
        text: 'If you sign in, SplitVote can keep your vote history and personality progress in your account. This lets you see your moral personality profile across all the dilemmas you have voted on.',
      },
      {
        type: 'p',
        text: "Signing in is optional. The core vote-and-see-results experience does not require an account.",
      },
      {
        type: 'cta',
        label: 'Read our full Privacy Policy →',
        href: '/privacy',
      },
      {
        type: 'disclaimer',
        text: 'For complete details on what data SplitVote collects and how it is used, read the Privacy Policy at splitvote.io/privacy.',
      },
    ],
  },
  {
    slug: 'how-to-read-splitvote-results',
    locale: 'en',
    title: 'How to Read SplitVote Results',
    seoTitle: 'How to Read SplitVote Results — What the Percentages Mean',
    description:
      'A SplitVote percentage shows how people who voted on this platform chose. Here is what to take from the data — and what to leave alone.',
    seoDescription:
      'What does a SplitVote percentage mean? How to read result splits, what drives 50/50 vs 80/20, and why results reflect SplitVote users, not all humans.',
    date: '2026-05-04',
    readingTime: 3,
    tags: ['results', 'how to read', 'data'],
    relatedDilemmaIds: ['trolley', 'organ-harvest', 'cover-accident'],
    alternateSlug: 'come-leggere-i-risultati-splitvote',
    content: [
      {
        type: 'p',
        text: "When you vote on a SplitVote dilemma, you see a percentage split. Here is what that number actually means — and what it doesn't.",
      },
      {
        type: 'h2',
        text: 'What the percentage represents',
      },
      {
        type: 'p',
        text: 'The percentage shows how all votes cast on that dilemma broke down between option A and option B. If the trolley problem shows 55% pull the lever and 45% do nothing, that is the distribution of votes from SplitVote users who answered.',
      },
      {
        type: 'p',
        text: "It is not a representative sample of all humans. It reflects the people who found and voted on this platform — which skews toward people who seek out moral dilemma content.",
      },
      {
        type: 'cta',
        label: 'See live results on a real dilemma →',
        href: '/results/trolley',
      },
      {
        type: 'h2',
        text: 'What a 50/50 split means',
      },
      {
        type: 'p',
        text: 'A near-equal split usually signals a genuine value conflict — two defensible positions with comparable weight. Neither side is obviously wrong. The dilemma is doing its job.',
      },
      {
        type: 'h2',
        text: 'What an 80/20 split means',
      },
      {
        type: 'p',
        text: "A strong majority in one direction can mean the framing favours one option, or that most people share a strong intuition on this specific question. It doesn't mean the minority is wrong — moral intuitions vary across cultures, age groups, and life experience.",
      },
      {
        type: 'h2',
        text: 'Vote count',
      },
      {
        type: 'p',
        text: "Results with a few dozen votes are early signals. Results with tens of thousands of votes are more stable — but still reflect SplitVote's audience, not a scientific survey.",
      },
      {
        type: 'h2',
        text: 'Personality and results',
      },
      {
        type: 'p',
        text: "Your votes feed into a moral personality profile. When you see your archetype, it reflects the pattern of your choices — not how you compare to a clinical standard. It is a mirror of your answers on this platform.",
      },
      {
        type: 'cta',
        label: 'See trending dilemmas →',
        href: '/trending',
      },
      {
        type: 'disclaimer',
        text: 'SplitVote result data reflects votes from SplitVote users, not a representative scientific sample. Results are for entertainment and aggregate curiosity only.',
      },
    ],
  },
  {
    slug: 'what-your-moral-personality-means',
    locale: 'en',
    title: 'What Your Moral Personality Profile Means',
    seoTitle: 'What Your Moral Personality Profile Means on SplitVote',
    description:
      'SplitVote assigns an archetype based on your votes across five moral dimensions. Here is what the axes measure and how to read your profile.',
    seoDescription:
      "What is a SplitVote moral personality archetype? The five moral dimensions, 18 archetypes, and what your profile does and doesn't claim.",
    date: '2026-05-04',
    readingTime: 4,
    tags: ['personality', 'moral profile', 'archetypes'],
    relatedDilemmaIds: ['trolley', 'cover-accident', 'whistleblower'],
    alternateSlug: 'cosa-significa-la-tua-personalita-morale',
    content: [
      {
        type: 'p',
        text: "After you vote on three or more dilemmas and sign in, SplitVote shows you a moral personality archetype. This is what it measures — and how to read it honestly.",
      },
      {
        type: 'h2',
        text: 'The five moral dimensions',
      },
      {
        type: 'p',
        text: 'SplitVote tracks your votes across five internal dimensions, inspired by how moral psychologists think about ethical reasoning:',
      },
      {
        type: 'list',
        items: [
          'Utility vs Principle — do you prioritise outcomes (consequentialist) or fixed rules (deontologist)?',
          'Freedom vs Safety — do you lean toward individual autonomy (libertarian) or protecting people from harm (paternalist)?',
          'Loyalty vs Justice — do you weight bonds to specific people (loyalist) or impartial rules that apply to everyone (universalist)?',
          'Risk vs Caution — do you accept uncertain costs to gain something (risk-taker) or prefer the safer, known path (conservative)?',
          'Individual vs Collective — do you prioritise what is best for a single person (individualist) or for the group (collectivist)?',
        ],
      },
      {
        type: 'p',
        text: "These five dimensions are SplitVote's own framing, inspired by decades of moral psychology research. They are not a direct implementation of any single academic theory.",
      },
      {
        type: 'h2',
        text: 'The 18 archetypes',
      },
      {
        type: 'p',
        text: 'Each archetype represents a pattern of scores across the five axes. The algorithm finds the archetype whose profile is closest to your own scores and assigns it to you.',
      },
      {
        type: 'p',
        text: "Your archetype is not a verdict. It is a pattern derived from the specific dilemmas you voted on on SplitVote. A different mix of dilemmas, or a different day, could produce a different result.",
      },
      {
        type: 'cta',
        label: 'See your moral profile →',
        href: '/personality',
      },
      {
        type: 'h2',
        text: 'What the profile does not claim',
      },
      {
        type: 'p',
        text: 'The moral personality profile is built for entertainment and self-reflection, not clinical classification. It does not predict behaviour, measure intelligence, or carry any psychological or diagnostic weight.',
      },
      {
        type: 'p',
        text: 'Researchers who study moral foundations — such as the work behind moralfoundations.org — use validated surveys and large representative samples. SplitVote dilemmas are designed for engagement, not academic measurement.',
      },
      {
        type: 'cta',
        label: 'Vote to build your profile →',
        href: '/play/trolley',
      },
      {
        type: 'h2',
        text: 'Want to go deeper into the theories?',
      },
      {
        type: 'p',
        text: 'The "Utility vs Principle" axis maps loosely onto the consequentialism vs deontology debate in moral philosophy. The "Loyalty vs Justice" axis touches questions that virtue ethics handles uniquely. None of the three frameworks is right or wrong — they each illuminate a different part of how people actually reason.',
      },
      {
        type: 'cta',
        label: 'Consequentialism: the ethics of outcomes →',
        href: '/blog/consequentialism-the-greatest-good',
      },
      {
        type: 'cta',
        label: 'Deontology: the ethics of duties →',
        href: '/blog/deontology-some-things-are-always-wrong',
      },
      {
        type: 'cta',
        label: 'Virtue ethics: the ethics of character →',
        href: '/blog/virtue-ethics-what-would-a-good-person-do',
      },
      {
        type: 'cta',
        label: 'Why good people disagree: Moral Foundations Theory explained →',
        href: '/blog/moral-foundations-theory-why-good-people-disagree',
      },
      {
        type: 'cta',
        label: 'How science studies moral intuitions →',
        href: '/blog/experimental-moral-psychology-how-science-studies-moral-intuitions',
      },
      {
        type: 'disclaimer',
        text: 'SplitVote archetypes are for entertainment and self-reflection only — not a psychological assessment, diagnostic tool, or scientific measure.',
      },
    ],
  },
  {
    slug: 'moral-dilemmas-examples',
    locale: 'en',
    title: 'Moral Dilemmas: 15 Real Examples and How the World Votes',
    seoTitle: 'Moral Dilemmas: 15 Real Examples and How the World Votes',
    description:
      "The most famous moral dilemmas with concrete examples — from the trolley problem to AI ethics. See live SplitVote poll results for each one.",
    seoDescription:
      "The most famous moral dilemmas with concrete examples — from the trolley problem to AI ethics. See live SplitVote poll results for each one.",
    date: '2026-04-27',
    readingTime: 6,
    tags: ['moral dilemmas', 'examples', 'ethics', 'philosophy'],
    alternateSlug: 'dilemmi-morali-esempi',
    relatedDilemmaIds: ['trolley', 'organ-harvest', 'lifeboat', 'cure-secret', 'memory-erase', 'truth-friend'],
    content: [
      {
        type: 'p',
        text: "A moral dilemma isn't just a hard problem. It's a situation where both choices are defensible — and you have to pick one anyway.",
      },
      {
        type: 'p',
        text: 'Here are 15 concrete examples of moral dilemmas — from classic philosophy to everyday situations. For each one, you can see how the world votes on SplitVote.',
      },
      {
        type: 'cta',
        label: 'Explore moral dilemmas →',
        href: '/moral-dilemmas',
      },
      {
        type: 'cta',
        label: 'Hard would you rather questions →',
        href: '/would-you-rather-questions',
      },
      {
        type: 'h2',
        text: 'What Makes a Real Moral Dilemma',
      },
      {
        type: 'p',
        text: "It's not enough for the choice to be difficult. A moral dilemma has three features: both options have real, significant consequences; neither is clearly wrong on ethical grounds; the choice reveals a conflict between genuine values — not between good and evil.",
      },
      {
        type: 'p',
        text: "Dilemmas don't exist to find the right answer. They exist to show which value wins when two values collide.",
      },
      {
        type: 'p',
        text: 'The SplitVote results in this article are user polls — not scientific research. Numbers update in real time.',
      },
      {
        type: 'h2',
        text: 'The Classics: Dilemmas That Have Lasted Decades',
      },
      {
        type: 'h3',
        text: '1. The Trolley Problem',
      },
      {
        type: 'p',
        text: "A runaway trolley is heading toward five people tied to the track. You can divert it to a side track where one person is tied. Do you pull the lever?",
      },
      {
        type: 'p',
        text: "The split is more balanced than most people expect before voting. See the live result on SplitVote.",
      },
      {
        type: 'cta',
        label: 'Vote the trolley problem →',
        href: '/play/trolley',
      },
      {
        type: 'h3',
        text: '2. The Organ Harvest',
      },
      {
        type: 'p',
        text: "A surgeon can save five dying patients by taking organs from one healthy patient without consent. The math is identical to the trolley problem. The votes tell a different story.",
      },
      {
        type: 'p',
        text: "The medical context shifts moral perception — even with identical numbers. See the live result on SplitVote.",
      },
      {
        type: 'cta',
        label: 'Vote the organ harvest dilemma →',
        href: '/play/organ-harvest',
      },
      {
        type: 'h3',
        text: '3. The Lifeboat',
      },
      {
        type: 'p',
        text: "A lifeboat holds 8 people. There are 12 survivors. Someone has to decide who boards — and who stays in the water. Who has the right to decide? On what basis?",
      },
      {
        type: 'cta',
        label: 'Vote the lifeboat dilemma →',
        href: '/play/lifeboat',
      },
      {
        type: 'cta',
        label: 'Vote the trolley problem — live results →',
        href: '/play/trolley',
      },
      {
        type: 'h2',
        text: 'Dilemmas About Truth and Loyalty',
      },
      {
        type: 'h3',
        text: "4. The Friend's Secret",
      },
      {
        type: 'p',
        text: "Your best friend asks for your honest opinion on something important. You know the truth will hurt them. What do you do?",
      },
      {
        type: 'p',
        text: "The split between those who say everything and those who protect their friend is sharp. See the live result on SplitVote.",
      },
      {
        type: 'cta',
        label: 'Vote the truth dilemma →',
        href: '/play/truth-friend',
      },
      {
        type: 'h3',
        text: '5. Report or Stay Silent',
      },
      {
        type: 'p',
        text: "You discover that a close friend has committed a serious crime. You witnessed it yourself. Do you report them or say nothing? The result shifts significantly depending on how the crime is described.",
      },
      {
        type: 'h3',
        text: '6. The Forbidden Cure',
      },
      {
        type: 'p',
        text: "A cure exists for a fatal disease. But obtaining it requires an action most people consider ethically unacceptable. Would you do it?",
      },
      {
        type: 'cta',
        label: 'Vote the cure dilemma →',
        href: '/play/cure-secret',
      },
      {
        type: 'h2',
        text: 'Dilemmas About Identity and Memory',
      },
      {
        type: 'h3',
        text: '7. Erasing a Memory',
      },
      {
        type: 'p',
        text: "You can delete the most painful memory of your life. The catch: that memory shaped who you are. After the erasure, you'd be a different person. Is it worth it?",
      },
      {
        type: 'p',
        text: 'See the live result on SplitVote.',
      },
      {
        type: 'cta',
        label: 'Vote the memory dilemma →',
        href: '/play/memory-erase',
      },
      {
        type: 'h3',
        text: '8. Starting Over',
      },
      {
        type: 'p',
        text: "Live another 40 years as you are now — or another 80 starting from scratch, with nothing you've built. Which do you choose?",
      },
      {
        type: 'h3',
        text: '9. Knowing Your Death',
      },
      {
        type: 'p',
        text: "You're offered the chance to know the exact date of your death — but not the cause. Or the cause — but not the date. Pick one.",
      },
      {
        type: 'h2',
        text: 'Everyday Life Dilemmas',
      },
      {
        type: 'h3',
        text: '10. The Betrayed Partner',
      },
      {
        type: 'p',
        text: "You find out that your best friend's partner is cheating on them. Your friend hasn't asked you anything. Do you tell them?",
      },
      {
        type: 'h3',
        text: '11. Sacrificing for the Future',
      },
      {
        type: 'p',
        text: "A costly action for you today could prevent enormous suffering for many people twenty years from now. No guarantees. Nobody will know. Do you act?",
      },
      {
        type: 'h3',
        text: '12. The Doctor Who Chooses Not to Tell Everything',
      },
      {
        type: 'p',
        text: "A doctor knows that communicating the full diagnosis would psychologically destroy the patient and reduce their chances of survival. Do they tell everything — or choose what to reveal?",
      },
      {
        type: 'h3',
        text: '13. The Predictive Algorithm',
      },
      {
        type: 'p',
        text: "An AI system predicts with high accuracy who will commit a serious crime in the next five years. Can you restrict those people's freedom before they've done anything?",
      },
      {
        type: 'h3',
        text: '14. The Difficult Inheritance',
      },
      {
        type: 'p',
        text: "You can receive a large fortune from someone you considered morally reprehensible. The money would be yours, unconditionally. Do you accept it?",
      },
      {
        type: 'h3',
        text: '15. The Only Spot',
      },
      {
        type: 'p',
        text: "Two people. One spot to be saved. One is your sister. The other is a doctor who could save many lives in the future. Who do you choose?",
      },
      {
        type: 'h2',
        text: 'What the Votes Reveal',
      },
      {
        type: 'p',
        text: "The most interesting thing in SplitVote results isn't which option wins. It's that almost every dilemma splits significantly — often 40/60 or 45/55 — even when the answer seems obvious before voting.",
      },
      {
        type: 'p',
        text: "Moral dilemmas don't test your ethical knowledge. They test which value system you've internalized: consequentialist (outcomes matter), deontological (actions matter in themselves), or virtue-based (what would a person of integrity do?). Most people hold all three — until a dilemma puts them in direct conflict.",
      },
      {
        type: 'cta',
        label: 'Vote the trolley problem — no account required →',
        href: '/play/trolley',
      },
      {
        type: 'h2',
        text: 'Try It Yourself',
      },
      {
        type: 'p',
        text: "Reading a dilemma and actually voting are two different experiences. The moment you have to really choose, the position that seemed obvious becomes suddenly much less clear.",
      },
      {
        type: 'p',
        text: "Want to see what the world would actually choose? Try SplitVote and compare your answers with other users.",
      },
      {
        type: 'cta',
        label: 'Explore all dilemmas on SplitVote →',
        href: '/moral-dilemmas',
      },
      {
        type: 'cta',
        label: 'Bioethics: when medicine forces impossible choices →',
        href: '/blog/bioethics-when-medicine-forces-impossible-choices',
      },
      {
        type: 'cta',
        label: 'Doing vs allowing harm: the distinction that shapes medical and legal ethics →',
        href: '/blog/doing-vs-allowing-harm',
      },
      {
        type: 'disclaimer',
        text: 'Educational content, not professional advice of any kind. SplitVote results are user polls, not scientific research. All scenarios are hypothetical.',
      },
    ],
  },
  {
    slug: 'ai-ethics-what-40-million-people-chose',
    locale: 'en',
    title: 'AI Ethics: What 40 Million People Said About Self-Driving Car Crashes',
    seoTitle: 'AI Ethics Dilemmas: The Moral Machine Study & What 40 Million People Chose',
    description:
      'In 2018, researchers collected 40 million moral decisions from 233 countries on self-driving car crashes. Here is what the world actually believes — and why the answers split so sharply by culture.',
    seoDescription:
      'A 2018 MIT study gathered 40 million moral decisions from 233 countries on AI crash scenarios. Discover what people chose, why cultures disagreed, and what it means for AI ethics today.',
    date: '2026-05-09',
    readingTime: 6,
    tags: ['ai ethics', 'self-driving cars', 'moral machine', 'technology ethics', 'philosophy'],
    relatedDilemmaIds: ['self-driving-crash', 'robot-judge', 'ai-replaces-jobs', 'ai-art-copyright', 'brain-upload'],
    alternateSlug: 'ia-etica-40-milioni-scelte',
    content: [
      {
        type: 'p',
        text: "When a self-driving car's brakes fail and a crash is unavoidable, who should the algorithm protect — the passenger inside, or the pedestrian outside? This question sounds abstract until you realise that engineers are encoding an answer right now, invisibly, in every autonomous vehicle on the road.",
      },
      {
        type: 'p',
        text: "In 2018, researchers at MIT ran a large-scale experiment to study what people actually believe about these choices. They built a platform called the Moral Machine and collected over 40 million decisions from people in 233 countries — the largest cross-cultural moral survey ever conducted.",
      },
      {
        type: 'h2',
        text: 'What the Moral Machine found',
      },
      {
        type: 'p',
        text: 'Participants were shown variations of the same scenario: an autonomous vehicle facing an unavoidable crash, with different groups in harm\'s way. The researchers varied who was inside the car, who was outside, how many people were involved, whether pedestrians were crossing legally, and other factors.',
      },
      {
        type: 'p',
        text: "Across those 40 million responses, Awad and colleagues (Nature, 2018) identified several preferences that held broadly across cultures.",
      },
      {
        type: 'list',
        items: [
          'Save more lives when numbers differ — most people preferred outcomes that minimised total deaths',
          'Spare younger people — a preference for saving children over adults, and adults over the elderly, held in most countries',
          'Reward lawful behaviour — pedestrians crossing legally were more likely to be spared than those jaywalking',
          'Spare humans over animals — among the most consistent cross-cultural findings in the entire dataset',
        ],
      },
      {
        type: 'h2',
        text: 'Where the world splits',
      },
      {
        type: 'p',
        text: 'The headline finding was not consensus — it was variation. The researchers identified three distinct cultural clusters. Western countries (most of Europe and North America) showed a stronger preference for sparing pedestrians over passengers. East Asian respondents weighted the preference for sparing the elderly more than Western participants did. Countries in the Global South formed a third cluster, placing greater weight on saving more lives regardless of other characteristics.',
      },
      {
        type: 'p',
        text: "This variation matters enormously for policy. A self-driving car programmed in California will embed the moral preferences of Californian engineers and regulators — then it will be sold in Tokyo, São Paulo, and Berlin. The Moral Machine showed there is no single global answer to who the algorithm should protect.",
      },
      {
        type: 'h2',
        text: 'The deeper problem: who decides?',
      },
      {
        type: 'p',
        text: "Even if there were a clear cross-cultural consensus, a second question remains unanswered: whose preferences should the car follow? The passenger who paid for it? The majority of society? A national regulator? An international standards body? None of these answers is obvious.",
      },
      {
        type: 'p',
        text: "These are not technical questions. They are political and philosophical ones — about accountability, liability, and the legitimacy of encoding moral choices into code. When a human driver makes a split-second decision, we hold them responsible. When an algorithm does, the accountability chain fractures. Is it the software engineer? The company? The government that approved the car?",
      },
      {
        type: 'h2',
        text: 'Three dilemmas you can vote on now',
      },
      {
        type: 'p',
        text: "The self-driving car crash is not the only place AI now makes moral choices. The same logic applies to automated sentencing tools, content moderation systems, and hiring algorithms. Here are three dilemmas that put the questions directly — vote and see how you compare with people worldwide.",
      },
      {
        type: 'cta',
        label: 'Who should the car protect? Vote →',
        href: '/play/self-driving-crash',
      },
      {
        type: 'p',
        text: 'If AI is proven 30% more accurate than human judges in criminal trials, should we replace human judges? The accuracy argument is compelling. So is the accountability one.',
      },
      {
        type: 'cta',
        label: 'Should AI replace judges? Vote →',
        href: '/play/robot-judge',
      },
      {
        type: 'p',
        text: 'When AI is projected to eliminate 30% of jobs in a decade, should governments slow it down or let markets and retraining programmes adapt?',
      },
      {
        type: 'cta',
        label: 'AI and jobs: slow it down or let it happen? Vote →',
        href: '/play/ai-replaces-jobs',
      },
      {
        type: 'h2',
        text: 'Why your vote adds up to something',
      },
      {
        type: 'p',
        text: "Surveys about abstract ethics often tell us what people think they believe. Moral dilemmas in a live voting context — where you see results from thousands of others in real time — reveal something closer to revealed preference. When you see that 58% of voters chose to protect the pedestrian, or that the split in your region differs from the global average, it changes how you hold the question.",
      },
      {
        type: 'p',
        text: "The Moral Machine's 40 million data points were collected from self-selected participants — not a representative sample. SplitVote's votes come from the same kind of audience. But aggregate moral preferences, even imperfect ones, matter: they are part of how societies form norms, and norms eventually shape law.",
      },
      {
        type: 'cta',
        label: 'Explore all AI ethics dilemmas →',
        href: '/ai-ethics-dilemmas',
      },
      {
        type: 'cta',
        label: 'How science studies moral intuitions →',
        href: '/blog/experimental-moral-psychology-how-science-studies-moral-intuitions',
      },
      {
        type: 'cta',
        label: 'Bioethics: when medicine forces impossible choices →',
        href: '/blog/bioethics-when-medicine-forces-impossible-choices',
      },
      {
        type: 'disclaimer',
        text: "SplitVote presents ethical dilemmas for reflection and discussion. Results represent our community's votes, not scientific conclusions. Source: Awad et al., 'The Moral Machine experiment', Nature 558, 59–64 (2018).",
      },
    ],
  },
  {
    slug: 'loyalty-vs-honesty-when-they-collide',
    locale: 'en',
    title: 'Loyalty vs Honesty: When the Two Cannot Coexist',
    seoTitle: 'Loyalty vs Honesty — When Telling the Truth Means Betraying Someone You Love',
    description:
      'Most real moral dilemmas are not about trolleys — they are about people we know. When loyalty and honesty directly conflict, which wins? And where is the breaking point?',
    seoDescription:
      'Loyalty and honesty are both virtues — until they collide. Explore the moral psychology of when protecting someone close conflicts with telling the truth, through five real dilemmas.',
    date: '2026-05-09',
    readingTime: 5,
    tags: ['loyalty', 'honesty', 'ethics', 'moral philosophy', 'moral dilemmas'],
    relatedDilemmaIds: ['cover-accident', 'report-friend', 'sibling-secret', 'truth-friend', 'whistleblower'],
    alternateSlug: 'lealta-vs-onesta-quando-si-scontrano',
    content: [
      {
        type: 'p',
        text: "Most moral dilemmas in real life don't involve runaway trolleys or anonymous strangers. They involve people we know. A partner who made a terrible mistake. A sibling hiding something painful. A friend who crossed a line. The question is no longer abstract — it is: do I protect them, or do I tell the truth?",
      },
      {
        type: 'p',
        text: 'Loyalty and honesty are both genuine moral virtues. The problem is that they can fail to coexist at the same time. When they collide, you cannot satisfy both — and your answer reveals something real about how you actually reason about ethics, regardless of the values you think you hold.',
      },
      {
        type: 'h2',
        text: 'What makes them collide',
      },
      {
        type: 'p',
        text: "Loyalty — staying committed to those who depend on us — is foundational to trust, family, and the social bonds that make cooperation possible. Honesty — telling the truth even when it hurts — is foundational to justice, accountability, and relationships built on reality rather than a comfortable lie.",
      },
      {
        type: 'p',
        text: "The tension arises when being loyal requires concealment. Your partner runs a red light and kills a pedestrian. Being loyal means driving away. Being honest means calling the police. The math is identical: one act, two values, direct conflict. You cannot do both.",
      },
      {
        type: 'h2',
        text: 'What moral psychology tells us',
      },
      {
        type: 'p',
        text: "Researchers who study moral reasoning have argued that human intuitions draw on multiple distinct concerns that can pull in opposite directions — including care for individuals, fairness and justice, loyalty to groups, and respect for social bonds. Different people weight these concerns differently, and the weights can shift depending on context.",
      },
      {
        type: 'p',
        text: "One influential framework, Moral Foundations Theory, treats loyalty and fairness as separate moral foundations that can conflict. This is an active area of research with ongoing debate — not settled consensus. SplitVote dilemmas explore similar tensions for reflection, not as a measure of any psychological theory.",
      },
      {
        type: 'h2',
        text: 'The hierarchy most people carry',
      },
      {
        type: 'p',
        text: "Most people have an implicit loyalty hierarchy, even if they have never named it: loyalty to close family tends to outweigh loyalty to friends, which outweighs loyalty to institutions, which outweighs abstract honesty principles. This is why covering for a sibling feels different from covering for a colleague — and covering for a stranger feels almost impossible.",
      },
      {
        type: 'p',
        text: "But the hierarchy shifts with the severity of the wrong. Helping a friend cover a parking fine is different from covering a fatal accident. Most people's loyalty has a breaking point — they just rarely know where it sits until they face the actual situation.",
      },
      {
        type: 'h2',
        text: 'Four dilemmas, four different breaking points',
      },
      {
        type: 'p',
        text: 'These scenarios test the loyalty-honesty line at different levels of severity. Each one changes something — the relationship, the harm done, the reversibility of the wrong. Where do you break?',
      },
      {
        type: 'cta',
        label: 'Your partner caused a fatal accident. Drive away or call the police? →',
        href: '/play/cover-accident',
      },
      {
        type: 'cta',
        label: 'Your best friend embezzled from a charity. Report them or talk first? →',
        href: '/play/report-friend',
      },
      {
        type: 'cta',
        label: "Your sibling is cheating — and their spouse is your friend. Tell or stay out? →",
        href: '/play/sibling-secret',
      },
      {
        type: 'cta',
        label: "Your best friend's new partner is wrong for them. Be honest or keep the peace? →",
        href: '/play/truth-friend',
      },
      {
        type: 'h2',
        text: 'When loyalty to a person becomes loyalty to an institution',
      },
      {
        type: 'p',
        text: "The conflict takes a different shape when it is not personal but institutional. Whistleblowing cases make the loyalty-honesty tension visible at scale: one employee's decision can expose harm done to thousands and simultaneously destroy livelihoods in a community. The stakes are different — but the underlying question is the same.",
      },
      {
        type: 'cta',
        label: 'Your company illegally pollutes a river. 1,000 jobs are at stake. Report or stay silent? →',
        href: '/play/whistleblower',
      },
      {
        type: 'cta',
        label: 'Explore all loyalty vs honesty dilemmas →',
        href: '/loyalty-vs-honesty',
      },
      {
        type: 'cta',
        label: 'Why good people disagree: Moral Foundations Theory explained →',
        href: '/blog/moral-foundations-theory-why-good-people-disagree',
      },
      {
        type: 'cta',
        label: 'Privacy in public voting: what your anonymous vote reveals →',
        href: '/blog/privacy-in-public-voting',
      },
      {
        type: 'disclaimer',
        text: "SplitVote presents ethical dilemmas for reflection and discussion. Mention of Moral Foundations Theory is for context only — SplitVote's design is inspired by, and not a replication of, any academic framework. Results represent our community's votes, not scientific conclusions.",
      },
    ],
  },
  {
    slug: 'consequentialism-the-greatest-good',
    locale: 'en',
    title: 'Consequentialism: The Greatest Good for the Greatest Number',
    seoTitle: 'Consequentialism Explained — Why the Math of Morality Has Limits',
    description:
      'Consequentialism judges actions by their outcomes. Produce the most good, minimize harm. It sounds obvious — until the calculations force you to do something that feels clearly wrong.',
    seoDescription:
      'What is consequentialism? How does it work, where does it break down, and what real dilemmas does it struggle to answer? Explore the ethics of outcomes through five thought experiments.',
    date: '2026-05-10',
    readingTime: 5,
    tags: ['consequentialism', 'utilitarianism', 'ethics', 'moral philosophy', 'trolley problem'],
    relatedDilemmaIds: ['trolley', 'pandemic-dose', 'organ-harvest', 'rich-or-fair', 'universal-basic-income'],
    alternateSlug: 'consequenzialismo-il-bene-maggiore',
    content: [
      {
        type: 'p',
        text: "You are standing at a lever. A runaway trolley is heading toward five people tied to the tracks. You can pull the lever and divert it — but then it will kill one person on the side track. What do you do? Most people pull the lever. And in doing so, they are reasoning as consequentialists.",
      },
      {
        type: 'p',
        text: 'Consequentialism is the view that the moral worth of an action is determined entirely by its outcomes. The right act is whichever one produces the most good — or the least harm. Associated with Jeremy Bentham and John Stuart Mill, this family of theories goes by many names (utilitarianism being the most famous), but they share a common structure: do the moral math, choose the best result.',
      },
      {
        type: 'h2',
        text: 'How it works in practice',
      },
      {
        type: 'p',
        text: "The consequentialist approach is appealingly clear. Faced with a difficult choice, you ask: which option produces the best overall outcome? Count up the benefits and harms to everyone affected — not just yourself — and choose accordingly. Five lives outweigh one. Preventing suffering outweighs respecting a minor rule. The results are what matter.",
      },
      {
        type: 'p',
        text: "This framework resonates with most people's instincts in certain situations. When a doctor rations scarce medicine to save the most lives, or when a government implements a policy that benefits millions at a cost to a few, consequentialist reasoning is at work. It is the ethics of emergency rooms and public health.",
      },
      {
        type: 'h2',
        text: 'Where the math breaks down',
      },
      {
        type: 'p',
        text: "Consider a different scenario: five patients in a hospital will die without organ transplants. A healthy visitor happens to match all five. A strictly consequentialist doctor could justify harvesting the visitor's organs to save five lives. The math says yes. Almost no one agrees.",
      },
      {
        type: 'p',
        text: "This is consequentialism's central tension. It can endorse actions that feel deeply wrong — sacrificing individuals, punishing the innocent, breaking trust — if the aggregate outcome is better. Critics argue that it treats people as instruments rather than as beings with inherent worth. Defenders argue that ignoring outcomes is a form of moral self-indulgence.",
      },
      {
        type: 'h2',
        text: 'The dilemmas that test it',
      },
      {
        type: 'p',
        text: 'These scenarios push consequentialist reasoning to its limits. Some feel easy. Others reveal where the math starts to conflict with something deeper.',
      },
      {
        type: 'cta',
        label: 'A runaway trolley. Five lives or one. Which do you choose? →',
        href: '/play/trolley',
      },
      {
        type: 'cta',
        label: 'One dose of a vaccine. Two patients, one will die. Who gets it? →',
        href: '/play/pandemic-dose',
      },
      {
        type: 'cta',
        label: 'Five patients will die without organs. One healthy person could save them all. →',
        href: '/play/organ-harvest',
      },
      {
        type: 'cta',
        label: 'Tax the ultra-rich heavily to fund public services. Fair trade-off? →',
        href: '/play/rich-or-fair',
      },
      {
        type: 'cta',
        label: 'Universal basic income for everyone — even if it costs jobs? →',
        href: '/play/universal-basic-income',
      },
      {
        type: 'h2',
        text: 'How it relates to the other major theories',
      },
      {
        type: 'p',
        text: "Consequentialism is one of three major frameworks in Western moral philosophy. Deontology holds that some actions are wrong regardless of outcomes — pulling the lever might still violate a duty not to actively cause death. Virtue ethics asks not what the outcome is, but what a person of good character would do. All three frameworks illuminate different aspects of difficult choices, and real moral reasoning often draws on all three.",
      },
      {
        type: 'cta',
        label: 'Explore all moral dilemmas →',
        href: '/moral-dilemmas',
      },
      {
        type: 'cta',
        label: 'Bioethics: when medicine forces impossible choices →',
        href: '/blog/bioethics-when-medicine-forces-impossible-choices',
      },
      {
        type: 'disclaimer',
        text: "SplitVote presents ethical dilemmas for reflection and discussion. References to philosophical frameworks are for context only — the goal is to help you reflect, not to provide academic instruction. Results represent our community's votes, not scientific conclusions.",
      },
    ],
  },
  {
    slug: 'deontology-some-things-are-always-wrong',
    locale: 'en',
    title: 'Deontology: Some Things Are Always Wrong, No Matter the Outcome',
    seoTitle: 'Deontology Explained — When Rules Matter More Than Results',
    description:
      'Deontological ethics holds that some actions are simply wrong, regardless of the good they might produce. Immanuel Kant built the most famous version of this idea — and it still divides moral philosophers today.',
    seoDescription:
      "What is deontology? How does Kant's categorical imperative work, where does duty-based ethics break down, and what dilemmas test it most sharply? Explore the ethics of rules and duties.",
    date: '2026-05-10',
    readingTime: 5,
    tags: ['deontology', 'Kant', 'ethics', 'moral philosophy', 'duty'],
    relatedDilemmaIds: ['whistleblower', 'cover-accident', 'innocent-juror', 'mandatory-vaccine'],
    alternateSlug: 'deontologia-alcune-cose-sono-sempre-sbagliate',
    content: [
      {
        type: 'p',
        text: "Some things are wrong regardless of what good might come from them. You cannot torture an innocent person even if it would save a hundred lives. You cannot frame someone for a crime they did not commit even if it would prevent a riot. This is the core intuition behind deontological ethics — and it is an intuition that most people share, at least some of the time.",
      },
      {
        type: 'p',
        text: "Deontology (from the Greek deon, meaning duty) holds that morality is fundamentally about rules and obligations, not outcomes. The most influential version comes from Immanuel Kant, who argued that certain actions are intrinsically right or wrong, independent of their consequences. His test: act only according to principles you could consistently will to be universal laws.",
      },
      {
        type: 'h2',
        text: "Kant's categorical imperative",
      },
      {
        type: 'p',
        text: "The categorical imperative is Kant's central idea: before acting, ask whether you could rationally will that everyone in your situation act the same way. If you make an exception for yourself that you would not accept as a universal rule — lying when convenient, breaking promises when beneficial — you are acting immorally, regardless of the outcome.",
      },
      {
        type: 'p',
        text: "Kant also formulated it another way: always treat people as ends in themselves, never merely as means. This is why deontology objects to the organ-harvest scenario — the healthy patient is not a resource to be used for others, even to save five lives. Every person has inherent dignity that cannot be traded away in a calculation.",
      },
      {
        type: 'h2',
        text: 'Why outcomes do not settle the question',
      },
      {
        type: 'p',
        text: "Consequentialism says: if lying produces the better outcome, lying is right. Deontology disagrees. If lying is wrong, it is wrong even when the lie would prevent harm. The wrongness is in the act itself, not in the results it produces.",
      },
      {
        type: 'p',
        text: "This might sound rigid, and it can be. Kant's strict view implies that you cannot lie even to a murderer who asks where your friend is hiding. Most people find this conclusion too extreme — which is why contemporary deontologists usually allow for contextual judgment while preserving the core idea that some constraints are near-absolute.",
      },
      {
        type: 'h2',
        text: 'The dilemmas that test it',
      },
      {
        type: 'p',
        text: 'These scenarios put deontological constraints under pressure. Each one involves a case where breaking a rule might produce a better outcome — and asks whether the rule still holds.',
      },
      {
        type: 'cta',
        label: 'Your company illegally pollutes a river. Do you have a duty to report it? →',
        href: '/play/whistleblower',
      },
      {
        type: 'cta',
        label: 'Your partner caused a fatal accident. Is covering for them always wrong? →',
        href: '/play/cover-accident',
      },
      {
        type: 'cta',
        label: "You are on a jury. The defendant is innocent — but you were told to vote guilty. →",
        href: '/play/innocent-juror',
      },
      {
        type: 'cta',
        label: 'Mandatory vaccination: is there a duty to protect others even against your will? →',
        href: '/play/mandatory-vaccine',
      },
      {
        type: 'h2',
        text: 'How it relates to the other major theories',
      },
      {
        type: 'p',
        text: "Deontology and consequentialism are in direct tension: one says outcomes are all that matter, the other says some actions are off the table regardless of outcomes. Virtue ethics offers a third path — instead of rules or calculations, it asks what a person of good character would do. Each framework reveals something the others miss.",
      },
      {
        type: 'cta',
        label: 'Explore all moral dilemmas →',
        href: '/moral-dilemmas',
      },
      {
        type: 'cta',
        label: 'Doing vs allowing harm: the distinction deontology cares about most →',
        href: '/blog/doing-vs-allowing-harm',
      },
      {
        type: 'cta',
        label: 'Bioethics: when medicine forces impossible choices →',
        href: '/blog/bioethics-when-medicine-forces-impossible-choices',
      },
      {
        type: 'disclaimer',
        text: "SplitVote presents ethical dilemmas for reflection and discussion. References to philosophical frameworks are for context only — the goal is to help you reflect, not to provide academic instruction. Results represent our community's votes, not scientific conclusions.",
      },
    ],
  },
  {
    slug: 'virtue-ethics-what-would-a-good-person-do',
    locale: 'en',
    title: 'Virtue Ethics: What Would a Good Person Do?',
    seoTitle: "Virtue Ethics Explained — Aristotle, Character, and the Good Life",
    description:
      "Instead of asking what rule applies or what outcome to maximize, virtue ethics asks a different question: what would a person of good character do? Aristotle's answer still challenges moral philosophy today.",
    seoDescription:
      "What is virtue ethics? How does Aristotle's approach to moral character differ from consequentialism and deontology? Explore the ethics of who you are, not just what you do.",
    date: '2026-05-10',
    readingTime: 5,
    tags: ['virtue ethics', 'Aristotle', 'ethics', 'moral character', 'moral philosophy'],
    relatedDilemmaIds: ['truth-friend', 'forgive-cheater', 'sibling-secret', 'love-or-career'],
    alternateSlug: 'etica-della-virtu-cosa-farebbe-una-persona-buona',
    content: [
      {
        type: 'p',
        text: "Consequentialism says: calculate the best outcome. Deontology says: follow the right rules. Virtue ethics says: become the right kind of person. It shifts the fundamental moral question from 'what should I do?' to 'who should I be?' — and it is the oldest of the three major Western ethical frameworks.",
      },
      {
        type: 'p',
        text: "Aristotle argued that the goal of human life is eudaimonia — flourishing, living and acting well. This is achieved not by following rules or maximizing outcomes, but by developing virtues: stable character traits like courage, honesty, compassion, and practical wisdom. Virtues are excellences of character, and they are acquired by practice. You become courageous by doing courageous things.",
      },
      {
        type: 'h2',
        text: 'What makes it different from the other frameworks',
      },
      {
        type: 'p',
        text: "Consequentialism and deontology both provide a decision procedure — a method for working out what to do. Virtue ethics is more interested in the person making the decision than in the decision itself. A virtuous person brings practical wisdom (phronesis) to situations: the ability to perceive what matters, weigh competing considerations, and act appropriately — without needing to consult a rulebook.",
      },
      {
        type: 'p',
        text: "This makes virtue ethics flexible where the others are rigid, but also less precise. It can acknowledge that the same action — telling a hard truth, for example — is courageous in one context and cruel in another. Context, relationship, and character all matter.",
      },
      {
        type: 'h2',
        text: 'Where virtue ethics is strongest',
      },
      {
        type: 'p',
        text: "Virtue ethics handles relationship and character questions that the other frameworks find awkward. When a friend asks for your honest opinion about a decision that will hurt them, consequentialism calculates pain and gain; deontology invokes duties of honesty and kindness that may conflict. Virtue ethics asks what an honest, compassionate, loyal friend would do — and accepts that this requires judgment, not just calculation.",
      },
      {
        type: 'p',
        text: "It also captures something that consequentialism and deontology tend to miss: that how you act matters, not just what you do. A person who does the right thing resentfully, or for the wrong reasons, is not fully virtuous — even if the action itself was correct.",
      },
      {
        type: 'h2',
        text: 'Where it breaks down',
      },
      {
        type: 'p',
        text: "Virtue ethics is less useful when you need a clear answer fast, or when virtues conflict. What does a courageous and honest person do when telling the truth will cause serious harm? The framework gives you no formula — only the instruction to exercise practical wisdom, which presupposes you already have it.",
      },
      {
        type: 'h2',
        text: 'The dilemmas that test it',
      },
      {
        type: 'p',
        text: 'These scenarios ask less about rules or outcomes and more about character. What kind of person do you want to be — and what does that person do here?',
      },
      {
        type: 'cta',
        label: "Your best friend's new partner is wrong for them. Honest or kind? →",
        href: '/play/truth-friend',
      },
      {
        type: 'cta',
        label: 'Your partner cheated. Does a forgiving person take them back? →',
        href: '/play/forgive-cheater',
      },
      {
        type: 'cta',
        label: "Your sibling is cheating — and their spouse is your friend. What does loyalty require? →",
        href: '/play/sibling-secret',
      },
      {
        type: 'cta',
        label: 'Love or career: what does a person who knows their own values choose? →',
        href: '/play/love-or-career',
      },
      {
        type: 'h2',
        text: 'How it connects to the other major frameworks',
      },
      {
        type: 'p',
        text: "Virtue ethics completes the trio of major Western moral frameworks alongside consequentialism and deontology. Consequentialism asks what outcomes to produce; deontology asks what rules apply; virtue ethics asks what character to express. Real moral reasoning often draws on all three — which is why the same dilemma can look very different depending on where you start.",
      },
      {
        type: 'cta',
        label: 'Explore all moral dilemmas →',
        href: '/moral-dilemmas',
      },
      {
        type: 'cta',
        label: 'Bioethics: when medicine forces impossible choices →',
        href: '/blog/bioethics-when-medicine-forces-impossible-choices',
      },
      {
        type: 'cta',
        label: 'How science studies moral intuitions →',
        href: '/blog/experimental-moral-psychology-how-science-studies-moral-intuitions',
      },
      {
        type: 'disclaimer',
        text: "SplitVote presents ethical dilemmas for reflection and discussion. References to philosophical frameworks are for context only — the goal is to help you reflect, not to provide academic instruction. Results represent our community's votes, not scientific conclusions.",
      },
    ],
  },
  {
    slug: 'doing-vs-allowing-harm',
    locale: 'en',
    title: 'Doing vs Allowing Harm — When Inaction Is Also a Choice',
    seoTitle: 'Doing vs Allowing Harm — Why Pulling the Lever Feels Different from Pushing the Man',
    description:
      'Pulling a lever to redirect a trolley feels different from pushing someone to stop it — even when the math is identical. The doing/allowing distinction is one of the deepest puzzles in moral philosophy. And it shapes how you reason about everything from medicine to global poverty.',
    seoDescription:
      "What is the doing vs allowing distinction in ethics? Why do most people accept active killing in some cases and refuse it in others? Explore the moral asymmetry that divides consequentialists from deontologists.",
    date: '2026-05-10',
    readingTime: 5,
    tags: ['doing vs allowing', 'ethics', 'moral philosophy', 'trolley problem', 'omission'],
    relatedDilemmaIds: ['trolley', 'plane-parachute', 'pandemic-dose', 'mercy-kill', 'steal-medicine'],
    alternateSlug: 'causare-vs-permettere-danno',
    content: [
      {
        type: 'p',
        text: "A trolley is heading toward five people. Pulling a lever to divert it onto a side track will kill one person but save the five. Most people pull the lever. Now change the case: instead of a lever, you must push a large man off a bridge to stop the trolley. Same math. Same outcome. Almost no one pushes the man.",
      },
      {
        type: 'p',
        text: "The asymmetry is the puzzle. Why does pulling a lever feel acceptable when pushing the man does not? Both are active choices that result in one death to save five. The difference is one of the most studied questions in moral philosophy — and it sits behind countless real-world debates about medicine, poverty, and responsibility.",
      },
      {
        type: 'h2',
        text: 'The doing/allowing distinction, defined',
      },
      {
        type: 'p',
        text: "The distinction is between actively doing harm and merely allowing harm to happen. A doctor who administers a lethal injection actively causes death. A doctor who removes life support allows death. A bystander who fails to throw a rope to a drowning person allows them to die. Most ethical traditions treat these as morally different — even when the outcome is identical.",
      },
      {
        type: 'p',
        text: "The intuition behind the distinction: the world contains harms we did not cause. We have a strong duty not to add to them. Our duty to actively prevent them is weaker. This is why a surgeon who refuses to harvest organs to save five lives does not feel like a killer — even though five people will die as a result of the refusal.",
      },
      {
        type: 'h2',
        text: 'Why most people feel the difference',
      },
      {
        type: 'p',
        text: "In large surveys, roughly 85% of people pull the trolley lever, but only about 30% push the man off the bridge. The difference is not in the outcome — it is in the role you play. Pulling a lever is causing harm as a side effect of saving lives. Pushing a person is using them as a means to save lives. The latter feels deeply wrong, even when the arithmetic is identical.",
      },
      {
        type: 'p',
        text: "Researchers who study moral cognition argue that this is not a quirk of survey design but a stable feature of how human moral judgment works. People reason about active causation and passive permission as fundamentally different categories — even when they cannot articulate why.",
      },
      {
        type: 'h2',
        text: 'Why some philosophers reject the distinction',
      },
      {
        type: 'p',
        text: "Consequentialists are skeptical. If the outcome is the same, why should how it came about matter morally? The drowning child argument makes the case sharply: if you would save a drowning child at minor cost, you should also act on a global poverty problem you could meaningfully reduce at similar cost. Failing to act, on this view, is morally equivalent to actively causing the harm you allowed.",
      },
      {
        type: 'p',
        text: "On the strict consequentialist view, the doing/allowing distinction is a moral illusion — a comforting story we tell ourselves to avoid the demanding implications of our power to prevent harm. If you can save a life at low cost and choose not to, you are responsible for that death. The distinction between doing and allowing dissolves under pressure.",
      },
      {
        type: 'h2',
        text: 'Where the line breaks down in practice',
      },
      {
        type: 'p',
        text: "The distinction is hardest to maintain in medical contexts. Withdrawing life support and administering a lethal injection can produce the same outcome on the same timeline. Many ethicists argue these cases differ; many argue they do not. The legal answer in most jurisdictions is closer to the first view, but the philosophical debate is far from settled.",
      },
      {
        type: 'p',
        text: "Cases where someone could easily save another life and chooses not to also strain the distinction. If you are the only person who could give a stranger life-saving medicine — at no cost to yourself — and you walk away, most people consider this morally serious. The pure doing/allowing distinction would say you did nothing wrong because you only allowed the death. Most intuitions disagree.",
      },
      {
        type: 'h2',
        text: 'The dilemmas that test it',
      },
      {
        type: 'p',
        text: "These scenarios push the doing/allowing line in different directions. Each one changes something — the relationship to the victim, the cost of acting, the directness of causation. Where do you draw the line?",
      },
      {
        type: 'cta',
        label: 'A runaway trolley. Five lives or one. Pull the lever or do nothing? →',
        href: '/play/trolley',
      },
      {
        type: 'cta',
        label: "A plane crashes. One parachute, two of you. Take it or give it? →",
        href: '/play/plane-parachute',
      },
      {
        type: 'cta',
        label: 'One vaccine dose. Two patients. Choose, or refuse to choose? →',
        href: '/play/pandemic-dose',
      },
      {
        type: 'cta',
        label: "A terminally ill patient asks for help to die. Refuse or assist? →",
        href: '/play/mercy-kill',
      },
      {
        type: 'cta',
        label: "Your child needs medicine you cannot afford. Steal it or let them suffer? →",
        href: '/play/steal-medicine',
      },
      {
        type: 'h2',
        text: 'How the major frameworks handle it',
      },
      {
        type: 'p',
        text: "Consequentialism tends to deny the distinction: outcomes are what matter, and the path to them is morally secondary. Deontology defends the distinction: there is a stronger duty not to actively cause harm than to prevent it, and people have rights against being used as means. Where you sit on this question shapes how you reason about much more than trolleys — it shapes how you think about medicine, charity, war, and the limits of personal responsibility.",
      },
      {
        type: 'cta',
        label: 'Consequentialism: why outcomes are all that matter →',
        href: '/blog/consequentialism-the-greatest-good',
      },
      {
        type: 'cta',
        label: 'Deontology: why some constraints are near-absolute →',
        href: '/blog/deontology-some-things-are-always-wrong',
      },
      {
        type: 'cta',
        label: 'Explore all moral dilemmas →',
        href: '/moral-dilemmas',
      },
      {
        type: 'disclaimer',
        text: "SplitVote presents ethical dilemmas for reflection and discussion. References to philosophical frameworks are for context only — the goal is to help you reflect, not to provide academic instruction. Results represent our community's votes, not scientific conclusions.",
      },
    ],
  },
  {
    slug: 'privacy-in-public-voting',
    locale: 'en',
    title: 'What Privacy Means in a World of Public Voting',
    seoTitle: 'Privacy in a World of Public Voting — When Anonymous Is Not the Same as Private',
    description:
      "Anonymous voting protects who you are. Aggregated data reveals what your group thinks. AI-driven inference can re-identify both. Privacy in 2026 is not one thing — and the dilemmas around it are getting harder, fast.",
    seoDescription:
      "What does privacy mean when votes are anonymous but data is public? Explore the difference between identity privacy and information privacy, and the moral dilemmas AI surveillance creates.",
    date: '2026-05-10',
    readingTime: 5,
    tags: ['privacy', 'surveillance', 'AI ethics', 'GDPR', 'anonymous voting'],
    relatedDilemmaIds: ['surveillance-city', 'privacy-terror', 'deepfake-expose', 'censor-speech', 'delete-social-media'],
    alternateSlug: 'privacy-nel-voto-pubblico',
    content: [
      {
        type: 'p',
        text: "You vote anonymously on a moral dilemma. Your individual choice stays hidden — no name, no profile, no record tied to you. But the aggregate vote is published: 62% chose option A, 38% chose option B. From your single private act, a public truth emerges. This is the basic structure of anonymous polling — and it raises a question that gets harder every year: when does anonymous stop being private?",
      },
      {
        type: 'p',
        text: "Privacy in 2026 is not one thing. It is several distinct concerns that often get bundled together — and pulling them apart matters because the moral dilemmas they create are different in each case.",
      },
      {
        type: 'h2',
        text: 'The two dimensions of privacy',
      },
      {
        type: 'p',
        text: "Identity privacy is about who you are: your name, your face, your verifiable attributes. Information privacy is about what you think, choose, or do — even when nobody knows it was you. Anonymous voting protects identity privacy strongly. But it does not automatically protect information privacy: aggregate patterns reveal what groups believe, even when no individual is identifiable.",
      },
      {
        type: 'p',
        text: "These two dimensions can come apart sharply. A perfectly anonymous dataset can still expose what people in your demographic, region, or category believe — sometimes in ways those people would never have shared if asked directly. Anonymity at the individual level does not prevent inference at the group level.",
      },
      {
        type: 'h2',
        text: 'Why anonymous is not always private',
      },
      {
        type: 'p',
        text: "Anonymisation often fails under cross-referencing. Combine an anonymous dataset with one or two other public sources — a payment record, a location trace, a social media post — and individuals can be re-identified with surprising accuracy. Researchers have demonstrated this repeatedly: even strong-looking anonymisation breaks when adversaries have other data to work with.",
      },
      {
        type: 'p',
        text: "Beyond re-identification, aggregate data raises a different concern: profiling. Even if no individual is named, knowing how a group reasons can shape how that group is treated — by advertisers, employers, insurers, or governments. The privacy question shifts from 'who voted what' to 'what does this say about the kind of people they are' — and the second question is in some ways more consequential than the first.",
      },
      {
        type: 'h2',
        text: 'How AI changes the privacy stakes',
      },
      {
        type: 'p',
        text: "Algorithmic inference makes the gap between identity and information privacy much narrower. A model trained on enough behavioural data can predict things you never explicitly disclosed: political beliefs, sexual orientation, mental health state, future behaviour. The data that powers such inference is often gathered from anonymous or pseudonymous interactions — exactly the kind that classical privacy frameworks treated as low-risk.",
      },
      {
        type: 'p',
        text: "Synthetic media adds another layer. Deepfakes test the question of what truth even means in a world where evidence can be fabricated convincingly. The consent that anchored older privacy regimes — control over what is published about you — becomes harder to enforce when convincing fake content can be produced from a few seconds of public footage.",
      },
      {
        type: 'h2',
        text: 'The dilemmas that put privacy under pressure',
      },
      {
        type: 'p',
        text: "These scenarios test where privacy ends and other values — security, accountability, free expression, public safety — begin. Each one changes something about who is watching, who is being watched, and what is at stake.",
      },
      {
        type: 'cta',
        label: 'A safer city through total surveillance. Worth it? →',
        href: '/play/surveillance-city',
      },
      {
        type: 'cta',
        label: "An AI predicts a terrorist attack with 90% accuracy. Detain the suspect? →",
        href: '/play/privacy-terror',
      },
      {
        type: 'cta',
        label: 'A deepfake exposes a real crime. Use it as evidence or destroy it? →',
        href: '/play/deepfake-expose',
      },
      {
        type: 'cta',
        label: "A government wants to censor disinformation. Where do you draw the line? →",
        href: '/play/censor-speech',
      },
      {
        type: 'cta',
        label: 'Delete your entire social media history. Free or erased? →',
        href: '/play/delete-social-media',
      },
      {
        type: 'h2',
        text: 'How SplitVote thinks about this',
      },
      {
        type: 'p',
        text: "The platform takes the distinction between identity privacy and information privacy seriously. Votes are anonymous by default — no account required, no personal data tied to choices. IP addresses used for rate limiting are hashed before storage. Aggregate results are published; individual voting histories for logged-in users are not exposed publicly. The trade-off is honest: you contribute to a public dataset of moral patterns, and the platform contributes back the protection that your individual choices stay yours.",
      },
      {
        type: 'cta',
        label: 'How anonymous voting actually works on SplitVote →',
        href: '/blog/how-anonymous-voting-works',
      },
      {
        type: 'cta',
        label: 'AI ethics: what 40 million people chose about machine decisions →',
        href: '/blog/ai-ethics-what-40-million-people-chose',
      },
      {
        type: 'cta',
        label: 'Explore all moral dilemmas →',
        href: '/moral-dilemmas',
      },
      {
        type: 'disclaimer',
        text: "SplitVote presents ethical dilemmas for reflection and discussion. References to privacy frameworks and AI research are for context only — the goal is to help you reflect, not to provide legal or technical advice. Results represent our community's votes, not scientific conclusions.",
      },
    ],
  },
  {
    slug: 'moral-foundations-theory-why-good-people-disagree',
    locale: 'en',
    title: 'Moral Foundations Theory — Why Good People Disagree',
    seoTitle: 'Moral Foundations Theory: Why Good People Have Completely Different Ethics',
    description:
      "Jonathan Haidt's Moral Foundations Theory explains why two reasonable, caring people can reach opposite moral conclusions — and why neither of them is simply wrong.",
    seoDescription:
      "Moral Foundations Theory reveals why people disagree on ethics: we use different moral foundations — Care, Fairness, Loyalty, Authority, Sanctity, Liberty. Discover yours on SplitVote.",
    date: '2026-05-10',
    readingTime: 6,
    tags: ['moral psychology', 'moral foundations', 'Jonathan Haidt', 'ethics', 'political psychology'],
    relatedDilemmaIds: ['trolley', 'innocent-juror', 'truth-friend', 'surveillance-city', 'mandatory-vaccine'],
    alternateSlug: 'teoria-fondamenti-morali',
    content: [
      {
        type: 'p',
        text: "You see a trolley heading toward five people. You can pull a lever and divert it — but that kills one person on the other track. You pull the lever. Your friend, equally thoughtful and equally compassionate, says they would never intervene: you'd be using someone as a means to an end. You're both moral people reasoning carefully. So why the complete disagreement?",
      },
      {
        type: 'p',
        text: "The answer, according to psychologist Jonathan Haidt, is that you're not using the same moral language. His Moral Foundations Theory proposes that human morality is built on several distinct psychological systems — and different people weight them differently. Understanding which foundations drive your reasoning changes how you interpret moral conflict.",
      },
      {
        type: 'h2',
        text: 'The six moral foundations',
      },
      {
        type: 'p',
        text: "Haidt and his colleagues identify six foundational moral intuitions that appear across cultures, though they are expressed differently in different societies:",
      },
      {
        type: 'list',
        items: [
          'Care / Harm — sensitivity to suffering and the impulse to protect the vulnerable. This is the foundation that makes cruelty feel viscerally wrong.',
          'Fairness / Cheating — concern for equal treatment, justice, and the punishment of those who take more than their share.',
          'Loyalty / Betrayal — the moral weight of group membership, solidarity, and the duty not to betray your tribe.',
          'Authority / Subversion — respect for legitimate hierarchy, tradition, and the institutions that coordinate social life.',
          'Sanctity / Degradation — the sense that some things are sacred and that certain acts are morally polluting regardless of their consequences.',
          'Liberty / Oppression — resistance to domination and the right to self-determination, even against authorities claiming to act for the common good.',
        ],
      },
      {
        type: 'p',
        text: "These six foundations are not equally weighted by everyone. Research suggests that people who self-identify as politically liberal tend to weight Care and Fairness most heavily — and are often sceptical of Loyalty, Authority, and Sanctity as valid moral concerns. People who self-identify as conservative tend to value all six more evenly, treating Loyalty, Authority, and Sanctity as genuine moral considerations, not mere social conventions.",
      },
      {
        type: 'h2',
        text: 'The trolley problem through a foundations lens',
      },
      {
        type: 'p',
        text: "Return to the trolley problem. Someone who weights Care heavily sees five lives that can be saved and acts. Someone who weights Sanctity and Loyalty more heavily may feel that actively causing a death — even to save more — crosses a line that passive inaction does not. Neither position is irrational. They are reasoning from different foundations.",
      },
      {
        type: 'cta',
        label: 'A trolley is heading toward five people. Pull the lever? →',
        href: '/play/trolley',
      },
      {
        type: 'h2',
        text: 'Fairness and the problem of innocent conviction',
      },
      {
        type: 'p',
        text: "Fairness-driven reasoning is particularly sensitive to procedural justice — not just whether outcomes are good, but whether the process that produces them is legitimate. This distinction shows up sharply in legal dilemmas: should you follow rules even when following them produces an outcome you know is unjust? Someone who weights Authority alongside Fairness may say yes — the system's legitimacy depends on consistent rule-following. Someone weighting only Fairness may say no — the point of the rules was never to produce injustice.",
      },
      {
        type: 'cta',
        label: 'You know the defendant is innocent. Convict to uphold the jury system? →',
        href: '/play/innocent-juror',
      },
      {
        type: 'h2',
        text: 'Loyalty and the hardest kind of honesty',
      },
      {
        type: 'p',
        text: "Loyalty is the foundation that makes betraying a friend feel almost physically wrong — even when the friend has done something objectively harmful. This is not irrationality. It reflects a genuine moral concern: relationships of trust are fragile and valuable, and the social fabric depends on people keeping them. The moral tension arises when Loyalty conflicts with Care (your friend's partner is being hurt) or Fairness (the truth matters). How you resolve that tension often reveals which foundation is running the deeper script in your moral reasoning.",
      },
      {
        type: 'cta',
        label: "Your best friend's partner is cheating. Tell them the truth? →",
        href: '/play/truth-friend',
      },
      {
        type: 'h2',
        text: 'Liberty, Authority, and the surveillance dilemma',
      },
      {
        type: 'p',
        text: "The Liberty foundation creates particular tension with Authority: what does a city owe its citizens when safety and freedom pull in opposite directions? People who weight Liberty highly experience surveillance as a direct violation — an imposition of control that undermines the autonomy the state exists to protect. People who weight Authority and Care more evenly may regard pervasive monitoring as an acceptable trade: a managed constraint in exchange for genuine security. Neither is simply wrong. They are calibrating different foundations.",
      },
      {
        type: 'cta',
        label: 'Total surveillance makes your city 30% safer. Accept the trade-off? →',
        href: '/play/surveillance-city',
      },
      {
        type: 'cta',
        label: 'Mandatory vaccines for all: justified by Care, or a violation of Liberty? →',
        href: '/play/mandatory-vaccine',
      },
      {
        type: 'h2',
        text: 'What the research says — and where it gets complicated',
      },
      {
        type: 'p',
        text: "Moral Foundations Theory has generated substantial research and also substantial criticism. Some critics argue that the theory conflates descriptive findings (people do weight these foundations) with normative claims (they should). Others note that the six foundations are not culturally universal in the way early formulations implied — they appear across societies, but their content and ranking vary considerably. The Liberty foundation was added to the original five partly in response to critics who felt the theory did not adequately capture libertarian moral intuitions.",
      },
      {
        type: 'p',
        text: "The practical insight that survives the theoretical debates is durable: most serious moral disagreements are not disagreements about facts or even about which outcomes matter. They are disagreements about which moral dimensions are relevant in the first place — and which should take priority when they conflict. Understanding that your moral opponent is weighting a different foundation, not ignoring the foundations you care about, can change how a difficult conversation goes.",
      },
      {
        type: 'h2',
        text: 'Your moral profile on SplitVote',
      },
      {
        type: 'p',
        text: "Every dilemma on SplitVote implicitly activates one or more moral foundations. The scenarios involving harm and protection activate Care. Dilemmas about following unjust rules activate Fairness and Authority in tension. Questions about loyalty, secrecy, and betrayal activate Loyalty. Scenarios involving surveillance, bodily autonomy, or drug policy activate Liberty and Sanctity. Voting across enough dilemmas builds a picture — not of your \"moral type\", but of which considerations you consistently treat as decisive when they come into conflict.",
      },
      {
        type: 'cta',
        label: 'Discover what your votes reveal about your moral personality →',
        href: '/personality',
      },
      {
        type: 'cta',
        label: 'Virtue ethics: what does a good person do? →',
        href: '/blog/virtue-ethics-what-would-a-good-person-do',
      },
      {
        type: 'cta',
        label: 'Explore all moral dilemmas →',
        href: '/moral-dilemmas',
      },
      {
        type: 'disclaimer',
        text: "Moral Foundations Theory is a theoretical framework in moral psychology, not a validated psychological test. References to Haidt and colleagues' work are for contextual background only. SplitVote dilemmas are for reflection and discussion — not clinical assessment. Results represent our community's votes, not scientific conclusions about individual personalities.",
      },
    ],
  },
  {
    slug: 'bioethics-when-medicine-forces-impossible-choices',
    locale: 'en',
    title: 'Bioethics — When Medicine Forces the Impossible Choices',
    seoTitle: 'Bioethics: When Medicine Forces the Hardest Moral Choices',
    description:
      "Who gets the one available organ? Is it right to end a life to relieve irremediable suffering? Bioethics studies the moral questions medicine raises that no protocol can fully answer.",
    seoDescription:
      "Bioethics explores the hardest moral questions in medicine — organ allocation, euthanasia, bodily autonomy, scarce resources. Vote on real dilemmas at SplitVote.",
    date: '2026-05-10',
    readingTime: 6,
    tags: ['bioethics', 'medical ethics', 'euthanasia', 'bodily autonomy', 'philosophy'],
    relatedDilemmaIds: ['organ-harvest', 'mercy-kill', 'mandatory-vaccine', 'pandemic-dose', 'brain-upload'],
    alternateSlug: 'bioetica-quando-la-medicina-impone-scelte-impossibili',
    content: [
      {
        type: 'p',
        text: "In a waiting room sit five patients on a transplant list. They will die without an organ. Into the emergency room arrives a healthy patient — a road accident. His organs are compatible with all five. No consent. No family reachable. The surgeon must decide. This hypothetical — deliberately extreme — captures something real about bioethics: its questions are not theoretical. They emerge every day in hospitals, ethics committees, and courtrooms.",
      },
      {
        type: 'p',
        text: "Bioethics is the branch of philosophy that studies the moral dimensions of decisions in medicine and the life sciences. Its questions concern the allocation of scarce resources, the limits of individual autonomy, the definition of death, and the justice of access to care.",
      },
      {
        type: 'h2',
        text: 'Four foundational principles',
      },
      {
        type: 'p',
        text: "The most influential framework in practical bioethics — that of Beauchamp and Childress — organises reasoning around four principles:",
      },
      {
        type: 'list',
        items: [
          'Autonomy — the right of the competent patient to make informed decisions about their own care, including the refusal of treatment.',
          'Non-maleficence — do not deliberately cause harm. The classical principle primum non nocere.',
          'Beneficence — act in the patient\'s interest, even when that requires invasive intervention.',
          'Justice — distribute benefits, risks, and resources fairly among patients and across society.',
        ],
      },
      {
        type: 'p',
        text: "Bioethical dilemmas arise when these principles enter direct conflict. Voluntary euthanasia sets autonomy against non-maleficence. Organ allocation sets beneficence against justice. Mandatory treatment — such as vaccination — sets public health against individual autonomy.",
      },
      {
        type: 'h2',
        text: 'Who gets the one available organ?',
      },
      {
        type: 'p',
        text: "Organ allocation is one of the most studied fields in bioethics because its trade-offs are brutally visible: donated organs are scarce, patients on waiting lists are many, and every selection criterion produces winners and losers. The criteria in use combine medical urgency, compatibility, waiting time, and, in some systems, likelihood of success. But every criterion embeds implicit values — about who counts more, about what constitutes a saved life, about whether 'fault' in illness should carry weight.",
      },
      {
        type: 'cta',
        label: 'Sacrifice one healthy patient to save five who need a transplant? →',
        href: '/play/organ-harvest',
      },
      {
        type: 'h2',
        text: 'Euthanasia: autonomy against the duty not to harm',
      },
      {
        type: 'p',
        text: "The debate over voluntary euthanasia is one of the most enduring in bioethics. Autonomy-based arguments hold that competent individuals have the right to control their own death when facing irremediable suffering. Welfare-based arguments focus on relieving suffering that no palliative treatment can manage. Slippery-slope arguments warn that legalising euthanasia exposes vulnerable populations to subtle pressure — perceiving themselves as a burden, choosing death for others' convenience.",
      },
      {
        type: 'p',
        text: "None of these arguments resolves cleanly. The controversy persists not because participants are irrational but because they weight different principles — autonomy against non-maleficence, individual compassion against systemic risk.",
      },
      {
        type: 'cta',
        label: 'A terminally ill patient asks you to end their suffering. Do you help? →',
        href: '/play/mercy-kill',
      },
      {
        type: 'h2',
        text: 'Bodily autonomy and public health',
      },
      {
        type: 'p',
        text: "The principle of autonomy — the right to make informed decisions about one's own body — is treated as near-sacred in contemporary bioethics. But medical decisions rarely concern only the individual. Vaccination protects people who cannot be vaccinated. Antibiotic resistance is shaped by individual prescription decisions. Donating blood, organs, or plasma affects availability for others. Bioethics must repeatedly confront the tension between the body as private property and the body as a node in a network of interdependence.",
      },
      {
        type: 'cta',
        label: 'Mandatory vaccines for everyone: justified by public health, or a violation of autonomy? →',
        href: '/play/mandatory-vaccine',
      },
      {
        type: 'h2',
        text: 'Scarce resources, impossible decisions',
      },
      {
        type: 'p',
        text: "Pandemics made visible the triage protocols that healthcare systems normally keep hidden: who gets the last ventilator when there are not enough? Who is treated first when emergency rooms are overwhelmed? Guidelines vary — by age, prognosis, order of arrival — but all must answer the same foundational question: how do you make an inherently unjust situation as fair as possible?",
      },
      {
        type: 'cta',
        label: 'One experimental vaccine dose. Give it to the sickest patient or the youngest? →',
        href: '/play/pandemic-dose',
      },
      {
        type: 'h2',
        text: 'Bioethics in the age of digital identity',
      },
      {
        type: 'p',
        text: "Emerging technologies push bioethics into new territory. If consciousness and memory could be uploaded to a digital substrate, is the surviving entity the same person? What rights would it have? Could it be terminated, copied, or sold? These scenarios look like science fiction but anticipate questions bioethics will need to face as brain-computer interface technologies advance — and they test which of our current moral concepts depend on biological assumptions that may not hold.",
      },
      {
        type: 'cta',
        label: 'Your digital self uploaded to a server — is it still you? →',
        href: '/play/brain-upload',
      },
      {
        type: 'h2',
        text: 'Why bioethics has no easy answers',
      },
      {
        type: 'p',
        text: "Bioethics is hard not for lack of data or expertise but because its dilemmas require choosing between genuinely competing values. A healthcare system that always prioritises individual autonomy cannot guarantee public health. One that always prioritises aggregate welfare will risk violating individual rights. The tension does not resolve — it is negotiated, case by case, with transparency about the values at stake.",
      },
      {
        type: 'cta',
        label: 'See how you reason across the hardest ethical dilemmas →',
        href: '/personality',
      },
      {
        type: 'cta',
        label: 'Consequentialism: does the end justify the means? →',
        href: '/blog/consequentialism-the-greatest-good',
      },
      {
        type: 'cta',
        label: 'Explore all moral dilemmas →',
        href: '/moral-dilemmas',
      },
      {
        type: 'disclaimer',
        text: "SplitVote presents ethical dilemmas for reflection and discussion. References to bioethics and philosophical literature are for contextual background only — the goal is to help you reflect, not to provide medical or legal advice. Results represent our community's votes, not scientific conclusions. If you are facing real medical decisions, consult a qualified healthcare professional.",
      },
    ],
  },
  {
    slug: 'experimental-moral-psychology-how-science-studies-moral-intuitions',
    locale: 'en',
    title: 'Experimental Moral Psychology — How Science Studies Why We Disagree',
    seoTitle: 'Experimental Moral Psychology: What Science Reveals About Moral Intuitions',
    description:
      "Experimental moral psychology uses empirical methods to study how people actually reason about right and wrong — and the findings are often surprising. We are less rational, more emotional, and more inconsistent than we believe.",
    seoDescription:
      "Experimental moral psychology studies how people reason about ethics — revealing dual-process thinking, moral dumbfounding, and cross-cultural patterns. Explore the science on SplitVote.",
    date: '2026-05-10',
    readingTime: 6,
    tags: ['moral psychology', 'experimental philosophy', 'moral intuitions', 'Joshua Greene', 'trolley problem'],
    relatedDilemmaIds: ['trolley', 'self-driving-crash', 'robot-judge', 'organ-harvest', 'innocent-juror'],
    alternateSlug: 'psicologia-morale-sperimentale-come-la-scienza-studia-le-intuizioni-morali',
    content: [
      {
        type: 'p',
        text: "Ask someone whether it is acceptable to push a large man off a footbridge to stop a runaway trolley and save five lives. Most say no — immediately, viscerally. Ask them whether pulling a lever that diverts the trolley onto a track where one person will die is acceptable. Most say yes. The arithmetic is identical. The moral reaction is not. This asymmetry — replicated across thousands of participants in dozens of countries — is one of the founding observations of experimental moral psychology.",
      },
      {
        type: 'p',
        text: "Experimental moral psychology applies the methods of cognitive science and empirical psychology to questions that philosophy has traditionally studied from the armchair. Instead of reasoning about what people should think, researchers measure what they do think — and the picture that emerges is more complicated than standard philosophical theories predict.",
      },
      {
        type: 'h2',
        text: 'Two systems, one dilemma',
      },
      {
        type: 'p',
        text: "Psychologist Joshua Greene proposed that the footbridge asymmetry reflects two competing cognitive systems. System 1 — fast, automatic, emotional — fires an alarm when you imagine physically pushing someone to their death. System 2 — slower, deliberative, consequentialist — calculates that one death is better than five and endorses the intervention. In the lever case, the emotional alarm is quieter: the action is indirect, impersonal, mechanical. System 2 has more room to run its calculation.",
      },
      {
        type: 'p',
        text: "This dual-process account has been influential and controversial. Critics argue it over-simplifies — that emotional responses can themselves be tracking morally relevant features of a situation, not just triggering irrational bias. The debate has not resolved, but it has sharpened: the question is no longer whether emotion influences moral judgment, but whether it does so reliably, and in what direction.",
      },
      {
        type: 'cta',
        label: 'Pull the lever and divert the trolley — one death to save five? →',
        href: '/play/trolley',
      },
      {
        type: 'h2',
        text: 'Moral dumbfounding',
      },
      {
        type: 'p',
        text: "Psychologist Jonathan Haidt studied a different phenomenon: moral dumbfounding. Participants were told a story about a brother and sister who have consensual sex once, enjoy it, and decide never to repeat it — no one is harmed, the act is kept private. When asked if it was wrong, most participants said yes, immediately. When asked why, they struggled. Each reason they offered — risk of genetic harm, psychological damage — was pre-empted by the story's stipulations. Yet they maintained their verdict, often citing a strong feeling that it was just wrong.",
      },
      {
        type: 'p',
        text: "Haidt concluded that moral judgments are often made first by intuition and rationalised afterwards — that we construct reasons to explain verdicts we have already reached. This 'social intuitionist model' contrasts sharply with the Enlightenment picture of the moral reasoner carefully weighing principles before concluding.",
      },
      {
        type: 'cta',
        label: 'A self-driving car must choose who to save. Program it how? →',
        href: '/play/self-driving-crash',
      },
      {
        type: 'h2',
        text: 'What varies across cultures — and what does not',
      },
      {
        type: 'p',
        text: "Cross-cultural studies have complicated simple claims about universal moral intuitions. Some findings travel reliably: the preference for saving more lives over fewer, the distinction between harm caused directly and harm caused indirectly. Others do not: intuitions about authority, purity, and in-group loyalty show considerably more variation. The Moral Foundations research suggests this variation is not noise but structure — different societies emphasise different foundations, producing coherent but distinct moral systems rather than rational agreement on universal rules.",
      },
      {
        type: 'cta',
        label: 'Should an AI judge criminal cases better than a human court? →',
        href: '/play/robot-judge',
      },
      {
        type: 'h2',
        text: 'What happens when stakes rise',
      },
      {
        type: 'p',
        text: "One consistent finding is that the framing of a moral dilemma changes its verdict. Describing the same action using passive versus active language, or personal versus statistical victims, can flip majority responses. This is disturbing for anyone who believes that moral judgments track objective features of situations — if the frame changes the verdict, what exactly is being tracked?",
      },
      {
        type: 'p',
        text: "Researchers have proposed different explanations: framing effects reveal cognitive biases that corrupt moral reasoning; framing effects reveal that different framings describe genuinely different situations (active harm really is different from passive allowance); or framing effects reveal that moral judgment is context-sensitive in ways our theories have failed to capture. Each explanation carries different implications for how seriously to take moral intuitions as evidence.",
      },
      {
        type: 'cta',
        label: 'Harvest one patient\'s organs to save five who need transplants? →',
        href: '/play/organ-harvest',
      },
      {
        type: 'h2',
        text: 'What SplitVote data adds to this picture',
      },
      {
        type: 'p',
        text: "Every vote on SplitVote is, in miniature, a data point in this research tradition. The platform does not claim to be a scientific instrument — the sample is not random, participation is voluntary, and the framing of each dilemma is fixed. But at sufficient scale, consistent patterns across thousands of votes on identical scenarios create a signal worth examining: which dilemmas split people most evenly? Which produce landslides? Do the same scenarios that divided laboratory participants in published studies divide SplitVote users in similar proportions?",
      },
      {
        type: 'cta',
        label: 'You know the defendant is innocent. Vote to convict to uphold the rule of law? →',
        href: '/play/innocent-juror',
      },
      {
        type: 'h2',
        text: 'The limits of the science',
      },
      {
        type: 'p',
        text: "Experimental moral psychology is a young field and its findings are not always stable. Several high-profile results have failed to replicate. The populations studied have historically skewed heavily toward Western, educated, industrialised, rich, and democratic (WEIRD) societies — a limitation that the field has increasingly worked to address. The dual-process account of moral cognition remains contested at the theoretical level even as its individual empirical findings accumulate.",
      },
      {
        type: 'p',
        text: "The field's most durable contribution may be methodological: it has demonstrated that the data of moral philosophy — what people believe and why — can be studied empirically, and that the results often surprise our prior theories. Whatever the correct account of moral reasoning turns out to be, it will need to explain the trolley asymmetry, the dumbfounding effect, and the cross-cultural patterns this research has documented.",
      },
      {
        type: 'cta',
        label: 'Discover what your votes reveal about your moral reasoning →',
        href: '/personality',
      },
      {
        type: 'cta',
        label: 'Moral Foundations Theory — why good people disagree →',
        href: '/blog/moral-foundations-theory-why-good-people-disagree',
      },
      {
        type: 'cta',
        label: 'Explore all moral dilemmas →',
        href: '/moral-dilemmas',
      },
      {
        type: 'disclaimer',
        text: "References to Greene, Haidt, and experimental moral philosophy research are for contextual background only. SplitVote is an entertainment and reflection platform, not a scientific study. Results represent community votes — not peer-reviewed data, and not conclusions about individual moral character. The dual-process theory described here is contested within cognitive science and moral philosophy.",
      },
    ],
  },
  {
    slug: 'why-we-disagree-on-ethics',
    locale: 'en',
    title: 'Why We Disagree on Ethics: The Science Behind Moral Disagreement',
    seoTitle: 'Why Good People Disagree on Ethics — Moral Psychology Explained',
    description:
      'Smart, caring people reach opposite conclusions on the same moral dilemma. Research in moral psychology and Moral Foundations Theory reveals why — and what it means.',
    seoDescription:
      'Good people disagree on ethics because of how our brains evolved, how culture shaped our moral foundations, and how emotions outrun reasoning. Science explains the gap.',
    date: '2026-05-10',
    readingTime: 7,
    tags: ['ethics', 'moral psychology', 'moral foundations theory', 'moral disagreement', 'trolley problem'],
    relatedDilemmaIds: ['trolley', 'self-driving-crash', 'robot-judge', 'organ-harvest', 'innocent-juror'],
    alternateSlug: 'perche-non-siamo-daccordo-sull-etica',
    content: [
      {
        type: 'p',
        text: 'Two thoughtful, well-intentioned people look at the same trolley problem and reach opposite conclusions. One says pull the lever — save five lives. The other says keep your hands clean — you cannot use someone as a means to an end. Both have reasons. Both feel certain. Neither is obviously confused or cruel. So what is actually happening?',
      },
      {
        type: 'p',
        text: 'Research in moral psychology over the past three decades has assembled a partial answer — and it is more unsettling than "one person has better values." Moral disagreement appears to be built into the architecture of human reasoning, shaped by evolution, culture, and the competing cognitive systems we use to evaluate right and wrong.',
      },
      {
        type: 'h2',
        text: 'Moral foundations are not all the same',
      },
      {
        type: 'p',
        text: 'Psychologist Jonathan Haidt and colleagues proposed Moral Foundations Theory as one account of why moral disagreement runs so deep. The theory identifies several distinct moral intuitive concerns that all human societies draw on — including care, fairness, loyalty, authority, and purity — but in different proportions. Political liberals tend to weigh care and fairness heavily. Conservatives tend to weigh loyalty, authority, and purity alongside care and fairness.',
      },
      {
        type: 'p',
        text: 'This does not mean one group is right and the other is wrong. It means that the same dilemma activates different moral modules in different people. When someone says "I cannot betray my group, even to prevent greater harm," they are not being irrational — they are running on a different moral operating system, one that assigns heavy weight to the loyalty foundation. When someone else says "the numbers are the numbers — five lives outweigh one," they are running a care-and-fairness-dominated calculation.',
      },
      {
        type: 'cta',
        label: 'Pull the lever — is it right to sacrifice one to save five? →',
        href: '/play/trolley',
      },
      {
        type: 'h2',
        text: 'Two cognitive systems, one dilemma',
      },
      {
        type: 'p',
        text: "A separate strand of research, associated primarily with psychologist Joshua Greene at Harvard, focuses not on the content of moral foundations but on the process of moral reasoning. Greene's influential dual-process account proposes that moral judgments are produced by two competing systems: a fast, automatic, emotionally-driven System 1, and a slower, deliberative, more consequentialist System 2.",
      },
      {
        type: 'p',
        text: 'Classic trolley experiments illustrate the tension. Most people are willing to pull a lever that redirects a trolley, killing one to save five. Far fewer are willing to push a large man off a bridge to achieve the same arithmetic result. The math is identical. The physical immediacy is not — and System 1, which evolved to respond strongly to direct physical harm, fires much harder in the footbridge version. Whether that emotional signal is tracking a genuine moral distinction (direct harm really is different from indirect harm) or producing a bias (numbers should be what matter) is still debated.',
      },
      {
        type: 'cta',
        label: 'How should an autonomous car decide who lives in a crash? →',
        href: '/play/self-driving-crash',
      },
      {
        type: 'h2',
        text: 'Cross-cultural patterns — and where they break down',
      },
      {
        type: 'p',
        text: 'A 2018 study published in Nature — the Moral Machine experiment — collected over 40 million moral decisions from people across 233 countries, asking how self-driving cars should prioritize lives in unavoidable crash scenarios. Some patterns were remarkably stable across cultures: a preference for saving more lives over fewer, a preference for sparing children over the elderly. Others varied sharply: preferences for sparing higher-status individuals, for prioritizing pedestrians over passengers, and for swerving versus staying straight differed substantially by region.',
      },
      {
        type: 'p',
        text: 'The cross-cultural variation suggests that moral foundations are not a fixed human universal. Culture shapes which concerns get weighted heavily, which scenarios activate moral alarm, and which tradeoffs feel acceptable. The same action that feels like an obvious violation in one moral community may feel like the obvious right answer in another.',
      },
      {
        type: 'cta',
        label: 'Should an AI judge decide criminal cases better than human courts? →',
        href: '/play/robot-judge',
      },
      {
        type: 'h2',
        text: 'The moral dumbfounding problem',
      },
      {
        type: 'p',
        text: "Haidt's research on \"moral dumbfounding\" adds another layer. When people are presented with scenarios that trigger strong moral intuitions but where every harm-based justification has been pre-empted by the story's setup, many continue to maintain that something is wrong — even when they cannot say what the harm is. They know it feels wrong before they know why.",
      },
      {
        type: 'p',
        text: 'This suggests that moral reasoning is often post-hoc rationalization rather than the cause of moral verdicts. We reach conclusions first, via intuition, and then construct arguments to justify them. If that is accurate, then moral disagreement may persist even after extensive rational discussion — because the argument was never really what was driving the verdict.',
      },
      {
        type: 'cta',
        label: "Harvest one patient's organs to save five waiting for transplants? →",
        href: '/play/organ-harvest',
      },
      {
        type: 'h2',
        text: 'What SplitVote data shows',
      },
      {
        type: 'p',
        text: 'On SplitVote, the same dilemmas that have split laboratory participants split real-world voters in remarkably similar proportions. Trolley-style scenarios that pit aggregate welfare against individual rights tend to produce near-even splits. Scenarios that activate strong emotional alarm — physical immediacy, identifiable victims, violations of bodily autonomy — tend to produce stronger consensus, often against the arithmetically "efficient" outcome.',
      },
      {
        type: 'p',
        text: 'SplitVote is not a scientific instrument — the sample is self-selected, the framing is fixed, and individual votes carry no experimental controls. But at scale, the patterns are suggestive: moral disagreement is not random noise. It clusters around the fault lines that moral psychology has identified — System 1 vs. System 2 activation, loyalty vs. harm-prevention foundations, cultural variation in authority and purity concerns.',
      },
      {
        type: 'cta',
        label: 'You know the defendant is innocent — do you still vote to convict? →',
        href: '/play/innocent-juror',
      },
      {
        type: 'h2',
        text: 'Is moral disagreement resolvable?',
      },
      {
        type: 'p',
        text: 'Moral psychology does not settle the philosophical question of whether there are objective moral truths that disagreement fails to reach. But it does reframe the question. If two people disagree on a moral dilemma, it may not be because one has thought harder than the other. It may be because they are activating different emotional systems, weighing different foundations, or applying frameworks shaped by different cultural histories.',
      },
      {
        type: 'p',
        text: 'That is not a counsel of relativism. Some moral positions are still better reasoned than others, more consistent, more attentive to evidence. But it is a reason for epistemic humility: the confidence that feels like clarity may be a fast-responding System 1 alarm, not a carefully derived conclusion. Moral progress — when it happens — usually requires slowing down enough to examine the intuitions rather than simply trusting them.',
      },
      {
        type: 'cta',
        label: 'See your moral personality based on how you vote →',
        href: '/personality',
      },
      {
        type: 'cta',
        label: 'Experimental moral psychology — how science studies moral intuitions →',
        href: '/blog/experimental-moral-psychology-how-science-studies-moral-intuitions',
      },
      {
        type: 'cta',
        label: 'Moral Foundations Theory — why good people disagree →',
        href: '/blog/moral-foundations-theory-why-good-people-disagree',
      },
      {
        type: 'disclaimer',
        text: "References to Moral Foundations Theory, dual-process moral cognition, and the Moral Machine study are for contextual and educational purposes. SplitVote is an entertainment and reflection platform, not a scientific study. Results represent community votes — not peer-reviewed data, and not conclusions about individual moral character. Theories described here are contested within moral philosophy and cognitive science.",
      },
    ],
  },
  {
    slug: 'why-good-people-do-nothing',
    locale: 'en',
    title: 'Why Good People Do Nothing: The Psychology of Moral Inaction',
    seoTitle: 'Why Good People Do Nothing — The Bystander Effect Explained',
    description:
      'Being capable of helping is not the same as helping. Research on the bystander effect, diffusion of responsibility, and moral disengagement explains why decent people walk past.',
    seoDescription:
      'Good people often fail to act in moral emergencies. The bystander effect, diffusion of responsibility, and pluralistic ignorance explain why — and what changes it.',
    date: '2026-05-10',
    readingTime: 7,
    tags: ['moral psychology', 'bystander effect', 'moral inaction', 'diffusion of responsibility', 'ethics'],
    relatedDilemmaIds: ['innocent-juror', 'cure-secret', 'organ-harvest', 'trolley', 'self-driving-crash'],
    alternateSlug: 'perche-le-persone-buone-non-fanno-nulla',
    content: [
      {
        type: 'p',
        text: 'In 1964, a young woman was attacked outside her apartment building in New York. The incident became one of the most cited cases in the history of social psychology — not primarily because of what happened, but because of the newspaper story that followed: that 38 witnesses had watched from their windows and done nothing. The number and the story were later shown to be largely fabricated by the press. But the question the case sparked was real: why do groups of people sometimes fail to act when individuals are in obvious need?',
      },
      {
        type: 'p',
        text: 'Two psychologists, John Darley and Bibb Latané, decided to find out. The experiments they designed over the next decade produced results that are still deeply uncomfortable: the presence of other people does not make us more likely to help. In many circumstances, it makes us significantly less likely to help. They called it the bystander effect.',
      },
      {
        type: 'h2',
        text: 'The experiment that changed how we think about moral action',
      },
      {
        type: 'p',
        text: "In Darley and Latané's most famous study, participants sat alone or in groups while they believed a fellow participant began to have an epileptic seizure — communicated via an intercom. When participants were alone, 85 percent sought help within six minutes. When they believed four other people were also listening, that number dropped to 31 percent. The emergency was identical. The only variable was the number of observers.",
      },
      {
        type: 'p',
        text: 'What was happening was not callousness. Most participants who did not act were visibly distressed — they fidgeted, looked anxious, seemed genuinely upset. They were not indifferent to what they were hearing. They were caught in a social and cognitive trap that paralysed their response.',
      },
      {
        type: 'h2',
        text: 'Diffusion of responsibility',
      },
      {
        type: 'p',
        text: "The first trap is diffusion of responsibility. When many people witness an emergency, each individual feels personally less responsible for resolving it. If you are the only one who sees someone collapse, the moral weight falls entirely on you. If twenty people see it, your share of the responsibility feels like one twentieth — even though the person still needs help just as urgently. The group doesn't pool its capacity; it dilutes it.",
      },
      {
        type: 'p',
        text: "This is not a character flaw unique to cowards. It is a feature of how human beings process shared moral situations. We evolved in small groups where responsibility was naturally clear. We did not evolve good intuitions for mass-observer scenarios. The same person who would act decisively alone may freeze completely when surrounded by others who are also watching.",
      },
      {
        type: 'cta',
        label: 'You know the defendant is innocent — do you still vote to convict? →',
        href: '/play/innocent-juror',
      },
      {
        type: 'h2',
        text: 'Pluralistic ignorance',
      },
      {
        type: 'p',
        text: 'The second trap is pluralistic ignorance — a phenomenon where every individual in a group privately doubts the prevailing norm, but assumes everyone else endorses it. Each person looks at the others for signals about how to interpret an ambiguous situation. If nobody is acting, everyone assumes there must be a reason — maybe it is not really an emergency, maybe help is already on the way, maybe the right response is to wait.',
      },
      {
        type: 'p',
        text: 'The silence of the crowd is read as evidence that silence is appropriate. Everyone suppresses their individual concern and mirrors the inaction around them — while privately feeling uneasy. The result is a group that collectively produces a response (none) that no individual actually endorses.',
      },
      {
        type: 'cta',
        label: 'A scientist has the cure for a fatal disease — but keeps it secret. Is that wrong? →',
        href: '/play/cure-secret',
      },
      {
        type: 'h2',
        text: 'Moral disengagement — how we quiet the alarm',
      },
      {
        type: 'p',
        text: "Psychologist Albert Bandura identified a different but related mechanism: moral disengagement. Rather than being blocked from acting, people actively construct reasons why they are not obligated to act. Bandura identified several mechanisms through which this happens: moral justification (convincing yourself the action would cause greater harm), euphemistic labelling (calling inaction 'not getting involved' rather than 'abandoning someone in need'), diffusion of agency across a group, and dehumanising or depersonalising the victim.",
      },
      {
        type: 'p',
        text: "These are not conscious strategies of self-deception. They operate quickly and automatically. By the time you have talked yourself out of intervening, you may genuinely believe the intervention was unnecessary or harmful. The alarm was real; the disengagement reasoning came after it, manufacturing justification for an inaction that was already attractive for other reasons.",
      },
      {
        type: 'cta',
        label: "Harvest one patient's organs to save five waiting for transplants? →",
        href: '/play/organ-harvest',
      },
      {
        type: 'h2',
        text: 'The capable bystander problem',
      },
      {
        type: 'p',
        text: 'There is a philosophical tradition that holds we are more culpable for harms we cause than for harms we merely allow. The distinction between commission and omission is built into many legal systems and many people\'s moral intuitions. But the bystander research complicates this framework in an important way: being capable of preventing a harm and choosing not to — while being aware of the harm and the capacity — starts to look much more like a moral choice than a passive default.',
      },
      {
        type: 'p',
        text: "A bystander who watches someone drown while holding a life ring has not merely failed to help. They have made a series of real-time decisions: not to throw the ring, not to call for help, not to shout. Inaction, in circumstances where action was available and obvious, is itself an act. The question is whether our moral intuitions are well-calibrated to treat it that way.",
      },
      {
        type: 'cta',
        label: 'Pull the lever — is it right to sacrifice one to save five? →',
        href: '/play/trolley',
      },
      {
        type: 'h2',
        text: 'What SplitVote data shows about inaction',
      },
      {
        type: 'p',
        text: "On SplitVote, dilemmas that involve clear action — pulling a lever, making an intervention, overriding a system — tend to produce closer splits than their omission equivalents. Scenarios where the question is whether to do something active to cause a harm consistently produce more resistance than scenarios where the same harm results from choosing not to act. The commission-omission asymmetry that philosophers have debated for decades appears clearly in how real people vote.",
      },
      {
        type: 'p',
        text: "What is less clear from voting data is whether people are aware of this asymmetry in their own reasoning. Many voters who would decline to actively cause a harm would also decline to prevent an equivalent harm — and often feel the two positions are entirely consistent. The moral discomfort shows up differently depending on which direction the action faces.",
      },
      {
        type: 'cta',
        label: 'How should an autonomous car decide who lives in a crash? →',
        href: '/play/self-driving-crash',
      },
      {
        type: 'h2',
        text: 'What actually changes bystander behaviour',
      },
      {
        type: 'p',
        text: 'Darley and Latané also studied interventions that reduce the bystander effect. The most reliable is specificity: being directly addressed by name, or being clearly designated as the person responsible, dramatically increases the probability of action. "Someone call an ambulance" produces less response than "You, in the blue jacket — call an ambulance now." Responsibility that is diffuse stays diffuse; responsibility that is made explicit lands differently.',
      },
      {
        type: 'p',
        text: "A second intervention is prior awareness of the effect itself. People who have been told about the bystander effect and diffusion of responsibility before entering a scenario are meaningfully more likely to act against the crowd signal. This is one of the few cases in social psychology where knowing the bias genuinely seems to reduce it — which is one reason the research continues to be worth discussing.",
      },
      {
        type: 'cta',
        label: 'See your moral personality based on how you vote →',
        href: '/personality',
      },
      {
        type: 'cta',
        label: 'Why good people disagree on ethics — moral psychology explained →',
        href: '/blog/why-we-disagree-on-ethics',
      },
      {
        type: 'cta',
        label: 'Doing vs. allowing harm — is there a moral difference? →',
        href: '/blog/doing-vs-allowing-harm',
      },
      {
        type: 'disclaimer',
        text: "References to bystander effect research, diffusion of responsibility, pluralistic ignorance, and moral disengagement are for contextual and educational purposes. Original research described is attributed to Darley, Latané, and Bandura. The Kitty Genovese case summary reflects revised historical accounts that challenged early press reports. SplitVote is an entertainment and reflection platform, not a scientific study. Voting data described represents community patterns, not controlled experimental results.",
      },
    ],
  },
  {
    slug: 'trolley-problem-moral-personality',
    locale: 'en',
    title: 'What Your Trolley Problem Answer Reveals About Your Moral Personality',
    seoTitle: 'What Your Trolley Problem Answer Says About Your Moral Personality',
    description:
      'Most people pull the lever — but nearly half do not. The reason why reveals something deep about how your moral brain works.',
    seoDescription:
      'Do you pull the lever on the trolley problem? Your answer reveals whether you reason like a utilitarian or a deontologist — and maps to a specific moral personality archetype.',
    date: '2026-05-10',
    readingTime: 6,
    tags: ['trolley problem', 'moral psychology', 'ethics', 'personality'],
    relatedDilemmaIds: ['trolley', 'organ-harvest', 'self-driving-crash', 'innocent-juror', 'cure-secret'],
    alternateSlug: 'problema-tram-personalita-morale',
    content: [
      {
        type: 'p',
        text: 'A trolley is speeding toward five people who are tied to the tracks. You are standing next to a lever. Pull it, and the trolley diverts onto a side track — where one person stands. Do nothing, and five people die. What do you do?',
      },
      {
        type: 'p',
        text: 'Most people pull the lever. But the split is never 90/10. On SplitVote, it consistently runs closer to 60/40. That persistent minority — people who refuse to pull — is not confused or cruel. They have a coherent moral framework that leads them to a different conclusion.',
      },
      {
        type: 'p',
        text: 'The trolley problem was designed by philosopher Philippa Foot in 1967 precisely to expose this kind of deep disagreement. Six decades later, it remains the most discussed thought experiment in moral philosophy — and the divergence in answers has never fully closed.',
      },
      {
        type: 'cta',
        label: 'Vote on the trolley problem now →',
        href: '/play/trolley',
      },
      {
        type: 'h2',
        text: 'Two moral frameworks, one lever',
      },
      {
        type: 'p',
        text: 'The core reason people split on the trolley problem is that they are operating under fundamentally different moral frameworks — without always knowing it.',
      },
      {
        type: 'p',
        text: 'Utilitarians count outcomes: five lives saved outweigh one lost. For them, pulling the lever is not just permissible — it is required. Failing to pull it is a moral failure of omission. Deontologists focus on acts rather than consequences: pulling the lever makes you the agent of the one person\'s death. You are using someone as a means to save others. That, for many, is a line they will not cross regardless of the arithmetic.',
      },
      {
        type: 'list',
        items: [
          'Pull the lever → utilitarian reasoning: outcomes matter most',
          'Don\'t pull → deontological reasoning: some acts are wrong regardless of outcomes',
          'Can\'t decide → virtue ethics: what would a good person do in this situation?',
        ],
      },
      {
        type: 'h2',
        text: 'The footbridge variant changes everything',
      },
      {
        type: 'p',
        text: 'Philosopher Judith Jarvis Thomson introduced a variant that scrambles the intuitions: you are on a footbridge above the tracks. Next to you stands a large man. If you push him onto the tracks, his body will stop the trolley and save five lives. He will die. Do you push?',
      },
      {
        type: 'p',
        text: 'Most people say no — even those who pulled the lever in the original version. The arithmetic is identical (one death saves five), but the physical act of pushing someone changes the moral response dramatically.',
      },
      {
        type: 'p',
        text: 'Researchers including Joshua Greene at Harvard have used this divergence to argue that two separate cognitive systems are active in moral judgment: a fast emotional system that reacts to the physical act of pushing, and a slower deliberative system that calculates consequences. In the lever case, the emotional response is lower — pulling a lever is more abstract. In the footbridge case, it overpowers the calculation for most people.',
      },
      {
        type: 'cta',
        label: 'Vote: would you harvest one organ to save five lives? →',
        href: '/play/organ-harvest',
      },
      {
        type: 'h2',
        text: 'The doctrine of double effect',
      },
      {
        type: 'p',
        text: 'Catholic moral philosophy developed a principle — the doctrine of double effect — that many people apply intuitively without knowing the name. An action that causes harm is permissible if: the action itself is not intrinsically wrong; you intend the good effect, not the bad; the bad effect is a foreseen side effect, not the means to the good; and the good effect is proportionate to the bad.',
      },
      {
        type: 'p',
        text: 'Under this doctrine, pulling the lever is acceptable (you intend to save five; the death of one is a foreseen side effect). Pushing the man is not (his death is the direct means to saving the others). This maps precisely onto why so many people who pull the lever also refuse to push.',
      },
      {
        type: 'h2',
        text: 'Your answer and your moral archetype',
      },
      {
        type: 'p',
        text: 'How you answer the trolley problem is not a perfect predictor of your moral type — but it is a signal. SplitVote\'s personality system maps voters across five ethical axes. Trolley problem responses tend to cluster around three archetypes:',
      },
      {
        type: 'list',
        items: [
          'Guardians and Sentinels: rule-oriented, tend not to pull — preserving the order of who caused the threat matters',
          'Strategists and Oracles: outcome-focused, tend to pull — five lives saved is five lives saved',
          'Empaths and Caretakers: emotionally driven, often conflicted — feel both the five and the one acutely, may refuse to choose',
        ],
      },
      {
        type: 'p',
        text: 'Of course, context changes everything. People who pull the lever on the basic trolley problem may refuse when the victim is someone they love. Moral responses are stable across populations but variable within individuals when the stakes become personal.',
      },
      {
        type: 'cta',
        label: 'Discover your moral personality archetype →',
        href: '/personality',
      },
      {
        type: 'h2',
        text: 'Cross-dilemma consistency: does your answer hold?',
      },
      {
        type: 'p',
        text: 'The interesting question is not just what you answer on the trolley problem — it is whether you are consistent across related scenarios. People who identify as consequentialists sometimes refuse to answer consistently when the victim is personalized. People who claim deontological principles sometimes allow exceptions when lives saved rise from five to fifty.',
      },
      {
        type: 'p',
        text: 'That inconsistency is not hypocrisy — it is a feature of moral psychology. Real ethical reasoning is often more intuition-driven and context-sensitive than we like to admit. The trolley problem surfaces this gap between stated principles and actual responses.',
      },
      {
        type: 'cta',
        label: 'Vote: who is responsible when a self-driving car must choose? →',
        href: '/play/self-driving-crash',
      },
      {
        type: 'h2',
        text: 'What does it mean for real-world ethics?',
      },
      {
        type: 'p',
        text: 'Trolley problems were dismissed for decades as overly abstract. Then real-world analogues arrived: self-driving car algorithms that must prioritize in crash scenarios, triage protocols during pandemics, AI systems that optimize for metrics that may harm individuals.',
      },
      {
        type: 'p',
        text: 'The question of whether to divert harm — and who bears the cost — is no longer hypothetical. The split we see on SplitVote between outcome-thinkers and rule-thinkers reflects a genuine societal divide over how those systems should be built.',
      },
      {
        type: 'cta',
        label: 'Vote: innocent prisoner — stay silent or testify? →',
        href: '/play/innocent-juror',
      },
      {
        type: 'cta',
        label: 'What is a moral dilemma? →',
        href: '/blog/what-is-a-moral-dilemma',
      },
      {
        type: 'cta',
        label: 'Consequentialism: the greatest good for the greatest number →',
        href: '/blog/consequentialism-the-greatest-good',
      },
      {
        type: 'disclaimer',
        text: 'References to trolley problem research, dual-process moral psychology, and the doctrine of double effect are for contextual and educational purposes. Research described is attributed to Philippa Foot, Judith Jarvis Thomson, and Joshua Greene. SplitVote is an entertainment and reflection platform, not a scientific study. Archetype associations described are illustrative patterns, not statistically validated predictions.',
      },
    ],
  },
  // G15
  {
    slug: 'moral-emotions-gut-feeling-moral-compass',
    locale: 'en',
    title: 'Moral Emotions: When Your Gut Feeling Is Your Moral Compass',
    seoTitle: 'Moral Emotions: How Gut Feelings Drive Ethical Judgment | SplitVote',
    description:
      'Your gut reacts before your brain explains itself. Research shows moral emotions — disgust, guilt, elevation — are the real engines of ethical judgment.',
    seoDescription:
      'Discover how moral emotions like disgust, guilt, and elevation shape your ethical choices before you start reasoning. Based on Haidt\'s social intuitionist model.',
    date: '2026-05-10',
    readingTime: 7,
    tags: ['moral psychology', 'emotions', 'intuition', 'Haidt', 'ethics'],
    relatedDilemmaIds: ['organ-harvest', 'trolley', 'cure-secret', 'self-driving-crash'],
    alternateSlug: 'emozioni-morali-istinto-bussola-morale',
    content: [
      {
        type: 'p',
        text: 'A surgeon has five patients dying of organ failure. One healthy patient arrives for a routine check-up. Harvesting that patient\'s organs would save five lives and end one.',
      },
      {
        type: 'p',
        text: 'Almost everyone recoils immediately. The reasoning comes later — if it comes at all.',
      },
      {
        type: 'p',
        text: 'Jonathan Haidt called this "the emotional dog wagging the rational tail." Your gut fires first. Your reasoning faculty follows — often working backward to justify the verdict that already arrived.',
      },
      {
        type: 'h2',
        text: 'What are moral emotions?',
      },
      {
        type: 'p',
        text: 'Moral emotions are feelings that arise specifically in response to perceived right or wrong behaviour — whether by yourself or by others.',
      },
      {
        type: 'p',
        text: 'They differ from general emotions in one key way: they carry moral meaning. You feel guilty because you believe you caused harm. You feel elevated when you witness unexpected kindness. You feel contempt when someone violates what you consider basic decency.',
      },
      {
        type: 'p',
        text: 'Psychologist Paul Ekman catalogued six basic emotions. Jonathan Haidt extended that framework to moral emotions specifically: guilt, shame, elevation, moral anger, contempt — and, critically, disgust.',
      },
      {
        type: 'h2',
        text: 'The elephant and the rider',
      },
      {
        type: 'p',
        text: 'In 2001, Haidt published a paper that shifted moral psychology. He proposed the Social Intuitionist Model: moral judgments are primarily driven by fast, automatic emotional responses — and reasoning is recruited afterwards to explain or defend them.',
      },
      {
        type: 'p',
        text: 'The metaphor he later popularised: the elephant and the rider. The elephant is the intuitive, emotional system — large, powerful, hard to steer. The rider is reasoning — perched on top, believing it is in control, but mostly rationalising where the elephant was already going.',
      },
      {
        type: 'p',
        text: 'This directly challenged the rationalist tradition in moral psychology — the view, following Kohlberg, that moral development means learning to reason better. Haidt\'s answer: you are mostly a post-hoc rationaliser of gut feelings. And that is not a bug.',
      },
      {
        type: 'h2',
        text: 'Moral dumbfounding — when emotions outrun reasoning',
      },
      {
        type: 'p',
        text: 'Haidt\'s most striking demonstration involved scenarios designed to provoke strong gut reactions while blocking the usual harm-based justifications.',
      },
      {
        type: 'p',
        text: 'The classic example: a sibling pair who, once while travelling, consensually have sex. They use protection. Both enjoy it. It brings them closer. They never do it again. No one is harmed and no one ever finds out.',
      },
      {
        type: 'p',
        text: 'Most people immediately say this is wrong. When pressed for reasons, they cite harms — disease, pregnancy, psychological damage. The researchers point out these are explicitly ruled out by the scenario. Most people hold firm: "It\'s just wrong." They have been morally dumbfounded — certain in their judgment, unable to justify it, unwilling to abandon it.',
      },
      {
        type: 'p',
        text: 'Haidt\'s conclusion: the certainty came from an emotional response. The reasoning was an attempt to articulate that response, not to derive it.',
      },
      {
        type: 'h2',
        text: 'Disgust: the moral emotion that colonised other domains',
      },
      {
        type: 'p',
        text: 'Of all moral emotions, disgust is the most studied and the most surprising in its reach.',
      },
      {
        type: 'p',
        text: 'Disgust evolved as a pathogen-avoidance system. It fires in response to potential contaminants: rotting food, bodily fluids, parasites. The physiological response — nausea, turning away, the characteristic "ick" expression — is ancient and appears across cultures.',
      },
      {
        type: 'p',
        text: 'What researchers discovered is that disgust has been co-opted by moral reasoning. It now fires in response to moral violations that have nothing to do with biological contamination: betrayal, taboo actions, violations of purity norms, symbolic sacrilege.',
      },
      {
        type: 'p',
        text: 'Haidt and colleagues found that people who score high on disgust sensitivity tend to hold more conservative positions on purity-related moral issues — sexual morality, bodily violations, the treatment of sacred objects. They are more likely to feel that something is wrong even when no one is demonstrably harmed.',
      },
      {
        type: 'p',
        text: 'Disgust-prone individuals are not less rational. They are running a different emotional filter — one calibrated to detect a different class of violations.',
      },
      {
        type: 'h2',
        text: 'The full roster of moral emotions',
      },
      {
        type: 'list',
        items: [
          'Guilt — self-directed, triggered by believing you caused harm or violated your own standards. Corrective: it motivates repair and avoidance.',
          'Shame — related to guilt but focused on the self being fundamentally flawed, not just having done something wrong. Tends toward withdrawal rather than repair.',
          'Elevation — Haidt\'s term for the warm, uplifting feeling when witnessing extraordinary kindness, courage, or sacrifice. Motivates prosocial action in the observer.',
          'Moral anger — fires when you perceive someone else being harmed, even when you are not the victim. The engine of moral outrage and of much moral activism.',
          'Contempt — triggered by perceived violations of community norms by someone seen as beneath those standards. Unlike anger, contempt dismisses rather than seeks repair.',
        ],
      },
      {
        type: 'h2',
        text: 'How reasoning and emotion interact — Greene\'s contribution',
      },
      {
        type: 'p',
        text: 'Joshua Greene at Harvard extended Haidt\'s work using fMRI scans of people making moral decisions. He found that different types of dilemmas activate fundamentally different brain systems.',
      },
      {
        type: 'p',
        text: 'Personal moral dilemmas — where you must directly harm someone with your own hands to save others — strongly activate emotional circuits, particularly those associated with social conflict and harm aversion.',
      },
      {
        type: 'p',
        text: 'Impersonal dilemmas — pull a lever, redirect a trolley, press a button from a distance — activate more deliberative, prefrontal reasoning circuits.',
      },
      {
        type: 'p',
        text: 'Greene\'s theory: emotional reactions to personal harm evolved to regulate behaviour in close-knit groups where any direct harm was always intimate and proximate. Impersonal moral decisions, which became possible only at civilisational scale, require deliberative reasoning to override those emotional defaults.',
      },
      {
        type: 'p',
        text: 'This is why most people are willing to pull the trolley lever but not to push a person off a bridge — even though the outcomes are formally identical. The emotional system distinguishes direct from indirect harm in a way deliberative reasoning alone does not.',
      },
      {
        type: 'cta',
        label: 'Vote: organ harvest — save five by sacrificing one? →',
        href: '/play/organ-harvest',
      },
      {
        type: 'h2',
        text: 'What this means for your moral archetype',
      },
      {
        type: 'p',
        text: 'On SplitVote, these patterns appear in real votes across hundreds of thousands of responses.',
      },
      {
        type: 'p',
        text: 'The Guardian archetype shows strong responses to purity and loyalty dilemmas — exactly the scenarios where disgust and contempt are most likely to activate. Guardians frequently feel that some actions are wrong regardless of their consequences.',
      },
      {
        type: 'p',
        text: 'The Strategist archetype consistently favours outcome-based reasoning — pulling levers, authorising difficult tradeoffs, accepting impersonal harm to prevent greater harm. This profile aligns with lower disgust sensitivity and stronger deliberative engagement.',
      },
      {
        type: 'p',
        text: 'The Empath archetype shows high activation around direct harm and social conflict — strong moral anger when individuals are sacrificed for the collective, and strong elevation responses to stories of solidarity and sacrifice.',
      },
      {
        type: 'p',
        text: 'None of these profiles is more evolved or more correct. They reflect different calibrations of moral emotions that are present in every human — just weighted differently across people.',
      },
      {
        type: 'h2',
        text: 'Try it yourself',
      },
      {
        type: 'p',
        text: 'The best way to understand your own moral emotion profile is to face dilemmas that activate different emotional systems. The organ harvest scenario triggers near-universal disgust. The trolley problem separates those who override emotional reactions through deliberation from those who do not.',
      },
      {
        type: 'p',
        text: 'Your patterns across multiple dilemmas reveal something real about which moral emotions are loudest in your system — and that, Haidt would say, is the core of your moral identity.',
      },
      {
        type: 'cta',
        label: 'Vote: the trolley problem →',
        href: '/play/trolley',
      },
      {
        type: 'cta',
        label: 'Discover your moral personality type →',
        href: '/personality',
      },
      {
        type: 'cta',
        label: 'What is a moral dilemma? →',
        href: '/blog/what-is-a-moral-dilemma',
      },
      {
        type: 'cta',
        label: 'Moral foundations theory: why good people disagree →',
        href: '/blog/moral-foundations-theory-why-good-people-disagree',
      },
      {
        type: 'disclaimer',
        text: 'References to Jonathan Haidt\'s Social Intuitionist Model, Joshua Greene\'s dual-process research, and Paul Ekman\'s emotion taxonomy are for contextual and educational purposes. Research cited is attributed to its original authors. SplitVote is an entertainment and reflection platform, not a scientific study. Archetype associations described are illustrative patterns based on aggregated voting data, not clinically validated personality assessments.',
      },
    ],
  },
  // G16
  {
    slug: 'free-will-and-moral-responsibility',
    locale: 'en',
    title: 'Free Will and Moral Responsibility: Do Your Choices Actually Matter?',
    seoTitle: 'Free Will and Moral Responsibility — Compatibilism, Strawson & Moral Dilemmas',
    description:
      'If your brain was wired by genes and experience, are you really free? The debate over free will is not just academic — it determines whether moral responsibility makes any sense at all.',
    seoDescription:
      'Explore the free will debate through compatibilism and P.F. Strawson\'s reactive attitudes. Understand how determinism, responsibility, and moral dilemmas are connected — and what your votes reveal.',
    date: '2026-05-11',
    readingTime: 7,
    tags: ['free will', 'moral philosophy', 'compatibilism', 'Strawson', 'moral responsibility'],
    relatedDilemmaIds: ['trolley', 'organ-harvest', 'memory-erase', 'innocent-juror'],
    alternateSlug: 'libero-arbitrio-e-responsabilita-morale',
    content: [
      {
        type: 'p',
        text: 'You are facing the trolley problem. A runaway trolley is speeding toward five people. You can pull a lever and divert it — but someone on the side track will die. You decide. You pull. Or you do not.',
      },
      {
        type: 'p',
        text: 'Here is the uncomfortable follow-up question: was that actually your choice?',
      },
      {
        type: 'p',
        text: 'Your decision was shaped by your upbringing, your culture, the specific words used to frame the scenario, the mood you were in when you read it, the neural firing patterns laid down by every experience you have ever had. If all of those causes determined your answer — in what sense did you freely choose anything at all?',
      },
      {
        type: 'h2',
        text: 'The problem determinism poses for moral responsibility',
      },
      {
        type: 'p',
        text: 'Determinism is the thesis that every event — including every human choice — is the inevitable result of prior causes operating under natural laws. Physics moves forward in one direction. Your brain is physical. Therefore, the argument goes, every decision you have ever made was fixed by the state of the universe before you were born.',
      },
      {
        type: 'p',
        text: 'If determinism is true, moral responsibility seems to be in trouble. We typically hold people responsible only when they could have done otherwise. A driver who has a sudden seizure and hits a pedestrian is not blameworthy — they could not have done otherwise. But if determinism is true, no one ever could have done otherwise. Does that mean no one is ever really blameworthy?',
      },
      {
        type: 'h2',
        text: 'Three ways philosophers have responded',
      },
      {
        type: 'p',
        text: '**Hard determinism** bites the bullet: yes, moral responsibility in the traditional sense is an illusion. Our practices of blame, punishment, and praise assume a kind of freedom that physics does not allow. We should replace them with purely forward-looking practices — not punishment for past choices, but treatment and prevention of future harm.',
      },
      {
        type: 'p',
        text: '**Libertarian free will** (in the philosophical sense, unrelated to politics) insists that humans are genuinely exempt from causal determination. Some philosophers appeal to quantum indeterminacy in neural processes; others, like Kant, argued that as rational agents we stand partially outside the causal order. On this view, we do have free will — but the scientific account of it remains contested.',
      },
      {
        type: 'p',
        text: '**Compatibilism** offers the third path — and it is the position most academic philosophers today accept. Compatibilists argue that free will and determinism are not actually in conflict. They redefine "free will" not as freedom from causation, but as a specific kind of causation: acting from your own desires, values, and reasoning rather than from external compulsion or internal dysfunction.',
      },
      {
        type: 'h2',
        text: 'Compatibilism: what it means to act freely',
      },
      {
        type: 'p',
        text: 'On the compatibilist view, you act freely when your action flows from your own character — your values, your deliberation, your will. You act unfreely when something overrides that process: a gun to your head, a compulsion you cannot control, a manipulation you are unaware of.',
      },
      {
        type: 'p',
        text: 'A driver who runs a red light because of a medical seizure is not responsible. A driver who runs a red light because they were in a hurry is responsible — even if their impatience was itself caused by prior events. What matters is the quality of the causal pathway: does it run through the person\'s own reasoning and values, or around them?',
      },
      {
        type: 'p',
        text: 'This might sound like a technicality — but it maps onto a real moral intuition. We do treat compelled and uncompelled actions differently. We do distinguish the person who helps a stranger because they want to from the person who does it at gunpoint. Compatibilism tries to articulate why that distinction matters even in a deterministic world.',
      },
      {
        type: 'h2',
        text: 'Strawson\'s insight: reactive attitudes are what moral responsibility really is',
      },
      {
        type: 'p',
        text: 'In 1962, philosopher P.F. Strawson published "Freedom and Resentment" — arguably the most influential paper on moral responsibility of the twentieth century. His argument changed how the debate is framed.',
      },
      {
        type: 'p',
        text: 'Strawson observed that most discussions of free will focus on a metaphysical question: is the agent the ultimate cause of their action? He argued this was the wrong question. What actually grounds our responsibility practices is something far more immediate: our reactive attitudes.',
      },
      {
        type: 'p',
        text: 'Reactive attitudes are the feelings we have toward others as moral agents: resentment when someone wrongs us, gratitude when someone helps us, indignation on behalf of a third party, love, anger, contempt, admiration. These are not philosophical conclusions — they are the fabric of human relationships.',
      },
      {
        type: 'p',
        text: 'Strawson\'s key move: holding someone responsible just is maintaining these reactive attitudes toward them. When we treat someone as responsible, we feel resentment or gratitude depending on what they do. When we suspend responsibility — in cases of compulsion, psychosis, or ignorance — we shift to what Strawson called the "objective stance": we view the person as a system to be managed, treated, or constrained, rather than as an agent to be responded to.',
      },
      {
        type: 'h2',
        text: 'Why we cannot sustainably adopt the objective stance toward everyone',
      },
      {
        type: 'p',
        text: 'Strawson\'s deeper point was this: you could not, even in principle, consistently adopt the objective stance toward all human beings. It would dissolve the very possibility of human relationships. Love requires caring whether someone wanted to help you. Friendship requires the possibility of betrayal. Moral community requires reactive attitudes as its foundation.',
      },
      {
        type: 'p',
        text: 'The hard determinist who says moral responsibility is an illusion is not making an error in argument — they may be metaphysically correct. But they cannot live as if the conclusion were true. They will still feel resentment when lied to. They will still feel gratitude when helped. The reactive attitudes are not beliefs that can be updated by philosophical argument — they are part of what it means to engage with other persons at all.',
      },
      {
        type: 'p',
        text: 'This is what Strawson called the "participant stance." To participate in human life is already to hold people responsible, in the sense that matters — not because we have settled the metaphysics of causation, but because that is what it means to treat someone as a person rather than as a mechanism.',
      },
      {
        type: 'h2',
        text: 'What this means for moral dilemmas',
      },
      {
        type: 'p',
        text: 'When SplitVote shows that 68% of people pull the trolley lever and 32% refuse — what does that split tell us? Not simply that people made different arithmetic calculations. It tells us that people hold different views about what responsibility requires, who bears it, and how much weight we should place on the distinction between doing and allowing harm.',
      },
      {
        type: 'p',
        text: 'The person who refuses to pull the lever is not necessarily saying the math is wrong. They may be saying: pulling that lever makes me causally responsible for a death in a way that standing still does not — and that difference matters to their sense of themselves as a moral agent. This is the reactive attitude in action: not cool calculation, but a felt sense of what kind of person they are and what they could live with.',
      },
      {
        type: 'cta',
        label: 'Vote: pull the lever or let it be? →',
        href: '/play/trolley',
      },
      {
        type: 'h2',
        text: 'Implications for punishment and forgiveness',
      },
      {
        type: 'p',
        text: 'The free will debate has direct consequences for how we think about criminal justice. If people\'s choices are fully determined by genetics, upbringing, and circumstance — what justifies punishment beyond deterrence and public protection? The retributive view — that people deserve punishment for freely chosen wrongs — loses its foundation.',
      },
      {
        type: 'p',
        text: 'Compatibilists argue that retribution is still warranted when the wrong flowed through the person\'s own reasoning and values — when it was their choice in the sense that matters, even if determined. Hard determinists argue for purely consequentialist criminal justice: not punishment but treatment, rehabilitation, and prevention.',
      },
      {
        type: 'p',
        text: 'Strawson\'s framework adds a third lens: whether we can forgive someone depends not on metaphysics but on whether they show genuine regret, understanding, and change. Forgiveness is the suspension of resentment — but it is warranted by what the person does, not by whether they could have done otherwise in some absolute sense.',
      },
      {
        type: 'h2',
        text: 'Are you responsible for the vote you cast?',
      },
      {
        type: 'p',
        text: 'Back to the trolley dilemma. Your vote was shaped by everything that made you who you are. A compatibilist would say: yes, that is exactly why it was your choice. Your character, your values, your reasoning — these are not external constraints on your freedom. They are your freedom. The choice expressed who you are.',
      },
      {
        type: 'p',
        text: 'The question the dilemma leaves open is whether the character that chose was one you endorse — whether, on reflection, you stand by what your gut decided. That is the real work of moral reasoning: not discovering the right answer from outside yourself, but examining whether the values that drove your answer are the ones you actually want to hold.',
      },
      {
        type: 'cta',
        label: 'Discover your moral personality type →',
        href: '/personality',
      },
      {
        type: 'cta',
        label: 'Doing vs allowing harm: why the distinction matters →',
        href: '/blog/doing-vs-allowing-harm',
      },
      {
        type: 'cta',
        label: 'Moral emotions: when your gut feeling is your moral compass →',
        href: '/blog/moral-emotions-gut-feeling-moral-compass',
      },
      {
        type: 'disclaimer',
        text: 'References to P.F. Strawson\'s "Freedom and Resentment" (1962), philosophical compatibilism, and the free will debate are for educational and contextual purposes. Philosophical positions described represent major schools of thought; attribution is to their respective authors. SplitVote is an entertainment and reflection platform, not a scientific study or a philosophical authority. Voting data described is illustrative.',
      },
    ],
  },
  // G17
  {
    slug: 'bystander-effect-and-moral-responsibility',
    locale: 'en',
    title: 'The Bystander Effect: Why More Witnesses Means Less Help',
    seoTitle: 'The Bystander Effect and Moral Responsibility — Why Groups Fail to Act',
    description:
      'The more people witness an emergency, the less likely any of them is to help. This is not callousness — it is a predictable failure of moral responsibility that psychologists have been studying since 1968.',
    seoDescription:
      'Learn how the bystander effect and diffusion of responsibility cause groups to fail in emergencies. Based on Darley and Latané\'s research. With real moral dilemmas to test your own response.',
    date: '2026-05-11',
    readingTime: 6,
    tags: ['bystander effect', 'moral psychology', 'diffusion of responsibility', 'Darley Latané', 'ethics'],
    relatedDilemmaIds: ['trolley', 'lifeboat', 'innocent-juror', 'why-not-intervene'],
    alternateSlug: 'effetto-spettatore-e-responsabilita-morale',
    content: [
      {
        type: 'p',
        text: 'In March 1964, Kitty Genovese was attacked near her home in Queens, New York. The assault lasted over half an hour. Reports at the time claimed that 38 neighbours witnessed the attack — and that none of them called the police until it was too late.',
      },
      {
        type: 'p',
        text: 'The story as originally told was later shown to be partly inaccurate. But the incident triggered one of the most important research programmes in the history of social psychology — and the phenomenon it revealed is very real.',
      },
      {
        type: 'h2',
        text: 'The experiment that proved the effect',
      },
      {
        type: 'p',
        text: 'In 1968, social psychologists John Darley and Bibb Latané ran a series of experiments designed to test whether the presence of other people reduces the likelihood of intervention in an emergency.',
      },
      {
        type: 'p',
        text: 'In one version, participants in a waiting room noticed smoke beginning to fill the room through a vent. When alone, 75% of participants reported the smoke within two minutes. When seated with two other people who acted unconcerned — actually confederates of the experiment — only 10% reported it. Most sat there, occasionally glancing at the smoke, doing nothing.',
      },
      {
        type: 'p',
        text: 'In another experiment, participants heard what sounded like a fellow participant having an epileptic seizure through an intercom. When they believed they were the only witness, 85% intervened within 60 seconds. When they believed four others could also hear, only 31% intervened — and many never did at all.',
      },
      {
        type: 'h2',
        text: 'Three mechanisms behind the effect',
      },
      {
        type: 'p',
        text: '**Diffusion of responsibility.** When only you can help, the full moral weight of failing to help falls on you. When others are present, that weight is shared — divided among everyone watching. The result is that each individual feels less personally responsible. Everyone assumes someone else will step in.',
      },
      {
        type: 'p',
        text: '**Pluralistic ignorance.** In ambiguous situations, people look to others to read the situation. If no one else appears alarmed, the implicit social signal is: this must not be an emergency. Each person privately suspects something is wrong but publicly acts calm because everyone else is acting calm — a collective fiction that reinforces itself.',
      },
      {
        type: 'p',
        text: '**Evaluation apprehension.** Intervening in public carries social risk. What if you misread the situation? What if you intervene clumsily and it goes wrong? The presence of other observers raises the stakes of looking incompetent or overreacting — and this fear holds people back even when they suspect action is needed.',
      },
      {
        type: 'h2',
        text: 'The counterintuitive math',
      },
      {
        type: 'p',
        text: 'Our intuition says: more witnesses means more help. More people seeing an emergency surely means more chance of a good outcome.',
      },
      {
        type: 'p',
        text: 'Darley and Latané showed the opposite. The relationship is not additive — it is dilutive. Adding witnesses does not increase the probability of intervention; it reduces the probability that any single individual will intervene. At some point the group becomes paralysed not despite its size but because of it.',
      },
      {
        type: 'p',
        text: 'This is not a feature of callous or selfish people. It was observed with ordinary university students who, in one-on-one situations, nearly always helped. The failure is situational, not characterological. Given the right (or wrong) group size and social cues, almost anyone will fail to act.',
      },
      {
        type: 'cta',
        label: 'Vote: would you pull the lever when everyone else hesitates? →',
        href: '/play/trolley',
      },
      {
        type: 'h2',
        text: 'The online bystander',
      },
      {
        type: 'p',
        text: 'Social media has created a new context for bystander dynamics. A video of harassment or cruelty can be watched by millions. The response is often to screenshot, share, comment — but rarely to directly intervene in any form that would actually help the target.',
      },
      {
        type: 'p',
        text: 'Researchers studying online bystander behaviour have found similar patterns to Darley and Latané\'s original work. The larger the audience for a post, the lower the probability that any individual commenter will do something active. The like button and the share function may actually reinforce passive spectatorship, giving people the feeling of participating without requiring genuine action.',
      },
      {
        type: 'p',
        text: 'The bystander effect in digital spaces is arguably more powerful because it strips away even the physical awkwardness of a real emergency. There is no visible victim in front of you, no smoke in the room. The moral cost of not acting feels lower — and so the inertia is higher.',
      },
      {
        type: 'h2',
        text: 'What this means for moral responsibility',
      },
      {
        type: 'p',
        text: 'The bystander effect sits at the intersection of two deep questions in ethics: when are you responsible for harm you did not cause? And how much does the presence of others change that responsibility?',
      },
      {
        type: 'p',
        text: 'Traditional moral frameworks disagree sharply. Consequentialists tend to hold that failing to prevent harm you could have prevented is morally equivalent to causing it — the bystander who does nothing while five people drown when they could have thrown a rope bears real moral responsibility. Deontologists often distinguish between positive duties (to help) and negative duties (not to harm), with the latter being stronger — which can soften the bystander\'s culpability.',
      },
      {
        type: 'p',
        text: 'Strawson\'s reactive attitudes framework offers a third lens: we do feel resentment and indignation toward bystanders who could have helped and did not. Those feelings are not irrational. They reflect a genuine moral expectation that people who are present bear some responsibility for outcomes they could have influenced — regardless of how many others were also present.',
      },
      {
        type: 'h2',
        text: 'How to break the effect',
      },
      {
        type: 'p',
        text: 'Awareness of the bystander effect does not automatically dissolve it — but it helps. The most effective interventions are structural:',
      },
      {
        type: 'list',
        items: [
          'Assign responsibility explicitly: name a specific person ("you, in the red jacket — call an ambulance"). Diffusion of responsibility cannot survive direct designation.',
          'Acknowledge the situation publicly: say out loud "something is wrong here." This breaks pluralistic ignorance — you force the group to stop pretending everything is normal.',
          'Act first, even imperfectly: someone taking any action — even the wrong one — dramatically increases the likelihood that others join in. The first mover absorbs the evaluation risk for everyone else.',
        ],
      },
      {
        type: 'h2',
        text: 'Where your instinct actually sits',
      },
      {
        type: 'p',
        text: 'Moral dilemmas on SplitVote strip away the social context that enables bystander inaction. You are alone with the question. There are no confederates acting unconcerned. There is no crowd to dissolve your sense of responsibility.',
      },
      {
        type: 'p',
        text: 'That is part of what makes the vote interesting: it is a purer read on your values than the one your actual behaviour in a group situation would give. It measures what you think should happen — not what social pressure allows you to do. The gap between those two is where the bystander effect lives.',
      },
      {
        type: 'cta',
        label: 'Discover your moral personality type →',
        href: '/personality',
      },
      {
        type: 'cta',
        label: 'Why good people do nothing: moral disengagement →',
        href: '/blog/why-good-people-do-nothing',
      },
      {
        type: 'cta',
        label: 'Free will and moral responsibility: are you really to blame? →',
        href: '/blog/free-will-and-moral-responsibility',
      },
      {
        type: 'disclaimer',
        text: 'References to Darley and Latané\'s bystander research (1968) and the Kitty Genovese case are for educational and contextual purposes. The original 38-witness narrative has been partially revised by subsequent journalism and historical research; the psychological research it inspired remains foundational. SplitVote is an entertainment and reflection platform, not a scientific study. Voting data described is illustrative.',
      },
    ],
  },
]

const IT_POSTS: BlogPost[] = [
  {
    slug: 'cos-e-un-dilemma-morale',
    locale: 'it',
    title: "Cos'è un dilemma morale?",
    seoTitle: "Cos'è un dilemma morale? Definizione, esempi e perché contano",
    description:
      'Un dilemma morale è una situazione in cui qualsiasi scelta ha un costo. Non esistono risposte pulite. Capirli aiuta a scoprire cosa valoriamo davvero.',
    seoDescription:
      "Scopri cos'è un dilemma morale, perché non hanno una risposta giusta, e perché affrontarli rivela i tuoi valori autentici. Con esempi reali e dilemmi da provare.",
    date: '2026-04-27',
    readingTime: 3,
    tags: ['etica', 'filosofia', 'psicologia morale'],
    relatedDilemmaIds: ['trolley', 'cure-secret', 'memory-erase'],
    alternateSlug: 'what-is-a-moral-dilemma',
    content: [
      {
        type: 'p',
        text: 'Un dilemma morale è una situazione in cui devi scegliere tra due opzioni — e entrambe hanno un costo reale. Non esiste una risposta pulita, nessuna scelta che ti lasci le mani del tutto libere.',
      },
      {
        type: 'p',
        text: 'È esattamente questo che li rende scomodi. E così rivelatori.',
      },
      {
        type: 'h2',
        text: 'Cosa lo rende un dilemma, e non solo una scelta difficile?',
      },
      {
        type: 'p',
        text: "Una scelta difficile può avere un'opzione chiaramente migliore che è semplicemente faticosa da prendere. Un vero dilemma morale mette in conflitto diretto due valori: lealtà contro onestà, salvare vite contro rispettare l'autonomia, l'individuo contro il gruppo.",
      },
      {
        type: 'p',
        text: "Gli esempi classici includono il problema del carrello (salvare cinque sacrificandone uno?), i dilemmi sul whistleblowing (lealtà all'azienda contro interesse pubblico), o le decisioni di fine vita in cui più principi etici tirano in direzioni opposte.",
      },
      {
        type: 'h2',
        text: 'Perché i dilemmi morali contano',
      },
      {
        type: 'list',
        items: [
          'Rivelano i tuoi valori reali — non quelli che credi di avere',
          'Mostrano come due persone ragionevoli possano dissentire senza che nessuna delle due abbia torto',
          'Sono alla base del ragionamento etico serio in diritto, medicina e politica',
        ],
      },
      {
        type: 'h2',
        text: 'Provane uno adesso',
      },
      {
        type: 'p',
        text: 'Il modo migliore per capire un dilemma morale è affrontarne uno. Osserva come reagisce il tuo istinto prima che la ragione intervenga — poi confronta la tua risposta con persone da tutto il mondo.',
      },
      {
        type: 'cta',
        label: 'Sfoglia i dilemmi morali →',
        href: '/it/category/morality',
      },
      {
        type: 'disclaimer',
        text: 'Contenuto educativo, non consulenza professionale.',
      },
    ],
  },
  {
    slug: 'problema-del-carrello-spiegato',
    locale: 'it',
    title: 'Il problema del carrello spiegato semplice',
    seoTitle: 'Il problema del carrello spiegato — storia, varianti e cosa scelgono le persone',
    description:
      'Il problema del carrello è il dilemma morale più famoso della filosofia. Da dove viene, cosa rivelano le varianti, e cosa scelgono davvero le persone.',
    seoDescription:
      "Capire il problema del carrello: la sua origine con Philippa Foot, la variante del ponte, e cosa mostrano i sondaggi globali sul ragionamento etico di fronte alla vita e alla morte.",
    date: '2026-04-27',
    readingTime: 4,
    tags: ['problema del carrello', 'etica', 'filosofia', 'dilemmi classici'],
    relatedDilemmaIds: ['trolley', 'organ-harvest'],
    alternateSlug: 'trolley-problem-explained',
    content: [
      {
        type: 'p',
        text: "Un carrello fuori controllo si dirige verso cinque persone legate ai binari. Puoi tirare una leva per deviarlo — ma c'è una persona sul binario laterale. Tiri la leva?",
      },
      {
        type: 'p',
        text: "Questo esperimento mentale fu introdotto dalla filosofa Philippa Foot nel 1967. Da allora è diventato uno dei casi più studiati della filosofia morale — e uno dei più discussi a tavola.",
      },
      {
        type: 'h2',
        text: 'La domanda originale',
      },
      {
        type: 'p',
        text: "La versione di Foot chiedeva se sia mai lecito fare del male per prevenire un danno maggiore. Tirare la leva uccide una persona per salvarne cinque — è accettabile? La maggior parte delle persone dice di sì. Salvare cinque al costo di uno sembra aritmetica semplice.",
      },
      {
        type: 'h2',
        text: 'La variante del ponte',
      },
      {
        type: 'p',
        text: 'La filosofa Judith Jarvis Thomson ha poi introdotto una variazione: invece di una leva, immagina di essere su un ponte sopra i binari. Potresti spingere un uomo corpulento giù dal ponte — il suo corpo fermerebbe il carrello, salvando i cinque. La matematica è identica: uno muore, cinque si salvano. Eppure quasi tutti rifiutano.',
      },
      {
        type: 'p',
        text: "Questa asimmetria è il punto interessante. Stesso risultato, intuizioni morali radicalmente diverse. Perché?",
      },
      {
        type: 'h2',
        text: 'Cosa dice la ricerca',
      },
      {
        type: 'list',
        items: [
          "Nei grandi sondaggi, circa l'85% delle persone tira la leva — ma solo il ~30% spingerebbe l'uomo",
          "La differenza rispecchia il contrasto tra pensiero deontologico (non usare una persona come mezzo) e consequenzialista (minimizzare il danno)",
          'Cultura, età e come viene formulata la domanda spostano i numeri',
        ],
      },
      {
        type: 'h2',
        text: 'Cosa sceglieresti tu?',
      },
      {
        type: 'p',
        text: 'SplitVote raccoglie voti reali sul problema del carrello da persone in tutto il mondo. Scopri dove ti posizioni — e dove si trova il confine globale oggi.',
      },
      {
        type: 'cta',
        label: 'Vota sul problema del carrello →',
        href: '/it/play/trolley',
      },
      {
        type: 'h2',
        text: 'I due modi di pensare che il problema del carrello rivela',
      },
      {
        type: 'p',
        text: "La differenza tra tirare la leva e spingere l'uomo dal ponte traccia una vera divisione nella filosofia morale. Chi tira ma rifiuta di spingere ragiona in modo consequenzialista in alcune situazioni e in modo deontologico in altre — e il problema del carrello è esattamente il caso che rivela dove si trova il confine.",
      },
      {
        type: 'cta',
        label: 'Consequenzialismo: la matematica dietro al tirare la leva →',
        href: '/it/blog/consequenzialismo-il-bene-maggiore',
      },
      {
        type: 'cta',
        label: "Deontologia: perché spingere l'uomo sembra diverso →",
        href: '/it/blog/deontologia-alcune-cose-sono-sempre-sbagliate',
      },
      {
        type: 'cta',
        label: 'Causare vs permettere il danno: perché la distinzione conta →',
        href: '/it/blog/causare-vs-permettere-danno',
      },
      {
        type: 'disclaimer',
        text: 'Contenuto educativo, non consulenza professionale.',
      },
    ],
  },
  {
    slug: 'perche-ci-piacciono-le-scelte-impossibili',
    locale: 'it',
    title: 'Perché ci piacciono le scelte impossibili',
    seoTitle: 'Perché ci piacciono le scelte impossibili — la psicologia dei dilemmi morali',
    description:
      'I dilemmi morali sono scomodi — eppure non riusciamo a smettere di condividerli. La psicologia spiega perché le scelte impossibili ci affascinano tanto.',
    seoDescription:
      'Perché i dilemmi morali diventano virali? Conflitto cognitivo, confronto sociale e identità valoriale: la psicologia dietro la nostra ossessione per le scelte impossibili.',
    date: '2026-04-27',
    readingTime: 3,
    tags: ['psicologia', 'psicologia morale', 'condivisione sociale'],
    relatedDilemmaIds: ['trolley', 'memory-erase', 'cure-secret'],
    alternateSlug: 'why-people-love-impossible-choices',
    content: [
      {
        type: 'p',
        text: 'Li hai visti ovunque: post "cosa preferiresti…", dibattiti sul problema del carrello, scenari di salvataggio. Le persone non si limitano a leggerli — ci litigano per ore.',
      },
      {
        type: 'p',
        text: 'Cosa rende così affascinante una domanda a cui non esiste una risposta giusta?',
      },
      {
        type: 'h2',
        text: 'Creano conflitto cognitivo',
      },
      {
        type: 'p',
        text: "Quando una domanda non ha una risposta chiara, il cervello lavora di più. Questo sforzo cognitivo genera coinvolgimento — senti le conseguenze, ti senti tirato in direzioni opposte. Il disagio è difficile da ignorare.",
      },
      {
        type: 'h2',
        text: 'Funzionano come specchi sociali',
      },
      {
        type: 'p',
        text: "Scoprire che il 62% delle persone ha scelto diversamente da te è sorprendente, a volte destabilizzante. Ti spinge a chiederti: perché ragioniamo in modo così diverso di fronte alla stessa situazione? Quel confronto è difficile da ignorare.",
      },
      {
        type: 'h2',
        text: 'Rivelano cosa valorizzi davvero',
      },
      {
        type: 'p',
        text: "Nella vita quotidiana, i valori dichiarati e il comportamento reale spesso divergono. I dilemmi morali tagliano corto: ti costringono a dare priorità a un valore rispetto a un altro in modo concreto, che i principi astratti non riescono a fare. La tua scelta rivela qualcosa di vero su di te.",
      },
      {
        type: 'h2',
        text: 'Sono intrinsecamente condivisibili',
      },
      {
        type: 'p',
        text: "L'ambiguità alimenta la conversazione. Non esiste un modo per \"vincere\" condividendo la tua risposta a un dilemma morale — il che significa che tutti possono partecipare senza sentirsi giudicati. Barriera bassa, valore di conversazione altissimo.",
      },
      {
        type: 'h2',
        text: 'Scopri cosa sceglie il mondo',
      },
      {
        type: 'p',
        text: "SplitVote raccoglie voti in tempo reale su centinaia di dilemmi morali. Nessun commento, nessuna opinione — solo dati su cosa le persone scelgono davvero quando sono costrette a schierarsi.",
      },
      {
        type: 'cta',
        label: 'Vedi cosa è di tendenza →',
        href: '/it/trending',
      },
      {
        type: 'disclaimer',
        text: 'Contenuto educativo, non consulenza professionale.',
      },
    ],
  },
  {
    slug: 'domande-would-you-rather-difficili',
    locale: 'it',
    title: '35+ Domande "Preferiresti" Difficili Per Adulti e Gruppi',
    seoTitle: '35+ Domande "Preferiresti" Difficili Per Adulti e Gruppi',
    description:
      'Le migliori domande "preferiresti" difficili, divise per tema. Relazioni, soldi, sopravvivenza e moralità — poi scopri come vota il mondo su SplitVote.',
    seoDescription:
      'Le migliori domande "preferiresti" difficili, divise per tema. Relazioni, soldi, sopravvivenza e moralità — poi scopri come vota il mondo su SplitVote.',
    date: '2026-04-27',
    readingTime: 7,
    tags: ['domande preferiresti', 'domande difficili', 'dilemmi morali'],
    relatedDilemmaIds: ['trolley', 'lifeboat', 'truth-friend', 'organ-harvest', 'memory-erase', 'cure-secret'],
    alternateSlug: 'hard-would-you-rather-questions',
    content: [
      {
        type: 'p',
        text: 'Non esistono risposte giuste. Esistono solo le tue.',
      },
      {
        type: 'p',
        text: 'Queste sono le domande "preferiresti" che fanno davvero pensare. Ogni scelta rivela qualcosa di reale su chi sei. Rispondile — poi confronta le tue risposte con altri utenti su SplitVote.',
      },
      {
        type: 'cta',
        label: 'Esplora i dilemmi morali →',
        href: '/it/dilemmi-morali',
      },
      {
        type: 'cta',
        label: 'Tutte le domande "Preferiresti" →',
        href: '/it/domande-would-you-rather',
      },
      {
        type: 'h2',
        text: 'Relazioni',
      },
      {
        type: 'list',
        items: [
          'Preferiresti sapere ogni volta che qualcuno ti mente — o fidarti ciecamente di tutti e non sentirti mai in dubbio?',
          'Preferiresti avere un partner perfetto che ti annoia, o una persona complicata che ti fa sentire vivo ogni giorno?',
          'Preferiresti perdere il tuo migliore amico per sempre, o la relazione romantica più importante della tua vita?',
          'Preferiresti restare in una relazione confortevole che sai finirà tra 10 anni, o lasciare adesso e cercare qualcosa di meglio senza garanzia?',
          'Preferiresti che il tuo partner ti amasse più di quanto tu ami lui/lei — o amarlo tu più di quanto lui/lei ami te?',
          'Preferiresti sempre dire la verità anche quando fa male — o saper scegliere le parole giuste per proteggere chi ami?',
          'Preferiresti scoprire che il tuo partner ti ha mentito per proteggerti, o che ti ha detto una verità difficile che ti ha fatto soffrire?',
          'Preferiresti sapere cosa pensano davvero di te tutte le persone che ami — o non saperlo mai?',
          "Preferiresti conoscere ogni persona che ha mai avuto sentimenti per te — o sapere chi ti parla male alle spalle adesso?",
        ],
      },
      {
        type: 'cta',
        label: 'Verità o lealtà — come vota il mondo? →',
        href: '/it/play/truth-friend',
      },
      {
        type: 'h2',
        text: 'Soldi e Successo',
      },
      {
        type: 'list',
        items: [
          'Preferiresti guadagnare il doppio del tuo stipendio attuale facendo un lavoro che odi, o lo stesso di oggi facendo qualcosa che ti appassiona?',
          "Preferiresti essere la persona più ricca di una piccola città dove nessuno ti conosce — o condurre una vita nella media nella città più stimolante del mondo?",
          'Preferiresti perdere tutti i tuoi risparmi oggi — o perdere metà del tuo stipendio per il resto della vita?',
          'Preferiresti rinunciare a tutti i social media per 5 anni e ricevere 50.000€ — o tenerli?',
          'Preferiresti ereditare una fortuna da una persona che non potevi sopportare, o costruire una ricchezza modesta con le tue forze?',
          'Preferiresti sapere sempre quanto guadagnano le persone intorno a te — o non saperlo mai?',
          'Preferiresti diventare famoso per qualcosa di controverso — o essere completamente dimenticato dopo la tua morte?',
          'Preferiresti essere il più bravo in un ambiente piccolo, o nella media in un ambiente dove ogni giorno devi competere con i migliori?',
        ],
      },
      {
        type: 'cta',
        label: 'Vota altri dilemmi impossibili →',
        href: '/it/domande-would-you-rather',
      },
      {
        type: 'h2',
        text: 'Moralità ed Etica',
      },
      {
        type: 'list',
        items: [
          'Preferiresti salvare cinque sconosciuti o la persona che ami di più — se potessi sceglierne solo una?',
          'Preferiresti denunciare un tuo caro amico per un reato grave che hai testimoniato — o tacere per proteggerlo?',
          'Preferiresti avere sempre ragione ma non riuscire mai a convincere gli altri — o spesso sbagliarti ma riuscire sempre a persuadere le persone?',
          'Preferiresti sapere la data esatta della tua morte — o la causa?',
          'Preferiresti vivere in una società perfettamente giusta con libertà molto limitate, o in una società libera con grandi disuguaglianze?',
          'Preferiresti essere costretto a prendere una decisione di vita o di morte per uno sconosciuto — o che uno sconosciuto prendesse una decisione importante per te?',
          'Preferiresti che le tue azioni venissero giudicate solo in base alle tue intenzioni — o solo in base ai risultati?',
          'Preferiresti togliere una vita per salvarne dieci — o rifiutare, lasciando morire tutte e dieci?',
        ],
      },
      {
        type: 'cta',
        label: 'Il dilemma più difficile: il problema del tram →',
        href: '/it/play/trolley',
      },
      {
        type: 'cta',
        label: 'Stessa logica, contesto medico: trapianto di organi →',
        href: '/it/play/organ-harvest',
      },
      {
        type: 'h2',
        text: 'Sopravvivenza',
      },
      {
        type: 'list',
        items: [
          "Preferiresti sopravvivere da solo su un'isola deserta per un anno, o trascorrerlo in un piccolo appartamento con due sconosciuti che non riesci a sopportare?",
          "Preferiresti perdere la mano dominante o l'occhio dominante?",
          'Preferiresti sapere che una catastrofe arriverà tra 10 anni senza poterla fermare — o essere colto di sorpresa quando accade?',
          "Preferiresti essere immune a tutte le malattie ma avere un dolore cronico lieve ogni giorno, o essere in perfetta salute ma invecchiare il doppio dopo i quarant'anni?",
          'Preferiresti salvare il tuo animale domestico o il figlio di uno sconosciuto in un incendio, potendone salvare solo uno?',
          'Preferiresti affrontare la tua paura più grande una volta sola e vederla sparire per sempre — o evitarla per tutta la vita?',
        ],
      },
      {
        type: 'cta',
        label: 'Chi sale sulla scialuppa — vota il dilemma →',
        href: '/it/play/lifeboat',
      },
      {
        type: 'h2',
        text: 'Identità e Futuro',
      },
      {
        type: 'list',
        items: [
          'Preferiresti vivere altri 40 anni con tutti i tuoi ricordi — o altri 80 anni ricominciando da zero senza memoria di chi sei stato?',
          "Preferiresti poter vedere com'è la tua vita tra 10 anni (una sola volta) — o poter cambiare una decisione del passato?",
          'Preferiresti cancellare il ricordo più doloroso della tua vita, sapendo che cambierà chi sei — o tenerlo?',
          'Preferiresti sapere sempre quando qualcuno ti sta giudicando — o non saperlo mai?',
          'Preferiresti che il tuo momento più imbarazzante fosse noto a tutti — o il tuo rimpianto più grande?',
          'Preferiresti scambiare la vita con qualcuno per una settimana senza possibilità di tornare indietro — o scambiare solo il corpo per 24 ore?',
          'Preferiresti sapere esattamente quando ti innamorerai di nuovo — o essere completamente sorpreso?',
        ],
      },
      {
        type: 'cta',
        label: 'Cancelleresti i tuoi ricordi? Vota il dilemma →',
        href: '/it/play/memory-erase',
      },
      {
        type: 'h2',
        text: 'Perché Queste Domande Funzionano',
      },
      {
        type: 'p',
        text: 'Le domande "preferiresti" difficili non ti lasciano vincere. Ogni opzione ha un costo reale.',
      },
      {
        type: 'p',
        text: "La parte più interessante non è la tua risposta. È scoprire che la persona accanto a te ha scelto l'esatto contrario — e che entrambi avete le vostre buone ragioni.",
      },
      {
        type: 'p',
        text: 'Su SplitVote ogni scenario è un voto in tempo reale. Alcuni dilemmi si dividono 90/10. Altri restano a 48/52 per mesi.',
      },
      {
        type: 'p',
        text: 'Vuoi vedere cosa sceglierebbe davvero il mondo? Prova SplitVote e confronta le tue risposte con altri utenti.',
      },
      {
        type: 'cta',
        label: 'Vota — nessun account richiesto →',
        href: '/it/play/trolley',
      },
      {
        type: 'disclaimer',
        text: 'Contenuto educativo, non consulenza professionale di alcun tipo.',
      },
    ],
  },
  {
    slug: 'dilemmi-morali-esempi',
    locale: 'it',
    title: 'Dilemmi Morali: 15 Esempi Concreti e Come Vota il Mondo',
    seoTitle: 'Dilemmi Morali: 15 Esempi Concreti e Come Vota il Mondo',
    description:
      "I dilemmi morali più famosi con esempi concreti. Dal problema del tram all'etica dell'IA — con i risultati dei sondaggi SplitVote in tempo reale.",
    seoDescription:
      "I dilemmi morali più famosi con esempi concreti. Dal problema del tram all'etica dell'IA — con i risultati dei sondaggi SplitVote in tempo reale.",
    date: '2026-04-27',
    readingTime: 6,
    tags: ['dilemmi morali', 'esempi', 'etica', 'filosofia'],
    alternateSlug: 'moral-dilemmas-examples',
    relatedDilemmaIds: ['trolley', 'organ-harvest', 'lifeboat', 'cure-secret', 'memory-erase', 'truth-friend'],
    content: [
      {
        type: 'p',
        text: "Un dilemma morale non è un problema difficile. È una situazione dove entrambe le scelte sono difendibili — e devi scegliere comunque.",
      },
      {
        type: 'p',
        text: 'Qui trovi 15 esempi concreti di dilemmi morali, dai classici della filosofia ai casi più vicini alla vita quotidiana. Per ognuno puoi vedere come vota il mondo su SplitVote.',
      },
      {
        type: 'cta',
        label: 'Esplora i dilemmi morali →',
        href: '/it/dilemmi-morali',
      },
      {
        type: 'cta',
        label: 'Domande "Preferiresti" difficili →',
        href: '/it/domande-would-you-rather',
      },
      {
        type: 'h2',
        text: 'Cosa Rende un Vero Dilemma Morale',
      },
      {
        type: 'p',
        text: "Non basta che la scelta sia difficile. Un dilemma morale ha tre caratteristiche: entrambe le opzioni hanno conseguenze reali e significative; nessuna delle due è chiaramente sbagliata sul piano etico; la scelta rivela un conflitto tra valori genuini — non tra bene e male.",
      },
      {
        type: 'p',
        text: 'I dilemmi non esistono per trovare la risposta giusta. Esistono per capire quale valore conta di più quando due valori si scontrano.',
      },
      {
        type: 'p',
        text: 'I risultati SplitVote in questo articolo sono sondaggi utente — non ricerca scientifica. I numeri si aggiornano in tempo reale.',
      },
      {
        type: 'h2',
        text: 'I Classici: Dilemmi Che Durano Da Decenni',
      },
      {
        type: 'h3',
        text: '1. Il Problema del Tram',
      },
      {
        type: 'p',
        text: "Un tram fuori controllo sta per investire cinque persone legate ai binari. Puoi deviarlo su un binario secondario dove c'è una sola persona. Tiri la leva?",
      },
      {
        type: 'p',
        text: "La divisione è più equilibrata di quanto la maggior parte delle persone si aspetti prima di votare. Scopri il risultato aggiornato su SplitVote.",
      },
      {
        type: 'cta',
        label: 'Vota il problema del tram →',
        href: '/it/play/trolley',
      },
      {
        type: 'h3',
        text: '2. Il Trapianto di Organi',
      },
      {
        type: 'p',
        text: "Un chirurgo può salvare cinque pazienti morenti prelevando gli organi di un paziente sano senza il suo consenso. La matematica è identica al problema del tram. I voti raccontano una storia diversa.",
      },
      {
        type: 'p',
        text: "Il contesto medico cambia la percezione morale, anche con numeri identici. Scopri il risultato aggiornato su SplitVote.",
      },
      {
        type: 'cta',
        label: 'Vota il dilemma del trapianto →',
        href: '/it/play/organ-harvest',
      },
      {
        type: 'h3',
        text: '3. La Scialuppa di Salvataggio',
      },
      {
        type: 'p',
        text: "Una scialuppa può contenere 8 persone. Ci sono 12 sopravvissuti. Qualcuno deve decidere chi sale — e chi rimane in acqua. Chi ha il diritto di decidere? In base a cosa?",
      },
      {
        type: 'cta',
        label: 'Vota la scialuppa su SplitVote →',
        href: '/it/play/lifeboat',
      },
      {
        type: 'cta',
        label: 'Vota il problema del tram — risultati in tempo reale →',
        href: '/it/play/trolley',
      },
      {
        type: 'h2',
        text: 'Dilemmi Sulla Verità e la Lealtà',
      },
      {
        type: 'h3',
        text: "4. Il Segreto Dell'Amico",
      },
      {
        type: 'p',
        text: "Il tuo migliore amico ti chiede un'opinione onesta su qualcosa di importante. Sai che la verità lo farà soffrire. Cosa fai?",
      },
      {
        type: 'p',
        text: "La divisione tra chi dice tutto e chi protegge l'amico è netta. Scopri il risultato aggiornato su SplitVote.",
      },
      {
        type: 'cta',
        label: 'Vota il dilemma della verità →',
        href: '/it/play/truth-friend',
      },
      {
        type: 'h3',
        text: '5. Denunciare o Tacere',
      },
      {
        type: 'p',
        text: "Scopri che un tuo caro amico ha commesso un reato grave. L'hai visto con i tuoi occhi. Denunci o taci? Il risultato varia significativamente in base a come viene descritto il reato.",
      },
      {
        type: 'h3',
        text: '6. La Cura Proibita',
      },
      {
        type: 'p',
        text: "Esiste una cura per una malattia mortale. Ma per ottenerla devi compiere un'azione che la maggior parte delle persone considera eticamente inaccettabile. Lo faresti?",
      },
      {
        type: 'cta',
        label: 'Vota il dilemma della cura →',
        href: '/it/play/cure-secret',
      },
      {
        type: 'h2',
        text: "Dilemmi Sull'Identità e la Memoria",
      },
      {
        type: 'h3',
        text: '7. Cancellare un Ricordo',
      },
      {
        type: 'p',
        text: "Puoi eliminare il ricordo più doloroso della tua vita. Il problema: quel ricordo ha plasmato chi sei. Dopo la cancellazione, saresti una persona diversa. Vale la pena?",
      },
      {
        type: 'p',
        text: 'Scopri il risultato aggiornato su SplitVote.',
      },
      {
        type: 'cta',
        label: 'Vota il dilemma della memoria →',
        href: '/it/play/memory-erase',
      },
      {
        type: 'h3',
        text: '8. Ricominciare Da Zero',
      },
      {
        type: 'p',
        text: "Vivi altri 40 anni come sei adesso — o altri 80 ricominciando da capo, senza nulla di quello che hai costruito. Cosa scegli?",
      },
      {
        type: 'h3',
        text: '9. Conoscere la Propria Morte',
      },
      {
        type: 'p',
        text: "Ti viene offerta la possibilità di sapere la data esatta della tua morte — ma non la causa. Oppure la causa — ma non la data. Scegli una.",
      },
      {
        type: 'h2',
        text: 'Dilemmi Di Vita Quotidiana',
      },
      {
        type: 'h3',
        text: '10. Il Partner Tradito',
      },
      {
        type: 'p',
        text: "Vieni a sapere che il partner del tuo migliore amico lo tradisce. Lui non te lo ha chiesto. Glielo dici?",
      },
      {
        type: 'h3',
        text: '11. Sacrificarsi Per il Futuro',
      },
      {
        type: 'p',
        text: "Un'azione costosa per te oggi potrebbe evitare una sofferenza enorme a molte persone tra vent'anni. Nessuna garanzia. Nessuno lo saprà. Agisci?",
      },
      {
        type: 'h3',
        text: '12. Il Medico Che Sceglie di Non Dire Tutto',
      },
      {
        type: 'p',
        text: "Un medico sa che comunicare la diagnosi completa distruggerebbe psicologicamente il paziente e ridurrebbe le sue chance di sopravvivenza. Dice tutto o sceglie cosa rivelare?",
      },
      {
        type: 'h3',
        text: "13. L'Algoritmo Preventivo",
      },
      {
        type: 'p',
        text: "Un sistema di intelligenza artificiale prevede con alta accuratezza chi commetterà un reato grave nei prossimi cinque anni. Puoi limitare la libertà di queste persone prima che facciano qualcosa?",
      },
      {
        type: 'h3',
        text: "14. L'Eredità Difficile",
      },
      {
        type: 'p',
        text: "Puoi ricevere una fortuna enorme da una persona che ritenevi moralmente riprovevole. I soldi sarebbero tuoi, senza condizioni. La accetti?",
      },
      {
        type: 'h3',
        text: "15. L'Unico Posto",
      },
      {
        type: 'p',
        text: "Due persone. Un solo posto per salvarsi. Una è tua sorella. L'altra è un medico che potrebbe salvare molte vite in futuro. Chi scegli?",
      },
      {
        type: 'h2',
        text: 'Cosa Rivelano i Voti',
      },
      {
        type: 'p',
        text: "La cosa più interessante nei risultati SplitVote non è quale opzione vince. È che quasi ogni dilemma si divide in modo significativo — spesso 40/60 o 45/55 — anche quando la risposta sembra ovvia prima di votare.",
      },
      {
        type: 'p',
        text: "I dilemmi morali non testano le tue conoscenze etiche. Testano quale sistema di valori hai interiorizzato: consequenzialista (contano i risultati), deontologico (contano le azioni in sé), o basato sulla virtù (cosa farebbe una persona integra?). La maggior parte delle persone tiene insieme tutti e tre — fino a quando un dilemma li mette in conflitto diretto.",
      },
      {
        type: 'cta',
        label: 'Vota il problema del tram — nessun account richiesto →',
        href: '/it/play/trolley',
      },
      {
        type: 'h2',
        text: 'Prova Tu',
      },
      {
        type: 'p',
        text: "Leggere un dilemma e votarlo sono due esperienze diverse. Nel momento in cui devi davvero scegliere, la posizione che sembrava ovvia diventa improvvisamente molto meno scontata.",
      },
      {
        type: 'p',
        text: 'Vuoi vedere cosa sceglierebbe davvero il mondo? Prova SplitVote e confronta le tue risposte con altri utenti.',
      },
      {
        type: 'cta',
        label: 'Esplora tutti i dilemmi su SplitVote →',
        href: '/it/dilemmi-morali',
      },
      {
        type: 'cta',
        label: 'Bioetica: quando la medicina impone scelte impossibili →',
        href: '/it/blog/bioetica-quando-la-medicina-impone-scelte-impossibili',
      },
      {
        type: 'cta',
        label: 'Causare vs permettere il danno: la distinzione che conta in etica medica e legale →',
        href: '/it/blog/causare-vs-permettere-danno',
      },
      {
        type: 'disclaimer',
        text: 'Contenuto educativo, non consulenza professionale di alcun tipo. I risultati SplitVote sono sondaggi utente, non ricerca scientifica. Tutti gli scenari sono ipotetici.',
      },
    ],
  },
  {
    slug: 'dilemma-etico-vita-quotidiana',
    locale: 'it',
    title: 'Dilemma Etico Nella Vita Quotidiana: 12 Situazioni in Cui Non Esiste la Risposta Giusta',
    seoTitle: 'Dilemma Etico Nella Vita Quotidiana — 12 Esempi Reali',
    description:
      'I veri dilemmi etici non arrivano con la leva del tram. Arrivano al lavoro, tra amici, in famiglia — dove due valori che tieni entrambi si scontrano davvero.',
    seoDescription:
      'I veri dilemmi etici non arrivano con la leva del tram. Arrivano al lavoro, in famiglia, tra amici. 12 situazioni reali e come vota il mondo su SplitVote.',
    date: '2026-04-28',
    readingTime: 4,
    tags: ['dilemma etico', 'vita quotidiana', 'scelte morali', 'amicizia'],
    relatedDilemmaIds: ['truth-friend', 'whistleblower', 'sibling-secret', 'love-or-career', 'confess-crime', 'old-secret-affair'],
    alternateSlug: 'ethical-dilemmas-everyday-life',
    content: [
      {
        type: 'p',
        text: 'Un dilemma etico non è il problema del tram. È martedì mattina. La tua collega ti chiede di coprirla davanti al capo. Il tuo migliore amico ti chiede un\'opinione onesta che non vuole davvero sentire. Tuo fratello ti chiede di non dire nulla ai tuoi genitori.',
      },
      {
        type: 'p',
        text: 'I dilemmi etici reali non arrivano con la musica di sottofondo e la leva da tirare. Arrivano nelle conversazioni normali, nei messaggi, nelle pause in ufficio — e quasi mai con tutto il tempo necessario per decidere.',
      },
      {
        type: 'h2',
        text: 'Che cosa rende un vero dilemma etico',
      },
      {
        type: 'p',
        text: 'Un dilemma etico ha una caratteristica precisa: qualunque cosa scegli, stai rinunciando a qualcosa di importante. Non è una scelta tra giusto e sbagliato — è una scelta tra due valori che tieni entrambi. Lealtà contro onestà. Proteggere contro rispettare. Agire contro lasciar perdere.',
      },
      {
        type: 'h2',
        text: 'Sul Lavoro',
      },
      {
        type: 'list',
        items: [
          'Il tuo capo ti chiede di presentare dei dati in modo che non emergano alcuni problemi. Non è una bugia — ma è pensato per nascondere qualcosa di reale. Lo fai?',
          'Un collega sbaglia sistematicamente e il team ne risente, ma sta passando un momento difficile. Segnalarlo sembra corretto verso il team. Tacere sembra corretto verso di lui. Cosa fai?',
          'Scopri un errore di chi ha lavorato al progetto prima di te. Correggerlo crea ritardi e imbarazzo. Tacere non cambia nulla nell\'immediato — ma sai la verità.',
          'Un tuo collega si è preso il merito per un lavoro che non ha fatto. È anche un amico. Dici qualcosa?',
        ],
      },
      {
        type: 'cta',
        label: 'Denunceresti un collega o un amico? Vota →',
        href: '/it/play/whistleblower',
      },
      {
        type: 'h2',
        text: 'Nelle Amicizie',
      },
      {
        type: 'list',
        items: [
          'Il tuo migliore amico ti chiede cosa pensi della sua relazione. La risposta onesta è che lo stai guardando sbagliare. Cosa gli dici?',
          'Vieni a sapere che il partner del tuo amico lo tradisce. Lui non te lo ha chiesto. Glielo dici comunque?',
          'Un tuo caro amico ti confida di aver fatto qualcosa di illegale — non gravissimo, ma non banale. Sei l\'unico a saperlo. Taci o parli?',
          'Qualcuno nel tuo gruppo dice cose molto diverse su un altro amico appena si gira. Non è una cosa piccola. Intervieni?',
        ],
      },
      {
        type: 'cta',
        label: 'Verità totale o proteggere l\'amico? Vota →',
        href: '/it/play/truth-friend',
      },
      {
        type: 'h2',
        text: 'In Famiglia',
      },
      {
        type: 'list',
        items: [
          'Tuo fratello o tua sorella ti chiede di non dire nulla ai tuoi genitori su qualcosa di serio. Pensi che dovrebbero sapere. A chi appartiene la tua lealtà?',
          'Un familiare ti chiede di garantire per lui in una situazione dove hai dei dubbi reali. Dire sì lo protegge nel breve termine. Dire no è onesto — ma ha conseguenze.',
          'Scopri che un familiare nasconde un problema serio — economico, di salute, sentimentale. Non vuole parlarne. Forzi la situazione o rispetti il silenzio?',
        ],
      },
      {
        type: 'cta',
        label: 'Il segreto di un fratello — vota lo scenario →',
        href: '/it/play/sibling-secret',
      },
      {
        type: 'h2',
        text: 'In Coppia e Nelle Relazioni',
      },
      {
        type: 'list',
        items: [
          'Il tuo partner ti chiede di mentire per lui — o per lei — in una situazione in cui la verità sarebbe imbarazzante. Stai dalla sua parte o dici quello che è vero?',
          'Sai qualcosa del passato della persona che ami che lei non ti ha mai detto — e che cambierebbe qualcosa tra voi. Apri quella conversazione?',
          'Stai scegliendo tra una carriera che ti cambia la vita e una relazione importante. Non puoi avere entrambe. Cosa lasci andare?',
        ],
      },
      {
        type: 'cta',
        label: 'Amore o carriera — come vota il mondo? →',
        href: '/it/play/love-or-career',
      },
      {
        type: 'h2',
        text: 'Perché i Dilemmi Etici Reali Sono Più Difficili del Problema del Tram',
      },
      {
        type: 'p',
        text: 'Il problema del tram disturba perché è estremo. Ma i dilemmi reali sono più difficili perché coinvolgono persone che conosci, con conseguenze che ti seguono.',
      },
      {
        type: 'p',
        text: 'Su SplitVote, i dilemmi che dividono le persone in modo più netto non sono quasi mai quelli filosofici astratti. Sono quelli familiari — un amico, un collega, una scena di famiglia. Il voto si avvicina perché il conflitto è reale.',
      },
      {
        type: 'p',
        text: 'La parte più onesta di chi sei non emerge nel pensiero. Emerge quando devi scegliere davvero.',
      },
      {
        type: 'cta',
        label: 'Vota — nessun account richiesto →',
        href: '/it/play/truth-friend',
      },
      {
        type: 'h2',
        text: 'Tre framework che aiutano a pensare a questi dilemmi',
      },
      {
        type: 'p',
        text: 'Quando due valori che davvero senti tuoi vanno in direzioni opposte, tre framework etici classici offrono lenti diverse — concentrate sui risultati, sulle regole o sul carattere.',
      },
      {
        type: 'cta',
        label: 'Consequenzialismo: cosa produce il maggior bene? →',
        href: '/it/blog/consequenzialismo-il-bene-maggiore',
      },
      {
        type: 'cta',
        label: 'Deontologia: quali doveri valgono sempre? →',
        href: '/it/blog/deontologia-alcune-cose-sono-sempre-sbagliate',
      },
      {
        type: 'cta',
        label: 'Etica della virtù: cosa farebbe una persona di buon carattere? →',
        href: '/it/blog/etica-della-virtu-cosa-farebbe-una-persona-buona',
      },
      {
        type: 'disclaimer',
        text: 'Contenuto educativo, non consulenza professionale di alcun tipo.',
      },
    ],
  },
  {
    slug: 'cos-e-splitvote',
    locale: 'it',
    title: "Cos'è SplitVote?",
    seoTitle: "Cos'è SplitVote? Come funziona il voto sui dilemmi morali",
    description:
      "SplitVote è una piattaforma in cui voti sui dilemmi morali e vedi come ha risposto il resto del mondo. Nessuna risposta giusta — solo divisioni reali.",
    seoDescription:
      "SplitVote è una piattaforma di voto per dilemmi morali. Vota in modo anonimo, scopri i risultati e il tuo profilo morale. Nessun account.",
    date: '2026-05-04',
    readingTime: 3,
    tags: ['splitvote', 'come funziona', 'dilemmi morali'],
    relatedDilemmaIds: ['trolley', 'self-driving-crash', 'cover-accident'],
    alternateSlug: 'what-is-splitvote',
    content: [
      {
        type: 'p',
        text: "SplitVote è una piattaforma costruita attorno a un'idea: i dilemmi morali rivelano qualcosa di te che le domande astratte non riescono a fare. Non quiz di personalità. Non sondaggi. Un voto tra due opzioni reali — ciascuna con un costo genuino.",
      },
      {
        type: 'p',
        text: "Ogni domanda su SplitVote è un vero dilemma. Non esiste una risposta oggettivamente giusta. L'obiettivo è scegliere — e poi vedere dove è atterrato il resto del mondo.",
      },
      {
        type: 'h2',
        text: 'Come funziona',
      },
      {
        type: 'list',
        items: [
          "Scegli un dilemma — esperimenti mentali filosofici classici, enigmi di etica dell'IA, conflitti di lealtà quotidiani.",
          'Scegli una delle due opzioni. Nessuna spiegazione richiesta.',
          'Vedi il risultato in tempo reale: come si divide il voto tra tutti coloro che hanno partecipato.',
          'Vota altri dilemmi per costruire il tuo profilo di personalità morale.',
        ],
      },
      {
        type: 'cta',
        label: 'Prova il tuo primo dilemma →',
        href: '/it/play/trolley',
      },
      {
        type: 'h2',
        text: 'Cosa ottieni votando',
      },
      {
        type: 'p',
        text: "Ogni voto aggiorna le percentuali di risultato in tempo reale. Alcuni dilemmi si dividono quasi esattamente al 50/50. Altri vanno 80/20. Entrambi sono interessanti — per ragioni diverse.",
      },
      {
        type: 'p',
        text: "Dopo tre o più voti, puoi accedere per sbloccare il tuo profilo di personalità morale: quale dei 18 archetipi si avvicina di più al tuo schema di scelte.",
      },
      {
        type: 'cta',
        label: 'Dilemmi di tendenza →',
        href: '/it/trending',
      },
      {
        type: 'h2',
        text: 'Per chi è pensato?',
      },
      {
        type: 'p',
        text: "Per chiunque trovi interessante stare davanti a una scelta difficile. Non ci sono premi, classifiche o pressione sociale. Solo dilemmi e dati reali da persone reali che hanno votato.",
      },
      {
        type: 'p',
        text: "Puoi votare senza account. I risultati sono pubblici. SplitVote è un progetto indipendente con sede in Italia.",
      },
      {
        type: 'cta',
        label: 'Chi siamo →',
        href: '/it/about',
      },
      {
        type: 'disclaimer',
        text: "SplitVote è pensato per intrattenimento e curiosità aggregata — non come studio scientifico o valutazione psicologica.",
      },
    ],
  },
  {
    slug: 'come-funziona-il-voto-anonimo',
    locale: 'it',
    title: 'Come funziona il voto anonimo su SplitVote',
    seoTitle: 'Come funziona il voto anonimo su SplitVote — privacy',
    description:
      "Puoi votare su SplitVote senza un account. Come la piattaforma gestisce i voti, cosa fa un cookie e cosa succede quando accedi.",
    seoDescription:
      "Come gestisce SplitVote il tuo voto? Puoi votare senza account. I voti anonimi usano un cookie locale. Se accedi, la cronologia resta nel tuo account.",
    date: '2026-05-04',
    readingTime: 3,
    tags: ['privacy', 'voto anonimo', 'come funziona'],
    relatedDilemmaIds: ['trolley', 'cover-accident', 'whistleblower'],
    alternateSlug: 'how-anonymous-voting-works',
    content: [
      {
        type: 'p',
        text: "Puoi votare su SplitVote senza creare un account. Nessun indirizzo email, nessuna registrazione — scegli solo un lato e vedi il risultato.",
      },
      {
        type: 'h2',
        text: 'Cosa succede quando voti senza account',
      },
      {
        type: 'p',
        text: "I voti anonimi usano un cookie locale memorizzato nel tuo browser. Questo è il modo in cui SplitVote riconosce che lo stesso browser ha già votato su un dilemma — così il tuo voto non viene contato due volte se ricarichi la pagina.",
      },
      {
        type: 'p',
        text: "Il cookie rimane sul tuo dispositivo. Non è collegato al tuo nome, email o a nessuna identità esterna. Cancellare i cookie del browser lo rimuove.",
      },
      {
        type: 'h2',
        text: 'Cosa mostrano i risultati',
      },
      {
        type: 'p',
        text: "Le percentuali dei risultati mostrano la divisione aggregata — come si sono distribuiti tutti i voti espressi su un dilemma tra l'opzione A e l'opzione B. Non rivelano chi ha scelto quale lato.",
      },
      {
        type: 'cta',
        label: 'Vedi i risultati in tempo reale sul problema del tram →',
        href: '/it/results/trolley',
      },
      {
        type: 'h2',
        text: 'Cosa cambia quando accedi',
      },
      {
        type: 'p',
        text: "Se accedi, SplitVote può conservare la tua cronologia dei voti e i progressi della personalità nel tuo account. Questo ti permette di vedere il tuo profilo di personalità morale su tutti i dilemmi a cui hai partecipato.",
      },
      {
        type: 'p',
        text: "Accedere è facoltativo. L'esperienza principale — vota e vedi i risultati — non richiede un account.",
      },
      {
        type: 'cta',
        label: 'Leggi la nostra Privacy Policy →',
        href: '/it/privacy',
      },
      {
        type: 'disclaimer',
        text: "Per informazioni complete su quali dati raccoglie SplitVote e come vengono utilizzati, leggi la Privacy Policy su splitvote.io/it/privacy.",
      },
    ],
  },
  {
    slug: 'come-leggere-i-risultati-splitvote',
    locale: 'it',
    title: 'Come leggere i risultati di SplitVote',
    seoTitle: 'Come leggere i risultati di SplitVote — le percentuali',
    description:
      "Una percentuale SplitVote mostra come hanno scelto le persone che hanno votato su questa piattaforma. Ecco cosa leggere nei dati — e cosa no.",
    seoDescription:
      "Cosa significa una percentuale SplitVote? Come leggere una divisione 50/50 vs 80/20, e perché i risultati non sono un campione scientifico.",
    date: '2026-05-04',
    readingTime: 3,
    tags: ['risultati', 'come leggere', 'dati'],
    relatedDilemmaIds: ['trolley', 'organ-harvest', 'cover-accident'],
    alternateSlug: 'how-to-read-splitvote-results',
    content: [
      {
        type: 'p',
        text: "Quando voti su un dilemma SplitVote, vedi una percentuale di divisione. Ecco cosa significa quel numero — e cosa non significa.",
      },
      {
        type: 'h2',
        text: 'Cosa rappresenta la percentuale',
      },
      {
        type: 'p',
        text: "La percentuale mostra come si sono distribuiti tutti i voti espressi su quel dilemma tra l'opzione A e l'opzione B. Se il problema del tram mostra il 55% che abbassa la leva e il 45% che non fa nulla, questa è la distribuzione dei voti degli utenti SplitVote che hanno risposto.",
      },
      {
        type: 'p',
        text: "Non è un campione rappresentativo di tutti gli esseri umani. Riflette le persone che hanno trovato e votato su questa piattaforma — un pubblico che tende verso chi cerca contenuti su dilemmi morali.",
      },
      {
        type: 'cta',
        label: 'Vedi i risultati in tempo reale su un dilemma reale →',
        href: '/it/results/trolley',
      },
      {
        type: 'h2',
        text: 'Cosa significa una divisione 50/50',
      },
      {
        type: 'p',
        text: "Una divisione quasi uguale segnala solitamente un conflitto di valori genuino — due posizioni difendibili con peso comparabile. Nessuna delle due è ovviamente sbagliata. Il dilemma sta facendo il suo lavoro.",
      },
      {
        type: 'h2',
        text: 'Cosa significa una divisione 80/20',
      },
      {
        type: 'p',
        text: "Una forte maggioranza in una direzione può significare che la formulazione favorisce un'opzione, o che la maggior parte delle persone condivide un'intuizione forte su questa domanda specifica. Non significa che la minoranza abbia torto — le intuizioni morali variano tra culture, fasce d'età ed esperienze di vita.",
      },
      {
        type: 'h2',
        text: 'Numero di voti',
      },
      {
        type: 'p',
        text: "I risultati con poche decine di voti sono segnali precoci. I risultati con decine di migliaia di voti sono più stabili — ma riflettono comunque il pubblico di SplitVote, non un sondaggio scientifico.",
      },
      {
        type: 'h2',
        text: 'Personalità e risultati',
      },
      {
        type: 'p',
        text: "I tuoi voti alimentano un profilo di personalità morale. Quando vedi il tuo archetipo, riflette lo schema delle tue scelte — non un confronto con uno standard clinico. È uno specchio delle tue risposte su questa piattaforma.",
      },
      {
        type: 'cta',
        label: 'Dilemmi di tendenza →',
        href: '/it/trending',
      },
      {
        type: 'disclaimer',
        text: "I dati dei risultati di SplitVote riflettono i voti degli utenti SplitVote, non un campione scientifico rappresentativo. I risultati sono solo per intrattenimento e curiosità aggregata.",
      },
    ],
  },
  {
    slug: 'cosa-significa-la-tua-personalita-morale',
    locale: 'it',
    title: 'Cosa significa il tuo profilo di personalità morale',
    seoTitle: 'Profilo di personalità morale su SplitVote: cosa significa',
    description:
      "SplitVote ti assegna un archetipo in base ai tuoi voti su cinque dimensioni morali. Ecco cosa misurano gli assi e come leggere il tuo profilo.",
    seoDescription:
      "Cos'è un archetipo di personalità morale SplitVote? Cinque dimensioni, 18 archetipi e cosa afferma — e non afferma — il tuo profilo.",
    date: '2026-05-04',
    readingTime: 4,
    tags: ['personalità', 'profilo morale', 'archetipi'],
    relatedDilemmaIds: ['trolley', 'cover-accident', 'whistleblower'],
    alternateSlug: 'what-your-moral-personality-means',
    content: [
      {
        type: 'p',
        text: "Dopo aver votato su tre o più dilemmi e aver effettuato l'accesso, SplitVote ti mostra un archetipo di personalità morale. Ecco cosa misura — e come leggerlo in modo onesto.",
      },
      {
        type: 'h2',
        text: 'Le cinque dimensioni morali',
      },
      {
        type: 'p',
        text: 'SplitVote traccia i tuoi voti su cinque dimensioni interne, ispirate al modo in cui gli psicologi morali pensano al ragionamento etico:',
      },
      {
        type: 'list',
        items: [
          'Utilità vs Principio — dai priorità ai risultati (consequenzialista) o alle regole fisse (deontologista)?',
          "Libertà vs Sicurezza — ti orienti verso l'autonomia individuale (libertario) o verso la protezione delle persone dal danno (paternalista)?",
          'Lealtà vs Giustizia — pesi i legami con persone specifiche (leale) o le regole imparziali che si applicano a tutti (universalista)?',
          'Rischio vs Cautela — accetti costi incerti per ottenere qualcosa (temerario) o preferisci il percorso più sicuro e noto (conservatore)?',
          'Individuo vs Collettivo — dai priorità a ciò che è meglio per una singola persona (individualista) o per il gruppo (collettivista)?',
        ],
      },
      {
        type: 'p',
        text: "Queste cinque dimensioni sono il modello interno di SplitVote, ispirato a decenni di ricerca sulla psicologia morale. Non sono l'implementazione diretta di nessuna singola teoria accademica.",
      },
      {
        type: 'h2',
        text: 'I 18 archetipi',
      },
      {
        type: 'p',
        text: "Ogni archetipo rappresenta uno schema di punteggi sui cinque assi. L'algoritmo trova l'archetipo il cui profilo è più vicino ai tuoi punteggi e te lo assegna.",
      },
      {
        type: 'p',
        text: "Il tuo archetipo non è un verdetto. È uno schema derivato dai dilemmi specifici a cui hai votato su SplitVote. Una combinazione diversa di dilemmi, o un giorno diverso, potrebbe produrre un risultato diverso.",
      },
      {
        type: 'cta',
        label: 'Vedi il tuo profilo morale →',
        href: '/it/personality',
      },
      {
        type: 'h2',
        text: 'Cosa non afferma il profilo',
      },
      {
        type: 'p',
        text: "Il profilo di personalità morale è pensato per intrattenimento e auto-riflessione, non per classificazione clinica. Non prevede comportamenti, non misura l'intelligenza e non ha alcun peso psicologico o diagnostico.",
      },
      {
        type: 'p',
        text: "I ricercatori che studiano i fondamenti morali — come il lavoro alla base di moralfoundations.org — usano questionari validati e campioni rappresentativi di grandi dimensioni. I dilemmi SplitVote sono progettati per il coinvolgimento, non per la misurazione accademica.",
      },
      {
        type: 'cta',
        label: 'Vota per costruire il tuo profilo →',
        href: '/it/play/trolley',
      },
      {
        type: 'h2',
        text: 'Vuoi approfondire le teorie?',
      },
      {
        type: 'p',
        text: "L'asse \"Utility vs Principle\" si avvicina al dibattito tra consequenzialismo e deontologia nella filosofia morale. L'asse \"Loyalty vs Justice\" tocca questioni che l'etica della virtù gestisce in modo unico. Nessuno dei tre framework è giusto o sbagliato — ognuno illumina una parte diversa di come le persone ragionano davvero.",
      },
      {
        type: 'cta',
        label: 'Consequenzialismo: l\'etica dei risultati →',
        href: '/it/blog/consequenzialismo-il-bene-maggiore',
      },
      {
        type: 'cta',
        label: 'Deontologia: l\'etica dei doveri →',
        href: '/it/blog/deontologia-alcune-cose-sono-sempre-sbagliate',
      },
      {
        type: 'cta',
        label: 'Etica della virtù: l\'etica del carattere →',
        href: '/it/blog/etica-della-virtu-cosa-farebbe-una-persona-buona',
      },
      {
        type: 'cta',
        label: 'Perché le persone per bene non sono d\'accordo: la Teoria dei Fondamenti Morali →',
        href: '/it/blog/teoria-fondamenti-morali',
      },
      {
        type: 'cta',
        label: 'Come la scienza studia le intuizioni morali →',
        href: '/it/blog/psicologia-morale-sperimentale-come-la-scienza-studia-le-intuizioni-morali',
      },
      {
        type: 'disclaimer',
        text: "Gli archetipi SplitVote sono solo per intrattenimento e auto-riflessione — non uno strumento di valutazione psicologica, diagnostica o misura scientifica.",
      },
    ],
  },
  {
    slug: 'statistiche-problema-del-carrello',
    locale: 'it',
    title: 'Il Problema del Carrello: Risultati del Sondaggio e Come Vota la Gente',
    seoTitle: 'Il Problema del Carrello: Risultati del Sondaggio e Come Vota la Gente',
    description:
      "Come vota davvero la gente sul problema del carrello? Risultati dei sondaggi SplitVote sulla versione classica e le sue varianti. Nessuna scienza — solo voti reali.",
    seoDescription:
      "Come vota davvero la gente sul problema del carrello? Risultati dei sondaggi SplitVote sulla versione classica e le sue varianti. Nessuna scienza — solo voti reali.",
    date: '2026-04-27',
    readingTime: 5,
    tags: ['problema del carrello', 'risultati sondaggio', 'etica', 'dilemmi morali'],
    alternateSlug: 'trolley-problem-statistics',
    relatedDilemmaIds: ['trolley', 'organ-harvest', 'lifeboat', 'cure-secret', 'memory-erase', 'truth-friend'],
    content: [
      {
        type: 'p',
        text: "La maggior parte delle persone è sicura di sapere cosa farebbe. Poi vota — e la divisione le sorprende.",
      },
      {
        type: 'p',
        text: "Il problema del carrello è uno dei dilemmi morali più votati su SplitVote. I risultati cambiano significativamente tra le varianti, e le ragioni che le persone danno per ogni scelta sono più rivelatrici dei numeri.",
      },
      {
        type: 'cta',
        label: "Cos'è un dilemma morale? →",
        href: '/it/dilemmi-morali',
      },
      {
        type: 'cta',
        label: 'Domande "Preferiresti" difficili →',
        href: '/it/domande-would-you-rather',
      },
      {
        type: 'h2',
        text: 'Cosa Chiede Davvero il Problema del Carrello',
      },
      {
        type: 'p',
        text: "Un tram fuori controllo si dirige verso cinque persone legate ai binari. Sei vicino a una leva. Se la tiri, il tram devia su un binario laterale — dove c'è una sola persona legata.",
      },
      {
        type: 'p',
        text: 'Cinque vite salvate. Una persa. Con la tua azione diretta.',
      },
      {
        type: 'p',
        text: "Oppure: non tirare. Cinque persone muoiono. Tu non ne sei la causa.",
      },
      {
        type: 'p',
        text: 'Nessun dettaglio nascosto. Nessuna via d\'uscita. Devi scegliere.',
      },
      {
        type: 'cta',
        label: 'Vota il problema del carrello — vedi la divisione in tempo reale →',
        href: '/it/play/trolley',
      },
      {
        type: 'h2',
        text: 'Risultati del Sondaggio: La Versione Classica',
      },
      {
        type: 'p',
        text: 'Tutti i dati qui sotto sono risultati dei sondaggi SplitVote — non ricerca scientifica. I risultati si aggiornano in tempo reale con ogni nuovo voto.',
      },
      {
        type: 'p',
        text: "La divisione è più equilibrata di quanto la maggior parte delle persone preveda prima di votare. Prima di provarlo, molti si aspettano qualcosa come 85–90% che tira la leva. I risultati in tempo reale raccontano una storia diversa.",
      },
      {
        type: 'p',
        text: "La ragione più frequente tra chi non tira: \"Non causerò attivamente la morte di qualcuno, anche per salvarne di più. Quel confine per me è importante.\"",
      },
      {
        type: 'cta',
        label: 'Vedi la divisione attuale in tempo reale →',
        href: '/it/play/trolley',
      },
      {
        type: 'h2',
        text: 'Le Varianti Che Cambiano il Voto',
      },
      {
        type: 'p',
        text: "Il problema del carrello cambia completamente quando cambia un solo dettaglio. Ogni versione qui sotto è un voto dal vivo — provale e confronta.",
      },
      {
        type: 'h3',
        text: 'La variante del ponte',
      },
      {
        type: 'p',
        text: "Invece di una leva, sei su un ponte. L'unico modo per fermare il tram è spingere una persona grande nella sua traiettoria. Stessa matematica — 1 vita per 5 — azione diversa.",
      },
      {
        type: 'p',
        text: "Il calo rispetto alla versione con la leva è significativo. Il caso SplitVote più vicino a questa logica coinvolge lo stesso compromesso etico in un contesto medico.",
      },
      {
        type: 'cta',
        label: 'Vota il dilemma del trapianto di organi →',
        href: '/it/play/organ-harvest',
      },
      {
        type: 'h3',
        text: 'La variante del trapianto di organi',
      },
      {
        type: 'p',
        text: "Un chirurgo può salvare cinque pazienti prelevando gli organi di una persona sana senza consenso. Aritmetica identica al carrello. Voto molto diverso.",
      },
      {
        type: 'cta',
        label: 'Vedi la divisione attuale in tempo reale →',
        href: '/it/play/organ-harvest',
      },
      {
        type: 'h3',
        text: 'La variante personale',
      },
      {
        type: 'p',
        text: "Stesso tram. Ma la persona sul binario laterale è qualcuno che conosci. Cambia la tua risposta? Il legame personale sposta consistentemente i numeri.",
      },
      {
        type: 'cta',
        label: 'Vota il problema del carrello →',
        href: '/it/play/trolley',
      },
      {
        type: 'h3',
        text: "La variante dell'inazione",
      },
      {
        type: 'p',
        text: "Non sei tu alla leva. Qualcun altro potrebbe tirarla ma non lo fa. Intervieni? Ignorare l'inazione altrui ottiene un risultato distinto.",
      },
      {
        type: 'cta',
        label: 'Vota il problema del carrello →',
        href: '/it/play/trolley',
      },
      {
        type: 'h2',
        text: '10 Dilemmi Correlati e Le Loro Divisioni in Tempo Reale',
      },
      {
        type: 'p',
        text: "Questi sono tutti scenari reali su SplitVote, ognuno costruito sulla stessa tensione centrale del problema del carrello. I risultati sono dati di sondaggio — non ricerca.",
      },
      {
        type: 'list',
        items: [
          "Trapianto di organi — preleva gli organi di una persona sana per salvarne cinque malate.",
          'Scialuppa di salvataggio — 8 posti, 12 sopravvissuti. Chi decide chi sale?',
          "La cura proibita — esiste una cura per una malattia mortale, ma ottenerla richiede un'azione che la maggior parte considera inaccettabile.",
          'Cancellare un ricordo — elimina il tuo ricordo più doloroso, ma cambia chi sei per sempre.',
          "La verità all'amico — il tuo migliore amico vuole la tua onestà completa su qualcosa che lo farà soffrire.",
          'Vaccino obbligatorio — dovrebbe la vaccinazione essere legalmente obbligatoria per proteggere chi non può riceverla?',
          'Il whistleblower — scopri gravi irregolarità nella tua azienda. Denunciarle ti costerà la carriera.',
          "Il condannato a morte esonerato — un prigioniero risulta innocente due giorni prima dell'esecuzione. Liberarlo scatena rivolte che uccidono dieci persone.",
          'La città sorvegliata — la sorveglianza totale riduce significativamente la criminalità, ma registra tutti, ovunque.',
          "L'IA sostituisce i lavori — un sistema IA elimina il tuo settore in 5 anni, ma riduce i costi per tutti gli altri.",
        ],
      },
      {
        type: 'cta',
        label: 'Vota il dilemma del trapianto →',
        href: '/it/play/organ-harvest',
      },
      {
        type: 'cta',
        label: 'Vota il dilemma della scialuppa →',
        href: '/it/play/lifeboat',
      },
      {
        type: 'cta',
        label: 'Vota il dilemma della cura →',
        href: '/it/play/cure-secret',
      },
      {
        type: 'cta',
        label: 'Vota il dilemma della memoria →',
        href: '/it/play/memory-erase',
      },
      {
        type: 'cta',
        label: 'Vota il dilemma della verità →',
        href: '/it/play/truth-friend',
      },
      {
        type: 'h2',
        text: 'Perché La Divisione Non Si Chiude',
      },
      {
        type: 'p',
        text: "Il problema del carrello è dibattuto da decenni. La tensione centrale non si risolve perché mette a nudo un conflitto genuino tra due posizioni etiche che la maggior parte delle persone tiene insieme.",
      },
      {
        type: 'p',
        text: 'Consequenzialismo: contano i risultati. 5 > 1. Tira la leva.',
      },
      {
        type: 'p',
        text: "Deontologia: alcune azioni sono sbagliate indipendentemente dal risultato. Usare una persona come mezzo viola qualcosa di fondamentale. Non tirare.",
      },
      {
        type: 'p',
        text: "La maggior parte delle persone non è l'una o l'altra. È entrambe. Il problema del carrello mostra dove si rompe l'equilibrio.",
      },
      {
        type: 'p',
        text: "Ciò che i risultati SplitVote mostrano è che questa divisione è straordinariamente costante. La tensione non è culturale. È umana.",
      },
      {
        type: 'cta',
        label: 'Vota il problema del carrello — risultati in tempo reale →',
        href: '/it/play/trolley',
      },
      {
        type: 'disclaimer',
        text: 'I risultati SplitVote rappresentano solo voti degli utenti — non ricerca scientifica. Tutti gli scenari sono ipotetici. Non consulenza etica o psicologica professionale.',
      },
    ],
  },
  {
    slug: 'ia-etica-40-milioni-scelte',
    locale: 'it',
    title: "Etica dell'IA: Cosa Hanno Scelto 40 Milioni di Persone sugli Incidenti delle Auto Autonome",
    seoTitle: "Dilemmi Etici dell'Intelligenza Artificiale: Lo Studio Moral Machine e le Scelte di 40 Milioni di Persone",
    description:
      "Nel 2018, i ricercatori del MIT hanno raccolto 40 milioni di decisioni morali da 233 paesi sugli incidenti delle auto a guida autonoma. Ecco cosa crede davvero il mondo — e perché le risposte differiscono così tanto tra culture.",
    seoDescription:
      "Un esperimento del 2018 ha raccolto 40 milioni di decisioni morali da 233 paesi su scenari di crash con auto autonome. Scopri cosa hanno scelto le persone, dove le culture si dividono e cosa significa per l'etica dell'IA.",
    date: '2026-05-09',
    readingTime: 6,
    tags: ['etica ia', 'auto a guida autonoma', 'moral machine', 'etica tecnologia', 'filosofia'],
    relatedDilemmaIds: ['self-driving-crash', 'robot-judge', 'ai-replaces-jobs', 'ai-art-copyright', 'brain-upload'],
    alternateSlug: 'ai-ethics-what-40-million-people-chose',
    content: [
      {
        type: 'p',
        text: "Quando i freni di un'auto a guida autonoma cedono e un incidente è inevitabile, chi deve proteggere l'algoritmo — il passeggero a bordo o il pedone fuori? La domanda sembra astratta, finché non ci si rende conto che gli ingegneri stanno codificando una risposta proprio in questo momento, in modo invisibile, in ogni veicolo autonomo sulle strade.",
      },
      {
        type: 'p',
        text: "Nel 2018, un gruppo di ricercatori del MIT ha condotto un esperimento su larga scala per studiare cosa credono davvero le persone riguardo a queste scelte. Hanno costruito una piattaforma chiamata Moral Machine e raccolto oltre 40 milioni di decisioni da persone in 233 paesi — il più grande sondaggio morale cross-culturale mai realizzato.",
      },
      {
        type: 'h2',
        text: 'Cosa ha scoperto il Moral Machine',
      },
      {
        type: 'p',
        text: "Ai partecipanti venivano mostrate variazioni dello stesso scenario: un veicolo autonomo di fronte a un incidente inevitabile, con diversi gruppi a rischio. I ricercatori variavano chi si trovava all'interno dell'auto, chi era fuori, quante persone erano coinvolte, se i pedoni attraversavano con il semaforo verde, e altri fattori.",
      },
      {
        type: 'p',
        text: "Analizzando quei 40 milioni di risposte, Awad e colleghi (Nature, 2018) hanno identificato diverse preferenze che emergevano con una certa coerenza tra le culture.",
      },
      {
        type: 'list',
        items: [
          'Salvare più vite quando i numeri differiscono — la maggior parte delle persone preferiva gli esiti che minimizzavano il numero totale di morti',
          'Risparmiare i più giovani — la preferenza per salvare bambini rispetto agli adulti, e adulti rispetto agli anziani, era presente nella maggior parte dei paesi',
          'Premiare il comportamento rispettoso delle regole — i pedoni che attraversavano con semaforo verde erano più spesso salvati rispetto a chi attraversava fuori dalle strisce',
          "Risparmiare gli esseri umani rispetto agli animali — uno dei risultati più costanti e trasversali dell'intero dataset",
        ],
      },
      {
        type: 'h2',
        text: 'Dove il mondo si divide',
      },
      {
        type: 'p',
        text: "Il dato più rilevante non era il consenso — era la variazione. I ricercatori hanno identificato tre distinti cluster culturali. I paesi occidentali (gran parte di Europa e Nord America) mostravano una preferenza più marcata per proteggere i pedoni rispetto ai passeggeri. I paesi dell'Asia orientale attribuivano maggiore peso al risparmio degli anziani rispetto ai partecipanti occidentali. I paesi del Sud del mondo formavano un terzo cluster, con una tendenza a privilegiare la minimizzazione del numero totale di vittime indipendentemente da altre caratteristiche.",
      },
      {
        type: 'p',
        text: "Questa variazione ha implicazioni enormi per le politiche pubbliche. Un'auto a guida autonoma programmata in California incorporerà le preferenze morali degli ingegneri e dei regolatori californiani — ma poi verrà venduta a Tokyo, São Paulo e Berlino. Il Moral Machine ha dimostrato che non esiste una risposta globale univoca su chi l'algoritmo debba proteggere.",
      },
      {
        type: 'h2',
        text: 'Il problema più profondo: chi decide?',
      },
      {
        type: 'p',
        text: "Anche se ci fosse un consenso cross-culturale chiaro, resterebbe irrisolta una seconda domanda: le preferenze di chi dovrebbe seguire l'auto? Del passeggero che l'ha pagata? Della maggioranza della società? Di un regolatore nazionale? Di un organismo internazionale di standardizzazione? Nessuna di queste risposte è ovvia.",
      },
      {
        type: 'p',
        text: "Non sono domande tecniche. Sono domande politiche e filosofiche — sulla responsabilità, sulla responsabilità legale e sulla legittimità di codificare scelte morali in algoritmi. Quando un guidatore umano prende una decisione in una frazione di secondo, possiamo tenerlo responsabile. Quando lo fa un algoritmo, la catena di responsabilità si spezza. È colpa dell'ingegnere del software? Dell'azienda? Del governo che ha approvato il veicolo?",
      },
      {
        type: 'h2',
        text: 'Tre dilemmi su cui puoi votare adesso',
      },
      {
        type: 'p',
        text: "Il crash dell'auto autonoma non è l'unico contesto in cui l'IA prende oggi decisioni morali. La stessa logica si applica agli strumenti automatizzati di sentencing, ai sistemi di moderazione dei contenuti e agli algoritmi di selezione del personale. Ecco tre dilemmi che mettono le domande direttamente al centro — vota e scopri come ti compari con persone da tutto il mondo.",
      },
      {
        type: 'cta',
        label: "Chi deve proteggere l'auto? Vota →",
        href: '/it/play/self-driving-crash',
      },
      {
        type: 'p',
        text: "Se un'IA è dimostrata accurata il 30% in più rispetto ai giudici umani nei processi penali, dovremmo sostituire i giudici umani con l'IA? L'argomento dell'accuratezza è convincente. Lo è anche quello della responsabilità.",
      },
      {
        type: 'cta',
        label: "L'IA dovrebbe sostituire i giudici? Vota →",
        href: '/it/play/robot-judge',
      },
      {
        type: 'p',
        text: "Quando si prevede che l'IA eliminerà il 30% dei posti di lavoro in un decennio, i governi dovrebbero rallentarne l'adozione o lasciare che i mercati e i programmi di riqualificazione si adattino?",
      },
      {
        type: 'cta',
        label: "IA e lavoro: frenare o lasciar andare? Vota →",
        href: '/it/play/ai-replaces-jobs',
      },
      {
        type: 'h2',
        text: 'Perché il tuo voto conta',
      },
      {
        type: 'p',
        text: "I sondaggi sull'etica astratta spesso ci dicono cosa le persone pensano di credere. I dilemmi morali in un contesto di voto dal vivo — dove vedi in tempo reale i risultati di migliaia di altri — rivelano qualcosa di più vicino alle preferenze reali. Quando vedi che il 58% dei votanti ha scelto di proteggere il pedone, o che la divisione nella tua area geografica è molto diversa dalla media globale, il modo in cui tieni la domanda cambia.",
      },
      {
        type: 'p',
        text: "I 40 milioni di dati del Moral Machine provengono da partecipanti che si sono iscritti volontariamente — non un campione rappresentativo dell'umanità. I voti di SplitVote vengono dallo stesso tipo di pubblico. Ma le preferenze morali aggregate, anche imperfette, hanno peso: fanno parte del modo in cui le società formano le norme, e le norme alla fine modellano le leggi.",
      },
      {
        type: 'cta',
        label: "Esplora tutti i dilemmi sull'etica dell'IA →",
        href: '/it/dilemmi-etici-intelligenza-artificiale',
      },
      {
        type: 'cta',
        label: 'Come la scienza studia le intuizioni morali →',
        href: '/it/blog/psicologia-morale-sperimentale-come-la-scienza-studia-le-intuizioni-morali',
      },
      {
        type: 'cta',
        label: 'Bioetica: quando la medicina impone scelte impossibili →',
        href: '/it/blog/bioetica-quando-la-medicina-impone-scelte-impossibili',
      },
      {
        type: 'disclaimer',
        text: "SplitVote presenta dilemmi etici per la riflessione e il confronto. I risultati rappresentano i voti della nostra community, non conclusioni scientifiche. Fonte: Awad et al., 'The Moral Machine experiment', Nature 558, 59–64 (2018).",
      },
    ],
  },
  {
    slug: 'lealta-vs-onesta-quando-si-scontrano',
    locale: 'it',
    title: 'Lealtà vs Onestà: Quando le Due Virtù Non Possono Coesistere',
    seoTitle: 'Lealtà vs Onestà — Quando Dire la Verità Significa Tradire Chi Ami',
    description:
      'La maggior parte dei veri dilemmi morali non riguarda trolley — riguarda persone che conosciamo. Quando lealtà e onestà entrano in conflitto diretto, quale vince? E dove si trova il punto di rottura?',
    seoDescription:
      "Lealtà e onestà sono entrambe virtù — finché non si scontrano. Esplora la psicologia morale di quando proteggere qualcuno di caro entra in conflitto con dire la verità, attraverso cinque dilemmi reali.",
    date: '2026-05-09',
    readingTime: 5,
    tags: ['lealtà', 'onestà', 'etica', 'filosofia morale', 'dilemmi morali'],
    relatedDilemmaIds: ['cover-accident', 'report-friend', 'sibling-secret', 'truth-friend', 'whistleblower'],
    alternateSlug: 'loyalty-vs-honesty-when-they-collide',
    content: [
      {
        type: 'p',
        text: "La maggior parte dei dilemmi morali nella vita reale non riguarda trolley fuori controllo o sconosciuti anonimi. Riguarda persone che conosciamo. Un partner che ha fatto qualcosa di terribile. Un fratello che nasconde qualcosa di doloroso. Un amico che ha superato un limite. La domanda non è più astratta — è: lo proteggo, o dico la verità?",
      },
      {
        type: 'p',
        text: "Lealtà e onestà sono entrambe autentiche virtù morali. Il problema è che possono non riuscire a coesistere nello stesso momento. Quando si scontrano, non puoi soddisfare entrambe — e la tua risposta rivela qualcosa di reale su come ragioni effettivamente in etica, indipendentemente dai valori che pensi di avere.",
      },
      {
        type: 'h2',
        text: 'Cosa le fa scontrare',
      },
      {
        type: 'p',
        text: "La lealtà — restare fedeli a chi dipende da noi — è alla base della fiducia, della famiglia e dei legami sociali che rendono possibile la cooperazione. L'onestà — dire la verità anche quando fa male — è alla base della giustizia, della responsabilità e delle relazioni costruite sulla realtà piuttosto che su una comoda bugia.",
      },
      {
        type: 'p',
        text: "La tensione emerge quando essere leali richiede di nascondere qualcosa. Il tuo partner brucia un semaforo rosso e uccide un pedone. Essere leale significa fuggire. Essere onesto significa chiamare la polizia. La matematica è identica: un atto, due valori, conflitto diretto. Non puoi fare entrambe le cose.",
      },
      {
        type: 'h2',
        text: 'Cosa ci dice la psicologia morale',
      },
      {
        type: 'p',
        text: "I ricercatori che studiano il ragionamento morale sostengono che le intuizioni umane attingono a molteplici preoccupazioni distinte che possono tirare in direzioni opposte — tra cui la cura per gli individui, l'equità e la giustizia, la lealtà verso i gruppi e il rispetto dei legami sociali. Persone diverse pesano queste preoccupazioni in modo diverso, e i pesi possono cambiare a seconda del contesto.",
      },
      {
        type: 'p',
        text: "Un framework influente, la Moral Foundations Theory, tratta lealtà ed equità come fondamenti morali separati che possono entrare in conflitto. Si tratta di un'area di ricerca attiva con dibattiti in corso — non di un consenso definitivo. I dilemmi di SplitVote esplorano tensioni simili per la riflessione, non come misura di alcuna teoria psicologica.",
      },
      {
        type: 'h2',
        text: "La gerarchia che la maggior parte di noi porta con sé",
      },
      {
        type: 'p',
        text: "La maggior parte delle persone ha una gerarchia implicita di lealtà, anche se non l'ha mai nominata: la lealtà verso i familiari stretti tende a prevalere sulla lealtà verso gli amici, che prevale sulla lealtà verso le istituzioni, che prevale sui principi astratti di onestà. Per questo coprire un fratello sembra diverso dal coprire un collega — e coprire uno sconosciuto sembra quasi impossibile.",
      },
      {
        type: 'p',
        text: "Ma la gerarchia cambia con la gravità del torto. Aiutare un amico a coprire una multa è diverso dal coprire un incidente mortale. La lealtà della maggior parte delle persone ha un punto di rottura — ma raramente sanno dove si trova finché non affrontano la situazione reale.",
      },
      {
        type: 'h2',
        text: 'Quattro dilemmi, quattro punti di rottura diversi',
      },
      {
        type: 'p',
        text: "Questi scenari mettono alla prova il confine lealtà-onestà a livelli di gravità diversi. Ognuno cambia qualcosa — la relazione, il danno causato, la reversibilità del torto. Dove si rompe la tua lealtà?",
      },
      {
        type: 'cta',
        label: 'Il tuo partner ha causato un incidente mortale. Fuggi o chiami la polizia? →',
        href: '/it/play/cover-accident',
      },
      {
        type: 'cta',
        label: 'Il tuo migliore amico ha sottratto fondi a un ente benefico. Lo denunci o gli parli prima? →',
        href: '/it/play/report-friend',
      },
      {
        type: 'cta',
        label: "Tuo fratello tradisce il coniuge — che è anche tuo amico. Lo dici o resti fuori? →",
        href: '/it/play/sibling-secret',
      },
      {
        type: 'cta',
        label: "Il nuovo partner del tuo migliore amico fa schifo. Sei onesto o mantieni la pace? →",
        href: '/it/play/truth-friend',
      },
      {
        type: 'h2',
        text: "Quando la lealtà verso una persona diventa lealtà verso un'istituzione",
      },
      {
        type: 'p',
        text: "Il conflitto assume una forma diversa quando non è personale ma istituzionale. I casi di whistleblowing rendono visibile la tensione lealtà-onestà su larga scala: la decisione di un singolo dipendente può esporre danni fatti a migliaia di persone e allo stesso tempo distruggere i mezzi di sostentamento di una comunità. Le posta in gioco è diversa — ma la domanda di fondo è la stessa.",
      },
      {
        type: 'cta',
        label: "La tua azienda inquina illegalmente un fiume. 1.000 posti di lavoro sono a rischio. Denunci o taci? →",
        href: '/it/play/whistleblower',
      },
      {
        type: 'cta',
        label: 'Esplora tutti i dilemmi su lealtà e onestà →',
        href: '/it/lealta-vs-onesta',
      },
      {
        type: 'cta',
        label: 'Perché le persone per bene non sono d\'accordo: la Teoria dei Fondamenti Morali →',
        href: '/it/blog/teoria-fondamenti-morali',
      },
      {
        type: 'cta',
        label: 'Privacy nel voto pubblico: cosa rivela il tuo voto anonimo →',
        href: '/it/blog/privacy-nel-voto-pubblico',
      },
      {
        type: 'disclaimer',
        text: "SplitVote presenta dilemmi etici per la riflessione e il confronto. Il riferimento alla Moral Foundations Theory è solo contestuale — il design di SplitVote è ispirato a, e non una replica di, alcun framework accademico. I risultati rappresentano i voti della nostra community, non conclusioni scientifiche.",
      },
    ],
  },
  {
    slug: 'consequenzialismo-il-bene-maggiore',
    locale: 'it',
    title: 'Consequenzialismo: Il Bene Maggiore per il Maggior Numero',
    seoTitle: 'Consequenzialismo — Perché la Matematica della Morale Ha i Suoi Limiti',
    description:
      'Il consequenzialismo giudica le azioni dai risultati. Produrre il massimo bene, minimizzare il danno. Sembra ovvio — finché i calcoli non ti costringono a fare qualcosa che sembra chiaramente sbagliato.',
    seoDescription:
      "Cos'è il consequenzialismo? Come funziona, dove si rompe, e quali dilemmi reali fatica ad affrontare? Esplora l'etica dei risultati attraverso cinque scenari.",
    date: '2026-05-10',
    readingTime: 5,
    tags: ['consequenzialismo', 'utilitarismo', 'etica', 'filosofia morale', 'problema del carrello'],
    relatedDilemmaIds: ['trolley', 'pandemic-dose', 'organ-harvest', 'rich-or-fair', 'universal-basic-income'],
    alternateSlug: 'consequentialism-the-greatest-good',
    content: [
      {
        type: 'p',
        text: "Sei davanti a una leva. Un tram fuori controllo si dirige verso cinque persone legate ai binari. Puoi deviarlo — ma così colpirebbe una persona sul binario laterale. Cosa fai? La maggior parte delle persone tira la leva. E nel farlo, ragiona da consequenzialista.",
      },
      {
        type: 'p',
        text: "Il consequenzialismo è la visione secondo cui il valore morale di un'azione dipende interamente dai suoi risultati. L'azione giusta è quella che produce il maggior bene — o il minor danno. Associato a Jeremy Bentham e John Stuart Mill, questo insieme di teorie — l'utilitarismo è la versione più nota — condivide una struttura comune: fai i conti morali, scegli il risultato migliore.",
      },
      {
        type: 'h2',
        text: 'Come funziona nella pratica',
      },
      {
        type: 'p',
        text: "L'approccio consequenzialista è seducentemente chiaro. Di fronte a una scelta difficile, chiedi: quale opzione produce il miglior risultato complessivo? Conta vantaggi e danni per tutti gli interessati — non solo per te — e scegli di conseguenza. Cinque vite valgono più di una. Prevenire la sofferenza vale più di rispettare una regola minore. Contano i risultati.",
      },
      {
        type: 'p',
        text: "Questo framework risuona con gli istinti di molte persone in certi contesti. Quando un medico raziona medicine scarse per salvare più vite, o quando un governo implementa una politica che beneficia milioni a spese di pochi, il ragionamento consequenzialista è all'opera. È l'etica dei pronto soccorso e della sanità pubblica.",
      },
      {
        type: 'h2',
        text: 'Dove la matematica si rompe',
      },
      {
        type: 'p',
        text: "Consideriamo uno scenario diverso: cinque pazienti in un ospedale moriranno senza trapianti d'organo. Un visitatore sano corrisponde a tutti e cinque. Un medico strettamente consequenzialista potrebbe giustificare il prelievo degli organi del visitatore per salvare cinque vite. La matematica dice sì. Quasi nessuno è d'accordo.",
      },
      {
        type: 'p',
        text: "Questa è la tensione centrale del consequenzialismo. Può approvare azioni che sembrano profondamente sbagliate — sacrificare individui, punire gli innocenti, tradire la fiducia — se il risultato aggregato è migliore. I critici sostengono che tratta le persone come strumenti. I difensori rispondono che ignorare i risultati è una forma di autocompiacimento morale.",
      },
      {
        type: 'h2',
        text: 'I dilemmi che lo mettono alla prova',
      },
      {
        type: 'p',
        text: "Questi scenari spingono il ragionamento consequenzialista ai suoi limiti. Alcuni sembrano facili. Altri rivelano dove i calcoli entrano in conflitto con qualcosa di più profondo.",
      },
      {
        type: 'cta',
        label: 'Un tram fuori controllo. Cinque vite o una. Cosa scegli? →',
        href: '/it/play/trolley',
      },
      {
        type: 'cta',
        label: 'Una dose di vaccino. Due pazienti, uno morirà. Chi la riceve? →',
        href: '/it/play/pandemic-dose',
      },
      {
        type: 'cta',
        label: 'Cinque pazienti moriranno senza organi. Una persona sana potrebbe salvarli tutti. →',
        href: '/it/play/organ-harvest',
      },
      {
        type: 'cta',
        label: 'Tassare i super-ricchi pesantemente per finanziare i servizi pubblici. Giusto? →',
        href: '/it/play/rich-or-fair',
      },
      {
        type: 'cta',
        label: 'Reddito universale di base per tutti — anche se costa posti di lavoro? →',
        href: '/it/play/universal-basic-income',
      },
      {
        type: 'h2',
        text: 'Come si relaziona alle altre teorie',
      },
      {
        type: 'p',
        text: "Il consequenzialismo è uno dei tre grandi framework della filosofia morale occidentale. La deontologia sostiene che alcune azioni sono sbagliate indipendentemente dai risultati — tirare la leva potrebbe comunque violare un dovere di non causare attivamente la morte. L'etica della virtù chiede non quale sia il risultato, ma cosa farebbe una persona di buon carattere. Tutti e tre illuminano aspetti diversi delle scelte difficili.",
      },
      {
        type: 'cta',
        label: 'Esplora tutti i dilemmi morali →',
        href: '/it/dilemmi-morali',
      },
      {
        type: 'cta',
        label: 'Bioetica: quando la medicina impone scelte impossibili →',
        href: '/it/blog/bioetica-quando-la-medicina-impone-scelte-impossibili',
      },
      {
        type: 'disclaimer',
        text: "SplitVote presenta dilemmi etici per la riflessione e il confronto. I riferimenti a framework filosofici sono solo contestuali — l'obiettivo è aiutarti a riflettere, non fornire istruzione accademica. I risultati rappresentano i voti della nostra community, non conclusioni scientifiche.",
      },
    ],
  },
  {
    slug: 'deontologia-alcune-cose-sono-sempre-sbagliate',
    locale: 'it',
    title: 'Deontologia: Alcune Cose Sono Sempre Sbagliate, Qualunque Sia il Risultato',
    seoTitle: 'Deontologia — Quando le Regole Contano Più dei Risultati',
    description:
      "La deontologia sostiene che alcune azioni sono semplicemente sbagliate, indipendentemente dal bene che potrebbero produrre. Kant ha costruito la versione più famosa di questa idea — e divide ancora oggi i filosofi morali.",
    seoDescription:
      "Cos'è la deontologia? Come funziona l'imperativo categorico di Kant e dove si rompe l'etica del dovere? Esplora i dilemmi che mettono alla prova le regole morali.",
    date: '2026-05-10',
    readingTime: 5,
    tags: ['deontologia', 'Kant', 'etica', 'filosofia morale', 'dovere morale'],
    relatedDilemmaIds: ['whistleblower', 'cover-accident', 'innocent-juror', 'mandatory-vaccine'],
    alternateSlug: 'deontology-some-things-are-always-wrong',
    content: [
      {
        type: 'p',
        text: "Alcune cose sono sbagliate indipendentemente da quale bene potrebbero produrre. Non puoi torturare un innocente anche se salverebbe cento vite. Non puoi incastrare qualcuno per un crimine che non ha commesso anche se impedirebbe una rivolta. Questa è l'intuizione centrale dell'etica deontologica — e la maggior parte delle persone la condivide, almeno a volte.",
      },
      {
        type: 'p',
        text: "La deontologia (dal greco deon, dovere) sostiene che la moralità riguarda fondamentalmente regole e obblighi, non risultati. La versione più influente viene da Immanuel Kant, che sosteneva che certe azioni siano intrinsecamente giuste o sbagliate, indipendentemente dalle conseguenze. Il suo test: agisci solo secondo principi che potresti razionalmente volere come leggi universali.",
      },
      {
        type: 'h2',
        text: "L'imperativo categorico di Kant",
      },
      {
        type: 'p',
        text: "L'imperativo categorico è l'idea centrale di Kant: prima di agire, chiedi se potresti razionalmente volere che tutti nella tua situazione agissero allo stesso modo. Se fai un'eccezione per te stesso che non accetteresti come regola universale — mentendo quando conviene, rompendo promesse quando è vantaggioso — stai agendo in modo immorale, indipendentemente dal risultato.",
      },
      {
        type: 'p',
        text: "Kant lo ha anche formulato in un altro modo: tratta sempre le persone come fini in sé, mai solo come mezzi. Ecco perché la deontologia si oppone allo scenario del prelievo degli organi — il paziente sano non è una risorsa da usare per gli altri, anche per salvare cinque vite. Ogni persona ha una dignità intrinseca che non può essere scambiata in un calcolo.",
      },
      {
        type: 'h2',
        text: 'Perché i risultati non risolvono la questione',
      },
      {
        type: 'p',
        text: "Il consequenzialismo dice: se mentire produce il risultato migliore, mentire è giusto. La deontologia non è d'accordo. Se mentire è sbagliato, è sbagliato anche quando la bugia impedirebbe un danno. L'errore è nell'azione stessa, non nei risultati che produce.",
      },
      {
        type: 'p',
        text: "Questo può sembrare rigido, e può esserlo. La versione stretta di Kant implica che non puoi mentire nemmeno a un assassino che chiede dove si nasconde il tuo amico. La maggior parte delle persone trova questa conclusione troppo estrema — ecco perché i deontologi contemporanei di solito consentono un giudizio contestuale pur preservando l'idea centrale che alcuni vincoli siano quasi assoluti.",
      },
      {
        type: 'h2',
        text: 'I dilemmi che lo mettono alla prova',
      },
      {
        type: 'p',
        text: "Questi scenari mettono i vincoli deontologici sotto pressione. Ognuno coinvolge un caso in cui rompere una regola potrebbe produrre un risultato migliore — e chiede se la regola vale ancora.",
      },
      {
        type: 'cta',
        label: 'La tua azienda inquina illegalmente un fiume. Hai il dovere di denunciarla? →',
        href: '/it/play/whistleblower',
      },
      {
        type: 'cta',
        label: 'Il tuo partner ha causato un incidente fatale. Coprirlo è sempre sbagliato? →',
        href: '/it/play/cover-accident',
      },
      {
        type: 'cta',
        label: "Sei in giuria. L'imputato è innocente — ma ti è stato detto di votare colpevole. →",
        href: '/it/play/innocent-juror',
      },
      {
        type: 'cta',
        label: 'Vaccinazione obbligatoria: esiste un dovere di proteggere gli altri anche contro la propria volontà? →',
        href: '/it/play/mandatory-vaccine',
      },
      {
        type: 'h2',
        text: 'Come si relaziona alle altre teorie',
      },
      {
        type: 'p',
        text: "Deontologia e consequenzialismo sono in tensione diretta: l'uno dice che contano solo i risultati, l'altro che alcune azioni sono escluse a prescindere. L'etica della virtù offre una terza via — invece di regole o calcoli, chiede cosa farebbe una persona di buon carattere. Ogni framework rivela qualcosa che gli altri mancano.",
      },
      {
        type: 'cta',
        label: 'Esplora tutti i dilemmi morali →',
        href: '/it/dilemmi-morali',
      },
      {
        type: 'cta',
        label: 'Causare vs permettere il danno: la distinzione che la deontologia difende →',
        href: '/it/blog/causare-vs-permettere-danno',
      },
      {
        type: 'cta',
        label: 'Bioetica: quando la medicina impone scelte impossibili →',
        href: '/it/blog/bioetica-quando-la-medicina-impone-scelte-impossibili',
      },
      {
        type: 'disclaimer',
        text: "SplitVote presenta dilemmi etici per la riflessione e il confronto. I riferimenti a framework filosofici sono solo contestuali — l'obiettivo è aiutarti a riflettere, non fornire istruzione accademica. I risultati rappresentano i voti della nostra community, non conclusioni scientifiche.",
      },
    ],
  },
  {
    slug: 'etica-della-virtu-cosa-farebbe-una-persona-buona',
    locale: 'it',
    title: 'Etica della Virtù: Cosa Farebbe una Persona di Buon Carattere?',
    seoTitle: "Etica della Virtù — Aristotele, il Carattere e la Vita Buona",
    description:
      "Invece di chiedere quale regola si applica o quale risultato massimizzare, l'etica della virtù pone una domanda diversa: cosa farebbe una persona di buon carattere? La risposta di Aristotele sfida ancora oggi la filosofia morale.",
    seoDescription:
      "Cos'è l'etica della virtù? Come si differenzia l'approccio di Aristotele rispetto a consequenzialismo e deontologia? Esplora l'etica di chi sei, non solo di cosa fai.",
    date: '2026-05-10',
    readingTime: 5,
    tags: ['etica della virtù', 'Aristotele', 'etica', 'carattere morale', 'filosofia morale'],
    relatedDilemmaIds: ['truth-friend', 'forgive-cheater', 'sibling-secret', 'love-or-career'],
    alternateSlug: 'virtue-ethics-what-would-a-good-person-do',
    content: [
      {
        type: 'p',
        text: "Il consequenzialismo dice: calcola il risultato migliore. La deontologia dice: segui le regole giuste. L'etica della virtù dice: diventa il tipo giusto di persona. Sposta la domanda morale fondamentale da 'cosa dovrei fare?' a 'chi dovrei essere?' — ed è il più antico dei tre grandi framework etici occidentali.",
      },
      {
        type: 'p',
        text: "Aristotele sosteneva che il fine della vita umana è l'eudaimonia — il fiorire, il vivere e agire bene. Questo si raggiunge non seguendo regole o massimizzando risultati, ma sviluppando virtù: tratti stabili del carattere come coraggio, onestà, compassione e saggezza pratica. Le virtù sono eccellenze del carattere, e si acquisiscono con la pratica. Si diventa coraggiosi facendo cose coraggiose.",
      },
      {
        type: 'h2',
        text: 'Cosa la rende diversa dagli altri framework',
      },
      {
        type: 'p',
        text: "Consequenzialismo e deontologia forniscono entrambi una procedura decisionale — un metodo per capire cosa fare. L'etica della virtù è più interessata alla persona che prende la decisione che alla decisione stessa. Una persona virtuosa porta la saggezza pratica (phronesis) nelle situazioni: la capacità di percepire ciò che conta, soppesare considerazioni in competizione e agire in modo appropriato — senza dover consultare un manuale di regole.",
      },
      {
        type: 'p',
        text: "Questo rende l'etica della virtù flessibile dove gli altri framework sono rigidi, ma anche meno precisa. Può riconoscere che la stessa azione — dire una verità difficile, per esempio — è coraggiosa in un contesto e crudele in un altro. Contano il contesto, la relazione e il carattere.",
      },
      {
        type: 'h2',
        text: "Dove l'etica della virtù è più forte",
      },
      {
        type: 'p',
        text: "L'etica della virtù gestisce le domande di relazione e di carattere che gli altri framework trovano difficili. Quando un amico ti chiede un'opinione onesta su una decisione che lo farà soffrire, il consequenzialismo calcola dolore e guadagno; la deontologia invoca doveri di onestà e gentilezza che possono confliggere. L'etica della virtù chiede cosa farebbe un amico onesto, compassionevole e leale — e accetta che questo richieda giudizio, non solo calcolo.",
      },
      {
        type: 'p',
        text: "Cattura anche qualcosa che consequenzialismo e deontologia tendono a trascurare: che il come si agisce conta, non solo il cosa. Una persona che fa la cosa giusta con risentimento, o per le ragioni sbagliate, non è pienamente virtuosa — anche se l'azione in sé era corretta.",
      },
      {
        type: 'h2',
        text: 'Dove si rompe',
      },
      {
        type: 'p',
        text: "L'etica della virtù è meno utile quando hai bisogno di una risposta chiara e rapida, o quando le virtù entrano in conflitto. Cosa fa una persona coraggiosa e onesta quando dire la verità causerà un danno serio? Il framework non ti dà una formula — solo l'istruzione di esercitare la saggezza pratica, che presuppone che tu ce l'abbia già.",
      },
      {
        type: 'h2',
        text: 'I dilemmi che lo mettono alla prova',
      },
      {
        type: 'p',
        text: "Questi scenari chiedono meno di regole o risultati e più di carattere. Che tipo di persona vuoi essere — e cosa fa quella persona qui?",
      },
      {
        type: 'cta',
        label: "Il nuovo partner del tuo migliore amico non va bene per lui. Sei onesto o gentile? →",
        href: '/it/play/truth-friend',
      },
      {
        type: 'cta',
        label: 'Il tuo partner ti ha tradito. Una persona che sa perdonare lo riprende? →',
        href: '/it/play/forgive-cheater',
      },
      {
        type: 'cta',
        label: "Tuo fratello tradisce il coniuge — che è anche tuo amico. Cosa richiede la lealtà? →",
        href: '/it/play/sibling-secret',
      },
      {
        type: 'cta',
        label: 'Amore o carriera: cosa sceglie una persona che conosce i propri valori? →',
        href: '/it/play/love-or-career',
      },
      {
        type: 'h2',
        text: 'Come si connette agli altri framework',
      },
      {
        type: 'p',
        text: "L'etica della virtù completa il trio dei grandi framework morali occidentali insieme a consequenzialismo e deontologia. Il consequenzialismo chiede quali risultati produrre; la deontologia chiede quali regole applicare; l'etica della virtù chiede quale carattere esprimere. Il ragionamento morale reale spesso attinge a tutti e tre — ecco perché lo stesso dilemma può sembrare molto diverso a seconda da dove si parte.",
      },
      {
        type: 'cta',
        label: 'Esplora tutti i dilemmi morali →',
        href: '/it/dilemmi-morali',
      },
      {
        type: 'cta',
        label: 'Bioetica: quando la medicina impone scelte impossibili →',
        href: '/it/blog/bioetica-quando-la-medicina-impone-scelte-impossibili',
      },
      {
        type: 'cta',
        label: 'Come la scienza studia le intuizioni morali →',
        href: '/it/blog/psicologia-morale-sperimentale-come-la-scienza-studia-le-intuizioni-morali',
      },
      {
        type: 'disclaimer',
        text: "SplitVote presenta dilemmi etici per la riflessione e il confronto. I riferimenti a framework filosofici sono solo contestuali — l'obiettivo è aiutarti a riflettere, non fornire istruzione accademica. I risultati rappresentano i voti della nostra community, non conclusioni scientifiche.",
      },
    ],
  },
  {
    slug: 'causare-vs-permettere-danno',
    locale: 'it',
    title: "Causare vs Permettere il Danno — Quando l'Inazione È Anche una Scelta",
    seoTitle: "Causare vs Permettere il Danno — Perché Tirare la Leva Sembra Diverso da Spingere l'Uomo",
    description:
      "Tirare una leva per deviare un carrello sembra diverso dallo spingere qualcuno per fermarlo — anche quando la matematica è identica. La distinzione tra causare e permettere è uno degli enigmi più profondi della filosofia morale. E modella come ragioniamo su tutto, dalla medicina alla povertà globale.",
    seoDescription:
      "Cos'è la distinzione tra causare e permettere il danno? Perché la maggior parte delle persone accetta un'uccisione attiva in alcuni casi e la rifiuta in altri? Esplora l'asimmetria morale che divide consequenzialisti e deontologi.",
    date: '2026-05-10',
    readingTime: 5,
    tags: ['causare vs permettere', 'etica', 'filosofia morale', 'problema del carrello', 'omissione'],
    relatedDilemmaIds: ['trolley', 'plane-parachute', 'pandemic-dose', 'mercy-kill', 'steal-medicine'],
    alternateSlug: 'doing-vs-allowing-harm',
    content: [
      {
        type: 'p',
        text: "Un carrello sta per investire cinque persone. Tirare una leva per deviarlo su un binario laterale ucciderà una persona ma ne salverà cinque. La maggior parte delle persone tira la leva. Ora cambia il caso: invece di una leva, devi spingere un uomo robusto giù da un ponte per fermare il carrello. Stessa matematica. Stesso risultato. Quasi nessuno spinge l'uomo.",
      },
      {
        type: 'p',
        text: "L'asimmetria è l'enigma. Perché tirare una leva sembra accettabile mentre spingere l'uomo no? Entrambe sono scelte attive che producono una morte per salvarne cinque. La differenza è una delle questioni più studiate della filosofia morale — e si trova alla base di innumerevoli dibattiti reali su medicina, povertà e responsabilità.",
      },
      {
        type: 'h2',
        text: 'La distinzione causare/permettere, definita',
      },
      {
        type: 'p',
        text: "La distinzione è tra causare attivamente un danno e semplicemente permettere che accada. Un medico che somministra un'iniezione letale causa attivamente la morte. Un medico che stacca il supporto vitale permette la morte. Un passante che non lancia una corda a una persona che annega ne permette la morte. La maggior parte delle tradizioni etiche tratta questi casi come moralmente diversi — anche quando l'esito è identico.",
      },
      {
        type: 'p',
        text: "L'intuizione dietro la distinzione: il mondo contiene danni che non abbiamo causato. Abbiamo un dovere forte di non aggiungerne. Il nostro dovere di prevenirli attivamente è più debole. Per questo un chirurgo che si rifiuta di prelevare organi per salvare cinque vite non si sente un assassino — anche se cinque persone moriranno per via del rifiuto.",
      },
      {
        type: 'h2',
        text: 'Perché la maggior parte delle persone sente la differenza',
      },
      {
        type: 'p',
        text: "In sondaggi su larga scala, circa l'85% delle persone tira la leva del carrello, ma solo circa il 30% spinge l'uomo dal ponte. La differenza non è nell'esito — è nel ruolo che giochi. Tirare una leva è causare un danno come effetto collaterale del salvare vite. Spingere una persona è usarla come mezzo per salvare vite. Quest'ultimo sembra profondamente sbagliato, anche quando l'aritmetica è identica.",
      },
      {
        type: 'p',
        text: "I ricercatori che studiano la cognizione morale sostengono che questa non è un'idiosincrasia del design dei sondaggi ma una caratteristica stabile di come funziona il giudizio morale umano. Le persone ragionano sulla causazione attiva e sulla permissione passiva come categorie fondamentalmente diverse — anche quando non sanno articolare perché.",
      },
      {
        type: 'h2',
        text: 'Perché alcuni filosofi rifiutano la distinzione',
      },
      {
        type: 'p',
        text: "I consequenzialisti sono scettici. Se l'esito è lo stesso, perché dovrebbe contare moralmente come è arrivato? L'argomento del bambino che annega lo rende netto: se salveresti un bambino che annega a costo minimo, dovresti anche agire su un problema di povertà globale che potresti significativamente ridurre a costo simile. Non agire, da questo punto di vista, è moralmente equivalente a causare attivamente il danno che hai permesso.",
      },
      {
        type: 'p',
        text: "Nella visione consequenzialista stretta, la distinzione causare/permettere è un'illusione morale — una storia confortante che ci raccontiamo per evitare le implicazioni esigenti del nostro potere di prevenire il danno. Se puoi salvare una vita a basso costo e scegli di non farlo, sei responsabile di quella morte. La distinzione tra causare e permettere si dissolve sotto pressione.",
      },
      {
        type: 'h2',
        text: 'Dove la linea si rompe nella pratica',
      },
      {
        type: 'p',
        text: "La distinzione è più difficile da mantenere nei contesti medici. Staccare il supporto vitale e somministrare un'iniezione letale possono produrre lo stesso esito sulla stessa tempistica. Molti eticisti sostengono che questi casi siano diversi; molti sostengono che non lo siano. La risposta legale nella maggior parte delle giurisdizioni è più vicina alla prima visione, ma il dibattito filosofico è tutt'altro che chiuso.",
      },
      {
        type: 'p',
        text: "Anche i casi in cui qualcuno potrebbe facilmente salvare un'altra vita e sceglie di non farlo mettono sotto stress la distinzione. Se sei l'unica persona che potrebbe dare a uno sconosciuto una medicina salvavita — senza alcun costo per te — e te ne vai, la maggior parte delle persone considera la cosa moralmente seria. La distinzione pura tra causare e permettere direbbe che non hai fatto nulla di male perché hai solo permesso la morte. La maggior parte delle intuizioni dissente.",
      },
      {
        type: 'h2',
        text: 'I dilemmi che lo mettono alla prova',
      },
      {
        type: 'p',
        text: "Questi scenari spingono il confine causare/permettere in direzioni diverse. Ognuno cambia qualcosa — la relazione con la vittima, il costo di agire, la direttezza della causazione. Dove tracci tu il confine?",
      },
      {
        type: 'cta',
        label: 'Un carrello fuori controllo. Cinque vite o una. Tiri la leva o stai fermo? →',
        href: '/it/play/trolley',
      },
      {
        type: 'cta',
        label: 'Un aereo precipita. Un paracadute, voi due. Lo prendi o lo dai? →',
        href: '/it/play/plane-parachute',
      },
      {
        type: 'cta',
        label: 'Una dose di vaccino. Due pazienti. Scegli, o rifiuti di scegliere? →',
        href: '/it/play/pandemic-dose',
      },
      {
        type: 'cta',
        label: "Un paziente terminale chiede aiuto per morire. Rifiuti o assisti? →",
        href: '/it/play/mercy-kill',
      },
      {
        type: 'cta',
        label: "Tuo figlio ha bisogno di una medicina che non puoi permetterti. La rubi o lo lasci soffrire? →",
        href: '/it/play/steal-medicine',
      },
      {
        type: 'h2',
        text: 'Come i grandi framework lo affrontano',
      },
      {
        type: 'p',
        text: "Il consequenzialismo tende a negare la distinzione: contano gli esiti, e il percorso per arrivarci è moralmente secondario. La deontologia difende la distinzione: c'è un dovere più forte di non causare attivamente danno che di prevenirlo, e le persone hanno diritti contro l'essere usate come mezzi. Dove ti collochi su questa questione modella come ragioni su molto più dei carrelli — modella come pensi a medicina, beneficenza, guerra e i limiti della responsabilità personale.",
      },
      {
        type: 'cta',
        label: 'Consequenzialismo: perché contano solo gli esiti →',
        href: '/it/blog/consequenzialismo-il-bene-maggiore',
      },
      {
        type: 'cta',
        label: 'Deontologia: perché alcuni vincoli sono quasi assoluti →',
        href: '/it/blog/deontologia-alcune-cose-sono-sempre-sbagliate',
      },
      {
        type: 'cta',
        label: 'Esplora tutti i dilemmi morali →',
        href: '/it/dilemmi-morali',
      },
      {
        type: 'disclaimer',
        text: "SplitVote presenta dilemmi etici per la riflessione e il confronto. I riferimenti a framework filosofici sono solo contestuali — l'obiettivo è aiutarti a riflettere, non fornire istruzione accademica. I risultati rappresentano i voti della nostra community, non conclusioni scientifiche.",
      },
    ],
  },
  {
    slug: 'privacy-nel-voto-pubblico',
    locale: 'it',
    title: 'Cosa Significa Privacy in un Mondo di Voti Pubblici',
    seoTitle: "Privacy in un Mondo di Voti Pubblici — Quando Anonimo Non È la Stessa Cosa di Privato",
    description:
      "Il voto anonimo protegge chi sei. I dati aggregati rivelano cosa pensa il tuo gruppo. L'inferenza basata sull'IA può re-identificare entrambi. La privacy nel 2026 non è una cosa sola — e i dilemmi che la circondano si fanno più difficili, in fretta.",
    seoDescription:
      "Cosa significa privacy quando i voti sono anonimi ma i dati pubblici? Esplora la differenza tra privacy d'identità e privacy d'informazione, e i dilemmi morali creati dalla sorveglianza basata sull'IA.",
    date: '2026-05-10',
    readingTime: 5,
    tags: ['privacy', 'sorveglianza', 'etica IA', 'GDPR', 'voto anonimo'],
    relatedDilemmaIds: ['surveillance-city', 'privacy-terror', 'deepfake-expose', 'censor-speech', 'delete-social-media'],
    alternateSlug: 'privacy-in-public-voting',
    content: [
      {
        type: 'p',
        text: "Voti in modo anonimo su un dilemma morale. La tua scelta individuale resta nascosta — niente nome, niente profilo, nessun record collegato a te. Ma il voto aggregato viene pubblicato: 62% ha scelto l'opzione A, 38% l'opzione B. Dal tuo singolo atto privato emerge una verità pubblica. Questa è la struttura di base del sondaggio anonimo — e solleva una domanda che si fa più difficile ogni anno: quando l'anonimo smette di essere privato?",
      },
      {
        type: 'p',
        text: "La privacy nel 2026 non è una cosa sola. È un insieme di preoccupazioni distinte che spesso vengono raggruppate insieme — e separarle conta perché i dilemmi morali che creano sono diversi in ciascun caso.",
      },
      {
        type: 'h2',
        text: "Le due dimensioni della privacy",
      },
      {
        type: 'p',
        text: "La privacy d'identità riguarda chi sei: il tuo nome, il tuo volto, i tuoi attributi verificabili. La privacy d'informazione riguarda cosa pensi, scegli o fai — anche quando nessuno sa che sei stato tu. Il voto anonimo protegge fortemente la privacy d'identità. Ma non protegge automaticamente la privacy d'informazione: i pattern aggregati rivelano cosa credono i gruppi, anche quando nessun individuo è identificabile.",
      },
      {
        type: 'p',
        text: "Queste due dimensioni possono separarsi nettamente. Un dataset perfettamente anonimo può ancora esporre cosa credono le persone della tua categoria demografica, regione o gruppo — a volte in modi che quelle persone non avrebbero mai condiviso se direttamente interrogate. L'anonimato a livello individuale non impedisce l'inferenza a livello di gruppo.",
      },
      {
        type: 'h2',
        text: 'Perché anonimo non è sempre privato',
      },
      {
        type: 'p',
        text: "L'anonimizzazione spesso fallisce sotto il riferimento incrociato. Combina un dataset anonimo con una o due altre fonti pubbliche — un record di pagamento, una traccia di posizione, un post sui social — e gli individui possono essere re-identificati con sorprendente accuratezza. I ricercatori l'hanno dimostrato ripetutamente: anche un'anonimizzazione apparentemente forte si rompe quando gli avversari hanno altri dati su cui lavorare.",
      },
      {
        type: 'p',
        text: "Oltre alla re-identificazione, i dati aggregati sollevano una preoccupazione diversa: la profilazione. Anche se nessun individuo è nominato, sapere come ragiona un gruppo può modellare come quel gruppo viene trattato — da pubblicitari, datori di lavoro, assicuratori o governi. La domanda sulla privacy si sposta da 'chi ha votato cosa' a 'cosa dice questo sul tipo di persone che sono' — e la seconda domanda è in qualche modo più consequenziale della prima.",
      },
      {
        type: 'h2',
        text: 'Come l\'IA cambia la posta in gioco della privacy',
      },
      {
        type: 'p',
        text: "L'inferenza algoritmica rende molto più stretto il divario tra privacy d'identità e privacy d'informazione. Un modello addestrato su sufficienti dati comportamentali può prevedere cose che non hai mai esplicitamente rivelato: convinzioni politiche, orientamento sessuale, stato di salute mentale, comportamenti futuri. I dati che alimentano tale inferenza vengono spesso raccolti da interazioni anonime o pseudonime — esattamente il tipo che i framework classici della privacy trattavano come a basso rischio.",
      },
      {
        type: 'p',
        text: "I media sintetici aggiungono un ulteriore livello. I deepfake mettono alla prova la domanda di cosa significhi anche solo verità in un mondo dove le prove possono essere fabbricate in modo convincente. Il consenso che ancorava i regimi più vecchi della privacy — il controllo su cosa viene pubblicato di te — diventa più difficile da far rispettare quando contenuti falsi convincenti possono essere prodotti da pochi secondi di filmato pubblico.",
      },
      {
        type: 'h2',
        text: 'I dilemmi che mettono la privacy sotto pressione',
      },
      {
        type: 'p',
        text: "Questi scenari mettono alla prova dove finisce la privacy e dove iniziano altri valori — sicurezza, responsabilità, libera espressione, sicurezza pubblica. Ognuno cambia qualcosa su chi sta osservando, chi viene osservato e cosa è in gioco.",
      },
      {
        type: 'cta',
        label: 'Una città più sicura attraverso la sorveglianza totale. Ne vale la pena? →',
        href: '/it/play/surveillance-city',
      },
      {
        type: 'cta',
        label: "Un'IA prevede un attacco terroristico con il 90% di accuratezza. Detieni il sospetto? →",
        href: '/it/play/privacy-terror',
      },
      {
        type: 'cta',
        label: 'Un deepfake espone un crimine reale. Lo usi come prova o lo distruggi? →',
        href: '/it/play/deepfake-expose',
      },
      {
        type: 'cta',
        label: "Un governo vuole censurare la disinformazione. Dove tracci il confine? →",
        href: '/it/play/censor-speech',
      },
      {
        type: 'cta',
        label: "Cancella tutta la tua storia sui social media. Liberato o cancellato? →",
        href: '/it/play/delete-social-media',
      },
      {
        type: 'h2',
        text: 'Come SplitVote affronta questa cosa',
      },
      {
        type: 'p',
        text: "La piattaforma prende sul serio la distinzione tra privacy d'identità e privacy d'informazione. I voti sono anonimi di default — nessun account richiesto, nessun dato personale legato alle scelte. Gli indirizzi IP usati per il rate limiting vengono hashati prima dell'archiviazione. I risultati aggregati sono pubblicati; le storie individuali di voto degli utenti loggati non vengono esposte pubblicamente. Il compromesso è onesto: contribuisci a un dataset pubblico di pattern morali, e la piattaforma contribuisce restituendo la protezione che le tue scelte individuali restino tue.",
      },
      {
        type: 'cta',
        label: 'Come funziona davvero il voto anonimo su SplitVote →',
        href: '/it/blog/come-funziona-il-voto-anonimo',
      },
      {
        type: 'cta',
        label: "Etica dell'IA: cosa hanno scelto 40 milioni di persone sulle decisioni delle macchine →",
        href: '/it/blog/ia-etica-40-milioni-scelte',
      },
      {
        type: 'cta',
        label: 'Esplora tutti i dilemmi morali →',
        href: '/it/dilemmi-morali',
      },
      {
        type: 'disclaimer',
        text: "SplitVote presenta dilemmi etici per la riflessione e il confronto. I riferimenti a framework sulla privacy e alla ricerca sull'IA sono solo contestuali — l'obiettivo è aiutarti a riflettere, non fornire consulenza legale o tecnica. I risultati rappresentano i voti della nostra community, non conclusioni scientifiche.",
      },
    ],
  },
  {
    slug: 'teoria-fondamenti-morali',
    locale: 'it',
    title: 'La Teoria dei Fondamenti Morali — Perché le Persone Oneste Non Sono d\'Accordo',
    seoTitle: 'Teoria dei Fondamenti Morali: Perché Persone Ragionevoli Hanno Etiche Completamente Diverse',
    description:
      "La Teoria dei Fondamenti Morali di Jonathan Haidt spiega perché due persone ragionevoli e solidali possono arrivare a conclusioni morali opposte — e perché nessuna delle due ha semplicemente torto.",
    seoDescription:
      "La Teoria dei Fondamenti Morali spiega perché le persone non sono d'accordo sull'etica: usiamo fondamenti diversi — Cura, Equità, Lealtà, Autorità, Sacralità, Libertà. Scopri i tuoi su SplitVote.",
    date: '2026-05-10',
    readingTime: 6,
    tags: ['psicologia morale', 'fondamenti morali', 'Jonathan Haidt', 'etica', 'psicologia politica'],
    relatedDilemmaIds: ['trolley', 'innocent-juror', 'truth-friend', 'surveillance-city', 'mandatory-vaccine'],
    alternateSlug: 'moral-foundations-theory-why-good-people-disagree',
    content: [
      {
        type: 'p',
        text: "Vedi un tram diretto verso cinque persone. Puoi tirare una leva e deviarlo — ma questo ucciderà una persona sull'altro binario. Tiri la leva. Il tuo amico, altrettanto riflessivo e altrettanto compassionevole, dice che non interverrebbe mai: staresti usando qualcuno come mezzo per un fine. Siete entrambi persone morali che ragionano con cura. Allora perché il disaccordo totale?",
      },
      {
        type: 'p',
        text: "La risposta, secondo lo psicologo Jonathan Haidt, è che non state usando lo stesso linguaggio morale. La sua Teoria dei Fondamenti Morali propone che la moralità umana si costruisca su diversi sistemi psicologici distinti — e persone diverse li pesano in modo diverso. Capire quali fondamenti guidano il tuo ragionamento cambia il modo in cui interpreti i conflitti morali.",
      },
      {
        type: 'h2',
        text: 'I sei fondamenti morali',
      },
      {
        type: 'p',
        text: "Haidt e i suoi colleghi identificano sei intuizioni morali fondamentali che appaiono tra le culture, sebbene siano espresse diversamente nelle diverse società:",
      },
      {
        type: 'list',
        items: [
          'Cura / Danno — sensibilità alla sofferenza e impulso a proteggere i vulnerabili. È il fondamento che rende la crudeltà visceralemente sbagliata.',
          'Equità / Imbroglio — preoccupazione per il trattamento uguale, la giustizia e la punizione di chi prende più del dovuto.',
          'Lealtà / Tradimento — il peso morale dell\'appartenenza al gruppo, la solidarietà e il dovere di non tradire la propria comunità.',
          'Autorità / Sovversione — rispetto per la gerarchia legittima, la tradizione e le istituzioni che coordinano la vita sociale.',
          'Sacralità / Degradazione — la sensazione che alcune cose siano sacre e che certi atti siano moralmente contaminanti indipendentemente dalle loro conseguenze.',
          'Libertà / Oppressione — resistenza al dominio e diritto all\'autodeterminazione, anche contro autorità che affermano di agire per il bene comune.',
        ],
      },
      {
        type: 'p',
        text: "Questi sei fondamenti non sono pesati allo stesso modo da tutti. La ricerca suggerisce che le persone che si identificano come politicamente liberal tendono a valorizzare principalmente Cura ed Equità — e sono spesso scettiche verso Lealtà, Autorità e Sacralità come preoccupazioni morali valide. Le persone che si identificano come conservatrici tendono a valorizzare tutti e sei in modo più equilibrato, trattando Lealtà, Autorità e Sacralità come genuini riferimenti morali, non semplici convenzioni sociali.",
      },
      {
        type: 'h2',
        text: 'Il problema del tram attraverso la lente dei fondamenti',
      },
      {
        type: 'p',
        text: "Torniamo al problema del tram. Chi pesa molto la Cura vede cinque vite da salvare e agisce. Chi pesa di più Sacralità e Lealtà può sentire che causare attivamente una morte — anche per salvarne di più — supera una linea che l'inazione passiva non attraversa. Nessuna delle due posizioni è irrazionale. Stanno ragionando da fondamenti diversi.",
      },
      {
        type: 'cta',
        label: 'Un tram è diretto verso cinque persone. Tiri la leva? →',
        href: '/it/play/trolley',
      },
      {
        type: 'h2',
        text: 'Equità e il problema della condanna ingiusta',
      },
      {
        type: 'p',
        text: "Il ragionamento guidato dall'Equità è particolarmente sensibile alla giustizia procedurale — non solo se i risultati sono buoni, ma se il processo che li produce è legittimo. Questa distinzione emerge chiaramente nei dilemmi legali: dovresti seguire le regole anche quando farlo produce un risultato che sai essere ingiusto? Chi pesa l'Autorità insieme all'Equità può dire sì — la legittimità del sistema dipende dall'applicazione coerente delle regole. Chi pesa solo l'Equità può dire no — il punto delle regole non era mai produrre ingiustizia.",
      },
      {
        type: 'cta',
        label: 'Sai che l\'imputato è innocente. Condanni per sostenere il sistema giudiziario? →',
        href: '/it/play/innocent-juror',
      },
      {
        type: 'h2',
        text: 'Lealtà e il tipo di onestà più difficile',
      },
      {
        type: 'p',
        text: "La Lealtà è il fondamento che rende il tradire un amico qualcosa di quasi fisicamente sbagliato — anche quando l'amico ha fatto qualcosa di oggettivamente dannoso. Non è irrazionalità. Riflette una genuina preoccupazione morale: le relazioni di fiducia sono fragili e preziose, e il tessuto sociale dipende dal fatto che le persone le mantengano. La tensione morale nasce quando la Lealtà entra in conflitto con la Cura (il partner del tuo amico viene ferito) o con l'Equità (la verità conta). Come risolvi quella tensione spesso rivela quale fondamento sta guidando lo script più profondo del tuo ragionamento morale.",
      },
      {
        type: 'cta',
        label: 'Il partner del tuo migliore amico lo tradisce. Digli la verità? →',
        href: '/it/play/truth-friend',
      },
      {
        type: 'h2',
        text: 'Libertà, Autorità e il dilemma della sorveglianza',
      },
      {
        type: 'p',
        text: "Il fondamento della Libertà crea una tensione particolare con l'Autorità: cosa deve ai suoi cittadini una città quando sicurezza e libertà si contraddicono? Chi pesa molto la Libertà vive la sorveglianza come una violazione diretta — un'imposizione di controllo che mina l'autonomia che lo stato esiste per proteggere. Chi pesa Autorità e Cura in modo più equilibrato può considerare il monitoraggio pervasivo un compromesso accettabile: un vincolo gestito in cambio di sicurezza reale. Nessuno dei due ha semplicemente torto. Stanno calibrando fondamenti diversi.",
      },
      {
        type: 'cta',
        label: 'La sorveglianza totale rende la tua città il 30% più sicura. Accetti il compromesso? →',
        href: '/it/play/surveillance-city',
      },
      {
        type: 'cta',
        label: 'Vaccini obbligatori per tutti: giustificati dalla Cura o violazione della Libertà? →',
        href: '/it/play/mandatory-vaccine',
      },
      {
        type: 'h2',
        text: 'Cosa dice la ricerca — e dove si complica',
      },
      {
        type: 'p',
        text: "La Teoria dei Fondamenti Morali ha generato ricerche sostanziali e anche critiche sostanziali. Alcuni critici sostengono che la teoria confonde i risultati descrittivi (le persone pesano questi fondamenti) con affermazioni normative (dovrebbero farlo). Altri notano che i sei fondamenti non sono culturalmente universali nel modo in cui le prime formulazioni implicavano — appaiono tra le società, ma i loro contenuti e la loro gerarchia variano considerevolmente. Il fondamento della Libertà è stato aggiunto ai cinque originali in parte in risposta ai critici che ritenevano che la teoria non catturasse adeguatamente le intuizioni morali libertarie.",
      },
      {
        type: 'p',
        text: "L'intuizione pratica che sopravvive ai dibattiti teorici è duratura: la maggior parte dei seri disaccordi morali non sono disaccordi sui fatti o nemmeno su quali risultati contino. Sono disaccordi su quali dimensioni morali siano rilevanti in primo luogo — e quale debba avere la priorità quando entrano in conflitto. Capire che il tuo avversario morale sta pesando un fondamento diverso, non ignorando i fondamenti che ti interessano, può cambiare come va una conversazione difficile.",
      },
      {
        type: 'h2',
        text: 'Il tuo profilo morale su SplitVote',
      },
      {
        type: 'p',
        text: "Ogni dilemma su SplitVote attiva implicitamente uno o più fondamenti morali. Gli scenari che coinvolgono danno e protezione attivano la Cura. I dilemmi sul seguire regole ingiuste attivano Equità e Autorità in tensione. Le domande su lealtà, segreti e tradimenti attivano la Lealtà. Gli scenari che coinvolgono sorveglianza, autonomia corporea o politica sulle droghe attivano Libertà e Sacralità. Votare su abbastanza dilemmi costruisce un quadro — non del tuo 'tipo morale', ma di quali considerazioni tratti costantemente come decisive quando entrano in conflitto.",
      },
      {
        type: 'cta',
        label: 'Scopri cosa rivelano i tuoi voti sulla tua personalità morale →',
        href: '/it/personality',
      },
      {
        type: 'cta',
        label: 'Etica della virtù: cosa farebbe una persona buona? →',
        href: '/it/blog/etica-della-virtu-cosa-farebbe-una-persona-buona',
      },
      {
        type: 'cta',
        label: 'Esplora tutti i dilemmi morali →',
        href: '/it/dilemmi-morali',
      },
      {
        type: 'disclaimer',
        text: "La Teoria dei Fondamenti Morali è un framework teorico della psicologia morale, non un test psicologico validato. I riferimenti al lavoro di Haidt e colleghi sono solo contestuali. I dilemmi di SplitVote sono per la riflessione e il confronto — non per una valutazione clinica. I risultati rappresentano i voti della nostra community, non conclusioni scientifiche sulla personalità individuale.",
      },
    ],
  },
  {
    slug: 'bioetica-quando-la-medicina-impone-scelte-impossibili',
    locale: 'it',
    title: 'Bioetica — Quando la Medicina Impone le Scelte più Difficili',
    seoTitle: 'Bioetica: Quando la Medicina Ci Mette di Fronte alle Scelte più Difficili',
    description:
      "Chi ottiene l'unico organo disponibile? È giusto porre fine a una vita per alleviare una sofferenza irrimediabile? La bioetica studia le domande morali che la medicina solleva e che nessun protocollo può risolvere del tutto.",
    seoDescription:
      "Bioetica: le domande morali più difficili della medicina — allocazione degli organi, eutanasia, autonomia corporea, risorse limitate. Vota sui dilemmi reali su SplitVote.",
    date: '2026-05-10',
    readingTime: 6,
    tags: ['bioetica', 'etica medica', 'eutanasia', 'autonomia corporea', 'filosofia'],
    relatedDilemmaIds: ['organ-harvest', 'mercy-kill', 'mandatory-vaccine', 'pandemic-dose', 'brain-upload'],
    alternateSlug: 'bioethics-when-medicine-forces-impossible-choices',
    content: [
      {
        type: 'p',
        text: "In una sala d'attesa ci sono cinque pazienti in attesa di trapianto. Moriranno senza un organo. In pronto soccorso arriva un paziente sano — un incidente. I suoi organi sono compatibili con tutti e cinque. Nessun consenso. Nessuna famiglia raggiungibile. Il chirurgo deve decidere. Questo scenario ipotetico — deliberatamente estremo — cattura qualcosa di reale sulla bioetica: le sue domande non sono teoriche. Emergono ogni giorno in ospedali, comitati etici e aule di tribunale.",
      },
      {
        type: 'p',
        text: "La bioetica è la branca della filosofia che studia le dimensioni morali delle decisioni in medicina e nelle scienze della vita. Le sue domande riguardano l'allocazione delle risorse scarse, i limiti dell'autonomia individuale, la definizione di morte e la giustizia nell'accesso alle cure.",
      },
      {
        type: 'h2',
        text: 'Quattro principi fondamentali',
      },
      {
        type: 'p',
        text: "Il framework più influente nella bioetica pratica — quello di Beauchamp e Childress — organizza il ragionamento attorno a quattro principi:",
      },
      {
        type: 'list',
        items: [
          "Autonomia — il diritto del paziente di prendere decisioni informate sulla propria cura, incluso il rifiuto del trattamento.",
          "Non maleficenza — non causare danno deliberato. Il principio classico primum non nocere.",
          "Beneficenza — agire nell'interesse del paziente, anche quando questo richiede interventi invasivi.",
          "Giustizia — distribuire benefici, rischi e risorse in modo equo tra i pazienti e nella società.",
        ],
      },
      {
        type: 'p',
        text: "I dilemmi bioetici emergono quando questi principi entrano in conflitto diretto. L'eutanasia volontaria oppone autonomia a non maleficenza. L'allocazione degli organi oppone beneficenza a giustizia. Il trattamento obbligatorio — come la vaccinazione — oppone salute pubblica ad autonomia individuale.",
      },
      {
        type: 'h2',
        text: "Chi ha diritto all'unico organo disponibile?",
      },
      {
        type: 'p',
        text: "L'allocazione degli organi è uno dei campi più studiati della bioetica perché i suoi compromessi sono brutalmente visibili: gli organi donati sono rari, i pazienti in lista d'attesa sono molti, e ogni criterio di selezione produce vincitori e perdenti. I criteri in uso combinano urgenza medica, compatibilità, tempo di attesa e, in alcuni sistemi, probabilità di successo. Ma ogni criterio incorpora valori impliciti — su chi conta di più, su cosa costituisce una vita salvata, su se la 'colpa' nella malattia debba avere peso.",
      },
      {
        type: 'cta',
        label: 'Scarifichi un paziente sano per salvarne cinque che hanno bisogno di trapianto? →',
        href: '/it/play/organ-harvest',
      },
      {
        type: 'h2',
        text: "Eutanasia: autonomia contro il dovere di non causare danno",
      },
      {
        type: 'p',
        text: "Il dibattito sull'eutanasia volontaria è uno dei più duraturi in bioetica. Gli argomenti basati sull'autonomia sostengono che le persone competenti hanno il diritto di controllare la propria morte quando affrontano una sofferenza irrimediabile. Gli argomenti basati sul benessere si concentrano sull'alleviare una sofferenza che nessun trattamento palliativo riesce a controllare. Gli argomenti del piano inclinato avvertono che legalizzare l'eutanasia espone le popolazioni vulnerabili a pressioni sottili — percepire di essere un peso, scegliere la morte per convenienza degli altri.",
      },
      {
        type: 'p',
        text: "Nessuno di questi argomenti si risolve facilmente. La controversia persiste non perché i partecipanti siano irrazionali, ma perché pesano principi diversi — autonomia contro non maleficenza, compassione individuale contro rischio sistemico.",
      },
      {
        type: 'cta',
        label: 'Un paziente terminale ti chiede di porre fine alla sua sofferenza. Lo aiuti? →',
        href: '/it/play/mercy-kill',
      },
      {
        type: 'h2',
        text: 'Autonomia corporea e salute pubblica',
      },
      {
        type: 'p',
        text: "Il principio di autonomia — il diritto di prendere decisioni informate sul proprio corpo — è considerato quasi sacro nella bioetica contemporanea. Ma le decisioni mediche raramente riguardano solo l'individuo. La vaccinazione protegge le persone che non possono vaccinarsi. La resistenza agli antibiotici è modellata da decisioni individuali di prescrizione. Il donare sangue, organi o plasma influenza la disponibilità per gli altri. La bioetica deve affrontare continuamente la tensione tra il corpo come proprietà privata e il corpo come nodo in una rete di interdipendenza.",
      },
      {
        type: 'cta',
        label: 'Vaccinazione obbligatoria per tutti: giustificata dalla salute pubblica o violazione dell\'autonomia? →',
        href: '/it/play/mandatory-vaccine',
      },
      {
        type: 'h2',
        text: 'Risorse scarse, decisioni impossibili',
      },
      {
        type: 'p',
        text: "La pandemia ha reso visibili i protocolli di triage che i sistemi sanitari normalmente nascondono: chi riceve l'ultimo ventilatore quando non ce ne sono abbastanza? Chi viene trattato per primo quando il pronto soccorso è al collasso? Le linee guida variano — per età, prognosi, ordine di arrivo — ma tutte devono rispondere alla stessa domanda fondamentale: come rendere equa una situazione intrinsecamente ingiusta?",
      },
      {
        type: 'cta',
        label: 'Un\'unica dose di vaccino sperimentale. La dai al paziente più malato o al più giovane? →',
        href: '/it/play/pandemic-dose',
      },
      {
        type: 'h2',
        text: "La bioetica nell'era dell'identità digitale",
      },
      {
        type: 'p',
        text: "Le tecnologie emergenti spingono la bioetica in territori nuovi. Se coscienza e memoria potessero essere caricate su un supporto digitale, la persona che sopravvive è la stessa? Quali diritti avrebbe? Potrebbe essere terminata, copiata, venduta? Questi scenari sembrano fantascienza, ma anticipano domande che la bioetica dovrà affrontare man mano che le tecnologie di interfaccia cervello-computer avanzano — e testano quali dei nostri concetti morali attuali dipendono da presupposti biologici che potrebbero non reggere.",
      },
      {
        type: 'cta',
        label: 'Il tuo io digitale caricato su un server è ancora te? →',
        href: '/it/play/brain-upload',
      },
      {
        type: 'h2',
        text: 'Perché la bioetica non ha risposte semplici',
      },
      {
        type: 'p',
        text: "La bioetica è difficile non per mancanza di dati o competenza, ma perché i suoi dilemmi richiedono di scegliere tra valori genuinamente in competizione. Un sistema sanitario che privilegia sempre l'autonomia individuale non potrà garantire la salute pubblica. Uno che privilegia sempre il benessere aggregato rischierà di violare diritti individuali. La tensione non si risolve — si negozia, caso per caso, con trasparenza sui valori in gioco.",
      },
      {
        type: 'cta',
        label: 'Scopri come ragioni nei dilemmi etici più difficili →',
        href: '/it/personality',
      },
      {
        type: 'cta',
        label: 'Consequenzialismo: il fine giustifica i mezzi? →',
        href: '/it/blog/consequenzialismo-il-bene-maggiore',
      },
      {
        type: 'cta',
        label: 'Esplora tutti i dilemmi morali →',
        href: '/it/dilemmi-morali',
      },
      {
        type: 'disclaimer',
        text: "SplitVote presenta dilemmi etici per la riflessione e il confronto. I riferimenti alla bioetica e alla letteratura filosofica sono contestuali — l'obiettivo è aiutarti a riflettere, non fornire consulenza medica o legale. I risultati rappresentano i voti della nostra community, non conclusioni scientifiche. Se stai affrontando decisioni mediche reali, consulta un professionista sanitario.",
      },
    ],
  },
  {
    slug: 'psicologia-morale-sperimentale-come-la-scienza-studia-le-intuizioni-morali',
    locale: 'it',
    title: 'Psicologia Morale Sperimentale — Come la Scienza Studia Perché Non Siamo d\'Accordo',
    seoTitle: 'Psicologia Morale Sperimentale: Cosa Rivela la Scienza sulle Intuizioni Morali',
    description:
      "La psicologia morale sperimentale usa metodi empirici per studiare come le persone ragionano sul bene e sul male — e i risultati sono spesso sorprendenti. Siamo meno razionali, più emotivi e più incoerenti di quanto crediamo.",
    seoDescription:
      "La psicologia morale sperimentale studia come le persone ragionano sull'etica — rivelando il pensiero duale, il moral dumbfounding e i pattern cross-culturali. Esplora la scienza su SplitVote.",
    date: '2026-05-10',
    readingTime: 6,
    tags: ['psicologia morale', 'filosofia sperimentale', 'intuizioni morali', 'Joshua Greene', 'problema del tram'],
    relatedDilemmaIds: ['trolley', 'self-driving-crash', 'robot-judge', 'organ-harvest', 'innocent-juror'],
    alternateSlug: 'experimental-moral-psychology-how-science-studies-moral-intuitions',
    content: [
      {
        type: 'p',
        text: "Chiedi a qualcuno se è accettabile spingere un uomo grande giù da una passerella per fermare un tram in corsa e salvare cinque vite. La maggior parte dice no — immediatamente, visceralmente. Chiedi loro se tirare una leva che devia il tram su un binario dove morirà una persona è accettabile. La maggior parte dice sì. L'aritmetica è identica. La reazione morale non lo è. Questa asimmetria — replicata su migliaia di partecipanti in decine di paesi — è una delle osservazioni fondanti della psicologia morale sperimentale.",
      },
      {
        type: 'p',
        text: "La psicologia morale sperimentale applica i metodi della scienza cognitiva e della psicologia empirica a domande che la filosofia ha tradizionalmente studiato dalla poltrona. Invece di ragionare su cosa le persone dovrebbero pensare, i ricercatori misurano cosa pensano effettivamente — e il quadro che emerge è più complicato di quanto le teorie filosofiche standard prevedano.",
      },
      {
        type: 'h2',
        text: 'Due sistemi, un dilemma',
      },
      {
        type: 'p',
        text: "Lo psicologo Joshua Greene ha proposto che l'asimmetria della passerella rifletta due sistemi cognitivi in competizione. Il Sistema 1 — veloce, automatico, emotivo — fa scattare un allarme quando immagini di spingere fisicamente qualcuno verso la morte. Il Sistema 2 — più lento, deliberativo, consequenzialista — calcola che una morte è meglio di cinque e approva l'intervento. Nel caso della leva, l'allarme emotivo è più silenzioso: l'azione è indiretta, impersonale, meccanica. Il Sistema 2 ha più spazio per eseguire il suo calcolo.",
      },
      {
        type: 'p',
        text: "Questo schema a doppio processo è stato influente e controverso. I critici sostengono che semplifichi eccessivamente — che le risposte emotive possano esse stesse tracciare caratteristiche moralmente rilevanti di una situazione, non semplicemente innescare un bias irrazionale. Il dibattito non si è risolto, ma si è affinato: la domanda non è più se le emozioni influenzino il giudizio morale, ma se lo facciano in modo affidabile e in quale direzione.",
      },
      {
        type: 'cta',
        label: 'Tira la leva e devia il tram — una morte per salvarne cinque? →',
        href: '/it/play/trolley',
      },
      {
        type: 'h2',
        text: 'Il moral dumbfounding',
      },
      {
        type: 'p',
        text: "Lo psicologo Jonathan Haidt ha studiato un fenomeno diverso: il moral dumbfounding (lo stupore morale). Ai partecipanti veniva raccontata una storia di un fratello e una sorella che hanno un rapporto sessuale consensuale una volta, lo trovano piacevole e decidono di non ripeterlo — nessuno viene ferito, l'atto resta privato. Quando viene chiesto se fosse sbagliato, la maggior parte dei partecipanti diceva sì, immediatamente. Quando veniva chiesto perché, faticavano. Ogni ragione che offrivano — rischio di danno genetico, danno psicologico — era pre-emessa dai dettagli della storia. Eppure mantenevano il loro verdetto, citando spesso un forte senso che fosse semplicemente sbagliato.",
      },
      {
        type: 'p',
        text: "Haidt ha concluso che i giudizi morali vengono spesso emessi prima dall'intuizione e razionalizzati dopo — che costruiamo ragioni per spiegare verdetti già raggiunti. Questo 'modello intuizionista sociale' contrasta nettamente con il quadro illuminista del ragionatore morale che soppesa attentamente i principi prima di concludere.",
      },
      {
        type: 'cta',
        label: "Un'auto a guida autonoma deve scegliere chi salvare. Come la programmi? →",
        href: '/it/play/self-driving-crash',
      },
      {
        type: 'h2',
        text: 'Cosa varia tra le culture — e cosa no',
      },
      {
        type: 'p',
        text: "Gli studi cross-culturali hanno complicato le semplici affermazioni sulle intuizioni morali universali. Alcuni risultati viaggiano in modo affidabile: la preferenza per salvare più vite rispetto a meno, la distinzione tra danno causato direttamente e danno causato indirettamente. Altri no: le intuizioni su autorità, purezza e lealtà verso il gruppo interno mostrano variazioni considerevolmente maggiori. La ricerca sui Fondamenti Morali suggerisce che questa variazione non è rumore ma struttura — diverse società enfatizzano fondamenti diversi, producendo sistemi morali coerenti ma distinti piuttosto che accordo razionale su regole universali.",
      },
      {
        type: 'cta',
        label: 'Un giudice IA dovrebbe decidere i casi penali meglio di un tribunale umano? →',
        href: '/it/play/robot-judge',
      },
      {
        type: 'h2',
        text: 'Cosa succede quando le posta si alza',
      },
      {
        type: 'p',
        text: "Un risultato coerente è che il framing di un dilemma morale ne cambia il verdetto. Descrivere la stessa azione usando un linguaggio passivo rispetto ad attivo, o vittime personali rispetto a statistiche, può ribaltare le risposte maggioritarie. Questo è preoccupante per chi crede che i giudizi morali tracchino caratteristiche oggettive delle situazioni — se il frame cambia il verdetto, cosa viene tracciato esattamente?",
      },
      {
        type: 'p',
        text: "I ricercatori hanno proposto diverse spiegazioni: gli effetti del framing rivelano bias cognitivi che corrompono il ragionamento morale; gli effetti del framing rivelano che i diversi frame descrivono situazioni genuinamente diverse (il danno attivo è davvero diverso dall'omissione passiva); o gli effetti del framing rivelano che il giudizio morale è sensibile al contesto in modi che le nostre teorie non hanno saputo catturare.",
      },
      {
        type: 'cta',
        label: 'Prelevi gli organi di un paziente sano per salvarne cinque che ne hanno bisogno? →',
        href: '/it/play/organ-harvest',
      },
      {
        type: 'h2',
        text: 'Cosa aggiungono i dati di SplitVote',
      },
      {
        type: 'p',
        text: "Ogni voto su SplitVote è, in miniatura, un punto dati in questa tradizione di ricerca. La piattaforma non pretende di essere uno strumento scientifico — il campione non è casuale, la partecipazione è volontaria e il framing di ogni dilemma è fisso. Ma a scala sufficiente, i pattern coerenti attraverso migliaia di voti su scenari identici creano un segnale degno di esame: quali dilemmi dividono le persone nel modo più equo? Quali producono valanghe? Gli stessi scenari che hanno diviso i partecipanti in laboratorio nei studi pubblicati dividono gli utenti di SplitVote in proporzioni simili?",
      },
      {
        type: 'cta',
        label: "Sai che l'imputato è innocente. Voti per condannarlo per sostenere lo stato di diritto? →",
        href: '/it/play/innocent-juror',
      },
      {
        type: 'h2',
        text: 'I limiti della scienza',
      },
      {
        type: 'p',
        text: "La psicologia morale sperimentale è un campo giovane e i suoi risultati non sono sempre stabili. Diversi risultati di alto profilo non sono stati replicati. Le popolazioni studiate hanno storicamente privilegiato fortemente le società occidentali, istruite, industrializzate, ricche e democratiche (WEIRD) — un limite che il campo ha lavorato sempre più ad affrontare. Il doppio processo come spiegazione della cognizione morale rimane contestato a livello teorico anche mentre i suoi singoli risultati empirici si accumulano.",
      },
      {
        type: 'p',
        text: "Il contributo più durevole del campo potrebbe essere metodologico: ha dimostrato che i dati della filosofia morale — cosa credono le persone e perché — possono essere studiati empiricamente, e che i risultati spesso sorprendono le nostre teorie precedenti. Qualunque sia il corretto resoconto del ragionamento morale, dovrà spiegare l'asimmetria del tram, l'effetto del moral dumbfounding e i pattern cross-culturali che questa ricerca ha documentato.",
      },
      {
        type: 'cta',
        label: 'Scopri cosa rivelano i tuoi voti sul tuo ragionamento morale →',
        href: '/it/personality',
      },
      {
        type: 'cta',
        label: 'La Teoria dei Fondamenti Morali — perché le persone oneste non sono d\'accordo →',
        href: '/it/blog/teoria-fondamenti-morali',
      },
      {
        type: 'cta',
        label: 'Esplora tutti i dilemmi morali →',
        href: '/it/dilemmi-morali',
      },
      {
        type: 'disclaimer',
        text: "I riferimenti a Greene, Haidt e alla ricerca di filosofia morale sperimentale sono solo contestuali. SplitVote è una piattaforma di intrattenimento e riflessione, non uno studio scientifico. I risultati rappresentano voti della community — non dati peer-reviewed, e non conclusioni sul carattere morale individuale. La teoria del doppio processo descritta qui è contestata nell'ambito della scienza cognitiva e della filosofia morale.",
      },
    ],
  },
  {
    slug: 'perche-non-siamo-daccordo-sull-etica',
    locale: 'it',
    title: "Perché Non Siamo d'Accordo sull'Etica: La Scienza del Disaccordo Morale",
    seoTitle: "Perché le Persone Oneste Dissentono in Etica — La Psicologia Morale Spiega",
    description:
      "Persone intelligenti e premuranti raggiungono conclusioni opposte sullo stesso dilemma morale. La ricerca in psicologia morale e la Teoria dei Fondamenti Morali rivelano perché.",
    seoDescription:
      "Le persone oneste non sono d'accordo in etica per via dell'evoluzione cognitiva, dei fondamenti morali culturali e delle emozioni che precedono la ragione. La scienza spiega il divario.",
    date: '2026-05-10',
    readingTime: 7,
    tags: ['etica', 'psicologia morale', 'teoria dei fondamenti morali', 'disaccordo morale', 'problema del tram'],
    relatedDilemmaIds: ['trolley', 'self-driving-crash', 'robot-judge', 'organ-harvest', 'innocent-juror'],
    alternateSlug: 'why-we-disagree-on-ethics',
    content: [
      {
        type: 'p',
        text: "Due persone riflessive e in buona fede guardano lo stesso problema del tram e arrivano a conclusioni opposte. Una dice di tirare la leva — salva cinque vite. L'altra dice di tenere le mani pulite — non si può usare qualcuno come mezzo per un fine. Entrambe hanno ragioni. Entrambe sono certe. Nessuna è ovviamente confusa o crudele. Cosa sta accadendo, esattamente?",
      },
      {
        type: 'p',
        text: "La ricerca in psicologia morale degli ultimi tre decenni ha assemblato una risposta parziale — ed è più inquietante di 'una persona ha valori migliori'. Il disaccordo morale sembra essere incorporato nell'architettura del ragionamento umano, plasmato dall'evoluzione, dalla cultura e dai sistemi cognitivi concorrenti che usiamo per valutare il bene e il male.",
      },
      {
        type: 'h2',
        text: 'I fondamenti morali non sono tutti uguali',
      },
      {
        type: 'p',
        text: "Lo psicologo Jonathan Haidt e i suoi colleghi hanno proposto la Teoria dei Fondamenti Morali come spiegazione del perché il disaccordo morale sia così profondo. La teoria identifica diverse preoccupazioni intuitive morali distinte su cui si basano tutte le società umane — tra cui cura, equità, lealtà, autorità e purezza — ma in proporzioni diverse. I liberali tendono a pesare fortemente cura ed equità. I conservatori tendono a pesare lealtà, autorità e purezza insieme a cura ed equità.",
      },
      {
        type: 'p',
        text: "Questo non significa che un gruppo abbia ragione e l'altro torto. Significa che lo stesso dilemma attiva moduli morali diversi in persone diverse. Quando qualcuno dice 'Non posso tradire il mio gruppo, anche per prevenire un danno maggiore', non sta ragionando in modo irrazionale — sta operando con un diverso sistema operativo morale, uno che assegna un peso elevato al fondamento della lealtà. Quando qualcun altro dice 'i numeri sono i numeri — cinque vite pesano più di una', sta eseguendo un calcolo dominato dalla cura e dall'equità.",
      },
      {
        type: 'cta',
        label: 'Tira la leva — è giusto sacrificare uno per salvarne cinque? →',
        href: '/it/play/trolley',
      },
      {
        type: 'h2',
        text: 'Due sistemi cognitivi, un dilemma',
      },
      {
        type: 'p',
        text: "Un filone di ricerca separato, associato principalmente allo psicologo Joshua Greene ad Harvard, si concentra non sul contenuto dei fondamenti morali ma sul processo del ragionamento morale. Il modello a doppio processo di Greene propone che i giudizi morali siano prodotti da due sistemi concorrenti: un Sistema 1 veloce, automatico, guidato emotivamente, e un Sistema 2 più lento, deliberativo, più consequenzialista.",
      },
      {
        type: 'p',
        text: "Gli esperimenti classici sul tram illustrano la tensione. La maggior parte delle persone è disposta a tirare una leva che reindirizza il tram, uccidendo uno per salvarne cinque. Molte meno sono disposte a spingere un uomo grande giù da una passerella per ottenere lo stesso risultato aritmetico. La matematica è identica. La prossimità fisica no — e il Sistema 1, che si è evoluto per rispondere con forza al danno fisico diretto, si attiva molto più intensamente nella versione della passerella. Se quel segnale emotivo stia tracciando una distinzione morale genuina (il danno diretto è davvero diverso da quello indiretto) o producendo un bias (i numeri dovrebbero essere ciò che conta) è ancora dibattuto.",
      },
      {
        type: 'cta',
        label: "Come dovrebbe decidere un'auto autonoma chi salva in un incidente? →",
        href: '/it/play/self-driving-crash',
      },
      {
        type: 'h2',
        text: 'Pattern cross-culturali — e dove si rompono',
      },
      {
        type: 'p',
        text: "Uno studio pubblicato su Nature nel 2018 — l'esperimento Moral Machine — ha raccolto oltre 40 milioni di decisioni morali da persone di 233 paesi, chiedendo loro come le auto a guida autonoma dovrebbero privilegiare le vite in scenari di incidente inevitabili. Alcuni pattern erano notevolmente stabili tra le culture: una preferenza per salvare più vite rispetto a meno, una preferenza per risparmiare i bambini rispetto agli anziani. Altri variavano notevolmente: le preferenze per risparmiare individui di status più elevato, per dare priorità ai pedoni rispetto ai passeggeri e per sterzare rispetto a restare dritti differivano sostanzialmente per regione.",
      },
      {
        type: 'p',
        text: "La variazione cross-culturale suggerisce che i fondamenti morali non siano un universale umano fisso. La cultura plasma quali preoccupazioni vengono ponderate fortemente, quali scenari attivano l'allarme morale e quali compromessi sembrano accettabili. La stessa azione che sembra un'ovvia violazione in una comunità morale può sembrare la risposta ovviamente giusta in un'altra.",
      },
      {
        type: 'cta',
        label: 'Un giudice IA dovrebbe decidere i casi penali meglio dei tribunali umani? →',
        href: '/it/play/robot-judge',
      },
      {
        type: 'h2',
        text: 'Il problema del moral dumbfounding',
      },
      {
        type: 'p',
        text: "La ricerca di Haidt sul 'moral dumbfounding' (lo stupore morale) aggiunge un ulteriore livello. Quando si presentano scenari che innescano forti intuizioni morali ma dove ogni giustificazione basata sul danno è stata pre-emessa dalla configurazione della storia, molte persone continuano a sostenere che qualcosa è sbagliato — anche quando non riescono a dire quale sia il danno. Sanno che sembra sbagliato prima di sapere perché.",
      },
      {
        type: 'p',
        text: "Ciò suggerisce che il ragionamento morale sia spesso una razionalizzazione post-hoc piuttosto che la causa dei verdetti morali. Raggiungiamo prima le conclusioni, tramite l'intuizione, e poi costruiamo argomenti per giustificarle. Se è così, il disaccordo morale può persistere anche dopo una discussione razionale estesa — perché l'argomento non era mai stato davvero ciò che guidava il verdetto.",
      },
      {
        type: 'cta',
        label: "Prelevi gli organi di un paziente sano per salvarne cinque in lista d'attesa? →",
        href: '/it/play/organ-harvest',
      },
      {
        type: 'h2',
        text: 'Cosa mostrano i dati di SplitVote',
      },
      {
        type: 'p',
        text: "Su SplitVote, gli stessi dilemmi che hanno diviso i partecipanti in laboratorio dividono i votanti del mondo reale in proporzioni notevolmente simili. Gli scenari in stile tram che contrappongono il benessere aggregato ai diritti individuali tendono a produrre divisioni quasi paritarie. Gli scenari che attivano un forte allarme emotivo — prossimità fisica, vittime identificabili, violazioni dell'autonomia corporea — tendono a produrre un consenso più forte, spesso contro l'esito aritmeticamente 'efficiente'.",
      },
      {
        type: 'p',
        text: "SplitVote non è uno strumento scientifico — il campione è auto-selezionato, il framing è fisso e i voti individuali non hanno controlli sperimentali. Ma su scala, i pattern sono suggestivi: il disaccordo morale non è rumore casuale. Si raggruppa attorno alle linee di faglia che la psicologia morale ha identificato — attivazione del Sistema 1 vs. Sistema 2, fondamenti di lealtà vs. prevenzione del danno, variazione culturale nelle preoccupazioni di autorità e purezza.",
      },
      {
        type: 'cta',
        label: "Sai che l'imputato è innocente — voti comunque per condannarlo? →",
        href: '/it/play/innocent-juror',
      },
      {
        type: 'h2',
        text: 'Il disaccordo morale è risolvibile?',
      },
      {
        type: 'p',
        text: "La psicologia morale non risolve la questione filosofica se esistano verità morali oggettive che il disaccordo non riesce a raggiungere. Ma riformula la domanda. Se due persone non sono d'accordo su un dilemma morale, potrebbe non essere perché una ha ragionato più a lungo dell'altra. Potrebbe essere perché stanno attivando sistemi emotivi diversi, pesando fondamenti diversi o applicando framework plasmati da storie culturali diverse.",
      },
      {
        type: 'p',
        text: "Questo non è un invito al relativismo. Alcune posizioni morali sono ancora meglio ragionate di altre, più coerenti, più attente all'evidenza. Ma è una ragione per l'umiltà epistemica: la certezza che sembra chiarezza potrebbe essere un allarme del Sistema 1 a risposta rapida, non una conclusione attentamente derivata. Il progresso morale — quando avviene — di solito richiede di rallentare abbastanza da esaminare le intuizioni piuttosto che semplicemente fidarsi di esse.",
      },
      {
        type: 'cta',
        label: 'Scopri la tua personalità morale in base a come voti →',
        href: '/it/personality',
      },
      {
        type: 'cta',
        label: 'Psicologia morale sperimentale — come la scienza studia le intuizioni morali →',
        href: '/it/blog/psicologia-morale-sperimentale-come-la-scienza-studia-le-intuizioni-morali',
      },
      {
        type: 'cta',
        label: "Teoria dei Fondamenti Morali — perché le persone oneste non sono d'accordo →",
        href: '/it/blog/teoria-fondamenti-morali',
      },
      {
        type: 'disclaimer',
        text: "I riferimenti alla Teoria dei Fondamenti Morali, alla cognizione morale a doppio processo e allo studio del Moral Machine sono a scopo contestuale ed educativo. SplitVote è una piattaforma di intrattenimento e riflessione, non uno studio scientifico. I risultati rappresentano voti della community — non dati peer-reviewed e non conclusioni sul carattere morale individuale. Le teorie descritte qui sono contestate nella filosofia morale e nelle scienze cognitive.",
      },
    ],
  },
  {
    slug: 'perche-le-persone-buone-non-fanno-nulla',
    locale: 'it',
    title: "Perché le Persone Buone Non Fanno Nulla: La Psicologia dell'Inazione Morale",
    seoTitle: "Perché le Persone Buone Non Fanno Nulla — L'Effetto Spettatore Spiegato",
    description:
      "Essere capaci di aiutare non è la stessa cosa di aiutare. La ricerca sull'effetto spettatore, la diffusione della responsabilità e il disimpegno morale spiega perché le persone per bene passano oltre.",
    seoDescription:
      "Le persone per bene spesso non agiscono nelle emergenze morali. L'effetto spettatore, la diffusione della responsabilità e l'ignoranza pluralistica spiegano perché — e cosa può cambiarlo.",
    date: '2026-05-10',
    readingTime: 7,
    tags: ['psicologia morale', 'effetto spettatore', 'inazione morale', 'diffusione della responsabilità', 'etica'],
    relatedDilemmaIds: ['innocent-juror', 'cure-secret', 'organ-harvest', 'trolley', 'self-driving-crash'],
    alternateSlug: 'why-good-people-do-nothing',
    content: [
      {
        type: 'p',
        text: "Nel 1964, una giovane donna fu aggredita fuori dal suo condominio a New York. L'episodio divenne uno dei casi più citati nella storia della psicologia sociale — non tanto per quello che accadde, ma per l'articolo di giornale che seguì: che 38 testimoni avevano osservato dalle finestre senza fare nulla. Il numero e la storia furono in seguito dimostrati largamente inventati dalla stampa. Ma la domanda che il caso sollevò era reale: perché i gruppi di persone a volte non agiscono quando qualcuno ha bisogno di aiuto in modo evidente?",
      },
      {
        type: 'p',
        text: "Due psicologi, John Darley e Bibb Latané, decisero di scoprirlo. Gli esperimenti che progettarono nel decennio successivo produssero risultati ancora oggi profondamente scomodi: la presenza di altre persone non ci rende più propensi ad aiutare. In molte circostanze, ci rende significativamente meno propensi ad aiutare. Lo chiamarono effetto spettatore.",
      },
      {
        type: 'h2',
        text: "L'esperimento che ha cambiato il nostro modo di pensare all'azione morale",
      },
      {
        type: 'p',
        text: "Nello studio più famoso di Darley e Latané, i partecipanti sedevano da soli o in gruppo mentre credevano che un altro partecipante stesse avendo una crisi epilettica — comunicata via interfono. Quando i partecipanti erano soli, l'85 percento cercava aiuto entro sei minuti. Quando credevano che altre quattro persone stessero ascoltando, quel numero scendeva al 31 percento. L'emergenza era identica. L'unica variabile era il numero di osservatori.",
      },
      {
        type: 'p',
        text: "Quello che accadeva non era insensibilità. La maggior parte dei partecipanti che non agivano erano visibilmente in difficoltà — si agitavano, sembravano ansiosi, genuinamente turbati. Non erano indifferenti a ciò che sentivano. Erano intrappolati in una trappola sociale e cognitiva che paralizzava la loro risposta.",
      },
      {
        type: 'h2',
        text: 'Diffusione della responsabilità',
      },
      {
        type: 'p',
        text: "La prima trappola è la diffusione della responsabilità. Quando molte persone assistono a un'emergenza, ogni individuo si sente personalmente meno responsabile di risolverla. Se sei l'unico a vedere qualcuno collassare, il peso morale ricade interamente su di te. Se venti persone lo vedono, la tua quota di responsabilità sembra un ventesimo — anche se la persona ha bisogno di aiuto con la stessa urgenza. Il gruppo non mette in comune la sua capacità; la diluisce.",
      },
      {
        type: 'p',
        text: "Questo non è un difetto di carattere esclusivo dei codardi. È una caratteristica del modo in cui gli esseri umani elaborano le situazioni morali condivise. Ci siamo evoluti in piccoli gruppi dove la responsabilità era naturalmente chiara. Non abbiamo sviluppato buone intuizioni per scenari con molti osservatori. La stessa persona che agirebbe in modo deciso da sola può bloccarsi completamente quando è circondata da altri che guardano.",
      },
      {
        type: 'cta',
        label: "Sai che l'imputato è innocente — voti comunque per condannarlo? →",
        href: '/it/play/innocent-juror',
      },
      {
        type: 'h2',
        text: "Ignoranza pluralistica",
      },
      {
        type: 'p',
        text: "La seconda trappola è l'ignoranza pluralistica — un fenomeno in cui ogni individuo in un gruppo dubita privatamente della norma prevalente, ma assume che tutti gli altri la condividano. Ogni persona guarda agli altri per segnali su come interpretare una situazione ambigua. Se nessuno agisce, tutti assumono che ci debba essere un motivo — forse non è davvero un'emergenza, forse l'aiuto è già in arrivo, forse la risposta giusta è aspettare.",
      },
      {
        type: 'p',
        text: "Il silenzio della folla viene letto come prova che il silenzio sia appropriato. Tutti sopprimono la loro preoccupazione individuale e rispecchiano l'inazione intorno a loro — mentre privatamente si sentono a disagio. Il risultato è un gruppo che produce collettivamente una risposta (nessuna) che nessun individuo approva davvero.",
      },
      {
        type: 'cta',
        label: 'Uno scienziato ha la cura per una malattia mortale — ma la tiene segreta. È sbagliato? →',
        href: '/it/play/cure-secret',
      },
      {
        type: 'h2',
        text: "Disimpegno morale — come silenzieamo l'allarme",
      },
      {
        type: 'p',
        text: "Lo psicologo Albert Bandura ha identificato un meccanismo diverso ma correlato: il disimpegno morale. Invece di essere bloccate dall'azione, le persone costruiscono attivamente ragioni per cui non sono obbligate ad agire. Bandura ha identificato diversi meccanismi attraverso cui questo avviene: giustificazione morale (convincersi che l'azione causerebbe danni maggiori), etichettatura eufemistica (chiamare l'inazione 'non interferire' invece di 'abbandonare qualcuno in difficoltà'), diffusione dell'agentività nel gruppo e disumanizzazione della vittima.",
      },
      {
        type: 'p',
        text: "Non sono strategie consapevoli di autoinganno. Operano rapidamente e automaticamente. Quando ti sei convinto di non dover intervenire, potresti genuinamente credere che l'intervento fosse inutile o dannoso. L'allarme era reale; il ragionamento di disimpegno è venuto dopo, costruendo una giustificazione per un'inazione che era già attraente per altri motivi.",
      },
      {
        type: 'cta',
        label: "Prelevi gli organi di un paziente sano per salvarne cinque in lista d'attesa? →",
        href: '/it/play/organ-harvest',
      },
      {
        type: 'h2',
        text: 'Il problema dello spettatore capace',
      },
      {
        type: 'p',
        text: "Esiste una tradizione filosofica secondo cui siamo più colpevoli per i danni che causiamo rispetto a quelli che permettiamo semplicemente. La distinzione tra commissione e omissione è incorporata in molti sistemi legali e nelle intuizioni morali di molte persone. Ma la ricerca sugli spettatori complica questo quadro in modo importante: essere capaci di prevenire un danno e scegliere di non farlo — pur essendo consapevoli del danno e della capacità — inizia ad assomigliare molto più a una scelta morale che a un default passivo.",
      },
      {
        type: 'p',
        text: "Uno spettatore che guarda qualcuno annegare mentre tiene un salvagente non ha semplicemente omesso di aiutare. Ha preso una serie di decisioni in tempo reale: non lanciare il salvagente, non chiamare aiuto, non urlare. L'inazione, in circostanze dove l'azione era disponibile e ovvia, è essa stessa un atto. La domanda è se le nostre intuizioni morali siano ben calibrate per trattarla in questo modo.",
      },
      {
        type: 'cta',
        label: 'Tira la leva — è giusto sacrificare uno per salvarne cinque? →',
        href: '/it/play/trolley',
      },
      {
        type: 'h2',
        text: "Cosa mostrano i dati di SplitVote sull'inazione",
      },
      {
        type: 'p',
        text: "Su SplitVote, i dilemmi che implicano un'azione chiara — tirare una leva, fare un intervento, ignorare un sistema — tendono a produrre divisioni più equilibrate rispetto ai loro equivalenti di omissione. Gli scenari in cui la domanda è se fare qualcosa di attivo per causare un danno producono costantemente più resistenza rispetto agli scenari in cui lo stesso danno deriva dalla scelta di non agire. L'asimmetria commissione-omissione che i filosofi dibattono da decenni appare chiaramente nel modo in cui le persone reali votano.",
      },
      {
        type: 'p',
        text: "Ciò che è meno chiaro dai dati di voto è se le persone siano consapevoli di questa asimmetria nel proprio ragionamento. Molti votanti che rifiuterebbero di causare attivamente un danno rifiuterebbero anche di prevenire un danno equivalente — e spesso sentono le due posizioni completamente coerenti. Il disagio morale si manifesta diversamente a seconda della direzione in cui l'azione è orientata.",
      },
      {
        type: 'cta',
        label: "Come dovrebbe decidere un'auto autonoma chi salva in un incidente? →",
        href: '/it/play/self-driving-crash',
      },
      {
        type: 'h2',
        text: 'Cosa cambia davvero il comportamento degli spettatori',
      },
      {
        type: 'p',
        text: "Darley e Latané hanno studiato anche gli interventi che riducono l'effetto spettatore. Il più affidabile è la specificità: essere indirizzati direttamente per nome, o essere chiaramente designati come la persona responsabile, aumenta notevolmente la probabilità di azione. 'Qualcuno chiami un'ambulanza' produce meno risposta di 'Tu, con la giacca blu — chiama subito un'ambulanza'. La responsabilità che è diffusa rimane diffusa; la responsabilità resa esplicita colpisce diversamente.",
      },
      {
        type: 'p',
        text: "Un secondo intervento è la consapevolezza preventiva dell'effetto stesso. Le persone che sono state informate sull'effetto spettatore e sulla diffusione della responsabilità prima di entrare in uno scenario hanno significativamente più probabilità di agire contro il segnale della folla. Questo è uno dei rari casi in psicologia sociale in cui conoscere il bias sembra ridurlo genuinamente — il che è una delle ragioni per cui la ricerca continua a valere la pena di discuterne.",
      },
      {
        type: 'cta',
        label: 'Scopri la tua personalità morale in base a come voti →',
        href: '/it/personality',
      },
      {
        type: 'cta',
        label: "Perché le persone oneste non sono d'accordo in etica →",
        href: '/it/blog/perche-non-siamo-daccordo-sull-etica',
      },
      {
        type: 'cta',
        label: 'Causare vs. permettere danno — c\'è una differenza morale? →',
        href: '/it/blog/causare-vs-permettere-danno',
      },
      {
        type: 'disclaimer',
        text: "I riferimenti alla ricerca sull'effetto spettatore, diffusione della responsabilità, ignoranza pluralistica e disimpegno morale sono a scopo contestuale ed educativo. La ricerca originale descritta è attribuita a Darley, Latané e Bandura. Il caso citato riflette i resoconti storici rivisti che hanno messo in discussione i primi articoli di stampa. SplitVote è una piattaforma di intrattenimento e riflessione, non uno studio scientifico. I dati di voto descritti rappresentano pattern della community, non risultati sperimentali controllati.",
      },
    ],
  },
  {
    slug: 'problema-tram-personalita-morale',
    locale: 'it',
    title: 'Cosa rivela la tua risposta al problema del tram sulla tua personalità morale',
    seoTitle: 'Problema del Tram e Personalità Morale: Cosa Rivela la Tua Risposta',
    description:
      'La maggior parte delle persone tira la leva — ma quasi la metà no. Il motivo rivela qualcosa di profondo su come funziona il tuo cervello morale.',
    seoDescription:
      'Tiri la leva nel problema del tram? La tua risposta rivela se ragioni come un utilitarista o un deontologista — e si collega a un archetipo di personalità morale specifico.',
    date: '2026-05-10',
    readingTime: 6,
    tags: ['problema del tram', 'psicologia morale', 'etica', 'personalità'],
    relatedDilemmaIds: ['trolley', 'organ-harvest', 'self-driving-crash', 'innocent-juror', 'cure-secret'],
    alternateSlug: 'trolley-problem-moral-personality',
    content: [
      {
        type: 'p',
        text: 'Un tram fuori controllo sta per investire cinque persone legate ai binari. Sei vicino a una leva. Tirarla devierebbe il tram su un binario laterale — dove si trova una persona. Non fare nulla significa cinque morti. Cosa fai?',
      },
      {
        type: 'p',
        text: 'La maggior parte delle persone tira la leva. Ma la divisione non è mai 90/10. Su SplitVote si attesta costantemente vicino al 60/40. Quella minoranza persistente — le persone che rifiutano di tirare — non è confusa né crudele. Ha un sistema morale coerente che la porta a una conclusione diversa.',
      },
      {
        type: 'p',
        text: 'Il problema del tram fu formulato dalla filosofa Philippa Foot nel 1967 proprio per esporre questo tipo di disaccordo profondo. Sei decenni dopo, rimane l\'esperimento mentale più discusso della filosofia morale — e la divergenza nelle risposte non si è mai chiusa del tutto.',
      },
      {
        type: 'cta',
        label: 'Vota sul problema del tram ora →',
        href: '/it/play/trolley',
      },
      {
        type: 'h2',
        text: 'Due sistemi morali, una leva',
      },
      {
        type: 'p',
        text: 'La ragione fondamentale per cui le persone si dividono sul problema del tram è che operano con sistemi morali radicalmente diversi — spesso senza saperlo.',
      },
      {
        type: 'p',
        text: 'Gli utilitaristi contano gli esiti: cinque vite salvate pesano più di una persa. Per loro, tirare la leva non è solo permissibile — è obbligatorio. Non farlo è un fallimento morale per omissione. I deontologisti si concentrano sugli atti, non sulle conseguenze: tirare la leva ti rende l\'agente della morte di quella persona. La stai usando come mezzo per salvare gli altri. Questo, per molti, è un confine che non attraverseranno indipendentemente dall\'aritmetica.',
      },
      {
        type: 'list',
        items: [
          'Tiri la leva → ragionamento utilitarista: gli esiti contano di più',
          'Non tiri → ragionamento deontologico: certi atti sono sbagliati indipendentemente dagli esiti',
          'Non riesci a decidere → etica della virtù: cosa farebbe una persona buona in questa situazione?',
        ],
      },
      {
        type: 'h2',
        text: 'La variante del ponte cambia tutto',
      },
      {
        type: 'p',
        text: 'La filosofa Judith Jarvis Thomson introdusse una variante che sconvolge le intuizioni: sei su un ponte sopra i binari. Accanto a te c\'è un uomo corpulento. Se lo spingi sui binari, il suo corpo fermerà il tram e salverà cinque persone. Lui morirà. Lo spingi?',
      },
      {
        type: 'p',
        text: 'La maggior parte delle persone dice no — anche quelle che hanno tirato la leva nella versione originale. L\'aritmetica è identica (una morte salva cinque), ma l\'atto fisico di spingere qualcuno cambia drasticamente la risposta morale.',
      },
      {
        type: 'p',
        text: 'Ricercatori come Joshua Greene di Harvard hanno usato questa divergenza per sostenere che nel giudizio morale sono attivi due sistemi cognitivi separati: un sistema emotivo rapido che reagisce all\'atto fisico di spingere, e un sistema deliberativo più lento che calcola le conseguenze. Nel caso della leva, la risposta emotiva è più bassa — tirare una leva è più astratto. Nel caso del ponte, sovrasta il calcolo per la maggior parte delle persone.',
      },
      {
        type: 'cta',
        label: 'Vota: useresti un organo per salvare cinque vite? →',
        href: '/it/play/organ-harvest',
      },
      {
        type: 'h2',
        text: 'La dottrina del doppio effetto',
      },
      {
        type: 'p',
        text: 'La filosofia morale cattolica ha sviluppato un principio — la dottrina del doppio effetto — che molte persone applicano intuitivamente senza conoscere il nome. Un\'azione che causa danno è permissibile se: l\'azione in sé non è intrinsecamente sbagliata; intendi l\'effetto buono, non quello cattivo; l\'effetto cattivo è una conseguenza collaterale prevista, non il mezzo per raggiungere il bene; e l\'effetto buono è proporzionato a quello cattivo.',
      },
      {
        type: 'p',
        text: 'Secondo questa dottrina, tirare la leva è accettabile (intendi salvare cinque; la morte di uno è una conseguenza collaterale prevista). Spingere l\'uomo non lo è (la sua morte è il mezzo diretto per salvare gli altri). Questo spiega esattamente perché così tante persone che tirano la leva si rifiutano anche di spingere.',
      },
      {
        type: 'h2',
        text: 'La tua risposta e il tuo archetipo morale',
      },
      {
        type: 'p',
        text: 'Come risponde al problema del tram non predice perfettamente il tuo tipo morale — ma è un segnale. Il sistema di personalità di SplitVote mappa i votanti su cinque assi etici. Le risposte al problema del tram tendono a raggrupparsi attorno a tre archetipi:',
      },
      {
        type: 'list',
        items: [
          'Guardiani e Sentinelle: orientati alle regole, tendono a non tirare — rispettare l\'ordine di chi ha causato la minaccia conta',
          'Strateghi e Oracoli: orientati agli esiti, tendono a tirare — cinque vite salvate sono cinque vite salvate',
          'Empatici e Custodi: guidati dalle emozioni, spesso in conflitto — sentono sia il cinque che l\'uno acutamente, possono rifiutarsi di scegliere',
        ],
      },
      {
        type: 'p',
        text: 'Il contesto cambia tutto, naturalmente. Le persone che tirano la leva nel problema base potrebbero rifiutarsi quando la vittima è qualcuno che amano. Le risposte morali sono stabili tra le popolazioni ma variabili all\'interno degli individui quando la posta diventa personale.',
      },
      {
        type: 'cta',
        label: 'Scopri il tuo archetipo di personalità morale →',
        href: '/it/personality',
      },
      {
        type: 'h2',
        text: 'Coerenza tra dilemmi: la tua risposta regge?',
      },
      {
        type: 'p',
        text: 'La domanda interessante non è solo cosa rispondi al problema del tram — ma se sei coerente attraverso scenari correlati. Le persone che si identificano come consequenzialiste a volte non rispondono in modo coerente quando la vittima viene personalizzata. Le persone che rivendicano principi deontologici a volte ammettono eccezioni quando le vite salvate salgono da cinque a cinquanta.',
      },
      {
        type: 'p',
        text: 'Quella incoerenza non è ipocrisia — è una caratteristica della psicologia morale. Il ragionamento etico reale è spesso più guidato dall\'intuizione e sensibile al contesto di quanto ci piaccia ammettere. Il problema del tram porta in superficie questo divario tra principi dichiarati e risposte reali.',
      },
      {
        type: 'cta',
        label: 'Vota: chi è responsabile quando un\'auto autonoma deve scegliere? →',
        href: '/it/play/self-driving-crash',
      },
      {
        type: 'h2',
        text: 'Cosa significa per l\'etica reale',
      },
      {
        type: 'p',
        text: 'I problemi del tram sono stati liquidati per decenni come troppo astratti. Poi sono arrivati gli analoghi reali: algoritmi di auto a guida autonoma che devono dare priorità negli scenari di incidente, protocolli di triage durante le pandemie, sistemi di intelligenza artificiale che ottimizzano per metriche che possono danneggiare gli individui.',
      },
      {
        type: 'p',
        text: 'La questione se deviare il danno — e chi ne paga il costo — non è più ipotetica. La divisione che vediamo su SplitVote tra pensatori orientati agli esiti e pensatori orientati alle regole riflette una genuina divisione sociale su come quei sistemi dovrebbero essere costruiti.',
      },
      {
        type: 'cta',
        label: 'Vota: prigioniero innocente — tacere o testimoniare? →',
        href: '/it/play/innocent-juror',
      },
      {
        type: 'cta',
        label: "Cos'è un dilemma morale? →",
        href: '/it/blog/cos-e-un-dilemma-morale',
      },
      {
        type: 'cta',
        label: 'Consequenzialismo: il maggior bene per il maggior numero →',
        href: '/it/blog/consequenzialismo-il-bene-maggiore',
      },
      {
        type: 'disclaimer',
        text: 'I riferimenti alla ricerca sul problema del tram, sulla psicologia morale a doppio processo e sulla dottrina del doppio effetto sono a scopo contestuale ed educativo. La ricerca descritta è attribuita a Philippa Foot, Judith Jarvis Thomson e Joshua Greene. SplitVote è una piattaforma di intrattenimento e riflessione, non uno studio scientifico. Le associazioni di archetipi descritte sono pattern illustrativi, non previsioni statisticamente validate.',
      },
    ],
  },
  // G15
  {
    slug: 'emozioni-morali-istinto-bussola-morale',
    locale: 'it',
    title: 'Emozioni Morali: Quando l\'Istinto È la Tua Bussola Morale',
    seoTitle: 'Emozioni Morali: Come l\'Istinto Guida il Giudizio Etico | SplitVote',
    description:
      'Il tuo istinto reagisce prima che il cervello si spieghi. La ricerca mostra che emozioni morali come disgusto, colpa ed elevazione sono i veri motori del giudizio etico.',
    seoDescription:
      'Scopri come emozioni morali come disgusto, colpa ed elevazione plasmano le tue scelte etiche prima ancora di ragionare. Basato sul modello intuizionista sociale di Haidt.',
    date: '2026-05-10',
    readingTime: 7,
    tags: ['psicologia morale', 'emozioni', 'intuizione', 'Haidt', 'etica'],
    relatedDilemmaIds: ['organ-harvest', 'trolley', 'cure-secret', 'self-driving-crash'],
    alternateSlug: 'moral-emotions-gut-feeling-moral-compass',
    content: [
      {
        type: 'p',
        text: 'Un chirurgo ha cinque pazienti in fin di vita per insufficienza d\'organo. Un paziente sano arriva per un controllo di routine. Prelevare gli organi di quel paziente salverebbe cinque vite e ne terminerebbe una.',
      },
      {
        type: 'p',
        text: 'Quasi tutti reagiscono immediatamente con repulsione. Il ragionamento arriva dopo — se arriva.',
      },
      {
        type: 'p',
        text: 'Jonathan Haidt ha chiamato questo "il cane emotivo che scodinzola la coda razionale." Il tuo istinto scatta per primo. La tua facoltà razionale segue — spesso lavorando a ritroso per giustificare il verdetto già emesso.',
      },
      {
        type: 'h2',
        text: 'Cosa sono le emozioni morali?',
      },
      {
        type: 'p',
        text: 'Le emozioni morali sono sentimenti che emergono specificamente in risposta a comportamenti percepiti come giusti o sbagliati — che siano tuoi o altrui.',
      },
      {
        type: 'p',
        text: 'Si distinguono dalle emozioni generali per una caratteristica fondamentale: portano un significato morale. Ti senti in colpa perché credi di aver causato un danno. Ti senti elevato quando testimoni una gentilezza inattesa. Provi disprezzo quando qualcuno viola quella che consideri la decenza di base.',
      },
      {
        type: 'p',
        text: 'Lo psicologo Paul Ekman ha catalogato sei emozioni di base. Jonathan Haidt ha esteso quel framework alle emozioni morali in modo specifico: colpa, vergogna, elevazione, rabbia morale, disprezzo — e, in modo cruciale, disgusto.',
      },
      {
        type: 'h2',
        text: 'L\'elefante e il cavaliere',
      },
      {
        type: 'p',
        text: 'Nel 2001, Haidt ha pubblicato un articolo che ha cambiato la psicologia morale. Ha proposto il Modello Intuizionista Sociale: i giudizi morali sono guidati principalmente da risposte emotive rapide e automatiche — e il ragionamento viene reclutato in seguito per spiegarli o difenderli.',
      },
      {
        type: 'p',
        text: 'La metafora che ha poi reso popolare: l\'elefante e il cavaliere. L\'elefante è il sistema intuitivo ed emotivo — grande, potente, difficile da governare. Il cavaliere è il ragionamento — seduto in cima, convinto di controllare, ma per lo più razionalizzando dove l\'elefante stava già andando.',
      },
      {
        type: 'p',
        text: 'Questo ha sfidato direttamente la tradizione razionalista nella psicologia morale — la visione, seguendo Kohlberg, che lo sviluppo morale significhi imparare a ragionare meglio. La risposta di Haidt: sei per lo più un razionalizzatore post-hoc di sentimenti istintivi. E questo non è un difetto.',
      },
      {
        type: 'h2',
        text: 'L\'ottundimento morale — quando le emozioni superano il ragionamento',
      },
      {
        type: 'p',
        text: 'La dimostrazione più sorprendente di Haidt ha coinvolto scenari progettati per provocare forti reazioni istintive bloccando le consuete giustificazioni basate sul danno.',
      },
      {
        type: 'p',
        text: 'L\'esempio classico: una coppia di fratelli che, durante un viaggio, hanno consensualmente un rapporto sessuale. Usano la contraccezione. Entrambi trovano l\'esperienza piacevole. Li avvicina. Non lo ripetono mai. Nessuno viene danneggiato e nessuno lo viene mai a sapere.',
      },
      {
        type: 'p',
        text: 'La maggior parte delle persone dice immediatamente che è sbagliato. Quando si chiede il perché, citano danni — malattie, gravidanza, trauma psicologico. I ricercatori fanno notare che questi fattori sono esplicitamente esclusi dallo scenario. La maggior parte rimane ferma: "È semplicemente sbagliato." Sono stati moralmente ottunditi — certi del loro giudizio, incapaci di giustificarlo, ma restii ad abbandonarlo.',
      },
      {
        type: 'p',
        text: 'La conclusione di Haidt: la certezza proveniva da una risposta emotiva. Il ragionamento era un tentativo di articolare quella risposta, non di derivarla.',
      },
      {
        type: 'h2',
        text: 'Disgusto: l\'emozione morale che ha colonizzato altri domini',
      },
      {
        type: 'p',
        text: 'Tra tutte le emozioni morali, il disgusto è la più studiata e la più sorprendente nella sua portata.',
      },
      {
        type: 'p',
        text: 'Il disgusto si è evoluto come sistema di evitamento dei patogeni. Si attiva in risposta a potenziali contaminanti: cibo in decomposizione, fluidi corporei, parassiti. La risposta fisiologica — nausea, la caratteristica smorfia di repulsione, il voltarsi dall\'altra parte — è antica e appare in tutte le culture.',
      },
      {
        type: 'p',
        text: 'Ciò che i ricercatori hanno scoperto è che il disgusto è stato cooptato dal ragionamento morale. Ora si attiva in risposta a violazioni morali che non hanno nulla a che fare con la contaminazione biologica: tradimento, azioni tabù, violazioni delle norme di purezza, sacrilegio simbolico.',
      },
      {
        type: 'p',
        text: 'Haidt e colleghi hanno scoperto che le persone con alta sensibilità al disgusto tendono ad assumere posizioni più conservative su questioni morali legate alla purezza — moralità sessuale, violazioni corporee, trattamento di oggetti sacri. Hanno più probabilità di sentire che qualcosa è sbagliato anche quando nessuno viene dimostrabilmente danneggiato.',
      },
      {
        type: 'p',
        text: 'Le persone inclini al disgusto non sono meno razionali. Utilizzano un filtro emotivo diverso — calibrato per rilevare una classe di violazioni differente.',
      },
      {
        type: 'h2',
        text: 'Il repertorio completo delle emozioni morali',
      },
      {
        type: 'list',
        items: [
          'Colpa — autodiretta, scattata quando credi di aver causato un danno o violato i tuoi standard. Correttiva: motiva la riparazione e l\'evitamento.',
          'Vergogna — correlata alla colpa ma centrata sul sé come fondamentalmente difettoso, non solo su aver fatto qualcosa di sbagliato. Tende al ritiro piuttosto che alla riparazione.',
          'Elevazione — il termine di Haidt per il calore e il senso di sollevamento che si prova testimoniando straordinaria gentilezza, coraggio o sacrificio. Motiva azioni prosociali nell\'osservatore.',
          'Rabbia morale — si attiva quando percepisci qualcun altro essere danneggiato, anche quando non sei tu la vittima. Il motore dell\'indignazione morale e di gran parte dell\'attivismo morale.',
          'Disprezzo — innescato da violazioni percepite delle norme della comunità da parte di qualcuno visto come al di sotto di quegli standard. A differenza della rabbia, il disprezzo liquida piuttosto che cercare riparazione.',
        ],
      },
      {
        type: 'h2',
        text: 'Come ragionamento ed emozione interagiscono — il contributo di Greene',
      },
      {
        type: 'p',
        text: 'Joshua Greene ad Harvard ha esteso il lavoro di Haidt usando la risonanza magnetica funzionale su persone che prendevano decisioni morali. Ha scoperto che diversi tipi di dilemmi attivano sistemi cerebrali fondamentalmente diversi.',
      },
      {
        type: 'p',
        text: 'I dilemmi morali personali — in cui devi danneggiare direttamente qualcuno con le tue mani per salvare altri — attivano fortemente i circuiti emotivi, in particolare quelli associati al conflitto sociale e all\'avversione al danno.',
      },
      {
        type: 'p',
        text: 'I dilemmi impersonali — tirare una leva, deviare un tram, premere un pulsante a distanza — attivano circuiti deliberativi prefrontali più razionali.',
      },
      {
        type: 'p',
        text: 'La teoria di Greene: le reazioni emotive al danno personale si sono evolute per regolare il comportamento in gruppi uniti dove qualsiasi danno diretto era sempre intimo e prossimo. Le decisioni morali impersonali, diventate possibili solo su scala civilizzazionale, richiedono il ragionamento deliberativo per sovrascrivere quelle impostazioni predefinite emotive.',
      },
      {
        type: 'p',
        text: 'Ecco perché la maggior parte delle persone è disposta a tirare la leva del tram ma non a spingere una persona dal ponte — anche se i risultati sono formalmente identici. Il sistema emotivo distingue il danno diretto da quello indiretto in un modo che il ragionamento deliberativo da solo non fa.',
      },
      {
        type: 'cta',
        label: 'Vota: prelievo d\'organi — salvare cinque sacrificando uno? →',
        href: '/it/play/organ-harvest',
      },
      {
        type: 'h2',
        text: 'Cosa significa per il tuo archetipo morale',
      },
      {
        type: 'p',
        text: 'Su SplitVote, questi pattern emergono in voti reali raccolti da centinaia di migliaia di risposte.',
      },
      {
        type: 'p',
        text: 'L\'archetipo Guardian mostra forti reazioni ai dilemmi di purezza e lealtà — esattamente gli scenari in cui disgusto e disprezzo hanno più probabilità di attivarsi. I Guardian sentono frequentemente che alcune azioni sono sbagliate indipendentemente dalle loro conseguenze.',
      },
      {
        type: 'p',
        text: 'L\'archetipo Strategist favorisce costantemente il ragionamento basato sugli esiti — tirare leve, autorizzare compromessi difficili, accettare danni impersonali per prevenire danni maggiori. Questo profilo si allinea con una minore sensibilità al disgusto e un maggiore coinvolgimento deliberativo.',
      },
      {
        type: 'p',
        text: 'L\'archetipo Empath mostra alta attivazione intorno al danno diretto e al conflitto sociale — forte rabbia morale quando gli individui vengono sacrificati per il collettivo, e forti risposte di elevazione alle storie di solidarietà e sacrificio.',
      },
      {
        type: 'p',
        text: 'Nessuno di questi profili è più evoluto o più corretto. Riflettono diverse calibrazioni di emozioni morali presenti in ogni essere umano — semplicemente ponderate diversamente tra le persone.',
      },
      {
        type: 'h2',
        text: 'Provalo tu stesso',
      },
      {
        type: 'p',
        text: 'Il modo migliore per comprendere il proprio profilo emotivo morale è affrontare dilemmi che attivano sistemi emotivi diversi. Lo scenario del prelievo d\'organi scatena un disgusto quasi universale. Il problema del tram separa chi riesce a sovrascrivere le reazioni emotive attraverso la deliberazione da chi non lo fa.',
      },
      {
        type: 'p',
        text: 'I tuoi pattern attraverso più dilemmi rivelano qualcosa di reale su quali emozioni morali sono più forti nel tuo sistema — e questo, direbbe Haidt, è il nucleo della tua identità morale.',
      },
      {
        type: 'cta',
        label: 'Vota: il problema del tram →',
        href: '/it/play/trolley',
      },
      {
        type: 'cta',
        label: 'Scopri il tuo tipo di personalità morale →',
        href: '/it/personality',
      },
      {
        type: 'cta',
        label: "Cos'è un dilemma morale? →",
        href: '/it/blog/cos-e-un-dilemma-morale',
      },
      {
        type: 'cta',
        label: 'Teoria dei fondamenti morali: perché le persone buone non sono d\'accordo →',
        href: '/it/blog/teoria-fondamenti-morali',
      },
      {
        type: 'disclaimer',
        text: 'I riferimenti al Modello Intuizionista Sociale di Jonathan Haidt, alla ricerca a doppio processo di Joshua Greene e alla tassonomia delle emozioni di Paul Ekman sono a scopo contestuale ed educativo. La ricerca citata è attribuita ai suoi autori originali. SplitVote è una piattaforma di intrattenimento e riflessione, non uno studio scientifico. Le associazioni di archetipi descritte sono pattern illustrativi basati su dati di voto aggregati, non valutazioni della personalità clinicamente validate.',
      },
    ],
  },
  // G16
  {
    slug: 'libero-arbitrio-e-responsabilita-morale',
    locale: 'it',
    title: 'Libero arbitrio e responsabilità morale: le tue scelte contano davvero?',
    seoTitle: 'Libero Arbitrio e Responsabilità Morale — Compatibilismo, Strawson e Dilemmi Morali',
    description:
      'Se il tuo cervello è stato modellato da geni ed esperienza, sei davvero libero? Il dibattito sul libero arbitrio non è solo accademico — determina se la responsabilità morale abbia senso.',
    seoDescription:
      'Esplora il dibattito sul libero arbitrio attraverso il compatibilismo e gli atteggiamenti reattivi di P.F. Strawson. Scopri come determinismo, responsabilità e dilemmi morali si intrecciano.',
    date: '2026-05-11',
    readingTime: 7,
    tags: ['libero arbitrio', 'filosofia morale', 'compatibilismo', 'Strawson', 'responsabilità morale'],
    relatedDilemmaIds: ['trolley', 'organ-harvest', 'memory-erase', 'innocent-juror'],
    alternateSlug: 'free-will-and-moral-responsibility',
    content: [
      {
        type: 'p',
        text: 'Stai affrontando il problema del carrello. Un tram impazzito corre verso cinque persone. Puoi tirare una leva e deviarlo — ma sulla via laterale c\'è qualcuno che morrà. Decidi. Tiri la leva. Oppure no.',
      },
      {
        type: 'p',
        text: 'Ecco la domanda scomoda che segue: era davvero una tua scelta?',
      },
      {
        type: 'p',
        text: 'La tua decisione è stata plasmata dalla tua educazione, dalla tua cultura, dalle parole precise con cui il dilemma era formulato, dall\'umore in cui ti trovavi mentre lo leggevi, dai pattern neurali costruiti da ogni esperienza che hai mai vissuto. Se tutte queste cause hanno determinato la tua risposta — in che senso hai scelto liberamente qualcosa?',
      },
      {
        type: 'h2',
        text: 'Il problema che il determinismo pone alla responsabilità morale',
      },
      {
        type: 'p',
        text: 'Il determinismo è la tesi per cui ogni evento — inclusa ogni scelta umana — è il risultato inevitabile di cause precedenti che operano secondo leggi naturali. La fisica procede in un\'unica direzione. Il cervello è fisico. Quindi, dice l\'argomento, ogni decisione che hai mai preso era fissata dallo stato dell\'universo prima che tu nascessi.',
      },
      {
        type: 'p',
        text: 'Se il determinismo è vero, la responsabilità morale sembra in pericolo. Di norma riteniamo le persone responsabili solo quando avrebbero potuto agire diversamente. Un automobilista che ha un improvviso attacco epilettico e investe un pedone non è colpevole — non avrebbe potuto fare altrimenti. Ma se il determinismo è vero, nessuno avrebbe mai potuto fare altrimenti. Significa che nessuno è mai davvero colpevole di nulla?',
      },
      {
        type: 'h2',
        text: 'Tre risposte filosofiche al problema',
      },
      {
        type: 'p',
        text: '**Il determinismo forte** accetta la conclusione: sì, la responsabilità morale tradizionale è un\'illusione. Le nostre pratiche di biasimo, punizione e lode presuppongono una libertà che la fisica non permette. Dovremmo sostituirle con pratiche orientate al futuro — non punizione per le scelte passate, ma trattamento e prevenzione dei danni futuri.',
      },
      {
        type: 'p',
        text: '**Il libertarismo del libero arbitrio** (nel senso filosofico, senza relazione con la politica) insiste sul fatto che gli esseri umani siano genuinamente esenti dalla determinazione causale. Alcuni filosofi si appellano all\'indeterminazione quantistica nei processi neurali; altri, come Kant, sostenevano che in quanto agenti razionali siamo parzialmente al di fuori dell\'ordine causale. In questa prospettiva il libero arbitrio esiste — ma la sua spiegazione scientifica rimane controversa.',
      },
      {
        type: 'p',
        text: '**Il compatibilismo** offre la terza via — ed è la posizione accettata dalla maggioranza dei filosofi accademici oggi. I compatibilisti sostengono che libero arbitrio e determinismo non siano davvero in conflitto. Ridefiniscono il "libero arbitrio" non come libertà dalla causazione, ma come un tipo specifico di causazione: agire secondo i propri desideri, valori e ragionamento, anziché per coercizione esterna o disfunzione interna.',
      },
      {
        type: 'h2',
        text: 'Compatibilismo: cosa significa agire liberamente',
      },
      {
        type: 'p',
        text: 'Nella prospettiva compatibilista, agisci liberamente quando la tua azione fluisce dal tuo stesso carattere — i tuoi valori, la tua deliberazione, la tua volontà. Agisci in modo non libero quando qualcosa bypassa quel processo: una pistola puntata alla testa, una compulsione che non riesci a controllare, una manipolazione di cui non sei consapevole.',
      },
      {
        type: 'p',
        text: 'Un automobilista che brucia un rosso a causa di un attacco epilettico non è responsabile. Un automobilista che lo brucia perché era di fretta lo è — anche se la sua impazienza era essa stessa causata da eventi precedenti. Ciò che conta è la qualità del percorso causale: passa attraverso il ragionamento e i valori della persona, oppure li aggira?',
      },
      {
        type: 'p',
        text: 'Può sembrare una sottigliezza tecnica — ma corrisponde a un\'intuizione morale reale. Trattiamo in modo diverso le azioni compiute sotto coercizione e quelle compiute liberamente. Distinguiamo chi aiuta uno sconosciuto perché lo vuole da chi lo fa sotto minaccia. Il compatibilismo cerca di spiegare perché questa distinzione conti anche in un mondo deterministico.',
      },
      {
        type: 'h2',
        text: 'L\'intuizione di Strawson: gli atteggiamenti reattivi come fondamento della responsabilità morale',
      },
      {
        type: 'p',
        text: 'Nel 1962, il filosofo P.F. Strawson pubblicò "Freedom and Resentment" — probabilmente il saggio più influente sulla responsabilità morale del Novecento. Il suo argomento cambiò il modo in cui questo dibattito viene impostato.',
      },
      {
        type: 'p',
        text: 'Strawson osservò che la maggior parte delle discussioni sul libero arbitrio si concentra su una domanda metafisica: l\'agente è la causa ultima della propria azione? Sostenne che questa era la domanda sbagliata. Ciò che fonda realmente le nostre pratiche di responsabilità è qualcosa di molto più immediato: gli atteggiamenti reattivi.',
      },
      {
        type: 'p',
        text: 'Gli atteggiamenti reattivi sono i sentimenti che proviamo verso gli altri in quanto agenti morali: risentimento quando qualcuno ci fa un torto, gratitudine quando qualcuno ci aiuta, indignazione per conto di una terza parte, amore, rabbia, disprezzo, ammirazione. Non sono conclusioni filosofiche — sono il tessuto delle relazioni umane.',
      },
      {
        type: 'p',
        text: 'La mossa chiave di Strawson: ritenere qualcuno responsabile significa proprio mantenere questi atteggiamenti reattivi nei suoi confronti. Quando trattiamo qualcuno come responsabile, proviamo risentimento o gratitudine in base a ciò che fa. Quando sospendiamo la responsabilità — nei casi di coercizione, psicosi o ignoranza — passiamo a quella che Strawson chiamava la "prospettiva oggettiva": consideriamo la persona come un sistema da gestire, trattare o contenere, piuttosto che come un agente cui rispondere.',
      },
      {
        type: 'h2',
        text: 'Perché non possiamo adottare stabilmente la prospettiva oggettiva verso tutti',
      },
      {
        type: 'p',
        text: 'Il punto più profondo di Strawson era questo: non potresti, nemmeno in linea di principio, adottare in modo coerente la prospettiva oggettiva verso tutti gli esseri umani. Questo dissolverebbe la stessa possibilità delle relazioni umane. L\'amore richiede che ci importi se qualcuno ha voluto aiutarti. L\'amicizia richiede la possibilità del tradimento. La comunità morale ha come fondamento gli atteggiamenti reattivi.',
      },
      {
        type: 'p',
        text: 'Il determinista forte che dice che la responsabilità morale è un\'illusione non sbaglia nel ragionamento — potrebbe avere ragione metafisicamente. Ma non può vivere come se questa conclusione fosse vera. Proverà ancora risentimento quando viene ingannato. Proverà ancora gratitudine quando viene aiutato. Gli atteggiamenti reattivi non sono credenze aggiornabili con argomenti filosofici — sono parte di ciò che significa relazionarsi con le altre persone.',
      },
      {
        type: 'p',
        text: 'Questa è quella che Strawson chiamava la "prospettiva partecipante". Partecipare alla vita umana significa già ritenere le persone responsabili, nel senso che conta — non perché abbiamo risolto la metafisica della causazione, ma perché è questo che significa trattare qualcuno come una persona piuttosto che come un meccanismo.',
      },
      {
        type: 'h2',
        text: 'Cosa significa per i dilemmi morali',
      },
      {
        type: 'p',
        text: 'Quando SplitVote mostra che il 68% delle persone tira la leva del carrello e il 32% si rifiuta — cosa ci dice quella divisione? Non semplicemente che le persone hanno fatto calcoli aritmetici diversi. Ci dice che le persone hanno visioni diverse su cosa richiede la responsabilità, chi la porta e quanto peso dare alla distinzione tra fare e permettere un danno.',
      },
      {
        type: 'p',
        text: 'Chi si rifiuta di tirare la leva non sta necessariamente dicendo che la matematica è sbagliata. Potrebbe stare dicendo: tirare quella leva mi rende causalmente responsabile di una morte in un modo in cui stare fermo non lo fa — e questa differenza conta per il loro senso di sé come agenti morali. Questo è l\'atteggiamento reattivo in azione: non un calcolo freddo, ma un senso vissuto di che tipo di persona si è e con cosa si può convivere.',
      },
      {
        type: 'cta',
        label: 'Vota: tirare la leva o non farlo? →',
        href: '/it/play/trolley',
      },
      {
        type: 'h2',
        text: 'Implicazioni per punizione e perdono',
      },
      {
        type: 'p',
        text: 'Il dibattito sul libero arbitrio ha conseguenze dirette su come pensiamo alla giustizia penale. Se le scelte delle persone sono completamente determinate da genetica, educazione e circostanze — cosa giustifica la punizione al di là della deterrenza e della protezione pubblica? La visione retributiva — che le persone meritino la punizione per i torti liberamente scelti — perde il suo fondamento.',
      },
      {
        type: 'p',
        text: 'I compatibilisti sostengono che la retribuzione sia ancora giustificata quando il torto è fluito attraverso il ragionamento e i valori della persona — quando era una sua scelta nel senso che conta, anche se determinata. I deterministi forti chiedono una giustizia penale puramente consequenzialista: non punizione ma trattamento, riabilitazione e prevenzione.',
      },
      {
        type: 'p',
        text: 'La prospettiva di Strawson aggiunge una terza lente: se possiamo perdonare qualcuno dipende non dalla metafisica ma dal fatto che mostri genuino rimpianto, comprensione e cambiamento. Il perdono è la sospensione del risentimento — ma è giustificato da ciò che la persona fa, non dal fatto che avrebbe potuto agire diversamente in senso assoluto.',
      },
      {
        type: 'h2',
        text: 'Sei responsabile del voto che hai espresso?',
      },
      {
        type: 'p',
        text: 'Torniamo al dilemma del carrello. Il tuo voto è stato plasmato da tutto ciò che ti ha reso quello che sei. Un compatibilista direbbe: sì, è esattamente per questo che era una tua scelta. Il tuo carattere, i tuoi valori, il tuo ragionamento — non sono vincoli esterni alla tua libertà. Sono la tua libertà. La scelta ha espresso chi sei.',
      },
      {
        type: 'p',
        text: 'La domanda che il dilemma lascia aperta è se il carattere che ha scelto sia uno che approvi — se, a rifletterci, tu stia dietro a ciò che il tuo istinto ha deciso. Questo è il vero lavoro del ragionamento morale: non scoprire la risposta giusta da fuori di te stesso, ma esaminare se i valori che hanno guidato la tua risposta siano quelli che vuoi davvero avere.',
      },
      {
        type: 'cta',
        label: 'Scopri il tuo tipo di personalità morale →',
        href: '/it/personality',
      },
      {
        type: 'cta',
        label: 'Causare vs permettere il danno: perché la distinzione conta →',
        href: '/it/blog/causare-vs-permettere-danno',
      },
      {
        type: 'cta',
        label: 'Emozioni morali: quando l\'istinto è la tua bussola morale →',
        href: '/it/blog/emozioni-morali-istinto-bussola-morale',
      },
      {
        type: 'disclaimer',
        text: 'I riferimenti a "Freedom and Resentment" di P.F. Strawson (1962), al compatibilismo filosofico e al dibattito sul libero arbitrio sono a scopo educativo e contestuale. Le posizioni filosofiche descritte rappresentano le principali correnti di pensiero; l\'attribuzione è ai rispettivi autori. SplitVote è una piattaforma di intrattenimento e riflessione, non uno studio scientifico né un\'autorità filosofica. I dati di voto descritti sono indicativi.',
      },
    ],
  },
  // G17
  {
    slug: 'effetto-spettatore-e-responsabilita-morale',
    locale: 'it',
    title: "L'effetto spettatore: perché più testimoni significa meno aiuto",
    seoTitle: "Effetto Spettatore e Responsabilità Morale — Perché i Gruppi Non Agiscono",
    description:
      "Più persone assistono a un'emergenza, meno è probabile che qualcuna di loro intervenga. Non è indifferenza — è un prevedibile fallimento della responsabilità morale studiato dai psicologi dal 1968.",
    seoDescription:
      "Scopri come l'effetto spettatore e la diffusione di responsabilità paralizzano i gruppi di fronte alle emergenze. Basato sulla ricerca di Darley e Latané. Con dilemmi morali reali.",
    date: '2026-05-11',
    readingTime: 6,
    tags: ['effetto spettatore', 'psicologia morale', 'diffusione di responsabilità', 'Darley Latané', 'etica'],
    relatedDilemmaIds: ['trolley', 'lifeboat', 'innocent-juror', 'why-not-intervene'],
    alternateSlug: 'bystander-effect-and-moral-responsibility',
    content: [
      {
        type: 'p',
        text: 'Nel marzo 1964, Kitty Genovese fu aggredita vicino a casa sua nel Queens, New York. L\'aggressione durò oltre mezz\'ora. I resoconti dell\'epoca affermavano che 38 vicini avevano assistito all\'attacco — e che nessuno di loro aveva chiamato la polizia finché non era troppo tardi.',
      },
      {
        type: 'p',
        text: 'La storia così raccontata si è poi rivelata in parte inesatta. Ma l\'incidente diede il via a uno dei programmi di ricerca più importanti nella storia della psicologia sociale — e il fenomeno che rivelò è molto reale.',
      },
      {
        type: 'h2',
        text: "L'esperimento che ha dimostrato l'effetto",
      },
      {
        type: 'p',
        text: 'Nel 1968, gli psicologi sociali John Darley e Bibb Latané condussero una serie di esperimenti per verificare se la presenza di altre persone riduca la probabilità di intervenire in un\'emergenza.',
      },
      {
        type: 'p',
        text: 'In una versione, i partecipanti in una sala d\'attesa notavano del fumo che entrava dalla ventola. Quando erano soli, il 75% lo segnalava entro due minuti. Quando erano seduti con altre due persone che si comportavano con indifferenza — in realtà complici dello sperimentatore — solo il 10% lo segnalava. La maggior parte restava ferma, lanciando di tanto in tanto un\'occhiata al fumo, senza fare niente.',
      },
      {
        type: 'p',
        text: 'In un altro esperimento, i partecipanti sentivano attraverso un interfono quello che sembrava un altro partecipante colpito da una crisi epilettica. Quando credevano di essere gli unici testimoni, l\'85% interveniva entro 60 secondi. Quando credevano che altri quattro potessero sentire, solo il 31% interveniva — e molti non lo facevano affatto.',
      },
      {
        type: 'h2',
        text: 'Tre meccanismi alla base dell\'effetto',
      },
      {
        type: 'p',
        text: '**Diffusione di responsabilità.** Quando sei l\'unico a poter aiutare, tutto il peso morale del non agire ricade su di te. Quando ci sono altri presenti, quel peso si distribuisce — diviso tra tutti gli spettatori. Il risultato è che ciascuno si sente meno personalmente responsabile. Ognuno assume che qualcun altro interverrà.',
      },
      {
        type: 'p',
        text: '**Ignoranza pluralistica.** In situazioni ambigue, le persone osservano gli altri per capire la situazione. Se nessun altro sembra allarmato, il segnale sociale implicito è: questa non deve essere un\'emergenza. Ciascuno sospetta privatamente che ci sia qualcosa che non va, ma in pubblico si comporta con calma perché tutti gli altri fanno lo stesso — una finzione collettiva che si autoalimenta.',
      },
      {
        type: 'p',
        text: '**Paura del giudizio.** Intervenire in pubblico comporta un rischio sociale. E se si fraintende la situazione? E se si interviene in modo maldestro e le cose vanno peggio? La presenza di altri osservatori alza la posta in gioco del sembrare incompetenti o esagerati — e questa paura trattiene le persone anche quando sospettano che sia necessario agire.',
      },
      {
        type: 'h2',
        text: 'La matematica controintuitiva',
      },
      {
        type: 'p',
        text: 'La nostra intuizione dice: più testimoni significa più aiuto. Più persone che vedono un\'emergenza vuol dire più possibilità di un buon esito.',
      },
      {
        type: 'p',
        text: 'Darley e Latané hanno dimostrato il contrario. La relazione non è additiva — è diluitiva. Aggiungere testimoni non aumenta la probabilità di intervento: riduce la probabilità che un singolo individuo agisca. A un certo punto il gruppo rimane paralizzato non nonostante le sue dimensioni, ma a causa di esse.',
      },
      {
        type: 'p',
        text: 'Questo non è un tratto di persone indifferenti o egoiste. È stato osservato con studenti universitari comuni che, in situazioni uno a uno, aiutavano quasi sempre. Il fallimento è situazionale, non caratteriale. Date le giuste (o sbagliate) dimensioni del gruppo e i giusti segnali sociali, quasi chiunque finirà per non agire.',
      },
      {
        type: 'cta',
        label: 'Vota: tireresti la leva quando tutti gli altri esitano? →',
        href: '/it/play/trolley',
      },
      {
        type: 'h2',
        text: 'Lo spettatore online',
      },
      {
        type: 'p',
        text: 'I social media hanno creato un nuovo contesto per le dinamiche dello spettatore. Un video di molestie o crudeltà può essere visto da milioni di persone. La risposta è spesso fare screenshot, condividere, commentare — ma raramente intervenire in modo diretto e concreto a favore della persona colpita.',
      },
      {
        type: 'p',
        text: 'I ricercatori che studiano il comportamento degli spettatori online hanno trovato dinamiche simili a quelle descritte da Darley e Latané. Più grande è il pubblico di un post, minore è la probabilità che un singolo commentatore faccia qualcosa di attivo. Il pulsante "mi piace" e la funzione di condivisione potrebbero addirittura rafforzare la spettatorialità passiva, dando alle persone la sensazione di partecipare senza richiedere un\'azione reale.',
      },
      {
        type: 'p',
        text: "L'effetto spettatore negli spazi digitali è forse ancora più potente perché elimina persino l'imbarazzo fisico di una vera emergenza. Non c'è una vittima visibile di fronte a te, non c'è fumo nella stanza. Il costo morale del non agire sembra più basso — e quindi l'inerzia è più alta.",
      },
      {
        type: 'h2',
        text: 'Cosa significa per la responsabilità morale',
      },
      {
        type: 'p',
        text: "L'effetto spettatore si trova all'incrocio di due domande fondamentali dell'etica: quando sei responsabile di un danno che non hai causato? E quanto la presenza di altri modifica quella responsabilità?",
      },
      {
        type: 'p',
        text: 'Le tradizioni morali non sono d\'accordo. I consequenzialisti tendono a ritenere che non prevenire un danno che si poteva prevenire sia moralmente equivalente a causarlo — lo spettatore che non fa niente mentre cinque persone annegano quando avrebbe potuto lanciare una corda porta una responsabilità morale reale. I deontologi distinguono spesso tra doveri positivi (aiutare) e doveri negativi (non nuocere), con i secondi più forti — il che può attenuare la colpevolezza dello spettatore.',
      },
      {
        type: 'p',
        text: 'Il quadro degli atteggiamenti reattivi di Strawson offre una terza prospettiva: proviamo davvero risentimento e indignazione verso gli spettatori che avrebbero potuto aiutare e non lo hanno fatto. Questi sentimenti non sono irrazionali. Riflettono un\'aspettativa morale genuina: le persone presenti portano una certa responsabilità per gli esiti che avrebbero potuto influenzare — indipendentemente da quante altre fossero presenti.',
      },
      {
        type: 'h2',
        text: "Come spezzare l'effetto",
      },
      {
        type: 'p',
        text: "La consapevolezza dell'effetto spettatore non lo dissolve automaticamente — ma aiuta. Gli interventi più efficaci sono strutturali:",
      },
      {
        type: 'list',
        items: [
          'Assegna la responsabilità esplicitamente: nomina una persona specifica ("tu, con la giacca rossa — chiama un\'ambulanza"). La diffusione di responsabilità non sopravvive alla designazione diretta.',
          'Riconosci la situazione pubblicamente: dì ad alta voce "c\'è qualcosa che non va". Questo rompe l\'ignoranza pluralistica — costringi il gruppo a smettere di fingere che tutto sia normale.',
          'Agisci per primo, anche in modo imperfetto: qualcuno che compie qualsiasi azione — anche sbagliata — aumenta drasticamente la probabilità che altri si uniscano. Chi agisce per primo assorbe il rischio del giudizio per tutti gli altri.',
        ],
      },
      {
        type: 'h2',
        text: 'Dove si trova davvero il tuo istinto',
      },
      {
        type: 'p',
        text: 'I dilemmi morali su SplitVote eliminano il contesto sociale che permette l\'inazione degli spettatori. Sei solo con la domanda. Non ci sono complici che si comportano con indifferenza. Non c\'è una folla che diluisce il tuo senso di responsabilità.',
      },
      {
        type: 'p',
        text: "Questo è in parte ciò che rende il voto interessante: è una lettura più pura dei tuoi valori rispetto a quella che il tuo comportamento reale in una situazione di gruppo ti darebbe. Misura ciò che pensi dovrebbe succedere — non ciò che la pressione sociale ti consente di fare. Il divario tra queste due cose è dove vive l'effetto spettatore.",
      },
      {
        type: 'cta',
        label: 'Scopri il tuo tipo di personalità morale →',
        href: '/it/personality',
      },
      {
        type: 'cta',
        label: 'Perché le persone buone non fanno nulla: il disimpegno morale →',
        href: '/it/blog/perche-le-persone-buone-non-fanno-nulla',
      },
      {
        type: 'cta',
        label: 'Libero arbitrio e responsabilità morale: sei davvero colpevole? →',
        href: '/it/blog/libero-arbitrio-e-responsabilita-morale',
      },
      {
        type: 'disclaimer',
        text: 'I riferimenti alla ricerca di Darley e Latané sullo spettatore (1968) e al caso Kitty Genovese sono a scopo educativo e contestuale. La narrativa originale dei 38 testimoni è stata parzialmente rivista da giornalismo d\'inchiesta e ricerche storiche successive; la ricerca psicologica che ha ispirato rimane fondamentale nel campo. SplitVote è una piattaforma di intrattenimento e riflessione, non uno studio scientifico. I dati di voto descritti sono indicativi.',
      },
    ],
  },
]

export const allPosts: BlogPost[] = [...EN_POSTS, ...IT_POSTS]

export function getPostsByLocale(locale: 'en' | 'it'): BlogPost[] {
  return allPosts
    .filter((p) => p.locale === locale)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getPost(slug: string, locale: 'en' | 'it'): BlogPost | undefined {
  return allPosts.find((p) => p.slug === slug && p.locale === locale)
}

export function getAlternateUrl(post: BlogPost): string | null {
  if (!post.alternateSlug) return null
  const altLocale = post.locale === 'en' ? 'it' : 'en'
  const prefix = altLocale === 'it' ? '/it' : ''
  return `${BASE}${prefix}/blog/${post.alternateSlug}`
}

export function postUrl(post: BlogPost): string {
  const prefix = post.locale === 'it' ? '/it' : ''
  return `${BASE}${prefix}/blog/${post.slug}`
}

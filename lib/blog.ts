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
        type: 'disclaimer',
        text: 'SplitVote archetypes are for entertainment and self-reflection only — not a psychological assessment, diagnostic tool, or scientific measure.',
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
        type: 'disclaimer',
        text: "SplitVote presents ethical dilemmas for reflection and discussion. Results represent our community's votes, not scientific conclusions. Source: Awad et al., 'The Moral Machine experiment', Nature 558, 59–64 (2018).",
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
        type: 'disclaimer',
        text: "Gli archetipi SplitVote sono solo per intrattenimento e auto-riflessione — non uno strumento di valutazione psicologica, diagnostica o misura scientifica.",
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
        type: 'disclaimer',
        text: "SplitVote presenta dilemmi etici per la riflessione e il confronto. I risultati rappresentano i voti della nostra community, non conclusioni scientifiche. Fonte: Awad et al., 'The Moral Machine experiment', Nature 558, 59–64 (2018).",
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

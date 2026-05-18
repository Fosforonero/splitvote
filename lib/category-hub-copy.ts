/**
 * lib/category-hub-copy.ts
 *
 * Deterministic, server-only copy helpers for category discovery hubs.
 * Centralises the per-category intro + tensions + CTA + related links
 * used by `/category/[category]` and `/it/category/[category]`.
 *
 * Constraints:
 *   - No AI generation at runtime, no Redis fetches.
 *   - EN/IT parity for every category in `Category`.
 *   - Lifestyle uses a lighter, non-moral framing.
 *   - Never claim SplitVote is scientific or representative of "the world".
 *   - `related` never contains the category itself.
 */
import { CATEGORIES } from '@/lib/scenarios'
import type { Category } from '@/lib/scenarios'

export type HubLocale = 'en' | 'it'

export interface CategoryHubCopy {
  readonly metaTitle: string
  readonly metaDescription: string
  readonly intro: string
  readonly tensions: readonly [string, string, string]
  readonly ctaLabel: string
  readonly related: readonly Category[]
}

type HubMap = Record<HubLocale, Record<Category, CategoryHubCopy>>

const EMOJI: Record<Category, string> = Object.fromEntries(
  CATEGORIES.filter((c) => c.value !== 'all').map((c) => [c.value, c.emoji]),
) as Record<Category, string>

const EN_LABEL: Record<Category, string> = Object.fromEntries(
  CATEGORIES.filter((c) => c.value !== 'all').map((c) => [c.value, c.label]),
) as Record<Category, string>

const IT_LABEL: Record<Category, string> = {
  morality:      'Moralità',
  survival:      'Sopravvivenza',
  loyalty:       'Lealtà',
  justice:       'Giustizia',
  freedom:       'Libertà',
  technology:    'Tecnologia',
  society:       'Società',
  relationships: 'Relazioni',
  lifestyle:     'Stile di vita',
}

function enTitle(cat: Category): string {
  return `${EMOJI[cat]} ${EN_LABEL[cat]} Dilemmas — Real-time Votes | SplitVote`
}

function itTitle(cat: Category): string {
  return `${EMOJI[cat]} Dilemmi di ${IT_LABEL[cat]} — Vota in Tempo Reale | SplitVote`
}

const HUB: HubMap = {
  en: {
    morality: {
      metaTitle: enTitle('morality'),
      metaDescription:
        'Classic moral dilemmas — choices where every option has a cost. Vote and see how SplitVote splits.',
      intro:
        'The classic moral dilemmas — choices where every option carries a cost. Pull the lever or stay back. Lie to spare feelings or tell the painful truth. Vote and see how SplitVote splits on each one.',
      tensions: [
        'Doing harm vs allowing harm',
        'Following a principle vs minimising suffering',
        'Treating people as ends vs as means',
      ],
      ctaLabel: 'Start the 3-question morality path',
      related: ['justice', 'loyalty', 'survival'],
    },
    survival: {
      metaTitle: enTitle('survival'),
      metaDescription:
        'Life-or-death dilemmas where every option costs something. Vote and see how SplitVote splits.',
      intro:
        'Survival dilemmas force you to weigh life against life when there is no clean answer. They strip ethics down to one question: what would you actually do when everything has a cost?',
      tensions: [
        'Save the many vs save the one',
        'Self-preservation vs duty to others',
        'Acting now vs waiting for more information',
      ],
      ctaLabel: 'Start the 3-question survival path',
      related: ['morality', 'justice', 'society'],
    },
    loyalty: {
      metaTitle: enTitle('loyalty'),
      metaDescription:
        'Loyalty dilemmas — when honesty and love collide. Vote and watch SplitVote split.',
      intro:
        'Loyalty dilemmas test where your allegiances actually live. Cover for a friend or tell the truth. Stay silent or speak up. Vote and see how SplitVote splits between bond and conscience.',
      tensions: [
        'Protecting someone you love vs telling the truth',
        'Loyalty to a person vs loyalty to a principle',
        'Forgiving vs walking away',
      ],
      ctaLabel: 'Start the 3-question loyalty path',
      related: ['relationships', 'morality', 'justice'],
    },
    justice: {
      metaTitle: enTitle('justice'),
      metaDescription:
        'Justice dilemmas — law, fairness, and grey zones. Vote and see how SplitVote splits.',
      intro:
        'Justice dilemmas live in the gap between what is legal and what feels fair. Punish or rehabilitate. Follow the rule or break it for the right person. Vote and watch SplitVote split.',
      tensions: [
        'The letter of the law vs the spirit of it',
        'Punishment vs rehabilitation',
        'Rules everyone follows vs exceptions you can defend',
      ],
      ctaLabel: 'Start the 3-question justice path',
      related: ['society', 'morality', 'freedom'],
    },
    freedom: {
      metaTitle: enTitle('freedom'),
      metaDescription:
        'Freedom vs safety dilemmas — where do you draw the line? Vote and see how SplitVote splits.',
      intro:
        'Freedom dilemmas force a trade-off between personal liberty and collective safety. How much privacy for how much security. Where do you draw the line — and who gets to decide?',
      tensions: [
        'Personal liberty vs collective safety',
        'Privacy vs accountability',
        'Autonomy now vs protection later',
      ],
      ctaLabel: 'Start the 3-question freedom path',
      related: ['society', 'justice', 'technology'],
    },
    technology: {
      metaTitle: enTitle('technology'),
      metaDescription:
        'Tech and AI ethics dilemmas — the future is already complicated. Vote and see how SplitVote splits.',
      intro:
        'Tech dilemmas are questions we did not have to answer until last week. AI decisions, gene editing, surveillance. New tools force old questions to be asked in completely new ways.',
      tensions: [
        'Speed of progress vs space to debate it',
        'Convenience vs privacy',
        'What we can build vs what we should build',
      ],
      ctaLabel: 'Start the 3-question technology path',
      related: ['freedom', 'society', 'morality'],
    },
    society: {
      metaTitle: enTitle('society'),
      metaDescription:
        'Society dilemmas — inequality, borders, policy. Vote and see how SplitVote splits.',
      intro:
        'Society dilemmas are about how we live together. Who gets what, who decides, who pays. They sit beneath every policy debate — and SplitVote shows where opinion actually splits.',
      tensions: [
        'Individual choice vs collective rule',
        'Equality of outcome vs equality of opportunity',
        'Helping now vs sustainable systems',
      ],
      ctaLabel: 'Start the 3-question society path',
      related: ['justice', 'freedom', 'technology'],
    },
    relationships: {
      metaTitle: enTitle('relationships'),
      metaDescription:
        'Relationship dilemmas — love, loyalty, and impossible choices. Vote and see how SplitVote splits.',
      intro:
        'Relationship dilemmas get personal fast. Honesty or kindness. Loyalty or distance. The trade-offs are not theoretical — most people have actually been here.',
      tensions: [
        'Honesty vs kindness',
        'Closeness vs independence',
        'Forgiveness vs self-protection',
      ],
      ctaLabel: 'Start the 3-question relationships path',
      related: ['loyalty', 'morality', 'lifestyle'],
    },
    lifestyle: {
      metaTitle: enTitle('lifestyle'),
      metaDescription:
        'Lifestyle dilemmas — habits, identity, and the small choices that define you. Vote and see how SplitVote splits.',
      intro:
        'Lifestyle dilemmas are the small daily choices that quietly build the person you become. Habits, identity, how you spend a Saturday. None are make-or-break — which is exactly why they say a lot about you.',
      tensions: [
        'Routine vs novelty',
        'Productivity vs rest',
        'Saving vs experiencing',
      ],
      ctaLabel: 'Start the 3-question lifestyle path',
      related: ['relationships', 'technology', 'society'],
    },
  },

  it: {
    morality: {
      metaTitle: itTitle('morality'),
      metaDescription:
        'Dilemmi morali classici — scelte in cui ogni opzione ha un costo. Vota e scopri come si divide SplitVote.',
      intro:
        'I dilemmi morali classici — scelte in cui ogni opzione ha un costo. Tirare la leva o restare fermi. Dire una bugia gentile o la verità che fa male. Vota e scopri come si dividono i votanti su SplitVote.',
      tensions: [
        'Fare del male vs lasciare che accada',
        'Seguire un principio vs ridurre la sofferenza',
        'Trattare le persone come fini vs come mezzi',
      ],
      ctaLabel: 'Inizia il percorso da 3 domande di moralità',
      related: ['justice', 'loyalty', 'survival'],
    },
    survival: {
      metaTitle: itTitle('survival'),
      metaDescription:
        'Dilemmi di sopravvivenza — ogni scelta ha un costo. Vota e scopri come si divide SplitVote.',
      intro:
        'I dilemmi di sopravvivenza ti chiedono di pesare una vita contro un’altra quando non c’è una risposta pulita. Riducono l’etica a una sola domanda: tu cosa faresti davvero quando tutto costa qualcosa?',
      tensions: [
        'Salvare i molti vs salvare l’uno',
        'Salvarsi vs dovere verso gli altri',
        'Agire subito vs aspettare più informazioni',
      ],
      ctaLabel: 'Inizia il percorso da 3 domande di sopravvivenza',
      related: ['morality', 'justice', 'society'],
    },
    loyalty: {
      metaTitle: itTitle('loyalty'),
      metaDescription:
        'Dilemmi di lealtà — quando onestà e amore si scontrano. Vota e scopri come si divide SplitVote.',
      intro:
        'I dilemmi di lealtà mettono alla prova dove sono davvero le tue fedeltà. Coprire un amico o dire la verità. Tacere o parlare. Vota e scopri come SplitVote si divide tra legame e coscienza.',
      tensions: [
        'Proteggere chi ami vs dire la verità',
        'Lealtà a una persona vs a un principio',
        'Perdonare vs allontanarsi',
      ],
      ctaLabel: 'Inizia il percorso da 3 domande di lealtà',
      related: ['relationships', 'morality', 'justice'],
    },
    justice: {
      metaTitle: itTitle('justice'),
      metaDescription:
        'Dilemmi di giustizia — legge, equità e zone grigie. Vota e scopri come si divide SplitVote.',
      intro:
        'I dilemmi di giustizia vivono nel divario tra ciò che è legale e ciò che sembra giusto. Punire o riabilitare. Seguire la regola o infrangerla per la persona giusta. Vota e guarda come si divide SplitVote.',
      tensions: [
        'La lettera della legge vs lo spirito della legge',
        'Punizione vs riabilitazione',
        'Regole uguali per tutti vs eccezioni difendibili',
      ],
      ctaLabel: 'Inizia il percorso da 3 domande di giustizia',
      related: ['society', 'morality', 'freedom'],
    },
    freedom: {
      metaTitle: itTitle('freedom'),
      metaDescription:
        'Dilemmi su libertà e sicurezza — dove tracci il confine? Vota e scopri come si divide SplitVote.',
      intro:
        'I dilemmi sulla libertà impongono un compromesso tra libertà personale e sicurezza collettiva. Quanta privacy per quanta sicurezza. Dove tracci il confine — e chi decide?',
      tensions: [
        'Libertà personale vs sicurezza collettiva',
        'Privacy vs trasparenza',
        'Autonomia ora vs protezione dopo',
      ],
      ctaLabel: 'Inizia il percorso da 3 domande di libertà',
      related: ['society', 'justice', 'technology'],
    },
    technology: {
      metaTitle: itTitle('technology'),
      metaDescription:
        'Dilemmi etici su tecnologia e IA — il futuro è già complicato. Vota e scopri come si divide SplitVote.',
      intro:
        'I dilemmi tecnologici sono domande etiche che fino a ieri non dovevamo affrontare. IA, editing genetico, sorveglianza. Strumenti nuovi rimettono in gioco domande vecchie in modi completamente nuovi.',
      tensions: [
        'Velocità del progresso vs tempo per discuterne',
        'Comodità vs privacy',
        'Cosa possiamo costruire vs cosa dovremmo costruire',
      ],
      ctaLabel: 'Inizia il percorso da 3 domande di tecnologia',
      related: ['freedom', 'society', 'morality'],
    },
    society: {
      metaTitle: itTitle('society'),
      metaDescription:
        'Dilemmi sulla società — disuguaglianza, confini, politiche. Vota e scopri come si divide SplitVote.',
      intro:
        'I dilemmi sulla società riguardano come viviamo insieme. Chi ottiene cosa, chi decide, chi paga. Stanno sotto a ogni dibattito politico — e SplitVote mostra dove l’opinione si divide davvero.',
      tensions: [
        'Scelta individuale vs regola collettiva',
        'Uguaglianza di risultato vs di opportunità',
        'Aiutare ora vs sistemi sostenibili',
      ],
      ctaLabel: 'Inizia il percorso da 3 domande sulla società',
      related: ['justice', 'freedom', 'technology'],
    },
    relationships: {
      metaTitle: itTitle('relationships'),
      metaDescription:
        'Dilemmi sulle relazioni — amore, lealtà e scelte impossibili. Vota e scopri come si divide SplitVote.',
      intro:
        'I dilemmi sulle relazioni diventano personali in fretta. Onestà o gentilezza. Vicinanza o distanza. I compromessi non sono teorici — molti li hanno vissuti davvero.',
      tensions: [
        'Onestà vs gentilezza',
        'Vicinanza vs indipendenza',
        'Perdono vs autoprotezione',
      ],
      ctaLabel: 'Inizia il percorso da 3 domande sulle relazioni',
      related: ['loyalty', 'morality', 'lifestyle'],
    },
    lifestyle: {
      metaTitle: itTitle('lifestyle'),
      metaDescription:
        'Dilemmi sullo stile di vita — abitudini, identità, piccole scelte quotidiane. Vota e scopri come si divide SplitVote.',
      intro:
        'I dilemmi sullo stile di vita sono le piccole scelte quotidiane che costruiscono in silenzio la persona che diventi. Abitudini, identità, come passi un sabato. Nessuna è decisiva — ed è proprio per questo che dicono molto di te.',
      tensions: [
        'Routine vs novità',
        'Produttività vs riposo',
        'Risparmio vs esperienze',
      ],
      ctaLabel: 'Inizia il percorso da 3 domande sullo stile di vita',
      related: ['relationships', 'technology', 'society'],
    },
  },
}

export function getCategoryHubCopy(category: Category, locale: HubLocale): CategoryHubCopy {
  return HUB[locale][category] ?? HUB[locale].morality
}

export function getCategoryLabel(category: Category, locale: HubLocale): string {
  return locale === 'it' ? IT_LABEL[category] : EN_LABEL[category]
}

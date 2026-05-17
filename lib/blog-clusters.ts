/**
 * lib/blog-clusters.ts — topology for the 4 SEO cluster hub pages.
 *
 * Each cluster is a curated entry point that links to (a) the blog
 * articles inside the topic and (b) the live dilemma categories that
 * map to it. Hubs only ship when they have 3+ meaningful articles and
 * 3+ matching live dilemmas — the 4 hubs below were validated against
 * the catalogue by the blog-seo-editor audit (2026-05-17). Bioethics
 * (2 articles only) and Relationships (loose fit) were intentionally
 * rejected to avoid thin pages.
 *
 * Routes:
 *   EN: /blog/topics/[slug]      handled by app/blog/topics/[slug]/page.tsx
 *   IT: /it/blog/temi/[slug]     handled by app/it/blog/temi/[slug]/page.tsx
 *
 * Adding a hub: append an entry below and the dynamic route + sitemap
 * pick it up automatically. Removing one needs a sitemap purge to
 * avoid 404 churn in Search Console.
 */

import type { Category } from './scenarios'

export type ClusterId =
  | 'moral-dilemmas'
  | 'moral-psychology'
  | 'ai-ethics'
  | 'society-public-trust'

export interface ClusterDef {
  id: ClusterId
  /** URL slug — EN uses id verbatim, IT uses slugIt. */
  slug: { en: string; it: string }
  /** Page metadata. */
  title: { en: string; it: string }
  description: { en: string; it: string }
  /** Hero intro (~120-180 words). Not a list — real prose. */
  intro: { en: string; it: string }
  /** Verified blog post slugs that belong to this cluster, per locale. */
  articleSlugs: { en: string[]; it: string[] }
  /** Live dilemma categories most relevant to this hub. */
  scenarioCategories: Category[]
}

export const CLUSTERS: ClusterDef[] = [
  {
    id: 'moral-dilemmas',
    slug: { en: 'moral-dilemmas', it: 'dilemmi-morali' },
    title: {
      en: 'Moral Dilemmas',
      it: 'Dilemmi Morali',
    },
    description: {
      en: 'The classic and contemporary moral dilemmas philosophers and ordinary people argue about — the trolley problem, would-you-rather scenarios, loyalty vs. honesty, doing vs. allowing harm. Read the theory, then vote.',
      it: 'I dilemmi morali classici e contemporanei su cui discutono filosofi e persone comuni — il problema del carrello, le scelte impossibili, lealtà contro onestà, agire contro lasciare accadere. Leggi la teoria, poi vota.',
    },
    intro: {
      en: 'A moral dilemma is a situation where every available option violates a moral commitment you genuinely hold. The interest is not "which option is right" — it\'s why you feel torn at all. The pieces below cover the canonical thought experiments (trolley, footbridge, doing vs. allowing), the everyday dilemmas that mostly never get philosophical labels, and what actual vote data reveals when millions of people face the same scenario. After each article you can vote on the live dilemmas linked at the bottom — your choice gets counted alongside the rest of the world\'s.',
      it: 'Un dilemma morale è una situazione in cui ogni opzione disponibile viola un impegno morale che hai davvero. L\'interesse non è "quale opzione è giusta" — è perché ti senti diviso. Gli articoli qui sotto coprono gli esperimenti mentali canonici (carrello, ponte, agire contro permettere), i dilemmi quotidiani che spesso non ricevono etichette filosofiche, e cosa rivelano i dati reali quando milioni di persone affrontano lo stesso scenario. Dopo ogni articolo puoi votare sui dilemmi live linkati in fondo — la tua scelta viene contata insieme al resto del mondo.',
    },
    articleSlugs: {
      en: [
        'what-is-a-moral-dilemma',
        'trolley-problem-explained',
        'trolley-problem-statistics',
        'moral-dilemmas-examples',
        'ethical-dilemmas-everyday-life',
        'hard-would-you-rather-questions',
        'loyalty-vs-honesty-when-they-collide',
        'doing-vs-allowing-harm',
      ],
      it: [
        'cos-e-un-dilemma-morale',
        'problema-del-carrello-spiegato',
        'statistiche-problema-del-carrello',
        'dilemmi-morali-esempi',
        'dilemma-etico-vita-quotidiana',
        'domande-would-you-rather-difficili',
        'lealta-vs-onesta-quando-si-scontrano',
        'causare-vs-permettere-danno',
      ],
    },
    scenarioCategories: ['morality', 'justice', 'loyalty'],
  },

  {
    id: 'moral-psychology',
    slug: { en: 'moral-psychology', it: 'psicologia-morale' },
    title: {
      en: 'Moral Psychology',
      it: 'Psicologia Morale',
    },
    description: {
      en: 'How the brain actually arrives at a moral judgement — moral foundations, gut emotions, the bystander effect, moral injury, why decent people disagree. Research-grounded reads, with live dilemmas to test the theories against your own choices.',
      it: 'Come il cervello arriva davvero a un giudizio morale — fondamenti morali, emozioni di pancia, effetto spettatore, ferita morale, perché persone integre si dividono. Letture basate sulla ricerca, con dilemmi live per testare le teorie sulle tue scelte.',
    },
    intro: {
      en: 'Moral psychology asks a different question than ethics: not "what is right" but "what do humans actually do, and why." The field draws on experiments — fMRI studies, dual-process models, moral foundations theory, the bystander work — to show that intuition usually leads, and reasoning often arrives later to justify it. The articles below cover the major research strands: where moral emotions come from, why our political tribes weight values so differently, why diffusion of responsibility freezes most of us in a crowd, and the cost of acting against your own values when you had no other option. Read, then vote — and see whether the data matches the theory in your own case.',
      it: 'La psicologia morale fa una domanda diversa dall\'etica: non "cosa è giusto" ma "cosa fanno davvero gli esseri umani, e perché". Il campo si basa su esperimenti — studi fMRI, modelli a doppio processo, teoria dei fondamenti morali, il lavoro sull\'effetto spettatore — per mostrare che l\'intuizione di solito guida, e la ragione arriva spesso dopo a giustificarla. Gli articoli qui sotto coprono i principali filoni di ricerca: da dove vengono le emozioni morali, perché le nostre tribù politiche pesano i valori in modo così diverso, perché la diffusione della responsabilità ci paralizza in una folla, e il costo di agire contro i propri valori quando non c\'erano alternative. Leggi, poi vota — e vedi se i dati confermano la teoria nel tuo caso.',
    },
    articleSlugs: {
      en: [
        'moral-foundations-theory-why-good-people-disagree',
        'experimental-moral-psychology-how-science-studies-moral-intuitions',
        'why-we-disagree-on-ethics',
        'why-good-people-do-nothing',
        'bystander-effect-and-moral-responsibility',
        'moral-emotions-gut-feeling-moral-compass',
        'free-will-and-moral-responsibility',
        'trolley-problem-moral-personality',
        'moral-injury-when-values-break',
        'why-people-love-impossible-choices',
        'what-your-moral-personality-means',
      ],
      it: [
        'teoria-fondamenti-morali',
        'psicologia-morale-sperimentale-come-la-scienza-studia-le-intuizioni-morali',
        'perche-non-siamo-daccordo-sull-etica',
        'perche-le-persone-buone-non-fanno-nulla',
        'effetto-spettatore-e-responsabilita-morale',
        'emozioni-morali-istinto-bussola-morale',
        'libero-arbitrio-e-responsabilita-morale',
        'problema-tram-personalita-morale',
        'ferita-morale-quando-i-valori-si-spezzano',
        'perche-ci-piacciono-le-scelte-impossibili',
        'cosa-significa-la-tua-personalita-morale',
      ],
    },
    scenarioCategories: ['morality', 'society'],
  },

  {
    id: 'ai-ethics',
    slug: { en: 'ai-ethics', it: 'etica-ai' },
    title: {
      en: 'AI Ethics',
      it: 'Etica dell\'IA',
    },
    description: {
      en: 'How AI systems force old ethical questions into new shapes — the self-driving car version of the trolley problem, who pays for surveillance, what frontier labs are quietly deciding for the rest of us. Read the analysis, vote on the live AI ethics dilemmas.',
      it: 'Come i sistemi di IA costringono vecchie domande etiche in forme nuove — la versione auto a guida autonoma del problema del carrello, chi paga la sorveglianza, cosa stanno silenziosamente decidendo i laboratori di frontiera per il resto di noi. Leggi l\'analisi, vota sui dilemmi live di etica IA.',
    },
    intro: {
      en: 'AI ethics is moral philosophy under deadline pressure. The classic trolley problem became urgent the moment Mercedes-Benz had to write the priority logic for a real autonomous vehicle. Privacy, consent, and the right to be opaque became live legal questions the day a recommendation system started predicting your choices better than you do. The articles below cover what 40 million votes on the MIT Moral Machine actually showed about cross-cultural value differences, why "anonymous" public voting is harder than it sounds, and what frontier labs are quietly choosing when they build safety guardrails. Then you vote — and the results contribute to the same kind of dataset researchers cite.',
      it: 'L\'etica dell\'IA è filosofia morale sotto pressione di scadenza. Il classico problema del carrello è diventato urgente nel momento in cui Mercedes-Benz ha dovuto scrivere la logica di priorità per un veicolo autonomo reale. Privacy, consenso e diritto all\'opacità sono diventati questioni legali vive il giorno in cui un sistema di raccomandazione ha iniziato a prevedere le tue scelte meglio di te. Gli articoli qui sotto coprono cosa hanno davvero mostrato 40 milioni di voti sul MIT Moral Machine sulle differenze di valore tra culture, perché il voto pubblico "anonimo" è più difficile di quanto sembri, e cosa stanno silenziosamente scegliendo i laboratori di frontiera quando costruiscono guardrail di sicurezza. Poi voti tu — e i risultati contribuiscono allo stesso tipo di dataset che i ricercatori citano.',
    },
    articleSlugs: {
      en: [
        'ai-ethics-what-40-million-people-chose',
        'frontier-ai-guardrails-ethical-dilemmas',
        'privacy-in-public-voting',
      ],
      it: [
        'ia-etica-40-milioni-scelte',
        'guardrail-ai-frontiera-dilemmi-etici',
        'privacy-nel-voto-pubblico',
      ],
    },
    scenarioCategories: ['technology'],
  },

  {
    id: 'society-public-trust',
    slug: { en: 'society-public-trust', it: 'societa-fiducia' },
    title: {
      en: 'Society & Public Trust',
      it: 'Società e Fiducia Pubblica',
    },
    description: {
      en: 'When private values meet the public square — why decent people stay silent, how moral foundations fracture political coalitions, what surveillance does to trust, the cost of betraying your own values to fit in. Read, then vote on dilemmas that test the same fault lines.',
      it: 'Quando i valori privati incontrano la piazza pubblica — perché le persone integre tacciono, come i fondamenti morali fratturano le coalizioni politiche, cosa fa la sorveglianza alla fiducia, il costo di tradire i propri valori per integrarsi. Leggi, poi vota su dilemmi che mettono alla prova le stesse linee di frattura.',
    },
    intro: {
      en: 'Public trust depends on a small number of psychological switches: do I think the system would do the same for me, do my values map onto the people in charge, is anyone watching me, would my neighbours come to my defence. The pieces in this hub trace the research behind each switch — Haidt and Graham\'s moral foundations work on why coalitions fracture along the same predictable lines, the bystander research on diffusion of responsibility, what happens to a vote when it stops being secret, and the moral injury that compounds when a system asks you to act against your values. The live dilemmas at the bottom test the same patterns at the individual level.',
      it: 'La fiducia pubblica dipende da un piccolo numero di interruttori psicologici: penso che il sistema farebbe lo stesso per me, i miei valori coincidono con quelli di chi comanda, qualcuno mi sta guardando, i miei vicini verrebbero in mia difesa. I pezzi in questo hub tracciano la ricerca dietro ogni interruttore — il lavoro di Haidt e Graham sui fondamenti morali e sul perché le coalizioni si fratturano lungo le stesse linee prevedibili, la ricerca sull\'effetto spettatore e la diffusione della responsabilità, cosa succede a un voto quando smette di essere segreto, e la ferita morale che si accumula quando un sistema ti chiede di agire contro i tuoi valori. I dilemmi live in fondo testano gli stessi pattern a livello individuale.',
    },
    articleSlugs: {
      en: [
        'privacy-in-public-voting',
        'bystander-effect-and-moral-responsibility',
        'why-good-people-do-nothing',
        'moral-foundations-theory-why-good-people-disagree',
        'moral-injury-when-values-break',
      ],
      it: [
        'privacy-nel-voto-pubblico',
        'effetto-spettatore-e-responsabilita-morale',
        'perche-le-persone-buone-non-fanno-nulla',
        'teoria-fondamenti-morali',
        'ferita-morale-quando-i-valori-si-spezzano',
      ],
    },
    scenarioCategories: ['society', 'loyalty'],
  },
]

export function getClusterBySlug(slug: string, locale: 'en' | 'it'): ClusterDef | undefined {
  return CLUSTERS.find((c) => c.slug[locale] === slug)
}

/** All cluster slugs for a locale — used by generateStaticParams + sitemap. */
export function getAllClusterSlugs(locale: 'en' | 'it'): string[] {
  return CLUSTERS.map((c) => c.slug[locale])
}

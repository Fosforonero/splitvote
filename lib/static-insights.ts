import type { DynamicExpertInsight } from '@/lib/expert-insights'

// Per-id post-vote insight overrides for the 5 pilot static dilemmas
// rewritten in DILEMMA-STATIC-41-REWRITE-PILOT-01. Same override shape as
// DynamicScenario.expertInsightEn/expertInsightIt — merged into the
// category-level fallback inside ResultsClientPage. Adding an id here is
// safe: missing ids fall through to the existing category insight.

type LocaleInsight = { en: DynamicExpertInsight; it: DynamicExpertInsight }

const STATIC_INSIGHTS: Record<string, LocaleInsight> = {
  'rich-or-fair': {
    en: {
      body: "This isn't a vote about whether inequality matters — almost everyone agrees it does. It's a vote about which lever is legitimate. The math here is symmetric: same total wealth, just redistributed. So the disagreement is purely about whether the state may target some incomes to lift others, even when the affected group remains comfortably well-off.",
      whyPeopleSplit: "Procedural-fairness intuitions and outcome-fairness intuitions diverge here. A person can fully agree that the bottom 20% need more and still resist a mechanism that singles out a specific group. Another can think the principle of non-targeting matters less than the concentration it leaves in place. Neither position is hidden indifference.",
      whatYourAnswerMaySuggest: {
        a: "You may weight outcomes over the act that produced them. The redistribution result matters more to you than the principle that a tax shouldn't pick a specific population to draw from.",
        b: "You may weight the process more than the outcome. Once a state targets one group on income criteria, you don't trust where the next line gets drawn — even when this specific line passes a math check.",
      },
    },
    it: {
      body: "Non è un voto sull'esistenza della disuguaglianza — quella la riconoscono quasi tutti. È un voto su quale leva sia legittima. Qui i conti sono simmetrici: la ricchezza totale resta la stessa, cambia solo la distribuzione. Il disaccordo riguarda solo se lo Stato possa colpire alcuni redditi per alzarne altri, anche quando chi paga resta tranquillamente benestante.",
      whyPeopleSplit: "Le intuizioni di equità procedurale e di equità degli esiti divergono qui. Una persona può essere d'accordo che il 20% più povero abbia bisogno di più e resistere comunque a un meccanismo che isola un gruppo specifico. Un'altra può ritenere che il principio del non-bersaglio conti meno della concentrazione che lascia in piedi. Nessuna delle due posizioni nasconde indifferenza.",
      whatYourAnswerMaySuggest: {
        a: "Potresti pesare di più gli esiti rispetto al gesto che li produce. Il risultato della redistribuzione conta più del principio che una tassa non dovrebbe scegliere su quale popolazione attingere.",
        b: "Potresti pesare di più il processo dell'esito. Una volta che lo Stato colpisce un gruppo in base al reddito, non ti fidi di dove sarà tracciata la prossima linea — anche quando questa specifica linea torna nei conti.",
      },
    },
  },

  'robot-judge': {
    en: {
      body: "Two ideas of fairness collide here: equality-of-treatment (similar cases get similar sentences) and reason-giving (the system can tell you why). Human judges fail the first regularly — implicit bias, fatigue, the order cases are heard — but pass the second by default. An opaque AI flips both. The dilemma is which failure mode you tolerate.",
      whyPeopleSplit: "This is a substantive disagreement about what justice is for. People who answer A think of justice as a quality-control problem — the system should produce consistent outputs. People who answer B think of justice as a relationship between the state and the person being sentenced — accountability requires that someone can explain the decision to the person it affects.",
      whatYourAnswerMaySuggest: {
        a: "You may treat the legal system as an output-producing machine that should produce equal results for equal inputs. Consistency, once you accept it as a primary good, makes the explainability gap a cost worth paying.",
        b: "You may treat sentencing as something that has to be addressed to a person. The right to be told why is not an extra you can trade for accuracy — it's part of what makes the verdict legitimate at all.",
      },
    },
    it: {
      body: "Due idee di giustizia si scontrano qui: parità di trattamento (casi simili ricevono pene simili) e motivazione (il sistema può dirti perché). I giudici umani falliscono la prima regolarmente — pregiudizi impliciti, stanchezza, ordine in cui i casi vengono ascoltati — ma passano la seconda per default. Un'IA opaca ribalta entrambe. Il dilemma è quale modalità di fallimento sei disposto a tollerare.",
      whyPeopleSplit: "È un disaccordo sostanziale su cosa serva la giustizia. Chi sceglie A pensa alla giustizia come a un problema di controllo qualità — il sistema dovrebbe produrre output coerenti. Chi sceglie B pensa alla giustizia come a una relazione fra Stato e persona condannata — la responsabilità richiede che qualcuno possa spiegare la decisione a chi la subisce.",
      whatYourAnswerMaySuggest: {
        a: "Potresti vedere il sistema giudiziario come una macchina di output che dovrebbe restituire risultati uguali per ingressi uguali. Una volta accettata la coerenza come bene primario, il deficit di spiegabilità diventa un costo accettabile.",
        b: "Potresti vedere la pena come qualcosa che va rivolta a una persona. Il diritto di sapere perché non è un extra negoziabile in cambio di accuratezza — è parte di ciò che rende la sentenza legittima a monte.",
      },
    },
  },

  'censor-speech': {
    en: {
      body: "This isn't a vote on whether the politician's claims are good — both options assume they're false and harmful. It's a vote on who should hold the lever that silences amplification. Option A treats platforms as private moderators that don't owe equal access; option B accepts that the same lever, once normalised, gets used in cases that look very different from this one.",
      whyPeopleSplit: "Both sides agree harm matters. They disagree about who is best positioned to decide what counts as enough harm to silence speech. One side trusts platform accountability — they bear reputational risk and respond to public pressure. The other distrusts any actor, corporate or state, given a discretionary power over which speech reaches which audience.",
      whatYourAnswerMaySuggest: {
        a: "You may see free-speech protection as a constraint on government, not a guarantee of platform reach. Voluntary platform moderation, even at scale, is part of how speech competes for an audience — not a violation of the right to speak.",
        b: "You may worry less about this specific case than about the precedent. The case for banning here is unusually strong; the next case the rule gets applied to will probably be weaker, harder, and the public won't notice it the same way.",
      },
    },
    it: {
      body: "Non è un voto sulla qualità delle affermazioni del politico — entrambe le opzioni le danno per false e dannose. È un voto su chi debba avere la leva che spegne l'amplificazione. L'opzione A tratta le piattaforme come moderatori privati che non devono accesso uguale a tutti; l'opzione B accetta che la stessa leva, una volta normalizzata, finirà per essere usata in casi che assomigliano poco a questo.",
      whyPeopleSplit: "Entrambe le posizioni concordano che il danno conta. Disaccordano su chi sia in posizione migliore per decidere quanto danno sia abbastanza per spegnere una voce. Una parte si fida della responsabilità delle piattaforme — rischio reputazionale, reazione alla pressione pubblica. L'altra non si fida di nessun attore, aziendale o statale, a cui venga dato un potere discrezionale su quali parole arrivino a quale pubblico.",
      whatYourAnswerMaySuggest: {
        a: "Potresti vedere la protezione della libertà di parola come un vincolo per il governo, non come una garanzia di portata sulla piattaforma. La moderazione volontaria, anche su larga scala, fa parte di come le parole competono per un pubblico — non viola il diritto di parlare.",
        b: "Potresti preoccuparti meno di questo caso specifico e più del precedente. Le ragioni per il ban qui sono insolitamente forti; il prossimo caso a cui la regola si applicherà sarà probabilmente più debole, più sfumato, e il pubblico non lo noterà allo stesso modo.",
      },
    },
  },

  'deepfake-expose': {
    en: {
      body: "This is a dilemma about means and ends with a twist: you don't even know if the ends are good. Releasing a fake video might trigger a real investigation, but it also commits you to an act that's wrong on its own terms — fabricated evidence — regardless of what the investigation finds. The question is whether the gamble on outcome justifies the certain act.",
      whyPeopleSplit: "This splits people along consequentialist vs. deontological lines, with an epistemic twist. One side weighs the expected good the leak might do; the other refuses to treat their own action's morality as conditional on a result they cannot guarantee. The closer you are to working with evidence, journalism or law, the more the deontological intuition tends to dominate.",
      whatYourAnswerMaySuggest: {
        a: "You may believe systems eventually self-correct — a real investigation will sift truth from forgery, and the net effect of forcing scrutiny is better than letting suspected wrongdoing rest. The fake is a trigger, not the final claim.",
        b: "You may believe an act is wrong as soon as you commit it, not when its consequences are known. Even if the politician turns out to be guilty, you'd have manufactured a falsehood to get there — and that act has its own moral weight regardless of where the investigation ends up.",
      },
    },
    it: {
      body: "È un dilemma su mezzi e fini con un colpo di scena: non sai nemmeno se i fini siano buoni. Pubblicare un video falso potrebbe innescare un'inchiesta vera, ma ti impegna anche in un atto sbagliato in sé — falsificare prove — indipendentemente da come finisca l'inchiesta. La domanda è se la scommessa sull'esito giustifichi l'atto certo.",
      whyPeopleSplit: "Qui le persone si dividono fra intuizioni consequenzialiste e deontologiche, con una variante epistemica. Una parte pesa il bene atteso che la fuga potrebbe produrre; l'altra rifiuta di rendere la moralità del proprio gesto condizionata a un risultato che non può garantire. Più si lavora con prove, giornalismo o diritto, più l'intuizione deontologica tende a prevalere.",
      whatYourAnswerMaySuggest: {
        a: "Potresti credere che i sistemi alla fine si autocorreggano — un'inchiesta vera distinguerà la verità dal falso, e l'effetto netto del forzare l'esame è migliore del lasciare un sospetto in pace. Il falso è un innesco, non la pretesa finale.",
        b: "Potresti credere che un atto sia sbagliato nel momento in cui lo commetti, non quando se ne conoscono le conseguenze. Anche se il politico risultasse colpevole, avresti fabbricato una menzogna per arrivarci — e quel gesto ha un suo peso morale indipendente da dove finisce l'inchiesta.",
      },
    },
  },

  'prison-abolition': {
    en: {
      body: "This is a dilemma about whether a sentence is meant to end. Option A holds that 'paid' means paid in full — anything beyond the official punishment is unofficial extra-judicial punishment with no termination clause. Option B holds that the surrounding community has its own claim independent of the offender's debt — they didn't choose the risk, and disclosure lets them protect themselves.",
      whyPeopleSplit: "This isn't a fight between rehabilitation belief and retribution belief, the way the old framing suggested. It's a clash between two competing rights: the offender's right to a fresh start and the neighbour's right to informed consent over their own safety. Most ethical frameworks recognise both — they just rank them differently.",
      whatYourAnswerMaySuggest: {
        a: "You may treat the completed sentence as a closed transaction. Lifelong disclosure turns punishment into a permanent stain that has no theoretical endpoint and tends to push people back toward the only environments they came from.",
        b: "You may treat your community's right to know as separate from any judgement of the offender. They've paid the state, but they haven't paid the people who'll now live around them — and those people have a stake in the risk they didn't sign up for.",
      },
    },
    it: {
      body: "È un dilemma sul fatto che una pena debba davvero finire. L'opzione A sostiene che 'scontata' vuol dire scontata fino in fondo — qualunque cosa in più rispetto alla punizione ufficiale è una pena extragiudiziale informale senza clausola di chiusura. L'opzione B sostiene che la comunità intorno ha una pretesa propria, indipendente dal debito del condannato — quel rischio non l'ha scelto, e l'informazione le permette di proteggersi.",
      whyPeopleSplit: "Non è una battaglia fra chi crede nella riabilitazione e chi nella punizione, come suggeriva la vecchia formulazione. È uno scontro fra due rivendicazioni concorrenti: il diritto di chi ha scontato la pena a ricominciare, e il diritto di chi vive vicino al consenso informato sulla propria sicurezza. Quasi tutte le cornici etiche riconoscono entrambi — solo li ordinano in modo diverso.",
      whatYourAnswerMaySuggest: {
        a: "Potresti trattare la pena scontata come una transazione chiusa. La divulgazione a vita trasforma la punizione in un marchio permanente, che non ha un punto teorico di fine e tende a respingere le persone solo verso gli ambienti da cui erano partite.",
        b: "Potresti vedere il diritto a sapere della tua comunità come separato da qualunque giudizio sulla persona condannata. Ha pagato lo Stato, ma non ha pagato chi le vivrà vicino — e quelle persone hanno una posta in gioco rispetto a un rischio che non hanno firmato.",
      },
    },
  },
}

export function getStaticInsight(id: string, locale: 'en' | 'it'): DynamicExpertInsight | undefined {
  return STATIC_INSIGHTS[id]?.[locale]
}

export function hasStaticInsight(id: string): boolean {
  return id in STATIC_INSIGHTS
}

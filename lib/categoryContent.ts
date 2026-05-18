export interface CategoryFaq {
  q: string
  a: string
}

export interface CategoryEditorial {
  editorial: string
  faqHeading: string
  faq: CategoryFaq[]
}

type Locale = 'en' | 'it'
type CategoryKey = 'morality' | 'survival' | 'loyalty' | 'justice' | 'freedom' | 'technology' | 'society' | 'relationships' | 'lifestyle'

const CONTENT: Record<Locale, Record<CategoryKey, CategoryEditorial>> = {
  en: {
    morality: {
      editorial:
        'Moral dilemmas have no objectively correct answers — they reveal the ethical framework you actually operate by. Utilitarians, deontologists, and virtue ethicists reach opposite conclusions from the same scenario. These questions don\'t test what you should do: they test what you would do.',
      faqHeading: 'About morality dilemmas',
      faq: [
        {
          q: 'Is there a right answer to a moral dilemma?',
          a: 'No. Philosophers use these scenarios to show that different ethical frameworks — utilitarianism, deontology, virtue ethics — lead to opposite conclusions from identical facts.',
        },
        {
          q: 'Why do some dilemmas split people almost 50/50?',
          a: 'When a question pits two genuine values against each other (fairness vs care, individual vs collective good), neither side is irrational — and the world reflects that.',
        },
        {
          q: "What's the trolley problem?",
          a: 'A runaway trolley is heading toward 5 people. You can pull a lever to divert it, but 1 person is on the other track. It\'s the most studied thought experiment in moral philosophy — and it\'s on SplitVote.',
        },
      ],
    },
    survival: {
      editorial:
        'Survival dilemmas strip ethics down to its most brutal form: when every option causes harm, which harm do you choose? These scenarios test whether your moral instincts hold up under pressure — or collapse into pure self-preservation.',
      faqHeading: 'About survival dilemmas',
      faq: [
        {
          q: 'Why do survival dilemmas feel different from other moral questions?',
          a: "Because stakes are absolute. When the choice involves life or death, abstract principles get replaced by instinct — and the gap between what people say they'd do and what they'd actually do widens.",
        },
        {
          q: 'Is it morally acceptable to sacrifice one person to save many?',
          a: "Utilitarianism says yes. Deontology often says no — people aren't means to an end. Survival dilemmas exist precisely to make that tension visceral.",
        },
        {
          q: 'Do answers vary a lot across cultures?',
          a: "Context and framing consistently matter more than assumptions based on nationality. How a question is posed — who is endangered, what is at stake, who must act — shifts answers more than cultural background alone.",
        },
      ],
    },
    loyalty: {
      editorial:
        'Loyalty dilemmas ask where your allegiances really lie — and what you\'re willing to sacrifice to honor them. When honesty collides with protection, when duty to a friend conflicts with duty to the truth, there are no clean choices.',
      faqHeading: 'About loyalty dilemmas',
      faq: [
        {
          q: 'Is loyalty always a virtue?',
          a: "Not in every ethical framework. Blind loyalty can enable harmful behavior. Most dilemmas in this category test where unconditional loyalty ends and moral responsibility begins.",
        },
        {
          q: "What's the difference between loyalty and complicity?",
          a: "That's exactly what these dilemmas probe. Staying silent to protect someone you love can slide into enabling wrongdoing — the line is genuinely ambiguous, and the world splits on it.",
        },
        {
          q: 'Why do loyalty dilemmas often involve betrayal?',
          a: "Because loyalty is only tested when breaking it would benefit you — or when keeping it would cost you. Easy loyalty isn't a dilemma.",
        },
      ],
    },
    justice: {
      editorial:
        'Justice dilemmas expose the gap between what\'s legal and what\'s fair. Rules are designed for average cases; reality produces edge cases that make even sound laws feel unjust. These questions ask where you draw the line between the letter of the law and the spirit of it.',
      faqHeading: 'About justice dilemmas',
      faq: [
        {
          q: "What's the difference between legal and moral?",
          a: "Laws codify a society's minimum ethical standards. But legal doesn't mean just, and illegal doesn't mean wrong. Justice dilemmas live in that gap.",
        },
        {
          q: 'Is it ever right to break the law?',
          a: "Civil disobedience, whistleblowing, and necessity defenses all rest on the idea that some moral duties can override legal ones. Whether that justification holds — and when — is one of the oldest questions in political philosophy.",
        },
        {
          q: 'Why do people prefer harsh justice in the abstract but leniency in specific cases?',
          a: "Abstract rules feel simpler to apply than concrete cases with names and faces. When a specific person is involved, moral reasoning shifts — which is why scenario-based dilemmas surface different intuitions than policy debates do.",
        },
      ],
    },
    freedom: {
      editorial:
        'Freedom dilemmas force a trade-off: how much individual liberty are you willing to give up for collective security, and who decides? Privacy vs surveillance, autonomy vs protection — these questions have no comfortable answers in any political tradition.',
      faqHeading: 'About freedom dilemmas',
      faq: [
        {
          q: 'Is freedom absolute or always conditional?',
          a: "John Stuart Mill's harm principle is the classic answer: your freedom ends where it harms others. But who counts as harmed, and how much, is where the real disagreement lives.",
        },
        {
          q: 'Why do freedom dilemmas so often involve surveillance?',
          a: "Because surveillance is the modern trade-off: more data, more control, more safety — but at a cost to privacy and autonomy. The technology makes the question unavoidable.",
        },
        {
          q: 'Do people across different countries answer freedom dilemmas the same way?',
          a: "Not uniformly. Historical context, political tradition, and lived experience all shape how people weigh individual liberty against collective safety. These dilemmas surface that variation directly.",
        },
      ],
    },
    technology: {
      editorial:
        "Technology dilemmas are moral philosophy's newest frontier: AI alignment, genetic engineering, surveillance capitalism, digital privacy. These questions didn't exist a generation ago — and no existing ethical framework was designed to handle them.",
      faqHeading: 'About technology dilemmas',
      faq: [
        {
          q: 'Can AI make ethical decisions?',
          a: "Current AI systems optimize for objectives — and those objectives may not map to human values. Technology dilemmas often expose what happens when efficiency is mistaken for ethics.",
        },
        {
          q: 'Is it wrong to design babies with specific traits?',
          a: "That depends on your framework. Utilitarians might say suffering-prevention justifies it; deontologists worry about treating children as products; disability advocates raise different objections. The debate is active and unresolved.",
        },
        {
          q: 'Why do tech dilemmas feel more urgent than classic moral philosophy?',
          a: "Because the timeline is compressed. A technology trolley problem isn't hypothetical — the policy decisions are being made now, often without public deliberation.",
        },
      ],
    },
    society: {
      editorial:
        'Society dilemmas ask how we should organize collective life — who deserves what, how to distribute scarce resources, where policy should override individual choice. These aren\'t abstract questions: they\'re the debates behind every election, every budget, every border.',
      faqHeading: 'About society dilemmas',
      faq: [
        {
          q: 'Are societal dilemmas political?',
          a: "They touch politics, but they're not partisan. A dilemma about resource allocation or border policy is moral philosophy applied to governance — and people across the political spectrum often split in unexpected ways.",
        },
        {
          q: 'Why do inequality dilemmas tend to generate strong disagreement?',
          a: "Because resource allocation questions involve competing values: fairness, merit, need, and collective good. Where you draw those lines often depends on which tradeoffs you think are acceptable — and reasonable people reach different conclusions.",
        },
        {
          q: 'Can voting on societal dilemmas change your views?',
          a: "They can shift your framing. Encountering a concrete scenario — not a policy abstraction — often reveals that your position is more nuanced than a simple left/right label.",
        },
      ],
    },
    relationships: {
      editorial:
        'Relationship dilemmas get personal: honesty vs kindness, trust vs privacy, love vs self-preservation. These questions don\'t stay hypothetical for long — most people recognize situations they\'ve actually faced or feared.',
      faqHeading: 'About relationship dilemmas',
      faq: [
        {
          q: 'Is radical honesty always better in relationships?',
          a: "Not always. Honesty that causes unnecessary harm without benefit can itself be a failure of care. Most ethical frameworks recognize that candor and kindness can conflict — which is why relationship dilemmas rarely have clean answers.",
        },
        {
          q: 'Why do relationship dilemmas feel more emotionally charged than abstract ones?',
          a: "Because they involve people we care about. When the stakes are personal and emotional, moral reasoning gets harder — not because the principles change, but because the cost of applying them rises sharply.",
        },
        {
          q: 'Do people answer relationship dilemmas differently when they\'re in a relationship?',
          a: "Situational context shapes moral response. Framing the same dilemma from inside a relationship versus outside one changes how the stakes feel — which is why these questions rarely have universal answers.",
        },
      ],
    },
    lifestyle: {
      editorial:
        'Lifestyle dilemmas are the small daily choices that quietly build the person you become — habits, identity, how you spend a Saturday. None of them are make-or-break, which is precisely why they\'re revealing: when nothing forces your hand, the tradeoffs you actually pick say more about your priorities than any high-stakes test could.',
      faqHeading: 'About lifestyle dilemmas',
      faq: [
        {
          q: 'Are lifestyle dilemmas moral dilemmas?',
          a: "Mostly not. Most lifestyle questions are about preferences and tradeoffs, not right vs wrong. The interesting signal is that even low-stakes choices reveal what you actually value when nothing forces your hand.",
        },
        {
          q: 'Why do small preferences matter?',
          a: "Small choices compound. How you spend a Saturday, what you skip to make time for something else, what you tolerate vs trade away — these add up to a life shape that high-stakes decisions just confirm. Identity is built downstream of the small things.",
        },
        {
          q: 'Are these questions meant to be serious?',
          a: "Lighter than the others, on purpose. Lifestyle dilemmas work best as conversation prompts and self-mirrors, not as ethical tests. If a question makes you pause and rethink a routine you\'d never questioned, it\'s done its job.",
        },
      ],
    },
  },

  it: {
    morality: {
      editorial:
        'I dilemmi morali non hanno risposte oggettivamente corrette — rivelano il sistema etico che usi davvero. Utilitaristi, deontologi ed etici della virtù arrivano a conclusioni opposte dallo stesso scenario. Non testano cosa dovresti fare: testano cosa faresti davvero.',
      faqHeading: 'Sui dilemmi di moralità',
      faq: [
        {
          q: "C'è una risposta giusta a un dilemma morale?",
          a: 'No. I filosofi usano questi scenari per dimostrare che diversi sistemi etici — utilitarismo, deontologia, etica della virtù — portano a conclusioni opposte dagli stessi fatti.',
        },
        {
          q: 'Perché certi dilemmi dividono le persone al 50/50?',
          a: 'Quando una domanda contrappone due valori reali (equità vs cura, bene individuale vs collettivo), nessuno dei due lati è irrazionale — e il mondo lo riflette.',
        },
        {
          q: "Cos'è il problema del tram?",
          a: 'Un tram fuori controllo sta per investire 5 persone. Puoi tirare una leva per deviarlo, ma c\'è 1 persona sull\'altro binario. È l\'esperimento mentale più studiato della filosofia morale — ed è su SplitVote.',
        },
      ],
    },
    survival: {
      editorial:
        'I dilemmi di sopravvivenza riducono l\'etica alla sua forma più brutale: quando ogni opzione causa danno, quale danno scegli? Questi scenari testano se i tuoi istinti morali reggono sotto pressione — o cedono alla pura autoconservazione.',
      faqHeading: 'Sui dilemmi di sopravvivenza',
      faq: [
        {
          q: 'Perché i dilemmi di sopravvivenza sembrano diversi dalle altre domande morali?',
          a: "Perché le conseguenze sono assolute. Quando la scelta riguarda la vita o la morte, i principi astratti vengono sostituiti dall'istinto — e la distanza tra ciò che si dice e ciò che si farebbe si allarga.",
        },
        {
          q: 'È moralmente accettabile sacrificare una persona per salvarne molte?',
          a: "L'utilitarismo dice sì. La deontologia spesso dice no — le persone non sono mezzi per un fine. I dilemmi di sopravvivenza esistono proprio per rendere questa tensione viscerale.",
        },
        {
          q: 'Le risposte variano molto tra culture diverse?',
          a: "Il contesto e la formulazione contano più delle assunzioni sulla nazionalità. Il modo in cui viene posta la domanda — chi è in pericolo, cosa è in gioco, chi deve agire — sposta le risposte più del background culturale da solo.",
        },
      ],
    },
    loyalty: {
      editorial:
        'I dilemmi di lealtà chiedono dove si trovano davvero le tue fedeltà — e cosa sei disposto a sacrificare per onorarle. Quando l\'onestà si scontra con la protezione, quando il dovere verso un amico confligge con il dovere verso la verità, non esistono scelte pulite.',
      faqHeading: 'Sui dilemmi di lealtà',
      faq: [
        {
          q: 'La lealtà è sempre una virtù?',
          a: 'Non in ogni sistema etico. La lealtà cieca può abilitare comportamenti dannosi. La maggior parte dei dilemmi in questa categoria testa dove finisce la lealtà incondizionata e inizia la responsabilità morale.',
        },
        {
          q: "Qual è la differenza tra lealtà e complicità?",
          a: "È esattamente quello che questi dilemmi sondano. Tacere per proteggere qualcuno che ami può scivolare nel favorire comportamenti sbagliati — il confine è genuinamente ambiguo, e il mondo si divide su questo.",
        },
        {
          q: 'Perché i dilemmi di lealtà spesso coinvolgono il tradimento?',
          a: "Perché la lealtà viene messa alla prova solo quando romperla ti avvantaggerebbe — o quando mantenerla ti costerebbe qualcosa. La lealtà facile non è un dilemma.",
        },
      ],
    },
    justice: {
      editorial:
        'I dilemmi di giustizia espongono il divario tra ciò che è legale e ciò che è equo. Le regole sono progettate per i casi medi; la realtà produce casi limite che rendono anche le buone leggi ingiuste. Queste domande chiedono dove tracci il confine tra la lettera della legge e il suo spirito.',
      faqHeading: 'Sui dilemmi di giustizia',
      faq: [
        {
          q: "Qual è la differenza tra legale e morale?",
          a: "Le leggi codificano gli standard etici minimi di una società. Ma legale non significa giusto, e illegale non significa sbagliato. I dilemmi di giustizia vivono in quel divario.",
        },
        {
          q: 'È mai giusto infrangere la legge?',
          a: "La disobbedienza civile, il whistleblowing e le difese di necessità si basano sull'idea che alcuni doveri morali possano prevalere su quelli legali. Se e quando questa giustificazione regge è una delle domande più antiche della filosofia politica.",
        },
        {
          q: 'Perché le persone preferiscono la giustizia severa in astratto ma la clemenza nei casi specifici?',
          a: "Le regole astratte sembrano più facili da applicare dei casi concreti con nomi e volti. Quando c'è una persona specifica coinvolta, il ragionamento morale cambia — ed è per questo che i dilemmi scenarizzati fanno emergere intuizioni diverse dai dibattiti politici generali.",
        },
      ],
    },
    freedom: {
      editorial:
        'I dilemmi sulla libertà impongono un compromesso: quanta libertà individuale sei disposto a cedere per la sicurezza collettiva, e chi decide? Privacy vs sorveglianza, autonomia vs protezione — queste domande non hanno risposte comode in nessuna tradizione politica.',
      faqHeading: 'Sui dilemmi di libertà',
      faq: [
        {
          q: 'La libertà è assoluta o sempre condizionale?',
          a: "Il principio di danno di John Stuart Mill è la risposta classica: la tua libertà finisce dove danneggia gli altri. Ma chi conta come danneggiato, e quanto, è il vero punto di disaccordo.",
        },
        {
          q: 'Perché i dilemmi sulla libertà spesso coinvolgono la sorveglianza?',
          a: "Perché la sorveglianza è il compromesso moderno: più dati, più controllo, più sicurezza — ma a costo di privacy e autonomia. La tecnologia rende la domanda inevitabile.",
        },
        {
          q: 'Le persone nei diversi paesi rispondono allo stesso modo ai dilemmi sulla libertà?',
          a: "Non in modo uniforme. Il contesto storico, la tradizione politica e l'esperienza vissuta influenzano tutti il modo in cui le persone bilanciano libertà individuale e sicurezza collettiva. Questi dilemmi fanno emergere quella variazione direttamente.",
        },
      ],
    },
    technology: {
      editorial:
        "I dilemmi tecnologici sono la frontiera più recente della filosofia morale: allineamento dell'IA, ingegneria genetica, capitalismo della sorveglianza, privacy digitale. Queste domande non esistevano una generazione fa — e nessun sistema etico esistente è stato progettato per gestirle.",
      faqHeading: 'Sui dilemmi di tecnologia',
      faq: [
        {
          q: "Le IA possono prendere decisioni etiche?",
          a: "I sistemi di IA attuali ottimizzano per obiettivi — e quegli obiettivi potrebbero non corrispondere ai valori umani. I dilemmi tecnologici spesso espongono cosa succede quando l'efficienza viene scambiata per etica.",
        },
        {
          q: 'È sbagliato progettare bambini con tratti specifici?',
          a: "Dipende dal tuo sistema di riferimento. Gli utilitaristi potrebbero dire che la prevenzione della sofferenza lo giustifica; i deontologi si preoccupano di trattare i bambini come prodotti. Il dibattito è aperto e irrisolto.",
        },
        {
          q: 'Perché i dilemmi tecnologici sembrano più urgenti della filosofia morale classica?',
          a: "Perché il tempo è compresso. Un problema del tram tecnologico non è ipotetico — le decisioni politiche vengono prese ora, spesso senza deliberazione pubblica.",
        },
      ],
    },
    society: {
      editorial:
        'I dilemmi della società chiedono come dovremmo organizzare la vita collettiva — chi merita cosa, come distribuire risorse scarse, dove la politica dovrebbe prevalere sulla scelta individuale. Non sono domande astratte: sono i dibattiti dietro ogni elezione, ogni bilancio, ogni confine.',
      faqHeading: 'Sui dilemmi della società',
      faq: [
        {
          q: 'I dilemmi della società sono politici?',
          a: "Toccano la politica, ma non sono di parte. Un dilemma sull'allocazione delle risorse o sulla politica delle frontiere è filosofia morale applicata alla governance — e le persone di diversi orientamenti politici si dividono spesso in modi inaspettati.",
        },
        {
          q: 'Perché i dilemmi sulla disuguaglianza generano un disaccordo così netto?',
          a: "Perché le domande sull'allocazione delle risorse mettono in gioco valori in competizione: equità, merito, bisogno e bene collettivo. Dove si tracciano quei confini dipende spesso dai compromessi che si ritengono accettabili — e persone ragionevoli arrivano a conclusioni diverse.",
        },
        {
          q: 'Votare su dilemmi della società può cambiare la tua prospettiva?',
          a: "Può cambiare la tua prospettiva. Affrontare uno scenario concreto — non un'astrazione politica — spesso rivela che la tua posizione è più sfumata di una semplice etichetta sinistra/destra.",
        },
      ],
    },
    relationships: {
      editorial:
        'I dilemmi relazionali diventano personali: onestà vs gentilezza, fiducia vs privacy, amore vs autopreservazione. Queste domande non rimangono ipotetiche a lungo — la maggior parte delle persone riconosce situazioni che ha effettivamente affrontato o temuto.',
      faqHeading: 'Sui dilemmi di relazioni',
      faq: [
        {
          q: "L'onestà radicale è sempre meglio nelle relazioni?",
          a: "Non sempre. L'onestà che causa danno inutile senza beneficio può essere di per sé una mancanza di cura. La maggior parte dei sistemi etici riconosce che candore e gentilezza possono confliggere — ed è per questo che i dilemmi relazionali raramente hanno risposte pulite.",
        },
        {
          q: 'Perché i dilemmi relazionali sembrano più emotivamente intensi di quelli astratti?',
          a: "Perché coinvolgono persone a cui teniamo. Quando le conseguenze sono personali ed emotive, il ragionamento morale diventa più difficile — non perché i principi cambino, ma perché il costo di applicarli aumenta notevolmente.",
        },
        {
          q: "Le persone rispondono ai dilemmi relazionali in modo diverso quando sono in una relazione?",
          a: "Il contesto situazionale modella la risposta morale. Inquadrare lo stesso dilemma dall'interno di una relazione piuttosto che dall'esterno cambia la percezione delle conseguenze — ed è per questo che queste domande raramente hanno risposte universali.",
        },
      ],
    },
    lifestyle: {
      editorial:
        'I dilemmi sullo stile di vita sono le piccole scelte quotidiane che costruiscono in silenzio la persona che diventi — abitudini, identità, come passi un sabato. Nessuna è decisiva, e proprio per questo dicono molto di te: quando nulla ti obbliga, i compromessi che scegli rivelano più delle tue priorità di qualsiasi prova ad alta posta.',
      faqHeading: 'Sui dilemmi di stile di vita',
      faq: [
        {
          q: 'I dilemmi sullo stile di vita sono dilemmi morali?',
          a: "In gran parte no. La maggior parte delle domande sullo stile di vita riguarda preferenze e compromessi, non giusto contro sbagliato. Il segnale interessante è che anche le scelte a bassa posta rivelano cosa apprezzi davvero quando nulla ti obbliga.",
        },
        {
          q: 'Perché contano le piccole preferenze?',
          a: "Le piccole scelte si sommano. Come passi un sabato, cosa rinunci per fare spazio a qualcos'altro, cosa tolleri rispetto a cosa scambi via — tutto si compone in una forma di vita che le decisioni ad alta posta non fanno che confermare. L'identità si costruisce a valle delle cose piccole.",
        },
        {
          q: 'Queste domande sono pensate per essere serie?',
          a: "Più leggere delle altre, di proposito. I dilemmi lifestyle funzionano meglio come spunti di conversazione e specchi di sé, non come prove etiche. Se una domanda ti fa fermare e ripensare a un'abitudine che davi per scontata, ha fatto il suo lavoro.",
        },
      ],
    },
  },
}

export function getCategoryContent(category: string, locale: Locale): CategoryEditorial | null {
  return CONTENT[locale][category as CategoryKey] ?? null
}

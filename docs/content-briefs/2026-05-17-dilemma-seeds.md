# Content Brief — 40 Dilemma Seeds

**Date:** 17 May 2026
**Author:** Claude Opus 4.7 (for PM Matteo)
**Purpose:** Operational brief for the next content batch. 40 dilemma seeds across 10 clusters — 4 deferred SEO landings (gaming, tabletop RPG, fantasy, fitness) + 6 new viral clusters (dating apps, school/parents, housing, sport/fandom, elder care, disability/accessibility).

---

## How to use this brief

Each seed gives you the minimum needed to write a full `Scenario` entry in `lib/scenarios.ts`:

- **slug-id** — kebab-case, ≤30 chars, unique
- **Category** — must match an existing value in `lib/scenarios.ts` CATEGORIES (`morality | survival | loyalty | justice | freedom | technology | society | relationships`)
- **Setup** — 2-3 sentences, present tense, second person ("Sei...", "Devi..."). 200-300 chars total.
- **Option A / Option B** — short imperative labels (≤25 chars each). Both must be morally defensible — no straw man.
- **Topic landing it unlocks** — which `/[topicSlug]` SEO landing this dilemma supports as primary or related.

For Italian translation, follow the `lib/scenarios-it.ts` `translateScenarioToItalian` pattern. Title + setup + option labels translated 1:1.

---

## Batch sequencing

Per the 17 May audit findings, ship in 3 waves to avoid diluting catalog quality:

| Wave | Clusters | Seeds | Effort | Unlocks |
|------|----------|-------|--------|---------|
| **W1** | dating apps + school/parents + gaming + tabletop RPG | 16 | high-ROI viral + closes 2 deferred landings | `/dating-app-ethics` (new), `/school-parents-ethics` (new), `/gaming-ethics`, `/tabletop-rpg-dilemmas` |
| **W2** | fantasy + fitness + housing + sport/fandom | 16 | closes remaining 2 deferred + 2 medium-viral | `/fantasy-moral-dilemmas`, `/fitness-ethics`, `/housing-ethics`, `/sport-fandom-ethics` |
| **W3** | elder care + disability/accessibility | 8 | sensitive, needs editorial review per scenario | `/elder-care-ethics`, `/disability-accessibility-ethics` |

---

# WAVE 1

## Cluster 1 — Dating apps & digital relationships

**Target keyword:** "dating app ethics", "tinder moral dilemma", "ghosting ethical"
**Category:** `relationships`
**Tone:** intimate, conversational, gen-Z literate. No moralizing.
**Unlocks landing:** `/dating-app-ethics` (NEW topic) + IT `etica-app-incontri`

### S1.1 · `slow-fade-or-honest`
Setup: Chat con qualcuno da 3 mesi. Investe, scrive ogni giorno, ti chiama "tesoro". Per te è passata. Ghosting netto o messaggio onesto che farà male?
A: Spari (slow fade) · B: Lo dico, anche se ferisce

### S1.2 · `facetune-profile-disclosure`
Setup: Le tue foto del profilo sono ritoccate con FaceTune. Match in vista, primo appuntamento domani. Glielo dici prima o ci vada di persona e veda?
A: Lo avviso ora · B: Vediamo se nota

### S1.3 · `parallel-dating-exclusive`
Setup: Vedi 3 persone diverse in parallelo. La terza chiede "siamo esclusivi?" al 5° appuntamento. Tu non sei pronto/a a chiudere con le altre due. Confessi le altre o "non ancora"?
A: Confesso · B: "Non ancora", senza dettagli

### S1.4 · `catfish-six-months`
Setup: Dopo 6 mesi di chat intensa scopri che le foto del match sono di un'altra persona. La voce in chiamata è la stessa. Blocchi subito o chiedi perché ha mentito prima di decidere?
A: Blocco · B: Chiedo perché

---

## Cluster 2 — School & parents

**Target keyword:** "ethical dilemma parenting", "school discipline moral choice", "kids and lying"
**Category:** `relationships` (3 dilemmas) + `loyalty` (1 dilemma)
**Tone:** non-judgmental, recognizable. Both parents in audience — single + nuclear.
**Unlocks landing:** `/school-parents-ethics` (NEW topic) + IT `etica-scuola-genitori`

### S2.1 · `teacher-humiliated-my-kid`
Setup: Tuo figlio (8 anni) torna piangendo: la maestra l'ha umiliato davanti alla classe per un errore. Hai due opzioni: vai in direzione (rischia ritorsione sul bambino) o spieghi che a volte si subisce.
A: Vado in direzione · B: Gli insegno a subire
*Category:* `relationships`

### S2.2 · `nut-cake-mild-allergy`
Setup: Festa di classe. Tuo figlio vuole portare la torta di nonna con noci. In classe c'è un bambino con allergia LIEVE (orticaria, non shock). Porti la torta o cambi ricetta?
A: Porto la torta · B: Cambio ricetta
*Category:* `relationships`

### S2.3 · `your-kid-is-the-bully`
Setup: La scuola ti convoca: tuo figlio bullizza un compagno da settimane. Lo punisci pubblicamente (post Instagram di scuse) per dare esempio, o gestisci in privato senza esposizione?
A: Lezione pubblica · B: Gestione privata
*Category:* `loyalty`

### S2.4 · `inflated-grade-self-esteem`
Setup: Il prof dà a tuo figlio 7 in matematica. Sai che merita 5, e il prof te lo conferma in privato ("non voglio rovinargli l'autostima"). Lo fai notare ufficialmente o accetti?
A: Lo segnalo · B: Accetto il 7
*Category:* `relationships`

---

## Cluster 3 — Gaming ethics

**Target keyword:** "gaming ethics dilemma", "pay to win moral", "loot box ethics"
**Category:** `technology` (2) + `society` (2)
**Tone:** insider, recognizable to anyone who plays online. No "gamers are bad" framing.
**Unlocks landing:** `/gaming-ethics` (already drafted, currently blocked on dilemma count) + IT `etica-videogiochi`

### S3.1 · `pay-200-to-skip`
Setup: Free-to-play che giochi da 6 mesi. Una promo a tempo offre €200 per saltare 3 mesi di grinding. Tutti i top player l'hanno fatto. Pagar o quit?
A: Pago · B: Quit
*Category:* `technology`

### S3.2 · `friend-wallhack-report`
Setup: In ranked vedi che il tuo amico usa wallhack (vede attraverso i muri). Lo reporti al sistema anti-cheat (ban permanente certo) o resti zitto perché è il tuo amico?
A: Lo reporto · B: Resto zitto
*Category:* `loyalty`

### S3.3 · `lootbox-for-teens`
Setup: Sei game designer. Lo studio vuole lanciare un sistema gacha (10€ per skin random) rivolto al pubblico 13-16 anni. Sai che il pattern è gambling. Sollevi obiezione interna (rischi il posto) o resti silenzioso?
A: Sollevo obiezione · B: Resto silenzioso
*Category:* `society`

### S3.4 · `grief-teammate-report`
Setup: Partita ranked, compagno di squadra sta deliberatamente sabotando (suicida agli avversari, blocca le porte). 3-day ban se lo reporti. Procedi o accetti che fa parte del gioco?
A: Reporto · B: Accetto
*Category:* `society`

---

## Cluster 4 — Tabletop RPG dilemmas

**Target keyword:** "tabletop rpg ethics", "dungeon master dilemma", "player agency vs gm"
**Category:** `morality` (2) + `loyalty` (2)
**Tone:** generic D&D-style, NO trademarked names (no "D&D", no "Pathfinder", no specific classes/spells from copyrighted systems). Use "master", "PG / character", "campagna", "tiro".
**Unlocks landing:** `/tabletop-rpg-dilemmas` + IT `dilemmi-giochi-di-ruolo`
**⚠️ IP note:** rifletti su "tabletop RPG" generico in pubblica copy. Non citare regolamenti specifici, mostri protetti, spell names, lore copyrighted.

### S4.1 · `master-rewrites-backstory`
Setup: Sei il master. Un giocatore ha scritto 5 pagine di backstory per il suo personaggio. Confliggono con il plot principale che hai preparato. Riscrivi il backstory senza dirglielo o resetti la campagna?
A: Riscrivo silenziosamente · B: Resetto la campagna
*Category:* `morality`

### S4.2 · `fudge-the-killing-roll`
Setup: Sei il master. Il boss tira un critico mortale sul personaggio iconico del giocatore (3 anni di campagna). Nessuno vede il dado. Tiri davvero (PG morto) o lo "aggiusti"?
A: Tiro davvero · B: Aggiusto il dado
*Category:* `morality`

### S4.3 · `metagaming-to-save-party`
Setup: Sei un giocatore. Sai (da fuori partita) che la porta è una trappola mortale. Il tuo personaggio non ha modo di saperlo. Avverti il gruppo rompendo il personaggio o lasci che cada nella trappola?
A: Avverto · B: Rispetto il personaggio
*Category:* `loyalty`

### S4.4 · `consent-in-dark-scene`
Setup: Stai narrando una scena di tortura per il PNG cattivo. Un giocatore al tavolo è visibilmente a disagio (silenzio, occhi bassi). Continui per immergere la storia o tagli e chiedi se sta bene?
A: Continuo · B: Taglio e chiedo
*Category:* `loyalty`

---

# WAVE 2

## Cluster 5 — Fantasy moral dilemmas

**Target keyword:** "fantasy moral dilemma", "dark magic ethics", "prophecy and free will"
**Category:** `morality` (3) + `survival` (1)
**Tone:** epic but rooted in real ethical conflict. Generic fantasy tropes ONLY — no IP from existing franchises.
**Unlocks landing:** `/fantasy-moral-dilemmas` + IT `dilemmi-morali-fantasy`

### S5.1 · `forbidden-necromancy-save-city`
Setup: La città cadrà entro 3 giorni. L'unica magia che può fermare l'invasione è una necromanzia proibita: il prezzo è la tua anima, ma 50.000 vivono. La usi?
A: La uso · B: Non la uso
*Category:* `morality`

### S5.2 · `kill-the-prophesied-child`
Setup: La profezia, mai sbagliata, dice che il bambino davanti a te (5 anni, innocente) distruggerà il mondo a 20 anni. Lo uccidi adesso?
A: Lo uccido · B: Non lo uccido
*Category:* `morality`

### S5.3 · `consume-the-immortal`
Setup: Per salvare migliaia di vite mortali devi consumare l'energia vitale dell'unico immortale benevolo del mondo. Lui acconsente, ma sai che il mondo perderà la sua bussola morale per sempre.
A: Lo consumo · B: Rifiuto
*Category:* `survival`

### S5.4 · `brainwash-tyrant-into-king`
Setup: Hai una pozione che trasforma il dittatore brutale in un sovrano giusto. Ma cancella chi è davvero — la sua personalità muore. Salvi il regno o rispetti l'autonomia di un mostro?
A: Lo trasformo · B: Rispetto l'autonomia
*Category:* `morality`

---

## Cluster 6 — Fitness ethics

**Target keyword:** "fitness influencer ethics", "gym recording consent", "fitness body image"
**Category:** `society` (2) + `relationships` (2)
**Tone:** non-shaming. Body neutrality. NO medical advice — frame as personal choice.
**⚠️ Editorial note:** Disclaimer su disturbi alimentari mandatorio sui due dilemmi che li toccano.
**Unlocks landing:** `/fitness-ethics` + IT `etica-fitness`

### S6.1 · `gym-recording-strangers-bg`
Setup: Filmi il tuo workout per Instagram. Tre persone nello sfondo non hanno acconsentito (alcune mid-rep, espressioni "non flatteanti"). Posti il reel comunque o rifai senza loro?
A: Posto comunque · B: Rifaccio
*Category:* `society`

### S6.2 · `transformation-triggers-EDs`
Setup: Le tue foto before/after virali stanno innescando disturbi alimentari nei tuoi follower (te lo dicono in DM). Continui a postare o smetti per proteggerli, perdendo metà del tuo lavoro?
A: Continuo · B: Smetto
*Category:* `society`

### S6.3 · `coach-vs-physio-injury`
Setup: Il tuo coach personale dice "spingi, è fisiologico" su un dolore alla spalla. Il fisioterapista (consultato a parte) dice "fermati o operazione tra 6 mesi". A chi ascolti?
A: Ascolto coach · B: Ascolto fisio
*Category:* `relationships`

### S6.4 · `partner-wearable-obsession`
Setup: Il tuo partner controlla l'Apple Watch 50 volte al giorno. Salta cene per chiudere l'anello attività. Glielo dici sapendo che reagirà male o resti zitto?
A: Glielo dico · B: Resto zitto
*Category:* `relationships`

---

## Cluster 7 — Housing & neighborhood

**Target keyword:** "neighbor dispute ethics", "report neighbor moral dilemma", "condo rule violation"
**Category:** `society` (3) + `freedom` (1)
**Tone:** urbano, riconoscibile, niente moralismo. Audience adulta 30+.
**Unlocks landing:** `/housing-ethics` (new) + IT `etica-vicinato`

### S7.1 · `airbnb-violation-report`
Setup: Il vicino subaffitta su Airbnb violando il regolamento condominiale. Tu hai sempre rumore, sconosciuti nell'androne. Lo segnali al condominio (causa civile certa) o lasci stare?
A: Segnalo · B: Lascio stare
*Category:* `society`

### S7.2 · `dog-on-balcony-12h`
Setup: Vedi il vicino lasciare il cane sul balcone 12 ore al giorno, anche al sole. Non è una sofferenza acuta — il cane non urla. Chiami i carabinieri (segnalazione anonima) o ti fai gli affari tuoi?
A: Chiamo · B: Non chiamo
*Category:* `society`

### S7.3 · `nightly-shouting-couple`
Setup: La coppia sotto litiga ogni notte alle 2 di mattina. Urla, oggetti rotti. Mai segni di violenza fisica visibili sulla donna quando la incroci. Chiami la polizia (rischio escalation) o ignori?
A: Chiamo · B: Ignoro
*Category:* `society`

### S7.4 · `illegal-extension-report`
Setup: Il vicino sta ampliando illegalmente il terrazzo (sai che non ha permessi). Riduce il tuo affaccio di poco. Denunci al comune (multa salata per lui) o "vivi e lascia vivere"?
A: Denuncio · B: Lascio stare
*Category:* `freedom`

---

## Cluster 8 — Sport & fandom

**Target keyword:** "sports ethics dilemma", "fan loyalty moral choice", "doping report"
**Category:** `loyalty` (2) + `society` (2)
**Tone:** appassionato, rispettoso delle tribù sportive. Audience tifosi 25+.
**Unlocks landing:** `/sport-fandom-ethics` (new) + IT `etica-sport-tifo`

### S8.1 · `ultras-violence-tipoff`
Setup: Il tuo gruppo ultras pianifica un'aggressione organizzata contro la curva avversaria al derby. Lo sai per certo. Avverti la polizia (tradisci il gruppo, ti escludono per sempre) o resti zitto?
A: Avverto · B: Resto zitto
*Category:* `loyalty`

### S8.2 · `doping-of-your-hero`
Setup: Scopri prove certe che il tuo campione preferito (l'icona della tua squadra da 10 anni) si dopa. Lo smascheri pubblicamente (carriera distrutta, lui ha famiglia) o resti zitto?
A: Smaschero · B: Resto zitto
*Category:* `loyalty`

### S8.3 · `bribed-ref-return-trophy`
Setup: La tua squadra vince lo scudetto. Tre mesi dopo scopri che il presidente ha corrotto un direttore di gara in una partita decisiva. Pubblichi la prova (titolo revocato) o resti zitto perché tifi da bambino?
A: Pubblico · B: Resto zitto
*Category:* `society`

### S8.4 · `stadium-racism-witness`
Setup: Allo stadio l'uomo accanto a te urla cori razzisti contro un giocatore. Sai chi è (vicino di casa, ti vede). Lo reporti agli steward (lui sa che sei stato tu) o ignori per non rovinare il rapporto?
A: Reporto · B: Ignoro
*Category:* `society`

---

# WAVE 3 — Editorial review required

## Cluster 9 — Elder care & adult family

**Target keyword:** "elder care ethical dilemma", "dementia caregiving moral choice", "end of life parent"
**Category:** `relationships` (3) + `morality` (1)
**Tone:** grave ma non melodrammatico. Audience 40-65, in pieno carico genitoriale ascendente.
**⚠️ Editorial note:** dilemma S9.2 tocca eutanasia. **Required disclaimer:** "Educational content, not legal or medical advice. National helplines etc." Per LEGAL.md compliance.
**Unlocks landing:** `/elder-care-ethics` (new) + IT `etica-cura-anziani`

### S9.1 · `nursing-home-vs-home-care`
Setup: Tuo padre (82, demenza lieve) può ancora restare a casa, ma tu stai esaurendo. Metterlo in struttura ti restituisce vita personale (lui meno felice). Sacrifichi tu o sacrifichi lui?
A: Casa di riposo · B: Continuo a casa
*Category:* `relationships`

### S9.2 · `terminal-parent-asks-to-die`
Setup: Tua madre, malata terminale con dolore non controllato, ti chiede di aiutarla a morire. In Italia non è legale. Lo fai (rischio carcere) o rifiuti?
A: La aiuto · B: Rifiuto
*Category:* `morality`
**⚠️ Add disclaimer.**

### S9.3 · `unequal-will-disclosure`
Setup: Scopri che il nonno ha lasciato 80% a te, 20% a tua sorella per ragioni mai dette. Sai che lei farà causa se scopre dopo. Le dici ora (lei contesta il testamento finché lui è vivo, rovinando gli ultimi mesi) o resti zitto?
A: Le dico ora · B: Resto zitto
*Category:* `relationships`

### S9.4 · `alzheimer-comforting-lie`
Setup: Tuo padre con Alzheimer chiede ogni 5 minuti dove è la moglie (morta 3 anni fa). Ogni volta che dici la verità rivive il lutto. "È al supermercato" lo calma per un'ora. Verità o bugia compassionevole?
A: Verità ogni volta · B: Bugia compassionevole
*Category:* `relationships`

---

## Cluster 10 — Disability & accessibility

**Target keyword:** "disability ethics dilemma", "accessibility moral choice", "ableism everyday"
**Category:** `justice` (2) + `society` (2)
**Tone:** ⚠️ EXTRA CAREFUL. Audience include persone con disabilità reali. Framing scorretto qui distrugge trust. **Review specialistica obbligatoria** prima di pubblicare.
**Editorial constraints:**
- Mai usare disabilità come "twist comico"
- Mai mettere la persona disabile come "ostacolo" del dilemma — il dilemma è sempre dell'abile rispetto al sistema
- Linguaggio: "persona con disabilità" non "disabile"; "persona sorda/non udente" non "sordomuto"; "persona autistica" (identity-first preferito nella community)
- Disclaimer mandatorio: "This scenario explores ethical tensions around accessibility, not the personal worth of any individual or condition."
**Unlocks landing:** `/disability-accessibility-ethics` (new) + IT `etica-disabilita-accessibilita`

### S10.1 · `H-parking-5-minutes`
Setup: Sei all'ospedale, fila ovunque. L'unico parcheggio H libero è davanti all'ingresso. Non hai cartellino. Resti 5 minuti per ritirare un farmaco urgente — sai che nessuna persona disabile sta arrivando in questo momento. Ci parcheggi?
A: Parcheggio · B: Cerco altrove
*Category:* `justice`
**⚠️ Add disclaimer.**

### S10.2 · `bus-seat-priority-conflict`
Setup: Sul bus due posti riservati: un anziano (75, in piedi a fatica) e una persona con disabilità non visibile (sale dopo). Tu hai un solo posto da liberare. A chi lo dai?
A: All'anziano · B: Alla persona con disabilità
*Category:* `justice`
**⚠️ Add disclaimer.**

### S10.3 · `invisible-condition-outing`
Setup: Il tuo collega ti ha confidato di essere autistico (diagnosi non comunicata in azienda). HR ti chiede in privato "secondo te sta bene? notiamo cose". Lo riveli (potrebbe perdere il lavoro o ottenere supporto) o proteggi il segreto?
A: Rivelo · B: Proteggo
*Category:* `society`
**⚠️ Add disclaimer.**

### S10.4 · `accessibility-cost-meetings`
Setup: Sei persona sorda. La tua presenza richiede sottotitoli in tempo reale o interprete LIS — rallenta del 30% ogni riunione. Il team comincia a "dimenticarsi" di invitarti. Sollevi formalmente la questione (rischio etichetta "difficile") o cerchi di adattarti?
A: Sollevo formalmente · B: Mi adatto
*Category:* `society`
**⚠️ Add disclaimer.**

---

# After publishing — re-run sprints

When the dilemmas land in `lib/scenarios.ts`, re-run these sprints to ship the landings:

| Sprint | Depends on | Landing pages unlocked |
|--------|-----------|------------------------|
| `LANDING-GAMING-ETHICS-01` | Cluster 3 published | `/gaming-ethics` + IT |
| `LANDING-TABLETOP-RPG-01` | Cluster 4 published | `/tabletop-rpg-dilemmas` + IT |
| `LANDING-FANTASY-DILEMMAS-01` | Cluster 5 published | `/fantasy-moral-dilemmas` + IT |
| `LANDING-FITNESS-ETHICS-01` | Cluster 6 published | `/fitness-ethics` + IT |
| `LANDING-DATING-APP-01` | Cluster 1 published | `/dating-app-ethics` + IT |
| `LANDING-SCHOOL-PARENTS-01` | Cluster 2 published | `/school-parents-ethics` + IT |
| `LANDING-HOUSING-01` | Cluster 7 published | `/housing-ethics` + IT |
| `LANDING-SPORT-FANDOM-01` | Cluster 8 published | `/sport-fandom-ethics` + IT |
| `LANDING-ELDER-CARE-01` | Cluster 9 published + LEGAL review | `/elder-care-ethics` + IT |
| `LANDING-ACCESSIBILITY-01` | Cluster 10 published + accessibility review | `/disability-accessibility-ethics` + IT |

Each landing sprint is small (~30 min): one entry in `lib/seo-topics.ts` + sitemap update.

---

# Residual risks

1. **Cluster 10 (disability)** carries the highest reputational risk. Recommend involving a disability rights consultant or community reviewer BEFORE publishing any scenario. A single tone-deaf dilemma here can fuel a viral backlash.
2. **Cluster 9 S9.2 (assisted death)** touches Italian criminal law (art. 580 c.p.). Frame as ethical exploration, NOT instructional. Disclaimer + crisis line link mandatory.
3. **Cluster 4 (RPG)** must avoid trademarked terms. The 4 seeds use generic "master/PG/campagna" but content writers may slip into specific lore. QA pass for IP terms before each commit.
4. **Cluster 6 S6.2 (transformation/EDs)** needs an "if you are struggling, reach out to [helpline]" footer. Frame the dilemma as the influencer's ethical conflict, not the audience's.
5. All 40 seeds are EN+IT. Translation should not just localize — adapt cultural references (e.g., S2.4 references Italian school grading 0-10; S9.2 references Italian art. 580 c.p.). Don't mechanically translate.

---

**End of brief.** Hand to AI content tools (Claude / GPT) or write by hand. Recommended target: 1 wave per week (4-8 dilemmas reviewed + published per wave).

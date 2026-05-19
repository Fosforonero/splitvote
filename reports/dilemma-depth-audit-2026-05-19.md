# Dilemma Depth Audit — 2026-05-19

**Sprint:** DILEMMA-DEPTH-AUDIT-01
**Mode:** Read-only audit. No source files, prompts, gates, or data modified.
**Output:** This report only.

## TL;DR

- The static-41 pool is **stronger than its weakest 10 suggest** — about 25 dilemmas already do real moral work; the other ~10–15 are weakened by the same three patterns (false binaries, magic-number fantasy stipulations, and one-sided morally-loaded option copy).
- The dynamic generation prompt (`lib/content-generation-prompts.ts:43–63`, `:100–108`) tells the model "both options represent different values, not good vs evil" — but the quality gate (`lib/content-quality-gates.ts:91–192`) **does not test for moral dual-defensibility, both-sides-make-a-point, or balanced framing**. It tests length, blocklist, language, novelty score, and a single hand-coded "transparency-vs-omission" clarity check. There is a sizeable gate-prompt gap.
- The `lifestyle` family **is structurally separated by prompt and by relaxed gate thresholds**, but the category itself is the only enforcement: a moral-prompt-generated item can still land with `category: "lifestyle"` (or vice versa) and pass — there is no rejection if the question structure does not match `dilemmaStyle`.
- The post-vote expert insight (`lib/expert-insights.ts`) is **per-category, not per-dilemma**: the trolley problem and "should we forgive a cheater" both display the *exact same paragraph* if they share the `morality` or `relationships` category. A user who votes on 5 morality dilemmas reads the same insight 5 times. Dynamic AI-generated insight overrides (`expertInsightEn` / `expertInsightIt`) exist as a hook (`lib/dynamic-scenarios.ts:135–137`) but no per-dilemma generation pipeline appears to populate them at scale today.
- Recommended next sprint: **`DILEMMA-DEPTH-RUBRIC-01`** — encode the 5-axis rubric below into both the generation prompt and a new soft quality gate, with no rewrites yet. Rewrite the static-41 in a separate sprint after the rubric is wired.

## Methodology

I read in full: `lib/scenarios.ts` (472 lines), `lib/dynamic-scenarios.ts` (323), `lib/content-generation-prompts.ts` (332), `lib/content-quality-gates.ts` (192), `lib/expert-insights.ts` (249), `components/DilemmaInsightSection.tsx` (107), `lib/dilemma-seo-insights.ts` (~556, skimmed past line 410). I read `app/results/[id]/ResultsClientPage.tsx` end-to-end and the relevant insight blocks in `app/play/[id]/page.tsx` and `app/results/[id]/page.tsx`. I skimmed `PRODUCT_STRATEGY.md` for "core loop", "dilemma quality", "anti-goal" mentions and `CURRENT_HANDOFF.md` for the 19 May session and recent sprint state.

Scoring of the 41 static dilemmas was done by reading each one's `question`, `optionA`, `optionB` in `lib/scenarios.ts` (lines 22–365) and judging it against the 5 axes in the prompt (real moral tradeoff, both-options-defensible, emotional/social consequence, reveals a moral axis, avoids abstract/silly/obvious framing). I did **not** produce the 5×41 cell matrix in the report (per the prompt's instruction). I aggregated to top-10 / bottom-10 / systemic patterns.

I did **not** touch Supabase, Redis, the supabase MCP, any source file, or any tracked file beyond writing this report. No /tmp scratch files were created.

Interpretive vs. factual claims: anything tagged "lines X–Y" or "file:line" is a verifiable code reference. Anything claiming a dilemma is shallow, obvious, or one-sided is a judgement call from reading the literal text of the dilemma.

## 1. Static dilemma quality — top patterns

### Strongest pattern types

- **The price-of-loyalty real-life trap** — e.g. `cover-accident` (lines 148–154), `sibling-secret` (155–162), `report-friend` (139–146). The dilemma maps cleanly onto a scene the reader has either lived or could imagine living, both sides have someone they are betraying, and the social consequence is visceral.
- **The "I'd never do that" → wait actually exposure** — e.g. `mercy-kill` (63–70), `cure-secret` (32–38), `pandemic-dose` (122–128). The setup is clinical but the options strip out the easy answer. Both options pay a real moral cost.
- **The fairness-vs-mercy procedural trap** — e.g. `death-row-exonerated` (190–196), `innocent-juror` (182–188). Two coherent value systems (rule-following vs context-sensitivity) give the unpopular pick real defenders.

### Weakest pattern types

- **"Choose between X happening vs an unspecified worse thing" with magic premise** — e.g. `rich-or-fair` (166–172) ("equally poor or status quo"), `delete-social-media` (266–272) ("delete all social media" with a stipulated +40% mental health). The choice depends on accepting a fictional causal claim, not on a value tradeoff.
- **"Should this fascist/criminal/etc. get away with it?" framed as moral inquiry** — e.g. `deepfake-expose` (282–288) (the politician is "genuinely corrupt" and the only question is whether a lie is OK to use against him), `censor-speech` (216–222) ("a politician's lies directly caused 500 deaths"). The premise resolves most of the moral work before the user votes.
- **Empty trolley-clone reskins** — `trolley` itself is iconic, but `time-machine` (98–104) and `organ-harvest` (56–62) are mechanically the same dilemma three times (kill 1 to save N). The portfolio has one philosophy slot consumed three times.

### The 4–7 recurring weaknesses across the 41

1. **One-sided morally-loaded option copy.** The dilemma may be balanced but the *labels* aren't. Example, `organ-harvest:optionB`: `"Never. You cannot kill an innocent patient."` (line 59). The word "innocent" plus the imperative "Never" signals "this is the right answer" — meanwhile `optionA` is dry math: `"Harvest the organs. 5 lives > 1."` Same problem in `time-machine` (100–101), `tax-billionaires` (294–295: `"No one needs a billion dollars"` vs `"Forced redistribution is wrong"`), `forgive-cheater` (352–353). Symmetrical phrasing would be cheap and would massively change vote distributions.
2. **Magic stipulations that pre-resolve the dilemma.** "Studies show recidivism drops 60%", "30% more accurate than human judges", "Portugal's model shows crime drops 50%", "global mental health improves 40%". `prison-abolition` (324–330), `robot-judge` (174–180), `drug-legalization` (316–322), `delete-social-media` (266–272). The dilemma becomes "do you accept the magic causal claim?" — not "what do you value?"
3. **False binaries with an obvious "find another way" exit.** `steal-medicine` (48–54), `love-or-career` (334–340), `lifeboat` (90–96). In real life the user would refuse the framing; in the dilemma framing they are forced to commit to a side they would never actually commit to.
4. **Trolley-clone repetition.** `trolley`, `organ-harvest`, `time-machine`, `pandemic-dose`, `plane-parachute`, `zombie-apocalypse`, `save-partner-vs-stranger` — seven of 41 dilemmas are variants of "save N at cost of 1 (or M)". The portfolio is overweighted on numeric utilitarianism scenes.
5. **Policy-survey items disguised as dilemmas.** `mandatory-vaccine`, `open-borders`, `universal-basic-income`, `tax-billionaires`, `drug-legalization`, `prison-abolition`, `surveillance-city`. These are political opinion polls, not dilemmas. The voter doesn't pay a personal cost; they pick a tribe. Five of the seven society/freedom items have this shape.
6. **Insufficient stakes-specificity.** Some questions read like a textbook prompt rather than a scene a reader can picture. `ai-art-copyright` (242–248), `brain-upload` (258–264), `revenge-vs-forgiveness` (198–204). They ask the reader to take a philosophical position, not to imagine themselves in a situation.
7. **Truth-telling-when-no-one-will-find-out is over-represented.** `confess-crime`, `old-secret-affair`, `forgive-cheater`, `sibling-secret`, `cover-accident`, `truth-friend` — six dilemmas are some flavor of "do you tell / do you confess / is silence betrayal". The format is good but the slot is full.

## 2. 10 strongest dilemmas

| id | Why it works | Moral axis it cleanly maps to |
|---|---|---|
| `mercy-kill` | Both options actively wound the chooser. Honoring vs refusing a dying parent's request is a real conflict between autonomy and moral non-complicity. Stakes are personal and undeniable. | Autonomy vs sanctity-of-life |
| `cover-accident` | Loyalty to the partner you love vs duty to a stranger's family. Both sides leave the chooser unable to live with themselves. | Near loyalty vs far justice |
| `sibling-secret` | The chooser is structurally trapped between two people they love. Either choice is a betrayal of someone close. | Loyalty vs honesty (within kin) |
| `innocent-juror` | Tension between procedural justice ("follow the evidence") and trusting instinct is genuinely live in philosophy and in real juror behaviour. | Procedural justice vs particular justice |
| `pandemic-dose` | Personal survival against deference to age/vulnerability. Clean two-instinct conflict (self-continuity vs kin/group protection). | Self vs other under scarcity |
| `cure-secret` | Beautifully ugly: hoarding good for utilitarian reasons. Forces the reader to pick between "knowledge belongs to humanity" and "outcomes belong to humanity". | Procedure vs outcome (knowledge ethics) |
| `death-row-exonerated` | Strong because it removes the easy answer: punishing a dying, frail man feels pointless, but the "let it go" option requires actively choosing mercy over symmetry. | Rule vs mercy |
| `whistleblower` | Real and recurring tension between environmental ethics and immediate working-class harm. Both have lived-experience defenders. | Far harm vs near harm |
| `forgive-cheater` | Concrete relationship facts (15 yrs, one-time, 3 yrs ago, remorseful). The voter must price trust violation against accumulated history. | Trust restoration vs trust irreversibility |
| `mercy-kill`/`old-secret-affair` (alt anchor) — substituting `old-secret-affair` | Asks whether honesty after a decade has *any* recipient who benefits, exposing how often "honesty" is actually about the teller. | Honesty vs care |

(Anchor list of 10; the last row substitutes `old-secret-affair` for a non-duplicate anchor.)

## 3. 10 weakest dilemmas — with rationale and proposed rewrite

For each, the existing text is quoted (line refs in `lib/scenarios.ts`) and the proposed rewrite keeps `id` and `category` constant.

### 1. `rich-or-fair` (lines 166–172, category: justice)

**Existing:**
- Q: *"You can press a button: everyone on Earth becomes equally poor, or the world stays as-is with extreme inequality."*
- A: *"Press it. Equal poverty is fairer."*
- B: *"Don't press. Keep the current world."*

**What's broken:** Cartoonish magic stipulation ("equally poor"). Both labels read as straw-men. Option A reframes "equality" as something nobody actually advocates. Option B is the obvious answer.

**Proposed rewrite:**
- Q: "A new tax would halve the income of the top 1% and double the income of the bottom 20%. The total wealth in society stays the same."
- A: "Pass it. Less concentration is worth the redistribution."
- B: "Block it. Choosing winners and losers like this is wrong, even when the math works."

### 2. `deepfake-expose` (lines 282–288, category: technology)

**Existing:**
- Q: *"You have a deepfake video that looks 100% real, showing a corrupt politician committing a crime. The politician is genuinely corrupt but this event never happened."*
- A: *"Release it. He deserves to fall."*
- B: *"Destroy it. A lie is still a lie."*

**What's broken:** The premise tells the user the politician *is* guilty, so option A is just "use a fake bullet on a guilty man". The moral work is done by the stipulation, not by the voter.

**Proposed rewrite:**
- Q: "You have a deepfake video of a public figure committing a crime. You don't know whether the real event happened — only that the video itself is fake."
- A: "Release it. If it leads to a real investigation, the truth will surface anyway."
- B: "Destroy it. You'd be planting evidence even if you turn out to be right."

### 3. `censor-speech` (lines 216–222, category: freedom)

**Existing:** Q ties the speech directly to 500 deaths. Option A is "consequences", Option B is "Free speech is absolute" — almost nobody actually believes absolutism.

**Proposed rewrite:**
- Q: "A politician spreads false claims that lead to harassment and violence in some communities. Should they be permanently banned from all major platforms?"
- A: "Yes. The platform isn't the public square — there's no right to amplification."
- B: "No. Once 'harm' is the bar, the next ban won't look like this one."

### 4. `prison-abolition` (lines 324–330, category: society)

**Existing:** Magic stipulation ("recidivism drops 60%"). Voter is asked to accept a contested empirical claim, not to weigh values.

**Proposed rewrite:**
- Q: "A serious offender finishes a long sentence and walks free. Should they ever be allowed to live in your neighbourhood without you being told?"
- A: "Yes. If they've served their time, the punishment can't follow them forever."
- B: "No. The people nearby have a right to know what risk they're being asked to accept."

### 5. `robot-judge` (lines 174–180, category: justice)

**Existing:** "30% more accurate" stipulation pre-resolves the consequentialist side.

**Proposed rewrite:**
- Q: "An AI sentencing tool is more consistent than human judges across similar cases, but cannot explain its reasoning. Should it be used?"
- A: "Yes. Consistency itself is a form of fairness."
- B: "No. A sentence you can't be told the reason for isn't justice."

### 6. `tax-billionaires` (lines 292–298, category: society)

**Existing:** Option A "No one needs a billion dollars" is editorial. Option B "Forced redistribution is wrong" is a strawman.

**Proposed rewrite:**
- Q: "A one-time wealth tax would fund 10 years of food aid to the people who need it most. Billionaires would still be billionaires."
- A: "Pass it. The shortfall it closes outweighs the principle it bends."
- B: "Block it. Targeting one group, even comfortably, makes the next targeting easier."

### 7. `delete-social-media` (lines 266–272, category: technology)

**Existing:** "+40% mental health" magic stipulation; "Don't. Connection and freedom of expression matter" is a strawman.

**Proposed rewrite:**
- Q: "A bill would ban all social-media access for under-16s, enforced by ID. It would protect some kids and lock out others who use these platforms to find communities they need."
- A: "Pass it. The default for minors should be protection, not access."
- B: "Block it. The kids who need the platforms most will lose them first."

### 8. `lifeboat` (lines 90–96, category: survival)

**Existing:** Forced premise ("someone must go overboard or everyone drowns") with no specifying detail — reads as abstract.

**Proposed rewrite:**
- Q: "A lifeboat holds 8. There are 9 of you. Nobody volunteers. Someone proposes the eldest goes — they look at you and nod."
- A: "Accept their nod. They've made peace with it."
- B: "Refuse. Once we choose by usefulness, we've already lost something we won't get back."

### 9. `ai-replaces-jobs` (lines 273–280, category: technology)

**Existing:** The prompt itself (`lib/content-generation-prompts.ts:59`) tells the AI to **avoid** "AI will eliminate all X jobs" framings — and yet this static dilemma is exactly that framing. Self-inconsistent.

**Proposed rewrite:**
- Q: "Your company offers you the same salary to either supervise an AI doing your old job, or to retrain into a different role with no guarantee of getting it. You have 30 days to decide."
- A: "Supervise the AI. Take the certainty."
- B: "Retrain. The supervisor role disappears next."

### 10. `revenge-vs-forgiveness` (lines 198–204, category: justice)

**Existing:** Abstract — "someone who destroyed your life" with no specifics. Both options are emotionally loaded but the voter has nothing concrete to imagine.

**Proposed rewrite:**
- Q: "The person who falsely accused you 10 years ago — costing you a career — is now leading a community charity. They've never reached out."
- A: "Tell their donors who they were. Reputations aren't reset by silence."
- B: "Leave it. Holding it now would cost you more than them."

## 4. Dynamic generation pipeline review

### What the prompts optimise for (with file:line refs)

In `lib/content-generation-prompts.ts`:

- **Safety/blocklist + factuality + non-clickbait** (lines 43–63 — `SAFETY_RULES`).
- **No "good vs evil"** — line 50: `"Both dilemma options must be morally nuanced — never 'good vs evil'"`.
- **Internal consistency of absolutes** — lines 52–54 (don't pair universal promises with hidden loopholes; both options must be mutually exclusive responses to the same question).
- **No duplicate moral structures with reskinned surface** — line 61: `"Do not generate the same moral question with different surface nouns, nationalities, numbers, or settings — that is too_similar, not novel"`.
- **No "AI will eliminate all X jobs" archetype** — line 59 (interesting given `ai-replaces-jobs` static dilemma is exactly that).
- **No trolley/organ-harvest/lifeboat reskins** — line 60.
- **In the user prompt** (lines 100–108): `"genuine moral conflict, no easy answer"`, `"Both options represent different values, not good vs evil"`, `"Novel angle"`, `"Do not reproduce the same moral structure with different nouns or setting"`.
- **No explicit instruction** to test both-options-defensible from a recognised value system, no instruction to phrase options symmetrically, no instruction to avoid magic empirical stipulations of the kind that weaken the static-41.
- **Lifestyle prompt is a completely separate function** (`buildLifestyleDilemmaPrompt`, lines 128–174) — instructs "No moral framing — pure personal preference" (line 138), "X or Y?" 10–80 char format, both options "equally appealing", `category` field forced to `"lifestyle"`.

### What the gates actually enforce (with file:line refs)

In `lib/content-quality-gates.ts`:

- **Locale must be en/it** (97–99).
- **Question length 20–300 chars (10–300 for lifestyle)** (102–105).
- **Option length 5–200 chars (2–200 for lifestyle)** (107–114).
- **Option length ratio ≤ 4:1** (117–120).
- **SEO title 10–120 chars, description 20–320** (123–126).
- **Category must be in `VALID_CATEGORIES`** including `lifestyle` (12–16, 129–131).
- **Hard blocklist** — named politicians, suicide, self-harm, child abuse, hate, weapon/bomb instructions (20–27, 134–143).
- **One hand-coded clarity check**: Italian-only regex for `"totale trasparenza" + (nascondere|omettere|tacere)` (50–62, 145–148). Truly a one-off — does not generalise.
- **Italian-language signal count** for `locale === 'it'` (must have ≥2 Italian accent chars or short Italian function words). Skipped for lifestyle (40–48, 150–160).
- **Novelty score ≥ 75 for moral (≥10 for lifestyle)** (30, 36, 162–167).
- **Final score ≥ 75 for moral (≥30 for lifestyle)** (31, 37, 169–173).
- **≤ 2 similar items** (32, 176–179) — skipped for lifestyle.

The gate **does not** test: option phrasing symmetry, presence of editorial loading on either label, magic-stipulation patterns ("studies show X%", "% more accurate", "+N% improvement"), good-vs-evil framing in options (despite the prompt forbidding it), trolley/organ/lifeboat templates (despite the prompt forbidding them), or whether the dilemma maps to a recognised moral axis.

### Where prompts/gates miss the depth target

- **The 4 of the audit's 5 axes are not in the gate at all.** "Real moral tradeoff", "both options defensible", "emotional/social consequence", "reveals a moral axis" — none are tested. Only "avoids being abstract/silly/generic" gets partial coverage via the trolley-clone prompt instructions, but those are at the prompt layer (which the model can ignore) and have **no corresponding gate check**.
- **Magic-stipulation framing is invisible to the gate.** A dynamic dilemma like "studies show 60% fewer deaths if we ban X" would sail through every gate.
- **Option-label loading is invisible to the gate.** Asymmetric phrasing ("Yes, common sense" vs "No, defend the rule no matter what") would pass.
- **Novelty score is structural (Jaccard token overlap, see `lib/dynamic-scenarios.ts:301–322`), not semantic.** A new dilemma with the same moral structure but completely different surface vocabulary will score as highly novel. This matches the prompt's stated concern (line 61) but the gate cannot enforce it.
- **The autopublish final-score threshold of 75 (`content-quality-gates.ts:31`) is a weighted blend** (`computeFinalScore`, `dynamic-scenarios.ts:290–297`) of viral 0.35, SEO 0.25, novelty 0.25, feedback 0.15. **None of these four inputs measure depth.** A dilemma can score 90 final by being viral and SEO-rich while being morally shallow.

### Lifestyle vs moral boundary

**Structurally enforced:**
- Lifestyle has its own prompt function (`buildLifestyleDilemmaPrompt`, 128–174) with explicit "no moral framing" instruction.
- Lifestyle has its own gate thresholds (`LIFESTYLE_AUTOPUBLISH_*` constants, content-quality-gates.ts:36–37).
- Lifestyle skips Italian-language signal check and similar-items check.
- The `dilemmaStyle?: 'moral' | 'lifestyle'` flag exists on `DynamicScenario` (dynamic-scenarios.ts:145).

**Leak vectors:**
1. **The gate does not verify that `category === "lifestyle"` matches `dilemmaStyle === "lifestyle"`.** A moral-prompt-generated dilemma could land with `category: "lifestyle"` and pass the moral gate; conversely a lifestyle item could be tagged `morality` and run through the moral gate that doesn't actually understand lifestyle is moral-shaped. The two switches are independent.
2. **The `category` field in moral prompt output** (`content-generation-prompts.ts:108`) **explicitly excludes lifestyle from the allowed set** (`"morality|survival|loyalty|justice|freedom|technology|society|relationships"`) — good. But there is **no equivalent constraint** that prevents the lifestyle prompt from being called for a topic that is actually morally weighted, and no UI signal that prevents an admin from re-categorising a lifestyle draft as `morality`.
3. **`patchApprovedScenario`** (dynamic-scenarios.ts:245–255) **does not patch category** — the question/options can be edited but the category is locked. That is good for category integrity but means a mis-categorised draft, once approved, cannot be re-tagged through the patch path.
4. **The expert insight in `lifestyle`** (`lib/expert-insights.ts:221–244`) explicitly states "no right or wrong answer" and is structurally distinct in title and disclaimer from moral insights. Good — but again, this only fires if the category is right.

## 5. Post-vote insight review

### What the insight currently does (with file:line refs)

Two distinct insight surfaces exist on results today:

1. **`DilemmaInsightSection`** (`components/DilemmaInsightSection.tsx:1–107`, server-rendered, also rendered on play at `app/play/[id]/page.tsx:223` and on results at `app/results/[id]/page.tsx:170`):
   - Produces a per-category "Why this dilemma matters" / "What the split says" paragraph plus 2 deterministic discussion prompts.
   - Source data: `CATEGORY_CONTEXT` in `lib/dilemma-seo-insights.ts:62–408` — 9 categories × 2 locales × {framings: 3 variants, tensions: 3 variants, prompts: 4 variants, splitFallback: 1 string}.
   - Choice of variant is deterministic by hash of `${category}|${question}` (`dilemma-seo-insights.ts:436–448`).
   - This is **rendered for everyone, voted or not** (not personalised, but does interpolate vote `pctA/pctB/total` on results when present, `dilemma-seo-insights.ts:515–556`).

2. **`getExpertInsight`** (`lib/expert-insights.ts:247–249`, consumed only by `app/results/[id]/ResultsClientPage.tsx:214` inside a collapsed `<details>` element, lines 757–819):
   - Returns one of 9 hard-coded category-level insights (8 moral + 1 lifestyle), per locale.
   - Has `title`, `expertType` ("Ethics", "Political Philosophy", "Decision Science", etc.), a 3–5 sentence `body`, a `whyPeopleSplit` paragraph, an `a`/`b` "what your answer may suggest" pair, and a `disclaimer`.
   - The `whatYourAnswerMaySuggest.a` or `.b` text is shown **only when the user has voted** (ResultsClientPage.tsx:802–813).
   - Dynamic AI-generated overrides per dilemma exist as types (`expert-insights.ts:19–23`, `dynamic-scenarios.ts:135–137`, applied in ResultsClientPage.tsx:218–225) — but only override fields that are actually populated. No evidence in the read paths that a generation pipeline currently populates these for the live ~779 dynamic dilemmas at scale (the type is just a hook).

### Strengths

- **Honest about non-representativeness** — both insight surfaces frame as "SplitVote voters" not "the world" (`dilemma-seo-insights.ts:12,512–513`). No "73% of users prefer" framing anywhere I read; this rule is respected throughout.
- **The expert insight body is actually well-written.** The morality body (lines 33–34) and the loyalty body (lines 201) are genuinely interpretive — they explain *why* people split, not just *that* they do.
- **The per-vote "what your choice may suggest"** (`expert-insights.ts:35–38` and the parallel `a`/`b` pairs in every category) **is the closest the product gets to "interpret my choice"** — and it lands when present.
- **Two-surface stacking gives breathing room** — the inline section frames the dilemma, the collapsible expands depth. Good for users who don't want the lecture.

### Gaps — what's missing for "depth after voting"

1. **Insights are per-category, not per-dilemma.** A user who votes 3 morality dilemmas in a session reads the **same** "trolley problem has been studied for decades…" body 3 times (expert-insights.ts:33–34). After the second time it stops being insight and starts being filler.
2. **The "what your choice may suggest" pair is also per-category.** The text for choosing `a` in `morality` (line 36) reads the same whether the user voted on the trolley or on `cure-secret` or on `mercy-kill`. The actual decision the user made is invisible to the insight.
3. **No mention of the specific tradeoff the user just made.** A user who picked "harvest the organs" sees a category-level Kantian-vs-consequentialist body but no acknowledgement that *they* just endorsed the unpopular consequentialist option in a deeply specific scene. The moment-of-reflection the prompt is asking about doesn't fire because the insight is too zoomed out.
4. **The percentage split is the strongest depth signal and is the most prominent thing on the page** — which is fine. But once the user has absorbed "you're 18% minority", the rest of the page is share/CTAs. There's no "people who picked A also picked X on dilemma Y" cross-dilemma pattern, no historical "you tend to pick…" pattern even for logged-in users on this page. (Personality teaser exists, lines 1106–1132, but it's a CTA to a separate page, not depth in place.)
5. **No mode for the user to argue back.** Some of the strongest research-stage moral psychology engagement comes from "now justify your answer in one sentence" → comparing justifications. Today the user gets `🔥 / 👎` feedback buttons (lines 832–868) on the dilemma quality, not on their own reasoning.
6. **Dynamic AI insight per-dilemma is a hook with no producer.** The schema exists; populating it would unlock the per-dilemma upgrade with no UI work — the override already merges into the rendered insight (ResultsClientPage.tsx:218–225). The block is the generation pipeline.

### Per-dilemma vs per-category opportunity

The codebase **already supports per-dilemma insight overrides** (the merge logic in ResultsClientPage.tsx:218–225 cleanly falls back to category if the dynamic field is empty). The blocking work is:

- A generation step that produces `body` / `whyPeopleSplit` / `whatYourAnswerMaySuggest` per dilemma — either at static-41 author time (one-off content sprint) or at AI-generation time (add to the same Anthropic call that already produces the dilemma).
- Light gate verification that the generated override is on-topic to the specific question/options (cheap: token overlap check against `question`).

The category-level insight should stay as the fallback (some dynamic dilemmas will not get a custom override, e.g. low-quality ones). The depth upgrade is the **override path**, not a replacement.

## 6. Suggested quality rubric for future dilemmas

Five axes, each scored 0/1/2. A dilemma is **publish-ready** at score ≥ 7/10, **review-required** at 5–6, **reject** at ≤ 4. Designed to fit inline in a prompt or a manual reviewer's checklist.

| Axis | 0 | 1 | 2 |
|---|---|---|---|
| **Real moral tradeoff** | One option is obviously right; the other is straw-man or evil. | Both options have some moral content but one is meaningfully harder to defend. | Both options actively cost something the voter cares about; the choice is a real trade, not a sort. |
| **Both options defensible** | No coherent value system supports the unpopular option. | Some value system supports it but only if pushed hard. | Each option is naturally defended by a different recognised value system (consequentialism / deontology / care / virtue / loyalty / autonomy / etc.) without contortion. |
| **Emotional/social consequence** | Abstract or philosophical — no scene the voter can picture. | A scene exists but the voter doesn't pay a personal cost in it. | The voter can imagine themselves in the scene, and the choice changes how someone close to them would see them. |
| **Reveals a moral axis** | The dilemma doesn't map to any named axis; voting reveals nothing. | The dilemma maps to an axis but the options don't separate cleanly along it. | Picking A vs B cleanly indicates a position on a recognisable axis (loyalty vs justice, near vs far, action vs omission, rule vs context, autonomy vs paternalism, individual vs collective, etc.). |
| **Avoids abstract/obvious/silly/generic** | Magic stipulation, sci-fi cartoon, or policy-survey item. | Concrete but generic; reads like it could be 50 different dilemmas. | Specific, vivid stakes the voter can picture in seconds, no fictional empirical claims required. |

Inline-prompt-ready phrasing:

```
Before writing, mentally score the dilemma you're about to generate on each axis 0–2:
  1. Real moral tradeoff
  2. Both options defensible by a coherent value system
  3. Emotional/social consequence the voter can picture
  4. Cleanly reveals a moral axis (name it)
  5. Avoids abstract/obvious/silly/policy-survey framing
If total < 7/10, rewrite before producing JSON.
Bonus rules:
  - Phrase both options with the same emotional charge. No "Never. You cannot…" vs "Yes. Math says…".
  - No magic empirical stipulations ("studies show X%", "+N% improvement", "X% more accurate").
  - Name the moral axis in the `rationale` field so the gate can verify it.
```

## 7. Recommended changes (no implementation)

### To prompts (`lib/content-generation-prompts.ts`)

- **Add the 5-axis self-scoring instruction** above into the `buildDilemmaPrompt` system or prompt body (current Requirements list, lines 100–108).
- **Add a "no magic stipulation" rule** to `SAFETY_RULES`: forbid "studies show", "% more accurate", "+N%", "experts agree" inside the question text.
- **Add a "symmetric option phrasing" rule**: each option must be emotionally balanced — either both imperative, both conditional, or both descriptive. No option may use morally loaded adjectives ("innocent", "evil", "wrong") that the other option does not also rebut.
- **Require `rationale` to name the moral axis** (e.g. `"moralAxis": "loyalty vs justice"`) — small JSON field addition.
- **Require an `expertInsight` block in the JSON output** (body + whyPeopleSplit + whatYourAnswerMaySuggest{a,b}) so per-dilemma override populates at generation time. The override merge in `ResultsClientPage.tsx:218–225` already supports this end-to-end.

### To quality gates (`lib/content-quality-gates.ts`)

- **Add a soft "depth" check** that fires only if `dilemmaStyle === 'moral'` or category ≠ 'lifestyle':
  - Reject if `question` contains a magic-stipulation pattern (regex on `/(studies? show|\d+%\s+(more|fewer|less)|\+\d+%|experts? agree|proven to|guarantees?\b)/i`).
  - Reject if either option starts with a polarising adverb-only label that the other option doesn't ("Never.", "Always.", "Yes.", "No.") **and** the lengths differ by more than 2:1 — symmetric-label heuristic.
  - Warn (not reject) if `moralAxis` is absent from the AI response (need prompt change first).
- **Add cross-check between `dilemmaStyle` and `category`**: if `category === 'lifestyle'` then `dilemmaStyle` must be `'lifestyle'`; if `dilemmaStyle === 'lifestyle'` then `category` must be `'lifestyle'`. Today these are independent.
- **Optionally raise** the autopublish moral final-score threshold from 75 (`AUTOPUBLISH_FINALSCORE_THRESHOLD`, line 31) to 80 *after* the rubric is wired, since the score will become a more discriminating signal.

### To post-vote insight (`lib/expert-insights.ts` + `app/results/[id]/ResultsClientPage.tsx`)

- **Per-dilemma override generation for the static-41**: write one `expertInsightEn` and one `expertInsightIt` for each of the 41 (~80 fields total at ~300 chars each, one short content sprint). Inject by either co-locating them in `lib/scenarios.ts` or by extending `getExpertInsight` to consult a `STATIC_OVERRIDES` map keyed by scenario id.
- **Surface the option the user picked** in the "what your choice may suggest" block: today it shows `expertInsight.whatYourAnswerMaySuggest.a/b` (ResultsClientPage.tsx:807–810) but does not echo `scenario.optionA/B`. Echoing the literal text the user chose, then the interpretation, lands the moment.
- **Add a one-sentence "moral axis" caption** to the insight block (e.g. "This dilemma maps to: rule vs mercy") — directly readable, supports the rubric, and increases cross-dilemma sense-making over a session.
- **For logged-in users with vote history**: show a single sentence comparing this choice with their own past pattern (e.g. "You usually pick the rule-following side. This time you didn't."). Requires reading `dilemma_votes` server-side at render — non-trivial but high-value.
- **Optionally**: replace the `feedbackQuestion` "Was this dilemma interesting?" with an additional "Was this dilemma honest? Both sides defensible?" question. The current binary collects engagement, not depth signal — a depth signal would feed back into the gate.

### Optional: rewriting the static-41 — top 5 candidates from §3

Rank-ordered for ROI (impact on perceived depth × low risk of regression):

1. **`deepfake-expose`** — the existing premise contradicts the very framing the site is trying to teach. High symbolic win.
2. **`tax-billionaires`** — most visible "policy-survey-disguised-as-dilemma" item; rewrite shifts it toward a genuine tradeoff and disarms the strawman.
3. **`rich-or-fair`** — magic-stipulation killer item, easy to make concrete.
4. **`ai-replaces-jobs`** — self-contradicts the generation prompt's own rule. Symbolic win + concrete improvement.
5. **`prison-abolition`** — magic empirical stipulation pre-resolves the question; the rewritten "would you let them live nearby without being told" version makes the actual moral cost visible.

Defer the other 5 weakest until after the rubric and per-dilemma insight overrides are wired, so the rewrites can include matching insight overrides in the same sprint.

## 8. Files touched

- Created: `reports/dilemma-depth-audit-2026-05-19.md` (this file).
- No other files created or modified.
- No `/tmp/` scratch files created.

## 9. Residual risk

Confidence in the conclusions would change if I had access to:

- **Live Redis sample of the 779 dynamic dilemmas.** I can audit the prompts and gates as published. I cannot read whether the actual output looks more or less like the static-41 weakest patterns. The dynamic pool could be far better, or far worse, than my gate analysis predicts.
- **GA/feedback telemetry on the `🔥 Interesting / 👎 Not for me` buttons.** If certain dilemma archetypes already get disproportionate 👎 ratings, my "weakest 10" list should be reordered to match.
- **A/B data on the percentage of users who open the collapsible expert insight.** If usage is low, the per-dilemma insight upgrade has less leverage and the rubric upgrade has more.
- **PM judgement on tone.** Some of my rewrites tighten the moral teeth (e.g. `prison-abolition`'s "would you let them live nearby"). PM may judge that direction too dark for SplitVote's voice. The rubric is tone-neutral; the specific rewrites are not.
- **Per-locale (IT) depth audit.** I trusted the prompt's claim that static-41 dilemmas are language-neutral via i18n. If specific IT framings of dynamic dilemmas land differently in Italian, my recommendations may miss IT-specific patterns.

## 10. Recommendation

**Next sprint: `DILEMMA-DEPTH-RUBRIC-01`.**

Scope: encode the §6 5-axis rubric into `lib/content-generation-prompts.ts` (prompt-side instruction + required `moralAxis` and `expertInsight` JSON fields) and `lib/content-quality-gates.ts` (soft depth gate: magic-stipulation regex, symmetric-label heuristic, `category`/`dilemmaStyle` cross-check). No static-41 rewrites yet; dry-run new gate against the existing dynamic pool to confirm false-positive rate is acceptable before turning on rejection.

Trade-off accepted: a stricter gate will probably reject 10–30% more candidates and slow the daily approved-dilemma throughput. We accept that throughput cost because the bet is depth-per-dilemma, not volume-per-day, and the gate is reversible.

`git diff --check` will run after this file is written.

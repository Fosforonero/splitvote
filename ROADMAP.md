# SplitVote — Roadmap

> Piattaforma globale di behavioral data gamificata.
> Dilemmi morali in tempo reale → profili morali → loop virali → insight aggregati.

Ultimo aggiornamento: 21 Maggio 2026 (afternoon update) — **PM override**: AdSense review is noted but no longer a product freeze. Product iteration continues. PM insight: the post-vote reveal is the core retention hook (social comparison / self-positioning), not the vote itself. Next sprint candidate: `REVEAL-SELF-POSITIONING-COPY-01`.

---

## 21 May 2026 (afternoon update) — PM override: AdSense not a blocker; reveal loop prioritized

**PM directive**: AdSense review is **no longer a product freeze constraint**. Product development and launch iteration continue. Public changes ship when they improve the product and pass normal QA. AdSense-specific files (`<AdSlot>`, `public/ads.txt`, AdSense loader, Consent Mode v2 signals) still get extra care, but they are not a roadmap blocker. If AdSense rejects post-change, the site can be resubmitted later. The morning's freeze framing (see below) is **superseded**.

**PM product insight**: the SplitVote loop people respond to is not the vote — it's the **post-vote reveal**. Seeing whether you are in the majority, minority, near-even split, or against a landslide is the actual product hook: social comparison, self-positioning, identity interpretation. The architecture already supports this — the 6-state `revealState` enum and EN+IT copy strings live in `app/results/[id]/ResultsClientPage.tsx`, shipped 20 May (`8638c96` UX + `1384296` instrumentation). What's missing is **copy that lands the self-positioning moment harder**.

### Next candidates (post-PM override)

| # | Sprint | Status | Notes |
|---|---|---|---|
| **A** | **`REVEAL-SELF-POSITIONING-COPY-01`** | **Top — implementation-ready** | Sharpen the 5 reveal desc strings (EN + IT parity) in `app/results/[id]/ResultsClientPage.tsx` (lines `:47-55` EN, `:125-133` IT) to lean harder into identity/self-positioning language. Copy-only, single file, ~20-30 LOC. Risk: low — same surface was tuned 8 days ago without regressions. |
| B | `DILEMMA-QUALITY-RUBRIC-01` | Draft sitting locally — awaiting PM review | `docs/dilemma-quality-rubric.md` drafted earlier today (250 LOC). 6-axis editorial framework (divisiveness, identity_relevance, moral_tension, ambiguity, curiosity_potential, emotional_weight). Internal-only, not an auto-publish gate. **Awaiting PM review** before commit. |
| C | `PIXIE-PIPELINE-VISUAL-QA-PREP-01` | Ready | Read-only audit of 72 Pixie PNG diffs species-by-species + contact-sheet report. Does NOT ship the PNG ship itself. ~45 min. |
| D | `SEO-IT-LEALTA-ONESTA-DIFFERENZE-FAQ-01` | Ready (unblocked by override) | IT FAQ Q&A on `lealta-vs-onesta` blog — see backlog table below. ~15 LOC. |
| E | `SEO-LOYALTY-HONESTY-SNIPPET-TUNE-01` | Ready (unblocked) | EN meta + intro tune. ~5 LOC. |
| F | `SEO-TROLLEY-FOOTBRIDGE-STATS-META-01` | Ready (unblocked) | EN meta tune. ~2 LOC. |

PM priority order (afternoon directive): **A first** (reveal-loop is the core product hook), then C/B in parallel as PM time allows, then SEO sprints in batch.

### SEO backlog (from 21 May 2026 GSC query snapshot, no longer freeze-gated)

22 impressions / 0 clicks across 9 queries; 7 of 9 cluster on loyalty/honesty/truth (EN + IT). Existing pages already cover the topics — gap is at the snippet/FAQ/meta layer. No new URLs proposed.

| # | Sprint | Locale | URL type | Target queries (imp) | Effort |
|---|---|---|---|---|---|
| A | `SEO-IT-LEALTA-ONESTA-DIFFERENZE-FAQ-01` | IT | existing blog `lealta-vs-onesta-quando-le-due-virtu-non-possono-coesistere` | `lealtà e onestà differenze` (1), `differenza tra onestà e lealtà` (1) | ~15 LOC, single file |
| B | `SEO-LOYALTY-HONESTY-SNIPPET-TUNE-01` | EN | existing blog `loyalty-vs-honesty-when-they-collide` | `loyalty and honesty` (3), `truth vs loyalty` (1), `honesty and loyalty` (1) | ~5 LOC |
| C | `SEO-TROLLEY-FOOTBRIDGE-STATS-META-01` | EN | existing blog `trolley-problem-statistics` | `trolley problem footbridge variant approval rate` (1) | ~2 LOC |

Brand queries (`split vote` 11 imp, `vote split` 2 imp, `split the vote` 1 imp = 14 total) need no action — brand discovery is healthy.

### Morning posture (superseded)

> **Note**: the morning entry below treated AdSense submission as a freeze constraint. **Superseded by the PM override above.** Kept for historical context only.

### Morning context (21 May 2026)

**AdSense review submitted** earlier today and is currently in progress. The morning posture treated this as a public-surface freeze; the afternoon PM override lifted that constraint.

**Internal ships today** (no public behavior change): repo hygiene + `.vercelignore` (`4d170b8`), content-generation clarity guard for admin/cron path (`09a454c`), Codex governance pointer (`c3945a9`), reports backfill (`6e08252`), PRODUCT_STRATEGY update for emotional recognition loop (`a7edae6`).

---

## 20 May 2026 — Emotional Recognition Loop + Retention Instrumentation ✅ DONE

Six commits shipped today completing Phase 1 + Phase 2 of the emotional recognition loop and adding retention-driver instrumentation.

**Deployed today:**

- `e185caa fix(analytics): remove GA4 first-party proxy to restore visitor geo` — GA4 now loads direct from `googletagmanager.com` (proxy was collapsing all visitor geo to Vercel edge IP — IT was 0% in GA4 while Vercel showed 59%). Commit was made late 19 May locally; pushed as the first deploy of 20 May.
- `8638c96 feat(results): sharpen post-vote reveal feedback` — Phase 1: shorter EN/IT reveal copy (tie/minority/majority/close/landslide), distinct TIE (symmetric red→purple→blue gradient) + LANDSLIDE (green→amber) visuals, bar fill animation 1000ms → 450ms, percentage opacity reveal 300ms, motion-reduce safe.
- `8f93c13 feat(routing): prefer same-category next dilemmas` — Phase 2.1: soft same-category preference in `getFreshNextScenarioId` (threshold ≥ 3 fresh same-cat items; backward-compatible signature). New `tests/unit/next-dilemma-affinity.test.ts` with 7 deterministic cases.
- `56dc73e fix(results): show sticky next after inline cta scrolls out` — `IntersectionObserver`-driven sticky bar: shows only when the inline Next CTA is off-screen. Graceful degradation when IO unavailable.
- `6e03d14 copy(home): clarify anonymous vote loop` — Home EN/IT hero + game-loop step 3 now say "Build your moral profile" / "Fai crescere il tuo profilo morale".
- `1384296 feat(analytics): add reveal state to results events` — Phase 2.5 instrumentation: enriched `result_viewed`, `next_dilemma_clicked`, `share_clicked` (results-page sites only) with `reveal_state` + conditional `reveal_pct_voted` (and `previous_*` on `next_dilemma_clicked`). **NO new event names.**

**Production smoke** (post-push for each): all curl-based markup checks green on `/results/trolley?voted=a|b` + `/it/results/trolley?voted=a`. Sticky markup + Phase 1 animation classes + motion-reduce variants + AdSlot gate (0 on trolley total=12) all confirmed.

**LEGAL.md**: trigger assessed for each commit — no new data processors, no new cookies, no new server-side persistence, no new consent surface, no new public-facing user-data categories. Privacy Policy and Terms unchanged. Internal LEGAL.md "Recent sprints" entry added for `REVEAL-STATE-INSTRUMENTATION-01`.

**Vercel performance**: no CPU warning today. Six pushes batched across the day (PM approved each individually after diff review). Yesterday's mitigations (sitemap ISR + API edge cache) remain in effect.

### Next candidates (tomorrow, priority order)

| # | Sprint | Status | Notes |
|---|---|---|---|
| A | `WIP-TRIAGE-AND-BRANCH-HYGIENE-01` | Ready (top) | PM-led triage of 77 M + 14 ?? files still in working tree (PRODUCT_STRATEGY.md, content-generation-*, content-quality-gates, ~70 Pixie PNGs, scripts WIP, untracked reports). Decide which to ship, merge, split, or discard. Pre-requisite for several downstream sprints. |
| B | `CONTENT-GENERATION-CLARITY-GUARD-SHIP-01` | Conditional on A | Ship the existing PM WIP on `lib/content-generation-*.ts` + `lib/content-quality-gates.ts` if it's complete and reviewed. Code-only, no DB / Redis. |
| C | `DILEMMA-QUALITY-RUBRIC-01` | Ready, independent | Docs-only spec for the dilemma quality scoring rubric (divisiveness, identity_relevance, moral_tension, ambiguity, curiosity_potential, emotional_weight) — drafted in the Phase 2 audit, formalize and commit. ~1 h. No code. |
| D | `PIXIE-ASSETS-WIP-AUDIT-01` | Ready, independent | Audit the ~70 PNG WIP in `public/pixie/**` — what's being updated, what's stale, what's intentional. Likely PM-led visual review; report-only. |
| E | `GA4-RETENTION-DIMENSIONS-QA-01` | Conditional on Vercel live + GA4 custom dimensions registered | Verify `reveal_state` / `reveal_pct_voted` / `previous_reveal_state` / `previous_reveal_pct_voted` arrive correctly in GA4 DebugView; build a single Exploration in GA4 to visualize reveal_state distribution over a 7-day rolling window. PM-side; no code. |

Removed from queue: `ADSENSE-REVIEW-READY-CHECKLIST-01` was already closed earlier; AdSense re-review submission remains HUMAN_ONLY pending PM action.

---

## 19 May 2026 (end of day) — AdSense remediation + Stripe QA + Vercel mitigation ✅ DONE

AdSense rejected the site again for "Contenuti di scarso valore". Full Phase 1 defensive remediation + Phase 2 substantive remediation shipped in the same day. Plus a side bugfix on results-page UX and CPU mitigations after a Vercel Fluid Active CPU warning.

**Deployed today:**
- `2776c4b perf(sitemap): hourly ISR revalidate to cut crawler CPU` — Vercel CPU mitigation #1.
- `db4d161 perf(api): cache aggregate results responses` — Vercel CPU mitigation #2 (15s edge cache + SWR).
- `d3b2d9b docs(adsense): audit low-value content risks` — read-only audit, root-cause analysis, Phase 1/2 plan.
- `87741d5 fix(adsense): suppress ads on thin review-risk surfaces` — Phase 1 gates: `<AdSlot>` only renders on play/results when `hasStaticInsight(id)`; results adds `total >= 50` gate; `/store` + `/it/store` noindex + sitemap removal; dynamic AI play/results noindex.
- `c88beaf fix(results): add vote CTA for unvoted dilemmas` — unrelated bugfix surfaced by PM during today's deploy: results pages had no path back to `/play/<id>` for unvoted users. Server now passes `hasVoted` to client; client renders "Vote on this dilemma →" card when neither `voted` (searchParam) nor `hasVoted` (cookie/Supabase) is set.
- `19a020b feat(content): add per-id insights for all static dilemmas` — Phase 2 substantive: insight coverage 5 → 41 static IDs (EN+IT, 328 substantive strings). Tests extended to enforce 41/41 coverage and forbidden-claim sweeps. The Phase 1 gate now opens for every static dilemma as soon as it crosses 50 votes.

**Production smoke** (post-deploy): all 7 checks passed — `/results/trolley`, `/it/results/trolley`, `/results/whistleblower`, `/it/results/whistleblower`, `/results/mercy-kill`, `/it/results/mercy-kill` all render per-id EN/IT insight bodies; sitemap holds 295 URLs (no `/store`); both store routes carry `robots: { index: false, follow: true }`.

**Stripe Premium QA** (separate docs-only closure today):
- `PREMIUM-STRIPE-LIVE-QA-01`: ✅ Checkout UI verified live by PM. Stripe Checkout opens on `splitvote.io/profile` and displays the Premium recurring monthly product correctly. The 29 Apr env-var fix is fully effective.
- ⏳ Live end-to-end payment (full webhook + entitlement cycle): not exercised this session. Residual risk small; not urgent.
- `STRIPE-STORE-COSMETICS-CHECKOUT-CONFIG-AUDIT-01`: closed as configuration-known/no-code. PM decision: defer Pixie/cosmetic one-time launch; keep all 14 Store products in graceful "coming soon" modal until business case justifies launch. Full code/migration/webhook is production-ready — only Stripe Products + 14 `STRIPE_PRICE_*` env vars remain unconfigured.

**Vercel performance**: 75% Fluid Active CPU warning received today. Mitigations `db4d161` + `2776c4b` deployed. Avoid nonessential deploys; batch future pushes. PM to recheck Vercel dashboard usage cycle in 24–48 h.

**LEGAL.md**: assessed for each commit — no new data processors, no new tracking, no new cookies, no new user data flows. The AdSense ad surface was *reduced*, not expanded. No public Privacy/Terms changes required. Logged in LEGAL.md "Recent sprints".

### Next candidates (tomorrow, priority order)

| # | Sprint | Status | Notes |
|---|---|---|---|
| A | `ADSENSE-REVIEW-READY-CHECKLIST-01` | Ready (top) | Read-only verification pass. Walks through `reports/adsense-low-value-remediation-audit-2026-05-19.md` "Do not request AdSense review until these are done" checklist; confirms each item is live in production; report green/red per line. Effort: ~1 h. |
| B | PM submits AdSense re-review | HUMAN_ONLY, conditional on A passing | After 24-48 h Googlebot recrawl window. PM action only — Claude cannot trigger AdSense from the dashboard. |
| C | `ABOUT-EDITORIAL-TRUST-ENRICHMENT-01` (or `EDITORIAL-POLICY-PAGE-01`) | Ready, conditional on AdSense re-review failing | If AdSense rejects again post-Phase-2, the next move is Phase 2 trust/E-E-A-T: enrich `/about` from ~300 to ~600-800 words, add `/editorial-policy` + `/methodology` pages (EN+IT), add `Person`-typed author byline on cornerstone blog posts. Estimated 4-6 h. |
| D | `GSC-EXPORT-CROSS-REFERENCE-01` | Blocked on PM | Unchanged — PM CSV export still pending. |
| E | `STRIPE-PREMIUM-LIVE-PAYMENT-01` | HUMAN_ONLY | One-off live €4.99 transaction (refundable from Stripe dashboard) to close the last open Stripe QA checkbox. Not urgent. |

Removed from queue: `PREMIUM-STRIPE-LIVE-QA-01` (checkout UI closed today; payment E2E split out as item E). `STRIPE-STORE-COSMETICS-CHECKOUT-CONFIG-AUDIT-01` (closed as configuration-known/no-code). `BLOG-INVALID-DILEMMA-ID-FIX-01` (audit was stale; `why-not-intervene` not in source — verified via `rg`).

---

## 19 May 2026 — IT topic landing parity audit ✅ DONE (no-op)

Phase 1 audit confirmed EN and IT topic landings already at perfect 1:1
reciprocal parity (11 EN + 11 IT in both `lib/seo-topics.ts` and the live
sitemap). The "19 EN / 12 IT" gap cited on 18 May was a counting artifact
in the GSC audit, not a real state — see Retraction 3 in
[reports/gsc-indexing-diagnosis-2026-05-18.md](reports/gsc-indexing-diagnosis-2026-05-18.md).

**Closed as no-op:**
- `IT-TOPIC-LANDING-PARITY-01` — zero missing IT landings; nothing to
  implement. Audit: [reports/it-topic-landing-parity-audit-2026-05-19.md](reports/it-topic-landing-parity-audit-2026-05-19.md).

**No runtime code touched.** Doc updates only:
`reports/it-topic-landing-parity-audit-2026-05-19.md` (new),
`reports/gsc-indexing-diagnosis-2026-05-18.md` (Errata Retraction 3),
`CURRENT_HANDOFF.md`, `ROADMAP.md`.

### Next candidates (post-19 May, priority order)

| # | Sprint | Status | Notes |
|---|---|---|---|
| A | `GSC-EXPORT-CROSS-REFERENCE-01` | Blocked on PM | Needs PM to export `Pages › Not indexed (Not found 404)` CSV from Search Console. Only path left for historical external 404s. |
| B | `BLOG-SEO-CONTENT-STRATEGY-01` | Ready (top unblocked) | Audit + update existing articles, plan cluster gaps + 2–3 new posts. Use `blog-seo-editor`. Report only, no auto-publish. |
| C | `PREMIUM-STRIPE-LIVE-QA-01` | HUMAN_ONLY | Manual live checkout QA on `price_1TQZuO6MLlYKqmclQm57kmvI` (€4.99/mo) if still pending per `LAUNCH_AUDIT.md`. Real card required. |
| D | `PIXIE-VISUAL-QA-POLISH-02` | Conditional | Only if PM visually finds a defect on /profile, /store, /dashboard, /u/[id], post-vote share. No queued issue today. |

Removed from queue: `IT-TOPIC-LANDING-PARITY-01` (closed as no-op).

---

## 18 May 2026 — SEO/Pixie/category closure day ✅ DONE

End-of-day status: SEO technical work closed; runtime code path stable.
Detail per-sprint, retractions, content inventory, and next-day priorities
are in [CURRENT_HANDOFF.md → Session 18 May](CURRENT_HANDOFF.md).

**Shipped (this week + today):**
- `SEO-TITLE-TEMPLATE-FIX-01` — removed duplicate `| SplitVote` suffix.
- `SEO-WORLD-WORDING-01` — copy/metadata aligned to "SplitVote voters".
- `IT-RESULTS-GRAMMAR-01` — IT grammar follow-up.
- `SITEMAP-I18N-CATEGORY-AUDIT-01` — EN+IT sitemap parity per category.
- `CATEGORY-HUBS-INTERNAL-LINKING-01` — category pages → discovery hubs.
- `CATEGORY-CONTENT-FAQ-PARITY-01` — lifestyle editorial + FAQ; 10 unit
  tests pass; 9 categories × 2 locales now have content parity.
- `RESULTS-PAGE-DEPTH-01` — dilemma insight sections on play + results.
- Pixie/store regression cluster (cosmetic ownership, equip flow,
  Nova/scintille mapping, Pixie selector, "no frame"/"no glow",
  per-species asset scaling).

**Closed as no-op:**
- `SEO-STALE-DYNAMIC-404-PROOF-01` — crawl of 22 source surfaces, 863
  unique `/play/*` and `/results/*` URLs, 863/863 = HTTP 200. Zero
  internal stale 404s. Mitigation sprint cancelled.
  Report: [reports/stale-dynamic-404-proof-2026-05-18.md](reports/stale-dynamic-404-proof-2026-05-18.md).

**Retracted (false positives from earlier audits, not regressions):**
- ~~`SEO-HREFLANG-BLOG-TOPICS-01`~~ — case-sensitive grep bug;
  296/296 URLs actually carry `hrefLang`.
- ~~`BLOG-INDEX-DEAD-LINK-AUDIT-01`~~ — auditor typo on slug; all 124
  internal blog links return 200.

**Content inventory verified live (18 May):** 41 static dilemmas, 779
dynamic approved in Redis, 0 dynamic drafts, 3 Redis blog published, 3
Redis blog drafts.

### Next candidates (tomorrow, priority order)

| # | Sprint | Status | Notes |
|---|---|---|---|
| A | `GSC-EXPORT-CROSS-REFERENCE-01` | Blocked on PM | Needs PM to export `Pages › Not indexed (Not found 404)` CSV from Search Console. Only path left for historical external 404s. |
| ~~B~~ | ~~`IT-TOPIC-LANDING-PARITY-01`~~ | ~~Ready~~ → **Closed no-op 19 May** | See 19 May section above. Premise (19 vs 12) was a counting artifact; actual state is 11+11 parity. |
| C | `BLOG-SEO-CONTENT-STRATEGY-01` | Ready | Audit + update existing articles, plan cluster gaps + 2–3 new posts. Use `blog-seo-editor`. Report only, no auto-publish. |
| D | `PREMIUM-STRIPE-LIVE-QA-01` | HUMAN_ONLY | Manual live checkout QA on `price_1TQZuO6MLlYKqmclQm57kmvI` (€4.99/mo) if still pending per `LAUNCH_AUDIT.md`. Real card required. |
| E | `PIXIE-VISUAL-QA-POLISH-02` | Conditional | Only if PM visually finds a defect on /profile, /store, /dashboard, /u/[id], post-vote share. No queued issue today. |

---

## 4 May 2026 — Lifestyle dilemmas + dataset import pipeline

**Obiettivo:** Aggiungere una categoria `lifestyle` per dilemmi giocosi (mare o montagna, estate o inverno, ecc.), pool di 40 seed topic per lingua, quality gate rilassate, e un endpoint di import diretto da dataset pubblici (ETHICS MIT, DailyDilemmas CC-BY-4.0).

**Shippato:**
- `lib/scenarios.ts` — aggiunto `'lifestyle'` alla union type `Category`
- `lib/dynamic-scenarios.ts` — campo `dilemmaStyle?: 'moral' | 'lifestyle'` su `DynamicScenario`
- `lib/content-generation-prompts.ts` — `buildLifestyleDilemmaPrompt()`: prompt giocoso, nessun framing morale, formato "X o Y?", category hardcoded a `lifestyle`
- `lib/content-quality-gates.ts` — `lifestyle` in `VALID_CATEGORIES`; `LIFESTYLE_AUTOPUBLISH_NOVELTY_THRESHOLD=10`, `LIFESTYLE_AUTOPUBLISH_FINALSCORE_THRESHOLD=30`; quality gate rilassate per lifestyle: question min 10 chars, option min 2 chars, language signal check saltato, similar items check saltato
- `lib/content-generation-validate.ts` — `lifestyle` in `VALID_CATEGORIES`
- `lib/expert-insights.ts` — fallback `lifestyle` EN/IT in `INSIGHTS`
- `app/api/admin/seed-draft-batch/route.ts` — param `style=lifestyle`; `LIFESTYLE_SEED_TOPICS` (40 per lingua); preflight e semantic review saltati per lifestyle; archetype check saltato; `dilemmaStyle` salvato sul scenario; `LIFESTYLE_NOVELTY_THRESHOLD=10`
- `app/api/admin/generate-draft/route.ts` — param `style=lifestyle`; routing al prompt lifestyle
- `app/api/admin/dataset-batch/route.ts` — nuovo endpoint bulk import senza AI; max 200 items/call; quality gate + novelty check (threshold=10); aggiornamento inventory intra-batch per dedup; attributable a dataset source; dataset consigliati: ETHICS (MIT), DailyDilemmas (CC-BY-4.0), Scruples (AllenAI)

**Come usare:**
- Generazione lifestyle: `POST /api/admin/seed-draft-batch` con `{ style: "lifestyle", locale: "it", count: 30 }`
- Import dataset: `POST /api/admin/dataset-batch` con `{ items: [...], dilemmaStyle: "moral" }`

---

## 4 May 2026 — Blog index pagination + IT translation fixes

**Obiettivo:** Ordinare gli articoli dal più recente al più vecchio, aggiungere paginazione responsive (9 per pagina desktop/tablet, 4 per pagina mobile), correggere frasi in inglese non tradotte negli articoli IT.

**Shippato:**
- `lib/blog.ts` — `getPostsByLocale` ora ordina per data discendente; fix "Would You Rather" → "Preferiresti" in 2 articoli IT (`domande-would-you-rather-difficili`, `dilemmi-morali-esempi`): title, seoTitle, tag, CTA labels
- `components/BlogGrid.tsx` — nuovo client component; paginazione viewport-aware (`ITEMS_DESKTOP=9`, `ITEMS_MOBILE=4`, breakpoint 768px); griglia `md:grid-cols-2 lg:grid-cols-3`; controlli prev/next EN/IT
- `app/blog/page.tsx` e `app/it/blog/page.tsx` — semplificati: usano `BlogGrid` invece del grid inline

---

## 4 May 2026 — Research Source Registry (internal foundation)

**Obiettivo:** Creare un registro TypeScript statico e versionato delle fonti autorevoli già usate nel trust layer, blog e landing pages. Foundation per futuri sprint di Content Intelligence, nuovi cluster SEO, e citazioni coerenti tra superfici.

**Shippato:**
- `lib/research-sources.ts` — nuovo file server-only (`import 'server-only'`); non importato da nessuna pagina pubblica in questo sprint
  - Tipi: `MoralCluster`, `SourceType`, `MoralAxisId` (locale, non accoppiato a `lib/personality.ts`), `ResearchSource`
  - Campi: `id`, `title`, `authors?`, `institution`, `url`, `type`, `openAccess`, `clusters`, `moralAxes`, `safeClaim`, `claimsToAvoid`, `citationStyle`, `requiresDisclaimer`, `contentOpportunities`, `addedAt`, `addedBy?`, `reviewedAt?`, `notes?`
  - `RESEARCH_SOURCES` — 10 fonti inserite (vedi tabella sotto)
  - Helper: `getResearchSourceById`, `getResearchSourcesByCluster`, `getResearchSourcesForLanding`

**Fonti inserite (10):**

| id | institution | clusters principali |
|---|---|---|
| `sep-moral-dilemmas` | SEP | trolley-problem, harm-prevention, deontology, loyalty-honesty |
| `sep-doing-allowing` | SEP | trolley-problem, harm-prevention |
| `moral-foundations-theory` | moralfoundations.org | moral-foundations, loyalty-honesty |
| `moral-machine-nature-2018` | MIT Media Lab / Nature | ai-ethics |
| `sep-privacy` | SEP | privacy, ai-ethics |
| `greene-moral-cognition` | Harvard University | experimental-moral-psychology |
| `sep-consequentialism` | SEP | consequentialism, trolley-problem |
| `sep-deontological-ethics` | SEP | deontology, trolley-problem, harm-prevention |
| `sep-experimental-moral-philosophy` | SEP | experimental-moral-psychology |
| `sep-virtue-ethics` | SEP | virtue-ethics |

**Note di framing applicate:**
- `safeClaim` in terza persona attributiva per tutte le fonti
- `claimsToAvoid` espliciti per prevenire overclaim su SplitVote
- `citationStyle: 'paraphrase-only'` per tutte le 10 fonti
- `requiresDisclaimer: true` su `moral-foundations-theory` e `greene-moral-cognition` (fonti spesso mal-parafrasate)
- `notes` su fonti fragili: `moralfoundations.org` (intermittente), `joshua-greene.net` (pagina personale)

**Non consumer-facing:** il file non è importato da nessuna pagina o componente in questo sprint. Content Intelligence admin MVP e integrazione nelle superfici pubbliche restano futuri.

**Verifiche:** typecheck ✅ — build ✅ — git diff --check ✅

---

## 4 May 2026 — Product explainer blog cluster EN/IT

**Obiettivo:** 4 articoli evergreen (EN + IT parity) che spiegano il prodotto senza marketing fluff. Goal: trust per AdSense review, ridurre thin-content risk, migliorare internal linking, dare valore ai nuovi utenti.

**Shippato:**
- `lib/blog.ts` — +4 EN posts + +4 IT posts (8 articoli totali); slug pairs con `alternateSlug` bidirezionale per hreflang automatico
  - `what-is-splitvote` / `cos-e-splitvote` — spiegazione prodotto, come funziona, per chi è
  - `how-anonymous-voting-works` / `come-funziona-il-voto-anonimo` — cookie locale, differenza senza/con account, aggregato ≠ identità, link a /privacy
  - `how-to-read-splitvote-results` / `come-leggere-i-risultati-splitvote` — cosa rappresenta la %, 50/50 vs 80/20, campione non rappresentativo
  - `what-your-moral-personality-means` / `cosa-significa-la-tua-personalita-morale` — 5 assi reali (Utility vs Principle, Freedom vs Safety, Loyalty vs Justice, Risk vs Caution, Individual vs Collective), 18 archetipi, framing entertainment

**Framing applicato:**
- Anonimato: "You can vote without creating an account" + "Anonymous votes use a local cookie" + "If you sign in, SplitVote can keep your vote history" — nessun claim assoluto su separazione identità
- Personalità: 5 assi da `lib/personality.ts` — nomi esatti, framing "inspired by moral psychology", non replica diretta di Moral Foundations Theory
- Risultati: "votes from SplitVote users, not a representative scientific sample" in ogni articolo risultati
- moralfoundations.org linkato solo nell'articolo personality, con framing prudente ("researchers who study moral foundations")
- Disclaimer obbligatorio in tutti gli 8 articoli

**Verifiche:** typecheck ✅ — build ✅ — git diff --check ✅

---

## 4 May 2026 — Research trust layer ✅ DONE

**Obiettivo:** aggiungere contesto accademico non prescrittivo su personality e topic landing pages per aumentare trust, ridurre thin-content risk AdSense, e migliorare SEO senza fare claim di validazione scientifica.

**Shippato:**
- `lib/seo-topics.ts` — +2 campi opzionali nel tipo `SeoTopic` (`researchNote`, `researchSources`); dati inline per tutti e 3 i topic pubblicati (trolley-problem, ai-ethics-dilemmas, loyalty-vs-honesty)
- `app/[topicSlug]/page.tsx` — blocco "Research background" condizionale (cyan, border-cyan-500/20) dopo la primary dilemma card; max 3 link autorizzati, disclaimer obbligatorio
- `app/personality/page.tsx` — blocco "Expert lens" tra "5 moral dimensions" e "18 archetypes"; 3 fonti EN; disclaimer
- `app/it/personality/page.tsx` — stessa struttura in IT ("Lettura esperta"); EN/IT parity

**Framing applicato:**
- Ogni nota usa "researchers study" / "philosophers explore" — nessun claim "SplitVote is validated by"
- Disclaimer fisso: "SplitVote is for entertainment and aggregate insight, not a scientific test." (IT: "...non come test scientifico.")
- Tutti i link con `target="_blank"` + `rel="noopener noreferrer"`

**Fonti usate:**
- `/trolley-problem`: Stanford Encyclopedia (Moral Dilemmas + Doing vs. Allowing Harm)
- `/ai-ethics-dilemmas`: Moral Machine / Nature 2018 + Stanford Encyclopedia (Privacy)
- `/loyalty-vs-honesty`: Moral Foundations Theory + Stanford Encyclopedia (Moral Dilemmas)
- `/personality` + `/it/personality`: Moral Foundations Theory + Stanford Encyclopedia (Experimental Moral Philosophy) + Joshua Greene / Harvard

**LEGAL.md**: nessun nuovo data processor, tracking, o claim legale — link statici a risorse terze. Nessun aggiornamento richiesto.

**Commit proposta:** `feat: add research-backed trust layer`

---

## 4 May 2026 — SEO/AdSense P2: personality SSR + internal links ✅ DONE (pending commit)

**Obiettivo:** ridurre thin-content risk per la revisione AdSense e rafforzare internal linking.

**Shippato:**
- `app/personality/page.tsx` — SSR intro block (H1, intro, 3-step how-it-works, 5 moral axes, 18-archetype grid emoji+name, CTA → /play/trolley + /trending, disclaimer) sopra `PersonalityClient`; fix hreflang `'it'` → `'it-IT'`
- `app/it/personality/page.tsx` — stesso SSR block in IT (nameIt, axesIt); CTA → /it/play/trolley + /it/trending
- `app/personality/PersonalityClient.tsx` — demote semantico `<h1>` → `<h2>` in tutti e tre gli stati (unlock, almost-there, profile); nessun cambio comportamentale
- `app/moral-dilemmas/page.tsx` — sezione play links (5 link diretti a scenari reali) + cross-links arricchito con /trending e /personality
- `app/would-you-rather-questions/page.tsx` — stesso trattamento EN
- `app/it/dilemmi-morali/page.tsx` — play links IT + cross-links con /it/trending e /it/personality
- `app/it/domande-would-you-rather/page.tsx` — play links IT + cross-links

**Commit proposta:** `fix: strengthen seo content for adsense readiness`

**Residui / next:**
- AdSense dashboard: creare ad units reali, impostare env vars su Vercel, fare redeploy, poi richiedere revisione AdSense

Legal/compliance tracker: `LEGAL.md`. Ogni sprint che tocca cookie, analytics, ads, auth/account data, pagamenti, AI content, email, geo feature o profili pubblici deve controllarlo e aggiornarlo se cambia il trattamento dati o la superficie legale.

Product strategy tracker: `PRODUCT_STRATEGY.md`. Usarlo per scegliere e delimitare sprint su premium/VIP, poll submission, personality sharing, bacheca pubblica, quest, cosmetici, micro-learning e community.

Claude Code guide: `CLAUDE.md`. Usarlo come guida operativa per ogni sprint; gli agenti specialistici vivono in `.claude/agents/`.

Design governance: `DESIGN.md` aggiunto (3 Maggio 2026) — token ufficiali, regole componenti, copy tone, vincoli accessibilità. Obbligatorio per ogni sprint UI/UX.

---

## Future Track — Mobile App Readiness

**Non è uno sprint attivo.** Web-first rimane la priorità. Queste fasi sono gate di readiness per un eventuale rilascio su app store.

**Decisione (28 Apr 2026):** nessuna app nativa ora. Un unico agente copre l'intero track: `.claude/agents/mobile-app-readiness-reviewer.md`.

| Fase | Stato | Gate richiesto |
|---|---|---|
| Phase 0 — Web mobile hardening | ⚠️ Parziale (landscape/portrait fix 28 Apr) | Prima di PWA |
| Phase 1 — PWA foundation | 🔲 Non iniziato | Phase 0 completo |
| Phase 2 — Store policy audit | 🔲 Non iniziato | Phase 1 + decisione iOS IAP |
| Phase 3 — Android wrapper (TWA/Capacitor) | 🔲 Non iniziato | Phase 2 completo |
| Phase 4 — iOS wrapper (Capacitor) | 🔲 Non iniziato | Phase 3 o decisione PM |

**Blockers critici prima di qualsiasi store submission:**
- ~~Account deletion in-app flow~~ — **✅ Implementato 1 Maggio 2026** (Danger zone in /profile → DELETE/ELIMINA confirmation → auth.admin.deleteUser cascade). Pending deploy + QA.
- Decisione iOS IAP vs Stripe web checkout (rischio policy Apple — vedi `PRODUCT_STRATEGY.md → Phase 2`)
- QA su dispositivi reali (non solo DevTools)

Agente da usare: `.claude/agents/mobile-app-readiness-reviewer.md`
Strategia dettagliata: `PRODUCT_STRATEGY.md → Mobile App Readiness`

---

## 1 May 2026 — QA Closure ✅ GO

**Shipped today (29 Apr 2026, 17 commits):**
✅ Role management MVP · Category editorial SEO · Stripe env fix (docs) · Mission claim reminders · Feedback scoring hardening · Homepage CTA · Viral share copy · Mobile nav landscape fix · Admin roles mobile fix · Governed seed batch · Preflight similarity guard · Dynamic pool uncapped · Admin totals fix · Seed topic diversity · Novelty-first generation · Semantic novelty review

**Shipped (30 Apr 2026, session 1):**
✅ Post-vote delayed social comparison reveal — committed `8a5dbad`, pending deploy + QA

**Shipped (30 Apr 2026, session 2 — AI hardening):**
✅ Feedback counter fix — Redis as source of truth for admin (real anonymous + logged-in totals); Supabase view is logged-in-only fallback — f1a0e95 · 3d258f5
✅ AI generation hardening — cross-locale semantic dedup (EN↔IT parity via [EN]/[IT] prefixed items in reviewer), intra-batch draft visibility, `rejectionReason` admin display, anti-template prompt guardrails (3 new SAFETY_RULES) — ebab0b1
✅ SEED_TOPICS cleanup — 21 IT mirror topics + 1 EN trolley variant replaced; 64 topics cover distinct moral angles per locale-category pair — b3ef8df

**Shipped (1 May 2026, session 3 — QA closure + hotfix):**
✅ Admin seed batch chunked mode — `SeedBatchPanel.tsx`: N sequential POSTs of count=1; progress bar; cancel; per-item error; autoPublish disabled — `9872404`
✅ Reset IT hotfix — `handleReset` uses `/it/reset-password` (clean path); `next.config.js` redirects `/it/reset-password` → `/reset-password?locale=it` and `/it/login` → `/login?locale=it` — `5560c84`

**Shipped (1 May 2026, session 4 — AI dry-run gate + semantic review fix):**
✅ AI semantic review intra-batch dedup fix — `buildComparisonItems` 4th pass (same-locale, any-category, `ai_generated`, max 3) catches within-batch thematic repeats across category boundaries; timeout 10s→20s — `c85e55c`

### ⚠️ Security / QA Warning

- **Do not use admin or real personal accounts for QA auth or destructive flows.** Use throwaway accounts only.
- **mat.pizzi@gmail.com password was temporarily changed during QA (1 May 2026)** and must be rotated privately.

### Needs QA

- [ ] Stripe Premium checkout live UI — recurring monthly plan shown, end-to-end payment with real card
- [ ] Name-change live checkout
- [ ] Delayed reveal mobile portrait/landscape — after deploy
- [ ] Delayed reveal prefers-reduced-motion — DevTools emulation after deploy
- [x] **Reset password QA — ✅ PASS (EN + IT verified 1 May 2026, post-deploy 5560c84)**
- [x] **Blog Draft Queue QA — ✅ PASS (verified 1 May 2026)** — save/approve(status only)/reject; no auto-publish confirmed
- [x] **Account deletion QA — ✅ PASS (throwaway account, 1 May 2026)** — DELETE gate, delete→logout→home, premium block; admin accounts NOT tested (skip)
- [x] **AI generation dry-run — ✅ PARTIAL PASS (session 3, dryRun ON, 1 May 2026)** — semantic dedup, chunked progress, cancel, autoPublish disabled confirmed
- [x] **AI generation full gate — COMPLETED session 4, classified C/E2** — fix `c85e55c` deployed; save mode still blocked
- [ ] **AI generation re-QA — 4 scenarios** — requires: `OPENROUTER_MODEL_REVIEW=openai/gpt-4o-mini` in Vercel Production + manual redeploy. Gates save mode and bulk IT generation.

### Started / Partially Implemented

- **Auth recovery** — Reset password flow implemented locally (pending deploy + QA): login → "Forgot password?" → email → `/reset-password` → update password. IT locale path via `?locale=it`. AuthButton locale fix (IT navbar "Unisciti →" links to `/login?locale=it`).
- **Social comparison layer** — Phase 1 (500ms reveal) shipped; analytics events + reconsideration prompt not started
- **AI generation at scale** — hardening shipped (cross-locale dedup, intra-batch visibility, rejectionReason, SEED_TOPICS cleanup, prompt guardrails); production dry-run QA pending; save mode gated by dry-run result; progress bar UX not started
- **Blog generation pipeline** — static articles done; Blog Draft Queue implemented locally (pending deploy + QA) — save/list/approve/reject in Redis, admin-only, approve ≠ publish live; generation quality audit not started
- **Stripe live QA** — config fixed, Preview QA done; end-to-end live payment not done

### Candidate Sprints

**PM priority order (updated 3 Maggio 2026):**

1. ~~**Vote reconsideration within window**~~ — ✅ **Client UX affordance shipped (3 Maggio 2026)**: opposite option is now a `<button>` with grace countdown when `canStillChange === true`; locked state unchanged; EN/IT copy parity. API already handled `can_change_until`; no API/schema changes. Residual: `canStillChange` reactivity in 60s tick; `vote_change` analytics event (LEGAL.md check required before adding).
2. ~~**Home/trending already-voted behavior**~~ — ✅ **P1 shipped (3 Maggio 2026)**: `VotedDilemmaCard` wrapper (cookie `sv_voted_{id}=`, badge + href swap, hydration-safe via `useState/useEffect`); game loop strip spostato sopra DailyDilemma; label "Today's dilemma — vote anonymously" / "Il dilemma di oggi — vota in anonimo"; subline hero copy sharpened EN/IT. EN/IT parity completa su home + trending. Residui: DailyDilemma voted-state polish (has "See results" link già presente — accettato); `/it/trending` empty state copy (D sprint).
3. **Core loop clarity + Pixie Phase 1** — game loop strip + hero copy parzialmente inclusi nel P1 (3 Maggio); Pixie rename (companion → Pixie, copy-only, zero DB) e "why answer" copy ancora pendenti. Full strategy: `PRODUCT_STRATEGY.md`.
4. **`/it/trending` empty state** — copy tecnico "Il cron genera..." → testo user-friendly italiano. Sprint D (bassa priorità immediata).
5. **AI generation re-QA** — after env update + redeploy; re-run 4 dry-run scenarios; gates save mode.

**Remaining (not reprioritized):**
6. ~~**Product explainer blog cluster EN/IT**~~ — ✅ **DONE 4 Maggio 2026**: 8 articoli (4 EN + 4 IT parity) in `lib/blog.ts`; cookie/privacy framing preciso; assi reali da `lib/personality.ts`; disclaimer in tutti; hreflang automatico via `alternateSlug`.
7. **Social comparison analytics events** — `result_revealed`, `user_in_majority`, `user_in_minority`, `near_even_split`; **requires LEGAL.md check**
7. **Reconsideration prompt** — "Would you still choose the same?" after reveal; never modifies vote; no DB change
8. **Generate 15 high-quality IT dilemmas** — blocked by save mode gate
9. **Blog SEO generation/review pipeline** — audit prompt/model, improve output quality
10. **Segmented result comparison** *(DEFERRED)* — locale-only first ("Chi vota in italiano"), deferred until enough IT traffic (≥ 500 votes on a popular dilemma); country/demographic segments require `LEGAL.md` review before implementation. Full spec in `PRODUCT_STRATEGY.md → Segmented Result Comparison Direction`.

### PM Priority Queue — Field Feedback 30 Apr 2026

Feedback from real viewers changed the near-term product priority. After Sprint 1 closes the delayed reveal/docs pending work, do not jump directly into heavier monetization or AI UX. First make the product easier to understand, share, and measure.

1. **Google Analytics audit (read-only)** — verify GA4/env/proxy/consent/events before judging product changes. No code fixes in the audit unless explicitly promoted to a separate sprint.
2. **Core loop clarity + Pixie Phase 1** — make it obvious that SplitVote is a social voting game: why answer, what happens after voting, what XP/streak/archetype/Pixie mean, and who the product is for. Include login icon clarity and Pixie rename (copy-only, no DB, no assets — full strategy in `PRODUCT_STRATEGY.md → Pixie Digital Avatar Direction`).
3. **Pre-vote question sharing** — standard share icon on home/play/dilemma cards; share the question with neutral copy before a user votes; keep selected vote private by default.
4. **Aggregate leaderboards MVP** — start with most-voted dilemmas/topics, then archetype distribution. Personal voter leaderboard comes later only with privacy controls and legal review.
5. **Macro-area paths** — curated paths for audiences such as parents, couples, work, technology, society, and young adults, using existing category/path mechanics before schema changes.
6. **Current-events dilemma workflow** — Italy/Europe/USA/World news-inspired dilemmas with source context, admin review, no autopublish, and legal/editorial guardrails.
7. **AI-assisted localization workflow** — use AI/tooling for draft translations only; public copy remains reviewed and committed. Do not add new locales until the core loop/share/analytics base is stable.
8. **SplitVote Content Intelligence Agent v1 + Picoclaw bridge** *(DEFERRED — docs updated 6 May 2026)* — Build the internal read-only gatekeeper before giving Picoclaw any structured ingestion path. Phase 0.5: SplitVote agent scans static/approved/draft inventory, seed usage, exclusions, duplicate clusters, and category gaps; outputs reports only. Picoclaw remains an external trend radar. No auto-publish, no auto-save, no automatic file mutation/commit/push/deploy. Full integration strategy in `PRODUCT_STRATEGY.md → Picoclaw + SplitVote Content Intelligence Direction`.
9. **Pixie Phase 2 — Base assets** — add Pixie Spark PNG stage 1–5 to `public/pixie/`; update `CompanionDisplay` with `<Image>` + emoji fallback; no DB. Prerequisite: assets generated and PM-approved.
10. **Pixie Phase 3 — Share card MVP** — shareable Pixie profile card (OG 1200×630 + story 1080×1920); `/api/pixie-card/[userId]` server-only endpoint; share CTA on dashboard. No DB migration. Prerequisite: Phase 2 assets. Privacy rules in `PRODUCT_STRATEGY.md → Pixie Shareability Direction`; confirm public fields in `LEGAL.md` before shipping.
11. **Pixie Phase 4 — Variant selector / earned variants** — variant picker UI; server-side unlock verification; `pixie_variant_equipped` column on `profiles`; earned criteria: Cloud (5 categories), Ember (7-day streak), Moonlight (mission streak), Champion (100 votes), Wisp (500 votes).
12. **Pixie personality + emotion system study** — define character traits, emotional expressions, and progression mood per Pixie before broad variant production. Use this as art direction for future Pixie sheets (idle, happy, proud, surprised, sad/low-energy, ultra legendary) and for richer level-up/share moments. No DB or monetization dependency; output should be a spec + approved reference sheet before implementation.
13. **Pixie Phase 5 — VIP cosmetics** — Premium variants accessible via entitlements; define cancellation behavior; verify `LEGAL.md` if Premium perk wording changes.
14. **Pixie Phase 6 — Purchased Pixies** — shop / bundles; `user_pixie_skins` table; Stripe Price IDs per variant. **Gate: `LEGAL.md` updated, Terms EN/IT digital goods section, Stripe QA complete, refund policy defined.**

### PM Field Observations — UX, Growth, Admin, AI Quality (30 Apr 2026)

Backlog of issues and ideas surfaced via direct product observation. None implemented yet. Full detail in `PRODUCT_STRATEGY.md → PM Field Observations`.

**P0 — Bugs (fix soon):**

- **Feedback counter bug** — dashboard/admin feedback counter appears broken; needs data-source audit before any analytics trust. Sprint: _Feedback analytics bugfix_.
- **AI seed draft network_error** — UI shows `network_error` after batch seed generation even when drafts save successfully; after refresh drafts appear. Likely timeout/client-response mismatch. Risk: may cause double generation if admin retries. Sprint: _Admin AI generation reliability_.

**P1 — Near-term UX/Growth:**

- **Mission deep links** — tapping an incomplete mission should navigate directly to the action needed to complete it (e.g., vote page for `vote_3`). Sprint: _Mission UX polish_.
- **Daily Dilemma full-card click** — the entire "Dilemma del Giorno" home card should be clickable; share CTA must not propagate the card click. Sprint: _Home interaction polish_.
- **Blog 2-column layout + share** — desktop/tablet blog should use 2 columns; share icon on card and article page (Web Share API + clipboard fallback). Sprint: _Blog growth polish_.

**P2 — Medium-term:**

- **Dashboard navigation IA** — profile, missions, rewards, and settings are too fragmented; restructure account navigation. Sprint: _Account UX restructure_.
- **Vote reconsideration via long press** — long-press on an already-chosen answer (within `can_change_until` window) triggers reconsider flow. High risk: touches vote flow, timing policy, mobile long-press, accidental changes. Sprint: _Vote reconsideration UX_.

**P3 — Longer-term / Gated:**

- **VIP display name colors** — premium cosmetic: palette of 10 named shades (Silver, Gold, Steel, Diamond, Ruby, Emerald, Sapphire, Amethyst, Neon Blue, Cosmic Purple) visible to other users and in admin/super-admin view. No gameplay advantage. Gate: entitlements review + Terms check if sold as Premium perk. Sprint: _VIP profile cosmetics_.
- **AI novelty + current-events engine** — improve draft generation to compare against published/approved/recent drafts, raise novelty threshold, reduce semantic duplicates. Current-events variant: news-inspired abstractions with no real names, no city specifics, no unverified claims, editorial review gate, no autopublish. Sprint: _AI content quality_ + _Current-events content engine_.

---

## Sprint completati — Micro SEO Hardening: title dedup + IT locale guard (3 Maggio 2026)

**Obiettivo**: due fix tecnici SEO a scope strettissimo lasciati dal programmatic SEO sprint. Zero runtime behavior change.

**Task A — Title duplicato** (`app/[topicSlug]/page.tsx`):
- Root layout `app/layout.tsx` ha `metadata.title.template = '%s | SplitVote'`
- `generateMetadata` passava `title = \`${topic.headline} | SplitVote\`` → Next.js produceva `"Headline | SplitVote | SplitVote"`
- Fix: `metadata.title = topic.headline` (template appende il brand una volta sola)
- `openGraph.title` e `twitter.title` usano `socialTitle = \`${topic.headline} | SplitVote\`` (campi OG/Twitter bypassano il template — suffix esplicito corretto)

**Task B — IT locale guard** (`lib/seo-topics.ts`):
- `getPublishedTopics()` e `getIndexableTopics()` non filtravano per locale → un futuro topic `locale: 'it'` sarebbe stato buildato in `app/[topicSlug]` (route EN-only) e incluso nella sitemap
- Fix: `&& t.locale === 'en'` aggiunto in entrambe le funzioni
- Nessun impatto sul build attuale: tutti e 3 i topic pubblicati sono `locale: 'en'`
- `getTopicBySlug()` invariato (sicuro: `dynamicParams = false` auto-404 gli slug non buildati)
- JSDoc su campo `locale` aggiornato: spiega che IT è schema-ready ma richiede route `/it/[topicSlug]` non ancora implementata

**Agenti**: seo-content-reviewer (SHIP) · release-readiness-reviewer (SHIP). frontend-ui-reviewer, backend-systems-reviewer, security-reviewer: non usati (no UI, no backend data, no auth).

**LEGAL.md**: nessun aggiornamento — solo metadata/build-time, zero runtime data/tracking.

**Verifiche**: typecheck ✅ · build ✅ (154 pagine statiche, 3 topic landing pages) · `git diff --check` ✅

**Title finale atteso**: `<title>The Trolley Problem — Would You Pull the Lever? | SplitVote</title>` (una volta)

**Residuo noto**: import `getIndexableTopics` in `app/[topicSlug]/page.tsx` è pre-esistente dead import (il file calcola `isIndexable` inline) — out of scope, non causa errori.

---

## Sprint completati — P1 Already-Voted UX + Core Loop Clarity (3 Maggio 2026)

**Obiettivo**: client-side detection dei voti già espressi su home/trending, badge + redirect verso results, chiarezza visiva del game loop.

**Modifiche**:
- `components/DilemmaCard.tsx`: aggiunto `'voted'` al tipo `DilemmaCardBadge`; badge `✓ Voted` / `✓ Votato` in `bg-green-500/20 text-green-400 border border-green-500/30`
- `components/VotedDilemmaCard.tsx` (nuovo): client component, `useState(false)` + `useEffect` che legge `document.cookie.includes(\`sv_voted_${scenario.id}=\`)` dopo hydration; swappa badge → `'voted'` e href → `resultsHref` se già votato; server render sempre nello stato non-votato (idration-safe su ISR)
- `app/page.tsx`: import VotedDilemmaCard; subline aggiornata; game loop strip e trust strip spostati sopra DailyDilemma; label "Today's dilemma — vote anonymously" aggiunto; sezioni Trending Now / Most Voted / Latest Questions usano VotedDilemmaCard con `locale="en"`
- `app/it/page.tsx`: stesse modifiche in IT; label "Il dilemma di oggi — vota in anonimo"; sezioni IT con `locale="it"` e href `/it/results/${id}`
- `app/trending/page.tsx`: sezione "Trending Today" sostituisce i `<Link>` custom con griglia 2-col VotedDilemmaCard; import `Category` aggiunto per correggere tipo `DisplayItem.category: string → Category`
- `app/it/trending/page.tsx`: sezione "Tendenze Oggi" (hasItDynamic=true path) con VotedDilemmaCard 2-col

**Agenti**: product-growth-reviewer (no blockers) · frontend-ui-reviewer (`locale="en"` polish applicato) · release-readiness-reviewer (SHIP).

**LEGAL.md**: no update — cookie `sv_voted_*` già documentato in Privacy Policy; nessun nuovo dato raccolto; read-only client cookie già esistente.

**Verifiche**: typecheck ✅ · build ✅ (154 pagine) · `git diff --check` ✅

**Residui accettati**:
- DailyDilemma voted-state: ha già "See results" link + play page redirecta su cookie; wrapping non triviale; deferred
- `/it/trending` empty state copy tecnica ("Il cron genera..."): deferred a sprint D separato

---

## Sprint completati — Docs: Agent Governance + DESIGN.md (3 Maggio 2026)

**Obiettivo**: aggiungere infrastruttura di governance per sprint UI/UX e backend senza toccare codice runtime.

**Modifiche**:
- `.claude/agents/frontend-ui-reviewer.md` (nuovo): agente tecnico React/Tailwind/a11y/mobile — design token compliance, aria, touch targets, EN/IT overflow, hydration safety, loading/error/empty states
- `.claude/agents/backend-systems-reviewer.md` (nuovo): agente data correctness — vote integrity, Redis atomicity, Supabase, API response shape, caching strategy, cron idempotency, graceful degradation
- `CLAUDE.md`: sezione Specialist Agents aggiornata con i due nuovi agenti + Agent Pairing Rules (UI/UX sprints: product-growth + frontend-ui + release-readiness; API/data sprints: backend-systems + security (se auth) + release-readiness)
- `DESIGN.md` (nuovo): token ufficiali, regole componenti, copy tone, vincoli accessibilità, hydration safety rules — obbligatorio per ogni sprint UI/UX

**LEGAL.md**: nessun aggiornamento — solo documentazione interna, zero runtime.

**Verifiche**: typecheck ✅ · build ✅ · `git diff --check` ✅

---

## Sprint completati — Role Management MVP (29 Apr 2026)

**Obiettivo**: sostituire il modello `ADMIN_EMAILS` flat con ruoli DB espliciti (Phase 1). Zero lockout: dual-check durante la migrazione.

**Modifiche**:
- `supabase/migration_v15_role_management.sql`: colonna `role` su `profiles` (CHECK constraint, default 'user'), tabella `role_audit_log` (RLS no-client), trigger BEFORE UPDATE anti-escalation, bootstrap mat.pizzi → super_admin e genghi77 → admin
- `lib/admin-auth.ts`: aggiunto `UserRole`, `ROLE_HIERARCHY`, `isRoleAtLeast()`, `ASSIGNABLE_ROLES`
- `lib/entitlements.ts`: `UserEntitlements` estesa con `isSuperAdmin`, `role`, `canManageRoles`; dual-check in `getUserEntitlements()` (ADMIN_EMAILS fallback temporaneo Phase 1 + DB role)
- `app/api/me/entitlements/route.ts`: fetch `role` da profiles, passa a `getUserEntitlements()`
- `lib/admin-guard.ts` (nuovo): helper centrale `requireAdmin()` — dual-check ADMIN_EMAILS fallback + DB role; tutti gli endpoint admin lo usano
- `app/api/admin/roles/route.ts` (nuovo): GET lista utenti privilegiati (super_admin only)
- `app/api/admin/roles/assign/route.ts` (nuovo): POST assegna role (super_admin only, audit non best-effort: warning in risposta se fallisce, blocca assegnazione di super_admin via API)
- `app/admin/RolesPanel.tsx` (nuovo): client component per la gestione ruoli (mostra audit warning se presente)
- `app/admin/page.tsx`: gate usa `canAccessAdmin` (dual-check); fetch DB role prima del gate; tab "Roles" visibile solo a super_admin
- Tutti gli 11 endpoint `app/api/admin/**` aggiornati: `isAdminEmail` sostituito con `requireAdmin()` — accettano DB role admin/super_admin oltre ad ADMIN_EMAILS
- `LEGAL.md`: sprint trigger "security controls / admin access" documentato
- `ROADMAP.md`: aggiornato

**Verifiche**: typecheck ✅ build ✅ diff --check ✅

**Note architetturali — Phase 1**:
- `ADMIN_EMAILS` resta attivo come fallback: `isAdmin = isAdminEmail(email) OR isRoleAtLeast(role, 'admin')`. È il safety net contro lockout se il bootstrap DB fallisce.
- `isSuperAdmin` è esclusivamente DB-derivato: nessuna email può dare super_admin senza il DB role.
- `components/AuthButton.tsx` mostra il link admin solo se `isAdminEmail` — un admin DB-only senza email in ADMIN_EMAILS vede il pannello navigando direttamente, ma non vede il link nav. Da gestire in Phase 2.

**Residui (Phase 2)**:
- Rimozione di `ADMIN_EMAILS` dalla logica isAdmin (dopo bootstrap verificato in prod)
- Aggiornamento `AuthButton.tsx` per usare DB role via `/api/me/entitlements`
- Badge visivo super_admin su profilo pubblico (sprint separato)

---

## Sprint completati — Blog SEO: Article JSON-LD + Twitter card + Category editorial content (29 Apr 2026)

**Obiettivo**: tre miglioramenti SEO tecnici su blog e category pages. Zero runtime behavior change, zero data/user tracking change.

**Modifiche**:
- `app/blog/[slug]/page.tsx` + `app/it/blog/[slug]/page.tsx`: aggiunto `schema.org/Article` JSON-LD (headline, description, datePublished, inLanguage, publisher) e `twitter:card summary` con site/creator tag
- `app/blog/page.tsx` + `app/it/blog/page.tsx`: aggiunto `export const revalidate = 86400` (blog statico, nessun motivo di rigenerare ogni request)
- `app/category/[category]/page.tsx` + `app/it/category/[category]/page.tsx`: aggiunta sezione editoriale (heading + editorial paragraph + 3 FAQ collassabili) importata da `lib/categoryContent.ts`
- `lib/categoryContent.ts` (nuovo): mappa 8 categorie × 2 lingue → `{ editorial, faqHeading, faq[] }`. Copy revisionato: rimossi claim su "SplitVote global data", rimossi "most research suggests", rimosso claim neurologico su social rejection senza fonte

**LEGAL.md**: nessun aggiornamento — nessun cambio a dati, tracking, cookies, auth, payments, user behavior.

**Verifiche**: `npm run typecheck` ✅ · `npm run build` ✅ · `git diff --check` ✅

---

## Sprint completati — Stripe Production Env Fix: `STRIPE_PRICE_ID_PREMIUM` corretta (29 Apr 2026)

**Obiettivo**: documentare la correzione manuale della env var `STRIPE_PRICE_ID_PREMIUM` in Vercel Production che impediva il funzionamento del checkout Premium. Nessuna modifica al codice runtime.

**Root cause reale (confermata 29 Apr 2026)**: `STRIPE_PRICE_ID_PREMIUM` in Vercel Production conteneva per errore una Stripe Secret Key (`sk_live_...`) invece di un Price ID. Il codice usa `mode: 'subscription'` con `line_items: [{ price: STRIPE_PRICE_ID_PREMIUM }]` — Stripe rifiutava la chiamata perché il valore passato non era un Price ID valido. La narrativa precedente "prezzo one-time vs ricorrente" era imprecisa; la root cause era l'env var errata.

**Fix manuale (Matteo, 29 Apr 2026)**:
- `STRIPE_PRICE_ID_PREMIUM` in Vercel → Environment Variables → scope Production aggiornata con il Price ID corretto del prodotto SplitVote Premium (recurring monthly, €4.99/mese)
- Vercel Production redeployata con successo
- Nessuna modifica al codice runtime

**Stato post-fix**:
- ✅ Env var corretta, Vercel Production redeployata
- ✅ Codice già corretto (`mode: 'subscription'`, price via env) — nessuna modifica necessaria
- ✅ Webhook lifecycle, idempotency, entitlements: verificati su Preview 28 Apr (invariati)
- [ ] Checkout UI su `splitvote.io/profile`: da verificare manualmente — aprire checkout, confermare che mostri piano ricorrente mensile
- [ ] Pagamento live end-to-end: non ancora eseguito

**Nessuna modifica a**: codice runtime, Stripe webhook, Supabase schema, Redis, vote flow, i18n.

---

## Sprint completati — Stripe Preview QA: backend/webhook/entitlements verified (28 Apr 2026)

**Obiettivo**: eseguire il QA Stripe su Vercel Preview con test mode. Nessuna modifica al codice runtime.

**Preview**: branch `stripe-preview-qa` — `splitvote-git-stripe-preview-qa-matpizzi-gmailcoms-projects.vercel.app`

**Risultati verificati**:
- ✅ `POST /api/stripe/subscription` → Checkout Session test generata correttamente
- ✅ Webhook `checkout.session.completed` ricevuto e processato → `is_premium=true`, `stripe_customer_id`, `stripe_subscription_id`, `subscription_status='active'`
- ✅ `GET /api/me/entitlements` post-attivazione → `effectivePremium=true`, `noAds=true`, `canSubmitPoll=true`
- ✅ Billing Portal → apre correttamente
- ✅ Cancellazione via Stripe CLI → `customer.subscription.deleted` processato → `is_premium=false`, entitlements revocati
- ✅ Webhook idempotency end-to-end → duplicate resend non riattiva Premium

**Limitazione**: submit finale hosted Checkout non completato via browser automatizzato (Stripe anti-automation sull'UI) — richiede verifica manuale umana con carta `4242`.

**Blocker produzione identificato e risolto (29 Apr 2026)**: `STRIPE_PRICE_ID_PREMIUM` in Vercel Production conteneva per errore una Stripe Secret Key invece di un Price ID — corretta il 29 Apr con il Price ID del prodotto SplitVote Premium (recurring monthly, €4.99/mese). Vedi sprint "Stripe Production Env Fix" sopra.

**Nessuna modifica a**: codice runtime, Stripe env production, Supabase schema, Redis, vote flow.

---

## Sprint completati — Expert Insight V2: copy + UX results page (28 Apr 2026)

**Obiettivo**: migliorare gli Expert Insights post-voto per aumentare retention, interesse e sharability. Zero AI runtime, zero DB, zero nuovi servizi.

**Modifiche**:
- `lib/expert-insights.ts`: riscrittura completa del copy per tutte le 8 categorie (morality, justice, relationships, technology, society, freedom, survival, loyalty). Body più pungente e narrativo; whyPeopleSplit più specifico con meccanismo psicologico/sociologico; whatYourAnswerMaySuggest meno hedged e più concreto. EN e IT entrambi riscritti come testo nativo, non come traduzione.
- `app/results/[id]/ResultsClientPage.tsx`: Expert Insight spostato prima del Primary Share CTA (era dopo). Utenti leggono l'insight contestualmente ai risultati, aumentando motivazione a condividere. Sezione-label "Why people split" / "Perché le persone si dividono" resa leggermente più visibile (`text-[11px]` + opacity più alta). Nessuna modifica strutturale ai dati, al vote flow, ai cookie, all'anonimato o alle share card.

**Anonimato share**: invariato. Tutte le share card e caption usano dati aggregati (`pctA%/pctB%`, maggioranza) — mai il voto personale dell'utente.

**LEGAL.md**: nessuna modifica — nessun nuovo dato raccolto, nessuna variazione nel trattamento dati, share content rimane aggregate-only.

**Categorie migliorate**: morality, justice, relationships, technology, society, freedom, survival, loyalty (tutte e 8).

---

## Sprint completati — Stripe QA Docs: Live Mode Warning + Preview Test Runbook (28 Apr 2026)

**Obiettivo**: aggiornare documentazione Stripe QA dopo aver verificato che la produzione usa `sk_live_...`. Aggiunto warning esplicito nel runbook. Aggiunto percorso QA raccomandato su Vercel Preview con test mode. Nessuna modifica al codice runtime.

**Contesto**: production `STRIPE_SECRET_KEY=sk_live_...` — carte test (`4242...`) non funzionano in live mode. Il QA manuale con carta test deve avvenire su Vercel Preview con env vars test.

**Modifiche docs**:
- `LAUNCH_AUDIT.md` sezione "Stripe QA End-to-End": aggiunto warning prominente "PRODUZIONE IN LIVE MODE"; aggiunto runbook step-by-step per Vercel Preview (Step 1-7: test mode, price IDs test, env Preview, webhook endpoint test, redeploy); separato percorso Preview (principale) da percorso localhost CLI (alternativo); aggiornata checklist stato.
- `ROADMAP.md`: aggiornato stato sprint.
- `LEGAL.md`: aggiunta nota nel tracker "Recent sprints" — QA pagamenti non eseguito, richiede Preview test env prima di attivare Premium a pagamento su utenti reali.

**Stato Stripe QA (aggiornato)**:
- ✅ Audit statico completo: webhook lifecycle, idempotency, AdSlot, entitlements, log safety
- ✅ Bug fix: try/catch su chiamate Stripe API (checkout, subscription, portal)
- ✅ QA Vercel Preview eseguito (28 Apr 2026) — backend/webhook/entitlements verified — vedi sprint "Stripe Preview QA" sopra
- ✅ Blocker produzione risolto (29 Apr 2026): `STRIPE_PRICE_ID_PREMIUM` in Vercel Production conteneva per errore una Stripe Secret Key invece di un Price ID — corretta il 29 Apr con il Price ID del prodotto SplitVote Premium (recurring monthly, €4.99/mese). QA checkout live ancora pending.

**Nessuna modifica a**: codice runtime, Stripe env in produzione, pricing, Supabase schema, Redis, vote flow, analytics, i18n.

---

## Sprint completati — Full IT Profile Audit + Mobile Landscape Responsive (28 Apr 2026)

**Obiettivo**: completare localizzazione IT del profilo/account (demografici, membership, stats, messaggi); migliorare layout su mobile landscape (844×390) e tablet; aggiungere script QA per stringhe hardcoded.

**Stringhe IT corrette in `app/profile/ProfileClient.tsx`** (audit completo):
- Demografici: `Used only in aggregate…` → `Usati solo in forma aggregata…`; `Birth Year` → `Anno di nascita`; `Gender` → `Genere`; opzioni genere (Maschio/Femmina/Non binario/Preferisco non dirlo); `Country` → `Paese`; `Select country` → `Seleziona paese`; nomi paesi con `nameIT` per tutti i 20 paesi (Italia, Stati Uniti, Regno Unito, ecc.)
- Stats: `Dilemmas voted` → `Dilemmi votati`; `Badges earned` → `Badge ottenuti`; `Day streak 🔥` → `Giorni di serie 🔥`; `Member since` → `Iscritto da`; formato data `'en-GB'` → `'it-IT'` per IT
- Membership: `Upgrade to Premium` → `Passa a Premium`; `Unlock all SplitVote features` → `Sblocca tutte le funzioni SplitVote`; feature list IT; `Manage Billing` → `Gestisci Abbonamento`; `Opening…` → `Apertura…`; admin description; tutte le 4 feature bullets
- Identità: `Display Name` → `Nome visualizzato`; `Your display name` → `Il tuo nome`; `🔒 More avatars unlock…` → `🔒 Altri avatar si sbloccano…`; `Your public profile` → `Il tuo profilo pubblico`; messaggio rename a pagamento
- Trophy case: `Your public profile shows all trophies →` → localizzato; `preview` → `anteprima`
- Messaggi success/error da URL params e funzioni save/checkout: tutti localizzati
- `renameLabel()`: labels `Unlimited (Admin/Premium)`, `First change free` → localizzati

**Responsive (mobile landscape + tablet)**:
- `app/dashboard/page.tsx` stats grid: `grid-cols-4` → `grid-cols-2 sm:grid-cols-4` — migliora portrait (2×2) senza rompere landscape (4 colonne a 640px+)
- `app/profile/ProfileClient.tsx` premium feature list: `ul` flat → `grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-4` — 2 colonne a landscape/tablet
- Verificato: breakpoint `sm:` (640px) copre landscape 844px, `md:` (768px) copre tablet portrait. Nessuna dipendenza da orientation hack.

**Script QA**:
- `scripts/check-it-copy.mjs` — grep mirato su ProfileClient, DailyMissions, CompanionDisplay, PersonalityClient per stringhe EN hardcoded fuori da ternario `IT ?`; exit 1 se trova violazioni; aggiunto `npm run check:it-copy`

**Nessuna modifica a**: vote flow, Supabase schema, Redis, Stripe, analytics, middleware, lib/missions.ts.

---

## Sprint completati — XP Refresh + Moral Profile IT + Companion/Missions i18n + Role Model Docs (28 Apr 2026)

**Obiettivo**: fix XP bar che non si aggiornava dopo claim missione; fix Moral Profile in inglese su sito/account italiano; localizzazione Companion e Missioni; documentazione role model futuro.

**Bug root cause — XP bar statica dopo claim**: `DailyMissions` usava la prop `xp` direttamente in `getLevelInfo(xp)` senza stato locale. Dopo un claim la prop era statica (il server component non veniva re-renderizzato automaticamente). Fix: aggiunto stato locale `currentXp` inizializzato dalla prop; dopo ogni claim con successo si legge `xpAwarded` dalla response API e si aggiorna `currentXp += xpAwarded`. Aggiunto `router.refresh()` per aggiornare anche il server component `CompanionDisplay` (XP Totale) e le stats del dashboard.

**Bug root cause — Moral Profile in inglese**: `/personality` (route EN) non leggeva il cookie `lang-pref` e passava sempre `locale="en"` a `PersonalityClient`. Inoltre i link verso `/personality` nel dashboard e nel profilo non rispettavano la locale. Fix: `app/personality/page.tsx` ora legge il cookie `lang-pref` server-side e passa la locale corretta; dashboard e ProfileClient puntano a `/it/personality` quando IT.

**Fix applicati**:
- [x] `components/DailyMissions.tsx` — aggiunto prop `locale?: string`; stato locale `currentXp`; `useRouter` + `router.refresh()` dopo claim; `xpAwarded` letto dalla response; copy IT per header, streak, missioni complete, errori; mappa `IT_MISSION_TITLES` per i titoli missioni in italiano.
- [x] `components/CompanionDisplay.tsx` — aggiunto prop `locale?: string`; `IT_STAGE_LABELS` (Cucciolo/Apprendista/Esploratore/Campione/Leggendario); copy IT per "Il tuo Compagno", voti, stadio, XP Totale, missioni, forma leggendaria; fallback EN invariato.
- [x] `app/dashboard/page.tsx` — `locale={locale}` passato a `CompanionDisplay` e `DailyMissions`; link personalità corretto: `IT ? '/it/personality' : '/personality'`.
- [x] `app/personality/page.tsx` — aggiunto `import { cookies } from 'next/headers'`; `locale` letto dal cookie `lang-pref` server-side; `PersonalityClient` riceve `locale` corretto anche su `/personality` con utente IT.
- [x] `app/profile/ProfileClient.tsx` — link "View personality" cambiato a `IT ? '/it/personality' : '/personality'`; label "Vedi" in IT. **QA fix (5322f04)**: 4 stringhe hardcoded inglesi nella sezione personality ("Your archetype is ready", "Discover your moral profile...", "Discover your moral archetype", "{n} / 3 votes — keep voting...") ora rispettano `IT`.
- [x] `PRODUCT_STRATEGY.md` — sezione "Future Role Model" aggiunta: definizioni Super Admin / Admin / Moderator / Creator; prerequisiti implementazione (audit log, DB/RLS review, legal trigger).
- [x] `ROADMAP.md` — timestamp aggiornato; sprint entry aggiunto.

**Nessuna modifica a**: vote flow, Supabase queries, API routes, middleware, Stripe, Redis, `lib/missions.ts`, mission validation logic, XP reward values.

**Cosa resta in inglese** (fuori scope di questo sprint):
- Level titles nel XP bar ("New Voter", "Debater", etc.) — definiti in `lib/missions.ts`; sprint dedicato necessario
- Rarity labels del companion ("common", "rare", etc.) — dati tecnici interni
- Status badges admin ("Pending review", "Live", "Rejected") — stabilmente brevi

**Check manuale richiesto post-deploy**:
- Dashboard IT: riscattare una missione → barra XP si aggiorna immediatamente senza reload
- Companion "XP Totale" aggiornato dopo reload (router.refresh)
- Secondo claim della stessa missione: non aggiunge XP (idempotent, `xpAwarded: 0`)
- `/it/personality` completamente in italiano (assi, archetipo, bottoni)
- `/personality` con cookie `lang-pref=it`: risponde in italiano
- `/personality` senza cookie: risponde in inglese
- Dashboard IT → click personalità → porta a `/it/personality`
- Profile IT → click "Vedi" personalità → porta a `/it/personality`

---

## Sprint completati — AdminCharts Mobile Fix + i18n Account Surfaces (28 Apr 2026)

**Obiettivo**: correggere grafici non visibili su mobile nel tab Voting dell'admin; migliorare copy italiano su dashboard, profilo e admin.

**Bug root cause — grafici vuoti su mobile**: I componenti `VotesChart` e `SignupsChart` usavano `style={{ height: '${pct}%' }}` su un elemento figlio di un flex container senza altezza esplicita. I flex item (`flex-1`) nel parent `flex items-end h-32` non avevano `h-full`, quindi la percentuale non aveva un valore di riferimento e il browser calcolava la barra come 0px su mobile.

**Fix applicati**:
- [x] `app/admin/AdminCharts.tsx` — refactor struttura colonne: rimossa `items-end` dal wrapper, ogni colonna è `h-full flex flex-col`, area chart interna è `flex-1 flex-col justify-end relative` → le barre ora hanno parent height definita e `height: X%` funziona correttamente. Hover count spostato ad `absolute top-0`. Minima altezza barra: 3% per valori > 0, 0px per zero-count. Aggiunto summary testuale totale sotto ogni chart.
- [x] `app/admin/AdminCharts.tsx` — aggiunto prop `locale?: string`; titoli chart localizzati (IT: "Voti al giorno", "Iscrizioni al giorno"); empty state e summary IT.
- [x] `app/admin/page.tsx` — `cookies()` server-side per leggere `lang-pref`; TABS array localizzato (IT: Panoramica/Voti/Contenuti/QA contenuti/Bozze AI/Blog/Monetizzazione); "Top voters" → "Utenti più attivi" e "Recent signups" → "Nuove iscrizioni" in IT; `locale` passato a VotesChart e SignupsChart.
- [x] `app/dashboard/page.tsx` — `cookies()` per locale; saluto IT (`Ciao`), personalità morale, Premium Attivo/Piano Gratuito/Gestisci/Upgrade, stats grid (Voti/XP/Streak/Badge), Streak Milestones, cronologia voti, domande inviate.
- [x] `app/profile/page.tsx` — `cookies()` per locale, passato a `ProfileClient`.
- [x] `app/profile/ProfileClient.tsx` — prop `locale?: string`; sezioni localizzate: titolo pagina, Abbonamento, Premium Attivo, Identità, Dati demografici, Personalità Morale, Collezione Trofei, Il tuo Impatto, Salva Profilo.

**Nessuna modifica a**: vote flow, Supabase queries, API routes, middleware auth, EN behavior (fallback invariato se `lang-pref !== it`).

**Cosa resta in inglese** (fuori scope):
- Copy interno admin tabs: Content, Content QA, AI Drafts, Blog, Monetization (testo descrittivo delle sezioni)
- Labels demografici ("Birth Year", "Gender", "Country") — non critico, dati tecnici
- STATUS_BADGE nel dashboard ("Pending review", "Live", "Rejected", "Flagged") — stabile, breve
- Companion + Daily Missions (componenti separati, non toccati in questo sprint)

**Verifiche eseguite**: `npm run typecheck` ✅ — `npm run build` ✅ (148 pagine) — `git diff --check` ✅ — `npm run validate:personality` ✅.

**Check manuale richiesto post-deploy**:
- `/admin?tab=voting` su mobile 375px: barre visibili o empty state chiaro
- Toggle 7d/14d funziona
- Dashboard con `lang-pref=it` (cookie): copy italiano principale visibile
- Dashboard con `lang-pref=en` o cookie assente: tutto in inglese

---

## Sprint completati — Homepage Performance Micro-Optimization (28 Apr 2026)

**Obiettivo**: ridurre latenza homepage cold render dopo aver identificato che ogni nuovo deploy causa ISR cache miss con p95 ~2.4s (Run #3 post-config: 2.36s). Nessun cambiamento a behavior, voting flow, o caching play/results.

**Root cause identificata**: `app/page.tsx` faceva 4 call async sequenziali durante il cold render ISR:
1. `getDynamicScenarios()` — Redis GET (necessario per allScenarios)
2. `getVotes(dailyScenario.id)` — Redis HGETALL separato (potenzialmente duplicato se daily era in batch)
3. `getVotesBatch(30 ids)` — **30 HTTP request separate** ad Upstash via `Promise.all`
4. `getTrendingScenarioIds24h(...)` — Supabase admin query (sequenziale dopo step 3)

Trending e category page fanno solo step 1 → p95 ~490–590ms. Homepage aveva 4 step → p95 2.4–3.2s cold.

**Fix applicati**:
- [x] `lib/redis.ts` — `getVotesBatch` convertito a Upstash pipeline: **30 HTTP call → 1 HTTP call**. Stessa semantica, stesso return type. Beneficia anche la trending fallback path.
- [x] `app/page.tsx` — rimosso import `getVotes` (non più necessario); daily scenario ID incluso nel batch (elimina 1 Redis call separata); `getVotesBatch` e `getTrendingScenarioIds24h` parallelizzati con `Promise.allSettled` (step 2+3+4 → 2 step paralleli).
- [x] `next.config.js` — aggiunto `poweredByHeader: false` (rimuove header `X-Powered-By: Next.js`).
- [x] `LOAD_TEST_RESULTS.md` — Run #3 registrato (2.36s cold, tutti gli altri threshold OK).
- [x] `LAUNCH_AUDIT.md` — nota homepage cold cache pattern e fix applicato.

**Performance attesa post-deploy**: homepage cold render ~800–1200ms (da ~2400ms). ISR warm invariato (~1.28s già era k6 pass). Rerun k6 richiesto per misurare.

**Nessuna modifica a**: vote flow, Redis vote atomicity, Stripe, play/results caching, Supabase schema, API routes, SEO/hreflang, behavior visivo.

**Prossimo step**: rerun k6 smoke post-deploy → se `/` p95 < 1500ms con cold render → baseline confermato. Poi Stripe QA end-to-end (runbook in `LAUNCH_AUDIT.md`).

---

## Sprint completati — Pre-launch Code Health Audit (28 Apr 2026)

**Obiettivo**: ridurre rischio tecnico pre-lancio applicando solo fix a basso rischio. Nessuna modifica a runtime behavior, vote flow, Stripe, caching, DB schema.

- [x] **`next.config.js` consolidato** — eliminati `next.config.mjs` e `next.config.ts` (file duplicati ignorati o potenzialmente ambigui con Next.js 14.2). Config unica `next.config.js` ora include: `eslint.ignoreDuringBuilds: true` (ESLint 8/9 incompatibility), header `X-XSS-Protection`, header `X-DNS-Prefetch-Control`, commento CSP, commento `payment=(self)` per Stripe. Tutti gli altri security header invariati.
- [x] **`postcss.config.mjs` eliminato** — usava `@tailwindcss/postcss` non presente in `package.json`; `postcss.config.js` (CJS con tailwindcss + autoprefixer) rimane l'unica config PostCSS attiva.
- [x] **README cron schedule corretto** — l'esempio codice nella sezione Vercel Cron mostrava `0 8 * * *` ma `vercel.json` ha `0 6 * * *` (6am UTC). Allineati.
- [x] **Personality validation**: ✅ 18 archetipi, VALID_IDS, ARCHETYPE_HEX, SIGN_COLORS — tutti coerenti.

**Verifiche eseguite**: `npm run typecheck` ✅ — `npm run build` ✅ (148 pagine statiche) — `git diff --check` ✅ — `npm run validate:personality` ✅.

**Non modificato** (fuori scope o deliberatamente invariato):
- `force-dynamic` + `generateStaticParams` su play/results — per-user data, nessuna cache per anti-regression rule. play/results p95 < 600ms a ~30 req/s già verificato con k6 spike.
- `SLOT_HOME ?? 'TODO'` in `app/page.tsx` — AdSlot renders null su 'TODO'; safe, intenzionale.
- `push_*.command` untracked — mai committare, confermato.
- Admin page 632 righe — refactor post-lancio.
- Duplicazione EN/IT pages — refactor post-lancio.

**Performance status: ✅ INVARIATO** — baseline smoke + spike production results invariati (nessuna modifica a runtime o caching).

**Prossimo step consigliato**: eseguire Stripe QA end-to-end (runbook in `LAUNCH_AUDIT.md`), poi Spanish i18n foundation.

---

## Sprint completati — k6 Production Spike Tests (28 Apr 2026)

**Obiettivo**: eseguire e registrare spike test read-only su produzione con lo script dedicato. Docs only.

- [x] **Spike #1** (10 VU × 30s): overall p95 847ms, play p95 617ms, results p95 614ms, 355 req, 11.59 req/s — ✅ PASS
- [x] **Spike #2** (25 VU × 60s, ~30 req/s): overall p95 777ms, play p95 564ms, results p95 580ms, 1819 req, 29.91 req/s — ✅ PASS
- [x] `LOAD_TEST_RESULTS.md` — Spike #1 e Spike #2 registrati con dati completi; conclusione spike aggiunta.
- [x] `LAUNCH_AUDIT.md` — subsection spike aggiornata con risultati reali + no-50-VU-prod warning.

**Performance status: ✅ PASSED** — soft launch baseline + moderate social spike (25 VU, ~30 req/s). play/results p95 < 600ms sotto carico moderato.

**Nessuna modifica a**: codice runtime, script k6, API routes, DB schema.

**Prossimo step consigliato**: Stripe QA end-to-end (runbook in `LAUNCH_AUDIT.md`), poi Spanish i18n foundation. Per spike più aggressivi (50 VU): eseguire prima su Preview.

---

## Sprint completati — k6 Spike Test Script (28 Apr 2026)

**Obiettivo**: aggiungere script k6 dedicato per simulare spike virale TikTok/Instagram. Read-only, weighted routing, `default` export per `--vus`/`--duration` CLI override.

- [x] `tests/load/splitvote-spike-load.js` — safety guard produzione, weighted routing (45% /play, 25% /results, 15% /, 10% /trending, 5% /category), cumulative random picker, `default` export (supporta `k6 run --vus N --duration Xs`), options default 10 VU × 60s, thresholds: `http_req_failed < 5%`, `checks > 95%`, overall p95 < 3s, `/play` p95 < 3s, `/results` p95 < 3s.
- [x] `package.json` — aggiunto script `"load:spike"`.
- [x] `LOAD_TEST_RESULTS.md` — sezione "Spike Tests" con comandi Preview (25/50 VU), produzione (25 VU solo dopo Preview OK), soglie, tabella risultati spike.
- [x] `LAUNCH_AUDIT.md` — subsection spike test con comando Preview e avvertenza produzione.

**`--vus`/`--duration` CLI override**: funziona perché lo script usa `export default function` (non `scenarios` nominati). Il k6 smoke test usava `scenarios: { reads: { exec: 'readTest' } }` che non è compatibile con i flag CLI.

**Nessuna modifica a**: runtime app, API routes, smoke test esistente, DB schema, dipendenze.

**Manual step**: eseguire Preview spike 25 VU × 60s e registrare risultati in `LOAD_TEST_RESULTS.md` → Spike Tests.

---

## Sprint completati — k6 Production Baseline (28 Apr 2026)

**Obiettivo**: eseguire e registrare baseline read-only k6 su produzione. Docs only.

- [x] Due run read-only su produzione (5 VU, 30s, no `ENABLE_WRITE_TESTS`):
  - **Run #1** (cold cache): homepage p95 3.20s — k6 threshold fail (warmup); tutti gli altri passati; zero errori.
  - **Run #2** (warm): tutti i k6 threshold passati — homepage 1.28s, play 545ms, results 553ms, http_req_failed 0%, checks 100%.
- [x] `LOAD_TEST_RESULTS.md` — Run #1 e Run #2 registrati con dati reali; stato baseline aggiornato.
- [x] `LAUNCH_AUDIT.md` — item k6 baseline marcato `[x]` con nota cold cache + passed.

**Soft launch performance baseline: ✅ PASSED** — tutti i k6 threshold passati al secondo run.

**Nessuna modifica a**: codice runtime, script k6, API routes, DB schema.

---

## Sprint completati — k6 Load Test Results Tracker (28 Apr 2026)

**Obiettivo**: creare `LOAD_TEST_RESULTS.md` come registro strutturato dei risultati k6, con comando baseline, soglie, tabella di registrazione, e procedura di follow-up. Nessuna modifica al codice runtime.

- [x] `LOAD_TEST_RESULTS.md` — creato: scopo, comando baseline Preview read-only (`BASE_URL=...ALLOW_PROD_LOAD_TEST=true k6 run`), regola no `ENABLE_WRITE_TESTS` per primo run, parametri harness (5 VU / 30s / scenario `trolley`), tabella soglie (k6 threshold vs pass target audit), tabella risultati con colonne date/commit/environment/BASE_URL/p95 per tutte e 5 le route/http_req_failed/checks/notes, Run #1 placeholder, procedura post-baseline (20 VU su Preview → poi prod finestra controllata), istruzioni lettura output k6, riferimenti.
- [x] `LAUNCH_AUDIT.md` — item `[ ] Eseguire baseline k6` aggiornato per puntare a `LOAD_TEST_RESULTS.md`; nota aggiunta in fondo alla sezione "Vercel Preview baseline".

**Nessuna modifica a**: codice runtime, script k6, API routes, DB schema, dipendenze.

**Manual step**: ottenere URL Vercel Preview → eseguire comando baseline → incollare p95 e metriche nel Run #1 di `LOAD_TEST_RESULTS.md`.

---

## Sprint completati — Stripe QA Runbook (28 Apr 2026)

**Obiettivo**: preparare runbook operativo Stripe QA end-to-end in `LAUNCH_AUDIT.md`. Nessuna modifica al codice runtime.

- [x] `LAUNCH_AUDIT.md` — sezione "Stripe QA End-to-End" espansa con runbook completo: tabella endpoint + eventi webhook gestiti, prerequisiti env, setup Stripe CLI, test checkout premium (carta `4242...`), verifica `profiles` post-checkout (`is_premium`, `stripe_customer_id`, `stripe_subscription_id`, `subscription_status`), test dashboard Premium active, test no-ads (`/api/me/entitlements` → `noAds: true`), test customer portal, test cancellation + verifica `profiles` reset, test idempotency duplicate event (`stripe events resend`), test 6 failure modes (firma errata, already-premium, no billing account, admin rename, config mancante), note rollback SQL manuale + query `stripe_webhook_events` falliti, Stripe retry schedule.

**Nessuna modifica a**: codice runtime, API routes, DB schema, Stripe pricing, env vars, cookie consent, legal pages, vote flow.

**Manual step**: eseguire la QA reale con Stripe CLI e carta test prima di promuovere Premium a utenti reali (checklist completa in `LAUNCH_AUDIT.md` → Stripe QA End-to-End).

---

## Sprint completati — Streak Milestones (28 Apr 2026)

**Obiettivo**: aggiungere badge milestone per streak 7/15/30 giorni, con progresso visibile su dashboard e profilo. Nessuna nuova gamification complessa, nessun leaderboard, nessuno shop.

**Schema audit**:
- `streak_7` già definito in migration_v2 + già assegnato in `increment_user_vote_count` (migration_v3) ✅
- `streak_15` e `streak_30`: assenti — aggiunti in migration_v14
- `user_badges.UNIQUE(user_id, badge_id)`: idempotent by design ✅
- RLS `user_badges`: SELECT public, INSERT solo via DB function (security definer) — nessun client INSERT ✅
- Integration point corretto: `app/api/vote/route.ts:240` → `supabase.rpc('increment_user_vote_count', ...)` ✅

- [x] `supabase/migration_v14_streak_milestone_badges.sql` — seed `streak_15` (epic) + `streak_30` (legendary); updated `increment_user_vote_count` DB function per awardarli; backfill per utenti esistenti con `streak_days >= threshold`; idempotente. **✅ Applied — verificata in Supabase (streak_7/15/30 presenti, `increment_user_vote_count` aggiornata, backfill vuoto normale).**
- [x] `lib/badges.ts` — `STREAK_MILESTONES` const; `getStreakProgress(streakDays)` helper per progress bar UI; `awardStreakMilestoneBadges(userId, streakDays)` per uso admin/manutenzione (primary award path resta DB function)
- [x] `app/dashboard/page.tsx` — card "🔥 Streak Milestones" con progress bar verso prossimo target + lista dei 3 badge (earned/not earned); degrada gracefully se migration_v14 non applicata
- [x] `app/profile/page.tsx` — aggiunto `streak_days` al SELECT query
- [x] `app/profile/ProfileClient.tsx` — aggiunto `streakDays` prop; stats grid 3→4 colonne con "Day streak 🔥"
- [x] `README.md` — migration_v14 aggiunta come ⏳ Pending
- [x] `PRODUCT_STRATEGY.md` — streak milestones segnato come foundation implementata

**Award flow**: voto → `increment_user_vote_count` (DB security definer) → aggiorna streak → `INSERT INTO user_badges ON CONFLICT DO NOTHING`. Nessun path client-side.

**Degrada gracefully**: se migration_v14 non applicata, badge streak_15/30 non esistono in `badges` → non possono essere in `user_badges` → UI mostra "not earned" correttamente. Dashboard funziona sempre con `streakDays`.

**Nessuna modifica a**: DB schema strutturale, Stripe, auth, vote logic, tracking, AdSense, cookie consent, legal pages, voting flow.

**Migration v14**: ✅ Applied e verificata manualmente in Supabase — nessuno step manuale residuo.

---

## Sprint completati — Personality v2 QA — Copy Audit + Validation Script (28 Apr 2026)

**Obiettivo**: micro-sprint QA su copy EN/IT, consistency cross-file, e script di validazione automatica.

- [x] `lib/personality.ts` — refusi e copy corretti: `'Liberatarian'` → `'Libertarian'` in `MORAL_AXES`; 3× `'Principiato'` (guardian, idealist, stoic traitsIt) → `'Di principio'`; `'Collective'` (idealist, advocate traits EN) → `'Collaborative'` / `'Community-driven'`; `'Collettivo'` (idealist, advocate traitsIt) → `'Collaborativo'` / `'Solidale'`; `'Orientato ai risultati'` (pioneer traitsIt) → `'Determinato'` (evita duplicato con pragmatist IT)
- [x] `scripts/validate-personality.mjs` — nuovo script di validazione: 18 archetipi, ID unici, original 6 presenti, diplomat at index 3, EN/IT fields presenti, traits/traitsIt stessa lunghezza, profile presente per tutti, cross-check VALID_IDS + ARCHETYPE_HEX + SIGN_COLORS; output ✅/❌/⚠
- [x] `package.json` — aggiunto `"validate:personality": "node scripts/validate-personality.mjs"`

**Nessun cambio a**: DB, Stripe, auth, vote flow, tracking, card API logic, profili target degli archetipi, significato strategico degli archetipi.

**Verifica**: `npm run validate:personality` → 13/13 checks ✅; `npm run typecheck` ✅; `npm run build` ✅.

---

## Sprint completati — Personality v2 (28 Apr 2026)

**Obiettivo**: espandere gli archetipi morali da 6 a 18, migliorare copy EN/IT, aggiornare classificatore e share card API.

- [x] `lib/personality.ts` — 12 nuovi archetipi aggiunti (idealist, pragmatist, protector, truth-teller, pioneer, peacemaker, sentinel, advocate, visionary, maverick, stoic, caretaker); `profile?: Record<string, number>` aggiunto a interfaccia `Archetype`; `pickArchetype` riscritto con distanza euclidea dai profili target (più robusto con 18 archetipi vs heuristic score precedente); existing 6 invariati (id, copy, segni, emoji, colori)
- [x] `app/api/personality-card/route.tsx` — `VALID_IDS` espanso a tutti i 18 id; `ARCHETYPE_HEX` aggiornato con colori hex per tutti i 18
- [x] `app/personality/PersonalityClient.tsx` — `SIGN_COLORS` espanso con classi gradient Tailwind per tutti i 18 archetipi; fallback esistente `?? 'from-purple-600/20...'` preserved

**Archetypes 6→18**: guardian, rebel, oracle, diplomat, strategist, empath + idealist ✨, pragmatist ⚙️, protector 🛡️, truth-teller 💎, pioneer 🚀, peacemaker 🕊️, sentinel 🌅, advocate ✊, visionary 🌠, maverick ⚡, stoic ⛰️, caretaker 🤲

**Compatibilità**: id dei 6 archetipi esistenti invariati; il nuovo classificatore euclidean distance può assegnare archetipi diversi a utenti esistenti (normale — il profilo viene ricalcolato dai voti ogni volta, non è memorizzato in DB).

**No zodiac**: nessun dato di nascita, nessun segno zodiacale. Zodiac overlay resta future/opzionale.

**Nessuna modifica a**: DB schema, Stripe, auth, vote flow, tracking, AdSense, cookie consent, legal pages pubbliche.

---

## Sprint completati — Migrations v11/v12 Applied + RLS Audit + v13 (28 Apr 2026)

**Obiettivo**: aggiornare docs per v11/v12 ora applicate; auditare policy residua UPDATE su `user_polls`; creare migration v13.

**Audit risultato UPDATE user_polls**:
- `user_polls.update` nel codice: solo `app/api/admin/polls/[id]/approve/route.ts` e `app/api/admin/polls/[id]/reject/route.ts` — entrambi usano `createAdminClient()` (service role, bypassa RLS)
- Nessuna feature client per edit pending poll
- Policy `Users can update own pending polls` è residua di schema.sql — attack surface: un utente autenticato potrebbe modificare il contenuto del poll durante il review dell'admin tramite Supabase REST API diretta, rendendo il review privo di significato

- [x] `README.md` — migration_v11 e migration_v12 aggiornate da ⏳ Pending a ✅ Applied; migration_v13 aggiunta come ⏳ Pending
- [x] `LAUNCH_AUDIT.md` — item idempotency webhook aggiornato a confermato; item poll submit/RLS aggiunto
- [x] `ROADMAP.md` — step operativi v11/v12 marcati completati; v13 aggiunto come prossimo step manuale
- [x] `LEGAL.md` — nota sprint: v11/v12 applicate, v13 audit
- [x] `supabase/migration_v13_user_polls_no_client_update.sql` — drop `Users can update own pending polls` + varianti; commenti spiegano perché e documentano le policy SELECT ancora necessarie

**Nessun runtime behavior modificato**: nessuna modifica a API, auth, vote flow, Stripe, entitlements, tracking, legal pages.

**Manual step**: applicare `migration_v13` in Supabase dashboard → SQL Editor → Run.

---

## Sprint completati — Poll Submit Hardening + RLS (28 Apr 2026)

**Obiettivo**: rendere la submission di poll production-safe — premium/admin enforcement server-side, input validation, RLS hardening.

**Audit RLS/sicurezza**:
- `app/submit-poll/page.tsx` faceva insert diretto client-side su `user_polls` — entitlement check era solo UI (bypassabile via Supabase REST API diretta)
- Nessuna validation server-side
- `schema.sql` non disponibile nel repo — stato RLS su `user_polls` sconosciuto, presumibilmente nessuna protezione INSERT adeguata

- [x] `app/api/polls/submit/route.ts` — nuova route POST: (1) auth via `supabase.auth.getUser()`; (2) entitlement check server-side con `getUserEntitlements` → 403 se non premium/admin; (3) input validation: question 10-300 chars, option_a/b 2-150 chars, category allowlist, emoji safe bound, controllo control-char; (4) insert via `createAdminClient()` con `status='pending'` e `user_id` dall'auth session — client non può impostare né status né user_id
- [x] `app/submit-poll/page.tsx` — rimosso insert diretto `supabase.from('user_polls').insert(...)`; usa `fetch('/api/polls/submit', { method: 'POST' })`; gestione errori 401/403/500; aggiunta checkbox obbligatoria "I confirm this submission follows the guidelines"; copy non-premium corretto: "Poll submission is available with Premium" + CTA upgrade (rimosso "coming soon")
- [x] `supabase/migration_v12_user_polls_rls_hardening.sql` — abilita RLS su `user_polls`, rimuove policy INSERT client, aggiunge policy SELECT per "own polls"; documenta pattern server-only insert
- [x] `LEGAL.md` — sprint note: UGC hardening, entitlement enforcement, input validation, RLS; Terms già coprono user-submitted content — nessun aggiornamento Terms/Privacy necessario
- [x] `README.md` — migration v12 aggiunta alla tabella

**Admin approve/reject invariato**: `app/api/admin/polls/[id]/approve|reject/route.ts` già usano `createAdminClient()` + `isAdminEmail()` — non modificati.

**Nessuna modifica a**: Stripe, pricing, entitlements logic, DB schema (oltre migration v12 RLS), tracking, legal pages, auth.

**Manual step**: applicare `supabase/migration_v12_user_polls_rls_hardening.sql` in Supabase dashboard → SQL Editor → Run.

---

## Sprint completati — Profile UX Cleanup + Premium Dashboard Simplification (28 Apr 2026)

- [x] `app/dashboard/page.tsx` — stats grid riorganizzata: sostituiti "Polls submitted / Polls live" (sempre 0 per la maggioranza degli utenti) con "XP earned" e "Day streak" — dati rilevanti per tutti gli account; copy Premium: "No ads · Unlimited renames · Submit polls" (specifico); copy Free: "Remove ads and unlock unlimited renames" (chiaro beneficio)
- [x] `app/profile/ProfileClient.tsx` — Moral Personality CTA spostata PRIMA della Trophy Case (era dopo il bottone Save — invisibile); rimossa sezione "Coming soon" con promesse false (Avatar shop, Frame shop, Streak tracker, Country leaderboard — nessuno implementato); lista benefit Premium corretta: rimossa "Exclusive avatar frames & badges" (non implementata), aggiunta "No ads — browse without interruptions" (implementata) e "Submit polls for the community to vote on" (implementata); rimossa nota "Premium packs coming soon" dall'avatar section
- [x] `app/u/[id]/page.tsx` — aggiunto badge "👁 Public Profile" nella hero del profilo pubblico, allineato con Premium badge esistente — chiarisce visivamente che la pagina è pubblica

**Nessuna modifica a**: Stripe, DB schema, entitlements, tracking, legal pages, auth. LEGAL.md non aggiornato — nessun cambio a dati pubblici, billing behavior, visibility default o ads behavior.

---

## Sprint completati — Post-Idempotency Verification Sprint (28 Apr 2026)

- [x] README.md — Stripe webhook runbook espanso: procedura di verifica step-by-step post-migration v11, test duplicate detection con `stripe events resend`, expected outcomes documentati
- [x] LAUNCH_AUDIT.md — idempotency item aggiornato (implementazione completata, awaiting migration v11 + verification); sezione k6 Vercel Preview baseline espansa con tabella metriche da registrare e istruzioni no-ENABLE_WRITE_TESTS per primo run
- [x] ROADMAP.md — "Prossimo Sprint Prioritario" ripulito: rimossi candidati completati (Stripe webhook idempotency, k6 harness); aggiunti step operativi pre-scaling (migration v11 apply, k6 Preview baseline) e candidati prodotto realistici
- [x] Nessun codice applicativo, DB, API, Stripe, Redis, auth o runtime behavior modificato

**Nota migration v11**: non è possibile verificare lo stato di Supabase da codice — resta ⏳ Pending fino a conferma manuale. La backward-compatibility garantisce che il webhook funzioni in entrambi i casi.

---

## Sprint completati — Stripe Webhook Idempotency Hardening (28 Apr 2026)

- [x] `lib/stripe-webhook-events.ts` — refactor hardening:
  - Reclaim di eventi `failed`: ora atomico con `UPDATE WHERE status='failed' RETURNING stripe_event_id`; due retry concorrenti serializzano su lock Postgres — solo chi ottiene la row vince, l'altro riceve array vuoto e ritorna `in_progress`
  - Stale processing recovery: se `updated_at` > `STALE_PROCESSING_AFTER_MS` (10 min), tenta `UPDATE WHERE status='processing' AND updated_at < cutoff RETURNING stripe_event_id`; il trigger `updated_at=now()` invalida la condizione per il secondo retry concorrente
  - Eliminata la race condition select→update non atomica del reclaim `failed`
  - Seleziona `status, updated_at` insieme in un unico round-trip invece di due
  - Tipo pubblico `ClaimResult` invariato; `app/api/stripe/webhook/route.ts` invariato
- [x] `supabase/migration_v11_stripe_webhook_events.sql` — commenti aggiornati per documentare stale recovery e ruolo del trigger `updated_at`

**Nota:** `migration_v11` non è stata applicata — resta ⏳ Pending manuale in Supabase.

---

## Sprint completati — Stripe Webhook Idempotency (28 Apr 2026)

- [x] `supabase/migration_v11_stripe_webhook_events.sql` — tabella `stripe_webhook_events` con `stripe_event_id UNIQUE`, `status CHECK (processing/processed/failed)`, trigger `updated_at`, RLS abilitata (nessuna policy pubblica — service role bypassa RLS)
- [x] `lib/stripe-webhook-events.ts` — tre helper: `claimWebhookEvent()`, `markWebhookEventProcessed()`, `markWebhookEventFailed()`
- [x] `app/api/stripe/webhook/route.ts` — integrazione idempotency: claim before processing, mark processed on success, mark failed + return 500 on error (so Stripe retries); estratto `processStripeEvent()` helper interno
- [x] **Backward-compatible**: se `migration_v11` non è ancora applicata, Postgres restituisce errore `42P01` (undefined_table) → il webhook processa come prima e logga `console.warn`; nessuna interruzione del servizio
- [x] Flusso status: `processing` → `processed` (successo) | `failed` (errore, Stripe ritenta) → reset `processing` (retry allowed)
- [x] Log sicuri: nessuna email, nome, payload Stripe o metadata sensibili — solo `userId.slice(0,8)`, `customerId.slice(0,12)`, error code DB
- [x] README.md — migration v11 aggiunta alla tabella, nota idempotency nella sezione Stripe webhook, Known Issues aggiornato, Stripe CLI commands documentati
- [x] LEGAL.md — nota nel recent sprints per audit trail webhook/payment

**Comportamento se migration non è applicata**: `claimWebhookEvent()` riceve `insertError.code === '42P01'` da Postgres → restituisce `{ claimed: true, fallback: true }` → webhook processa normalmente → `markProcessed`/`markFailed` ricevono `42P01` e sono no-op → `console.warn` in ogni caso. Zero breaking change per utenti finali.

**Prossimo step manuale**: applicare `supabase/migration_v11_stripe_webhook_events.sql` in Supabase dashboard → SQL Editor, poi verificare con `stripe trigger checkout.session.completed` tramite Stripe CLI che la riga venga creata in `stripe_webhook_events`.

---

## Sprint completati — k6 Load Test Harness (28 Apr 2026)

- [x] `tests/load/splitvote-smoke-load.js` — script k6 con safety guard produzione (aborto se `BASE_URL` contiene `splitvote.io` e `ALLOW_PROD_LOAD_TEST` non è `"true"`)
- [x] Scenari: 5 VU read-only per 30s (home, trending, category/technology, play/trolley, results/trolley); write scenario opzionale (1 req/s, 15s, POST /api/vote anonimo) attivo solo se `ENABLE_WRITE_TESTS=true`
- [x] Thresholds conservativi: p95 ISR < 1500ms, p95 force-dynamic < 3000ms, `http_req_failed` < 5%, checks > 90%
- [x] Metrica custom `vote_rate_limited` per tracciare % di 429 sul vote API
- [x] `package.json` — aggiunto script `load:smoke` → `k6 run tests/load/splitvote-smoke-load.js`
- [x] `LAUNCH_AUDIT.md` — sezione completa con installazione k6, comandi localhost/preview/prod, metriche da monitorare, definizione "pass" per soft launch, prossimo step consigliato
- [x] Nessun runtime behavior modificato — zero modifiche a API, Redis, Supabase, Stripe, AdSense, cookie consent

**Nota force-dynamic play/results**: il test misura esattamente il rischio identificato nell'audit: ogni VU che colpisce `/play/[id]` o `/results/[id]` genera un server render completo (Next.js + `cookies()` + `supabase.auth.getUser()` + Redis). A 5 VU concurrent il test è sicuro; aumentare gradualmente su Preview prima di produzione.

**Prossimo step**: eseguire baseline su Vercel Preview (`BASE_URL=https://..vercel.app ALLOW_PROD_LOAD_TEST=true k6 run tests/load/splitvote-smoke-load.js`) e poi eseguire stesso test su produzione in orario basso traffico prima di campagne paid.

---

## Sprint completati — Claude Code Governance Docs (28 Apr 2026)

- [x] `CLAUDE.md` — guida operativa root con stack, source-of-truth docs, aree sensibili, regole anti-regressione, workflow e definition of done
- [x] `.claude/agents/security-reviewer.md` — reviewer per auth/admin/API/Stripe/input/log/security
- [x] `.claude/agents/seo-content-reviewer.md` — reviewer per SEO, hreflang, metadata, JSON-LD, content quality e social sharing
- [x] `.claude/agents/release-readiness-reviewer.md` — reviewer per ship/no-ship, verifiche, rischio deploy e fine giornata
- [x] `.claude/agents/product-growth-reviewer.md` — reviewer per retention, share loop, gamification, premium, i18n e scoping sprint
- [x] Nessun codice applicativo, DB, API, Stripe, Supabase, Redis, AdSense o runtime behavior modificato

## Sprint completati — Social Share + Insight + Content QA Polish (28 Apr 2026)

- [x] `app/play/[id]/VoteClientPage.tsx` — aggiunto pulsante "Share this dilemma" / "Condividi questo dilemma" pre-voto: Web Share API + clipboard fallback; solo domanda + link, zero percentuali
- [x] `app/results/[id]/ResultsClientPage.tsx` — `webShareText` ora sempre aggregato (maggioranza, non voto utente); rimossa riga "I voted:" / "Ho votato:" da `instagramCaption`; `storyCardUrl` senza parametro `voted`
- [x] `app/api/story-card/route.tsx` — rimosso `votedLabel` ("You chose" / "Hai scelto"); colori barre uniformi (nessuna evidenza del voto personale); parametro `voted` rimosso
- [x] `lib/expert-insights.ts` — migliorati `whyPeopleSplit` per `morality` (soglia che attiva ciascun sistema etico) e `loyalty` (lealtà si sente, equità si ragiona)
- [x] `app/personality/PersonalityClient.tsx` — fix IT bug: `loginHref` ora `/login?locale=it` per utenti IT non loggati
- [x] `lib/dynamic-scenarios.ts` — aggiunto `patchApprovedScenario(id, fields)` per patch testo su scenari Redis approvati
- [x] `app/api/admin/dilemmas/[id]/route.ts` — nuovo endpoint `PATCH /api/admin/dilemmas/[id]` per correggere refusi in scenari Redis (admin-only); usare per correggere `dipendeme` → `dipendente` sullo scenario IT segnalato
- [x] Nessun DB schema, nessun paid feature, nessun nuovo tracking

**Nota fix typo Redis**: per correggere `dipendeme` → `dipendente` sullo scenario AI approvato:
1. `GET /api/admin/dilemmas?locale=it&status=approved` → trova l'`id` dello scenario con il refuso
2. `PATCH /api/admin/dilemmas/{id}` con body `{ "optionA": "..." }` (o il campo corretto)

---

## Sprint completati — Guided Category Path MVP (28 Apr 2026)

- [x] `lib/scenarios.ts` — aggiunto `getFreshNextScenarioIdByCategory(category, currentId, votedIds, dynamicPool)`: esclude già-votati, preferisce dynamic top-half per categoria, fallback statici
- [x] `lib/scenarios-it.ts` — aggiunto `CATEGORY_LABELS_IT` per nomi italiani delle categorie
- [x] Category pages EN/IT — CTA "Start path →" / "Inizia percorso →" che linka al primo dilemma della categoria con `?path=[cat]&step=1&target=3`
- [x] Play pages EN/IT — leggono `?path`, `?step`, `?target`; calcolano `nextPathId`; passano props a VoteClientPage; progress indicator "Category · step/target" sopra la domanda
- [x] VoteClientPage — path props; cookie-redirect preserva path params; `submitVote` redirect preserva path params; CTA "already voted" route-aware
- [x] Results pages EN/IT — leggono path params; calcolano `nextPathId` via `getFreshNextScenarioIdByCategory`; passano tutto a ResultsClientPage
- [x] ResultsClientPage — CTA section path-aware: "Continue path →" (step < target), "Path complete 🎉" + browse (step = target), "No fresh dilemmas" (esaurito); progress indicator inline
- [x] Nessun DB schema, nessun auth change, nessun paid feature, nessun nuovo tracking oltre eventi GA già esistenti

---

## Sprint completati — Admin Content QA Editor (28 Apr 2026)

- [x] `app/admin/ScenarioQAEditor.tsx` — nuovo client component con search full-text, filtro locale EN/IT/All, editing inline per `question`/`optionA`/`optionB`/`seoTitle`/`seoDescription`, char counter per campo, salvataggio via `PATCH /api/admin/dilemmas/[id]`, update ottimistico lista locale
- [x] `app/admin/page.tsx` — aggiunta tab "Content QA" con `ScenarioQAEditor`
- [x] Ora possibile correggere `dipendeme` → `dipendente` direttamente dalla tab Content QA senza deploy

---

## Sprint completati — Performance Safety Audit (28 Apr 2026)

### Audit table — ogni route classificata

| Route | Stato | Decisione | Motivo |
|---|---|---|---|
| `app/page.tsx` | `revalidate=3600` | ✅ Corretto | No per-user state — Redis + trending aggregati |
| `app/it/page.tsx` | `revalidate=3600` | ✅ Corretto | Idem |
| `app/trending/page.tsx` | `revalidate=3600` | ✅ Corretto | Solo scenari Redis aggregati, no auth |
| `app/it/trending/page.tsx` | `revalidate=3600` | ✅ Corretto | Idem |
| `app/category/[category]/page.tsx` | `revalidate=3600` | ✅ Corretto + `dynamicParams=false` aggiunto | No per-user state; 8 slug noti a build time |
| `app/it/category/[category]/page.tsx` | `revalidate=3600` | ✅ Corretto + `dynamicParams=false` aggiunto | Idem |
| `app/play/[id]/page.tsx` | `force-dynamic` | ✅ **Deve restare dynamic** | Legge `cookies()` (sv_voted_* anon) + `supabase.auth.getUser()` (existingVote, canChangeUntil) + `votedIds` per nextId personalizzato |
| `app/it/play/[id]/page.tsx` | `force-dynamic` | ✅ **Deve restare dynamic** | Idem (path IT) |
| `app/results/[id]/page.tsx` | `force-dynamic` | ✅ **Deve restare dynamic** | Legge `cookies()` + Supabase votedIds per nextId/nextPathId personalizzato; live vote counts; `dateModified` in JSON-LD |
| `app/it/results/[id]/page.tsx` | `force-dynamic` | ✅ **Deve restare dynamic** | Idem (path IT) |

### Nota su `generateStaticParams` + `force-dynamic` su play/results
Il piano di audit citava questa combinazione come "contraddizione". È corretto dal punto di vista meccanico Next.js, ma la soluzione corretta **non è** rimuovere `force-dynamic`. Le pagine play/results rendono stato per-user (voto esistente, cookie anonimi, next dilemma personalizzato) su ogni richiesta. Non è possibile cachiarle senza rompere queste funzionalità. Il `generateStaticParams()` su quelle pagine è dead code che può essere rimosso in un futuro refactor, ma non ha impatto negativo.

### Modifiche applicate
- `app/category/[category]/page.tsx` — aggiunto `export const dynamicParams = false`
- `app/it/category/[category]/page.tsx` — aggiunto `export const dynamicParams = false`

Effetto: slug di categoria non esistenti (es. `/category/fake`) ricevono 404 immediato dal framework invece di invocare server code e poi `notFound()`.

---

## Prossimo Sprint Prioritario — da definire

### Step operativi pre-scaling (no codice, solo ops)

- [x] **migration v11 applicata e verificata** (28 Apr 2026): `stripe_webhook_events` esiste, trigger `updated_at` presente, RLS abilitato, zero policy client, comportamento dedup confermato
- [x] **migration v12 applicata** (28 Apr 2026): `user_polls` RLS attivo, INSERT client bloccato; policy "Anyone can view approved polls" + "Users can view own polls" presenti
- [x] **migration v13 applicata e verificata** (28 Apr 2026): policy "Users can update own pending polls" rimossa; restano solo "Anyone can view approved polls" + "Users can view own polls" — `user_polls` write path server-only completamente hardened (v11 + v12 + v13)
- [x] **k6 production read-only baseline completato** (28 Apr 2026): Run #1 cold cache homepage 3.20s (threshold fail); Run #2 tutti passati — play 545ms, results 553ms, 0% errors, 100% checks. Risultati in `LOAD_TEST_RESULTS.md`.
- [x] **k6 production spike test completato** (28 Apr 2026): Spike #1 10 VU/30s overall p95 847ms; Spike #2 25 VU/60s overall p95 777ms, play 564ms, results 580ms — entrambi PASS. Risultati in `LOAD_TEST_RESULTS.md`. No 50 VU produzione senza Preview o finestra controllata.

### Candidati prodotto

- **Stripe QA end-to-end** ← priorità alta: runbook pronto in `LAUNCH_AUDIT.md` — eseguire con Stripe CLI e carta test prima di promuovere Premium a utenti reali
- **i18n espansione `es`**: prossima lingua spagnolo — seguire pattern middleware + route duplicate + CATEGORY_LABELS_ES; attendere metriche traffico IT prima di iniziare
- ~~**Streak milestones**~~: ✅ completato (sprint 28 Apr 2026)

---

## Sprint completati — Personality Share Card (28 Apr 2026)

- [x] `app/api/personality-card/route.tsx` — edge `ImageResponse` 1080×1920 PNG per tutti e 6 gli archetipi, EN/IT
- [x] `PersonalityClient.tsx` — aggiunto pulsante "Save card" / "Salva card" con `<a download>` accanto al pulsante Share
- [x] `lib/personality.ts` invariato — `shareText`/`shareTextIt` già presenti; nessun nuovo archetipo
- [x] Copy: "Based on my SplitVote choices" + disclaimer entertainment-only nella card
- [x] Nessuna API social, nessun auto-post, nessun nuovo DB schema, nessun nuovo tracking

---

## Sprint completati — Fresh Next Dilemma + Vote Grace UX (28 Apr 2026)

- [x] `lib/scenarios.ts` — aggiunto `getFreshNextScenarioId(currentId, votedIds, dynamicPool)` che esclude currentId + tutti i già-votati
- [x] Utenti loggati: query Supabase ottimizzata (una sola query) raccoglie tutti i voti incluso quello corrente
- [x] Utenti anonimi: cookie `sv_voted_*` letti server-side via `cookies()` da `next/headers`
- [x] Fallback: `nextId = null` quando tutte le domande disponibili sono già state votate; bottone "Browse all" / "Sfoglia tutti" EN/IT
- [x] `VoteClientPage.tsx` — grace UX 3 secondi: countdown con [Undo] / [Confirm now], `prefers-reduced-motion` respected, click stesso bottone = conferma immediata
- [x] `ResultsClientPage.tsx` — `nextId: string | null`, copy `browsedAll` EN/IT
- [x] Nessuna modifica API, nessun nuovo DB schema, nessun nuovo tracking
- [x] Base per path gamificati: `getFreshNextScenarioId` accetta `votedIds: Set<string>` — pronto per filtrare per categoria

---

## Sprint completati — Profile UX + Personality Entry Point (28 Apr 2026)

- [x] Personality CTA card nel Dashboard (server component, locked/unlocked via votesCount)
- [x] Personality entry card in ProfileClient con progress bar se < 3 voti
- [x] Link "Moral Personality" nel MobileMenu sezione Account (EN/IT locale-aware)
- [x] Footer: icone SVG ufficiali per tutti i social (Instagram, TikTok, Reddit, Twitch)
- [x] Aggiunti Reddit (`https://www.reddit.com/user/Splitvote/`) e Twitch (`https://www.twitch.tv/splitvote`) a `lib/social-links.ts`

---

## Sprint completati — Security Hardening Pre-Scaling (28 Apr 2026)

- [x] Open Redirect fix: `lib/safe-redirect.ts` — `safeRedirect()` su `auth/callback` e `login/page`
- [x] JSON-LD XSS fix: `JsonLd.tsx` escapa `<`/`>`/`&`; tutti i JSON-LD inline ora sicuri
- [x] GA proxy: `/api/_g/script` ignora `id` user-supplied, usa solo GA ID configurato
- [x] API input bounds: metadata cap 2KB, scenarioId pattern, countryCode regex, avatarEmoji length, displayName control chars
- [x] Log safety: nome utente rimosso da Stripe webhook log; profile error log ridotto a error code
- [x] Docs: README Security Notes, ROADMAP sprint, LAUNCH_AUDIT aggiornato

---

## Stato Attuale

### Roadmap — Gamification & Social Identity

**Obiettivo prodotto:** evolvere SplitVote da voting game virale a piattaforma di identità sociale basata su scelte, progressi, status e ricompense.

Loop strategico:

`Engagement → Identità → Status → Monetizzazione`

#### Cosa esiste già

- [x] Voto anonimo frictionless: nessun account richiesto per votare
- [x] Account opzionale con storico voti, XP, streak, badge e missioni daily
- [x] `profiles.xp`, `profiles.streak_days`, `profiles.streak_last_date` da `migration_v3_engagement.sql`
- [x] Tabelle `badges` e `user_badges` da `migration_v2_safe.sql`
- [x] `mission_completions` + funzione DB `award_mission_xp`
- [x] Daily missions server-validate in `GET /api/missions` e `POST /api/missions/complete`
- [x] Profilo pubblico base `/u/[id]`
- [x] `equipped_badge` e `equipped_frame` già presenti su `profiles` come base per cosmetici futuri
- [x] Entitlements centralizzati in `lib/entitlements.ts`

#### Cosa è solo pianificato

- [ ] Bacheca pubblica utente con layout curato per badge/trofei
- [ ] Privacy controls granulari sul profilo pubblico
- [ ] Trofei unici per eventi limitati
- [ ] Quest globali, settimanali, evento e categoria
- [ ] Geo quest privacy-safe
- [ ] Leaderboard aggregate
- [ ] Share card profilo/badge/trofeo
- [ ] Cosmetic shop: skin bacheca, cornici profilo, avatar speciali, bundle premium

#### Principi prodotto

- Voto sempre frictionless
- Login mai obbligatorio per votare
- Account utile per identità, progressi e ricompense
- Nessun pay-to-win
- Monetizzazione: cosmetici, no-ads/premium utility, non manipolazione dei risultati
- Privacy-first per geo quest
- I premi conquistati devono valere più dei premi acquistati
- Evitare over-engineering prima della validazione traffico/retention

#### Fase 1 — Core Gamification

- [ ] Streak milestones 7/15/30 giorni
- [ ] Badge base:
  - First Vote
  - 10 Votes
  - 100 Votes
  - 7-Day Streak
  - 30-Day Streak
- [ ] Profilo base con badge visibili
- [ ] Nessuna monetizzazione obbligatoria
- [ ] QA: reward server-side, nessun award client-trusted

#### Fase 2 — Public Profile / Bacheca

- [ ] Profilo pubblico condivisibile
- [ ] Bacheca badge/trofei
- [ ] Statistiche pubbliche opzionali
- [ ] Privacy controls per mostrare/nascondere elementi
- [ ] Share card profilo
- [ ] Default sicuro: mostrare solo informazioni non sensibili e chiaramente pubbliche

#### Fase 3 — Quest System

- [ ] Daily quest evolute
- [ ] Weekly quest
- [ ] Event quest
- [ ] Quest per categoria
- [ ] Path guidati per categoria, es. "3 domande technology", evitando dilemmi già votati
- [ ] Premi: XP, badge, trofei
- [ ] Server-side verification obbligatoria
- [ ] Niente reward basati su azioni non verificabili

#### Fase 4 — Geo Quest

- [ ] Quest per nazione
- [ ] Quest per città
- [ ] Quest per quartiere solo se privacy-safe
- [ ] Leaderboard aggregate
- [ ] Niente tracciamento preciso obbligatorio
- [ ] Geografia dichiarata volontariamente dall'utente come fonte primaria per città/quest
- [ ] IP geolocation solo approssimativa, opt-in/consenso esplicito se usata per feature prodotto, mai con raw IP salvato
- [ ] Soglie minime di campione per evitare identificazione indiretta

#### Fase 5 — Unique Trophies

- [ ] Trofei per eventi limitati
- [ ] Trofei non acquistabili
- [ ] Trofei per vincitori di quest
- [ ] Trofei per costanza:
  - 7 giorni
  - 15 giorni
  - 30 giorni
  - 3 mesi
  - 1 anno
  - 10 anni
- [ ] Regola: i trofei più prestigiosi devono essere earned-only

#### Fase 6 — Cosmetic Monetization

- [ ] Skin bacheca
- [ ] Cornici profilo
- [ ] Avatar speciali
- [ ] Bundle premium
- [ ] Oggetti acquistabili
- [ ] Oggetti ottenibili solo tramite quest
- [ ] Oggetti ottenibili solo tramite anzianità/streak
- [ ] I cosmetici non alterano risultati di voto, ranking, conteggi o visibilità dell'opinione

#### Modello concettuale futuro (non implementare ora)

| Entity | Scopo | Campi principali ipotetici | Priorità | Dipendenze |
|---|---|---|---|---|
| `Badge` | Ricompensa ricorrente/base | id, name, description, icon, rarity, unlock_rule, category | Alta | `badges` esiste già |
| `Trophy` | Ricompensa unica/status | id, name, description, icon, rarity, event_id, earned_only, limited_until | Media | Quest/event system |
| `UserBadge` | Badge assegnato a utente | user_id, badge_id, earned_at, equipped | Alta | `user_badges` esiste già |
| `UserTrophy` | Trofeo assegnato a utente | user_id, trophy_id, earned_at, source_event, display_order | Media | Trophy + quest/event |
| `Quest` | Obiettivo verificabile | id, type, locale, category, starts_at, ends_at, requirements, rewards | Alta | Mission validation |
| `QuestProgress` | Stato utente su quest | user_id, quest_id, progress, completed_at, claimed_at | Alta | Quest |
| `ProfileCosmetic` | Oggetto cosmetico | id, type, name, rarity, source, price, availability, preview_asset | Bassa | Cosmetic economy |
| `UserCosmetic` | Oggetto posseduto | user_id, cosmetic_id, acquired_at, source, equipped | Bassa | ProfileCosmetic |
| `PublicProfile` | Config pubblica profilo | user_id, slug, visibility, shown_stats, shown_badges, shown_trophies, board_theme | Media | Privacy controls |

#### Cosmetic Economy

Tipi oggetti:

- `earned-only`: ottenibili solo con attività, streak, quest o eventi
- `purchasable-only`: acquistabili direttamente, valore estetico
- `event-limited`: disponibili solo durante eventi specifici
- `founder/early-user`: ricompense per early adopters
- `streak/anniversary`: legati ad anzianità o costanza
- `premium-bundle`: inclusi in abbonamento o pacchetto premium

Regole:

- Non vendere vantaggi sul voto
- Non vendere risultati
- Non manipolare classifiche
- Evitare gambling/loot box nella prima versione
- Prezzi piccoli, chiari e non predatori
- Separare chiaramente "earned prestige" da "paid style"

#### Ordine consigliato di implementazione

1. Completare soft launch e validare traffico
2. Introdurre badge/streak minimi
3. Creare profilo pubblico semplice
4. Aggiungere share card badge/profilo
5. Introdurre quest globali
6. Solo dopo traffico reale: geo quest
7. Solo dopo engagement reale: cosmetic shop

#### Cosa NON implementare ora

- Geo quest con geolocalizzazione precisa
- Leaderboard personali pubbliche senza privacy controls
- Shop cosmetico prima di avere retention reale
- Loot box, random rewards acquistabili o meccaniche gambling-like
- Reward basati su eventi non verificabili server-side
- Login obbligatorio nel voting flow

### Sprint Completato — Admin Pro Dashboard + Content Tools (27 Apr 2026)

**Home trending reale + Admin dashboard professionale con tab ✅**

- [x] `lib/trending.ts`: `getTrendingScenarioIds24h(candidateIds, limit=6)`
  - Fonte primaria: `vote_daily_stats` (oggi + ieri, aggregato per `dilemma_id`)
  - Fallback: Redis `getVotesBatch` all-time votes
  - Last resort: primi N candidateIds
- [x] `app/page.tsx`: trending EN usa dati reali 24h da vote_daily_stats; sezione rinominata "Latest Questions"
- [x] `app/it/page.tsx`: trending IT usa dati reali 24h; sezione rinominata "Nuove Domande"
- [x] `app/admin/GenerateDraftPanel.tsx`: prop `defaultType?: 'dilemma' | 'blog_article'`
- [x] `app/admin/page.tsx`: dashboard ristrutturata con 6 tab:
  - **Overview**: KPI cards (Users, Votes, Badges, Polls) + business metrics + anon/logged breakdown
  - **Voting**: VotesChart + SignupsChart + top voters + recent signups
  - **Content**: poll status + pending polls + feedback per-dilemma (top🔥 / bottom👎 via `dilemma_feedback_stats` view)
  - **AI Drafts**: GenerateDraftPanel (dilemma) + SeedBatchPanel + CronDebug con dry-run
  - **Blog**: GenerateDraftPanel (blog_article) + disclaimer preview-only
  - **Monetization**: premium count + conversion rate + placeholder Stripe
- [x] `supabase/migration_v10_content_events.sql`: piano audit content events — `content_events_summary` view + indice scenario_id + documentazione event_type pianificati (DRAFT — non ancora applicato)

**Feedback analytics (STEP 4) — dati reali da `dilemma_feedback_stats` view:**
- Query admin `dilemma_feedback_stats`: `fire_count`, `down_count`, `total_count`, `fire_pct`
- Top 5 dilemmi per fire_pct + bottom 5 per fire_pct (solo dilemmi con ≥ 3 feedback)
- Visibili nel tab Content

---

### Sprint Completato — Expert Insight v2 (27 Apr 2026)

**Expert Insight post-voto: struttura, personalizzazione, AI-ready ✅**

- [x] `lib/expert-insights.ts`: interfaccia estesa con `whyPeopleSplit`, `whatYourAnswerMaySuggest {a, b}`, `ExpertPerspective`, `DynamicExpertInsight`
  - 8 categorie completamente riscritte (EN + IT): body più breve e mobile-first, nuovo campo `whyPeopleSplit`, prospettive per scelta A/B
  - Linguaggio cauto obbligatorio: "may suggest", "could indicate" — mai affermazioni definitive sulla psicologia dell'utente
  - Nessun consiglio medico, legale o psicologico professionale — sempre disclaimer esplicito
- [x] `lib/dynamic-scenarios.ts`: campi opzionali `expertInsightEn`, `expertInsightIt` in `DynamicScenario`
  - Draft-only: i campi sono generati dal cron ma visibili solo dopo approvazione admin
  - Override parziale del fallback statico (solo i campi non-null sovrascrivono)
- [x] `app/results/[id]/ResultsClientPage.tsx`: UI Expert Insight ristrutturata
  - Tre sezioni: insight principale → "Why people split" → "What your choice may suggest"
  - "What your choice may suggest" visibile SOLO se l'utente ha votato, con testo specifico per scelta A o B
  - EN_COPY e IT_COPY: nuove chiavi `insightWhySplit`, `insightYourChoice`
  - Merge dinamico: se `expertInsightEn/It` presente nel scenario, override del fallback statico
- [x] `app/api/cron/generate-dilemmas/route.ts`: prompt aggiornato
  - Claude genera `insightBody`, `insightWhySplit`, `insightPerspectiveA/B` come campi opzionali
  - Mapping nei candidate → `expertInsightEn` o `expertInsightIt` a seconda del locale
  - Admin review obbligatoria — mai pubblicati senza approvazione

**Guardrail professionali:**
- Mai: "sei X tipo di persona", diagnosi, prognosi, consiglio clinico
- Sempre: "may suggest", "could indicate", "might reflect" + disclaimer
- AI insights: draft-only → review obbligatoria → approvazione admin → pubblico

---

### Sprint Completato — AI Content Hardening + Audit (27 Apr 2026)

**Quality gates autopublish + content opportunities + launch audit ✅**

- [x] `lib/content-quality-gates.ts`: funzione centralizzata `runQualityGates(input)` — 12 hard gates + 3 warnings
  - Locale valido en/it
  - Question length 20-300 chars
  - OptionA/B length 5-200 chars, max 4:1 ratio
  - SEO title (10-120) e description (20-320) presenti
  - Category valida (8 categorie)
  - Blocklist contenuti pericolosi (espanso da cron BLOCKED_PATTERNS)
  - Language match: IT richiede ≥2 segnali italiani nel testo
  - noveltyScore ≥ 75 per autopublish (stricter di 55 draft threshold)
  - finalScore ≥ 75 per autopublish
  - similarItems count ≤ 2
  - Output: `{ passed, score, reasons[], warnings[] }`
- [x] `lib/dynamic-scenarios.ts`: campi opzionali `autoPublished`, `qualityGateScore`, `qualityGateReasons`, `generatedBy` in `DynamicScenario`
- [x] `app/api/cron/generate-dilemmas/route.ts`: autopublish condizionale
  - `AUTO_PUBLISH_DILEMMAS=true` richiesto esplicitamente — fail closed per default
  - `AUTO_PUBLISH_DILEMMAS_MAX_PER_RUN` (default 1) — max dilemmi auto-approvati per run
  - Quality gates passati → `saveDynamicScenarios()` direttamente (approvato)
  - Quality gates falliti → `saveDraftScenarios()` come prima
  - Metadata salvati: `autoPublished: true`, `qualityGateScore`, `generatedBy: 'cron'`
  - Risultati: `autoPublished` + `savedToDraft` nel response JSON
- [x] `app/api/admin/content-opportunities/route.ts`: GET admin-only read-only
  - Ranked dilemmi più votati (Redis vote counts)
  - Blog topic suggestions per ciascun dilemma (template-based, zero cost AI)
  - Category gaps: categorie senza articolo blog in EN/IT
  - Autopublish status live
- [x] `app/admin/CronDebug.tsx`: badge ⚡ AUTO (cyan) per dilemmi auto-pubblicati; badge QG:{score} per qualityGateScore
- [x] `README.md`: env vars `AUTO_PUBLISH_DILEMMAS`, `AUTO_PUBLISH_DILEMMAS_MAX_PER_RUN`, `BLOG_WEEKLY_DRAFTS`
- [x] `LAUNCH_AUDIT.md`: audit completo stato progetto

**Regole autopublish (da rispettare in tutti gli sprint futuri):**
- `AUTO_PUBLISH_DILEMMAS=false` per default — MAI abilitare senza review quality gates
- Quality gate threshold autopublish: noveltyScore ≥ 75, finalScore ≥ 75 (vs draft threshold 55)
- Blog: NON autopubblicato — richiede storage migration (vedi sotto)
- Admin vede sempre badge ⚡ AUTO sui dilemmi auto-pubblicati

---

### Blog Weekly Generation — Piano Tecnico (da implementare in sprint dedicato)

**Problema**: il blog è attualmente hardcodato in `lib/blog.ts`. Un cron non può modificare file TypeScript in produzione senza commit/deploy.

**Soluzione consigliata**: Redis `blog:drafts` + `blog:published` (pattern identico ai dilemmi)

**Piano dettagliato**:

1. **Storage**: due Redis keys
   - `blog:drafts` (max 10) — bozze generate dal cron
   - `blog:published` (max 30) — articoli approvati per pubblicazione
   - Struttura: array di `BlogDraft` objects con tutti i campi di `BlogPost` + `status: 'draft' | 'published'`

2. **Endpoint generazione**: `POST /api/admin/generate-blog-draft`
   - Admin-only, OpenRouter (modello capace come claude-3.5-haiku)
   - Input: locale, topic (da content-opportunities endpoint)
   - Output: `BlogDraft` salvata in `blog:drafts`
   - NON usa `lib/blog.ts` — salva in Redis
   - Blocco: `BLOG_WEEKLY_DRAFTS=false` (default) → 503

3. **Cron settimanale**: `POST /api/cron/generate-blog-draft` (schedule: `0 9 * * 1`)
   - Chiama `GET /api/admin/content-opportunities` internamente
   - Prende il top topic per locale (EN + IT) non ancora coperto
   - Genera e salva in `blog:drafts`
   - MAI autopubblica (differente da dilemmi — richiede revisione editoriale manuale)

4. **Route pubbliche**: aggiornare `app/blog/[slug]/page.tsx` e `app/it/blog/[slug]/page.tsx` per leggere anche da `blog:published` Redis (in aggiunta a `lib/blog.ts` come fallback statico)

5. **Admin UI**: aggiungere tab "Blog Drafts" in `/admin` con approve/edit/reject

6. **Sitemap**: aggiornare `app/sitemap.ts` per includere articoli da `blog:published`

7. **Env var richiesto**: `BLOG_WEEKLY_DRAFTS=true` — fail closed per default

**Prerequisiti**:
- [ ] Progettare schema `BlogDraft` TypeScript (estende `BlogPost` da `lib/blog.ts`)
- [ ] Aggiornare `lib/blog.ts` per esporre funzioni di lettura/scrittura da Redis
- [ ] Prompt per blog article generation più lungo e strutturato (section-by-section)
- [ ] Admin review obbligatoria — no autopublish per blog, mai
- [ ] Quality check manuale: ogni articolo deve avere disclaimer, no AI hallucinations, link ai dilemmi reali

**NON implementare prima di**:
- Avere ≥ 20 dilemmi approvati (content base per linking)
- Aver testato content-opportunities endpoint in produzione
- Aver abilitato e testato `AUTO_PUBLISH_DILEMMAS` per almeno 7 giorni

---

### Sprint Precedente — Vote Integrity Hardening (27 Apr 2026)

**Integrità voto + rate limiting granulare + funnel tracking ✅**

- [x] **replaceVote atomic-safe**: Lua eval su Upstash Redis — operazione atomica in singolo round-trip, clamp automatico a ≥ 0 prima del decremento. Nessuna possibilità di decremento parziale in caso di errore.
- [x] **Rate limit voto granulare** — 3 livelli via Redis keys con TTL:
  - Tier 1 global IP: 60/ora (era 20 — alzato per compatibilità NAT); key `ratelimit:{ip}`
  - Tier 2 scenario+IP: 5 per dilemma per IP per 10 min; key `ratelimit:scenario:{id}:{ip}`
  - Tier 3 user: 120/ora per utente loggato; key `ratelimit:user:{userId}`
- [x] **Vote funnel server-side tracking** per utenti loggati: `vote_success`, `vote_change`, `vote_duplicate` (con reason: same_option/locked/race_condition), `vote_rate_limited`. Inseriti via admin client in `user_events`. Non-blocking, non bloccano il voto. Anonimi: nessun insert personale.
- [x] **ALLOWED_EVENT_TYPES** in `/api/events/track` aggiornato con i 4 nuovi event type per coerenza di schema.
- [x] Nessuna migration Supabase necessaria — `event_type` è text senza enum constraint.

---

### Sprint Precedente — Hardening Tecnico Pre-Lancio (27 Apr 2026)

**Performance + policy + bug fix ✅**

- [x] **Middleware public route optimization**: `isAuthRelevantPath()` helper — Supabase `auth.getUser()` chiamato solo su `/dashboard`, `/profile`, `/admin`, `/submit-poll`, `/api/admin/*`, `/api/missions/*`, `/api/events/*`, `/api/email/*`, `/api/stripe/portal|subscription`, `/api/me/*`. Tutte le route pubbliche (`/play/*`, `/results/*`, `/blog/*`, etc.) restituiscono `NextResponse.next()` senza roundtrip Supabase.
- [x] **AdSense official script**: rimosso proxy `/api/_g/ads` dal layout — AdSense ora carica da `pagead2.googlesyndication.com` (script ufficiale). `/api/_g/ads` resta ma non usato. Policy-safe per AdSense review.
- [x] **Fix IT "Opzione A/B"**: `optionA`/`optionB` aggiunti a EN_COPY/IT_COPY in `VoteClientPage.tsx` — IT mostra "Opzione A" / "Opzione B" invece di "Option A" / "Option B".
- [x] **Fix OG download extension**: "Save for Instagram" punta a `storyCardUrl` (PNG 9:16) invece che a `ogImageUrl` (SVG) — download attribute aggiornato a `.png`.
- [x] **migration_v9 aggiornata**: README aggiornato → ✅ Applied.

---

### Sprint Precedente — Social Content Factory Phase 2 (28 Apr 2026)

**UTM tracking, links strutturati e publish checklist ✅**

- [x] `lib/social-content.ts`: aggiunti campi opzionali backward-compatible a `SocialContentItem`:
  - `playUrl` — URL play diretto senza UTM (EN: `/play/{id}`, IT: `/it/play/{id}`)
  - `resultsUrl` — URL results per lo stesso dilemma
  - `utmUrl` — URL play con `utm_source=platform&utm_medium=social&utm_campaign=soft_launch`
  - `utmSource` — valore utm_source: 'tiktok' o 'instagram'
  - `utmCampaign` — valore utm_campaign: 'soft_launch'
  - `publishChecklist` — passi manuali di pubblicazione per piattaforma (array di stringhe)
  - `priority` — `'high'` per dynamic approved, `'medium'` per statici evergreen
- [x] `scripts/generate-social-content.mjs`: aggiornato con:
  - `buildUtmUrl()`: costruisce UTM con `utm_content={id}-{locale}-{platform}`
  - `buildPublishChecklist()`: checklist 5 step per TikTok, 5 step per Instagram
  - `priority`: dynamic approved → 'high'; statici → 'medium'
  - Markdown: sezione **Links** con Play URL, Results URL, UTM URL, Story Card PNG
- [x] Zero auto-publish, zero API social, output sempre locale in `content-output/`
- [x] Verificato in locale: 20 item (5 per combo), tutti i link EN/IT corretti ✅

---

### Sprint Precedente — Social Content Factory Phase 1 (27 Apr 2026)

**Pipeline locale caption social da dilemmi approvati ✅**

- [x] `lib/social-content.ts`: tipi TypeScript `SocialContentItem`, `SocialContentBatch`, `SocialPlatform`, `SocialLocale`
- [x] `scripts/generate-social-content.mjs`: script ESM puro Node (senza tsx/ts-node)
  - `loadEnvFile()`: parser manuale `.env.local`, graceful fallback se mancante
  - `STATIC_SCENARIOS` + `IT_TRANSLATIONS`: tutti i 41 dilemmi statici EN/IT inline nel script
  - `HOOKS`: 3 hook per categoria per locale (EN/IT) — selezionati deterministicamente via `hashSeed`
  - `HASHTAGS`: array TikTok e funzione Instagram per locale e categoria
  - `buildTikTokCaption()` / `buildInstagramCaption()`: template puri, zero costo AI
  - `getDynamicApproved()`: import dinamico `@upstash/redis`, filtra `status === 'approved'`
  - `pickN()`: dedup per batch, re-use se pool < N
  - Output: `content-output/YYYY-MM-DD/social-content.{json,md}`
- [x] `package.json`: aggiunto `"generate:social-content": "node scripts/generate-social-content.mjs"`
- [x] `.gitignore`: aggiunto `/content-output/`
- [x] Verificato in locale: 20 item (5 TikTok EN + 5 Instagram EN + 5 TikTok IT + 5 Instagram IT), dynamic approved prioritizzato ✅

**Utilizzo:**
```bash
nvm use && npm run generate:social-content
# Output in content-output/YYYY-MM-DD/social-content.{json,md}
```

**⚠️ content-output/ è gitignored — mai committare output generato.**

---

### Sprint Precedente — Social Links + Referral QA (27 Apr 2026)

**Social presence + caption consistency + referral QA ✅**

- [x] `lib/social-links.ts`: costanti centralizzate per Instagram (`@splitvote.io`) e TikTok (`@splitvote8`)
- [x] `components/Footer.tsx`: link Instagram + TikTok — `target="_blank"`, `aria-label` EN/IT, `rel="noopener noreferrer"`
- [x] `app/layout.tsx`: Organization JSON-LD `sameAs` aggiornato con Instagram e TikTok
- [x] `app/results/[id]/ResultsClientPage.tsx`: caption TikTok e Instagram includono handle ufficiali
  - TikTok EN/IT: aggiunto `@splitvote8` prima degli hashtag
  - Instagram EN/IT: aggiunto `@splitvote.io` + ristrutturato "Link in bio" line
- [x] `README.md`: migration v8 → ✅ Applied; v9 aggiunta come ⏳ Pending; tabella missioni aggiornata
- [x] Referral QA: codice challenge_friend verificato (vedi sotto)

**Referral QA — challenge_friend:**
- ✅ `profiles.referral_code` backfillato per tutti gli utenti esistenti (migration v9)
- ✅ Nuovi profili ricevono `referral_code` via DEFAULT PostgreSQL
- ✅ `/api/referral/visit`: self-referral bloccato (`user?.id === referrerId`)
- ✅ Dedup server-side: 1 `referral_visit` per (referrer_user_id, scenario_id) per giorno
- ✅ Dedup client-side: `sessionStorage` barrier su VoteClientPage
- ✅ `challenge_friend` legge `referral_visit` da `user_events` (non più Coming Soon)
- ✅ Nessun `user_id` raw negli URL: solo `?ref=<10-hex-chars>`
- ⚠️ Visitor anonimi possono triggerare referral_visit (trade-off accettato — sessione dedup mitiga abuse casuale)
- ⚠️ RLS `profiles`: fetch `referral_code` in ResultsClientPage richiede policy `auth.uid() = user_id` (standard Supabase — già presente nelle migration esistenti)

**⚠️ Migration da applicare:**
```sql
-- Supabase dashboard → SQL Editor → supabase/migration_v9_referral_codes.sql → Run
```

---

### Sprint Precedente — challenge_friend Referral Tracking (27 Apr 2026)

**challenge_friend mission — server-verified via referral_code ✅**

- [x] `supabase/migration_v9_referral_codes.sql`: `profiles.referral_code text unique`
  - `left(replace(gen_random_uuid()::text, '-', ''), 10)` — 10 hex chars, URL-safe, non-indovinabile
  - Backfill per utenti esistenti, DEFAULT per nuovi, unique index
- [x] `POST /api/referral/visit`: endpoint senza auth visitatore
  - Admin client risolve `ref` → `referrer user_id` lato server (RLS bypass, sicuro)
  - Self-referral bloccato (visitatore autenticato con stesso `user_id`)
  - Dedup 1/giorno per (referrer, scenario_id)
  - Nessun IP o identità visitatore salvati
- [x] `VoteClientPage.tsx`: prop `referralCode`, `useEffect` chiama `/api/referral/visit` (sessionStorage dedup)
- [x] `ResultsClientPage.tsx`: fetch `referral_code` da profiles, challenge URL include `?ref=<code>`
- [x] `GET /api/missions`: `challenge_friend` rimosso da `COMING_SOON`, progress = `referralVisitsCount`
- [x] `POST /api/missions/complete`: verifica server-side `referral_visit` ≥ 1 per `challenge_friend`
- [x] `app/play/[id]/page.tsx` + `app/it/play/[id]/page.tsx`: `?ref=` passato a VoteClientPage

---

### Sprint Precedente — Share Mission + User Events Tracking (27 Apr 2026)

**share_result mission server-verified + user_events tracking ✅**

- [x] `supabase/migration_v8_user_events.sql`: nuova tabella `user_events`
  - RLS: solo utenti autenticati possono inserire/leggere i propri eventi
  - Nessun accesso anonimo — XP missions richiedono auth
  - Index su `(user_id, event_type, created_at)` per query missioni
  - ⚠️ **NON ancora applicata** — applicare manualmente in Supabase dashboard
- [x] `POST /api/events/track`: nuovo endpoint server-side
  - Allowlist: `share_result`, `copy_result_link`, `story_card_share`, `story_card_download`
  - Auth richiesta — 401 per anonimi (silenzioso nel client)
  - Dedup 60s: skip se stesso (user, type, scenario) inserito nell'ultimo minuto
- [x] `ResultsClientPage.tsx`: tracking server-side collegato a tutti gli share actions
  - Web Share API success → `share_result`
  - Clipboard fallback → `copy_result_link`
  - Story card share (file/URL) → `story_card_share`
  - Story card download (tutti i path) → `story_card_download`
  - Tracking solo su successo (mai su cancel/abort)
  - Anonimi: server restituisce 401 silenzioso, UX invariata
- [x] `GET /api/missions`: `share_result` rimosso da COMING_SOON
  - progress = count eventi share oggi (qualsiasi tipo tra i 4)
  - claimable = true se progress ≥ 1
- [x] `POST /api/missions/complete`: verifica `share_result` via `user_events`
  - Blocca se nessun evento share oggi → 403 con reason
  - Graceful failure se migration non ancora applicata (403 con istruzione)
- [x] `challenge_friend`: resta Coming Soon — nessun referral tracking
- [x] `SeedBatchPanel.tsx`: aggiunto banner "Generated drafts are not public until approved."

**⚠️ Migration da applicare:**
```sql
-- Supabase dashboard → SQL Editor → New query → incolla migration_v8_user_events.sql → Run
```

---

### Sprint Precedente — Mission Validation + Admin Seed Batch UI (27 Apr 2026)

**Mission server-validation + admin seed batch UI ✅**

- [x] `lib/missions.ts`: aggiunto `MissionState` interface (progress, required, completed, claimable, comingSoon)
- [x] `GET /api/missions`: riscritta per restituire stato completo per-missione
  - `vote_3`: conta da `dilemma_votes` oggi — server-verified
  - `vote_2_categories`: conta categorie distinte dai voti di oggi (static + dynamic lookup) — server-verified
  - `daily_dilemma`: almeno 1 voto oggi — server-verified
  - `challenge_friend`: `comingSoon: true, claimable: false` — non tracciabile lato server (ora risolto in sprint successivo)
  - `share_result`: `comingSoon: true, claimable: false` — non tracciabile lato server
- [x] `POST /api/missions/complete`: verifica server-side per `vote_2_categories`
  - Blocca `challenge_friend` e `share_result` (403 — tracking non disponibile)
  - Client non può falsificare nessuna missione verificabile
- [x] `components/DailyMissions.tsx`: UI riscritta
  - Bottone "Claim +XP" solo quando `claimable: true` dal server
  - Progress visibile: `1/3`, `0/2`, ecc.
  - Missioni coming-soon: icona 🔒, non cliccabili, badge "Coming soon"
  - Missioni completate: verde, non cliccabili
  - Errori con `aria-live`, niente crash
- [x] `app/admin/SeedBatchPanel.tsx`: nuovo componente client admin
  - Bottone "Generate 10 EN + 10 IT draft batch" che chiama `POST /api/admin/seed-draft-batch`
  - Usa sessione browser — no curl/cookie manuali
  - Loading state con warning "2-4 min"
  - Summary: total/saved/skipped_novelty/errors
  - Tabella risultati: locale, category, noveltyScore, similar, keyword, question, ID
- [x] `/admin` aggiornato con `SeedBatchPanel`
- [x] `app/dashboard/page.tsx`: rimosso prop `votesToday` (ora calcolato server-side in API)

**Regole missioni (da rispettare in ogni sprint futuro):**
- MAI fidarsi del client per completamento missioni
- `claimable: true` solo se il server verifica i requisiti
- Missioni non tracciabili → `comingSoon: true` — non mostrare come completabili
- XP awarding via DB function `award_mission_xp` con XP hardcoded — no injection

---

### Sprint Precedente — Admin Charts QA + OpenRouter Draft Queue (27 Apr 2026)

**Admin charts QA + OpenRouter save-to-draft-queue ✅**

- [x] `app/admin/AdminCharts.tsx`: empty state + 7d/14d tab toggle
  - `isEmpty` guard — mostra "Not enough data yet" invece di barre vuote
  - Tab 7d/14d con filtro client-side sull'array passato come prop
  - Nessun dato fake generato
- [x] `lib/dynamic-scenarios.ts`: aggiunto `'openrouter'` a `TrendSource`
- [x] `POST /api/admin/generate-draft`: aggiunto `mode: 'preview' | 'save'`
  - `preview` (default): comportamento precedente, non salva
  - `save`: valida, controlla noveltyScore ≥ 55 (threshold), salva in `dynamic:drafts`
  - Dedup guard: blocca save se `noveltyScore < 55` → risponde `409 low_novelty`
  - Override esplicito: `allowLowNovelty: true` nel body bypassa il blocco
  - Blog article save bloccato (→ 400 `blog_article_save_not_supported`) — richiede editing manuale
  - Metadata AI nel DynamicScenario: `trendSource: 'openrouter'`, `trendUrl: model_name`, `scores.noveltyScore`
- [x] `app/admin/GenerateDraftPanel.tsx`: Preview + Save as draft buttons
  - Bottone Preview (sempre disponibile) + Save as draft (solo dilemmi)
  - Dopo save: banner "Saved to draft queue — ID: ai-..."
  - Low novelty: banner warning con bottone "Save anyway (override dedup guard)"
  - `aria-live`, `role="alert/status"`, `aria-busy` per accessibilità
- [x] `app/admin/CronDebug.tsx`: badge AI + noveltyScore per draft OpenRouter
  - `trendSource === 'openrouter'` → badge 🤖 AI (viola)
  - `noveltyScore` mostrato se presente (verde/giallo/rosso)
- [x] `app/api/admin/dilemmas/route.ts`: espone `noveltyScore` nel response

**Regole fondamentali (da rispettare in ogni sprint futuro):**
- Tutti i contenuti generati → `status: draft`, mai autopublicati
- Admin approval obbligatoria prima che un draft entri in route pubbliche o sitemap
- `OPENROUTER_API_KEY` + `OPENROUTER_MODEL_DRAFT` entrambi richiesti — fail-closed
- Nessun secret o prompt nei log
- Novelty threshold: 55/100 — dedup guard blocca save sotto soglia salvo override esplicito
- Blog articles: preview-only in questa fase — editing manuale richiesto in `lib/blog.ts`
- Quest pubblicate solo con ≥3 dilemmi approvati

**Prossimo sprint: Blog article draft queue + scheduled generation**
- Blog article draft queue separata (non Redis dilemmas) — es. Supabase table o Redis key dedicata
- Cron settimanale OpenRouter per mantenere inventory fresca
- Mini quest: aggrega ≥3 dilemmi per tema → pubblica come quest
- Approved dilemmas → sitemap immediata senza redeploy

---

### Sprint Precedente — Email Test + Mobile Menu Polish (27 Apr 2026)

**Email test endpoint + mobile menu groups ✅**

- [x] `POST /api/email/test`: admin test endpoint protetto da `x-email-test-key`
  - Fail-closed se `EMAIL_TEST_KEY` mancante → 503
  - Unauthorized se header errato → 401
  - Destinatari limitati a `hello@splitvote.io` e `support@splitvote.io` — no open relay
  - Usa `sendEmail()` da `lib/email.ts`, nessun secret nei log
- [x] `MobileMenu.tsx`: menu mobile ristrutturato in 4 gruppi logici
  - Gruppo 1 — Main: Home, Trending, Blog (EN/IT)
  - Gruppo 2 — Categories: Morality/Moralità, Technology/Tecnologia, Society/Società, Relationships/Relazioni, Survival/Sopravvivenza
  - Gruppo 3 — Account: My Profile + Dashboard + Sign out (se loggato) / Join free (se anonimo)
  - Gruppo 4 — Help: FAQ, Support (mailto:support@splitvote.io)
  - "Il mio profilo" / "My Profile" rimosso dalle categorie → spostato in Account
  - Sign out button con Supabase client signOut
  - Touch targets min 44px, max-height scroll, locale-aware IT/EN, `next/link` per link interni
  - Account group appare solo dopo risoluzione auth state (no flicker)
- [x] typecheck ✅ · build (0 errori) ✅ · `git diff --check` ✅

**Istruzioni test email:**
```
curl -X POST https://splitvote.io/api/email/test \
  -H "x-email-test-key: $EMAIL_TEST_KEY" \
  -H "Content-Type: application/json" \
  -d '{"to":"hello@splitvote.io"}'
```

---

### Sprint Precedente — Email Setup (Resend) (27 Apr 2026)

**`lib/email.ts` — safe Resend wrapper ✅**

- [x] `resend` ^6.12.2 installato
- [x] `lib/email.ts`: `sendEmail()` — `RESEND_API_KEY` da `process.env`, mai hardcoded
- [x] `EMAIL_FROM` da `process.env`, fallback pubblico `SplitVote <hello@splitvote.io>`
- [x] Fail silenzioso se `RESEND_API_KEY` mancante — `{ ok: false, error: 'email_not_configured' }`
- [x] Nessun secret nei log — solo `error.name` (enum safe), mai chiave API, mai email destinatario
- [x] `.env*.local` già gitignored
- [x] typecheck ✅ · build (138 pagine, 0 errori) ✅ · `git diff --check` ✅

**Env vars richieste in Vercel:**
```
RESEND_API_KEY=re_...           # da resend.com dashboard — NEVER commit
EMAIL_FROM=SplitVote <hello@splitvote.io>   # opzionale, è il default
```

**DNS Resend da configurare su Cloudflare (per inviare da hello@splitvote.io):**
1. Vai su resend.com → Domains → Add domain → `splitvote.io`
2. Resend mostrerà 3 record DNS da aggiungere in Cloudflare:
   - `MX` record (per Resend routing in uscita)
   - `TXT` SPF record: `v=spf1 include:amazonses.com ~all` (o simile, Resend usa SES)
   - `TXT` DKIM record: `resend._domainkey.splitvote.io` → valore CNAME fornito da Resend
3. Aggiungi i record in Cloudflare → DNS → Add Record
4. Attendi propagazione (tipicamente < 5 min con Cloudflare)
5. Clicca "Verify" in Resend dashboard
6. Testa con `resend.emails.send()` da dashboard Resend

⚠️ Nota: Cloudflare Email Routing (inbound) e Resend (outbound) coesistono — non si sovrascrivono. SPF va aggiornato per includere entrambi:
`v=spf1 include:_spf.mx.cloudflare.net include:amazonses.com ~all`

**Stato feature email:**
- `sendEmail()` pronta ma non ancora usata in nessuna route utente
- Non attivare email transazionali utente finché `RESEND_API_KEY` non è verificato in Vercel

---

### Sprint Precedente — SEO Technical Fix (27 Apr 2026)

**Fix tecnici SEO ad alto impatto ✅**

- [x] **Title deduplication**: rimosso suffisso `| SplitVote` da `app/it/page.tsx`, `app/play/[id]/page.tsx`, `app/it/play/[id]/page.tsx`, `app/results/[id]/page.tsx`, `app/it/results/[id]/page.tsx` — il template nel layout lo aggiunge automaticamente
- [x] **hreflang EN/IT su play + results**: aggiunto blocco `alternates.languages` con `en`, `it-IT`, `x-default` a tutte le route play e results (EN e IT)
- [x] **hreflang homepage normalizzato**: `app/layout.tsx` da `'it'` → `'it-IT'`; `app/it/page.tsx` aggiunto `'en': BASE_URL` per reciprocità
- [x] **SEO Landing Pages EN/IT**: `/would-you-rather-questions`, `/moral-dilemmas`, `/it/domande-would-you-rather`, `/it/dilemmi-morali` — 20 items ciascuna, schema.org `ItemList`, hreflang reciproci, sitemap aggiornata
- [x] **JSON-LD su results pages EN/IT**: `BreadcrumbList` + `Dataset` con voti reali (votes.a, votes.b, pctA, pctB) su `/results/[id]` e `/it/results/[id]`

---

### Sprint Precedente — Blog SEO Statico EN/IT (27 Apr 2026)

**Blog implementato e live ✅**

Route create:
- [x] `/blog` — index articoli EN
- [x] `/blog/what-is-a-moral-dilemma`
- [x] `/blog/trolley-problem-explained`
- [x] `/blog/why-people-love-impossible-choices`
- [x] `/it/blog` — index articoli IT
- [x] `/it/blog/cos-e-un-dilemma-morale`
- [x] `/it/blog/problema-del-carrello-spiegato`
- [x] `/it/blog/perche-ci-piacciono-le-scelte-impossibili`

Architettura:
- [x] `lib/blog.ts`: sorgente dati tipizzata con `BlogPost`, `SectionType`, helper `getPost`, `getPostsByLocale`, `getAlternateUrl`, `postUrl`
- [x] `components/BlogArticle.tsx`: renderer condiviso per articoli EN/IT — header, sezioni, dilemmi correlati, CTA, disclaimer
- [x] Tutti i blog route generati come SSG (●) — nessun JS aggiuntivo nel bundle
- [x] `app/sitemap.ts`: aggiunti blog index EN/IT + 6 articoli con `changeFrequency: monthly`
- [x] `components/Footer.tsx`: link Blog EN/IT (prima di FAQ)

SEO:
- [x] Metadata `title`, `description` separati per ogni pagina
- [x] Canonical corretto per ogni route
- [x] `alternates/hreflang` EN↔IT per ogni coppia di articoli
- [x] OpenGraph con `type: article` e `publishedTime` per i post
- [x] Disclaimer leggero su ogni articolo: "Educational content, not professional advice." / "Contenuto educativo, non consulenza professionale."

Contenuto seed:
- [x] 3 articoli EN: moral dilemma, trolley problem, why people love impossible choices
- [x] 3 articoli IT: scritti naturale (non tradotti), stessa struttura
- [x] Ogni articolo collega a dilemmi giocabili reali (trolley, cure-secret, memory-erase, organ-harvest)
- [x] Nessun consiglio medico/legale/psicologico personalizzato

**Backlog blog (non in questo sprint):**
- [ ] Editorial calendar: 1-2 articoli/mese, temi da Search Console performance
- [ ] AI-assisted draft + revisione manuale obbligatoria
- [ ] Ricerca per titolo/tag nel blog index
- [ ] Breadcrumb schema.org JSON-LD per articoli
- [ ] Automatic internal linking via tag condivisi con dilemmi dinamici

---

### Sprint Precedente — QA Post-Deploy + Email/DNS Readiness (27 Apr 2026)

**Deploy QA — commit `1dc9b98` live ✅**

Route live verificate:
- [x] `/` → 200
- [x] `/it` → 200
- [x] `/play/trolley` → 200
- [x] `/it/play/trolley` → 200
- [x] `/results/trolley` → 200
- [x] `/it/results/trolley` → 200
- [x] `/site.webmanifest` → 200, JSON valido
- [x] `/offline` → 200
- [x] `/ads.txt` → 200
- [x] `/sw.js` → 200, network-first, skip /api/
- [x] `/api/cron/generate-dilemmas` (no secret) → 401 ✅
- [x] `/api/me/entitlements` (anon) → `{isAdmin:false, noAds:false, ...}` — nessun leak ADMIN_EMAILS ✅
- [x] Hotfix IT copy live: "Condividi risultato", "Prossimo dilemma" ✅

**⚠️ DNS — www/non-www mismatch da risolvere su Cloudflare:**
- `splitvote.io` → 307 → `www.splitvote.io` (Cloudflare redirect)
- Tutti i canonical/OG/sitemap nel codice usano `https://splitvote.io` (no-www)
- **Rischio SEO**: Google vede www ma canonical dice non-www → duplicate content
- **Fix Cloudflare**: Page Rule o Redirect Rule `www.splitvote.io/* → https://splitvote.io/$1` (301)
- Non richede modifiche al codice

**Email/DNS Readiness:**
- [x] `privacy@splitvote.io` — in `/privacy`, `/it/privacy` ✅
- [x] `hello@splitvote.io` — in `/faq`, `/it/faq`, `/it/terms` ✅
- [x] `legal@splitvote.io` — in `/terms` ✅
- [x] `business@splitvote.io` — in `/faq`, `/business` ✅
- [x] `research@splitvote.io` — in `/faq` ✅
- [x] `support@splitvote.io` — aggiunto in Footer (EN: "Support" / IT: "Supporto") ✅
- [x] Nessuna email personale hardcoded nel codice sorgente ✅

**Checklist Cloudflare Email Routing (da completare manualmente):**
- [ ] Nameserver Cloudflare attivi e propagati per `splitvote.io`
- [ ] Email Routing abilitato in Cloudflare dashboard
- [ ] Alias creati e forward verso Gmail testato:
  - `hello@splitvote.io`
  - `support@splitvote.io`
  - `privacy@splitvote.io`
  - `legal@splitvote.io`
  - `business@splitvote.io`
  - `research@splitvote.io`
- [ ] SPF record aggiunto: `v=spf1 include:_spf.mx.cloudflare.net ~all`
- [ ] DKIM abilitato in Cloudflare Email Routing settings
- [ ] DMARC record: `v=DMARC1; p=quarantine; rua=mailto:hello@splitvote.io`
- [ ] Forward testato end-to-end (send test email a ogni alias)
- [ ] Se serve invio outbound: configurare Resend o Postmark (SMTP nativo Cloudflare non disponibile)
- [ ] ⚠️ Correggere redirect www → non-www (vedi sopra)

**Security/Privacy QA:**
- [x] `ADMIN_EMAILS`: solo server-side in `lib/admin-auth.ts`, mai esposto al client
- [x] `CRON_SECRET`: fail-closed — restituisce 401 se mancante o errato
- [x] `SUPABASE_SERVICE_ROLE_KEY`: solo server-side in `lib/supabase/admin.ts`
- [x] Stripe secrets: solo `process.env.*`, nessun valore hardcoded
- [x] Tracking events (`lib/gtag.ts`): solo `scenario_id`, `category`, `locale`, `choice`, `source`, `target`, `action` — nessuna PII, nessuna email
- [x] AdSlot premium/admin no-ads: verificato via `/api/me/entitlements` ✅

**PWA/Service Worker QA:**
- [x] `site.webmanifest`: JSON valido, `display: standalone`, icon purpose separati (`any` + `maskable`), shortcuts ✅
- [x] Service worker: network-first, skip `/api/`, offline fallback su `/offline` ✅
- [x] Service worker non cachea rotte dinamiche (voti, risultati, auth) ✅
- [x] App installabile da Chrome/Safari ✅

---

### Sprint Precedente — Core Loop Retention (27 Apr 2026)

- [x] `lib/gtag.ts`: helper `track(event, params)` — thin wrapper su `window.gtag`
- [x] `lib/scenarios.ts`: `getNextScenarioId(excludeId, dynamicPool?)` — preferisce dynamic approved (top-half per finalScore), fallback statico
- [x] `results/[id]/page.tsx` + `it/results/[id]/page.tsx`: next dilemma usa pool dinamico (preferenza locale IT)
- [x] `play/[id]/page.tsx` + `it/play/[id]/page.tsx`: nextId calcolato e passato a VoteClientPage
- [x] `VoteClientPage.tsx`: prop `nextId`, "Next dilemma" linka a dilemma reale (non home), spinner loading, `track('vote_submitted')`
- [x] `ResultsClientPage.tsx`:
  - Pulsante primario Web Share API `📤 Share result` — testo punchier: `"{pct}% chose {option}. What would you do?"`
  - Fallback clipboard copy se `navigator.share` non disponibile
  - Share text più forte per WhatsApp/Telegram: usa opzione vincente/scelta
  - `track('result_viewed')` su mount
  - `track('next_dilemma_clicked')` sul CTA finale
  - `track('share_clicked', { target })` per tutti i pulsanti share
  - `track('copy_link_clicked')` su copia link
  - `track('story_card_clicked')` su share/download story
  - `<a>` back link → `<Link>` (prefetch)
- [x] `globals.css`: `animate-vote-tap` keyframe solo sotto `prefers-reduced-motion: no-preference`

Backlog da questo sprint:
- [ ] AdSense frequency: 1 slot ogni 3-4 voti con frequency cap — esperimento futuro, non ora
- [ ] Geo Insight privacy-safe: country da profilo volontario, aggregato anonimo, "Italy vs World" solo con campione minimo, niente IP-to-location

---

### Sprint Precedente — PWA Foundation (27 Apr 2026)

Obiettivo: fondazione tecnica comune per web + Android Play Store (TWA) + iOS App Store (Capacitor).
La PWA non è la destinazione finale — è il layer condiviso da cui TWA e Capacitor partono.

- [x] `public/site.webmanifest`: icon purpose separati (`any` + `maskable`), scope, lang, categories, shortcuts (Trending + Profile)
- [x] `app/layout.tsx`: `Viewport` export con `themeColor: '#070718'`, `viewportFit: 'cover'`
- [x] `app/layout.tsx`: `manifest: '/site.webmanifest'` in metadata, Apple PWA meta tags (`apple-mobile-web-app-capable`, `status-bar-style`, `title`)
- [x] `public/sw.js`: service worker minimal, network-first, offline fallback su `/offline`, skip `/api/`
- [x] `app/offline/page.tsx`: pagina offline branded con reload CTA
- [x] SW registration script in `<head>` via `next/script afterInteractive`

**Strategia store (sprint dedicati, NON ora):**

Android Play Store → **TWA (Trusted Web Activity)**
- Nessun WebView custom: Chrome renderizza il sito esattamente come sul web
- Richiede: `/.well-known/assetlinks.json` con SHA-256 APK signing key
- Tool: `npx @bubblewrap/cli init --manifest https://splitvote.io/site.webmanifest`
- Rischio: basso — Google Play supporta TWA esplicitamente
- Feature native minime da aggiungere prima dello store: splash polished, shortcut icone, deep link `/play/[id]`

iOS App Store → **Capacitor (WKWebView wrapper)**
- Stessa codebase web, Capacitor aggiunge bridge nativo
- Richiede: Universal Links (`apple-app-site-association`) per Supabase OAuth callback
- Feature native minime **obbligatorie** per superare Apple review:
  - Haptic feedback sul tap di voto (`@capacitor/haptics`)
  - Native share sheet (`@capacitor/share`) al posto di `navigator.share`
  - Local notification per daily dilemma reminder (`@capacitor/local-notifications`)
  - Splash screen e icon set polished (nessun "web shell" look)
- Rischio Apple review: medio — Apple rifiuta app web-shell senza valore nativo. Mitigazione: le 4 feature sopra + submission dopo crescita organica misurabile

---

### Sprint Precedente — i18n Personality & App Navigation (27 Apr 2026)

- [x] `lib/personality.ts`: archetype + axis IT translations (`nameIt`, `signIt`, `taglineIt`, `descriptionIt`, `traitsIt`, `shareTextIt`)
- [x] `lib/personality.ts`: `getCommunityLabel(locale)` e `getAxisLabel(locale)` locale-aware
- [x] `app/api/personality/route.ts`: `?locale=en|it` — restituisce archetype/axes/communityLabel/messages localizzati
- [x] `PersonalityClient.tsx`: fetch `/api/personality?locale=it` da `/it/personality`, share URL locale-aware
- [x] `NavLinks.tsx`: `<a>` → `<Link>` (next/link) per prefetch app-like
- [x] `MobileMenu.tsx`: link nav `<a>` → `<Link>`
- [x] `app/layout.tsx`: logo link `<a>` → `<Link>`
- [x] `app/dashboard/page.tsx`: tutti i link interni `<a>` → `<Link>`
- [x] `app/profile/ProfileClient.tsx`: "← Dashboard" `<a>` → `<Link>`
- [ ] Bottom nav mobile: valutata, rimandata a sprint UX dedicato (vedi Growth Backlog)

---

### Sprint Precedente — Expert Insight & AdBlock UX (27 Apr 2026)

- [x] `AdBlockBanner`: copy onesto — "I'll whitelist manually" / "Lo aggiungo manualmente" (non implica bypass automatico)
- [x] `AdBlockBanner`: microcopy istruzione manuale EN/IT aggiunto sotto i bottoni CTA
- [x] `lib/expert-insights.ts`: helper statico `getExpertInsight(category, locale)` — 8 categorie, EN/IT
- [x] `ResultsClientPage`: box "Expert Insight" / "Parere esperto" post-risultati con tipo esperto, testo e disclaimer
- [x] Expert Insight: nessuna AI live — template statici per sicurezza, qualità e costi zero
- [ ] AI-generated insights (backlog — richiede admin review obbligatoria, vedere sezione Growth Backlog)

---

### Sprint Precedente — Onboarding & Auth UX (27 Apr 2026)

- [x] `AuthButton`: "Sign In" → "Join free →" — copy più invitante per utenti non tecnici
- [x] `MobileMenu`: CTA auth per utenti anonimi con Supabase check + locale IT/EN
- [x] `app/login/page.tsx`: headline chiaro, 3 benefit bullets, bottoni 48px+, locale-aware IT via `?locale=it`
- [x] `ResultsClientPage`: soft CTA post-voto per anonimi (EN/IT), rilevamento via Supabase client
- [x] Branding: `app/favicon.ico` (4 icone, 113KB) ha precedenza su `public/favicon.ico` — verificato
- [ ] `/it/login` wrapper locale: non implementato (semplice redirect `?locale=it` già sufficiente)

---

### Sprint Precedente — Entitlements & Rename Flow (27 Apr 2026)

- [x] `lib/entitlements.ts` — logica centralizzata admin/premium/free
- [x] `GET /api/me/entitlements` — bridge server-side per client component
- [x] `AdSlot`: no ads per admin e premium (via entitlements API)
- [x] `api/profile/update`: admin bypass rename + premium unlimited rename
- [x] `api/stripe/checkout`: blocco admin da Stripe rename
- [x] `ProfileClient`: card "Admin Access", label rename coerente, no upgrade CTA per admin
- [x] `DashboardPage`: card "Admin Access" per admin, `canSubmitPoll` via ents
- [x] `submit-poll`: usa `/api/me/entitlements` invece di `is_premium` diretto

---

### Live / Implementato
- [x] Next.js App Router + TypeScript + Tailwind + Vercel
- [x] Supabase Auth + profili pseudonimi (`Splitvoter-XXXXXX`)
- [x] Redis per voti real-time
- [x] Dedup voto: cookie, rate limit IP, Supabase per utenti loggati
- [x] Cambio voto entro finestra 24h senza doppio conteggio
- [x] Dashboard utente con storico voti, badge, XP/streak, companion
- [x] Companion system + daily missions
- [x] Story cards 9:16 per Instagram/TikTok manual share
- [x] Admin dashboard con metriche reali da `vote_daily_stats`
- [x] Google Search Console verificata + sitemap inviata
- [x] Logo/favicon PNG ufficiali integrati (rigenerati con AR corretta + og-default.png aggiunto)
- [x] AdBlock banner soft, non bloccante
- [x] i18n lite EN/IT con route SEO italiane
- [x] Cron EN/IT per generazione dilemmi da trend
- [x] Draft queue admin: cron genera draft, admin approva prima della pubblicazione
- [x] Feedback qualità dilemma: 🔥 / 👎 con Supabase + Redis
- [x] Sitemap locale-aware che esclude i draft

### Migration Supabase Applicate
- [x] `migration_v2_safe.sql`
- [x] `migration_v3_engagement.sql`
- [x] `migration_v4_security_hotfix.sql`
- [x] `migration_v5_vote_daily_stats.sql`
- [x] `migration_v6_feedback.sql`
- [x] `migration_v7_stripe_subscriptions.sql`

---

## Blocchi / Rischi

- [x] **Stripe MVP**: chiave revocata, env vars configurate, migration v7 applicata, webhook events verificati.
- [ ] **Build locale**: la shell di default usa Node 14; usare `nvm use` dentro questo repo.
- [ ] **Upgrade framework**: Next 16 + React 19 + Node 24 è uno sprint dedicato, non va mischiato alla push corrente.
- [ ] **Social trend sources**: X/Instagram/TikTok solo con API ufficiali o provider conformi. Niente scraping fragile.
- [ ] **Content Intelligence / Picoclaw**: Picoclaw è solo radar esterno; SplitVote Content Intelligence Agent è il gatekeeper interno read-only/dry-run. Prima fase: report duplicati, seed burnout/cooldown, category gaps, opportunità landing. Nessuna pubblicazione, save mode, commit, push o deploy automatico.
- [ ] **Legal/compliance reconciliation**: prima dello scaling aggiornare Privacy EN/IT, Terms EN/IT, cookie/storage inventory e consent UX seguendo `LEGAL.md`.
- [ ] **i18n expansion**: prossima lingua `es`, poi `pt-BR`, poi `fr`; cinese solo come progetto market-entry separato.

---

## Sprint Corrente — Viral Loop & SEO EN/IT

- [x] Ripristino visual neon home EN/IT
- [x] Sezioni home: Dilemma of the Day, Trending Now, Most Voted, Newly Generated, Browse All
- [x] `DilemmaCard` condivisa con social proof voti
- [x] Generazione dilemmi con scoring:
  - `viralScore`
  - `seoScore`
  - `noveltyScore`
  - `feedbackScore`
  - `finalScore`
- [x] Draft queue admin con approve/reject
- [x] Cron auth compatibile con Vercel `Authorization: Bearer CRON_SECRET`
- [x] Robots con `/admin/` disallow
- [x] SERP base EN/IT: route, metadata, canonical, sitemap

Da verificare post-deploy:
- [x] `/`
- [x] `/it`
- [x] `/trending`
- [x] `/it/trending`
- [ ] `/admin`
- [x] `/sitemap.xml`
- [x] `/robots.txt`
- [ ] `/api/admin/cron-dryrun?locale=en`
- [ ] `/api/admin/cron-dryrun?locale=it`

---

## Prossimo Sprint — Social Content Factory Phase 3 (Remotion Video)

Obiettivo: generare vertical video 1080×1920 MP4 dai dilemmi approvati per TikTok/Reels. **Non installare Remotion prima di iniziare questo sprint.**

**Fase 3 — Remotion vertical video**
- [ ] Installare Remotion solo quando questo sprint inizia
- [ ] Template Remotion 1080×1920 per TikTok/Reels
  - Dati: question, optionA, optionB, emoji, pctA/pctB, categoria
  - Animazioni: reveal risultati, brand colors, neon aesthetic
  - Output: MP4 in `content-output/YYYY-MM-DD/`
  - No auto-post — upload manuale sempre
- [ ] `npm run render-social <dilemmaId>` (script locale, non parte del build Vercel)
- [ ] Template EN/IT separati
- [ ] Integrazione con `generate:social-content` per batch pipeline

**Fase 3 — AI captions (sprint futuro)**
- [ ] OpenRouter caption generation (modello economico, zero costo AI)
- [ ] Output sempre `status: draft` — admin review obbligatoria
- [ ] Nessuna auto-pubblicazione mai

**Vincoli fissi (da rispettare in tutti gli sprint futuri):**
- Nessuna API Instagram/TikTok diretta
- Approvazione manuale obbligatoria prima di qualsiasi post
- Output locale o Supabase — niente publish automatico

---

## Prossimo Sprint — Stripe MVP

Prerequisito:
- [x] Revocare chiave Stripe compromessa
- [x] Aggiungere nuova `STRIPE_SECRET_KEY` in Vercel
- [x] Aggiungere/validare `STRIPE_WEBHOOK_SECRET`
- [x] Aggiungere `STRIPE_PRICE_ID_PREMIUM`
- [x] Applicare `migration_v7_stripe_subscriptions.sql`

Scope:
- [x] Premium monthly subscription
- [x] Customer portal
- [x] Webhook robusto per subscription lifecycle
- [x] UI upgrade/downgrade in dashboard/profile
- [x] Gate premium coerenti

---

## Sprint Upgrade Tecnico

Non fare insieme a feature/product sprint.

- [ ] Usare solo runtime di progetto (`nvm use`), senza cambiare default globale
- [ ] Valutare Node 24 LTS in `.nvmrc`
- [ ] Upgrade Next 14 → Next 16
- [ ] Upgrade React 18 → React 19
- [ ] Upgrade ESLint config a stack compatibile Next 16
- [ ] Applicare eventuali codemod App Router (`params/searchParams`)
- [ ] Build locale con Node moderno
- [ ] Deploy preview prima di produzione

---

## Growth Backlog

- [ ] Admin scoring dashboard con breakdown di viral/SEO/novelty/feedback
- [ ] Weekly digest email
- [ ] Friend challenge leaderboard
- [ ] **Content QA/refusi**: controllo periodico static + dynamic approved, soprattutto IT e contenuti AI approvati
- [ ] **Spanish localization (`es`)**: route `/es`, static scenarios, play/results/category/blog/legal/personality, hreflang, sitemap, Social Content Factory captions
- [ ] **Brazilian Portuguese localization (`pt-BR`)**: dopo ES stabile; tono Brazil-first, non portoghese generico
- [ ] **French localization (`fr`)**: dopo PT-BR, con legal/cookie copy review
- [ ] **Chinese localization (`zh-CN`)**: solo con strategia dedicata di distribuzione, legal/privacy e cultural review
- [ ] Media kit pubblico con insight aggregati
- [ ] API read-only per ricercatori
- [ ] Video share cards animate
- [ ] Referral system
- [ ] **Pixie cosmetic system (Phases 3–5)** — strategy documented in `PRODUCT_STRATEGY.md → Pixie Digital Avatar Direction`; `equipped_frame`, `equipped_badge` già in DB; Phase 3 adds `pixie_variant_equipped`; Phase 5 adds `user_pixie_skins` table + Stripe + LEGAL review
- [ ] Moral profile compatibility tra amici
- [ ] Zodiac/ascendant overlay opzionale sul moral profile
- [ ] Idempotenza webhook Stripe: storico `session_id` già processati in DB per evitare doppio increment `name_changes`
- [ ] **Expert Insight AI**: generare insight da AI (OpenRouter, modello economico) solo per draft approvati — cache nel record dilemma, admin review obbligatoria, mai live on user request, guardrail per categorie health/legal
- [ ] **Expert Insight store**: colonna `expert_insight_en` / `expert_insight_it` su tabella dilemmas per insight curati manualmente o approvati da admin
- [ ] **Bottom nav mobile**: Home / Trending / Play / Profilo — solo mobile, locale-aware, safe-area, non copre contenuto
- [ ] **AdSense frequency experiment**: mostrare 1 ad ogni 3-4 voti con frequency cap — non bloccare CTA, non interstitial, A/B test
- [ ] **Geo Insight privacy-safe**: "Italy vs World" — country da profilo volontario, aggregato anonimo, soglia minima campione, niente IP-to-location senza base legale
- [ ] **Android TWA (Play Store)**: `/.well-known/assetlinks.json` + APK firmato + Google Play listing — Bubblewrap CLI, SHA-256 signing key, deep link `/play/[id]`
- [ ] **iOS Capacitor (App Store)**: Capacitor bridge, Universal Links per Supabase OAuth, haptics + native share + local notifications + splash — prerequisito: crescita organica misurabile per ridurre rischio Apple review

---

## Metriche Target

| Metrica | Target 30gg | Target 90gg |
|---|---:|---:|
| Voti totali/giorno | 500 | 5.000 |
| Utenti registrati | 500 | 5.000 |
| Dilemmi approvati/settimana | 20 | 100 |
| Share story/giorno | 50 | 500 |
| Premium subscribers | 20 | 200 |
| Business accounts | 0 | 5 |
| Revenue/mese | €0 | €1.000 |

# QA Open-Items Audit — 2026-05-19

**Sprint:** `QA-OPEN-ITEMS-AUDIT-01`
**Mode:** Read-only. Report only. No code changes, no commits, no pushes.
**Goal:** Catalogue every open QA / launch-readiness / verification item for SplitVote, prioritized for closure.

## Scope of input

- `AGENTS.md`, `CURRENT_HANDOFF.md`, `ROADMAP.md`, `LAUNCH_AUDIT.md`, `LEGAL.md`, `PRODUCT_STRATEGY.md`
- `reports/{gsc-indexing-diagnosis,it-topic-landing-parity-audit,stale-dynamic-404-proof,dilemma-depth-audit,blog-seo-content-strategy-audit}-2026-05-{18,19}.md`
- `git log --oneline -20`, `git status --short`, `git ls-files --others --exclude-standard`

## Repo state (snapshot)

- `HEAD = origin/main = 2776c4b` — clean. Zero unpushed commits.
- Today's batch deploy (`0cf2716 db4d161 2776c4b`) verified live on `splitvote.io` post-push (per-id insights, API cache, sitemap revalidate).
- **PM WIP in working tree (DO NOT TOUCH)**: `PRODUCT_STRATEGY.md`, `ResultsClientPage.tsx`, `lib/content-generation-prompts.ts`, `lib/content-generation-validate.ts`, `lib/content-quality-gates.ts`, 80+ pixie PNGs in `public/pixie/*`, `scripts/generate-pixie-assets.mjs`.
- 39 untracked artifacts (worktrees, `.idea/`, reports, scripts WIP, `AGENTS.md`). All PM-owned.

---

## Top 5 open items (closure priority)

1. **Stripe live checkout UI verification on `splitvote.io/profile`** — P0, HUMAN_ONLY, blocked on PM (real card).
2. **Stripe end-to-end live payment** — P0, HUMAN_ONLY, blocked on PM (real card).
3. **GSC CSV export cross-reference** (`Pages › Not indexed (Not found 404)`) — P1, blocked on PM (CSV export, 5 min).
4. **Vercel Fluid Active CPU usage recheck after today's batch deploy** — P1, PM dashboard check.
5. **Blog FAQ structured-data extraction (32 IT + 28 EN)** — P2, SEMI_AUTONOMOUS, unblocked, content-only sprint ready to plan.

Recommended next executable sprint (lowest-risk unblocked closure): **`BLOG-INVALID-DILEMMA-ID-FIX-01`** — 2-line edit to swap an invalid `why-not-intervene` reference on `bystander-effect-and-moral-responsibility` EN + IT to a valid static ID (`bystander-bench` or similar). Trivial, SAFE_AUTONOMOUS-adjacent, closes a real defect surfaced today.

---

## Full open-items catalogue by area

### 1. Stripe / Premium QA

| # | Item | Status | Pri | Owner | HUMAN_ONLY | Next action | Refs |
|---|---|---|---|---|---|---|---|
| 1.1 | Manual checkout UI verification on `splitvote.io/profile` — confirm Stripe Checkout opens and shows the recurring monthly plan correctly | open | P0 | PM | ✅ | PM opens `/profile` with real non-premium account → click "Upgrade to Premium" → screenshot Checkout page; abort the payment if just verifying UI | LAUNCH_AUDIT.md §B Stripe — checkbox line 361 |
| 1.2 | End-to-end live payment with real/prepaid card (checkout → webhook → `is_premium=true` → entitlements) | open | P0 | PM | ✅ | PM completes one full live cycle on real card; verify Supabase `profiles` row + Vercel logs + `/api/me/entitlements` | LAUNCH_AUDIT.md §B Stripe — checkbox line 362; LEGAL.md §Current Status payments paragraph |
| 1.3 | Name-change live checkout (one-time €0.99) | open | P2 | PM | ✅ | Same flow as 1.2 but on name-change product. Lower revenue impact. | LAUNCH_AUDIT.md §C Stripe; ROADMAP.md 1 May "Needs QA" |
| 1.4 | All other Stripe surfaces (subscription lifecycle, webhook idempotency, portal, cancellation) | **closed** | — | — | — | Verified on Preview 28 Apr 2026 — `sk_test_...` mode. Env var fix on Production landed 29 Apr 2026. | LAUNCH_AUDIT.md §B checkboxes lines 353–360 |

### 2. SEO / GSC

| # | Item | Status | Pri | Owner | HUMAN_ONLY | Next action | Refs |
|---|---|---|---|---|---|---|---|
| 2.1 | GSC CSV cross-reference of `Pages › Not indexed (Not found 404)` | **blocked** | P1 | PM | — | PM exports the CSV from Search Console → `reports/gsc-pages-export-YYYY-MM-DD.csv`. Then Claude cross-references against static+dynamic inventory (1–2 h). | CURRENT_HANDOFF.md §Next recommended work; stale-dynamic-404-proof report §Recommendation |
| 2.2 | Stale dynamic 404 (internal) | **closed (no-op)** | — | — | — | 863/863 = 200 on 22 source-page crawl 18 May 2026. Mitigation sprint cancelled. | reports/stale-dynamic-404-proof-2026-05-18.md |
| 2.3 | IT topic landing parity | **closed (no-op)** | — | — | — | 11+11 reciprocal, never 19/12 (counting artifact). | reports/it-topic-landing-parity-audit-2026-05-19.md |
| 2.4 | Sitemap / hreflang / category hubs | **closed** | — | — | — | 296 URLs, 296/296 hreflang, EN+IT category sitemap parity, lifestyle hub live, title double-suffix fixed (`fb7bd7c`). Sitemap now 1h revalidate (`2776c4b`). | gsc-indexing-diagnosis Errata; sitemap.ts post-2776c4b |
| 2.5 | Blog — 2 posts reference invalid dilemma ID `why-not-intervene` (`bystander-effect-and-moral-responsibility` EN + IT) | open | P1 | Claude | ❌ | Swap to a valid ID from `lib/scenarios.ts`. Likely a 15-min sprint. | blog-seo-content-strategy-audit §1 / §2 |
| 2.6 | Blog — FAQ structured-data extraction: 28/32 EN + 32/32 IT posts have no `faq:` field → no FAQPage JSON-LD | open | P2 | Claude | ❌ | Plan a SEMI_AUTONOMOUS content sprint: extract Q&A from existing inline content into `faq?: { q, a }[]` field on `lib/blog.ts`. Report only at first, then GO for the edit. | blog-seo-content-strategy-audit §1 / "load-bearing finding" |
| 2.7 | Blog — 10 EN + 10 IT articles in `lib/blog.ts` but absent from `lib/blog-clusters.ts` (ethical traditions trio, bioethics, affective) | open | P2 | Claude | ❌ | Either add 1–2 new cluster definitions or assign articles to existing clusters. Pure config sprint. | blog-seo-content-strategy-audit §1 |
| 2.8 | Blog — IT `ia-etica-40-milioni-scelte` 105-char title + 221-char desc; `causare-vs-permettere-danno` 88/230 | open | P3 | Claude | ❌ | Trim seoTitle ≤ 70, seoDescription ≤ 165. Small copy sprint. | blog-seo-content-strategy-audit §2 |
| 2.9 | Blog — 3 posts missing `seoDescription` entirely (`bodyoids-…` EN+IT, `consequenzialismo-…` IT) | open | P3 | Claude | ❌ | Add seoDescription strings. Verify source first — parser may have missed inline quotes. | blog-seo-content-strategy-audit §1 |
| 2.10 | Topic landing content gap — RETRACTED (was the false 19/12) | **closed** | — | — | — | See Retraction 3 in gsc-indexing-diagnosis. | — |
| 2.11 | Canonical-to-homepage cleanup on `/login` + `/store` | open | P3 | Claude | ❌ | Set self-canonical instead of homepage canonical. Minor SEO hygiene. | gsc-indexing-diagnosis §4 in Top 5 |
| 2.12 | Hreflang false positive | **closed (retracted)** | — | — | — | 296/296 emit `hrefLang` correctly. | gsc-indexing-diagnosis Errata Retraction 1 |
| 2.13 | Blog index dead-link false positive | **closed (retracted)** | — | — | — | 124/124 internal blog links = 200. | gsc-indexing-diagnosis Errata Retraction 2 |

### 3. Dilemma / product QA

| # | Item | Status | Pri | Owner | HUMAN_ONLY | Next action | Refs |
|---|---|---|---|---|---|---|---|
| 3.1 | 5 rewritten static dilemmas (rich-or-fair, robot-judge, censor-speech, deepfake-expose, prison-abolition) | **closed (live)** | — | — | — | Deployed `5bd0036`; smoke verified. Redis aggregate keys for 4 were already absent (DEL no-op); robot-judge also absent — all 5 start fresh. | CURRENT_HANDOFF.md §0 |
| 3.2 | Per-id post-vote insight overrides (5 pilot IDs) | **closed (live)** | — | — | — | `0cf2716` shipped; EN+IT smoke confirms text rendering on `/results/rich-or-fair` + `/it/results/rich-or-fair`. | lib/static-insights.ts |
| 3.3 | Supabase `dilemma_votes` per-user carry-over on the 5 rewritten IDs | **accepted** | P3 | PM | ✅ | No action — small user fraction; users can re-vote within `can_change_until`. | CURRENT_HANDOFF.md §0 / "Post-deploy Redis state — resolved" |
| 3.4 | Depth audit covers 5 of 41 static dilemmas — remaining 36 not yet audited for depth | open | P2 | Claude | ❌ | Either: (a) batch-audit the remaining 36 with the same rubric, or (b) extend the per-id static-insights map opportunistically when a high-traffic dilemma surfaces. Recommend (b). | reports/dilemma-depth-audit-2026-05-19.md scope |
| 3.5 | Challenge-friend + share-result live retest post-migration v9 | open | P3 | PM | partial | Manual flow walk-through with two accounts. | LAUNCH_AUDIT.md §B "Challenge Friend / Share Result Live Retest" |
| 3.6 | Category editorial content (morality, technology, society lack hub editorial) | open | P2 | Claude | ❌ | Lifestyle was shipped this week. Replicate the same shape on the 3 highest-traffic categories. | LAUNCH_AUDIT.md §B "Category Pages SEO" |

### 4. Performance / Vercel

| # | Item | Status | Pri | Owner | HUMAN_ONLY | Next action | Refs |
|---|---|---|---|---|---|---|---|
| 4.1 | Fluid Active CPU 75% warning recheck (after batch deploy now live: sitemap ISR + API cache) | open | P1 | PM | partial | PM checks Vercel dashboard usage cycle in 24–48 h to confirm slope decrease. | VERCEL-USAGE-AUDIT-01 in session memory; deployed today `2776c4b db4d161` |
| 4.2 | Sitemap caching | **closed (live)** | — | — | — | `revalidate=3600` shipped. `x-vercel-cache: PRERENDER` confirmed. | app/sitemap.ts post-2776c4b |
| 4.3 | API results aggregate caching | **closed (live)** | — | — | — | `s-maxage=15, swr=45` shipped. `x-vercel-cache: HIT` confirmed (header stripped at edge — expected). | app/api/results/[id]/route.ts post-db4d161 |
| 4.4 | Page routes `/play/[id]` + `/results/[id]` still force-dynamic — likely the largest residual CPU draw | open | P2 | Claude | ❌ | Audit whether per-user state truly forces dynamic on results (results already has `revalidate=60` per AGENTS.md anti-regression rules). Play page must remain force-dynamic. | AGENTS.md §Anti-Regression Rules; LAUNCH_AUDIT.md §Performance |
| 4.5 | Redis p99 latency check via Upstash metrics | open | P3 | PM | ✅ | Open Upstash dashboard → Redis stats → screenshot percentile chart. | LAUNCH_AUDIT.md §Performance |
| 4.6 | Image optimization (og-images cached vs regenerated) | open | P3 | Claude | ❌ | Inspect `next/image` config + check OG image route caching headers. | LAUNCH_AUDIT.md §Performance |
| 4.7 | Bundle analysis — JS first-load target < 200 KB | open | P3 | Claude | ❌ | `npm run build` → `.next/analyze`. Read-only. | LAUNCH_AUDIT.md §Performance |
| 4.8 | k6 production stress test (50 VU) | open | P2 | PM | ✅ | Run Preview 50 VU baseline first; then a controlled-window prod run. Spike read-only 25 VU already passed. | LAUNCH_AUDIT.md §Load Test / Spike Tests |

### 5. Legal / compliance

| # | Item | Status | Pri | Owner | HUMAN_ONLY | Next action | Refs |
|---|---|---|---|---|---|---|---|
| 5.1 | Formal DPAs signed/accepted with Upstash, OpenRouter, Resend | open | P1 | PM | ✅ | PM/legal task. Vercel, Supabase, Google, Stripe already have self-service DPAs. | LEGAL.md §Privacy Policy "Still open before scaling" |
| 5.2 | GDPR/CCPA legal review pre-50k MAU | open | P2 | PM | ✅ | Engage EU counsel before scaling. | LEGAL.md §Privacy Policy; LAUNCH_AUDIT.md §C Legal |
| 5.3 | Google-certified TCF CMP before scaled personalized ads in EEA/UK/CH | open | P2 | PM | ✅ | Evaluate Cookiebot / Axeptio before paid acquisition or broad EEA campaign. | LEGAL.md §Cookie Consent "Still open"; LAUNCH_AUDIT.md §D |
| 5.4 | AdSense account approval status | open | P2 | PM | ✅ | PM checks Google AdSense dashboard. | LAUNCH_AUDIT.md §C AdSense |
| 5.5 | Cookie banner / Consent Mode v2 / Privacy / Terms EN+IT | **closed** | — | — | — | Resolved 28 Apr 2026. | LEGAL.md §Cookie Consent / §Privacy Policy / §Terms |
| 5.6 | Account deletion in-app + reconciliation | **closed** | — | — | — | Shipped 1 May 2026; Privacy/FAQ reconciled 4 May 2026. | LEGAL.md §Recent sprints |

### 6. Pixie / store / cosmetics

| # | Item | Status | Pri | Owner | HUMAN_ONLY | Next action | Refs |
|---|---|---|---|---|---|---|---|
| 6.1 | Equip-cosmetics-not-applying bug from 16 May (PM-reported) | open / likely resolved | P1 | PM | partial | PM does a single click-test on /profile cosmetics; commits `24c4cda`, `1bd535d`, `7ca3e6c` should have fixed it. Confirm with a fresh tab + hard reload. | CURRENT_HANDOFF.md §0a 16 May section / §0a 18 May "Pixie / store state" |
| 6.2 | Visual QA / polish across /profile, /store, /dashboard, /u/[id], post-vote share | open / conditional | P3 | PM | — | Only if PM finds a defect. No queued sprint. | CURRENT_HANDOFF.md §0 "Next recommended sprint" item D |
| 6.3 | 80+ pixie PNG modifications in working tree | **PM WIP** | — | PM | — | Do not stage or commit by accident. | git status |

### 7. Admin / AI content

| # | Item | Status | Pri | Owner | HUMAN_ONLY | Next action | Refs |
|---|---|---|---|---|---|---|---|
| 7.1 | AI generation re-QA — 4 scenarios — requires `OPENROUTER_MODEL_REVIEW=openai/gpt-4o-mini` in Vercel Production + manual redeploy. Gates save mode and bulk IT generation. | open | P1 | PM | ✅ | PM sets env var + redeploys → Claude runs the 4 dry-run scenarios. | ROADMAP.md 1 May "Needs QA" — last unchecked line |
| 7.2 | AUTO_PUBLISH_DILEMMAS=true live test (7-day monitoring) | open | P3 | PM | ✅ | Hold until 7.1 closed. | LAUNCH_AUDIT.md §B "Autopublish Quality Gates" |
| 7.3 | Blog Dynamic Storage (BlogDraft schema, generate-blog-draft API, admin UI, weekly cron) | open | P3 | Claude+PM | partial | Larger feature sprint. Not blocking soft launch. | LAUNCH_AUDIT.md §B "Blog Dynamic Storage" |
| 7.4 | Social Content Factory Phase 2 (Remotion 1080×1920 video templates) | open | P3 | Claude | ❌ | Separate dedicated sprint when prioritized. | LAUNCH_AUDIT.md §B "Social Content Factory Phase 2" |

### 8. Build / test / deploy

| # | Item | Status | Pri | Owner | HUMAN_ONLY | Next action | Refs |
|---|---|---|---|---|---|---|---|
| 8.1 | Latest `npm run typecheck` / `npm run build` | **closed** | — | — | — | Last green pre-commit on `2776c4b` (sitemap revalidate). | session memory; CURRENT_HANDOFF.md §0 "Verification already passed" |
| 8.2 | Unpushed commits | **none** | — | — | — | `git log origin/main..HEAD` = empty. | git rev-parse confirms HEAD = origin/main |
| 8.3 | PM WIP isolation (do not commit on PM's behalf) | **ongoing rule** | — | Claude | — | Continue snapshot → checkout HEAD → re-apply → restore-snapshot pattern when sprint edits intersect a PM WIP file. | session memory |

### 9. Other tracked items (lower priority)

| # | Item | Status | Pri | Owner | HUMAN_ONLY | Next action | Refs |
|---|---|---|---|---|---|---|---|
| 9.1 | WCAG 2.1 AA pass (focus states, color contrast, screen reader, keyboard nav) | open | P2 | Claude | ❌ | Dedicated a11y sprint; pair with frontend-ui-reviewer agent. | LAUNCH_AUDIT.md §C Accessibility |
| 9.2 | Disaster recovery runbook (Redis loss, Supabase outage, Vercel deploy failure) | open | P2 | PM | ✅ | PM-led documentation sprint. | LAUNCH_AUDIT.md §C DR; §Top 5 Blockers row 5 |
| 9.3 | Resend DNS DMARC record | open | P3 | PM | ✅ | Add DNS record per LAUNCH_AUDIT instructions. | LAUNCH_AUDIT.md §C DNS |
| 9.4 | Cloudflare email routing test for all `@splitvote.io` aliases | open | P3 | PM | ✅ | Send 1 test email per alias; verify forward. | LAUNCH_AUDIT.md §C DNS |
| 9.5 | GA4 funnel: vote → results → share → signup verification | open | P3 | PM | partial | PM reviews GA4 dashboard. Read-only. | LAUNCH_AUDIT.md §C Analytics |
| 9.6 | Business dashboard v1 (MRR, premium churn, top converting dilemmas) | open | P3 | Claude+PM | partial | New surface; out of soft-launch scope. | LAUNCH_AUDIT.md §C Analytics |
| 9.7 | Field feedback: core loop clarity sprint | open | P2 | Claude+PM | ❌ | Per PRODUCT_STRATEGY.md §Core Loop Clarity Sprint scope. Larger UX sprint. | PRODUCT_STRATEGY.md §Field Feedback Intake |
| 9.8 | Field feedback: share-question-before-vote | open | P3 | Claude | ❌ | Smaller UX sprint per PRODUCT_STRATEGY scope. | PRODUCT_STRATEGY.md §Share Question Before Vote |
| 9.9 | Field feedback: aggregate-only leaderboards (no personal ranking) | open | P3 | Claude | ❌ | Sequenced after 9.7 + 9.8. | PRODUCT_STRATEGY.md §Leaderboards Direction |

---

## Recommended next sprint to close one item

`BLOG-INVALID-DILEMMA-ID-FIX-01` — close item **2.5**.

- **Scope:** edit `lib/blog.ts` (and IT mirror) for the two posts that list `relatedDilemmaIds: ['why-not-intervene']` (the EN slug `bystander-effect-and-moral-responsibility` and its IT twin). Swap the invalid ID for the closest valid ID from the 41-ID static inventory (suggested: a justice-category dilemma that frames inaction-vs-action).
- **Why this first:** smallest blast radius (2-line content edit), zero schema change, immediately verifiable, fixes a real defect from today's audit, and unblocks the next blog-cluster work.
- **Risk:** very low. Touches blog metadata only; no runtime code path; no Redis; no Supabase; no auth; no payments.
- **Effort:** ~15 min including verification.
- **Mode:** SEMI_AUTONOMOUS (content suggestion → PM GO → edit). Not HUMAN_ONLY.
- **Verification:** `npm run typecheck` + visit both blog posts in local dev to confirm the `RelatedDilemmas` block renders a valid card.

---

## Files / docs touched by this audit

- **New:** `reports/qa-open-items-audit-2026-05-19.md` (this file).
- **No source files modified.** No PM WIP touched.
- No commits, no pushes, no Redis or Supabase operations.

## Residual risk

- The catalogue depends on docs being current. `CURRENT_HANDOFF.md` and `LAUNCH_AUDIT.md` are fresh (≤24 h). `LEGAL.md` last reviewed 4 May 2026 — items 5.1–5.4 may have shifted at PM level. Confirm with PM before treating 5.x as definitive.
- The "blocked on PM" items (1.1, 1.2, 2.1, 4.1, 5.x, 7.1) are not within Claude's authority to close. They appear in the queue so the PM can sweep them in one sitting.

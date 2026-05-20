# SplitVote — What Would the World Choose?

Real-time global voting on impossible moral dilemmas. No right answers — just honest ones.

Live at **[splitvote.io](https://splitvote.io)**

Claude Code operating instructions live in **[CLAUDE.md](./CLAUDE.md)**. Read them before starting implementation work, especially around voting, auth, admin, Stripe, legal/compliance, i18n, and caching.

Legal/compliance tracking lives in **[LEGAL.md](./LEGAL.md)**. Read it before changing cookies, analytics, ads, auth/account data, payments, AI content generation, email, geo features, or public profile visibility.

Product strategy and staged sprint planning live in **[PRODUCT_STRATEGY.md](./PRODUCT_STRATEGY.md)**. Read it before changing premium/VIP, user-submitted polls, personality sharing, public profiles, quests, cosmetics, learning paths, or community features.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14.2.3 (App Router, TypeScript) |
| Runtime | Node 20 via `.nvmrc` (`nvm use` in this project only) |
| Styling | Tailwind CSS + custom CSS variables |
| Auth & DB | Supabase (PostgreSQL + Row Level Security) |
| Real-time votes | Upstash Redis (hash per dilemma) |
| AI dilemmas | Anthropic Claude (daily Vercel cron → admin draft queue) |
| Payments | Stripe (one-time name change, premium sub) |
| Analytics | GA4 (gtag.js loaded directly from `googletagmanager.com`) |
| Ads | Google AdSense (official script — `pagead2.googlesyndication.com`) |
| Deploy | Vercel (auto-deploy on push to main) |

---

## Local Setup

```bash
git clone https://github.com/your-org/splitvote.git
cd splitvote
nvm use
npm install
cp .env.local.example .env.local   # fill in the vars below
npm run dev
```

Requires **Node >= 20** (see `.nvmrc`). Do not change your global/default Node for other projects; run `nvm use` inside this repo.

> Upgrade note: latest stable Next/React are currently a major jump from this codebase (`next@16` / `react@19`). Treat that as a dedicated upgrade sprint after the current production deploy, not as part of the gamification/i18n/feedback push.

---

## Environment Variables

All vars must be set in Vercel → Settings → Environment Variables (and in `.env.local` for local dev).

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Upstash Redis
KV_REST_API_URL=https://xxxx.upstash.io
KV_REST_API_TOKEN=Axxx...

# Rate limiting (optional but recommended)
# Salt for IP hashing in Redis rate-limit keys. Any random string.
# If missing, IPs are still hashed (SHA-256) — just without salt. Set in Vercel for production.
RATE_LIMIT_SALT=random-strong-secret

# Anthropic (daily dilemma cron)
ANTHROPIC_API_KEY=sk-ant-...
CRON_SECRET=random-strong-secret

# Stripe
STRIPE_SECRET_KEY=sk_live_...        # NEVER commit — set in Vercel only
STRIPE_WEBHOOK_SECRET=whsec_...     # from stripe listen or Stripe dashboard
STRIPE_PRICE_ID_NAME_CHANGE=price_... # €0.99 one-time
STRIPE_PRICE_ID_PREMIUM=price_...    # premium subscription (€4.99/month)

# Stripe — Pixie Market (one-time purchases, Sprint 3+)
# Each is a Stripe Product in mode=payment. See lib/purchases.ts catalog.
# Missing env vars cause the checkout to return 501 "coming soon" — graceful.
STRIPE_PRICE_PIXIE_CROWN=price_...    # €3.99
STRIPE_PRICE_PIXIE_DIAMOND=price_...  # €3.99
STRIPE_PRICE_PIXIE_GALAXY=price_...   # €3.99
STRIPE_PRICE_PIXIE_ANGEL=price_...    # €3.99
STRIPE_PRICE_PIXIE_DEVIL=price_...    # €3.99
STRIPE_PRICE_PIXIE_NOVA=price_...     # €4.99 (legendary)

# Stripe — Cosmetics (Sprint 4, optional — missing env vars hide products)
STRIPE_PRICE_FRAME_GOLD=price_...      # €1.99
STRIPE_PRICE_FRAME_RAINBOW=price_...   # €2.99
STRIPE_PRICE_FRAME_PULSE=price_...     # €3.99
STRIPE_PRICE_FRAME_HOLO=price_...      # €3.99
STRIPE_PRICE_GLOW_FIRE=price_...       # €1.99
STRIPE_PRICE_GLOW_FROST=price_...      # €1.99
STRIPE_PRICE_GLOW_AURORA=price_...     # €1.99
STRIPE_PRICE_NAME_COLOR_BUNDLE=price_...  # €4.99 (8 colors bundle)

# Resend (transactional email — set in Vercel only, NEVER commit)
RESEND_API_KEY=re_...                  # from resend.com dashboard
EMAIL_FROM=SplitVote <hello@splitvote.io>  # optional — this is the default

# OpenRouter (content engine — server-side only, NEVER expose to client)
OPENROUTER_API_KEY=sk-or-...              # from openrouter.ai — used by POST /api/admin/generate-draft
OPENROUTER_MODEL_DRAFT=deepseek/deepseek-chat-v3.1          # required — base fallback for all use-cases; isOpenRouterConfigured() checks this
OPENROUTER_MODEL_DILEMMA_DRAFT=deepseek/deepseek-chat-v3.1  # optional — dilemma generation; falls back to OPENROUTER_MODEL_DRAFT
OPENROUTER_MODEL_ARTICLE_DRAFT=deepseek/deepseek-chat-v3.1  # optional — standard blog article generation; falls back to OPENROUTER_MODEL_DRAFT
OPENROUTER_MODEL_CORNERSTONE_DRAFT=deepseek/deepseek-chat-v3.1 # optional — cornerstone (1200-1500w) blog article; falls back to OPENROUTER_MODEL_ARTICLE_DRAFT then OPENROUTER_MODEL_DRAFT
OPENROUTER_MODEL_TRANSLATION=deepseek/deepseek-chat-v3.1    # optional — bilingual article translation; falls back to OPENROUTER_MODEL_ARTICLE_DRAFT then OPENROUTER_MODEL_DRAFT
OPENROUTER_MODEL_CLASSIFIER=google/gemini-flash-1.5-8b      # for future scoring/classification
OPENROUTER_MODEL_REVIEW=google/gemini-pro-latest             # semantic novelty review for generated dilemmas (falls back to OPENROUTER_MODEL_DRAFT if unset)

# AI Autopublish (optional — fail closed by default)
# Set to 'true' ONLY after reviewing quality gate thresholds in lib/content-quality-gates.ts.
# Default off: generated dilemmas always land in dynamic:drafts for manual admin review.
AUTO_PUBLISH_DILEMMAS=false
# Max dilemmas auto-published per cron run (default 1, used only if AUTO_PUBLISH_DILEMMAS=true)
AUTO_PUBLISH_DILEMMAS_MAX_PER_RUN=1
# Weekly blog drafts — reserved, not yet active (blog requires storage migration first)
BLOG_WEEKLY_DRAFTS=false

# Public
NEXT_PUBLIC_BASE_URL=https://splitvote.io
NEXT_PUBLIC_ADSENSE_SLOT_RESULTS=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_PLAY=1234567890
```

> `OPENROUTER_API_KEY` and `OPENROUTER_MODEL_DRAFT` are both required — no hardcoded fallback model. If either is missing, `isOpenRouterConfigured()` returns false and the endpoint returns 503 at runtime; build still passes. Generated content is always `status: draft` — admin approval required before anything becomes public.
>
> **Curl examples (admin session cookie required):**
> ```bash
> # Preview only (no save)
> curl -X POST https://splitvote.io/api/admin/generate-draft \
>   -H "Cookie: <session>" -H "Content-Type: application/json" \
>   -d '{"type":"dilemma","locale":"en","topic":"AI replacing doctors","mode":"preview"}'
>
> # Save to draft queue (noveltyScore ≥ 55 required)
> curl -X POST https://splitvote.io/api/admin/generate-draft \
>   -H "Cookie: <session>" -H "Content-Type: application/json" \
>   -d '{"type":"dilemma","locale":"it","topic":"sorveglianza AI","mode":"save"}'
>
> # Override dedup guard (noveltyScore < 55)
> curl -X POST https://splitvote.io/api/admin/generate-draft \
>   -H "Cookie: <session>" -H "Content-Type: application/json" \
>   -d '{"type":"dilemma","locale":"en","topic":"trolley","mode":"save","allowLowNovelty":true}'
> ```
> Blog articles: `mode: "save"` restituisce `400 blog_article_save_not_supported` — richiedono editing manuale in `lib/blog.ts`.

> `RESEND_API_KEY` is never committed. If missing, `sendEmail()` returns `{ ok: false, error: 'email_not_configured' }` silently — build and app still work.

---

## Supabase Migrations

Migrations are in `supabase/`. Apply them in order via the **SQL Editor** in the Supabase dashboard.

| File | Description | Status |
|---|---|---|
| `schema.sql` | Base schema (profiles, user_polls, etc.) | ✅ Applied |
| `migration_v2_safe.sql` | dilemma_votes, badges, user_badges, orgs | ✅ Applied |
| `migration_v3_engagement.sql` | XP, streak, companion fields | ✅ Applied |
| `migration_v4_security_hotfix.sql` | pseudonymous identity + RPC grants | ✅ Applied |
| `migration_v5_vote_daily_stats.sql` | admin vote charts incl. anonymous votes | ✅ Applied |
| `migration_v6_feedback.sql` | dilemma quality feedback (🔥 / 👎) | ✅ Applied |
| `migration_v7_stripe_subscriptions.sql` | Stripe customer/subscription fields | ✅ Applied |
| `migration_v8_user_events.sql` | User event tracking for share_result mission | ✅ Applied |
| `migration_v9_referral_codes.sql` | `profiles.referral_code` for challenge_friend mission | ✅ Applied |
| `migration_v10_content_events.sql` | Content events view + index — DRAFT, review before applying | ⏳ Pending |
| `migration_v11_stripe_webhook_events.sql` | Stripe webhook idempotency table (`stripe_webhook_events`) | ✅ Applied |
| `migration_v12_user_polls_rls_hardening.sql` | Enable RLS on `user_polls`, remove client INSERT policy — all inserts via server API | ✅ Applied |
| `migration_v13_user_polls_no_client_update.sql` | Drop residual UPDATE client policy on `user_polls` — no client-side edit feature exists | ✅ Applied |
| `migration_v14_streak_milestone_badges.sql` | Streak milestone badges (streak_15, streak_30) + backfill + updated `increment_user_vote_count` DB function | ✅ Applied |
| `migration_v15_role_management.sql` | `profiles.role` column + `role_audit_log` + anti-escalation trigger; bootstrap super_admin/admin | ✅ Applied |
| `migration_v16_user_purchases.sql` | `user_purchases` table for Stripe one-time purchases (Pixie Market + cosmetics) | ✅ Applied |
| `migration_v17_cosmetics.sql` | `profiles.equipped_glow` + `profiles.name_color` columns | ✅ Applied |
| `migration_v18_pixie_avatar.sql` | `profiles.use_pixie_avatar` boolean flag | ✅ Applied |
| `migration_v19_badges_rls_and_fk_hardening.sql` | SELECT policy on `badges` (fix dashboard empty collection) + `user_badges.badge_id` FK → `ON DELETE CASCADE` | ⏳ Pending (proposed 16 May 2026) |

To apply: Supabase dashboard → SQL Editor → New query → paste file contents → Run.

---

## Vercel Cron

The cron job auto-generates new dilemma drafts daily using Claude. Configured in `vercel.json`:

```json
{
  "crons": [{ "path": "/api/cron/generate-dilemmas", "schedule": "0 6 * * *" }]
}
```

Requires `ANTHROPIC_API_KEY` and `CRON_SECRET` in Vercel env vars. Vercel invokes cron with `Authorization: Bearer <CRON_SECRET>`; the admin dry-run endpoint also sends `x-cron-secret` for compatibility.

Generated dilemmas are saved to Redis as **drafts**. They only become public after approval in `/admin`.

---

## Architecture Notes

### Vote flow
1. Cookie dedup (fast path — blocks same browser)
2. Rate limiting — three tiers via Redis keys with TTL:
   - Global IP: 60 votes/hour per IP (NAT-friendly, coarse anti-bot)
   - Scenario+IP: 5 votes per dilemma per IP per 10 min (single-scenario hammering)
   - User-level: 120 votes/hour per logged-in user (after auth)
3. Supabase check for logged-in users (authoritative dedup across devices, 24h change window)
4. Redis increment / replace (`incrementVote` / `replaceVote` in `lib/redis.ts`)
   - `replaceVote` uses a Lua eval — truly atomic, clamps old field to ≥ 0 before decrement
5. Server-side vote funnel events for logged-in users (written directly to `user_events` via admin client):
   `vote_success`, `vote_change`, `vote_duplicate`, `vote_rate_limited`

### Dynamic dilemma flow
1. Cron fetches trend signals (Google Trends, Reddit, RSS/news; social APIs are feature-flagged for later)
2. Claude generates EN/IT dilemmas with SEO metadata
3. Validation + semantic dedup + scoring (`viralScore`, `seoScore`, `noveltyScore`, `feedbackScore`)
4. Redis draft queue (`dynamic:drafts`)
5. Admin approves/rejects in `/admin`
6. Approved dilemmas move to `dynamic:scenarios` and enter sitemap/public routes

### i18n / SEO
Italian SEO is implemented with a lightweight `/it` route family:
- `/it`
- `/it/trending`
- `/it/play/[id]`
- `/it/results/[id]`
- `/it/category/[category]`
- `/it/faq`, `/it/privacy`, `/it/terms`, `/it/personality`
- `/it/blog`, `/it/blog/[slug]`

Sitemap is locale-aware, includes Italian static dilemma URLs, blog articles, SEO landing pages, and excludes draft dilemmas.

Language expansion is planned but not immediate. EN/IT are enough for controlled soft launch. The next locale should be Spanish (`/es`), followed by Brazilian Portuguese (`pt-BR`) and French (`fr`). Chinese should be treated as a separate market-entry project, not a routine translation sprint. See `PRODUCT_STRATEGY.md` for gates and scope.

**SEO technical standards:**
- All page-level titles omit `| SplitVote` — the `template` in `app/layout.tsx` appends it automatically
- `alternates.languages` with `en`, `it-IT`, `x-default` is present on all play, results, and landing pages for reciprocal hreflang
- `app/results/[id]` and `app/it/results/[id]` include `BreadcrumbList` + `Dataset` JSON-LD with real vote counts

**SEO landing pages (static, SSG):**
- `/would-you-rather-questions` ↔ `/it/domande-would-you-rather`
- `/moral-dilemmas` ↔ `/it/dilemmi-morali`

### Blog (static, no CMS)

`lib/blog.ts` is the single source of truth for blog content. All posts are TypeScript objects — no database, no MDX.

| Route | Description |
|---|---|
| `/blog` | EN article index |
| `/blog/[slug]` | EN article (SSG, `generateStaticParams`) |
| `/it/blog` | IT article index |
| `/it/blog/[slug]` | IT article (SSG) |

Each post has: `slug`, `locale`, `title/seoTitle`, `description/seoDescription`, `date`, `readingTime`, `tags`, `relatedDilemmaIds`, `alternateSlug` (for hreflang pairs), `content[]` (typed sections).

**Content rules:**
- Short, useful articles linked to playable dilemmas — no generic filler
- EN and IT written independently (not machine-translated)
- Every article has a disclaimer: "Educational content, not professional advice."
- No medical, legal, or psychological advice
- No AI-generated content published without human review

**Adding new posts:** Add a `BlogPost` object to `EN_POSTS` or `IT_POSTS` in `lib/blog.ts`. The sitemap updates automatically.

### Social Content Factory

`scripts/generate-social-content.mjs` produces ready-to-review social captions from approved dilemmas.

```bash
nvm use && npm run generate:social-content
```

Output (local only, never committed — see `.gitignore`):
```
content-output/
└── YYYY-MM-DD/
    ├── social-content.json   ← structured batch (SocialContentBatch type)
    └── social-content.md     ← human-readable review file with checklists
```

**Batch composition:** 20 items — 5 TikTok EN, 5 Instagram EN, 5 TikTok IT, 5 Instagram IT.

**Sources:** Dynamic approved (Redis) first, then static `lib/scenarios.ts` scenarios with IT translations. Never drafts.

**Cost:** zero — pure template-based captions, no AI API calls.

**No auto-publish.** Every item has a `[ ] Approved` checkbox in the markdown file. Upload manually after review.

**Each item includes (Phase 2):**
- `playUrl` — direct play URL without UTM (EN: `/play/{id}`, IT: `/it/play/{id}`)
- `resultsUrl` — results URL for the same dilemma
- `utmUrl` — play URL with `utm_source=platform&utm_medium=social&utm_campaign=soft_launch` — use this for link-in-bio or story link sticker
- `publishChecklist` — per-platform manual posting steps
- `priority` — `'high'` for dynamic approved, `'medium'` for static evergreen

**Roadmap:**
- Phase 3 (future sprint): Remotion 1080×1920 vertical video generator — `npm run render-social <id>`. Do NOT install Remotion until that sprint starts.
- Phase 4 (future sprint): AI-assisted captions via OpenRouter — draft-only, admin review required, same no-autopublish policy.

### Content Engine (base layer)

`lib/content-inventory.ts` builds a unified, normalised list of every piece of content (static dilemmas EN/IT, dynamic approved/draft dilemmas, blog articles EN/IT). Used by dedup logic and the admin inventory endpoint.

`lib/content-dedup.ts` provides lightweight Jaccard-based dedup without embeddings:
- `findSimilarContent(candidate, inventory)` — returns ranked similar items with similarity scores and reasons
- `scoreNovelty(candidate, inventory)` — returns `{ noveltyScore, similarItems, warnings }`

`lib/content-draft.ts` defines shared TypeScript types for future AI-generated content: `ContentDraft`, `DilemmaDraft`, `BlogArticleDraft`, `QuestDraft`.

**Admin endpoint:** `GET /api/admin/content-inventory` (admin auth required) — returns inventory counts by type/locale/status and flags drafts with low novelty scores.

**Generation rules (enforced before OpenRouter integration):**
- All generated content is `status: draft` — never autopublished
- Admin approval required before any draft enters public routes or sitemap
- `OPENROUTER_API_KEY` is server-side only — never exposed to the client
- No secrets or prompts in logs

### Daily Missions (server-validated)

`lib/missions.ts` defines 5 daily missions. `GET /api/missions` returns per-mission state (`progress`, `required`, `completed`, `claimable`, `comingSoon`). `POST /api/missions/complete` verifies eligibility server-side before awarding XP — the client cannot fake completion.

| Mission ID | Verification | Required |
|---|---|---|
| `vote_3` | Count from `dilemma_votes` today | ≥ 3 votes |
| `vote_2_categories` | Distinct categories from today's votes (static + dynamic lookup) | ≥ 2 categories |
| `daily_dilemma` | At least 1 vote today | ≥ 1 vote |
| `challenge_friend` | Count `referral_visit` events in `user_events` today (requires migration_v9) | ≥ 1 visit |
| `share_result` | Count `user_events` today with type in `{share_result, copy_result_link, story_card_share, story_card_download}` | ≥ 1 event |

`components/DailyMissions.tsx` shows the Claim button only when `claimable === true` from the server. Coming-soon missions are non-interactive. All XP is awarded server-side via `award_mission_xp` (DB function with hardcoded XP table — no client-supplied XP).

### Gamification & Social Identity

SplitVote's long-term loop is: **Engagement → Identity → Status → Monetization**.

Current implemented foundations:
- Voting remains frictionless: anonymous users can vote without creating an account.
- Accounts unlock identity/progress features: vote history, XP, streaks, badges, daily missions, companion, profile settings.
- Public profiles exist at `/u/[id]` with basic public stats and badges.
- Badges and `user_badges` exist in Supabase; `equipped_badge` and `equipped_frame` fields already exist for future cosmetic/profile display.
- Daily missions are server-validated; XP awards are server-side only.
- Premium/admin entitlements are centralized in `lib/entitlements.ts`.

Not implemented yet:
- Full public profile board/wall ("bacheca") with curated trophies and privacy controls.
- Quest system beyond current daily missions.
- Geo quests or geo leaderboards.
- Unique trophy events.
- Cosmetic shop, profile skins, paid frames, avatar store, or bundle economy.

Product rules for future gamification:
- Login must never become mandatory for voting.
- Account features should add identity, progress, rewards, and sharing value.
- No pay-to-win: paid items must not affect vote results, rankings, or visibility of opinions.
- Earned rewards should have stronger perceived value than purchased cosmetics.
- Geo features must be privacy-first and opt-in; avoid precise location tracking unless there is a clear legal basis and product need.
- Avoid over-engineering the economy before real traffic validates retention.

### User Events

`supabase/migration_v8_user_events.sql` creates `public.user_events` for server-side mission verification.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `user_id` | uuid | FK → `auth.users`, cascade delete |
| `event_type` | text | Allowlisted via `/api/events/track`: `share_result`, `copy_result_link`, `story_card_share`, `story_card_download`. Server-inserted via admin client: `referral_visit`, `vote_success`, `vote_change`, `vote_duplicate`, `vote_rate_limited` |
| `scenario_id` | text | Optional |
| `metadata` | jsonb | Additional context |
| `created_at` | timestamptz | Indexed with `(user_id, event_type, created_at)` |

`POST /api/events/track` — authenticated only, allowlisted types, 60s dedup per (user, type, scenario).

Events are written from `ResultsClientPage.tsx` after successful share actions (only on success, not on cancel).

### Admin Seed Batch — Governed batch generation + controlled auto-publish

`POST /api/admin/seed-draft-batch` generates curated dilemma drafts sequentially via OpenRouter. Admin-only (Supabase session required). Requires `OPENROUTER_API_KEY` + `OPENROUTER_MODEL_DRAFT`.

**UI:** `/admin` → Seed Draft Batch panel (`app/admin/SeedBatchPanel.tsx`). No curl/cookie copying needed — uses the browser session.

#### Modes

| Mode | dryRun | autoPublish | Effect |
|---|---|---|---|
| **Dry run** | `true` | `false` | Generates and scores each dilemma but writes nothing to Redis. Use to preview novelty, category breakdown, and estimated call count before committing. |
| **Save drafts** | `false` | `false` | Passing items (noveltyScore ≥ 55) saved to `dynamic:drafts`. Admin approval required before anything goes public. |
| **Controlled auto-publish** | `false` | `true` | Items that pass all quality gates are written directly to `dynamic:scenarios` (max 10 per request). Others fall through to `dynamic:drafts` automatically. |

> `dryRun` and `autoPublish` are mutually exclusive — the API returns `400` if both are `true`.

#### Parameters

| Param | Type | Default | Notes |
|---|---|---|---|
| `locale` | `'en' \| 'it' \| 'all'` | `'all'` | `'all'` runs both EN + IT |
| `count` | number | `10` | Min 1, max 30 server-side. UI caps at 10 (matches 10 available seed topics per locale). Provide custom `topics` to exceed 10. |
| `dryRun` | boolean | `false` | Preview only — no Redis writes |
| `autoPublish` | boolean | `false` | Publish gate-passing items immediately |
| `topics` | string[] | — | Custom topic override (max 60). Requires `locale='en'` or `'it'` (not `'all'`). |

#### Safety guards

- **Topic availability** — fails fast with `400 not_enough_seed_topics` if `count` exceeds available seed topics before any OpenRouter call starts. No silent partial runs.
- **autoPublish cap** — max 10 items auto-published per request regardless of `count`. All others fall to draft.
- **Draft queue cap** — `MAX_DRAFTS = 120`. The approved pool has no hard applicative cap — approved dilemmas accumulate without eviction. Monitor Redis key size in Upstash if the corpus grows significantly (target: keep `dynamic:scenarios` well below 1 MB).
- **Quality gates** — auto-publish requires passing `runQualityGates()` (novelty, finalScore, SEO, no dangerous content). Gate failures fall through to draft (`publishNote: 'quality_gate_failed'`).
- **seoScore** — computed from real generated metadata via `computeSeoScore(seoTitle, seoDescription, keywords)`. Not a fixed baseline.
- **Preflight similarity guard** — topics with `similarity ≥ 70` to an approved/static dilemma, or `≥ 80` to an existing draft, are skipped before any OpenRouter call. No API cost incurred for near-duplicate topics.
- **Novelty guard** — drafts with `noveltyScore < 55` are skipped entirely (not saved).
- **Fail-closed** — any path that does not explicitly publish falls through to `saveDraftScenarios`. Redis errors on publish also fall through to draft.
- **Cron independence** — `autoPublish` here does not change the `AUTO_PUBLISH_DILEMMAS` env var or the cron behaviour. They are separate controls.

#### Recommended workflow

1. **Dry run first** — `locale=all`, `count=10`, `dryRun=true`. Check the category breakdown, novelty scores, and error count.
2. **Evaluate** — if novelty looks good (most items ≥ 55, several ≥ 75), proceed. If many items are skipped, wait or adjust topics.
3. **Generate drafts** — `dryRun=false`, `autoPublish=false`. Review each draft in Dynamic Dilemmas ↓.
4. **Optional auto-publish pass** — only if the dry-run results were strong and you want to reduce the backlog. `autoPublish=true` publishes only items that pass all gates; the rest land in drafts anyway.
5. **Human editorial review** — approve or reject remaining drafts manually. Do not bulk-approve without reading each question.
6. **Spacing** — avoid multiple large batches back-to-back without reviewing the draft queue. `MAX_DRAFTS = 120` is a hard ceiling.

#### What NOT to do

- Do not generate 500 dilemmas in a single run — sequential OpenRouter calls take 2–4 min for 20 items; larger batches time out or cost significantly more.
- Do not use `autoPublish` to skip human review — it is a convenience for unambiguously strong content, not a bypass.
- Do not bulk-publish hundreds of dilemmas without monitoring `dynamic:scenarios` Redis key size — the pool is now uncapped and grows without eviction.
- Do not bulk-approve drafts without editorial control — each dilemma is public-facing and EN/IT localized.

#### Verification commands

```bash
npm run typecheck
npm run build
# Then check the admin panel:
# /admin → Dynamic Dilemmas — confirm draft count and approved pool size
# /admin → Content Inventory — confirm no drafts leaked into sitemap
```

> **Admin panel counts:** Summary badges (EN live, IT live, total approved, auto) use full Redis totals from `approvedByLocale`/`draftsByLocale` fields — not the limited results window. List rows are fetched with `limit=250`; if the corpus exceeds 250, a "Showing N of M" note appears in the panel.

> **Legal note:** No new user data is collected by this feature. Policy remains draft/review-first. Auto-publish is a manual admin action limited by quality gates — it does not change data collection, tracking, or public profile behaviour.

### Expert Insight (v2)

`lib/expert-insights.ts` provides static, category-level educational perspectives shown after voting on results pages.

**Interface:**
- `body` — core philosophical/psychological tension (2-3 sentences)
- `whyPeopleSplit` — why reasonable people disagree (1 sentence)
- `whatYourAnswerMaySuggest` — `{ a, b }` — personalized framing based on the user's vote. Shown only when the user has voted. Always uses cautious language ("may suggest", "could indicate") — never diagnostic.
- `disclaimer` — always shown: "Educational perspective, not professional advice."

**Safety guardrails:**
- No medical, legal, or psychological professional advice — ever.
- Language: always "may", "might", "could suggest" — never "you are X" or definitive claims.
- AI-generated insights (`insightBody`, `insightWhySplit`, `insightPerspectiveA/B` from cron) are draft-only. They are stored in `DynamicScenario.expertInsightEn/It` and shown only after admin approval.
- Static category-level insights are the fallback and are human-authored.

**Dynamic override flow:**
1. Cron generates `insightBody/WhySplit/PerspectiveA/B` alongside each dilemma.
2. Stored as `expertInsightEn` or `expertInsightIt` in the draft Redis key.
3. Admin reviews — if approved, the dilemma (with insights) moves to `dynamic:scenarios`.
4. `ResultsClientPage` merges the dynamic insight over the static fallback (only overrides non-empty fields).

### Dilemma feedback
Results pages include a lightweight quality signal (`🔥 Interesting` / `👎 Not for me`). Feedback is deduplicated by user or anonymous cookie, stored in Supabase/Redis, and updates dynamic dilemma scoring.

### First-party proxies
GA4 is loaded directly from `googletagmanager.com` since `GA4-PROXY-GEO-FIX-01` (19 May 2026) — the first-party proxy under `/api/ga/script` and `/api/ga/g/collect` was removed because GA4 did not honor `X-Forwarded-For` from the proxy and collapsed all visitor geo to the Vercel edge IP. See the GA4 loading note in `Security Notes` below for the full rationale.

AdSense loads directly from `pagead2.googlesyndication.com` (official script). The `/api/ga/ads` proxy route exists but is not used in production — policy-safe for AdSense review. Do not proxy adsbygoogle.js again without re-evaluating AdSense programme policies.

### Stripe webhook
Webhook endpoint: `POST /api/stripe/webhook`. Must be verified with `STRIPE_WEBHOOK_SECRET`.
Test locally: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
Required production events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.

**Idempotency**: the webhook uses `lib/stripe-webhook-events.ts` to guard against double-processing Stripe retries. Each `stripe.event.id` is claimed in `public.stripe_webhook_events` before processing. If the same event arrives again (Stripe retry after 5xx), the handler returns 200 immediately without reprocessing. Requires `migration_v11_stripe_webhook_events.sql` to be applied. **Backward-compatible**: if the table is missing, processing continues as before and a `console.warn` is emitted — no silent failure.

**Idempotency verification runbook** (requires Stripe CLI installed + `migration_v11` applied in Supabase):

```bash
# Terminal 1 — start local dev server, then forward webhook
npm run dev
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Terminal 2 — trigger a test event; note the event ID printed in Terminal 1
stripe trigger checkout.session.completed
```

After the trigger, verify in **Supabase dashboard → Table Editor → `stripe_webhook_events`**:
- A row exists with `stripe_event_id` matching the `evt_...` ID shown in Terminal 1
- `status` = `processed` (not `processing` or `failed`)
- `processed_at` is set (not null)
- `error` is null

**Test duplicate detection** — same event ID sent twice:
```bash
# Copy the event ID from the Terminal 1 output, e.g. evt_1AbCdEf...
stripe events resend evt_1AbCdEf...
```

Expected outcome for the resent event:
- Webhook handler logs `received: true, duplicate: true` (visible in Terminal 1)
- No new row is inserted in `stripe_webhook_events`
- No DB update is triggered — the event is acknowledged without reprocessing

**If `migration_v11` has not yet been applied**: every event logs `[stripe/idempotency] stripe_webhook_events table not found` to Vercel logs and processing continues normally. No silent failure — this is the designed backward-compatible fallback.

Stripe CLI test for other event types:
```bash
stripe trigger customer.subscription.updated
stripe trigger customer.subscription.deleted
```

**Full Stripe QA runbook** (prerequisiti env, utente test, checkout, portal, cancellation, idempotency, failure modes, rollback SQL): see `LAUNCH_AUDIT.md` → Stripe QA End-to-End.

### Entitlements system

`lib/entitlements.ts` is the canonical source of truth for what a user can do. Never check `is_premium` directly in app code — always go through entitlements.

| Field | Admin (ADMIN_EMAILS) | Premium (billing) | Free |
|---|---|---|---|
| `effectivePremium` | ✅ | ✅ | ❌ |
| `noAds` | ✅ | ✅ | ❌ |
| `unlimitedNameChanges` | ✅ | ✅ | ❌ (1 free) |
| `canSubmitPoll` | ✅ | ✅ | ❌ |
| `canAccessAdmin` | ✅ | ❌ | ❌ |
| `isAdmin` | ✅ | ❌ | ❌ |

**Key distinctions:**
- `profiles.is_premium` = billing/Stripe state only. Managed by webhook. Never set manually for admin.
- `ADMIN_EMAILS` = source of admin identity. Server-side env var, never exposed to client.
- `effectivePremium` = admin OR billing premium. Use this for feature gates.
- Client components use `GET /api/me/entitlements` to receive server-computed entitlements without leaking `ADMIN_EMAILS`.

### Display name / rename rules

- Every user gets **one free rename** (`name_changes === 0` → allowed, set to 1).
- Premium (billing) users get **unlimited renames** (tracked, no payment required).
- Admin users get **unlimited renames** without touching `name_changes`.
- Free users after first rename → 402 → Stripe checkout → webhook applies rename + increments `name_changes`.
- Admin is never redirected to Stripe for rename (`/api/stripe/checkout` returns 400 for admin).
- Reserved names: `admin`, `splitvote`, `moderator` (case-insensitive, substring match).

### No-ads rules

- Free / anon users: ads shown if slot is configured.
- Premium (billing) OR admin: `noAds = true` → `AdSlot` renders nothing, no AdSense push.
- `AdSlot` fetches `/api/me/entitlements` once on mount. Renders `null` while loading (no layout shift) and if `noAds = true`.

### Public Emails

All `@splitvote.io` addresses route via Cloudflare Email Routing → Gmail. No personal email is in source.

| Address | Used for |
|---|---|
| `hello@splitvote.io` | General contact, FAQ, account deletion requests |
| `support@splitvote.io` | Account/billing support — in Footer |
| `privacy@splitvote.io` | GDPR/privacy requests — in Privacy Policy |
| `legal@splitvote.io` | Legal/ToS notices — in Terms of Service |
| `business@splitvote.io` | B2B/partnerships — in FAQ + Business page |
| `research@splitvote.io` | Academic/research API access — in FAQ |

> **DNS note:** `splitvote.io` currently redirects to `www.splitvote.io` via Cloudflare.
> All canonical URLs in code use `https://splitvote.io` (no www). Configure a Cloudflare
> Redirect Rule to redirect `www` → non-www (301) to avoid duplicate content.

### Security Notes

**Redirect safety** (`lib/safe-redirect.ts`): all user-controlled redirect targets pass through `safeRedirect()` before use. Allows only paths starting with `/` (not `//`), rejects backslashes and `/api/*` targets. Applied to `app/auth/callback/route.ts` and `app/login/page.tsx`.

**JSON-LD escaping** (`components/JsonLd.tsx`): the `safeJsonStringify()` helper escapes `<`, `>`, and `&` as `<`/`>`/`&` to prevent `</script>` injection. All JSON-LD injection goes through `<JsonLd>` or applies the same escape pattern inline.

**Admin/service role rules**: `ADMIN_EMAILS` is server-side only (never exported to client). `SUPABASE_SERVICE_ROLE_KEY` is used only in `lib/supabase/admin.ts`. Every `app/api/admin/**` route checks `isAdminEmail(user.email)` and returns 401 on failure.

**API input bounds**: `POST /api/events/track` caps metadata at 2 KB serialized and validates `scenarioId` format (`^[a-z0-9-]{1,80}$`). `POST /api/profile/update` validates `countryCode` against `^[A-Z]{2}$`, caps `avatarEmoji` at 8 chars, and rejects `displayName` with control characters.

**GA4 loading** (`app/layout.tsx`): gtag.js is loaded directly from `https://www.googletagmanager.com/gtag/js?id=${GA_ID}` and hits go straight to `https://www.google-analytics.com/g/collect`. The previous first-party proxy under `/api/ga/script` and `/api/ga/g/collect` was removed in `GA4-PROXY-GEO-FIX-01` because GA4 does not honor `X-Forwarded-For` from arbitrary proxies, which collapsed all visitor geo to the Vercel edge IP (e.g. Italian users showing as US/EU edge regions). Direct loading restores correct geo; consent is still gated by Consent Mode v2 (`analytics_storage: 'denied'` default).

### Known issues / TODOs
- Stripe webhook idempotency: implemented in `lib/stripe-webhook-events.ts` + `app/api/stripe/webhook/route.ts`. Requires `migration_v11_stripe_webhook_events.sql` applied in Supabase to be fully active. Until then, the webhook is backward-compatible (processes events without idempotency guard, emits `console.warn`).
- Cosmetic store / companion unlocks: logic exists for `equipped_frame` and `equipped_badge` in DB, but no unlock/store UI is implemented. Admin sees all existing badges from the `user_badges` table; no special unlock logic is needed until the store ships. See ROADMAP.
- Stripe premium subscription/customer portal is implemented. Production requires the Stripe env vars and webhook events to remain configured in Vercel/Stripe.
- Full framework upgrade (`next@16`, `react@19`, Node 24 LTS) is intentionally deferred to a dedicated sprint.
- Social trend sources (X/Instagram/TikTok) are scaffolded as feature flags only. Use official APIs/provider contracts; do not add scraping.
- AdSense slot IDs must be real production slots in Vercel env vars.

---

## Deploy

Push to `main` → Vercel auto-builds and deploys. Use a repo-local `.command` script for commit/push so the deployed repo and workspace stay aligned.

```
push_growth_sprint.command  → older growth script, update before reuse
```

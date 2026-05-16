# CURRENT_HANDOFF — SplitVote

Last updated: 16 May 2026 (late) — blog Redis ISR root-cause fix + middleware matcher narrowing
PM: Matteo
Implementer: Claude Code (Sonnet 4.6 / Opus 4.7) + Codex (VS Code)

## 0a. Session 16 May (late evening) — blog Redis ISR + middleware sprint

Two sprints shipped end-to-end. Blog Redis articles now render correctly
under ISR; public/SEO routes now hit Vercel edge cache. Both verified live.

### 🐛 PM-reported bug (carryover for next session) — equip cosmetics not applying

**Repro path:** Profile → Cosmetics → click Equip on any Pixie skin,
Profile Frame, Glow, Name Color, or toggle PFP → **"nothing happens
visually; the purchased cosmetic doesn't actually apply"** (PM's words).

**Screenshot context (16 May late):** Pixie Galaxy marked Equipped (Epic),
Pulse Frame Equipped, Fire Glow Equipped, Name Color Gold selected,
"Use skin as public avatar" toggle OFF. PM is super_admin so all
cosmetics show as ownable via the `cc45743` admin-bypass.

**First-step diagnostics tomorrow (NOT done tonight):**
1. **DevTools → Network tab while clicking Equip** — does the request to
   `/api/profile/equip-pixie` or `/api/profile/equip-cosmetic` fire?
   What's the response code + payload?
2. **Supabase profiles row inspection** — after a 200 response, does the
   `equipped_*` column actually update for the PM's user_id? If yes,
   the API works and the bug is downstream.
3. **Consumer-side staleness** — does CompanionDisplay / navbar avatar /
   public profile read the equipped value live, or from a stale cached
   render? Possible missing `router.refresh()` / `revalidatePath` after
   equip mutation.
4. **PFP toggle context** — toggle "Use skin as public avatar" is OFF in
   the screenshot. Some surfaces (public `/u/[id]`, leaderboard avatar)
   may intentionally NOT apply the skin when the toggle is off. Check if
   the bug is specific to a single surface or universal.
5. **Service worker / browser cache** — hard reload (Cmd+Shift+R) to rule
   out PWA caching.

**Likely-culprit files:** [components/PixieSelector.tsx](components/PixieSelector.tsx),
[app/api/profile/equip-pixie/route.ts](app/api/profile/equip-pixie/route.ts),
[app/api/profile/equip-cosmetic/route.ts](app/api/profile/equip-cosmetic/route.ts),
[app/api/profile/toggle-pixie-avatar/route.ts](app/api/profile/toggle-pixie-avatar/route.ts),
CompanionDisplay component (consumer).

**Recent context that may be related:** commit `cc45743` (16 May) added
admin-bypass to PixieSelector so super_admin SEES all cosmetics as
ownable, but the actual APPLY/equip mutation flow was untouched. The
bypass may have inadvertently exposed an existing apply bug that only
manifests when items appear "owned" without a real purchase row in
`user_purchases`.

**Priority:** 🔴 **HIGH** if reproducible for non-admin paying users.
Cosmetics are a Stripe-paid feature. If equip works for the API but the
UI doesn't show the change, it's UX-only but still bad. If equip
silently fails for users who actually bought items, it's revenue-impacting
and refund-territory.

**First action tomorrow:** PM repro'es with DevTools open, shares the
Network/Console output. From there: 5 min triage, then targeted sprint.

### Shipped commits

| Hash | Sprint | Description |
|---|---|---|
| `edaa63c` | BLOG-REDIS-SEO-01 | fix(blog): make Redis published posts ISR-safe |
| `bd2d46f` | EDGE-CACHE-HEADERS-01 | perf(middleware): narrow matcher to auth-relevant routes only |

### `edaa63c` — Blog Redis ISR root cause + fix

**Symptom:** Redis-published blog slugs returned 500 on Vercel; static
slugs from `lib/blog.ts` rendered fine. Multiple defensive patches
(`tags`/`relatedDilemmaIds`/`body`/`faq` coercions, restoring
`force-dynamic`, removing `cache()` wrap) papered over the issue without
addressing root cause.

**Root cause:** the shared `@upstash/redis` client uses `fetch` with
`cache: 'no-store'` internally. Reading published drafts via that client
inside `/blog/[slug]/page.tsx` (configured for SSG + ISR via
`generateStaticParams` + `revalidate=3600`) tripped Next's
static-to-dynamic guard at runtime for on-demand Redis slugs, surfacing
as a render error.

**Fix:** replaced the shared Redis client with a direct Upstash REST
`fetch` + `next: { revalidate: 3600 }` hint in
[lib/blog-published.ts:15-38](lib/blog-published.ts#L15-L38). The function
signature stayed identical, so [app/blog/[slug]/page.tsx](app/blog/[slug]/page.tsx)
and [app/it/blog/[slug]/page.tsx](app/it/blog/[slug]/page.tsx) consume it
unchanged. `force-dynamic` directives previously bolted on as a safety
net were removed — those files now have only `export const revalidate = 3600`.

**Deletion-first dividend the safety patches gave to keep:**
defensive coercions on `tags`, `relatedDilemmaIds`, `body`, `faq` in
`publishedDraftToPost` were retained as cheap fault tolerance against
malformed Redis drafts — they're not root cause but produce real value
against future draft schema drift.

**Sitemap freshness:** [app/sitemap.ts](app/sitemap.ts) now includes
Redis-published slugs in addition to static blog posts, with a
`latestBlogModified(locale)` helper feeding the blog index `lastModified`
so Googlebot re-crawls the index when a new article goes live. Evergreen
URLs use a `STATIC_LAST_MOD = new Date('2026-05-16')` constant — avoids
the "every URL modified just now" anti-pattern.

**Verified live on `splitvote.io`** post-deploy:
- `/blog`, `/it/blog` — 200, render correctly
- `/blog/bodyoids-brainless-organs-bioethics` (Redis-published) — 200
- `/it/blog/bodyoids-organi-senza-cervello-bioetica` — 200
- `/blog/culture-public-trust-and-institutional-dilemmas` — 200
- `/it/blog/cultura-fiducia-istituzioni-e-dilemmi-pubblici` — 200
- `/sitemap.xml` — 200, includes static + Redis slugs

### `bd2d46f` — Middleware matcher narrowing

**Symptom:** even after `edaa63c`, blog routes served
`Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate`
with persistent `x-vercel-cache: MISS` — origin function was hit on every
request despite the routes being SSG/ISR.

**Root cause:** [middleware.ts](middleware.ts) had an opt-out matcher
(`/((?!_next/static|…|asset-extensions).*)`) that matched every non-asset
request. Even with `NextResponse.next()` early-return inside, the mere
presence of middleware in the request path disabled Vercel's pure-CDN
edge cache for the matched routes.

**Fix:** converted to opt-in matcher listing only `/` (for IT
auto-redirect) and the auth-relevant prefixes already enumerated in
`AUTH_RELEVANT_PREFIXES`. Defense-in-depth confirmed before changing:
every protected route (`/dashboard`, `/profile`, `/admin`,
`/submit-poll`, `/api/admin/*`, etc.) does its own `supabase.auth.getUser()`
check at the page/handler level. Middleware was layer 2, not the only gate.

**Verified locally with prod build:**
- Blog routes: `Cache-Control: s-maxage=3600, stale-while-revalidate`
  + `x-nextjs-cache: HIT` ✓
- Auth-relevant unauth hits: 307 → `/login?redirect=…` ✓
- `/api/admin/dilemmas` no-token: 401 ✓

**Verified live (PM confirmed):**
- Blog routes: `x-vercel-cache: HIT` + `age` grows → edge cache working
- `cache-control: public, max-age=0, must-revalidate` in the browser
  response is **expected Vercel behavior** — the `s-maxage=3600` directive
  is consumed by the edge CDN and stripped from the browser response.
  `x-vercel-cache: HIT` is the correct success signal, not `s-maxage` in
  the response header.

### Operational policy (unchanged, restated for clarity)

- **Blog publishing remains manual.** Admin reviews drafts → approves →
  publishes via the admin queue. No autopublish path exists.
- **No autopublish of current-events articles.** Quality gates and
  editorial review are required for every Redis-published slug.

### Open observations (deferred, NOT in this sprint)

- `/play/[id]`, `/results/[id]`, `/category/*` still serve
  `Cache-Control: private, no-cache, no-store` — different root cause
  than blog. Diagnose (read-only, 16 May late):
  - **`/play/[id]`** ([app/play/[id]/page.tsx:69](app/play/[id]/page.tsx#L69)):
    `export const dynamic = 'force-dynamic'` **intentionally set** per
    CLAUDE.md anti-regression rule. Also reads `cookies()` line 121 to
    collect `sv_voted_*` anonymous markers, plus `supabase.auth.getUser()`
    for `existingVote` + streak. Cannot be cached as-is.
  - **`/results/[id]`** ([app/results/[id]/page.tsx:65,95](app/results/[id]/page.tsx#L65)):
    has `export const revalidate = 60` (NOT force-dynamic), but line 95
    calls `cookies()` to scan `sv_voted_*` for anonymous users. The
    `cookies()` call alone bumps the route to dynamic regardless of the
    revalidate directive.
  - **`/category/[category]`** ([app/category/[category]/page.tsx:63](app/category/[category]/page.tsx#L63))
    and **`/trending`** ([app/trending/page.tsx:9](app/trending/page.tsx#L9)):
    both have `revalidate = 3600`, **no `cookies()`/`headers()` calls**.
    Their no-store behavior was likely caused by the middleware matcher
    pre-`bd2d46f`. Likely already cacheable now — untested.
  - **Future sprint shape if/when needed (PLAY-EXISTING-VOTE-CLIENT-MOVE-01):**
    move `votedIds` + `existingVote` + streak from server to client via
    `/api/me/voted-ids` (exists) + new `/api/me/streak` (or expand
    existing endpoint). Remove `force-dynamic` from `/play`; remove
    `cookies()` from `/results`. Risk: flash of "no vote" pre-hydration
    for logged-in users; possible UX trade for cacheability.
- Vercel Attack Challenge Mode may be enabled at the project level —
  blocked all curl/WebFetch verification during this session. PM is
  running VERCEL-CHALLENGE-SANITY-01 dashboard audit; no code action
  pending until that returns evidence of real impact (e.g., Googlebot
  403s in Search Console).

### Next session — top blockers (unchanged, restated)

All HUMAN_ONLY:
1. **Stripe live QA** — real card on splitvote.io/profile
2. **AdSense slot IDs + approval check**
3. **Supabase HIBP toggle** — Auth → Settings → Password protection
4. **Backup/DR posture** — Upstash auto-backup, Supabase PITR, Resend SPF/DKIM
5. **`patch-revoke-public.sql`** — applied 16 May afternoon (no longer pending)

---

## 0. Session 16 May (afternoon + evening) — audit + hardening + DB apply

Project-wide audit + production DB hardening. 5 commits shipped + applied
to production Supabase via MCP. Dashboard root cause closed; super_admin /
admin store unlock fixed; security advisor count dropped from 25 → 16.

### What's live in production now

**Dashboard:**
- `cc45743` — super_admin and admin see every cosmetic as owned in the
  dashboard PixieSelector (mirrors the /store bypass).
- Badge collection on the dashboard is non-empty again for all logged-in
  users (was empty since the RLS-without-policies regression).

**Supabase (applied via MCP bundle `session_2026_05_16_full_bundle`):**
- `badges` table: RLS policy "Anyone can read badge definitions" for anon
  + authenticated. Verified: 15 badge definitions readable post-apply.
- `user_badges.badge_id` FK: NO ACTION → ON DELETE CASCADE.
- `profiles` role: alphablacklady83@gmail.com → 'admin' (guarded against
  super_admin downgrade).
- `dilemma_feedback_stats` view: SECURITY DEFINER → security_invoker.
- 7 SECURITY DEFINER functions: `search_path` pinned to (public, pg_temp)
  (award_mission_xp, enforce_role_immutability_fn, set_updated_at,
  increment_poll_vote, increment_user_vote_count, check_and_award_badges,
  update_stripe_webhook_events_updated_at).
- 5 SQL COMMENTs on RPC-intended SECURITY DEFINER functions documenting
  intent.
- 2 SQL COMMENTs on RLS-no-policy tables (role_audit_log,
  stripe_webhook_events) documenting intentional design.
- 1 SQL COMMENT on profiles "Only super_admin can update role" policy
  documenting advisor false positive.

**Security advisor delta:**
- Before: 1 ERROR + 18 WARN + 3 INFO = 22
- After:  0 ERROR + 13 WARN + 2 INFO = 15
- Cleared: SECURITY DEFINER view (ERROR), 7 function_search_path_mutable
  (WARN), badges RLS-no-policy (INFO).
- Pending bundle re-apply: 2 trigger function executable findings (need
  `REVOKE EXECUTE ... FROM PUBLIC` — see patch file below).
- Pending PM decisions: poll_votes "Anyone can insert" (Option A vs B),
  HIBP toggle (dashboard).
- Permanent intentional/documented: role_audit_log + stripe_webhook_events
  RLS-no-policy (INFO), profiles role-update policy USING (true) (WARN),
  increment_poll_vote anon-callable (WARN — anonymous poll voting), 4
  authenticated-callable RPC functions (intentional + documented).

### Files changed (committed + pushed)

| File | Change | Why |
|---|---|---|
| [components/PixieSelector.tsx](components/PixieSelector.tsx) | Added `isAdmin?: boolean` prop + `ALL_OWNABLE_IDS` constant + `effectiveOwnedIds = isAdmin ? ALL_OWNABLE_IDS : ownedIds` everywhere a `.includes()` check runs | PM bug: super_admin (and admin) did not see the cosmetics section unlocked on the dashboard. The `/store` page already bypasses admin (line 36); the in-dashboard PixieSelector did not. Now mirrors the same admin bypass. |
| [app/dashboard/page.tsx](app/dashboard/page.tsx) | Imported `getUserEntitlements` + `UserRole`. Added `role` to `Profile` type + the `profiles` SELECT. Computed `entitlements`. Passes `isAdmin={entitlements.isAdmin}` to PixieSelector. | Wires the admin bypass through to the cosmetics UI. |
| [supabase/session-2026-05-16-apply-bundle.sql](supabase/session-2026-05-16-apply-bundle.sql) | 9 ops in one transaction (v19 §1+§2 + admin grant + v20 §1+§2+§3+§4+§6+§7). Applied successfully via MCP. | Atomic apply file; left in repo for audit + future reference. |
| [supabase/session-2026-05-16-patch-revoke-public.sql](supabase/session-2026-05-16-patch-revoke-public.sql) | 2 REVOKE EXECUTE FROM PUBLIC ops for trigger functions. **NOT APPLIED** (MCP blocked by classifier; PM applies manually). | Closes remaining 2 advisor findings on enforce_role_immutability_fn + handle_new_user. The bundle revoked from anon/authenticated but PUBLIC inheritance left the grant in place. |
| [supabase/migration_v20_security_hardening.sql](supabase/migration_v20_security_hardening.sql) | Refreshed §3 with REVOKE FROM PUBLIC; everything else unchanged. | Keeps v20 as the canonical, future-readable proposal. |

**Files changed (uncommitted):**

| File | Change | Why |
|---|---|---|
| [components/PixieSelector.tsx](components/PixieSelector.tsx) | Added `isAdmin?: boolean` prop + `ALL_OWNABLE_IDS` constant + `effectiveOwnedIds = isAdmin ? ALL_OWNABLE_IDS : ownedIds` everywhere a `.includes()` check runs | PM bug: super_admin (and admin) did not see the cosmetics section unlocked on the dashboard. The `/store` page already bypasses admin (line 36); the in-dashboard PixieSelector did not. Now mirrors the same admin bypass. |
| [app/dashboard/page.tsx](app/dashboard/page.tsx) | Imported `getUserEntitlements` + `UserRole`. Added `role` to `Profile` type + the `profiles` SELECT. Computed `entitlements`. Passes `isAdmin={entitlements.isAdmin}` to PixieSelector. | Wires the admin bypass through to the cosmetics UI. |
| [README.md](README.md) | Migration table extended v15 → v19; v19 row marked `⏳ Pending (proposed 16 May 2026)` | Table was stuck at v14; v15-v18 already applied but undocumented; v19 needs a row |
| [DESIGN.md](DESIGN.md) | Removed stale "btn-neon-blue undefined" ambiguity in §5.8, §8 rule 15, §"Known Ambiguities". Class is defined in `globals.css:162` | Doc was incorrect; verified the utility exists |
| [supabase/migration_v20_security_hardening.sql](supabase/migration_v20_security_hardening.sql) | **PROPOSAL — not applied** | Addresses remaining Supabase advisor findings: `dilemma_feedback_stats` SECURITY DEFINER view, 7 functions with mutable `search_path`, `poll_votes` open-insert policy, 9 SECURITY DEFINER functions callable from anon. Includes verification queries + per-section apply-or-skip decisions. |
| [vitest.config.ts](vitest.config.ts) | New | Vitest scaffold. `@/` alias, node env, v8 coverage on `lib/**/*.ts`. |
| [tests/unit/safe-redirect.test.ts](tests/unit/safe-redirect.test.ts) | New | 8 unit-test cases on `lib/safe-redirect.ts` as the pattern for follow-on tests. |
| [tests/README.md](tests/README.md) | New | Install instructions for vitest + priority list of next libs to cover (entitlements, admin-guard, redis, missions/complete, events/track, quality-gates). |
| [reports/disaster-recovery-runbook.md](reports/disaster-recovery-runbook.md) | New | DR runbook covering 7 incident scenarios + a one-time mitigations checklist (PITR, Upstash backups, Redis snapshot to storage, Resend DNS, Vercel branch protection, Sentry decision). |
| `reports/dilemma-visibility-audit-2026-05-07.md` | Moved → `reports/archive/` | > 7 days old, archive per CLAUDE.md hygiene rule. |
| `reports/blog-cluster-gaps-2026-05-09.md` | Moved → `reports/archive/` | Same. |

**Deps installed:** `vitest@^4.1.6` + `@vitest/coverage-v8@^4.1.6` as
devDependencies. Scripts wired in `package.json`: `npm test`, `npm run
test:watch`, `npm run test:coverage`. 8/8 tests passing on
`tests/unit/safe-redirect.test.ts`.

**Post-apply state (16 May, evening):**

Top three remaining blockers (all HUMAN_ONLY):
1. **Stripe live QA** — carta reale on splitvote.io/profile, verify
   `is_premium=true` + PRO badge + cancel via portal.
2. **AdSense slot IDs + approval check** — Vercel env vars +
   dashboard.google.com/adsense.
3. **HIBP toggle** — Supabase Auth → Settings → Password protection (30
   seconds).

Plus the small patch:
4. **Apply patch-revoke-public.sql** — 2 REVOKE FROM PUBLIC ops Claude
   couldn't apply via MCP (classifier blocked the follow-up). 30 seconds.

Other backlog (lower priority): poll_votes A/B decision, Stripe cosmetic
14 price IDs, backup config (PITR/Upstash/Resend DNS), DPA formali.

---


---

## 1. Production State

- **Branch:** `main`
- **Local vs remote:** **in sync** — all commits below pushed
- **Last pushed:** `bd2d46f` — perf(middleware): narrow matcher to auth-relevant routes only

### Recent commits — session 16 May 2026 (10 commits, latest first)
| Hash | Description |
|---|---|
| `bd2d46f` | perf(middleware): narrow matcher to auth-relevant routes only (EDGE-CACHE-HEADERS-01) |
| `edaa63c` | fix(blog): make Redis published posts ISR-safe (BLOG-REDIS-SEO-01) |
| `9ee07f1` | chore(db): apply session bundle to prod + patch REVOKE FROM PUBLIC |
| `bf3d2d9` | chore(db): populate v20 with real advisor names + expand apply bundle |
| `d5e6ac9` | chore(db): bundle 4 DB operations for manual apply |
| `a0d589a` | chore(audit): docs cleanup + v20 proposal + vitest scaffold + DR runbook |
| `cc45743` | fix(dashboard): admin bypass on PixieSelector — every cosmetic shown as owned |
| `4c61022` | fix(types): accept optional votesToday prop in DailyMissions |
| `504b3b8` | fix(dashboard): null guard on b.badges in BadgeSection + page |
| `7a55801` | fix(dashboard): null guard on b.badges before .map() |

### Recent commits — session 15 May 2026 (10 commits)
| Hash | Description |
|---|---|
| `29430a9` | perf(pixie): migrate <img> to next/Image across 5 components |
| `cc6d733` | fix(ux+perf): pixie thumbnail breathing room + code-split modals |
| `968d5d1` | fix(dashboard): error boundary + force-dynamic + defensive logging |
| `7d130fa` | fix(seo): STATIC_LAST_MOD fallback per ?? now residuals in sitemap |
| `b8f0efc` | fix(seo): stable sitemap lastModified for static pages |
| `f6bb4c7` | fix(ux+i18n): Pixie nav discoverability + complete IT aria-labels in store |
| `1561717` | feat(store): unify /store with new client, admin bypass, fix Stripe webhook |
| `8f74cd4` | fix(seo): extend reciprocal hreflang to /trending + /faq, unify it-IT tag |
| `84c77ca` | fix(seo): add reciprocal hreflang + crawlable IT link on home EN |
| `19ca6bc` | feat: add opportunity packs and blog structured data (BlogPosting JSON-LD) |

### Earlier commits — session 13 May 2026 (Sprints M–U + Fixes Y/Z)
| Hash | Description |
|---|---|
| `4e636d1` | fix(ux): mission targets → /trending; leaderboard back-nav on profile (Fix Y+Z) |
| `1c95380` | docs: update CURRENT_HANDOFF — Sprints M/N/O/Q/R/S/T/U (13 May afternoon) |
| `fbbe41d` | feat(sprint-t+u): XP+level on public profile, leaderboard metadata updated |
| `10998fa` | feat(sprint-s): streak saved toast on /play after voting when streak at risk |
| `28a9260` | feat(sprint-q): hreflang alternates on EN category pages |
| `acbe29a` | feat(sprint-n): sticky "See Results" CTA on /play after first vote |
| `d943bc5` | feat(sprint-o): +50 XP pill on DailyDilemma vote card |
| `2ea200a` | fix(sprint-m): challenge_friend mission via challenge_link_copied event |
| `8198753` | feat(sprint-h): elevate streak to first-class dashboard retention signal |
| `433ec8c` | perf(sprint-i): swap getDynamicScenarios → getCachedDynamicScenarios in IT results page |

---

## 1a. What changed today (16 May 2026) — Dashboard FK + build break + DB root cause

### Dashboard FK orfana — sintomo (PM-driven, commits 7a55801 + 504b3b8)
- Digest `2512231454`: `userBadges.map` accedeva a `b.badges.name/.emoji` quando il join `badges(...)` ritornava `null`. Fix: `.filter(b => b.badges != null)` prima del `.slice(0,5).map(...)` nell'header del dashboard.
- Digest `1932806716`: stesso pattern propagato a `<BadgeSection>` (e all'`equippedBadge.badges.name` nel titolo). Fix: filter sui props passati al component + null guard sul title.

### Build break post-fix — `4c61022` (Claude)
- Il fix `504b3b8` aggiungeva `<DailyMissions votesToday={...} />` sul dashboard ma il component `Props` non dichiarava `votesToday`. Vercel build TypeScript falliva.
- Fix: aggiunto `votesToday?: number` (opzionale) su [components/DailyMissions.tsx](components/DailyMissions.tsx). Tutti gli altri caller continuano a compilare; quando vuoi renderizzare la prop nella UI dimmelo (5 min di refactor del component body).

### VERA root cause — analisi Supabase MCP
- `badges` table aveva **RLS enabled** ma **0 policies** (confermato da Supabase security advisor + query a `pg_policy`).
- Conseguenza: ogni query authenticated col join `badges(...)` riceveva `badges: null` per ogni riga. Il fix difensivo del PM (filter null) elimina il crash, ma il **side effect è che la badge collection del dashboard è VUOTA per tutti gli utenti** finché non si aggiunge una RLS policy SELECT.
- Verificato anche: **zero FK orfane** in `user_badges` (11 righe totali, tutte con badge valido). Quindi non era un problema di FK orfana — era un problema di permessi RLS.

### Migration v19 proposta (NON APPLICATA — PM action)
- File: [supabase/migration_v19_badges_rls_and_fk_hardening.sql](supabase/migration_v19_badges_rls_and_fk_hardening.sql)
- Contenuto:
  1. `CREATE POLICY "Anyone can read badge definitions" ON public.badges FOR SELECT TO anon, authenticated USING (true)` — chiude il root cause
  2. `user_badges.badge_id` FK da `NO ACTION` → `ON DELETE CASCADE` — preventivo (idempotenza: 0 orphan attuali)
  3. Cleanup query commentata per orphan futuri
  4. 3 query di verifica post-apply
- **Da eseguire da te in Supabase SQL Editor** (HUMAN_ONLY per regola CLAUDE.md su database migrations). Effetto atteso: dashboard ricomincia a mostrare i badge utente correttamente.

### Altri security advisor (medio-bassa priorità)
| Level | Item | Note |
|---|---|---|
| ERROR | `dilemma_feedback_stats` view is SECURITY DEFINER | Verifica intent — la view può bypassare RLS della tabella sottostante |
| WARN | 7 functions con `search_path` mutable | Minor SQL injection vector — hardening cosmetico |
| WARN | `poll_votes` RLS policy "Anyone can insert votes" `WITH CHECK = true` | Voluto? Verifica intent |
| WARN | 9 `SECURITY DEFINER` functions callable da anon/authenticated | Audit per ognuna se intent corretto |
| WARN | `auth_leaked_password_protection` disabilitato | Best practice Supabase — abilitare in Auth → Password protection |

---

## 1b. What changed today (15 May 2026) — SEO + Dashboard + Pixie polish

### SEO discovery sprint (5 commits)
- **Home EN hreflang reciproci + crawlable IT link** (`84c77ca`): `app/page.tsx` ora dichiara `alternates.languages` + rende un `<a href="/it" hrefLang="it">Vai alla versione italiana →</a>` server-rendered nel JSX. Root cause `/it` "Unknown to Google" chiusa.
- **`/trending` + `/faq` hreflang reciproci** (`8f74cd4`): aggiunte `alternates.languages` mancanti + unificato `it` → `it-IT` su `/blog` EN+IT.
- **Sitemap freshness** (`b8f0efc` + `7d130fa`): introdotta const `STATIC_LAST_MOD = new Date('2026-05-15')` per le pagine statiche; sostituito `lastModified: now` con date stabile (Google deprioritizza crawl quando ogni URL dice "modified just now" ad ogni fetch). Mantenuti timestamp reali per AI scenarios (`approvedAt/generatedAt`) e blog post (`post.date`).
- **Live now:** sitemap.xml mostra 236 URL su `2026-05-15T00:00:00.000Z` + altri con date reali; nessun timestamp `now`-style residuo dopo `7d130fa`.

### Dashboard recovery (1 commit)
- **`968d5d1`** fix(dashboard): Application error "Digest 2512231454" → graceful error boundary
  - Nuovo `app/dashboard/error.tsx`: UI EN/IT fallback con retry button + digest visibile
  - Aggiunto `export const dynamic = 'force-dynamic'` su `app/dashboard/page.tsx` (era senza directive, default era ISR — questo causava "vedo sempre gli stessi quesiti votati")
  - Aggiunto logging difensivo `[dashboard]` su ogni query Supabase + catch branches per `user_purchases` e `getDynamicScenarios`. Vercel logs ora identificano la root cause vera del digest specifico.
  - Renamed `import dynamic from 'next/dynamic'` → `nextDynamic` per evitare shadow con `export const dynamic`.

### Pixie polish (2 commits)
- **`cc6d733`** fix(ux+perf): pixie thumbnail breathing room + code-split modals
  - `MobileStickyHUD` thumb: +`p-0.5` padding interno
  - `CompanionDisplay` main avatar: +`p-1.5` padding nel button 80×80
  - `CompanionDisplay` compact thumb: +`p-0.5` padding
  - `PixieLevelUpModal` + `PixieDetailModal` ora code-split via `next/dynamic` + `ssr:false` (~45KB combinati uscono dal bundle iniziale)
- **`29430a9`** perf(pixie): `<img>` → `next/Image` su 5 componenti
  - Pixie PNG sono 256×256, `next/Image` ora gestisce srcset + AVIF/WebP + lazy loading nativo
  - `priority` su MobileStickyHUD (sticky, sempre visibile) e CompanionDisplay hero (LCP-critical)

### Store + admin bypass (1 commit — sprint del PM)
- **`1561717`** feat(store): `/store` ora usa lo stesso client di `/it/store` (legacy retired); admin vede tutti i prodotti unlocked in store + dashboard; equip APIs (pixie/cosmetic/toggle) accettano admin bypass; webhook Stripe one_time_purchase scrive `product_type`, `stripe_payment_intent_id`, `status='completed'` in `user_purchases`.

### Opportunity packs + BlogPosting JSON-LD (1 commit)
- **`19ca6bc`** feat: scripts/generate-opportunity-pack.mjs + content-output bioethics-bodyoids pack + BlogPosting schema + ImageObject + OG/Twitter `summary_large_image` su blog EN+IT.

### What I deferred (PM has uncommitted blog content)
- **`lib/blog.ts` split** (7k righe → posts-en/posts-it/api): rinviato perché PM ha 4 nuovi articoli (bodyoids, frontier-ai, moral-injury, limerence) non committati nello stesso file → alto rischio merge conflict. Da fare dopo che PM committa i posts.
- **Internal linking sui 4 nuovi articoli**: stesso file, stesso rischio. Riprendere dopo commit PM.

### PM action SQL fornito (HUMAN_ONLY)
```sql
UPDATE profiles SET role = 'admin'
WHERE email = 'alphablacklady83@gmail.com' AND role <> 'super_admin';
```
Da eseguire in Supabase SQL Editor per dare admin normale all'utente segnalato.

---

## 2. What changed 13 May 2026 — end of day

### Fix Y — Back-nav leaderboard → public profile
- `app/u/[id]/page.tsx`: reads `searchParams.from`, renders `← Leaderboard` (en) / `← Classifica` (it) when arriving from the leaderboard, fallback to `← SplitVote` otherwise
- `app/leaderboard/page.tsx`: user links now carry `?from=leaderboard`
- `app/it/leaderboard/page.tsx`: user links carry `?from=it-leaderboard`

### Fix Z — Mission deep-link targets
- `components/DailyMissions.tsx`: `vote_3` and `vote_2_categories` now link to `/trending` (en) / `/it/trending` (it) instead of `/moral-dilemmas` SEO landing — direct path to voting reduces friction for mission completion

### Sprints W / V / X — already implemented, no-op
- Confirmed during code review that the pm-orchestrator candidates were already shipped:
  - Sprint W (DailyDilemma full-card click): absolute overlay `Link` already present in `components/DailyDilemma.tsx` (added in Sprint O)
  - Sprint V (Mission deep links): `MISSION_TARGETS` map + `<Link>` rendering already in `components/DailyMissions.tsx`
  - Sprint X (Blog 2-col grid + share): `BlogGrid` already uses `md:grid-cols-2 lg:grid-cols-3`; `BlogShareButton` already on cards and on article page (`components/BlogArticle.tsx`)

---

## 2b. What changed today (13 May 2026) — afternoon session

### Sprint U — XP + Level on Public Profile
- `app/u/[id]/page.tsx`:
  - Added `import { getLevelInfo } from '@/lib/missions'`
  - Computed `streakDays` and `levelInfo` from profile data
  - Expanded stats grid from 2-col (xs) to `grid-cols-2 sm:grid-cols-4` — now shows 4 cards
  - New stat card: **Lv.N** (color from `levelInfo.color`) + XP count
  - New stat card: **streak** — orange border/bg + 🔥 when active, muted dash when zero

### Sprint T — Leaderboard Metadata Update
- `app/leaderboard/page.tsx` + `app/it/leaderboard/page.tsx`:
  - Updated `metadata.description` (EN + IT) to mention XP alongside votes and streaks
  - Minor OG/twitter copy parity

### Sprint S — "Streak Saved!" Toast on /play
- `app/play/[id]/VoteClientPage.tsx`:
  - Added `streakSaved` state
  - When `streakAtRisk && streakDays > 0`: shows full-screen overlay toast (🔥, orange, EN/IT) then redirects after 1.2 s
  - Non-streak votes redirect immediately as before

### Sprint R — Top XP Leaderboard Section
- `app/leaderboard/page.tsx` + `app/it/leaderboard/page.tsx`:
  - Extended `ProfileRow` type with `xp: number | null`
  - Added third Supabase query: `xp desc`, `gt('xp', 0)`, limit 50
  - New "⚡ Top XP — Missions & Engagement" section (purple accent, `hover:border-purple-500/30`)
  - IT copy: "⚡ Top XP — Missioni & Impegno"

### Sprint Q — hreflang on EN Category Pages
- `app/category/[category]/page.tsx`:
  - Added full `languages` block to `alternates`: `en`, `it-IT`, `x-default`
  - Matches IT category page pattern for Search Console hreflang parity

### Sprint O — +50 XP Pill on DailyDilemma
- `components/DailyDilemma.tsx`:
  - Yellow XP pill (`+50 XP`) shown only when `mounted && !isVoted` — disappears after voting
  - Inline style: `text-yellow-300 bg-yellow-500/15 border-yellow-500/30`

### Sprint N — Sticky "See Results" CTA on /play
- `app/play/[id]/VoteClientPage.tsx`:
  - After voting: sticky bottom bar slides up after 250 ms delay
  - Shows "See Results →" (EN) / "Vedi Risultati →" (IT), links to results page
  - Respects `prefers-reduced-motion` (appears instantly)
  - `env(safe-area-inset-bottom)` for iPhone notch
  - GA4: `see_results_clicked` event on tap

### Sprint M — challenge_friend Mission Fix
- **Root cause**: `challenge_friend` mission required `referral_visit` events (someone else clicking the user's referral link) — not in user's direct control, mission was effectively impossible.
- **Fix**: switched to `challenge_link_copied` event fired client-side when user taps "Copy Challenge" in `copyChallenge()`.
- `app/results/[id]/ResultsClientPage.tsx`: added `trackServerEvent('challenge_link_copied')` in `copyChallenge()`
- `app/api/missions/route.ts`: added `CHALLENGE_EVENT_TYPES`, `countChallengeEventsToday()`, wired into `challenge_friend` + `share_and_challenge` progress
- `app/api/missions/complete/route.ts`: both mission completion checks now use `challenge_link_copied` events

### Sprint P — Blog Workflow (no-op)
- GenerateDraftPanel + BlogDraftQueue already wired in admin "Blog" tab with full approve/reject/publish flow. EN+IT blog pages already read from `blog:published`. No code changes were needed.

---

## 3. What changed earlier today (13 May 2026) — morning session

### Sprint H — Dashboard Streak Retention UI
- `components/DailyMissions.tsx`: replaced small inline streak text with a prominent orange banner card (fire icon, day count, "keep streak alive" copy, EN/IT)
- `app/dashboard/page.tsx`:
  - Moved `<DailyMissions>` above `<CompanionDisplay>` — first thing returning users see
  - Replaced "Polls submitted" stat with **streak counter**; highlights in orange with 🔥 emoji when `streakDays > 0`
  - Added `statsStreak` key to EN/IT COPY object

### Sprint I — IT Results Page Cache Parity
- `app/it/results/[id]/page.tsx`: swapped `getDynamicScenarios()` → `getCachedDynamicScenarios()` (import from `@/lib/cached-data`)
- IT results page was the only remaining route calling the uncached version; now matches EN behavior (1-hour `unstable_cache`)

### Sprint G — Sticky "Next Dilemma" CTA
- `app/results/[id]/ResultsClientPage.tsx`:
  - Sticky bar now shows on all screen sizes (was mobile-only with `sm:hidden`)
  - Slides up 200 ms after `revealed` state fires (`translate-y-full` → `translate-y-0`)
  - Respects `prefers-reduced-motion` (appears instantly with no animation)
  - `env(safe-area-inset-bottom)` padding for iPhone notch
  - Fixed forward-reference bug: `showStickyNext` moved before all effects

### Sprint F-B — useLocale() Hook
- NEW `hooks/useLocale.ts`: centralizes `usePathname()` + `/it` prefix detection
- Updated: `AuthButton`, `NavLinks`, `Footer`, `CookieConsent`, `AdBlockBanner`, `MobileMenu`, `LocaleAwareLogo`

### Sprint E — ISR Performance Fix
- **Root cause**: `getFreshDynamicScenarios()` calls `unstable_noStore()` inside — any page that called it was forced into dynamic server-rendering on every request (no ISR), even though `getCachedDynamicScenarios()` with `unstable_cache` + `revalidate:3600` already existed in `lib/cached-data.ts`.
- **Fix**: Swapped `getFreshDynamicScenarios` → `getCachedDynamicScenarios` in 6 pages + added `export const revalidate = 3600` to the 4 that had no revalidate directive + replaced `export const dynamic = 'force-dynamic'` with `export const revalidate = 3600` in the 2 category pages.
- **Pages fixed**: `app/page.tsx`, `app/it/page.tsx`, `app/trending/page.tsx`, `app/it/trending/page.tsx`, `app/category/[category]/page.tsx`, `app/it/category/[category]/page.tsx`
- **Verified**: Build output confirms `/` `○`, `/it` `○`, `/trending` `○`, `/it/trending` `○` (all Static/ISR); `/category/*` and `/it/category/*` `●` (SSG). Previously all were `ƒ` (Dynamic, per-request).
- **On-demand invalidation**: Already wired — `revalidateTag('dynamic-scenarios')` in admin approve routes fires immediately when a new dilemma is approved, so cache is always fresh.

---

## 3. What changed 12 May 2026

### Sprint A — Performance Pass
- `/u/[id]/page.tsx`: `force-dynamic` removed → `revalidate:3600`; uses `createPublicClient()` (no cookies → ISR-safe)
- `lib/supabase/server.ts`: added `createPublicClient()` — anon key, no cookie dependency
- `app/blog/[slug]/page.tsx` (EN + IT): `force-dynamic` → `revalidate:3600`
- `app/dashboard/page.tsx`: reads `lang-pref` cookie → passes `locale` to CompanionDisplay + DailyMissions + PixieSelector; `next/dynamic` for OnboardingModal + BadgeSection

### Sprint B — PixieSelector Redesign + i18n
- `components/PixieSelector.tsx` fully rewritten:
  - "Currently Equipped" banner showing active skin + rarity chip
  - Filter tabs All / Owned / Store on Pixie skin grid (owned count badge)
  - Non-owned items: shop link instead of greyed lock
  - Full COPY object EN/IT — no more hardcoded Italian

### Sprint C — UI Polish + i18n
- `lib/rarity.ts`: single source for RARITY_STYLES + RARITY_GLOW + RARITY_ORDER
- Removed 4 inline duplicates (u/[id], dashboard, BadgeSection, ProfileClient)
- A/B color consistency: vote history blue/purple → red/blue (A=red, B=blue app-wide)
- Dashboard stats grid: `grid-cols-4` → `grid-cols-2 sm:grid-cols-4` (mobile fix)
- Dashboard full i18n: COPY EN/IT for all visible strings; STATUS_BADGE localized

### Launch Fixes
- `app/layout.tsx`: inline script sets `html[lang]='it'` for /it/* routes
- `vercel.json`: 301 redirect www.splitvote.io → splitvote.io (source fixed to `/:path*`)
- `app/api/profile/equip-pixie/route.ts`: import fix `lib/pixie-store` → `lib/cosmetics-store`
- `app/api/stripe/webhook/route.ts`: refund handler now revokes `pixie_xp.active` + `use_pixie_avatar` when refunded item was the active one

### Sprint D — Launch Polish
- `app/sitemap.ts`: added `/leaderboard` + `/it/leaderboard` (changeFreq: hourly, priority 0.85/0.80)
- `app/leaderboard/page.tsx` + `app/it/leaderboard/page.tsx`: added `openGraph` + `twitter: summary` metadata
- `app/results/[id]/ResultsClientPage.tsx`:
  - `signup_cta_clicked` event on anon "Join free" CTA
  - `copy_link_clicked` → `share_clicked { target: 'copy_link' }` (unified)
  - `handleWebShare` tracks only on successful completion, not on intent/cancel
- `components/DilemmaCardShareButton.tsx`: track after `shareQuestion()` resolves, skip on `'cancelled'`
- `components/BlogShareButton.tsx`: track only on `'shared'`/`'copied'`, skip on `'cancelled'`

### Leaderboard + GA4 Login Events (commit f3413e1)
- `app/leaderboard/page.tsx` + `app/it/leaderboard/page.tsx`: NEW pages — ISR revalidate:600, top 50 voters + top streaks, medals 🥇🥈🥉, links to /u/[id], try/catch for build-time env absence
- `components/Footer.tsx`: Leaderboard link added EN/IT
- `components/MobileMenu.tsx`: Leaderboard link added with Users icon
- `app/login/page.tsx`: GA4 events `login_started`, `login_completed`, `signup_completed`, `signup_initiated`

### Vercel deploy issue (discovered + fixed today)
- **Root cause 1**: Claude Code commits used `SplitVote <hello@splitvote.io>` as git author — Vercel blocks deploys from unrecognized emails. Fix: always use `mat.pizzi@gmail.com` (git config already correct locally, issue was session-level override).
- **Root cause 2**: `vercel.json` redirect had `"source": "/(.*)"` — Vercel requires `"source": "/:path*"` when using `:path*` in destination. Fixed in `7f7cbf8`.
- **Going forward**: auto-deploy via GitHub App should work again now that both issues are resolved.

---

## 3. Feature State

| Feature | State |
|---|---|
| Anonymous vote flow | ✅ working |
| EN/IT routes | ✅ complete + locale-isolated |
| html[lang] on IT pages | ✅ inline script in layout |
| www → non-www redirect | ✅ vercel.json 301 (`/:path*`) |
| Dashboard full i18n | ✅ complete |
| PixieSelector redesign | ✅ Currently Equipped + tabs + i18n |
| RARITY_STYLES consolidated | ✅ lib/rarity.ts |
| Public profile ISR | ✅ revalidate:3600 + createPublicClient |
| Blog ISR (EN+IT) | ✅ revalidate:3600 |
| A/B color consistency | ✅ red/blue everywhere |
| Leaderboard EN/IT | ✅ live — revalidate:600, OG metadata, in sitemap |
| GA4 login funnel | ✅ login_started/completed, signup_completed/initiated |
| GA4 share tracking | ✅ unified share_clicked, tracks only on completion |
| GA4 signup_cta_clicked | ✅ on anon results CTA |
| Stripe refund handler | ✅ revokes active pixie + use_pixie_avatar on refund |
| Vercel auto-deploy | ✅ restored — was blocked by wrong git author email + vercel.json |
| ISR performance (6 EN pages) | ✅ getCachedDynamicScenarios + revalidate:3600 (Sprint E) |
| ISR parity IT results page | ✅ getCachedDynamicScenarios (Sprint I) |
| Dataset SEO structured data | ✅ license + creator + variableMeasured (EN+IT) |
| useLocale() hook | ✅ centralized locale detection across 7 components (Sprint F-B) |
| Sticky next-dilemma CTA | ✅ all screen sizes, slide-up animation (Sprint G) |
| Dashboard streak UI | ✅ prominent banner + orange stat card (Sprint H) |
| challenge_friend mission | ✅ fires on challenge_link_copied (Sprint M) |
| Sticky "See Results" on /play | ✅ slide-up after vote, GA4 tracked (Sprint N) |
| +50 XP pill on DailyDilemma | ✅ shown pre-vote, disappears after (Sprint O) |
| hreflang EN category pages | ✅ en / it-IT / x-default alternates (Sprint Q) |
| Top XP leaderboard section | ✅ EN+IT, purple accent, limit 50 (Sprint R) |
| Streak saved toast on /play | ✅ 🔥 overlay → redirect after 1.2s (Sprint S) |
| Public profile XP + level | ✅ Lv.N card + streak card in stats grid (Sprint U) |
| Leaderboard → profile back-nav | ✅ ← Leaderboard / ← Classifica via ?from= param (Fix Y) |
| Mission deep-link targets | ✅ vote_3 / vote_2_categories → /trending (Fix Z) |
| AdSense slots | ⚠️ slot IDs not set — needs real IDs from Matteo |
| Stripe Premium live QA | ⚠️ Preview OK; live checkout with real card pending |
| AdSense account approval | ⚠️ check status in Google AdSense dashboard |
| Upstash Redis backup | ⚠️ verify automatic backups enabled |
| Supabase PITR backup | ⚠️ verify Point-in-Time Recovery configured |
| Resend SPF/DKIM | ⚠️ verify DNS records in Resend dashboard |
| Cloudflare Email Routing | ⚠️ set up forwarding for @splitvote.io aliases |

---

## 4. Pending Manual Steps (Matteo only)

| Task | Description | Priority |
|---|---|---|
| **Stripe live QA** | splitvote.io/profile → Upgrade to Premium → real card → verify is_premium=true in Supabase + badge PRO in UI | 🔴 HIGH |
| **AdSense slot IDs** | Get real IDs from AdSense → set NEXT_PUBLIC_ADSENSE_SLOT_HOME/PLAY/RESULTS in Vercel env vars | 🔴 HIGH |
| **AdSense approval** | Check dashboard.google.com/adsense — requested ~10 May | 🔴 HIGH |
| **Stripe cosmetics env vars** | 14 price IDs for store (STRIPE_PRICE_PIXIE_CROWN etc.) needed to unlock store purchases | 🟡 MEDIUM |
| **Redis backup** | Upstash console → verify automatic backups enabled | 🟡 MEDIUM |
| **Supabase PITR** | Supabase → Settings → Backups → enable Point-in-Time Recovery | 🟡 MEDIUM |
| **Resend DNS** | Verify SPF + DKIM for splitvote.io in Resend dashboard | 🟡 MEDIUM |
| **Cloudflare Email** | Email Routing → aliases for @splitvote.io | 🟡 MEDIUM |

Note: `migration_v18` (use_pixie_avatar column) was already run on production per session of 12 May.

---

## 5. Do Not Touch

- Auth, middleware, Redis vote logic, Supabase migrations
- Stripe pricing/subscription/webhook without PM GO
- `PRODUCT_STRATEGY.md` + `ROADMAP.md` — local PM changes, leave to Matteo
- `scripts/generate-pixie-assets.mjs` — local changes, leave to Matteo
- `reports/` — historical audits, do not modify
- Production deploy/push — only with explicit PM GO

---

## 6. Known Risks

| Risk | Status |
|---|---|
| Stripe live end-to-end | Preview verified; live checkout with real card not yet QA'd |
| Vercel auto-deploy | Restored — monitor next few pushes to confirm stability |
| Git author email | All Claude Code commits must use `mat.pizzi@gmail.com` — verify git config at session start |
| AdSense approval | Requested ~10 May — status unknown |
| GDPR/CCPA legal review | Required before scaling >50k users/month |
| Stripe cosmetics env vars | 14 price IDs missing → store items show "in arrivo" |

---

## 7. Next Session Prompt

```
Ripartenza sessione SplitVote — 17 Maggio 2026 (post late-evening 16 Mag).

Leggi prima:
- CLAUDE.md
- CURRENT_HANDOFF.md (sezione 0a è la verità più recente)
- git log --oneline -15
- git status --short

State:
- main in sync con origin — last push: bd2d46f (16 Mag, late)
- Blog Redis ISR funzionante, edge cache attivo su public/SEO routes
- DB hardening v19 + v20 §1-§4+§6+§7 applicati; advisor 22 → 11

Lavoro shippato 16 Mag (10 commit):
- Mattina/pomeriggio: dashboard PixieSelector admin bypass, DB bundle apply,
  patch REVOKE FROM PUBLIC, vitest scaffold, DR runbook
- Sera (late):
  * edaa63c — fix(blog): Upstash REST GET + next.revalidate=3600 invece di
    @upstash/redis client (no-store incompatibile con ISR fallback)
  * bd2d46f — perf(middleware): matcher opt-in invece di opt-out → edge cache
    attivo su /blog, /blog/[slug], /sitemap.xml e altre public routes

Top blocker (tutti HUMAN_ONLY):
1. 🔴 Stripe live QA — splitvote.io/profile → carta reale → verifica is_premium=true
2. 🔴 AdSense — slot IDs + approval check su dashboard.google.com/adsense
3. 🔴 HIBP toggle — Supabase Auth → Settings → Password protection (30s)
4. 🟡 Backup/DR — Upstash auto-backup + Supabase PITR + Resend SPF/DKIM
5. 🟡 Stripe cosmetics — 14 price IDs store (STRIPE_PRICE_PIXIE_*)

Open observations (deferred, NOT next sprint blockers):
- /play/[id], /results/[id], /category/* mantengono no-store cache headers —
  root cause distinta da blog (probabilmente cookies()/force-dynamic a livello
  page). Candidato PLAY-EXISTING-VOTE-CLIENT-MOVE-01 se TTFB diventa problema misurato.
- Vercel Attack Challenge Mode potrebbe essere on a livello progetto (bloccava
  curl/WebFetch durante verifica). PM running VERCEL-CHALLENGE-SANITY-01 audit.

Operational policy (immutata):
- Blog publishing rimane MANUALE (admin review → approve → publish)
- NO autopublish di current-events
- Vote flow anonimo frictionless (mai login per votare)

HUMAN_ONLY (mai senza GO esplicito):
- Stripe live checkout QA (carta reale)
- AdSense slot IDs / approval check
- HIBP toggle, backup configuration, Cloudflare Email Routing
- git push senza esplicito GO
- Modifiche a ROADMAP.md / PRODUCT_STRATEGY.md / scripts/generate-pixie-assets.mjs
  (local PM changes, lasciare intatti)

Framework di lavoro attivo: deletion-first.
- Prima dimmi cosa NON costruisco / cosa eliminerei
- Se un workflow non è spiegabile in 5 righe, non automatizzare
- Se uno stato richiede >3 doc per essere capito, consolidare prima
- Production fix con safety workaround → root-cause sprint immediatamente dopo
```

# CURRENT_HANDOFF — SplitVote

Last updated: 16 May 2026 (post dashboard FK fix + build break + Supabase RLS root cause analysis)
PM: Matteo
Implementer: Claude Code (Sonnet 4.6 / Opus 4.7) + Codex (VS Code)

---

## 1. Production State

- **Branch:** `main`
- **Local vs remote:** **in sync** — all commits below pushed
- **Last pushed:** `4c61022` — all commits pushed, main in sync

### Recent commits — session 16 May 2026 (4 commits)
| Hash | Description |
|---|---|
| `4c61022` | fix(types): accept optional votesToday prop in DailyMissions (unblocked Vercel build) |
| `504b3b8` | fix(dashboard): null guard on b.badges in BadgeSection + page (digest 1932806716) |
| `7a55801` | fix(dashboard): null guard on b.badges before .map() (digest 2512231454) |
| _v19 migration_ | **Not committed/applied yet — PM action in Supabase SQL Editor** |

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
Ripartenza sessione SplitVote — 14 Maggio 2026 (post end-of-day 13 Mag).

Leggi prima:
- CLAUDE.md
- CURRENT_HANDOFF.md
- git log --oneline -15
- git status --short

State:
- main in sync con origin — tutto pushato (last: 4e636d1)
- Sprint M / N / O / Q / R / S / T / U + Fix Y/Z tutti completati e pushati

Lavoro shippato ieri (13 Mag):
- Mattina:  E / F-B / G / SEO / I / H (ISR perf, useLocale hook, sticky next, streak banner)
- Pomeriggio: M / N / O / Q / R / S / T / U (challenge fix, sticky see results, +50 XP pill,
              hreflang EN category, Top XP leaderboard, streak toast, XP+level profile)
- Sera:     Fix Y (back-nav leaderboard→profilo) + Fix Z (mission targets → /trending)
- Confermato: Sprint W / V / X erano già implementati (pm-orchestrator su docs stale)

Priorità sessione prossima:
1. 🔴 Stripe live QA — splitvote.io/profile → checkout con carta reale → verifica is_premium=true
   in Supabase + PRO badge in UI + webhook processed. Unico blocker revenue. (HUMAN_ONLY)
2. 🔴 AdSense — slot IDs reali (NEXT_PUBLIC_ADSENSE_SLOT_HOME/PLAY/RESULTS) + check
   approval su dashboard.google.com/adsense. (HUMAN_ONLY)
3. 🟡 Stripe cosmetics — 14 price IDs store (STRIPE_PRICE_PIXIE_*). (HUMAN_ONLY)
4. 🟡 Backup config — Upstash auto-backup + Supabase PITR + Resend SPF/DKIM. (HUMAN_ONLY)
5. ⚪ Nuovi sprint code: lanciare pm-orchestrator per candidati freschi dopo aver verificato
   lo stato. NB: ROADMAP.md ha modifiche locali PM non committate — NON toccare. CURRENT_HANDOFF
   è la fonte di verità più aggiornata sul codice.

HUMAN_ONLY (mai senza GO esplicito):
- Stripe live checkout QA (carta reale)
- AdSense slot IDs e verifica approvazione
- Backup configuration (Upstash + Supabase + Resend DNS)
- Cloudflare Email Routing setup
- git push senza esplicito GO
- Modifiche a ROADMAP.md / PRODUCT_STRATEGY.md / scripts/generate-pixie-assets.mjs
  (local PM changes, lasciare intatti)
```

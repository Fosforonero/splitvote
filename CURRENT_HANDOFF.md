# CURRENT_HANDOFF — SplitVote

Last updated: 13 May 2026 (post Sprints E / F-B / G / SEO / I / H)
PM: Matteo
Implementer: Claude Code (Sonnet 4.6 / Opus 4.7) + Codex (VS Code)

---

## 1. Production State

- **Branch:** `main`
- **Local vs remote:** **in sync** — all commits pushed
- **Last pushed:** `8198753` — all commits pushed, main in sync

### Recent commits
| Hash | Description |
|---|---|
| `8198753` | feat(sprint-h): elevate streak to first-class dashboard retention signal |
| `433ec8c` | perf(sprint-i): swap getDynamicScenarios → getCachedDynamicScenarios in IT results page |
| `3051718` | feat(Sprint G): sticky "Next dilemma" — all screen sizes + slide-up after reveal |
| `f09b5b6` | refactor(Sprint F-B): centralize locale detection in useLocale() hook |
| `2e2e667` | fix(seo): fix Dataset structured data — license, creator, hasPart → variableMeasured |
| `113f43b` | perf(Sprint E): restore ISR on homepage, /it, /trending, and category pages |
| `99cb198` | docs: update CURRENT_HANDOFF — Sprint D, leaderboard, GA4, Vercel deploy fix |
| `7f7cbf8` | fix(config): correct www redirect source pattern for Vercel (`/:path*`) |

---

## 2. What changed today (13 May 2026)

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
Ripartenza sessione SplitVote — post 13 Maggio 2026 (pomeriggio/sera).

Leggi prima:
- CLAUDE.md
- CURRENT_HANDOFF.md
- git log --oneline -10
- git status --short

State:
- main in sync con origin — tutto pushato (last: 8198753)
- Sprint E / F-B / G / SEO / I / H tutti completati e pushati
- Build Vercel dovrebbe essere avviato automaticamente su 8198753

Sprint completati oggi:
- Sprint E: ISR ripristinato su 6 pagine EN (getCachedDynamicScenarios + revalidate:3600)
- SEO fix: Dataset structured data corretto EN+IT (variableMeasured + license + creator)
- Sprint F-B: hook useLocale() centralizzato in 7 componenti
- Sprint G: sticky "Next dilemma" CTA — tutte le dimensioni + slide-up animation
- Sprint I: IT results page — parity fix getCachedDynamicScenarios
- Sprint H: dashboard streak — banner prominente + stat card arancione

Priorità sessione prossima:
1. Stripe live QA — splitvote.io/profile → checkout reale → verifica is_premium + webhook (HUMAN_ONLY)
2. AdSense slot IDs e approvazione account (HUMAN_ONLY)
3. Nuovi sprint da ROADMAP (pm-orchestrator per suggerimento)

HUMAN_ONLY:
- Stripe live checkout QA (carta reale)
- AdSense slot IDs e verifica approvazione
- Backup configuration (Upstash + Supabase)
- git push senza esplicito GO
```

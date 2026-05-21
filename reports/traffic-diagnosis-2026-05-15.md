# SplitVote — Traffic Diagnosis & First Acquisition Baseline

**Date:** 2026-05-15
**Author:** Claude (sprint: Traffic Diagnosis)
**Scope:** identify whether the traffic problem is tracking, indexing, ranking or distribution; close the obvious technical SEO gaps in this sprint.

---

## TL;DR

- **Tracking**: GA pageview pipeline (`components/GAPageView.tsx`) is correctly wired but **silently no-ops** when `gtag` is absent (cookie consent declined, ad-blocker, GA proxy blocked). Real status is **unknown until Matteo opens the GA4 Realtime tab** in production and compares with Vercel Analytics.
- **Indexing readiness**: robots.txt, sitemap.xml and JSON-LD all look healthy in code. The blocker is likely on Google's side (property setup, sitemap submission, indexing requests) — see Search Console checklist below.
- **Ranking**: probably premature. Domain has too few external signals for any organic ranking to stabilise yet. First milestone is just "pages get indexed and acquire impressions".
- **Distribution**: SplitVote has zero outbound channels active beyond static SEO. No social pipeline running, no inbound links seeded.
- **One real bug found and fixed in this sprint**: the EN + IT **home pages** were still routing dynamic scenario reads through the Next.js Data Cache (`getCachedDynamicScenarios`) — the exact same pattern the May fix `76ad684` had killed on the other 4 discovery surfaces. With cache divergence between Vercel nodes, the home could silently serve `0` dynamic dilemmas to a crawler hit. This is now fixed for both homes.

---

## 1. robots.txt — Audit

Source: [app/robots.ts](../app/robots.ts)

| Check | Status |
|---|---|
| Allows `/` for all user agents | ✅ `allow: '/'` |
| Blocks `/api/`, `/api/cron/` | ✅ |
| Blocks `/admin/`, `/dashboard`, `/profile`, `/submit-poll`, `/reset-password`, `/offline`, `/u/` | ✅ |
| Sitemap URL declared | ✅ `Sitemap: https://splitvote.io/sitemap.xml` |
| `host:` set | ✅ `https://splitvote.io` |
| `/leaderboard` and `/it/leaderboard` allowed | ✅ (not in disallow list) |
| `/blog`, `/it/blog` allowed | ✅ |
| `/category/*`, `/it/category/*` allowed | ✅ |
| Topic landing pages allowed | ✅ |

**No fix needed.**

---

## 2. sitemap.xml — Audit

Source: [app/sitemap.ts](../app/sitemap.ts)

| Surface | Included? |
|---|---|
| Home `/` + `/it` | ✅ |
| Trending `/trending` + `/it/trending` | ✅ |
| Leaderboard `/leaderboard` + `/it/leaderboard` | ✅ |
| Personality `/personality` + `/it/personality` | ✅ |
| Pixie `/pixie` + `/it/pixie` | ✅ |
| Store `/store` + `/it/store` | ✅ |
| About `/about` + `/it/about` | ✅ |
| FAQ `/faq` + `/it/faq` | ✅ |
| Privacy / Terms (EN + IT) | ✅ (priority 0.3) |
| Blog index `/blog` + `/it/blog` | ✅ |
| Blog articles (static) — `allPosts` mapped | ✅ |
| Blog articles (published drafts from Redis `blog:published`) | ✅ |
| SEO landing pages (`/moral-dilemmas`, `/would-you-rather-questions`, IT counterparts) | ✅ |
| Programmatic topic landing pages — EN (`getIndexableTopics`) | ✅ |
| Programmatic topic landing pages — IT (`getIndexableITTopics`) | ✅ |
| Category hubs (8 × EN, 8 × IT) | ✅ |
| Static scenarios `/play/<id>` and `/results/<id>` (EN + IT) | ✅ |
| Approved AI scenarios (locale-aware URLs) | ✅ |
| `lastmod` used | ✅ (real `approvedAt`/`generatedAt` for dynamic; `post.date` for blog; `now` for static hubs) |
| Drafts excluded | ✅ (`s.status === 'approved' || s.status === undefined`) |
| No `/api/`, `/admin/`, `/u/`, `/dashboard`, `/profile`, `/reset-password` | ✅ (none referenced) |

**No fix needed.** Sitemap is the most polished part of the SEO surface.

> Minor optimisation candidate (not done in this sprint): the static category/hub URLs use `lastModified: now` which means every regeneration changes lastmod. Search engines tolerate this but pure ETag stability would be marginally better. Not blocking.

---

## 3. Homepage locale isolation — Audit + Fix

### Audit

| Check | EN home (`app/page.tsx`) | IT home (`app/it/page.tsx`) |
|---|---|---|
| Filters dynamic scenarios by `locale === 'en'` / `'it'` | ✅ `(...).filter(s => s.locale === 'en')` | ✅ `.filter((d) => !staticIds.has(d.id) && d.locale === 'it')` |
| Renders static scenarios in correct locale | ✅ raw `scenarios` (EN-native) | ✅ `scenarios.map(translateScenarioToItalian)` |
| `PersonalityTeaser` locale prop | ✅ `locale="en"` | ✅ `locale="it"` |
| `VotedDilemmaCard` / `DilemmaGrid` locale | ✅ `locale="en"` everywhere | ✅ `locale="it"` everywhere |
| Metadata canonical / OG locale | ✅ EN canonical, `x-default` to EN | ✅ IT canonical, alt EN, OG `it_IT` |

**No locale leak.** Google will not see IT scenarios on the EN home or vice versa.

### Fix applied in this sprint

Both homes were still routing dynamic reads through `getCachedDynamicScenarios` (Next.js Data Cache wrapper). The May P1 fix `76ad684` had eliminated this same pattern on `/trending`, `/it/trending`, `/category/[c]`, `/it/category/[c]` — but **the two home pages were left behind**. Same class of bug: cache divergence between Vercel nodes can serve `[]` from some regions while others have populated data.

**Changes (this sprint):**

- [app/page.tsx](../app/page.tsx)
  - Import `getFreshDynamicScenarios` (was `getCachedDynamicScenarios`)
  - `export const revalidate = 3600` → `export const dynamic = 'force-dynamic'`
  - Call site updated
- [app/it/page.tsx](../app/it/page.tsx)
  - Same three changes mirrored

Pages now match the post-`76ad684` pattern: `noStore()` + direct Redis read on every request. Same trade-off as before (no ISR, fully dynamic SSR; vote counts still cached via `getCachedVotesBatch`).

---

## 4. Tracking sanity — Status

### Code review

[components/GAPageView.tsx](../components/GAPageView.tsx) (29 lines):

```tsx
window.gtag?.('event', 'page_view', { page_path, page_location, page_title })
```

- Subscribed to `pathname` + `searchParams` change via `usePathname()`/`useSearchParams()`. ✅
- Optional-chaining `?.` means if `gtag` is undefined, the call is a no-op. **No error, no log.**
- `gtag` is loaded by the consent layer (see [components/CookieConsent.tsx](../components/CookieConsent.tsx)), only **after analytics consent is given**.

### Plausible failure modes (untested in this sprint — all need manual check)

| Failure mode | Symptom | How to check |
|---|---|---|
| User declines consent | No `page_view` ever fires | GA4 Realtime tab shows 0 active users |
| Ad-blocker / privacy extension | First-party GA proxy `/api/ga/script` blocked | DevTools → Network → filter `gtag` |
| GA proxy route 5xx in production | Same as ad-blocker | Vercel logs for `/api/ga/script` and `/api/ga/g/collect` |
| `NEXT_PUBLIC_GA_ID` mismatch | Events flow but to wrong property | View Source on home, search for `G-...` |
| Vercel Analytics counts but GA doesn't | Suggests consent gating problem | Compare absolute pageview numbers between the two |

### Recommendation

**No code change in this sprint.** The wiring is correct; the question is operational. Matteo should:

1. Open https://splitvote.io in incognito → accept cookie consent → wait 60s.
2. Check **GA4 → Realtime** — expect 1 active user.
3. Compare with **Vercel Analytics → Realtime** for the same minute.
4. If GA4 = 0 and Vercel ≠ 0: the consent path or proxy is broken.
5. If both = 0: deeper problem — check that the layout actually loads GA.

If the gap is confirmed in step 4, a follow-up sprint can add a small admin-only diagnostic (e.g. `/api/admin/ga-debug` that returns the last 10 `gtag` invocations seen server-side via the proxy). Out of scope here.

---

## 5. Search Console manual checklist — for Matteo

> All of these are HUMAN_ONLY actions. Claude cannot perform them.

### 5a. Property setup

- [ ] Open Search Console: https://search.google.com/search-console
- [ ] Add a **Domain property** for `splitvote.io` (not URL prefix). Verify via DNS TXT.
  - Domain property is preferable because it aggregates `www` + non-www + `https://` automatically.
- [ ] Confirm the green "Ownership verified" check.

### 5b. Sitemap submission

- [ ] Search Console → **Sitemaps** → Add new sitemap → paste `sitemap.xml` → Submit.
- [ ] Wait 24–48h. Expected outcome: "Success" status, ~250–400 discovered URLs.
- [ ] If "Couldn't fetch": curl the sitemap from a non-EU IP if possible, or check that Vercel is not serving 4xx to Googlebot user-agent.

### 5c. URL Inspection (priority order)

Run **URL Inspection** + **Request Indexing** on each:

1. `https://splitvote.io/`
2. `https://splitvote.io/blog/trolley-problem-explained`
3. `https://splitvote.io/it/blog/bioetica-quando-la-medicina-impone-scelte-impossibili`
4. `https://splitvote.io/moral-dilemmas`
5. `https://splitvote.io/ai-ethics-dilemmas`
6. `https://splitvote.io/it/dilemmi-morali`
7. `https://splitvote.io/category/morality`
8. `https://splitvote.io/it/category/morality`
9. `https://splitvote.io/play/trolley`
10. `https://splitvote.io/it/play/trolley`

For each: confirm "URL is on Google" or, if not, click "Request Indexing" (rate-limited to ~10/day).

### 5d. Performance dashboard reading

After 48–72h with the sitemap submitted:

- **Search Console → Performance → Search results**:
  - Date range: last 7 days.
  - Note **impressions**, **CTR**, **average position**.
  - Note top 10 **queries** — are they branded (`splitvote`) or generic (`trolley problem`, `moral dilemmas`)?
  - Note top 10 **pages** — is the home dominating, or do blog/category pages show up?
  - Note **country** distribution — IT vs US vs other.
- **Pages tab** → check **"Indexed" vs "Not indexed"** breakdown. Click "Not indexed" to see exclusion reasons (Soft 404, Crawled — currently not indexed, Discovered — currently not indexed, etc.). Each reason has a different remediation.

### 5e. Coverage health

- [ ] Search Console → **Pages** → look for any "Excluded" reason involving:
  - `Page with redirect`
  - `Duplicate without user-selected canonical`
  - `Soft 404`
  - `Crawled — currently not indexed`
- [ ] If "Duplicate without user-selected canonical" appears for `/it/...` URLs, confirm hreflang reciprocity is correct. (Current code reciprocates hreflang correctly on play/results/blog.)

---

## 6. Hreflang / canonical / noindex check

| Surface | Canonical | hreflang reciprocity | noindex? |
|---|---|---|---|
| `/` | ✅ `https://splitvote.io/` | ✅ EN ↔ `/it`, `x-default` to EN | ❌ no noindex |
| `/it` | ✅ `https://splitvote.io/it` | ✅ IT ↔ `/`, `x-default` to EN | ❌ no noindex |
| `/blog/[slug]` | ✅ self | ✅ EN ↔ IT via `alternateSlug` | ❌ |
| `/it/blog/[slug]` | ✅ self | ✅ IT ↔ EN via `alternateSlug` | ❌ |
| `/[topicSlug]` | ✅ self | EN only (IT topic route not implemented) | Conditional noindex (low-content gate). Watch for "Crawled — not indexed" in GSC. |
| `/it/[topicSlug]` | ✅ self | IT only | Same |
| `/play/[id]` / `/results/[id]` | ✅ self | ✅ EN ↔ IT | ❌ |
| `/category/*` | ✅ self | Not reciprocated to IT (gap, see below) | ❌ |
| `/it/category/*` | ✅ self | Not reciprocated to EN | ❌ |

### Issue found (not fixed in this sprint)

`app/category/[category]/page.tsx` generates `alternates.canonical` but no `languages` map → no reciprocal hreflang to `/it/category/<c>`. Conversely, `app/it/category/[category]/page.tsx` does declare `alternates.languages.en`/`x-default` (line 47–53 read earlier in this session).

**Action**: add `alternates.languages` to EN category metadata so hreflang is reciprocal. Small (≤5 lines per file). Candidate for next micro-sprint. Not done here to keep scope tight.

---

## 7. Analytics status

| Layer | Status (untested) | Notes |
|---|---|---|
| GA4 via first-party proxy (`/api/ga/script`, `/api/ga/g/collect`) | ⚠ Unknown | Code present, consent-gated. Needs realtime check. |
| Vercel Analytics (`@vercel/analytics`) | Presumed working | Should always work — not consent-gated for aggregate counts. |
| AdSense (script direct from `pagead2.googlesyndication.com`) | Presumed working | But hidden behind `noAds = false` only for free users; pending AdSense review approval before any real revenue. |
| Cookie Consent banner | Present | `components/CookieConsent.tsx` (266 lines). Drives GA load. |

---

## 8. Indexing assumption check

Without Search Console data we can only reason indirectly. Quick check via **`site:splitvote.io`** in Google:

- If results count is **0**: domain not yet indexed → property + sitemap submission urgent.
- If results count is **1–20**: only home + a handful of pages indexed → sitemap submission + URL Inspection on key pages will help.
- If results count is **20–200**: indexing OK, ranking is the real bottleneck.
- If results count is **> 200**: indexing is fine; problem is CTR / position / distribution.

**Action**: Matteo, run `site:splitvote.io` from a fresh incognito tab and report the approximate result count.

---

## 9. Likely root causes ranked

Without Search Console + GA data this is a hypothesis tree, not a diagnosis. Most likely first.

1. **Domain still young / minimal external signals** — 0 backlinks → low crawl priority → low impressions. *Standard for any new domain in months 1–4.* Time + linking is the only fix.
2. **Sitemap may not have been submitted to GSC yet** — discovery relies on crawl-from-link, slower. (Fix: 5b above.)
3. **Cache divergence on home pages** — Google may have hit a node serving 0 dynamic dilemmas → seen the home as "thin content" → not promoted in the index. (Fixed in this sprint.)
4. **GA pipeline silently failing on the user side** — possible, but doesn't affect impressions or rankings; only affects what Matteo sees in dashboards.
5. **Italian SEO competition is dense for "dilemmi morali"** → IT side will be harder than EN; this is structural, not a bug.
6. **AdSense conditional rendering on home** — irrelevant for SEO, mentioned for completeness.

---

## 10. Ten prioritised actions

| # | Action | Owner | Type | Status |
|---|---|---|---|---|
| 1 | Submit `sitemap.xml` in Search Console (domain property `splitvote.io`) | Matteo | Manual | Pending |
| 2 | Run URL Inspection + Request Indexing on the 10 priority URLs in §5c | Matteo | Manual | Pending |
| 3 | Extend cache bypass to EN + IT home (avoid stale dynamic state) | Claude | Code | ✅ Done in this sprint |
| 4 | Verify GA4 Realtime sees pageviews from a fresh incognito session | Matteo | Manual | Pending |
| 5 | Compare GA4 vs Vercel Analytics pageview counts over last 24h | Matteo | Manual | Pending |
| 6 | Run `site:splitvote.io` and report indexed URL count (§8) | Matteo | Manual | Pending |
| 7 | Add reciprocal hreflang to EN category pages (`alternates.languages`) | Claude | Code | Open — next micro-sprint |
| 8 | Read GSC Performance dashboard after 72h with sitemap submitted | Matteo | Manual | Pending |
| 9 | Plan first 3 external backlinks (HN comment, Reddit r/PhilosophyofMind, IndieHackers post) | Matteo | Manual / strategy | Pending |
| 10 | Decide if GA proxy diagnostic is needed (only if GA4 vs Vercel mismatch confirmed in #5) | Matteo + Claude | Decision | Pending |

---

## 11. Out of scope (not done here)

- No new tracking endpoints added.
- No change to consent banner.
- No code-level analytics diagnostic.
- No category hreflang fix (logged as action #7 for next sprint).
- No content / linking strategy work — pure technical hygiene + manual checklist.

---

*Generated as part of sprint "Traffic Diagnosis & First Acquisition Baseline" — 2026-05-15.*

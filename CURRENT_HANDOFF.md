# CURRENT_HANDOFF — SplitVote

Last updated: 10 May 2026 (post `4fcab11` — G14 blog + mission rotation)
PM: Matteo
Implementer: Claude Code (Sonnet 4.6)

---

## 1. Production State

- **Branch:** `main`
- **Local vs remote:** **in sync** — all commits pushed
- **Last pushed:** `4fcab11`

### Recent commits
| Hash | Description |
|---|---|
| `4fcab11` | feat(blog): G14 trolley problem moral personality EN+IT |
| `f060ee8` | feat: daily mission rotation with expanded 8-mission pool |
| `dab7e5a` | feat(viral): personality OG card + dynamic share URL with archetype |
| `7bb8336` | fix(mobile): respect iOS safe-area insets on sticky HUD + FAB |
| `a6df232` | feat(mobile): sticky Pixie HUD + floating vote FAB on dashboard |
| `9850f7c` | feat(dashboard): user level pill + share-impact card |
| `58e1327` | feat(blog): G13 bystander effect EN+IT + handoff update |
| `49cf8c2` | feat(virality): profile share button + public profile card on dashboard |

### Feature state

| Feature | State |
|---|---|
| Anonymous vote flow | ✅ working |
| EN/IT routes | ✅ complete + locale-isolated |
| AdSense slots (HOME/PLAY/RESULTS) | ✅ live |
| AdSense review | ✅ requested (10 May 2026) |
| Stripe Premium config | ✅ live, QA done |
| `STRIPE_PRICE_ID_NAME_CHANGE` | ✅ set in Vercel (`price_1TQO0X6MLlYKqmclCj7yMJxb`) |
| `STRIPE_WEBHOOK_SECRET` | ✅ set in Vercel production + preview |
| Stripe Name Change QA (#46) | ✅ DONE — webhook live, endpoint responds correctly |
| Search Console sitemap | ✅ submitted — 433 pages indexed |
| Blog G1→G14 EN+IT | ✅ complete — 24 EN + 24 IT articles |
| SEO landings | ✅ 10 EN + 10 IT = 20 landings |
| **Daily mission rotation** | ✅ 8-mission pool, 3 daily + 1 special (50 XP), 7-day cycle |
| **Personality OG card** | ✅ `/api/personality-card?format=og` — 1200×630 horizontal |
| **Dynamic personality share URL** | ✅ `?archetype=X` → personalised OG on every share |
| **Mobile sticky Pixie HUD** | ✅ `MobileStickyHUD` — glassmorphism, XP bar, streak flame |
| **Mobile floating vote FAB** | ✅ `MobileFloatingVoteCTA` — bottom-right, pulse ring, safe area |
| **Level pill in dashboard hero** | ✅ Lv.N · Title · XP/XP |
| **Referral impact card** | ✅ week + all-time referral counts visible |
| **Pixie stage-6 system** | ✅ committed — Ultra Legendary (1000 votes) |
| **Pixie assets all 5 species** | ✅ committed — stage 1-6 + preview sheets |
| **Pixie premium previews** | ✅ asset-only (heart, robot) — not wired to DB/shop |
| **Pixie species selector** | ✅ committed — unlock logic, API, UI |
| **Pixie per-species XP** | ✅ committed + migration run in production |
| **Pixie share card** `/api/pixie-card` | ✅ edge SVG, species accent colours, OG on `/u/[id]` |
| **Profile share button** | ✅ Web Share API + clipboard fallback |
| AI generation (save mode) | ⚠️ unblocked technically, re-QA decision pending |

---

## 2. Mission System — current state (10 May 2026)

**Pool expanded to 8 missions:**
| ID | Title | XP | Verification |
|---|---|---|---|
| `vote_3` | Vote on 3 dilemmas | 30 | countVotesToday ≥ 3 |
| `vote_5` | Vote on 5 dilemmas | 45 | countVotesToday ≥ 5 |
| `vote_2_categories` | Explore 2 categories | 25 | categoriesVoted.size ≥ 2 |
| `vote_3_categories` | Explore 3 categories | 40 | categoriesVoted.size ≥ 3 |
| `challenge_friend` | Challenge a friend | 20 | referral_visit event today |
| `share_result` | Share a result | 15 | share event today |
| `share_and_challenge` | Share & challenge | 35 | share event + referral_visit today |
| `daily_dilemma` ⭐ | Dilemma of the Day | 50 | vote today (special — shown daily) |

**Rotation:** 3 daily missions from the 7-strong pool + 1 permanent special (`daily_dilemma`). Deterministic UTC-day index, 7-day cycle.

**XP for new IDs (`vote_5`, `vote_3_categories`, `share_and_challenge`):** direct admin-client `profiles.xp` increment (DB function `award_mission_xp` handles original 5 only).

---

## 3. Blog content inventory (10 May 2026)

**24 EN + 24 IT = 48 articles** (all SSG). SEO landings: 10 EN + 10 IT = 20 total.

**G14 (latest):** "What Your Trolley Problem Answer Reveals About Your Moral Personality"
- EN: `/blog/trolley-problem-moral-personality`
- IT: `/it/blog/problema-tram-personalita-morale`
- Links to `/personality`, `/play/trolley`, organ-harvest, self-driving-crash, innocent-juror
- Cross-links to consequentialism (G7) and what-is-a-moral-dilemma (G1)

---

## 4. Pending Manual Steps

| Task | Description | Owner | Priority |
|---|---|---|---|
| Pixie premium shop | Wire heart/robot species to Stripe, entitlement, selector | Future sprint | Low |
| Stripe checkout live QA | Manual: open `splitvote.io/profile`, click "Upgrade to Premium" | Matteo | Medium |
| Stripe live end-to-end | Full payment loop (checkout → webhook → is_premium=true) with real card | Matteo | Medium |
| AI generation re-QA | 4 dry-run scenarios; gate ≥60% accepted | Matteo | Optional |

---

## 5. Do Not Touch

- Auth, middleware, Redis vote logic, Supabase migrations
- Stripe pricing/subscription/webhook without PM GO
- `PRODUCT_STRATEGY.md` + `ROADMAP.md` — local PM changes, leave to Matteo
- `reports/` — historical audits, do not modify
- Production deploy/push — only with explicit PM GO

---

## 6. Known Risks

| Risk | Status |
|---|---|
| Pixie premium shop | Assets ready, no backend — not visible to users |
| AI save mode decision | OPENROUTER env set; re-QA gate pending |
| `<html lang="en">` on IT pages | Pre-existing, root layout not locale-scoped |
| `PRODUCT_STRATEGY.md` + `ROADMAP.md` | Local PM changes uncommitted |
| Stripe live end-to-end | Backend/webhook verified on Preview; live checkout UI not yet QA'd |

---

## 7. Next Session Prompt

```
Ripartenza sessione SplitVote — post 10 Maggio 2026.

Leggi prima:
- CLAUDE.md
- CURRENT_HANDOFF.md
- git log --oneline -8
- git status --short

State:
- main in sync con origin — tutto pushato (last: 4fcab11)
- Blog: 24 EN + 24 IT (G1→G14 completo)
- Mission pool espanso a 8, daily rotation attiva (3 daily + 1 special/50XP)
- Personality OG card con dynamic share URL (?archetype=X)
- Mobile: sticky HUD + FAB (Pixie, XP bar, streak, safe area iOS)
- Dashboard: level pill, referral impact card, profile share button
- Pixie: sistema completo (stage 1-6, 5 specie, selector, share card, OG profile)

Prossimi step autonomi suggeriti:
- G15 blog article — "Moral Emotions: When Gut Feeling Is Your Moral Compass" (Haidt, disgust research)
- Homepage personalisation teaser: nudge utenti loggati verso /personality dopo il voto
- Blog SEO audit: verificare che tutti gli articoli G1-G14 abbiano hreflang bilaterale

HUMAN_ONLY:
- Stripe live end-to-end QA (carta reale su splitvote.io/profile)
- Pixie premium shop (needs GO Stripe)
- git push
- Supabase migrations
```

# CURRENT_HANDOFF — SplitVote

Last updated: 8 May 2026 (post-push 7299607 — Mobile-First Redesign Sprints S1/S2/S5a/S5b/S5c/S6a)
PM: Matteo
Implementer: Claude Code (Sonnet 4.6)

---

## 1. Production State

- **Branch:** `main`
- **Local vs remote:** `main` is **in sync** with `origin/main`
  - HEAD: `7299607` — `merge: S5c — Sticky 'Next dilemma' CTA on mobile results page` (pushed ✅, Vercel deploying)
- **Previous verified deploy:** `0549f74` (S6a — Pixie HUD, browser QA PASS 8 May 2026)
- **Governance commit status:** `pm-orchestrator.md` added and live ✅

### Feature state

| Feature | State |
|---|---|
| Anonymous vote flow | ✅ working |
| EN/IT routes | ✅ complete |
| AdSense slots (HOME/PLAY/RESULTS) | ✅ live |
| AdSense review | ❌ **not yet requested** — manual step in AdSense dashboard |
| Stripe Premium config | ✅ corrected 29 Apr (Price ID set); live checkout QA pending |
| Dynamic discovery EN/IT | ✅ live — locale isolation PASS |
| S1 — Login icon-only button | ✅ live (`71d4c01`) |
| S2 — NavLinks 3 canonical items + active state | ✅ live (`71d4c01`) |
| S5a — Share section collapsible `<details>` | ✅ live (`78e2bac`) |
| S5b — Expert Insight collapsible | ✅ live (`9ef426a`) |
| S5c — Sticky "Next dilemma" CTA mobile | ✅ live (`7299607`) |
| S6a — Pixie HUD (streak + level in header) | ✅ live (`0549f74`) |
| pm-orchestrator agent | ✅ live in `.claude/agents/pm-orchestrator.md` |
| Blog Draft Queue | ✅ deployed and QA'd |
| Research Source Registry | ✅ internal foundation only (`lib/research-sources.ts`) |
| IT topic landing pages | ✅ live (`2dbb133`) |
| Content Seed Pack Integration v1 | ✅ pushed (`ea2a3b4`) — admin only; dry-run first |
| AI generation (save mode) | ❌ blocked — re-QA required before enabling |

---

## 2. Last Completed Work

### Mobile-First Redesign Sprints (8 May 2026) — `7299607` ✅

Full session of 6 mobile-first UI sprints executed, smoke-tested by PM, and merged to main.

**S1 + S2 — Header/Nav overhaul** (`71d4c01`):
- `components/AuthButton.tsx` — anonymous state: text button → icon-only 40×40 rounded-xl with neon-blue glow; aria-label EN/IT
- `components/NavLinks.tsx` — rewritten: 8 items → 3 canonical (Trending/My Profile/Blog in EN, Tendenze/Il Mio Profilo/Blog in IT); active state with `aria-current="page"` and color-coded border

**S5a — Share section collapsible** (`78e2bac`):
- `app/results/[id]/ResultsClientPage.tsx` — wrapped Viral Share Section + Share as Story in `<details class="group mb-8">`; added `moreShareTitle`/`moreShareSub` to EN_COPY and IT_COPY; tracks `share_more_options_toggled`

**S5b — Expert Insight collapsible** (`9ef426a`):
- `app/results/[id]/ResultsClientPage.tsx` — wrapped Expert Insight cyan card in `<details class="group mb-6">`; added `expertInsightCTA` to EN_COPY ("Read the expert analysis") and IT_COPY ("Leggi l'analisi esperta"); tracks `expert_insight_toggled`

**S6a — Pixie HUD light** (`cf82a4a` / `0549f74`):
- `components/AuthButton.tsx` — extended AuthState with `streakDays` + `xp`; SELECT updated to include `streak_days, xp`; imported `getLevelInfo` from `@/lib/missions`; Dashboard link shows 🔥{streak} + Lv {level} on sm+ (hidden on mobile)

**S5c — Sticky "Next dilemma" CTA mobile** (`6c7cc08` / `7299607`):
- `app/results/[id]/ResultsClientPage.tsx` — added `showStickyNext = !pathCategory && !!nextId` guard; `fixed bottom-0 left-0 right-0 z-40 sm:hidden` sticky bar with `bg-[var(--bg)]/90 backdrop-blur-md`; iOS safe-area-inset padding; `pb-28 sm:pb-16` on main container to prevent content overlap; tracks `next_dilemma_clicked` with `source: 'results_sticky'`

**pm-orchestrator agent** (`.claude/agents/pm-orchestrator.md`):
- 7-phase daily orchestrator: ingests CLAUDE.md/HANDOFF/git log, validates governance, emits one production-safe sprint spec. Context budget ≤25K tokens. Read-only, never writes code.
- CLAUDE.md updated: pm-orchestrator added to Specialist Agents list, session-start pairing rule added.

**Verified for all sprints:** typecheck ✅ — build ✅ — git diff --check ✅ — smoke 8/8 ✅ (PM visual review on Vercel preview)

---

### Sprint: Dynamic Discovery + Locale Consistency + Badge Fix (`9491d7a` — pushed ✅, deployed ✅)
Three micro-sprints bundled:
- `components/DilemmaGrid.tsx` — GridCard + voted badge + cookie fast path
- `app/category/[category]/page.tsx` + `app/it/category/[category]/page.tsx` — VotedDilemmaCard
- `app/it/trending/page.tsx` — IT-only pool, no EN leak
- `app/it/page.tsx` — cache divergence fix, single cache entry
- `components/DilemmaCard.tsx` — CATEGORY_LABELS_IT, "New"/"Nuovo" badge copy

### Sprint: Content Seed Pack Integration v1 (`ea2a3b4` — pushed ✅)
- `lib/content-seed-packs.ts` — 15 packs × 15 seeds; `lib/content-seed-usage.ts` — Redis tracking
- `app/api/admin/seed-draft-batch/route.ts` — seedPack mode, least-used-first selection
- `app/admin/SeedBatchPanel.tsx` — "📦 Seed pack" tab, pack selector, usage count badge

### Sprint: Italian SEO topic landing pages (`2dbb133` — pushed ✅, QA PASS ✅)
- `/it/problema-del-carrello`, `/it/dilemmi-etici-intelligenza-artificiale`, `/it/lealta-vs-onesta` live
- hreflang EN↔IT cross-linking, sitemap updated

---

## 3. Pending Manual Steps

| Step | Owner | Priority |
|---|---|---|
| Request AdSense review from AdSense dashboard → Sites → splitvote.io | Matteo | High |
| Stripe live checkout QA (real card or test card, end-to-end) | Matteo | High |
| Set `OPENROUTER_MODEL_REVIEW=openai/gpt-4o-mini` in Vercel Production, redeploy | Matteo | Before AI save mode re-QA |

### AI Generation re-QA gate (save mode blocked until this passes)
1. Vercel Production → env var `OPENROUTER_MODEL_REVIEW=openai/gpt-4o-mini`
2. Manual redeploy after setting env
3. Re-run 4 dry-run scenarios in admin panel (dryRun ON)
4. Decision matrix: ≥60% accepted + `review_err` < 20% + no template repeats → **save mode OK**

---

## 4. Active Sprint / Next Recommended Step

**Active sprint complete.** `7299607` pushed. Mobile redesign phase 1 done.

**Sprint candidates (ordered by impact):**

1. **Branch cleanup** — remove 8 stale local branches + 5 stale remote branches (all merged to main); remove 4 stale worktrees. Requires explicit GO (destructive). `stripe-preview-qa` excluded — keep until Stripe QA sprint.
2. **AdSense review request** — manual step in AdSense dashboard (1 min, high impact)
3. **Stripe live checkout QA** — end-to-end with real or test card
4. **S7 — Mobile play page polish** — vote buttons min-height 56px, option text font-size mobile, haptic-feedback hint copy
5. **Audit IT home rendering** — 173 `ai-it-*` IDs in sitemap but visibility on browser to verify (post-cache fix)
6. **AI generation re-QA** — unlock save mode after OPENROUTER_MODEL_REVIEW env set
7. **IT static scenario localization** — dilemma cards on IT pages show EN text; `lib/scenarios.ts` has no IT translations
8. **Blog cluster expansion** — bioethics, AI accountability, virtue ethics

---

## 5. Do Not Touch

Without a dedicated sprint and explicit GO:

- **Auth** — Supabase SSR, login callback, auth redirects
- **Stripe** — no changes to pricing, subscription, webhook, entitlements
- **Supabase migrations** — no schema changes
- **Redis voting logic** — `app/api/vote`, `lib/redis.ts`, `dilemma_votes`
- **Middleware** — `middleware.ts`
- **Env vars** — no changes to `.env*` files or Vercel env without PM decision
- **Legal docs** — `LEGAL.md`, privacy policy, terms — only if actual data flows change
- **Auto-publish / save mode** — blocked until re-QA passes
- **`stripe-preview-qa` branch** — contains Stripe-specific commits; do not delete
- **Production deploy/push** — only with explicit PM GO

---

## 6. Known Risks

| Risk | Status |
|---|---|
| Stale worktrees + branches | 4 stale worktrees + 8 local + 5 remote branches pending cleanup (all merged) |
| AI generation: `review_err` for IT semantic review | Probably resolved with `OPENROUTER_MODEL_REVIEW` env — not confirmed until re-QA |
| Stripe live payment: config correct but never tested end-to-end | Open |
| AdSense review not yet requested | Open |
| `<html lang="en">` on IT pages | Pre-existing; root layout not locale-scoped |
| EN dilemma card text on IT topic pages | `lib/scenarios.ts` has no IT translations — pre-existing |
| `push_*.command` git noise | `.gitignore` hides new helpers; 7 historical tracked files untouched |

---

## 7. Safe Autonomous Tasks

Tasks Claude can run without waiting for PM GO:

- `npm run typecheck`
- `npm run build`
- `npm run nightly:check`
- `npm run validate:personality`
- `npm run check:it-copy`
- `git diff --check`
- `git status --short`
- `git log --oneline`
- SEO/copy QA analysis (read-only, local report)
- Content opportunity reports (dry-run only, no DB writes)

**Never autonomously:**
- `git push`
- `git commit` (unless explicitly asked)
- deploy to Vercel
- enable save mode or auto-publish
- write to production DB (Redis/Supabase)

---

## 8. Next Session Prompt

```
Ripartenza sessione SplitVote — 9 Maggio 2026 o successivo.

Leggi prima (in questo ordine):
- CLAUDE.md
- CURRENT_HANDOFF.md
- git status --short --branch
- git log --oneline -10

State:
- HEAD main: 7299607 (S5c sticky next CTA — pushed 8 maggio, Vercel in deploy)
- Mobile redesign phase 1: S1/S2/S5a/S5b/S5c/S6a tutti live ✅
- pm-orchestrator agent: live in .claude/agents/

Prossimi step candidati (in ordine):
1. Branch cleanup (8 local + 5 remote stale, tutti merged) — chiedi GO esplicito prima di eliminare
2. AdSense review request manuale
3. Stripe live checkout QA
4. S7 — Mobile play page polish
5. AI generation re-QA (sblocca save mode)

Non toccare senza GO: auth, Stripe, migrations, Redis voting, middleware, env vars, save mode.
```

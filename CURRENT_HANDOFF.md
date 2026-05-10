# CURRENT_HANDOFF — SplitVote

Last updated: 10 May 2026 (post-push `e52dfa6` — btn-neon-blue + internal linking G4-G10)
PM: Matteo
Implementer: Claude Code (Sonnet 4.6)

---

## 1. Production State

- **Branch:** `main`
- **Local vs remote:** `main` is **ahead of** `origin/main` by 1 commit (`e52dfa6`)
  - HEAD: `e52dfa6` — `feat: btn-neon-blue class + internal linking G4-G10 EN+IT`
- **Previous pushed:** `b9e80f1` (G10 experimental moral psychology + bioethics landing EN+IT)
- **Full discovery QA verified:** 9/9 PASS (steps #86–94, 8 May 2026) — Home/Category/Trending/Admin EN+IT, sort, regressions

### Feature state

| Feature | State |
|---|---|
| Anonymous vote flow | ✅ working |
| EN/IT routes | ✅ complete + locale-isolated (verified #86–94) |
| AdSense slots (HOME/PLAY/RESULTS) | ✅ live |
| AdSense review | ✅ **requested** (Matteo confirmed 10 May 2026) |
| Stripe Premium config | ✅ live checkout QA done (Matteo confirmed 10 May 2026) |
| Dynamic discovery EN/IT | ✅ live, locale-isolated, sort verified DESC |
| Admin approve flow EN+IT | ✅ verified |
| OPENROUTER_MODEL_REVIEW env | ✅ set in Vercel + redeploy completed |
| AI generation (save mode) | ⚠️ **un-blocked technically** but pending re-QA decision matrix |
| S1 — Login icon-only button | ✅ live (`71d4c01`) |
| S2 — NavLinks 3 canonical items | ✅ live (`71d4c01`) |
| S5a — Share section collapsible | ✅ live (`78e2bac`) |
| S5b — Expert Insight collapsible | ✅ live (`9ef426a`) |
| S5c — Sticky "Next dilemma" CTA mobile | ✅ live (`7299607`) |
| S6a — Pixie HUD (streak + level header) | ✅ live (`0549f74`) |
| S7 — Mobile play page polish | ✅ live (`d59af3c`) |
| S8 — Discovery audit | ✅ deployed + 9/9 QA PASS |
| S8c — Mobile touch active states | ✅ live (`fb2b76a`) |
| pm-orchestrator agent | ✅ live in `.claude/agents/pm-orchestrator.md` |
| Blog Draft Queue | ✅ deployed and QA'd |
| IT topic landing pages | ✅ live (`2dbb133`) |
| DilemmaCard share button | ✅ live (`c25184c`) |
| Blog EN/IT parity fix | ✅ live (`a6e5c3a`) |
| G1 AI Ethics article EN+IT | ✅ live (`6ce40be`) |
| G2 Loyalty vs Honesty article EN+IT | ✅ live (`372d085`) |
| G3 Ethics Trio EN+IT | ✅ live (`98b53c2`) |
| G4 Harm Prevention article EN+IT | ✅ live (`088a37d`) |
| G5 Privacy article EN+IT | ✅ live (`025ee0f`) |
| G6 Moral Foundations article EN+IT | ✅ live (`67ff0b9`) |
| G7 Ethics theory SEO landings | ✅ live (`bff5073`) |
| G8 Bioethics article EN+IT + sources | ✅ live (`b9e80f1`) |
| G9 SEO landings privacy-ethics + moral-foundations EN+IT | ✅ live (`b9e80f1`) |
| G10 Experimental moral psychology EN+IT + bioethics landing | ✅ live (`b9e80f1`) |
| G9-refresh Internal linking G4-G10 | ✅ committed (`e52dfa6`) — pending push |
| btn-neon-blue CSS class | ✅ committed (`e52dfa6`) — pending push |
| VotedDilemmaCard on category pages (Sprint B) | ✅ already live (pre-existing) |
| canStillChange interactive affordance (Sprint C) | ✅ already live (pre-existing) |
| IT trending empty state copy (Sprint D) | ✅ already clean (pre-existing) |

---

## 2. Blog content inventory (10 May 2026)

**21 EN + 21 IT = 42 articles total** (all SSG-generated)

### EN articles
1. `what-is-a-moral-dilemma`
2. `trolley-problem-explained`
3. `why-people-love-impossible-choices`
4. `hard-would-you-rather-questions`
5. `trolley-problem-statistics`
6. `ethical-dilemmas-everyday-life`
7. `what-is-splitvote`
8. `how-anonymous-voting-works`
9. `how-to-read-splitvote-results`
10. `what-your-moral-personality-means`
11. `moral-dilemmas-examples`
12. `ai-ethics-what-40-million-people-chose` (G1)
13. `loyalty-vs-honesty-when-they-collide` (G2)
14. `consequentialism-the-greatest-good` (G3)
15. `deontology-some-things-are-always-wrong` (G3)
16. `virtue-ethics-what-would-a-good-person-do` (G3)
17. `doing-vs-allowing-harm` (G4)
18. `privacy-in-public-voting` (G5)
19. `moral-foundations-theory-why-good-people-disagree` (G6)
20. `bioethics-when-medicine-forces-impossible-choices` (G8)
21. `experimental-moral-psychology-how-science-studies-moral-intuitions` (G10)

**IT (21):** full parity — every EN article has an IT pair via `alternateSlug`.

### SEO landing pages (lib/seo-topics.ts) — 13 total

**EN (6+1):**
`/trolley-problem`, `/ai-ethics-dilemmas`, `/loyalty-vs-honesty`,
`/consequentialism`, `/deontology`, `/virtue-ethics`,
`/privacy-ethics`, `/moral-foundations`, `/bioethics`

**IT (6+1):**
`/it/problema-del-carrello`, `/it/dilemmi-etici-intelligenza-artificiale`,
`/it/lealta-vs-onesta`, `/it/consequenzialismo`, `/it/deontologia`,
`/it/etica-della-virtu`, `/it/etica-della-privacy`, `/it/fondamenti-morali`,
`/it/bioetica`

**Total:** 201 static pages (verified build 10 May 2026)

---

## 3. Last Completed Work (Session 10 May 2026 — continuation)

### Internal linking G4-G10 + btn-neon-blue (`e52dfa6`)
- **`lib/blog.ts`** — Added cross-links from 8 older EN articles and 8 IT articles to
  G4-G10 content. Targeted 1-2 CTA links per article before existing disclaimer.
  Articles updated: trolley-problem-explained, what-your-moral-personality-means,
  moral-dilemmas-examples, ai-ethics-what-40-million-people-chose,
  loyalty-vs-honesty-when-they-collide, consequentialism, deontology, virtue-ethics
  (+ IT counterparts of all 8).
- **`app/globals.css`** — Added `.btn-neon-blue` utility: `cursor: pointer; outline: none;`
  + `focus-visible` blue ring + `active: scale(0.97)` + reduced-motion override.
  Previously used in `AuthButton.tsx` without a definition.

### Verified pre-existing (no changes needed):
- **Sprint B** — VotedDilemmaCard on category pages: already in both EN and IT category pages
- **Sprint C** — canStillChange interactive affordance: already fully implemented in VoteClientPage.tsx
- **Sprint D** — IT trending empty state: already clean (no "cron"/"UTC" text)

---

## 4. Pending Manual Steps

| Task | ID | Description | Owner | Priority |
|---|---|---|---|---|
| Push `e52dfa6` to origin/main | — | `git push` — 1 commit ahead | Matteo | High |
| Stripe Name Change €0.99 | #46 | One-shot purchase price ID + webhook handler | Matteo | Medium |
| Discord OAuth | #24 | OAuth callback URL config in Discord dev portal + Supabase | Matteo | Medium |
| AI generation re-QA decision | — | Run 4 dry-run scenarios; gate ≥60% accepted + `review_err` < 20% → enable save mode | Matteo | Optional |

All HUMAN_ONLY — require credentials, env vars in Vercel, or external dashboard configuration.

---

## 5. Blog cluster gap status (post-G1→G10)

| Cluster | Article | Landing | Status |
|---|---|---|---|
| trolley-problem | ✅ 2 articles | ✅ `/trolley-problem` | STRONG |
| harm-prevention | ✅ G4 doing-vs-allowing | (folded in trolley landing) | STRONG |
| ai-ethics | ✅ G1 | ✅ `/ai-ethics-dilemmas` | STRONG |
| privacy | ✅ G5 | ✅ `/privacy-ethics` (G9) | STRONG |
| loyalty-honesty | ✅ G2 | ✅ `/loyalty-vs-honesty` | STRONG |
| moral-foundations | ✅ G6 standalone | ✅ `/moral-foundations` (G9) | STRONG |
| consequentialism | ✅ G3 | ✅ `/consequentialism` | STRONG |
| deontology | ✅ G3 | ✅ `/deontology` | STRONG |
| virtue-ethics | ✅ G3 | ✅ `/virtue-ethics` | STRONG |
| bioethics | ✅ G8 article | ✅ `/bioethics` (G10) | STRONG |
| experimental-moral-psychology | ✅ G10 article | — | RESOLVED (no landing yet) |

**All clusters fully covered.** No 🔴 gaps remain.

---

## 6. Active Sprint / Next Recommended Step

**All autonomous content sprints complete.** Blog at 21 EN + 21 IT. All MoralCluster gaps closed.

**HUMAN_ONLY — require Matteo action:**
- `git push` — 1 commit ahead of origin (`e52dfa6`)
- Stripe Name Change feature (Task #46) — when ready
- Discord OAuth (Task #24) — when ready

**PM decision needed (optional next content):**
- G11: Experimental moral psychology SEO landing page (`/experimental-moral-psychology`) — would close the last cluster without a dedicated landing
- G12: Cross-cluster article — e.g. "The science behind why we disagree on ethics" combining experimental psychology + MFT + trolley data

---

## 7. Do Not Touch

Without a dedicated sprint and explicit GO:

- **Auth** — Supabase SSR, login callback, auth redirects
- **Stripe** — no changes to pricing/subscription/webhook/entitlements without PM confirmation per task
- **Supabase migrations** — no schema changes
- **Redis voting logic** — `app/api/vote`, `lib/redis.ts`, `dilemma_votes`
- **Middleware** — `middleware.ts`
- **Env vars** — no changes to `.env*` files or Vercel env without PM decision
- **Legal docs** — `LEGAL.md`, privacy policy, terms — only if actual data flows change
- **`stripe-preview-qa` branch** — contains Stripe-specific WIP; do not delete or touch
- **`PRODUCT_STRATEGY.md`** + **`ROADMAP.md`** — currently have unstaged local changes (not by Claude); leave to PM
- **`reports/` directory** — contains historical audits; do not modify retroactively
- **Production deploy/push** — only with explicit PM GO

---

## 8. Known Risks

| Risk | Status |
|---|---|
| Stripe live payment never tested end-to-end | **Resolved** — Matteo confirmed QA done 10 May |
| AdSense review not yet requested | **Resolved** — Matteo confirmed request submitted 10 May |
| `<html lang="en">` on IT pages | Pre-existing; root layout not locale-scoped |
| EN dilemma card text on IT topic pages | `lib/scenarios.ts` has no IT translations — pre-existing |
| Save mode unblocked technically but no decision made | OPENROUTER_MODEL_REVIEW env set; re-QA gate decision pending |
| PRODUCT_STRATEGY.md + ROADMAP.md unstaged | Local PM changes uncommitted; leave to PM |
| `e52dfa6` not yet pushed | 1 commit ahead of origin — needs `git push` |

---

## 9. Safe Autonomous Tasks

Per `## Autonomous / Ralph-style Safe Tasks` in CLAUDE.md:

- `npm run typecheck` / `npm run build` / `git diff --check`
- SEO/copy QA analysis (read-only, local report to `reports/`)
- Content opportunity reports (dry-run only, no DB writes)
- Blog articles in `lib/blog.ts` (same G-sprint pattern)
- SEO landing topics in `lib/seo-topics.ts` (same G7 pattern)

**Never autonomously:**
- `git push` / deploy to Vercel
- write to production DB (Redis/Supabase)
- enable save mode or auto-publish
- modify Stripe, auth, middleware, or legal docs

---

## 10. Next Session Prompt

```
Ripartenza sessione SplitVote — 10 Maggio 2026 (sera).

Leggi prima (in questo ordine):
- CLAUDE.md
- CURRENT_HANDOFF.md ← stato aggiornato
- git status --short --branch
- git log --oneline -5

State:
- HEAD main: e52dfa6 (btn-neon-blue + internal linking G4-G10 — NON ancora pushato)
- Blog: 21 EN + 21 IT articoli (G1→G10 completi + parity)
- SEO landings: 13 totali (9 EN + 9 IT) — tutti i cluster coperti
- 201 static pages (build verificato)
- PRODUCT_STRATEGY.md + ROADMAP.md hanno modifiche locali non committed (lasciale al PM)

PROSSIMI STEP (richiedono GO):
- git push origin main (1 commit in attesa — e52dfa6)
- G11 experimental moral psychology SEO landing (opzionale — unico cluster senza landing)
- G12 articolo cross-cluster (opzionale)

HUMAN_ONLY (non blocca content sprints):
- Task #46 Stripe Name Change €0.99
- Task #24 Discord OAuth

Nessuna modifica a PRODUCT_STRATEGY.md / ROADMAP.md / LEGAL.md / CLAUDE.md senza GO esplicito.
```

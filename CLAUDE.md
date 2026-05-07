# SplitVote — Claude Code Guide

Operational guide for Claude Code agents working on SplitVote.

Keep this file short and durable. Current status belongs in `ROADMAP.md`; product direction belongs in `PRODUCT_STRATEGY.md`; legal/compliance state belongs in `LEGAL.md`.

## Project

SplitVote is a real-time moral dilemma voting platform:

`anonymous vote -> live results -> moral personality -> share loops -> gamified retention`

Current phase: soft launch -> pre-scaling.

Stripe status (29 Apr 2026): `STRIPE_PRICE_ID_PREMIUM` in Vercel Production was corrected — env var previously contained a Stripe Secret Key instead of a Price ID. Now set to the recurring monthly Price ID (`price_1TQZuO6MLlYKqmclQm57kmvI`, €4.99/month). Code was already correct (`mode: 'subscription'`). No runtime changes required. Manual live checkout QA still pending before promoting Premium to real users. See `LAUNCH_AUDIT.md` for QA runbook.

## Stack

- Next.js 14 App Router + TypeScript
- Tailwind CSS
- Supabase Auth/Postgres
- Upstash Redis for live vote counts and dynamic dilemmas
- Stripe for premium/name-change billing
- GA4 through first-party proxy
- Google AdSense
- Vercel deploy and cron
- Anthropic/OpenRouter for admin-reviewed AI content drafts

## Read First

Before planning or editing, read:

- `README.md` — setup, architecture, env vars, migrations
- `ROADMAP.md` — current sprint state and next candidates
- `PRODUCT_STRATEGY.md` — staged product direction and non-goals
- `LEGAL.md` — legal/compliance triggers and gaps
- `LAUNCH_AUDIT.md` — launch blockers and production readiness
- `CURRENT_HANDOFF.md` — latest PM handoff for the next Claude session, if present
- `DESIGN.md` — **required for every UI/UX sprint**: design tokens, component rules, copy tone, accessibility constraints, and known style ambiguities

For sprint-specific work, also read the files named in the user prompt.

## Operating Rules

- Keep voting anonymous and frictionless.
- Never require login to vote.
- Preserve EN/IT behavior unless the sprint explicitly targets i18n.
- Prefer small production-safe sprints over broad refactors.
- Do not introduce a new stack, service, dependency, or schema unless explicitly requested.
- Do not commit unrelated local files, especially untracked `push_*.command` helpers.
- If a sprint touches data processing, payments, ads, analytics, auth, AI content, public profiles, geo, UGC, or community, check `LEGAL.md` and update it only when the actual behavior changes.

## Sensitive Areas

- Vote flow: `app/api/vote`, `lib/redis.ts`, Supabase `dilemma_votes`
- Play/results pages: per-user cookies, auth, already-voted state, fresh next dilemma
- Auth redirects and login callback
- Admin APIs and service-role usage
- Stripe webhooks and entitlements
- Cookie consent, GA proxy, AdSense
- AI generation, draft approval, dynamic Redis scenarios
- Public share surfaces: do not expose a user's own vote by default
- i18n routes, sitemap, hreflang, and localized legal pages

## Anti-Regression Rules

- Anonymous voting must still work.
- Logged-in vote history, `currentVote`, and `can_change_until` must stay correct.
- "Next dilemma" must avoid already-voted questions whenever possible.
- Path params (`path`, `step`, `target`) must survive vote and results redirects.
- Share cards/captions must not reveal the user's selected vote unless explicitly designed and legally reviewed.
- Admin-only endpoints must stay server-authorized.
- Service-role keys must never reach client code.
- Do not cache play pages (`force-dynamic` required — `existingVote` is per-user server-side). Results pages: `revalidate = 60` active and proven safe (`?voted=` searchParams bypass ISR; no per-user content in cached path).
- Legal/cookie docs must match real data flows.

## Standard Commands

Use the project Node version:

```bash
nvm use
```

Common checks:

```bash
git status --short
npm run typecheck
npm run build
git diff --check
```

Content factory check when editing social content tooling:

```bash
npm run generate:social-content
```

## Workflow

1. **Audit (read-only)** — read the requested docs and all relevant files; do not edit anything.
2. Inspect `git status --short` before editing.
3. Identify unrelated local changes and leave them alone.
4. **Plan** — for non-trivial changes, present a synthetic plan and **wait for explicit GO** before implementing. Skip for single-line or clearly scoped fixes.
5. **Implement** — make the smallest safe change that satisfies the sprint.
6. Update docs only when product scope, legal/compliance behavior, launch readiness, or operational instructions changed.
7. **Verify** — run `npm run typecheck`, `npm run build`, `git diff --check`. Report any failures before proceeding.
8. **Commit and push only when the prompt explicitly asks for it.**
9. Final report: commit hash if any, files changed, verification outcome, and residual risks.

## Definition Of Done

- Scope completed without unrelated changes.
- Typecheck passes unless the prompt is docs-only and clearly says build/typecheck may be skipped.
- Production build passes for runtime changes.
- `git diff --check` passes.
- README/ROADMAP/PRODUCT_STRATEGY/LEGAL updated when relevant.
- EN/IT parity preserved where applicable.
- No secrets, no client service-role usage, no hidden data-processing change.
- Final answer states what changed, what was verified, and what remains.

## Ask Before Modifying

Ask before:

- Database migrations
- Stripe pricing, subscription, webhook, or entitlement behavior
- New tracking, cookies, analytics, or ads behavior
- Legal/privacy/terms wording with policy implications
- Public profile visibility defaults
- Geo/IP-derived location features
- Auto-publish AI content
- User-generated content monetization
- Community comments or moderation features
- Broad dependency upgrades or framework upgrades
- Large refactors outside the sprint scope

## Autonomous / Ralph-style Safe Tasks

Use this section to decide whether a task can run without PM confirmation. When in doubt, stop and ask.

**SAFE_AUTONOMOUS** — can run without GO:
- Read-only checks (typecheck, build, git diff)
- Local report generation (no writes to DB or production)
- SEO/copy QA (check-it-copy, validate-personality)
- Personality consistency validation
- Content opportunity reports (dry-run output only)
- Social content generation local-only if it does not write to DB and does not auto-publish

**SEMI_AUTONOMOUS** — propose and wait for GO:
- Content suggestions (no save/publish)
- Internal linking suggestions
- SEO cluster gap analysis
- Analytics/product recommendations

**HUMAN_ONLY** — always stop and ask:
- Auth, Supabase migrations, Redis voting logic, middleware
- Stripe pricing/subscription/webhook/entitlements
- Billing, security, legal docs, env vars
- Admin allowlist changes
- AI content save mode or auto-publish
- Git push / deploy to production

**Ralph-style loop rules (if/when loops are used):**
- Must never push.
- Must never deploy.
- Must never write to production DB.
- Must never enable save mode.
- Dry-run only unless Matteo gives explicit GO.
- Any task touching HUMAN_ONLY areas must stop and ask.

**GSD method (lightweight, integrated into existing workflow):**
- GSD = Get Stuff Done: short, scoped sprints with explicit GO gates.
- Plan → GO → Implement → Verify → Report. No BMAD project-context.md, no per-story agents.
- CLAUDE.md is and remains the master governance document.
- Ralph-style automation is limited to SAFE_AUTONOMOUS tasks only.

## Specialist Agents

Use `.claude/agents/` when a sprint benefits from a focused review:

- `security-reviewer.md`
- `seo-content-reviewer.md`
- `release-readiness-reviewer.md`
- `product-growth-reviewer.md`
- `frontend-ui-reviewer.md` — technical React/Tailwind/a11y/mobile audit; use on any sprint that modifies components, UI pages, copy layout, or motion behavior
- `backend-systems-reviewer.md` — data correctness, API contracts, Redis atomicity, caching strategy, cron idempotency, graceful degradation; use on any sprint that touches `app/api/**`, vote flow, `lib/redis.ts`, Supabase, or caching
- `mobile-app-readiness-reviewer.md` — use before any PWA, manifest, or app store sprint
- `blog-seo-editor.md` — use for new articles, existing article updates, SEO cluster audits, EN/IT content planning, internal linking blog → play/results/trending/category/landing pages
- `pm-orchestrator.md` — daily/sprint-start orchestrator: ingests CLAUDE.md/HANDOFF/git log, validates governance health, emits one production-safe sprint spec ready for PM GO. Read-only, never writes code.

These agents must read the live docs above instead of relying on stale project history.

### Agent Pairing Rules

- **UI/UX/copy sprints**: product-growth-reviewer (intent) + frontend-ui-reviewer (technical) + release-readiness-reviewer (ship gate)
- **API/vote/Redis/Supabase/caching sprints**: backend-systems-reviewer + security-reviewer (when auth, admin, or user data is touched) + release-readiness-reviewer (ship gate)
- **Session start, before any sprint kickoff**: pm-orchestrator runs first, alone, to produce Daily Start Report + Recommended Sprint. No pairing required.
- **Specialist agents are read-only** — they report findings or sprint specs, never implement changes directly.

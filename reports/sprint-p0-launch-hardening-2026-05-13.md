# Sprint P0 - Launch Hardening

Data: 13 May 2026
Owner: Matteo
Scope: stabilize SplitVote for wider soft-launch. No new product features.

## Goal

Reduce the highest production risks before increasing traffic:

- vote, Stripe webhook, missions and redirect behavior must have a minimal automated safety net;
- deploy hygiene must not silently bypass lint;
- migrations must be reconstructable in a predictable order;
- SEO/social metadata must be complete on core IT pages;
- small security hardening items from the audit must be closed.

## Non-goals

- No Next/React upgrade.
- No ISR refactor for `app/play/[id]/page.tsx`.
- No large Pixie component rewrite.
- No new monetization, quest, profile or store feature.
- No broad redesign.

## P0 Tickets

### P0-1 - Critical test harness

Files likely involved:

- `package.json`
- `vitest.config.*`
- `tests/**`
- targeted modules under `lib/**` and `app/api/**`

Tasks:

- Add a minimal Vitest setup.
- Add `npm run test`.
- Add focused tests for:
  - `safeRedirect` expected allow/block cases, including `/api`;
  - JSON-LD escaping for `</script>`;
  - admin email casing;
  - Stripe webhook duplicate event/idempotency behavior with mocks;
  - mission XP double-claim prevention with mocks;
  - vote dedup/replace behavior where practical;
  - scenario locale filtering or discovery merge behavior;
  - rate-limit tier/key behavior where practical.

Acceptance:

- `npm run test` exists and passes locally.
- Tests cover the highest-risk flows without requiring live Supabase, Stripe or Redis credentials.

### P0-2 - ESLint build gate

Files likely involved:

- `package.json`
- `eslint.config.mjs` or `.eslintrc.*`
- `next.config.js`

Tasks:

- Pick one stable path for the current Next 14 stack.
- Preferred conservative path: make lint compatible with `eslint@8` and `eslint-config-next@14.2.3`.
- Make `npm run lint` meaningful.
- Remove `eslint.ignoreDuringBuilds: true` only after lint passes.

Acceptance:

- `npm run lint` passes.
- `npm run typecheck` passes.
- `next build` no longer bypasses lint because of a known config mismatch.

### P0-3 - Migration order cleanup

Files likely involved:

- `supabase/migration_v2.sql`
- `supabase/migration_v2_safe.sql`
- `supabase/migration_v4_pixie_xp.sql`
- `supabase/migration_v4_security_hotfix.sql`
- `README.md`

Tasks:

- Confirm which `v2` file is canonical.
- Archive or clearly mark the legacy `v2` file.
- Rename or document the `v4` collision so a rebuild has a deterministic order.
- Update the README migration table.

Acceptance:

- A new developer can apply migrations in documented order without guessing.
- No two active migrations appear to share the same chronological slot.

### P0-4 - SEO/social metadata parity

Files likely involved:

- `app/it/page.tsx`
- `app/it/blog/page.tsx`
- `app/it/personality/page.tsx`
- `app/it/trending/page.tsx`
- `app/blog/[slug]/page.tsx`
- IT blog slug page if separate

Tasks:

- Add default Open Graph image and Twitter large-card image to missing IT pages.
- Add Article schema fields: `author`, `image`, `dateModified`.
- Keep EN/IT canonical and hreflang behavior unchanged.

Acceptance:

- IT pages render usable social previews.
- Blog Article schema has the minimum rich-result fields.

### P0-5 - Micro security hardening

Files likely involved:

- `lib/admin-auth.ts`
- `lib/safe-redirect.ts`
- `app/api/events/track/route.ts`
- `lib/redis.ts` or startup/config utility

Tasks:

- Normalize `ADMIN_EMAILS` and current user email with `.toLowerCase()`.
- Block `/api` as well as `/api/*` in safe redirects.
- Add explicit `scenarioId.length > 80` rejection.
- Warn in production if `RATE_LIMIT_SALT` is missing.

Acceptance:

- Unit tests exist for changed pure helpers where practical.
- No behavior change for valid users or valid redirects.

### P0-6 - Root hygiene

Files likely involved:

- `push_*.command`
- `.gitignore`
- `scripts/generate-placeholders.js`

Tasks:

- Move legacy `push_*.command` files out of root or ignore/archive them.
- Remove or document empty placeholder scripts.

Acceptance:

- `git status` root noise is reduced.
- No active deploy or QA script is lost without confirmation.

## Suggested Order

1. P0-5 micro-hardening, because tests can lock the behavior immediately.
2. P0-1 test harness and first critical tests.
3. P0-2 ESLint build gate.
4. P0-3 migration cleanup.
5. P0-4 SEO/social metadata parity.
6. P0-6 root hygiene.

## Verification Checklist

- `npm run test`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- Manual mobile QA on results page CTA:
  - inline "Next dilemma" visible: sticky CTA hidden;
  - inline CTA scrolled off-screen: sticky CTA visible;
  - reduced-motion enabled: no delayed animation dependency.

## Risks

- Stripe/webhook tests may require extracting small pure helpers to avoid brittle route-level mocks.
- Removing `ignoreDuringBuilds` may expose pre-existing lint violations and expand scope.
- Migration file renames must be coordinated with what has already been applied in production.


# SplitVote Legal & Compliance Tracker

Operational tracker for privacy, cookies, terms, ads, payments, analytics, and security/legal alignment.

This file is not legal advice. It is the project source of truth for engineering and PM follow-up. Before high-traffic launch, AdSense scaling, paid acquisition, or broad international rollout, get a qualified legal review.

Last reviewed: 20 May 2026 (Emotional Recognition Loop + retention instrumentation — no new processors, no new cookies, no new server-side persistence, no new consent surface; existing GA4 events enriched with aggregate-derived fields only)

---

## Current Status

Phase: soft launch -> pre-scaling.

Compliance posture:

- OK for controlled soft launch with low traffic and manual monitoring.
- Not ready to claim "globally compliant".
- Before scaling, reconcile policy text with the actual production implementation.
- Treat legal/compliance as a release gate whenever ads, analytics, payments, account data, AI content, or public profile features change.

**Payments — QA status**: Production uses live mode (`sk_live_...`). Stripe Preview QA executed 28 Apr 2026 on branch `stripe-preview-qa`: subscription activation, webhook lifecycle (`checkout.session.completed`, `customer.subscription.deleted`), entitlements (`effectivePremium`, `noAds`, `canSubmitPoll`), billing portal, and webhook idempotency all verified in test mode. Hosted Checkout final submit not completed via automated browser (Stripe anti-automation); requires one manual human verification. **Env var fix (29 Apr 2026)**: `STRIPE_PRICE_ID_PREMIUM` in Vercel Production contained a Stripe Secret Key (`sk_live_...`) instead of a Price ID — corrected to the recurring monthly Price ID (€4.99/month), Vercel Production redeployed. Code was already correct (`mode: 'subscription'`); no runtime changes required. **Still open before promoting Premium to real users**: (1) manual checkout UI verification on `splitvote.io/profile` — open Stripe Checkout, confirm plan shows as recurring monthly; (2) end-to-end live payment with real or controlled card not yet completed. Terms of Service already document subscription, cancellation, and 14-day refund window.

**Mobile App / Store release — future trigger**: No app store submission is planned now. When Phase 2 (Store Policy Audit) in `PRODUCT_STRATEGY.md → Mobile App Readiness` is reached, the following legal surfaces will require review and update before submission: (1) Apple App Store privacy nutrition labels and Google Play Data Safety form — require documenting all data types collected, shared, and deletable; (2) account deletion in-app flow — mandatory for both stores, must delete account + all associated data and be registered in store listing; (3) UGC moderation and report mechanism — required if user-submitted polls or public profiles are accessible in-app; (4) iOS IAP vs Stripe decision — if Apple determines that premium features (no-ads, renames, poll submission) are primarily consumed in-app, a policy decision is required before submission (IAP, web-only checkout, or feature exclusion); (5) Terms and Privacy may require updates to cover in-app purchase terms, IAP refund policy (governed by Apple/Google, not Stripe), and any new data flows introduced by the native wrapper. No public legal pages changed now.

Recent sprints:

- `Emotional Recognition Loop + Retention Instrumentation — 20 May 2026`. Six commits shipped: GA4 proxy removal (`e185caa`), Phase 1 reveal UX (`8638c96`), Phase 2.1 routing same-category affinity (`8f93c13`), sticky CTA IntersectionObserver refactor (`56dc73e`), home copy alignment (`6e03d14`), reveal-state analytics enrichment (`1384296`). LEGAL.md sprint trigger assessed per commit: **no public legal page update required**. The reveal-state enrichment in `1384296` adds four payload fields (`reveal_state`, `reveal_pct_voted`, `previous_reveal_state`, `previous_reveal_pct_voted`) to three existing GA4 events (`result_viewed`, `next_dilemma_clicked`, `share_clicked` — results-page sites only); **no new event names**; fields are derived from aggregate vote percentages already shown on the same page (not personal data); same GA4 endpoint, same Consent Mode v2 gating, no new processor, no new cookie, no new server-side persistence. The home-copy + reveal-copy + routing + sticky-bar commits are pure UX/copy/routing changes with no data-flow impact. The GA4 proxy removal (`e185caa`) was already assessed in the 19 May entry below; no LEGAL change carried over. Privacy Policy and Terms unchanged.

- `AdSense low-value remediation (Phase 1 + Phase 2) — 19 May 2026`. AdSense rejected the site for "Contenuti di scarso valore". Five commits shipped: sitemap ISR (`2776c4b`), audit report (`d3b2d9b`), Phase 1 defensive gates (`87741d5`), results vote-CTA bugfix (`c88beaf`), per-id static insights × 41 (`19a020b`). LEGAL.md sprint trigger assessed: **no public legal page update required**. The AdSense ad surface was **reduced** (`<AdSlot>` now gated on `/play/<id>` and `/results/<id>` by `hasStaticInsight(id)` and a `total >= 50` floor; `/store` + `/it/store` carry `robots: noindex, follow` and were removed from the sitemap; dynamic AI scenarios without a per-id insight are noindex). No new processors, no new tracking, no new cookies, no new user-data fields, no new analytics events. Per-id insights are author-written prose with no statistical-representativeness or scientific-proof claims (enforced by `tests/unit/static-insights.test.ts` FORBIDDEN-regex sweep against all 41 IDs in EN + IT). The vote CTA bugfix adds a `hasVoted: boolean` prop passed from server to client based on existing Supabase `dilemma_votes` rows + `sv_voted_*` cookies (both pre-existing surfaces already documented in Privacy Policy); no new data is collected or persisted. Privacy Policy and Terms unchanged.

- `Stripe Premium live checkout UI verified + Pixie/cosmetic Store one-time deferred — 19 May 2026`. PM confirmed live Stripe Checkout displays the Premium recurring monthly product correctly. Live end-to-end payment cycle (checkout → webhook → entitlement) still pending one manual human transaction. Store one-time Pixie/cosmetic purchases intentionally deferred — all 14 `STRIPE_PRICE_*` env vars remain unconfigured on Vercel Production; Store cards render the graceful "Checkout coming online soon" fallback modal as designed. LEGAL.md sprint trigger assessed: **no public legal page update required**. Payment behavior, data flows, processors all unchanged. Terms already document Premium subscription, one-time digital goods, and the EU 14-day waiver. No Privacy or Terms changes.

- `Vercel CPU mitigations — 19 May 2026`. `/api/results/[id]` short-lived edge cache (`s-maxage=15, swr=45`) and `/sitemap.xml` hourly ISR. Caching-only changes; no data-processing surface change.

- `fix: address adsense readiness blockers` — 4 May 2026. FAQ EN/IT account deletion copy updated: self-service deletion via /profile is now the primary method; privacy@splitvote.io remains available for assisted deletion. Privacy EN/IT "last updated" date bumped to 4 May 2026 (content was already correct after May 1 sprint). `/login` removed from sitemap. robots.ts expanded with disallow entries for account/private/utility paths. `/about` and `/it/about` pages created — publisher identity: "SplitVote is an independent project based in Italy." — no personal name on public page. Footer updated with locale-aware About link. Empty `google-site-verification` meta removed from layout. No data flows changed; no new tracking; no new processors. LEGAL.md sprint trigger: public FAQ and Privacy text reconciled with actual in-app behavior ✓ assessed.

- `feat: Account Deletion — in-app delete-account` — 1 May 2026. Added `DELETE /api/profile/delete-account` endpoint (server-only, auth.getUser() validation, Content-Type CSRF guard). On deletion: owned `organizations` deleted first (no ON DELETE CASCADE from organizations.owner_id), `user_polls` explicitly deleted, then `auth.admin.deleteUser(userId)` cascades `profiles`, `dilemma_votes`, `user_badges`, `mission_completions`, `user_events`, `role_audit_log.target_id`, `org_members`; `dilemma_feedback.user_id` SET NULL (aggregate rows preserved). Active Premium subscription blocks deletion — user must cancel via billing portal first. Client: "Danger zone" UI in ProfileClient with typed-confirmation gate (`DELETE`/`ELIMINA`), `min-h-[48px]` touch target, `autoCapitalize="characters"` for mobile. LEGAL.md sprint trigger: auth/account data, public profile visibility ✓ assessed. **Privacy policy reconciled (4 May 2026)**: FAQ EN/IT updated to use self-service /profile deletion as primary method; Privacy EN/IT section 7/8 already correct; "last updated" dates bumped to 4 May 2026. Stripe: `stripe_customer_id` is deleted with the `profiles` row (ON DELETE CASCADE from auth.users); Stripe retains its own payment history for accounting. No new personal data collected; no new tracking. Redis: no user-scoped keys; only short-TTL rate-limit keys (auto-expire). **Store compliance**: satisfies Apple App Store account deletion requirement.

- `feat: Role Management MVP — DB-backed role column + super_admin + audit log (+ security correction pass)` — 29 Apr 2026. Added `role` column to `profiles` table (TEXT, CHECK constraint: user/creator/moderator/admin/super_admin, default 'user'). Added `role_audit_log` table (actor_id nullable UUID — SET NULL on actor deletion, target_id UUID CASCADE, old_role, new_role, reason, created_at — no new PII). Added BEFORE UPDATE trigger to block client-side role escalation. Bootstrapped mat.pizzi@gmail.com as super_admin and genghi77@gmail.com as admin via SQL migration. New central `lib/admin-guard.ts` helper (`requireAdmin()`) — dual-check ADMIN_EMAILS (Phase 1 fallback) + DB role; used by all 11 existing admin API routes and the new roles endpoints. `GET /api/admin/roles` and `POST /api/admin/roles/assign` (super_admin only, audit non-silent: returns warning in response if audit write fails). Admin dashboard gate now uses `canAccessAdmin` (dual-check) instead of email-only. `ADMIN_EMAILS` env var remains active (Phase 1 safety net — no lockout risk). The `role` column is NOT exposed on public profiles. No change to vote flow, public profile visibility, or data collection. LEGAL.md sprint trigger: security controls that change admin access ✓ assessed — no new PII collected; role is internal access state; `role_audit_log` stores only UUID references + internal role strings; Privacy Policy and Terms unchanged.

- `docs/ops: Stripe Production Env Fix — STRIPE_PRICE_ID_PREMIUM corretta` — 29 Apr 2026. `STRIPE_PRICE_ID_PREMIUM` in Vercel Production conteneva per errore una Stripe Secret Key invece di un Price ID — corretta con il Price ID del prodotto SplitVote Premium (recurring monthly, €4.99/mese); Vercel Production redeployata. Nessuna modifica al codice runtime. LEGAL.md sprint trigger: payments / Stripe configuration ✓ assessed — nessuna variazione nel trattamento dati, nella raccolta di PII, o nella descrizione del servizio. Terms già documentano abbonamento, cancellazione e finestra rimborso 14 giorni. No Privacy or Terms update required. Residuo aperto: verifica checkout UI live + pagamento end-to-end non ancora eseguiti.

- `feat: Streak Milestones — badges streak_15 and streak_30` — 28 Apr 2026. Two new badge definitions added to `badges` table (ids: `streak_15`, `streak_30`). Badge data stored in `user_badges` — same table already in use for all other badges; no new table, no new personal data field. `user_badges` has public SELECT policy ("Anyone can view user badges") — this was already the case for all existing badges; no change to visibility defaults. Badge award is server-side only (DB function `increment_user_vote_count`, security definer); no client INSERT path. `streak_days` field pre-existed on `profiles` (migration_v3). LEGAL.md sprint trigger: auth/account data / public profile visibility ✓ assessed — badge data (id, emoji, rarity, earned_at) is consistent with existing badge visibility; no new PII collected; no Privacy or Terms update required.
- `feat: Personality v2 — 18 archetypes, Euclidean distance classifier` — 28 Apr 2026. Personality profile is calculated on-the-fly from existing `dilemma_votes` — no new personal data collected, no new DB schema, no new tracking, no zodiac/birth date. The classifier is a local computation in `lib/personality.ts`; no third-party data processor involved. LEGAL.md sprint trigger: personality-style profiling ✓ assessed — profile uses only vote choices the user already provided; no new data processing surface; no Privacy or Terms update required.
- `chore: migration v13 applied — user_polls write path fully hardened` — 28 Apr 2026. migration_v13 (`user_polls` no client UPDATE) confirmed applied and verified in Supabase production — policy "Users can update own pending polls" dropped; only SELECT policies remain ("Anyone can view approved polls" + "Users can view own polls"). `user_polls` write path is now fully server-only across all three RLS migrations (v11 Stripe idempotency + v12 INSERT hardening + v13 UPDATE cleanup). No new personal data processing; no change to public-facing behavior; no change to what data is stored. LEGAL.md sprint trigger: security controls that change data processing / admin access ✓ assessed — no Privacy or Terms update required.
- `chore: migrations v11/v12 applied + v13 RLS audit` — 28 Apr 2026. migration_v11 (`stripe_webhook_events`) confirmed applied and verified in Supabase production — Stripe webhook idempotency now active. migration_v12 (`user_polls` RLS) confirmed applied — client INSERT blocked; server-only insert enforced. Audit of remaining policies found residual `Users can update own pending polls` UPDATE policy (no client feature uses it) — migration_v13 created to drop it. No new personal data processing; no change to public-facing behavior. LEGAL.md sprint trigger: security controls that change data processing / admin access ✓ assessed — no Privacy or Terms update required.
- `feat: poll submit hardening` — 28 Apr 2026. Poll submission moved from direct client-side Supabase insert to server-side API route (`POST /api/polls/submit`). Premium/admin entitlement now enforced server-side; server sets `status='pending'` and `user_id` from auth session — client cannot influence either. Input validation (length bounds, allowlist, control-char rejection) added server-side. RLS hardening migration (v12) removes client INSERT policy on `user_polls` — direct Supabase REST API calls from non-service-role clients will be blocked. Required acknowledgement checkbox added to submission UI ("I confirm this submission follows the guidelines and understand it may be rejected"). No new personal data collected; no change to what data is stored in `user_polls`; no change to billing behavior or who can submit. LEGAL.md sprint trigger: UGC/user-submitted content monetization ✓ assessed — Terms already cover user-submitted content, editorial review, prohibited content, worldwide licence grant, and moderation (`app/terms/page.tsx` + `app/it/terms/page.tsx`). No Terms or Privacy update required.
- `feat: stripe webhook idempotency` — 28 Apr 2026. Added `stripe_webhook_events` table and idempotency helpers to prevent double-processing of Stripe retries. No new personal data collected; existing payment/subscription data handling is unchanged. The new table stores only `stripe_event_id`, `event_type`, `status`, and a sanitised error string — no PII, no payment card data, no email. LEGAL.md sprint trigger: payments / Stripe webhook behavior ✓ assessed — no privacy policy or terms update required; data processor (Stripe) and data flows are unchanged.
- `feat: polish anonymous sharing insights and content qa` — 28 Apr 2026. Share flows hardened: story card, webShareText, and instagramCaption no longer expose the user's own vote choice — all share content is now aggregate-only. PersonalityClient IT loginHref fixed. No new data collection; net privacy improvement. LEGAL.md sprint trigger: share flows that include or expose a user's selected vote ✓ resolved.
- `774c131 fix: harden redirects json-ld and api inputs` — 28 Apr 2026. Redirect safety, JSON-LD escaping, GA script proxy hardening, input bounds, reduced PII logging.
- `chore: reconcile legal consent and policy docs` — 28 Apr 2026. Granular cookie consent banner, Privacy Policy EN/IT full reconciliation, Terms EN/IT alignment, Footer cookie settings link.

Primary public legal pages:

- `app/privacy/page.tsx`
- `app/it/privacy/page.tsx`
- `app/terms/page.tsx`
- `app/it/terms/page.tsx`

Primary consent / tracking files:

- `components/CookieConsent.tsx`
- `components/Footer.tsx`
- `app/layout.tsx` (loads gtag.js directly from `googletagmanager.com`; hits go directly to `google-analytics.com/g/collect`. The former first-party proxy under `app/api/ga/script/route.ts` and `app/api/ga/g/collect/route.ts` was removed in sprint `GA4-PROXY-GEO-FIX-01` — geo was being collapsed to the edge IP. Direct loading restores correct geo; consent gating is unchanged.)
- `components/AdSlot.tsx`
- `components/AdBlockBanner.tsx`

Related docs:

- `README.md`
- `ROADMAP.md`
- `LAUNCH_AUDIT.md`
- `PRODUCT_STRATEGY.md`

---

## Known Gaps

### Cookie Consent — RESOLVED 28 Apr 2026

- [x] Banner granular: Decline / Customize / Accept All — with per-category toggles (Analytics, Advertising).
- [x] "Cookie settings" link in Footer — dispatches `sv:openCookieSettings` event, reopens banner.
- [x] Copy explicitly mentions analytics and advertising cookies.
- [x] Consent Mode v2: all four signals denied by default. GA4 operates cookieless until consent granted.
- [x] Removed false "powered by Google's CMP" claim from Privacy Policy EN.
- [x] `sv_cookie_consent` + `sv_cookie_prefs` both documented in cookie table in Privacy Policy EN/IT.

**Still open before scaled AdSense in EEA/UK/CH:**
- [ ] Google-certified TCF CMP (e.g. Cookiebot, Axeptio) — required by Google for personalized ads at scale. Custom banner is sufficient for soft launch with limited traffic. Trigger this before any paid acquisition or broad EEA advertising campaign.

### Privacy Policy — RESOLVED 28 Apr 2026

- [x] EN and IT policies fully aligned in structure and content.
- [x] All active processors documented: Vercel (hosting + Analytics), Supabase, Upstash Redis, Google Analytics 4, Google AdSense, Stripe, Resend, Anthropic, OpenRouter.
- [x] GA4 first-party proxy behavior documented: intentional `X-Forwarded-For` forwarding to Google for geo accuracy, conditioned on consent.
- [x] Account data clarified: email, display name, vote history, XP/streak/badge/mission data, referral/share events, optional demographic fields.
- [x] AI content pipeline documented: AI-generated drafts are admin-reviewed before publication.
- [x] International transfers: SCC mechanism cited for each processor.
- [x] CPRA "sharing" caveat for AdSense personalization added.
- [x] Account deletion process: `privacy@splitvote.io`.
- [x] Cookie table in both EN and IT with all storage items: `sv_cookie_consent`, `sv_cookie_prefs`, `sv_voted_*`, `sv_fb_*`, `lang-pref`, Supabase auth, `_ga/_ga_*`, Google ad cookies.

**Still open before scaling:**
- [ ] Formal DPA (Data Processing Agreement) signed or accepted with Upstash, OpenRouter, and Resend. Vercel, Supabase, Google, and Stripe have self-service DPAs.
- [ ] Privacy policy review by qualified EU counsel before >50k monthly active users.

### Terms of Service — RESOLVED 28 Apr 2026

- [x] EN and IT terms fully aligned in structure.
- [x] Account/gamification section added (XP, streak, badges, missions).
- [x] Premium subscription section: Stripe, customer portal, cancellation, 14-day refund window, consumer law carve-out.
- [x] AI-generated content section: admin-reviewed before publication.
- [x] User-submitted content section: Premium only, editorial review, worldwide licence grant.
- [x] Moderation/termination section.
- [x] Scientific representativeness disclaimer in both description and disclaimers.
- [x] No medical/legal/financial advice clause.
- [x] EU/IT consumer law carve-outs in liability and governing law sections.
- [x] Legal contact standardized: `legal@splitvote.io` in both EN and IT.
- [x] Terms IT had `hello@splitvote.io` as legal contact — corrected to `legal@splitvote.io`.

### Global Readiness

Minimum practical target before scaling:

- EU / Italy GDPR + ePrivacy cookie compliance
- UK / Switzerland Google consent requirements for AdSense
- California CCPA/CPRA baseline wording
- COPPA / minors baseline

Do not claim worldwide legal compliance from product docs alone. For Brazil LGPD, Canada PIPEDA, Australia Privacy Act, and other jurisdictions, trigger legal review when traffic or monetization justifies it.

---

## Sprint Triggers

Update this file and the public legal pages when any sprint changes:

- Cookies, localStorage, tracking scripts, analytics, AdSense, or Consent Mode
- Auth, account data, profile visibility, public profiles, badges, streaks, missions, referrals
- Payments, premium, subscriptions, refunds, Stripe webhook behavior
- Paid poll submissions, poll credits, creator/VIP tiers, or user-generated content monetization
- Email collection, transactional email, marketing email, Resend
- AI generation, content moderation, autopublish/draft approval
- Personality expansion, zodiac overlays, birth date/month collection, or personality-style profiling changes
- Geo features, country/city profile fields, approximate IP-derived location, country breakdowns, demographic fields, leaderboards
- New public locales or translated legal/cookie pages
- Share flows that include or expose a user's selected vote
- Internal comments, discussion threads, reporting, moderation, or community features
- Security controls that change data processing, IP handling, logging, rate limiting, or admin access

---

## End-Of-Day Legal Reconciliation Checklist

Run this after the last code push of the day if any relevant sprint landed:

- [ ] Read latest `git log --oneline -10` and `git status --short`.
- [ ] Review changed files touching analytics, ads, auth, payments, AI, email, cookies, or user data.
- [ ] Check `app/privacy/page.tsx` and `app/it/privacy/page.tsx` against actual processors and data flows.
- [ ] Check `app/terms/page.tsx` and `app/it/terms/page.tsx` against current monetization and user-content features.
- [ ] Check `components/CookieConsent.tsx`, `app/layout.tsx`, and `components/Footer.tsx` for consent UX and revocation.
- [ ] Update `LAUNCH_AUDIT.md` if a legal blocker changes status.
- [ ] Update `README.md` / `ROADMAP.md` only if product scope, blockers, or launch readiness changed.
- [ ] Run `npm run typecheck` and production build if legal pages/components changed.

---

## Reference Links

- Garante Privacy cookie FAQ: https://www.garanteprivacy.it/faq/cookie
- Garante Privacy cookie guidelines: https://www.garanteprivacy.it/web/guest/home/docweb/-/docweb-display/docweb/9677876
- Google EU User Consent Policy: https://www.google.com/about/company/user-consent-policy/
- Google AdSense CMP requirements: https://support.google.com/adsense/answer/13554116
- California CCPA overview: https://oag.ca.gov/privacy/ccpa

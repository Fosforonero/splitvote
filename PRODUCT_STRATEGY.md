# SplitVote Product Strategy Notes

Working PM notes for premium, user-generated polls, learning paths, social growth, gamification, and community features.

This file is intentionally strategic. Implementation prompts must still be scoped as small production-safe sprints.

Last reviewed: 30 Apr 2026 (field feedback intake — core loop clarity and roadmap reprioritization)

---

## Current Product Direction

SplitVote should evolve in this order:

1. Frictionless voting loop
2. Retention loop through identity, personality, badges, streaks, and share cards
3. Manual social/content engine
4. Premium utility and cosmetic monetization
5. Curated user-generated polls
6. Learning paths and thematic quests
7. Geo/event quests and public profile boards
8. Community discussion layer, only after moderation capacity exists

Core rule: anonymous users must always be able to vote without creating an account.

i18n expansion rule:

- EN/IT are enough for controlled soft launch.
- Do not add another language until the core loop, personality sharing, guided category paths, and social content workflow are stable.
- Next language: Spanish (`es`) because it has the best global/social expansion fit after English.
- Next after Spanish: Brazilian Portuguese (`pt-BR`) because it is stronger for social/viral growth than French for this product category.
- French (`fr`) should follow PT-BR as the next broad international language.
- Chinese should be treated as a separate localization/distribution project, not a routine translation sprint.

Current priority override:

- Fix the core loop before adding more monetization or personality complexity.
- "Next dilemma" must avoid questions the user already answered whenever possible.
- Vote changes must be obvious and low-friction.
- New field feedback priority (30 Apr 2026): users must immediately understand that SplitVote is a social voting game, why answering matters, what reward they get after answering, and why sharing a question is useful before any heavier feature work.
- Add gamified paths only after the basic fresh-question loop is reliable.
- Share should focus on questions and live aggregate results, not exposing a user's own vote by default.
- Post-vote insights are a strong retention feature; keep improving quality, specificity, and localization.
- Content QA/refuso checks are production polish, especially for AI-generated approved dilemmas.

---

## Field Feedback Intake — 30 Apr 2026

People shown the live product understood the concept only partially. The most important signal is not "add more features" yet; it is that the core loop needs clearer motivation and a sharper audience promise.

### Product Diagnosis

- The product does not yet communicate a clear enough vocation: who it is for, why people should answer dilemmas, and what emotional/social reward comes next.
- The current loop can feel like a utility poll instead of a game. Users asked for more dopamine, clearer progression, and a reason to keep answering.
- The companion/pet concept exists but is not self-explanatory enough. It should feel like a visible progress/reward mechanic, not a decorative unknown.
- Login affordance should use a conventional user/profile icon. The current door-style icon is ambiguous.
- Sharing should not wait until after the vote only. Users should be able to share a question before answering, especially from home/play/card surfaces.
- Topic discovery should move from generic categories toward audience-relevant macro areas and paths.
- Current-events dilemmas are a major content opportunity, but require editorial and legal guardrails.

### Roadmap Interpretation

Do not treat all feedback as immediate implementation. Sequence it as:

1. Close pending technical work and QA.
2. Run a read-only analytics audit so product decisions can be measured.
3. Clarify the core loop and visual language.
4. Add pre-vote question sharing.
5. Add aggregate public leaderboards.
6. Add macro-area paths for clear audiences.
7. Add current-events dilemma workflow with admin review.

### Core Loop Clarity Sprint

Goal: make the first session understandable without explanation.

Scope:

- Replace ambiguous login icon with a standard user/profile icon.
- Explain the game loop in one tight line near the primary CTA: answer dilemmas, compare with the world, grow your moral profile.
- Make XP/streak/archetype/companion rewards visible before users invest time.
- Reframe the companion as a progress companion or moral companion with clear labels and unlock logic.
- Improve home/play copy so answering feels consequential and game-like.
- Keep anonymous voting frictionless.

Out of scope:

- New DB schema.
- New reward economy.
- Paid features.
- Leaderboards.
- News automation.

### Share Question Before Vote Sprint

Goal: let users create top-of-funnel social traffic without exposing a personal vote.

Scope:

- Add a standard share icon/action on home, dilemma cards, and play page where appropriate.
- Share the question with neutral copy: "What would you choose?" / "Tu cosa sceglieresti?"
- Use Web Share API with clipboard fallback.
- Preserve EN/IT parity.
- Track only existing consent-safe analytics if already available; any new analytics event requires `LEGAL.md` check.

Out of scope:

- Auto-posting.
- Sharing the user's selected vote by default.
- New social API integrations.

### Leaderboards Direction

Leaderboards are useful, but order matters:

1. Most-voted dilemmas/topics: safest first, aggregate-only, strong discovery value.
2. Archetype leaderboard: aggregate distribution of moral archetypes, no personal ranking.
3. Voter leaderboard: later only, account-based, opt-in or privacy-reviewed, no pressure to reveal private voting behavior.

Do not launch personal voter rankings without reviewing public profile visibility, privacy controls, and legal copy.

### Macro Areas / Audience Paths

Macro areas should clarify "who this is for" and improve session intent. Start editorially before adding heavy taxonomy.

Candidate macro areas:

- Parents: children, adolescence, school, smartphones, discipline, family boundaries.
- Couples: jealousy, money, cohabitation, betrayal, family pressure.
- Work: career, colleagues, burnout, leadership, salary fairness.
- Technology: AI, privacy, automation, social platforms, surveillance.
- Society: justice, taxes, safety, immigration, public services.
- Young adults: friendship, school/university, future, social pressure, independence.

Implementation preference:

- Start with curated landing/path pages using existing category/path mechanics where possible.
- Avoid a taxonomy migration until the editorial paths prove useful.

### Current-Events Dilemmas

Recent-news dilemmas can make SplitVote feel alive, especially for Italy, Europe, USA, and world events.

Rules:

- Every current-events draft needs a source or source summary in admin context.
- Dilemmas must frame a moral/social choice, not ask users to adjudicate facts or accuse named people.
- Avoid defamatory claims, medical/legal advice, and active misinformation.
- Admin review remains mandatory before publication.
- Prefer time-bounded tags such as Italy, Europe, USA, World, and date/week labels.
- Autopublish should remain off for current-events content until quality and legal review are proven.

### AI-Assisted Localization

AI translation tooling can help, but live automatic translation should not drive public pages.

Preferred model:

- Keep public copy committed as reviewed source text.
- Use AI or a localization tool to draft translations.
- Human-review and commit approved strings.
- Consider Lokalise/Loco-style tooling only after copy is centralized enough that another locale will not multiply fragile client logic.

Do not add Spanish, PT-BR, or French until the core loop, share flow, macro paths, and analytics are stable.

### AI Generation Quality Gate

AI-generated dilemmas must pass manual admin dry-run QA before save mode is used or any batch generates drafts for the live pool.

**Required QA scenarios (run once before first save-mode batch):**

1. EN default dry run — Locale: EN, Count: 5, Mode: Default topics, Dry run ON
2. IT default dry run — Locale: IT, Count: 5, Mode: Default topics, Dry run ON
3. ALL default dry run — Locale: ALL, Count: 3/locale, Mode: Default topics, Dry run ON
4. ALL manual seed stress test — Locale: ALL, Count: 3, Mode: Manual seed, Dry run ON:
   - topic: `mandatory vaccination during a public health crisis`
   - angle: `individual freedom vs collective protection`
   - notes: `avoid real people, countries, cities, and factual claims`
   - Expected: IT result blocked by semantic review as moral mirror of EN intra-batch item

For each run record: accepted count, skipped_preflight, skipped_novelty, noveltyScore distribution, rejectionReason examples, semantic review verdicts (`novel` / `related_but_distinct` / `too_similar` / `duplicate`), and any repeating template patterns.

**Decision matrix:**

| Result | Action |
|---|---|
| ≥60% accepted, no template repeats, cross-locale blocking active | Save mode OK — controlled batches ≤ 10 items |
| Recurring trolley / organ-harvest / AI-job-loss in accepted items | Prompt tweak sprint before save mode |
| IT mirror of EN passes semantic review (Test 4 IT not blocked) | Translation preflight sprint required |
| `review_failed` verdict frequent | Deterministic dedup sprint required |

**Picoclaw automation gate:** Picoclaw cannot write drafts directly until:

1. Production dry-run QA passes (above)
2. Save mode has been used successfully by admin (at least one batch of 5, no quality issues)
3. Rejection reasons monitored across 2+ save-mode batches
4. No auto-publish without quality gates remaining active

Picoclaw Phase 1 (admin manually copies a topic into Seed Batch manual seed) requires no QA gate — it uses the existing admin seed flow with all guards active.

---

### Picoclaw / External Agent Sidecar

Picoclaw-style automation is interesting as an operational sidecar, not as a user-facing dependency in the core app.

Potential uses:

- Daily news/topic monitoring for admin-reviewed dilemma ideas.
- Reminder bot for QA, deploy checks, stale docs, and content queue health.
- Daily report on votes, top dilemmas, weak categories, and draft inventory.
- Lightweight orchestration outside Vercel runtime for research or admin workflows.

Do not integrate it into the product runtime before the core loop and content workflow are stable.

---

## Already Started / Implemented Foundations

- Anonymous voting flow exists.
- Supabase Auth exists.
- Premium subscription MVP exists via Stripe.
- Premium/admin entitlement logic is centralized in `lib/entitlements.ts`.
- Premium/admin users do not see ads through `AdSlot` entitlement checks.
- One-time paid rename flow exists.
- User dashboard/profile UX simplified (28 Apr 2026): stats show XP/streak/votes/badges; premium benefits explicit (no ads, renames, submit polls); personality CTA promoted above trophy case in profile; coming-soon block removed from profile; public profile has "Public Profile" indicator.
- Personality v2 system (28 Apr 2026): 18 moral archetypes in `lib/personality.ts` (up from 6); Euclidean distance classifier; share card API supports all 18; full EN/IT copy for each archetype. No new data collected — profile is calculated on-the-fly from existing dilemma_votes. Zodiac overlay remains future/optional.
- Public profile route exists (`/u/[id]`) with basic public stats/badges.
- XP, streaks, badges, daily missions exist at foundation level.
- Streak milestones implemented (28 Apr 2026): badges streak_7 (7d, rare), streak_15 (15d, epic), streak_30 (30d, legendary); awarded server-side in `increment_user_vote_count` DB function; progress bar in dashboard; streak stat in profile. migration_v14 ✅ Applied.
- `badges`, `user_badges`, `equipped_badge`, and `equipped_frame` already exist as DB foundations.
- OpenRouter is already used server-side for draft generation.
- AI content is draft-only with admin approval.
- Social content factory exists as local/manual workflow; no auto-posting.
- Instagram/TikTok official links exist in Footer/JSON-LD.
- Legal baseline exists in `LEGAL.md`, Privacy EN/IT, Terms EN/IT.

---

## Not Started / Not Ready Yet

- Dedicated simplified premium dashboard — ✅ basic UX done (28 Apr 2026); advanced features below still pending.
- VIP-only visual identity features such as colored names, profile frames, special avatars, text styles.
- Public profile board / bacheca with curated badges, trophies, skins, and privacy controls.
- Personality share card image generation — ✅ done (28 Apr 2026): `/api/personality-card` generates 1080×1920 PNG for all 18 archetypes EN/IT. Zodiac overlay on personality share cards remains future/optional.
- Paid user-generated poll submission — basic foundation secured (28 Apr 2026): server-side Premium enforcement, input validation, RLS hardening. Full paid workflow (per-question credits, poll analytics, submission quotas) not started.
- Tiered paid poll plans such as per-question pricing or monthly question bundles.
- Micro-learning section with thematic paths.
- Learning-path generation using OpenRouter.
- Social trend ingestion from Instagram, TikTok, YouTube, or X through official APIs/providers.
- Geo quests by country/city/neighborhood.
- Unique event trophies and trophy economy.
- Cosmetic shop / bundles.
- Discussion threads under dilemmas.
- External community integration such as Reddit.
- Full moderation/audit workflow for user-generated content.
- Spanish localization (`es`) and additional non-EN/IT locales.

---

## Internationalization Roadmap

Current state:

- English is the global default.
- Italian is implemented through the `/it` route family.
- EN/IT routes, sitemap, hreflang, blog, legal pages, personality, social captions, and core voting flows exist.

Recommended language order:

1. Spanish (`es`)
2. Brazilian Portuguese (`pt-BR`)
3. French (`fr`)
4. German (`de`) or Japanese (`ja`) only after traffic data supports it
5. Chinese Simplified (`zh-CN`) as a separate market-entry project
6. Chinese Traditional (`zh-TW`) only if there is a specific Taiwan/Hong Kong strategy

Why this order:

- Spanish has the best mix of global reach, social virality, SEO opportunity, and implementation effort.
- Brazilian Portuguese is a strong social/mobile market and a natural next growth language after Spanish.
- French adds Europe, Canada, and parts of Africa, but likely has lower immediate viral fit than Spanish/PT-BR.
- Chinese requires different SEO, social distribution, cultural review, legal review, and possibly platform strategy. Do not treat it as a simple string translation.

Spanish launch gate:

- Core voting loop stable with fresh next dilemmas.
- Guided category path MVP shipped.
- Personality share card stable.
- Social Content Factory works reliably for EN/IT.
- At least basic Search Console / social signal review from EN/IT.
- Legal pages can be translated and reviewed.

Spanish scope:

- `/es` route family:
  - `/es`
  - `/es/trending`
  - `/es/play/[id]`
  - `/es/results/[id]`
  - `/es/category/[category]`
  - `/es/faq`
  - `/es/privacy`
  - `/es/terms`
  - `/es/personality`
  - `/es/blog`
- Spanish static scenario translations.
- Spanish metadata, canonical, hreflang, sitemap entries.
- Spanish personality copy and share card copy.
- Spanish cookie banner and legal pages.
- Spanish social captions in Social Content Factory.
- Spanish blog starter set only after route quality is stable.

PT-BR launch gate:

- Spanish implementation is stable.
- Spanish content/social workflow has low maintenance cost.
- Product copy is centralized enough that adding a fourth locale does not require duplicating fragile client logic.

PT-BR scope:

- Use `pt-BR`, not generic `pt`, unless there is a Portugal-specific strategy.
- Localize tone for Brazil rather than literal Portuguese translation.
- Add Portuguese social captions after core routes work.

French launch gate:

- EN/IT/ES/PT-BR content workflows are maintainable.
- Legal pages and cookie copy can be reviewed in French.

Chinese launch gate:

- Dedicated market strategy.
- Cultural/content moderation review.
- Separate SEO/social distribution plan.
- Legal/privacy review for the target market.
- Decide `zh-CN` vs `zh-TW`; do not launch both by default.

Implementation rule:

- Add one language per dedicated sprint.
- Do not mix language expansion with product feature sprints.
- Keep legal pages and cookie consent in sync for every supported locale.
- Every locale must have reciprocal hreflang and sitemap coverage before deploy is considered complete.
- If copy starts duplicating heavily, create a locale dictionary/i18n helper before adding the fourth language.

---

## Future Role Model (Design Only — Not Implemented)

SplitVote currently has two effective roles: Admin (hardcoded email allowlist in `lib/admin-auth.ts`) and regular user. This section documents the intended future role hierarchy. **No implementation in this sprint.** Implementation requires a DB/RLS security review, legal review for any roles that can affect public content, and an audit log design.

### Role Definitions

**Super Admin**
- Owner-level. Full destructive permissions: delete dilemmas, ban users, override billing, modify role assignments.
- Intended first owner: `mat.pizzi@gmail.com`. This must NOT be hardcoded in runtime code — future implementation should use a secure DB role field or env-controlled bootstrap.
- Can assign/revoke all roles below.

**Admin**
- Operations and content management: approve/reject polls and AI drafts, access admin dashboard, manage dilemmas, view aggregate stats.
- No owner-level destructive permissions by default (cannot delete other admins, cannot modify billing config).
- Future: can be granted by Super Admin.

**Moderator**
- Review and handle UGC: review reported content, handle community comments when built, flag/remove inappropriate submissions.
- No billing config, no system settings, no AI draft generation.
- Future: necessary when comments or community features go live — moderation capacity must exist before discussion threads launch.

**Creator**
- Trusted/premium user with expanded submission and analytics privileges: higher submission quota, access to per-poll analytics, optional verified creator badge.
- No moderation or admin privileges.
- Future: relevant once paid poll submission is live and there is a creator/community growth strategy.

### Implementation Requirements (Future)

Before any runtime implementation:

- DB column `role` on `profiles` table with enum: `user | creator | moderator | admin | super_admin`. Default: `user`.
- RLS policies must restrict role-escalation: only Super Admin can set `admin` or `super_admin`; regular DB writes cannot self-elevate.
- `lib/admin-auth.ts` email allowlist approach must be replaced or extended — email-based check is acceptable for early admin only but does not scale to multiple roles.
- Audit log table required: every role assignment/revocation must be recorded with actor, target, timestamp, and reason.
- Security review required before any role with destructive permissions is exposed in production.
- Legal/terms review trigger: if Moderators or Creators can affect public content visibility, Terms must be updated to describe moderation authority and creator responsibilities.
- Do not mix role implementation with product feature sprints — dedicate a standalone Role Management sprint.

---

## Premium / VIP Direction

### Existing Premium Meaning

Premium currently means billing-backed entitlement:

- No ads.
- Premium gates available through `lib/entitlements.ts`.
- Unlimited rename behavior already exists.

### Recommended Product Split

Avoid creating too many paid concepts too early. Use one paid identity first:

- `Premium`: subscription utility + no ads + light identity perks.
- `VIP`: marketing label for Premium cosmetic/status features, not a separate billing system at first.

Do not sell pay-to-win mechanics. Paid users must not affect:

- Vote counts
- Ranking
- Visibility of opinions
- Public result weighting

### Future Premium Features

- Simplified premium dashboard — ✅ base done (28 Apr 2026):
  - ✅ no ads — benefit confirmed in dashboard copy
  - ✅ profile customization — avatar, name, demographics
  - ✅ badges/trophies inventory — trophy case in profile
  - ✅ billing/customer portal — Manage Billing button links to Stripe portal
  - [ ] submitted poll status — polls section exists but only shown when polls > 0
  - [ ] personality share card — personality page exists; card download exists; direct access from profile pending
- VIP visual status:
  - name color
  - profile frame
  - avatar style
  - profile board skin
- Premium bundles:
  - monthly subscription
  - cosmetic bundle
  - poll submission credits

Do not implement multiple pricing tiers until Stripe QA and legal review are complete.

---

## Paid Poll Submission

This is high-value but legally sensitive. Treat as a dedicated sprint after premium QA.

Recommended model:

- Only logged-in paying users can submit polls.
- Every submitted poll enters admin review.
- Nothing user-submitted is auto-published.
- The submitter must accept a clear content responsibility checkbox.
- The platform keeps audit records needed for abuse investigation and lawful requests.
- Email confirmation should go to the submitter.
- Internal notification should go to admin/support.

Initial pricing ideas to validate later:

- One-off poll credit: low-cost single submission.
- Premium monthly: small monthly allowance.
- Higher plans: more submissions per month.

Do not finalize global pricing until legal/tax/consumer-rights review is done.

### Required Content Rules

Disallow user submissions involving:

- Sexual content or minors
- Harassment or hate
- Racism, extremist ideology, or incitement
- Illegal weapons or prohibited substances
- Instructions for illegal activity
- Defamation or identifiable private persons
- Graphic violence
- Political extremism or targeted manipulation
- Health/legal/financial advice framed as professional advice

Terms/Privacy must be reviewed before launch of paid submissions.

---

## Micro-Learning / Thematic Paths

This is strategically strong if it builds on the existing dilemma format.

Recommended MVP:

- Curated paths, not open-ended courses.
- Each path is a sequence of 5-10 dilemmas around a theme.
- Each dilemma has a short neutral explanation after voting.
- Paths can be generated with OpenRouter but must remain draft-only and admin-approved.

Example paths:

- AI ethics
- Privacy vs security
- Climate choices
- Friendship and loyalty
- Justice and punishment
- Work and ambition

Do not position this as formal education or professional advice.

---

## Social Trend Research

Use trends to inspire drafts, not to scrape or copy content.

Allowed direction:

- Official APIs
- Approved providers
- Manual research
- Google Trends, news/RSS, Reddit where policy-compliant
- YouTube/Instagram/TikTok only through official APIs or compliant provider contracts

Not allowed:

- Fragile scraping
- Evading platform protections
- Copying creator content
- Auto-posting without approval

The current social content factory should remain manual until there is consistent traction.

---

## Gamification Structure

Recommended hierarchy:

- Badge: recurring/basic achievement
- Trophy: unique or limited-time achievement
- Frame: profile cosmetic
- Skin: public board cosmetic
- Avatar: identity cosmetic
- Quest: time-bounded objective
- Event: quest bundle with a theme and unique rewards

Reward categories:

- Earned-only: streaks, quest wins, limited events
- Premium-included: light cosmetic status
- Purchasable: skins, frames, avatar packs
- Legacy/anniversary: account age milestones

Earned-only rewards should be more prestigious than purchased cosmetics.

### Geo Quests

Geo quests are high potential but high privacy risk.

Rules:

- Opt-in only.
- Use a hybrid model, but with clear priority:
  - preferred source for city quests: user-declared country/city in profile
  - allowed fallback: approximate IP-derived location only after clear consent / opt-in
  - analytics-only coarse geography can remain aggregate and non-user-facing
- Neighborhood-level quests only if there is a strong privacy design and enough active users.
- Use aggregation thresholds to prevent re-identification.
- No precise location tracking by default.
- Never store raw IP for geo features.
- Store only normalized coarse fields needed for the product, such as `country_code`, `region`, and `city`.
- Let users edit or remove declared location from profile.
- Public geo breakdowns and leaderboards need minimum sample thresholds.
- Neighborhood quests should remain design-only until there is enough traffic and a legal/privacy review.

---

## Personality / Profile UX

Known issue:

- Personality is not discoverable enough from profile.
- Profile/dashboard is currently too busy and needs professional UX restructuring.
- Personality is highly promising, but the current 6-archetype system should be validated before expanding to 20+ archetypes.
- Zodiac alignment can be a strong entertainment layer, but it must be framed as playful and optional, never scientific or diagnostic.

Recommended sprint:

- Simplify profile dashboard IA:
  - Overview
  - Personality
  - Badges/Trophies
  - Activity
  - Premium
  - Settings
- Add clear personality card entry point from profile.
- Add shareable personality card image.
- Add localized EN/IT sharing copy.
- Reuse existing brand/social card style where possible.

Need to verify:

- Number of personality archetypes.
- Whether personality share cards already exist or only text share exists.

Future personality expansion:

- Target: expand from 6 to about 18-24 archetypes only after the current personality share loop shows engagement.
- Use the existing 5 moral axes as the base. Avoid arbitrary personality labels that do not map to vote behavior.
- Add "zodiac alignment" as an optional overlay, not as part of the core moral score.
- Do not collect full birth date unless there is a clear product need. Prefer optional zodiac sign selection to reduce personal data.
- Copy must remain entertainment/reflective: "based on your SplitVote choices", "for fun", "not scientifically validated".

---

## Discussion / Threads

Do not build internal comments yet.

Reason:

- Moderation burden is high.
- Legal risk is high.
- Spam/abuse surface is large.
- It distracts from retention and social sharing.

Recommended sequence:

1. Improve share loop first.
2. Use external discussion surfaces manually, such as Reddit posts or social comments.
3. Add internal discussion only after moderation, reporting, blocking, rate limits, and policy pages are ready.

If internal threads are built later:

- Logged-in only.
- Strong moderation queue.
- Report button.
- Rate limits.
- Abuse audit log.
- Clear content policy.
- No comments from anonymous users.

---

## Recommended Next Product Sequence

Do not build all ideas at once. Recommended order after current social-content cleanup:

1. Social/share + insight polish
2. Profile UX + Personality share card
3. Premium dashboard simplification and VIP/no-ads polish
4. Stripe production QA + webhook idempotency
5. Paid poll submission design + legal review
6. User-submitted poll MVP with admin review
7. Micro-learning paths MVP
8. Public bacheca with badges/trophies
9. Cosmetic/VIP visual system
10. Geo quests
11. Discussion/community layer

---

## Mobile App Readiness

This track is not a current sprint. It is a sequenced readiness plan for an eventual app store release. Web-first strategy remains the priority until the core loop and premium QA are stable.

**Decision (28 Apr 2026):** do not build native app now. Do not create separate Android/iOS agents yet. Use one single agent (`.claude/agents/mobile-app-readiness-reviewer.md`) for the entire track. Rationale: the highest-value work (Phase 0-2) is shared between platforms; splitting too early creates context fragmentation.

Each phase is a gate for the next. Do not start Phase N+1 without completing Phase N.

### Phase 0 — Web Mobile Hardening

Prerequisites for anything store-related.

- Portrait/landscape layout correct on real devices (iOS Safari, Android Chrome)
- No horizontal overflow on 320px–390px viewports
- Touch targets minimum 44×44px on all interactive elements
- Safe area insets respected (notch, home indicator, mobile browser chrome)
- `viewport-fit=cover` in viewport meta when fixed/sticky elements overlap notch
- No font-size below 16px on form inputs (prevents iOS Safari auto-zoom)
- Keyboard-aware layout (inputs not hidden behind soft keyboard)
- QA on real devices or high-fidelity emulator, not only DevTools

### Phase 1 — PWA Foundation

Prerequisite: Phase 0 complete.

- `site.webmanifest` complete: name, short_name, all icon sizes, theme_color, display, start_url, orientation
- Icon set: 192×192, 512×512, maskable, Apple touch icon 180×180
- Splash behavior verified on iOS (no blank flash)
- Install prompt UX: `beforeinstallprompt` handled, dismissal state persisted, no forced banner
- Offline fallback page (`/offline`) polished
- Service worker: network-first for pages, API routes excluded, static assets cache-first
- Deep link behavior: all routes resolve correctly in standalone mode
- Lighthouse PWA score ≥ 90

### Phase 2 — Store Policy Audit

Prerequisite: Phase 1 complete.

- **Account deletion** — required by both Apple (2022) and Google (2024): in-app delete-account flow that removes account and all data, with URL registered in store listing
- **UGC report mechanism** — required by both stores if user-generated content (poll submissions, public profiles) is accessible in-app
- **Content rating** — dilemma content reviewed against store guidelines; age rating determined (likely 12+ or 17+)
- **Apple privacy nutrition labels** — data types, linked to identity, tracking purposes
- **Google Play Data Safety** — data collected/shared, security, deletion
- **iOS IAP policy decision** — highest-risk constraint: if Premium (no-ads, renames, poll submission) is primarily accessed in-app, Apple may require Apple IAP instead of Stripe web checkout. Options: (a) web-only checkout redirect, (b) implement IAP alongside Stripe, (c) remove premium from iOS V1. Requires PM + legal decision before submission.
- **Android billing** — TWA is more permissive than iOS for web billing; verify Play Billing policy for chosen wrapper
- Developer accounts: Apple Developer Program (€99/year), Google Play Console (€25 one-time)

### Phase 3 — Android Wrapper

Prerequisite: Phase 2 complete.

- TWA vs Capacitor decision: TWA is lighter and URL-native (recommended if PWA is solid); Capacitor adds native access (haptics, notifications, share sheet)
- `assetlinks.json` at `/.well-known/assetlinks.json`, verified with Digital Asset Links tool
- Package name chosen (e.g. `io.splitvote.app`)
- Signed APK/AAB built (Bubblewrap CLI for TWA; Capacitor build for Capacitor)
- Play Store listing: icon, screenshots, description, content rating, privacy policy URL, account deletion URL
- Android QA: vote flow, auth, premium, portrait/landscape, back-button behavior, deep links

### Phase 4 — iOS Wrapper

Prerequisite: Phase 3 complete, or explicit PM decision to ship iOS first.

- Capacitor is the recommended approach (TWA is Android-only)
- WKWebView behavior reviewed: cookie persistence, Supabase auth tokens, redirect handling
- Universal Links via `apple-app-site-association` at `/.well-known/apple-app-site-association`
- iOS IAP policy decision from Phase 2 implemented
- Haptic feedback, native share sheet, local notifications: V1 scope decision
- App Store listing: screenshots all device sizes, App Privacy labels filled, support URL, account deletion URL
- iOS QA: vote flow, Safari cookie behavior, auth, premium, portrait/landscape, notch/safe areas

---

## Dedicated Sprint Plan

Use these as the next implementation ladder. Each sprint should be given to Claude separately and should finish with typecheck, build, diff check, commit, and push.

### Immediate Sprint — Social Share + Insight + Content QA Polish

Goal: improve the share loop and post-vote educational value without exposing the user's own vote.

Scope:

- Add pre-vote "Share question" action on play pages.
- Keep post-vote sharing, but make it anonymous aggregate sharing:
  - share question + live percentages
  - do not include "I voted" / "You chose" / selected option by default
- Update story cards so result cards do not reveal the user's vote unless a future explicit mode is added.
- Improve Expert Insight quality and presentation after voting.
- Fix IT personality/profile locale issues.
- Run a lightweight content QA/refuso sweep for static and approved dynamic dilemmas, especially Italian text.

Out of scope:

- New social APIs
- Auto-posting
- New DB schema
- New tracking beyond existing safe share events
- New personality archetypes
- Zodiac overlay

Why now:

- Sharing the question before a vote increases top-of-funnel.
- Anonymous aggregate sharing matches the product promise better than "my vote" sharing.
- Better post-vote insights increase session depth.
- Content typos damage trust quickly during soft launch.

Legal/docs:

- No legal update expected if no new personal data is collected.
- Maintain anonymous wording and avoid implying psychological diagnosis.

### ~~Guided Category Path MVP~~ — COMPLETED 28 Apr 2026

Implemented: `getFreshNextScenarioIdByCategory` helper. Query-param path flow (`?path=technology&step=1&target=3`). Category page CTAs. Play/results pages path-aware. VoteClientPage preserves path params in all redirects. ResultsClientPage shows continue/complete/exhausted states. No DB, no auth, no paid feature.

### ~~Immediate Sprint — Fresh Next Dilemma + Vote Grace UX~~ — COMPLETED 28 Apr 2026

Implemented: `getFreshNextScenarioId` excludes all voted IDs server-side (Supabase for auth users, `sv_voted_*` cookies for anon). 3-second grace countdown before POST with Undo/Confirm. `nextId = null` fallback → "Browse all" CTA.

### Sprint 1 — Profile UX + Personality Entry Point

Goal: make the existing profile/dashboard easier to understand and make Personality clearly reachable.

Scope:

- Audit current `/profile`, `/dashboard`, `/personality`, `/it/personality`, `/u/[id]`.
- Reorganize profile/dashboard into clear sections:
  - Overview
  - Personality
  - Badges / progress
  - Activity
  - Premium
  - Settings
- Add prominent Personality card/CTA from profile/dashboard.
- Keep anonymous voting unchanged.
- Keep all existing data/API contracts.

Out of scope:

- New DB schema
- Paid poll submission
- Cosmetic shop
- Internal comments
- Geo quests

Why first:

- Highest retention impact with low legal/technical risk.
- Uses existing personality and profile foundations.

Legal/docs:

- Read `LEGAL.md`; likely no legal page update unless public profile visibility changes.

### Sprint 2 — Personality Share Card

Goal: turn the personality result into a shareable visual asset.

Scope:

- Verify current personality share behavior.
- Create/share a branded personality card for EN/IT.
- Include archetype, sign, emoji, short tagline, and splitvote.io URL.
- Add social share/download actions from Personality page and profile entry point.
- Reuse existing story-card/OG visual patterns where practical.

Out of scope:

- Remotion/video
- New personality archetypes
- Paid cosmetics
- Social auto-posting

Why second:

- Direct viral loop improvement.
- Makes identity feature visible on social platforms.

Legal/docs:

- Ensure copy says "based on your SplitVote choices" and not scientific diagnosis.

### Sprint 3 — Premium Dashboard Simplification

Goal: make Premium feel real before adding more monetization.

Scope:

- Build a simplified premium/user dashboard surface using existing entitlements.
- Show:
  - no-ads status
  - billing/customer portal access
  - rename entitlement/status
  - profile/personality shortcuts
  - future perks as disabled/coming-soon if needed
- Do not create new pricing tiers.
- Do not alter Stripe price IDs or billing model.

Out of scope:

- Poll credits
- VIP cosmetic marketplace
- New Stripe products
- Subscription tier matrix

Why third:

- Premium already exists but needs clearer perceived value.
- Lower risk than changing billing.

Legal/docs:

- Check Terms/Privacy only if user-facing premium promises change.

### Sprint 4 — Stripe Production QA + Webhook Idempotency

Goal: harden monetization before adding paid poll credits or VIP tiers.

Scope:

- Add webhook idempotency for `checkout.session.completed` and subscription lifecycle events.
- Prevent double increment of `name_changes`.
- Document required production Stripe events/env vars.
- Add safe test notes for real-card production QA.

Out of scope:

- New products/prices
- Paid poll submission
- Cosmetic shop

Why fourth:

- Payment correctness is a blocker for any bigger monetization.

Legal/docs:

- Update `LAUNCH_AUDIT.md`, README, and `LEGAL.md` if billing behavior or refund wording changes.

### Sprint 5 — Paid Poll Submission Spec + Legal Design

Goal: design the paid user-generated poll workflow before implementation.

Scope:

- Create or update docs/spec for paid poll submission:
  - who can submit
  - pricing options to evaluate later
  - admin review lifecycle
  - audit trail
  - email notifications
  - prohibited content rules
  - submitter responsibility checkbox
  - moderation and takedown flow
- Identify exact files/schema likely needed for implementation.
- Update `LEGAL.md` with blockers.

Out of scope:

- No code implementation except docs/spec.
- No new Stripe prices.
- No live paid submission UI.

Why fifth:

- High revenue potential, but too legally sensitive to build ad hoc.

Legal/docs:

- Required. Terms/Privacy may need planned changes listed, but do not rewrite live pages unless implementation starts.

### Sprint 6 — User-Submitted Poll MVP

Goal: allow controlled paid/premium poll submissions with admin review.

Prerequisite:

- Sprint 4 complete.
- Sprint 5 reviewed.

Scope:

- Logged-in eligible users can submit a poll.
- Every submission is draft-only.
- Admin approval required before public visibility.
- Content policy checkbox required.
- Basic audit trail and notification hooks.
- Strong server-side validation.

Out of scope:

- Auto-publish
- Public comments
- Multiple paid plans
- Social trend ingestion

Why sixth:

- Opens monetization and content supply while keeping platform control.

Legal/docs:

- Must update Terms EN/IT, Privacy EN/IT if new personal data/audit data is collected, and `LEGAL.md`.

### Sprint 7 — Micro-Learning Paths MVP

Goal: package dilemmas into themed learning/insight paths.

Scope:

- Define path model using existing content where possible.
- Start with static/curated paths.
- Each path includes 5-10 dilemmas and neutral post-vote context.
- AI/OpenRouter can draft paths, but only admin-approved content becomes public.

Out of scope:

- Formal education claims
- Certificates
- Professional advice
- User-generated learning paths

Why seventh:

- Improves depth and session length after core identity/monetization are clearer.

Legal/docs:

- Copy must say educational/reflective content, not professional advice.

### Sprint 8 — Public Bacheca + Badges/Trophies Foundation

Goal: turn public profile into a status surface.

Scope:

- Public profile board with visible badges/trophies.
- Privacy controls for what is public.
- Basic trophy model/spec if not already present.
- Share card for public profile/badge.

Out of scope:

- Paid cosmetic shop
- Geo quests
- Competitive leaderboards

Why eighth:

- Builds the status layer before selling cosmetics.

Legal/docs:

- Public visibility defaults must be conservative; update Privacy/LEGAL if visibility or public profile data changes.

### Sprint 9 — VIP Cosmetic Layer

Goal: add paid/status visual identity without pay-to-win.

Scope:

- Use Premium/VIP as visual label, not a separate billing system at first.
- Add cosmetic concepts:
  - name color
  - profile frame
  - avatar style
  - board skin
- Free/earned rewards should remain more prestigious than purchasable items.

Out of scope:

- Complex marketplace
- Loot boxes / random rewards
- Vote/result influence

Why ninth:

- Monetization after users have a public place to display status.

Legal/docs:

- Update Terms if paid cosmetics become purchasable.

### Sprint 10 — Geo/Event Quest Design

Goal: design privacy-safe geo and event quests before any implementation.

Scope:

- Country/city quest design.
- Hybrid location model:
  - user-declared city/country in profile as the primary source
  - approximate IP-based location only as an explicit opt-in fallback
  - no raw IP storage for geo features
- Aggregation thresholds.
- Anti-abuse and privacy constraints.
- Badge/trophy rewards.

Out of scope:

- Precise location tracking
- Neighborhood quests implementation
- Public local leaderboards without privacy review

Why tenth:

- Potentially powerful but should wait for traffic and privacy review.

Legal/docs:

- Required. Update `LEGAL.md` and likely Privacy before implementation.
- Required before storing any city/country profile field or using IP-derived location for product features.

### Sprint 11 — Discussion/Community Design

Goal: decide whether internal discussion is worth building.

Scope:

- Compare internal threads vs external Reddit/social discussion.
- Define moderation requirements:
  - logged-in only
  - report button
  - rate limits
  - block/delete
  - audit logs
  - content policy
- Produce implementation spec only.

Out of scope:

- No comments implementation in the first sprint.

Why last:

- High moderation/legal burden and lower priority than retention/social/premium.

Legal/docs:

- Required before any user comments go live.

---

## Legal Triggers

Update `LEGAL.md`, Privacy, and Terms before implementing:

- Paid poll submissions
- New subscription tiers or poll-credit pricing
- User-generated content publication
- Internal comments/threads
- Geo quests
- Public profile visibility changes
- New social data providers
- Marketing emails or creator/community campaigns
- Pixie cosmetic sales (Phase 5): requires `LEGAL.md` update, Terms EN/IT update with digital goods section, Stripe Price IDs per variant, and refund policy definition before any sprint touching cosmetic sales

---

## Pixie Digital Avatar Direction

Approved: 30 Apr 2026. Originated from Sprint 7 Pixie Identity Spec.

### Diagnosis: Old Companion System

The previous system used the label "Your Companion" / "Il tuo Compagno" with five named species (Spark, Blip, Momo, Shade, Orbit), all emoji-based. Field feedback confirmed users did not understand what the companion was. Key gaps:

- Generic label did not communicate personal avatar or identity
- Emoji-only visuals are not brand-identifiable
- Species names not linked to a clear system concept
- System invisible before users invest time
- "famiglio" not used in code (good); "compagno" survived as primary label; "companion" left untranslated in some IT surfaces

### Naming

| Context | IT | EN |
|---|---|---|
| System name (full form) | `Pixie, il tuo avatar digitale` | `Pixie, your digital avatar` |
| Short form in UI | `Il tuo Pixie` | `Your Pixie` |
| Dashboard / profile header | `Il tuo Pixie` | `Your Pixie` |
| Onboarding future title | `Crea il tuo Pixie` | `Create your Pixie` |

Rules:
- Never use "famiglio" as primary label
- Avoid "compagno" as primary name; temporary fallback only if needed
- Avoid "abilità" until real gameplay abilities exist; prefer: varianti, look, forme, accessori, evoluzioni
- "Pixie" is the brand name of the avatar system, not a random nickname

### Storytelling

IT: `Pixie è una creatura pixel-art originale che rappresenta l'utente e cresce con XP, voti e missioni completate.`

EN: `Pixie is an original pixel-art creature that represents the user and grows with XP, votes, and completed missions.`

Main tagline:

IT: `Pixie, il tuo avatar digitale che cresce con te.`

EN: `Pixie, your digital avatar that grows with you.`

Pixie is not a pet or decoration — it is the visual projection of the user's progression inside SplitVote. Each vote, mission, and streak directly evolves Pixie. The connection is personal, not decorative.

### Micro-copy (EN/IT)

| Event | IT | EN |
|---|---|---|
| XP gained / level up | `Pixie ha guadagnato XP: sei salito di livello!` | `Pixie gained XP: you leveled up!` |
| Mission reminder | `Completa missioni per far crescere Pixie più velocemente.` | `Complete missions to help Pixie grow faster.` |
| Near next level | `Pixie è vicino al prossimo livello: continua a votare.` | `Pixie is close to the next level: keep voting.` |
| Variant unlock | `Nuovo look sbloccato: Pixie Glitch.` | `New look unlocked: Pixie Glitch.` |
| Profile helper | `Il tuo Pixie mostra i progressi che fai su SplitVote.` | `Your Pixie shows the progress you make on SplitVote.` |
| Legendary stage | `✨ Forma leggendaria sbloccata!` | `✨ Legendary form unlocked!` |
| Mission footer (non-max) | `Completa le missioni di oggi per far crescere il tuo Pixie più velocemente.` | `Complete today's missions to grow your Pixie faster.` |

### Variant Taxonomy

#### Free / Starter Pixies

Available to all users from day one, no action required. Goal: legible system without a paywall.

| Variant | Notes |
|---|---|
| Pixie Spark | Default — already assigned to all users (`companion_species = 'spark'`) |
| Pixie Neon | Common — energetic, neon outline, large expressive eyes |
| Pixie Leaf | Common — nature-inspired, soft green palette |

#### Earned-Only Pixies

Unlocked exclusively through real gameplay actions. Not purchasable at any price. Most socially prestigious tier — a user with Pixie Wisp has demonstrated commitment that no purchase can replicate.

| Variant | Unlock condition | Difficulty |
|---|---|---|
| Pixie Cloud | Explore 5 different categories | Low — encourages content discovery |
| Pixie Ember | 7-day streak | Medium — achievable in one week |
| Pixie Moonlight | Complete missions on multiple consecutive days | Medium — mission streak |
| Pixie Champion | 100 total votes | High — sustained engagement |
| Pixie Wisp | 500 votes or Legendary stage | Very high — maximum dedication |

Rule: unlock criteria must be verified server-side. No client-only unlock logic.

#### VIP / Premium Pixies

Included with Premium subscription, no separate purchase. Active while subscription is active. Cancellation behavior to be defined in implementation sprint and reviewed with `LEGAL.md` before deploy.

| Variant | Vibe |
|---|---|
| Pixie Hologram | Semi-transparent outline, holographic, sky-blue shadows |
| Pixie Circuit | Minimal circuit pattern, luminous wire details |
| Pixie Aurora | Multi-color gradient aura, aurora borealis effect |
| Pixie Goldline | Golden outline, premium line-art details |
| Pixie Prism | Chromatic refraction, pixel prism effect |

Premium Pixies have more visual polish than free variants but not more game power. An earned Pixie Wisp at 500 votes must feel rarer than a Premium Hologram: social rarity is earned, not bought.

#### Purchasable Pixies (Phase 5 only)

Do not implement until Phase 5 prerequisites are met (LEGAL, Stripe QA, Terms review).

| Variant | Style |
|---|---|
| Pixie Rocket | Jet tail / flame, speed vibe, red/black palette |
| Pixie Glitch Deluxe | Enhanced Glitch, more chromatic and displacement effects |
| Pixie Marshmallow | Soft, round body, light palette, round eyes |
| Pixie Kawaii | Small accessory (bow/cap), sweet expression, cute style |
| Pixie Cyber | Cyberpunk minimal, neon green accents, circuit graphics |

Shop rules (Phase 5): single price per variant or thematic bundles; clear visual preview always shown before payment; no loot boxes; no random paid unlock; access is continuative, barring refund, abuse, chargeback, or removal for legal/technical reasons; final policy to be defined before launch.

### Product Rules

1. **No pay-to-win.** Variants do not modify votes, results, leaderboards, XP, stage progression, or any gameplay mechanic. Cosmetic only.
2. **Earned-only is the most prestigious tier.** Never invert this hierarchy. A purchased variant must never appear rarer than a hard-earned one.
3. **No loot boxes.** No random paid unlock. Every purchase has a guaranteed, clearly previewed outcome.
4. **No retroactive paywalls.** A variant given for free (starter or earned) can never be moved to paid for existing holders.
5. **Phase 5 gate.** No cosmetic sales in production without: `LEGAL.md` updated, Terms EN/IT updated with digital goods section, Stripe QA complete (including existing Premium QA open), and refund policy defined.

### Existing Species → Pixie Mapping

`companion_species` DB column values remain unchanged. Only display names change in `lib/companion.ts`:

| DB value (unchanged) | Old display name | New Pixie name |
|---|---|---|
| `spark` | Spark | Pixie Spark |
| `blip` | Blip | Pixie Glitch |
| `momo` | Momo | Pixie Leaf |
| `shade` | Shade | Pixie Moonlight |
| `orbit` | Orbit | Pixie Hologram |

### Asset Direction

- Style: original pixel-art digital avatar creature
- Format: PNG or WebP with alpha channel (transparent background)
- Master size: 256×256 px; readable at 48×48 (compact dashboard) and 80×80 (full dashboard)
- No embedded text or watermarks; @2x (512×512) recommended for retina
- Palette: SplitVote dark theme — blue, purple, yellow energy, neon accents
- Every asset reviewed by PM before commit; reject anything visually similar to known IP
- Document which generation tool was used for copyright audit trail

Stage visual evolution per species:

| Stage | Votes | Visual change |
|---|---|---|
| 1 | 0–9 | Base form, no accessories |
| 2 | 10–49 | Slightly more saturated color |
| 3 | 50–99 | Light aura or minimal accessory |
| 4 | 100–499 | Pronounced glow, luminous outline |
| 5 | 500+ | Special effect (particles, neon glitch, pulsing aura) |

Generation priority: Pixie Spark stage 1–5 first (default species, maximum visibility), then Pixie Glitch and Pixie Leaf.

### Future Data Model (do not implement now)

```sql
-- On profiles table (Phase 3):
pixie_variant_equipped  text  -- active variant, default 'spark'

-- New table (Phase 3+):
CREATE TABLE user_pixie_skins (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users on delete cascade,
  variant_id     text not null,   -- e.g. 'pixie-champion', 'pixie-hologram'
  source         text not null,   -- 'earned' | 'premium' | 'purchased' | 'admin_granted'
  unlocked_at    timestamptz not null default now(),
  stripe_charge  text            -- purchase audit / refund reference
);
```

Anti-spoofing: `variant_id → accessible` mapping must always be computed server-side (RSC or API route), combining entitlements + `user_pixie_skins` rows + earned criteria (votesCount, streakDays, etc.). Client must not receive an "unlocked" flag without server verification.

### Implementation Sequencing

| Phase | Scope | DB | Stripe | LEGAL |
|---|---|---|---|---|
| **Phase 1** — Rename/copy | All "Companion" → "Pixie" copy in UI and lib; EN/IT strings; species display names | None | None | None |
| **Phase 2** — Base assets | Pixie Spark PNG stage 1–5 in `public/pixie/`; `CompanionDisplay` uses `<Image>` with emoji fallback | None | None | None |
| **Phase 3** — Share card MVP | Shareable Pixie profile card (OG + story format); `/api/pixie-card` server-only endpoint; share CTA on dashboard | None | None | Confirm which profile fields are already public |
| **Phase 4** — Selector / earned variants | Variant picker; server-side unlock verification; `pixie_variant_equipped` on profiles | Column on profiles | None | None |
| **Phase 5** — VIP cosmetics | Premium variants via entitlements; cancellation behavior defined | No new migration if Phase 4 done | None | Verify if Premium perks wording changes |
| **Phase 6** — Purchased Pixies | Shop / bundles; `user_pixie_skins` table; Stripe Price IDs per variant | New table + migration | New Price IDs | **Required before launch** |

### Pixie Shareability Direction

Approved: 30 Apr 2026. Addendum to Pixie Digital Avatar Direction.

Pixie must not be confined to the dashboard — it is a shareable status signal and a viral loop accelerator. When a user's Pixie reaches a milestone or unlocks a rare form, that moment should be worth sharing publicly.

#### 1. Shareable Pixie Profile Card

A dedicated shareable card, generated server-side, containing:

- Pixie image (current variant + stage)
- Variant name (e.g. "Pixie Wisp — Legendary")
- User level / stage label
- XP or total votes count (already public or user-consented)
- Earned badge or streak if already publicly visible on profile
- SplitVote branding
- CTA/link: `Create your Pixie` (EN) / `Crea il tuo Pixie` (IT)

Target formats:
- 1080×1920 story card (Instagram / Snapchat / WhatsApp)
- 1200×630 OG card (Twitter/X, Facebook, iMessage)

Implementation: server-rendered image (e.g. `@vercel/og`) or static PNG export. No client-side canvas. Card endpoint: `/api/pixie-card/[userId]` — server-only, no raw personal data in URL.

#### 2. Unlock Moment Sharing

Triggered when a user reaches a new stage or unlocks a new look. The share is always user-initiated (share button on unlock toast), never auto-posted.

| Event | IT | EN |
|---|---|---|
| New look unlocked | `Ho sbloccato Pixie Glitch su SplitVote` | `I unlocked Pixie Glitch on SplitVote` |
| Level milestone | `Il mio Pixie ha raggiunto il Livello 10` | `My Pixie reached Level 10` |
| Legendary stage | `Il mio Pixie è diventato Leggendario su SplitVote` | `My Pixie reached Legendary on SplitVote` |

Implement only after unlock/selector logic exists (Phase 4+). Share card MVP (Phase 3) shows current state; unlock-moment triggers come later.

#### 3. Earned Status Comes First

Earned-only Pixies must be the most share-worthy, visually and contextually. The card communicates how the variant was earned:

| Variant | Label on card |
|---|---|
| Pixie Wisp | `Earned: 500 votes` |
| Pixie Champion | `Earned: 100 votes` |
| Pixie Ember | `Earned: 7-day streak` |
| Pixie Cloud | `Earned: 5 categories explored` |
| Pixie Moonlight | `Earned: mission streak` |

VIP and Purchasable Pixies do not show an earned label. A user with Pixie Wisp must feel rarer on the share card than a user with Pixie Hologram (Premium).

#### 4. Privacy and Safety Rules

Never include on the share card:
- Personal vote choices or vote history
- Email, user ID, or internal identifiers
- Demographic data
- Personal leaderboard rankings without opt-in
- Premium subscription status as a visible status signal
- Any field not already public or explicitly user-consented

Allowed:
- Display name (if already public in the user's profile)
- Pixie variant name and current stage
- XP or total vote count if already visible on the public profile
- Earned unlock reason — only if it does not reveal vote direction or personal choices

Before implementing the public card endpoint, confirm in `LEGAL.md` which profile fields are treated as public and whether any new user consent is required.

#### 5. Implementation Note

Share card MVP (Phase 3) arrives after base assets and before selector/shop — it maximizes viral return on the asset investment before monetization complexity is added. Unlock-moment sharing (copy + share button on unlock toast) is a Phase 4+ feature that depends on the variant selector being live.

---

## Segmented Result Comparison Direction

**Status: DEFERRED** — spec approved 30 Apr 2026; implementation waiting for sufficient IT traffic and core-loop stability.

### Feature Summary

A secondary card on the results page showing how a sub-segment of users voted on the same dilemma, compared with the global result. The public-facing name is never "People Like You" — that label implies personal profiling. Phase 1 uses only the UI locale derived from the URL prefix.

The card appears only post-vote, only in the Italian locale, and only when the segment sample meets the minimum threshold.

### Decision: DEFER

Do not build until:

- At least one popular dilemma has ≥ 500 votes in the IT locale (verify via admin panel or Redis).
- Core Loop Clarity (ROADMAP PM Priority #2) and Pre-vote sharing (#3) are shipped.
- A `LEGAL.md` pre-deploy confirmation has cleared: adding `locale` to the vote route body and creating Redis keys `votes:locale:it:*` does not require a Privacy Policy update.

### Phase 1 — Locale Segment Only

**Segment**: users who voted via the Italian UI (`/it/...` URL prefix). Not country, not declared language, not IP location.

**Public label**:

| Context | IT | EN |
|---|---|---|
| Card title | `Chi vota in italiano` | `People voting in Italian` |
| Vote count | `{n} voti` | `{n} votes` |
| Compare global | `Risultato globale: {pctA}% / {pctB}%` | `Global result: {pctA}% / {pctB}%` |
| Footnote | `Solo voti registrati nell'interfaccia italiana. Non rappresenta l'Italia come paese.` | `Based only on votes from the Italian interface. Does not represent Italy as a country.` |

Never use: "People Like You", "Il tuo gruppo", or any label that implies personal attribute matching.

**Integration point**: Results page, post-vote only, inline below global result bars and above Expert Insight block. Hidden when `voted === null`, when segment total < 50, or when Redis is unavailable.

**UI rules**:
- Always show `n` votes in the card header.
- Footnote is mandatory — prevents misreading as a country-level result.
- Card is absent below threshold — no placeholder, no "not enough votes yet" message.
- No fake representativeness claims — no ± or margin-of-error language.
- Bar colors follow global bars (red for A, blue for B).
- Delayed reveal follows global `revealed` state — card stays hidden while bars are hidden.

### Data Model (Redis)

New key pattern, written fire-and-forget alongside the global key at vote time:

```
votes:locale:it:{scenarioId}  →  HASH { a: number, b: number }
```

Same pattern as `trackDailyVote`: non-blocking, errors swallowed, never fails the vote response.

Read at results page server-render in parallel with `getVotes()`, with try/catch fallback (card absent on error).

### Minimum Threshold

```typescript
const MIN_LOCALE_THRESHOLD = 50  // segment total votes required to show the card
```

### Not in Phase 1

| What | Why deferred |
|---|---|
| Country segment (`country_code`) | Optional field, likely sparse early; explicit LEGAL trigger (geo/country breakdowns) |
| IP-derived location | Prohibited without explicit consent and legal review — see `PRODUCT_STRATEGY.md → Geo Quests` |
| Demographic segments | Requires data not currently collected; high legal risk |
| "People Like You" label | Implies personal profiling — use precise segment label |
| EN locale card | "People voting in English" ≈ global result — not informative in Phase 1 |

### Privacy and Bias Rules

- URL locale prefix is not personal data — user chose the Italian interface voluntarily.
- The card never exposes an individual vote choice.
- Aggregate only: percentages + total count.
- No cross-segment comparisons visible to users.
- Country segment (Phase 2) requires: `LEGAL.md` update, Privacy Policy EN/IT review, `country_code` adoption rate check before building.
- IP-derived location: never use for this feature without explicit consent flow and legal review.

### LEGAL.md Triggers

`LEGAL.md` review is **mandatory** before implementing any of the following — do not start without it:

- Country/declared-country segment
- Demographic segments of any kind
- IP-derived location segments
- Any label that implies personal profiling
- Public-facing country breakdowns or rankings

Phase 1 (locale URL only) requires only a pre-deploy confirmation in `LEGAL.md` — not a full Privacy or Terms update. Confirm that the new Redis keys and optional `locale` body param do not constitute new personal data collection.

### Implementation Phases

| Phase | Scope | DB | LEGAL | Prerequisite |
|---|---|---|---|---|
| **Phase 1** — Locale (IT only) | Redis `votes:locale:it:{id}`; `incrementLocaleVote` + `getLocaleVotes` in `lib/redis.ts`; optional `locale` in vote POST body (fire-and-forget); card UI on IT results post-vote; 50-vote threshold | None | Pre-deploy confirmation only | 500+ IT votes on one popular dilemma; Core Loop + Pre-vote sharing shipped |
| **Phase 2** — Country segment | `country_code` join on `dilemma_votes`; card "People in Italy"; logged-in only; 100-vote threshold | Migration or JOIN | **Required** — geo/country is explicit LEGAL trigger | Phase 1 stable; LEGAL review complete; country_code adoption > 5% of profiles |
| **Phase 3** — Multi-locale | Extend to ES, PT-BR etc. as locales are added | None | None (same Phase 1 pattern) | Phase 1 stable; new locales shipped |

### Files Likely Touched in Future Implementation

| File | Change |
|---|---|
| `lib/redis.ts` | Add `incrementLocaleVote`, `replaceLocaleVote`, `getLocaleVotes` |
| `app/api/vote/route.ts` | Read optional `locale` from body; fire-and-forget locale increment |
| `app/results/[id]/page.tsx` | Fetch `localeVotes` in parallel with global votes; pass as prop |
| `app/it/results/[id]/page.tsx` | Same — if the IT results route is a separate file |
| `app/results/[id]/ResultsClientPage.tsx` | New `localeVotes` prop; inline card UI; EN/IT copy |
| `app/play/[id]/VoteClientPage.tsx` | Pass `locale: 'it'` in POST body when `isIT` |
| `LEGAL.md` | Pre-deploy confirmation for Phase 1; full update required for Phase 2+ |

---

## PM Field Observations — UX, Growth, Admin, AI Quality (30 Apr 2026)

Direct product observations captured after soft launch. None of these are implemented. Do not implement without an explicit sprint prompt. Each item includes problem statement, future sprint name, and risk level.

### 1 — Mission deep links

**Problem:** In the dashboard missions tab, tapping an incomplete mission does nothing. It should navigate directly to the action required to complete it (e.g., `vote_3` → play page; `challenge_friend` → referral share; `share_result` → most recent result share CTA).

**Sprint:** Mission UX polish.

**Risk:** Medium. Each mission needs a clearly defined target action and route. `share_result` and `challenge_friend` require share-target context not currently stored.

---

### 2 — Daily Dilemma full-card click (home)

**Problem:** On the home page, the "Dilemma del Giorno" card has only a small CTA button as the clickable target. The entire card area should navigate to the dilemma.

**Important constraint:** The share icon/button inside the card must NOT be caught by the card-level click handler. Use `e.stopPropagation()` on the share CTA.

**Sprint:** Home interaction polish.

**Risk:** Low/medium. Event propagation and keyboard accessibility must be tested. Screen readers need the card itself to be a proper link or button, not a `div` with an `onClick`.

---

### 3 — Vote reconsideration via long press

**Problem:** On already-answered dilemmas (within the `can_change_until` window), there is no obvious UX affordance to reconsider. A long press on the user's selected answer could surface a "Change your vote?" prompt.

**Sprint:** Vote reconsideration UX.

**Risk:** High. Touches the vote flow, the `can_change_until` timing policy, mobile long-press event reliability, and accidental-change risk. Must not silently change a vote — must require explicit confirmation. Never implement without a dedicated sprint review.

---

### 4 — Dashboard navigation IA

**Problem:** Profile, missions, rewards, and settings are fragmented across the dashboard in a way that makes the information architecture unclear for new users. Standard UX patterns (tab bar, settings vs. social vs. progress separation) are not applied.

**Sprint:** Account UX restructure.

**Risk:** Medium/high given the breadth of UI surface. Requires a full wireframe/IA review before implementation. Do not ship incrementally without a clear overall structure defined first.

---

### 5 — VIP display name colors

**Problem:** Premium and VIP users have no visual identity distinguishing them from regular users. A cosmetic display name color palette would add status differentiation without affecting gameplay.

**Proposed palette (10 shades):**
- Silver shade
- Gold shade
- Steel shade
- Diamond shade
- Ruby shade
- Emerald shade
- Sapphire shade
- Amethyst shade
- Neon blue
- Cosmic purple

**Rules:**
- Purely cosmetic — no gameplay advantage.
- Visible in leaderboards, profile cards, and admin/super-admin views.
- Eligibility: Premium entitlement or admin/super-admin role.
- No free-tier access without purchase/upgrade.

**Sprint:** VIP profile cosmetics.

**Risk:** Medium. Must verify entitlement gating on both server (profile endpoint) and client (display component). If colors are sold as an explicit Premium perk, `LEGAL.md` and Terms EN/IT may require update to describe the cosmetic benefit.

---

### 6 — Feedback counter bug

**Problem:** The feedback counter visible in dashboard/admin view appears to not update correctly or shows stale/zero data even when feedback events have been submitted.

**Sprint:** Feedback analytics bugfix.

**Priority:** Bug — should be investigated before relying on feedback metrics for any product decision.

**Risk:** Medium. Requires audit of the event source (where feedback is written), the aggregation query or Redis key, and the dashboard display component. If the bug causes silent double-writes or data loss, risk rises to high.

---

### 7 — Blog layout + sharing

**Problem:** On desktop and tablet the blog article listing uses a single-column layout that underutilizes horizontal space. Blog cards and article pages also lack a share affordance.

**Required changes:**
- Blog listing: 2-column grid on `md:` and above breakpoints.
- Blog card: share icon using Web Share API with clipboard fallback.
- Article page: share icon at top and/or bottom of article.

**Sprint:** Blog growth polish.

**Risk:** Low/medium. Web Share API is not available on all desktop browsers — clipboard fallback is mandatory. Accessibility: share button must be keyboard-operable and have an aria-label.

---

### 8 — AI seed draft network_error

**Problem:** When the admin triggers a seed batch generation, the drafts are created and saved successfully, but the UI shows a `network_error` response at the end of the batch. After a manual page refresh, all drafts appear correctly in the queue.

**Hypothesis:** Vercel function timeout is reached before the batch completes. The generation pipeline finishes its work (drafts saved to Redis/Supabase) but the HTTP response is never sent — the client gets a connection reset and shows `network_error`.

**Risk:** High if admins interpret the error as a failed batch and retry, causing duplicate drafts. The fix likely requires either:
1. Splitting generation into smaller confirmed chunks with per-item progress feedback.
2. Converting to a fire-and-forget async endpoint with polling for status.

**Sprint:** Admin AI generation reliability.

**Priority:** Bug — address before any large-scale batch generation runs.

---

### 9 — AI generation novelty problem

**Problem:** The current generation pipeline produces dilemmas that are semantically too similar to each other and too similar to already-published dilemmas, despite the semantic novelty review step.

**Required improvements:**
- Compare new drafts against published, approved, AND recent draft pools (not just a recent-window snapshot).
- Raise the novelty threshold or tighten the `too_similar`/`related_but_distinct` boundary.
- Diversify prompting: vary topic framing, context type (personal vs. societal vs. survival), and scenario specificity.
- Consider pre-clustering existing content so the generator can be steered away from over-represented clusters.

**Sprint:** AI content quality (novelty sub-sprint).

**Risk:** Medium. Changing novelty thresholds can cause over-rejection (all new drafts rejected as duplicates). Must tune incrementally and validate with dry runs.

---

### 10 — Current-events dilemma generation

**Problem:** News-inspired dilemmas would dramatically improve content freshness and social relevance. The current pipeline generates from static topic lists with no connection to current events.

**Required guardrails (non-negotiable):**
- No real names of living people.
- No specific city/location if not needed for the dilemma abstraction.
- Transform the news event into a generalized moral/ethical question — do not reproduce the news story directly.
- Avoid exploiting tragedies, disasters, or deaths for engagement without principled framing.
- Avoid unverified claims about real events.
- Use recent news sources only as thematic inspiration, not as primary copy.
- All generated drafts go through admin review; no autopublish for current-events content.

**Sprint:** Current-events content engine.

**Risk:** High. Requires editorial review capacity, safety prompt design, and a clear content policy. Any mistake here is a reputational and potentially legal risk. Do not implement without explicit PM sign-off and `LEGAL.md` review.

---

### Summary Table

| # | Item | Sprint label | Priority | Risk |
|---|---|---|---|---|
| 1 | Mission deep links | Mission UX polish | P1 | Medium |
| 2 | Daily Dilemma full-card click | Home interaction polish | P1 | Low/medium |
| 3 | Vote reconsideration (long press) | Vote reconsideration UX | P2 | High |
| 4 | Dashboard navigation IA | Account UX restructure | P2 | Medium/high |
| 5 | VIP display name colors | VIP profile cosmetics | P3 | Medium |
| 6 | Feedback counter bug | Feedback analytics bugfix | P0 | Medium |
| 7 | Blog 2-column + share | Blog growth polish | P1 | Low/medium |
| 8 | AI seed draft network_error | Admin AI generation reliability | P0 | High |
| 9 | AI generation novelty | AI content quality | P3 | Medium |
| 10 | Current-events content engine | Current-events content engine | P3 | High |

---

## Picoclaw + SplitVote Content Intelligence Direction

**Status: DEFERRED — Phase 0/0.5 only (docs). No runtime code for Picoclaw bridge yet.**

Last reviewed: 6 May 2026.

### 1. Role Definition

Picoclaw is an external trend-scouting and content-intelligence agent. SplitVote is the publishing, review, voting, and editorial platform.

- **Picoclaw** — external radar: discovers topics, monitors trends, finds social/news signals, proposes raw opportunities.
- **SplitVote Content Intelligence Agent** — internal gatekeeper: reads SplitVote's real inventory, detects duplicate/saturated concepts, proposes seed cooldowns/exclusions, prepares reports, and scores Picoclaw opportunities against existing content.
- **SplitVote** — authoritative system: generates drafts, runs quality gates, manages approval, controls publish status, enforces legal/editorial guardrails.

Picoclaw must never bypass SplitVote's review pipeline. SplitVote is the single authoritative system for draft queue, quality gates, semantic review, admin approval, publish status, and legal guardrails.

The intended separation is:

```
Picoclaw trend signal
→ SplitVote Content Intelligence Agent
→ novelty / semantic / seed-usage checks
→ opportunity + cooldown report
→ Matteo/PM GO
→ Seed Draft Batch or manual seed generation
→ admin review + manual approval
→ public pages + social test
```

Picoclaw finds "what is happening." SplitVote decides "what is worth turning into a dilemma."

### 2. Candidate Capabilities

- Scan trending news and topics every 2-24 hours, depending on cost and editorial capacity.
- Maintain regional buckets: World / Europe / USA / Italy.
- Produce localized topic suggestions without naming private individuals.
- Abstract current events into moral dilemma seeds (no direct news reproduction).
- Suggest standard article topics.
- Suggest cornerstone article topics.
- Detect duplicate or semantically similar dilemmas against static, approved dynamic, and draft pools.
- Flag stale, low-quality, low-engagement, overused, or semantically saturated dilemmas.
- Propose seed cooldowns/exclusions when repeated generation attempts produce duplicates.
- Propose replacement angles for weak or redundant content.
- Suggest landing-page opportunities for strong trend clusters.
- Feed structured seed payloads into SplitVote's existing batch generator (`manualSeed` API param).

### 2.1 SplitVote Content Intelligence Agent v1 (Internal First)

Before structured Picoclaw ingestion, build the internal agent as a read-only/dry-run loop:

- Reads `static` scenarios, `dynamic:approved`, `dynamic:drafts`, seed usage, seed exclusions/cooldowns, and category coverage.
- Produces a duplicate/saturation report: closest matches, repeated moral structures, low novelty clusters, weak categories, and seed burnout.
- Recommends seed cooldown/exclusion changes, but does not mutate seed files automatically.
- Recommends draft edits/replacements, but does not approve, reject, delete, or publish content.
- Produces JSON/Markdown reports suitable for future admin UI ingestion.

Preferred output surfaces:

- local/operational report: `reports/content-intelligence-YYYY-MM-DD.md` (manual run only), or
- admin-only Redis report key in a later sprint.

Do **not** make the agent edit `lib/content-seed-packs.ts` on a schedule. The TypeScript seed file is the stable catalog. Operational state should live in admin-reviewed reports or runtime exclusion/cooldown storage.

### 3. Guardrails (Non-Negotiable)

- No automatic publishing — all content enters draft/review queue.
- No automatic deletion — all removal/replacement proposals go to admin review.
- No automatic commits, pushes, deploys, or direct file mutations from scheduled content loops.
- No automatic save mode; generation must remain dry-run/report-first unless Matteo gives explicit GO.
- No real names of living private individuals unless explicitly approved by PM.
- No city-specific or person-specific accusations.
- No exploitation of tragedies, disasters, or deaths without principled framing.
- No legal, medical, or financial advice framing.
- No unverified claims about real events.
- No scraping fragile social pages; use official APIs/providers or manual PM-provided inputs.
- Human admin approval required before any content goes live.
- Quality gates and semantic review remain mandatory — Picoclaw seeds are not exempt.

### 4. Integration Architecture — Future Only

```
Picoclaw scans trends
→ creates topic candidates (region, freshness, riskLevel, sourceUrls)
→ SplitVote Content Intelligence Agent evaluates against inventory + seed usage
→ produces candidate / too_similar / needs_review / safe_to_draft decision
→ optional admin-only import endpoint receives approved seed payload
→ SplitVote generates dilemma or article draft via existing pipeline
→ SplitVote runs novelty + preflight similarity + semantic review + safety checks
→ admin approves or rejects in admin panel
→ optional: replacement proposal shown alongside closest existing match
```

Picoclaw does not write directly to the draft queue — it submits seeds that SplitVote generates from. This preserves the existing quality pipeline unchanged.

### 5. Possible API Contract — Future Only

Example payload Picoclaw would send to a future SplitVote endpoint:

```json
{
  "source": "picoclaw",
  "kind": "dilemma_seed | article_seed | duplicate_report | replacement_suggestion",
  "locale": "en | it | all",
  "topic": "...",
  "title": "...",
  "angle": "...",
  "context": "...",
  "region": "world | europe | usa | italy",
  "freshness": "breaking | recent | evergreen",
  "riskLevel": "low | medium | high",
  "sourceUrls": [],
  "duplicateRisk": "low | medium | high",
  "closestMatchIds": [],
  "suggestedSeedPackId": "...",
  "suggestedLandingPage": {
    "title": "...",
    "slug": "...",
    "searchIntent": "..."
  },
  "notes": "..."
}
```

This maps directly to the existing `manualSeed` shape already supported by `app/api/admin/seed-draft-batch/route.ts`.

### 6. Duplicate and Replacement Workflow

Picoclaw may flag:

- Duplicate moral structure (same dilemma framed differently).
- Low novelty score against current draft pool.
- Low engagement (few votes, low share rate).
- Stale topical framing (event no longer relevant).
- Weak SEO signal.
- Redundant category coverage.

SplitVote must:

- Never delete content automatically.
- Create an admin review item showing the flagged content.
- Show the closest existing match and the reason for flagging.
- Propose a replacement draft if applicable.
- Require admin approval before any action is taken.

### 7. Roadmap Phases

| Phase | Scope | Status |
|---|---|---|
| **Phase 0** — Docs only | Document integration direction in PRODUCT_STRATEGY.md and ROADMAP.md | ✅ Done (30 Apr 2026) |
| **Phase 0.5** — Internal Content Intelligence Agent | Read-only duplicate/seed burnout/category gap reports from SplitVote inventory | Not started — recommended next foundation |
| **Phase 1** — Manual import | Admin copies Picoclaw topic into Seed Batch manual seed | Available now — no code needed |
| **Phase 1.5** — Runtime seed exclusions/cooldowns | Admin-reviewed exclusion state informs Seed Pack selection | In progress conceptually via Seed Eligibility Guard |
| **Phase 2** — Structured import endpoint | Picoclaw sends seed payloads to a new SplitVote admin-only endpoint | Not started — requires auth, API key, LEGAL.md review |
| **Phase 3** — Content intelligence dashboard | Admin sees Picoclaw suggestions, duplicates, replacement proposals, seed cooldowns, and landing-page opportunities | Not started — requires Phase 0.5/2 |
| **Phase 4** — Scheduled assisted generation | 1-2 daily Picoclaw/Content Intelligence reports; draft generation remains dry-run first | Not started — requires Phase 3 |
| **Phase 5** — Closed-loop optimization | SplitVote analytics feed opportunity ranking: which topics/categories perform best | Not started — requires Phase 4 + analytics baseline |

### 8. Legal and Safety Triggers

Before Phase 2 or later phases, the following must be reviewed and updated in `LEGAL.md`:

- **Source URL storage** — if Picoclaw payloads include source URLs or external trend metadata, Privacy Policy must cover this.
- **AI/provider disclosure** — if Picoclaw uses a third-party AI provider, Terms/Privacy must disclose the chain.
- **Editorial policy** — define explicit policy for news-inspired dilemmas (no defamation, no tragedy exploitation, no unverified claims).
- **Automated political content** — no automated publishing of politically sensitive dilemmas without editorial review.
- **Sensitive profiling** — Picoclaw must not use SplitVote vote data for profile-building or audience targeting.

Phase 1 (manual copy/paste into admin panel) requires no legal update — it uses the existing admin seed flow.

# Profile Header + Cosmetic Polish — Design Spec

**Sprint:** PROFILE-HEADER-REDESIGN-01
**Date:** 2026-05-17
**Author:** Matteo (PM) + Claude (implementer)
**Status:** Approved for implementation
**Reference inspiration:** DeviantArt profile headers (Stellastria, AIDeskTopWallpapers Core Pro+/Max)

---

## 1. Why this exists

Tonight (16 May late) we shipped `0c29821` which wired the cosmetics-equip render layer to dashboard / public profile / leaderboard. The PM then surfaced a stronger product intent: the cosmetics must feel **premium and beautiful**, and the profile surfaces should follow a tighter, more "showcase-like" layout in the spirit of DeviantArt's profile headers.

Two product objectives drive this sprint:

1. **Profile surfaces convey identity at a glance.** Today the `/u/[id]` hero uses a 4-card stat grid + separate "Member since" + "📍 country" lines. Vertical, busy, low-density. A single horizontal stats line is denser, more readable, and matches the visual reference set the PM provided.
2. **Cosmetics feel like they're worth buying.** Today name colors are flat Tailwind colors (`text-blue-400`) and badge chips only differ by border color across rarities. After this sprint, name colors include 5 new metallic/gemstone gradient slugs and badge chips have rarity-tiered visual treatment (gradient backgrounds, glow shadows, hover scale, legendary pulse).

Multi-tier membership system (CORE / PRO / PRO+ / MAX) is **explicitly out of scope** for this sprint — see section 9.

## 2. Scope summary

**In scope (all in one sprint, one commit):**

- New `<ProfileStatsLine>` component (horizontal bullet-separator stats display)
- Dashboard header gets the new stats line under the email line
- `/u/[id]` hero replaces the 4-card grid + "Member since" + country lines with the stats line
- `lib/cosmetics-store.ts` + `lib/cosmetics.ts` NAME_COLORS catalogs both gain 5 new premium slugs (`steel`, `silver`, `platinum`, `diamond`, `rose_gold`) and the existing `gold` is upgraded from solid yellow to a metallic gradient
- PixieSelector picker groups name colors into "Basic" and "Premium" sections
- New `<BadgeChip>` component (or shared inline pattern) applies rarity-tiered visual treatment to all badge surfaces (dashboard top-right, `/u/[id]` trophy case, dashboard BadgeSection)
- Vitest unit test for `ProfileStatsLine`
- The existing `tests/unit/cosmetics-catalog.test.ts` continues to enforce slug alignment automatically (5 new slugs covered by the iteration test)

**Out of scope (explicitly deferred):**

- Multi-tier membership system (Stripe pricing, entitlements matrix, tier badge component) — HUMAN_ONLY, blocked on Premium €4.99 live QA passing first
- Bio / tagline field on profile — would require new DB column + UGC moderation policy
- Profile Views / Favourites / Watchers tracking — new DB columns + new write paths
- Leaderboard row redesign — already updated tonight, dense format kept
- Animated shimmer / particle effects on name colors beyond legendary `animate-pulse`
- Custom SVG badge icons (emojis remain)
- AuthButton navbar avatar redesign
- `/profile` page edit flow update

## 3. Architecture

Three categories of change, each isolated:

1. **New shared component `ProfileStatsLine`** — pure presentational, takes a typed `items` array, renders a horizontal flex-wrap line with bullet separators. Items with `show: false` are filtered out before render (absent from DOM, not just hidden).
2. **New shared component `BadgeChip`** — pure presentational, takes `emoji`, `rarity`, `title`, `size`. Applies rarity-tiered CSS from `lib/rarity.ts`.
3. **Catalog expansion** — `lib/cosmetics.ts` and `lib/cosmetics-store.ts` gain 5 new name color slugs (additive; `gold` className upgraded in place). `lib/rarity.ts` gains `RARITY_GRADIENT_BG`, `RARITY_GLOW_SHADOW`, `RARITY_ANIMATION` lookup tables consumed by `BadgeChip`.

No component reaches into another's internals. Each surface (dashboard, `/u/[id]`, BadgeSection) imports the two new components and the catalog helpers via `getEquippedCosmetics()`. The cosmetic data flow is: profile row → `getEquippedCosmetics` → renderer-friendly defs → presentational components. Same shape as tonight's commit; no architectural change.

## 4. Data flow

```
Supabase profiles row
  ├ equipped_frame, equipped_glow, name_color  →  getEquippedCosmetics()  →  { frame, glow, nameColor }  →  CosmeticAvatar / CosmeticName
  ├ votes_count, xp, streak_days, created_at, country_code, badges.length  →  ProfileStatsLine items[]
  └ badges (joined)  →  BadgeChip (per badge)
```

No new database columns. No new API endpoints. No new Redis keys. No new cookies. No new client-side mutations.

## 5. Layout specs per surface

### Dashboard `/dashboard`

```
┌──────────────────────────────────────────────────────────────────────┐
│  [avatar      Hey, Matteo 👋  [⭐ PRO]            [🏆][🔥][🎯] badges │
│   lg          mat@gmail.com                                          │
│   framed      🗳 1,234 votes  ·  ⚡ Lv.8  ·  🔥 12-day streak         │
│   64×64]                                                              │
└──────────────────────────────────────────────────────────────────────┘
```

- Avatar size: `lg` (64×64) — keep tonight's CosmeticAvatar
- Greeting: `Hey, {firstName} 👋` with CosmeticName — keep tonight's render
- Email: `text-sm text-[var(--muted)]` truncate — keep tonight's render
- PRO badge: inline yellow chip — keep as is
- Top-right badges: use new `<BadgeChip size="md" />` (same visual size as today's `text-xl`, just with the new rarity treatment) instead of the inline `<span>`
- **New:** `<ProfileStatsLine align="left" items={...} />` underneath the email
- Stats line content for dashboard:
  - `🗳 N votes` (always shown, even if 0)
  - `⚡ Lv.K` (always shown via `getLevelInfo`, min Lv.1)
  - `🔥 K-day streak` (shown only if `streak_days > 0`)

### Public profile `/u/[id]`

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                       │
│                       [avatar xl framed 96×96]                       │
│                                                                       │
│                          Display Name                                 │
│                            [⭐ PRO]                                    │
│                                                                       │
│   🗳 1,234 votes · ⚡ Lv.8 · 🔥 12d streak · 🏆 23 badges · 📍 IT     │
│              · 📅 Member since May 2026                              │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

- Avatar size: `xl` (96×96) — keep tonight's CosmeticAvatar
- Display name: `h1` with CosmeticName — keep tonight's render
- PRO badge: yellow chip under h1 — keep as is
- **Remove:** the 4-card stat grid currently at lines ~147-175
- **Remove:** the standalone "Member since {joinDate}" `<p>` and `📍 {country}` `<p>` lines
- **New:** `<ProfileStatsLine align="center" items={...} />` replacing all three of the above
- Stats line content for public profile:
  - `🗳 N votes` (always)
  - `⚡ Lv.K` (always)
  - `🔥 Kd streak` (only if > 0)
  - `🏆 N badges` (only if > 0)
  - `📍 {country_code}` (only if country_code set)
  - `📅 Member since {Month YYYY}` (always)

Trophy case section ("🏆 Trophy Case") replaces inline `<div>` chips with `<BadgeChip size="md" />` from the new component.

## 6. `ProfileStatsLine` component spec

```tsx
interface StatsLineItem {
  icon: string                 // emoji
  value: string | number       // formatted display value
  label?: string               // suffix (e.g. 'votes', 'day streak')
  prefix?: boolean             // if true, label appears BEFORE value (e.g. 'Member since May 2026')
  show?: boolean               // default true; false filters the item out
}

interface ProfileStatsLineProps {
  items: StatsLineItem[]
  align?: 'left' | 'center'    // default 'left'
  className?: string
}
```

Render rules:

- Filter items where `show === false` BEFORE rendering. They must not be in the DOM.
- Between visible items, render a bullet separator `·` as `<span aria-hidden="true">`.
- Each item is `<span><span aria-hidden>{icon}</span>{prefix ? `${label} ${value}` : value}{!prefix && label ? ` ${label}` : ''}</span>` — full text accessible to screen readers, icons decorative.
- Wrapping: `flex flex-wrap items-center gap-x-3 gap-y-1`. Center variant adds `justify-center`.
- Color: `text-sm text-[var(--muted)]` default; caller can override via `className`.

## 7. Name color catalog (lib/cosmetics.ts + lib/cosmetics-store.ts)

Final slug set — 13 colors, both files must export the same set keyed on these slugs:

| Slug | Group | Tailwind className |
|---|---|---|
| `white` | basic | `text-white` |
| `blue` | basic | `text-blue-400` |
| `purple` | basic | `text-purple-400` |
| `green` | basic | `text-emerald-400` |
| `pink` | basic | `text-pink-400` |
| `red` | basic | `text-red-400` |
| `gradient` | basic | `bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent` |
| `gold` | premium **(upgraded)** | `bg-gradient-to-r from-yellow-200 via-amber-400 to-orange-500 bg-clip-text text-transparent` |
| `steel` | premium **(new)** | `bg-gradient-to-r from-slate-300 via-zinc-200 to-slate-400 bg-clip-text text-transparent` |
| `silver` | premium **(new)** | `bg-gradient-to-r from-gray-300 via-white to-gray-400 bg-clip-text text-transparent` |
| `platinum` | premium **(new)** | `bg-gradient-to-r from-slate-200 via-blue-50 to-slate-300 bg-clip-text text-transparent` |
| `diamond` | premium **(new)** | `bg-gradient-to-r from-cyan-200 via-pink-200 to-purple-300 bg-clip-text text-transparent` |
| `rose_gold` | premium **(new)** | `bg-gradient-to-r from-pink-300 via-amber-200 to-pink-400 bg-clip-text text-transparent` |

Picker UI (`PixieSelector`) groups these into two visible subsections: "Basic" (the 7 first slugs) and "Premium" (`gold`, `steel`, `silver`, `platinum`, `diamond`, `rose_gold`). Both groups are unlocked by the same `name_color_bundle` purchase — no new Stripe price IDs.

`lib/cosmetics-store.ts` `NAME_COLORS` array gets a `group: 'basic' | 'premium'` field on each entry so the picker can render the two subsections from one source.

The existing `tests/unit/cosmetics-catalog.test.ts` already iterates every slug from the store and asserts roundtrip through `getEquippedCosmetics`. Adding new slugs in `cosmetics-store.ts` without adding them to `cosmetics.ts` fails the test — drift prevention is automatic.

## 8. `BadgeChip` component spec + `RARITY_*` table expansion

```tsx
interface BadgeChipProps {
  emoji: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  title?: string               // for tooltip + aria-label
  size?: 'sm' | 'md' | 'lg'    // default 'md'
  className?: string
}
```

`lib/rarity.ts` exports three lookup tables (existing `RARITY_STYLES` and `RARITY_GLOW` retained; this sprint adds the gradient + animation tables):

```ts
export const RARITY_GRADIENT_BG: Record<Rarity, string> = {
  common:    'bg-slate-500/10',
  rare:      'bg-gradient-to-br from-blue-500/15 to-blue-700/10',
  epic:      'bg-gradient-to-br from-purple-500/20 to-fuchsia-700/15',
  legendary: 'bg-gradient-to-br from-yellow-400/20 via-amber-500/15 to-orange-500/20',
}

export const RARITY_GLOW_SHADOW: Record<Rarity, string> = {
  common:    '',
  rare:      'shadow-blue-500/30 shadow-md',
  epic:      'shadow-purple-500/40 shadow-lg',
  legendary: 'shadow-amber-500/50 shadow-xl',
}

export const RARITY_ANIMATION: Record<Rarity, string> = {
  common:    '',
  rare:      '',
  epic:      'hover:scale-110 transition-transform',
  legendary: 'animate-pulse',
}
```

`BadgeChip` composes these (template-literal style, matching codebase conventions — no `cn` / `clsx` utility currently used):

```tsx
<span
  title={title}
  aria-label={title}
  className={`
    inline-flex items-center justify-center rounded-xl border
    ${SIZE[size]}
    ${RARITY_STYLES[rarity]}
    ${RARITY_GRADIENT_BG[rarity]}
    ${RARITY_GLOW_SHADOW[rarity]}
    ${RARITY_ANIMATION[rarity]}
    ${className ?? ''}
  `}
>
  {emoji}
</span>
```

`SIZE` maps `sm | md | lg` to padding + emoji size:

```ts
const SIZE = {
  sm: 'text-base px-2 py-0.5',
  md: 'text-xl px-2.5 py-1',
  lg: 'text-3xl px-3 py-2',
}
```

Surfaces converted to use `<BadgeChip>`:

- `app/dashboard/page.tsx` top-right equipped-badges row → `size="sm"`
- `app/u/[id]/page.tsx` `🏆 Trophy Case` grid items → `size="md"` (replaces the existing inline chip)
- `app/dashboard/BadgeSection.tsx` badge listing → `size="md"`

## 9. Out of scope (explicit deferral)

| Item | Reason | Future sprint? |
|---|---|---|
| Multi-tier membership (CORE / PRO / PRO+ / MAX) | Stripe pricing + entitlements decision; HUMAN_ONLY per CLAUDE.md; blocked on Premium €4.99 live QA validation | MEMBERSHIP-TIERS-01 (after live QA + conversion data) |
| Bio / tagline field | New DB column + UGC moderation policy needed | PROFILE-BIO-01 (sprint of its own) |
| Profile Views tracking | New DB column + write path on every `/u/[id]` SSR | PROFILE-METRICS-01 |
| Favourites / Watchers | New DB tables + write paths + social feature scope | PROFILE-SOCIAL-01 |
| Animated shimmer on name colors | Adds `@keyframes` + bg-position cycle; UI noise risk; legendary `animate-pulse` on badges is enough animation for v1 | NAME-COLOR-ANIM-01 |
| Custom SVG badge icons | Asset work, not engineering work | BADGE-ART-01 |
| Leaderboard row redesign | Updated tonight, density retained | — |

## 10. Risk

| Risk | Likelihood | Mitigation |
|---|---|---|
| 4-card grid removal on `/u/[id]` is a visible UX shift | High (it's the point) | PM previews on a real `/u/[user-id]` page before push; revert is one git command |
| `gold` slug silently upgrades for existing users | Certain (intentional) | Acceptable: cosmetics never rendered before tonight, no user has the "old gold" baked into perception |
| Mobile wrap on long name + many stats | Low | Tailwind `flex-wrap` tested; max 2 lines on 375px viewport |
| `BadgeChip` animation on legendary causes performance issues | Very low | `animate-pulse` is a Tailwind built-in, GPU-cheap |
| Sync test fails because I forget to add slugs to both files | Zero — that's the point of the test | Test is automatic enforcement |
| Cosmetic columns missing from SELECT on some surface | Low | Listed surfaces (3) audited; each SELECT updated |
| Regression on tonight's cosmetic render | Nulla | CosmeticAvatar / CosmeticName unchanged; only ProfileStatsLine + BadgeChip + catalog expansion |

## 11. Acceptance criteria

- `npm test`: 14+ tests pass (existing 13 + new ProfileStatsLine + catalog test grows automatically)
- `npx tsc --noEmit`: clean
- `npm run build`: clean, no route reclassification (dashboard `ƒ`, `/u/[id]` `ƒ` per current state)
- `git diff --check`: clean
- Dashboard: `ProfileStatsLine` appears under email line with votes + level + (streak if > 0)
- `/u/[id]`: stats line replaces the 4-card grid; "Member since" and country merged into the stats line
- Picker UI: name colors visually grouped into Basic and Premium subsections
- Equipping a premium color (e.g. `diamond`) on the picker renders correctly on dashboard, `/u/[id]`, and leaderboard
- BadgeChip: legendary badges visibly pulse; epic badges scale on hover; rare/legendary glow correctly
- Working tree of PM (PRODUCT_STRATEGY.md, ROADMAP.md, page.tsx working files, 80+ pixie PNGs, content-generation-*.ts, scripts WIP) untouched in the diff
- Spec self-review passes (no placeholders, no contradictions)

## 12. File touch list

| File | Change | Estimated lines |
|---|---|---|
| `components/ProfileStatsLine.tsx` | NEW | +50 |
| `components/BadgeChip.tsx` | NEW | +40 |
| `lib/cosmetics-store.ts` | +5 colors with `group` field, mark `gold` premium | +18 / -4 |
| `lib/cosmetics.ts` | +5 NameColorDef, upgrade `gold` className | +14 / -2 |
| `lib/rarity.ts` | Add `RARITY_GRADIENT_BG`, `RARITY_GLOW_SHADOW`, `RARITY_ANIMATION` | +25 / -0 |
| `components/PixieSelector.tsx` | Name color section split into Basic / Premium subgroups | +30 / -10 |
| `app/dashboard/page.tsx` | Add `<ProfileStatsLine>` under email; replace top-right badge `<span>` with `<BadgeChip>` | +25 / -10 |
| `app/u/[id]/page.tsx` | Replace 4-card grid + "Member since" + country lines with `<ProfileStatsLine>`; trophy case items use `<BadgeChip>` | +30 / -45 |
| `app/dashboard/BadgeSection.tsx` | Use `<BadgeChip>` | +8 / -12 |
| `tests/unit/profile-stats-line.test.ts` | NEW | +50 |

**Total estimated:** ~250 net lines, 10 files. One commit.

## 13. Reversibility

`git revert <commit-hash>` restores the pre-sprint state in seconds. No data migration. No feature flag. No Stripe touch. No external service touch. PM's working tree (uncommitted PRODUCT_STRATEGY.md, ROADMAP.md, app/it/page.tsx, content-generation-*.ts, 80+ pixie PNGs, etc.) is unaffected because the sprint touches only the listed 10 files.

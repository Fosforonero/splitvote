# Profile Header + Cosmetic Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tighten profile surfaces (dashboard + `/u/[id]`) into a DeviantArt-style horizontal-stats layout, expand the cosmetics catalog with 5 metallic/gemstone name colors, upgrade `gold` from solid to metallic gradient, and apply per-rarity gradient + glow + animation treatment to all badge chips.

**Architecture:** Two new presentational components (`ProfileStatsLine`, `BadgeChip`), additive catalog expansion in `lib/cosmetics.ts` + `lib/cosmetics-store.ts` enforced by the existing sync test, expanded `RARITY_*` lookup tables in `lib/rarity.ts`, picker grouped into Basic/Premium sub-rows in `PixieSelector`, and refactor of 3 consumer surfaces (dashboard, BadgeSection, `/u/[id]`) to use the new components.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Vitest (no React Testing Library — logic tested as pure helpers).

**Commit strategy:** ONE final commit covering all tasks (per spec section 12). Tasks `git add` incrementally; the final task does verification + single commit + push. Per-task progress is visible via `git status` / `git diff --cached`.

**Reference spec:** [docs/superpowers/specs/2026-05-17-profile-header-and-cosmetic-polish-design.md](docs/superpowers/specs/2026-05-17-profile-header-and-cosmetic-polish-design.md)

---

## File map

**Create:**
- `components/ProfileStatsLine.tsx` — pure presentational stats line + exported `filterStatsItems` helper
- `components/BadgeChip.tsx` — pure presentational rarity-aware badge
- `tests/unit/profile-stats-line.test.ts` — unit test on `filterStatsItems` helper
- `tests/unit/rarity-tables.test.ts` — unit test asserting every rarity has entries in new lookup tables

**Modify:**
- `lib/rarity.ts` — add `RARITY_GRADIENT_BG`, `RARITY_GLOW_SHADOW`, `RARITY_ANIMATION` lookup tables
- `lib/cosmetics.ts` — `NameColorSlug` union grows to 13; `NAME_COLORS` adds 5 entries; `gold` className upgraded
- `lib/cosmetics-store.ts` — `NAME_COLORS` array grows from 8 to 13 entries with new `group: 'basic' | 'premium'` field
- `components/PixieSelector.tsx` — Name Color section renders Basic + Premium subsections from `group` field
- `components/CompanionDisplay.tsx` — **NOT TOUCHED** (out of scope per spec)
- `app/dashboard/page.tsx` — add `<ProfileStatsLine>` under email; swap inline badge spans to `<BadgeChip>`
- `app/dashboard/BadgeSection.tsx` — swap inline badge spans to `<BadgeChip>`
- `app/u/[id]/page.tsx` — remove 4-card grid + "Member since" + country `<p>` lines, replace with `<ProfileStatsLine>`; swap Trophy Case items to `<BadgeChip>`

**Not touched:**
- `app/leaderboard/page.tsx`, `app/it/leaderboard/page.tsx` (already updated in commit `0c29821`, dense format kept)
- `app/api/profile/equip-*` (no API changes)
- Supabase migrations (no schema change)
- Stripe wiring (no pricing change)

---

## Task 1: Expand `lib/rarity.ts` with new lookup tables

**Files:**
- Modify: `lib/rarity.ts`
- Create: `tests/unit/rarity-tables.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/unit/rarity-tables.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import {
  RARITY_STYLES,
  RARITY_GLOW,
  RARITY_GRADIENT_BG,
  RARITY_GLOW_SHADOW,
  RARITY_ANIMATION,
  type Rarity,
} from '@/lib/rarity'

const ALL_RARITIES: Rarity[] = ['common', 'rare', 'epic', 'legendary']

describe('rarity lookup tables', () => {
  it('every rarity has an entry in every lookup table', () => {
    for (const r of ALL_RARITIES) {
      expect(RARITY_STYLES[r], `RARITY_STYLES missing ${r}`).toBeTruthy()
      expect(RARITY_GLOW[r], `RARITY_GLOW missing ${r}`).toBeTruthy()
      expect(RARITY_GRADIENT_BG[r], `RARITY_GRADIENT_BG missing ${r}`).toBeDefined()
      expect(RARITY_GLOW_SHADOW[r], `RARITY_GLOW_SHADOW missing ${r}`).toBeDefined()
      expect(RARITY_ANIMATION[r], `RARITY_ANIMATION missing ${r}`).toBeDefined()
    }
  })

  it('common rarity has empty string for shadow + animation (no visual treatment)', () => {
    expect(RARITY_GLOW_SHADOW.common).toBe('')
    expect(RARITY_ANIMATION.common).toBe('')
  })

  it('legendary rarity has an animation class', () => {
    expect(RARITY_ANIMATION.legendary.length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/rarity-tables.test.ts`

Expected: FAIL with "imports `RARITY_GRADIENT_BG`, `RARITY_GLOW_SHADOW`, `RARITY_ANIMATION` not exported from `@/lib/rarity`" (or undefined property errors).

- [ ] **Step 3: Add the new lookup tables to `lib/rarity.ts`**

Append these exports to the bottom of `lib/rarity.ts` (after the existing `RARITY_ORDER`):

```ts

/**
 * Background gradient applied to rarity-tiered chips (badges, frame previews).
 * common is a flat tint; rare/epic/legendary get richer, multi-stop gradients
 * so that paying for an epic badge is visually distinguishable from a common.
 */
export const RARITY_GRADIENT_BG: Record<Rarity, string> = {
  common:    'bg-slate-500/10',
  rare:      'bg-gradient-to-br from-blue-500/15 to-blue-700/10',
  epic:      'bg-gradient-to-br from-purple-500/20 to-fuchsia-700/15',
  legendary: 'bg-gradient-to-br from-yellow-400/20 via-amber-500/15 to-orange-500/20',
}

/**
 * Always-on shadow (not hover-only). RARITY_GLOW above is hover-only; this
 * one renders the glow at rest so that rare+ badges always look special.
 * common is intentionally empty so common badges stay quiet.
 */
export const RARITY_GLOW_SHADOW: Record<Rarity, string> = {
  common:    '',
  rare:      'shadow-blue-500/30 shadow-md',
  epic:      'shadow-purple-500/40 shadow-lg',
  legendary: 'shadow-amber-500/50 shadow-xl',
}

/**
 * Animation / interaction class layered on top of the chip. Epic gets a
 * hover scale; legendary gets a slow pulse so they stand out on long lists.
 */
export const RARITY_ANIMATION: Record<Rarity, string> = {
  common:    '',
  rare:      '',
  epic:      'hover:scale-110 transition-transform',
  legendary: 'animate-pulse',
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/rarity-tables.test.ts`

Expected: PASS, 3 tests.

- [ ] **Step 5: Stage**

```bash
git add lib/rarity.ts tests/unit/rarity-tables.test.ts
```

---

## Task 2: Expand `lib/cosmetics.ts` NAME_COLORS with 5 premium slugs + upgrade gold

**Files:**
- Modify: `lib/cosmetics.ts`
- Test: `tests/unit/cosmetics-catalog.test.ts` (existing — will fail at end of Task 2 and pass after Task 3)

- [ ] **Step 1: Read current state of `lib/cosmetics.ts` NAME_COLORS section**

Open `lib/cosmetics.ts` and locate the `NameColorSlug` union (around line 94) and the `NAME_COLORS` object (around line 106).

Current `NameColorSlug` (from tonight's commit `0c29821`):

```ts
export type NameColorSlug =
  | 'white'  | 'blue'   | 'purple' | 'green'
  | 'gold'   | 'pink'   | 'red'    | 'gradient'
```

- [ ] **Step 2: Update `NameColorSlug` union to include 5 new premium slugs**

Replace the existing `NameColorSlug` union with:

```ts
export type NameColorSlug =
  | 'white'    | 'blue'    | 'purple' | 'green'
  | 'pink'     | 'red'     | 'gradient'
  | 'gold'     | 'steel'   | 'silver' | 'platinum'
  | 'diamond'  | 'rose_gold'
```

- [ ] **Step 3: Update `NAME_COLORS` object with new entries + upgraded gold**

Replace the entire `NAME_COLORS` object with:

```ts
export const NAME_COLORS: Record<NameColorSlug, NameColorDef> = {
  // ── Basic colors (flat Tailwind) ───────────────────────────────────────
  white:    { slug: 'white',    className: 'text-white',       label: 'White' },
  blue:     { slug: 'blue',     className: 'text-blue-400',    label: 'Blue' },
  purple:   { slug: 'purple',   className: 'text-purple-400',  label: 'Purple' },
  green:    { slug: 'green',    className: 'text-emerald-400', label: 'Green' },
  pink:     { slug: 'pink',     className: 'text-pink-400',    label: 'Pink' },
  red:      { slug: 'red',      className: 'text-red-400',     label: 'Red' },
  gradient: { slug: 'gradient', className: 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent', label: 'Gradient' },

  // ── Premium colors (metallic / gemstone gradients) ─────────────────────
  // gold upgraded from text-yellow-400 (solid) to a 3-stop metallic gradient.
  // Existing users with name_color='gold' see the upgrade automatically.
  gold:      { slug: 'gold',      className: 'bg-gradient-to-r from-yellow-200 via-amber-400 to-orange-500 bg-clip-text text-transparent', label: 'Gold' },
  steel:     { slug: 'steel',     className: 'bg-gradient-to-r from-slate-300 via-zinc-200 to-slate-400 bg-clip-text text-transparent',    label: 'Steel' },
  silver:    { slug: 'silver',    className: 'bg-gradient-to-r from-gray-300 via-white to-gray-400 bg-clip-text text-transparent',          label: 'Silver' },
  platinum:  { slug: 'platinum',  className: 'bg-gradient-to-r from-slate-200 via-blue-50 to-slate-300 bg-clip-text text-transparent',       label: 'Platinum' },
  diamond:   { slug: 'diamond',   className: 'bg-gradient-to-r from-cyan-200 via-pink-200 to-purple-300 bg-clip-text text-transparent',     label: 'Diamond' },
  rose_gold: { slug: 'rose_gold', className: 'bg-gradient-to-r from-pink-300 via-amber-200 to-pink-400 bg-clip-text text-transparent',      label: 'Rose Gold' },
}
```

- [ ] **Step 4: Run the existing sync test — it MUST still fail at this point**

Run: `npm test -- tests/unit/cosmetics-catalog.test.ts`

Expected: FAIL on "renderer dictionary contains exactly the picker slug set" because `lib/cosmetics-store.ts` still only has 8 slugs while `lib/cosmetics.ts` now has 13. This is the protective failure — proves the sync test catches drift.

Do NOT proceed past this step until you see the failure. If the test passes here, something is wrong.

- [ ] **Step 5: Stage** (but do not commit; test still failing — Task 3 fixes it)

```bash
git add lib/cosmetics.ts
```

---

## Task 3: Expand `lib/cosmetics-store.ts` NAME_COLORS with same 5 slugs + group field

**Files:**
- Modify: `lib/cosmetics-store.ts`
- Test: `tests/unit/cosmetics-catalog.test.ts` (existing — turns green at end of Task 3)

- [ ] **Step 1: Read current `NAME_COLORS` shape in `lib/cosmetics-store.ts`**

The current array (around line 151) is:

```ts
export const NAME_COLORS: { label: string; class: string; value: string }[] = [
  { label: 'White',    class: 'text-white',       value: 'white'    },
  // ... 7 more
]
```

PixieSelector imports this array and renders one button per entry.

- [ ] **Step 2: Add `group` field to the type + add 5 premium entries**

Replace the entire `NAME_COLORS` declaration (and its type) with:

```ts
export type NameColorGroup = 'basic' | 'premium'

export const NAME_COLORS: { label: string; class: string; value: string; group: NameColorGroup }[] = [
  // ── Basic group ────────────────────────────────────────────────────────
  { label: 'White',    class: 'text-white',       value: 'white',    group: 'basic'   },
  { label: 'Blue',     class: 'text-blue-400',    value: 'blue',     group: 'basic'   },
  { label: 'Purple',   class: 'text-purple-400',  value: 'purple',   group: 'basic'   },
  { label: 'Green',    class: 'text-emerald-400', value: 'green',    group: 'basic'   },
  { label: 'Pink',     class: 'text-pink-400',    value: 'pink',     group: 'basic'   },
  { label: 'Red',      class: 'text-red-400',     value: 'red',      group: 'basic'   },
  { label: 'Gradient', class: 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent', value: 'gradient', group: 'basic' },

  // ── Premium group ──────────────────────────────────────────────────────
  // Match the className verbatim with lib/cosmetics.ts NAME_COLORS so the
  // picker preview swatch and the rendered display name look identical.
  { label: 'Gold',      class: 'bg-gradient-to-r from-yellow-200 via-amber-400 to-orange-500 bg-clip-text text-transparent', value: 'gold',      group: 'premium' },
  { label: 'Steel',     class: 'bg-gradient-to-r from-slate-300 via-zinc-200 to-slate-400 bg-clip-text text-transparent',    value: 'steel',     group: 'premium' },
  { label: 'Silver',    class: 'bg-gradient-to-r from-gray-300 via-white to-gray-400 bg-clip-text text-transparent',          value: 'silver',    group: 'premium' },
  { label: 'Platinum',  class: 'bg-gradient-to-r from-slate-200 via-blue-50 to-slate-300 bg-clip-text text-transparent',       value: 'platinum',  group: 'premium' },
  { label: 'Diamond',   class: 'bg-gradient-to-r from-cyan-200 via-pink-200 to-purple-300 bg-clip-text text-transparent',     value: 'diamond',   group: 'premium' },
  { label: 'Rose Gold', class: 'bg-gradient-to-r from-pink-300 via-amber-200 to-pink-400 bg-clip-text text-transparent',      value: 'rose_gold', group: 'premium' },
]
```

- [ ] **Step 3: Run the sync test — should now PASS**

Run: `npm test -- tests/unit/cosmetics-catalog.test.ts`

Expected: PASS, 5 tests. Both files now declare the same 13 slugs.

- [ ] **Step 4: Run the full test suite to confirm no other test regressed**

Run: `npm test`

Expected: All previously-passing tests still pass + the catalog test still passes.

- [ ] **Step 5: Stage**

```bash
git add lib/cosmetics-store.ts
```

---

## Task 4: Create `components/BadgeChip.tsx`

**Files:**
- Create: `components/BadgeChip.tsx`

No unit test for this component — it's pure JSX composition with classes drawn from `lib/rarity.ts` (which IS unit-tested in Task 1). Visual correctness is verified manually in Task 10.

- [ ] **Step 1: Create the new component**

Create `components/BadgeChip.tsx`:

```tsx
/**
 * BadgeChip — rarity-aware chip used for badges (and any cosmetic that
 * carries a rarity tier). Pure presentational, no client hooks.
 *
 * The visual class composition is driven entirely by lookup tables in
 * lib/rarity.ts so that badges across the app stay consistent. To change
 * how an epic badge looks, edit lib/rarity.ts — not this component.
 */

import {
  RARITY_STYLES,
  RARITY_GRADIENT_BG,
  RARITY_GLOW_SHADOW,
  RARITY_ANIMATION,
  type Rarity,
} from '@/lib/rarity'

type Size = 'sm' | 'md' | 'lg'

interface Props {
  emoji: string
  rarity: Rarity
  /** Accessible label and tooltip. Required for screen readers. */
  title: string
  size?: Size
  className?: string
}

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'text-base px-2 py-0.5',
  md: 'text-xl px-2.5 py-1',
  lg: 'text-3xl px-3 py-2',
}

export default function BadgeChip({
  emoji,
  rarity,
  title,
  size = 'md',
  className = '',
}: Props) {
  return (
    <span
      title={title}
      aria-label={title}
      role="img"
      className={`
        inline-flex items-center justify-center rounded-xl border
        ${SIZE_CLASSES[size]}
        ${RARITY_STYLES[rarity]}
        ${RARITY_GRADIENT_BG[rarity]}
        ${RARITY_GLOW_SHADOW[rarity]}
        ${RARITY_ANIMATION[rarity]}
        ${className}
      `.replace(/\s+/g, ' ').trim()}
    >
      {emoji}
    </span>
  )
}
```

- [ ] **Step 2: Sanity check — typecheck imports**

Run: `npx tsc --noEmit`

Expected: clean (no errors). If `Rarity` type fails to import, double-check the import path.

- [ ] **Step 3: Stage**

```bash
git add components/BadgeChip.tsx
```

---

## Task 5: Create `components/ProfileStatsLine.tsx` + filter helper + unit test

**Files:**
- Create: `components/ProfileStatsLine.tsx`
- Create: `tests/unit/profile-stats-line.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/unit/profile-stats-line.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { filterStatsItems, type StatsLineItem } from '@/components/ProfileStatsLine'

describe('filterStatsItems', () => {
  it('returns all items when none have show=false', () => {
    const items: StatsLineItem[] = [
      { icon: '🗳', value: 100, label: 'votes' },
      { icon: '⚡', value: 'Lv.5' },
    ]
    expect(filterStatsItems(items)).toHaveLength(2)
  })

  it('treats absent show as visible (default true)', () => {
    const items: StatsLineItem[] = [{ icon: '🗳', value: 100 }]
    expect(filterStatsItems(items)).toHaveLength(1)
  })

  it('treats show=true as visible', () => {
    const items: StatsLineItem[] = [{ icon: '🗳', value: 100, show: true }]
    expect(filterStatsItems(items)).toHaveLength(1)
  })

  it('drops items with show=false from the DOM entirely', () => {
    const items: StatsLineItem[] = [
      { icon: '🗳', value: 100, label: 'votes' },
      { icon: '🔥', value: 0, label: 'day streak', show: false },
      { icon: '⚡', value: 'Lv.5' },
    ]
    const visible = filterStatsItems(items)
    expect(visible).toHaveLength(2)
    expect(visible.find((i) => i.icon === '🔥')).toBeUndefined()
  })

  it('returns empty array when every item is hidden', () => {
    const items: StatsLineItem[] = [
      { icon: '🔥', value: 0, show: false },
      { icon: '🏆', value: 0, show: false },
    ]
    expect(filterStatsItems(items)).toEqual([])
  })

  it('handles empty input', () => {
    expect(filterStatsItems([])).toEqual([])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/profile-stats-line.test.ts`

Expected: FAIL with import error — module `@/components/ProfileStatsLine` not found.

- [ ] **Step 3: Create the component + exported helper**

Create `components/ProfileStatsLine.tsx`:

```tsx
/**
 * ProfileStatsLine — horizontal bullet-separator stats display used on the
 * dashboard header and the /u/[id] hero. Pure presentational.
 *
 * Items with show=false are filtered OUT of the DOM entirely (not just
 * visually hidden) so screen readers never announce empty stats.
 *
 * Render shape, given two visible items "🗳 1,234 votes" and "⚡ Lv.8":
 *   <div>
 *     <span><span aria-hidden>🗳</span> 1,234 votes</span>
 *     <span aria-hidden>·</span>
 *     <span><span aria-hidden>⚡</span> Lv.8</span>
 *   </div>
 */

import { Fragment } from 'react'

export interface StatsLineItem {
  /** Emoji rendered before the value. Decorative only (aria-hidden). */
  icon: string
  /** Primary text — number or short string ("Lv.8", "May 2026"). */
  value: string | number
  /** Optional suffix label ("votes", "day streak"). */
  label?: string
  /** When true, label appears BEFORE the value ("Member since May 2026"). */
  prefix?: boolean
  /** Default true. False filters this item out of the DOM. */
  show?: boolean
}

/** Pure helper — keep visible items only, preserving order. */
export function filterStatsItems(items: StatsLineItem[]): StatsLineItem[] {
  return items.filter((i) => i.show !== false)
}

interface Props {
  items: StatsLineItem[]
  align?: 'left' | 'center'
  className?: string
}

function formatItemText(item: StatsLineItem): string {
  if (item.prefix && item.label) return `${item.label} ${item.value}`
  if (!item.prefix && item.label) return `${item.value} ${item.label}`
  return String(item.value)
}

export default function ProfileStatsLine({ items, align = 'left', className = '' }: Props) {
  const visible = filterStatsItems(items)
  if (visible.length === 0) return null

  const justify = align === 'center' ? 'justify-center' : ''

  return (
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--muted)] ${justify} ${className}`.trim()}
    >
      {visible.map((item, idx) => (
        <Fragment key={`${item.icon}-${item.value}-${idx}`}>
          {idx > 0 && <span aria-hidden="true" className="text-slate-600">·</span>}
          <span className="inline-flex items-center gap-1">
            <span aria-hidden="true">{item.icon}</span>
            <span>{formatItemText(item)}</span>
          </span>
        </Fragment>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/profile-stats-line.test.ts`

Expected: PASS, 6 tests.

- [ ] **Step 5: Run the full suite to confirm no regression**

Run: `npm test`

Expected: All tests pass (now 14+ total — 5 catalog + 6 profile-stats-line + 3 rarity-tables + existing safe-redirect tests).

- [ ] **Step 6: Stage**

```bash
git add components/ProfileStatsLine.tsx tests/unit/profile-stats-line.test.ts
```

---

## Task 6: Refactor `PixieSelector` Name Color section into Basic / Premium subsections

**Files:**
- Modify: `components/PixieSelector.tsx`

No unit test — refactor of presentational picker logic. Verified visually in Task 10.

- [ ] **Step 1: Locate the Name Color section in `PixieSelector.tsx`**

Open `components/PixieSelector.tsx` and find the section that starts with `{/* ── Name Color section ── */}` (around line 478). The relevant inner block (around lines 484-507) renders a single flex-wrap list of all `NAME_COLORS` entries.

- [ ] **Step 2: Replace the single-list rendering with two grouped subsections**

Find this block:

```tsx
{hasNameBundle ? (
  <div className="flex flex-wrap gap-2">
    {NAME_COLORS.map(color => {
      const isActive    = nameColor === color.value
      const isEquipping_ = equipping === ('name_color_' + color.value)
      return (
        <button
          key={color.value}
          onClick={() => handleEquipNameColor(color.value)}
          disabled={isEquipping_ || isActive}
          className={`
            px-3 py-1.5 rounded-lg border text-xs font-bold transition-all duration-150
            ${isActive
              ? 'border-blue-500/60 bg-blue-500/10 ring-1 ring-blue-500'
              : 'border-white/10 bg-white/5 hover:border-white/20'
            }
            disabled:cursor-not-allowed
          `}
        >
          <span className={color.class}>{color.label}</span>
          {isActive && <span className="ml-1 text-blue-400">✓</span>}
        </button>
      )
    })}
  </div>
) : (
```

Replace with this block (note: only the `hasNameBundle ? ( ... ) : (` truthy branch is rewritten; the falsy branch is unchanged):

```tsx
{hasNameBundle ? (
  <div className="space-y-3">
    {(['basic', 'premium'] as const).map((group) => {
      const groupColors = NAME_COLORS.filter((c) => c.group === group)
      if (groupColors.length === 0) return null
      const groupLabel = locale === 'it'
        ? (group === 'basic' ? 'Base' : 'Premium')
        : (group === 'basic' ? 'Basic' : 'Premium')
      return (
        <div key={group}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">
            {groupLabel}
          </p>
          <div className="flex flex-wrap gap-2">
            {groupColors.map((color) => {
              const isActive     = nameColor === color.value
              const isEquipping_ = equipping === ('name_color_' + color.value)
              return (
                <button
                  key={color.value}
                  onClick={() => handleEquipNameColor(color.value)}
                  disabled={isEquipping_ || isActive}
                  className={`
                    px-3 py-1.5 rounded-lg border text-xs font-bold transition-all duration-150
                    ${isActive
                      ? 'border-blue-500/60 bg-blue-500/10 ring-1 ring-blue-500'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                    }
                    disabled:cursor-not-allowed
                  `}
                >
                  <span className={color.class}>{color.label}</span>
                  {isActive && <span className="ml-1 text-blue-400">✓</span>}
                </button>
              )
            })}
          </div>
        </div>
      )
    })}
  </div>
) : (
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`

Expected: clean. The picker uses `NAME_COLORS` from `lib/cosmetics-store.ts` which now has the `group` field per Task 3.

- [ ] **Step 4: Stage**

```bash
git add components/PixieSelector.tsx
```

---

## Task 7: Refactor `app/dashboard/BadgeSection.tsx` to use `BadgeChip`

**Files:**
- Modify: `app/dashboard/BadgeSection.tsx`

- [ ] **Step 1: Inspect the current badge chip JSX in BadgeSection**

Open `app/dashboard/BadgeSection.tsx` and locate the badge rendering (search for `RARITY_STYLES` or `b.badges.emoji` inside JSX). The current chip is something like:

```tsx
<span
  key={b.badge_id}
  title={b.badges.name}
  className={`text-xl px-2.5 py-1 rounded-xl border ${RARITY_STYLES[b.badges.rarity] ?? RARITY_STYLES.common}`}
>
  {b.badges.emoji}
</span>
```

(The exact wrapping may differ — read the file before editing.)

- [ ] **Step 2: Add the BadgeChip import at the top of the file**

Add this import alongside the existing imports:

```tsx
import BadgeChip from '@/components/BadgeChip'
import type { Rarity } from '@/lib/rarity'
```

If `RARITY_STYLES` was imported and is no longer used anywhere else in the file after the refactor, remove that import too.

- [ ] **Step 3: Replace the inline chip span with BadgeChip**

Find every `<span ... className={`...${RARITY_STYLES[b.badges.rarity]}...`}>{b.badges.emoji}</span>` in `BadgeSection.tsx` and replace each with:

```tsx
<BadgeChip
  key={b.badge_id}
  emoji={b.badges.emoji}
  rarity={b.badges.rarity as Rarity}
  title={b.badges.name}
  size="md"
/>
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`

Expected: clean.

- [ ] **Step 5: Stage**

```bash
git add app/dashboard/BadgeSection.tsx
```

---

## Task 8: Update `app/dashboard/page.tsx` — add ProfileStatsLine + swap badges to BadgeChip

**Files:**
- Modify: `app/dashboard/page.tsx`

- [ ] **Step 1: Add the new imports**

Open `app/dashboard/page.tsx`. The cosmetics imports already include `CosmeticName` and `CosmeticAvatar` from tonight's commit `0c29821`. Add these alongside them:

```tsx
import ProfileStatsLine, { type StatsLineItem } from '@/components/ProfileStatsLine'
import BadgeChip from '@/components/BadgeChip'
import type { Rarity } from '@/lib/rarity'
import { getLevelInfo } from '@/lib/missions'
```

(If `getLevelInfo` is already imported, skip that line.)

- [ ] **Step 2: Compute the stats items inside the header IIFE**

The header is already wrapped in an `(() => { ... })()` IIFE from tonight's commit. Inside that IIFE — AFTER the existing `headerEmoji` computation and BEFORE the `return (` — add:

```tsx
        const levelInfo = getLevelInfo(profile?.xp ?? 0)
        const statsItems: StatsLineItem[] = [
          { icon: '🗳', value: (profile?.votes_count ?? 0).toLocaleString(), label: 'votes' },
          { icon: '⚡', value: `Lv.${levelInfo.level}` },
          { icon: '🔥', value: profile?.streak_days ?? 0, label: 'day streak', show: (profile?.streak_days ?? 0) > 0 },
        ]
```

- [ ] **Step 3: Render `<ProfileStatsLine>` under the email line**

Inside the same IIFE return, find the existing email paragraph and insert the stats line directly below it. The block goes from:

```tsx
              <div className="min-w-0">
                <h1 className="text-3xl font-black text-white mb-1">
                  Hey,{' '}
                  <CosmeticName ... />{' '}
                  👋
                </h1>
                <p className="text-[var(--muted)] text-sm truncate">{profile?.email ?? user.email}</p>
              </div>
```

To:

```tsx
              <div className="min-w-0">
                <h1 className="text-3xl font-black text-white mb-1">
                  Hey,{' '}
                  <CosmeticName
                    name={profile?.display_name?.split(' ')[0] ?? 'there'}
                    glow={cosmetics.glow}
                    nameColor={cosmetics.nameColor}
                  />{' '}
                  👋
                </h1>
                <p className="text-[var(--muted)] text-sm truncate">{profile?.email ?? user.email}</p>
                <ProfileStatsLine align="left" items={statsItems} className="mt-2" />
              </div>
```

(The exact `CosmeticName` props are unchanged from tonight's commit — only the new `<ProfileStatsLine ... />` line is added.)

- [ ] **Step 4: Swap top-right badge `<span>` chips for `<BadgeChip>`**

In the same IIFE, the top-right badges block currently renders inline:

```tsx
            {userBadges.length > 0 && (
              <div className="flex gap-1.5 flex-wrap justify-end mt-1">
                {userBadges.filter(b => b.badges != null).slice(0, 5).map(b => (
                  <span
                    key={b.badge_id}
                    title={b.badges.name}
                    className={`text-xl px-2.5 py-1 rounded-xl border ${RARITY_STYLES[b.badges.rarity] ?? RARITY_STYLES.common}`}
                  >
                    {b.badges.emoji}
                  </span>
                ))}
              </div>
            )}
```

Replace the `<span>` with `<BadgeChip>`:

```tsx
            {userBadges.length > 0 && (
              <div className="flex gap-1.5 flex-wrap justify-end mt-1">
                {userBadges.filter(b => b.badges != null).slice(0, 5).map(b => (
                  <BadgeChip
                    key={b.badge_id}
                    emoji={b.badges.emoji}
                    rarity={b.badges.rarity as Rarity}
                    title={b.badges.name}
                    size="md"
                  />
                ))}
              </div>
            )}
```

If the local `RARITY_STYLES` const in `app/dashboard/page.tsx` (declared near the top, around line 74) is no longer used elsewhere in this file, remove it. Use grep to confirm: `grep -n 'RARITY_STYLES' app/dashboard/page.tsx` — if all hits are in the const definition itself, delete the const.

- [ ] **Step 5: Typecheck + sanity**

Run: `npx tsc --noEmit`

Expected: clean.

- [ ] **Step 6: Stage**

```bash
git add app/dashboard/page.tsx
```

---

## Task 9: Update `app/u/[id]/page.tsx` — replace stats grid + member-since + country with ProfileStatsLine; swap Trophy Case to BadgeChip

**Files:**
- Modify: `app/u/[id]/page.tsx`

- [ ] **Step 1: Add the new imports**

The file already imports `CosmeticAvatar`, `CosmeticName`, and `getEquippedCosmetics` from tonight's commit. Add alongside them:

```tsx
import ProfileStatsLine, { type StatsLineItem } from '@/components/ProfileStatsLine'
import BadgeChip from '@/components/BadgeChip'
import type { Rarity } from '@/lib/rarity'
```

- [ ] **Step 2: Confirm `created_at` and `country_code` are in the SELECT**

The SELECT (around line 48) should already include `created_at` and `country_code` from prior work. Confirm via:

`grep -n "created_at\|country_code" app/u/\\[id\\]/page.tsx`

If they're missing, add them to the `.select(...)` string.

- [ ] **Step 3: Build the statsItems array inside the hero IIFE**

The hero is already wrapped in an IIFE from tonight's commit. Inside the IIFE, after the existing `const cosmetics = ...` line, add:

```tsx
        const memberSince = new Date(profile.created_at).toLocaleDateString('en-GB', {
          month: 'long',
          year:  'numeric',
        })
        const statsItems: StatsLineItem[] = [
          { icon: '🗳', value: votesCount.toLocaleString(), label: 'votes' },
          { icon: '⚡', value: `Lv.${levelInfo.level}` },
          { icon: '🔥', value: streakDays, label: 'day streak', show: streakDays > 0 },
          { icon: '🏆', value: badges.length, label: 'badges', show: badges.length > 0 },
          { icon: '📍', value: profile.country_code ?? '', show: !!profile.country_code },
          { icon: '📅', value: memberSince, label: 'Member since', prefix: true },
        ]
```

- [ ] **Step 4: Delete the 4-card stats grid + "Member since" + country lines**

Inside the hero IIFE, locate this block (currently ~30 lines):

```tsx
        {profile.is_premium && (
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-yellow-400 border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 rounded-full mb-3">
            ⭐ Premium
          </span>
        )}
        <p className="text-[var(--muted)] text-sm mt-2">Member since {joinDate}</p>
        {profile.country_code && (
          <p className="text-[var(--muted)] text-sm mt-1">📍 {profile.country_code}</p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 max-w-sm mx-auto">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-2xl font-black text-blue-400">{votesCount.toLocaleString()}</p>
            <p className="text-xs text-[var(--muted)] mt-1">Dilemmas voted</p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-2xl font-black text-yellow-400">{badges.length}</p>
            <p className="text-xs text-[var(--muted)] mt-1">Trophies earned</p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className={`text-2xl font-black ${levelInfo.color}`}>
              Lv.{levelInfo.level}
            </p>
            <p className="text-xs text-[var(--muted)] mt-1">{xp.toLocaleString()} XP</p>
          </div>
          {streakDays > 0 && (
            <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-4">
              <p className="text-2xl font-black text-orange-400">🔥 {streakDays}</p>
              <p className="text-xs text-[var(--muted)] mt-1">Day streak</p>
            </div>
          )}
          {streakDays === 0 && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-2xl font-black text-[var(--muted)]">—</p>
              <p className="text-xs text-[var(--muted)] mt-1">No streak yet</p>
            </div>
          )}
        </div>
```

Replace it with:

```tsx
        {profile.is_premium && (
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-yellow-400 border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 rounded-full mb-3">
            ⭐ Premium
          </span>
        )}

        <ProfileStatsLine align="center" items={statsItems} className="mt-4" />
```

(Keep the Premium badge — only the grid + "Member since" `<p>` + country `<p>` are removed.)

- [ ] **Step 5: Swap Trophy Case items to `<BadgeChip>`**

Further down in the file, locate the Trophy Case section (around line 185-205). Current rendering:

```tsx
<div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
  {sortedBadges.map((b) => (
    <div
      key={b.badge_id}
      title={b.badges.description}
      className={`rounded-xl border p-3 text-center ${RARITY_STYLES[b.badges.rarity] ?? RARITY_STYLES.common}`}
    >
      <p className="text-3xl mb-1.5">{b.badges.emoji}</p>
      <p className="text-xs font-semibold leading-tight">{b.badges.name}</p>
      <p className="text-xs opacity-60 mt-0.5 capitalize">{b.badges.rarity}</p>
    </div>
  ))}
</div>
```

Replace with:

```tsx
<div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
  {sortedBadges.map((b) => (
    <div
      key={b.badge_id}
      title={b.badges.description}
      className="rounded-xl p-3 text-center flex flex-col items-center gap-1.5"
    >
      <BadgeChip
        emoji={b.badges.emoji}
        rarity={b.badges.rarity as Rarity}
        title={b.badges.name}
        size="lg"
      />
      <p className="text-xs font-semibold leading-tight text-white">{b.badges.name}</p>
      <p className="text-xs opacity-60 capitalize">{b.badges.rarity}</p>
    </div>
  ))}
</div>
```

(BadgeChip carries the rarity treatment; the wrapping `<div>` no longer needs the rarity classes.)

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`

Expected: clean.

- [ ] **Step 7: Stage**

```bash
git add app/u/\[id\]/page.tsx
```

---

## Task 10: Final verification + single commit + push

**Files:** none new; this task verifies and commits everything staged from Tasks 1-9.

- [ ] **Step 1: Confirm scope of staged changes**

Run:

```bash
git diff --cached --stat
```

Expected file list (10 entries):

- `app/dashboard/BadgeSection.tsx`
- `app/dashboard/page.tsx`
- `app/u/[id]/page.tsx`
- `components/BadgeChip.tsx` (new)
- `components/PixieSelector.tsx`
- `components/ProfileStatsLine.tsx` (new)
- `lib/cosmetics-store.ts`
- `lib/cosmetics.ts`
- `lib/rarity.ts`
- `tests/unit/profile-stats-line.test.ts` (new)
- `tests/unit/rarity-tables.test.ts` (new)

If any other file is staged (especially PM's working tree files like `PRODUCT_STRATEGY.md`, `ROADMAP.md`, `app/it/page.tsx`, content-generation-*.ts, or any `public/pixie/*.png`), unstage it:

```bash
git restore --staged <file>
```

- [ ] **Step 2: Confirm no PM working-tree files are accidentally included**

Run:

```bash
git diff --cached --name-only
```

Cross-check the output against the expected list above. Working-tree of the PM (uncommitted files PM had before this sprint started) must NOT appear.

- [ ] **Step 3: Run full test suite**

Run: `npm test`

Expected:
- `tests/unit/safe-redirect.test.ts`: 8 pass
- `tests/unit/cosmetics-catalog.test.ts`: 5 pass
- `tests/unit/rarity-tables.test.ts`: 3 pass (new)
- `tests/unit/profile-stats-line.test.ts`: 6 pass (new)

Total: 22 tests pass.

- [ ] **Step 4: Run typecheck**

Run: `npx tsc --noEmit`

Expected: no output (clean).

- [ ] **Step 5: Run production build**

Run: `npm run build`

Expected:
- Compiles cleanly
- Route classifications unchanged from the pre-sprint build:
  - `/dashboard` `ƒ` (Dynamic, expected)
  - `/u/[id]` `ƒ` (Dynamic, expected)
  - `/leaderboard` `○` (Static), `/it/leaderboard` `○` (Static)
- No warnings about missing imports or unused exports

- [ ] **Step 6: Whitespace / EOF check**

Run: `git diff --cached --check`

Expected: no output (clean).

- [ ] **Step 7: Single commit**

```bash
git commit -m "$(cat <<'EOF'
feat(profile): DeviantArt-style header + metallic name colors + rarity badge polish

Sprint PROFILE-HEADER-REDESIGN-01 — see
docs/superpowers/specs/2026-05-17-profile-header-and-cosmetic-polish-design.md
for the full design rationale.

New components:
- ProfileStatsLine — horizontal bullet-separator stats display used on
  dashboard header + /u/[id] hero. Pure presentational. Items with
  show=false are filtered OUT of the DOM (not just hidden).
- BadgeChip — rarity-aware chip composing class lookups from lib/rarity.ts
  so all badge surfaces stay consistent. Edit lib/rarity.ts to change
  per-rarity treatment globally.

Catalog expansion (additive, no breaking changes):
- 5 new premium name color slugs: steel, silver, platinum, diamond,
  rose_gold. gold upgraded from text-yellow-400 (solid) to a 3-stop
  metallic gradient. Existing users with name_color='gold' auto-upgrade.
- Both lib/cosmetics.ts and lib/cosmetics-store.ts NAME_COLORS catalogs
  declare the same 13 slugs; the existing tests/unit/cosmetics-catalog.test.ts
  enforces alignment automatically.
- lib/cosmetics-store.ts NAME_COLORS entries gain a group ('basic' | 'premium')
  field so PixieSelector renders two visible subsections.
- All 13 colors remain gated behind the single name_color_bundle purchase
  — no new Stripe price IDs.

Rarity treatment expansion in lib/rarity.ts:
- New RARITY_GRADIENT_BG — multi-stop gradients per rarity
- New RARITY_GLOW_SHADOW — always-on shadow (RARITY_GLOW remains hover-only)
- New RARITY_ANIMATION — epic gets hover:scale-110, legendary gets
  animate-pulse
- BadgeChip composes all of these in one place

Surface refactors (3 files):
- app/dashboard/page.tsx — adds ProfileStatsLine under email; swaps
  top-right badge spans for BadgeChip; removes the now-unused local
  RARITY_STYLES const where applicable.
- app/dashboard/BadgeSection.tsx — swaps inline chip spans for BadgeChip.
- app/u/[id]/page.tsx — removes the 4-card stat grid + "Member since" +
  country <p> lines; replaces with a single ProfileStatsLine including
  all 6 items (votes, level, streak, badges, country, member-since).
  Trophy Case items now use BadgeChip.

Out of scope (deferred):
- Multi-tier membership (CORE/PRO/PRO+/MAX) — HUMAN_ONLY, blocked on
  Premium €4.99 live QA validation
- Bio / tagline field — would require new DB column + UGC moderation
- Profile Views / Favourites / Watchers tracking — new DB columns
- Animated shimmer on name colors beyond legendary animate-pulse
- Leaderboard row redesign — kept dense format from 0c29821

Verification:
- npm test: 22/22 pass (8 existing safe-redirect + 5 catalog + 3 new
  rarity-tables + 6 new profile-stats-line)
- npx tsc --noEmit: clean
- npm run build: clean, no route reclassification
- git diff --check: clean

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 8: Verify commit + push**

Run:

```bash
git log --oneline origin/main..HEAD
```

Expected: exactly one new commit ahead of `origin/main`.

Then push:

```bash
git push origin main
```

Expected:
```
   46f79ab..<new-hash>  main -> main
```

- [ ] **Step 9: Post-push manual browser QA**

Wait ~2 minutes for the Vercel deploy to settle, then open in a real browser (curl is blocked by Vercel Attack Challenge Mode):

1. `https://splitvote.io/dashboard` — verify:
   - Stats line under your email shows: `🗳 N votes · ⚡ Lv.K · 🔥 streak`
   - Streak hidden if you're at 0
   - Top-right badges show rarity-appropriate styling (legendary pulses)

2. `https://splitvote.io/u/<your-user-id>` — verify:
   - 4-card grid is gone
   - Stats line shows: `🗳 N votes · ⚡ Lv.K · 🔥 Nd streak · 🏆 N badges · 📍 IT · 📅 Member since Month YYYY`
   - Items with 0 / null are not rendered (no empty spots)
   - Trophy Case items have rarity treatment (legendary glow, epic hover scale)

3. `https://splitvote.io/profile` → Cosmetics section — verify:
   - Name Color picker shows two subsection headers: "Basic" and "Premium"
   - Selecting `diamond` shows the prismatic gradient on your display name across dashboard, /u/[id], and leaderboard
   - Selecting `silver`, `platinum`, `gold` (now metallic) all render correctly

4. Mobile (375px viewport): stats line wraps onto at most 2 rows; legible.

5. Verify no regression on tonight's commit `0c29821`: equipping a frame still wraps the avatar; cosmetic glow still appears around the display name.

If any of the above fails, do NOT attempt incremental fixes — return to systematic-debugging skill Phase 1.

---

## Notes on TDD discipline

Tasks 1, 2 (in failure state), 3, and 5 are full TDD: failing test first, then implementation, then green test. Tasks 4 (BadgeChip), 6 (PixieSelector), 7 (BadgeSection), 8 (dashboard), and 9 (`/u/[id]`) are refactors / JSX swaps where logic is delegated to already-tested helpers — they don't carry their own unit tests; their correctness is validated by:

1. Typecheck (`npx tsc --noEmit` per task)
2. The existing cosmetics-catalog sync test (catches catalog drift)
3. The rarity-tables test (catches missing rarity entries)
4. Manual browser QA in Task 10 Step 9

Per the spec, this is intentional: visual correctness of presentational JSX is unreliable to unit-test without React Testing Library, and adding RTL is out of scope for this sprint.

## Reversibility

`git revert <commit-hash>` restores the pre-sprint state immediately. No data migration, no feature flag, no Stripe touch, no external service touch. The PM's working tree (uncommitted PRODUCT_STRATEGY.md, ROADMAP.md, app/it/page.tsx, content-generation-*.ts, 80+ pixie PNGs, scripts WIP) is unaffected because Task 10 Step 1-2 enforces scope before commit.

import { describe, it, expect } from 'vitest'
import {
  getCategoryHubCopy,
  getCategoryLabel,
  type HubLocale,
} from '@/lib/category-hub-copy'
import type { Category } from '@/lib/scenarios'

const ALL_CATEGORIES: Category[] = [
  'morality',
  'survival',
  'loyalty',
  'justice',
  'freedom',
  'technology',
  'society',
  'relationships',
  'lifestyle',
]

const LOCALES: HubLocale[] = ['en', 'it']

const FORBIDDEN_EN = [
  /\bthe world\b/i,           // anti-representativity
  /\bhumanity\b/i,
  /\bscientific(ally)?\b/i,
  /\beveryone agrees?\b/i,
]
const FORBIDDEN_IT = [
  /\bil mondo\b/i,
  /\bumanità\b/i,
  /\bscientific[ao](mente)?\b/i,
]

describe('getCategoryHubCopy', () => {
  it('returns a full shape for every category in EN', () => {
    for (const cat of ALL_CATEGORIES) {
      const hub = getCategoryHubCopy(cat, 'en')
      expect(hub.metaTitle.length).toBeGreaterThan(10)
      expect(hub.metaDescription.length).toBeGreaterThan(20)
      expect(hub.intro.length).toBeGreaterThan(40)
      expect(hub.tensions).toHaveLength(3)
      for (const t of hub.tensions) expect(t.length).toBeGreaterThan(3)
      expect(hub.ctaLabel.length).toBeGreaterThan(5)
      expect(hub.related.length).toBeGreaterThanOrEqual(2)
      expect(hub.related.length).toBeLessThanOrEqual(3)
    }
  })

  it('returns a full shape for every category in IT', () => {
    for (const cat of ALL_CATEGORIES) {
      const hub = getCategoryHubCopy(cat, 'it')
      expect(hub.metaTitle.length).toBeGreaterThan(10)
      expect(hub.metaDescription.length).toBeGreaterThan(20)
      expect(hub.intro.length).toBeGreaterThan(40)
      expect(hub.tensions).toHaveLength(3)
      expect(hub.ctaLabel.length).toBeGreaterThan(5)
      expect(hub.related.length).toBeGreaterThanOrEqual(2)
      expect(hub.related.length).toBeLessThanOrEqual(3)
    }
  })

  it('never lists the category itself in related', () => {
    for (const locale of LOCALES) {
      for (const cat of ALL_CATEGORIES) {
        const hub = getCategoryHubCopy(cat, locale)
        expect(hub.related).not.toContain(cat)
      }
    }
  })

  it('only references valid known categories in related', () => {
    const valid = new Set(ALL_CATEGORIES)
    for (const locale of LOCALES) {
      for (const cat of ALL_CATEGORIES) {
        const hub = getCategoryHubCopy(cat, locale)
        for (const r of hub.related) {
          expect(valid.has(r)).toBe(true)
        }
      }
    }
  })

  it('intros differ across categories — no boilerplate duplication', () => {
    for (const locale of LOCALES) {
      const intros = ALL_CATEGORIES.map((c) => getCategoryHubCopy(c, locale).intro)
      expect(new Set(intros).size).toBe(ALL_CATEGORIES.length)
    }
  })

  it('EN copy contains no representative / scientific claims', () => {
    for (const cat of ALL_CATEGORIES) {
      const hub = getCategoryHubCopy(cat, 'en')
      const blob = [
        hub.metaTitle,
        hub.metaDescription,
        hub.intro,
        ...hub.tensions,
        hub.ctaLabel,
      ].join(' | ')
      for (const re of FORBIDDEN_EN) {
        expect(blob).not.toMatch(re)
      }
    }
  })

  it('IT copy contains no representative / scientific claims', () => {
    for (const cat of ALL_CATEGORIES) {
      const hub = getCategoryHubCopy(cat, 'it')
      const blob = [
        hub.metaTitle,
        hub.metaDescription,
        hub.intro,
        ...hub.tensions,
        hub.ctaLabel,
      ].join(' | ')
      for (const re of FORBIDDEN_IT) {
        expect(blob).not.toMatch(re)
      }
    }
  })

  it('lifestyle uses a non-moral / lighter framing (EN)', () => {
    const hub = getCategoryHubCopy('lifestyle', 'en')
    const blob = `${hub.intro} ${hub.tensions.join(' ')}`.toLowerCase()
    expect(blob).not.toContain('right vs right')
    expect(blob).not.toContain('moral')
  })

  it('lifestyle uses a non-moral / lighter framing (IT)', () => {
    const hub = getCategoryHubCopy('lifestyle', 'it')
    const blob = `${hub.intro} ${hub.tensions.join(' ')}`.toLowerCase()
    expect(blob).not.toContain('giusto-contro-giusto')
    expect(blob).not.toContain('morale')
  })

  it('falls back to morality when called with an unknown category (legacy DB row)', () => {
    // @ts-expect-error — simulating a runtime category outside the union
    const fallbackEn = getCategoryHubCopy('unknown-legacy-category', 'en')
    expect(fallbackEn.intro).toBe(getCategoryHubCopy('morality', 'en').intro)
    // @ts-expect-error — simulating a runtime category outside the union
    const fallbackIt = getCategoryHubCopy('unknown-legacy-category', 'it')
    expect(fallbackIt.intro).toBe(getCategoryHubCopy('morality', 'it').intro)
  })

  it('SAME (category, locale) call always returns SAME copy — deterministic', () => {
    for (const cat of ALL_CATEGORIES) {
      const a = getCategoryHubCopy(cat, 'en')
      const b = getCategoryHubCopy(cat, 'en')
      expect(a).toEqual(b)
    }
  })

  it('mentions a key term naturally in the intro — EN "dilemmas", IT "dilemmi"', () => {
    for (const cat of ALL_CATEGORIES) {
      expect(getCategoryHubCopy(cat, 'en').intro.toLowerCase()).toContain('dilemma')
      expect(getCategoryHubCopy(cat, 'it').intro.toLowerCase()).toContain('dilemm')
    }
  })
})

describe('getCategoryLabel', () => {
  it('returns the English label for known categories', () => {
    expect(getCategoryLabel('morality', 'en')).toBe('Morality')
    expect(getCategoryLabel('lifestyle', 'en')).toBe('Lifestyle')
  })

  it('returns the Italian label for known categories', () => {
    expect(getCategoryLabel('morality', 'it')).toBe('Moralità')
    expect(getCategoryLabel('lifestyle', 'it')).toBe('Stile di vita')
  })
})

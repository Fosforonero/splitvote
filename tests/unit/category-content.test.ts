import { describe, it, expect } from 'vitest'
import { getCategoryContent } from '@/lib/categoryContent'
import { CATEGORIES } from '@/lib/scenarios'
import type { Category } from '@/lib/scenarios'

const ALL_CATEGORIES: Category[] = CATEGORIES
  .filter((c) => c.value !== 'all')
  .map((c) => c.value as Category)

const FORBIDDEN_EN_LIFESTYLE = [
  /\bscientific(ally)?\b/i,
  /\brepresents? the world\b/i,
  /\bhumanity\b/i,
]
const FORBIDDEN_IT_LIFESTYLE = [
  /\bscientific[ao](mente)?\b/i,
  /\brappresent[ao] il mondo\b/i,
  /\bumanità\b/i,
]

describe('getCategoryContent — full category parity', () => {
  it('returns non-null content for every category in EN', () => {
    for (const cat of ALL_CATEGORIES) {
      const c = getCategoryContent(cat, 'en')
      expect(c, `EN content missing for category "${cat}"`).not.toBeNull()
      expect(c!.editorial.length).toBeGreaterThan(40)
      expect(c!.faqHeading.length).toBeGreaterThan(0)
      expect(c!.faq.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('returns non-null content for every category in IT', () => {
    for (const cat of ALL_CATEGORIES) {
      const c = getCategoryContent(cat, 'it')
      expect(c, `IT content missing for category "${cat}"`).not.toBeNull()
      expect(c!.editorial.length).toBeGreaterThan(40)
      expect(c!.faqHeading.length).toBeGreaterThan(0)
      expect(c!.faq.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('returns null for unknown categories (legacy DB row)', () => {
    expect(getCategoryContent('unknown-legacy-category', 'en')).toBeNull()
    expect(getCategoryContent('unknown-legacy-category', 'it')).toBeNull()
  })

  it('FAQ Q&A pairs are non-empty and distinct within a category', () => {
    for (const locale of ['en', 'it'] as const) {
      for (const cat of ALL_CATEGORIES) {
        const c = getCategoryContent(cat, locale)!
        const questions = c.faq.map((x) => x.q)
        expect(new Set(questions).size, `${locale}/${cat}: duplicate FAQ questions`).toBe(questions.length)
        for (const item of c.faq) {
          expect(item.q.length).toBeGreaterThan(0)
          expect(item.a.length).toBeGreaterThan(20)
        }
      }
    }
  })
})

describe('lifestyle category — shape + light framing', () => {
  it('exists in EN with ≥ 3 FAQ entries', () => {
    const c = getCategoryContent('lifestyle', 'en')
    expect(c).not.toBeNull()
    expect(c!.faq.length).toBeGreaterThanOrEqual(3)
  })

  it('exists in IT with ≥ 3 FAQ entries', () => {
    const c = getCategoryContent('lifestyle', 'it')
    expect(c).not.toBeNull()
    expect(c!.faq.length).toBeGreaterThanOrEqual(3)
  })

  it('EN lifestyle content contains no representative/scientific claims', () => {
    const c = getCategoryContent('lifestyle', 'en')!
    const blob = [c.editorial, c.faqHeading, ...c.faq.flatMap((x) => [x.q, x.a])].join(' | ')
    for (const re of FORBIDDEN_EN_LIFESTYLE) {
      expect(blob).not.toMatch(re)
    }
  })

  it('IT lifestyle content contains no representative/scientific claims', () => {
    const c = getCategoryContent('lifestyle', 'it')!
    const blob = [c.editorial, c.faqHeading, ...c.faq.flatMap((x) => [x.q, x.a])].join(' | ')
    for (const re of FORBIDDEN_IT_LIFESTYLE) {
      expect(blob).not.toMatch(re)
    }
  })

  it('EN lifestyle editorial does not over-claim morality (light framing)', () => {
    const c = getCategoryContent('lifestyle', 'en')!
    expect(c.editorial.toLowerCase()).not.toContain('right vs right')
    expect(c.editorial.toLowerCase()).not.toContain('moral framework')
  })

  it('IT lifestyle editorial does not over-claim morality (light framing)', () => {
    const c = getCategoryContent('lifestyle', 'it')!
    expect(c.editorial.toLowerCase()).not.toContain('giusto-contro-giusto')
    expect(c.editorial.toLowerCase()).not.toContain('sistema morale')
  })
})

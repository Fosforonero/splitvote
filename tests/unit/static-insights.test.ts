import { describe, it, expect } from 'vitest'
import { getStaticInsight, hasStaticInsight } from '@/lib/static-insights'
import { scenarios } from '@/lib/scenarios'

const PILOT_IDS = [
  'rich-or-fair',
  'robot-judge',
  'censor-speech',
  'deepfake-expose',
  'prison-abolition',
] as const

const FORBIDDEN_EN_CLAIMS = [
  /\brepresents?\s+(?:the\s+)?world\b/i,
  /\bstatistically\s+representative\b/i,
  /\bscientifically\s+prove[ds]?\b/i,
]
const FORBIDDEN_IT_CLAIMS = [
  /\brappresent[ao]\s+il\s+mondo\b/i,
  /\bstatisticamente\s+rappresentativ[oa]\b/i,
  /\bscientificamente\s+dimostrat[oa]\b/i,
]

describe('static-insights — per-id pilot for 5 rewritten dilemmas', () => {
  it('every pilot id has an entry in the static-insights map', () => {
    for (const id of PILOT_IDS) {
      expect(hasStaticInsight(id), `missing static insight: ${id}`).toBe(true)
    }
  })

  it('every pilot id is also present in the static scenarios inventory', () => {
    const ids = new Set(scenarios.map((s) => s.id))
    for (const id of PILOT_IDS) {
      expect(ids.has(id), `static-insights references missing scenario id: ${id}`).toBe(true)
    }
  })

  it('every pilot id has both EN and IT insight, with all three fields populated', () => {
    for (const id of PILOT_IDS) {
      for (const locale of ['en', 'it'] as const) {
        const ins = getStaticInsight(id, locale)
        expect(ins, `${id}/${locale}: missing`).toBeDefined()
        expect(ins!.body, `${id}/${locale}: body empty`).toBeTruthy()
        expect(ins!.body!.length, `${id}/${locale}: body too short`).toBeGreaterThan(80)
        expect(ins!.whyPeopleSplit, `${id}/${locale}: whyPeopleSplit empty`).toBeTruthy()
        expect(ins!.whyPeopleSplit!.length, `${id}/${locale}: whyPeopleSplit too short`).toBeGreaterThan(60)
        expect(ins!.whatYourAnswerMaySuggest?.a, `${id}/${locale}: A interpretation empty`).toBeTruthy()
        expect(ins!.whatYourAnswerMaySuggest?.b, `${id}/${locale}: B interpretation empty`).toBeTruthy()
        expect(ins!.whatYourAnswerMaySuggest!.a.length, `${id}/${locale}: A too short`).toBeGreaterThan(40)
        expect(ins!.whatYourAnswerMaySuggest!.b.length, `${id}/${locale}: B too short`).toBeGreaterThan(40)
      }
    }
  })

  it('unknown ids return undefined (fall-through to category-level fallback)', () => {
    expect(getStaticInsight('not-a-real-id', 'en')).toBeUndefined()
    expect(getStaticInsight('not-a-real-id', 'it')).toBeUndefined()
    expect(hasStaticInsight('not-a-real-id')).toBe(false)
  })

  it('no statistical-representativeness or scientific-proof claims', () => {
    for (const id of PILOT_IDS) {
      const en = getStaticInsight(id, 'en')!
      const it = getStaticInsight(id, 'it')!
      const enBlob = [en.body, en.whyPeopleSplit, en.whatYourAnswerMaySuggest!.a, en.whatYourAnswerMaySuggest!.b].join(' | ')
      const itBlob = [it.body, it.whyPeopleSplit, it.whatYourAnswerMaySuggest!.a, it.whatYourAnswerMaySuggest!.b].join(' | ')
      for (const re of FORBIDDEN_EN_CLAIMS) {
        expect(enBlob, `${id}/en: forbidden phrase`).not.toMatch(re)
      }
      for (const re of FORBIDDEN_IT_CLAIMS) {
        expect(itBlob, `${id}/it: forbidden phrase`).not.toMatch(re)
      }
    }
  })

  it('does NOT include robot-judge-style category override that would leak into other scenarios', () => {
    // Static insights are per-id, not per-category — adding rich-or-fair must
    // not change the insight shown on other justice-category scenarios.
    expect(getStaticInsight('innocent-juror', 'en')).toBeUndefined()
    expect(getStaticInsight('rich-or-fair', 'en')).toBeDefined()
  })
})

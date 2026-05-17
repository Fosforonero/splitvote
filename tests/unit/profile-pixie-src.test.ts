import { describe, it, expect } from 'vitest'
import { getProfilePixieSrc } from '@/lib/pixie'

describe('getProfilePixieSrc', () => {
  it('returns null when use_pixie_avatar is false', () => {
    expect(getProfilePixieSrc({
      use_pixie_avatar: false,
      companion_species: 'spark',
      pixie_xp: { spark: 100 },
      votes_count: 100,
    })).toBeNull()
  })

  it('returns null when use_pixie_avatar is null', () => {
    expect(getProfilePixieSrc({
      use_pixie_avatar: null,
      companion_species: 'spark',
    })).toBeNull()
  })

  it('returns null for null/undefined profile', () => {
    expect(getProfilePixieSrc(null)).toBeNull()
    expect(getProfilePixieSrc(undefined)).toBeNull()
  })

  it('returns stage-1 path for new opted-in user with no pixie_xp', () => {
    expect(getProfilePixieSrc({
      use_pixie_avatar: true,
      companion_species: 'spark',
      pixie_xp: {},
      votes_count: 0,
    })).toBe('/pixie/spark/pixie-spark-stage-1.png')
  })

  it('uses species-specific pixie_xp to derive stage', () => {
    // banana species at 100 votes → stage 4
    expect(getProfilePixieSrc({
      use_pixie_avatar: true,
      companion_species: 'banana',
      pixie_xp: { banana: 100, spark: 5 },
      votes_count: 999,
    })).toBe('/pixie/banana/pixie-banana-stage-4.png')
  })

  it('falls back to votes_count when pixie_xp is empty', () => {
    // 50 votes total → stage 3
    expect(getProfilePixieSrc({
      use_pixie_avatar: true,
      companion_species: 'caffe',
      pixie_xp: {},
      votes_count: 50,
    })).toBe('/pixie/caffe/pixie-caffe-stage-3.png')
  })

  it('defaults species to spark when companion_species is missing', () => {
    expect(getProfilePixieSrc({
      use_pixie_avatar: true,
      companion_species: null,
      pixie_xp: {},
      votes_count: 10,
    })).toBe('/pixie/spark/pixie-spark-stage-2.png')
  })
})

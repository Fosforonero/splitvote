import { describe, it, expect } from 'vitest'
import { getProfilePixieSrc, getEffectiveSpecies } from '@/lib/pixie'

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

  it('ignoreToggle returns sprite even when use_pixie_avatar is false', () => {
    // Dashboard own-view path: user has not opted into public Pixie avatar,
    // but their private dashboard still shows the sprite.
    expect(getProfilePixieSrc(
      {
        use_pixie_avatar: false,
        companion_species: 'caffe',
        pixie_xp: { caffe: 50 },
        votes_count: 0,
      },
      { ignoreToggle: true },
    )).toBe('/pixie/caffe/pixie-caffe-stage-3.png')
  })

  it('ignoreToggle still returns null for null profile', () => {
    expect(getProfilePixieSrc(null, { ignoreToggle: true })).toBeNull()
  })

  it('prefers active Pixie skin species over companion_species', () => {
    // User picked spark in onboarding but equipped Pixie Devil from store.
    // Helper resolves to devil — what the user actually wants to see.
    expect(getProfilePixieSrc({
      use_pixie_avatar: true,
      companion_species: 'spark',
      pixie_xp: { active: 'pixie_devil', devil: 10 },
      votes_count: 0,
    })).toBe('/pixie/devil/pixie-devil-stage-2.png')
  })

  it('falls back to companion_species when no pixie skin is active', () => {
    expect(getProfilePixieSrc({
      use_pixie_avatar: true,
      companion_species: 'banana',
      pixie_xp: { banana: 50 },
      votes_count: 0,
    })).toBe('/pixie/banana/pixie-banana-stage-3.png')
  })
})

describe('getEffectiveSpecies', () => {
  it('returns active skin species when set', () => {
    expect(getEffectiveSpecies({
      companion_species: 'spark',
      pixie_xp: { active: 'pixie_devil' },
    })).toBe('devil')
  })

  it('falls back to companion_species when no active skin', () => {
    expect(getEffectiveSpecies({
      companion_species: 'banana',
      pixie_xp: {},
    })).toBe('banana')
  })

  it('defaults to spark when nothing is set', () => {
    expect(getEffectiveSpecies(null)).toBe('spark')
    expect(getEffectiveSpecies({ companion_species: null })).toBe('spark')
  })
})

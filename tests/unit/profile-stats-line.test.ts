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

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

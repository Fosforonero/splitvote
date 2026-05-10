'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'

interface Props {
  /** Where the FAB should send the user — typically /moral-dilemmas or /it/dilemmi-morali */
  href: string
  /** When true, FAB pulses subtly to nudge the user to vote */
  pulse?: boolean
  locale?: string
  /** Hide the FAB until scrollY exceeds this value (avoid clashing with hero CTAs) */
  showAfterY?: number
}

/**
 * Mobile-only floating action button — bottom-right, always reachable with the thumb.
 * Pulses when `pulse` is true (e.g. user hasn't voted today).
 * Hidden on md+ screens.
 */
export default function MobileFloatingVoteCTA({
  href,
  pulse = false,
  locale = 'en',
  showAfterY = 80,
}: Props) {
  const IT = locale === 'it'
  const [visible, setVisible] = useState(false)
  const ticking = useRef(false)

  useEffect(() => {
    function onScroll() {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        setVisible(window.scrollY > showAfterY)
        ticking.current = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [showAfterY])

  return (
    <>
      <style>{`
        @keyframes fab-in {
          from { transform: scale(0.6) translateY(20px); opacity: 0; }
          to   { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes fab-pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.55), 0 8px 24px -4px rgba(0,0,0,0.5); }
          70%  { box-shadow: 0 0 0 16px rgba(59, 130, 246, 0), 0 8px 24px -4px rgba(0,0,0,0.5); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0), 0 8px 24px -4px rgba(0,0,0,0.5); }
        }
        @media (prefers-reduced-motion: reduce) {
          .fab-anim { animation: none !important; }
        }
      `}</style>

      <Link
        href={href}
        aria-label={IT ? 'Vota un dilemma' : 'Vote on a dilemma'}
        className={`
          md:hidden fixed bottom-5 right-5 z-30
          flex items-center gap-2
          h-14 px-5 rounded-full
          font-black text-sm text-white
          transition-all duration-300 ease-out fab-anim
          ${visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4 pointer-events-none'}
        `}
        style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
          border: '1px solid rgba(255,255,255,0.18)',
          boxShadow: '0 8px 24px -4px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08) inset',
          animation: pulse && visible ? 'fab-pulse-ring 2.2s ease-out infinite' : undefined,
        }}
      >
        <span className="text-lg leading-none">🎯</span>
        <span className="leading-none tracking-wide">
          {IT ? 'Vota' : 'Vote'}
        </span>
      </Link>
    </>
  )
}

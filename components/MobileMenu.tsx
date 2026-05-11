'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { createPortal } from 'react-dom'
import {
  Menu, X, TrendingUp, Scale, Cpu, Users, Heart, Zap,
  HelpCircle, Compass, UserPlus, Home, BookOpen,
  LayoutDashboard, LogOut, Mail, Sparkles, Star,
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import ClaimDot from './ClaimDot'

export default function MobileMenu() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [dvhSupported, setDvhSupported] = useState(false)
  const [isShortViewport, setIsShortViewport] = useState(false)
  const pathname = usePathname()
  const isIT = pathname.startsWith('/it')
  const close = () => setOpen(false)

  useEffect(() => {
    setMounted(true)
    const supabase = createClient()
    supabase.auth.getUser()
      .then(({ data: { user } }) => setIsLoggedIn(!!user))
      .catch(() => setIsLoggedIn(false))

    // dvh support check — 100dvh = actual visible area on mobile, 100vh = large viewport (broken on Safari)
    setDvhSupported(
      typeof CSS !== 'undefined' &&
      typeof CSS.supports === 'function' &&
      CSS.supports('height', '1dvh'),
    )

    // Compact mode for short-screen devices (iPhone SE ≤ 667px, etc.)
    const checkViewport = () => setIsShortViewport(window.innerHeight <= 700)
    checkViewport()
    window.addEventListener('resize', checkViewport, { passive: true })
    return () => window.removeEventListener('resize', checkViewport)
  }, [])

  // Lock body scroll when menu is open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const handleSignOut = async () => {
    close()
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = isIT ? '/it' : '/'
  }

  // max-height: use 100dvh (actual visible viewport) when supported, fall back to 100vh.
  // Header is 56px; 20px breathing room below → subtract 76px total.
  const menuMaxHeight = dvhSupported ? 'calc(100dvh - 76px)' : 'calc(100vh - 76px)'

  // Compact mode: reduce density on short screens (iPhone SE ≤ 667px, etc.) while
  // keeping touch targets ≥ 40px (acceptable threshold when vertical space is scarce).
  const ITEM: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: isShortViewport ? '6px 12px' : '10px 12px',
    borderRadius: '12px',
    textDecoration: 'none',
    minHeight: isShortViewport ? '40px' : '44px',
    background: 'transparent', transition: 'background 0.15s',
  }
  const LABEL: React.CSSProperties = { fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }
  const SECTION: React.CSSProperties = {
    padding: isShortViewport ? '4px 12px 1px' : '8px 12px 2px',
    fontSize: '10px', fontWeight: 700,
    letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)',
  }
  const DIVIDER: React.CSSProperties = {
    height: '1px', background: 'rgba(255,255,255,0.06)',
    margin: isShortViewport ? '2px 0' : '4px 0',
  }

  // The backdrop + dropdown rendered via portal to escape navbar's backdrop-filter stacking context.
  const overlay = open && mounted && createPortal(
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label={isIT ? 'Chiudi menu' : 'Close menu'}
        onClick={close}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
          border: 'none', cursor: 'default',
        }}
      />

      {/* Dropdown */}
      <div
        id="mobile-menu-dropdown"
        role="menu"
        aria-label={isIT ? 'Menu di navigazione' : 'Navigation menu'}
        style={{
          position: 'fixed', top: '56px', right: '12px',
          width: '248px',
          maxHeight: menuMaxHeight,
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          zIndex: 1001, backgroundColor: '#0f0f2a',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px',
          boxShadow: '0 12px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(77,159,255,0.15)',
        }}
      >
        <div style={{ padding: isShortViewport ? '4px' : '8px' }}>

          {/* ── Group 1: Main ── */}
          <div style={SECTION}>{isIT ? 'Navigazione' : 'Main'}</div>

          <Link href={isIT ? '/it' : '/'} onClick={close} role="menuitem" style={ITEM}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <Home size={15} className="text-white/40 flex-shrink-0" />
            <span style={LABEL}>Home</span>
          </Link>

          <Link href={isIT ? '/it/trending' : '/trending'} onClick={close} role="menuitem" style={ITEM}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <TrendingUp size={15} className="text-purple-400 flex-shrink-0" />
            <span style={LABEL}>{isIT ? 'Tendenze' : 'Trending'}</span>
          </Link>

          <Link href={isIT ? '/it/blog' : '/blog'} onClick={close} role="menuitem" style={ITEM}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <BookOpen size={15} className="text-emerald-400 flex-shrink-0" />
            <span style={LABEL}>Blog</span>
          </Link>

          <Link href={isIT ? '/it/pixie' : '/pixie'} onClick={close} role="menuitem" style={ITEM}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <Star size={15} className="text-yellow-400 flex-shrink-0" />
            <span style={LABEL}>{isIT ? 'Pixie' : 'Pixies'}</span>
          </Link>

          <div style={DIVIDER} />

          {/* ── Group 2: Categories ── */}
          <div style={SECTION}>{isIT ? 'Categorie' : 'Categories'}</div>

          {([
            { en: '/category/morality',      it: '/it/category/morality',      labelEN: 'Morality',      labelIT: 'Moralità',      icon: Scale,  color: 'text-red-400'    },
            { en: '/category/technology',    it: '/it/category/technology',    labelEN: 'Technology',    labelIT: 'Tecnologia',    icon: Cpu,    color: 'text-blue-400'   },
            { en: '/category/society',       it: '/it/category/society',       labelEN: 'Society',       labelIT: 'Società',       icon: Users,  color: 'text-green-400'  },
            { en: '/category/relationships', it: '/it/category/relationships', labelEN: 'Relationships', labelIT: 'Relazioni',     icon: Heart,  color: 'text-pink-400'   },
            { en: '/category/survival',      it: '/it/category/survival',      labelEN: 'Survival',      labelIT: 'Sopravvivenza', icon: Zap,    color: 'text-orange-400' },
          ] as const).map(({ en, it, labelEN, labelIT, icon: Icon, color }) => (
            <Link key={en} href={isIT ? it : en} onClick={close} role="menuitem" style={ITEM}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <Icon size={15} className={`${color} flex-shrink-0`} />
              <span style={LABEL}>{isIT ? labelIT : labelEN}</span>
            </Link>
          ))}

          {/* ── Group 3: Account (only once auth state is resolved) ── */}
          {isLoggedIn !== null && (
            <>
              <div style={DIVIDER} />
              <div style={SECTION}>{isIT ? 'Account' : 'Account'}</div>

              {isLoggedIn ? (
                <>
                  <Link href="/profile" onClick={close} role="menuitem" style={ITEM}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <Compass size={15} className="text-cyan-400 flex-shrink-0" />
                    <span style={LABEL}>{isIT ? 'Il mio profilo' : 'My Profile'}</span>
                  </Link>

                  <Link href={isIT ? '/it/personality' : '/personality'} onClick={close} role="menuitem" style={ITEM}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <Sparkles size={15} className="text-purple-400 flex-shrink-0" />
                    <span style={LABEL}>{isIT ? 'Personalità Morale' : 'Moral Personality'}</span>
                  </Link>

                  <Link href="/dashboard" onClick={close} role="menuitem" style={ITEM}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <LayoutDashboard size={15} className="text-indigo-400 flex-shrink-0" />
                    <span style={LABEL}>Dashboard</span>
                    <ClaimDot />
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    role="menuitem"
                    style={{ ...ITEM, border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <LogOut size={15} className="text-red-400 flex-shrink-0" />
                    <span style={{ ...LABEL, color: 'rgba(248,113,113,0.8)' }}>
                      {isIT ? 'Esci' : 'Sign out'}
                    </span>
                  </button>
                </>
              ) : (
                <Link
                  href={isIT ? '/login?locale=it' : '/login'}
                  onClick={close}
                  role="menuitem"
                  style={{
                    ...ITEM,
                    background: 'rgba(59,130,246,0.12)',
                    border: '1px solid rgba(59,130,246,0.25)',
                    marginTop: '2px',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.12)')}
                >
                  <UserPlus size={15} className="text-blue-400 flex-shrink-0" />
                  <div>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(147,197,253,1)', display: 'block', lineHeight: 1.2 }}>
                      {isIT ? 'Crea profilo gratis' : 'Join free →'}
                    </span>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.2 }}>
                      {isIT ? 'Salva voti, badge, Pixie' : 'Save votes, earn badges'}
                    </span>
                  </div>
                </Link>
              )}
            </>
          )}

          {/* ── Group 4: Help ── */}
          <div style={DIVIDER} />
          <div style={SECTION}>{isIT ? 'Aiuto' : 'Help'}</div>

          <Link href={isIT ? '/it/faq' : '/faq'} onClick={close} role="menuitem" style={ITEM}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <HelpCircle size={15} className="text-[var(--muted)] flex-shrink-0" />
            <span style={LABEL}>FAQ</span>
          </Link>

          <a href="mailto:support@splitvote.io" onClick={close} role="menuitem" style={ITEM}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <Mail size={15} className="text-[var(--muted)] flex-shrink-0" />
            <span style={LABEL}>{isIT ? 'Supporto' : 'Support'}</span>
          </a>

        </div>
      </div>
    </>,
    document.body,
  )

  return (
    <>
      {/* Hamburger button — stays inside the nav */}
      <div className="lg:hidden">
        <button
          onClick={() => setOpen(o => !o)}
          aria-label={open ? (isIT ? 'Chiudi menu' : 'Close menu') : (isIT ? 'Apri menu' : 'Open menu')}
          aria-expanded={open}
          aria-controls="mobile-menu-dropdown"
          className="flex items-center justify-center w-9 h-9 rounded-xl border border-[var(--border)] hover:border-[var(--border-hi)] hover:bg-white/5 transition-all text-[var(--muted)] hover:text-white"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Portal-rendered overlay */}
      {overlay}
    </>
  )
}

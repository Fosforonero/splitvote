'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { TrendingUp, Compass, BookOpen } from 'lucide-react'

/**
 * Top-level header nav (lg+ only). Trimmed to 3 items for mobile-first IA:
 * categories, business, and other secondary destinations live in the
 * burger drawer (`MobileMenu.tsx`) and footer.
 *
 * Invariants:
 * - Same 3 items in EN and IT (parity).
 * - Active state visible (current page is highlighted).
 * - Hidden below lg breakpoint (drawer takes over).
 */

type NavItem = {
  href: string
  label: string
  icon: typeof TrendingUp
  color: string
  activeColor: string
}

const EN_LINKS: NavItem[] = [
  {
    href: '/trending',
    label: 'Trending',
    icon: TrendingUp,
    color: 'text-[var(--muted)] hover:text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/20',
    activeColor: 'text-purple-300 bg-purple-500/15 border-purple-500/30',
  },
  {
    href: '/personality',
    label: 'My Profile',
    icon: Compass,
    color: 'text-[var(--muted)] hover:text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-500/20',
    activeColor: 'text-cyan-300 bg-cyan-500/15 border-cyan-500/30',
  },
  {
    href: '/blog',
    label: 'Blog',
    icon: BookOpen,
    color: 'text-[var(--muted)] hover:text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-500/20',
    activeColor: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30',
  },
]

const IT_LINKS: NavItem[] = [
  {
    href: '/it/trending',
    label: 'Tendenze',
    icon: TrendingUp,
    color: 'text-[var(--muted)] hover:text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/20',
    activeColor: 'text-purple-300 bg-purple-500/15 border-purple-500/30',
  },
  {
    href: '/it/personality',
    label: 'Il Mio Profilo',
    icon: Compass,
    color: 'text-[var(--muted)] hover:text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-500/20',
    activeColor: 'text-cyan-300 bg-cyan-500/15 border-cyan-500/30',
  },
  {
    href: '/it/blog',
    label: 'Blog',
    icon: BookOpen,
    color: 'text-[var(--muted)] hover:text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-500/20',
    activeColor: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30',
  },
]

export default function NavLinks() {
  const pathname = usePathname()
  const isIT = pathname.startsWith('/it')
  const links = isIT ? IT_LINKS : EN_LINKS

  return (
    <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
      {links.map(({ href, label, icon: Icon, color, activeColor }) => {
        const isActive =
          pathname === href || (href !== (isIT ? '/it' : '/') && pathname.startsWith(href))
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all px-4 py-2 rounded-xl border ${
              isActive ? activeColor : `border-transparent ${color}`
            }`}
          >
            <Icon size={14} aria-hidden="true" />
            {label}
          </Link>
        )
      })}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Settings, Star, LayoutDashboard, LogOut, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { isRoleAtLeast } from '@/lib/admin-auth'
import type { UserRole } from '@/lib/admin-auth'
import ClaimDot from './ClaimDot'

interface AuthState {
  status: 'loading' | 'anon' | 'user'
  isPremium: boolean
  avatarEmoji: string
  isAdmin: boolean
}

export default function AuthButton() {
  const pathname = usePathname()
  const isIT = pathname?.startsWith('/it') ?? false
  const loginHref = isIT ? '/login?locale=it' : '/login'

  const [auth, setAuth] = useState<AuthState>({
    status: 'loading',
    isPremium: false,
    avatarEmoji: '🌍',
    isAdmin: false,
  })

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser()
      .then(async ({ data: { user } }) => {
        if (!user) {
          setAuth({ status: 'anon', isPremium: false, avatarEmoji: '🌍', isAdmin: false })
          return
        }
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_premium, avatar_emoji, role')
          .eq('id', user.id)
          .single()
        const role = (profile?.role ?? 'user') as UserRole
        setAuth({
          status: 'user',
          isPremium: profile?.is_premium ?? false,
          avatarEmoji: profile?.avatar_emoji ?? '🌍',
          isAdmin: isRoleAtLeast(role, 'admin'),
        })
      })
      .catch(() => setAuth({ status: 'anon', isPremium: false, avatarEmoji: '🌍', isAdmin: false }))
  }, [])

  // Show anonymous/login state while loading or actually anonymous
  if (auth.status !== 'user') {
    return (
      <a
        href={loginHref}
        className="flex items-center justify-center w-10 h-10 rounded-xl transition-all btn-neon-blue text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:border-blue-400/60 bg-blue-500/10 hover:bg-blue-500/20 neon-glow-blue"
        aria-label={isIT ? 'Crea profilo gratis o accedi' : 'Join SplitVote free or sign in'}
        title={isIT ? 'Crea profilo gratis o accedi' : 'Join SplitVote free or sign in'}
      >
        <User size={18} aria-hidden="true" />
      </a>
    )
  }

  return (
    <div className="flex items-center gap-1">
      {auth.isAdmin && (
        <a
          href="/admin"
          className="flex items-center justify-center w-8 h-8 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
          title="Admin Panel"
        >
          <Settings size={14} />
        </a>
      )}
      {auth.isPremium && (
        <span className="hidden sm:flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-yellow-400 border border-yellow-500/30 bg-yellow-500/10 px-2 py-1 rounded-lg">
          <Star size={11} fill="currentColor" />
          <span>Pro</span>
        </span>
      )}
      <a
        href="/profile"
        className="text-base w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-all border border-transparent hover:border-[var(--border-hi)]"
        title="Profile Settings"
      >
        {auth.avatarEmoji}
      </a>
      <a
        href="/dashboard"
        className="hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[var(--muted)] hover:text-white transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/5"
        title="Dashboard"
      >
        <LayoutDashboard size={12} />
        <span>Dash</span>
        <ClaimDot />
      </a>
      <form action="/api/auth/signout" method="POST">
        <button
          type="submit"
          className="flex items-center justify-center w-8 h-8 rounded-lg text-[var(--muted)] hover:text-white hover:bg-white/5 transition-all"
          title="Sign Out"
          aria-label="Sign out"
        >
          <LogOut size={13} aria-hidden="true" />
        </button>
      </form>
    </div>
  )
}

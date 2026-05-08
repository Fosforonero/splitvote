'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Settings, Star, LayoutDashboard, LogOut, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { isRoleAtLeast } from '@/lib/admin-auth'
import type { UserRole } from '@/lib/admin-auth'
import { getLevelInfo } from '@/lib/missions'
import ClaimDot from './ClaimDot'

interface AuthState {
  status: 'loading' | 'anon' | 'user'
  isPremium: boolean
  avatarEmoji: string
  isAdmin: boolean
  streakDays: number
  xp: number
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
    streakDays: 0,
    xp: 0,
  })

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser()
      .then(async ({ data: { user } }) => {
        if (!user) {
          setAuth({ status: 'anon', isPremium: false, avatarEmoji: '🌍', isAdmin: false, streakDays: 0, xp: 0 })
          return
        }
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_premium, avatar_emoji, role, streak_days, xp')
          .eq('id', user.id)
          .single()
        const role = (profile?.role ?? 'user') as UserRole
        setAuth({
          status: 'user',
          isPremium: profile?.is_premium ?? false,
          avatarEmoji: profile?.avatar_emoji ?? '🌍',
          isAdmin: isRoleAtLeast(role, 'admin'),
          streakDays: profile?.streak_days ?? 0,
          xp: profile?.xp ?? 0,
        })
      })
      .catch(() => setAuth({ status: 'anon', isPremium: false, avatarEmoji: '🌍', isAdmin: false, streakDays: 0, xp: 0 }))
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

  // Compute level info from XP (lib/missions.getLevelInfo). Used in the
  // dashboard HUD pill on sm+ screens.
  const levelInfo = getLevelInfo(auth.xp)
  const dashAriaLabel = isIT
    ? `Bacheca${auth.streakDays > 0 ? `, streak ${auth.streakDays} giorn${auth.streakDays === 1 ? 'o' : 'i'}` : ''}, livello ${levelInfo.level}`
    : `Dashboard${auth.streakDays > 0 ? `, ${auth.streakDays}-day streak` : ''}, level ${levelInfo.level}`

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
        title={isIT ? 'Impostazioni profilo' : 'Profile Settings'}
      >
        {auth.avatarEmoji}
      </a>
      {/* S6a — Pixie HUD: streak + level visible alongside Dashboard link on sm+ */}
      <a
        href="/dashboard"
        className="hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[var(--muted)] hover:text-white transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/5"
        title={isIT ? 'Bacheca' : 'Dashboard'}
        aria-label={dashAriaLabel}
      >
        <LayoutDashboard size={12} aria-hidden="true" />
        {auth.streakDays > 0 && (
          <span className="text-orange-400 normal-case" aria-hidden="true">
            🔥{auth.streakDays}
          </span>
        )}
        <span className="text-purple-400 normal-case" aria-hidden="true">
          Lv {levelInfo.level}
        </span>
        <ClaimDot />
      </a>
      <form action="/api/auth/signout" method="POST">
        <button
          type="submit"
          className="flex items-center justify-center w-8 h-8 rounded-lg text-[var(--muted)] hover:text-white hover:bg-white/5 transition-all"
          title={isIT ? 'Esci' : 'Sign Out'}
          aria-label={isIT ? 'Esci' : 'Sign out'}
        >
          <LogOut size={13} aria-hidden="true" />
        </button>
      </form>
    </div>
  )
}

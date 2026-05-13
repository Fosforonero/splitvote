import type { Metadata } from 'next'
import Link from 'next/link'
import { createPublicClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Classifica | SplitVote',
  description: 'I votatori più attivi su SplitVote — classificati per dilemmi votati, XP guadagnati e streak attive.',
  alternates: {
    canonical: 'https://splitvote.io/it/leaderboard',
    languages: { 'en': 'https://splitvote.io/leaderboard' },
  },
  openGraph: {
    title: 'Classifica | SplitVote',
    description: 'I pensatori morali più attivi su SplitVote — classificati per dilemmi votati, XP e streak.',
    url: 'https://splitvote.io/it/leaderboard',
    siteName: 'SplitVote',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Classifica | SplitVote',
    description: 'I pensatori morali più attivi su SplitVote — classificati per dilemmi votati, XP e streak.',
  },
}

export const revalidate = 600

const MEDALS = ['🥇', '🥈', '🥉']

type ProfileRow = { id: string; display_name: string | null; avatar_emoji: string | null; votes_count: number | null; streak_days: number | null; is_premium: boolean; xp: number | null }

export default async function LeaderboardPageIT() {
  let voters:  ProfileRow[] = []
  let streaks: ProfileRow[] = []
  let topXp:   ProfileRow[] = []

  try {
    const supabase = createPublicClient()
    const [votersRes, streaksRes, xpRes] = await Promise.all([
      supabase
        .from('profiles')
        .select('id, display_name, avatar_emoji, votes_count, streak_days, is_premium, xp')
        .order('votes_count', { ascending: false })
        .limit(50),
      supabase
        .from('profiles')
        .select('id, display_name, avatar_emoji, votes_count, streak_days, is_premium, xp')
        .gt('streak_days', 0)
        .order('streak_days', { ascending: false })
        .limit(50),
      supabase
        .from('profiles')
        .select('id, display_name, avatar_emoji, votes_count, streak_days, is_premium, xp')
        .gt('xp', 0)
        .order('xp', { ascending: false })
        .limit(50),
    ])
    voters  = votersRes.data  ?? []
    streaks = streaksRes.data ?? []
    topXp   = xpRes.data      ?? []
  } catch {
    // Supabase env vars not available at build time — data shown at runtime via ISR
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">

      <div className="mb-10">
        <h1 className="text-3xl font-black text-white mb-2">🏆 Classifica</h1>
        <p className="text-[var(--muted)] text-sm">
          I pensatori morali più attivi su SplitVote. Aggiornata ogni 10 minuti.
        </p>
      </div>

      {/* Top Voters */}
      <section className="mb-12">
        <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-4">
          📊 Top Votatori — Di sempre
        </h2>
        <div className="space-y-2">
          {voters.map((user, i) => (
            <Link
              key={user.id}
              href={`/u/${user.id}`}
              className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[#0d0d1a]/60 px-4 py-3 hover:border-blue-500/30 transition-colors group"
            >
              <span className="w-8 text-center flex-shrink-0">
                {i < 3
                  ? <span className="text-xl">{MEDALS[i]}</span>
                  : <span className="text-sm font-bold text-[var(--muted)]">#{i + 1}</span>
                }
              </span>
              <span className="text-2xl flex-shrink-0">{user.avatar_emoji ?? '🌍'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {user.display_name ?? 'Votatore Anonimo'}
                  {user.is_premium && (
                    <span className="ml-1.5 text-[10px] text-yellow-400 border border-yellow-500/30 bg-yellow-500/10 px-1.5 py-0.5 rounded-full align-middle">
                      ⭐ PRO
                    </span>
                  )}
                </p>
                {(user.streak_days ?? 0) > 0 && (
                  <p className="text-[11px] text-orange-400/80">🔥 Streak {user.streak_days} giorni</p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-black text-blue-400">
                  {(user.votes_count ?? 0).toLocaleString('it-IT')}
                </p>
                <p className="text-[10px] text-[var(--muted)]">voti</p>
              </div>
            </Link>
          ))}

          {voters.length === 0 && (
            <p className="text-center text-[var(--muted)] py-10">Nessun dato ancora — sii il primo a votare!</p>
          )}
        </div>
      </section>

      {/* Top Streaks */}
      <section className="mb-10">
        <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-4">
          🔥 Top Streak — Attive
        </h2>
        <div className="space-y-2">
          {streaks.map((user, i) => (
            <Link
              key={user.id}
              href={`/u/${user.id}`}
              className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[#0d0d1a]/60 px-4 py-3 hover:border-orange-500/30 transition-colors group"
            >
              <span className="w-8 text-center flex-shrink-0">
                {i < 3
                  ? <span className="text-xl">{MEDALS[i]}</span>
                  : <span className="text-sm font-bold text-[var(--muted)]">#{i + 1}</span>
                }
              </span>
              <span className="text-2xl flex-shrink-0">{user.avatar_emoji ?? '🌍'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {user.display_name ?? 'Votatore Anonimo'}
                </p>
                <p className="text-[11px] text-[var(--muted)]">
                  {(user.votes_count ?? 0).toLocaleString('it-IT')} voti totali
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-black text-orange-400">{user.streak_days}</p>
                <p className="text-[10px] text-[var(--muted)]">giorni</p>
              </div>
            </Link>
          ))}

          {streaks.length === 0 && (
            <p className="text-center text-[var(--muted)] py-10">Nessuna streak attiva.</p>
          )}
        </div>
      </section>

      {/* Top XP */}
      <section className="mb-12">
        <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-4">
          ⚡ Top XP — Missioni &amp; Impegno
        </h2>
        <div className="space-y-2">
          {topXp.map((user, i) => (
            <Link
              key={user.id}
              href={`/u/${user.id}`}
              className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[#0d0d1a]/60 px-4 py-3 hover:border-purple-500/30 transition-colors group"
            >
              <span className="w-8 text-center flex-shrink-0">
                {i < 3
                  ? <span className="text-xl">{MEDALS[i]}</span>
                  : <span className="text-sm font-bold text-[var(--muted)]">#{i + 1}</span>
                }
              </span>
              <span className="text-2xl flex-shrink-0">{user.avatar_emoji ?? '🌍'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {user.display_name ?? 'Votatore Anonimo'}
                  {user.is_premium && (
                    <span className="ml-1.5 text-[10px] text-yellow-400 border border-yellow-500/30 bg-yellow-500/10 px-1.5 py-0.5 rounded-full align-middle">
                      ⭐ PRO
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-[var(--muted)]">
                  {(user.votes_count ?? 0).toLocaleString('it-IT')} voti
                  {(user.streak_days ?? 0) > 0 && ` · 🔥 ${user.streak_days}g`}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-black text-purple-400">
                  {(user.xp ?? 0).toLocaleString('it-IT')}
                </p>
                <p className="text-[10px] text-[var(--muted)]">XP</p>
              </div>
            </Link>
          ))}

          {topXp.length === 0 && (
            <p className="text-center text-[var(--muted)] py-10">Nessun XP ancora — completa le missioni per scalare!</p>
          )}
        </div>
      </section>

      <div className="text-center">
        <p className="text-[var(--muted)] text-sm mb-4">Vuoi scalare la classifica?</p>
        <Link
          href="/it"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm px-8 py-4 rounded-2xl transition-colors"
        >
          Inizia a votare →
        </Link>
      </div>
    </div>
  )
}

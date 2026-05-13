import type { Metadata } from 'next'
import Link from 'next/link'
import { createPublicClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Leaderboard | SplitVote',
  description: 'The top voters on SplitVote — ranked by dilemmas voted, XP earned, and active streaks.',
  alternates: {
    canonical: 'https://splitvote.io/leaderboard',
    languages: { 'it-IT': 'https://splitvote.io/it/leaderboard' },
  },
  openGraph: {
    title: 'Leaderboard | SplitVote',
    description: 'The most dedicated moral thinkers on SplitVote — ranked by votes, XP, and streaks.',
    url: 'https://splitvote.io/leaderboard',
    siteName: 'SplitVote',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Leaderboard | SplitVote',
    description: 'The most dedicated moral thinkers on SplitVote — ranked by votes, XP, and streaks.',
  },
}

export const revalidate = 600 // refresh every 10 minutes

const MEDALS = ['🥇', '🥈', '🥉']

type ProfileRow = { id: string; display_name: string | null; avatar_emoji: string | null; votes_count: number | null; streak_days: number | null; is_premium: boolean; xp: number | null }

export default async function LeaderboardPage() {
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

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white mb-2">🏆 Leaderboard</h1>
        <p className="text-[var(--muted)] text-sm">
          The most dedicated moral thinkers on SplitVote. Updated every 10 minutes.
        </p>
      </div>

      {/* Top Voters */}
      <section className="mb-12">
        <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-4">
          📊 Top Voters — All Time
        </h2>
        <div className="space-y-2">
          {voters.map((user, i) => (
            <Link
              key={user.id}
              href={`/u/${user.id}`}
              className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[#0d0d1a]/60 px-4 py-3 hover:border-blue-500/30 transition-colors group"
            >
              {/* Rank */}
              <span className="w-8 text-center flex-shrink-0">
                {i < 3
                  ? <span className="text-xl">{MEDALS[i]}</span>
                  : <span className="text-sm font-bold text-[var(--muted)]">#{i + 1}</span>
                }
              </span>

              {/* Avatar */}
              <span className="text-2xl flex-shrink-0">
                {user.avatar_emoji ?? '🌍'}
              </span>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {user.display_name ?? 'Anonymous Voter'}
                  {user.is_premium && (
                    <span className="ml-1.5 text-[10px] text-yellow-400 border border-yellow-500/30 bg-yellow-500/10 px-1.5 py-0.5 rounded-full align-middle">
                      ⭐ PRO
                    </span>
                  )}
                </p>
                {(user.streak_days ?? 0) > 0 && (
                  <p className="text-[11px] text-orange-400/80">🔥 {user.streak_days}-day streak</p>
                )}
              </div>

              {/* Score */}
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-black text-blue-400">
                  {(user.votes_count ?? 0).toLocaleString()}
                </p>
                <p className="text-[10px] text-[var(--muted)]">votes</p>
              </div>
            </Link>
          ))}

          {voters.length === 0 && (
            <p className="text-center text-[var(--muted)] py-10">No data yet — be the first to vote!</p>
          )}
        </div>
      </section>

      {/* Top Streaks */}
      <section className="mb-10">
        <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-4">
          🔥 Top Streaks — Active
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
                  {user.display_name ?? 'Anonymous Voter'}
                </p>
                <p className="text-[11px] text-[var(--muted)]">
                  {(user.votes_count ?? 0).toLocaleString()} total votes
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-black text-orange-400">
                  {user.streak_days}
                </p>
                <p className="text-[10px] text-[var(--muted)]">days</p>
              </div>
            </Link>
          ))}

          {streaks.length === 0 && (
            <p className="text-center text-[var(--muted)] py-10">No active streaks yet.</p>
          )}
        </div>
      </section>

      {/* Top XP */}
      <section className="mb-12">
        <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-4">
          ⚡ Top XP — Missions &amp; Engagement
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
                  {user.display_name ?? 'Anonymous Voter'}
                  {user.is_premium && (
                    <span className="ml-1.5 text-[10px] text-yellow-400 border border-yellow-500/30 bg-yellow-500/10 px-1.5 py-0.5 rounded-full align-middle">
                      ⭐ PRO
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-[var(--muted)]">
                  {(user.votes_count ?? 0).toLocaleString()} votes
                  {(user.streak_days ?? 0) > 0 && ` · 🔥 ${user.streak_days}d`}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-black text-purple-400">
                  {(user.xp ?? 0).toLocaleString()}
                </p>
                <p className="text-[10px] text-[var(--muted)]">XP</p>
              </div>
            </Link>
          ))}

          {topXp.length === 0 && (
            <p className="text-center text-[var(--muted)] py-10">No XP earned yet — complete missions to climb!</p>
          )}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center">
        <p className="text-[var(--muted)] text-sm mb-4">Want to climb the ranks?</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm px-8 py-4 rounded-2xl transition-colors"
        >
          Start voting →
        </Link>
      </div>
    </div>
  )
}

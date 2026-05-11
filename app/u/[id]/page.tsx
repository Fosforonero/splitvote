import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import CompanionDisplay from '@/components/CompanionDisplay'
import type { CompanionSpecies } from '@/lib/companion'
import { PIXIE_ITEM_MAP } from '@/lib/pixie-store'
import type { PixieItemId } from '@/lib/pixie-store'

const BASE = 'https://splitvote.io'

interface Props { params: { id: string } }

const RARITY_STYLES: Record<string, string> = {
  common:    'border-slate-500/40 bg-slate-500/10 text-slate-300',
  rare:      'border-blue-500/40  bg-blue-500/10  text-blue-300',
  epic:      'border-purple-500/40 bg-purple-500/10 text-purple-300',
  legendary: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-300',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const admin = await createClient()
  const { data } = await admin
    .from('profiles')
    .select('display_name, votes_count, avatar_emoji')
    .eq('id', params.id)
    .single()

  if (!data) return {}
  const name = data.display_name ?? 'A SplitVote member'
  const avatar = data.avatar_emoji ?? '🌍'
  return {
    title: `${avatar} ${name} on SplitVote`,
    description: `${name} has voted on ${data.votes_count ?? 0} dilemmas worldwide. See their trophy case on SplitVote.`,
    openGraph: {
      title: `${avatar} ${name} — SplitVote Profile`,
      description: `${data.votes_count ?? 0} votes cast. Check out their badges and dilemma history.`,
    },
  }
}

export const dynamic = 'force-dynamic'

export default async function PublicProfilePage({ params }: Props) {
  // Public profile — uses anon client (RLS must allow SELECT on profiles/user_badges for anon)
  // This removes the dependency on SUPABASE_SERVICE_ROLE_KEY for a public-facing page.
  const admin = await createClient()

  const [profileRes, badgesRes] = await Promise.all([
    admin
      .from('profiles')
      .select('display_name, votes_count, avatar_emoji, is_premium, country_code, created_at, companion_species, xp, streak_days, pixie_xp, use_pixie_avatar')
      .eq('id', params.id)
      .single(),
    admin
      .from('user_badges')
      .select('badge_id, earned_at, is_equipped, badges(name, emoji, rarity, description)')
      .eq('user_id', params.id)
      .order('earned_at', { ascending: false }),
  ])

  if (!profileRes.data) notFound()

  const profile = profileRes.data
  const badges = ((badgesRes.data ?? []) as unknown as {
    badge_id: string
    earned_at: string
    is_equipped: boolean
    badges: { name: string; emoji: string; rarity: string; description: string }
  }[])

  const displayName    = profile.display_name ?? 'Anonymous Voter'
  const avatarEmoji    = profile.avatar_emoji ?? '🌍'
  const joinDate       = new Date(profile.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const votesCount     = profile.votes_count ?? 0
  const companionSpecies = ((profile as Record<string, unknown>).companion_species as CompanionSpecies | null) ?? 'spark'
  const xp             = ((profile as Record<string, unknown>).xp as number | null) ?? 0

  // Pixie avatar logic
  const usePixieAvatar = ((profile as Record<string, unknown>).use_pixie_avatar as boolean | null) ?? false
  const pixieXp        = ((profile as Record<string, unknown>).pixie_xp as Record<string, unknown> | null) ?? {}
  const activePixieId  = typeof pixieXp.active === 'string' ? pixieXp.active as PixieItemId : null
  const activePixieItem = activePixieId ? PIXIE_ITEM_MAP[activePixieId] : null

  // Avatar shown in profile hero: Pixie skin if opted-in, else emoji
  const heroAvatar  = usePixieAvatar && activePixieItem ? activePixieItem.emoji : avatarEmoji
  const heroIsPixie = usePixieAvatar && !!activePixieItem

  // Rarity order for sorting
  const RARITY_ORDER = { legendary: 0, epic: 1, rare: 2, common: 3 }
  const sortedBadges = [...badges].sort((a, b) =>
    (RARITY_ORDER[a.badges.rarity as keyof typeof RARITY_ORDER] ?? 4) -
    (RARITY_ORDER[b.badges.rarity as keyof typeof RARITY_ORDER] ?? 4)
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      {/* Back */}
      <Link href="/" className="text-sm text-[var(--muted)] hover:text-white transition-colors mb-8 inline-block">
        ← SplitVote
      </Link>

      {/* ── Profile hero ── */}
      <div className="rounded-3xl border border-[var(--border)] bg-[#0d0d1a]/60 p-8 mb-8 text-center">
        {/* Avatar: Pixie skin or emoji */}
        <div className={`mb-4 inline-flex items-center justify-center ${
          heroIsPixie
            ? 'w-24 h-24 rounded-2xl border-2 border-blue-500/40 bg-blue-500/10 text-6xl'
            : 'text-7xl'
        }`}>
          {heroAvatar}
        </div>
        {heroIsPixie && activePixieItem && (
          <p className="text-xs text-blue-400 font-semibold -mt-2 mb-3">
            {activePixieItem.name} skin
          </p>
        )}
        <h1 className="text-3xl font-black text-white mb-1">{displayName}</h1>
        {profile.is_premium && (
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-yellow-400 border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 rounded-full mb-3">
            ⭐ Premium
          </span>
        )}
        <p className="text-[var(--muted)] text-sm mt-2">Member since {joinDate}</p>
        {profile.country_code && (
          <p className="text-[var(--muted)] text-sm mt-1">📍 {profile.country_code}</p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6 max-w-xs mx-auto">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-2xl font-black text-blue-400">{votesCount.toLocaleString()}</p>
            <p className="text-xs text-[var(--muted)] mt-1">Dilemmas voted</p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-2xl font-black text-yellow-400">{badges.length}</p>
            <p className="text-xs text-[var(--muted)] mt-1">Trophies earned</p>
          </div>
        </div>
      </div>

      {/* ── Companion ── */}
      <CompanionDisplay
        species={companionSpecies}
        votesCount={votesCount}
        xp={xp}
      />

      {/* ── Trophy Case ── */}
      {sortedBadges.length > 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[#0d0d1a]/60 p-6 mb-8">
          <h2 className="text-sm font-black uppercase tracking-widest text-[var(--muted)] mb-5">🏆 Trophy Case</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {sortedBadges.map((b) => (
              <div
                key={b.badge_id}
                title={b.badges.description}
                className={`rounded-xl border p-3 text-center ${RARITY_STYLES[b.badges.rarity] ?? RARITY_STYLES.common}`}
              >
                <p className="text-3xl mb-1.5">{b.badges.emoji}</p>
                <p className="text-xs font-semibold leading-tight">{b.badges.name}</p>
                <p className="text-xs opacity-60 mt-0.5 capitalize">{b.badges.rarity}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--border)] bg-[#0d0d1a]/60 p-8 mb-8 text-center">
          <p className="text-4xl mb-3">🎯</p>
          <p className="text-[var(--muted)] text-sm">No trophies yet — keep voting to earn them!</p>
        </div>
      )}

      {/* ── Voter milestone ── */}
      {votesCount > 0 && (
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 mb-8 text-center">
          <p className="text-blue-400 text-sm font-semibold">
            {votesCount >= 500 ? '🌟 Legend Voter — Top tier of the community'
              : votesCount >= 100 ? '🔥 Power Voter — In the top 5% of voters worldwide'
              : votesCount >= 50 ? '⚡ Active Voter — More engaged than 80% of users'
              : votesCount >= 10 ? '🌍 Global Voice — Part of the SplitVote community'
              : '🎯 Getting started — First steps into the dilemma world'}
          </p>
        </div>
      )}

      {/* ── CTA ── */}
      <div className="text-center">
        <p className="text-[var(--muted)] text-sm mb-4">Want to build your own trophy case?</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm px-8 py-4 rounded-2xl transition-colors"
        >
          Start voting on SplitVote →
        </Link>
      </div>
    </div>
  )
}

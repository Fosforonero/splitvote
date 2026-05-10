import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import CompanionDisplay from '@/components/CompanionDisplay'
import { getCompanionStage, getSpeciesVotes, type CompanionSpecies, type PixieXpMap } from '@/lib/companion'
import ProfileShareButton from '@/components/ProfileShareButton'

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
    .select('display_name, votes_count, avatar_emoji, companion_species, pixie_xp')
    .eq('id', params.id)
    .single()

  if (!data) return {}
  const name = data.display_name ?? 'A SplitVote member'
  const avatar = data.avatar_emoji ?? '🌍'
  const votesCount = data.votes_count ?? 0

  // Build pixie-card OG image URL
  const species = ((data as Record<string, unknown>).companion_species as CompanionSpecies | null) ?? 'spark'
  const pixieXp = ((data as Record<string, unknown>).pixie_xp as PixieXpMap | null) ?? {}
  const speciesVotes = getSpeciesVotes(pixieXp, species)
  const stage = getCompanionStage(speciesVotes > 0 ? speciesVotes : votesCount)
  const cardUrl = `${BASE}/api/pixie-card?species=${encodeURIComponent(species)}&stage=${stage}&name=${encodeURIComponent(name.slice(0, 22))}&locale=en`

  return {
    title: `${avatar} ${name} on SplitVote`,
    description: `${name} has voted on ${votesCount} dilemmas worldwide. See their Pixie companion and trophy case on SplitVote.`,
    openGraph: {
      title: `${avatar} ${name} — SplitVote Profile`,
      description: `${votesCount} votes cast. Check out their Pixie companion and badges.`,
      images: [
        {
          url: cardUrl,
          width: 1200,
          height: 630,
          alt: `${name}'s Pixie companion on SplitVote`,
        },
      ],
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
      .select('display_name, votes_count, avatar_emoji, is_premium, country_code, created_at, companion_species, xp, streak_days')
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

  type RawBadgeRow = {
    badge_id: string
    earned_at: string
    is_equipped: boolean
    badges: { name: string; emoji: string; rarity: string; description: string } | null
  }
  // Filter out rows where the badges join is null (orphaned user_badges rows)
  const badges = ((badgesRes.data ?? []) as unknown as RawBadgeRow[])
    .filter((b): b is RawBadgeRow & { badges: NonNullable<RawBadgeRow['badges']> } => b.badges != null)

  const displayName = profile.display_name ?? 'Anonymous Voter'
  const avatar = profile.avatar_emoji ?? '🌍'
  const joinDate = new Date(profile.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const votesCount = profile.votes_count ?? 0
  const companionSpecies = ((profile as Record<string, unknown>).companion_species as CompanionSpecies | null) ?? 'spark'
  const xp = ((profile as Record<string, unknown>).xp as number | null) ?? 0

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
        <div className="text-7xl mb-4">{avatar}</div>
        <h1 className="text-3xl font-black text-white mb-2">{displayName}</h1>
        <div className="flex items-center justify-center gap-2 flex-wrap mb-2">
          <span className="text-xs text-[var(--muted)] border border-white/10 px-2.5 py-0.5 rounded-full">
            👁 Public Profile
          </span>
          {profile.is_premium && (
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-400 border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 rounded-full">
              ⭐ Premium
            </span>
          )}
        </div>
        <p className="text-[var(--muted)] text-sm mt-1">Member since {joinDate}</p>
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

      {/* ── Share profile ── */}
      <div className="mb-8">
        <ProfileShareButton
          profileUrl={`${BASE}/u/${params.id}`}
          displayName={displayName}
        />
      </div>

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

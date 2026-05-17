import { notFound } from 'next/navigation'
import { createPublicClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import CompanionDisplay from '@/components/CompanionDisplay'
import CosmeticAvatar from '@/components/CosmeticAvatar'
import CosmeticName from '@/components/CosmeticName'
import type { CompanionSpecies } from '@/lib/companion'
import { PIXIE_ITEM_MAP } from '@/lib/pixie-store'
import type { PixieItemId } from '@/lib/pixie-store'
import { RARITY_ORDER } from '@/lib/rarity'
import type { Rarity } from '@/lib/rarity'
import { getLevelInfo } from '@/lib/missions'
import { getEquippedCosmetics } from '@/lib/cosmetics'
import { getPixieImagePath } from '@/lib/pixie'
import { getCompanionStage, getSpeciesVotes, type PixieXpMap } from '@/lib/companion'
import ProfileStatsLine, { type StatsLineItem } from '@/components/ProfileStatsLine'
import BadgeChip from '@/components/BadgeChip'

const BASE = 'https://splitvote.io'

interface Props { params: { id: string }; searchParams?: { from?: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const admin = createPublicClient()
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

// Public profile — ISR: revalidate every hour (no per-user content here)
export const revalidate = 3600

export default async function PublicProfilePage({ params, searchParams }: Props) {
  // Public profile — uses anon client (no cookies, ISR-safe)
  // RLS must allow SELECT on profiles/user_badges for anon role.
  const admin = createPublicClient()

  const [profileRes, badgesRes] = await Promise.all([
    admin
      .from('profiles')
      .select('display_name, votes_count, avatar_emoji, is_premium, country_code, created_at, companion_species, xp, streak_days, pixie_xp, use_pixie_avatar, equipped_frame, equipped_glow, name_color')
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

  // Back-link: restore leaderboard context if user arrived from there
  const fromParam  = searchParams?.from
  const backHref   = fromParam === 'leaderboard'    ? '/leaderboard'
                   : fromParam === 'it-leaderboard' ? '/it/leaderboard'
                   : '/'
  const backLabel  = fromParam === 'leaderboard'    ? '← Leaderboard'
                   : fromParam === 'it-leaderboard' ? '← Classifica'
                   : '← SplitVote'

  const displayName    = profile.display_name ?? 'Anonymous Voter'
  const avatarEmoji    = profile.avatar_emoji ?? '🌍'
  const votesCount     = profile.votes_count ?? 0
  const companionSpecies = ((profile as Record<string, unknown>).companion_species as CompanionSpecies | null) ?? 'spark'
  const xp             = ((profile as Record<string, unknown>).xp as number | null) ?? 0
  const streakDays     = ((profile as Record<string, unknown>).streak_days as number | null) ?? 0
  const levelInfo      = getLevelInfo(xp)

  // Pixie avatar logic
  const usePixieAvatar = ((profile as Record<string, unknown>).use_pixie_avatar as boolean | null) ?? false
  const pixieXp        = ((profile as Record<string, unknown>).pixie_xp as Record<string, unknown> | null) ?? {}
  const activePixieId  = typeof pixieXp.active === 'string' ? pixieXp.active as PixieItemId : null
  const activePixieItem = activePixieId ? PIXIE_ITEM_MAP[activePixieId] : null

  // Avatar shown in profile hero:
  // - When use_pixie_avatar is on, show the full Pixie SPRITE PNG from the
  //   user's companion species + stage (not the skin emoji).
  // - Otherwise, show the user's chosen avatar emoji.
  // The skin emoji (👑, 💎, 🌌...) is fallback if the sprite image fails.
  const heroAvatar  = usePixieAvatar && activePixieItem ? activePixieItem.emoji : avatarEmoji
  const heroIsPixie = usePixieAvatar && !!activePixieItem
  const speciesVotes   = pixieXp && Object.keys(pixieXp).length > 0
    ? getSpeciesVotes(pixieXp as PixieXpMap, companionSpecies)
    : 0
  const effectiveVotes = pixieXp && Object.keys(pixieXp).length > 0 ? speciesVotes : votesCount
  const companionStage = getCompanionStage(effectiveVotes)
  const heroPixieSrc   = usePixieAvatar
    ? getPixieImagePath(companionSpecies, companionStage)
    : null

  // Rarity order from lib/rarity.ts — legendary first
  const sortedBadges = [...badges].sort((a, b) =>
    (RARITY_ORDER[a.badges.rarity] ?? 4) - (RARITY_ORDER[b.badges.rarity] ?? 4)
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      {/* Back */}
      <Link href={backHref} className="text-sm text-[var(--muted)] hover:text-white transition-colors mb-8 inline-block">
        {backLabel}
      </Link>

      {/* ── Profile hero ── */}
      {(() => {
        const cosmetics = getEquippedCosmetics(profile as unknown as { equipped_frame?: string | null; equipped_glow?: string | null; name_color?: string | null })
        const memberSince = new Date(profile.created_at).toLocaleDateString('en-GB', {
          month: 'long',
          year:  'numeric',
        })
        const statsItems: StatsLineItem[] = [
          { icon: '🗳', value: votesCount.toLocaleString(), label: 'votes' },
          { icon: '⚡', value: `Lv.${levelInfo.level}` },
          { icon: '🔥', value: streakDays, label: 'day streak', show: streakDays > 0 },
          { icon: '🏆', value: badges.length, label: 'badges', show: badges.length > 0 },
          { icon: '📍', value: profile.country_code ?? '', show: !!profile.country_code },
          { icon: '📅', value: memberSince, label: 'Member since', prefix: true },
        ]
        return (
          <div className="rounded-3xl border border-[var(--border)] bg-[#0d0d1a]/60 p-8 mb-8 text-center">
            {/* Avatar: Pixie sprite when use_pixie_avatar is on, else emoji — wrapped with optional cosmetic frame */}
            <div className="mb-4 inline-flex items-center justify-center">
              <CosmeticAvatar
                emoji={heroAvatar}
                pixieSrc={heroPixieSrc}
                frame={cosmetics.frame}
                size="xl"
                ariaLabel={`${displayName} avatar`}
              />
            </div>
            {heroIsPixie && activePixieItem && (
              <p className="text-xs text-blue-400 font-semibold -mt-2 mb-3">
                {activePixieItem.name} skin
              </p>
            )}
            <h1 className="text-3xl font-black text-white mb-1">
              <CosmeticName
                name={displayName}
                glow={cosmetics.glow}
                nameColor={cosmetics.nameColor}
              />
            </h1>
        {profile.is_premium && (
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-yellow-400 border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 rounded-full mb-3">
            ⭐ Premium
          </span>
        )}

        <ProfileStatsLine align="center" items={statsItems} className="mt-4" />
          </div>
        )
      })()}

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
                className="rounded-xl p-3 text-center flex flex-col items-center gap-1.5"
              >
                <BadgeChip
                  emoji={b.badges.emoji}
                  rarity={b.badges.rarity as Rarity}
                  title={b.badges.name}
                  size="lg"
                />
                <p className="text-xs font-semibold leading-tight text-white">{b.badges.name}</p>
                <p className="text-xs opacity-60 capitalize">{b.badges.rarity}</p>
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

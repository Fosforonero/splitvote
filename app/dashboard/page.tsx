import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getScenario } from '@/lib/scenarios'
import { getDynamicScenarios } from '@/lib/dynamic-scenarios'
import BadgeSection from './BadgeSection'
import OnboardingModal from './OnboardingModal'
import CompanionDisplay from '@/components/CompanionDisplay'
import DailyMissions from '@/components/DailyMissions'
import PixieSelector from '@/components/PixieSelector'
import CosmeticName from '@/components/CosmeticName'
import CosmeticAvatar from '@/components/CosmeticAvatar'
import ProfileStatsLine, { type StatsLineItem } from '@/components/ProfileStatsLine'
import BadgeChip from '@/components/BadgeChip'
import type { Rarity } from '@/lib/rarity'
import { getLevelInfo } from '@/lib/missions'
import type { CompanionSpecies } from '@/lib/companion'
import { getUserEntitlements } from '@/lib/entitlements'
import type { UserRole } from '@/lib/admin-auth'
import { getEquippedCosmetics } from '@/lib/cosmetics'
import { COSMETIC_MAP, type CosmeticItemId } from '@/lib/cosmetics-store'
import { getProfilePixieSrc } from '@/lib/pixie'

export const metadata = { title: 'Dashboard | SplitVote' }

type PollStatus = 'pending' | 'approved' | 'rejected' | 'flagged'

interface UserPoll {
  id: string
  question: string
  status: PollStatus
  votes_a: number
  votes_b: number
  created_at: string
}

interface DilemmaVote {
  dilemma_id: string
  choice: 'A' | 'B'
  voted_at: string
  can_change_until: string
}

interface UserBadge {
  badge_id: string
  earned_at: string
  is_equipped: boolean
  badges: {
    name: string
    emoji: string
    rarity: string
    description: string
  }
}

interface Profile {
  display_name: string | null
  email: string | null
  is_premium: boolean
  votes_count: number
  equipped_frame: string | null
  equipped_glow: string | null
  equipped_badge: string | null
  onboarding_done: boolean
  xp: number | null
  streak_days: number | null
  companion_species: string | null
  pixie_xp: Record<string, unknown> | null
  use_pixie_avatar: boolean | null
  name_color: string | null
  role: UserRole | null
  avatar_emoji: string | null
  country_code: string | null
  created_at: string | null
}



const STATUS_BADGE: Record<PollStatus, { label: string; classes: string }> = {
  pending:  { label: '⏳ Pending review',  classes: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' },
  approved: { label: '✅ Live',             classes: 'text-green-400  bg-green-500/10  border-green-500/30'  },
  rejected: { label: '❌ Rejected',         classes: 'text-red-400    bg-red-500/10    border-red-500/30'    },
  flagged:  { label: '🚩 Flagged',          classes: 'text-orange-400 bg-orange-500/10 border-orange-500/30' },
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/dashboard')

  // Fetch all data in parallel
  const [profileRes, pollsRes, dilemmaVotesRes, badgesRes] = await Promise.all([
    supabase
      .from('profiles')
      .select('display_name, email, is_premium, votes_count, equipped_frame, equipped_glow, equipped_badge, onboarding_done, xp, streak_days, companion_species, pixie_xp, use_pixie_avatar, name_color, role, avatar_emoji, country_code, created_at')
      .eq('id', user.id)
      .single<Profile>(),
    supabase
      .from('user_polls')
      .select('id, question, status, votes_a, votes_b, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('dilemma_votes')
      .select('dilemma_id, choice, voted_at, can_change_until')
      .eq('user_id', user.id)
      .order('voted_at', { ascending: false })
      .limit(30),
    supabase
      .from('user_badges')
      .select('badge_id, earned_at, is_equipped, badges(name, emoji, rarity, description)')
      .eq('user_id', user.id)
      .order('earned_at', { ascending: false }),
  ])

  const profile = profileRes.data
  const typedPolls = (pollsRes.data ?? []) as UserPoll[]
  const dilemmaVotes = (dilemmaVotesRes.data ?? []) as DilemmaVote[]
  const userBadges = (badgesRes.data ?? []) as unknown as UserBadge[]

  const votesCount = profile?.votes_count ?? 0
  const xp = profile?.xp ?? 0
  const streakDays = profile?.streak_days ?? 0
  const companionSpecies = (profile?.companion_species ?? 'spark') as CompanionSpecies

  // Entitlements — admin/premium derivation. Mirrors the bypass on /store so
  // PixieSelector renders every cosmetic as owned for admin/super_admin users.
  const entitlements = getUserEntitlements({
    email: user.email,
    is_premium: profile?.is_premium ?? false,
    role: (profile?.role ?? 'user') as UserRole,
  })

  // Pixie Store data
  const pixieXp        = (profile?.pixie_xp ?? {}) as Record<string, unknown>
  const pixieOwnedIds  = Array.isArray(pixieXp.owned) ? pixieXp.owned as string[] : []
  const activePixieId  = typeof pixieXp.active === 'string' ? pixieXp.active : null

  // Fetch user's purchased pixie items from user_purchases as fallback
  let purchasedPixieIds: string[] = pixieOwnedIds
  try {
    const admin = createAdminClient()
    const { data: purchases } = await admin
      .from('user_purchases')
      .select('product_id')
      .eq('user_id', user.id)
      .eq('status', 'purchased')
    if (purchases) {
      purchasedPixieIds = Array.from(new Set([
        ...pixieOwnedIds,
        ...purchases.map((p: { product_id: string }) => p.product_id),
      ]))
    }
  } catch {
    // fallback to pixie_xp.owned
  }

  const totalPollVotes = typedPolls.reduce((acc, p) => acc + p.votes_a + p.votes_b, 0)
  const approvedCount = typedPolls.filter(p => p.status === 'approved').length

  // Fetch dynamic scenarios ONCE (no N+1 Redis calls)
  let dynamicMap = new Map<string, Awaited<ReturnType<typeof getDynamicScenarios>>[number]>()
  try {
    const dynamicList = await getDynamicScenarios()
    dynamicMap = new Map(dynamicList.map(s => [s.id, s]))
  } catch {
    // Redis unavailable — only static scenarios resolvable
  }

  // Resolve dilemma titles for the history (no awaits inside the map)
  const dilemmaDetails = dilemmaVotes.map((v) => {
    const scenario = getScenario(v.dilemma_id) ?? dynamicMap.get(v.dilemma_id)
    return {
      ...v,
      question: scenario?.question ?? v.dilemma_id,
      optionA: scenario?.optionA ?? 'Option A',
      optionB: scenario?.optionB ?? 'Option B',
      emoji: scenario?.emoji ?? '🤔',
      canChange: new Date(v.can_change_until) > new Date(),
    }
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">

      {/* ── Onboarding modal (first login) ── */}
      {profile && !profile.onboarding_done && <OnboardingModal />}

      {/* ── Header ── */}
      {(() => {
        const cosmetics      = getEquippedCosmetics(profile)
        const pixieXpRecord  = profile?.pixie_xp as Record<string, unknown> | null
        const activePixieId  = typeof pixieXpRecord?.active === 'string' ? pixieXpRecord.active as CosmeticItemId : null
        // When use_pixie_avatar is on, render the actual Pixie sprite (PNG)
        // from the companion species + stage. Stage derivation lives inside
        // getProfilePixieSrc so all surfaces (dashboard, /u/[id], leaderboard)
        // resolve it identically.
        const companionSpecies = (profile?.companion_species ?? 'spark') as CompanionSpecies
        const pixieSrc        = getProfilePixieSrc({
          companion_species: profile?.companion_species,
          use_pixie_avatar:  profile?.use_pixie_avatar,
          pixie_xp:          pixieXpRecord,
          votes_count:       profile?.votes_count,
        })
        // Emoji fallback: skin emoji if use_pixie_avatar on but image fails,
        // otherwise user's chosen avatar_emoji.
        const headerEmoji    = profile?.use_pixie_avatar && activePixieId
          ? COSMETIC_MAP[activePixieId]?.emoji ?? profile?.avatar_emoji ?? '🌍'
          : profile?.avatar_emoji ?? '🌍'
        const levelInfo = getLevelInfo(profile?.xp ?? 0)
        const memberSince = profile?.created_at
          ? new Date(profile.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
          : ''
        const statsItems: StatsLineItem[] = [
          { icon: '🗳', value: (profile?.votes_count ?? 0).toLocaleString(), label: 'votes' },
          { icon: '⚡', value: `Lv.${levelInfo.level}` },
          { icon: '🔥', value: profile?.streak_days ?? 0, label: 'day streak', show: (profile?.streak_days ?? 0) > 0 },
          { icon: '🏆', value: userBadges.length, label: 'badges', show: userBadges.length > 0 },
          { icon: '📍', value: profile?.country_code ?? '', show: !!profile?.country_code },
          { icon: '📅', value: memberSince, label: 'Member since', prefix: true, show: !!memberSince },
        ]
        return (
          <div className="mb-10 flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <CosmeticAvatar
                emoji={headerEmoji}
                pixieSrc={pixieSrc}
                frame={cosmetics.frame}
                size="lg"
                ariaLabel={profile?.display_name ?? 'You'}
                priority
              />
              <div className="min-w-0">
                <h1 className="text-3xl font-black text-white mb-1">
                  Hey,{' '}
                  <CosmeticName
                    name={profile?.display_name?.split(' ')[0] ?? 'there'}
                    glow={cosmetics.glow}
                    nameColor={cosmetics.nameColor}
                  />{' '}
                  👋
                </h1>
                <p className="text-[var(--muted)] text-sm truncate">{profile?.email ?? user.email}</p>
                <ProfileStatsLine align="left" items={statsItems} className="mt-2" />
              </div>
            </div>
            {userBadges.length > 0 && (
              <div className="flex gap-1.5 flex-wrap justify-end mt-1">
                {userBadges.filter(b => b.badges != null).slice(0, 5).map(b => (
                  <BadgeChip
                    key={b.badge_id}
                    emoji={b.badges.emoji}
                    rarity={b.badges.rarity as Rarity}
                    title={b.badges.name}
                    size="md"
                  />
                ))}
              </div>
            )}
          </div>
        )
      })()}

      {/* ── Companion ── */}
      <CompanionDisplay
        species={companionSpecies}
        votesCount={votesCount}
        xp={xp}
      />

      {/* ── Cosmetici (Pixie Skins + Avatar toggle) ── */}
      <PixieSelector
        ownedIds={purchasedPixieIds}
        activePixieId={activePixieId}
        equippedFrame={profile?.equipped_frame ?? null}
        equippedGlow={profile?.equipped_glow ?? null}
        nameColor={profile?.name_color ?? null}
        usePixieAvatar={profile?.use_pixie_avatar ?? false}
        isAdmin={entitlements.isAdmin}
      />

      {/* ── Daily Missions ── */}
      <DailyMissions
        userId={user.id}
        xp={xp}
        streakDays={streakDays}
        votesToday={dilemmaVotes.filter(v => {
          const today = new Date().toISOString().split('T')[0]
          return v.voted_at?.startsWith(today)
        }).length}
      />

      {/* ── Premium status ── */}
      {profile?.is_premium ? (
        <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-5 mb-8 flex items-center gap-4">
          <div className="text-2xl">⭐</div>
          <div>
            <p className="font-bold text-yellow-400 text-sm">Premium Active</p>
            <p className="text-[var(--muted)] text-xs mt-0.5">You have access to all premium features.</p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5 mb-8">
          <p className="font-bold text-blue-400 text-sm">Free Plan</p>
          <p className="text-[var(--muted)] text-xs mt-0.5">Premium features coming soon — stay tuned!</p>
        </div>
      )}

      {/* ── Stats ── */}
      <div className="grid grid-cols-4 gap-3 mb-10">
        {[
          { label: 'Dilemmas voted', value: votesCount },
          { label: 'Polls submitted', value: typedPolls.length },
          { label: 'Polls live', value: approvedCount },
          { label: 'Badges earned', value: userBadges.length },
        ].map(stat => (
          <div key={stat.label} className="rounded-2xl border border-[var(--border)] bg-[#0d0d1a]/60 p-4 text-center">
            <p className="text-2xl font-black text-white">{stat.value}</p>
            <p className="text-[var(--muted)] text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Badge collection (with equip toggle) ── */}
      {userBadges.filter(b => b.badges != null).length > 0 && (
        <BadgeSection initialBadges={userBadges.filter(b => b.badges != null) as unknown as Parameters<typeof BadgeSection>[0]['initialBadges']} />
      )}

      {/* ── Answer History ── */}
      <div className="mb-10">
        <h2 className="text-lg font-black text-white mb-4">🗳️ Your Vote History</h2>
        {dilemmaDetails.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[#0d0d1a]/60 p-10 text-center">
            <p className="text-4xl mb-3">🤔</p>
            <p className="text-[var(--muted)] text-sm">You haven&apos;t voted yet. Go explore some dilemmas!</p>
            <a href="/" className="inline-block mt-4 text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors">
              Start voting →
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {dilemmaDetails.map(v => (
              <a
                key={v.dilemma_id}
                href={`/results/${v.dilemma_id}`}
                className="block rounded-2xl border border-[var(--border)] bg-[#0d0d1a]/60 p-4 hover:border-blue-500/30 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0 mt-0.5">{v.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium leading-snug mb-2 line-clamp-2">{v.question}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        v.choice === 'A'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}>
                        You chose {v.choice === 'A' ? v.optionA : v.optionB}
                      </span>
                      {v.canChange && (
                        <span className="text-xs text-yellow-400/70 border border-yellow-500/20 px-2 py-0.5 rounded-lg">
                          ⏱ Can change for {Math.ceil((new Date(v.can_change_until).getTime() - Date.now()) / 3600000)}h
                        </span>
                      )}
                      {!v.canChange && (
                        <span className="text-xs text-[var(--muted)] border border-white/10 px-2 py-0.5 rounded-lg">
                          🔒 Locked
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[var(--muted)] text-xs group-hover:text-blue-400 transition-colors">
                    See results →
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* ── Submitted Polls ── */}
      {typedPolls.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-white">Your Submitted Polls</h2>
            {profile?.is_premium && (
              <a href="/submit-poll" className="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white transition-colors">
                + Submit new
              </a>
            )}
          </div>
          <div className="space-y-3">
            {typedPolls.map(poll => {
              const badge = STATUS_BADGE[poll.status]
              const total = poll.votes_a + poll.votes_b
              const pctA = total ? Math.round((poll.votes_a / total) * 100) : 50
              return (
                <div key={poll.id} className="rounded-2xl border border-[var(--border)] bg-[#0d0d1a]/60 p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <p className="text-sm text-white font-semibold leading-snug flex-1">{poll.question}</p>
                    <span className={`flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-lg border ${badge.classes}`}>
                      {badge.label}
                    </span>
                  </div>
                  {total > 0 && (
                    <div>
                      <div className="flex justify-between text-xs text-[var(--muted)] mb-1">
                        <span>A: {pctA}%</span>
                        <span>{total.toLocaleString()} votes</span>
                        <span>B: {100 - pctA}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${pctA}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getScenario } from '@/lib/scenarios'
import { getDynamicScenarios } from '@/lib/dynamic-scenarios'
import CompanionDisplay from '@/components/CompanionDisplay'
import DailyMissions from '@/components/DailyMissions'
import PixieSelector from '@/components/PixieSelector'
import type { CompanionSpecies } from '@/lib/companion'
import { RARITY_STYLES } from '@/lib/rarity'

// Lazy-load heavy/conditional client components — skips their JS on first paint
const OnboardingModal = dynamic(() => import('./OnboardingModal'), { ssr: false })
const BadgeSection    = dynamic(() => import('./BadgeSection'),    { ssr: false })

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
}

const STATUS_BADGE: Record<PollStatus, { en: string; it: string; classes: string }> = {
  pending:  { en: '⏳ Pending review', it: '⏳ In revisione',  classes: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' },
  approved: { en: '✅ Live',            it: '✅ Online',         classes: 'text-green-400  bg-green-500/10  border-green-500/30'  },
  rejected: { en: '❌ Rejected',        it: '❌ Rifiutato',      classes: 'text-red-400    bg-red-500/10    border-red-500/30'    },
  flagged:  { en: '🚩 Flagged',         it: '🚩 Segnalato',      classes: 'text-orange-400 bg-orange-500/10 border-orange-500/30' },
}

const COPY = {
  en: {
    hey:              'Hey,',
    premiumActive:    'Premium Active',
    premiumDesc:      'You have access to all premium features.',
    freePlan:         'Free Plan',
    freePlanDesc:     'Premium features coming soon — stay tuned!',
    statsVoted:       'Dilemmas voted',
    statsStreak:      'Day streak',
    statsLive:        'Polls live',
    statsBadges:      'Badges earned',
    voteHistory:      '🗳️ Your Vote History',
    noVotes:          "You haven't voted yet. Go explore some dilemmas!",
    startVoting:      'Start voting →',
    canChange:        'Can change for',
    locked:           '🔒 Locked',
    seeResults:       'See results →',
    yourPolls:        'Your Submitted Polls',
    submitNew:        '+ Submit new',
  },
  it: {
    hey:              'Ciao,',
    premiumActive:    'Premium Attivo',
    premiumDesc:      'Hai accesso a tutte le funzioni premium.',
    freePlan:         'Piano Free',
    freePlanDesc:     'Funzioni premium in arrivo — resta sintonizzato!',
    statsVoted:       'Dilemmi votati',
    statsStreak:      'Giorni streak',
    statsLive:        'Sondaggi attivi',
    statsBadges:      'Trofei ottenuti',
    voteHistory:      '🗳️ Cronologia voti',
    noVotes:          'Non hai ancora votato. Esplora alcuni dilemmi!',
    startVoting:      'Inizia a votare →',
    canChange:        'Cambiabile per',
    locked:           '🔒 Bloccato',
    seeResults:       'Vedi risultati →',
    yourPolls:        'I tuoi sondaggi inviati',
    submitNew:        '+ Invia nuovo',
  },
} as const

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/dashboard')

  // Locale from cookie (set by language toggle / IT route)
  const cookieStore = await cookies()
  const locale = cookieStore.get('lang-pref')?.value === 'it' ? 'it' : 'en'
  const t = COPY[locale as keyof typeof COPY]

  // Fetch all data in parallel
  const [profileRes, pollsRes, dilemmaVotesRes, badgesRes] = await Promise.all([
    supabase
      .from('profiles')
      .select('display_name, email, is_premium, votes_count, equipped_frame, equipped_glow, equipped_badge, onboarding_done, xp, streak_days, companion_species, pixie_xp, use_pixie_avatar, name_color')
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
      <div className="mb-10 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">
            {t.hey} {profile?.display_name?.split(' ')[0] ?? (locale === 'it' ? 'tu' : 'there')} 👋
          </h1>
          <p className="text-[var(--muted)] text-sm">{profile?.email ?? user.email}</p>
        </div>
        {userBadges.length > 0 && (
          <div className="flex gap-1.5 flex-wrap justify-end mt-1">
            {userBadges.slice(0, 5).map(b => (
              <span
                key={b.badge_id}
                title={b.badges.name}
                className={`text-xl px-2.5 py-1 rounded-xl border ${RARITY_STYLES[b.badges.rarity] ?? RARITY_STYLES.common}`}
              >
                {b.badges.emoji}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Daily Missions — first thing returning users see ── */}
      <DailyMissions
        userId={user.id}
        xp={xp}
        streakDays={streakDays}
        locale={locale}
      />

      {/* ── Companion ── */}
      <CompanionDisplay
        species={companionSpecies}
        votesCount={votesCount}
        xp={xp}
        locale={locale}
      />

      {/* ── Cosmetici (Pixie Skins + Avatar toggle) ── */}
      <PixieSelector
        ownedIds={purchasedPixieIds}
        activePixieId={activePixieId}
        equippedFrame={profile?.equipped_frame ?? null}
        equippedGlow={profile?.equipped_glow ?? null}
        nameColor={profile?.name_color ?? null}
        usePixieAvatar={profile?.use_pixie_avatar ?? false}
        locale={locale}
      />

      {/* ── Premium status ── */}
      {profile?.is_premium ? (
        <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-5 mb-8 flex items-center gap-4">
          <div className="text-2xl">⭐</div>
          <div>
            <p className="font-bold text-yellow-400 text-sm">{t.premiumActive}</p>
            <p className="text-[var(--muted)] text-xs mt-0.5">{t.premiumDesc}</p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5 mb-8">
          <p className="font-bold text-blue-400 text-sm">{t.freePlan}</p>
          <p className="text-[var(--muted)] text-xs mt-0.5">{t.freePlanDesc}</p>
        </div>
      )}

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {[
          { label: t.statsVoted,  value: votesCount },
          { label: t.statsStreak, value: streakDays, highlight: streakDays > 0 },
          { label: t.statsLive,   value: approvedCount },
          { label: t.statsBadges, value: userBadges.length },
        ].map(stat => (
          <div key={stat.label} className={`rounded-2xl border p-4 text-center ${(stat as { highlight?: boolean }).highlight ? 'border-orange-500/30 bg-orange-500/5' : 'border-[var(--border)] bg-[#0d0d1a]/60'}`}>
            <p className={`text-2xl font-black ${(stat as { highlight?: boolean }).highlight ? 'text-orange-400' : 'text-white'}`}>
              {(stat as { highlight?: boolean }).highlight ? `🔥 ${stat.value}` : stat.value}
            </p>
            <p className="text-[var(--muted)] text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Badge collection (with equip toggle) ── */}
      {userBadges.length > 0 && (
        <BadgeSection initialBadges={userBadges as unknown as UserBadge[]} />
      )}

      {/* ── Answer History ── */}
      <div className="mb-10">
        <h2 className="text-lg font-black text-white mb-4">{t.voteHistory}</h2>
        {dilemmaDetails.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[#0d0d1a]/60 p-10 text-center">
            <p className="text-4xl mb-3">🤔</p>
            <p className="text-[var(--muted)] text-sm">{t.noVotes}</p>
            <a href={locale === 'it' ? '/it' : '/'} className="inline-block mt-4 text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors">
              {t.startVoting}
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
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {locale === 'it' ? 'Hai scelto' : 'You chose'} {v.choice === 'A' ? v.optionA : v.optionB}
                      </span>
                      {v.canChange && (
                        <span className="text-xs text-yellow-400/70 border border-yellow-500/20 px-2 py-0.5 rounded-lg">
                          ⏱ {t.canChange} {Math.ceil((new Date(v.can_change_until).getTime() - Date.now()) / 3600000)}h
                        </span>
                      )}
                      {!v.canChange && (
                        <span className="text-xs text-[var(--muted)] border border-white/10 px-2 py-0.5 rounded-lg">
                          {t.locked}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[var(--muted)] text-xs group-hover:text-blue-400 transition-colors">
                    {t.seeResults}
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
            <h2 className="text-lg font-black text-white">{t.yourPolls}</h2>
            {profile?.is_premium && (
              <a href="/submit-poll" className="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white transition-colors">
                {t.submitNew}
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
                      {badge[locale as 'en' | 'it']}
                    </span>
                  </div>
                  {total > 0 && (
                    <div>
                      <div className="flex justify-between text-xs text-[var(--muted)] mb-1">
                        <span className="text-red-400/80">A: {pctA}%</span>
                        <span>{total.toLocaleString()} {locale === 'it' ? 'voti' : 'votes'}</span>
                        <span className="text-blue-400/80">B: {100 - pctA}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-500 to-blue-500 rounded-full" style={{ width: `${pctA}%` }} />
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

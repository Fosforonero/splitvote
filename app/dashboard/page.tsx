import { redirect } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getUserEntitlements } from '@/lib/entitlements'
import type { UserRole } from '@/lib/admin-auth'
import { getScenario } from '@/lib/scenarios'
import { getDynamicScenarios } from '@/lib/dynamic-scenarios'
import BadgeSection from './BadgeSection'
import OnboardingModal from './OnboardingModal'
import CompanionDisplay from '@/components/CompanionDisplay'
import DailyMissions from '@/components/DailyMissions'
import PixieSelector from '@/components/PixieSelector'
import ProfileShareButton from '@/components/ProfileShareButton'
import MobileStickyHUD from '@/components/MobileStickyHUD'
import MobileFloatingVoteCTA from '@/components/MobileFloatingVoteCTA'
import type { CompanionSpecies, PixieXpMap } from '@/lib/companion'
import { ownedMarketSpeciesFromPurchases, type PurchaseRow } from '@/lib/purchases'
import { STREAK_MILESTONES, getStreakProgress } from '@/lib/badges'
import { getLevelInfo } from '@/lib/missions'

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
  role: string | null
  votes_count: number
  equipped_frame: string | null
  equipped_badge: string | null
  onboarding_done: boolean
  xp: number | null
  streak_days: number | null
  companion_species: string | null
  pixie_xp: Record<string, number> | null
}

const STATUS_BADGE: Record<PollStatus, { label: string; classes: string }> = {
  pending:  { label: '⏳ Pending review',  classes: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' },
  approved: { label: '✅ Live',             classes: 'text-green-400  bg-green-500/10  border-green-500/30'  },
  rejected: { label: '❌ Rejected',         classes: 'text-red-400    bg-red-500/10    border-red-500/30'    },
  flagged:  { label: '🚩 Flagged',          classes: 'text-orange-400 bg-orange-500/10 border-orange-500/30' },
}

const RARITY_STYLES: Record<string, string> = {
  common:    'border-slate-500/40 bg-slate-500/10 text-slate-300',
  rare:      'border-blue-500/40  bg-blue-500/10  text-blue-300',
  epic:      'border-purple-500/40 bg-purple-500/10 text-purple-300',
  legendary: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-300',
}

export default async function DashboardPage() {
  const locale = cookies().get('lang-pref')?.value === 'it' ? 'it' : 'en'
  const IT = locale === 'it'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/dashboard')

  // Compute "7 days ago" once for the referral-week query
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const sevenDaysAgoIso = sevenDaysAgo.toISOString()

  // Fetch all data in parallel
  const [profileRes, pollsRes, dilemmaVotesRes, badgesRes, referralWeekRes, referralAllRes, purchasesRes] = await Promise.all([
    supabase
      .from('profiles')
      .select('display_name, email, is_premium, role, votes_count, equipped_frame, equipped_badge, onboarding_done, xp, streak_days, companion_species, pixie_xp')
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
    // Referral visits in the last 7 days (graceful fallback if table missing)
    supabase
      .from('user_events')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('event_type', 'referral_visit')
      .gte('created_at', sevenDaysAgoIso),
    // Referral visits all-time
    supabase
      .from('user_events')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('event_type', 'referral_visit'),
    // One-time purchases (Pixie Market). Graceful: table may not exist pre-v16.
    supabase
      .from('user_purchases')
      .select('product_id, product_type, status, purchased_at')
      .eq('user_id', user.id)
      .eq('status', 'completed'),
  ])

  const profile = profileRes.data
  const typedPolls = (pollsRes.data ?? []) as UserPoll[]
  const dilemmaVotes = (dilemmaVotesRes.data ?? []) as DilemmaVote[]
  // Filter out rows where the badges join returned null (orphaned user_badges rows)
  const userBadges = ((badgesRes.data ?? []) as unknown as UserBadge[])
    .filter(b => b.badges != null)

  const ents = getUserEntitlements({
    email: user.email,
    is_premium: profile?.is_premium ?? false,
    role: (profile?.role ?? 'user') as UserRole,
  })

  // Derive owned market-tier Pixies from completed one-time purchases.
  // purchasesRes.error is non-fatal — if table doesn't exist (pre-v16), the list stays empty.
  const ownedMarketItems = purchasesRes.error
    ? []
    : ownedMarketSpeciesFromPurchases((purchasesRes.data ?? []) as unknown as PurchaseRow[])

  const votesCount = profile?.votes_count ?? 0
  const xp = profile?.xp ?? 0
  const streakDays = profile?.streak_days ?? 0
  const companionSpecies = (profile?.companion_species ?? 'spark') as CompanionSpecies
  const pixieXp: PixieXpMap = (profile?.pixie_xp as PixieXpMap) ?? {}

  // Level info derived from XP — surfaces "Lv. 3 · Philosopher" in hero
  const levelInfo = getLevelInfo(xp)

  // Referral counts (null on tables/RLS error → card hidden gracefully)
  const referralWeek = referralWeekRes.error ? null : (referralWeekRes.count ?? 0)
  const referralAll = referralAllRes.error ? null : (referralAllRes.count ?? 0)
  const showReferralCard = referralAll !== null

  // Has the user voted today? Drives the floating CTA pulse animation.
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const hasVotedToday = dilemmaVotes.some(v => new Date(v.voted_at) >= todayStart)
  const voteCtaHref = IT ? '/it/dilemmi-morali' : '/moral-dilemmas'


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
    <div className="max-w-3xl mx-auto px-4 pt-6 pb-28 md:pt-12 md:pb-12">

      {/* ── Mobile-only sticky HUD (appears on scroll past hero) ── */}
      <MobileStickyHUD
        species={companionSpecies}
        pixieXp={pixieXp}
        votesCount={votesCount}
        level={levelInfo.level}
        levelTitle={levelInfo.title}
        levelColor={levelInfo.color}
        xpIntoLevel={levelInfo.xpIntoLevel}
        xpForLevel={levelInfo.xpNeeded}
        progressPct={levelInfo.progressPct}
        streakDays={streakDays}
        locale={locale}
      />

      {/* ── Mobile-only floating "Vote" FAB (pulses if not voted today) ── */}
      <MobileFloatingVoteCTA
        href={voteCtaHref}
        pulse={!hasVotedToday}
        locale={locale}
      />

      {/* ── Onboarding modal (first login) ── */}
      {profile && !profile.onboarding_done && <OnboardingModal />}

      {/* ── Header ── */}
      <div className="mb-10 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl font-black text-white mb-1">
            {IT ? 'Ciao' : 'Hey'}, {profile?.display_name?.split(' ')[0] ?? (IT ? 'amico' : 'there')} 👋
          </h1>
          <p className="text-[var(--muted)] text-sm truncate">{profile?.email ?? user.email}</p>

          {/* Level pill — derived from total XP */}
          <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border border-white/10 bg-white/5">
            <span className={`text-xs font-black ${levelInfo.color}`}>
              {IT ? 'Lv.' : 'Lv.'} {levelInfo.level}
            </span>
            <span className="text-xs font-bold text-white/80">·</span>
            <span className={`text-xs font-bold ${levelInfo.color}`}>{levelInfo.title}</span>
            {levelInfo.xpNeeded > 0 && levelInfo.progressPct < 100 && (
              <>
                <span className="text-xs text-white/30 ml-1">·</span>
                <span className="text-[10px] text-[var(--muted)] tabular-nums">
                  {levelInfo.xpIntoLevel}/{levelInfo.xpNeeded} XP
                </span>
              </>
            )}
          </div>
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

      {/* ── Companion ── */}
      <CompanionDisplay
        species={companionSpecies}
        votesCount={votesCount}
        pixieXp={pixieXp}
        xp={xp}
        locale={locale}
        userId={user.id}
        enableLevelUpModal
      />

      {/* ── Pixie Selector ── */}
      <PixieSelector
        currentSpecies={companionSpecies}
        votesCount={votesCount}
        streakDays={streakDays}
        pixieXp={pixieXp}
        locale={locale}
        isPremium={ents.effectivePremium}
        isAdmin={ents.isAdmin}
        ownedMarketItems={ownedMarketItems}
      />

      {/* ── Store CTA ── */}
      <Link
        href={locale === 'it' ? '/it/store' : '/store'}
        className="group mb-8 flex items-center justify-between gap-3 rounded-2xl border border-fuchsia-500/30 bg-gradient-to-r from-fuchsia-500/10 via-purple-500/10 to-blue-500/10 px-5 py-4 transition-all hover:border-fuchsia-500/50 hover:from-fuchsia-500/15 hover:via-purple-500/15 hover:to-blue-500/15"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-fuchsia-500/20 text-xl">🛒</div>
          <div className="min-w-0">
            <p className="text-sm font-black text-white">
              {locale === 'it' ? 'Visita lo Store SplitVote' : 'Visit the SplitVote Store'}
            </p>
            <p className="text-xs text-[var(--muted)] truncate">
              {locale === 'it' ? 'Pixie leggendari, Premium e cosmetici esclusivi' : 'Legendary Pixies, Premium and exclusive cosmetics'}
            </p>
          </div>
        </div>
        <span className="text-fuchsia-300 font-bold text-sm transition-transform group-hover:translate-x-1">→</span>
      </Link>

      {/* ── Daily Missions ── */}
      <DailyMissions
        userId={user.id}
        xp={xp}
        streakDays={streakDays}
        locale={locale}
      />

      {/* ── Public profile ── */}
      <div className="rounded-2xl border border-[var(--border)] bg-[#0d0d1a]/60 p-5 mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">🌐</span>
          </div>
          <div className="min-w-0">
            <p className="font-bold text-white text-sm">
              {IT ? 'Il tuo profilo pubblico' : 'Your public profile'}
            </p>
            <p className="text-[var(--muted)] text-xs mt-0.5 truncate">
              splitvote.io/u/{user.id.slice(0, 8)}…
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href={`/u/${user.id}`}
            className="text-xs font-bold px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[var(--muted)] hover:bg-white/10 hover:text-white transition-colors"
            target="_blank"
            rel="noopener"
          >
            {IT ? 'Vedi →' : 'View →'}
          </Link>
          <ProfileShareButton
            profileUrl={`https://splitvote.io/u/${user.id}`}
            displayName={profile?.display_name ?? 'SplitVote user'}
            locale={locale}
            compact
          />
        </div>
      </div>

      {/* ── Referral impact (only when data is queryable) ── */}
      {showReferralCard && (
        <div className="rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 p-5 mb-8">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-lg">🔗</span>
              </div>
              <div>
                <p className="font-bold text-white text-sm">
                  {IT ? 'Il tuo impatto' : 'Your share impact'}
                </p>
                <p className="text-[var(--muted)] text-xs mt-0.5">
                  {IT ? 'Chi ha cliccato i tuoi link sfida' : 'Friends who visited your challenge links'}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-yellow-500/20 bg-white/[0.02] p-3 text-center">
              <p className="text-2xl font-black text-yellow-400 tabular-nums">{referralWeek ?? 0}</p>
              <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] mt-0.5 font-bold">
                {IT ? 'Questa settimana' : 'This week'}
              </p>
            </div>
            <div className="rounded-xl border border-yellow-500/20 bg-white/[0.02] p-3 text-center">
              <p className="text-2xl font-black text-orange-400 tabular-nums">{referralAll ?? 0}</p>
              <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] mt-0.5 font-bold">
                {IT ? 'Totale' : 'All time'}
              </p>
            </div>
          </div>
          {(referralAll ?? 0) === 0 && (
            <p className="text-[11px] text-[var(--muted)] italic mt-3 text-center">
              {IT
                ? 'Sfida un amico dopo un voto — il link è già pronto.'
                : 'Challenge a friend after voting — the link is ready to share.'}
            </p>
          )}
        </div>
      )}

      {/* ── Personality entry ── */}
      <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-5 mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">🧭</span>
          </div>
          <div>
            <p className="font-bold text-purple-400 text-sm">
              {votesCount >= 3
                ? (IT ? 'La tua Personalità Morale' : 'Your Moral Personality')
                : (IT ? 'Scopri la tua Personalità Morale' : 'Unlock Your Moral Personality')}
            </p>
            <p className="text-[var(--muted)] text-xs mt-0.5">
              {votesCount >= 3
                ? (IT ? 'Scopri il tuo archetipo dai tuoi voti.' : 'Discover your archetype based on your votes.')
                : IT
                  ? `Vota ancora ${Math.max(0, 3 - votesCount)} dilemm${3 - votesCount === 1 ? 'a' : 'i'} per sbloccare.`
                  : `Vote on ${Math.max(0, 3 - votesCount)} more dilemma${3 - votesCount === 1 ? '' : 's'} to unlock.`}
            </p>
          </div>
        </div>
        <Link
          href={IT ? '/it/personality' : '/personality'}
          className="text-xs font-bold px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 transition-colors flex-shrink-0"
        >
          {votesCount >= 3 ? (IT ? 'Vedi →' : 'View →') : `${votesCount} / 3`}
        </Link>
      </div>

      {/* ── Access status ── */}
      {ents.isAdmin ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5 mb-8 flex items-center gap-3">
          <span className="text-2xl">🛡️</span>
          <div>
            <p className="font-bold text-red-400 text-sm">Admin Access</p>
            <p className="text-[var(--muted)] text-xs mt-0.5">Internal full access — all features, no ads, unlimited renames.</p>
          </div>
        </div>
      ) : profile?.is_premium ? (
        <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-5 mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⭐</span>
            <div>
              <p className="font-bold text-yellow-400 text-sm">{IT ? 'Premium Attivo' : 'Premium Active'}</p>
              <p className="text-[var(--muted)] text-xs mt-0.5">
                {IT ? 'Senza pubblicità · Rename illimitati · Invia sondaggi' : 'No ads · Unlimited renames · Submit polls'}
              </p>
            </div>
          </div>
          <Link
            href="/profile#membership"
            className="text-xs font-bold px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 transition-colors flex-shrink-0"
          >
            {IT ? 'Gestisci →' : 'Manage →'}
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5 mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="font-bold text-blue-400 text-sm">{IT ? 'Piano Gratuito' : 'Free Plan'}</p>
            <p className="text-[var(--muted)] text-xs mt-0.5">
              {IT ? 'Rimuovi la pubblicità e sblocca i rename illimitati.' : 'Remove ads and unlock unlimited renames.'}
            </p>
          </div>
          <Link
            href="/profile#membership"
            className="text-xs font-bold px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors flex-shrink-0"
          >
            {IT ? 'Passa a Premium ✦' : 'Upgrade ✦'}
          </Link>
        </div>
      )}

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {[
          { label: IT ? 'Voti' : 'Votes cast', value: votesCount },
          { label: IT ? 'XP' : 'XP earned', value: xp },
          { label: IT ? 'Streak' : 'Day streak', value: streakDays },
          { label: 'Badge', value: userBadges.length },
        ].map(stat => (
          <div key={stat.label} className="rounded-2xl border border-[var(--border)] bg-[#0d0d1a]/60 p-4 text-center">
            <p className="text-2xl font-black text-white">{stat.value}</p>
            <p className="text-[var(--muted)] text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Streak Milestones ── */}
      {(() => {
        const { nextMilestone, pct, allEarned } = getStreakProgress(streakDays)
        const earnedIds = new Set(userBadges.map(b => b.badge_id))
        return (
          <div className="rounded-2xl border border-[var(--border)] bg-[#0d0d1a]/60 p-5 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-[var(--muted)]">
                {IT ? '🔥 Obiettivi Streak' : '🔥 Streak Milestones'}
              </h2>
              <span className="text-xs text-[var(--muted)]">
                {streakDays} {IT ? `giorn${streakDays !== 1 ? 'i' : 'o'} correnti` : `day${streakDays !== 1 ? 's' : ''} current`}
              </span>
            </div>

            {/* Progress bar toward next milestone */}
            {!allEarned && nextMilestone && (
              <div className="mb-4">
                <div className="h-1.5 bg-white/5 rounded-full mb-1.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-[var(--muted)]">
                  {streakDays} / {nextMilestone.days} {IT ? 'giorni per' : 'days to'} <span className="text-white">{nextMilestone.label}</span>
                </p>
              </div>
            )}
            {allEarned && (
              <p className="text-xs text-yellow-400 mb-4">
                {IT ? '🏅 Tutti gli obiettivi streak raggiunti — dedizione leggendaria!' : '🏅 All streak milestones earned — legendary dedication!'}
              </p>
            )}

            {/* Milestone list */}
            <div className="space-y-2">
              {STREAK_MILESTONES.map(m => {
                const earned = streakDays >= m.days || earnedIds.has(m.badgeId)
                return (
                  <div
                    key={m.badgeId}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors ${
                      earned
                        ? 'border-orange-500/30 bg-orange-500/5'
                        : 'border-white/5 bg-white/2 opacity-50'
                    }`}
                  >
                    <span className="text-xl flex-shrink-0">{earned ? m.emoji : '🔒'}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold leading-tight ${earned ? 'text-white' : 'text-[var(--muted)]'}`}>
                        {m.label}
                      </p>
                      <p className="text-[10px] text-[var(--muted)] mt-0.5">
                        {m.days} {IT ? 'giorni consecutivi' : 'consecutive days'}
                      </p>
                    </div>
                    {earned && (
                      <span className="text-[10px] font-bold text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-lg flex-shrink-0">
                        {IT ? '✓ Ottenuto' : '✓ Earned'}
                      </span>
                    )}
                    {!earned && (
                      <span className="text-[10px] text-[var(--muted)] flex-shrink-0">{m.days}d</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })()}

      {/* ── Badge collection (with equip toggle) ── */}
      {userBadges.length > 0 && (
        <BadgeSection initialBadges={userBadges as unknown as Parameters<typeof BadgeSection>[0]['initialBadges']} />
      )}

      {/* ── Answer History ── */}
      <div className="mb-10">
        <h2 className="text-lg font-black text-white mb-4">
          {IT ? '🗳️ I tuoi Voti' : '🗳️ Your Vote History'}
        </h2>
        {dilemmaDetails.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[#0d0d1a]/60 p-10 text-center">
            <p className="text-4xl mb-3">🤔</p>
            <p className="text-[var(--muted)] text-sm">
              {IT ? 'Non hai ancora votato. Esplora i dilemmi!' : "You haven't voted yet. Go explore some dilemmas!"}
            </p>
            <Link href="/" className="inline-block mt-4 text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors">
              {IT ? 'Inizia a votare →' : 'Start voting →'}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {dilemmaDetails.map(v => (
              <Link
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
                        {IT ? 'Hai scelto' : 'You chose'} {v.choice === 'A' ? v.optionA : v.optionB}
                      </span>
                      {v.canChange && (
                        <span className="text-xs text-yellow-400/70 border border-yellow-500/20 px-2 py-0.5 rounded-lg">
                          ⏱ {IT ? `Puoi cambiare per ${Math.ceil((new Date(v.can_change_until).getTime() - Date.now()) / 3600000)}h` : `Can change for ${Math.ceil((new Date(v.can_change_until).getTime() - Date.now()) / 3600000)}h`}
                        </span>
                      )}
                      {!v.canChange && (
                        <span className="text-xs text-[var(--muted)] border border-white/10 px-2 py-0.5 rounded-lg">
                          🔒 {IT ? 'Bloccato' : 'Locked'}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[var(--muted)] text-xs group-hover:text-blue-400 transition-colors">
                    {IT ? 'Vedi risultati →' : 'See results →'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── Submitted Polls ── */}
      {typedPolls.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-white">
              {IT ? 'Le tue Domande' : 'Your Submitted Polls'}
            </h2>
            {ents.canSubmitPoll && (
              <Link href="/submit-poll" className="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white transition-colors">
                {IT ? '+ Invia nuova' : '+ Submit new'}
              </Link>
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

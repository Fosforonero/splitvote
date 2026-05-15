import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  Users, Vote, Trophy, ClipboardList, Flame, UserPlus,
  Clock, CheckCircle, XCircle, Flag, Star, Settings,
  LayoutDashboard, UserCircle, TrendingUp, Eye, EyeOff,
  ThumbsUp, MessageSquare, BookOpen, BarChart2, Zap, Search, ShieldCheck, Inbox,
} from 'lucide-react'
import { VotesChart, SignupsChart } from './AdminCharts'
import CronDebug from './CronDebug'
import GenerateDraftPanel from './GenerateDraftPanel'
import BlogDraftQueue from './BlogDraftQueue'
import SeedBatchPanel from './SeedBatchPanel'
import ScenarioQAEditor from './ScenarioQAEditor'
import ContentSignalsPanel from './ContentSignalsPanel'
import NewsToDilemmaPreviewPanel from './NewsToDilemmaPreviewPanel'
import type { UserRole } from '@/lib/admin-auth'
import { getUserEntitlements } from '@/lib/entitlements'
import RolesPanel from './RolesPanel'
import { scenarios } from '@/lib/scenarios'
import { getDynamicScenarios } from '@/lib/dynamic-scenarios'
import { getFeedbackBatchDetail } from '@/lib/redis'

export const metadata = { title: 'Admin | SplitVote' }
export const dynamic = 'force-dynamic'

type AdminTab = 'overview' | 'voting' | 'content' | 'content-qa' | 'ai-drafts' | 'content-signals' | 'blog' | 'monetization' | 'roles'
const VALID_TABS: AdminTab[] = ['overview', 'voting', 'content', 'content-qa', 'ai-drafts', 'content-signals', 'blog', 'monetization', 'roles']

interface AdminProps {
  searchParams: { preview?: string; tab?: string }
}

function buildDayBuckets(n: number): Record<string, number> {
  const map: Record<string, number> = {}
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date()
    d.setUTCDate(d.getUTCDate() - i)
    map[d.toISOString().slice(0, 10)] = 0
  }
  return map
}

export default async function AdminPage({ searchParams }: AdminProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/admin')
  }

  // Defensive: show diagnostic rather than crashing if service role key is missing
  let admin: ReturnType<typeof createAdminClient>
  try {
    admin = createAdminClient()
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8">
          <h1 className="text-2xl font-black text-red-400 mb-3">⚠️ Admin Config Error</h1>
          <p className="text-white/80 text-sm mb-4">{msg}</p>
          <div className="rounded-xl bg-[#0a0a1f] border border-white/10 p-4 font-mono text-xs text-white/60 space-y-1">
            <p className="text-white/40 mb-2">Required Vercel env vars:</p>
            <p>NEXT_PUBLIC_SUPABASE_URL <span className="text-green-400">✓ public</span></p>
            <p>NEXT_PUBLIC_SUPABASE_ANON_KEY <span className="text-green-400">✓ public</span></p>
            <p>SUPABASE_SERVICE_ROLE_KEY <span className="text-red-400">✗ secret — check Vercel dashboard</span></p>
          </div>
          <p className="text-white/40 text-xs mt-4">
            Vercel → Project → Settings → Environment Variables → Add SUPABASE_SERVICE_ROLE_KEY (Production + Preview)
          </p>
        </div>
      </div>
    )
  }

  // Phase-1 dual-check: ADMIN_EMAILS fallback OR DB role >= admin
  // Use admin client so the gate is never blocked by RLS SELECT policies on profiles
  const { data: selfProfile } = await admin
    .from('profiles')
    .select('is_premium, role')
    .eq('id', user.id)
    .single()

  const currentEntitlements = getUserEntitlements({
    email: user.email,
    is_premium: selfProfile?.is_premium ?? false,
    role: (selfProfile?.role ?? 'user') as UserRole,
  })

  if (!currentEntitlements.canAccessAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-8">
          <h1 className="text-2xl font-black text-yellow-400 mb-3">Admin access required</h1>
          <p className="text-white/80 text-sm mb-4">
            You are signed in as <span className="font-mono text-white">{user.email}</span>, but this account does not have admin access.
          </p>
          <p className="text-white/40 text-xs mt-4">
            Admin access is granted via the ADMIN_EMAILS env var or a DB role assignment (admin/super_admin).
          </p>
        </div>
      </div>
    )
  }

  const isSuperAdmin = currentEntitlements.isSuperAdmin

  const locale = cookies().get('lang-pref')?.value === 'it' ? 'it' : 'en'

  const rawTab = searchParams.tab as AdminTab | undefined
  const activeTab: AdminTab = rawTab && VALID_TABS.includes(rawTab) ? rawTab : 'overview'

  const now = new Date()
  const since14 = new Date(now)
  since14.setUTCDate(since14.getUTCDate() - 13)
  since14.setUTCHours(0, 0, 0, 0)

  const today  = now.toISOString().slice(0, 10)
  const since7 = new Date(now); since7.setUTCDate(since7.getUTCDate() - 6);  since7.setUTCHours(0, 0, 0, 0)

  const [
    profilesRes,
    dilemmaVotesRes,
    pollsRes,
    topVotersRes,
    recentSignupsRes,
    pendingPollsRes,
    voteDailyRes,
    signupsByDayRes,
    badgesRes,
    anonBreakdownRes,
    premiumUsersRes,
    votes7dRes,
    feedbackStatsRes,
    dynamicScenariosData,
  ] = await Promise.all([
    admin.from('profiles').select('*', { count: 'exact', head: true }),
    admin.from('dilemma_votes').select('*', { count: 'exact', head: true }),
    admin.from('user_polls').select('status'),
    admin.from('profiles').select('display_name, votes_count, is_premium, created_at').order('votes_count', { ascending: false }).limit(10),
    admin.from('profiles').select('display_name, votes_count, created_at').order('created_at', { ascending: false }).limit(10),
    admin.from('user_polls').select('id, question, created_at, user_id').eq('status', 'pending').order('created_at', { ascending: false }).limit(20),
    admin.from('vote_daily_stats')
      .select('date, total_count, anonymous_count, logged_in_count')
      .gte('date', since14.toISOString().slice(0, 10))
      .order('date', { ascending: true }),
    admin.from('profiles').select('created_at').gte('created_at', since14.toISOString()),
    admin.from('user_badges').select('*', { count: 'exact', head: true }),
    admin.from('vote_daily_stats').select('anonymous_count, logged_in_count, total_count'),
    admin.from('profiles').select('*', { count: 'exact', head: true }).eq('is_premium', true),
    admin.from('vote_daily_stats').select('total_count').gte('date', since7.toISOString().slice(0, 10)),
    // Per-dilemma feedback stats via the aggregate view (logged-in users only — used as fallback)
    admin.from('dilemma_feedback_stats')
      .select('dilemma_id, fire_count, down_count, total_count, fire_pct')
      .order('total_count', { ascending: false })
      .limit(100),
    getDynamicScenarios(),
  ])

  const totalUsers        = profilesRes.count ?? 0
  const totalDilemmaVotes = dilemmaVotesRes.count ?? 0
  const totalBadges       = badgesRes.count ?? 0

  const polls = (pollsRes.data ?? []) as { status: string }[]
  const pollStats = polls.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Vote chart data (14d)
  const votesBuckets  = buildDayBuckets(14)
  const anonBuckets   = buildDayBuckets(14)
  const loggedBuckets = buildDayBuckets(14)

  for (const row of voteDailyRes.data ?? []) {
    const r = row as { date: string; total_count: number; anonymous_count: number; logged_in_count: number }
    if (r.date in votesBuckets) {
      votesBuckets[r.date]  += r.total_count
      anonBuckets[r.date]   += r.anonymous_count
      loggedBuckets[r.date] += r.logged_in_count
    }
  }

  const votesChartData = Object.entries(votesBuckets).map(([date, count]) => ({
    date,
    count,
    anonymous: anonBuckets[date] ?? 0,
    loggedIn:  loggedBuckets[date] ?? 0,
  }))

  const allTimeBreakdown = (anonBreakdownRes.data ?? []) as { anonymous_count: number; logged_in_count: number; total_count: number }[]
  const totalTrackedVotes = allTimeBreakdown.reduce((s, r) => s + r.total_count, 0)
  const totalAnonVotes    = allTimeBreakdown.reduce((s, r) => s + r.anonymous_count, 0)
  const totalLoggedVotes  = allTimeBreakdown.reduce((s, r) => s + r.logged_in_count, 0)
  const anonPct = totalTrackedVotes > 0 ? Math.round((totalAnonVotes / totalTrackedVotes) * 100) : 0

  const premiumCount = premiumUsersRes.count ?? 0
  const votes7d  = (votes7dRes.data ?? []).reduce((s, r) => s + ((r as { total_count: number }).total_count), 0)
  const votes24h = (voteDailyRes.data ?? [])
    .filter(r => (r as { date: string }).date === today)
    .reduce((s, r) => s + ((r as { total_count: number }).total_count), 0)

  const signupBuckets = buildDayBuckets(14)
  for (const row of signupsByDayRes.data ?? []) {
    const day = (row as { created_at: string }).created_at.slice(0, 10)
    if (day in signupBuckets) signupBuckets[day]++
  }
  const signupsChartData = Object.entries(signupBuckets).map(([date, count]) => ({ date, count }))

  // Per-dilemma feedback stats (Supabase — logged-in users only, used as fallback)
  type FeedbackStat = { dilemma_id: string; fire_count: number; down_count: number; total_count: number; fire_pct: number }
  const feedbackStats = ((feedbackStatsRes.data ?? []) as FeedbackStat[]).filter(d => d.total_count >= 3)
  const topFireDilemmas    = [...feedbackStats].sort((a, b) => b.fire_pct - a.fire_pct).slice(0, 5)
  const bottomFireDilemmas = [...feedbackStats].sort((a, b) => a.fire_pct - b.fire_pct).slice(0, 5)
  const totalFeedback = feedbackStats.reduce((s, r) => s + r.total_count, 0)
  const totalFire     = feedbackStats.reduce((s, r) => s + r.fire_count, 0)
  const fireFeedbackPct = totalFeedback > 0 ? Math.round((totalFire / totalFeedback) * 100) : 0

  // Redis feedback — source of truth (anonymous + authenticated)
  const allScenarioIds = [...new Set([
    ...scenarios.map(s => s.id),
    ...dynamicScenariosData.map(s => s.id),
  ])]
  const redisFeedback = await getFeedbackBatchDetail(allScenarioIds)

  let redisTotalFeedback = 0
  let redisTotalUp = 0
  redisFeedback.forEach(({ up, total }) => { redisTotalFeedback += total; redisTotalUp += up })
  const redisFirePct = redisTotalFeedback > 0
    ? Math.round((redisTotalUp / redisTotalFeedback) * 100)
    : fireFeedbackPct

  // Per-dilemma Redis breakdown — min 3 ratings to appear
  const redisWithFeedback = allScenarioIds
    .map(id => { const d = redisFeedback.get(id); return { id, up: d?.up ?? 0, down: d?.down ?? 0, total: d?.total ?? 0 } })
    .filter(d => d.total >= 3)
  const topRedisFireDilemmas    = [...redisWithFeedback].sort((a, b) => (b.up / b.total) - (a.up / a.total)).slice(0, 5)
  const bottomRedisFireDilemmas = [...redisWithFeedback].sort((a, b) => (a.up / a.total) - (b.up / b.total)).slice(0, 5)
  const redisHasFeedback = redisWithFeedback.length > 0

  type TopVoter    = { display_name: string | null; votes_count: number; is_premium: boolean; created_at: string }
  type RecentSignup = { display_name: string | null; votes_count: number; created_at: string }
  type PendingPoll  = { id: string; question: string; created_at: string; user_id: string }

  const topVoters     = (topVotersRes.data  ?? []) as TopVoter[]
  const recentSignups = (recentSignupsRes.data ?? []) as RecentSignup[]
  const pendingPolls  = (pendingPollsRes.data ?? []) as PendingPoll[]

  const KPI_CARDS = [
    { label: 'Total Users',          value: totalUsers.toLocaleString(),        Icon: Users,         glow: 'neon-glow-blue',   iconColor: 'text-blue-400',   bg: 'from-blue-500/10 to-blue-500/5',     border: 'border-blue-500/25'   },
    { label: 'All Votes (tracked)',  value: totalTrackedVotes > 0 ? totalTrackedVotes.toLocaleString() : totalDilemmaVotes.toLocaleString(), Icon: Vote, glow: 'neon-glow-purple', iconColor: 'text-purple-400', bg: 'from-purple-500/10 to-purple-500/5', border: 'border-purple-500/25' },
    { label: 'Badges Awarded',       value: totalBadges.toLocaleString(),       Icon: Trophy,        glow: 'neon-glow-yellow', iconColor: 'text-yellow-400', bg: 'from-yellow-500/10 to-yellow-500/5', border: 'border-yellow-500/25' },
    { label: 'Polls Submitted',      value: polls.length.toLocaleString(),      Icon: ClipboardList, glow: 'neon-glow-cyan',   iconColor: 'text-cyan-400',   bg: 'from-cyan-500/10 to-cyan-500/5',     border: 'border-cyan-500/25'   },
  ]

  const baseTabs = locale === 'it' ? [
    { id: 'overview'         as AdminTab, label: 'Panoramica',       Icon: LayoutDashboard },
    { id: 'voting'           as AdminTab, label: 'Voti',             Icon: Vote            },
    { id: 'content'          as AdminTab, label: 'Contenuti',        Icon: ClipboardList   },
    { id: 'content-qa'       as AdminTab, label: 'QA contenuti',     Icon: Search          },
    { id: 'ai-drafts'        as AdminTab, label: 'Bozze AI',         Icon: Zap             },
    { id: 'content-signals'  as AdminTab, label: 'Content Signals',  Icon: Inbox           },
    { id: 'blog'             as AdminTab, label: 'Blog',             Icon: BookOpen        },
    { id: 'monetization'     as AdminTab, label: 'Monetizzazione',   Icon: Star            },
  ] : [
    { id: 'overview'         as AdminTab, label: 'Overview',         Icon: LayoutDashboard },
    { id: 'voting'           as AdminTab, label: 'Voting',           Icon: Vote            },
    { id: 'content'          as AdminTab, label: 'Content',          Icon: ClipboardList   },
    { id: 'content-qa'       as AdminTab, label: 'Content QA',       Icon: Search          },
    { id: 'ai-drafts'        as AdminTab, label: 'AI Drafts',        Icon: Zap             },
    { id: 'content-signals'  as AdminTab, label: 'Content Signals',  Icon: Inbox           },
    { id: 'blog'             as AdminTab, label: 'Blog',             Icon: BookOpen        },
    { id: 'monetization'     as AdminTab, label: 'Monetization',     Icon: Star            },
  ]
  const TABS = isSuperAdmin
    ? [...baseTabs, { id: 'roles' as AdminTab, label: 'Roles', Icon: ShieldCheck }]
    : baseTabs

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:py-12">

      {/* ── Header ── */}
      <div className="mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center neon-glow-red">
              <Settings size={18} className="text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-none">Admin Dashboard</h1>
              <p className="text-[var(--muted)] text-xs mt-0.5">SplitVote · {user.email}</p>
            </div>
          </div>

          {/* Preview links */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-[var(--muted)] font-bold uppercase tracking-widest">Preview:</span>
            <a href="/dashboard" target="_blank"
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all">
              <LayoutDashboard size={11} /> User ↗
            </a>
            <a href="/profile" target="_blank"
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-all">
              <UserCircle size={11} /> Profile ↗
            </a>
            <a href={`/u/${user.id}`} target="_blank"
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-all">
              <Trophy size={11} /> Public ↗
            </a>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-0.5 border-b border-white/10 overflow-x-auto">
          {TABS.map(t => (
            <a
              key={t.id}
              href={`?tab=${t.id}`}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2.5 border-b-2 whitespace-nowrap transition-all ${
                activeTab === t.id
                  ? 'text-white border-blue-500'
                  : 'text-[var(--muted)] border-transparent hover:text-white hover:border-white/30'
              }`}
            >
              <t.Icon size={12} /> {t.label}
            </a>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          TAB: Overview
      ══════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {KPI_CARDS.map(({ label, value, Icon, glow, iconColor, bg, border }) => (
              <div key={label}
                className={`rounded-2xl border ${border} bg-gradient-to-br ${bg} p-5 text-center ${glow} transition-all hover:scale-[1.02]`}>
                <div className="flex justify-center mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <Icon size={20} className={iconColor} />
                  </div>
                </div>
                <p className={`text-2xl sm:text-3xl font-black ${iconColor} mb-1`}>{value}</p>
                <p className="text-[var(--muted)] text-xs">{label}</p>
              </div>
            ))}
          </div>

          {/* Business metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-yellow-500/25 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 p-5 text-center neon-glow-yellow">
              <div className="flex justify-center mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <Star size={20} className="text-yellow-400" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-yellow-400 mb-1">{premiumCount}</p>
              <p className="text-[var(--muted)] text-xs">Premium Users</p>
            </div>
            <div className="rounded-2xl border border-blue-500/25 bg-gradient-to-br from-blue-500/10 to-blue-500/5 p-5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-2">Votes 24h</p>
              <p className="text-2xl sm:text-3xl font-black text-blue-400 mb-0.5">{votes24h.toLocaleString()}</p>
              <p className="text-[var(--muted)] text-xs">↑ last 24 hours</p>
            </div>
            <div className="rounded-2xl border border-purple-500/25 bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-2">Votes 7d</p>
              <p className="text-2xl sm:text-3xl font-black text-purple-400 mb-0.5">{votes7d.toLocaleString()}</p>
              <p className="text-[var(--muted)] text-xs">↑ last 7 days</p>
            </div>
            <div className="rounded-2xl border border-orange-500/25 bg-gradient-to-br from-orange-500/10 to-orange-500/5 p-5 text-center">
              <div className="flex justify-center mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <ThumbsUp size={20} className="text-orange-400" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-orange-400 mb-1">
                {redisTotalFeedback > 0 ? redisFirePct : fireFeedbackPct}%
              </p>
              <p className="text-[var(--muted)] text-xs">
                🔥 Feedback ({(redisTotalFeedback > 0 ? redisTotalFeedback : totalFeedback).toLocaleString()} {redisTotalFeedback > 0 ? 'total' : 'logged-in only'})
              </p>
            </div>
          </div>

          {/* Anonymous vs Logged-in breakdown */}
          {totalTrackedVotes > 0 && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
              <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-4">
                <Vote size={13} /> Vote breakdown (all-time tracked)
              </h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-black text-purple-400">{totalTrackedVotes.toLocaleString()}</p>
                  <p className="text-xs text-[var(--muted)] mt-0.5">Total</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1"><EyeOff size={12} className="text-orange-400" /></div>
                  <p className="text-2xl font-black text-orange-400">{anonPct}%</p>
                  <p className="text-xs text-[var(--muted)] mt-0.5">Anonymous ({totalAnonVotes.toLocaleString()})</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1"><Eye size={12} className="text-green-400" /></div>
                  <p className="text-2xl font-black text-green-400">{100 - anonPct}%</p>
                  <p className="text-xs text-[var(--muted)] mt-0.5">Logged-in ({totalLoggedVotes.toLocaleString()})</p>
                </div>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full"
                  style={{ background: `linear-gradient(to right, #f97316 ${anonPct}%, #22c55e ${anonPct}%)` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-orange-400">Anon {anonPct}%</span>
                <span className="text-xs text-green-400">Logged-in {100 - anonPct}%</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════
          TAB: Voting
      ══════════════════════════════════════════════ */}
      {activeTab === 'voting' && (
        <div className="space-y-6">
          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <VotesChart data={votesChartData} locale={locale} />
            <SignupsChart data={signupsChartData} locale={locale} />
          </div>

          {/* Top voters */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
            <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-4">
              <Flame size={13} className="text-orange-400" /> {locale === 'it' ? 'Utenti più attivi' : 'Top voters'}
            </h3>
            <div className="space-y-1">
              {topVoters.map((u, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
                  <span className={`text-xs font-black w-6 text-center tabular-nums ${i < 3 ? 'text-yellow-400' : 'text-[var(--muted)]'}`}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-semibold truncate">{u.display_name ?? 'Anonymous'}</p>
                  </div>
                  {u.is_premium && (
                    <span className="flex items-center gap-1 text-xs text-yellow-400 font-bold border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 rounded-full">
                      <Star size={9} fill="currentColor" /> PRO
                    </span>
                  )}
                  <span className="text-sm font-black text-blue-400 tabular-nums">{u.votes_count.toLocaleString()} v</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent signups */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
            <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-4">
              <UserPlus size={13} className="text-green-400" /> {locale === 'it' ? 'Nuove iscrizioni' : 'Recent signups'}
            </h3>
            <div className="space-y-1">
              {recentSignups.map((u, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-semibold truncate">{u.display_name ?? 'Anonymous'}</p>
                  </div>
                  <span className="text-xs text-[var(--muted)] tabular-nums">
                    {new Date(u.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                  </span>
                  <span className="text-xs text-blue-400 font-bold tabular-nums w-10 text-right">{u.votes_count}v</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          TAB: Content
      ══════════════════════════════════════════════ */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          {/* Poll status */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
            <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-4">
              <ClipboardList size={13} /> Poll status
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Pending',  key: 'pending',  color: 'text-yellow-400', Icon: Clock       },
                { label: 'Approved', key: 'approved', color: 'text-green-400',  Icon: CheckCircle },
                { label: 'Rejected', key: 'rejected', color: 'text-red-400',    Icon: XCircle     },
                { label: 'Flagged',  key: 'flagged',  color: 'text-orange-400', Icon: Flag        },
              ].map(({ label, key, color, Icon }) => (
                <div key={key} className="text-center">
                  <Icon size={16} className={`${color} mx-auto mb-1.5 opacity-70`} />
                  <p className={`text-2xl font-black ${color}`}>{(pollStats[key] ?? 0)}</p>
                  <p className="text-[var(--muted)] text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pending polls */}
          {pendingPolls.length > 0 && (
            <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5 sm:p-6 neon-glow-yellow">
              <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-yellow-400 mb-4">
                <Clock size={13} /> Pending polls ({pendingPolls.length})
              </h3>
              <div className="space-y-3">
                {pendingPolls.map(poll => (
                  <div key={poll.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium leading-snug">{poll.question}</p>
                      <p className="text-xs text-[var(--muted)] mt-1">
                        {new Date(poll.created_at).toLocaleString('en-GB')} · user {poll.user_id.slice(0, 8)}…
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <a href={`/api/admin/polls/${poll.id}/approve`}
                        className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-colors">
                        <CheckCircle size={12} /> OK
                      </a>
                      <a href={`/api/admin/polls/${poll.id}/reject`}
                        className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors">
                        <XCircle size={12} /> No
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback stats per dilemma — Redis primary, Supabase fallback */}
          {redisHasFeedback ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top by 🔥 */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-green-400 mb-4">
                  <ThumbsUp size={13} /> Top 🔥 dilemmas
                </h3>
                <div className="space-y-2">
                  {topRedisFireDilemmas.map(d => {
                    const firePct = Math.round((d.up / d.total) * 100)
                    return (
                      <div key={d.id} className="flex items-center gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white/80 font-mono truncate">{d.id}</p>
                          <p className="text-[10px] text-[var(--muted)]">🔥 {d.up} · 👎 {d.down} · {d.total} total</p>
                        </div>
                        <span className={`text-xs font-black px-2 py-0.5 rounded-full border ${
                          firePct >= 70 ? 'text-green-300 border-green-500/30 bg-green-500/10'
                          : 'text-yellow-300 border-yellow-500/30 bg-yellow-500/10'
                        }`}>
                          🔥 {firePct}%
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Bottom (most 👎) */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-400 mb-4">
                  <MessageSquare size={13} /> Lowest rated
                </h3>
                <div className="space-y-2">
                  {bottomRedisFireDilemmas.map(d => {
                    const downPct = Math.round((d.down / d.total) * 100)
                    return (
                      <div key={d.id} className="flex items-center gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white/80 font-mono truncate">{d.id}</p>
                          <p className="text-[10px] text-[var(--muted)]">🔥 {d.up} · 👎 {d.down} · {d.total} total</p>
                        </div>
                        <span className="text-xs font-black px-2 py-0.5 rounded-full border text-red-300 border-red-500/30 bg-red-500/10">
                          👎 {downPct}%
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : feedbackStats.length > 0 ? (
            // Fallback: Supabase logged-in data only (Redis empty)
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-green-400 mb-4">
                  <ThumbsUp size={13} /> Top 🔥 dilemmas
                  <span className="text-[var(--muted)] font-normal normal-case tracking-normal">(logged-in only)</span>
                </h3>
                <div className="space-y-2">
                  {topFireDilemmas.map(d => (
                    <div key={d.dilemma_id} className="flex items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white/80 font-mono truncate">{d.dilemma_id}</p>
                        <p className="text-[10px] text-[var(--muted)]">{d.total_count} logged-in total</p>
                      </div>
                      <span className={`text-xs font-black px-2 py-0.5 rounded-full border ${
                        d.fire_pct >= 70 ? 'text-green-300 border-green-500/30 bg-green-500/10'
                        : 'text-yellow-300 border-yellow-500/30 bg-yellow-500/10'
                      }`}>
                        🔥 {d.fire_pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-400 mb-4">
                  <MessageSquare size={13} /> Lowest rated
                  <span className="text-[var(--muted)] font-normal normal-case tracking-normal">(logged-in only)</span>
                </h3>
                <div className="space-y-2">
                  {bottomFireDilemmas.map(d => (
                    <div key={d.dilemma_id} className="flex items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white/80 font-mono truncate">{d.dilemma_id}</p>
                        <p className="text-[10px] text-[var(--muted)]">{d.total_count} logged-in total</p>
                      </div>
                      <span className="text-xs font-black px-2 py-0.5 rounded-full border text-red-300 border-red-500/30 bg-red-500/10">
                        👎 {100 - d.fire_pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-[var(--surface)] p-6 text-center text-[var(--muted)] text-sm">
              No feedback yet — 🔥/👎 ratings from users will appear here.
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════
          TAB: Content QA
      ══════════════════════════════════════════════ */}
      {activeTab === 'content-qa' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 flex items-start gap-3">
            <Search size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-blue-300 mb-1">Scenario text editor</p>
              <p className="text-xs text-white/50 leading-relaxed">
                Search and inline-edit approved AI-generated scenarios stored in Redis.
                Changes are applied immediately — no deploy required.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <ScenarioQAEditor />
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          TAB: AI Drafts
      ══════════════════════════════════════════════ */}
      {activeTab === 'ai-drafts' && (
        <div className="space-y-6">
          {/* Draft queue / approved dynamic dilemma list */}
          <div id="dynamic-dilemmas">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-purple-400" />
                <h2 className="text-lg font-black text-white">Dynamic Dilemmas (Redis)</h2>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-[var(--muted)] font-bold uppercase tracking-widest">Dry-run:</span>
                <a href="/api/admin/cron-dryrun?locale=en" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all">
                  🇺🇸 EN ↗
                </a>
                <a href="/api/admin/cron-dryrun?locale=it" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all">
                  🇮🇹 IT ↗
                </a>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[var(--surface)] p-5">
              <CronDebug />
            </div>
          </div>

          {/* Seed batch — includes manual seed for controlled dilemma generation */}
          <SeedBatchPanel />
        </div>
      )}

      {/* ══════════════════════════════════════════════
          TAB: Content Signals
      ══════════════════════════════════════════════ */}
      {activeTab === 'content-signals' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 flex items-start gap-3">
            <Inbox size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-blue-300 mb-1">Content signals pipeline — Phase 0</p>
              <p className="text-xs text-white/50 leading-relaxed">
                Two tools: <strong className="text-white/70">Content Signals Intake</strong> validates and risk-flags structured items
                (no AI, no writes). <strong className="text-white/70">News → Dilemma Preview</strong> uses OpenRouter to abstract
                a normalised item into a universal moral dilemma preview (no publish, no DB writes).
              </p>
            </div>
          </div>
          <ContentSignalsPanel />
          <NewsToDilemmaPreviewPanel />
        </div>
      )}

      {/* ══════════════════════════════════════════════
          TAB: Blog
      ══════════════════════════════════════════════ */}
      {activeTab === 'blog' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4 flex items-start gap-3">
            <BookOpen size={16} className="text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-purple-300 mb-1">Blog article generator — draft queue</p>
              <p className="text-xs text-white/50 leading-relaxed">
                Generates a full bilingual article via OpenRouter. Preview it, then click{' '}
                <strong className="text-purple-300">Save draft</strong> to add it to the queue below.
                Approving a draft marks it as ready for editorial integration into{' '}
                <code className="font-mono text-purple-300">lib/blog.ts</code> —{' '}
                <strong>it does not publish live automatically</strong>.
              </p>
            </div>
          </div>

          <GenerateDraftPanel />
          <BlogDraftQueue />
        </div>
      )}

      {/* ══════════════════════════════════════════════
          TAB: Roles (super_admin only)
      ══════════════════════════════════════════════ */}
      {activeTab === 'roles' && isSuperAdmin && (
        <RolesPanel />
      )}

      {/* ══════════════════════════════════════════════
          TAB: Monetization
      ══════════════════════════════════════════════ */}
      {activeTab === 'monetization' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-yellow-500/25 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 p-6 text-center neon-glow-yellow">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                  <Star size={22} className="text-yellow-400" />
                </div>
              </div>
              <p className="text-3xl font-black text-yellow-400 mb-1">{premiumCount}</p>
              <p className="text-[var(--muted)] text-sm">Premium Users</p>
            </div>
            <div className="rounded-2xl border border-blue-500/25 bg-gradient-to-br from-blue-500/10 to-blue-500/5 p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                  <BarChart2 size={22} className="text-blue-400" />
                </div>
              </div>
              <p className="text-3xl font-black text-blue-400 mb-1">{totalUsers > 0 ? `${Math.round((premiumCount / totalUsers) * 100)}%` : '—'}</p>
              <p className="text-[var(--muted)] text-sm">Conversion rate</p>
            </div>
            <div className="rounded-2xl border border-green-500/25 bg-gradient-to-br from-green-500/10 to-green-500/5 p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                  <Users size={22} className="text-green-400" />
                </div>
              </div>
              <p className="text-3xl font-black text-green-400 mb-1">{totalUsers.toLocaleString()}</p>
              <p className="text-[var(--muted)] text-sm">Total users</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[var(--surface)] p-6 text-center text-[var(--muted)] text-sm">
            <p className="mb-2 font-semibold text-white/60">Revenue dashboard</p>
            <p className="text-xs">Stripe revenue metrics will appear here once billing is active.</p>
          </div>
        </div>
      )}

    </div>
  )
}

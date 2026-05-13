import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { tryCreateAdminClient } from '@/lib/supabase/admin'
import { MISSIONS, type MissionId } from '@/lib/missions'
import { scenarios } from '@/lib/scenarios'
import { getDynamicScenarios } from '@/lib/dynamic-scenarios'

export const dynamic = 'force-dynamic'

// ── Server-side XP constants (never trust client-supplied XP) ───────
// Mirror of MISSIONS[].xp — kept here as the single authoritative source
// for the API. The DB function award_mission_xp handles original 5 IDs;
// new mission IDs use a direct admin-client profiles.xp update as fallback.
const MISSION_XP: Record<MissionId, number> = {
  vote_3:              30,
  vote_5:              45,
  vote_2_categories:   25,
  vote_3_categories:   40,
  challenge_friend:    20,
  share_result:        15,
  share_and_challenge: 35,
  daily_dilemma:       50,
}

// Original 5 mission IDs that award_mission_xp DB function handles
const LEGACY_MISSION_IDS = new Set<MissionId>([
  'vote_3', 'vote_2_categories', 'challenge_friend', 'share_result', 'daily_dilemma',
])

// ── Helper: count unique dilemma votes cast by user today ────────────
async function countVotesToday(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<number> {
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const { count, error } = await supabase
    .from('dilemma_votes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('voted_at', todayStart.toISOString())

  if (error) return 0
  return count ?? 0
}

// ── Helper: verify mission eligibility server-side ──────────────────
async function verifyMission(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  missionId: MissionId,
): Promise<{ eligible: boolean; reason?: string }> {
  switch (missionId) {
    case 'vote_3': {
      const count = await countVotesToday(supabase, userId)
      if (count < 3) {
        return { eligible: false, reason: `Only ${count}/3 votes today` }
      }
      return { eligible: true }
    }

    case 'daily_dilemma': {
      // Verify the user has voted at least once today.
      // A stricter check (specific daily dilemma ID) can be added once
      // the daily dilemma is stored in a dedicated DB table.
      const count = await countVotesToday(supabase, userId)
      if (count < 1) {
        return { eligible: false, reason: 'No votes cast today' }
      }
      return { eligible: true }
    }

    case 'vote_2_categories': {
      const todayStart2 = new Date()
      todayStart2.setHours(0, 0, 0, 0)
      const { data: voteData } = await supabase
        .from('dilemma_votes')
        .select('dilemma_id')
        .eq('user_id', userId)
        .gte('voted_at', todayStart2.toISOString())
      const votedIds = (voteData ?? []).map((r: { dilemma_id: string }) => r.dilemma_id)
      const catMap = new Map<string, string>()
      for (const s of scenarios) catMap.set(s.id, s.category)
      try {
        const dynamic = await getDynamicScenarios()
        for (const s of dynamic) catMap.set(s.id, s.category)
      } catch { /* non-blocking */ }
      const cats = new Set(votedIds.map(id => catMap.get(id)).filter(Boolean))
      if (cats.size < 2) {
        return { eligible: false, reason: `Only ${cats.size}/2 categories voted today` }
      }
      return { eligible: true }
    }

    case 'share_result': {
      const todayStart3 = new Date()
      todayStart3.setHours(0, 0, 0, 0)
      try {
        const { count } = await supabase
          .from('user_events')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId)
          .in('event_type', ['share_result', 'copy_result_link', 'story_card_share', 'story_card_download'])
          .gte('created_at', todayStart3.toISOString())
        if ((count ?? 0) < 1) {
          return { eligible: false, reason: 'Share a result first — no share events recorded today' }
        }
        return { eligible: true }
      } catch {
        return { eligible: false, reason: 'Share tracking unavailable — apply migration_v8_user_events.sql first' }
      }
    }

    case 'vote_5': {
      const count = await countVotesToday(supabase, userId)
      if (count < 5) {
        return { eligible: false, reason: `Only ${count}/5 votes today` }
      }
      return { eligible: true }
    }

    case 'vote_3_categories': {
      const todayStart3c = new Date()
      todayStart3c.setHours(0, 0, 0, 0)
      const { data: voteData3c } = await supabase
        .from('dilemma_votes')
        .select('dilemma_id')
        .eq('user_id', userId)
        .gte('voted_at', todayStart3c.toISOString())
      const votedIds3c = (voteData3c ?? []).map((r: { dilemma_id: string }) => r.dilemma_id)
      const catMap3c = new Map<string, string>()
      for (const s of scenarios) catMap3c.set(s.id, s.category)
      try {
        const dyn3c = await getDynamicScenarios()
        for (const s of dyn3c) catMap3c.set(s.id, s.category)
      } catch { /* non-blocking */ }
      const cats3c = new Set(votedIds3c.map(id => catMap3c.get(id)).filter(Boolean))
      if (cats3c.size < 3) {
        return { eligible: false, reason: `Only ${cats3c.size}/3 categories voted today` }
      }
      return { eligible: true }
    }

    case 'share_and_challenge': {
      // 1 share event + 1 challenge_link_copied event both required
      const todayStartSac = new Date()
      todayStartSac.setHours(0, 0, 0, 0)
      try {
        const [shareRes, challengeRes] = await Promise.all([
          supabase
            .from('user_events')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId)
            .in('event_type', ['share_result', 'copy_result_link', 'story_card_share', 'story_card_download'])
            .gte('created_at', todayStartSac.toISOString()),
          supabase
            .from('user_events')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('event_type', 'challenge_link_copied')
            .gte('created_at', todayStartSac.toISOString()),
        ])
        const shareCount     = shareRes.count ?? 0
        const challengeCount = challengeRes.count ?? 0
        if (shareCount < 1 || challengeCount < 1) {
          const missing = []
          if (shareCount < 1) missing.push('share a result')
          if (challengeCount < 1) missing.push('copy a challenge link')
          return { eligible: false, reason: `Still needed: ${missing.join(' and ')}` }
        }
        return { eligible: true }
      } catch {
        return { eligible: false, reason: 'Event tracking unavailable — apply migration_v8_user_events.sql first' }
      }
    }

    case 'challenge_friend': {
      // Completes when user copies the challenge link (user-controlled action)
      const todayStart4 = new Date()
      todayStart4.setHours(0, 0, 0, 0)
      try {
        const { count } = await supabase
          .from('user_events')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('event_type', 'challenge_link_copied')
          .gte('created_at', todayStart4.toISOString())
        if ((count ?? 0) < 1) {
          return { eligible: false, reason: 'Copy a challenge link first — use the "Challenge a friend" button on any result page' }
        }
        return { eligible: true }
      } catch {
        return { eligible: false, reason: 'Challenge tracking unavailable — apply migration_v8_user_events.sql first' }
      }
    }

    default:
      return { eligible: false, reason: 'Unknown mission' }
  }
}

/** POST /api/missions/complete — verify + mark a mission complete + award XP */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { missionId } = body as { missionId: string }

    // Validate mission ID against server-side definitions
    const mission = MISSIONS.find(m => m.id === missionId)
    if (!mission) {
      return NextResponse.json({ error: 'Unknown mission' }, { status: 400 })
    }

    // Server-side eligibility check
    const { eligible, reason } = await verifyMission(supabase, user.id, missionId as MissionId)
    if (!eligible) {
      return NextResponse.json({ error: 'Mission not eligible', reason }, { status: 403 })
    }

    const today = new Date().toISOString().split('T')[0]
    const xpAwarded = MISSION_XP[missionId as MissionId] ?? mission.xp

    // Insert mission completion — unique constraint (user_id, mission_id, completed_at)
    // prevents double-awarding on the same day.
    const { error: insertError } = await supabase
      .from('mission_completions')
      .insert({
        user_id: user.id,
        mission_id: missionId,
        completed_at: today,
        xp_awarded: xpAwarded,
      })

    if (insertError) {
      // Duplicate = already completed today — idempotent, return OK
      if (insertError.code === '23505' || insertError.message.includes('unique')) {
        return NextResponse.json({ ok: true, alreadyCompleted: true, xpAwarded: 0 })
      }
      console.error('[missions/complete] insert error:', insertError)
      return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }

    // Award XP — two paths depending on mission ID:
    // • Original 5 IDs: delegate to DB function (handles atomically; migration_v3 required)
    // • New IDs: direct admin-client update of profiles.xp (award_mission_xp returns 0 for unknown IDs)
    if (LEGACY_MISSION_IDS.has(missionId as MissionId)) {
      try {
        await supabase.rpc('award_mission_xp', {
          p_user_id: user.id,
          p_mission_id: missionId,
        })
      } catch {
        // migration_v3 not applied yet — non-blocking
      }
    } else {
      // New mission IDs: direct xp increment via admin client (bypasses RLS)
      try {
        const { client: admin } = tryCreateAdminClient()
        if (admin) {
          const { data: prof } = await admin
            .from('profiles')
            .select('xp')
            .eq('id', user.id)
            .single()
          const currentXp = (prof as { xp?: number } | null)?.xp ?? 0
          await admin
            .from('profiles')
            .update({ xp: currentXp + xpAwarded })
            .eq('id', user.id)
        }
      } catch {
        // Non-critical — mission still marked complete; XP update failed silently
      }
    }

    return NextResponse.json({ ok: true, xpAwarded })
  } catch (err) {
    console.error('[missions/complete]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

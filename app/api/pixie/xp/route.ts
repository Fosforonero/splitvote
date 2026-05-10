import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { COMPANIONS } from '@/lib/companion'
import type { CompanionSpecies } from '@/lib/companion'

const VALID_SPECIES = new Set(COMPANIONS.map(c => c.id))

/**
 * POST /api/pixie/xp
 *
 * Increments the vote counter for the user's currently equipped Pixie species
 * in `profiles.pixie_xp` (JSONB).  Called fire-and-forget from VoteClientPage
 * after a vote is confirmed — does NOT touch dilemma_votes, Redis, or vote logic.
 *
 * Requires: profiles.pixie_xp column (migration_v4_pixie_xp.sql)
 */
export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile, error: fetchErr } = await supabase
    .from('profiles')
    .select('companion_species, pixie_xp')
    .eq('id', user.id)
    .single()

  if (fetchErr || !profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  const species = (profile.companion_species ?? 'spark') as CompanionSpecies
  if (!VALID_SPECIES.has(species)) {
    return NextResponse.json({ error: 'Invalid species' }, { status: 400 })
  }

  const current: Record<string, number> = (profile.pixie_xp as Record<string, number>) ?? {}
  const prev = current[species] ?? 0
  const updated = { ...current, [species]: prev + 1 }

  const { error: updateErr } = await supabase
    .from('profiles')
    .update({ pixie_xp: updated })
    .eq('id', user.id)

  if (updateErr) {
    console.error('pixie/xp update error:', updateErr.message)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }

  return NextResponse.json({ species, xp: prev + 1 })
}

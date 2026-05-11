import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { COSMETIC_MAP, isCosmeticItemId } from '@/lib/cosmetics-store'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { itemId, nameColor } = body as { itemId?: string; nameColor?: string }

  let admin: ReturnType<typeof createAdminClient>
  try {
    admin = createAdminClient()
  } catch {
    return NextResponse.json({ error: 'Server config error' }, { status: 500 })
  }

  // ── name_color selection (uses owned bundle, picks a specific color) ─────────
  if (nameColor !== undefined) {
    const { data: bundle } = await admin
      .from('user_purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', 'name_color_bundle')
      .eq('status', 'purchased')
      .maybeSingle()

    if (!bundle) {
      return NextResponse.json({ error: 'Name Color Bundle not owned' }, { status: 403 })
    }

    const { error } = await admin
      .from('profiles')
      .update({ name_color: nameColor })
      .eq('id', user.id)

    if (error) {
      console.error('[equip-cosmetic] name_color update failed:', error)
      return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true, nameColor })
  }

  // ── frame / glow equip ───────────────────────────────────────────────────────
  if (!itemId || !isCosmeticItemId(itemId)) {
    return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 })
  }

  const item = COSMETIC_MAP[itemId]

  if (item.category !== 'frame' && item.category !== 'glow') {
    return NextResponse.json({ error: 'Use equip-pixie for pixie skins' }, { status: 400 })
  }

  // Verify ownership
  const { data: purchase } = await admin
    .from('user_purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', itemId)
    .eq('status', 'purchased')
    .maybeSingle()

  if (!purchase) {
    return NextResponse.json({ error: 'Item not owned' }, { status: 403 })
  }

  const column = item.category === 'frame' ? 'equipped_frame' : 'equipped_glow'

  const { error } = await admin
    .from('profiles')
    .update({ [column]: itemId })
    .eq('id', user.id)

  if (error) {
    console.error('[equip-cosmetic] DB update failed:', error)
    return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
  }

  console.log(`✅ Equip [${item.category}]: user=${user.id.slice(0, 8)} → "${itemId}"`)
  return NextResponse.json({ success: true, equipped: itemId, category: item.category })
}

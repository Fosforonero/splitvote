import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isPixieItemId } from '@/lib/cosmetics-store'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { itemId } = await req.json()

  if (!itemId || !isPixieItemId(itemId)) {
    return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 })
  }

  let admin: ReturnType<typeof createAdminClient>
  try {
    admin = createAdminClient()
  } catch {
    return NextResponse.json({ error: 'Server config error' }, { status: 500 })
  }

  // Verify the user owns this item
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

  // Get current pixie_xp
  const { data: profile } = await admin
    .from('profiles')
    .select('pixie_xp')
    .eq('id', user.id)
    .single()

  const currentPixieXp = (profile?.pixie_xp ?? {}) as Record<string, unknown>
  const ownedItems = Array.isArray(currentPixieXp.owned) ? currentPixieXp.owned as string[] : []

  // Set active pixie skin
  const { error } = await admin
    .from('profiles')
    .update({
      pixie_xp: {
        ...currentPixieXp,
        owned:  Array.from(new Set([...ownedItems, itemId])),
        active: itemId,
      },
    })
    .eq('id', user.id)

  if (error) {
    console.error('[equip-pixie] DB update failed:', error)
    return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true, active: itemId })
}

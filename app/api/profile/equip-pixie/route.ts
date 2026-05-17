import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isPixieItemId } from '@/lib/cosmetics-store'
import { getUserEntitlements } from '@/lib/entitlements'
import type { UserRole } from '@/lib/admin-auth'

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

  const { data: profile } = await admin
    .from('profiles')
    .select('is_premium, role, pixie_xp')
    .eq('id', user.id)
    .single()

  const entitlements = getUserEntitlements({
    email: user.email,
    is_premium: profile?.is_premium ?? false,
    role: (profile?.role ?? 'user') as UserRole,
  })

  if (!entitlements.isAdmin) {
    const { data: purchase } = await admin
      .from('user_purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', itemId)
      .eq('status', 'completed')
      .maybeSingle()

    if (!purchase) {
      return NextResponse.json({ error: 'Item not owned' }, { status: 403 })
    }
  }

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

  // Invalidate the surfaces that read pixie state directly. router.refresh()
  // alone wasn't reliably re-fetching the profile row on every browser —
  // explicit path invalidation forces it.
  revalidatePath('/dashboard')
  revalidatePath('/profile')
  revalidatePath(`/u/${user.id}`)

  return NextResponse.json({ success: true, active: itemId })
}

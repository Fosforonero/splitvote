import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserEntitlements } from '@/lib/entitlements'
import type { UserRole } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { enabled } = await req.json() as { enabled: boolean }

  let admin: ReturnType<typeof createAdminClient>
  try {
    admin = createAdminClient()
  } catch {
    return NextResponse.json({ error: 'Server config error' }, { status: 500 })
  }

  // If enabling, verify user owns at least one pixie skin
  if (enabled) {
    const { data: profile } = await admin
      .from('profiles')
      .select('is_premium, role')
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
        .eq('product_type', 'pixie')
        .eq('status', 'completed')
        .limit(1)
        .maybeSingle()

      if (!purchase) {
        return NextResponse.json({ error: 'No Pixie skin owned' }, { status: 403 })
      }
    }
  }

  const { error } = await admin
    .from('profiles')
    .update({ use_pixie_avatar: enabled })
    .eq('id', user.id)

  if (error) {
    console.error('[toggle-pixie-avatar] DB update failed:', error)
    return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
  }

  revalidatePath('/dashboard')
  revalidatePath('/profile')
  revalidatePath(`/u/${user.id}`)
  return NextResponse.json({ success: true, use_pixie_avatar: enabled })
}

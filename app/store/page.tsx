/**
 * /store — SplitVote Store (EN).
 *
 * Server component: fetches user session, premium status, and one-time
 * purchases to determine which products to show as "Owned". The interactive
 * UI lives in <StoreClient/> on the client.
 *
 * Voting remains anonymous and frictionless — the store is opt-in surface
 * for users who want to support the project or unlock cosmetics.
 */
import { createClient } from '@/lib/supabase/server'
import { getUserEntitlements } from '@/lib/entitlements'
import type { UserRole } from '@/lib/admin-auth'
import StoreClient from '@/components/store/StoreClient'
import type { ProductId, PurchaseRow } from '@/lib/purchases'
import type { Metadata } from 'next'

const BASE_URL = 'https://splitvote.io'

export const metadata: Metadata = {
  title: 'Store | SplitVote',
  description: 'Premium subscription, legendary Pixies, and cosmetics. Support SplitVote and unlock more.',
  alternates: {
    canonical: `${BASE_URL}/store`,
    languages: {
      'en': `${BASE_URL}/store`,
      'it-IT': `${BASE_URL}/it/store`,
      'x-default': `${BASE_URL}/store`,
    },
  },
  openGraph: {
    title: 'SplitVote Store — Premium, Pixies & Cosmetics',
    description: 'Unlock legendary Pixies, hide ads, and personalize your profile.',
    url: `${BASE_URL}/store`,
    siteName: 'SplitVote',
    type: 'website',
  },
}

export const dynamic = 'force-dynamic'

interface SearchParams { tab?: string }

export default async function StorePage({ searchParams }: { searchParams: SearchParams }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isPremium = false
  let ownedProductIds: ProductId[] = []

  if (user) {
    const [profileRes, purchasesRes] = await Promise.all([
      supabase.from('profiles').select('is_premium, role').eq('id', user.id).single(),
      supabase.from('user_purchases').select('product_id, product_type, status, purchased_at')
        .eq('user_id', user.id).eq('status', 'completed'),
    ])

    const ents = getUserEntitlements({
      email: user.email,
      is_premium: profileRes.data?.is_premium ?? false,
      role: (profileRes.data?.role ?? 'user') as UserRole,
    })
    isPremium = ents.effectivePremium

    if (!purchasesRes.error && purchasesRes.data) {
      ownedProductIds = (purchasesRes.data as unknown as PurchaseRow[]).map(r => r.product_id)
    }
  }

  // Validate tab query param against known tabs
  const validTabs = new Set(['premium', 'pixies', 'cosmetics'])
  const initialTab = validTabs.has(searchParams.tab ?? '')
    ? (searchParams.tab as 'premium' | 'pixies' | 'cosmetics')
    : 'pixies'

  return (
    <StoreClient
      isLoggedIn={!!user}
      isPremium={isPremium}
      ownedProductIds={ownedProductIds}
      locale="en"
      initialTab={initialTab}
    />
  )
}

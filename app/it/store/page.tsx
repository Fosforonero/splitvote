/**
 * /it/store — SplitVote Store (IT).
 * Same logic as /store; only the locale changes for copy.
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
  description: 'Abbonamento Premium, Pixie leggendari e cosmetici. Supporta SplitVote e sblocca di più.',
  alternates: {
    canonical: `${BASE_URL}/it/store`,
    languages: {
      'it-IT': `${BASE_URL}/it/store`,
      'en': `${BASE_URL}/store`,
      'x-default': `${BASE_URL}/store`,
    },
  },
  openGraph: {
    title: 'Store SplitVote — Premium, Pixie e Cosmetici',
    description: 'Sblocca Pixie leggendari, niente pubblicità, personalizza il tuo profilo.',
    url: `${BASE_URL}/it/store`,
    siteName: 'SplitVote',
    type: 'website',
    locale: 'it_IT',
  },
}

export const dynamic = 'force-dynamic'

interface SearchParams { tab?: string }

export default async function ItStorePage({ searchParams }: { searchParams: SearchParams }) {
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

  const validTabs = new Set(['premium', 'pixies', 'cosmetics'])
  const initialTab = validTabs.has(searchParams.tab ?? '')
    ? (searchParams.tab as 'premium' | 'pixies' | 'cosmetics')
    : 'pixies'

  return (
    <StoreClient
      isLoggedIn={!!user}
      isPremium={isPremium}
      ownedProductIds={ownedProductIds}
      locale="it"
      initialTab={initialTab}
    />
  )
}

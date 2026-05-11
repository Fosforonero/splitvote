/**
 * /orders — User purchase history.
 *
 * Server component. Lists every row in user_purchases for the logged-in user,
 * sorted newest first. Shows product name, type icon, price, status,
 * purchase date. Refunded items appear with a red strike-through state.
 *
 * Use case: trust + support. If a user disputes a charge they can show this
 * page; if Stripe webhook missed an event the user can flag it here.
 */
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PRODUCT_BY_ID, type ProductId } from '@/lib/purchases'

export const metadata = { title: 'Order History | SplitVote' }
export const dynamic = 'force-dynamic'

interface PurchaseRow {
  id: string
  product_id: ProductId
  product_type: string
  stripe_session_id: string | null
  stripe_payment_intent_id: string | null
  amount_cents: number
  currency: string
  status: 'completed' | 'refunded'
  purchased_at: string
  refunded_at: string | null
}

const TYPE_ICON: Record<string, string> = {
  pixie:      '🐣',
  frame:      '🖼️',
  glow:       '✨',
  name_color: '🎨',
  bundle:     '🎁',
}

function formatPrice(cents: number, currency: string, locale: string): string {
  const eur = (cents / 100).toFixed(2)
  const symbol = currency.toUpperCase() === 'EUR' ? '€' : currency.toUpperCase() + ' '
  return locale === 'it' ? `${symbol}${eur.replace('.', ',')}` : `${symbol}${eur}`
}

function formatDate(iso: string, locale: string): string {
  const date = new Date(iso)
  return date.toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export default async function OrdersPage() {
  const locale = cookies().get('lang-pref')?.value === 'it' ? 'it' : 'en'
  const IT = locale === 'it'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(IT ? '/it/login?redirect=/orders' : '/login?redirect=/orders')

  const { data: purchases, error } = await supabase
    .from('user_purchases')
    .select('id, product_id, product_type, stripe_session_id, stripe_payment_intent_id, amount_cents, currency, status, purchased_at, refunded_at')
    .eq('user_id', user.id)
    .order('purchased_at', { ascending: false })

  const rows = (purchases as PurchaseRow[] | null) ?? []
  // Non-fatal: pre-v16 migration → empty list with a friendly hint
  const tableMissing = !!error

  const totalSpent = rows
    .filter(r => r.status === 'completed')
    .reduce((sum, r) => sum + r.amount_cents, 0)

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard" className="text-sm text-[var(--muted)] hover:text-white transition-colors mb-4 inline-block">
          ← {IT ? 'Dashboard' : 'Dashboard'}
        </Link>
        <h1 className="text-3xl font-black text-white mb-2">
          {IT ? '🧾 Storico Acquisti' : '🧾 Order History'}
        </h1>
        <p className="text-sm text-[var(--muted)]">
          {IT
            ? 'Tutti i tuoi acquisti one-time dallo Store SplitVote.'
            : 'Every one-time purchase you\'ve made from the SplitVote Store.'}
        </p>
      </div>

      {/* Summary */}
      {rows.length > 0 && (
        <div className="rounded-2xl border border-[var(--border)] bg-[#0d0d1a]/60 p-5 mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--muted)] font-bold mb-1">
              {IT ? 'Totale' : 'Total spent'}
            </p>
            <p className="text-2xl font-black text-white">
              {formatPrice(totalSpent, 'EUR', locale)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest text-[var(--muted)] font-bold mb-1">
              {IT ? 'Articoli' : 'Items'}
            </p>
            <p className="text-2xl font-black text-white">
              {rows.filter(r => r.status === 'completed').length}
            </p>
          </div>
        </div>
      )}

      {/* Rows */}
      {tableMissing ? (
        <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-6 text-center">
          <p className="text-yellow-300 text-sm">
            {IT
              ? 'Lo storico acquisti non è ancora disponibile.'
              : 'Order history is not available yet.'}
          </p>
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[#0d0d1a]/60 p-10 text-center">
          <p className="text-5xl mb-3">🛍️</p>
          <p className="text-[var(--muted)] text-sm mb-4">
            {IT
              ? 'Non hai ancora effettuato acquisti.'
              : 'You haven\'t made any purchases yet.'}
          </p>
          <Link
            href={IT ? '/it/store' : '/store'}
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors"
          >
            {IT ? 'Vai allo Store →' : 'Visit the Store →'}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map(row => {
            const def = PRODUCT_BY_ID[row.product_id]
            const isRefunded = row.status === 'refunded'
            const icon = TYPE_ICON[row.product_type] ?? '🎁'
            return (
              <div
                key={row.id}
                className={`rounded-2xl border p-4 flex items-center gap-4 transition-opacity ${
                  isRefunded
                    ? 'border-red-500/20 bg-red-500/5 opacity-70'
                    : 'border-[var(--border)] bg-[#0d0d1a]/60'
                }`}
              >
                {/* Icon */}
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-2xl ${
                  isRefunded ? 'bg-red-500/10' : 'bg-white/5 border border-white/10'
                }`}>
                  {icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold leading-tight mb-1 ${
                    isRefunded ? 'text-red-300 line-through' : 'text-white'
                  }`}>
                    {def?.name ?? row.product_id}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap text-[11px] text-[var(--muted)]">
                    <span>{formatDate(row.purchased_at, locale)}</span>
                    {isRefunded && row.refunded_at && (
                      <>
                        <span>·</span>
                        <span className="text-red-400">
                          {IT ? `Rimborsato il ${formatDate(row.refunded_at, locale)}` : `Refunded ${formatDate(row.refunded_at, locale)}`}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Price + status */}
                <div className="flex-shrink-0 text-right">
                  <p className={`text-base font-black tabular-nums ${
                    isRefunded ? 'text-red-300' : 'text-white'
                  }`}>
                    {formatPrice(row.amount_cents, row.currency, locale)}
                  </p>
                  <p className={`text-[10px] uppercase tracking-widest font-bold mt-0.5 ${
                    isRefunded ? 'text-red-400' : 'text-emerald-400'
                  }`}>
                    {isRefunded
                      ? (IT ? 'Rimborsato' : 'Refunded')
                      : (IT ? 'Completato' : 'Paid')}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Refund / support hint */}
      {rows.length > 0 && (
        <div className="mt-8 rounded-xl border border-white/5 bg-white/2 p-4 text-xs text-[var(--muted)] leading-relaxed">
          <p className="font-bold text-white/70 mb-1">
            {IT ? '💡 Hai bisogno di aiuto?' : '💡 Need help?'}
          </p>
          <p>
            {IT
              ? 'I beni digitali sono finali al momento del download. Per richieste di rimborso entro 14 giorni dall\'acquisto, contatta '
              : 'Digital goods are final at delivery. For refund requests within 14 days of purchase, contact '}
            <a href="mailto:hello@splitvote.io" className="text-blue-400 hover:text-blue-300 transition-colors">
              hello@splitvote.io
            </a>
            {IT ? ' citando l\'ID transazione Stripe.' : ' with your Stripe transaction ID.'}
          </p>
        </div>
      )}
    </div>
  )
}

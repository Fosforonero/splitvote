'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CreditCard, Loader2, Check, Star, ExternalLink, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { RARITY_STYLES } from '@/lib/rarity'

const AVATARS = ['🌍', '🔥', '⚡', '🧠', '🎭', '👾', '🦁', '🐺', '🦊', '🐉', '🌙', '☀️', '🎯', '🏆', '💎', '🌊', '🎪', '🚀', '🎲', '🧩']

const COUNTRIES = [
  { code: 'IT',    name: 'Italy',           nameIT: 'Italia'       },
  { code: 'US',    name: 'United States',   nameIT: 'Stati Uniti'  },
  { code: 'GB',    name: 'United Kingdom',  nameIT: 'Regno Unito'  },
  { code: 'DE',    name: 'Germany',         nameIT: 'Germania'     },
  { code: 'FR',    name: 'France',          nameIT: 'Francia'      },
  { code: 'ES',    name: 'Spain',           nameIT: 'Spagna'       },
  { code: 'PT',    name: 'Portugal',        nameIT: 'Portogallo'   },
  { code: 'BR',    name: 'Brazil',          nameIT: 'Brasile'      },
  { code: 'CA',    name: 'Canada',          nameIT: 'Canada'       },
  { code: 'AU',    name: 'Australia',       nameIT: 'Australia'    },
  { code: 'JP',    name: 'Japan',           nameIT: 'Giappone'     },
  { code: 'IN',    name: 'India',           nameIT: 'India'        },
  { code: 'MX',    name: 'Mexico',          nameIT: 'Messico'      },
  { code: 'AR',    name: 'Argentina',       nameIT: 'Argentina'    },
  { code: 'NL',    name: 'Netherlands',     nameIT: 'Paesi Bassi'  },
  { code: 'PL',    name: 'Poland',          nameIT: 'Polonia'      },
  { code: 'SE',    name: 'Sweden',          nameIT: 'Svezia'       },
  { code: 'NO',    name: 'Norway',          nameIT: 'Norvegia'     },
  { code: 'CH',    name: 'Switzerland',     nameIT: 'Svizzera'     },
  { code: 'Other', name: 'Other',           nameIT: 'Altro'        },
]

interface Props {
  userId: string
  initialName: string | null
  initialBirthYear: number | null
  initialGender: string | null
  initialCountry: string | null
  initialAvatar: string | null
  nameChanges: number
  isPremium: boolean
  isAdmin: boolean
  effectivePremium: boolean
  badges: { emoji: string; name: string; rarity: string }[]
  votesCount: number
  streakDays: number
  joinedAt: string
  locale?: string
}

export default function ProfileClient({
  userId,
  initialName,
  initialBirthYear,
  initialGender,
  initialCountry,
  initialAvatar,
  nameChanges,
  isPremium,
  isAdmin,
  effectivePremium,
  badges,
  votesCount,
  streakDays,
  joinedAt,
  locale = 'en',
}: Props) {
  const IT = locale === 'it'
  const [displayName, setDisplayName] = useState(initialName ?? '')
  const [birthYear, setBirthYear]     = useState(initialBirthYear?.toString() ?? '')
  const [gender, setGender]           = useState(initialGender ?? '')
  const [country, setCountry]         = useState(initialCountry ?? '')
  const [avatar, setAvatar]           = useState(initialAvatar ?? '🌍')
  const [saving, setSaving]                     = useState(false)
  const [redirecting, setRedirecting]           = useState(false)
  const [upgradingPremium, setUpgradingPremium] = useState(false)
  const [managingBilling, setManagingBilling]   = useState(false)
  const [message, setMessage]                   = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [shareCopied, setShareCopied]           = useState(false)
  const [dangerOpen, setDangerOpen]             = useState(false)
  const [deleteInput, setDeleteInput]           = useState('')
  const [deleting, setDeleting]                 = useState(false)
  const [deleteError, setDeleteError]           = useState<string | null>(null)

  const firstFreeAvailable = nameChanges === 0

  function renameLabel(): { text: string; color: string } {
    if (isAdmin)         return { text: IT ? '✅ Illimitati (Admin)'   : '✅ Unlimited (Admin)',   color: 'text-red-400'    }
    if (effectivePremium) return { text: IT ? '✅ Illimitati (Premium)' : '✅ Unlimited (Premium)', color: 'text-yellow-400' }
    if (firstFreeAvailable) return { text: IT ? '✅ Prima modifica gratuita' : '✅ First change free', color: 'text-green-400' }
    return { text: '€0.99', color: 'text-orange-400' }
  }
  const rename = renameLabel()
  const profileUrl = `https://splitvote.io/u/${userId}`

  // Check for success/cancel redirect from Stripe
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('name_changed') === '1') {
      setMessage({ type: 'success', text: IT ? '✅ Nome cambiato con successo!' : '✅ Name changed successfully!' })
      window.history.replaceState({}, '', '/profile')
    } else if (params.get('payment') === 'cancelled') {
      setMessage({ type: 'error', text: IT ? 'Pagamento annullato — il nome non è stato cambiato.' : 'Payment cancelled — your name was not changed.' })
      window.history.replaceState({}, '', '/profile')
    } else if (params.get('premium') === 'activated') {
      setMessage({ type: 'success', text: IT ? '⭐ Benvenuto in Premium! Tutte le funzioni sono ora sbloccate.' : '⭐ Welcome to Premium! All features are now unlocked.' })
      window.history.replaceState({}, '', '/profile')
    } else if (params.get('premium') === 'cancelled') {
      setMessage({ type: 'error', text: IT ? 'Upgrade annullato — resti sul piano gratuito.' : 'Upgrade cancelled — you remain on the free plan.' })
      window.history.replaceState({}, '', '/profile')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function save() {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: displayName || undefined,
          birthYear:   birthYear   || undefined,
          gender:      gender      || undefined,
          countryCode: country     || undefined,
          avatarEmoji: avatar,
        }),
      })
      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: IT ? '✅ Profilo aggiornato!' : '✅ Profile updated!' })
        if (data.nameChangesUsed !== undefined) {
          // displayName is already in state — no reset needed
        }
      } else if (res.status === 402) {
        await startStripeCheckout()
      } else {
        setMessage({ type: 'error', text: data.error ?? (IT ? 'Qualcosa è andato storto' : 'Something went wrong') })
      }
    } catch {
      setMessage({ type: 'error', text: IT ? 'Errore di rete — riprova' : 'Network error — try again' })
    } finally {
      setSaving(false)
    }
  }

  async function startStripeCheckout() {
    if (!displayName.trim()) {
      setMessage({ type: 'error', text: IT ? 'Inserisci prima un nome' : 'Enter a name first' })
      return
    }
    setRedirecting(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newName: displayName.trim() }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setMessage({ type: 'error', text: data.error ?? (IT ? 'Impossibile avviare il pagamento' : 'Could not start payment') })
        setRedirecting(false)
      }
    } catch {
      setMessage({ type: 'error', text: IT ? 'Errore di rete — riprova' : 'Network error — try again' })
      setRedirecting(false)
    }
  }

  async function startPremiumCheckout() {
    setUpgradingPremium(true)
    setMessage(null)
    try {
      const res  = await fetch('/api/stripe/subscription', { method: 'POST' })
      const data = await res.json()
      if (res.status === 409) {
        setMessage({ type: 'success', text: IT ? '⭐ Sei già in Premium!' : '⭐ You are already on Premium!' })
        return
      }
      if (data.url) {
        window.location.href = data.url
      } else {
        setMessage({ type: 'error', text: data.error ?? (IT ? "Impossibile avviare l'upgrade" : 'Could not start upgrade') })
      }
    } catch {
      setMessage({ type: 'error', text: IT ? 'Errore di rete — riprova' : 'Network error — try again' })
    } finally {
      setUpgradingPremium(false)
    }
  }

  async function manageBilling() {
    setManagingBilling(true)
    setMessage(null)
    try {
      const res  = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setMessage({ type: 'error', text: data.error ?? (IT ? 'Impossibile aprire il portale di fatturazione' : 'Could not open billing portal') })
      }
    } catch {
      setMessage({ type: 'error', text: IT ? 'Errore di rete — riprova' : 'Network error — try again' })
    } finally {
      setManagingBilling(false)
    }
  }

  const copyProfile = () => {
    navigator.clipboard.writeText(profileUrl)
    setShareCopied(true)
    setTimeout(() => setShareCopied(false), 2000)
  }

  const DANGER = {
    heading:      IT ? 'Zona pericolosa' : 'Danger zone',
    deleteBtn:    IT ? 'Elimina account' : 'Delete account',
    warning:      IT
      ? 'Questo elimina definitivamente il tuo account, i dati personali associati e le eventuali organizzazioni di cui sei proprietario. I conteggi anonimi aggregati dei voti possono restare.'
      : 'This permanently deletes your account, personal data, and any organizations you own. Aggregated anonymous vote totals may remain.',
    irreversible: IT ? 'Questa azione non può essere annullata.' : 'This action cannot be undone.',
    confirmLabel: IT ? 'Scrivi ELIMINA per confermare' : 'Type DELETE to confirm',
    confirmWord:  IT ? 'ELIMINA' : 'DELETE',
    cancel:       IT ? 'Annulla' : 'Cancel',
    finalBtn:     IT ? 'Elimina definitivamente account' : 'Permanently delete account',
    deletingMsg:  IT ? 'Eliminazione in corso…' : 'Deleting…',
    activeSub:    IT
      ? 'Hai un abbonamento Premium attivo. Cancellalo prima dal portale di fatturazione, poi riprova.'
      : 'You have an active Premium subscription. Please cancel it first via the billing portal, then try again.',
    errGeneric:   IT
      ? 'Si è verificato un errore. Riprova o contatta support@splitvote.io.'
      : 'An error occurred. Try again or contact support@splitvote.io.',
  }

  async function handleDeleteAccount() {
    setDeleting(true)
    setDeleteError(null)
    try {
      const res = await fetch('/api/profile/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      if (res.ok) {
        const supabase = createClient()
        await supabase.auth.signOut()
        window.location.href = IT ? '/it' : '/'
      } else {
        const data = await res.json()
        setDeleteError(data.error === 'active_subscription' ? DANGER.activeSub : DANGER.errGeneric)
        setDeleting(false)
      }
    } catch {
      setDeleteError(DANGER.errGeneric)
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 sm:py-12 space-y-6 sm:space-y-8">
      <div>
        <Link href="/dashboard" className="text-sm text-[var(--muted)] hover:text-white transition-colors">
          ← Dashboard
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-4 mb-1">
          {IT ? 'Impostazioni Profilo' : 'Profile Settings'}
        </h1>
        <p className="text-[var(--muted)] text-sm">
          {IT ? 'Gestisci identità, risultati e preferenze.' : 'Manage your identity, achievements, and preferences.'}
        </p>
      </div>

      {/* ── Membership ── */}
      <div id="membership" className="rounded-2xl border bg-[var(--surface)] p-5 sm:p-6"
        style={{
          borderColor: isAdmin ? 'rgba(248,113,113,0.35)' : isPremium ? 'rgba(234,179,8,0.35)' : 'var(--border)',
          background: isAdmin ? 'rgba(248,113,113,0.04)' : isPremium ? 'rgba(234,179,8,0.04)' : undefined,
        }}>
        <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-4">
          ⭐ {IT ? 'Abbonamento' : 'Membership'}
        </h2>

        {isAdmin ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
              <span className="text-lg">🛡️</span>
            </div>
            <div>
              <p className="font-bold text-red-400 text-sm">Admin Access</p>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                {IT
                  ? 'Accesso completo interno — tutte le funzioni sbloccate, nessuna pubblicità, rename illimitati.'
                  : 'Internal full access — all features unlocked, no ads, unlimited renames.'}
              </p>
            </div>
          </div>
        ) : isPremium ? (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
                <Star size={18} className="text-yellow-400" fill="currentColor" />
              </div>
              <div>
                <p className="font-bold text-yellow-400 text-sm">{IT ? 'Premium Attivo' : 'Premium Active'}</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">{IT ? 'Tutte le funzioni sbloccate' : 'All features unlocked'}</p>
              </div>
            </div>
            <button
              onClick={manageBilling}
              disabled={managingBilling}
              className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 transition-colors disabled:opacity-50"
            >
              {managingBilling ? <Loader2 size={12} className="animate-spin" /> : <ExternalLink size={12} />}
              {managingBilling
                ? (IT ? 'Apertura…' : 'Opening…')
                : (IT ? 'Gestisci Abbonamento' : 'Manage Billing')}
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                <Star size={18} className="text-blue-400" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">{IT ? 'Passa a Premium' : 'Upgrade to Premium'}</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">{IT ? 'Sblocca tutte le funzioni SplitVote' : 'Unlock all SplitVote features'}</p>
              </div>
            </div>
            {/* Feature list — 2 columns at sm+ for landscape/tablet readability */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-4 mb-5">
              {(IT ? [
                'Nessuna pubblicità — naviga senza interruzioni',
                'Rename illimitati del nome visualizzato',
                'Badge Premium ⭐ sul profilo pubblico',
                'Invia sondaggi alla community',
              ] : [
                'No ads — browse without interruptions',
                'Unlimited display name changes',
                'Premium ⭐ badge on your public profile',
                'Submit polls for the community to vote on',
              ]).map(f => (
                <li key={f} className="flex items-center gap-2 text-xs text-[var(--muted)]">
                  <Check size={12} className="text-green-400 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={startPremiumCheckout}
              disabled={upgradingPremium}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm px-6 py-3 rounded-xl transition-all disabled:opacity-50 neon-glow-blue"
            >
              {upgradingPremium ? (
                <><Loader2 size={14} className="animate-spin" />{IT ? 'Reindirizzamento al pagamento…' : 'Redirecting to payment…'}</>
              ) : (
                <><Star size={14} />{IT ? 'Passa a Premium' : 'Upgrade to Premium'}</>
              )}
            </button>
          </div>
        )}
      </div>

      {/* ── Avatar + Identity ── */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-5">🧬 {IT ? 'Identità' : 'Identity'}</h2>

        {/* Avatar picker */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-3">Avatar</label>
          <div className="flex flex-wrap gap-2">
            {AVATARS.map(emoji => (
              <button
                key={emoji}
                onClick={() => setAvatar(emoji)}
                className={`text-2xl w-11 h-11 sm:w-12 sm:h-12 rounded-xl border-2 transition-all flex items-center justify-center
                  ${avatar === emoji
                    ? 'border-blue-500 bg-blue-500/20 scale-110 neon-glow-blue'
                    : 'border-[var(--border)] bg-[var(--surface2)] hover:border-blue-500/40 hover:scale-105'
                  }`}
              >
                {emoji}
              </button>
            ))}
          </div>
          <p className="text-xs text-[var(--muted)] mt-2">
            {IT ? '🔒 Altri avatar si sbloccano man mano che voti.' : '🔒 More avatars unlock as you vote.'}
          </p>
        </div>

        {/* Display Name */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-2">
            {IT ? 'Nome visualizzato' : 'Display Name'}
            <span className={`ml-2 normal-case font-normal ${rename.color}`}>
              — {rename.text}
            </span>
          </label>
          <input
            type="text"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            placeholder={IT ? 'Il tuo nome' : 'Your display name'}
            maxLength={32}
            className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-xl px-4 py-3 text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500/60 text-sm"
          />
          {!effectivePremium && !firstFreeAvailable && (
            <p className="text-xs text-orange-400/80 mt-1.5 flex items-center gap-1.5">
              <CreditCard size={11} />
              {IT
                ? 'Hai usato il rename gratuito — il prossimo costa €0.99 via Stripe.'
                : "You've used your free rename — next one costs €0.99 via Stripe."}
            </p>
          )}
        </div>

        {/* Public Profile */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface2)] px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-[var(--muted)] uppercase tracking-widest font-bold mb-0.5">
              {IT ? 'Il tuo profilo pubblico' : 'Your public profile'}
            </p>
            <p className="text-sm text-white font-mono truncate">{profileUrl}</p>
          </div>
          <button
            onClick={copyProfile}
            className="flex-shrink-0 text-xs font-bold px-3 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-colors"
          >
            {shareCopied ? <Check size={13} /> : '🔗 Share'}
          </button>
        </div>
      </div>

      {/* ── Demographics ── */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-4">📊 {IT ? 'Dati demografici' : 'Demographics'}</h2>
        <p className="text-xs text-[var(--muted)] mb-5">
          {IT
            ? 'Usati solo in forma aggregata per le analisi globali. Mai condivisi individualmente.'
            : 'Used only in aggregate for global trend analytics. Never shared individually.'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-2">
              {IT ? 'Anno di nascita' : 'Birth Year'}
            </label>
            <input
              type="number"
              value={birthYear}
              onChange={e => setBirthYear(e.target.value)}
              placeholder="es. 1990"
              min={1920} max={2015}
              className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-xl px-4 py-3 text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500/60 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-2">
              {IT ? 'Genere' : 'Gender'}
            </label>
            <select
              value={gender}
              onChange={e => setGender(e.target.value)}
              className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/60 text-sm"
            >
              <option value="">{IT ? 'Preferisco non dirlo' : 'Prefer not to say'}</option>
              <option value="male">{IT ? 'Maschio' : 'Male'}</option>
              <option value="female">{IT ? 'Femmina' : 'Female'}</option>
              <option value="non_binary">{IT ? 'Non binario' : 'Non-binary'}</option>
              <option value="prefer_not">{IT ? 'Preferisco non dirlo' : 'Prefer not to say'}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-2">
              {IT ? 'Paese' : 'Country'}
            </label>
            <select
              value={country}
              onChange={e => setCountry(e.target.value)}
              className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/60 text-sm"
            >
              <option value="">{IT ? 'Seleziona paese' : 'Select country'}</option>
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>{IT ? c.nameIT : c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Moral Personality ── */}
      <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-5 sm:p-6">
        <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-4">🧭 {IT ? 'Personalità Morale' : 'Moral Personality'}</h2>
        {votesCount >= 3 ? (
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-bold text-purple-400 text-sm">{IT ? 'Il tuo archetipo è pronto' : 'Your archetype is ready'}</p>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                {IT ? 'Scopri il tuo profilo morale in base alle tue scelte su SplitVote.' : 'Discover your moral profile based on your SplitVote choices.'}
              </p>
            </div>
            <Link
              href={IT ? '/it/personality' : '/personality'}
              className="flex-shrink-0 flex items-center gap-1 text-xs font-bold px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 transition-colors"
            >
              {IT ? 'Vedi' : 'View'} <ChevronRight size={12} />
            </Link>
          </div>
        ) : (
          <div>
            <p className="font-bold text-white text-sm mb-3">{IT ? 'Scopri il tuo archetipo morale' : 'Discover your moral archetype'}</p>
            <div className="h-1.5 bg-white/5 rounded-full mb-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
                style={{ width: `${Math.min(100, Math.round((votesCount / 3) * 100))}%` }}
              />
            </div>
            <p className="text-xs text-[var(--muted)]">{votesCount} / 3 {IT ? 'voti — vota per sbloccare la personalità' : 'votes — keep voting to unlock your personality'}</p>
          </div>
        )}
      </div>

      {/* ── Trophy Case ── */}
      {badges.length > 0 && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">🏆 {IT ? 'Collezione Trofei' : 'Trophy Case'}</h2>
            <button
              onClick={copyProfile}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30 transition-colors"
            >
              {shareCopied ? '✅' : '📤 Share'}
            </button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {badges.map((b, i) => (
              <div key={i} title={b.name}
                className={`rounded-xl border p-3 text-center ${RARITY_STYLES[b.rarity] ?? RARITY_STYLES.common}`}>
                <p className="text-2xl mb-1">{b.emoji}</p>
                <p className="text-xs font-semibold leading-tight">{b.name}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--muted)] mt-4 text-center">
            {IT ? 'Il tuo profilo pubblico mostra tutti i trofei →' : 'Your public profile shows all trophies →'}{' '}
            <a href={`/u/${userId}`} className="text-blue-400 hover:text-blue-300 underline" target="_blank">
              {IT ? 'anteprima' : 'preview'}
            </a>
          </p>
        </div>
      )}

      {/* ── Stats ── */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-5">📈 {IT ? 'Il tuo Impatto' : 'Your Impact'}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-black text-blue-400">{votesCount.toLocaleString()}</p>
            <p className="text-xs text-[var(--muted)] mt-1">{IT ? 'Dilemmi votati' : 'Dilemmas voted'}</p>
          </div>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-black text-purple-400">{badges.length}</p>
            <p className="text-xs text-[var(--muted)] mt-1">{IT ? 'Badge ottenuti' : 'Badges earned'}</p>
          </div>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-black text-orange-400">{streakDays}</p>
            <p className="text-xs text-[var(--muted)] mt-1">{IT ? 'Giorni di serie 🔥' : 'Day streak 🔥'}</p>
          </div>
          <div className="text-center">
            <p className="text-xs sm:text-sm font-black text-[var(--muted)]">
              {new Date(joinedAt).toLocaleDateString(IT ? 'it-IT' : 'en-GB', { month: 'short', year: 'numeric' })}
            </p>
            <p className="text-xs text-[var(--muted)] mt-1">{IT ? 'Iscritto da' : 'Member since'}</p>
          </div>
        </div>
      </div>

      {/* ── Message ── */}
      {message && (
        <div className={`rounded-xl px-4 py-3 text-sm font-semibold ${
          message.type === 'success'
            ? 'bg-green-500/10 border border-green-500/30 text-green-400'
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* ── Save button ── */}
      <button
        onClick={save}
        disabled={saving || redirecting}
        className="w-full py-4 rounded-2xl font-black text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2
          bg-blue-600 hover:bg-blue-500 text-white neon-glow-blue hover:scale-[1.01]"
      >
        {redirecting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            {IT ? 'Reindirizzamento al pagamento…' : 'Redirecting to payment…'}
          </>
        ) : saving ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            {IT ? 'Salvataggio…' : 'Saving…'}
          </>
        ) : (
          IT ? 'Salva Profilo' : 'Save Profile'
        )}
      </button>

      {/* ── Danger Zone ── */}
      <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5 sm:p-6">
        <h2 className="text-xs font-black uppercase tracking-widest text-red-400 mb-4">
          ⚠️ {DANGER.heading}
        </h2>

        {!dangerOpen ? (
          <button
            type="button"
            onClick={() => setDangerOpen(true)}
            className="text-sm font-bold text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/60 px-4 py-2.5 rounded-xl transition-colors min-h-[44px]"
          >
            {DANGER.deleteBtn}
          </button>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-[var(--muted)]">{DANGER.warning}</p>
            <p className="text-sm font-bold text-red-400">{DANGER.irreversible}</p>

            <div>
              <label className="block text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-2">
                {DANGER.confirmLabel}
              </label>
              <input
                type="text"
                value={deleteInput}
                onChange={e => setDeleteInput(e.target.value)}
                placeholder={DANGER.confirmWord}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="characters"
                spellCheck={false}
                className="w-full bg-[var(--surface2)] border border-red-500/30 rounded-xl px-4 py-3 text-white placeholder-[var(--muted)] focus:outline-none focus:border-red-500/60 text-sm font-mono"
              />
            </div>

            {deleteError && (
              <div role="alert" className="rounded-xl px-4 py-3 text-sm bg-red-500/10 border border-red-500/30 text-red-400">
                {deleteError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setDangerOpen(false); setDeleteInput(''); setDeleteError(null) }}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl border border-[var(--border)] text-[var(--muted)] hover:text-white hover:border-[var(--border-hi)] transition-colors text-sm font-bold disabled:opacity-50 min-h-[48px]"
              >
                {DANGER.cancel}
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting || deleteInput.trim().toUpperCase() !== DANGER.confirmWord}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
              >
                {deleting
                  ? <><Loader2 size={14} className="animate-spin" />{DANGER.deletingMsg}</>
                  : DANGER.finalBtn}
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  COMPANIONS,
  RARITY_STYLES,
  STAGE_LABELS,
  isSpeciesUnlocked,
  getSpeciesStage,
  type CompanionSpecies,
  type PixieXpMap,
} from '@/lib/companion'
import { getPixieImagePath } from '@/lib/pixie'

interface Props {
  currentSpecies: CompanionSpecies
  /** Global votes — used only for unlock condition checks */
  votesCount: number
  streakDays: number
  /** Per-species accumulated votes. Falls back to stage 1 if absent. */
  pixieXp: PixieXpMap
  locale?: string
}

const IT_UNLOCK: Record<CompanionSpecies, string> = {
  spark: 'Sempre disponibile',
  blip:  'Sempre disponibile',
  momo:  'Sblocca con 10 voti',
  shade: 'Sblocca con 7 giorni di streak',
  orbit: 'Sblocca con 100 voti',
}

const EN_UNLOCK: Record<CompanionSpecies, string> = {
  spark: 'Always available',
  blip:  'Always available',
  momo:  'Unlock at 10 votes',
  shade: 'Unlock at 7-day streak',
  orbit: 'Unlock at 100 votes',
}

const IT_STAGE_LABELS: Record<number, string> = {
  1: 'Cucciolo',
  2: 'Apprendista',
  3: 'Esploratore',
  4: 'Campione',
  5: 'Leggendario',
  6: 'Ultra Leggendario',
}

export default function PixieSelector({
  currentSpecies,
  votesCount,
  streakDays,
  pixieXp,
  locale = 'en',
}: Props) {
  const IT = locale === 'it'
  const router = useRouter()

  const [selected, setSelected] = useState<CompanionSpecies>(currentSpecies)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imgErrors, setImgErrors] = useState<Partial<Record<CompanionSpecies, boolean>>>({})

  async function handleSelect(species: CompanionSpecies) {
    if (species === selected || saving) return
    if (!isSpeciesUnlocked(species, votesCount, streakDays)) return

    setSaving(true)
    setError(null)

    try {
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companionSpecies: species }),
      })

      if (res.ok) {
        setSelected(species)
        router.refresh()
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? (IT ? 'Errore nel salvataggio' : 'Save failed'))
      }
    } catch {
      setError(IT ? 'Errore di rete' : 'Network error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[#0d0d1a]/60 p-5 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-black uppercase tracking-widest text-[var(--muted)]">
          {IT ? 'Scegli il tuo Pixie' : 'Choose your Pixie'}
        </h2>
        {saving && (
          <span className="text-xs text-[var(--muted)] animate-pulse">
            {IT ? 'Salvataggio…' : 'Saving…'}
          </span>
        )}
      </div>

      {/* Sub-label */}
      <p className="text-xs text-[var(--muted)] mb-4">
        {IT
          ? 'Ogni Pixie mantiene il proprio livello — puoi cambiarli quando vuoi.'
          : 'Each Pixie keeps its own level — switch anytime without losing progress.'}
      </p>

      {/* Error */}
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="text-red-400 text-xs bg-red-900/20 rounded p-2 border border-red-500/20 mb-3"
        >
          {error}
        </div>
      )}

      {/* Species grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {COMPANIONS.map(c => {
          const unlocked = isSpeciesUnlocked(c.id, votesCount, streakDays)
          const isActive = selected === c.id
          const stage = getSpeciesStage(pixieXp, c.id)
          const stageLabel = IT ? (IT_STAGE_LABELS[stage] ?? STAGE_LABELS[stage]) : STAGE_LABELS[stage]
          const hasImgError = imgErrors[c.id]
          const unlockHint = IT ? IT_UNLOCK[c.id] : EN_UNLOCK[c.id]
          const rarityBadge = RARITY_STYLES[c.rarity] ?? RARITY_STYLES.common

          return (
            <button
              key={c.id}
              type="button"
              disabled={!unlocked || saving}
              onClick={() => handleSelect(c.id)}
              aria-label={`${unlocked ? (IT ? 'Scegli' : 'Select') : (IT ? 'Bloccato' : 'Locked')}: ${c.name}`}
              aria-pressed={isActive}
              className={[
                'flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-center min-h-[44px]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60',
                isActive
                  ? 'border-blue-500/60 bg-blue-500/10 shadow-[0_0_16px_rgba(77,159,255,0.2)]'
                  : unlocked
                    ? 'border-[var(--border)] bg-[#0a0a1a]/40 hover:border-blue-500/30 hover:bg-blue-500/5 cursor-pointer'
                    : 'border-white/5 bg-white/2 opacity-40 cursor-not-allowed',
              ].join(' ')}
            >
              {/* Image */}
              <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
                {!hasImgError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getPixieImagePath(c.id, stage)}
                    alt=""
                    className={`w-full h-full object-contain ${!unlocked ? 'grayscale' : ''}`}
                    onError={() => setImgErrors(prev => ({ ...prev, [c.id]: true }))}
                  />
                ) : (
                  <span className="text-3xl">{c.stageEmoji[stage - 1]}</span>
                )}

                {/* Lock overlay */}
                {!unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-base">🔒</span>
                  </div>
                )}

                {/* Selected ✓ */}
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-[9px] text-white font-black leading-none">✓</span>
                  </div>
                )}

                {/* Stage badge (bottom-left) — only for unlocked */}
                {unlocked && (
                  <div className="absolute -bottom-1 -left-1 px-1 min-w-[18px] h-[18px] rounded-full bg-[#0d0d1a] border border-[var(--border)] flex items-center justify-center">
                    <span className="text-[9px] font-black text-white leading-none">{stage}</span>
                  </div>
                )}
              </div>

              {/* Species name (without "Pixie " prefix) */}
              <p className={`text-[11px] font-bold leading-tight ${isActive ? 'text-white' : 'text-white/70'}`}>
                {c.name.replace('Pixie ', '')}
              </p>

              {/* Rarity badge */}
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${rarityBadge}`}>
                {c.rarity}
              </span>

              {/* Stage label for unlocked / unlock hint for locked */}
              {unlocked ? (
                <p className={`text-[9px] leading-tight ${isActive ? 'text-blue-300/80' : 'text-white/40'}`}>
                  {stageLabel}
                </p>
              ) : (
                <p className="text-[9px] text-white/30 leading-tight">{unlockHint}</p>
              )}
            </button>
          )
        })}
      </div>

      <p className="text-xs text-[var(--muted)] mt-3 text-center">
        {IT
          ? 'Vota con un Pixie equipaggiato per farlo crescere.'
          : 'Vote with a Pixie equipped to grow it.'}
      </p>
    </div>
  )
}

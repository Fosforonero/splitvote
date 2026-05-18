'use client'

/**
 * PixieDetailModal — full-screen modal shown when a species card is tapped in PixieSelector.
 *
 * - Shows a large preview image + evolution strip (stages 1–3 visible, 4–6 mystery)
 * - Unlocked & not-current: "Equip this Pixie" + "Cancel"
 * - Currently equipped:     disabled "✓ Equipped" badge + "Close"
 * - Locked species:         greyscale image + unlock hint + "Close"
 */

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  RARITY_STYLES,
  STAGE_LABELS,
  STAGE_THRESHOLDS,
  getSpeciesVotes,
  type CompanionDef,
  type CompanionSpecies,
  type PixieXpMap,
} from '@/lib/companion'
import PixieSprite from './PixieSprite'

const IT_STAGE_LABELS: Record<number, string> = {
  1: 'Cucciolo', 2: 'Apprendista', 3: 'Esploratore',
  4: 'Campione',  5: 'Leggendario', 6: 'Ultra Leggendario',
}

const IT_RARITY: Record<string, string> = {
  common: 'comune', rare: 'raro', epic: 'epico', legendary: 'leggendario',
}

interface Props {
  companion: CompanionDef
  /** Pre-computed stage for this species (from PixieSelector's getSpeciesStage call). */
  stage: number
  isCurrentSpecies: boolean
  isUnlocked: boolean
  unlockHint: string
  pixieXp: PixieXpMap
  /** Global vote count — used as fallback when per-species XP is 0. */
  votesCount: number
  locale: string
  /** Whether the API save is in progress (hoisted to PixieSelector). */
  saving: boolean
  /** Propagated save-error from PixieSelector. */
  error: string | null
  onEquip: () => void
  onClose: () => void
  /**
   * Preview-only mode: used on the public /pixie explainer page.
   * Forces stage-1 image at full colour, hides XP progress, shows only Close.
   */
  previewOnly?: boolean
  /** Override companion.description (used for locale-aware copy on the explainer page). */
  descriptionOverride?: string
}

export default function PixieDetailModal({
  companion, stage, isCurrentSpecies, isUnlocked, unlockHint,
  pixieXp, votesCount, locale, saving, error, onEquip, onClose,
  previewOnly = false, descriptionOverride,
}: Props) {
  const IT = locale === 'it'
  const rarityBadge = RARITY_STYLES[companion.rarity] ?? RARITY_STYLES.common
  const stageLabel = IT ? (IT_STAGE_LABELS[stage] ?? STAGE_LABELS[stage]) : STAGE_LABELS[stage]
  const isPremium = companion.access === 'premium'

  // In preview-only mode (explainer page) we always show stage 1 at full colour.
  const heroStage   = previewOnly ? 1 : stage
  const showUnlocked = previewOnly ? true : isUnlocked

  // Per-species vote progress (not shown in preview mode).
  // Same guard as CompanionDisplay: if the XP map has no keys yet (empty {})
  // the tracking migration hasn't fired — fall back to votesCount for the
  // currently-equipped species only. For any other species, 0 is the correct answer.
  const hasPerSpeciesTracking = Boolean(pixieXp && Object.keys(pixieXp).length > 0)
  const speciesVotes = getSpeciesVotes(pixieXp, companion.id as CompanionSpecies)
  const effectiveVotes = hasPerSpeciesTracking
    ? speciesVotes
    : (isCurrentSpecies ? votesCount : 0)
  const isMaxStage = stage === 6
  const currentThreshold = STAGE_THRESHOLDS[stage - 1]
  const nextThreshold = isMaxStage ? effectiveVotes : STAGE_THRESHOLDS[stage]
  const range = Math.max(1, nextThreshold - currentThreshold)
  const progress = isMaxStage
    ? 100
    : Math.min(100, Math.round(((effectiveVotes - currentThreshold) / range) * 100))
  const toNext = isMaxStage ? 0 : nextThreshold - effectiveVotes

  // Body scroll lock + Escape
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const modal = (
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label={IT ? 'Chiudi' : 'Close'}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 1100,
          background: 'rgba(0,0,0,0.72)',
          backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
          border: 'none', cursor: 'default',
        }}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={companion.name}
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1101,
          width: 'min(368px, calc(100vw - 24px))',
          maxHeight: 'calc(100dvh - 40px)',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          backgroundColor: '#0f0f2a',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '22px',
          padding: '24px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.72), 0 0 0 1px rgba(77,159,255,0.10)',
          animation: 'pixie-detail-in 0.22s ease-out',
        }}
      >
        <style>{`
          @keyframes pixie-detail-in {
            from { opacity: 0; transform: translate(-50%, -46%) scale(0.94); }
            to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          }
          @media (prefers-reduced-motion: reduce) {
            [style*="pixie-detail-in"] { animation: none !important; }
          }
        `}</style>

        {/* Close button */}
        <button
          type="button"
          aria-label={IT ? 'Chiudi' : 'Close'}
          onClick={onClose}
          style={{
            position: 'absolute', top: '14px', right: '14px',
            width: '30px', height: '30px',
            borderRadius: '9px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'transparent',
            color: 'rgba(255,255,255,0.45)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '17px', lineHeight: 1,
          }}
        >
          ×
        </button>

        {/* ── Hero image ── */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{
            width: '144px', height: '144px',
            borderRadius: '22px',
            border: `1px solid ${isCurrentSpecies ? 'rgba(77,159,255,0.3)' : 'rgba(255,255,255,0.07)'}`,
            background: isCurrentSpecies
              ? 'rgba(77,159,255,0.05)'
              : 'rgba(255,255,255,0.02)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
            boxShadow: isCurrentSpecies ? '0 0 36px rgba(77,159,255,0.18)' : undefined,
          }}>
            <div
              className="w-full h-full"
              style={{
                filter: !showUnlocked ? 'grayscale(1)' : undefined,
                opacity: !showUnlocked ? 0.45 : 1,
              }}
            >
              <PixieSprite
                species={companion.id as CompanionSpecies}
                stage={heroStage}
                alt={companion.name}
                fallbackEmoji={companion.stageEmoji[heroStage - 1]}
                className="w-full h-full"
                pixelSize={384}
                showFrame={false}
              />
            </div>
          </div>
        </div>

        {/* ── Name + badges ── */}
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '6px', flexWrap: 'wrap', marginBottom: '6px',
          }}>
            <h3 style={{ fontSize: '19px', fontWeight: 900, color: 'white', margin: 0 }}>
              {companion.name.replace('Pixie ', '')}
            </h3>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${rarityBadge}`}>
              {IT ? (IT_RARITY[companion.rarity] ?? companion.rarity) : companion.rarity}
            </span>
            {isPremium && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-yellow-500/40 bg-yellow-500/10 text-yellow-300">
                💎 premium
              </span>
            )}
            {isCurrentSpecies && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-blue-500/40 bg-blue-500/10 text-blue-300">
                {IT ? 'equipaggiato' : 'equipped'}
              </span>
            )}
          </div>
          <p style={{
            fontSize: '12px', color: 'rgba(255,255,255,0.48)',
            lineHeight: 1.55, margin: 0,
          }}>
            {descriptionOverride ?? companion.description}
          </p>
        </div>

        {/* ── Stage progress (unlocked only, not in preview mode) ── */}
        {!previewOnly && isUnlocked && !isMaxStage && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginBottom: '5px',
            }}>
              <span>{IT ? 'Stadio' : 'Stage'} {stage} · {stageLabel}</span>
              <span>{toNext} {IT ? `per Stadio ${stage + 1}` : `to Stage ${stage + 1}`}</span>
            </div>
            <div style={{
              height: '5px', borderRadius: '999px',
              background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', borderRadius: '999px',
                background: 'linear-gradient(90deg, #3b82f6, #a855f7)',
                width: `${progress}%`, transition: 'width 0.5s ease',
              }} />
            </div>
          </div>
        )}
        {!previewOnly && isUnlocked && isMaxStage && (
          <p style={{
            textAlign: 'center', fontSize: '12px',
            color: '#facc15', fontWeight: 700, marginBottom: '16px',
          }}>
            ✨ {IT ? 'Ultra Leggendario sbloccato!' : 'Ultra Legendary unlocked!'}
          </p>
        )}

        {/* ── Unlock hint (always shown in preview mode; shown when locked otherwise) ── */}
        {(previewOnly || !isUnlocked) && (
          <p style={{
            textAlign: 'center', fontSize: '12px',
            color: 'rgba(255,255,255,0.32)', marginBottom: '16px',
          }}>
            {previewOnly ? unlockHint : `🔒 ${unlockHint}`}
          </p>
        )}

        {/* ── Evolution strip (1–3 visible, 4–6 mystery) ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '5px', marginBottom: '20px',
        }}>
          {[1, 2, 3, 4, 5, 6].map(s => {
            const visible = s <= 3
            // In preview mode never highlight a specific stage (no user context)
            const isCurrent = !previewOnly && s === stage && showUnlocked
            return (
              <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  position: 'relative',
                  width: '100%', aspectRatio: '1',
                  borderRadius: '10px',
                  border: `1px solid ${
                    isCurrent
                      ? 'rgba(77,159,255,0.55)'
                      : visible
                        ? 'rgba(255,255,255,0.08)'
                        : 'rgba(255,255,255,0.04)'
                  }`,
                  background: visible
                    ? 'rgba(10,10,26,0.6)'
                    : 'linear-gradient(135deg, rgba(88,28,135,0.15), rgba(29,78,216,0.12))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden',
                  boxShadow: isCurrent ? '0 0 10px rgba(77,159,255,0.28)' : undefined,
                }}>
                  {visible ? (
                    <div
                      className="w-full h-full"
                      style={{
                        filter: !showUnlocked ? 'grayscale(1)' : undefined,
                        opacity: !showUnlocked ? 0.35 : 1,
                      }}
                    >
                      <PixieSprite
                        species={companion.id as CompanionSpecies}
                        stage={s}
                        alt={`Stage ${s}`}
                        fallbackEmoji={companion.stageEmoji[s - 1]}
                        className="w-full h-full"
                        pixelSize={128}
                        showFrame={false}
                      />
                    </div>
                  ) : (
                    <span style={{
                      fontSize: '15px', fontWeight: 900,
                      color: 'rgba(255,255,255,0.22)',
                    }}>?</span>
                  )}
                  {/* Stage badge */}
                  <div style={{
                    position: 'absolute', bottom: '2px', right: '2px',
                    width: '13px', height: '13px',
                    borderRadius: '999px',
                    background: '#0d0d1a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '7px', fontWeight: 900, lineHeight: 1,
                    color: isCurrent ? '#60a5fa' : 'rgba(255,255,255,0.6)',
                  }}>
                    {s}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Error ── */}
        {error && (
          <div style={{
            fontSize: '12px', color: '#f87171',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '10px', padding: '8px 12px',
            marginBottom: '12px', textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        {/* ── CTA buttons ── */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {previewOnly ? (
            /* Preview-only mode (explainer page) — close only */
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1, height: '46px', borderRadius: '13px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'transparent',
                color: 'rgba(255,255,255,0.55)',
                fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              }}
            >
              {IT ? 'Chiudi' : 'Close'}
            </button>
          ) : isCurrentSpecies ? (
            /* Currently equipped — show disabled badge + close */
            <>
              <button
                type="button"
                disabled
                style={{
                  flex: 2, height: '46px', borderRadius: '13px',
                  border: '1px solid rgba(77,159,255,0.25)',
                  background: 'rgba(77,159,255,0.08)',
                  color: 'rgba(147,197,253,0.55)',
                  fontSize: '13px', fontWeight: 700, cursor: 'default',
                }}
              >
                {IT ? '✓ Equipaggiato' : '✓ Currently equipped'}
              </button>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1, height: '46px', borderRadius: '13px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'transparent',
                  color: 'rgba(255,255,255,0.55)',
                  fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                }}
              >
                {IT ? 'Chiudi' : 'Close'}
              </button>
            </>
          ) : isUnlocked ? (
            /* Unlocked + not current — equip or cancel */
            <>
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                style={{
                  flex: 1, height: '46px', borderRadius: '13px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'transparent',
                  color: 'rgba(255,255,255,0.55)',
                  fontSize: '13px', fontWeight: 700,
                  cursor: saving ? 'default' : 'pointer',
                  opacity: saving ? 0.5 : 1,
                }}
              >
                {IT ? 'Annulla' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={onEquip}
                disabled={saving}
                style={{
                  flex: 2, height: '46px', borderRadius: '13px',
                  border: 'none',
                  background: saving ? 'rgba(59,130,246,0.45)' : '#3b82f6',
                  color: 'white',
                  fontSize: '13px', fontWeight: 700,
                  cursor: saving ? 'default' : 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                {saving
                  ? (IT ? 'Salvataggio…' : 'Saving…')
                  : (IT ? 'Equipaggia' : 'Equip this Pixie')}
              </button>
            </>
          ) : (
            /* Locked — close only */
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1, height: '46px', borderRadius: '13px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'transparent',
                color: 'rgba(255,255,255,0.55)',
                fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              }}
            >
              {IT ? 'Chiudi' : 'Close'}
            </button>
          )}
        </div>
      </div>
    </>
  )

  return createPortal(modal, document.body)
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { getPixieImagePath } from '@/lib/pixie'
import { sharePixieLevelUp } from '@/lib/share-pixie'
import { STAGE_LABELS, COMPANION_MAP } from '@/lib/companion'
import type { CompanionSpecies } from '@/lib/companion'

const IT_STAGE_LABELS: Record<number, string> = {
  1: 'Cucciolo',
  2: 'Apprendista',
  3: 'Esploratore',
  4: 'Campione',
  5: 'Leggendario',
  6: 'Ultra Leggendario',
}

interface Props {
  species: string
  stage: number
  xp: number
  locale: string
  userId: string
  onClose: () => void
}

export default function PixieLevelUpModal({ species, stage, xp, locale, userId, onClose }: Props) {
  const IT = locale === 'it'
  const [mounted, setMounted] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'shared' | 'error'>('idle')
  const prefersReduced = useRef(false)
  const stageLabel = IT ? (IT_STAGE_LABELS[stage] ?? STAGE_LABELS[stage]) : STAGE_LABELS[stage]

  // Emoji fallbacks mirror companion.ts spark defaults; safe for any species
  const stageFallbackEmoji: Record<number, string> = { 1: '⚡', 2: '⚡', 3: '🌟', 4: '💫', 5: '✨', 6: '🌟' }
  const emoji = stageFallbackEmoji[stage] ?? '⚡'

  useEffect(() => {
    setMounted(true)
    prefersReduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  async function handleShare() {
    const origin = window.location.origin
    const profileUrl = `${origin}/u/${userId}`
    const companionDef = COMPANION_MAP[species as CompanionSpecies]
    const speciesName = companionDef?.name ?? 'Pixie'
    const result = await sharePixieLevelUp({ species, speciesName, stage, stageLabel, profileUrl, locale })
    setShareState(result)
    if (result !== 'error') {
      setTimeout(() => setShareState('idle'), 2200)
    }
  }

  if (!mounted) return null

  const modal = (
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label={IT ? 'Chiudi' : 'Close'}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 1100,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
          border: 'none', cursor: 'default',
        }}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pixie-levelup-title"
        style={{
          position: 'fixed', inset: 0, zIndex: 1101,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px',
          animation: prefersReduced.current ? undefined : 'pixie-modal-in 0.25s ease-out',
        }}
      >
        <style>{`
          @keyframes pixie-modal-in {
            from { opacity: 0; transform: scale(0.92) translateY(8px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>

        <div
          style={{
            width: '100%', maxWidth: '360px',
            background: '#0f0f2a',
            border: '1px solid rgba(99,102,241,0.35)',
            borderRadius: '24px',
            padding: '28px 24px 24px',
            boxShadow: '0 0 0 1px rgba(99,102,241,0.2), 0 24px 64px rgba(0,0,0,0.7)',
            textAlign: 'center',
          }}
        >
          {/* Stage label above image */}
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(165,180,252,0.7)', marginBottom: '12px' }}>
            {IT ? 'STADIO' : 'STAGE'} {stage}
          </p>

          {/* Pixie image */}
          <div style={{
            width: '96px', height: '96px',
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(99,102,241,0.3)',
            boxShadow: '0 0 32px rgba(99,102,241,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '52px', margin: '0 auto 16px', overflow: 'hidden',
          }}>
            {!imgError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getPixieImagePath(species, stage)}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={() => setImgError(true)}
              />
            ) : emoji}
          </div>

          {/* Title */}
          <h2
            id="pixie-levelup-title"
            style={{ fontSize: '22px', fontWeight: 900, color: '#fff', marginBottom: '4px', lineHeight: 1.2 }}
          >
            {IT ? 'Pixie è salito di livello!' : 'Pixie leveled up!'}
          </h2>

          {/* Stage name */}
          <p style={{ fontSize: '15px', fontWeight: 700, color: 'rgba(165,180,252,1)', marginBottom: '6px' }}>
            {stageLabel}
          </p>

          {/* XP line (visible to user, not in share text) */}
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '24px' }}>
            {IT ? 'XP Totale:' : 'Total XP:'}{' '}
            <span style={{ color: '#fff', fontWeight: 700 }}>{xp.toLocaleString()}</span>
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={handleShare}
              style={{
                width: '100%', padding: '13px 16px', borderRadius: '14px',
                background: shareState === 'copied' || shareState === 'shared'
                  ? 'rgba(34,197,94,0.2)' : 'rgba(99,102,241,0.85)',
                border: shareState === 'copied' || shareState === 'shared'
                  ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(99,102,241,0.5)',
                color: '#fff', fontSize: '14px', fontWeight: 800, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {shareState === 'copied'
                ? (IT ? '✓ Copiato!' : '✓ Copied!')
                : shareState === 'shared'
                  ? (IT ? '✓ Condiviso!' : '✓ Shared!')
                  : shareState === 'error'
                    ? (IT ? 'Errore — riprova' : 'Error — try again')
                    : (IT ? '↗ Condividi' : '↗ Share')}
            </button>

            <button
              onClick={onClose}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '14px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)', fontSize: '14px', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {IT ? 'Continua' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </>
  )

  return createPortal(modal, document.body)
}

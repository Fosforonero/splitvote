'use client'

import { useState } from 'react'

interface Props {
  profileUrl: string
  displayName: string
  locale?: string
  /** If true, renders a compact icon-only button for tight layouts */
  compact?: boolean
}

export default function ProfileShareButton({ profileUrl, displayName, locale = 'en', compact = false }: Props) {
  const IT = locale === 'it'
  const [state, setState] = useState<'idle' | 'shared' | 'copied' | 'error'>('idle')

  async function handleShare() {
    const title = IT
      ? `Il profilo SplitVote di ${displayName}`
      : `${displayName}'s SplitVote profile`
    const text = IT
      ? `Scopri il Pixie e i trofei di ${displayName} su SplitVote!`
      : `Check out ${displayName}'s Pixie companion and trophies on SplitVote!`

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, text, url: profileUrl })
        setState('shared')
        setTimeout(() => setState('idle'), 2200)
        return
      } catch {
        // cancelled or denied — fall through
      }
    }

    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(profileUrl)
      setState('copied')
      setTimeout(() => setState('idle'), 2200)
    } catch {
      setState('error')
      setTimeout(() => setState('idle'), 2200)
    }
  }

  if (compact) {
    return (
      <button
        onClick={handleShare}
        title={IT ? 'Condividi profilo' : 'Share profile'}
        className={`
          text-xs font-bold px-4 py-2 rounded-xl border transition-all duration-200 flex-shrink-0
          ${state === 'copied' || state === 'shared'
            ? 'bg-green-500/10 border-green-500/30 text-green-400'
            : 'bg-white/5 border-white/10 text-[var(--muted)] hover:bg-white/10 hover:text-white'}
        `}
      >
        {state === 'copied'
          ? (IT ? '✓ Copiato' : '✓ Copied')
          : state === 'shared'
            ? (IT ? '✓ Condiviso' : '✓ Shared')
            : (IT ? '↗ Condividi' : '↗ Share')}
      </button>
    )
  }

  return (
    <button
      onClick={handleShare}
      className={`
        w-full flex items-center justify-center gap-2
        py-3 px-6 rounded-2xl border font-bold text-sm
        transition-all duration-200
        ${state === 'copied' || state === 'shared'
          ? 'bg-green-500/10 border-green-500/30 text-green-400'
          : state === 'error'
            ? 'bg-red-500/10 border-red-500/30 text-red-400'
            : 'bg-blue-600 hover:bg-blue-500 border-transparent text-white'}
      `}
    >
      {state === 'copied'
        ? `✓ ${IT ? 'Link copiato!' : 'Link copied!'}`
        : state === 'shared'
          ? `✓ ${IT ? 'Condiviso!' : 'Shared!'}`
          : state === 'error'
            ? (IT ? 'Errore — riprova' : 'Error — try again')
            : `📤 ${IT ? 'Condividi il tuo profilo' : 'Share your profile'}`}
    </button>
  )
}

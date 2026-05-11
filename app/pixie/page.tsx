import type { Metadata } from 'next'
import Link from 'next/link'
import PixieExplainerGallery from '@/components/PixieExplainerGallery'

const BASE_URL = 'https://splitvote.io'

export const metadata: Metadata = {
  title: 'Pixies — Your moral voting companions | SplitVote',
  description:
    'Meet the Pixies: small companions that grow each time you vote on a moral dilemma. Discover the 12 species, their rarities, and how to unlock them.',
  alternates: {
    canonical: `${BASE_URL}/pixie`,
    languages: {
      'en': `${BASE_URL}/pixie`,
      'it-IT': `${BASE_URL}/it/pixie`,
      'x-default': `${BASE_URL}/pixie`,
    },
  },
  openGraph: {
    title: 'Meet the Pixies — SplitVote',
    description:
      'Small companions that evolve as you vote on real moral dilemmas. 12 species, 6 evolution stages, infinite combinations.',
    url: `${BASE_URL}/pixie`,
    siteName: 'SplitVote',
  },
}

export default function PixieExplainerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-[var(--text)]">
      {/* Hero */}
      <h1 className="text-3xl sm:text-4xl font-black mb-2">Meet the Pixies</h1>
      <p className="text-sm text-[var(--muted)] mb-10">
        Tiny moral companions that grow every time you vote.
      </p>

      {/* What & Why */}
      <section className="space-y-8 text-sm leading-relaxed text-[var(--muted)] mb-10">
        <div>
          <h2 className="text-base font-bold text-white mb-2">What is a Pixie?</h2>
          <p>
            A Pixie is a small companion that travels with you while you vote on SplitVote&apos;s
            impossible moral dilemmas. Each Pixie evolves through six stages — from a curious
            hatchling all the way to an Ultra Legendary form — but only the Pixies you actually
            vote with will grow.
          </p>
          <p className="mt-3">
            They&apos;re purely cosmetic. They never bias your vote, they never push you toward
            a choice. Think of them as a side quest: a way to make voting feel personal.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-white mb-2">How they work</h2>
          <ul className="space-y-2 list-disc pl-5">
            <li>
              <strong className="text-white">Pick a Pixie</strong> from your dashboard. You can
              switch any time — they each keep their own progress.
            </li>
            <li>
              <strong className="text-white">Vote with one equipped</strong> and that Pixie&apos;s
              XP increases. Reach 10, 50, 100, 500 or 1000 votes and it evolves to the next stage.
            </li>
            <li>
              <strong className="text-white">Unlock more species</strong> by hitting milestones —
              total votes, streak days, or via the upcoming Pixie Market for premium ones.
            </li>
            <li>
              <strong className="text-white">No pay-to-win</strong>. Premium Pixies are cosmetic
              alternatives; the free ones go all the way to Ultra Legendary too.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-bold text-white mb-2">Rarity</h2>
          <p>
            Every species has a rarity tier — <span className="text-slate-300">common</span>,{' '}
            <span className="text-blue-300">rare</span>,{' '}
            <span className="text-purple-300">epic</span>, or{' '}
            <span className="text-yellow-300">legendary</span>. Rarity doesn&apos;t affect XP
            speed; it just signals how hard the Pixie is to unlock.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="mb-10">
        <h2 className="text-lg font-black text-white mb-1">All Pixies</h2>
        <p className="text-xs text-[var(--muted)] mb-5">
          Stages 4–6 are hidden — vote with a Pixie to reveal its final forms.
        </p>
        <PixieExplainerGallery locale="en" />
      </section>

      {/* CTA */}
      <section className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5 text-center">
        <p className="text-sm text-white font-bold mb-3">
          Ready to meet your first Pixie?
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/play"
            className="inline-block px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-sm font-bold transition-colors"
          >
            Vote on a dilemma →
          </Link>
          <Link
            href="/dashboard"
            className="inline-block px-5 py-2.5 rounded-xl border border-[var(--border)] hover:border-blue-500/40 text-white text-sm font-bold transition-colors"
          >
            Go to dashboard
          </Link>
        </div>
      </section>
    </div>
  )
}

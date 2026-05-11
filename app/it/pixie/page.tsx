import type { Metadata } from 'next'
import Link from 'next/link'
import PixieExplainerGallery from '@/components/PixieExplainerGallery'

const BASE_URL = 'https://splitvote.io'

export const metadata: Metadata = {
  title: 'Pixie — I tuoi compagni morali di voto | SplitVote',
  description:
    'Scopri i Pixie: piccoli compagni che crescono ogni volta che voti un dilemma morale. 12 specie, 6 stadi di evoluzione, come sbloccarli.',
  alternates: {
    canonical: `${BASE_URL}/it/pixie`,
    languages: {
      'it-IT': `${BASE_URL}/it/pixie`,
      'en': `${BASE_URL}/pixie`,
      'x-default': `${BASE_URL}/pixie`,
    },
  },
  openGraph: {
    title: 'Conosci i Pixie — SplitVote',
    description:
      'Piccoli compagni che evolvono votando dilemmi morali reali. 12 specie, 6 stadi, combinazioni infinite.',
    url: `${BASE_URL}/it/pixie`,
    siteName: 'SplitVote',
    locale: 'it_IT',
  },
}

export default function ItPixieExplainerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-[var(--text)]">
      {/* Hero */}
      <h1 className="text-3xl sm:text-4xl font-black mb-2">Conosci i Pixie</h1>
      <p className="text-sm text-[var(--muted)] mb-10">
        Piccoli compagni morali che crescono ogni volta che voti.
      </p>

      {/* What & Why */}
      <section className="space-y-8 text-sm leading-relaxed text-[var(--muted)] mb-10">
        <div>
          <h2 className="text-base font-bold text-white mb-2">Cos&apos;è un Pixie?</h2>
          <p>
            Un Pixie è un piccolo compagno che ti accompagna mentre voti i dilemmi morali
            impossibili di SplitVote. Ogni Pixie evolve attraverso sei stadi — da cucciolo
            curioso fino alla forma Ultra Leggendaria — ma crescono solo i Pixie con cui
            voti davvero.
          </p>
          <p className="mt-3">
            Sono puramente estetici. Non influenzano il voto, non ti spingono verso una scelta.
            Pensali come una side quest: un modo per rendere il voto qualcosa di personale.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-white mb-2">Come funzionano</h2>
          <ul className="space-y-2 list-disc pl-5">
            <li>
              <strong className="text-white">Scegli un Pixie</strong> dalla dashboard. Puoi
              cambiarlo quando vuoi — ognuno mantiene il proprio progresso.
            </li>
            <li>
              <strong className="text-white">Vota con uno equipaggiato</strong> e l&apos;XP
              di quel Pixie aumenta. A 10, 50, 100, 500 e 1000 voti evolve allo stadio successivo.
            </li>
            <li>
              <strong className="text-white">Sblocca altre specie</strong> raggiungendo obiettivi —
              voti totali, giorni di streak, o tramite il Pixie Market in arrivo per quelli premium.
            </li>
            <li>
              <strong className="text-white">Nessun pay-to-win</strong>. I Pixie premium sono
              alternative estetiche; anche quelli gratuiti arrivano all&apos;Ultra Leggendario.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-bold text-white mb-2">Rarità</h2>
          <p>
            Ogni specie ha una rarità — <span className="text-slate-300">common</span>,{' '}
            <span className="text-blue-300">rare</span>,{' '}
            <span className="text-purple-300">epic</span> o{' '}
            <span className="text-yellow-300">legendary</span>. La rarità non influenza la
            velocità di crescita; indica solo quanto è difficile sbloccare quel Pixie.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="mb-10">
        <h2 className="text-lg font-black text-white mb-1">Tutti i Pixie</h2>
        <p className="text-xs text-[var(--muted)] mb-5">
          Gli stadi 4–6 sono nascosti — vota con un Pixie per svelarne le forme finali.
        </p>
        <PixieExplainerGallery locale="it" />
      </section>

      {/* CTA */}
      <section className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5 text-center">
        <p className="text-sm text-white font-bold mb-3">
          Pronto a conoscere il tuo primo Pixie?
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/it/play"
            className="inline-block px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-sm font-bold transition-colors"
          >
            Vota un dilemma →
          </Link>
          <Link
            href="/dashboard"
            className="inline-block px-5 py-2.5 rounded-xl border border-[var(--border)] hover:border-blue-500/40 text-white text-sm font-bold transition-colors"
          >
            Vai alla dashboard
          </Link>
        </div>
      </section>
    </div>
  )
}

'use client'

import { usePathname } from 'next/navigation'
import { SOCIAL_LINKS } from '@/lib/social-links'

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]" aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  )
}

function RedditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]" aria-hidden="true">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
  )
}

function TwitchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]" aria-hidden="true">
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

export default function Footer() {
  const pathname = usePathname()
  const isIT = pathname.startsWith('/it')

  return (
    <footer className="text-center text-[var(--muted)] text-xs py-10 mt-16">
      <div className="neon-divider mb-8 mx-auto max-w-2xl" />
      <p className="mb-1">© 2026 SplitVote.io — {isIT ? 'Nessuna risposta giusta. Solo una onesta.' : 'No right answers. Just honest ones.'}</p>
      <p className="text-[10px] opacity-40 mb-3">{isIT ? 'Piattaforma di voto anonimo' : 'Anonymous voting platform'}</p>
      <p className="flex items-center justify-center gap-4 flex-wrap mb-3">
        <a href={isIT ? '/it/blog' : '/blog'} className="hover:text-white transition-colors">
          Blog
        </a>
        <span>·</span>
        <a href={isIT ? '/it/leaderboard' : '/leaderboard'} className="hover:text-white transition-colors">
          {isIT ? 'Classifica' : 'Leaderboard'}
        </a>
        <span>·</span>
        <a href={isIT ? '/it/faq' : '/faq'} className="hover:text-white transition-colors">FAQ</a>
        <span>·</span>
        <a href={isIT ? '/it/about' : '/about'} className="hover:text-white transition-colors">
          {isIT ? 'Chi siamo' : 'About'}
        </a>
        <span>·</span>
        <a href={isIT ? '/it/privacy' : '/privacy'} className="hover:text-white transition-colors">
          {isIT ? 'Privacy' : 'Privacy Policy'}
        </a>
        <span>·</span>
        <a href={isIT ? '/it/terms' : '/terms'} className="hover:text-white transition-colors">
          {isIT ? 'Termini' : 'Terms of Service'}
        </a>
        <span>·</span>
        <a href="mailto:support@splitvote.io" className="hover:text-white transition-colors">
          {isIT ? 'Supporto' : 'Support'}
        </a>
        <span>·</span>
        <button
          onClick={() => window.dispatchEvent(new Event('sv:openCookieSettings'))}
          className="hover:text-white transition-colors"
        >
          {isIT ? 'Cookie' : 'Cookie settings'}
        </button>
      </p>
      <p className="flex items-center justify-center gap-5 flex-wrap">
        <a
          href={SOCIAL_LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={isIT ? 'SplitVote su Instagram' : 'SplitVote on Instagram'}
          className="hover:text-white transition-colors"
        >
          <InstagramIcon />
        </a>
        <a
          href={SOCIAL_LINKS.tiktok}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={isIT ? 'SplitVote su TikTok' : 'SplitVote on TikTok'}
          className="hover:text-white transition-colors"
        >
          <TikTokIcon />
        </a>
        <a
          href={SOCIAL_LINKS.reddit}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={isIT ? 'SplitVote su Reddit' : 'SplitVote on Reddit'}
          className="hover:text-white transition-colors"
        >
          <RedditIcon />
        </a>
        <a
          href={SOCIAL_LINKS.twitch}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={isIT ? 'SplitVote su Twitch' : 'SplitVote on Twitch'}
          className="hover:text-white transition-colors"
        >
          <TwitchIcon />
        </a>
        <a
          href={SOCIAL_LINKS.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={isIT ? 'SplitVote su LinkedIn' : 'SplitVote on LinkedIn'}
          className="hover:text-white transition-colors"
        >
          <LinkedInIcon />
        </a>
      </p>
    </footer>
  )
}

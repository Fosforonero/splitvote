'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { safeRedirect } from '@/lib/safe-redirect'
import { track } from '@/lib/gtag'
import { Loader2, Mail, Lock, Vote, Trophy, Heart } from 'lucide-react'

const EN_COPY = {
  headline:    'Sign in or create your free account',
  sub:         'It only takes a few seconds.',
  benefits: [
    { icon: Vote,   text: 'Save your votes and see how you compare' },
    { icon: Trophy, text: 'Earn badges as you vote' },
    { icon: Heart,  text: 'Grow your Pixie with every dilemma' },
  ],
  google:      'Continue with Google',
  discord:     'Continue with Discord',
  orEmail:     'or use email',
  emailPh:     'your@email.com',
  pwPh:        'password (min. 6 characters)',
  signIn:      'Sign In',
  createAcct:  'Create Account',
  loading:     'Just a moment…',
  noAccount:   'No account yet?',
  haveAccount: 'Already have an account?',
  signUpFree:  'Sign up — it\'s free',
  signInLink:  'Sign in',
  free:        'Free forever. No credit card needed.',
  confirmEmail: 'Check your inbox — we sent you a confirmation email.',
  authFail:    'Authentication failed. Please try again.',
  forgotPassword: 'Forgot password?',
  resetHeadline:  'Reset your password',
  resetSub:       'Enter your email to receive a reset link.',
  resetEmail:     'your@email.com',
  sendReset:      'Send reset link',
  sending:        'Sending…',
  resetSent:      'Check your inbox — we sent a password reset link.',
  backToSignIn:   'Back to sign in',
}

const IT_COPY = {
  headline:    'Accedi o crea il tuo profilo gratis',
  sub:         'Bastano pochi secondi.',
  benefits: [
    { icon: Vote,   text: 'Salva i tuoi voti e confrontati con il mondo' },
    { icon: Trophy, text: 'Ottieni badge votando i dilemmi' },
    { icon: Heart,  text: 'Fai crescere il tuo Pixie' },
  ],
  google:      'Continua con Google',
  discord:     'Continua con Discord',
  orEmail:     'oppure usa la email',
  emailPh:     'la-tua@email.com',
  pwPh:        'password (min. 6 caratteri)',
  signIn:      'Accedi',
  createAcct:  'Crea Account',
  loading:     'Un momento…',
  noAccount:   'Non hai un account?',
  haveAccount: 'Hai già un account?',
  signUpFree:  'Registrati gratis',
  signInLink:  'Accedi',
  free:        'Gratis per sempre. Nessuna carta di credito.',
  confirmEmail: 'Controlla la tua email — ti abbiamo inviato un link di conferma.',
  authFail:    'Autenticazione fallita. Riprova.',
  forgotPassword: 'Password dimenticata?',
  resetHeadline:  'Reimposta la password',
  resetSub:       'Inserisci la tua email per ricevere il link di reset.',
  resetEmail:     'la-tua@email.com',
  sendReset:      'Invia link di reset',
  sending:        'Invio in corso…',
  resetSent:      'Controlla la tua email — ti abbiamo inviato un link per reimpostare la password.',
  backToSignIn:   'Torna al login',
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = safeRedirect(searchParams.get('redirect'), '/dashboard')
  const locale = searchParams.get('locale')
  const errorParam = searchParams.get('error')
  const copy = locale === 'it' ? IT_COPY : EN_COPY

  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(
    errorParam ? { type: 'error', text: copy.authFail } : null
  )
  const [resetEmail, setResetEmail] = useState('')

  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.push(redirect)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleOAuth(provider: 'google' | 'discord') {
    setLoading(true)
    setMessage(null)
    track('login_started', { method: provider, locale: locale ?? 'en' })
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    })
    if (error) {
      setMessage({ type: 'error', text: error.message })
      setLoading(false)
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    const resetRedirect = locale === 'it'
      ? `${window.location.origin}/auth/callback?redirect=${encodeURIComponent('/it/reset-password')}`
      : `${window.location.origin}/auth/callback?redirect=${encodeURIComponent('/reset-password')}`
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
      redirectTo: resetRedirect,
    })
    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: copy.resetSent })
    }
    setLoading(false)
  }

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (mode === 'login') {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage({ type: 'error', text: error.message })
        setLoading(false)
      } else if (!data.session) {
        setMessage({ type: 'success', text: copy.confirmEmail })
        setLoading(false)
      } else {
        track('login_completed', { method: 'email', locale: locale ?? 'en' })
        window.location.href = redirect
      }
    } else {
      const { data: signUpData, error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) {
        setMessage({ type: 'error', text: error.message })
        setLoading(false)
      } else if (signUpData.session) {
        track('signup_completed', { method: 'email', locale: locale ?? 'en' })
        window.location.href = redirect
      } else {
        // Email confirmation required — fire signup_initiated instead
        track('signup_initiated', { method: 'email', locale: locale ?? 'en' })
        setMessage({ type: 'success', text: copy.confirmEmail })
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-7">
          <a href={locale === 'it' ? '/it' : '/'} className="inline-block mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/splitvote_wordmark.png"
              alt="SplitVote"
              height={32}
              className="h-8 w-auto mx-auto"
            />
          </a>
          <h1 className="text-xl sm:text-2xl font-black text-white leading-snug">
            {mode === 'reset' ? copy.resetHeadline : copy.headline}
          </h1>
          <p className="text-[var(--muted)] text-sm mt-1.5">
            {mode === 'reset' ? copy.resetSub : copy.sub}
          </p>
        </div>

        {/* Benefit bullets — hidden in reset mode */}
        {mode !== 'reset' && (
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 px-5 py-4 mb-6 space-y-2.5">
            {copy.benefits.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-blue-400" />
                </div>
                <span className="text-sm text-white/80 leading-snug">{text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Card */}
        <div
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] backdrop-blur-sm p-6 sm:p-8 shadow-2xl"
          style={{ boxShadow: '0 0 40px rgba(77,159,255,0.06), 0 20px 60px rgba(0,0,0,0.4)' }}
        >
          {mode === 'reset' ? (
            /* ── Reset password form ── */
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-black text-white">{copy.resetHeadline}</h2>
                <p className="text-sm text-[var(--muted)] mt-1">{copy.resetSub}</p>
              </div>
              <form onSubmit={handleReset} className="space-y-3">
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" aria-hidden />
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    required
                    placeholder={copy.resetEmail}
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-white placeholder-[var(--muted)] text-base focus:outline-none focus:border-blue-500/50 transition-colors min-h-[48px]"
                  />
                </div>
                {message && (
                  <div role="alert" className={`rounded-xl px-4 py-3 text-sm ${
                    message.type === 'error'
                      ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                      : 'bg-green-500/10 border border-green-500/30 text-green-400'
                  }`}>{message.text}</div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-base transition-all disabled:opacity-50 neon-glow-blue hover:scale-[1.01] min-h-[52px]"
                >
                  {loading ? <><Loader2 size={16} className="animate-spin" />{copy.sending}</> : copy.sendReset}
                </button>
              </form>
              <p className="text-center text-sm text-[var(--muted)]">
                <button
                  onClick={() => { setMode('login'); setMessage(null) }}
                  className="text-blue-400 hover:text-blue-300 font-bold transition-colors underline underline-offset-2"
                >
                  {copy.backToSignIn}
                </button>
              </p>
            </div>
          ) : (
            /* ── Login / Signup form ── */
            <>
              {/* OAuth buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleOAuth('google')}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface2)] hover:border-[var(--border-hi)] hover:bg-white/5 text-white font-semibold text-sm transition-all disabled:opacity-50 min-h-[48px]"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : (
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  {copy.google}
                </button>

                <button
                  onClick={() => handleOAuth('discord')}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border border-[#5865F2]/40 bg-[#5865F2]/10 hover:bg-[#5865F2]/20 hover:border-[#5865F2]/60 text-[#7289da] font-semibold text-sm transition-all disabled:opacity-50 neon-glow-purple min-h-[48px]"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : (
                    <svg width="18" height="18" viewBox="0 0 71 55" fill="#5865F2" aria-hidden>
                      <path d="M60.1 4.9A58.5 58.5 0 0 0 45.5.4a.22.22 0 0 0-.23.11 40.8 40.8 0 0 0-1.8 3.7 54 54 0 0 0-16.2 0 37.4 37.4 0 0 0-1.83-3.7.23.23 0 0 0-.23-.11A58.3 58.3 0 0 0 10.9 4.9a.21.21 0 0 0-.1.08C1.58 18.73-.96 32.16.3 45.4a.24.24 0 0 0 .09.17 58.8 58.8 0 0 0 17.7 8.95.23.23 0 0 0 .25-.08 42 42 0 0 0 3.61-5.88.22.22 0 0 0-.12-.31 38.7 38.7 0 0 1-5.53-2.64.23.23 0 0 1-.02-.37c.37-.28.74-.57 1.1-.86a.22.22 0 0 1 .23-.03c11.6 5.3 24.16 5.3 35.63 0a.22.22 0 0 1 .23.03c.36.29.73.58 1.1.86a.23.23 0 0 1-.02.38 36.4 36.4 0 0 1-5.54 2.63.23.23 0 0 0-.12.32 47.1 47.1 0 0 0 3.6 5.87.22.22 0 0 0 .25.09 58.6 58.6 0 0 0 17.72-8.95.23.23 0 0 0 .09-.16c1.49-15.43-2.5-28.75-10.56-40.6a.18.18 0 0 0-.09-.1zM23.73 37.3c-3.49 0-6.37-3.21-6.37-7.15 0-3.93 2.82-7.15 6.37-7.15 3.57 0 6.42 3.25 6.37 7.15 0 3.94-2.82 7.15-6.37 7.15zm23.54 0c-3.49 0-6.37-3.21-6.37-7.15 0-3.93 2.82-7.15 6.37-7.15 3.57 0 6.42 3.25 6.37 7.15 0 3.94-2.8 7.15-6.37 7.15z"/>
                    </svg>
                  )}
                  {copy.discord}
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 neon-divider" />
                <span className="text-[var(--muted)] text-xs uppercase tracking-widest">{copy.orEmail}</span>
                <div className="flex-1 neon-divider" />
              </div>

              {/* Email/Password */}
              <form onSubmit={handleEmailAuth} className="space-y-3">
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" aria-hidden />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder={copy.emailPh}
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-white placeholder-[var(--muted)] text-base focus:outline-none focus:border-blue-500/50 transition-colors min-h-[48px]"
                  />
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" aria-hidden />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder={copy.pwPh}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-white placeholder-[var(--muted)] text-base focus:outline-none focus:border-blue-500/50 transition-colors min-h-[48px]"
                  />
                </div>

                {mode === 'login' && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => { setMode('reset'); setMessage(null) }}
                      className="text-xs text-[var(--muted)] hover:text-blue-400 transition-colors underline underline-offset-2"
                    >
                      {copy.forgotPassword}
                    </button>
                  </div>
                )}

                {message && (
                  <div role="alert" className={`rounded-xl px-4 py-3 text-sm ${
                    message.type === 'error'
                      ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                      : 'bg-green-500/10 border border-green-500/30 text-green-400'
                  }`}>{message.text}</div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-base transition-all disabled:opacity-50 neon-glow-blue hover:scale-[1.01] min-h-[52px]"
                >
                  {loading
                    ? <><Loader2 size={16} className="animate-spin" />{copy.loading}</>
                    : mode === 'login' ? copy.signIn : copy.createAcct
                  }
                </button>
              </form>

              <p className="text-center text-sm text-[var(--muted)] mt-5">
                {mode === 'login' ? copy.noAccount : copy.haveAccount}
                {' '}
                <button
                  onClick={() => { setMode(m => m === 'login' ? 'signup' : 'login'); setMessage(null) }}
                  className="text-blue-400 hover:text-blue-300 font-bold transition-colors underline underline-offset-2"
                >
                  {mode === 'login' ? copy.signUpFree : copy.signInLink}
                </button>
              </p>
            </>
          )}
        </div>

        <p className="text-center text-xs text-[var(--muted)] mt-5">{copy.free}</p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}

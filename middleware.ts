import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/** Redirect Italian browsers from / to /it (i18n-lite, no next-intl required) */
function maybeRedirectToItalian(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl

  // Only intercept the root path
  if (pathname !== '/') return null

  // Don't redirect if user explicitly chose English (cookie set by /it "Switch to English" link)
  if (request.cookies.get('lang-pref')?.value === 'en') return null

  const acceptLanguage = request.headers.get('accept-language') ?? ''
  const isItalian = /\bit[-_]/.test(acceptLanguage) || acceptLanguage.startsWith('it')

  if (isItalian) {
    const url = request.nextUrl.clone()
    url.pathname = '/it'
    const response = NextResponse.redirect(url, { status: 302 })
    // Remember the redirect for this session (12h) — avoids redirect loops
    response.cookies.set('lang-pref', 'it', { maxAge: 60 * 60 * 12, path: '/' })
    return response
  }
  return null
}

// Routes that require Supabase auth check in middleware.
// Public routes (/, /play/*, /results/*, /blog/*, etc.) skip getUser() entirely.
const AUTH_RELEVANT_PREFIXES = [
  '/dashboard',
  '/profile',
  '/admin',
  '/submit-poll',
  '/api/admin',
  '/api/missions',
  '/api/events',
  '/api/email',
  '/api/stripe/portal',
  '/api/stripe/subscription',
  '/api/me',
]

function isAuthRelevantPath(pathname: string): boolean {
  return AUTH_RELEVANT_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/') || pathname.startsWith(prefix + '?')
  )
}

export async function middleware(request: NextRequest) {
  // i18n-lite: auto-redirect Italian browsers to /it
  const itRedirect = maybeRedirectToItalian(request)
  if (itRedirect) return itRedirect

  const { pathname } = request.nextUrl

  // Skip Supabase for all public routes — saves one auth round-trip per request
  if (!isAuthRelevantPath(pathname)) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session + protect premium routes
  const { data: { user } } = await supabase.auth.getUser()

  const premiumRoutes = ['/dashboard', '/submit-poll']
  const isPremiumRoute = premiumRoutes.some((r) => pathname.startsWith(r))

  if (isPremiumRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  // Opt-in matcher: only routes that need the IT-redirect or Supabase auth gate.
  // Public/SEO routes (/blog, /play, /results, /sitemap.xml, etc.) skip the
  // middleware entirely so Vercel can serve them from pure edge cache. Each
  // protected route below already runs its own server-side auth check at the
  // page/handler level — middleware is defense-in-depth, not the only gate.
  matcher: [
    '/',
    '/dashboard/:path*',
    '/profile/:path*',
    '/admin/:path*',
    '/submit-poll/:path*',
    '/api/admin/:path*',
    '/api/missions/:path*',
    '/api/events/:path*',
    '/api/email/:path*',
    '/api/stripe/portal/:path*',
    '/api/stripe/subscription/:path*',
    '/api/me/:path*',
  ],
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Cache redirects in memory (refreshed every 5 minutes)
let redirectsCache: { source_path: string; target_path: string; status_code: number }[] | null = null
let cacheTime = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

async function getRedirects() {
  const now = Date.now()
  if (redirectsCache && now - cacheTime < CACHE_TTL) {
    return redirectsCache
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    const { data } = await supabase
      .from('web_redirects')
      .select('source_path, target_path, status_code')
      .eq('is_active', true)

    redirectsCache = data || []
    cacheTime = now
    return redirectsCache
  } catch {
    return redirectsCache || []
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip API routes, static files, _next
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next()
  }

  const redirects = await getRedirects()
  const match = redirects.find(r => r.source_path === pathname)

  if (match) {
    const url = new URL(match.target_path, request.url)
    return NextResponse.redirect(url, match.status_code as 301 | 302)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

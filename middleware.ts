import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options) {
          res.cookies.delete(name)
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if the request is for an admin route
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // Check for hardcoded admin authentication cookie
    const adminAuthCookie = req.cookies.get('adminAuth')?.value
    const isHardcodedAdmin = adminAuthCookie === 'true'

    // Allow access to admin login page
    if (req.nextUrl.pathname === '/admin/login') {
      // If already logged in as admin (either Supabase or hardcoded), redirect to dashboard
      if (isHardcodedAdmin) {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url))
      }

      if (session) {
        // Check if user is admin in Supabase
        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', session.user.id)
          .single()

        if (adminUser) {
          return NextResponse.redirect(new URL('/admin/dashboard', req.url))
        }
      }
      return res
    }

    // For all other admin routes, require authentication (either hardcoded or Supabase)
    if (!isHardcodedAdmin && !session) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    // If using Supabase auth, check if user is an admin
    if (!isHardcodedAdmin && session) {
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('id, role')
        .eq('id', session.user.id)
        .single()

      if (!adminUser) {
        // Not an admin, redirect to home
        return NextResponse.redirect(new URL('/', req.url))
      }
    }
  }

  return res
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
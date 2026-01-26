import { NextResponse } from 'next/server'
import { decrypt } from '@/lib/session'
import { cookies } from 'next/headers'

// Routes that don't require authentication
const publicRoutes = ['/', '/login', '/signup']

// Routes that require authentication
const protectedRoutes = ['/dashboard']

export default async function middleware(req) {
  const path = req.nextUrl.pathname
  const isPublicRoute = publicRoutes.includes(path)
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))

  // Get session from cookie
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session?.userId) {
    const loginUrl = new URL('/login', req.nextUrl)
    loginUrl.searchParams.set('callbackUrl', path)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to dashboard if accessing auth pages while logged in
  if ((path === '/login' || path === '/signup') && session?.userId) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)'],
}

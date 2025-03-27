import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  const { pathname } = req.nextUrl

  // Jika token tidak ada dan halaman bukan "/", redirect ke "/"
  if (!token && pathname !== '/') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Jika token ada dan halaman adalah "/", redirect ke "/dashboard" (atau halaman lain setelah login)
  if (token && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Jika kondisi lain, izinkan akses
  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/profile/:path*', '/menu/:path*'],
}

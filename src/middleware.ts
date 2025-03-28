import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('authToken')?.value
  const { pathname } = req.nextUrl

  // Jika ada token, validasi melalui API
  if (token) {
    try {
      const response = await fetch(`http://localhost:8000/api/validate-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      // Jika token valid dan pengguna berada di halaman login, redirect ke dashboard
      if (response.ok && pathname === '/') {
        console.log('User already logged in. Redirecting to dashboard.')
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }

      // Jika token tidak valid, hapus cookie dan redirect ke halaman login
      if (!response.ok) {
        console.log('Invalid token. Clearing cookie and redirecting to login.')
        const res = NextResponse.redirect(new URL('/', req.url))
        res.cookies.delete('authToken')
        return res
      }
    } catch (error) {
      console.error('Error validating token:', error)
      const res = NextResponse.redirect(new URL('/', req.url))
      res.cookies.delete('authToken')
      return res
    }
  }

  // Jika tidak ada token dan pengguna mencoba mengakses halaman selain login, redirect ke halaman login
  if (!token && pathname !== '/') {
    console.log('No token found. Redirecting to login.')
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Jika token valid atau pengguna berada di halaman yang sesuai, izinkan akses
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/profile/:path*',
    '/menu/:path*',
    '/products/:path*',
  ],
}

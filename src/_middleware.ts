import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token') // Ambil token dari cookie (sesuaikan dengan implementasimu)
  //   const token = false

  // Jika token tidak ada, redirect ke halaman login
  if (!token) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Jika login, izinkan akses
  return NextResponse.next()
}

// Tentukan path mana saja yang menggunakan middleware
export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/menu/:path*'], // Halaman yang dilindungi
}

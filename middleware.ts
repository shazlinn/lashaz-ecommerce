// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const AUTH_ONLY = new Set(['/checkout', '/profile']);

// Skip middleware for these paths (NextAuth, static, api public, etc.)
function isBypassed(pathname: string) {
  return (
    pathname.startsWith('/api/auth') || // NextAuth internal
    pathname.startsWith('/_next') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|txt|xml|json)$/) !== null
  );
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (isBypassed(pathname)) return NextResponse.next();

  const token = await getToken({ req }); // { id, role, ... } if your jwt callback sets them

  // Optional convenience: if an admin opens "/", send them to /admin
  if (pathname === '/' && token?.role === 'admin') {
    const url = new URL('/admin', req.url);
    return NextResponse.redirect(url);
  }

  // Protect admin routes: only admins
  if (pathname.startsWith('/admin')) {
    if (!token) {
      const url = new URL('/login', req.url);
      url.searchParams.set('callbackUrl', pathname + search);
      return NextResponse.redirect(url);
    }
    if (token.role !== 'admin') {
      return new NextResponse('Forbidden', { status: 403 });
    }
    return NextResponse.next();
  }

  // Protect authenticated-only routes
  if (AUTH_ONLY.has(pathname)) {
    if (!token) {
      const url = new URL('/login', req.url);
      url.searchParams.set('callbackUrl', pathname + search);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Paths the middleware should run on
export const config = {
  matcher: [
    '/',                // to support optional admin redirect
    '/admin/:path*',    // protect admin
    '/checkout',        // auth-only
    '/profile',         // auth-only
    // add more protected paths here
  ],
};
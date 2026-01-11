// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Read session token (works with NextAuth JWT strategy)
  const token = await getToken({ req });

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!token || token.role !== 'admin') {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  // Protect authenticated-only routes
  const authOnly = ['/checkout', '/profile'];
  if (authOnly.includes(pathname)) {
    if (!token) {
      const url = new URL('/login', req.url);
      url.searchParams.set('callbackUrl', req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Tell Next which paths use the middleware
export const config = {
  matcher: ['/admin/:path*', '/checkout', '/profile'],
};
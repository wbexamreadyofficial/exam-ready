import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getRoleHome } from '@/lib/auth/roleHome';
import type { UserRole } from '@/types/auth';

/**
 * Role-gated route prefixes. Keyed by the prefix, valued by the one role
 * allowed in it — kept separate from `ROLE_HOME` (which is "where does this
 * role land after login") since in principle more than one prefix could
 * belong to a role later.
 */
const ROLE_PREFIXES: Record<string, UserRole> = {
  '/dashboard': 'student',
  '/examiner': 'examiner',
  '/partner': 'partner',
};

/**
 * Edge-level role routing. This is a UX optimization, not the security
 * boundary — the `er_role` cookie is just a hint set by the client on login
 * (see `lib/auth/sessionCookie.ts`) so a wrong-role visitor is redirected
 * before a page even renders, instead of flashing the wrong dashboard and
 * then bouncing via `ProtectedRoute`. Every actual page still calls the API
 * with the real (unforgeable) access token, which the backend independently
 * re-validates and re-authorizes on every request.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get('er_role')?.value as UserRole | undefined;

  const matchedPrefix = Object.keys(ROLE_PREFIXES).find(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (matchedPrefix) {
    if (!role) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (role !== ROLE_PREFIXES[matchedPrefix]) {
      return NextResponse.redirect(new URL(getRoleHome(role), request.url));
    }
  }

  // Already signed in? Skip the login/register screen and go straight to the dashboard.
  if ((pathname === '/login' || pathname === '/register') && role) {
    return NextResponse.redirect(new URL(getRoleHome(role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/examiner/:path*',
    '/partner/:path*',
    '/login',
    '/register',
  ],
};

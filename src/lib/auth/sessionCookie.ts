/**
 * A small, non-httpOnly cookie carrying only the signed-in user's role.
 *
 * The actual access/refresh tokens stay in localStorage (see
 * `lib/api/client.ts`) and are the real authorization boundary — every API
 * call still requires a valid Bearer token, checked by the backend. This
 * cookie exists purely so `middleware.ts` (which runs on the server/edge and
 * has no access to localStorage) can make a fast routing decision — sending
 * a student away from `/admin`, or an already-logged-in user away from
 * `/login` — without waiting for a client-side redirect and the resulting
 * flash of the wrong page. A user could tamper with this cookie, but that
 * would only ever get them a friendlier redirect target; every real page
 * still fetches data with their actual (unforgeable) access token, which
 * the backend re-validates and re-authorizes independently.
 */

const COOKIE_NAME = 'er_role';
const COOKIE_MAX_AGE_DAYS = 30;

export function setSessionRoleCookie(role: string) {
  if (typeof document === 'undefined') return;
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(role)}; path=/; max-age=${maxAge}; samesite=lax`;
}

export function clearSessionRoleCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
}

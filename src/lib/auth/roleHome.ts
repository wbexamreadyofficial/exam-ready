import type { UserRole } from '@/types/auth';

/** Where each role lands after login, and which prefix "belongs" to them.
 *  Shared between the client (`useAuth`'s post-login redirect) and
 *  `middleware.ts` (edge-level role routing) so the two never drift apart. */
export const ROLE_HOME: Record<UserRole, string> = {
  admin: '/admin',
  student: '/dashboard',
  examiner: '/examiner',
  partner: '/partner',
};

export function getRoleHome(role: UserRole | string | undefined): string {
  if (role && role in ROLE_HOME) return ROLE_HOME[role as UserRole];
  return '/dashboard';
}

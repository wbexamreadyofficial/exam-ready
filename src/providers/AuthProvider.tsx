'use client';

import { useEffect } from 'react';
import { getStoredToken } from '@/lib/api/client';
import { setSessionRoleCookie, clearSessionRoleCookie } from '@/lib/auth/sessionCookie';
import { useAuthStore } from '@/store/authStore';

/**
 * The backend has no `/me` endpoint — the user object returned at
 * login/verify-otp time is persisted directly (see `authStore`'s zustand
 * `persist` middleware). This provider reconciles that persisted state with
 * whether an access token is still on hand (so a manually cleared
 * localStorage doesn't leave a "logged in" user with no token to call the
 * API with), and keeps `middleware.ts`'s role cookie in sync with it.
 *
 * It must wait for `hasHydrated` — zustand's `persist` rehydration from
 * localStorage resolves asynchronously, so on a hard reload `user` reads as
 * `null` for the first render tick even when a session exists. Running this
 * reconciliation before rehydration finishes would treat that as "logged
 * out" and clear both the store and the role cookie out from under the
 * session that's about to be restored.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, hasHydrated, setUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) return;

    if (user && !getStoredToken()) {
      logout();
      clearSessionRoleCookie();
    } else if (!user) {
      setUser(null);
      clearSessionRoleCookie();
    } else {
      setSessionRoleCookie(user.role);
    }
    setLoading(false);
  }, [hasHydrated, user, setUser, setLoading, logout]);

  return <>{children}</>;
}

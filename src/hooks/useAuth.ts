'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/lib/api/auth';
import { clearAuthTokens } from '@/lib/api/client';
import { getErrorMessage } from '@/lib/api/errors';
import { getRoleHome } from '@/lib/auth/roleHome';
import { setSessionRoleCookie, clearSessionRoleCookie } from '@/lib/auth/sessionCookie';
import type { AuthUser, WebRegisterOtpResult, WebSignupRole } from '@/types/auth';

/** Reads `?next=` (set by ProtectedRoute / middleware) and, if it's a safe
 *  same-origin path, returns it — otherwise routes by role. */
function getPostLoginDestination(user: AuthUser): string {
  if (typeof window !== 'undefined') {
    const next = new URLSearchParams(window.location.search).get('next');
    if (next && next.startsWith('/') && !next.startsWith('//')) return next;
  }
  return getRoleHome(user.role);
}

export function useAuth() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, error, setUser, setLoading, setError, logout: storeLogout } = useAuthStore();

  /**
   * Step 1 of the web signup flow — used by students/examiners/partners to
   * sign up with a mobile number and role.
   */
  const registerWeb = useCallback(
    async (mobileNumber: string, role: WebSignupRole): Promise<WebRegisterOtpResult> => {
      setLoading(true);
      setError(null);
      try {
        return await authApi.registerWeb(mobileNumber, role);
      } catch (err) {
        const message = getErrorMessage(err, 'Could not send the code. Please try again.');
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  /** Step 2 — verify the OTP just sent to `mobileNumber` and log in. */
  const verifyWebOtp = useCallback(
    async (mobileNumber: string, otp: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const { user } = await authApi.verifyWebOtp(mobileNumber, otp);
        setUser(user);
        setSessionRoleCookie(user.role);
        router.push(getPostLoginDestination(user));
      } catch (err) {
        const message = getErrorMessage(err, 'That code didn’t work. Please try again.');
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setUser, router]
  );

  /** Returning, already-verified account — logs in with just the mobile number. */
  const loginWeb = useCallback(
    async (mobileNumber: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const { user } = await authApi.loginWeb(mobileNumber);
        setUser(user);
        setSessionRoleCookie(user.role);
        router.push(getPostLoginDestination(user));
      } catch (err) {
        const message = getErrorMessage(err, 'Could not log you in. Please try again.');
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setUser, router]
  );

  /**
   * Silent pre-check used by the login page: /auth/web/login matches any
   * verified mobile number regardless of whether it was originally verified
   * via the app or the web flow, so this can just be tried directly. A 404
   * here just means "brand-new number" — not a real error, so it's
   * swallowed rather than surfaced, and the caller falls through to the
   * registration/OTP flow instead.
   */
  const tryWebLogin = useCallback(
    async (mobileNumber: string): Promise<boolean> => {
      setLoading(true);
      try {
        const { user } = await authApi.loginWeb(mobileNumber);
        setUser(user);
        setSessionRoleCookie(user.role);
        router.push(getPostLoginDestination(user));
        return true;
      } catch {
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setUser, router]
  );

  /**
   * Verifies the OTP from the register page's flow but deliberately does
   * NOT log the user in — the register page redirects to /login afterward
   * (with the mobile number pre-filled) so the actual sign-in always
   * happens from the one login page, via `tryWebLogin` above.
   */
  const verifyWebRegistration = useCallback(
    async (mobileNumber: string, otp: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        await authApi.verifyWebOtpOnly(mobileNumber, otp);
      } catch (err) {
        const message = getErrorMessage(err, 'That code didn’t work. Please try again.');
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await authApi.logout();
    } finally {
      clearAuthTokens();
      clearSessionRoleCookie();
      storeLogout();
      router.push('/login');
    }
  }, [storeLogout, router]);

  const clearError = useCallback(() => setError(null), [setError]);

  const isAdmin = user?.role === 'admin';
  const isStudent = user?.role === 'student';

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
    isAdmin,
    isStudent,
    registerWeb,
    verifyWebOtp,
    loginWeb,
    tryWebLogin,
    verifyWebRegistration,
    logout,
    clearError,
  };
}

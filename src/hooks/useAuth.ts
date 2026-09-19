'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/lib/api/auth';
import { clearAuthTokens } from '@/lib/api/client';
import { getErrorMessage } from '@/lib/api/errors';
import { AxiosError } from 'axios';
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

export type TryWebLoginResult =
  | 'logged-in'
  | 'no-account'
  | { otpRequired: true; devOtp?: string };

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
        const result = await authApi.loginWeb(mobileNumber);
        if ('otpRequired' in result) {
          throw new Error('A verification code is required for this account.');
        }
        setUser(result.user);
        setSessionRoleCookie(result.user.role);
        router.push(getPostLoginDestination(result.user));
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
   * First step of the login page: /auth/web/login matches any verified mobile
   * number, so try it directly. Outcomes:
   *  - 'logged-in'     — signed in and navigating away.
   *  - { otpRequired } — admin account: a code was issued, the caller must show
   *                      the OTP step and finish with `verifyWebOtp`.
   *  - 'no-account'    — 404, i.e. a brand-new number; the caller falls through
   *                      to registration. Not an error.
   * Any other failure (deactivated account, rate limit, network…) is surfaced
   * as a real error instead of being mistaken for a new number.
   */
  const tryWebLogin = useCallback(
    async (mobileNumber: string): Promise<TryWebLoginResult> => {
      setLoading(true);
      setError(null);
      try {
        const result = await authApi.loginWeb(mobileNumber);

        if ('otpRequired' in result) {
          return { otpRequired: true, devOtp: result.devOtp };
        }

        setUser(result.user);
        setSessionRoleCookie(result.user.role);
        router.push(getPostLoginDestination(result.user));
        return 'logged-in';
      } catch (err) {
        if (err instanceof AxiosError && err.response?.status === 404) {
          return 'no-account';
        }

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

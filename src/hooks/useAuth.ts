'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/lib/api/auth';
import { clearAuthTokens } from '@/lib/api/client';
import { getErrorMessage } from '@/lib/api/errors';
import { getRoleHome } from '@/lib/auth/roleHome';
import { setSessionRoleCookie, clearSessionRoleCookie } from '@/lib/auth/sessionCookie';
import type { AuthUser, RegisterOtpResult, WebRegisterOtpResult, WebSignupRole } from '@/types/auth';

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
   * Step 1 — submit the mobile number. Returns the raw result so the login
   * page can decide whether to show the OTP step or, for an
   * already-verified account, fall straight through to `login`.
   */
  const requestOtp = useCallback(
    async (mobileNumber: string): Promise<RegisterOtpResult> => {
      setLoading(true);
      setError(null);
      try {
        return await authApi.register(mobileNumber);
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
  const verifyOtp = useCallback(
    async (mobileNumber: string, otp: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const { user } = await authApi.verifyOtp(mobileNumber, otp);
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

  /** Returning, already-verified user — logs in with just the mobile number. */
  const login = useCallback(
    async (mobileNumber: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const { user } = await authApi.login(mobileNumber);
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
   * Step 1 of the web (email) signup flow — used by examiners/partners
   * (and optionally students) to sign up with email + mobile + role.
   */
  const registerWeb = useCallback(
    async (email: string, mobileNumber: string, role: WebSignupRole): Promise<WebRegisterOtpResult> => {
      setLoading(true);
      setError(null);
      try {
        return await authApi.registerWeb(email, mobileNumber, role);
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

  /** Step 2 — verify the OTP just sent to `email` and log in. */
  const verifyWebOtp = useCallback(
    async (email: string, otp: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const { user } = await authApi.verifyWebOtp(email, otp);
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

  /** Returning, already-verified web account — logs in with just the email. */
  const loginWeb = useCallback(
    async (email: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const { user } = await authApi.loginWeb(email);
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
    requestOtp,
    verifyOtp,
    login,
    registerWeb,
    verifyWebOtp,
    loginWeb,
    logout,
    clearError,
  };
}

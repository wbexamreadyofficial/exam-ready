'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/lib/api/auth';
import { cognitoAuth } from '@/lib/auth/cognito';
import { setAuthTokens, clearAuthTokens } from '@/lib/api/client';
import type { AuthUser } from '@/types/auth';

export function useAuth() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, error, setUser, setLoading, setError, logout: storeLogout } = useAuthStore();

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const tokens = await cognitoAuth.signIn(email, password);
        setAuthTokens(tokens.accessToken, tokens.refreshToken);
        const user = await authApi.getMe();
        setUser(user);
        router.push('/dashboard');
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Login failed';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setUser, router]
  );

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        await cognitoAuth.signUp(email, password, name);
        await authApi.register(name, email, password);
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Registration failed';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, router]
  );

  const verifyEmail = useCallback(
    async (email: string, code: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        await cognitoAuth.confirmSignUp(email, code);
        await authApi.verifyEmail(email, code);
        router.push('/login?verified=true');
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Verification failed';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, router]
  );

  const forgotPassword = useCallback(
    async (email: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        await cognitoAuth.forgotPassword(email);
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to send reset code';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, router]
  );

  const resetPassword = useCallback(
    async (email: string, code: string, password: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        await cognitoAuth.confirmResetPassword(email, code, password);
        router.push('/login?reset=true');
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Password reset failed';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, router]
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await cognitoAuth.signOut();
      await authApi.logout();
    } finally {
      clearAuthTokens();
      storeLogout();
      router.push('/login');
    }
  }, [storeLogout, router]);

  const refreshUser = useCallback(async (): Promise<AuthUser | null> => {
    try {
      const user = await authApi.getMe();
      setUser(user);
      return user;
    } catch {
      return null;
    }
  }, [setUser]);

  const isAdmin = user?.role === 'ADMIN';
  const isStudent = user?.role === 'STUDENT';

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
    isAdmin,
    isStudent,
    login,
    register,
    verifyEmail,
    forgotPassword,
    resetPassword,
    logout,
    refreshUser,
  };
}

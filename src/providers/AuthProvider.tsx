'use client';

import { useEffect } from 'react';
import { configureAmplify } from '@/lib/auth/amplify';
import { cognitoAuth } from '@/lib/auth/cognito';
import { authApi } from '@/lib/api/auth';
import { setAuthTokens, getStoredToken } from '@/lib/api/client';
import { useAuthStore } from '@/store/authStore';

configureAmplify();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        setLoading(true);
        const token = getStoredToken();
        if (!token) {
          setUser(null);
          return;
        }
        const session = await cognitoAuth.getSession();
        if (session) {
          setAuthTokens(session.accessToken, '');
          const user = await authApi.getMe();
          setUser(user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  return <>{children}</>;
}

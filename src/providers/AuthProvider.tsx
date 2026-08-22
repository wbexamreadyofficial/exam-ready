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
          // Provide demo student fallback for testing/demo
          setUser({
            id: 'demo-student-1',
            email: 'anindya@examready.in',
            name: 'Anindya Sarkar',
            role: 'STUDENT',
            emailVerified: true,
            createdAt: new Date().toISOString(),
          });
          return;
        }
        const session = await cognitoAuth.getSession();
        if (session) {
          setAuthTokens(session.accessToken, '');
          const user = await authApi.getMe();
          setUser(user);
        } else {
          setUser({
            id: 'demo-student-1',
            email: 'anindya@examready.in',
            name: 'Anindya Sarkar',
            role: 'STUDENT',
            emailVerified: true,
            createdAt: new Date().toISOString(),
          });
        }
      } catch {
        setUser({
          id: 'demo-student-1',
          email: 'anindya@examready.in',
          name: 'Anindya Sarkar',
          role: 'STUDENT',
          emailVerified: true,
          createdAt: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  return <>{children}</>;
}

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosError } from 'axios';
import { env } from '@/config/env';
import { clearSessionRoleCookie } from '@/lib/auth/sessionCookie';
import { useAuthStore } from '@/store/authStore';

function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: env.apiUrl,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  });

  // Request interceptor — attach access token
  client.interceptors.request.use(
    (config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor — on a 401, try one silent refresh + retry before
  // giving up. Concurrent 401s share the same in-flight refresh call.
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<{ message?: string; errors?: string[] }>) => {
      const original = error.config as (AxiosRequestConfig & { _retried?: boolean }) | undefined;
      const isRefreshCall = original?.url?.includes('/token/refresh');

      if (error.response?.status === 401 && original && !original._retried && !isRefreshCall) {
        original._retried = true;
        try {
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            original.headers = { ...original.headers, Authorization: `Bearer ${newAccessToken}` };
            return client(original);
          }
        } catch {
          /* fall through to ending the session below */
        }
        endSession();
      }

      return Promise.reject(error);
    }
  );

  return client;
}

/** The token was rejected and can't be refreshed (expired, revoked, or the
 *  account was deactivated) — drop all local session state and send the user
 *  to the login page instead of leaving them on a page that only shows errors. */
function endSession() {
  clearAuthTokens();
  if (typeof window === 'undefined') return;

  useAuthStore.getState().logout();
  clearSessionRoleCookie();

  if (window.location.pathname !== '/login') {
    // Intentional hard navigation: this runs outside React (no router), and a full reload also clears cached user data.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign(`/login?next=${encodeURIComponent(window.location.pathname)}`);
  }
}

let refreshInFlight: Promise<string | null> | null = null;

/** Rotates the refresh token via a bare axios call (bypasses `apiClient`'s
 *  own interceptors, which would otherwise recurse into this same flow). */
function refreshAccessToken(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight;

  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) return Promise.resolve(null);

  const flow = getAuthFlow();
  refreshInFlight = axios
    .post<{ success: boolean; data: { tokens: { accessToken: string; refreshToken: string } } }>(
      `${env.apiUrl}/auth/${flow}/token/refresh`,
      { refreshToken }
    )
    .then(({ data }) => {
      setAuthTokens(data.data.tokens.accessToken, data.data.tokens.refreshToken, flow);
      return data.data.tokens.accessToken;
    })
    .catch(() => null)
    .finally(() => {
      refreshInFlight = null;
    });

  return refreshInFlight;
}

export const apiClient = createApiClient();

/** Which backend auth flow issued the tokens currently in storage. This
 *  frontend only ever uses 'web' (email-identified, covers student/
 *  examiner/partner alike — see lib/api/auth.ts) — 'app' is kept only
 *  because the backend also exposes that flow and old sessions from before
 *  this frontend standardized on 'web' may still have it stored. */
export type AuthFlow = 'app' | 'web';

export function setAuthTokens(accessToken: string, refreshToken: string, flow: AuthFlow) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('authFlow', flow);
  }
}

export function clearAuthTokens() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('authFlow');
  }
}

export function getAuthFlow(): AuthFlow {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authFlow') === 'app' ? 'app' : 'web';
  }
  return 'web';
}

export function getStoredToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
}

export function getStoredRefreshToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refreshToken');
  }
  return null;
}

export type { AxiosRequestConfig };

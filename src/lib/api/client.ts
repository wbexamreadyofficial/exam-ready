import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosError } from 'axios';
import { env } from '@/config/env';

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

  // Response interceptor — normalize errors
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
      if (error.response?.status === 401) {
        clearAuthTokens();
      }
      return Promise.reject(error);
    }
  );

  return client;
}

export const apiClient = createApiClient();

export function setAuthTokens(accessToken: string, refreshToken: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }
}

export function clearAuthTokens() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}

export function getStoredToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
}

export type { AxiosRequestConfig };

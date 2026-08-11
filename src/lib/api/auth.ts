import { apiClient, setAuthTokens, clearAuthTokens } from './client';
import type { ApiResponse } from '@/types/api';
import type { AuthUser, AuthTokens } from '@/types/auth';

export interface LoginResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface RegisterResponse {
  message: string;
  email: string;
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', {
      email,
      password,
    });
    const result = data.data;
    setAuthTokens(result.tokens.accessToken, result.tokens.refreshToken);
    return result;
  },

  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<RegisterResponse> => {
    const { data } = await apiClient.post<ApiResponse<RegisterResponse>>('/auth/register', {
      name,
      email,
      password,
    });
    return data.data;
  },

  verifyEmail: async (email: string, code: string): Promise<{ message: string }> => {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>('/auth/verify-email', {
      email,
      code,
    });
    return data.data;
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>('/auth/forgot-password', {
      email,
    });
    return data.data;
  },

  resetPassword: async (
    email: string,
    code: string,
    password: string
  ): Promise<{ message: string }> => {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>('/auth/reset-password', {
      email,
      code,
      password,
    });
    return data.data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      clearAuthTokens();
    }
  },

  getMe: async (): Promise<AuthUser> => {
    const { data } = await apiClient.get<ApiResponse<AuthUser>>('/auth/me');
    return data.data;
  },
};

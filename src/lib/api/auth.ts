import { apiClient, setAuthTokens, clearAuthTokens, getStoredRefreshToken, getAuthFlow } from './client';
import type { ApiResponse } from '@/types/api';
import type { LoginResult, RegisterOtpResult, WebRegisterOtpResult, WebSignupRole } from '@/types/auth';

export const authApi = {
  /**
   * Step 1 of the app (phone) flow. Creates the account (or re-issues an OTP
   * for an unverified one) and returns `isRegistered: false` with an OTP in
   * flight, or `isRegistered: true` if this number is already a verified
   * account — in which case the caller should fall through to `login`.
   */
  register: async (mobileNumber: string): Promise<RegisterOtpResult> => {
    const { data } = await apiClient.post<ApiResponse<RegisterOtpResult>>('/auth/app/register', {
      mobileNumber,
    });
    return data.data;
  },

  /** Step 2 — verifies the OTP and logs the (now-verified) user in. */
  verifyOtp: async (mobileNumber: string, otp: string): Promise<LoginResult> => {
    const { data } = await apiClient.post<ApiResponse<LoginResult>>(
      '/auth/app/register/verify-otp',
      { mobileNumber, otp }
    );
    setAuthTokens(data.data.tokens.accessToken, data.data.tokens.refreshToken, 'app');
    return data.data;
  },

  /** Logs in an already-verified account by mobile number alone — no OTP needed. */
  login: async (mobileNumber: string): Promise<LoginResult> => {
    const { data } = await apiClient.post<ApiResponse<LoginResult>>('/auth/app/login', {
      mobileNumber,
    });
    setAuthTokens(data.data.tokens.accessToken, data.data.tokens.refreshToken, 'app');
    return data.data;
  },

  /**
   * Step 1 of the web (email) flow — used to sign up as an examiner or
   * partner (or student). Creates the account with the chosen role and
   * mobile number, and sends an OTP to the email; or returns
   * `isRegistered: true` if this email is already a verified account.
   */
  registerWeb: async (
    email: string,
    mobileNumber: string,
    role: WebSignupRole
  ): Promise<WebRegisterOtpResult> => {
    const { data } = await apiClient.post<ApiResponse<WebRegisterOtpResult>>('/auth/web/register', {
      email,
      mobileNumber,
      role,
    });
    return data.data;
  },

  /** Step 2 — verifies the web OTP and logs the (now-verified) user in. */
  verifyWebOtp: async (email: string, otp: string): Promise<LoginResult> => {
    const { data } = await apiClient.post<ApiResponse<LoginResult>>(
      '/auth/web/register/verify-otp',
      { email, otp }
    );
    setAuthTokens(data.data.tokens.accessToken, data.data.tokens.refreshToken, 'web');
    return data.data;
  },

  /** Logs in an already-verified web account by email alone — no OTP needed. */
  loginWeb: async (email: string): Promise<LoginResult> => {
    const { data } = await apiClient.post<ApiResponse<LoginResult>>('/auth/web/login', {
      email,
    });
    setAuthTokens(data.data.tokens.accessToken, data.data.tokens.refreshToken, 'web');
    return data.data;
  },

  logout: async (): Promise<void> => {
    const refreshToken = getStoredRefreshToken();
    const flow = getAuthFlow();
    try {
      if (refreshToken) {
        await apiClient.post(`/auth/${flow}/logout`, { refreshToken });
      }
    } finally {
      clearAuthTokens();
    }
  },
};

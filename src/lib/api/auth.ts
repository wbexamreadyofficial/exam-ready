import { apiClient, setAuthTokens, clearAuthTokens, getStoredRefreshToken } from './client';
import type { ApiResponse } from '@/types/api';
import type { LoginResult, WebLoginResult, WebRegisterOtpResult, WebSignupRole } from '@/types/auth';

// Note: the backend also exposes an App (phone-only, always-student) auth
// flow at /auth/app/* — but this frontend exclusively uses the Web flow
// below for every account (student/examiner/partner alike). The backend's
// web flow is itself mobile-number-identified (no email involved at all),
// and /auth/web/login matches any verified mobile number regardless of
// whether it was originally verified via the app or web flow — so an
// app-registered number can log in here too.

export const authApi = {
  /**
   * Step 1 of the web flow — used to sign up as an examiner, partner, or
   * student. Creates the account with the chosen role and sends an OTP to
   * the mobile number; or returns `isRegistered: true` if this number is
   * already a verified account.
   */
  registerWeb: async (mobileNumber: string, role: WebSignupRole): Promise<WebRegisterOtpResult> => {
    const { data } = await apiClient.post<ApiResponse<WebRegisterOtpResult>>('/auth/web/register', {
      mobileNumber,
      role,
    });
    return data.data;
  },

  /** Step 2 — verifies the web OTP and logs the (now-verified) user in. */
  verifyWebOtp: async (mobileNumber: string, otp: string): Promise<LoginResult> => {
    const { data } = await apiClient.post<ApiResponse<LoginResult>>(
      '/auth/web/register/verify-otp',
      { mobileNumber, otp }
    );
    setAuthTokens(data.data.tokens.accessToken, data.data.tokens.refreshToken, 'web');
    return data.data;
  },

  /**
   * Same endpoint as `verifyWebOtp`, but for the register page's flow of
   * "verify, then finish signing in from the login page" — the tokens this
   * call returns are deliberately discarded rather than persisted, since
   * the register page redirects to /login for the actual sign-in step.
   */
  verifyWebOtpOnly: async (mobileNumber: string, otp: string): Promise<void> => {
    await apiClient.post('/auth/web/register/verify-otp', { mobileNumber, otp });
  },

  /**
   * Logs in an already-verified account by mobile number alone — no OTP
   * needed. Works whether the number was verified via the web flow or the
   * app flow.
   */
  loginWeb: async (mobileNumber: string): Promise<WebLoginResult> => {
    const { data } = await apiClient.post<ApiResponse<WebLoginResult>>('/auth/web/login', {
      mobileNumber,
    });

    // Admin accounts get an OTP challenge instead of tokens — finish via verifyWebOtp.
    if ('otpRequired' in data.data) return data.data;

    setAuthTokens(data.data.tokens.accessToken, data.data.tokens.refreshToken, 'web');
    return data.data;
  },

  logout: async (): Promise<void> => {
    const refreshToken = getStoredRefreshToken();
    try {
      if (refreshToken) {
        await apiClient.post('/auth/web/logout', { refreshToken });
      }
    } finally {
      clearAuthTokens();
    }
  },
};

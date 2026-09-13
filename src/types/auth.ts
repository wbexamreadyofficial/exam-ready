export type UserRole = 'examiner' | 'partner' | 'student' | 'admin';

/** Matches the backend's `getSafeUser` shape exactly (auth.service.ts). */
export interface AuthUser {
  id: string;
  mobileNumber?: string;
  email?: string;
  fullName?: string;
  role: UserRole;
  preferredLanguage?: 'en' | 'bn';
  isAppUser: boolean;
  isMobileVerified: boolean;
  isEmailVerified: boolean;
  loginInfo: string[];
  lastLoginAt?: string;
}

/** Matches `createTokenPair` in the backend's token.service.ts. */
export interface AuthTokens {
  tokenType: 'Bearer';
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

export interface LoginResult {
  user: AuthUser;
  tokens: AuthTokens;
}

/** POST /api/auth/app/register response `data` — new account, OTP issued. */
export interface OtpRequestedResult {
  mobileNumber: string;
  expiresIn: number;
  devOtp?: string;
  isRegistered: false;
}

/** POST /api/auth/app/register response `data` — account already verified. */
export interface AlreadyRegisteredResult {
  mobileNumber: string;
  isRegistered: true;
}

export type RegisterOtpResult = OtpRequestedResult | AlreadyRegisteredResult;

/** Role selectable via the web (email) signup flow — "admin" is never
 *  self-serve, it can only be assigned internally. */
export type WebSignupRole = 'examiner' | 'partner' | 'student';

/** POST /api/auth/web/register response `data` — new account, OTP issued. */
export interface EmailOtpRequestedResult {
  email: string;
  expiresIn: number;
  devOtp?: string;
  isRegistered: false;
}

/** POST /api/auth/web/register response `data` — account already verified. */
export interface EmailAlreadyRegisteredResult {
  email: string;
  isRegistered: true;
}

export type WebRegisterOtpResult = EmailOtpRequestedResult | EmailAlreadyRegisteredResult;

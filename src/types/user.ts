import type { UserRole } from './auth';

export interface ProfileAddress {
  houseNoStreet: string;
  area: string;
  city: string;
  district: string;
  pinCode: string;
}

/** Matches the backend's `getUserDetailsById` projection (auth fields plus
 *  the user-editable profile fields) — GET /api/users/me, PATCH /api/users/update. */
export interface UserProfile {
  id: string;
  fullName?: string;
  profilePhoto?: string;
  /** ISO date string, e.g. "1998-04-12". */
  dob?: string;
  address?: ProfileAddress;
  mobileNumber?: string;
  email?: string;
  referralCode?: string;
  preferredLanguage?: 'en' | 'bn';
  role: UserRole;
  isAppUser: boolean;
  isMobileVerified: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

/** Matches the backend's `updateUserSchema` — `mobileNumber` is deliberately
 *  not editable from this endpoint. */
export interface UpdateProfileInput {
  fullName?: string;
  profilePhoto?: string | null;
  /** ISO date string. */
  dob?: string;
  address?: ProfileAddress;
  email?: string;
  referralCode?: string | null;
  preferredLanguage?: 'en' | 'bn';
}

export interface ProfileCompletionField {
  field: string;
  label: string;
}

/** GET /api/users/profile-completion. */
export interface ProfileCompletion {
  completionPercentage: number;
  completedSteps: number;
  totalSteps: number;
  remainingSteps: number;
  isComplete: boolean;
  missingFields: ProfileCompletionField[];
  bannerText: string;
}

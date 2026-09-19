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

/** A row from the admin user list — GET /api/users (Admin only). Mongoose
 *  documents serialize with `_id`. `isActive` is missing on accounts created
 *  before the field existed; treat `undefined` as active. */
export interface AdminUser {
  _id: string;
  fullName?: string;
  profilePhoto?: string;
  mobileNumber?: string;
  email?: string;
  role?: UserRole;
  isActive?: boolean;
  /** true = signed up via the mobile app, false = via the web. */
  isAppUser?: boolean;
  isMobileVerified: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserSortField = 'fullName' | 'role' | 'isActive' | 'createdAt' | 'lastLoginAt';

export interface UserListParams {
  /** Exact match on one user (a picked autocomplete suggestion). */
  userId?: string;
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  signupSource?: 'app' | 'web';
  /** Mobile-verified status. */
  verified?: boolean;
  /** ISO timestamps, inclusive. */
  joinedFrom?: string;
  joinedTo?: string;
  sortBy?: UserSortField;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface UserListResult {
  users: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface LoginRecord {
  _id: string;
  ipInfo: {
    ip: string;
    city?: string;
    region?: string;
    country?: string;
    org?: string;
    timezone?: string;
  };
  userAgent?: string;
  loginMethod: 'otp' | 'mobile';
  /** Missing on records created before the field existed - treat as 'success'. */
  status?: 'success' | 'failed';
  failureReason?: string;
  createdAt: string;
}

/** GET /api/users/:userId (Admin only). */
export interface AdminUserDetail extends AdminUser {
  dob?: string;
  address?: ProfileAddress;
  preferredLanguage?: 'en' | 'bn';
  referralCode?: string;
}

export interface UserDetailResult {
  user: AdminUserDetail;
  recentLogins: LoginRecord[];
}

export interface LoginListParams {
  loginMethod?: 'otp' | 'mobile';
  status?: 'success' | 'failed';
  /** ISO timestamps, inclusive. */
  from?: string;
  to?: string;
  sortBy?: 'createdAt' | 'loginMethod';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

/** KPI totals for the login history page — scoped by the date range only. */
export interface LoginSummary {
  totalAttempts: number;
  successful: number;
  failed: number;
  /** Percentage 0-100, or null when there are no attempts. */
  successRate: number | null;
  uniqueIps: number;
  lastSuccessAt: string | null;
  lastFailedAt: string | null;
}

/** GET /api/users/:userId/logins (Admin only). */
export interface LoginListResult {
  summary: LoginSummary;
  user: Pick<AdminUser, '_id' | 'fullName' | 'email' | 'mobileNumber' | 'profilePhoto'>;
  logins: LoginRecord[];
  pagination: UserListResult['pagination'];
}

export type AuditAction =
  | 'user.admin_created'
  | 'user.activated'
  | 'user.deactivated'
  | 'user.role_changed'
  | 'user.updated'
  | 'user.deleted';

/** GET /api/admin/audit-logs (Admin only). */
export interface AuditLogEntry {
  _id: string;
  actor?: string;
  actorLabel: string;
  action: AuditAction;
  target?: string;
  targetLabel?: string;
  summary: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export type SecurityEventType = 'login_unknown_number' | 'otp_unknown_number';

/** GET /api/admin/security-events (Admin only) — attempts that match no account. */
export interface SecurityEventEntry {
  _id: string;
  type: SecurityEventType;
  mobileNumber: string;
  channel: 'web' | 'app';
  ip: string;
  userAgent?: string;
  count: number;
  firstAt: string;
  lastAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ActivityListParams {
  /** Audit `action` or security-event `type`. */
  filter?: string;
  search?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface BulkStatusResult {
  requested: number;
  updated: number;
  skipped: number;
}

/** A row from GET /api/users/autocomplete (Admin only). */
export type UserSuggestion = Pick<
  AdminUser,
  '_id' | 'fullName' | 'email' | 'mobileNumber' | 'profilePhoto' | 'role' | 'isActive'
>;

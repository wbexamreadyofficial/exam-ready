import { apiClient } from './client';
import type { ApiResponse } from '@/types/api';
import type { UserRole } from '@/types/auth';
import type {
  AdminUser,
  BulkStatusResult,
  ProfileCompletion,
  UpdateProfileInput,
  UserListParams,
  LoginListParams,
  LoginListResult,
  UserDetailResult,
  UserListResult,
  UserProfile,
  UserSuggestion,
} from '@/types/user';

interface LoginListResponse extends ApiResponse<Pick<LoginListResult, 'user' | 'logins' | 'summary'>> {
  pagination: LoginListResult['pagination'];
}

interface UserListResponse extends ApiResponse<{ users: AdminUser[] }> {
  pagination: UserListResult['pagination'];
}

export const usersApi = {
  /** GET /api/users/me — shared profile endpoint for app and web users. */
  getMe: async (): Promise<UserProfile> => {
    const { data } = await apiClient.get<ApiResponse<{ user: UserProfile }>>('/users/me');
    return data.data.user;
  },

  /** PATCH /api/users/update — `mobileNumber` cannot be changed here. */
  updateProfile: async (payload: UpdateProfileInput): Promise<UserProfile> => {
    const { data } = await apiClient.patch<ApiResponse<{ user: UserProfile }>>(
      '/users/update',
      payload
    );
    return data.data.user;
  },

  /** GET /api/users/profile-completion. */
  getProfileCompletion: async (): Promise<ProfileCompletion> => {
    const { data } = await apiClient.get<ApiResponse<ProfileCompletion>>(
      '/users/profile-completion'
    );
    return data.data;
  },

  /** GET /api/users — Admin only. Search, filter, sort and pagination are all server-side. */
  listUsers: async (params?: UserListParams): Promise<UserListResult> => {
    const { data } = await apiClient.get<UserListResponse>('/users', { params });
    return { users: data.data.users, pagination: data.pagination };
  },

  /** POST /api/users/admins — Admin only. Creates a verified admin; 409 if the mobile/email is taken. */
  createAdmin: async (payload: {
    fullName: string;
    mobileNumber: string;
    email?: string;
  }): Promise<AdminUser> => {
    const { data } = await apiClient.post<ApiResponse<{ user: AdminUser }>>('/users/admins', payload);
    return data.data.user;
  },

  /** GET /api/users/:userId — Admin only. Full account details plus recent logins. */
  getUserDetails: async (userId: string): Promise<UserDetailResult> => {
    const { data } = await apiClient.get<ApiResponse<UserDetailResult>>(`/users/${userId}`);
    return data.data;
  },

  /** GET /api/users/:userId/logins — Admin only. Paginated login history. */
  getUserLogins: async (userId: string, params?: LoginListParams): Promise<LoginListResult> => {
    const { data } = await apiClient.get<LoginListResponse>(`/users/${userId}/logins`, { params });
    return {
      user: data.data.user,
      logins: data.data.logins,
      summary: data.data.summary,
      pagination: data.pagination,
    };
  },

  /** GET /api/users/autocomplete — Admin only. Up to 10 suggestions; newest users when `q` is empty. */
  autocompleteUsers: async (q: string, limit = 10): Promise<UserSuggestion[]> => {
    const { data } = await apiClient.get<ApiResponse<{ users: UserSuggestion[] }>>('/users/autocomplete', {
      params: { q: q || undefined, limit },
    });
    return data.data.users;
  },

  /** GET /api/users/export — Admin only. Every user matching the filters (unpaginated, capped at 5,000). */
  exportUsers: async (
    params?: Omit<UserListParams, 'page' | 'limit'>
  ): Promise<{ users: AdminUser[]; truncated: boolean }> => {
    const { data } = await apiClient.get<
      ApiResponse<{ users: AdminUser[] }> & { meta: { truncated: boolean } }
    >('/users/export', { params });
    return { users: data.data.users, truncated: data.meta.truncated };
  },

  /** PATCH /api/users/bulk-status — Admin only. Skips yourself and the last active admin. */
  bulkUpdateStatus: async (userIds: string[], isActive: boolean): Promise<BulkStatusResult> => {
    const { data } = await apiClient.patch<ApiResponse<BulkStatusResult>>('/users/bulk-status', {
      userIds,
      isActive,
    });
    return data.data;
  },

  /** PATCH /api/users/:userId/role — Admin only. Not yourself, not the last active admin. */
  updateUserRole: async (userId: string, role: UserRole): Promise<AdminUser> => {
    const { data } = await apiClient.patch<ApiResponse<{ user: AdminUser }>>(
      `/users/${userId}/role`,
      { role }
    );
    return data.data.user;
  },

  /** PATCH /api/users/:userId — Admin only. Edit name and/or email. */
  updateUserByAdmin: async (
    userId: string,
    payload: { fullName?: string; email?: string }
  ): Promise<AdminUser> => {
    const { data } = await apiClient.patch<ApiResponse<{ user: AdminUser }>>(`/users/${userId}`, payload);
    return data.data.user;
  },

  /** DELETE /api/users/:userId — Admin only. Soft delete; not yourself, not the last active admin. */
  deleteUser: async (userId: string): Promise<void> => {
    await apiClient.delete(`/users/${userId}`);
  },

  /** PATCH /api/users/:userId/status — Admin only. Deactivated users can't log in. */
  updateUserStatus: async (userId: string, isActive: boolean): Promise<AdminUser> => {
    const { data } = await apiClient.patch<ApiResponse<{ user: AdminUser }>>(
      `/users/${userId}/status`,
      { isActive }
    );
    return data.data.user;
  },
};

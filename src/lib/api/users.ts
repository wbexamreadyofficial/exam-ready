import { apiClient } from './client';
import type { ApiResponse } from '@/types/api';
import type { ProfileCompletion, UpdateProfileInput, UserProfile } from '@/types/user';

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
};

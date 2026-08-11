import { apiClient } from './client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api';
import type { UserProfile, StudentStats, UserListItem } from '@/types/user';

export const usersApi = {
  getProfile: async (): Promise<UserProfile> => {
    const { data } = await apiClient.get<ApiResponse<UserProfile>>('/users/profile');
    return data.data;
  },

  updateProfile: async (payload: Partial<UserProfile>): Promise<UserProfile> => {
    const { data } = await apiClient.put<ApiResponse<UserProfile>>('/users/profile', payload);
    return data.data;
  },

  getStats: async (): Promise<StudentStats> => {
    const { data } = await apiClient.get<ApiResponse<StudentStats>>('/users/stats');
    return data.data;
  },

  updateAvatar: async (fileKey: string): Promise<{ avatar: string }> => {
    const { data } = await apiClient.patch<ApiResponse<{ avatar: string }>>('/users/avatar', {
      fileKey,
    });
    return data.data;
  },

  // Admin
  getUsers: async (params?: PaginationParams): Promise<PaginatedResponse<UserListItem>> => {
    const { data } = await apiClient.get<PaginatedResponse<UserListItem>>('/admin/users', { params });
    return data;
  },

  getUserById: async (userId: string): Promise<UserProfile> => {
    const { data } = await apiClient.get<ApiResponse<UserProfile>>(`/admin/users/${userId}`);
    return data.data;
  },

  updateUserRole: async (userId: string, role: string): Promise<UserProfile> => {
    const { data } = await apiClient.patch<ApiResponse<UserProfile>>(`/admin/users/${userId}/role`, { role });
    return data.data;
  },

  toggleUserStatus: async (userId: string, isActive: boolean): Promise<UserProfile> => {
    const { data } = await apiClient.patch<ApiResponse<UserProfile>>(`/admin/users/${userId}/status`, { isActive });
    return data.data;
  },
};

import { apiClient } from './client';
import type { ApiResponse } from '@/types/api';
import type { AppSettings, UpdateAppSettingsInput } from '@/types/settings';

export const settingsApi = {
  get: async (): Promise<AppSettings> => {
    const { data } = await apiClient.get<ApiResponse<{ settings: AppSettings }>>('/admin/settings');
    return data.data.settings;
  },

  update: async (input: UpdateAppSettingsInput): Promise<AppSettings> => {
    const { data } = await apiClient.put<ApiResponse<{ settings: AppSettings }>>('/admin/settings', input);
    return data.data.settings;
  },
};

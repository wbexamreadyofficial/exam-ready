import { apiClient } from './client';
import type { ApiResponse } from '@/types/api';
import type { SiteContent, SiteContentType, UpdateSiteContentInput } from '@/types/siteContent';

export const siteContentApi = {
  get: async (type: SiteContentType): Promise<SiteContent> => {
    const { data } = await apiClient.get<ApiResponse<{ content: SiteContent }>>(`/admin/content/${type}`);
    return data.data.content;
  },

  update: async (type: SiteContentType, input: UpdateSiteContentInput): Promise<SiteContent> => {
    const { data } = await apiClient.put<ApiResponse<{ content: SiteContent }>>(`/admin/content/${type}`, input);
    return data.data.content;
  },
};

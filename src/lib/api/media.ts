import { apiClient } from './client';
import type { ApiResponse } from '@/types/api';

export interface UploadedMedia {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  filePath?: string;
  fileType?: string;
  size?: number;
  height?: number;
  width?: number;
}

export const mediaApi = {
  /** POST /api/media/upload — multipart, backed by ImageKit. */
  upload: async (file: File, folder?: string): Promise<UploadedMedia> => {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) formData.append('folder', folder);

    const { data } = await apiClient.post<ApiResponse<{ media: UploadedMedia }>>(
      '/media/upload',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data.data.media;
  },

  /** DELETE /api/media/:fileId. */
  remove: async (fileId: string): Promise<void> => {
    await apiClient.delete(`/media/${fileId}`);
  },
};

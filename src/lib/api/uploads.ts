import { apiClient } from './client';
import type { ApiResponse, UploadUrlResponse } from '@/types/api';
import axios from 'axios';

export type UploadCategory =
  | 'profile'
  | 'question-image'
  | 'study-material'
  | 'video'
  | 'pdf';

export const uploadsApi = {
  getPresignedUrl: async (
    category: UploadCategory,
    fileName: string,
    fileType: string
  ): Promise<UploadUrlResponse> => {
    const { data } = await apiClient.post<ApiResponse<UploadUrlResponse>>('/uploads/presigned-url', {
      category,
      fileName,
      fileType,
    });
    return data.data;
  },

  uploadToS3: async (
    presignedUrl: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<void> => {
    await axios.put(presignedUrl, file, {
      headers: { 'Content-Type': file.type },
      onUploadProgress: (e) => {
        if (e.total && onProgress) {
          onProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
    });
  },

  uploadFile: async (
    category: UploadCategory,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<{ fileKey: string; fileUrl: string }> => {
    const { uploadUrl, fileKey, fileUrl } = await uploadsApi.getPresignedUrl(
      category,
      file.name,
      file.type
    );
    await uploadsApi.uploadToS3(uploadUrl, file, onProgress);
    return { fileKey, fileUrl };
  },

  deleteFile: async (fileKey: string): Promise<void> => {
    await apiClient.delete('/uploads/file', { data: { fileKey } });
  },
};

import { apiClient } from './client';
import type { ApiResponse } from '@/types/api';

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalExams: number;
  publishedExams: number;
  totalQuestions: number;
  totalAttempts: number;
  totalRevenue: number;
  newUsersToday: number;
  attemptsToday: number;
}

export interface SubjectItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  questionCount: number;
  examCount: number;
  createdAt: string;
}

export const adminApi = {
  getStats: async (): Promise<AdminStats> => {
    const { data } = await apiClient.get<ApiResponse<AdminStats>>('/admin/stats');
    return data.data;
  },

  getUserGrowth: async (days = 30): Promise<{ date: string; count: number }[]> => {
    const { data } = await apiClient.get<ApiResponse<{ date: string; count: number }[]>>(
      '/admin/analytics/user-growth',
      { params: { days } }
    );
    return data.data;
  },

  getExamAttempts: async (days = 30): Promise<{ date: string; count: number }[]> => {
    const { data } = await apiClient.get<ApiResponse<{ date: string; count: number }[]>>(
      '/admin/analytics/exam-attempts',
      { params: { days } }
    );
    return data.data;
  },

  getSubjects: async (): Promise<SubjectItem[]> => {
    const { data } = await apiClient.get<ApiResponse<SubjectItem[]>>('/admin/subjects');
    return data.data;
  },

  createSubject: async (payload: Partial<SubjectItem>): Promise<SubjectItem> => {
    const { data } = await apiClient.post<ApiResponse<SubjectItem>>('/admin/subjects', payload);
    return data.data;
  },

  updateSubject: async (id: string, payload: Partial<SubjectItem>): Promise<SubjectItem> => {
    const { data } = await apiClient.put<ApiResponse<SubjectItem>>(`/admin/subjects/${id}`, payload);
    return data.data;
  },

  deleteSubject: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/subjects/${id}`);
  },

  // OCR / AI
  initiateOcr: async (fileKey: string, fileType: 'pdf' | 'image'): Promise<{ jobId: string }> => {
    const { data } = await apiClient.post<ApiResponse<{ jobId: string }>>('/admin/ocr/initiate', {
      fileKey,
      fileType,
    });
    return data.data;
  },

  getOcrJob: async (jobId: string): Promise<{
    status: 'pending' | 'processing' | 'completed' | 'failed';
    questions?: Array<{ text: string; options: string[]; correctIndex: number; explanation?: string }>;
    error?: string;
  }> => {
    const { data } = await apiClient.get(`/admin/ocr/jobs/${jobId}`);
    return data.data;
  },
};

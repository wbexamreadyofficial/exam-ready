import { apiClient } from './client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api';
import type { ExamResult, ResultListItem } from '@/types/result';

export const resultsApi = {
  getMyResults: async (params?: PaginationParams): Promise<PaginatedResponse<ResultListItem>> => {
    const { data } = await apiClient.get<PaginatedResponse<ResultListItem>>('/results', { params });
    return data;
  },

  getResult: async (resultId: string): Promise<ExamResult> => {
    const { data } = await apiClient.get<ApiResponse<ExamResult>>(`/results/${resultId}`);
    return data.data;
  },

  getExamResult: async (examId: string): Promise<ExamResult> => {
    const { data } = await apiClient.get<ApiResponse<ExamResult>>(`/exams/${examId}/my-result`);
    return data.data;
  },
};

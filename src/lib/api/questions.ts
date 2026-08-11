import { apiClient } from './client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api';
import type { Question } from '@/types/question';

export interface QuestionFilters extends PaginationParams {
  subjectId?: string;
  topicId?: string;
  difficulty?: string;
  type?: string;
  examId?: string;
}

export const questionsApi = {
  getQuestions: async (params?: QuestionFilters): Promise<PaginatedResponse<Question>> => {
    const { data } = await apiClient.get<PaginatedResponse<Question>>('/admin/questions', { params });
    return data;
  },

  getQuestion: async (questionId: string): Promise<Question> => {
    const { data } = await apiClient.get<ApiResponse<Question>>(`/admin/questions/${questionId}`);
    return data.data;
  },

  createQuestion: async (payload: Partial<Question>): Promise<Question> => {
    const { data } = await apiClient.post<ApiResponse<Question>>('/admin/questions', payload);
    return data.data;
  },

  updateQuestion: async (questionId: string, payload: Partial<Question>): Promise<Question> => {
    const { data } = await apiClient.put<ApiResponse<Question>>(`/admin/questions/${questionId}`, payload);
    return data.data;
  },

  deleteQuestion: async (questionId: string): Promise<void> => {
    await apiClient.delete(`/admin/questions/${questionId}`);
  },

  bulkImport: async (questions: Partial<Question>[]): Promise<{ imported: number; failed: number }> => {
    const { data } = await apiClient.post<ApiResponse<{ imported: number; failed: number }>>(
      '/admin/questions/bulk-import',
      { questions }
    );
    return data.data;
  },

  addToExam: async (examId: string, questionIds: string[]): Promise<void> => {
    await apiClient.post(`/admin/exams/${examId}/questions`, { questionIds });
  },
};

import { apiClient } from './client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api';
import type { Quiz, QuizAttempt } from '@/types/quiz';
import type { ExamQuestion } from '@/types/question';

export const quizzesApi = {
  getQuizzes: async (params?: PaginationParams & { type?: string }): Promise<PaginatedResponse<Quiz>> => {
    const { data } = await apiClient.get<PaginatedResponse<Quiz>>('/quizzes', { params });
    return data;
  },

  getQuiz: async (quizId: string): Promise<Quiz> => {
    const { data } = await apiClient.get<ApiResponse<Quiz>>(`/quizzes/${quizId}`);
    return data.data;
  },

  getQuizQuestions: async (quizId: string): Promise<ExamQuestion[]> => {
    const { data } = await apiClient.get<ApiResponse<ExamQuestion[]>>(`/quizzes/${quizId}/questions`);
    return data.data;
  },

  submitQuiz: async (
    quizId: string,
    answers: Record<string, string>
  ): Promise<QuizAttempt> => {
    const { data } = await apiClient.post<ApiResponse<QuizAttempt>>(`/quizzes/${quizId}/submit`, {
      answers,
    });
    return data.data;
  },
};

import { apiClient } from './client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api';
import type { Exam, ExamListItem, ExamSession } from '@/types/exam';
import type { ExamQuestion } from '@/types/question';

export interface ExamFilters extends PaginationParams {
  category?: string;
  subjectId?: string;
  difficulty?: string;
  status?: string;
  isPaid?: boolean;
}

export const examsApi = {
  getExams: async (params?: ExamFilters): Promise<PaginatedResponse<ExamListItem>> => {
    const { data } = await apiClient.get<PaginatedResponse<ExamListItem>>('/exams', { params });
    return data;
  },

  getExam: async (examId: string): Promise<Exam> => {
    const { data } = await apiClient.get<ApiResponse<Exam>>(`/exams/${examId}`);
    return data.data;
  },

  getExamQuestions: async (examId: string, sessionId: string): Promise<ExamQuestion[]> => {
    const { data } = await apiClient.get<ApiResponse<ExamQuestion[]>>(
      `/exams/${examId}/questions`,
      { params: { sessionId } }
    );
    return data.data;
  },

  startExam: async (examId: string): Promise<ExamSession> => {
    const { data } = await apiClient.post<ApiResponse<ExamSession>>(`/exams/${examId}/start`);
    return data.data;
  },

  submitExam: async (
    examId: string,
    sessionId: string,
    answers: Record<string, string>
  ): Promise<{ resultId: string }> => {
    const { data } = await apiClient.post<ApiResponse<{ resultId: string }>>(
      `/exams/${examId}/submit`,
      { sessionId, answers }
    );
    return data.data;
  },
};

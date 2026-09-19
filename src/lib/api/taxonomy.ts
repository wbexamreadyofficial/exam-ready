import { apiClient } from './client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api';

// ─── ExamCategory ────────────────────────────────────────────────────────────

export interface Category {
  _id: string;
  name: string;
  slug: string;
  fullForm?: string;
  description?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
}

// ─── Subject ─────────────────────────────────────────────────────────────────
// Subjects are GLOBAL — they are NOT scoped to a category.
// A subject like "Polity" can appear under any exam in any category.

export interface Subject {
  _id: string;
  name: string;
  slug: string;
  nameBn?: string;
  description?: string;
  isActive: boolean;
  displayOrder: number;
  questionCount: number;
  createdAt: string;
}

// ─── Exam ─────────────────────────────────────────────────────────────────────
// Exams belong to a category.  e.g. "WB Constable Preliminary 2026" → "WB Constable"

export interface ExamPattern {
  durationMinutes?: number;
  totalQuestions?: number;
  marksPerQuestion?: number;
  negativeMarksPerQuestion?: number;
  passingMarks?: number;
}

export interface Exam {
  _id: string;
  title: string;          // must be unique — "WB Constable Preliminary 2026"
  slug: string;
  titleBn?: string;
  description?: string;
  year?: number;
  category: { _id: string; name: string } | null;   // required: parent category
  pattern?: ExamPattern;
  language: 'EN' | 'BN' | 'BILINGUAL';
  isActive: boolean;
  displayOrder: number;
  questionSetCount: number;
  createdAt: string;
}

// ─── QuestionSet ──────────────────────────────────────────────────────────────
// Question sets belong to an exam.  e.g. "WB Constable Prelim — Mock Test 05" → that exam

export interface QuestionSet {
  _id: string;
  title: string;          // must be unique within its exam
  slug: string;
  titleBn?: string;
  exam: { _id: string; title: string } | null;      // required: parent exam
  language: 'EN' | 'BN' | 'BILINGUAL';
  isActive: boolean;
  isDraft: boolean;
  displayOrder: number;
  questionCount: number;
  createdBy?: string;
  createdAt: string;
}

// ─── Shared filter shape ──────────────────────────────────────────────────────

export interface TaxonomyFilters extends PaginationParams {
  isActive?: boolean;
}

export interface ExamFilters extends TaxonomyFilters {
  category?: string;      // filter exams by their parent category._id
}

export interface QuestionSetFilters extends TaxonomyFilters {
  exam?: string;          // filter question sets by their parent exam._id
}

// ─── categoriesApi ────────────────────────────────────────────────────────────

export const categoriesApi = {
  list: async (filters?: TaxonomyFilters) => {
    const { data } = await apiClient.get<{
      data: { categories: Category[] };
      pagination: PaginatedResponse<Category>['pagination'];
    }>('/categories', { params: filters });
    return { items: data.data.categories, pagination: data.pagination };
  },

  create: async (payload: Partial<Category>) => {
    const { data } = await apiClient.post<ApiResponse<{ category: Category }>>(
      '/categories',
      payload
    );
    return data.data.category;
  },

  update: async (id: string, payload: Partial<Category>) => {
    const { data } = await apiClient.patch<ApiResponse<{ category: Category }>>(
      `/categories/${id}`,
      payload
    );
    return data.data.category;
  },
};

// ─── subjectsApi ──────────────────────────────────────────────────────────────
// Subjects have NO category reference — they are global across all exams.

export const subjectsApi = {
  list: async (filters?: TaxonomyFilters) => {
    const { data } = await apiClient.get<{
      data: { subjects: Subject[] };
      pagination: PaginatedResponse<Subject>['pagination'];
    }>('/subjects', { params: filters });
    return { items: data.data.subjects, pagination: data.pagination };
  },

  get: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<{ subject: Subject }>>(`/subjects/${id}`);
    return data.data.subject;
  },

  create: async (payload: { name: string; nameBn?: string; description?: string; createdBy: string }) => {
    const { data } = await apiClient.post<ApiResponse<{ subject: Subject }>>('/subjects', payload);
    return data.data.subject;
  },

  update: async (id: string, payload: Partial<Pick<Subject, 'name' | 'nameBn' | 'description' | 'isActive' | 'displayOrder'>>) => {
    const { data } = await apiClient.patch<ApiResponse<{ subject: Subject }>>(
      `/subjects/${id}`,
      payload
    );
    return data.data.subject;
  },
};

// ─── examsApi ─────────────────────────────────────────────────────────────────
// Exams belong to a category.  Exam titles must be unique (identical name = same exam).

export const examsApi = {
  list: async (filters?: ExamFilters) => {
    const { data } = await apiClient.get<{
      data: { exams: Exam[] };
      pagination: PaginatedResponse<Exam>['pagination'];
    }>('/exams', { params: filters });
    return { items: data.data.exams, pagination: data.pagination };
  },

  get: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<{ exam: Exam }>>(`/exams/${id}`);
    return data.data.exam;
  },

  create: async (payload: {
    title: string;
    titleBn?: string;
    description?: string;
    year?: number;
    category: string;   // category._id — required
    pattern?: ExamPattern;
    language?: Exam['language'];
    createdBy: string;
  }) => {
    const { data } = await apiClient.post<ApiResponse<{ exam: Exam }>>('/exams', payload);
    return data.data.exam;
  },

  update: async (id: string, payload: Partial<Omit<Exam, '_id' | 'createdAt' | 'category'>> & { category?: string }) => {
    const { data } = await apiClient.patch<ApiResponse<{ exam: Exam }>>(`/exams/${id}`, payload);
    return data.data.exam;
  },
};

// ─── questionSetsApi ──────────────────────────────────────────────────────────
// Question sets belong to an exam.  Set title must be unique within that exam.

export const questionSetsApi = {
  list: async (filters?: QuestionSetFilters) => {
    const { data } = await apiClient.get<{
      data: { questionSets: QuestionSet[] };
      pagination: PaginatedResponse<QuestionSet>['pagination'];
    }>('/question-sets', { params: filters });
    return { items: data.data.questionSets, pagination: data.pagination };
  },

  get: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<{ questionSet: QuestionSet }>>(`/question-sets/${id}`);
    return data.data.questionSet;
  },

  create: async (payload: {
    title: string;
    titleBn?: string;
    exam: string;       // exam._id — required
    language?: QuestionSet['language'];
    createdBy: string;
  }) => {
    const { data } = await apiClient.post<ApiResponse<{ questionSet: QuestionSet }>>('/question-sets', payload);
    return data.data.questionSet;
  },

  update: async (id: string, payload: Partial<Omit<QuestionSet, '_id' | 'createdAt' | 'exam'>> & { exam?: string }) => {
    const { data } = await apiClient.patch<ApiResponse<{ questionSet: QuestionSet }>>(`/question-sets/${id}`, payload);
    return data.data.questionSet;
  },
};

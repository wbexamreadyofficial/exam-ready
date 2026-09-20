import { apiClient } from './client';
import type { ApiResponse } from '@/types/api';

/**
 * Admin catalog API (`/api/admin/catalog/*`). Every search, filter and page is
 * resolved by the backend; the UI only sends parameters. All routes are
 * admin-only on the server.
 */

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ListResult<T> {
  items: T[];
  pagination: Pagination;
}

export type Scope = 'categories' | 'subjects' | 'exams' | 'question-sets';
export type View = 'exams' | 'question-sets' | 'questions';
export type Language = 'EN' | 'BN' | 'BILINGUAL';
export type SetStatus = 'draft' | 'published' | 'archived';
export type QuestionStatus = 'pending' | 'approved' | 'rejected';

export interface NamedRef {
  _id: string;
  name: string;
}

export interface Counts {
  exams?: number;
  questionSets?: number;
  questions?: number;
}

export interface CategoryRow {
  _id: string;
  name: string;
  slug: string;
  fullForm?: string;
  description?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  counts: Required<Counts>;
}

export interface SubjectRow {
  _id: string;
  name: string;
  nameBn?: string;
  slug: string;
  description?: string;
  category: NamedRef | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  counts: Required<Counts>;
}

export interface ExamPattern {
  durationMinutes?: number;
  totalQuestions?: number;
  marksPerQuestion?: number;
  negativeMarksPerQuestion?: number;
  passingMarks?: number;
}

export interface ExamRow {
  _id: string;
  title: string;
  titleBn?: string;
  slug: string;
  description?: string;
  year?: number;
  category: NamedRef | null;
  language: Language;
  pattern?: ExamPattern;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  counts: { questionSets: number; questions: number };
}

export interface QuestionSetRow {
  _id: string;
  title: { en: string; bn?: string };
  slug: string;
  description?: string;
  category: NamedRef | null;
  exam: { _id: string; title: string } | null;
  status: SetStatus;
  isActive: boolean;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  language: Language;
  durationMinutes: number;
  marksPerQuestion: number;
  negativeMarksPerQuestion: number;
  totalMarks: number;
  passingMarks?: number;
  source: 'PDF_UPLOAD' | 'MANUAL' | 'SYSTEM_GENERATED';
  authorName?: string;
  attemptCount: number;
  publishedAt?: string;
  createdAt: string;
  questionCount: number;
  /** How many of the set's questions are approved. */
  approvedCount?: number;
}

export interface QuestionRow {
  _id: string;
  questionNumber?: number;
  questionText: { en?: string; bn?: string };
  topic?: string;
  chapter?: string;
  status: QuestionStatus;
  needsReview: boolean;
  hasAnswer: boolean;
  category: NamedRef | null;
  subject: NamedRef | null;
  exam: { _id: string; title: string } | null;
  questionSet: { _id: string; title: { en: string; bn?: string } } | null;
  createdAt: string;
}

export interface BilingualText {
  en?: string;
  bn?: string;
}

export interface QuestionDetail extends Omit<QuestionRow, 'hasAnswer'> {
  options: BilingualText[];
  correctOptionIndex?: number;
  explanation?: BilingualText;
  rejectionReason?: string;
  updatedAt: string;
}

export interface ScopeSummary {
  scope: Scope;
  id: string;
  name: string;
  subtitle: string | null;
  isActive: boolean;
  status?: SetStatus;
  parents: { label: string; id: string; name: string }[];
  counts: Required<Counts>;
}

export interface Option {
  id: string;
  label: string;
}

export type OptionType = 'categories' | 'exams' | 'question-sets' | 'subjects';

/** Query parameters accepted by every list endpoint; undefined values are dropped by axios. */
export interface CatalogListParams {
  search?: string;
  isActive?: string;
  status?: string;
  category?: string;
  subject?: string;
  exam?: string;
  questionSet?: string;
  language?: string;
  needsReview?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

interface ListResponse<T> extends ApiResponse<{ items: T[] }> {
  pagination: Pagination;
}

const BASE = '/admin/catalog';

async function list<T>(path: string, params?: CatalogListParams): Promise<ListResult<T>> {
  const { data } = await apiClient.get<ListResponse<T>>(`${BASE}${path}`, { params });
  return { items: data.data.items, pagination: data.pagination };
}

export interface SubjectEdit {
  name?: string;
  nameBn?: string;
  description?: string;
  category?: string | null;
  isActive?: boolean;
}

export interface ExamEdit {
  title?: string;
  titleBn?: string;
  description?: string;
  year?: number;
  language?: Language;
  category?: string;
  pattern?: ExamPattern;
  isActive?: boolean;
}

export interface QuestionSetEdit {
  title?: { en?: string; bn?: string };
  description?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  status?: SetStatus;
  isActive?: boolean;
}

export interface QuestionEdit {
  questionText?: BilingualText;
  options?: BilingualText[];
  correctOptionIndex?: number;
  explanation?: BilingualText;
  topic?: string;
  chapter?: string;
  status?: QuestionStatus;
  rejectionReason?: string;
}

/** What the approval dialog shows about a question set before anything is changed. */
export interface QuestionSetApprovalInfo {
  id: string;
  title: { en: string; bn?: string };
  description: string | null;
  status: SetStatus;
  category: string | null;
  exam: string | null;
  source: 'PDF_UPLOAD' | 'MANUAL' | 'SYSTEM_GENERATED';
  authorName: string | null;
  addedBy: string | null;
  addedAt: string;
  publishedAt: string | null;
  upload: {
    fileName: string | null;
    uploaderName: string | null;
    uploadedBy: string | null;
    uploadedAt: string | null;
    committedAt: string | null;
  } | null;
  questions: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    /** Cannot be approved yet — missing an answer or any text. */
    blocked: number;
    /** How many "approve all" would actually change. */
    approvable: number;
  };
}

export interface ApproveWholeSetResult extends ApproveSetResult {
  alreadyApproved: number;
  totalApproved: number;
  /** True when the set is now live for students. */
  published: boolean;
}

export interface ApproveSetResult {
  approved: number;
  skipped: number;
  details: { questionNumber: number | null; reason: string }[];
}

export const catalogApi = {
  categories: (params?: CatalogListParams) => list<CategoryRow>('/categories', params),
  subjects: (params?: CatalogListParams) => list<SubjectRow>('/subjects', params),
  exams: (params?: CatalogListParams) => list<ExamRow>('/exams', params),
  questionSets: (params?: CatalogListParams) => list<QuestionSetRow>('/question-sets', params),
  questions: (params?: CatalogListParams) => list<QuestionRow>('/questions', params),

  /** Header for a relation dialog: name, parents and how many records hang under it. */
  scopeSummary: async (scope: Scope, id: string): Promise<ScopeSummary> => {
    const { data } = await apiClient.get<ApiResponse<{ summary: ScopeSummary }>>(`${BASE}/${scope}/${id}`);
    return data.data.summary;
  },

  /** Records that belong to one category / subject / exam / question set. */
  scopeList: <T>(scope: Scope, id: string, view: View, params?: CatalogListParams) =>
    list<T>(`/${scope}/${id}/${view}`, params),

  /** id+label pairs for dropdowns. With `scope`, only records inside that scope are offered. */
  options: async (
    type: OptionType,
    params?: { scope?: Scope; scopeId?: string; category?: string; exam?: string; search?: string }
  ): Promise<Option[]> => {
    const { data } = await apiClient.get<ApiResponse<{ options: Option[] }>>(`${BASE}/options/${type}`, { params });
    return data.data.options;
  },

  question: async (id: string): Promise<QuestionDetail> => {
    const { data } = await apiClient.get<ApiResponse<{ question: QuestionDetail }>>(`${BASE}/questions/${id}`);
    return data.data.question;
  },

  updateSubject: async (id: string, payload: SubjectEdit) => {
    await apiClient.patch(`${BASE}/subjects/${id}`, payload);
  },
  updateExam: async (id: string, payload: ExamEdit) => {
    await apiClient.patch(`${BASE}/exams/${id}`, payload);
  },
  updateQuestionSet: async (id: string, payload: QuestionSetEdit) => {
    await apiClient.patch(`${BASE}/question-sets/${id}`, payload);
  },
  updateQuestion: async (id: string, payload: QuestionEdit) => {
    await apiClient.patch(`${BASE}/questions/${id}`, payload);
  },

  questionSetApprovalInfo: async (setId: string): Promise<QuestionSetApprovalInfo> => {
    const { data } = await apiClient.get<ApiResponse<{ info: QuestionSetApprovalInfo }>>(
      `${BASE}/question-sets/${setId}/approval-info`
    );
    return data.data.info;
  },

  /** Approves every ready question AND publishes the set so students can take it. */
  approveSet: async (setId: string): Promise<ApproveWholeSetResult> => {
    const { data } = await apiClient.post<ApiResponse<ApproveWholeSetResult>>(`${BASE}/question-sets/${setId}/approve`);
    return data.data;
  },

  /** Approves every question in the set that is ready; the rest are reported back. */
  approveQuestionSet: async (setId: string): Promise<ApproveSetResult> => {
    const { data } = await apiClient.post<ApiResponse<ApproveSetResult>>(
      `${BASE}/question-sets/${setId}/approve-questions`
    );
    return data.data;
  },
};

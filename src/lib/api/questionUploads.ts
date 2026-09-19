import axios from 'axios';
import { apiClient } from './client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api';
import type {
  ApiFailure,
  CommitPayload,
  NameCheckResult,
  NewQuestionInput,
  PatternInput,
  QuestionEditInput,
  QuestionUpload,
  ResolveInput,
  StepOptions,
  SubjectResolveInput,
  UploadStatus,
} from '@/types/questionUpload';

/**
 * The nine-step upload wizard.
 *
 * Every failure from this API carries both `message` and `messageBn`, so
 * `toFailure` preserves them instead of collapsing to a single string — the
 * wizard shows whichever matches the panel's current language.
 */
export function toFailure(error: unknown): ApiFailure {
  if (axios.isAxiosError<ApiFailure>(error)) {
    const body = error.response?.data;
    if (body?.message) {
      return { message: body.message, messageBn: body.messageBn, code: body.code };
    }
    if (error.code === 'ECONNABORTED') {
      return {
        message: 'The upload timed out. Check your connection and try again.',
        messageBn: 'আপলোডে সময় শেষ হয়ে গেছে। সংযোগ দেখে আবার চেষ্টা করুন।',
        code: 'TIMEOUT',
      };
    }
    if (!error.response) {
      return {
        message: 'Could not reach the server.',
        messageBn: 'সার্ভারে পৌঁছানো যায়নি।',
        code: 'NETWORK',
      };
    }
  }

  return {
    message: 'Something went wrong. Please try again.',
    messageBn: 'কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।',
  };
}

export interface UploadListFilters extends PaginationParams {
  status?: UploadStatus;
}

export const questionUploadsApi = {
  /** Step 3 — read, precheck and parse. Rejects a bad file with 422. */
  create: async (
    file: File,
    uploaderName: string,
    createdBy: string,
    onProgress?: (percent: number) => void
  ): Promise<QuestionUpload> => {
    const form = new FormData();
    form.append('file', file);
    form.append('uploaderName', uploaderName);
    form.append('createdBy', createdBy);

    const { data } = await apiClient.post<ApiResponse<{ upload: QuestionUpload }>>(
      '/question-uploads',
      form,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        // A 20 MB paper on a slow line needs far longer than the client's
        // 30-second default, and parsing happens inside this same request.
        timeout: 180_000,
        onUploadProgress: (event) => {
          if (event.total) onProgress?.(Math.round((event.loaded * 100) / event.total));
        },
      }
    );
    return data.data.upload;
  },

  get: async (uploadId: string): Promise<QuestionUpload> => {
    const { data } = await apiClient.get<ApiResponse<{ upload: QuestionUpload }>>(
      `/question-uploads/${uploadId}`
    );
    return data.data.upload;
  },

  /** What to show on the current step, plus the records that already match. */
  getStep: async (uploadId: string): Promise<StepOptions> => {
    const { data } = await apiClient.get<ApiResponse<StepOptions>>(
      `/question-uploads/${uploadId}/step`
    );
    return data.data;
  },

  list: async (filters?: UploadListFilters): Promise<{ items: QuestionUpload[]; pagination: PaginatedResponse<QuestionUpload>['pagination'] }> => {
    const { data } = await apiClient.get<{
      data: { uploads: QuestionUpload[] };
      pagination: PaginatedResponse<QuestionUpload>['pagination'];
    }>('/question-uploads', { params: filters });
    return { items: data.data.uploads ?? [], pagination: data.pagination };
  },

  /** Step 4. */
  resolveCategory: async (uploadId: string, input: ResolveInput, createdBy: string): Promise<QuestionUpload> => {
    const { data } = await apiClient.post<ApiResponse<{ upload: QuestionUpload }>>(
      `/question-uploads/${uploadId}/category`,
      { ...input, createdBy }
    );
    return data.data.upload;
  },

  /** Step 5 — every subject is decided in one call. */
  resolveSubjects: async (
    uploadId: string,
    subjects: SubjectResolveInput[],
    createdBy: string
  ): Promise<QuestionUpload> => {
    const { data } = await apiClient.post<ApiResponse<{ upload: QuestionUpload }>>(
      `/question-uploads/${uploadId}/subjects`,
      { subjects, createdBy }
    );
    return data.data.upload;
  },

  /** Step 6. */
  resolveExam: async (uploadId: string, input: ResolveInput, createdBy: string): Promise<QuestionUpload> => {
    const { data } = await apiClient.post<ApiResponse<{ upload: QuestionUpload }>>(
      `/question-uploads/${uploadId}/exam`,
      { ...input, createdBy }
    );
    return data.data.upload;
  },

  /** Step 7 — asks without saving, so the field can validate as it is typed. */
  checkName: async (uploadId: string, name: string): Promise<NameCheckResult> => {
    const { data } = await apiClient.post<ApiResponse<NameCheckResult>>(
      `/question-uploads/${uploadId}/check-name`,
      { name }
    );
    return data.data;
  },

  confirmName: async (uploadId: string, name: string, createdBy: string): Promise<QuestionUpload> => {
    const { data } = await apiClient.post<ApiResponse<{ upload: QuestionUpload }>>(
      `/question-uploads/${uploadId}/name`,
      { name, createdBy }
    );
    return data.data.upload;
  },

  /** Step 8 — accept the marking scheme; this fixes how many questions are needed. */
  confirmPattern: async (uploadId: string, input: PatternInput): Promise<QuestionUpload> => {
    const { data } = await apiClient.post<ApiResponse<{ upload: QuestionUpload }>>(
      `/question-uploads/${uploadId}/pattern`,
      input
    );
    return data.data.upload;
  },

  /** Step 9 — write a question the file did not contain. */
  addQuestion: async (uploadId: string, input: NewQuestionInput): Promise<QuestionUpload> => {
    const { data } = await apiClient.post<ApiResponse<{ upload: QuestionUpload }>>(
      `/question-uploads/${uploadId}/questions`,
      input
    );
    return data.data.upload;
  },

  /** Step 9 — fix a question inline, or drop it from the set. */
  editQuestion: async (
    uploadId: string,
    number: number,
    input: QuestionEditInput
  ): Promise<QuestionUpload> => {
    const { data } = await apiClient.patch<ApiResponse<{ upload: QuestionUpload }>>(
      `/question-uploads/${uploadId}/questions/${number}`,
      input
    );
    return data.data.upload;
  },

  /**
   * Steps 8+9 — the only call that actually creates DB records.
   *
   * Sends all resolved ObjectId references explicitly so the backend can:
   *   • create the questionsets document (name unique per exam)
   *   • write each question with subjectId, examId, questionSetId (all ObjectIds),
   *     questionSetUploadId, categoryId and createdBy — never a string name.
   */
  commit: async (
    uploadId: string,
    payload: CommitPayload
  ): Promise<{ _id: string; title: { en: string } }> => {
    const { data } = await apiClient.post<
      ApiResponse<{ questionSet: { _id: string; title: { en: string } } }>
    >(`/question-uploads/${uploadId}/commit`, {
      ...payload,
      /** The upload document _id IS the questionsetuploads._id.
       *  Sent redundantly so the backend never has to infer it. */
      questionSetUploadId: uploadId,
    });
    return data.data.questionSet;
  },

  cancel: async (uploadId: string): Promise<void> => {
    await apiClient.delete(`/question-uploads/${uploadId}`);
  },
};

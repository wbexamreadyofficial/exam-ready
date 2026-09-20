'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { questionUploadsApi, toFailure, type UploadListFilters } from '@/lib/api/questionUploads';
import type { CommitPayload } from '@/types/questionUpload';
import {
  categoriesApi,
  examsApi,
  questionSetsApi,
  subjectsApi,
  type ExamFilters,
  type QuestionSetFilters,
  type TaxonomyFilters,
} from '@/lib/api/taxonomy';
import { useLanguageStore } from '@/store/languageStore';
import { useAuthStore } from '@/store/authStore';
import type {
  NewQuestionInput,
  PatternInput,
  QuestionEditInput,
  ResolveInput,
  SubjectResolveInput,
} from '@/types/questionUpload';

/**
 * Picks the API's Bengali message when the panel is in Bengali.
 *
 * Errors are worded by the backend rather than the panel so the two never drift
 * apart — the API knows exactly which of the nine steps failed and why.
 */
function useApiMessage() {
  const language = useLanguageStore((s) => s.language);
  return (error: unknown) => {
    const failure = toFailure(error);
    return language === 'BN' && failure.messageBn ? failure.messageBn : failure.message;
  };
}

export function useUploadStep(uploadId: string | null) {
  return useQuery({
    queryKey: ['upload-step', uploadId],
    queryFn: () => questionUploadsApi.getStep(uploadId!),
    enabled: !!uploadId,
    // The wizard is the only writer, and every mutation returns the fresh
    // document, so background refetching would only cause flicker.
    refetchOnWindowFocus: false,
  });
}

export function useUploadList(filters?: UploadListFilters) {
  return useQuery({
    queryKey: ['uploads', filters],
    queryFn: () => questionUploadsApi.list(filters),
    select: (res) => res.items,
  });
}

/** Wraps every wizard mutation so each one refreshes the step and reports failures the same way. */
function useStepMutation<TArgs>(
  uploadId: string | null,
  run: (id: string, args: TArgs) => Promise<unknown>,
  successMessage?: string
) {
  const queryClient = useQueryClient();
  const messageOf = useApiMessage();

  return useMutation({
    mutationFn: (args: TArgs) => run(uploadId!, args),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['upload-step', uploadId] });
      if (successMessage) toast.success(successMessage);
    },
    onError: (error) => toast.error(messageOf(error)),
  });
}

export function useResolveCategory(uploadId: string | null) {
  const userId = useAuthStore((s) => s.user?.id ?? '');
  return useStepMutation<ResolveInput>(uploadId, (id, input) =>
    questionUploadsApi.resolveCategory(id, input, userId)
  );
}

export function useResolveSubjects(uploadId: string | null) {
  const userId = useAuthStore((s) => s.user?.id ?? '');
  return useStepMutation<SubjectResolveInput[]>(uploadId, (id, subjects) =>
    questionUploadsApi.resolveSubjects(id, subjects, userId)
  );
}

export function useResolveExam(uploadId: string | null) {
  const userId = useAuthStore((s) => s.user?.id ?? '');
  return useStepMutation<ResolveInput>(uploadId, (id, input) =>
    questionUploadsApi.resolveExam(id, input, userId)
  );
}

export function useConfirmName(uploadId: string | null) {
  const userId = useAuthStore((s) => s.user?.id ?? '');
  return useStepMutation<string>(uploadId, (id, name) =>
    questionUploadsApi.confirmName(id, name, userId)
  );
}

export function useConfirmPattern(uploadId: string | null) {
  return useStepMutation<PatternInput>(uploadId, (id, input) =>
    questionUploadsApi.confirmPattern(id, input)
  );
}

export function useAddQuestion(uploadId: string | null) {
  return useStepMutation<NewQuestionInput>(uploadId, (id, input) =>
    questionUploadsApi.addQuestion(id, input)
  );
}

export function useEditQuestion(uploadId: string | null) {
  return useStepMutation<{ number: number; input: QuestionEditInput }>(uploadId, (id, args) =>
    questionUploadsApi.editQuestion(id, args.number, args.input)
  );
}

/** Omit createdBy from the payload — the hook injects it from the auth store. */
export type CommitInput = Omit<CommitPayload, 'createdBy'>;

export function useCommitUpload(uploadId: string | null) {
  const queryClient = useQueryClient();
  const messageOf = useApiMessage();
  const userId = useAuthStore((s) => s.user?.id ?? '');

  return useMutation({
    mutationFn: (input: CommitInput) =>
      questionUploadsApi.commit(uploadId!, { ...input, createdBy: userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['upload-step', uploadId] });
      queryClient.invalidateQueries({ queryKey: ['uploads'] });
    },
    onError: (error) => toast.error(messageOf(error)),
  });
}

export function useCancelUpload() {
  const queryClient = useQueryClient();
  const messageOf = useApiMessage();

  return useMutation({
    mutationFn: (uploadId: string) => questionUploadsApi.cancel(uploadId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['uploads'] }),
    onError: (error) => toast.error(messageOf(error)),
  });
}

// ── pickers ──

export function useCategories(filters?: TaxonomyFilters) {
  return useQuery({
    queryKey: ['categories', filters],
    queryFn: () => categoriesApi.list(filters),
  });
}

export function useSubjects(filters?: TaxonomyFilters) {
  return useQuery({
    queryKey: ['subjects', filters],
    queryFn: () => subjectsApi.list(filters),
  });
}

export function useExams(filters?: ExamFilters) {
  return useQuery({
    queryKey: ['exams', filters],
    queryFn: () => examsApi.list(filters),
  });
}

export function useQuestionSets(filters?: QuestionSetFilters) {
  return useQuery({
    queryKey: ['question-sets', filters],
    queryFn: () => questionSetsApi.list(filters),
  });
}

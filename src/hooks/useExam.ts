'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { examsApi } from '@/lib/api/exams';
import { useExamStore } from '@/store/examStore';

export function useExamDetail(examId: string) {
  return useQuery({
    queryKey: ['exam', examId],
    queryFn: () => examsApi.getExam(examId),
    enabled: !!examId,
  });
}

export function useExamQuestions(examId: string, sessionId: string | null) {
  return useQuery({
    queryKey: ['exam-questions', examId, sessionId],
    queryFn: () => examsApi.getExamQuestions(examId, sessionId!),
    enabled: !!examId && !!sessionId,
    staleTime: Infinity,
  });
}

export function useStartExam() {
  const { initSession } = useExamStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (examId: string) => examsApi.startExam(examId),
    onSuccess: (session, examId) => {
      initSession(session.sessionId, examId, session.serverDuration);
      router.push(`/student/exam/${examId}`);
    },
    onError: () => {
      toast.error('Failed to start exam. Please try again.');
    },
  });
}

export function useSubmitExam() {
  const { resetSession } = useExamStore();
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      examId,
      sessionId,
      answers,
    }: {
      examId: string;
      sessionId: string;
      answers: Record<string, string>;
    }) => examsApi.submitExam(examId, sessionId, answers),
    onSuccess: ({ resultId }, { examId }) => {
      resetSession();
      router.push(`/student/exam/${examId}/result?resultId=${resultId}`);
    },
    onError: () => {
      toast.error('Submission failed. Please try again.');
    },
  });
}

export function useExamsList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['exams', params],
    queryFn: () => examsApi.getExams(params as Parameters<typeof examsApi.getExams>[0]),
  });
}

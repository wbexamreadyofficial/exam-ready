import { apiClient } from './client';
import type { ApiResponse } from '@/types/api';

export type Bilingual = { en?: string; bn?: string };

export interface MyProgress {
  attempts: number;
  bestScore?: number;
  latestAttemptId?: string;
  inProgressAttemptId?: string;
}

export interface TestExam {
  _id: string;
  title: string;
  titleBn?: string;
  description?: string;
  year?: number;
  category: { _id: string; name: string } | null;
  language: 'EN' | 'BN' | 'BILINGUAL';
  pattern?: {
    durationMinutes?: number;
    totalQuestions?: number;
    negativeMarksPerQuestion?: number;
  };
  testCount: number;
}

export interface TestExamList {
  exams: TestExam[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface TestSetSummary {
  _id: string;
  title: Bilingual;
  description?: string;
  durationMinutes: number;
  questionCount: number;
  marksPerQuestion: number;
  negativeMarksPerQuestion: number;
  totalMarks: number;
  language: 'EN' | 'BN' | 'BILINGUAL';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  attemptCount: number;
  my: MyProgress;
}

export interface ExamWithSets {
  exam: {
    _id: string;
    title: string;
    titleBn?: string;
    description?: string;
    year?: number;
    category: { _id: string; name: string } | null;
  };
  sets: TestSetSummary[];
}

export interface TestInstructions {
  _id: string;
  title: Bilingual;
  exam: { _id: string; title: string; titleBn?: string };
  description?: string;
  durationMinutes: number;
  questionCount: number;
  marksPerQuestion: number;
  negativeMarksPerQuestion: number;
  totalMarks: number;
  language: 'EN' | 'BN' | 'BILINGUAL';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  my: MyProgress;
}

export interface AttemptQuestion {
  _id: string;
  number: number;
  questionText: Bilingual;
  options: Bilingual[];
  subject?: { _id: string; name: string } | null;
}

export interface SavedAnswer {
  questionId: string;
  selectedOptionIndex: number | null;
  timeSpentSeconds: number;
  markedForReview: boolean;
}

export interface AttemptPayload {
  attemptId: string;
  title?: Bilingual;
  serverNow: string;
  startedAt: string;
  expiresAt: string;
  durationMinutes: number;
  marksPerQuestion: number;
  negativeMarksPerQuestion: number;
  totalMarks: number;
  questions: AttemptQuestion[];
  answers: SavedAnswer[];
}

export type AttemptState = ({ status: 'in-progress' } & AttemptPayload) | { status: 'submitted'; attemptId: string };

export interface AnswerInput {
  questionId: string;
  selectedOptionIndex: number | null;
  timeSpentSeconds: number;
  markedForReview: boolean;
}

export type SolutionState = 'correct' | 'wrong' | 'unattempted';

export interface Solution {
  number: number;
  questionId: string;
  questionText: Bilingual;
  options: Bilingual[];
  subject?: { _id: string; name: string } | null;
  topic?: string;
  explanation?: Bilingual;
  correctOptionIndex: number;
  selectedOptionIndex: number | null;
  timeSpentSeconds: number;
  state: SolutionState;
}

export interface TestResult {
  attemptId: string;
  questionSetId: string;
  title?: Bilingual;
  exam?: { _id: string; title: string };
  submittedAt: string;
  timeTakenSeconds: number;
  durationMinutes: number;
  marksPerQuestion: number;
  negativeMarksPerQuestion: number;
  summary: {
    score: number;
    totalMarks: number;
    totalQuestions: number;
    correct: number;
    wrong: number;
    unattempted: number;
    attempted: number;
    accuracy: number;
  };
  comparison: {
    rank: number | null;
    participants: number;
    percentile: number;
    averageScore: number;
    topScore: number;
  };
  solutions: Solution[];
}

export interface LeaderboardData {
  participants: number;
  entries: {
    rank: number;
    name: string;
    profilePhoto?: string;
    score: number;
    timeTakenSeconds: number;
    isMe: boolean;
  }[];
  me: { rank: number; score: number; timeTakenSeconds: number } | null;
}

export interface MyAttemptRow {
  _id: string;
  questionSet: { _id: string; title: Bilingual } | null;
  exam: { _id: string; title: string } | null;
  score: number;
  totalMarks: number;
  correctCount: number;
  wrongCount: number;
  unattemptedCount: number;
  timeTakenSeconds: number;
  submittedAt: string;
}

export interface InProgressAttempt {
  _id: string;
  questionSet: { _id: string; title: Bilingual } | null;
  exam: { _id: string; title: string } | null;
  startedAt: string;
  expiresAt: string;
  durationMinutes: number;
  totalQuestions: number;
  answeredCount: number;
}

export interface MyAttemptsData {
  serverNow: string;
  inProgress: InProgressAttempt[];
  attempts: MyAttemptRow[];
}

const BASE = '/student/tests';

const unwrap = async <T>(request: Promise<{ data: ApiResponse<T> }>): Promise<T> => (await request).data.data;

/** Wraps the backend's `/api/student/tests` routes (exam → published sets → attempt → result). */
export const studentTestsApi = {
  exams: (params?: { search?: string; category?: string; page?: number; limit?: number }) =>
    unwrap<TestExamList>(apiClient.get(`${BASE}/exams`, { params })),

  examSets: (examId: string) => unwrap<ExamWithSets>(apiClient.get(`${BASE}/exams/${examId}/sets`)),

  instructions: (setId: string) => unwrap<TestInstructions>(apiClient.get(`${BASE}/sets/${setId}`)),

  attempt: (attemptId: string) => unwrap<AttemptState>(apiClient.get(`${BASE}/attempts/${attemptId}`)),

  start: (setId: string) => unwrap<AttemptPayload>(apiClient.post(`${BASE}/sets/${setId}/start`, {})),

  saveAnswers: (attemptId: string, answers: AnswerInput[]) =>
    unwrap<{ savedAt: string; expiresAt: string }>(apiClient.put(`${BASE}/attempts/${attemptId}/answers`, { answers })),

  submit: (attemptId: string, answers: AnswerInput[]) =>
    unwrap<{ attemptId: string; status: string; score: number; totalMarks: number }>(
      apiClient.post(`${BASE}/attempts/${attemptId}/submit`, { answers })
    ),

  result: (attemptId: string) => unwrap<TestResult>(apiClient.get(`${BASE}/attempts/${attemptId}/result`)),

  leaderboard: (setId: string) => unwrap<LeaderboardData>(apiClient.get(`${BASE}/sets/${setId}/leaderboard`)),

  myAttempts: () => unwrap<MyAttemptsData>(apiClient.get(`${BASE}/attempts`)),
};

export const bilingual = (text?: Bilingual, prefer: 'en' | 'bn' = 'en'): string => {
  if (!text) return '';
  return (prefer === 'bn' ? text.bn || text.en : text.en || text.bn) ?? '';
};

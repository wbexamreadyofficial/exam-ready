import type { SubjectStat, TrendPoint, TrendRange } from '@/lib/api/studentDashboard';

export interface ProgressAttemptRow {
  attemptId: string;
  examTitle: string;
  setTitle: string;
  submittedAt: string | null;
  score: number;
  totalMarks: number;
  percentage: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  unattemptedCount: number;
  timeTakenSeconds: number;
  /** null when the question set has no configured passing marks. */
  passed: boolean | null;
}

export interface ProgressReportUser {
  _id: string;
  fullName?: string;
  email?: string;
  mobileNumber?: string;
  profilePhoto?: string;
}

export interface ProgressReportStats {
  testsAttempted: number;
  testsThisWeek: number;
  averageScore: number;
  averageScoreChange: number | null;
  bestScore: number;
  globalRank: number | null;
  rankedStudents: number;
  accuracy: number;
}

/** GET /api/users/:userId/progress (Admin only). */
export interface ProgressReportResult {
  user: ProgressReportUser;
  stats: ProgressReportStats;
  trend: Record<TrendRange, TrendPoint[]>;
  subjects: SubjectStat[];
  streak: { count: number };
  preparation: { studySeconds: number; testsTaken: number; topicsPracticed: number; accuracy: number; bestScore: number };
  history: {
    items: ProgressAttemptRow[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProgressHistoryParams {
  page?: number;
  limit?: number;
}

import { apiClient } from './client';
import type { ApiResponse } from '@/types/api';

export type TrendRange = '7d' | '30d' | '3m' | 'all';

export interface TrendPoint {
  date: string;
  score: number;
  tests: number;
}

export interface SubjectStat {
  name: string;
  attempted: number;
  correct: number;
  accuracy: number;
}

export type DayStatus = 'completed' | 'missed' | 'today' | 'upcoming';

export type ContinueStatus = 'in-progress' | 'attempt-again' | 'new';

export interface ContinueCard {
  id: string;
  status: ContinueStatus;
  setId: string;
  attemptId?: string;
  title: string;
  category: string;
  questionCount: number;
  durationMinutes: number;
  progress?: number;
  score?: number;
  expiresAt?: string;
}

export interface BoardEntry {
  rank: number;
  name: string;
  profilePhoto?: string;
  score: number;
  isCurrentUser: boolean;
}

export interface Board {
  participants: number;
  entries: BoardEntry[];
}

export interface StudentDashboardData {
  generatedAt: string;
  stats: {
    testsAttempted: number;
    testsThisWeek: number;
    averageScore: number;
    averageScoreChange: number | null;
    bestScore: number;
    globalRank: number | null;
    rankedStudents: number;
    accuracy: number;
  };
  trend: Record<TrendRange, TrendPoint[]>;
  subjects: SubjectStat[];
  performance: { overallScore: number; correct: number; wrong: number; attempted: number };
  streak: { count: number; days: { day: string; status: DayStatus }[] };
  dailyGoal: { completed: number; target: number };
  continue: ContinueCard[];
  leaderboard: { weekly: Board; monthly: Board; allTime: Board };
  topExams: { id: string; name: string; attempts: number }[];
  preparation: { studySeconds: number; testsTaken: number; topicsPracticed: number; accuracy: number; bestScore: number };
}

export const studentDashboardApi = {
  get: async (): Promise<StudentDashboardData> => {
    const { data } = await apiClient.get<ApiResponse<StudentDashboardData>>('/student/dashboard');
    return data.data;
  },
};

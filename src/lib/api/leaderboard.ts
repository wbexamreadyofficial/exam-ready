import { apiClient } from './client';
import type { PaginatedResponse, PaginationParams } from '@/types/api';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  score: number;
  accuracy: number;
  attempts: number;
  district?: string;
}

export type LeaderboardPeriod = 'global' | 'weekly' | 'monthly';

export const leaderboardApi = {
  getLeaderboard: async (
    period: LeaderboardPeriod = 'global',
    params?: PaginationParams
  ): Promise<PaginatedResponse<LeaderboardEntry>> => {
    const { data } = await apiClient.get<PaginatedResponse<LeaderboardEntry>>(
      '/leaderboard',
      { params: { period, ...params } }
    );
    return data;
  },

  getExamLeaderboard: async (
    examId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<LeaderboardEntry>> => {
    const { data } = await apiClient.get<PaginatedResponse<LeaderboardEntry>>(
      `/exams/${examId}/leaderboard`,
      { params }
    );
    return data;
  },

  getMyRank: async (): Promise<{ rank: number; totalParticipants: number }> => {
    const { data } = await apiClient.get<{ data: { rank: number; totalParticipants: number } }>('/leaderboard/my-rank');
    return data.data;
  },
};

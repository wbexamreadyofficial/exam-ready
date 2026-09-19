import { apiClient } from './client';
import type { ApiResponse } from '@/types/api';
import type {
  ActivityListParams,
  AuditLogEntry,
  PaginationMeta,
  SecurityEventEntry,
} from '@/types/user';

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalExams: number;
  publishedExams: number;
  totalQuestions: number;
  totalAttempts: number;
  totalRevenue: number;
  newUsersToday: number;
  attemptsToday: number;
}

/** GET /api/admin/dashboard — live user and category stats. */
export interface DashboardStats {
  users: {
    total: number;
    active: number;
    inactive: number;
    newToday: number;
    byRole: Record<'student' | 'examiner' | 'partner' | 'admin', { total: number; active: number }>;
  };
  categories: { total: number; active: number; inactive: number };
  /** Zero-filled daily sign-ups, oldest first. `date` is YYYY-MM-DD in the requested time zone. */
  registrations: { date: string; count: number }[];
}

export interface SubjectItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  questionCount: number;
  examCount: number;
  createdAt: string;
}

interface PaginatedApiResponse<T> extends ApiResponse<T> {
  pagination: PaginationMeta;
}

export const adminApi = {
  /** GET /api/admin/audit-logs — who did what to which user. */
  getAuditLogs: async (
    params: ActivityListParams
  ): Promise<{ logs: AuditLogEntry[]; pagination: PaginationMeta }> => {
    const { filter, ...rest } = params;
    const { data } = await apiClient.get<PaginatedApiResponse<{ logs: AuditLogEntry[] }>>(
      '/admin/audit-logs',
      { params: { ...rest, action: filter } }
    );
    return { logs: data.data.logs, pagination: data.pagination };
  },

  /** GET /api/admin/security-events — sign-in attempts that match no account. */
  getSecurityEvents: async (
    params: ActivityListParams
  ): Promise<{ events: SecurityEventEntry[]; pagination: PaginationMeta }> => {
    const { filter, ...rest } = params;
    const { data } = await apiClient.get<PaginatedApiResponse<{ events: SecurityEventEntry[] }>>(
      '/admin/security-events',
      { params: { ...rest, type: filter } }
    );
    return { events: data.data.events, pagination: data.pagination };
  },

  /** Admin only. `timeZone` (IANA) decides what counts as "today" and the daily buckets. */
  getDashboard: async (params: { days?: number; timeZone?: string } = {}): Promise<DashboardStats> => {
    const { data } = await apiClient.get<ApiResponse<DashboardStats>>('/admin/dashboard', {
      params: { days: params.days, timezone: params.timeZone },
    });
    return data.data;
  },

  getStats: async (): Promise<AdminStats> => {
    const { data } = await apiClient.get<ApiResponse<AdminStats>>('/admin/stats');
    return data.data;
  },

  getUserGrowth: async (days = 30): Promise<{ date: string; count: number }[]> => {
    const { data } = await apiClient.get<ApiResponse<{ date: string; count: number }[]>>(
      '/admin/analytics/user-growth',
      { params: { days } }
    );
    return data.data;
  },

  getExamAttempts: async (days = 30): Promise<{ date: string; count: number }[]> => {
    const { data } = await apiClient.get<ApiResponse<{ date: string; count: number }[]>>(
      '/admin/analytics/exam-attempts',
      { params: { days } }
    );
    return data.data;
  },

  getSubjects: async (): Promise<SubjectItem[]> => {
    const { data } = await apiClient.get<ApiResponse<SubjectItem[]>>('/admin/subjects');
    return data.data;
  },

  createSubject: async (payload: Partial<SubjectItem>): Promise<SubjectItem> => {
    const { data } = await apiClient.post<ApiResponse<SubjectItem>>('/admin/subjects', payload);
    return data.data;
  },

  updateSubject: async (id: string, payload: Partial<SubjectItem>): Promise<SubjectItem> => {
    const { data } = await apiClient.put<ApiResponse<SubjectItem>>(`/admin/subjects/${id}`, payload);
    return data.data;
  },

  deleteSubject: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/subjects/${id}`);
  },

  // OCR / AI
  initiateOcr: async (fileKey: string, fileType: 'pdf' | 'image'): Promise<{ jobId: string }> => {
    const { data } = await apiClient.post<ApiResponse<{ jobId: string }>>('/admin/ocr/initiate', {
      fileKey,
      fileType,
    });
    return data.data;
  },

  getOcrJob: async (jobId: string): Promise<{
    status: 'pending' | 'processing' | 'completed' | 'failed';
    questions?: Array<{ text: string; options: string[]; correctIndex: number; explanation?: string }>;
    error?: string;
  }> => {
    const { data } = await apiClient.get(`/admin/ocr/jobs/${jobId}`);
    return data.data;
  },
};

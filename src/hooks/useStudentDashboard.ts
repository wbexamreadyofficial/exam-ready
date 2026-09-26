'use client';

import { useQuery } from '@tanstack/react-query';
import { studentDashboardApi } from '@/lib/api/studentDashboard';

export const STUDENT_DASHBOARD_KEY = ['student', 'dashboard'] as const;

/** One request feeds every dashboard widget; React Query shares it, so each widget can call this hook. */
export function useStudentDashboard() {
  return useQuery({
    queryKey: STUDENT_DASHBOARD_KEY,
    queryFn: studentDashboardApi.get,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}

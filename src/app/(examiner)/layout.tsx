'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ExaminerLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="examiner" redirectTo="/login">
      {children}
    </ProtectedRoute>
  );
}

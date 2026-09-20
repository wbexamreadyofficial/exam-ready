'use client';

import * as React from 'react';
import { ChevronRight, Award, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useStudentDashboard } from '@/hooks/useStudentDashboard';

export default function TopExams() {
  const { data, isLoading } = useStudentDashboard();
  const exams = data?.topExams ?? [];

  return (
    <Card className="surface-card">
      <CardHeader className="p-4 pb-1">
        <CardTitle className="flex items-center gap-2 text-base">
          Top Exams
          <Award className="h-4 w-4 text-[#e2691f]" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-9 w-full rounded-lg" />
            ))}
          </div>
        ) : exams.length === 0 ? (
          <p className="pb-2 text-center text-xs text-[var(--color-muted-foreground)]">Popular exams will appear here.</p>
        ) : (
          <div className="space-y-1">
            {exams.map((exam) => (
              <Link
                key={exam.id}
                href={`/student/mock-tests/${exam.id}`}
                className="flex items-center gap-2.5 py-1.5 px-2.5 rounded-lg hover:bg-[var(--color-surface-muted)] transition-colors group cursor-pointer"
              >
                <GraduationCap className="h-4 w-4 shrink-0 text-[#e2691f]" />
                <span className="truncate text-sm font-medium text-[var(--color-ink-700)] group-hover:text-[var(--color-ink-900)] transition-colors">
                  {exam.name}
                </span>
                <ChevronRight className="h-3.5 w-3.5 ml-auto shrink-0 text-[var(--color-muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

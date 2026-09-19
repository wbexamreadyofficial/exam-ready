'use client';

import { useQuery } from '@tanstack/react-query';
import { FileText, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { resultsApi } from '@/lib/api/results';
import { formatPercentage, formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';

const MOCK_RESULTS = [
  { id: 'res1', examTitle: 'WBCS Preliminary Mock #11', examCategory: 'WBCS', obtainedMarks: 142, totalMarks: 200, percentage: 71.0, submittedAt: new Date().toISOString() },
  { id: 'res2', examTitle: 'WBPSC Clerkship Mock Test', examCategory: 'WBPSC', obtainedMarks: 84, totalMarks: 100, percentage: 84.0, submittedAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'res3', examTitle: 'SSC CGL Tier 1 Practice Set', examCategory: 'SSC', obtainedMarks: 58, totalMarks: 100, percentage: 58.0, submittedAt: new Date(Date.now() - 86400000 * 5).toISOString() },
];

export default function ResultsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-results'],
    queryFn: () => resultsApi.getMyResults({ page: 1, limit: 20 }),
  });

  const list = data?.data && data.data.length > 0 ? data.data : MOCK_RESULTS;

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-black mb-2">My Test Attempts</h1>
      <p className="text-sm text-[var(--color-muted-foreground)] mb-6">Review your historical exam performance and answer keys</p>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
      ) : list.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No exams attempted yet"
          description="Attempt a mock exam to view your detailed result analytics."
          action={{ label: 'Explore Exams', onClick: () => window.location.href = '/exams' }}
        />
      ) : (
        <div className="space-y-3">
          {list.map((result) => (
            <Card key={result.id} className="card-hover">
              <CardContent className="p-5 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-[10px]">{result.examCategory}</Badge>
                    <span className="text-xs text-[var(--color-muted-foreground)]">{formatRelativeTime(result.submittedAt)}</span>
                  </div>
                  <p className="font-bold text-base truncate">{result.examTitle}</p>
                </div>
                <div className="text-right flex items-center gap-4">
                  <div>
                    <p className="font-black text-xl">{formatPercentage(result.percentage)}</p>
                    <p className="text-xs text-[var(--color-muted-foreground)]">{result.obtainedMarks} / {result.totalMarks} pts</p>
                  </div>
                  <Badge variant={result.percentage >= 60 ? 'success' : 'destructive'} className="hidden sm:inline-flex">
                    {result.percentage >= 60 ? 'Passed' : 'Failed'}
                  </Badge>
                  <Button size="icon" variant="ghost" asChild>
                    <Link href={`/student/exam/${result.id}/result`} aria-label="View result details">
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

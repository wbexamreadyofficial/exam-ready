'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  Award,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ClipboardList,
  FileQuestion,
  Percent,
  Trophy,
  UserRound,
  XCircle,
} from 'lucide-react';

import { KpiCard, KpiCardSkeleton } from '@/components/admin/KpiCard';
import { ProgressSubjectChart } from '@/components/admin/ProgressSubjectChart';
import { ProgressTrendChart } from '@/components/admin/ProgressTrendChart';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TablePagination } from '@/components/ui/table-pagination';

import { usersApi } from '@/lib/api/users';
import { ELEVATED_CARD } from '@/lib/constants';
import { formatDuration } from '@/lib/utils';
import { formatDate, formatDateTime } from '@/lib/userFormat';
import { cn } from '@/lib/utils';

const PAGE_SIZE_OPTIONS = [10, 25, 50];

function HistoryTableSkeleton({ rows }: { rows: number }) {
  return (
    <div aria-busy="true" aria-label="Loading exam history">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Exam</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Correct / Wrong / Skipped</TableHead>
            <TableHead>Time taken</TableHead>
            <TableHead>Result</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, index) => (
            <TableRow key={index} className="hover:bg-transparent">
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-48" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function UserProgressReportPage() {
  const { userId } = useParams<{ userId: string }>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  const { data, isLoading, isError, error, isPlaceholderData, refetch } = useQuery({
    queryKey: ['admin-user-progress', userId, { page, limit: pageSize }],
    queryFn: () => usersApi.getUserProgress(userId, { page, limit: pageSize }),
    enabled: !!userId,
    placeholderData: (previous) => previous,
    retry: (failureCount, err) => {
      const status = (err as { response?: { status?: number } })?.response?.status;
      return status !== 404 && failureCount < 1;
    },
  });

  const notFound = (error as { response?: { status?: number } } | null)?.response?.status === 404;
  const user = data?.user;
  const userName = user ? user.fullName || user.email || user.mobileNumber || 'this user' : undefined;

  const history = data?.history;
  const items = history?.items ?? [];
  const totalItems = history?.total ?? 0;
  const totalPages = history?.totalPages ?? 1;
  const currentPage = history?.page ?? page;

  const backLink = (
    <Link
      href={`/admin/users/${userId}`}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-cta)]"
    >
      <ArrowLeft className="h-4 w-4" /> Back to {userName ?? 'user'}
    </Link>
  );

  if (isError && !data) {
    return (
      <div className="space-y-6">
        {backLink}
        <Card className={ELEVATED_CARD}>
          {notFound ? (
            <EmptyState
              icon={UserRound}
              title="User not found"
              description="This account doesn't exist or may have been removed."
              className="py-20"
            />
          ) : (
            <ErrorState message="Could not load the progress report." onRetry={() => refetch()} className="py-20" />
          )}
        </Card>
      </div>
    );
  }

  const stats = data?.stats;
  const preparation = data?.preparation;

  return (
    <div className="space-y-6">
      {backLink}

      <PageHeader
        title="Progress Report"
        description={userName ? `Test performance and exam history for ${userName}` : 'Test performance and exam history'}
        actions={
          <Button asChild variant="outline" className="gap-2">
            <Link href={`/admin/users/${userId}`}>
              <UserRound className="h-4 w-4" /> View profile
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {!stats ? (
          Array.from({ length: 6 }).map((_, index) => <KpiCardSkeleton key={index} />)
        ) : (
          <>
            <KpiCard
              icon={ClipboardList}
              label="Tests attempted"
              value={stats.testsAttempted.toLocaleString('en-IN')}
              sub={`${stats.testsThisWeek} this week`}
              tone="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            />
            <KpiCard
              icon={Percent}
              label="Average score"
              value={`${stats.averageScore}%`}
              sub={
                stats.averageScoreChange === null
                  ? undefined
                  : `${stats.averageScoreChange >= 0 ? '+' : ''}${stats.averageScoreChange}% vs last week`
              }
              tone="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
            />
            <KpiCard
              icon={Trophy}
              label="Best score"
              value={`${stats.bestScore}%`}
              tone="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
            />
            <KpiCard
              icon={CheckCircle2}
              label="Accuracy"
              value={`${stats.accuracy}%`}
              sub="Correct out of attempted questions"
              tone="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
            />
            <KpiCard
              icon={Award}
              label="Global rank"
              value={stats.globalRank ? `#${stats.globalRank}` : '—'}
              sub={stats.rankedStudents ? `out of ${stats.rankedStudents.toLocaleString('en-IN')} students` : undefined}
              tone="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
            />
            <KpiCard
              icon={Clock}
              label="Total study time"
              value={preparation ? formatDuration(preparation.studySeconds) : '—'}
              sub="Across all submitted tests"
              tone="bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {data ? <ProgressTrendChart trend={data.trend} /> : <Skeleton className={cn('h-[300px] rounded-xl', ELEVATED_CARD)} />}
        </div>
        {data ? <ProgressSubjectChart subjects={data.subjects} /> : <Skeleton className={cn('h-[300px] rounded-xl', ELEVATED_CARD)} />}
      </div>

      <Card className={ELEVATED_CARD}>
        <CardContent className="p-0">
          {isLoading || isPlaceholderData ? (
            <HistoryTableSkeleton rows={Math.min(pageSize, 10)} />
          ) : totalItems === 0 ? (
            <EmptyState
              icon={FileQuestion}
              title="No exams submitted yet"
              description="Every test this student submits will show up here."
              className="py-16"
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Exam</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Correct / Wrong / Skipped</TableHead>
                    <TableHead>Time taken</TableHead>
                    <TableHead>Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((row) => (
                    <TableRow key={row.attemptId}>
                      <TableCell>
                        <p className="text-sm font-semibold">{row.submittedAt ? formatDate(row.submittedAt) : '—'}</p>
                        <p className="text-xs text-[var(--color-muted-foreground)]">
                          {row.submittedAt ? formatDateTime(row.submittedAt) : ''}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="max-w-64 truncate text-sm font-medium" title={row.examTitle}>
                          {row.examTitle}
                        </p>
                        <p className="max-w-64 truncate text-xs text-[var(--color-muted-foreground)]" title={row.setTitle}>
                          {row.setTitle}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-semibold tabular-nums">
                          {row.score} / {row.totalMarks}
                        </p>
                        <p className="text-xs text-[var(--color-muted-foreground)]">{row.percentage}%</p>
                      </TableCell>
                      <TableCell className="text-sm tabular-nums">
                        <span className="text-emerald-600 dark:text-emerald-400">{row.correctCount}</span>
                        {' / '}
                        <span className="text-red-600 dark:text-red-400">{row.wrongCount}</span>
                        {' / '}
                        <span className="text-[var(--color-muted-foreground)]">{row.unattemptedCount}</span>
                      </TableCell>
                      <TableCell className="text-sm">{formatDuration(row.timeTakenSeconds)}</TableCell>
                      <TableCell>
                        {row.passed === null ? (
                          <Badge variant="secondary" className="text-[10px]">{row.percentage}%</Badge>
                        ) : row.passed ? (
                          <Badge variant="success" className="gap-1 text-[10px]">
                            <CheckCircle2 className="h-3 w-3" /> Pass
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1 text-[10px]">
                            <XCircle className="h-3 w-3" /> Fail
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <TablePagination
                page={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={pageSize}
                pageSizeOptions={PAGE_SIZE_OPTIONS}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setPage(1);
                }}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

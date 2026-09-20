'use client';

import { use } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, BarChart3, Clock, FileQuestion, MinusCircle, PlayCircle, Trophy, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import { bilingual, studentTestsApi, type TestSetSummary } from '@/lib/api/studentTests';
import { cn } from '@/lib/utils';

const ORANGE_BUTTON =
  'border-0 bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] font-semibold text-white shadow-md shadow-orange-600/30 ring-1 ring-inset ring-white/25 transition-all hover:-translate-y-px hover:bg-transparent hover:brightness-110 hover:shadow-lg hover:shadow-orange-600/40';

const DIFFICULTY: Record<TestSetSummary['difficulty'], string> = {
  EASY: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-300 dark:border-green-400/25',
  MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-400/25',
  HARD: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-400/25',
};

function Stat({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-center gap-1.5" title={label}>
      <Icon className="h-3.5 w-3.5 shrink-0 text-[#e2691f]" />
      <span className="truncate text-xs font-semibold">{value}</span>
    </div>
  );
}

function SetCard({ set }: { set: TestSetSummary }) {
  const { my } = set;
  const resuming = Boolean(my.inProgressAttemptId);
  const label = resuming ? 'Resume test' : my.attempts > 0 ? 'Reattempt' : 'Start test';

  return (
    <Card className="group flex h-full flex-col overflow-hidden border-orange-200/60 bg-gradient-to-b from-orange-50/50 to-white transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/15 dark:border-orange-400/20 dark:from-orange-500/10 dark:to-transparent">
      <CardContent className="flex h-full flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className={cn('rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide', DIFFICULTY[set.difficulty])}>
            {set.difficulty.toLowerCase()}
          </span>
          {resuming && (
            <span className="rounded-full border border-orange-300 bg-orange-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[#b9450d] dark:bg-orange-500/20 dark:text-orange-300">
              In progress
            </span>
          )}
          {!resuming && my.attempts > 0 && (
            <span className="flex items-center gap-1 text-[12px] font-semibold text-[var(--color-muted-foreground)]">
              <Trophy className="h-3.5 w-3.5 text-[#e2691f]" />
              Best {my.bestScore} / {set.totalMarks}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <h2 className="text-base font-bold leading-snug tracking-tight">{bilingual(set.title)}</h2>
          {set.title.bn && set.title.en && set.title.bn !== set.title.en && (
            <p className="mt-0.5 truncate text-xs text-[var(--color-muted-foreground)]">{set.title.bn}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-2 rounded-lg border border-orange-200/60 bg-white/70 px-3 py-2.5 dark:border-orange-400/15 dark:bg-white/5">
          <Stat icon={FileQuestion} label="Questions" value={`${set.questionCount} questions`} />
          <Stat icon={Clock} label="Duration" value={`${set.durationMinutes} min`} />
          <Stat icon={Trophy} label="Marks" value={`${set.totalMarks} marks`} />
          <Stat
            icon={MinusCircle}
            label="Negative marking"
            value={set.negativeMarksPerQuestion > 0 ? `−${set.negativeMarksPerQuestion} per wrong` : 'No negative'}
          />
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-orange-200/60 pt-3 dark:border-orange-400/15">
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-muted-foreground)]">
            <Users className="h-3 w-3 text-[#e2691f]" />
            {set.attemptCount.toLocaleString()} {set.attemptCount === 1 ? 'attempt' : 'attempts'}
          </span>
          <div className="flex items-center gap-2">
            {my.latestAttemptId && !resuming && (
              <Button asChild variant="outline" size="sm" className="gap-1.5 hover:border-orange-300 hover:bg-orange-50 hover:text-[#c95817]">
                <Link href={`/student/tests/result/${my.latestAttemptId}`}>
                  <BarChart3 className="h-4 w-4" /> Result
                </Link>
              </Button>
            )}
            <Button asChild size="sm" className={cn('gap-1.5', ORANGE_BUTTON)}>
              <Link href={`/student/tests/${set._id}`}>
                {resuming ? <PlayCircle className="h-4 w-4" /> : null}
                {label}
                {!resuming && <ArrowRight className="h-4 w-4" />}
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SetCardSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <Skeleton className="h-5 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="grid grid-cols-2 gap-2 rounded-lg border border-[var(--color-border)] px-3 py-2.5">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function ExamTestsPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = use(params);

  const { data, isLoading, isError, refetch, error } = useQuery({
    queryKey: ['student', 'tests', 'exam', examId],
    queryFn: () => studentTestsApi.examSets(examId),
    retry: false,
  });

  const notFound = isError && (error as { response?: { status?: number } })?.response?.status === 404;

  return (
    <div className="space-y-4">
      <Link
        href="/student/mock-tests"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-muted-foreground)] transition-colors hover:text-[#c95817]"
      >
        <ArrowLeft className="h-4 w-4" /> All mock tests
      </Link>

      <header className="rounded-xl border border-[var(--color-border)] bg-gradient-to-r from-white via-[#FFF6EC] to-[#FFE4CC] px-5 py-3 shadow-elevated dark:from-[#0B1220] dark:via-[#1A1410] dark:to-[#3A1D08]">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : data ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              {data.exam.category && (
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#c95817] dark:text-orange-300">
                  <span className="h-px w-4 bg-orange-400/70" />
                  {data.exam.category.name}
                  {data.exam.year ? ` · ${data.exam.year}` : ''}
                </p>
              )}
              <h1 className="text-lg font-black leading-tight tracking-tight">{data.exam.title}</h1>
              {data.exam.titleBn && <p className="truncate text-xs text-[var(--color-muted-foreground)]">{data.exam.titleBn}</p>}
            </div>
            <div className="rounded-full border border-orange-200 bg-white/80 px-3 py-1 text-xs font-semibold text-[#b9450d] dark:border-orange-400/30 dark:bg-orange-500/10 dark:text-orange-300">
              {data.sets.length} {data.sets.length === 1 ? 'test' : 'tests'} available
            </div>
          </div>
        ) : (
          <h1 className="text-xl font-black tracking-tight">Exam</h1>
        )}
      </header>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" aria-busy="true">
          {Array.from({ length: 3 }, (_, i) => (
            <SetCardSkeleton key={i} />
          ))}
        </div>
      ) : notFound ? (
        <ErrorState message="This exam is not available." className="py-16" />
      ) : isError ? (
        <ErrorState message="Could not load the tests." onRetry={() => refetch()} className="py-16" />
      ) : data && data.sets.length === 0 ? (
        <Card>
          <CardContent className="px-6 py-16 text-center">
            <p className="font-semibold">No tests are open for this exam yet</p>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">Published tests will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {data?.sets.map((set) => <SetCard key={set._id} set={set} />)}
        </div>
      )}
    </div>
  );
}

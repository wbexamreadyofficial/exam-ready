'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Clock, FileText, PlayCircle, Timer } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import { bilingual, studentTestsApi, type InProgressAttempt } from '@/lib/api/studentTests';
import { cn } from '@/lib/utils';

const dateFormatter = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const clock = (totalSeconds: number) => {
  const safe = Math.max(0, totalSeconds);
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const sec = safe % 60;
  return `${h > 0 ? `${String(h).padStart(2, '0')}:` : ''}${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

/** A test the student left mid-way: shows a live countdown and lets them continue until time runs out. */
function InProgressCard({ attempt, offset, onExpired }: { attempt: InProgressAttempt; offset: number; onExpired: () => void }) {
  const expiresAt = new Date(attempt.expiresAt).getTime();
  const [left, setLeft] = useState(() => Math.max(0, Math.round((expiresAt - (Date.now() + offset)) / 1000)));

  useEffect(() => {
    const timer = setInterval(() => {
      const next = Math.max(0, Math.round((expiresAt - (Date.now() + offset)) / 1000));
      setLeft(next);
      if (next <= 0) onExpired();
    }, 1000);
    return () => clearInterval(timer);
  }, [expiresAt, offset, onExpired]);

  const low = left <= 300;
  return (
    <Card className="overflow-hidden border-orange-300/70 bg-gradient-to-r from-orange-50 via-white to-white dark:border-orange-400/30 dark:from-orange-500/10 dark:via-transparent dark:to-transparent">
      <CardContent className="flex flex-wrap items-center gap-4 p-5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] text-white shadow-md shadow-orange-600/30">
          <PlayCircle className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold">{bilingual(attempt.questionSet?.title) || 'Mock test'}</p>
          <p className="mt-0.5 text-xs text-[var(--color-muted-foreground)]">
            {attempt.exam?.title && <>{attempt.exam.title} · </>}
            {attempt.answeredCount} of {attempt.totalQuestions} answered
          </p>
        </div>
        <div
          className={cn(
            'flex items-center gap-2 rounded-xl border px-3 py-1.5 font-mono text-base font-bold tabular-nums',
            low ? 'border-red-300 bg-red-50 text-red-600 dark:border-red-400/40 dark:bg-red-500/10 dark:text-red-300' : 'border-orange-200 bg-white text-[#b9450d] dark:border-orange-400/30 dark:bg-orange-500/10 dark:text-orange-300'
          )}
          title="Time remaining"
        >
          <Timer className="h-4 w-4" />
          {clock(left)} <span className="font-sans text-[11px] font-semibold uppercase tracking-wide opacity-70">left</span>
        </div>
        <Button
          asChild
          className="gap-2 border-0 bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] font-semibold text-white shadow-md shadow-orange-600/30 ring-1 ring-inset ring-white/25 hover:brightness-110"
        >
          <Link href={`/student/tests/attempt/${attempt._id}`}>
            Continue <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function ResultsPage() {
  const { data, dataUpdatedAt, isLoading, isError, refetch } = useQuery({
    queryKey: ['student', 'tests', 'my-attempts'],
    queryFn: studentTestsApi.myAttempts,
  });

  const attempts = data?.attempts ?? [];
  const inProgress = data?.inProgress ?? [];
  const offset = data ? new Date(data.serverNow).getTime() - dataUpdatedAt : 0;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-gradient-to-r from-white via-[#FFF6EC] to-[#FFE4CC] px-6 py-5 shadow-elevated sm:flex-row sm:items-center sm:justify-between dark:from-[#0B1220] dark:via-[#1A1410] dark:to-[#3A1D08]">
        <div className="min-w-0">
          <h1 className="text-xl font-black tracking-tight sm:text-2xl">My Results</h1>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">Tests you are in the middle of, and every one you have finished — with score, solutions and rank.</p>
        </div>
        {!isLoading && !isError && (
          <div className="self-start rounded-full border border-orange-200 bg-white/80 px-3.5 py-1.5 text-[13px] font-semibold text-[#b9450d] sm:self-center dark:border-orange-400/30 dark:bg-orange-500/10 dark:text-orange-300">
            {attempts.length + inProgress.length} {attempts.length + inProgress.length === 1 ? 'attempt' : 'attempts'}
          </div>
        )}
      </header>

      {isLoading ? (
        <div className="space-y-3" aria-busy="true">
          {Array.from({ length: 5 }, (_, i) => (
            <Card key={i}>
              <CardContent className="flex items-center gap-4 p-5">
                <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <ErrorState message="Could not load your results." onRetry={() => refetch()} className="py-16" />
      ) : attempts.length === 0 && inProgress.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-[#e2691f] dark:bg-orange-500/15">
              <FileText className="h-6 w-6" />
            </span>
            <div>
              <p className="font-semibold">No tests finished yet</p>
              <p className="text-sm text-[var(--color-muted-foreground)]">Take a mock test to see your score and solutions here.</p>
            </div>
            <Button asChild className="border-0 bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] font-semibold text-white shadow-md shadow-orange-600/30">
              <Link href="/student/mock-tests">Explore mock tests</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {inProgress.length > 0 && (
            <section className="space-y-3 pb-2">
              <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#c95817] dark:text-orange-300">
                <span className="h-px w-5 bg-orange-400/70" /> In progress
              </h2>
              {inProgress.map((attempt) => (
                <InProgressCard key={attempt._id} attempt={attempt} offset={offset} onExpired={() => void refetch()} />
              ))}
              {attempts.length > 0 && (
                <h2 className="flex items-center gap-2 pt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#c95817] dark:text-orange-300">
                  <span className="h-px w-5 bg-orange-400/70" /> Finished
                </h2>
              )}
            </section>
          )}
          {attempts.map((attempt) => {
            const percentage = attempt.totalMarks > 0 ? Math.max(0, Math.round((attempt.score / attempt.totalMarks) * 1000) / 10) : 0;
            const good = percentage >= 60;
            return (
              <Link key={attempt._id} href={`/student/tests/result/${attempt._id}`} className="group block">
                <Card className="border-orange-200/60 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-orange-300 group-hover:shadow-xl group-hover:shadow-orange-500/10 dark:border-orange-400/20">
                  <CardContent className="flex flex-wrap items-center gap-4 p-5">
                    <span
                      className={cn(
                        'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white shadow-md',
                        good ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-green-600/25' : 'bg-gradient-to-br from-[#f4953f] to-[#c4501a] shadow-orange-600/30'
                      )}
                    >
                      {percentage}%
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-bold">{bilingual(attempt.questionSet?.title) || 'Mock test'}</p>
                      <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--color-muted-foreground)]">
                        {attempt.exam?.title && <span>{attempt.exam.title}</span>}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {dateFormatter.format(new Date(attempt.submittedAt))}
                        </span>
                      </p>
                    </div>
                    <div className="hidden items-center gap-2 text-xs font-semibold sm:flex">
                      <span className="rounded-full bg-green-50 px-2.5 py-1 text-green-700 dark:bg-green-500/15 dark:text-green-300">{attempt.correctCount} correct</span>
                      <span className="rounded-full bg-red-50 px-2.5 py-1 text-red-600 dark:bg-red-500/15 dark:text-red-300">{attempt.wrongCount} wrong</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black tabular-nums">
                        {attempt.score}
                        <span className="text-sm font-semibold text-[var(--color-muted-foreground)]"> / {attempt.totalMarks}</span>
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#c95817] transition-transform group-hover:translate-x-0.5" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

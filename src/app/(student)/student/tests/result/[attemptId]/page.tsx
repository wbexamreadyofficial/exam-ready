'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Clock,
  Crown,
  Flag,
  Lightbulb,
  Percent,
  RotateCcw,
  Target,
  Trophy,
  XCircle,
  MinusCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import { UserAvatar } from '@/components/admin/UserAvatar';
import { bilingual, studentTestsApi, type Solution, type SolutionState, type TestResult } from '@/lib/api/studentTests';
import { cn } from '@/lib/utils';

type Tab = 'analysis' | 'solutions' | 'leaderboard';

const ORANGE_BUTTON =
  'border-0 bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] font-semibold text-white shadow-md shadow-orange-600/30 ring-1 ring-inset ring-white/25 transition-all hover:-translate-y-px hover:bg-transparent hover:brightness-110 hover:shadow-lg hover:shadow-orange-600/40';

const minutes = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${String(s).padStart(2, '0')}s`;
};

function Metric({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Trophy;
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden border-orange-200/60 bg-gradient-to-br from-orange-50/60 to-white dark:border-orange-400/20 dark:from-orange-500/10 dark:to-transparent">
      <CardContent className="flex items-center gap-4 p-5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] text-white shadow-md shadow-orange-600/30 ring-1 ring-inset ring-white/25">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">{label}</p>
          <p className="text-2xl font-black leading-tight tabular-nums">{value}</p>
          {sub && <p className="text-xs text-[var(--color-muted-foreground)]">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function Compare({ result }: { result: TestResult }) {
  const max = Math.max(result.summary.totalMarks, result.comparison.topScore, result.summary.score, 1);
  const rows = [
    { label: 'You', value: result.summary.score, tone: 'from-[#f4953f] to-[#c4501a]' },
    { label: 'Topper', value: result.comparison.topScore, tone: 'from-violet-400 to-violet-600' },
    { label: 'Average', value: result.comparison.averageScore, tone: 'from-slate-300 to-slate-400 dark:from-slate-500 dark:to-slate-600' },
  ];
  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#c95817] dark:text-orange-300">Compare</h3>
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-sm font-semibold">{row.label}</span>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-[var(--color-muted)]">
              <div
                className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-700', row.tone)}
                style={{ width: `${Math.max(2, Math.min(100, (Math.max(row.value, 0) / max) * 100))}%` }}
              />
            </div>
            <span className="w-14 shrink-0 text-right text-sm font-bold tabular-nums">{row.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function Analysis({ result }: { result: TestResult }) {
  const { summary, comparison } = result;
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Metric
          icon={Trophy}
          label="Score"
          value={
            <>
              {summary.score}
              <span className="text-base font-semibold text-[var(--color-muted-foreground)]"> / {summary.totalMarks}</span>
            </>
          }
          sub={`Average ${comparison.averageScore} · Best ${comparison.topScore}`}
        />
        <Metric
          icon={Flag}
          label="Rank"
          value={
            comparison.rank ? (
              <>
                {comparison.rank}
                <span className="text-base font-semibold text-[var(--color-muted-foreground)]"> / {comparison.participants}</span>
              </>
            ) : (
              '—'
            )
          }
          sub="Among students on this test"
        />
        <Metric
          icon={Percent}
          label="Percentile"
          value={comparison.participants > 1 ? `${comparison.percentile}%` : '—'}
          sub={comparison.participants > 1 ? 'Students you scored above' : 'Needs more students'}
        />
        <Metric icon={Target} label="Accuracy" value={`${summary.accuracy}%`} sub={`${summary.correct} of ${summary.attempted} attempted`} />
        <Metric
          icon={CheckCircle2}
          label="Attempted"
          value={
            <>
              {summary.attempted}
              <span className="text-base font-semibold text-[var(--color-muted-foreground)]"> / {summary.totalQuestions}</span>
            </>
          }
        />
        <Metric icon={Clock} label="Time taken" value={minutes(result.timeTakenSeconds)} sub={`of ${result.durationMinutes} min`} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Chip tone="green" icon={CheckCircle2} label="Correct" value={summary.correct} />
        <Chip tone="red" icon={XCircle} label="Incorrect" value={summary.wrong} />
        <Chip tone="slate" icon={MinusCircle} label="Unattempted" value={summary.unattempted} />
      </div>

      <Compare result={result} />
    </div>
  );
}

const CHIP_TONES = {
  green: 'border-green-200 bg-green-50 text-green-700 dark:border-green-400/25 dark:bg-green-500/10 dark:text-green-300',
  red: 'border-red-200 bg-red-50 text-red-700 dark:border-red-400/25 dark:bg-red-500/10 dark:text-red-300',
  slate: 'border-slate-200 bg-slate-50 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300',
};

function Chip({ tone, icon: Icon, label, value }: { tone: keyof typeof CHIP_TONES; icon: typeof Clock; label: string; value: number }) {
  return (
    <div className={cn('flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold', CHIP_TONES[tone])}>
      <Icon className="h-4 w-4" />
      {label}: <span className="tabular-nums">{value}</span>
    </div>
  );
}

const STATE_STYLE: Record<SolutionState, { label: string; badge: string }> = {
  correct: { label: 'Correct', badge: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300' },
  wrong: { label: 'Incorrect', badge: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300' },
  unattempted: { label: 'Unattempted', badge: 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300' },
};

function SolutionCard({ solution }: { solution: Solution }) {
  const style = STATE_STYLE[solution.state];
  return (
    <Card>
      <CardContent className="space-y-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <span
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white',
              solution.state === 'correct' ? 'bg-green-500' : solution.state === 'wrong' ? 'bg-red-500' : 'bg-slate-400'
            )}
          >
            {solution.number}
          </span>
          <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide', style.badge)}>{style.label}</span>
          {solution.subject?.name && <span className="text-xs font-semibold text-[var(--color-muted-foreground)]">{solution.subject.name}</span>}
          {solution.timeSpentSeconds > 0 && (
            <span className="ml-auto flex items-center gap-1 text-xs text-[var(--color-muted-foreground)]">
              <Clock className="h-3.5 w-3.5" /> {solution.timeSpentSeconds}s
            </span>
          )}
        </div>

        <div className="space-y-1">
          {solution.questionText.en && <p className="whitespace-pre-line text-base font-medium leading-relaxed">{solution.questionText.en}</p>}
          {solution.questionText.bn && (
            <p className={cn('whitespace-pre-line leading-relaxed', solution.questionText.en ? 'text-sm text-[var(--color-muted-foreground)]' : 'text-base font-medium')}>
              {solution.questionText.bn}
            </p>
          )}
        </div>

        <ul className="space-y-2">
          {solution.options.map((option, optionIndex) => {
            const isCorrect = optionIndex === solution.correctOptionIndex;
            const isMine = optionIndex === solution.selectedOptionIndex;
            return (
              <li
                key={optionIndex}
                className={cn(
                  'flex items-center gap-3 rounded-xl border-2 px-4 py-2.5 text-sm',
                  isCorrect
                    ? 'border-green-500/70 bg-green-50 dark:bg-green-500/10'
                    : isMine
                      ? 'border-red-400/70 bg-red-50 dark:bg-red-500/10'
                      : 'border-[var(--color-border)]'
                )}
              >
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold',
                    isCorrect ? 'border-transparent bg-green-500 text-white' : isMine ? 'border-transparent bg-red-500 text-white' : 'text-[var(--color-muted-foreground)]'
                  )}
                >
                  {String.fromCharCode(65 + optionIndex)}
                </span>
                <span className="min-w-0 flex-1">
                  {option.en && <span className="block">{option.en}</span>}
                  {option.bn && <span className={cn('block', option.en && 'text-[13px] text-[var(--color-muted-foreground)]')}>{option.bn}</span>}
                </span>
                {isCorrect && (
                  <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-green-700 dark:text-green-300">
                    <CheckCircle2 className="h-4 w-4" /> Correct
                  </span>
                )}
                {isMine && !isCorrect && (
                  <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-red-600 dark:text-red-300">
                    <XCircle className="h-4 w-4" /> Your answer
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        {(solution.explanation?.en || solution.explanation?.bn) && (
          <div className="flex gap-3 rounded-xl border border-orange-200/70 bg-gradient-to-br from-orange-50/70 to-white p-4 dark:border-orange-400/20 dark:from-orange-500/10 dark:to-transparent">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#e2691f]" />
            <div className="space-y-1 text-sm leading-relaxed">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#c95817] dark:text-orange-300">Solution</p>
              {solution.explanation?.en && <p>{solution.explanation.en}</p>}
              {solution.explanation?.bn && <p className={cn(solution.explanation.en && 'text-[var(--color-muted-foreground)]')}>{solution.explanation.bn}</p>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Solutions({ result }: { result: TestResult }) {
  const [filter, setFilter] = useState<'all' | SolutionState>('all');
  const counts = {
    all: result.solutions.length,
    wrong: result.summary.wrong,
    correct: result.summary.correct,
    unattempted: result.summary.unattempted,
  };
  const shown = filter === 'all' ? result.solutions : result.solutions.filter((solution) => solution.state === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter solutions">
        {(
          [
            ['all', 'All'],
            ['wrong', 'Incorrect'],
            ['correct', 'Correct'],
            ['unattempted', 'Unattempted'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={filter === key}
            onClick={() => setFilter(key)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-[13px] font-semibold transition-all',
              filter === key
                ? 'border-transparent bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] text-white shadow-md shadow-orange-600/30'
                : 'border-orange-200/70 bg-white hover:border-orange-300 hover:bg-orange-50 hover:text-[#c95817] dark:border-white/10 dark:bg-white/5'
            )}
          >
            {label} ({counts[key]})
          </button>
        ))}
      </div>
      {shown.length === 0 ? (
        <Card>
          <CardContent className="px-6 py-12 text-center text-sm text-[var(--color-muted-foreground)]">Nothing here.</CardContent>
        </Card>
      ) : (
        shown.map((solution) => <SolutionCard key={solution.questionId} solution={solution} />)
      )}
    </div>
  );
}

function Leaderboard({ setId }: { setId: string }) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['student', 'tests', 'leaderboard', setId],
    queryFn: () => studentTestsApi.leaderboard(setId),
  });

  if (isLoading) {
    return (
      <div className="space-y-3" aria-busy="true">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }
  if (isError || !data) return <ErrorState message="Could not load the leaderboard." onRetry={() => refetch()} className="py-12" />;
  if (data.entries.length === 0) {
    return (
      <Card>
        <CardContent className="px-6 py-12 text-center text-sm text-[var(--color-muted-foreground)]">No one has finished this test yet.</CardContent>
      </Card>
    );
  }

  const podium = data.entries.slice(0, 3);
  const order = [podium[1], podium[0], podium[2]].filter(Boolean);
  const meOutside = data.me && !data.entries.some((entry) => entry.isMe);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-center gap-3 sm:gap-6">
        {order.map((entry) => (
          <div key={entry.rank} className={cn('flex w-28 flex-col items-center text-center sm:w-36', entry.rank === 1 ? '-mb-1' : '')}>
            <div className="relative">
              {entry.rank === 1 && <Crown className="absolute -top-5 left-1/2 h-5 w-5 -translate-x-1/2 text-amber-500" />}
              <UserAvatar
                name={entry.name}
                src={entry.profilePhoto}
                className={cn(entry.rank === 1 ? 'h-20 w-20' : 'h-16 w-16', 'border-4 border-[var(--color-card)] shadow-lg')}
                fallbackClassName={entry.rank === 1 ? 'text-xl' : 'text-lg'}
              />
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#f4953f] to-[#c4501a] text-xs font-bold text-white ring-2 ring-[var(--color-card)]">
                {entry.rank}
              </span>
            </div>
            <p className="mt-2 w-full truncate text-sm font-semibold">{entry.isMe ? 'You' : entry.name}</p>
            <p className="text-sm font-bold tabular-nums text-[#c95817] dark:text-orange-300">{entry.score}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="divide-y divide-[var(--color-border)] p-0">
          {data.entries.map((entry) => (
            <div
              key={entry.rank}
              className={cn('flex items-center gap-3 px-4 py-3', entry.isMe && 'bg-orange-50 dark:bg-orange-500/10')}
            >
              <span className="w-8 text-center text-sm font-bold tabular-nums text-[var(--color-muted-foreground)]">{entry.rank}</span>
              <UserAvatar name={entry.name} src={entry.profilePhoto} className="h-9 w-9" fallbackClassName="text-xs" />
              <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                {entry.name}
                {entry.isMe && <span className="ml-1.5 text-xs font-normal text-[#c95817] dark:text-orange-300">(You)</span>}
              </span>
              <span className="hidden text-xs text-[var(--color-muted-foreground)] sm:block">{minutes(entry.timeTakenSeconds)}</span>
              <span className="w-14 text-right text-sm font-bold tabular-nums">{entry.score}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {meOutside && data.me && (
        <div className="flex items-center gap-3 rounded-xl border border-orange-300 bg-orange-50 px-4 py-3 dark:border-orange-400/30 dark:bg-orange-500/10">
          <span className="w-8 text-center text-sm font-bold tabular-nums">{data.me.rank}</span>
          <span className="flex-1 text-sm font-semibold">You</span>
          <span className="text-sm font-bold tabular-nums">{data.me.score}</span>
        </div>
      )}
    </div>
  );
}

export default function TestResultPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = use(params);
  const [tab, setTab] = useState<Tab>('analysis');

  const { data, isLoading, isError, refetch, error } = useQuery({
    queryKey: ['student', 'tests', 'result', attemptId],
    queryFn: () => studentTestsApi.result(attemptId),
    retry: false,
  });

  const status = (error as { response?: { status?: number } })?.response?.status;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link
        href={data?.exam?._id ? `/student/mock-tests/${data.exam._id}` : '/student/mock-tests'}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-muted-foreground)] transition-colors hover:text-[#c95817]"
      >
        <ArrowLeft className="h-4 w-4" /> {data?.exam?.title ?? 'All mock tests'}
      </Link>

      {isLoading ? (
        <div className="space-y-4" aria-busy="true">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </div>
      ) : isError || !data ? (
        <ErrorState
          message={status === 409 ? 'Submit the test to see its result.' : status === 404 ? 'This result was not found.' : 'Could not load your result.'}
          onRetry={status ? undefined : () => refetch()}
          className="py-16"
        />
      ) : (
        <>
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--color-border)] bg-gradient-to-r from-white via-[#FFF6EC] to-[#FFE4CC] px-6 py-5 shadow-elevated dark:from-[#0B1220] dark:via-[#1A1410] dark:to-[#3A1D08]">
            <div className="min-w-0">
              <p className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#c95817] dark:text-orange-300">
                <Award className="h-3.5 w-3.5" /> Test result
              </p>
              <h1 className="text-xl font-black leading-tight tracking-tight sm:text-2xl">{bilingual(data.title)}</h1>
            </div>
            <Button asChild className={cn('gap-2', ORANGE_BUTTON)}>
              <Link href={`/student/tests/${data.questionSetId}`}>
                <RotateCcw className="h-4 w-4" /> Reattempt test
              </Link>
            </Button>
          </header>

          <div className="flex gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-1" role="tablist">
            {(
              [
                ['analysis', 'Analysis'],
                ['solutions', 'Solutions'],
                ['leaderboard', 'Leaderboard'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={tab === key}
                onClick={() => setTab(key)}
                className={cn(
                  'flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all',
                  tab === key
                    ? 'bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] text-white shadow-md shadow-orange-600/30'
                    : 'text-[var(--color-muted-foreground)] hover:bg-orange-50 hover:text-[#c95817] dark:hover:bg-orange-500/10'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === 'analysis' && <Analysis result={data} />}
          {tab === 'solutions' && <Solutions result={data} />}
          {tab === 'leaderboard' && <Leaderboard setId={data.questionSetId} />}
        </>
      )}
    </div>
  );
}

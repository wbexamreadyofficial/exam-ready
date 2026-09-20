'use client';

import { useDeferredValue, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileSearch,
  HelpCircle,
  Languages,
  ListChecks,
  MinusCircle,
  Search,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { categoriesApi } from '@/lib/api/categories';
import { examsApi, type Exam } from '@/lib/api/taxonomy';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 9;
const ORANGE_BUTTON =
  'border-0 bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] font-semibold text-white shadow-md shadow-orange-600/30 ring-1 ring-inset ring-white/25 transition-all hover:-translate-y-px hover:bg-transparent hover:brightness-110 hover:shadow-lg hover:shadow-orange-600/40';

const LANGUAGE_LABEL: Record<Exam['language'], string> = {
  EN: 'English',
  BN: 'Bengali',
  BILINGUAL: 'Bengali & English',
};

function Stat({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-[#e2691f] dark:bg-orange-500/15">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 leading-tight">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">{label}</p>
        <p className="truncate text-[13px] font-semibold">{value}</p>
      </div>
    </div>
  );
}

function ExamCard({ exam }: { exam: Exam }) {
  const pattern = exam.pattern;
  const duration = pattern?.durationMinutes ? `${pattern.durationMinutes} min` : '—';
  const questions = pattern?.totalQuestions ? `${pattern.totalQuestions} questions` : '—';
  const negative =
    pattern?.negativeMarksPerQuestion !== undefined && pattern.negativeMarksPerQuestion > 0
      ? `−${pattern.negativeMarksPerQuestion} per wrong`
      : 'No negative marking';

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden border-orange-200/60 bg-gradient-to-b from-orange-50/50 to-white transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/15 dark:border-orange-400/20 dark:from-orange-500/10 dark:via-transparent dark:to-transparent">
      <CardContent className="relative flex h-full flex-col gap-5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full border border-orange-200 bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#b9450d] dark:border-orange-400/30 dark:bg-orange-500/10 dark:text-orange-300">
            {exam.category?.name ?? 'General'}
          </span>
          {exam.year && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-[var(--color-muted-foreground)]">
              <CalendarDays className="h-3.5 w-3.5" />
              {exam.year}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <h2 className="text-lg font-bold leading-snug tracking-tight">{exam.title}</h2>
          {exam.titleBn && <p className="mt-0.5 text-sm text-[var(--color-muted-foreground)]">{exam.titleBn}</p>}
          {exam.description && (
            <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-[var(--color-muted-foreground)]">
              {exam.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-orange-200/60 bg-white/70 p-3.5 dark:border-orange-400/15 dark:bg-white/5">
          <Stat icon={Clock} label="Duration" value={duration} />
          <Stat icon={HelpCircle} label="Questions" value={questions} />
          <Stat icon={MinusCircle} label="Marking" value={negative} />
          <Stat icon={Languages} label="Language" value={LANGUAGE_LABEL[exam.language]} />
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-orange-200/60 pt-4 dark:border-orange-400/15">
          <span className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-muted-foreground)]">
            <ListChecks className="h-4 w-4 text-[#e2691f]" />
            {exam.questionSetCount ?? 0} {exam.questionSetCount === 1 ? 'test' : 'tests'}
          </span>
          <Button asChild size="sm" className={cn('gap-1.5', ORANGE_BUTTON)}>
            <Link href={`/student/exam/${exam._id}/instructions`}>
              Start exam <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ExamCardSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-5 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="grid grid-cols-2 gap-3 rounded-xl border border-[var(--color-border)] p-3.5">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-2.5 w-12" />
                <Skeleton className="h-3.5 w-16" />
              </div>
            </div>
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

export default function MockTestsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(search.trim());

  const { data: categoryData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['student', 'mock-tests', 'categories'],
    queryFn: () =>
      categoriesApi.getCategories({ isActive: true, sortBy: 'displayOrder', sortOrder: 'asc', limit: 50 }),
    staleTime: 5 * 60_000,
  });
  const apiCategories = categoryData?.categories ?? [];

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ['student', 'mock-tests', 'exams', { deferredSearch, category, page }],
    queryFn: () =>
      examsApi.list({
        isActive: true,
        search: deferredSearch || undefined,
        category: category === 'all' ? undefined : category,
        page,
        limit: PAGE_SIZE,
        sortBy: 'displayOrder',
        sortOrder: 'asc',
      }),
    placeholderData: (previous) => previous,
  });

  const exams = data?.items ?? [];

  // If the categories request fails or returns nothing, fall back to the categories on the loaded exams.
  const categories =
    apiCategories.length > 0
      ? apiCategories
      : Array.from(
          new Map(
            exams.flatMap((exam) => (exam.category ? [[exam.category._id, exam.category] as const] : []))
          ).values()
        );
  const total = data?.pagination?.total ?? exams.length;
  const totalPages = data?.pagination?.totalPages ?? 1;
  const filtered = Boolean(deferredSearch) || category !== 'all';

  const clearFilters = () => {
    setSearch('');
    setCategory('all');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-gradient-to-r from-white via-[#FFF6EC] to-[#FFE4CC] px-6 py-5 shadow-elevated sm:flex-row sm:items-center sm:justify-between dark:from-[#0B1220] dark:via-[#1A1410] dark:to-[#3A1D08]">
        <div className="min-w-0">
          <h1 className="text-xl font-black tracking-tight sm:text-2xl">Mock Tests</h1>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            Exam-pattern practice papers with a real timer and negative marking.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 self-start rounded-full border border-orange-200 bg-white/80 px-3.5 py-1.5 text-[13px] font-semibold text-[#b9450d] sm:self-center dark:border-orange-400/30 dark:bg-orange-500/10 dark:text-orange-300">
          <FileSearch className="h-4 w-4" />
          {isLoading ? 'Loading…' : `${total.toLocaleString()} ${total === 1 ? 'exam' : 'exams'} available`}
        </div>
      </header>

      {/* Search */}
      <Card>
        <CardContent className="p-4 sm:p-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search exams by name…"
              aria-label="Search exams"
              className="h-11 pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Category filter chips */}
      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Exam categories">
        {[{ _id: 'all', name: 'All Exams' }, ...categories].map((item) => {
          const active = category === item._id;
          return (
            <button
              key={item._id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                setCategory(item._id);
                setPage(1);
              }}
              className={cn(
                'rounded-full border px-4 py-1.5 text-[13px] font-semibold transition-all duration-200',
                active
                  ? 'border-transparent bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] text-white shadow-md shadow-orange-600/30 ring-1 ring-inset ring-white/25'
                  : 'border-orange-200/70 bg-white text-[var(--color-foreground)] shadow-sm hover:-translate-y-px hover:border-orange-300 hover:bg-orange-50 hover:text-[#c95817] dark:border-white/10 dark:bg-white/5 dark:hover:bg-orange-500/10'
              )}
            >
              {item.name}
            </button>
          );
        })}
        {categoriesLoading &&
          Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-8 w-24 rounded-full" />)}
        {filtered && (
          <button
            type="button"
            onClick={clearFilters}
            className="ml-auto flex items-center gap-1 text-[13px] font-semibold text-[#c95817] hover:underline dark:text-orange-300"
          >
            <X className="h-3.5 w-3.5" /> Clear filters
          </button>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3" aria-busy="true">
          {Array.from({ length: 6 }, (_, i) => (
            <ExamCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <ErrorState message="Could not load the exams." onRetry={() => refetch()} className="py-16" />
      ) : exams.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-[#e2691f] dark:bg-orange-500/15">
              <FileSearch className="h-6 w-6" />
            </span>
            <div>
              <p className="font-semibold">No exams found</p>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                {filtered ? 'Try a different search or category.' : 'New mock tests will appear here soon.'}
              </p>
            </div>
            {filtered && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div
            className={cn('grid gap-5 transition-opacity md:grid-cols-2 2xl:grid-cols-3', isFetching && 'opacity-60')}
          >
            {exams.map((exam) => (
              <ExamCard key={exam._id} exam={exam} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="flex items-center justify-between gap-3" aria-label="Pagination">
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Page <strong className="text-[var(--color-foreground)]">{page}</strong> of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  disabled={page >= totalPages}
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </nav>
          )}
        </>
      )}
    </div>
  );
}

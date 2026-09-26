'use client';

import { Suspense, useDeferredValue, useState } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { studentTestsApi, type TestExam } from '@/lib/api/studentTests';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 9;
const ORANGE_BUTTON =
  'border-0 bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] font-semibold text-white shadow-md shadow-orange-600/30 ring-1 ring-inset ring-white/25 transition-all hover:-translate-y-px hover:bg-transparent hover:brightness-110 hover:shadow-lg hover:shadow-orange-600/40';

const LANGUAGE_LABEL: Record<TestExam['language'], string> = {
  EN: 'English',
  BN: 'Bengali',
  BILINGUAL: 'Bengali & English',
};

function Stat({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-center gap-1.5" title={label}>
      <Icon className="h-3.5 w-3.5 shrink-0 text-[#e2691f]" />
      <span className="truncate text-xs font-semibold">{value}</span>
    </div>
  );
}

function ExamCard({ exam }: { exam: TestExam }) {
  const pattern = exam.pattern;
  const duration = pattern?.durationMinutes ? `${pattern.durationMinutes} min` : '—';
  const questions = pattern?.totalQuestions ? `${pattern.totalQuestions} questions` : '—';
  const negative =
    pattern?.negativeMarksPerQuestion !== undefined && pattern.negativeMarksPerQuestion > 0
      ? `−${pattern.negativeMarksPerQuestion} per wrong`
      : 'No negative marking';

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden border-orange-200/60 bg-gradient-to-b from-orange-50/50 to-white transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/15 dark:border-orange-400/20 dark:from-orange-500/10 dark:via-transparent dark:to-transparent">
      <CardContent className="relative flex h-full flex-col gap-3 p-4">
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
          <h2 className="text-base font-bold leading-snug tracking-tight">{exam.title}</h2>
          {exam.titleBn && <p className="mt-0.5 truncate text-xs text-[var(--color-muted-foreground)]">{exam.titleBn}</p>}
          {exam.description && (
            <p className="mt-1 line-clamp-1 text-xs text-[var(--color-muted-foreground)]">
              {exam.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-2 rounded-lg border border-orange-200/60 bg-white/70 px-3 py-2.5 dark:border-orange-400/15 dark:bg-white/5">
          <Stat icon={Clock} label="Duration" value={duration} />
          <Stat icon={HelpCircle} label="Questions" value={questions} />
          <Stat icon={MinusCircle} label="Marking" value={negative} />
          <Stat icon={Languages} label="Language" value={LANGUAGE_LABEL[exam.language]} />
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-orange-200/60 pt-3 dark:border-orange-400/15">
          <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-muted-foreground)]">
            <ListChecks className="h-3.5 w-3.5 text-[#e2691f]" />
            {exam.testCount} {exam.testCount === 1 ? 'test' : 'tests'} available
          </span>
          <Button asChild size="sm" className={cn('gap-1.5', ORANGE_BUTTON)}>
            <Link href={`/student/mock-tests/${exam._id}`}>
              View tests <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
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
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="grid grid-cols-2 gap-2 rounded-lg border border-[var(--color-border)] px-3 py-2.5">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

function MockTestsView({ initialCategory }: { initialCategory: string }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>(initialCategory);
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
      studentTestsApi.exams({
        search: deferredSearch || undefined,
        category: category === 'all' ? undefined : category,
        page,
        limit: PAGE_SIZE,
      }),
    placeholderData: (previous) => previous,
  });

  const exams = data?.exams ?? [];

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
    <div className="space-y-4">
      {/* Header */}
      <header className="flex flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-gradient-to-r from-white via-[#FFF6EC] to-[#FFE4CC] px-5 py-3 shadow-elevated sm:flex-row sm:items-center sm:justify-between dark:from-[#0B1220] dark:via-[#1A1410] dark:to-[#3A1D08]">
        <div className="min-w-0">
          <h1 className="text-lg font-black leading-tight tracking-tight">Mock Tests</h1>
          <p className="text-xs text-[var(--color-muted-foreground)]">
            Exam-pattern practice papers with a real timer and negative marking.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 self-start rounded-full border border-orange-200 bg-white/80 px-3 py-1 text-xs font-semibold text-[#b9450d] sm:self-center dark:border-orange-400/30 dark:bg-orange-500/10 dark:text-orange-300">
          <FileSearch className="h-4 w-4" />
          {isLoading ? 'Loading…' : `${total.toLocaleString()} ${total === 1 ? 'exam' : 'exams'} available`}
        </div>
      </header>

      {/* Search */}
      <Card>
        <CardContent className="p-3">
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
              className="h-10 pl-10"
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
                'rounded-full border px-3.5 py-1 text-xs font-semibold transition-all duration-200',
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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" aria-busy="true">
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

function MockTestsRoute() {
  const initialCategory = useSearchParams().get('category') ?? 'all';
  return <MockTestsView initialCategory={initialCategory} />;
}

export default function MockTestsPage() {
  return (
    <Suspense>
      <MockTestsRoute />
    </Suspense>
  );
}

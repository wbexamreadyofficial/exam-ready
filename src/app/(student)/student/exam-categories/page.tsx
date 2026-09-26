'use client';

import { useDeferredValue, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, FolderSearch, LayoutGrid, Search } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { categoriesApi } from '@/lib/api/categories';

export default function ExamCategoriesPage() {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search.trim());

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['student', 'exam-categories', deferredSearch],
    queryFn: () =>
      categoriesApi.getCategories({
        search: deferredSearch || undefined,
        isActive: true,
        sortBy: 'displayOrder',
        sortOrder: 'asc',
        limit: 50,
      }),
    placeholderData: (previous) => previous,
  });

  const categories = data?.categories ?? [];

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-gradient-to-r from-white via-[#FFF6EC] to-[#FFE4CC] px-5 py-3 shadow-elevated sm:flex-row sm:items-center sm:justify-between dark:from-[#0B1220] dark:via-[#1A1410] dark:to-[#3A1D08]">
        <div className="min-w-0">
          <h1 className="text-lg font-black leading-tight tracking-tight">Exam Categories</h1>
          <p className="text-xs text-[var(--color-muted-foreground)]">
            Pick the exam you are preparing for and jump straight into its mock tests.
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search categories…"
            className="h-9 bg-white pl-9 text-sm dark:bg-transparent"
            aria-label="Search exam categories"
          />
        </div>
      </header>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" aria-busy="true">
          {Array.from({ length: 6 }, (_, index) => (
            <Card key={index}>
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <Skeleton className="h-3.5 w-8" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-3.5 w-1/2" />
                </div>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <ErrorState message="Could not load exam categories." onRetry={() => refetch()} className="py-16" />
      ) : categories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-[#e2691f] dark:bg-orange-500/15">
              <FolderSearch className="h-6 w-6" />
            </span>
            <div>
              <p className="font-semibold">No categories found</p>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                {deferredSearch ? 'Try a different search.' : 'Exam categories will appear here soon.'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {categories.map((category, index) => (
            <Link key={category._id} href={`/student/mock-tests?category=${category._id}`} className="group block focus-visible:outline-none">
              <Card className="relative h-full overflow-hidden border-orange-200/60 bg-gradient-to-br from-orange-50/70 via-white to-white transition-all duration-300 group-hover:-translate-y-1 group-hover:border-orange-300 group-hover:shadow-xl group-hover:shadow-orange-500/15 group-focus-visible:ring-2 group-focus-visible:ring-orange-400/60 dark:border-orange-400/20 dark:from-orange-500/10 dark:via-transparent dark:to-transparent">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-400/10 blur-2xl transition-opacity group-hover:opacity-100"
                />
                <CardContent className="relative flex h-full flex-col gap-3 p-4">
                  <div className="flex items-start justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] text-white shadow-md shadow-orange-600/30 ring-1 ring-inset ring-white/25 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
                      <LayoutGrid className="h-[18px] w-[18px]" />
                    </span>
                    <span className="font-mono text-[11px] tracking-[0.14em] text-[#c95817] dark:text-orange-300">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-base font-bold leading-tight tracking-tight">{category.name}</h2>
                    {category.fullForm && (
                      <p className="mt-0.5 text-xs font-medium text-[#c95817] dark:text-orange-300">{category.fullForm}</p>
                    )}
                  </div>

                  <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-[var(--color-muted-foreground)]">
                    {category.description || 'Mock tests and practice sets for this exam.'}
                  </p>

                  <div className="flex items-center justify-between border-t border-orange-200/60 pt-3 dark:border-orange-400/15">
                    <span className="text-xs font-semibold">Explore mock tests</span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-orange-200 bg-white text-[#c95817] transition-all duration-300 group-hover:border-transparent group-hover:bg-[#e2691f] group-hover:text-white dark:bg-transparent">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

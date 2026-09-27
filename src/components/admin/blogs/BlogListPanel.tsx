'use client';

import type { ReactNode } from 'react';
import type { UseQueryResult } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Search, type LucideIcon } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TablePagination } from '@/components/ui/table-pagination';
import { ELEVATED_CARD } from '@/lib/constants';
import { cn } from '@/lib/utils';

export interface BlogPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface BlogListResultShape<T> {
  items: T[];
  pagination: BlogPagination;
}

const isForbidden = (error: unknown) => isAxiosError(error) && error.response?.status === 403;

function ListSkeleton({ columns, rows }: { columns: string[]; rows: number }) {
  return (
    <div aria-busy="true">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column}>{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, index) => (
            <TableRow key={index} className="hover:bg-transparent">
              {columns.map((column) => (
                <TableCell key={column}>
                  <Skeleton className="h-4 w-full max-w-[12rem]" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface BlogListPanelProps<T> {
  query: UseQueryResult<BlogListResultShape<T>>;
  columns: string[];
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  hasFilters: boolean;
  empty: { icon: LucideIcon; title: string; description: string };
  children: (items: T[]) => ReactNode;
  /** Render without its own card border (inside a dialog). */
  bare?: boolean;
}

/** Loading / error / empty / pagination shell shared by the three blog admin lists. */
export function BlogListPanel<T>({
  query,
  columns,
  pageSize,
  onPageChange,
  onPageSizeChange,
  hasFilters,
  empty,
  children,
  bare,
}: BlogListPanelProps<T>) {
  const { data, isLoading, isError, isPlaceholderData, refetch } = query;
  const items = data?.items ?? [];
  const pagination = data?.pagination;

  const body =
    isLoading || (isPlaceholderData && !data) ? (
      <ListSkeleton columns={columns} rows={Math.min(pageSize, 8)} />
    ) : isError ? (
      <ErrorState
        title={isForbidden(query.error) ? 'Admin sign-in required' : undefined}
        message={
          isForbidden(query.error)
            ? 'You are signed in with an account that is not an admin. Log out, then sign in with the admin account.'
            : 'Could not load this list.'
        }
        onRetry={() => refetch()}
        className="py-12"
      />
    ) : items.length === 0 ? (
      hasFilters ? (
        <EmptyState icon={Search} title="Nothing matches" description="Try a different word, or clear the filters." className="py-12" />
      ) : (
        <EmptyState icon={empty.icon} title={empty.title} description={empty.description} className="py-12" />
      )
    ) : (
      <div className={cn('transition-opacity', isPlaceholderData && 'opacity-60')}>{children(items)}</div>
    );

  const footer =
    pagination && items.length > 0 ? (
      <TablePagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.total}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    ) : null;

  if (bare) {
    return (
      <div className="overflow-hidden rounded-lg border border-[var(--color-border)]">
        {body}
        {footer}
      </div>
    );
  }

  return (
    <Card className={ELEVATED_CARD}>
      <CardContent className="p-0">
        {body}
        {footer}
      </CardContent>
    </Card>
  );
}

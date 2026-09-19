'use client';

import type { ReactNode } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { Search, X, type LucideIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TablePagination } from '@/components/ui/table-pagination';
import { ELEVATED_CARD } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { catalogApi, type ListResult, type Option, type OptionType, type QuestionStatus, type Scope, type SetStatus } from '@/lib/api/catalog';
import { ALL, type ListState } from './useListState';

// ─────────────────────────── wording for non-technical admins ───────────────────────────

export const SET_STATUS: Record<SetStatus, { label: string; hint: string; variant: 'success' | 'warning' | 'secondary' }> = {
  draft: { label: 'Draft', hint: 'Saved, but students cannot see it yet', variant: 'warning' },
  published: { label: 'Published', hint: 'Live — students can take it', variant: 'success' },
  archived: { label: 'Archived', hint: 'Retired — hidden from students', variant: 'secondary' },
};

export const QUESTION_STATUS: Record<QuestionStatus, { label: string; hint: string; variant: 'success' | 'warning' | 'destructive' }> = {
  pending: { label: 'Waiting for approval', hint: 'Not shown to students until approved', variant: 'warning' },
  approved: { label: 'Approved', hint: 'Ready to be used in tests', variant: 'success' },
  rejected: { label: 'Rejected', hint: 'Sent back — will not be used', variant: 'destructive' },
};

export const LANGUAGE_LABEL: Record<string, string> = { EN: 'English', BN: 'Bengali', BILINGUAL: 'English + Bengali' };
export const DIFFICULTY_LABEL: Record<string, string> = { EASY: 'Easy', MEDIUM: 'Medium', HARD: 'Hard' };

export const ACTIVE_OPTIONS = [
  { value: 'true', label: 'Active only' },
  { value: 'false', label: 'Inactive only' },
];
export const SET_STATUS_OPTIONS = (Object.keys(SET_STATUS) as SetStatus[]).map((key) => ({ value: key, label: SET_STATUS[key].label }));
export const QUESTION_STATUS_OPTIONS = (Object.keys(QUESTION_STATUS) as QuestionStatus[]).map((key) => ({
  value: key,
  label: QUESTION_STATUS[key].label,
}));

export const plural = (count: number, one: string, many = `${one}s`) => `${count.toLocaleString()} ${count === 1 ? one : many}`;

export function ActiveBadge({ active }: { active: boolean }) {
  return (
    <Badge variant={active ? 'success' : 'secondary'} className="text-[10px]">
      {active ? 'ACTIVE' : 'INACTIVE'}
    </Badge>
  );
}

export function SetStatusBadge({ status }: { status: SetStatus }) {
  const meta = SET_STATUS[status];
  return (
    <Badge variant={meta.variant} className="text-[10px]" title={meta.hint}>
      {meta.label}
    </Badge>
  );
}

export function QuestionStatusBadge({ status }: { status: QuestionStatus }) {
  const meta = QUESTION_STATUS[status];
  return (
    <Badge variant={meta.variant} className="text-[10px]" title={meta.hint}>
      {meta.label}
    </Badge>
  );
}

// ───────────────────────────── filter controls ─────────────────────────────

export function SearchBox({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <div className={cn('relative min-w-0 flex-1 sm:max-w-sm', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="pl-9"
        aria-label={placeholder}
      />
    </div>
  );
}

export function FilterSelect({
  label,
  value,
  onChange,
  options,
  allLabel,
  disabled,
  className,
}: {
  /** Small caption above the dropdown so its purpose is obvious. */
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  allLabel: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-1 sm:w-52', className)}>
      <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-muted-foreground)]">{label}</span>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{allLabel}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/** Dropdown options loaded from the backend (`/options/:type`), cached briefly. */
export function useOptions(
  type: OptionType,
  params: { scope?: Scope; scopeId?: string; category?: string; exam?: string } = {},
  enabled = true
) {
  const query = useQuery({
    queryKey: ['catalog', 'options', type, params],
    queryFn: () => catalogApi.options(type, params),
    enabled,
    staleTime: 60_000,
  });
  const options: { value: string; label: string }[] = (query.data ?? []).map((option: Option) => ({
    value: option.id,
    label: option.label,
  }));
  return { options, isLoading: query.isLoading };
}

export function FilterBar({
  state,
  searchPlaceholder,
  children,
  className,
}: {
  state: ListState;
  searchPlaceholder: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end', className)}>
      <SearchBox value={state.search} onChange={state.setSearch} placeholder={searchPlaceholder} className="sm:self-end" />
      {children}
      {state.hasFilters && (
        <Button variant="ghost" size="sm" className="gap-1.5 sm:self-end" onClick={state.clear}>
          <X className="h-4 w-4" /> Clear
        </Button>
      )}
    </div>
  );
}

// ───────────────────────────── list panel (loading / error / empty / pagination) ─────────────────────────────

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

interface ListPanelProps<T> {
  query: UseQueryResult<ListResult<T>>;
  state: ListState;
  columns: string[];
  empty: { icon: LucideIcon; title: string; description: string };
  children: (items: T[]) => ReactNode;
  /** Render without its own card border (inside a dialog). */
  bare?: boolean;
}

export function ListPanel<T>({ query, state, columns, empty, children, bare }: ListPanelProps<T>) {
  const { data, isLoading, isError, isPlaceholderData, refetch } = query;
  const items = data?.items ?? [];
  const pagination = data?.pagination;

  const body =
    isLoading || (isPlaceholderData && !data) ? (
      <ListSkeleton columns={columns} rows={Math.min(state.pageSize, 8)} />
    ) : isError ? (
      <ErrorState message="Could not load this list." onRetry={() => refetch()} className="py-12" />
    ) : items.length === 0 ? (
      state.hasFilters ? (
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
        pageSize={state.pageSize}
        onPageChange={state.setPage}
        onPageSizeChange={state.setPageSize}
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

/** One row's "what's inside" summary, e.g. `2 exams · 4 sets`. */
export function CountChips({ items }: { items: { label: string; value: number }[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item.label}
          className="inline-flex items-center gap-1 rounded-md bg-[var(--color-muted)] px-2 py-0.5 text-xs text-[var(--color-muted-foreground)]"
        >
          <strong className="font-bold text-[var(--color-foreground)]">{item.value.toLocaleString()}</strong>
          {item.label}
        </span>
      ))}
    </div>
  );
}

/** Compact button that opens a related list; its count tells the admin what to expect before clicking. */
export function RelationButton({
  icon: Icon,
  label,
  count,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="h-8 gap-1.5 px-2.5 text-xs"
      onClick={onClick}
      title={`Show ${label.toLowerCase()}`}
    >
      <Icon className="h-3.5 w-3.5 text-[var(--color-primary)]" />
      {label}
      <span className="rounded bg-[var(--color-muted)] px-1.5 py-px text-[10px] font-bold">{count.toLocaleString()}</span>
    </Button>
  );
}

export function FormField({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-[var(--color-muted-foreground)]">{hint}</p>}
    </div>
  );
}

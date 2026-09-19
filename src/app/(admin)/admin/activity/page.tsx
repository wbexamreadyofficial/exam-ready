'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import type { DateRange } from 'react-day-picker';
import { Globe, ScrollText, Search, ShieldAlert, Smartphone, X } from 'lucide-react';

import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TablePagination } from '@/components/ui/table-pagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useDebounce } from '@/hooks/useDebounce';
import { adminApi } from '@/lib/api/admin';
import { ELEVATED_CARD } from '@/lib/constants';
import { formatDate, parseDate } from '@/lib/userFormat';
import type { AuditAction, SecurityEventType } from '@/types/user';

const PAGE_SIZE_OPTIONS = [10, 25, 50];
const timeFormatter = new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

const AUDIT_LABEL: Record<AuditAction, { label: string; variant: 'success' | 'destructive' | 'info' | 'warning' | 'default' }> = {
  'user.admin_created': { label: 'Admin created', variant: 'default' },
  'user.activated': { label: 'Activated', variant: 'success' },
  'user.deactivated': { label: 'Deactivated', variant: 'warning' },
  'user.role_changed': { label: 'Role changed', variant: 'info' },
  'user.updated': { label: 'Edited', variant: 'info' },
  'user.deleted': { label: 'Deleted', variant: 'destructive' },
};

const SECURITY_LABEL: Record<SecurityEventType, string> = {
  login_unknown_number: 'Sign-in attempt',
  otp_unknown_number: 'OTP attempt',
};

function TimeCell({ value }: { value: string }) {
  const date = parseDate(value);
  if (!date) return <span className="text-xs text-[var(--color-muted-foreground)]">—</span>;
  return (
    <time dateTime={date.toISOString()} className="block leading-tight" title={date.toLocaleString('en-IN')}>
      <span className="block text-sm font-semibold">{formatDate(value)}</span>
      <span className="block text-xs text-[var(--color-muted-foreground)]">{timeFormatter.format(date).toUpperCase()}</span>
    </time>
  );
}

function TableSkeleton({ columns, rows }: { columns: string[]; rows: number }) {
  return (
    <div aria-busy="true" aria-label="Loading">
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
                  <Skeleton className="h-4 w-24" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface FilterOption {
  value: string;
  label: string;
}

/** Shared filter bar + pagination state for both tabs. */
function useActivityFilters() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [filter, setFilter] = useState('all');
  const [range, setRange] = useState<DateRange | undefined>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  return {
    search,
    setSearch: (value: string) => {
      setSearch(value);
      setPage(1);
    },
    filter,
    setFilter: (value: string) => {
      setFilter(value);
      setPage(1);
    },
    range,
    setRange: (value: DateRange | undefined) => {
      setRange(value);
      setPage(1);
    },
    page,
    setPage,
    pageSize,
    setPageSize: (value: number) => {
      setPageSize(value);
      setPage(1);
    },
    clear: () => {
      setSearch('');
      setFilter('all');
      setRange(undefined);
      setPage(1);
    },
    hasInput: Boolean(search.trim()) || filter !== 'all' || !!range?.from,
    hasActive: Boolean(debouncedSearch.trim()) || filter !== 'all' || !!range?.from,
    params: {
      search: debouncedSearch.trim() || undefined,
      filter: filter === 'all' ? undefined : filter,
      from: range?.from?.toISOString(),
      to: range?.to?.toISOString(),
      page,
      limit: pageSize,
    },
  };
}

function FilterBar({
  filters,
  searchPlaceholder,
  filterLabel,
  options,
}: {
  filters: ReturnType<typeof useActivityFilters>;
  searchPlaceholder: string;
  filterLabel: string;
  options: FilterOption[];
}) {
  return (
    <Card className={ELEVATED_CARD}>
      <CardContent className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-9"
              value={filters.search}
              onChange={(event) => filters.setSearch(event.target.value)}
            />
          </div>
          <Select value={filters.filter} onValueChange={filters.setFilter}>
            <SelectTrigger className="sm:w-48">
              <SelectValue placeholder={filterLabel} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{`All ${filterLabel}`}</SelectItem>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DateRangePicker
            className="sm:w-72"
            placeholder="Filter by date range"
            value={filters.range}
            onChange={filters.setRange}
          />
          {filters.hasInput && (
            <Button variant="ghost" className="gap-1.5" onClick={filters.clear}>
              <X className="h-4 w-4" /> Clear filters
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */

function AuditTab() {
  const filters = useActivityFilters();

  const { data, isLoading, isError, isPlaceholderData, refetch } = useQuery({
    queryKey: ['admin-audit-logs', filters.params],
    queryFn: () => adminApi.getAuditLogs(filters.params),
    placeholderData: (previous) => previous,
  });

  const logs = data?.logs ?? [];
  const total = data?.pagination.total ?? 0;
  const columns = ['When', 'Admin', 'Action', 'User', 'Details'];

  return (
    <div className="space-y-6">
      <FilterBar
        filters={filters}
        searchPlaceholder="Search by admin, user, or details..."
        filterLabel="Actions"
        options={Object.entries(AUDIT_LABEL).map(([value, { label }]) => ({ value, label }))}
      />

      <Card className={ELEVATED_CARD}>
        <CardContent className="p-0">
          {isLoading || isPlaceholderData ? (
            <TableSkeleton columns={columns} rows={Math.min(filters.pageSize, 8)} />
          ) : isError ? (
            <ErrorState message="Could not load the audit log." onRetry={() => refetch()} className="py-16" />
          ) : total === 0 ? (
            <EmptyState
              icon={filters.hasActive ? Search : ScrollText}
              title={filters.hasActive ? 'No matching entries' : 'No admin activity yet'}
              description={
                filters.hasActive
                  ? 'Try adjusting your search or filters'
                  : 'Creating admins, changing roles, deactivating or deleting users will be recorded here'
              }
              className="py-16"
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead key={column}>{column}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => {
                    const meta = AUDIT_LABEL[log.action];
                    return (
                      <TableRow key={log._id}>
                        <TableCell>
                          <TimeCell value={log.createdAt} />
                        </TableCell>
                        <TableCell className="text-sm font-medium">{log.actorLabel}</TableCell>
                        <TableCell>
                          <Badge variant={meta?.variant ?? 'secondary'} className="text-[10px]">
                            {meta?.label ?? log.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {log.target && log.action !== 'user.deleted' ? (
                            <Link
                              href={`/admin/users/${log.target}`}
                              className="transition-colors hover:text-[var(--color-cta)] hover:underline underline-offset-2"
                            >
                              {log.targetLabel ?? log.target}
                            </Link>
                          ) : (
                            (log.targetLabel ?? '—')
                          )}
                        </TableCell>
                        <TableCell className="max-w-md text-sm text-[var(--color-muted-foreground)]">
                          {log.summary}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <TablePagination
                page={data?.pagination.page ?? filters.page}
                totalPages={data?.pagination.totalPages ?? 1}
                totalItems={total}
                pageSize={filters.pageSize}
                pageSizeOptions={PAGE_SIZE_OPTIONS}
                onPageChange={filters.setPage}
                onPageSizeChange={filters.setPageSize}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function SecurityTab() {
  const filters = useActivityFilters();

  const { data, isLoading, isError, isPlaceholderData, refetch } = useQuery({
    queryKey: ['admin-security-events', filters.params],
    queryFn: () => adminApi.getSecurityEvents(filters.params),
    placeholderData: (previous) => previous,
  });

  const events = data?.events ?? [];
  const total = data?.pagination.total ?? 0;
  const columns = ['Last seen', 'Phone number', 'Type', 'Channel', 'IP address', 'Attempts'];

  return (
    <div className="space-y-6">
      <div className="flex gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/40 px-4 py-3 text-sm text-[var(--color-muted-foreground)]">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-cta)]" />
        <p>
          Sign-in and OTP attempts for phone numbers that don&apos;t match any verified account. Grouped by number, IP
          and hour, and kept for 90 days. Many attempts from one IP or against many numbers can indicate probing.
        </p>
      </div>

      <FilterBar
        filters={filters}
        searchPlaceholder="Search by phone number or IP..."
        filterLabel="Types"
        options={Object.entries(SECURITY_LABEL).map(([value, label]) => ({ value, label }))}
      />

      <Card className={ELEVATED_CARD}>
        <CardContent className="p-0">
          {isLoading || isPlaceholderData ? (
            <TableSkeleton columns={columns} rows={Math.min(filters.pageSize, 8)} />
          ) : isError ? (
            <ErrorState message="Could not load security events." onRetry={() => refetch()} className="py-16" />
          ) : total === 0 ? (
            <EmptyState
              icon={filters.hasActive ? Search : ShieldAlert}
              title={filters.hasActive ? 'No matching events' : 'No suspicious attempts recorded'}
              description={
                filters.hasActive ? 'Try adjusting your search or filters' : 'Nothing to review — that is good news'
              }
              className="py-16"
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead key={column}>{column}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event._id}>
                      <TableCell>
                        <TimeCell value={event.lastAt} />
                      </TableCell>
                      <TableCell className="text-sm tabular-nums">
                        {event.mobileNumber ? `+91 ${event.mobileNumber}` : '—'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px]">
                          {SECURITY_LABEL[event.type] ?? event.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={event.channel === 'app' ? 'info' : 'secondary'} className="gap-1 text-[10px]">
                          {event.channel === 'app' ? <Smartphone className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                          {event.channel === 'app' ? 'App' : 'Web'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{event.ip}</TableCell>
                      <TableCell>
                        <Badge variant={event.count >= 5 ? 'destructive' : 'warning'} className="text-[10px] tabular-nums">
                          {event.count}×
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                page={data?.pagination.page ?? filters.page}
                totalPages={data?.pagination.totalPages ?? 1}
                totalItems={total}
                pageSize={filters.pageSize}
                pageSizeOptions={PAGE_SIZE_OPTIONS}
                onPageChange={filters.setPage}
                onPageSizeChange={filters.setPageSize}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ActivityLogPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity Log"
        description="Admin actions on user accounts, and suspicious sign-in attempts"
      />

      <Tabs defaultValue="audit" className="space-y-6">
        <TabsList>
          <TabsTrigger value="audit" className="gap-2">
            <ScrollText className="h-4 w-4" /> Admin actions
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <ShieldAlert className="h-4 w-4" /> Security events
          </TabsTrigger>
        </TabsList>
        <TabsContent value="audit" className="mt-0">
          <AuditTab />
        </TabsContent>
        <TabsContent value="security" className="mt-0">
          <SecurityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import type { DateRange } from 'react-day-picker';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  CheckCircle2,
  ChevronsUpDown,
  Globe,
  ListChecks,
  Monitor,
  MonitorX,
  Percent,
  Smartphone,
  UserRound,
  X,
  XCircle,
} from 'lucide-react';

import { KpiCard, KpiCardSkeleton } from '@/components/admin/KpiCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { ErrorState } from '@/components/ui/error-state';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TablePagination } from '@/components/ui/table-pagination';

import { usersApi } from '@/lib/api/users';
import { ELEVATED_CARD } from '@/lib/constants';
import {
  describeLocation,
  describeUserAgent,
  formatDate,
  isMobileDevice,
  parseDate,
  timeAgo,
} from '@/lib/userFormat';
import type { LoginListParams } from '@/types/user';

type MethodFilter = 'all' | 'otp' | 'mobile';
type StatusFilter = 'all' | 'success' | 'failed';
type SortColumn = 'createdAt' | 'loginMethod';
type SortOrder = 'asc' | 'desc';

const PAGE_SIZE_OPTIONS = [10, 25, 50];
const timeFormatter = new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

function SortIcon({ column, activeColumn, order }: { column: SortColumn; activeColumn: SortColumn; order: SortOrder }) {
  if (activeColumn !== column) return <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />;
  return order === 'asc' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />;
}

function LoginTableSkeleton({ rows }: { rows: number }) {
  return (
    <div aria-busy="true" aria-label="Loading login history">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date &amp; time</TableHead>
            <TableHead>Device</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>IP address</TableHead>
            <TableHead>Network</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, index) => (
            <TableRow key={index} className="hover:bg-transparent">
              <TableCell>
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </TableCell>
              <TableCell><Skeleton className="h-4 w-36" /></TableCell>
              <TableCell><Skeleton className="h-4 w-40" /></TableCell>
              <TableCell><Skeleton className="h-4 w-28" /></TableCell>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
              <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between gap-4 px-4 py-3 border-t border-[var(--color-border)]">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-8 w-48" />
      </div>
    </div>
  );
}

export default function UserLoginsPage() {
  const { userId } = useParams<{ userId: string }>();

  const [methodFilter, setMethodFilter] = useState<MethodFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [sortColumn, setSortColumn] = useState<SortColumn>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  const listParams: LoginListParams = {
    loginMethod: methodFilter === 'all' ? undefined : methodFilter,
    status: statusFilter === 'all' ? undefined : statusFilter,
    from: dateRange?.from?.toISOString(),
    to: dateRange?.to?.toISOString(),
    sortBy: sortColumn,
    sortOrder,
    page,
    limit: pageSize,
  };

  const { data: result, isLoading, isError, error, isPlaceholderData, refetch } = useQuery({
    queryKey: ['admin-user-logins', userId, listParams],
    queryFn: () => usersApi.getUserLogins(userId, listParams),
    enabled: !!userId,
    placeholderData: (previous) => previous,
    retry: (failureCount, err) => {
      const status = (err as { response?: { status?: number } })?.response?.status;
      return status !== 404 && failureCount < 1;
    },
  });

  const logins = result?.logins ?? [];
  const pagination = result?.pagination;
  const totalItems = pagination?.total ?? 0;
  const totalPages = pagination?.totalPages ?? 1;
  const currentPage = pagination?.page ?? page;
  const hasFilter = methodFilter !== 'all' || statusFilter !== 'all' || !!dateRange?.from;

  const summary = result?.summary;
  const user = result?.user;
  const userName = user ? user.fullName || user.email || user.mobileNumber || 'this user' : undefined;

  const toggleSort = (column: SortColumn) => {
    setPage(1);
    if (sortColumn === column) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortOrder(column === 'createdAt' ? 'desc' : 'asc');
    }
  };

  const sortableHead = (label: string, column: SortColumn) => (
    <TableHead>
      <button
        type="button"
        onClick={() => toggleSort(column)}
        className="flex items-center gap-1.5 hover:text-[var(--color-foreground)]"
      >
        {label} <SortIcon column={column} activeColumn={sortColumn} order={sortOrder} />
      </button>
    </TableHead>
  );

  const notFound = (error as { response?: { status?: number } } | null)?.response?.status === 404;

  return (
    <div className="space-y-6">
      <Link
        href={`/admin/users/${userId}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-cta)]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to {userName ?? 'user'}
      </Link>

      <PageHeader
        title="Login History"
        description={userName ? `Every sign-in recorded for ${userName}` : 'Every sign-in recorded for this user'}
        actions={
          <Button asChild variant="outline" className="gap-2">
            <Link href={`/admin/users/${userId}`}>
              <UserRound className="h-4 w-4" /> View profile
            </Link>
          </Button>
        }
      />

      {!isError && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {!summary ? (
            Array.from({ length: 4 }).map((_, index) => <KpiCardSkeleton key={index} />)
          ) : (
            <>
              <KpiCard
                icon={ListChecks}
                label="Total attempts"
                value={summary.totalAttempts.toLocaleString('en-IN')}
                sub={
                  summary.lastSuccessAt
                    ? `Last success ${timeAgo(summary.lastSuccessAt)}`
                    : 'No successful login yet'
                }
                tone="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              />
              <KpiCard
                icon={CheckCircle2}
                label="Successful"
                value={summary.successful.toLocaleString('en-IN')}
                sub={
                  summary.successRate === null ? undefined : `${summary.successRate}% success rate`
                }
                tone="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
              />
              <KpiCard
                icon={XCircle}
                label="Failed"
                value={summary.failed.toLocaleString('en-IN')}
                sub={
                  summary.lastFailedAt ? `Last failure ${timeAgo(summary.lastFailedAt)}` : 'No failed attempts'
                }
                tone="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
              />
              <KpiCard
                icon={summary.successRate === null ? Percent : Globe}
                label="Unique IPs"
                value={summary.uniqueIps.toLocaleString('en-IN')}
                sub="Distinct networks used"
                tone="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
              />
            </>
          )}
        </div>
      )}

      {!isError && (totalItems > 0 || hasFilter) && (
        <Card className={ELEVATED_CARD}>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Select
                value={methodFilter}
                onValueChange={(value) => {
                  setMethodFilter(value as MethodFilter);
                  setPage(1);
                }}
              >
                <SelectTrigger className="sm:w-48">
                  <SelectValue placeholder="Filter by method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="otp">OTP</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value as StatusFilter);
                  setPage(1);
                }}
              >
                <SelectTrigger className="sm:w-44">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <DateRangePicker
                className="sm:w-72"
                placeholder="Filter by date range"
                value={dateRange}
                onChange={(range) => {
                  setDateRange(range);
                  setPage(1);
                }}
              />
              {hasFilter && (
                <Button
                  variant="ghost"
                  className="gap-1.5"
                  onClick={() => {
                    setMethodFilter('all');
                    setStatusFilter('all');
                    setDateRange(undefined);
                    setPage(1);
                  }}
                >
                  <X className="h-4 w-4" /> Clear filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className={ELEVATED_CARD}>
        <CardContent className="p-0">
          {isLoading || isPlaceholderData ? (
            <LoginTableSkeleton rows={Math.min(pageSize, 10)} />
          ) : isError ? (
            notFound ? (
              <EmptyState
                icon={UserRound}
                title="User not found"
                description="This account doesn't exist or may have been removed."
                className="py-16"
              />
            ) : (
              <ErrorState message="Could not load login history." onRetry={() => refetch()} className="py-16" />
            )
          ) : totalItems === 0 ? (
            <EmptyState
              icon={hasFilter ? MonitorX : Monitor}
              title={hasFilter ? 'No matching logins' : 'No login activity yet'}
              description={hasFilter ? 'Try a different method, status or date range' : 'Sign-ins will appear here'}
              className="py-16"
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    {sortableHead('Date & time', 'createdAt')}
                    <TableHead>Device</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>IP address</TableHead>
                    <TableHead>Network</TableHead>
                    {sortableHead('Method', 'loginMethod')}
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logins.map((login) => {
                    const date = parseDate(login.createdAt);
                    return (
                      <TableRow key={login._id} className={login.status === 'failed' ? 'bg-red-500/5 hover:bg-red-500/10' : undefined}>
                        <TableCell>
                          <p className="text-sm font-semibold">{formatDate(login.createdAt)}</p>
                          <p className="text-xs text-[var(--color-muted-foreground)]" title={timeAgo(login.createdAt)}>
                            {date ? timeFormatter.format(date).toUpperCase() : '—'}
                          </p>
                        </TableCell>
                        <TableCell className="text-sm">
                          <span className="inline-flex items-center gap-2">
                            {isMobileDevice(login.userAgent) ? (
                              <Smartphone className="h-4 w-4 shrink-0 text-[var(--color-muted-foreground)]" />
                            ) : (
                              <Monitor className="h-4 w-4 shrink-0 text-[var(--color-muted-foreground)]" />
                            )}
                            {describeUserAgent(login.userAgent)}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">{describeLocation(login)}</TableCell>
                        <TableCell className="font-mono text-xs">{login.ipInfo.ip}</TableCell>
                        <TableCell className="max-w-56 truncate text-xs text-[var(--color-muted-foreground)]" title={login.ipInfo.org}>
                          {login.ipInfo.org || '—'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={login.loginMethod === 'otp' ? 'info' : 'secondary'} className="gap-1 text-[10px]">
                            <Smartphone className="h-3 w-3" />
                            {login.loginMethod === 'otp' ? 'OTP' : 'Mobile'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {login.status === 'failed' ? (
                            <div className="space-y-1">
                              <Badge variant="destructive" className="gap-1 text-[10px]">
                                <XCircle className="h-3 w-3" /> Failed
                              </Badge>
                              {login.failureReason && (
                                <p className="max-w-40 text-[11px] leading-tight text-red-500">{login.failureReason}</p>
                              )}
                            </div>
                          ) : (
                            <Badge variant="success" className="gap-1 text-[10px]">
                              <CheckCircle2 className="h-3 w-3" /> Success
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
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

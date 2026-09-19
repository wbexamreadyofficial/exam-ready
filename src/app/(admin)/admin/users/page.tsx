'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { DateRange } from 'react-day-picker';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Copy,
  Download,
  Eye,
  Globe,
  History,
  Image as ImageIcon,
  Loader2,
  Mail,
  MoreVertical,
  Pencil,
  Phone,
  Search,
  ShieldCheck,
  Smartphone,
  Trash2,
  UserCheck,
  UserPlus,
  UserX,
  Users,
  X,
} from 'lucide-react';

import { ChangeRoleDialog } from '@/components/admin/ChangeRoleDialog';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { EditUserDialog } from '@/components/admin/EditUserDialog';
import { ExportUsersDialog } from '@/components/admin/ExportUsersDialog';
import { NewAdminDialog } from '@/components/admin/NewAdminDialog';
import { UserAutocomplete } from '@/components/admin/UserAutocomplete';
import { PhotoPreviewDialog } from '@/components/admin/PhotoPreviewDialog';
import { PageHeader } from '@/components/layout/PageHeader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TablePagination } from '@/components/ui/table-pagination';

import { useDebounce } from '@/hooks/useDebounce';
import { getErrorMessage } from '@/lib/api/errors';
import { usersApi } from '@/lib/api/users';
import { ELEVATED_CARD } from '@/lib/constants';
import { cn, generateInitials } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import type { UserRole } from '@/types/auth';
import type { AdminUser, UserSortField, UserSuggestion } from '@/types/user';

type RoleFilter = 'all' | UserRole;
type StatusFilter = 'all' | 'active' | 'inactive';
type SignupFilter = 'all' | 'app' | 'web';
type VerifiedFilter = 'all' | 'verified' | 'unverified';
type SortOrder = 'asc' | 'desc';

const PAGE_SIZE_OPTIONS = [10, 25, 50];

/** Clickable email/phone: muted at rest, brand-orange (CTA) on hover. */
const CONTACT_LINK =
  'inline-flex max-w-full items-center gap-1.5 text-xs text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-cta)] hover:underline underline-offset-2';

const ROLE_LABEL: Record<UserRole, string> = {
  admin: 'Admin',
  examiner: 'Examiner',
  partner: 'Partner',
  student: 'Student',
};

const ROLE_BADGE: Record<UserRole, 'default' | 'info' | 'warning' | 'secondary'> = {
  admin: 'default',
  examiner: 'info',
  partner: 'warning',
  student: 'secondary',
};

const dateFormatter = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

function formatDate(value?: string): string {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date);
}

const timeFormatter = new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

/** Renders a timestamp as date + time (local timezone); "Never" when absent. */
function DateTimeCell({ value }: { value?: string }) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) {
    return <span className="text-xs text-[var(--color-muted-foreground)]">Never</span>;
  }
  return (
    <time dateTime={date.toISOString()} title={date.toLocaleString('en-IN')} className="block leading-tight">
      <span className="block text-xs font-medium">{dateFormatter.format(date)}</span>
      <span className="block text-[11px] text-[var(--color-muted-foreground)]">
        {timeFormatter.format(date).toUpperCase()}
      </span>
    </time>
  );
}

function SortIcon({
  column,
  activeColumn,
  order,
}: {
  column: UserSortField;
  activeColumn: UserSortField;
  order: SortOrder;
}) {
  if (activeColumn !== column) return <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />;
  return order === 'asc' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />;
}

function UserTableSkeleton({ rows }: { rows: number }) {
  return (
    <div aria-busy="true" aria-label="Loading users">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10" />
            <TableHead>User</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Signup</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, index) => (
            <TableRow key={index} className="hover:bg-transparent">
              <TableCell><Skeleton className="h-4 w-4" /></TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
              </TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
              <TableCell><Skeleton className="h-5 w-14 rounded-full" /></TableCell>
              <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell>
                <div className="flex justify-end">
                  <Skeleton className="h-8 w-28" />
                </div>
              </TableCell>
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

export default function UsersAdminPage() {
  const queryClient = useQueryClient();
  const currentUserId = useAuthStore((s) => s.user?.id);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [selectedUser, setSelectedUser] = useState<UserSuggestion | null>(null);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [signupFilter, setSignupFilter] = useState<SignupFilter>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<VerifiedFilter>('all');
  const [joinedRange, setJoinedRange] = useState<DateRange | undefined>();
  const [sortColumn, setSortColumn] = useState<UserSortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [deactivateTarget, setDeactivateTarget] = useState<AdminUser | null>(null);
  const [newAdminOpen, setNewAdminOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminUser | null>(null);
  const [roleTarget, setRoleTarget] = useState<AdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [bulkAction, setBulkAction] = useState<'activate' | 'deactivate' | null>(null);
  const [photoPreview, setPhotoPreview] = useState<{ url: string; name: string } | null>(null);

  const filterParams = {
    userId: selectedUser?._id,
    search: debouncedSearch.trim() || undefined,
    role: roleFilter === 'all' ? undefined : roleFilter,
    isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
    signupSource: signupFilter === 'all' ? undefined : signupFilter,
    verified: verifiedFilter === 'all' ? undefined : verifiedFilter === 'verified',
    joinedFrom: joinedRange?.from?.toISOString(),
    joinedTo: joinedRange?.to?.toISOString(),
    sortBy: sortColumn,
    sortOrder,
  };
  const listParams = { ...filterParams, page, limit: pageSize };

  // Selection belongs to the exact page/filter/sort it was made on, so it is
  // dropped automatically (no effect needed) as soon as any of those change.
  const listKey = JSON.stringify(listParams);
  const [selection, setSelection] = useState<{ key: string; ids: string[] }>({ key: '', ids: [] });
  const selectedIds = selection.key === listKey ? selection.ids : [];

  const { data: result, isLoading, isError, isPlaceholderData, refetch } = useQuery({
    queryKey: ['admin-users', listParams],
    queryFn: () => usersApi.listUsers(listParams),
    placeholderData: (previous) => previous,
  });

  const users = result?.users ?? [];
  const pagination = result?.pagination;
  const totalItems = pagination?.total ?? 0;
  const totalPages = pagination?.totalPages ?? 1;
  const currentPage = pagination?.page ?? page;
  const hasActiveFilters =
    !!selectedUser ||
    Boolean(debouncedSearch.trim()) ||
    roleFilter !== 'all' ||
    statusFilter !== 'all' ||
    signupFilter !== 'all' ||
    verifiedFilter !== 'all' ||
    !!joinedRange?.from;
  const hasFilterInputs =
    !!selectedUser ||
    Boolean(search.trim()) ||
    roleFilter !== 'all' ||
    statusFilter !== 'all' ||
    signupFilter !== 'all' ||
    verifiedFilter !== 'all' ||
    !!joinedRange?.from;

  const selectableIds = users.filter((user) => user._id !== currentUserId).map((user) => user._id);
  const allSelected = selectableIds.length > 0 && selectableIds.every((id) => selectedIds.includes(id));

  const toggleRow = (id: string) =>
    setSelection({
      key: listKey,
      ids: selectedIds.includes(id) ? selectedIds.filter((existing) => existing !== id) : [...selectedIds, id],
    });
  const toggleAllRows = () => setSelection({ key: listKey, ids: allSelected ? [] : selectableIds });

  const statusMutation = useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      usersApi.updateUserStatus(userId, isActive),
    onSuccess: (_user, { isActive }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(isActive ? 'User activated successfully' : 'User deactivated successfully');
      setDeactivateTarget(null);
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error, 'Could not update user status')),
  });

  const invalidateUsers = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    queryClient.invalidateQueries({ queryKey: ['admin-user'] });
    queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
  };

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => usersApi.deleteUser(userId),
    onSuccess: () => {
      invalidateUsers();
      toast.success('User deleted');
      setDeleteTarget(null);
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error, 'Could not delete user')),
  });

  const bulkMutation = useMutation({
    mutationFn: ({ ids, isActive }: { ids: string[]; isActive: boolean }) =>
      usersApi.bulkUpdateStatus(ids, isActive),
    onSuccess: (result, { isActive }) => {
      invalidateUsers();
      const verb = isActive ? 'activated' : 'deactivated';
      toast.success(
        result.skipped > 0
          ? `${result.updated} user(s) ${verb}, ${result.skipped} skipped`
          : `${result.updated} user(s) ${verb}`
      );
      setSelection({ key: listKey, ids: [] });
      setBulkAction(null);
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error, 'Could not update users')),
  });

  const copyToClipboard = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error(`Could not copy ${label.toLowerCase()}`);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedUser(null);
    setRoleFilter('all');
    setStatusFilter('all');
    setSignupFilter('all');
    setVerifiedFilter('all');
    setJoinedRange(undefined);
    setPage(1);
  };

  const toggleSort = (column: UserSortField) => {
    setPage(1);
    if (sortColumn === column) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortOrder(column === 'createdAt' || column === 'lastLoginAt' ? 'desc' : 'asc');
    }
  };

  const sortableHead = (label: string, column: UserSortField) => (
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage registered candidates and admin accounts"
        actions={
          <>
            <Button variant="outline" className="gap-2" onClick={() => setExportOpen(true)}>
              <Download className="h-4 w-4" /> Export CSV
            </Button>
            <Button variant="cta" className="gap-2 font-bold" onClick={() => setNewAdminOpen(true)}>
              <UserPlus className="h-4 w-4" /> New Admin
            </Button>
          </>
        }
      />

      {(totalItems > 0 || hasActiveFilters) && (
        <Card className={ELEVATED_CARD}>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
              <UserAutocomplete
                className="flex-1 sm:max-w-sm"
                inputValue={search}
                onInputChange={(value) => {
                  setSearch(value);
                  setPage(1);
                }}
                selected={selectedUser}
                onSelect={(user) => {
                  setSelectedUser(user);
                  setSearch('');
                  setPage(1);
                }}
              />
              <Select
                value={roleFilter}
                onValueChange={(value) => {
                  setRoleFilter(value as RoleFilter);
                  setPage(1);
                }}
              >
                <SelectTrigger className="sm:w-40">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="examiner">Examiner</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={signupFilter}
                onValueChange={(value) => {
                  setSignupFilter(value as SignupFilter);
                  setPage(1);
                }}
              >
                <SelectTrigger className="sm:w-40">
                  <SelectValue placeholder="Signup source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="app">App</SelectItem>
                  <SelectItem value="web">Web</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={verifiedFilter}
                onValueChange={(value) => {
                  setVerifiedFilter(value as VerifiedFilter);
                  setPage(1);
                }}
              >
                <SelectTrigger className="sm:w-44">
                  <SelectValue placeholder="Phone verified" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Verification</SelectItem>
                  <SelectItem value="verified">Phone verified</SelectItem>
                  <SelectItem value="unverified">Not verified</SelectItem>
                </SelectContent>
              </Select>
              <DateRangePicker
                className="sm:w-72"
                placeholder="Joined between…"
                value={joinedRange}
                onChange={(range) => {
                  setJoinedRange(range);
                  setPage(1);
                }}
              />
              {hasFilterInputs && (
                <Button variant="ghost" className="gap-1.5" onClick={clearFilters}>
                  <X className="h-4 w-4" /> Clear filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 px-4 py-3">
          <p className="text-sm font-semibold">
            {selectedIds.length} user{selectedIds.length > 1 ? 's' : ''} selected
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 text-green-600" onClick={() => setBulkAction('activate')}>
              <UserCheck className="h-4 w-4" /> Activate
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-red-500" onClick={() => setBulkAction('deactivate')}>
              <UserX className="h-4 w-4" /> Deactivate
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelection({ key: listKey, ids: [] })}>
              Clear selection
            </Button>
          </div>
        </div>
      )}

      <Card className={ELEVATED_CARD}>
        <CardContent className="p-0">
          {isLoading || isPlaceholderData ? (
            <UserTableSkeleton rows={Math.min(pageSize, 10)} />
          ) : isError ? (
            <ErrorState message="Could not load users." onRetry={() => refetch()} className="py-16" />
          ) : totalItems === 0 ? (
            <EmptyState
              icon={hasActiveFilters ? Search : Users}
              title={hasActiveFilters ? 'No matching users' : 'No users yet'}
              description={
                hasActiveFilters ? 'Try adjusting your search or filters' : 'Registered users will appear here'
              }
              className="py-16"
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        aria-label="Select all users on this page"
                        checked={allSelected}
                        disabled={selectableIds.length === 0}
                        onCheckedChange={toggleAllRows}
                      />
                    </TableHead>
                    {sortableHead('User', 'fullName')}
                    <TableHead>Phone</TableHead>
                    {sortableHead('Role', 'role')}
                    <TableHead>Signup</TableHead>
                    {sortableHead('Status', 'isActive')}
                    {sortableHead('Last Login', 'lastLoginAt')}
                    {sortableHead('Joined', 'createdAt')}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const isActive = user.isActive !== false;
                    const isSelf = user._id === currentUserId;
                    const displayName = user.fullName || user.email || user.mobileNumber || 'Unnamed user';

                    return (
                      <TableRow key={user._id} data-state={selectedIds.includes(user._id) ? 'selected' : undefined}>
                        <TableCell>
                          <Checkbox
                            aria-label={`Select ${displayName}`}
                            checked={selectedIds.includes(user._id)}
                            disabled={isSelf}
                            title={isSelf ? 'You cannot select your own account' : undefined}
                            onCheckedChange={() => toggleRow(user._id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {user.profilePhoto ? (
                              <button
                                type="button"
                                onClick={() => setPhotoPreview({ url: user.profilePhoto!, name: displayName })}
                                aria-label={`View ${displayName}'s photo`}
                                className="rounded-full transition-shadow hover:ring-2 hover:ring-[var(--color-cta)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cta)]"
                              >
                                <Avatar className="h-9 w-9 cursor-zoom-in">
                                  <AvatarImage src={user.profilePhoto} alt={displayName} />
                                  <AvatarFallback className="text-xs">{generateInitials(displayName)}</AvatarFallback>
                                </Avatar>
                              </button>
                            ) : (
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="text-xs">{generateInitials(displayName)}</AvatarFallback>
                              </Avatar>
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-sm truncate">
                                <Link
                                  href={`/admin/users/${user._id}`}
                                  className="transition-colors hover:text-[var(--color-cta)] hover:underline underline-offset-2"
                                >
                                  {displayName}
                                </Link>
                                {isSelf && <span className="ml-1.5 text-xs font-normal text-[var(--color-muted-foreground)]">(you)</span>}
                              </p>
                              {user.email ? (
                                <a href={`mailto:${user.email}`} title={`Email ${user.email}`} className={CONTACT_LINK}>
                                  <Mail className="h-3 w-3 shrink-0" />
                                  <span className="truncate">{user.email}</span>
                                </a>
                              ) : (
                                <p className="text-xs text-[var(--color-muted-foreground)]">—</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm tabular-nums">
                          {user.mobileNumber ? (
                            <a href={`tel:+91${user.mobileNumber}`} title={`Call ${user.mobileNumber}`} className={cn(CONTACT_LINK, 'text-sm')}>
                              <Phone className="h-3.5 w-3.5 shrink-0" />
                              +91 {user.mobileNumber}
                            </a>
                          ) : (
                            <span className="text-[var(--color-muted-foreground)]">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.role ? (
                            <Badge variant={ROLE_BADGE[user.role]} className="text-[10px]">
                              {ROLE_LABEL[user.role]}
                            </Badge>
                          ) : (
                            <span className="text-xs text-[var(--color-muted-foreground)]">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.isAppUser ? 'info' : 'secondary'} className="gap-1 text-[10px]">
                            {user.isAppUser ? <Smartphone className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                            {user.isAppUser ? 'App' : 'Web'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={isActive ? 'success' : 'destructive'} className="text-[10px]">
                            {isActive ? 'ACTIVE' : 'INACTIVE'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DateTimeCell value={user.lastLoginAt} />
                        </TableCell>
                        <TableCell className="text-xs text-[var(--color-muted-foreground)]">
                          {formatDate(user.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Actions for ${displayName}`}>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52">
                              <DropdownMenuLabel className="truncate">{displayName}</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/users/${user._id}`}>
                                  <Eye className="mr-2 h-4 w-4" /> View details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/users/${user._id}/logins`}>
                                  <History className="mr-2 h-4 w-4" /> Login details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setEditTarget(user)}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit user
                              </DropdownMenuItem>
                              <DropdownMenuItem disabled={isSelf} onClick={() => setRoleTarget(user)}>
                                <ShieldCheck className="mr-2 h-4 w-4" /> Change role
                              </DropdownMenuItem>
                              {user.profilePhoto && (
                                <DropdownMenuItem onClick={() => setPhotoPreview({ url: user.profilePhoto!, name: displayName })}>
                                  <ImageIcon className="mr-2 h-4 w-4" /> View photo
                                </DropdownMenuItem>
                              )}
                              {user.email && (
                                <DropdownMenuItem onClick={() => copyToClipboard(user.email!, 'Email')}>
                                  <Copy className="mr-2 h-4 w-4" /> Copy email
                                </DropdownMenuItem>
                              )}
                              {user.mobileNumber && (
                                <DropdownMenuItem onClick={() => copyToClipboard(user.mobileNumber!, 'Phone number')}>
                                  <Copy className="mr-2 h-4 w-4" /> Copy phone number
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                disabled={isSelf || statusMutation.isPending}
                                onClick={() =>
                                  isActive
                                    ? setDeactivateTarget(user)
                                    : statusMutation.mutate({ userId: user._id, isActive: true })
                                }
                                className={
                                  isActive
                                    ? 'text-red-500 focus:text-red-500'
                                    : 'text-green-600 focus:text-green-600'
                                }
                              >
                                {isActive ? <UserX className="mr-2 h-4 w-4" /> : <UserCheck className="mr-2 h-4 w-4" />}
                                {isActive ? 'Deactivate user' : 'Activate user'}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                disabled={isSelf}
                                onClick={() => setDeleteTarget(user)}
                                className="text-red-500 focus:text-red-500"
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete user
                              </DropdownMenuItem>
                              {isSelf && (
                                <p className="px-2 pb-1.5 text-[11px] text-[var(--color-muted-foreground)]">
                                  You can&apos;t change your own status, role or account.
                                </p>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      <NewAdminDialog open={newAdminOpen} onOpenChange={setNewAdminOpen} />

      <ExportUsersDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        pageUsers={users}
        filteredTotal={totalItems}
        hasActiveFilters={hasActiveFilters}
        filters={filterParams}
      />

      <EditUserDialog user={editTarget} onOpenChange={(open) => !open && setEditTarget(null)} />

      <ChangeRoleDialog user={roleTarget} onOpenChange={(open) => !open && setRoleTarget(null)} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete user"
        description={
          <>
            <strong>{deleteTarget?.fullName || deleteTarget?.email || deleteTarget?.mobileNumber}</strong> will be
            removed from the platform and signed out immediately. Their phone number and email stay reserved, and the
            action is recorded in the activity log.
          </>
        }
        confirmLabel="Delete user"
        destructive
        pending={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget._id)}
      />

      <ConfirmDialog
        open={bulkAction !== null}
        onOpenChange={(open) => !open && setBulkAction(null)}
        title={bulkAction === 'deactivate' ? 'Deactivate selected users' : 'Activate selected users'}
        description={
          bulkAction === 'deactivate'
            ? `${selectedIds.length} user(s) will be signed out and unable to log in until reactivated. Your own account and the last active admin are always skipped.`
            : `${selectedIds.length} user(s) will be able to log in again.`
        }
        confirmLabel={bulkAction === 'deactivate' ? 'Deactivate' : 'Activate'}
        destructive={bulkAction === 'deactivate'}
        pending={bulkMutation.isPending}
        onConfirm={() => bulkAction && bulkMutation.mutate({ ids: selectedIds, isActive: bulkAction === 'activate' })}
      />

      <PhotoPreviewDialog photo={photoPreview} onClose={() => setPhotoPreview(null)} />

      <Dialog open={!!deactivateTarget} onOpenChange={(open) => !open && setDeactivateTarget(null)}>
        <DialogContent className="sm:max-w-105">
          <DialogHeader>
            <DialogTitle>Deactivate User</DialogTitle>
            <DialogDescription>
              <strong>{deactivateTarget?.fullName || deactivateTarget?.email || deactivateTarget?.mobileNumber}</strong>{' '}
              will be signed out and unable to log in until reactivated.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeactivateTarget(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={statusMutation.isPending}
              className="gap-2"
              onClick={() =>
                deactivateTarget && statusMutation.mutate({ userId: deactivateTarget._id, isActive: false })
              }
            >
              {statusMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

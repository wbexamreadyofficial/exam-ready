'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import { format } from 'date-fns';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Download, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { getErrorMessage } from '@/lib/api/errors';
import { usersApi } from '@/lib/api/users';
import { cn } from '@/lib/utils';
import type { AdminUser, UserListParams } from '@/types/user';

type Scope = 'page' | 'filtered' | 'all';
type ExportFilters = Omit<UserListParams, 'page' | 'limit'>;

const dateTime = (value?: string): string => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : format(date, 'yyyy-MM-dd HH:mm');
};

const ROLE_LABEL = { admin: 'Admin', examiner: 'Examiner', partner: 'Partner', student: 'Student' } as const;

interface ColumnDef {
  key: string;
  label: string;
  value: (user: AdminUser) => string;
  defaultOn: boolean;
}

const COLUMNS: ColumnDef[] = [
  { key: 'name', label: 'Name', value: (u) => u.fullName ?? '', defaultOn: true },
  { key: 'email', label: 'Email', value: (u) => u.email ?? '', defaultOn: true },
  { key: 'phone', label: 'Phone', value: (u) => u.mobileNumber ?? '', defaultOn: true },
  { key: 'role', label: 'Role', value: (u) => (u.role ? ROLE_LABEL[u.role] : ''), defaultOn: true },
  { key: 'status', label: 'Status', value: (u) => (u.isActive === false ? 'Inactive' : 'Active'), defaultOn: true },
  { key: 'signup', label: 'Signup source', value: (u) => (u.isAppUser ? 'App' : 'Web'), defaultOn: true },
  { key: 'phoneVerified', label: 'Phone verified', value: (u) => (u.isMobileVerified ? 'Yes' : 'No'), defaultOn: false },
  { key: 'emailVerified', label: 'Email verified', value: (u) => (u.isEmailVerified ? 'Yes' : 'No'), defaultOn: false },
  { key: 'lastLogin', label: 'Last login', value: (u) => dateTime(u.lastLoginAt), defaultOn: true },
  { key: 'joined', label: 'Joined', value: (u) => dateTime(u.createdAt), defaultOn: true },
  { key: 'updated', label: 'Last updated', value: (u) => dateTime(u.updatedAt), defaultOn: false },
  { key: 'id', label: 'User ID', value: (u) => u._id, defaultOn: false },
];

const DEFAULT_COLUMNS = COLUMNS.filter((column) => column.defaultOn).map((column) => column.key);

interface ExportUsersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Rows currently on screen. */
  pageUsers: AdminUser[];
  /** Total users matching the active filters (all pages). */
  filteredTotal: number;
  hasActiveFilters: boolean;
  /** The active filters + sort, without pagination. */
  filters: ExportFilters;
}

/** Builds the CSV in the browser with PapaParse, from the chosen scope and columns. */
export function ExportUsersDialog({
  open,
  onOpenChange,
  pageUsers,
  filteredTotal,
  hasActiveFilters,
  filters,
}: ExportUsersDialogProps) {
  const [scopeChoice, setScopeChoice] = useState<Scope | null>(null);
  const [columns, setColumns] = useState<string[]>(DEFAULT_COLUMNS);

  // Until the user picks one: everything matching the filters if any are
  // active, otherwise every user. "filtered" only makes sense with filters on.
  const defaultScope: Scope = hasActiveFilters ? 'filtered' : 'all';
  const scope: Scope = scopeChoice === 'filtered' && !hasActiveFilters ? defaultScope : (scopeChoice ?? defaultScope);

  const { data: allTotal } = useQuery({
    queryKey: ['admin-users-total'],
    queryFn: async () => (await usersApi.listUsers({ limit: 1 })).pagination.total,
    enabled: open,
    staleTime: 30_000,
  });

  const exportMutation = useMutation({
    mutationFn: async (): Promise<{ users: AdminUser[]; truncated: boolean }> => {
      if (scope === 'page') return { users: pageUsers, truncated: false };
      return usersApi.exportUsers(scope === 'filtered' ? filters : {});
    },
    onSuccess: ({ users, truncated }) => {
      if (users.length === 0) {
        toast.info('There are no users to export for this selection.');
        return;
      }

      const selected = COLUMNS.filter((column) => columns.includes(column.key));
      const csv = Papa.unparse(
        {
          fields: selected.map((column) => column.label),
          data: users.map((user) => selected.map((column) => column.value(user))),
        },
        // Prefixes cells starting with = + - @ so spreadsheets can't run them as formulas.
        { escapeFormulae: true }
      );

      // BOM so Excel reads UTF-8 (e.g. Bengali names) correctly.
      const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `users-${scope === 'all' ? 'all' : scope === 'page' ? 'page' : 'filtered'}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      toast.success(`Exported ${users.length.toLocaleString('en-IN')} user${users.length === 1 ? '' : 's'}`);
      if (truncated) {
        toast.warning('Export is limited to the first 5,000 users — narrow the filters to get the rest.');
      }
      onOpenChange(false);
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error, 'Could not export users')),
  });

  const toggleColumn = (key: string) =>
    setColumns((current) => (current.includes(key) ? current.filter((existing) => existing !== key) : [...current, key]));

  const handleOpenChange = (next: boolean) => {
    if (!next) setScopeChoice(null);
    onOpenChange(next);
  };

  const options: { value: Scope; title: string; description: string }[] = [
    {
      value: 'page',
      title: 'This page',
      description: `${pageUsers.length} row${pageUsers.length === 1 ? '' : 's'} on screen`,
    },
    ...(hasActiveFilters
      ? [
          {
            value: 'filtered' as const,
            title: 'Current filters',
            description: `${filteredTotal.toLocaleString('en-IN')} user${filteredTotal === 1 ? '' : 's'} matching your filters, across all pages`,
          },
        ]
      : []),
    {
      value: 'all',
      title: 'All users',
      description: `${allTotal === undefined ? '…' : allTotal.toLocaleString('en-IN')} total — no filters, exports everyone`,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              <Download className="h-5 w-5" />
            </span>
            <div className="text-left">
              <DialogTitle>Export CSV</DialogTitle>
              <DialogDescription>Choose what to export and which columns to include.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
              Export range
            </p>
            <RadioGroup value={scope} onValueChange={(value) => setScopeChoice(value as Scope)} className="gap-2.5">
              {options.map((option) => (
                <Label
                  key={option.value}
                  htmlFor={`export-scope-${option.value}`}
                  className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors',
                    scope === option.value
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                      : 'border-[var(--color-border)] hover:bg-[var(--color-muted)]/40'
                  )}
                >
                  <RadioGroupItem id={`export-scope-${option.value}`} value={option.value} className="mt-0.5" />
                  <span className="space-y-0.5">
                    <span className="block text-sm font-semibold">{option.title}</span>
                    <span className="block text-xs font-normal text-[var(--color-muted-foreground)]">
                      {option.description}
                    </span>
                  </span>
                </Label>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                Columns
              </p>
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  className="font-medium text-[var(--color-primary)] hover:underline"
                  onClick={() => setColumns(COLUMNS.map((column) => column.key))}
                >
                  All
                </button>
                <span className="text-[var(--color-muted-foreground)]">·</span>
                <button
                  type="button"
                  className="font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:underline"
                  onClick={() => setColumns([])}
                >
                  None
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-4">
              {COLUMNS.map((column) => (
                <div key={column.key} className="flex items-center gap-2.5">
                  <Checkbox
                    id={`export-col-${column.key}`}
                    checked={columns.includes(column.key)}
                    onCheckedChange={() => toggleColumn(column.key)}
                  />
                  <Label htmlFor={`export-col-${column.key}`} className="cursor-pointer text-sm font-normal">
                    {column.label}
                  </Label>
                </div>
              ))}
            </div>
            {columns.length === 0 && <p className="text-xs text-red-500">Select at least one column.</p>}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="cta"
            className="gap-2"
            disabled={columns.length === 0 || exportMutation.isPending}
            onClick={() => exportMutation.mutate()}
          >
            {exportMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Export CSV
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

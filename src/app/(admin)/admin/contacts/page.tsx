'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Archive, Eye, Inbox, Mail, MailCheck, Search, X } from 'lucide-react';

import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TablePagination } from '@/components/ui/table-pagination';
import { useDebounce } from '@/hooks/useDebounce';
import { contactsApi } from '@/lib/api/contacts';
import { getErrorMessage } from '@/lib/api/errors';
import { ELEVATED_CARD } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { ContactMessage, ContactStatus } from '@/types/contact';

const PAGE_SIZE_OPTIONS = [10, 25, 50];
const dateTimeFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const STATUS_COPY: Record<ContactStatus, string> = {
  new: 'New',
  read: 'Read',
  replied: 'Replied',
  archived: 'Archived',
};

const STATUS_STYLE: Record<ContactStatus, string> = {
  new: 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-300',
  read: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-300',
  replied: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300',
  archived: 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300',
};

function StatusBadge({ status }: { status: ContactStatus }) {
  return (
    <span className={cn('inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold', STATUS_STYLE[status])}>
      {STATUS_COPY[status]}
    </span>
  );
}

export default function AdminContactsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);
  const [status, setStatus] = useState<'all' | ContactStatus>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const params = {
    search: debouncedSearch.trim() || undefined,
    status: status === 'all' ? undefined : status,
    page,
    limit: pageSize,
  };
  const { data, isLoading, isError, isPlaceholderData, refetch } = useQuery({
    queryKey: ['admin-contacts', params],
    queryFn: () => contactsApi.list(params),
    placeholderData: (previous) => previous,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, nextStatus }: { id: string; nextStatus: ContactStatus }) =>
      contactsApi.updateStatus(id, nextStatus),
    onSuccess: (contact) => {
      setSelected(contact);
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
      toast.success(`Message marked as ${STATUS_COPY[contact.status].toLowerCase()}`);
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error, 'Could not update this message')),
  });

  const openMessage = (contact: ContactMessage) => {
    setSelected(contact);
    if (contact.status === 'new') {
      statusMutation.mutate({ id: contact._id, nextStatus: 'read' });
    }
  };

  useEffect(() => {
    const contactId = new URLSearchParams(window.location.search).get('message');
    if (!contactId || selected?._id === contactId) return;
    const listed = data?.contacts.find((contact) => contact._id === contactId);
    if (listed) {
      openMessage(listed);
      return;
    }
    let active = true;
    contactsApi.get(contactId).then((contact) => {
      if (active) openMessage(contact);
    }).catch(() => {
      if (active) toast.error('The contact message could not be found.');
    });
    return () => { active = false; };
    // Open a notification target once the first list has loaded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const contacts = data?.contacts ?? [];
  const total = data?.pagination.total ?? 0;
  const hasFilters = Boolean(search.trim()) || status !== 'all';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contact Messages"
        description="Review questions and support requests submitted from the public contact page"
      />

      <Card className={ELEVATED_CARD}>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
            <Input
              value={search}
              onChange={(event) => { setSearch(event.target.value); setPage(1); }}
              placeholder="Search name, email, subject or message…"
              className="pl-9"
            />
          </div>
          <Select value={status} onValueChange={(value) => { setStatus(value as typeof status); setPage(1); }}>
            <SelectTrigger className="sm:w-44"><SelectValue placeholder="All statuses" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="replied">Replied</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button variant="ghost" className="gap-1.5" onClick={() => { setSearch(''); setStatus('all'); setPage(1); }}>
              <X className="h-4 w-4" /> Clear
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className={cn('overflow-hidden', ELEVATED_CARD)}>
        {isLoading || isPlaceholderData ? (
          <div className="space-y-3 p-5" aria-busy="true">
            {Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="h-14 w-full" />)}
          </div>
        ) : isError ? (
          <ErrorState message="Could not load contact messages." onRetry={() => refetch()} className="py-16" />
        ) : contacts.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title={hasFilters ? 'No matching messages' : 'No contact messages yet'}
            description={hasFilters ? 'Try changing or clearing the filters.' : 'New submissions from the contact page will appear here.'}
            className="py-20"
          />
        ) : (
          <>
            <div className="hidden md:block">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Sender</TableHead><TableHead>Subject</TableHead><TableHead>Status</TableHead>
                  <TableHead>Received</TableHead><TableHead className="text-right">Action</TableHead>
                </TableRow></TableHeader>
                <TableBody>{contacts.map((contact) => (
                  <TableRow key={contact._id} className={contact.status === 'new' ? 'bg-orange-50/45 dark:bg-orange-500/5' : undefined}>
                    <TableCell><p className="font-semibold">{contact.name}</p><a href={`mailto:${contact.email}`} className="text-xs text-[var(--color-muted-foreground)] hover:text-[var(--color-cta)]">{contact.email}</a></TableCell>
                    <TableCell className="max-w-md"><p className="truncate font-medium">{contact.subject}</p><p className="mt-1 truncate text-xs text-[var(--color-muted-foreground)]">{contact.message}</p></TableCell>
                    <TableCell><StatusBadge status={contact.status} /></TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-[var(--color-muted-foreground)]">{dateTimeFormatter.format(new Date(contact.createdAt))}</TableCell>
                    <TableCell className="text-right"><Button size="sm" variant="outline" className="gap-1.5" onClick={() => openMessage(contact)}><Eye className="h-3.5 w-3.5" /> View</Button></TableCell>
                  </TableRow>
                ))}</TableBody>
              </Table>
            </div>
            <div className="divide-y divide-[var(--color-border)] md:hidden">
              {contacts.map((contact) => (
                <button key={contact._id} type="button" onClick={() => openMessage(contact)} className="w-full space-y-2 p-4 text-left hover:bg-[var(--color-muted)]/50">
                  <div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{contact.name}</p><p className="text-xs text-[var(--color-muted-foreground)]">{contact.email}</p></div><StatusBadge status={contact.status} /></div>
                  <p className="truncate text-sm font-medium">{contact.subject}</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">{dateTimeFormatter.format(new Date(contact.createdAt))}</p>
                </button>
              ))}
            </div>
            <TablePagination
              page={data?.pagination.page ?? page}
              totalPages={data?.pagination.totalPages ?? 1}
              totalItems={total}
              pageSize={pageSize}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              onPageChange={setPage}
              onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
            />
          </>
        )}
      </Card>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {selected && <>
            <DialogHeader className="pr-8">
              <div className="mb-2 flex items-center gap-2"><StatusBadge status={selected.status} /><span className="text-xs text-[var(--color-muted-foreground)]">{dateTimeFormatter.format(new Date(selected.createdAt))}</span></div>
              <DialogTitle className="text-xl leading-snug">{selected.subject}</DialogTitle>
              <DialogDescription>Message from {selected.name}</DialogDescription>
            </DialogHeader>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-4">
              <p className="whitespace-pre-wrap text-sm leading-7">{selected.message}</p>
            </div>
            <div className="grid gap-2 rounded-xl border border-[var(--color-border)] p-4 text-sm sm:grid-cols-[90px_1fr]">
              <span className="text-[var(--color-muted-foreground)]">Name</span><span className="font-medium">{selected.name}</span>
              <span className="text-[var(--color-muted-foreground)]">Email</span><a href={`mailto:${selected.email}`} className="font-medium text-[var(--color-cta)] hover:underline">{selected.email}</a>
            </div>
            <DialogFooter className="flex-wrap gap-2 sm:space-x-0">
              <Button variant="outline" className="gap-2" asChild><a href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`}><Mail className="h-4 w-4" /> Reply by email</a></Button>
              {selected.status !== 'replied' && <Button variant="outline" className="gap-2" disabled={statusMutation.isPending} onClick={() => statusMutation.mutate({ id: selected._id, nextStatus: 'replied' })}><MailCheck className="h-4 w-4" /> Mark replied</Button>}
              {selected.status !== 'archived' && <Button variant="outline" className="gap-2" disabled={statusMutation.isPending} onClick={() => statusMutation.mutate({ id: selected._id, nextStatus: 'archived' })}><Archive className="h-4 w-4" /> Archive</Button>}
            </DialogFooter>
          </>}
        </DialogContent>
      </Dialog>
    </div>
  );
}

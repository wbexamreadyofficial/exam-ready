'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BellOff, CheckCheck } from 'lucide-react';

import { NotificationRow } from '@/components/notifications/NotificationItem';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import { TablePagination } from '@/components/ui/table-pagination';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useNotificationActions, useNotificationList } from '@/hooks/useNotifications';
import { ELEVATED_CARD } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useNotificationStore } from '@/store/notificationStore';
import type { NotificationItem } from '@/types/notification';

const PAGE_SIZE_OPTIONS = [10, 25, 50];

type View = 'all' | 'unread';

export default function NotificationsPage() {
  const router = useRouter();
  const socketConnected = useNotificationStore((state) => state.socketConnected);

  const [view, setView] = useState<View>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  const { data, isLoading, isError, isPlaceholderData, refetch } = useNotificationList({
    unreadOnly: view === 'unread',
    page,
    limit: pageSize,
  });
  const { markRead, markAllRead, remove } = useNotificationActions();

  const notifications = data?.notifications ?? [];
  const unreadCount = data?.unreadCount ?? 0;
  const total = data?.pagination.total ?? 0;

  const handleOpen = (notification: NotificationItem) => {
    if (!notification.readAt) markRead.mutate(notification._id);
    if (notification.link) router.push(notification.link);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Sign-ups and other activity that needs your attention"
        actions={
          <>
            <span
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-background)]/70 px-3 py-1.5 text-xs font-medium"
              title={
                socketConnected
                  ? 'New notifications arrive instantly.'
                  : 'The live connection is unavailable, so this page checks for new notifications every 30 seconds.'
              }
            >
              <span
                className={cn('h-2 w-2 rounded-full', socketConnected ? 'bg-green-500' : 'bg-amber-500')}
                aria-hidden="true"
              />
              {socketConnected ? 'Live' : 'Checking every 30s'}
            </span>
            <Button
              variant="outline"
              className="gap-2"
              disabled={unreadCount === 0 || markAllRead.isPending}
              onClick={() => markAllRead.mutate()}
            >
              <CheckCheck className="h-4 w-4" /> Mark all as read
            </Button>
          </>
        }
      />

      <Tabs
        value={view}
        onValueChange={(value) => {
          setView(value as View);
          setPage(1);
        }}
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread" className="gap-2">
            Unread
            {unreadCount > 0 && (
              <span className="rounded-full bg-[var(--color-cta)] px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className={cn('overflow-hidden', ELEVATED_CARD)}>
        {isLoading || isPlaceholderData ? (
          <div className="divide-y divide-[var(--color-border)]" aria-busy="true" aria-label="Loading notifications">
            {Array.from({ length: Math.min(pageSize, 6) }).map((_, index) => (
              <div key={index} className="flex gap-3 px-4 py-4">
                <Skeleton className="h-9 w-9 shrink-0 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-full max-w-md" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <ErrorState message="Could not load notifications." onRetry={() => refetch()} className="py-16" />
        ) : total === 0 ? (
          <EmptyState
            icon={BellOff}
            title={view === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            description={
              view === 'unread'
                ? "You're all caught up."
                : 'When a new user signs up you will be notified here, live.'
            }
            className="py-20"
          />
        ) : (
          <>
            <div className="divide-y divide-[var(--color-border)]">
              {notifications.map((notification) => (
                <NotificationRow
                  key={notification._id}
                  notification={notification}
                  onOpen={handleOpen}
                  onMarkRead={(item) => markRead.mutate(item._id)}
                  onDelete={(item) => remove.mutate(item._id)}
                  alwaysShowActions
                />
              ))}
            </div>
            <TablePagination
              page={data?.pagination.page ?? page}
              totalPages={data?.pagination.totalPages ?? 1}
              totalItems={total}
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
      </Card>
    </div>
  );
}

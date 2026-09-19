'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, BellOff, CheckCheck } from 'lucide-react';

import { NotificationRow } from '@/components/notifications/NotificationItem';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ui/error-state';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { useNotificationActions, useNotificationList, useUnreadCount } from '@/hooks/useNotifications';
import type { NotificationItem } from '@/types/notification';

const SHEET_LIMIT = 20;

/** Header bell: unread badge, and a side sheet with the latest notifications. */
export function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: unread = 0 } = useUnreadCount();
  const { data, isLoading, isError, refetch } = useNotificationList({ page: 1, limit: SHEET_LIMIT }, open);
  const { markRead, markAllRead, remove } = useNotificationActions();

  const notifications = data?.notifications ?? [];

  const handleOpen = (notification: NotificationItem) => {
    if (!notification.readAt) markRead.mutate(notification._id);
    if (notification.link) {
      setOpen(false);
      router.push(notification.link);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'}
        >
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-cta)] px-1 text-[10px] font-bold leading-none text-white ring-2 ring-[var(--color-background)]">
              {unread > 99 ? '99+' : unread}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="p-0" aria-describedby={undefined}>
        <SheetHeader className="space-y-1 border-b border-[var(--color-border)] px-5 py-4 pr-12">
          <div className="flex items-center justify-between gap-3">
            <SheetTitle className="flex items-center gap-2">
              Notifications
              {unread > 0 && (
                <span className="rounded-full bg-[var(--color-cta)]/15 px-2 py-0.5 text-xs font-bold text-[var(--color-cta)]">
                  {unread} new
                </span>
              )}
            </SheetTitle>
          </div>
          <SheetDescription>Latest activity on your platform.</SheetDescription>
          {unread > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="-ml-2 mt-1 h-7 w-fit gap-1.5 px-2 text-xs"
              disabled={markAllRead.isPending}
              onClick={() => markAllRead.mutate()}
            >
              <CheckCheck className="h-3.5 w-3.5" /> Mark all as read
            </Button>
          )}
        </SheetHeader>

        <div className="flex flex-1 flex-col overflow-y-auto overscroll-contain divide-y divide-[var(--color-border)]">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex gap-3 px-4 py-3.5">
                <Skeleton className="h-9 w-9 shrink-0 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))
          ) : isError ? (
            <ErrorState message="Could not load notifications." onRetry={() => refetch()} className="flex-1 py-10" />
          ) : notifications.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-10 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-muted)]">
                <BellOff className="h-6 w-6 text-[var(--color-muted-foreground)]" />
              </span>
              <div>
                <p className="font-semibold">You&apos;re all caught up</p>
                <p className="text-sm text-[var(--color-muted-foreground)]">New sign-ups and updates will appear here.</p>
              </div>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationRow
                key={notification._id}
                notification={notification}
                onOpen={handleOpen}
                onMarkRead={(item) => markRead.mutate(item._id)}
                onDelete={(item) => remove.mutate(item._id)}
              />
            ))
          )}
        </div>

        <div className="border-t border-[var(--color-border)] p-3">
          <Button asChild variant="outline" className="w-full" onClick={() => setOpen(false)}>
            <Link href="/admin/notifications">View all notifications</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

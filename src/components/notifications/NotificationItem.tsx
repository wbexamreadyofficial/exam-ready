'use client';

import { Check, Trash2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDateTime, timeAgo } from '@/lib/userFormat';
import { cn } from '@/lib/utils';
import type { NotificationItem as NotificationData, NotificationType } from '@/types/notification';

const TYPE_META: Record<NotificationType, { icon: React.ElementType; tone: string }> = {
  'user.registered': {
    icon: UserPlus,
    tone: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  },
};

const FALLBACK_META = TYPE_META['user.registered'];

interface NotificationRowProps {
  notification: NotificationData;
  /** Clicking the row body: the parent marks it read and follows its link. */
  onOpen: (notification: NotificationData) => void;
  onMarkRead?: (notification: NotificationData) => void;
  onDelete?: (notification: NotificationData) => void;
  /** Keep the action buttons visible instead of showing them on hover. */
  alwaysShowActions?: boolean;
}

export function NotificationRow({
  notification,
  onOpen,
  onMarkRead,
  onDelete,
  alwaysShowActions,
}: NotificationRowProps) {
  const unread = !notification.readAt;
  const { icon: Icon, tone } = TYPE_META[notification.type] ?? FALLBACK_META;

  return (
    <div
      className={cn(
        'group relative flex items-start gap-1 transition-colors hover:bg-[var(--color-muted)]/50',
        unread && 'bg-[var(--color-primary)]/5'
      )}
    >
      <button
        type="button"
        onClick={() => onOpen(notification)}
        className="flex min-w-0 flex-1 items-start gap-3 px-4 py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-ring)]"
      >
        <span className={cn('mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', tone)}>
          <Icon className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className={cn('truncate text-sm', unread ? 'font-bold' : 'font-medium')}>{notification.title}</span>
            {unread && (
              <span
                className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-cta)]"
                role="img"
                aria-label="Unread"
              />
            )}
          </span>
          <span className="mt-0.5 line-clamp-2 block text-sm text-[var(--color-muted-foreground)]">
            {notification.message}
          </span>
          <time
            dateTime={notification.createdAt}
            title={formatDateTime(notification.createdAt)}
            className="mt-1 block text-xs text-[var(--color-muted-foreground)]/80"
          >
            {timeAgo(notification.createdAt)}
          </time>
        </span>
      </button>

      {(onMarkRead || onDelete) && (
        <div
          className={cn(
            'flex shrink-0 items-center gap-0.5 pr-2 pt-3 transition-opacity',
            alwaysShowActions ? 'opacity-100' : 'opacity-0 focus-within:opacity-100 group-hover:opacity-100'
          )}
        >
          {onMarkRead && unread && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label="Mark as read"
              title="Mark as read"
              onClick={() => onMarkRead(notification)}
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-600"
              aria-label="Delete notification"
              title="Delete"
              onClick={() => onDelete(notification)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

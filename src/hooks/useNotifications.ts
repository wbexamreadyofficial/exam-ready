'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api/errors';
import { notificationsApi } from '@/lib/api/notifications';
import { useNotificationStore } from '@/store/notificationStore';
import type { NotificationListParams } from '@/types/notification';

export const NOTIFICATION_KEYS = {
  list: ['notifications'] as const,
  unread: ['notifications-unread'] as const,
};

/** Poll interval used only while the WebSocket is down (e.g. on a serverless host). */
const FALLBACK_POLL_MS = 30_000;

export function useUnreadCount() {
  const socketConnected = useNotificationStore((state) => state.socketConnected);

  return useQuery({
    queryKey: NOTIFICATION_KEYS.unread,
    queryFn: notificationsApi.getUnreadCount,
    refetchInterval: socketConnected ? false : FALLBACK_POLL_MS,
    refetchOnWindowFocus: !socketConnected,
  });
}

export function useNotificationList(params: NotificationListParams, enabled = true) {
  return useQuery({
    queryKey: [...NOTIFICATION_KEYS.list, params],
    queryFn: () => notificationsApi.list(params),
    enabled,
    placeholderData: (previous) => previous,
  });
}

/** Read/delete actions; every one refreshes the list and the badge. */
export function useNotificationActions() {
  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.list });
    queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.unread });
  };

  const markRead = useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: refresh,
  });

  const markAllRead = useMutation({
    mutationFn: notificationsApi.markAllRead,
    onSuccess: (updated) => {
      refresh();
      if (updated > 0) toast.success(`Marked ${updated} notification${updated === 1 ? '' : 's'} as read`);
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error, 'Could not mark notifications as read')),
  });

  const remove = useMutation({
    mutationFn: (id: string) => notificationsApi.remove(id),
    onSuccess: refresh,
    onError: (error: unknown) => toast.error(getErrorMessage(error, 'Could not delete notification')),
  });

  return { markRead, markAllRead, remove, refresh };
}

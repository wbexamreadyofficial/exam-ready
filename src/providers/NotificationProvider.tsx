'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { env } from '@/config/env';
import { NOTIFICATION_KEYS, useUnreadCount } from '@/hooks/useNotifications';
import { getStoredToken } from '@/lib/api/client';
import { notificationsApi } from '@/lib/api/notifications';
import { useNotificationStore } from '@/store/notificationStore';
import type { NotificationItem, SocketMessage } from '@/types/notification';

/** Must match the backend hub (src/realtime/notification-hub.ts). */
const CLOSE_UNAUTHORIZED = 4001;
const CLOSE_SESSION_ENDED = 4002;

const PING_INTERVAL_MS = 25_000;
const MAX_RECONNECT_DELAY_MS = 30_000;
/** Give up on the socket if it never connects (e.g. a serverless host) — polling covers it. */
const MAX_INITIAL_ATTEMPTS = 5;

/**
 * Keeps a WebSocket open for live notifications while an admin is signed in.
 * It reconnects with backoff, refreshes an expired token before retrying, and
 * on an unreachable/serverless backend stops trying and leaves the polling in
 * `useUnreadCount` (30s) to keep the badge current.
 */
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const socketConnected = useNotificationStore((state) => state.socketConnected);
  const setSocketConnected = useNotificationStore((state) => state.setSocketConnected);

  useEffect(() => {
    if (!env.wsUrl || typeof WebSocket === 'undefined') return;

    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
    let pingTimer: ReturnType<typeof setInterval> | undefined;
    let disposed = false;
    let attempts = 0;
    let everConnected = false;

    const refresh = () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.list });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.unread });
    };

    const announce = (notification: NotificationItem) => {
      toast(notification.title, {
        description: notification.message,
        action: notification.link
          ? { label: 'View', onClick: () => router.push(notification.link!) }
          : undefined,
      });
    };

    const scheduleReconnect = () => {
      if (disposed) return;
      if (!everConnected && attempts >= MAX_INITIAL_ATTEMPTS) return;

      const delay = Math.min(MAX_RECONNECT_DELAY_MS, 1_000 * 2 ** attempts) + Math.random() * 500;
      attempts += 1;
      reconnectTimer = setTimeout(connect, delay);
    };

    function connect() {
      if (disposed) return;

      const token = getStoredToken();
      if (!token) {
        scheduleReconnect();
        return;
      }

      const ws = new WebSocket(env.wsUrl);
      socket = ws;
      let authFailed = false;

      // The token goes in the first message, not the URL, so it never lands in server logs.
      ws.onopen = () => ws.send(JSON.stringify({ type: 'auth', token }));

      ws.onmessage = (event) => {
        let message: SocketMessage;
        try {
          message = JSON.parse(String(event.data)) as SocketMessage;
        } catch {
          return;
        }

        switch (message.type) {
          case 'ready':
            attempts = 0;
            everConnected = true;
            setSocketConnected(true);
            pingTimer = setInterval(() => {
              if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'ping' }));
            }, PING_INTERVAL_MS);
            // Anything that arrived while we were offline shows up now.
            refresh();
            break;
          case 'notification':
            refresh();
            announce(message.notification);
            break;
          case 'sync':
            refresh();
            break;
          case 'auth_error':
            authFailed = true;
            break;
        }
      };

      ws.onclose = (event) => {
        if (socket === ws) socket = null;
        clearInterval(pingTimer);
        setSocketConnected(false);

        if (disposed || event.code === CLOSE_SESSION_ENDED) return;

        if (authFailed || event.code === CLOSE_UNAUTHORIZED) {
          // Most likely an expired access token: any authenticated call makes the
          // HTTP layer refresh it, so reconnect only after one has gone through.
          void notificationsApi
            .getUnreadCount()
            .catch(() => undefined)
            .finally(scheduleReconnect);
          return;
        }

        scheduleReconnect();
      };

      // Errors are always followed by `close`, which handles the retry.
      ws.onerror = () => undefined;
    }

    connect();

    return () => {
      disposed = true;
      clearTimeout(reconnectTimer);
      clearInterval(pingTimer);
      socket?.close();
      setSocketConnected(false);
    };
  }, [queryClient, router, setSocketConnected]);

  // With no live socket, the polling badge is the only signal, so surface new arrivals as a toast.
  const { data: unread } = useUnreadCount();
  const previousUnread = useRef<number | null>(null);

  useEffect(() => {
    if (unread === undefined) return;

    if (previousUnread.current !== null && unread > previousUnread.current && !socketConnected) {
      const added = unread - previousUnread.current;
      toast(`${added} new notification${added === 1 ? '' : 's'}`, {
        action: { label: 'View', onClick: () => router.push('/admin/notifications') },
      });
    }

    previousUnread.current = unread;
  }, [unread, socketConnected, router]);

  return <>{children}</>;
}

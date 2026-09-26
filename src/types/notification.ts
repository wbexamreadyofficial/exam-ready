import type { PaginationMeta } from './user';

export type NotificationType = 'user.registered' | 'test.submitted' | 'test.auto_submitted';

/** A row from GET /api/notifications. `readAt` is missing/null while unread. */
export interface NotificationItem {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  /** In-app path this notification points to, e.g. "/admin/users/<id>". */
  link?: string;
  data?: Record<string, unknown>;
  readAt?: string | null;
  createdAt: string;
}

export interface NotificationListParams {
  unreadOnly?: boolean;
  page?: number;
  limit?: number;
}

export interface NotificationListResult {
  notifications: NotificationItem[];
  unreadCount: number;
  pagination: PaginationMeta;
}

/** Messages pushed by the backend over the WebSocket. */
export type SocketMessage =
  | { type: 'ready' }
  | { type: 'pong' }
  | { type: 'sync' }
  | { type: 'auth_error'; message?: string }
  | { type: 'session.replaced'; message?: string }
  | { type: 'notification'; notification: NotificationItem };

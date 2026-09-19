import { apiClient } from './client';
import type { ApiResponse } from '@/types/api';
import type {
  NotificationItem,
  NotificationListParams,
  NotificationListResult,
} from '@/types/notification';
import type { PaginationMeta } from '@/types/user';

interface NotificationListResponse
  extends ApiResponse<{ notifications: NotificationItem[]; unreadCount: number }> {
  pagination: PaginationMeta;
}

/** Wraps the backend's `/api/notifications` routes. Live delivery is a WebSocket (see NotificationProvider). */
export const notificationsApi = {
  list: async (params?: NotificationListParams): Promise<NotificationListResult> => {
    const { data } = await apiClient.get<NotificationListResponse>('/notifications', { params });
    return {
      notifications: data.data.notifications,
      unreadCount: data.data.unreadCount,
      pagination: data.pagination,
    };
  },

  getUnreadCount: async (): Promise<number> => {
    const { data } = await apiClient.get<ApiResponse<{ unreadCount: number }>>('/notifications/unread-count');
    return data.data.unreadCount;
  },

  markRead: async (notificationId: string): Promise<NotificationItem> => {
    const { data } = await apiClient.patch<ApiResponse<{ notification: NotificationItem }>>(
      `/notifications/${notificationId}/read`
    );
    return data.data.notification;
  },

  markAllRead: async (): Promise<number> => {
    const { data } = await apiClient.patch<ApiResponse<{ updated: number }>>('/notifications/read-all');
    return data.data.updated;
  },

  remove: async (notificationId: string): Promise<void> => {
    await apiClient.delete(`/notifications/${notificationId}`);
  },
};

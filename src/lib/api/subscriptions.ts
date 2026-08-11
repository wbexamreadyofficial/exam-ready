import { apiClient } from './client';
import type { ApiResponse } from '@/types/api';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // days
  features: string[];
  isPopular?: boolean;
}

export interface UserSubscription {
  id: string;
  planId: string;
  planName: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  startDate: string;
  endDate: string;
}

export const subscriptionsApi = {
  getPlans: async (): Promise<SubscriptionPlan[]> => {
    const { data } = await apiClient.get<ApiResponse<SubscriptionPlan[]>>('/subscriptions/plans');
    return data.data;
  },

  getMySubscription: async (): Promise<UserSubscription | null> => {
    const { data } = await apiClient.get<ApiResponse<UserSubscription | null>>('/subscriptions/my');
    return data.data;
  },

  subscribe: async (planId: string): Promise<{ paymentUrl: string }> => {
    const { data } = await apiClient.post<ApiResponse<{ paymentUrl: string }>>('/subscriptions/subscribe', { planId });
    return data.data;
  },
};

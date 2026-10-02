import { apiClient } from './client';
import type { ApiResponse } from '@/types/api';

/** Response of `POST /api/admin/payments/orders` (exam-ready-node: razorpay.service.ts `RazorpayOrder`). */
export interface PaymentOrder {
  /** Razorpay order id, e.g. `order_Abc123`. */
  orderId: string;
  /** Amount in PAISE. */
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  /** Public Razorpay key id for Checkout. */
  keyId: string;
}

/** Payload of `POST /api/admin/payments/verify` — exactly what Razorpay Checkout hands back. */
export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export const paymentsApi = {
  /** `amount` is in RUPEES (1 – 100000). */
  createOrder: async (amount: number): Promise<PaymentOrder> => {
    const { data } = await apiClient.post<ApiResponse<PaymentOrder>>('/admin/payments/orders', { amount });
    return data.data;
  },

  verify: async (payload: VerifyPaymentPayload): Promise<void> => {
    await apiClient.post('/admin/payments/verify', payload);
  },
};

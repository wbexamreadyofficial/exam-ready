import { paymentsApi, type PaymentOrder, type VerifyPaymentPayload } from '@/lib/api/payments';

/**
 * Common Razorpay helpers for the frontend. Use `payWithRazorpay` anywhere a
 * payment must be taken (it creates the order, opens Checkout, verifies).
 * Server side lives in exam-ready-node: src/services/razorpay.service.ts.
 */

const CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color: string };
  handler: (response: VerifyPaymentPayload) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: 'payment.failed', cb: (res: { error: { description: string } }) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayInstance;
  }
}

/** Loads Razorpay's checkout.js once. */
export function loadRazorpayScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('Browser only'));
  if (window.Razorpay) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CHECKOUT_SRC}"]`);
    const script = existing ?? document.createElement('script');
    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () => reject(new Error('Could not load Razorpay Checkout. Check your connection.')));
    if (!existing) {
      script.src = CHECKOUT_SRC;
      script.async = true;
      document.body.appendChild(script);
    }
  });
}

export interface OpenCheckoutArgs {
  /** The order returned by `paymentsApi.createOrder`. */
  order: PaymentOrder;
  /** Title shown in the Checkout window. */
  name?: string;
  description?: string;
  prefill?: { name?: string; email?: string; contact?: string };
}

/**
 * Opens Razorpay Checkout for an existing order.
 * Resolves with the signed payment details; rejects if the payment fails or
 * the user closes the window.
 */
export async function openRazorpayCheckout({
  order,
  name = 'Exam Ready',
  description,
  prefill,
}: OpenCheckoutArgs): Promise<VerifyPaymentPayload> {
  await loadRazorpayScript();
  const Razorpay = window.Razorpay;
  if (!Razorpay) throw new Error('Razorpay Checkout is unavailable.');

  return new Promise((resolve, reject) => {
    const checkout = new Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name,
      description,
      prefill,
      theme: { color: '#EA580C' },
      handler: resolve,
      modal: { ondismiss: () => reject(new Error('Payment cancelled.')) },
    });
    checkout.on('payment.failed', (res) => reject(new Error(res.error.description || 'Payment failed.')));
    checkout.open();
  });
}

/**
 * One-call payment: create order -> Checkout -> server-side signature check.
 * `amount` is in RUPEES. Resolves with the verified payment ids.
 */
export async function payWithRazorpay(
  amount: number,
  options: Omit<OpenCheckoutArgs, 'order'> = {}
): Promise<VerifyPaymentPayload> {
  const order = await paymentsApi.createOrder(amount);
  const payment = await openRazorpayCheckout({ order, ...options });
  await paymentsApi.verify(payment);
  return payment;
}

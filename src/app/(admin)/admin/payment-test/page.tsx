'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CheckCircle2, CreditCard, Loader2 } from 'lucide-react';

import { CodeBlock } from '@/components/admin/CodeBlock';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getErrorMessage } from '@/lib/api/errors';
import type { VerifyPaymentPayload } from '@/lib/api/payments';
import { payWithRazorpay } from '@/lib/payments/razorpayCheckout';

export default function AdminPaymentTestPage() {
  const [amount, setAmount] = useState('');
  const [paid, setPaid] = useState<VerifyPaymentPayload | null>(null);

  const value = Number(amount);
  const validAmount = Number.isFinite(value) && value >= 1 && value <= 100000;

  const pay = useMutation({
    mutationFn: () => payWithRazorpay(value, { description: 'Admin payment test' }),
    onSuccess: (payment) => {
      setPaid(payment);
      toast.success('Payment successful and verified');
    },
    onError: (error) => {
      // Checkout rejects with plain Errors (cancelled / failed); API errors are Axios errors.
      const message = error instanceof Error && !('isAxiosError' in error) ? error.message : getErrorMessage(error, 'Payment failed.');
      toast.error(message);
    },
  });

  return (
    <div className="space-y-5">
      <PageHeader title="Payment Test" description="Enter an amount and pay with Razorpay to test the payment flow end to end." />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pay with Razorpay</CardTitle>
            <CardDescription>Amount in rupees, between ₹1 and ₹1,00,000.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="pay-amount">Amount (₹)</Label>
              <Input
                id="pay-amount"
                type="number"
                inputMode="decimal"
                min={1}
                max={100000}
                step="0.01"
                placeholder="e.g. 1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <Button type="button" disabled={!validAmount || pay.isPending} onClick={() => pay.mutate()}>
              {pay.isPending ? <Loader2 size={15} className="animate-spin" /> : <CreditCard size={15} />}
              {pay.isPending ? 'Processing…' : validAmount ? `Pay ₹${value}` : 'Pay'}
            </Button>

            {paid && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                <p className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 size={16} /> Payment verified
                </p>
                <p className="mt-1 break-all">Payment ID: {paid.razorpay_payment_id}</p>
                <p className="break-all">Order ID: {paid.razorpay_order_id}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <PaymentNotes />
      </div>
    </div>
  );
}

const ORDER_FN = `// exam-ready-node: src/services/razorpay.service.ts
createRazorpayOrder(payload: {
  amount: number;                      // RUPEES, 1 – 100000 (converted to paise inside)
  receipt?: string;                    // your reference, max 40 chars
  notes?: Record<string, string>;      // metadata stored on the Razorpay order
  currency?: string;                   // default "INR"
}): Promise<{
  orderId: string;                     // "order_Abc123" -> pass to Checkout
  amount: number;                      // PAISE
  currency: string; receipt: string; status: string;
  keyId: string;                       // public key for Checkout
}>

verifyRazorpayPayment(payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): boolean                            // HMAC-SHA256 check — true only if genuine`;

const API_FN = `// HTTP API (exam-ready-node, needs the bearer token)
POST /api/admin/payments/orders
  body:     { "amount": 1 }                      // rupees
  response: { success, data: { orderId, amount, currency, receipt, status, keyId } }

POST /api/admin/payments/verify
  body:     { razorpay_order_id, razorpay_payment_id, razorpay_signature }
  response: { success: true, data: { verified: true } }   // 400 if signature invalid`;

const FRONT_FN = `// Frontend: src/lib/payments/razorpayCheckout.ts
payWithRazorpay(
  amount: number,                                 // RUPEES
  options?: { name?, description?, prefill?: { name?, email?, contact? } }
): Promise<{ razorpay_order_id, razorpay_payment_id, razorpay_signature }>
// = paymentsApi.createOrder -> openRazorpayCheckout -> paymentsApi.verify

// lower level, same file:
openRazorpayCheckout({ order, name?, description?, prefill? })
// API wrappers: src/lib/api/payments.ts -> paymentsApi.createOrder(amount) / .verify(payload)`;

function PaymentNotes() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Developer notes</CardTitle>
        <CardDescription>Where the payment code lives and how to reuse it.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-[13.5px] leading-relaxed">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <b>Backend (exam-ready-node):</b> <code>src/services/razorpay.service.ts</code> (all Razorpay calls),{' '}
            <code>src/controllers/payment.controller.ts</code>, <code>src/routes/payment.routes.ts</code>,{' '}
            <code>src/schemas/payment.schema.ts</code>. Mounted at <code>/api/admin/payments</code>.
          </li>
          <li>
            <b>Env (backend .env):</b> <code>RAZORPAY_PAYMENT_TOKEN</code> = Key ID, <code>RAZORPAY_KEY_SECRET</code> =
            Key Secret. The secret never reaches the browser.
          </li>
          <li>
            <b>Flow:</b> create order → Razorpay Checkout → verify signature on the server. Always verify before
            granting anything.
          </li>
          <li>
            <b>Heads up:</b> a <code>rzp_live_</code> key charges real money; use a <code>rzp_test_</code> key for
            testing.
          </li>
        </ul>
        <CodeBlock title="Backend functions — arguments" code={ORDER_FN} />
        <CodeBlock title="HTTP API — payloads" code={API_FN} />
        <CodeBlock title="Frontend common function" code={FRONT_FN} />
      </CardContent>
    </Card>
  );
}

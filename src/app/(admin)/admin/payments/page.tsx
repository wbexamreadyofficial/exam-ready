'use client';

import { CreditCard, Download, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/PageHeader';

const MOCK_PAYMENTS = [
  { id: 'pay_101', candidate: 'Sourav Ganguly', plan: 'WB Exam Pass (6M)', amount: 499, status: 'SUCCESS', method: 'UPI', date: '2026-08-10' },
  { id: 'pay_102', candidate: 'Ananya Roy', plan: '1-Year Unlimited Pass', amount: 799, status: 'SUCCESS', method: 'Debit Card', date: '2026-08-09' },
  { id: 'pay_103', candidate: 'Rajesh Mukherjee', plan: 'WB Exam Pass (6M)', amount: 499, status: 'FAILED', method: 'Netbanking', date: '2026-08-08' },
  { id: 'pay_104', candidate: 'Sneha Mitra', plan: '1-Year Unlimited Pass', amount: 799, status: 'SUCCESS', method: 'UPI', date: '2026-08-07' },
];

export default function PaymentsAdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions & Payments"
        description="Track student subscription revenue, payment history & invoices"
        actions={
          <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
        }
      />

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-muted-foreground)]" />
              <Input placeholder="Search payment ID or candidate..." className="pl-9" />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Candidate</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_PAYMENTS.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell className="font-semibold text-sm">{p.candidate}</TableCell>
                  <TableCell className="text-sm">{p.plan}</TableCell>
                  <TableCell className="font-bold text-sm">₹{p.amount}</TableCell>
                  <TableCell className="text-xs text-[var(--color-muted-foreground)]">{p.method}</TableCell>
                  <TableCell>
                    <Badge variant={p.status === 'SUCCESS' ? 'success' : 'destructive'} className="text-[10px]">
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-[var(--color-muted-foreground)]">{p.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

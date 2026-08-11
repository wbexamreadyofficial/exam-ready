'use client';

import { Search, BarChart3, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const MOCK_ALL_RESULTS = [
  { id: 'r1', candidate: 'Sourav Ganguly', exam: 'WBCS Preliminary 2026', score: 148, total: 200, pct: 74.0, date: '2026-08-10' },
  { id: 'r2', candidate: 'Ananya Roy', exam: 'WBPSC Clerkship Mock', score: 88, total: 100, pct: 88.0, date: '2026-08-09' },
  { id: 'r3', candidate: 'Subhashish Das', exam: 'SSC CGL Tier 1 Mock', score: 62, total: 100, pct: 62.0, date: '2026-08-08' },
  { id: 'r4', candidate: 'Priya Banerjee', exam: 'RRB NTPC CBT-1', score: 92, total: 100, pct: 92.0, date: '2026-08-07' },
];

export default function ResultsAdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Exam Submissions & Results</h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">View candidate attempt logs, scores, and performance distribution</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-muted-foreground)]" />
              <Input placeholder="Filter by candidate or exam title..." className="pl-9" />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Exam Title</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_ALL_RESULTS.map((res) => (
                <TableRow key={res.id}>
                  <TableCell className="font-semibold text-sm">{res.candidate}</TableCell>
                  <TableCell className="text-sm">{res.exam}</TableCell>
                  <TableCell className="font-bold text-sm">{res.score} / {res.total}</TableCell>
                  <TableCell>
                    <Badge variant={res.pct >= 60 ? 'success' : 'destructive'} className="text-[10px]">
                      {res.pct}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-[var(--color-muted-foreground)]">{res.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

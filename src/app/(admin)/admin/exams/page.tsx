'use client';

import { useState } from 'react';
import { Plus, Search, FileEdit, Trash2, Globe, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { PageHeader } from '@/components/layout/PageHeader';

const MOCK_EXAMS_ADMIN = [
  { id: 'ex1', title: 'WBCS Preliminary 2026 Full Mock Test', category: 'WBCS', questions: 200, duration: 150, status: 'PUBLISHED', isPaid: false, attempts: 12543 },
  { id: 'ex2', title: 'WBPSC Clerkship Stage 1 Mock', category: 'WBPSC', questions: 100, duration: 90, status: 'PUBLISHED', isPaid: false, attempts: 8234 },
  { id: 'ex3', title: 'SSC CGL Tier-1 Practice Set #5', category: 'SSC', questions: 100, duration: 60, status: 'DRAFT', isPaid: false, attempts: 0 },
  { id: 'ex4', title: 'RRB NTPC CBT-2 Open Exam', category: 'Railway', questions: 120, duration: 90, status: 'PUBLISHED', isPaid: true, attempts: 6540 },
];

export default function ExamsAdminPage() {
  const [exams, setExams] = useState(MOCK_EXAMS_ADMIN);
  const [search, setSearch] = useState('');

  const filtered = exams.filter((e) => e.title.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase()));

  const togglePublish = (id: string) => {
    setExams((prev) => prev.map((e) => (e.id === id ? { ...e, status: e.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' } : e)));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exam Management"
        description="Create, configure, and publish competitive mock tests"
        actions={
          <Button className="font-bold gap-2">
          <Plus className="h-4 w-4" /> Create New Exam
        </Button>
        }
      />

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-muted-foreground)]" />
              <Input
                placeholder="Filter by exam title or category..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Questions / Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Access</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-semibold text-sm">{exam.title}</TableCell>
                  <TableCell><Badge variant="secondary">{exam.category}</Badge></TableCell>
                  <TableCell className="text-xs text-[var(--color-muted-foreground)]">{exam.questions} Qs · {exam.duration} mins</TableCell>
                  <TableCell>
                    <Badge variant={exam.status === 'PUBLISHED' ? 'success' : 'outline'} className="text-[10px]">
                      {exam.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={exam.isPaid ? 'default' : 'secondary'} className="text-[10px]">
                      {exam.isPaid ? 'PRO' : 'FREE'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => togglePublish(exam.id)}>
                      {exam.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <FileEdit className="h-3.5 w-3.5" /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

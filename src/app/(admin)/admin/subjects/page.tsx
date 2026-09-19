'use client';

import { useState } from 'react';
import { Plus, BookOpen, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { PageHeader } from '@/components/layout/PageHeader';

const MOCK_SUBJECTS = [
  { id: 's1', name: 'Indian History & National Movement', questionCount: 2450, examCount: 45 },
  { id: 's2', name: 'Geography of India & West Bengal', questionCount: 1890, examCount: 38 },
  { id: 's3', name: 'Indian Polity & Economy', questionCount: 2100, examCount: 40 },
  { id: 's4', name: 'General Science & Environment', questionCount: 1650, examCount: 30 },
  { id: 's5', name: 'English Language & Comprehension', questionCount: 2300, examCount: 52 },
  { id: 's6', name: 'Logical Reasoning & Mental Ability', questionCount: 1980, examCount: 48 },
];

export default function SubjectsAdminPage() {
  const [subjects] = useState(MOCK_SUBJECTS);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subject Modules"
        description="Organize question bank & syllabus structure into subjects and topics"
        actions={
          <Button className="font-bold gap-2">
          <Plus className="h-4 w-4" /> Add Subject
        </Button>
        }
      />

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject Name</TableHead>
                <TableHead>Question Count</TableHead>
                <TableHead>Exams Linked</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-semibold text-sm flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-[var(--color-primary)]" />
                    {sub.name}
                  </TableCell>
                  <TableCell className="text-sm">{sub.questionCount.toLocaleString()} Qs</TableCell>
                  <TableCell className="text-sm">{sub.examCount} Tests</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm"><Edit className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="sm" className="text-red-500"><Trash2 className="h-3.5 w-3.5" /></Button>
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

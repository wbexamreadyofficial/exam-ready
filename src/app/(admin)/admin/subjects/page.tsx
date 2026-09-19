'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, FileText, HelpCircle, ListChecks, Pencil } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PageHeader } from '@/components/layout/PageHeader';
import { HierarchyGuide } from '@/components/admin/catalog/HierarchyGuide';
import { SubjectEditDialog } from '@/components/admin/catalog/EditDialogs';
import { useRelationHost } from '@/components/admin/catalog/RelationDialog';
import { ACTIVE_OPTIONS, ActiveBadge, FilterBar, FilterSelect, ListPanel, RelationButton, useOptions } from '@/components/admin/catalog/ui';
import { ALL, useListState } from '@/components/admin/catalog/useListState';
import { catalogApi, type SubjectRow } from '@/lib/api/catalog';
import { ELEVATED_CARD } from '@/lib/constants';

export default function SubjectsAdminPage() {
  const relations = useRelationHost();
  const [editing, setEditing] = useState<SubjectRow | null>(null);

  const state = useListState({ category: ALL, isActive: ALL });
  const categories = useOptions('categories');

  const query = useQuery({
    queryKey: ['catalog', 'subjects', state.params],
    queryFn: () => catalogApi.subjects(state.params),
    placeholderData: (previous) => previous,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subjects"
        description="Topics like Mathematics or Reasoning. Every question is labelled with one subject, so you can see which exams and tests use it."
      />

      <HierarchyGuide current="subject" />

      <Card className={ELEVATED_CARD}>
        <CardContent className="p-4">
          <FilterBar state={state} searchPlaceholder="Search subjects by name…">
            <FilterSelect
              label="Exam category"
              value={state.filters.category}
              onChange={(value) => state.setFilters({ category: value })}
              options={categories.options}
              allLabel="All categories"
            />
            <FilterSelect
              label="Status"
              value={state.filters.isActive}
              onChange={(value) => state.setFilters({ isActive: value })}
              options={ACTIVE_OPTIONS}
              allLabel="Active and inactive"
              className="sm:w-48"
            />
          </FilterBar>
        </CardContent>
      </Card>

      <ListPanel
        query={query}
        state={state}
        columns={['Subject', 'Category', 'What uses it', 'Status', 'Actions']}
        empty={{ icon: BookOpen, title: 'No subjects yet', description: 'Subjects appear automatically when you upload a question paper.' }}
      >
        {(subjects) => (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>What uses it</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject._id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 shrink-0 text-[var(--color-primary)]" />
                      <div>
                        <p className="text-sm font-semibold">{subject.name}</p>
                        {subject.nameBn && <p className="text-xs text-[var(--color-muted-foreground)]">{subject.nameBn}</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{subject.category?.name ?? 'Shared'}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      <RelationButton icon={FileText} label="Exams" count={subject.counts.exams} onClick={() => relations.open({ scope: 'subjects', id: subject._id, view: 'exams' })} />
                      <RelationButton icon={ListChecks} label="Question sets" count={subject.counts.questionSets} onClick={() => relations.open({ scope: 'subjects', id: subject._id, view: 'question-sets' })} />
                      <RelationButton icon={HelpCircle} label="Questions" count={subject.counts.questions} onClick={() => relations.open({ scope: 'subjects', id: subject._id, view: 'questions' })} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <ActiveBadge active={subject.isActive} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 gap-1.5" onClick={() => setEditing(subject)}>
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </ListPanel>

      {relations.element}
      {editing && <SubjectEditDialog key={editing._id} subject={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

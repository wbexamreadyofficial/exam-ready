'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/PageHeader';
import { HierarchyGuide } from '@/components/admin/catalog/HierarchyGuide';
import { ExamEditDialog } from '@/components/admin/catalog/EditDialogs';
import { useRelationHost } from '@/components/admin/catalog/RelationDialog';
import { ExamsTable } from '@/components/admin/catalog/tables';
import { ACTIVE_OPTIONS, FilterBar, FilterSelect, LANGUAGE_LABEL, ListPanel, useOptions } from '@/components/admin/catalog/ui';
import { ALL, useListState } from '@/components/admin/catalog/useListState';
import { catalogApi, type ExamRow } from '@/lib/api/catalog';
import { ELEVATED_CARD } from '@/lib/constants';

const LANGUAGE_OPTIONS = Object.entries(LANGUAGE_LABEL).map(([value, label]) => ({ value, label }));

export default function ExamsAdminPage() {
  const relations = useRelationHost();
  const [editing, setEditing] = useState<ExamRow | null>(null);

  const state = useListState({ category: ALL, language: ALL, isActive: ALL });
  const categories = useOptions('categories');

  const query = useQuery({
    queryKey: ['catalog', 'exams', state.params],
    queryFn: () => catalogApi.exams(state.params),
    placeholderData: (previous) => previous,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exams"
        description="Each exam is one paper, like “WB Constable Preliminary 2026”. Open an exam to see its question sets and questions."
      />

      <HierarchyGuide current="exam" />

      <Card className={ELEVATED_CARD}>
        <CardContent className="p-4">
          <FilterBar state={state} searchPlaceholder="Search exams by name or year…">
            <FilterSelect
              label="Exam category"
              value={state.filters.category}
              onChange={(value) => state.setFilters({ category: value })}
              options={categories.options}
              allLabel="All categories"
            />
            <FilterSelect
              label="Language"
              value={state.filters.language}
              onChange={(value) => state.setFilters({ language: value })}
              options={LANGUAGE_OPTIONS}
              allLabel="Any language"
              className="sm:w-44"
            />
            <FilterSelect
              label="Status"
              value={state.filters.isActive}
              onChange={(value) => state.setFilters({ isActive: value })}
              options={ACTIVE_OPTIONS}
              allLabel="Active and inactive"
              className="sm:w-44"
            />
          </FilterBar>
        </CardContent>
      </Card>

      <ListPanel
        query={query}
        state={state}
        columns={['Exam', 'Category', 'Paper pattern', 'Status', 'Actions']}
        empty={{ icon: FileText, title: 'No exams yet', description: 'Exams are created when you upload a question paper.' }}
      >
        {(exams) => (
          <ExamsTable
            items={exams}
            onEdit={setEditing}
            onOpenSets={(exam) => relations.open({ scope: 'exams', id: exam._id, view: 'question-sets' })}
            onOpenQuestions={(exam) => relations.open({ scope: 'exams', id: exam._id, view: 'questions' })}
          />
        )}
      </ListPanel>

      {relations.element}
      {editing && <ExamEditDialog key={editing._id} exam={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

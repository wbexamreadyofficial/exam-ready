'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ListChecks } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/PageHeader';
import { HierarchyGuide } from '@/components/admin/catalog/HierarchyGuide';
import { QuestionSetEditDialog } from '@/components/admin/catalog/EditDialogs';
import { useRelationHost } from '@/components/admin/catalog/RelationDialog';
import { QuestionSetsTable } from '@/components/admin/catalog/tables';
import { FilterBar, FilterSelect, ListPanel, SET_STATUS_OPTIONS, useOptions } from '@/components/admin/catalog/ui';
import { ALL, useListState } from '@/components/admin/catalog/useListState';
import { catalogApi, type QuestionSetRow } from '@/lib/api/catalog';
import { ELEVATED_CARD } from '@/lib/constants';

export default function QuestionSetsAdminPage() {
  const relations = useRelationHost();
  const [editing, setEditing] = useState<QuestionSetRow | null>(null);

  const state = useListState({ category: ALL, exam: ALL, status: ALL });
  const { filters } = state;

  const categories = useOptions('categories');
  const exams = useOptions('exams', { category: filters.category === ALL ? undefined : filters.category });

  const query = useQuery({
    queryKey: ['catalog', 'question-sets', state.params],
    queryFn: () => catalogApi.questionSets(state.params),
    placeholderData: (previous) => previous,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Question Sets"
        description="A question set is one full practice test. It sits inside an exam and holds its questions in order."
      />

      <HierarchyGuide current="set" />

      <Card className={ELEVATED_CARD}>
        <CardContent className="p-4">
          <FilterBar state={state} searchPlaceholder="Search question sets by name or author…">
            <FilterSelect
              label="Exam category"
              value={filters.category}
              onChange={(value) => state.setFilters({ category: value, exam: ALL })}
              options={categories.options}
              allLabel="All categories"
            />
            <FilterSelect
              label="Exam"
              value={filters.exam}
              onChange={(value) => state.setFilters({ exam: value })}
              options={exams.options}
              allLabel={filters.category === ALL ? 'All exams' : 'All exams in this category'}
            />
            <FilterSelect
              label="Status"
              value={filters.status}
              onChange={(value) => state.setFilters({ status: value })}
              options={SET_STATUS_OPTIONS}
              allLabel="Any status"
              className="sm:w-44"
            />
          </FilterBar>
        </CardContent>
      </Card>

      <ListPanel
        query={query}
        state={state}
        columns={['Question set', 'Belongs to', 'Test details', 'Status', 'Actions']}
        empty={{ icon: ListChecks, title: 'No question sets yet', description: 'Upload a question paper to create your first set.' }}
      >
        {(sets) => (
          <QuestionSetsTable
            items={sets}
            onEdit={setEditing}
            onOpenQuestions={(set) => relations.open({ scope: 'question-sets', id: set._id, view: 'questions' })}
          />
        )}
      </ListPanel>

      {relations.element}
      {editing && <QuestionSetEditDialog key={editing._id} set={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

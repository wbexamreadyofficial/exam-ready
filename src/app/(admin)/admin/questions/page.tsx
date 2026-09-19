'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HelpCircle } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/PageHeader';
import { HierarchyGuide } from '@/components/admin/catalog/HierarchyGuide';
import { QuestionEditDialog } from '@/components/admin/catalog/EditDialogs';
import { QuestionDetailDialog } from '@/components/admin/catalog/QuestionDetailDialog';
import { QuestionsTable } from '@/components/admin/catalog/tables';
import { FilterBar, FilterSelect, ListPanel, QUESTION_STATUS_OPTIONS, useOptions } from '@/components/admin/catalog/ui';
import { ALL, useListState } from '@/components/admin/catalog/useListState';
import { ApproveDialog } from '@/components/admin/catalog/ApproveDialog';
import { catalogApi, type QuestionRow } from '@/lib/api/catalog';
import { ELEVATED_CARD } from '@/lib/constants';

export default function QuestionsAdminPage() {
  const [viewing, setViewing] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [approving, setApproving] = useState<QuestionRow | null>(null);

  const state = useListState({ category: ALL, exam: ALL, questionSet: ALL, subject: ALL, status: ALL });
  const { filters } = state;
  const category = filters.category === ALL ? undefined : filters.category;
  const exam = filters.exam === ALL ? undefined : filters.exam;

  // Each dropdown only offers what the one before it allows: category → exam → question set.
  const categories = useOptions('categories');
  const exams = useOptions('exams', { category });
  const sets = useOptions('question-sets', { category, exam });
  const subjects = useOptions('subjects');

  const query = useQuery({
    queryKey: ['catalog', 'questions', state.params],
    queryFn: () => catalogApi.questions(state.params),
    placeholderData: (previous) => previous,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Question Bank"
        description="Every question in one place. Narrow the list step by step: category, then exam, then question set."
      />

      <HierarchyGuide current="question" />

      <Card className={ELEVATED_CARD}>
        <CardContent className="p-4">
          <FilterBar state={state} searchPlaceholder="Search question text, topic or chapter…">
            <FilterSelect
              label="1 · Exam category"
              value={filters.category}
              onChange={(value) => state.setFilters({ category: value, exam: ALL, questionSet: ALL })}
              options={categories.options}
              allLabel="All categories"
              className="sm:w-44"
            />
            <FilterSelect
              label="2 · Exam"
              value={filters.exam}
              onChange={(value) => state.setFilters({ exam: value, questionSet: ALL })}
              options={exams.options}
              allLabel={category ? 'All exams in category' : 'All exams'}
              className="sm:w-44"
            />
            <FilterSelect
              label="3 · Question set"
              value={filters.questionSet}
              onChange={(value) => state.setFilters({ questionSet: value })}
              options={sets.options}
              allLabel={exam ? 'All sets in exam' : 'All question sets'}
              className="sm:w-48"
            />
            <FilterSelect
              label="Subject"
              value={filters.subject}
              onChange={(value) => state.setFilters({ subject: value })}
              options={subjects.options}
              allLabel="All subjects"
              className="sm:w-40"
            />
            <FilterSelect
              label="Status"
              value={filters.status}
              onChange={(value) => state.setFilters({ status: value })}
              options={QUESTION_STATUS_OPTIONS}
              allLabel="Any status"
              className="sm:w-44"
            />
          </FilterBar>
        </CardContent>
      </Card>

      <ListPanel
        query={query}
        state={state}
        columns={['No.', 'Question', 'Belongs to', 'Subject', 'Status', 'Actions']}
        empty={{ icon: HelpCircle, title: 'No questions yet', description: 'Upload a question paper to fill the question bank.' }}
      >
        {(questions) => (
          <QuestionsTable
            items={questions}
            startIndex={((query.data?.pagination.page ?? 1) - 1) * state.pageSize}
            onView={(question) => setViewing(question._id)}
            onEdit={(question) => setEditing(question._id)}
            onApprove={setApproving}
          />
        )}
      </ListPanel>

      <QuestionDetailDialog
        questionId={viewing}
        onClose={() => setViewing(null)}
        onEdit={(questionId) => {
          setViewing(null);
          setEditing(questionId);
        }}
      />
      {editing && <QuestionEditDialog questionId={editing} onClose={() => setEditing(null)} />}
      {approving && <ApproveDialog key={approving._id} question={approving} onClose={() => setApproving(null)} />}
    </div>
  );
}

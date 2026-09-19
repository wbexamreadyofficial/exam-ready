'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, FileText, HelpCircle, ListChecks, Loader2 } from 'lucide-react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  catalogApi,
  type ExamRow,
  type QuestionRow,
  type QuestionSetRow,
  type Scope,
  type ScopeSummary,
  type View,
} from '@/lib/api/catalog';
import { cn } from '@/lib/utils';
import { ApproveDialog } from './ApproveDialog';
import { QuestionEditDialog } from './EditDialogs';
import { QuestionDetailDialog } from './QuestionDetailDialog';
import { ExamsTable, QuestionSetsTable, QuestionsTable } from './tables';
import {
  ACTIVE_OPTIONS,
  FilterBar,
  FilterSelect,
  ListPanel,
  QUESTION_STATUS_OPTIONS,
  SET_STATUS_OPTIONS,
  plural,
  useOptions,
} from './ui';
import { ALL, useListState } from './useListState';

/** Which lists make sense under each kind of record — an exam has no "exams", a set only has questions. */
const VIEWS_FOR_SCOPE: Record<Scope, View[]> = {
  categories: ['exams', 'question-sets', 'questions'],
  subjects: ['exams', 'question-sets', 'questions'],
  exams: ['question-sets', 'questions'],
  'question-sets': ['questions'],
};

const SCOPE_LABEL: Record<Scope, string> = {
  categories: 'Exam category',
  subjects: 'Subject',
  exams: 'Exam',
  'question-sets': 'Question set',
};

const VIEW_META: Record<View, { label: string; icon: typeof FileText; help: (scope: Scope) => string }> = {
  exams: {
    label: 'Exams',
    icon: FileText,
    help: (scope) =>
      scope === 'subjects'
        ? 'Exams that have at least one question from this subject.'
        : 'The exam papers inside this category. Each exam holds its own question sets.',
  },
  'question-sets': {
    label: 'Question sets',
    icon: ListChecks,
    help: (scope) =>
      scope === 'exams'
        ? 'The practice tests inside this exam. Each one is a fixed list of questions.'
        : 'Practice tests (mock tests). Pick an exam to see only its sets.',
  },
  questions: {
    label: 'Questions',
    icon: HelpCircle,
    help: (scope) =>
      scope === 'question-sets'
        ? 'The questions of this test, in the order students see them.'
        : 'Individual questions. Narrow them down by exam, question set or subject.',
  },
};

export interface RelationTarget {
  scope: Scope;
  id: string;
  view: View;
  /** Pre-select a dropdown when the dialog opens (e.g. jump straight to one exam's questions). */
  preset?: { exam?: string; questionSet?: string };
}

/** Owns the relation modal and the question editor it can open, so a page only calls `open(...)`. */
export function useRelationHost() {
  const [target, setTarget] = useState<RelationTarget | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);

  const element = (
    <>
      <RelationDialog target={target} onClose={() => setTarget(null)} onEditQuestion={setEditingQuestion} />
      {editingQuestion && <QuestionEditDialog questionId={editingQuestion} onClose={() => setEditingQuestion(null)} />}
    </>
  );

  return { open: setTarget, editQuestion: setEditingQuestion, element };
}

interface RelationDialogProps {
  target: RelationTarget | null;
  onClose: () => void;
  onEditQuestion?: (questionId: string) => void;
}

/**
 * One modal, three views (Exams / Question sets / Questions) for whatever
 * category, subject, exam or question set was clicked. Each view loads from its
 * own endpoint, and the dropdowns cascade: choosing an exam narrows the
 * question-set dropdown, and both narrow the questions below.
 */
export function RelationDialog({ target, onClose, onEditQuestion }: RelationDialogProps) {
  return (
    <Dialog open={Boolean(target)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[92vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-6xl">
        {target && <RelationBody key={`${target.scope}:${target.id}`} target={target} onEditQuestion={onEditQuestion} />}
      </DialogContent>
    </Dialog>
  );
}

function RelationBody({
  target,
  onEditQuestion,
}: {
  target: RelationTarget;
  onEditQuestion?: (questionId: string) => void;
}) {
  const { scope, id } = target;
  const [nav, setNav] = useState({ view: target.view, preset: target.preset ?? {}, nonce: 0 });

  const { data: summary, isLoading } = useQuery({
    queryKey: ['catalog', 'summary', scope, id],
    queryFn: () => catalogApi.scopeSummary(scope, id),
  });

  const views = VIEWS_FOR_SCOPE[scope];
  const go = (view: View, preset: { exam?: string; questionSet?: string } = {}) =>
    setNav((current) => ({ view, preset, nonce: current.nonce + 1 }));

  const countFor = (view: View) =>
    summary ? (view === 'exams' ? summary.counts.exams : view === 'question-sets' ? summary.counts.questionSets : summary.counts.questions) : undefined;

  return (
    <>
      <DialogHeader className="space-y-2 border-b border-[var(--color-border)] px-6 pb-4 pt-6 pr-12">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary)]">{SCOPE_LABEL[scope]}</p>
        <DialogTitle className="text-xl leading-tight">{summary?.name ?? (isLoading ? 'Loading…' : 'Not found')}</DialogTitle>
        <DialogDescription asChild>
          <div>{summary ? <SummaryLine summary={summary} /> : isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}</div>
        </DialogDescription>

        <div className="flex flex-wrap gap-1.5 pt-1" role="tablist" aria-label="What to show">
          {views.map((view) => {
            const Icon = VIEW_META[view].icon;
            const count = countFor(view);
            const active = nav.view === view;
            return (
              <button
                key={view}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => go(view)}
                className={cn(
                  'flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors',
                  active
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)]'
                    : 'border-[var(--color-border)] hover:bg-[var(--color-muted)]'
                )}
              >
                <Icon className="h-4 w-4" />
                {VIEW_META[view].label}
                {count !== undefined && (
                  <span className={cn('rounded px-1.5 text-[11px]', active ? 'bg-white/20' : 'bg-[var(--color-muted)]')}>
                    {count.toLocaleString()}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </DialogHeader>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4" data-lenis-prevent>
        <ViewPanel key={nav.nonce} scope={scope} id={id} view={nav.view} preset={nav.preset} onJump={go} onEditQuestion={onEditQuestion} />
      </div>
    </>
  );
}

/** "This category has 2 exams → 4 question sets → 400 questions", plus where the record itself sits. */
function SummaryLine({ summary }: { summary: ScopeSummary }) {
  const { counts, scope } = summary;
  const parts: string[] = [];
  if (scope === 'categories' || scope === 'subjects') {
    parts.push(plural(counts.exams, 'exam'), plural(counts.questionSets, 'question set'), plural(counts.questions, 'question'));
  } else if (scope === 'exams') {
    parts.push(plural(counts.questionSets, 'question set'), plural(counts.questions, 'question'));
  } else {
    parts.push(plural(counts.questions, 'question'));
  }

  return (
    <div className="space-y-1 text-sm">
      {summary.parents.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 text-[var(--color-muted-foreground)]">
          {summary.parents.map((parent, index) => (
            <span key={parent.id} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="h-3.5 w-3.5" />}
              <span className="text-xs uppercase">{parent.label}:</span>
              <strong className="text-[var(--color-foreground)]">{parent.name}</strong>
            </span>
          ))}
        </div>
      )}
      <p className="text-[var(--color-muted-foreground)]">
        Contains {parts.join(' → ')}
        {summary.subtitle ? ` · ${summary.subtitle}` : ''}
      </p>
    </div>
  );
}

interface ViewPanelProps {
  scope: Scope;
  id: string;
  view: View;
  preset: { exam?: string; questionSet?: string };
  onJump: (view: View, preset?: { exam?: string; questionSet?: string }) => void;
  onEditQuestion?: (questionId: string) => void;
}

function ViewPanel({ scope, id, view, preset, onJump, onEditQuestion }: ViewPanelProps) {
  const state = useListState({
    status: ALL,
    isActive: ALL,
    exam: preset.exam ?? ALL,
    questionSet: preset.questionSet ?? ALL,
    subject: ALL,
  });
  const [viewingQuestion, setViewingQuestion] = useState<string | null>(null);
  const [approvingQuestion, setApprovingQuestion] = useState<QuestionRow | null>(null);

  const { filters } = state;
  // Dropdowns only show what makes sense here: an exam's own dialog needs no "pick an exam".
  const showExamFilter = view !== 'exams' && (scope === 'categories' || scope === 'subjects');
  const showSetFilter = view === 'questions' && (scope === 'categories' || scope === 'subjects' || scope === 'exams');
  const showSubjectFilter = view === 'questions' && scope !== 'subjects';

  const examOptions = useOptions('exams', { scope, scopeId: id }, showExamFilter);
  const setOptions = useOptions(
    'question-sets',
    { scope, scopeId: id, exam: filters.exam === ALL ? undefined : filters.exam },
    showSetFilter
  );
  const subjectOptions = useOptions('subjects', {}, showSubjectFilter);

  // Only send filters this view understands, so a stale value from another view can never leak in.
  const params = {
    ...state.params,
    isActive: view === 'exams' ? state.params.isActive : undefined,
    status: view === 'exams' ? undefined : state.params.status,
    exam: showExamFilter ? state.params.exam : undefined,
    questionSet: showSetFilter ? state.params.questionSet : undefined,
    subject: showSubjectFilter ? state.params.subject : undefined,
  };

  const query = useQuery({
    queryKey: ['catalog', 'scope', scope, id, view, params],
    queryFn: () => catalogApi.scopeList<ExamRow | QuestionSetRow | QuestionRow>(scope, id, view, params),
    placeholderData: (previous) => previous,
  });

  const columns =
    view === 'exams'
      ? ['Exam', 'Paper pattern', 'Status', 'Actions']
      : view === 'question-sets'
        ? ['Question set', 'Test details', 'Status', 'Actions']
        : ['No.', 'Question', 'Subject', 'Status', 'Actions'];

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--color-muted-foreground)]">{VIEW_META[view].help(scope)}</p>

      <FilterBar
        state={state}
        searchPlaceholder={
          view === 'exams' ? 'Search exams by name…' : view === 'question-sets' ? 'Search question sets by name…' : 'Search question text or topic…'
        }
      >
        {showExamFilter && (
          <FilterSelect
            label="Exam"
            value={filters.exam}
            onChange={(value) => state.setFilters({ exam: value, questionSet: ALL })}
            options={examOptions.options}
            allLabel="All exams"
          />
        )}
        {showSetFilter && (
          <FilterSelect
            label="Question set"
            value={filters.questionSet}
            onChange={(value) => state.setFilters({ questionSet: value })}
            options={setOptions.options}
            allLabel={filters.exam === ALL ? 'All question sets' : 'All sets in this exam'}
          />
        )}
        {showSubjectFilter && (
          <FilterSelect
            label="Subject"
            value={filters.subject}
            onChange={(value) => state.setFilters({ subject: value })}
            options={subjectOptions.options}
            allLabel="All subjects"
          />
        )}
        {view === 'exams' ? (
          <FilterSelect
            label="Status"
            value={filters.isActive}
            onChange={(value) => state.setFilters({ isActive: value })}
            options={ACTIVE_OPTIONS}
            allLabel="Active and inactive"
            className="sm:w-44"
          />
        ) : (
          <FilterSelect
            label="Status"
            value={filters.status}
            onChange={(value) => state.setFilters({ status: value })}
            options={view === 'question-sets' ? SET_STATUS_OPTIONS : QUESTION_STATUS_OPTIONS}
            allLabel="Any status"
            className="sm:w-48"
          />
        )}
      </FilterBar>

      <ListPanel
        bare
        query={query}
        state={state}
        columns={columns}
        empty={{
          icon: VIEW_META[view].icon,
          title: `No ${VIEW_META[view].label.toLowerCase()} here yet`,
          description: 'Nothing has been added under this record so far.',
        }}
      >
        {(items) =>
          view === 'exams' ? (
            <ExamsTable
              items={items as ExamRow[]}
              showCategory={scope !== 'categories'}
              onOpenSets={(exam) => onJump('question-sets', { exam: exam._id })}
              onOpenQuestions={(exam) => onJump('questions', { exam: exam._id })}
            />
          ) : view === 'question-sets' ? (
            <QuestionSetsTable
              items={items as QuestionSetRow[]}
              showParents={scope === 'categories' || scope === 'subjects'}
              onOpenQuestions={(set) => onJump('questions', { exam: set.exam?._id, questionSet: set._id })}
            />
          ) : (
            <QuestionsTable
              items={items as QuestionRow[]}
              showParents={scope !== 'question-sets'}
              showSubject={scope !== 'subjects'}
              startIndex={((query.data?.pagination.page ?? 1) - 1) * state.pageSize}
              onView={(question) => setViewingQuestion(question._id)}
              onApprove={setApprovingQuestion}
            />
          )
        }
      </ListPanel>

      {approvingQuestion && (
        <ApproveDialog
          key={approvingQuestion._id}
          question={approvingQuestion}
          onClose={() => setApprovingQuestion(null)}
        />
      )}

      <QuestionDetailDialog
        questionId={viewingQuestion}
        onClose={() => setViewingQuestion(null)}
        onEdit={
          onEditQuestion
            ? (questionId) => {
                setViewingQuestion(null);
                onEditQuestion(questionId);
              }
            : undefined
        }
      />
    </div>
  );
}

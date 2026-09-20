'use client';

import { CheckCircle2, ChevronRight, Eye, HelpCircle, ListChecks, MoreVertical, Pencil } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ExamRow, QuestionRow, QuestionSetRow } from '@/lib/api/catalog';
import {
  ActiveBadge,
  DIFFICULTY_LABEL,
  LANGUAGE_LABEL,
  QuestionStatusBadge,
  RelationButton,
  SetStatusBadge,
} from './ui';

/** "Category › Exam › Set" — shows where a record sits in the hierarchy. */
export function Chain({ parts }: { parts: (string | undefined | null)[] }) {
  const visible = parts.filter(Boolean) as string[];
  if (visible.length === 0) return <span className="text-[var(--color-muted-foreground)]">—</span>;

  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-xs text-[var(--color-muted-foreground)]">
      {visible.map((part, index) => (
        <span key={`${part}-${index}`} className="flex items-center gap-1">
          {index > 0 && <ChevronRight className="h-3 w-3 shrink-0" />}
          <span className="max-w-[14rem] truncate" title={part}>
            {part}
          </span>
        </span>
      ))}
    </div>
  );
}

const minutes = (value?: number) => (value ? `${value} min` : null);

// ───────────────────────────────── exams ─────────────────────────────────

interface ExamsTableProps {
  items: ExamRow[];
  /** Hide the "Category" column when the list is already inside one category. */
  showCategory?: boolean;
  onEdit?: (exam: ExamRow) => void;
  onOpenSets?: (exam: ExamRow) => void;
  onOpenQuestions?: (exam: ExamRow) => void;
}

export function ExamsTable({ items, showCategory = true, onEdit, onOpenSets, onOpenQuestions }: ExamsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Exam</TableHead>
          {showCategory && <TableHead>Category</TableHead>}
          <TableHead>Paper pattern</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((exam) => {
          const pattern = [
            minutes(exam.pattern?.durationMinutes),
            exam.pattern?.totalQuestions ? `${exam.pattern.totalQuestions} questions` : null,
            exam.pattern?.negativeMarksPerQuestion ? `−${exam.pattern.negativeMarksPerQuestion} per wrong answer` : null,
          ].filter(Boolean);

          return (
            <TableRow key={exam._id}>
              <TableCell>
                <p className="text-sm font-semibold">{exam.title}</p>
                <p className="text-xs text-[var(--color-muted-foreground)]">
                  {[exam.titleBn, exam.year, LANGUAGE_LABEL[exam.language]].filter(Boolean).join(' · ')}
                </p>
              </TableCell>
              {showCategory && (
                <TableCell>
                  <Badge variant="secondary">{exam.category?.name ?? 'No category'}</Badge>
                </TableCell>
              )}
              <TableCell className="text-xs text-[var(--color-muted-foreground)]">
                {pattern.length ? pattern.join(' · ') : 'Not set'}
              </TableCell>
              <TableCell>
                <ActiveBadge active={exam.isActive} />
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap justify-end gap-1.5">
                  {onOpenSets && (
                    <RelationButton icon={ListChecks} label="Question sets" count={exam.counts.questionSets} onClick={() => onOpenSets(exam)} />
                  )}
                  {onOpenQuestions && (
                    <RelationButton icon={HelpCircle} label="Questions" count={exam.counts.questions} onClick={() => onOpenQuestions(exam)} />
                  )}
                  {onEdit && (
                    <Button variant="ghost" size="sm" className="h-8 gap-1.5" onClick={() => onEdit(exam)}>
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

// ───────────────────────────── question sets ─────────────────────────────

interface QuestionSetsTableProps {
  items: QuestionSetRow[];
  /** Show the "Belongs to" column (Category › Exam). Hide it inside an exam. */
  showParents?: boolean;
  onEdit?: (set: QuestionSetRow) => void;
  onOpenQuestions?: (set: QuestionSetRow) => void;
}

export function QuestionSetsTable({ items, showParents = true, onEdit, onOpenQuestions }: QuestionSetsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Question set</TableHead>
          {showParents && <TableHead>Belongs to</TableHead>}
          <TableHead>Test details</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((set) => (
          <TableRow key={set._id}>
            <TableCell>
              <p className="text-sm font-semibold">{set.title.en}</p>
              {set.title.bn && set.title.bn !== set.title.en && (
                <p className="text-xs text-[var(--color-muted-foreground)]">{set.title.bn}</p>
              )}
            </TableCell>
            {showParents && (
              <TableCell>
                <Chain parts={[set.category?.name, set.exam?.title]} />
              </TableCell>
            )}
            <TableCell className="text-xs text-[var(--color-muted-foreground)]">
              {[
                minutes(set.durationMinutes),
                `${set.totalMarks} marks`,
                DIFFICULTY_LABEL[set.difficulty],
                LANGUAGE_LABEL[set.language],
              ]
                .filter(Boolean)
                .join(' · ')}
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap items-center gap-1.5">
                <SetStatusBadge status={set.status} />
                {!set.isActive && <ActiveBadge active={false} />}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap justify-end gap-1.5">
                {onOpenQuestions && (
                  <RelationButton icon={HelpCircle} label="Questions" count={set.questionCount} onClick={() => onOpenQuestions(set)} />
                )}
                {onEdit && (
                  <Button variant="ghost" size="sm" className="h-8 gap-1.5" onClick={() => onEdit(set)}>
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// ─────────────────────────────── questions ───────────────────────────────

interface QuestionsTableProps {
  items: QuestionRow[];
  /** Show the "Belongs to" column (Category › Exam › Set). */
  showParents?: boolean;
  showSubject?: boolean;
  /** Rows before this page, so the serial number keeps counting across pages. */
  startIndex?: number;
  onView?: (question: QuestionRow) => void;
  onEdit?: (question: QuestionRow) => void;
  onApprove?: (question: QuestionRow) => void;
}

export function QuestionsTable({
  items,
  showParents = true,
  showSubject = true,
  startIndex = 0,
  onView,
  onEdit,
  onApprove,
}: QuestionsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">No.</TableHead>
          <TableHead>Question</TableHead>
          {showParents && <TableHead>Belongs to</TableHead>}
          {showSubject && <TableHead>Subject</TableHead>}
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((question, index) => (
          <TableRow key={question._id}>
            <TableCell className="text-sm font-medium text-[var(--color-muted-foreground)]">
              {startIndex + index + 1}
            </TableCell>
            <TableCell className="max-w-md">
              <p className="line-clamp-2 text-sm">{question.questionText.en || question.questionText.bn || '(no text)'}</p>
              {question.questionText.en && question.questionText.bn && (
                <p className="line-clamp-1 text-xs text-[var(--color-muted-foreground)]">{question.questionText.bn}</p>
              )}
            </TableCell>
            {showParents && (
              <TableCell>
                <Chain parts={[question.category?.name, question.exam?.title, question.questionSet?.title.en]} />
              </TableCell>
            )}
            {showSubject && <TableCell className="text-sm">{question.subject?.name ?? '—'}</TableCell>}
            <TableCell>
              <div className="flex flex-wrap items-center gap-1.5">
                <QuestionStatusBadge status={question.status} />
                {question.needsReview && (
                  <Badge variant="warning" className="text-[10px]" title="Some details are missing and must be completed before approval">
                    Needs review
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full text-[var(--color-muted-foreground)] hover:bg-orange-50 hover:text-[#c95817] data-[state=open]:bg-orange-50 data-[state=open]:text-[#c95817]"
                      aria-label={`Actions for question ${question.questionNumber ?? ''}`}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44 rounded-xl p-1.5 shadow-xl">
                    {onView && (
                      <DropdownMenuItem
                        className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 focus:bg-orange-50 focus:text-[#c95817] dark:focus:bg-orange-500/10"
                        onSelect={() => onView(question)}
                      >
                        <Eye className="h-4 w-4" /> View
                      </DropdownMenuItem>
                    )}
                    {onEdit && (
                      <DropdownMenuItem
                        className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 focus:bg-orange-50 focus:text-[#c95817] dark:focus:bg-orange-500/10"
                        onSelect={() => onEdit(question)}
                      >
                        <Pencil className="h-4 w-4" /> Edit
                      </DropdownMenuItem>
                    )}
                    {onApprove && question.status !== 'approved' && (
                      <DropdownMenuItem
                        className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 font-semibold text-green-700 focus:bg-green-50 focus:text-green-700 dark:text-green-400 dark:focus:bg-green-900/20"
                        onSelect={() => onApprove(question)}
                      >
                        <CheckCircle2 className="h-4 w-4" /> Approve
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

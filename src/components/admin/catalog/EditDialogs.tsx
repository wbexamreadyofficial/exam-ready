'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ErrorState } from '@/components/ui/error-state';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { getErrorMessage } from '@/lib/api/errors';
import {
  catalogApi,
  type ExamRow,
  type Language,
  type QuestionDetail,
  type QuestionSetRow,
  type QuestionStatus,
  type SetStatus,
  type SubjectRow,
} from '@/lib/api/catalog';
import { LANGUAGE_LABEL, DIFFICULTY_LABEL, QUESTION_STATUS, SET_STATUS, FormField, useOptions } from './ui';

const NONE = 'none';

const ORANGE_BUTTON =
  'gap-2 border-0 bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] font-semibold text-white shadow-md shadow-orange-600/30 ring-1 ring-inset ring-white/25 transition-all hover:-translate-y-px hover:bg-transparent hover:brightness-110 hover:shadow-lg hover:shadow-orange-600/40 disabled:opacity-60 disabled:shadow-none';

/** Modal frame: fixed themed header and footer, only the middle scrolls. */
function EditFrame({
  title,
  description,
  onClose,
  wide,
  body,
  footer,
  as,
  onSubmit,
}: {
  title: string;
  description: string;
  onClose: () => void;
  wide?: boolean;
  body: ReactNode;
  footer?: ReactNode;
  as?: 'form';
  onSubmit?: (event: FormEvent) => void;
}) {
  const Wrapper = as === 'form' ? 'form' : 'div';
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={`flex max-h-[90vh] flex-col gap-0 overflow-hidden rounded-2xl border-orange-200/60 p-0 shadow-2xl shadow-orange-900/20 dark:border-orange-400/20 ${
          wide ? 'sm:max-w-3xl' : 'sm:max-w-xl'
        }`}
      >
        <DialogHeader className="shrink-0 space-y-1.5 border-b border-orange-200/60 bg-gradient-to-br from-orange-50 via-white to-orange-50/40 px-6 pb-4 pt-6 pr-12 text-left dark:border-orange-400/15 dark:from-orange-500/10 dark:via-transparent dark:to-transparent">
          <DialogTitle className="text-xl leading-tight">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Wrapper onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5" data-lenis-prevent>
            {body}
          </div>
          {footer && (
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-orange-200/60 bg-gradient-to-r from-white via-orange-50/40 to-orange-50/70 px-6 py-3.5 dark:border-orange-400/15 dark:from-transparent dark:via-transparent dark:to-orange-500/10">
              {footer}
            </div>
          )}
        </Wrapper>
      </DialogContent>
    </Dialog>
  );
}

/** Dialog + form + Save/Cancel + toast + refresh of every catalog list, shared by all four editors. */
function EditShell({
  title,
  description,
  onClose,
  save,
  children,
  wide,
}: {
  title: string;
  description: string;
  onClose: () => void;
  save: () => Promise<unknown>;
  children: ReactNode;
  wide?: boolean;
}) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: save,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalog'] });
      toast.success('Saved');
      onClose();
    },
    onError: (error: unknown) =>
      toast.error(
        error instanceof Error && !isAxiosError(error) ? error.message : getErrorMessage(error, 'Could not save your changes')
      ),
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    mutation.mutate();
  };

  return (
    <EditFrame
      as="form"
      onSubmit={submit}
      title={title}
      description={description}
      onClose={onClose}
      wide={wide}
      body={children}
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending} className={ORANGE_BUTTON}>
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </>
      }
    />
  );
}

function ActiveSwitch({ checked, onChange, hint }: { checked: boolean; onChange: (value: boolean) => void; hint: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-[var(--color-border)] px-3 py-2.5">
      <div>
        <p className="text-sm font-medium">Active</p>
        <p className="text-xs text-[var(--color-muted-foreground)]">{hint}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

const optionalNumber = (value: string): number | undefined => {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
};

// ───────────────────────────────── subject ─────────────────────────────────

export function SubjectEditDialog({ subject, onClose }: { subject: SubjectRow; onClose: () => void }) {
  const [name, setName] = useState(subject.name);
  const [nameBn, setNameBn] = useState(subject.nameBn ?? '');
  const [description, setDescription] = useState(subject.description ?? '');
  const [category, setCategory] = useState(subject.category?._id ?? NONE);
  const [isActive, setIsActive] = useState(subject.isActive);
  const { options: categories } = useOptions('categories');

  return (
    <EditShell
      title="Edit subject"
      description="Subjects group questions by topic, like Mathematics or Reasoning."
      onClose={onClose}
      save={() =>
        catalogApi.updateSubject(subject._id, {
          name: name.trim(),
          nameBn: nameBn.trim(),
          description: description.trim(),
          category: category === NONE ? null : category,
          isActive,
        })
      }
    >
      <FormField label="Subject name" required>
        <Input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
      </FormField>
      <FormField label="Name in Bengali">
        <Input value={nameBn} onChange={(e) => setNameBn(e.target.value)} />
      </FormField>
      <FormField label="Exam category" hint="Optional. Leave as “Shared” if this subject is used by several categories.">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE}>Shared (no single category)</SelectItem>
            {categories.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Description">
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </FormField>
      <ActiveSwitch checked={isActive} onChange={setIsActive} hint="Turn off to hide this subject without deleting anything." />
    </EditShell>
  );
}

// ────────────────────────────────── exam ──────────────────────────────────

export function ExamEditDialog({ exam, onClose }: { exam: ExamRow; onClose: () => void }) {
  const [title, setTitle] = useState(exam.title);
  const [titleBn, setTitleBn] = useState(exam.titleBn ?? '');
  const [category, setCategory] = useState(exam.category?._id ?? '');
  const [year, setYear] = useState(exam.year ? String(exam.year) : '');
  const [language, setLanguage] = useState<Language>(exam.language);
  const [description, setDescription] = useState(exam.description ?? '');
  const [isActive, setIsActive] = useState(exam.isActive);
  const [duration, setDuration] = useState(String(exam.pattern?.durationMinutes ?? ''));
  const [totalQuestions, setTotalQuestions] = useState(String(exam.pattern?.totalQuestions ?? ''));
  const [marks, setMarks] = useState(String(exam.pattern?.marksPerQuestion ?? ''));
  const [negative, setNegative] = useState(String(exam.pattern?.negativeMarksPerQuestion ?? ''));
  const [passing, setPassing] = useState(String(exam.pattern?.passingMarks ?? ''));
  const { options: categories } = useOptions('categories');

  return (
    <EditShell
      title="Edit exam"
      description="An exam is one paper, such as “WB Constable Preliminary 2026”. Its question sets are the practice tests inside it."
      onClose={onClose}
      wide
      save={() =>
        catalogApi.updateExam(exam._id, {
          title: title.trim(),
          titleBn: titleBn.trim(),
          description: description.trim(),
          category: category || undefined,
          year: optionalNumber(year),
          language,
          isActive,
          pattern: {
            durationMinutes: optionalNumber(duration),
            totalQuestions: optionalNumber(totalQuestions),
            marksPerQuestion: optionalNumber(marks),
            negativeMarksPerQuestion: optionalNumber(negative),
            passingMarks: optionalNumber(passing),
          },
        })
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Exam name" required>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required minLength={3} />
        </FormField>
        <FormField label="Name in Bengali">
          <Input value={titleBn} onChange={(e) => setTitleBn(e.target.value)} />
        </FormField>
        <FormField label="Exam category" required hint="Moving an exam changes which category it appears under.">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Year">
          <Input type="number" min={2000} max={2100} value={year} onChange={(e) => setYear(e.target.value)} />
        </FormField>
        <FormField label="Language of the paper">
          <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(LANGUAGE_LABEL) as Language[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {LANGUAGE_LABEL[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Paper pattern</p>
        <p className="mb-3 text-xs text-[var(--color-muted-foreground)]">
          New question sets under this exam start with these numbers.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <FormField label="Time (minutes)">
            <Input type="number" min={1} value={duration} onChange={(e) => setDuration(e.target.value)} />
          </FormField>
          <FormField label="Total questions">
            <Input type="number" min={1} value={totalQuestions} onChange={(e) => setTotalQuestions(e.target.value)} />
          </FormField>
          <FormField label="Marks per question">
            <Input type="number" min={0} step="0.25" value={marks} onChange={(e) => setMarks(e.target.value)} />
          </FormField>
          <FormField label="Marks lost per wrong answer">
            <Input type="number" min={0} step="0.25" value={negative} onChange={(e) => setNegative(e.target.value)} />
          </FormField>
          <FormField label="Passing marks">
            <Input type="number" min={0} value={passing} onChange={(e) => setPassing(e.target.value)} />
          </FormField>
        </div>
      </div>

      <FormField label="Description">
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </FormField>
      <ActiveSwitch checked={isActive} onChange={setIsActive} hint="Turn off to hide this exam from students." />
    </EditShell>
  );
}

// ───────────────────────────────── question set ─────────────────────────────────

export function QuestionSetEditDialog({ set, onClose }: { set: QuestionSetRow; onClose: () => void }) {
  const [titleEn, setTitleEn] = useState(set.title.en);
  const [titleBn, setTitleBn] = useState(set.title.bn ?? '');
  const [description, setDescription] = useState(set.description ?? '');
  const [difficulty, setDifficulty] = useState(set.difficulty);
  const [status, setStatus] = useState<SetStatus>(set.status);
  const [isActive, setIsActive] = useState(set.isActive);

  return (
    <EditShell
      title="Edit question set"
      description="A question set is one practice test. It belongs to an exam and holds its questions in order."
      onClose={onClose}
      save={() =>
        catalogApi.updateQuestionSet(set._id, {
          title: { en: titleEn.trim(), bn: titleBn.trim() },
          description: description.trim(),
          difficulty,
          status,
          isActive,
        })
      }
    >
      <FormField label="Name (English)" required>
        <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required minLength={2} />
      </FormField>
      <FormField label="Name (Bengali)">
        <Input value={titleBn} onChange={(e) => setTitleBn(e.target.value)} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Difficulty">
          <Select value={difficulty} onValueChange={(value) => setDifficulty(value as typeof difficulty)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DIFFICULTY_LABEL).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Visibility" hint={SET_STATUS[status].hint}>
          <Select value={status} onValueChange={(value) => setStatus(value as SetStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(SET_STATUS) as SetStatus[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {SET_STATUS[key].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>
      <FormField label="Description">
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </FormField>
      <ActiveSwitch checked={isActive} onChange={setIsActive} hint="Turn off to switch this test off without deleting it." />
    </EditShell>
  );
}

// ─────────────────────────────────── question ───────────────────────────────────

const LETTERS = ['A', 'B', 'C', 'D'];

function QuestionForm({ question, onClose }: { question: QuestionDetail; onClose: () => void }) {
  const [textEn, setTextEn] = useState(question.questionText.en ?? '');
  const [textBn, setTextBn] = useState(question.questionText.bn ?? '');
  const [options, setOptions] = useState(() =>
    Array.from({ length: 4 }, (_, index) => ({ en: question.options[index]?.en ?? '', bn: question.options[index]?.bn ?? '' }))
  );
  const [correct, setCorrect] = useState<number>(question.correctOptionIndex ?? -1);
  const [expEn, setExpEn] = useState(question.explanation?.en ?? '');
  const [expBn, setExpBn] = useState(question.explanation?.bn ?? '');
  const [topic, setTopic] = useState(question.topic ?? '');
  const [chapter, setChapter] = useState(question.chapter ?? '');
  const [status, setStatus] = useState<QuestionStatus>(question.status);
  const [reason, setReason] = useState(question.rejectionReason ?? '');

  const setOption = (index: number, key: 'en' | 'bn', value: string) =>
    setOptions((current) => current.map((option, i) => (i === index ? { ...option, [key]: value } : option)));

  return (
    <EditShell
      title="Edit question"
      description="Change the wording, the four answer choices, or the correct answer."
      onClose={onClose}
      wide
      save={async () => {
        if (status === 'approved' && correct < 0) {
          throw new Error('Choose the correct answer before approving this question.');
        }
        return catalogApi.updateQuestion(question._id, {
          questionText: { en: textEn.trim(), bn: textBn.trim() },
          options: options.map((option) => ({ en: option.en.trim(), bn: option.bn.trim() })),
          ...(correct >= 0 ? { correctOptionIndex: correct } : {}),
          explanation: { en: expEn.trim(), bn: expBn.trim() },
          topic: topic.trim(),
          chapter: chapter.trim(),
          status,
          ...(status === 'rejected' ? { rejectionReason: reason.trim() } : {}),
        });
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Question (English)">
          <Textarea value={textEn} onChange={(e) => setTextEn(e.target.value)} rows={3} />
        </FormField>
        <FormField label="Question (Bengali)">
          <Textarea value={textBn} onChange={(e) => setTextBn(e.target.value)} rows={3} />
        </FormField>
      </div>

      <div>
        <p className="mb-1 text-sm font-medium">Answer choices</p>
        <p className="mb-3 text-xs text-[var(--color-muted-foreground)]">Tick the circle beside the correct answer.</p>
        <div className="space-y-2.5">
          {options.map((option, index) => (
            <div key={index} className="flex items-start gap-3">
              <label className="mt-2 flex shrink-0 cursor-pointer items-center gap-1.5 text-sm font-semibold">
                <input
                  type="radio"
                  name="correct-option"
                  checked={correct === index}
                  onChange={() => setCorrect(index)}
                  className="h-4 w-4 accent-green-600"
                  aria-label={`Option ${LETTERS[index]} is correct`}
                />
                {LETTERS[index]}
              </label>
              <div className="grid flex-1 gap-2 sm:grid-cols-2">
                <Input value={option.en} onChange={(e) => setOption(index, 'en', e.target.value)} placeholder="English" />
                <Input value={option.bn} onChange={(e) => setOption(index, 'bn', e.target.value)} placeholder="Bengali" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Explanation (English)">
          <Textarea value={expEn} onChange={(e) => setExpEn(e.target.value)} rows={2} />
        </FormField>
        <FormField label="Explanation (Bengali)">
          <Textarea value={expBn} onChange={(e) => setExpBn(e.target.value)} rows={2} />
        </FormField>
        <FormField label="Topic">
          <Input value={topic} onChange={(e) => setTopic(e.target.value)} />
        </FormField>
        <FormField label="Chapter">
          <Input value={chapter} onChange={(e) => setChapter(e.target.value)} />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Approval" hint={QUESTION_STATUS[status].hint}>
          <Select value={status} onValueChange={(value) => setStatus(value as QuestionStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(QUESTION_STATUS) as QuestionStatus[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {QUESTION_STATUS[key].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        {status === 'rejected' && (
          <FormField label="Reason for rejecting" required>
            <Input value={reason} onChange={(e) => setReason(e.target.value)} required minLength={3} />
          </FormField>
        )}
      </div>
    </EditShell>
  );
}

export function QuestionEditDialog({ questionId, onClose }: { questionId: string; onClose: () => void }) {
  const { data, isError, refetch } = useQuery({
    queryKey: ['catalog', 'question', questionId],
    queryFn: () => catalogApi.question(questionId),
  });

  if (data) return <QuestionForm key={data._id + data.updatedAt} question={data} onClose={onClose} />;

  return (
    <EditFrame
      title="Edit question"
      description={isError ? 'Something went wrong.' : 'Loading the question…'}
      onClose={onClose}
      wide
      body={
        isError ? (
          <ErrorState message="Could not load this question." onRetry={() => refetch()} className="py-6" />
        ) : (
          <div aria-busy="true" className="space-y-4">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-20 w-full rounded-md" />
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-20 w-full rounded-md" />
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3.5 w-16" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              ))}
            </div>
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-16 w-full rounded-md" />
          </div>
        )
      }
      footer={
        <>
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-36 rounded-md" />
        </>
      }
    />
  );
}

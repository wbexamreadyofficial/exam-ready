'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  AlertTriangle, ArrowRight, CheckCircle2, FileText, Loader2, PartyPopper, XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { UploadStep } from '@/components/admin/wizard/UploadStep';
import { ResolveStep } from '@/components/admin/wizard/ResolveStep';
import { SubjectsStep } from '@/components/admin/wizard/SubjectsStep';
import { NameStep } from '@/components/admin/wizard/NameStep';
import { PatternStep } from '@/components/admin/wizard/PatternStep';
import { AddQuestionForm } from '@/components/admin/wizard/AddQuestionForm';
import { QuestionCard } from '@/components/admin/wizard/QuestionCard';
import { questionUploadsApi, toFailure } from '@/lib/api/questionUploads';
import {
  useCategories,
  useCommitUpload,
  useConfirmName,
  useEditQuestion,
  useExams,
  useQuestionSets,
  useResolveCategory,
  useResolveExam,
  useResolveSubjects,
  useSubjects,
  useUploadStep,
} from '@/hooks/useQuestionUpload';
import { useAuthStore } from '@/store/authStore';
import { useAdminT } from '@/lib/admin/i18n';
import { cn } from '@/lib/utils';
import type {
  ApiFailure,
  NewQuestionInput,
  ParsedQuestion,
  PatternDraft,
  PatternInput,
  QuestionEditInput,
  QuestionUpload,
  UploadIssue,
} from '@/types/questionUpload';

const BLOCKING = new Set(['MISSING_ANSWER', 'ANSWER_NOT_IN_OPTIONS', 'TOO_FEW_OPTIONS']);
const TOTAL_STEPS = 9;

/**
 * The marking scheme to show when the API response does not carry one: what the
 * operator already confirmed, otherwise what the file proposed. Mirrors the
 * server's `getPatternDraft`, so step 8 is never left with nothing to render.
 */
function fallbackPattern(upload: QuestionUpload): PatternDraft {
  const positive = (value: unknown) => {
    const n = Number(value);
    return value != null && Number.isFinite(n) && n > 0 ? n : undefined;
  };
  const saved = upload.pattern ?? {};
  const included = upload.parsedQuestions.filter((q) => q.decision !== 'skip').length;
  const marksPerQuestion = saved.marksPerQuestion ?? positive(upload.meta.MARKS_PER_QUESTION) ?? 1;
  const totalMarks = saved.totalMarks ?? marksPerQuestion * included;

  return {
    durationMinutes: saved.durationMinutes ?? positive(upload.meta.DURATION) ?? 60,
    marksPerQuestion,
    negativeMarksPerQuestion: saved.negativeMarksPerQuestion ?? positive(upload.meta.NEGATIVE_MARKS) ?? 0,
    totalMarks,
    passingMarks: saved.passingMarks ?? positive(upload.meta.PASSING_MARKS) ?? null,
    confirmed: Boolean(saved.confirmed),
    requiredQuestions: marksPerQuestion > 0 ? Math.ceil(totalMarks / marksPerQuestion) : 0,
    includedQuestions: included,
  };
}

/**
 * Steps 8 and 9 are saved only when the set is published, so what the operator
 * has decided so far is kept per upload in session storage — a reload does not
 * lose the marking scheme or questions written by hand.
 */
interface LocalDraft {
  pattern: PatternInput | null;
  newQuestions: NewQuestionInput[];
}

const EMPTY_DRAFT: LocalDraft = { pattern: null, newQuestions: [] };
const draftKey = (uploadId: string) => `upload-draft:${uploadId}`;

function readDraft(uploadId: string | null): LocalDraft {
  if (!uploadId || typeof window === 'undefined') return EMPTY_DRAFT;
  try {
    const raw = sessionStorage.getItem(draftKey(uploadId));
    return raw ? { ...EMPTY_DRAFT, ...(JSON.parse(raw) as LocalDraft) } : EMPTY_DRAFT;
  } catch {
    return EMPTY_DRAFT;
  }
}

function writeDraft(uploadId: string, draft: LocalDraft | null) {
  try {
    if (draft) sessionStorage.setItem(draftKey(uploadId), JSON.stringify(draft));
    else sessionStorage.removeItem(draftKey(uploadId));
  } catch {
    // Storage can be unavailable (private mode); the draft then lives in memory only.
  }
}

/** Shows a hand-written question in the same card as the parsed ones. */
function toParsedQuestion(input: NewQuestionInput, number: number): ParsedQuestion {
  return {
    number,
    text: input.text,
    textBn: input.textBn,
    options: input.options,
    answerKey: input.answerKey,
    subject: input.subject,
    difficulty: input.difficulty,
    explanation: input.explanation,
    explanationBn: input.explanationBn,
    confidence: 1,
    issues: [],
    decision: 'include',
    editedByOperator: true,
  };
}

/**
 * `useSearchParams` needs a Suspense boundary in the App Router, so the wizard
 * itself is a child component.
 */
export default function NewUploadPage() {
  return (
    <Suspense fallback={null}>
      <UploadWizard />
    </Suspense>
  );
}

function UploadWizard() {
  const { t, lang } = useAdminT();
  const w = t.wizard;
  const user = useAuthStore((s) => s.user);

  // An unfinished upload can be picked up again from the history list.
  const resumeId = useSearchParams().get('resume');
  const [uploadId, setUploadId] = useState<string | null>(resumeId);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rejection, setRejection] = useState<ApiFailure | null>(null);
  const [createdSet, setCreatedSet] = useState<{ _id: string; title: { en: string } } | null>(null);
  const [filter, setFilter] = useState<'all' | 'problems'>('all');
  const [editingPattern, setEditingPattern] = useState(false);
  const [draft, setDraft] = useState<LocalDraft>(EMPTY_DRAFT);

  // Load the local draft that belongs to the upload on screen.
  useEffect(() => {
    setDraft(readDraft(uploadId));
    setEditingPattern(false);
  }, [uploadId]);

  const updateDraft = (next: (current: LocalDraft) => LocalDraft) =>
    setDraft((current) => {
      const value = next(current);
      if (uploadId) writeDraft(uploadId, value);
      return value;
    });

  const { data: step, isLoading } = useUploadStep(uploadId);
  const upload = step?.upload;

  const resolveCategory = useResolveCategory(uploadId);
  const resolveSubjects = useResolveSubjects(uploadId);
  const resolveExam = useResolveExam(uploadId);
  const confirmName = useConfirmName(uploadId);
  const editQuestion = useEditQuestion(uploadId);
  const commit = useCommitUpload(uploadId);

  // Pickers only need their lists once the relevant step is on screen.
  const { data: categories } = useCategories({ isActive: true, limit: 100 });
  // Subjects are global — they are NOT scoped to a category.
  const { data: subjects } = useSubjects({ isActive: true, limit: 100 });
  // Exams are scoped to the resolved category.
  const { data: exams } = useExams({
    isActive: true,
    limit: 100,
    category: upload?.categoryResolution?.resolvedId ?? undefined,
  });
  // Question sets are scoped to the resolved exam (shown as context on the name step).
  const { data: questionSets } = useQuestionSets({
    isActive: true,
    limit: 100,
    exam: upload?.examResolution?.resolvedId ?? undefined,
  });

  const message = (failure: ApiFailure) =>
    lang === 'BN' && failure.messageBn ? failure.messageBn : failure.message;

  const startUpload = async (file: File, uploaderName: string) => {
    setUploading(true);
    setProgress(0);
    setRejection(null);
    try {
      const created = await questionUploadsApi.create(file, uploaderName, user?.id ?? '', setProgress);
      setUploadId(created._id);
    } catch (error) {
      // A precheck failure is a dead end with a reason, not a crash — it is
      // shown in place of the wizard rather than as a toast that vanishes.
      setRejection(toFailure(error));
    } finally {
      setUploading(false);
    }
  };

  // ── per-question issue lookup, and the counters above the list ──
  const issuesByQuestion = useMemo(() => {
    const map = new Map<number, UploadIssue[]>();
    for (const issue of [...(upload?.parseErrors ?? []), ...(upload?.parseWarnings ?? [])]) {
      if (issue.questionNumber === undefined) continue;
      map.set(issue.questionNumber, [...(map.get(issue.questionNumber) ?? []), issue]);
    }
    return map;
  }, [upload]);

  const counts = useMemo(() => {
    const questions = upload?.parsedQuestions ?? [];
    let clean = 0, warning = 0, blocking = 0, skipped = 0;

    for (const question of questions) {
      if (question.decision === 'skip') { skipped += 1; continue; }
      const issues = issuesByQuestion.get(question.number) ?? [];
      if (issues.some((issue) => BLOCKING.has(issue.code))) blocking += 1;
      else if (issues.length > 0) warning += 1;
      else clean += 1;
    }

    // Questions written by hand are checked by the form, so they arrive clean.
    clean += draft.newQuestions.length;

    return {
      clean,
      warning,
      blocking,
      skipped,
      included: questions.length - skipped + draft.newQuestions.length,
    };
  }, [upload, issuesByQuestion, draft.newQuestions.length]);

  const visibleQuestions = useMemo(() => {
    const questions = upload?.parsedQuestions ?? [];
    if (filter === 'all') return questions;
    return questions.filter((question) => (issuesByQuestion.get(question.number) ?? []).length > 0);
  }, [upload, filter, issuesByQuestion]);

  // Issues with no question number are about the file as a whole.
  const paperIssues = (upload?.parseErrors ?? []).filter((i) => i.questionNumber === undefined);
  const paperWarnings = (upload?.parseWarnings ?? []).filter((i) => i.questionNumber === undefined);

  // How many questions the confirmed marking scheme demands, and how far short
  // the set currently is. The same rule is enforced again by the API on commit.
  // The operator's own numbers win over whatever the server or file proposed.
  const pattern = useMemo<PatternDraft | null>(() => {
    if (!upload) return null;
    const base = step?.pattern ?? fallbackPattern(upload);
    const local = draft.pattern;
    return {
      ...base,
      ...(local ? { ...local, passingMarks: local.passingMarks ?? null, confirmed: true } : {}),
      includedQuestions: counts.included,
    };
  }, [upload, step?.pattern, draft.pattern, counts.included]);
  const marksPerQuestion = pattern?.marksPerQuestion ?? 0;
  const totalMarks = pattern?.totalMarks ?? 0;
  const requiredQuestions = marksPerQuestion > 0 ? Math.ceil(totalMarks / marksPerQuestion) : 0;
  const shortBy = Math.max(0, requiredQuestions - counts.included);
  // The included questions must be worth at least the set's total marks.
  const marksCovered = counts.included * marksPerQuestion;
  const patternConfirmed = Boolean(pattern?.confirmed);

  // Step 8 is answered in the browser, so confirming it moves on to review
  // without a round trip; the server only hears about it at publish time.
  const serverStep = upload?.currentStep ?? (uploadId ? 4 : 2);
  const showReview = serverStep >= 9 || (serverStep === 8 && patternConfirmed);
  const currentStep = createdSet || showReview ? 9 : serverStep;

  const firstNewNumber =
    (upload?.parsedQuestions ?? []).reduce((max, question) => Math.max(max, question.number), 0) + 1;

  const confirmPatternLocally = (input: PatternInput) => {
    updateDraft((current) => ({ ...current, pattern: input }));
    setEditingPattern(false);
  };

  const editNewQuestion = (index: number, input: QuestionEditInput) =>
    updateDraft((current) => ({
      ...current,
      newQuestions:
        input.decision === 'skip'
          ? current.newQuestions.filter((_, i) => i !== index)
          : current.newQuestions.map((question, i) =>
              i === index
                ? {
                    ...question,
                    ...(input.text !== undefined && { text: input.text }),
                    ...(input.options !== undefined && { options: input.options }),
                    ...(input.answerKey !== undefined && { answerKey: input.answerKey }),
                    ...(input.explanation !== undefined && { explanation: input.explanation }),
                  }
                : question
            ),
    }));

  // ─────────────────────────── screens ───────────────────────────

  if (createdSet) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="border-[var(--color-bgreen-200)] bg-[var(--color-bgreen-50)] dark:border-[var(--color-bgreen-500)]/30 dark:bg-[var(--color-bgreen-500)]/10">
          <CardContent className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <PartyPopper className="h-10 w-10 text-[var(--color-bgreen-600)]" />
            <h2 className="text-lg font-black">{w.doneTitle}</h2>
            <p className="text-[15px] font-semibold">{createdSet.title.en}</p>
            <p className="max-w-md text-[13px] leading-relaxed text-[var(--color-muted-foreground)]">
              {w.doneBody}
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/uploads">{w.viewUploads}</Link>
              </Button>
              <Button
                size="sm"
                className="font-semibold"
                onClick={() => { setCreatedSet(null); setUploadId(null); }}
              >
                {w.uploadAnother}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (rejection) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Card className="border-[var(--color-bred-200)] bg-[var(--color-bred-50)] dark:border-[var(--color-bred-500)]/30 dark:bg-[var(--color-bred-500)]/10">
          <CardContent className="p-5">
            <div className="flex gap-3">
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-bred-600)]" />
              <div className="min-w-0">
                <h2 className="text-[15px] font-bold">{w.rejectedTitle}</h2>
                <p className="mt-1.5 text-[13.5px] leading-relaxed">{message(rejection)}</p>
                <p className="mt-2 text-[12.5px] text-[var(--color-muted-foreground)]">
                  {w.rejectedHelp}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex gap-2">
          <Button onClick={() => setRejection(null)} className="font-semibold border-0 bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] text-white shadow-md shadow-orange-600/30 ring-1 ring-inset ring-white/25 transition-all hover:-translate-y-px hover:bg-transparent hover:brightness-110 hover:shadow-lg hover:shadow-orange-600/40 disabled:opacity-50 disabled:shadow-none">{w.tryAgain}</Button>
          <Button asChild variant="outline"><Link href="/admin/upload-guide">{w.viewGuide}</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Progress rail */}
      <div className="flex items-center gap-2">
        <span className="shrink-0 text-[11.5px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
          {t.common.step} {currentStep} {t.common.of} {TOTAL_STEPS}
        </span>
        <div className="flex flex-1 gap-1">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <span
              key={i}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors',
                i + 1 <= currentStep ? 'bg-gradient-to-r from-[#f4953f] to-[#e2691f] shadow-[0_0_8px_rgba(226,105,31,0.45)]' : 'bg-[var(--color-muted)]'
              )}
            />
          ))}
        </div>
      </div>

      {!uploadId && (
        <UploadStep
          busy={uploading}
          progress={progress}
          defaultName={user?.fullName ?? ''}
          onSubmit={startUpload}
        />
      )}

      {uploadId && isLoading && (
        <div className="space-y-4" aria-busy="true" aria-label={t.common.loading}>
          {/* File summary card */}
          <Card>
            <CardContent className="flex flex-wrap items-center gap-x-5 gap-y-2 p-3.5">
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3.5 w-28" />
            </CardContent>
          </Card>

          {/* Step heading */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-full max-w-xl" />
          </div>

          {/* Step body: resolution cards */}
          {Array.from({ length: 3 }, (_, i) => (
            <Card key={i}>
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center justify-between gap-3">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-3.5 w-2/3" />
              </CardContent>
            </Card>
          ))}

          {/* Action bar */}
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-10 w-36 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-md" />
          </div>
        </div>
      )}

      {upload && (
        <>
          {/* What the file turned out to contain */}
          <Card>
            <CardContent className="flex flex-wrap items-center gap-x-5 gap-y-2 p-3.5">
              <span className="flex items-center gap-1.5 text-[13px] font-semibold">
                <FileText className="h-4 w-4 text-[#e2691f]" />
                {upload.file.name}
              </span>
              <span className="text-[12.5px] text-[var(--color-muted-foreground)]">
                <b className="text-[var(--color-foreground)]">{upload.parsedQuestions.length}</b>{' '}
                {w.questionsFound}
              </span>
              <span className="text-[12.5px] text-[var(--color-muted-foreground)]">
                <b className="text-[var(--color-foreground)]">{upload.sections.length}</b>{' '}
                {w.sectionsFound}
              </span>
              <span className="text-[12.5px] text-[var(--color-muted-foreground)]">
                <b className="text-[var(--color-foreground)]">{upload.subjectResolutions.length}</b>{' '}
                {w.subjectsFound}
              </span>
              {upload.meta.DURATION && (
                <span className="text-[12.5px] text-[var(--color-muted-foreground)]">
                  <b className="text-[var(--color-foreground)]">{upload.meta.DURATION}</b> min
                </span>
              )}
            </CardContent>
          </Card>

          {/* Whole-file warnings, e.g. Bengali arriving via PDF */}
          {paperWarnings.length > 0 && (
            <Card className="border-[var(--color-borange-200)] bg-[var(--color-borange-50)] dark:border-[var(--color-borange-500)]/30 dark:bg-[var(--color-borange-500)]/10">
              <CardContent className="space-y-1.5 p-3.5">
                {paperWarnings.map((issue, i) => (
                  <p key={i} className="flex gap-2 text-[12.5px] leading-relaxed">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-borange-600)]" />
                    {(lang === 'BN' ? issue.messageBn : issue.message) ?? issue.message}
                  </p>
                ))}
              </CardContent>
            </Card>
          )}

          {paperIssues.length > 0 && (
            <Card className="border-[var(--color-bred-200)] bg-[var(--color-bred-50)] dark:border-[var(--color-bred-500)]/30 dark:bg-[var(--color-bred-500)]/10">
              <CardContent className="space-y-1.5 p-3.5">
                {paperIssues.map((issue, i) => (
                  <p key={i} className="flex gap-2 text-[12.5px] leading-relaxed">
                    <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-bred-600)]" />
                    {(lang === 'BN' ? issue.messageBn : issue.message) ?? issue.message}
                  </p>
                ))}
              </CardContent>
            </Card>
          )}

          {/* ── step 4 ── */}
          {upload.currentStep === 4 && (
            <ResolveStep
              title={w.categoryStepTitle}
              resolution={upload.categoryResolution}
              matches={step.categoryMatches}
              allOptions={(categories?.items ?? []).map((c) => ({ id: c._id, name: c.name, exact: false }))}
              busy={resolveCategory.isPending}
              onSubmit={(input) => resolveCategory.mutate(input)}
            />
          )}

          {/* ── step 5 ── */}
          {upload.currentStep === 5 && (
            <SubjectsStep
              resolutions={upload.subjectResolutions}
              matchesByName={step.subjectMatches}
              allSubjects={subjects?.items ?? []}
              busy={resolveSubjects.isPending}
              onSubmit={(values) => resolveSubjects.mutate(values)}
            />
          )}

          {/* ── step 6 ── */}
          {upload.currentStep === 6 && (
            <ResolveStep
              title={w.examStepTitle}
              resolution={upload.examResolution}
              matches={step.examMatches}
              allOptions={(exams?.items ?? []).map((e) => ({ id: e._id, name: e.title, exact: false }))}
              busy={resolveExam.isPending}
              onSubmit={(input) => resolveExam.mutate(input)}
            />
          )}

          {/* ── step 7 ── */}
          {upload.currentStep === 7 && (
            <NameStep
              uploadId={upload._id}
              initialName={upload.setName ?? upload.meta.SET_TITLE ?? ''}
              existingSets={questionSets?.items ?? []}
              busy={confirmName.isPending}
              onSubmit={(name) => confirmName.mutate(name)}
            />
          )}

          {/* ── step 8 — the marking scheme, confirmed before anything is created ── */}
          {upload.currentStep === 8 && !showReview && pattern && (
            <PatternStep draft={pattern} busy={false} onSubmit={confirmPatternLocally} />
          )}

          {/* ── step 9 ── */}
          {showReview && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-black tracking-tight">{w.reviewTitle}</h2>
                <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{w.reviewHelp}</p>
              </div>

              <Card>
                <CardContent className="flex flex-wrap items-center gap-x-4 gap-y-2 p-3.5 text-[12.5px]">
                  <span className="flex items-center gap-1.5 font-semibold text-[var(--color-bgreen-600)]">
                    <CheckCircle2 className="h-4 w-4" />{counts.clean} {w.clean}
                  </span>
                  {counts.warning > 0 && (
                    <span className="flex items-center gap-1.5 font-semibold text-[var(--color-borange-600)]">
                      <AlertTriangle className="h-4 w-4" />{counts.warning} {w.needsReview}
                    </span>
                  )}
                  {counts.blocking > 0 && (
                    <span className="flex items-center gap-1.5 font-semibold text-[var(--color-bred-600)]">
                      <XCircle className="h-4 w-4" />{counts.blocking} {w.blocking}
                    </span>
                  )}
                  {counts.skipped > 0 && (
                    <span className="text-[var(--color-muted-foreground)]">
                      {counts.skipped} {w.skipped}
                    </span>
                  )}
                  <span className="ml-auto font-bold">
                    {counts.included} {w.allIncluded}
                  </span>
                </CardContent>
              </Card>

              {/* The marking scheme the set is held to, and how much of it is covered. */}
              <Card>
                <CardContent className="flex flex-wrap items-center gap-x-4 gap-y-2 p-3.5 text-[12.5px]">
                  <span>
                    {w.marksPerQuestionLabel}: <b>{marksPerQuestion}</b>
                  </span>
                  <span>
                    {w.totalMarksLabel}: <b>{totalMarks}</b>
                  </span>
                  <span
                    className={cn(
                      'font-semibold',
                      marksCovered >= totalMarks
                        ? 'text-[var(--color-bgreen-600)]'
                        : 'text-[var(--color-borange-600)]'
                    )}
                  >
                    {w.marksCovered}: {marksCovered} / {totalMarks}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto h-7 text-[12px]"
                    onClick={() => setEditingPattern((open) => !open)}
                  >
                    {editingPattern ? w.hidePattern : w.editPattern}
                  </Button>
                </CardContent>
              </Card>

              {(editingPattern || !patternConfirmed) && pattern && (
                <PatternStep
                  key={`${pattern.marksPerQuestion}-${pattern.totalMarks}-${pattern.confirmed}`}
                  draft={pattern}
                  busy={false}
                  onSubmit={confirmPatternLocally}
                />
              )}

              {/* The publish gate: a set must be worth the marks it claims. */}
              {shortBy > 0 && (
                <Card className="border-[var(--color-borange-200)] bg-[var(--color-borange-50)] dark:border-[var(--color-borange-500)]/30 dark:bg-[var(--color-borange-500)]/10">
                  <CardContent className="flex gap-2 p-3.5 text-[12.5px] leading-relaxed">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-borange-600)]" />
                    <span>
                      {w.requiredQuestionsNote} <b>{requiredQuestions}</b> {w.questionsWord}. {w.youHaveNow}{' '}
                      <b>{counts.included}</b>. <b>{w.shortOfQuestions} {shortBy}.</b>
                    </span>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-1.5">
                {(['all', 'problems'] as const).map((value) => (
                  <button
                    key={value}
                    onClick={() => setFilter(value)}
                    className={cn(
                      'rounded-md border px-3 py-1.5 text-[12.5px] font-semibold transition-colors',
                      filter === value
                        ? 'border-orange-400 bg-orange-50 text-[#c95817] dark:bg-orange-500/15 dark:text-orange-300'
                        : 'border-[var(--color-hairline)] hover:bg-[var(--color-muted)]'
                    )}
                  >
                    {value === 'all' ? w.showAll : w.showProblems}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                {visibleQuestions.map((question) => (
                  <QuestionCard
                    key={question.number}
                    question={question}
                    issues={issuesByQuestion.get(question.number) ?? []}
                    busy={editQuestion.isPending}
                    onEdit={(input) => editQuestion.mutate({ number: question.number, input })}
                  />
                ))}

                {/* Written by hand here; saved together with the set on publish. */}
                {filter === 'all' &&
                  draft.newQuestions.map((input, index) => (
                    <QuestionCard
                      key={`new-${index}-${input.text}`}
                      question={toParsedQuestion(input, firstNewNumber + index)}
                      issues={[]}
                      onEdit={(edit) => editNewQuestion(index, edit)}
                    />
                  ))}
              </div>

              <AddQuestionForm
                busy={false}
                onSubmit={(input, done) => {
                  updateDraft((current) => ({
                    ...current,
                    newQuestions: [...current.newQuestions, input],
                  }));
                  done();
                }}
              />

              <div className="sticky bottom-0 -mx-4 flex flex-wrap gap-2 border-t border-[var(--color-hairline)] bg-[var(--color-background)]/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
                <Button
                  className="gap-2 font-bold"
                  disabled={
                    counts.blocking > 0 ||
                    counts.included === 0 ||
                    shortBy > 0 ||
                    marksCovered < totalMarks ||
                    !patternConfirmed ||
                    commit.isPending
                  }
                  onClick={() =>
                    commit.mutate(
                      {
                        categoryId: upload.categoryResolution.resolvedId ?? null,
                        examId: upload.examResolution.resolvedId ?? null,
                        subjectMappings: upload.subjectResolutions.map((r) => ({
                          parsedName: r.parsedName ?? '',
                          subjectId: r.resolvedId ?? null,
                        })),
                        // Steps 8 and 9 are saved here, in the same call that publishes.
                        pattern: {
                          durationMinutes: Math.round(pattern?.durationMinutes ?? 60),
                          marksPerQuestion,
                          negativeMarksPerQuestion: pattern?.negativeMarksPerQuestion ?? 0,
                          totalMarks,
                          ...(pattern?.passingMarks != null ? { passingMarks: pattern.passingMarks } : {}),
                        },
                        newQuestions: draft.newQuestions,
                      },
                      {
                        onSuccess: (questionSet) => {
                          writeDraft(upload._id, null);
                          setCreatedSet(questionSet);
                          toast.success(w.doneTitle);
                        },
                      }
                    )
                  }
                >
                  {commit.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  {commit.isPending ? w.publishing : w.publish}
                </Button>

                <Button
                  variant="ghost"
                  className="text-[var(--color-muted-foreground)]"
                  onClick={() => {
                    if (!window.confirm(w.cancelConfirm)) return;
                    writeDraft(upload._id, null);
                    questionUploadsApi.cancel(upload._id).finally(() => setUploadId(null));
                  }}
                >
                  {w.cancelUpload}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

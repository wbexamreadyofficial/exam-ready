'use client';

import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  AlertTriangle, ArrowRight, CheckCircle2, FileText, Loader2, PartyPopper, XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UploadStep } from '@/components/admin/wizard/UploadStep';
import { ResolveStep } from '@/components/admin/wizard/ResolveStep';
import { SubjectsStep } from '@/components/admin/wizard/SubjectsStep';
import { NameStep } from '@/components/admin/wizard/NameStep';
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
import type { ApiFailure, UploadIssue } from '@/types/questionUpload';

const BLOCKING = new Set(['MISSING_ANSWER', 'ANSWER_NOT_IN_OPTIONS', 'TOO_FEW_OPTIONS']);
const TOTAL_STEPS = 9;

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

    return { clean, warning, blocking, skipped, included: questions.length - skipped };
  }, [upload, issuesByQuestion]);

  const visibleQuestions = useMemo(() => {
    const questions = upload?.parsedQuestions ?? [];
    if (filter === 'all') return questions;
    return questions.filter((question) => (issuesByQuestion.get(question.number) ?? []).length > 0);
  }, [upload, filter, issuesByQuestion]);

  // Issues with no question number are about the file as a whole.
  const paperIssues = (upload?.parseErrors ?? []).filter((i) => i.questionNumber === undefined);
  const paperWarnings = (upload?.parseWarnings ?? []).filter((i) => i.questionNumber === undefined);

  const currentStep = createdSet ? 9 : (upload?.currentStep ?? (uploadId ? 4 : 2));

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
        <div className="flex items-center justify-center gap-2 py-16 text-[var(--color-muted-foreground)]">
          <Loader2 className="h-5 w-5 animate-spin" />
          {t.common.loading}
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

          {/* ── steps 8 + 9 ── */}
          {upload.currentStep >= 8 && (
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
              </div>

              <div className="sticky bottom-0 -mx-4 flex flex-wrap gap-2 border-t border-[var(--color-hairline)] bg-[var(--color-background)]/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
                <Button
                  className="gap-2 font-bold border-0 bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] text-white shadow-md shadow-orange-600/30 ring-1 ring-inset ring-white/25 transition-all hover:-translate-y-px hover:bg-transparent hover:brightness-110 hover:shadow-lg hover:shadow-orange-600/40 disabled:opacity-50 disabled:shadow-none"
                  disabled={counts.blocking > 0 || counts.included === 0 || commit.isPending}
                  onClick={() =>
                    commit.mutate(
                      {
                        categoryId: upload.categoryResolution.resolvedId ?? null,
                        examId: upload.examResolution.resolvedId ?? null,
                        subjectMappings: upload.subjectResolutions.map((r) => ({
                          parsedName: r.parsedName ?? '',
                          subjectId: r.resolvedId ?? null,
                        })),
                      },
                      {
                        onSuccess: (questionSet) => {
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

'use client';

import { use, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Clock,
  Eraser,
  Languages,
  ListChecks,
  Loader2,
  LogOut,
  Send,
  Timer,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ErrorState } from '@/components/ui/error-state';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { ThemeSwitcher } from '@/components/layout/ThemeSwitcher';
import { getErrorMessage } from '@/lib/api/errors';
import {
  bilingual,
  studentTestsApi,
  type AnswerInput,
  type AttemptPayload,
} from '@/lib/api/studentTests';
import { cn } from '@/lib/utils';

type Language = 'en' | 'bn';

interface LocalAnswer {
  selected: number | null;
  marked: boolean;
  seconds: number;
}

const ORANGE_BUTTON =
  'border-0 bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] font-semibold text-white shadow-md shadow-orange-600/30 ring-1 ring-inset ring-white/25 transition-all hover:-translate-y-px hover:bg-transparent hover:brightness-110 hover:shadow-lg hover:shadow-orange-600/40 disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none';

const clock = (totalSeconds: number) => {
  const safe = Math.max(0, totalSeconds);
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  return `${h > 0 ? `${String(h).padStart(2, '0')}:` : ''}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

// ───────────────────────────── the running test ─────────────────────────────

function Runner({ payload }: { payload: AttemptPayload }) {
  const router = useRouter();
  const { attemptId, questions } = payload;

  const [index, setIndex] = useState(0);
  const [language, setLanguage] = useState<Language>(() => {
    try {
      return sessionStorage.getItem(`attempt-lang:${attemptId}`) === 'bn' ? 'bn' : 'en';
    } catch {
      return 'en';
    }
  });
  const [answers, setAnswers] = useState<Record<string, LocalAnswer>>(() =>
    Object.fromEntries(
      payload.answers.map((saved) => [
        saved.questionId,
        { selected: saved.selectedOptionIndex, marked: saved.markedForReview, seconds: saved.timeSpentSeconds },
      ])
    )
  );
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0]));
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dirty, setDirty] = useState(0);
  const [exitOpen, setExitOpen] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const leavingRef = useRef(false);

  // The server clock is the authority: measure how far this device is from it once.
  const [clockOffset] = useState(() => new Date(payload.serverNow).getTime() - Date.now());
  const expiresAt = useMemo(() => new Date(payload.expiresAt).getTime(), [payload.expiresAt]);
  const secondsLeft = useCallback(
    () => Math.max(0, Math.round((expiresAt - (Date.now() + clockOffset)) / 1000)),
    [expiresAt, clockOffset]
  );
  const [remaining, setRemaining] = useState(secondsLeft);

  const questionStartedAt = useRef(0);
  const answersRef = useRef(answers);
  const submittedRef = useRef(false);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    questionStartedAt.current = Date.now();
  }, []);

  const current = questions[index];
  const currentAnswer = answers[current._id];

  /** Adds the time spent on the open question to its running total. */
  const flushQuestionTime = useCallback(() => {
    const spent = Math.round((Date.now() - questionStartedAt.current) / 1000);
    questionStartedAt.current = Date.now();
    if (spent <= 0) return answersRef.current;
    const id = questions[index]._id;
    const previous = answersRef.current[id] ?? { selected: null, marked: false, seconds: 0 };
    const next = { ...answersRef.current, [id]: { ...previous, seconds: previous.seconds + spent } };
    answersRef.current = next;
    setAnswers(next);
    return next;
  }, [index, questions]);

  const toPayload = (source: Record<string, LocalAnswer>): AnswerInput[] =>
    Object.entries(source)
      .filter(([, value]) => value.selected !== null || value.marked || value.seconds > 0)
      .map(([questionId, value]) => ({
        questionId,
        selectedOptionIndex: value.selected,
        timeSpentSeconds: value.seconds,
        markedForReview: value.marked,
      }));

  const update = (patch: Partial<LocalAnswer>) => {
    setAnswers((existing) => {
      const previous = existing[current._id] ?? { selected: null, marked: false, seconds: 0 };
      return { ...existing, [current._id]: { ...previous, ...patch } };
    });
    setDirty((count) => count + 1);
  };

  const goTo = (target: number) => {
    if (target < 0 || target >= questions.length || target === index) return;
    flushQuestionTime();
    setIndex(target);
    setVisited((set) => new Set(set).add(target));
    setDirty((count) => count + 1);
  };

  // ── autosave shortly after each change ──
  useEffect(() => {
    if (dirty === 0 || submittedRef.current) return;
    const timer = setTimeout(() => {
      studentTestsApi.saveAnswers(attemptId, toPayload(answersRef.current)).catch(() => {
        /* a failed autosave is retried with the next change and with the final submit */
      });
    }, 1200);
    return () => clearTimeout(timer);
  }, [dirty, attemptId]);

  // ── submit ──
  const submit = useCallback(
    async (auto = false) => {
      if (submittedRef.current) return;
      submittedRef.current = true;
      leavingRef.current = true;
      setSubmitting(true);
      const finalAnswers = flushQuestionTime();
      try {
        await studentTestsApi.submit(attemptId, toPayload(finalAnswers));
        if (auto) toast.info("Time's up — your test was submitted.");
        router.replace(`/student/tests/result/${attemptId}`);
      } catch (error) {
        submittedRef.current = false;
        leavingRef.current = false;
        setSubmitting(false);
        toast.error(getErrorMessage(error, 'Could not submit the test. Please try again.'));
      }
    },
    [attemptId, flushQuestionTime, router]
  );

  // ── countdown: the server's deadline decides; at zero the test submits itself ──
  useEffect(() => {
    const timer = setInterval(() => {
      const left = secondsLeft();
      setRemaining(left);
      if (left <= 0) void submit(true);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, submit]);

  // ── leaving the page mid-test ──
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (submittedRef.current || leavingRef.current) return;
      event.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, []);

  // ── leaving through the back button or an in-app link asks first ──
  useEffect(() => {
    window.history.pushState(null, '', window.location.href);

    const onPopState = () => {
      if (leavingRef.current) return;
      window.history.pushState(null, '', window.location.href);
      setPendingHref(null);
      setExitOpen(true);
    };
    const onClick = (event: MouseEvent) => {
      if (leavingRef.current) return;
      const link = (event.target as Element | null)?.closest?.('a[href]');
      const href = link?.getAttribute('href') ?? '';
      if (!link || !href.startsWith('/') || href === window.location.pathname) return;
      event.preventDefault();
      event.stopPropagation();
      setPendingHref(href);
      setExitOpen(true);
    };

    window.addEventListener('popstate', onPopState);
    document.addEventListener('click', onClick, true);
    return () => {
      window.removeEventListener('popstate', onPopState);
      document.removeEventListener('click', onClick, true);
    };
  }, []);

  /** Saves the answers so far and leaves; the timer keeps running and the test can be continued from My Results. */
  const confirmExit = async () => {
    setExiting(true);
    leavingRef.current = true;
    const latest = flushQuestionTime();
    try {
      await studentTestsApi.saveAnswers(attemptId, toPayload(latest));
    } catch {
      /* the last autosave is already on the server; leaving is still safe */
    }
    router.push(pendingHref ?? '/student/results');
  };

  // ── counts for the palette and the confirm dialog ──
  const stats = useMemo(() => {
    let answered = 0;
    let marked = 0;
    for (const question of questions) {
      const value = answers[question._id];
      if (value?.selected !== null && value?.selected !== undefined) answered += 1;
      if (value?.marked) marked += 1;
    }
    return { answered, marked, unanswered: questions.length - answered };
  }, [answers, questions]);

  const stateOf = (position: number) => {
    const value = answers[questions[position]._id];
    if (value?.marked) return 'marked';
    if (value?.selected !== null && value?.selected !== undefined) return 'answered';
    return visited.has(position) ? 'visited' : 'unseen';
  };

  const lowTime = remaining <= 60;

  const Palette = (
    <div className="flex h-full flex-col">
      <div className="grid grid-cols-2 gap-x-3 gap-y-2 px-4 pb-4 text-xs">
        {[
          ['answered', 'Answered', stats.answered],
          ['visited', 'Not answered', questions.filter((_, i) => stateOf(i) === 'visited').length],
          ['marked', 'Marked', stats.marked],
          ['unseen', 'Not visited', questions.filter((_, i) => stateOf(i) === 'unseen').length],
        ].map(([kind, label, count]) => (
          <div key={kind as string} className="flex items-center gap-2">
            <span className={cn('h-3 w-3 rounded-full border', LEGEND[kind as keyof typeof LEGEND])} />
            <span className="text-[var(--color-muted-foreground)]">{label}</span>
            <span className="ml-auto font-bold">{count as number}</span>
          </div>
        ))}
      </div>
      <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        <div className="grid grid-cols-5 gap-2.5">
          {questions.map((question, position) => {
            const state = stateOf(position);
            return (
              <button
                key={question._id}
                type="button"
                onClick={() => {
                  goTo(position);
                  setPaletteOpen(false);
                }}
                aria-label={`Question ${question.number}, ${state}`}
                className={cn(
                  'flex h-10 items-center justify-center rounded-full border text-sm font-semibold transition-all',
                  CELL[state as keyof typeof CELL],
                  position === index && 'ring-2 ring-[#e2691f] ring-offset-2 ring-offset-[var(--color-background)]'
                )}
              >
                {question.number}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex h-[72px] shrink-0 items-center border-t border-[var(--color-border)] px-4">
        <Button className={cn('h-11 w-full gap-2', ORANGE_BUTTON)} onClick={() => setConfirmOpen(true)} disabled={submitting}>
          <Send className="h-4 w-4" /> Submit test
        </Button>
      </div>
    </div>
  );

  const showBn = language === 'bn';
  const questionText = bilingual(current.questionText, showBn ? 'bn' : 'en');

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-[var(--color-background)] text-[var(--color-foreground)]">
      {/* Top bar */}
      <header className="flex h-16 shrink-0 items-center gap-3 border-b border-orange-200/60 bg-gradient-to-r from-white via-[#FFF6EC] to-[#FFE4CC] px-3 sm:px-6 dark:border-orange-400/15 dark:from-[#0B1220] dark:via-[#1A1410] dark:to-[#3A1D08]">
        <div
          className={cn(
            'flex items-center gap-2 rounded-xl border px-3 py-1.5 font-mono text-lg font-bold tabular-nums',
            lowTime
              ? 'animate-pulse border-red-300 bg-red-50 text-red-600 dark:border-red-400/40 dark:bg-red-500/10 dark:text-red-300'
              : 'border-orange-200 bg-white text-[#b9450d] dark:border-orange-400/30 dark:bg-orange-500/10 dark:text-orange-300'
          )}
          role="timer"
          aria-label="Time left"
        >
          <Timer className="h-5 w-5" />
          {clock(remaining)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold sm:text-[15px]">{bilingual(payload.title, showBn ? 'bn' : 'en')}</p>
          <p className="hidden text-xs text-[var(--color-muted-foreground)] sm:block">
            {questions.length} questions · {payload.totalMarks} marks
          </p>
        </div>

        <button
          type="button"
          onClick={() => setLanguage(showBn ? 'en' : 'bn')}
          className="flex h-9 items-center gap-1.5 rounded-lg border border-orange-200 bg-white px-3 text-[13px] font-semibold text-[#b9450d] transition-colors hover:bg-orange-50 dark:border-orange-400/30 dark:bg-white/5 dark:text-orange-300"
          aria-label="Switch question language"
        >
          <Languages className="h-4 w-4" />
          {showBn ? 'বাংলা' : 'English'}
        </button>
        <ThemeSwitcher />
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 lg:hidden"
          aria-label="Open question palette"
          onClick={() => setPaletteOpen(true)}
        >
          <ListChecks className="h-4 w-4" />
          <span className="hidden sm:inline">Questions</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700 dark:border-red-400/30 dark:text-red-300 dark:hover:bg-red-500/10"
          onClick={() => {
            setPendingHref(null);
            setExitOpen(true);
          }}
          disabled={submitting}
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Exit</span>
        </Button>
        <Button className={cn('hidden gap-1.5 lg:inline-flex', ORANGE_BUTTON)} size="sm" onClick={() => setConfirmOpen(true)} disabled={submitting}>
          <Send className="h-4 w-4" /> Submit
        </Button>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Question area */}
        <main className="flex min-w-0 flex-1 flex-col">
          <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] text-base font-bold text-white shadow-md shadow-orange-600/30">
                  {current.number}
                </span>
                <span className="text-sm text-[var(--color-muted-foreground)]">of {questions.length}</span>
                <span className="ml-1 rounded-md bg-green-50 px-2 py-1 text-xs font-bold text-green-700 dark:bg-green-500/15 dark:text-green-300">
                  +{payload.marksPerQuestion}
                </span>
                <span className="rounded-md bg-red-50 px-2 py-1 text-xs font-bold text-red-600 dark:bg-red-500/15 dark:text-red-300">
                  −{payload.negativeMarksPerQuestion}
                </span>
                {current.subject?.name && (
                  <span className="rounded-md border border-orange-200 px-2 py-1 text-xs font-semibold text-[#b9450d] dark:border-orange-400/30 dark:text-orange-300">
                    {current.subject.name}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => update({ marked: !currentAnswer?.marked })}
                  aria-pressed={Boolean(currentAnswer?.marked)}
                  className={cn(
                    'ml-auto flex h-9 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-semibold transition-colors',
                    currentAnswer?.marked
                      ? 'border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-400/40 dark:bg-violet-500/15 dark:text-violet-300'
                      : 'border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:border-violet-300 hover:text-violet-700'
                  )}
                >
                  {currentAnswer?.marked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                  {currentAnswer?.marked ? 'Marked' : 'Mark for review'}
                </button>
              </div>

              <div className="rounded-2xl border border-orange-200/60 bg-[var(--color-card)] bg-gradient-to-br from-orange-50/60 to-transparent p-5 shadow-elevated sm:p-6 dark:border-orange-400/20 dark:from-orange-500/10">
                <p className="whitespace-pre-line text-[17px] font-semibold leading-relaxed sm:text-lg">{questionText}</p>
              </div>

              <div className="mt-5 space-y-3.5" role="radiogroup" aria-label="Answer options">
                {current.options.map((option, optionIndex) => {
                  const active = currentAnswer?.selected === optionIndex;
                  return (
                    <button
                      key={optionIndex}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => update({ selected: active ? null : optionIndex })}
                      className={cn(
                        'flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-300',
                        active
                          ? 'border-transparent bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] text-white shadow-[0_2px_6px_rgba(201,88,23,0.25),0_18px_36px_-12px_rgba(184,67,15,0.65)] ring-1 ring-inset ring-white/30'
                          : 'border-[var(--color-border)] bg-[var(--color-card)] shadow-elevated hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-[0_2px_4px_rgba(30,64,110,0.06),0_12px_28px_-6px_rgba(201,88,23,0.25)]'
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-colors',
                          active
                            ? 'border-white/40 bg-white text-[#c4501a] shadow-sm'
                            : 'border-orange-200 bg-orange-50 text-[#b9450d] dark:border-orange-400/30 dark:bg-orange-500/10 dark:text-orange-300'
                        )}
                      >
                        {String.fromCharCode(65 + optionIndex)}
                      </span>
                      <span className={cn('text-base leading-snug', active && 'font-semibold')}>{bilingual(option, showBn ? 'bn' : 'en')}</span>
                      {active && <CheckCircle2 className="ml-auto h-6 w-6 shrink-0 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action bar */}
          <footer className="flex h-[72px] shrink-0 items-center border-t border-[var(--color-border)] bg-[var(--color-background)] px-2 sm:px-6">
            <div className="mx-auto flex w-full max-w-3xl items-center gap-1.5 sm:gap-2 [&_button]:px-3 sm:[&_button]:px-4">
              <Button variant="outline" className="gap-1.5" aria-label="Previous question" onClick={() => goTo(index - 1)} disabled={index === 0}>
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
              </Button>
              <Button
                variant="outline"
                className="gap-1.5 border-violet-300 text-violet-700 hover:bg-violet-50 hover:text-violet-700 dark:border-violet-400/40 dark:text-violet-300 dark:hover:bg-violet-500/10"
                onClick={() => {
                  update({ marked: true });
                  goTo(index + 1);
                }}
              >
                <Bookmark className="h-4 w-4" /> Mark <span className="hidden sm:inline">&amp; Next</span>
              </Button>
              <Button
                variant="outline"
                className="gap-1.5"
                aria-label="Clear answer"
                onClick={() => update({ selected: null })}
                disabled={currentAnswer?.selected === null || currentAnswer?.selected === undefined}
              >
                <Eraser className="h-4 w-4" />
                <span className="hidden sm:inline">Clear</span>
              </Button>
              {index < questions.length - 1 ? (
                <Button className={cn('ml-auto shrink-0 gap-1.5', ORANGE_BUTTON)} onClick={() => goTo(index + 1)}>
                  Save &amp; Next <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button className={cn('ml-auto gap-1.5', ORANGE_BUTTON)} onClick={() => setConfirmOpen(true)}>
                  <Send className="h-4 w-4" /> Finish &amp; submit
                </Button>
              )}
            </div>
          </footer>
        </main>

        {/* Palette — a side panel on wide screens */}
        <aside className="hidden min-h-0 w-80 shrink-0 flex-col overflow-hidden border-l border-orange-200/60 bg-gradient-to-b from-orange-50/60 to-transparent pt-4 lg:flex dark:border-orange-400/15 dark:from-orange-500/5">
          <h2 className="px-4 pb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#c95817] dark:text-orange-300">Question palette</h2>
          <div className="min-h-0 flex-1">{Palette}</div>
        </aside>
      </div>

      {/* Palette — a drawer on small screens */}
      <Sheet open={paletteOpen} onOpenChange={setPaletteOpen}>
        <SheetContent className="p-0 pt-10" aria-describedby={undefined}>
          <SheetHeader className="px-4 pb-3 text-left">
            <SheetTitle className="text-base">Question palette</SheetTitle>
            <SheetDescription className="sr-only">Jump to any question</SheetDescription>
          </SheetHeader>
          {Palette}
        </SheetContent>
      </Sheet>

      {/* Exit confirmation */}
      <Dialog open={exitOpen} onOpenChange={(open) => !exiting && setExitOpen(open)}>
        <DialogContent className="overflow-hidden rounded-2xl border-orange-200/60 p-0 sm:max-w-md dark:border-orange-400/20">
          <DialogHeader className="border-b border-orange-200/60 bg-gradient-to-br from-orange-50 via-white to-orange-50/40 px-6 pb-4 pt-6 text-left dark:border-orange-400/15 dark:from-orange-500/10 dark:via-transparent dark:to-transparent">
            <DialogTitle>Are you sure you want to exit?</DialogTitle>
            <DialogDescription>Your test is not submitted.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 px-6 py-5 text-sm leading-relaxed">
            <div className="flex items-center gap-3 rounded-xl border border-orange-200/70 bg-orange-50/70 p-3.5 dark:border-orange-400/20 dark:bg-orange-500/10">
              <Timer className="h-5 w-5 shrink-0 text-[#e2691f]" />
              <p>
                <strong className="font-mono tabular-nums">{clock(remaining)}</strong> will still be left, and the timer keeps running while you are away.
              </p>
            </div>
            <p className="text-[var(--color-muted-foreground)]">
              Your answers are saved. You can continue from <strong className="text-[var(--color-foreground)]">My Results</strong> until the time runs out — after that the test is submitted automatically.
            </p>
          </div>
          <div className="flex justify-end gap-2 border-t border-orange-200/60 bg-gradient-to-r from-white via-orange-50/40 to-orange-50/70 px-6 py-3.5 dark:border-orange-400/15 dark:from-transparent dark:to-orange-500/10">
            <Button variant="outline" onClick={() => setExitOpen(false)} disabled={exiting}>
              Stay on test
            </Button>
            <Button className="gap-2 bg-red-600 font-semibold text-white hover:bg-red-700" onClick={() => void confirmExit()} disabled={exiting}>
              {exiting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
              Exit test
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Submit confirmation */}
      <Dialog open={confirmOpen} onOpenChange={(open) => !submitting && setConfirmOpen(open)}>
        <DialogContent className="overflow-hidden rounded-2xl border-orange-200/60 p-0 sm:max-w-md dark:border-orange-400/20">
          <DialogHeader className="border-b border-orange-200/60 bg-gradient-to-br from-orange-50 via-white to-orange-50/40 px-6 pb-4 pt-6 text-left dark:border-orange-400/15 dark:from-orange-500/10 dark:via-transparent dark:to-transparent">
            <DialogTitle>Submit the test?</DialogTitle>
            <DialogDescription>You cannot change your answers after submitting.</DialogDescription>
          </DialogHeader>
          <div className="space-y-1 px-6 py-4 text-sm">
            {[
              [Clock, 'Time left', clock(remaining)],
              [CheckCircle2, 'Answered', String(stats.answered)],
              [ListChecks, 'Not answered', String(stats.unanswered)],
              [Bookmark, 'Marked for review', String(stats.marked)],
            ].map(([Icon, label, value]) => {
              const Glyph = Icon as typeof Clock;
              return (
                <div key={label as string} className="flex items-center gap-3 border-b border-[var(--color-border)] py-3 last:border-0">
                  <Glyph className="h-4 w-4 text-[#e2691f]" />
                  <span className="text-[var(--color-muted-foreground)]">{label as string}</span>
                  <span className="ml-auto font-bold tabular-nums">{value as string}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-end gap-2 border-t border-orange-200/60 bg-gradient-to-r from-white via-orange-50/40 to-orange-50/70 px-6 py-3.5 dark:border-orange-400/15 dark:from-transparent dark:to-orange-500/10">
            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={submitting}>
              Keep working
            </Button>
            <Button className={cn('gap-2', ORANGE_BUTTON)} onClick={() => void submit(false)} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Yes, submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const LEGEND = {
  answered: 'border-transparent bg-green-500',
  visited: 'border-amber-400 bg-amber-100 dark:bg-amber-500/20',
  marked: 'border-transparent bg-violet-500',
  unseen: 'border-[var(--color-border)] bg-transparent',
};

const CELL = {
  answered: 'border-transparent bg-green-500 text-white shadow-sm shadow-green-600/25',
  visited: 'border-amber-400 bg-amber-50 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200',
  marked: 'border-transparent bg-violet-500 text-white shadow-sm shadow-violet-600/25',
  unseen: 'border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:border-orange-300',
};

/** Placeholder that mirrors the exam screen while the attempt loads. */
function RunnerSkeleton() {
  const tone = 'bg-[rgba(244,149,63,0.2)] dark:bg-[rgba(244,149,63,0.15)]';
  return (
    <div className="flex min-h-0 flex-1 flex-col" aria-busy="true" aria-label="Loading your test">
      {/* Top bar */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-orange-200/60 bg-gradient-to-r from-white via-[#FFF6EC] to-[#FFE4CC] px-4 sm:px-6 dark:border-orange-400/15 dark:from-[#0B1220] dark:via-[#1A1410] dark:to-[#3A1D08]">
        <Skeleton className={cn('h-10 w-32 rounded-xl', tone)} />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-56 max-w-[50%]" />
          <Skeleton className="hidden h-3 w-32 sm:block" />
        </div>
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="hidden h-9 w-9 rounded-lg sm:block" />
        <Skeleton className={cn('h-9 w-24 rounded-lg', tone)} />
      </div>

      <div className="flex min-h-0 flex-1">
        <main className="flex min-w-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-hidden">
            <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
              {/* Question header */}
              <div className="mb-5 flex items-center gap-3">
                <Skeleton className={cn('h-10 w-10 rounded-full', tone)} />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-6 w-10 rounded-md" />
                <Skeleton className="h-6 w-12 rounded-md" />
                <Skeleton className="h-6 w-28 rounded-md" />
                <Skeleton className="ml-auto h-9 w-36 rounded-lg" />
              </div>
              {/* Question text */}
              <div className="space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
              </div>
              {/* Options */}
              <div className="mt-7 space-y-3">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-xl border-2 border-[var(--color-border)] px-4 py-3.5">
                    <Skeleton className={cn('h-8 w-8 shrink-0 rounded-full', tone)} />
                    <Skeleton className="h-4" style={{ width: `${62 - i * 9}%` }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Action bar */}
          <div className="flex h-[72px] shrink-0 items-center border-t border-[var(--color-border)] px-2 sm:px-6">
            <div className="mx-auto flex w-full max-w-3xl items-center gap-2">
              <Skeleton className="h-10 w-24 rounded-md" />
              <Skeleton className="h-10 w-32 rounded-md" />
              <Skeleton className="h-10 w-20 rounded-md" />
              <Skeleton className={cn('ml-auto h-10 w-36 rounded-md', tone)} />
            </div>
          </div>
        </main>

        {/* Palette */}
        <aside className="hidden min-h-0 w-80 shrink-0 flex-col overflow-hidden border-l border-orange-200/60 bg-gradient-to-b from-orange-50/60 to-transparent pt-4 lg:flex dark:border-orange-400/15 dark:from-orange-500/5">
          <Skeleton className="mx-4 mb-4 h-3 w-36" />
          <div className="mb-4 grid grid-cols-2 gap-x-3 gap-y-2 px-4">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-3.5 w-full" />
            ))}
          </div>
          <div className="min-h-0 flex-1 overflow-hidden px-4">
            <div className="grid grid-cols-5 gap-2.5">
              {Array.from({ length: 40 }, (_, i) => (
                <Skeleton key={i} className="h-10 rounded-full" />
              ))}
            </div>
          </div>
          <div className="flex h-[72px] shrink-0 items-center border-t border-[var(--color-border)] px-4">
            <Skeleton className={cn('h-11 w-full rounded-md', tone)} />
          </div>
        </aside>
      </div>
    </div>
  );
}

// ───────────────────────────── loader ─────────────────────────────

export default function AttemptPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = use(params);
  const router = useRouter();

  const { data, isError, refetch, error } = useQuery({
    queryKey: ['student', 'tests', 'attempt', attemptId],
    queryFn: () => studentTestsApi.attempt(attemptId),
    staleTime: Infinity,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  useEffect(() => {
    if (data?.status === 'submitted') router.replace(`/student/tests/result/${attemptId}`);
  }, [data, attemptId, router]);

  if (data?.status === 'in-progress') return <Runner payload={data} />;

  const notFound = isError && (error as { response?: { status?: number } })?.response?.status === 404;

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-[var(--color-background)]">
      {isError ? (
        <>
          <div className="h-16 shrink-0 border-b border-[var(--color-border)]" />
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <ErrorState
              message={notFound ? 'This test attempt no longer exists. Start it again from Mock Tests.' : 'Could not load your test.'}
              onRetry={notFound ? undefined : () => refetch()}
              className="py-8"
            />
            <Button
              className="gap-2 border-0 bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] font-semibold text-white shadow-md shadow-orange-600/30"
              onClick={() => router.replace('/student/mock-tests')}
            >
              <ArrowLeft className="h-4 w-4" /> Go to Mock Tests
            </Button>
          </div>
        </>
      ) : (
        <RunnerSkeleton />
      )}
    </div>
  );
}

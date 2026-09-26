'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  BarChart3,
  Check,
  Clock,
  FileQuestion,
  Loader2,
  MinusCircle,
  PlayCircle,
  ShieldCheck,
  Trophy,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ui/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import { ThemeSwitcher } from '@/components/layout/ThemeSwitcher';
import { getErrorMessage } from '@/lib/api/errors';
import { bilingual, studentTestsApi } from '@/lib/api/studentTests';
import { cn } from '@/lib/utils';

type Language = 'en' | 'bn';

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E\")";

const HERO_BACKGROUND = {
  backgroundImage: `${GRAIN}, radial-gradient(700px 320px at 100% 0%, rgba(255,217,168,0.4), transparent 62%), radial-gradient(560px 320px at 0% 100%, rgba(110,35,8,0.4), transparent 65%), linear-gradient(152deg, #f4953f 0%, #e2691f 40%, #c4501a 72%, #97370f 100%)`,
  backgroundBlendMode: 'soft-light, normal, normal, normal',
};

const ORANGE_BUTTON =
  'border-0 bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] font-semibold text-white shadow-lg shadow-orange-600/30 ring-1 ring-inset ring-white/25 transition-all hover:-translate-y-px hover:bg-transparent hover:brightness-110 hover:shadow-xl hover:shadow-orange-600/40 disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none';

function HeroStat({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/25 bg-white/15 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-md">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white">
        <Icon className="h-5 w-5" />
      </span>
      <div className="leading-tight">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-orange-50/90">{label}</p>
        <p className="text-lg font-black tabular-nums text-white">{value}</p>
      </div>
    </div>
  );
}

function RuleGroup({ title, rules, startAt }: { title: string; rules: string[]; startAt: number }) {
  return (
    <section>
      <h3 className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#c95817] dark:text-orange-300">
        <span className="h-px w-5 bg-orange-400/70" />
        {title}
      </h3>
      <ol className="space-y-3">
        {rules.map((rule, index) => (
          <li key={rule} className="flex gap-3.5">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-[#b9450d] dark:bg-orange-500/20 dark:text-orange-300">
              {startAt + index}
            </span>
            <p className="text-[15px] leading-relaxed">{rule}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function TestInstructionsPage({ params }: { params: Promise<{ setId: string }> }) {
  const { setId } = use(params);
  const router = useRouter();
  const [language, setLanguage] = useState<Language>('en');
  const [agreed, setAgreed] = useState(false);

  const { data, isLoading, isError, refetch, error } = useQuery({
    queryKey: ['student', 'tests', 'instructions', setId],
    queryFn: () => studentTestsApi.instructions(setId),
    retry: false,
  });

  const start = useMutation({
    mutationFn: () => studentTestsApi.start(setId),
    onSuccess: (attempt) => {
      try {
        sessionStorage.setItem(`attempt-lang:${attempt.attemptId}`, language);
      } catch {
        /* the language choice is a convenience only */
      }
      router.push(`/student/tests/attempt/${attempt.attemptId}`);
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Could not start the test. Please try again.')),
  });

  const notFound = isError && (error as { response?: { status?: number } })?.response?.status === 404;
  const resuming = Boolean(data?.my.inProgressAttemptId);

  const groups = data
    ? [
        {
          title: 'About the test',
          rules: [
            `The test contains ${data.questionCount} questions in total.`,
            'Each question has 4 options, and only one is correct.',
            `You have ${data.durationMinutes} minutes to finish. The timer keeps running even if you close the page, and the test is submitted automatically when time is up.`,
          ],
        },
        {
          title: 'Marking scheme',
          rules: [
            `You will be awarded ${data.marksPerQuestion} ${data.marksPerQuestion === 1 ? 'mark' : 'marks'} for each correct answer${
              data.negativeMarksPerQuestion > 0
                ? ` and ${data.negativeMarksPerQuestion} will be deducted for each wrong answer.`
                : '. There is no negative marking.'
            }`,
            'There is no negative marking for questions you have not attempted.',
          ],
        },
        {
          title: 'While you take it',
          rules: [
            'You can mark a question for review and come back to it before you submit.',
            'Your answers are saved automatically as you go.',
          ],
        },
      ]
    : [];

  let counter = 1;

  return (
    <div data-lenis-prevent className="fixed inset-0 z-40 overflow-y-auto bg-[var(--color-background)] text-[var(--color-foreground)]">
      {/* Hero */}
      <div className="relative overflow-hidden text-white" style={HERO_BACKGROUND}>
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-32 h-[420px] w-[420px] rounded-full border border-white/25 shadow-[0_0_0_60px_rgba(255,255,255,0.03),0_0_0_61px_rgba(255,255,255,0.15),0_0_0_120px_rgba(255,255,255,0.02),0_0_0_121px_rgba(255,255,255,0.1)]" />

        <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-4 pt-5 sm:px-6">
          <Link
            href={data ? `/student/mock-tests/${data.exam._id}` : '/student/mock-tests'}
            className="flex h-9 items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-4 text-[13px] font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/25"
          >
            <ArrowLeft className="h-4 w-4" /> Back to tests
          </Link>
          <div className="[&_button]:border-white/30 [&_button]:bg-white/15 [&_button]:backdrop-blur-md [&_svg]:!text-white">
            <ThemeSwitcher />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-8 sm:px-6 sm:pb-28">
          {isLoading ? (
            <div className="space-y-3" aria-busy="true">
              <Skeleton className="h-4 w-48 bg-white/25" />
              <Skeleton className="h-10 w-2/3 bg-white/25" />
              <div className="grid gap-3 pt-4 sm:grid-cols-4">
                {Array.from({ length: 4 }, (_, i) => (
                  <Skeleton key={i} className="h-[68px] rounded-2xl bg-white/20" />
                ))}
              </div>
            </div>
          ) : data ? (
            <>
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-orange-50">
                <span className="h-px w-6 bg-white/60" />
                {data.exam.title}
              </p>
              <h1 className="mt-3 max-w-3xl text-3xl font-black leading-tight tracking-tight sm:text-4xl">{bilingual(data.title)}</h1>
              {data.title.bn && data.title.en && data.title.bn !== data.title.en && (
                <p className="mt-1.5 text-base text-orange-50/90">{data.title.bn}</p>
              )}

              <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
                <HeroStat icon={Clock} label="Duration" value={`${data.durationMinutes} min`} />
                <HeroStat icon={FileQuestion} label="Questions" value={String(data.questionCount)} />
                <HeroStat icon={Trophy} label="Maximum marks" value={String(data.totalMarks)} />
                <HeroStat
                  icon={MinusCircle}
                  label="Negative marking"
                  value={data.negativeMarksPerQuestion > 0 ? `−${data.negativeMarksPerQuestion}` : 'None'}
                />
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Body */}
      <div className="relative mx-auto -mt-14 w-full max-w-6xl px-4 pb-12 sm:-mt-16 sm:px-6">
        {isLoading ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]" aria-busy="true">
            <Skeleton className="h-96 rounded-3xl" />
            <Skeleton className="h-96 rounded-3xl" />
          </div>
        ) : notFound ? (
          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-elevated">
            <ErrorState message="This test is not available." className="py-16" />
          </div>
        ) : isError || !data ? (
          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-elevated">
            <ErrorState message="Could not load this test." onRetry={() => refetch()} className="py-16" />
          </div>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
            {/* Instructions */}
            <section className="rounded-3xl border border-orange-200/60 bg-[var(--color-card)] p-6 shadow-elevated sm:p-8 dark:border-orange-400/20">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] text-white shadow-md shadow-orange-600/30">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg font-black leading-tight tracking-tight">Before you begin</h2>
                  <p className="text-sm text-[var(--color-muted-foreground)]">Please read these instructions carefully.</p>
                </div>
              </div>

              <div className="space-y-7">
                {groups.map((group) => {
                  const startAt = counter;
                  counter += group.rules.length;
                  return <RuleGroup key={group.title} title={group.title} rules={group.rules} startAt={startAt} />;
                })}
              </div>
            </section>

            {/* Start card */}
            <aside className="space-y-5 rounded-3xl border border-orange-200/60 bg-[var(--color-card)] bg-gradient-to-b from-orange-50/80 to-transparent p-6 shadow-elevated lg:sticky lg:top-6 dark:border-orange-400/20 dark:from-orange-500/10">
              <div>
                <h2 className="text-lg font-black leading-tight tracking-tight">{resuming ? 'Welcome back' : 'Ready to begin?'}</h2>
                <p className="mt-0.5 text-sm text-[var(--color-muted-foreground)]">
                  {resuming ? 'Your earlier answers are saved.' : 'Choose your language and start when you are ready.'}
                </p>
              </div>

              {!resuming && (
                <>
                  <section>
                    <h3 className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#c95817] dark:text-orange-300">Default language</h3>
                    <div className="flex rounded-xl border border-orange-200/70 bg-white p-1 dark:border-white/10 dark:bg-white/5" role="radiogroup">
                      {(
                        [
                          ['en', 'English'],
                          ['bn', 'বাংলা'],
                        ] as const
                      ).map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          role="radio"
                          aria-checked={language === value}
                          onClick={() => setLanguage(value)}
                          className={cn(
                            'flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all',
                            language === value
                              ? 'bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] text-white shadow-md shadow-orange-600/30'
                              : 'text-[var(--color-muted-foreground)] hover:text-[#c95817]'
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <p className="mt-1.5 text-xs text-[var(--color-muted-foreground)]">You can switch during the test.</p>
                  </section>

                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--color-border)] bg-white/70 p-3.5 text-[13px] leading-relaxed transition-colors hover:border-orange-300 dark:bg-white/5">
                    <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(event) => setAgreed(event.target.checked)}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-orange-300 bg-white transition-colors checked:border-transparent checked:bg-gradient-to-br checked:from-[#f4953f] checked:to-[#c4501a] dark:bg-transparent"
                      />
                      <Check className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100" strokeWidth={3} />
                    </span>
                    <span>I have read and understood the instructions, and I agree not to use unfair means during this test.</span>
                  </label>
                </>
              )}

              <div className="space-y-2.5">
                <Button
                  size="lg"
                  className={cn('h-[52px] w-full gap-2 rounded-xl text-base', ORANGE_BUTTON)}
                  disabled={start.isPending || (!resuming && !agreed)}
                  onClick={() => start.mutate()}
                >
                  {start.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <PlayCircle className="h-5 w-5" />}
                  {resuming ? 'Continue test' : 'Start test'}
                </Button>
                {data.my.latestAttemptId && (
                  <Button asChild variant="outline" className="h-11 w-full gap-2 rounded-xl hover:border-orange-300 hover:bg-orange-50 hover:text-[#c95817]">
                    <Link href={`/student/tests/result/${data.my.latestAttemptId}`}>
                      <BarChart3 className="h-4 w-4" /> View last result
                    </Link>
                  </Button>
                )}
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

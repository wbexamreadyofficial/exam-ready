'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Phone, ShieldCheck, ArrowRight, ArrowLeft, Sparkles, MessageSquareText, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Logo } from '@/components/ui/Logo';
import { ThemeSwitcher } from '@/components/layout/ThemeSwitcher';
import { OtpInput } from '@/components/auth/OtpInput';
import { useAuth, type TryWebLoginResult } from '@/hooks/useAuth';
import { mobileSchema, type MobileInput } from '@/schemas/auth.schema';
import { cn } from '@/lib/utils';

const FIELD_ERROR = 'border-red-400 focus:border-red-500 focus:ring-red-500/10';

const LABEL_CLS = 'block text-[13px] font-semibold text-ink-800 dark:text-slate-300 mb-2';

const TRUST_STATS = [
  { value: '50,000+', label: 'Students' },
  { value: '1,00,000+', label: 'Mock Tests' },
  { value: '4.8/5', label: 'Rating' },
];

const RESEND_COOLDOWN_SECONDS = 30;

// Temporary one-click admin sign-in. It completes the normal admin OTP challenge with
// the code the backend echoes, which only happens outside production, so it cannot work
// against a production backend. Hidden in production builds unless explicitly enabled.
const ADMIN_QUICK_MOBILE = '9876543210';
const SHOW_ADMIN_QUICK_LOGIN =
  process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_ADMIN_QUICK_LOGIN === 'true';

type Step = 'mobile' | 'otp';

export default function LoginPage() {
  const { registerWeb, verifyWebOtp, tryWebLogin, isLoading, error, clearError } = useAuth();

  const [step, setStep] = useState<Step>('mobile');
  const [pendingMobile, setPendingMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState<string | undefined>();
  const [resendIn, setResendIn] = useState(0);
  /** True when the OTP step was triggered by an admin sign-in (not registration). */
  const [isAdminChallenge, setIsAdminChallenge] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm<MobileInput>({
    resolver: zodResolver(mobileSchema),
  });

  // Pre-fill the number when arriving from the register page's
  // "verify, then finish signing in here" handoff (?mobile=...).
  useEffect(() => {
    const mobileFromQuery = new URLSearchParams(window.location.search).get('mobile');
    if (mobileFromQuery) {
      setValue('mobileNumber', mobileFromQuery);
      setFocus('mobileNumber');
    }
  }, [setValue, setFocus]);

  // Resend cooldown ticker
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  // Surface auth errors as a toast instead of an inline block.
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  /** Returns true when the login attempt was fully handled (signed in, or moved to the OTP step). */
  const applyLoginOutcome = (outcome: TryWebLoginResult, mobileNumber: string): boolean => {
    if (outcome === 'logged-in') return true;
    if (outcome === 'no-account') return false;

    // Admin account: a code was issued — continue on the OTP step.
    setPendingMobile(mobileNumber);
    setDevOtp(outcome.devOtp);
    setOtp('');
    setResendIn(RESEND_COOLDOWN_SECONDS);
    setIsAdminChallenge(true);
    setStep('otp');
    return true;
  };

  const onMobileSubmit = async (data: MobileInput) => {
    clearError();
    try {
      // Every account (student, examiner, or partner) lives behind the web
      // flow now — see lib/api/auth.ts. /auth/web/login matches any
      // verified mobile number, so try logging straight in first; a miss
      // here is expected/silent for a brand-new number, not an error (see
      // `tryWebLogin`).
      const outcome = await tryWebLogin(data.mobileNumber);
      if (applyLoginOutcome(outcome, data.mobileNumber)) return;

      const result = await registerWeb(data.mobileNumber, 'student');

      if (result.isRegistered) {
        // Became verified between the check above and now (rare race) —
        // just try logging in again.
        const outcomeNow = await tryWebLogin(data.mobileNumber);
        if (!applyLoginOutcome(outcomeNow, data.mobileNumber)) {
          toast.error('Could not log you in. Please try again.');
        }
        return;
      }

      setPendingMobile(data.mobileNumber);
      setDevOtp(result.devOtp);
      setOtp('');
      setResendIn(RESEND_COOLDOWN_SECONDS);
      setStep('otp');
    } catch {
      /* `error` from useAuth already carries the message */
    }
  };

  const handleAdminQuickLogin = async () => {
    clearError();
    try {
      const outcome = await tryWebLogin(ADMIN_QUICK_MOBILE);
      if (outcome === 'logged-in') return;
      if (outcome === 'no-account') {
        toast.error('Admin account not found.');
        return;
      }
      if (!outcome.devOtp) {
        toast.error('Quick admin login needs a backend running outside production.');
        return;
      }
      await verifyWebOtp(ADMIN_QUICK_MOBILE, outcome.devOtp);
    } catch {
      /* `error` from useAuth already carries the message */
    }
  };

  const handleVerify = async (code: string) => {
    if (code.length !== 6) return;
    clearError();
    try {
      await verifyWebOtp(pendingMobile, code);
    } catch {
      setOtp('');
    }
  };

  const handleResend = async () => {
    if (resendIn > 0) return;
    clearError();
    try {
      if (isAdminChallenge) {
        // Admins re-request their code through the login endpoint.
        const outcome = await tryWebLogin(pendingMobile);
        if (typeof outcome === 'object') {
          setDevOtp(outcome.devOtp);
          setOtp('');
          setResendIn(RESEND_COOLDOWN_SECONDS);
        }
        return;
      }

      const result = await registerWeb(pendingMobile, 'student');
      if (!result.isRegistered) {
        setDevOtp(result.devOtp);
        setOtp('');
        setResendIn(RESEND_COOLDOWN_SECONDS);
      }
    } catch {
      /* error already surfaced via `error` state */
    }
  };

  const goBack = () => {
    clearError();
    setOtp('');
    setIsAdminChallenge(false);
    setStep('mobile');
  };

  return (
    <div
      className="relative h-screen overflow-hidden flex flex-col"
      style={{ background: 'radial-gradient(120% 100% at 50% 0%, #12244A 0%, #0B1B33 45%, #060B18 100%)' }}
    >
      {/* Ambient color washes */}
      <div className="pointer-events-none absolute -top-32 -left-24 z-0 h-[420px] w-[420px] rounded-full bg-blue-500/25 blur-[130px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 z-0 h-[420px] w-[420px] rounded-full bg-orange-500/15 blur-[130px]" aria-hidden="true" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 z-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-[130px]" aria-hidden="true" />

      {/* Top bar */}
      <div className="relative z-10 flex shrink-0 items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
        <Link href="/" className="inline-flex w-fit">
          <Logo size="sm" showTagline={false} variant="light" href="" />
        </Link>
        <ThemeSwitcher />
      </div>

      {/* Scrolls internally on very short viewports instead of the whole
          page overflowing — the outer frame always stays exactly 100vh. */}
      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <div className="flex min-h-full flex-col items-center justify-center gap-8">

          {/* ═══════════ Floating card ═══════════ */}
          <div className="w-full max-w-[440px] rounded-[28px] p-[1px] bg-gradient-to-b from-white/20 via-white/5 to-transparent shadow-[0_40px_90px_-24px_rgba(0,0,0,0.65)]">
            <div className="relative rounded-[27px] bg-white dark:bg-slate-900 p-7 sm:p-9 overflow-hidden">

              {/* Ambient tint inside the card */}
              <div className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-blue-500/10 blur-[70px]" aria-hidden="true" />

              {/* Premium floating icon badge */}
              <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-[0_16px_32px_-12px_rgba(37,99,235,0.55)]">
                <Phone className="h-6 w-6 text-white" strokeWidth={2} />
              </div>

              <div className="relative">
                {step === 'mobile' ? (
                  <MobileStep
                    onSubmit={handleSubmit(onMobileSubmit)}
                    register={register}
                    errors={errors}
                    isLoading={isLoading}
                    onAdminQuickLogin={SHOW_ADMIN_QUICK_LOGIN ? handleAdminQuickLogin : undefined}
                  />
                ) : (
                  <OtpStep
                    mobileNumber={pendingMobile}
                    otp={otp}
                    setOtp={setOtp}
                    onVerify={handleVerify}
                    onResend={handleResend}
                    onBack={goBack}
                    isLoading={isLoading}
                    resendIn={resendIn}
                    devOtp={devOtp}
                    error={error}
                  />
                )}

                <p className="mt-7 flex items-start justify-center gap-1.5 text-[12px] text-ink-500">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0 mt-0.5" strokeWidth={2} />
                  <span className="text-left">Your account and personal information are securely protected.</span>
                </p>
              </div>
            </div>
          </div>

          {step === 'mobile' && (
            <p className="-mt-4 text-[13.5px] text-white/70">
              Signing up as an examiner or partner?{' '}
              <Link href="/register" className="font-bold text-white link-underline">
                Register here
              </Link>
            </p>
          )}

          {/* Trust strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {TRUST_STATS.map((s, i) => (
              <div key={s.label} className="flex items-center gap-2">
                {i === 2 ? (
                  <div className="flex items-center gap-1" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} className="h-3 w-3 fill-orange-400 text-orange-400" />
                    ))}
                  </div>
                ) : null}
                <p className="tabular text-[13.5px] font-bold text-white/85">
                  {s.value} <span className="font-medium text-white/45">{s.label}</span>
                </p>
                {i < TRUST_STATS.length - 1 && <span className="hidden sm:block h-3 w-px bg-white/15" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Step 1 — mobile number only
───────────────────────────────────────── */
function MobileStep({
  onSubmit,
  register,
  errors,
  isLoading,
  onAdminQuickLogin,
}: {
  onAdminQuickLogin?: () => void;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  register: ReturnType<typeof useForm<MobileInput>>['register'];
  errors: ReturnType<typeof useForm<MobileInput>>['formState']['errors'];
  isLoading: boolean;
}) {
  return (
    <>
      <span className="eyebrow-line text-blue-600 dark:text-blue-400 mb-3">
        Welcome
      </span>
      <h2 className="display-section text-[1.875rem] sm:text-[2.125rem] dark:text-white mb-3">
        Sign in to Exam Ready
      </h2>
      <p className="lede text-[14.5px] dark:text-slate-400 mb-8">
        No password, no email — just your mobile number.
      </p>

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="mobileNumber" className={LABEL_CLS}>
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 flex items-center gap-2 pl-4 pr-3 border-r border-slate-200 dark:border-slate-700">
              <span className="text-[14.5px] font-bold text-ink-800 dark:text-slate-200">+91</span>
            </div>
            <input
              id="mobileNumber"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="98765 43210"
              autoComplete="tel"
              autoFocus
              className={cn(
                'peer h-[58px] w-full rounded-xl border bg-white pl-[76px] pr-4 text-[17px] font-semibold tracking-wide text-ink-900',
                'placeholder:text-ink-400 placeholder:font-normal transition-all duration-200 outline-none',
                'border-slate-200 hover:border-slate-300',
                'focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10',
                'dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:hover:border-slate-600',
                errors.mobileNumber && FIELD_ERROR
              )}
              {...register('mobileNumber')}
            />
          </div>
          {errors.mobileNumber ? (
            <p className="mt-1.5 text-[12px] text-red-600">{errors.mobileNumber.message}</p>
          ) : (
            <p className="mt-1.5 text-[12px] text-ink-500 dark:text-slate-500">
              Already registered? We&apos;ll recognise your number and skip straight to your dashboard.
            </p>
          )}
        </div>

        <Button
          type="submit"
          loading={isLoading}
          style={{ background: '#FF700B', color: 'var(--color-cta-foreground)', boxShadow: 'var(--shadow-cta)' }}
          className="btn-premium group h-[56px] w-full rounded-xl border-none text-[15.5px] font-bold"
        >
          Continue
          <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>

        {onAdminQuickLogin && (
          <>
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-ink-400 dark:text-slate-500">
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
              or
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            </div>
            <button
              type="button"
              onClick={onAdminQuickLogin}
              disabled={isLoading}
              className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-orange-300/70 bg-orange-50 text-[14.5px] font-bold text-[#b9450d] transition-all hover:-translate-y-px hover:border-orange-400 hover:bg-orange-100 hover:shadow-md disabled:opacity-60 dark:border-orange-400/30 dark:bg-orange-500/10 dark:text-orange-300"
            >
              <ShieldCheck className="h-4 w-4" />
              Admin login
            </button>
          </>
        )}
      </form>
    </>
  );
}

/* ─────────────────────────────────────────
   Step 2 — OTP verification
───────────────────────────────────────── */
function OtpStep({
  mobileNumber,
  otp,
  setOtp,
  onVerify,
  onResend,
  onBack,
  isLoading,
  resendIn,
  devOtp,
  error,
}: {
  mobileNumber: string;
  otp: string;
  setOtp: (v: string) => void;
  onVerify: (code: string) => void;
  onResend: () => void;
  onBack: () => void;
  isLoading: boolean;
  resendIn: number;
  devOtp?: string;
  error: string | null;
}) {
  const autoSubmitted = useRef(false);

  // Reset the auto-submit guard whenever the code is cleared (a fresh OTP
  // request, or the parent clearing it after a failed attempt) so retyping
  // a full code auto-submits again.
  useEffect(() => {
    if (otp === '') autoSubmitted.current = false;
  }, [otp, mobileNumber]);

  const handleComplete = (code: string) => {
    if (autoSubmitted.current) return;
    autoSubmitted.current = true;
    onVerify(code);
  };

  return (
    <>
      <button
        type="button"
        onClick={onBack}
        className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-600 hover:text-blue-700 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back
      </button>

      <span className="eyebrow-line text-blue-600 dark:text-blue-400 mb-3 inline-flex items-center gap-1.5">
        <MessageSquareText className="h-3.5 w-3.5" />
        Check your messages
      </span>
      <h2 className="display-section text-[1.875rem] sm:text-[2.125rem] dark:text-white mb-3">
        Enter verification code
      </h2>
      <p className="lede text-[14.5px] dark:text-slate-400 mb-8">
        We sent a 6-digit code via SMS to{' '}
        <span className="font-bold text-ink-900 dark:text-white">+91 {mobileNumber}</span>.
      </p>

      {devOtp && (
        <Alert className="mb-5 border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40">
          <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-300">
            Dev mode — your code is <span className="font-mono font-bold">{devOtp}</span>
          </AlertDescription>
        </Alert>
      )}

      <div className="mb-6">
        <OtpInput
          value={otp}
          onChange={setOtp}
          onComplete={handleComplete}
          error={!!error}
          disabled={isLoading}
        />
      </div>

      <Button
        type="button"
        loading={isLoading}
        disabled={otp.length !== 6}
        onClick={() => onVerify(otp)}
        style={{ background: '#FF700B', color: 'var(--color-cta-foreground)', boxShadow: 'var(--shadow-cta)' }}
        className="btn-premium group h-[56px] w-full rounded-xl border-none text-[15.5px] font-bold"
      >
        Verify &amp; Continue
        <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Button>

      <p className="mt-6 text-center text-[13.5px] text-ink-600 dark:text-slate-400">
        Didn&apos;t get the code?{' '}
        <button
          type="button"
          onClick={onResend}
          disabled={resendIn > 0}
          className={cn(
            'font-bold text-blue-700 dark:text-blue-400',
            resendIn > 0 ? 'opacity-50 cursor-not-allowed' : 'link-underline'
          )}
        >
          {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend code'}
        </button>
      </p>
    </>
  );
}

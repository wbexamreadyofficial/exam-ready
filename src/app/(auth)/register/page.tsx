'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Mail,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  MessageSquareText,
  GraduationCap,
  ClipboardCheck,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Logo } from '@/components/ui/Logo';
import { ThemeSwitcher } from '@/components/layout/ThemeSwitcher';
import { OtpInput } from '@/components/auth/OtpInput';
import { useAuth } from '@/hooks/useAuth';
import { webRegisterSchema, type WebRegisterInput } from '@/schemas/auth.schema';
import type { WebSignupRole } from '@/types/auth';
import { cn } from '@/lib/utils';

const FIELD_ERROR = 'border-red-400 focus:border-red-500 focus:ring-red-500/10';
const LABEL_CLS = 'block text-[13px] font-semibold text-ink-800 dark:text-slate-300 mb-2';
const RESEND_COOLDOWN_SECONDS = 30;

type Step = 'details' | 'otp';

const ROLE_OPTIONS: { value: WebSignupRole; label: string; description: string; icon: typeof GraduationCap }[] = [
  { value: 'student', label: 'Student', description: 'Practice & mock tests', icon: GraduationCap },
  { value: 'examiner', label: 'Examiner', description: 'Review & evaluate', icon: ClipboardCheck },
  { value: 'partner', label: 'Partner', description: 'Refer & earn', icon: Users },
];

export default function RegisterPage() {
  const { registerWeb, verifyWebOtp, loginWeb, isLoading, error, clearError } = useAuth();

  const [step, setStep] = useState<Step>('details');
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingMobile, setPendingMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState<string | undefined>();
  const [resendIn, setResendIn] = useState(0);
  const [signingIn, setSigningIn] = useState(false);
  const [role, setRole] = useState<WebSignupRole>('examiner');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<WebRegisterInput>({
    resolver: zodResolver(webRegisterSchema),
    defaultValues: { role: 'examiner' },
  });

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const chooseRole = (value: WebSignupRole) => {
    setRole(value);
    setValue('role', value, { shouldValidate: true });
  };

  const onDetailsSubmit = async (data: WebRegisterInput) => {
    clearError();
    try {
      const result = await registerWeb(data.email, data.mobileNumber, data.role);

      if (result.isRegistered) {
        setSigningIn(true);
        try {
          await loginWeb(data.email);
        } finally {
          setSigningIn(false);
        }
        return;
      }

      setPendingEmail(data.email);
      setPendingMobile(data.mobileNumber);
      setDevOtp(result.devOtp);
      setOtp('');
      setResendIn(RESEND_COOLDOWN_SECONDS);
      setStep('otp');
    } catch {
      /* `error` from useAuth already carries the message */
    }
  };

  const handleVerify = async (code: string) => {
    if (code.length !== 6) return;
    clearError();
    try {
      await verifyWebOtp(pendingEmail, code);
    } catch {
      setOtp('');
    }
  };

  const handleResend = async () => {
    if (resendIn > 0) return;
    clearError();
    try {
      const result = await registerWeb(pendingEmail, pendingMobile, role);
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
    setStep('details');
  };

  return (
    <div
      className="relative h-screen overflow-hidden flex flex-col"
      style={{ background: 'radial-gradient(120% 100% at 50% 0%, #12244A 0%, #0B1B33 45%, #060B18 100%)' }}
    >
      <div className="pointer-events-none absolute -top-32 -left-24 z-0 h-[420px] w-[420px] rounded-full bg-blue-500/25 blur-[130px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 z-0 h-[420px] w-[420px] rounded-full bg-orange-500/15 blur-[130px]" aria-hidden="true" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 z-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-[130px]" aria-hidden="true" />

      <div className="relative z-10 flex shrink-0 items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
        <Link href="/" className="inline-flex w-fit">
          <Logo size="sm" showTagline={false} variant="light" href="" />
        </Link>
        <ThemeSwitcher />
      </div>

      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <div className="flex min-h-full flex-col items-center justify-center gap-8">
          <div className="w-full max-w-[460px] rounded-[28px] p-[1px] bg-gradient-to-b from-white/20 via-white/5 to-transparent shadow-[0_40px_90px_-24px_rgba(0,0,0,0.65)]">
            <div className="relative rounded-[27px] bg-white dark:bg-slate-900 p-7 sm:p-9 overflow-hidden">
              <div className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-blue-500/10 blur-[70px]" aria-hidden="true" />

              <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-[0_16px_32px_-12px_rgba(37,99,235,0.55)]">
                <Mail className="h-6 w-6 text-white" strokeWidth={2} />
              </div>

              <div className="relative">
                {step === 'details' ? (
                  <DetailsStep
                    onSubmit={handleSubmit(onDetailsSubmit)}
                    register={register}
                    errors={errors}
                    isLoading={isLoading}
                    signingIn={signingIn}
                    role={role}
                    onChooseRole={chooseRole}
                  />
                ) : (
                  <OtpStep
                    email={pendingEmail}
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

                <p className="mt-7 flex items-center justify-center gap-1.5 text-center text-[12px] text-ink-500">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                  Your account and personal information are securely protected.
                </p>
              </div>
            </div>
          </div>

          <p className="text-[13.5px] text-white/70">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-white link-underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Step 1 — email, mobile, role
───────────────────────────────────────── */
function DetailsStep({
  onSubmit,
  register,
  errors,
  isLoading,
  signingIn,
  role,
  onChooseRole,
}: {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  register: ReturnType<typeof useForm<WebRegisterInput>>['register'];
  errors: ReturnType<typeof useForm<WebRegisterInput>>['formState']['errors'];
  isLoading: boolean;
  signingIn: boolean;
  role: WebSignupRole;
  onChooseRole: (value: WebSignupRole) => void;
}) {
  return (
    <>
      <span className="eyebrow-line text-blue-600 dark:text-blue-400 mb-3">Get started</span>
      <h2 className="display-section text-[1.75rem] sm:text-[2rem] dark:text-white mb-3">
        Create your account
      </h2>
      <p className="lede text-[14.5px] dark:text-slate-400 mb-7">
        Sign up as an examiner, partner, or student.
      </p>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className={LABEL_CLS}>
            I am a <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {ROLE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const active = role === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChooseRole(opt.value)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition-all duration-150',
                    active
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  )}
                >
                  <Icon
                    className={cn('h-5 w-5', active ? 'text-blue-600 dark:text-blue-400' : 'text-ink-500 dark:text-slate-400')}
                    strokeWidth={2}
                  />
                  <span className={cn('text-[12.5px] font-bold', active ? 'text-blue-700 dark:text-blue-400' : 'text-ink-800 dark:text-slate-200')}>
                    {opt.label}
                  </span>
                  <span className="text-[10.5px] text-ink-500 dark:text-slate-500 leading-tight">{opt.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label htmlFor="email" className={LABEL_CLS}>
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            autoFocus
            className={cn(
              'h-[54px] w-full rounded-xl border bg-white px-4 text-[15px] font-semibold text-ink-900',
              'placeholder:text-ink-400 placeholder:font-normal transition-all duration-200 outline-none',
              'border-slate-200 hover:border-slate-300',
              'focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10',
              'dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:hover:border-slate-600',
              errors.email && FIELD_ERROR
            )}
            {...register('email')}
          />
          {errors.email && <p className="mt-1.5 text-[12px] text-red-600">{errors.email.message}</p>}
        </div>

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
              className={cn(
                'h-[54px] w-full rounded-xl border bg-white pl-[76px] pr-4 text-[15px] font-semibold tracking-wide text-ink-900',
                'placeholder:text-ink-400 placeholder:font-normal transition-all duration-200 outline-none',
                'border-slate-200 hover:border-slate-300',
                'focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10',
                'dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:hover:border-slate-600',
                errors.mobileNumber && FIELD_ERROR
              )}
              {...register('mobileNumber')}
            />
          </div>
          {errors.mobileNumber && <p className="mt-1.5 text-[12px] text-red-600">{errors.mobileNumber.message}</p>}
        </div>

        <Button
          type="submit"
          loading={isLoading}
          style={{ background: '#FF700B', color: 'var(--color-cta-foreground)', boxShadow: 'var(--shadow-cta)' }}
          className="btn-premium group h-[56px] w-full rounded-xl border-none text-[15.5px] font-bold"
        >
          {signingIn ? 'Welcome back — signing you in…' : 'Continue'}
          <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </form>
    </>
  );
}

/* ─────────────────────────────────────────
   Step 2 — OTP verification
───────────────────────────────────────── */
function OtpStep({
  email,
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
  email: string;
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

  useEffect(() => {
    if (otp === '') autoSubmitted.current = false;
  }, [otp, email]);

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
        Check your inbox
      </span>
      <h2 className="display-section text-[1.75rem] sm:text-[2rem] dark:text-white mb-3">
        Enter verification code
      </h2>
      <p className="lede text-[14.5px] dark:text-slate-400 mb-8">
        We sent a 6-digit code to <span className="font-bold text-ink-900 dark:text-white">{email}</span>.
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
        <OtpInput value={otp} onChange={setOtp} onComplete={handleComplete} error={!!error} disabled={isLoading} />
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

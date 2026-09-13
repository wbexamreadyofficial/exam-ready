'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Phone,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  MessageSquareText,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Logo } from '@/components/ui/Logo';
import { ThemeSwitcher } from '@/components/layout/ThemeSwitcher';
import { OtpInput } from '@/components/auth/OtpInput';
import { useAuth } from '@/hooks/useAuth';
import { registerMobileRoleSchema, type RegisterMobileRoleInput } from '@/schemas/auth.schema';
import type { WebSignupRole } from '@/types/auth';
import { cn } from '@/lib/utils';

const FIELD_ERROR = 'border-red-400 focus:border-red-500 focus:ring-red-500/10';
const LABEL_CLS = 'block text-[13px] font-semibold text-ink-800 dark:text-slate-300 mb-2';
const RESEND_COOLDOWN_SECONDS = 30;

type Step = 'details' | 'otp';

const ROLE_OPTIONS: { value: WebSignupRole; label: string }[] = [
  { value: 'student', label: 'Student' },
  { value: 'examiner', label: 'Examiner' },
  { value: 'partner', label: 'Partner' },
];

const VALID_ROLES: readonly WebSignupRole[] = ROLE_OPTIONS.map((opt) => opt.value);

function isWebSignupRole(value: string | null): value is WebSignupRole {
  return !!value && (VALID_ROLES as string[]).includes(value);
}

export default function RegisterPage() {
  const router = useRouter();
  const { registerWeb, verifyWebRegistration, isLoading, error, clearError } = useAuth();

  const [step, setStep] = useState<Step>('details');
  const [pendingMobile, setPendingMobile] = useState('');
  const [pendingRole, setPendingRole] = useState<WebSignupRole>('student');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState<string | undefined>();
  const [resendIn, setResendIn] = useState(0);
  const [isRoleLocked, setIsRoleLocked] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterMobileRoleInput>({
    resolver: zodResolver(registerMobileRoleSchema),
    defaultValues: { role: 'student' },
  });

  // A role picked from the Navbar's "Sign Up Free" dropdown arrives as
  // ?role=... — pre-fill and lock the field so it can't be changed here.
  // Done post-mount (not a lazy useState initializer) so the statically
  // prerendered HTML and the first client render always agree, with the
  // lock applying a beat later once the query string is read.
  useEffect(() => {
    const roleFromQuery = new URLSearchParams(window.location.search).get('role');
    if (isWebSignupRole(roleFromQuery)) {
      setValue('role', roleFromQuery, { shouldValidate: true });
      // Syncing one-time state from the URL on mount, not from React props/state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsRoleLocked(true);
    }
  }, [setValue]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  /** Sends the visitor to the login page with their number pre-filled — the
   *  actual sign-in always happens there (via `tryWebLogin`), whether they
   *  just verified an OTP or the number turned out to already be registered. */
  const goToLoginWithMobile = (mobileNumber: string) => {
    router.push(`/login?mobile=${encodeURIComponent(mobileNumber)}`);
  };

  const onDetailsSubmit = async (data: RegisterMobileRoleInput) => {
    clearError();
    try {
      const result = await registerWeb(data.mobileNumber, data.role);

      if (result.isRegistered) {
        toast.info('This number is already registered. Please log in.');
        goToLoginWithMobile(data.mobileNumber);
        return;
      }

      setPendingMobile(data.mobileNumber);
      setPendingRole(data.role);
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
      await verifyWebRegistration(pendingMobile, code);
      toast.success('Number verified! Log in to continue.');
      goToLoginWithMobile(pendingMobile);
    } catch {
      setOtp('');
    }
  };

  const handleResend = async () => {
    if (resendIn > 0) return;
    clearError();
    try {
      const result = await registerWeb(pendingMobile, pendingRole);
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

      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto px-5 py-3">
        <div className="flex min-h-full flex-col items-center justify-center gap-6">
          <div className="w-full max-w-[440px] rounded-[28px] p-[1px] bg-gradient-to-b from-white/20 via-white/5 to-transparent shadow-[0_40px_90px_-24px_rgba(0,0,0,0.65)]">
            <div className="relative rounded-[27px] bg-white dark:bg-slate-900 p-6 sm:p-8 overflow-hidden">
              <div className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-blue-500/10 blur-[70px]" aria-hidden="true" />

              <div className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-[0_16px_32px_-12px_rgba(37,99,235,0.55)]">
                <Phone className="h-5 w-5 text-white" strokeWidth={2} />
              </div>

              <div className="relative">
                {step === 'details' ? (
                  <DetailsStep
                    onSubmit={handleSubmit(onDetailsSubmit)}
                    register={register}
                    errors={errors}
                    isLoading={isLoading}
                    isRoleLocked={isRoleLocked}
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

                <p className="mt-5 flex items-start justify-center gap-1.5 text-[12px] text-ink-500">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0 mt-0.5" strokeWidth={2} />
                  <span className="text-left">Your account and personal information are securely protected.</span>
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
   Step 1 — mobile number + role
───────────────────────────────────────── */
function DetailsStep({
  onSubmit,
  register,
  errors,
  isLoading,
  isRoleLocked,
}: {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  register: ReturnType<typeof useForm<RegisterMobileRoleInput>>['register'];
  errors: ReturnType<typeof useForm<RegisterMobileRoleInput>>['formState']['errors'];
  isLoading: boolean;
  isRoleLocked: boolean;
}) {
  return (
    <>
      <span className="eyebrow-line text-blue-600 dark:text-blue-400 mb-2">
        Get Started
      </span>
      <h2 className="display-section text-[1.875rem] sm:text-[2.125rem] dark:text-white mb-2">
        Create your account
      </h2>
      <p className="lede text-[14.5px] dark:text-slate-400 mb-6">
        Sign up as a student, examiner, or partner.
      </p>

      <form onSubmit={onSubmit} className="space-y-5">
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
          {errors.mobileNumber && <p className="mt-1.5 text-[12px] text-red-600">{errors.mobileNumber.message}</p>}
        </div>

        <div>
          <label htmlFor="role" className={LABEL_CLS}>
            I am a <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="role"
              defaultValue="student"
              disabled={isRoleLocked}
              className={cn(
                'peer h-[58px] w-full appearance-none rounded-xl border bg-white pl-4 pr-11 text-[17px] font-semibold text-ink-900 cursor-pointer',
                'transition-all duration-200 outline-none',
                'border-slate-200 hover:border-slate-300',
                'focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10',
                'dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:hover:border-slate-600',
                isRoleLocked && 'cursor-not-allowed opacity-60 hover:border-slate-200 dark:hover:border-slate-700',
                errors.role && FIELD_ERROR
              )}
              {...register('role')}
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-ink-500 dark:text-slate-400" strokeWidth={2} />
          </div>
          {errors.role ? (
            <p className="mt-1.5 text-[12px] text-red-600">{errors.role.message}</p>
          ) : (
            isRoleLocked && (
              <p className="mt-1.5 text-[12px] text-ink-500 dark:text-slate-500">
                Selected from your signup link.
              </p>
            )
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
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-600 hover:text-blue-700 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back
      </button>

      <span className="eyebrow-line text-blue-600 dark:text-blue-400 mb-2 inline-flex items-center gap-1.5">
        <MessageSquareText className="h-3.5 w-3.5" />
        Verify your number
      </span>
      <h2 className="display-section text-[1.875rem] sm:text-[2.125rem] dark:text-white mb-2">
        Enter verification code
      </h2>
      <p className="lede text-[14.5px] dark:text-slate-400 mb-6">
        We generated a 6-digit code for{' '}
        <span className="font-bold text-ink-900 dark:text-white">+91 {mobileNumber}</span>.
      </p>

      {devOtp && (
        <Alert className="mb-4 border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40">
          <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-300">
            Dev mode — your code is <span className="font-mono font-bold">{devOtp}</span>
          </AlertDescription>
        </Alert>
      )}

      <div className="mb-5">
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

      <p className="mt-5 text-center text-[13.5px] text-ink-600 dark:text-slate-400">
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

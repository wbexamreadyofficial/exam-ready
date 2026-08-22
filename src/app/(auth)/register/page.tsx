'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Eye, EyeOff, User, Mail, Phone, Lock, ShieldCheck, ArrowRight, Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Logo } from '@/components/ui/Logo';
import { ThemeSwitcher } from '@/components/layout/ThemeSwitcher';
import { SignUpVisual } from '@/components/auth/SignUpVisual';
import { useAuth } from '@/hooks/useAuth';
import { registerSchema, type RegisterInput } from '@/schemas/auth.schema';
import { cn } from '@/lib/utils';

/*
  Exam preference chips — presentation only.
  Selection is local UI state for the visual "selected" treatment; it is NOT
  part of the form payload and is not submitted anywhere.
*/
const EXAM_OPTIONS = [
  'WBCS', 'WBPSC', 'WB Police', 'WBSSC',
  'Primary TET', 'Upper Primary TET', 'Group C', 'Group D',
];

/* Shared field shell so every input has identical height, radius and focus ring */
const FIELD_BASE =
  'peer h-[54px] w-full rounded-xl border bg-white pl-11 pr-4 text-[14.5px] text-ink-900 ' +
  'placeholder:text-ink-500 transition-all duration-200 outline-none ' +
  'border-slate-200 hover:border-slate-300 ' +
  'focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 ' +
  'dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:hover:border-slate-600';

const FIELD_ERROR = 'border-red-400 focus:border-red-500 focus:ring-red-500/10';

/* Icons sit at ink-500 (#64748B): darker and more scannable than ink-400,
   still clearly subordinate to the ink-900 input text. */
const ICON_CLS =
  'pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] ' +
  'text-ink-500 transition-colors peer-focus:text-blue-600';

const LABEL_CLS = 'block text-[13px] font-semibold text-ink-800 dark:text-slate-300 mb-2';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedExams, setSelectedExams] = useState<string[]>(['WBCS']);
  const { register: authRegister, isLoading, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      await authRegister(data.name, data.email, data.password);
    } catch {
      /* handled in hook */
    }
  };

  const toggleExam = (exam: string) =>
    setSelectedExams((prev) =>
      prev.includes(exam) ? prev.filter((e) => e !== exam) : [...prev, exam]
    );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 lg:grid lg:grid-cols-[45%_55%]">

      {/* ═══════════════════════════════════════════
          LEFT — brand & product visualisation
          Hidden below lg; mobile gets a compact header instead.
         ═══════════════════════════════════════════ */}
      {/*
        The navy gradient lives ON the <aside>, not on a `-z-10` child.
        A negatively-stacked child here painted BEHIND the root
        `div.bg-white`, so the whole panel rendered white and every
        light-on-navy element became invisible. `isolate` pins the
        stacking context so the decorative layers stay inside.
      */}
      <aside
        className="on-dark relative isolate hidden lg:flex flex-col justify-between overflow-hidden p-10 xl:p-12"
        style={{ background: 'linear-gradient(150deg, #0B1B33 0%, #17325C 55%, #0B1B33 100%)' }}
      >
        {/* Grid texture */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '52px 52px',
          }}
          aria-hidden="true"
        />
        {/* Ambient light */}
        <div className="pointer-events-none absolute -top-24 -left-16 z-0 h-96 w-96 rounded-full bg-blue-500/25 blur-[110px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-28 -right-10 z-0 h-96 w-96 rounded-full bg-orange-500/15 blur-[110px]" aria-hidden="true" />

        {/* Logo */}
        <Link href="/" className="relative z-10 inline-flex w-fit">
          <Logo size="md" showTagline={false} variant="light" href="" />
        </Link>

        {/* Copy + visual — even rhythm: heading → lede → card */}
        <div className="relative z-10 flex flex-1 flex-col justify-center py-8">
          <h1 className="display-hero text-balance text-[2.25rem] xl:text-[2.6rem] text-white mb-4">
            Start Your Journey to Success
          </h1>
          <p className="max-w-md text-[15px] leading-relaxed text-blue-100/80 mb-9">
            Prepare smarter. Practice better. Get exam-ready with realistic mock
            tests, detailed analysis and personalized performance insights.
          </p>

          <div className="flex justify-center xl:justify-start">
            <SignUpVisual />
          </div>
        </div>

        {/*
          Journey strip — the four stages of the product promise.
          Opacity raised from white/45 (unreadable) so every stage is legible,
          not just the highlighted final one.
        */}
        <div className="relative z-10 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px] font-semibold text-white/70">
          {['Learn', 'Practice', 'Improve', 'Succeed'].map((step, i) => (
            <span key={step} className="flex items-center gap-2.5">
              {i > 0 && <span aria-hidden="true" className="text-white/40">→</span>}
              <span className={i === 3 ? 'text-orange-300' : undefined}>{step}</span>
            </span>
          ))}
        </div>
      </aside>

      {/* ═══════════════════════════════════════════
          RIGHT — sign up form
         ═══════════════════════════════════════════ */}
      <main className="relative flex flex-col bg-[#FAFBFD] dark:bg-slate-950">
        {/* Very subtle depth — dissolves at the edges */}
        <div className="absolute inset-0 bg-grid-fine mask-radial-fade opacity-60 pointer-events-none" aria-hidden="true" />

        {/* Mobile header */}
        <div className="relative flex items-center justify-between px-5 pt-5 lg:hidden">
          <Link href="/">
            <Logo size="sm" showTagline={false} href="" />
          </Link>
          <ThemeSwitcher />
        </div>
        {/* Desktop theme toggle */}
        <div className="relative hidden lg:flex justify-end px-10 pt-8">
          <ThemeSwitcher />
        </div>

        <div className="relative flex flex-1 justify-center px-5 py-10 sm:px-8 lg:px-12 xl:px-16">
          <div className="w-full max-w-[540px]">

            {/* ── Heading ── */}
            <span className="eyebrow-line text-blue-600 dark:text-blue-400 mb-3">
              Welcome to Exam Ready
            </span>
            <h2 className="display-section text-[1.75rem] sm:text-[2rem] dark:text-white mb-2.5">
              Create your account
            </h2>
            <p className="lede text-[14.5px] dark:text-slate-400 mb-8">
              Start your exam preparation journey today.
            </p>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {/* Full Name */}
              <div>
                <label htmlFor="name" className={LABEL_CLS}>Full Name</label>
                <div className="relative">
                  <input
                    id="name"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className={cn(FIELD_BASE, errors.name && FIELD_ERROR)}
                    {...register('name')}
                  />
                  <User className={ICON_CLS} strokeWidth={1.9} />
                </div>
                {errors.name && (
                  <p className="mt-1.5 text-[12px] text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className={LABEL_CLS}>Email Address</label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    autoComplete="email"
                    className={cn(FIELD_BASE, errors.email && FIELD_ERROR)}
                    {...register('email')}
                  />
                  <Mail className={ICON_CLS} strokeWidth={1.9} />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-[12px] text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/*
                Mobile Number — VISUAL ONLY.
                Intentionally not registered with the form: the existing
                registerSchema has no `mobile` field, and wiring one would mean
                changing validation/registration logic, which is out of scope.
              */}
              <div>
                <label htmlFor="mobile" className={LABEL_CLS}>Mobile Number</label>
                <div className="relative">
                  <input
                    id="mobile"
                    type="tel"
                    placeholder="Enter your mobile number"
                    autoComplete="tel"
                    className={FIELD_BASE}
                  />
                  <Phone className={ICON_CLS} strokeWidth={1.9} />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className={LABEL_CLS}>Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    className={cn(FIELD_BASE, 'pr-12', errors.password && FIELD_ERROR)}
                    {...register('password')}
                  />
                  <Lock className={ICON_CLS} strokeWidth={1.9} />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-ink-500 transition-colors hover:bg-slate-100 hover:text-ink-700 dark:hover:bg-slate-800"
                  >
                    {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-[12px] text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className={LABEL_CLS}>Confirm Password</label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    className={cn(FIELD_BASE, 'pr-12', errors.confirmPassword && FIELD_ERROR)}
                    {...register('confirmPassword')}
                  />
                  <ShieldCheck className={ICON_CLS} strokeWidth={1.9} />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-ink-500 transition-colors hover:bg-slate-100 hover:text-ink-700 dark:hover:bg-slate-800"
                  >
                    {showConfirm ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-[12px] text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* ── Exam preference (visual only) ── */}
              <fieldset className="pt-1">
                <legend className={cn(LABEL_CLS, 'mb-3')}>
                  Which exam are you preparing for?{' '}
                  <span className="font-normal text-ink-500">(optional)</span>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {EXAM_OPTIONS.map((exam) => {
                    const active = selectedExams.includes(exam);
                    return (
                      <button
                        key={exam}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggleExam(exam)}
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-[13px] font-semibold transition-all duration-200',
                          active
                            ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                            : 'border-slate-200 bg-white text-ink-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600'
                        )}
                      >
                        {active && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                        {exam}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* ── Primary CTA ── */}
              <Button
                type="submit"
                loading={isLoading}
                style={{ background: '#FF700B', color: 'var(--color-cta-foreground)', boxShadow: 'var(--shadow-cta)' }}
                className="btn-premium group h-[54px] w-full rounded-xl border-none text-[15px] font-bold"
              >
                Create Account
                <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </form>

            {/* ── Divider ── */}
            <div className="my-7 flex items-center gap-4">
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-500">
                Or continue with
              </span>
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            {/* ── Social buttons (UI only — no OAuth) ── */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                className="flex h-[52px] items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white text-[14px] font-semibold text-ink-800 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600"
              >
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5A11 11 0 0 0 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <button
                type="button"
                className="flex h-[52px] items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white text-[14px] font-semibold text-ink-800 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600"
              >
                <svg className="h-[18px] w-[18px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Continue with Apple
              </button>
            </div>

            {/* ── Login link ── */}
            <p className="mt-7 text-center text-[14px] text-ink-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link
                href="/login"
                className="link-underline font-bold text-blue-700 dark:text-blue-400"
              >
                Log in
              </Link>
            </p>

            {/* ── Trust note ── */}
            <p className="mt-6 flex items-center justify-center gap-1.5 text-[12px] text-ink-500">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
              Your information is secure and protected.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

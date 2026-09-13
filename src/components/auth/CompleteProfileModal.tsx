'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowRight, CalendarDays, Loader2, Mail, ShieldCheck, User } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { usersApi } from '@/lib/api/users';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import type { UpdateProfileInput } from '@/types/user';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELD_ERROR = 'border-red-400 focus:border-red-500 focus:ring-red-500/10';
const LABEL_CLS = 'block text-[13px] font-semibold text-ink-800 dark:text-slate-300 mb-2';

/** Mirrors the backend's `dobSchema` age check (user.schema.ts). */
function calculateAge(dob: Date, today = new Date()): number {
  let age = today.getUTCFullYear() - dob.getUTCFullYear();
  const birthdayHasPassed =
    today.getUTCMonth() > dob.getUTCMonth() ||
    (today.getUTCMonth() === dob.getUTCMonth() && today.getUTCDate() >= dob.getUTCDate());
  if (!birthdayHasPassed) age -= 1;
  return age;
}

/**
 * A blocking, non-dismissable modal shown after login whenever the signed-in
 * account (student, examiner, or partner) is missing an email and/or date of
 * birth — both are required for the account but aren't collected anywhere
 * in the phone/OTP sign-up flow. Collects whichever of the two is missing,
 * saves it via the profile endpoint, and then closes itself.
 */
export function CompleteProfileModal() {
  const queryClient = useQueryClient();
  const storeUser = useAuthStore((s) => s.user);
  const setStoreUser = useAuthStore((s) => s.setUser);

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: usersApi.getMe,
    enabled: !!storeUser,
  });

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [dobError, setDobError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (payload: UpdateProfileInput) => usersApi.updateProfile(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(['profile'], updated);
      queryClient.invalidateQueries({ queryKey: ['profile-completion'] });
      if (storeUser) {
        setStoreUser({ ...storeUser, fullName: updated.fullName, email: updated.email });
      }
      toast.success('Profile completed. Welcome aboard!');
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Could not save your details. Please try again.';
      toast.error(message);
    },
  });

  // Never for admins (created internally, not via this self-serve flow) or
  // before the profile has loaded.
  if (!storeUser || storeUser.role === 'admin' || !profile) return null;

  const needsFullName = !profile.fullName;
  const needsEmail = !profile.email;
  const needsDob = !profile.dob;
  if (!needsFullName && !needsEmail && !needsDob) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFullNameError(null);
    setEmailError(null);
    setDobError(null);

    const payload: UpdateProfileInput = {};
    let hasError = false;

    if (needsFullName) {
      const trimmed = fullName.trim();
      if (trimmed.length < 2) {
        setFullNameError('Full name must be at least 2 characters');
        hasError = true;
      } else {
        payload.fullName = trimmed;
      }
    }

    if (needsEmail) {
      const trimmed = email.trim();
      if (!EMAIL_PATTERN.test(trimmed)) {
        setEmailError('Enter a valid email address');
        hasError = true;
      } else {
        payload.email = trimmed;
      }
    }

    if (needsDob) {
      if (!dob) {
        setDobError('Date of birth is required');
        hasError = true;
      } else {
        const age = calculateAge(new Date(dob));
        if (Number.isNaN(age) || age < 18 || age > 40) {
          setDobError('Age must be between 18 and 40');
          hasError = true;
        } else {
          payload.dob = dob;
        }
      }
    }

    if (hasError) return;
    mutation.mutate(payload);
  };

  return (
    <Dialog open>
      <DialogContent
        hideCloseButton
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="sm:max-w-[520px] rounded-[24px] border-none bg-white dark:bg-slate-900 p-7 sm:p-8 shadow-[0_40px_90px_-24px_rgba(0,0,0,0.55)] overflow-hidden"
      >
        {/* Ambient tint, matching the auth pages' premium cards */}
        <div className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-blue-500/10 blur-[70px]" aria-hidden="true" />

        <div className="relative">
          <div className="mb-6 flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-[0_16px_32px_-12px_rgba(37,99,235,0.55)]">
              <ShieldCheck className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <h2 className="display-section text-[1.15rem] sm:text-[1.25rem] leading-tight dark:text-white whitespace-nowrap">
                Complete your profile
              </h2>
              <p className="lede text-[13px] leading-snug dark:text-slate-400 sm:whitespace-nowrap">
                We need a couple more details before you continue.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {needsFullName && (
              <div>
                <label htmlFor="cp-fullName" className={LABEL_CLS}>
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute left-0 top-0 bottom-0 flex items-center pl-4 pr-3 border-r border-slate-200 dark:border-slate-700">
                    <User className="h-[18px] w-[18px] text-ink-500 dark:text-slate-400" strokeWidth={2} />
                  </div>
                  <input
                    id="cp-fullName"
                    type="text"
                    placeholder="Your full name"
                    autoComplete="name"
                    autoFocus
                    className={cn(
                      'peer h-[54px] w-full rounded-xl border bg-white pl-[62px] pr-4 text-[15.5px] font-semibold text-ink-900',
                      'placeholder:text-ink-400 placeholder:font-normal placeholder:text-[14px] transition-all duration-200 outline-none',
                      'border-slate-200 hover:border-slate-300',
                      'focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10',
                      'dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:hover:border-slate-600',
                      fullNameError && FIELD_ERROR
                    )}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                {fullNameError && <p className="mt-1.5 text-[12px] text-red-600">{fullNameError}</p>}
              </div>
            )}

            {needsEmail && (
              <div>
                <label htmlFor="cp-email" className={LABEL_CLS}>
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute left-0 top-0 bottom-0 flex items-center pl-4 pr-3 border-r border-slate-200 dark:border-slate-700">
                    <Mail className="h-[18px] w-[18px] text-ink-500 dark:text-slate-400" strokeWidth={2} />
                  </div>
                  <input
                    id="cp-email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    autoFocus={!needsFullName}
                    className={cn(
                      'peer h-[54px] w-full rounded-xl border bg-white pl-[62px] pr-4 text-[15.5px] font-semibold text-ink-900',
                      'placeholder:text-ink-400 placeholder:font-normal placeholder:text-[14px] transition-all duration-200 outline-none',
                      'border-slate-200 hover:border-slate-300',
                      'focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10',
                      'dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:hover:border-slate-600',
                      emailError && FIELD_ERROR
                    )}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {emailError && <p className="mt-1.5 text-[12px] text-red-600">{emailError}</p>}
              </div>
            )}

            {needsDob && (
              <div>
                <label htmlFor="cp-dob" className={LABEL_CLS}>
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute left-0 top-0 bottom-0 flex items-center pl-4 pr-3 border-r border-slate-200 dark:border-slate-700">
                    <CalendarDays className="h-[18px] w-[18px] text-ink-500 dark:text-slate-400" strokeWidth={2} />
                  </div>
                  <input
                    id="cp-dob"
                    type="date"
                    className={cn(
                      'peer h-[54px] w-full rounded-xl border bg-white pl-[62px] pr-4 text-[15.5px] font-semibold text-ink-900',
                      'transition-all duration-200 outline-none',
                      'border-slate-200 hover:border-slate-300',
                      'focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10',
                      'dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:hover:border-slate-600',
                      dobError && FIELD_ERROR
                    )}
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>
                {dobError && <p className="mt-1.5 text-[12px] text-red-600">{dobError}</p>}
              </div>
            )}

            <button
              type="submit"
              disabled={mutation.isPending}
              style={{ background: '#FF700B', color: 'var(--color-cta-foreground)', boxShadow: 'var(--shadow-cta)' }}
              className="btn-premium group flex h-[54px] w-full items-center justify-center gap-1.5 rounded-xl border-none text-[15px] font-bold disabled:opacity-70"
            >
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

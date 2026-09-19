'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Languages,
  ShieldCheck,
  BadgeCheck,
  Clock,
  Loader2,
  Save,
} from 'lucide-react';
import { usersApi } from '@/lib/api/users';
import { mediaApi } from '@/lib/api/media';
import { useAuthStore } from '@/store/authStore';
import { profileFormSchema, type ProfileFormInput } from '@/schemas/profile.schema';
import type { UpdateProfileInput, UserProfile } from '@/types/user';
import { generateInitials, cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

const ROLE_LABEL: Record<string, string> = {
  admin: 'Admin',
  student: 'Student',
  examiner: 'Examiner',
  partner: 'Partner',
};

const FIELD_ERROR = 'border-red-400 focus-visible:ring-red-500/30';

const emptyAddress = { houseNoStreet: '', area: '', city: '', district: '', pinCode: '' };

function toFormValues(profile: UserProfile): ProfileFormInput {
  return {
    fullName: profile.fullName ?? '',
    email: profile.email ?? '',
    dob: profile.dob ? profile.dob.slice(0, 10) : '',
    preferredLanguage: profile.preferredLanguage ?? 'en',
    address: profile.address
      ? {
          houseNoStreet: profile.address.houseNoStreet ?? '',
          area: profile.address.area ?? '',
          city: profile.address.city ?? '',
          district: profile.address.district ?? '',
          pinCode: profile.address.pinCode ?? '',
        }
      : { ...emptyAddress },
  };
}

/** Only sends fields that actually changed — the backend forbids
 *  `mobileNumber` here and a full address must be all-or-nothing. */
function buildUpdatePayload(values: ProfileFormInput, original: UserProfile): UpdateProfileInput {
  const payload: UpdateProfileInput = {};

  const fullName = values.fullName.trim();
  if (fullName && fullName !== (original.fullName ?? '')) payload.fullName = fullName;

  const email = values.email.trim();
  if (email && email !== (original.email ?? '')) payload.email = email;

  if (values.dob && values.dob !== (original.dob ? original.dob.slice(0, 10) : '')) {
    payload.dob = values.dob;
  }

  if (values.preferredLanguage !== (original.preferredLanguage ?? 'en')) {
    payload.preferredLanguage = values.preferredLanguage;
  }

  const addr = values.address;
  const trimmed = {
    houseNoStreet: addr.houseNoStreet.trim(),
    area: addr.area.trim(),
    city: addr.city.trim(),
    district: addr.district.trim(),
    pinCode: addr.pinCode.trim(),
  };
  const isFilled = Object.values(trimmed).every((v) => v.length > 0);
  if (isFilled) {
    const orig = original.address;
    const changed =
      !orig ||
      trimmed.houseNoStreet !== orig.houseNoStreet ||
      trimmed.area !== orig.area ||
      trimmed.city !== orig.city ||
      trimmed.district !== orig.district ||
      trimmed.pinCode !== orig.pinCode;
    if (changed) payload.address = trimmed;
  }

  return payload;
}

function formatDate(value?: string): string {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const storeUser = useAuthStore((s) => s.user);
  const setStoreUser = useAuthStore((s) => s.setUser);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: usersApi.getMe,
  });

  const { data: completion } = useQuery({
    queryKey: ['profile-completion'],
    queryFn: usersApi.getProfileCompletion,
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormInput>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      dob: '',
      preferredLanguage: 'en',
      address: { ...emptyAddress },
    },
  });

  useEffect(() => {
    if (profile) reset(toFormValues(profile));
  }, [profile, reset]);

  /** Keeps the sidebar/topbar greeting and role dropdown in sync with edits
   *  made here, without waiting for a full page reload. */
  const syncAuthStore = (updated: UserProfile) => {
    if (!storeUser) return;
    setStoreUser({
      ...storeUser,
      fullName: updated.fullName,
      email: updated.email,
      preferredLanguage: updated.preferredLanguage,
    });
  };

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateProfileInput) => usersApi.updateProfile(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(['profile'], updated);
      queryClient.invalidateQueries({ queryKey: ['profile-completion'] });
      syncAuthStore(updated);
      reset(toFormValues(updated));
      toast.success('Profile updated successfully.');
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Could not update your profile. Please try again.';
      toast.error(message);
    },
  });

  const onSubmit = (values: ProfileFormInput) => {
    if (!profile) return;
    const payload = buildUpdatePayload(values, profile);
    if (Object.keys(payload).length === 0) {
      toast.info('No changes to save.');
      return;
    }
    updateMutation.mutate(payload);
  };

  const handlePhotoPick = () => fileInputRef.current?.click();

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB.');
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const media = await mediaApi.upload(file, '/avatars');
      const updated = await usersApi.updateProfile({ profilePhoto: media.url });
      queryClient.setQueryData(['profile'], updated);
      queryClient.invalidateQueries({ queryKey: ['profile-completion'] });
      syncAuthStore(updated);
      toast.success('Profile photo updated.');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Could not upload photo. Please try again.';
      toast.error(message);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  const initials = generateInitials(profile.fullName || profile.email || profile.mobileNumber || 'User');

  return (
    <div className="w-full space-y-6">
      {/* Cover + avatar */}
      <div className="rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] overflow-hidden shadow-elevated">
        <div className="h-32 sm:h-40 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_45%)]" />
        </div>
        <div className="px-5 sm:px-8 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="relative shrink-0 -mt-14 sm:-mt-16">
              <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full ring-4 ring-[var(--color-surface)] bg-gradient-to-br from-blue-500 to-blue-700 overflow-hidden flex items-center justify-center shadow-[0_16px_32px_-12px_rgba(37,99,235,0.55)]">
                {profile.profilePhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.profilePhoto} alt={profile.fullName || 'Profile photo'} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-white">{initials}</span>
                )}
                {isUploadingPhoto && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handlePhotoPick}
                disabled={isUploadingPhoto}
                aria-label="Change profile photo"
                className="absolute right-0.5 bottom-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-cta)] text-[var(--color-cta-foreground)] shadow-md ring-4 ring-[var(--color-surface)] hover:brightness-105 transition disabled:opacity-60"
              >
                <Camera size={15} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>

            <div className="flex-1 min-w-0 pt-2 sm:pt-3">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-ink-900)] truncate">
                  {profile.fullName || 'Complete your profile'}
                </h1>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  {ROLE_LABEL[profile.role] ?? profile.role}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-[var(--color-muted-foreground)]">
                {profile.mobileNumber && (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone size={13} />
                    +91 {profile.mobileNumber}
                    {profile.isMobileVerified && <BadgeCheck size={13} className="text-[var(--color-data-positive)]" />}
                  </span>
                )}
                {profile.email && (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail size={13} />
                    {profile.email}
                    {profile.isEmailVerified && <BadgeCheck size={13} className="text-[var(--color-data-positive)]" />}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={13} />
                  Joined {formatDate(profile.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {completion && !completion.isComplete && (
            <div className="mt-5 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-subtle)] p-4">
              <div className="flex items-center justify-between text-[12.5px] font-medium text-[var(--color-muted-foreground)] mb-1.5">
                <span>{completion.bannerText}</span>
                <span className="tabular font-bold text-[var(--color-ink-900)]">{completion.completionPercentage}%</span>
              </div>
              <Progress value={completion.completionPercentage} className="h-1.5" />
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal details */}
        <section className="rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] p-5 sm:p-6 shadow-elevated">
          <h2 className="text-[15px] font-bold text-[var(--color-ink-900)] mb-4">Personal Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Your full name"
                error={!!errors.fullName}
                className={errors.fullName ? FIELD_ERROR : undefined}
                {...register('fullName')}
              />
              {errors.fullName && <p className="text-[12px] text-red-600">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className={cn('pl-9', errors.email && FIELD_ERROR)}
                  error={!!errors.email}
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="text-[12px] text-red-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Mobile Number</Label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
                <Input
                  disabled
                  value={profile.mobileNumber ? `+91 ${profile.mobileNumber}` : 'Not linked'}
                  className="pl-9"
                />
              </div>
              <p className="text-[11.5px] text-[var(--color-muted-foreground)]">Mobile number cannot be changed here.</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dob">Date of Birth</Label>
              <div className="relative">
                <CalendarDays size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
                <Input
                  id="dob"
                  type="date"
                  className={cn('pl-9', errors.dob && FIELD_ERROR)}
                  error={!!errors.dob}
                  {...register('dob')}
                />
              </div>
              {errors.dob && <p className="text-[12px] text-red-600">{errors.dob.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Preferred Language</Label>
              <Controller
                control={control}
                name="preferredLanguage"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <Languages size={15} className="mr-1.5 text-[var(--color-muted-foreground)]" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="bn">Bengali</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </section>

        {/* Address */}
        <section className="rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] p-5 sm:p-6 shadow-elevated">
          <h2 className="text-[15px] font-bold text-[var(--color-ink-900)] mb-1 flex items-center gap-2">
            <MapPin size={16} className="text-[var(--color-muted-foreground)]" />
            Address
          </h2>
          <p className="text-[12.5px] text-[var(--color-muted-foreground)] mb-4">
            Fill in every field, or leave the whole section blank.
          </p>
          {errors.address?.message && (
            <p className="text-[12px] text-red-600 mb-3">{errors.address.message}</p>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="houseNoStreet">House No. / Street</Label>
              <Input
                id="houseNoStreet"
                placeholder="e.g. 12/3, MG Road"
                error={!!errors.address?.houseNoStreet}
                {...register('address.houseNoStreet')}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="area">Area</Label>
              <Input id="area" placeholder="e.g. Salt Lake" {...register('address.area')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="e.g. Kolkata" {...register('address.city')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="district">District</Label>
              <Input id="district" placeholder="e.g. North 24 Parganas" {...register('address.district')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pinCode">PIN Code</Label>
              <Input
                id="pinCode"
                inputMode="numeric"
                maxLength={6}
                placeholder="700001"
                error={!!errors.address?.pinCode}
                {...register('address.pinCode')}
              />
              {errors.address?.pinCode && (
                <p className="text-[12px] text-red-600">{errors.address.pinCode.message}</p>
              )}
            </div>
          </div>
        </section>

        {/* Account info (read-only) */}
        <section className="rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] p-5 sm:p-6 shadow-elevated">
          <h2 className="text-[15px] font-bold text-[var(--color-ink-900)] mb-4 flex items-center gap-2">
            <ShieldCheck size={16} className="text-[var(--color-muted-foreground)]" />
            Account
          </h2>
          <div className="grid sm:grid-cols-3 gap-4 text-[13px]">
            <div>
              <p className="text-[var(--color-muted-foreground)] mb-0.5">Account Type</p>
              <p className="font-semibold text-[var(--color-ink-900)]">{ROLE_LABEL[profile.role] ?? profile.role}</p>
            </div>
            <div>
              <p className="text-[var(--color-muted-foreground)] mb-0.5">Signed up via</p>
              <p className="font-semibold text-[var(--color-ink-900)]">{profile.isAppUser ? 'Mobile (App)' : 'Email (Web)'}</p>
            </div>
            <div>
              <p className="text-[var(--color-muted-foreground)] mb-0.5">Last Login</p>
              <p className="font-semibold text-[var(--color-ink-900)]">{formatDate(profile.lastLoginAt)}</p>
            </div>
          </div>
        </section>

        {/* Save bar */}
        <div className="flex justify-end pt-1 pb-2">
          <Button
            type="submit"
            disabled={!isDirty || updateMutation.isPending}
            className="btn-premium gap-2 h-11 px-6 rounded-xl font-bold shadow-lg"
          >
            {updateMutation.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}

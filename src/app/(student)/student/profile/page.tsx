'use client';

import { useEffect, useRef, useState } from 'react';
import { PhotoPreviewDialog } from '@/components/admin/PhotoPreviewDialog';
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
  Smartphone,
  UserRound,
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

const SECTION =
  'rounded-2xl border border-orange-200/60 bg-[var(--color-surface)] p-4 shadow-elevated dark:border-orange-400/20';

function SectionHeader({ icon: Icon, title, subtitle }: { icon: typeof MapPin; title: string; subtitle?: string }) {
  return (
    <div className="mb-3.5 flex items-center gap-2.5 border-b border-orange-200/50 pb-3 dark:border-orange-400/15">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] text-white shadow-md shadow-orange-600/30 ring-1 ring-inset ring-white/25">
        <Icon size={15} />
      </span>
      <div className="min-w-0">
        <h2 className="text-sm font-black leading-tight tracking-tight text-[var(--color-ink-900)]">{title}</h2>
        {subtitle && <p className="text-xs text-[var(--color-muted-foreground)]">{subtitle}</p>}
      </div>
    </div>
  );
}

function InfoPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200/70 bg-orange-50/70 px-2.5 py-0.5 text-xs font-medium text-[var(--color-ink-700)] dark:border-orange-400/25 dark:bg-orange-500/10">
      {children}
    </span>
  );
}

/** Mirrors the loaded page piece for piece while the profile is fetched. */
function ProfileSkeleton() {
  const tone = 'bg-[rgba(244,149,63,0.2)]';
  const field = (wide = false) => (
    <div className={cn('space-y-1.5', wide && 'sm:col-span-2')}>
      <Skeleton className="h-3.5 w-24" />
      <Skeleton className="h-9 w-full rounded-md" />
    </div>
  );
  const header = (
    <div className="mb-3.5 flex items-center gap-2.5 border-b border-orange-200/50 pb-3">
      <Skeleton className={cn('h-8 w-8 rounded-lg', tone)} />
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
    </div>
  );
  return (
    <div className="w-full space-y-4" aria-busy="true" aria-label="Loading your profile">
      {/* Cover + identity */}
      <div className="overflow-hidden rounded-2xl border border-orange-200/60 bg-[var(--color-surface)] shadow-elevated">
        <div className={cn('h-24 sm:h-28', tone)} />
        <div className="px-4 pb-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <Skeleton className="-mt-10 h-20 w-20 shrink-0 rounded-full ring-4 ring-[var(--color-surface)] sm:-mt-12 sm:h-24 sm:w-24" />
            <div className="min-w-0 flex-1 space-y-2 pt-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-44" />
                <Skeleton className={cn('h-5 w-14 rounded-full', tone)} />
              </div>
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-40 rounded-full" />
                <Skeleton className="h-6 w-52 rounded-full" />
                <Skeleton className="h-6 w-36 rounded-full" />
              </div>
            </div>
          </div>
          <div className="mt-3.5 rounded-xl border border-orange-200/60 p-3">
            <div className="mb-2 flex justify-between">
              <Skeleton className="h-3.5 w-56" />
              <Skeleton className="h-3.5 w-10" />
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />
          </div>
        </div>
      </div>

      {/* Personal details */}
      <div className={SECTION}>
        {header}
        <div className="grid gap-3 sm:grid-cols-2">
          {field()}
          {field()}
          {field()}
          {field()}
          {field()}
        </div>
      </div>

      {/* Address */}
      <div className={SECTION}>
        {header}
        <div className="grid gap-3 sm:grid-cols-2">
          {field(true)}
          {field()}
          {field()}
          {field()}
          {field()}
        </div>
      </div>

      {/* Account */}
      <div className={SECTION}>
        {header}
        <div className="grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex items-center gap-2.5 rounded-xl border border-orange-200/60 p-2.5">
              <Skeleton className={cn('h-8 w-8 rounded-lg', tone)} />
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Skeleton className={cn('h-9 w-36 rounded-xl', tone)} />
      </div>
    </div>
  );
}

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
  const [photoPreview, setPhotoPreview] = useState<{ url: string; name: string } | null>(null);

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
    return <ProfileSkeleton />;
  }

  const initials = generateInitials(profile.fullName || profile.email || profile.mobileNumber || 'User');

  return (
    <div className="w-full space-y-4">
      {/* Cover + avatar */}
      <div className="overflow-hidden rounded-2xl border border-orange-200/60 bg-[var(--color-surface)] shadow-elevated dark:border-orange-400/20">
        <div
          className="h-24 sm:h-28 relative"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E"), radial-gradient(520px 260px at 100% 0%, rgba(255,217,168,0.45), transparent 62%), radial-gradient(420px 240px at 0% 100%, rgba(110,35,8,0.4), transparent 65%), linear-gradient(152deg, #f4953f 0%, #e2691f 40%, #c4501a 72%, #97370f 100%)`,
            backgroundBlendMode: 'soft-light, normal, normal, normal',
          }}
        >
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/25 shadow-[0_0_0_46px_rgba(255,255,255,0.04),0_0_0_47px_rgba(255,255,255,0.16)]" />
        </div>
        <div className="px-4 sm:px-6 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
            <div className="relative shrink-0 -mt-10 sm:-mt-12">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full ring-4 ring-[var(--color-surface)] bg-gradient-to-br from-[#f4953f] to-[#c4501a] overflow-hidden flex items-center justify-center shadow-[0_0_0_3px_rgba(226,105,31,0.35),0_18px_36px_-12px_rgba(201,88,23,0.65)]">
                {profile.profilePhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.profilePhoto}
                    alt={profile.fullName || 'Profile photo'}
                    onClick={() => setPhotoPreview({ url: profile.profilePhoto!, name: profile.fullName || 'Profile photo' })}
                    className="h-full w-full cursor-zoom-in object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-white">{initials}</span>
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
                className="absolute right-0 bottom-0 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] text-white shadow-lg shadow-orange-600/40 ring-4 ring-[var(--color-surface)] hover:scale-105 transition disabled:opacity-60"
              >
                <Camera size={12} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>

            <div className="flex-1 min-w-0 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-lg font-black tracking-tight text-[var(--color-ink-900)] sm:text-xl">
                  {profile.fullName || 'Complete your profile'}
                </h1>
                <span className="inline-flex items-center rounded-full bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm shadow-orange-600/30">
                  {ROLE_LABEL[profile.role] ?? profile.role}
                </span>
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                {profile.mobileNumber && (
                  <InfoPill>
                    <Phone size={13} className="text-[#e2691f]" />
                    +91 {profile.mobileNumber}
                    {profile.isMobileVerified && <BadgeCheck size={13} className="text-[var(--color-data-positive)]" />}
                  </InfoPill>
                )}
                {profile.email && (
                  <InfoPill>
                    <Mail size={13} className="text-[#e2691f]" />
                    {profile.email}
                    {profile.isEmailVerified && <BadgeCheck size={13} className="text-[var(--color-data-positive)]" />}
                  </InfoPill>
                )}
                <InfoPill>
                  <Clock size={13} className="text-[#e2691f]" />
                  Joined {formatDate(profile.createdAt)}
                </InfoPill>
              </div>
            </div>
          </div>

          {completion && !completion.isComplete && (
            <div className="mt-3.5 rounded-xl border border-orange-200/70 bg-gradient-to-br from-orange-50/80 to-white p-3 dark:border-orange-400/25 dark:from-orange-500/10 dark:to-transparent">
              <div className="flex items-center justify-between text-[12.5px] font-medium text-[var(--color-muted-foreground)] mb-1.5">
                <span>{completion.bannerText}</span>
                <span className="tabular font-bold text-[var(--color-ink-900)]">{completion.completionPercentage}%</span>
              </div>
              <Progress value={completion.completionPercentage} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-[#f4953f] [&>div]:to-[#c4501a]" />
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Personal details */}
        <section className={SECTION}>
          <SectionHeader icon={UserRound} title="Personal Details" subtitle="Your name, contact and preferences" />
          <div className="grid sm:grid-cols-2 gap-3">
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
        <section className={SECTION}>
          <SectionHeader icon={MapPin} title="Address" subtitle="Fill in every field, or leave the whole section blank." />
          {errors.address?.message && (
            <p className="text-[12px] text-red-600 mb-3">{errors.address.message}</p>
          )}
          <div className="grid sm:grid-cols-2 gap-3">
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
        <section className={SECTION}>
          <SectionHeader icon={ShieldCheck} title="Account" subtitle="Read-only details about your account" />
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, label: 'Account Type', value: ROLE_LABEL[profile.role] ?? profile.role },
              { icon: Smartphone, label: 'Signed up via', value: profile.isAppUser ? 'Mobile (App)' : 'Email (Web)' },
              { icon: Clock, label: 'Last Login', value: formatDate(profile.lastLoginAt) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2.5 rounded-xl border border-orange-200/60 bg-gradient-to-br from-orange-50/60 to-transparent p-2.5 dark:border-orange-400/20 dark:from-orange-500/10">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#e2691f] shadow-sm dark:bg-white/10">
                  <Icon size={17} />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">{label}</p>
                  <p className="truncate text-[13.5px] font-bold text-[var(--color-ink-900)]">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Save bar */}
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-orange-200/60 bg-[var(--color-surface)] px-4 py-2 shadow-elevated dark:border-orange-400/20">
          <p className="text-xs text-[var(--color-muted-foreground)]">
            {isDirty ? 'You have unsaved changes.' : 'All changes saved.'}
          </p>
          <Button
            type="submit"
            disabled={!isDirty || updateMutation.isPending}
            className="btn-premium h-9 gap-2 rounded-xl px-4 border-0 bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] px-5 font-semibold text-white shadow-lg shadow-orange-600/30 ring-1 ring-inset ring-white/25 transition-all hover:-translate-y-px hover:brightness-110 disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none"
          >
            {updateMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
          </Button>
        </div>
      </form>
      <PhotoPreviewDialog photo={photoPreview} onClose={() => setPhotoPreview(null)} />
    </div>
  );
}

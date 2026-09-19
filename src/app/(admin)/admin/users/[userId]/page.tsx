'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CalendarPlus,
  Copy,
  ExternalLink,
  Fingerprint,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Monitor,
  Phone,
  ShieldCheck,
  Smartphone,
  UserCheck,
  UserX,
  UserRound,
} from 'lucide-react';

import { PhotoPreviewDialog } from '@/components/admin/PhotoPreviewDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Skeleton } from '@/components/ui/skeleton';

import { getErrorMessage } from '@/lib/api/errors';
import { usersApi } from '@/lib/api/users';
import { ELEVATED_CARD } from '@/lib/constants';
import {
  describeLocation,
  describeUserAgent,
  formatDate,
  formatDateTime,
  parseDate,
  timeAgo,
} from '@/lib/userFormat';
import { cn, generateInitials } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import type { UserRole } from '@/types/auth';
import type { AdminUserDetail } from '@/types/user';

const ROLE_LABEL: Record<UserRole, string> = {
  admin: 'Admin',
  examiner: 'Examiner',
  partner: 'Partner',
  student: 'Student',
};

const ROLE_BADGE: Record<UserRole, 'default' | 'info' | 'warning' | 'secondary'> = {
  admin: 'default',
  examiner: 'info',
  partner: 'warning',
  student: 'secondary',
};

const LANGUAGE_LABEL = { en: 'English', bn: 'বাংলা (Bengali)' } as const;

function calculateAge(dob?: string): number | null {
  const date = parseDate(dob);
  if (!date) return null;
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const birthdayPassed =
    today.getMonth() > date.getMonth() ||
    (today.getMonth() === date.getMonth() && today.getDate() >= date.getDate());
  if (!birthdayPassed) age -= 1;
  return age;
}

function formatAddressOneLine(address: NonNullable<AdminUserDetail['address']>): string {
  const { houseNoStreet, area, city, district, pinCode } = address;
  return [houseNoStreet, area, city, district, pinCode].filter(Boolean).join(', ') + ', India';
}

/* ------------------------------------------------------------------ */
/*  Small presentational pieces                                        */
/* ------------------------------------------------------------------ */

function AddressPart({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="min-w-0 space-y-0.5">
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
        {label}
      </dt>
      <dd className={cn('truncate text-sm font-medium', mono && 'tabular-nums tracking-wide')} title={value}>
        {value}
      </dd>
    </div>
  );
}

function AddressCard({
  address,
  onCopy,
}: {
  address: NonNullable<AdminUserDetail['address']>;
  onCopy: (value: string, label: string) => void;
}) {
  const fullAddress = formatAddressOneLine(address);

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/30">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-[var(--color-cta)] dark:bg-orange-900/30">
            <MapPin className="h-4.5 w-4.5" />
          </span>
          <p className="min-w-0 text-sm font-semibold leading-snug">{fullAddress}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => onCopy(fullAddress, 'Address')}>
            <Copy className="h-3.5 w-3.5" /> Copy
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View on map
            </a>
          </Button>
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 px-4 py-4 sm:grid-cols-3">
        <div className="col-span-2 sm:col-span-3">
          <AddressPart label="House / Street" value={address.houseNoStreet} />
        </div>
        <AddressPart label="Area / Locality" value={address.area} />
        <AddressPart label="City" value={address.city} />
        <AddressPart label="District" value={address.district} />
        <AddressPart label="PIN code" value={address.pinCode} mono />
        <AddressPart label="Country" value="India" />
      </dl>
    </div>
  );
}

function SectionCard({
  title,
  icon: Icon,
  children,
  className,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn('overflow-hidden', ELEVATED_CARD, className)}>
      <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] bg-[var(--color-muted)]/40 px-5 py-3.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="text-sm font-bold tracking-tight">{title}</h2>
      </div>
      <CardContent className="p-5">{children}</CardContent>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
        {label}
      </dt>
      <dd className="text-sm font-medium break-words">{children}</dd>
    </div>
  );
}

function Muted({ children }: { children: React.ReactNode }) {
  return <span className="font-normal text-[var(--color-muted-foreground)]">{children}</span>;
}

function VerifiedBadge({ verified }: { verified: boolean }) {
  return (
    <Badge variant={verified ? 'success' : 'warning'} className="ml-2 gap-1 align-middle text-[10px]">
      {verified && <BadgeCheck className="h-3 w-3" />}
      {verified ? 'Verified' : 'Unverified'}
    </Badge>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  tone: string;
}) {
  return (
    <Card className={ELEVATED_CARD}>
      <CardContent className="flex items-center gap-4 p-5">
        <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', tone)}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
            {label}
          </p>
          <p className="truncate text-lg font-black leading-tight">{value}</p>
          {sub && <p className="truncate text-xs text-[var(--color-muted-foreground)]">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading user">
      <Skeleton className="h-5 w-32" />
      <Card className={cn('overflow-hidden', ELEVATED_CARD)}>
        <Skeleton className="h-28 w-full rounded-none" />
        <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end">
          <Skeleton className="-mt-14 h-28 w-28 shrink-0 rounded-full border-4 border-[var(--color-card)]" />
          <div className="flex-1 space-y-2 pt-2">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-5 w-40" />
          </div>
          <Skeleton className="h-10 w-64" />
        </div>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className={cn('h-24 rounded-xl', ELEVATED_CARD)} />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className={cn('h-64 rounded-xl', ELEVATED_CARD)} />
          <Skeleton className={cn('h-56 rounded-xl', ELEVATED_CARD)} />
        </div>
        <Skeleton className={cn('h-96 rounded-xl', ELEVATED_CARD)} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const queryClient = useQueryClient();
  const currentUserId = useAuthStore((s) => s.user?.id);

  const [photoPreview, setPhotoPreview] = useState<{ url: string; name: string } | null>(null);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-user', userId],
    queryFn: () => usersApi.getUserDetails(userId),
    enabled: !!userId,
    retry: (failureCount, err) => {
      const status = (err as { response?: { status?: number } })?.response?.status;
      return status !== 404 && failureCount < 1;
    },
  });

  const statusMutation = useMutation({
    mutationFn: (isActive: boolean) => usersApi.updateUserStatus(userId, isActive),
    onSuccess: (_user, isActive) => {
      queryClient.invalidateQueries({ queryKey: ['admin-user', userId] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(isActive ? 'User activated successfully' : 'User deactivated successfully');
      setConfirmDeactivate(false);
    },
    onError: (err: unknown) => toast.error(getErrorMessage(err, 'Could not update user status')),
  });

  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error(`Could not copy ${label.toLowerCase()}`);
    }
  };

  const backLink = (
    <Link
      href="/admin/users"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-cta)]"
    >
      <ArrowLeft className="h-4 w-4" /> Back to users
    </Link>
  );

  if (isLoading) return <DetailSkeleton />;

  if (isError || !data) {
    const notFound = (error as { response?: { status?: number } })?.response?.status === 404;
    return (
      <div className="space-y-6">
        {backLink}
        <Card className={ELEVATED_CARD}>
          {notFound ? (
            <EmptyState
              icon={UserRound}
              title="User not found"
              description="This account doesn't exist or may have been removed."
              className="py-20"
            />
          ) : (
            <ErrorState message="Could not load this user." onRetry={() => refetch()} className="py-20" />
          )}
        </Card>
      </div>
    );
  }

  const { user, recentLogins } = data;
  const displayName = user.fullName || user.email || user.mobileNumber || 'Unnamed user';
  const isActive = user.isActive !== false;
  const isSelf = user._id === currentUserId;
  const age = calculateAge(user.dob);
  const lastLogin = recentLogins[0]?.createdAt ?? user.lastLoginAt;

  return (
    <div className="space-y-6">
      {backLink}

      {/* ── Hero ─────────────────────────────────────────────── */}
      <Card className={cn('overflow-hidden', ELEVATED_CARD)}>
        <div className="relative h-28 bg-gradient-to-r from-[#0052FF] via-[#3B82F6] to-[#FF700B] sm:h-32">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,white_0,transparent_45%),radial-gradient(circle_at_85%_80%,white_0,transparent_40%)]"
          />
        </div>

        <div className="flex flex-col gap-5 px-6 pb-6 sm:flex-row sm:items-end sm:gap-6">
          {user.profilePhoto ? (
            <button
              type="button"
              onClick={() => setPhotoPreview({ url: user.profilePhoto!, name: displayName })}
              aria-label={`View ${displayName}'s photo`}
              className="-mt-14 shrink-0 self-start rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cta)] sm:-mt-16"
            >
              <Avatar className="h-28 w-28 cursor-zoom-in border-4 border-[var(--color-card)] shadow-xl sm:h-32 sm:w-32">
                <AvatarImage src={user.profilePhoto} alt={displayName} className="object-cover" />
                <AvatarFallback className="text-3xl">{generateInitials(displayName)}</AvatarFallback>
              </Avatar>
            </button>
          ) : (
            <Avatar className="-mt-14 h-28 w-28 shrink-0 self-start border-4 border-[var(--color-card)] shadow-xl sm:-mt-16 sm:h-32 sm:w-32">
              <AvatarFallback className="text-3xl">{generateInitials(displayName)}</AvatarFallback>
            </Avatar>
          )}

          <div className="min-w-0 flex-1 space-y-2.5">
            <div>
              <h1 className="truncate text-2xl font-black tracking-tight sm:text-3xl">
                {displayName}
                {isSelf && (
                  <span className="ml-2 align-middle text-sm font-medium text-[var(--color-muted-foreground)]">(you)</span>
                )}
              </h1>
              <p className="truncate text-sm text-[var(--color-muted-foreground)]">
                {user.email || (user.mobileNumber ? `+91 ${user.mobileNumber}` : 'No contact details')}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {user.role && (
                <Badge variant={ROLE_BADGE[user.role]} className="text-[10px]">
                  {ROLE_LABEL[user.role]}
                </Badge>
              )}
              <Badge variant={isActive ? 'success' : 'destructive'} className="text-[10px]">
                {isActive ? 'ACTIVE' : 'INACTIVE'}
              </Badge>
              <Badge variant={user.isAppUser ? 'info' : 'secondary'} className="gap-1 text-[10px]">
                {user.isAppUser ? <Smartphone className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                {user.isAppUser ? 'App signup' : 'Web signup'}
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {user.email && (
              <Button asChild variant="outline" className="gap-2">
                <a href={`mailto:${user.email}`}>
                  <Mail className="h-4 w-4" /> Email
                </a>
              </Button>
            )}
            {user.mobileNumber && (
              <Button asChild variant="outline" className="gap-2">
                <a href={`tel:+91${user.mobileNumber}`}>
                  <Phone className="h-4 w-4" /> Call
                </a>
              </Button>
            )}
            <Button
              variant={isActive ? 'destructive' : 'cta'}
              className="gap-2"
              disabled={isSelf || statusMutation.isPending}
              title={isSelf ? 'You cannot change your own status' : undefined}
              onClick={() => (isActive ? setConfirmDeactivate(true) : statusMutation.mutate(true))}
            >
              {statusMutation.isPending && !confirmDeactivate ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isActive ? (
                <UserX className="h-4 w-4" />
              ) : (
                <UserCheck className="h-4 w-4" />
              )}
              {isActive ? 'Deactivate' : 'Activate'}
            </Button>
          </div>
        </div>
      </Card>

      {/* ── Stat tiles ───────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          icon={CalendarPlus}
          label="Member since"
          value={formatDate(user.createdAt)}
          sub={timeAgo(user.createdAt)}
          tone="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <StatTile
          icon={CalendarClock}
          label="Last active"
          value={timeAgo(lastLogin)}
          sub={lastLogin ? formatDateTime(lastLogin) : 'No logins yet'}
          tone="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
        />
        <StatTile
          icon={ShieldCheck}
          label="Verification"
          value={`${Number(user.isMobileVerified) + Number(user.isEmailVerified)} of 2`}
          sub={`${user.isMobileVerified ? 'Phone ✓' : 'Phone ✗'} · ${user.isEmailVerified ? 'Email ✓' : 'Email ✗'}`}
          tone="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
        />
        <StatTile
          icon={user.isAppUser ? Smartphone : Globe}
          label="Signed up via"
          value={user.isAppUser ? 'Mobile app' : 'Website'}
          sub={user.preferredLanguage ? LANGUAGE_LABEL[user.preferredLanguage] : undefined}
          tone="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* ── Personal information ─────────────────────────── */}
          <SectionCard title="Personal information" icon={UserRound}>
            <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
              <Field label="Full name">{user.fullName || <Muted>Not provided</Muted>}</Field>
              <Field label="Date of birth">
                {user.dob ? (
                  <>
                    {formatDate(user.dob)}
                    {age !== null && <Muted> · {age} years</Muted>}
                  </>
                ) : (
                  <Muted>Not provided</Muted>
                )}
              </Field>
              <Field label="Preferred language">
                {user.preferredLanguage ? LANGUAGE_LABEL[user.preferredLanguage] : <Muted>Not set</Muted>}
              </Field>
              <Field label="Referral code">
                {user.referralCode ? (
                  <span className="font-mono">{user.referralCode}</span>
                ) : (
                  <Muted>None</Muted>
                )}
              </Field>
              <div className="sm:col-span-2">
                <Field label="Address">
                  {user.address ? (
                    <div className="pt-1.5">
                      <AddressCard address={user.address} onCopy={copy} />
                    </div>
                  ) : (
                    <Muted>Not provided</Muted>
                  )}
                </Field>
              </div>
            </dl>
          </SectionCard>

          {/* ── Contact & account ────────────────────────────── */}
          <SectionCard title="Contact & account" icon={Fingerprint}>
            <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
              <Field label="Email">
                {user.email ? (
                  <>
                    <a href={`mailto:${user.email}`} className="hover:text-[var(--color-cta)] hover:underline">
                      {user.email}
                    </a>
                    <VerifiedBadge verified={user.isEmailVerified} />
                  </>
                ) : (
                  <Muted>Not provided</Muted>
                )}
              </Field>
              <Field label="Phone">
                {user.mobileNumber ? (
                  <>
                    <a
                      href={`tel:+91${user.mobileNumber}`}
                      className="tabular-nums hover:text-[var(--color-cta)] hover:underline"
                    >
                      +91 {user.mobileNumber}
                    </a>
                    <VerifiedBadge verified={user.isMobileVerified} />
                  </>
                ) : (
                  <Muted>Not provided</Muted>
                )}
              </Field>
              <Field label="Last updated">{formatDateTime(user.updatedAt)}</Field>
              <Field label="User ID">
                <button
                  type="button"
                  onClick={() => copy(user._id, 'User ID')}
                  className="group inline-flex max-w-full items-center gap-1.5 font-mono text-xs text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-cta)]"
                  title="Copy user ID"
                >
                  <span className="truncate">{user._id}</span>
                  <Copy className="h-3 w-3 shrink-0 opacity-60 group-hover:opacity-100" />
                </button>
              </Field>
            </dl>
          </SectionCard>
        </div>

        {/* ── Login activity ─────────────────────────────────── */}
        <SectionCard title="Recent login activity" icon={Monitor}>
          {recentLogins.length === 0 ? (
            <EmptyState
              icon={Monitor}
              title="No login activity"
              description="Sign-ins will show up here."
              className="py-10"
            />
          ) : (
            <ol className="relative space-y-5 border-l border-[var(--color-border)] pl-6">
              {recentLogins.map((login, index) => (
                <li key={login._id} className="relative">
                  <span
                    className={cn(
                      'absolute -left-[31px] top-1 flex h-3 w-3 rounded-full ring-4 ring-[var(--color-card)]',
                      login.status === 'failed'
                        ? 'bg-red-500'
                        : index === 0
                          ? 'bg-[var(--color-cta)]'
                          : 'bg-[var(--color-border)]'
                    )}
                  />
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{describeUserAgent(login.userAgent)}</p>
                      <p className="truncate text-xs text-[var(--color-muted-foreground)]">
                        {describeLocation(login)}
                      </p>
                      <p className="font-mono text-[11px] text-[var(--color-muted-foreground)]">{login.ipInfo.ip}</p>
                      {login.status === 'failed' && login.failureReason && (
                        <p className="text-[11px] font-medium text-red-500">{login.failureReason}</p>
                      )}
                    </div>
                    <Badge
                      variant={login.status === 'failed' ? 'destructive' : 'secondary'}
                      className="shrink-0 text-[10px]"
                    >
                      {login.status === 'failed' ? 'Failed' : login.loginMethod === 'otp' ? 'OTP' : 'Mobile'}
                    </Badge>
                  </div>
                  <p className="mt-1 text-[11px] text-[var(--color-muted-foreground)]" title={formatDateTime(login.createdAt)}>
                    {timeAgo(login.createdAt)} · {formatDateTime(login.createdAt)}
                  </p>
                </li>
              ))}
            </ol>
          )}
          <Button asChild variant="cta" className="mt-6 w-full gap-2">
            <Link href={`/admin/users/${user._id}/logins`}>
              View all logins <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </SectionCard>
      </div>

      <PhotoPreviewDialog photo={photoPreview} onClose={() => setPhotoPreview(null)} />

      <Dialog open={confirmDeactivate} onOpenChange={setConfirmDeactivate}>
        <DialogContent className="sm:max-w-105">
          <DialogHeader>
            <DialogTitle>Deactivate User</DialogTitle>
            <DialogDescription>
              <strong>{displayName}</strong> will be signed out and unable to log in until reactivated.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setConfirmDeactivate(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={statusMutation.isPending}
              className="gap-2"
              onClick={() => statusMutation.mutate(false)}
            >
              {statusMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

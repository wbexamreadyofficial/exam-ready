'use client';

import { useRef } from 'react';
import { Camera, CheckCircle2, Clock, Loader2, Mail, Phone, ShieldCheck, Smartphone, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/PageHeader';
import { useAuth } from '@/hooks/useAuth';
import { useAdminT } from '@/lib/admin/i18n';
import { useAdminProfile } from '@/hooks/useAdminProfile';
import { UserAvatar } from '@/components/admin/UserAvatar';

const dateTime = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

function Row({ icon: Icon, label, children }: { icon: typeof Mail; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 border-b border-[var(--color-hairline)] py-3.5 last:border-0">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-[#e2691f] dark:bg-orange-500/15">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">{label}</p>
        <div className="truncate text-sm font-medium">{children}</div>
      </div>
    </div>
  );
}

export default function AdminProfilePage() {
  const { t } = useAdminT();
  const { user } = useAuth();
  const { photoUrl, uploading, uploadPhoto, removePhoto } = useAdminProfile();
  const fileInput = useRef<HTMLInputElement>(null);
  const name = user?.fullName || 'Admin';

  return (
    <div className="space-y-6">
      <PageHeader title={t.profile} description="Your account details" />

      <Card className="overflow-hidden">
        <div className="h-28 bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a]" />
        <CardContent className="px-6 pb-6">
          <div className="-mt-12 flex items-start gap-4">
            <div className="group relative shrink-0">
              <UserAvatar
                name={name}
                src={photoUrl}
                className="h-24 w-24 border-4 border-[var(--color-card)] shadow-lg shadow-orange-600/30"
                fallbackClassName="text-3xl"
              />
              {uploading && (
                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 text-white">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </span>
              )}
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                disabled={uploading}
                aria-label="Change profile photo"
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--color-card)] bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] text-white shadow-md transition-transform hover:scale-110 disabled:opacity-60"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = '';
                  if (file) void uploadPhoto(file);
                }}
              />
            </div>
            <div className="pt-16">
              <h2 className="text-lg font-black leading-tight">{name}</h2>
              <p className="text-sm capitalize text-[var(--color-muted-foreground)]">{user?.role}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-orange-300/70 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-[#b9450d] transition-colors hover:bg-orange-100 disabled:opacity-60 dark:border-orange-400/30 dark:bg-orange-500/10 dark:text-orange-300"
                >
                  <Camera className="h-3.5 w-3.5" />
                  {photoUrl ? 'Change photo' : 'Upload photo'}
                </button>
                {photoUrl && (
                  <button
                    type="button"
                    onClick={() => void removePhoto()}
                    disabled={uploading}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-hairline)] px-3 py-1.5 text-xs font-semibold text-[var(--color-muted-foreground)] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-x-10 md:grid-cols-2">
            <Row icon={Phone} label="Mobile">
              {user?.mobileNumber ? `+91 ${user.mobileNumber}` : '—'}
              {user?.isMobileVerified && <CheckCircle2 className="ml-1.5 inline h-3.5 w-3.5 text-green-600" />}
            </Row>
            <Row icon={Mail} label="Email">{user?.email || '—'}</Row>
            <Row icon={ShieldCheck} label="Role"><span className="capitalize">{user?.role}</span></Row>
            <Row icon={Smartphone} label="Signed up from">{user?.isAppUser ? 'Mobile app' : 'Web'}</Row>
            <Row icon={Clock} label="Last login">
              {user?.lastLoginAt ? dateTime.format(new Date(user.lastLoginAt)) : '—'}
            </Row>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

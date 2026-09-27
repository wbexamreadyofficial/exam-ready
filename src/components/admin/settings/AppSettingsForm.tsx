'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Save, Settings, Shield, Timer, Image as ImageIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { env } from '@/config/env';
import { settingsApi } from '@/lib/api/settings';
import { getErrorMessage } from '@/lib/api/errors';
import type { AppSettings, UpdateAppSettingsInput } from '@/types/settings';

const QUERY_KEY = ['admin-app-settings'];

function toForm(settings: AppSettings): UpdateAppSettingsInput {
  return {
    siteName: settings.siteName,
    tagline: settings.tagline,
    supportEmail: settings.supportEmail,
    supportPhone: settings.supportPhone,
    maintenanceMode: settings.maintenanceMode,
    maintenanceMessage: settings.maintenanceMessage,
    registrationEnabled: settings.registrationEnabled,
    otpLength: settings.otpLength,
    otpExpiryMinutes: settings.otpExpiryMinutes,
    rateLimits: settings.rateLimits,
    featureFlags: settings.featureFlags,
  };
}

/** Fetches the settings, then hands off to the form once data is in — mirrors `SiteContentEditor`. */
export function AppSettingsForm() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => settingsApi.get(),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorState message="Could not load settings." onRetry={() => refetch()} className="py-16" />;
  }

  return <SettingsForm settings={data} />;
}

function SettingsForm({ settings }: { settings: AppSettings }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<UpdateAppSettingsInput>(() => toForm(settings));
  const [updatedAt, setUpdatedAt] = useState(settings.updatedAt);
  const [isDirty, setIsDirty] = useState(false);

  const updateMutation = useMutation({
    mutationFn: (input: UpdateAppSettingsInput) => settingsApi.update(input),
    onSuccess: (next) => {
      queryClient.setQueryData(QUERY_KEY, next);
      setForm(toForm(next));
      setUpdatedAt(next.updatedAt);
      setIsDirty(false);
      toast.success('Settings updated');
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error, 'Could not update settings')),
  });

  const patch = (next: Partial<UpdateAppSettingsInput>) => {
    setForm((current) => ({ ...current, ...next }));
    setIsDirty(true);
  };

  const setFlag = (key: string, value: boolean) => {
    patch({ featureFlags: { ...form.featureFlags, [key]: value } });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.siteName.trim()) {
      toast.error('Platform name is required');
      return;
    }
    updateMutation.mutate({
      ...form,
      siteName: form.siteName.trim(),
      tagline: form.tagline.trim(),
      supportEmail: form.supportEmail.trim(),
      supportPhone: form.supportPhone.trim(),
      maintenanceMessage: form.maintenanceMessage.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-[var(--color-border)] bg-gradient-to-r from-orange-50/80 via-white to-transparent dark:from-orange-500/10 dark:via-transparent">
          <CardTitle className="flex items-center gap-3 text-lg">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] text-white shadow-md shadow-orange-600/30 ring-1 ring-inset ring-white/25">
              <Settings className="h-5 w-5" />
            </span>
            General Branding & Site Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="set-appname">
                Platform Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="set-appname"
                value={form.siteName}
                onChange={(event) => patch({ siteName: event.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="set-tagline">Tagline</Label>
              <Input
                id="set-tagline"
                value={form.tagline}
                onChange={(event) => patch({ tagline: event.target.value })}
                placeholder="Prepare. Practice. Perform."
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="set-support-email">Support email</Label>
              <Input
                id="set-support-email"
                type="email"
                value={form.supportEmail}
                onChange={(event) => patch({ supportEmail: event.target.value })}
                placeholder="support@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="set-support-phone">Support phone</Label>
              <Input
                id="set-support-phone"
                value={form.supportPhone}
                onChange={(event) => patch({ supportPhone: event.target.value })}
                placeholder="+91 90000 00000"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="set-api">Backend Express API URL</Label>
            <Input id="set-api" value={env.apiUrl} readOnly disabled className="font-mono text-xs" />
            <p className="text-xs text-[var(--color-muted-foreground)]">
              Set via <code>NEXT_PUBLIC_API_URL</code> at build time — not stored server-side.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="border-b border-[var(--color-border)] bg-gradient-to-r from-orange-50/80 via-white to-transparent dark:from-orange-500/10 dark:via-transparent">
          <CardTitle className="flex items-center gap-3 text-lg">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] text-white shadow-md shadow-orange-600/30 ring-1 ring-inset ring-white/25">
              <Shield className="h-5 w-5" />
            </span>
            Security & Examination Safeguards
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-5">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-[var(--color-border)] p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Timer className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-sm font-semibold">Server-Authoritative Exam Timer Validation</p>
                <p className="text-xs text-[var(--color-muted-foreground)]">
                  Strictly reject client submissions received after backend timeout.
                </p>
              </div>
            </div>
            <Switch
              checked={form.featureFlags.examTimerServerValidation ?? true}
              onCheckedChange={(checked) => setFlag('examTimerServerValidation', checked)}
            />
          </div>
          <div className="flex items-center justify-between gap-4 rounded-xl border border-[var(--color-border)] p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <ImageIcon className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-sm font-semibold">ImageKit File Uploads</p>
                <p className="text-xs text-[var(--color-muted-foreground)]">
                  Route media uploads through ImageKit via the Express backend API.
                </p>
              </div>
            </div>
            <Switch
              checked={form.featureFlags.imageKitUploads ?? true}
              onCheckedChange={(checked) => setFlag('imageKitUploads', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm">
        {updatedAt ? (
          <p className="text-xs text-[var(--color-muted-foreground)]">
            Last updated {new Date(updatedAt).toLocaleString('en-IN')}
          </p>
        ) : (
          <p className="text-xs text-[var(--color-muted-foreground)]">Not saved yet</p>
        )}
        <Button type="submit" variant="cta" className="gap-2 font-bold" disabled={updateMutation.isPending || !isDirty}>
          {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save System Configuration
        </Button>
      </div>
    </form>
  );
}

'use client';

import { Radio } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/badge';
import { SystemTelemetry } from '@/components/admin/SystemTelemetry';
import { AppSettingsForm } from '@/components/admin/settings/AppSettingsForm';

export default function SettingsAdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="System Settings"
        description="Global configuration, backend API integration & feature flags"
        actions={
          <Badge variant="success" className="gap-1.5 px-3 py-1 text-xs font-bold">
            <Radio className="h-3 w-3" /> Live monitoring
          </Badge>
        }
      />

      <SystemTelemetry />

      <AppSettingsForm />
    </div>
  );
}

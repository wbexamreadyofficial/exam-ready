'use client';

import { Save, Settings, Shield, Bell, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PageHeader } from '@/components/layout/PageHeader';

export default function SettingsAdminPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="System Settings" description="Global configuration, backend API integration & feature flags" />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5 text-[var(--color-primary)]" />
            General Branding & Site Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="set-appname">Platform Name</Label>
              <Input id="set-appname" defaultValue="WB Exam Ready" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="set-tagline">Tagline</Label>
              <Input id="set-tagline" defaultValue="Prepare. Practice. Perform." />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="set-api">Backend Express API URL</Label>
            <Input id="set-api" defaultValue="http://localhost:5000/api" className="font-mono text-xs" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-[var(--color-primary)]" />
            Security & Examination Safeguards
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-semibold text-sm">Server-Authoritative Exam Timer Validation</p>
              <p className="text-xs text-[var(--color-muted-foreground)]">Strictly reject client submissions received after backend timeout.</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between py-2 border-t border-[var(--color-border)]">
            <div>
              <p className="font-semibold text-sm">AWS Presigned URL File Uploads</p>
              <p className="text-xs text-[var(--color-muted-foreground)]">Generate secure, time-bound presigned URLs via Express backend API.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Button className="font-bold gap-2">
        <Save className="h-4 w-4" /> Save System Configuration
      </Button>
    </div>
  );
}

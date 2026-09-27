'use client';

import { Globe, Server } from 'lucide-react';

import { PageHeader } from '@/components/layout/PageHeader';
import { DeploymentPanel } from '@/components/admin/deployments/DeploymentPanel';

export default function DeploymentsAdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Deployments"
        description="Recent Vercel deployments and live build logs for both the frontend and backend."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <DeploymentPanel project="frontend" label="Frontend (exam-ready)" icon={Globe} />
        <DeploymentPanel project="backend" label="Backend (exam-ready-node)" icon={Server} />
      </div>
    </div>
  );
}

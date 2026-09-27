'use client';

import { Globe, Server } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/layout/PageHeader';
import { DeploymentPanel } from '@/components/admin/deployments/DeploymentPanel';

export default function DeploymentsAdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Deployments"
        description="Recent Vercel deployments and live build logs for both the frontend and backend."
      />

      <Tabs defaultValue="frontend">
        <TabsList>
          <TabsTrigger value="frontend">Frontend</TabsTrigger>
          <TabsTrigger value="backend">Backend</TabsTrigger>
        </TabsList>
        <TabsContent value="frontend">
          <DeploymentPanel project="frontend" label="Frontend (exam-ready)" icon={Globe} />
        </TabsContent>
        <TabsContent value="backend">
          <DeploymentPanel project="backend" label="Backend (exam-ready-node)" icon={Server} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

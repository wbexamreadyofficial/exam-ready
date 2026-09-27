'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SiteContentEditor } from '@/components/admin/content/SiteContentEditor';

export default function LegalPagesAdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Help, Terms & Privacy"
        description="Edit the Help & Support, Terms and Privacy pages shown in the app and on the site."
      />

      <Tabs defaultValue="help_support">
        <TabsList>
          <TabsTrigger value="help_support">Help & Support</TabsTrigger>
          <TabsTrigger value="terms">Terms</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>
        <TabsContent value="help_support">
          <SiteContentEditor type="help_support" />
        </TabsContent>
        <TabsContent value="terms">
          <SiteContentEditor type="terms" />
        </TabsContent>
        <TabsContent value="privacy">
          <SiteContentEditor type="privacy" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

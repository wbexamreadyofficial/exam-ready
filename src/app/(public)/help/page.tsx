import type { Metadata } from 'next';
import { SiteContentPage } from '@/components/public/SiteContentPage';

export const metadata: Metadata = {
  title: 'Help & Support — Exam Ready',
  description: 'Get help and support for using the Exam Ready platform.',
};

export default function HelpPage() {
  return <SiteContentPage type="help_support" fallbackTitle="Help & Support" eyebrow="We're Here to Help" />;
}

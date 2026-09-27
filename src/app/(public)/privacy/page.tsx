import type { Metadata } from 'next';
import { SiteContentPage } from '@/components/public/SiteContentPage';

export const metadata: Metadata = {
  title: 'Privacy Policy — Exam Ready',
  description: 'Learn how Exam Ready collects, uses, and protects your data.',
};

export default function PrivacyPage() {
  return <SiteContentPage type="privacy" fallbackTitle="Privacy Policy" eyebrow="Your Data, Protected" />;
}

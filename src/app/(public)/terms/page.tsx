import type { Metadata } from 'next';
import { SiteContentPage } from '@/components/public/SiteContentPage';

export const metadata: Metadata = {
  title: 'Terms & Conditions — Exam Ready',
  description: 'Read the terms and conditions for using the Exam Ready platform.',
};

export default function TermsPage() {
  return <SiteContentPage type="terms" fallbackTitle="Terms & Conditions" eyebrow="Legal" />;
}

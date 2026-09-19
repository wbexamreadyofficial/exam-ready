'use client';

import { ComingSoon } from '@/components/admin/ComingSoon';
import { useAdminT } from '@/lib/admin/i18n';

export default function Page() {
  const { t } = useAdminT();
  return <ComingSoon title={t.nav.exams} note="List, create, edit and archive exams and their default pattern. Built next." />;
}

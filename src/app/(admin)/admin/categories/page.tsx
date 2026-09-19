'use client';

import { ComingSoon } from '@/components/admin/ComingSoon';
import { useAdminT } from '@/lib/admin/i18n';

export default function Page() {
  const { t } = useAdminT();
  return <ComingSoon title={t.nav.categories} note="List, create, edit and deactivate the exam categories. Built next." />;
}

'use client';

import { ComingSoon } from '@/components/admin/ComingSoon';
import { useAdminT } from '@/lib/admin/i18n';

export default function Page() {
  const { t } = useAdminT();
  return <ComingSoon title={t.nav.subjects} note="List, create, edit and deactivate subjects and their chapters. Built next." />;
}

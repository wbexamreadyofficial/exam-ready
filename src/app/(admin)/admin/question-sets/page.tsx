'use client';

import { ComingSoon } from '@/components/admin/ComingSoon';
import { useAdminT } from '@/lib/admin/i18n';

export default function Page() {
  const { t } = useAdminT();
  return <ComingSoon title={t.nav.questionSets} note="Every question set, with its config, question order and publish state. Built next." />;
}

import type { AdminCopy } from './i18n';

export interface AdminNavItem {
  /** Key into `copy.nav` — resolved at render time so the label follows the language toggle. */
  labelKey: keyof AdminCopy['nav'];
  href: string;
  icon: string;
  /** Marks the primary action in its group, styled to stand out in the sidebar. */
  highlight?: boolean;
}

export interface AdminNavGroup {
  titleKey: keyof AdminCopy['nav'];
  items: AdminNavItem[];
}

/**
 * Sidebar structure. Every list section here gets its own `/admin/<x>` list
 * route plus `/new` and `/[id]` routes for create and update — see the route
 * files under `src/app/(admin)/admin/`.
 */
export const adminNavGroups: AdminNavGroup[] = [
  {
    titleKey: 'overview',
    items: [
      { labelKey: 'dashboard', href: '/admin', icon: 'LayoutDashboard' },
      { labelKey: 'users', href: '/admin/users', icon: 'Users' },
    ],
  },
  {
    titleKey: 'uploads',
    items: [
      { labelKey: 'uploadPdf', href: '/admin/uploads/new', icon: 'FileUp', highlight: true },
      { labelKey: 'uploadHistory', href: '/admin/uploads', icon: 'History' },
      { labelKey: 'uploadGuide', href: '/admin/upload-guide', icon: 'BookOpen' },
    ],
  },
  {
    titleKey: 'content',
    items: [
      { labelKey: 'categories', href: '/admin/categories', icon: 'LayoutGrid' },
      { labelKey: 'subjects', href: '/admin/subjects', icon: 'Library' },
      { labelKey: 'exams', href: '/admin/exams', icon: 'FileText' },
      { labelKey: 'questionSets', href: '/admin/question-sets', icon: 'ListChecks' },
      { labelKey: 'questions', href: '/admin/questions', icon: 'HelpCircle' },
    ],
  },
  {
    titleKey: 'system',
    items: [
      { labelKey: 'notifications', href: '/admin/notifications', icon: 'Bell' },
    ],
  },
];

const ALL_HREFS = adminNavGroups.flatMap((g) => g.items.map((i) => i.href));

/**
 * Resolves the ONE nav href that should appear active for a pathname.
 *
 * Plain prefix matching is not enough here: `/admin/uploads/new` is a prefix
 * match for both "Upload Question PDF" (`/admin/uploads/new`) and "Upload
 * History" (`/admin/uploads`), which would light up two rows. So every
 * candidate prefix is collected and the longest one wins. `/admin` is exact-
 * match only, otherwise it would match every route in the panel.
 */
export function activeNavHref(pathname: string): string | null {
  let best: string | null = null;

  for (const href of ALL_HREFS) {
    const matches =
      href === '/admin'
        ? pathname === '/admin'
        : pathname === href || pathname.startsWith(`${href}/`);

    if (matches && (best === null || href.length > best.length)) best = href;
  }

  return best;
}

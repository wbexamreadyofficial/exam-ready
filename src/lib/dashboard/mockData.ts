// ═══════════════════════════════════════════════
// Static pieces of the student dashboard shell. Everything analytical
// now comes from GET /api/student/dashboard (see lib/api/studentDashboard.ts).
// ═══════════════════════════════════════════════

/* ── Plan Usage ── */
export const planData = {
  name: 'Free Plan',
  testsUsed: 12,
  testsTotal: 30,
  daysLeft: 18,
};

/* ── Sidebar Navigation ── */
export interface NavItem {
  label: string;
  icon: string;
  href: string;
  active?: boolean;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const sidebarNavGroups: NavGroup[] = [
  {
    title: '',
    items: [
      { label: 'Dashboard', icon: 'LayoutDashboard', href: '/student/dashboard', active: true },
    ],
  },
  {
    title: 'Practice',
    items: [
      { label: 'Exam Categories', icon: 'LayoutGrid', href: '/student/exam-categories' },
      { label: 'Mock Tests', icon: 'FileText', href: '/student/mock-tests' },
      { label: 'My Results', icon: 'BarChart3', href: '/student/results' },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Notifications', icon: 'Bell', href: '/student/notifications' },
      { label: 'Profile', icon: 'User', href: '/student/profile' },
    ],
  },
];

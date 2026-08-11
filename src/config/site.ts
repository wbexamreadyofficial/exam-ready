export const siteConfig = {
  name: 'Exam Ready',
  tagline: 'Prepare. Practice. Perform.',
  description:
    'Premier competitive exam preparation platform. Practice with real exam patterns for WB Constable, WB SI, WB Food Inspector, WB Health, PSC Clerkship, PSC Miscellaneous, and Primary Teacher TET.',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://examready.in',
  ogImage: '/og-image.png',
  links: {
    github: 'https://github.com/examready',
  },
  nav: [
    { title: 'Home', href: '/' },
    { title: 'Exams', href: '/exams' },
    { title: 'Quizzes', href: '/quizzes' },
    { title: 'Pass Pro ⚡', href: '/subscriptions' },
    { title: 'About', href: '/about' },
    { title: 'Contact', href: '/contact' },
  ],
  adminNav: [
    { title: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
    { title: 'Users', href: '/admin/users', icon: 'Users' },
    { title: 'Exams', href: '/admin/exams', icon: 'FileText' },
    { title: 'Questions', href: '/admin/questions', icon: 'HelpCircle' },
    { title: 'Subjects', href: '/admin/subjects', icon: 'BookOpen' },
    { title: 'Results', href: '/admin/results', icon: 'BarChart3' },
    { title: 'Payments', href: '/admin/payments', icon: 'CreditCard' },
    { title: 'Analytics', href: '/admin/analytics', icon: 'TrendingUp' },
    { title: 'Content', href: '/admin/content', icon: 'FolderOpen' },
    { title: 'Settings', href: '/admin/settings', icon: 'Settings' },
  ],
};

export type SiteConfig = typeof siteConfig;

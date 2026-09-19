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
    { title: 'Mock Tests', href: '/exams' },
    { title: 'Courses', href: '/quizzes' },
    { title: 'Study Materials', href: '/about' },
    { title: 'Results', href: '/leaderboard' },
    { title: 'Pricing', href: '/subscriptions' },
    { title: 'Blog', href: '/contact' },
    { title: 'Contact', href: '/contact' },
  ],
};

export type SiteConfig = typeof siteConfig;

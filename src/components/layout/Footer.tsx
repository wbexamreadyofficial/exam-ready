import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

const quickLinks = [
  { title: 'Mock Tests', href: '/exams' },
  { title: 'Courses', href: '/quizzes' },
  { title: 'Study Materials', href: '/about' },
  { title: 'Results', href: '/leaderboard' },
  { title: 'Pricing', href: '/subscriptions' },
];

const examLinks = [
  { title: 'WB Constable', href: '/exams/wb-constable' },
  { title: 'WB SI', href: '/exams/wb-si' },
  { title: 'Food SI', href: '/exams/food-si' },
  { title: 'PSC Clerkship', href: '/exams/psc-clerkship' },
  { title: 'State PSC Exams', href: '/exams/others' },
];

const supportLinks = [
  { title: 'Help Center', href: '/contact' },
  { title: 'Contact Us', href: '/contact' },
  { title: 'Privacy Policy', href: '/about' },
  { title: 'Terms & Conditions', href: '/about' },
  { title: 'Refund Policy', href: '/about' },
];

const socialLinks = [
  { name: 'Facebook', icon: 'f', href: '#' },
  { name: 'Twitter', icon: '𝕏', href: '#' },
  { name: 'Instagram', icon: 'ig', href: '#' },
  { name: 'YouTube', icon: '▶', href: '#' },
  { name: 'Telegram', icon: '✈', href: '#' },
];

export function Footer() {
  return (
    <footer className="bg-[#F4F7FB] dark:bg-slate-950 text-ink-700 dark:text-slate-300 border-t hairline dark:border-slate-800">
      <div className="container section-y">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <div className="mb-5">
              <Logo size="md" showTagline={true} />
            </div>
            <p className="text-[14px] text-ink-600 dark:text-slate-400 leading-[1.7] mb-6 max-w-[280px]">
              India&apos;s most trusted platform for government exam preparation. Practice, analyze and achieve your dream job.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="w-9 h-9 rounded-lg border hairline dark:border-slate-700 bg-white dark:bg-slate-900 text-ink-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center text-xs font-bold"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="display-card text-[13px] uppercase tracking-[0.1em] mb-5 text-ink-900 dark:text-white">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="text-[14px] text-ink-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-200">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Exams */}
          <div>
            <h3 className="display-card text-[13px] uppercase tracking-[0.1em] mb-5 text-ink-900 dark:text-white">Exams</h3>
            <ul className="space-y-3">
              {examLinks.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="text-[14px] text-ink-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-200">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="display-card text-[13px] uppercase tracking-[0.1em] mb-5 text-ink-900 dark:text-white">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="text-[14px] text-ink-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-200">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Download App */}
          <div>
            <h3 className="display-card text-[13px] uppercase tracking-[0.1em] mb-5 text-ink-900 dark:text-white">Download App</h3>
            <p className="text-[14px] text-ink-600 dark:text-slate-400 mb-4">Get our app on</p>
            <div className="flex flex-col gap-2.5">
              {/* Google Play black button */}
              <a
                href="#"
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-ink-900 text-white hover:bg-black hover:-translate-y-0.5 transition-all duration-300 shadow-sm"
              >
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.793 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-1.707l2.608 1.51a1 1 0 0 1 0 1.727l-2.609 1.51-2.534-2.534 2.535-2.213zM5.864 2.658L16.8 8.99l-2.302 2.302L5.864 2.658z"/>
                </svg>
                <div>
                  <div className="text-[9px] text-slate-300 leading-none">GET IT ON</div>
                  <div className="text-sm font-bold text-white leading-tight">Google Play</div>
                </div>
              </a>

              {/* App Store black button */}
              <a
                href="#"
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-ink-900 text-white hover:bg-black hover:-translate-y-0.5 transition-all duration-300 shadow-sm"
              >
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div>
                  <div className="text-[9px] text-slate-300 leading-none">Download on the</div>
                  <div className="text-sm font-bold text-white leading-tight">App Store</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t hairline dark:border-slate-800 mt-14 pt-7 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[13.5px] text-ink-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} ExamReady. All Rights Reserved.
          </p>
          <p className="text-[13.5px] text-ink-500 dark:text-slate-400 flex items-center gap-1.5">
            Made with <span className="text-red-500">❤</span> in India
          </p>
        </div>
      </div>
    </footer>
  );
}

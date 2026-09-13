'use client';

import { Users, IndianRupee, TrendingUp, Link2, ArrowRight, Copy } from 'lucide-react';
import { RoleDashboardShell } from '@/components/layout/RoleDashboardShell';

const STATS = [
  { label: 'Referred Students', value: '312', icon: Users, color: '#2563EB' },
  { label: 'Active Enrollments', value: '87', icon: TrendingUp, color: '#16A34A' },
  { label: "This Month's Earnings", value: '₹18,400', icon: IndianRupee, color: '#F97316' },
  { label: 'Total Earnings', value: '₹2,14,600', icon: IndianRupee, color: '#DC2626' },
];

const REFERRALS = [
  { name: 'Sourav Dutta', exam: 'WBCS Combined', joinedAgo: '2 days ago', status: 'Enrolled' },
  { name: 'Ananya Roy', exam: 'WB Constable', joinedAgo: '4 days ago', status: 'Enrolled' },
  { name: 'Debjit Sarkar', exam: 'Primary TET', joinedAgo: '1 week ago', status: 'Trial' },
  { name: 'Ritika Basu', exam: 'PSC Clerkship', joinedAgo: '2 weeks ago', status: 'Enrolled' },
];

const STATUS_STYLE: Record<string, string> = {
  Enrolled: 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400',
  Trial: 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400',
};

export default function PartnerDashboardPage() {
  return (
    <RoleDashboardShell roleLabel="Partner" roleBadgeColor="#16A34A">
      {/* Referral link */}
      <div className="rounded-2xl border hairline dark:border-slate-800 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900 p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Link2 className="h-5 w-5" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-ink-500 dark:text-slate-400">Your referral link</p>
            <p className="text-[14.5px] font-bold text-ink-900 dark:text-white truncate">examready.in/join?ref=PARTNER2026</p>
          </div>
        </div>
        <button className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold px-4 py-2.5 transition-colors">
          <Copy className="h-3.5 w-3.5" />
          Copy Link
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border hairline dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl mb-4"
                style={{ background: `${stat.color}14`, color: stat.color, boxShadow: `inset 0 0 0 1px ${stat.color}25` }}
              >
                <Icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <p className="tabular text-[22px] font-extrabold text-ink-900 dark:text-white leading-none">
                {stat.value}
              </p>
              <p className="mt-1.5 text-[12.5px] font-medium text-ink-500 dark:text-slate-400">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent referrals */}
      <div className="rounded-2xl border hairline dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b hairline dark:border-slate-800">
          <h2 className="display-card text-[15.5px] dark:text-white">Recent Referrals</h2>
          <span className="text-[12.5px] font-semibold text-blue-700 dark:text-blue-400 inline-flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {REFERRALS.map((item) => (
            <li key={item.name} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="min-w-0">
                <p className="text-[14px] font-bold text-ink-900 dark:text-white truncate">{item.name}</p>
                <p className="text-[12.5px] text-ink-500 dark:text-slate-400 mt-0.5">
                  {item.exam} · Joined {item.joinedAgo}
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${STATUS_STYLE[item.status]}`}>
                {item.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </RoleDashboardShell>
  );
}

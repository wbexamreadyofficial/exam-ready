'use client';

import { ClipboardCheck, ClipboardList, Clock, FileCheck2, ArrowRight } from 'lucide-react';
import { RoleDashboardShell } from '@/components/layout/RoleDashboardShell';

const STATS = [
  { label: 'Pending Reviews', value: '18', icon: ClipboardList, color: '#F97316' },
  { label: 'Reviewed This Month', value: '146', icon: FileCheck2, color: '#16A34A' },
  { label: 'Avg. Turnaround', value: '2.4h', icon: Clock, color: '#2563EB' },
  { label: 'Total Evaluated', value: '1,204', icon: ClipboardCheck, color: '#DC2626' },
];

const QUEUE = [
  { exam: 'WBCS Prelims · Mock 12', candidates: 24, submittedAgo: '12 minutes ago', priority: 'High' },
  { exam: 'WB SI · Descriptive Round', candidates: 8, submittedAgo: '1 hour ago', priority: 'Medium' },
  { exam: 'PSC Clerkship · Mock 4', candidates: 31, submittedAgo: '3 hours ago', priority: 'Medium' },
  { exam: 'Primary TET · Answer Review', candidates: 15, submittedAgo: 'Yesterday', priority: 'Low' },
];

const PRIORITY_STYLE: Record<string, string> = {
  High: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400',
  Medium: 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400',
  Low: 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400',
};

export default function ExaminerDashboardPage() {
  return (
    <RoleDashboardShell roleLabel="Examiner" roleBadgeColor="#7C3AED">
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

      {/* Review queue */}
      <div className="rounded-2xl border hairline dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b hairline dark:border-slate-800">
          <h2 className="display-card text-[15.5px] dark:text-white">Review Queue</h2>
          <span className="text-[12.5px] font-semibold text-blue-700 dark:text-blue-400 inline-flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {QUEUE.map((item) => (
            <li key={item.exam} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="min-w-0">
                <p className="text-[14px] font-bold text-ink-900 dark:text-white truncate">{item.exam}</p>
                <p className="text-[12.5px] text-ink-500 dark:text-slate-400 mt-0.5">
                  {item.candidates} candidates · Submitted {item.submittedAgo}
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${PRIORITY_STYLE[item.priority]}`}>
                {item.priority}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </RoleDashboardShell>
  );
}

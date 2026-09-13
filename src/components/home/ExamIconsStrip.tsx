'use client';

import { ShieldCheck, Shield, Utensils, FileText, Briefcase, BookOpen, GraduationCap } from 'lucide-react';
import Link from 'next/link';

/* Icon colors rotate through the brand palette: blue → orange → green → red */
const EXAMS = [
  { id: 'wb-constable',     name: 'WB Constable',      icon: ShieldCheck,    color: '#2563EB' },
  { id: 'wb-si',            name: 'WB SI',             icon: Shield,         color: '#F97316' },
  { id: 'food-si',          name: 'Food SI',           icon: Utensils,       color: '#16A34A' },
  { id: 'psc-clerkship',    name: 'PSC Clerkship',     icon: FileText,       color: '#DC2626' },
  { id: 'psc-miscellaneous',name: 'PSC Miscellaneous', icon: Briefcase,      color: '#2563EB' },
  { id: 'wbcs',             name: 'WBCS',              icon: BookOpen,       color: '#F97316' },
  { id: 'primary-tet',      name: 'Primary TET',       icon: GraduationCap,  color: '#16A34A' },
];

export function ExamIconsStrip() {
  // Duplicated 4x so the track always has runway well beyond the widest
  // viewport — translateX(-25%) lands exactly on the next identical quarter,
  // so the loop never visibly "runs out" or snaps back.
  const list = [...EXAMS, ...EXAMS, ...EXAMS, ...EXAMS];

  return (
    <section className="relative bg-white dark:bg-slate-950 section-y-sm border-b hairline dark:border-slate-800 overflow-hidden">
      {/* Faint ambient glow for depth */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(60%_120%_at_50%_0%,rgba(37,99,235,0.05),transparent)] dark:bg-[radial-gradient(60%_120%_at_50%_0%,rgba(37,99,235,0.08),transparent)]" />

      <div className="container mb-10 flex flex-col items-center text-center relative">
        <div className="flex items-center gap-3 mb-1">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-slate-300 dark:to-slate-700" />
          <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-ink-500 dark:text-slate-400">
            Prepare for Top West Bengal Government Exams
          </p>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-slate-300 dark:to-slate-700" />
        </div>
      </div>

      {/* Continuous Marquee Strip — edges fade so items enter and exit softly */}
      <div className="relative w-full overflow-hidden flex select-none">
        {/* Edge fades */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 md:w-32 z-10 bg-gradient-to-r from-white dark:from-slate-950 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 md:w-32 z-10 bg-gradient-to-l from-white dark:from-slate-950 to-transparent" />

        <div className="flex w-max shrink-0 animate-marquee gap-10 md:gap-14 items-center py-2">
          {list.map((exam, idx) => {
            const Icon = exam.icon;
            return (
              <Link
                key={`${exam.id}-${idx}`}
                href={`/exams/${exam.id}`}
                className="flex flex-col items-center gap-3 shrink-0 group"
              >
                <div
                  className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-700/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_12px_24px_-8px_var(--tile-glow)] group-hover:border-transparent"
                  style={{ ['--tile-glow' as string]: `${exam.color}45` }}
                >
                  <div
                    className="absolute inset-0 rounded-2xl opacity-70 dark:opacity-100"
                    style={{ background: `radial-gradient(120% 120% at 25% 15%, ${exam.color}1f, transparent 70%)` }}
                  />
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ boxShadow: `inset 0 0 0 1.5px ${exam.color}55` }}
                  />
                  <Icon
                    className="relative w-[26px] h-[26px] transition-transform duration-300 group-hover:scale-110"
                    style={{ color: exam.color }}
                    strokeWidth={1.9}
                  />
                </div>
                <span className="text-[12.5px] font-semibold text-ink-700 dark:text-slate-300 whitespace-nowrap transition-colors group-hover:text-ink-950 dark:group-hover:text-white">
                  {exam.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-25%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
          will-change: transform;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

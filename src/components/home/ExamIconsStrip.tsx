'use client';

import { ShieldCheck, Shield, Utensils, FileText, Briefcase, BookOpen, GraduationCap } from 'lucide-react';
import Link from 'next/link';

/* Icon colors rotate through the brand palette: blue → orange → green → red */
const EXAMS = [
  { id: 'wb-constable',     name: 'WB Constable',      icon: ShieldCheck,    color: '#2563EB', bg: '#EFF6FF' },
  { id: 'wb-si',            name: 'WB SI',             icon: Shield,         color: '#F97316', bg: '#FFF7ED' },
  { id: 'food-si',          name: 'Food SI',           icon: Utensils,       color: '#16A34A', bg: '#F0FDF4' },
  { id: 'psc-clerkship',    name: 'PSC Clerkship',     icon: FileText,       color: '#DC2626', bg: '#FEF2F2' },
  { id: 'psc-miscellaneous',name: 'PSC Miscellaneous', icon: Briefcase,      color: '#2563EB', bg: '#EFF6FF' },
  { id: 'wbcs',             name: 'WBCS',              icon: BookOpen,       color: '#F97316', bg: '#FFF7ED' },
  { id: 'primary-tet',      name: 'Primary TET',       icon: GraduationCap,  color: '#16A34A', bg: '#F0FDF4' },
];

export function ExamIconsStrip() {
  // Duplicate for smooth seamless loop
  const list = [...EXAMS, ...EXAMS];

  return (
    <section className="bg-white dark:bg-slate-950 section-y-sm border-b hairline dark:border-slate-800 overflow-hidden">
      <div className="container mb-10 flex flex-col items-center text-center">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ink-400 dark:text-slate-500">
          Prepare for Top West Bengal Government Exams
        </p>
      </div>

      {/* Continuous Marquee Strip — edges fade so items enter and exit softly */}
      <div className="relative w-full overflow-hidden flex select-none">
        {/* Edge fades */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 md:w-28 z-10 bg-gradient-to-r from-white dark:from-slate-950 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 md:w-28 z-10 bg-gradient-to-l from-white dark:from-slate-950 to-transparent" />

        <div className="flex shrink-0 animate-marquee gap-8 md:gap-12 items-center justify-around min-w-full py-2">
          {list.map((exam, idx) => {
            const Icon = exam.icon;
            return (
              <Link
                key={`${exam.id}-${idx}`}
                href={`/exams/${exam.id}`}
                className="flex flex-col items-center gap-3 shrink-0 group"
              >
                <div
                  className="icon-tile w-[62px] h-[62px] border border-slate-200/70 dark:border-slate-700 dark:bg-slate-800 shadow-xs group-hover:shadow-md"
                  style={{ background: exam.bg, color: exam.color }}
                >
                  <Icon className="w-[26px] h-[26px]" strokeWidth={1.9} />
                </div>
                <span className="text-[12.5px] font-semibold text-ink-700 dark:text-slate-300 whitespace-nowrap">
                  {exam.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

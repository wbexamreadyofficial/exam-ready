'use client';

import { ShieldCheck, Shield, Utensils, FileText, Briefcase, MoreHorizontal, BookOpen, GraduationCap, Award } from 'lucide-react';
import Link from 'next/link';

const EXAMS = [
  { id: 'wb-constable', name: 'WB Constable', icon: ShieldCheck },
  { id: 'wb-si', name: 'WB SI', icon: Shield },
  { id: 'food-si', name: 'Food SI', icon: Utensils },
  { id: 'psc-clerkship', name: 'PSC Clerkship', icon: FileText },
  { id: 'psc-miscellaneous', name: 'PSC Miscellaneous', icon: Briefcase },
  { id: 'wbcs', name: 'WBCS', icon: BookOpen },
  { id: 'primary-tet', name: 'Primary TET', icon: GraduationCap },
];

export function ExamIconsStrip() {
  // Duplicate for smooth seamless loop
  const list = [...EXAMS, ...EXAMS];

  return (
    <section className="bg-slate-50/80 dark:bg-slate-900/50 py-10 border-y border-slate-200/80 dark:border-slate-800 overflow-hidden">
      <div className="container mx-auto px-4 mb-6 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
          Prepare for Top West Bengal Government Exams
        </h2>
      </div>
      
      {/* Continuous Marquee Strip */}
      <div className="relative w-full overflow-hidden flex select-none">
        <div className="flex shrink-0 animate-marquee gap-8 md:gap-12 items-center justify-around min-w-full">
          {list.map((exam, idx) => {
            const Icon = exam.icon;
            return (
              <Link 
                key={`${exam.id}-${idx}`} 
                href={`/exams/${exam.id}`}
                className="flex flex-col items-center gap-2.5 shrink-0 group transition-transform duration-300 hover:scale-105"
              >
                <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200/60 dark:border-slate-700 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300">
                  <Icon className="w-7 h-7" />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 whitespace-nowrap">
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

'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Shield, Utensils, FileText, Briefcase, MoreHorizontal } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

/*
  Exam titles, counts and hrefs are unchanged. `abbr`, `questions` and
  `difficulty` are presentation-only additions that let each tile read as a
  real product rather than a generic category card.
*/
const exams = [
  {
    title: 'WB Constable',
    abbr: 'WBP',
    subtitle: 'WBP Constable, Lady Constable and more',
    count: '45+ Tests',
    questions: '4,500+ Qs',
    difficulty: 2,
    icon: ShieldCheck,
    accent: '#2563EB',
    iconBg: 'bg-blue-50 text-blue-600 ring-1 ring-blue-100',
    buttonBg: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    href: '/exams/wb-constable',
  },
  {
    title: 'WB SI',
    abbr: 'SI',
    subtitle: 'WBP Sub Inspector, Sergeant and more',
    count: '35+ Tests',
    questions: '3,500+ Qs',
    difficulty: 3,
    icon: Shield,
    accent: '#FF700B',
    iconBg: 'bg-orange-50 text-orange-600 ring-1 ring-orange-100',
    buttonBg: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
    href: '/exams/wb-si',
  },
  {
    title: 'Food SI',
    abbr: 'FSI',
    subtitle: 'WB Food & Supplies Sub Inspector',
    count: '30+ Tests',
    questions: '3,000+ Qs',
    difficulty: 2,
    icon: Utensils,
    accent: '#16A34A',
    iconBg: 'bg-green-50 text-green-600 ring-1 ring-green-100',
    buttonBg: 'bg-green-50 text-green-600 hover:bg-green-100',
    href: '/exams/food-si',
  },
  {
    title: 'PSC Clerkship',
    abbr: 'PSC',
    subtitle: 'LDC, LDA, Assistant and more',
    count: '25+ Tests',
    questions: '2,500+ Qs',
    difficulty: 2,
    icon: FileText,
    accent: '#DC2626',
    iconBg: 'bg-red-50 text-red-600 ring-1 ring-red-100',
    buttonBg: 'bg-red-50 text-red-600 hover:bg-red-100',
    href: '/exams/psc-clerkship',
  },
  {
    title: 'PSC Miscellaneous',
    abbr: 'MISC',
    subtitle: 'Block Youth Officer, Inspector and more',
    count: '25+ Tests',
    questions: '2,500+ Qs',
    difficulty: 3,
    icon: Briefcase,
    accent: '#2563EB',
    iconBg: 'bg-blue-50 text-blue-600 ring-1 ring-blue-100',
    buttonBg: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    href: '/exams/psc-miscellaneous',
  },
  {
    title: 'Others',
    abbr: 'MORE',
    subtitle: 'WBCS, Primary TET, Excise and more',
    count: '20+ Tests',
    questions: '2,000+ Qs',
    difficulty: 3,
    icon: MoreHorizontal,
    accent: '#FF700B',
    iconBg: 'bg-orange-50 text-orange-600 ring-1 ring-orange-100',
    buttonBg: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
    href: '/exams/others',
  },
];

const DIFFICULTY_LABEL = ['', 'Basic', 'Moderate', 'Advanced'];

export function ExamCategoriesSection() {
  return (
    <section className="section-y bg-white dark:bg-slate-950">
      <div className="container">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-12 md:mb-16">
            <div className="max-w-xl">
              <span className="eyebrow-line text-red-600 dark:text-red-400 mb-4">
                Popular Exams
              </span>
              <h2 className="display-section text-balance text-[1.875rem] md:text-[2.5rem] dark:text-white">
                Choose Your Exam and Start Preparing
              </h2>
            </div>
            <Link
              href="/exams"
              className="link-underline self-start sm:self-auto shrink-0 text-blue-700 dark:text-blue-400 font-semibold flex items-center text-[14px] gap-1.5 group whitespace-nowrap"
            >
              View All Exams
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </ScrollReveal>

        {/*
          Larger, scannable exam tiles. Each carries a logo-style abbreviation,
          real product metadata and a difficulty indicator so the exams read as
          distinct offerings rather than repeated category chips.
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {exams.map((exam, index) => {
            const Icon = exam.icon;
            return (
              <ScrollReveal key={exam.title} delay={index * 70}>
                <Link href={exam.href} className="block group h-full">
                  <div
                    className="surface-card relative h-full overflow-hidden p-6"
                    style={{ ['--exam-accent' as string]: exam.accent }}
                  >

                    {/* Accent edge — reveals on hover */}
                    <span
                      className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                      style={{ background: exam.accent }}
                      aria-hidden="true"
                    />

                    {/* Watermark abbreviation */}
                    <span
                      className="pointer-events-none absolute -right-2 -top-3 font-display text-[3.75rem] font-extrabold leading-none opacity-[0.06] transition-opacity duration-500 group-hover:opacity-[0.11]"
                      style={{ color: exam.accent }}
                      aria-hidden="true"
                    >
                      {exam.abbr}
                    </span>

                    {/* Header row */}
                    <div className="relative flex items-start gap-3.5 mb-5">
                      <div className={`icon-tile w-12 h-12 shrink-0 ${exam.iconBg}`}>
                        <Icon className="w-[22px] h-[22px]" strokeWidth={1.9} />
                      </div>
                      <div className="min-w-0 pt-0.5">
                        <h3 className="display-card text-[16px] dark:text-white leading-snug">
                          {exam.title}
                        </h3>
                        <p className="text-[12.5px] text-ink-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {exam.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Metadata row */}
                    <div className="relative flex items-center gap-4 mb-5 text-[12px] font-semibold text-ink-600 dark:text-slate-400">
                      <span className="tabular">{exam.count}</span>
                      <span className="h-3 w-px bg-slate-200 dark:bg-slate-700" aria-hidden="true" />
                      <span className="tabular">{exam.questions}</span>
                    </div>

                    {/* Difficulty indicator */}
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1" aria-hidden="true">
                          {[1, 2, 3].map((level) => (
                            <span
                              key={level}
                              className="h-1.5 w-5 rounded-full transition-colors"
                              style={{
                                background: level <= exam.difficulty ? exam.accent : undefined,
                              }}
                              data-inactive={level > exam.difficulty ? '' : undefined}
                            />
                          ))}
                        </div>
                        <span className="text-[11.5px] font-medium text-ink-500 dark:text-slate-500">
                          {DIFFICULTY_LABEL[exam.difficulty]}
                        </span>
                      </div>

                      <span
                        className="exam-cta inline-flex items-center gap-1 text-[12.5px] font-bold transition-colors"
                        style={{ color: exam.accent }}
                      >
                        Start Test
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </div>

                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

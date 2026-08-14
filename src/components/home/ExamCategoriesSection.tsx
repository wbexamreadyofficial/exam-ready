'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Shield, Utensils, FileText, Briefcase, MoreHorizontal } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

const exams = [
  {
    title: 'WB Constable',
    subtitle: 'WBP Constable, Lady Constable and more',
    count: '45+ Tests',
    icon: ShieldCheck,
    iconBg: 'bg-blue-100 text-blue-600',
    buttonBg: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    href: '/exams/wb-constable',
  },
  {
    title: 'WB SI',
    subtitle: 'WBP Sub Inspector, Sergeant and more',
    count: '35+ Tests',
    icon: Shield,
    iconBg: 'bg-cyan-100 text-cyan-600',
    buttonBg: 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100',
    href: '/exams/wb-si',
  },
  {
    title: 'Food SI',
    subtitle: 'WB Food & Supplies Sub Inspector',
    count: '30+ Tests',
    icon: Utensils,
    iconBg: 'bg-rose-100 text-rose-600',
    buttonBg: 'bg-rose-50 text-rose-600 hover:bg-rose-100',
    href: '/exams/food-si',
  },
  {
    title: 'PSC Clerkship',
    subtitle: 'LDC, LDA, Assistant and more',
    count: '25+ Tests',
    icon: FileText,
    iconBg: 'bg-emerald-100 text-emerald-600',
    buttonBg: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
    href: '/exams/psc-clerkship',
  },
  {
    title: 'PSC Miscellaneous',
    subtitle: 'Block Youth Officer, Inspector and more',
    count: '25+ Tests',
    icon: Briefcase,
    iconBg: 'bg-purple-100 text-purple-600',
    buttonBg: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    href: '/exams/psc-miscellaneous',
  },
  {
    title: 'Others',
    subtitle: 'WBCS, Primary TET, Excise and more',
    count: '20+ Tests',
    icon: MoreHorizontal,
    iconBg: 'bg-amber-100 text-amber-600',
    buttonBg: 'bg-amber-50 text-amber-600 hover:bg-amber-100',
    href: '/exams/others',
  },
];

export function ExamCategoriesSection() {
  return (
    <section className="py-16 md:py-20 bg-white dark:bg-slate-950">
      <div className="container px-4 mx-auto">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-10">
            <div>
              {/* POPULAR EXAMS Pill Badge matching "Our Features" style */}
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase bg-blue-100 dark:bg-blue-950/60 px-3 py-1 rounded-full inline-block mb-2.5">
                POPULAR EXAMS
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Choose Your Exam and Start Preparing
              </h2>
            </div>
            <Link 
              href="/exams" 
              className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 flex items-center text-sm gap-1 group transition-colors whitespace-nowrap"
            >
              View All Exams <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </ScrollReveal>

        {/* 6 Vertical Cards in a horizontal grid matching Image 4 reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 xl:gap-5">
          {exams.map((exam, index) => {
            const Icon = exam.icon;
            return (
              <ScrollReveal key={exam.title} delay={index * 80}>
                <Link href={exam.href} className="block group h-full">
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 flex flex-col items-center text-center h-full group-hover:border-blue-400 group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                    
                    {/* Top Circular Icon */}
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${exam.iconBg}`}>
                      <Icon className="w-7 h-7" />
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 leading-snug">
                      {exam.title}
                    </h3>

                    {/* Subtitle */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 line-clamp-2 leading-relaxed flex-1">
                      {exam.subtitle}
                    </p>

                    {/* Bottom Pill Button */}
                    <div className={`w-full py-2 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${exam.buttonBg}`}>
                      <span>{exam.count}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
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

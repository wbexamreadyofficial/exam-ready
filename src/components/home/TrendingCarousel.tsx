'use client';

import Link from 'next/link';
import {
  Flame,
  BookOpen,
  Clock,
  PlayCircle,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n';

interface MockExam {
  id: string;
  title: string;
  category: string;
  questions: number;
  time: string;
  attempts: string;
  rating: string;
  tag: string;
  tagBg: string;
  gradient: string;
  borderColor: string;
  liveCount: number;
}

const TRENDING_MOCKS: MockExam[] = [
  {
    id: 'm1',
    title: 'PSC Clerkship Stage-1 Full Speed Test',
    category: 'PSC Clerkship',
    questions: 100,
    time: '90 Mins',
    attempts: '21,400 Candidates',
    rating: '4.9 ★',
    tag: 'FREE MOCK',
    tagBg: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold',
    gradient: 'from-blue-50/90 via-white to-sky-50/70 dark:from-slate-900 dark:via-blue-950/50 dark:to-slate-900',
    borderColor: 'border-blue-300 hover:border-blue-500 dark:border-blue-800',
    liveCount: 184,
  },
  {
    id: 'm2',
    title: 'WB Food Inspector Special Open Mock #12',
    category: 'WB Food Inspector',
    questions: 100,
    time: '90 Mins',
    attempts: '18,900 Candidates',
    rating: '4.8 ★',
    tag: 'TRENDING',
    tagBg: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black',
    gradient: 'from-amber-50/90 via-white to-orange-50/70 dark:from-slate-900 dark:via-amber-950/50 dark:to-slate-900',
    borderColor: 'border-amber-300 hover:border-amber-500 dark:border-amber-800',
    liveCount: 142,
  },
  {
    id: 'm3',
    title: 'WB Constable Prelims Grand Practice Paper',
    category: 'WB Constable',
    questions: 85,
    time: '60 Mins',
    attempts: '14,200 Candidates',
    rating: '4.9 ★',
    tag: 'MOST POPULAR',
    tagBg: 'bg-gradient-to-r from-rose-500 to-pink-600 text-white font-extrabold',
    gradient: 'from-rose-50/90 via-white to-pink-50/70 dark:from-slate-900 dark:via-rose-950/50 dark:to-slate-900',
    borderColor: 'border-rose-300 hover:border-rose-500 dark:border-rose-800',
    liveCount: 198,
  },
  {
    id: 'm4',
    title: 'WB Police SI Prelims Full Length Mock #05',
    category: 'WB SI',
    questions: 100,
    time: '90 Mins',
    attempts: '12,800 Candidates',
    rating: '4.9 ★',
    tag: 'HIGH DEMAND',
    tagBg: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-extrabold',
    gradient: 'from-indigo-50/90 via-white to-purple-50/70 dark:from-slate-900 dark:via-indigo-950/50 dark:to-slate-900',
    borderColor: 'border-indigo-300 hover:border-indigo-500 dark:border-indigo-800',
    liveCount: 115,
  },
  {
    id: 'm5',
    title: 'Primary Teacher TET 150 Marks Full Practice Paper',
    category: 'Primary TET',
    questions: 150,
    time: '150 Mins',
    attempts: '16,500 Candidates',
    rating: '4.8 ★',
    tag: 'TOP CHOICE',
    tagBg: 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-extrabold',
    gradient: 'from-teal-50/90 via-white to-emerald-50/70 dark:from-slate-900 dark:via-teal-950/50 dark:to-slate-900',
    borderColor: 'border-teal-300 hover:border-teal-500 dark:border-teal-800',
    liveCount: 167,
  },
  {
    id: 'm6',
    title: 'WB Health GNM/ANM Nursing Special Test Set',
    category: 'WB Health',
    questions: 100,
    time: '90 Mins',
    attempts: '9,800 Candidates',
    rating: '4.7 ★',
    tag: 'SPECIAL',
    tagBg: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold',
    gradient: 'from-cyan-50/90 via-white to-blue-50/70 dark:from-slate-900 dark:via-cyan-950/50 dark:to-slate-900',
    borderColor: 'border-cyan-300 hover:border-cyan-500 dark:border-cyan-800',
    liveCount: 92,
  },
];

export function TrendingCarousel() {
  const { t } = useTranslation();
  // Duplicate for seamless infinite marquee loop (moving like live ticker)
  const duplicatedMocks = [...TRENDING_MOCKS, ...TRENDING_MOCKS];

  return (
    <section className="py-16 bg-gradient-to-b from-white via-blue-50/40 to-white dark:from-slate-950 dark:via-slate-900/60 dark:to-slate-950 border-y border-slate-200/60 dark:border-slate-800 relative overflow-hidden">
      <div className="container mb-8">
        {/* Professional Block Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            {/* Live Indicator Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-extrabold text-xs mb-3 border border-blue-200 dark:border-blue-800 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
              </span>
              <span className="uppercase tracking-wider">Live Mock Test Series • 2026 Pattern</span>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 text-slate-950 shadow-md shadow-orange-500/20">
                <Flame className="h-6 w-6 stroke-[2.5] fill-slate-950" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {t.trending.title}
              </h2>
            </div>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-2xl font-medium">
              {t.trending.subtitle}
            </p>
          </div>

          {/* View All Button */}
          <Button
            variant="outline"
            size="default"
            className="font-extrabold text-sm border-2 border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all gap-2 h-10 px-5 shadow-sm self-start md:self-auto shrink-0"
            asChild
          >
            <Link href="/exams">
              <span>View All Tests</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Infinite Moving Marquee Ticker Track (Cards glide continuously like the top ticker) */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Soft edge fade overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />

        {/* Marquee Track */}
        <div className="flex items-stretch gap-6 animate-marquee-slow whitespace-nowrap px-4">
          {duplicatedMocks.map((mock, idx) => (
            <div
              key={`${mock.id}-${idx}`}
              className="w-[340px] sm:w-[380px] shrink-0 whitespace-normal h-full cursor-pointer group"
            >
              <Card
                className={`card-hover border-2 ${mock.borderColor} bg-gradient-to-br ${mock.gradient} shadow-lg hover:shadow-2xl flex flex-col justify-between shimmer-card h-full rounded-2xl overflow-hidden transition-all duration-300`}
              >
                <CardContent className="p-6 flex flex-col h-full justify-between gap-5">
                  <div>
                    {/* Tag & Category */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-sm ${mock.tagBg}`}>
                        {mock.tag}
                      </span>
                      <span className="text-xs font-black text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-slate-800/90 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs">
                        {mock.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-black text-lg sm:text-xl mb-4 text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {mock.title}
                    </h3>

                    {/* Details Pills */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 mb-3">
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
                        <BookOpen className="h-4 w-4 text-blue-500 shrink-0" />
                        <span>{mock.questions} Questions</span>
                      </div>
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
                        <Clock className="h-4 w-4 text-blue-500 shrink-0" />
                        <span>{mock.time}</span>
                      </div>
                    </div>

                    {/* Live attempting indicator */}
                    <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mb-1">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-400 live-dot" />
                      <span>{mock.liveCount} candidates attempting now</span>
                    </div>
                  </div>

                  {/* Rating & CTA */}
                  <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
                    <span className="text-xs font-extrabold text-blue-700 dark:text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20">
                      {mock.rating} ({mock.attempts})
                    </span>
                    <Button
                      size="default"
                      className="font-black bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 hover:from-amber-500 hover:to-yellow-600 gap-1.5 shadow-md shadow-amber-500/25 border-none rounded-xl h-10 px-5"
                      asChild
                    >
                      <Link href="/exams">
                        <PlayCircle className="h-4 w-4 stroke-[2.5]" />
                        <span>Attempt Test</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import { Monitor, FileText, BarChart3, Target, Globe, TrendingUp, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

/* ── Supporting features (the hero feature is composed separately below) ── */
const supportingFeatures = [
  {
    title: 'Real Exam Experience',
    description: 'Mock tests designed exactly as per the latest exam pattern and difficulty level.',
    icon: Monitor,
    tint: 'bg-blue-50 text-blue-600 ring-blue-100',
  },
  {
    title: 'Detailed Solutions',
    description: 'Step-by-step solutions for every question to help you learn from your mistakes.',
    icon: FileText,
    tint: 'bg-green-50 text-green-600 ring-green-100',
  },
  {
    title: 'Performance Tracking',
    description: 'Track your progress live with detailed topic insights.',
    icon: BarChart3,
    tint: 'bg-red-50 text-red-600 ring-red-100',
  },
  {
    title: 'Topic Wise Practice',
    description: 'Practice specific topics and strengthen your weak areas.',
    icon: Target,
    tint: 'bg-blue-50 text-blue-600 ring-blue-100',
  },
  {
    title: 'Available in 11 Languages',
    description: 'Learn and practice in your preferred language.',
    icon: Globe,
    tint: 'bg-orange-50 text-orange-600 ring-orange-100',
  },
];

/* ── Accuracy-by-subject bars shown inside the lead feature ── */
const SUBJECT_BARS = [
  { label: 'Reasoning', value: 92, color: '#2563EB' },
  { label: 'G. Studies', value: 78, color: '#16A34A' },
  { label: 'Arithmetic', value: 64, color: '#FF700B' },
];

/* Smooth sparkline through the score trend */
const TREND = [38, 44, 41, 55, 61, 58, 72, 79, 85];
const trendPath = TREND.map((v, i) => {
  const x = (i / (TREND.length - 1)) * 260;
  const y = 78 - (v / 100) * 68;
  return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
}).join(' ');

export function FeaturesSection() {
  return (
    <section className="section-y bg-[#FAFBFD] dark:bg-slate-900/40 border-y hairline dark:border-slate-800">
      <div className="container">

        {/* ── Section header ── */}
        <ScrollReveal>
          <div className="flex flex-col items-center text-center mb-12 md:mb-16">
            <span className="eyebrow-line text-orange-600 dark:text-orange-400 mb-4">
              Our Features
            </span>
            <h2 className="display-section text-balance text-[1.875rem] md:text-[2.5rem] dark:text-white mb-4 max-w-2xl">
              Everything You Need to Succeed
            </h2>
            <p className="lede text-pretty max-w-xl mx-auto dark:text-slate-400">
              Powerful tools and features designed to take your preparation to the next level.
            </p>
          </div>
        </ScrollReveal>

        {/*
          Bento grid — deliberately mixed sizes so the section reads as a
          product showcase rather than a row of identical cards.
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-[minmax(0,auto)]">

          {/* ═══ LEAD FEATURE — spans 2 columns and 2 rows on desktop ═══ */}
          <ScrollReveal className="sm:col-span-2 lg:row-span-2">
            <div className="group relative h-full overflow-hidden rounded-[--radius-xl] border hairline dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm transition-shadow duration-500 hover:shadow-lg">

              {/* Ambient tint */}
              <div
                className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full blur-[80px] bg-blue-500/10"
                aria-hidden="true"
              />

              <div className="relative">
                <span className="eyebrow-line text-blue-600 dark:text-blue-400 mb-4">
                  Powered by AI
                </span>
                <h3 className="display-section text-[1.375rem] md:text-[1.75rem] dark:text-white mb-3 max-w-md text-balance">
                  AI-Powered Performance Analysis
                </h3>
                <p className="lede text-[15px] max-w-md dark:text-slate-400 mb-8">
                  Get intelligent analysis of every attempt with personalised
                  suggestions on exactly which topics to revise next.
                </p>
              </div>

              {/* ── Embedded product visualisation ── */}
              <div className="relative rounded-xl border hairline dark:border-slate-800 bg-[#FAFBFD] dark:bg-slate-950/60 p-5">

                {/* Panel header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" strokeWidth={2.2} />
                    <span className="text-[12.5px] font-bold text-ink-800 dark:text-slate-200">
                      Score Trend
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-md bg-green-50 dark:bg-green-950/40 px-2 py-0.5 text-[11px] font-bold text-green-700 dark:text-green-400">
                    <CheckCircle2 className="h-3 w-3" />
                    +18%
                  </span>
                </div>

                {/* Sparkline */}
                <svg
                  viewBox="0 0 260 84"
                  className="w-full h-[76px] mb-6"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="featTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity="0.20" />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[10, 30, 50, 70].map((y) => (
                    <line key={y} x1="0" y1={y} x2="260" y2={y} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="1" />
                  ))}
                  <path d={`${trendPath} L 260 84 L 0 84 Z`} fill="url(#featTrend)" />
                  <path d={trendPath} fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

                {/* Accuracy by subject */}
                <div className="space-y-3.5">
                  {SUBJECT_BARS.map((bar) => (
                    <div key={bar.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11.5px] font-semibold text-ink-600 dark:text-slate-400">
                          {bar.label}
                        </span>
                        <span className="tabular text-[11.5px] font-bold text-ink-800 dark:text-slate-300">
                          {bar.value}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full transition-[width] duration-700 ease-out"
                          style={{ width: `${bar.value}%`, background: bar.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* ═══ SUPPORTING FEATURES — open layout, no heavy card chrome ═══ */}
          {supportingFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <ScrollReveal key={feature.title} delay={index * 70}>
                <div className="group h-full rounded-[--radius-xl] border hairline dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg">
                  <div className={`icon-tile w-11 h-11 mb-5 ring-1 ${feature.tint}`}>
                    <Icon className="w-[20px] h-[20px]" strokeWidth={2} />
                  </div>
                  <h3 className="display-card text-[15.5px] dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[13.5px] text-ink-600 dark:text-slate-400 leading-[1.65]">
                    {feature.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

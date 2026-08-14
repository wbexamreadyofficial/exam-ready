'use client';

import Link from 'next/link';
import { ArrowRight, Target, Bot, FileCheck, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExamIconsStrip } from '@/components/home/ExamIconsStrip';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { ExamCategoriesSection } from '@/components/home/ExamCategoriesSection';
import { StatsBar } from '@/components/home/StatsBar';
import { HowItWorks } from '@/components/home/HowItWorks';
import { CTABanner } from '@/components/home/CTABanner';
import { BlogSection } from '@/components/home/BlogSection';
import { HeroDashboard } from '@/components/home/HeroDashboard';

const heroFeatures = [
  { icon: Target,    label: 'Real Exam Experience'  },
  { icon: Bot,       label: 'AI-Powered Analysis'   },
  { icon: FileCheck, label: 'Detailed Solutions'    },
  { icon: BarChart3, label: 'Performance Tracking'  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">

      {/* ══════════════════════  HERO  ══════════════════════ */}
      {/*
        IMPORTANT: NO overflow-hidden on this section.
        The laptop hinge/base and phone panel must be able
        to render fully without being clipped.
      */}
      <section className="relative bg-gradient-to-br from-blue-50/50 via-slate-50/30 to-amber-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">

        {/* Background blobs — contained inside a clipping wrapper so they
            don't cause horizontal scroll, but the mockup is NOT clipped */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          {/* Top-left blue glow behind headline */}
          <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-blue-100/60 dark:bg-blue-900/20 rounded-full blur-[100px]" />
          
          {/* Top-right blue glow behind laptop */}
          <div className="absolute -top-10 right-0 w-[550px] h-[550px] bg-blue-100/70 dark:bg-blue-900/20 rounded-full blur-[90px]" />

          {/* Bottom-right golden yellow glow under mobile matching Image 1 */}
          <div className="absolute -bottom-10 -right-10 w-[450px] h-[450px] bg-[#FFD000]/60 dark:bg-amber-500/20 rounded-full blur-[80px]" />
        </div>

        <div className="container relative">

          {/* ── Mobile layout (stacked) ── */}
          <div className="flex flex-col gap-12 py-14 lg:hidden">
            <LeftContent />
            <div className="flex justify-center" style={{ paddingBottom: 70 }}>
              <div style={{ width: '100%', maxWidth: 480 }}>
                <HeroDashboard />
              </div>
            </div>
          </div>

          {/* ── Desktop layout (side by side) ── */}
          <div
            className="hidden lg:grid items-center py-16 xl:py-20"
            style={{ gridTemplateColumns: '45% 55%', gap: '2rem' }}
          >
            <LeftContent />

            {/*
              Right column: NO overflow restrictions.
              paddingBottom makes room for the phone that extends below the laptop.
            */}
            <div
              className="flex justify-center lg:justify-end"
              style={{ paddingBottom: 70 }}
            >
              <HeroDashboard />
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════ REST OF PAGE ═══════════════ */}
      <ExamIconsStrip />
      <FeaturesSection />
      <ExamCategoriesSection />
      <StatsBar />
      <HowItWorks />
      <CTABanner />
      <BlogSection />
    </div>
  );
}

/* ─────────────────────────────────────────
   Left text block
───────────────────────────────────────── */
function LeftContent() {
  return (
    <div className="flex flex-col">

      {/* Headline */}
      <h1 className="text-[1.85rem] sm:text-[2.4rem] md:text-[2.8rem] lg:text-[2.1rem] xl:text-[2.5rem] font-black leading-[1.18] tracking-tight text-slate-900 dark:text-white mb-5">
        West Bengal&apos;s Most Trusted
        <br />Mock Test Platform
        <br />for{' '}
        <span className="whitespace-nowrap" style={{ color: '#F59E0B' }}>Government Exams</span>
      </h1>

      {/* Subtext */}
      <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8 max-w-lg">
        Practice with real exam pattern, analyze your performance
        and improve your score with AI-powered insights.
      </p>

      {/* 4-feature 2×2 grid */}
      <div className="grid grid-cols-2 gap-x-5 gap-y-4 mb-10">
        {heroFeatures.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800">
              <Icon className="w-4 w-4 text-blue-600" />
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-tight">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* CTA buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Button
          size="lg"
          asChild
          style={{ background: '#0b64f4', border: 'none' }}
          className="h-12 px-7 rounded-full font-bold text-base gap-2 text-white hover:opacity-90 shadow-lg shadow-blue-500/30"
        >
          <Link href="/register">
            Start Free Mock Test
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>

        <Button
          size="lg"
          variant="outline"
          asChild
          className="h-12 px-7 rounded-full font-semibold text-base border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <Link href="/exams">Explore Courses</Link>
        </Button>
      </div>

      {/* Trust badge */}
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          {['bg-blue-400', 'bg-emerald-400', 'bg-amber-400', 'bg-purple-400'].map((bg, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 ${bg} flex items-center justify-center text-white text-[10px] font-bold`}
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Trusted by{' '}
          <strong className="text-slate-800 dark:text-slate-200">50,000+</strong>{' '}
          Aspirants Across India
        </p>
      </div>
    </div>
  );
}

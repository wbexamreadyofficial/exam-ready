'use client';

import Link from 'next/link';
import { ArrowRight, Target, Bot, FileCheck, BarChart3, Star, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExamIconsStrip } from '@/components/home/ExamIconsStrip';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { ExamCategoriesSection } from '@/components/home/ExamCategoriesSection';
import { StatsBar } from '@/components/home/StatsBar';
import { HowItWorks } from '@/components/home/HowItWorks';
import { CTABanner } from '@/components/home/CTABanner';
import { BlogSection } from '@/components/home/BlogSection';
import { HeroDashboard } from '@/components/home/HeroDashboard';

/* Each hero feature carries one brand color, applied directly so the tint
   reads consistently in both light and dark mode. */
const heroFeatures = [
  { icon: Target,    label: 'Real Exam Experience', color: '#2563EB' },
  { icon: Bot,       label: 'AI-Powered Analysis',  color: '#F97316' },
  { icon: FileCheck, label: 'Detailed Solutions',   color: '#16A34A' },
  { icon: BarChart3, label: 'Performance Tracking', color: '#DC2626' },
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
      {/*
        overflow-x: clip (not hidden) — clips horizontal poke-out from the
        ambient glows and the device mockup WITHOUT turning the section into a
        vertical scroll container, so the laptop base and phone still render.
      */}
      <section
        className="relative isolate bg-[#FAFBFD] dark:bg-slate-950"
        style={{ overflowX: 'clip' }}
      >

        {/* ── Layered background treatment ──
            1. fine grid, masked to fade at the edges
            2. soft ambient color light
            3. hairline at the section base
            All non-interactive and clipped so they never cause overflow. */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          {/* Fine architectural grid */}
          <div className="absolute inset-0 bg-grid-fine mask-radial-fade opacity-70" />

          {/* Ambient blue light behind the headline */}
          <div className="absolute -top-32 -left-32 w-[680px] h-[680px] bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-[130px]" />

          {/* Ambient light behind the device mockup */}
          <div className="absolute -top-20 right-0 w-[620px] h-[620px] bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-[120px]" />

          {/* Warm accent, low opacity — keeps the palette from feeling cold */}
          <div className="absolute bottom-0 -right-20 w-[480px] h-[480px] bg-orange-200/25 dark:bg-orange-500/10 rounded-full blur-[120px]" />

          {/* Cool balance accent */}
          <div className="absolute -bottom-32 right-[30%] w-[420px] h-[420px] bg-emerald-200/20 dark:bg-emerald-500/10 rounded-full blur-[120px]" />
        </div>

        {/* Base hairline to separate hero from the next section */}
        <div
          className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800"
          aria-hidden="true"
        />

        <div className="container relative">

          {/*
            A SINGLE responsive grid — stacked below `lg`, side-by-side above.
            Rendering one instance keeps exactly one <h1> in the document and
            halves the hero's DOM versus duplicating the column per breakpoint.
          */}
          <div className="grid grid-cols-1 lg:grid-cols-[46%_54%] items-center gap-10 sm:gap-14 lg:gap-10 pt-12 pb-16 sm:pt-16 lg:py-20 xl:py-24">
            <LeftContent />

            {/*
              Device column: NO overflow restrictions.
              paddingBottom makes room for the phone that extends below the laptop.
            */}
            <div
              className="flex justify-center lg:justify-end w-full"
              style={{ paddingBottom: 70 }}
            >
              <div className="w-full max-w-[420px] sm:max-w-[520px] lg:max-w-none">
                <HeroDashboard />
              </div>
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

      {/* Trust pill */}
      <div className="inline-flex items-center gap-2.5 self-start mb-7 rounded-full border border-blue-100/90 bg-white/70 backdrop-blur-md px-3.5 py-1.5 shadow-[0_4px_16px_-6px_rgba(37,99,235,0.25)] ring-1 ring-inset ring-white/60 dark:border-blue-900/60 dark:bg-blue-950/40 dark:ring-white/[0.04] dark:shadow-[0_4px_20px_-6px_rgba(37,99,235,0.2)]">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-600" />
        </span>
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-blue-700 dark:text-blue-300">
          West Bengal&apos;s #1 Mock Test Platform
        </span>
      </div>

      {/* Headline */}
      <h1 className="display-hero text-balance text-[2.1rem] sm:text-[2.75rem] md:text-[3.15rem] lg:text-[2.4rem] xl:text-[2.9rem] dark:text-white mb-5">
        West Bengal&apos;s Most Trusted
        <br />Mock Test Platform for{' '}
        <span className="relative inline-block whitespace-nowrap">
          <span className="relative z-10" style={{ color: '#EA580C' }}>Government</span>
          {/* Hand-drawn underline accent */}
          <svg
            className="absolute -bottom-1 left-0 w-full"
            height="10"
            viewBox="0 0 200 10"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M2 7.5 C 50 2.5, 150 2.5, 198 6"
              stroke="#FDBA74"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </span>{' '}
        <span className="whitespace-nowrap" style={{ color: '#15803D' }}>Exams</span>
      </h1>

      {/* Subtext */}
      <p className="lede text-pretty text-base sm:text-[1.0625rem] dark:text-slate-400 mb-8 max-w-[34rem]">
        Practice with real exam pattern, analyze your performance
        and improve your score with AI-powered insights.
      </p>

      {/* 4-feature 2×2 grid — one brand color each */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-9 max-w-lg">
        {heroFeatures.map(({ icon: Icon, label, color }) => (
          <div key={label} className="group flex items-center gap-3">
            <div
              className="flex items-center justify-center w-9 h-9 shrink-0 rounded-xl ring-1 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-2"
              style={{ background: `${color}14`, color, boxShadow: `inset 0 0 0 1px ${color}25` }}
            >
              <Icon className="w-[17px] h-[17px]" strokeWidth={2.2} />
            </div>
            <span className="text-[13.5px] font-semibold text-ink-800 dark:text-slate-200 leading-tight">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* CTA buttons */}
      <div className="flex flex-wrap gap-3.5 mb-9">
        <Button
          size="lg"
          asChild
          style={{
            background: '#FF700B',
            color: 'var(--color-cta-foreground)',
            border: 'none',
            boxShadow: 'var(--shadow-cta)',
          }}
          className="btn-premium h-[52px] px-8 rounded-xl font-bold text-[15px] gap-2"
        >
          <Link href="/login">
            Start Free Mock Test
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>

        <Button
          size="lg"
          variant="outline"
          asChild
          className="btn-premium h-[52px] px-8 rounded-xl font-semibold text-[15px] border hairline bg-white text-ink-800 hover:bg-slate-50 hover:border-slate-300 dark:bg-transparent dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Link href="/exams">Explore Courses</Link>
        </Button>

        {/* TEMPORARY: direct, unauthenticated way into the admin panel while it
            is being built. Remove this once `/admin` is behind ProtectedRoute
            again — see the note in src/app/(admin)/layout.tsx. */}
        <Button
          size="lg"
          variant="outline"
          asChild
          className="btn-premium h-[52px] px-8 rounded-xl font-semibold text-[15px] border-dashed border-2 border-slate-300 bg-transparent text-ink-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 gap-2"
        >
          <Link href="/admin">
            <ShieldCheck className="h-4 w-4" />
            Access Admin Panel
          </Link>
        </Button>
      </div>

      {/* Trust badge */}
      <div className="flex items-center gap-3.5 pt-1">
        <div className="flex -space-x-2.5">
          {[
            'linear-gradient(135deg, #3B82F6, #1D4ED8)',
            'linear-gradient(135deg, #FB923C, #EA580C)',
            'linear-gradient(135deg, #4ADE80, #16A34A)',
            'linear-gradient(135deg, #F87171, #DC2626)',
          ].map((bg, i) => (
            <div
              key={i}
              className="w-9 h-9 rounded-full ring-2 ring-white dark:ring-slate-900 flex items-center justify-center text-white text-[11px] font-bold shadow-[0_4px_10px_-3px_rgba(15,23,42,0.35)]"
              style={{ background: bg }}
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
            ))}
          </div>
          <p className="text-[13px] text-ink-500 dark:text-slate-400 font-medium mt-0.5">
            Trusted by{' '}
            <strong className="text-ink-900 dark:text-slate-200 font-bold tabular">50,000+</strong>{' '}
            Aspirants Across India
          </p>
        </div>
      </div>
    </div>
  );
}

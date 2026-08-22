'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Play } from 'lucide-react';

export function CTABanner() {
  return (
    <section className="section-y bg-white dark:bg-slate-950">
      <div className="container">
        {/*
          Outer wrapper with overflow visible so the student cutout
          floats above the top of the banner.
        */}
        <div className="relative pt-6" style={{ overflow: 'visible' }}>

          {/*
            ── Deep navy banner card ──
            `on-dark` is required: this panel is dark inside a light page, and
            the unlayered .display-* rules would otherwise paint the heading
            navy-on-navy. See the ON-DARK SCOPE note in globals.css.
          */}
          <div
            className="on-dark relative rounded-3xl"
            style={{
              background: 'linear-gradient(120deg, #0B1B33 0%, #17325C 50%, #0B1B33 100%)',
              minHeight: 220,
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            {/* Grid texture */}
            <div
              className="absolute inset-0 opacity-[0.07] pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }}
              aria-hidden="true"
            />
            {/* Ambient light */}
            <div className="absolute -top-24 -left-10 w-96 h-96 rounded-full blur-[100px] bg-blue-500/25 pointer-events-none" aria-hidden="true" />
            <div className="absolute -bottom-28 left-1/3 w-80 h-80 rounded-full blur-[100px] bg-orange-500/15 pointer-events-none" aria-hidden="true" />

            {/* Decorative paper plane trail */}
            <div className="absolute right-[320px] top-4 bottom-4 w-[240px] pointer-events-none opacity-25 hidden lg:block">
              <svg width="100%" height="100%" viewBox="0 0 240 160" fill="none">
                <path
                  d="M10 120 C 60 140, 100 80, 150 90 C 190 100, 200 40, 220 30"
                  stroke="white" strokeWidth="1.5" strokeDasharray="4 4" fill="none"
                />
                <g transform="translate(210, 15) rotate(-20)">
                  <path d="M0 15 L30 0 L20 30 L13 18 Z" stroke="white" strokeWidth="1.8" fill="none" />
                  <path d="M13 18 L22 10" stroke="white" strokeWidth="1.8" />
                </g>
              </svg>
            </div>

            {/* ── Content row ── */}
            <div className="relative flex items-center justify-between px-7 sm:px-10 md:px-12 py-10 md:py-12">

              {/* LEFT — Text + Buttons */}
              <div className="flex-1 max-w-lg z-10">
                <span className="eyebrow-line text-orange-400 mb-4">
                  Get Started Today
                </span>
                <h2 className="display-section text-balance text-[1.625rem] sm:text-[2rem] lg:text-[2.375rem] text-white mb-4">
                  Ready to Achieve Your Dream Job?
                </h2>
                <p className="text-blue-100/75 text-[14.5px] md:text-base mb-8 leading-relaxed max-w-md">
                  Join thousands of successful aspirants and start your preparation today.
                </p>

                <div className="flex flex-wrap items-center gap-3.5">
                  {/* Primary action */}
                  <Link
                    href="/register"
                    className="btn-premium inline-flex items-center justify-center gap-2 font-bold text-[14.5px] h-[52px] px-8 rounded-xl"
                    style={{
                      background: '#FF700B',
                      color: 'var(--color-cta-foreground)',
                      boxShadow: 'var(--shadow-cta)',
                    }}
                  >
                    Start Free Mock Test
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {/* Secondary — glass treatment reads better on navy than solid white */}
                  <Link
                    href="/app"
                    className="btn-premium inline-flex items-center justify-center gap-2 font-semibold text-[14.5px] h-[52px] px-8 rounded-xl bg-white/10 text-white border border-white/20 backdrop-blur-sm hover:bg-white/15"
                  >
                    <Play className="w-4 h-4 fill-white text-white" />
                    Download App
                  </Link>
                </div>
              </div>

              {/* RIGHT — Space reserved for student cutout */}
              <div className="hidden md:block w-64 lg:w-80 shrink-0" />
            </div>
          </div>

          {/* ── Transparent student cutout floating over top of banner ── */}
          <div
            className="hidden md:block absolute z-20 pointer-events-none"
            style={{
              right: 30,
              bottom: 0,
              width: 320,
              height: 310,
            }}
          >
            <Image
              src="/images/cta-student.png"
              alt="Happy student cutout"
              fill
              className="object-contain object-bottom"
              sizes="320px"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

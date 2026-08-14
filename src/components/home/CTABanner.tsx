'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Play } from 'lucide-react';

export function CTABanner() {
  return (
    <section className="py-12 md:py-16 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        {/*
          Outer wrapper with overflow visible so the student cutout
          floats above the top of the blue banner.
        */}
        <div className="relative pt-6" style={{ overflow: 'visible' }}>

          {/* ── Blue gradient banner card ── */}
          <div
            className="relative rounded-3xl shadow-lg"
            style={{
              background: 'linear-gradient(90deg, #2A8CFF 0%, #3097FF 50%, #1972FF 100%)',
              minHeight: 220,
              overflow: 'hidden',
            }}
          >
            {/* Decorative white paper plane trail SVG matching reference Image 2 */}
            <div className="absolute right-[320px] top-4 bottom-4 w-[240px] pointer-events-none opacity-40 hidden md:block">
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
            <div className="relative flex items-center justify-between px-8 md:px-12 py-8 md:py-10">

              {/* LEFT — Text + Buttons */}
              <div className="flex-1 max-w-lg z-10">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-3 tracking-tight leading-tight">
                  Ready to Achieve Your Dream Job?
                </h2>
                <p className="text-blue-100 text-sm md:text-base mb-8 leading-relaxed max-w-md font-medium">
                  Join thousands of successful aspirants and start your preparation today!
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  {/* Start Free Mock Test — Yellow button matching reference Image 2 */}
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-xl text-slate-900 shadow-md hover:shadow-lg hover:bg-amber-300 transition-all active:translate-y-0"
                    style={{ background: '#FFCC00' }}
                  >
                    Start Free Mock Test
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {/* Download App — White button with play icon matching reference Image 2 */}
                  <Link
                    href="/app"
                    className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-xl bg-white text-blue-600 shadow-md hover:shadow-lg hover:bg-blue-50 transition-all active:translate-y-0"
                  >
                    <Play className="w-4 h-4 fill-blue-600 text-blue-600" />
                    Download App
                  </Link>
                </div>
              </div>

              {/* RIGHT — Space reserved for student cutout */}
              <div className="hidden md:block w-72 lg:w-80 shrink-0" />
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

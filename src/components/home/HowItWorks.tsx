import React from 'react';
import { UserPlus, ListChecks, ClipboardCheck, TrendingUp } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export function HowItWorks() {
  /* One brand color per step — blue · orange · green · red */
  const steps = [
    {
      id: 1,
      title: 'Sign Up Free',
      description: 'Create a free account in just 30 seconds.',
      icon: UserPlus,
      color: '#2563EB',
    },
    {
      id: 2,
      title: 'Choose Your Test',
      description: 'Select your exam and test type.',
      icon: ListChecks,
      color: '#F97316',
    },
    {
      id: 3,
      title: 'Take Mock Test',
      description: 'Attempt test in real exam-like environment.',
      icon: ClipboardCheck,
      color: '#16A34A',
    },
    {
      id: 4,
      title: 'Analyse & Improve',
      description: 'Analyze your performance and improve your weak areas.',
      icon: TrendingUp,
      color: '#DC2626',
    },
  ];

  return (
    <section className="section-y bg-white dark:bg-slate-950">
      <div className="container">
        <ScrollReveal className="flex flex-col items-center text-center mb-12 md:mb-16">
          <span className="eyebrow-line text-blue-600 dark:text-blue-400 mb-4">
            How It Works
          </span>
          <h2 className="display-section text-balance text-[1.875rem] md:text-[2.5rem] dark:text-white mb-4 max-w-2xl">
            Simple Steps to Achieve Your Goal
          </h2>
          <p className="lede text-pretty max-w-lg dark:text-slate-400">
            From sign-up to score improvement in four straightforward steps.
          </p>
        </ScrollReveal>

        {/*
          Journey timeline — a left-aligned progression on mobile, a
          horizontal path on desktop. The oversized numeral carries the
          hierarchy so these read as steps, not as another row of cards.
        */}
        <div className="relative">
          {/* Connecting path — desktop only, sits behind the markers */}
          <div
            className="hidden lg:block absolute top-[30px] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700 z-0"
            aria-hidden="true"
          />
          {/* Vertical path — mobile / tablet */}
          <div
            className="lg:hidden absolute top-2 bottom-2 left-[27px] w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent dark:via-slate-800 z-0"
            aria-hidden="true"
          />

          <ol className="grid grid-cols-1 lg:grid-cols-4 gap-y-10 gap-x-8 relative z-10">
            {steps.map((step, index) => (
              <ScrollReveal
                key={step.id}
                delay={index * 90}
                className="group"
              >
                <li className="flex lg:flex-col gap-5 lg:gap-0 list-none">

                  {/* ── Marker ── */}
                  <div className="relative shrink-0 lg:mb-7">
                    <div
                      className="icon-tile w-14 h-14 lg:w-[60px] lg:h-[60px] text-white ring-[6px] ring-white dark:ring-slate-950"
                      style={{
                        background: step.color,
                        boxShadow: `0 10px 24px -10px ${step.color}99`,
                      }}
                    >
                      <step.icon size={24} strokeWidth={1.9} />
                    </div>
                  </div>

                  {/* ── Copy ── */}
                  <div className="min-w-0 pt-0.5 lg:pt-0">
                    {/* Oversized step numeral */}
                    <span
                      className="tabular block font-display text-[2.25rem] lg:text-[2.75rem] font-extrabold leading-none mb-2 lg:mb-3 transition-opacity duration-500 opacity-15 group-hover:opacity-30"
                      style={{ color: step.color }}
                      aria-hidden="true"
                    >
                      {String(step.id).padStart(2, '0')}
                    </span>

                    <h3 className="display-card text-[1.0625rem] dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-[14px] text-ink-600 dark:text-slate-400 leading-[1.65] max-w-[17rem]">
                      {step.description}
                    </p>
                  </div>
                </li>
              </ScrollReveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import { User, ShieldCheck, Trophy, Target, Star } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { AnimatedCounter } from './AnimatedCounter';

/* One brand color per stat — blue · blue-dark · orange · green · red */
const stats = [
  {
    target: 50000,
    suffix: '+',
    label: 'Happy Users',
    icon: User,
    isStatic: false,
    bg: '#2563EB', accent: '#60A5FA',
  },
  {
    target: 100000,
    suffix: '+',
    label: 'Mock Tests Attempted',
    icon: ShieldCheck,
    isStatic: false,
    bg: '#3B82F6', accent: '#93C5FD',
  },
  {
    target: 200,
    suffix: '+',
    label: 'Exams Covered',
    icon: Trophy,
    isStatic: false,
    bg: '#F97316', accent: '#FDBA74',
  },
  {
    target: 95,
    suffix: '%',
    label: 'Success Rate',
    icon: Target,
    isStatic: false,
    bg: '#16A34A', accent: '#6EE7A8',
  },
  {
    target: 0,
    text: '4.8/5',
    label: 'User Rating',
    icon: Star,
    isStatic: true,
    bg: '#DC2626', accent: '#FCA5A5',
  }
];

export function StatsBar() {
  return (
    <section className="section-y-end bg-white dark:bg-slate-950">
      <div className="container">
        <ScrollReveal>
          {/*
            A single deep navy panel. Brand colors appear only on the icons,
            which keeps the band premium rather than loud.
          */}
          <div
            className="on-dark relative rounded-2xl overflow-hidden px-6 py-9 md:px-10 md:py-11"
            style={{
              background: 'linear-gradient(135deg, #0B1B33 0%, #14294A 55%, #0B1B33 100%)',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            {/* Subtle grid texture inside the panel */}
            <div
              className="absolute inset-0 opacity-[0.07] pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }}
              aria-hidden="true"
            />
            {/* Soft ambient light in the panel corners */}
            <div
              className="absolute -top-24 -left-16 w-80 h-80 rounded-full blur-[90px] bg-blue-500/20 pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-24 -right-10 w-80 h-80 rounded-full blur-[90px] bg-orange-500/10 pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative grid grid-cols-2 md:grid-cols-5 gap-y-8 gap-x-4 divide-y-0 md:divide-x divide-white/10">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="group flex flex-col items-center text-center px-2 md:px-4"
                  >
                    {/* Icon carries the brand color */}
                    <div
                      className="icon-tile w-11 h-11 mb-4 ring-1 ring-white/10"
                      style={{ background: `${stat.bg}1F`, color: stat.accent }}
                    >
                      <Icon className="w-[21px] h-[21px]" strokeWidth={2} />
                    </div>

                    <div className="tabular text-[1.75rem] md:text-[2rem] font-extrabold text-white tracking-tight leading-none mb-2 font-display">
                      {stat.isStatic ? (
                        <span>{stat.text}</span>
                      ) : (
                        <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                      )}
                    </div>
                    <p className="text-white/60 font-medium text-[12.5px] leading-tight">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

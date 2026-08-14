'use client';

import React from 'react';
import { User, ShieldCheck, Trophy, Target, Star } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { AnimatedCounter } from './AnimatedCounter';

const stats = [
  {
    target: 50000,
    suffix: '+',
    label: 'Happy Users',
    icon: User,
    isStatic: false
  },
  {
    target: 100000,
    suffix: '+',
    label: 'Mock Tests Attempted',
    icon: ShieldCheck,
    isStatic: false
  },
  {
    target: 200,
    suffix: '+',
    label: 'Exams Covered',
    icon: Trophy,
    isStatic: false
  },
  {
    target: 95,
    suffix: '%',
    label: 'Success Rate',
    icon: Target,
    isStatic: false
  },
  {
    target: 0,
    text: '4.8/5',
    label: 'User Rating',
    icon: Star,
    isStatic: true
  }
];

export function StatsBar() {
  return (
    <section className="py-8 bg-white dark:bg-slate-950">
      <div className="container px-4 mx-auto">
        <ScrollReveal>
          {/* Match Image 1: Slim height banner with smooth yellow gradient getting lighter left-to-right */}
          <div 
            className="rounded-2xl py-5 px-6 lg:px-10 shadow-sm"
            style={{
              background: 'linear-gradient(90deg, #FFC800 0%, #FFD426 35%, #FFE159 70%, #FFF2A6 100%)',
            }}
          >
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 lg:gap-4 items-center">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 lg:gap-3.5"
                  >
                    {/* Icon on the left (front of digit) matching Image 1 */}
                    <div className="w-12 h-12 rounded-full border-2 border-blue-700/80 bg-white/40 flex items-center justify-center shrink-0 shadow-xs">
                      <Icon className="w-6 h-6 text-blue-800" strokeWidth={2.2} />
                    </div>

                    {/* Number + Label to the right of icon */}
                    <div className="flex flex-col justify-center">
                      <div className="text-xl sm:text-2xl lg:text-2xl xl:text-3xl font-extrabold text-slate-900 tracking-tight leading-none mb-1">
                        {stat.isStatic ? (
                          <span>{stat.text}</span>
                        ) : (
                          <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                        )}
                      </div>
                      <p className="text-slate-800 font-bold text-xs leading-tight whitespace-nowrap">
                        {stat.label}
                      </p>
                    </div>
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

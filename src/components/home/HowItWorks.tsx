import React from 'react';
import { UserPlus, ListChecks, ClipboardCheck, TrendingUp } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: 'Sign Up Free',
      description: 'Create a free account in just 30 seconds.',
      icon: UserPlus,
    },
    {
      id: 2,
      title: 'Choose Your Test',
      description: 'Select your exam and test type.',
      icon: ListChecks,
    },
    {
      id: 3,
      title: 'Take Mock Test',
      description: 'Attempt test in real exam-like environment.',
      icon: ClipboardCheck,
    },
    {
      id: 4,
      title: 'Analyse & Improve',
      description: 'Analyze your performance and improve your weak areas.',
      icon: TrendingUp,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <div className="inline-block rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600 mb-4 uppercase tracking-wider">
            How It Works
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Simple Steps to Achieve Your Goal
          </h2>
        </ScrollReveal>

        <div className="relative">
          {/* Connecting line - only visible on desktop */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 border-t-2 border-dashed border-slate-300 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, index) => (
              <ScrollReveal key={step.id} delay={index * 100} className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-amber-500 flex items-center justify-center text-white shadow-lg">
                    <step.icon size={32} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border-2 border-blue-100 flex items-center justify-center text-sm font-bold text-slate-900 shadow-sm">
                    {step.id}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm">{step.description}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

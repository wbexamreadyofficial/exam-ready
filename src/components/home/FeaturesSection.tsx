'use client';

import React from 'react';
import { Monitor, Brain, FileText, BarChart3, Target, Globe } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

const features = [
  {
    title: 'Real Exam Experience',
    description: 'Mock tests designed exactly as per the latest exam pattern and difficulty level.',
    icon: Monitor,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    title: 'AI-Powered Analysis',
    description: 'Get comprehensive analysis and personalized improvement suggestions.',
    icon: Brain,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    title: 'Detailed Solutions',
    description: 'Step-by-step solutions for every question to help you learn from your mistakes.',
    icon: FileText,
    color: 'bg-green-100 text-green-600'
  },
  {
    title: 'Performance Tracking',
    description: 'Track your progress on live with detailed topic and insights.',
    icon: BarChart3,
    color: 'bg-orange-100 text-orange-600'
  },
  {
    title: 'Topic Wise Practice',
    description: 'Practice specific topics and strengthen your weak areas.',
    icon: Target,
    color: 'bg-cyan-100 text-cyan-600'
  },
  {
    title: 'Available in 11 Languages',
    description: 'Learn and practice in your preferred language.',
    icon: Globe,
    color: 'bg-pink-100 text-pink-600'
  }
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container px-4 mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-sm font-bold text-blue-600 tracking-wider uppercase bg-blue-100 px-3 py-1 rounded-full">
              Our Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-4 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Powerful tools and features designed to take your preparation to the next level.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300 h-full">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 ${feature.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BookOpen,
  Target,
  Users,
  Trophy,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  BarChart3,
  Award,
  ArrowRight,
  Clock,
  FileText,
  Calculator,
  Monitor,
  Smartphone,
  TrendingUp,
  BarChart2,
  HelpCircle,
  Layers,
  FileCheck,
  Bot,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'About Us — Exam Ready',
  description:
    'Learn about Exam Ready — Premier competitive exam preparation platform for WB Constable, WB SI, WB Food Inspector, WB Health, PSC Clerkship, PSC Miscellaneous, and Primary Teacher TET.',
};

const pillars = [
  {
    icon: Clock,
    title: 'Authentic Exam Timer',
    desc: 'Exact exam environment simulation matching actual time constraints and negative marking rules.',
    color: 'bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20 font-black',
  },
  {
    icon: BarChart3,
    title: 'Precision Performance Analytics',
    desc: 'Deep topic-level subject breakdowns to pinpoint your weak areas and boost your accuracy rate.',
    color: 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-md shadow-blue-500/20',
  },
  {
    icon: Trophy,
    title: 'Statewide Live Rank Predictor',
    desc: 'Compete with over 50,000 active candidates statewide to evaluate your real exam readiness.',
    color: 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20',
  },
  {
    icon: BookOpen,
    title: 'Exhaustive PYQ Solution Bank',
    desc: 'Over 10,000 previous year question papers solved step-by-step with clear, memory-friendly explanations.',
    color: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20',
  },
];

const examPatterns = [
  {
    name: 'WB Constable 2026',
    marks: '85 Marks',
    duration: '60 Minutes',
    breakdown: 'GK (40M) • Math (30M) • Reasoning (15M)',
    negativeText: '-0.25 Marks / Wrong Answer',
    negativeIsWarning: true,
    badgeBg: 'bg-amber-400 text-slate-950 font-black',
    borderColor: 'border-amber-300 dark:border-amber-700/60',
    cardBg: 'from-amber-50/80 via-white to-yellow-50/40 dark:from-amber-950/30 dark:via-slate-900',
  },
  {
    name: 'WB Food Inspector (Food SI)',
    marks: '100 Marks',
    duration: '90 Minutes',
    breakdown: 'General Studies (50M) • Arithmetic (50M)',
    negativeText: '-0.33 Marks / Wrong Answer',
    negativeIsWarning: true,
    badgeBg: 'bg-blue-600 text-white font-bold',
    borderColor: 'border-blue-300 dark:border-blue-700/60',
    cardBg: 'from-blue-50/80 via-white to-cyan-50/40 dark:from-blue-950/30 dark:via-slate-900',
  },
  {
    name: 'PSC Clerkship Stage-1',
    marks: '100 Marks',
    duration: '90 Minutes',
    breakdown: 'English (30M) • GS (40M) • Arithmetic (30M)',
    negativeText: '-0.25 Marks / Wrong Answer',
    negativeIsWarning: true,
    badgeBg: 'bg-emerald-600 text-white font-bold',
    borderColor: 'border-emerald-300 dark:border-emerald-700/60',
    cardBg: 'from-emerald-50/80 via-white to-teal-50/40 dark:from-emerald-950/30 dark:via-slate-900',
  },
  {
    name: 'Primary Teacher TET',
    marks: '150 Marks',
    duration: '150 Minutes',
    breakdown: 'Pedagogy, Bengali, English, Math, EVS (30M each)',
    negativeText: 'No Negative Marking (0 Deduction)',
    negativeIsWarning: false,
    badgeBg: 'bg-purple-600 text-white font-bold',
    borderColor: 'border-purple-300 dark:border-purple-700/60',
    cardBg: 'from-purple-50/80 via-white to-indigo-50/40 dark:from-purple-950/30 dark:via-slate-900',
  },
];

const preparationRoadmap = [
  {
    step: 'Stage 1',
    title: 'Topic-Wise Mastery',
    desc: 'Solve 10,000+ topic MCQs in History, Science, Geography, Math, and English to eliminate foundational errors.',
    icon: Layers,
    color: 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white',
  },
  {
    step: 'Stage 2',
    title: 'Sectional Speed Training',
    desc: 'Take 10-minute timed subject quizzes daily to master speed control and minimize negative marking risk.',
    icon: Clock,
    color: 'bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black',
  },
  {
    step: 'Stage 3',
    title: 'Full-Length CBT Mocks',
    desc: 'Simulate full exam day pressure with real TCS countdown timers, negative score cards, and instant analytics.',
    icon: Monitor,
    color: 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white',
  },
  {
    step: 'Stage 4',
    title: 'Statewide Rank Benchmark',
    desc: 'Compare your scores across 23 West Bengal districts and review detailed Bengali & English solution explanations.',
    icon: Trophy,
    color: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white',
  },
];

const faqs = [
  {
    q: 'Are the mock test series updated according to the revised 2026 syllabus?',
    a: 'Yes! Every mock test paper is freshly curated by expert educators strictly according to the latest notification blueprints for WB Constable, WB SI, Food SI, PSC Clerkship, and TET 2026.',
  },
  {
    q: 'Can I attempt tests in both Bengali (বাংলা) and English?',
    a: 'Absolutely. Complete question sets, options, and step-by-step answer explanations are available in both Bengali (বাংলা) and English language.',
  },
  {
    q: 'How does the Statewide Live Rank Predictor work?',
    a: 'Your test submission is evaluated instantaneously for total marks, time per question, and accuracy rate, benchmarking your rank against 50,000+ candidates statewide.',
  },
  {
    q: 'Can I re-attempt mock tests and review answer keys anytime?',
    a: 'Yes, all attempted mock papers remain saved in your student dashboard. You can review detailed step-by-step solutions and re-attempt practice sets 24/7.',
  },
];

const traditionalItems = [
  { icon: FileText, title: 'Exam Environment', desc: 'Static printed paper sets with no real exam pressure' },
  { icon: Calculator, title: 'Score Calculation', desc: 'Manual self-checking (slow, tedious & error-prone)' },
  { icon: Users, title: 'Benchmarking', desc: 'No statewide rank comparison or competitor insights' },
  { icon: BarChart2, title: 'Weakness Tracking', desc: 'Generic overall score with no topic breakdown' },
  { icon: BookOpen, title: 'Accessibility', desc: 'Fixed physical books & hard copy exam schedules' },
];

const examReadyItems = [
  { icon: Monitor, title: 'Real Exam Environment', desc: 'Interactive computer timer matching TCS & PSC exam interfaces', color: 'bg-blue-500 text-white shadow-sm' },
  { icon: Award, title: 'Instant Score & Accuracy Report', desc: 'Automated 100% accurate score, time-per-question & accuracy metrics', color: 'bg-amber-500 text-slate-950 font-bold shadow-sm' },
  { icon: Trophy, title: 'Statewide Live Benchmarking', desc: 'Compare your rank live among 50,000+ candidates statewide', color: 'bg-purple-600 text-white shadow-sm' },
  { icon: TrendingUp, title: 'Granular Weakness Tracking', desc: 'Subject & topic-level breakdown so you focus on what matters', color: 'bg-emerald-600 text-white shadow-sm' },
  { icon: Smartphone, title: '24/7 Unlimited Access', desc: 'Practice anytime on Mobile & Desktop with instant solutions', color: 'bg-indigo-600 text-white shadow-sm' },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Header */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-amber-50/70 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 border-b border-slate-200/60 dark:border-slate-800">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-400/20 dark:bg-amber-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border-2 border-amber-400/80 bg-gradient-to-r from-amber-400/20 via-yellow-400/25 to-amber-500/20 dark:from-amber-950/80 dark:via-amber-900/60 dark:to-yellow-950/80 text-slate-900 dark:text-amber-200 text-xs sm:text-sm font-black shadow-lg shadow-amber-500/15 mb-6">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-400 text-slate-950 shadow-md">
              <Trophy className="h-4 w-4 stroke-[2.5]" />
            </div>
            <span className="bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider">
              2026 Blueprint
            </span>
            <span>100% Syllabus Aligned Competitive Exam Engine</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight text-slate-900 dark:text-white">
            Empowering Aspirants to Crack{' '}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 bg-clip-text text-transparent">
              Government Exams
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Designed specifically to give you the exact speed, accuracy, and confidence required to clear WB Constable, WB SI, WB Food Inspector, WB Health, PSC Clerkship, PSC Miscellaneous, and Primary Teacher TET.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4">
            {[
              { label: 'Active Candidates', value: '50,000+', icon: Users, cardBg: 'bg-amber-500/10 border-amber-300 text-amber-900 dark:text-amber-300' },
              { label: 'Solved MCQs', value: '10,000+', icon: BookOpen, cardBg: 'bg-blue-500/10 border-blue-300 text-blue-900 dark:text-blue-300' },
              { label: 'Mock Test Series', value: '500+', icon: Target, cardBg: 'bg-emerald-500/10 border-emerald-300 text-emerald-900 dark:text-emerald-300' },
              { label: 'Success Rate', value: '95%', icon: Trophy, cardBg: 'bg-purple-500/10 border-purple-300 text-purple-900 dark:text-purple-300' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className={`p-4 rounded-2xl border-2 ${stat.cardBg} shadow-sm text-center`}>
                  <Icon className="h-5 w-5 text-amber-500 mx-auto mb-1" />
                  <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                  <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 📘 2026 Examination Patterns & Marks Breakdown */}
      <section className="py-16 md:py-20 bg-slate-50/80 dark:bg-slate-950/60 border-b border-slate-200/60 dark:border-slate-800">
        <div className="container max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="mb-3 px-3 py-1 font-semibold text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/40">
              Exam Blueprints 2026
            </Badge>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">2026 Examination Patterns & Syllabus Coverage</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Authentic marks distribution and time limits for West Bengal competitive exams.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {examPatterns.map((pattern) => (
              <Card key={pattern.name} className={`card-hover border-2 ${pattern.borderColor} bg-gradient-to-br ${pattern.cardBg} shadow-md flex flex-col justify-between`}>
                <CardContent className="p-5 flex flex-col justify-between h-full gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase ${pattern.badgeBg}`}>
                        {pattern.marks}
                      </span>
                      <span className="text-[11px] font-extrabold text-slate-600 dark:text-slate-400">{pattern.duration}</span>
                    </div>

                    <h3 className="font-black text-base text-slate-900 dark:text-white mb-2 leading-snug">{pattern.name}</h3>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                      {pattern.breakdown}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800">
                    <div className={`px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1.5 text-center ${
                      pattern.negativeIsWarning 
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800/80' 
                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80'
                    }`}>
                      {pattern.negativeIsWarning ? '⚠️' : '✅'}
                      <span>{pattern.negativeText}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Negative Marking Guidance Banner */}
          <div className="p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-400/40 dark:border-amber-500/30 text-slate-900 dark:text-amber-100 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm">
            <div className="flex h-10 w-10 min-w-[2.5rem] items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-black shadow-sm">
              💡
            </div>
            <div className="text-xs sm:text-sm leading-relaxed">
              <span className="font-black text-amber-950 dark:text-amber-300 mr-1">What is Negative Marking?</span>
              In competitive exams, incorrect answers deduct marks (e.g., <strong className="text-rose-600 dark:text-rose-400 font-extrabold">-0.25 Marks</strong> means losing 1 mark for every 4 wrong answers). Exam Ready&apos;s mock test engine automatically applies these exact rules to calculate your real rank!
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission & Commitment */}
      <section className="py-16 md:py-20">
        <div className="container max-w-5xl">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/40 font-bold text-xs">
                Our Student Commitment
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Competitive Exams Demand Speed & Precision — Not Just Knowledge.
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Exam Ready was built to solve a critical challenge faced by competitive exam candidates: preparing with outdated paper sets that fail to simulate real exam time pressure.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                We combine authentic exam pattern questions, negative marking timers, instant subject performance analytics, and statewide rank benchmarks so you enter the exam hall with 100% confidence.
              </p>

              <div className="pt-2 space-y-2">
                {[
                  '100% Exam Pattern Aligned Questions',
                  'Instant Answer Keys with Explanations',
                  '24/7 Unlimited Practice on Mobile & Desktop',
                ].map((point) => (
                  <div key={point} className="flex items-center gap-2 text-xs font-extrabold text-slate-900 dark:text-white">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <Card key={pillar.title} className="card-hover border-2 border-slate-200 dark:border-slate-800 shadow-md">
                    <CardContent className="p-5 flex flex-col gap-2">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${pillar.color}`}>
                        <Icon className="h-5.5 w-5.5 stroke-[2.5]" />
                      </div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">{pillar.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{pillar.desc}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 4-Stage Aspirant Success Roadmap */}
      <section className="py-16 md:py-20 bg-slate-950 text-white border-y border-slate-800">
        <div className="container max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="mb-3 font-semibold text-amber-400 border-amber-400/40 bg-amber-400/10">
              Proven Preparation Strategy
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">4-Stage Aspirant Success Roadmap</h2>
            <p className="text-xs sm:text-sm text-slate-400">Step-by-step methodology to clear state competitive exams on your first attempt.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {preparationRoadmap.map((road) => {
              const RoadIcon = road.icon;
              return (
                <div key={road.step} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between relative group hover:border-amber-400/60 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${road.color} shadow-md`}>
                        <RoadIcon className="h-5.5 w-5.5 stroke-[2.5]" />
                      </div>
                      <span className="text-xs font-black text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                        {road.step}
                      </span>
                    </div>

                    <h3 className="font-black text-lg text-white mb-2">{road.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{road.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison: Traditional vs Exam Ready */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800">
        <div className="container max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="outline" className="mb-3 font-semibold text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/40">
              Why Aspirants Switch
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Traditional Practice vs. Exam Ready</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">See how modern smart practice gives you an unbeatable competitive advantage.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* Traditional Practice Card */}
            <Card className="border-2 border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 shadow-sm flex flex-col justify-between">
              <CardContent className="p-6 flex flex-col h-full justify-between gap-6">
                <div>
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Traditional Method</span>
                      <h3 className="text-xl font-extrabold text-slate-700 dark:text-slate-300 mt-0.5">Offline Paper Sets</h3>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                      <FileText className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {traditionalItems.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <div key={item.title} className="flex items-start gap-3 text-xs">
                          <div className="flex h-6 w-6 min-w-[1.5rem] items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5">
                            <ItemIcon className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-700 dark:text-slate-300">{item.title}</p>
                            <p className="text-slate-500 leading-relaxed mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exam Ready Active Smart Card */}
            <Card className="border-2 border-amber-400 dark:border-amber-500/60 bg-gradient-to-b from-amber-50/90 via-white to-amber-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 shadow-xl shadow-amber-500/10 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-yellow-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-4 py-1.5 rounded-bl-xl shadow-md">
                ⚡ Recommended For Top Scorers
              </div>

              <CardContent className="p-6 flex flex-col h-full justify-between gap-6">
                <div>
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-amber-200 dark:border-slate-800">
                    <div>
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">10X Faster & Smarter</span>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">Exam Ready Platform</h3>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black">
                      <Sparkles className="h-5 w-5 fill-slate-950" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {examReadyItems.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <div key={item.title} className="flex items-start gap-3 text-xs">
                          <div className={`flex h-6 w-6 min-w-[1.5rem] items-center justify-center rounded-lg ${item.color} shrink-0 mt-0.5`}>
                            <ItemIcon className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900 dark:text-white">{item.title}</p>
                            <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Button className="w-full font-extrabold bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 shadow-md shadow-amber-500/20 border-none gap-2 mt-4" asChild>
                  <Link href="/register">
                    Switch to Smart Practice Free <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ❓ Aspirant FAQ Section */}
      <section className="py-16 md:py-20 bg-slate-50/80 dark:bg-slate-950/60">
        <div className="container max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="mb-3 font-semibold text-blue-600 border-blue-300 bg-blue-50 dark:bg-blue-950/40">
              Aspirant Help Center
            </Badge>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Everything you need to know about preparing with Exam Ready.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {faqs.map((faq) => (
              <Card key={faq.q} className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
                <CardContent className="p-6">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2 flex items-start gap-2">
                    <HelpCircle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                    {faq.q}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-6">
                    {faq.a}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 md:py-20 bg-slate-950 text-white">
        <div className="container max-w-3xl text-center">
          <Badge variant="outline" className="mb-4 text-amber-400 border-amber-400/40 bg-amber-400/10 px-3.5 py-1 text-xs font-extrabold">
            Start Your Journey Free Today
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black mb-4 tracking-tight">Your Success Story Begins With One Mock Test</h2>
          <p className="text-slate-300 text-sm sm:text-base mb-8 leading-relaxed max-w-xl mx-auto">
            Join over 50,000 candidates already building speed, accuracy, and confidence with Exam Ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="font-black bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 gap-2 shadow-lg shadow-amber-500/20 border-none" asChild>
              <Link href="/register">
                Start Free Practice Now <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-slate-700 text-white hover:bg-slate-900 font-extrabold" asChild>
              <Link href="/exams">Explore Test Series 2026</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

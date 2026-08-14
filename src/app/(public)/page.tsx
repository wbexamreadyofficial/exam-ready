'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import {
  ArrowRight,
  BookOpen,
  Clock,
  BarChart3,
  Trophy,
  Users,
  CheckCircle2,
  Zap,
  Target,
  TrendingUp,
  ShieldCheck,
  Award,
  GraduationCap,
  FileCheck,
  HeartPulse,
  Briefcase,
  Sparkles,
  Search,
  Star,
  Flame,
  Medal,
  PlayCircle,
  HelpCircle,
  Bot,
  Cpu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RankersCarousel } from '@/components/home/RankersCarousel';
import { ScrollReveal } from '@/components/home/ScrollReveal';
import { AnimatedCounter } from '@/components/home/AnimatedCounter';
import { FloatingParticles } from '@/components/home/FloatingParticles';
import { LiveTicker } from '@/components/home/LiveTicker';
import { TrendingCarousel } from '@/components/home/TrendingCarousel';

const stats = [
  {
    label: 'Active Candidates',
    value: '50,000+',
    icon: Users,
    cardBg: 'bg-white dark:bg-slate-900',
    borderColor: 'border-2 border-blue-200/80 hover:border-blue-400 dark:border-blue-700/60',
    iconBg: 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/30',
    textColor: 'text-blue-900 dark:text-blue-300',
    labelColor: 'text-blue-700/80 dark:text-blue-400 font-bold',
  },
  {
    label: 'Curated Questions',
    value: '10,000+',
    icon: BookOpen,
    cardBg: 'bg-white dark:bg-slate-900',
    borderColor: 'border-2 border-cyan-200/80 hover:border-cyan-400 dark:border-cyan-700/60',
    iconBg: 'bg-gradient-to-br from-cyan-500 to-sky-600 text-white shadow-md shadow-cyan-500/30',
    textColor: 'text-cyan-900 dark:text-cyan-300',
    labelColor: 'text-cyan-700/80 dark:text-cyan-400 font-bold',
  },
  {
    label: 'Full Mock Papers',
    value: '500+',
    icon: Target,
    cardBg: 'bg-white dark:bg-slate-900',
    borderColor: 'border-2 border-indigo-200/80 hover:border-indigo-400 dark:border-indigo-700/60',
    iconBg: 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/30',
    textColor: 'text-indigo-900 dark:text-indigo-300',
    labelColor: 'text-indigo-700/80 dark:text-indigo-400 font-bold',
  },
  {
    label: 'Exam Success Rate',
    value: '95%',
    icon: TrendingUp,
    cardBg: 'bg-white dark:bg-slate-900',
    borderColor: 'border-2 border-emerald-200/80 hover:border-emerald-400 dark:border-emerald-700/60',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30',
    textColor: 'text-emerald-900 dark:text-emerald-300',
    labelColor: 'text-emerald-700/80 dark:text-emerald-400 font-bold',
  },
];

const examCategories = [
  {
    name: 'WB Constable',
    subtitle: 'Police Constable & Lady Constable',
    description: '85 Marks Prelims & Mains full length mock tests with revised 2026 syllabus.',
    icon: ShieldCheck,
    badge: 'Popular',
    gradient: 'from-blue-50/80 via-white to-cyan-50/50 dark:from-blue-950/40 dark:via-slate-900 dark:to-cyan-950/20',
    borderColor: 'border-blue-200 hover:border-blue-400 dark:border-blue-800',
    iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-md shadow-blue-500/30',
    badgeBg: 'bg-blue-600 text-white font-bold',
    testsCount: '48 Mock Papers',
  },
  {
    name: 'WB SI',
    subtitle: 'Police Sub-Inspector & Sergeant',
    description: 'Prelims paper 1 & 2 mock papers with analytical reasoning & General Studies.',
    icon: Award,
    badge: 'High Demand',
    gradient: 'from-purple-50/80 via-white to-indigo-50/50 dark:from-purple-950/40 dark:via-slate-900 dark:to-indigo-950/20',
    borderColor: 'border-purple-200 hover:border-purple-400 dark:border-purple-800',
    iconBg: 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/30',
    badgeBg: 'bg-purple-600 text-white font-bold',
    testsCount: '36 Mock Papers',
  },
  {
    name: 'WB Food Inspector',
    subtitle: 'Food & Supplies Sub-Inspector (Food SI)',
    description: 'Arithmetic & General Studies special practice sets according to recent exam pattern.',
    icon: FileCheck,
    badge: 'Trending',
    gradient: 'from-emerald-50/80 via-white to-teal-50/50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-teal-950/20',
    borderColor: 'border-emerald-200 hover:border-emerald-400 dark:border-emerald-800',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30',
    badgeBg: 'bg-emerald-600 text-white font-bold',
    testsCount: '52 Mock Papers',
  },
  {
    name: 'WB Health',
    subtitle: 'Health Services, GNM/ANM & Staff Nurse',
    description: 'Nursing & General Health Sciences specialized test series for health recruitment.',
    icon: HeartPulse,
    badge: 'Special',
    gradient: 'from-rose-50/80 via-white to-pink-50/50 dark:from-rose-950/40 dark:via-slate-900 dark:to-pink-950/20',
    borderColor: 'border-rose-200 hover:border-rose-400 dark:border-rose-800',
    iconBg: 'bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/30',
    badgeBg: 'bg-rose-600 text-white font-bold',
    testsCount: '30 Mock Papers',
  },
  {
    name: 'PSC Clerkship',
    subtitle: 'PSC Clerkship Part 1 & Part 2',
    description: '100 Marks objective test with English, Arithmetic & General Studies modules.',
    icon: Briefcase,
    badge: 'Popular',
    gradient: 'from-amber-50/80 via-white to-yellow-50/50 dark:from-amber-950/40 dark:via-slate-900 dark:to-yellow-950/20',
    borderColor: 'border-amber-300 hover:border-amber-500 dark:border-amber-800',
    iconBg: 'bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/30 font-black',
    badgeBg: 'bg-amber-500 text-slate-950 font-bold',
    testsCount: '65 Mock Papers',
  },
  {
    name: 'PSC Miscellaneous',
    subtitle: 'PSC Miscellaneous Services Recruitment',
    description: 'Comprehensive Prelims question bank with history, science & current affairs.',
    icon: Target,
    badge: null,
    gradient: 'from-indigo-50/80 via-white to-blue-50/50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-blue-950/20',
    borderColor: 'border-indigo-200 hover:border-indigo-400 dark:border-indigo-800',
    iconBg: 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/30',
    badgeBg: '',
    testsCount: '40 Mock Papers',
  },
  {
    name: 'Primary Teacher TET',
    subtitle: 'Primary Teacher Eligibility Test (TET)',
    description: 'Child Development, Pedagogy, Bengali, English & Mathematics 150 Marks mock.',
    icon: GraduationCap,
    badge: 'Top Choice',
    gradient: 'from-teal-50/80 via-white to-emerald-50/50 dark:from-teal-950/40 dark:via-slate-900 dark:to-emerald-950/20',
    borderColor: 'border-teal-200 hover:border-teal-400 dark:border-teal-800',
    iconBg: 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-500/30',
    badgeBg: 'bg-teal-600 text-white font-bold',
    testsCount: '45 Mock Papers',
  },
];

const trendingMocks = [
  {
    title: 'PSC Clerkship Stage-1 Full Speed Test',
    category: 'PSC Clerkship',
    questions: 100,
    time: '90 Mins',
    attempts: '21,400 Candidates',
    rating: '4.9 ★',
    tag: 'FREE MOCK',
    tagBg: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold',
    gradient: 'from-blue-50/60 via-white to-sky-50/40 dark:from-blue-950/30 dark:via-slate-900',
    borderColor: 'border-blue-200/80 hover:border-blue-400 dark:border-blue-800/80',
  },
  {
    title: 'WB Food Inspector Special Open Mock #12',
    category: 'WB Food Inspector',
    questions: 100,
    time: '90 Mins',
    attempts: '18,900 Candidates',
    rating: '4.8 ★',
    tag: 'TRENDING',
    tagBg: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black',
    gradient: 'from-indigo-50/60 via-white to-blue-50/40 dark:from-indigo-950/30 dark:via-slate-900',
    borderColor: 'border-indigo-200/80 hover:border-indigo-400 dark:border-indigo-800/80',
  },
  {
    title: 'WB Constable Prelims Grand Practice Paper',
    category: 'WB Constable',
    questions: 85,
    time: '60 Mins',
    attempts: '14,200 Candidates',
    rating: '4.9 ★',
    tag: 'MOST POPULAR',
    tagBg: 'bg-gradient-to-r from-rose-500 to-pink-600 text-white font-extrabold',
    gradient: 'from-cyan-50/60 via-white to-blue-50/40 dark:from-cyan-950/30 dark:via-slate-900',
    borderColor: 'border-cyan-200/80 hover:border-cyan-400 dark:border-cyan-800/80',
  },
];

const topRankers = [
  { rank: '1', name: 'Sourav Ganguly', district: 'Kolkata', score: '94/100', medal: '🥇', medalBg: 'from-amber-400 to-yellow-500' },
  { rank: '2', name: 'Ananya Roy', district: 'Howrah', score: '91/100', medal: '🥈', medalBg: 'from-slate-300 to-slate-400' },
  { rank: '3', name: 'Subhashish Das', district: 'Siliguri', score: '88/100', medal: '🥉', medalBg: 'from-amber-700 to-yellow-800' },
];

export default function HomePage() {
  const { t } = useTranslation();

  const parseStatValue = (value: string): { target: number; suffix: string } => {
    const cleaned = value.replace(/,/g, '');
    const match = cleaned.match(/^([\d]+)(.*)$/);
    if (match) {
      return { target: parseInt(match[1], 10), suffix: match[2] };
    }
    return { target: 0, suffix: '' };
  };

  const getStatLabel = (key: string) => {
    if (key === 'Active Candidates') return t.stats.candidates;
    if (key === 'Curated Questions') return t.stats.questions;
    if (key === 'Full Mock Papers') return t.stats.series;
    if (key === 'Exam Success Rate') return t.stats.success;
    return key;
  };

  const steps = [
    {
      number: '01',
      title: t.steps.step1Title,
      description: t.steps.step1Desc,
      gradient: 'from-blue-50/80 via-white to-cyan-50/40 dark:from-blue-950/30 dark:via-slate-900 dark:to-slate-900',
      borderColor: 'border-blue-200/80 hover:border-blue-400 dark:border-blue-800/80',
      badgeBg: 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white font-black shadow-md shadow-blue-500/30',
    },
    {
      number: '02',
      title: t.steps.step2Title,
      description: t.steps.step2Desc,
      gradient: 'from-indigo-50/80 via-white to-blue-50/40 dark:from-indigo-950/30 dark:via-slate-900 dark:to-slate-900',
      borderColor: 'border-indigo-200/80 hover:border-indigo-400 dark:border-indigo-800/80',
      badgeBg: 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-black shadow-md shadow-indigo-500/30',
    },
    {
      number: '03',
      title: t.steps.step3Title,
      description: t.steps.step3Desc,
      gradient: 'from-purple-50/80 via-white to-indigo-50/40 dark:from-purple-950/30 dark:via-slate-900 dark:to-slate-900',
      borderColor: 'border-purple-200/80 hover:border-purple-400 dark:border-purple-800/80',
      badgeBg: 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-black shadow-md shadow-purple-500/30',
    },
    {
      number: '04',
      title: t.steps.step4Title,
      description: t.steps.step4Desc,
      gradient: 'from-emerald-50/80 via-white to-teal-50/40 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900',
      borderColor: 'border-emerald-200/80 hover:border-emerald-400 dark:border-emerald-800/80',
      badgeBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black shadow-md shadow-emerald-500/30',
    },
  ];

  const features = [
    {
      icon: Clock,
      title: t.features.f1Title,
      description: t.features.f1Desc,
      badge: '100% Real Pattern',
      badgeBg: 'bg-blue-600 text-white font-black',
      gradient: 'from-blue-50/80 via-white to-cyan-50/40 dark:from-blue-950/30 dark:via-slate-900 dark:to-slate-900',
      borderColor: 'border-blue-200/80 hover:border-blue-400 dark:border-blue-800/80',
      iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-md shadow-blue-500/30 font-black',
    },
    {
      icon: BarChart3,
      title: t.features.f2Title,
      description: t.features.f2Desc,
      badge: 'Statewide Rank',
      badgeBg: 'bg-cyan-600 text-white font-bold',
      gradient: 'from-cyan-50/80 via-white to-blue-50/40 dark:from-cyan-950/30 dark:via-slate-900 dark:to-slate-900',
      borderColor: 'border-cyan-200/80 hover:border-cyan-400 dark:border-cyan-800/80',
      iconBg: 'bg-gradient-to-br from-cyan-500 to-sky-600 text-white shadow-md shadow-cyan-500/30',
    },
    {
      icon: BookOpen,
      title: t.features.f3Title,
      description: t.features.f3Desc,
      badge: '10,000+ MCQs',
      badgeBg: 'bg-indigo-600 text-white font-bold',
      gradient: 'from-indigo-50/80 via-white to-purple-50/40 dark:from-indigo-950/30 dark:via-slate-900 dark:to-slate-900',
      borderColor: 'border-indigo-200/80 hover:border-indigo-400 dark:border-indigo-800/80',
      iconBg: 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/30',
    },
    {
      icon: Trophy,
      title: t.features.f4Title,
      description: t.features.f4Desc,
      badge: 'District Benchmark',
      badgeBg: 'bg-purple-600 text-white font-bold',
      gradient: 'from-purple-50/80 via-white to-indigo-50/40 dark:from-purple-950/30 dark:via-slate-900 dark:to-slate-900',
      borderColor: 'border-purple-200/80 hover:border-purple-400 dark:border-purple-800/80',
      iconBg: 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/30',
    },
    {
      icon: Zap,
      title: t.features.f5Title,
      description: t.features.f5Desc,
      badge: '10-Min Sets',
      badgeBg: 'bg-blue-500 text-white font-bold',
      gradient: 'from-blue-50/80 via-white to-indigo-50/40 dark:from-blue-950/30 dark:via-slate-900 dark:to-slate-900',
      borderColor: 'border-blue-200/80 hover:border-blue-400 dark:border-blue-800/80',
      iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-500/30',
    },
    {
      icon: CheckCircle2,
      title: t.features.f6Title,
      description: t.features.f6Desc,
      badge: 'Step-by-Step',
      badgeBg: 'bg-emerald-600 text-white font-bold',
      gradient: 'from-emerald-50/80 via-white to-teal-50/40 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900',
      borderColor: 'border-emerald-200/80 hover:border-emerald-400 dark:border-emerald-800/80',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 border-b border-slate-200/60 dark:border-slate-800">
        <FloatingParticles variant="hero" count={14} />
        
        <div className="absolute top-10 left-1/4 w-[600px] h-[400px] bg-gradient-to-tr from-blue-400/20 via-cyan-500/15 to-transparent rounded-full blur-[120px] pointer-events-none -z-10 mesh-gradient-1" />
        <div className="absolute top-20 right-1/4 w-[500px] h-[350px] bg-gradient-to-bl from-blue-300/10 via-purple-500/10 to-transparent rounded-full blur-[100px] pointer-events-none -z-10 mesh-gradient-2" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-gradient-to-t from-blue-400/10 to-transparent rounded-full blur-[80px] pointer-events-none -z-10" />
        
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-gradient-to-tr from-blue-400/20 via-cyan-400/15 to-indigo-500/10 rounded-full blur-[130px] pointer-events-none -z-10" />
        <div className="absolute top-40 right-10 w-[300px] h-[300px] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border-2 border-amber-400/60 bg-amber-400/15 text-white text-xs sm:text-sm font-black shadow-lg shadow-amber-500/15 mb-6 group cursor-pointer hover:scale-105 transition-all duration-300 animate-float">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-400 text-blue-950 shadow-md">
                <Trophy className="h-4 w-4 stroke-[2.5]" />
              </div>
              <span className="bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider">
                2026 Pattern
              </span>
              <span>{t.hero.badge}</span>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs font-bold text-blue-200 mb-4">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 live-dot" />
              <span>2,340+ students preparing right now</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.12] text-white">
              {t.hero.title1}{' '}
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent animate-gradient-text">
                {t.hero.title2}
              </span>
              <br />
              {t.hero.title3}
            </h1>

            {/* Primary Action Buttons placed directly below Perform */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
              <Button size="xl" asChild className="gap-2 font-extrabold text-base bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 shadow-lg shadow-amber-500/25 border-none animate-glow-pulse">
                <Link href="/register">
                  {t.hero.startFree}
                  <ArrowRight className="h-5 w-5 stroke-[2.5]" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild className="font-bold text-base border-2 border-white/40 text-white hover:bg-white/10">
                <Link href="/exams">{t.hero.browseCategories}</Link>
              </Button>
            </div>

            <p className="text-base sm:text-lg text-blue-100/90 mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
              {t.hero.subtitle}
            </p>

            <div className="max-w-2xl mx-auto p-2 rounded-2xl bg-white dark:bg-slate-900 border-2 border-blue-400/40 shadow-xl shadow-blue-500/10 flex items-center gap-2 gradient-border">
              <Search className="h-5 w-5 text-blue-400 ml-3 shrink-0" />
              <Input placeholder={t.hero.searchPlaceholder} className="border-none shadow-none focus-visible:ring-0 text-sm font-medium dark:text-white" />
              <Button size="default" className="font-bold bg-blue-600 hover:bg-blue-700 text-white shrink-0 h-10 px-5 shadow-sm" asChild>
                <Link href="/exams">{t.hero.findExam}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <LiveTicker />

      {/* Active Stats Bar */}
      <section className="py-6 bg-blue-50/60 dark:bg-slate-900/50 border-y border-blue-100/60 dark:border-slate-800">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const { target, suffix } = parseStatValue(stat.value);
              return (
                <ScrollReveal key={stat.label} delay={index * 100}>
                  <div className={`flex items-center gap-3 p-4 rounded-2xl glass-card ${stat.cardBg} ${stat.borderColor} shadow-sm hover:shadow-lg hover:scale-[1.03] transition-all duration-300`}>
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg} shrink-0`}>
                      <Icon className="h-5.5 w-5.5 stroke-[2.5]" />
                    </div>
                    <div>
                      <p className={`text-2xl sm:text-3xl font-black tracking-tight ${stat.textColor}`}>
                        <AnimatedCounter target={target} suffix={suffix} />
                      </p>
                      <p className={`text-[11px] ${stat.labelColor} leading-tight`}>{getStatLabel(stat.label)}</p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 🔥 Hot & Trending Mock Tests (Auto-moving Carousel Slider) */}
      <ScrollReveal>
        <TrendingCarousel />
      </ScrollReveal>

      {/* Vibrant 7 Exam Categories */}
      <section className="py-20 md:py-24 bg-blue-50/30 dark:bg-slate-950/40 dot-grid-bg">
        <div className="container">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <Badge variant="outline" className="mb-3 px-3 py-1 font-semibold text-blue-600 border-blue-300 bg-blue-50 dark:bg-blue-950/40">
                {t.categories.badge}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">{t.categories.title}</h2>
              <p className="text-slate-600 dark:text-slate-400 text-base">{t.categories.subtitle}</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examCategories.map((cat, index) => {
              const CategoryIcon = cat.icon;
              return (
                <ScrollReveal key={cat.name} delay={index * 100}>
                  <Link href="/exams" className="group">
                    <Card className={`card-hover cursor-pointer border-2 ${cat.borderColor} bg-gradient-to-br ${cat.gradient} h-full shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden relative`}>
                      <CardContent className="p-6 flex flex-col h-full justify-between gap-4">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${cat.iconBg} group-hover:scale-110 transition-transform`}>
                              <CategoryIcon className="h-6 w-6" />
                            </div>
                            {cat.badge && (
                              <span className={`text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-sm ${cat.badgeBg}`}>
                                {cat.badge}
                              </span>
                            )}
                          </div>
                          <h3 className="font-black text-xl mb-1 text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{cat.name}</h3>
                          <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">{cat.subtitle}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">{cat.description}</p>
                        </div>

                        <div className="flex items-center justify-between text-xs font-extrabold pt-3 border-t border-slate-200/80 dark:border-slate-800">
                          <span className="text-slate-500 font-bold bg-white/80 dark:bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-800">{cat.testsCount}</span>
                          <span className="flex items-center gap-1 text-white group-hover:translate-x-1 transition-transform bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-full shadow-sm">
                            {t.categories.browse} <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 🏆 Statewide Top Rankers Spotlight Carousel */}
      <ScrollReveal>
        <RankersCarousel />
      </ScrollReveal>

      {/* Features Grid */}
      <section className="py-20 md:py-24 bg-blue-50/40 dark:bg-slate-950/60 border-y border-slate-200/60 dark:border-slate-800">
        <div className="container">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <Badge variant="outline" className="mb-3 px-3 py-1 font-semibold text-blue-600 border-blue-300 bg-blue-50 dark:bg-blue-950/40">
                {t.features.badge}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">{t.features.title}</h2>
              <p className="text-slate-600 dark:text-slate-400 text-base">{t.features.subtitle}</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <ScrollReveal key={feature.title} delay={index * 100}>
                  <div
                    className={`glass-card card-hover cursor-pointer p-6 rounded-2xl border-2 ${feature.borderColor} bg-gradient-to-br ${feature.gradient} shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden h-full`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${feature.iconBg} group-hover:scale-110 transition-transform`}>
                          <Icon className="h-6 w-6 stroke-[2.5]" />
                        </div>
                        <span className={`text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-sm ${feature.badgeBg}`}>
                          {feature.badge}
                        </span>
                      </div>

                      <h3 className="font-black text-xl mb-2 text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-24">
        <div className="container">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <Badge variant="outline" className="mb-3 px-3 py-1 font-semibold text-blue-600 border-blue-300 bg-blue-50 dark:bg-blue-950/40">
                {t.steps.badge}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">{t.steps.title}</h2>
              <p className="text-slate-600 dark:text-slate-400 text-base">{t.steps.subtitle}</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <ScrollReveal key={step.number} delay={i * 150}>
                <div
                  className={`card-hover cursor-pointer p-6 rounded-2xl border-2 ${step.borderColor} bg-gradient-to-br ${step.gradient} shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${i < steps.length - 1 ? 'timeline-connector' : ''}`}
                >
                  <div>
                    <div className="flex items-center justify-between w-full mb-5">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${step.badgeBg} text-base group-hover:scale-110 group-hover:animate-step-pulse transition-transform`}>
                        {step.number}
                      </div>
                      {i < steps.length - 1 ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900/30 text-slate-800 dark:text-slate-200 text-[11px] font-extrabold shadow-sm">
                          <span>Step {i + 2}</span>
                          <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-black shadow-sm">
                          <span>Ready</span>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-black text-xl mb-2 text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container"><hr className="section-divider" /></div>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <ScrollReveal direction="scale">
          <div className="container">
            <div className="rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 border border-blue-700/50 p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
              <FloatingParticles variant="cta" count={8} colors={['rgba(59,130,246,0.2)', 'rgba(245,158,11,0.15)', 'rgba(14,165,233,0.15)']} />
              
              <div className="absolute top-8 left-[15%] w-2 h-2 bg-amber-400 rounded-full animate-sparkle" style={{animationDelay: '0s'}} />
              <div className="absolute top-16 right-[20%] w-1.5 h-1.5 bg-blue-400 rounded-full animate-sparkle" style={{animationDelay: '0.7s'}} />
              <div className="absolute bottom-12 left-[25%] w-2 h-2 bg-cyan-400 rounded-full animate-sparkle" style={{animationDelay: '1.4s'}} />
              <div className="absolute bottom-20 right-[30%] w-1 h-1 bg-amber-300 rounded-full animate-sparkle" style={{animationDelay: '0.3s'}} />

              <div className="relative z-10 max-w-3xl mx-auto">
                <Badge variant="outline" className="mb-4 text-amber-400 border-amber-400/40 bg-amber-400/10 px-3.5 py-1 text-xs font-extrabold">
                  {t.cta.badge}
                </Badge>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
                  {t.cta.title}
                </h2>
                <p className="text-blue-200 text-base md:text-lg mb-6 leading-relaxed">
                  {t.cta.subtitle}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-8 text-xs sm:text-sm font-bold text-slate-300">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <CheckCircle2 className="h-4 w-4" /> Instant Free Mock Access
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" /> Bengali & English Language
                  </span>
                  <span className="flex items-center gap-1.5 text-blue-400">
                    <CheckCircle2 className="h-4 w-4" /> TCS Real Exam Timer
                  </span>
                  <span className="flex items-center gap-1.5 text-purple-400">
                    <CheckCircle2 className="h-4 w-4" /> Live District Leaderboard
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="xl" asChild className="gap-2 font-black text-base bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 shadow-lg shadow-amber-500/25 border-none h-12 px-8">
                    <Link href="/register">{t.cta.btn}</Link>
                  </Button>
                  <Button size="xl" variant="outline" asChild className="border-blue-400/40 text-white hover:bg-blue-800 font-extrabold h-12 px-6">
                    <Link href="/exams">{t.hero.browseCategories}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}

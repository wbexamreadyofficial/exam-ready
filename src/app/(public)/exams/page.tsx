import type { Metadata } from 'next';
import { Search, Clock, BookOpen, Trophy, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Competitive Test Series — Exam Ready',
  description:
    'Attempt authentic mock exams for WB Constable, WB SI, WB Food Inspector, WB Health, PSC Clerkship, PSC Miscellaneous, and Primary Teacher TET.',
};

const EXAM_CATEGORIES = [
  'All Exams',
  'WB Constable',
  'WB SI',
  'WB Food Inspector',
  'WB Health',
  'PSC Clerkship',
  'PSC Miscellaneous',
  'Primary Teacher TET',
];

const MOCK_EXAMS = [
  {
    id: '1',
    title: 'WB Constable Full Length Practice Mock #1',
    category: 'WB Constable',
    questions: 85,
    duration: 60,
    marks: 85,
    negativeMark: 0.25,
    difficulty: 'MEDIUM',
    attempts: 14200,
    isPaid: false,
    testType: 'Full Mock',
    language: 'Bengali & English',
  },
  {
    id: '2',
    title: 'WB SI Preliminary Comprehensive Mock Exam',
    category: 'WB SI',
    questions: 100,
    duration: 90,
    marks: 200,
    negativeMark: 0.5,
    difficulty: 'HARD',
    attempts: 11800,
    isPaid: false,
    testType: 'Prelims Mock',
    language: 'Bengali & English',
  },
  {
    id: '3',
    title: 'WB Food Inspector Special Practice Test',
    category: 'WB Food Inspector',
    questions: 100,
    duration: 90,
    marks: 100,
    negativeMark: 0.33,
    difficulty: 'MEDIUM',
    attempts: 18500,
    isPaid: false,
    testType: 'Special Practice',
    language: 'Bengali & English',
  },
  {
    id: '4',
    title: 'WB Health GNM/ANM & Staff Nurse Mock',
    category: 'WB Health',
    questions: 100,
    duration: 90,
    marks: 100,
    negativeMark: 0.25,
    difficulty: 'EASY',
    attempts: 9400,
    isPaid: false,
    testType: 'Subject Special',
    language: 'Bengali & English',
  },
  {
    id: '5',
    title: 'PSC Clerkship Part-1 Grand Mock Test',
    category: 'PSC Clerkship',
    questions: 100,
    duration: 90,
    marks: 100,
    negativeMark: 0.25,
    difficulty: 'MEDIUM',
    attempts: 21000,
    isPaid: true,
    testType: 'Grand Mock',
    language: 'Bengali & English',
  },
  {
    id: '6',
    title: 'PSC Miscellaneous Prelims Full Test',
    category: 'PSC Miscellaneous',
    questions: 100,
    duration: 90,
    marks: 200,
    negativeMark: 0.5,
    difficulty: 'HARD',
    attempts: 8700,
    isPaid: false,
    testType: 'Prelims Test',
    language: 'Bengali & English',
  },
  {
    id: '7',
    title: 'Primary Teacher TET Complete Mock Paper',
    category: 'Primary Teacher TET',
    questions: 150,
    duration: 150,
    marks: 150,
    negativeMark: 0,
    difficulty: 'MEDIUM',
    attempts: 16300,
    isPaid: false,
    testType: 'Full Length Paper',
    language: 'Bengali & English',
  },
];

const difficultyVariant: Record<string, 'success' | 'warning' | 'destructive'> = {
  EASY: 'success',
  MEDIUM: 'warning',
  HARD: 'destructive',
};

export default function ExamsPage() {
  return (
    <div className="container py-8 max-w-6xl">
      {/* Header Banner */}
      <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden shadow-lg border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs mb-2 border border-amber-500/30">
              <Sparkles className="h-3.5 w-3.5" /> Exam Ready Pass Pro Series 2026
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-1">Competitive Test Series</h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Official exam pattern test papers with instant TCS-style timer, negative marking calculator, and statewide candidate leaderboard rank.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button size="sm" className="font-extrabold bg-amber-500 hover:bg-amber-600 text-slate-950 gap-1 shadow-md" asChild>
              <Link href="/subscriptions">
                <Award className="h-4 w-4" /> Get Pass Pro Pass
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Category Quick Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {EXAM_CATEGORIES.map((cat, i) => (
          <button
            key={cat}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              i === 0
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-muted-foreground)]" />
        <Input placeholder="Search mock tests by title or category..." className="pl-9 h-10 text-sm" id="exam-search" />
      </div>

      {/* Test Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_EXAMS.map((exam) => (
          <Card key={exam.id} className="card-hover border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <CardContent className="p-4 flex flex-col h-full justify-between gap-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-[10px] px-2 py-0.5 font-bold">
                    <ShieldCheck className="h-3 w-3 text-amber-500 mr-1" />
                    {exam.category}
                  </Badge>
                  <div className="flex items-center gap-1.5">
                    {exam.isPaid && <Badge variant="default" className="text-[9px] px-1.5 py-0 bg-amber-500 text-slate-950 font-bold">PRO PASS</Badge>}
                    <Badge variant={difficultyVariant[exam.difficulty]} className="text-[9px] px-1.5 py-0">{exam.difficulty}</Badge>
                  </div>
                </div>

                <h3 className="font-bold text-sm leading-snug mb-2 text-slate-900 dark:text-white line-clamp-2">{exam.title}</h3>

                <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-3 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5 text-amber-500" />{exam.questions} Qs ({exam.marks} Marks)</div>
                  <div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-blue-500" />{exam.duration} min</div>
                  <div className="flex items-center gap-1"><Trophy className="h-3.5 w-3.5 text-purple-500" />{exam.attempts.toLocaleString()} Candidates</div>
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><CheckCircle2 className="h-3.5 w-3.5" />{exam.language}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500">{exam.testType}</span>
                <Button size="sm" className="font-bold text-xs gap-1 h-8 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm" asChild>
                  <Link href={`/student/exam/${exam.id}/instructions`}>
                    Start Exam <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

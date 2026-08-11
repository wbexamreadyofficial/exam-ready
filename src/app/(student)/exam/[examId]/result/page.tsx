'use client';

import { use } from 'react';
import Link from 'next/link';
import { Trophy, CheckCircle2, XCircle, MinusCircle, Clock, BarChart2, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const mockSubjectPerf = [
  { subject: 'General Studies', correct: 35, incorrect: 8, skipped: 7 },
  { subject: 'English', correct: 18, incorrect: 4, skipped: 3 },
  { subject: 'Mathematics', correct: 20, incorrect: 2, skipped: 3 },
];

export default function ExamResultPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = use(params);

  const result = {
    examTitle: 'WBCS Preliminary Mock Examination 2026',
    totalQuestions: 100,
    attempted: 90,
    correct: 73,
    incorrect: 14,
    skipped: 10,
    totalMarks: 100,
    obtainedMarks: 69.5,
    percentage: 69.5,
    accuracy: 81.1,
    timeTaken: 4860, // in seconds (81 min)
    rank: 42,
    totalParticipants: 1250,
  };

  const isPassed = result.percentage >= 50;

  return (
    <div className="container max-w-4xl py-8">
      <div className="text-center mb-8">
        <Badge variant={isPassed ? 'success' : 'destructive'} className="mb-2 px-3 py-1 text-xs">
          {isPassed ? 'EXAM PASSED' : 'NEEDS IMPROVEMENT'}
        </Badge>
        <h1 className="text-3xl font-black mb-2">{result.examTitle}</h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">Submission Summary & Detailed Analytics</p>
      </div>

      {/* Main Score Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-[var(--color-primary)]/40 bg-[var(--color-primary)]/5">
          <CardContent className="p-5 text-center">
            <Trophy className="h-6 w-6 text-[var(--color-primary)] mx-auto mb-1" />
            <p className="text-3xl font-black">{result.obtainedMarks} <span className="text-xs text-[var(--color-muted-foreground)]">/ {result.totalMarks}</span></p>
            <p className="text-xs font-semibold text-[var(--color-muted-foreground)] mt-1">Obtained Marks</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-3xl font-black text-blue-600">{result.percentage}%</p>
            <p className="text-xs font-semibold text-[var(--color-muted-foreground)] mt-1">Overall Score</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-3xl font-black text-green-600">{result.accuracy}%</p>
            <p className="text-xs font-semibold text-[var(--color-muted-foreground)] mt-1">Accuracy Rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-3xl font-black text-purple-600">#{result.rank}</p>
            <p className="text-xs font-semibold text-[var(--color-muted-foreground)] mt-1">Rank ({result.totalParticipants} students)</p>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-[var(--color-primary)]" />
              Subject Performance
            </CardTitle>
            <CardDescription>Accuracy & Breakdown across subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={mockSubjectPerf}>
                <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="correct" fill="hsl(142, 71%, 45%)" name="Correct" stackId="a" />
                <Bar dataKey="incorrect" fill="hsl(0, 84%, 60%)" name="Incorrect" stackId="a" />
                <Bar dataKey="skipped" fill="hsl(215, 16%, 47%)" name="Skipped" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Attempt Metrics</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
                <CheckCircle2 className="h-4 w-4 text-green-600" /> Correct
              </span>
              <span className="font-bold">{result.correct}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
                <XCircle className="h-4 w-4 text-red-500" /> Incorrect
              </span>
              <span className="font-bold">{result.incorrect}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
                <MinusCircle className="h-4 w-4 text-gray-400" /> Unattempted
              </span>
              <span className="font-bold">{result.skipped}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
              <span className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
                <Clock className="h-4 w-4 text-[var(--color-primary)]" /> Time Taken
              </span>
              <span className="font-bold">{Math.floor(result.timeTaken / 60)} mins</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="outline" asChild size="lg">
          <Link href="/dashboard">Return to Dashboard</Link>
        </Button>
        <Button asChild size="lg" className="font-bold gap-2">
          <Link href={`/exams`}>Attempt Another Exam <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </div>
    </div>
  );
}

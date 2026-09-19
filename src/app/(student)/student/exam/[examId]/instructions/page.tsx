'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, BookOpen, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useExamDetail, useStartExam } from '@/hooks/useExam';
import { LoadingState } from '@/components/ui/loading-state';

export default function ExamInstructionsPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = use(params);
  const router = useRouter();
  const { data: examData, isLoading } = useExamDetail(examId);
  const startExam = useStartExam();

  const exam = examData ?? {
    id: examId,
    title: 'WBCS Preliminary Mock Exam 2026',
    category: 'WBCS',
    description: 'Comprehensive mock examination covering General Studies, English, and Mental Ability.',
    totalQuestions: 100,
    duration: 90,
    totalMarks: 100,
    negativeMarking: 0.25,
  };

  if (isLoading) return <LoadingState message="Loading exam details..." className="min-h-[60vh]" />;

  const rules = [
    `This examination contains ${exam.totalQuestions} multiple choice questions (MCQs).`,
    `Total duration allocated for this test is ${exam.duration} minutes.`,
    'Each correct answer carries 1.0 mark.',
    `Negative marking of ${exam.negativeMarking} mark applies for each wrong attempt.`,
    'You can navigate between questions and mark questions for review.',
    'The test will automatically submit when the timer reaches zero.',
    'Ensure stable internet connection before beginning the exam.',
  ];

  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-6">
        <Badge variant="secondary" className="mb-2">{exam.category}</Badge>
        <h1 className="text-2xl md:text-3xl font-black mb-2">{exam.title}</h1>
        <p className="text-[var(--color-muted-foreground)] text-sm">{exam.description}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Questions', value: exam.totalQuestions, icon: BookOpen },
          { label: 'Duration', value: `${exam.duration} min`, icon: Clock },
          { label: 'Total Marks', value: exam.totalMarks, icon: CheckCircle },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-4 flex flex-col items-center text-center gap-1">
                <Icon className="h-5 w-5 text-[var(--color-primary)] mb-1" />
                <p className="text-xl font-black">{s.value}</p>
                <p className="text-xs text-[var(--color-muted-foreground)]">{s.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="h-5 w-5 text-[var(--color-primary)]" />
            General Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2.5">
            {rules.map((rule, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--color-muted-foreground)]">
                <CheckCircle className="h-4 w-4 text-[var(--color-primary)] mt-0.5 shrink-0" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
        <Button
          className="flex-1 gap-2 font-bold"
          size="lg"
          onClick={() => startExam.mutate(examId)}
          loading={startExam.isPending}
        >
          Start Exam Now
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

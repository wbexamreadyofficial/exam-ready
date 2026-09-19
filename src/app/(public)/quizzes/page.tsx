import type { Metadata } from 'next';
import { Zap, BookOpen, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Daily Quizzes — Exam Ready',
  description: 'Sharpen your skills with daily, subject-wise, and topic-based quizzes.',
};

const MOCK_QUIZZES = [
  { id: '1', title: "Today's Daily GK & Current Affairs", type: 'DAILY', subject: 'General Awareness', questions: 10, duration: 10 },
  { id: '2', title: 'English Grammar & Spotting Errors', type: 'SUBJECT', subject: 'English Language', questions: 20, duration: 15 },
  { id: '3', title: 'Quantitative Aptitude — Percentages & Profit', type: 'TOPIC', subject: 'Mathematics', questions: 15, duration: 12 },
  { id: '4', title: 'General Science & Mental Ability', type: 'SUBJECT', subject: 'Science & Reasoning', questions: 25, duration: 20 },
  { id: '5', title: 'PSC Clerkship Rapid Fire Practice', type: 'PRACTICE', subject: 'Clerkship Special', questions: 20, duration: 15 },
  { id: '6', title: 'Police Constable Math & GK Quiz', type: 'DAILY', subject: 'Constable Special', questions: 15, duration: 10 },
];

export default function QuizzesPage() {
  return (
    <div className="container py-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-1">Practice Quizzes</h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Bite-sized practice sessions to maintain daily consistency and build subject proficiency.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_QUIZZES.map((quiz) => (
          <Card key={quiz.id} className="card-hover border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <CardContent className="p-4 flex flex-col h-full justify-between gap-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={quiz.type === 'DAILY' ? 'default' : 'secondary'} className="text-[10px] px-2 py-0.5 font-bold">
                    {quiz.type === 'DAILY' && <Zap className="h-3 w-3 mr-1 fill-amber-400 text-amber-500" />}
                    {quiz.type}
                  </Badge>
                  <span className="text-[11px] font-semibold text-[var(--color-muted-foreground)] truncate max-w-[140px]">{quiz.subject}</span>
                </div>

                <h3 className="font-bold text-sm leading-snug mb-2 text-slate-900 dark:text-white line-clamp-2">{quiz.title}</h3>

                <div className="flex items-center gap-3 text-xs text-[var(--color-muted-foreground)]">
                  <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5 text-amber-500" />{quiz.questions} Qs</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-blue-500" />{quiz.duration} mins</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500">Free Practice</span>
                <Button size="sm" className="font-bold text-xs gap-1 h-8 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm" asChild>
                  <Link href={`/student/quiz/${quiz.id}`}>
                    Start Quiz <ArrowRight className="h-3.5 w-3.5" />
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

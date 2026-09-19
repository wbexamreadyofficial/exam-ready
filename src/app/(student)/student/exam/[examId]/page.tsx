'use client';

import { use, useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Bookmark, BookmarkCheck, Trash2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useExamStore } from '@/store/examStore';
import { useExamQuestions, useSubmitExam } from '@/hooks/useExam';
import { useExamTimer } from '@/hooks/useTimer';
import { formatTimer, cn } from '@/lib/utils';
import { LoadingState } from '@/components/ui/loading-state';

const MOCK_QUESTIONS = [
  {
    id: 'q1',
    text: 'Which committee recommended the inclusion of Fundamental Duties in the Constitution of India?',
    type: 'MCQ' as const,
    difficulty: 'MEDIUM' as const,
    subjectId: 's1',
    marks: 1,
    negativeMarks: 0.25,
    createdAt: '',
    updatedAt: '',
    questionNumber: 1,
    examId: 'ex1',
    options: [
      { id: 'opt1', text: 'Swaran Singh Committee' },
      { id: 'opt2', text: 'Sarkaria Commission' },
      { id: 'opt3', text: 'Balwant Rai Mehta Committee' },
      { id: 'opt4', text: 'Verma Committee' },
    ],
  },
  {
    id: 'q2',
    text: 'Who was the first Governor-General of Bengal under the Regulating Act of 1773?',
    type: 'MCQ' as const,
    difficulty: 'EASY' as const,
    subjectId: 's1',
    marks: 1,
    negativeMarks: 0.25,
    createdAt: '',
    updatedAt: '',
    questionNumber: 2,
    examId: 'ex1',
    options: [
      { id: 'opt1', text: 'Lord Clive' },
      { id: 'opt2', text: 'Warren Hastings' },
      { id: 'opt3', text: 'Lord Cornwallis' },
      { id: 'opt4', text: 'Lord William Bentinck' },
    ],
  },
  {
    id: 'q3',
    text: 'The Sundarbans Mangrove forest in West Bengal has been declared a UNESCO World Heritage Site in which year?',
    type: 'MCQ' as const,
    difficulty: 'MEDIUM' as const,
    subjectId: 's2',
    marks: 1,
    negativeMarks: 0.25,
    createdAt: '',
    updatedAt: '',
    questionNumber: 3,
    examId: 'ex1',
    options: [
      { id: 'opt1', text: '1984' },
      { id: 'opt2', text: '1987' },
      { id: 'opt3', text: '1992' },
      { id: 'opt4', text: '1999' },
    ],
  },
];

function TimerDisplay({ seconds }: { seconds: number }) {
  const isWarning = seconds < 600;
  const isDanger = seconds < 300;
  return (
    <div className={cn('font-mono text-xl font-black px-4 py-1.5 rounded-lg', isDanger ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : isWarning ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-[var(--color-muted)] text-[var(--color-foreground)]')}>
      {formatTimer(seconds)}
    </div>
  );
}

export default function ExamPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = use(params);
  const router = useRouter();
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showPalette, setShowPalette] = useState(false);

  const {
    sessionId, currentQuestionIndex, answers, visited, marked,
    setCurrentQuestion, setAnswer, clearAnswer, markQuestion, unmarkQuestion,
    visitQuestion, setStatus, status, initSession
  } = useExamStore();

  const submitExam = useSubmitExam();

  useEffect(() => {
    if (!sessionId) {
      initSession('demo-session-id', examId, 5400); // 90 min fallback for live UI testing
    }
  }, [sessionId, examId, initSession]);

  const handleExpire = useCallback(() => {
    if (sessionId) {
      submitExam.mutate({ examId, sessionId, answers });
    }
  }, [examId, sessionId, answers, submitExam]);

  const { timeLeft } = useExamTimer(handleExpire);

  const { data: apiQuestions, isLoading } = useExamQuestions(examId, sessionId);
  const questions = apiQuestions && apiQuestions.length > 0 ? apiQuestions : MOCK_QUESTIONS;

  useEffect(() => {
    if (questions && questions[currentQuestionIndex]) {
      visitQuestion(questions[currentQuestionIndex].id);
    }
  }, [currentQuestionIndex, questions, visitQuestion]);

  if (isLoading) return <LoadingState message="Loading examination environment..." className="min-h-screen" />;

  const currentQ = questions[currentQuestionIndex] ?? questions[0];
  const totalQ = questions.length;
  const answeredCount = Object.keys(answers).length;
  const markedCount = marked.size;
  const isMarked = marked.has(currentQ.id);
  const selectedOption = answers[currentQ.id];

  const handleSelect = (optionId: string) => {
    if (selectedOption === optionId) clearAnswer(currentQ.id);
    else setAnswer(currentQ.id, optionId);
  };

  const handleSubmit = () => {
    setStatus('submitting');
    if (sessionId) {
      submitExam.mutate({ examId, sessionId, answers });
    } else {
      router.push(`/student/exam/${examId}/result`);
    }
  };

  const getQuestionStatus = (q: typeof questions[0]) => {
    const isCurrentQ = q.id === currentQ.id;
    if (isCurrentQ) return 'current';
    if (answers[q.id]) return 'answered';
    if (marked.has(q.id)) return 'marked';
    if (visited.has(q.id)) return 'visited';
    return 'not-visited';
  };

  const paletteColors: Record<string, string> = {
    current: 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)]',
    answered: 'bg-green-500 text-white',
    marked: 'bg-purple-500 text-white',
    visited: 'bg-red-400 text-white',
    'not-visited': 'bg-[var(--color-muted)] text-[var(--color-muted-foreground)]',
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
      {/* Exam Header */}
      <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur">
        <div className="container flex h-16 items-center gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold truncate">Live Mock Examination</h1>
            <Progress value={(currentQuestionIndex + 1) / totalQ * 100} className="h-1.5 mt-1 max-w-xs" />
          </div>
          <TimerDisplay seconds={timeLeft || 5400} />
          <Button variant="outline" size="sm" className="hidden lg:flex" onClick={() => setShowPalette(!showPalette)}>
            Question Palette
          </Button>
          <Button size="sm" variant="destructive" onClick={() => setShowSubmitDialog(true)} className="gap-1 font-bold">
            <Send className="h-3.5 w-3.5" /> Submit
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Main Exam Area */}
        <div className="flex-1 py-6">
          <div className="container max-w-3xl">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className="font-semibold">
                Question {currentQuestionIndex + 1} of {totalQ}
              </Badge>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-xs"
                  onClick={() => isMarked ? unmarkQuestion(currentQ.id) : markQuestion(currentQ.id)}
                >
                  {isMarked ? <BookmarkCheck className="h-4 w-4 text-purple-500" /> : <Bookmark className="h-4 w-4" />}
                  {isMarked ? 'Unmark' : 'Mark for Review'}
                </Button>
                {selectedOption && (
                  <Button variant="ghost" size="sm" className="gap-1 text-xs text-red-500" onClick={() => clearAnswer(currentQ.id)}>
                    <Trash2 className="h-3.5 w-3.5" /> Clear Answer
                  </Button>
                )}
              </div>
            </div>

            <Card className="mb-6 border-2 border-[var(--color-border)] shadow-elevated">
              <CardContent className="p-6">
                <p className="text-base md:text-lg font-semibold leading-relaxed mb-6">
                  {currentQ.text}
                </p>
                <div className="space-y-3">
                  {currentQ.options.map((option, i) => {
                    const optionLabels = ['A', 'B', 'C', 'D', 'E'];
                    const isSelected = selectedOption === option.id;
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleSelect(option.id)}
                        className={cn(
                          'w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-150 cursor-pointer',
                          isSelected
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 font-medium'
                            : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-muted)]/40'
                        )}
                        aria-pressed={isSelected}
                      >
                        <span className={cn('flex h-7 w-7 min-w-[1.75rem] items-center justify-center rounded-full text-xs font-bold', isSelected ? 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)]' : 'bg-[var(--color-muted)] text-[var(--color-muted-foreground)]')}>
                          {optionLabels[i]}
                        </span>
                        <span className="text-sm pt-0.5">{option.text}</span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <Button
                onClick={() => setCurrentQuestion(Math.min(totalQ - 1, currentQuestionIndex + 1))}
                disabled={currentQuestionIndex === totalQ - 1}
                className="gap-1 font-bold"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar Question Palette (Desktop) */}
        <aside className="hidden lg:flex w-72 border-l border-[var(--color-border)] bg-[var(--color-card)] flex-col">
          <div className="p-4 border-b border-[var(--color-border)]">
            <h2 className="font-bold text-sm mb-3">Question Palette</h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded-sm bg-green-500" /><span className="text-[var(--color-muted-foreground)]">Answered ({answeredCount})</span></div>
              <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded-sm bg-[var(--color-muted)]" /><span className="text-[var(--color-muted-foreground)]">Not Visited</span></div>
              <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded-sm bg-red-400" /><span className="text-[var(--color-muted-foreground)]">Visited</span></div>
              <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded-sm bg-purple-500" /><span className="text-[var(--color-muted-foreground)]">Marked ({markedCount})</span></div>
            </div>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, i) => {
                const st = getQuestionStatus(q);
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestion(i)}
                    className={cn('question-palette-btn', paletteColors[st])}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </aside>
      </div>

      {/* Confirmation Submit Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Examination?</DialogTitle>
            <DialogDescription>Check your attempt status before final submission.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-3 py-4">
            <div className="text-center p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
              <p className="text-2xl font-black text-green-600">{answeredCount}</p>
              <p className="text-xs text-[var(--color-muted-foreground)]">Answered</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-red-50 dark:bg-red-900/20">
              <p className="text-2xl font-black text-red-500">{totalQ - answeredCount}</p>
              <p className="text-xs text-[var(--color-muted-foreground)]">Unanswered</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20">
              <p className="text-2xl font-black text-purple-500">{markedCount}</p>
              <p className="text-xs text-[var(--color-muted-foreground)]">Marked</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>Return to Test</Button>
            <Button variant="destructive" onClick={handleSubmit} loading={status === 'submitting'} className="gap-1 font-bold">
              <Send className="h-4 w-4" /> Confirm Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

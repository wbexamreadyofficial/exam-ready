'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const MOCK_QUIZ_QUESTIONS = [
  {
    id: 'q1',
    text: 'Who was the founder of the Brahmo Samaj in Bengal?',
    options: [
      { id: 'opt1', text: 'Swami Vivekananda' },
      { id: 'opt2', text: 'Raja Ram Mohan Roy' },
      { id: 'opt3', text: 'Ishwar Chandra Vidyasagar' },
      { id: 'opt4', text: 'Rabindranath Tagore' },
    ],
    correctOptionId: 'opt2',
    explanation: 'Raja Ram Mohan Roy founded the Brahmo Sabha in 1828, which later became the Brahmo Samaj, aiming to reform Hindu society.',
  },
  {
    id: 'q2',
    text: 'In which year was the partition of Bengal revoked?',
    options: [
      { id: 'opt1', text: '1905' },
      { id: 'opt2', text: '1911' },
      { id: 'opt3', text: '1919' },
      { id: 'opt4', text: '1922' },
    ],
    correctOptionId: 'opt2',
    explanation: 'The partition of Bengal was revoked in 1911 by Lord Hardinge during the Delhi Durbar.',
  },
  {
    id: 'q3',
    text: 'Which district of West Bengal has the lowest literacy rate according to 2011 Census?',
    options: [
      { id: 'opt1', text: 'Purulia' },
      { id: 'opt2', text: 'Uttar Dinajpur' },
      { id: 'opt3', text: 'Malda' },
      { id: 'opt4', text: 'Bankura' },
    ],
    correctOptionId: 'opt2',
    explanation: 'Uttar Dinajpur had the lowest literacy rate (59.07%) in West Bengal as per Census 2011.',
  },
];

export default function QuizPage({ params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = use(params);
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const questions = MOCK_QUIZ_QUESTIONS;
  const currentQ = questions[currentIndex];
  const totalQ = questions.length;
  const selectedOption = selectedAnswers[currentQ.id];

  const handleSelect = (optionId: string) => {
    if (selectedOption) return; // Answered already
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: optionId }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentIndex < totalQ - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionId) score++;
    });
    return score;
  };

  if (isCompleted) {
    const score = calculateScore();
    const pct = Math.round((score / totalQ) * 100);
    return (
      <div className="container max-w-lg py-12 text-center">
        <Card className="p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] mx-auto mb-4">
            <Trophy className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-black mb-1">Quiz Completed!</h1>
          <p className="text-sm text-[var(--color-muted-foreground)] mb-6">Here is your rapid quiz performance</p>

          <div className="bg-[var(--color-muted)]/50 rounded-xl p-6 mb-6">
            <p className="text-4xl font-black text-[var(--color-primary)]">{score} / {totalQ}</p>
            <p className="text-sm font-semibold mt-1">{pct}% Accuracy</p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => { setSelectedAnswers({}); setCurrentIndex(0); setIsCompleted(false); }}>
              <RotateCcw className="h-4 w-4 mr-1" /> Retry
            </Button>
            <Button className="flex-1 font-bold" onClick={() => router.push('/quizzes')}>
              More Quizzes
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8">
      <div className="flex items-center justify-between mb-4">
        <Badge variant="secondary">Daily Quiz</Badge>
        <span className="text-xs font-semibold text-[var(--color-muted-foreground)]">Question {currentIndex + 1} of {totalQ}</span>
      </div>

      <Progress value={((currentIndex + 1) / totalQ) * 100} className="h-1.5 mb-6" />

      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-bold mb-6 leading-relaxed">{currentQ.text}</h2>

          <div className="space-y-3 mb-6">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOption === opt.id;
              const isCorrect = opt.id === currentQ.correctOptionId;
              let btnStyle = 'border-[var(--color-border)] hover:bg-[var(--color-muted)]/50';

              if (selectedOption) {
                if (isCorrect) btnStyle = 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-300 font-semibold';
                else if (isSelected) btnStyle = 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-300';
              }

              return (
                <button
                  key={opt.id}
                  disabled={!!selectedOption}
                  onClick={() => handleSelect(opt.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left text-sm transition-all ${btnStyle}`}
                >
                  <span>{opt.text}</span>
                  {selectedOption && isCorrect && <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />}
                  {selectedOption && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-500 shrink-0" />}
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-300 space-y-1">
              <p className="font-bold">Explanation:</p>
              <p>{currentQ.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedOption && (
        <Button className="w-full font-bold gap-1" size="lg" onClick={handleNext}>
          {currentIndex < totalQ - 1 ? 'Next Question' : 'View Results'}
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

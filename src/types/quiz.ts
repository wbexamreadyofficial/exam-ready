export type QuizType = 'DAILY' | 'SUBJECT' | 'TOPIC' | 'PRACTICE' | 'MOCK';

export interface Quiz {
  id: string;
  title: string;
  type: QuizType;
  description?: string;
  subjectId: string;
  subjectName: string;
  topicId?: string;
  totalQuestions: number;
  duration?: number;
  isPaid: boolean;
  createdAt: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  answers: Record<string, string>;
  score: number;
  totalMarks: number;
  accuracy: number;
  timeTaken: number;
  submittedAt: string;
}

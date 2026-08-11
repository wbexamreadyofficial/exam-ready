export type ExamStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';

export interface Subject {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface Exam {
  id: string;
  title: string;
  slug: string;
  description?: string;
  category: string;
  subject: Subject;
  totalQuestions: number;
  totalMarks: number;
  passingMarks: number;
  duration: number; // in minutes
  negativeMarking: number; // marks deducted per wrong answer
  status: ExamStatus;
  difficulty: DifficultyLevel;
  scheduledAt?: string;
  expiresAt?: string;
  isPaid: boolean;
  price?: number;
  tags?: string[];
  instructions?: string;
  createdAt: string;
  updatedAt: string;
  attemptCount?: number;
  averageScore?: number;
}

export interface ExamSession {
  sessionId: string;
  examId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  serverDuration: number; // seconds
  status: 'ACTIVE' | 'SUBMITTED' | 'EXPIRED';
}

export interface ExamListItem {
  id: string;
  title: string;
  category: string;
  subject: Pick<Subject, 'id' | 'name'>;
  totalQuestions: number;
  duration: number;
  status: ExamStatus;
  difficulty: DifficultyLevel;
  attemptCount: number;
  isPaid: boolean;
  scheduledAt?: string;
}

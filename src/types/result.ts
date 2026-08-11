export interface SubjectPerformance {
  subjectId: string;
  subjectName: string;
  totalQuestions: number;
  correct: number;
  incorrect: number;
  skipped: number;
  marks: number;
  percentage: number;
}

export interface QuestionReview {
  questionId: string;
  questionText: string;
  questionImageUrl?: string;
  options: Array<{ id: string; text: string }>;
  selectedOptionId?: string;
  correctOptionId: string;
  explanation?: string;
  marks: number;
  isCorrect: boolean;
  isSkipped: boolean;
}

export interface ExamResult {
  id: string;
  examId: string;
  examTitle: string;
  userId: string;
  userName: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  skipped: number;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  accuracy: number;
  timeTaken: number;
  rank?: number;
  totalParticipants?: number;
  subjectPerformance: SubjectPerformance[];
  questionReview?: QuestionReview[];
  submittedAt: string;
}

export interface ResultListItem {
  id: string;
  examTitle: string;
  examCategory: string;
  obtainedMarks: number;
  totalMarks: number;
  percentage: number;
  rank?: number;
  submittedAt: string;
}

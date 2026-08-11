export type QuestionType = 'MCQ' | 'TRUE_FALSE' | 'FILL_IN_BLANK';
export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';

export interface Option {
  id: string;
  text: string;
  imageUrl?: string;
}

export interface Question {
  id: string;
  text: string;
  imageUrl?: string;
  type: QuestionType;
  options: Option[];
  correctOptionId?: string;
  explanation?: string;
  difficulty: DifficultyLevel;
  subjectId: string;
  topicId?: string;
  marks: number;
  negativeMarks: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ExamQuestion extends Question {
  questionNumber: number;
  examId: string;
}

export type QuestionStatus =
  | 'NOT_VISITED'
  | 'NOT_ANSWERED'
  | 'ANSWERED'
  | 'MARKED'
  | 'CURRENT';

export interface QuestionPaletteItem {
  id: string;
  number: number;
  status: QuestionStatus;
}

import { create } from 'zustand';

export type ExamSessionStatus = 'idle' | 'active' | 'submitting' | 'submitted';

interface ExamStore {
  sessionId: string | null;
  examId: string | null;
  currentQuestionIndex: number;
  answers: Record<string, string>;        // questionId -> selectedOptionId
  visited: Set<string>;                   // questionIds visited
  marked: Set<string>;                    // questionIds marked for review
  timeLeft: number;                       // seconds remaining
  status: ExamSessionStatus;
  startTime: Date | null;

  initSession: (sessionId: string, examId: string, durationSeconds: number) => void;
  setCurrentQuestion: (index: number) => void;
  setAnswer: (questionId: string, optionId: string) => void;
  clearAnswer: (questionId: string) => void;
  markQuestion: (questionId: string) => void;
  unmarkQuestion: (questionId: string) => void;
  visitQuestion: (questionId: string) => void;
  setTimeLeft: (seconds: number) => void;
  setStatus: (status: ExamSessionStatus) => void;
  resetSession: () => void;
}

const initialState = {
  sessionId: null,
  examId: null,
  currentQuestionIndex: 0,
  answers: {},
  visited: new Set<string>(),
  marked: new Set<string>(),
  timeLeft: 0,
  status: 'idle' as ExamSessionStatus,
  startTime: null,
};

export const useExamStore = create<ExamStore>()((set) => ({
  ...initialState,

  initSession: (sessionId, examId, durationSeconds) =>
    set({
      sessionId,
      examId,
      timeLeft: durationSeconds,
      status: 'active',
      startTime: new Date(),
      answers: {},
      visited: new Set(),
      marked: new Set(),
      currentQuestionIndex: 0,
    }),

  setCurrentQuestion: (index) =>
    set({ currentQuestionIndex: index }),

  setAnswer: (questionId, optionId) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: optionId },
    })),

  clearAnswer: (questionId) =>
    set((state) => {
      const answers = { ...state.answers };
      delete answers[questionId];
      return { answers };
    }),

  markQuestion: (questionId) =>
    set((state) => {
      const marked = new Set(state.marked);
      marked.add(questionId);
      return { marked };
    }),

  unmarkQuestion: (questionId) =>
    set((state) => {
      const marked = new Set(state.marked);
      marked.delete(questionId);
      return { marked };
    }),

  visitQuestion: (questionId) =>
    set((state) => {
      const visited = new Set(state.visited);
      visited.add(questionId);
      return { visited };
    }),

  setTimeLeft: (timeLeft) => set({ timeLeft }),
  setStatus: (status) => set({ status }),
  resetSession: () => set(initialState),
}));

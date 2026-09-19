export const EXAM_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  SCHEDULED: 'SCHEDULED',
  ARCHIVED: 'ARCHIVED',
} as const;

export const QUESTION_TYPE = {
  MCQ: 'MCQ',
  TRUE_FALSE: 'TRUE_FALSE',
  FILL_IN_BLANK: 'FILL_IN_BLANK',
} as const;

export const DIFFICULTY = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
} as const;

export const QUESTION_STATUS = {
  CURRENT: 'CURRENT',
  ANSWERED: 'ANSWERED',
  NOT_ANSWERED: 'NOT_ANSWERED',
  MARKED: 'MARKED',
  NOT_VISITED: 'NOT_VISITED',
} as const;

export const USER_ROLE = {
  STUDENT: 'STUDENT',
  ADMIN: 'ADMIN',
} as const;

export const QUIZ_TYPE = {
  DAILY: 'DAILY',
  SUBJECT: 'SUBJECT',
  TOPIC: 'TOPIC',
  PRACTICE: 'PRACTICE',
  MOCK: 'MOCK',
} as const;

export const FILE_TYPES = {
  IMAGE: 'image/*',
  PDF: 'application/pdf',
  VIDEO: 'video/*',
} as const;

export const MAX_FILE_SIZES = {
  IMAGE: 5 * 1024 * 1024,   // 5MB
  PDF: 20 * 1024 * 1024,    // 20MB
  VIDEO: 200 * 1024 * 1024, // 200MB
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
} as const;

export const TIMER_COLORS = {
  NORMAL: 'text-foreground',
  WARNING: 'text-yellow-600 dark:text-yellow-400',
  DANGER: 'text-red-600 dark:text-red-400',
} as const;

export const EXAM_CATEGORIES = [
  'WB Constable',
  'WB SI',
  'WB Food Inspector',
  'WB Health',
  'PSC Clerkship',
  'PSC Miscellaneous',
  'Primary Teacher TET',
] as const;

export const WB_EXAM_CATEGORIES = EXAM_CATEGORIES;

/** Soft, wide, blue-tinted layered shadow so cards read as floating. */
export const ELEVATED_CARD =
  'shadow-[0_1px_2px_rgba(30,64,110,0.05),0_6px_16px_-2px_rgba(30,64,110,0.08),0_16px_40px_-8px_rgba(30,64,110,0.16)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.4),0_10px_24px_-4px_rgba(0,0,0,0.6),0_20px_40px_-8px_rgba(0,0,0,0.5)]';

/** Same soft blue-tinted shadow as ELEVATED_CARD, cast toward the content from a fixed edge. */
export const ELEVATED_EDGE_RIGHT =
  'shadow-[6px_0_24px_-6px_rgba(30,64,110,0.16),2px_0_6px_rgba(30,64,110,0.05)] dark:shadow-[8px_0_24px_-6px_rgba(0,0,0,0.6)]';
export const ELEVATED_EDGE_BOTTOM =
  'shadow-[0_6px_24px_-6px_rgba(30,64,110,0.16),0_2px_6px_rgba(30,64,110,0.05)] dark:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.6)]';

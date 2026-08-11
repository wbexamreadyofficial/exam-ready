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

/*
  Static sample data for the /analytics dashboard. Nothing here is fetched —
  this route is additive UI scaffolding, not wired to the real APIs that
  /dashboard already uses (usersApi, resultsApi, leaderboardApi).
*/

export type TrendRange = '7d' | '30d' | '3m' | 'all';

export interface TrendPoint {
  label: string;
  score: number;
}

export interface SubjectSlice {
  name: string;
  value: number;
  color: string;
}

export interface PrepCard {
  id: string;
  status: 'in-progress' | 'attempt-again' | 'recommended' | 'new';
  title: string;
  category: string;
  questions: number;
  durationMin: number;
  /** 0–100 when in-progress; last score % when attempt-again */
  progress?: number;
}

export interface RecommendedTopic {
  id: string;
  icon: 'target' | 'brain' | 'globe' | 'book';
  topic: string;
  testCount: number;
}

export interface LeaderboardRow {
  id: string;
  name: string;
  avatarInitials: string;
  score: number;
  isCurrentUser?: boolean;
}

export const STATUS_META: Record<
  PrepCard['status'],
  { label: string; bg: string; fg: string }
> = {
  'in-progress': { label: 'In Progress', bg: 'bg-blue-50 dark:bg-blue-950/40', fg: 'text-blue-700 dark:text-blue-400' },
  'attempt-again': { label: 'Attempt Again', bg: 'bg-orange-50 dark:bg-orange-950/40', fg: 'text-orange-700 dark:text-orange-400' },
  recommended: { label: 'Recommended', bg: 'bg-green-50 dark:bg-green-950/40', fg: 'text-green-700 dark:text-green-400' },
  new: { label: 'New', bg: 'bg-purple-50 dark:bg-purple-950/40', fg: 'text-purple-700 dark:text-purple-400' },
};

/* ── Score trend, one series per range ── */
export const TREND_DATA: Record<TrendRange, TrendPoint[]> = {
  '7d': [
    { label: 'Mon', score: 68 }, { label: 'Tue', score: 71 }, { label: 'Wed', score: 69 },
    { label: 'Thu', score: 74 }, { label: 'Fri', score: 78 }, { label: 'Sat', score: 76 },
    { label: 'Sun', score: 82 },
  ],
  '30d': [
    { label: 'W1', score: 58 }, { label: 'W2', score: 64 }, { label: 'W3', score: 69 },
    { label: 'W4', score: 75 }, { label: 'W5', score: 82 },
  ],
  '3m': [
    { label: 'Jun', score: 52 }, { label: 'Jul', score: 61 }, { label: 'Aug', score: 68 },
    { label: 'Sep', score: 75 }, { label: 'Oct', score: 82 },
  ],
  all: [
    { label: 'Mar', score: 41 }, { label: 'Apr', score: 48 }, { label: 'May', score: 55 },
    { label: 'Jun', score: 52 }, { label: 'Jul', score: 61 }, { label: 'Aug', score: 68 },
    { label: 'Sep', score: 75 }, { label: 'Oct', score: 82 },
  ],
};

export const SUBJECT_DATA: SubjectSlice[] = [
  { name: 'Quantitative Aptitude', value: 32, color: 'var(--color-series-1)' },
  { name: 'Reasoning Ability', value: 26, color: 'var(--color-series-2)' },
  { name: 'English Language', value: 22, color: 'var(--color-series-3)' },
  { name: 'General Awareness', value: 20, color: 'var(--color-series-4)' },
];

export const PREP_CARDS: PrepCard[] = [
  { id: 'p1', status: 'in-progress', title: 'WBCS Prelims Full Mock 12', category: 'WBCS', questions: 100, durationMin: 120, progress: 64 },
  { id: 'p2', status: 'attempt-again', title: 'Quantitative Aptitude Set 6', category: 'SSC CGL', questions: 40, durationMin: 45, progress: 58 },
  { id: 'p3', status: 'recommended', title: 'Reasoning Speed Drill', category: 'Banking', questions: 30, durationMin: 30 },
  { id: 'p4', status: 'new', title: 'General Awareness — Oct 2026', category: 'Current Affairs', questions: 50, durationMin: 40 },
  { id: 'p5', status: 'recommended', title: 'English Grammar Booster', category: 'All Exams', questions: 35, durationMin: 35 },
];

export const RECOMMENDED_TOPICS: RecommendedTopic[] = [
  { id: 'r1', icon: 'target', topic: 'Data Interpretation', testCount: 18 },
  { id: 'r2', icon: 'brain', topic: 'Logical Reasoning', testCount: 24 },
  { id: 'r3', icon: 'globe', topic: 'Static GK', testCount: 32 },
  { id: 'r4', icon: 'book', topic: 'Reading Comprehension', testCount: 15 },
];

export const LEADERBOARD: Record<'weekly' | 'monthly' | 'alltime', LeaderboardRow[]> = {
  weekly: [
    { id: 'u1', name: 'Ananya Roy', avatarInitials: 'AR', score: 968 },
    { id: 'u2', name: 'Sourav Das', avatarInitials: 'SD', score: 941 },
    { id: 'u3', name: 'Priya Sen', avatarInitials: 'PS', score: 918 },
    { id: 'u4', name: 'You', avatarInitials: 'YO', score: 842, isCurrentUser: true },
    { id: 'u5', name: 'Rahul Ghosh', avatarInitials: 'RG', score: 811 },
  ],
  monthly: [
    { id: 'u2', name: 'Sourav Das', avatarInitials: 'SD', score: 3820 },
    { id: 'u1', name: 'Ananya Roy', avatarInitials: 'AR', score: 3705 },
    { id: 'u6', name: 'Ishita Paul', avatarInitials: 'IP', score: 3612 },
    { id: 'u7', name: 'Arjun Nair', avatarInitials: 'AN', score: 3488 },
    { id: 'u4', name: 'You', avatarInitials: 'YO', score: 3105, isCurrentUser: true },
  ],
  alltime: [
    { id: 'u1', name: 'Ananya Roy', avatarInitials: 'AR', score: 24810 },
    { id: 'u2', name: 'Sourav Das', avatarInitials: 'SD', score: 23940 },
    { id: 'u6', name: 'Ishita Paul', avatarInitials: 'IP', score: 21770 },
    { id: 'u4', name: 'You', avatarInitials: 'YO', score: 18420, isCurrentUser: true },
    { id: 'u8', name: 'Kabir Sheikh', avatarInitials: 'KS', score: 17990 },
  ],
};

export const STREAK_DAYS = [
  { day: 'M', done: true }, { day: 'T', done: true }, { day: 'W', done: true },
  { day: 'T', done: true }, { day: 'F', done: false }, { day: 'S', done: false },
  { day: 'S', done: false },
];

export const STAT_TILES = [
  { key: 'attempted', label: 'Tests Attempted', value: '86', delta: '+12 this month' },
  { key: 'average', label: 'Average Score', value: '74%', delta: '+6% vs last month' },
  { key: 'best', label: 'Best Score', value: '96%', delta: 'Personal best' },
  { key: 'rank', label: 'Global Rank', value: '#842', delta: '▲ 118 this week' },
  { key: 'accuracy', label: 'Accuracy', value: '81%', delta: '+3% vs last month' },
] as const;

export const PERFORMANCE_BREAKDOWN = {
  correct: 62,
  incorrect: 14,
  attempted: 76, // correct + incorrect
  total: 100,
};

export const SUPPORTING_STATS = [
  { label: 'Total Study Time', value: '184h' },
  { label: 'Tests Taken', value: '86' },
  { label: 'Topics Practiced', value: '42' },
  { label: 'Accuracy', value: '81%' },
  { label: 'Best Score', value: '96%' },
];

/* Flip to true to preview the first-time / no-history empty state */
export const DASHBOARD_HAS_HISTORY = true;

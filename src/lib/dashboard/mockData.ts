// ═══════════════════════════════════════════════
// Mock data for the student analytics dashboard.
// Replace with real API calls once the backend is wired up.
// ═══════════════════════════════════════════════

/* ── Score Trend (line chart) ── */
export interface ScorePoint {
  date: string;
  score: number;
}

const generate7DayData = (): ScorePoint[] => [
  { date: 'Aug 16', score: 68 },
  { date: 'Aug 17', score: 72 },
  { date: 'Aug 18', score: 65 },
  { date: 'Aug 19', score: 78 },
  { date: 'Aug 20', score: 74 },
  { date: 'Aug 21', score: 81 },
  { date: 'Aug 22', score: 76 },
];

const generate30DayData = (): ScorePoint[] => [
  { date: 'Jul 24', score: 55 },
  { date: 'Jul 27', score: 58 },
  { date: 'Jul 30', score: 62 },
  { date: 'Aug 02', score: 60 },
  { date: 'Aug 05', score: 66 },
  { date: 'Aug 08', score: 64 },
  { date: 'Aug 11', score: 70 },
  { date: 'Aug 14', score: 72 },
  { date: 'Aug 17', score: 68 },
  { date: 'Aug 20', score: 78 },
  { date: 'Aug 22', score: 76 },
];

const generate3MonthData = (): ScorePoint[] => [
  { date: 'Jun 01', score: 42 },
  { date: 'Jun 10', score: 48 },
  { date: 'Jun 20', score: 52 },
  { date: 'Jul 01', score: 55 },
  { date: 'Jul 10', score: 58 },
  { date: 'Jul 20', score: 62 },
  { date: 'Aug 01', score: 66 },
  { date: 'Aug 10', score: 72 },
  { date: 'Aug 22', score: 76 },
];

const generateAllData = (): ScorePoint[] => [
  { date: 'Jan', score: 35 },
  { date: 'Feb', score: 42 },
  { date: 'Mar', score: 48 },
  { date: 'Apr', score: 52 },
  { date: 'May', score: 58 },
  { date: 'Jun', score: 62 },
  { date: 'Jul', score: 68 },
  { date: 'Aug', score: 76 },
];

export const scoreTrendData: Record<string, ScorePoint[]> = {
  '7d': generate7DayData(),
  '30d': generate30DayData(),
  '3m': generate3MonthData(),
  all: generateAllData(),
};

/* ── Subject-wise Performance (donut chart) ── */
export interface SubjectPerformance {
  name: string;
  value: number;
  color: string;
}

export const subjectPerformance: SubjectPerformance[] = [
  { name: 'Quantitative Aptitude', value: 32, color: 'var(--color-series-1)' },
  { name: 'Reasoning Ability', value: 28, color: 'var(--color-series-2)' },
  { name: 'English Language', value: 22, color: 'var(--color-series-3)' },
  { name: 'General Awareness', value: 18, color: 'var(--color-series-4)' },
];

/* ── Stat Tiles ── */
export interface DashboardStat {
  label: string;
  value: string;
  change: string;
  changePositive: boolean;
  icon: string; // lucide icon name — resolved in component
}

export const dashboardStats: DashboardStat[] = [
  { label: 'Tests Attempted', value: '47', change: '+5 this week', changePositive: true, icon: 'FileText' },
  { label: 'Average Score', value: '74.2%', change: '▲ 3.8%', changePositive: true, icon: 'BarChart3' },
  { label: 'Best Score', value: '96.5%', change: '▲ New PB!', changePositive: true, icon: 'Trophy' },
  { label: 'Global Rank', value: '#342', change: '▲ 28 spots', changePositive: true, icon: 'Globe' },
  { label: 'Accuracy', value: '81.4%', change: '▲ 2.1%', changePositive: true, icon: 'Target' },
];

/* ── Continue Preparation Cards ── */
export type TestCardStatus = 'in-progress' | 'attempt-again' | 'recommended' | 'new';

export interface TestCard {
  id: string;
  title: string;
  status: TestCardStatus;
  questionCount: number;
  duration: string;
  progress?: number;   // 0–100, for in-progress
  score?: number;       // percentage, for completed
  category: string;
}

export const testCards: TestCard[] = [
  {
    id: 't1',
    title: 'WB Constable Full Mock #5',
    status: 'in-progress',
    questionCount: 100,
    duration: '90 min',
    progress: 64,
    category: 'WB Constable',
  },
  {
    id: 't2',
    title: 'PSC Clerkship Practice Set #3',
    status: 'attempt-again',
    questionCount: 80,
    duration: '60 min',
    score: 62,
    category: 'PSC Clerkship',
  },
  {
    id: 't3',
    title: 'Reasoning Ability Sectional',
    status: 'recommended',
    questionCount: 40,
    duration: '30 min',
    category: 'Sectional',
  },
  {
    id: 't4',
    title: 'WB Food Inspector Mock #2',
    status: 'new',
    questionCount: 100,
    duration: '90 min',
    category: 'WB Food Inspector',
  },
  {
    id: 't5',
    title: 'English Language Speed Test',
    status: 'recommended',
    questionCount: 30,
    duration: '20 min',
    category: 'Sectional',
  },
  {
    id: 't6',
    title: 'Primary TET Full Practice',
    status: 'new',
    questionCount: 150,
    duration: '150 min',
    category: 'Primary TET',
  },
];

/* ── Performance Overview (right sidebar donut) ── */
export interface PerformanceBreakdown {
  label: string;
  value: number;
  color: string;
}

export const performanceOverview = {
  overallScore: 76,
  breakdown: [
    { label: 'Correct', value: 382, color: 'var(--color-data-positive)' },
    { label: 'Attempted', value: 470, color: 'var(--color-data-primary)' },
    { label: 'Incorrect', value: 88, color: 'var(--color-data-negative)' },
  ] as PerformanceBreakdown[],
};

/* ── Streak ── */
export type DayStatus = 'completed' | 'missed' | 'today';

export interface StreakData {
  count: number;
  days: { day: string; status: DayStatus }[];
}

export const streakData: StreakData = {
  count: 7,
  days: [
    { day: 'Mon', status: 'completed' },
    { day: 'Tue', status: 'completed' },
    { day: 'Wed', status: 'completed' },
    { day: 'Thu', status: 'completed' },
    { day: 'Fri', status: 'completed' },
    { day: 'Sat', status: 'completed' },
    { day: 'Sun', status: 'today' },
  ],
};

/* ── Daily Goal ── */
export const dailyGoal = {
  completed: 1,
  target: 2,
  label: 'tests today',
};

/* ── Leaderboard ── */
export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  avatar?: string;
  isCurrentUser?: boolean;
}

const generateLeaderboard = (): Record<string, LeaderboardEntry[]> => ({
  weekly: [
    { rank: 1, name: 'Priya Sharma', score: 2450 },
    { rank: 2, name: 'Rahul Das', score: 2380 },
    { rank: 3, name: 'Anita Roy', score: 2290 },
    { rank: 4, name: 'Suresh Kumar', score: 2210 },
    { rank: 5, name: 'Anindya Sarkar', score: 2180, isCurrentUser: true },
    { rank: 6, name: 'Meera Patel', score: 2100 },
    { rank: 7, name: 'Vikram Singh', score: 2040 },
  ],
  monthly: [
    { rank: 1, name: 'Rahul Das', score: 9850 },
    { rank: 2, name: 'Priya Sharma', score: 9720 },
    { rank: 3, name: 'Vikram Singh', score: 9510 },
    { rank: 4, name: 'Anindya Sarkar', score: 9340, isCurrentUser: true },
    { rank: 5, name: 'Anita Roy', score: 9180 },
    { rank: 6, name: 'Suresh Kumar', score: 8990 },
    { rank: 7, name: 'Meera Patel', score: 8820 },
  ],
  allTime: [
    { rank: 1, name: 'Vikram Singh', score: 48200 },
    { rank: 2, name: 'Priya Sharma', score: 46900 },
    { rank: 3, name: 'Rahul Das', score: 45100 },
    { rank: 4, name: 'Meera Patel', score: 44200 },
    { rank: 5, name: 'Suresh Kumar', score: 43800 },
    { rank: 6, name: 'Anindya Sarkar', score: 42600, isCurrentUser: true },
    { rank: 7, name: 'Anita Roy', score: 41900 },
  ],
});

export const leaderboardData = generateLeaderboard();

/* ── Recommended Topics ── */
export interface RecommendedTopic {
  id: string;
  name: string;
  testCount: number;
  icon: string; // lucide icon name
  color: string;
}

export const recommendedTopics: RecommendedTopic[] = [
  { id: 'r1', name: 'Number System', testCount: 12, icon: 'Calculator', color: 'var(--color-series-1)' },
  { id: 'r2', name: 'Syllogism', testCount: 8, icon: 'GitBranch', color: 'var(--color-series-2)' },
  { id: 'r3', name: 'Reading Comprehension', testCount: 10, icon: 'BookOpen', color: 'var(--color-series-3)' },
  { id: 'r4', name: 'Current Affairs', testCount: 15, icon: 'Newspaper', color: 'var(--color-series-4)' },
];

/* ── Top Exams ── */
export interface TopExam {
  id: string;
  name: string;
  icon: string;
}

export const topExams: TopExam[] = [
  { id: 'e1', name: 'WB Constable', icon: 'Shield' },
  { id: 'e2', name: 'PSC Clerkship', icon: 'FileCheck' },
  { id: 'e3', name: 'WB Food Inspector', icon: 'Utensils' },
  { id: 'e4', name: 'Primary TET', icon: 'GraduationCap' },
  { id: 'e5', name: 'WB SI', icon: 'BadgeCheck' },
];

/* ── Preparation Stats row ── */
export interface PrepStat {
  label: string;
  value: string;
  icon: string;
}

export const preparationStats: PrepStat[] = [
  { label: 'Total Study Time', value: '126h 30m', icon: 'Clock' },
  { label: 'Tests Taken', value: '47', icon: 'ClipboardList' },
  { label: 'Topics Practiced', value: '23', icon: 'Layers' },
  { label: 'Accuracy', value: '81.4%', icon: 'Target' },
  { label: 'Best Score', value: '96.5%', icon: 'Award' },
];

/* ── Plan Usage ── */
export const planData = {
  name: 'Free Plan',
  testsUsed: 12,
  testsTotal: 30,
  daysLeft: 18,
};

/* ── Sidebar Navigation ── */
export interface NavItem {
  label: string;
  icon: string;
  href: string;
  active?: boolean;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const sidebarNavGroups: NavGroup[] = [
  {
    title: '',
    items: [
      { label: 'Dashboard', icon: 'LayoutDashboard', href: '/dashboard', active: true },
    ],
  },
  {
    title: 'Practice',
    items: [
      { label: 'Mock Tests', icon: 'FileText', href: '/exams' },
      { label: 'Question Bank', icon: 'Database', href: '/questions' },
      { label: 'Previous Year', icon: 'History', href: '/previous-year' },
    ],
  },
  {
    title: 'Study',
    items: [
      { label: 'Bookmarks', icon: 'Bookmark', href: '/bookmarks' },
      { label: 'Notes', icon: 'StickyNote', href: '/notes' },
      { label: 'Formulas', icon: 'FunctionSquare', href: '/formulas' },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { label: 'Progress Report', icon: 'TrendingUp', href: '/progress' },
      { label: 'Leaderboard', icon: 'Medal', href: '/leaderboard' },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Profile', icon: 'User', href: '/profile' },
      { label: 'Help', icon: 'HelpCircle', href: '/help' },
    ],
  },
];

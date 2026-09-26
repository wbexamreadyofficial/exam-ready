import type { LucideIcon } from 'lucide-react';
import { BarChart3, BookOpen, Brain, ClipboardCheck, Timer, TrendingUp } from 'lucide-react';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  icon: LucideIcon;
  tone: 'orange' | 'blue';
  content: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'time-management-for-mock-tests',
    title: '5 time management tips for WBPSC mock tests',
    excerpt: 'The clock is often the real opponent in competitive exams. Here’s how to pace yourself across sections without losing accuracy.',
    category: 'Exam Strategy',
    author: 'Exam Ready Team',
    date: '2026-08-12',
    readTime: '5 min read',
    icon: Timer,
    tone: 'orange',
    content: [
      'Most candidates don’t lose marks because they don’t know the answer — they lose marks because they run out of time on a section they were fully capable of clearing. Time management is a skill you build the same way you build subject knowledge: through deliberate practice.',
      'Start every mock test by scanning the full paper for thirty seconds. Note which sections feel heaviest for you and decide, before you begin, roughly how many minutes each section deserves. This single habit prevents the common mistake of spending fifteen minutes on one stubborn question while five easier ones wait untouched.',
      'Use a two-pass approach. On your first pass, answer everything you’re confident about and mark anything that needs a second look. On your second pass, return to the marked questions with whatever time remains. This keeps your accuracy high on the questions you know, instead of trading them away for uncertain ones.',
      'Practice under the same negative marking rules as your actual exam. Guessing recklessly on a full mock test will show you, in black and white, exactly how much it costs you — which is a far more convincing lesson than being told to “be careful.”',
      'Finally, review your timing after every attempt, not just your score. Look at how long you spent per section versus how many marks you got there. Over a few attempts, a clear pattern of where your time actually goes will emerge — and that’s where your next practice session should focus.',
    ],
  },
  {
    slug: 'reading-pyq-solutions-the-right-way',
    title: 'How to read PYQ solutions the right way',
    excerpt: 'Previous year questions are only useful if you study the reasoning behind them, not just the final answer. Here’s a better way to review.',
    category: 'Study Method',
    author: 'Exam Ready Team',
    date: '2026-07-28',
    readTime: '4 min read',
    icon: BookOpen,
    tone: 'blue',
    content: [
      'It’s tempting to treat a previous year question paper like a checklist — read the question, glance at the answer, move on. That approach teaches you what the answer was, but not how to arrive at it under exam conditions.',
      'Before looking at any solution, attempt the question fully, exactly as you would in a real mock test. Write down your reasoning, not just your final choice. This is the only way to compare your thought process against the correct one, rather than just your final pick.',
      'When you do read the solution, pay attention to the elimination logic as much as the correct answer itself. Competitive exams are often won by ruling out three wrong options quickly, leaving you to verify only one — that skill matters as much as raw recall.',
      'Group PYQs by topic rather than by year. Solving ten questions on the same concept back-to-back reveals the recurring traps examiners set, in a way that solving one full mixed paper never quite does.',
      'Keep a short running note of mistakes that repeat across different years. If you keep missing the same type of question, that’s your highest-leverage revision topic — more valuable than re-reading a chapter you’re already comfortable with.',
    ],
  },
  {
    slug: 'building-a-daily-practice-routine',
    title: 'Building a daily practice routine that sticks',
    excerpt: 'Consistency beats intensity. A short daily habit will take you further than an occasional all-day study marathon.',
    category: 'Habits',
    author: 'Exam Ready Team',
    date: '2026-07-10',
    readTime: '6 min read',
    icon: TrendingUp,
    tone: 'orange',
    content: [
      'Long, irregular study sessions feel productive in the moment, but they’re hard to sustain over the months a real exam preparation journey takes. A short daily practice — even ten to fifteen minutes — compounds in a way that occasional long sessions simply don’t.',
      'Anchor your practice to an existing habit. Right after breakfast, right before you leave for work, right after your last class — attaching a new routine to something you already do daily removes the need to rely on willpower every single time.',
      'Track your streak, not just your scores. A visible daily streak turns practice into something you don’t want to break, which is a far stronger motivator on your low-energy days than the abstract goal of “improving your percentile.”',
      'Rotate what “practice” means day to day — a short quiz one day, reviewing yesterday’s mistakes the next, a timed topic-wise test the day after. Variety keeps the habit from feeling like a chore, while still covering everything you need.',
      'When you miss a day, the only rule that matters is: never miss two in a row. One missed day is a normal part of life; two is how habits quietly disappear.',
    ],
  },
  {
    slug: 'understanding-negative-marking',
    title: 'Understanding negative marking: a practical guide',
    excerpt: 'Negative marking changes the math of every question you attempt. Here’s how to decide when a guess is actually worth it.',
    category: 'Exam Strategy',
    author: 'Exam Ready Team',
    date: '2026-06-22',
    readTime: '5 min read',
    icon: ClipboardCheck,
    tone: 'blue',
    content: [
      'Negative marking turns every uncertain question into a small bet. If you can rule out even one or two of four options, the expected value of guessing among what’s left usually swings in your favour — but blind guessing across all four almost always costs you more than it earns.',
      'Work out the break-even point for your specific exam’s marking scheme before test day, not during it. Most WBPSC and SSC-pattern exams penalise roughly a quarter to a third of a mark per wrong answer — know your exact numbers so the decision becomes quick arithmetic, not a gut feeling under pressure.',
      'Practice this decision deliberately in your mock tests. After every attempt, look specifically at questions you guessed on: how many did you get right, and did the accuracy of your guessing hold up to the real cost of a wrong one?',
      'Some candidates do better with a stricter personal rule — for instance, only attempting a question if they can eliminate at least one option. Your ideal threshold depends on your own guessing accuracy, which only shows up clearly after several timed attempts.',
      'The goal isn’t to eliminate risk entirely. It’s to make sure every risk you take is one you’ve actually calculated, instead of one you made in the last thirty seconds of the exam.',
    ],
  },
  {
    slug: 'when-to-upgrade-your-plan',
    title: 'From Free Starter to WB Exam Pass: when to upgrade',
    excerpt: 'Free practice is a great place to start. Here’s how to tell when it’s time to unlock the full mock test library.',
    category: 'Getting Started',
    author: 'Exam Ready Team',
    date: '2026-06-05',
    readTime: '3 min read',
    icon: BarChart3,
    tone: 'orange',
    content: [
      'Free Starter exists so you can get a real feel for exam patterns, timing, and the platform itself before committing to anything. Most candidates spend their first one to two weeks here, and that’s exactly how it should be used.',
      'The clearest sign it’s time to upgrade is running out of fresh mock tests for your target exam. Repeating the same twenty tests eventually teaches you the questions rather than the skill — at that point, the value of a wider test bank becomes obvious.',
      'A second sign is wanting subject-wise analytics. Free Starter shows you an overall score; WB Exam Pass breaks that down by topic, which is where most candidates find their actual revision priorities hiding.',
      'If your exam date is more than a couple of months away, the 1-Year Unlimited Pass usually works out cheaper than repeated shorter renewals, and removes the small but real friction of deciding whether to renew mid-preparation.',
      'There’s no wrong order here — some candidates upgrade in their first week because they know their exam is close, others take a full month on the free tier. Let your own test-taking pace decide, not a calendar.',
    ],
  },
  {
    slug: 'reading-your-mock-test-analytics',
    title: 'What your mock test analytics are really telling you',
    excerpt: 'A single score hides more than it reveals. Here’s how to read subject-wise analytics like a coach, not just a scoreboard.',
    category: 'Study Method',
    author: 'Exam Ready Team',
    date: '2026-05-18',
    readTime: '5 min read',
    icon: Brain,
    tone: 'blue',
    content: [
      'Two candidates can score the exact same percentage on a mock test for completely different reasons — one ran out of time on an easy section, the other genuinely doesn’t know a topic. Your overall score can’t tell these apart; your analytics can.',
      'Start with accuracy versus attempt rate per subject. A subject with low accuracy but high attempts suggests a knowledge gap. A subject with high accuracy but low attempts suggests a pacing problem, not a knowledge one — and those two need completely different fixes.',
      'Look at your performance trend across your last five to ten attempts, not just your most recent one. A single bad mock test is noise; a consistent decline in one subject over several attempts is a signal worth acting on.',
      'Compare your time-per-question against the exam’s average pace, section by section. If you’re well within the time limit on a subject where your accuracy is still low, more practice questions will help. If you’re constantly over time, drilling speed matters more than drilling difficulty.',
      'Revisit your analytics right before choosing your next practice set. Letting the data — not just how a topic “feels” — decide what you study next is the single biggest shift between casual practice and deliberate preparation.',
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

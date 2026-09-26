import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Check, Clock3, GraduationCap, Languages, ListChecks, ShieldCheck, Sparkles, Target, TrendingUp, Utensils } from 'lucide-react';
import { CourseCatalogVisual } from '@/components/courses/CourseCatalogVisual';
import { CoursesExperience } from '@/components/courses/CoursesExperience';
import { FaqAccordion } from '@/components/courses/FaqAccordion';
import { HomeAmbient } from '@/components/home/HomeAmbient';
import styles from '@/components/courses/courses.module.css';
import { env } from '@/config/env';

export const metadata: Metadata = {
  title: 'Courses',
  description: 'Find your focus with exam-specific practice courses. Explore mock tests for West Bengal exams, practise in your language, and build confidence one attempt at a time.',
};
export const revalidate = 300;

type ExamLanguage = 'EN' | 'BN' | 'BILINGUAL';
interface CatalogExam {
  _id: string;
  title: string;
  language: ExamLanguage;
  questionSetCount: number;
  category: { _id: string; name: string } | null;
  pattern?: { durationMinutes?: number; totalQuestions?: number };
}
interface Course {
  id: string;
  name: string;
  exams: CatalogExam[];
  testCount: number;
  languages: ExamLanguage[];
}
interface ExamsResponse {
  success: boolean;
  data?: { exams?: CatalogExam[] };
  pagination?: { totalPages: number };
}

// The public exam endpoint populates its parent category. Category administration
// remains authenticated; no private tokens are needed by this public page.
async function getCourseCatalog(): Promise<{ courses: Course[]; available: boolean }> {
  try {
    const exams: CatalogExam[] = [];
    let totalPages = 1;
    for (let page = 1; page <= totalPages; page++) {
      const response = await fetch(`${env.apiUrl}/exams?isActive=true&limit=100&page=${page}`, {
        next: { revalidate: 300 }, signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) throw new Error('Catalog unavailable');
      const payload = await response.json() as ExamsResponse;
      if (!payload.success || !Array.isArray(payload.data?.exams)) throw new Error('Invalid catalog response');
      exams.push(...payload.data.exams);
      totalPages = payload.pagination?.totalPages ?? 1;
    }
    const grouped = new Map<string, Course>();
    for (const exam of exams) {
      if (!exam.category) continue;
      const course = grouped.get(exam.category._id) ?? {
        id: exam.category._id, name: exam.category.name, exams: [], testCount: 0, languages: [],
      } as Course;
      course.exams.push(exam);
      course.testCount += exam.questionSetCount ?? 0;
      if (!course.languages.includes(exam.language)) course.languages.push(exam.language);
      grouped.set(course.id, course);
    }
    return { courses: [...grouped.values()].sort((a, b) => a.name.localeCompare(b.name)), available: true };
  } catch {
    return { courses: [], available: false };
  }
}

function formatLanguages(languages: ExamLanguage[]) {
  if (languages.includes('BILINGUAL') || (languages.includes('BN') && languages.includes('EN'))) return 'Bengali & English';
  return languages.includes('BN') ? 'Bengali' : languages.includes('EN') ? 'English' : 'Language varies by exam';
}
function formatRange(values: number[], suffix: string) {
  if (!values.length) return 'See exam details';
  const low = Math.min(...values), high = Math.max(...values);
  return `${low === high ? low : `${low}–${high}`} ${suffix}`;
}

const questions: [string, string][] = [
  ['What is included in a course?', 'Each course brings together exams in one category. Open a course to browse its mock tests, check each test’s instructions, and choose where to start.'],
  ['Can I practise in Bengali?', 'Bengali, English, and bilingual exams are available. Each course shows its available languages; check your chosen test’s language before beginning.'],
  ['Do I need an account to get started?', 'You can explore courses here without signing in. Create a student account to attempt tests, save your work, and keep track of your results.'],
  ['What happens after a mock test?', 'You can review your score, accuracy, time taken, and answer explanations. Use your results to decide what to revise before your next attempt.'],
];

export default async function CoursesPage() {
  const { courses, available } = await getCourseCatalog();
  const examCount = courses.reduce((sum, course) => sum + course.exams.length, 0);
  const testCount = courses.reduce((sum, course) => sum + course.testCount, 0);
  return (
    <CoursesExperience className={styles.page}>
      <section className={styles.hero} aria-labelledby="courses-title">
        <div className={`${styles.shell} ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <div className={styles.eyebrow} data-course-reveal><span className={styles.tinyDot} /> A LITTLE FOCUS. A BIGGER FUTURE.</div>
            <h1 id="courses-title" data-course-reveal data-delay="70">Your ambition.<br />Your course.<br /><em>Your next chapter.</em></h1>
            <p className={styles.heroDescription} data-course-reveal data-delay="130">Great preparation starts with a clear direction. Find your exam, build your rhythm, and make every practice session count.</p>
            <div className={styles.actions} data-course-reveal data-delay="190"><a className={styles.primaryButton} href="#courses">Find your course <ArrowRight size={17} /></a><a className={styles.textButton} href="#the-approach">See how it works <ArrowDown size={15} /></a></div>
            <div className={styles.heroChecks} data-course-reveal data-delay="250"><span><Check size={15} /> Exam-focused practice</span><span><Check size={15} /> Learn at your pace</span></div>
            <div className={styles.heroNote} data-course-reveal data-delay="300"><GraduationCap size={26} /><div><strong>Made for West Bengal aspirants.</strong><span>From your first attempt to your next opportunity.</span></div></div>
          </div>
          <div className={styles.heroVisual} data-course-reveal data-delay="130"><CourseCatalogVisual courses={courses.map((course) => ({ id: course.id, name: course.name, examCount: course.exams.length, testCount: course.testCount, language: formatLanguages(course.languages), examTitles: course.exams.map((exam) => exam.title) }))} /></div>
        </div>
        <div className={`${styles.shell} ${styles.heroBottom}`}>
          <span>GOOD PREPARATION STARTS HERE</span>
          <div><span><Languages size={16} /> Bengali & English</span><span><Clock3 size={16} /> Exam-paced practice</span><span><ListChecks size={16} /> Solutions that explain</span></div>
          <a href="#courses" aria-label="Scroll to course collection"><ArrowDown size={18} /></a>
        </div>
      </section>

      <section id="courses" className={`${styles.shell} ${styles.section}`} aria-labelledby="collection-title">
        <div className={styles.sectionHeader} data-course-reveal><div><span className={styles.eyebrow}>01 / FIND YOUR FOCUS</span><h2 id="collection-title">Big goals.<br /><em>The right starting point.</em></h2></div><p>Choose the exam you’re working towards.<br />We’ll help you take it one practice at a time.</p></div>
        <div className={styles.collectionBar} data-course-reveal><span><span className={styles.collectionIcon}><BookOpen size={16} /></span> The course collection</span><span>{available ? `${courses.length} courses · ${examCount} exams · ${testCount} practice sets` : 'Please check back shortly'}</span></div>
        {courses.length ? <div className={styles.courseGrid}>{courses.map((course, index) => {
          const Icon = /police|constable|si(?!\w)/i.test(course.name) && !/food/i.test(course.name) ? ShieldCheck : /food/i.test(course.name) ? Utensils : GraduationCap;
          const href = `/student/mock-tests?category=${encodeURIComponent(course.id)}`;
          return <div key={course.id} data-course-reveal data-reveal-variant="card" data-delay={String((index % 2) * 120)}><article className={styles.courseCard} data-tone={index % 2 ? 'blue' : 'orange'}>
            <div className={styles.courseCover}><span className={styles.eyebrow}>EXAMREADY / PREPARATION SERIES</span><Icon className={styles.coverWatermark} strokeWidth={0.65} aria-hidden="true" /><div className={styles.coverTitle}><span className={styles.coverIcon}><Icon size={25} /></span><h3><Link href={href}>{course.name}</Link></h3></div><span className={styles.coverNumber}>NO. {String(index + 1).padStart(2, '0')}</span></div>
            <div className={styles.courseBody}><div className={styles.courseMeta}><span><BookOpen size={14} />{course.exams.length} exams</span><span><ListChecks size={14} />{course.testCount} practice sets</span><span><Languages size={14} />{formatLanguages(course.languages)}</span></div><p>Build confidence for {course.name} with focused practice, timed attempts, and a clearer picture of your progress.</p><span className={styles.listLabel}>YOUR EXAM PATHS</span><ul className={styles.examNames}>{course.exams.slice(0, 3).map((exam) => <li key={exam._id}><Check size={14} /><span>{exam.title}</span></li>)}</ul>{course.exams.length > 3 && <p>+ {course.exams.length - 3} more exams</p>}<div className={styles.courseFoot}><span><Clock3 size={14} />{formatRange(course.exams.flatMap((exam) => exam.pattern?.durationMinutes ?? []), 'min')}</span><Link href={href}>Explore course <ArrowUpRight size={18} /></Link></div></div>
          </article></div>;
        })}</div> : <div className={styles.empty} data-course-reveal><BookOpen size={32} /><h3>{available ? 'Your next course is on its way.' : 'We couldn’t load the courses just now.'}</h3><p>{available ? 'Check back soon for new exam preparation paths.' : 'Please refresh the page in a moment, or contact us for help.'}</p><Link className={styles.textButton} href="/contact">Talk to us <ArrowUpRight size={16} /></Link></div>}
        <div className={styles.collectionNote} data-course-reveal><span><Target size={18} /> Not sure where to start?</span><Link href="/contact">Let’s find your focus <ArrowUpRight size={15} /></Link></div>
      </section>

      <section id="the-approach" className={styles.approach} aria-labelledby="approach-title"><div className={`${styles.shell} ${styles.approachGrid}`}>
        <div data-course-reveal><span className={styles.eyebrow}>02 / MORE THAN ANOTHER MOCK TEST</span><h2 id="approach-title">Practice with intention.<br /><em>Improve with clarity.</em></h2><p className={styles.sectionDescription}>A little structure makes a big difference. Build a preparation routine that turns each attempt into something you can learn from.</p><a href="#courses" className={styles.textButton}>Find your starting point <ArrowRight size={16} /></a><div className={styles.practiceArt} data-course-reveal data-reveal-variant="card" data-delay="140" aria-hidden="true"><div className={styles.artHeading}><span>THE PRACTICE CYCLE</span><span className={styles.artHeadingIcon}><TrendingUp size={15} /></span></div><div className={styles.cycle}><span>Practise</span><ArrowRight size={16} /><span>Reflect</span><ArrowRight size={16} /><span>Repeat</span></div><p>Small improvements. Lasting confidence.</p></div></div>
        <div className={styles.benefits}>{[
          { icon: Target, title: 'A course that follows your goal.', text: 'Your exams and practice sets, organised by category. Spend less time searching and more time preparing.' },
          { icon: Clock3, title: 'Make exam day feel familiar.', text: 'Get comfortable with the clock, question patterns, and marking rules before the real thing.' },
          { icon: BookOpen, title: 'Understand your next step.', text: 'Review answers and explanations after each attempt. Find what needs attention and return with a plan.' },
        ].map(({ icon: Icon, title, text }, index) => <article key={title} data-course-reveal data-reveal-variant="row" data-delay={String(index * 90)}><span className={styles.benefitNumber}>0{index + 1}</span><div><span className={styles.benefitIcon}><Icon size={20} strokeWidth={1.5} /></span><h3>{title}</h3><p>{text}</p></div></article>)}</div>
      </div></section>

      <section className={`${styles.shell} ${styles.section}`} aria-labelledby="journey-title"><div className={styles.centerHeading} data-course-reveal><span className={styles.eyebrow}>03 / YOUR NEXT CHAPTER, STEP BY STEP</span><h2 id="journey-title">A simple way to start.<br /><em>A reason to keep going.</em></h2></div><div className={styles.steps}>{[
        { icon: GraduationCap, title: 'Choose your direction.', text: 'Find the course for your target exam and explore its practice sets.' },
        { icon: ListChecks, title: 'Put it into practice.', text: 'Sign in, check the instructions, and give your next mock test your best.' },
        { icon: TrendingUp, title: 'Come back stronger.', text: 'Look over your results, revise your weak spots, and build your rhythm.' },
      ].map(({ icon: Icon, title, text }, index) => <article key={title} data-course-reveal data-reveal-variant="card" data-delay={String(index * 110)}><div className={styles.stepTop}><span><Icon size={24} strokeWidth={1.5} /></span><b>0{index + 1}</b></div><h3>{title}</h3><p>{text}</p></article>)}</div></section>

      <section className={`${styles.shell} ${styles.faqSection}`} aria-labelledby="faq-title"><div className={styles.faqPremium} data-course-reveal><span className={styles.eyebrow}>A LITTLE MORE CLARITY</span><h2 id="faq-title">Good questions.<br /><em>Clear answers.</em></h2><p>Still have something on your mind?</p><Link href="/contact" className={styles.textButton}>We’re here to help <ArrowUpRight size={16} /></Link></div><FaqAccordion items={questions} /></section>

      <section className={`${styles.shell} ${styles.ctaWrap}`} aria-labelledby="cta-title"><div className={styles.cta} data-course-reveal data-reveal-variant="card"><div className={styles.ctaOrbit} aria-hidden="true" /><HomeAmbient /><div className={styles.ctaCopy}><span className={styles.eyebrow}><Sparkles size={15} /> YOUR FUTURE DESERVES A START</span><h2 id="cta-title">One course.<br />A little consistency.<br /><em>A whole new possibility.</em></h2><p>You don’t need to have it all figured out.<br />Start with the exam that matters to you.</p><div className={styles.actions}><a className={styles.primaryButton} href="#courses">Choose your course <ArrowRight size={17} /></a><Link href="/register?role=student" className={styles.ctaSecondary}><Check size={15} /> Create an account</Link></div></div><div className={styles.ctaArt} aria-hidden="true"><GraduationCap size={43} strokeWidth={1} /><span>YOUR NEXT<br /><em>CHAPTER.</em></span><ArrowUpRight size={20} strokeWidth={1.4} /></div></div></section>
    </CoursesExperience>
  );
}

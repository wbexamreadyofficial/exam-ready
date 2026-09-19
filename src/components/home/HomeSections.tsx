import Link from 'next/link';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ChartNoAxesCombined,
  Check,
  Clock3,
  FileCheck2,
  GraduationCap,
  HeartPulse,
  Languages,
  ListChecks,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Utensils,
  UserPlus,
} from 'lucide-react';
import styles from './home.module.css';
import { ExamGrid } from './ExamGrid';
import { FeatureGrid } from './FeatureGrid';
import { HomeAmbient } from './HomeAmbient';

const exams = [
  {
    title: 'WB Constable',
    label: 'POLICE RECRUITMENT',
    description: 'Build your foundation for the uniform.',
    icon: ShieldCheck,
    tone: 'blue',
  },
  {
    title: 'WB Sub Inspector',
    label: 'POLICE RECRUITMENT',
    description: 'Take your preparation a step further.',
    icon: Shield,
    tone: 'orange',
  },
  {
    title: 'Food SI',
    label: 'FOOD & SUPPLIES',
    description: 'Focused practice for your next opportunity.',
    icon: Utensils,
    tone: 'green',
  },
  {
    title: 'PSC Clerkship',
    label: 'PUBLIC SERVICE',
    description: 'Turn everyday practice into confidence.',
    icon: FileCheck2,
    tone: 'orange',
  },
  {
    title: 'PSC Miscellaneous',
    label: 'PUBLIC SERVICE',
    description: 'One goal. A world of possibilities.',
    icon: BookOpen,
    tone: 'blue',
  },
  {
    title: 'Primary Teacher TET',
    label: 'TEACHER ELIGIBILITY',
    description: 'Prepare to inspire the next generation.',
    icon: GraduationCap,
    tone: 'green',
  },
];

export function HomeSections() {
  return (
    <>
      <ExamPaths />
      <PreparationFeatures />
      <PreparationJourney />
      <HomeFaq />
      <HomeCallToAction />
    </>
  );
}

function ExamPaths() {
  return (
    <section
      id="exam-paths"
      className={`${styles.section} ${styles.shell} ${styles.examSection}`}
      aria-labelledby="exam-paths-title"
    >
      <div className={styles.sectionHeading} data-reveal>
        <div>
          <span className={styles.eyebrow}>01 / FIND YOUR FOCUS</span>
          <h2 id="exam-paths-title">
            Your ambition has a name.
            <br />
            <span>Let&apos;s prepare for it.</span>
          </h2>
        </div>
        <p>
          Choose the exam that brings you closer to your future. We&apos;ll help
          you make every practice session count.
        </p>
      </div>
      <ExamGrid>
        {exams.map(({ title, label, description, icon: Icon, tone }, index) => (
          <Link
            href="/exams"
            key={title}
            className={`${styles.examCard} ${styles[tone]}`}
            data-exam-card
          >
            <span className={styles.examGlow} aria-hidden="true" />
            <span className={styles.examRule} aria-hidden="true" />
            <div className={styles.examCardTop}>
              <span className={styles.examIcon} data-exam-icon>
                <Icon size={24} strokeWidth={1.7} />
              </span>
              <span className={styles.cardNumber} data-exam-number>
                0{index + 1}
              </span>
            </div>
            <span className={styles.miniLabel} data-exam-text>
              {label}
            </span>
            <h3 data-exam-text>{title}</h3>
            <p data-exam-text>{description}</p>
            <div className={styles.examCardFooter} data-exam-text>
              <span>Explore mock tests</span>
              <span className={styles.examArrow}>
                <ArrowUpRight size={16} />
              </span>
            </div>
          </Link>
        ))}
      </ExamGrid>
      <div className={styles.examMore} data-reveal>
        <span>
          <HeartPulse size={18} /> Preparing for WB Health or another exam?
        </span>
        <Link href="/exams">
          View all exams <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

const PROGRESS_BARS = [30, 43, 38, 58, 50, 69, 79, 91];
const PROGRESS_GAIN = PROGRESS_BARS[PROGRESS_BARS.length - 1] - PROGRESS_BARS[0];
// Line through the bar tops, in the chart's 0-100 coordinate space (y is flipped).
const PROGRESS_TREND = PROGRESS_BARS.map(
  (height, index) =>
    `${index === 0 ? 'M' : 'L'} ${((index + 0.5) / PROGRESS_BARS.length) * 100} ${100 - height}`
).join(' ');

function PreparationFeatures() {
  return (
    <section
      className={styles.featuresSection}
      aria-labelledby="features-title"
    >
      <div className={styles.shell}>
        <div className={styles.sectionHeading} data-reveal>
          <div>
            <span className={`${styles.eyebrow} ${styles.eyebrowRule}`}>
              02 / PRACTICE WITH PURPOSE
            </span>
            <h2 id="features-title">
              More than a test.
              <br />
              <span>A better way forward.</span>
            </h2>
          </div>
          <p>
            Know where you stand, understand your mistakes, and give your next
            attempt a stronger start.
          </p>
        </div>
        <FeatureGrid>
          <article
            className={styles.featureLead}
            data-feature-lead
            data-spotlight
          >
            <span className={styles.leadOrb} data-orb aria-hidden="true" />
            <span className={styles.leadOrbAlt} data-orb aria-hidden="true" />
            <span className={styles.leadGlow} aria-hidden="true" />
            <div className={styles.leadBody}>
              <span className={styles.darkIcon} data-lead-item>
                <ChartNoAxesCombined size={24} />
              </span>
              <span className={styles.featureTag} data-lead-item>
                SEE THE BIGGER PICTURE
              </span>
              <h3 data-lead-item>
                Small improvements.
                <br />
                Real momentum.
              </h3>
              <p data-lead-item>
                Your results tell a story. Track your performance and discover
                the topics that deserve a little more attention.
              </p>
            </div>
            <div className={styles.progressVisual} data-lead-item>
              <div className={styles.progressHeader}>
                <span>Every attempt is a step forward</span>
                <span className={styles.deltaPill} data-delta>
                  <TrendingUp size={12} />
                  <span>
                    +<b data-count={PROGRESS_GAIN}>{PROGRESS_GAIN}</b>%
                  </span>
                </span>
                <ArrowUpRight size={20} />
              </div>
              <div className={styles.progressChart} aria-hidden="true">
                <svg
                  className={styles.progressTrend}
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  data-trend
                >
                  <path d={PROGRESS_TREND} />
                </svg>
                {PROGRESS_BARS.map((height, i) => (
                  <div key={i}>
                    <i data-bar style={{ height: `${height}%` }} />
                    <span>0{i + 1}</span>
                  </div>
                ))}
              </div>
              <div className={styles.progressLegend}>
                <span>
                  <i /> Your practice journey
                </span>
                <small>Illustrative progress</small>
              </div>
            </div>
          </article>
          <article
            className={`${styles.featureSmall} ${styles.blueCard}`}
            data-feature-small
            data-spotlight
          >
            <span className={styles.featureGlow} aria-hidden="true" />
            <span className={styles.blueIcon} data-feature-icon>
              <Clock3 size={24} />
            </span>
            <h3 data-feature-text>
              Make exam day
              <br />
              feel familiar.
            </h3>
            <p data-feature-text>
              Timed mock tests help you build your rhythm before the real thing.
            </p>
            <div className={styles.timerVisual} data-feature-visual>
              <Clock3 size={17} />
              <span>Practice at exam pace</span>
              <Check size={16} />
              <i className={styles.timerBar} data-meter aria-hidden="true" />
            </div>
          </article>
          <article
            className={`${styles.featureSmall} ${styles.orangeCard}`}
            data-feature-small
            data-spotlight
          >
            <span className={styles.featureGlow} aria-hidden="true" />
            <span className={styles.orangeIcon} data-feature-icon>
              <Sparkles size={24} />
            </span>
            <h3 data-feature-text>
              Don&apos;t just check.
              <br />
              Understand.
            </h3>
            <p data-feature-text>
              Review detailed solutions, learn the reasoning, and make every
              mistake useful.
            </p>
            <div className={styles.solutionVisual} data-feature-visual>
              <Check size={17} />
              <span>Clarity after every attempt</span>
              <i className={styles.shine} data-shine aria-hidden="true" />
            </div>
          </article>
        </FeatureGrid>
        <div className={styles.featureFootnote} data-reveal>
          <Languages size={19} />
          <span>
            Think in your language. Practice in{' '}
            <strong>Bengali &amp; English.</strong>
          </span>
        </div>
      </div>
    </section>
  );
}

function PreparationJourney() {
  const steps = [
    {
      title: 'Make it yours.',
      text: 'Create your account and take the first step toward your goal.',
      icon: UserPlus,
    },
    {
      title: 'Find your focus.',
      text: 'Choose your exam and a mock test that fits your preparation.',
      icon: Target,
    },
    {
      title: 'Put it into practice.',
      text: 'Settle in, challenge yourself, and build your exam-day confidence.',
      icon: ListChecks,
    },
    {
      title: 'Come back stronger.',
      text: 'Review your answers, work on weak spots, and keep moving forward.',
      icon: ChartNoAxesCombined,
    },
  ];
  return (
    <section
      id="how-it-works"
      className={`${styles.section} ${styles.shell}`}
      aria-labelledby="journey-title"
    >
      <div
        className={`${styles.centerHeading} ${styles.sectionHeading}`}
        data-reveal
      >
        <span className={styles.eyebrow}>03 / A SIMPLE WAY TO START</span>
        <h2 id="journey-title">
          One step today.
          <br />
          <span>A stronger you tomorrow.</span>
        </h2>
      </div>
      <div className={styles.steps}>
        {steps.map(({ title, text, icon: Icon }, i) => (
          <article className={styles.step} key={title} data-reveal>
            <div className={styles.stepTop}>
              <span className={styles.stepIcon}>
                <Icon size={23} />
              </span>
              <span>0{i + 1}</span>
            </div>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <div className={styles.centerAction} data-reveal>
        <Link className={styles.textLink} href="/register">
          Take your first step <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}

function HomeFaq() {
  const questions = [
    [
      'Can I try a mock test for free?',
      'Yes. Explore the mock test library to find free tests. Create an account when you are ready to begin and track your results.',
    ],
    [
      'Which exams can I prepare for?',
      'Explore tests for WB Constable, WB SI, Food SI, WB Health, PSC Clerkship, PSC Miscellaneous, and Primary Teacher TET.',
    ],
    [
      'Are tests available in Bengali?',
      'The test library includes Bengali and English tests. Check the language information on your chosen test before you begin.',
    ],
    [
      'What happens after I finish a test?',
      'Review your score and solutions to understand your answers, identify areas to improve, and plan your next practice session.',
    ],
  ];
  return (
    <section
      className={`${styles.shell} ${styles.faqSection}`}
      aria-labelledby="faq-title"
    >
      <div data-reveal>
        <span className={styles.eyebrow}>A LITTLE MORE CLARITY</span>
        <h2 id="faq-title">
          Good questions.
          <br />
          <span>Clear answers.</span>
        </h2>
        <p>Still have something on your mind?</p>
        <Link href="/contact" className={styles.textLink}>
          We&apos;re here to help <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className={styles.faqList}>
        {questions.map(([question, answer]) => (
          <details key={question} data-reveal>
            <summary>
              {question}
              <ArrowDown size={18} />
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function HomeCallToAction() {
  return (
    <section
      className={`${styles.shell} ${styles.ctaWrap}`}
      aria-labelledby="cta-title"
    >
      <div className={styles.cta} data-reveal>
        <div className={styles.ctaOrbit} aria-hidden="true" />
        <HomeAmbient />
        <div className={styles.ctaCopy}>
          <span className={styles.eyebrow}>
            <Sparkles size={15} /> YOUR FUTURE IS CALLING
          </span>
          <h2 id="cta-title">
            Show up for your dreams.
            <br />
            <span>Start with one mock test.</span>
          </h2>
          <p>
            You don&apos;t need to have it all figured out. You just need to
            begin.
          </p>
          <div className={styles.actions}>
            <Link href="/exams" className={styles.primaryButton}>
              Let&apos;s get exam ready <ArrowRight size={18} />
            </Link>
            <span className={styles.ctaNote}>
              <Check size={15} /> Start with a free test
            </span>
          </div>
        </div>
        <div className={styles.ctaMark} aria-hidden="true">
          <GraduationCap strokeWidth={1} />
          <span>
            YOUR NEXT
            <br />
            CHAPTER
          </span>
          <ArrowUpRight />
        </div>
      </div>
    </section>
  );
}

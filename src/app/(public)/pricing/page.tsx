import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BarChart3, BookOpen, Check, GraduationCap, ShieldCheck, Sparkles, Target } from 'lucide-react';
import { CoursesExperience } from '@/components/courses/CoursesExperience';
import { FaqAccordion } from '@/components/courses/FaqAccordion';
import { HomeAmbient } from '@/components/home/HomeAmbient';
import styles from '@/components/pricing/pricing.module.css';

export const metadata: Metadata = {
  title: 'Pricing — Exam Ready',
  description: 'Compare Exam Ready membership plans and choose one that fits your exam preparation — free practice, or unlimited mock tests, analytics, and PYQ solution banks.',
};

const PLANS = [
  {
    id: 'free',
    name: 'Free Starter',
    price: 0,
    duration: 'Forever',
    description: 'Perfect for exploring exam patterns & daily practice.',
    features: [
      'Access to 20 free mock tests',
      'Daily 10-min practice quizzes',
      'Basic result summary & score',
      'Statewide leaderboard access',
    ],
    popular: false,
    cta: 'Start for free',
  },
  {
    id: 'pro-pass',
    name: 'WB Exam Pass',
    price: 499,
    duration: '6 Months',
    description: 'Unlimited access to all WBPSC, WBCS & SSC mock tests.',
    features: [
      'Unlimited access to 500+ mock tests',
      'Subject-wise deep performance analytics',
      'Detailed answer keys & explanations',
      'Previous year question (PYQ) series',
      'Priority doubt resolution support',
    ],
    popular: true,
    cta: 'Upgrade to PRO',
  },
  {
    id: 'annual-pass',
    name: '1-Year Unlimited Pass',
    price: 799,
    duration: '1 Year',
    description: 'Complete 365-day access for all state & central exams.',
    features: [
      'Everything in WB Exam Pass',
      '365 days unlimited test access',
      'Full PDF solution downloads',
      'Rank predictor & percentile analytics',
      'Dedicated Telegram support group',
    ],
    popular: false,
    cta: 'Get Annual Pass',
  },
];

const benefits = [
  { icon: Target, title: 'Built for real exam patterns.', text: 'Every mock test mirrors the actual paper structure, timing, and negative marking of WBPSC, WBCS, and SSC exams.' },
  { icon: BarChart3, title: 'Analytics that show your gaps.', text: 'Subject-wise breakdowns and percentile analytics tell you exactly what to revise before your next attempt.' },
  { icon: BookOpen, title: 'A growing PYQ solution bank.', text: 'Previous year questions solved step-by-step, so you understand the reasoning, not just the answer.' },
];

const questions: [string, string][] = [
  ['Can I switch plans later?', 'Yes. You can upgrade from Free Starter to WB Exam Pass or the 1-Year Unlimited Pass at any time — your existing progress and results carry over.'],
  ['What happens when my pass expires?', 'You keep all your past results and progress. Renew whenever you like to regain full access to premium mock tests and analytics.'],
  ['Do I need a paid plan to start?', 'No. Free Starter is always free and gives you 20 mock tests and daily practice quizzes with no payment required.'],
  ['Is my payment secure?', 'Yes. All payments are processed through a 256-bit encrypted gateway. If something goes wrong, our support team can help within 7 days of purchase.'],
];

export default function PricingPage() {
  return (
    <CoursesExperience className={styles.page}>
      <section className={styles.hero} aria-labelledby="pricing-title">
        <div className={`${styles.shell} ${styles.heroInner}`}>
          <div className={styles.eyebrow} data-course-reveal><span className={styles.tinyDot} /> MEMBERSHIP PLANS</div>
          <h1 id="pricing-title" data-course-reveal data-delay="70">Accelerate your<br /><em>exam preparation.</em></h1>
          <p className={styles.heroDescription} data-course-reveal data-delay="130">Choose a plan to unlock premium full-length mock tests, subject-wise analytics, and PYQ practice sets.</p>
        </div>
      </section>

      <section className={`${styles.shell} ${styles.plansSection}`} aria-label="Membership plans">
        <div className={styles.planGrid}>
          {PLANS.map((plan, index) => (
            <div key={plan.id} data-course-reveal data-reveal-variant="card" data-delay={String(index * 110)}>
              <article className={styles.planCard} data-popular={plan.popular}>
                {plan.popular && <span className={styles.planBadge}>MOST POPULAR</span>}
                <h2 className={styles.planName}>{plan.name}</h2>
                <p className={styles.planDescription}>{plan.description}</p>
                <div className={styles.planPrice}><strong>₹{plan.price}</strong><span>/ {plan.duration}</span></div>
                <ul className={styles.planFeatures}>
                  {plan.features.map((feature) => <li key={feature}><Check size={14} /><span>{feature}</span></li>)}
                </ul>
                <Link href="/register?role=student" className={styles.planCta} data-variant={plan.popular ? 'primary' : 'outline'}>{plan.cta}</Link>
              </article>
            </div>
          ))}
        </div>
        <div className={styles.trustNote} data-course-reveal><ShieldCheck size={16} /> Safe &amp; Secure 256-bit encrypted payment gateway. Cancel anytime.</div>
      </section>

      <section className={`${styles.shell} ${styles.benefitsSection}`} aria-labelledby="benefits-title">
        <div className={styles.benefitsHeader} data-course-reveal>
          <span className={styles.eyebrow}><span className={styles.tinyDot} /> WHY GO PREMIUM</span>
          <h2 id="benefits-title">More than another mock test.</h2>
          <p>Every plan is built around the same goal — practice that actually prepares you for exam day.</p>
        </div>
        <div className={styles.benefitsGrid}>
          {benefits.map(({ icon: Icon, title, text }, index) => (
            <article key={title} className={styles.benefitCard} data-course-reveal data-reveal-variant="card" data-delay={String(index * 100)}>
              <span className={styles.benefitIcon}><Icon size={20} strokeWidth={1.5} /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.shell} ${styles.faqSection}`} aria-labelledby="pricing-faq-title">
        <div data-course-reveal>
          <span className={styles.eyebrow}>A LITTLE MORE CLARITY</span>
          <h2 id="pricing-faq-title">Plan questions.<br /><em>Answered.</em></h2>
          <p>Still deciding which plan fits you?</p>
          <Link href="/contact" className={styles.textButton}>We&apos;re here to help <ArrowUpRight size={16} /></Link>
        </div>
        <FaqAccordion items={questions} />
      </section>

      <section className={`${styles.shell} ${styles.ctaWrap}`} aria-labelledby="pricing-cta-title">
        <div className={styles.cta} data-course-reveal data-reveal-variant="card">
          <div className={styles.ctaOrbit} aria-hidden="true" />
          <HomeAmbient />
          <div className={styles.ctaCopy}>
            <span className={styles.eyebrow}><Sparkles size={15} /> YOUR FUTURE IS CALLING</span>
            <h2 id="pricing-cta-title">Show up for your dreams.<br /><em>Start with one mock test.</em></h2>
            <p>You don&apos;t need to have it all figured out.<br />You just need to begin.</p>
            <div className={styles.actions}>
              <Link href="/register?role=student" className={styles.primaryButton}>Let&apos;s get exam ready <ArrowRight size={18} /></Link>
              <span className={styles.ctaNote}><Check size={15} /> Start with a free test</span>
            </div>
          </div>
          <div className={styles.ctaArt} aria-hidden="true">
            <GraduationCap size={43} strokeWidth={1} />
            <span>YOUR NEXT<br /><em>CHAPTER.</em></span>
            <ArrowUpRight size={20} strokeWidth={1.4} />
          </div>
        </div>
      </section>
    </CoursesExperience>
  );
}

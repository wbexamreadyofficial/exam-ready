import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, Clock3, GraduationCap, Mail, MapPin, MessageCircle, Phone, Sparkles } from 'lucide-react';
import { CoursesExperience } from '@/components/courses/CoursesExperience';
import { FaqAccordion } from '@/components/courses/FaqAccordion';
import { HomeAmbient } from '@/components/home/HomeAmbient';
import styles from '@/components/contact/contact.module.css';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us — Exam Ready',
  description: 'Get in touch with the Exam Ready support team for questions about mock tests, subscriptions, or technical support.',
};

const channels = [
  { icon: Mail, title: 'Email support', value: 'support@examready.in', desc: 'Average response time: 2 hours' },
  { icon: Phone, title: 'Helpline', value: '+91 98765 43210', desc: 'Mon – Sat (9:00 AM – 6:00 PM)' },
  { icon: MapPin, title: 'Headquarters', value: 'Kolkata, West Bengal', desc: 'Salt Lake Sector V, Kolkata 700091' },
];

const hours = [
  { day: 'Monday – Friday', time: '9:00 AM – 6:00 PM' },
  { day: 'Saturday', time: '10:00 AM – 4:00 PM' },
  { day: 'Sunday', time: 'Closed' },
];

const questions: [string, string][] = [
  ['How quickly will I get a reply?', 'Our support team typically replies within 2 hours on working days, and by the next working day for messages sent over the weekend.'],
  ['I have an issue with a mock test attempt.', 'Include the exam name and roughly when you attempted it in your message — this helps us look into scoring or timer issues much faster.'],
  ['Can I request a new exam or course?', 'Yes. Tell us which exam you’d like to see covered next and we’ll factor it into our upcoming test additions.'],
  ['I want to report a bug on the platform.', 'Describe what you were doing when it happened, along with your device and browser — screenshots help us fix it faster.'],
];

export default function ContactPage() {
  return (
    <CoursesExperience className={styles.page}>
      <section className={styles.hero} aria-labelledby="contact-title">
        <div className={`${styles.shell} ${styles.heroInner}`}>
          <div className={styles.eyebrow} data-course-reveal><span className={styles.tinyDot} /> WE&apos;RE HERE TO HELP</div>
          <h1 id="contact-title" data-course-reveal data-delay="70">Questions?<br /><em>Let&apos;s talk.</em></h1>
          <p className={styles.heroDescription} data-course-reveal data-delay="130">Have questions regarding mock tests, subscriptions, or technical support? Our team is here to help you keep moving.</p>
        </div>
      </section>

      <section className={`${styles.shell} ${styles.channelsSection}`} aria-label="Contact channels">
        <div className={styles.channelGrid}>
          {channels.map(({ icon: Icon, title, value, desc }, index) => (
            <article key={title} className={styles.channelCard} data-course-reveal data-reveal-variant="card" data-delay={String(index * 100)}>
              <span className={styles.channelIcon}><Icon size={19} strokeWidth={1.5} /></span>
              <h3>{title}</h3>
              <strong>{value}</strong>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.shell} ${styles.formSection}`} aria-label="Send us a message">
        <div className={styles.formLayout}>
          <ContactForm />
          <div>
            <div className={styles.sidebarCard} data-course-reveal data-reveal-variant="card" data-delay="80">
              <h3><Clock3 size={16} /> Support hours</h3>
              <ul className={styles.hoursList}>
                {hours.map(({ day, time }) => <li key={day}><span>{day}</span><strong>{time}</strong></li>)}
              </ul>
            </div>
            <div className={styles.sidebarCard} data-course-reveal data-reveal-variant="card" data-delay="140">
              <h3><MessageCircle size={16} /> Stay connected</h3>
              <p>Follow along for exam updates, new mock tests, and preparation tips.</p>
              <div className={styles.socialRow}>
                <a href="#" aria-label="Telegram community"><Sparkles size={15} /></a>
                <a href="#" aria-label="WhatsApp support"><MessageCircle size={15} /></a>
                <a href="#" aria-label="Email us"><Mail size={15} /></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.shell} ${styles.faqSection}`} aria-labelledby="contact-faq-title">
        <div data-course-reveal>
          <span className={styles.eyebrow}>A LITTLE MORE CLARITY</span>
          <h2 id="contact-faq-title">Before you write in.<br /><em>Quick answers.</em></h2>
          <p>Some things are faster to check here first.</p>
          <Link href="/courses" className={styles.textButton}>Browse courses instead <ArrowUpRight size={16} /></Link>
        </div>
        <FaqAccordion items={questions} />
      </section>

      <section className={`${styles.shell} ${styles.ctaWrap}`} aria-labelledby="contact-cta-title">
        <div className={styles.cta} data-course-reveal data-reveal-variant="card">
          <div className={styles.ctaOrbit} aria-hidden="true" />
          <HomeAmbient />
          <div className={styles.ctaCopy}>
            <span className={styles.eyebrow}><Sparkles size={15} /> WHILE YOU WAIT FOR OUR REPLY</span>
            <h2 id="contact-cta-title">Don&apos;t just wait around.<br /><em>Start practising today.</em></h2>
            <p>You don&apos;t need an answer to every question<br />before you begin your next mock test.</p>
            <div className={styles.actions}>
              <Link href="/student/mock-tests" className={styles.primaryButton}>Find your mock test <ArrowRight size={18} /></Link>
              <span className={styles.ctaNote}><Check size={15} /> Free tests to get started</span>
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

import Link from 'next/link';
import { ArrowDown, ArrowRight, Check, GraduationCap } from 'lucide-react';
import { HeroCardDeck } from './HeroCardDeck';
import styles from './home.module.css';

export function HomeHero() {
  return (
    <section className={styles.hero} aria-labelledby="home-heading">
      <div className={styles.heroGlow} aria-hidden="true" />
      <div className={`${styles.shell} ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow} data-hero-reveal>
            <span className={styles.statusDot} /> YOUR AMBITION. OUR MISSION.
          </div>
          <h1 id="home-heading" className={styles.heroTitle} data-hero-reveal>
            Big dreams.
            <br />
            Better practice.
            <br />
            <span>Your next chapter.</span>
          </h1>
          <p className={styles.heroDescription} data-hero-reveal>
            Your government exam journey deserves a smarter start. Build
            confidence with focused mock tests, clear solutions, and progress
            you can see.
          </p>
          <div className={styles.actions} data-hero-reveal>
            <Link href="/exams" className={styles.primaryButton}>
              Find your mock test <ArrowRight size={18} />
            </Link>
            <a href="#how-it-works" className={styles.secondaryButton}>
              See how it works <ArrowDown size={16} />
            </a>
          </div>
          <div className={styles.heroChecks} data-hero-reveal>
            <span>
              <Check size={15} /> Free tests to get started
            </span>
            <span>
              <Check size={15} /> Bengali &amp; English
            </span>
          </div>
          <div className={styles.heroNote} data-hero-reveal>
            <div className={styles.noteIcon}>
              <GraduationCap size={23} />
            </div>
            <div>
              <strong>Made for West Bengal aspirants.</strong>
              <p>From your first practice to your exam day.</p>
            </div>
          </div>
        </div>
        <HeroCardDeck />
      </div>
      <div className={`${styles.shell} ${styles.heroFooter}`}>
        <span>ONE PLATFORM. SO MANY POSSIBILITIES.</span>
        <div>
          <span>WBP</span>
          <span>WB SI</span>
          <span>Food SI</span>
          <span>PSC</span>
          <span>Primary TET</span>
        </div>
        <a href="#exam-paths">
          Find your path <ArrowDown size={14} />
        </a>
      </div>
    </section>
  );
}

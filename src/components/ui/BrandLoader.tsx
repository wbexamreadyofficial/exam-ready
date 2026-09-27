import { LogoIcon } from './Logo';
import styles from './brand-loader.module.css';

/** Lightweight, server-renderable fallback; removed as soon as content is ready. */
export function BrandLoader() {
  return (
    <div className={styles.screen} role="status" aria-live="polite" aria-label="Loading ExamReady. Please wait.">
      <div className={styles.content} aria-hidden="true">
        <div className={styles.emblem}>
          <div className={styles.halo} />
          <div className={styles.orbit}><span /></div>
          <div className={styles.logoPlate}>
            <LogoIcon className={styles.logo} idPrefix="brand-loader-" />
          </div>
        </div>

        <div className={styles.wordmark}><span>Exam</span><span>Ready</span></div>
        <p className={styles.tagline}>Prepare. Practice. Perform.</p>

        <div className={styles.loading}>
          <div className={styles.track}><span /></div>
          <p>Getting things ready<span className={styles.dots}>…</span></p>
        </div>
      </div>
      <div className={styles.signature} aria-hidden="true">
        <span /> YOUR AMBITION. OUR MISSION.
      </div>
    </div>
  );
}

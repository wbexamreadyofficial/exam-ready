'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Check,
  CircleHelp,
  Lightbulb,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import styles from './home.module.css';

const answers = ['Darjeeling', 'Kolkata', 'Siliguri', 'Durgapur'];

export function PracticePreview({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState<number | null>(null);
  const correct = selected === 1;
  return (
    <div
      className={`${styles.practiceCard} ${compact ? styles.compactCard : ''}`}
    >
      <div className={styles.previewTop}>
        <span>
          <BookOpen size={18} /> Your practice space
        </span>
        <span className={styles.demoLabel}>INTERACTIVE DEMO</span>
      </div>
      <div className={styles.previewBody}>
        <div className={styles.previewGreeting} data-deck-row>
          <div>
            <p>A little practice goes a long way.</p>
            <h2>Let&apos;s make today count.</h2>
          </div>
          <span className={styles.sunIcon}>
            <Sparkles size={23} />
          </span>
        </div>
        {!compact && (
          <div className={styles.previewStats}>
            <div>
              <span className={styles.miniLabel}>YOUR NEXT STEP</span>
              <strong>One question.</strong>
              <span>A fresh start, right here.</span>
            </div>
            <div className={styles.miniChart} aria-hidden="true">
              {[26, 40, 33, 53, 47, 66, 81].map((height, i) => (
                <i key={i} data-grow style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>
        )}
        <div className={styles.questionHeading} data-deck-row>
          <span>
            <span className={styles.statusDot} /> GENERAL KNOWLEDGE
          </span>
          <span>01 / 01</span>
        </div>
        <fieldset className={styles.question} disabled={selected !== null}>
          <legend>Which city is the capital of West Bengal?</legend>
          <div className={styles.options}>
            {answers.map((answer, index) => (
              <button
                type="button"
                key={answer}
                data-deck-row
                onClick={() => setSelected(index)}
                className={`${styles.option} ${selected !== null && index === 1 ? styles.correctOption : ''} ${selected === index && !correct ? styles.wrongOption : ''}`}
                aria-pressed={selected === index}
              >
                <span className={styles.optionLetter}>
                  {String.fromCharCode(65 + index)}
                </span>
                {answer}
                {selected !== null && index === 1 && <Check size={16} />}
              </button>
            ))}
          </div>
        </fieldset>
        <div
          className={styles.answerFeedback}
          aria-live="polite"
          aria-atomic="true"
        >
          {selected === null ? (
            <>
              <CircleHelp size={15} />
              <span>Try it out. Select an answer above.</span>
            </>
          ) : (
            <>
              <Lightbulb size={16} />
              <span>
                <strong>{correct ? 'You got it!' : 'Keep learning!'}</strong>{' '}
                Kolkata is the capital of West Bengal.
              </span>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Try the sample question again"
              >
                <RotateCcw size={15} />
              </button>
            </>
          )}
        </div>
      </div>
      <Link href="/student/mock-tests" className={styles.previewFooter} data-deck-row>
        Ready for the real challenge?{' '}
        <span>
          Explore tests <ArrowRight size={14} />
        </span>
      </Link>
    </div>
  );
}

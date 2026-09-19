'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import {
  ArrowUpRight,
  Check,
  Flame,
  Pause,
  Play,
  TrendingUp,
} from 'lucide-react';
import { PracticePreview } from './PracticePreview';
import styles from './hero-card-deck.module.css';

export function HeroCardDeck() {
  const root = useRef<HTMLDivElement>(null);
  const syncPlayback = useRef<(() => void) | null>(null);
  const pausedByUser = useRef(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    pausedByUser.current = paused;
    syncPlayback.current?.();
  }, [paused]);

  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    const media = gsap.matchMedia();

    media.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        const select = gsap.utils.selector(element);
        const progress = select('[data-deck-card="progress"]');
        const practice = select('[data-deck-card="practice"]');
        const goal = select('[data-deck-card="goal"]');

        const rings = select('[data-deck-rings]');
        const rows = select('[data-deck-row]');

        // Perspective for the 3D swing is set ONCE and never tweened: animating
        // it toward zero is what made the practice card expand and snap before.
        gsap.set(practice, { transformPerspective: 1400 });

        // Cards start off to the side, tilted well past their resting angle
        // (read from the CSS rotate()), and settle in with a slight overshoot.
        const entrance = gsap.timeline({
          paused: true,
          defaults: { ease: 'power3.out' },
        });
        entrance
          .from(
            rings,
            { scale: 0.82, opacity: 0, duration: 1.8, ease: 'power3.out' },
            0
          )
          .from(
            practice,
            {
              rotationY: 22,
              x: 70,
              opacity: 0,
              transformOrigin: 'right center',
              duration: 1.4,
              ease: 'power4.out',
            },
            0.3
          )
          .from(
            rows,
            { opacity: 0, x: 18, stagger: 0.12, duration: 0.8 },
            0.7
          )
          .from(
            progress,
            {
              x: 140,
              y: -80,
              rotation: 34,
              scale: 0.8,
              opacity: 0,
              duration: 1.5,
              ease: 'back.out(1.4)',
            },
            0.55
          )
          .from(
            goal,
            {
              x: -150,
              y: 60,
              rotation: -30,
              scale: 0.8,
              opacity: 0,
              duration: 1.5,
              ease: 'back.out(1.4)',
            },
            0.7
          );

        // Slow, larger drifts with a slight sway. They run at a timeScale that is
        // eased between 0 and 1, so pausing/resuming decelerates instead of freezing.
        const drift = (
          target: string,
          vars: gsap.TweenVars
        ) =>
          gsap.to(select(`[data-deck-float="${target}"]`), {
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            force3D: true,
            ...vars,
          });
        const floats = [
          drift('progress', { y: -12, rotation: 0.6, duration: 5.2 }),
          drift('practice', { y: -9, duration: 6.4, delay: 0.5 }),
          drift('goal', { y: -11, rotation: -0.6, duration: 4.8, delay: 1 }),
        ];
        floats.forEach((animation) => animation.timeScale(0));

        let visible = false;
        let focused = false;
        let hovered = false;
        let entered = false;
        const update = () => {
          const stopped = !visible || document.hidden || pausedByUser.current;
          entrance.paused(stopped);
          const still = stopped || !entered || focused || hovered;
          floats.forEach((animation) =>
            gsap.to(animation, {
              timeScale: still ? 0 : 1,
              duration: still ? 0.6 : 1.2,
              ease: 'power2.out',
              overwrite: true,
            })
          );
        };
        entrance.eventCallback('onComplete', () => {
          gsap.set([...rings, ...practice, ...progress, ...goal, ...rows], {
            clearProps: 'transform,transformOrigin,opacity',
          });
          entered = true;
          update();
        });
        const onPointerEnter = () => {
          hovered = true;
          update();
        };
        const onPointerLeave = () => {
          hovered = false;
          update();
        };
        const practiceElement = practice[0] as HTMLElement;
        const onFocusIn = (event: FocusEvent) => {
          focused =
            event.target instanceof Element &&
            !!event.target.closest('[data-deck-card="practice"]');
          update();
        };
        const onFocusOut = (event: FocusEvent) => {
          focused =
            event.relatedTarget instanceof Element &&
            !!event.relatedTarget.closest('[data-deck-card="practice"]');
          update();
        };
        const observer = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          update();
        });
        syncPlayback.current = update;
        observer.observe(element);
        document.addEventListener('visibilitychange', update);
        element.addEventListener('focusin', onFocusIn);
        element.addEventListener('focusout', onFocusOut);
        practiceElement.addEventListener('pointerenter', onPointerEnter);
        practiceElement.addEventListener('pointerleave', onPointerLeave);

        return () => {
          observer.disconnect();
          document.removeEventListener('visibilitychange', update);
          element.removeEventListener('focusin', onFocusIn);
          element.removeEventListener('focusout', onFocusOut);
          practiceElement.removeEventListener('pointerenter', onPointerEnter);
          practiceElement.removeEventListener('pointerleave', onPointerLeave);
          syncPlayback.current = null;
        };
      },
      element
    );

    return () => media.revert();
  }, []);

  return (
    <div
      ref={root}
      className={styles.deck}
      aria-label="A preview of your preparation journey"
    >
      <div className={styles.rings} data-deck-rings aria-hidden="true" />

      <div className={styles.progressPosition} data-deck-card="progress">
        <section
          className={`${styles.card} ${styles.progressCard}`}
          data-deck-float="progress"
          aria-label="Illustrative practice progress"
        >
          <div className={styles.cardTop}>
            <span>YOUR MOMENTUM</span>
            <TrendingUp size={15} />
          </div>
          <h2>
            A little better.
            <br />
            <span>Every single day.</span>
          </h2>
          <div className={styles.chart} aria-hidden="true">
            {[28, 43, 37, 55, 48, 69, 82, 97].map((height, index) => (
              <i key={index} style={{ height: `${height}%` }} />
            ))}
          </div>
          <div className={styles.chartCaption}>
            <span>Every attempt counts</span>
            <span>Sample progress</span>
          </div>
        </section>
      </div>

      <div className={styles.practicePosition} data-deck-card="practice">
        <div data-deck-float="practice">
          <PracticePreview compact />
        </div>
      </div>

      <div className={styles.goalPosition} data-deck-card="goal">
        <section
          className={`${styles.card} ${styles.goalCard}`}
          data-deck-float="goal"
          aria-label="A suggested daily practice goal"
        >
          <div className={styles.cardTop}>
            <span>ONE DAY AT A TIME</span>
            <Flame size={16} />
          </div>
          <div className={styles.goalHeading}>
            <span className={styles.goalIcon}>
              <Check size={22} />
            </span>
            <div>
              <h2>
                Small steps.
                <br />
                Big possibilities.
              </h2>
            </div>
          </div>
          <div className={styles.goalSteps}>
            <span>
              <Check size={11} /> Pick your exam
            </span>
            <span>
              <Check size={11} /> Make time to practice
            </span>
            <span>
              <Check size={11} /> Keep showing up
            </span>
          </div>
          <div className={styles.goalFooter}>
            Your next chapter starts here <ArrowUpRight size={14} />
          </div>
        </section>
      </div>

      <div className={styles.deckCaption}>
        <span>PREPARE. PRACTICE. PERFORM.</span>
        <button
          type="button"
          className={styles.motionToggle}
          aria-label={paused ? 'Resume card animation' : 'Pause card animation'}
          aria-pressed={paused}
          onClick={() => setPaused(!paused)}
        >
          {paused ? <Play size={11} /> : <Pause size={11} />}{' '}
          {paused ? 'Resume motion' : 'Pause motion'}
        </button>
      </div>
    </div>
  );
}

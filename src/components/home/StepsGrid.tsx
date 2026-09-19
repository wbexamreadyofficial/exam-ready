'use client';

import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './home.module.css';

/** The "A simple way to start" steps: a connector line draws across, then each step rises in. */
export function StepsGrid({ children }: { children: ReactNode }) {
  const grid = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = grid.current;
    if (!element) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        const q = gsap.utils.selector(element);
        const steps = q('[data-step]');
        const ease = 'power2.out';

        const timeline = gsap.timeline({ paused: true, defaults: { ease } });
        timeline
          .fromTo(q('[data-steps-line]'), { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: 'power2.inOut', clearProps: 'transform' }, 0)
          .from(steps, { y: 40, opacity: 0, transition: 'none', stagger: 0.16, duration: 1.1, force3D: true, clearProps: 'transform,opacity,transition' }, 0.1)
          .from(q('[data-step-icon]'), { scale: 0.8, opacity: 0, stagger: 0.16, duration: 0.9, clearProps: 'transform,opacity' }, 0.3)
          .from(q('[data-step-num]'), { opacity: 0, x: 8, stagger: 0.16, duration: 0.8, clearProps: 'transform,opacity' }, 0.4)
          .from(q('[data-step-text]'), { y: 12, opacity: 0, stagger: 0.08, duration: 0.9, clearProps: 'transform,opacity' }, 0.5);

        const { top, bottom } = element.getBoundingClientRect();
        if (bottom < 0) {
          timeline.progress(1);
        } else if (top < window.innerHeight * 0.85) {
          timeline.play();
        } else {
          ScrollTrigger.create({ trigger: element, start: 'top 85%', once: true, onEnter: () => timeline.play() });
        }
      },
      element
    );

    return () => media.revert();
  }, []);

  return (
    <div ref={grid} className={styles.steps}>
      <span className={styles.stepsLine} data-steps-line aria-hidden="true" />
      {children}
    </div>
  );
}

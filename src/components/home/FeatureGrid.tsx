'use client';

import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './home.module.css';

/**
 * The "Practice with purpose" grid. Client-side so the section can stay a
 * server component:
 *  1. Scroll choreography: the lead card enters, its bars grow one by one, a
 *     trend line draws across them and the gain counts up; the two small cards
 *     follow with their own details.
 *  2. Parallax on the lead card's glow orbs.
 *  3. A soft spotlight that follows the cursor over each card.
 */
export function FeatureGrid({ children }: { children: ReactNode }) {
  const grid = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = grid.current;
    if (!element) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        const lead = element.querySelector<HTMLElement>('[data-feature-lead]');
        const smalls = gsap.utils.toArray<HTMLElement>('[data-feature-small]', element);

        // ScrollTrigger never fires for something already behind you, so decide
        // up front: passed -> show finished; in view -> play now; else wait.
        const playWhenReached = (
          target: HTMLElement,
          timeline: gsap.core.Timeline,
          delay = 0
        ) => {
          const { top, bottom } = target.getBoundingClientRect();
          if (bottom < 0) {
            timeline.progress(1);
            return;
          }
          timeline.delay(delay);
          if (top < window.innerHeight * 0.86) {
            timeline.play();
            return;
          }
          ScrollTrigger.create({
            trigger: target,
            start: 'top 86%',
            once: true,
            onEnter: () => timeline.play(),
          });
        };

        // Inline values are dropped at the end so CSS hover transforms keep working.
        // CSS transitions on transform/shadow would chase GSAP's per-frame values and
        // make the motion lag then snap, so they are off while a tween runs.
        const cleared = { transition: 'none', clearProps: 'transform,transformOrigin,opacity,transition' };

        if (lead) {
          const q = gsap.utils.selector(lead);
          const gain = q('[data-count]')[0] as HTMLElement | undefined;
          const counter = { value: 0 };
          const target = Number(gain?.dataset.count ?? 0);

          const timeline = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
          timeline
            .from(
              lead,
              {
                y: 80,
                opacity: 0,
                rotationX: -10,
                scale: 0.96,
                transformPerspective: 1300,
                transformOrigin: '50% 100%',
                duration: 1.15,
                ...cleared,
              },
              0
            )
            .from(q('[data-lead-item]'), { y: 26, opacity: 0, stagger: 0.09, duration: 0.8, clearProps: 'transform,opacity' }, 0.3)
            .from(
              q('[data-bar]'),
              { scaleY: 0, transformOrigin: '50% 100%', stagger: 0.08, duration: 1, clearProps: 'transform,transformOrigin' },
              0.85
            )
            .fromTo(
              q('[data-trend]'),
              { clipPath: 'inset(-25% 100% -25% -2%)' },
              { clipPath: 'inset(-25% -2% -25% -2%)', duration: 1.3, ease: 'power2.inOut', clearProps: 'clipPath' },
              1.5
            )
            .from(q('[data-delta]'), { opacity: 0, scale: 0.7, duration: 0.6, ease: 'back.out(2)', clearProps: 'transform,opacity' }, 1.6);

          if (gain) {
            timeline.to(
              counter,
              {
                value: target,
                duration: 1.4,
                ease: 'power2.out',
                onUpdate: () => {
                  gain.textContent = String(Math.round(counter.value));
                },
              },
              1.5
            );
          }

          playWhenReached(lead, timeline);

          // The glow orbs drift at different speeds as the section scrolls past.
          gsap.to(q('[data-orb]'), {
            yPercent: (index) => (index === 0 ? 24 : -20),
            ease: 'none',
            scrollTrigger: { trigger: lead, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
          });
        }

        smalls.forEach((card, index) => {
          const q = gsap.utils.selector(card);
          const timeline = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });

          timeline
            .from(
              card,
              {
                y: 60,
                x: 40,
                opacity: 0,
                rotationX: -8,
                transformPerspective: 1200,
                transformOrigin: '50% 100%',
                duration: 1,
                ...cleared,
              },
              0
            )
            .from(q('[data-feature-icon]'), { scale: 0.4, rotation: -30, opacity: 0, transition: 'none', duration: 0.8, ease: 'back.out(2.2)', clearProps: 'transform,opacity,transition' }, 0.25)
            .from(q('[data-feature-text]'), { y: 16, opacity: 0, stagger: 0.08, duration: 0.7, clearProps: 'transform,opacity' }, 0.32)
            .from(q('[data-feature-visual]'), { y: 16, opacity: 0, duration: 0.7, clearProps: 'transform,opacity' }, 0.6);

          // Each card has only one of these two decorations.
          if (q('[data-meter]').length) {
            timeline.fromTo(q('[data-meter]'), { scaleX: 0 }, { scaleX: 1, duration: 1.3, ease: 'power2.out', clearProps: 'transform' }, 0.85);
          }
          if (q('[data-shine]').length) {
            timeline.fromTo(q('[data-shine]'), { xPercent: -120 }, { xPercent: 260, duration: 1.3, ease: 'power2.inOut', clearProps: 'transform' }, 0.95);
          }

          playWhenReached(card, timeline, index === 0 ? 0.25 : 0.1);
        });
      },
      element
    );

    return () => media.revert();
  }, []);

  useEffect(() => {
    const element = grid.current;
    if (!element) return;

    const onPointerMove = (event: PointerEvent) => {
      const card = (event.target as Element).closest<HTMLElement>('[data-spotlight]');
      if (!card) return;

      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${event.clientX - bounds.left}px`);
      card.style.setProperty('--my', `${event.clientY - bounds.top}px`);
    };

    element.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => element.removeEventListener('pointermove', onPointerMove);
  }, []);

  return (
    <div ref={grid} className={styles.featureGrid}>
      {children}
    </div>
  );
}

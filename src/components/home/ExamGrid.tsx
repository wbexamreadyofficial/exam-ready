'use client';

import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './home.module.css';

/**
 * The exam-path card grid. Two client-side behaviours, so the section itself
 * can stay a server component:
 *  1. Scroll reveal: each card (and its icon and text) animates in as its row
 *     scrolls into view, staggered left to right.
 *  2. Spotlight: a soft glow follows the cursor across the hovered card.
 */
export function ExamGrid({ children }: { children: ReactNode }) {
  const grid = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = grid.current;
    if (!element) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        const cards = gsap.utils.toArray<HTMLElement>('[data-exam-card]', element);

        // Hidden up front so nothing flashes before its row is reached.
        gsap.set(cards, { opacity: 0 });

        const reveal = (batch: Element[]) => {
          const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

          batch.forEach((card, index) => {
            const at = index * 0.12;
            const icon = card.querySelector('[data-exam-icon]');
            const number = card.querySelector('[data-exam-number]');
            const text = card.querySelectorAll('[data-exam-text]');

            timeline
              .fromTo(
                card,
                {
                  y: 72,
                  opacity: 0,
                  rotationX: -16,
                  scale: 0.94,
                  transformPerspective: 1100,
                  transformOrigin: '50% 100%',
                },
                {
                  y: 0,
                  opacity: 1,
                  rotationX: 0,
                  scale: 1,
                  duration: 1.05,
                  // The end state is the CSS layout: drop every inline value so
                  // the hover lift (a CSS transform) works normally afterwards.
                  clearProps: 'transform,transformOrigin,opacity',
                },
                at
              )
              .from(
                icon,
                { scale: 0.4, rotation: -35, opacity: 0, duration: 0.8, ease: 'back.out(2.2)', clearProps: 'transform,opacity' },
                at + 0.25
              )
              .from(number, { opacity: 0, x: 10, duration: 0.6, clearProps: 'transform,opacity' }, at + 0.3)
              .from(
                text,
                { y: 14, opacity: 0, stagger: 0.07, duration: 0.7, clearProps: 'transform,opacity' },
                at + 0.32
              );
          });
        };

        // Cards the page has already scrolled past (reloaded mid-page, or the
        // browser restored the scroll position) owe no animation: ScrollTrigger
        // never fires for something already behind you, so show them at once.
        const trigger = window.innerHeight * 0.9;
        const bounds = new Map(cards.map((card) => [card, card.getBoundingClientRect()]));
        const passed = cards.filter((card) => bounds.get(card)!.bottom < 0);
        const inView = cards.filter((card) => {
          const { top, bottom } = bounds.get(card)!;
          return bottom >= 0 && top < trigger;
        });
        const upcoming = cards.filter((card) => bounds.get(card)!.top >= trigger);

        if (passed.length) gsap.set(passed, { clearProps: 'opacity' });
        if (inView.length) reveal(inView);

        // Batches the cards that enter together (a row) so they stagger as a
        // group; rows further down animate when they are reached.
        if (upcoming.length) {
          ScrollTrigger.batch(upcoming, {
            start: 'top 90%',
            end: 'max',
            once: true,
            interval: 0.1,
            batchMax: 3,
            onEnter: reveal,
          });
        }
      },
      element
    );

    return () => media.revert();
  }, []);

  useEffect(() => {
    const element = grid.current;
    if (!element) return;

    const onPointerMove = (event: PointerEvent) => {
      const card = (event.target as Element).closest<HTMLElement>('[data-exam-card]');
      if (!card) return;

      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${event.clientX - bounds.left}px`);
      card.style.setProperty('--my', `${event.clientY - bounds.top}px`);
    };

    element.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => element.removeEventListener('pointermove', onPointerMove);
  }, []);

  return (
    <div ref={grid} className={styles.examGrid}>
      {children}
    </div>
  );
}

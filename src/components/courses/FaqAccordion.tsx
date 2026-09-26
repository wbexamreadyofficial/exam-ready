'use client';

import { useId, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus } from 'lucide-react';
import styles from './courses.module.css';

/** Accordion (one open at a time, animated height) whose items rise in on scroll — the same pattern as the home page FAQ. */
export function FaqAccordion({ items }: { items: [string, string][] }) {
  const list = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(0);
  const baseId = useId();

  useLayoutEffect(() => {
    const element = list.current;
    if (!element) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        const rows = gsap.utils.toArray<HTMLElement>('[data-faq-item]', element);
        const timeline = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
        rows.forEach((row, index) => {
          const at = index * 0.22;
          timeline
            .from(row, { y: 44, x: 28, opacity: 0, duration: 1, force3D: true, clearProps: 'transform,opacity' }, at)
            .from(row.querySelectorAll('[data-faq-part]'), { y: 10, opacity: 0, stagger: 0.06, duration: 0.8, clearProps: 'transform,opacity' }, at + 0.25);
        });

        const { top, bottom } = element.getBoundingClientRect();
        if (bottom < 0) timeline.progress(1);
        else if (top < window.innerHeight * 0.75) timeline.play();
        else ScrollTrigger.create({ trigger: element, start: 'top 78%', once: true, onEnter: () => timeline.play() });
      },
      element
    );

    return () => media.revert();
  }, []);

  return (
    <div ref={list} className={styles.faqList}>
      {items.map(([question, answer], index) => {
        const isOpen = open === index;
        return (
          <div key={question} className={styles.faqItem} data-open={isOpen} data-faq-item>
            <h3>
              <button
                type="button"
                id={`${baseId}-q${index}`}
                aria-expanded={isOpen}
                aria-controls={`${baseId}-a${index}`}
                onClick={() => setOpen(isOpen ? -1 : index)}
              >
                <span className={styles.faqIndex} data-faq-part>0{index + 1}</span>
                <span className={styles.faqQuestion} data-faq-part>{question}</span>
                <span className={styles.faqToggle} data-faq-part aria-hidden="true">
                  <Plus size={16} />
                </span>
              </button>
            </h3>
            <div
              id={`${baseId}-a${index}`}
              role="region"
              aria-labelledby={`${baseId}-q${index}`}
              className={styles.faqAnswer}
            >
              <div>
                <p>{answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

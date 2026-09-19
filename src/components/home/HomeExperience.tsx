'use client';

import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function HomeExperience({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        gsap.from('[data-hero-reveal]', {
          y: 14,
          opacity: 0,
          duration: 0.7,
          stagger: 0.07,
          ease: 'power3.out',
          clearProps: 'all',
        });
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
          gsap.from(element, {
            y: 32,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            clearProps: 'all',
            scrollTrigger: { trigger: element, start: 'top 92%', once: true },
          });
        });
        gsap.utils.toArray<HTMLElement>('[data-grow]').forEach((element) => {
          gsap.from(element, {
            scaleY: 0,
            transformOrigin: 'bottom',
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 95%', once: true },
          });
        });
      },
      root
    );
    return () => media.revert();
  }, []);

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}

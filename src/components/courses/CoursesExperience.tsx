'use client';

import { useLayoutEffect, useRef, type ReactNode } from 'react';

// Reveal keyframes, keyed by an optional `data-reveal-variant`. "card" gets a
// slightly deeper rise plus a soft scale-in for a more premium entrance than
// the plain fade/slide every other section uses.
const REVEAL_VARIANTS: Record<string, Keyframe[]> = {
  default: [
    { opacity: 0, transform: 'translate3d(0, 22px, 0)' },
    { opacity: 1, transform: 'translate3d(0, 0, 0)' },
  ],
  card: [
    { opacity: 0, transform: 'translate3d(0, 34px, 0) scale(0.95)' },
    { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' },
  ],
  row: [
    { opacity: 0, transform: 'translate3d(28px, 0, 0)' },
    { opacity: 1, transform: 'translate3d(0, 0, 0)' },
  ],
};

/** Each reveal has one animation owner. Hover transforms belong to its child. */
export function CoursesExperience({ children, className }: { children: ReactNode; className: string }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer: IntersectionObserver | undefined;
    const animations = new Set<Animation>();
    const configure = () => {
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
      if (motion.matches) return;

      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          const keyframes = REVEAL_VARIANTS[target.dataset.revealVariant ?? 'default'] ?? REVEAL_VARIANTS.default;
          const animation = target.animate(
            keyframes,
            { duration: 800, delay: Number(target.dataset.delay ?? 0), easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' }
          );
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
          observer?.unobserve(target);
        });
      }, { threshold: 0.08 });
      element.querySelectorAll('[data-course-reveal]').forEach((target) => observer?.observe(target));
    };
    configure();
    motion.addEventListener('change', configure);

    // Measure the real header, including a wrapped/dismissed announcement. Only
    // update at the top: the shrinking sticky navbar must not reflow a scrolled hero.
    const header = document.querySelector<HTMLElement>('[data-public-header]');
    const measure = () => {
      if (header && window.scrollY < 2) element.style.setProperty('--course-header-height', `${header.offsetHeight}px`);
    };
    measure();
    const resize = new ResizeObserver(measure);
    if (header) resize.observe(header);
    return () => {
      resize.disconnect();
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      motion.removeEventListener('change', configure);
    };
  }, []);

  return <div ref={root} className={className}>{children}</div>;
}

'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/*
  Global smooth-scroll. Lenis intercepts native wheel/touch scrolling and
  drives it through its own rAF loop with easing, so the whole page (not
  just elements we opt in) scrolls smoothly.
*/
export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lenis: Lenis | undefined;
    let rafId = 0;

    function configure() {
      cancelAnimationFrame(rafId);
      lenis?.destroy();
      lenis = undefined;
      if (motion.matches) return;

      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        // Popovers with their own scroll area (Select/menu/dialog content, autocomplete lists)
        // must scroll natively; otherwise Lenis routes the wheel to the page behind them.
        prevent: (node) =>
          !!node.closest(
            '[role="listbox"], [role="menu"], [role="dialog"], [data-radix-popper-content-wrapper]'
          ),
      });
      rafId = requestAnimationFrame(raf);
    }

    function raf(time: number) {
      lenis?.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    configure();
    motion.addEventListener('change', configure);

    return () => {
      cancelAnimationFrame(rafId);
      lenis?.destroy();
      motion.removeEventListener('change', configure);
    };
  }, []);

  return <>{children}</>;
}

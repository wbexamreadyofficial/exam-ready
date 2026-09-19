'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/*
  Global smooth-scroll. Lenis intercepts native wheel/touch scrolling and
  drives it through its own rAF loop with easing, so the whole page (not
  just elements we opt in) scrolls smoothly.
*/
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
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

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

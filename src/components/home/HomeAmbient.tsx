'use client';

import dynamic from 'next/dynamic';
import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './home.module.css';

// The subpath keeps the rest of the ThreeUI catalog out of the homepage bundle.
const OrbitalSphere = dynamic(
  () =>
    import('@designcodeio/threeui/components/OrbitalSphereBackground').then(
      (module) => module.OrbitalSphereBackground
    ),
  { ssr: false, loading: () => null }
);

class AmbientFallback extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function HomeAmbient() {
  const host = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const update = () =>
      setActive(visible && !document.hidden && !motion.matches);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(element);
    document.addEventListener('visibilitychange', update);
    motion.addEventListener('change', update);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
      motion.removeEventListener('change', update);
    };
  }, []);

  return (
    <div ref={host} className={styles.ambientScene} aria-hidden="true">
      <div className={styles.ambientFallback} />
      {active && (
        <AmbientFallback>
          <OrbitalSphere
            speed={0.35}
            scale={1.4}
            particleSize={0.018}
            particleOpacity={0.75}
            orbitOpacity={0.3}
            haloOpacity={0.15}
            hue={30}
          />
        </AmbientFallback>
      )}
    </div>
  );
}

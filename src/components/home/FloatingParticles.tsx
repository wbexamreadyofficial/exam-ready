'use client';

import { useMemo } from 'react';

interface FloatingParticlesProps {
  count?: number;
  colors?: string[];
  className?: string;
  variant?: 'hero' | 'cta';
}

export function FloatingParticles({
  count = 12,
  colors = [
    'rgba(59, 130, 246, 0.3)',     // Blue
    'rgba(37, 99, 235, 0.25)',     // Deeper blue
    'rgba(245, 158, 11, 0.2)',     // Amber accent
    'rgba(14, 165, 233, 0.2)',     // Sky blue
    'rgba(139, 92, 246, 0.15)',    // Violet
  ],
  className = '',
  variant = 'hero',
}: FloatingParticlesProps) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const size = variant === 'hero' 
        ? Math.random() * 12 + 4 
        : Math.random() * 8 + 3;
      const animClass = `particle-${(i % 6) + 1}`;
      const color = colors[i % colors.length];
      const left = `${Math.random() * 100}%`;
      const top = `${Math.random() * 100}%`;
      const animDelay = `${Math.random() * 5}s`;

      return (
        <div
          key={i}
          className={`particle ${animClass}`}
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            left,
            top,
            animationDelay: animDelay,
            filter: size > 10 ? 'blur(1px)' : 'none',
          }}
          aria-hidden="true"
        />
      );
    });
  }, [count, colors, variant]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {particles}
    </div>
  );
}

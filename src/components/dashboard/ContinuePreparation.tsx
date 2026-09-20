'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useStudentDashboard } from '@/hooks/useStudentDashboard';
import type { ContinueStatus } from '@/lib/api/studentDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronLeft, Timer } from 'lucide-react';

const statusConfig: Record<ContinueStatus, { label: string; bg: string; text: string }> = {
  'in-progress': { label: 'In Progress', bg: 'bg-orange-50 dark:bg-orange-500/15', text: 'text-[#e2691f]' },
  'attempt-again': { label: 'Attempt Again', bg: 'bg-[var(--color-borange-50)] dark:bg-orange-900/20', text: 'text-[var(--color-data-premium)]' },
  'new': { label: 'New', bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' },
};

function getScoreColor(score: number) {
  if (score >= 80) return 'text-[var(--color-data-positive)]';
  if (score >= 60) return 'text-[var(--color-data-premium)]';
  return 'text-[var(--color-data-negative)]';
}

const clock = (totalSeconds: number) => {
  const safe = Math.max(0, totalSeconds);
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  return `${h > 0 ? `${String(h).padStart(2, '0')}:` : ''}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

/** Live countdown to the test's deadline, measured against the server's clock. */
function TimeLeft({ expiresAt, offset, onEnd }: { expiresAt: string; offset: number; onEnd: () => void }) {
  const deadline = new Date(expiresAt).getTime();
  const [left, setLeft] = useState(() => Math.max(0, Math.round((deadline - (Date.now() + offset)) / 1000)));

  useEffect(() => {
    const timer = setInterval(() => {
      const next = Math.max(0, Math.round((deadline - (Date.now() + offset)) / 1000));
      setLeft(next);
      if (next <= 0) onEnd();
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline, offset, onEnd]);

  const low = left <= 300;
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-medium',
        low ? 'border-red-300 bg-red-50 text-red-600 dark:border-red-400/40 dark:bg-red-500/10 dark:text-red-300' : 'border-orange-200 bg-orange-50/70 text-[#b9450d] dark:border-orange-400/30 dark:bg-orange-500/10 dark:text-orange-300'
      )}
    >
      <span className="flex items-center gap-1.5">
        <Timer className="h-3.5 w-3.5" /> Time left
      </span>
      <span className="font-mono text-sm font-bold tabular-nums">{clock(left)}</span>
    </div>
  );
}

export default function ContinuePreparation() {
  const { data, dataUpdatedAt, isLoading, refetch } = useStudentDashboard();
  const offset = data ? new Date(data.generatedAt).getTime() - dataUpdatedAt : 0;
  const cards = data?.continue ?? [];
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollerRef.current;
    if (!el) return;
    const onResize = () => updateScrollState();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [updateScrollState]);

  const scrollBy = (direction: 'left' | 'right') => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.85, 320);
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h2 className="display-card text-lg font-semibold text-[var(--color-ink-900)]">Continue Your Preparation</h2>
        <Link href="/student/mock-tests" className="text-sm font-medium text-[#c95817] hover:underline flex items-center">
          See All <ChevronRight size={16} />
        </Link>
      </div>

      <div className="relative">
        {/* Edge fades hint that the row scrolls horizontally, and hide
            once there's nothing left in that direction. */}
        <div
          className={cn(
            'pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[var(--color-surface-subtle)] to-transparent transition-opacity duration-200',
            canScrollLeft ? 'opacity-100' : 'opacity-0'
          )}
        />
        <div
          className={cn(
            'pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[var(--color-surface-subtle)] to-transparent transition-opacity duration-200',
            canScrollRight ? 'opacity-100' : 'opacity-0'
          )}
        />

        {/* Scroll buttons — desktop only, hidden if there's nothing to scroll to. */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollBy('left')}
            aria-label="Scroll left"
            className="hidden sm:flex absolute left-1 top-1/2 -translate-y-1/2 z-20 h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm text-[var(--color-ink-900)] hover:bg-[var(--color-surface-muted)] transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
        )}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scrollBy('right')}
            aria-label="Scroll right"
            className="hidden sm:flex absolute right-1 top-1/2 -translate-y-1/2 z-20 h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm text-[var(--color-ink-900)] hover:bg-[var(--color-surface-muted)] transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        )}

        <div
          ref={scrollerRef}
          onScroll={updateScrollState}
          data-lenis-prevent
          className="flex gap-3 overflow-x-auto pb-3 pt-1 px-1 dashboard-scrollbar scroll-smooth"
          style={{ scrollSnapType: 'x mandatory' }}
        >
        {isLoading &&
          Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="surface-card p-5 rounded-xl flex flex-col min-w-[82%] sm:min-w-[280px] max-w-[300px] shrink-0 border border-[var(--color-border)] space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="mt-4 h-9 w-full rounded-md" />
            </div>
          ))}
        {!isLoading && cards.length === 0 && (
          <div className="surface-card flex w-full items-center justify-between gap-4 rounded-xl p-6">
            <div>
              <p className="text-sm font-semibold">Nothing to continue yet</p>
              <p className="text-xs text-[var(--color-muted-foreground)]">Published mock tests will show up here as soon as they are available.</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/student/mock-tests">Browse mock tests</Link>
            </Button>
          </div>
        )}
        {cards.map((card) => {
          const config = statusConfig[card.status];
          let ctaText = 'Start';
          if (card.status === 'in-progress') ctaText = 'Resume';
          else if (card.status === 'attempt-again') ctaText = 'Retake';

          return (
            <div 
              key={card.id} 
              className="surface-card p-3.5 rounded-xl card-hover flex flex-col min-w-[82%] sm:min-w-[250px] max-w-[270px] shrink-0 border border-[var(--color-border)]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="flex items-center justify-between">
                <div className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap", config.bg, config.text)}>
                  {config.label}
                </div>
                <Badge variant="secondary" className="max-w-[55%] truncate text-[10px] uppercase tracking-wider" title={card.category}>{card.category}</Badge>
              </div>
              
              <h3 className="font-semibold text-[13px] leading-snug text-[var(--color-ink-900)] mt-2 line-clamp-2 min-h-[34px]">
                {card.title}
              </h3>
              
              <div className="text-[11px] text-[var(--color-muted-foreground)] mt-0.5 mb-2.5">
                {card.questionCount} Questions &middot; {card.durationMinutes} min
              </div>
              
              <div className="mt-auto pt-2.5 border-t border-[var(--color-hairline)] space-y-2.5">
                {card.status === 'in-progress' && card.expiresAt && (
                  <TimeLeft expiresAt={card.expiresAt} offset={offset} onEnd={() => void refetch()} />
                )}

                {card.status === 'in-progress' && card.progress !== undefined && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-medium text-[var(--color-muted-foreground)]">
                      <span>Progress</span>
                      <span>{card.progress}% Complete</span>
                    </div>
                    <Progress value={card.progress} className="h-1.5" />
                  </div>
                )}
                
                {card.status === 'attempt-again' && card.score !== undefined && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-muted-foreground)] text-xs">Previous Score</span>
                    <span className={cn("font-bold", getScoreColor(card.score))}>{card.score}%</span>
                  </div>
                )}
                
                <Button
                  asChild
                  size="sm"
                  className={cn(
                    'w-full h-7 text-[11px]',
                    card.status === 'in-progress' &&
                      'border-0 bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] font-semibold text-white shadow-md shadow-orange-600/30 hover:brightness-110'
                  )}
                  variant={card.status === 'in-progress' ? 'default' : 'outline'}
                >
                  <Link href={card.status === 'in-progress' && card.attemptId ? `/student/tests/attempt/${card.attemptId}` : `/student/tests/${card.setId}`}>
                    {ctaText}
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}

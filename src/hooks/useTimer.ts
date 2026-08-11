'use client';

import { useEffect, useRef } from 'react';
import { useExamStore } from '@/store/examStore';

export function useExamTimer(onExpire?: () => void) {
  const { timeLeft, setTimeLeft, status } = useExamStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status !== 'active') {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(Math.max(0, timeLeft - 1));
      if (timeLeft <= 1) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        onExpire?.();
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timeLeft, status, setTimeLeft, onExpire]);

  return { timeLeft };
}

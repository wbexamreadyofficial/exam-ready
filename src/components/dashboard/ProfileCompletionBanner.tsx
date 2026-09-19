'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, X } from 'lucide-react';
import { usersApi } from '@/lib/api/users';
import { useAuthStore } from '@/store/authStore';

function CircularProgress({
  value,
  size = 48,
  strokeWidth = 4,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(100, value)) / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className="stroke-[var(--color-hairline)]"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          stroke="var(--color-data-primary)"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-[var(--color-data-primary)]">
        {value}%
      </span>
    </div>
  );
}

/** Nudges the signed-in user (any role) to finish their profile — pulls
 *  live completion data from GET /api/users/profile-completion. Dismissible
 *  for the current session; reappears on next visit until actually complete. */
export function ProfileCompletionBanner() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [dismissed, setDismissed] = useState(false);

  const { data: completion } = useQuery({
    queryKey: ['profile-completion'],
    queryFn: usersApi.getProfileCompletion,
    enabled: !!user,
  });

  if (!user || !completion || completion.isComplete || dismissed) return null;

  const pendingLabels = completion.missingFields.map(({ label }) => {
    const stripped = label.replace(/^(add|choose) your /i, '');
    return stripped.charAt(0).toUpperCase() + stripped.slice(1);
  });

  return (
    <div className="relative flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] px-4 py-3.5 pr-11 sm:px-5 shadow-[0_1px_2px_rgba(30,64,110,0.05),0_6px_16px_-2px_rgba(30,64,110,0.08),0_16px_40px_-8px_rgba(30,64,110,0.16)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.4),0_10px_24px_-4px_rgba(0,0,0,0.6)]">
      <CircularProgress value={completion.completionPercentage} />

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-[var(--color-bblue-50)] dark:bg-orange-500/10 px-2.5 py-0.5 text-[11px] font-bold text-[var(--color-data-primary)]">
            Profile Completion
          </span>
          <p className="text-[13.5px] font-semibold text-[var(--color-ink-900)]">{completion.bannerText}</p>
        </div>
        {pendingLabels.length > 0 && (
          <p className="text-[12px] text-[var(--color-muted-foreground)] truncate">
            <span className="font-semibold text-[var(--color-ink-700)]">Pending fields:</span>{' '}
            {pendingLabels.join(', ')}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => router.push('/student/profile')}
        className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-data-primary)] px-4 py-2.5 text-[13px] font-bold text-white hover:opacity-90 transition-opacity"
      >
        Complete Profile
        <ArrowRight size={15} />
      </button>

      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="absolute right-3 top-3 text-[var(--color-muted-foreground)] hover:text-[var(--color-ink-900)] transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}

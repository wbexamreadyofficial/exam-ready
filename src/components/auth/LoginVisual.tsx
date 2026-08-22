'use client';

import { Check, Trophy, TrendingUp, Target } from 'lucide-react';

/*
  Static product visualisation for the Login page's brand panel.
  Where the Sign Up visual shows a test in progress, this one shows a
  COMPLETED result — the returning-user counterpart to "Welcome Back".

  Purely presentational: every figure is mock data. No state, no fetching,
  nothing wired to the form.

  All satellite chips sit in NORMAL FLOW below the card rather than being
  absolutely positioned over it, so they can never obscure card content or
  clip at narrow panel widths.
*/

/* Score trend across the last 8 attempts (percentages) */
const TREND = [52, 58, 55, 67, 71, 78, 84, 92];

const CHART_W = 268;
const CHART_H = 68;
const trendPoints = TREND.map((v, i) => ({
  x: (i / (TREND.length - 1)) * CHART_W,
  y: CHART_H - (v / 100) * (CHART_H - 8) - 4,
}));
const trendPath = trendPoints
  .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
  .join(' ');
const areaPath = `${trendPath} L ${CHART_W} ${CHART_H} L 0 ${CHART_H} Z`;

const RING_R = 26;
const RING_C = 2 * Math.PI * RING_R;

export function LoginVisual() {
  return (
    <div className="w-full max-w-[440px]">

      {/* ── Result card ── */}
      <div
        className="rounded-2xl border border-white/12 bg-white/[0.07] p-5 backdrop-blur-sm"
        style={{
          boxShadow:
            '0 24px 60px -12px rgba(0,0,0,0.55), 0 8px 24px -8px rgba(0,0,0,0.4), 0 0 48px -12px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-300">
              Result
            </p>
            <p className="mt-0.5 text-[13px] font-bold text-white">WBCS Prelims · Mock 14</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-400/15 px-2.5 py-1.5 ring-1 ring-emerald-400/30">
            <Check className="h-3 w-3 text-emerald-300" strokeWidth={3} />
            <span className="text-[10.5px] font-bold text-emerald-300">Completed</span>
          </span>
        </div>

        {/* Accuracy ring + question tally */}
        <div className="mb-5 flex items-center gap-5">
          <div className="relative h-[68px] w-[68px] shrink-0">
            <svg viewBox="0 0 68 68" className="h-[68px] w-[68px] -rotate-90">
              <circle cx="34" cy="34" r={RING_R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="6" />
              <circle
                cx="34" cy="34" r={RING_R} fill="none" stroke="#34D399" strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${RING_C * 0.92} ${RING_C}`}
              />
            </svg>
            <span className="tabular absolute inset-0 flex items-center justify-center text-[15px] font-extrabold text-white">
              92%
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/55">
              Accuracy
            </p>
            <p className="tabular mt-1 text-[19px] font-extrabold leading-none text-white">
              15<span className="text-white/45"> / 20</span>
            </p>
            <p className="mt-1.5 text-[11px] text-white/55">Questions correct</p>
          </div>
        </div>

        {/* Performance chart */}
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-white/70">Performance</span>
            <span className="text-[10px] text-white/45">Last 8 mocks</span>
          </div>
          <svg
            viewBox={`0 0 ${CHART_W} ${CHART_H}`}
            className="h-[68px] w-full"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="loginTrend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.42" />
                <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[16, 34, 52].map((y) => (
              <line key={y} x1="0" y1={y} x2={CHART_W} y2={y} stroke="rgba(255,255,255,0.09)" strokeWidth="1" />
            ))}
            <path d={areaPath} fill="url(#loginTrend)" />
            <path
              d={trendPath}
              fill="none"
              stroke="#60A5FA"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Latest point highlighted */}
            <circle
              cx={trendPoints[trendPoints.length - 1].x - 3}
              cy={trendPoints[trendPoints.length - 1].y}
              r="4"
              fill="#60A5FA"
              stroke="#0B1B33"
              strokeWidth="2.5"
            />
          </svg>
        </div>
      </div>

      {/* ── Satellite stat chips (normal flow — never overlap the card) ── */}
      <div className="mt-3.5 flex flex-wrap gap-3">
        <div className="flex flex-1 min-w-[150px] items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-400/15">
            <Trophy className="h-4 w-4 text-orange-300" />
          </div>
          <div className="min-w-0">
            <p className="tabular text-[13px] font-extrabold leading-none text-white">Top 8%</p>
            <p className="mt-1 text-[10px] text-white/55">Statewide rank</p>
          </div>
        </div>

        <div className="flex flex-1 min-w-[150px] items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/15">
            <TrendingUp className="h-4 w-4 text-emerald-300" />
          </div>
          <div className="min-w-0">
            <p className="tabular text-[13px] font-extrabold leading-none text-white">+24%</p>
            <p className="mt-1 text-[10px] text-white/55">Progress this month</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-3">
          <Target className="h-4 w-4 shrink-0 text-blue-300" />
          <span className="whitespace-nowrap text-[11.5px] font-bold text-white">24-day streak</span>
        </div>
      </div>
    </div>
  );
}

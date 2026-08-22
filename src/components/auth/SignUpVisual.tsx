'use client';

import { Check, Clock, TrendingUp, Target } from 'lucide-react';

/*
  Static product visualisation for the Sign Up page's brand panel.
  Purely presentational — every value here is mock data used to convey
  what the platform does (attempt → analyse → improve). No state, no data
  fetching, nothing wired to the form.
*/

const OPTIONS = [
  { key: 'A', label: 'Bay of Bengal', state: 'idle' as const },
  { key: 'B', label: 'Arabian Sea', state: 'idle' as const },
  { key: 'C', label: 'Indian Ocean', state: 'correct' as const },
  { key: 'D', label: 'Andaman Sea', state: 'idle' as const },
];

/* Question palette states: answered / flagged / unseen */
const PALETTE = [
  'a','a','a','f','a','a','a','a','f','a',
  'a','c','u','u','a','a','u','u','u','u',
];

const PALETTE_STYLE: Record<string, string> = {
  a: 'bg-emerald-400/90 text-emerald-950',
  f: 'bg-orange-400/90 text-orange-950',
  c: 'bg-white text-slate-900 ring-2 ring-white/70',
  u: 'bg-white/10 text-white/40',
};

export function SignUpVisual() {
  return (
    <div className="relative w-full max-w-[460px]">

      {/* ── Main mock-test card ── */}
      <div
        className="relative rounded-2xl border border-white/12 bg-white/[0.07] backdrop-blur-sm p-5"
        style={{
          /* Stronger, softer elevation + a cool glow so the card reads as a
             floating UI mockup rather than a flat panel inlay. */
          boxShadow:
            '0 24px 60px -12px rgba(0,0,0,0.55), 0 8px 24px -8px rgba(0,0,0,0.4), 0 0 48px -12px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >

        {/* Card header — exam name + timer */}
        <div className="flex items-center justify-between mb-5">
          <div>
            {/* Brightened from blue-300/80 → solid blue-300 for legibility */}
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-300">
              Mock Test
            </p>
            <p className="text-[13px] font-bold text-white mt-0.5">WBCS Prelims · Paper I</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5">
            <Clock className="h-3.5 w-3.5 text-orange-300" />
            <span className="tabular text-[12px] font-bold text-white">42:18</span>
          </div>
        </div>

        {/* Question progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-white/60">Question 12 of 100</span>
            <span className="tabular text-[11px] font-bold text-white/80">12%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[12%] rounded-full bg-gradient-to-r from-blue-400 to-blue-300" />
          </div>
        </div>

        {/* Question stem */}
        <p className="text-[13px] font-semibold leading-relaxed text-white/90 mb-3.5">
          The Sundarbans delta opens into which body of water?
        </p>

        {/* Options */}
        <div className="space-y-2">
          {OPTIONS.map((opt) => (
            <div
              key={opt.key}
              className={[
                'flex items-center gap-2.5 rounded-lg border px-3 py-2.5 transition-colors',
                opt.state === 'correct'
                  ? 'border-emerald-400/50 bg-emerald-400/15'
                  : 'border-white/10 bg-white/[0.04]',
              ].join(' ')}
            >
              <span
                className={[
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold',
                  opt.state === 'correct'
                    ? 'bg-emerald-400 text-emerald-950'
                    : 'bg-white/10 text-white/60',
                ].join(' ')}
              >
                {opt.state === 'correct' ? <Check className="h-3 w-3" strokeWidth={3} /> : opt.key}
              </span>
              <span
                className={[
                  'text-[12px] font-medium',
                  opt.state === 'correct' ? 'text-white' : 'text-white/80',
                ].join(' ')}
              >
                {opt.label}
              </span>
            </div>
          ))}
        </div>

        {/* Question palette */}
        <div className="mt-5 border-t border-white/10 pt-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/60 mb-2.5">
            Question Palette
          </p>
          <div className="grid grid-cols-10 gap-1.5">
            {PALETTE.map((s, i) => (
              <span
                key={i}
                className={`flex h-5 items-center justify-center rounded text-[9px] font-bold ${PALETTE_STYLE[s]}`}
              >
                {i + 1}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/*
        ── Stat badges ──
        These sit in normal flow BELOW the card, not absolutely positioned over
        it. Previously the rank badge (-left-6 bottom-14) covered palette cells
        13–14 and the streak badge covered the bottom-right of the grid. Placing
        them in a row guarantees all 20 palette numbers stay fully visible and
        removes any possibility of clipping at narrow panel widths.
      */}
      <div className="mt-4 flex flex-wrap items-stretch gap-3">

        {/* Accuracy */}
        <div className="flex flex-1 min-w-[190px] items-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-3">
          <div className="relative h-11 w-11 shrink-0">
            <svg viewBox="0 0 44 44" className="h-11 w-11 -rotate-90">
              <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="4" />
              <circle
                cx="22" cy="22" r="18" fill="none" stroke="#34D399" strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 18 * 0.86} ${2 * Math.PI * 18}`}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center tabular text-[10.5px] font-extrabold text-white">
              86%
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/55">Accuracy</p>
            <p className="text-[12px] font-bold text-emerald-400">Above average</p>
          </div>
        </div>

        {/* Rank */}
        <div className="flex flex-1 min-w-[170px] items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/20">
            <TrendingUp className="h-4 w-4 text-blue-300" />
          </div>
          <div className="min-w-0">
            <p className="tabular text-[13px] font-extrabold leading-none text-white">Rank 128</p>
            <p className="mt-1 text-[10px] text-white/55">Top 4% statewide</p>
          </div>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-3">
          <Target className="h-4 w-4 shrink-0 text-orange-300" />
          <span className="whitespace-nowrap text-[11.5px] font-bold text-white">18-day streak</span>
        </div>
      </div>
    </div>
  );
}

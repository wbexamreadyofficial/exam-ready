'use client';

import { LogoIcon } from '@/components/ui/Logo';
import {
  LayoutDashboard, FileText, BookOpen, BarChart3,
  Bookmark, PieChart, Settings, HelpCircle,
  RefreshCw, User, TrendingUp, Clock, CheckCircle2, Layers,
} from 'lucide-react';

/* ── Smooth bezier curve through data points ── */
function smoothCurve(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const cpx = (p0.x + p1.x) / 2;
    d += ` C ${cpx} ${p0.y} ${cpx} ${p1.y} ${p1.x} ${p1.y}`;
  }
  return d;
}

/* Chart points — SVG 220 × 72 viewport */
const PTS = [
  { x: 0,   y: 60 }, { x: 28,  y: 52 }, { x: 56,  y: 55 },
  { x: 84,  y: 38 }, { x: 112, y: 44 }, { x: 150, y: 22 },
  { x: 180, y: 28 }, { x: 220, y: 14 },
];
const LINE_PATH = smoothCurve(PTS);
const AREA_PATH = `${LINE_PATH} L 220 72 L 0 72 Z`;
const CIRC_R    = 14;
const CIRC_C    = 2 * Math.PI * CIRC_R;

/* ── Sidebar items ── */
const SIDEBAR = [
  { Icon: LayoutDashboard, label: 'Dashboard',     active: true  },
  { Icon: FileText,        label: 'Mock Tests',    active: false },
  { Icon: BookOpen,        label: 'Courses',       active: false },
  { Icon: TrendingUp,      label: 'Practice',      active: false },
  { Icon: BarChart3,       label: 'Results',       active: false },
  { Icon: Bookmark,        label: 'Bookmarks',     active: false },
  { Icon: PieChart,        label: 'Analytics',     active: false },
  { Icon: Settings,        label: 'Settings',      active: false },
  { Icon: HelpCircle,      label: 'Help & Support',active: false },
];

/* ── Stat cards ── */
const STATS = [
  { val: '20',   sub: 'Mock Tests\nAttempted', bg: '#EFF6FF', bd: '#BFDBFE', tc: '#2563EB', Icon: FileText    },
  { val: '85%',  sub: 'Average\nScore',        bg: '#FFFBEB', bd: '#FDE68A', tc: '#D97706', Icon: BarChart3   },
  { val: '18',   sub: 'Tests\nQualified',      bg: '#F0FDF4', bd: '#BBF7D0', tc: '#16A34A', Icon: CheckCircle2},
  { val: '248h', sub: 'Total Study\nTime',     bg: '#FAF5FF', bd: '#DDD6FE', tc: '#7C3AED', Icon: Clock       },
];

/* ── Recommended cards ── */
const RECS = [
  { label: 'Full Length Test',     sub: '100 Questions',    bg: '#DBEAFE', Icon: FileText,   tc: '#2563EB' },
  { label: 'Topic Wise Test',      sub: '80+ Topics',       bg: '#FEF3C7', Icon: Bookmark,   tc: '#D97706' },
  { label: 'Previous Year Papers', sub: '2015 – 2023',      bg: '#EDE9FE', Icon: Layers,     tc: '#7C3AED' },
  { label: 'Daily Practice',       sub: 'Boost Your Score', bg: '#DCFCE7', Icon: TrendingUp, tc: '#16A34A' },
];

/* ════════════════════════════════════════════
   Phone panel
═══════════════════════════════════════════ */
function PhonePanel() {
  return (
    <div style={{
      background: '#1a2233',
      borderRadius: 24,
      padding: 4,
      width: 130,
      boxShadow: '0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
    }}>
      <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden' }}>

        {/* Top bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '7px 9px', borderBottom: '1px solid #f1f5f9',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <LogoIcon className="h-4 w-4" />
            <span style={{ fontWeight: 900, fontSize: 7.5 }}>
              <span style={{ color: '#0066FF' }}>Exam</span>
              <span style={{ color: '#F59E0B' }}>Ready</span>
            </span>
          </div>
          <div style={{
            width: 20, height: 20, borderRadius: '50%', background: '#F59E0B',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <User style={{ width: 12, height: 12, color: '#fff' }} />
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '9px 9px 5px' }}>
          <div style={{ fontWeight: 800, fontSize: 9, color: '#1e293b', marginBottom: 1 }}>Hello, Aspirant! 👋</div>
          <div style={{ fontSize: 6.5, color: '#94a3b8', marginBottom: 9 }}>Ready to test your preparation?</div>

          {/* Daily Practice card */}
          <div style={{
            background: '#2563EB', borderRadius: 11, padding: '9px 9px',
            color: '#fff', marginBottom: 9,
          }}>
            <div style={{ fontWeight: 700, fontSize: 8.5, marginBottom: 2 }}>Daily Practice</div>
            <div style={{ fontSize: 7, opacity: 0.8, marginBottom: 7 }}>Test your knowledge daily</div>
            <button style={{
              background: '#fff', color: '#2563EB', fontWeight: 700,
              border: 'none', borderRadius: 7, padding: '3px 9px', fontSize: 7.5, cursor: 'pointer',
            }}>
              Start Now
            </button>
          </div>

          {/* Progress */}
          <div style={{ marginBottom: 6 }}>
            <div style={{ fontWeight: 600, fontSize: 7.5, color: '#475569', marginBottom: 3 }}>Your Progress</div>
            <div style={{ fontWeight: 900, fontSize: 18, lineHeight: 1, color: '#1e293b' }}>85%</div>
            <div style={{ fontSize: 6.5, color: '#94a3b8', marginBottom: 5 }}>Average Score</div>
            <svg viewBox="0 0 100 24" style={{ width: '100%', height: 22 }}>
              <polyline
                points="0,20 16,16 32,18 50,10 66,12 82,6 100,3"
                fill="none" stroke="#F59E0B" strokeWidth="2"
                strokeLinejoin="round" strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Bottom nav */}
          <div style={{
            display: 'flex', justifyContent: 'space-around', alignItems: 'center',
            paddingTop: 6, borderTop: '1px solid #f1f5f9',
          }}>
            {[LayoutDashboard, FileText, TrendingUp, BarChart3, User].map((Icon, i) => (
              <Icon key={i} style={{ width: 14, height: 14, color: i === 0 ? '#2563EB' : '#94a3b8' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   Main exported component
═══════════════════════════════════════════ */
export function HeroDashboard() {
  return (
    /* Outer wrapper — overflow MUST be visible so hinge/base render below screen */
    <div style={{ position: 'relative', width: '100%', maxWidth: 700, paddingBottom: 70, overflow: 'visible' }}>

      {/* Soft background glow matching design reference Image 1 */}
      <div style={{
        position: 'absolute', inset: -60,
        background: 'radial-gradient(circle at 65% 20%, rgba(191,219,254,0.75) 0%, transparent 55%), radial-gradient(circle at 95% 95%, rgba(255,208,0,0.85) 0%, transparent 45%)',
        filter: 'blur(30px)', pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ═══ LAPTOP WRAPPER ═══ */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Screen bezel (top rounded, NO overflow:hidden so base shows) ── */}
        <div style={{
          background: 'linear-gradient(180deg,#2a3347 0%,#1a2233 100%)',
          borderRadius: '18px 18px 0 0',
          padding: '9px 9px 10px 9px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)',
        }}>
          {/* Traffic lights */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 7, paddingLeft: 3 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEBC2E' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840' }} />
          </div>

          {/* ── Screen ── */}
          <div style={{
            background: '#f1f5f9',
            borderRadius: '9px',
            overflow: 'hidden',
            height: 356,
            display: 'flex',
            fontSize: 10,
          }}>
            {/* SIDEBAR */}
            <div style={{
              width: 112, background: '#fff',
              borderRight: '1px solid #e2e8f0',
              display: 'flex', flexDirection: 'column',
              paddingTop: 10, flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 9px', marginBottom: 13 }}>
                <LogoIcon className="h-5 w-5" />
                <span style={{ fontWeight: 900, fontSize: 9.5 }}>
                  <span style={{ color: '#0066FF' }}>Exam</span>
                  <span style={{ color: '#F59E0B' }}>Ready</span>
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, padding: '0 6px' }}>
                {SIDEBAR.map(({ Icon, label, active }) => (
                  <div key={label} style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    borderRadius: 7, padding: '5px 7px',
                    background: active ? '#2563EB' : 'transparent',
                    color: active ? '#fff' : '#64748b',
                    fontWeight: active ? 700 : 400,
                    fontSize: 8, cursor: 'pointer',
                    whiteSpace: 'nowrap', overflow: 'hidden',
                  }}>
                    <Icon style={{ width: 9.5, height: 9.5, flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* MAIN CONTENT */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Topbar */}
              <div style={{
                background: '#fff', borderBottom: '1px solid #e2e8f0',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 13px', flexShrink: 0,
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 11, color: '#1e293b' }}>Welcome back, Aspirant! 👋</div>
                  <div style={{ fontSize: 8, color: '#94a3b8' }}>Let's continue your preparation.</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <RefreshCw style={{ width: 11, height: 11, color: '#94a3b8' }} />
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', background: '#F59E0B',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <User style={{ width: 14, height: 14, color: '#fff' }} />
                  </div>
                </div>
              </div>

              {/* Scrollable panel */}
              <div style={{
                flex: 1, padding: '10px 11px 8px',
                display: 'flex', flexDirection: 'column', gap: 9,
                overflow: 'hidden',
              }}>
                {/* STAT CARDS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 9 }}>
                  {STATS.map(({ val, sub, bg, bd, tc, Icon }) => (
                    <div key={val} style={{
                      background: bg, border: `1px solid ${bd}`,
                      borderRadius: 11, padding: '9px 8px 7px',
                    }}>
                      <Icon style={{ width: 13, height: 13, color: tc, marginBottom: 4 }} />
                      <div style={{ fontWeight: 900, fontSize: 16, lineHeight: 1, color: tc }}>{val}</div>
                      <div style={{ fontSize: 7, color: '#94a3b8', whiteSpace: 'pre-line', marginTop: 3, lineHeight: 1.35 }}>{sub}</div>
                    </div>
                  ))}
                </div>

                {/* CHART + RECENT TEST */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 9, flex: 1, minHeight: 0 }}>
                  {/* Performance Overview */}
                  <div style={{ background: '#fff', borderRadius: 11, border: '1px solid #e2e8f0', padding: '9px 9px 6px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                      <span style={{ fontWeight: 700, color: '#334155', fontSize: 9 }}>Performance Overview</span>
                      <span style={{ fontSize: 7, color: '#94a3b8' }}>Last 8 Tests</span>
                    </div>
                    <div style={{ display: 'flex', gap: 4, flex: 1 }}>
                      {/* Y-axis */}
                      <div style={{
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                        textAlign: 'right', fontSize: 6.5, color: '#94a3b8', paddingRight: 2, paddingBottom: 14,
                      }}>
                        {['100','75','50','25','0'].map(v => <span key={v}>{v}</span>)}
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <svg viewBox="0 0 220 72" style={{ width: '100%', flex: 1 }} preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="aG" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.22" />
                              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.02" />
                            </linearGradient>
                          </defs>
                          {[0,18,36,54,72].map(y => (
                            <line key={y} x1="0" y1={y} x2="220" y2={y} stroke="#e2e8f0" strokeWidth="0.6" />
                          ))}
                          <path d={AREA_PATH} fill="url(#aG)" />
                          <path d={LINE_PATH} fill="none" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                          {PTS.map((p, i) => (
                            <circle key={i} cx={p.x} cy={p.y} r="3" fill="#F59E0B" stroke="#fff" strokeWidth="1.2" />
                          ))}
                        </svg>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 6, color: '#94a3b8', marginTop: 3 }}>
                          {['May 10','May 17','May 24','May 31','Jun 7','Jun 14'].map(d => <span key={d}>{d}</span>)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Test */}
                  <div style={{ background: '#fff', borderRadius: 11, border: '1px solid #e2e8f0', padding: '9px 9px 7px' }}>
                    <div style={{ fontWeight: 700, color: '#334155', fontSize: 9, marginBottom: 7 }}>Recent Test</div>
                    <div style={{ background: '#f8fafc', borderRadius: 9, border: '1px solid #e2e8f0', padding: '8px 9px' }}>
                      <div style={{ fontWeight: 700, fontSize: 8, color: '#334155', lineHeight: 1.3, marginBottom: 3 }}>SSC CGL Tier1 Mock Test</div>
                      <div style={{ fontSize: 6.5, color: '#94a3b8', marginBottom: 9 }}>Attempted on 21 May 2024</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        {/* Circular progress */}
                        <div style={{ position: 'relative', width: 48, height: 48, flexShrink: 0 }}>
                          <svg viewBox="0 0 48 48" style={{ width: 48, height: 48, transform: 'rotate(-90deg)' }}>
                            <circle cx="24" cy="24" r={CIRC_R} fill="none" stroke="#e2e8f0" strokeWidth="4.5" />
                            <circle
                              cx="24" cy="24" r={CIRC_R} fill="none" stroke="#3b82f6" strokeWidth="4.5"
                              strokeDasharray={`${CIRC_C * 0.72} ${CIRC_C}`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div style={{
                            position: 'absolute', inset: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 800, fontSize: 9, color: '#3b82f6',
                          }}>72%</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 7, color: '#94a3b8', marginBottom: 5 }}>Score</div>
                          <button style={{
                            background: '#F59E0B', color: '#fff', border: 'none',
                            borderRadius: 7, padding: '4px 9px', fontSize: 7.5, fontWeight: 700, cursor: 'pointer',
                          }}>View Analysis</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RECOMMENDED */}
                <div>
                  <div style={{ fontWeight: 700, color: '#334155', fontSize: 9, marginBottom: 7 }}>Recommended for You</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 9 }}>
                    {RECS.map(({ label, sub, bg, Icon, tc }) => (
                      <div key={label} style={{ background: bg, borderRadius: 11, padding: '9px 8px 7px' }}>
                        <Icon style={{ width: 13, height: 13, color: tc, marginBottom: 5 }} />
                        <div style={{ fontWeight: 700, fontSize: 8, color: '#334155', lineHeight: 1.3 }}>{label}</div>
                        <div style={{ fontSize: 6.5, color: '#64748b', marginTop: 2 }}>{sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>{/* end scrollable */}
            </div>{/* end main content */}
          </div>{/* end screen */}
        </div>{/* end bezel */}

        {/* ── Hinge bar — must be OUTSIDE the bezel div ── */}
        <div style={{
          height: 13,
          background: 'linear-gradient(180deg,#1e2a3a 0%,#141c2b 100%)',
          margin: '0 22px',
          position: 'relative',
          zIndex: 2,
        }} />

        {/* ── Base / foot bar ── */}
        <div style={{
          height: 9,
          background: 'linear-gradient(180deg,#141c2b 0%,#0d1420 100%)',
          borderRadius: '0 0 16px 16px',
          boxShadow: '0 10px 36px rgba(0,0,0,0.5)',
          position: 'relative',
          zIndex: 2,
        }} />
      </div>{/* end laptop wrapper */}

      {/* ═══ PHONE — absolute, right side, extends below laptop base ═══ */}
      <div style={{
        position: 'absolute',
        right: -10,
        bottom: 0,
        zIndex: 10,
        overflow: 'visible',
      }}>
        <PhonePanel />
      </div>

    </div>
  );
}

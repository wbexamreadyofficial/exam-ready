'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Trophy, ChevronLeft, ChevronRight, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';

interface Ranker {
  rank: number;
  name: string;
  district: string;
  exam: string;
  score: string;
  accuracy: string;
  medal: string;
  avatarBg: string;
  badgeBg: string;
  borderColor: string;
}

const RANKER_SLIDES: Ranker[][] = [
  // Slide 1: Top 1 - 3
  [
    {
      rank: 1,
      name: 'Sourav Ganguly',
      district: 'Kolkata District',
      exam: 'WB Constable Prelims',
      score: '94 / 100',
      accuracy: '98% Accuracy',
      medal: '🥇',
      avatarBg: 'bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 text-slate-950',
      badgeBg: 'bg-amber-400 text-slate-950 font-black',
      borderColor: 'border-amber-400/80 shadow-amber-500/20',
    },
    {
      rank: 2,
      name: 'Ananya Roy',
      district: 'Howrah District',
      exam: 'PSC Clerkship Stage-1',
      score: '91 / 100',
      accuracy: '95% Accuracy',
      medal: '🥈',
      avatarBg: 'bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 text-slate-950',
      badgeBg: 'bg-slate-300 text-slate-950 font-bold',
      borderColor: 'border-slate-400/80 shadow-slate-500/20',
    },
    {
      rank: 3,
      name: 'Subhashish Das',
      district: 'Siliguri District',
      exam: 'WB Food SI Special',
      score: '88 / 100',
      accuracy: '93% Accuracy',
      medal: '🥉',
      avatarBg: 'bg-gradient-to-br from-amber-700 via-amber-800 to-yellow-900 text-white',
      badgeBg: 'bg-amber-700 text-white font-bold',
      borderColor: 'border-amber-700/80 shadow-amber-700/20',
    },
  ],
  // Slide 2: Ranks 4 - 6
  [
    {
      rank: 4,
      name: 'Priya Banerjee',
      district: 'Burdwan District',
      exam: 'WB SI Preliminary',
      score: '86 / 100',
      accuracy: '92% Accuracy',
      medal: '🏅',
      avatarBg: 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white',
      badgeBg: 'bg-purple-600 text-white font-bold',
      borderColor: 'border-purple-400/80 shadow-purple-500/20',
    },
    {
      rank: 5,
      name: 'Rajesh Mondal',
      district: 'Midnapore District',
      exam: 'Primary Teacher TET',
      score: '135 / 150',
      accuracy: '91% Accuracy',
      medal: '🌟',
      avatarBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white',
      badgeBg: 'bg-emerald-600 text-white font-bold',
      borderColor: 'border-emerald-400/80 shadow-emerald-500/20',
    },
    {
      rank: 6,
      name: 'Sneha Chakraborty',
      district: 'Hooghly District',
      exam: 'WB Health GNM/ANM',
      score: '84 / 100',
      accuracy: '90% Accuracy',
      medal: '✨',
      avatarBg: 'bg-gradient-to-br from-rose-500 to-pink-600 text-white',
      badgeBg: 'bg-rose-600 text-white font-bold',
      borderColor: 'border-rose-400/80 shadow-rose-500/20',
    },
  ],
  // Slide 3: Ranks 7 - 9
  [
    {
      rank: 7,
      name: 'Amitabh Mukherjee',
      district: 'Asansol District',
      exam: 'PSC Miscellaneous',
      score: '83 / 100',
      accuracy: '89% Accuracy',
      medal: '⭐',
      avatarBg: 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white',
      badgeBg: 'bg-blue-600 text-white font-bold',
      borderColor: 'border-blue-400/80 shadow-blue-500/20',
    },
    {
      rank: 8,
      name: 'Debolina Paul',
      district: 'Malda District',
      exam: 'WB Constable Mains',
      score: '82 / 100',
      accuracy: '88% Accuracy',
      medal: '🎯',
      avatarBg: 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white',
      badgeBg: 'bg-indigo-600 text-white font-bold',
      borderColor: 'border-indigo-400/80 shadow-indigo-500/20',
    },
    {
      rank: 9,
      name: 'Vikramjit Ghosh',
      district: 'Cooch Behar District',
      exam: 'WB Food SI Grand Mock',
      score: '81 / 100',
      accuracy: '87% Accuracy',
      medal: '🚀',
      avatarBg: 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white',
      badgeBg: 'bg-teal-600 text-white font-bold',
      borderColor: 'border-teal-400/80 shadow-teal-500/20',
    },
  ],
  // Slide 4: Ranks 10 - 12
  [
    {
      rank: 10,
      name: 'Swati Sengupta',
      district: 'Nadia District',
      exam: 'PSC Clerkship Part-1',
      score: '80 / 100',
      accuracy: '86% Accuracy',
      medal: '💎',
      avatarBg: 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white',
      badgeBg: 'bg-cyan-600 text-white font-bold',
      borderColor: 'border-cyan-400/80 shadow-cyan-500/20',
    },
    {
      rank: 11,
      name: 'Aritra Bhattacharya',
      district: 'Murshidabad District',
      exam: 'WB SI Sergeant Paper',
      score: '79 / 100',
      accuracy: '85% Accuracy',
      medal: '🏆',
      avatarBg: 'bg-gradient-to-br from-amber-600 to-orange-600 text-white',
      badgeBg: 'bg-amber-600 text-white font-bold',
      borderColor: 'border-amber-500/80 shadow-amber-600/20',
    },
    {
      rank: 12,
      name: 'Puja Karmakar',
      district: 'Bankura District',
      exam: 'Primary TET Complete',
      score: '128 / 150',
      accuracy: '84% Accuracy',
      medal: '🌟',
      avatarBg: 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white',
      badgeBg: 'bg-emerald-600 text-white font-bold',
      borderColor: 'border-emerald-500/80 shadow-emerald-600/20',
    },
  ],
];

export function RankersCarousel() {
  const { t } = useTranslation();
  const [activeSlide, setActiveSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const totalSlides = RANKER_SLIDES.length;

  // Auto-play interval every 3 seconds (3000ms) with reliable state update
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, 3000);

    return () => clearInterval(timer);
  }, [totalSlides]);

  const handlePrev = () => {
    setActiveSlide((prev) => (prev <= 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) handleNext();
    if (diff < -40) handlePrev();
    touchStartX.current = null;
  };

  return (
    <section className="py-10">
      <div className="container max-w-5xl">
        <div
          className="p-6 md:p-10 rounded-3xl bg-slate-950 text-white shadow-2xl border border-slate-800 relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Vibrant Two-Tone Dual-Color Animated Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-slate-900/90 overflow-hidden z-20 border-b border-amber-400/40">
            <div
              key={activeSlide}
              className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 via-emerald-400 to-cyan-400 shadow-[0_0_20px_rgba(250,204,21,0.95)]"
              style={{
                animation: 'progress 3s linear infinite',
              }}
            />
          </div>

          {/* Background Ambient Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 relative z-10 gap-4 pt-2">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-400 font-extrabold text-xs mb-2 border border-amber-500/30 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>Statewide Live Leaderboard Spotlight</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">{t.rankers.title}</h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">{t.rankers.subtitle}</p>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrev}
                className="h-10 w-10 rounded-full border-slate-700 bg-slate-900/90 text-white hover:bg-amber-500 hover:text-slate-950 transition-colors shadow-md"
                aria-label="Previous Rankers"
              >
                <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                className="h-10 w-10 rounded-full border-slate-700 bg-slate-900/90 text-white hover:bg-amber-500 hover:text-slate-950 transition-colors shadow-md"
                aria-label="Next Rankers"
              >
                <ChevronRight className="h-5 w-5 stroke-[2.5]" />
              </Button>
            </div>
          </div>

          {/* Slide Window */}
          <div className="relative z-10 w-full py-2 px-1">
            {RANKER_SLIDES.map((slideGroup, slideIdx) => {
              if (activeSlide !== slideIdx) return null;
              return (
                <div
                  key={slideIdx}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 animate-fade-in w-full"
                >
                  {slideGroup.map((ranker) => (
                    <div
                      key={ranker.rank}
                      className={`p-5 rounded-2xl bg-slate-900/95 border-2 ${ranker.borderColor} shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative group w-full`}
                    >
                      {/* Rank Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xl ${ranker.avatarBg} shadow-md`}>
                          {ranker.medal}
                        </div>
                        <span className={`text-[11px] px-3 py-1 rounded-full uppercase ${ranker.badgeBg}`}>
                          Rank #{ranker.rank}
                        </span>
                      </div>

                      {/* Ranker Info */}
                      <div className="mb-4">
                        <h3 className="font-black text-lg text-white mb-0.5 tracking-tight truncate">{ranker.name}</h3>
                        <div className="flex items-center gap-1 text-xs text-slate-400 font-semibold mb-2">
                          <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">{ranker.district}</span>
                        </div>
                        <div className="inline-block px-3 py-1 rounded-xl bg-slate-800/80 text-[11px] font-bold text-amber-300 border border-slate-700/60 truncate max-w-full">
                          {ranker.exam}
                        </div>
                      </div>

                      {/* Score Bar */}
                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" /> {ranker.accuracy}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-black text-xs shadow-md">
                          Score: {ranker.score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Active Page Indicator Pills */}
          <div className="flex items-center justify-center gap-2.5 mt-8 relative z-10">
            {RANKER_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  activeSlide === i
                    ? 'w-10 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 shadow-md shadow-amber-500/50 border border-amber-300'
                    : 'w-3 bg-slate-800 hover:bg-slate-700 border border-slate-700'
                }`}
                aria-label={`Go to slide page ${i + 1}`}
              />
            ))}
          </div>

          {/* Footer CTA */}
          <div className="text-center mt-6 relative z-10">
            <Button variant="outline" size="sm" className="border-slate-700 text-white hover:bg-slate-900 hover:border-amber-400 font-bold gap-2 text-xs h-9 px-5" asChild>
              <Link href="/leaderboard">
                <Trophy className="h-4 w-4 text-amber-400" /> View Statewide Leaderboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

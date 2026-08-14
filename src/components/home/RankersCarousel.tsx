'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Trophy, ChevronLeft, ChevronRight, MapPin, CheckCircle2, Award, Star, Sparkles } from 'lucide-react';
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
  cardBg: string;
  borderColor: string;
  textColor: string;
  districtColor: string;
  examBg: string;
}

const RANKER_SLIDES: Ranker[][] = [
  // Slide 1: Top 1 - 3 (Gold, Silver, Bronze Champions)
  [
    {
      rank: 1,
      name: 'Sourav Ganguly',
      district: 'Kolkata District',
      exam: 'WB Constable Prelims',
      score: '94 / 100',
      accuracy: '98% Accuracy',
      medal: '🥇',
      avatarBg: 'bg-slate-950 text-amber-400 border border-amber-300 shadow-lg',
      badgeBg: 'bg-slate-950 text-amber-300 border border-amber-300 font-black shadow-lg',
      cardBg: 'bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500',
      borderColor: 'border-2 border-yellow-200 shadow-2xl shadow-amber-500/50',
      textColor: 'text-slate-950 font-black',
      districtColor: 'text-amber-950/90 font-extrabold',
      examBg: 'bg-slate-950/90 text-amber-300 border border-amber-400/50',
    },
    {
      rank: 2,
      name: 'Ananya Roy',
      district: 'Howrah District',
      exam: 'PSC Clerkship Stage-1',
      score: '91 / 100',
      accuracy: '95% Accuracy',
      medal: '🥈',
      avatarBg: 'bg-slate-950 text-slate-200 border border-slate-300 shadow-lg',
      badgeBg: 'bg-slate-950 text-slate-200 border border-slate-300 font-black shadow-lg',
      cardBg: 'bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300',
      borderColor: 'border-2 border-white shadow-2xl shadow-slate-400/50',
      textColor: 'text-slate-950 font-black',
      districtColor: 'text-slate-800 font-extrabold',
      examBg: 'bg-slate-950/90 text-slate-200 border border-slate-400/50',
    },
    {
      rank: 3,
      name: 'Subhashish Das',
      district: 'Siliguri District',
      exam: 'WB Food SI Special',
      score: '88 / 100',
      accuracy: '93% Accuracy',
      medal: '🥉',
      avatarBg: 'bg-amber-400 text-slate-950 font-black shadow-lg',
      badgeBg: 'bg-amber-400 text-slate-950 font-black shadow-lg',
      cardBg: 'bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800',
      borderColor: 'border-2 border-amber-400 shadow-2xl shadow-amber-700/50',
      textColor: 'text-white font-black',
      districtColor: 'text-amber-200/90 font-extrabold',
      examBg: 'bg-slate-950/90 text-amber-300 border border-amber-500/50',
    },
  ],
  // Slide 2: Ranks 4 - 6 (Electric Violet, Emerald Glow, Crimson Rose)
  [
    {
      rank: 4,
      name: 'Priya Banerjee',
      district: 'Burdwan District',
      exam: 'WB SI Preliminary',
      score: '86 / 100',
      accuracy: '92% Accuracy',
      medal: '🏅',
      avatarBg: 'bg-gradient-to-br from-purple-400 to-indigo-400 text-slate-950 shadow-md',
      badgeBg: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-extrabold shadow-lg shadow-purple-500/40',
      cardBg: 'bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950',
      borderColor: 'border-2 border-purple-400/90 shadow-2xl shadow-purple-500/40',
      textColor: 'text-white font-black',
      districtColor: 'text-purple-200 font-semibold',
      examBg: 'bg-purple-900/60 text-purple-200 border border-purple-500/50',
    },
    {
      rank: 5,
      name: 'Rajesh Mondal',
      district: 'Midnapore District',
      exam: 'Primary Teacher TET',
      score: '135 / 150',
      accuracy: '91% Accuracy',
      medal: '🌟',
      avatarBg: 'bg-gradient-to-br from-emerald-400 to-teal-400 text-slate-950 shadow-md',
      badgeBg: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/40',
      cardBg: 'bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950',
      borderColor: 'border-2 border-emerald-400/90 shadow-2xl shadow-emerald-500/40',
      textColor: 'text-white font-black',
      districtColor: 'text-emerald-200 font-semibold',
      examBg: 'bg-emerald-900/60 text-emerald-200 border border-emerald-500/50',
    },
    {
      rank: 6,
      name: 'Sneha Chakraborty',
      district: 'Hooghly District',
      exam: 'WB Health GNM/ANM',
      score: '84 / 100',
      accuracy: '90% Accuracy',
      medal: '✨',
      avatarBg: 'bg-gradient-to-br from-rose-400 to-pink-400 text-slate-950 shadow-md',
      badgeBg: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white font-extrabold shadow-lg shadow-rose-500/40',
      cardBg: 'bg-gradient-to-br from-rose-950 via-pink-950 to-slate-950',
      borderColor: 'border-2 border-rose-400/90 shadow-2xl shadow-rose-500/40',
      textColor: 'text-white font-black',
      districtColor: 'text-rose-200 font-semibold',
      examBg: 'bg-rose-900/60 text-rose-200 border border-rose-500/50',
    },
  ],
  // Slide 3: Ranks 7 - 9 (Royal Blue, Cyan Blue, Vibrant Emerald)
  [
    {
      rank: 7,
      name: 'Amitabh Mukherjee',
      district: 'Asansol District',
      exam: 'PSC Miscellaneous',
      score: '83 / 100',
      accuracy: '89% Accuracy',
      medal: '⭐',
      avatarBg: 'bg-gradient-to-br from-blue-400 to-cyan-400 text-slate-950 shadow-md',
      badgeBg: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-extrabold shadow-lg shadow-blue-500/40',
      cardBg: 'bg-gradient-to-br from-blue-950 via-cyan-950 to-slate-950',
      borderColor: 'border-2 border-blue-400/90 shadow-2xl shadow-blue-500/40',
      textColor: 'text-white font-black',
      districtColor: 'text-blue-200 font-semibold',
      examBg: 'bg-blue-900/60 text-blue-200 border border-blue-500/50',
    },
    {
      rank: 8,
      name: 'Debolina Paul',
      district: 'Malda District',
      exam: 'WB Constable Mains',
      score: '82 / 100',
      accuracy: '88% Accuracy',
      medal: '🎯',
      avatarBg: 'bg-gradient-to-br from-cyan-400 to-sky-400 text-slate-950 shadow-md',
      badgeBg: 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 font-extrabold shadow-lg shadow-cyan-500/40',
      cardBg: 'bg-gradient-to-br from-cyan-950 via-blue-950 to-slate-950',
      borderColor: 'border-2 border-cyan-400/90 shadow-2xl shadow-cyan-500/40',
      textColor: 'text-white font-black',
      districtColor: 'text-cyan-200 font-semibold',
      examBg: 'bg-cyan-900/60 text-cyan-200 border border-cyan-500/50',
    },
    {
      rank: 9,
      name: 'Vikramjit Ghosh',
      district: 'Cooch Behar District',
      exam: 'WB Food SI Grand Mock',
      score: '81 / 100',
      accuracy: '87% Accuracy',
      medal: '🚀',
      avatarBg: 'bg-gradient-to-br from-teal-400 to-emerald-400 text-slate-950 shadow-md',
      badgeBg: 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-extrabold shadow-lg shadow-teal-500/40',
      cardBg: 'bg-gradient-to-br from-teal-950 via-emerald-950 to-slate-950',
      borderColor: 'border-2 border-teal-400/90 shadow-2xl shadow-teal-500/40',
      textColor: 'text-white font-black',
      districtColor: 'text-teal-200 font-semibold',
      examBg: 'bg-teal-900/60 text-teal-200 border border-teal-500/50',
    },
  ],
  // Slide 4: Ranks 10 - 12 (Electric Amber, Sapphire Blue, Jade Emerald)
  [
    {
      rank: 10,
      name: 'Swati Sengupta',
      district: 'Nadia District',
      exam: 'PSC Clerkship Part-1',
      score: '80 / 100',
      accuracy: '86% Accuracy',
      medal: '💎',
      avatarBg: 'bg-gradient-to-br from-sky-400 to-blue-400 text-slate-950 shadow-md',
      badgeBg: 'bg-gradient-to-r from-sky-500 to-blue-500 text-white font-extrabold shadow-lg shadow-sky-500/40',
      cardBg: 'bg-gradient-to-br from-sky-950 via-blue-950 to-slate-950',
      borderColor: 'border-2 border-sky-400/90 shadow-2xl shadow-sky-500/40',
      textColor: 'text-white font-black',
      districtColor: 'text-sky-200 font-semibold',
      examBg: 'bg-sky-900/60 text-sky-200 border border-sky-500/50',
    },
    {
      rank: 11,
      name: 'Aritra Bhattacharya',
      district: 'Murshidabad District',
      exam: 'WB SI Sergeant Paper',
      score: '79 / 100',
      accuracy: '85% Accuracy',
      medal: '🏆',
      avatarBg: 'bg-gradient-to-br from-amber-400 to-yellow-400 text-slate-950 shadow-md',
      badgeBg: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black shadow-lg shadow-amber-500/40',
      cardBg: 'bg-gradient-to-br from-amber-950 via-orange-950 to-slate-950',
      borderColor: 'border-2 border-amber-400/90 shadow-2xl shadow-amber-500/40',
      textColor: 'text-white font-black',
      districtColor: 'text-amber-200 font-semibold',
      examBg: 'bg-amber-900/60 text-amber-200 border border-amber-500/50',
    },
    {
      rank: 12,
      name: 'Puja Karmakar',
      district: 'Bankura District',
      exam: 'Primary TET Complete',
      score: '128 / 150',
      accuracy: '84% Accuracy',
      medal: '🌟',
      avatarBg: 'bg-gradient-to-br from-emerald-400 to-teal-400 text-slate-950 shadow-md',
      badgeBg: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/40',
      cardBg: 'bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950',
      borderColor: 'border-2 border-emerald-400/90 shadow-2xl shadow-emerald-500/40',
      textColor: 'text-white font-black',
      districtColor: 'text-emerald-200 font-semibold',
      examBg: 'bg-emerald-900/60 text-emerald-200 border border-emerald-500/50',
    },
  ],
];

export function RankersCarousel() {
  const { t } = useTranslation();
  const [activeSlide, setActiveSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const totalSlides = RANKER_SLIDES.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, 3500);

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
    <section className="py-12">
      <div className="container max-w-5xl">
        <div
          className="p-6 md:p-10 rounded-3xl bg-gradient-to-br from-blue-950 via-slate-950 to-blue-900 text-white shadow-2xl border-2 border-blue-500/40 relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Animated Glowing Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-950/90 overflow-hidden z-20 border-b border-blue-600/40">
            <div
              key={activeSlide}
              className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 via-cyan-400 to-blue-500 shadow-[0_0_25px_rgba(250,204,21,0.95)]"
              style={{
                animation: 'progress 3.5s linear infinite',
              }}
            />
          </div>

          {/* Background Ambient Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 relative z-10 gap-4 pt-2">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400/20 via-amber-500/20 to-yellow-400/20 text-amber-300 font-black text-xs mb-2.5 border-2 border-amber-400/60 shadow-lg shadow-amber-500/20">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                </span>
                <span className="uppercase tracking-wider">Statewide Live Leaderboard Spotlight</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white flex items-center gap-2">
                {t.rankers.title}
                <Sparkles className="h-6 w-6 text-amber-400 animate-pulse" />
              </h2>
              <p className="text-blue-100/90 text-xs sm:text-sm mt-1 font-medium">{t.rankers.subtitle}</p>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-2.5 shrink-0">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrev}
                className="h-11 w-11 rounded-full border-2 border-amber-400/60 bg-slate-900/90 text-amber-400 hover:bg-amber-400 hover:text-slate-950 transition-all shadow-lg"
                aria-label="Previous Rankers"
              >
                <ChevronLeft className="h-6 w-6 stroke-[3]" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                className="h-11 w-11 rounded-full border-2 border-amber-400/60 bg-slate-900/90 text-amber-400 hover:bg-amber-400 hover:text-slate-950 transition-all shadow-lg"
                aria-label="Next Rankers"
              >
                <ChevronRight className="h-6 w-6 stroke-[3]" />
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
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in w-full"
                >
                  {slideGroup.map((ranker) => (
                    <div
                      key={ranker.rank}
                      className={`p-6 rounded-2xl ${ranker.cardBg} ${ranker.borderColor} shadow-2xl hover:scale-[1.03] transition-all duration-300 flex flex-col justify-between relative group w-full shimmer-card`}
                    >
                      {/* Rank Badge & Icon */}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${ranker.avatarBg} shadow-lg`}>
                          {ranker.medal}
                        </div>
                        <span className={`text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider ${ranker.badgeBg}`}>
                          RANK #{ranker.rank}
                        </span>
                      </div>

                      {/* Ranker Info */}
                      <div className="mb-4">
                        <h3 className={`font-black text-xl mb-1 tracking-tight truncate ${ranker.textColor}`}>
                          {ranker.name}
                        </h3>
                        <div className={`flex items-center gap-1.5 text-xs mb-3 ${ranker.districtColor}`}>
                          <MapPin className="h-4 w-4 shrink-0 text-amber-400" />
                          <span className="truncate">{ranker.district}</span>
                        </div>
                        <div className={`inline-block px-3.5 py-1.5 rounded-xl text-xs font-extrabold truncate max-w-full shadow-sm ${ranker.examBg}`}>
                          {ranker.exam}
                        </div>
                      </div>

                      {/* Score Bar */}
                      <div className="pt-3.5 border-t border-slate-800/40 flex items-center justify-between gap-2">
                        <span className={`flex items-center gap-1.5 text-xs font-black ${ranker.rank <= 3 ? 'text-slate-950 dark:text-emerald-300' : 'text-emerald-400'}`}>
                          <CheckCircle2 className="h-4 w-4" /> {ranker.accuracy}
                        </span>
                        <span className="px-3.5 py-1.5 rounded-full bg-slate-950 text-amber-300 border-2 border-amber-400/80 font-black text-xs shadow-lg">
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
          <div className="flex items-center justify-center gap-3 mt-8 relative z-10">
            {RANKER_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  activeSlide === i
                    ? 'w-10 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 shadow-lg shadow-amber-500/60 border-2 border-amber-300'
                    : 'w-3 bg-blue-900/80 hover:bg-blue-700 border border-blue-600/60'
                }`}
                aria-label={`Go to slide page ${i + 1}`}
              />
            ))}
          </div>

          {/* Footer CTA */}
          <div className="text-center mt-7 relative z-10">
            <Button size="lg" className="bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 hover:from-amber-500 hover:to-yellow-600 font-black gap-2 text-sm h-11 px-7 shadow-xl shadow-amber-500/25 border-none rounded-xl" asChild>
              <Link href="/leaderboard">
                <Trophy className="h-5 w-5 stroke-[2.5]" /> View Statewide Leaderboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

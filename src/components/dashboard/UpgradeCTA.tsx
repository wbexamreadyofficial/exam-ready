'use client';

import React from 'react';
import { Sparkles, Rocket, Crown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UpgradeCTA() {
  return (
    <div
      className="rounded-2xl overflow-hidden p-8 relative flex items-center justify-between mt-8 shadow-[0_2px_6px_rgba(201,88,23,0.15),0_30px_60px_-28px_rgba(184,67,15,0.7)] ring-1 ring-inset ring-white/25"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E"), radial-gradient(560px 300px at 100% 0%, rgba(255,217,168,0.4), transparent 62%), radial-gradient(480px 300px at 0% 100%, rgba(110,35,8,0.4), transparent 65%), linear-gradient(152deg, #f4953f 0%, #e2691f 38%, #c4501a 70%, #97370f 100%)`,
        backgroundBlendMode: 'soft-light, normal, normal, normal',
      }}
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none" />
      
      <div className="relative z-10 max-w-xl">
        <div className="text-orange-50 text-xs font-bold tracking-widest uppercase mb-2">PREMIUM</div>
        <h2 className="text-2xl font-bold text-white mb-2">Unlock Your Full Potential</h2>
        <p className="text-orange-50 text-sm mb-6 max-w-md">
          Get unlimited access to all mock tests, detailed analytics, and personalized study plans.
        </p>
        <Button className="btn-premium bg-white text-[#b9450d] hover:bg-orange-50 px-6 py-5 h-auto rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-orange-900/30">
          <Sparkles size={18} />
          Upgrade to Premium
        </Button>
      </div>
      
      <div className="hidden md:block relative z-10 w-[200px] h-[150px] pointer-events-none">
        <div className="absolute top-4 right-10 text-white/20 animate-pulse" style={{ animationDuration: '3s' }}>
          <Crown size={64} />
        </div>
        <div className="absolute bottom-8 left-4 text-white/20 animate-bounce" style={{ animationDuration: '4s' }}>
          <Rocket size={48} />
        </div>
        <div className="absolute top-0 left-12 text-white/30 animate-pulse" style={{ animationDuration: '2s' }}>
          <Star size={24} />
        </div>
        <div className="absolute bottom-0 right-0 text-white/20">
          <Star size={32} />
        </div>
      </div>
    </div>
  );
}

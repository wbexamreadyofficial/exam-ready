'use client';

import React from 'react';
import { Sparkles, Rocket, Crown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UpgradeCTA() {
  return (
    <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-[var(--color-bblue-600)] via-[var(--color-bblue-700)] to-[#1a237e] p-8 relative flex items-center justify-between shadow-lg mt-8">
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none" />
      
      <div className="relative z-10 max-w-xl">
        <div className="text-blue-200 text-xs font-bold tracking-widest uppercase mb-2">PREMIUM</div>
        <h2 className="text-2xl font-bold text-white mb-2">Unlock Your Full Potential</h2>
        <p className="text-blue-100 text-sm mb-6 max-w-md">
          Get unlimited access to all mock tests, detailed analytics, and personalized study plans.
        </p>
        <Button className="btn-premium bg-[var(--color-cta)] text-[var(--color-cta-foreground)] hover:bg-[var(--color-cta-hover)] px-6 py-5 h-auto rounded-lg font-semibold flex items-center gap-2 shadow-lg">
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

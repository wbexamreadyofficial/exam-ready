'use client';

import { useState } from 'react';
import { Megaphone, X, Download, HelpCircle, Globe } from 'lucide-react';
import Link from 'next/link';

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-[#081428] via-[#0B1B33] to-[#081428] py-2 px-4 text-white text-[12.5px] font-medium">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="hidden sm:flex h-5 w-5 items-center justify-center rounded-full bg-[#FF700B]/15 ring-1 ring-[#FF700B]/30">
            <Megaphone className="h-3 w-3 text-[#FF9A4D]" />
          </span>
          <span className="text-white/80 tracking-wide">
            Special Offer: <strong className="font-bold text-[#FF9A4D]">Get 30% OFF</strong> on All Mock Tests – Limited Time Only!
          </span>
        </div>

        <div className="flex items-center gap-4 flex-wrap justify-center text-white/70">
          <Link href="/app" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Download App</span>
          </Link>
          <span className="hidden sm:block h-3 w-px bg-white/15" />
          <Link href="/help" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <HelpCircle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Help Center</span>
          </Link>
          <span className="hidden sm:block h-3 w-px bg-white/15" />
          <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
            <Globe className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">English</span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-white/15 rounded-full transition-colors ml-1"
            aria-label="Close announcement"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Hairline seam so the bar reads as fused to the nav below it */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}

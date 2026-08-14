'use client';

import { useState } from 'react';
import { Megaphone, X, Download, HelpCircle, Globe } from 'lucide-react';
import Link from 'next/link';

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-amber-400 to-yellow-500 py-2 px-4 text-slate-900 text-sm font-medium z-50 relative">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <Megaphone className="h-4 w-4 animate-pulse" />
          <span>Special Offer: Get 30% OFF on All Mock Tests – Limited Time Only!</span>
        </div>
        
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <Link href="/app" className="flex items-center gap-1 hover:underline">
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Download App</span>
          </Link>
          <Link href="/help" className="flex items-center gap-1 hover:underline">
            <HelpCircle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Help Center</span>
          </Link>
          <div className="flex items-center gap-1 cursor-pointer hover:underline">
            <Globe className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">English</span>
          </div>
          <button 
            onClick={() => setIsVisible(false)} 
            className="p-1 hover:bg-slate-900/10 rounded-full transition-colors ml-2"
            aria-label="Close announcement"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

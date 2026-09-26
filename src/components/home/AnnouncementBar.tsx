'use client';

import { useState } from 'react';
import { Megaphone, X, Download, HelpCircle, Globe } from 'lucide-react';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

function OfferMessage() {
  return (
    <>
      Special Offer: <strong className="font-bold text-[#FF9A4D]">Get 30% OFF</strong> on All Mock Tests – Limited Time Only!
    </>
  );
}

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-[#081428] via-[#0B1B33] to-[#081428] px-0 py-2 text-white text-[12.5px] font-medium sm:px-4">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-1.5 px-0 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-2 text-center sm:text-left">
          <span className="hidden sm:flex h-5 w-5 items-center justify-center rounded-full bg-[#FF700B]/15 ring-1 ring-[#FF700B]/30">
            <Megaphone className="h-3 w-3 text-[#FF9A4D]" />
          </span>
          <span className="sr-only"><OfferMessage /></span>

          <div className="w-full overflow-hidden text-white/80 tracking-wide sm:hidden" aria-hidden="true">
            <div className="flex w-max animate-marquee [animation-duration:14s]">
              <span className="shrink-0 whitespace-nowrap pr-10"><OfferMessage /></span>
              <span className="shrink-0 whitespace-nowrap pr-10"><OfferMessage /></span>
            </div>
          </div>

          <span className="hidden text-white/80 tracking-wide sm:inline" aria-hidden="true">
            <OfferMessage />
          </span>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-1.5 text-white/70 sm:gap-4">
          <Link href="/app" className="hidden items-center gap-1.5 transition-colors hover:text-white sm:flex">
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Download App</span>
          </Link>
          <span className="hidden sm:block h-3 w-px bg-white/15" />
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/help"
                  aria-label="Help Center"
                  className="flex items-center gap-1.5 transition-colors hover:text-white"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Help Center</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="whitespace-nowrap">
                Need help? Visit our Help Center
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className="hidden sm:block h-3 w-px bg-white/15" />
          <div className="hidden items-center gap-1.5 cursor-pointer transition-colors hover:text-white sm:flex">
            <Globe className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">English</span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="rounded-full p-1 transition-colors hover:bg-white/15 sm:ml-1"
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

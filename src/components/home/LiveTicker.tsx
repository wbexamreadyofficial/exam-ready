'use client';

import { Zap } from 'lucide-react';

const tickerItems = [
  { name: 'Rahul M.', district: 'Kolkata', action: 'scored 87/100', exam: 'PSC Clerkship Mock #8' },
  { name: 'Priya S.', district: 'Howrah', action: 'completed', exam: 'WB Constable Prelims Paper' },
  { name: 'Arjun D.', district: 'Siliguri', action: 'scored 92/100', exam: 'Food SI Grand Test #5' },
  { name: 'Sneha R.', district: 'Durgapur', action: 'ranked #3 in', exam: 'WB SI Weekly Challenge' },
  { name: 'Amit K.', district: 'Asansol', action: 'scored 78/85', exam: 'WB Constable Mock #12' },
  { name: 'Ritu B.', district: 'Malda', action: 'completed', exam: 'Primary TET Practice Set' },
  { name: 'Souvik G.', district: 'Hooghly', action: 'scored 95/100', exam: 'PSC Clerkship Full Test' },
  { name: 'Ananya P.', district: 'Bardhaman', action: 'ranked #1 in', exam: 'Food SI Mock #9' },
];

export function LiveTicker() {
  const duplicated = [...tickerItems, ...tickerItems];

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 border-y border-blue-400/30 py-2.5">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-blue-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-blue-950 to-transparent z-10 pointer-events-none" />

      <div className="flex items-center">
        {/* Live badge */}
        <div className="flex-shrink-0 flex items-center gap-1.5 px-4 z-20">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 live-dot" />
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">Live</span>
        </div>

        {/* Marquee */}
        <div className="flex animate-marquee whitespace-nowrap">
          {duplicated.map((item, i) => (
            <div key={i} className="flex items-center gap-2 mx-6 text-xs">
              <Zap className="h-3 w-3 text-amber-400 fill-amber-400 flex-shrink-0" />
              <span className="text-slate-400">
                <span className="text-white font-bold">{item.name}</span>
                <span className="text-slate-500"> from {item.district}</span>
                {' '}{item.action}{' '}
                <span className="text-amber-400 font-semibold">{item.exam}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

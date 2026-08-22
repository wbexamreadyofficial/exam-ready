'use client';

import React from 'react';
import { planData } from '@/lib/dashboard/mockData';
import { Zap, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

export default function PlanBanner() {
  const progressValue = (planData.testsUsed / planData.testsTotal) * 100;

  return (
    <div className="bg-gradient-to-r from-[var(--color-borange-50)] to-amber-50 dark:from-amber-900/10 dark:to-amber-800/5 rounded-xl border border-amber-200/60 dark:border-amber-700/20 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
        <div className="flex items-center gap-3">
          <Zap className="text-amber-500" size={24} />
          <span className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap">
            Free Plan
          </span>
        </div>
        <div className="text-sm text-amber-800 dark:text-amber-400/80 font-medium whitespace-nowrap">
          {planData.testsUsed}/{planData.testsTotal} tests used &middot; {planData.daysLeft} days left
        </div>
      </div>
      
      <div className="w-full max-w-xs md:max-w-md mx-auto md:mx-4 hidden sm:block">
         <div className="[&>div>div]:bg-amber-500 w-full">
           <Progress value={progressValue} className="h-2 bg-amber-200 dark:bg-amber-900/40" />
         </div>
      </div>

      <Button className="btn-premium bg-[var(--color-cta)] text-[var(--color-cta-foreground)] hover:bg-[var(--color-cta-hover)] shrink-0 whitespace-nowrap w-full md:w-auto flex items-center justify-center gap-2">
        Upgrade Now
        <ArrowRight size={16} />
      </Button>
    </div>
  );
}

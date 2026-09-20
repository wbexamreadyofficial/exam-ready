'use client';

import * as React from 'react';
import { topExams } from '@/lib/dashboard/mockData';
import { 
  Shield, 
  FileCheck, 
  UtensilsCrossed, 
  GraduationCap, 
  ShieldCheck, 
  ChevronRight,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const iconMap: Record<string, React.ElementType> = { 
  Shield, 
  FileCheck, 
  Utensils: UtensilsCrossed, 
  GraduationCap, 
  BadgeCheck: ShieldCheck 
};

export default function TopExams() {
  return (
    <Card className="surface-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          Top Exams
          <Award className="h-4 w-4 text-[var(--color-data-primary)]" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {topExams.map((exam) => {
            const Icon = iconMap[exam.icon] || Shield;
            
            return (
              <Link 
                key={exam.id} 
                href={`/student/mock-tests`}
                className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-[var(--color-surface-muted)] transition-colors group cursor-pointer"
              >
                <Icon className="h-4 w-4 text-[var(--color-data-primary)]" />
                <span className="text-sm font-medium text-[var(--color-ink-700)] group-hover:text-[var(--color-ink-900)] transition-colors">
                  {exam.name}
                </span>
                <ChevronRight className="h-3.5 w-3.5 ml-auto text-[var(--color-muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

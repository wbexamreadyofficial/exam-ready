'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, FileCheck, HelpCircle, Mail, Phone, ShieldCheck, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollReveal } from '@/components/home/ScrollReveal';
import { siteContentApi } from '@/lib/api/siteContent';
import type { SiteContentType } from '@/types/siteContent';

interface SiteContentPageProps {
  type: SiteContentType;
  fallbackTitle: string;
  eyebrow: string;
}

const THEME: Record<
  SiteContentType,
  { icon: typeof ShieldCheck; glow: string; badge: string; accent: string; ring: string }
> = {
  privacy: {
    icon: ShieldCheck,
    glow: 'bg-blue-400/20 dark:bg-blue-500/10',
    badge: 'text-blue-600 border-blue-300 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
    accent: 'from-blue-500 to-cyan-600',
    ring: 'border-blue-200 dark:border-blue-900/60',
  },
  terms: {
    icon: FileCheck,
    glow: 'bg-purple-400/20 dark:bg-purple-500/10',
    badge: 'text-purple-600 border-purple-300 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
    accent: 'from-purple-600 to-indigo-600',
    ring: 'border-purple-200 dark:border-purple-900/60',
  },
  help_support: {
    icon: HelpCircle,
    glow: 'bg-amber-400/20 dark:bg-amber-500/10',
    badge: 'text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    accent: 'from-amber-400 to-orange-500',
    ring: 'border-amber-200 dark:border-amber-900/60',
  },
};

export function SiteContentPage({ type, fallbackTitle, eyebrow }: SiteContentPageProps) {
  const theme = THEME[type];
  const Icon = theme.icon;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['public-site-content', type],
    queryFn: () => siteContentApi.getPublic(type),
  });

  if (isLoading) {
    return (
      <div className="container max-w-3xl py-16 space-y-4">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="container max-w-3xl">
        <ErrorState
          title={fallbackTitle}
          message="Could not load this page right now. Please try again shortly."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative py-16 md:py-20 bg-gradient-to-b from-slate-50/80 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 border-b border-slate-200/60 dark:border-slate-800 overflow-hidden">
        <div
          className={`absolute top-0 left-1/4 -translate-x-1/2 w-[500px] h-[260px] rounded-full blur-[110px] pointer-events-none -z-10 ${theme.glow}`}
        />
        <div className="container max-w-3xl text-left">
          <ScrollReveal direction="scale">
            <Badge variant="outline" className={`mb-5 px-3.5 py-1.5 text-xs font-bold gap-1.5 ${theme.badge}`}>
              <Sparkles className="h-3 w-3" />
              {eyebrow}
            </Badge>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <div
              className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${theme.accent} text-white shadow-lg`}
            >
              <Icon className="h-7 w-7 stroke-[2.25]" />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={140}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
              {data.title || fallbackTitle}
            </h1>
          </ScrollReveal>

          {data.intro && (
            <ScrollReveal delay={200}>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {data.intro}
              </p>
            </ScrollReveal>
          )}
        </div>
      </section>

      <div className="container max-w-3xl py-12 md:py-16">
        {(data.supportEmail || data.supportPhone) && (
          <ScrollReveal>
            <Card className={`mb-10 border-2 shadow-md ${theme.ring} bg-gradient-to-br from-white to-slate-50/60 dark:from-slate-900 dark:to-slate-950`}>
              <CardContent className="p-5 flex flex-col sm:flex-row gap-4 sm:items-center">
                {data.supportEmail && (
                  <a
                    href={`mailto:${data.supportEmail}`}
                    className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <Mail className="h-4 w-4" />
                    </span>
                    {data.supportEmail}
                  </a>
                )}
                {data.supportPhone && (
                  <a
                    href={`tel:${data.supportPhone}`}
                    className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <Phone className="h-4 w-4" />
                    </span>
                    {data.supportPhone}
                  </a>
                )}
              </CardContent>
            </Card>
          </ScrollReveal>
        )}

        {data.sections.length > 0 && (
          <div className="space-y-6 mb-14">
            {data.sections.map((section, index) => (
              <ScrollReveal key={`${section.heading}-${index}`} delay={(index % 4) * 60}>
                <div className="flex gap-4">
                  <div
                    className={`shrink-0 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${theme.accent} text-white text-xs font-black shadow-sm`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1 pt-0.5">
                    {section.heading && (
                      <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mb-2">
                        {section.heading}
                      </h2>
                    )}
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {section.body}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

        {data.faqs.length > 0 && (
          <ScrollReveal>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {data.faqs.map((faq, index) => (
                <FaqItem key={`${faq.question}-${index}`} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </ScrollReveal>
        )}

        {data.updatedAt && (
          <p className="mt-12 text-xs text-slate-400 dark:text-slate-500 text-center">
            Last updated{' '}
            {new Date(data.updatedAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        )}
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Card className="border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="w-full flex items-center justify-between gap-3 p-5 text-left"
        aria-expanded={open}
      >
        <span className="font-extrabold text-sm text-slate-900 dark:text-white">{question}</span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{answer}</p>
        </div>
      </div>
    </Card>
  );
}

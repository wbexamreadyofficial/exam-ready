'use client';

import { Check, Zap, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const PLANS = [
  {
    id: 'free',
    name: 'Free Starter',
    price: 0,
    duration: 'Forever',
    description: 'Perfect for exploring exam patterns & daily practice.',
    features: [
      'Access to 20 free mock tests',
      'Daily 10-min practice quizzes',
      'Basic result summary & score',
      'Statewide leaderboard access',
    ],
    popular: false,
    cta: 'Current Plan',
  },
  {
    id: 'pro-pass',
    name: 'WB Exam Pass',
    price: 499,
    duration: '6 Months',
    description: 'Unlimited access to all WBPSC, WBCS & SSC mock tests.',
    features: [
      'Unlimited access to 500+ mock tests',
      'Subject-wise deep performance analytics',
      'Detailed answer keys & explanations',
      'Previous year question (PYQ) series',
      'Priority doubt resolution support',
    ],
    popular: true,
    cta: 'Upgrade to PRO',
  },
  {
    id: 'annual-pass',
    name: '1-Year Unlimited Pass',
    price: 799,
    duration: '1 Year',
    description: 'Complete 365-day access for all state & central exams.',
    features: [
      'Everything in WB Exam Pass',
      '365 days unlimited test access',
      'Full PDF solution downloads',
      'Rank predictor & percentile analytics',
      'Dedicated Telegram support group',
    ],
    popular: false,
    cta: 'Get Annual Pass',
  },
];

export default function SubscriptionsPage() {
  return (
    <div className="container max-w-5xl py-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <Badge variant="secondary" className="mb-2">Membership Plans</Badge>
        <h1 className="text-3xl md:text-4xl font-black mb-3">Accelerate Your Exam Preparation</h1>
        <p className="text-[var(--color-muted-foreground)]">
          Choose a plan to unlock premium full-length mock tests, subject-wise analytics, and PYQ practice sets.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={`flex flex-col justify-between relative ${
              plan.popular ? 'border-2 border-[var(--color-primary)] shadow-lg scale-105 z-10' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                Most Popular
              </div>
            )}
            <CardHeader className="pt-6">
              <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="text-xs">{plan.description}</CardDescription>
              <div className="pt-4">
                <span className="text-3xl font-black">₹{plan.price}</span>
                <span className="text-xs text-[var(--color-muted-foreground)] ml-1">/ {plan.duration}</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 flex-1">
              {plan.features.map((feat, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <Check className="h-4 w-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </CardContent>

            <CardFooter className="pb-6">
              <Button
                className="w-full font-bold"
                variant={plan.popular ? 'default' : 'outline'}
                disabled={plan.id === 'free'}
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center text-xs text-[var(--color-muted-foreground)] flex items-center justify-center gap-2">
        <ShieldCheck className="h-4 w-4 text-green-600" />
        Safe & Secure 256-bit Encrypted Payment Gateway. Cancel anytime.
      </div>
    </div>
  );
}

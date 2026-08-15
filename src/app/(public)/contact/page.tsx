import type { Metadata } from 'next';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us — Exam Ready',
  description: 'Get in touch with the Exam Ready support team.',
};

export default function ContactPage() {
  return (
    <div className="container py-12 md:py-16 max-w-5xl">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-black mb-3">Contact Support</h1>
        <p className="text-[var(--color-muted-foreground)]">
          Have questions regarding mock tests, subscriptions, or technical support? We are here to help.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: Mail, title: 'Email Support', value: 'support@examready.in', desc: 'Average response time: 2 hours' },
          { icon: Phone, title: 'Helpline', value: '+91 98765 43210', desc: 'Mon - Sat (9:00 AM - 6:00 PM)' },
          { icon: MapPin, title: 'Headquarters', value: 'Kolkata, West Bengal', desc: 'Salt Lake Sector V, Kolkata 700091' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title}>
              <CardContent className="p-6 flex flex-col gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">{item.title}</h3>
                  <p className="text-sm font-medium text-[var(--color-foreground)] mt-0.5">{item.value}</p>
                  <p className="text-xs text-[var(--color-muted-foreground)] mt-1">{item.desc}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <ContactForm />
    </div>
  );
}


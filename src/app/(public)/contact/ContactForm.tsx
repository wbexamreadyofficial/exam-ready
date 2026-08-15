'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MessageSquare } from 'lucide-react';

export function ContactForm() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-[var(--color-primary)]" />
          Send Us a Message
        </h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="c-name">Your Name</Label>
              <Input id="c-name" placeholder="John Doe" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-email">Email Address</Label>
              <Input id="c-email" type="email" placeholder="john@example.com" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-subject">Subject</Label>
            <Input id="c-subject" placeholder="e.g. Query about PSC Clerkship mock test" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-message">Message</Label>
            <Textarea id="c-message" placeholder="Describe your query in detail..." className="min-h-[120px]" />
          </div>
          <Button type="submit" className="w-full font-bold">
            Submit Message
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

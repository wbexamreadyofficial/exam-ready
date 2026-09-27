'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { siteContentApi } from '@/lib/api/siteContent';
import { getErrorMessage } from '@/lib/api/errors';
import type {
  SiteContent,
  SiteContentFaq,
  SiteContentSection,
  SiteContentType,
  UpdateSiteContentInput,
} from '@/types/siteContent';

interface SiteContentEditorProps {
  type: SiteContentType;
}

function toForm(content: SiteContent): UpdateSiteContentInput {
  return {
    title: content.title,
    intro: content.intro,
    sections: content.sections,
    faqs: content.faqs,
    supportEmail: content.supportEmail,
    supportPhone: content.supportPhone,
  };
}

/** Fetches the page, then hands off to the form once data is in — the form
 *  itself never has to reconcile "data changed under me" (see `SiteContentForm`). */
export function SiteContentEditor({ type }: SiteContentEditorProps) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-site-content', type],
    queryFn: () => siteContentApi.get(type),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorState message="Could not load this page." onRetry={() => refetch()} className="py-16" />;
  }

  // Keying on the fetched content re-mounts the form (and re-syncs its local
  // state) whenever a fresh document is loaded for this type, without an
  // effect fighting the query cache.
  return <SiteContentForm content={data} type={type} />;
}

function SiteContentForm({ content, type }: { content: SiteContent; type: SiteContentType }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<UpdateSiteContentInput>(() => toForm(content));
  const [updatedAt, setUpdatedAt] = useState(content.updatedAt);
  const [isDirty, setIsDirty] = useState(false);

  const updateMutation = useMutation({
    mutationFn: (input: UpdateSiteContentInput) => siteContentApi.update(type, input),
    onSuccess: (nextContent) => {
      queryClient.setQueryData(['admin-site-content', type], nextContent);
      setForm(toForm(nextContent));
      setUpdatedAt(nextContent.updatedAt);
      setIsDirty(false);
      toast.success('Content updated');
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error, 'Could not update this page')),
  });

  const patch = (next: Partial<UpdateSiteContentInput>) => {
    setForm((current) => ({ ...current, ...next }));
    setIsDirty(true);
  };

  const updateSection = (index: number, next: Partial<SiteContentSection>) => {
    patch({
      sections: form.sections.map((section, current) =>
        current === index ? { ...section, ...next } : section,
      ),
    });
  };

  const addSection = () => patch({ sections: [...form.sections, { heading: '', body: '' }] });
  const removeSection = (index: number) =>
    patch({ sections: form.sections.filter((_, current) => current !== index) });

  const updateFaq = (index: number, next: Partial<SiteContentFaq>) => {
    patch({
      faqs: form.faqs.map((faq, current) => (current === index ? { ...faq, ...next } : faq)),
    });
  };

  const addFaq = () => patch({ faqs: [...form.faqs, { question: '', answer: '' }] });
  const removeFaq = (index: number) => patch({ faqs: form.faqs.filter((_, current) => current !== index) });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    updateMutation.mutate({
      ...form,
      title: form.title.trim(),
      intro: form.intro.trim(),
      supportEmail: form.supportEmail.trim(),
      supportPhone: form.supportPhone.trim(),
      sections: form.sections
        .map((section) => ({ heading: section.heading.trim(), body: section.body.trim() }))
        .filter((section) => section.heading || section.body),
      faqs: form.faqs
        .map((faq) => ({ question: faq.question.trim(), answer: faq.answer.trim() }))
        .filter((faq) => faq.question || faq.answer),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="space-y-4 p-5">
          <div className="space-y-1.5">
            <Label htmlFor={`${type}-title`}>
              Page title <span className="text-red-500">*</span>
            </Label>
            <Input
              id={`${type}-title`}
              value={form.title}
              onChange={(event) => patch({ title: event.target.value })}
              placeholder="e.g. Help & Support"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${type}-intro`}>Intro paragraph</Label>
            <Textarea
              id={`${type}-intro`}
              value={form.intro}
              onChange={(event) => patch({ intro: event.target.value })}
              placeholder="A short paragraph shown at the top of the page"
              rows={3}
            />
          </div>

          {type === 'help_support' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor={`${type}-email`}>Support email</Label>
                <Input
                  id={`${type}-email`}
                  type="email"
                  value={form.supportEmail}
                  onChange={(event) => patch({ supportEmail: event.target.value })}
                  placeholder="support@example.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`${type}-phone`}>Support phone</Label>
                <Input
                  id={`${type}-phone`}
                  value={form.supportPhone}
                  onChange={(event) => patch({ supportPhone: event.target.value })}
                  placeholder="+91 90000 00000"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {type === 'help_support' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">FAQs</CardTitle>
            <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={addFaq}>
              <Plus className="h-3.5 w-3.5" /> Add FAQ
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 p-5 pt-0">
            {form.faqs.length === 0 && (
              <p className="text-sm text-[var(--color-muted-foreground)]">No FAQs yet. Add one above.</p>
            )}
            {form.faqs.map((faq, index) => (
              <div key={index} className="space-y-2 rounded-lg border border-[var(--color-border)] p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-1.5">
                    <Label>Question</Label>
                    <Input
                      value={faq.question}
                      onChange={(event) => updateFaq(index, { question: event.target.value })}
                      placeholder="e.g. How do I reset my password?"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-6 text-red-500"
                    onClick={() => removeFaq(index)}
                    aria-label="Remove FAQ"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-1.5">
                  <Label>Answer</Label>
                  <Textarea
                    value={faq.answer}
                    onChange={(event) => updateFaq(index, { answer: event.target.value })}
                    placeholder="Explain the answer here"
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Sections</CardTitle>
          <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={addSection}>
            <Plus className="h-3.5 w-3.5" /> Add section
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 p-5 pt-0">
          {form.sections.length === 0 && (
            <p className="text-sm text-[var(--color-muted-foreground)]">
              No sections yet. Sections are the long-form paragraphs shown on the page (e.g. &ldquo;Data we
              collect&rdquo;, &ldquo;Your rights&rdquo;).
            </p>
          )}
          {form.sections.map((section, index) => (
            <div key={index} className="space-y-2 rounded-lg border border-[var(--color-border)] p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-1.5">
                  <Label>Heading</Label>
                  <Input
                    value={section.heading}
                    onChange={(event) => updateSection(index, { heading: event.target.value })}
                    placeholder="e.g. Data we collect"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mt-6 text-red-500"
                  onClick={() => removeSection(index)}
                  aria-label="Remove section"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1.5">
                <Label>Body</Label>
                <Textarea
                  value={section.body}
                  onChange={(event) => updateSection(index, { body: event.target.value })}
                  placeholder="Section content"
                  rows={5}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        {updatedAt ? (
          <p className="text-xs text-[var(--color-muted-foreground)]">
            Last updated {new Date(updatedAt).toLocaleString('en-IN')}
          </p>
        ) : (
          <p className="text-xs text-[var(--color-muted-foreground)]">Not published yet</p>
        )}
        <Button type="submit" variant="cta" className="gap-2 font-bold" disabled={updateMutation.isPending || !isDirty}>
          {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save changes
        </Button>
      </div>
    </form>
  );
}

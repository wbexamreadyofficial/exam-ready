'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Eye, Loader2, Send } from 'lucide-react';

import { CodeBlock } from '@/components/admin/CodeBlock';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { getErrorMessage } from '@/lib/api/errors';
import { mailApi, type MailTemplateInfo } from '@/lib/api/mail';

type Mode = 'plain' | 'template';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AdminMailPage() {
  const [mode, setMode] = useState<Mode>('plain');
  const [to, setTo] = useState('');
  // plain mode
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  // template mode
  const [templateId, setTemplateId] = useState('');
  const [values, setValues] = useState<Record<string, string>>({});
  const [subjectOverride, setSubjectOverride] = useState('');
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);

  const { data: templates = [], isError: templatesFailed } = useQuery({
    queryKey: ['admin-mail-templates'],
    queryFn: mailApi.templates,
    staleTime: Infinity,
  });

  const template: MailTemplateInfo | undefined = useMemo(
    () => templates.find((t) => t.id === templateId),
    [templates, templateId]
  );

  const chooseTemplate = (id: string) => {
    const next = templates.find((t) => t.id === id);
    setTemplateId(id);
    setPreviewHtml(null);
    setSubjectOverride('');
    setValues(Object.fromEntries((next?.variables ?? []).map((v) => [v.key, v.defaultValue ?? ''])));
  };

  const templateReady = !!template && template.variables.every((v) => (values[v.key] ?? '').trim());
  const canSend =
    EMAIL_RE.test(to.trim()) &&
    (mode === 'plain' ? !!subject.trim() && !!body.trim() : templateReady);

  const sendMutation = useMutation({
    mutationFn: () =>
      mode === 'plain'
        ? mailApi.send({ mode: 'plain', to: to.trim(), subject, body })
        : mailApi.send({
            mode: 'template',
            to: to.trim(),
            templateId,
            variables: values,
            subject: subjectOverride.trim() || undefined,
          }),
    onSuccess: () => {
      toast.success(`Email sent to ${to.trim()}`);
      if (mode === 'plain') {
        setSubject('');
        setBody('');
      }
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to send the email.')),
  });

  const previewMutation = useMutation({
    mutationFn: () => mailApi.preview({ templateId, variables: values, subject: subjectOverride.trim() || undefined }),
    onSuccess: (data) => setPreviewHtml(data.html),
    onError: (error) => toast.error(getErrorMessage(error, 'Could not build the preview.')),
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Send Mail"
        description="Send a custom message or a branded Exam Ready template straight to any email address."
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Compose</CardTitle>
            <CardDescription>The mail is sent immediately when you press Send.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="mail-to">To</Label>
              <Input
                id="mail-to"
                type="email"
                placeholder="student@example.com"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>

            <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
              <TabsList>
                <TabsTrigger value="plain">Custom message</TabsTrigger>
                <TabsTrigger value="template">Use a template</TabsTrigger>
              </TabsList>

              <TabsContent value="plain" className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="mail-subject">Subject</Label>
                  <Input id="mail-subject" value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={200} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="mail-body">Message</Label>
                  <Textarea
                    id="mail-body"
                    rows={9}
                    className="resize-y"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write your message…"
                  />
                </div>
              </TabsContent>

              <TabsContent value="template" className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Template</Label>
                  <Select value={templateId} onValueChange={chooseTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder={templatesFailed ? 'Could not load templates' : 'Choose a template'} />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((t) => (
                        <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {template && (
                    <p className="text-xs text-[var(--color-muted-foreground)]">{template.description}</p>
                  )}
                </div>

                {template && (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {template.variables.map((v) => (
                        <div key={v.key} className="space-y-1.5">
                          <Label htmlFor={`kw-${v.key}`}>
                            {v.label} <code className="text-[11px] text-[var(--color-muted-foreground)]">{`{{${v.key}}}`}</code>
                          </Label>
                          <Input
                            id={`kw-${v.key}`}
                            type={v.type === 'url' ? 'url' : 'text'}
                            placeholder={v.placeholder}
                            maxLength={500}
                            value={values[v.key] ?? ''}
                            onChange={(e) => setValues((prev) => ({ ...prev, [v.key]: e.target.value }))}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="mail-subject-override">Subject (optional)</Label>
                      <Input
                        id="mail-subject-override"
                        placeholder={template.subject}
                        value={subjectOverride}
                        onChange={(e) => setSubjectOverride(e.target.value)}
                        maxLength={200}
                      />
                      <p className="text-xs text-[var(--color-muted-foreground)]">
                        Leave empty to use the default. Keywords like {'{{name}}'} work here too.
                      </p>
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
              {mode === 'template' && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={!templateReady || previewMutation.isPending}
                  onClick={() => previewMutation.mutate()}
                >
                  {previewMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Eye size={15} />}
                  Preview
                </Button>
              )}
              <Button type="button" disabled={!canSend || sendMutation.isPending} onClick={() => sendMutation.mutate()}>
                {sendMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                {sendMutation.isPending ? 'Sending…' : 'Send'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>Template mails show exactly what the student receives.</CardDescription>
          </CardHeader>
          <CardContent>
            {previewHtml ? (
              <iframe
                title="Email preview"
                sandbox=""
                srcDoc={previewHtml}
                className="h-[620px] w-full rounded-lg border border-[var(--color-hairline)] bg-white"
              />
            ) : (
              <div className="flex h-[240px] items-center justify-center rounded-lg border border-dashed border-[var(--color-hairline)] text-center text-sm text-[var(--color-muted-foreground)]">
                Choose a template, fill the keywords and press Preview.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <MailNotes />
    </div>
  );
}

const SEND_FN = `// exam-ready-node: src/services/mail.service.ts  — the ONLY file that talks to SMTP (nodemailer)
sendMail(payload: SendMailPayload): Promise<{ messageId; accepted; rejected }>

SendMailPayload = {
  to: string | string[];
  subject: string;
  html?: string;      // html and/or text — at least one is required
  text?: string;
  attachments?: Mail.Attachment[];
}

// same file — render a template, then call sendMail()
sendTemplateMail(payload: SendTemplateMailPayload): Promise<SendMailResult>

SendTemplateMailPayload = {
  to: string | string[];
  templateId: string;                      // "welcome" | "exam-reminder" | "payment-success"
  variables: Record<string, string|number>; // keyword -> value
  subject?: string;                        // optional override of the template subject
}`;

const RENDER_FN = `// exam-ready-node: src/mail/template-renderer.ts — replaces {{keywords}} in the HTML
renderTemplate(
  source: string,                          // any HTML string containing {{key}} / {{{key}}}
  variables: Record<string, string|number>,
  options?: { escape?: boolean }           // default true (HTML-escape values)
): string

// same file — template file + layout.html (logo/header/footer) -> final email
renderEmail(
  templateId: string,
  variables: Record<string, string|number>,
  subjectOverride?: string
): Promise<{ subject: string; html: string; text: string }>

// {{key}}   -> escaped value        {{{key}}} -> raw value (trusted HTML only)`;

const API_FN = `// Frontend (src/lib/api/mail.ts) -> exam-ready-node backend, admin bearer token
POST /api/admin/mail/send
  { mode: "plain",    to, subject, body }
  { mode: "template", to, templateId, variables: { name: "Rahul", ... }, subject? }

POST /api/admin/mail/preview   { templateId, variables, subject? } -> { subject, html }
GET  /api/admin/mail/templates -> templates + the keywords each one needs`;

function MailNotes() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Developer notes — how mail works</CardTitle>
        <CardDescription>Where the mail code lives and how to reuse it.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 text-[13.5px] leading-relaxed">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <b>Send function:</b> <code>sendMail()</code> and <code>sendTemplateMail()</code> in{' '}
            <code>src/services/mail.service.ts</code> in the <b>exam-ready-node</b> backend. Import them in any backend service or controller when an email must go out.
            SMTP is read from <code>SMTP_HOST</code>, <code>SMTP_PORT</code>, <code>SMTP_USER</code>,{' '}
            <code>SMTP_PASSWORD</code> (optional <code>SMTP_FROM</code>) in the backend <code>.env</code>. Routes: <code>src/routes/mail.routes.ts</code>, <code>src/controllers/mail.controller.ts</code>.
          </li>
          <li>
            <b>Keyword replace function:</b> <code>renderTemplate()</code> (and <code>renderEmail()</code>) in{' '}
            <code>src/mail/template-renderer.ts</code> (backend).
          </li>
          <li>
            <b>HTML files:</b> <code>src/mail/templates/</code> (backend) — <code>layout.html</code> (logo, theme, footer
            shared by all), plus <code>welcome.html</code>, <code>exam-reminder.html</code>,{' '}
            <code>payment-success.html</code>. The logo is <code>templates/logo.png</code>, embedded in each mail.
          </li>
          <li>
            <b>Add a new template:</b> add <code>my-template.html</code> using <code>{'{{keyword}}'}</code>{' '}
            placeholders, then register it (id, subject, keyword list) in{' '}
            <code>src/mail/template-registry.ts</code> (backend). It appears in this page automatically with its
            keyword form.
          </li>
          <li>
            <b>Safety:</b> the mail endpoints are admin-only (<code>requireAdmin</code>), values are HTML-escaped, and button links must be
            http(s).
          </li>
        </ul>

        <div className="grid gap-4 lg:grid-cols-2">
          <CodeBlock title="Send functions — payloads" code={SEND_FN} />
          <CodeBlock title="Keyword replace functions — payloads" code={RENDER_FN} />
        </div>
        <CodeBlock title="HTTP API used by this page" code={API_FN} />
      </CardContent>
    </Card>
  );
}

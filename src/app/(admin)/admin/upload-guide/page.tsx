'use client';

import Link from 'next/link';
import {
  FileText, Printer, CheckCircle2, XCircle, AlertTriangle,
  Download, FileUp, Languages, ListOrdered, Ban, Hash, MonitorCog,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CodeBlock } from '@/components/admin/CodeBlock';
import { UploadSteps } from '@/components/admin/UploadSteps';
import { useAdminT } from '@/lib/admin/i18n';
import {
  META_SAMPLE, QUESTION_SAMPLE, BILINGUAL_SAMPLE,
  FORMAT_FIELDS, BLOCKING_ERRORS, WARNINGS,
} from '@/lib/admin/pdfFormat';

export default function UploadGuidePage() {
  const { t, lang } = useAdminT();
  const g = t.guide;

  const rules = [
    { icon: MonitorCog, title: g.rule1Title, body: g.rule1Body },
    { icon: ListOrdered, title: g.rule2Title, body: g.rule2Body },
    { icon: Hash, title: g.rule3Title, body: g.rule3Body },
    { icon: Ban, title: g.rule4Title, body: g.rule4Body },
    { icon: FileText, title: g.rule5Title, body: g.rule5Body },
  ];

  return (
    <div className="space-y-6 print-doc">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-black tracking-tight sm:text-2xl">{g.title}</h1>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{g.subtitle}</p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2 no-print">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            {g.printBtn}
          </Button>
          <Button asChild size="sm" className="gap-1.5 font-semibold">
            <Link href="/admin/uploads/new">
              <FileUp className="h-4 w-4" />
              {t.nav.uploadPdf}
            </Link>
          </Button>
        </div>
      </div>

      {/* ─── How it works ─── */}
      <Card className="print-box border-[var(--color-bblue-100)] bg-[var(--color-bblue-50)] dark:border-[var(--color-bblue-700)]/30 dark:bg-[var(--color-bblue-700)]/10">
        <CardContent className="p-4 sm:p-5">
          <h2 className="mb-1.5 text-base font-bold">{g.introTitle}</h2>
          <p className="text-sm leading-relaxed text-[var(--color-muted-foreground)]">{g.introBody}</p>
        </CardContent>
      </Card>

      {/* ─── The nine steps ─── */}
      <UploadSteps />

      {/* ─── Five rules ─── */}
      <section>
        <h2 className="mb-3 text-base font-bold sm:text-lg">{g.rulesTitle}</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {rules.map((rule, i) => {
            const Icon = rule.icon;
            return (
              <Card key={i} className="print-box h-full">
                <CardContent className="flex h-full gap-3 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-bblue-50)] text-[var(--color-primary)] dark:bg-[var(--color-bblue-700)]/20">
                    <Icon className="h-4.5 w-4.5" size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[11px] font-black text-[var(--color-muted-foreground)]">{i + 1}</span>
                      <h3 className="text-[13.5px] font-bold leading-snug">{rule.title}</h3>
                    </div>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--color-muted-foreground)]">
                      {rule.body}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ─── Part 1: META ─── */}
      <section>
        <h2 className="text-base font-bold sm:text-lg">{g.metaTitle}</h2>
        <p className="mb-3 mt-1 text-sm text-[var(--color-muted-foreground)]">{g.metaBody}</p>
        <CodeBlock code={META_SAMPLE} title="#META" />
      </section>

      {/* ─── Part 2: questions ─── */}
      <section>
        <h2 className="text-base font-bold sm:text-lg">{g.questionTitle}</h2>
        <p className="mb-3 mt-1 text-sm text-[var(--color-muted-foreground)]">{g.questionBody}</p>
        <CodeBlock code={QUESTION_SAMPLE} title="Questions" />
      </section>

      {/* ─── Bilingual ─── */}
      <section>
        <h2 className="flex items-center gap-2 text-base font-bold sm:text-lg">
          <Languages className="h-4 w-4 text-[var(--color-primary)]" />
          {g.bilingualTitle}
        </h2>
        <p className="mb-3 mt-1 text-sm text-[var(--color-muted-foreground)]">{g.bilingualBody}</p>
        <CodeBlock code={BILINGUAL_SAMPLE} title="BILINGUAL" />
      </section>

      {/* ─── Field reference ─── */}
      <section>
        <h2 className="mb-3 text-base font-bold sm:text-lg">{g.fieldsTitle}</h2>

        {/* Desktop: table. Mobile: stacked cards — a 3-column table is unreadable at 375px. */}
        <Card className="print-box hidden overflow-hidden md:block">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-hairline)] bg-[var(--color-muted)]">
                  <th className="px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                    {g.colField}
                  </th>
                  <th className="w-28 px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                    {g.colRequired}
                  </th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                    {g.colNotes}
                  </th>
                </tr>
              </thead>
              <tbody>
                {FORMAT_FIELDS.map((f) => (
                  <tr key={f.marker} className="border-b border-[var(--color-hairline)] last:border-0">
                    <td className="px-4 py-2.5">
                      <code className="rounded bg-[var(--color-bblue-50)] px-1.5 py-0.5 font-mono text-[12px] font-semibold text-[var(--color-primary)] dark:bg-[var(--color-bblue-700)]/20">
                        {f.marker}
                      </code>
                    </td>
                    <td className="px-4 py-2.5">
                      {f.required ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-bred-50)] px-2 py-0.5 text-[11px] font-bold text-[var(--color-bred-600)] dark:bg-[var(--color-bred-500)]/15">
                          {g.yes}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-muted)] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-muted-foreground)]">
                          {g.no}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-[13px] text-[var(--color-muted-foreground)]">
                      {f.notes[lang]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="grid gap-2 md:hidden">
          {FORMAT_FIELDS.map((f) => (
            <Card key={f.marker} className="print-box">
              <CardContent className="p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <code className="rounded bg-[var(--color-bblue-50)] px-1.5 py-0.5 font-mono text-[12px] font-semibold text-[var(--color-primary)] dark:bg-[var(--color-bblue-700)]/20">
                    {f.marker}
                  </code>
                  {f.required ? (
                    <span className="rounded-full bg-[var(--color-bred-50)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-bred-600)] dark:bg-[var(--color-bred-500)]/15">
                      {g.yes}
                    </span>
                  ) : (
                    <span className="rounded-full bg-[var(--color-muted)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-muted-foreground)]">
                      {g.no}
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--color-muted-foreground)]">
                  {f.notes[lang]}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── Errors vs warnings ─── */}
      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="print-box border-[var(--color-bred-100)] bg-[var(--color-bred-50)] dark:border-[var(--color-bred-500)]/25 dark:bg-[var(--color-bred-500)]/10">
          <CardContent className="p-4 sm:p-5">
            <h3 className="mb-3 flex items-center gap-2 text-[14.5px] font-bold text-[var(--color-bred-600)]">
              <XCircle className="h-4 w-4" />
              {g.errorsTitle}
            </h3>
            <ul className="space-y-1.5">
              {BLOCKING_ERRORS.map((e, i) => (
                <li key={i} className="flex gap-2 text-[13px] leading-relaxed">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--color-bred-600)]" />
                  <span>{e[lang]}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="print-box border-[var(--color-borange-100)] bg-[var(--color-borange-50)] dark:border-[var(--color-borange-500)]/25 dark:bg-[var(--color-borange-500)]/10">
          <CardContent className="p-4 sm:p-5">
            <h3 className="mb-3 flex items-center gap-2 text-[14.5px] font-bold text-[var(--color-borange-600)]">
              <AlertTriangle className="h-4 w-4" />
              {g.warningsTitle}
            </h3>
            <ul className="space-y-1.5">
              {WARNINGS.map((w, i) => (
                <li key={i} className="flex gap-2 text-[13px] leading-relaxed">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--color-borange-600)]" />
                  <span>{w[lang]}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* ─── Templates ─── */}
      <Card className="print-box no-print">
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-bgreen-50)] text-[var(--color-bgreen-600)] dark:bg-[var(--color-bgreen-500)]/15">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[14.5px] font-bold">{g.downloadTitle}</h3>
              <p className="mt-0.5 text-[12.5px] text-[var(--color-muted-foreground)]">{g.downloadBody}</p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <Button asChild size="sm" className="gap-1.5 font-semibold">
              <a href="/templates/question-set-template.docx" download>
                <Download className="h-4 w-4" />
                {g.downloadDocx}
              </a>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <a href="/templates/question-set-sample.pdf" download>
                <Download className="h-4 w-4" />
                {g.downloadSample}
              </a>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <a href="/templates/question-set-sample.docx" download>
                <Download className="h-4 w-4" />
                {g.downloadSampleDocx}
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

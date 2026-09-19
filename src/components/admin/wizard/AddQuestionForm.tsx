'use client';

import { useState } from 'react';
import { Loader2, Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAdminT } from '@/lib/admin/i18n';
import { cn } from '@/lib/utils';
import type { NewQuestionInput } from '@/types/questionUpload';

const KEYS = ['A', 'B', 'C', 'D'];

interface AddQuestionFormProps {
  busy: boolean;
  onSubmit: (input: NewQuestionInput, done: () => void) => void;
}

/**
 * Writes a question the uploaded file did not contain, so a paper that came up
 * short of its required count can be completed without re-uploading.
 */
export function AddQuestionForm({ busy, onSubmit }: AddQuestionFormProps) {
  const { t } = useAdminT();
  const w = t.wizard;

  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [textBn, setTextBn] = useState('');
  const [options, setOptions] = useState(() => KEYS.map(() => ({ text: '', textBn: '' })));
  const [answer, setAnswer] = useState('A');
  const [subject, setSubject] = useState('');
  const [explanation, setExplanation] = useState('');

  const reset = () => {
    setText('');
    setTextBn('');
    setOptions(KEYS.map(() => ({ text: '', textBn: '' })));
    setAnswer('A');
    setSubject('');
    setExplanation('');
    setOpen(false);
  };

  const setOption = (index: number, key: 'text' | 'textBn', value: string) =>
    setOptions((current) => current.map((option, i) => (i === index ? { ...option, [key]: value } : option)));

  const filled = options.filter((option) => option.text.trim().length > 0);
  const answerFilled = Boolean(options[KEYS.indexOf(answer)]?.text.trim());
  const valid = text.trim().length >= 5 && filled.length >= 2 && answerFilled;

  if (!open) {
    return (
      <Button variant="outline" className="w-full gap-2 border-dashed font-semibold" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        {w.addQuestionCta}
      </Button>
    );
  }

  return (
    <Card className="border-[var(--color-primary)]/40">
      <CardContent className="space-y-3.5 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-[15px] font-bold">{w.addQuestionTitle}</h3>
            <p className="mt-0.5 text-[12.5px] text-[var(--color-muted-foreground)]">{w.addQuestionHelp}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={reset} aria-label={t.common.cancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="new-q-text">{w.questionTextLabel}</Label>
          <Textarea id="new-q-text" rows={2} value={text} onChange={(e) => setText(e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="new-q-text-bn">{w.questionTextBnLabel}</Label>
          <Textarea id="new-q-text-bn" rows={2} value={textBn} onChange={(e) => setTextBn(e.target.value)} />
        </div>

        <fieldset className="space-y-2">
          <legend className="mb-1 text-[13px] font-medium">{w.correctAnswerLabel}</legend>
          {KEYS.map((key, index) => (
            <div key={key} className="flex items-start gap-2.5">
              <label
                className={cn(
                  'mt-2 flex shrink-0 cursor-pointer items-center gap-1.5 text-[13px] font-bold',
                  answer === key && 'text-[var(--color-bgreen-600)]'
                )}
              >
                <input
                  type="radio"
                  name="new-question-answer"
                  checked={answer === key}
                  onChange={() => setAnswer(key)}
                  className="h-4 w-4 accent-green-600"
                  aria-label={`${w.optionLabel} ${key}`}
                />
                {key}
              </label>
              <div className="grid flex-1 gap-1.5 sm:grid-cols-2">
                <Input
                  value={options[index]?.text ?? ''}
                  onChange={(e) => setOption(index, 'text', e.target.value)}
                  placeholder={`${w.optionLabel} ${key}`}
                />
                <Input
                  value={options[index]?.textBn ?? ''}
                  onChange={(e) => setOption(index, 'textBn', e.target.value)}
                  placeholder={`${w.optionLabel} ${key} — বাংলা`}
                />
              </div>
            </div>
          ))}
        </fieldset>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="new-q-subject">{w.subjectLabel}</Label>
            <Input id="new-q-subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-q-explanation">{w.explanationFieldLabel}</Label>
            <Input id="new-q-explanation" value={explanation} onChange={(e) => setExplanation(e.target.value)} />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            className="gap-2 font-semibold"
            disabled={!valid || busy}
            onClick={() =>
              onSubmit(
                {
                  text: text.trim(),
                  ...(textBn.trim() ? { textBn: textBn.trim() } : {}),
                  options: KEYS.map((key, index) => ({
                    key,
                    text: options[index]?.text.trim() ?? '',
                    ...(options[index]?.textBn.trim() ? { textBn: options[index]!.textBn.trim() } : {}),
                  })).filter((option) => option.text.length > 0),
                  answerKey: answer,
                  ...(subject.trim() ? { subject: subject.trim() } : {}),
                  ...(explanation.trim() ? { explanation: explanation.trim() } : {}),
                },
                reset
              )
            }
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {w.saveQuestionCta}
          </Button>
          <Button variant="ghost" onClick={reset}>
            {t.common.cancel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

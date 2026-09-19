'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  /** Optional caption shown in the block's header strip. */
  title?: string;
  className?: string;
}

/**
 * Monospaced, copyable snippet used across the PDF format guide.
 *
 * The font stack ends in Nirmala UI / Shonar Bangla because the samples carry
 * Bengali: a pure-ASCII monospace stack would drop to a fallback that shapes
 * conjuncts badly.
 */
export function CodeBlock({ code, title, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* Clipboard blocked (insecure context / denied permission) — the text
         stays selectable, so the user can still copy it by hand. */
    }
  };

  return (
    <div className={cn('print-box overflow-hidden rounded-xl border border-[var(--color-hairline)]', className)}>
      <div className="flex items-center justify-between gap-2 border-b border-[var(--color-hairline)] bg-[var(--color-muted)] px-3 py-1.5">
        <span className="truncate text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
          {title ?? 'Format'}
        </span>
        <button
          onClick={copy}
          className="no-print flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold text-[var(--color-muted-foreground)] transition-colors hover:bg-[var(--color-card)] hover:text-[var(--color-foreground)]"
        >
          {copied ? <Check size={13} className="text-[var(--color-bgreen-600)]" /> : <Copy size={13} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <pre
        className="overflow-x-auto bg-[var(--color-card)] p-3 text-[12px] leading-relaxed sm:p-4 sm:text-[12.5px]"
        style={{ fontFamily: "Consolas, 'Cascadia Mono', 'Nirmala UI', 'Shonar Bangla', monospace" }}
      >
        <code className="whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

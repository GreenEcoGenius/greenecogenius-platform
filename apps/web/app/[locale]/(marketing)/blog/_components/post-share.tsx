'use client';

import { type ComponentType, type SVGProps, useState } from 'react';

import { Check, Copy, Mail } from 'lucide-react';

import { cn } from '@kit/ui/utils';

/** Inline LinkedIn brand glyph (Lucide v1 has no brand icons). */
function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45C23.21 24 24 23.23 24 22.27V1.72C24 .77 23.21 0 22.22 0z" />
    </svg>
  );
}

/** Inline X (Twitter) brand glyph. */
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

interface PostShareProps {
  url: string;
  title: string;
  /** Already-translated label for "Share". */
  shareLabel: string;
  /** Already-translated aria-labels per channel. */
  linkedinLabel: string;
  twitterLabel: string;
  emailLabel: string;
  /** Aria-label for the copy button (idle state). */
  copyLabel: string;
  /** Visible feedback when the link is copied. */
  copiedLabel: string;
}

/**
 * Minimal share toolbar rendered in the article sidebar. Uses
 * `window.open` for the social channels (no nested anchors) and the
 * Clipboard API for the copy button.
 */
export function PostShare({
  url,
  title,
  shareLabel,
  linkedinLabel,
  twitterLabel,
  emailLabel,
  copyLabel,
  copiedLabel,
}: PostShareProps) {
  const [copied, setCopied] = useState(false);

  const open = (target: string) => {
    window.open(target, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const buttons: Array<{
    label: string;
    icon: ComponentType<{ className?: string } & SVGProps<SVGSVGElement>>;
    onClick: () => void;
  }> = [
    {
      label: linkedinLabel,
      icon: LinkedinIcon,
      onClick: () =>
        open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`),
    },
    {
      label: twitterLabel,
      icon: XIcon,
      onClick: () =>
        open(
          `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        ),
    },
    {
      label: emailLabel,
      icon: Mail,
      onClick: () =>
        open(
          `mailto:?subject=${encodedTitle}&body=${encodedTitle}%20${encodedUrl}`,
        ),
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs uppercase tracking-[0.08em] text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
        <span aria-hidden="true">[ </span>
        {shareLabel}
        <span aria-hidden="true"> ]</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {buttons.map((b) => {
          const Icon = b.icon;

          return (
            <button
              key={b.label}
              type="button"
              onClick={b.onClick}
              aria-label={b.label}
              className="inline-flex h-9 w-9 items-center justify-center rounded-[--radius-enviro-pill] border border-[--color-enviro-cream-300] bg-white text-[--color-enviro-forest-700] transition-colors hover:border-[--color-enviro-forest-700] hover:bg-[--color-enviro-cream-100]"
            >
              <Icon className="h-4 w-4" strokeWidth={1.5} />
            </button>
          );
        })}
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? copiedLabel : copyLabel}
          className={cn(
            'inline-flex h-9 items-center gap-2 rounded-[--radius-enviro-pill] border px-3 text-xs font-medium transition-all duration-200 font-[family-name:var(--font-enviro-sans)]',
            copied
              ? 'border-[--color-enviro-lime-400] bg-[--color-enviro-lime-300] text-[--color-enviro-forest-900]'
              : 'border-[--color-enviro-cream-300] bg-white text-[--color-enviro-forest-700] hover:border-[--color-enviro-forest-700] hover:bg-[--color-enviro-cream-100]',
          )}
        >
          {copied ? (
            <Check className="h-4 w-4" strokeWidth={1.5} />
          ) : (
            <Copy className="h-4 w-4" strokeWidth={1.5} />
          )}
          <span>{copied ? copiedLabel : copyLabel}</span>
        </button>
      </div>
    </div>
  );
}

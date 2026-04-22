'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

import { getSafeRedirectPath } from '@kit/shared/utils';

interface EnviroDocsBackButtonProps {
  /** Already-translated label rendered next to the icon (hidden on mobile). */
  label: string;
  /** Default fallback path when no `returnPath` query param is provided. */
  fallbackHref?: string;
  className?: string;
}

/**
 * Inline back link for the docs header. Reads `?returnPath=` from the URL so
 * deep links from the marketing site or dashboard return to the originating
 * page (validated through `getSafeRedirectPath` to block open redirects).
 */
export function EnviroDocsBackButton({
  label,
  fallbackHref = '/',
  className = '',
}: EnviroDocsBackButtonProps) {
  const searchParams = useSearchParams();
  const returnPath = searchParams.get('returnPath');
  const safeHref = getSafeRedirectPath(returnPath, fallbackHref) ?? fallbackHref;

  return (
    <Link
      href={safeHref}
      className={`inline-flex items-center gap-1.5 rounded-[--radius-enviro-sm] px-2 py-1 text-sm font-medium text-[--color-enviro-forest-700] transition-colors duration-200 hover:text-[--color-enviro-forest-900] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-forest-300]/60 font-[family-name:var(--font-enviro-sans)] ${className}`}
    >
      <ArrowLeft aria-hidden="true" className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}

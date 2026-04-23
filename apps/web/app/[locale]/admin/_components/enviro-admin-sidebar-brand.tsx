'use client';

import Link from 'next/link';

import { ShieldCheck } from 'lucide-react';

import { useEnviroSidebar } from '~/components/enviro/dashboard';

interface EnviroAdminSidebarBrandProps {
  /** Already-translated brand label. */
  label: string;
  /** Already-translated tag label (e.g. "Administration"). */
  tag: string;
}

/**
 * Brand block for the admin sidebar. Forest forest with a lime leaf is
 * reused from the user dashboard, but the secondary tag underneath is
 * displayed in ember to remind operators they are in a privileged context.
 */
export function EnviroAdminSidebarBrand({
  label,
  tag,
}: EnviroAdminSidebarBrandProps) {
  const { collapsed } = useEnviroSidebar();

  if (collapsed) {
    return (
      <Link
        href="/admin"
        aria-label={label}
        className="flex h-9 w-9 items-center justify-center rounded-[--radius-enviro-md] bg-white/[0.06] text-[--color-enviro-ember-300] transition-colors hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-ember-300]/60"
      >
        <ShieldCheck aria-hidden="true" className="h-5 w-5" />
      </Link>
    );
  }

  return (
    <Link
      href="/admin"
      className="inline-flex flex-col gap-0.5 rounded-[--radius-enviro-sm] py-1 text-[--color-enviro-fg-inverse] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-ember-300]/60"
    >
      <span className="inline-flex items-center gap-2 text-base font-semibold tracking-tight font-[family-name:var(--font-enviro-display)]">
        <ShieldCheck
          aria-hidden="true"
          className="h-5 w-5 text-[--color-enviro-ember-300]"
        />
        <span className="truncate">{label}</span>
      </span>
      <span className="ml-7 text-[10px] font-medium uppercase tracking-[0.12em] text-[--color-enviro-ember-300]/80 font-[family-name:var(--font-enviro-mono)]">
        {tag}
      </span>
    </Link>
  );
}

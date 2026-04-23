'use client';

import Link from 'next/link';

import { Leaf } from 'lucide-react';

import { useEnviroSidebar } from '~/components/enviro/dashboard';

interface EnviroSidebarBrandProps {
  label: string;
}

/**
 * Sidebar brand block. Renders the wordmark when the sidebar is expanded
 * and falls back to a single leaf glyph when collapsed (72 px rail).
 *
 * Uses a plain `<Link href="/home">` rather than the legacy `<AppLogo>`
 * because that one ships a heavy raster logo sized for the public site;
 * inside the dashboard chrome we want a tight wordmark.
 */
export function EnviroSidebarBrand({ label }: EnviroSidebarBrandProps) {
  const { collapsed } = useEnviroSidebar();

  if (collapsed) {
    return (
      <Link
        href="/home"
        aria-label={label}
        className="flex h-9 w-9 items-center justify-center rounded-[--radius-enviro-md] bg-white/[0.06] text-[--color-enviro-lime-300] transition-colors hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-lime-300]/60"
      >
        <Leaf aria-hidden="true" className="h-5 w-5" />
      </Link>
    );
  }

  return (
    <Link
      href="/home"
      className="inline-flex items-center gap-2 rounded-[--radius-enviro-sm] py-1 text-base font-semibold tracking-tight text-[--color-enviro-fg-inverse] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-lime-300]/60 font-[family-name:var(--font-enviro-display)]"
    >
      <Leaf
        aria-hidden="true"
        className="h-5 w-5 text-[--color-enviro-lime-300]"
      />
      <span className="truncate">{label}</span>
    </Link>
  );
}

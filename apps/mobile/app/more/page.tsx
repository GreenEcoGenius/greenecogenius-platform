'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  ShoppingBag,
  ShieldCheck,
  BarChart3,
  Users,
  ChevronRight,
} from 'lucide-react';

import { AppShell } from '~/components/app-shell';
import { AuthGuard } from '~/components/auth-guard';

export default function MorePage() {
  return (
    <AuthGuard>
      <MoreContent />
    </AuthGuard>
  );
}

function MoreContent() {
  const t = useTranslations('more');

  const items: Array<{
    href: string;
    icon: typeof ShoppingBag;
    label: string;
    desc: string;
    badge?: string;
    disabled?: boolean;
  }> = [
    {
      href: '/marketplace',
      icon: ShoppingBag,
      label: t('marketplace'),
      desc: t('marketplaceDesc'),
      badge: t('badgeNew'),
    },
    {
      href: '/traceability',
      icon: ShieldCheck,
      label: t('traceability'),
      desc: t('traceabilityDesc'),
      badge: t('badgeNew'),
    },
    {
      href: '/dashboard',
      icon: BarChart3,
      label: t('dashboard'),
      desc: t('dashboardDesc'),
    },
    {
      href: '/teams',
      icon: Users,
      label: t('teams'),
      desc: t('teamsDesc'),
    },
  ];

  return (
    <AppShell title={t('title')} subtitle={t('subtitle')}>
      <div className="space-y-2">
        {items.map(({ href, icon: Icon, label, desc, badge, disabled }) => {
          const content = (
            <div
              className={`flex items-center gap-3 rounded-2xl border border-[#F5F5F0]/8 bg-[#F5F5F0]/5 px-4 py-3 transition-all ${
                disabled
                  ? 'opacity-50'
                  : 'active:scale-[0.99] active:bg-[#F5F5F0]/8'
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#B8D4E3]/15">
                <Icon className="h-5 w-5 text-[#B8D4E3]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-semibold text-[#F5F5F0]">
                    {label}
                  </p>
                  {badge && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                        disabled
                          ? 'bg-[#F5F5F0]/10 text-[#F5F5F0]/50'
                          : 'bg-[#B8D4E3]/20 text-[#B8D4E3]'
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#F5F5F0]/50">{desc}</p>
              </div>
              {!disabled && (
                <ChevronRight className="h-4 w-4 shrink-0 text-[#F5F5F0]/30" />
              )}
            </div>
          );

          if (disabled) {
            return <div key={href}>{content}</div>;
          }
          return (
            <Link key={href} href={href}>
              {content}
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}

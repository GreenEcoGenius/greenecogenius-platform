'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  ShoppingBag,
  QrCode,
  BarChart3,
  FileText,
  Users,
  CreditCard,
  Sparkles,
  Leaf,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { AuthGuard } from '~/components/auth-guard';
import { AppShell } from '~/components/app-shell';

interface ServiceItem {
  icon: typeof ShoppingBag;
  labelKey: string;
  descKey: string;
  href: string;
  color: string;
  badge?: string;
}

function MoreContent() {
  const t = useTranslations('more');

  const services: { titleKey: string; items: ServiceItem[] }[] = [
    {
      titleKey: 'circularEconomy',
      items: [
        {
          icon: ShoppingBag,
          labelKey: 'marketplaceLabel',
          descKey: 'marketplaceDescFull',
          href: '/marketplace',
          color: '#B8D4E3',
        },
        {
          icon: QrCode,
          labelKey: 'traceabilityLabel',
          descKey: 'traceabilityDescFull',
          href: '/traceability',
          color: '#6EE7B7',
        },
      ],
    },
    {
      titleKey: 'reportingTitle',
      items: [
        {
          icon: Leaf,
          labelKey: 'carbonLabel',
          descKey: 'carbonDescFull',
          href: '/carbon',
          color: '#6EE7B7',
        },
        {
          icon: BarChart3,
          labelKey: 'esgLabel',
          descKey: 'esgDescFull',
          href: '/carbon/esg',
          color: '#F59E0B',
        },
        {
          icon: FileText,
          labelKey: 'reportsLabel',
          descKey: 'reportsDescFull',
          href: '/carbon/records',
          color: '#F5F5F0',
        },
      ],
    },
    {
      titleKey: 'organisationTitle',
      items: [
        {
          icon: Users,
          labelKey: 'teamsLabel',
          descKey: 'teamsDescFull',
          href: '/teams',
          color: '#B8D4E3',
        },
        {
          icon: CreditCard,
          labelKey: 'billingLabel',
          descKey: 'billingDescFull',
          href: '/settings/billing',
          color: '#A78BFA',
          badge: 'STRIPE',
        },
      ],
    },
    {
      titleKey: 'aiTitle',
      items: [
        {
          icon: Sparkles,
          labelKey: 'geniusLabel',
          descKey: 'geniusDescFull',
          href: '/genius',
          color: '#F59E0B',
        },
        {
          icon: TrendingUp,
          labelKey: 'dashboardLabel',
          descKey: 'dashboardDescFull',
          href: '/dashboard',
          color: '#B8D4E3',
        },
      ],
    },
  ];

  return (
    <AppShell title={t('title')} subtitle={t('subtitle')}>
      <div className="space-y-5 pb-4">
        {services.map((section) => (
          <section key={section.titleKey}>
            <h2 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-[#F5F5F0]/40">
              {t(section.titleKey)}
            </h2>
            <div className="overflow-hidden rounded-2xl border border-[#F5F5F0]/[0.06] bg-[#F5F5F0]/[0.02]">
              {section.items.map((item, j) => (
                <Link
                  key={item.labelKey}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-3 transition-colors ${
                    j > 0 ? 'border-t border-[#F5F5F0]/[0.05]' : ''
                  }`}
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${item.color}12` }}
                  >
                    <item.icon className="h-4 w-4" style={{ color: item.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-[#F5F5F0]">
                        {t(item.labelKey)}
                      </span>
                      {item.badge && (
                        <span className="rounded-md bg-[#F5F5F0]/[0.06] px-1.5 py-0.5 text-[9px] font-bold text-[#F5F5F0]/30">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#F5F5F0]/35">{t(item.descKey)}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-[#F5F5F0]/15" />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  );
}

export default function MorePage() {
  return (
    <AuthGuard>
      <MoreContent />
    </AuthGuard>
  );
}

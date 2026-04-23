'use client';

import { useMemo } from 'react';

import { usePathname } from 'next/navigation';

import { useTranslations } from 'next-intl';

import { EnviroDashboardBreadcrumb } from '~/components/enviro/dashboard';

const ROUTE_LABEL_KEYS: Record<string, string> = {
  '/home': 'routes.home',
  '/home/marketplace': 'routes.marketplace',
  '/home/carbon': 'routes.carbon',
  '/home/esg': 'routes.esg',
  '/home/traceability': 'routes.traceability',
  '/home/rse': 'routes.rse',
  '/home/compliance': 'routes.compliance',
  '/home/external-activities': 'routes.externalActivities',
  '/home/settings': 'routes.profile',
  '/home/my-listings': 'routes.myListings',
  '/home/wallet': 'routes.wallet',
  '/home/billing': 'routes.billing',
  '/home/pricing': 'routes.pricing',
};

interface EnviroDynamicBreadcrumbProps {
  ariaLabel: string;
}

/**
 * Builds a breadcrumb from the current pathname using known dashboard
 * top-level routes as anchors. Returns nothing when on `/home` itself
 * because the topbar already renders the dashboard logo to the left.
 *
 * Sub-routes (e.g. `/home/esg/csrd`) render the parent label as a link
 * and the last segment as a static label so the user always knows where
 * they are. We deliberately do not invent labels for unknown segments to
 * avoid leaking raw URL slugs into the UI.
 */
export function EnviroDynamicBreadcrumb({
  ariaLabel,
}: EnviroDynamicBreadcrumbProps) {
  const pathname = usePathname();
  const t = useTranslations('common');

  const items = useMemo(() => {
    const stripped = pathname.replace(/^\/(fr|en)(?=\/|$)/, '') || '/';

    if (!stripped.startsWith('/home')) return [];
    if (stripped === '/home') return [];

    const segments = stripped.split('/').filter(Boolean);

    const built: Array<{ label: string; href?: string }> = [
      { label: t('routes.home'), href: '/home' },
    ];

    let cursor = '';
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      if (!segment) continue;
      cursor += `/${segment}`;
      if (cursor === '/home') continue;

      const labelKey = ROUTE_LABEL_KEYS[cursor];
      if (!labelKey) continue;

      const isLast = i === segments.length - 1;
      built.push({
        label: t(labelKey),
        href: isLast ? undefined : cursor,
      });
    }

    return built;
  }, [pathname, t]);

  if (items.length === 0) return null;

  return <EnviroDashboardBreadcrumb items={items} ariaLabel={ariaLabel} />;
}

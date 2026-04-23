'use client';

import { useMemo } from 'react';

import { usePathname } from 'next/navigation';

import { useTranslations } from 'next-intl';

import { EnviroDashboardBreadcrumb } from '~/components/enviro/dashboard';

interface EnviroTeamDynamicBreadcrumbProps {
  account: string;
  workspaceLabel: string;
  ariaLabel: string;
}

const TEAM_ROUTE_LABEL_KEYS: Record<string, string> = {
  marketplace: 'routes.marketplace',
  'my-listings': 'routes.myListings',
  members: 'routes.members',
  settings: 'routes.settings',
  billing: 'routes.billing',
  profile: 'routes.profile',
};

/**
 * Account-prefixed breadcrumb. Always anchors on the workspace name (and
 * links back to `/home/[account]`) so users can jump from any nested
 * page back to the team root in one click. Sub-segments (`marketplace`,
 * `members`, etc.) get translated through `common.routes.*` to keep the
 * label catalog in sync with the sidebar.
 *
 * Unknown segments (e.g. UUIDs in `marketplace/[id]`) are skipped so we
 * never leak raw URL slugs into the chrome.
 */
export function EnviroTeamDynamicBreadcrumb({
  account,
  workspaceLabel,
  ariaLabel,
}: EnviroTeamDynamicBreadcrumbProps) {
  const pathname = usePathname();
  const t = useTranslations('common');

  const items = useMemo(() => {
    const stripped = pathname.replace(/^\/(fr|en)(?=\/|$)/, '') || '/';
    const accountRoot = `/home/${account}`;

    if (!stripped.startsWith(accountRoot)) return [];

    const built: Array<{ label: string; href?: string }> = [
      {
        label: workspaceLabel,
        href: stripped === accountRoot ? undefined : accountRoot,
      },
    ];

    if (stripped === accountRoot) return built;

    const tail = stripped.slice(accountRoot.length).split('/').filter(Boolean);

    let cursor = accountRoot;
    for (let i = 0; i < tail.length; i++) {
      const segment = tail[i];
      if (!segment) continue;
      cursor += `/${segment}`;

      const labelKey = TEAM_ROUTE_LABEL_KEYS[segment];
      if (!labelKey) continue;

      const isLast = i === tail.length - 1;
      built.push({
        label: t(labelKey),
        href: isLast ? undefined : cursor,
      });
    }

    return built;
  }, [pathname, account, workspaceLabel, t]);

  if (items.length === 0) return null;

  return <EnviroDashboardBreadcrumb items={items} ariaLabel={ariaLabel} />;
}

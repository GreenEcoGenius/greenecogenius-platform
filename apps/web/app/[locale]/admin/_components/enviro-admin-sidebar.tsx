import { LayoutDashboard, Users } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import {
  EnviroSidebar,
  EnviroSidebarNavItem,
} from '~/components/enviro/dashboard';

import { EnviroAdminSidebarBrand } from './enviro-admin-sidebar-brand';

/**
 * Server Component that renders the super-admin sidebar with translated
 * labels. Forest-900 background (consistent with the user dashboard) but
 * ember-300 active state to mark the privileged context. Two routes for
 * now: Dashboard and Accounts; more groups can be added when admin gains
 * sub-segments (e.g. metrics, audit log, feature flags).
 */
export async function EnviroAdminSidebar() {
  const t = await getTranslations('admin');

  return (
    <EnviroSidebar
      accent="ember"
      brand={
        <EnviroAdminSidebarBrand label={t('brandLabel')} tag={t('tag')} />
      }
      groups={[
        {
          heading: t('groupAdmin'),
          children: (
            <>
              <li>
                <EnviroSidebarNavItem
                  accent="ember"
                  href="/admin"
                  label={t('navDashboard')}
                  icon={<LayoutDashboard aria-hidden="true" />}
                  highlightMatch="^/admin$"
                />
              </li>
              <li>
                <EnviroSidebarNavItem
                  accent="ember"
                  href="/admin/accounts"
                  label={t('navAccounts')}
                  icon={<Users aria-hidden="true" />}
                />
              </li>
            </>
          ),
        },
      ]}
      collapseLabel={t('sidebarCollapseLabel')}
      expandLabel={t('sidebarExpandLabel')}
      closeLabel={t('menuCloseLabel')}
    />
  );
}

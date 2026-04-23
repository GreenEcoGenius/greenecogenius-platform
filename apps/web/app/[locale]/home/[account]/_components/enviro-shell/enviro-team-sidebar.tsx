import {
  CreditCard,
  LayoutDashboard,
  PackageSearch,
  Recycle,
  Settings,
  Users,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import {
  EnviroSidebar,
  EnviroSidebarNavItem,
} from '~/components/enviro/dashboard';

import { EnviroTeamSidebarBrand } from './enviro-team-sidebar-brand';

interface EnviroTeamSidebarProps {
  /** Already-resolved account slug (URL segment). */
  account: string;
  /** Workspace switcher slot (typically `<WorkspaceDropdown ... />`). */
  workspaceSwitcher: React.ReactNode;
  /** Whether team account billing routes should appear (feature flag). */
  enableTeamAccountBilling: boolean;
}

/**
 * Server Component that renders the team-scoped sidebar with translated
 * labels coming from `common.routes.*`. Mirrors the Phase 6 user dashboard
 * sidebar (`(user)/_components/enviro-shell/enviro-dashboard-sidebar.tsx`)
 * but routes every nav item through `/home/[account]/...` and includes
 * the workspace-specific items (Members, Billing) in the Settings group.
 *
 * Active accent stays `lime` (default) to match the rest of the user-facing
 * dashboard surface. The team context identity is conveyed by the brand
 * block (workspace dropdown) at the top of the sidebar.
 */
export async function EnviroTeamSidebar({
  account,
  workspaceSwitcher,
  enableTeamAccountBilling,
}: EnviroTeamSidebarProps) {
  const tCommon = await getTranslations('common');
  const tShell = await getTranslations('common.enviroShell');

  const accountPath = (suffix: string) =>
    suffix ? `/home/${account}/${suffix}` : `/home/${account}`;

  const platformGroup = (
    <>
      <li>
        <EnviroSidebarNavItem
          href={accountPath('')}
          label={tCommon('routes.dashboard')}
          icon={<LayoutDashboard aria-hidden="true" />}
          highlightMatch={`^/home/${account}$`}
        />
      </li>
      <li>
        <EnviroSidebarNavItem
          href={accountPath('marketplace')}
          label={tCommon('routes.marketplace')}
          icon={<Recycle aria-hidden="true" />}
        />
      </li>
      <li>
        <EnviroSidebarNavItem
          href={accountPath('my-listings')}
          label={tCommon('routes.myListings')}
          icon={<PackageSearch aria-hidden="true" />}
        />
      </li>
    </>
  );

  const settingsGroup = (
    <>
      <li>
        <EnviroSidebarNavItem
          href={accountPath('settings')}
          label={tCommon('routes.settings')}
          icon={<Settings aria-hidden="true" />}
        />
      </li>
      <li>
        <EnviroSidebarNavItem
          href={accountPath('members')}
          label={tCommon('routes.members')}
          icon={<Users aria-hidden="true" />}
        />
      </li>
      {enableTeamAccountBilling ? (
        <li>
          <EnviroSidebarNavItem
            href={accountPath('billing')}
            label={tCommon('routes.billing')}
            icon={<CreditCard aria-hidden="true" />}
          />
        </li>
      ) : null}
    </>
  );

  return (
    <EnviroSidebar
      brand={<EnviroTeamSidebarBrand>{workspaceSwitcher}</EnviroTeamSidebarBrand>}
      groups={[
        {
          heading: tCommon('routes.application'),
          children: platformGroup,
        },
        {
          heading: tCommon('routes.settings'),
          children: settingsGroup,
        },
      ]}
      collapseLabel={tShell('sidebarCollapse')}
      expandLabel={tShell('sidebarExpand')}
      closeLabel={tShell('sidebarCloseMobile')}
    />
  );
}

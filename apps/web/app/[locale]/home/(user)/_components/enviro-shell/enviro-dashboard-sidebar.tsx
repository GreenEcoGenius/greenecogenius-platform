import {
  Award,
  ClipboardList,
  CreditCard,
  FileBarChart,
  Home,
  Leaf,
  Link2,
  PackageSearch,
  Receipt,
  Recycle,
  ShieldCheck,
  User,
  Wallet,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import {
  EnviroSidebar,
  EnviroSidebarNavItem,
} from '~/components/enviro/dashboard';

import { EnviroSidebarBrand } from './enviro-sidebar-brand';

/**
 * Server Component that renders the dashboard sidebar with translated
 * labels coming from `common.routes.*` and `common.enviroShell.*`. The
 * navigation order mirrors `personal-account-navigation.config.tsx` so
 * the design and the legacy data structures stay in sync.
 *
 * NOTE: this component does NOT consume the personal-account config
 * directly because the config exposes its labels as raw i18n keys
 * (`common.routes.*`) that the legacy `<SidebarNavigation>` decoded
 * internally. Phase 6 owns the rendering, so we resolve the labels
 * ourselves to keep the icon and label coupling explicit.
 */
export async function EnviroDashboardSidebar() {
  const tCommon = await getTranslations('common');
  const tShell = await getTranslations('common.enviroShell');

  const platformGroup = (
    <>
      <li>
        <EnviroSidebarNavItem
          href="/home"
          label={tCommon('routes.home')}
          icon={<Home aria-hidden="true" />}
          highlightMatch="^/home$"
        />
      </li>
      <li>
        <EnviroSidebarNavItem
          href="/home/marketplace"
          label={tCommon('routes.marketplace')}
          icon={<Recycle aria-hidden="true" />}
        />
      </li>
      <li>
        <EnviroSidebarNavItem
          href="/home/carbon"
          label={tCommon('routes.carbon')}
          icon={<Leaf aria-hidden="true" />}
        />
      </li>
      <li>
        <EnviroSidebarNavItem
          href="/home/esg"
          label={tCommon('routes.esg')}
          icon={<FileBarChart aria-hidden="true" />}
        />
      </li>
      <li>
        <EnviroSidebarNavItem
          href="/home/traceability"
          label={tCommon('routes.traceability')}
          icon={<Link2 aria-hidden="true" />}
        />
      </li>
      <li>
        <EnviroSidebarNavItem
          href="/home/rse"
          label={tCommon('routes.rse')}
          icon={<Award aria-hidden="true" />}
        />
      </li>
      <li>
        <EnviroSidebarNavItem
          href="/home/compliance"
          label={tCommon('routes.compliance')}
          icon={<ShieldCheck aria-hidden="true" />}
        />
      </li>
      <li>
        <EnviroSidebarNavItem
          href="/home/external-activities"
          label={tCommon('routes.externalActivities')}
          icon={<ClipboardList aria-hidden="true" />}
        />
      </li>
    </>
  );

  const accountGroup = (
    <>
      <li>
        <EnviroSidebarNavItem
          href="/home/settings"
          label={tCommon('routes.profile')}
          icon={<User aria-hidden="true" />}
        />
      </li>
      <li>
        <EnviroSidebarNavItem
          href="/home/my-listings"
          label={tCommon('routes.myListings')}
          icon={<PackageSearch aria-hidden="true" />}
        />
      </li>
      <li>
        <EnviroSidebarNavItem
          href="/home/wallet"
          label={tCommon('routes.wallet')}
          icon={<Wallet aria-hidden="true" />}
        />
      </li>
      <li>
        <EnviroSidebarNavItem
          href="/home/billing"
          label={tCommon('routes.billing')}
          icon={<CreditCard aria-hidden="true" />}
        />
      </li>
      <li>
        <EnviroSidebarNavItem
          href="/home/pricing"
          label={tCommon('routes.pricing')}
          icon={<Receipt aria-hidden="true" />}
        />
      </li>
    </>
  );

  return (
    <EnviroSidebar
      brand={<EnviroSidebarBrand label={tShell('brandLabel')} />}
      groups={[
        {
          heading: tCommon('routes.platform'),
          children: platformGroup,
        },
        {
          heading: tCommon('routes.myAccount'),
          children: accountGroup,
        },
      ]}
      collapseLabel={tShell('sidebarCollapse')}
      expandLabel={tShell('sidebarExpand')}
      closeLabel={tShell('sidebarCloseMobile')}
    />
  );
}

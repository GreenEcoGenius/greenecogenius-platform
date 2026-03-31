import {
  CreditCard,
  FileBarChart,
  Home,
  Leaf,
  Link2,
  PackageSearch,
  Recycle,
  User,
  Wallet,
} from 'lucide-react';
import * as z from 'zod';

import { NavigationConfigSchema } from '@kit/ui/navigation-schema';

import featureFlagsConfig from '~/config/feature-flags.config';
import pathsConfig from '~/config/paths.config';

const iconClasses = 'w-4';

const routes = [
  {
    label: 'common.routes.application',
    children: [
      {
        label: 'common.routes.home',
        path: pathsConfig.app.home,
        Icon: <Home className={iconClasses} />,
        highlightMatch: `${pathsConfig.app.home}$`,
      },
      {
        label: 'common.routes.marketplace',
        path: '/home/marketplace',
        Icon: <Recycle className={iconClasses} />,
      },
      {
        label: 'common.routes.myListings',
        path: '/home/my-listings',
        Icon: <PackageSearch className={iconClasses} />,
      },
      {
        label: 'common.routes.wallet',
        path: '/home/wallet',
        Icon: <Wallet className={iconClasses} />,
      },
      {
        label: 'common.routes.carbon',
        path: '/home/carbon',
        Icon: <Leaf className={iconClasses} />,
      },
      {
        label: 'common.routes.esg',
        path: '/home/esg',
        Icon: <FileBarChart className={iconClasses} />,
      },
      {
        label: 'common.routes.traceability',
        path: '/home/traceability',
        Icon: <Link2 className={iconClasses} />,
      },
    ],
  },
  {
    label: 'common.routes.settings',
    children: [
      {
        label: 'common.routes.profile',
        path: pathsConfig.app.personalAccountSettings,
        Icon: <User className={iconClasses} />,
      },
      featureFlagsConfig.enablePersonalAccountBilling
        ? {
            label: 'common.routes.billing',
            path: pathsConfig.app.personalAccountBilling,
            Icon: <CreditCard className={iconClasses} />,
          }
        : undefined,
    ].filter((route) => !!route),
  },
] satisfies z.output<typeof NavigationConfigSchema>['routes'];

export const personalAccountNavigationConfig = NavigationConfigSchema.parse({
  routes,
  style: process.env.NEXT_PUBLIC_USER_NAVIGATION_STYLE,
  sidebarCollapsed: process.env.NEXT_PUBLIC_HOME_SIDEBAR_COLLAPSED,
  sidebarCollapsedStyle: process.env.NEXT_PUBLIC_SIDEBAR_COLLAPSIBLE_STYLE,
});

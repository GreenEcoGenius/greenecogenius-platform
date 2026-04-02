import Link from 'next/link';

import { ExternalLink } from 'lucide-react';

import { If } from '@kit/ui/if';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from '@kit/ui/sidebar';
import { SidebarNavigation } from '@kit/ui/sidebar-navigation';
import { Trans } from '@kit/ui/trans';

import featuresFlagConfig from '~/config/feature-flags.config';
import { personalAccountNavigationConfig } from '~/config/personal-account-navigation.config';
import { UserNotifications } from '~/home/(user)/_components/user-notifications';

// home imports
import type { UserWorkspace } from '../_lib/server/load-user-workspace';

interface HomeSidebarProps {
  workspace: UserWorkspace;
}

export function HomeSidebar(props: HomeSidebarProps) {
  const collapsible = personalAccountNavigationConfig.sidebarCollapsedStyle;

  return (
    <Sidebar variant="floating" collapsible={collapsible}>
      <SidebarHeader className="justify-center px-3 pt-4 pb-2">
        <Link
          href="/"
          className="text-metal-silver hover:bg-metal-800 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 hover:text-white"
        >
          <ExternalLink className="h-4 w-4 shrink-0" strokeWidth={1.5} />
          <span className="group-data-[collapsible=icon]:hidden">
            <Trans i18nKey="common.routes.landingPage" />
          </span>
        </Link>

        <If condition={featuresFlagConfig.enableNotifications}>
          <div className="flex justify-end px-2 group-data-[collapsible=icon]:hidden">
            <UserNotifications userId={props.workspace.user.id} />
          </div>
        </If>
      </SidebarHeader>

      <SidebarContent>
        <SidebarNavigation config={personalAccountNavigationConfig} />
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className="flex justify-end">
          <SidebarTrigger className="text-metal-steel h-8 w-8 cursor-pointer hover:text-white" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

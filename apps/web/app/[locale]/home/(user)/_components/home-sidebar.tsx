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

import { WorkspaceDropdown } from '~/components/workspace-dropdown';
import featuresFlagConfig from '~/config/feature-flags.config';
import { personalAccountNavigationConfig } from '~/config/personal-account-navigation.config';
import { UserNotifications } from '~/home/(user)/_components/user-notifications';

// home imports
import type { UserWorkspace } from '../_lib/server/load-user-workspace';

interface HomeSidebarProps {
  workspace: UserWorkspace;
}

export function HomeSidebar(props: HomeSidebarProps) {
  const { workspace, user, accounts } = props.workspace;
  const collapsible = personalAccountNavigationConfig.sidebarCollapsedStyle;

  return (
    <Sidebar variant="floating" collapsible={collapsible}>
      <SidebarHeader className={'h-16 justify-center'}>
        <div className={'flex items-center justify-between gap-x-1'}>
          <WorkspaceDropdown
            user={user}
            accounts={accounts}
            workspace={workspace}
          />

          <If condition={featuresFlagConfig.enableNotifications}>
            <div className={'group-data-[collapsible=icon]:hidden'}>
              <UserNotifications userId={user.id} />
            </div>
          </If>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarNavigation config={personalAccountNavigationConfig} />
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ExternalLink className="h-4 w-4 shrink-0" strokeWidth={1.5} />
            <span className="group-data-[collapsible=icon]:hidden">
              Accueil
            </span>
          </Link>

          <SidebarTrigger className="text-muted-foreground hover:text-foreground h-8 w-8 cursor-pointer" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

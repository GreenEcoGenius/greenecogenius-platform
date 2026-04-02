import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
} from '@kit/ui/sidebar';
import { SidebarNavigation } from '@kit/ui/sidebar-navigation';

import { personalAccountNavigationConfig } from '~/config/personal-account-navigation.config';

// home imports
import type { UserWorkspace } from '../_lib/server/load-user-workspace';

interface HomeSidebarProps {
  workspace: UserWorkspace;
}

export function HomeSidebar(props: HomeSidebarProps) {
  const collapsible = personalAccountNavigationConfig.sidebarCollapsedStyle;

  return (
    <Sidebar variant="floating" collapsible={collapsible}>
      <SidebarContent className="pt-2">
        <SidebarNavigation config={personalAccountNavigationConfig} />
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className="flex justify-end">
          <SidebarTrigger className="text-metal-steel hover:text-metal-700 h-8 w-8 cursor-pointer" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

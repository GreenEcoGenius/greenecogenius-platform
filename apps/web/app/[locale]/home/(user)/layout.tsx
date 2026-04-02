import { use } from 'react';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import * as z from 'zod';

import { UserWorkspaceContextProvider } from '@kit/accounts/components';
import { Page, PageNavigation } from '@kit/ui/page';
import { SidebarProvider } from '@kit/ui/sidebar';

import { ChatProvider } from '~/components/ai/chat-context';
import { GlobalAIAssistant } from '~/components/ai/global-ai-assistant';
import { SidebarChatBridge } from '~/components/ai/sidebar-chat-bridge';
import { AppHeader } from '~/components/layout/app-header';
import featuresFlagConfig from '~/config/feature-flags.config';
import pathsConfig from '~/config/paths.config';
import { personalAccountNavigationConfig } from '~/config/personal-account-navigation.config';

import { ChatAwareContent } from './_components/chat-aware-content';
// home imports
import { HomeMenuNavigation } from './_components/home-menu-navigation';
import { HomeSidebar } from './_components/home-sidebar';
import { loadUserWorkspace } from './_lib/server/load-user-workspace';

function UserHomeLayout({ children }: React.PropsWithChildren) {
  const state = use(getLayoutState());

  if (state.style === 'sidebar') {
    return <SidebarLayout>{children}</SidebarLayout>;
  }

  return <HeaderLayout>{children}</HeaderLayout>;
}

export default UserHomeLayout;

async function SidebarLayout({ children }: React.PropsWithChildren) {
  const [workspace, state] = await Promise.all([
    loadUserWorkspace().catch(() => null),
    getLayoutState(),
  ]);

  if (!workspace) {
    redirect('/');
  }

  await redirectIfTeamsOnly(workspace);

  return (
    <UserWorkspaceContextProvider value={workspace}>
      <ChatProvider>
        {/* Fixed header */}
        <AppHeader />

        <div className="pt-14">
          <SidebarProvider defaultOpen={state.open}>
            <SidebarChatBridge />

            <Page style={'sidebar'}>
              <PageNavigation>
                <HomeSidebar workspace={workspace} />
              </PageNavigation>

              <ChatAwareContent>{children}</ChatAwareContent>
            </Page>
          </SidebarProvider>
        </div>

        <GlobalAIAssistant />
      </ChatProvider>
    </UserWorkspaceContextProvider>
  );
}

async function HeaderLayout({ children }: React.PropsWithChildren) {
  const workspace = await loadUserWorkspace();

  await redirectIfTeamsOnly(workspace);

  return (
    <UserWorkspaceContextProvider value={workspace}>
      <ChatProvider>
        <AppHeader />

        <div className="pt-14">
          <Page style={'header'}>
            <PageNavigation>
              <HomeMenuNavigation workspace={workspace} />
            </PageNavigation>

            <ChatAwareContent>{children}</ChatAwareContent>
          </Page>
        </div>

        <GlobalAIAssistant />
      </ChatProvider>
    </UserWorkspaceContextProvider>
  );
}

async function redirectIfTeamsOnly(
  workspace: Awaited<ReturnType<typeof loadUserWorkspace>>,
) {
  if (featuresFlagConfig.enableTeamsOnly) {
    const firstTeam = workspace.accounts[0];

    if (firstTeam?.value) {
      const cookieStore = await cookies();
      const lastSelected = cookieStore.get('last-selected-team')?.value;

      const preferred = lastSelected
        ? workspace.accounts.find((a) => a.value === lastSelected)
        : undefined;

      const team = preferred ?? firstTeam;

      redirect(pathsConfig.app.accountHome.replace('[account]', team.value!));
    } else {
      redirect(pathsConfig.app.createTeam);
    }
  }
}

async function getLayoutState() {
  const cookieStore = await cookies();

  const LayoutStyleSchema = z.enum(['sidebar', 'header', 'custom']);

  const layoutStyleCookie = cookieStore.get('layout-style');
  const sidebarOpenCookie = cookieStore.get('sidebar_state');

  const sidebarOpen = sidebarOpenCookie
    ? sidebarOpenCookie.value === 'true'
    : !personalAccountNavigationConfig.sidebarCollapsed;

  const parsedStyle = LayoutStyleSchema.safeParse(layoutStyleCookie?.value);

  const style = parsedStyle.success
    ? parsedStyle.data
    : personalAccountNavigationConfig.style;

  return {
    open: sidebarOpen,
    style,
  };
}

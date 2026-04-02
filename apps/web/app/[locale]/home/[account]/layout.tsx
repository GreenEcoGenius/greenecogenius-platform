import { use } from 'react';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import * as z from 'zod';

import { TeamAccountWorkspaceContextProvider } from '@kit/team-accounts/components';
import { Page, PageMobileNavigation, PageNavigation } from '@kit/ui/page';
import { SidebarProvider } from '@kit/ui/sidebar';

import { ChatProvider } from '~/components/ai/chat-context';
import { GlobalAIAssistant } from '~/components/ai/global-ai-assistant';
import { SidebarChatBridge } from '~/components/ai/sidebar-chat-bridge';
import { AppHeader } from '~/components/layout/app-header';
import { getTeamAccountSidebarConfig } from '~/config/team-account-navigation.config';

// local imports
import { TeamAccountLayoutMobileNavigation } from './_components/team-account-layout-mobile-navigation';
import { TeamAccountLayoutSidebar } from './_components/team-account-layout-sidebar';
import { TeamAccountNavigationMenu } from './_components/team-account-navigation-menu';
import { TeamChatAwareContent } from './_components/team-chat-aware-content';
import { loadTeamWorkspace } from './_lib/server/team-account-workspace.loader';

type TeamWorkspaceLayoutProps = React.PropsWithChildren<{
  params: Promise<{ account: string }>;
}>;

function TeamWorkspaceLayout({ children, params }: TeamWorkspaceLayoutProps) {
  const account = use(params).account;
  const state = use(getLayoutState(account));

  if (state.style === 'sidebar') {
    return <SidebarLayout account={account}>{children}</SidebarLayout>;
  }

  return <HeaderLayout account={account}>{children}</HeaderLayout>;
}

async function SidebarLayout({
  account,
  children,
}: React.PropsWithChildren<{
  account: string;
}>) {
  const [data, state] = await Promise.all([
    loadTeamWorkspace(account),
    getLayoutState(account),
  ]);

  if (!data) {
    redirect('/');
  }

  const accounts = data.accounts.map(({ name, slug, picture_url }) => ({
    label: name,
    value: slug,
    image: picture_url,
  }));

  return (
    <TeamAccountWorkspaceContextProvider value={data}>
      <ChatProvider>
        <AppHeader />

        <div className="pt-14">
          <SidebarProvider defaultOpen={state.open}>
            <SidebarChatBridge />

            <Page style={'sidebar'}>
              <PageNavigation>
                <TeamAccountLayoutSidebar
                  account={account}
                  accountId={data.account.id}
                  accounts={accounts}
                  user={data.user}
                />
              </PageNavigation>

              <PageMobileNavigation
                className={'flex items-center justify-between'}
              >
                <TeamAccountLayoutMobileNavigation
                  userId={data.user.id}
                  accounts={accounts}
                  account={account}
                />

                <div className="flex-1" />

                <div id="mobile-header-right" />
              </PageMobileNavigation>

              <TeamChatAwareContent>{children}</TeamChatAwareContent>
            </Page>
          </SidebarProvider>
        </div>

        <GlobalAIAssistant />
      </ChatProvider>
    </TeamAccountWorkspaceContextProvider>
  );
}

function HeaderLayout({
  account,
  children,
}: React.PropsWithChildren<{
  account: string;
}>) {
  const data = use(loadTeamWorkspace(account));

  return (
    <TeamAccountWorkspaceContextProvider value={data}>
      <ChatProvider>
        <AppHeader />

        <div className="pt-14">
          <Page style={'header'}>
            <PageNavigation>
              <TeamAccountNavigationMenu workspace={data} />
            </PageNavigation>

            <TeamChatAwareContent>{children}</TeamChatAwareContent>
          </Page>
        </div>

        <GlobalAIAssistant />
      </ChatProvider>
    </TeamAccountWorkspaceContextProvider>
  );
}

async function getLayoutState(account: string) {
  const cookieStore = await cookies();
  const config = getTeamAccountSidebarConfig(account);

  const LayoutStyleSchema = z
    .enum(['sidebar', 'header', 'custom'])
    .default(config.style);

  const sidebarOpenCookie = cookieStore.get('sidebar_state');
  const layoutCookie = cookieStore.get('layout-style');

  const layoutStyle = LayoutStyleSchema.safeParse(layoutCookie?.value);

  const sidebarOpenCookieValue = sidebarOpenCookie
    ? sidebarOpenCookie.value === 'true'
    : !config.sidebarCollapsed;

  const style = layoutStyle.success ? layoutStyle.data : config.style;

  return {
    open: sidebarOpenCookieValue,
    style,
  };
}

export default TeamWorkspaceLayout;

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { getTranslations } from 'next-intl/server';

import { TeamAccountWorkspaceContextProvider } from '@kit/team-accounts/components';
import { SidebarProvider as KitSidebarProvider } from '@kit/ui/sidebar';

import { ChatProvider } from '~/components/ai/chat-context';
import { GlobalAIAssistant } from '~/components/ai/global-ai-assistant';
import { SidebarChatBridge } from '~/components/ai/sidebar-chat-bridge';
import {
  EnviroDashboardShell,
  EnviroDashboardTopbar,
  EnviroSidebarProvider,
  ENVIRO_SIDEBAR_COOKIE_NAME,
} from '~/components/enviro/dashboard';
import { WorkspaceDropdown } from '~/components/workspace-dropdown';
import { GlobalSearch } from '~/components/layout/global-search';
import featureFlagsConfig from '~/config/feature-flags.config';

import {
  EnviroTeamDynamicBreadcrumb,
  EnviroTeamSidebar,
  EnviroTeamTopbarActions,
} from './_components/enviro-shell';
import { TeamAccountNotifications } from './_components/team-account-notifications';
import { loadTeamWorkspace } from './_lib/server/team-account-workspace.loader';

type TeamWorkspaceLayoutProps = React.PropsWithChildren<{
  params: Promise<{ account: string }>;
}>;

/**
 * Team account workspace layout. Phase 7.4 dropped the legacy
 * SidebarLayout / HeaderLayout split (the header style was env-flag
 * gated and unused in production) and now mounts the same Enviro
 * dashboard shell as the personal workspace, scoped to the active
 * team via `EnviroTeamSidebar` and `EnviroTeamTopbarActions`.
 *
 * The cookie-persisted sidebar collapse state (`enviro_sidebar_collapsed`)
 * is shared with the user dashboard so users keep their preferred rail
 * width when switching between workspaces.
 *
 * READ-ONLY contracts preserved:
 *   - `TeamAccountWorkspaceContextProvider` (@kit/team-accounts)
 *   - `ChatProvider`, `GlobalAIAssistant`, `GlobalSearch`, `SidebarChatBridge`
 *   - `WorkspaceDropdown` (kept as the brand block, hosts personal /
 *     team switching with its existing dropdown UX)
 */
async function TeamWorkspaceLayout({
  children,
  params,
}: TeamWorkspaceLayoutProps) {
  const { account: slug } = await params;

  const [data, sidebarCollapsed] = await Promise.all([
    loadTeamWorkspace(slug),
    readSidebarCollapsed(),
  ]);

  if (!data?.account) {
    redirect('/');
  }

  const tShell = await getTranslations('common.enviroShell');

  const accounts = data.accounts.map(({ name, slug, picture_url }) => ({
    label: name,
    value: slug,
    image: picture_url,
  }));

  const workspaceName = data.account.name ?? slug;
  const userEmail = data.user.email ?? null;
  const avatarUrl = data.account.picture_url ?? null;
  const displayName = workspaceName?.trim() || userEmail || 'Workspace';
  const initials = computeInitials(displayName);

  return (
    <TeamAccountWorkspaceContextProvider value={data}>
      <ChatProvider>
        {/*
         * Phase 6 mounted `KitSidebarProvider` as a no-op context so
         * `SidebarChatBridge` and `WorkspaceDropdown` (both consume
         * `useSidebar()` from `@kit/ui/sidebar`) keep working without
         * mutation. We mirror the same pattern here.
         */}
        <KitSidebarProvider defaultOpen={false}>
          <EnviroSidebarProvider initialCollapsed={sidebarCollapsed}>
            <SidebarChatBridge />

            <EnviroDashboardShell
              sidebar={
                <EnviroTeamSidebar
                  account={slug}
                  enableTeamAccountBilling={
                    featureFlagsConfig.enableTeamAccountBilling
                  }
                  workspaceSwitcher={
                    <WorkspaceDropdown
                      user={data.user}
                      accounts={accounts}
                      selectedAccount={slug}
                    />
                  }
                />
              }
              topbar={
                <EnviroDashboardTopbar
                  mobileMenuLabel={tShell('sidebarOpenMobile')}
                  leading={
                    <EnviroTeamDynamicBreadcrumb
                      account={slug}
                      workspaceLabel={workspaceName}
                      ariaLabel={tShell('breadcrumbAriaLabel')}
                    />
                  }
                  trailing={
                    <EnviroTeamTopbarActions
                      account={slug}
                      enableTeamAccountBilling={
                        featureFlagsConfig.enableTeamAccountBilling
                      }
                      notifications={
                        featureFlagsConfig.enableNotifications ? (
                          <TeamAccountNotifications
                            userId={data.user.id}
                            accountId={data.account.id}
                          />
                        ) : null
                      }
                      userDisplayName={displayName}
                      userEmail={userEmail}
                      userInitials={initials}
                      userAvatarUrl={avatarUrl}
                    />
                  }
                />
              }
              rightDrawer={<GlobalAIAssistant />}
            >
              {children}
            </EnviroDashboardShell>
          </EnviroSidebarProvider>
        </KitSidebarProvider>

        <GlobalSearch />
      </ChatProvider>
    </TeamAccountWorkspaceContextProvider>
  );
}

export default TeamWorkspaceLayout;

/**
 * Read the persisted Enviro sidebar collapse state from the cookie set
 * by `EnviroSidebarProvider`. Defaults to OPEN (collapsed = false) on
 * first visit, matching the user dashboard convention.
 */
async function readSidebarCollapsed(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(ENVIRO_SIDEBAR_COOKIE_NAME);
  return cookie?.value === '1';
}

/**
 * Best-effort initials for the avatar fallback. Uses the first letters
 * of the first two whitespace-separated tokens, falls back to the first
 * two characters when there is a single token.
 */
function computeInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '';

  const tokens = trimmed.split(/\s+/);
  if (tokens.length >= 2 && tokens[0] && tokens[1]) {
    return (tokens[0][0]! + tokens[1][0]!).toUpperCase();
  }

  return trimmed.slice(0, 2).toUpperCase();
}

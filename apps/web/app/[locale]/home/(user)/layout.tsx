import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { getTranslations } from 'next-intl/server';

import { UserWorkspaceContextProvider } from '@kit/accounts/components';
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
import { GlobalSearch } from '~/components/layout/global-search';
import featuresFlagConfig from '~/config/feature-flags.config';
import pathsConfig from '~/config/paths.config';

import { UserNotifications } from './_components/user-notifications';
import {
  EnviroDashboardSidebar,
  EnviroDynamicBreadcrumb,
  EnviroTopbarActions,
} from './_components/enviro-shell';
import { loadUserWorkspace } from './_lib/server/load-user-workspace';

async function UserHomeLayout({ children }: React.PropsWithChildren) {
  const [workspace, sidebarCollapsed] = await Promise.all([
    loadUserWorkspace().catch(() => null),
    readSidebarCollapsed(),
  ]);

  if (!workspace) {
    redirect('/');
  }

  await redirectIfTeamsOnly(workspace);

  const tShell = await getTranslations('common.enviroShell');

  // Derive the surface bits the user menu needs without leaking the
  // workspace shape into a client component.
  const userId = workspace.user.id;
  const userEmail = workspace.user.email ?? null;
  const accountName = workspace.workspace?.name ?? null;
  const avatarUrl = workspace.workspace?.picture_url ?? null;
  const displayName = accountName?.trim() || userEmail || 'User';
  const initials = computeInitials(displayName);

  return (
    <UserWorkspaceContextProvider value={workspace}>
      <ChatProvider>
        {/*
         * The legacy `SidebarChatBridge` (apps/web/components/ai/*, READ-ONLY)
         * still depends on `useSidebar()` from `@kit/ui/sidebar`. We keep the
         * kit `SidebarProvider` mounted as a no-op context so the bridge
         * keeps working unchanged. The visible sidebar is owned by
         * `EnviroSidebarProvider` below.
         */}
        <KitSidebarProvider defaultOpen={false}>
          <EnviroSidebarProvider initialCollapsed={sidebarCollapsed}>
            <SidebarChatBridge />

            <EnviroDashboardShell
              sidebar={<EnviroDashboardSidebar />}
              topbar={
                <EnviroDashboardTopbar
                  mobileMenuLabel={tShell('sidebarOpenMobile')}
                  leading={
                    <EnviroDynamicBreadcrumb
                      ariaLabel={tShell('breadcrumbAriaLabel')}
                    />
                  }
                  trailing={
                    <EnviroTopbarActions
                      notifications={<UserNotifications userId={userId} />}
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
    </UserWorkspaceContextProvider>
  );
}

export default UserHomeLayout;

async function redirectIfTeamsOnly(
  workspace: Awaited<ReturnType<typeof loadUserWorkspace>>,
) {
  if (!workspace) return;

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

/**
 * Read the persisted Enviro sidebar collapse state from the cookie set by
 * `EnviroSidebarProvider`. Defaults to OPEN (collapsed = false) on first
 * login per the Phase 6 audit decision.
 */
async function readSidebarCollapsed(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(ENVIRO_SIDEBAR_COOKIE_NAME);
  return cookie?.value === '1';
}

/**
 * Best-effort initials for the avatar fallback. Uses the first letters of
 * the first two whitespace-separated tokens, falls back to the first two
 * characters when there is a single token (typical for an email like
 * "camille@example.com" -> "CA").
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

'use client';

import type { ReactNode } from 'react';

import { CreditCard, Search, Settings, Sparkles, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useSignOut } from '@kit/supabase/hooks/use-sign-out';
import { cn } from '@kit/ui/utils';

import { useChat } from '~/components/ai/chat-context';
import { EnviroUserMenu } from '~/components/enviro/dashboard';
import { useGlobalSearch } from '~/components/layout/global-search';

interface EnviroTeamTopbarActionsProps {
  /** Account slug, used to compose links to settings / members / billing. */
  account: string;
  /** Optional notifications slot (typically `<TeamAccountNotifications ... />`). */
  notifications?: ReactNode;
  /** Already-translated user display name. */
  userDisplayName: string;
  /** User email (rendered as the secondary line in the user menu). */
  userEmail?: string | null;
  /** Initials fallback when no avatar URL is available. */
  userInitials?: string;
  /** Optional avatar URL. */
  userAvatarUrl?: string | null;
  /** Whether team account billing routes appear in the user menu. */
  enableTeamAccountBilling: boolean;
}

/**
 * Team-account variant of the dashboard topbar actions cluster. Mirrors
 * `(user)/_components/enviro-shell/enviro-topbar-actions.tsx` but routes
 * the user-menu shortcuts through `/home/[account]/...` so they land on
 * the team-scoped settings / members / billing pages.
 *
 * Reuses the same hooks (`useChat`, `useGlobalSearch`, `useSignOut`) so
 * the underlying behavior matches the user dashboard exactly.
 */
export function EnviroTeamTopbarActions({
  account,
  notifications,
  userDisplayName,
  userEmail,
  userInitials,
  userAvatarUrl,
  enableTeamAccountBilling,
}: EnviroTeamTopbarActionsProps) {
  const t = useTranslations('common');
  const { chatOpen, toggleChat } = useChat();
  const { openSearch } = useGlobalSearch();
  const signOut = useSignOut();

  const accountPath = (suffix: string) => `/home/${account}/${suffix}`;

  const handleSignOut = () => {
    signOut.mutate(undefined, {
      onSuccess: () => {
        if (typeof window !== 'undefined') {
          window.location.assign('/');
        }
      },
    });
  };

  const items = [
    {
      label: t('enviroShell.userMenuProfile'),
      href: accountPath('settings'),
      icon: <Settings aria-hidden="true" className="h-4 w-4" />,
    },
    {
      label: t('routes.members'),
      href: accountPath('members'),
      icon: <Users aria-hidden="true" className="h-4 w-4" />,
    },
  ];

  if (enableTeamAccountBilling) {
    items.push({
      label: t('enviroShell.userMenuBilling'),
      href: accountPath('billing'),
      icon: <CreditCard aria-hidden="true" className="h-4 w-4" />,
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={openSearch}
        aria-label={t('search.ariaLabel')}
        className="inline-flex h-9 items-center gap-2 rounded-[--radius-enviro-pill] border border-[--color-enviro-cream-300] bg-[--color-enviro-bg-elevated] pr-2 pl-3 text-xs font-medium text-[--color-enviro-forest-700] transition-colors hover:border-[--color-enviro-lime-400] hover:text-[--color-enviro-forest-900] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-lime-300]/60 md:pr-3"
      >
        <Search aria-hidden="true" className="h-4 w-4" />
        <span className="hidden md:inline">{t('search.placeholder')}</span>
        <kbd className="ml-2 hidden rounded-[--radius-enviro-xs] bg-[--color-enviro-cream-100] px-1.5 py-0.5 text-[10px] font-semibold text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)] md:inline">
          ⌘K
        </kbd>
      </button>

      {notifications ? (
        <div className="inline-flex h-9 items-center justify-center">
          {notifications}
        </div>
      ) : null}

      <button
        type="button"
        onClick={toggleChat}
        aria-label={t('enviroShell.geniusAriaLabel')}
        aria-pressed={chatOpen}
        className={cn(
          'inline-flex h-9 items-center gap-1.5 rounded-[--radius-enviro-pill] px-3 text-xs font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-lime-300]/60',
          chatOpen
            ? 'bg-[--color-enviro-lime-300] text-[--color-enviro-forest-900] hover:bg-[--color-enviro-lime-400]'
            : 'bg-[--color-enviro-forest-900] text-[--color-enviro-lime-300] hover:bg-[--color-enviro-forest-700]',
        )}
      >
        <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
        <span>{t('enviroShell.geniusButton')}</span>
      </button>

      <EnviroUserMenu
        displayName={userDisplayName}
        email={userEmail ?? undefined}
        avatarSrc={userAvatarUrl ?? undefined}
        initials={userInitials}
        items={items}
        languageLabel={t('enviroShell.userMenuLanguage')}
        signOutLabel={t('enviroShell.userMenuSignOut')}
        onSignOut={handleSignOut}
        ariaLabel={t('enviroShell.userMenuAriaLabel')}
      />
    </div>
  );
}

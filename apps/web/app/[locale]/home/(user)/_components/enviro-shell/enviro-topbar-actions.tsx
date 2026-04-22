'use client';

import type { ReactNode } from 'react';

import { CreditCard, Search, Sparkles, User } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useSignOut } from '@kit/supabase/hooks/use-sign-out';
import { cn } from '@kit/ui/utils';

import { useChat } from '~/components/ai/chat-context';
import { EnviroUserMenu } from '~/components/enviro/dashboard';
import { useGlobalSearch } from '~/components/layout/global-search';

interface EnviroTopbarActionsProps {
  /**
   * Optional notifications slot (typically `<UserNotifications userId={...} />`).
   * Wrapped here so the bell sits between the Genius button and the user
   * menu without leaking layout decisions to the legacy component.
   */
  notifications?: ReactNode;
  /** Already-translated user display name. */
  userDisplayName: string;
  /** User email (rendered as the secondary line in the user menu). */
  userEmail?: string | null;
  /** Initials fallback when no avatar URL is available. */
  userInitials?: string;
  /** Optional avatar URL. */
  userAvatarUrl?: string | null;
}

/**
 * Trailing slot of the dashboard topbar. Reuses the historical hooks so
 * Phase 6.1.1 changes nothing about the underlying behaviour:
 *   - `useChat()` (apps/web/components/ai/chat-context) for the Genius
 *     toggle, with its persisted open/closed state.
 *   - `useGlobalSearch()` (apps/web/components/layout/global-search) for
 *     the Cmd+K palette.
 *   - `useSignOut()` (@kit/supabase) for the sign-out mutation, identical
 *     to the legacy account dropdown.
 *
 * The visual surface (cream search pill, forest Genius button, user menu
 * with locale switcher) is brand-new but no business logic moved.
 */
export function EnviroTopbarActions({
  notifications,
  userDisplayName,
  userEmail,
  userInitials,
  userAvatarUrl,
}: EnviroTopbarActionsProps) {
  const t = useTranslations('common');
  const { chatOpen, toggleChat } = useChat();
  const { openSearch } = useGlobalSearch();
  const signOut = useSignOut();

  const handleSignOut = () => {
    signOut.mutate(undefined, {
      onSuccess: () => {
        if (typeof window !== 'undefined') {
          window.location.assign('/');
        }
      },
    });
  };

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
        items={[
          {
            label: t('enviroShell.userMenuProfile'),
            href: '/home/settings',
            icon: <User aria-hidden="true" className="h-4 w-4" />,
          },
          {
            label: t('enviroShell.userMenuBilling'),
            href: '/home/billing',
            icon: <CreditCard aria-hidden="true" className="h-4 w-4" />,
          },
        ]}
        languageLabel={t('enviroShell.userMenuLanguage')}
        signOutLabel={t('enviroShell.userMenuSignOut')}
        onSignOut={handleSignOut}
        ariaLabel={t('enviroShell.userMenuAriaLabel')}
      />
    </div>
  );
}

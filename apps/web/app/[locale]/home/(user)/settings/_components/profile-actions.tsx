'use client';

import { LogOut, Monitor, Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import { useSignOut } from '@kit/supabase/hooks/use-sign-out';
import { If } from '@kit/ui/if';
import { cn } from '@kit/ui/utils';

import {
  EnviroCard,
  EnviroCardBody,
  EnviroCardHeader,
  EnviroCardTitle,
} from '~/components/enviro/enviro-card';
import { EnviroButton } from '~/components/enviro/enviro-button';

export function ProfileActions({
  enableThemeToggle,
}: {
  enableThemeToggle: boolean;
}) {
  const t = useTranslations('account');
  const signOut = useSignOut();
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    {
      value: 'light' as const,
      label: t('themeLight'),
      icon: <Sun aria-hidden="true" className="h-4 w-4" />,
    },
    {
      value: 'dark' as const,
      label: t('themeDark'),
      icon: <Moon aria-hidden="true" className="h-4 w-4" />,
    },
    {
      value: 'system' as const,
      label: t('themeAuto'),
      icon: <Monitor aria-hidden="true" className="h-4 w-4" />,
    },
  ];

  return (
    <EnviroCard variant="cream" hover="none" padding="md">
      <EnviroCardHeader>
        <EnviroCardTitle className="text-lg">
          {t('preferences')}
        </EnviroCardTitle>
      </EnviroCardHeader>

      <EnviroCardBody className="flex flex-col gap-6 pt-6">
        <If condition={enableThemeToggle}>
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-[--color-enviro-forest-900]">
              {t('theme')}
            </p>

            <div
              role="radiogroup"
              aria-label={t('theme')}
              className="grid grid-cols-3 gap-2"
            >
              {themeOptions.map((opt) => {
                const active = theme === opt.value;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setTheme(opt.value)}
                    className={cn(
                      'inline-flex items-center justify-center gap-2 rounded-[--radius-enviro-md] border px-3 py-2.5 text-xs font-medium transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-lime-300]/60',
                      active
                        ? 'border-[--color-enviro-forest-900] bg-[--color-enviro-forest-900] text-[--color-enviro-lime-300]'
                        : 'border-[--color-enviro-cream-300] bg-[--color-enviro-bg-elevated] text-[--color-enviro-forest-700] hover:border-[--color-enviro-lime-400] hover:text-[--color-enviro-forest-900]',
                    )}
                  >
                    {opt.icon}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </If>

        <div className="border-t border-[--color-enviro-cream-200] pt-5">
          <EnviroButton
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => signOut.mutateAsync()}
            disabled={signOut.isPending}
          >
            <LogOut aria-hidden="true" className="h-4 w-4" />
            {signOut.isPending ? t('signingOut') : t('signOut')}
          </EnviroButton>
        </div>
      </EnviroCardBody>
    </EnviroCard>
  );
}

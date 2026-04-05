'use client';

import { LogOut, Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import { useSignOut } from '@kit/supabase/hooks/use-sign-out';
import { Button } from '@kit/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { If } from '@kit/ui/if';

export function ProfileActions({
  enableThemeToggle,
}: {
  enableThemeToggle: boolean;
}) {
  const t = useTranslations('account');
  const signOut = useSignOut();
  const { theme, setTheme } = useTheme();

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-base">{t('preferences')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme */}
        <If condition={enableThemeToggle}>
          <div>
            <div className="mb-3 flex items-center gap-2">
              {theme === 'dark' ? (
                <Moon className="h-4 w-4 text-slate-500" strokeWidth={1.5} />
              ) : (
                <Sun className="h-4 w-4 text-teal-500" strokeWidth={1.5} />
              )}
              <p className="text-sm font-medium">{t('theme')}</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`rounded-lg border-2 px-3 py-2.5 text-xs font-medium transition-all ${
                  theme === 'light'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'bg-muted text-muted-foreground border-transparent hover:border-gray-300'
                }`}
              >
                {t('themeLight')}
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`rounded-lg border-2 px-3 py-2.5 text-xs font-medium transition-all ${
                  theme === 'dark'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'bg-muted text-muted-foreground border-transparent hover:border-gray-300'
                }`}
              >
                {t('themeDark')}
              </button>
              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`rounded-lg border-2 px-3 py-2.5 text-xs font-medium transition-all ${
                  theme === 'system'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'bg-muted text-muted-foreground border-transparent hover:border-gray-300'
                }`}
              >
                {t('themeAuto')}
              </button>
            </div>
          </div>
        </If>

        {/* Sign out */}
        <div className="border-t pt-4">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => signOut.mutateAsync()}
            disabled={signOut.isPending}
          >
            <LogOut className="mr-2 h-4 w-4" strokeWidth={1.5} />
            {signOut.isPending ? t('signingOut') : t('signOut')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

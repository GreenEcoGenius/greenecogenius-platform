'use client';

import { LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { useSignOut } from '@kit/supabase/hooks/use-sign-out';
import { Button } from '@kit/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { If } from '@kit/ui/if';
import { Trans } from '@kit/ui/trans';

export function ProfileActions({
  enableThemeToggle,
}: {
  enableThemeToggle: boolean;
}) {
  const signOut = useSignOut();
  const { theme, setTheme } = useTheme();

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-base">Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <If condition={enableThemeToggle}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon className="h-4 w-4 text-slate-500" strokeWidth={1.5} />
              ) : (
                <Sun className="h-4 w-4 text-teal-500" strokeWidth={1.5} />
              )}
              <div>
                <p className="text-sm font-medium">
                  <Trans i18nKey="common.theme" defaults="Theme" />
                </p>
                <p className="text-muted-foreground text-xs">
                  {theme === 'dark'
                    ? 'Mode sombre'
                    : theme === 'light'
                      ? 'Mode clair'
                      : 'Systeme'}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  theme === 'light'
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground hover:bg-gray-200'
                }`}
              >
                Clair
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground hover:bg-gray-200'
                }`}
              >
                Sombre
              </button>
              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  theme === 'system'
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground hover:bg-gray-200'
                }`}
              >
                Auto
              </button>
            </div>
          </div>
        </If>

        <div className="border-t pt-4">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => signOut.mutateAsync()}
            disabled={signOut.isPending}
          >
            <LogOut className="mr-2 h-4 w-4" strokeWidth={1.5} />
            {signOut.isPending ? 'Deconnexion...' : 'Se deconnecter'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import { Globe, LogOut, Moon, Sun } from 'lucide-react';
import { useLocale } from 'next-intl';
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
  const signOut = useSignOut();
  const { theme, setTheme } = useTheme();
  const locale = useLocale();

  const switchLocale = (next: string) => {
    if (next === locale) return;

    // Direct URL navigation to ensure full locale switch
    const currentPath = window.location.pathname;

    if (next === 'fr') {
      // Add /fr prefix
      if (!currentPath.startsWith('/fr')) {
        window.location.href = `/fr${currentPath}`;
      }
    } else {
      // Remove /fr prefix (en is default, no prefix)
      if (currentPath.startsWith('/fr')) {
        window.location.href = currentPath.replace(/^\/fr/, '') || '/';
      }
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-base">Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Language */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Globe className="h-4 w-4 text-teal-500" strokeWidth={1.5} />
            <p className="text-sm font-medium">Langue / Language</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => switchLocale('fr')}
              className={`flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                locale === 'fr'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'bg-muted text-muted-foreground border-transparent hover:border-gray-300'
              }`}
            >
              <span className="text-lg">🇫🇷</span>
              Francais
            </button>
            <button
              type="button"
              onClick={() => switchLocale('en')}
              className={`flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                locale === 'en'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'bg-muted text-muted-foreground border-transparent hover:border-gray-300'
              }`}
            >
              <span className="text-lg">🇬🇧</span>
              English
            </button>
          </div>
        </div>

        {/* Theme */}
        <If condition={enableThemeToggle}>
          <div>
            <div className="mb-3 flex items-center gap-2">
              {theme === 'dark' ? (
                <Moon className="h-4 w-4 text-slate-500" strokeWidth={1.5} />
              ) : (
                <Sun className="h-4 w-4 text-teal-500" strokeWidth={1.5} />
              )}
              <p className="text-sm font-medium">Theme</p>
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
                Clair
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
                Sombre
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
                Auto
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
            {signOut.isPending ? 'Deconnexion...' : 'Se deconnecter'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

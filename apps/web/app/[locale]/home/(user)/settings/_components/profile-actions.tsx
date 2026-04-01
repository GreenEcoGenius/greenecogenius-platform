'use client';

import { Globe, LogOut, Moon, Sun } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useTheme } from 'next-themes';

import { usePathname, useRouter } from '@kit/i18n/navigation';
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
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (next: string) => {
    router.replace(pathname, { locale: next });
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-base">Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Language */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="h-4 w-4 text-teal-500" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-medium">Langue / Language</p>
              <p className="text-muted-foreground text-xs">
                {locale === 'fr' ? 'Francais' : 'English'}
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => switchLocale('fr')}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                locale === 'fr'
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground hover:bg-gray-200'
              }`}
            >
              FR
            </button>
            <button
              type="button"
              onClick={() => switchLocale('en')}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                locale === 'en'
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground hover:bg-gray-200'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Theme */}
        <If condition={enableThemeToggle}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon className="h-4 w-4 text-slate-500" strokeWidth={1.5} />
              ) : (
                <Sun className="h-4 w-4 text-teal-500" strokeWidth={1.5} />
              )}
              <div>
                <p className="text-sm font-medium">Theme</p>
                <p className="text-muted-foreground text-xs">
                  {theme === 'dark'
                    ? 'Sombre'
                    : theme === 'light'
                      ? 'Clair'
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

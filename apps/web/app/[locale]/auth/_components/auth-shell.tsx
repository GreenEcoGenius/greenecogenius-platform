import { getTranslations } from 'next-intl/server';

import {
  EnviroAuthHero,
  EnviroAuthLayout,
  makeBrandBullets,
} from '~/components/enviro/auth';

/**
 * Server helper that assembles the hero with translated bullets and wraps
 * the page content in the split-screen Enviro layout. Pages call this
 * instead of reaching for `EnviroAuthLayout` + `EnviroAuthHero` directly so
 * the hero copy stays consistent across sign-in / sign-up / password-reset
 * / verify / callback-error.
 */
export async function AuthShell({ children }: React.PropsWithChildren) {
  const t = await getTranslations('auth');

  return (
    <EnviroAuthLayout
      hero={
        <EnviroAuthHero
          brand={t('layoutBrand')}
          tag={t('layoutHeroTag')}
          title={t('layoutHeroTitle')}
          subtitle={t('layoutHeroSubtitle')}
          bullets={makeBrandBullets({
            recycle: t('layoutHeroBullet1'),
            shield: t('layoutHeroBullet2'),
            sparkles: t('layoutHeroBullet3'),
          })}
        />
      }
    >
      {children}
    </EnviroAuthLayout>
  );
}

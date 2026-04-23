import { getTranslations } from 'next-intl/server';

import { EnviroAuthLoading } from '~/components/enviro/auth';

export default async function AuthLoading() {
  const t = await getTranslations('auth');
  return <EnviroAuthLoading label={t('loadingLabel')} />;
}

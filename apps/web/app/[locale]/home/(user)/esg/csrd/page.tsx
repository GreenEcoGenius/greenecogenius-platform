import { getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { AICSRDChecklist } from '~/components/ai/esg/ai-csrd-checklist';
import { EnviroDashboardSectionHeader } from '~/components/enviro/dashboard';

export const generateMetadata = async () => {
  const t = await getTranslations('esg');

  return { title: `${t('title')} - CSRD` };
};

export default async function CSRDPage() {
  const client = getSupabaseServerClient();
  const user = await requireUser(client);
  const t = await getTranslations('esg');
  const tCommon = await getTranslations('common');

  if (!user.data?.id) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
      <EnviroDashboardSectionHeader
        tag={tCommon('routes.esg')}
        title={t('csrdTitle')}
      />

      <AICSRDChecklist />
    </div>
  );
}

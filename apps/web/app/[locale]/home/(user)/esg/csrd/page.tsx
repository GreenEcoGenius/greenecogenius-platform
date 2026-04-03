import { getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { PageBody } from '@kit/ui/page';

import { AICSRDChecklist } from '~/components/ai/esg/ai-csrd-checklist';

export const generateMetadata = async () => {
  const t = await getTranslations('esg');

  return { title: `${t('title')} - CSRD` };
};

export default async function CSRDPage() {
  const client = getSupabaseServerClient();
  const user = await requireUser(client);

  if (!user.data?.id) {
    return null;
  }

  return (
    <PageBody>
      <AICSRDChecklist />
    </PageBody>
  );
}

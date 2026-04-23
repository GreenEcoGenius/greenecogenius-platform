import { getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { EnviroDashboardSectionHeader } from '~/components/enviro/dashboard';
import { CreateListingForm } from '~/home/[account]/marketplace/new/_components/create-listing-form';

export const generateMetadata = async () => {
  const t = await getTranslations('marketplace');

  return { title: t('createListing') };
};

async function NewListingPage() {
  const client = getSupabaseServerClient();
  const t = await getTranslations('marketplace');
  const tCommon = await getTranslations('common');

  const user = await requireUser(client);
  const userId = user.data?.id;

  if (!userId) {
    return null;
  }

  const { data: categories } = await client
    .from('material_categories')
    .select('*')
    .order('name_fr');

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
      <EnviroDashboardSectionHeader
        tag={tCommon('routes.marketplace')}
        title={t('createListing')}
      />

      <CreateListingForm
        account=""
        accountId={userId}
        categories={categories ?? []}
      />
    </div>
  );
}

export default NewListingPage;

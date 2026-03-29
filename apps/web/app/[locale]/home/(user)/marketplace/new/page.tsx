import { getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { HomeLayoutPageHeader } from '../../_components/home-page-header';
import { CreateListingForm } from './../../../[account]/marketplace/new/_components/create-listing-form';

export const generateMetadata = async () => {
  const t = await getTranslations('marketplace');

  return { title: t('createListing') };
};

async function NewListingPage() {
  const client = getSupabaseServerClient();
  const user = await requireUser(client);

  const { data: categories } = await client
    .from('material_categories')
    .select('*')
    .order('name_fr');

  const accountSlug = user.data?.id ?? '';

  return (
    <PageBody>
      <HomeLayoutPageHeader
        title={<Trans i18nKey={'marketplace.createListing'} />}
        description=""
      />

      <div className="mx-auto max-w-2xl">
        <CreateListingForm
          account={accountSlug}
          categories={categories ?? []}
        />
      </div>
    </PageBody>
  );
}

export default NewListingPage;

import { getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Heading } from '@kit/ui/heading';
import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { CreateListingForm } from '~/home/[account]/marketplace/new/_components/create-listing-form';

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

  return (
    <PageBody>
      <PageHeader description="">
        <Heading level={3}>
          <Trans i18nKey={'marketplace.createListing'} />
        </Heading>
      </PageHeader>

      <div className="mx-auto max-w-2xl">
        <CreateListingForm
          account=""
          categories={categories ?? []}
        />
      </div>
    </PageBody>
  );
}

export default NewListingPage;

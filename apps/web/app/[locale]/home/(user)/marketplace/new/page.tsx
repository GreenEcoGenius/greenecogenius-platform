import { getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { PageBody } from '@kit/ui/page';

import { CreateListingForm } from '~/home/[account]/marketplace/new/_components/create-listing-form';

export const generateMetadata = async () => {
  const t = await getTranslations('marketplace');

  return { title: t('createListing') };
};

async function NewListingPage() {
  const client = getSupabaseServerClient();
  await requireUser(client);

  const userId = user.data?.id;

  if (!userId) {
    return null;
  }

  const { data: categories } = await client
    .from('material_categories')
    .select('*')
    .order('name_fr');

  return (
    <PageBody>
      <div className="mx-auto max-w-2xl">
        <CreateListingForm
          account=""
          accountId={userId}
          categories={categories ?? []}
        />
      </div>
    </PageBody>
  );
}

export default NewListingPage;

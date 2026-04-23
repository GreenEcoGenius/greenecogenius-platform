import { use } from 'react';

import { getTranslations } from 'next-intl/server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { EnviroDashboardSectionHeader } from '~/components/enviro/dashboard';

import { CreateListingForm } from './_components/create-listing-form';

interface NewListingPageProps {
  params: Promise<{ account: string }>;
}

export const generateMetadata = async () => {
  const t = await getTranslations('marketplace');

  return { title: t('createListing') };
};

async function NewListingPage({ params }: NewListingPageProps) {
  const account = use(params).account;
  const client = getSupabaseServerClient();
  const t = await getTranslations('marketplace');
  const tCommon = await getTranslations('common');

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

      <CreateListingForm account={account} categories={categories ?? []} />
    </div>
  );
}

export default NewListingPage;

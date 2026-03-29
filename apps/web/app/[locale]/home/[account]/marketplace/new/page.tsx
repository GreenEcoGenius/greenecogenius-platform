import { use } from 'react';

import { getTranslations } from 'next-intl/server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { TeamAccountLayoutPageHeader } from '../../_components/team-account-layout-page-header';
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

  const { data: categories } = await client
    .from('material_categories')
    .select('*')
    .order('name_fr');

  return (
    <PageBody>
      <TeamAccountLayoutPageHeader
        account={account}
        title={<Trans i18nKey={'marketplace.createListing'} />}
        description={<AppBreadcrumbs />}
      />

      <div className="mx-auto max-w-2xl">
        <CreateListingForm
          account={account}
          categories={categories ?? []}
        />
      </div>
    </PageBody>
  );
}

export default NewListingPage;

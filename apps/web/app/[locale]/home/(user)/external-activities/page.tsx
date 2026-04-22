import { getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { EnviroDashboardSectionHeader } from '~/components/enviro/dashboard';
import { ExternalActivitiesService } from '~/lib/services/external-activities-service';

import {
  ExternalActivitiesPanel,
  type ExternalActivityRow,
} from './_components/external-activities-panel';

export async function generateMetadata() {
  const t = await getTranslations('externalActivities');
  return { title: t('title') };
}

async function ExternalActivitiesPage() {
  const t = await getTranslations('externalActivities');
  const tDashboard = await getTranslations('dashboard');

  const client = getSupabaseServerClient();
  const { data: user, error } = await requireUser(client);
  if (error || !user) return null;

  const all = await ExternalActivitiesService.listForAccount(client, user.id);

  // Generate short-lived signed URLs for any uploaded documents so the
  // panel can render a working download link. External URLs go through as-is.
  const signedUrlEntries = await Promise.all(
    all
      .filter((r) => r.document_path)
      .map(async (r) => {
        const signed = await ExternalActivitiesService.getSignedDocumentUrl(
          client,
          r.document_path,
        );
        return signed ? ([r.id, signed] as const) : null;
      }),
  );

  const signedUrls = Object.fromEntries(
    signedUrlEntries.filter((e): e is readonly [string, string] => e !== null),
  );

  // Project the wide service rows down to the stable shape the client
  // panel expects so the panel does not need to know about the service.
  const rows: ExternalActivityRow[] = all.map((r) => ({
    id: r.id,
    category: r.category,
    subcategory: r.subcategory,
    title: r.title,
    description: r.description,
    quantitative_value: r.quantitative_value,
    quantitative_unit: r.quantitative_unit,
    document_path: r.document_path,
    document_url: r.document_url,
    verified: r.verified,
  }));

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
      <EnviroDashboardSectionHeader
        tag={t('title')}
        title={tDashboard('externalTitle')}
        subtitle={tDashboard('externalDesc')}
      />

      <ExternalActivitiesPanel rows={rows} signedUrls={signedUrls} />
    </div>
  );
}

export default ExternalActivitiesPage;

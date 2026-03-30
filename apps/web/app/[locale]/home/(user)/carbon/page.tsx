import { getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Heading } from '@kit/ui/heading';
import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { CarbonByMaterial } from './_components/carbon-by-material';
import { CarbonEquivalences } from './_components/carbon-equivalences';
import { CarbonOverview } from './_components/carbon-overview';
import { CertificatesList } from './_components/certificates-list';

export const generateMetadata = async () => {
  const t = await getTranslations('carbon');

  return { title: t('title') };
};

async function CarbonPage() {
  const client = getSupabaseServerClient();
  const user = await requireUser(client);
  const userId = user.data?.id;

  if (!userId) {
    return null;
  }

  // Fetch carbon records
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: carbonRecords } = await (client as any)
    .from('carbon_records')
    .select('*')
    .eq('account_id', userId);

  // Fetch traceability certificates
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: certificates } = await (client as any)
    .from('traceability_certificates')
    .select('*')
    .eq('account_id', userId)
    .order('issued_at', { ascending: false });

  const records = carbonRecords ?? [];
  const certs = certificates ?? [];

  // Aggregate totals
  const totalAvoided = records.reduce(
    (sum: number, r: Record<string, number>) => sum + (r.co2_avoided ?? 0),
    0,
  );
  const totalTransport = records.reduce(
    (sum: number, r: Record<string, number>) => sum + (r.co2_transport ?? 0),
    0,
  );
  const totalNet = records.reduce(
    (sum: number, r: Record<string, number>) => sum + (r.co2_net ?? 0),
    0,
  );
  const totalWeight = records.reduce(
    (sum: number, r: Record<string, number>) => sum + (r.weight_kg ?? 0),
    0,
  );

  // Aggregate by material category
  const materialMap = new Map<
    string,
    { weight: number; avoided: number; transport: number; net: number }
  >();

  for (const r of records) {
    const cat = (r as Record<string, string>).material_category ?? 'Autre';
    const existing = materialMap.get(cat) ?? {
      weight: 0,
      avoided: 0,
      transport: 0,
      net: 0,
    };

    materialMap.set(cat, {
      weight: existing.weight + ((r as Record<string, number>).weight_kg ?? 0),
      avoided:
        existing.avoided + ((r as Record<string, number>).co2_avoided ?? 0),
      transport:
        existing.transport + ((r as Record<string, number>).co2_transport ?? 0),
      net: existing.net + ((r as Record<string, number>).co2_net ?? 0),
    });
  }

  const materials = Array.from(materialMap.entries()).map(([category, data]) => ({
    category,
    ...data,
  }));

  const hasCarbonData = records.length > 0;

  return (
    <PageBody>
      <PageHeader description="">
        <Heading level={3}>
          <Trans i18nKey="carbon:title" />
        </Heading>
      </PageHeader>

      {hasCarbonData ? (
        <div className="space-y-8">
          <CarbonOverview
            totalAvoided={totalAvoided}
            totalTransport={totalTransport}
            totalNet={totalNet}
            totalWeight={totalWeight}
          />

          <CarbonEquivalences co2Avoided={totalAvoided} />

          <CarbonByMaterial materials={materials} />

          <CertificatesList certificates={certs} />
        </div>
      ) : (
        <div className="text-muted-foreground py-12 text-center">
          <Trans i18nKey="carbon:noCarbonData" />
        </div>
      )}
    </PageBody>
  );
}

export default CarbonPage;

import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { generateCarbonReportPDF } from '~/lib/services/pdf/templates/carbon-report-template';

export async function GET() {
  const client = getSupabaseServerClient();
  const { data: user, error: authError } = await requireUser(client);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Use standard client — RLS ensures user can only access their own data
  const { data: account } = await client
    .from('accounts')
    .select('name')
    .eq('id', user.id)
    .single();

  const { data: records } = await client
    .from('carbon_records')
    .select('material_category, weight_kg, co2_avoided, co2_transport, co2_net')
    .eq('account_id', user.id);

  const locale = (await cookies()).get('NEXT_LOCALE')?.value ?? 'en';
  const isFr = locale === 'fr';
  const companyName = account?.name ?? (isFr ? 'Mon entreprise' : 'My company');

  const allRecords = (records ?? []) as Record<string, unknown>[];
  const co2Avoided = allRecords.reduce((s: number, r) => s + Number((r.co2_avoided as number) ?? 0), 0);
  const co2Transport = allRecords.reduce((s: number, r) => s + Number((r.co2_transport as number) ?? 0), 0);
  const totalWeightKg = allRecords.reduce((s: number, r) => s + Number((r.weight_kg as number) ?? 0), 0);

  const generatedAt = new Date().toLocaleDateString(isFr ? 'fr-FR' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const pdfBuffer = generateCarbonReportPDF(
    {
      companyName,
      date: generatedAt,
      scope1Total: 0,
      scope2Total: 0,
      scope3Total: 0,
      totalEmissions: 0,
      co2Avoided: co2Avoided / 1000,
      totalWeightTonnes: totalWeightKg / 1000,
      records: allRecords.map((r) => ({
        category: r.material_category ?? '',
        weight_kg: Number(r.weight_kg ?? 0),
        co2_avoided: Number(r.co2_avoided ?? 0),
        co2_transport: Number(r.co2_transport ?? 0),
        co2_net: Number(r.co2_net ?? 0),
      })),
    },
    locale,
  );

  const safeCompanyName = companyName.replace(/[^a-zA-Z0-9]/g, '_');

  return new Response(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${isFr ? 'BilanCarbone' : 'CarbonReport'}-${safeCompanyName}-${new Date().toISOString().split('T')[0]}.pdf"`,
    },
  });
}

import { NextResponse } from 'next/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

interface CsrdIndicator {
  code: string;
  name: string;
  status: 'covered' | 'partial' | 'not_covered';
  source: string;
}

export async function GET() {
  const client = getSupabaseServerClient();
  const { data: user, error: authError } = await requireUser(client);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const adminClient = getSupabaseServerAdminClient();

  // Fetch latest org_esg_data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: esgRows, error: esgError } = await (adminClient as any)
    .from('org_esg_data')
    .select('*')
    .eq('account_id', user.id)
    .order('reporting_year', { ascending: false })
    .limit(1);

  if (esgError) {
    return NextResponse.json(
      { error: 'Failed to fetch ESG data' },
      { status: 500 },
    );
  }

  // Fetch latest esg_reports
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: reports, error: reportError } = await (adminClient as any)
    .from('esg_reports')
    .select('*')
    .eq('account_id', user.id)
    .order('report_year', { ascending: false })
    .limit(1);

  if (reportError) {
    return NextResponse.json(
      { error: 'Failed to fetch ESG reports' },
      { status: 500 },
    );
  }

  const esg = esgRows?.[0] ?? null;
  const report = reports?.[0] ?? null;

  const hasEnergyData =
    esg &&
    ((esg.electricity_kwh ?? 0) > 0 ||
      (esg.natural_gas_kwh ?? 0) > 0 ||
      (esg.heating_kwh ?? 0) > 0);

  const hasEmissionsReport = report && (report.total_kg ?? 0) > 0;

  const hasResourceData =
    esg &&
    ((esg.waste_tonnes ?? 0) > 0 || (esg.platform_tonnes_recycled ?? 0) > 0);

  const hasSocialData =
    esg && (esg.nb_employees ?? 0) > 0 && (esg.commuting_employees ?? 0) > 0;

  const indicators: CsrdIndicator[] = [
    {
      code: 'E1-5',
      name: "Consommation d'énergie",
      status: hasEnergyData ? 'covered' : 'not_covered',
      source: hasEnergyData ? 'Formulaire' : 'À compléter',
    },
    {
      code: 'E1-6',
      name: 'Émissions GES Scope 1/2/3',
      status: hasEmissionsReport ? 'covered' : 'not_covered',
      source: hasEmissionsReport ? 'Calculé' : 'À compléter',
    },
    {
      code: 'E5-1',
      name: 'Utilisation des ressources',
      status: hasResourceData ? 'covered' : 'not_covered',
      source: hasResourceData ? 'Blockchain' : 'À compléter',
    },
    {
      code: 'S1-1',
      name: 'Politique sociale',
      status: hasSocialData ? 'partial' : 'not_covered',
      source: hasSocialData ? 'Partiel - Formulaire' : 'À compléter',
    },
    {
      code: 'G1-1',
      name: 'Éthique des affaires',
      status: 'not_covered',
      source: 'À compléter',
    },
  ];

  return NextResponse.json({ data: indicators });
}

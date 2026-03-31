import { NextRequest, NextResponse } from 'next/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

// Average emissions per employee by sector (tonnes CO2e/year) — source ADEME/INSEE
const sectorAverages: Record<string, number> = {
  industrie: 12.5,
  btp: 8.2,
  logistique: 15.3,
  commerce: 3.8,
  services: 2.1,
  agroalimentaire: 9.7,
  autre: 5.0,
};

function getRating(comparisonPct: number): string {
  if (comparisonPct < -30) return 'excellent';
  if (comparisonPct < -10) return 'good';
  if (comparisonPct <= 10) return 'average';
  return 'needs_improvement';
}

export async function GET(request: NextRequest) {
  const client = getSupabaseServerClient();
  const { data: user, error: authError } = await requireUser(client);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get('year') ?? '2026', 10);

  const adminClient = getSupabaseServerAdminClient();

  // Fetch user's esg_reports for the year
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: reports, error: reportsError } = await (adminClient as any)
    .from('esg_reports')
    .select('total_emissions')
    .eq('account_id', user.id)
    .eq('reporting_year', year);

  if (reportsError) {
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 },
    );
  }

  // Fetch user's org_esg_data to get industry_sector and nb_employees
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: orgData, error: orgError } = await (adminClient as any)
    .from('org_esg_data')
    .select('industry_sector, nb_employees')
    .eq('account_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (orgError) {
    return NextResponse.json(
      { error: 'Failed to fetch organization data' },
      { status: 500 },
    );
  }

  if (!orgData || !orgData.nb_employees || orgData.nb_employees === 0) {
    return NextResponse.json(
      { error: 'No organization data found. Please complete data entry first.' },
      { status: 404 },
    );
  }

  const sector: string = (orgData.industry_sector ?? 'autre').toLowerCase();
  const nbEmployees: number = orgData.nb_employees;

  // Sum total emissions across reports for the year (in kg CO2e)
  const totalEmissionsKg =
    reports?.reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (sum: number, r: any) => sum + (r.total_emissions ?? 0),
      0,
    ) ?? 0;

  // Convert to tonnes
  const totalEmissionsTonnes = totalEmissionsKg / 1000;
  const emissionsPerEmployee = totalEmissionsTonnes / nbEmployees;

  const sectorAverage = sectorAverages[sector] ?? sectorAverages['autre']!;
  const comparisonPct =
    sectorAverage > 0
      ? Math.round(((emissionsPerEmployee - sectorAverage) / sectorAverage) * 100)
      : 0;

  const rating = getRating(comparisonPct);

  const allSectors = Object.entries(sectorAverages).map(([s, average]) => ({
    sector: s,
    average,
  }));

  return NextResponse.json({
    company: {
      emissions_per_employee: Math.round(emissionsPerEmployee * 100) / 100,
      sector,
      nb_employees: nbEmployees,
    },
    sector_average: sectorAverage,
    comparison_pct: comparisonPct,
    rating,
    all_sectors: allSectors,
  });
}

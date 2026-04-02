import { cookies } from 'next/headers';

import { NextRequest, NextResponse } from 'next/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { generateESGReportPDF } from '~/lib/services/pdf/templates/esg-report-template';

export async function POST(req: NextRequest) {
  const client = getSupabaseServerClient();
  const { data: user, error: authError } = await requireUser(client);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { reporting_year: number };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.reporting_year) {
    return NextResponse.json(
      { error: 'reporting_year is required' },
      { status: 400 },
    );
  }

  const adminClient = getSupabaseServerAdminClient();
  const year = body.reporting_year;

  // 1. Fetch org_esg_data for user + year
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: esgRows } = await (adminClient as any)
    .from('org_esg_data')
    .select('*')
    .eq('account_id', user.id)
    .eq('reporting_year', year);

  const esg = esgRows?.[0] ?? {};

  // 2. Fetch the latest esg_reports entry (calculated totals)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: reportRows } = await (adminClient as any)
    .from('esg_reports')
    .select('*')
    .eq('account_id', user.id)
    .eq('report_year', year)
    .order('calculated_at', { ascending: false })
    .limit(1);

  const report = reportRows?.[0];

  // 3. Fetch carbon_records for the user (platform data)
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: carbonRecords } = await (adminClient as any)
    .from('carbon_records')
    .select('co2_avoided_kg, transaction_type, tonnes_recycled')
    .eq('account_id', user.id)
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  let platformCO2Avoided = 0;
  let platformTonnesRecycled = 0;
  let platformTransactionCount = 0;

  if (carbonRecords && carbonRecords.length > 0) {
    platformTransactionCount = carbonRecords.length;

    for (const record of carbonRecords) {
      platformCO2Avoided += record.co2_avoided_kg ?? 0;
      platformTonnesRecycled += record.tonnes_recycled ?? 0;
    }
  }

  // 4. Fetch account name
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: account } = await (adminClient as any)
    .from('accounts')
    .select('name')
    .eq('id', user.id)
    .single();

  const locale = (await cookies()).get('NEXT_LOCALE')?.value ?? 'en';
  const isFr = locale === 'fr';
  const companyName = account?.name ?? (isFr ? 'Mon entreprise' : 'My company');

  const scope1Kg = report?.scope1_kg ?? 0;
  const scope2Kg = report?.scope2_kg ?? 0;
  const scope3Kg = report?.scope3_kg ?? 0;
  const totalKg = report?.total_kg ?? scope1Kg + scope2Kg + scope3Kg;
  const avoidedKg = report?.avoided_kg ?? platformCO2Avoided;
  const netKg = report?.net_kg ?? totalKg - avoidedKg;
  const perEmployeeKg = report?.per_employee_kg ?? 0;

  let breakdown = { scope1: {}, scope2: {}, scope3: {} } as Record<
    string,
    Record<string, number>
  >;

  try {
    breakdown =
      typeof report?.breakdown === 'string'
        ? JSON.parse(report.breakdown)
        : (report?.breakdown ?? breakdown);
  } catch {
    // keep default
  }

  const fmt = (v: number) => v.toFixed(1);
  const fmtT = (v: number) => (v / 1000).toFixed(2);
  const generatedAt = new Date().toLocaleDateString(isFr ? 'fr-FR' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const aiSummary = isFr
    ? `Pour l'annee ${year}, ${companyName} a emis un total de ${fmt(totalKg)} kg CO2e (${fmtT(totalKg)} tonnes), repartis en Scope 1 (${fmt(scope1Kg)} kg), Scope 2 (${fmt(scope2Kg)} kg) et Scope 3 (${fmt(scope3Kg)} kg). Grace aux actions de recyclage et d'economie circulaire via la plateforme GreenEcoGenius, ${fmt(avoidedKg)} kg de CO2 ont ete evites, ramenant les emissions nettes a ${fmt(netKg)} kg CO2e.

${platformTransactionCount > 0 ? `Au total, ${platformTransactionCount} operations de recyclage ont ete tracees sur la plateforme, representant ${platformTonnesRecycled.toFixed(1)} tonnes de materiaux recycles.` : "Aucune transaction de recyclage n'a encore ete enregistree sur la plateforme pour cette periode."}

${perEmployeeKg > 0 ? `L'intensite carbone par collaborateur s'eleve a ${fmt(perEmployeeKg)} kg CO2e.` : ''}

Ce rapport suit les standards du GHG Protocol et s'appuie sur les facteurs d'emission de la Base Carbone ADEME 2024.`
    : `For the year ${year}, ${companyName} emitted a total of ${fmt(totalKg)} kg CO2e (${fmtT(totalKg)} tonnes), split across Scope 1 (${fmt(scope1Kg)} kg), Scope 2 (${fmt(scope2Kg)} kg) and Scope 3 (${fmt(scope3Kg)} kg). Through recycling and circular economy actions via the GreenEcoGenius platform, ${fmt(avoidedKg)} kg of CO2 were avoided, bringing net emissions to ${fmt(netKg)} kg CO2e.

${platformTransactionCount > 0 ? `A total of ${platformTransactionCount} recycling operations were tracked on the platform, representing ${platformTonnesRecycled.toFixed(1)} tonnes of recycled materials.` : 'No recycling transactions have been recorded on the platform for this period.'}

${perEmployeeKg > 0 ? `The carbon intensity per employee stands at ${fmt(perEmployeeKg)} kg CO2e.` : ''}

This report follows GHG Protocol standards and relies on ADEME Base Carbone 2024 emission factors.`;

  // Generate PDF
  const pdfBuffer = generateESGReportPDF(
    {
    companyName,
    year,
    date: generatedAt,
    format: 'ghg_protocol',
    formatLabel: 'GHG Protocol',
    scope1Kg,
    scope2Kg,
    scope3Kg,
    totalKg,
    avoidedKg,
    netKg,
    perEmployeeKg,
    breakdown: breakdown as {
      scope1: Record<string, number>;
      scope2: Record<string, number>;
      scope3: Record<string, number>;
    },
    esg,
    platformTonnesRecycled,
    platformTransactionCount,
    aiSummary,
    nbEmployees: esg.nb_employees,
    industrySector: esg.industry_sector,
    },
    locale,
  );

  const safeCompanyName = companyName.replace(/[^a-zA-Z0-9]/g, '_');

  return new Response(pdfBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${isFr ? 'Rapport-ESG' : 'ESG-Report'}-${year}-${safeCompanyName}.pdf"`,
    },
  });
}

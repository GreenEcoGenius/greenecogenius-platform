import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import * as z from 'zod';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { REPORT_SECTION_PROMPTS } from '~/lib/config/flux-prompts';
import { FluxClient } from '~/lib/services/flux-client';
import { getUserPlan } from '~/lib/services/flux-usage';
import { generateESGReportPDF } from '~/lib/services/pdf/templates/esg-report-template';

const ESGReportSchema = z.object({
  reportingYear: z.number().int().min(2020).max(2100).optional(),
  format: z.enum(['ghg_protocol', 'csrd', 'gri']).optional(),
});

export async function POST(req: NextRequest) {
  const client = getSupabaseServerClient();
  const { data: user, error: authError } = await requireUser(client);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let rawBody: unknown;

  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = ESGReportSchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const year = parsed.data.reportingYear ?? new Date().getFullYear();
  const format = parsed.data.format ?? 'ghg_protocol';

  const adminClient = getSupabaseServerAdminClient();

  // 1. Fetch org_esg_data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: esgRows } = await (adminClient as any)
    .from('org_esg_data')
    .select('*')
    .eq('account_id', user.id)
    .eq('reporting_year', year);

  const esg = esgRows?.[0] ?? {};

  // 2. Fetch latest esg_reports
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: reportRows } = await (adminClient as any)
    .from('esg_reports')
    .select('*')
    .eq('account_id', user.id)
    .eq('report_year', year)
    .order('calculated_at', { ascending: false })
    .limit(1);

  const report = reportRows?.[0];

  // 3. Fetch carbon_records
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: carbonRecords } = await (adminClient as any)
    .from('carbon_records')
    .select('co2_avoided_kg, transaction_type, tonnes_recycled, created_at')
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

  // Compute values
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

  const generatedAt = new Date().toLocaleDateString(isFr ? 'fr-FR' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formatLabel =
    format === 'csrd'
      ? 'CSRD / ESRS'
      : format === 'gri'
        ? 'GRI Standards'
        : 'GHG Protocol';

  // 5. Try AI executive summary
  let aiSummary = '';
  try {
    if (process.env.ANTHROPIC_API_KEY) {
      const { execute } = await import('~/lib/ai/orchestrator');
      const summaryData = {
        year,
        format,
        companyName,
        scope1Kg,
        scope2Kg,
        scope3Kg,
        totalKg,
        avoidedKg,
        netKg,
        platformTonnesRecycled,
        platformTransactionCount,
        employees: esg.nb_employees,
        sector: esg.industry_sector,
      };
      const aiPrompt = isFr
        ? `Genere une synthese executive pour un rapport ESG complet (format ${format}) avec ces donnees : ${JSON.stringify(summaryData)}. Redige en francais, 3-4 paragraphes professionnels. Ne retourne que le texte de la synthese, sans JSON.`
        : `Generate an executive summary for a full ESG report (${format} format) with this data: ${JSON.stringify(summaryData)}. Write in English, 3-4 professional paragraphs. Return only the summary text, no JSON.`;
      const result = await execute('esg', aiPrompt, {
        orgId: user.id,
        locale,
      });
      aiSummary = result.content;
    }
  } catch {
    // Fallback below
  }

  const fmt = (v: number) => v.toFixed(1);
  const fmtT = (v: number) => (v / 1000).toFixed(2);

  if (!aiSummary) {
    aiSummary = isFr
      ? `Pour l'annee ${year}, ${companyName} a emis un total de ${fmt(totalKg)} kg CO2e (${fmtT(totalKg)} tonnes), repartis en Scope 1 (${fmt(scope1Kg)} kg), Scope 2 (${fmt(scope2Kg)} kg) et Scope 3 (${fmt(scope3Kg)} kg). Grace aux actions de recyclage et d'economie circulaire via la plateforme GreenEcoGenius, ${fmt(avoidedKg)} kg de CO2 ont ete evites, ramenant les emissions nettes a ${fmt(netKg)} kg CO2e.

${platformTransactionCount > 0 ? `Au total, ${platformTransactionCount} operations de recyclage ont ete tracees sur la plateforme, representant ${platformTonnesRecycled.toFixed(1)} tonnes de materiaux recycles.` : "Aucune transaction de recyclage n'a encore ete enregistree sur la plateforme pour cette periode."}

${perEmployeeKg > 0 ? `L'intensite carbone par collaborateur s'eleve a ${fmt(perEmployeeKg)} kg CO2e.` : ''}

Ce rapport suit les standards du ${formatLabel} et s'appuie sur les facteurs d'emission de la Base Carbone ADEME 2024.`
      : `For the year ${year}, ${companyName} emitted a total of ${fmt(totalKg)} kg CO2e (${fmtT(totalKg)} tonnes), split across Scope 1 (${fmt(scope1Kg)} kg), Scope 2 (${fmt(scope2Kg)} kg) and Scope 3 (${fmt(scope3Kg)} kg). Through recycling and circular economy actions via the GreenEcoGenius platform, ${fmt(avoidedKg)} kg of CO2 were avoided, bringing net emissions to ${fmt(netKg)} kg CO2e.

${platformTransactionCount > 0 ? `A total of ${platformTransactionCount} recycling operations were tracked on the platform, representing ${platformTonnesRecycled.toFixed(1)} tonnes of recycled materials.` : 'No recycling transactions have been recorded on the platform for this period.'}

${perEmployeeKg > 0 ? `The carbon intensity per employee stands at ${fmt(perEmployeeKg)} kg CO2e.` : ''}

This report follows ${formatLabel} standards and relies on ADEME Base Carbone 2024 emission factors.`;
  }

  // Generate Flux illustrations for Enterprise users
  let fluxImages: Record<string, string> | undefined;

  if (FluxClient.isConfigured()) {
    const plan = await getUserPlan(client, user.id);

    if (plan === 'enterprise') {
      fluxImages = {};
      const flux = new FluxClient();
      const sections = ['carbon', 'circular_economy'] as const;

      for (const section of sections) {
        try {
          const prompt = REPORT_SECTION_PROMPTS[section];
          if (!prompt) continue;
          const imageUrl = await flux.generateAndWait({
            prompt,
            width: 1200,
            height: 800,
          });
          const imgResponse = await fetch(imageUrl);
          const imgBuffer = Buffer.from(await imgResponse.arrayBuffer());
          fluxImages[section] = `data:image/png;base64,${imgBuffer.toString('base64')}`;
        } catch (err) {
          console.error(`Flux ESG illustration failed for ${section}:`, err);
        }
      }
    }
  }

  // Generate PDF
  const pdfBuffer = generateESGReportPDF(
    {
      companyName,
      year,
      date: generatedAt,
      format,
      formatLabel,
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
      fluxImages,
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

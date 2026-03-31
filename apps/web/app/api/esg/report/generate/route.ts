import { NextRequest, NextResponse } from 'next/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

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

  const companyName = account?.name ?? 'Mon entreprise';

  // Use report data if available, otherwise fallback to esg row estimates
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
  const generatedAt = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // 5. Generate HTML report
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Rapport ESG ${year} — ${companyName}</title>
  <style>
    @media print {
      body { margin: 0; }
      .page-break { page-break-before: always; }
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1a1a1a;
      line-height: 1.6;
      background: #fff;
      padding: 40px;
      max-width: 900px;
      margin: 0 auto;
    }
    h1 { font-size: 28px; color: #065f46; margin-bottom: 4px; }
    h2 { font-size: 20px; color: #065f46; margin: 32px 0 16px; border-bottom: 2px solid #d1fae5; padding-bottom: 8px; }
    h3 { font-size: 16px; color: #047857; margin: 20px 0 10px; }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 3px solid #059669;
      padding-bottom: 20px;
      margin-bottom: 32px;
    }
    .logo { font-size: 24px; font-weight: 800; color: #059669; }
    .logo span { color: #065f46; }
    .meta { text-align: right; color: #6b7280; font-size: 14px; }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin: 20px 0;
    }
    .summary-card {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      padding: 16px;
      text-align: center;
    }
    .summary-card .label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
    .summary-card .value { font-size: 24px; font-weight: 700; color: #065f46; margin: 4px 0; }
    .summary-card .unit { font-size: 12px; color: #6b7280; }
    .summary-card.negative .value { color: #059669; }
    .summary-card.highlight { background: #065f46; border-color: #065f46; }
    .summary-card.highlight .label,
    .summary-card.highlight .unit { color: #a7f3d0; }
    .summary-card.highlight .value { color: #fff; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; }
    th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
    th { background: #f9fafb; font-weight: 600; color: #374151; }
    td:last-child, th:last-child { text-align: right; }
    .bar-container { background: #e5e7eb; border-radius: 4px; height: 8px; width: 120px; display: inline-block; vertical-align: middle; margin-left: 8px; }
    .bar { height: 100%; border-radius: 4px; }
    .bar.scope1 { background: #f97316; }
    .bar.scope2 { background: #3b82f6; }
    .bar.scope3 { background: #8b5cf6; }
    .bar.green { background: #10b981; }
    .methodology { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 24px 0; font-size: 13px; color: #6b7280; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #d1fae5; text-align: center; color: #9ca3af; font-size: 12px; }
    .badge { display: inline-block; background: #d1fae5; color: #065f46; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 12px; margin-left: 8px; }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <div>
      <div class="logo">Green<span>Eco</span>Genius</div>
      <h1>Rapport ESG ${year}</h1>
      <p style="color: #6b7280; font-size: 14px; margin-top: 4px;">${companyName}</p>
    </div>
    <div class="meta">
      <p>Rapport annuel</p>
      <p>${generatedAt}</p>
      <p>${esg.nb_employees ? esg.nb_employees + ' collaborateurs' : ''}</p>
      ${esg.industry_sector ? `<p style="text-transform:capitalize;">${esg.industry_sector}</p>` : ''}
    </div>
  </div>

  <!-- Executive Summary -->
  <h2>Synthese des emissions</h2>
  <div class="summary-grid">
    <div class="summary-card">
      <div class="label">Scope 1 — Direct</div>
      <div class="value">${fmt(scope1Kg)}</div>
      <div class="unit">kg CO2e (${fmtT(scope1Kg)} t)</div>
    </div>
    <div class="summary-card">
      <div class="label">Scope 2 — Energie</div>
      <div class="value">${fmt(scope2Kg)}</div>
      <div class="unit">kg CO2e (${fmtT(scope2Kg)} t)</div>
    </div>
    <div class="summary-card">
      <div class="label">Scope 3 — Indirect</div>
      <div class="value">${fmt(scope3Kg)}</div>
      <div class="unit">kg CO2e (${fmtT(scope3Kg)} t)</div>
    </div>
    <div class="summary-card highlight">
      <div class="label">Total emissions</div>
      <div class="value">${fmt(totalKg)}</div>
      <div class="unit">kg CO2e (${fmtT(totalKg)} t)</div>
    </div>
    <div class="summary-card negative">
      <div class="label">CO2 evite (plateforme)</div>
      <div class="value">-${fmt(avoidedKg)}</div>
      <div class="unit">kg CO2e</div>
    </div>
    <div class="summary-card highlight">
      <div class="label">Emissions nettes</div>
      <div class="value">${fmt(netKg)}</div>
      <div class="unit">kg CO2e (${fmtT(netKg)} t)</div>
    </div>
  </div>
  ${perEmployeeKg > 0 ? `<p style="font-size:13px;color:#6b7280;margin-top:8px;">Intensite par collaborateur : <strong>${fmt(perEmployeeKg)} kg CO2e</strong> (${fmtT(perEmployeeKg)} t)</p>` : ''}

  <!-- Scope 1 Detail -->
  <h2>Scope 1 — Emissions directes</h2>
  <p style="font-size:13px;color:#6b7280;margin-bottom:12px;">Combustion de carburant et gaz naturel sur site.</p>
  <table>
    <thead><tr><th>Source</th><th>Donnee</th><th>Emissions (kg CO2e)</th></tr></thead>
    <tbody>
      <tr>
        <td>Gaz naturel</td>
        <td>${esg.natural_gas_kwh ?? 0} kWh</td>
        <td>${fmt(breakdown.scope1?.natural_gas ?? 0)}<div class="bar-container"><div class="bar scope1" style="width:${totalKg > 0 ? ((breakdown.scope1?.natural_gas ?? 0) / totalKg) * 100 : 0}%"></div></div></td>
      </tr>
      <tr>
        <td>Carburant (${esg.fuel_type ?? 'diesel'})</td>
        <td>${esg.fuel_liters ?? 0} litres</td>
        <td>${fmt(breakdown.scope1?.fuel ?? 0)}<div class="bar-container"><div class="bar scope1" style="width:${totalKg > 0 ? ((breakdown.scope1?.fuel ?? 0) / totalKg) * 100 : 0}%"></div></div></td>
      </tr>
      <tr>
        <td>Autres emissions directes</td>
        <td>—</td>
        <td>${fmt(breakdown.scope1?.other ?? 0)}</td>
      </tr>
      <tr style="font-weight:600;background:#fff7ed;">
        <td colspan="2">Total Scope 1</td>
        <td>${fmt(scope1Kg)} kg CO2e</td>
      </tr>
    </tbody>
  </table>

  <!-- Scope 2 Detail -->
  <h2>Scope 2 — Emissions energetiques indirectes</h2>
  <p style="font-size:13px;color:#6b7280;margin-bottom:12px;">Electricite et chauffage achetes.</p>
  <table>
    <thead><tr><th>Source</th><th>Donnee</th><th>Emissions (kg CO2e)</th></tr></thead>
    <tbody>
      <tr>
        <td>Electricite (${esg.electricity_source === 'renewable' ? '100% renouvelable' : 'reseau FR'})</td>
        <td>${esg.electricity_kwh ?? 0} kWh</td>
        <td>${fmt(breakdown.scope2?.electricity ?? 0)}<div class="bar-container"><div class="bar scope2" style="width:${totalKg > 0 ? ((breakdown.scope2?.electricity ?? 0) / totalKg) * 100 : 0}%"></div></div></td>
      </tr>
      <tr>
        <td>Chauffage</td>
        <td>${esg.heating_kwh ?? 0} kWh</td>
        <td>${fmt(breakdown.scope2?.heating ?? 0)}<div class="bar-container"><div class="bar scope2" style="width:${totalKg > 0 ? ((breakdown.scope2?.heating ?? 0) / totalKg) * 100 : 0}%"></div></div></td>
      </tr>
      <tr style="font-weight:600;background:#eff6ff;">
        <td colspan="2">Total Scope 2</td>
        <td>${fmt(scope2Kg)} kg CO2e</td>
      </tr>
    </tbody>
  </table>

  <!-- Scope 3 Detail -->
  <div class="page-break"></div>
  <h2>Scope 3 — Autres emissions indirectes</h2>
  <p style="font-size:13px;color:#6b7280;margin-bottom:12px;">Deplacements, achats, dechets et autres emissions de la chaine de valeur.</p>
  <table>
    <thead><tr><th>Source</th><th>Donnee</th><th>Emissions (kg CO2e)</th></tr></thead>
    <tbody>
      <tr>
        <td>Deplacements professionnels</td>
        <td>${esg.business_travel_km ?? 0} km (${esg.travel_mode ?? 'car'})</td>
        <td>${fmt(breakdown.scope3?.travel ?? 0)}<div class="bar-container"><div class="bar scope3" style="width:${totalKg > 0 ? ((breakdown.scope3?.travel ?? 0) / totalKg) * 100 : 0}%"></div></div></td>
      </tr>
      <tr>
        <td>Trajets domicile-travail</td>
        <td>${esg.commuting_employees ?? 0} employes x ${esg.commuting_avg_km ?? 0} km</td>
        <td>${fmt(breakdown.scope3?.commuting ?? 0)}<div class="bar-container"><div class="bar scope3" style="width:${totalKg > 0 ? ((breakdown.scope3?.commuting ?? 0) / totalKg) * 100 : 0}%"></div></div></td>
      </tr>
      <tr>
        <td>Achats de biens et services</td>
        <td>${esg.purchased_goods_eur ?? 0} EUR</td>
        <td>${fmt(breakdown.scope3?.goods ?? 0)}<div class="bar-container"><div class="bar scope3" style="width:${totalKg > 0 ? ((breakdown.scope3?.goods ?? 0) / totalKg) * 100 : 0}%"></div></div></td>
      </tr>
      <tr>
        <td>Dechets</td>
        <td>${esg.waste_tonnes ?? 0} tonnes</td>
        <td>${fmt(breakdown.scope3?.waste ?? 0)}<div class="bar-container"><div class="bar scope3" style="width:${totalKg > 0 ? ((breakdown.scope3?.waste ?? 0) / totalKg) * 100 : 0}%"></div></div></td>
      </tr>
      <tr style="font-weight:600;background:#f5f3ff;">
        <td colspan="2">Total Scope 3</td>
        <td>${fmt(scope3Kg)} kg CO2e</td>
      </tr>
    </tbody>
  </table>

  <!-- Platform Impact -->
  <h2>Impact Plateforme GreenEcoGenius</h2>
  <p style="font-size:13px;color:#6b7280;margin-bottom:12px;">Donnees tracees et verifiees via la plateforme de recyclage.</p>
  <div class="summary-grid">
    <div class="summary-card negative">
      <div class="label">Tonnes recyclees</div>
      <div class="value">${platformTonnesRecycled.toFixed(1)}</div>
      <div class="unit">tonnes</div>
    </div>
    <div class="summary-card negative">
      <div class="label">CO2 evite</div>
      <div class="value">${fmt(platformCO2Avoided)}</div>
      <div class="unit">kg CO2e</div>
    </div>
    <div class="summary-card">
      <div class="label">Transactions</div>
      <div class="value">${platformTransactionCount}</div>
      <div class="unit">operations tracees</div>
    </div>
  </div>

  <!-- Methodology -->
  <div class="methodology">
    <h3 style="margin-bottom:8px;">Methodologie</h3>
    <p>Ce rapport a ete genere selon les facteurs d'emission de la <strong>Base Carbone ADEME 2024</strong> et en conformite avec le <strong>GHG Protocol</strong> (Greenhouse Gas Protocol). Les donnees de la plateforme sont tracees et verifiees automatiquement via GreenEcoGenius.</p>
    <p style="margin-top:8px;">Les scopes suivent la categorisation standard :</p>
    <ul style="margin:8px 0 0 20px;">
      <li><strong>Scope 1</strong> : Emissions directes (combustion sur site, vehicules de l'entreprise)</li>
      <li><strong>Scope 2</strong> : Emissions indirectes liees a l'energie achetee</li>
      <li><strong>Scope 3</strong> : Autres emissions indirectes (chaine de valeur)</li>
    </ul>
  </div>

  <!-- Footer -->
  <div class="footer">
    <p>Genere par <strong>GreenEcoGenius</strong> — greenecogenius.tech</p>
    <p style="margin-top:4px;">Pour imprimer en PDF : Fichier > Imprimer > Enregistrer en PDF</p>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': `attachment; filename="rapport-esg-${year}-${companyName.replace(/[^a-zA-Z0-9]/g, '_')}.html"`,
    },
  });
}

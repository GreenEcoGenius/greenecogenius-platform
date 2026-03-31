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

  let body: {
    reportingYear?: number;
    format?: 'ghg_protocol' | 'csrd' | 'gri';
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const year = body.reportingYear ?? new Date().getFullYear();
  const format = body.format ?? 'ghg_protocol';

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

  const companyName = account?.name ?? 'Mon entreprise';

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

  const fmt = (v: number) => v.toFixed(1);
  const fmtT = (v: number) => (v / 1000).toFixed(2);

  const generatedAt = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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
      const result = await execute(
        'esg',
        `Genere une synthese executive pour un rapport ESG complet (format ${format}) avec ces donnees : ${JSON.stringify(summaryData)}.
Redige en francais, 3-4 paragraphes professionnels. Ne retourne que le texte de la synthese, sans JSON.`,
        { orgId: user.id },
      );
      aiSummary = result.content;
    }
  } catch {
    // Fallback below
  }

  if (!aiSummary) {
    aiSummary = `Pour l'annee ${year}, ${companyName} a emis un total de ${fmt(totalKg)} kg CO2e (${fmtT(totalKg)} tonnes), repartis en Scope 1 (${fmt(scope1Kg)} kg), Scope 2 (${fmt(scope2Kg)} kg) et Scope 3 (${fmt(scope3Kg)} kg). Grace aux actions de recyclage et d'economie circulaire via la plateforme GreenEcoGenius, ${fmt(avoidedKg)} kg de CO2 ont ete evites, ramenant les emissions nettes a ${fmt(netKg)} kg CO2e.

${platformTransactionCount > 0 ? `Au total, ${platformTransactionCount} operations de recyclage ont ete tracees sur la plateforme, representant ${platformTonnesRecycled.toFixed(1)} tonnes de materiaux recycles. Chaque transaction est verifiee et enregistree de maniere transparente.` : 'Aucune transaction de recyclage n\'a encore ete enregistree sur la plateforme pour cette periode.'}

${perEmployeeKg > 0 ? `L'intensite carbone par collaborateur s'eleve a ${fmt(perEmployeeKg)} kg CO2e, un indicateur cle pour le suivi de la performance environnementale de l'organisation.` : ''}

Ce rapport suit les standards du ${format === 'csrd' ? 'CSRD/ESRS' : format === 'gri' ? 'GRI Standards' : 'GHG Protocol'} et s'appuie sur les facteurs d'emission de la Base Carbone ADEME 2024.`;
  }

  const formatLabel =
    format === 'csrd'
      ? 'CSRD / ESRS'
      : format === 'gri'
        ? 'GRI Standards'
        : 'GHG Protocol';

  // Equivalences visuelles
  const treesEquiv = Math.round(totalKg / 22); // ~22 kg CO2 per tree per year
  const carsEquiv = (totalKg / 4600).toFixed(1); // ~4600 kg CO2 per car per year
  const flightsEquiv = Math.round(totalKg / 900); // ~900 kg CO2 per Paris-NY flight

  // Build circular economy detail from carbon records
  const transactionTypes: Record<string, number> = {};
  if (carbonRecords) {
    for (const r of carbonRecords) {
      const t = r.transaction_type ?? 'autre';
      transactionTypes[t] = (transactionTypes[t] ?? 0) + 1;
    }
  }

  const circularRows = Object.entries(transactionTypes)
    .map(
      ([type, count]) => `
    <tr>
      <td style="text-transform:capitalize;">${type}</td>
      <td style="text-align:right;">${count}</td>
    </tr>`,
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Rapport ESG Complet ${year} — ${companyName}</title>
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
      padding: 0;
      margin: 0;
    }

    /* Cover page */
    .cover {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      background: linear-gradient(135deg, #1e1b4b 0%, #4338ca 50%, #6366f1 100%);
      color: #fff;
      padding: 60px 40px;
    }
    .cover .logo { font-size: 32px; font-weight: 800; margin-bottom: 40px; }
    .cover .logo span { color: #a5b4fc; }
    .cover h1 { font-size: 36px; font-weight: 700; margin-bottom: 8px; letter-spacing: 1px; }
    .cover .subtitle { font-size: 20px; opacity: 0.8; margin-bottom: 8px; }
    .cover .company { font-size: 24px; opacity: 0.9; margin-bottom: 8px; }
    .cover .date { font-size: 16px; opacity: 0.7; margin-bottom: 40px; }
    .cover .format-badge {
      display: inline-block;
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: 20px;
      padding: 8px 24px;
      font-size: 14px;
      letter-spacing: 1px;
    }
    .cover .total-box {
      margin-top: 40px;
      background: rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 24px 40px;
    }
    .cover .total-box .big { font-size: 48px; font-weight: 800; }
    .cover .total-box .label { font-size: 14px; opacity: 0.7; }

    /* Content pages */
    .content {
      max-width: 900px;
      margin: 0 auto;
      padding: 40px;
    }
    h1 { font-size: 28px; color: #1e1b4b; margin-bottom: 4px; }
    h2 { font-size: 20px; color: #1e1b4b; margin: 32px 0 16px; border-bottom: 2px solid #e0e7ff; padding-bottom: 8px; }
    h3 { font-size: 16px; color: #4338ca; margin: 20px 0 10px; }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 3px solid #4338ca;
      padding-bottom: 20px;
      margin-bottom: 32px;
    }
    .logo-small { font-size: 24px; font-weight: 800; color: #059669; }
    .logo-small span { color: #065f46; }
    .meta { text-align: right; color: #6b7280; font-size: 14px; }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin: 20px 0;
    }
    .summary-card {
      background: #eef2ff;
      border: 1px solid #c7d2fe;
      border-radius: 8px;
      padding: 16px;
      text-align: center;
    }
    .summary-card .label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
    .summary-card .value { font-size: 24px; font-weight: 700; color: #1e1b4b; margin: 4px 0; }
    .summary-card .unit { font-size: 12px; color: #6b7280; }
    .summary-card.green { background: #f0fdf4; border-color: #bbf7d0; }
    .summary-card.green .value { color: #059669; }
    .summary-card.highlight { background: #1e1b4b; border-color: #1e1b4b; }
    .summary-card.highlight .label,
    .summary-card.highlight .unit { color: #a5b4fc; }
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
    .executive-box {
      background: #eef2ff;
      border: 1px solid #c7d2fe;
      border-left: 4px solid #4338ca;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      font-size: 14px;
      line-height: 1.8;
      white-space: pre-line;
    }
    .equivalence-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin: 20px 0;
    }
    .equiv-card {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 8px;
      padding: 16px;
      text-align: center;
    }
    .equiv-card .emoji { font-size: 32px; margin-bottom: 8px; }
    .equiv-card .val { font-size: 24px; font-weight: 700; color: #92400e; }
    .equiv-card .desc { font-size: 12px; color: #6b7280; margin-top: 4px; }
    .methodology {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      margin: 24px 0;
      font-size: 13px;
      color: #6b7280;
    }
    .blockchain-box {
      background: #faf5ff;
      border: 1px solid #e9d5ff;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e0e7ff;
      text-align: center;
      color: #9ca3af;
      font-size: 12px;
    }
    .badge { display: inline-block; background: #e0e7ff; color: #1e1b4b; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 12px; margin-left: 8px; }
  </style>
</head>
<body>

  <!-- Cover Page -->
  <div class="cover">
    <div class="logo">Green<span>Eco</span>Genius</div>
    <h1>RAPPORT ESG COMPLET</h1>
    <div class="subtitle">Annee de reporting : ${year}</div>
    <div class="company">${companyName}</div>
    <div class="date">${generatedAt}</div>
    <div class="format-badge">${formatLabel}</div>
    <div class="total-box">
      <div class="big">${fmtT(totalKg)} t</div>
      <div class="label">CO2e total — Emissions nettes : ${fmtT(netKg)} t</div>
    </div>
  </div>

  <!-- Content -->
  <div class="content">

    <!-- Header -->
    <div class="header">
      <div>
        <div class="logo-small">Green<span>Eco</span>Genius</div>
        <h1>Rapport ESG Complet ${year}</h1>
        <p style="color: #6b7280; font-size: 14px; margin-top: 4px;">${companyName}</p>
      </div>
      <div class="meta">
        <p>Rapport annuel — ${formatLabel}</p>
        <p>${generatedAt}</p>
        ${esg.nb_employees ? `<p>${esg.nb_employees} collaborateurs</p>` : ''}
        ${esg.industry_sector ? `<p style="text-transform:capitalize;">${esg.industry_sector}</p>` : ''}
      </div>
    </div>

    <!-- Executive Summary (AI-generated or template) -->
    <h2>Synthese executive</h2>
    <div class="executive-box">
      ${aiSummary}
    </div>

    <!-- Emissions Summary -->
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
      <div class="summary-card green">
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

    <!-- Circular Economy -->
    <h2>Economie circulaire — Impact plateforme</h2>
    <p style="font-size:13px;color:#6b7280;margin-bottom:12px;">Donnees tracees et verifiees via la plateforme GreenEcoGenius.</p>
    <div class="summary-grid">
      <div class="summary-card green">
        <div class="label">Tonnes recyclees</div>
        <div class="value">${platformTonnesRecycled.toFixed(1)}</div>
        <div class="unit">tonnes</div>
      </div>
      <div class="summary-card green">
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
    ${
      circularRows
        ? `
    <h3>Detail par type de transaction</h3>
    <table>
      <thead><tr><th>Type</th><th>Nombre</th></tr></thead>
      <tbody>${circularRows}</tbody>
    </table>`
        : ''
    }

    <!-- Equivalences visuelles -->
    <div class="page-break"></div>
    <h2>Equivalences visuelles</h2>
    <p style="font-size:13px;color:#6b7280;margin-bottom:12px;">Pour mieux comprendre l'impact de vos emissions.</p>
    <div class="equivalence-grid">
      <div class="equiv-card">
        <div class="emoji">🌳</div>
        <div class="val">${treesEquiv}</div>
        <div class="desc">arbres necessaires pour absorber vos emissions en 1 an</div>
      </div>
      <div class="equiv-card">
        <div class="emoji">🚗</div>
        <div class="val">${carsEquiv}</div>
        <div class="desc">voitures roulant pendant 1 an (15 000 km)</div>
      </div>
      <div class="equiv-card">
        <div class="emoji">✈️</div>
        <div class="val">${flightsEquiv}</div>
        <div class="desc">vols aller-retour Paris — New York</div>
      </div>
    </div>

    <!-- Blockchain proofs -->
    <h2>Tracabilite & preuves blockchain</h2>
    <div class="blockchain-box">
      <h3 style="color:#7c3aed;margin-bottom:8px;">Verification des donnees</h3>
      <p style="font-size:13px;color:#6b7280;">Les donnees de recyclage et d'economie circulaire presentees dans ce rapport sont tracees via la plateforme GreenEcoGenius. Chaque transaction est enregistree de maniere immuable, garantissant l'integrite et la transparence des donnees reportees.</p>
      <div style="margin-top:12px;display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">
        <div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:6px;padding:12px;">
          <p style="font-size:11px;color:#6b7280;text-transform:uppercase;">Transactions verifiees</p>
          <p style="font-size:20px;font-weight:700;color:#7c3aed;">${platformTransactionCount}</p>
        </div>
        <div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:6px;padding:12px;">
          <p style="font-size:11px;color:#6b7280;text-transform:uppercase;">Tonnes tracees</p>
          <p style="font-size:20px;font-weight:700;color:#7c3aed;">${platformTonnesRecycled.toFixed(1)} t</p>
        </div>
      </div>
    </div>

    <!-- Methodology -->
    <div class="page-break"></div>
    <h2>Methodologie</h2>
    <div class="methodology">
      <h3 style="margin-bottom:8px;">Cadre de reporting</h3>
      <p>Ce rapport a ete genere selon le format <strong>${formatLabel}</strong> et les facteurs d'emission de la <strong>Base Carbone ADEME 2024</strong>.</p>

      <p style="margin-top:12px;"><strong>Standards appliques :</strong></p>
      <ul style="margin:8px 0 0 20px;">
        ${format === 'ghg_protocol' ? '<li><strong>GHG Protocol</strong> : Corporate Standard & Scope 3 Standard</li>' : ''}
        ${format === 'csrd' ? '<li><strong>CSRD</strong> : Directive europeenne sur le reporting de durabilite</li><li><strong>ESRS E1</strong> : European Sustainability Reporting Standards — Climate Change</li>' : ''}
        ${format === 'gri' ? '<li><strong>GRI 305</strong> : Emissions</li><li><strong>GRI 306</strong> : Dechets</li><li><strong>GRI 302</strong> : Energie</li>' : ''}
      </ul>

      <p style="margin-top:12px;"><strong>Perimetres :</strong></p>
      <ul style="margin:8px 0 0 20px;">
        <li><strong>Scope 1</strong> : Emissions directes (combustion sur site, vehicules)</li>
        <li><strong>Scope 2</strong> : Emissions indirectes liees a l'energie achetee</li>
        <li><strong>Scope 3</strong> : Autres emissions indirectes (chaine de valeur)</li>
      </ul>

      <p style="margin-top:12px;"><strong>Sources de donnees :</strong></p>
      <ul style="margin:8px 0 0 20px;">
        <li>Donnees organisationnelles saisies par l'utilisateur</li>
        <li>Donnees de recyclage tracees via la plateforme GreenEcoGenius</li>
        <li>Facteurs d'emission : Base Carbone ADEME 2024</li>
      </ul>
    </div>

    <!-- Disclaimer -->
    <div class="methodology" style="border-left:4px solid #f59e0b;">
      <h3 style="margin-bottom:8px;color:#92400e;">Avertissement</h3>
      <p>Ce rapport est genere automatiquement a partir des donnees fournies par l'utilisateur et des calculs de la plateforme GreenEcoGenius. Il est fourni a titre indicatif et ne constitue pas un audit certifie. Pour un reporting officiel CSRD/GRI, nous recommandons une verification par un organisme tiers independant (OTI).</p>
      <p style="margin-top:8px;">Les facteurs d'emission utilises sont issus de la Base Carbone ADEME et peuvent varier selon le contexte specifique de votre organisation.</p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>Genere par <strong>GreenEcoGenius</strong> — greenecogenius.tech</p>
      <p style="margin-top:4px;">Pour imprimer en PDF : Fichier > Imprimer > Enregistrer en PDF</p>
      <p style="margin-top:4px;">Rapport genere le ${generatedAt} — Format ${formatLabel}</p>
    </div>

  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': `attachment; filename="rapport-esg-complet-${year}-${companyName.replace(/[^a-zA-Z0-9]/g, '_')}.html"`,
    },
  });
}

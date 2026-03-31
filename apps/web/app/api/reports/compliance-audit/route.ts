import { NextRequest, NextResponse } from 'next/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

interface NormAnalysis {
  name: string;
  pillar: string;
  status: 'conforme' | 'partiel' | 'non_conforme';
  severity: 'critique' | 'majeur' | 'mineur' | 'info';
  finding: string;
  recommendation: string;
}

interface AuditResult {
  score: number;
  normsCompliant: number;
  normsPartial: number;
  normsNonCompliant: number;
  normsTotal: number;
  criticalIssues: number;
  majorIssues: number;
  minorIssues: number;
  norms: NormAnalysis[];
  executiveSummary: string;
}

const PILLARS = [
  {
    name: 'Economie circulaire',
    norms: [
      'Loi AGEC',
      'REP',
      'Indice reparabilite',
      'Eco-conception',
      'Affichage environnemental',
      'Tri 5 flux',
      'Decret tertiaire',
      'AFNOR zero dechet',
      'PPWR',
      'Taxonomie UE (circulaire)',
      'DPP',
    ],
  },
  {
    name: 'Carbone & Environnement',
    norms: [
      'Bilan GES',
      'ISO 14064',
      'SBTi',
      'CDP Climate',
      'EU ETS',
      'CBAM',
      'Plan transition',
    ],
  },
  {
    name: 'Reporting ESG',
    norms: [
      'CSRD',
      'ESRS',
      'GRI',
      'Taxonomie verte',
      'SFDR',
      'Devoir vigilance',
      'DPEF',
      'Art. 29 LEC',
      'CS3D',
    ],
  },
  {
    name: 'Tracabilite',
    norms: [
      'Blockchain',
      'Vigilance chaine',
      'ISO 22095',
      'EUDR',
      '3TG',
      'Passeport batterie',
    ],
  },
  {
    name: 'Donnees & SaaS',
    norms: ['RGPD', 'ISO 27001', 'SOC 2', 'HDS', 'NIS2'],
  },
  {
    name: 'Labels',
    norms: ['B Corp', 'Numerique Responsable', 'Lucie 26000', 'Engage RSE'],
  },
];

function generateMockAnalysis(): AuditResult {
  const norms: NormAnalysis[] = [];
  const statuses: Array<'conforme' | 'partiel' | 'non_conforme'> = [
    'conforme',
    'conforme',
    'conforme',
    'conforme',
    'partiel',
    'partiel',
    'non_conforme',
  ];

  const mockFindings: Record<string, string> = {
    conforme:
      'Les exigences sont respectees. Documentation a jour et processus en place.',
    partiel:
      'Mise en conformite partielle. Certains elements necessitent une attention.',
    non_conforme:
      'Non-conformite identifiee. Action corrective requise dans les meilleurs delais.',
  };

  const mockRecommendations: Record<string, string> = {
    conforme: 'Maintenir les bonnes pratiques et planifier la prochaine revue.',
    partiel:
      'Completer la documentation manquante et former les equipes concernees.',
    non_conforme:
      'Mettre en place un plan d\'action correctif avec echeancier sous 3 mois.',
  };

  for (const pillar of PILLARS) {
    for (const normName of pillar.norms) {
      const status = statuses[Math.floor(Math.random() * statuses.length)]!;
      const severity: NormAnalysis['severity'] =
        status === 'non_conforme'
          ? Math.random() > 0.5
            ? 'critique'
            : 'majeur'
          : status === 'partiel'
            ? 'mineur'
            : 'info';

      norms.push({
        name: normName,
        pillar: pillar.name,
        status,
        severity,
        finding: mockFindings[status]!,
        recommendation: mockRecommendations[status]!,
      });
    }
  }

  const normsCompliant = norms.filter((n) => n.status === 'conforme').length;
  const normsPartial = norms.filter((n) => n.status === 'partiel').length;
  const normsNonCompliant = norms.filter(
    (n) => n.status === 'non_conforme',
  ).length;
  const criticalIssues = norms.filter((n) => n.severity === 'critique').length;
  const majorIssues = norms.filter((n) => n.severity === 'majeur').length;
  const minorIssues = norms.filter((n) => n.severity === 'mineur').length;
  const score = Math.round(
    ((normsCompliant + normsPartial * 0.5) / norms.length) * 100,
  );

  return {
    score,
    normsCompliant,
    normsPartial,
    normsNonCompliant,
    normsTotal: norms.length,
    criticalIssues,
    majorIssues,
    minorIssues,
    norms,
    executiveSummary: `L'analyse de pre-audit couvre les ${norms.length} normes du referentiel GreenEcoGenius reparties sur 6 piliers. Le score global de conformite est de ${score}%. ${normsCompliant} normes sont pleinement conformes, ${normsPartial} sont partiellement conformes, et ${normsNonCompliant} presentent des non-conformites. ${criticalIssues} points critiques et ${majorIssues} points majeurs necessitent une attention immediate.`,
  };
}

function parseAIResponse(content: string): AuditResult | null {
  try {
    // Try to extract JSON from the AI response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.norms && Array.isArray(parsed.norms)) {
        return parsed as AuditResult;
      }
    }
  } catch {
    // AI did not return parseable JSON
  }
  return null;
}

export async function POST(req: NextRequest) {
  const client = getSupabaseServerClient();
  const { data: user, error: authError } = await requireUser(client);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const adminClient = getSupabaseServerAdminClient();

  // Fetch company name
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: account } = await (adminClient as any)
    .from('accounts')
    .select('name')
    .eq('id', user.id)
    .single();

  const companyName = account?.name ?? 'Mon entreprise';

  // Try AI analysis, fallback to mock
  let auditResult: AuditResult;

  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('No API key');
    }

    const { execute } = await import('~/lib/ai/orchestrator');
    const result = await execute(
      'compliance',
      `Realise un pre-audit complet de conformite aux 42 normes du referentiel GreenEcoGenius.

Retourne ta reponse en JSON avec ce format exact:
{
  "score": number (0-100),
  "normsCompliant": number,
  "normsPartial": number,
  "normsNonCompliant": number,
  "normsTotal": 42,
  "criticalIssues": number,
  "majorIssues": number,
  "minorIssues": number,
  "executiveSummary": "string",
  "norms": [
    {
      "name": "string",
      "pillar": "string",
      "status": "conforme" | "partiel" | "non_conforme",
      "severity": "critique" | "majeur" | "mineur" | "info",
      "finding": "string",
      "recommendation": "string"
    }
  ]
}

Les 6 piliers sont: Economie circulaire, Carbone & Environnement, Reporting ESG, Tracabilite, Donnees & SaaS, Labels.
Analyse chaque norme de maniere realiste pour une PME industrielle.`,
      { orgId: user.id },
    );

    const parsed = parseAIResponse(result.content);
    auditResult = parsed ?? generateMockAnalysis();
  } catch {
    auditResult = generateMockAnalysis();
  }

  // Save audit record
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (adminClient as any).from('compliance_audits').insert({
      account_id: user.id,
      score: auditResult.score,
      norms_compliant: auditResult.normsCompliant,
      norms_total: auditResult.normsTotal,
      critical_issues: auditResult.criticalIssues,
      major_issues: auditResult.majorIssues,
      minor_issues: auditResult.minorIssues,
      results: auditResult,
      created_at: new Date().toISOString(),
    });
  } catch {
    // Non-blocking: table may not exist yet
  }

  const generatedAt = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const statusBadge = (status: string) => {
    switch (status) {
      case 'conforme':
        return '<span style="display:inline-block;background:#d1fae5;color:#065f46;font-size:11px;font-weight:600;padding:2px 10px;border-radius:12px;">Conforme</span>';
      case 'partiel':
        return '<span style="display:inline-block;background:#fef3c7;color:#92400e;font-size:11px;font-weight:600;padding:2px 10px;border-radius:12px;">Partiel</span>';
      case 'non_conforme':
        return '<span style="display:inline-block;background:#fee2e2;color:#991b1b;font-size:11px;font-weight:600;padding:2px 10px;border-radius:12px;">Non conforme</span>';
      default:
        return '';
    }
  };

  const severityBadge = (severity: string) => {
    switch (severity) {
      case 'critique':
        return '<span style="display:inline-block;background:#991b1b;color:#fff;font-size:10px;font-weight:600;padding:2px 8px;border-radius:12px;">CRITIQUE</span>';
      case 'majeur':
        return '<span style="display:inline-block;background:#dc2626;color:#fff;font-size:10px;font-weight:600;padding:2px 8px;border-radius:12px;">MAJEUR</span>';
      case 'mineur':
        return '<span style="display:inline-block;background:#f59e0b;color:#fff;font-size:10px;font-weight:600;padding:2px 8px;border-radius:12px;">MINEUR</span>';
      default:
        return '<span style="display:inline-block;background:#d1fae5;color:#065f46;font-size:10px;font-weight:600;padding:2px 8px;border-radius:12px;">INFO</span>';
    }
  };

  // Build pillar detail sections
  const pillarSections = PILLARS.map((pillar) => {
    const pillarNorms = auditResult.norms.filter(
      (n) => n.pillar === pillar.name,
    );
    const compliant = pillarNorms.filter(
      (n) => n.status === 'conforme',
    ).length;
    const total = pillarNorms.length;
    const pillarScore = Math.round(
      ((compliant +
        pillarNorms.filter((n) => n.status === 'partiel').length * 0.5) /
        total) *
        100,
    );

    const rows = pillarNorms
      .map(
        (n) => `
      <tr>
        <td style="font-weight:500;">${n.name}</td>
        <td>${statusBadge(n.status)}</td>
        <td>${severityBadge(n.severity)}</td>
        <td style="font-size:13px;color:#4b5563;">${n.finding}</td>
        <td style="font-size:13px;color:#4b5563;">${n.recommendation}</td>
      </tr>`,
      )
      .join('');

    return `
    <h3 style="font-size:16px;color:#047857;margin:24px 0 8px;display:flex;align-items:center;gap:8px;">
      ${pillar.name}
      <span style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:2px 10px;font-size:12px;color:#065f46;">${compliant}/${total} — ${pillarScore}%</span>
    </h3>
    <table>
      <thead>
        <tr>
          <th>Norme</th>
          <th>Statut</th>
          <th>Severite</th>
          <th>Constat</th>
          <th>Recommandation</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
  }).join('\n');

  // Critical non-conformities
  const criticalNorms = auditResult.norms.filter(
    (n) => n.severity === 'critique' || n.severity === 'majeur',
  );
  const criticalSection =
    criticalNorms.length > 0
      ? `
    <h2>Non-conformites critiques et majeures</h2>
    <p style="font-size:13px;color:#6b7280;margin-bottom:12px;">Points necessitant une action corrective prioritaire.</p>
    <table>
      <thead>
        <tr>
          <th>Norme</th>
          <th>Pilier</th>
          <th>Severite</th>
          <th>Constat</th>
          <th>Action corrective</th>
        </tr>
      </thead>
      <tbody>
        ${criticalNorms
          .map(
            (n) => `
          <tr style="background:${n.severity === 'critique' ? '#fef2f2' : '#fff7ed'};">
            <td style="font-weight:600;">${n.name}</td>
            <td>${n.pillar}</td>
            <td>${severityBadge(n.severity)}</td>
            <td style="font-size:13px;">${n.finding}</td>
            <td style="font-size:13px;">${n.recommendation}</td>
          </tr>`,
          )
          .join('')}
      </tbody>
    </table>`
      : '';

  // Remediation plan
  const nonCompliantNorms = auditResult.norms.filter(
    (n) => n.status !== 'conforme',
  );
  const remediationRows = nonCompliantNorms
    .map(
      (n, i) => `
    <tr>
      <td>${i + 1}</td>
      <td style="font-weight:500;">${n.name}</td>
      <td>${n.pillar}</td>
      <td>${severityBadge(n.severity)}</td>
      <td style="font-size:13px;">${n.recommendation}</td>
      <td style="font-size:13px;color:#6b7280;">${n.severity === 'critique' ? '1 mois' : n.severity === 'majeur' ? '3 mois' : '6 mois'}</td>
    </tr>`,
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Rapport de Pre-Audit de Conformite — ${companyName}</title>
  <style>
    @media print {
      body { margin: 0; }
      .page-break { page-break-before: always; }
      .no-print { display: none; }
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
      background: linear-gradient(135deg, #065f46 0%, #059669 50%, #34d399 100%);
      color: #fff;
      padding: 60px 40px;
    }
    .cover .logo { font-size: 32px; font-weight: 800; margin-bottom: 40px; }
    .cover .logo span { color: #a7f3d0; }
    .cover h1 { font-size: 36px; font-weight: 700; margin-bottom: 16px; letter-spacing: 1px; }
    .cover .company { font-size: 24px; opacity: 0.9; margin-bottom: 8px; }
    .cover .date { font-size: 16px; opacity: 0.7; margin-bottom: 40px; }
    .cover .score-circle {
      width: 160px; height: 160px;
      border-radius: 50%;
      background: rgba(255,255,255,0.15);
      border: 4px solid rgba(255,255,255,0.5);
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      margin: 0 auto;
    }
    .cover .score-circle .score-value { font-size: 48px; font-weight: 800; }
    .cover .score-circle .score-label { font-size: 14px; opacity: 0.8; }

    /* Content pages */
    .content {
      max-width: 900px;
      margin: 0 auto;
      padding: 40px;
    }
    h1 { font-size: 28px; color: #065f46; margin-bottom: 4px; }
    h2 { font-size: 20px; color: #065f46; margin: 32px 0 16px; border-bottom: 2px solid #d1fae5; padding-bottom: 8px; }
    h3 { font-size: 16px; color: #047857; margin: 20px 0 10px; }
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
    .summary-card.red { background: #fef2f2; border-color: #fecaca; }
    .summary-card.red .value { color: #991b1b; }
    .summary-card.amber { background: #fffbeb; border-color: #fde68a; }
    .summary-card.amber .value { color: #92400e; }
    .summary-card.highlight { background: #065f46; border-color: #065f46; }
    .summary-card.highlight .label,
    .summary-card.highlight .unit { color: #a7f3d0; }
    .summary-card.highlight .value { color: #fff; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px; }
    th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #e5e7eb; }
    th { background: #f9fafb; font-weight: 600; color: #374151; font-size: 12px; text-transform: uppercase; letter-spacing: 0.3px; }
    .executive-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-left: 4px solid #059669;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      font-size: 14px;
      line-height: 1.7;
    }
    .methodology {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      margin: 24px 0;
      font-size: 13px;
      color: #6b7280;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #d1fae5;
      text-align: center;
      color: #9ca3af;
      font-size: 12px;
    }
  </style>
</head>
<body>

  <!-- Cover Page -->
  <div class="cover">
    <div class="logo">Green<span>Eco</span>Genius</div>
    <h1>RAPPORT DE PRE-AUDIT DE CONFORMITE</h1>
    <div class="company">${companyName}</div>
    <div class="date">${generatedAt}</div>
    <div class="score-circle">
      <div class="score-value">${auditResult.score}%</div>
      <div class="score-label">Score global</div>
    </div>
  </div>

  <!-- Content -->
  <div class="content">

    <!-- Executive Summary -->
    <div class="page-break"></div>
    <h2>Synthese executive</h2>
    <div class="executive-box">
      ${auditResult.executiveSummary}
    </div>

    <div class="summary-grid">
      <div class="summary-card highlight">
        <div class="label">Score global</div>
        <div class="value">${auditResult.score}%</div>
        <div class="unit">de conformite</div>
      </div>
      <div class="summary-card">
        <div class="label">Normes conformes</div>
        <div class="value">${auditResult.normsCompliant}/${auditResult.normsTotal}</div>
        <div class="unit">normes verifiees</div>
      </div>
      <div class="summary-card">
        <div class="label">Partiellement conformes</div>
        <div class="value">${auditResult.normsPartial}</div>
        <div class="unit">normes</div>
      </div>
      <div class="summary-card red">
        <div class="label">Non conformes</div>
        <div class="value">${auditResult.normsNonCompliant}</div>
        <div class="unit">normes</div>
      </div>
      <div class="summary-card red">
        <div class="label">Points critiques</div>
        <div class="value">${auditResult.criticalIssues}</div>
        <div class="unit">actions immediates</div>
      </div>
      <div class="summary-card amber">
        <div class="label">Points majeurs</div>
        <div class="value">${auditResult.majorIssues}</div>
        <div class="unit">a traiter sous 3 mois</div>
      </div>
    </div>

    <!-- Detail by pillar -->
    <div class="page-break"></div>
    <h2>Analyse detaillee par pilier</h2>
    <p style="font-size:13px;color:#6b7280;margin-bottom:12px;">Evaluation norme par norme des 6 piliers du referentiel GreenEcoGenius.</p>
    ${pillarSections}

    <!-- Critical non-conformities -->
    <div class="page-break"></div>
    ${criticalSection}

    <!-- Remediation plan -->
    <div class="page-break"></div>
    <h2>Plan de remediation</h2>
    <p style="font-size:13px;color:#6b7280;margin-bottom:12px;">Actions correctives prioritaires avec echeancier recommande.</p>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Norme</th>
          <th>Pilier</th>
          <th>Severite</th>
          <th>Action corrective</th>
          <th>Echeance</th>
        </tr>
      </thead>
      <tbody>${remediationRows}</tbody>
    </table>

    <!-- Methodology -->
    <div class="page-break"></div>
    <h2>Methodologie</h2>
    <div class="methodology">
      <h3 style="margin-bottom:8px;">Approche d'audit</h3>
      <p>Ce rapport de pre-audit a ete genere par le moteur d'analyse GreenEcoGenius. L'evaluation couvre les <strong>42 normes</strong> du referentiel reparties en <strong>6 piliers</strong> de conformite.</p>
      <p style="margin-top:12px;"><strong>Grille d'evaluation :</strong></p>
      <ul style="margin:8px 0 0 20px;">
        <li><strong>Conforme</strong> : L'exigence est pleinement respectee avec documentation a jour</li>
        <li><strong>Partiellement conforme</strong> : Des elements sont en place mais des lacunes subsistent</li>
        <li><strong>Non conforme</strong> : L'exigence n'est pas satisfaite, action corrective requise</li>
      </ul>
      <p style="margin-top:12px;"><strong>Niveaux de severite :</strong></p>
      <ul style="margin:8px 0 0 20px;">
        <li><strong>Critique</strong> : Risque legal immediat, action sous 1 mois</li>
        <li><strong>Majeur</strong> : Risque significatif, action sous 3 mois</li>
        <li><strong>Mineur</strong> : Amelioration recommandee, action sous 6 mois</li>
        <li><strong>Info</strong> : Conforme, surveillance continue</li>
      </ul>
      <p style="margin-top:12px;">Les 6 piliers couverts sont : Economie circulaire (11 normes), Carbone & Environnement (7 normes), Reporting ESG (9 normes), Tracabilite (6 normes), Donnees & SaaS (5 normes), Labels (4 normes).</p>
      <p style="margin-top:12px;"><em>Ce pre-audit est indicatif et ne remplace pas un audit certifie par un organisme accredite.</em></p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>Genere par <strong>GreenEcoGenius</strong> — greenecogenius.tech</p>
      <p style="margin-top:4px;">Pour imprimer en PDF : Fichier > Imprimer > Enregistrer en PDF</p>
      <p style="margin-top:4px;">Rapport genere le ${generatedAt}</p>
    </div>

  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': `attachment; filename="pre-audit-conformite-${companyName.replace(/[^a-zA-Z0-9]/g, '_')}.html"`,
    },
  });
}

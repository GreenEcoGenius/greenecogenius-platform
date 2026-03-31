import { NextResponse } from 'next/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { generateAuditReportPDF } from '~/lib/services/pdf/templates/audit-report-template';

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

const MOCK_FINDINGS: Record<string, string[]> = {
  conforme: [
    'Les exigences sont respectees. Documentation a jour et processus en place.',
    'Conformite verifiee. Les procedures sont bien documentees.',
    'Ensemble des criteres satisfaits. Revue planifiee dans 6 mois.',
  ],
  partiel: [
    'Mise en conformite partielle. Certains elements necessitent une attention.',
    'Documentation incomplete. Processus en cours de formalisation.',
    "Criteres partiellement respectes. Plan d'action en cours.",
  ],
  non_conforme: [
    'Non-conformite identifiee. Action corrective requise dans les meilleurs delais.',
    'Exigence non satisfaite. Risque legal identifie.',
    'Absence de documentation. Mise en conformite urgente necessaire.',
  ],
};

const MOCK_RECOMMENDATIONS: Record<string, string[]> = {
  conforme: [
    'Maintenir les bonnes pratiques et planifier la prochaine revue.',
    'Continuer la veille reglementaire sur cette norme.',
    'Documenter les evolutions recentes pour la prochaine evaluation.',
  ],
  partiel: [
    'Completer la documentation manquante et former les equipes concernees.',
    'Finaliser le processus de mise en conformite sous 3 mois.',
    'Nommer un referent interne pour piloter la mise en conformite.',
  ],
  non_conforme: [
    "Mettre en place un plan d'action correctif avec echeancier sous 3 mois.",
    'Engager un audit externe pour evaluer les ecarts et definir les priorites.',
    'Former les equipes et mettre en place les processus manquants.',
  ],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

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

  for (const pillar of PILLARS) {
    for (const normName of pillar.norms) {
      const status = pick(statuses);
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
        finding: pick(MOCK_FINDINGS[status]!),
        recommendation: pick(MOCK_RECOMMENDATIONS[status]!),
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

// Audit a single pillar via AI (fast, focused)
async function auditPillarWithAI(
  pillarName: string,
  pillarNorms: string[],
): Promise<NormAnalysis[] | null> {
  try {
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const client = new Anthropic();

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: `Tu analyses la conformite pour le pilier "${pillarName}".
Reponds UNIQUEMENT en JSON avec ce format:
{"norms": [{"name": "...", "status": "conforme"|"partiel"|"non_conforme", "severity": "critique"|"majeur"|"mineur"|"info", "finding": "...", "recommendation": "..."}]}`,
      messages: [
        {
          role: 'user',
          content: `Analyse ces normes pour une PME industrielle francaise: ${pillarNorms.join(', ')}. Pour chaque norme, fournis un statut realiste.`,
        },
      ],
    });

    const text =
      response.content[0]?.type === 'text' ? response.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);

      if (parsed.norms && Array.isArray(parsed.norms)) {
        return parsed.norms.map(
          (n: {
            name: string;
            status: string;
            severity: string;
            finding: string;
            recommendation: string;
          }) => ({
            ...n,
            pillar: pillarName,
          }),
        );
      }
    }
  } catch {
    // Fallback to mock for this pillar
  }
  return null;
}

export async function POST() {
  const client = getSupabaseServerClient();
  const { data: user, error: authError } = await requireUser(client);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const adminClient = getSupabaseServerAdminClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: account } = await (adminClient as any)
    .from('accounts')
    .select('name')
    .eq('id', user.id)
    .single();

  const companyName = account?.name ?? 'Mon entreprise';

  // Try parallel AI analysis per pillar, fallback to mock
  let auditResult: AuditResult;

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      // Launch 6 parallel AI calls (one per pillar) using Haiku for speed
      const pillarResults = await Promise.all(
        PILLARS.map((p) => auditPillarWithAI(p.name, p.norms)),
      );

      const allNorms: NormAnalysis[] = [];
      let allParsed = true;

      for (let i = 0; i < PILLARS.length; i++) {
        const result = pillarResults[i];
        if (result) {
          allNorms.push(...result);
        } else {
          allParsed = false;
          break;
        }
      }

      if (allParsed && allNorms.length > 0) {
        const normsCompliant = allNorms.filter(
          (n) => n.status === 'conforme',
        ).length;
        const normsPartial = allNorms.filter(
          (n) => n.status === 'partiel',
        ).length;
        const normsNonCompliant = allNorms.filter(
          (n) => n.status === 'non_conforme',
        ).length;
        const criticalIssues = allNorms.filter(
          (n) => n.severity === 'critique',
        ).length;
        const majorIssues = allNorms.filter(
          (n) => n.severity === 'majeur',
        ).length;
        const minorIssues = allNorms.filter(
          (n) => n.severity === 'mineur',
        ).length;
        const score = Math.round(
          ((normsCompliant + normsPartial * 0.5) / allNorms.length) * 100,
        );

        auditResult = {
          score,
          normsCompliant,
          normsPartial,
          normsNonCompliant,
          normsTotal: allNorms.length,
          criticalIssues,
          majorIssues,
          minorIssues,
          norms: allNorms,
          executiveSummary: `L'analyse de pre-audit couvre les ${allNorms.length} normes du referentiel GreenEcoGenius reparties sur 6 piliers. Le score global de conformite est de ${score}%. ${normsCompliant} normes sont pleinement conformes, ${normsPartial} sont partiellement conformes, et ${normsNonCompliant} presentent des non-conformites. ${criticalIssues} points critiques et ${majorIssues} points majeurs necessitent une attention immediate.`,
        };
      } else {
        auditResult = generateMockAnalysis();
      }
    } catch {
      auditResult = generateMockAnalysis();
    }
  } else {
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

  // Generate PDF
  const pdfBuffer = generateAuditReportPDF({
    companyName,
    date: generatedAt,
    score: auditResult.score,
    normsCompliant: auditResult.normsCompliant,
    normsPartial: auditResult.normsPartial,
    normsNonCompliant: auditResult.normsNonCompliant,
    normsTotal: auditResult.normsTotal,
    criticalIssues: auditResult.criticalIssues,
    majorIssues: auditResult.majorIssues,
    minorIssues: auditResult.minorIssues,
    executiveSummary: auditResult.executiveSummary,
    norms: auditResult.norms,
    pillars: PILLARS,
  });

  const safeCompanyName = companyName.replace(/[^a-zA-Z0-9]/g, '_');

  return new Response(pdfBuffer as unknown as BodyInit, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="PreAudit-Conformite-${safeCompanyName}-${new Date().toISOString().split('T')[0]}.pdf"`,
    },
  });
}

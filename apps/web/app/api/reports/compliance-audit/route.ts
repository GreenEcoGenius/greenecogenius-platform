import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

import * as z from 'zod';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { DEMO_DATA } from '~/lib/demo/demo-data';
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

const PILLARS = DEMO_DATA.compliance.pillars.map(({ name, norms }) => ({
  name,
  norms,
}));

// TODO: replace with real audit data — generic finding templates not in centralized demo-data
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

// TODO: replace with real audit data
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

  for (const pillar of DEMO_DATA.compliance.pillars) {
    const { name: pillarName, norms: normList, compliant } = pillar;
    const total = normList.length;
    const nonCompliantCount = total - compliant;
    const partialCount = Math.ceil(nonCompliantCount / 2);

    normList.forEach((normName, idx) => {
      let status: 'conforme' | 'partiel' | 'non_conforme';
      let severity: NormAnalysis['severity'];

      if (idx < compliant) {
        status = 'conforme';
        severity = 'info';
      } else {
        const r = idx - compliant;
        if (r < partialCount) {
          status = 'partiel';
          severity = 'mineur';
        } else {
          status = 'non_conforme';
          severity = r % 2 === 0 ? 'critique' : 'majeur';
        }
      }

      norms.push({
        name: normName,
        pillar: pillarName,
        status,
        severity,
        finding: pick(MOCK_FINDINGS[status]!),
        recommendation: pick(MOCK_RECOMMENDATIONS[status]!),
      });
    });
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

const AINormSchema = z.object({
  name: z.string(),
  status: z.enum(['conforme', 'partiel', 'non_conforme']),
  severity: z.enum(['critique', 'majeur', 'mineur', 'info']),
  finding: z.string(),
  recommendation: z.string(),
});

const AIResponseSchema = z.object({
  norms: z.array(AINormSchema),
});

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
      const result = AIResponseSchema.safeParse(parsed);

      if (result.success) {
        return result.data.norms.map((n) => ({
          ...n,
          pillar: pillarName,
        }));
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

  const { data: account } = await adminClient
    .from('accounts')
    .select('name')
    .eq('id', user.id)
    .single();

  const locale = (await cookies()).get('NEXT_LOCALE')?.value ?? 'en';
  const isFr = locale === 'fr';
  const companyName = account?.name ?? (isFr ? 'Mon entreprise' : 'My company');

  // Try to load real compliance data from database first
  let auditResult: AuditResult;

  const { data: realCompliance } = await adminClient
    .from('account_norm_compliance')
    .select('norm_id, status')
    .eq('account_id', user.id);

  if (realCompliance && realCompliance.length > 0) {
    // Use real data from database
    const norms: NormAnalysis[] = [];

    for (const pillar of PILLARS) {
      for (const normName of pillar.norms) {
        const match = realCompliance.find(
          (r: { norm_id: string }) => r.norm_id === normName || normName.includes(r.norm_id),
        );
        const dbStatus = match?.status ?? 'not_evaluated';

        let status: NormAnalysis['status'];
        let severity: NormAnalysis['severity'];

        if (dbStatus === 'compliant') {
          status = 'conforme';
          severity = 'info';
        } else if (dbStatus === 'partial') {
          status = 'partiel';
          severity = 'mineur';
        } else if (dbStatus === 'non_compliant') {
          status = 'non_conforme';
          severity = 'majeur';
        } else {
          // not_evaluated = non conforme (no data yet)
          status = 'non_conforme';
          severity = 'mineur';
        }

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
    const normsNonCompliant = norms.filter((n) => n.status === 'non_conforme').length;
    const criticalIssues = norms.filter((n) => n.severity === 'critique').length;
    const majorIssues = norms.filter((n) => n.severity === 'majeur').length;
    const minorIssues = norms.filter((n) => n.severity === 'mineur').length;
    const score = Math.round(((normsCompliant + normsPartial * 0.5) / norms.length) * 100);

    auditResult = {
      score,
      normsCompliant,
      normsPartial,
      normsNonCompliant,
      normsTotal: norms.length,
      criticalIssues,
      majorIssues,
      minorIssues,
      norms,
      executiveSummary: isFr
        ? `L'analyse de pre-audit couvre les ${norms.length} normes du referentiel GreenEcoGenius reparties sur 6 piliers. Le score global de conformite est de ${score}%. ${normsCompliant} normes sont pleinement conformes, ${normsPartial} sont partiellement conformes, et ${normsNonCompliant} presentent des non-conformites. ${criticalIssues} points critiques et ${majorIssues} points majeurs necessitent une attention immediate.`
        : `The pre-audit analysis covers ${norms.length} standards from the GreenEcoGenius framework across 6 pillars. The overall compliance score is ${score}%. ${normsCompliant} standards are fully compliant, ${normsPartial} are partially compliant, and ${normsNonCompliant} have non-compliances. ${criticalIssues} critical issues and ${majorIssues} major issues require immediate attention.`,
    };
  } else if (process.env.ANTHROPIC_API_KEY) {
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
          executiveSummary: isFr
            ? `L'analyse de pre-audit couvre les ${allNorms.length} normes du referentiel GreenEcoGenius reparties sur 6 piliers. Le score global de conformite est de ${score}%. ${normsCompliant} normes sont pleinement conformes, ${normsPartial} sont partiellement conformes, et ${normsNonCompliant} presentent des non-conformites. ${criticalIssues} points critiques et ${majorIssues} points majeurs necessitent une attention immediate.`
            : `The pre-audit analysis covers ${allNorms.length} standards from the GreenEcoGenius framework across 6 pillars. The overall compliance score is ${score}%. ${normsCompliant} standards are fully compliant, ${normsPartial} are partially compliant, and ${normsNonCompliant} have non-compliances. ${criticalIssues} critical issues and ${majorIssues} major issues require immediate attention.`,
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
    // 
    await adminClient.from('compliance_audits').insert({
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

  const generatedAt = new Date().toLocaleDateString(isFr ? 'fr-FR' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Generate PDF
  const pdfBuffer = generateAuditReportPDF(
    {
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
    },
    locale,
  );

  const safeCompanyName = companyName.replace(/[^a-zA-Z0-9]/g, '_');

  return new Response(pdfBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${isFr ? 'PreAudit-Conformite' : 'Compliance-PreAudit'}-${safeCompanyName}-${new Date().toISOString().split('T')[0]}.pdf"`,
    },
  });
}

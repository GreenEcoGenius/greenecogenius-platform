import { NextRequest, NextResponse } from 'next/server';

import * as z from 'zod';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { generateRSEDiagnosticPDF } from '~/lib/services/pdf/templates/rse-diagnostic-template';

const DiagnosticSchema = z.object({
  scores: z.object({
    governance: z.number(),
    environment: z.number(),
    social: z.number(),
    ethics: z.number(),
    stakeholders: z.number(),
    total: z.number(),
    level: z.string(),
  }),
  labels: z.array(
    z.object({
      name: z.string(),
      threshold: z.number(),
    }),
  ),
  strengths: z.array(
    z.object({
      name: z.string(),
      score: z.number(),
      max: z.number(),
    }),
  ),
  improvements: z.array(
    z.object({
      name: z.string(),
      score: z.number(),
      max: z.number(),
    }),
  ),
});

export async function POST(req: NextRequest) {
  const client = getSupabaseServerClient();
  const { data: user, error: authError } = await requireUser(client);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = DiagnosticSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { scores, labels, strengths, improvements } = parsed.data;

  const adminClient = getSupabaseServerAdminClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: account } = await (adminClient as any)
    .from('accounts')
    .select('name')
    .eq('id', user.id)
    .single();

  const companyName = account?.name ?? 'Mon entreprise';
  const date = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const pillarScores = [
    { name: 'Gouvernance', score: scores.governance, max: 20 },
    { name: 'Environnement', score: scores.environment, max: 30 },
    { name: 'Social', score: scores.social, max: 20 },
    { name: 'Ethique', score: scores.ethics, max: 20 },
    { name: 'Parties prenantes', score: scores.stakeholders, max: 20 },
  ];

  const labelEligibility = labels.map((l) => ({
    name: l.name,
    eligible: scores.total >= l.threshold,
    score: scores.total,
    threshold: l.threshold,
  }));

  const roadmapActions = improvements.map((imp) => ({
    action: `Ameliorer le pilier ${imp.name} (score actuel: ${imp.score}/${imp.max})`,
    priority: (imp.score / imp.max < 0.4
      ? 'haute'
      : imp.score / imp.max < 0.7
        ? 'moyenne'
        : 'basse') as 'haute' | 'moyenne' | 'basse',
    timeline:
      imp.score / imp.max < 0.4
        ? '3 mois'
        : imp.score / imp.max < 0.7
          ? '6 mois'
          : '12 mois',
  }));

  const pdfBuffer = generateRSEDiagnosticPDF({
    companyName,
    date,
    globalScore: scores.total,
    pillarScores: pillarScores.map((p) => ({
      name: p.name,
      score: Math.round((p.score / p.max) * 100),
      details: `${p.score}/${p.max} points`,
    })),
    strengths: strengths.map(
      (s) =>
        `${s.name} : ${s.score}/${s.max} points (${Math.round((s.score / s.max) * 100)}%)`,
    ),
    improvements: improvements.map(
      (i) =>
        `${i.name} : ${i.score}/${i.max} points (${Math.round((i.score / i.max) * 100)}%)`,
    ),
    labelEligibility,
    roadmapActions,
  });

  const safeCompanyName = companyName.replace(/[^a-zA-Z0-9]/g, '_');

  return new Response(pdfBuffer as unknown as BodyInit, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Diagnostic-RSE-${safeCompanyName}-${new Date().toISOString().split('T')[0]}.pdf"`,
    },
  });
}

import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import * as z from 'zod';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { generateRSEDiagnosticPDF } from '~/lib/services/pdf/templates/rse-diagnostic-template';

const DiagnosticSchema = z.object({
  scores: z.object({
    governance: z.number().min(0).max(20),
    environment: z.number().min(0).max(30),
    social: z.number().min(0).max(20),
    ethics: z.number().min(0).max(20),
    stakeholders: z.number().min(0).max(20),
    total: z.number().min(0).max(100),
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

  const locale = (await cookies()).get('NEXT_LOCALE')?.value ?? 'en';
  const isFr = locale === 'fr';
  const companyName = account?.name ?? (isFr ? 'Mon entreprise' : 'My company');
  const date = new Date().toLocaleDateString(isFr ? 'fr-FR' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const pillarScores = isFr
    ? [
        { name: 'Gouvernance', score: scores.governance, max: 20 },
        { name: 'Environnement', score: scores.environment, max: 30 },
        { name: 'Social', score: scores.social, max: 20 },
        { name: 'Ethique', score: scores.ethics, max: 20 },
        { name: 'Parties prenantes', score: scores.stakeholders, max: 20 },
      ]
    : [
        { name: 'Governance', score: scores.governance, max: 20 },
        { name: 'Environment', score: scores.environment, max: 30 },
        { name: 'Social', score: scores.social, max: 20 },
        { name: 'Ethics', score: scores.ethics, max: 20 },
        { name: 'Stakeholders', score: scores.stakeholders, max: 20 },
      ];

  const labelEligibility = labels.map((l) => ({
    name: l.name,
    eligible: scores.total >= l.threshold,
    score: scores.total,
    threshold: l.threshold,
  }));

  const roadmapActions = improvements.map((imp) => ({
    action: isFr
      ? `Ameliorer le pilier ${imp.name} (score actuel: ${imp.score}/${imp.max})`
      : `Improve ${imp.name} pillar (current score: ${imp.score}/${imp.max})`,
    priority: (imp.score / imp.max < 0.4
      ? 'haute'
      : imp.score / imp.max < 0.7
        ? 'moyenne'
        : 'basse') as 'haute' | 'moyenne' | 'basse',
    timeline:
      imp.score / imp.max < 0.4
        ? isFr
          ? '3 mois'
          : '3 months'
        : imp.score / imp.max < 0.7
          ? isFr
            ? '6 mois'
            : '6 months'
          : isFr
            ? '12 mois'
            : '12 months',
  }));

  const pdfBuffer = generateRSEDiagnosticPDF(
    {
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
    },
    locale,
  );

  const safeCompanyName = companyName.replace(/[^a-zA-Z0-9]/g, '_');

  return new Response(pdfBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Diagnostic-RSE-${safeCompanyName}-${new Date().toISOString().split('T')[0]}.pdf"`,
    },
  });
}

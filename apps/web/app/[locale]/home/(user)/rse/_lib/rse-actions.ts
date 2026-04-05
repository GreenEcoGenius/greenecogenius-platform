'use server';

import { revalidatePath } from 'next/cache';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { calculateRSEScore } from '~/lib/services/rse-score-service';

export async function saveDiagnostic(answers: Record<string, number | string>) {
  const client = getSupabaseServerClient();
  const user = await requireUser(client);
  const userId = user.data?.id;
  if (!userId) throw new Error('Not authenticated');

  const result = calculateRSEScore(answers);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = client as any;

  const existing = await c
    .from('rse_diagnostics')
    .select('id')
    .eq('account_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (existing.data?.id) {
    await c
      .from('rse_diagnostics')
      .update({
        answers,
        pillar_scores: result.pillarScores,
        global_score: result.globalScore,
        action_plan: result.actionPlan,
        completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.data.id);
  } else {
    await c.from('rse_diagnostics').insert({
      account_id: userId,
      answers,
      pillar_scores: result.pillarScores,
      global_score: result.globalScore,
      action_plan: result.actionPlan,
      completed: true,
    });
  }

  revalidatePath('/home/rse');
  return result;
}

export async function loadLatestDiagnostic() {
  const client = getSupabaseServerClient();
  const user = await requireUser(client);
  const userId = user.data?.id;
  if (!userId) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (client as any)
    .from('rse_diagnostics')
    .select('*')
    .eq('account_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return data as {
    id: string;
    answers: Record<string, number | string>;
    pillar_scores: unknown;
    global_score: number;
    action_plan: unknown;
    completed: boolean;
    created_at: string;
    updated_at: string;
  } | null;
}

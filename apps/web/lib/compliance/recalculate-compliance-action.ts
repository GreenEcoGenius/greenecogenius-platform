'use server';

import { revalidatePath } from 'next/cache';

import { authActionClient } from '@kit/next/safe-action';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

import { evaluateAccountCompliance } from './compliance-engine';

export const recalculateComplianceAction = authActionClient.action(
  async ({ ctx: { user } }) => {
    const adminClient = getSupabaseServerAdminClient();

    const { results, score } = await evaluateAccountCompliance(
      adminClient,
      user.id,
    );

    const compliant = results.filter((r) => r.status === 'compliant').length;
    const partial = results.filter((r) => r.status === 'partial').length;

    revalidatePath('/home/compliance');
    revalidatePath('/home/carbon');
    revalidatePath('/home/esg');
    revalidatePath('/home/rse');
    revalidatePath('/home');

    return {
      score,
      total: results.length,
      compliant,
      partial,
      nonCompliant: results.filter((r) => r.status === 'non_compliant').length,
      notEvaluated: results.filter((r) => r.status === 'not_evaluated').length,
    };
  },
);

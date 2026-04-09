import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';

type Plan = 'essentiel' | 'avance' | 'enterprise';

const FLUX_MONTHLY_LIMITS: Record<Plan, number> = {
  essentiel: 0,
  avance: 5,
  enterprise: -1, // unlimited
};

/**
 * Resolve the current user's plan name from their active subscription.
 * Falls back to 'essentiel' when no subscription row exists.
 */
export async function getUserPlan(
  client: SupabaseClient,
  userId: string,
): Promise<Plan> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: sub } = await (client as any)
    .from('organization_subscriptions')
    .select('subscription_plans(name)')
    .eq('account_id', userId)
    .in('status', ['active', 'trialing', 'past_due'])
    .single();

  const name = sub?.subscription_plans?.name as Plan | undefined;
  return name ?? 'essentiel';
}

/**
 * Count how many Flux images the user generated this calendar month.
 * Uses the `flux_generations` table (created via migration).
 */
async function getMonthlyGenerationCount(
  client: SupabaseClient,
  userId: string,
): Promise<number> {
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count } = await (client as any)
    .from('flux_generations')
    .select('id', { count: 'exact', head: true })
    .eq('account_id', userId)
    .gte('created_at', firstOfMonth);

  return count ?? 0;
}

/**
 * Check whether the user is allowed to generate another Flux image.
 */
export async function canGenerateImage(
  client: SupabaseClient,
  userId: string,
): Promise<{ allowed: boolean; remaining: number; plan: Plan }> {
  const plan = await getUserPlan(client, userId);
  const limit = FLUX_MONTHLY_LIMITS[plan];

  if (limit === -1) {
    return { allowed: true, remaining: -1, plan };
  }

  if (limit === 0) {
    return { allowed: false, remaining: 0, plan };
  }

  const used = await getMonthlyGenerationCount(client, userId);
  const remaining = Math.max(0, limit - used);
  return { allowed: remaining > 0, remaining, plan };
}

/**
 * Record a Flux generation for usage tracking.
 */
export async function recordGeneration(
  client: SupabaseClient,
  userId: string,
  context: string,
  contextId: string,
  storagePath: string,
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (client as any).from('flux_generations').insert({
    account_id: userId,
    context,
    context_id: contextId,
    storage_path: storagePath,
  });
}

import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';

import { evaluateAccountCompliance } from './compliance-engine';

/**
 * Cascade Engine — propagates the effects of user actions across the platform.
 *
 * When a user performs an action in one section, this engine:
 * 1. Identifies which compliance norms are affected
 * 2. Re-evaluates those norms based on current data
 * 3. Updates the global compliance score
 *
 * Usage: call `triggerCascade()` after any significant user action.
 */

export type CascadeSource =
  | 'comptoir'
  | 'carbon'
  | 'esg'
  | 'traceability'
  | 'rse'
  | 'compliance';

export interface CascadeEvent {
  source: CascadeSource;
  action: string;
  accountId: string;
}

/**
 * Process a cascade event — re-evaluates all compliance norms.
 *
 * For now this does a full re-evaluation (42 norms).
 * Future optimization: only re-evaluate norms affected by the source section.
 */
export async function triggerCascade(
  adminClient: SupabaseClient,
  event: CascadeEvent,
): Promise<{ score: number }> {
  // Full re-evaluation of all 42 norms
  const { score } = await evaluateAccountCompliance(
    adminClient,
    event.accountId,
  );

  return { score };
}

/**
 * Get the list of norm IDs affected by a given source section.
 * Used for targeted re-evaluation in the future.
 */
export function getAffectedNorms(source: CascadeSource): string[] {
  switch (source) {
    case 'comptoir':
      return [
        'iso-59004', 'iso-59010', 'iso-59014', 'iso-59020',
        'iso-14001', 'loi-agec', 'decret-9-flux', 'rep-elargie',
        'ppwr', 'taxonomie-circulaire', 'dpp',
      ];
    case 'carbon':
      return [
        'ghg-protocol', 'iso-14064', 'bilan-ges', 'sbti',
        'cdp', 'eu-ets', 'cbam',
      ];
    case 'esg':
      return [
        'csrd', 'esrs', 'gri', 'taxonomie-verte',
        'sfdr', 'devoir-vigilance', 'dpef', 'art-29-lec', 'cs3d',
      ];
    case 'traceability':
      return [
        'blockchain-polygon', 'vigilance-chaine', 'iso-22095',
        'eudr', '3tg', 'passeport-batterie',
      ];
    case 'rse':
      return [
        'b-corp', 'lucie-26000', 'engage-rse', 'numerique-responsable',
      ];
    case 'compliance':
      return [
        'rgpd', 'iso-27001', 'soc-2', 'nis2', 'ai-act',
      ];
    default:
      return [];
  }
}

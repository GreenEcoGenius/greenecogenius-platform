import { supabase } from '~/lib/supabase-client';
import type { Database } from '@kit/supabase/database';

export type OrgEsgData = Database['public']['Tables']['org_esg_data']['Row'];

/**
 * Fetch the most recent ESG data row for an account.
 * Returns null if no data has been entered yet.
 */
export async function fetchLatestEsgData(
  accountId: string,
): Promise<OrgEsgData | null> {
  const { data, error } = await supabase
    .from('org_esg_data')
    .select('*')
    .eq('account_id', accountId)
    .order('reporting_year', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data ?? null;
}

/**
 * Fetch all ESG data rows for an account (one per reporting_year).
 */
export async function fetchAllEsgData(
  accountId: string,
): Promise<OrgEsgData[]> {
  const { data, error } = await supabase
    .from('org_esg_data')
    .select('*')
    .eq('account_id', accountId)
    .order('reporting_year', { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

/**
 * Compute totals per scope from raw ESG data.
 *
 * NOTE: ces totaux sont des estimations brutes basées sur les facteurs
 * d'émission ADEME standards. Pour le calcul officiel CSRD, utiliser
 * la fonction calculateScopes côté web (avec esg_emission_factors).
 */
export interface EsgScopeTotals {
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
  hasData: boolean;
}

export function computeEsgScopeTotals(esg: OrgEsgData | null): EsgScopeTotals {
  if (!esg) {
    return { scope1: 0, scope2: 0, scope3: 0, total: 0, hasData: false };
  }

  // Scope 1 - direct emissions (gaz naturel, fuel, autres)
  const scope1NaturalGas = Number(esg.scope1_natural_gas_kwh ?? 0) * 0.184; // kgCO2e/kWh
  const scope1Fuel = Number(esg.scope1_fuel_liters ?? 0) * 2.51; // kgCO2e/L diesel moyen
  const scope1Other = Number(esg.scope1_other_kg_co2 ?? 0);
  const scope1 = scope1NaturalGas + scope1Fuel + scope1Other;

  // Scope 2 - indirect emissions (electricite, chauffage)
  const scope2Electricity = Number(esg.scope2_electricity_kwh ?? 0) * 0.057; // FR grid
  const scope2Heating = Number(esg.scope2_heating_kwh ?? 0) * 0.184;
  const scope2 = scope2Electricity + scope2Heating;

  // Scope 3 - other indirect (travel, commuting, purchases, waste)
  const scope3Travel = Number(esg.scope3_business_travel_km ?? 0) * 0.193; // car avg
  const scope3Commuting =
    Number(esg.scope3_commuting_employees ?? 0) *
    Number(esg.scope3_commuting_avg_km ?? 0) *
    220 * // jours travailles par an
    0.193;
  const scope3Purchases = Number(esg.scope3_purchased_goods_eur ?? 0) * 0.5;
  const scope3Waste = Number(esg.scope3_waste_tonnes ?? 0) * 200;
  const scope3 = scope3Travel + scope3Commuting + scope3Purchases + scope3Waste;

  const total = scope1 + scope2 + scope3;
  const hasData =
    total > 0 ||
    Number(esg.nb_employees ?? 0) > 0 ||
    Number(esg.platform_co2_avoided ?? 0) > 0;

  return { scope1, scope2, scope3, total, hasData };
}

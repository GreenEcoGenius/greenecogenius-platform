import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';

export const dynamic = 'force-dynamic';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { EXPORT_RATE_LIMIT, applyRateLimit } from '~/lib/server/rate-limit';

const RequestSchema = z.object({
  reporting_year: z.number().int().min(2000).max(2100),
});

interface EsgData {
  natural_gas_kwh: number;
  fuel_liters: number;
  fuel_type: string;
  other_kg_co2: number;
  electricity_kwh: number;
  electricity_source: string;
  heating_kwh: number;
  business_travel_km: number;
  travel_mode: string;
  commuting_employees: number;
  commuting_avg_km: number;
  purchased_goods_eur: number;
  waste_tonnes: number;
  nb_employees: number;
  platform_co2_avoided: number;
  platform_tonnes_recycled: number;
}

interface Recommendation {
  priority: number;
  category: string;
  action: string;
  description: string;
  estimated_reduction_kg: number;
  difficulty: string;
}

const FUEL_FACTORS: Record<string, number> = {
  diesel: 2.671,
  essence: 2.284,
  gpl: 1.653,
};

const ELEC_FACTORS: Record<string, number> = {
  grid_fr: 0.052,
  renewable: 0.006,
};

const TRAVEL_FACTORS: Record<string, number> = {
  car: 0.217,
  train: 0.006,
  plane: 0.255,
};

function calculateEmissions(esg: EsgData) {
  const fuelFactor = FUEL_FACTORS[esg.fuel_type] ?? 2.671;
  const elecFactor = ELEC_FACTORS[esg.electricity_source] ?? 0.052;
  const travelFactor = TRAVEL_FACTORS[esg.travel_mode] ?? 0.217;

  // Scope 1 (kg CO2)
  const scope1_natural_gas = (esg.natural_gas_kwh ?? 0) * 0.205;
  const scope1_fuel = (esg.fuel_liters ?? 0) * fuelFactor;
  const scope1_other = esg.other_kg_co2 ?? 0;
  const scope1 = scope1_natural_gas + scope1_fuel + scope1_other;

  // Scope 2 (kg CO2)
  const scope2_electricity = (esg.electricity_kwh ?? 0) * elecFactor;
  const scope2_heating = (esg.heating_kwh ?? 0) * 0.109;
  const scope2 = scope2_electricity + scope2_heating;

  // Scope 3 (kg CO2)
  const scope3_travel = (esg.business_travel_km ?? 0) * travelFactor;
  const scope3_commuting =
    (esg.commuting_employees ?? 0) *
    (esg.commuting_avg_km ?? 0) *
    2 *
    220 *
    0.217;
  const scope3_goods = (esg.purchased_goods_eur ?? 0) * 0.43;
  const scope3_waste = (esg.waste_tonnes ?? 0) * 680;
  const scope3 = scope3_travel + scope3_commuting + scope3_goods + scope3_waste;

  const total_kg = scope1 + scope2 + scope3;
  const avoided_kg = esg.platform_co2_avoided ?? 0;
  const net_kg = total_kg - avoided_kg;
  const per_employee_kg =
    (esg.nb_employees ?? 0) > 0 ? total_kg / esg.nb_employees : 0;

  return {
    scope1_kg: scope1,
    scope2_kg: scope2,
    scope3_kg: scope3,
    scope1_tonnes: scope1 / 1000,
    scope2_tonnes: scope2 / 1000,
    scope3_tonnes: scope3 / 1000,
    total_kg,
    total_tonnes: total_kg / 1000,
    avoided_kg,
    avoided_tonnes: avoided_kg / 1000,
    net_kg,
    net_tonnes: net_kg / 1000,
    per_employee_kg,
    per_employee_tonnes: per_employee_kg / 1000,
    breakdown: {
      scope1: {
        natural_gas: scope1_natural_gas,
        fuel: scope1_fuel,
        other: scope1_other,
      },
      scope2: { electricity: scope2_electricity, heating: scope2_heating },
      scope3: {
        travel: scope3_travel,
        commuting: scope3_commuting,
        goods: scope3_goods,
        waste: scope3_waste,
      },
    },
  };
}

function generateRecommendations(
  esg: EsgData,
  emissions: ReturnType<typeof calculateEmissions>,
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const total = emissions.total_kg;

  if (total === 0) return recommendations;

  // If electricity > 30% of total
  const elecPct = emissions.breakdown.scope2.electricity / total;

  if (elecPct > 0.3) {
    recommendations.push({
      priority: 1,
      category: 'energy',
      action: 'Switch to renewable energy',
      description:
        "L'électricité représente plus de 30% de vos émissions. Passez à un contrat d'énergie renouvelable pour réduire significativement votre empreinte Scope 2.",
      estimated_reduction_kg: emissions.breakdown.scope2.electricity * 0.88,
      difficulty: 'medium',
    });
  }

  // If fuel > 5000kg
  if (emissions.breakdown.scope1.fuel > 5000) {
    recommendations.push({
      priority: 2,
      category: 'transport',
      action: 'Electrify vehicle fleet',
      description:
        'Vos émissions liées aux carburants dépassent 5 tonnes CO2. Envisagez de passer à des véhicules électriques ou hybrides pour réduire votre Scope 1.',
      estimated_reduction_kg: emissions.breakdown.scope1.fuel * 0.6,
      difficulty: 'hard',
    });
  }

  // If waste > 0 and platform recycling < 50% of waste
  if (
    (esg.waste_tonnes ?? 0) > 0 &&
    (esg.platform_tonnes_recycled ?? 0) < (esg.waste_tonnes ?? 0) * 0.5
  ) {
    recommendations.push({
      priority: 3,
      category: 'waste',
      action: 'Increase recycling via platform',
      description:
        'Vous pouvez recycler davantage via la plateforme GreenEcoGenius. Augmentez vos transactions de recyclage pour réduire vos émissions liées aux déchets.',
      estimated_reduction_kg: emissions.breakdown.scope3.waste * 0.3,
      difficulty: 'easy',
    });
  }

  // If commuting > 15% of total
  const commutingPct = emissions.breakdown.scope3.commuting / total;

  if (commutingPct > 0.15) {
    recommendations.push({
      priority: 4,
      category: 'commuting',
      action: 'Implement remote work policy',
      description:
        "Les trajets domicile-travail représentent plus de 15% de vos émissions. Mettez en place une politique de télétravail pour réduire l'empreinte Scope 3.",
      estimated_reduction_kg: emissions.breakdown.scope3.commuting * 0.4,
      difficulty: 'easy',
    });
  }

  return recommendations;
}

export async function POST(req: NextRequest) {
  const limited = applyRateLimit(req, EXPORT_RATE_LIMIT);
  if (limited) return limited;

  const client = getSupabaseServerClient();
  const { data: user, error: authError } = await requireUser(client);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let rawBody: unknown;

  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { reporting_year } = parsed.data;

  // Use standard client — RLS ensures user can only access their own data
  const { data: esgRows, error: esgError } = await client
    .from('org_esg_data')
    .select('*')
    .eq('account_id', user.id)
    .eq('reporting_year', reporting_year);

  if (esgError) {
    return NextResponse.json(
      { error: 'Failed to fetch ESG data', details: esgError.message },
      { status: 500 },
    );
  }

  if (!esgRows || esgRows.length === 0) {
    return NextResponse.json(
      {
        error:
          'No ESG data found for this year. Please fill in your data first.',
      },
      { status: 404 },
    );
  }

  const esgRow = esgRows[0];

  // Fetch emission factors
  const { data: factors } = await client
    .from('esg_emission_factors')
    .select('*');

  // Build EsgData from row
  const esg: EsgData = {
    natural_gas_kwh: esgRow.natural_gas_kwh ?? 0,
    fuel_liters: esgRow.fuel_liters ?? 0,
    fuel_type: esgRow.fuel_type ?? 'diesel',
    other_kg_co2: esgRow.other_kg_co2 ?? 0,
    electricity_kwh: esgRow.electricity_kwh ?? 0,
    electricity_source: esgRow.electricity_source ?? 'grid_fr',
    heating_kwh: esgRow.heating_kwh ?? 0,
    business_travel_km: esgRow.business_travel_km ?? 0,
    travel_mode: esgRow.travel_mode ?? 'car',
    commuting_employees: esgRow.commuting_employees ?? 0,
    commuting_avg_km: esgRow.commuting_avg_km ?? 0,
    purchased_goods_eur: esgRow.purchased_goods_eur ?? 0,
    waste_tonnes: esgRow.waste_tonnes ?? 0,
    nb_employees: esgRow.nb_employees ?? 0,
    platform_co2_avoided: esgRow.platform_co2_avoided ?? 0,
    platform_tonnes_recycled: esgRow.platform_tonnes_recycled ?? 0,
  };

  // Apply custom factors if available
  if (factors && factors.length > 0) {
    for (const factor of factors) {
      if (
        factor.factor_key === 'electricity' &&
        factor.source === esg.electricity_source
      ) {
        ELEC_FACTORS[esg.electricity_source] = factor.value_kg_co2;
      }

      if (factor.factor_key === 'fuel' && factor.fuel_type === esg.fuel_type) {
        FUEL_FACTORS[esg.fuel_type] = factor.value_kg_co2;
      }
    }
  }

  const emissions = calculateEmissions(esg);
  const recommendations = generateRecommendations(esg, emissions);

  const reportData = {
    account_id: user.id,
    report_year: reporting_year,
    scope1_kg: emissions.scope1_kg,
    scope2_kg: emissions.scope2_kg,
    scope3_kg: emissions.scope3_kg,
    total_kg: emissions.total_kg,
    avoided_kg: emissions.avoided_kg,
    net_kg: emissions.net_kg,
    per_employee_kg: emissions.per_employee_kg,
    recommendations: JSON.stringify(recommendations),
    breakdown: JSON.stringify(emissions.breakdown),
    calculated_at: new Date().toISOString(),
  };

  const { data: report, error: reportError } = await client
    .from('esg_reports')
    .upsert(reportData, {
      onConflict: 'account_id,report_year',
    })
    .select()
    .single();

  if (reportError) {
    return NextResponse.json(
      { error: 'Failed to save report', details: reportError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    data: {
      report,
      emissions,
      recommendations,
    },
  });
}

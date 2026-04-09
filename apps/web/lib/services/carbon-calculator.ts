import {
  ELECTRICITY_FACTORS,
  SCOPE1_FACTORS,
  SCOPE2_FACTORS,
  SCOPE3_COMMUTING_FACTORS,
  SCOPE3_DIGITAL_FACTORS,
  SCOPE3_PURCHASE_FACTORS,
  SCOPE3_TRANSPORT_FACTORS,
  SCOPE3_TRAVEL_FACTORS,
  SCOPE3_WASTE_FACTORS,
} from '~/lib/config/emission-factors';

export interface CarbonProfile {
  reporting_year: number;
  reporting_period: string;
  industry_sector: string;
  country: string;
  number_of_employees: number;
  office_area_m2: number;
  annual_revenue_eur: number;
  has_fleet: boolean;
  has_refrigeration: boolean;
}

export interface Scope1Data {
  natural_gas_kwh: number;
  heating_oil_liters: number;
  propane_liters: number;
  fleet_diesel_liters: number;
  fleet_gasoline_liters: number;
  fleet_lpg_liters: number;
  refrigerant_type: string;
  refrigerant_kg: number;
}

export interface Scope2Data {
  electricity_kwh: number;
  electricity_source: 'grid' | 'renewable' | 'self';
  country: string;
  district_heating_kwh: number;
}

export interface Scope3Data {
  purchases: Record<string, number>;
  transport_mode: string;
  transport_tonnes: number;
  transport_km: number;
  waste: Record<string, number>;
  travel: Record<string, number>;
  commuting_employees: number;
  commuting_days: number;
  commuting_distance_km: number;
  commuting_split: Record<string, number>;
  digital_cloud_eur: number;
  digital_emails_day: number;
  digital_video_hours_week: number;
}

export interface CarbonFormData {
  profile: CarbonProfile;
  scope1: Scope1Data;
  scope2: Scope2Data;
  scope3: Scope3Data;
}

export interface ScopeDetail {
  total: number;
  items: { key: string; value: number }[];
}

export interface CarbonResult {
  scope1: ScopeDetail;
  scope2: ScopeDetail;
  scope3: ScopeDetail;
  total: number;
  intensity_per_employee: number;
  intensity_per_revenue: number;
  equivalences: {
    flights_paris_ny: number;
    cars_per_year: number;
    trees_needed: number;
    households_electricity: number;
  };
  reporting_year: number;
  reporting_period: string;
}

function kgToTonnes(kg: number): number {
  return kg / 1000;
}

export function calculateCarbonFootprint(data: CarbonFormData): CarbonResult {
  const country = data.profile.country || 'FR';

  // Scope 1
  const s1Items: { key: string; value: number }[] = [];
  const s1gas = (data.scope1.natural_gas_kwh || 0) * SCOPE1_FACTORS.natural_gas!.factor;
  if (s1gas > 0) s1Items.push({ key: 'natural_gas', value: s1gas });
  const s1oil = (data.scope1.heating_oil_liters || 0) * SCOPE1_FACTORS.heating_oil!.factor;
  if (s1oil > 0) s1Items.push({ key: 'heating_oil', value: s1oil });
  const s1prop = (data.scope1.propane_liters || 0) * SCOPE1_FACTORS.propane!.factor;
  if (s1prop > 0) s1Items.push({ key: 'propane', value: s1prop });
  const s1diesel = (data.scope1.fleet_diesel_liters || 0) * SCOPE1_FACTORS.fleet_diesel!.factor;
  if (s1diesel > 0) s1Items.push({ key: 'fleet_diesel', value: s1diesel });
  const s1gasoline = (data.scope1.fleet_gasoline_liters || 0) * SCOPE1_FACTORS.fleet_gasoline!.factor;
  if (s1gasoline > 0) s1Items.push({ key: 'fleet_gasoline', value: s1gasoline });
  const s1lpg = (data.scope1.fleet_lpg_liters || 0) * SCOPE1_FACTORS.fleet_lpg!.factor;
  if (s1lpg > 0) s1Items.push({ key: 'fleet_lpg', value: s1lpg });
  const refKey = `refrigerant_${data.scope1.refrigerant_type || 'r410a'}`;
  const refFactor = SCOPE1_FACTORS[refKey]?.factor ?? 0;
  const s1ref = (data.scope1.refrigerant_kg || 0) * refFactor;
  if (s1ref > 0) s1Items.push({ key: 'refrigerant', value: s1ref });
  const scope1Total = kgToTonnes(s1Items.reduce((s, i) => s + i.value, 0));

  // Scope 2
  const s2Items: { key: string; value: number }[] = [];
  const elecFactor = data.scope2.electricity_source === 'renewable'
    ? SCOPE2_FACTORS.electricity_renewable.factor
    : ELECTRICITY_FACTORS[data.scope2.country || country]?.factor ?? ELECTRICITY_FACTORS.EU_AVG!.factor;
  const s2elec = (data.scope2.electricity_kwh || 0) * elecFactor;
  if (s2elec > 0) s2Items.push({ key: 'electricity', value: s2elec });
  const dhFactor = country === 'FR' ? SCOPE2_FACTORS.district_heating_FR.factor : SCOPE2_FACTORS.district_heating_EU.factor;
  const s2dh = (data.scope2.district_heating_kwh || 0) * dhFactor;
  if (s2dh > 0) s2Items.push({ key: 'district_heating', value: s2dh });
  const scope2Total = kgToTonnes(s2Items.reduce((s, i) => s + i.value, 0));

  // Scope 3
  const s3Items: { key: string; value: number }[] = [];

  // Purchases
  let purchaseKg = 0;
  for (const [cat, amount] of Object.entries(data.scope3.purchases || {})) {
    const f = SCOPE3_PURCHASE_FACTORS[cat]?.factor ?? 0;
    purchaseKg += (amount || 0) * f;
  }
  if (purchaseKg > 0) s3Items.push({ key: 'purchases', value: purchaseKg });

  // Transport
  const tMode = data.scope3.transport_mode || 'truck';
  const tFactor = SCOPE3_TRANSPORT_FACTORS[tMode]?.factor ?? 0.117;
  const transportKg = (data.scope3.transport_tonnes || 0) * (data.scope3.transport_km || 0) * tFactor;
  if (transportKg > 0) s3Items.push({ key: 'transport', value: transportKg });

  // Waste
  let wasteKg = 0;
  for (const [type, kg] of Object.entries(data.scope3.waste || {})) {
    const f = SCOPE3_WASTE_FACTORS[type]?.factor ?? 0;
    wasteKg += (kg || 0) * f;
  }
  if (wasteKg > 0) s3Items.push({ key: 'waste', value: wasteKg });

  // Business travel
  let travelKg = 0;
  for (const [type, val] of Object.entries(data.scope3.travel || {})) {
    const f = SCOPE3_TRAVEL_FACTORS[type]?.factor ?? 0;
    travelKg += (val || 0) * f;
  }
  if (travelKg > 0) s3Items.push({ key: 'business_travel', value: travelKg });

  // Commuting
  const emp = data.scope3.commuting_employees || data.profile.number_of_employees || 0;
  const days = data.scope3.commuting_days || 220;
  const dist = data.scope3.commuting_distance_km || 15;
  let commutingKg = 0;
  for (const [mode, pct] of Object.entries(data.scope3.commuting_split || {})) {
    const f = SCOPE3_COMMUTING_FACTORS[mode]?.factor ?? 0;
    commutingKg += emp * days * dist * 2 * (pct / 100) * f;
  }
  if (commutingKg > 0) s3Items.push({ key: 'commuting', value: commutingKg });

  // Digital
  const cloudKg = (data.scope3.digital_cloud_eur || 0) * SCOPE3_DIGITAL_FACTORS.cloud_per_eur.factor;
  const emailKg = (data.scope3.digital_emails_day || 0) * 250 * SCOPE3_DIGITAL_FACTORS.email.factor;
  const videoKg = (data.scope3.digital_video_hours_week || 0) * 48 * SCOPE3_DIGITAL_FACTORS.video_call_hour.factor;
  const digitalKg = cloudKg + emailKg + videoKg;
  if (digitalKg > 0) s3Items.push({ key: 'digital', value: digitalKg });

  const scope3Total = kgToTonnes(s3Items.reduce((s, i) => s + i.value, 0));
  const total = scope1Total + scope2Total + scope3Total;
  const employees = data.profile.number_of_employees || 1;
  const revenue = data.profile.annual_revenue_eur || 1;

  return {
    scope1: { total: scope1Total, items: s1Items.map((i) => ({ ...i, value: kgToTonnes(i.value) })) },
    scope2: { total: scope2Total, items: s2Items.map((i) => ({ ...i, value: kgToTonnes(i.value) })) },
    scope3: { total: scope3Total, items: s3Items.map((i) => ({ ...i, value: kgToTonnes(i.value) })) },
    total,
    intensity_per_employee: Math.round((total / employees) * 10) / 10,
    intensity_per_revenue: Math.round(((total * 1000) / revenue) * 100) / 100,
    equivalences: {
      flights_paris_ny: Math.round((total / 2.0) * 10) / 10,
      cars_per_year: Math.round((total / 4.6) * 10) / 10,
      trees_needed: Math.round((total * 1000) / 22),
      households_electricity: Math.round(((total * 1000) / 4700) * 10) / 10,
    },
    reporting_year: data.profile.reporting_year,
    reporting_period: data.profile.reporting_period,
  };
}

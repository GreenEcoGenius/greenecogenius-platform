'use client';

import { useCallback, useMemo, useState, useTransition } from 'react';

import Link from 'next/link';

import {
  Building2,
  Download,
  Factory,
  Flame,
  Leaf,
  Plane,
  Sparkles,
  Truck,
  Zap,
} from 'lucide-react';
import { useLocale } from 'next-intl';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';

import { useChat } from '~/components/ai/chat-context';
import {
  COUNTRIES,
  ELECTRICITY_FACTORS,
  INDUSTRY_SECTORS,
  SCOPE1_FACTORS,
  SCOPE3_COMMUTING_FACTORS,
  SCOPE3_PURCHASE_FACTORS,
  SCOPE3_TRAVEL_FACTORS,
  SCOPE3_WASTE_FACTORS,
} from '~/lib/config/emission-factors';
import type {
  CarbonFormData,
  CarbonResult,
  Scope1Data,
  Scope2Data,
  Scope3Data,
  CarbonProfile,
} from '~/lib/services/carbon-calculator';
import { calculateCarbonFootprint } from '~/lib/services/carbon-calculator';

import { saveCarbonAssessment } from '../../_lib/carbon-actions';

const STEPS = ['profile', 'scope1', 'scope2', 'scope3', 'results'] as const;

function NumField({
  label,
  value,
  onChange,
  unit,
  help,
  estimate,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  unit?: string;
  help?: string;
  estimate?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={0}
          value={value || ''}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-teal-300 focus:ring-1 focus:ring-teal-200"
        />
        {unit && <span className="shrink-0 text-xs text-gray-400">{unit}</span>}
      </div>
      {help && <p className="text-[11px] text-gray-400">{help}</p>}
      {estimate && (
        <p className="text-[11px] font-medium text-teal-600">{estimate}</p>
      )}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-teal-300 focus:ring-1 focus:ring-teal-200"
      >
        <option value="">--</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function ScopeTotal({ label, tonnes }: { label: string; tonnes: number }) {
  return (
    <div className="mt-4 rounded-lg bg-teal-50 p-3 text-center">
      <p className="text-xs font-medium text-teal-700">{label}</p>
      <p className="text-2xl font-bold text-teal-800">{Math.round(tonnes * 10) / 10} tCO2e</p>
    </div>
  );
}

function fmt(kg: number): string {
  return `~ ${Math.round(kg)} kgCO2e`;
}

export function CarbonWizard() {
  const locale = useLocale();
  const fr = locale === 'fr';
  const { openChatWithPrompt } = useChat();
  const [step, setStep] = useState(0);
  const [isPending, startTransition] = useTransition();

  const [profile, setProfile] = useState<CarbonProfile>({
    reporting_year: 2026,
    reporting_period: 'full_year',
    industry_sector: '',
    country: 'FR',
    number_of_employees: 0,
    office_area_m2: 0,
    annual_revenue_eur: 0,
    has_fleet: false,
    has_refrigeration: false,
  });

  const [scope1, setScope1] = useState<Scope1Data>({
    natural_gas_kwh: 0, heating_oil_liters: 0, propane_liters: 0,
    fleet_diesel_liters: 0, fleet_gasoline_liters: 0, fleet_lpg_liters: 0,
    refrigerant_type: 'r410a', refrigerant_kg: 0,
  });

  const [scope2, setScope2] = useState<Scope2Data>({
    electricity_kwh: 0, electricity_source: 'grid', country: 'FR', district_heating_kwh: 0,
  });

  const [scope3, setScope3] = useState<Scope3Data>({
    purchases: {}, transport_mode: 'truck', transport_tonnes: 0, transport_km: 0,
    waste: {}, travel: {},
    commuting_employees: 0, commuting_days: 220, commuting_distance_km: 15,
    commuting_split: { car_solo: 50, public_transit: 30, bike_walk: 20 },
    digital_cloud_eur: 0, digital_emails_day: 0, digital_video_hours_week: 0,
  });

  const [result, setResult] = useState<CarbonResult | null>(null);

  const formData: CarbonFormData = useMemo(() => ({
    profile, scope1, scope2, scope3,
  }), [profile, scope1, scope2, scope3]);

  const liveResult = useMemo(() => calculateCarbonFootprint(formData), [formData]);

  const up = useCallback(<K extends keyof Scope1Data>(k: K, v: Scope1Data[K]) => {
    setScope1((p) => ({ ...p, [k]: v }));
  }, []);

  const handleFinish = useCallback(() => {
    const res = calculateCarbonFootprint(formData);
    setResult(res);
    setStep(4);
    startTransition(async () => {
      try { await saveCarbonAssessment(formData); } catch { /* noop */ }
    });
  }, [formData]);

  const isResults = step === 4;

  return (
    <div className="space-y-6">
      <p className="text-center text-xs text-gray-400">
        {fr
          ? 'Bilan carbone conforme au GHG Protocol Corporate Standard — facteurs Base Carbone ADEME'
          : 'Carbon footprint compliant with GHG Protocol Corporate Standard — ADEME emission factors'}
      </p>

      {/* Progress */}
      {!isResults && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              {fr ? 'Etape' : 'Step'} {step + 1} / {STEPS.length}
            </span>
            <span className="text-gray-500">
              {['Profil', 'Scope 1', 'Scope 2', 'Scope 3', fr ? 'Resultats' : 'Results'][step]}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>
        </div>
      )}

      {/* Step 0: Profile */}
      {step === 0 && (
        <Card>
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-teal-600" />
              <h2 className="text-lg font-bold">{fr ? 'Informations generales' : 'General information'}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField label={fr ? 'Annee de reporting' : 'Reporting year'} value={String(profile.reporting_year)} onChange={(v) => setProfile((p) => ({ ...p, reporting_year: Number(v) }))} options={[{ value: '2024', label: '2024' }, { value: '2025', label: '2025' }, { value: '2026', label: '2026' }]} />
              <SelectField label={fr ? 'Secteur' : 'Sector'} value={profile.industry_sector} onChange={(v) => setProfile((p) => ({ ...p, industry_sector: v }))} options={INDUSTRY_SECTORS.map((s) => ({ value: s.value, label: fr ? s.label_fr : s.label_en }))} />
              <SelectField label={fr ? 'Pays' : 'Country'} value={profile.country} onChange={(v) => setProfile((p) => ({ ...p, country: v }))} options={COUNTRIES} />
              <NumField label={fr ? 'Nombre d\'employes' : 'Employees'} value={profile.number_of_employees} onChange={(v) => setProfile((p) => ({ ...p, number_of_employees: v }))} />
              <NumField label={fr ? 'Surface locaux (m2)' : 'Office area (m2)'} value={profile.office_area_m2} onChange={(v) => setProfile((p) => ({ ...p, office_area_m2: v }))} unit="m2" />
              <NumField label={fr ? 'CA annuel' : 'Annual revenue'} value={profile.annual_revenue_eur} onChange={(v) => setProfile((p) => ({ ...p, annual_revenue_eur: v }))} unit="EUR" help={fr ? 'Necessaire pour l\'intensite carbone/CA' : 'Needed for carbon intensity per revenue'} />
            </div>
            <div className="space-y-2 pt-2">
              <p className="text-sm font-medium text-gray-700">{fr ? 'Votre entreprise dispose-t-elle de :' : 'Does your company have:'}</p>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={profile.has_fleet} onChange={(e) => setProfile((p) => ({ ...p, has_fleet: e.target.checked }))} className="accent-teal-600" />{fr ? 'Vehicules de fonction / flotte' : 'Company vehicles / fleet'}</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={profile.has_refrigeration} onChange={(e) => setProfile((p) => ({ ...p, has_refrigeration: e.target.checked }))} className="accent-teal-600" />{fr ? 'Climatisation ou refrigeration' : 'Air conditioning or refrigeration'}</label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Scope 1 */}
      {step === 1 && (
        <Card>
          <CardContent className="space-y-5 p-5">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <h2 className="text-lg font-bold">Scope 1 — {fr ? 'Emissions directes' : 'Direct emissions'}</h2>
            </div>
            <p className="text-xs text-gray-500">{fr ? 'Combustion sur site, vehicules, gaz refrigerants' : 'On-site combustion, vehicles, refrigerant gases'}</p>

            <div>
              <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold"><Factory className="h-4 w-4" /> {fr ? 'Chauffage des locaux' : 'Building heating'}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <NumField label={fr ? 'Gaz naturel' : 'Natural gas'} value={scope1.natural_gas_kwh} onChange={(v) => up('natural_gas_kwh', v)} unit="kWh" help={SCOPE1_FACTORS.natural_gas!.help_fr} estimate={scope1.natural_gas_kwh ? fmt(scope1.natural_gas_kwh * 0.227) : undefined} />
                <NumField label={fr ? 'Fioul domestique' : 'Heating oil'} value={scope1.heating_oil_liters} onChange={(v) => up('heating_oil_liters', v)} unit={fr ? 'litres' : 'liters'} estimate={scope1.heating_oil_liters ? fmt(scope1.heating_oil_liters * 3.25) : undefined} />
                <NumField label="Propane / GPL" value={scope1.propane_liters} onChange={(v) => up('propane_liters', v)} unit={fr ? 'litres' : 'liters'} estimate={scope1.propane_liters ? fmt(scope1.propane_liters * 1.55) : undefined} />
              </div>
            </div>

            {profile.has_fleet && (
              <div>
                <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold"><Truck className="h-4 w-4" /> {fr ? 'Flotte de vehicules' : 'Vehicle fleet'}</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <NumField label="Diesel" value={scope1.fleet_diesel_liters} onChange={(v) => up('fleet_diesel_liters', v)} unit={fr ? 'litres' : 'liters'} estimate={scope1.fleet_diesel_liters ? fmt(scope1.fleet_diesel_liters * 3.16) : undefined} />
                  <NumField label={fr ? 'Essence' : 'Gasoline'} value={scope1.fleet_gasoline_liters} onChange={(v) => up('fleet_gasoline_liters', v)} unit={fr ? 'litres' : 'liters'} estimate={scope1.fleet_gasoline_liters ? fmt(scope1.fleet_gasoline_liters * 2.80) : undefined} />
                  <NumField label="GPL / LPG" value={scope1.fleet_lpg_liters} onChange={(v) => up('fleet_lpg_liters', v)} unit={fr ? 'litres' : 'liters'} />
                </div>
              </div>
            )}

            {profile.has_refrigeration && (
              <div>
                <h3 className="mb-2 text-sm font-semibold">{fr ? 'Climatisation / Refrigeration' : 'Air conditioning / Refrigeration'}</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <SelectField label={fr ? 'Type de gaz' : 'Refrigerant type'} value={scope1.refrigerant_type} onChange={(v) => setScope1((p) => ({ ...p, refrigerant_type: v }))} options={[{ value: 'r410a', label: 'R-410A' }, { value: 'r32', label: 'R-32' }, { value: 'r134a', label: 'R-134a' }]} />
                  <NumField label={fr ? 'Quantite rechargee' : 'Quantity recharged'} value={scope1.refrigerant_kg} onChange={(v) => up('refrigerant_kg', v)} unit="kg" />
                </div>
              </div>
            )}

            <ScopeTotal label="TOTAL SCOPE 1" tonnes={liveResult.scope1.total} />
          </CardContent>
        </Card>
      )}

      {/* Step 2: Scope 2 */}
      {step === 2 && (
        <Card>
          <CardContent className="space-y-5 p-5">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <h2 className="text-lg font-bold">Scope 2 — {fr ? 'Energie achetee' : 'Purchased energy'}</h2>
            </div>
            <p className="text-xs text-gray-500">{fr ? 'Electricite et chauffage urbain' : 'Electricity and district heating'}</p>

            <div className="space-y-3">
              <NumField label={fr ? 'Consommation electricite' : 'Electricity consumption'} value={scope2.electricity_kwh} onChange={(v) => setScope2((p) => ({ ...p, electricity_kwh: v }))} unit="kWh" help={fr ? 'Trouvez cette valeur sur vos factures' : 'Find this on your electricity bills'} />
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">{fr ? 'Source' : 'Source'}</p>
                {(['grid', 'renewable', 'self'] as const).map((src) => (
                  <label key={src} className={`flex items-center gap-2 rounded-lg border p-2.5 text-sm ${scope2.electricity_source === src ? 'border-teal-300 bg-teal-50' : 'border-gray-100'}`}>
                    <input type="radio" name="elec_source" value={src} checked={scope2.electricity_source === src} onChange={() => setScope2((p) => ({ ...p, electricity_source: src }))} className="accent-teal-600" />
                    {src === 'grid' ? `${fr ? 'Mix reseau' : 'Grid mix'} (${profile.country}: ${ELECTRICITY_FACTORS[profile.country]?.factor ?? 0.052} kgCO2e/kWh)` : src === 'renewable' ? (fr ? 'Contrat 100% renouvelable (GO)' : '100% renewable contract (GO)') : (fr ? 'Autoproduction (solaire)' : 'Self-production (solar)')}
                  </label>
                ))}
              </div>
              <NumField label={fr ? 'Chauffage urbain' : 'District heating'} value={scope2.district_heating_kwh} onChange={(v) => setScope2((p) => ({ ...p, district_heating_kwh: v }))} unit="kWh" help={fr ? 'Si raccorde a un reseau de chaleur' : 'If connected to a district heating network'} />
            </div>

            <div className="rounded-lg border border-teal-100 bg-teal-50/50 p-3 text-xs text-teal-700">
              {fr
                ? `Le mix electrique francais est l'un des plus bas d'Europe grace au nucleaire (0.052 kgCO2e/kWh vs 0.385 en Allemagne).`
                : `The French electricity mix is one of the lowest in Europe thanks to nuclear (0.052 kgCO2e/kWh vs 0.385 in Germany).`}
            </div>

            <ScopeTotal label="TOTAL SCOPE 2" tonnes={liveResult.scope2.total} />
          </CardContent>
        </Card>
      )}

      {/* Step 3: Scope 3 */}
      {step === 3 && (
        <Card>
          <CardContent className="space-y-5 p-5">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-emerald-500" />
              <h2 className="text-lg font-bold">Scope 3 — {fr ? 'Chaine de valeur' : 'Value chain'}</h2>
            </div>
            <p className="text-xs text-gray-500">{fr ? 'Achats, transport, deplacements, dechets — souvent 80% du total' : 'Purchases, transport, travel, waste — often 80% of total'}</p>

            {/* Purchases */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">{fr ? 'Achats de biens et services' : 'Goods & services purchases'}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(SCOPE3_PURCHASE_FACTORS).map(([key, f]) => (
                  <NumField key={key} label={fr ? f.label_fr : f.label_en} value={scope3.purchases[key] || 0} onChange={(v) => setScope3((p) => ({ ...p, purchases: { ...p.purchases, [key]: v } }))} unit="EUR" estimate={(scope3.purchases[key] || 0) > 0 ? fmt((scope3.purchases[key] || 0) * f.factor) : undefined} />
                ))}
              </div>
            </div>

            {/* Waste */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">{fr ? 'Dechets generes' : 'Waste generated'}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(SCOPE3_WASTE_FACTORS).map(([key, f]) => (
                  <NumField key={key} label={fr ? f.label_fr : f.label_en} value={scope3.waste[key] || 0} onChange={(v) => setScope3((p) => ({ ...p, waste: { ...p.waste, [key]: v } }))} unit="kg" />
                ))}
              </div>
            </div>

            {/* Business travel */}
            <div>
              <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold"><Plane className="h-4 w-4" /> {fr ? 'Deplacements professionnels' : 'Business travel'}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(SCOPE3_TRAVEL_FACTORS).map(([key, f]) => (
                  <NumField key={key} label={fr ? f.label_fr : f.label_en} value={scope3.travel[key] || 0} onChange={(v) => setScope3((p) => ({ ...p, travel: { ...p.travel, [key]: v } }))} unit={f.unit === 'nuits' ? (fr ? 'nuits' : 'nights') : 'km'} />
                ))}
              </div>
            </div>

            {/* Commuting */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">{fr ? 'Deplacements domicile-travail' : 'Employee commuting'}</h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <NumField label={fr ? 'Employes sur site' : 'On-site employees'} value={scope3.commuting_employees || profile.number_of_employees} onChange={(v) => setScope3((p) => ({ ...p, commuting_employees: v }))} />
                <NumField label={fr ? 'Jours/an' : 'Days/year'} value={scope3.commuting_days} onChange={(v) => setScope3((p) => ({ ...p, commuting_days: v }))} />
                <NumField label={fr ? 'Distance aller (km)' : 'One-way distance (km)'} value={scope3.commuting_distance_km} onChange={(v) => setScope3((p) => ({ ...p, commuting_distance_km: v }))} unit="km" />
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {Object.entries(SCOPE3_COMMUTING_FACTORS).map(([key, f]) => (
                  <NumField key={key} label={`${fr ? f.label_fr : f.label_en} (%)`} value={scope3.commuting_split[key] || 0} onChange={(v) => setScope3((p) => ({ ...p, commuting_split: { ...p.commuting_split, [key]: v } }))} unit="%" />
                ))}
              </div>
            </div>

            {/* Digital */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">{fr ? 'Numerique' : 'Digital'}</h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <NumField label={fr ? 'Budget cloud' : 'Cloud budget'} value={scope3.digital_cloud_eur} onChange={(v) => setScope3((p) => ({ ...p, digital_cloud_eur: v }))} unit="EUR/an" />
                <NumField label={fr ? 'Emails/jour' : 'Emails/day'} value={scope3.digital_emails_day} onChange={(v) => setScope3((p) => ({ ...p, digital_emails_day: v }))} />
                <NumField label={fr ? 'Visio heures/semaine' : 'Video hours/week'} value={scope3.digital_video_hours_week} onChange={(v) => setScope3((p) => ({ ...p, digital_video_hours_week: v }))} />
              </div>
            </div>

            <ScopeTotal label="TOTAL SCOPE 3" tonnes={liveResult.scope3.total} />
          </CardContent>
        </Card>
      )}

      {/* Step 4: Results */}
      {isResults && result && (
        <div className="space-y-6">
          <Card className="border-teal-200 bg-gradient-to-br from-teal-50 to-white">
            <CardContent className="flex flex-col items-center py-8">
              <p className="text-sm font-medium text-teal-700">TOTAL</p>
              <p className="text-5xl font-bold text-teal-800">{Math.round(result.total * 10) / 10}</p>
              <p className="text-sm text-teal-600">tCO2e</p>
              <div className="mt-3 flex gap-4 text-xs text-gray-500">
                <span>{result.intensity_per_employee} tCO2e / {fr ? 'employe' : 'employee'}</span>
                <span>{result.intensity_per_revenue} kgCO2e / EUR</span>
              </div>
            </CardContent>
          </Card>

          {/* Scope breakdown */}
          <Card>
            <CardContent className="space-y-3 p-5">
              <h3 className="text-sm font-semibold">{fr ? 'Repartition par scope' : 'Breakdown by scope'}</h3>
              {[
                { label: 'Scope 1', total: result.scope1.total, color: 'bg-orange-500' },
                { label: 'Scope 2', total: result.scope2.total, color: 'bg-yellow-500' },
                { label: 'Scope 3', total: result.scope3.total, color: 'bg-emerald-500' },
              ].map((s) => {
                const pct = result.total > 0 ? Math.round((s.total / result.total) * 100) : 0;
                return (
                  <div key={s.label}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium">{s.label}</span>
                      <span className="text-gray-500">{Math.round(s.total * 10) / 10} tCO2e ({pct}%)</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                      <div className={`h-full rounded-full ${s.color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Equivalences */}
          <Card>
            <CardContent className="p-5">
              <h3 className="mb-3 text-sm font-semibold">{fr ? 'Equivalences' : 'Equivalences'}</h3>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="rounded-lg bg-gray-50 p-3"><p className="text-xl font-bold text-gray-800">{result.equivalences.flights_paris_ny}</p><p className="text-[11px] text-gray-500">{fr ? 'vols Paris-NYC AR' : 'Paris-NYC round trips'}</p></div>
                <div className="rounded-lg bg-gray-50 p-3"><p className="text-xl font-bold text-gray-800">{result.equivalences.cars_per_year}</p><p className="text-[11px] text-gray-500">{fr ? 'voitures / an' : 'cars / year'}</p></div>
                <div className="rounded-lg bg-gray-50 p-3"><p className="text-xl font-bold text-gray-800">{result.equivalences.trees_needed}</p><p className="text-[11px] text-gray-500">{fr ? 'arbres necessaires' : 'trees needed'}</p></div>
                <div className="rounded-lg bg-gray-50 p-3"><p className="text-xl font-bold text-gray-800">{result.equivalences.households_electricity}</p><p className="text-[11px] text-gray-500">{fr ? 'foyers alimentes' : 'households powered'}</p></div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button variant="default" onClick={() => {
              const prompt = fr
                ? `Mon bilan carbone GHG Protocol donne ${Math.round(result.total * 10) / 10} tCO2e (Scope 1: ${Math.round(result.scope1.total * 10) / 10}, Scope 2: ${Math.round(result.scope2.total * 10) / 10}, Scope 3: ${Math.round(result.scope3.total * 10) / 10}). Propose-moi un plan de reduction concret et chiffre.`
                : `My GHG Protocol carbon assessment gives ${Math.round(result.total * 10) / 10} tCO2e (Scope 1: ${Math.round(result.scope1.total * 10) / 10}, Scope 2: ${Math.round(result.scope2.total * 10) / 10}, Scope 3: ${Math.round(result.scope3.total * 10) / 10}). Suggest a concrete, quantified reduction plan.`;
              openChatWithPrompt(prompt);
            }}>
              <Sparkles className="mr-2 h-4 w-4" />
              {fr ? 'Plan de reduction avec Genius' : 'Reduction plan with Genius'}
            </Button>
            <Button variant="outline" render={<Link href="/home/carbon" />} nativeButton={false}>
              {fr ? 'Retour Impact Carbone' : 'Back to Carbon Impact'}
            </Button>
          </div>
          <p className="text-center text-[11px] text-gray-400">
            {fr ? 'GHG Protocol Corporate Standard — Base Carbone ADEME v23' : 'GHG Protocol Corporate Standard — ADEME Base Carbone v23'}
          </p>
        </div>
      )}

      {/* Navigation */}
      {!isResults && (
        <div className="flex justify-between">
          {step > 0 ? (
            <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
              {fr ? 'Precedent' : 'Back'}
            </Button>
          ) : <div />}
          {step < 3 ? (
            <Button onClick={() => setStep((s) => s + 1)}>
              {fr ? 'Suivant' : 'Next'}
            </Button>
          ) : step === 3 ? (
            <Button onClick={handleFinish} disabled={isPending}>
              {isPending ? (fr ? 'Calcul...' : 'Calculating...') : (fr ? 'Voir les resultats' : 'View results')}
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}

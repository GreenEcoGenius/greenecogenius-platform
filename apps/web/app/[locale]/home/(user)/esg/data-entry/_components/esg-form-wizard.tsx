'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  Building2,
  CheckCircle2,
  Factory,
  Flame,
  Leaf,
  Truck,
  Zap,
} from 'lucide-react';

import { useTranslations } from 'next-intl';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

import { UpgradePrompt } from '~/home/_components/upgrade-prompt';
import { useSubscription } from '~/lib/hooks/use-subscription';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ESGFormData {
  reporting_year: number;
  reporting_period: string;
  nb_employees: number;
  office_surface_m2: number;
  industry_sector: string;
  // Scope 1
  scope1_natural_gas_kwh: number;
  scope1_fuel_liters: number;
  scope1_fuel_type: string;
  scope1_other_kg_co2: number;
  // Scope 2
  scope2_electricity_kwh: number;
  scope2_electricity_source: string;
  scope2_heating_kwh: number;
  // Scope 3
  scope3_business_travel_km: number;
  scope3_travel_mode: string;
  scope3_commuting_employees: number;
  scope3_commuting_avg_km: number;
  scope3_purchased_goods_eur: number;
  scope3_waste_tonnes: number;
  // Platform (auto-filled, read-only)
  platform_co2_avoided: number;
  platform_transactions_count: number;
  platform_tonnes_recycled: number;
}

const defaultFormData: ESGFormData = {
  reporting_year: new Date().getFullYear(),
  reporting_period: 'year',
  nb_employees: 0,
  office_surface_m2: 0,
  industry_sector: 'services',
  scope1_natural_gas_kwh: 0,
  scope1_fuel_liters: 0,
  scope1_fuel_type: 'diesel',
  scope1_other_kg_co2: 0,
  scope2_electricity_kwh: 0,
  scope2_electricity_source: 'grid_fr',
  scope2_heating_kwh: 0,
  scope3_business_travel_km: 0,
  scope3_travel_mode: 'car',
  scope3_commuting_employees: 0,
  scope3_commuting_avg_km: 0,
  scope3_purchased_goods_eur: 0,
  scope3_waste_tonnes: 0,
  platform_co2_avoided: 0,
  platform_transactions_count: 0,
  platform_tonnes_recycled: 0,
};

// ---------------------------------------------------------------------------
// Calculation helpers
// ---------------------------------------------------------------------------

const fuelFactors: Record<string, number> = {
  diesel: 2.671,
  essence: 2.284,
  gpl: 1.653,
};

function estimateScope1(data: ESGFormData): number {
  return (
    data.scope1_natural_gas_kwh * 0.205 +
    data.scope1_fuel_liters * (fuelFactors[data.scope1_fuel_type] ?? 2.671) +
    data.scope1_other_kg_co2
  );
}

function estimateScope2(data: ESGFormData): number {
  const electricityFactor =
    data.scope2_electricity_source === 'renewable' ? 0.012 : 0.052;
  return (
    data.scope2_electricity_kwh * electricityFactor +
    data.scope2_heating_kwh * 0.227
  );
}

const travelFactors: Record<string, number> = {
  car: 0.193,
  train: 0.006,
  plane: 0.255,
  mixed: 0.15,
};

function estimateScope3(data: ESGFormData): number {
  const travel =
    data.scope3_business_travel_km *
    (travelFactors[data.scope3_travel_mode] ?? 0.193);
  const commuting =
    data.scope3_commuting_employees *
    data.scope3_commuting_avg_km *
    2 *
    220 *
    0.193;
  const purchases = data.scope3_purchased_goods_eur * 0.42;
  const waste = data.scope3_waste_tonnes * 446;
  return travel + commuting / 1000 + purchases + waste;
}

// ---------------------------------------------------------------------------
// Steps config
// ---------------------------------------------------------------------------

const STEPS = [
  {
    key: 'company',
    labelKey: 'esg:stepCompany',
    icon: Building2,
  },
  {
    key: 'scope1',
    labelKey: 'esg:stepScope1',
    icon: Flame,
  },
  {
    key: 'scope2',
    labelKey: 'esg:stepScope2',
    icon: Zap,
  },
  {
    key: 'scope3',
    labelKey: 'esg:stepScope3',
    icon: Truck,
  },
  {
    key: 'summary',
    labelKey: 'esg:stepSummary',
    icon: CheckCircle2,
  },
];

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ESGFormWizard({
  initialStep,
}: {
  initialStep?: number;
} = {}) {
  const [currentStep, setCurrentStep] = useState(
    initialStep !== undefined && initialStep >= 0 && initialStep < STEPS.length
      ? initialStep
      : 0,
  );
  const [formData, setFormData] = useState<ESGFormData>(defaultFormData);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>(
    'idle',
  );
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const subscription = useSubscription();

  // Auto-save debounced
  const autoSave = useCallback(
    async (data: ESGFormData) => {
      if (subscription.loading) return;

      setSaveStatus('saving');

      try {
        await fetch('/api/esg/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        setSaveStatus('saved');
      } catch {
        setSaveStatus('idle');
      }
    },
    [subscription.loading],
  );

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      autoSave(formData);
    }, 3000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [formData, autoSave]);

  const updateField = useCallback(
    <K extends keyof ESGFormData>(key: K, value: ESGFormData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
      setSaveStatus('idle');
    },
    [],
  );

  const scope1 = estimateScope1(formData);
  const scope2 = estimateScope2(formData);
  const scope3 = estimateScope3(formData);
  const total = scope1 + scope2 + scope3;
  const avoided = formData.platform_co2_avoided;
  const net = total - avoided;

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const [generating, setGenerating] = useState(false);

  const handleGenerateReport = async () => {
    setGenerating(true);

    try {
      // 1. Save current data
      await fetch('/api/esg/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // 2. Calculate emissions server-side
      await fetch('/api/esg/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reporting_year: formData.reporting_year }),
      });

      // 3. Generate & download HTML report
      const res = await fetch('/api/esg/report/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reporting_year: formData.reporting_year }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate report');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const disposition = res.headers.get('Content-Disposition');
      const filenameMatch = disposition?.match(/filename="(.+)"/);
      a.download =
        filenameMatch?.[1] ?? `Rapport-ESG-${formData.reporting_year}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // handled silently
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pt-2">
      {/* Progress bar */}
      <div className="flex items-center gap-1">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isActive = i === currentStep;
          const isDone = i < currentStep;

          return (
            <div key={step.key} className="flex flex-1 items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(i)}
                className={`flex flex-1 flex-col items-center gap-1 rounded-lg p-2 text-xs transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : isDone
                      ? 'text-emerald-600'
                      : 'text-muted-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="hidden sm:inline">
                  <Trans i18nKey={step.labelKey} />
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className={`mx-1 h-0.5 w-4 flex-shrink-0 rounded ${
                    isDone ? 'bg-emerald-500' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Auto-save indicator */}
      <div className="flex justify-end">
        <span className="text-muted-foreground text-xs">
          {saveStatus === 'saving' && <Trans i18nKey="esg:saving" />}
          {saveStatus === 'saved' && (
            <span className="text-emerald-600">
              <Trans i18nKey="esg:autoSaved" />
            </span>
          )}
        </span>
      </div>

      {/* Step content */}
      <Card>
        <CardContent className="p-6">
          {currentStep === 0 && (
            <StepCompanyInfo formData={formData} updateField={updateField} />
          )}
          {currentStep === 1 && (
            <StepScope1
              formData={formData}
              updateField={updateField}
              estimate={scope1}
            />
          )}
          {currentStep === 2 && (
            <StepScope2
              formData={formData}
              updateField={updateField}
              estimate={scope2}
            />
          )}
          {currentStep === 3 && (
            <StepScope3
              formData={formData}
              updateField={updateField}
              estimate={scope3}
              subscription={subscription}
            />
          )}
          {currentStep === 4 && (
            <StepSummary
              scope1={scope1}
              scope2={scope2}
              scope3={scope3}
              total={total}
              avoided={avoided}
              net={net}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={goBack} disabled={currentStep === 0}>
          <Trans i18nKey="esg:back" />
        </Button>

        <div className="flex gap-2">
          {currentStep === STEPS.length - 1 ? (
            <>
              <Button variant="outline" onClick={() => autoSave(formData)}>
                <Trans i18nKey="esg:save" />
              </Button>
              <Button onClick={handleGenerateReport} disabled={generating}>
                {generating ? (
                  <Trans i18nKey="esg:generating" />
                ) : (
                  <Trans i18nKey="esg:generateReport" />
                )}
              </Button>
            </>
          ) : (
            <Button onClick={goNext}>
              <Trans i18nKey="esg:next" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Form field helpers
// ---------------------------------------------------------------------------

function FormGroup({
  label,
  helpText,
  children,
}: {
  label: string;
  helpText?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">
        <Trans i18nKey={label} />
      </label>
      {children}
      {helpText && (
        <p className="text-muted-foreground text-xs">
          <Trans i18nKey={helpText} />
        </p>
      )}
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  min = 0,
  step = 1,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  step?: number;
}) {
  return (
    <input
      type="number"
      value={value || ''}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      min={min}
      step={step}
      className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors focus:ring-2 focus:outline-none"
    />
  );
}

function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; labelKey: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors focus:ring-2 focus:outline-none"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.labelKey}
        </option>
      ))}
    </select>
  );
}

function CO2Estimate({ value }: { value: number }) {
  return (
    <div className="mt-4 flex items-center gap-2 rounded-lg border border-dashed border-emerald-300 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/30">
      <Leaf className="h-4 w-4 text-emerald-600" />
      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
        <Trans i18nKey="esg:estimated" />: {value.toFixed(1)} kg CO2e
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 0: Company info
// ---------------------------------------------------------------------------

function StepCompanyInfo({
  formData,
  updateField,
}: {
  formData: ESGFormData;
  updateField: <K extends keyof ESGFormData>(k: K, v: ESGFormData[K]) => void;
}) {
  const t = useTranslations('esg');
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const sectors = [
    { value: 'industrie', labelKey: t('sectorIndustryLabel') },
    { value: 'btp', labelKey: t('sectorBtpLabel') },
    { value: 'logistique', labelKey: t('sectorLogistiqueLabel') },
    { value: 'commerce', labelKey: t('sectorCommerceLabel') },
    { value: 'services', labelKey: t('sectorServicesLabel') },
    { value: 'agroalimentaire', labelKey: t('sectorAgroLabel') },
    { value: 'autre', labelKey: t('sectorAutreLabel') },
  ];

  const periods = [
    { value: 'Q1', labelKey: t('periodQ1Label') },
    { value: 'Q2', labelKey: t('periodQ2Label') },
    { value: 'Q3', labelKey: t('periodQ3Label') },
    { value: 'Q4', labelKey: t('periodQ4Label') },
    { value: 'H1', labelKey: t('periodH1Label') },
    { value: 'H2', labelKey: t('periodH2Label') },
    { value: 'year', labelKey: t('periodYearLabel') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">
          <Trans i18nKey="esg:companyInfoLabel" />
        </h3>
        <p className="text-muted-foreground text-sm">
          <Trans i18nKey="esg:companyInfoDesc" />
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormGroup label="esg:yearLabel">
          <select
            value={formData.reporting_year}
            onChange={(e) =>
              updateField('reporting_year', Number(e.target.value))
            }
            className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors focus:ring-2 focus:outline-none"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </FormGroup>

        <FormGroup label="esg:reportingPeriod">
          <SelectInput
            value={formData.reporting_period}
            onChange={(v) => updateField('reporting_period', v)}
            options={periods}
          />
        </FormGroup>

        <FormGroup label="esg:employeesLabel">
          <NumberInput
            value={formData.nb_employees}
            onChange={(v) => updateField('nb_employees', v)}
          />
        </FormGroup>

        <FormGroup label="esg:surfaceLabel">
          <NumberInput
            value={formData.office_surface_m2}
            onChange={(v) => updateField('office_surface_m2', v)}
          />
        </FormGroup>

        <FormGroup label="esg:sectorLabel">
          <SelectInput
            value={formData.industry_sector}
            onChange={(v) => updateField('industry_sector', v)}
            options={sectors}
          />
        </FormGroup>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 1: Scope 1
// ---------------------------------------------------------------------------

function StepScope1({
  formData,
  updateField,
  estimate,
}: {
  formData: ESGFormData;
  updateField: <K extends keyof ESGFormData>(k: K, v: ESGFormData[K]) => void;
  estimate: number;
}) {
  const t = useTranslations('esg');
  const fuelTypes = [
    { value: 'diesel', labelKey: t('fuelTypeDiesel') },
    { value: 'essence', labelKey: t('fuelTypeEssence') },
    { value: 'gpl', labelKey: t('fuelTypeGpl') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">
          <Trans i18nKey="esg:scope1Label" />
        </h3>
        <p className="text-muted-foreground text-sm">
          <Trans i18nKey="esg:scope1Desc" />
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormGroup label="esg:naturalGasLabel" helpText="esg:naturalGasHelp">
          <NumberInput
            value={formData.scope1_natural_gas_kwh}
            onChange={(v) => updateField('scope1_natural_gas_kwh', v)}
          />
        </FormGroup>

        <FormGroup label="esg:fuelLabel">
          <NumberInput
            value={formData.scope1_fuel_liters}
            onChange={(v) => updateField('scope1_fuel_liters', v)}
          />
        </FormGroup>

        <FormGroup label="esg:fuelTypeLabel">
          <SelectInput
            value={formData.scope1_fuel_type}
            onChange={(v) => updateField('scope1_fuel_type', v)}
            options={fuelTypes}
          />
        </FormGroup>

        <FormGroup label="esg:otherScope1Label">
          <NumberInput
            value={formData.scope1_other_kg_co2}
            onChange={(v) => updateField('scope1_other_kg_co2', v)}
          />
        </FormGroup>
      </div>

      <CO2Estimate value={estimate} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 2: Scope 2
// ---------------------------------------------------------------------------

function StepScope2({
  formData,
  updateField,
  estimate,
}: {
  formData: ESGFormData;
  updateField: <K extends keyof ESGFormData>(k: K, v: ESGFormData[K]) => void;
  estimate: number;
}) {
  const t = useTranslations('esg');
  const sources = [
    { value: 'grid_fr', labelKey: t('sourceGridFrLabel') },
    { value: 'renewable', labelKey: t('sourceRenewableLabel') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">
          <Trans i18nKey="esg:scope2Label" />
        </h3>
        <p className="text-muted-foreground text-sm">
          <Trans i18nKey="esg:scope2Desc" />
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormGroup label="esg:electricityLabel" helpText="esg:electricityHelp">
          <NumberInput
            value={formData.scope2_electricity_kwh}
            onChange={(v) => updateField('scope2_electricity_kwh', v)}
          />
        </FormGroup>

        <FormGroup label="esg:electricitySourceLabel">
          <SelectInput
            value={formData.scope2_electricity_source}
            onChange={(v) => updateField('scope2_electricity_source', v)}
            options={sources}
          />
        </FormGroup>

        <FormGroup label="esg:heatingLabel">
          <NumberInput
            value={formData.scope2_heating_kwh}
            onChange={(v) => updateField('scope2_heating_kwh', v)}
          />
        </FormGroup>
      </div>

      <CO2Estimate value={estimate} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 3: Scope 3
// ---------------------------------------------------------------------------

function StepScope3({
  formData,
  updateField,
  estimate,
  subscription,
}: {
  formData: ESGFormData;
  updateField: <K extends keyof ESGFormData>(k: K, v: ESGFormData[K]) => void;
  estimate: number;
  subscription: ReturnType<typeof useSubscription>;
}) {
  const t = useTranslations('esg');

  if (!subscription.canAccess('scope3')) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold">
            <Trans i18nKey="esg:scope3Label" />
          </h3>
          <p className="text-muted-foreground text-sm">
            <Trans i18nKey="esg:scope3Desc" />
          </p>
        </div>
        <UpgradePrompt
          feature={t('scope3FeatureLabel')}
          requiredPlan={subscription.requiredPlan('scope3')}
        />
      </div>
    );
  }

  const travelModes = [
    { value: 'car', labelKey: t('travelCarLabel') },
    { value: 'train', labelKey: t('travelTrainLabel') },
    { value: 'plane', labelKey: t('travelPlaneLabel') },
    { value: 'mixed', labelKey: t('travelMixedLabel') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">
          <Trans i18nKey="esg:scope3Label" />
        </h3>
        <p className="text-muted-foreground text-sm">
          <Trans i18nKey="esg:scope3Desc" />
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormGroup label="esg:businessTravelLabel">
          <NumberInput
            value={formData.scope3_business_travel_km}
            onChange={(v) => updateField('scope3_business_travel_km', v)}
          />
        </FormGroup>

        <FormGroup label="esg:travelModeLabel">
          <SelectInput
            value={formData.scope3_travel_mode}
            onChange={(v) => updateField('scope3_travel_mode', v)}
            options={travelModes}
          />
        </FormGroup>

        <FormGroup label="esg:commutingEmployeesLabel">
          <NumberInput
            value={formData.scope3_commuting_employees}
            onChange={(v) => updateField('scope3_commuting_employees', v)}
          />
        </FormGroup>

        <FormGroup label="esg:commutingDistanceLabel">
          <NumberInput
            value={formData.scope3_commuting_avg_km}
            onChange={(v) => updateField('scope3_commuting_avg_km', v)}
          />
        </FormGroup>

        <FormGroup label="esg:purchasesLabel">
          <NumberInput
            value={formData.scope3_purchased_goods_eur}
            onChange={(v) => updateField('scope3_purchased_goods_eur', v)}
          />
        </FormGroup>

        <FormGroup label="esg:wasteLabel">
          <NumberInput
            value={formData.scope3_waste_tonnes}
            onChange={(v) => updateField('scope3_waste_tonnes', v)}
            step={0.1}
          />
        </FormGroup>
      </div>

      {/* Platform data (read-only) */}
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/30">
        <div className="mb-3 flex items-center gap-2">
          <Factory className="h-5 w-5 text-emerald-600" />
          <h4 className="font-semibold text-emerald-700 dark:text-emerald-300">
            <Trans i18nKey="esg:platformDataTitle" />
          </h4>
          <Badge
            variant={'outline'}
            className="border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300"
          >
            <Trans i18nKey="esg:platformVerified" />
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="text-sm">
            <span className="text-muted-foreground">
              <Trans i18nKey="esg:platformTonnes" />
            </span>
            <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
              {formData.platform_tonnes_recycled.toFixed(1)} t
            </p>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">
              <Trans i18nKey="esg:platformCO2" />
            </span>
            <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
              {formData.platform_co2_avoided.toFixed(1)} kg CO2e
            </p>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">
              <Trans i18nKey="esg:platformTx" />
            </span>
            <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
              {formData.platform_transactions_count}
            </p>
          </div>
        </div>
      </div>

      <CO2Estimate value={estimate} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 4: Summary
// ---------------------------------------------------------------------------

function StepSummary({
  scope1,
  scope2,
  scope3,
  total,
  avoided,
  net,
}: {
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
  avoided: number;
  net: number;
}) {
  const maxScope = Math.max(scope1, scope2, scope3, 1);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">
          <Trans i18nKey="esg:summaryTitle" />
        </h3>
        <p className="text-muted-foreground text-sm">
          <Trans i18nKey="esg:summaryDesc" />
        </p>
      </div>

      {/* Scope bars */}
      <div className="space-y-4">
        <ScopeSummaryBar
          label="Scope 1"
          value={scope1}
          max={maxScope}
          color="bg-[#E6F2ED]0"
          textColor="text-[#2D8C6A]"
        />
        <ScopeSummaryBar
          label="Scope 2"
          value={scope2}
          max={maxScope}
          color="bg-blue-500"
          textColor="text-blue-600"
        />
        <ScopeSummaryBar
          label="Scope 3"
          value={scope3}
          max={maxScope}
          color="bg-[#E6F2ED]0"
          textColor="text-[#2D8C6A]"
        />
      </div>

      {/* Totals */}
      <div className="rounded-lg border p-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              <Trans i18nKey="esg:scopeTotal" />
            </span>
            <span className="font-bold">{total.toFixed(1)} kg CO2e</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-emerald-600">
              <Trans i18nKey="esg:avoided" />
            </span>
            <span className="font-bold text-emerald-600">
              -{avoided.toFixed(1)} kg CO2e
            </span>
          </div>
          <div className="flex justify-between border-t pt-2 text-base">
            <span className="font-bold">
              <Trans i18nKey="esg:netEmissions" />
            </span>
            <span className="font-bold">{net.toFixed(1)} kg CO2e</span>
          </div>
          <div className="text-muted-foreground text-right text-xs">
            ({(net / 1000).toFixed(2)} t CO2e)
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-muted-foreground text-center text-sm">
        <Trans i18nKey="esg:estimated" />
      </div>
    </div>
  );
}

function ScopeSummaryBar({
  label,
  value,
  max,
  color,
  textColor,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  textColor: string;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;

  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className={`font-medium ${textColor}`}>{label}</span>
        <span className="font-semibold">{value.toFixed(1)} kg CO2e</span>
      </div>
      <div className="bg-muted h-3 overflow-hidden rounded-full">
        <div
          className={`h-full rounded-full ${color}`}
          style={{
            width: `${pct}%`,
            transition: 'width 0.5s ease-out',
          }}
        />
      </div>
    </div>
  );
}

'use client';

import { useCallback, useMemo, useState } from 'react';

import Link from 'next/link';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Heading } from '@kit/ui/heading';
import { Trans } from '@kit/ui/trans';

// --- Types ---

interface WizardAnswers {
  // Step 0: Profile
  sector: string;
  size: string;
  revenue: string;
  location: string;
  // Step 1: Governance
  rseCommittee: string;
  transparencyReport: string;
  stakeholderPolicy: string;
  antiCorruptionPolicy: string;
  // Step 2: Environment (additional)
  envManagementSystem: string;
  iso14001: string;
  // Step 3: Social
  satisfactionSurvey: string;
  trainingHours: string;
  diversityPolicy: string;
  healthSafety: string;
  // Step 4: Ethics
  codeOfEthics: string;
  supplierCode: string;
  whistleblower: string;
  antiCorruptionTraining: string;
  // Step 5: Stakeholders
  stakeholderMapping: string;
  dialogueProcess: string;
  communityEngagement: string;
  partnerships: string;
}

const INITIAL_ANSWERS: WizardAnswers = {
  sector: '',
  size: '',
  revenue: '',
  location: '',
  rseCommittee: '',
  transparencyReport: '',
  stakeholderPolicy: '',
  antiCorruptionPolicy: '',
  envManagementSystem: '',
  iso14001: '',
  satisfactionSurvey: '',
  trainingHours: '',
  diversityPolicy: '',
  healthSafety: '',
  codeOfEthics: '',
  supplierCode: '',
  whistleblower: '',
  antiCorruptionTraining: '',
  stakeholderMapping: '',
  dialogueProcess: '',
  communityEngagement: '',
  partnerships: '',
};

const STEP_LABELS = [
  'profileStep',
  'governanceStep',
  'environmentStep',
  'socialStep',
  'ethicsStep',
  'stakeholdersStep',
  'resultsStep',
] as const;

const TOTAL_STEPS = 7;

// Mock platform data for environment step
const PLATFORM_ENV_DATA = {
  co2Avoided: '545.5 t CO2',
  recycled: '306 t',
  lots: 30,
};

// Scoring yes/no questions per pillar
const GOVERNANCE_KEYS: (keyof WizardAnswers)[] = [
  'rseCommittee',
  'transparencyReport',
  'stakeholderPolicy',
  'antiCorruptionPolicy',
];
const ENVIRONMENT_KEYS: (keyof WizardAnswers)[] = [
  'envManagementSystem',
  'iso14001',
];
const SOCIAL_KEYS: (keyof WizardAnswers)[] = [
  'satisfactionSurvey',
  'trainingHours',
  'diversityPolicy',
  'healthSafety',
];
const ETHICS_KEYS: (keyof WizardAnswers)[] = [
  'codeOfEthics',
  'supplierCode',
  'whistleblower',
  'antiCorruptionTraining',
];
const STAKEHOLDERS_KEYS: (keyof WizardAnswers)[] = [
  'stakeholderMapping',
  'dialogueProcess',
  'communityEngagement',
  'partnerships',
];

function countYes(answers: WizardAnswers, keys: (keyof WizardAnswers)[]) {
  return keys.filter((k) => answers[k] === 'yes').length;
}

function computeScores(answers: WizardAnswers) {
  const governance = countYes(answers, GOVERNANCE_KEYS) * 5;
  // Environment: 2 questions * 5 + bonus from platform data (up to 10)
  const envQuestions = countYes(answers, ENVIRONMENT_KEYS) * 5;
  const envBonus = 20; // Mock: platform data always gives full bonus
  const environment = envQuestions + envBonus;
  const social = countYes(answers, SOCIAL_KEYS) * 5;
  const ethics = countYes(answers, ETHICS_KEYS) * 5;
  const stakeholders = countYes(answers, STAKEHOLDERS_KEYS) * 5;

  const raw = governance + environment + social + ethics + stakeholders;
  const maxScore = 120; // 4*20 + 10 + 20(env bonus) + 10(env questions)
  const normalized = Math.round((raw / maxScore) * 100);

  let level: string;
  let levelKey: string;
  if (normalized <= 40) {
    level = 'Debutant';
    levelKey = 'beginner';
  } else if (normalized <= 60) {
    level = 'Intermediaire';
    levelKey = 'intermediate';
  } else if (normalized <= 80) {
    level = 'Avance';
    levelKey = 'advanced';
  } else {
    level = 'Expert';
    levelKey = 'expert';
  }

  return {
    governance,
    environment,
    social,
    ethics,
    stakeholders,
    total: normalized,
    level,
    levelKey,
  };
}

// --- Radar Chart SVG ---

function RadarChart({
  scores,
}: {
  scores: {
    governance: number;
    environment: number;
    social: number;
    ethics: number;
    stakeholders: number;
  };
}) {
  const cx = 150;
  const cy = 150;
  const maxR = 100;
  const labels = [
    { key: 'governance', label: 'Gouvernance', max: 20 },
    { key: 'environment', label: 'Environnement', max: 30 },
    { key: 'social', label: 'Social', max: 20 },
    { key: 'ethics', label: 'Ethique', max: 20 },
    { key: 'stakeholders', label: 'Parties prenantes', max: 20 },
  ] as const;

  const angleStep = (2 * Math.PI) / labels.length;
  const startAngle = -Math.PI / 2;

  function getPoint(index: number, radius: number) {
    const angle = startAngle + index * angleStep;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  }

  // Grid circles
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  // Data polygon
  const dataPoints = labels.map((l, i) => {
    const val = scores[l.key] / l.max;
    const r = Math.min(val, 1) * maxR;
    return getPoint(i, r);
  });
  const dataPath =
    dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') +
    ' Z';

  return (
    <svg viewBox="0 0 300 300" className="mx-auto h-64 w-64 sm:h-72 sm:w-72">
      {/* Grid */}
      {gridLevels.map((level) => {
        const points = labels
          .map((_, i) => {
            const p = getPoint(i, maxR * level);
            return `${p.x},${p.y}`;
          })
          .join(' ');
        return (
          <polygon
            key={level}
            points={points}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
            className="dark:stroke-gray-700"
          />
        );
      })}

      {/* Axis lines */}
      {labels.map((_, i) => {
        const p = getPoint(i, maxR);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="#e5e7eb"
            strokeWidth="1"
            className="dark:stroke-gray-700"
          />
        );
      })}

      {/* Data polygon */}
      <polygon
        points={dataPoints.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="rgba(34,197,94,0.2)"
        stroke="#22C55E"
        strokeWidth="2"
      />

      {/* Labels */}
      {labels.map((l, i) => {
        const p = getPoint(i, maxR + 24);
        return (
          <text
            key={l.key}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-current text-[0.65rem]"
          >
            {l.label}
          </text>
        );
      })}

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#22C55E" />
      ))}
    </svg>
  );
}

// --- Select Field ---

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
    <Card>
      <CardContent className="flex flex-col gap-2 py-4">
        <label className="text-sm font-medium">{label}</label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border-input bg-background ring-offset-background focus:ring-ring rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
        >
          <option value="">--</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </CardContent>
    </Card>
  );
}

// --- Radio Field ---

function RadioField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-2 py-4">
        <label className="text-sm font-medium">{label}</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name={label}
              value="yes"
              checked={value === 'yes'}
              onChange={() => onChange('yes')}
              className="accent-green-600"
            />
            Oui
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name={label}
              value="no"
              checked={value === 'no'}
              onChange={() => onChange('no')}
              className="accent-red-500"
            />
            Non
          </label>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Main Wizard ---

export function DiagnosticWizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<WizardAnswers>(INITIAL_ANSWERS);

  const update = useCallback((key: keyof WizardAnswers, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  const scores = useMemo(() => computeScores(answers), [answers]);

  const canGoNext = step < TOTAL_STEPS - 1;
  const canGoBack = step > 0;

  // Label eligibility
  const labels = useMemo(
    () => [
      { name: 'B Corp', threshold: 80 },
      { name: 'GreenTech', threshold: 70 },
      { name: 'Label NR', threshold: 75 },
      { name: 'GEG Label', threshold: 80 },
    ],
    [],
  );

  // Strengths and improvements
  const pillarScores = [
    { name: 'Gouvernance', score: scores.governance, max: 20 },
    { name: 'Environnement', score: scores.environment, max: 30 },
    { name: 'Social', score: scores.social, max: 20 },
    { name: 'Ethique', score: scores.ethics, max: 20 },
    { name: 'Parties prenantes', score: scores.stakeholders, max: 20 },
  ];

  const sorted = [...pillarScores].sort(
    (a, b) => b.score / b.max - a.score / a.max,
  );
  const strengths = sorted.slice(0, 3);
  const improvements = [...sorted].reverse().slice(0, 3);

  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(false);

  const handleDownloadReport = useCallback(async () => {
    setDownloading(true);
    setDownloadError(false);

    try {
      const response = await fetch('/api/reports/rse-diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scores,
          labels,
          strengths,
          improvements,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate report');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      const disposition = response.headers.get('Content-Disposition');
      const filenameMatch = disposition?.match(/filename="(.+)"/);
      a.download = filenameMatch?.[1] ?? 'Diagnostic-RSE-GreenEcoGenius.pdf';

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setDownloadError(true);
    } finally {
      setDownloading(false);
    }
  }, [scores, labels, strengths, improvements]);

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            <Trans i18nKey="rse:step" /> {step + 1} <Trans i18nKey="rse:of" />{' '}
            {TOTAL_STEPS}
          </span>
          <span className="text-muted-foreground">
            <Trans i18nKey={`rse:${STEP_LABELS[step]}`} />
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-300"
            style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {step === 0 && <ProfileStep answers={answers} update={update} />}
        {step === 1 && <GovernanceStep answers={answers} update={update} />}
        {step === 2 && <EnvironmentStep answers={answers} update={update} />}
        {step === 3 && <SocialStep answers={answers} update={update} />}
        {step === 4 && <EthicsStep answers={answers} update={update} />}
        {step === 5 && <StakeholdersStep answers={answers} update={update} />}
        {step === 6 && (
          <ResultsStep
            scores={scores}
            labels={labels}
            strengths={strengths}
            improvements={improvements}
            onDownload={handleDownloadReport}
            downloading={downloading}
            downloadError={downloadError}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        {canGoBack ? (
          <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
            <Trans i18nKey="rse:back" />
          </Button>
        ) : (
          <div />
        )}
        {canGoNext && (
          <Button onClick={() => setStep((s) => s + 1)}>
            <Trans i18nKey="rse:next" />
          </Button>
        )}
      </div>
    </div>
  );
}

// --- Step Components ---

function ProfileStep({
  answers,
  update,
}: {
  answers: WizardAnswers;
  update: (k: keyof WizardAnswers, v: string) => void;
}) {
  return (
    <div className="space-y-4">
      <Heading level={4}>
        <Trans i18nKey="rse:profileStep" />
      </Heading>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Secteur d'activite"
          value={answers.sector}
          onChange={(v) => update('sector', v)}
          options={[
            { value: 'tech', label: 'Technologie' },
            { value: 'industry', label: 'Industrie' },
            { value: 'services', label: 'Services' },
            { value: 'agriculture', label: 'Agriculture' },
            { value: 'commerce', label: 'Commerce' },
            { value: 'construction', label: 'Construction' },
            { value: 'transport', label: 'Transport' },
            { value: 'other', label: 'Autre' },
          ]}
        />
        <SelectField
          label="Taille de l'entreprise"
          value={answers.size}
          onChange={(v) => update('size', v)}
          options={[
            { value: '1-10', label: '1-10 employes' },
            { value: '11-50', label: '11-50 employes' },
            { value: '51-250', label: '51-250 employes' },
            { value: '251-500', label: '251-500 employes' },
            { value: '500+', label: '500+ employes' },
          ]}
        />
        <SelectField
          label="Chiffre d'affaires"
          value={answers.revenue}
          onChange={(v) => update('revenue', v)}
          options={[
            { value: '<1M', label: '< 1M EUR' },
            { value: '1-10M', label: '1-10M EUR' },
            { value: '10-50M', label: '10-50M EUR' },
            { value: '50-200M', label: '50-200M EUR' },
            { value: '>200M', label: '> 200M EUR' },
          ]}
        />
        <SelectField
          label="Localisation"
          value={answers.location}
          onChange={(v) => update('location', v)}
          options={[
            { value: 'france', label: 'France' },
            { value: 'europe', label: 'Europe (hors France)' },
            { value: 'international', label: 'International' },
          ]}
        />
      </div>
    </div>
  );
}

function GovernanceStep({
  answers,
  update,
}: {
  answers: WizardAnswers;
  update: (k: keyof WizardAnswers, v: string) => void;
}) {
  return (
    <div className="space-y-4">
      <Heading level={4}>
        <Trans i18nKey="rse:governanceStep" />
      </Heading>
      <div className="grid gap-4 sm:grid-cols-2">
        <RadioField
          label="Comite RSE au conseil d'administration ?"
          value={answers.rseCommittee}
          onChange={(v) => update('rseCommittee', v)}
        />
        <RadioField
          label="Rapport de transparence publie ?"
          value={answers.transparencyReport}
          onChange={(v) => update('transparencyReport', v)}
        />
        <RadioField
          label="Politique d'engagement parties prenantes ?"
          value={answers.stakeholderPolicy}
          onChange={(v) => update('stakeholderPolicy', v)}
        />
        <RadioField
          label="Politique anti-corruption ?"
          value={answers.antiCorruptionPolicy}
          onChange={(v) => update('antiCorruptionPolicy', v)}
        />
      </div>
    </div>
  );
}

function EnvironmentStep({
  answers,
  update,
}: {
  answers: WizardAnswers;
  update: (k: keyof WizardAnswers, v: string) => void;
}) {
  return (
    <div className="space-y-4">
      <Heading level={4}>
        <Trans i18nKey="rse:environmentStep" />
      </Heading>

      {/* Pre-filled platform data */}
      <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm text-green-800 dark:text-green-300">
            <Trans i18nKey="rse:preFilledFromPlatform" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-green-700 dark:text-green-400">
                {PLATFORM_ENV_DATA.co2Avoided}
              </p>
              <p className="text-muted-foreground text-xs">CO2 evite</p>
            </div>
            <div>
              <p className="text-lg font-bold text-green-700 dark:text-green-400">
                {PLATFORM_ENV_DATA.recycled}
              </p>
              <p className="text-muted-foreground text-xs">Recyclees</p>
            </div>
            <div>
              <p className="text-lg font-bold text-green-700 dark:text-green-400">
                {PLATFORM_ENV_DATA.lots}
              </p>
              <p className="text-muted-foreground text-xs">Lots traces</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <RadioField
          label="Systeme de management environnemental en place ?"
          value={answers.envManagementSystem}
          onChange={(v) => update('envManagementSystem', v)}
        />
        <RadioField
          label="Certification ISO 14001 ?"
          value={answers.iso14001}
          onChange={(v) => update('iso14001', v)}
        />
      </div>
    </div>
  );
}

function SocialStep({
  answers,
  update,
}: {
  answers: WizardAnswers;
  update: (k: keyof WizardAnswers, v: string) => void;
}) {
  return (
    <div className="space-y-4">
      <Heading level={4}>
        <Trans i18nKey="rse:socialStep" />
      </Heading>
      <div className="grid gap-4 sm:grid-cols-2">
        <RadioField
          label="Enquete de satisfaction employes ?"
          value={answers.satisfactionSurvey}
          onChange={(v) => update('satisfactionSurvey', v)}
        />
        <RadioField
          label="Heures de formation par employe tracees ?"
          value={answers.trainingHours}
          onChange={(v) => update('trainingHours', v)}
        />
        <RadioField
          label="Politique diversite et inclusion ?"
          value={answers.diversityPolicy}
          onChange={(v) => update('diversityPolicy', v)}
        />
        <RadioField
          label="Programme sante et securite au travail ?"
          value={answers.healthSafety}
          onChange={(v) => update('healthSafety', v)}
        />
      </div>
    </div>
  );
}

function EthicsStep({
  answers,
  update,
}: {
  answers: WizardAnswers;
  update: (k: keyof WizardAnswers, v: string) => void;
}) {
  return (
    <div className="space-y-4">
      <Heading level={4}>
        <Trans i18nKey="rse:ethicsStep" />
      </Heading>
      <div className="grid gap-4 sm:grid-cols-2">
        <RadioField
          label="Code d'ethique formalise ?"
          value={answers.codeOfEthics}
          onChange={(v) => update('codeOfEthics', v)}
        />
        <RadioField
          label="Code de conduite fournisseurs ?"
          value={answers.supplierCode}
          onChange={(v) => update('supplierCode', v)}
        />
        <RadioField
          label="Mecanisme de signalement (whistleblower) ?"
          value={answers.whistleblower}
          onChange={(v) => update('whistleblower', v)}
        />
        <RadioField
          label="Formation anti-corruption ?"
          value={answers.antiCorruptionTraining}
          onChange={(v) => update('antiCorruptionTraining', v)}
        />
      </div>
    </div>
  );
}

function StakeholdersStep({
  answers,
  update,
}: {
  answers: WizardAnswers;
  update: (k: keyof WizardAnswers, v: string) => void;
}) {
  return (
    <div className="space-y-4">
      <Heading level={4}>
        <Trans i18nKey="rse:stakeholdersStep" />
      </Heading>
      <div className="grid gap-4 sm:grid-cols-2">
        <RadioField
          label="Cartographie des parties prenantes ?"
          value={answers.stakeholderMapping}
          onChange={(v) => update('stakeholderMapping', v)}
        />
        <RadioField
          label="Processus de dialogue structure ?"
          value={answers.dialogueProcess}
          onChange={(v) => update('dialogueProcess', v)}
        />
        <RadioField
          label="Engagement communautaire ?"
          value={answers.communityEngagement}
          onChange={(v) => update('communityEngagement', v)}
        />
        <RadioField
          label="Partenariats avec ONG ou institutions ?"
          value={answers.partnerships}
          onChange={(v) => update('partnerships', v)}
        />
      </div>
    </div>
  );
}

function ResultsStep({
  scores,
  labels,
  strengths,
  improvements,
  onDownload,
  downloading,
  downloadError,
}: {
  scores: {
    governance: number;
    environment: number;
    social: number;
    ethics: number;
    stakeholders: number;
    total: number;
    level: string;
    levelKey: string;
  };
  labels: { name: string; threshold: number }[];
  strengths: { name: string; score: number; max: number }[];
  improvements: { name: string; score: number; max: number }[];
  onDownload: () => void;
  downloading: boolean;
  downloadError: boolean;
}) {
  function getLevelColor(levelKey: string) {
    switch (levelKey) {
      case 'beginner':
        return 'bg-slate-500';
      case 'intermediate':
        return 'bg-teal-500';
      case 'advanced':
        return 'bg-teal-500';
      case 'expert':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  }

  return (
    <div className="space-y-6">
      <Heading level={4}>
        <Trans i18nKey="rse:resultsStep" />
      </Heading>

      {/* Score + Level */}
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-8">
          <div className="text-6xl font-bold">{scores.total}</div>
          <p className="text-muted-foreground text-sm">/ 100</p>
          <Badge className={`${getLevelColor(scores.levelKey)} text-white`}>
            <Trans i18nKey="rse:level" /> :{' '}
            <Trans i18nKey={`rse:${scores.levelKey}`} />
          </Badge>
        </CardContent>
      </Card>

      {/* Radar Chart */}
      <Card>
        <CardContent className="py-6">
          <RadarChart scores={scores} />
        </CardContent>
      </Card>

      {/* Strengths + Improvements */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              <Trans i18nKey="rse:strengths" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {strengths.map((s) => (
                <li
                  key={s.name}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{s.name}</span>
                  <Badge variant="outline">
                    {s.score}/{s.max}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              <Trans i18nKey="rse:improvements" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {improvements.map((s) => (
                <li
                  key={s.name}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{s.name}</span>
                  <Badge variant="outline">
                    {s.score}/{s.max}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Label Eligibility */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            <Trans i18nKey="rse:labelEligibility" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {labels.map((l) => {
              const eligible = scores.total >= l.threshold;
              return (
                <div
                  key={l.name}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <span className="text-sm font-medium">{l.name}</span>
                  <Badge
                    variant={eligible ? 'default' : 'outline'}
                    className={eligible ? 'bg-green-500 text-white' : ''}
                  >
                    {eligible ? 'Eligible' : `${l.threshold} requis`}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant={downloadError ? 'destructive' : 'outline'}
          onClick={onDownload}
          disabled={downloading}
        >
          {downloading ? (
            'Telechargement...'
          ) : downloadError ? (
            'Erreur, reessayez'
          ) : (
            <Trans i18nKey="rse:downloadReport" />
          )}
        </Button>
        <Button render={<Link href="/home/rse/roadmap" />} nativeButton={false}>
          <Trans i18nKey="rse:viewRoadmap" />
        </Button>
      </div>
    </div>
  );
}

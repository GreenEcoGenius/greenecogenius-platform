// Mock data for ESG Reporting dashboard.
// All interfaces mirror API response shapes so swapping to real data is straightforward.

export type SourceType = 'auto' | 'manual' | 'blockchain';
export type SectionStatus = 'complete' | 'partial' | 'missing';

export interface EsgKpiData {
  totalEmissionsT: number;
  co2AvoidedT: number;
  autoFilledFields: number;
  totalFields: number;
  csrdCompliancePct: number;
  blockchainProofs: number;
}

export interface SectionField {
  label: string;
  value: string;
  source: SourceType;
  sourceLabel?: string;
  sourceLink?: string;
  complete: boolean;
}

export interface ReportSection {
  id: string;
  titleKey: string;
  esrsCode?: string;
  completionPct: number;
  sources: SourceType[];
  status: SectionStatus;
  description?: string;
  fields: SectionField[];
  linkHref?: string;
  linkLabelKey?: string;
  wizardStep?: number;
  estimatedMinutes?: number;
  blockchainHash?: string;
}

export interface CsrdIndicator {
  code: string;
  name: string;
  category: 'environment' | 'social' | 'governance';
  completionPct: number;
  itemsTotal: number;
  itemsComplete: number;
}

export interface ReportHistoryItem {
  id: string;
  period: string;
  format: string;
  status: 'draft' | 'finalized';
  completionPct: number;
  totalEmissionsT: number;
  blockchainProofs: number;
  createdAt: string;
  hash?: string;
}

export interface AiInsight {
  id: string;
  type: 'strength' | 'warning' | 'tip' | 'trend';
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

// ---------- Constants ----------

export const MOCK_KPI: EsgKpiData = {
  totalEmissionsT: 66.3,
  co2AvoidedT: 545.5,
  autoFilledFields: 42,
  totalFields: 48,
  csrdCompliancePct: 72,
  blockchainProofs: 14,
};

export const MOCK_SECTIONS: ReportSection[] = [
  {
    id: 'carbon-balance',
    titleKey: 'esg:carbonBalance',
    esrsCode: 'E1-6',
    completionPct: 94,
    sources: ['auto', 'blockchain'],
    status: 'complete',
    description:
      'Bilan carbone complet Scopes 1, 2 et 3 selon le GHG Protocol.',
    blockchainHash: '0xa7f3d2e1b9c4f5a6',
    fields: [
      {
        label: 'Scope 1 -- Emissions directes',
        value: '12.4 t',
        source: 'auto',
        sourceLabel: 'Impact Carbone',
        sourceLink: '/home/carbon',
        complete: true,
      },
      {
        label: 'Scope 2 -- Energie achetee',
        value: '8.7 t',
        source: 'auto',
        sourceLabel: 'Impact Carbone',
        sourceLink: '/home/carbon',
        complete: true,
      },
      {
        label: 'Scope 3 -- Chaine de valeur',
        value: '45.2 t (78%)',
        source: 'auto',
        complete: false,
      },
      {
        label: 'Cat. 1 Achats',
        value: '12 400 EUR',
        source: 'auto',
        sourceLabel: 'Le Comptoir',
        sourceLink: '/home/marketplace',
        complete: true,
      },
      {
        label: 'Cat. 4 Transport amont',
        value: '2 340 km',
        source: 'blockchain',
        sourceLabel: 'Tracabilite',
        sourceLink: '/home/traceability',
        complete: true,
      },
      {
        label: 'Cat. 5 Dechets',
        value: '8.2 t',
        source: 'auto',
        sourceLabel: 'Le Comptoir',
        sourceLink: '/home/marketplace',
        complete: true,
      },
      {
        label: 'Cat. 6 Deplacements pro',
        value: '--',
        source: 'manual',
        complete: false,
      },
      {
        label: 'Cat. 9 Transport aval',
        value: '1 120 km',
        source: 'blockchain',
        sourceLabel: 'Tracabilite',
        sourceLink: '/home/traceability',
        complete: true,
      },
      {
        label: 'Cat. 11 Utilisation produits',
        value: '--',
        source: 'manual',
        complete: false,
      },
    ],
    linkHref: '/home/carbon',
    linkLabelKey: 'esg:viewInCarbon',
    wizardStep: 1,
  },
  {
    id: 'circular-economy',
    titleKey: 'esg:circularEconomy',
    esrsCode: 'E5',
    completionPct: 98,
    sources: ['auto', 'blockchain'],
    status: 'complete',
    description:
      'Section quasi-entierement auto-remplie grace au Comptoir Circulaire et a la Tracabilite blockchain.',
    fields: [
      {
        label: 'Tonnes recyclees',
        value: '306.6 t',
        source: 'auto',
        sourceLabel: 'Le Comptoir',
        sourceLink: '/home/marketplace',
        complete: true,
      },
      {
        label: 'Lots traces blockchain',
        value: '30',
        source: 'blockchain',
        sourceLabel: 'Tracabilite',
        sourceLink: '/home/traceability',
        complete: true,
      },
      {
        label: 'Taux de circularite',
        value: '67%',
        source: 'auto',
        sourceLabel: 'Calcule',
        complete: true,
      },
      {
        label: 'CO2 evite par recyclage',
        value: '545.5 t',
        source: 'blockchain',
        sourceLabel: 'Tracabilite',
        sourceLink: '/home/traceability',
        complete: true,
      },
      {
        label: 'Matieres par type',
        value: 'Detail disponible',
        source: 'auto',
        sourceLabel: 'Le Comptoir',
        sourceLink: '/home/marketplace',
        complete: true,
      },
    ],
    linkHref: '/home/traceability',
    linkLabelKey: 'esg:viewInTraceability',
  },
  {
    id: 'climate-change',
    titleKey: 'esg:climateChange',
    esrsCode: 'E1',
    completionPct: 72,
    sources: ['auto', 'manual'],
    status: 'partial',
    fields: [
      {
        label: 'Plan de transition climatique',
        value: '--',
        source: 'manual',
        complete: false,
      },
      {
        label: 'Politiques climat',
        value: 'Defini',
        source: 'auto',
        complete: true,
      },
      {
        label: 'Objectifs de reduction',
        value: "-30% d'ici 2028",
        source: 'auto',
        complete: true,
      },
      {
        label: 'Emissions GES Scope 1/2/3',
        value: '66.3 t',
        source: 'auto',
        complete: true,
      },
      {
        label: 'Tarification interne carbone',
        value: '--',
        source: 'manual',
        complete: false,
      },
    ],
    linkHref: '/home/esg/wizard?step=1',
    linkLabelKey: 'esg:completeFields',
    wizardStep: 1,
    estimatedMinutes: 10,
  },
  {
    id: 'social-impact',
    titleKey: 'esg:socialImpact',
    esrsCode: 'S1-S4',
    completionPct: 45,
    sources: ['manual'],
    status: 'partial',
    fields: [
      { label: 'Effectifs', value: '--', source: 'manual', complete: false },
      {
        label: 'Conditions de travail',
        value: '--',
        source: 'manual',
        complete: false,
      },
      { label: 'Formation', value: '--', source: 'manual', complete: false },
      { label: 'Diversite', value: '--', source: 'manual', complete: false },
    ],
    linkHref: '/home/esg/wizard?step=4',
    linkLabelKey: 'esg:completeFields',
    wizardStep: 4,
    estimatedMinutes: 15,
  },
  {
    id: 'governance',
    titleKey: 'esg:governance',
    esrsCode: 'G1',
    completionPct: 60,
    sources: ['manual'],
    status: 'partial',
    fields: [
      {
        label: 'Structure de gouvernance',
        value: 'Defini',
        source: 'manual',
        complete: true,
      },
      { label: 'Comite RSE', value: '--', source: 'manual', complete: false },
      {
        label: 'Ethique et anti-corruption',
        value: 'Partiel',
        source: 'manual',
        complete: false,
      },
    ],
    linkHref: '/home/esg/wizard?step=5',
    linkLabelKey: 'esg:completeFields',
    wizardStep: 5,
    estimatedMinutes: 10,
  },
  {
    id: 'objectives',
    titleKey: 'esg:objectivesTrajectory',
    completionPct: 80,
    sources: ['auto'],
    status: 'partial',
    fields: [
      {
        label: 'Objectifs SBTi',
        value: "-30% d'ici 2028",
        source: 'auto',
        complete: true,
      },
      {
        label: 'Plan de reduction',
        value: 'Actif',
        source: 'auto',
        complete: true,
      },
      {
        label: 'Feuille de route RSE',
        value: 'En cours',
        source: 'auto',
        complete: true,
      },
    ],
    linkHref: '/home/rse/roadmap',
    linkLabelKey: 'esg:viewRoadmap',
  },
  {
    id: 'methodology',
    titleKey: 'esg:methodology',
    completionPct: 100,
    sources: ['auto'],
    status: 'complete',
    fields: [
      {
        label: 'Methodologie de calcul',
        value: 'GHG Protocol',
        source: 'auto',
        complete: true,
      },
      {
        label: "Facteurs d'emission",
        value: 'ADEME 2024',
        source: 'auto',
        complete: true,
      },
      {
        label: 'Preuves blockchain',
        value: '14 hash on-chain',
        source: 'blockchain',
        complete: true,
      },
    ],
  },
];

export const MOCK_CSRD_INDICATORS: CsrdIndicator[] = [
  {
    code: 'E1',
    name: 'Changement climatique',
    category: 'environment',
    completionPct: 82,
    itemsTotal: 9,
    itemsComplete: 7,
  },
  {
    code: 'E2',
    name: 'Pollution',
    category: 'environment',
    completionPct: 58,
    itemsTotal: 6,
    itemsComplete: 3,
  },
  {
    code: 'E3',
    name: 'Eau et ressources marines',
    category: 'environment',
    completionPct: 48,
    itemsTotal: 5,
    itemsComplete: 2,
  },
  {
    code: 'E4',
    name: 'Biodiversite',
    category: 'environment',
    completionPct: 40,
    itemsTotal: 5,
    itemsComplete: 2,
  },
  {
    code: 'E5',
    name: 'Economie circulaire',
    category: 'environment',
    completionPct: 98,
    itemsTotal: 6,
    itemsComplete: 6,
  },
  {
    code: 'S1',
    name: "Main-d'oeuvre propre",
    category: 'social',
    completionPct: 45,
    itemsTotal: 8,
    itemsComplete: 4,
  },
  {
    code: 'S2',
    name: 'Chaine de valeur',
    category: 'social',
    completionPct: 72,
    itemsTotal: 5,
    itemsComplete: 4,
  },
  {
    code: 'G1',
    name: 'Conduite des affaires',
    category: 'governance',
    completionPct: 65,
    itemsTotal: 6,
    itemsComplete: 4,
  },
];

export const MOCK_REPORT_HISTORY: ReportHistoryItem[] = [
  {
    id: 'rpt-001',
    period: 'T1 2026',
    format: 'GHG Protocol',
    status: 'draft',
    completionPct: 72,
    totalEmissionsT: 66.3,
    blockchainProofs: 14,
    createdAt: '2026-03-31',
  },
  {
    id: 'rpt-002',
    period: 'T4 2025',
    format: 'GHG Protocol',
    status: 'finalized',
    completionPct: 100,
    totalEmissionsT: 58.1,
    blockchainProofs: 8,
    createdAt: '2026-01-15',
    hash: '0xb3c4d5e6f7a8b9c0',
  },
  {
    id: 'rpt-003',
    period: 'T3 2025',
    format: 'GHG Protocol',
    status: 'finalized',
    completionPct: 100,
    totalEmissionsT: 61.7,
    blockchainProofs: 5,
    createdAt: '2025-10-10',
    hash: '0xa1b2c3d4e5f6a7b8',
  },
];

export const MOCK_AI_INSIGHTS: AiInsight[] = [
  {
    id: 'ins-1',
    type: 'strength',
    title: 'ESRS E5 a 98%',
    description:
      'Votre economie circulaire est votre point fort. Mettez-le en avant dans vos communications ESG.',
  },
  {
    id: 'ins-2',
    type: 'warning',
    title: 'ESRS S1 a 45%',
    description:
      "Le pilier social est le plus faible. L'IA peut vous guider pour completer en ~15 minutes.",
    actionLabel: 'Completer ESRS S1',
    actionHref: '/home/esg/wizard?step=4',
  },
  {
    id: 'ins-3',
    type: 'trend',
    title: '+8% vs T4 2025',
    description:
      'Votre completude a augmente principalement grace aux nouvelles transactions du Comptoir.',
  },
  {
    id: 'ins-4',
    type: 'tip',
    title: '6 champs restants',
    description:
      'Completez les 6 champs restants pour pouvoir generer un rapport CSRD conforme a 100%.',
    actionLabel: 'Completer maintenant',
    actionHref: '/home/esg/wizard',
  },
];

export const REPORT_FORMATS = [
  {
    id: 'ghg_protocol',
    name: 'GHG Protocol',
    description: 'Bilan carbone complet',
    available: true,
    plan: 'all',
  },
  {
    id: 'csrd',
    name: 'CSRD / ESRS',
    description: 'Rapport durabilite complet',
    available: false,
    plan: 'avance',
  },
  {
    id: 'gri',
    name: 'GRI Standards',
    description: 'Standards 301/305/306',
    available: false,
    plan: 'avance',
  },
  {
    id: 'cdp',
    name: 'CDP Climate',
    description: 'Questionnaires climat',
    available: false,
    plan: 'enterprise',
  },
] as const;

export type ReportFormatId = (typeof REPORT_FORMATS)[number]['id'];

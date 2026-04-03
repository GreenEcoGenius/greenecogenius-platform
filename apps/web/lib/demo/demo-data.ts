/**
 * Centralized demo data for all platform sections.
 * Used when NEXT_PUBLIC_DEMO_MODE=true or when a section has no real data.
 * Move all hardcoded MOCK_* values here so they can be toggled globally.
 */

// ─── Shared types ────────────────────────────────────────────────────

export type SourceType = 'auto' | 'manual' | 'blockchain';
export type SectionStatus = 'complete' | 'partial' | 'missing';

export interface DemoSectionField {
  label: string;
  value: string;
  source: SourceType;
  sourceLabel?: string;
  sourceLink?: string;
  complete: boolean;
}

export interface DemoReportSection {
  id: string;
  titleKey: string;
  esrsCode?: string;
  completionPct: number;
  sources: SourceType[];
  status: SectionStatus;
  description?: string;
  fields: DemoSectionField[];
  linkHref?: string;
  linkLabelKey?: string;
  wizardStep?: number;
  estimatedMinutes?: number;
  blockchainHash?: string;
}

// ─── DEMO DATA ──────────────────────────────────────────────────────

export const DEMO_DATA = {
  // ── Dashboard ───────────────────────────────────────────────────
  dashboard: {
    co2Avoided: '545.5 t',
    tonsRecycled: '306.6 t',
    tracedLots: '30',
    circularityScore: '67%',
    complianceScore: '78%',
    compliantStandards: '28/42',
    rseScore: '62/100',
    esgReporting: '72%',
    rseBadge: '+8 pts',
  },

  // ── Carbon ──────────────────────────────────────────────────────
  carbon: {
    totalAvoided: 545500,
    totalTransport: 3200,
    totalNet: 542300,
    totalWeightKg: 17600,
    monthlyData: [
      { month: '2025-10', co2_avoided: 8200, co2_transport: 420, co2_net: 7780 },
      { month: '2025-11', co2_avoided: 12500, co2_transport: 680, co2_net: 11820 },
      { month: '2025-12', co2_avoided: 15800, co2_transport: 890, co2_net: 14910 },
      { month: '2026-01', co2_avoided: 18200, co2_transport: 950, co2_net: 17250 },
      { month: '2026-02', co2_avoided: 22400, co2_transport: 1100, co2_net: 21300 },
      { month: '2026-03', co2_avoided: 28000, co2_transport: 1350, co2_net: 26650 },
    ],
    materialData: [
      { category: 'Plastique', co2_avoided: 18500, weight: 4200 },
      { category: 'Métal', co2_avoided: 15200, weight: 3800 },
      { category: 'Bois', co2_avoided: 8700, weight: 5100 },
      { category: 'Papier', co2_avoided: 6200, weight: 2900 },
      { category: 'Textile', co2_avoided: 4800, weight: 1600 },
    ],
    scopes: {
      scope1: 12.4,
      scope2: 8.7,
      scope3: 45.2,
    },
    scopeProgress: {
      scope1: 65,
      scope2: 80,
      scope3: 73,
    },
  },

  // ── ESG ─────────────────────────────────────────────────────────
  esg: {
    kpi: {
      totalEmissionsT: 66.3,
      co2AvoidedT: 545.5,
      autoFilledFields: 42,
      totalFields: 48,
      csrdCompliancePct: 72,
      blockchainProofs: 14,
    },
    sections: [
      {
        id: 'carbon-balance',
        titleKey: 'esg:carbonBalance',
        esrsCode: 'E1-6',
        completionPct: 94,
        sources: ['auto', 'blockchain'] as SourceType[],
        status: 'complete' as SectionStatus,
        description: 'Bilan carbone complet Scopes 1, 2 et 3 selon le GHG Protocol.',
        blockchainHash: '0xa7f3d2e1b9c4f5a6',
        fields: [
          { label: 'Scope 1 -- Emissions directes', value: '12.4 t', source: 'auto' as SourceType, sourceLabel: 'Impact Carbone', sourceLink: '/home/carbon', complete: true },
          { label: 'Scope 2 -- Energie achetee', value: '8.7 t', source: 'auto' as SourceType, sourceLabel: 'Impact Carbone', sourceLink: '/home/carbon', complete: true },
          { label: 'Scope 3 -- Chaine de valeur', value: '45.2 t (78%)', source: 'auto' as SourceType, complete: false },
          { label: 'Cat. 1 Achats', value: '12 400 EUR', source: 'auto' as SourceType, sourceLabel: 'Le Comptoir', sourceLink: '/home/marketplace', complete: true },
          { label: 'Cat. 4 Transport amont', value: '2 340 km', source: 'blockchain' as SourceType, sourceLabel: 'Tracabilite', sourceLink: '/home/traceability', complete: true },
          { label: 'Cat. 5 Dechets', value: '8.2 t', source: 'auto' as SourceType, sourceLabel: 'Le Comptoir', sourceLink: '/home/marketplace', complete: true },
          { label: 'Cat. 6 Deplacements pro', value: '--', source: 'manual' as SourceType, complete: false },
          { label: 'Cat. 9 Transport aval', value: '1 120 km', source: 'blockchain' as SourceType, sourceLabel: 'Tracabilite', sourceLink: '/home/traceability', complete: true },
          { label: 'Cat. 11 Utilisation produits', value: '--', source: 'manual' as SourceType, complete: false },
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
        sources: ['auto', 'blockchain'] as SourceType[],
        status: 'complete' as SectionStatus,
        description: 'Section quasi-entierement auto-remplie grace au Comptoir Circulaire et a la Tracabilite blockchain.',
        fields: [
          { label: 'Tonnes recyclees', value: '306.6 t', source: 'auto' as SourceType, sourceLabel: 'Le Comptoir', sourceLink: '/home/marketplace', complete: true },
          { label: 'Lots traces blockchain', value: '30', source: 'blockchain' as SourceType, sourceLabel: 'Tracabilite', sourceLink: '/home/traceability', complete: true },
          { label: 'Taux de circularite', value: '67%', source: 'auto' as SourceType, sourceLabel: 'Calcule', complete: true },
          { label: 'CO2 evite par recyclage', value: '545.5 t', source: 'blockchain' as SourceType, sourceLabel: 'Tracabilite', sourceLink: '/home/traceability', complete: true },
          { label: 'Matieres par type', value: 'Detail disponible', source: 'auto' as SourceType, sourceLabel: 'Le Comptoir', sourceLink: '/home/marketplace', complete: true },
        ],
        linkHref: '/home/traceability',
        linkLabelKey: 'esg:viewInTraceability',
      },
      {
        id: 'climate-change',
        titleKey: 'esg:climateChange',
        esrsCode: 'E1',
        completionPct: 72,
        sources: ['auto', 'manual'] as SourceType[],
        status: 'partial' as SectionStatus,
        fields: [
          { label: 'Plan de transition climatique', value: '--', source: 'manual' as SourceType, complete: false },
          { label: 'Politiques climat', value: 'Defini', source: 'auto' as SourceType, complete: true },
          { label: 'Objectifs de reduction', value: "-30% d'ici 2028", source: 'auto' as SourceType, complete: true },
          { label: 'Emissions GES Scope 1/2/3', value: '66.3 t', source: 'auto' as SourceType, complete: true },
          { label: 'Tarification interne carbone', value: '--', source: 'manual' as SourceType, complete: false },
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
        sources: ['manual'] as SourceType[],
        status: 'partial' as SectionStatus,
        fields: [
          { label: 'Effectifs', value: '--', source: 'manual' as SourceType, complete: false },
          { label: 'Conditions de travail', value: '--', source: 'manual' as SourceType, complete: false },
          { label: 'Formation', value: '--', source: 'manual' as SourceType, complete: false },
          { label: 'Diversite', value: '--', source: 'manual' as SourceType, complete: false },
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
        sources: ['manual'] as SourceType[],
        status: 'partial' as SectionStatus,
        fields: [
          { label: 'Structure de gouvernance', value: 'Defini', source: 'manual' as SourceType, complete: true },
          { label: 'Comite RSE', value: '--', source: 'manual' as SourceType, complete: false },
          { label: 'Ethique et anti-corruption', value: 'Partiel', source: 'manual' as SourceType, complete: false },
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
        sources: ['auto'] as SourceType[],
        status: 'partial' as SectionStatus,
        fields: [
          { label: 'Objectifs SBTi', value: "-30% d'ici 2028", source: 'auto' as SourceType, complete: true },
          { label: 'Plan de reduction', value: 'Actif', source: 'auto' as SourceType, complete: true },
          { label: 'Feuille de route RSE', value: 'En cours', source: 'auto' as SourceType, complete: true },
        ],
        linkHref: '/home/rse/roadmap',
        linkLabelKey: 'esg:viewRoadmap',
      },
      {
        id: 'methodology',
        titleKey: 'esg:methodology',
        completionPct: 100,
        sources: ['auto'] as SourceType[],
        status: 'complete' as SectionStatus,
        fields: [
          { label: 'Methodologie de calcul', value: 'GHG Protocol', source: 'auto' as SourceType, complete: true },
          { label: "Facteurs d'emission", value: 'ADEME 2024', source: 'auto' as SourceType, complete: true },
          { label: 'Preuves blockchain', value: '14 hash on-chain', source: 'blockchain' as SourceType, complete: true },
        ],
      },
    ] as DemoReportSection[],
    csrdIndicators: [
      { code: 'E1', name: 'Changement climatique', category: 'environment' as const, completionPct: 82, itemsTotal: 9, itemsComplete: 7 },
      { code: 'E2', name: 'Pollution', category: 'environment' as const, completionPct: 58, itemsTotal: 6, itemsComplete: 3 },
      { code: 'E3', name: 'Eau et ressources marines', category: 'environment' as const, completionPct: 48, itemsTotal: 5, itemsComplete: 2 },
      { code: 'E4', name: 'Biodiversite', category: 'environment' as const, completionPct: 40, itemsTotal: 5, itemsComplete: 2 },
      { code: 'E5', name: 'Economie circulaire', category: 'environment' as const, completionPct: 98, itemsTotal: 6, itemsComplete: 6 },
      { code: 'S1', name: "Main-d'oeuvre propre", category: 'social' as const, completionPct: 45, itemsTotal: 8, itemsComplete: 4 },
      { code: 'S2', name: 'Chaine de valeur', category: 'social' as const, completionPct: 72, itemsTotal: 5, itemsComplete: 4 },
      { code: 'G1', name: 'Conduite des affaires', category: 'governance' as const, completionPct: 65, itemsTotal: 6, itemsComplete: 4 },
    ],
    reportHistory: [
      { id: 'rpt-001', period: 'T1 2026', format: 'GHG Protocol', status: 'draft' as const, completionPct: 72, totalEmissionsT: 66.3, blockchainProofs: 14, createdAt: '2026-03-31' },
      { id: 'rpt-002', period: 'T4 2025', format: 'GHG Protocol', status: 'finalized' as const, completionPct: 100, totalEmissionsT: 58.1, blockchainProofs: 8, createdAt: '2026-01-15', hash: '0xb3c4d5e6f7a8b9c0' },
      { id: 'rpt-003', period: 'T3 2025', format: 'GHG Protocol', status: 'finalized' as const, completionPct: 100, totalEmissionsT: 61.7, blockchainProofs: 5, createdAt: '2025-10-10', hash: '0xa1b2c3d4e5f6a7b8' },
    ],
    aiInsights: [
      { id: 'ins-1', type: 'strength' as const, title: 'ESRS E5 a 98%', description: 'Votre economie circulaire est votre point fort. Mettez-le en avant dans vos communications ESG.' },
      { id: 'ins-2', type: 'warning' as const, title: 'ESRS S1 a 45%', description: "Le pilier social est le plus faible. L'IA peut vous guider pour completer en ~15 minutes.", actionLabel: 'Completer ESRS S1', actionHref: '/home/esg/wizard?step=4' },
      { id: 'ins-3', type: 'trend' as const, title: '+8% vs T4 2025', description: 'Votre completude a augmente principalement grace aux nouvelles transactions du Comptoir.' },
      { id: 'ins-4', type: 'tip' as const, title: '6 champs restants', description: 'Completez les 6 champs restants pour pouvoir generer un rapport CSRD conforme a 100%.', actionLabel: 'Completer maintenant', actionHref: '/home/esg/wizard' },
    ],
    reportFormats: [
      { id: 'ghg_protocol', name: 'GHG Protocol', description: 'Bilan carbone complet', available: true, plan: 'all' },
      { id: 'csrd', name: 'CSRD / ESRS', description: 'Rapport durabilite complet', available: false, plan: 'avance' },
      { id: 'gri', name: 'GRI Standards', description: 'Standards 301/305/306', available: false, plan: 'avance' },
      { id: 'cdp', name: 'CDP Climate', description: 'Questionnaires climat', available: false, plan: 'enterprise' },
    ],
    previewSections: [
      { titleKey: 'esg:carbonBalance', pct: 94 },
      { titleKey: 'esg:circularEconomy', pct: 98 },
      { titleKey: 'esg:climateChange', pct: 72 },
      { titleKey: 'esg:socialImpact', pct: 45 },
      { titleKey: 'esg:governance', pct: 60 },
    ],
  },

  // ── Traceability ────────────────────────────────────────────────
  traceability: {
    certificatesTrend: 12.0,
    co2AvoidedTrend: 12.4,
    esgAutoPercent: 78,
  },

  // ── Compliance ──────────────────────────────────────────────────
  compliance: {
    score: 78,
    normsCompliant: 28,
    normsTotal: 42,
    alerts: 3,
    lastUpdate: '2026-03-28',
    pillars: [
      { name: 'Économie circulaire', icon: 'circular', compliant: 9, total: 11, norms: ['Loi AGEC', 'REP', 'Indice réparabilité', 'Éco-conception', 'Affichage env.', 'Tri 5 flux', 'Décret tertiaire', 'AFNOR zéro déchet', 'PPWR', 'Taxonomie UE', 'DPP'] },
      { name: 'Carbone & Env.', icon: 'carbon', compliant: 6, total: 7, norms: ['Bilan GES', 'ISO 14064', 'SBTi', 'CDP Climate', 'EU ETS', 'CBAM', 'Plan transition'] },
      { name: 'Reporting ESG', icon: 'reporting', compliant: 6, total: 9, norms: ['CSRD', 'ESRS', 'GRI', 'Taxonomie verte', 'SFDR', 'Devoir vigilance', 'DPEF', 'Art. 29 LEC', 'CS3D'] },
      { name: 'Traçabilité', icon: 'traceability', compliant: 5, total: 6, norms: ['Blockchain', 'Vigilance chaîne', 'ISO 22095', 'EUDR', '3TG', 'Passeport batterie'] },
      { name: 'Données & SaaS', icon: 'data', compliant: 3, total: 5, norms: ['RGPD', 'ISO 27001', 'SOC 2', 'HDS', 'NIS2'] },
      { name: 'Labels', icon: 'labels', compliant: 1, total: 4, norms: ['B Corp', 'Numérique Responsable', 'Lucie 26000', 'Engagé RSE'] },
    ],
    alertItems: [
      { id: 'rgpd', title: 'RGPD — Registre de traitements incomplet', description: "Le registre des traitements de données personnelles n'est pas à jour. 3 traitements non documentés détectés par l'analyse IA.", risk: "Risque : amende jusqu'à 4% du CA annuel mondial", urgency: 'urgent' as const },
      { id: 'rep', title: 'REP — Échéance filière emballages', description: 'La déclaration REP filière emballages doit être soumise avant le 30 avril 2026. Documents manquants : attestation éco-organisme.', risk: 'Risque : pénalités financières et blocage des mises en marché', urgency: 'warning' as const },
      { id: 'iso27001', title: 'ISO 27001 — Audit de surveillance', description: "L'audit de surveillance ISO 27001 est prévu pour mai 2026. 2 non-conformités mineures de l'audit précédent non encore corrigées.", risk: 'Risque : perte de la certification', urgency: 'warning' as const },
    ],
    watchItems: [
      { id: 'csrd-pme', date: '2026-06-01', title: 'Extension CSRD aux PME cotées', description: 'Les PME cotées devront publier un rapport de durabilité simplifié selon les normes ESRS-LSME dès l\'exercice 2026.', impact: 'strategic' as const },
      { id: 'dpp', date: '2026-09-01', title: 'Passeport numérique produit (DPP) — phase 1', description: 'Les batteries industrielles et les textiles devront intégrer un passeport numérique produit accessible via QR code.', impact: 'high' as const },
      { id: 'cbam-phase2', date: '2026-07-01', title: 'CBAM — Phase de transition terminée', description: "Fin de la période transitoire du mécanisme d'ajustement carbone aux frontières. Déclarations définitives obligatoires.", impact: 'high' as const },
      { id: 'nis2-deadline', date: '2026-05-15', title: 'NIS2 — Date limite de mise en conformité', description: 'Les entités essentielles et importantes doivent avoir notifié leur statut et mis en place les mesures de cybersécurité requises.', impact: 'medium' as const },
    ],
  },

  // ── RSE ─────────────────────────────────────────────────────────
  rse: {
    score: 62,
    level: 'Intermédiaire',
    lastEval: '2026-03-15',
    pillars: [
      { name: 'governance', score: 68, norm: 'ISO 26000 §6', color: '#0D9488' },
      { name: 'environment', score: 89, norm: 'ISO 14001', color: '#059669' },
      { name: 'social', score: 52, norm: 'SA8000', color: '#94A3B8' },
      { name: 'ethics', score: 76, norm: 'ISO 37001', color: '#16A34A' },
      { name: 'stakeholders', score: 48, norm: 'AA1000', color: '#0F766E' },
    ],
    labels: [
      { name: 'GreenTech', score: 85, threshold: 70, status: 'eligible', color: '#10B981' },
      { name: 'B Corp', score: 62, threshold: 80, status: 'in_progress', color: '#3B82F6' },
      { name: 'Label NR', score: 71, threshold: 75, status: 'in_progress', color: '#8B5CF6' },
      { name: 'GEG Label', score: 74, threshold: 80, status: 'in_progress', color: '#0D9488' },
    ],
    actions: [
      { title: 'Mettre en place une charte éthique fournisseurs avec audit annuel', impact: 12, effort: '15 jours', priority: 'urgent', pillar: 'ethics', norms: ['ISO 37001', 'B Corp'], status: 'todo' },
      { title: 'Déployer un plan de formation RSE pour tous les collaborateurs', impact: 8, effort: '10 jours', priority: 'important', pillar: 'social', norms: ['SA8000', 'GRI 404'], status: 'todo' },
      { title: 'Cartographier et consulter les parties prenantes clés', impact: 15, effort: '20 jours', priority: 'urgent', pillar: 'stakeholders', norms: ['AA1000', 'ISO 26000'], status: 'todo' },
      { title: 'Intégrer les critères ESG dans le reporting trimestriel', impact: 6, effort: '5 jours', priority: 'quick_win', pillar: 'governance', norms: ['CSRD', 'GRI'], status: 'todo' },
    ],
    ecosystem: [
      { icon: 'carbon', value: '12.4 tCO₂', i18nKey: 'rse:ecosystemCarbon' },
      { icon: 'blockchain', value: '47', i18nKey: 'rse:ecosystemBlockchain' },
      { icon: 'recycled', value: '2.8 tonnes', i18nKey: 'rse:ecosystemRecycled' },
      { icon: 'esg', value: '1', i18nKey: 'rse:ecosystemESG' },
    ],
    platformEnvData: {
      co2Avoided: '545.5 t CO2',
      recycled: '306 t',
      lots: 30,
    },
    roadmapActions: [
      {
        id: '1',
        title: 'Publier la politique environnementale',
        pillar: 'environment',
        impact: 3,
        effort: '1 jour',
        priority: 'quick_win' as const,
        status: 'done' as const,
        dueDate: '2026-04-15',
        norms: ['ISO 14001'],
        quarter: 'Q2 2026',
      },
      {
        id: '2',
        title: 'Formaliser politique parties prenantes',
        pillar: 'stakeholders',
        impact: 8,
        effort: '2-3 jours',
        priority: 'urgent' as const,
        status: 'in_progress' as const,
        dueDate: '2026-04-30',
        norms: ['ISO 26000', 'AA1000'],
        quarter: 'Q2 2026',
      },
      {
        id: '3',
        title: 'Documenter conditions de travail',
        pillar: 'social',
        impact: 6,
        effort: '1-2 jours',
        priority: 'important' as const,
        status: 'todo' as const,
        dueDate: '2026-05-15',
        norms: ['ESRS S1'],
        quarter: 'Q2 2026',
      },
      {
        id: '4',
        title: 'Mettre en place comite RSE',
        pillar: 'governance',
        impact: 10,
        effort: '3-5 jours',
        priority: 'urgent' as const,
        status: 'todo' as const,
        dueDate: '2026-05-30',
        norms: ['ISO 26000'],
        quarter: 'Q2 2026',
      },
      {
        id: '5',
        title: 'Deployer code ethique fournisseurs',
        pillar: 'ethics',
        impact: 7,
        effort: '5-7 jours',
        priority: 'important' as const,
        status: 'todo' as const,
        dueDate: '2026-06-15',
        norms: ['ISO 37001', 'B Corp'],
        quarter: 'Q2 2026',
      },
      {
        id: '6',
        title: 'Lancer enquete satisfaction employes',
        pillar: 'social',
        impact: 5,
        effort: '2-3 jours',
        priority: 'quick_win' as const,
        status: 'todo' as const,
        dueDate: '2026-07-15',
        norms: ['SA8000', 'GRI 404'],
        quarter: 'Q3 2026',
      },
      {
        id: '7',
        title: 'Obtenir certification ISO 14001',
        pillar: 'environment',
        impact: 12,
        effort: '30+ jours',
        priority: 'important' as const,
        status: 'todo' as const,
        dueDate: '2026-08-30',
        norms: ['ISO 14001'],
        quarter: 'Q3 2026',
      },
      {
        id: '8',
        title: "Former equipe a l'anti-corruption",
        pillar: 'ethics',
        impact: 4,
        effort: '2 jours',
        priority: 'quick_win' as const,
        status: 'todo' as const,
        dueDate: '2026-09-15',
        norms: ['ISO 37001'],
        quarter: 'Q3 2026',
      },
      {
        id: '9',
        title: 'Publier rapport de transparence annuel',
        pillar: 'governance',
        impact: 9,
        effort: '10-15 jours',
        priority: 'urgent' as const,
        status: 'todo' as const,
        dueDate: '2026-10-30',
        norms: ['CSRD', 'GRI'],
        quarter: 'Q4 2026',
      },
      {
        id: '10',
        title: 'Cartographier et consulter parties prenantes',
        pillar: 'stakeholders',
        impact: 15,
        effort: '15-20 jours',
        priority: 'urgent' as const,
        status: 'todo' as const,
        dueDate: '2026-12-15',
        norms: ['AA1000', 'ISO 26000'],
        quarter: 'Q4 2026',
      },
    ],
  },
};

export type DemoData = typeof DEMO_DATA;

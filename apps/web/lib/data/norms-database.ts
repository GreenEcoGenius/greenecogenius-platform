export type NormPillar =
  | 'circular_economy'
  | 'carbon'
  | 'reporting'
  | 'traceability'
  | 'data'
  | 'labels';

export type NormType =
  | 'iso'
  | 'law_fr'
  | 'directive_eu'
  | 'regulation_eu'
  | 'framework'
  | 'method'
  | 'label'
  | 'standard_eu';

export type NormPriority =
  | 'fundamental'
  | 'strategic'
  | 'mandatory'
  | 'essential'
  | 'upcoming'
  | 'framework';

export type NormStatus = 'published' | 'active' | 'in_development' | 'planned';
export type NormIntegration = 'integrated' | 'anticipated' | 'planned';

export interface Norm {
  id: string;
  reference: string;
  title: string;
  description: string;
  pillar: NormPillar;
  pillarLabel: string;
  type: NormType;
  typeLabel: string;
  priority: NormPriority;
  priorityLabel: string;
  status: NormStatus;
  statusLabel: string;
  year: string;
  platformSection: string;
  platformIntegration: NormIntegration;
  blockchainVerified: boolean;
  gegApplication: string;
}

export const PILLAR_INFO: Record<
  NormPillar,
  {
    label: string;
    label_en: string;
    icon: string;
    description: string;
    description_en: string;
  }
> = {
  circular_economy: {
    label: 'Economie circulaire & Gestion des dechets',
    label_en: 'Circular Economy & Waste Management',
    icon: 'recycle',
    description:
      'Ces normes encadrent la transition vers un modele circulaire. GreenEcoGenius les applique automatiquement dans Le Comptoir Circulaire, la tracabilite et le reporting.',
    description_en:
      'These standards govern the transition to a circular model. GreenEcoGenius applies them automatically in The Circular Marketplace, traceability and reporting.',
  },
  carbon: {
    label: 'Bilan carbone & Environnement',
    label_en: 'Carbon Footprint & Environment',
    icon: 'globe',
    description:
      'Standards de mesure, reporting et reduction des emissions de gaz a effet de serre. Integres dans le module Impact Carbone.',
    description_en:
      'Standards for measuring, reporting and reducing greenhouse gas emissions. Integrated into the Carbon Impact module.',
  },
  reporting: {
    label: 'Reporting ESG & Durabilite',
    label_en: 'ESG & Sustainability Reporting',
    icon: 'file-text',
    description:
      'Directives et frameworks de reporting extra-financier. Alimentent automatiquement le module Reporting ESG.',
    description_en:
      'Non-financial reporting directives and frameworks. Automatically feed the ESG Reporting module.',
  },
  traceability: {
    label: 'Tracabilite & Chaine de valeur',
    label_en: 'Traceability & Value Chain',
    icon: 'link',
    description:
      'Exigences de tracabilite, devoir de vigilance et passeport numerique. Verifiees on-chain via Polygon.',
    description_en:
      'Traceability requirements, due diligence and digital passport. Verified on-chain via Polygon.',
  },
  data: {
    label: 'Donnees, IA & SaaS',
    label_en: 'Data, AI & SaaS',
    icon: 'shield',
    description:
      "Protection des donnees, securite et conformite IA. Appliquees a l'infrastructure technique de la plateforme.",
    description_en:
      'Data protection, security and AI compliance. Applied to the platform technical infrastructure.',
  },
  labels: {
    label: 'Labels & Certifications RSE',
    label_en: 'CSR Labels & Certifications',
    icon: 'award',
    description:
      'Referentiels de labellisation RSE. Le module RSE & Labels evalue votre eligibilite et vous guide vers la certification.',
    description_en:
      'CSR labeling frameworks. The CSR & Labels module evaluates your eligibility and guides you to certification.',
  },
};

const LABEL_EN: Record<string, string> = {
  'Norme ISO': 'ISO Standard',
  'Loi francaise': 'French Law',
  'Decret francais': 'French Decree',
  'Directive UE': 'EU Directive',
  'Reglement UE': 'EU Regulation',
  'Standards UE': 'EU Standards',
  'Framework mondial': 'Global Framework',
  Framework: 'Framework',
  Methode: 'Method',
  Label: 'Label',
  Fondamentale: 'Fundamental',
  Strategique: 'Strategic',
  Obligatoire: 'Mandatory',
  Incontournable: 'Essential',
  'A suivre': 'Upcoming',
  'Economie circulaire': 'Circular Economy',
  'Bilan carbone': 'Carbon Footprint',
  'Reporting ESG': 'ESG Reporting',
  Tracabilite: 'Traceability',
  'Donnees & SaaS': 'Data & SaaS',
  'Labels RSE': 'CSR Labels',
  'Publiee 2024': 'Published 2024',
  'Publiee 2015': 'Published 2015',
  'Publiee 2018': 'Published 2018',
  'Publiee 2020': 'Published 2020',
  'Publiee 2022': 'Published 2022',
  'Publiee oct. 2024': 'Published Oct. 2024',
  'En vigueur': 'In force',
  'En vigueur depuis 2020': 'In force since 2020',
  'En vigueur depuis 2021': 'In force since 2021',
  'En vigueur depuis 2017': 'In force since 2017',
  'En vigueur depuis 2018': 'In force since 2018',
  'En vigueur 2024+': 'In force 2024+',
  'En vigueur 2025': 'In force 2025',
  'En vigueur 2027': 'In force 2027',
  'En vigueur oct. 2024': 'In force Oct. 2024',
  'En vigueur (transition CSRD)': 'In force (CSRD transition)',
  Actif: 'Active',
  Operationnel: 'Operational',
  'Application 2030': 'Applies 2030',
  'En developpement': 'In development',
  'Adoption prevue 2026': 'Expected adoption 2026',
  'Phase transitoire 2023-2026': 'Transition phase 2023-2026',
  'Toutes les sections': 'All sections',
  'Le Comptoir Circulaire': 'The Circular Marketplace',
  'Tracabilite blockchain': 'Blockchain Traceability',
  'Impact Carbone + Reporting ESG': 'Carbon Impact + ESG Reporting',
  'Conformite + RSE & Labels': 'Compliance + CSR & Labels',
  'Le Comptoir + Conformite': 'Marketplace + Compliance',
  'Tracabilite + Conformite': 'Traceability + Compliance',
  'Reporting ESG + Conformite': 'ESG Reporting + Compliance',
  'Impact Carbone + Conformite': 'Carbon Impact + Compliance',
  'Impact Carbone': 'Carbon Impact',
  'RSE & Labels + Reporting ESG': 'CSR & Labels + ESG Reporting',
  'RSE & Labels': 'CSR & Labels',
  'Infrastructure plateforme': 'Platform Infrastructure',
  'IA GreenEcoGenius': 'GreenEcoGenius AI',
  Conformite: 'Compliance',
};

const NORM_EN: Record<
  string,
  { title: string; description: string; gegApplication: string }
> = {
  'iso-59004': {
    title: 'Circular economy -- Vocabulary, principles and recommendations',
    description:
      'First international standard defining the common vocabulary of the circular economy. Establishes founding principles: circular resource flow, ecosystem resilience, systemic approach.',
    gegApplication:
      'All GreenEcoGenius terminology is aligned with this standard. Every feature uses ISO 59004 vocabulary.',
  },
  'iso-59010': {
    title:
      'Circular economy -- Guidelines for business models and value chains',
    description:
      'Guides organizations to transform their business model toward circularity. Covers eco-design, reuse, repair and recycling.',
    gegApplication:
      'The Circular Marketplace materializes these guidelines: secondary materials marketplace, buyer-seller matching, functionality economy.',
  },
  'iso-59014': {
    title: 'Traceability of secondary materials valorization',
    description:
      'Principles, requirements and recommendations for the traceability of secondary materials from one company to another. This is exactly the GreenEcoGenius blockchain use case.',
    gegApplication:
      'Each lot traced on Polygon meets this standard: SHA-256 recording, geolocation, timestamping, immutable chain of trust.',
  },
  'iso-59020': {
    title: 'Circular economy -- Measurement and assessment of circularity',
    description:
      'Framework for measuring circularity of organizations and products. Circular performance indicators, recycling rates, lifespan.',
    gegApplication:
      'Circularity indicators (recycling rate, CO2 avoided, tonnes valorized) are calculated per this standard in the Carbon Impact dashboard.',
  },
  'iso-14001': {
    title: 'Environmental management systems',
    description:
      'The global reference for environmental management systems. PDCA framework (Plan-Do-Check-Act) for continuous improvement of environmental performance.',
    gegApplication:
      'The platform follows the PDCA framework for environmental management. The Compliance module assesses ISO 14001 alignment.',
  },
  'loi-agec': {
    title: 'Anti-Waste for a Circular Economy Act',
    description:
      'French framework law for the transition to circular economy. End of single-use plastics by 2040, 3R decree, mandatory 9-stream sorting, extended EPR.',
    gegApplication:
      'The Circular Marketplace integrates AGEC obligations: 9-stream classification, waste traceability, EPR facilitator for businesses.',
  },
  'decret-9-flux': {
    title: 'Source sorting and separate collection of business waste',
    description:
      'Mandatory sorting and separate collection of 9 waste streams for businesses. Extension to bio-waste and textiles in 2025.',
    gegApplication:
      'The Marketplace automatically classifies each lot according to the 9 regulatory streams. Traceability proves source sorting compliance.',
  },
  'rep-elargie': {
    title: 'Extended Producer Responsibility',
    description:
      'Producers are responsible for the end of life of their products. Extension to industrial packaging, textiles, furniture, toys.',
    gegApplication:
      'The platform facilitates EPR compliance: waste traceability, valorization certificates, mandatory reporting.',
  },
  ppwr: {
    title: 'Packaging and Packaging Waste Regulation',
    description:
      'Target: 100% recyclable packaging by 2030. Mandatory recycled content rate, digital passport, over-packaging ban.',
    gegApplication:
      'GreenEcoGenius anticipates PPWR: packaging traceability, recycled content rate calculation, digital passport preparation.',
  },
  'taxonomie-circulaire': {
    title: 'Transition to a circular economy',
    description:
      'Objective 4 of the EU Taxonomy defines alignment criteria for economic activities with the circular economy.',
    gegApplication:
      'ESG reporting includes taxonomic alignment assessment for Objective 4. Marketplace data automatically feeds this assessment.',
  },
  dpp: {
    title: 'Digital Product Passport',
    description:
      'Future unique identifier for each product containing its manufacturing history, composition, repairability and recyclability.',
    gegApplication:
      'The GreenEcoGenius blockchain is already designed for DPP: each lot has a unique identifier, immutable history and complete metadata.',
  },
  'ghg-protocol': {
    title: 'Greenhouse Gas Protocol -- Corporate Standard',
    description:
      'The global standard for greenhouse gas emission accounting. Defines Scopes 1, 2 and 3. The foundation of all carbon assessments.',
    gegApplication:
      'All emission calculations follow the GHG Protocol. ESG reports are structured by Scope 1/2/3 with ADEME factors.',
  },
  'iso-14064': {
    title: 'Quantification and reporting of GHG emissions',
    description:
      'ISO standard for quantification, monitoring and reporting of greenhouse gas emissions at the organizational level.',
    gegApplication:
      'The Carbon Impact module follows ISO 14064 methodology for emission quantification. Compatible with certified audits.',
  },
  'bilan-ges': {
    title: 'Mandatory greenhouse gas emissions assessment',
    description:
      'Requirement for companies with 500+ employees to conduct a GHG assessment every 4 years (3 years for public bodies).',
    gegApplication:
      'GreenEcoGenius generates the GHG assessment in regulatory format. Platform data automatically feeds Scopes 1, 2 and 3.',
  },
  sbti: {
    title: 'Science Based Targets initiative',
    description:
      'Global initiative defining emission reduction targets aligned with climate science. 1.5 degree trajectory.',
    gegApplication:
      'The CSR module evaluates SBTi alignment and reduction trajectory. Targets are integrated into the ESG report.',
  },
  cdp: {
    title: 'Carbon Disclosure Project -- Climate questionnaire',
    description:
      'Global environmental disclosure system. Over 23,000 companies respond to the CDP questionnaire annually.',
    gegApplication:
      'Platform data can be exported in CDP format. The ESG report covers CDP Climate Change indicators.',
  },
  'eu-ets': {
    title: 'EU Emissions Trading System',
    description:
      'European carbon market covering over 10,000 installations. Decreasing emission cap to achieve neutrality by 2050.',
    gegApplication:
      'The Carbon Impact module tracks emissions against EU ETS quotas. The Compliance module verifies alignment.',
  },
  cbam: {
    title: 'Carbon Border Adjustment Mechanism',
    description:
      'Carbon border tax to prevent carbon leakage. Covers steel, cement, aluminum, fertilizers, electricity.',
    gegApplication:
      'GreenEcoGenius anticipates CBAM: carbon footprint calculation per material, origin traceability, import reporting.',
  },
  csrd: {
    title: 'Corporate Sustainability Reporting Directive',
    description:
      'Major reform of non-financial reporting in Europe. Mandatory for 50,000 companies by 2028. Third-party audit required.',
    gegApplication:
      'The ESG Reporting module is built for CSRD: ESRS structure, double materiality, interactive compliance table, compliant PDF export.',
  },
  esrs: {
    title: 'European Sustainability Reporting Standards',
    description:
      'The 12 technical standards of the CSRD covering environment (E1-E5), social (S1-S4) and governance (G1). Plus cross-cutting ESRS 1 and ESRS 2.',
    gegApplication:
      'The interactive CSRD table covers all 12 ESRS standards with compliance indicators, completeness and data sources for each indicator.',
  },
  gri: {
    title: 'Global Reporting Initiative -- Reporting Standards',
    description:
      'The most widely used sustainability reporting framework. GRI 305 (emissions), GRI 306 (waste), GRI 302 (energy).',
    gegApplication:
      'ESG reports can be generated in GRI format. GRI 302, 305 and 306 indicators are automatically populated.',
  },
  'taxonomie-verte': {
    title: 'Classification of sustainable economic activities',
    description:
      'European classification system defining which economic activities are considered "sustainable". 6 environmental objectives.',
    gegApplication:
      'ESG reporting evaluates taxonomic alignment of your activities. All 6 environmental objectives are covered.',
  },
  sfdr: {
    title: 'Sustainability-related disclosures regulation',
    description:
      'Transparency obligation for financial actors on sustainability risks and negative impacts of their investments.',
    gegApplication:
      'Platform ESG data is compatible with SFDR requirements for investors and investment funds.',
  },
  'devoir-vigilance': {
    title: 'Duty of Vigilance for parent and ordering companies',
    description:
      'Obligation for large companies to establish a vigilance plan covering serious harm to human rights and the environment.',
    gegApplication:
      'Blockchain traceability documents the value chain for the vigilance plan. Proof of origin and supplier compliance.',
  },
  dpef: {
    title: 'Non-Financial Performance Declaration',
    description:
      'Non-financial reporting obligation for large French companies. CSRD predecessor, still in force during transition.',
    gegApplication:
      'The ESG Reporting module covers DPEF indicators and ensures the transition to CSRD for affected companies.',
  },
  'art-29-lec': {
    title: 'Climate reporting for institutional investors',
    description:
      'Transparency obligation on climate risks for investors, banks and insurers. TCFD aligned.',
    gegApplication:
      'Platform climate data (Scopes 1/2/3, trajectory) is compatible with Art. 29 LEC requirements.',
  },
  cs3d: {
    title: 'Corporate Sustainability Due Diligence Directive',
    description:
      'EU directive extending due diligence to all large EU companies. Covers human rights and environment in the value chain.',
    gegApplication:
      'The GreenEcoGenius blockchain already documents the value chain. CS3D extension will be integrated upon adoption.',
  },
  'blockchain-polygon': {
    title: 'On-chain traceability on Polygon Mainnet',
    description:
      'Immutable recording of every transaction on the Polygon blockchain. Publicly verifiable anti-greenwashing proof.',
    gegApplication:
      'Each lot is recorded on Polygon with SHA-256 hash, timestamp and geolocation. Certificates verifiable via QR code.',
  },
  'vigilance-chaine': {
    title: 'Supply chain due diligence',
    description:
      'Traceability and supplier verification requirements to ensure compliance with environmental and social standards.',
    gegApplication:
      'Blockchain traceability documents every step of the value chain: origin, transformation, transport, delivery. Immutable proof.',
  },
  'iso-22095': {
    title: 'Chain of custody -- Terminology and models',
    description:
      'Standard defining terminology and models for chain of custody systems. Applicable to recycling and valorization.',
    gegApplication:
      'The GreenEcoGenius traceability system follows the ISO 22095 chain of custody model for secondary materials.',
  },
  eudr: {
    title: 'Deforestation Regulation',
    description:
      'Due diligence obligation for deforestation-linked products: soy, palm oil, wood, cocoa, coffee, rubber, cattle.',
    gegApplication:
      'The blockchain documents material origins for EUDR due diligence. Verifiable non-deforestation proof.',
  },
  '3tg': {
    title: 'Conflict minerals -- Tin, Tantalum, Tungsten and Gold',
    description:
      'Due diligence obligation for importers of minerals from conflict zones. Supply chain traceability.',
    gegApplication:
      'Blockchain traceability documents the origin of metals and minerals for 3TG compliance.',
  },
  'passeport-batterie': {
    title: 'Battery Regulation -- Digital passport',
    description:
      'Digital passport obligation for industrial and electric vehicle batteries. Composition, origin, recyclability.',
    gegApplication:
      'The GreenEcoGenius blockchain architecture is already compatible with the battery passport format: unique ID, immutable history.',
  },
  rgpd: {
    title: 'General Data Protection Regulation',
    description:
      'The European reference regulation for personal data protection. Consent, right to erasure, portability, DPO.',
    gegApplication:
      'GreenEcoGenius is GDPR compliant: consent, right to erasure, encryption, EU hosting, complete privacy policy.',
  },
  'iso-27001': {
    title: 'Information security management',
    description:
      'International reference standard for information security management systems (ISMS). Globally recognized certification.',
    gegApplication:
      'GreenEcoGenius infrastructure follows ISO 27001 best practices: encryption, access control, logging, continuity plan.',
  },
  'soc-2': {
    title: 'Service Organization Control -- Security and availability',
    description:
      'American audit standard for cloud service providers. Covers security, availability, integrity, confidentiality and privacy.',
    gegApplication:
      'GreenEcoGenius respects SOC 2 principles: security (AES-256 encryption), availability (99.9% SLA), data integrity.',
  },
  nis2: {
    title: 'Network and information systems security',
    description:
      'EU directive strengthening cybersecurity for essential and important entities. Incident notification obligations.',
    gegApplication:
      'GreenEcoGenius anticipates NIS2: incident response plan, continuous monitoring, cybersecurity governance.',
  },
  'ai-act': {
    title: 'Artificial Intelligence Act',
    description:
      "World's first legal framework for AI. Classifies AI systems by risk level and imposes transparency obligations.",
    gegApplication:
      'GreenEcoGenius AI is classified as "limited risk". Full transparency: every AI recommendation is traceable and explainable.',
  },
  'b-corp': {
    title: 'B Corporation Certification',
    description:
      'International certification for companies meeting the highest standards of social and environmental performance, transparency and accountability.',
    gegApplication:
      'The CSR diagnostic evaluates your potential B Corp score. The platform identifies actions to reach the certification threshold (80 points).',
  },
  'numerique-responsable': {
    title: 'Responsible Digital Label -- INR',
    description:
      'French label certifying organizational commitment to responsible digital practices. Eco-design, accessibility, ethics.',
    gegApplication:
      'The CSR diagnostic evaluates your Label NR eligibility. GreenEcoGenius itself aims for this certification.',
  },
  'lucie-26000': {
    title: 'CSR label aligned with ISO 26000',
    description:
      'Leading French CSR label based on ISO 26000. Covers governance, human rights, environment, fair practices.',
    gegApplication:
      'The CSR diagnostic covers the 7 core subjects of ISO 26000 and evaluates your Lucie 26000 eligibility.',
  },
  'engage-rse': {
    title: 'Engage RSE Label -- AFNOR Assessment',
    description:
      'CSR assessment by AFNOR (French standards body). 4 levels: Commitment, Progress, Maturity, Exemplary.',
    gegApplication:
      'The CSR diagnostic positions your organization on the AFNOR Engage RSE scale and identifies actions to progress.',
  },
};

export function localizeNorm(norm: Norm, locale: string): Norm {
  if (locale === 'fr') return norm;
  const en = NORM_EN[norm.id];
  return {
    ...norm,
    title: en?.title ?? norm.title,
    description: en?.description ?? norm.description,
    gegApplication: en?.gegApplication ?? norm.gegApplication,
    pillarLabel: LABEL_EN[norm.pillarLabel] ?? norm.pillarLabel,
    typeLabel: LABEL_EN[norm.typeLabel] ?? norm.typeLabel,
    priorityLabel: LABEL_EN[norm.priorityLabel] ?? norm.priorityLabel,
    statusLabel: LABEL_EN[norm.statusLabel] ?? norm.statusLabel,
    platformSection: LABEL_EN[norm.platformSection] ?? norm.platformSection,
  };
}

export function getLocalizedPillarInfo(locale: string) {
  const result: Record<
    string,
    { label: string; icon: string; description: string }
  > = {};
  for (const [key, val] of Object.entries(PILLAR_INFO)) {
    result[key] = {
      label: locale === 'fr' ? val.label : val.label_en,
      icon: val.icon,
      description: locale === 'fr' ? val.description : val.description_en,
    };
  }
  return result as Record<
    NormPillar,
    { label: string; icon: string; description: string }
  >;
}

export const PRIORITY_COLORS: Record<NormPriority, string> = {
  fundamental: 'bg-circuit-ice text-circuit-blue',
  strategic: 'bg-tech-mint text-tech-emerald',
  mandatory: 'bg-[#E6F7EF] text-[#008F5A]',
  essential: 'bg-badge-amber-bg text-badge-amber-text',
  upcoming: 'bg-badge-purple-bg text-badge-purple-text',
  framework: 'bg-circuit-ice text-circuit-blue',
};

export const NORMS_DATABASE: Norm[] = [
  // ── PILIER 1 : ECONOMIE CIRCULAIRE (11 normes) ──
  {
    id: 'iso-59004',
    reference: 'ISO 59004:2024',
    title: 'Economie circulaire -- Vocabulaire, principes et recommandations',
    description:
      "Premiere norme internationale definissant le vocabulaire commun de l'economie circulaire. Pose les principes fondateurs : flux circulaire des ressources, resilience des ecosystemes, approche systemique.",
    pillar: 'circular_economy',
    pillarLabel: 'Economie circulaire',
    type: 'iso',
    typeLabel: 'Norme ISO',
    priority: 'fundamental',
    priorityLabel: 'Fondamentale',
    status: 'published',
    statusLabel: 'Publiee 2024',
    year: '2024',
    platformSection: 'Toutes les sections',
    platformIntegration: 'integrated',
    blockchainVerified: false,
    gegApplication:
      'Toute la terminologie de GreenEcoGenius est alignee sur cette norme. Chaque fonctionnalite utilise le vocabulaire ISO 59004.',
  },
  {
    id: 'iso-59010',
    reference: 'ISO 59010:2024',
    title:
      'Economie circulaire -- Lignes directrices pour les modeles economiques et les chaines de valeur',
    description:
      "Guide les organisations pour transformer leur modele economique vers la circularite. Couvre l'ecoconception, le reemploi, la reparation et le recyclage.",
    pillar: 'circular_economy',
    pillarLabel: 'Economie circulaire',
    type: 'iso',
    typeLabel: 'Norme ISO',
    priority: 'strategic',
    priorityLabel: 'Strategique',
    status: 'published',
    statusLabel: 'Publiee 2024',
    year: '2024',
    platformSection: 'Le Comptoir Circulaire',
    platformIntegration: 'integrated',
    blockchainVerified: false,
    gegApplication:
      'Le Comptoir Circulaire materialise ces lignes directrices : marketplace de matieres secondaires, mise en relation acheteur-vendeur, economie de la fonctionnalite.',
  },
  {
    id: 'iso-59014',
    reference: 'ISO 59014:2024',
    title: 'Tracabilite de la valorisation des matieres secondaires',
    description:
      "Principes, exigences et recommandations pour la tracabilite des materiaux secondaires d'une entreprise a l'autre. C'est exactement le use case de la blockchain GreenEcoGenius.",
    pillar: 'circular_economy',
    pillarLabel: 'Economie circulaire',
    type: 'iso',
    typeLabel: 'Norme ISO',
    priority: 'strategic',
    priorityLabel: 'Strategique',
    status: 'published',
    statusLabel: 'Publiee oct. 2024',
    year: '2024',
    platformSection: 'Tracabilite blockchain',
    platformIntegration: 'integrated',
    blockchainVerified: true,
    gegApplication:
      'Chaque lot trace sur Polygon repond aux exigences de cette norme : enregistrement SHA-256, geolocalisation, horodatage, chaine de confiance immuable.',
  },
  {
    id: 'iso-59020',
    reference: 'ISO 59020:2024',
    title: 'Economie circulaire -- Mesure et evaluation de la circularite',
    description:
      'Cadre de mesure de la circularite des organisations et des produits. Indicateurs de performance circulaire, taux de recyclage, duree de vie.',
    pillar: 'circular_economy',
    pillarLabel: 'Economie circulaire',
    type: 'iso',
    typeLabel: 'Norme ISO',
    priority: 'strategic',
    priorityLabel: 'Strategique',
    status: 'published',
    statusLabel: 'Publiee 2024',
    year: '2024',
    platformSection: 'Impact Carbone + Reporting ESG',
    platformIntegration: 'integrated',
    blockchainVerified: false,
    gegApplication:
      'Les indicateurs de circularite (taux de recyclage, CO2 evite, tonnes valorisees) sont calcules selon cette norme dans le dashboard Impact Carbone.',
  },
  {
    id: 'iso-14001',
    reference: 'ISO 14001:2015',
    title: 'Systemes de management environnemental',
    description:
      "La reference mondiale pour les systemes de management environnemental. Cadre PDCA (Plan-Do-Check-Act) pour l'amelioration continue de la performance environnementale.",
    pillar: 'circular_economy',
    pillarLabel: 'Economie circulaire',
    type: 'iso',
    typeLabel: 'Norme ISO',
    priority: 'essential',
    priorityLabel: 'Incontournable',
    status: 'published',
    statusLabel: 'Publiee 2015',
    year: '2015',
    platformSection: 'Conformite + RSE & Labels',
    platformIntegration: 'integrated',
    blockchainVerified: false,
    gegApplication:
      "La plateforme suit le cadre PDCA pour le management environnemental. Le module Conformite evalue l'alignement avec ISO 14001.",
  },
  {
    id: 'loi-agec',
    reference: 'Loi AGEC (n. 2020-105)',
    title: 'Anti-Gaspillage pour une Economie Circulaire',
    description:
      "Loi cadre francaise pour la transition vers l'economie circulaire. Fin des plastiques a usage unique d'ici 2040, decret 3R, tri 9 flux obligatoire, REP elargie.",
    pillar: 'circular_economy',
    pillarLabel: 'Economie circulaire',
    type: 'law_fr',
    typeLabel: 'Loi francaise',
    priority: 'mandatory',
    priorityLabel: 'Obligatoire',
    status: 'active',
    statusLabel: 'En vigueur depuis 2020',
    year: '2020',
    platformSection: 'Le Comptoir + Conformite',
    platformIntegration: 'integrated',
    blockchainVerified: false,
    gegApplication:
      'Le Comptoir Circulaire integre les obligations AGEC : classification 9 flux, tracabilite des dechets, facilitateur REP pour les entreprises.',
  },
  {
    id: 'decret-9-flux',
    reference: 'Decret 9 flux (n. 2021-950)',
    title: "Tri a la source et collecte separee des dechets d'activite",
    description:
      'Obligation de tri et collecte separee de 9 flux de dechets pour les entreprises. Extension aux biodechets et textiles en 2025.',
    pillar: 'circular_economy',
    pillarLabel: 'Economie circulaire',
    type: 'law_fr',
    typeLabel: 'Decret francais',
    priority: 'mandatory',
    priorityLabel: 'Obligatoire',
    status: 'active',
    statusLabel: 'En vigueur depuis 2021',
    year: '2021',
    platformSection: 'Le Comptoir Circulaire',
    platformIntegration: 'integrated',
    blockchainVerified: false,
    gegApplication:
      'Le Comptoir classe automatiquement chaque lot selon les 9 flux reglementaires. La tracabilite prouve la conformite au tri a la source.',
  },
  {
    id: 'rep-elargie',
    reference: 'REP elargie',
    title: 'Responsabilite Elargie du Producteur',
    description:
      'Les producteurs sont responsables de la fin de vie de leurs produits. Extension aux emballages industriels, textiles, meubles, jouets.',
    pillar: 'circular_economy',
    pillarLabel: 'Economie circulaire',
    type: 'law_fr',
    typeLabel: 'Loi francaise',
    priority: 'mandatory',
    priorityLabel: 'Obligatoire',
    status: 'active',
    statusLabel: 'En vigueur',
    year: '2022',
    platformSection: 'Le Comptoir + Conformite',
    platformIntegration: 'integrated',
    blockchainVerified: false,
    gegApplication:
      'La plateforme facilite la mise en conformite REP : tracabilite des dechets, attestations de valorisation, reporting obligatoire.',
  },
  {
    id: 'ppwr',
    reference: 'PPWR (UE 2025/40)',
    title: "Reglement Emballages et Dechets d'Emballages",
    description:
      "Objectif : 100% emballages recyclables d'ici 2030. Taux de contenu recycle obligatoire, passeport numerique, interdiction du suremballage.",
    pillar: 'circular_economy',
    pillarLabel: 'Economie circulaire',
    type: 'regulation_eu',
    typeLabel: 'Reglement UE',
    priority: 'upcoming',
    priorityLabel: 'A suivre',
    status: 'planned',
    statusLabel: 'Application 2030',
    year: '2030',
    platformSection: 'Tracabilite + Conformite',
    platformIntegration: 'anticipated',
    blockchainVerified: false,
    gegApplication:
      'GreenEcoGenius anticipe le PPWR : tracabilite des emballages, calcul du taux de contenu recycle, preparation au passeport numerique.',
  },
  {
    id: 'taxonomie-circulaire',
    reference: 'Taxonomie UE (Objectif 4)',
    title: 'Transition vers une economie circulaire',
    description:
      "L'objectif 4 de la Taxonomie europeenne definit les criteres d'alignement des activites economiques avec l'economie circulaire.",
    pillar: 'circular_economy',
    pillarLabel: 'Economie circulaire',
    type: 'regulation_eu',
    typeLabel: 'Reglement UE',
    priority: 'essential',
    priorityLabel: 'Incontournable',
    status: 'active',
    statusLabel: 'En vigueur',
    year: '2023',
    platformSection: 'Reporting ESG',
    platformIntegration: 'integrated',
    blockchainVerified: false,
    gegApplication:
      "Le reporting ESG inclut l'evaluation de l'alignement taxonomique pour l'objectif 4. Les donnees du Comptoir alimentent automatiquement cette evaluation.",
  },
  {
    id: 'dpp',
    reference: 'DPP (Digital Product Passport)',
    title: 'Passeport Numerique des Produits',
    description:
      'Futur identifiant unique pour chaque produit contenant son historique de fabrication, composition, reparabilite et recyclabilite.',
    pillar: 'circular_economy',
    pillarLabel: 'Economie circulaire',
    type: 'regulation_eu',
    typeLabel: 'Reglement UE',
    priority: 'upcoming',
    priorityLabel: 'A suivre',
    status: 'in_development',
    statusLabel: 'En developpement',
    year: '2027',
    platformSection: 'Tracabilite blockchain',
    platformIntegration: 'anticipated',
    blockchainVerified: true,
    gegApplication:
      'La blockchain GreenEcoGenius est deja concue pour le DPP : chaque lot a un identifiant unique, un historique immuable et des metadonnees completes.',
  },

  // ── PILIER 2 : BILAN CARBONE (7 normes) ──
  {
    id: 'ghg-protocol',
    reference: 'GHG Protocol',
    title: 'Greenhouse Gas Protocol -- Corporate Standard',
    description:
      'Le standard mondial de comptabilisation des emissions de gaz a effet de serre. Definit les Scopes 1, 2 et 3. Base de tout bilan carbone.',
    pillar: 'carbon',
    pillarLabel: 'Bilan carbone',
    type: 'framework',
    typeLabel: 'Framework mondial',
    priority: 'fundamental',
    priorityLabel: 'Fondamentale',
    status: 'active',
    statusLabel: 'Actif',
    year: '2004',
    platformSection: 'Impact Carbone + Reporting ESG',
    platformIntegration: 'integrated',
    blockchainVerified: false,
    gegApplication:
      "Tous les calculs d'emissions suivent le GHG Protocol. Les rapports ESG sont structures selon Scope 1/2/3 avec les facteurs ADEME.",
  },
  {
    id: 'iso-14064',
    reference: 'ISO 14064-1:2018',
    title: 'Quantification et declaration des emissions de GES',
    description:
      'Norme ISO pour la quantification, la surveillance et la declaration des emissions de gaz a effet de serre au niveau organisationnel.',
    pillar: 'carbon',
    pillarLabel: 'Bilan carbone',
    type: 'iso',
    typeLabel: 'Norme ISO',
    priority: 'essential',
    priorityLabel: 'Incontournable',
    status: 'published',
    statusLabel: 'Publiee 2018',
    year: '2018',
    platformSection: 'Impact Carbone',
    platformIntegration: 'integrated',
    blockchainVerified: false,
    gegApplication:
      'Le module Impact Carbone suit la methodologie ISO 14064 pour la quantification des emissions. Compatible avec les audits certifies.',
  },
  {
    id: 'bilan-ges',
    reference: 'Bilan GES reglementaire',
    title: "Bilan d'emissions de gaz a effet de serre obligatoire",
    description:
      'Obligation pour les entreprises de plus de 500 salaries de realiser un bilan GES tous les 4 ans (3 ans pour les collectivites).',
    pillar: 'carbon',
    pillarLabel: 'Bilan carbone',
    type: 'law_fr',
    typeLabel: 'Loi francaise',
    priority: 'mandatory',
    priorityLabel: 'Obligatoire',
    status: 'active',
    statusLabel: 'En vigueur',
    year: '2012',
    platformSection: 'Impact Carbone + Reporting ESG',
    platformIntegration: 'integrated',
    blockchainVerified: false,
    gegApplication:
      'GreenEcoGenius genere le bilan GES au format reglementaire. Les donnees de la plateforme alimentent automatiquement les Scopes 1, 2 et 3.',
  },
  {
    id: 'sbti',
    reference: 'SBTi',
    title: 'Science Based Targets initiative',
    description:
      'Initiative mondiale definissant des objectifs de reduction des emissions alignes sur la science climatique. Trajectoire 1.5 degre.',
    pillar: 'carbon',
    pillarLabel: 'Bilan carbone',
    type: 'framework',
    typeLabel: 'Framework mondial',
    priority: 'strategic',
    priorityLabel: 'Strategique',
    status: 'active',
    statusLabel: 'Actif',
    year: '2015',
    platformSection: 'RSE & Labels + Reporting ESG',
    platformIntegration: 'integrated',
    blockchainVerified: false,
    gegApplication:
      "Le module RSE evalue l'alignement SBTi et la trajectoire de reduction. Les objectifs sont integres au rapport ESG.",
  },
  {
    id: 'cdp',
    reference: 'CDP Climate Change',
    title: 'Carbon Disclosure Project -- Questionnaire climat',
    description:
      'Systeme mondial de declaration environnementale. Plus de 23 000 entreprises repondent au questionnaire CDP chaque annee.',
    pillar: 'carbon',
    pillarLabel: 'Bilan carbone',
    type: 'framework',
    typeLabel: 'Framework mondial',
    priority: 'strategic',
    priorityLabel: 'Strategique',
    status: 'active',
    statusLabel: 'Actif',
    year: '2000',
    platformSection: 'Reporting ESG',
    platformIntegration: 'integrated',
    blockchainVerified: false,
    gegApplication:
      'Les donnees de la plateforme peuvent etre exportees au format CDP. Le rapport ESG couvre les indicateurs CDP Climate Change.',
  },
  {
    id: 'eu-ets',
    reference: 'EU ETS',
    title: "Systeme d'echange de quotas d'emission de l'UE",
    description:
      "Marche carbone europeen couvrant plus de 10 000 installations. Plafond d'emissions decroissant pour atteindre la neutralite en 2050.",
    pillar: 'carbon',
    pillarLabel: 'Bilan carbone',
    type: 'regulation_eu',
    typeLabel: 'Reglement UE',
    priority: 'essential',
    priorityLabel: 'Incontournable',
    status: 'active',
    statusLabel: 'En vigueur',
    year: '2005',
    platformSection: 'Impact Carbone + Conformite',
    platformIntegration: 'integrated',
    blockchainVerified: false,
    gegApplication:
      "Le module Impact Carbone permet de suivre les emissions par rapport aux quotas EU ETS. Le module Conformite verifie l'alignement.",
  },
  {
    id: 'cbam',
    reference: 'CBAM',
    title: "Mecanisme d'ajustement carbone aux frontieres",
    description:
      "Taxe carbone aux frontieres de l'UE pour eviter les fuites de carbone. Concerne l'acier, le ciment, l'aluminium, les engrais, l'electricite.",
    pillar: 'carbon',
    pillarLabel: 'Bilan carbone',
    type: 'regulation_eu',
    typeLabel: 'Reglement UE',
    priority: 'upcoming',
    priorityLabel: 'A suivre',
    status: 'active',
    statusLabel: 'Phase transitoire 2023-2026',
    year: '2023',
    platformSection: 'Conformite',
    platformIntegration: 'anticipated',
    blockchainVerified: false,
    gegApplication:
      "GreenEcoGenius anticipe le CBAM : calcul de l'empreinte carbone par materiau, tracabilite de l'origine, reporting des importations.",
  },

  // ── PILIER 3 : REPORTING ESG (9 normes) ──
  {
    id: 'csrd',
    reference: 'CSRD (Directive 2022/2464)',
    title: 'Directive sur le reporting de durabilite des entreprises',
    description:
      "La reforme majeure du reporting extra-financier en Europe. Obligatoire pour 50 000 entreprises d'ici 2028. Audit obligatoire par un tiers.",
    pillar: 'reporting',
    pillarLabel: 'Reporting ESG',
    type: 'directive_eu',
    typeLabel: 'Directive UE',
    priority: 'mandatory',
    priorityLabel: 'Obligatoire',
    status: 'active',
    statusLabel: 'En vigueur 2024+',
    year: '2024',
    platformSection: 'Reporting ESG + Conformite',
    platformIntegration: 'integrated',
    blockchainVerified: false,
    gegApplication:
      'Le module Reporting ESG est concu pour la CSRD : structure ESRS, double materialite, tableau de conformite interactif, export PDF conforme.',
  },
  {
    id: 'esrs',
    reference: 'ESRS E1 a G1',
    title: 'European Sustainability Reporting Standards',
    description:
      'Les 12 normes techniques de la CSRD couvrant environnement (E1-E5), social (S1-S4) et gouvernance (G1). Plus ESRS 1 et ESRS 2 transversales.',
    pillar: 'reporting',
    pillarLabel: 'Reporting ESG',
    type: 'standard_eu',
    typeLabel: 'Standards UE',
    priority: 'mandatory',
    priorityLabel: 'Obligatoire',
    status: 'active',
    statusLabel: 'En vigueur 2024+',
    year: '2024',
    platformSection: 'Reporting ESG',
    platformIntegration: 'integrated',
    blockchainVerified: false,
    gegApplication:
      'Le tableau CSRD interactif couvre les 12 normes ESRS avec indicateurs de conformite, completude et sources de donnees pour chaque indicateur.',
  },
  {
    id: 'gri',
    reference: 'GRI Standards',
    title: 'Global Reporting Initiative -- Standards de reporting',
    description:
      'Le framework de reporting de durabilite le plus utilise au monde. GRI 305 (emissions), GRI 306 (dechets), GRI 302 (energie).',
    pillar: 'reporting',
    pillarLabel: 'Reporting ESG',
    type: 'framework',
    typeLabel: 'Framework mondial',
    priority: 'framework',
    priorityLabel: 'Framework',
    status: 'active',
    statusLabel: 'Actif',
    year: '2016',
    platformSection: 'Reporting ESG',
    platformIntegration: 'integrated',
    blockchainVerified: false,
    gegApplication:
      'Les rapports ESG peuvent etre generes au format GRI. Les indicateurs GRI 302, 305 et 306 sont alimentes automatiquement.',
  },
  {
    id: 'taxonomie-verte',
    reference: 'Taxonomie verte (UE 2020/852)',
    title: 'Classification des activites economiques durables',
    description:
      'Systeme de classification europeen definissant quelles activites economiques sont considerees comme "durables". 6 objectifs environnementaux.',
    pillar: 'reporting',
    pillarLabel: 'Reporting ESG',
    type: 'regulation_eu',
    typeLabel: 'Reglement UE',
    priority: 'essential',
    priorityLabel: 'Incontournable',
    status: 'active',
    statusLabel: 'En vigueur',
    year: '2020',
    platformSection: 'Reporting ESG + Conformite',
    platformIntegration: 'integrated',
    blockchainVerified: false,
    gegApplication:
      "Le reporting ESG evalue l'alignement taxonomique de vos activites. Les 6 objectifs environnementaux sont couverts.",
  },
  {
    id: 'sfdr',
    reference: 'SFDR (UE 2019/2088)',
    title:
      "Reglement sur la publication d'informations en matiere de durabilite",
    description:
      'Obligation de transparence pour les acteurs financiers sur les risques de durabilite et les impacts negatifs de leurs investissements.',
    pillar: 'reporting',
    pillarLabel: 'Reporting ESG',
    type: 'regulation_eu',
    typeLabel: 'Reglement UE',
    priority: 'essential',
    priorityLabel: 'Incontournable',
    status: 'active',
    statusLabel: 'En vigueur',
    year: '2021',
    platformSection: 'Reporting ESG',
    platformIntegration: 'integrated',
    blockchainVerified: false,
    gegApplication:
      "Les donnees ESG de la plateforme sont compatibles avec les exigences SFDR pour les investisseurs et fonds d'investissement.",
  },
  {
    id: 'devoir-vigilance',
    reference: 'Loi sur le Devoir de Vigilance',
    title:
      "Plan de vigilance des societes meres et entreprises donneuses d'ordre",
    description:
      "Obligation pour les grandes entreprises d'etablir un plan de vigilance couvrant les atteintes graves aux droits humains et a l'environnement.",
    pillar: 'reporting',
    pillarLabel: 'Reporting ESG',
    type: 'law_fr',
    typeLabel: 'Loi francaise',
    priority: 'mandatory',
    priorityLabel: 'Obligatoire',
    status: 'active',
    statusLabel: 'En vigueur depuis 2017',
    year: '2017',
    platformSection: 'Conformite',
    platformIntegration: 'integrated',
    blockchainVerified: false,
    gegApplication:
      "La tracabilite blockchain permet de documenter la chaine de valeur pour le plan de vigilance. Preuve d'origine et conformite fournisseurs.",
  },
  {
    id: 'dpef',
    reference: 'DPEF',
    title: 'Declaration de Performance Extra-Financiere',
    description:
      'Obligation de reporting extra-financier pour les grandes entreprises francaises. Precurseur de la CSRD, encore en vigueur pendant la transition.',
    pillar: 'reporting',
    pillarLabel: 'Reporting ESG',
    type: 'law_fr',
    typeLabel: 'Loi francaise',
    priority: 'mandatory',
    priorityLabel: 'Obligatoire',
    status: 'active',
    statusLabel: 'En vigueur (transition CSRD)',
    year: '2017',
    platformSection: 'Reporting ESG',
    platformIntegration: 'integrated',
    blockchainVerified: false,
    gegApplication:
      'Le module Reporting ESG couvre les indicateurs DPEF et assure la transition vers la CSRD pour les entreprises concernees.',
  },
  {
    id: 'art-29-lec',
    reference: 'Article 29 LEC',
    title: 'Reporting climatique des investisseurs institutionnels',
    description:
      'Obligation de transparence sur les risques climatiques pour les investisseurs, banques et assureurs. Alignement avec la TCFD.',
    pillar: 'reporting',
    pillarLabel: 'Reporting ESG',
    type: 'law_fr',
    typeLabel: 'Loi francaise',
    priority: 'essential',
    priorityLabel: 'Incontournable',
    status: 'active',
    statusLabel: 'En vigueur',
    year: '2021',
    platformSection: 'Reporting ESG',
    platformIntegration: 'integrated',
    blockchainVerified: false,
    gegApplication:
      'Les donnees climat de la plateforme (Scopes 1/2/3, trajectoire) sont compatibles avec les exigences Art. 29 LEC.',
  },
  {
    id: 'cs3d',
    reference: 'CS3D (CSDDD)',
    title:
      'Directive sur le Devoir de Vigilance des Entreprises en matiere de Durabilite',
    description:
      "Directive europeenne etendant le devoir de vigilance a toutes les grandes entreprises de l'UE. Couvre droits humains et environnement dans la chaine de valeur.",
    pillar: 'reporting',
    pillarLabel: 'Reporting ESG',
    type: 'directive_eu',
    typeLabel: 'Directive UE',
    priority: 'upcoming',
    priorityLabel: 'A suivre',
    status: 'in_development',
    statusLabel: 'Adoption prevue 2026',
    year: '2026',
    platformSection: 'Tracabilite + Conformite',
    platformIntegration: 'anticipated',
    blockchainVerified: true,
    gegApplication:
      "La blockchain GreenEcoGenius documente deja la chaine de valeur. L'extension CS3D sera integree des son adoption.",
  },

  // ── PILIER 4 : TRACABILITE (6 normes) ──
  {
    id: 'blockchain-polygon',
    reference: 'Blockchain Polygon',
    title: 'Tracabilite on-chain sur Polygon Mainnet',
    description:
      'Enregistrement immuable de chaque transaction sur la blockchain Polygon. Preuve anti-greenwashing verifiable publiquement.',
    pillar: 'traceability',
    pillarLabel: 'Tracabilite',
    type: 'method',
    typeLabel: 'Methode',
    priority: 'strategic',
    priorityLabel: 'Strategique',
    status: 'active',
    statusLabel: 'Operationnel',
    year: '2024',
    platformSection: 'Tracabilite blockchain',
    platformIntegration: 'integrated',
    blockchainVerified: true,
    gegApplication:
      'Chaque lot est enregistre sur Polygon avec hash SHA-256, horodatage et geolocalisation. Certificats verifiables via QR code.',
  },
  {
    id: 'vigilance-chaine',
    reference: 'Vigilance Chaine de Valeur',
    title: "Due diligence dans la chaine d'approvisionnement",
    description:
      "Exigences de tracabilite et de verification des fournisseurs pour s'assurer du respect des standards environnementaux et sociaux.",
    pillar: 'traceability',
    pillarLabel: 'Tracabilite',
    type: 'framework',
    typeLabel: 'Framework',
    priority: 'essential',
    priorityLabel: 'Incontournable',
    status: 'active',
    statusLabel: 'Actif',
    year: '2020',
    platformSection: 'Tracabilite + Conformite',
    platformIntegration: 'integrated',
    blockchainVerified: true,
    gegApplication:
      'La tracabilite blockchain documente chaque etape de la chaine de valeur : origine, transformation, transport, livraison. Preuve immutable.',
  },
  {
    id: 'iso-22095',
    reference: 'ISO 22095:2020',
    title: 'Chaine de controle -- Terminologie et modeles',
    description:
      'Norme definissant la terminologie et les modeles pour les systemes de chaine de controle. Applicable au recyclage et a la valorisation.',
    pillar: 'traceability',
    pillarLabel: 'Tracabilite',
    type: 'iso',
    typeLabel: 'Norme ISO',
    priority: 'fundamental',
    priorityLabel: 'Fondamentale',
    status: 'published',
    statusLabel: 'Publiee 2020',
    year: '2020',
    platformSection: 'Tracabilite blockchain',
    platformIntegration: 'integrated',
    blockchainVerified: false,
    gegApplication:
      'Le systeme de tracabilite GreenEcoGenius suit le modele de chaine de controle ISO 22095 pour les matieres secondaires.',
  },
  {
    id: 'eudr',
    reference: 'EUDR (UE 2023/1115)',
    title: 'Reglement sur la Deforestation',
    description:
      'Obligation de due diligence pour les produits lies a la deforestation : soja, huile de palme, bois, cacao, cafe, caoutchouc, betail.',
    pillar: 'traceability',
    pillarLabel: 'Tracabilite',
    type: 'regulation_eu',
    typeLabel: 'Reglement UE',
    priority: 'mandatory',
    priorityLabel: 'Obligatoire',
    status: 'active',
    statusLabel: 'En vigueur 2025',
    year: '2025',
    platformSection: 'Tracabilite + Conformite',
    platformIntegration: 'integrated',
    blockchainVerified: true,
    gegApplication:
      "La blockchain documente l'origine des matieres pour la due diligence EUDR. Preuve de non-deforestation verifiable.",
  },
  {
    id: '3tg',
    reference: 'Reglement 3TG (UE 2017/821)',
    title: 'Minerais de conflit -- Etain, Tantale, Tungstene et Or',
    description:
      "Obligation de due diligence pour les importateurs de minerais de zones de conflit. Tracabilite de la chaine d'approvisionnement.",
    pillar: 'traceability',
    pillarLabel: 'Tracabilite',
    type: 'regulation_eu',
    typeLabel: 'Reglement UE',
    priority: 'essential',
    priorityLabel: 'Incontournable',
    status: 'active',
    statusLabel: 'En vigueur',
    year: '2021',
    platformSection: 'Tracabilite + Conformite',
    platformIntegration: 'integrated',
    blockchainVerified: true,
    gegApplication:
      "La tracabilite blockchain permet de documenter l'origine des metaux et minerais pour la conformite 3TG.",
  },
  {
    id: 'passeport-batterie',
    reference: 'Passeport Batterie (UE 2023/1542)',
    title: 'Reglement Batteries -- Passeport numerique',
    description:
      'Obligation de passeport numerique pour les batteries industrielles et de vehicules electriques. Composition, origine, recyclabilite.',
    pillar: 'traceability',
    pillarLabel: 'Tracabilite',
    type: 'regulation_eu',
    typeLabel: 'Reglement UE',
    priority: 'upcoming',
    priorityLabel: 'A suivre',
    status: 'active',
    statusLabel: 'En vigueur 2027',
    year: '2027',
    platformSection: 'Tracabilite blockchain',
    platformIntegration: 'anticipated',
    blockchainVerified: true,
    gegApplication:
      "L'architecture blockchain de GreenEcoGenius est deja compatible avec le format passeport batterie : identifiant unique, historique immuable.",
  },

  // ── PILIER 5 : DONNEES & SAAS (5 normes) ──
  {
    id: 'rgpd',
    reference: 'RGPD (UE 2016/679)',
    title: 'Reglement General sur la Protection des Donnees',
    description:
      "Le reglement europeen de reference pour la protection des donnees personnelles. Consentement, droit a l'effacement, portabilite, DPO.",
    pillar: 'data',
    pillarLabel: 'Donnees & SaaS',
    type: 'regulation_eu',
    typeLabel: 'Reglement UE',
    priority: 'mandatory',
    priorityLabel: 'Obligatoire',
    status: 'active',
    statusLabel: 'En vigueur depuis 2018',
    year: '2018',
    platformSection: 'Infrastructure plateforme',
    platformIntegration: 'integrated',
    blockchainVerified: false,
    gegApplication:
      "GreenEcoGenius est conforme RGPD : consentement, droit a l'effacement, chiffrement, hebergement UE, politique de confidentialite complete.",
  },
  {
    id: 'iso-27001',
    reference: 'ISO 27001:2022',
    title: "Management de la securite de l'information",
    description:
      "Norme internationale de reference pour les systemes de management de la securite de l'information (SMSI). Certification reconnue mondialement.",
    pillar: 'data',
    pillarLabel: 'Donnees & SaaS',
    type: 'iso',
    typeLabel: 'Norme ISO',
    priority: 'essential',
    priorityLabel: 'Incontournable',
    status: 'published',
    statusLabel: 'Publiee 2022',
    year: '2022',
    platformSection: 'Infrastructure plateforme',
    platformIntegration: 'integrated',
    blockchainVerified: false,
    gegApplication:
      "L'infrastructure GreenEcoGenius suit les bonnes pratiques ISO 27001 : chiffrement, controle d'acces, journalisation, plan de continuite.",
  },
  {
    id: 'soc-2',
    reference: 'SOC 2 Type II',
    title: 'Service Organization Control -- Securite et disponibilite',
    description:
      "Standard americain d'audit pour les fournisseurs de services cloud. Couvre securite, disponibilite, integrite, confidentialite et vie privee.",
    pillar: 'data',
    pillarLabel: 'Donnees & SaaS',
    type: 'framework',
    typeLabel: 'Framework',
    priority: 'essential',
    priorityLabel: 'Incontournable',
    status: 'active',
    statusLabel: 'Actif',
    year: '2010',
    platformSection: 'Infrastructure plateforme',
    platformIntegration: 'integrated',
    blockchainVerified: false,
    gegApplication:
      'GreenEcoGenius respecte les principes SOC 2 : securite (chiffrement AES-256), disponibilite (SLA 99.9%), integrite des donnees.',
  },
  {
    id: 'nis2',
    reference: 'NIS2 (Directive 2022/2555)',
    title: "Securite des reseaux et systemes d'information",
    description:
      'Directive europeenne renforçant la cybersecurite des entreprises essentielles et importantes. Obligations de notification des incidents.',
    pillar: 'data',
    pillarLabel: 'Donnees & SaaS',
    type: 'directive_eu',
    typeLabel: 'Directive UE',
    priority: 'mandatory',
    priorityLabel: 'Obligatoire',
    status: 'active',
    statusLabel: 'En vigueur oct. 2024',
    year: '2024',
    platformSection: 'Infrastructure plateforme',
    platformIntegration: 'integrated',
    blockchainVerified: false,
    gegApplication:
      'GreenEcoGenius anticipe NIS2 : plan de reponse aux incidents, surveillance continue, gouvernance de la cybersecurite.',
  },
  {
    id: 'ai-act',
    reference: 'AI Act (UE 2024/1689)',
    title: "Reglement sur l'Intelligence Artificielle",
    description:
      "Premier cadre juridique mondial pour l'IA. Classe les systemes d'IA par niveau de risque et impose des obligations de transparence.",
    pillar: 'data',
    pillarLabel: 'Donnees & SaaS',
    type: 'regulation_eu',
    typeLabel: 'Reglement UE',
    priority: 'upcoming',
    priorityLabel: 'A suivre',
    status: 'active',
    statusLabel: 'En vigueur 2024+',
    year: '2024',
    platformSection: 'IA GreenEcoGenius',
    platformIntegration: 'integrated',
    blockchainVerified: false,
    gegApplication:
      'L\'IA de GreenEcoGenius est classee "risque limite". Transparence totale : chaque recommandation IA est tracable et explicable.',
  },

  // ── PILIER 6 : LABELS & CERTIFICATIONS RSE (4 labels) ──
  {
    id: 'b-corp',
    reference: 'B Corp',
    title: 'Certification B Corporation',
    description:
      'Certification internationale des entreprises qui repondent aux normes les plus elevees de performance sociale et environnementale, transparence et responsabilite.',
    pillar: 'labels',
    pillarLabel: 'Labels RSE',
    type: 'label',
    typeLabel: 'Label',
    priority: 'strategic',
    priorityLabel: 'Strategique',
    status: 'active',
    statusLabel: 'Actif',
    year: '2006',
    platformSection: 'RSE & Labels',
    platformIntegration: 'integrated',
    blockchainVerified: false,
    gegApplication:
      'Le diagnostic RSE evalue votre score B Corp potentiel. La plateforme identifie les actions pour atteindre le seuil de certification (80 points).',
  },
  {
    id: 'numerique-responsable',
    reference: 'Label Numerique Responsable',
    title: 'Label NR -- Institut du Numerique Responsable',
    description:
      "Label francais certifiant l'engagement des organisations dans une demarche de numerique responsable. Ecoconception, accessibilite, ethique.",
    pillar: 'labels',
    pillarLabel: 'Labels RSE',
    type: 'label',
    typeLabel: 'Label',
    priority: 'strategic',
    priorityLabel: 'Strategique',
    status: 'active',
    statusLabel: 'Actif',
    year: '2019',
    platformSection: 'RSE & Labels',
    platformIntegration: 'integrated',
    blockchainVerified: false,
    gegApplication:
      'Le diagnostic RSE evalue votre eligibilite au Label NR. GreenEcoGenius elle-meme vise cette certification.',
  },
  {
    id: 'lucie-26000',
    reference: 'Lucie 26000',
    title: 'Label RSE aligne sur ISO 26000',
    description:
      'Label francais de reference RSE base sur la norme ISO 26000. Couvre gouvernance, droits humains, environnement, loyaute des pratiques.',
    pillar: 'labels',
    pillarLabel: 'Labels RSE',
    type: 'label',
    typeLabel: 'Label',
    priority: 'essential',
    priorityLabel: 'Incontournable',
    status: 'active',
    statusLabel: 'Actif',
    year: '2012',
    platformSection: 'RSE & Labels',
    platformIntegration: 'integrated',
    blockchainVerified: false,
    gegApplication:
      "Le diagnostic RSE couvre les 7 questions centrales d'ISO 26000 et evalue votre eligibilite Lucie 26000.",
  },
  {
    id: 'engage-rse',
    reference: 'Engage RSE (AFNOR)',
    title: 'Label Engage RSE -- Evaluation AFNOR',
    description:
      "Evaluation RSE par l'AFNOR (organisme francais de normalisation). 4 niveaux : Engagement, Progression, Maturite, Exemplaire.",
    pillar: 'labels',
    pillarLabel: 'Labels RSE',
    type: 'label',
    typeLabel: 'Label',
    priority: 'essential',
    priorityLabel: 'Incontournable',
    status: 'active',
    statusLabel: 'Actif',
    year: '2015',
    platformSection: 'RSE & Labels',
    platformIntegration: 'integrated',
    blockchainVerified: false,
    gegApplication:
      "Le diagnostic RSE positionne votre organisation sur l'echelle AFNOR Engage RSE et identifie les actions pour progresser.",
  },
];

// ── Helpers ──

export function getNormsByPillar(pillar: NormPillar): Norm[] {
  return NORMS_DATABASE.filter((n) => n.pillar === pillar);
}

export function getNormsByType(type: NormType): Norm[] {
  return NORMS_DATABASE.filter((n) => n.type === type);
}

export function getBlockchainVerifiedNorms(): Norm[] {
  return NORMS_DATABASE.filter((n) => n.blockchainVerified);
}

export function getUpcomingNorms(): Norm[] {
  return NORMS_DATABASE.filter(
    (n) => n.status === 'in_development' || n.status === 'planned',
  );
}

export const PILLAR_ORDER: NormPillar[] = [
  'circular_economy',
  'carbon',
  'reporting',
  'traceability',
  'data',
  'labels',
];

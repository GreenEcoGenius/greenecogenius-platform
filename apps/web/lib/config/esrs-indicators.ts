/**
 * ESRS indicators for CSRD reporting.
 * 82 indicators across 10 categories (E1-E5, S1-S4, G1).
 *
 * Each indicator can be:
 * - Manual: user fills in the value via the ESG wizard
 * - Auto-populated: value comes from another section (carbon, comptoir, etc.)
 */

export interface ESRSIndicator {
  code: string;
  name: string;
  category: string;
  description: string;
  unit: string;
  mandatory: boolean;
  dataType: 'number' | 'text' | 'percentage' | 'boolean' | 'currency';
  autoSource?: 'carbon' | 'comptoir' | 'blockchain' | 'rse' | 'compliance';
}

export const ESRS_CATEGORIES: Record<
  string,
  { name: string; nameFr: string; icon: string; count: number }
> = {
  E1: { name: 'Climate change', nameFr: 'Changement climatique', icon: 'Thermometer', count: 9 },
  E2: { name: 'Pollution', nameFr: 'Pollution', icon: 'CloudRain', count: 6 },
  E3: { name: 'Water and marine resources', nameFr: 'Ressources aquatiques et marines', icon: 'Droplets', count: 5 },
  E4: { name: 'Biodiversity and ecosystems', nameFr: 'Biodiversite et ecosystemes', icon: 'TreePine', count: 6 },
  E5: { name: 'Resource use and circular economy', nameFr: 'Utilisation des ressources et economie circulaire', icon: 'Recycle', count: 6 },
  S1: { name: 'Own workforce', nameFr: 'Effectifs propres', icon: 'Users', count: 17 },
  S2: { name: 'Workers in the value chain', nameFr: 'Travailleurs de la chaine de valeur', icon: 'UserCog', count: 5 },
  S3: { name: 'Affected communities', nameFr: 'Communautes affectees', icon: 'Building2', count: 5 },
  S4: { name: 'Consumers and end-users', nameFr: 'Consommateurs et utilisateurs finaux', icon: 'ShoppingBag', count: 5 },
  G1: { name: 'Business conduct', nameFr: 'Conduite des affaires', icon: 'Shield', count: 6 },
};

/**
 * All 82 ESRS indicators.
 * Auto-populated indicators have autoSource set.
 */
export const ESRS_INDICATORS: ESRSIndicator[] = [
  // ── E1: Climate change (9) ──
  { code: 'E1-1', name: 'Emissions brutes Scope 1', category: 'E1', description: 'Emissions directes GES', unit: 'tCO2e', mandatory: true, dataType: 'number', autoSource: 'carbon' },
  { code: 'E1-2', name: 'Emissions brutes Scope 2', category: 'E1', description: 'Emissions indirectes energie', unit: 'tCO2e', mandatory: true, dataType: 'number', autoSource: 'carbon' },
  { code: 'E1-3', name: 'Emissions brutes Scope 3', category: 'E1', description: 'Emissions chaine de valeur', unit: 'tCO2e', mandatory: true, dataType: 'number', autoSource: 'carbon' },
  { code: 'E1-4', name: 'Emissions totales GES', category: 'E1', description: 'Total Scope 1+2+3', unit: 'tCO2e', mandatory: true, dataType: 'number', autoSource: 'carbon' },
  { code: 'E1-5', name: 'Intensite carbone', category: 'E1', description: 'Emissions par unite de CA', unit: 'tCO2e/M€', mandatory: true, dataType: 'number' },
  { code: 'E1-6', name: 'Objectif de reduction GES', category: 'E1', description: 'Objectif annuel de reduction', unit: '%', mandatory: true, dataType: 'percentage' },
  { code: 'E1-7', name: 'Consommation energie totale', category: 'E1', description: 'Energie consommee', unit: 'MWh', mandatory: true, dataType: 'number' },
  { code: 'E1-8', name: 'Part energie renouvelable', category: 'E1', description: 'Part ENR dans le mix', unit: '%', mandatory: false, dataType: 'percentage' },
  { code: 'E1-9', name: 'Plan de transition climatique', category: 'E1', description: 'Existence plan transition', unit: '', mandatory: true, dataType: 'boolean' },

  // ── E2: Pollution (6) ──
  { code: 'E2-1', name: 'Emissions polluants air', category: 'E2', description: 'Polluants atmospheriques', unit: 'kg', mandatory: false, dataType: 'number' },
  { code: 'E2-2', name: 'Emissions polluants eau', category: 'E2', description: 'Rejets aquatiques', unit: 'kg', mandatory: false, dataType: 'number' },
  { code: 'E2-3', name: 'Emissions polluants sol', category: 'E2', description: 'Contamination sols', unit: 'kg', mandatory: false, dataType: 'number' },
  { code: 'E2-4', name: 'Substances preoccupantes', category: 'E2', description: 'SVHC utilisees', unit: 'kg', mandatory: false, dataType: 'number' },
  { code: 'E2-5', name: 'Microplastiques', category: 'E2', description: 'Emissions microplastiques', unit: 'kg', mandatory: false, dataType: 'number' },
  { code: 'E2-6', name: 'Plan reduction pollution', category: 'E2', description: 'Actions contre la pollution', unit: '', mandatory: false, dataType: 'text' },

  // ── E3: Water (5) ──
  { code: 'E3-1', name: 'Consommation eau', category: 'E3', description: 'Volume eau consommee', unit: 'm3', mandatory: false, dataType: 'number' },
  { code: 'E3-2', name: 'Eau recyclee/reutilisee', category: 'E3', description: 'Part eau recyclee', unit: '%', mandatory: false, dataType: 'percentage' },
  { code: 'E3-3', name: 'Rejets aquatiques', category: 'E3', description: 'Volume eaux usees', unit: 'm3', mandatory: false, dataType: 'number' },
  { code: 'E3-4', name: 'Zones de stress hydrique', category: 'E3', description: 'Operations en zone de stress', unit: '', mandatory: false, dataType: 'boolean' },
  { code: 'E3-5', name: 'Impact ecosystemes marins', category: 'E3', description: 'Impact milieux aquatiques', unit: '', mandatory: false, dataType: 'text' },

  // ── E4: Biodiversity (6) ──
  { code: 'E4-1', name: 'Sites en zones protegees', category: 'E4', description: 'Operations en zones Natura 2000', unit: '', mandatory: false, dataType: 'number' },
  { code: 'E4-2', name: 'Superficie artificalisee', category: 'E4', description: 'Sols impermeabilises', unit: 'ha', mandatory: false, dataType: 'number' },
  { code: 'E4-3', name: 'Impact biodiversite', category: 'E4', description: 'Evaluation impact biodiversite', unit: '', mandatory: false, dataType: 'text' },
  { code: 'E4-4', name: 'Plan preservation', category: 'E4', description: 'Actions pour la biodiversite', unit: '', mandatory: false, dataType: 'text' },
  { code: 'E4-5', name: 'Especes menacees', category: 'E4', description: 'Especes UICN impactees', unit: '', mandatory: false, dataType: 'number' },
  { code: 'E4-6', name: 'Deforestation', category: 'E4', description: 'Politique zero deforestation', unit: '', mandatory: false, dataType: 'boolean' },

  // ── E5: Circular economy (6) ──
  { code: 'E5-1', name: 'Matieres entrantes recyclees', category: 'E5', description: 'Part de matieres recyclees dans les intrants', unit: 't', mandatory: true, dataType: 'number', autoSource: 'comptoir' },
  { code: 'E5-2', name: 'Matieres sortantes recyclees', category: 'E5', description: 'Dechets valorises en sortie', unit: 't', mandatory: true, dataType: 'number', autoSource: 'comptoir' },
  { code: 'E5-3', name: 'Taux de valorisation', category: 'E5', description: 'Part dechets valorises vs total', unit: '%', mandatory: true, dataType: 'percentage', autoSource: 'comptoir' },
  { code: 'E5-4', name: 'Dechets produits', category: 'E5', description: 'Total dechets generes', unit: 't', mandatory: true, dataType: 'number' },
  { code: 'E5-5', name: 'CO2 evite par recyclage', category: 'E5', description: 'Emissions evitees economie circulaire', unit: 'tCO2e', mandatory: false, dataType: 'number', autoSource: 'comptoir' },
  { code: 'E5-6', name: 'Lots traces et certifies', category: 'E5', description: 'Lots avec tracabilite blockchain', unit: '', mandatory: false, dataType: 'number', autoSource: 'blockchain' },

  // ── S1: Own workforce (17) ──
  { code: 'S1-1', name: 'Effectif total', category: 'S1', description: 'Nombre total de salaries', unit: '', mandatory: true, dataType: 'number', autoSource: 'rse' },
  { code: 'S1-2', name: 'Effectif femmes', category: 'S1', description: 'Nombre de femmes', unit: '', mandatory: true, dataType: 'number' },
  { code: 'S1-3', name: 'Effectif hommes', category: 'S1', description: 'Nombre d\'hommes', unit: '', mandatory: true, dataType: 'number' },
  { code: 'S1-4', name: 'CDI', category: 'S1', description: 'Contrats a duree indeterminee', unit: '', mandatory: true, dataType: 'number' },
  { code: 'S1-5', name: 'CDD', category: 'S1', description: 'Contrats a duree determinee', unit: '', mandatory: true, dataType: 'number' },
  { code: 'S1-6', name: 'Heures formation', category: 'S1', description: 'Total heures de formation', unit: 'h', mandatory: true, dataType: 'number', autoSource: 'rse' },
  { code: 'S1-7', name: 'Taux turnover', category: 'S1', description: 'Taux de rotation du personnel', unit: '%', mandatory: true, dataType: 'percentage' },
  { code: 'S1-8', name: 'Ecart remuneration H/F', category: 'S1', description: 'Ecart salarial femmes/hommes', unit: '%', mandatory: true, dataType: 'percentage' },
  { code: 'S1-9', name: 'Accidents du travail', category: 'S1', description: 'Nombre AT avec arret', unit: '', mandatory: true, dataType: 'number' },
  { code: 'S1-10', name: 'Taux frequence AT', category: 'S1', description: 'Frequence accidents', unit: '', mandatory: true, dataType: 'number' },
  { code: 'S1-11', name: 'Taux gravite AT', category: 'S1', description: 'Gravite accidents', unit: '', mandatory: true, dataType: 'number' },
  { code: 'S1-12', name: 'Salaire median', category: 'S1', description: 'Salaire median brut annuel', unit: '€', mandatory: false, dataType: 'currency' },
  { code: 'S1-13', name: 'Ratio equite salariale', category: 'S1', description: 'Ratio P90/P10', unit: '', mandatory: false, dataType: 'number' },
  { code: 'S1-14', name: 'Couverture sante', category: 'S1', description: 'Salaries couverts mutuelle', unit: '%', mandatory: false, dataType: 'percentage' },
  { code: 'S1-15', name: 'Dialogue social', category: 'S1', description: 'Accords collectifs signes', unit: '', mandatory: false, dataType: 'number' },
  { code: 'S1-16', name: 'Handicap', category: 'S1', description: 'Taux emploi travailleurs handicapes', unit: '%', mandatory: false, dataType: 'percentage' },
  { code: 'S1-17', name: 'Satisfaction employes', category: 'S1', description: 'Score satisfaction interne', unit: '/100', mandatory: false, dataType: 'number' },

  // ── S2: Value chain workers (5) ──
  { code: 'S2-1', name: 'Fournisseurs evalues RSE', category: 'S2', description: 'Part fournisseurs evalues', unit: '%', mandatory: false, dataType: 'percentage' },
  { code: 'S2-2', name: 'Audits fournisseurs', category: 'S2', description: 'Nombre audits sociaux', unit: '', mandatory: false, dataType: 'number' },
  { code: 'S2-3', name: 'Non-conformites fournisseurs', category: 'S2', description: 'Incidents identifies', unit: '', mandatory: false, dataType: 'number' },
  { code: 'S2-4', name: 'Code de conduite', category: 'S2', description: 'Fournisseurs signataires', unit: '%', mandatory: false, dataType: 'percentage' },
  { code: 'S2-5', name: 'Travail des enfants', category: 'S2', description: 'Politique travail enfants', unit: '', mandatory: false, dataType: 'boolean' },

  // ── S3: Affected communities (5) ──
  { code: 'S3-1', name: 'Engagement communautes', category: 'S3', description: 'Consultations communautaires', unit: '', mandatory: false, dataType: 'number' },
  { code: 'S3-2', name: 'Investissement local', category: 'S3', description: 'Budget engagement local', unit: '€', mandatory: false, dataType: 'currency' },
  { code: 'S3-3', name: 'Emplois locaux', category: 'S3', description: 'Part recrutement local', unit: '%', mandatory: false, dataType: 'percentage' },
  { code: 'S3-4', name: 'Mecenat et sponsoring', category: 'S3', description: 'Budget mecenat annuel', unit: '€', mandatory: false, dataType: 'currency' },
  { code: 'S3-5', name: 'Impact communautes', category: 'S3', description: 'Evaluation impact social', unit: '', mandatory: false, dataType: 'text' },

  // ── S4: Consumers (5) ──
  { code: 'S4-1', name: 'Securite produits', category: 'S4', description: 'Incidents securite produits', unit: '', mandatory: false, dataType: 'number' },
  { code: 'S4-2', name: 'Rappels produits', category: 'S4', description: 'Nombre de rappels', unit: '', mandatory: false, dataType: 'number' },
  { code: 'S4-3', name: 'Satisfaction clients', category: 'S4', description: 'Score NPS ou CSAT', unit: '/100', mandatory: false, dataType: 'number' },
  { code: 'S4-4', name: 'Protection donnees', category: 'S4', description: 'Incidents protection donnees', unit: '', mandatory: false, dataType: 'number' },
  { code: 'S4-5', name: 'Information consommateurs', category: 'S4', description: 'Politique transparence', unit: '', mandatory: false, dataType: 'text' },

  // ── G1: Business conduct (6) ──
  { code: 'G1-1', name: 'Culture et politique', category: 'G1', description: 'Politique RSE formalisee', unit: '', mandatory: true, dataType: 'boolean', autoSource: 'rse' },
  { code: 'G1-2', name: 'Composition gouvernance', category: 'G1', description: 'Composition conseil administration', unit: '', mandatory: true, dataType: 'text' },
  { code: 'G1-3', name: 'Prevention corruption', category: 'G1', description: 'Politique anti-corruption', unit: '', mandatory: true, dataType: 'boolean', autoSource: 'rse' },
  { code: 'G1-4', name: 'Conformite reglementaire', category: 'G1', description: 'Score conformite plateforme', unit: '%', mandatory: true, dataType: 'percentage', autoSource: 'compliance' },
  { code: 'G1-5', name: 'Lobbying', category: 'G1', description: 'Depenses de lobbying', unit: '€', mandatory: false, dataType: 'currency' },
  { code: 'G1-6', name: 'Ethique des affaires', category: 'G1', description: 'Signalements ethiques', unit: '', mandatory: false, dataType: 'number' },
];

/** Get auto-populated indicator count */
export function getAutoPopulatedCount(): number {
  return ESRS_INDICATORS.filter((i) => i.autoSource).length;
}

/** Get indicators by category */
export function getIndicatorsByCategory(category: string): ESRSIndicator[] {
  return ESRS_INDICATORS.filter((i) => i.category === category);
}

/** Total indicator count */
export const TOTAL_INDICATORS = ESRS_INDICATORS.length;

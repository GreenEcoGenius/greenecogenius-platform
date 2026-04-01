import { pdfService, COLORS } from '../pdf-service';

export interface ESGReportData {
  companyName: string;
  year: number;
  date: string;
  format: 'ghg_protocol' | 'csrd' | 'gri';
  formatLabel: string;
  scope1Kg: number;
  scope2Kg: number;
  scope3Kg: number;
  totalKg: number;
  avoidedKg: number;
  netKg: number;
  perEmployeeKg: number;
  breakdown: {
    scope1: Record<string, number>;
    scope2: Record<string, number>;
    scope3: Record<string, number>;
  };
  esg: Record<string, unknown>;
  platformTonnesRecycled: number;
  platformTransactionCount: number;
  aiSummary: string;
  nbEmployees?: number;
  industrySector?: string;
}

const LABELS = {
  en: {
    coverTitle: 'COMPLETE ESG REPORT',
    reportingYear: 'Reporting year',
    headerTitle: (year: number) => `ESG Report ${year}`,
    executiveSummary: 'Executive Summary',
    emissionsSummary: 'Emissions Summary',
    thScope: 'Scope',
    thEmissionsKg: 'Emissions (kg CO2e)',
    thEmissionsT: 'Emissions (t)',
    thShare: 'Share (%)',
    scope1Direct: 'Scope 1 -- Direct',
    scope2Energy: 'Scope 2 -- Energy',
    scope3Indirect: 'Scope 3 -- Indirect',
    totalEmissions: 'TOTAL EMISSIONS',
    co2Avoided: 'CO2 avoided (platform)',
    netEmissions: 'NET EMISSIONS',
    intensityPerEmployee: (kg: string, t: string) =>
      `Intensity per employee: ${kg} kg CO2e (${t} t)`,
    scope1Title: 'Scope 1 -- Direct emissions',
    thSource: 'Source',
    thData: 'Data',
    thEmissionsKgShort: 'Emissions (kg CO2e)',
    naturalGas: 'Natural gas',
    fuel: (type: string) => `Fuel (${type})`,
    otherDirect: 'Other direct emissions',
    totalScope1: 'Total Scope 1',
    scope2Title: 'Scope 2 -- Indirect energy emissions',
    electricityRenewable: '100% renewable',
    electricityGrid: 'grid',
    electricity: (source: string) => `Electricity (${source})`,
    heating: 'Heating',
    totalScope2: 'Total Scope 2',
    scope3Title: 'Scope 3 -- Other indirect emissions',
    businessTravel: 'Business travel',
    commuting: 'Commuting',
    purchasedGoods: 'Purchased goods & services',
    waste: 'Waste',
    totalScope3: 'Total Scope 3',
    circularEconomy: 'Circular economy -- Platform impact',
    thIndicator: 'Indicator',
    thValue: 'Value',
    tonnesRecycled: 'Tonnes recycled',
    co2AvoidedShort: 'CO2 avoided',
    trackedTransactions: 'Tracked transactions',
    visualEquivalences: 'Visual equivalences',
    thEquivalence: 'Equivalence',
    thDescription: 'Description',
    trees: 'Trees',
    treesDesc: 'trees needed to absorb your emissions in 1 year',
    cars: 'Cars',
    carsDesc: 'cars driven for 1 year (15,000 km)',
    flights: 'Flights',
    flightsDesc: 'round-trip flights Paris -- New York',
    methodology: 'Methodology',
    methodologyText: (format: string) =>
      `This report was generated according to the ${format} format and ADEME Base Carbone 2024 emission factors.`,
    standardsApplied: 'Applied standards',
    ghgProtocol: 'GHG Protocol: Corporate Standard & Scope 3 Standard',
    csrd: 'CSRD: European Corporate Sustainability Reporting Directive\nESRS E1: European Sustainability Reporting Standards -- Climate Change',
    gri: 'GRI 305: Emissions\nGRI 306: Waste\nGRI 302: Energy',
    scopes:
      'Scopes:\n- Scope 1: Direct emissions (on-site combustion, vehicles)\n- Scope 2: Indirect emissions from purchased energy\n- Scope 3: Other indirect emissions (value chain)',
    dataSources:
      'Data sources:\n- Organizational data entered by the user\n- Recycling data tracked via the GreenEcoGenius platform\n- Emission factors: ADEME Base Carbone 2024',
    warning:
      'Disclaimer: This report is automatically generated from user-provided data. It is for informational purposes only and does not constitute a certified audit. For official CSRD/GRI reporting, we recommend verification by an independent third-party body.',
    employees: 'empl.',
    litres: 'litres',
    tonnes: 'tonnes',
  },
  fr: {
    coverTitle: 'RAPPORT ESG COMPLET',
    reportingYear: 'Annee de reporting',
    headerTitle: (year: number) => `Rapport ESG ${year}`,
    executiveSummary: 'Synthese executive',
    emissionsSummary: 'Synthese des emissions',
    thScope: 'Scope',
    thEmissionsKg: 'Emissions (kg CO2e)',
    thEmissionsT: 'Emissions (t)',
    thShare: 'Part (%)',
    scope1Direct: 'Scope 1 -- Direct',
    scope2Energy: 'Scope 2 -- Energie',
    scope3Indirect: 'Scope 3 -- Indirect',
    totalEmissions: 'TOTAL EMISSIONS',
    co2Avoided: 'CO2 evite (plateforme)',
    netEmissions: 'EMISSIONS NETTES',
    intensityPerEmployee: (kg: string, t: string) =>
      `Intensite par collaborateur : ${kg} kg CO2e (${t} t)`,
    scope1Title: 'Scope 1 -- Emissions directes',
    thSource: 'Source',
    thData: 'Donnee',
    thEmissionsKgShort: 'Emissions (kg CO2e)',
    naturalGas: 'Gaz naturel',
    fuel: (type: string) => `Carburant (${type})`,
    otherDirect: 'Autres emissions directes',
    totalScope1: 'Total Scope 1',
    scope2Title: 'Scope 2 -- Emissions energetiques indirectes',
    electricityRenewable: '100% renouvelable',
    electricityGrid: 'reseau FR',
    electricity: (source: string) => `Electricite (${source})`,
    heating: 'Chauffage',
    totalScope2: 'Total Scope 2',
    scope3Title: 'Scope 3 -- Autres emissions indirectes',
    businessTravel: 'Deplacements professionnels',
    commuting: 'Trajets domicile-travail',
    purchasedGoods: 'Achats de biens et services',
    waste: 'Dechets',
    totalScope3: 'Total Scope 3',
    circularEconomy: 'Economie circulaire -- Impact plateforme',
    thIndicator: 'Indicateur',
    thValue: 'Valeur',
    tonnesRecycled: 'Tonnes recyclees',
    co2AvoidedShort: 'CO2 evite',
    trackedTransactions: 'Transactions tracees',
    visualEquivalences: 'Equivalences visuelles',
    thEquivalence: 'Equivalence',
    thDescription: 'Description',
    trees: 'Arbres',
    treesDesc: 'arbres necessaires pour absorber vos emissions en 1 an',
    cars: 'Voitures',
    carsDesc: 'voitures roulant pendant 1 an (15 000 km)',
    flights: 'Vols',
    flightsDesc: 'vols aller-retour Paris -- New York',
    methodology: 'Methodologie',
    methodologyText: (format: string) =>
      `Ce rapport a ete genere selon le format ${format} et les facteurs d'emission de la Base Carbone ADEME 2024.`,
    standardsApplied: 'Standards appliques',
    ghgProtocol: 'GHG Protocol : Corporate Standard & Scope 3 Standard',
    csrd: 'CSRD : Directive europeenne sur le reporting de durabilite\nESRS E1 : European Sustainability Reporting Standards -- Climate Change',
    gri: 'GRI 305 : Emissions\nGRI 306 : Dechets\nGRI 302 : Energie',
    scopes:
      "Perimetres :\n- Scope 1 : Emissions directes (combustion sur site, vehicules)\n- Scope 2 : Emissions indirectes liees a l'energie achetee\n- Scope 3 : Autres emissions indirectes (chaine de valeur)",
    dataSources:
      "Sources de donnees :\n- Donnees organisationnelles saisies par l'utilisateur\n- Donnees de recyclage tracees via la plateforme GreenEcoGenius\n- Facteurs d'emission : Base Carbone ADEME 2024",
    warning:
      "Avertissement : Ce rapport est genere automatiquement a partir des donnees fournies par l'utilisateur. Il est fourni a titre indicatif et ne constitue pas un audit certifie. Pour un reporting officiel CSRD/GRI, nous recommandons une verification par un organisme tiers independant (OTI).",
    employees: 'empl.',
    litres: 'litres',
    tonnes: 'tonnes',
  },
} as const;

type Locale = keyof typeof LABELS;

const fmt = (v: number) => v.toFixed(1);
const fmtT = (v: number) => (v / 1000).toFixed(2);

export function generateESGReportPDF(
  data: ESGReportData,
  locale: string = 'fr',
): ArrayBuffer {
  const labels =
    LABELS[(locale as Locale) in LABELS ? (locale as Locale) : 'fr'];
  const doc = pdfService.createDocument();
  const pw = pdfService.pageWidth;
  const headerTitle = labels.headerTitle(data.year);

  // Cover page
  pdfService.addCoverPage(doc, {
    title: labels.coverTitle,
    subtitle: `${labels.reportingYear} : ${data.year} -- ${data.formatLabel}`,
    organization: data.companyName,
    date: data.date,
    score: `${fmtT(data.totalKg)} t CO2e`,
    accentColor: [79, 70, 229], // indigo
    locale,
  });

  // Page 2: Executive summary
  let y = pdfService.addNewPageWithHeader(doc, headerTitle);
  y = pdfService.addSectionTitle(doc, labels.executiveSummary, y);
  y = pdfService.addParagraph(doc, data.aiSummary, 15, y, 180);
  pdfService.addFooter(doc, 2, undefined, locale);

  // Page 3: Emissions summary
  y = pdfService.addNewPageWithHeader(doc, headerTitle);
  y = pdfService.addSectionTitle(doc, labels.emissionsSummary, y);

  y = pdfService.addTable(
    doc,
    y,
    [labels.thScope, labels.thEmissionsKg, labels.thEmissionsT, labels.thShare],
    [
      [
        labels.scope1Direct,
        fmt(data.scope1Kg),
        fmtT(data.scope1Kg),
        data.totalKg > 0
          ? `${((data.scope1Kg / data.totalKg) * 100).toFixed(1)}%`
          : '0%',
      ],
      [
        labels.scope2Energy,
        fmt(data.scope2Kg),
        fmtT(data.scope2Kg),
        data.totalKg > 0
          ? `${((data.scope2Kg / data.totalKg) * 100).toFixed(1)}%`
          : '0%',
      ],
      [
        labels.scope3Indirect,
        fmt(data.scope3Kg),
        fmtT(data.scope3Kg),
        data.totalKg > 0
          ? `${((data.scope3Kg / data.totalKg) * 100).toFixed(1)}%`
          : '0%',
      ],
      [labels.totalEmissions, fmt(data.totalKg), fmtT(data.totalKg), '100%'],
      [
        labels.co2Avoided,
        `-${fmt(data.avoidedKg)}`,
        `-${fmtT(data.avoidedKg)}`,
        '',
      ],
      [labels.netEmissions, fmt(data.netKg), fmtT(data.netKg), ''],
    ],
  );

  if (data.perEmployeeKg > 0) {
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.gray);
    doc.text(
      labels.intensityPerEmployee(
        fmt(data.perEmployeeKg),
        fmtT(data.perEmployeeKg),
      ),
      15,
      y,
    );
    y += 8;
  }

  // Scope details
  y = pdfService.addSectionTitle(doc, labels.scope1Title, y);

  const esg = data.esg;
  const b1 = data.breakdown.scope1;
  y = pdfService.addTable(
    doc,
    y,
    [labels.thSource, labels.thData, labels.thEmissionsKgShort],
    [
      [
        labels.naturalGas,
        `${esg.natural_gas_kwh ?? 0} kWh`,
        fmt(b1.natural_gas ?? 0),
      ],
      [
        labels.fuel((esg.fuel_type as string) ?? 'diesel'),
        `${esg.fuel_liters ?? 0} ${labels.litres}`,
        fmt(b1.fuel ?? 0),
      ],
      [labels.otherDirect, '--', fmt(b1.other ?? 0)],
      [labels.totalScope1, '', fmt(data.scope1Kg)],
    ],
  );

  pdfService.addFooter(doc, 3, undefined, locale);

  // Page 4: Scope 2 & 3
  y = pdfService.addNewPageWithHeader(doc, headerTitle);

  y = pdfService.addSectionTitle(doc, labels.scope2Title, y);
  const b2 = data.breakdown.scope2;
  const elecSource =
    esg.electricity_source === 'renewable'
      ? labels.electricityRenewable
      : labels.electricityGrid;
  y = pdfService.addTable(
    doc,
    y,
    [labels.thSource, labels.thData, labels.thEmissionsKgShort],
    [
      [
        labels.electricity(elecSource),
        `${esg.electricity_kwh ?? 0} kWh`,
        fmt(b2.electricity ?? 0),
      ],
      [labels.heating, `${esg.heating_kwh ?? 0} kWh`, fmt(b2.heating ?? 0)],
      [labels.totalScope2, '', fmt(data.scope2Kg)],
    ],
  );

  y = pdfService.addSectionTitle(doc, labels.scope3Title, y);
  const b3 = data.breakdown.scope3;
  y = pdfService.addTable(
    doc,
    y,
    [labels.thSource, labels.thData, labels.thEmissionsKgShort],
    [
      [
        labels.businessTravel,
        `${esg.business_travel_km ?? 0} km`,
        fmt(b3.travel ?? 0),
      ],
      [
        labels.commuting,
        `${esg.commuting_employees ?? 0} ${labels.employees} x ${esg.commuting_avg_km ?? 0} km`,
        fmt(b3.commuting ?? 0),
      ],
      [
        labels.purchasedGoods,
        `${esg.purchased_goods_eur ?? 0} EUR`,
        fmt(b3.goods ?? 0),
      ],
      [
        labels.waste,
        `${esg.waste_tonnes ?? 0} ${labels.tonnes}`,
        fmt(b3.waste ?? 0),
      ],
      [labels.totalScope3, '', fmt(data.scope3Kg)],
    ],
  );

  pdfService.addFooter(doc, 4, undefined, locale);

  // Page 5: Circular economy + equivalences
  y = pdfService.addNewPageWithHeader(doc, headerTitle);

  y = pdfService.addSectionTitle(doc, labels.circularEconomy, y);

  y = pdfService.addTable(
    doc,
    y,
    [labels.thIndicator, labels.thValue],
    [
      [labels.tonnesRecycled, `${data.platformTonnesRecycled.toFixed(1)} t`],
      [labels.co2AvoidedShort, `${fmt(data.avoidedKg)} kg CO2e`],
      [labels.trackedTransactions, `${data.platformTransactionCount}`],
    ],
  );

  y = pdfService.addSectionTitle(doc, labels.visualEquivalences, y);

  const treesEquiv = Math.round(data.totalKg / 22);
  const carsEquiv = (data.totalKg / 4600).toFixed(1);
  const flightsEquiv = Math.round(data.totalKg / 900);

  y = pdfService.addTable(
    doc,
    y,
    [labels.thEquivalence, labels.thValue, labels.thDescription],
    [
      [labels.trees, `${treesEquiv}`, labels.treesDesc],
      [labels.cars, carsEquiv, labels.carsDesc],
      [labels.flights, `${flightsEquiv}`, labels.flightsDesc],
    ],
  );

  pdfService.addFooter(doc, 5, undefined, locale);

  // Page 6: Methodology
  y = pdfService.addNewPageWithHeader(doc, headerTitle);
  y = pdfService.addSectionTitle(doc, labels.methodology, y);

  y = pdfService.addParagraph(
    doc,
    labels.methodologyText(data.formatLabel),
    15,
    y,
    180,
  );

  const standards: Record<string, string> = {
    ghg_protocol: labels.ghgProtocol,
    csrd: labels.csrd,
    gri: labels.gri,
  };

  y = pdfService.addParagraph(
    doc,
    `${labels.standardsApplied} :\n${standards[data.format] ?? standards.ghg_protocol}`,
    15,
    y,
    180,
  );

  y = pdfService.addParagraph(doc, labels.scopes, 15, y, 180);

  y = pdfService.addParagraph(doc, labels.dataSources, 15, y, 180);

  y += 5;
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.gray);
  doc.setFont('helvetica', 'italic');

  const warningLines = doc.splitTextToSize(labels.warning, pw - 30);
  doc.text(warningLines, 15, y);

  pdfService.addFooter(doc, 6, undefined, locale);

  return pdfService.toArrayBuffer(doc);
}

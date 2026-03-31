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

const fmt = (v: number) => v.toFixed(1);
const fmtT = (v: number) => (v / 1000).toFixed(2);

export function generateESGReportPDF(data: ESGReportData): Uint8Array {
  const doc = pdfService.createDocument();
  const pw = pdfService.pageWidth;
  const headerTitle = `Rapport ESG ${data.year}`;

  // Cover page
  pdfService.addCoverPage(doc, {
    title: 'RAPPORT ESG COMPLET',
    subtitle: `Annee de reporting : ${data.year} -- ${data.formatLabel}`,
    organization: data.companyName,
    date: data.date,
    score: `${fmtT(data.totalKg)} t CO2e`,
    accentColor: [79, 70, 229], // indigo
  });

  // Page 2: Executive summary
  let y = pdfService.addNewPageWithHeader(doc, headerTitle);
  y = pdfService.addSectionTitle(doc, 'Synthese executive', y);
  y = pdfService.addParagraph(doc, data.aiSummary, 15, y, 180);
  pdfService.addFooter(doc, 2);

  // Page 3: Emissions summary
  y = pdfService.addNewPageWithHeader(doc, headerTitle);
  y = pdfService.addSectionTitle(doc, 'Synthese des emissions', y);

  y = pdfService.addTable(
    doc,
    y,
    ['Scope', 'Emissions (kg CO2e)', 'Emissions (t)', 'Part (%)'],
    [
      [
        'Scope 1 -- Direct',
        fmt(data.scope1Kg),
        fmtT(data.scope1Kg),
        data.totalKg > 0
          ? `${((data.scope1Kg / data.totalKg) * 100).toFixed(1)}%`
          : '0%',
      ],
      [
        'Scope 2 -- Energie',
        fmt(data.scope2Kg),
        fmtT(data.scope2Kg),
        data.totalKg > 0
          ? `${((data.scope2Kg / data.totalKg) * 100).toFixed(1)}%`
          : '0%',
      ],
      [
        'Scope 3 -- Indirect',
        fmt(data.scope3Kg),
        fmtT(data.scope3Kg),
        data.totalKg > 0
          ? `${((data.scope3Kg / data.totalKg) * 100).toFixed(1)}%`
          : '0%',
      ],
      ['TOTAL EMISSIONS', fmt(data.totalKg), fmtT(data.totalKg), '100%'],
      [
        'CO2 evite (plateforme)',
        `-${fmt(data.avoidedKg)}`,
        `-${fmtT(data.avoidedKg)}`,
        '',
      ],
      ['EMISSIONS NETTES', fmt(data.netKg), fmtT(data.netKg), ''],
    ],
  );

  if (data.perEmployeeKg > 0) {
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.gray);
    doc.text(
      `Intensite par collaborateur : ${fmt(data.perEmployeeKg)} kg CO2e (${fmtT(data.perEmployeeKg)} t)`,
      15,
      y,
    );
    y += 8;
  }

  // Scope details
  y = pdfService.addSectionTitle(doc, 'Scope 1 -- Emissions directes', y);

  const esg = data.esg;
  const b1 = data.breakdown.scope1;
  y = pdfService.addTable(
    doc,
    y,
    ['Source', 'Donnee', 'Emissions (kg CO2e)'],
    [
      [
        'Gaz naturel',
        `${esg.natural_gas_kwh ?? 0} kWh`,
        fmt(b1.natural_gas ?? 0),
      ],
      [
        `Carburant (${(esg.fuel_type as string) ?? 'diesel'})`,
        `${esg.fuel_liters ?? 0} litres`,
        fmt(b1.fuel ?? 0),
      ],
      ['Autres emissions directes', '--', fmt(b1.other ?? 0)],
      ['Total Scope 1', '', fmt(data.scope1Kg)],
    ],
  );

  pdfService.addFooter(doc, 3);

  // Page 4: Scope 2 & 3
  y = pdfService.addNewPageWithHeader(doc, headerTitle);

  y = pdfService.addSectionTitle(
    doc,
    'Scope 2 -- Emissions energetiques indirectes',
    y,
  );
  const b2 = data.breakdown.scope2;
  y = pdfService.addTable(
    doc,
    y,
    ['Source', 'Donnee', 'Emissions (kg CO2e)'],
    [
      [
        `Electricite (${esg.electricity_source === 'renewable' ? '100% renouvelable' : 'reseau FR'})`,
        `${esg.electricity_kwh ?? 0} kWh`,
        fmt(b2.electricity ?? 0),
      ],
      ['Chauffage', `${esg.heating_kwh ?? 0} kWh`, fmt(b2.heating ?? 0)],
      ['Total Scope 2', '', fmt(data.scope2Kg)],
    ],
  );

  y = pdfService.addSectionTitle(
    doc,
    'Scope 3 -- Autres emissions indirectes',
    y,
  );
  const b3 = data.breakdown.scope3;
  y = pdfService.addTable(
    doc,
    y,
    ['Source', 'Donnee', 'Emissions (kg CO2e)'],
    [
      [
        'Deplacements professionnels',
        `${esg.business_travel_km ?? 0} km`,
        fmt(b3.travel ?? 0),
      ],
      [
        'Trajets domicile-travail',
        `${esg.commuting_employees ?? 0} empl. x ${esg.commuting_avg_km ?? 0} km`,
        fmt(b3.commuting ?? 0),
      ],
      [
        'Achats de biens et services',
        `${esg.purchased_goods_eur ?? 0} EUR`,
        fmt(b3.goods ?? 0),
      ],
      ['Dechets', `${esg.waste_tonnes ?? 0} tonnes`, fmt(b3.waste ?? 0)],
      ['Total Scope 3', '', fmt(data.scope3Kg)],
    ],
  );

  pdfService.addFooter(doc, 4);

  // Page 5: Circular economy + equivalences
  y = pdfService.addNewPageWithHeader(doc, headerTitle);

  y = pdfService.addSectionTitle(
    doc,
    'Economie circulaire -- Impact plateforme',
    y,
  );

  y = pdfService.addTable(
    doc,
    y,
    ['Indicateur', 'Valeur'],
    [
      ['Tonnes recyclees', `${data.platformTonnesRecycled.toFixed(1)} t`],
      ['CO2 evite', `${fmt(data.avoidedKg)} kg CO2e`],
      ['Transactions tracees', `${data.platformTransactionCount}`],
    ],
  );

  y = pdfService.addSectionTitle(doc, 'Equivalences visuelles', y);

  const treesEquiv = Math.round(data.totalKg / 22);
  const carsEquiv = (data.totalKg / 4600).toFixed(1);
  const flightsEquiv = Math.round(data.totalKg / 900);

  y = pdfService.addTable(
    doc,
    y,
    ['Equivalence', 'Valeur', 'Description'],
    [
      [
        'Arbres',
        `${treesEquiv}`,
        'arbres necessaires pour absorber vos emissions en 1 an',
      ],
      ['Voitures', carsEquiv, 'voitures roulant pendant 1 an (15 000 km)'],
      ['Vols', `${flightsEquiv}`, 'vols aller-retour Paris -- New York'],
    ],
  );

  pdfService.addFooter(doc, 5);

  // Page 6: Methodology
  y = pdfService.addNewPageWithHeader(doc, headerTitle);
  y = pdfService.addSectionTitle(doc, 'Methodologie', y);

  y = pdfService.addParagraph(
    doc,
    `Ce rapport a ete genere selon le format ${data.formatLabel} et les facteurs d'emission de la Base Carbone ADEME 2024.`,
    15,
    y,
    180,
  );

  const standards: Record<string, string> = {
    ghg_protocol: 'GHG Protocol : Corporate Standard & Scope 3 Standard',
    csrd: 'CSRD : Directive europeenne sur le reporting de durabilite\nESRS E1 : European Sustainability Reporting Standards -- Climate Change',
    gri: 'GRI 305 : Emissions\nGRI 306 : Dechets\nGRI 302 : Energie',
  };

  y = pdfService.addParagraph(
    doc,
    `Standards appliques :\n${standards[data.format] ?? standards.ghg_protocol}`,
    15,
    y,
    180,
  );

  y = pdfService.addParagraph(
    doc,
    "Perimetres :\n- Scope 1 : Emissions directes (combustion sur site, vehicules)\n- Scope 2 : Emissions indirectes liees a l'energie achetee\n- Scope 3 : Autres emissions indirectes (chaine de valeur)",
    15,
    y,
    180,
  );

  y = pdfService.addParagraph(
    doc,
    "Sources de donnees :\n- Donnees organisationnelles saisies par l'utilisateur\n- Donnees de recyclage tracees via la plateforme GreenEcoGenius\n- Facteurs d'emission : Base Carbone ADEME 2024",
    15,
    y,
    180,
  );

  y += 5;
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.gray);
  doc.setFont('helvetica', 'italic');

  const warningLines = doc.splitTextToSize(
    "Avertissement : Ce rapport est genere automatiquement a partir des donnees fournies par l'utilisateur. Il est fourni a titre indicatif et ne constitue pas un audit certifie. Pour un reporting officiel CSRD/GRI, nous recommandons une verification par un organisme tiers independant (OTI).",
    pw - 30,
  );
  doc.text(warningLines, 15, y);

  pdfService.addFooter(doc, 6);

  return pdfService.toBuffer(doc);
}

import { pdfService, COLORS } from '../pdf-service';

export interface RSEDiagnosticData {
  companyName: string;
  date: string;
  globalScore: number;
  pillarScores: Array<{
    name: string;
    score: number;
    details?: string;
  }>;
  strengths: string[];
  improvements: string[];
  labelEligibility: Array<{
    name: string;
    eligible: boolean;
    score: number;
    threshold: number;
  }>;
  roadmapActions: Array<{
    action: string;
    priority: 'haute' | 'moyenne' | 'basse';
    timeline: string;
  }>;
}

const LABELS = {
  en: {
    coverTitle: 'CSR DIAGNOSTIC & LABELS',
    coverSubtitle: 'Corporate social responsibility assessment',
    headerTitle: 'CSR Diagnostic & Labels',
    globalAndPillars: 'Global score and CSR pillars',
    globalScoreLabel: 'Global CSR Score',
    strengths: 'Strengths',
    improvements: 'Areas for improvement',
    labelEligibility: 'Label eligibility',
    thLabel: 'Label',
    thCurrentScore: 'Current score',
    thRequiredThreshold: 'Required threshold',
    thStatus: 'Status',
    eligible: 'Eligible',
    notEligible: 'Not eligible',
    roadmap: 'CSR Roadmap',
    thHash: '#',
    thAction: 'Action',
    thPriority: 'Priority',
    thDeadline: 'Deadline',
  },
  fr: {
    coverTitle: 'DIAGNOSTIC RSE & LABELS',
    coverSubtitle: 'Evaluation de la responsabilite societale',
    headerTitle: 'Diagnostic RSE & Labels',
    globalAndPillars: 'Score global et piliers RSE',
    globalScoreLabel: 'Score global RSE',
    strengths: 'Points forts',
    improvements: "Axes d'amelioration",
    labelEligibility: 'Eligibilite aux labels',
    thLabel: 'Label',
    thCurrentScore: 'Score actuel',
    thRequiredThreshold: 'Seuil requis',
    thStatus: 'Statut',
    eligible: 'Eligible',
    notEligible: 'Non eligible',
    roadmap: 'Feuille de route RSE',
    thHash: '#',
    thAction: 'Action',
    thPriority: 'Priorite',
    thDeadline: 'Echeance',
  },
} as const;

type Locale = keyof typeof LABELS;

export function generateRSEDiagnosticPDF(
  data: RSEDiagnosticData,
  locale: string = 'fr',
): ArrayBuffer {
  const labels =
    LABELS[(locale as Locale) in LABELS ? (locale as Locale) : 'fr'];
  const doc = pdfService.createDocument();
  const headerTitle = labels.headerTitle;

  // Cover page
  pdfService.addCoverPage(doc, {
    title: labels.coverTitle,
    subtitle: labels.coverSubtitle,
    organization: data.companyName,
    date: data.date,
    score: `${data.globalScore}/100`,
    locale,
  });

  // Page 2: Score overview
  let y = pdfService.addNewPageWithHeader(doc, headerTitle);
  y = pdfService.addSectionTitle(doc, labels.globalAndPillars, y);

  // Global score gauge
  pdfService.addScoreGauge(
    doc,
    data.globalScore,
    15,
    y,
    labels.globalScoreLabel,
  );
  y += 18;

  // Pillar scores
  for (const pillar of data.pillarScores) {
    y = pdfService.checkPageBreak(doc, y, 20, headerTitle);
    pdfService.addScoreGauge(doc, pillar.score, 15, y, pillar.name);
    y += 15;
    if (pillar.details) {
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.gray);
      doc.setFont('helvetica', 'normal');
      doc.text(pillar.details, 15, y);
      y += 6;
    }
  }

  pdfService.addFooter(doc, 2, undefined, locale);

  // Page 3: Strengths & improvements
  y = pdfService.addNewPageWithHeader(doc, headerTitle);
  y = pdfService.addSectionTitle(doc, labels.strengths, y);

  for (const strength of data.strengths) {
    y = pdfService.checkPageBreak(doc, y, 8, headerTitle);
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.green);
    doc.setFont('helvetica', 'bold');
    doc.text('+', 15, y);
    doc.setTextColor(...COLORS.black);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(strength, 165);
    doc.text(lines, 22, y);
    y += lines.length * 5 + 3;
  }

  y += 5;
  y = pdfService.addSectionTitle(doc, labels.improvements, y);

  for (const improvement of data.improvements) {
    y = pdfService.checkPageBreak(doc, y, 8, headerTitle);
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.yellow);
    doc.setFont('helvetica', 'bold');
    doc.text('!', 16, y);
    doc.setTextColor(...COLORS.black);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(improvement, 165);
    doc.text(lines, 22, y);
    y += lines.length * 5 + 3;
  }

  pdfService.addFooter(doc, 3, undefined, locale);

  // Page 4: Label eligibility
  y = pdfService.addNewPageWithHeader(doc, headerTitle);
  y = pdfService.addSectionTitle(doc, labels.labelEligibility, y);

  const labelRows = data.labelEligibility.map((l) => [
    l.name,
    `${l.score}/100`,
    `${l.threshold}/100`,
    l.eligible ? labels.eligible : labels.notEligible,
  ]);

  y = pdfService.addTable(
    doc,
    y,
    [
      labels.thLabel,
      labels.thCurrentScore,
      labels.thRequiredThreshold,
      labels.thStatus,
    ],
    labelRows,
  );

  // Label score gauges
  for (const label of data.labelEligibility) {
    y = pdfService.checkPageBreak(doc, y, 15, headerTitle);
    pdfService.addScoreGauge(doc, label.score, 15, y, label.name);
    y += 15;
  }

  pdfService.addFooter(doc, 4, undefined, locale);

  // Page 5: Roadmap
  if (data.roadmapActions.length > 0) {
    y = pdfService.addNewPageWithHeader(doc, headerTitle);
    y = pdfService.addSectionTitle(doc, labels.roadmap, y);

    const roadmapRows = data.roadmapActions.map((a, i) => [
      `${i + 1}`,
      a.action,
      a.priority.charAt(0).toUpperCase() + a.priority.slice(1),
      a.timeline,
    ]);

    y = pdfService.addTable(
      doc,
      y,
      [labels.thHash, labels.thAction, labels.thPriority, labels.thDeadline],
      roadmapRows,
      {
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 100 },
          2: { cellWidth: 30 },
          3: { cellWidth: 30 },
        },
      },
    );

    pdfService.addFooter(doc, 5, undefined, locale);
  }

  return pdfService.toArrayBuffer(doc);
}

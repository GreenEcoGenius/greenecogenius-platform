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

export function generateRSEDiagnosticPDF(data: RSEDiagnosticData): ArrayBuffer {
  const doc = pdfService.createDocument();
  const headerTitle = 'Diagnostic RSE & Labels';

  // Cover page
  pdfService.addCoverPage(doc, {
    title: 'DIAGNOSTIC RSE & LABELS',
    subtitle: 'Evaluation de la responsabilite societale',
    organization: data.companyName,
    date: data.date,
    score: `${data.globalScore}/100`,
  });

  // Page 2: Score overview
  let y = pdfService.addNewPageWithHeader(doc, headerTitle);
  y = pdfService.addSectionTitle(doc, 'Score global et piliers RSE', y);

  // Global score gauge
  pdfService.addScoreGauge(doc, data.globalScore, 15, y, 'Score global RSE');
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

  pdfService.addFooter(doc, 2);

  // Page 3: Strengths & improvements
  y = pdfService.addNewPageWithHeader(doc, headerTitle);
  y = pdfService.addSectionTitle(doc, 'Points forts', y);

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
  y = pdfService.addSectionTitle(doc, "Axes d'amelioration", y);

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

  pdfService.addFooter(doc, 3);

  // Page 4: Label eligibility
  y = pdfService.addNewPageWithHeader(doc, headerTitle);
  y = pdfService.addSectionTitle(doc, 'Eligibilite aux labels', y);

  const labelRows = data.labelEligibility.map((l) => [
    l.name,
    `${l.score}/100`,
    `${l.threshold}/100`,
    l.eligible ? 'Eligible' : 'Non eligible',
  ]);

  y = pdfService.addTable(
    doc,
    y,
    ['Label', 'Score actuel', 'Seuil requis', 'Statut'],
    labelRows,
  );

  // Label score gauges
  for (const label of data.labelEligibility) {
    y = pdfService.checkPageBreak(doc, y, 15, headerTitle);
    pdfService.addScoreGauge(doc, label.score, 15, y, label.name);
    y += 15;
  }

  pdfService.addFooter(doc, 4);

  // Page 5: Roadmap
  if (data.roadmapActions.length > 0) {
    y = pdfService.addNewPageWithHeader(doc, headerTitle);
    y = pdfService.addSectionTitle(doc, 'Feuille de route RSE', y);

    const roadmapRows = data.roadmapActions.map((a, i) => [
      `${i + 1}`,
      a.action,
      a.priority.charAt(0).toUpperCase() + a.priority.slice(1),
      a.timeline,
    ]);

    y = pdfService.addTable(
      doc,
      y,
      ['#', 'Action', 'Priorite', 'Echeance'],
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

    pdfService.addFooter(doc, 5);
  }

  return pdfService.toArrayBuffer(doc);
}

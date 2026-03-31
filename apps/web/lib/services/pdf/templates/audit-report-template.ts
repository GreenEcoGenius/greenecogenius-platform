import { pdfService, COLORS } from '../pdf-service';

interface NormAnalysis {
  name: string;
  pillar: string;
  status: 'conforme' | 'partiel' | 'non_conforme';
  severity: 'critique' | 'majeur' | 'mineur' | 'info';
  finding: string;
  recommendation: string;
}

export interface AuditReportData {
  companyName: string;
  date: string;
  score: number;
  normsCompliant: number;
  normsPartial: number;
  normsNonCompliant: number;
  normsTotal: number;
  criticalIssues: number;
  majorIssues: number;
  minorIssues: number;
  executiveSummary: string;
  norms: NormAnalysis[];
  pillars: Array<{ name: string; norms: string[] }>;
}

function statusLabel(status: string): string {
  switch (status) {
    case 'conforme':
      return 'Conforme';
    case 'partiel':
      return 'Partiel';
    case 'non_conforme':
      return 'Non conforme';
    default:
      return status;
  }
}

function severityLabel(severity: string): string {
  switch (severity) {
    case 'critique':
      return 'CRITIQUE';
    case 'majeur':
      return 'MAJEUR';
    case 'mineur':
      return 'MINEUR';
    default:
      return 'INFO';
  }
}

export function generateAuditReportPDF(data: AuditReportData): ArrayBuffer {
  const doc = pdfService.createDocument();
  const headerTitle = 'Rapport de Pre-Audit de Conformite';

  // Cover page
  pdfService.addCoverPage(doc, {
    title: 'RAPPORT DE PRE-AUDIT\nDE CONFORMITE',
    subtitle: `${data.normsTotal} normes analysees sur 6 piliers`,
    organization: data.companyName,
    date: data.date,
    score: `${data.score}%`,
  });

  // Page 2: Executive summary
  let y = pdfService.addNewPageWithHeader(doc, headerTitle);

  y = pdfService.addSectionTitle(doc, 'Synthese executive', y);
  y = pdfService.addParagraph(doc, data.executiveSummary, 15, y, 180);

  y += 5;

  // Summary table
  y = pdfService.addTable(
    doc,
    y,
    ['Indicateur', 'Valeur'],
    [
      ['Score global', `${data.score}%`],
      ['Normes conformes', `${data.normsCompliant} / ${data.normsTotal}`],
      ['Partiellement conformes', `${data.normsPartial}`],
      ['Non conformes', `${data.normsNonCompliant}`],
      ['Points critiques', `${data.criticalIssues}`],
      ['Points majeurs', `${data.majorIssues}`],
      ['Points mineurs', `${data.minorIssues}`],
    ],
    { title: 'Tableau de bord' },
  );

  pdfService.addFooter(doc, 2);

  // Pillar detail pages
  let pageNum = 3;

  for (const pillar of data.pillars) {
    const pillarNorms = data.norms.filter((n) => n.pillar === pillar.name);
    if (pillarNorms.length === 0) continue;

    const compliant = pillarNorms.filter((n) => n.status === 'conforme').length;
    const partial = pillarNorms.filter((n) => n.status === 'partiel').length;
    const pillarScore = Math.round(
      ((compliant + partial * 0.5) / pillarNorms.length) * 100,
    );

    y = pdfService.addNewPageWithHeader(doc, headerTitle);

    y = pdfService.addSectionTitle(
      doc,
      `${pillar.name} (${compliant}/${pillarNorms.length} -- ${pillarScore}%)`,
      y,
    );

    pdfService.addScoreGauge(doc, pillarScore, 15, y, '');
    y += 12;

    const rows = pillarNorms.map((n) => [
      n.name,
      statusLabel(n.status),
      severityLabel(n.severity),
      n.finding.substring(0, 60) + (n.finding.length > 60 ? '...' : ''),
      n.recommendation.substring(0, 60) +
        (n.recommendation.length > 60 ? '...' : ''),
    ]);

    y = pdfService.addTable(
      doc,
      y,
      ['Norme', 'Statut', 'Severite', 'Constat', 'Recommandation'],
      rows,
      {
        columnStyles: {
          0: { cellWidth: 28 },
          1: { cellWidth: 22 },
          2: { cellWidth: 22 },
          3: { cellWidth: 50 },
          4: { cellWidth: 50 },
        },
      },
    );

    pdfService.addFooter(doc, pageNum);
    pageNum++;
  }

  // Remediation plan
  const nonCompliantNorms = data.norms.filter((n) => n.status !== 'conforme');

  if (nonCompliantNorms.length > 0) {
    y = pdfService.addNewPageWithHeader(doc, headerTitle);
    y = pdfService.addSectionTitle(doc, 'Plan de remediation', y);

    const remRows = nonCompliantNorms.map((n, i) => [
      `${i + 1}`,
      n.name,
      n.pillar,
      severityLabel(n.severity),
      n.recommendation.substring(0, 50) +
        (n.recommendation.length > 50 ? '...' : ''),
      n.severity === 'critique'
        ? '1 mois'
        : n.severity === 'majeur'
          ? '3 mois'
          : '6 mois',
    ]);

    y = pdfService.addTable(
      doc,
      y,
      ['#', 'Norme', 'Pilier', 'Severite', 'Action corrective', 'Echeance'],
      remRows,
      {
        columnStyles: {
          0: { cellWidth: 8 },
          1: { cellWidth: 25 },
          2: { cellWidth: 30 },
          3: { cellWidth: 22 },
          4: { cellWidth: 60 },
          5: { cellWidth: 20 },
        },
      },
    );

    pdfService.addFooter(doc, pageNum);
    pageNum++;
  }

  // Methodology
  y = pdfService.addNewPageWithHeader(doc, headerTitle);
  y = pdfService.addSectionTitle(doc, 'Methodologie', y);

  y = pdfService.addParagraph(
    doc,
    `Ce rapport de pre-audit a ete genere par le moteur d'analyse GreenEcoGenius. L'evaluation couvre les ${data.normsTotal} normes du referentiel reparties en 6 piliers de conformite.`,
    15,
    y,
    180,
  );

  y = pdfService.addParagraph(
    doc,
    "Grille d'evaluation :\n- Conforme : L'exigence est pleinement respectee avec documentation a jour\n- Partiellement conforme : Des elements sont en place mais des lacunes subsistent\n- Non conforme : L'exigence n'est pas satisfaite, action corrective requise",
    15,
    y,
    180,
  );

  y = pdfService.addParagraph(
    doc,
    'Niveaux de severite :\n- Critique : Risque legal immediat, action sous 1 mois\n- Majeur : Risque significatif, action sous 3 mois\n- Mineur : Amelioration recommandee, action sous 6 mois\n- Info : Conforme, surveillance continue',
    15,
    y,
    180,
  );

  y += 5;
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.gray);
  doc.setFont('helvetica', 'italic');
  doc.text(
    'Ce pre-audit est indicatif et ne remplace pas un audit certifie par un organisme accredite.',
    15,
    y,
  );

  pdfService.addFooter(doc, pageNum);

  return pdfService.toArrayBuffer(doc);
}

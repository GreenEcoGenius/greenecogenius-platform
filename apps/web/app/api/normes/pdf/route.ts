import { NextRequest } from 'next/server';

import { NORMS_DATABASE, getLocalizedPillarInfo, localizeNorm } from '~/lib/data/norms-database';
import { pdfService, COLORS } from '~/lib/services/pdf/pdf-service';

const NORM_PDF_LABELS = {
  en: {
    type: 'Type',
    status: 'Status',
    pillar: 'Pillar',
    priority: 'Priority',
    year: 'Year',
    platformIntegration: 'Platform integration',
    integrated: 'Integrated',
    anticipated: 'Anticipated',
    planned: 'Planned',
    blockchainVerification: 'Blockchain verification: Yes',
    normDescription: 'Norm description',
    applicationInGEG: 'Application in GreenEcoGenius',
    platformSection: 'Platform section',
    platformSectionText: (section: string) =>
      `This norm is applied in the "${section}" section of the GreenEcoGenius platform.`,
    pillarLabel: (label: string) => `Pillar: ${label}`,
    dateLocale: 'en-GB' as const,
  },
  fr: {
    type: 'Type',
    status: 'Statut',
    pillar: 'Pilier',
    priority: 'Priorite',
    year: 'Annee',
    platformIntegration: 'Integration plateforme',
    integrated: 'Integree',
    anticipated: 'Anticipee',
    planned: 'Planifiee',
    blockchainVerification: 'Verification blockchain : Oui',
    normDescription: 'Description de la norme',
    applicationInGEG: 'Application dans GreenEcoGenius',
    platformSection: 'Section de la plateforme',
    platformSectionText: (section: string) =>
      `Cette norme est appliquee dans la section "${section}" de la plateforme GreenEcoGenius.`,
    pillarLabel: (label: string) => `Pilier : ${label}`,
    dateLocale: 'fr-FR' as const,
  },
} as const;

type NormLocale = keyof typeof NORM_PDF_LABELS;

export async function GET(req: NextRequest) {
  const normId = req.nextUrl.searchParams.get('id');
  const locale = (req.nextUrl.searchParams.get('locale') ?? 'fr') as string;

  if (!normId) {
    return new Response('Missing norm id', { status: 400 });
  }

  const rawNorm = NORMS_DATABASE.find((n) => n.id === normId);

  if (!rawNorm) {
    return new Response('Norm not found', { status: 404 });
  }

  const resolvedLocale = (locale as NormLocale) in NORM_PDF_LABELS ? (locale as NormLocale) : 'fr';
  const norm = localizeNorm(rawNorm, resolvedLocale);
  const labels = NORM_PDF_LABELS[resolvedLocale];
  const pillarInfo = getLocalizedPillarInfo(resolvedLocale)[norm.pillar];
  const doc = pdfService.createDocument();
  const pw = pdfService.pageWidth;

  // Cover page
  pdfService.addCoverPage(doc, {
    title: norm.reference,
    subtitle: norm.title,
    organization: 'GreenEcoGenius',
    date: new Date().toLocaleDateString(labels.dateLocale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    locale,
  });

  // Page 2: Norm detail
  let y = pdfService.addNewPageWithHeader(doc, norm.reference);

  // Norm reference
  doc.setFontSize(18);
  doc.setTextColor(...COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.text(norm.reference, 15, y);
  y += 8;

  // Title
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.black);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(norm.title, pw - 30);
  doc.text(titleLines, 15, y);
  y += titleLines.length * 5 + 8;

  // Metadata
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.gray);
  doc.setFont('helvetica', 'normal');

  const integrationLabel =
    norm.platformIntegration === 'integrated'
      ? labels.integrated
      : norm.platformIntegration === 'anticipated'
        ? labels.anticipated
        : labels.planned;

  const meta = [
    `${labels.type} : ${norm.typeLabel}`,
    `${labels.status} : ${norm.statusLabel}`,
    `${labels.pillar} : ${pillarInfo.label}`,
    `${labels.priority} : ${norm.priorityLabel}`,
    `${labels.year} : ${norm.year}`,
    `${labels.platformIntegration} : ${integrationLabel}`,
    norm.blockchainVerified ? labels.blockchainVerification : '',
  ].filter(Boolean);

  for (const line of meta) {
    doc.text(line, 15, y);
    y += 5;
  }

  y += 5;

  // Separator
  doc.setDrawColor(...COLORS.lightGray);
  doc.setLineWidth(0.3);
  doc.line(15, y, pw - 15, y);
  y += 10;

  // Description
  y = pdfService.addSectionTitle(doc, labels.normDescription, y);
  y = pdfService.addParagraph(doc, norm.description, 15, y, pw - 30);

  y += 5;

  // Application in GreenEcoGenius
  y = pdfService.addSectionTitle(doc, labels.applicationInGEG, y);
  y = pdfService.addParagraph(doc, norm.gegApplication, 15, y, pw - 30);

  y += 5;

  // Platform section
  y = pdfService.addSectionTitle(doc, labels.platformSection, y);
  y = pdfService.addParagraph(
    doc,
    labels.platformSectionText(norm.platformSection),
    15,
    y,
    pw - 30,
  );

  y += 5;

  // Pillar context
  y = pdfService.addSectionTitle(doc, labels.pillarLabel(pillarInfo.label), y);
  y = pdfService.addParagraph(doc, pillarInfo.description, 15, y, pw - 30);

  // Footer
  pdfService.addFooter(doc, 2, undefined, locale);

  const pdfBuffer = pdfService.toArrayBuffer(doc);
  const safeName = norm.reference.replace(/[^a-zA-Z0-9]/g, '_');

  return new Response(pdfBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Norme-${safeName}-GreenEcoGenius.pdf"`,
    },
  });
}

import { NextRequest } from 'next/server';

import { NORMS_DATABASE, PILLAR_INFO } from '~/lib/data/norms-database';
import { pdfService, COLORS } from '~/lib/services/pdf/pdf-service';

export async function GET(req: NextRequest) {
  const normId = req.nextUrl.searchParams.get('id');

  if (!normId) {
    return new Response('Missing norm id', { status: 400 });
  }

  const norm = NORMS_DATABASE.find((n) => n.id === normId);

  if (!norm) {
    return new Response('Norm not found', { status: 404 });
  }

  const pillarInfo = PILLAR_INFO[norm.pillar];
  const doc = pdfService.createDocument();
  const pw = pdfService.pageWidth;
  const ph = pdfService.pageHeight;

  // Cover page
  pdfService.addCoverPage(doc, {
    title: norm.reference,
    subtitle: norm.title,
    organization: 'GreenEcoGenius',
    date: new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
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

  const meta = [
    `Type : ${norm.typeLabel}`,
    `Statut : ${norm.statusLabel}`,
    `Pilier : ${pillarInfo.label}`,
    `Priorite : ${norm.priorityLabel}`,
    `Annee : ${norm.year}`,
    `Integration plateforme : ${norm.platformIntegration === 'integrated' ? 'Integree' : norm.platformIntegration === 'anticipated' ? 'Anticipee' : 'Planifiee'}`,
    norm.blockchainVerified ? 'Verification blockchain : Oui' : '',
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
  y = pdfService.addSectionTitle(doc, 'Description de la norme', y);
  y = pdfService.addParagraph(doc, norm.description, 15, y, pw - 30);

  y += 5;

  // Application in GreenEcoGenius
  y = pdfService.addSectionTitle(doc, 'Application dans GreenEcoGenius', y);
  y = pdfService.addParagraph(doc, norm.gegApplication, 15, y, pw - 30);

  y += 5;

  // Platform section
  y = pdfService.addSectionTitle(doc, 'Section de la plateforme', y);
  y = pdfService.addParagraph(
    doc,
    `Cette norme est appliquee dans la section "${norm.platformSection}" de la plateforme GreenEcoGenius.`,
    15,
    y,
    pw - 30,
  );

  y += 5;

  // Pillar context
  y = pdfService.addSectionTitle(doc, `Pilier : ${pillarInfo.label}`, y);
  y = pdfService.addParagraph(doc, pillarInfo.description, 15, y, pw - 30);

  // Footer
  pdfService.addFooter(doc, 2);

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

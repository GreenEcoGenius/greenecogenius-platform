import QRCode from 'qrcode';

import { pdfService, COLORS } from '../pdf-service';

export interface CertificateData {
  certNumber: string;
  lotId: string;
  material: string;
  qualityGrade?: string;
  weightKg: number;
  seller: string;
  buyer: string | null;
  origin: string;
  destination: string | null;
  co2AvoidedKg: number;
  hash: string;
  txHash: string | null;
  issuedAt: string;
  verificationUrl?: string;
  contractAddress?: string;
}

export async function generateCertificatePDF(
  data: CertificateData,
): Promise<ArrayBuffer> {
  const doc = pdfService.createDocument();
  const pw = pdfService.pageWidth;
  const ph = pdfService.pageHeight;

  // Top accent bar
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pw, 4, 'F');

  // Logo
  doc.setFontSize(22);
  doc.setTextColor(...COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.text('GreenEcoGenius', pw / 2, 25, { align: 'center' });

  // Title
  doc.setFontSize(18);
  doc.setTextColor(17, 24, 39);
  doc.text('CERTIFICAT DE TRACABILITE', pw / 2, 38, { align: 'center' });

  // Cert number
  doc.setFontSize(12);
  doc.setTextColor(107, 114, 128);
  doc.text(`N. ${data.certNumber}`, pw / 2, 46, { align: 'center' });

  // Separator
  doc.setDrawColor(229, 231, 235);
  doc.line(30, 52, pw - 30, 52);

  // Lot details
  let y = 62;
  y = pdfService.addKeyValue(doc, 'Lot', data.lotId, 20, y);
  y = pdfService.addKeyValue(
    doc,
    'Matiere',
    `${data.material}${data.qualityGrade ? ` -- Grade ${data.qualityGrade}` : ''}`,
    20,
    y,
  );
  y = pdfService.addKeyValue(
    doc,
    'Poids',
    `${(data.weightKg / 1000).toFixed(2)} tonnes (${data.weightKg.toLocaleString('fr-FR')} kg)`,
    20,
    y,
  );
  y = pdfService.addKeyValue(doc, 'Vendeur', data.seller, 20, y);
  y = pdfService.addKeyValue(doc, 'Acheteur', data.buyer ?? 'N/A', 20, y);
  y = pdfService.addKeyValue(doc, 'Origine', data.origin, 20, y);
  if (data.destination) {
    y = pdfService.addKeyValue(doc, 'Destination', data.destination, 20, y);
  }
  y = pdfService.addKeyValue(
    doc,
    'Date',
    new Date(data.issuedAt).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    20,
    y,
  );

  // Separator
  y += 5;
  doc.setDrawColor(229, 231, 235);
  doc.line(20, y, pw - 20, y);

  // Environmental impact
  y += 10;
  doc.setFontSize(12);
  doc.setTextColor(17, 24, 39);
  doc.setFont('helvetica', 'bold');
  doc.text('IMPACT ENVIRONNEMENTAL', 20, y);

  y += 12;
  doc.setFontSize(28);
  doc.setTextColor(...COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.text(`${(data.co2AvoidedKg / 1000).toFixed(2)} t CO2 evite`, 20, y);

  y += 8;
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.setFont('helvetica', 'normal');
  const kmEquiv = Math.round((data.co2AvoidedKg / 1000) * 4230);
  const treesEquiv = Math.round((data.co2AvoidedKg / 1000) * 50);
  doc.text(
    `Equivalent a ${kmEquiv.toLocaleString()} km en voiture evites ou ${treesEquiv} arbres plantes pendant 1 an`,
    20,
    y,
  );

  y += 5;
  doc.text('Methodologie : GHG Protocol + ADEME Base Carbone v2026', 20, y);

  // Blockchain proof
  y += 15;
  doc.setDrawColor(229, 231, 235);
  doc.line(20, y, pw - 20, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(17, 24, 39);
  doc.setFont('helvetica', 'bold');
  doc.text('PREUVE BLOCKCHAIN', 20, y);

  y += 7;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);

  if (data.txHash) {
    doc.text('Reseau : Polygon Mainnet (Chain ID: 137)', 20, y);
    y += 5;
    if (data.contractAddress) {
      doc.text(`Contrat : ${data.contractAddress}`, 20, y);
      y += 5;
    }
    doc.text(`Transaction : ${data.txHash}`, 20, y);
    y += 5;
  } else {
    doc.text(`Hash SHA-256 : ${data.hash.substring(0, 64)}`, 20, y);
    y += 5;
    doc.text(
      'Certificat hors-chaine. Enregistrement blockchain en attente.',
      20,
      y,
    );
    y += 5;
  }

  const verificationUrl =
    data.verificationUrl ??
    `https://greenecogenius.tech/verify/${data.hash.substring(0, 16)}`;
  doc.text(`Verification : ${verificationUrl}`, 20, y);

  // QR Code
  try {
    const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
      width: 200,
      margin: 1,
      color: { dark: '#111827', light: '#FFFFFF' },
    });
    doc.addImage(qrDataUrl, 'PNG', pw - 55, y - 18, 35, 35);
    doc.setFontSize(7);
    doc.text('Scanner pour verifier', pw - 50, y + 20);
  } catch {
    // QR generation failed, skip
  }

  // Footer
  const footerY = ph - 35;
  doc.setDrawColor(229, 231, 235);
  doc.line(20, footerY, pw - 20, footerY);

  let fy = footerY + 7;
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text(
    'Ce certificat atteste que le lot ci-dessus a ete trace de bout en bout.',
    20,
    fy,
  );
  fy += 4;
  doc.text('Les donnees sont immuables et verifiables publiquement.', 20, fy);
  fy += 6;
  doc.text(
    'Conforme : ISO 59014:2024 | Decret tracabilite n. 2021-321',
    20,
    fy,
  );
  fy += 6;
  doc.setFontSize(7);
  doc.text(
    `Emis le ${new Date().toLocaleDateString('fr-FR')} par GreenEcoGenius OU -- greenecogenius.tech`,
    20,
    fy,
  );

  // Bottom accent bar
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, ph - 4, pw, 4, 'F');

  return pdfService.toArrayBuffer(doc);
}

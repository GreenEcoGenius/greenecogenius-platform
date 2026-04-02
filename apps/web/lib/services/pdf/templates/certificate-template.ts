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

const LABELS = {
  en: {
    title: 'TRACEABILITY CERTIFICATE',
    lot: 'Lot',
    material: 'Material',
    grade: 'Grade',
    weight: 'Weight',
    seller: 'Seller',
    buyer: 'Buyer',
    origin: 'Origin',
    destination: 'Destination',
    date: 'Date',
    environmentalImpact: 'ENVIRONMENTAL IMPACT',
    co2Avoided: (t: string) => `${t} t CO2 avoided`,
    equivalentText: (km: string, trees: string) =>
      `Equivalent to ${km} km of car travel avoided or ${trees} trees planted for 1 year`,
    methodologyNote: 'Methodology: GHG Protocol + ADEME Base Carbone v2026',
    blockchainProof: 'BLOCKCHAIN PROOF',
    network: 'Network: Polygon Mainnet (Chain ID: 137)',
    contract: (addr: string) => `Contract: ${addr}`,
    transaction: (hash: string) => `Transaction: ${hash}`,
    hashSHA: (hash: string) => `SHA-256 Hash: ${hash}`,
    offChain: 'Off-chain certificate. Blockchain registration pending.',
    verification: (url: string) => `Verification: ${url}`,
    scanToVerify: 'Scan to verify',
    footerLine1:
      'This certificate attests that the above lot has been traced end-to-end.',
    footerLine2: 'Data is immutable and publicly verifiable.',
    footerCompliance:
      'Compliant: ISO 59014:2024 | Traceability decree no. 2021-321',
    issuedBy: (dateStr: string) =>
      `Issued on ${dateStr} by GreenEcoGenius, Inc. (Delaware, USA) · GreenEcoGenius OU (Estonia) -- greenecogenius.tech`,
    dateLocale: 'en-GB',
  },
  fr: {
    title: 'CERTIFICAT DE TRACABILITE',
    lot: 'Lot',
    material: 'Matiere',
    grade: 'Grade',
    weight: 'Poids',
    seller: 'Vendeur',
    buyer: 'Acheteur',
    origin: 'Origine',
    destination: 'Destination',
    date: 'Date',
    environmentalImpact: 'IMPACT ENVIRONNEMENTAL',
    co2Avoided: (t: string) => `${t} t CO2 evite`,
    equivalentText: (km: string, trees: string) =>
      `Equivalent a ${km} km en voiture evites ou ${trees} arbres plantes pendant 1 an`,
    methodologyNote: 'Methodologie : GHG Protocol + ADEME Base Carbone v2026',
    blockchainProof: 'PREUVE BLOCKCHAIN',
    network: 'Reseau : Polygon Mainnet (Chain ID: 137)',
    contract: (addr: string) => `Contrat : ${addr}`,
    transaction: (hash: string) => `Transaction : ${hash}`,
    hashSHA: (hash: string) => `Hash SHA-256 : ${hash}`,
    offChain: 'Certificat hors-chaine. Enregistrement blockchain en attente.',
    verification: (url: string) => `Verification : ${url}`,
    scanToVerify: 'Scanner pour verifier',
    footerLine1:
      'Ce certificat atteste que le lot ci-dessus a ete trace de bout en bout.',
    footerLine2: 'Les donnees sont immuables et verifiables publiquement.',
    footerCompliance:
      'Conforme : ISO 59014:2024 | Decret tracabilite n. 2021-321',
    issuedBy: (dateStr: string) =>
      `Emis le ${dateStr} par GreenEcoGenius OU (Estonie) · GreenEcoGenius, Inc. (Delaware, USA) -- greenecogenius.tech`,
    dateLocale: 'fr-FR',
  },
} as const;

type Locale = keyof typeof LABELS;

export async function generateCertificatePDF(
  data: CertificateData,
  locale: string = 'fr',
): Promise<ArrayBuffer> {
  const labels =
    LABELS[(locale as Locale) in LABELS ? (locale as Locale) : 'fr'];
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
  doc.text(labels.title, pw / 2, 38, { align: 'center' });

  // Cert number
  doc.setFontSize(12);
  doc.setTextColor(107, 114, 128);
  doc.text(`N. ${data.certNumber}`, pw / 2, 46, { align: 'center' });

  // Separator
  doc.setDrawColor(229, 231, 235);
  doc.line(30, 52, pw - 30, 52);

  // Lot details
  let y = 62;
  y = pdfService.addKeyValue(doc, labels.lot, data.lotId, 20, y);
  y = pdfService.addKeyValue(
    doc,
    labels.material,
    `${data.material}${data.qualityGrade ? ` -- ${labels.grade} ${data.qualityGrade}` : ''}`,
    20,
    y,
  );
  y = pdfService.addKeyValue(
    doc,
    labels.weight,
    `${(data.weightKg / 1000).toFixed(2)} tonnes (${data.weightKg.toLocaleString(labels.dateLocale)} kg)`,
    20,
    y,
  );
  y = pdfService.addKeyValue(doc, labels.seller, data.seller, 20, y);
  y = pdfService.addKeyValue(doc, labels.buyer, data.buyer ?? 'N/A', 20, y);
  y = pdfService.addKeyValue(doc, labels.origin, data.origin, 20, y);
  if (data.destination) {
    y = pdfService.addKeyValue(
      doc,
      labels.destination,
      data.destination,
      20,
      y,
    );
  }
  y = pdfService.addKeyValue(
    doc,
    labels.date,
    new Date(data.issuedAt).toLocaleDateString(labels.dateLocale, {
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
  doc.text(labels.environmentalImpact, 20, y);

  y += 12;
  doc.setFontSize(28);
  doc.setTextColor(...COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.text(labels.co2Avoided((data.co2AvoidedKg / 1000).toFixed(2)), 20, y);

  y += 8;
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.setFont('helvetica', 'normal');
  const kmEquiv = Math.round((data.co2AvoidedKg / 1000) * 4230);
  const treesEquiv = Math.round((data.co2AvoidedKg / 1000) * 50);
  doc.text(
    labels.equivalentText(kmEquiv.toLocaleString(), `${treesEquiv}`),
    20,
    y,
  );

  y += 5;
  doc.text(labels.methodologyNote, 20, y);

  // Blockchain proof
  y += 15;
  doc.setDrawColor(229, 231, 235);
  doc.line(20, y, pw - 20, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(17, 24, 39);
  doc.setFont('helvetica', 'bold');
  doc.text(labels.blockchainProof, 20, y);

  y += 7;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);

  if (data.txHash) {
    doc.text(labels.network, 20, y);
    y += 5;
    if (data.contractAddress) {
      doc.text(labels.contract(data.contractAddress), 20, y);
      y += 5;
    }
    doc.text(labels.transaction(data.txHash), 20, y);
    y += 5;
  } else {
    doc.text(labels.hashSHA(data.hash.substring(0, 64)), 20, y);
    y += 5;
    doc.text(labels.offChain, 20, y);
    y += 5;
  }

  const verificationUrl =
    data.verificationUrl ??
    `https://greenecogenius.tech/verify/${data.hash.substring(0, 16)}`;
  doc.text(labels.verification(verificationUrl), 20, y);

  // QR Code
  try {
    const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
      width: 200,
      margin: 1,
      color: { dark: '#111827', light: '#FFFFFF' },
    });
    doc.addImage(qrDataUrl, 'PNG', pw - 55, y - 18, 35, 35);
    doc.setFontSize(7);
    doc.text(labels.scanToVerify, pw - 50, y + 20);
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
  doc.text(labels.footerLine1, 20, fy);
  fy += 4;
  doc.text(labels.footerLine2, 20, fy);
  fy += 6;
  doc.text(labels.footerCompliance, 20, fy);
  fy += 6;
  doc.setFontSize(7);
  doc.text(
    labels.issuedBy(new Date().toLocaleDateString(labels.dateLocale)),
    20,
    fy,
  );

  // Bottom accent bar
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, ph - 4, pw, 4, 'F');

  return pdfService.toArrayBuffer(doc);
}

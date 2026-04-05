import 'server-only';

import { createHash, randomUUID } from 'crypto';

import jsPDF from 'jspdf';

import { pdfService } from '~/lib/services/pdf/pdf-service';

import {
  CO2_AVOIDED_FACTORS,
  normalizeMaterialCategory,
} from '~/lib/config/co2-factors';

/**
 * Contract PDF service — generates the legal sale contract for a marketplace
 * transaction using jspdf. Re-uses pdfService helpers (footer, colors) so
 * every contract carries the bilingual GreenEcoGenius footer required by the
 * project rules.
 *
 * The service is PURE with respect to its inputs — database reads are the
 * caller's responsibility. This keeps it trivial to unit-test and callable
 * from both server actions and webhook handlers.
 */

export interface ContractPartyInput {
  /** Account id (uuid) — used in the contract reference hash */
  id: string;
  /** Company / personal account name */
  name: string;
  /** Primary email (used by the signature provider for envelope routing) */
  email: string;
  /** Optional — if the account has a legal name separate from display name */
  legal_name?: string | null;
  siret?: string | null;
  address?: string | null;
  contact_name?: string | null;
}

export interface ContractTransactionInput {
  id: string;
  material_category: string;
  material_subcategory?: string | null;
  volume_tonnes: number;
  /** Price per tonne in major currency units (e.g. EUR) */
  price_per_tonne: number;
  currency: string;
  origin_region?: string | null;
  destination_region?: string | null;
  delivery_date?: string | null;
  transport_by?: string | null;
  created_at?: string | null;
}

export interface GeneratedContract {
  /** Human-readable contract reference, e.g. CTR-2026-AB12C */
  contractId: string;
  /** The raw PDF bytes */
  pdfBuffer: Buffer;
  /** SHA-256 of the unsigned PDF, hex-encoded */
  sha256: string;
  /** Total price in major currency units */
  totalPrice: number;
  /** CO₂ avoided estimate in tCO₂e */
  co2AvoidedTonnes: number;
  /** Recommended storage key under the contracts bucket */
  storagePath: string;
}

const PAGE_MARGIN_X = 20;

function fmtDate(d: string | Date | null | undefined): string {
  if (!d) return 'A convenir entre les parties';
  const date = typeof d === 'string' ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return 'A convenir entre les parties';
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function fmtMoney(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function buildContractId(transactionId: string): string {
  const suffix = transactionId.replace(/-/g, '').slice(-5).toUpperCase();
  return `CTR-${new Date().getFullYear()}-${suffix}`;
}

function getCo2Factor(category: string): number {
  const key = normalizeMaterialCategory(category);
  if (!key) return 0;
  return CO2_AVOIDED_FACTORS[key]?.co2_avoided_per_tonne ?? 0;
}

function sectionTitle(doc: jsPDF, text: string, y: number): number {
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(text, PAGE_MARGIN_X, y);
  return y + 8;
}

function paragraph(doc: jsPDF, lines: string[], y: number, xOffset = 5): number {
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(55, 65, 81);
  const x = PAGE_MARGIN_X + xOffset;
  for (const line of lines) {
    doc.text(line, x, y);
    y += 6;
  }
  return y;
}

function labelValue(
  doc: jsPDF,
  label: string,
  value: string,
  y: number,
): number {
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(label, PAGE_MARGIN_X + 5, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(55, 65, 81);
  doc.text(value, PAGE_MARGIN_X + 55, y);
  return y + 6;
}

function partyBlock(
  doc: jsPDF,
  heading: string,
  party: ContractPartyInput,
  y: number,
): number {
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(5, 150, 105);
  doc.text(heading, PAGE_MARGIN_X + 5, y);
  y += 6;

  const displayName = party.legal_name || party.name;
  const representedBy = party.contact_name || party.name;

  y = labelValue(doc, 'Raison sociale', displayName, y);
  y = labelValue(doc, 'SIRET', party.siret || 'A completer', y);
  y = labelValue(doc, 'Adresse', party.address || 'A completer', y);
  y = labelValue(doc, 'Represente par', representedBy, y);
  y = labelValue(doc, 'Email', party.email, y);
  return y + 4;
}

function signatureBox(
  doc: jsPDF,
  heading: string,
  party: ContractPartyInput,
  x: number,
  y: number,
) {
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(heading, x, y);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(55, 65, 81);
  doc.text(party.legal_name || party.name, x, y + 7);
  doc.text(
    `Represente par : ${party.contact_name || party.name}`,
    x,
    y + 13,
  );

  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.rect(x - 2, y + 18, 72, 28);

  doc.setFontSize(7);
  doc.setTextColor(107, 114, 128);
  doc.text(
    'Signature electronique DocuSign — eIDAS / ESIGN Act',
    x,
    y + 51,
  );
}

export const ContractService = {
  /**
   * Generate a brand new contract PDF for a transaction. Does not persist
   * anything — callers decide where to upload and which database row to
   * update. Returns the raw buffer plus metadata (contract id, hash, total,
   * CO₂, recommended storage path).
   */
  generate(
    transaction: ContractTransactionInput,
    seller: ContractPartyInput,
    buyer: ContractPartyInput,
  ): GeneratedContract {
    const doc = pdfService.createDocument();
    const contractId = buildContractId(transaction.id);
    const totalPrice = transaction.volume_tonnes * transaction.price_per_tonne;
    const co2Factor = getCo2Factor(transaction.material_category);
    const co2Avoided = transaction.volume_tonnes * co2Factor;
    const today = new Date();

    // ── Page 1 ─────────────────────────────────────────────────────
    // Top accent bar
    doc.setFillColor(5, 150, 105);
    doc.rect(0, 0, 210, 3, 'F');

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text('Contrat de vente de matieres recyclables', 105, 22, {
      align: 'center',
    });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text(
      "Genere par GreenEcoGenius — Plateforme B2B d'economie circulaire",
      105,
      29,
      { align: 'center' },
    );
    doc.text(`Reference : ${contractId}`, 105, 35, { align: 'center' });
    doc.text(`Etabli le ${fmtDate(today)}`, 105, 41, { align: 'center' });

    let y = 54;

    y = sectionTitle(doc, 'Article 1 — Parties', y);
    y = partyBlock(doc, 'LE VENDEUR', seller, y);
    y = partyBlock(doc, "L'ACHETEUR", buyer, y);

    y = sectionTitle(doc, 'Article 2 — Objet du contrat', y);
    y = paragraph(
      doc,
      [
        "Le Vendeur cede a l'Acheteur les matieres recyclables decrites ci-dessous,",
        'conformement a l\'annonce publiee sur la plateforme GreenEcoGenius.',
      ],
      y,
    );
    y += 2;
    y = labelValue(doc, 'Categorie', transaction.material_category, y);
    if (transaction.material_subcategory) {
      y = labelValue(doc, 'Sous-categorie', transaction.material_subcategory, y);
    }
    y = labelValue(doc, 'Volume', `${transaction.volume_tonnes} tonnes`, y);
    y = labelValue(
      doc,
      'Prix unitaire',
      `${fmtMoney(transaction.price_per_tonne, transaction.currency)} / tonne HT`,
      y,
    );
    y = labelValue(
      doc,
      'Prix total',
      `${fmtMoney(totalPrice, transaction.currency)} HT`,
      y,
    );
    y += 4;

    y = sectionTitle(doc, 'Article 3 — Livraison', y);
    y = labelValue(doc, 'Lieu de depart', transaction.origin_region || 'A convenir', y);
    y = labelValue(
      doc,
      'Lieu de livraison',
      transaction.destination_region || 'A convenir',
      y,
    );
    y = labelValue(doc, 'Date prevue', fmtDate(transaction.delivery_date), y);
    y = labelValue(
      doc,
      'Transport',
      transaction.transport_by || 'A convenir entre les parties',
      y,
    );

    pdfService.addFooter(doc, 1, 3, 'fr');

    // ── Page 2 ─────────────────────────────────────────────────────
    doc.addPage();
    y = 25;

    y = sectionTitle(doc, 'Article 4 — Paiement', y);
    y = labelValue(doc, 'Montant', `${fmtMoney(totalPrice, transaction.currency)} HT`, y);
    y = labelValue(
      doc,
      'Mode',
      'Virement bancaire ou escrow via la plateforme GreenEcoGenius',
      y,
    );
    y = labelValue(doc, 'Delai', '30 jours a compter de la livraison', y);
    y += 4;

    y = sectionTitle(doc, 'Article 5 — Qualite et conformite', y);
    y = paragraph(
      doc,
      [
        'Le Vendeur garantit que les matieres livrees sont conformes a la',
        'description publiee sur la plateforme GreenEcoGenius (categorie, qualite,',
        "etat). En cas de non-conformite constatee a la livraison, l'Acheteur",
        'dispose de 48 heures pour notifier le Vendeur et la plateforme.',
      ],
      y,
    );
    y += 4;

    y = sectionTitle(doc, 'Article 6 — Tracabilite et certification blockchain', y);
    y = paragraph(
      doc,
      [
        'Les parties acceptent que les donnees de cette transaction soient',
        'enregistrees de maniere immuable sur la blockchain Polygon (Mainnet)',
        'par GreenEcoGenius. Les donnees certifiees incluent : identite des',
        'parties, matiere, volume, prix, CO2 evite calcule selon les facteurs',
        'de la Base Carbone ADEME. Un certificat de tracabilite est remis aux',
        'deux parties, verifiable via QR code et Polygonscan.',
      ],
      y,
    );
    y += 4;

    y = sectionTitle(doc, 'Article 7 — Impact environnemental', y);
    if (co2Factor > 0) {
      y = labelValue(
        doc,
        'CO2 evite estime',
        `${co2Avoided.toFixed(2)} tCO2e`,
        y,
      );
      y = labelValue(
        doc,
        'Facteur ADEME',
        `${co2Factor} tCO2e / tonne (Base Carbone)`,
        y,
      );
    } else {
      y = paragraph(
        doc,
        [
          "Le CO2 evite sera calcule apres livraison a partir des facteurs officiels",
          'de la Base Carbone ADEME et inscrit dans le certificat de tracabilite.',
        ],
        y,
      );
    }
    y += 4;

    y = sectionTitle(doc, 'Article 8 — Droit applicable et juridiction', y);
    y = paragraph(
      doc,
      [
        'Le present contrat est regi par le droit francais. En cas de litige,',
        "les parties s'engagent a rechercher une solution amiable. A defaut, le",
        'litige sera soumis aux tribunaux competents de Montpellier.',
      ],
      y,
    );

    pdfService.addFooter(doc, 2, 3, 'fr');

    // ── Page 3 : Signatures ───────────────────────────────────────
    doc.addPage();
    y = 25;

    y = sectionTitle(doc, 'Signatures electroniques', y);
    y = paragraph(
      doc,
      [
        `Fait sur la plateforme GreenEcoGenius le ${fmtDate(today)}.`,
        'Ce contrat est signe electroniquement par les deux parties via DocuSign,',
        'conformement au reglement eIDAS (UE) et au ESIGN Act (USA).',
      ],
      y,
    );
    y += 10;

    signatureBox(doc, 'Le Vendeur', seller, PAGE_MARGIN_X + 5, y);
    signatureBox(doc, "L'Acheteur", buyer, 115, y);

    pdfService.addFooter(doc, 3, 3, 'fr');

    // Output as Node Buffer
    const arrayBuffer = doc.output('arraybuffer');
    const pdfBuffer = Buffer.from(arrayBuffer);
    const sha256 = createHash('sha256').update(pdfBuffer).digest('hex');

    return {
      contractId,
      pdfBuffer,
      sha256,
      totalPrice,
      co2AvoidedTonnes: co2Avoided,
      storagePath: `${transaction.id}/${contractId}-${randomUUID()}.pdf`,
    };
  },
};

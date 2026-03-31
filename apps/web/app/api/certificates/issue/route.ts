import { NextRequest, NextResponse } from 'next/server';

import * as z from 'zod';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { computeDataHash } from '~/lib/blockchain/alchemy-service';
import { getLotById } from '~/lib/mock/traceability-mock-data';

const IssueSchema = z.object({
  lotIds: z.array(z.string()).min(1).max(50),
});

function generateCertNumber(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `CERT-2026-${num}`;
}

function generateCertificateHtml(params: {
  certNumber: string;
  lotId: string;
  material: string;
  weightKg: number;
  seller: string;
  buyer: string | null;
  origin: string;
  destination: string | null;
  co2Avoided: number;
  hash: string;
  txHash: string | null;
  issuedAt: string;
}): string {
  const {
    certNumber,
    lotId,
    material,
    weightKg,
    seller,
    buyer,
    origin,
    destination,
    co2Avoided,
    hash,
    txHash,
    issuedAt,
  } = params;

  const blockchainSection = txHash
    ? `
      <div style="margin-top:24px;padding:16px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;">
        <h3 style="margin:0 0 8px;color:#166534;font-size:14px;">Preuve Blockchain</h3>
        <p style="margin:4px 0;font-size:12px;color:#374151;">
          <strong>Transaction:</strong>
          <a href="https://polygonscan.com/tx/${txHash}" target="_blank" style="color:#2563eb;word-break:break-all;">${txHash}</a>
        </p>
        <p style="margin:4px 0;font-size:12px;color:#374151;">
          <strong>Hash SHA-256:</strong> <span style="font-family:monospace;word-break:break-all;">${hash}</span>
        </p>
      </div>`
    : `
      <div style="margin-top:24px;padding:16px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;">
        <h3 style="margin:0 0 8px;color:#1e40af;font-size:14px;">Empreinte numerique</h3>
        <p style="margin:4px 0;font-size:12px;color:#374151;">
          <strong>Hash SHA-256:</strong> <span style="font-family:monospace;word-break:break-all;">${hash}</span>
        </p>
        <p style="margin:4px 0;font-size:11px;color:#6b7280;">
          Certificat hors-chaine. L'enregistrement blockchain sera effectue lorsque le contrat sera configure.
        </p>
      </div>`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Certificat ${certNumber}</title>
  <style>
    @media print { body { margin: 0; } .no-print { display: none; } }
    body { font-family: 'Segoe UI', system-ui, sans-serif; margin: 0; padding: 0; background: #f9fafb; }
    .container { max-width: 800px; margin: 40px auto; background: white; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); overflow: hidden; }
    .header { background: linear-gradient(135deg, #059669, #0d9488); padding: 40px; text-align: center; color: white; }
    .header h1 { margin: 0; font-size: 28px; letter-spacing: 1px; }
    .header p { margin: 8px 0 0; font-size: 14px; opacity: 0.9; }
    .cert-number { display: inline-block; margin-top: 16px; padding: 8px 24px; background: rgba(255,255,255,0.2); border-radius: 20px; font-size: 18px; font-weight: 600; letter-spacing: 2px; }
    .body { padding: 40px; }
    .section { margin-bottom: 24px; }
    .section h2 { font-size: 16px; color: #059669; margin: 0 0 12px; padding-bottom: 8px; border-bottom: 2px solid #d1fae5; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .field { padding: 12px; background: #f9fafb; border-radius: 8px; }
    .field-label { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .field-value { font-size: 15px; color: #111827; font-weight: 500; }
    .co2-highlight { text-align: center; padding: 24px; background: linear-gradient(135deg, #ecfdf5, #f0fdf4); border-radius: 12px; border: 2px solid #a7f3d0; }
    .co2-value { font-size: 36px; font-weight: 700; color: #059669; }
    .co2-label { font-size: 13px; color: #374151; margin-top: 4px; }
    .qr-placeholder { text-align: center; padding: 24px; margin-top: 24px; border: 2px dashed #d1d5db; border-radius: 8px; color: #9ca3af; font-size: 12px; }
    .footer { text-align: center; padding: 24px 40px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 11px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>GreenEcoGenius</h1>
      <p>Certificat de Tracabilite Environnementale</p>
      <div class="cert-number">${certNumber}</div>
    </div>

    <div class="body">
      <div class="section">
        <h2>Details du lot</h2>
        <div class="grid">
          <div class="field">
            <div class="field-label">Reference lot</div>
            <div class="field-value">${lotId}</div>
          </div>
          <div class="field">
            <div class="field-label">Materiau</div>
            <div class="field-value" style="text-transform:capitalize;">${material}</div>
          </div>
          <div class="field">
            <div class="field-label">Poids</div>
            <div class="field-value">${weightKg.toLocaleString('fr-FR')} kg</div>
          </div>
          <div class="field">
            <div class="field-label">Vendeur</div>
            <div class="field-value">${seller}</div>
          </div>
          <div class="field">
            <div class="field-label">Acheteur</div>
            <div class="field-value">${buyer ?? 'N/A'}</div>
          </div>
          <div class="field">
            <div class="field-label">Origine</div>
            <div class="field-value">${origin}</div>
          </div>
          ${
            destination
              ? `<div class="field">
            <div class="field-label">Destination</div>
            <div class="field-value">${destination}</div>
          </div>`
              : ''
          }
          <div class="field">
            <div class="field-label">Date d'emission</div>
            <div class="field-value">${new Date(issuedAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Impact environnemental</h2>
        <div class="co2-highlight">
          <div class="co2-value">${(co2Avoided / 1000).toFixed(2)} t</div>
          <div class="co2-label">CO2 evite grace au recyclage</div>
        </div>
      </div>

      ${blockchainSection}

      <div class="qr-placeholder">
        <p>[ Emplacement QR Code ]</p>
        <p>Scanner pour verifier l'authenticite du certificat</p>
      </div>
    </div>

    <div class="footer">
      <p>Ce certificat atteste de la tracabilite du lot reference ci-dessus sur la plateforme GreenEcoGenius.</p>
      <p>Emis le ${new Date(issuedAt).toLocaleDateString('fr-FR')} | Plateforme GreenEcoGenius | ${certNumber}</p>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  const client = getSupabaseServerClient();
  const { data: user, error: authError } = await requireUser(client);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = IssueSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { lotIds } = parsed.data;
  const issuedAt = new Date().toISOString();
  const blockchainConfigured = Boolean(
    process.env.CONTRACT_ADDRESS && process.env.DEPLOYER_PRIVATE_KEY,
  );

  const certificates: Array<{
    lotId: string;
    certNumber: string;
    hash: string;
    txHash: string | null;
    downloadUrl: string;
  }> = [];

  for (const lotId of lotIds) {
    const lot = getLotById(lotId);

    if (!lot) {
      continue;
    }

    const certNumber = generateCertNumber();

    const certData = {
      certNumber,
      lotId: lot.lotId,
      material: lot.materialType,
      weightKg: lot.weightKg,
      seller: lot.sellerName,
      buyer: lot.buyerName,
      origin: lot.originCity,
      destination: lot.destinationCity,
      co2Avoided: lot.co2AvoidedKg,
      issuedAt,
      platform: 'GreenEcoGenius',
    };

    const hash = computeDataHash(certData);

    let txHash: string | null = null;

    if (blockchainConfigured) {
      try {
        const { issueCertificateOnChain } = await import(
          '~/lib/blockchain/alchemy-service'
        );

        const result = await issueCertificateOnChain(lot.lotId, certData);
        txHash = result.txHash;
      } catch (err) {
        console.error(
          `Blockchain issuance failed for ${lotId}, continuing off-chain:`,
          err,
        );
      }
    }

    const html = generateCertificateHtml({
      certNumber,
      lotId: lot.lotId,
      material: lot.materialType,
      weightKg: lot.weightKg,
      seller: lot.sellerName,
      buyer: lot.buyerName,
      origin: lot.originCity,
      destination: lot.destinationCity,
      co2Avoided: lot.co2AvoidedKg,
      hash,
      txHash,
      issuedAt,
    });

    // Encode the HTML as a data URL for download
    const base64Html = Buffer.from(html).toString('base64');
    const downloadUrl = `data:text/html;base64,${base64Html}`;

    certificates.push({
      lotId: lot.lotId,
      certNumber,
      hash,
      txHash,
      downloadUrl,
    });
  }

  return NextResponse.json({ certificates });
}
